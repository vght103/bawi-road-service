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
  images?: string[];
}

export interface CtaButtonData {
  label: string;
  link: string;
}

export interface ChatApiRequest {
  session_id?: string;
  messages: Array<{ role: MessageRole; content: string }>;
}

export type SSEEvent =
  | { type: "text"; content: string }
  | { type: "components"; data: AcademyCardData[] }
  | { type: "cta"; data: CtaButtonData }
  | { type: "done"; session_id: string }
  | { type: "error"; message: string };

export interface ChatHistoryResponse {
  messages: Array<{
    role: MessageRole;
    content: string;
    components?: ChatComponent[];
    timestamp: string;
  }>;
}
