import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ===== 상수 =====
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://bawiroad.com",
  "https://www.bawiroad.com",
];

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;
const OPENAI_MODEL = "gpt-4.1-nano";
const MAX_HISTORY_MESSAGES = 10; // 최근 10개 메시지만 OpenAI에 전송 (왕복 5회)
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// ===== CORS 헬퍼 (storage-presign과 동일) =====
function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("Origin");
  return {
    "Access-Control-Allow-Origin": origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
}

function jsonResponse(body: Record<string, unknown>, status: number, corsHeaders: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// ===== Supabase 클라이언트 (service_role) =====
function getServiceClient() {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
}

// ===== 어학원 요약 캐싱 =====
let cachedSummary: string | null = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5분

// ===== 어학원 요약 조회 (시스템 프롬프트용) =====
async function getAcademySummary(): Promise<string> {
  const now = Date.now();
  if (cachedSummary && now - cacheTime < CACHE_TTL) {
    return cachedSummary;
  }

  const supabase = getServiceClient();
  const { data } = await supabase.from("academies").select("id, name, region, academy_system, tags").order("id");

  if (!data || data.length === 0) return "어학원 데이터 없음";

  cachedSummary = data
    .map(
      (academy) =>
        `- ${academy.name} (ID: ${academy.id}) | ${academy.region} | ${academy.academy_system} | Tags: ${(academy.tags ?? []).join(", ")}`,
    )
    .join("\n");
  cacheTime = now;

  return cachedSummary;
}

// ===== 어학원 검색 (키워드 기반) =====
async function searchAcademies(params: { region?: string; academy_system?: string; tags?: string[] }) {
  const supabase = getServiceClient();
  let query = supabase.from("academies").select("id, name, region, academy_system, desc, tags");

  if (params.region) {
    query = query.eq("region", params.region);
  }
  if (params.academy_system) {
    query = query.eq("academy_system", params.academy_system);
  }
  if (params.tags && params.tags.length > 0) {
    query = query.overlaps("tags", params.tags);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data;
}

// ===== 키워드 기반 검색 파라미터 추출 =====
function extractSearchParams(message: string): { region?: string; academy_system?: string; tags?: string[] } | null {
  const regions = ["세부", "바기오", "클락", "마닐라"];
  const systems = ["스파르타", "세미스파르타", "자율형"];
  const tagKeywords: Record<string, string> = {
    ESL: "ESL",
    이에스엘: "ESL",
    IELTS: "IELTS",
    아이엘츠: "IELTS",
    TOEIC: "TOEIC",
    토익: "TOEIC",
    스피킹: "스피킹",
    회화: "스피킹",
    비즈니스: "비즈니스",
  };

  const foundRegion = regions.find((region) => message.includes(region));
  const foundSystem = systems.find((system) => message.includes(system));
  const foundTags = Object.entries(tagKeywords)
    .filter(([keyword]) => message.includes(keyword))
    .map(([, tag]) => tag);
  const uniqueTags = [...new Set(foundTags)];

  if (!foundRegion && !foundSystem && uniqueTags.length === 0) return null;

  return {
    ...(foundRegion && { region: foundRegion }),
    ...(foundSystem && { academy_system: foundSystem }),
    ...(uniqueTags.length > 0 && { tags: uniqueTags }),
  };
}

// ===== 시스템 프롬프트 =====
function buildSystemPrompt(academySummary: string): string {
  return `당신은 "바위로드 AI 상담 어시스턴트"입니다. 필리핀 어학연수 전문 상담사 역할을 합니다.

## 규칙

1. 항상 한국어로 답변하세요.
2. 바위로드(BAWI ROAD)는 필리핀 어학연수 중개 서비스입니다.
3. 어학원/어학연수 관련 질문에만 답변하세요. DB에 있는 어학원 정보를 기반으로 답변합니다.
4. **비용/가격 관련 질문**: 절대 구체적인 가격을 계산하거나 안내하지 마세요. "정확한 비용은 기간, 코스, 기숙사 옵션에 따라 달라집니다. 무료 견적을 받아보세요!"라고 안내하세요.
5. **모호한 어학원 질문 → 되물어보기**: "세부 어학원 궁금해", "어학원 추천해줘" 같이 구체적인 조건 없이 광범위하게 물어보면, 바로 검색하지 말고 선호사항을 먼저 질문하세요.
   - 예시: "어떤 학습 스타일을 선호하세요? (스파르타/세미스파르타/자율형)" 또는 "선호하는 지역이 있으신가요? (세부/바기오/클락)"
6. **구체적 조건이 있는 추천 요청**: "세부 스파르타 추천", "IELTS 준비할 수 있는 곳" 등 명확한 조건이 있으면 바로 검색하여 어학원 정보를 안내하세요.
7. **어학연수와 무관한 질문**: 정중하게 "저는 필리핀 어학연수 전문 상담 AI입니다. 어학연수 관련 질문을 해주세요!"라고 안내하세요.
8. **추천 결과가 없을 때**: "조건에 맞는 어학원을 찾지 못했습니다. 더 자세한 상담은 1:1 상담을 이용해주세요!"라고 안내하세요.
9. 답변은 친근하고 전문적인 톤으로, **200자 이내로 간결하게** 작성하세요.

## 사용 가능한 어학원 목록

${academySummary}

## 출력 형식

답변만 출력하세요. JSON이나 마크다운 포맷 없이 일반 텍스트로 작성합니다.`;
}

// ===== 대화 세션 관리 =====
async function createSession(initialQuery: string, messages: unknown[]): Promise<string> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("chat_sessions")
    .insert({
      initial_query: initialQuery,
      messages: messages,
      message_count: messages.length,
    })
    .select("id")
    .single();

  if (error) {
    console.error("세션 생성 실패:", error);
    throw error;
  }
  return data.id;
}

async function updateSession(sessionId: string, messages: unknown[]): Promise<void> {
  const supabase = getServiceClient();
  const { error } = await supabase
    .from("chat_sessions")
    .update({
      messages: messages,
      message_count: messages.length,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  if (error) {
    console.error("세션 업데이트 실패:", error);
  }
}

// ===== OpenAI 스트리밍 호출 =====
async function callOpenAIStream(
  systemPrompt: string,
  messages: Array<{ role: string; content: string }>,
): Promise<Response> {
  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      stream: true,
      max_tokens: 300,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenAI API 오류:", response.status, errorText);
    throw new Error(`OpenAI API 오류: ${response.status}`);
  }

  return response;
}

// ===== 메인 핸들러 =====
Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // GET: 세션 히스토리 조회
  if (req.method === "GET") {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get("session_id");
    if (!sessionId) {
      return jsonResponse({ error: "session_id가 필요합니다." }, 400, corsHeaders);
    }
    const supabase = getServiceClient();
    const { data, error } = await supabase.from("chat_sessions").select("messages").eq("id", sessionId).single();
    if (error || !data) {
      return jsonResponse({ error: "세션을 찾을 수 없습니다." }, 404, corsHeaders);
    }
    return jsonResponse({ messages: data.messages }, 200, corsHeaders);
  }

  // POST: AI 채팅 (SSE 스트리밍)
  try {
    const body = await req.json();
    const { session_id, messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return jsonResponse({ error: "messages 배열이 필요합니다." }, 400, corsHeaders);
    }

    const academySummary = await getAcademySummary();
    const systemPrompt = buildSystemPrompt(academySummary);

    // 마지막 사용자 메시지에서 검색 파라미터 추출
    const lastUserMsg = [...messages].reverse().find((msg: { role: string }) => msg.role === "user");
    const searchParams = lastUserMsg ? extractSearchParams(lastUserMsg.content) : null;
    const searchResults = searchParams ? await searchAcademies(searchParams) : [];

    // OpenAI에는 최근 N개 메시지만 전송 (토큰 절약), DB에는 전체 저장
    const recentMessages = messages.slice(-MAX_HISTORY_MESSAGES);

    const openaiResponse = await callOpenAIStream(systemPrompt, recentMessages);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const send = (data: unknown) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        let fullContent = "";

        try {
          const reader = openaiResponse.body!.getReader();
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
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  fullContent += content;
                  send({ type: "text", content });
                }
              } catch {
                // skip malformed chunks
              }
            }
          }

          // 검색 결과가 있으면 컴포넌트 전송
          if (searchResults.length > 0) {
            send({ type: "components", data: searchResults });
          }

          // 가격 관련 키워드 → 견적 CTA 전송
          const priceKeywords = ["가격", "비용", "얼마", "견적", "돈", "페소", "할인"];
          const hasPriceKeyword = priceKeywords.some(
            (keyword) => lastUserMsg?.content.includes(keyword)
          );
          if (hasPriceKeyword) {
            send({ type: "cta", data: { label: "무료 견적 받기", link: "/quote" } });
          }

          // DB 저장
          const timestamp = new Date().toISOString();
          const savedComponents = [
            ...(searchResults.length > 0 ? [{ type: "academy_cards", data: searchResults }] : []),
            ...(hasPriceKeyword ? [{ type: "cta_button", data: { label: "무료 견적 받기", link: "/quote" } }] : []),
          ];
          const fullMessages = [
            ...messages.map((msg: { role: string; content: string; timestamp?: string }) => ({
              ...msg,
              timestamp: msg.timestamp ?? timestamp,
            })),
            {
              role: "assistant",
              content: fullContent,
              components: savedComponents,
              timestamp,
            },
          ];

          let returnSessionId = session_id;
          if (!session_id) {
            const firstUserMessage = messages.find((msg: { role: string }) => msg.role === "user");
            returnSessionId = await createSession(firstUserMessage?.content ?? "", fullMessages);
          } else {
            // fire-and-forget: 응답 속도를 위해 DB 저장 완료를 기다리지 않음
            updateSession(session_id, fullMessages);
          }

          send({ type: "done", session_id: returnSessionId });
        } catch (error) {
          console.error("스트리밍 오류:", error);
          send({
            type: "error",
            message: "스트리밍 중 오류가 발생했습니다.",
          });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Edge Function 오류:", error);

    if (error instanceof SyntaxError) {
      return jsonResponse({ error: "요청 형식이 올바르지 않습니다." }, 400, corsHeaders);
    }

    const errorMessage =
      error instanceof Error && error.message.includes("OpenAI")
        ? "AI 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
        : "서버 오류가 발생했습니다.";

    return jsonResponse({ error: errorMessage }, 500, corsHeaders);
  }
});
