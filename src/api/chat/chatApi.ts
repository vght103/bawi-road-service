import type { ChatApiRequest, SSEEvent, ChatHistoryResponse } from "@/types/chat";

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL ?? ""; // Supabase Edge Function 기본 URL

// AI 채팅 메시지 전송 + SSE 스트리밍 응답 수신
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

    // 스트리밍 응답을 읽기 위한 Reader 획득
    const reader = response.body?.getReader();
    if (!reader) {
      return { error: "스트리밍을 시작할 수 없습니다." };
    }

    const decoder = new TextDecoder(); // 바이너리 → 텍스트 변환
    let buffer = ""; // 잘려서 도착한 데이터 조각 임시 보관

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // 새로 도착한 데이터를 버퍼에 누적
      buffer += decoder.decode(value, { stream: true });

      // SSE는 줄바꿈으로 이벤트를 구분하므로 줄 단위로 분리
      const lines = buffer.split("\n");
      // 마지막 줄은 아직 완성되지 않았을 수 있으므로 버퍼에 다시 보관
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue; // SSE 형식: "data: {JSON}"
        const data = line.slice(6).trim(); // "data: " 접두어 제거
        if (!data) continue;

        try {
          const event: SSEEvent = JSON.parse(data);
          onEvent(event);
        } catch {
          // 형식이 잘못된 이벤트는 조용히 무시 (스트리밍 중단 방지)
        }
      }
    }

    return { error: null };
  } catch {
    return { error: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }
}

// CTA 버튼 클릭 이벤트 기록 (fire-and-forget, 사용자 경험에 영향 없음)
export function trackCtaClick(
  sessionId: string | null,
  ctaType: "quote" | "inquiry",
  source: "chatbot-message" | "chatbot-fixed",
): void {
  if (!SUPABASE_URL) return;

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

// 이전 채팅 세션 대화 기록 복원 (페이지 새로고침 후 이전 대화 복원용)
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
