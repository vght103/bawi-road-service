import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CtaButton from "./CtaButton";
import type { CtaButtonData } from "@/types/chat";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
  ctaButtons?: CtaButtonData[];
}

export default function ChatInput({ value, onChange, onSend, disabled, ctaButtons }: ChatInputProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-beige-dark px-4 py-3">
      <div className="max-w-[720px] mx-auto">
        {ctaButtons && ctaButtons.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2.5 hide-scrollbar">
            {ctaButtons.map((button, index) => (
              <CtaButton key={index} data={button} />
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 rounded-[10px] px-3.5 py-2.5 border border-beige-dark">
          <Input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.nativeEvent.isComposing) onSend();
            }}
            placeholder="어학연수에 대해 물어보세요"
            disabled={disabled}
            className="flex-1 bg-transparent text-brown-dark text-[0.82rem] placeholder:text-brown-light border-none shadow-none focus-visible:ring-0 h-auto p-0"
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
