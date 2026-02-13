# 필리핀 어학연수 1인 유학원 플랫폼 PRD (v4)

> **v4 업데이트 요약**
>
> - 실제 구현 결과 반영, 기술 스택 업데이트, 견적 시스템 변경, 디자인 톤 변경
> - 기술 스택: React 19 + Vite 7, React Router v7, Tailwind CSS v4, pnpm
> - 견적 시스템: 어학원 상세 내 시뮬레이터 → **독립 견적 요청 페이지 (`/quote`)** (가격 미노출, 이메일 견적서 발송)
> - 디자인 톤: 블루/그린 바다 느낌 → **cream/brown/terracotta 따뜻한 자연 톤**
> - 신규 페이지: 왜 필리핀 (`/why-philippines`), 수속 절차 (`/process`), 비자 정보 (`/visa-info`)
>
> **v3 업데이트 요약**
>
> - Framework 변경: Next.js → **React + Vite** (SPA, Cloudflare Pages 배포 간편화)
> - 알림 체계 전면 개편:
>   - 관리자 알림: 텔레그램 봇 → **이메일 알림** (단방향, 구현 간편)
>   - 관리자 응답: 텔레그램 답장 → **Admin 페이지에서 직접 입력**
>   - 수속 후 학생 알림: 웹 대시보드 → **SMS 문자** (→ 추후 카카오 알림톡)
> - 견적서 전달: 웹사이트 내 표시 → **이메일로 견적서 발송** (잠재고객 이메일 확보)
> - AI 비서 구조 단순화: Cloudflare Workers 별도 배포 → Workers에서 이메일 발송
> - 폴더 구조: Next.js App Router → React + Vite + React Router

---

## 📌 프로젝트 개요

### 사업 배경

- **사업 형태**: 1인 부업형 필리핀 어학연수 전문 유학원
- **핵심 컨셉**: "다 보여주는 유학원" — 가격 완전 공개, 학원별 솔직 비교, 투명한 수수료 구조
- **목표**: 월 3명 등록 (부업이므로 주 5~8시간 투입)
- **차별화**: 대형 유학원이 정보를 숨기고 상담으로 유도하는 것과 반대로, 모든 정보를 공개하여 신뢰 기반 전환 유도
- **수익 모델**: 어학원 커미션 (학비의 15~30%, 학생에게 수수료 없음)

### 핵심 설계 원칙

1. **시간 최소화**: 부업이므로 자동화 가능한 것은 모두 자동화
2. **학생 셀프서비스**: 학생이 직접 할 수 있는 것은 시스템으로 처리
3. **정보 투명성**: 가격, 학원 정보, 커미션 구조까지 공개
4. **콘텐츠 자산화**: 한 번 만든 콘텐츠가 지속적으로 유입을 만드는 구조
5. **AI 자동화**: AI 비서를 통해 문의 응답, 견적 생성, 상태 알림을 자동 처리

---

## 🏗 시스템 아키텍처

### 기술 스택

| 역할             | 서비스                            | 비고                                        |
| ---------------- | --------------------------------- | ------------------------------------------- |
| Framework        | **React 19 + Vite 7**             | TypeScript 5.9, SPA                         |
| Routing          | **React Router v7**               | 클라이언트 사이드 라우팅                    |
| 패키지 매니저    | **pnpm**                          | npm 대비 디스크 효율, strict 의존성 관리    |
| Styling          | **Tailwind CSS v4**               |                                             |
| UI 컴포넌트      | shadcn/ui                         | (Button, Input, Label, Calendar, Popover, Command, Dialog 설치됨) |
| 배포             | **Cloudflare Pages**              | 정적 파일 호스팅, 상업용 무료               |
| 인증             | **Supabase Auth**                 | 카카오/Google 소셜 로그인, RLS 연동         |
| DB               | **Supabase (PostgreSQL)**         | 클라이언트에서 직접 호출, 500MB 무료        |
| 파일 저장소      | **Cloudflare R2**                 | 여권 사본, 보험증서 등 (10GB 무료)          |
| 서버리스 함수    | **Cloudflare Workers**            | 이메일 발송, AI 처리, SMS 발송, 크론잡      |
| AI API           | Claude API 또는 OpenAI API        | 문의 분류, 자동 응답                        |
| 이메일 발송      | **Resend**                        | 관리자 알림 + 견적서 발송 (월 3,000건 무료) |
| SMS 발송         | **알리고 또는 NHN Cloud**         | 수속 학생 리마인드 (건당 ~20원)일ㄷ         |
| 알림 (관리자)    | **이메일**                        | 문의/수속 알림                              |
| 알림 (수속 학생) | **SMS 문자** → 추후 카카오 알림톡 | 서류 리마인드                               |

#### 기술 스택 선정 이유

**Next.js → React + Vite**: Next.js는 Cloudflare Pages에서 SSR 호환성 이슈가 있음. React SPA는 정적 빌드 후 Cloudflare Pages에 올리면 끝. 배포가 압도적으로 간편하고 디버깅 단순. SEO는 별도 채널(네이버 블로그 등)로 커버.

**Supabase Client 직접 호출**: React SPA에서 Supabase Client가 브라우저에서 DB를 직접 호출. API Route를 별도로 만들 필요 없이 RLS로 접근 제어. 개발 속도가 빠름.

**텔레그램 봇 → 이메일**: 텔레그램 봇은 양방향 파싱이 복잡. 이메일 알림은 단방향 발송만 하면 되므로 구현 난이도가 현저히 낮음. 관리자 응답은 Admin 페이지에서 직접 입력.

**SMS 문자 (수속 후 학생)**: 수속 완료 후 학생은 이메일을 잘 안 봄. 핸드폰 문자/카카오톡이 확인율 높음. 초기에는 SMS, 사업자등록 후 카카오 알림톡으로 전환.

### 월 비용 구조

| 항목                              | 비용                                 |
| --------------------------------- | ------------------------------------ |
| Supabase (Auth + DB)              | $0 (무료 플랜: 500MB DB, 5만 MAU)    |
| Cloudflare (Pages + R2 + Workers) | $0 (무료 플랜)                       |
| Resend (이메일)                   | $0 (월 3,000건 무료)                 |
| SMS 발송                          | ~1,000원/월 (월 3명 × 3~4건 = ~12건) |
| AI API (Claude/OpenAI)            | $5~10                                |
| 도메인                            | 연 $10~15                            |
| **합계**                          | **월 약 8,000~15,000원**             |

### 시스템 구성 (4개 영역)

