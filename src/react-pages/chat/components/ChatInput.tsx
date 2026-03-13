import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CtaButton from "./CtaButton";
import type { CtaButtonData } from "@/types/chat";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean; // AI 응답 중이거나 Turnstile 토큰 미준비 시 true
  ctaButtons?: CtaButtonData[]; // 입력창 위에 표시할 CTA 버튼 목록
  onCtaClick?: (ctaType: "quote" | "inquiry") => void;
}

// 채팅 하단 고정 입력 영역 (CTA 버튼 + 텍스트 입력 + 전송 버튼)
// IME 조합 중 Enter는 무시하여 한글 조합 완료 전 전송 방지
export default function ChatInput({ value, onChange, onSend, disabled, ctaButtons, onCtaClick }: ChatInputProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-beige-dark px-4 py-3">
      <div className="max-w-[720px] mx-auto">
        {/* CTA 버튼 목록 (가로 스크롤 지원) */}
        {ctaButtons && ctaButtons.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2.5 hide-scrollbar">
            {ctaButtons.map((button, index) => (
              <CtaButton
                key={index}
                data={button}
                onClick={() => {
                  const ctaType = button.link.includes("quote") ? "quote" as const : "inquiry" as const; // 링크로 타입 분류
                  onCtaClick?.(ctaType);
                }}
              />
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 rounded-[10px] px-3.5 py-2.5 border border-beige-dark">
          <Input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              // isComposing: 한글 등 IME 조합 중에는 전송하지 않음
              if (event.key === "Enter" && !event.nativeEvent.isComposing) onSend();
            }}
            placeholder="어학연수에 대해 물어보세요"
            disabled={disabled}
            className="flex-1 bg-transparent text-brown-dark text-base placeholder:text-brown-light border-none shadow-none focus-visible:ring-0 h-auto p-0"
          />
          <Button
            size="icon-sm"
            className="rounded-full bg-terracotta hover:bg-terracotta-hover shrink-0"
            onClick={onSend}
            disabled={disabled || !value.trim()}
          >
            <Send size={14} strokeWidth={2.5} className="text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
