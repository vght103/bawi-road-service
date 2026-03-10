import { MessageCircle, ArrowRight } from "lucide-react";
import type { ChatMessage } from "@/types/chat";

// AI 응답에 줄바꿈이 부족할 때 문장 부호 뒤에 줄바꿈을 삽입하여 가독성 보완
// 줄바꿈이 이미 충분하면(3개 이상) 원본 그대로 반환
// "※" 앞에는 빈 줄 추가로 강조
function ensureLineBreaks(text: string): string {
  const newlineCount = (text.match(/\n/g) || []).length;
  const sentenceCount = (text.match(/[.!?]\s/g) || []).length;

  if (newlineCount >= 3 || sentenceCount <= 1) return text;

  if (newlineCount < sentenceCount / 2) {
    return text
      .replace(/([.!?])\s+(?![\n•※\-·])/g, "$1\n") // 문장 부호 뒤 공백을 줄바꿈으로 교체
      .replace(/\s*(※)/g, "\n\n$1"); // "※" 앞에 빈 줄 추가
  }

  return text;
}

interface MessageBubbleProps {
  message: ChatMessage;
  onCtaClick?: (ctaType: "quote" | "inquiry") => void;
}

// 채팅 메시지 말풍선
// 사용자: 우측 정렬 + 테라코타 배경
// AI: 좌측 정렬 + 흰색 배경 + 아이콘
// AI 텍스트: 줄바꿈 보정 → 단락 분리 → 불릿/일반 텍스트 혼합 렌더링
export default function MessageBubble({ message, onCtaClick }: MessageBubbleProps) {
  const isUser = message.role === "user";

  // 사용자 메시지
  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] bg-terracotta text-white rounded-2xl rounded-tr-sm px-4 py-3 text-[0.88rem] leading-[1.6]">
          {message.content}
        </div>
      </div>
    );
  }

  const academyCards = message.components?.find(
    (component) => component.type === "academy_cards"
  );
  const academies = academyCards?.type === "academy_cards" ? academyCards.data : []; // 추천 어학원 목록

  const ctaButtons = message.components
    ?.filter((component) => component.type === "cta_button")
    .map((component) => component.type === "cta_button" ? component.data : null)
    .filter(Boolean) ?? []; // CTA 버튼 목록

  return (
    <div className="flex gap-2.5">
      {/* AI 아이콘 (그라디언트 원형) */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-terracotta to-amber-400 flex items-center justify-center shrink-0 mt-0.5">
        <MessageCircle size={14} strokeWidth={2.5} className="text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <span className="text-[0.75rem] font-semibold text-brown mb-1 block">
          AI 상담
        </span>

        <div className="bg-white text-brown-dark rounded-2xl rounded-tl-sm px-4 py-3.5 text-[0.88rem] leading-[1.75] border border-beige-dark">
          <div className="flex flex-col gap-3">
            {/* 텍스트 렌더링: 줄바꿈 보정 → 빈 줄로 단락 분리 → 불릿/일반 텍스트 혼합 처리 */}
            {ensureLineBreaks(message.content).split(/\n{2,}/).map((paragraph, paragraphIndex) => {
              const lines = paragraph.split("\n");
              const hasBullets = lines.some((line) => /^[•\-·]/.test(line.trim())); // 불릿 포함 단락 여부

              if (hasBullets) {
                // 불릿 줄과 일반 텍스트가 섞인 혼합 단락 처리
                // 연속된 불릿 줄은 "bullets" 그룹, 일반 텍스트는 "text" 그룹으로 묶음
                const groups: Array<{ type: "text" | "bullets"; content: string[] }> = [];
                for (const line of lines) {
                  const isBullet = /^[•\-·]/.test(line.trim());
                  const lastGroup = groups[groups.length - 1];
                  if (isBullet) {
                    if (lastGroup?.type === "bullets") {
                      lastGroup.content.push(line.trim().replace(/^[•\-·]\s*/, "")); // 불릿 기호 제거
                    } else {
                      groups.push({ type: "bullets", content: [line.trim().replace(/^[•\-·]\s*/, "")] });
                    }
                  } else if (line.trim()) {
                    if (lastGroup?.type === "text") {
                      lastGroup.content.push(line);
                    } else {
                      groups.push({ type: "text", content: [line] });
                    }
                  }
                }

                return (
                  <div key={paragraphIndex} className="flex flex-col gap-2">
                    {groups.map((group, groupIndex) =>
                      group.type === "bullets" ? (
                        <ul key={groupIndex} className="flex flex-col gap-1.5 list-none m-0 pl-1">
                          {group.content.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex gap-2 m-0 p-0">
                              <span className="text-brown-light shrink-0">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p key={groupIndex} className="whitespace-pre-wrap m-0">
                          {group.content.join("\n")}
                        </p>
                      )
                    )}
                  </div>
                );
              }

              return (
                <p key={paragraphIndex} className="whitespace-pre-wrap m-0">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* 추천 어학원 목록 */}
          {academies.length > 0 && (
            <ul className="mt-3 pt-2 border-t border-beige-dark flex flex-col gap-1.5 list-none m-0 p-0">
              {academies.map((academy) => (
                <li key={academy.id} className="m-0 p-0">
                  <a
                    href={`/academy/${academy.id}`}
                    className="flex items-baseline gap-2 py-0.5 no-underline text-brown-dark hover:text-terracotta transition-colors group"
                  >
                    <span className="text-brown-light shrink-0">•</span>
                    <span className="text-[0.84rem]">
                      <span className="font-semibold">{academy.name}</span>
                      <span className="text-brown-light text-[0.78rem]">
                        {" "}— {academy.region} · {academy.academy_system}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}

          {/* CTA 버튼 목록 */}
          {ctaButtons.length > 0 && (
            <div className={`flex flex-wrap gap-2 ${academies.length > 0 ? "mt-3 pt-3 border-t border-beige-dark" : "mt-3"}`}>
              {ctaButtons.map((cta, index) => (
                <a
                  key={index}
                  href={cta!.link.includes("?") ? `${cta!.link}&from=chatbot-message` : `${cta!.link}?from=chatbot-message`} // 유입 경로 추적 파라미터 추가
                  onClick={() => {
                    const ctaType = cta!.link.includes("quote") ? "quote" as const : "inquiry" as const; // 링크로 타입 분류
                    onCtaClick?.(ctaType);
                  }}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full bg-white text-terracotta border border-terracotta text-[0.78rem] font-medium no-underline hover:bg-terracotta hover:text-white transition-colors"
                >
                  {cta!.label}
                  <ArrowRight size={13} strokeWidth={2.5} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