```
┌─────────────────────────────────────────────────┐
│  1. Public Pages (비로그인)                       │
│  - 랜딩 페이지                                    │
│  - 어학원 비교/검색                                │
│  - 어학원 상세 페이지                              │
│  - 견적 시뮬레이터 → 이메일로 견적서 발송           │
│  - 블로그/후기                                    │
│  - FAQ, 문의 폼                                   │
├─────────────────────────────────────────────────┤
│  2. Student Portal (학생 로그인)                  │
│  - 회원가입/로그인                                 │
│  - 어학원 선택 → 코스/기숙사/기간 선택              │
│  - 견적 확인 및 수속 신청                          │
│  - 여권/개인정보 등록                              │
│  - 출국 준비 정보 등록 (항공권, 보험)               │
│  - 수속 현황 대시보드                              │
├─────────────────────────────────────────────────┤
│  3. Admin Backoffice (관리자 로그인)               │
│  - 수속 신청 관리                                  │
│  - 학생별 상태 관리                                │
│  - 어학원/코스/가격 데이터 관리 (CRUD)              │
│  - 커미션 관리                                    │
│  - 학생 제출 정보 확인                             │
│  - 문의 관리 + 직접 응답                           │
│  - 새 알림 배지 표시                               │
├─────────────────────────────────────────────────┤
│  4. AI 비서 + 알림 시스템 (Cloudflare Workers)     │
│  - 문의 자동 분류 및 응답                          │
│  - 관리자 이메일 알림 발송                          │
│  - 견적서 이메일 발송                              │
│  - 수속 학생 SMS 리마인드 (크론잡)                  │
└─────────────────────────────────────────────────┘
```

---

## 🤖 AI 비서 + 알림 시스템

### 개요

1인 부업으로 시간 최소화가 핵심이므로, AI 비서가 문의 응답·챗봇 상담을 처리하고, 견적서는 Workers에서 자동 계산·발송하며, 알림 시스템이 관리자와 학생에게 적시에 정보를 전달한다.

**AI vs Workers 역할 분리:**

- **견적서 발송**: AI 불필요 → Workers에서 DB 조회 + 계산식 적용으로 자동 처리
- **문의 분류/응답**: AI 필요 → 자연어 이해가 필요한 영역
- **홈페이지 챗봇**: AI 필요 → 대화형 상담, 어학원 추천, 비용 안내 등

**역할 분담:**

- **AI가 하는 일**: 문의 분류, 자동 응답, 홈페이지 챗봇 상담
- **시스템이 하는 일**: 견적서 자동 생성·발송 (Workers), 관리자 이메일 알림, 학생 SMS 리마인드, 백오피스 알림 배지
- **내가 하는 일**: 이메일 알림 확인 → Admin 페이지에서 처리 (어학원 확인 후 결과 입력)

### 알림 채널 정리

| 상황               | 대상           | 채널     | 이유                        |
| ------------------ | -------------- | -------- | --------------------------- |
| 새 문의/수속 신청  | 관리자         | 이메일   | 단방향 알림, 구현 간편      |
| 복잡 문의 접수     | 관리자         | 이메일   | 내용 요약 포함              |
| 견적서 전달        | 학생 (수속 전) | 이메일   | 금액 궁금하니까 바로 확인함 |
| 서류 제출 리마인드 | 학생 (수속 후) | SMS 문자 | 이메일 안 봄, 문자는 확인함 |
| 상태 변경 안내     | 학생 (수속 후) | SMS 문자 | 즉시 확인 필요              |

### 기능 상세

#### 1. 문의 접수 & 자동 분류

웹 폼으로 들어온 문의를 AI가 분석하여 자동 처리 여부를 결정한다.

**자동 응답 가능 (간단한 문의):**

- 어학원 정보, 가격, 코스 종류, 기숙사, 지역 비교
- DB에 있는 정보를 기반으로 AI가 응답 생성
- 응답을 DB에 저장 → 학생이 웹사이트에서 확인 가능
- 관리자에게도 이메일로 "AI 자동 응답 완료" 알림

**관리자에게 넘김 (복잡한 문의):**

- 특수 상황 (비자 문제, 미성년자, 환불, 맞춤 스케줄 등)
- 관리자 이메일로 내용 요약 + "답변하기" 링크 (Admin 페이지 직접 이동)

#### 2. 견적서 이메일 발송 (Workers 자동 처리)

견적 요청 페이지(`/quote`)에서 조건 선택 후, 견적서를 이메일로 받을 수 있다.
**AI 불필요** — DB 조회 + 미리 정해둔 계산식으로 Workers에서 자동 생성·발송.

**입력 정보:** (견적 요청 폼에서 수집)

- 이메일, 이름, 어학원, 코스, 시작일, 주수, 기숙사 타입

**발송되는 견적서 내용:**

- 선택한 어학원, 코스, 기숙사, 기간
- 비용 상세 (학비, 기숙사비, 등록금, SSP, 비자연장비, 교재비, 할인, 최종금액)
- USD + 원화 환산 참고 금액
- "수속 신청하기" CTA 링크
- 유학원 연락처 (카카오톡)

**잠재고객 확보:**

- 이메일 입력 = 잠재고객 리드
- `QuoteLog` 테이블에 이메일 + 견적 내용 저장
- **횟수 제한 없음** — 견적 발송 비용이 0원(Resend 무료)이므로 제한 불필요
- 이메일별 요청 이력 추적 → 관리자가 다회 조회자에게 직접 상담 연락 판단
- 관리자에게 이메일 알림: "새 견적 요청 — 김OO / SMEAG / ESL 8주"

#### 3. 관리자 이메일 알림

Cloudflare Workers + Resend로 관리자에게 이메일 알림을 보낸다.

**알림 유형:**

| 유형           | 제목 예시                                 |
| -------------- | ----------------------------------------- |
| 새 문의        | `[새 문의] 김OO — 세부 / ESL 8주 / 2인실` |
| 복잡 문의      | `[상담 필요] 비자 연장 관련 — 이OO`       |
| 새 견적 요청   | `[견적] 박OO — SMEAG Capital / ESL 12주`  |
| 새 수속 신청   | `[수속 신청] 최OO — CPI / IELTS 8주`      |
| 서류 제출 완료 | `[서류 확인] 김OO 출국 서류 등록 완료`    |

**이메일 내 "Admin에서 확인하기" 링크**: 클릭 시 해당 문의/수속 건의 Admin 페이지로 바로 이동

#### 4. 입학일 확인 흐름 (단순화)

