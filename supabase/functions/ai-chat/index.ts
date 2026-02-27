import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ===== 상수 =====
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://bawiroad.com",
  "https://www.bawiroad.com",
  "https://bawi-road-service.pages.dev",
];

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;
const OPENAI_MODEL = "gpt-4.1-mini";
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
let cachedAcademyData: Array<{ id: string; name: string }> = [];

interface CachedAcademy {
  id: string;
  name: string;
  region: string;
  academy_system: string;
  tags: string[];
  established_year: number | null;
  desc: string;
  courses: Array<{ name: string; category: string; manToMan: number; group: number; optional: number; desc: string }>;
  dormitories: Array<{ type: string; meals: string; desc: string }>;
  facilities: string[];
  pros: string[];
  cons: string[];
  recommended_for: string[];
  korean_ratio: string | null;
  capacity: number | null;
  location_detail: string | null;
  description: string | null;
}
let cachedFullAcademies: CachedAcademy[] = [];

// ===== 어학원 요약 조회 (시스템 프롬프트용) =====
async function getAcademySummary(): Promise<string> {
  const now = Date.now();
  if (cachedSummary && now - cacheTime < CACHE_TTL) {
    return cachedSummary;
  }

  const supabase = getServiceClient();
  const { data } = await supabase
    .from("academies")
    .select("id, name, region, academy_system, tags, established_year, desc, courses, dormitories, facilities, pros, cons, recommended_for, korean_ratio, capacity, location_detail, description")
    .order("id");

  if (!data || data.length === 0) return "어학원 데이터 없음";

  cachedAcademyData = data.map((academy) => ({ id: academy.id, name: academy.name }));
  cachedFullAcademies = data as CachedAcademy[];

  cachedSummary = data
    .map(
      (academy) =>
        `- ${academy.name} (ID: ${academy.id}) | ${academy.region} | ${academy.academy_system} | 설립: ${academy.established_year ?? "정보없음"} | Tags: ${(academy.tags ?? []).join(", ")}`,
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
  const systems = ["세미스파르타", "스파르타", "자율형"];
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

// ===== 특정 어학원 언급 감지 =====
function detectMentionedAcademies(message: string): Array<{ id: string; name: string }> {
  if (cachedAcademyData.length === 0) return [];
  const lowerMsg = message.toLowerCase();
  return cachedAcademyData.filter((academy) => {
    const lowerName = academy.name.toLowerCase();
    if (lowerMsg.replace(/\s/g, "").includes(lowerName.replace(/\s/g, ""))) return true;
    const firstName = lowerName.split(/\s+/)[0];
    if (firstName.length >= 2 && lowerMsg.includes(firstName)) return true;
    return false;
  });
}

// ===== 어학원 상세 컨텍스트 빌드 =====
function buildAcademyDetailContext(mentioned: Array<{ id: string; name: string }>): string {
  const target = mentioned.length > 0 ? cachedFullAcademies.find((a) => a.id === mentioned[0].id) : null;
  if (!target) return "";

  const lines: string[] = [`[${target.name} 상세 정보]`];
  lines.push(`지역: ${target.region}${target.location_detail ? ` (${target.location_detail})` : ""}`);
  lines.push(`학습 시스템: ${target.academy_system}`);
  if (target.capacity) lines.push(`정원: ${target.capacity}명`);
  if (target.korean_ratio) lines.push(`한국인 비율: ${target.korean_ratio}`);
  if (target.established_year) lines.push(`설립: ${target.established_year}년`);
  if (target.description) lines.push(`소개: ${target.description}`);

  if (target.courses && target.courses.length > 0) {
    lines.push("");
    lines.push("수업 코스:");
    for (const course of target.courses) {
      lines.push(`• ${course.name} (${course.category}) — 1:1 ${course.manToMan}시간, 그룹 ${course.group}시간, 선택 ${course.optional}시간 | ${course.desc}`);
    }
  }

  if (target.dormitories && target.dormitories.length > 0) {
    lines.push("");
    lines.push("기숙사:");
    for (const dorm of target.dormitories) {
      lines.push(`• ${dorm.type} — 식사: ${dorm.meals} | ${dorm.desc}`);
    }
  }

  if (target.facilities && target.facilities.length > 0) {
    lines.push("");
    lines.push(`시설: ${target.facilities.join(", ")}`);
  }

  if (target.pros && target.pros.length > 0) {
    lines.push("");
    lines.push("장점:");
    for (const pro of target.pros) {
      lines.push(`• ${pro}`);
    }
  }

  if (target.cons && target.cons.length > 0) {
    lines.push("");
    lines.push("참고사항:");
    for (const con of target.cons) {
      lines.push(`• ${con}`);
    }
  }

  if (target.recommended_for && target.recommended_for.length > 0) {
    lines.push("");
    lines.push(`추천 대상: ${target.recommended_for.join(", ")}`);
  }

  return lines.join("\n");
}

// ===== 시설 키워드 감지 =====
function detectFacilityQuery(message: string): boolean {
  const facilityKeywords = ["시설", "건물", "신축", "깨끗", "새로운", "최신", "리모델링", "리노베이션", "캠퍼스"];
  return facilityKeywords.some((keyword) => message.includes(keyword));
}

// ===== 최신 어학원 검색 (설립연도 기준) =====
async function searchNewestAcademies(limit = 3) {
  const supabase = getServiceClient();
  const { data } = await supabase
    .from("academies")
    .select("id, name, region, academy_system, desc, tags, established_year")
    .order("established_year", { ascending: false })
    .limit(limit);
  return data ?? [];
}

// ===== 시스템 프롬프트 =====
function buildSystemPrompt(academySummary: string): string {
  return `당신은 "바위로드 AI 상담 어시스턴트"입니다. 필리핀 어학연수 전문 상담사 역할을 합니다.

## 규칙

1. 항상 한국어로 답변하세요.
2. 바위로드(BAWI ROAD)는 필리핀 어학연수 중개 서비스입니다.
3. 어학원/어학연수 관련 질문에만 답변하세요. DB에 있는 어학원 정보를 기반으로 답변합니다.
4. **비용/가격 관련 질문**: 비용 질문은 어학연수 관련 질문이므로 반드시 친절하게 응대하세요. 단, 구체적인 가격을 직접 계산하거나 숫자로 안내하지 마세요. 공감하며 자연스럽게 안내하세요. 예시: "어학연수 비용이 궁금하시군요! \n 정확한 비용은 어학원, 연수기간, 코스, 기숙사 옵션에 따라 달라지는데요. 무료 견적 서비스에서 원하시는 조건을 설정하시면 바로 확인하실 수 있어요!"
5. **모호한 어학원 질문 → 되물어보기**: "세부 어학원 궁금해", "어학원 추천해줘" 같이 구체적인 조건 없이 광범위하게 물어보면, 바로 검색하지 말고 선호사항을 먼저 질문하세요.
   - 예시: "어떤 학습 스타일을 선호하세요? (스파르타/세미스파르타/IELTS 등)" 또는 "선호하는 지역이 있으신가요? (세부/바기오)"
6. **구체적 조건이 있는 추천 요청**: "세부 스파르타 추천", "IELTS 준비할 수 있는 곳" 등 명확한 조건이 있으면 바로 검색하여 어학원 정보를 안내하세요.
7. **어학연수와 무관한 질문**: 정중하게 "저는 필리핀 어학연수 전문 상담 AI입니다. 어학연수 관련 질문을 해주세요!"라고 안내하세요.
8. **추천 결과가 없을 때**: "조건에 맞는 어학원을 찾지 못했습니다. 더 자세한 상담은 1:1 상담을 이용해주세요!"라고 안내하세요.
9. 답변은 친근하고 전문적인 톤으로, **간결하게** 작성하세요. 일반 질문은 200자 이내, 특정 어학원 상세 정보 요청(코스, 기숙사 등)은 충분히 상세하게 답변하세요.
10. 어학원 추천 관련한 질문을 받았을 때만 어학원 목록을 보여준다. ex) 스파르타 어학원 알려줘 / 스파르타 어학원 추천해줘 / 세부 어학원 추천해줘 / 바기오 세미스파르타 어학원 알려줘 등. 어학원 목록을 보여주면서 DB 데이터를 기반으로 어학원 특징을 간단히 알려줘.
11. **시설/건물 관련 질문**: "시설 좋은 곳", "깨끗한 어학원", "신축" 등 시설 관련 질문에는 어학원 목록의 설립연도를 기반으로 최근에 지어지거나 리뉴얼한 어학원을 3개 정도 추천하세요. 답변 형식:
   - 시설 좋은 어학원으로 ~, ~, ~ 어학원들이 있어요. (3개 추천 + 간략한 이유)
   - "정확한 답변은 1:1 상담을 통해 확인하세요!"
   - 마지막 줄: "※ 본 답변은 AI가 생성한 답변으로, 바위로드의 공식적인 의견이 아닙니다."
12. **특정 어학원 상세 질문**: 사용자가 특정 어학원의 코스, 기숙사, 시설, 장단점 등을 물어보면, 아래 제공되는 [어학원 상세 정보]를 기반으로 DB 데이터를 정확하게 답변하세요. 추측이나 일반적인 설명이 아닌, 실제 데이터를 그대로 안내합니다.
13. **배열 데이터 포맷**: 코스 목록, 기숙사 목록, 시설 목록 등 여러 항목을 나열할 때는 반드시 불릿(•) 또는 번호(1. 2. 3.) 리스트 형식으로 보여주세요. 한 줄에 쭉 이어쓰지 마세요.
    - 예시 (코스): "• ESL General — 1:1 4시간, 그룹 2시간\n• IELTS — 1:1 4시간, 그룹 4시간"
    - 예시 (기숙사): "• 1인실 — 식사 주3식\n• 2인실 — 식사 주3식\n• 3인실 — 식사 주3식"

## 사용 가능한 어학원 목록

${academySummary}

## 출력 형식 (매우 중요 — 반드시 준수)

**핵심: 한 문장이 끝나면 반드시 줄바꿈(\\n)을 넣으세요. 절대로 문장을 이어붙이지 마세요.**

1. **한 문장 = 한 줄**: 마침표(.), 물음표(?), 느낌표(!) 뒤에는 반드시 줄바꿈을 넣으세요.
2. **문단 구분**: 주제가 바뀌는 곳에서는 빈 줄(줄바꿈 2번, \\n\\n)로 문단을 나누세요.
3. **나열할 때**: "• " 불릿 기호를 사용하고, 각 항목마다 줄바꿈을 넣으세요.
4. **면책 문구**: "※"로 시작하는 문구는 반드시 빈 줄로 분리된 별도 문단으로 작성하세요.
5. JSON이나 마크다운(**볼드**, # 제목 등) 포맷은 사용하지 마세요. 순수 텍스트 + 줄바꿈만 사용합니다.
6. **구조**: 인사/공감 → 본문 설명 → 안내/CTA → 면책 문구 순서로 작성하세요.

### 좋은 답변 예시 (이 형식을 따르세요)

세부에서 시설 좋은 어학원을 찾고 계시군요!

시설이 최신인 어학원으로는 아래 3곳을 추천드려요.
• I.BREEZE — 2018년 설립, 세부 시티 중심부 위치
• Cebu Blue Ocean Academy — 2015년 설립, 막탄 해변가 리조트형 캠퍼스
• QQ English IT Park — 2009년 설립, IT파크 내 현대식 건물

더 자세한 상담은 1:1 상담을 이용해주세요!

※ 본 답변은 AI가 생성한 답변으로, 바위로드의 공식적인 의견이 아닙니다.

### 나쁜 답변 예시 (이렇게 하지 마세요)

세부에서 시설 좋은 어학원으로는 I.BREEZE(2018년 설립), Cebu Blue Ocean Academy(2015년 설립), 그리고 QQ English IT Park(2009년 설립)가 있어요. 최신 시설과 쾌적한 환경을 원하신다면 참고해보세요! 정확한 답변은 1:1 상담을 통해 확인하세요! ※ 본 답변은 AI가 생성한 답변으로, 바위로드의 공식적인 의견이 아닙니다.`;
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
  maxTokens = 300,
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
      max_tokens: maxTokens,
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

    // 특정 어학원 언급 감지 → 상세 정보 컨텍스트 주입
    const mentionedAcademies = detectMentionedAcademies(lastUserMsg?.content ?? "");
    const academyDetailContext = buildAcademyDetailContext(mentionedAcademies);

    // 시설 관련 질문 감지 → 설립연도 기준 검색
    const isFacilityQuery = detectFacilityQuery(lastUserMsg?.content ?? "");
    const facilityResults = isFacilityQuery ? await searchNewestAcademies() : [];
    const componentResults = facilityResults.length > 0 ? facilityResults : searchResults;

    // OpenAI에는 최근 N개 메시지만 전송 (토큰 절약), DB에는 전체 저장
    const recentMessages = messages.slice(-MAX_HISTORY_MESSAGES);

    // 어학원 상세 컨텍스트가 있으면 시스템 메시지로 주입
    const messagesForOpenAI = academyDetailContext
      ? [
          { role: "system" as const, content: `아래는 사용자가 언급한 어학원의 상세 DB 데이터입니다. 이 데이터를 기반으로 정확하게 답변하세요.\n\n${academyDetailContext}` },
          ...recentMessages,
        ]
      : recentMessages;

    // 상세 컨텍스트가 있으면 max_tokens 증가 (상세 답변 허용)
    const maxTokens = academyDetailContext ? 600 : 300;
    const openaiResponse = await callOpenAIStream(systemPrompt, messagesForOpenAI, maxTokens);

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
          if (componentResults.length > 0) {
            send({ type: "components", data: componentResults });
          }

          // 가격 관련 키워드 → 견적 CTA 전송
          const priceKeywords = ["가격", "비용", "얼마", "견적", "돈", "페소", "할인"];
          const hasPriceKeyword = priceKeywords.some((keyword) => lastUserMsg?.content.includes(keyword));
          if (hasPriceKeyword) {
            send({ type: "cta", data: { label: "무료 견적 받기", link: "/quote" } });
          }

          // 특정 어학원 언급 → 1:1 상담 CTA 전송
          if (mentionedAcademies.length > 0) {
            send({ type: "cta", data: { label: "1:1 상담 신청", link: "/inquiry" } });
          }

          // DB 저장
          const timestamp = new Date().toISOString();
          const savedComponents = [
            ...(componentResults.length > 0 ? [{ type: "academy_cards", data: componentResults }] : []),
            ...(hasPriceKeyword ? [{ type: "cta_button", data: { label: "무료 견적 받기", link: "/quote" } }] : []),
            ...(mentionedAcademies.length > 0 ? [{ type: "cta_button", data: { label: "1:1 상담 신청", link: "/inquiry" } }] : []),
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
