# R2 스토리지 어드민 가이드

이 문서는 어드민이 R2 스토리지 시스템을 통해 수속 신청 문서를 관리하기 위한 실전 가이드입니다.

## 목차

1. [아키텍처 요약](#아키텍처-요약)
2. [업로드 흐름](#업로드-흐름)
3. [어드민 업로드 시 주의사항](#어드민-업로드-시-주의사항)
4. [문서 타입](#문서-타입)
5. [DB 스키마](#db-스키마)
6. [파일 제한](#파일-제한)
7. [조회/삭제 API](#조회삭제-api)
8. [환경변수](#환경변수)
9. [프론트엔드 구현](#프론트엔드-구현)
10. [트러블슈팅](#트러블슈팅)

---

## 아키텍처 요약

### 저장소 선택 이유

현재 시스템은 **Supabase Storage가 아닌 Cloudflare R2 + Supabase Edge Function** 방식을 사용합니다.

**이유:**
- Supabase Storage는 소속 테이블의 RLS 정책에만 의존 → 어드민이 다른 사용자의 데이터에 접근할 때 제약
- R2 + Edge Function은 **명시적인 권한 검증**이 가능하여 어드민 작업에 유리
- R2는 대용량/장기 저장에 더 비용 효율적

### 시스템 흐름

1. **클라이언트** 또는 **어드민**이 파일 업로드 요청
2. **Edge Function** (presigned URL 발급자)가 JWT 검증 → 권한 확인 → 서명된 URL 생성
3. 클라이언트가 URL로 **R2에 직접 업로드** (서버 경유 안함)
4. DB에 메타데이터 저장 (enrollment_documents 테이블)

---

## 업로드 흐름

업로드는 **3단계**로 진행됩니다.

### 1단계: presigned URL 발급

Edge Function에 요청:

```typescript
const response = await fetch(
  `${VITE_SUPABASE_URL}/functions/v1/storage-presign`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`, // Supabase JWT 토큰
    },
    body: JSON.stringify({
      action: "upload",
      fileName: "admission-letter.pdf",
      fileSize: 512000, // 바이트 단위
      mimeType: "application/pdf",
      enrollmentId: "550e8400-e29b-41d4-a716-446655440000",
    }),
  }
);

const { uploadUrl, objectKey } = await response.json();
```

**응답:**
```json
{
  "uploadUrl": "https://r2-api.example.com/bucket/enrollments/...",
  "objectKey": "enrollments/documents/{enrollmentId}/{uuid}_admission-letter.pdf"
}
```

### 2단계: R2에 파일 업로드

presigned URL로 직접 업로드:

```typescript
const uploadResponse = await fetch(uploadUrl, {
  method: "PUT",
  headers: {
    "Content-Type": "application/pdf", // mimeType과 일치해야 함
  },
  body: fileBlob,
});

if (!uploadResponse.ok) {
  throw new Error("R2 업로드 실패");
}
```

**중요:**
- `Content-Type` 헤더를 step 1에서 보낸 `mimeType`과 정확히 일치시켜야 함
- presigned URL은 1시간 유효

### 3단계: DB에 메타데이터 저장

```typescript
const { data, error } = await supabase
  .from("enrollment_documents")
  .insert([
    {
      enrollment_id: enrollmentId,
      document_type: "ADMISSION_LETTER", // 또는 INVOICE, FLIGHT_TICKET, TRAVEL_INSURANCE
      uploaded_by: "ADMIN", // 어드민이 업로드한 경우
      file_name: "admission-letter.pdf",
      file_url: `https://pub-{hash}.r2.dev/enrollments/documents/${enrollmentId}/${uuid}_admission-letter.pdf`,
      file_size: 512000,
      mime_type: "application/pdf",
    },
  ]);

if (error) throw error;
```

---

## 어드민 업로드 시 주의사항

### 현재 제약 사항

Edge Function의 `upload` action은 다음과 같이 소유권을 검증합니다:

```typescript
const { data: enrollment } = await supabase
  .from("enrollments")
  .select("id")
  .eq("id", enrollmentId)
  .eq("user_id", user.id)  // ← 문제: 어드민은 본인 enrollment이 아니므로 실패
  .single();
```

**결과:** 어드민이 학생의 enrollment에 파일을 업로드하려 하면 **403 Forbidden** 에러 발생

### 해결 방법 (택 1)

#### 방법 A: Edge Function에 `admin-upload` action 추가 (권장)

새로운 action을 Edge Function에 추가하되, role 검증을 먼저 진행:

```typescript
if (action === "admin-upload") {
  // 1. 어드민 역할 확인
  const { data: member } = await supabase
    .from("members")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!member || member.role !== "ADMIN") {
    return jsonResponse(
      { error: "어드민만 이 작업을 수행할 수 있습니다." },
      403,
      corsHeaders
    );
  }

  // 2. enrollment 존재 확인 (소유권 검증 없음)
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("id", enrollmentId)
    .single();

  if (!enrollment) {
    return jsonResponse(
      { error: "수속 신청을 찾을 수 없습니다." },
      404,
      corsHeaders
    );
  }

  // 3. presigned URL 생성 (위의 upload action과 동일)
  // ...
}
```

사용:

```typescript
await fetch(`${VITE_SUPABASE_URL}/functions/v1/storage-presign`, {
  method: "POST",
  headers: { Authorization: `Bearer ${authToken}` },
  body: JSON.stringify({
    action: "admin-upload", // ← admin-upload 사용
    fileName: "invoice.pdf",
    fileSize: 256000,
    mimeType: "application/pdf",
    enrollmentId: "550e8400-e29b-41d4-a716-446655440000",
  }),
});
```

#### 방법 B: 어드민용 별도 서버 함수

Node.js 백엔드에서 직접 R2 presigned URL을 생성 (Supabase Edge Function 우회):

```typescript
// 어드민 서버 (Node.js)
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  endpoint: process.env.R2_ENDPOINT,
  region: "auto",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

app.post("/api/admin/presigned-url", async (req, res) => {
  const { enrollmentId, fileName, mimeType } = req.body;

  // role 검증 추가

  const key = `enrollments/documents/${enrollmentId}/${uuid}_${fileName}`;
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    ContentType: mimeType,
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
  res.json({ uploadUrl: signedUrl });
});
```

#### 방법 C: Edge Function에서 role 검증

기존 `upload` action을 수정하되, role을 먼저 확인:

```typescript
if (action === "upload") {
  const { data: member } = await supabase
    .from("members")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = member?.role === "ADMIN";

  // 어드민이 아니면 소유권 검증 필수
  if (!isAdmin) {
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("id", enrollmentId)
      .eq("user_id", user.id)
      .single();

    if (!enrollment) {
      return jsonResponse(
        { error: "이 수속 신청에 대한 접근 권한이 없습니다." },
        403,
        corsHeaders
      );
    }
  } else {
    // 어드민은 enrollment 존재만 확인
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("id", enrollmentId)
      .single();

    if (!enrollment) {
      return jsonResponse(
        { error: "수속 신청을 찾을 수 없습니다." },
        404,
        corsHeaders
      );
    }
  }

  // presigned URL 생성...
}
```

---

## 문서 타입

`enrollment_documents` 테이블의 `document_type` 컬럼에 저장되는 문서 타입:

| 타입 | 설명 | 업로더 | 용도 |
|------|------|--------|------|
| `ADMISSION_LETTER` | 입학허가서 | ADMIN | 학교가 발급한 공식 입학허가 문서 |
| `INVOICE` | 학비 청구서 | ADMIN | 학비 청구서/인보이스 |
| `FLIGHT_TICKET` | 항공권 | STUDENT | 학생이 예매한 항공권 증명서 |
| `TRAVEL_INSURANCE` | 여행자보험 | STUDENT | 학생이 가입한 여행자보험 증명서 |

어드민은 주로 `ADMISSION_LETTER`와 `INVOICE` 문서를 업로드합니다.

---

## DB 스키마

```sql
CREATE TYPE document_type AS ENUM (
  'FLIGHT_TICKET',
  'TRAVEL_INSURANCE',
  'ADMISSION_LETTER',
  'INVOICE'
);

CREATE TYPE document_uploader AS ENUM (
  'STUDENT',
  'ADMIN'
);

CREATE TABLE enrollment_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  uploaded_by document_uploader NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL DEFAULT 0,
  mime_type TEXT NOT NULL DEFAULT 'application/octet-stream',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_enrollment_documents_enrollment_id
  ON enrollment_documents(enrollment_id);
```

**핵심 필드:**
- `enrollment_id`: 문서가 속한 수속 신청 ID
- `document_type`: 문서의 종류 (enum)
- `uploaded_by`: 누가 업로드했는지 기록
- `file_url`: R2 공개 URL (https://pub-{hash}.r2.dev/...)
- `mime_type`: 파일 MIME 타입 (application/pdf 등)

---

## 파일 제한

### 크기 제한

- **최대 크기**: 10MB
- Edge Function에서 검증:
  ```typescript
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  if (fileSize > MAX_FILE_SIZE) {
    return jsonResponse(
      { error: "파일 크기는 10MB 이하여야 합니다." },
      400,
      corsHeaders
    );
  }
  ```

### 허용 파일 타입

- `application/pdf`
- `image/jpeg`
- `image/png`
- `image/webp`

Edge Function에서 검증:

```typescript
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
  return jsonResponse(
    { error: "허용되지 않는 파일 형식입니다." },
    400,
    corsHeaders
  );
}
```

### R2 저장 경로

```
enrollments/documents/{enrollmentId}/{uuid}_{sanitizedFileName}
```

예시:
```
enrollments/documents/550e8400-e29b-41d4-a716-446655440000/a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6_admission-letter.pdf
```

### Presigned URL 유효시간

- **업로드 용**: 1시간 (`X-Amz-Expires: 3600`)
- **조회 용**: 15분 (`X-Amz-Expires: 900`)

---

## 조회/삭제 API

### 문서 조회

조회할 때도 Edge Function을 통해 signed GET URL 발급:

```typescript
const response = await fetch(
  `${VITE_SUPABASE_URL}/functions/v1/storage-presign`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      action: "view",
      documentId: "550e8400-e29b-41d4-a716-446655440000",
    }),
  }
);

const { viewUrl } = await response.json();
// viewUrl로 iframe 또는 새 탭에서 문서 열기
window.open(viewUrl);
```

**주의:** 현재 `view` action도 소유권 검증이 있으므로, 어드민이 다른 사용자의 문서를 조회하려면 동일한 방법 (A, B, C)으로 해결 필요.

### 문서 삭제

```typescript
const response = await fetch(
  `${VITE_SUPABASE_URL}/functions/v1/storage-presign`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      action: "delete",
      documentId: "550e8400-e29b-41d4-a716-446655440000",
    }),
  }
);

