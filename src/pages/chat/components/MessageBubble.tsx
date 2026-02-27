import { Link } from "react-router-dom";
import { MessageCircle, ArrowRight } from "lucide-react";
import type { ChatMessage } from "@/types/chat";

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

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
  const academies = academyCards?.type === "academy_cards" ? academyCards.data : [];
  const ctaButtons = message.components
    ?.filter((component) => component.type === "cta_button")
    .map((component) => component.type === "cta_button" ? component.data : null)
    .filter(Boolean) ?? [];

  return (
    <div className="flex gap-2.5">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-terracotta to-amber-400 flex items-center justify-center shrink-0 mt-0.5">
        <MessageCircle size={14} strokeWidth={2.5} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[0.75rem] font-semibold text-brown mb-1 block">
          AI 상담
        </span>
        <div className="bg-white text-brown-dark rounded-2xl rounded-tl-sm px-4 py-3.5 text-[0.88rem] leading-[1.75] border border-beige-dark">
          <div className="flex flex-col gap-3">
            {message.content.split(/\n{2,}/).map((paragraph, paragraphIndex) => {
              const lines = paragraph.split("\n");
              const hasBullets = lines.some((line) => /^[•\-·]/.test(line.trim()));

              if (hasBullets) {
                const groups: Array<{ type: "text" | "bullets"; content: string[] }> = [];
                for (const line of lines) {
                  const isBullet = /^[•\-·]/.test(line.trim());
                  const lastGroup = groups[groups.length - 1];
                  if (isBullet) {
                    if (lastGroup?.type === "bullets") {
                      lastGroup.content.push(line.trim().replace(/^[•\-·]\s*/, ""));
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
          {academies.length > 0 && (
            <ul className="mt-3 pt-2 border-t border-beige-dark flex flex-col gap-1.5 list-none m-0 p-0">
              {academies.map((academy) => (
                <li key={academy.id} className="m-0 p-0">
                  <Link
                    to={`/academy/${academy.id}`}
                    className="flex items-baseline gap-2 py-0.5 no-underline text-brown-dark hover:text-terracotta transition-colors group"
                  >
                    <span className="text-brown-light shrink-0">•</span>
                    <span className="text-[0.84rem]">
                      <span className="font-semibold">{academy.name}</span>
                      <span className="text-brown-light text-[0.78rem]">
                        {" "}— {academy.region} · {academy.academy_system}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {ctaButtons.length > 0 && (
            <div className={`flex flex-wrap gap-2 ${academies.length > 0 ? "mt-3 pt-3 border-t border-beige-dark" : "mt-3"}`}>
              {ctaButtons.map((cta, index) => (
                <Link
                  key={index}
                  to={cta!.link}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full bg-white text-terracotta border border-terracotta text-[0.78rem] font-medium no-underline hover:bg-terracotta hover:text-white transition-colors"
                >
                  {cta!.label}
                  <ArrowRight size={13} strokeWidth={2.5} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