```
수속 신청 접수 (status: QUOTE_REQUESTED)
        ↓
  관리자 이메일 알림
  "[수속 신청] 김OO — SMEAG Capital / ESL 8주 / 3월 10일"
        ↓
  이메일 내 링크 클릭 → Admin 수속 상세 페이지 이동
        ↓
  관리자가 어학원에 직접 확인 (카카오톡/전화)
        ↓
  Admin 페이지에서 결과 입력:
  - 입학 가능 여부, 확정 입학일
  - 상태 변경: QUOTE_REQUESTED → CONFIRMED (또는 날짜 조정)
        ↓
  학생에게 SMS 발송: "입학이 확정되었습니다. 3월 17일 입학, 상세 확인: [링크]"
  (또는 학생 대시보드에 반영)
```

**관리자가 하는 일**: 이메일 확인 → 어학원에 카톡/전화 → Admin 페이지에서 결과 입력

#### 5. 수속 학생 SMS 리마인드 (크론잡)

Cloudflare Workers Cron Trigger로 매일 1회 실행.

**리마인드 로직:**

```
매일 체크:
  1. start_date - 30일: 항공권 미등록 → SMS "출발 한 달 전입니다. 항공권 정보를 등록해주세요."
  2. start_date - 21일: 여행자보험 미가입 → SMS "여행자보험 가입 후 등록해주세요."
  3. start_date - 14일: 여권 미등록 → SMS "여권 사본을 등록해주세요."
  4. start_date - 7일: 미등록 서류 있으면 → SMS "출발 일주일 전입니다. 미등록 서류를 확인해주세요."
```

**SMS 내용**: 짧고 명확하게 + 웹사이트 링크 포함
예: `[필리핀유학] 출발 30일 전! 항공권 정보를 등록해주세요. https://site.com/my`

#### 6. 기술 구조

```
React SPA (Cloudflare Pages — 정적 호스팅)
  ├── Supabase Client (브라우저에서 DB 직접 호출)
  ├── Supabase Auth (인증)
  └── Cloudflare R2 (파일 업로드)

Cloudflare Workers (서버리스 함수)
  ├── /api/notify       → Resend로 관리자 이메일 발송
  ├── /api/quote-email  → 견적서 이메일 발송
  ├── /api/sms          → SMS 발송 (알리고/NHN Cloud)
  ├── /api/ai-classify  → AI 문의 분류 + 자동 응답
  └── Cron Trigger      → 매일 서류 리마인드 체크
```

- React SPA에서 Supabase에 직접 데이터 CRUD
- 이메일/SMS/AI 처리만 Cloudflare Workers에서 담당 (서버 사이드 API 키 보호)
- Workers는 단순한 HTTP 엔드포인트로, 텔레그램 봇 같은 양방향 로직 없음

---

## 📊 데이터 모델

### ERD 개요

```
Academy (어학원)
  ├── Course (코스)
  ├── Dormitory (기숙사)
  ├── AcademyImage (이미지)
  └── AcademyReview (후기)

User (사용자)
  └── Enrollment (수속)
       ├── TravelDocument (출국 준비 정보)
       └── Payment (결제 정보)

QuoteLog (견적 조회 + 잠재고객 이메일)
Inquiry (문의)
Notification (알림 로그)
```

### 테이블 상세

#### `Academy` (어학원)

```sql
id              UUID        PK
name            VARCHAR     어학원 이름 (예: "SMEAG Capital")
name_en         VARCHAR     영문 이름
region          ENUM        지역 (CEBU, BAGUIO, CLARK, MANILA, OTHER)
style           ENUM        스타일 (SPARTA, SEMI_SPARTA, FREESTYLE)
description     TEXT        어학원 소개 (마크다운)
short_desc      VARCHAR     한줄 소개
address         VARCHAR     주소
map_lat         DECIMAL     위도
map_lng         DECIMAL     경도
facilities      TEXT[]      시설 목록 (예: ["수영장", "헬스장", "카페"])
pros            TEXT[]      장점 리스트
cons            TEXT[]      단점 리스트
recommended_for TEXT[]      추천 대상 (예: ["단기 집중", "직장인", "초보자"])
homepage_url    VARCHAR     어학원 홈페이지
is_active       BOOLEAN     활성 여부
sort_order      INT         정렬 순서
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

#### `Course` (코스)

```sql
id              UUID        PK
academy_id      UUID        FK → Academy
name            VARCHAR     코스 이름 (예: "ESL General", "IELTS Intensive")
category        ENUM        카테고리 (ESL, IELTS, TOEIC, TOEFL, BUSINESS, JUNIOR, OTHER)
description     TEXT        코스 설명
classes_per_day INT         일일 수업 수 (예: 8)
man_to_man      INT         1:1 수업 수 (예: 4)
group_class     INT         그룹 수업 수 (예: 3)
optional_class  INT         선택 수업 수 (예: 1)
price_per_week  DECIMAL     주당 학비 (USD)
min_weeks       INT         최소 등록 주수 (보통 1 또는 4)
max_weeks       INT         최대 등록 주수
is_active       BOOLEAN
sort_order      INT
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

#### `Dormitory` (기숙사)

```sql
id              UUID        PK
academy_id      UUID        FK → Academy
room_type       ENUM        방 타입 (SINGLE, DOUBLE, TRIPLE, QUAD, FIVE, SIX)
description     TEXT        방 설명
price_per_week  DECIMAL     주당 기숙사비 (USD)
includes_meals  BOOLEAN     식사 포함 여부
meal_info       VARCHAR     식사 정보 (예: "주 3식 제공")
is_active       BOOLEAN
sort_order      INT
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

#### `AcademyImage` (어학원 이미지)

```sql
id              UUID        PK
academy_id      UUID        FK → Academy
image_url       VARCHAR     이미지 URL (Cloudflare R2)
alt_text        VARCHAR     대체 텍스트
category        ENUM        카테고리 (EXTERIOR, CLASSROOM, DORMITORY, FACILITY, FOOD, SURROUNDING)
sort_order      INT
created_at      TIMESTAMP
```

#### `AcademyReview` (후기)

```sql
id              UUID        PK
academy_id      UUID        FK → Academy
author_name     VARCHAR     작성자 이름 (익명 가능)
rating          INT         평점 (1~5)
duration_weeks  INT         수강 기간
course_name     VARCHAR     수강 코스
content         TEXT        후기 내용
created_at      TIMESTAMP
is_visible      BOOLEAN     노출 여부
```

#### `User` (사용자)

```sql
id              UUID        PK
supabase_uid    VARCHAR     Supabase Auth 사용자 ID
role            ENUM        역할 (STUDENT, ADMIN)
name            VARCHAR     이름
name_en         VARCHAR     영문 이름 (여권 기준)
email           VARCHAR
phone           VARCHAR     전화번호 (수속 시 필수 — SMS 알림용)
kakao_id        VARCHAR     카카오톡 ID
birth_date      DATE        생년월일
gender          ENUM        성별 (MALE, FEMALE)
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

