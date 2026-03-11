# 수속 신청

> 상태: 구현완료
> 최종 수정일: 2026-03-11
> 관련 페이지: src/pages/enrollment/, src/react-pages/enrollment/, supabase/functions/storage-presign/

## 개요

3단계 위자드 폼으로 어학연수 수속을 신청하고, 신청 후 상세 페이지에서 진행 상태 확인 및 서류 업로드/조회를 수행한다. 파일은 Cloudflare R2에 저장되며, Supabase Edge Function이 presigned URL을 발급한다.

## 문제 정의

어학연수 수속은 어학원 선택 → 코스/기숙사 결정 → 약관 동의 → 서류 제출의 다단계 프로세스다. 사용자가 한 화면에서 단계별로 진행하고, 이후 서류 업로드와 진행 상태를 한 곳에서 관리할 수 있어야 한다.

## 사용자 스토리

- [x] 사용자는 3단계 폼을 통해 수속을 신청할 수 있다
- [x] 사용자는 신청 상세 페이지에서 진행 상태를 확인할 수 있다
- [x] 사용자는 항공권/여행자보험 서류를 업로드할 수 있다
- [x] 사용자는 관리자가 발급한 입학허가서/인보이스를 조회할 수 있다
- [x] 사용자는 업로드한 서류를 교체하거나 삭제할 수 있다

## 요구사항

### Must (필수)

- REQ-034: 3단계 위자드 폼(어학원 선택 → 코스/기숙사/기간 → 약관 동의)으로 수속을 신청한다
- REQ-035: Step 1에서 어학원을 이름/지역/시스템으로 검색하여 선택할 수 있다
- REQ-036: Step 2에서 코스(카드), 기숙사(그리드), 시작일(캘린더, 최소 7일 후), 기간(1~52주, 퀵픽 버튼)을 선택한다
- REQ-037: Step 3에서 이용약관 + 환불 정책에 각각 동의해야 제출 가능하다
- REQ-038: 신청 완료 후 상세 페이지(`/enrollment/:id`)로 이동할 수 있다
- REQ-039: 학생 서류(항공권, 여행자보험)를 R2 presigned URL로 업로드한다
- REQ-040: 관리자 발급 서류(입학허가서, 인보이스)를 조회한다 (이미지: 모달, PDF: 새 탭)
- REQ-041: 수속 진행 상태를 4단계 프로그레스 바로 표시한다

### Nice-to-have (선택)

없음

## 상세 스펙

### UI/UX

#### 신청 페이지 (`/enrollment/apply`)

##### EnrollmentStepper

- 3단계 프로그레스 바 (어학원 선택 → 코스/일정 → 약관 동의)
- 완료: 체크 아이콘, 현재: 링 하이라이트, 미래: 회색

##### Step 1 — 어학원 선택 (StepAcademySelect)

- Combobox (Popover + Command): 이름/지역/시스템 검색
- 각 옵션 하단에 지역/시스템 태그 표시
- 어학원 변경 시 코스/기숙사 선택 초기화

##### Step 2 — 코스/일정 선택 (StepCourseSelect)

- 코스: 카드 선택 (1:1/그룹/선택 수업 시간 표시)
- 기숙사: 그리드 레이아웃 카드 선택
- 시작 희망일: 캘린더 (오늘+7일 이후만 선택 가능)
- 연수 기간: 숫자 입력 + 퀵픽 버튼 (4, 8, 12, 16, 24주)

##### Step 3 — 약관 동의 (StepTermsAgreement)

- 이용약관: 스크롤 가능한 텍스트 + 체크박스
- 환불 정책: 스크롤 가능한 텍스트 + 체크박스
- 학생 메모: 선택 입력 (textarea)

##### 요약 패널 (사이드바)

- 선택한 어학원/코스/기숙사/기간/시작일 요약
- 단계별로 선택 완료된 항목만 표시

##### 성공 화면

- 신청 완료 메시지
- 상세 페이지 이동 링크

#### 상세 페이지 (`/enrollment/:id`)

##### StatusProgress

- 4단계 수평 프로그레스: 신청 접수 → 수속 확정 → 서류 준비 → 출국 준비 완료
- CANCELLED: 프로그레스 대신 빨간 경고 박스

##### 수속 정보

- 어학원명, 코스, 기숙사, 기간, 시작일~종료일, 학생 메모

##### 서류 업로드 (DocumentUploadCard × 2)

- 항공권 (FLIGHT_TICKET), 여행자보험 (TRAVEL_INSURANCE)
- 빈 상태: 점선 업로드 영역
- 업로드 완료: 초록 뱃지 + 파일명 + 미리보기(이미지)/삭제 아이콘
- 이미지: ImagePreviewModal로 미리보기
- 파일 교체: 새 파일 업로드 → 이전 파일 삭제 (fire-and-forget)

##### 수속 서류 조회 (DocumentViewCard × 2)

- 입학허가서 (ADMISSION_LETTER), 인보이스 (INVOICE)
- 관리자가 업로드 — 학생은 조회만 가능
- 이미지: 모달 미리보기, PDF: 새 탭 열기
- 미발급: 점선 빈 상태

### 데이터 모델

#### enrollments 테이블

