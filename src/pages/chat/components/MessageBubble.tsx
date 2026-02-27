import { Link } from "react-router-dom";
import { MessageCircle, ArrowRight } from "lucide-react";
import type { ChatMessage } from "@/types/chat";
import { getAcademySystemChipClass } from "@/data/academy/chipColors";

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
          <div className="flex flex-col gap-2.5">
            {message.content.split(/\n{2,}/).map((paragraph, index) => (
              <p key={index} className="whitespace-pre-wrap m-0">
                {paragraph}
              </p>
            ))}
          </div>
          {academies.length > 0 && (
            <div className="mt-3 pt-1 border-t border-beige-dark flex flex-col divide-y divide-beige-dark">
              {academies.map((academy) => (
                <Link
                  key={academy.id}
                  to={`/academy/${academy.id}`}
                  className="flex items-center justify-between gap-2 py-3 no-underline group"
                >
                  <div className="min-w-0">
                    <div className="text-[0.84rem] font-semibold text-brown-dark">
                      {academy.name}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[0.72rem] text-brown-light">
                        {academy.region}
                      </span>
                      <span className="text-[0.6rem] text-brown-light">·</span>
                      <span className={`px-1.5 py-0.5 rounded text-[0.65rem] font-medium ${getAcademySystemChipClass(academy.academy_system)}`}>
                        {academy.academy_system}
                      </span>
                    </div>
                  </div>
                  <ArrowRight
                    size={14}
                    strokeWidth={2.5}
                    className="text-terracotta shrink-0 group-hover:translate-x-0.5 transition-transform"
                  />
                </Link>
              ))}
            </div>
          )}
          {ctaButtons.length > 0 && (
            <div className={`flex flex-wrap gap-2 ${academies.length > 0 ? "mt-3 pt-3 border-t border-beige-dark" : "mt-3"}`}>
              {ctaButtons.map((cta, index) => (
                <Link
                  key={index}
                  to={cta!.link}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full bg-terracotta text-white text-[0.78rem] font-medium no-underline hover:bg-terracotta-hover transition-colors"
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