#### `Enrollment` (수속)

```sql
id              UUID        PK
user_id         UUID        FK → User
academy_id      UUID        FK → Academy
status          ENUM        수속 상태 (아래 상태 머신 참고)

-- 선택 정보
course_id       UUID        FK → Course
dormitory_id    UUID        FK → Dormitory
duration_weeks  INT         등록 주수
start_date      DATE        희망 입학일
end_date        DATE        자동 계산 (start_date + duration_weeks)

-- 비용 정보
tuition_fee     DECIMAL     학비 (자동 계산: course.price_per_week × duration_weeks)
dormitory_fee   DECIMAL     기숙사비 (자동 계산: dormitory.price_per_week × duration_weeks)
total_fee       DECIMAL     총 비용
discount_rate   DECIMAL     할인율 (최대 10%)
final_fee       DECIMAL     최종 금액 (total_fee × (1 - discount_rate))
currency        VARCHAR     통화 (USD 기본)

-- 메모
student_note    TEXT        학생 메모 (추가 요청사항)
admin_note      TEXT        관리자 메모 (내부용)

created_at      TIMESTAMP
updated_at      TIMESTAMP
```

#### Enrollment 상태 머신 (status)

```
QUOTE_REQUESTED     견적 요청 (학생이 코스/기숙사 선택 후 신청)
    ↓
AVAILABILITY_CHECK  입학 가능 여부 확인 중 (관리자가 어학원에 확인)
    ↓
CONFIRMED           입학 확정 (어학원에서 자리 확인됨)
    ↓
PAYMENT_PENDING     등록금 납입 대기
    ↓
PAYMENT_COMPLETED   등록금 납입 완료
    ↓
DOCUMENTS_PENDING   출국 서류 등록 대기 (항공권, 보험 등)
    ↓
READY_TO_DEPART     출국 준비 완료
    ↓
DEPARTED            출국 완료 (현지 수업 중)
    ↓
COMPLETED           수료/귀국 완료

CANCELLED           취소 (어느 단계에서든 가능)
```

#### `TravelDocument` (출국 준비 정보)

```sql
id              UUID        PK
enrollment_id   UUID        FK → Enrollment

-- 여권 정보
passport_name   VARCHAR     여권상 영문 이름
passport_number VARCHAR     여권 번호
passport_expiry DATE        여권 만료일
passport_file   VARCHAR     여권 사본 파일 URL (Cloudflare R2)

-- 항공권 정보
flight_departure_date   DATE        출발일
flight_departure_flight VARCHAR     출발 항공편 (예: "5J 189")
flight_arrival_time     TIME        도착 시간 (현지 시간)
flight_return_date      DATE        귀국일
flight_return_flight    VARCHAR     귀국 항공편
flight_file             VARCHAR     항공권 캡처 파일 URL (Cloudflare R2)

-- 여행자보험
insurance_company   VARCHAR     보험사
insurance_product   VARCHAR     상품명
insurance_start     DATE        보험 시작일
insurance_end       DATE        보험 종료일
insurance_file      VARCHAR     보험증서 파일 URL (Cloudflare R2)

-- 픽업
airport_pickup      BOOLEAN     공항 픽업 요청 여부
pickup_note         VARCHAR     픽업 관련 메모

created_at      TIMESTAMP
updated_at      TIMESTAMP
```

#### `Payment` (결제 정보)

```sql
id              UUID        PK
enrollment_id   UUID        FK → Enrollment
amount          DECIMAL     금액
currency        VARCHAR     통화
payment_method  VARCHAR     결제 방법 (계좌이체 등)
payment_date    DATE        입금일
confirmed_at    TIMESTAMP   관리자 확인일
admin_note      VARCHAR     관리자 메모
status          ENUM        (PENDING, CONFIRMED, REFUNDED)
created_at      TIMESTAMP
```

#### `Commission` (커미션 — 관리자 전용)

```sql
id              UUID        PK
enrollment_id   UUID        FK → Enrollment
academy_id      UUID        FK → Academy
amount          DECIMAL     커미션 금액
currency        VARCHAR     통화
status          ENUM        (PENDING, RECEIVED, OVERDUE)
expected_date   DATE        예상 입금일
received_date   DATE        실제 입금일
note            VARCHAR     메모
created_at      TIMESTAMP
```

#### `QuoteLog` (견적 조회 + 잠재고객)

```sql
id              UUID        PK
user_id         UUID        FK → User (nullable, 비로그인 시 null)
name            VARCHAR     이름
email           VARCHAR     이메일 (견적서 수신 + 잠재고객 식별)
academy_id      UUID        FK → Academy
course_name     VARCHAR     선택한 코스명
dormitory_type  VARCHAR     선택한 기숙사 타입
duration_weeks  INT         연수 기간 (주)
start_date      DATE        수업 시작 희망일
email_sent      BOOLEAN     견적서 이메일 발송 여부
created_at      TIMESTAMP
```

**잠재고객 추적:**

- `email` 기준으로 요청 이력 추적 (횟수 제한 없음)
- 다회 조회자는 관심도 높은 잠재고객 → 관리자가 직접 상담 연락 판단

#### `Inquiry` (문의)

