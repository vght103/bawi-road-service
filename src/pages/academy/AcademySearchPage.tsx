import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const academies = [
  {
    id: "smeag",
    name: "SMEAG Capital",
    region: "세부",
    style: "스파르타",
    desc: "세부 최대 규모 어학원. IELTS, TOEIC 공인시험 센터를 보유하고 있어 시험 준비에 최적화된 환경.",
    tags: ["ESL", "IELTS", "TOEIC"],
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "cpi",
    name: "CPI (Cebu Pelis Institute)",
    region: "세부",
    style: "세미스파르타",
    desc: "리조트형 캠퍼스로 수영장, 헬스장 등 시설이 뛰어남. ESL 과정이 강하며 쾌적한 학습 환경 제공.",
    tags: ["ESL", "스피킹"],
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "pines",
    name: "PINES Main",
    region: "바기오",
    style: "스파르타",
    desc: "바기오의 명문 스파르타 어학원. 시원한 기후와 집중적인 커리큘럼으로 단기간 실력 향상에 최적.",
    tags: ["ESL", "IELTS"],
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "ev",
    name: "EV Academy",
    region: "세부",
    style: "세미스파르타",
    desc: "세부 시내 위치. 깔끔한 신축 캠퍼스와 체계적인 커리큘럼으로 인기가 많은 어학원.",
    tags: ["ESL", "IELTS", "비즈니스"],
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "cia",
    name: "CIA Academy",
    region: "세부",
    style: "세미스파르타",
    desc: "막탄 신캠퍼스로 이전. 바다 근처 리조트 캠퍼스에서 학습과 여가를 동시에 즐길 수 있음.",
    tags: ["ESL", "TOEFL", "TOEIC"],
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "beci",
    name: "BECI Main",
    region: "바기오",
    style: "세미스파르타",
    desc: "바기오의 대표 세미스파르타. SP트레이너 프로그램으로 발음 교정에 강점. 쾌적한 학습 환경.",
    tags: ["ESL", "스피킹"],
    image: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=600&q=80",
  },
];

export default function AcademySearchPage() {
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
          <h2 className="text-lg font-bold text-brown-dark">{academies.length}개 어학원</h2>
          <select className="bg-white border border-beige-dark rounded-lg px-3 py-2 text-sm text-brown focus:outline-none cursor-pointer">
            <option>추천순</option>
          </select>
        </div>

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
      </div>

      <Footer />
    </div>
  );
}
