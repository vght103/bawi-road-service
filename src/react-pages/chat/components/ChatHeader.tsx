import { ArrowLeft } from "lucide-react";

// 채팅 페이지 상단 고정 헤더 (뒤로 가기 + 페이지 제목)
export default function ChatHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-beige-dark h-14 flex items-center px-4">
      <button
        onClick={() => { window.location.href = "/"; }}
        className="flex items-center gap-2 text-brown-dark hover:text-terracotta transition-colors"
      >
        <ArrowLeft size={20} strokeWidth={2} />
      </button>

      {/* 중앙 정렬 (뒤로 가기 버튼 너비만큼 pr로 보정) */}
      <h1 className="flex-1 text-center text-[0.95rem] font-bold text-brown-dark pr-7">
        AI 상담 어시스턴트
      </h1>
    </header>
  );
}
