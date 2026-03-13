import { ArrowRight } from "lucide-react";
import type { CtaButtonData } from "@/types/chat";

interface CtaButtonProps {
  data: CtaButtonData;
  onClick?: () => void; // 클릭 추적 등 추가 동작
}

// AI 채팅 응답 또는 입력창 상단에 표시되는 CTA 링크 버튼
// 기존 쿼리스트링 유무에 따라 &또는 ?로 from=chatbot-message 파라미터 추가
export default function CtaButton({ data, onClick }: CtaButtonProps) {
  const linkWithSource = data.link.includes("?") // 유입 경로 추적 파라미터 추가
    ? `${data.link}&from=chatbot-message`
    : `${data.link}?from=chatbot-message`;

  return (
    <a
      href={linkWithSource}
      onClick={onClick}
      className="flex items-center gap-1.5 bg-white border border-brown-light text-brown-dark rounded-full px-3.5 py-2 text-[0.8rem] font-medium no-underline hover:bg-beige-light transition-colors w-fit"
    >
      {data.label}
      <ArrowRight size={12} strokeWidth={2.5} />
    </a>
  );
}
