# 필리핀 어학연수 1인 유학원 플랫폼 PRD (v4)

> **v4 업데이트 요약**
>
> - 사업명 확정: **바위로드 (BawiRoad)**
> - 핵심 컨셉 변경: "가격 완전 공개" → **"콘텐츠 신뢰 기반 1:1 밀착 케어"**
> - 고객 유입 경로: 플랫폼 자체 유입 → **콘텐츠(블로그/유튜브) 유입 + 카카오톡 상담 전환**
> - 플랫폼 역할 축소: 고객 쇼케이스 → **수속 관리 백엔드 도구**
> - 결제 구조 변경: 학생→바위로드→어학원 → **학생→어학원 직접 송금, 어학원→바위로드 커미션**
> - 등록금 신설: 수속 신청 시 **비환불 등록금 10만원** 납부
> - 환불 규정: 바위로드 자체 환불규정 없음, **어학원 환불규정만 따름**
> - 할인/마진 공식 변경: 고정 할인율 → **커미션 마진 = 주당 25,000원 × 연수 기간**
> - 서비스 범위 명확화: 어학원 매칭 + 수속 지원 + 출국 전 안내까지만
> - v3 대비 기술 스택 변경 없음 (React + Vite, Supabase, Cloudflare)

---

## 📌 프로젝트 개요

### 사업 배경

- **사업명**: 바위로드 (BawiRoad)
- **사업 형태**: 1인 부업형 필리핀 어학연수 전문 유학원
- **핵심 컨셉**: "직접 가본 사람이 솔직하게 알려주는 유학원" — 상담 경험 + 현지 방문 경험 기반의 신뢰형 서비스
- **목표**: 월 1~2명 등록 (부업이므로 최소 리소스 운영)
- **차별화**:
  - 대형 유학원(연 4,000명 수속)이 제공 못하는 **1:1 밀착 케어**
  - 직접 팸투어(바기오/세부) 경험 기반 **솔직한 어학원 리뷰**
  - 자체 개발 **수속 관리 플랫폼** (학생 포털 + 자동 알림)으로 신뢰감 확보
  - 콘텐츠(블로그/유튜브)로 유입, 카카오톡 상담으로 전환
- **수익 모델**:
  - 등록금: 수속 신청 시 10만원 (비환불)
  - 커미션 마진: 어학원 커미션에서 주당 25,000원 × 연수 기간만 수익으로 확보
  - 나머지 커미션은 학생 할인으로 환원

### 시장 환경 (v4 반영)

- **가격 경쟁 심화**: 코로나 이후 BESA/CALA의 할인 제한이 사실상 유명무실. 대형 유학원들이 "최저가 보장제"를 내세우며 가격 전쟁 중
- **대형 유학원 볼륨**: 필통유학·프로모유학 등 연 4,000명 이상 수속. 볼륨 디스카운트로 더 큰 할인 가능
- **1인 유학원의 포지션**: 가격 경쟁 불가. 대신 "대형이 못 하는 것"으로 차별화 — 솔직한 리뷰, 직접 경험, 1:1 케어, 수속 관리 시스템
- **확인 필요 사항**: BESA/CALA 현재 할인 규정 재확인 (korea@besaphil.com 문의 예정)

### 핵심 설계 원칙

1. **시간 최소화**: 부업이므로 자동화 가능한 것은 모두 자동화
2. **학생 셀프서비스**: 학생이 직접 할 수 있는 것은 시스템으로 처리
3. **콘텐츠 자산화**: 한 번 만든 콘텐츠가 지속적으로 유입을 만드는 구조
4. **AI 자동화**: AI 비서를 통해 문의 응답, 견적 생성, 상태 알림을 자동 처리
5. **금전 리스크 최소화**: 학생 학비를 거치지 않는 구조 (학생→어학원 직접 송금)
6. **서비스 범위 한정**: 어학원 매칭 + 수속 지원 + 출국 전 안내까지만 (현지 문제 비관여)

---

## 💰 수익 구조 & 정책

### 수익 모델

| 항목        | 금액                      | 지급 주체                   | 비고                                  |
| ----------- | ------------------------- | --------------------------- | ------------------------------------- |
| 등록금      | 10만원 (비환불)           | 학생 → 바위로드             | 수속 신청 시 납부, 취소해도 환불 불가 |
| 커미션 마진 | 주당 25,000원 × 연수 기간 | 어학원 → 바위로드           | 어학원 커미션에서 마진만 수취         |
| 학생 할인   | 총 커미션 - 커미션 마진   | 바위로드 → 학생 (할인 적용) | 나머지 커미션은 전액 학생 할인        |

**기간별 수익 예시:**

| 기간 | 등록금 | 커미션 마진        | 합계 수익  |
| ---- | ------ | ------------------ | ---------- |
| 4주  | 10만   | 10만 (25,000 × 4)  | **20만원** |
| 8주  | 10만   | 20만 (25,000 × 8)  | **30만원** |
| 12주 | 10만   | 30만 (25,000 × 12) | **40만원** |
| 16주 | 10만   | 40만 (25,000 × 16) | **50만원** |
| 24주 | 10만   | 60만 (25,000 × 24) | **70만원** |

### 결제 흐름

```
[기존 v3 - 폐기]
학생 → 바위로드(원화 송금) → 어학원(수수료 제외 송금) → 수수료 = 수익

[v4 - 현재]
1. 학생 → 바위로드: 등록금 10만원 납부 (수속 시작 조건)
2. 학생 → 어학원: 학비 직접 송금 (바위로드 비경유)
3. 어학원 → 바위로드: 커미션 입금 (수업 시작 후)
```

