# AI 챗봇 구현 스펙 (v2)

> **작성일**: 2026-02-27
> **업데이트**: 2026-02-27 (v2: SSE 스트리밍 + 세션 복원)
> **상태**: v2 구현 스펙 확정
> **기반 문서**: `docs/ai-chatbot-concept.md`

---

## 목차

1. [개요](#1-개요)
2. [아키텍처](#2-아키텍처)
3. [DB 설계](#3-db-설계-chat_sessions)
4. [Edge Function 상세](#4-edge-function-supabasefunctionsai-chatindexts)
5. [프론트엔드 타입](#5-프론트엔드-타입-srctypeschatts)
6. [프론트엔드 API](#6-프론트엔드-api-srcapichatchatapits)
7. [UI 컴포넌트 상세](#7-ui-컴포넌트-상세)
8. [메인 페이지](#8-메인-페이지-srcpageschatchatpagetsx)
9. [기존 파일 수정](#9-기존-파일-수정)
10. [AI 응답 라우팅 로직](#10-ai-응답-라우팅-로직)
11. [구현 순서](#11-구현-순서)
12. [환경변수 & 설정](#12-환경변수--설정)
13. [검증 체크리스트](#13-검증-체크리스트)

---

## 1. 개요

### 목표

홈 히어로 섹션의 AI 상담 input을 실제 GPT-4.1-nano 기반 AI 챗봇으로 전환하며, SSE 스트리밍을 통한 실시간 응답과 sessionStorage 기반 세션 복원을 구현한다.

### 핵심 기능

- 홈페이지 AI input → `/chat` 페이지 이동 → 챗봇 대화
- **SSE 스트리밍**: 토큰 단위 실시간 응답 렌더링 (1초 내 첫 토큰)
- **세션 복원**: sessionStorage에서 session_id 저장 후 새로고침 시 대화 이력 복원
- 어학원 관련 질문 → 키워드 기반 검색 + 어학원 카드 추천
- 가격 질문 → 자동 인라인 견적 CTA 칩 표시
- 비관련 질문 → 고정 CTA 칩 2개 하단 표시
- AI 방어 텍스트 상시 표시
- **모든 대화 내역 DB 저장** (어드민 분석용)

### 아키텍처 결정 사항

| 항목          | 결정                                | 이유                            |
| ------------- | ----------------------------------- | ------------------------------- |
| AI API        | Supabase Edge Function              | API 키 보안, 기존 패턴 재사용   |
| AI 모델       | GPT-4.1-nano                       | 최저 비용, 단순 QA 챗봇에 충분한 성능 |
| 어학원 데이터 | 키워드 기반 사전 검색               | Function calling 제거, 단순화   |
| 스트리밍      | SSE (Server-Sent Events)            | 실시간 토큰 스트리밍            |
| 세션 관리     | sessionStorage + DB history 복원    | 새로고침 후 대화 유지            |
| 대화 저장     | Edge Function에서 매 응답마다 저장  | 데이터 유실 최소화              |
| 인증          | verify_jwt = false                  | 공개 챗봇                       |

### 새 의존성

- **프론트엔드**: 없음 (기존 스택 활용, SSE 표준 API 사용)
- **Edge Function**: `fetch()`로 OpenAI REST API 직접 호출 (SDK 불필요, stream: true)
- **환경변수**: `OPENAI_API_KEY` 추가 필요

---

## 2. 아키텍처

### 전체 플로우 (v2: SSE 스트리밍 + 세션 복원)

```
[홈페이지]
  AI input 입력 + Send 클릭
    ↓ navigate(`/chat?q=${encodeURIComponent(aiKeyword)}`)

[채팅 페이지] 마운트
  ?q= 파라미터 존재 → 새 세션 시작, URL에서 ?q= 제거
  ?q= 파라미터 없음 → sessionStorage에서 session_id 조회
    ├─ session_id 존재 → GET /functions/v1/ai-chat?session_id=xxx
    │   ↓ chat_sessions 레코드에서 messages 배열 반환
    │   ↓ 이전 대화 내역 MessageBubble로 렌더링
    └─ session_id 없음 → 새 세션, 환영 메시지만 표시

[메시지 전송]
  사용자 입력 + Send
    ↓ POST /functions/v1/ai-chat (SSE 스트리밍)

[Edge Function] (SSE 핸들러)
  1. GET 요청: session_id로 chat_sessions 조회 → messages 배열 반환
  2. POST 요청:
     a) 키워드 추출 → extractSearchParams() (region, academy_system, tags)
     b) 어학원 데이터베이스 검색 (동일 session의 history context)
     c) OpenAI API 호출 (stream: true, tools 제거, response_format 제거)
     d) 스트리밍 응답 → SSE 이벤트로 변환:
        - text: 생성 중인 텍스트 토큰
        - components: 추론 결과 components 배열 (academy_cards, cta)
        - cta: 가격 키워드 감지 시 inline CTA 칩
        - done: 완료, session_id 포함
        - error: 에러 메시지
     e) 전체 응답 수집 후 chat_sessions에 저장

[채팅 페이지] SSE 수신
  EventSource 열기 → 이벤트 파싱
  text 이벤트 → placeholder 메시지의 content 토큰 단위 업데이트 (bounce dots 제거)
  components 이벤트 → 서버가 결정한 components 배열 저장
  cta 이벤트 → 가격 키워드 검출 시 인라인 CTA 칩 추가
  done 이벤트 → session_id 저장 (sessionStorage에 저장)
  error 이벤트 → 에러 표시
```

### 파일 구조

```
# 신규 파일
supabase/migrations/20260227_create_chat_sessions.sql
supabase/functions/ai-chat/index.ts
src/types/chat.ts
src/api/chat/chatApi.ts
src/pages/chat/ChatPage.tsx
src/pages/chat/components/ChatHeader.tsx
src/pages/chat/components/MessageBubble.tsx
src/pages/chat/components/ChatInput.tsx
src/pages/chat/components/AiDisclaimer.tsx
docs/ai-chatbot-implementation.md  (이 문서)

# 수정 파일
src/App.tsx                     → /chat 라우트 추가
src/pages/home/HomePage.tsx     → Send 버튼 네비게이션 연결
supabase/config.toml            → [functions.ai-chat] 추가

# 제거된 파일 (v1)
src/pages/chat/components/CtaButton.tsx  → 삭제 (하단 고정 칩 + 인라인으로 통합)
src/pages/chat/components/AcademyCard.tsx → 삭제 (MessageBubble 내 직접 렌더링)
```

---

## 3. DB 설계: `chat_sessions`

### 마이그레이션 SQL

```sql
-- 파일: supabase/migrations/YYYYMMDD_create_chat_sessions.sql

CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initial_query TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  message_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 어드민 조회용 인덱스
CREATE INDEX idx_chat_sessions_created_at ON chat_sessions (created_at DESC);

-- RLS 활성화
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Admin 전체 조회 권한
CREATE POLICY "admin_full_access" ON chat_sessions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM members WHERE members.id = auth.uid() AND members.role = 'ADMIN')
  );

-- 일반 사용자는 직접 접근 불가 (Edge Function이 service_role로 관리)
-- 프론트엔드 anon key로는 접근 차단됨
```

### 컬럼 설명

| 컬럼            | 타입        | 설명                                          |
| --------------- | ----------- | --------------------------------------------- |
| `id`            | UUID        | 세션 고유 ID (클라이언트가 session_id로 사용) |
| `initial_query` | TEXT        | 첫 번째 사용자 질문 (목록 표시용)             |
| `messages`      | JSONB       | 전체 대화 내역 배열                           |
| `message_count` | INTEGER     | 총 메시지 수 (빠른 카운트용)                  |
| `created_at`    | TIMESTAMPTZ | 세션 생성 시각                                |
| `updated_at`    | TIMESTAMPTZ | 마지막 업데이트 시각                          |

### messages JSONB 구조

```json
[
  {
    "role": "user",
    "content": "세부 스파르타 어학원 추천해줘",
    "timestamp": "2026-02-27T10:00:00Z"
  },
  {
    "role": "assistant",
    "content": "세부 지역 스파르타 어학원을 추천드릴게요!",
    "components": [
      {
        "type": "academy_cards",
        "data": [
          {
            "id": "1",
            "name": "SMEAG Capital",
            "region": "세부",
            "academy_system": "스파르타",
            "desc": "...",
            "tags": ["ESL", "IELTS"],
            "images": ["..."]
          }
        ]
      }
    ],
    "timestamp": "2026-02-27T10:00:05Z"
  }
]
```

---

## 4. Edge Function: `supabase/functions/ai-chat/index.ts`

### 패턴 참조

`supabase/functions/storage-presign/index.ts`의 CORS, 스트리밍 헬퍼 패턴을 바탕으로 작성.

### 핵심 기능 (v2)

- **GET 핸들러**: 기존 chat_sessions에서 `session_id`로 messages 배열 조회 + 반환
- **POST 핸들러**: SSE 스트리밍으로 토큰 단위 응답 전송
- **키워드 기반 검색**: `extractSearchParams()`로 사용자 질문에서 region, academy_system, tags 추출
- **OpenAI 스트리밍**: `stream: true`, tools 제거, response_format 제거
- **SSE 이벤트**:
  - `text`: 각 토큰
  - `components`: AI가 결정한 components 배열
  - `cta`: 가격 키워드 감지 시 inline CTA
  - `done`: 완료 + session_id
  - `error`: 에러 메시지

### 구조 요약

```typescript
// ===== 상수 =====
const OPENAI_MODEL = "gpt-4.1-nano";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const MAX_HISTORY_MESSAGES = 10; // 최근 10개만 OpenAI에 전송 (비용 최적화)
const ALLOWED_ORIGINS = [...];

// ===== CORS & 응답 헬퍼 =====
function getCorsHeaders(request: Request): Record<string, string>
function streamResponse(body: ReadableStream, corsHeaders): Response

// ===== Supabase 클라이언트 =====
function getServiceClient()

// ===== GET: 세션 복원 =====
async function handleGetSession(sessionId: string): Promise<unknown>
  → chat_sessions에서 id로 조회
  → messages 배열 + created_at, updated_at 반환

// ===== POST: SSE 스트리밍 =====
async function handlePostChat(body: { session_id?, messages }): Promise<ReadableStream>
  1. extractSearchParams(messages 마지막 user message) → { region?, academy_system?, tags? }
  2. searchAcademies(params) → 필터링된 어학원 데이터
  3. buildSystemPrompt(academySummary)
  4. messages.slice(-MAX_HISTORY_MESSAGES) → 최근 10개만 추출
  5. callOpenAIStream(systemPrompt, recentMessages) → ReadableStream (max_tokens: 300)
  5. ReadableStream 파싱 → SSE 이벤트로 변환
     - 텍스트 토큰 → "text" 이벤트
     - 가격 키워드 감지 → "cta" 이벤트
     - 응답 완료 후 → components 결정 → "components" 이벤트
  6. 전체 응답 수집 후 chat_sessions 저장
  7. "done" 이벤트 (session_id 포함)

// ===== 키워드 기반 검색 =====
function extractSearchParams(userMessage: string)
  → 정규식으로 region, academy_system, tags 키워드 추출
  → { region?, academy_system?, tags? }

// ===== OpenAI 스트리밍 =====
async function callOpenAIStream(systemPrompt, messages)
  → fetch(..., { stream: true, ... })
  → response.body를 ReadableStream으로 반환

// ===== 메인 핸들러 =====
Deno.serve(async (req) => {
  if (req.method === "GET") → handleGetSession(sessionId)
  if (req.method === "POST") → handlePostChat(body) → SSE 스트리밍
  if (req.method === "OPTIONS") → CORS preflight
})
```

**실제 Edge Function 코드는 `supabase/functions/ai-chat/index.ts` 참조.**

### config.toml 추가

```toml
[functions.ai-chat]
verify_jwt = false
```

### 환경변수

| 변수명                      | 설명             | 설정 방법                                    |
| --------------------------- | ---------------- | -------------------------------------------- |
| `OPENAI_API_KEY`            | GPT-4.1-nano API key | `supabase secrets set OPENAI_API_KEY=sk-...` |
| `SUPABASE_URL`              | 자동 제공        | Edge Function 내 자동                        |
| `SUPABASE_SERVICE_ROLE_KEY` | 자동 제공        | Edge Function 내 자동                        |

---

## 5. 프론트엔드 타입: `src/types/chat.ts`

```typescript
export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  components?: ChatComponent[];
  timestamp: Date;
}

export type ChatComponent =
  | { type: "academy_cards"; data: AcademyCardData[] }
  | { type: "cta_button"; data: CtaButtonData };

export interface AcademyCardData {
  id: string;
  name: string;
  region: string;
  academy_system: string;
  desc: string;
  tags: string[];
  images: string[];
}

export interface CtaButtonData {
  label: string;
  link: string;
}

// SSE 이벤트 타입 (v2)
export type SSEEvent =
  | { type: "text"; content: string }
  | { type: "components"; data: ChatComponent[] }
  | { type: "cta"; data: CtaButtonData }
  | { type: "done"; session_id: string }
  | { type: "error"; message: string };

export interface ChatApiRequest {
  session_id?: string;
  messages: Array<{ role: MessageRole; content: string }>;
}

// GET 응답: 기존 세션 이력 복원
export interface ChatHistoryResponse {
  messages: Array<{
    role: MessageRole;
    content: string;
    components?: ChatComponent[];
    timestamp: string;
  }>;
  created_at: string;
  updated_at: string;
}
```

---

## 6. 프론트엔드 API: `src/api/chat/chatApi.ts`

```typescript
import type { ChatApiRequest, SSEEvent, ChatHistoryResponse } from "@/types/chat";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "";

// GET: 기존 세션 이력 복원
export async function loadChatSession(
  sessionId: string,
): Promise<{ data: ChatHistoryResponse | null; error: string | null }> {
  if (!SUPABASE_URL) {
    return { data: null, error: "서버에 연결할 수 없습니다." };
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/ai-chat?session_id=${encodeURIComponent(sessionId)}`,
      { method: "GET" },
    );

    if (!response.ok) {
      return {
        data: null,
        error: "세션 정보를 불러올 수 없습니다.",
      };
    }

    const data: ChatHistoryResponse = await response.json();
    return { data, error: null };
  } catch {
    return {
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
}

// POST: SSE 스트리밍 (실시간 토큰 수신)
export async function sendChatStream(
  request: ChatApiRequest,
  onEvent: (event: SSEEvent) => void,
  onError: (error: string) => void,
): Promise<void> {
  if (!SUPABASE_URL) {
    onError("서버에 연결할 수 없습니다.");
    return;
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      onError(errorData.error ?? "AI 응답 중 오류가 발생했습니다.");
      return;
    }

    // SSE 파싱
    const reader = response.body?.getReader();
    if (!reader) {
      onError("응답 스트림을 읽을 수 없습니다.");
      return;
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");

      // 마지막 줄은 불완전할 수 있으므로 buffer에 보관
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;

        const data = line.slice(6);
        try {
          const event: SSEEvent = JSON.parse(data);
          onEvent(event);
        } catch {
          // JSON 파싱 실패 무시
        }
      }
    }

    // 마지막 버퍼 처리
    if (buffer.startsWith("data: ")) {
      try {
        const event: SSEEvent = JSON.parse(buffer.slice(6));
        onEvent(event);
      } catch {
        // JSON 파싱 실패 무시
      }
    }
  } catch (error) {
    onError(
      error instanceof Error ? error.message : "네트워크 오류가 발생했습니다.",
    );
  }
}
```

---

## 7. UI 컴포넌트 상세

모든 컴포넌트는 `src/pages/chat/components/`에 위치 (페이지 전용 co-location 규칙).

### 7.1 ChatHeader.tsx

```
┌─────────────────────────────────┐
│  ←  AI 상담 어시스턴트            │
└─────────────────────────────────┘
```

- **위치**: 고정 상단 (`fixed top-0`)
- **높이**: `h-14`
- **내용**: ArrowLeft 아이콘 (뒤로가기) + "AI 상담 어시스턴트" 타이틀
- **동작**: 클릭 시 `useNavigate()` → `/` (홈으로)
- **스타일**: 흰 배경, 하단 border (`border-b border-beige-dark`)

### 7.2 AiDisclaimer.tsx

```
┌─────────────────────────────────┐
│  ⓘ 아래 내용은 AI가 생성한 답변입  │
│  니다. 정확한 답변은 상담신청으로   │
│  확인하실 수 있습니다.             │
└─────────────────────────────────┘
```

- **위치**: 헤더 바로 아래
- **스타일**: `bg-beige` 배경, `text-brown` 텍스트, `text-[0.75rem]`
- **아이콘**: lucide-react `Info` 아이콘
- **옵션**: 닫기 버튼으로 숨기기 가능 (선택적)

### 7.3 MessageBubble.tsx

**Props**: `message: ChatMessage`

**유저 메시지** (오른쪽 정렬):

```
                    ┌──────────────────┐
                    │ 세부 스파르타      │  ← bg-terracotta text-white
                    │ 어학원 추천해줘    │     rounded-2xl rounded-tr-sm
                    └──────────────────┘
```

**AI 메시지** (왼쪽 정렬, 컴포넌트 포함):

```
🤖 AI 상담
┌─────────────────────────┐
│ 세부 지역 스파르타 어학원을  │  ← bg-white text-brown-dark
│ 추천드릴게요!              │     rounded-2xl rounded-tl-sm
│                          │
│ SMEAG Capital            │  ← 어학원 리스트 (MessageBubble 내)
│ 세부 · 스파르타            │     수직 배치, 구분선
│ 자세히 보기 →             │     각 항목 Link to /academy/{id}
│ ─────────────────────    │
│ EV Academy               │
│ 클락 · 세미스파르타         │
│ 자세히 보기 →             │
└─────────────────────────┘
```

- **AI 아바타**: 홈페이지 AI 카드와 동일한 그라디언트 원형 아이콘 (`bg-gradient-to-br from-terracotta to-amber-400` + MessageCircle 아이콘)
- **AI 라벨**: "AI 상담" 텍스트 (avatar 옆)
- **텍스트 렌더링**: `message.content` (plain text, 단락 간격 처리)
- **components 렌더링**: `message.components` 배열을 순회하며:
  - `type === "academy_cards"`:
    - 각 academy를 **수직 리스트**로 렌더링 (MessageBubble 내부)
    - 각 항목: 이미지 (미니), 이름, 지역+시스템 칩, "자세히 보기" Link
    - 항목 간 구분선 (`border-t border-beige-dark`)
  - `type === "cta_button"`:
    - 하단 고정 칩으로 렌더링 (ChatInput 위)
    - 가격 키워드 감지 시 inline CTA

### 7.4 ChatInput.tsx

**Props**:
- `value: string`
- `onChange: (value: string) => void`
- `onSend: () => void`
- `disabled: boolean`
- `ctaButtons: CtaButtonData[]` (고정 CTA 칩들, 선택적)

```
┌─────────────────────────────────┐
│ [📋 1:1 상담 신청] [🎓 무료 견적] │  ← 고정 CTA 칩들 (STATIC_CTA)
├─────────────────────────────────┤
│ [어학연수에 대해 물어보세요...] 📤 │  ← 입력 필드
└─────────────────────────────────┘
```

- **위치**: 고정 하단 (`fixed bottom-0`)
- **구성**:
  1. **고정 CTA 칩 영역** (선택적):
     - `ctaButtons` prop에 포함된 버튼들을 가로 스크롤 칩으로 표시
     - 스타일: `bg-terracotta/10 text-terracotta rounded-full px-3 py-1.5 text-sm`
     - 항상 하단에 고정 표시
  2. **입력 필드**:
     - 홈페이지 AI input과 동일한 디자인
     - `rounded-[10px] px-3.5 py-2.5 border border-beige-dark`
     - Send 버튼: `rounded-full bg-terracotta hover:bg-terracotta-hover`
- **동작**:
  - Enter 키 입력 시 `onSend()` 호출
  - `disabled` 시 input + button 모두 비활성화
  - CTA 칩 클릭 시 해당 Link로 이동
- **placeholder**: "어학연수에 대해 물어보세요"

---

## 8. 메인 페이지: `src/pages/chat/ChatPage.tsx`

### 레이아웃

```
┌─────────────────────────────────┐
│  ChatHeader                      │  ← fixed top, h-14
├─────────────────────────────────┤
│  AiDisclaimer                    │  ← sticky below header
├─────────────────────────────────┤
│                                  │
│  MessageBubble (welcome)         │
│  MessageBubble (user)            │  ← flex-1 overflow-y-auto
│  MessageBubble (ai + components) │     pt-14 (header height)
│  MessageBubble (streaming)       │     pb-24 (input + cta height)
│  TypingIndicator (if loading)    │
│                                  │
├─────────────────────────────────┤
│  [고정 CTA 칩들 (선택적)]         │  ← ChatInput props로 전달
│  ChatInput                       │  ← fixed bottom
└─────────────────────────────────┘
```

Navbar/Footer 없는 전체 화면 몰입형 채팅 UI.

### 상태 관리 (v2)

```typescript
const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
const [sessionId, setSessionId] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(false);
const [isWaitingForFirstToken, setIsWaitingForFirstToken] = useState(false);
const [inputValue, setInputValue] = useState("");
const [currentComponents, setCurrentComponents] = useState<ChatComponent[]>([]);
const [currentCtaButtons, setCurrentCtaButtons] = useState<CtaButtonData[]>([]);
const messagesEndRef = useRef<HTMLDivElement>(null);
const eventSourceRef = useRef<EventSource | null>(null);
const [searchParams, setSearchParams] = useSearchParams();

// sessionStorage 키
const SESSION_KEY = "bawi_chat_session_id";
```

### 환영 메시지 (하드코딩)

```typescript
const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "안녕하세요! 바위로드 AI 상담 어시스턴트입니다. 필리핀 어학연수에 대해 궁금한 점을 자유롭게 물어보세요!",
  components: [],
  timestamp: new Date(),
};

// 고정 하단 CTA 칩 (항상 표시)
const STATIC_CTA: CtaButtonData[] = [
  { label: "1:1 상담 신청", link: "/inquiry" },
  { label: "무료 견적 받기", link: "/quote" },
];
```

### 초기화 & 세션 복원 (useEffect)

```typescript
useEffect(() => {
  const initializeChat = async () => {
    const initialQuery = searchParams.get("q");

    if (initialQuery) {
      // 새 세션 시작: ?q= 파라미터에서 첫 메시지 시작
      setInputValue("");
      // URL에서 ?q= 제거
      setSearchParams({});
      // 약간의 딜레이 후 자동 전송
      setTimeout(() => {
        handleSendWithValue(initialQuery);
      }, 500);
    } else {
      // 기존 세션 복원: sessionStorage에서 session_id 조회
      const savedSessionId = sessionStorage.getItem(SESSION_KEY);
      if (savedSessionId) {
        setSessionId(savedSessionId);
        // GET 요청으로 이전 대화 내역 로드
        const { data, error } = await loadChatSession(savedSessionId);
        if (data) {
          const restoredMessages: ChatMessage[] = data.messages.map((msg) => ({
            id: crypto.randomUUID(),
            role: msg.role,
            content: msg.content,
            components: msg.components ?? [],
            timestamp: new Date(msg.timestamp),
          }));
          setMessages([WELCOME_MESSAGE, ...restoredMessages]);
        }
      }
      // 세션이 없으면 환영 메시지만 표시
    }
  };

  initializeChat();
}, []);
```

### 메시지 전송 핸들러 (SSE 스트리밍)

```typescript
async function handleSend() {
  if (!inputValue.trim() || isLoading) return;

  // 1. 유저 메시지 추가
  const userMessage: ChatMessage = {
    id: crypto.randomUUID(),
    role: "user",
    content: inputValue.trim(),
    timestamp: new Date(),
  };
  setMessages((prev) => [...prev, userMessage]);
  setInputValue("");
  setIsLoading(true);
  setIsWaitingForFirstToken(true);

  // 2. placeholder AI 메시지 추가 (실시간 업데이트용)
  const placeholderId = crypto.randomUUID();
  const placeholderMessage: ChatMessage = {
    id: placeholderId,
    role: "assistant",
    content: "", // 스트리밍 중 업데이트
    components: [],
    timestamp: new Date(),
  };
  setMessages((prev) => [...prev, placeholderMessage]);
  setCurrentComponents([]);
  setCurrentCtaButtons(STATIC_CTA); // 고정 CTA 칩들

  // 3. API 요청용 메시지 배열 구성 (환영 메시지 제외)
  const apiMessages = [...messages, userMessage]
    .filter((msg) => msg.id !== "welcome")
    .map((msg) => ({ role: msg.role, content: msg.content }));

  // 4. SSE 스트리밍 시작
  await sendChatStream(
    { session_id: sessionId ?? undefined, messages: apiMessages },
    (event) => {
      // SSE 이벤트 핸들러
      switch (event.type) {
        case "text":
          // 토큰 추가
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === placeholderId
                ? { ...msg, content: msg.content + event.content }
                : msg,
            ),
          );
          if (isWaitingForFirstToken) {
            setIsWaitingForFirstToken(false); // 첫 토큰 수신 후 bounce dots 제거
          }
          break;

        case "components":
          // 서버가 결정한 components 저장
          setCurrentComponents(event.data);
          break;

        case "cta":
          // 가격 키워드 감지 시 inline CTA 추가
          setCurrentCtaButtons((prev) => [
            ...prev,
            event.data,
          ]);
          break;

        case "done":
          // 완료: session_id 저장
          setSessionId(event.session_id);
          sessionStorage.setItem(SESSION_KEY, event.session_id);
          // placeholder 메시지에 components 업데이트
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === placeholderId
                ? { ...msg, components: currentComponents }
                : msg,
            ),
          );
          setIsLoading(false);
          break;

        case "error":
          // 에러: 에러 메시지 표시
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === placeholderId
                ? { ...msg, content: `오류: ${event.message}` }
                : msg,
            ),
          );
          setIsLoading(false);
          break;
      }
    },
    (error) => {
      // 네트워크 오류 등
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: error,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    },
  );
}

function handleSendWithValue(value: string) {
  setInputValue(value);
  // 다음 렌더링에서 handleSend 호출
  setTimeout(() => {
    handleSend();
  }, 0);
}
```

### 자동 스크롤

```typescript
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages, isLoading]);
```

### 타이핑 인디케이터 (v2)

`isWaitingForFirstToken`이 true일 동안 bounce dots 표시 (첫 토큰 수신 후 제거):

```
🤖 AI 상담
┌─────────┐
│ • • •   │  ← 점 3개 bounce 애니메이션 (1초 이내 사라짐)
└─────────┘
```

---

## 9. 기존 파일 수정

### 9.1 `src/App.tsx`

라우트 추가:

```typescript
import ChatPage from "@/pages/chat/ChatPage";
// ...
<Route path="/chat" element={<ChatPage />} />
```

### 9.2 `src/pages/home/HomePage.tsx`

**수정 위치**: lines 94-109 (AI 상담 input 영역)

**변경 사항**:

1. `useNavigate` import 추가
2. 네비게이션 핸들러 추가:

```typescript
const navigate = useNavigate();

function handleAiSubmit() {
  if (!aiKeyword.trim()) return;
  navigate(`/chat?q=${encodeURIComponent(aiKeyword.trim())}`);
}
```

3. Input에 `onKeyDown` 핸들러:

```typescript
onKeyDown={(event) => {
  if (event.key === "Enter") handleAiSubmit();
}}
```

4. Button에 `onClick` 핸들러:

```typescript
onClick = { handleAiSubmit };
```

### 9.3 `supabase/config.toml`

기존 내용 뒤에 추가:

```toml
[functions.ai-chat]
verify_jwt = false
```

---

## 10. AI 응답 라우팅 로직 (v2: 서버 결정)

Edge Function의 `extractSearchParams()`와 가격 키워드 감지에 의해 components가 자동으로 결정됨.

| 사용자 질문 유형                   | AI 응답          | Edge Function 처리                              | SSE 이벤트                      |
| ---------------------------------- | ---------------- | ----------------------------------------------- | ------------------------------- |
| 일반 어학연수 질문 (비자, 준비 등) | 텍스트 답변      | extractSearchParams() → 결과 없음               | text + components:[] + done     |
| 어학원 추천 (지역/시스템 지정)     | 텍스트 + 추천    | extractSearchParams() → 어학원 검색 → 데이터    | text + components:[academy_cards] + done |
| 어학원 추천 (결과 없음)            | 사과 텍스트      | extractSearchParams() → 검색 0개 반환           | text + components:[] + done     |
| 비용/가격 질문                     | 견적 유도 텍스트 | 가격 키워드 감지 → "price" 플래그 설정         | text + cta:{quote} + done       |
| 어학연수 무관한 질문               | 정중 거절 텍스트 | extractSearchParams() → 결과 없음 + 기본 로직   | text + components:[] + done     |

**핵심 변경**:
- `academy_cards`는 **AI가 아닌 서버(extractSearchParams)** 가 결정
- `cta_button`은 **가격 키워드 감지**로 자동 추가 (inline CTA)
- AI는 **순수 텍스트만 생성** → OpenAI 스트리밍으로 실시간 토큰 전송

---

## 11. 구현 순서 (v2)

### Step 1: 인프라

1. `supabase/migrations/20260227_create_chat_sessions.sql` — DB 테이블 생성
2. `supabase/config.toml` — Edge Function 설정 추가
3. `supabase secrets set OPENAI_API_KEY=sk-...` — API 키 설정

### Step 2: 백엔드

4. `supabase/functions/ai-chat/index.ts` — Edge Function 구현 (SSE 스트리밍 + GET/POST)

### Step 3: 프론트엔드 기반

5. `src/types/chat.ts` — 타입 정의 (SSEEvent 추가)
6. `src/api/chat/chatApi.ts` — API 호출 함수 (loadChatSession, sendChatStream)

### Step 4: UI 컴포넌트 (의존성 순서: 안쪽 → 바깥)

7. `src/pages/chat/components/AiDisclaimer.tsx`
8. `src/pages/chat/components/MessageBubble.tsx` (어학원 리스트 직접 렌더링)
9. `src/pages/chat/components/ChatHeader.tsx`
10. `src/pages/chat/components/ChatInput.tsx` (ctaButtons prop 추가)

### Step 5: 페이지 조립 & 통합

11. `src/pages/chat/ChatPage.tsx` — 메인 페이지 (sessionStorage + SSE 핸들러)
12. `src/App.tsx` — 라우트 추가
13. `src/pages/home/HomePage.tsx` — Send 버튼 네비게이션 연결

---

## 12. 환경변수 & 설정

### Supabase Secrets (구현 전 설정 필요)

```bash
supabase secrets set OPENAI_API_KEY=sk-...
```

### 프론트엔드 환경변수 (기존)

- `VITE_SUPABASE_URL` — 이미 설정됨
- `VITE_SUPABASE_ANON_KEY` — 이미 설정됨

---

## 13. 검증 체크리스트 (v2)

### 빌드

- [ ] `pnpm run build` 에러 없음
- [ ] TypeScript 에러 0

### Edge Function (SSE 스트리밍 + 세션)

- [ ] `supabase functions serve ai-chat` 로컬 동작
- [ ] GET `/ai-chat?session_id=xxx` → 기존 대화 messages 배열 반환
- [ ] POST `/ai-chat` (SSE) → 첫 토큰 1초 이내 수신
- [ ] SSE 이벤트 순서: text → components (선택) → cta (선택) → done
- [ ] 일반 질문 → text만 스트리밍, components:[]
- [ ] 어학원 추천 → text + components:[academy_cards]
- [ ] 가격 질문 → text + cta:{quote} 이벤트
- [ ] chat_sessions 테이블에 messages JSONB 저장 확인
- [ ] 에러 응답 (잘못된 요청, OpenAI 오류) → error 이벤트

### 프론트엔드 - 세션 & 스트리밍

- [ ] 홈 → AI input → Send → `/chat?q=...` 이동
- [ ] 채팅 페이지 마운트 → ?q= 파라미터 감지 → 새 세션 시작
- [ ] ?q= 자동 제거되고 URL 정리됨
- [ ] 새로고침 후 → sessionStorage 에서 session_id 로드
- [ ] GET 요청으로 기존 대화 이력 복원 (MessageBubble로 렌더)
- [ ] SSE 스트리밍 중 → placeholder 메시지 content 토큰 단위 업데이트
- [ ] 첫 토큰 수신 후 bounce dots 제거 (isWaitingForFirstToken = false)
- [ ] done 이벤트 → session_id 저장 (sessionStorage)

### 프론트엔드 - UI & 상호작용

- [ ] 채팅 페이지 환영 메시지 표시
- [ ] 초기 쿼리 자동 전송 (250ms 딜레이)
- [ ] Enter 키로 메시지 전송
- [ ] MessageBubble의 어학원 리스트 (수직) 정상 렌더링
- [ ] 어학원 항목 → 클릭 시 `/academy/{id}` 이동
- [ ] 하단 고정 CTA 칩 항상 표시 (1:1 상담 + 무료 견적)
- [ ] 가격 키워드 → inline CTA 칩 추가
- [ ] 에러 시 에러 메시지 표시
- [ ] 모바일 반응형 UI 정상
- [ ] 자동 스크롤 동작

### 데이터 & 저장

- [ ] done 이벤트에서 session_id 반환
- [ ] sessionStorage에 SESSION_KEY 저장됨
- [ ] chat_sessions.messages에 전체 대화 (user + assistant) 저장
- [ ] message_count 정확히 업데이트
- [ ] 세션 복원 시 이전 메시지들 정상 렌더링

---

## 참조 파일

| 파일                                          | 용도                    |
| --------------------------------------------- | ----------------------- |
| `supabase/functions/storage-presign/index.ts` | Edge Function 패턴 참조 |
| `src/api/academy/academies.ts`                | API 레이어 패턴 참조    |
| `src/data/academies.ts`                       | Academy 타입 정의 참조  |
| `src/data/academy/chipColors.ts`              | 어학원 칩 색상 재사용   |
| `src/pages/home/HomePage.tsx` (lines 78-110)  | AI input 수정 대상      |
| `docs/ai-chatbot-concept.md`                  | 기존 concept 문서       |
