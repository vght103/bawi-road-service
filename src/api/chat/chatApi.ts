import type { ChatApiRequest, SSEEvent, ChatHistoryResponse } from "@/types/chat";

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL ?? "";

export async function sendChatStream(
  request: ChatApiRequest,
  onEvent: (event: SSEEvent) => void
): Promise<{ error: string | null }> {
  if (!SUPABASE_URL) {
    return { error: "서버에 연결할 수 없습니다." };
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.error ?? "AI 응답 중 오류가 발생했습니다." };
    }

    const reader = response.body?.getReader();
    if (!reader) {
      return { error: "스트리밍을 시작할 수 없습니다." };
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (!data) continue;

        try {
          const event: SSEEvent = JSON.parse(data);
          onEvent(event);
        } catch {
          // skip malformed events
        }
      }
    }

    return { error: null };
  } catch {
    return { error: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }
}

export function trackCtaClick(
  sessionId: string | null,
  ctaType: "quote" | "inquiry",
  source: "chatbot-message" | "chatbot-fixed",
): void {
  if (!SUPABASE_URL) return;

  // fire-and-forget: 클릭 추적은 사용자 경험에 영향 없도록
  fetch(`${SUPABASE_URL}/functions/v1/ai-chat`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: sessionId,
      cta_type: ctaType,
      source,
    }),
  }).catch(() => {});
}

export async function loadChatSession(
  sessionId: string
): Promise<{ data: ChatHistoryResponse | null; error: string | null }> {
  if (!SUPABASE_URL) {
    return { data: null, error: "서버에 연결할 수 없습니다." };
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/ai-chat?session_id=${sessionId}`,
      { method: "GET" }
    );

    if (!response.ok) {
      return { data: null, error: "세션을 불러올 수 없습니다." };
    }

    const data: ChatHistoryResponse = await response.json();
    return { data, error: null };
  } catch {
    return { data: null, error: "네트워크 오류가 발생했습니다." };
  }
}