**직접 송금 구조의 이점:**

- 학생: 1인 사업자에게 목돈 맡기는 불안감 해소
- 바위로드: 학비 경유에 따른 법적/금전적 리스크 제거
- 신뢰: 학생이 어학원과 직접 금전 관계를 맺으므로 투명

### 환불 규정

- **바위로드 자체 환불규정 없음**
- 학비 환불은 **해당 어학원의 환불규정만 따름**
- 등록금 10만원은 **어떠한 경우에도 환불 불가** (수속 진행 비용)
- 바위로드는 환불 과정에서 학생-어학원 간 소통을 지원할 수 있으나, 환불 의무 및 법적 책임은 없음

### 할인 공식

```
커미션 마진 = 25,000원 × duration_weeks
학생 할인 = 총 커미션 금액 - 커미션 마진
최종 학비 = 어학원 정가 - 학생 할인
```

**참고:**

- 커미션 마진은 연수 기간에 비례 (주 단위 자동 계산)
- 비정형 기간(6주, 10주, 20주 등)에도 자동 적용
- 총 커미션 금액은 어학원마다 다름 (학비의 15~30%)
- 할인 규정(BESA/CALA) 재확인 후 조정 가능

### 서비스 범위

**바위로드가 하는 일:**

- 어학원 추천 (상담 기반)
- 수속 지원 (입학 가능 여부 확인, 입학허가서 발급, 기숙사 배정)
- 출국 전 안내 (서류 가이드, 준비물 안내)
- 수속 현황 관리 (플랫폼 제공)
- 서류 리마인드 (SMS 자동 발송)

**바위로드가 하지 않는 일:**

- 현지 도착 후 어학원 내 분쟁 중재 (법적 책임 없음)
- 비자 연장 대행 (현지 어학원에서 처리)
- 항공권/보험 대리 구매 (학생이 직접 구매, 가이드만 제공)
- 현지 생활 문제 해결 (숙소 변경, 의료 문제 등은 어학원 책임)

### 면책 사항

- 사이트에 표시되는 어학원 정보(가격, 시설, 코스)는 어학원이 제공한 것이며, 사전 고지 없이 변경될 수 있음
- 바위로드는 어학원 정보의 정확성을 보증하지 않으며, 최종 확인은 수속 과정에서 어학원과 직접 진행
- 학생-어학원 간 분쟁 시 바위로드는 소통을 도울 수 있으나, 법적 책임은 부담하지 않음

### 개인정보 처리

- 여권 사본, 보험증서 등 민감 정보는 수속 목적으로만 사용
- 수속 완료(수료/귀국) 후 6개월 이내 파기
- Cloudflare R2 private bucket에 암호화 저장
- 학생 본인만 열람 가능 (Supabase RLS)

---

## 📢 고객 유입 전략 (v4 신규)

### 유입 채널

v3에서는 플랫폼 자체(견적 시뮬레이터, 어학원 비교)가 유입 장치였으나,
v4에서는 **콘텐츠가 유입을 담당**하고, **플랫폼은 수속 관리 도구**로 역할이 분리됨.

```
[유입 경로]
네이버 블로그 / 유튜브 / 카페 글
  → 콘텐츠: 솔직 리뷰, 비교 가이드, 준비 가이드
  → CTA: 카카오톡 상담 또는 사이트 방문
    → 카카오톡 상담 (harry 직접)
    → 사이트에서 어학원 정보 확인
      → 수속 신청 (로그인 필요)
```

### 콘텐츠 전략

**핵심 콘텐츠 유형:**

1. **어학원 솔직 리뷰**: 직접 방문 경험 기반. 장점뿐 아니라 단점도 솔직하게. "이런 사람은 여기 가면 후회한다" 형태
2. **비교 가이드**: "세부 vs 바기오", "스파르타 vs 자율형", "ESL vs IELTS" 등 의사결정 지원
3. **비용 가이드**: 총비용 구조(학비 + 현지비용 + 항공 + 보험), 기간별 예상 비용
4. **준비 가이드**: 수속 절차, 필요 서류, 준비물 체크리스트, 현지 생활 팁
5. **학생 후기**: 실제 수속 학생 후기 (수속 완료 후 요청)

**콘텐츠 제작 원칙:**

- 대형 유학원 상담사가 절대 말 못하는 솔직한 정보 제공
- SEO 최적화 (네이버 블로그 기준)
- 한 번 만들면 지속적으로 유입을 만드는 에버그린 콘텐츠 위주
- 주 1~2개 포스팅 (부업 리소스 내)

### 전환 동선

```
콘텐츠 유입 → 카카오톡 상담 신청 (1차 전환)
  → 상담 진행 (harry 직접, 비동기 카톡)
  → 어학원 추천 + 사이트에서 상세 정보 확인
  → 수속 신청 + 등록금 10만원 납부 (2차 전환)
  → 이후 플랫폼에서 수속 진행
```

---

## 🏗 시스템 아키텍처

### 기술 스택