const { success } = await response.json();
```

**동작:**
1. DB에서 문서 레코드 삭제
2. R2에서 파일 삭제 (best-effort, 실패해도 DB 삭제는 유지)

**주의:** `delete` action도 소유권 검증이 있으므로 어드민 대응 필요.

---

## 환경변수

### 클라이언트 환경변수

`.env` 또는 `.env.local`에 설정:

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxx...
VITE_R2_PUBLIC_URL=https://pub-hash.r2.dev
```

### Edge Function 환경변수

Supabase 대시보드 → Edge Functions → storage-presign → Secrets:

| 키 | 값 | 설명 |
|----|----|------|
| `R2_ENDPOINT` | `https://xxxx.r2.cloudflarestorage.com` | R2 API 엔드포인트 |
| `R2_BUCKET_NAME` | `bawi-road-documents` | R2 버킷명 |
| `R2_ACCESS_KEY_ID` | `xxxxx` | R2 액세스 키 ID |
| `R2_SECRET_ACCESS_KEY` | `xxxxx` | R2 시크릿 키 |

Supabase 프로젝트 내부 변수 (자동 설정):
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

---

## 프론트엔드 구현

### 어드민용 문서 업로드 컴포넌트

```typescript
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface AdminDocumentUploadProps {
  enrollmentId: string;
}

export function AdminDocumentUpload({ enrollmentId }: AdminDocumentUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<"ADMISSION_LETTER" | "INVOICE">(
    "ADMISSION_LETTER"
  );

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session?.access_token) {
        throw new Error("인증이 필요합니다.");
      }

      // 1단계: presigned URL 발급
      const presignResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/storage-presign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionData.session.access_token}`,
          },
          body: JSON.stringify({
            action: "admin-upload", // 또는 "upload" (해결 방법에 따라)
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            enrollmentId,
          }),
        }
      );

      if (!presignResponse.ok) {
        const error = await presignResponse.json();
        throw new Error(error.error || "presigned URL 발급 실패");
      }

      const { uploadUrl, objectKey } = await presignResponse.json();

      // 2단계: R2에 업로드
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("R2 업로드 실패");
      }

      // 3단계: DB에 메타데이터 저장
      const publicUrl = `${import.meta.env.VITE_R2_PUBLIC_URL}/${objectKey}`;
      const { error: dbError } = await supabase
        .from("enrollment_documents")
        .insert([
          {
            enrollment_id: enrollmentId,
            document_type: documentType,
            uploaded_by: "ADMIN",
            file_name: file.name,
            file_url: publicUrl,
            file_size: file.size,
            mime_type: file.type,
          },
        ]);

      if (dbError) throw dbError;

      return { success: true };
    },
    onSuccess: () => {
      setSelectedFile(null);
      // 문서 목록 새로고침 등의 로직
    },
  });

  return (
    <div className="space-y-4">
      <select
        value={documentType}
        onChange={(e) => setDocumentType(e.target.value as any)}
        className="border rounded px-3 py-2"
      >
        <option value="ADMISSION_LETTER">입학허가서</option>
        <option value="INVOICE">학비 청구서</option>
      </select>

      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp"
        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={() => selectedFile && uploadMutation.mutate(selectedFile)}
        disabled={!selectedFile || uploadMutation.isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {uploadMutation.isPending ? "업로드 중..." : "업로드"}
      </button>

      {uploadMutation.isError && (
        <div className="text-red-600">
          {uploadMutation.error instanceof Error
            ? uploadMutation.error.message
            : "업로드 실패"}
        </div>
      )}
    </div>
  );
}
```

### 문서 목록 표시 (구분)

```typescript
export function EnrollmentDocuments({ enrollmentId }: { enrollmentId: string }) {
  const { data: documents = [] } = useQuery({
    queryKey: ["documents", enrollmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollment_documents")
        .select("*")
        .eq("enrollment_id", enrollmentId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const studentDocs = documents.filter((doc) => doc.uploaded_by === "STUDENT");
  const adminDocs = documents.filter((doc) => doc.uploaded_by === "ADMIN");

  return (
    <div className="space-y-6">
      {adminDocs.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mb-3">어드민 업로드</h3>
          <ul className="space-y-2">
            {adminDocs.map((doc) => (
              <DocumentItem key={doc.id} document={doc} />
            ))}
          </ul>
        </section>
      )}

      {studentDocs.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mb-3">학생 제출</h3>
          <ul className="space-y-2">
            {studentDocs.map((doc) => (
              <DocumentItem key={doc.id} document={doc} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
```

---

## 트러블슈팅

### 403 Forbidden: 이 수속 신청에 대한 접근 권한이 없습니다.

**원인:** 어드민이 학생의 enrollment에 파일을 업로드하려 했는데, Edge Function에서 소유권을 검증해 거부함

**해결:**
- 위의 [어드민 업로드 시 주의사항](#어드민-업로드-시-주의사항) 섹션의 방법 A, B, C 중 하나 선택
- 현재 가장 간단한 방법은 **방법 A** (admin-upload action 추가)

### 400 Bad Request: 파일 크기는 10MB 이하여야 합니다.

**원인:** 업로드하는 파일이 10MB를 초과

**해결:**
- 파일 크기 확인
- 필요시 클라이언트에서 이미지 압축 (이미지 파일의 경우)

### 400 Bad Request: 허용되지 않는 파일 형식입니다.

**원인:** PDF/JPG/PNG/WebP가 아닌 다른 포맷 (예: DOC, XLS)

**해결:**
- PDF로 변환 후 업로드
- 필요시 Edge Function에서 허용 타입 추가 (보안 검토 후)

### presigned URL 유효시간 초과

**증상:** "Request has expired" 또는 유사한 R2 에러

**해결:**
- 업로드 URL: 1시간 내에 업로드 완료
- 조회 URL: 15분 내에 접근 완료
- 시간 초과 시 새로 URL 발급 요청

### R2에 업로드는 성공했는데 DB에 저장 실패

**현상:** 파일은 R2에 있지만 enrollment_documents 테이블에 레코드가 없음

**원인:**
- DB 쓰기 권한 부족 (RLS 정책)
- 어드민은 `Admins can upload all documents` 정책으로 보호되어 있음

**해결:**
- Supabase 대시보드에서 RLS 정책 확인
- 어드민 role이 `members.role = 'ADMIN'`으로 정확히 설정되어 있는지 확인

### 어드민이 업로드한 문서를 학생이 못 봄

**원인:** RLS 정책이 `uploaded_by = 'STUDENT'`인 문서만 학생에게 공개하도록 설정되어 있을 가능성

**해결:**
- DB 정책 수정:
  ```sql
  CREATE POLICY "Students can view all documents in their enrollment"
    ON enrollment_documents FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM enrollments
        WHERE enrollments.id = enrollment_documents.enrollment_id
        AND enrollments.user_id = auth.uid()
      )
    );
  ```
  (uploaded_by 조건 제거)

---

## 참고 자료

- [R2 스토리지 아키텍처 문서](/docs/storage-architecture.md)
- [Edge Function 소스 코드](/supabase/functions/storage-presign/index.ts)
- [DB 스키마](/supabase/enrollments.sql)

