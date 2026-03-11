# AI 상담 챗봇

> 상태: 구현완료
> 최종 수정일: 2026-03-11
> 관련 페이지: src/pages/chat.astro, src/react-pages/chat/, supabase/functions/ai-chat/

## 개요

OpenAI GPT-4.1-mini 기반 필리핀 어학연수 AI 상담 챗봇. SSE 스트리밍으로 실시간 응답하며, 어학원 DB를 컨텍스트로 활용하여 맞춤 추천과 정보를 제공한다.

## 문제 정의

사용자가 필리핀 어학연수에 대해 궁금한 점을 즉시 해결할 수 있는 24시간 상담 채널이 필요하다. 실제 상담원 연결 전 AI가 기본 정보를 제공하고, 필요 시 견적/상담 신청으로 자연스럽게 연결한다.

## 사용자 스토리

- [x] 사용자는 AI 챗봇에 어학연수 관련 질문을 할 수 있다
- [x] 사용자는 실시간 스트리밍으로 응답을 받을 수 있다
- [x] 사용자는 AI가 추천하는 어학원을 카드 형태로 확인하고 상세 페이지로 이동할 수 있다
- [x] 사용자는 대화 중 견적 요청 / 상담 신청 CTA를 통해 다음 액션으로 이동할 수 있다
- [x] 사용자는 페이지 새로고침 후에도 이전 대화를 복원할 수 있다
- [x] 홈 검색창에서 질문을 입력하면 챗봇으로 바로 이동한다

## 요구사항

### Must (필수)

- REQ-026: GPT-4.1-mini 기반 한국어 어학연수 상담 챗봇을 제공한다
- REQ-027: SSE 스트리밍으로 실시간 응답을 표시한다
- REQ-028: 어학원 관련 질문 시 DB의 어학원 데이터를 컨텍스트로 주입한다
- REQ-029: 어학원 추천 시 클릭 가능한 어학원 카드를 메시지에 포함한다
- REQ-030: 가격/상담 관련 키워드 감지 시 CTA 버튼을 자동 표시한다
- REQ-031: Cloudflare Turnstile 봇 방지 + IP 기반 레이트 리밋(60초/10회)을 적용한다
- REQ-032: sessionStorage 기반 세션 유지 및 서버 측 대화 이력 복원을 지원한다
- REQ-033: 홈 검색창 입력 시 `/chat?q={keyword}`로 이동하여 자동 전송한다

### Nice-to-have (선택)

없음

## 상세 스펙

### UI/UX

#### 레이아웃

- 전용 페이지 (`/chat`) — minimal 레이아웃 (헤더/푸터 없음)
- 모바일 최적화 전체 화면 채팅 UI

#### ChatHeader

- 뒤로가기 버튼 (→ `/`)
- "AI 상담 어시스턴트" 타이틀

#### AiDisclaimer

- 채팅 상단 고정 면책 배너
- "AI가 생성한 답변이며 정확한 답변은 상담신청으로 확인" 안내

#### MessageBubble

- 사용자 메시지: 우측 정렬, 배경색 구분
- AI 메시지: 좌측 정렬, 줄바꿈 보정 + 불릿 목록 파싱
- 어학원 카드 (AcademyCard): 이름/지역/시스템 뱃지, `/academy/{id}` 링크
- CTA 버튼 (CtaButton): "무료 견적 받기" / "1:1 상담 신청"

#### ChatInput

- 하단 고정 입력 영역
- CTA 버튼 가로 스크롤 행 (항상 2개 고정 표시)
- 텍스트 입력 + 전송 버튼
- IME(한글) 조합 완료 전 Enter 전송 방지

### 데이터 모델

#### chat_sessions 테이블

| 필드 | 타입 | 설명 |
|------|------|------|
| id | uuid (PK) | 세션 ID |
| messages | jsonb | 대화 이력 배열 |
| created_at | timestamptz | 생성 시각 |
| updated_at | timestamptz | 마지막 업데이트 |

#### cta_clicks 테이블

| 필드 | 타입 | 설명 |
|------|------|------|
| id | bigint (PK) | 자동 증가 |
| session_id | uuid (FK) | 채팅 세션 ID |
| cta_type | text | CTA 종류 (quote / inquiry) |
| source | text | 클릭 위치 (chatbot-message / chatbot-fixed) |
| created_at | timestamptz | 클릭 시각 |

#### chat_rate_limits 테이블

