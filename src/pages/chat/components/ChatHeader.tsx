import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ChatHeader() {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-beige-dark h-14 flex items-center px-4">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-brown-dark hover:text-terracotta transition-colors"
      >
        <ArrowLeft size={20} strokeWidth={2} />
      </button>
      <h1 className="flex-1 text-center text-[0.95rem] font-bold text-brown-dark pr-7">
        AI 상담 어시스턴트
      </h1>
    </header>
  );
}