| 필드 | 타입 | 설명 |
|------|------|------|
| id | uuid (PK) | 수속 ID |
| user_id | uuid (FK → auth.users) | 신청자 |
| academy_id | text | 어학원 ID |
| academy_name | text | 어학원명 |
| course_name | text | 코스명 |
| dormitory_type | text | 기숙사 타입 |
| duration_weeks | integer | 기간 (1~52, CHECK) |
| start_date | date | 시작일 |
| status | enrollment_status | 상태 (기본: PENDING) |
| terms_agreed | boolean | 이용약관 동의 |
| refund_policy_agreed | boolean | 환불 정책 동의 |
| student_note | text (nullable) | 학생 메모 |
| source | text (nullable) | 유입 경로 |
| created_at / updated_at | timestamptz | 시각 |

#### enrollment_documents 테이블

| 필드 | 타입 | 설명 |
|------|------|------|
| id | uuid (PK) | 문서 ID |
| enrollment_id | uuid (FK → enrollments) | 수속 ID |
| document_type | document_type | 서류 종류 |
| uploaded_by | document_uploader | STUDENT / ADMIN |
| file_name | text | 원본 파일명 |
| file_url | text | R2 공개 URL |
| file_size | bigint | 파일 크기 (bytes) |
| mime_type | text | MIME 타입 |
| created_at | timestamptz | 업로드 시각 |

#### EnrollmentStatus (6가지)

PENDING → CONFIRMED → DOCUMENTS_PENDING → READY_TO_DEPART → COMPLETED / CANCELLED

### API

#### 프론트엔드

- `createEnrollment(data)` — enrollments 테이블 insert
- `fetchEnrollmentWithDocuments(id)` — enrollment + documents JOIN 조회
- `fetchMyEnrollments(userId)` — 사용자의 수속 목록 (최신순)
- `uploadDocumentToR2(url, file)` — presigned URL로 R2에 PUT
- `saveDocumentRecord(data)` — enrollment_documents 테이블 insert
- `getUploadPresignedUrl(params)` — Edge Function 호출 (action: upload)
- `deleteDocumentFromR2(documentId)` — Edge Function 호출 (action: delete)

#### Edge Function (`storage-presign`)

| 액션 | 설명 | 권한 검증 |
|------|------|----------|
| upload | presigned PUT URL 발급 | enrollment 소유자 확인 |
| admin-upload | 관리자 전용 업로드 URL | role=ADMIN 검증 |
| view | presigned GET URL (15분) | 소유자 또는 관리자 |
| delete | DB 행 삭제 → R2 파일 삭제 | 소유자 또는 관리자 |

### 커스텀 훅 (`useEnrollment.ts`)

- `useEnrollment(id)` — React Query 래핑
- `useUploadDocument` — 이미지 압축 + presign + R2 업로드 + DB 저장 (병렬 처리)
- `useDeleteDocument` — 삭제 + 캐시 무효화

### 파일 업로드 로직

1. 파일 선택 (10MB 제한, PDF/JPEG/PNG/WebP)
2. 이미지 > 1MB 시 클라이언트 압축 (max 1MB / 1600px, browser-image-compression)
3. presigned URL 요청 (Edge Function)과 이미지 압축을 병렬 실행
4. R2에 PUT 요청
5. DB에 메타데이터 저장
6. 교체 시 이전 파일 삭제 (fire-and-forget)

### 비즈니스 로직

- 단계별 유효성 검사: `trigger(STEP_FIELDS[currentStep])` 통과 후 다음 단계 이동
- 상태 변경은 관리자(admin 프로젝트)에서만 수행 — 서비스는 조회 전용
- RLS: 학생은 본인 수속만 SELECT/INSERT, documents도 본인 수속 것만 조작 가능
- Edge Function upload: `enrollments.user_id = auth.uid()` 확인 후 URL 발급

### 엣지케이스

- 인증 필수: 비로그인 시 로그인 유도 화면
- 파일 교체 중 구 파일 삭제 실패 시 무시 (새 파일 업로드는 정상 진행)
- R2 DELETE 실패 시 고아 파일 발생 가능 (DB 행은 이미 삭제됨)
- 이미지 미리보기 모달: 로딩 중 스피너, 닫을 때 상태 리셋

## 수용 기준 (Acceptance Criteria)

- [x] AC-34: 3단계 위자드를 완료하면 수속이 생성된다 ← REQ-034
- [x] AC-35: 어학원 검색 Combobox로 이름/지역/시스템 검색 후 선택 가능하다 ← REQ-035
- [x] AC-36: 코스/기숙사/시작일/기간을 모두 선택해야 다음 단계로 진행 가능하다 ← REQ-036
- [x] AC-37: 이용약관과 환불 정책 모두 동의해야 제출 가능하다 ← REQ-037
- [x] AC-38: 신청 완료 후 상세 페이지로 이동할 수 있다 ← REQ-038
- [x] AC-39: 항공권/여행자보험 파일을 업로드하면 R2에 저장되고 목록에 표시된다 ← REQ-039
- [x] AC-40: 관리자가 업로드한 입학허가서/인보이스를 이미지 모달 또는 새 탭으로 조회할 수 있다 ← REQ-040
- [x] AC-41: 수속 상태가 4단계 프로그레스 바로 표시되며, 취소 시 경고 박스가 표시된다 ← REQ-041

## 제약 사항

- 로그인 필수 (user_id FK)
- 상태 변경은 admin 프로젝트에서만 가능
- 파일 저장소: Cloudflare R2 (Supabase Storage 아님)
- 허용 파일: PDF, JPEG, PNG, WebP (10MB 제한)
- 이미지 > 1MB 시 자동 압축 (최대 1MB/1600px)

## 미결 사항

없음