| 역할             | 서비스                            | 비고                                        |
| ---------------- | --------------------------------- | ------------------------------------------- |
| Framework        | **React 18 + Vite**               | TypeScript, SPA                             |
| Routing          | **React Router v6**               | 클라이언트 사이드 라우팅                    |
| Styling          | Tailwind CSS                      |                                             |
| UI 컴포넌트      | shadcn/ui                         |                                             |
| 배포             | **Cloudflare Pages**              | 정적 파일 호스팅, 상업용 무료               |
| 인증             | **Supabase Auth**                 | 카카오/Google 소셜 로그인, RLS 연동         |
| DB               | **Supabase (PostgreSQL)**         | 클라이언트에서 직접 호출, 500MB 무료        |
| 파일 저장소      | **Cloudflare R2**                 | 여권 사본, 보험증서 등 (10GB 무료)          |
| 서버리스 함수    | **Cloudflare Workers**            | 이메일 발송, AI 처리, SMS 발송, 크론잡      |
| AI API           | Claude API 또는 OpenAI API        | 문의 분류, 자동 응답                        |
| 이메일 발송      | **Resend**                        | 관리자 알림 + 견적서 발송 (월 3,000건 무료) |
| SMS 발송         | **알리고 또는 NHN Cloud**         | 수속 학생 리마인드 (건당 ~20원)             |
| 알림 (관리자)    | **이메일**                        | 문의/수속 알림                              |
| 알림 (수속 학생) | **SMS 문자** → 추후 카카오 알림톡 | 서류 리마인드                               |

### 월 비용 구조

| 항목                              | 비용                              |
| --------------------------------- | --------------------------------- |
| Supabase (Auth + DB)              | $0 (무료 플랜: 500MB DB, 5만 MAU) |
| Cloudflare (Pages + R2 + Workers) | $0 (무료 플랜)                    |
| Resend (이메일)                   | $0 (월 3,000건 무료)              |
| SMS 발송                          | ~1,000원/월 (월 1~2명 × 3~4건)    |
| AI API (Claude/OpenAI)            | $5~10                             |
| 도메인                            | 연 $10~15                         |
| **합계**                          | **월 약 8,000~15,000원**          |

### 시스템 구성 (4개 영역)

```
┌─────────────────────────────────────────────────┐
│  1. Public Pages (비로그인)                       │
│  - 랜딩 페이지                                    │
│  - 어학원 소개/검색                                │
│  - 어학원 상세 페이지 + 견적 참고                   │
│  - 블로그/후기                                    │
│  - FAQ, 문의 폼                                   │
│  - 상담 신청 (카카오톡 연결)                        │
├─────────────────────────────────────────────────┤
│  2. Student Portal (학생 로그인)                  │
│  - 회원가입/로그인                                 │
│  - 수속 신청 (등록금 납부 포함)                     │
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
│  - 견적 참고 이메일 발송                            │
│  - 수속 학생 SMS 리마인드 (크론잡)                  │
└─────────────────────────────────────────────────┘
```

---

## 🤖 AI 비서 + 알림 시스템

### 개요

1인 부업으로 시간 최소화가 핵심이므로, AI 비서가 문의 응답을 자동 처리하고, 알림 시스템이 관리자와 학생에게 적시에 정보를 전달한다.

**v4 역할 분담:**

- **AI가 하는 일**: 문의 분류, 자동 응답 (어학원 정보 기반)
- **시스템이 하는 일**: 관리자 이메일 알림, 학생 SMS 리마인드, 백오피스 알림 배지
- **내가 하는 일**: 카카오톡 상담 + 이메일 알림 확인 → Admin 페이지에서 처리

### 알림 채널 정리

| 상황               | 대상           | 채널     | 이유                        |
| ------------------ | -------------- | -------- | --------------------------- |
| 새 문의/수속 신청  | 관리자         | 이메일   | 단방향 알림, 구현 간편      |
| 복잡 문의 접수     | 관리자         | 이메일   | 내용 요약 포함              |
| 새 상담 신청       | 관리자         | 이메일   | 카카오톡 상담 요청 알림     |
| 견적 참고 전달     | 학생 (수속 전) | 이메일   | 참고용 견적 정보            |
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

#### 2. 견적 참고 이메일 발송

어학원 상세 페이지에서 코스/기숙사/기간 선택 후, 참고용 견적 정보를 이메일로 받을 수 있다.

**참고:** v4에서 견적 시뮬레이터는 "유입 장치"가 아닌 "참고 도구"로 역할 축소. 실제 할인 금액은 상담 후 확정.

**학생 입력 정보:**

- 이름 (필수)
- 이메일 (필수)
- 희망 출발 시기 (선택)

**발송되는 견적 참고 내용:**

- 선택한 어학원, 코스, 기숙사, 기간
- 비용 참고 (어학원 정가 기준)
- "정확한 할인 금액은 상담 후 안내드립니다" 안내
- "상담 신청하기" CTA 링크 (카카오톡)
- 바위로드 연락처

**잠재고객 확보:**

- 이메일 입력 = 잠재고객 리드
- `QuoteLog` 테이블에 이메일 + 견적 내용 저장
- 이메일 기준으로 견적 횟수 추적 (최대 3회)
- 관리자에게 이메일 알림

#### 3. 관리자 이메일 알림

Cloudflare Workers + Resend로 관리자에게 이메일 알림을 보낸다.

**알림 유형:**

| 유형                  | 제목 예시                                 |
| --------------------- | ----------------------------------------- |
| 새 문의               | `[새 문의] 김OO — 세부 / ESL 8주 / 2인실` |
| 복잡 문의             | `[상담 필요] 비자 연장 관련 — 이OO`       |
| 새 견적 조회          | `[견적] 박OO — SMEAG Capital / ESL 12주`  |
| 견적 3회 소진         | `[상담 전환] 박OO 견적 3회 완료`          |
| 새 수속 신청          | `[수속 신청] 최OO — CPI / IELTS 8주`      |
| 등록금 입금 확인 필요 | `[등록금] 최OO 10만원 입금 확인 필요`     |
| 서류 제출 완료        | `[서류 확인] 김OO 출국 서류 등록 완료`    |

