// 발신자 역할: user = 사용자, assistant = AI
export type MessageRole = "user" | "assistant";

// 채팅에서 AI가 추천 시 표시하는 어학원 카드 데이터
export interface AcademyCardData {
  id: string;
  name: string;
  region: string;
  academy_system: string; // 수업 방식 (예: "1:1", "그룹")
  desc: string;
  tags: string[];
  images?: string[];
}

// CTA 버튼 데이터 (예: "견적 받기", "상담 문의")
export interface CtaButtonData {
  label: string;
  link: string;
}

// AI 응답에 포함될 수 있는 UI 컴포넌트
// academy_cards: 어학원 카드 목록 | cta_button: 행동 유도 버튼
export type ChatComponent =
  | { type: "academy_cards"; data: AcademyCardData[] }
  | { type: "cta_button"; data: CtaButtonData };

// 채팅 메시지 구조
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  components?: ChatComponent[]; // 어학원 카드, 버튼 등 추가 UI
  timestamp: Date;
}

// AI 채팅 API 요청 데이터
export interface ChatApiRequest {
  session_id?: string; // 첫 대화 시작 시 없음
  messages: Array<{ role: MessageRole; content: string }>;
  turnstile_token: string; // Cloudflare 봇 방지 토큰
}

// SSE 이벤트 종류
// text: 텍스트 조각 | components: 어학원 카드 | cta: 버튼 | done: 완료(세션 ID 포함) | error: 오류
export type SSEEvent =
  | { type: "text"; content: string }
  | { type: "components"; data: AcademyCardData[] }
  | { type: "cta"; data: CtaButtonData }
  | { type: "done"; session_id: string }
  | { type: "error"; message: string };

// 채팅 세션 기록 응답 구조
export interface ChatHistoryResponse {
  messages: Array<{
    role: MessageRole;
    content: string;
    components?: ChatComponent[];
    timestamp: string; // 문자열 형태
  }>;
}
