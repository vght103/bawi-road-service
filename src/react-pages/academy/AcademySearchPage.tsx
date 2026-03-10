import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { createIsland } from "@/lib/createIsland";
import { fetchAcademies } from "@/api/academy/academies";
import type { Academy } from "@/data/academies";
import { getAcademySystemChipClass, getTagChipClass } from "@/data/academy/chipColors";
import LoadingOverlay from "@/components/LoadingOverlay";

// 어학원 검색 및 목록 페이지 — 텍스트 검색 / 지역 / 코스 필터 지원
function AcademySearchPage() {
  const { data: academies = [], isLoading } = useQuery<Academy[]>({
    queryKey: ["academies"],
    queryFn: fetchAcademies,
  });

  const [searchQuery, setSearchQuery] = useState(""); // 텍스트 검색어
  const [regionFilter, setRegionFilter] = useState<string | null>(null); // 지역 필터, null = 전체
  const [tagFilters, setTagFilters] = useState<string[]>([]); // 코스 필터 (복수 선택)

  // 필터 조건에 따라 어학원 목록을 계산 — 텍스트(이름/지역/설명) AND 지역 AND 코스(OR)
  const filteredAcademies = useMemo(() => {
    return academies.filter((academy) => {
      // 텍스트 검색: 이름, 지역, 설명 중 하나라도 포함되면 통과
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesText =
          academy.name.toLowerCase().includes(query) ||
          academy.region.includes(searchQuery) ||
          academy.desc.includes(searchQuery);
        if (!matchesText) return false;
      }

      // 지역 필터: null이면 전체 통과
      if (regionFilter && academy.region !== regionFilter) return false;

      // 코스 필터: academy_system + tags 중 하나라도 선택값에 포함되면 통과 (OR)
      if (tagFilters.length > 0) {
        const academyAllTags = [academy.academy_system, ...academy.tags];
        const matchesAnyTag = tagFilters.some((filter) =>
          academyAllTags.includes(filter)
        );
        if (!matchesAnyTag) return false;
      }

      return true;
    });
  }, [academies, searchQuery, regionFilter, tagFilters]);

  return (
    <>
      <LoadingOverlay visible={isLoading} />

      <div className="bg-white border-b border-beige-dark pt-20">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <h1 className="text-[1.8rem] md:text-[2.2rem] font-extrabold text-brown-dark tracking-tight mb-2">어학원 비교</h1>
          <p className="text-brown text-base">시설, 수업 스타일까지 한눈에 비교하세요.</p>
        </div>
      </div>

      {/* 검색 및 필터 영역 (스크롤 시 상단 고정) */}
      <div className="border-b border-beige-dark bg-white sticky top-16 z-40">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          {/* 텍스트 검색창 */}
          <div className="flex items-stretch rounded-xl h-12 border border-beige-dark bg-cream overflow-hidden">
            <div className="flex items-center justify-center pl-4 text-brown">
              <Search size={20} strokeWidth={2} className="text-brown" />
            </div>
            <input
              className="flex-1 bg-transparent px-3 text-sm focus:outline-none placeholder:text-brown-light border-none"
              placeholder="어학원 이름 또는 지역으로 검색..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          {/* 지역 필터 */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs font-semibold text-brown-light shrink-0 w-8">지역</span>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              {["전체", "세부", "바기오"].map((region) => {
                const isActive = region === "전체" ? regionFilter === null : regionFilter === region; // 전체는 null일 때 활성
                return (
                  <button
                    key={region}
                    onClick={() => setRegionFilter(region === "전체" ? null : region)}
                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-terracotta text-white font-semibold"
                        : "bg-white border border-beige-dark text-brown hover:border-brown-light"
                    }`}
                  >
                    {region}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 코스 필터 (복수 선택) */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-semibold text-brown-light shrink-0 w-8">코스</span>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              {["스파르타", "세미스파르타", "자율형", "ESL", "IELTS", "TOEIC", "TOEFL", "비즈니스", "스피킹"].map((tag) => {
                const isActive = tagFilters.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() =>
                      setTagFilters((prev) =>
                        // 이미 선택된 태그면 제거, 새 태그면 추가
                        prev.includes(tag) ? prev.filter((selected) => selected !== tag) : [...prev, tag]
                      )
                    }
                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-brown-dark text-white font-semibold"
                        : "bg-white border border-beige-dark text-brown hover:border-brown-light"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 검색 결과 */}
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* 로딩 중이면 "..." 표시 */}
        <div className="flex items-center mb-6">
          <h2 className="text-lg font-bold text-brown-dark">{isLoading ? "..." : filteredAcademies.length}개 어학원</h2>
        </div>

        {isLoading ? null
        : filteredAcademies.length === 0 && academies.length > 0 ? (
          <div className="text-center py-16 text-brown">검색 결과가 없습니다.</div>
        ) : academies.length === 0 ? (
          <div className="text-center py-16 text-brown">등록된 어학원이 없습니다.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAcademies.map((academy) => (
              <a
                href={`/academy/${academy.id}`}
                key={academy.id}
                className="bg-white rounded-[20px] overflow-hidden border border-beige-dark hover:-translate-y-1 hover:shadow-lg transition-all no-underline text-brown-text"
              >
                {/* 대표 이미지 + 지역/수업방식 뱃지 */}
                <div className="h-[180px] relative overflow-hidden">
                  <img src={academy.images[0]} alt={academy.name} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2.5 py-1 rounded-md text-[0.7rem] font-semibold bg-white/90 text-brown-dark">
                      {academy.region}
                    </span>
                    <span className={`px-2.5 py-1 rounded-md text-[0.7rem] font-semibold ${getAcademySystemChipClass(academy.academy_system)}`}>
                      {academy.academy_system}
                    </span>
                  </div>
                </div>
                {/* 이름 + 한 줄 설명 + 태그 */}
                <div className="p-5">
                  <div className="text-[1.1rem] font-bold text-brown-dark">{academy.name}</div>
                  <p className="mt-1.5 text-[0.82rem] text-brown leading-[1.5] line-clamp-2">{academy.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {academy.tags.map((tag) => (
                      <span key={tag} className={`px-2 py-0.5 text-[0.72rem] rounded font-medium ${getTagChipClass(tag)}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

    </>
  );
}

export default createIsland(AcademySearchPage);