```sql
id              UUID        PK
user_id         UUID        FK → User (nullable)
name            VARCHAR     문의자 이름
email           VARCHAR     문의자 이메일
phone           VARCHAR     연락처
message         TEXT        문의 내용
category        ENUM        (GENERAL, PRICE, VISA, ENROLLMENT, OTHER)
status          ENUM        (NEW, AI_REPLIED, ADMIN_REQUIRED, RESOLVED)
ai_response     TEXT        AI 자동 응답 내용
admin_response  TEXT        관리자 직접 응답 내용
admin_note      TEXT        관리자 내부 메모
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

**문의 처리 흐름:**

1. 학생이 웹 폼으로 문의 → `status: NEW`
2. AI가 분류 → 간단한 문의: 자동 응답 생성 → `status: AI_REPLIED` → 관리자 이메일 알림
3. 복잡한 문의: → `status: ADMIN_REQUIRED` → 관리자 이메일 알림 (내용 요약 + Admin 링크)
4. 관리자가 Admin 페이지에서 응답 입력 → `status: RESOLVED`

#### `Notification` (알림 로그) ← 신규

```sql
id              UUID        PK
type            ENUM        (EMAIL, SMS)
recipient       VARCHAR     수신자 (이메일 또는 전화번호)
subject         VARCHAR     제목 (이메일) 또는 내용 요약
content         TEXT        발송 내용
related_type    ENUM        (INQUIRY, ENROLLMENT, QUOTE, DOCUMENT_REMIND)
related_id      UUID        관련 레코드 ID
sent_at         TIMESTAMP   발송 시각
status          ENUM        (SENT, FAILED)
error_message   TEXT        실패 시 에러 메시지
created_at      TIMESTAMP
```

---

## 📄 페이지별 상세 기능 명세

### 1. Public Pages (비로그인 접근 가능)

#### 1-1. 랜딩 페이지 (`/`)

- Hero 섹션: 핵심 카피 + CTA (어학원 비교하기)
- 왜 필리핀 어학연수인가 (1:1 수업, 가성비, 가까운 거리)
- "다 보여주는 유학원" 차별점 강조 (가격 공개, 솔직 비교)
- 인기 어학원 미리보기 (3~4개 카드)
- 간단 비용 시뮬레이터 (기간/지역 선택 → 예상 비용 범위)
- **AI 챗봇**: 대화형 상담 UI (어학원 추천, 비용 문의, 수속 절차 안내 등)
- 학생 후기 캐러셀
- CTA: 어학원 비교하기 / 무료 견적 받기 / 카카오톡 상담

#### 1-2. 어학원 리스트 페이지 (`/academies`)

- **필터 사이드바**:
  - 지역: 세부 / 바기오 / 클락 / 마닐라
  - 스타일: 스파르타 / 세미스파르타 / 자율형
  - 코스: ESL / IELTS / TOEIC / 비즈니스 / 주니어
  - 가격대: 월 100만원 이하 / 100~150만원 / 150~200만원 / 200만원 이상
  - 시설: 수영장 / 헬스장 / 카페 등 (체크박스)
- **어학원 카드**: 대표 이미지, 이름, 지역, 스타일, 1인실 4주 기준 가격, 한줄 소개, 평점
- **정렬**: 추천순 / 가격 낮은순 / 가격 높은순 / 평점순
- **비교 기능**: 최대 3개 어학원 체크 → 비교 페이지로 이동

#### 1-3. 어학원 상세 페이지 (`/academy/:id`)

- 이미지 갤러리 (시설, 교실, 기숙사, 식당, 주변환경)
- 기본 정보 (지역, 스타일, 시설, 주소, 지도)
- 장점/단점 솔직 정리
- 추천 대상 (어떤 사람에게 맞는지)
- **코스 목록**: 코스별 수업 구성, 주당 가격
- **기숙사 목록**: 방 타입별 가격, 시설 설명
- **견적 요청 연결**:
  - "견적서 이메일로 받기" 버튼 → `/quote` 페이지로 이동
  - "이 조건으로 수속 신청" 버튼 → `/quote` 페이지로 이동
  - 어학원 상세에서는 코스/기숙사 목록만 표시 (가격 포함)
- 후기 섹션
- CTA: 수속 신청 / 카카오톡 상담

#### 1-4. 어학원 비교 페이지 (`/compare?ids=a,b,c`)

- 선택한 2~3개 어학원을 나란히 비교
- 비교 항목: 지역, 스타일, 시설, 코스 가격, 기숙사 가격, 장단점, 추천 대상
- 테이블 형태로 한눈에 비교 가능

#### 1-5. 비용 가이드 페이지 (`/cost-guide`)

- 필리핀 어학연수 총비용 구조 설명
- 학비 + 기숙사 + 현지 비용(SSP, 비자연장, 교재비 등) + 항공권 + 보험 + 용돈
- 기간별 예상 총비용 테이블 (4주/8주/12주/24주)
- "정확한 견적은 어학원 상세에서 확인하세요" CTA

#### 1-6. FAQ 페이지 (`/faq`)

- 아코디언 형태
- 카테고리: 비용, 어학원 선택, 수속 절차, 현지 생활, 비자/서류

#### 1-7. 블로그 (`/blog`)

- 마크다운 기반 포스팅
- 카테고리: 어학원 리뷰, 지역 가이드, 준비 가이드, 비용 정보, 학생 후기

#### 1-8. 문의 폼 (`/contact`)

- 이름, 이메일, 연락처, 문의 내용 입력
- 제출 시 → `Inquiry` 테이블 저장 → AI 분류 → 자동 응답 또는 관리자 이메일 알림
- "문의가 접수되었습니다. 빠르게 답변드릴게요!" 확인 메시지

#### 1-9. 견적 요청 페이지 (`/quote`)

독립적인 견적 요청 폼. 사이트 전체의 "무료 견적받기" CTA가 이 페이지로 연결된다.

**입력 필드:**

- 이메일 (필수, 유효성 검사)
- 이름 (필수)
- 관심 어학원 (필수, 검색 가능한 Combobox — shadcn Command + Popover)
- 코스 (필수, 어학원 선택 시 해당 어학원 코스만 노출)
- 수업 시작 희망일 (필수, Calendar 날짜 선택 — 최소 1주 후부터 선택 가능)
- 연수 기간 (필수, 숫자만 입력, 주 단위)
- 기숙사 타입 (필수, 어학원 선택 시 해당 어학원 기숙사만 노출)

**가격 미노출 정책:**

- 폼에서는 가격을 일체 표시하지 않음
- 실제 견적서에 등록금, 학비, 기숙사비, SSP, 비자연장비, 할인율 등을 종합 적용
- 견적서는 이메일로 발송 (Workers + Resend, 추후 구현)

**레이아웃:**

- 좌측: 폼 영역 (모바일에서는 전체 너비)
- 우측: 요청 요약 사이드바 (선택한 어학원, 코스, 기숙사, 일정 표시)
- 제출 후 성공 화면 표시

**데이터 흐름:**

- 제출 시 → QuoteLog 테이블 저장 (추후 Supabase 연동)
- 관리자에게 이메일 알림 (추후 Workers 연동)
- 견적서 이메일 발송 (추후 Workers + Resend 연동)

#### 1-10. 왜 필리핀 어학연수 페이지 (`/why-philippines`)

- 필리핀 어학연수의 장점 소개 (1:1 수업, 가성비, 접근성 등)
- 다른 국가 대비 비교 (비용, 수업 시간 등)
- CTA: 어학원 둘러보기, 무료 견적 받기

#### 1-11. 수속 절차 안내 페이지 (`/process`)

- 어학연수 수속 절차 단계별 안내
- 타임라인 형태로 각 단계 설명
- CTA: 무료 견적 받기

#### 1-12. 비자 정보 페이지 (`/visa-info`)

- 필리핀 비자 종류 및 연장 절차
- SSP(특별학업허가증), ACR I-Card 등 현지 발급 서류 안내
- 기간별 예상 비용 안내
- CTA: 무료 견적 받기

---

### 2. Student Portal (로그인 필요)

#### 2-1. 회원가입/로그인

- **Supabase Auth** 기반 인증
- 소셜 로그인: 카카오 (필수), Google (선택)
- 회원가입 시 추가 정보: 이름, 전화번호 (필수 — SMS 알림용), 카카오톡 ID
- role: STUDENT (기본)

#### 2-2. 마이페이지 대시보드 (`/my`)

- 현재 수속 현황 요약
- 진행중인 수속이 있으면 → 상태 프로그레스 바 + 다음 할 일 안내
- 수속이 없으면 → "어학원 둘러보기" CTA
- 내 문의 내역 확인
- AI 응답 / 관리자 응답 확인

#### 2-3. 수속 신청 플로우 (`/my/enroll`)

**Step 1: 어학원 확인**

- Public 페이지에서 선택한 어학원 정보 표시
- 변경 가능

**Step 2: 코스 선택**

- 해당 어학원의 코스 리스트 (라디오 버튼)
- 각 코스별 수업 구성, 가격 표시

**Step 3: 기숙사 선택**

- 해당 어학원의 기숙사 옵션 (라디오 버튼)
- 방 타입별 가격, 식사 포함 여부 표시

**Step 4: 기간 및 일정 선택**

- 기간: 드롭다운 (4주, 8주, 12주, 16주, 20주, 24주)
- 희망 입학일: 달력에서 선택 (보통 월요일만 선택 가능)
- 종료일 자동 계산

**Step 5: 견적 확인 및 신청**

- 선택 내용 요약
- 비용 계산:
  - 학비: course.price_per_week × duration_weeks
  - 기숙사비: dormitory.price_per_week × duration_weeks
  - 소계
  - 할인 (최대 10%)
  - 최종 금액
- 추가 메모 입력란 (선택)
- 이용약관 동의 체크박스
- "수속 신청" 버튼

→ Enrollment 레코드 생성 (status: QUOTE_REQUESTED)
→ 관리자에게 이메일 알림 + Admin 알림 배지

#### 2-4. 수속 현황 페이지 (`/my/enrollment/:id`)

**상태별 UI:**

```
[ QUOTE_REQUESTED ] 수속 신청이 접수되었습니다. 입학 가능 여부를 확인하고 있어요.
    → 예상 소요: 1~2 영업일