**이메일 내 "Admin에서 확인하기" 링크**: 클릭 시 해당 문의/수속 건의 Admin 페이지로 바로 이동

#### 4. 수속 진행 흐름

```
상담 완료 → 수속 신청 + 등록금 10만원 납부
  (status: REGISTRATION_PAID)
        ↓
  관리자 이메일 알림
  "[수속 신청] 김OO — SMEAG Capital / ESL 8주 / 3월 10일"
        ↓
  관리자가 어학원에 직접 확인 (카카오톡/전화)
  (status: AVAILABILITY_CHECK)
        ↓
  Admin 페이지에서 결과 입력:
  - 입학 가능 여부, 확정 입학일
  - 상태 변경: CONFIRMED
        ↓
  학생에게 SMS 발송: "입학이 확정되었습니다. 3월 17일 입학."
        ↓
  학생이 어학원에 학비 직접 송금
  (status: TUITION_PAID)
        ↓
  출국 서류 등록 단계로 이동
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
예: `[바위로드] 출발 30일 전! 항공권 정보를 등록해주세요. https://bawiroad.com/my`

#### 6. 기술 구조

```
React SPA (Cloudflare Pages — 정적 호스팅)
  ├── Supabase Client (브라우저에서 DB 직접 호출)
  ├── Supabase Auth (인증)
  └── Cloudflare R2 (파일 업로드)

Cloudflare Workers (서버리스 함수)
  ├── /api/notify       → Resend로 관리자 이메일 발송
  ├── /api/quote-email  → 견적 참고 이메일 발송
  ├── /api/sms          → SMS 발송 (알리고/NHN Cloud)
  ├── /api/ai-classify  → AI 문의 분류 + 자동 응답
  └── Cron Trigger      → 매일 서류 리마인드 체크
```

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
       ├── RegistrationPayment (등록금 — 바위로드 수령)
       └── Commission (커미션 — 어학원에서 수령)

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
commission_rate DECIMAL     커미션 비율 (예: 0.20 = 20%) — Admin 전용
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

#### `Enrollment` (수속) — v4 변경

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

-- 비용 정보 (참고용 — 실제 결제는 학생→어학원 직접)
tuition_fee     DECIMAL     학비 (어학원 정가: course.price_per_week × duration_weeks)
dormitory_fee   DECIMAL     기숙사비 (어학원 정가: dormitory.price_per_week × duration_weeks)
total_fee       DECIMAL     총 비용 (정가 기준)
commission_margin DECIMAL   커미션 마진 (25,000 × duration_weeks, KRW)
student_discount DECIMAL    학생 할인 금액 (총 커미션 - 커미션 마진)
final_fee       DECIMAL     최종 금액 (total_fee - student_discount)
currency        VARCHAR     통화 (USD 기본)

-- 등록금
registration_fee        DECIMAL     등록금 (100,000 KRW 고정)
registration_paid_at    TIMESTAMP   등록금 입금 확인 시각
registration_confirmed  BOOLEAN     관리자 입금 확인 여부

-- 학비 직접 송금
tuition_paid_at         TIMESTAMP   학생→어학원 학비 송금 확인 시각
tuition_confirmed       BOOLEAN     관리자 확인 여부 (학생 자기신고 + 관리자 확인)

-- 메모
student_note    TEXT        학생 메모 (추가 요청사항)
admin_note      TEXT        관리자 메모 (내부용)

created_at      TIMESTAMP
updated_at      TIMESTAMP
```

#### Enrollment 상태 머신 (status) — v4 변경

```
PENDING             수속 신청 접수 (등록금 미납)
    ↓
REGISTRATION_PAID   등록금 10만원 납부 완료 (관리자 확인)
    ↓
AVAILABILITY_CHECK  입학 가능 여부 확인 중 (관리자가 어학원에 확인)
    ↓
CONFIRMED           입학 확정 (어학원에서 자리 확인됨)
    ↓
TUITION_PENDING     학비 송금 대기 (학생→어학원 직접 송금 안내)
    ↓
TUITION_PAID        학비 송금 완료 (학생 신고 + 관리자 확인)
    ↓
DOCUMENTS_PENDING   출국 서류 등록 대기 (항공권, 보험 등)
    ↓
READY_TO_DEPART     출국 준비 완료
    ↓
DEPARTED            출국 완료 (현지 수업 중)
    ↓
COMPLETED           수료/귀국 완료

