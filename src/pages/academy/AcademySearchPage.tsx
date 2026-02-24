import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchAcademies } from "@/api/academy/academies";
import type { Academy } from "@/data/academies";

export default function AcademySearchPage() {
  const { data: academies = [], isLoading } = useQuery<Academy[]>({
    queryKey: ["academies"],
    queryFn: fetchAcademies,
  });

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      {/* Page Header */}
      <div className="bg-white border-b border-beige-dark pt-20">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <h1 className="text-[1.8rem] md:text-[2.2rem] font-extrabold text-brown-dark tracking-tight mb-2">어학원 비교</h1>
          <p className="text-brown text-base">시설, 수업 스타일까지 한눈에 비교하세요.</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="border-b border-beige-dark bg-white sticky top-16 z-40">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <div className="flex items-stretch rounded-xl h-12 border border-beige-dark bg-cream overflow-hidden">
            <div className="flex items-center justify-center pl-4 text-brown">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <input
              className="flex-1 bg-transparent px-3 text-sm focus:outline-none placeholder:text-brown-light border-none"
              placeholder="어학원 이름 또는 지역으로 검색..."
            />
          </div>
          <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar pb-1">
            {["전체", "세부", "바기오", "클락", "스파르타", "세미스파르타", "ESL", "IELTS", "TOEIC"].map(
              (filter, i) => (
                <button
                  key={filter}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    i === 0
                      ? "bg-terracotta text-white font-semibold"
                      : "bg-white border border-beige-dark text-brown hover:border-brown-light"
                  }`}
                >
                  {filter}
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-brown-dark">{isLoading ? "..." : academies.length}개 어학원</h2>
          <select className="bg-white border border-beige-dark rounded-lg px-3 py-2 text-sm text-brown focus:outline-none cursor-pointer">
            <option>추천순</option>
          </select>
        </div>

        {isLoading ? (
          <div className="text-center py-16 text-brown">불러오는 중...</div>
        ) : academies.length === 0 ? (
          <div className="text-center py-16 text-brown">등록된 어학원이 없습니다.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {academies.map((academy) => (
              <Link
                to={`/academy/${academy.id}`}
                key={academy.id}
                className="bg-white rounded-[20px] overflow-hidden border border-beige-dark hover:-translate-y-1 hover:shadow-lg transition-all no-underline text-brown-text"
              >
                <div className="h-[180px] relative overflow-hidden">
                  <img src={academy.image} alt={academy.name} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2.5 py-1 rounded-md text-[0.7rem] font-semibold bg-white/90 text-brown-dark">
                      {academy.region}
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[0.7rem] font-semibold bg-accent-green text-white">
                      {academy.style}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-[1.1rem] font-bold text-brown-dark">{academy.name}</div>
                  <p className="mt-1.5 text-[0.82rem] text-brown leading-[1.5] line-clamp-2">{academy.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {academy.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-beige text-brown text-[0.72rem] rounded font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
