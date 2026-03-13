# R2 스토리지 + Supabase Edge Function 아키텍처

## 목차
1. [개요](#개요)
2. [아키텍처 다이어그램](#아키텍처-다이어그램)
3. [핵심 컴포넌트](#핵심-컴포넌트)
4. [보안 모델](#보안-모델)
5. [업로드 흐름](#업로드-흐름)
6. [조회 흐름](#조회-흐름)
7. [삭제 흐름](#삭제-흐름)
8. [파일 제한사항](#파일-제한사항)
9. [환경변수](#환경변수)
10. [디렉토리 구조](#디렉토리-구조)
11. [트러블슈팅](#트러블슈팅)

---

## 개요

본 프로젝트는 Cloudflare R2(S3 호환 객체 스토리지)를 이용하여 수속 신청 문서(PDF, 이미지)를 안전하게 저장하고 관리합니다. Supabase Edge Function을 통해 백엔드 로직을 처리하고, Supabase PostgreSQL 데이터베이스에 메타데이터를 기록합니다.

### 핵심 특징

- **Presigned URL 기반 업로드**: 클라이언트가 직접 R2에 업로드 (브라우저 → R2)
- **JWT 기반 인증**: 모든 요청은 Supabase 토큰으로 인증
- **소유권 검증**: 사용자가 해당 수속 신청에 대한 권한이 있는지 확인
- **이미지 압축**: 업로드 전 클라이언트 사이드에서 이미지 자동 압축
- **병렬 처리**: 삭제 시 R2 파일 삭제 + DB 레코드 삭제를 동시 실행

---

## 아키텍처 다이어그램

### 전체 시스템 구조

```
┌─────────────────────────────────────────────────────────────────┐
│                      브라우저 (클라이언트)                        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ React Component (DocumentUploadCard)                      │  │
│  │ - 파일 선택                                              │  │
│  │ - 이미지 압축 (compressIfImage)                          │  │
│  │ - useUploadDocument 훅 호출                              │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────┬──────────────────────────────────────────────────────┬─┘
         │                                                        │
         │ 1. 압축                                              │
         │ 2. presigned URL 요청                                │
         │                                                        │
         ▼                                                        ▼
┌──────────────────────────────┐          ┌─────────────────────────────┐
│  Supabase Edge Function       │          │  Cloudflare R2              │
│  (storage-presign)            │          │                             │
│                               │          │ ┌─────────────────────────┐ │
│ 1. JWT 검증                   │          │ │ enrollments/documents/ │ │
│ 2. 파일 크기/타입 검증        │          │ │ {enrollmentId}/        │ │
│ 3. 소유권 검증                │          │ │ {uuid}_{fileName}      │ │
│ 4. Presigned URL 생성        │          │ └─────────────────────────┘ │
│                               │          │                             │
└─────────┬─────────────────────┘          │ (PUT 업로드)                │
          │                                │ (GET 조회)                  │
          │ uploadUrl + objectKey          │ (DELETE 삭제)               │
          │                                │                             │
          └──────────────────────────────▶ └─────────────────────────────┘
                                                  │
                                                  │ 3. 업로드 완료
                                                  │ 4. DB 저장
                                                  ▼
                                           ┌─────────────────────────────┐
                                           │  Supabase PostgreSQL        │
                                           │                             │
                                           │ enrollment_documents 테이블 │
                                           │ - id                        │
                                           │ - enrollment_id (FK)        │
                                           │ - document_type             │
                                           │ - file_name                 │
                                           │ - file_url                  │
                                           │ - file_size                 │
                                           │ - mime_type                 │
                                           │ - created_at                │
                                           └─────────────────────────────┘
```

### 삭제 흐름

```
┌─────────────┐
│   클라이언트  │
│ (삭제 버튼)  │
└────┬────────┘
     │
     │ documentId, fileUrl
     ▼
┌──────────────────────────────────┐
│ Supabase Edge Function           │
│ action: delete                   │
│                                  │
│ 1. JWT 검증                      │
│ 2. 문서 존재 확인                │
│ 3. 소유권 검증                   │
│ 4. Promise.all() 병렬 처리      │
└──┬─────────────────────────┬──┬──┘
   │                         │  │
   │                         │  └────────────────────────┐
   ▼                         ▼                            ▼
┌────────────┐      ┌──────────────────┐      ┌───────────────────┐
│ Cloudflare │      │ Supabase Service │      │ Supabase anon key │
│ R2         │      │ Role Client      │      │ 클라이언트 검증    │
│ DELETE     │      │ (admin 권한)     │      │ 재확인             │
│ objectKey  │      │ enrollment_      │      │                    │
│            │      │ documents.delete │      │                    │
└────────────┘      └──────────────────┘      └───────────────────┘
```

---

## 핵심 컴포넌트

### 1. Supabase Edge Function (storage-presign)

**위치**: `/supabase/functions/storage-presign/index.ts`

Cloudflare Workers 기반의 서버리스 함수로, 다음 3가지 작업을 수행합니다.

#### 1.1 Upload Action

**요청**:
```typescript
{
  action: "upload",
  fileName: string,          // 원본 파일명
  fileSize: number,         // 바이트 단위 파일 크기
  mimeType: string,         // MIME 타입 (image/jpeg, application/pdf 등)
  enrollmentId: string      // 수속 신청 ID
}
```

**검증 프로세스**:
1. JWT 토큰 검증 (Authorization 헤더)
2. 파일 크기 확인 (최대 10MB)
3. MIME 타입 확인 (PDF, JPEG, PNG, WebP만 허용)
4. Enrollment 소유권 확인 (user_id 매칭)

**반환**:
```typescript
{
  uploadUrl: string,        // AWS4 서명된 PUT URL (1시간 유효)
  objectKey: string         // R2 내 경로 (enrollments/documents/{enrollmentId}/{uuid}_{fileName})
}
```

**S3 Presigned URL 동작**:
- `X-Amz-Expires`: 3600 (1시간)
- HTTP 메서드: PUT
- Content-Type 헤더 포함
- Query parameter 기반 서명 (AWS Signature Version 4)

#### 1.2 View Action

**요청**:
```typescript
{
  action: "view",
  objectKey: string         // R2 객체 경로
}
```

**검증 프로세스**:
1. JWT 토큰 검증
2. objectKey로 enrollment_documents 조인 조회
3. 연관된 enrollment의 user_id 확인 (소유권 검증)

**반환**:
```typescript
{
  viewUrl: string           // AWS4 서명된 GET URL (15분 유효)
}
```

**특징**:
- `X-Amz-Expires`: 900 (15분 - 업로드보다 짧음)
- 브라우저 직접 미리보기 가능
- 공개 URL 사용 금지 (서명된 URL만 허용)

#### 1.3 Delete Action

**요청**:
```typescript
{
  action: "delete",
  objectKey: string,        // R2 객체 경로
  documentId: string        // DB 문서 레코드 ID
}
```

**검증 프로세스**:
1. JWT 토큰 검증
2. documentId로 enrollment_documents 조인 조회
3. 연관된 enrollment의 user_id 확인

**병렬 삭제**:
```typescript
Promise.all([
  fetch(signedDeleteUrl, { method: "DELETE" }),    // R2 파일 삭제
  adminClient.from("enrollment_documents").delete()  // DB 레코드 삭제
])
```

**오류 처리**:
- R2 404 에러는 정상 처리 (파일이 없어도 성공)
- 중복 삭제 시나리오 고려
- DB 삭제 실패 시 500 에러 반환

---

### 2. 클라이언트 API 레이어

**위치**: `/src/api/storage/presign.ts`

Supabase Functions 클라이언트 호출 함수들을 제공합니다.

#### getUploadPresignedUrl

```typescript
async function getUploadPresignedUrl(
  params: UploadPresignParams
): Promise<{ data: UploadPresignResponse | null; error: string | null }>
```

**동작**:
1. `supabase.functions.invoke("storage-presign")` 호출
2. Edge Function의 응답 파싱
3. 에러 시 사용자 친화적 메시지 반환

#### deleteDocumentFromR2

```typescript
async function deleteDocumentFromR2(
  objectKey: string,
  documentId: string
): Promise<{ error: string | null }>
```

**동작**:
1. Edge Function에 delete action 요청
2. 병렬 삭제 대기
3. 성공 여부 반환

---

### 3. React Hooks

**위치**: `/src/hooks/useEnrollment.ts`

#### useEnrollment

```typescript
function useEnrollment(id: string | undefined): {
  enrollment: Enrollment | null;
  documents: EnrollmentDocument[];
  loading: boolean;
  error: string | null;
}
```

**동작**:
- React Query를 이용한 수속 신청 + 문서 목록 조회
- `queryKey`: `["enrollment", id]`
- 자동 캐싱 및 재검증

#### useUploadDocument

```typescript
function useUploadDocument(enrollmentId: string): UseMutationResult<
  EnrollmentDocument,
  Error,
  UploadDocumentParams
>
```

**3단계 업로드 프로세스**:

1. **압축 + Presigned URL 병렬 요청**
   ```typescript
   const [compressed, presignResult] = await Promise.all([
     compressIfImage(file),
     getUploadPresignedUrl({ ... })
   ])
   ```

2. **R2 직접 업로드**
   ```typescript
   const uploadResult = await uploadDocumentToR2(compressed, uploadUrl)
   ```

3. **DB 레코드 저장**
   ```typescript
   const publicFileUrl = `${R2_PUBLIC_URL}/${objectKey}`
   const saveResult = await saveDocumentRecord({
     enrollment_id: enrollmentId,
     document_type: documentType,
     file_url: publicFileUrl,  // 공개 URL 저장
     // ...
   })
   ```

**캐시 무효화**:
- `onSuccess` 콜백에서 `["enrollment", enrollmentId]` 재검증
- 자동으로 UI 업데이트

#### useDeleteDocument

```typescript
function useDeleteDocument(enrollmentId: string): UseMutationResult<
  void,
  Error,
  DeleteDocumentParams
>
```

**동작**:
1. `file_url`에서 `objectKey` 추출
2. `deleteDocumentFromR2` 호출
3. 성공 시 캐시 무효화

---

### 4. 이미지 압축 모듈

**위치**: `/src/lib/imageCompression.ts`

```typescript
async function compressIfImage(file: File): Promise<File>
```

**압축 조건**:
- 이미지 타입 확인 (JPEG, PNG, WebP)
- 1MB 이상인 경우만 압축

**압축 옵션**:
- `maxSizeMB`: 1 (최대 1MB로 압축)
- `maxWidthOrHeight`: 1600 (최대 너비/높이 1600px)
- `useWebWorker`: true (메인 스레드 블로킹 방지)

**반환**:
- 압축된 File 객체 또는 원본 File
- 타입: `File` (MIME 타입 유지)

---

### 5. UI 컴포넌트

#### DocumentUploadCard

**위치**: `/src/pages/enrollment/components/DocumentUploadCard.tsx`

**Props**:
```typescript
{
  title: string;              // 카드 제목
  description: string;        // 설명 텍스트
  enrollmentId: string;       // 수속 신청 ID
  documentType: DocumentType; // 문서 타입
  existingDocument?: EnrollmentDocument;  // 기존 업로드 문서
  accept?: string;            // 파일 accept 속성
  uploadMutation: UseMutationResult<...>;
  deleteMutation: UseMutationResult<...>;
}
```

**상태별 렌더링**:
- **업로드 전**: FileUpload 컴포넌트 표시
- **업로드 완료**: 파일명, 업로드 완료 배지, 삭제 버튼, 미리보기 버튼 (이미지만)
- **업로드 오류**: 에러 메시지 표시

#### DocumentViewCard

**위치**: `/src/pages/enrollment/components/DocumentViewCard.tsx`

**동작**:
- 문서 메타데이터 표시 (파일명, 크기, 업로드 날짜)
- 이미지: 클릭 시 미리보기 모달 표시
- PDF: 클릭 시 새 탭에서 다운로드 링크 열기

#### ImagePreviewModal

**위치**: `/src/pages/enrollment/components/ImagePreviewModal.tsx`

**특징**:
- Dialog 컴포넌트 기반
- 이미지 로딩 중 스핀 애니메이션
- 최대 높이 80vh 유지
- 파일명을 Dialog 제목으로 사용

---

## 보안 모델

### 1. 인증 계층

**JWT 검증** (Edge Function 진입점)

```typescript
const authHeader = req.headers.get("Authorization");
if (!authHeader) {
  return jsonResponse({ error: "인증이 필요합니다." }, 401);
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_ANON_KEY"),
  { global: { headers: { Authorization: authHeader } } }
);

const { data: { user }, error: authError } = await supabase.auth.getUser();
```

- Supabase 토큰으로 사용자 검증
- `Authorization` 헤더 필수
- 토큰이 유효하지 않으면 401 응답

### 2. 권한 검증 계층

**Enrollment 소유권 확인 (Upload)**

```typescript
const { data: enrollment, error: enrollmentError } = await supabase
  .from("enrollments")
  .select("id")
  .eq("id", enrollmentId)
  .eq("user_id", user.id)      // 중요: user_id 매칭
  .single();

if (enrollmentError || !enrollment) {
  return jsonResponse({ error: "이 수속 신청에 대한 접근 권한이 없습니다." }, 403);
}
```

**문서 소유권 확인 (View/Delete)**

```typescript
const { data: docRecord } = await supabase
  .from("enrollment_documents")
  .select("enrollment_id, enrollments!inner(user_id)")
  .eq("file_url", objectKey)
  .single();

const enrollmentData = docRecord.enrollments as unknown as { user_id: string };
if (enrollmentData.user_id !== user.id) {
  return jsonResponse({ error: "이 문서에 대한 접근 권한이 없습니다." }, 403);
}
```

- 관계형 테이블 조인으로 enrollment의 소유자 확인
- 다른 사용자 문서 접근 불가
- 404 대신 403 반환 (리소스 존재 여부 노출 안함)

### 3. Presigned URL 보안

**AWS Signature Version 4**

```typescript
const url = new URL(`${R2_ENDPOINT}/${R2_BUCKET}/${objectKey}`);
url.searchParams.set("X-Amz-Expires", "3600");

const signed = await r2.sign(
  new Request(url, {
    method: "PUT",
    headers: { "Content-Type": mimeType }
  }),
  { aws: { signQuery: true } }
);
```

- Query parameter 기반 서명
- 시간 제한 (1시간 업로드, 15분 조회)
- Content-Type 헤더 고정
- R2 credentials 사용 (절대 클라이언트에 노출 안함)

### 4. 파일 검증

**MIME 타입 화이트리스트**

```typescript
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
  return jsonResponse({ error: "허용되지 않는 파일 형식입니다." }, 400);
}
```

**파일 크기 제한**

```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

if (fileSize > MAX_FILE_SIZE) {
  return jsonResponse({ error: "파일 크기는 10MB 이하여야 합니다." }, 400);
}
```

**파일명 살균**

```typescript
function sanitizeFileName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, "_")      // 특수문자 제거
    .replace(/_{2,}/g, "_")                 // 연속 언더스코어 제거
    .substring(0, 100);                     // 길이 제한
}
```

### 5. 저장소 분리

**R2 폴더 구조**

```
enrollments/documents/{enrollmentId}/{uuid}_{sanitizedFileName}
```

- 모든 파일을 특정 enrollment 폴더에 저장
- UUID로 파일명 충돌 방지
- 구조화된 폴더로 관리 용이

### 6. Service Role 사용

**Delete 작업에서만 Service Role**

```typescript
const adminClient = createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")  // Admin credentials
);

const [r2Response, dbResult] = await Promise.all([
  fetch(signed.url, { method: "DELETE" }),
  adminClient.from("enrollment_documents").delete().eq("id", documentId)
]);
```

- 병렬 처리를 위해 필요
- 이전 JWT 검증에서 소유권 이미 확인됨
- 트랜잭션 처리는 아니지만 Promise.all로 원자성 보장

---

## 업로드 흐름

### 상세 단계별 흐름

#### 1단계: 사용자 파일 선택

```typescript
// DocumentUploadCard.tsx
function handleFileSelect(file: File) {
  uploadMutation.mutate({ file, enrollmentId, documentType });
}
```

**입력**: 사용자가 DocumentUploadCard의 FileUpload 컴포넌트에서 파일 선택

#### 2단계: 이미지 압축 + Presigned URL 병렬 요청

```typescript
// useEnrollment.ts - useUploadDocument 훅
const [compressed, presignResult] = await Promise.all([
  compressIfImage(file),                          // 클라이언트 사이드 압축
  getUploadPresignedUrl({                         // Edge Function 호출
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type,
    enrollmentId
  })
]);
```

**병렬 처리**:
- `compressIfImage`: 이미지면 1MB 이하로 압축, 아니면 원본 반환
- `getUploadPresignedUrl`: Supabase Edge Function 호출

**Edge Function 처리**:
```
1. JWT 토큰 검증 → user_id 추출
2. 파일 크기, MIME 타입, enrollment 소유권 검증
3. 고유한 objectKey 생성: enrollments/documents/{enrollmentId}/{uuid}_{fileName}
4. AWS Signature Version 4로 PUT URL 서명 (1시간 유효)
5. { uploadUrl, objectKey } 반환
```

#### 3단계: R2 직접 업로드

```typescript
// api/enrollment/documents.ts
const response = await fetch(uploadUrl, {
  method: "PUT",
  headers: { "Content-Type": file.type },
  body: file
});
```

**특징**:
- 브라우저에서 R2로 **직접** 업로드 (서버 경유 안함)
- Presigned URL에 모든 권한 포함
- 1시간 내에 완료해야 함

#### 4단계: DB 레코드 저장

```typescript
// useEnrollment.ts - useUploadDocument 훅
const publicFileUrl = `${R2_PUBLIC_URL}/${objectKey}`;
const saveResult = await saveDocumentRecord({
  enrollment_id: enrollmentId,
  document_type: documentType,
  uploaded_by: "STUDENT",
  file_name: file.name,
  file_url: publicFileUrl,         // 공개 URL 저장
  file_size: compressed.size,
  mime_type: compressed.type
});
```

**저장 항목**:
| 필드 | 값 | 설명 |
|------|-----|------|
| `enrollment_id` | 수속 신청 ID | 관계 설정 |
| `document_type` | FLIGHT_TICKET 등 | 문서 타입 |
| `uploaded_by` | STUDENT | 업로더 |
| `file_name` | 원본 파일명 | 사용자 표시용 |
| `file_url` | 공개 URL | presigned URL 생성 시 사용 |
| `file_size` | 압축 후 크기 | 표시용 |
| `mime_type` | image/jpeg 등 | 타입 검증 / 미리보기 판단용 |

#### 5단계: 캐시 무효화 및 UI 업데이트

```typescript
// useEnrollment.ts - useUploadDocument 훅의 onSuccess
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["enrollment", enrollmentId] });
}
```

**동작**:
- React Query 캐시 무효화
- useEnrollment 훅의 자동 재조회 트리거
- UI의 documents 배열 업데이트
- DocumentUploadCard가 업로드 완료 상태로 변경

### 에러 처리

| 시점 | 에러 | HTTP 상태 | 사용자 메시지 |
|------|------|----------|-------------|
| JWT 검증 실패 | 토큰 없음/만료 | 401 | "인증이 필요합니다." |
| 파일 크기 초과 | fileSize > 10MB | 400 | "파일 크기는 10MB 이하여야 합니다." |
| 파일 타입 불허 | MIME 타입 미지원 | 400 | "허용되지 않는 파일 형식입니다." |
| Enrollment 권한 없음 | user_id 불일치 | 403 | "이 수속 신청에 대한 접근 권한이 없습니다." |
| R2 업로드 실패 | 네트워크 오류 | 500+ | "파일 업로드 중 오류가 발생했습니다." |
| DB 저장 실패 | INSERT 오류 | 500 | "문서 정보 저장에 실패했습니다." |

---

## 조회 흐름

### 업로드된 문서 조회 및 미리보기

#### 1단계: 초기 로드

```typescript
// useEnrollment.ts
const { enrollment, documents, loading, error } = useEnrollment(enrollmentId);
```

**동작**:
- `fetchEnrollmentWithDocuments` API 호출
- 수속 신청 정보 + 전체 문서 목록 조회
- React Query 캐싱

#### 2단계: 문서 목록 표시

```typescript
// DocumentViewCard.tsx 또는 DocumentUploadCard.tsx
{document ? (
  <div className="flex items-center gap-3 p-3 rounded-[10px] border border-beige-dark bg-beige/30">
    <FileTextIcon className="w-5 h-5 text-brown" />
    <div>
      <p className="text-sm font-medium">{document.file_name}</p>
      <p className="text-xs text-muted-foreground">
        {formatFileSize(document.file_size)} · {new Date(document.created_at).toLocaleDateString("ko-KR")}
      </p>
    </div>
  </div>
) : null}
```

**표시 정보**:
- 파일명
- 파일 크기 (포맷된 형태)
- 업로드 날짜

#### 3단계: 미리보기 요청 (이미지만)

```typescript
// DocumentViewCard.tsx 또는 DocumentUploadCard.tsx
function handleView() {
  if (isImage) {
    setPreviewOpen(true);  // ImagePreviewModal 열기
  } else {
    window.open(document.file_url, "_blank");  // PDF는 새 탭에서 열기
  }
}
```

#### 4단계: Presigned URL 생성 (이미지)

```typescript
// ImagePreviewModal에서 <img src={imageUrl}> 사용 시
// Edge Function의 "view" action 호출 불필요
// 대신 file_url (공개 URL)을 직접 사용
```

**현재 구현**:
- 미리보기 모달에서 공개 URL(`file_url`) 직접 사용
- 요청 시마다 presigned URL 생성하지 않음
- R2에서 객체 공개 설정되어 있다고 가정

**개선 안**:
- 필요 시 미리보기 시마다 presigned URL 요청 가능
- 보안 강화 (일회성 URL, 짧은 만료시간 15분)

#### 5단계: 이미지 미리보기 렌더링

```typescript
// ImagePreviewModal.tsx
<Dialog open={open} onOpenChange={handleOpenChange}>
  <DialogContent className="sm:max-w-[90vw] md:max-w-[700px]">
    {!imageLoaded && (
      <div className="absolute inset-0 flex items-center justify-center">
        <LoaderIcon className="w-6 h-6 animate-spin" />
      </div>
    )}
    <img
      src={imageUrl}
      alt={fileName}
      onLoad={() => setImageLoaded(true)}
      className={`max-w-full max-h-[80vh] object-contain ${
        imageLoaded ? "opacity-100" : "opacity-0"
      }`}
    />
  </DialogContent>
</Dialog>
```

**특징**:
- 로딩 중 스핀 애니메이션 표시
- 이미지 로드 완료 시 페이드인
- 최대 크기 제한 (80vh, 반응형 너비)

---

## 삭제 흐름

### 상세 단계별 흐름

#### 1단계: 삭제 버튼 클릭

```typescript
// DocumentUploadCard.tsx
function handleDelete() {
  if (!existingDocument) return;
  if (!window.confirm("업로드된 파일을 삭제하시겠습니까?")) return;

  deleteMutation.mutate({
    documentId: existingDocument.id,
    fileUrl: existingDocument.file_url
  });
}
```

**입력**:
- `documentId`: DB 레코드 ID
- `fileUrl`: 공개 URL 형식 (objectKey 추출 용도)

#### 2단계: objectKey 추출

```typescript
// useEnrollment.ts - useDeleteDocument 훅
const objectKey = fileUrl.replace(`${R2_PUBLIC_URL}/`, "");
// 예: "enrollments/documents/{enrollmentId}/{uuid}_{fileName}"
```

**변환**:
- `https://pub-e4a7ee3bfd594488bd912e2d8b8b24f3.r2.dev/enrollments/documents/123/abc-def_photo.jpg`
- → `enrollments/documents/123/abc-def_photo.jpg`

#### 3단계: Edge Function 호출

```typescript
// api/storage/presign.ts - deleteDocumentFromR2
const { error } = await supabase.functions.invoke("storage-presign", {
  body: { action: "delete", objectKey, documentId }
});
```

#### 4단계: Edge Function 검증

```typescript
// supabase/functions/storage-presign/index.ts
if (action === "delete") {
  // 1. JWT 검증
  const { user } = await supabase.auth.getUser();

  // 2. 문서 존재 및 소유권 확인
  const { data: docRecord } = await supabase
    .from("enrollment_documents")
    .select("id, enrollment_id, enrollments!inner(user_id)")
    .eq("id", documentId)
    .single();

  const ownerData = docRecord.enrollments;
  if (ownerData.user_id !== user.id) {
    return jsonResponse({ error: "삭제 권한이 없습니다." }, 403);
  }
```

**검증 사항**:
- JWT 토큰 유효성
- 문서 존재 여부
- Enrollment 소유권

#### 5단계: 병렬 삭제 실행

```typescript
// supabase/functions/storage-presign/index.ts
const deleteUrl = new URL(`${R2_ENDPOINT}/${R2_BUCKET}/${objectKey}`);
const signed = await r2.sign(
  new Request(deleteUrl, { method: "DELETE" }),
  { aws: { signQuery: true } }
);

const adminClient = createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
);

const [r2Response, dbResult] = await Promise.all([
  fetch(signed.url, { method: "DELETE" }),           // R2 삭제
  adminClient.from("enrollment_documents")
    .delete()
    .eq("id", documentId)                            // DB 삭제
]);
```

**병렬 처리 이유**:
- R2 삭제는 보통 빠름 (< 1초)
- DB 삭제도 빠름 (< 100ms)
- 둘 다 기다리는 것이 합리적
- 실패 시 전체 삭제 실패 처리

#### 6단계: 결과 처리

```typescript
// supabase/functions/storage-presign/index.ts
if (!r2Response.ok && r2Response.status !== 404) {
  return jsonResponse({ error: "파일 삭제에 실패했습니다." }, 500);
}
if (dbResult.error) {
  return jsonResponse({ error: "문서 레코드 삭제에 실패했습니다." }, 500);
}

return jsonResponse({ success: true }, 200);
```

**특별 처리**:
- R2 404: 정상 처리 (파일이 없어도 성공)
- R2 기타 오류: 500 반환
- DB 오류: 500 반환

#### 7단계: 캐시 무효화

```typescript
// useEnrollment.ts - useDeleteDocument 훅
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["enrollment", enrollmentId] });
}
```

**동작**:
- React Query 캐시 무효화
- useEnrollment 재조회
- UI의 documents 배열 업데이트
- 삭제된 문서 목록에서 제거

### 삭제 흐름 다이어그램

```
사용자 삭제 요청
    ↓
[검증] JWT + 소유권 확인
    ↓
┌─────────────────────────────────┐
│  Promise.all() 병렬 처리         │
├──────────────────┬──────────────┤
│ R2 DELETE        │ DB DELETE    │
│ (2-5초)          │ (100-500ms)  │
│                  │              │
│ objectKey 바탕   │ documentId   │
│ AWS4 서명된 URL  │ 바탕 레코드  │
│ 로 DELETE 요청   │ 삭제         │
└──────────────────┴──────────────┘
    ↓
[결과 확인]
- R2: ok 또는 404 → 성공
- DB: no error → 성공
    ↓
캐시 무효화 → UI 업데이트
```

---

## 파일 제한사항

### 1. 파일 크기

| 제약 | 값 | 설명 |
|------|-----|------|
| 최대 크기 | 10MB | Edge Function에서 검증 |
| 클라이언트 압축 임계값 | 1MB | 1MB 이상 이미지 자동 압축 |

**처리**:
```typescript
// Edge Function
if (fileSize > MAX_FILE_SIZE) {  // 10MB
  return jsonResponse({ error: "파일 크기는 10MB 이하여야 합니다." }, 400);
}

// 클라이언트
if (file.size <= COMPRESSION_THRESHOLD) {  // 1MB
  return file;  // 원본 반환
}
```

### 2. MIME 타입

**허용 목록**:
```typescript
const ALLOWED_MIME_TYPES = [
  "application/pdf",        // PDF 문서
  "image/jpeg",             // JPG/JPEG
  "image/png",              // PNG
  "image/webp"              // WebP
];
```

**검증 위치**:
- Edge Function에서 화이트리스트 검증
- 클라이언트에서도 accept 속성으로 사전 필터링

```typescript
// DocumentUploadCard props
accept={accept}  // 예: "image/*,.pdf"
```

### 3. 이미지 압축

**압축 옵션**:
```typescript
const compressed = await imageCompression(file, {
  maxSizeMB: 1,              // 최대 1MB
  maxWidthOrHeight: 1600,    // 최대 1600px (너비 또는 높이)
  useWebWorker: true         // 메인 스레드 블로킹 방지
});
```

**적용 대상**:
- JPEG, PNG, WebP
- 크기 > 1MB인 이미지

**이점**:
- 업로드 속도 개선
- 대역폭 절감
- R2 스토리지 비용 절감

### 4. 파일명 제한

**살균 규칙**:
```typescript
function sanitizeFileName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, "_")    // 특수문자 → 언더스코어
    .replace(/_{2,}/g, "_")               // 연속 언더스코어 → 단일
    .substring(0, 100);                   // 최대 100글자
}
```

**예시**:
- `내 사진 2024.jpg` → `_________2024.jpg` → `_2024.jpg`
- `receipt-2024_01_23.pdf` → `receipt-2024_01_23.pdf` (변화 없음)

### 5. 저장 시간 제한

**Presigned URL 유효시간**:
| 작업 | 유효시간 | 설명 |
|------|---------|------|
| 업로드 (PUT) | 1시간 (3600초) | 파일 업로드 완료 시간 |
| 조회 (GET) | 15분 (900초) | 미리보기 링크 유효시간 |
| 삭제 (DELETE) | 15분 (900초) | 삭제 실행 유효시간 |

**설정**:
```typescript
// Upload
url.searchParams.set("X-Amz-Expires", "3600");

// View/Delete
url.searchParams.set("X-Amz-Expires", "900");
```

---

## 환경변수

### Cloudflare R2 설정

| 변수명 | 값 | 설명 | 필수 |
|--------|-----|------|------|
| `R2_ENDPOINT` | `https://[account-id].r2.cloudflarestorage.com` | R2 API 엔드포인트 | O |
| `R2_BUCKET_NAME` | 버킷 이름 | R2 버킷명 | O |
| `R2_ACCESS_KEY_ID` | 액세스 키 ID | R2 API 토큰 ID | O |
| `R2_SECRET_ACCESS_KEY` | 시크릿 액세스 키 | R2 API 토큰 비밀키 | O |

**설정 위치**: `/supabase/.env.local`

### Supabase 설정

| 변수명 | 값 | 설명 | 필수 |
|--------|-----|------|------|
| `SUPABASE_URL` | Supabase 프로젝트 URL | 프로젝트 API URL | O |
| `SUPABASE_ANON_KEY` | Anon Public Key | 클라이언트 사이드 토큰 | O |
| `SUPABASE_SERVICE_ROLE_KEY` | Service Role Key | 관리자 토큰 (삭제용) | O |

**설정 위치**:
- Edge Function 환경: Supabase 대시보드에서 자동 주입
- 클라이언트: `.env` (퍼블릭 키만)

### 클라이언트 환경변수

| 변수명 | 값 | 설명 | 필수 |
|--------|-----|------|------|
| `VITE_SUPABASE_URL` | Supabase URL | 클라이언트 연결용 | O |
| `VITE_SUPABASE_ANON_KEY` | Anon Key | 클라이언트 토큰 | O |
| `VITE_R2_PUBLIC_URL` | `https://pub-[hash].r2.dev` | R2 공개 도메인 | O |

**설정 위치**: 프로젝트 루트의 `.env`

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-public-key>
VITE_R2_PUBLIC_URL=https://pub-<hash>.r2.dev
```

### Supabase Function 설정

**파일**: `/supabase/config.toml`

```toml
[functions.storage-presign]
verify_jwt = false
```

**이유**:
- JWT 검증을 Edge Function 내부에서 수동으로 처리
- `verify_jwt = false`로 설정하면 Supabase가 자동 검증하지 않음
- 더 세밀한 에러 처리 가능

---

## 디렉토리 구조

### 프로젝트 전체 구조

```
bawi-road-service/
├── supabase/
│   ├── config.toml                              # Supabase Functions 설정
│   ├── .env.local                               # R2 credentials (gitignore)
│   └── functions/
│       └── storage-presign/
│           └── index.ts                         # Edge Function (메인 로직)
├── src/
│   ├── api/
│   │   ├── storage/
│   │   │   └── presign.ts                       # R2 presigned URL API
│   │   └── enrollment/
│   │       ├── documents.ts                     # 문서 저장 API
│   │       └── enrollments.ts                   # 수속 신청 조회 API
│   ├── hooks/
│   │   └── useEnrollment.ts                     # 업로드/삭제 훅
│   ├── lib/
│   │   ├── imageCompression.ts                  # 이미지 압축 유틸
│   │   └── supabase.ts                          # Supabase 클라이언트
│   ├── pages/
│   │   └── enrollment/
│   │       ├── EnrollmentDetailPage.tsx         # 페이지 컴포넌트
│   │       └── components/
│   │           ├── DocumentUploadCard.tsx       # 업로드 UI
│   │           ├── DocumentViewCard.tsx         # 조회 UI
│   │           └── ImagePreviewModal.tsx        # 미리보기 UI
│   ├── types/
│   │   └── enrollment.ts                        # 타입 정의
│   └── components/
│       ├── LoadingOverlay.tsx                   # 공통 로딩 오버레이
│       └── FileUpload.tsx                       # 공통 파일 업로드
├── .env                                         # 클라이언트 환경변수
├── docs/
│   ├── ai-chatbot-concept.md                    # 챗봇 개념 문서
│   └── storage-architecture.md                  # 본 문서 (이 파일)
└── ...
```

### API 함수 구조

```
src/api/
├── storage/presign.ts
│   ├── getUploadPresignedUrl()
│   └── deleteDocumentFromR2()
└── enrollment/
    ├── documents.ts
    │   ├── uploadDocumentToR2()
    │   └── saveDocumentRecord()
    └── enrollments.ts
        └── fetchEnrollmentWithDocuments()
```

### Hook 구조

```
src/hooks/useEnrollment.ts
├── useEnrollment()
│   └── useQuery (enrollment + documents)
├── useUploadDocument()
│   └── useMutation (3단계 업로드)
└── useDeleteDocument()
    └── useMutation (병렬 삭제)
```

### UI 컴포넌트 구조

```
pages/enrollment/
├── EnrollmentDetailPage.tsx
│   └── components/
│       ├── DocumentUploadCard.tsx
│       │   └── uses: useUploadDocument, useDeleteDocument
│       │   └── shows: ImagePreviewModal
│       ├── DocumentViewCard.tsx
│       │   └── shows: ImagePreviewModal
│       └── ImagePreviewModal.tsx
│           └── Dialog + Image
```

### 데이터베이스 테이블 구조

```
enrollment_documents
├── id (UUID, primary key)
├── enrollment_id (UUID, foreign key → enrollments)
├── document_type (enum)
├── uploaded_by (enum: STUDENT, ADMIN)
├── file_name (text)
├── file_url (text)
├── file_size (integer)
├── mime_type (text)
└── created_at (timestamp)

enrollments
├── id (UUID, primary key)
├── user_id (UUID, foreign key → auth.users)
├── academy_id (UUID)
├── ... (기타 필드)
└── documents (relationship)
```

---

## 트러블슈팅

### 문제: "인증이 필요합니다" (401 오류)

**원인**:
1. Authorization 헤더 없음
2. Supabase 토큰 만료
3. 잘못된 토큰 형식

**해결**:
```typescript
// 클라이언트에서 자동으로 헤더 추가됨
// supabase.functions.invoke()는 자동으로 현재 사용자의 토큰 사용

// 수동 확인 방법
const { data: { user } } = await supabase.auth.getUser();
console.log("현재 사용자:", user?.id);
```

### 문제: "파일 크기는 10MB 이하여야 합니다" (400 오류)

**원인**:
- 파일 크기가 10MB 초과

**해결**:
```typescript
// 1. 이미지 압축 확인
const compressed = await compressIfImage(file);
console.log("원본:", file.size, "압축:", compressed.size);

// 2. 파일 크기 사전 확인
const MAX_FILE_SIZE = 10 * 1024 * 1024;
if (file.size > MAX_FILE_SIZE) {
  alert("파일 크기가 너무 큽니다. 10MB 이하의 파일을 선택해주세요.");
}
```

### 문제: "허용되지 않는 파일 형식입니다" (400 오류)

**원인**:
- 지원하지 않는 MIME 타입 (예: GIF, BMP, TIFF)

**해결**:
```typescript
// 허용되는 타입
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

// FileUpload 컴포넌트에 accept 속성 추가
<FileUpload
  accept="image/jpeg,image/png,image/webp,.pdf"
  {...props}
/>
```

### 문제: "이 수속 신청에 대한 접근 권한이 없습니다" (403 오류)

**원인**:
- 다른 사용자의 수속 신청에 파일 업로드 시도
- 해킹 또는 토큰 탈취

**해결**:
```typescript
// Edge Function에서 자동 검증됨
// 정상적인 사용 흐름에서는 발생하지 않아야 함

// 개발 중 확인 방법
const { data: enrollment } = await supabase
  .from("enrollments")
  .select("*")
  .eq("id", enrollmentId)
  .eq("user_id", currentUser.id)
  .single();

if (!enrollment) {
  console.error("이 수속 신청에 접근할 수 없습니다");
}
```

### 문제: 업로드는 성공하지만 DB에 저장되지 않음

**원인**:
1. R2 업로드는 성공했지만 DB 저장 중 오류
2. 네트워크 오류로 DB 요청 실패
3. enrollment_documents 테이블 권한 문제

**해결**:
```typescript
// 1. 브라우저 콘솔에서 오류 메시지 확인
uploadMutation.error instanceof Error &&
  console.error(uploadMutation.error.message)

// 2. React Query DevTools 확인
// npm install @tanstack/react-query-devtools
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// 3. Supabase 대시보드에서 Storage 탭 확인
// R2에 파일이 실제로 저장되었는지 확인

// 4. DB 권한 확인 (RLS policy)
// Supabase 대시보드 → SQL Editor에서
// SELECT * FROM enrollment_documents;
```

### 문제: 미리보기가 로드되지 않음 (빈 모달)

**원인**:
1. R2에서 파일을 찾을 수 없음
2. CORS 정책 위반
3. 잘못된 file_url

**해결**:
```typescript
// 1. 브라우저 개발자 도구에서 Network 탭 확인
// 이미지 요청 상태 코드 확인 (200, 404, 403 등)

// 2. CORS 설정 확인 (R2 버킷 설정)
// Cloudflare 대시보드 → R2 → 버킷 설정

// 3. file_url 형식 확인
console.log("file_url:", document.file_url);
// 예: https://pub-e4a7ee3bfd594488bd912e2d8b8b24f3.r2.dev/enrollments/documents/123/abc-def.jpg

// 4. 테스트
fetch(document.file_url)
  .then(res => console.log("상태:", res.status))
  .catch(err => console.error("오류:", err))
```

### 문제: 삭제 후에도 이미지가 계속 표시됨

**원인**:
- 브라우저 캐시 또는 CDN 캐시

**해결**:
```typescript
// 1. 브라우저 캐시 삭제
// 개발자 도구 → Network → "Disable cache" 체크

// 2. 강제 새로고침
// Ctrl+Shift+R (Windows) 또는 Cmd+Shift+R (Mac)

// 3. React Query 캐시 확인
// 삭제 후 queryClient.invalidateQueries({ queryKey: ["enrollment", enrollmentId] })
// 이 코드가 실행되어야 UI 업데이트됨

// 4. CDN 캐시 무효화 (필요한 경우)
// Cloudflare 대시보드 → Caching → Purge Cache
```

### 문제: 대량 파일 업로드 시 느린 속도

**원인**:
1. 각 파일 업로드 후 DB 저장을 순차적으로 처리
2. 이미지 압축 시간 누적

**해결**:
```typescript
// 1. 여러 파일을 동시 업로드 (클라이언트 수정)
const uploadPromises = files.map(file =>
  uploadMutation.mutateAsync({ file, enrollmentId, documentType })
);
await Promise.all(uploadPromises);

// 2. 이미지 압축 옵션 최적화
const compressed = await imageCompression(file, {
  maxSizeMB: 0.5,           // 더 작게 압축
  maxWidthOrHeight: 1200,   // 해상도 낮춤
  useWebWorker: true
});

// 3. 서버 로그 확인
// Supabase 대시보드 → Functions → storage-presign → Logs
```

### 문제: R2에 파일은 있지만 DB에는 레코드가 없음

**원인**:
- 업로드 중 DB 저장 단계에서 실패
- 파일 고아 상태 (orphan files)

**해결**:
```typescript
// 1. 고아 파일 정리 (수동)
// Cloudflare 대시보드 → R2 → 버킷 → 파일 목록
// 오래된 파일 삭제

// 2. 자동 정리 스크립트 추가
// Edge Function에서 정기적으로 orphan 파일 검사
// (implementation 예시는 생략)

// 3. DB 기록 복구
// Supabase 대시보드 → SQL Editor
INSERT INTO enrollment_documents (
  enrollment_id,
  document_type,
  uploaded_by,
  file_name,
  file_url,
  file_size,
  mime_type
) VALUES (
  'enrollment-id',
  'DOCUMENT_TYPE',
  'STUDENT',
  'file.jpg',
  'https://pub-.../path/to/file.jpg',
  12345,
  'image/jpeg'
);
```

### 문제: "presigned URL 발급에 실패했습니다"

**원인**:
1. Edge Function 오류
2. R2 credentials 잘못됨
3. R2 버킷 접근 권한 없음

**해결**:
```typescript
// 1. Edge Function 로그 확인
// Supabase 대시보드 → Functions → storage-presign → Logs

// 2. R2 credentials 검증
// supabase/config.toml에서 R2_ENDPOINT, R2_BUCKET_NAME 확인

// 3. R2 API 토큰 권한 확인
// Cloudflare 대시보드 → R2 → API 토큰
// 권한: s3:GetObject, s3:PutObject, s3:DeleteObject

// 4. 수동 테스트
curl -X PUT "https://[account].r2.cloudflarestorage.com/[bucket]/test.txt" \
  -H "Authorization: Bearer [token]"
```

---

## 추가 자료

### 관련 문서
- Cloudflare R2 API 문서: https://developers.cloudflare.com/r2/
- Supabase Edge Functions: https://supabase.com/docs/guides/functions
- AWS S3 Presigned URLs: https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html
- AWS Signature Version 4: https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html

### 프로젝트 타입 정의
- `/src/types/enrollment.ts`: 수속 신청 및 문서 타입 정의

### 관련 API 함수
- `/src/api/enrollment/enrollments.ts`: 수속 신청 조회
- `/src/api/enrollment/documents.ts`: 문서 저장

### 호스팅 환경
- **Edge Function 호스트**: Supabase (Cloudflare Workers 기반)
- **스토리지**: Cloudflare R2 (S3 호환)
- **데이터베이스**: Supabase PostgreSQL
- **클라이언트**: React + TypeScript

### 보안 검증 체크리스트
- [ ] JWT 검증 (Edge Function 진입점)
- [ ] 파일 크기 검증 (10MB 이하)
- [ ] MIME 타입 화이트리스트 (4가지만 허용)
- [ ] 사용자 소유권 검증 (enrollment의 user_id 매칭)
- [ ] 파일명 살균 (특수문자 제거)
- [ ] Presigned URL 시간 제한 (1시간 업로드, 15분 조회/삭제)
- [ ] R2 credentials 미노출 (서버 사이드에만 저장)
- [ ] CORS 설정 (필요한 도메인만 허용)