| 필드 | 타입 | 설명 |
|------|------|------|
| ip_address | text (PK) | 클라이언트 IP |
| request_count | integer | 요청 횟수 |
| window_start | timestamptz | 윈도우 시작 시각 |

### API

#### 프론트엔드 (`src/api/chat/chatApi.ts`)

- `sendChatStream(request, onEvent)` — SSE 스트리밍 요청, 이벤트 콜백
- `trackCtaClick(sessionId, ctaType, source)` — CTA 클릭 fire-and-forget 기록
- `loadChatSession(sessionId)` — 세션 복원 (GET)

#### Edge Function (`supabase/functions/ai-chat/`)

- `POST` — 채팅 메시지 처리 + OpenAI 호출 + SSE 스트리밍 응답
- `GET` — 세션 이력 조회
- `PUT` — CTA 클릭 기록

### SSE 이벤트 타입

| 타입 | 데이터 | 설명 |
|------|--------|------|
| text | `{ content }` | AI 응답 텍스트 청크 |
| components | `{ academy_cards[] }` | 어학원 추천 카드 목록 |
| cta | `{ buttons[] }` | CTA 버튼 (견적/상담) |
| done | `{ session_id }` | 응답 완료 + 세션 ID |
| error | `{ message }` | 에러 메시지 |

### AI 모델 설정

- 모델: `gpt-4.1-mini`
- Temperature: `0.4`
- max_tokens: 기본 300, 어학원 상세 질문 시 600
- 시스템 프롬프트: 한국어 전용, 가격 미공개, 면책 조건부 출력, 마크다운 금지

### 컨텍스트 주입 로직

1. `isAcademyRelated()` — 어학원 관련 질문인지 판별
2. 관련 시 어학원 요약 목록 조회 (5분 메모리 캐시)
3. `extractSearchParams()` — 지역/시스템/태그 키워드 추출 → `searchAcademies()`
4. `detectMentionedAcademies()` — 어학원명 직접 언급 감지 → 상세 컨텍스트 주입
5. `detectFacilityQuery()` — 시설 질문 감지 → 최신 어학원 데이터 조회

### CTA 자동 트리거 조건

| 키워드 | CTA |
|--------|-----|
| 가격, 비용, 얼마, 견적 등 | 무료 견적 받기 → `/quote?from=chatbot-message` |
| 상담, 문의, 연락 등 또는 어학원 언급 | 1:1 상담 신청 → `/inquiry?from=chatbot-message` |

### 보안

- Cloudflare Turnstile: invisible 모드, 1회용 토큰, 전송 후 위젯 리셋
- IP 레이트 리밋: PostgreSQL SECURITY DEFINER 함수, 60초/10회 슬라이딩 윈도우
- Turnstile 미설정(개발환경) 시 검증 skip
- DB 에러 시 fail-open (서비스 우선)

### 엣지케이스

- 네트워크 에러 시 에러 메시지 표시 + 재입력 가능
- Turnstile 토큰 만료 시 자동 리셋 및 재요청
- 레이트 리밋 초과 시 "잠시 후 다시 시도" 에러
- 빈 메시지 전송 차단
- `?q=` 파라미터 진입 시 기존 세션 초기화 후 새 세션 시작

## 수용 기준 (Acceptance Criteria)

- [x] AC-26: AI 챗봇이 한국어로 어학연수 관련 질문에 응답한다 ← REQ-026
- [x] AC-27: 응답이 SSE 스트리밍으로 실시간 표시된다 ← REQ-027
- [x] AC-28: 어학원 관련 질문 시 DB 기반 정확한 정보를 응답한다 ← REQ-028
- [x] AC-29: 어학원 추천 시 클릭 가능한 카드가 메시지에 포함된다 ← REQ-029
- [x] AC-30: 가격/상담 키워드 감지 시 CTA 버튼이 자동 표시된다 ← REQ-030
- [x] AC-31: 봇 요청과 과도한 요청이 차단된다 ← REQ-031
- [x] AC-32: 페이지 새로고침 후 이전 대화가 복원된다 ← REQ-032
- [x] AC-33: 홈 검색창 입력 후 챗봇에서 자동 전송된다 ← REQ-033

## 제약 사항

- OpenAI API 의존 (외부 서비스)
- 가격 정보는 AI가 직접 답변하지 않음 (견적 요청으로 유도)
- RLS: chat_sessions/cta_clicks는 관리자만 조회 가능

## 미결 사항

없음
