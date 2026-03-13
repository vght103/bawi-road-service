# 견적 요청

> 상태: 구현완료
> 최종 수정일: 2026-03-11
> 관련 페이지: src/pages/quote.astro, src/react-pages/quote/

## 개요

필리핀 어학연수 무료 견적 요청 폼. 어학원/코스/기숙사/기간/시작일을 선택하면 참고 견적가가 실시간 표시되며, 제출하면 staff가 이메일로 상세 견적을 회신한다.

## 문제 정의

사용자가 어학원별 연수 비용을 직접 비교하기 어렵다. 간편한 폼으로 원하는 조건을 입력하면 맞춤 견적을 받을 수 있어야 한다.

## 사용자 스토리

- [x] 사용자는 어학원/코스/기숙사/기간/시작일을 선택하여 견적을 요청할 수 있다
- [x] 사용자는 선택한 조건의 참고 견적가를 실시간으로 확인할 수 있다
- [x] 비회원도 이름/이메일만으로 견적을 요청할 수 있다
- [x] 제출 완료 후 안내 화면이 표시된다

## 요구사항

### Must (필수)

- REQ-020: 어학원 선택 시 해당 어학원의 코스/기숙사 목록이 동적으로 표시된다
- REQ-021: 선택한 코스/기숙사/기간 기반으로 참고 견적가 `(코스 주당가 + 기숙사 주당가) × 주수`가 실시간 계산된다
- REQ-022: 로그인 없이도 견적 요청이 가능하다 (user_id는 nullable)
- REQ-023: 유입 경로(`?from=` 파라미터)가 `quote_list.source`에 저장된다
- REQ-024: zod 스키마 기반 폼 유효성 검사를 수행한다
- REQ-025: 제출 완료 후 이메일 주소가 표시된 성공 화면을 보여준다

### Nice-to-have (선택)

없음

## 상세 스펙

### UI/UX

#### 폼 영역 (좌측)

- 이름 (필수, 1자 이상)
- 이메일 (필수, 이메일 형식)
- 어학원 선택 (드롭다운, academies 테이블에서 조회)
- 코스 선택 (어학원 선택 후 활성화, 카드 형태)
- 기숙사 타입 선택 (어학원 선택 후 활성화, 카드 형태)
- 연수 기간 (1~52주, 숫자 입력)
- 시작 희망일 (캘린더, 오늘로부터 최소 7일 이후)

#### 요약 패널 (우측)

- 선택한 어학원/코스/기숙사/기간/시작일 요약
- 참고 견적가 표시 (원 단위)
- "실제 견적은 상담 후 안내" 안내 문구

#### 성공 화면

- 제출 완료 메시지 + 입력한 이메일 주소 표시
- "1~2 영업일 내 이메일로 상세 견적을 보내드립니다" 안내
- "홈으로" / "새 견적 요청" 버튼

### 데이터 모델

#### quote_list 테이블

| 필드 | 타입 | 설명 |
|------|------|------|
| id | bigint (PK) | 자동 증가 |
| user_id | uuid (nullable) | 로그인 사용자 ID |
| name | text | 이름 |
| email | text | 이메일 |
| academy_id | text | 어학원 ID |
| academy_name | text | 어학원명 |
| course_name | text | 코스명 |
| dormitory_type | text | 기숙사 타입 |
| duration_weeks | integer | 연수 기간 (주) |
| start_date | date | 시작 희망일 |
| source | text (nullable) | 유입 경로 |
| created_at | timestamptz | 생성 시각 |

#### QuoteLogInsert (프론트엔드 타입)

`src/types/quote.ts` — quote_list 테이블과 동일 구조

### API

- `fetchAcademies()` — `src/api/academy/academies.ts`, React Query로 어학원 목록 조회
- Supabase 직접 insert — 별도 API 함수 없이 `QuotePage.tsx`에서 `supabase.from("quote_list").insert()` 호출

### Zod 스키마 (`quoteSchema.ts`)

| 필드 | 검증 규칙 |
|------|----------|
| name | 1자 이상 필수 |
| email | 이메일 형식 |
| academyId | 비어있지 않은 문자열 |
| courseIndex | 숫자 (선택 필수) |
| dormIndex | 숫자 (선택 필수) |
| weeks | 문자열 → 숫자 변환, 1~52 범위 |
| startDate | Date 객체 필수 |

### 비즈니스 로직

- 어학원 변경 시 코스/기숙사 선택 초기화
- 참고 견적가는 클라이언트 전용 계산값 (DB에 저장하지 않음)
- Supabase 미설정 환경(로컬 개발)에서는 DB insert를 건너뛰고 바로 성공 화면 표시
- `get_quote_count(p_email)` RPC가 정의되어 있으나 현재 프론트엔드에서 미사용

### 유입 경로 추적

| 위치 | source 값 |
|------|----------|
| 네비게이션 바 | navbar |
| 푸터 | footer |
| 홈 히어로 | home-hero |
| 어학원 상세 | academy-detail |
| 챗봇 고정 CTA | chatbot-fixed |
| 챗봇 메시지 CTA | chatbot-message |

### 엣지케이스

- 어학원 미선택 상태에서 코스/기숙사 드롭다운 비활성화
- 시작일이 오늘+7일 미만이면 선택 불가
- 주수가 1~52 범위 밖이면 제출 차단
- 제출 중: LoadingOverlay 표시 + 버튼 비활성화

## 수용 기준 (Acceptance Criteria)

- [x] AC-20: 어학원 선택 시 해당 코스/기숙사 목록이 표시된다 ← REQ-020
- [x] AC-21: 조건 선택 시 참고 견적가가 실시간 갱신된다 ← REQ-021
- [x] AC-22: 비로그인 상태에서 이름/이메일로 견적 요청이 가능하다 ← REQ-022
- [x] AC-23: 제출된 견적에 유입 경로(source)가 저장된다 ← REQ-023
- [x] AC-24: 필수 필드 미입력 시 에러 메시지가 표시되고 제출이 차단된다 ← REQ-024
- [x] AC-25: 제출 완료 후 이메일이 포함된 성공 화면이 표시된다 ← REQ-025

## 제약 사항

- Edge Function 없음 — 클라이언트에서 Supabase 직접 insert
- 실제 견적 회신은 수동 이메일 (자동화 미구현)
- 참고 견적가는 UI 표시용이며 정확한 가격이 아님

## 미결 사항

없음
