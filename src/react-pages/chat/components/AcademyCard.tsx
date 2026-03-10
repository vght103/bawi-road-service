import { ArrowRight } from "lucide-react";
import type { AcademyCardData } from "@/types/chat";
import { getAcademySystemChipClass } from "@/data/academy/chipColors";

interface AcademyCardProps {
  academy: AcademyCardData; // AI 채팅 응답에서 추천된 어학원 데이터
}

// AI가 어학원을 추천할 때 채팅 말풍선 안에 삽입되는 카드
// 클릭 시 해당 어학원 상세 페이지로 이동
export default function AcademyCard({ academy }: AcademyCardProps) {
  return (
    <a
      href={`/academy/${academy.id}`}
      className="block w-[200px] shrink-0 bg-white rounded-xl border border-beige-dark overflow-hidden no-underline hover:-translate-y-0.5 hover:shadow-md transition-all"
    >
      <div className="p-3">
        <div className="text-[0.85rem] font-semibold text-brown-dark truncate">
          {academy.name}
        </div>

        {/* 지역 + 학원 시스템 뱃지 */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="px-2 py-0.5 rounded text-[0.65rem] font-medium bg-white/90 text-brown-dark border border-beige-dark">
            {academy.region}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[0.65rem] font-medium ${getAcademySystemChipClass(academy.academy_system)}`}
          >
            {academy.academy_system}
          </span>
        </div>

        <div className="flex items-center gap-1 mt-2 text-[0.75rem] text-terracotta font-medium">
          자세히 보기
          <ArrowRight size={12} strokeWidth={2.5} />
        </div>
      </div>
    </a>
  );
}