[ AVAILABILITY_CHECK ] 어학원에 입학 가능 여부를 확인하고 있습니다.
    → 예상 소요: 1~2 영업일

[ CONFIRMED ] 입학이 확정되었습니다! 등록금을 납입해주세요.
    → 입금 안내 표시 (계좌, 금액, 입금 기한)

[ PAYMENT_PENDING ] 등록금 납입을 기다리고 있습니다.
    → 입금 계좌 + 금액 안내
    → "입금 완료" 알림 버튼 (학생이 입금 후 클릭 → 관리자 확인)

[ PAYMENT_COMPLETED ] 등록금이 확인되었습니다. 출국 준비 정보를 등록해주세요.
    → 출국 준비 폼 링크

[ DOCUMENTS_PENDING ] 출국 서류를 등록해주세요.
    → 체크리스트:
      ☐ 여권 정보
      ☐ 항공권 정보
      ☐ 여행자보험

[ READY_TO_DEPART ] 출국 준비가 완료되었습니다! 🎉
    → 오리엔테이션 자료 다운로드 링크
    → D-day 카운트다운
    → 체크리스트 (준비물 등)

[ DEPARTED ] 현지에서 열심히 공부하고 계시네요! 💪
    → 어학원 연락처, 비상 연락처 표시

[ COMPLETED ] 수료를 축하합니다! 🎓
    → 후기 작성 요청 링크