CANCELLED           취소 (어느 단계에서든 가능 — 등록금 환불 불가)
```

**v3 대비 변경점:**

- `QUOTE_REQUESTED` → `PENDING` + `REGISTRATION_PAID` 로 분리 (등록금 납부 단계 추가)
- `PAYMENT_PENDING/COMPLETED` → `TUITION_PENDING/TUITION_PAID` 로 변경 (학생→어학원 직접 송금 반영)
- 바위로드 통장을 거치지 않으므로, 학비 관련 상태는 학생 자기신고 + 관리자 확인 방식

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

#### `Commission` (커미션 — 어학원→바위로드) — v4 변경

```sql
id              UUID        PK
enrollment_id   UUID        FK → Enrollment
academy_id      UUID        FK → Academy
total_commission DECIMAL    어학원으로부터 받을 총 커미션
commission_margin DECIMAL   바위로드 마진 (25,000 × weeks)
student_discount DECIMAL    학생에게 환원한 할인액
currency        VARCHAR     통화 (KRW)
status          ENUM        (PENDING, RECEIVED, OVERDUE)
expected_date   DATE        예상 입금일
received_date   DATE        실제 입금일
note            VARCHAR     메모
created_at      TIMESTAMP
```

**v3 대비 변경점:**

- `amount` → `total_commission` + `commission_margin` + `student_discount` 로 세분화
- 통화 기본값 KRW (어학원이 원화로 커미션 지급하는 경우 기준)

#### `QuoteLog` (견적 조회 + 잠재고객)

```sql
id              UUID        PK
user_id         UUID        FK → User (nullable, 비로그인 시 null)
name            VARCHAR     이름
email           VARCHAR     이메일 (견적 참고 수신 + 잠재고객 식별)
preferred_date  VARCHAR     희망 출발 시기 (선택)
academy_id      UUID        FK → Academy
course_id       UUID        FK → Course
dormitory_id    UUID        FK → Dormitory
duration_weeks  INT         조회한 기간
total_fee       DECIMAL     조회한 견적 금액 (정가 기준)
quote_count     INT         해당 이메일의 누적 견적 횟수
email_sent      BOOLEAN     견적 참고 이메일 발송 여부
created_at      TIMESTAMP
```

**견적 횟수 제한 로직:**

- `email` 기준으로 `quote_count` 추적
- 3회 초과 시 견적 생성 차단 → 상담 전환 유도 UI 표시
- 관리자에게 이메일 알림

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

#### `Notification` (알림 로그)

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

- Hero 섹션: 핵심 카피 + CTA (카카오톡 상담 / 어학원 둘러보기)
- "직접 가본 사람이 솔직하게 알려주는" 차별점 강조
- 왜 필리핀 어학연수인가 (1:1 수업, 가성비, 가까운 거리)
- 인기 어학원 미리보기 (3~4개 카드)
- 수속 진행 과정 안내 (신뢰감 확보)
- 학생 후기 캐러셀
- CTA: 카카오톡 상담 / 어학원 둘러보기

#### 1-2. 어학원 리스트 페이지 (`/academies`)

- **필터 사이드바**:
  - 지역: 세부 / 바기오 / 클락 / 마닐라
  - 스타일: 스파르타 / 세미스파르타 / 자율형
  - 코스: ESL / IELTS / TOEIC / 비즈니스 / 주니어
  - 시설: 수영장 / 헬스장 / 카페 등 (체크박스)
- **어학원 카드**: 대표 이미지, 이름, 지역, 스타일, 한줄 소개, 평점
- **정렬**: 추천순 / 평점순
- **비교 기능**: 최대 3개 어학원 체크 → 비교 페이지로 이동

**v4 변경:** 가격대 필터 제거 (가격이 유동적이므로), 가격 낮은순/높은순 정렬 제거

#### 1-3. 어학원 상세 페이지 (`/academies/:id`)

- 이미지 갤러리 (시설, 교실, 기숙사, 식당, 주변환경)
- 기본 정보 (지역, 스타일, 시설, 주소, 지도)
- 장점/단점 솔직 정리
- 추천 대상 (어떤 사람에게 맞는지)
- **코스 목록**: 코스별 수업 구성, 주당 참고가
- **기숙사 목록**: 방 타입별 참고가, 시설 설명
- **견적 참고 도구** (이 어학원 기준):
  - 코스 선택
  - 기숙사 선택
  - 기간 선택 (주 단위)
  - → 참고 비용 계산 (어학원 정가 기준)
  - → "정확한 할인 금액은 상담 후 안내" 안내 문구
  - → **"견적 참고 이메일로 받기" 버튼** → 이름/이메일/희망시기 입력 모달
  - → 견적 횟수 표시 ("견적 조회 2/3회 사용")
  - → 3회 초과 시 "상담 신청" 안내 + 카카오톡 연결
- 후기 섹션
- CTA: **카카오톡 상담** (메인) / 수속 신청 (로그인 필요)

**v4 변경:**

- "정가 공개" → "참고가 표시" (실제 할인은 상담 후 안내)
- "이 조건으로 수속 신청" 버튼 → "카카오톡 상담" 버튼이 메인 CTA
- 모든 가격에 "참고가" 표시 + "실제 금액은 상담 시 안내" 고지

#### 1-4. 어학원 비교 페이지 (`/compare?ids=a,b,c`)

- 선택한 2~3개 어학원을 나란히 비교
- 비교 항목: 지역, 스타일, 시설, 코스 구성, 기숙사 옵션, 장단점, 추천 대상
- **가격 비교는 참고가 기준** + "정확한 견적은 상담 시 안내" 고지

#### 1-5. 비용 가이드 페이지 (`/cost-guide`)

- 필리핀 어학연수 총비용 구조 설명
- 학비 + 기숙사 + 현지 비용(SSP, 비자연장, 교재비 등) + 항공권 + 보험 + 용돈
- 기간별 예상 총비용 범위 (4주/8주/12주/24주)
- "바위로드를 통하면 커미션 내 최대 할인 적용" 안내
- CTA: 카카오톡 상담

#### 1-6. FAQ 페이지 (`/faq`)

- 아코디언 형태
- 카테고리: 비용, 어학원 선택, 수속 절차, 현지 생활, 비자/서류
- **바위로드 정책 FAQ 포함**: 등록금, 환불, 서비스 범위

#### 1-7. 블로그 (`/blog`)

- 마크다운 기반 포스팅
- 카테고리: 어학원 리뷰, 지역 가이드, 준비 가이드, 비용 정보, 학생 후기

#### 1-8. 문의 폼 (`/contact`)

- 이름, 이메일, 연락처, 문의 내용 입력
- 제출 시 → `Inquiry` 테이블 저장 → AI 분류 → 자동 응답 또는 관리자 이메일 알림
- "문의가 접수되었습니다. 빠르게 답변드릴게요!" 확인 메시지
- 카카오톡 바로 상담 링크도 함께 표시

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
- 수속이 없으면 → "어학원 둘러보기" + "카카오톡 상담" CTA
- 내 문의 내역 확인 (AI 응답 / 관리자 응답 확인)

#### 2-3. 수속 신청 플로우 (`/my/enroll`) — v4 변경

**Step 1: 어학원 확인**

- 상담에서 합의된 어학원 정보 표시
- 변경 가능

**Step 2: 코스 선택**

- 해당 어학원의 코스 리스트 (라디오 버튼)
- 각 코스별 수업 구성, 참고가 표시

**Step 3: 기숙사 선택**

- 해당 어학원의 기숙사 옵션 (라디오 버튼)
- 방 타입별 참고가, 식사 포함 여부 표시

**Step 4: 기간 및 일정 선택**

- 기간: 드롭다운 (4주, 8주, 12주, 16주, 20주, 24주)
- 희망 입학일: 달력에서 선택 (보통 월요일만 선택 가능)
- 종료일 자동 계산

**Step 5: 견적 확인 및 신청** — v4 변경

- 선택 내용 요약
- 비용 안내:
  - 참고가 (어학원 정가 기준)
  - 예상 할인 금액 (상담에서 안내받은 금액)
  - 예상 최종 금액
- **등록금 안내**: 수속 시작을 위해 10만원 등록금 납부 필요
- **등록금 납부 안내**: 계좌 정보 + "입금 완료" 버튼
- 이용약관 동의 체크박스 (환불불가 등록금 동의 포함)
- 추가 메모 입력란 (선택)
- "수속 신청" 버튼

→ Enrollment 레코드 생성 (status: PENDING)
→ 등록금 입금 확인 후 → status: REGISTRATION_PAID
→ 관리자에게 이메일 알림

**v4 핵심 변경:**

- "수속 신청" = 등록금 10만원 납부 후 시작
- 학비는 입학 확정 후 학생이 어학원에 직접 송금
- 바위로드 계좌는 등록금 10만원 수령용만 사용

#### 2-4. 수속 현황 페이지 (`/my/enrollment/:id`) — v4 변경

**상태별 UI:**

```
[ PENDING ] 수속 신청이 접수되었습니다. 등록금 납부를 확인하고 있어요.
    → 등록금 입금 안내 (바위로드 계좌 + 10만원)
    → "입금 완료" 알림 버튼

