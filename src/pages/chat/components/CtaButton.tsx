import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { CtaButtonData } from "@/types/chat";

interface CtaButtonProps {
  data: CtaButtonData;
  onClick?: () => void;
}

export default function CtaButton({ data, onClick }: CtaButtonProps) {
  return (
    <Link
      to={data.link}
      onClick={onClick}
      className="flex items-center gap-1.5 bg-white border border-brown-light text-brown-dark rounded-full px-3.5 py-2 text-[0.8rem] font-medium no-underline hover:bg-beige-light transition-colors w-fit"
    >
      {data.label}
      <ArrowRight size={12} strokeWidth={2.5} />
    </Link>
  );
}