```

**공통 요소:**

- 프로그레스 바 (전체 단계 중 현재 위치)
- 선택한 어학원/코스/기숙사/기간 정보 요약
- 비용 요약
- 카카오톡 상담 연결 버튼

#### 2-5. 출국 준비 정보 등록 (`/my/enrollment/:id/travel`)

status가 PAYMENT_COMPLETED 또는 DOCUMENTS_PENDING일 때 접근 가능.

**여권 정보 섹션:**

- 영문 이름 (여권 기준)
- 여권 번호
- 여권 만료일
- 여권 사본 업로드 (이미지 또는 PDF) → Cloudflare R2 저장
- 저장 버튼

**항공권 정보 섹션:**

- 출발일
- 출발 항공편명 (예: 5J 189)
- 도착 시간 (현지 시간)
- 귀국일
- 귀국 항공편명
- 항공권 캡처 업로드 → Cloudflare R2 저장
- 저장 버튼

**여행자보험 섹션:**

- 보험사
- 상품명
- 보험 기간 (시작일~종료일)
- 보험증서 업로드 → Cloudflare R2 저장
- 저장 버튼
- ※ 추천 보험 가이드 링크

**픽업 요청:**

- 공항 픽업 요청 여부 (토글)
- 픽업 관련 메모

각 섹션은 독립적으로 저장 가능 (한 번에 다 안 해도 됨).
모든 필수 항목이 채워지면 → 관리자에게 이메일 알림 → 관리자 확인 후 status를 READY_TO_DEPART로 변경.

---

### 3. Admin Backoffice (관리자 전용)

#### 3-1. 접근 제어

- Supabase Auth의 role 기반 접근: role === "ADMIN"인 사용자만 접근
- React Router에서 ProtectedRoute 컴포넌트로 role 체크
- URL prefix: `/admin/*`

#### 3-2. 대시보드 (`/admin`)

- **새 알림 배지**: 미처리 문의 건수, 새 수속 신청 건수
- 이번 달 수속 현황 요약 (상태별 건수)
- 최근 수속 신청 목록
- 이번 달 예상 커미션
- 액션 필요한 항목 하이라이트 (새 신청, 입금 확인 필요 등)
- 최근 문의 현황 (AI 처리 / 관리자 대기 건수)

#### 3-3. 수속 관리 (`/admin/enrollments`)

- 전체 수속 리스트 (테이블)
- 필터: 상태별, 어학원별, 기간별
- 각 행: 학생 이름, 어학원, 코스, 기간, 상태, 신청일
- 클릭 → 상세 관리 페이지

#### 3-4. 수속 상세 관리 (`/admin/enrollments/:id`)

- 학생 정보 표시
- 선택한 어학원/코스/기숙사/기간/비용 표시
- **상태 변경 버튼**: 현재 상태에서 다음 상태로 전환 (드롭다운 or 버튼)
- **상태 변경 시 학생에게 SMS 자동 발송** (선택 가능)
- 학생이 등록한 출국 준비 정보 확인
- 관리자 메모 입력
- 커미션 정보 입력/수정

#### 3-5. 어학원 관리 (`/admin/academies`)

- 어학원 CRUD (생성, 수정, 삭제)
- 코스 CRUD (어학원별)
- 기숙사 CRUD (어학원별)
- 이미지 업로드/관리 → Cloudflare R2
- 활성/비활성 토글

#### 3-6. 커미션 관리 (`/admin/commissions`)

- 커미션 리스트 (수속 건별)
- 상태: 대기 / 수령 / 연체
- 월별 커미션 요약

#### 3-7. 문의 관리 (`/admin/inquiries`)

- 전체 문의 리스트 (테이블)
- 필터: 상태별 (NEW, AI_REPLIED, ADMIN_REQUIRED, RESOLVED)
- AI 자동 응답 내용 확인
- **관리자 직접 응답 입력** → 저장 시 status: RESOLVED
- 관리자 내부 메모

#### 3-8. 잠재고객 관리 (`/admin/leads`)

- QuoteLog 기반 잠재고객 리스트
- 이름, 이메일, 견적 내용, 요청 횟수, 희망 시작일
- 수속 전환 여부 표시

---

## 🔄 핵심 비즈니스 로직

### 견적 계산 공식

```
학비 = course.price_per_week × duration_weeks
기숙사비 = dormitory.price_per_week × duration_weeks
소계 = 학비 + 기숙사비
할인 = 소계 × discount_rate (최대 10%)
최종금액 = 소계 - 할인
```

참고: 가격은 USD 기준으로 저장하고, 프론트에서 원화 환산 표시도 제공 (환율은 고정값 또는 외부 API).

**참고: 견적 요청 폼에서는 가격을 노출하지 않음**

- 프론트엔드 폼에서는 어학원, 코스, 기숙사, 기간만 선택
- 실제 견적 금액은 백엔드(Workers)에서 계산하여 이메일로 발송
- 견적에 포함되는 항목: 학비, 기숙사비, 등록금, SSP, 비자연장비, 교재비, 할인
- 이를 통해 정확한 최종 금액만 고객에게 전달

### 견적 발송 로직

```
1. 견적 요청 폼(/quote) 제출
2. QuoteLog 테이블에 저장
3. Workers에서 DB 조회 → 계산식 적용 → 견적서 이메일 발송 (횟수 제한 없음)
4. 관리자에게 이메일 알림 발송
5. 다회 조회자는 Admin 잠재고객 관리에서 확인 → 직접 상담 연락 판단
```

### 할인 정책

- 최대 할인율: 총 학비의 10%
- 모든 유학원이 동일한 할인율 상한 적용
- 할인율은 관리자가 수속 건별로 설정 가능

### 입학일 규칙

- 대부분의 어학원은 **매주 월요일 입학** 가능
- 일부 학원은 격주 또는 월 1회만 입학 가능
- Academy 테이블에 `entry_schedule` 필드 추가 고려 (WEEKLY, BIWEEKLY, MONTHLY)
- 정확한 입학 가능 여부는 관리자가 어학원에 확인 후 Admin 페이지에서 결과 입력

### 알림 체계

**수속 전 (잠재고객):**

- 견적서 → 이메일 발송 (Resend)
- 문의 응답 → 웹사이트에서 확인

**수속 후 (등록 학생):**

- 상태 변경 알림 → SMS 문자
- 서류 리마인드 → SMS 문자 (크론잡: D-30, D-21, D-14, D-7)
- 추후 → 카카오 알림톡으로 전환 (사업자등록 후)

**관리자:**

- 모든 알림 → 이메일 (Resend)
- Admin 페이지 → 새 알림 배지

---

## 🎨 UI/UX 가이드라인

### 디자인 톤

- 깔끔하고 신뢰감 있는 디자인
- 따뜻하고 자연스러운 톤: cream(#FBF7F0), brown(#8B6F4E), terracotta(#C4603A)
- 메인 컬러: terracotta(#C4603A) — CTA, 강조, 링크
- 보조 컬러: accent-green(#4A8C5C) — 긍정적 상태, 배지
- 배경: cream(#FBF7F0), 카드: white, 보더: beige-dark(#E8DFD1)
- 폰트: Noto Sans KR (본문) + Gowun Batang (세리프, 강조)
- 정보 밀도가 높으므로 여백과 타이포그래피로 가독성 확보

### 반응형

- 모바일 퍼스트 (상담 유입의 대부분이 모바일)
- **Admin 페이지도 모바일 반응형** (관리자가 핸드폰에서 이메일 알림 → Admin 접속하여 처리)
- 데스크탑 / 태블릿 / 모바일 3단계 브레이크포인트

### 핵심 UX 원칙

- 어학원 비교와 가격이 한눈에 보여야 함
- 견적 시뮬레이터는 인터랙티브하게 (슬라이더/드롭다운 변경 즉시 반영)
- 수속 진행 상태가 명확하게 보여야 함 (불안감 해소)
- CTA는 항상 "카카오톡 상담" + "온라인 수속 신청" 두 경로 제공
- 견적 요청이 간편해야 리드 확보율이 높아짐 (횟수 제한 없음)
- **"견적서 이메일로 받기"가 자연스러운 리드 수집 수단**

---

## 📁 프로젝트 폴더 구조

```
project-root/
├── public/                       # 정적 파일
├── src/
│   ├── components/
│   │   ├── ui/                   # shadcn/ui 컴포넌트
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── calendar.tsx
│   │   │   └── command.tsx
│   │   ├── Navbar.tsx            # 네비게이션 헤더
│   │   └── Footer.tsx            # 푸터
│   │
│   ├── data/
│   │   └── academies.ts          # 어학원 정적 데이터 (추후 Supabase 전환)
│   │
│   ├── lib/
│   │   └── utils.ts              # 유틸리티 (cn 헬퍼 등)
│   │
│   ├── pages/
│   │   ├── HomePage.tsx           # 랜딩 페이지 (/)
│   │   ├── AcademySearchPage.tsx  # 어학원 검색 (/academies)
│   │   ├── AcademyDetailPage.tsx  # 어학원 상세 (/academy/:id)
│   │   ├── QuotePage.tsx          # 견적 요청 (/quote)
│   │   ├── WhyPhilippinesPage.tsx # 왜 필리핀 (/why-philippines)
│   │   ├── ProcessPage.tsx        # 수속 절차 (/process)
│   │   └── VisaInfoPage.tsx       # 비자 정보 (/visa-info)
│   │
│   ├── App.tsx                    # 라우팅 + 레이아웃
│   ├── main.tsx                   # 엔트리포인트
│   └── index.css                  # 글로벌 스타일 + CSS 변수
│
├── components.json               # shadcn/ui 설정
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── package.json
├── pnpm-lock.yaml
└── tailwind.config.ts            # (Tailwind v4는 CSS 기반 설정 사용)

# 추후 추가 예정
├── workers/                      # Cloudflare Workers (이메일, SMS, AI)
└── src/
    ├── hooks/                    # 커스텀 훅 (useAuth, useAcademies 등)
    ├── types/                    # TypeScript 타입 정의
    ├── components/academy/       # 어학원 관련 컴포넌트
    ├── components/enrollment/    # 수속 관련 컴포넌트
    ├── pages/student/            # 학생 포털 페이지
    └── pages/admin/              # 관리자 페이지
```

---

## 🚀 개발 우선순위

### Phase 1: MVP 핵심 ✅ (완료)

1. ✅ Vite + React 19 + Tailwind CSS v4 + React Router 7 프로젝트 설정
2. ✅ shadcn/ui 컴포넌트 라이브러리 도입
3. ✅ 랜딩 페이지 (HomePage)
4. ✅ 어학원 리스트/검색 페이지 (AcademySearchPage)
5. ✅ 어학원 상세 페이지 (AcademyDetailPage)
6. ✅ 견적 요청 페이지 (QuotePage) — shadcn/ui 기반 폼
7. ✅ 정보 페이지: 왜 필리핀, 수속 절차, 비자 정보
8. ✅ 어학원 정적 데이터 (6개 어학원, 코스, 기숙사)
9. ⬜ Supabase DB 스키마 설정 (→ Phase 2로 이동)
10. ⬜ Cloudflare Pages 배포

### Phase 2: 데이터베이스 + 견적 이메일 (다음)

1. Supabase DB 스키마 설정 + 어학원 데이터 마이그레이션
2. 정적 데이터 → Supabase 실시간 조회 전환
3. Cloudflare Workers + Resend 연동
4. 견적서 이메일 발송 기능
5. QuoteLog 테이블 (잠재고객 추적)
6. Admin: 어학원/코스/기숙사 CRUD
7. Cloudflare Pages 배포

### Phase 3: 수속 시스템 (2~3주)

1. Supabase Auth 인증 연동 (카카오 소셜 로그인)
2. 회원가입/로그인 + ProtectedRoute
3. 수속 신청 플로우 (스텝 폼)
4. 수속 현황 페이지
5. Admin: 수속 관리 + 상태 변경
6. 출국 준비 정보 등록 폼 (파일 업로드 → R2)

### Phase 4: AI 자동화 + SMS (2주)

1. 문의 폼 + Inquiry 테이블 연동
2. AI 문의 분류 + 자동 응답 (Workers + AI API)
3. Admin: 문의 관리 + 관리자 직접 응답
4. SMS 발송 연동 (알리고/NHN Cloud)
5. 수속 학생 서류 리마인드 크론잡 (D-30, D-21, D-14, D-7)
6. 상태 변경 시 학생 SMS 발송

### Phase 5: 콘텐츠 & 부가기능 (2주)

1. 블로그 시스템
2. 어학원 비교 페이지
3. 비용 가이드 페이지
4. FAQ 페이지
5. 후기 시스템
6. Admin: 잠재고객 관리 (QuoteLog 기반)

### Phase 6: 운영 고도화 (추후)

1. 카카오 알림톡 연동 (사업자등록 후, SMS 대체)
2. 환율 API 연동 (실시간 원화 환산)
3. Admin 대시보드 고도화 (통계, 차트)
4. 커미션 관리 시스템
5. 자주 묻는 질문 자동 학습 (AI 개선)
6. 문의 → 수속 전환율 분석

---

## 📝 기타 참고사항

### 환경 변수

**React SPA (web/.env)**

```env
# Supabase (Auth + DB — 클라이언트에서 직접 호출)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Cloudflare Workers API URL
VITE_WORKERS_API_URL=

# App
VITE_APP_URL=
VITE_KAKAO_CHANNEL_URL=
```

**Cloudflare Workers (workers/wrangler.toml 또는 secrets)**

```env
# Supabase (서비스 롤 — DB 직접 조회용)
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Cloudflare R2
R2_BUCKET_NAME=

# Resend (이메일 발송)
RESEND_API_KEY=
ADMIN_EMAIL=           # 관리자 이메일 주소

# SMS (알리고 또는 NHN Cloud)
SMS_API_KEY=
SMS_SENDER_NUMBER=     # 발신 번호

# AI API
OPENAI_API_KEY=        # 또는
ANTHROPIC_API_KEY=     # Claude 사용 시
```

### SPA 라우팅 설정 (Cloudflare Pages)

React SPA는 모든 경로를 `index.html`로 리다이렉트해야 한다.
`web/public/_redirects` 파일:

```
/*    /index.html   200
```

### 보안 고려사항

- 여권 사본, 보험증서 등 민감 파일은 **Cloudflare R2의 private bucket**에 저장
- 파일 접근은 Workers에서 Presigned URL 발급 (인증된 사용자만)
- Supabase RLS(Row Level Security)로 DB 레벨 접근 제어
  - 학생은 자기 데이터만 조회/수정 가능
  - Admin은 모든 데이터 접근 가능
- Workers API는 Supabase Auth 토큰 검증으로 인증
- SMS 발신 번호는 사전 등록된 번호만 사용

### Cloudflare 무료 플랜 제한 & 안전장치

- Pages: 무제한 요청, 빌드 월 500회
- R2: 10GB 저장, 월 100만 읽기, 월 10만 쓰기
- Workers: 일 10만 요청
- **초과 시 과금 없이 서비스 정지** → 과금 폭탄 없음
- 월 3명 규모에서는 모든 무료 한도 내 충분