[ REGISTRATION_PAID ] 등록금이 확인되었습니다. 입학 가능 여부를 확인하고 있어요.
    → 예상 소요: 1~2 영업일

[ AVAILABILITY_CHECK ] 어학원에 입학 가능 여부를 확인하고 있습니다.
    → 예상 소요: 1~2 영업일

[ CONFIRMED ] 입학이 확정되었습니다! 학비를 어학원에 직접 송금해주세요.
    → 어학원 송금 안내 (계좌, 금액, 할인 적용 금액, 송금 기한)
    → "송금 완료" 알림 버튼

[ TUITION_PENDING ] 학비 송금을 기다리고 있습니다.
    → 어학원 계좌 + 송금 금액 안내
    → "송금 완료" 알림 버튼

[ TUITION_PAID ] 학비가 확인되었습니다. 출국 준비 정보를 등록해주세요.
    → 출국 준비 폼 링크

[ DOCUMENTS_PENDING ] 출국 서류를 등록해주세요.
    → 체크리스트:
      ☐ 여권 정보
      ☐ 항공권 정보
      ☐ 여행자보험

[ READY_TO_DEPART ] 출국 준비가 완료되었습니다!
    → 오리엔테이션 자료 다운로드 링크
    → D-day 카운트다운
    → 체크리스트 (준비물 등)

[ DEPARTED ] 현지에서 열심히 공부하고 계시네요!
    → 어학원 연락처, 비상 연락처 표시

[ COMPLETED ] 수료를 축하합니다!
    → 후기 작성 요청 링크
