import { Info } from "lucide-react";

// 채팅 페이지 상단에 표시되는 AI 답변 면책 안내 배너
export default function AiDisclaimer() {
  return (
    <div className="bg-beige px-4 py-2.5 flex items-start gap-2">
      <Info size={14} className="text-brown shrink-0 mt-0.5" />
      <p className="text-[0.75rem] leading-[1.5] text-brown">
        아래 내용은 AI가 생성한 답변입니다. 정확한 답변은 상담신청으로 확인하실 수 있습니다.
      </p>
    </div>
  );
}