```

**공통 요소:**

- 프로그레스 바 (전체 단계 중 현재 위치)
- 선택한 어학원/코스/기숙사/기간 정보 요약
- 비용 요약 (참고가 + 할인 + 최종금액)
- 카카오톡 상담 연결 버튼

#### 2-5. 출국 준비 정보 등록 (`/my/enrollment/:id/travel`)

status가 TUITION_PAID 또는 DOCUMENTS_PENDING일 때 접근 가능.

**여권 정보 섹션:**

- 영문 이름 (여권 기준)
- 여권 번호
- 여권 만료일
- 여권 사본 업로드 (이미지 또는 PDF) → Cloudflare R2 저장

**항공권 정보 섹션:**

- 출발일
- 출발 항공편명 (예: 5J 189)
- 도착 시간 (현지 시간)
- 귀국일
- 귀국 항공편명
- 항공권 캡처 업로드 → Cloudflare R2 저장

**여행자보험 섹션:**

- 보험사
- 상품명
- 보험 기간 (시작일~종료일)
- 보험증서 업로드 → Cloudflare R2 저장
- 추천 보험 가이드 링크

**픽업 요청:**

- 공항 픽업 요청 여부 (토글)
- 픽업 관련 메모

각 섹션은 독립적으로 저장 가능.
모든 필수 항목이 채워지면 → 관리자에게 이메일 알림 → 관리자 확인 후 status를 READY_TO_DEPART로 변경.

---

### 3. Admin Backoffice (관리자 전용)

#### 3-1. 접근 제어

- Supabase Auth의 role 기반 접근: role === "ADMIN"인 사용자만 접근
- React Router에서 ProtectedRoute 컴포넌트로 role 체크
- URL prefix: `/admin/*`
- **모바일 반응형 필수** (이메일 알림 → 핸드폰에서 Admin 접속하여 처리)

#### 3-2. 대시보드 (`/admin`)

- **새 알림 배지**: 미처리 문의 건수, 새 수속 신청 건수, 등록금 확인 필요 건수
- 이번 달 수속 현황 요약 (상태별 건수)
- 최근 수속 신청 목록
- 이번 달 예상 커미션
- 액션 필요한 항목 하이라이트 (새 신청, 등록금 확인, 학비 송금 확인 등)
- 최근 문의 현황 (AI 처리 / 관리자 대기 건수)

#### 3-3. 수속 관리 (`/admin/enrollments`)

- 전체 수속 리스트 (테이블)
- 필터: 상태별, 어학원별, 기간별
- 각 행: 학생 이름, 어학원, 코스, 기간, 상태, 신청일
- 클릭 → 상세 관리 페이지

#### 3-4. 수속 상세 관리 (`/admin/enrollments/:id`) — v4 변경

- 학생 정보 표시
- 선택한 어학원/코스/기숙사/기간/비용 표시
- **등록금 입금 확인 버튼** (PENDING → REGISTRATION_PAID)
- **학비 송금 확인 버튼** (TUITION_PENDING → TUITION_PAID)
- **상태 변경 버튼**: 현재 상태에서 다음 상태로 전환
- **상태 변경 시 학생에게 SMS 자동 발송** (선택 가능)
- 학생이 등록한 출국 준비 정보 확인
- 관리자 메모 입력
- 커미션 정보 입력/수정

#### 3-5. 어학원 관리 (`/admin/academies`)

- 어학원 CRUD (생성, 수정, 삭제)
- 코스 CRUD (어학원별)
- 기숙사 CRUD (어학원별)
- 이미지 업로드/관리 → Cloudflare R2
- 커미션 비율 설정 (어학원별)
- 활성/비활성 토글

#### 3-6. 커미션 관리 (`/admin/commissions`) — v4 변경

- 커미션 리스트 (수속 건별)
- 표시 항목: 총 커미션, 마진, 학생 할인, 상태
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
- 이름, 이메일, 견적 내용, 견적 횟수, 희망 출발 시기
- 수속 전환 여부 표시

---

## 🎨 UI/UX 가이드라인

### 디자인 톤

- 깔끔하고 신뢰감 있는 디자인
- 과하지 않은 컬러 사용 (메인 컬러 1개 + 서브 컬러 1개)
- 필리핀 느낌의 밝고 따뜻한 컬러 톤 (블루/그린 계열 바다 느낌)
- 정보 밀도가 높으므로 여백과 타이포그래피로 가독성 확보

### 반응형

- 모바일 퍼스트 (상담 유입의 대부분이 모바일)
- **Admin 페이지도 모바일 반응형** (관리자가 핸드폰에서 이메일 알림 → Admin 접속하여 처리)
- 데스크탑 / 태블릿 / 모바일 3단계 브레이크포인트

### 핵심 UX 원칙

- 어학원 정보가 한눈에 보여야 함 (장단점, 추천 대상 중심)
- 수속 진행 상태가 명확하게 보여야 함 (불안감 해소)
- CTA는 항상 "카카오톡 상담" (메인) + "수속 신청" (서브) 두 경로 제공
- 모든 가격에 "참고가" 고지 + "정확한 금액은 상담 시 안내"
- 견적 횟수 잔여 표시로 상담 전환 유도

---

## 📁 프로젝트 폴더 구조

```
project-root/
├── web/                       # React SPA (Cloudflare Pages 배포)
│   ├── src/
│   │   ├── pages/             # 페이지 컴포넌트
│   │   │   ├── public/        # Public Pages
│   │   │   │   ├── Home.tsx           # 랜딩 페이지
│   │   │   │   ├── AcademyList.tsx    # 어학원 리스트
│   │   │   │   ├── AcademyDetail.tsx  # 어학원 상세
│   │   │   │   ├── Compare.tsx        # 어학원 비교
│   │   │   │   ├── CostGuide.tsx      # 비용 가이드
│   │   │   │   ├── Contact.tsx        # 문의 폼
│   │   │   │   ├── FAQ.tsx            # FAQ
│   │   │   │   └── Blog.tsx           # 블로그
│   │   │   ├── student/       # Student Portal
│   │   │   │   ├── Dashboard.tsx      # 마이페이지
│   │   │   │   ├── Enroll.tsx         # 수속 신청 (스텝 폼)
│   │   │   │   ├── EnrollmentDetail.tsx  # 수속 현황
│   │   │   │   └── TravelDocs.tsx     # 출국 준비 정보 등록
│   │   │   └── admin/         # Admin Backoffice
│   │   │       ├── AdminDashboard.tsx
│   │   │       ├── Enrollments.tsx
│   │   │       ├── EnrollmentDetail.tsx
│   │   │       ├── Academies.tsx
│   │   │       ├── AcademyEdit.tsx
│   │   │       ├── Inquiries.tsx
│   │   │       ├── Leads.tsx          # 잠재고객 (QuoteLog)
│   │   │       └── Commissions.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                    # shadcn/ui 기반
│   │   │   ├── academy/
│   │   │   │   ├── AcademyCard.tsx
│   │   │   │   ├── AcademyFilter.tsx
│   │   │   │   ├── AcademyGallery.tsx
│   │   │   │   ├── CourseList.tsx
│   │   │   │   ├── DormitoryList.tsx
│   │   │   │   └── QuoteReference.tsx # 견적 참고 도구 (v4 변경)
│   │   │   ├── enrollment/
│   │   │   │   ├── EnrollmentStepper.tsx
│   │   │   │   ├── StatusProgress.tsx
│   │   │   │   ├── TravelDocForm.tsx
│   │   │   │   └── PaymentGuide.tsx   # 송금 안내 (v4 신규)
│   │   │   ├── inquiry/
│   │   │   │   └── InquiryForm.tsx
│   │   │   └── layout/
│   │   │       ├── Header.tsx
│   │   │       ├── Footer.tsx
│   │   │       ├── AdminSidebar.tsx
│   │   │       ├── ProtectedRoute.tsx  # 인증 + role 체크
│   │   │       └── NotificationBadge.tsx
│   │   │
│   │   ├── lib/
│   │   │   ├── supabase.ts
│   │   │   ├── workers-api.ts
│   │   │   ├── utils.ts
│   │   │   └── constants.ts
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useAcademies.ts
│   │   │   └── useEnrollments.ts
│   │   │
│   │   ├── types/
│   │   │   └── index.ts
│   │   │
│   │   ├── router.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── package.json
│
└── workers/                   # Cloudflare Workers (별도 배포)
    ├── src/
    │   ├── index.ts           # 라우터 (Hono 또는 itty-router)
    │   ├── routes/
    │   │   ├── notify.ts      # 관리자 이메일 알림 발송
    │   │   ├── quote-email.ts # 견적 참고 이메일 발송
    │   │   ├── sms.ts         # SMS 문자 발송
    │   │   ├── ai-classify.ts # AI 문의 분류 + 자동 응답
    │   │   └── r2-upload.ts   # R2 Presigned URL 발급
    │   ├── lib/
    │   │   ├── resend.ts      # Resend 이메일 클라이언트
    │   │   ├── sms-client.ts  # 알리고/NHN Cloud SMS 클라이언트
    │   │   └── ai.ts          # AI API 호출
    │   └── cron/
    │       └── document-remind.ts  # 매일 서류 리마인드 체크
    │
    ├── wrangler.toml
    └── package.json
```

---

## 🚀 개발 우선순위

### Phase 1: MVP 핵심 (2~3주)

1. Vite + React + Tailwind + React Router 프로젝트 설정
2. Supabase DB 스키마 설정 (v4 테이블)
3. 어학원 상세 페이지 + 견적 참고 도구
4. 어학원 리스트 페이지 (필터/정렬)
5. Admin: 어학원/코스/기숙사 CRUD
6. 랜딩 페이지
7. Cloudflare Pages 배포

### Phase 2: 수속 시스템 (2~3주)

1. Supabase Auth 인증 연동 (카카오 소셜 로그인)
2. 회원가입/로그인 + ProtectedRoute
3. 수속 신청 플로우 (v4 스텝 폼 — 등록금 납부 포함)
4. 수속 현황 페이지 (v4 상태 머신)
5. Admin: 수속 관리 + 상태 변경 + 등록금/학비 확인
6. 출국 준비 정보 등록 폼 (파일 업로드 → R2)

### Phase 3: 알림 + 견적 이메일 (1~2주)

1. Cloudflare Workers 설정 + Resend 연동
2. 관리자 이메일 알림 (새 문의, 수속 신청, 등록금 입금, 서류 제출)
3. 견적 참고 이메일 발송 기능
4. QuoteLog 테이블 + 견적 횟수 제한 (3회)
5. Admin 알림 배지

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
4. 커미션 관리 시스템 고도화
5. AI 상담 품질 개선
6. 콘텐츠 채널 확장 (유튜브 연동)

---

## 📝 기타 참고사항

### 환경 변수

**React SPA (web/.env)**

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_WORKERS_API_URL=
VITE_APP_URL=
VITE_KAKAO_CHANNEL_URL=
```

**Cloudflare Workers (workers/wrangler.toml 또는 secrets)**

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
R2_BUCKET_NAME=
RESEND_API_KEY=
ADMIN_EMAIL=
SMS_API_KEY=
SMS_SENDER_NUMBER=
OPENAI_API_KEY=        # 또는
ANTHROPIC_API_KEY=     # Claude 사용 시
```

### SPA 라우팅 설정 (Cloudflare Pages)

`web/public/_redirects` 파일:

```
/*    /index.html   200
```

### 보안 고려사항

- 여권 사본, 보험증서 등 민감 파일은 Cloudflare R2의 private bucket에 저장
- 파일 접근은 Workers에서 Presigned URL 발급 (인증된 사용자만)
- Supabase RLS(Row Level Security)로 DB 레벨 접근 제어
  - 학생은 자기 데이터만 조회/수정 가능
  - Admin은 모든 데이터 접근 가능
- Workers API는 Supabase Auth 토큰 검증으로 인증
- SMS 발신 번호는 사전 등록된 번호만 사용
- 개인정보 수속 완료 후 6개월 이내 파기

### Cloudflare 무료 플랜 제한 & 안전장치

- Pages: 무제한 요청, 빌드 월 500회
- R2: 10GB 저장, 월 100만 읽기, 월 10만 쓰기
- Workers: 일 10만 요청
- **초과 시 과금 없이 서비스 정지** → 과금 폭탄 없음
- 월 1~2명 규모에서는 모든 무료 한도 내 충분
