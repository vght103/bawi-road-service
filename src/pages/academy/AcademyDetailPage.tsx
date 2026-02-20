import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const academy = {
  id: "smeag",
  name: "SMEAG Capital",
  region: "세부",
  style: "스파르타",
  address: "Emilio Osmena St, Guadalupe, Cebu City",
  rating: 4.5,
  reviewCount: 89,
  shortDesc: "세부 최대 규모의 어학원으로 IELTS, TOEIC 공인시험센터를 보유한 검증된 교육기관",
  description:
    "SMEAG Capital은 세부에서 가장 큰 규모의 어학원 중 하나입니다. 브리티시 카운슬 공인 IELTS 시험센터와 ETS 공인 TOEIC 시험센터를 캠퍼스 내에 보유하고 있어, 시험 준비에 최적화된 환경을 제공합니다. 스파르타 규정으로 평일 외출이 제한되며, 집중적인 학습 환경을 원하는 학생들에게 추천합니다.",
  facilities: ["수영장", "헬스장", "카페", "매점", "자습실", "식당"],
  pros: ["IELTS/TOEIC 공인시험센터 보유", "대규모 캠퍼스, 다양한 시설", "체계적인 커리큘럼", "다국적 학생 비율"],
  cons: ["스파르타 규정이 엄격할 수 있음", "시내 중심에서 다소 거리가 있음", "캠퍼스가 오래된 편"],
  recommendedFor: ["시험 점수가 필요한 분", "집중 학습을 원하는 분", "단기간 성과가 필요한 직장인"],
  courses: [
    {
      name: "ESL General",
      category: "ESL",
      manToMan: 4,
      group: 3,
      optional: 1,
      pricePerWeek: 150,
      desc: "기본 ESL 과정. 1:1 수업 4시간 + 그룹 3시간으로 균형 잡힌 커리큘럼.",
    },
    {
      name: "ESL Intensive",
      category: "ESL",
      manToMan: 6,
      group: 2,
      optional: 1,
      pricePerWeek: 180,
      desc: "집중 ESL 과정. 1:1 수업 6시간으로 빠른 실력 향상.",
    },
    {
      name: "IELTS Preparation",
      category: "IELTS",
      manToMan: 4,
      group: 4,
      optional: 0,
      pricePerWeek: 200,
      desc: "IELTS 시험 대비 과정. 실전 모의시험 + 집중 피드백.",
    },
    {
      name: "TOEIC Intensive",
      category: "TOEIC",
      manToMan: 4,
      group: 3,
      optional: 1,
      pricePerWeek: 180,
      desc: "TOEIC 집중 과정. 파트별 전략 학습 + 매주 실전 모의시험.",
    },
  ],
  dormitories: [
    { type: "1인실", pricePerWeek: 200, meals: "주 3식", desc: "개인 공간에서 집중 학습" },
    { type: "2인실", pricePerWeek: 150, meals: "주 3식", desc: "합리적인 가격, 룸메이트와 함께" },
    { type: "3인실", pricePerWeek: 120, meals: "주 3식", desc: "가장 경제적인 옵션" },
    { type: "4인실", pricePerWeek: 100, meals: "주 3식", desc: "최저가, 다양한 친구와 교류" },
  ],
};

export default function AcademyDetailPage() {
  const [selectedCourse, setSelectedCourse] = useState(0);
  const [selectedDorm, setSelectedDorm] = useState(0);
  const [weeks, setWeeks] = useState(8);

  const course = academy.courses[selectedCourse];
  const dorm = academy.dormitories[selectedDorm];
  const tuition = course.pricePerWeek * weeks;
  const dormFee = dorm.pricePerWeek * weeks;
  const total = tuition + dormFee;

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      {/* Breadcrumb */}
      <div className="pt-20 bg-white border-b border-beige-dark">
        <div className="max-w-[1200px] mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-brown">
            <Link to="/" className="hover:text-brown-dark no-underline text-brown">
              홈
            </Link>
            <span>/</span>
            <Link to="/academies" className="hover:text-brown-dark no-underline text-brown">
              어학원
            </Link>
            <span>/</span>
            <span className="text-brown-dark font-medium">{academy.name}</span>
          </div>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Academy Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery Placeholder */}
            <div className="rounded-[20px] overflow-hidden border border-beige-dark">
              <div className="h-[300px] md:h-[400px] bg-gradient-to-br from-beige to-beige-dark relative flex items-center justify-center">
                <span className="text-[0.85rem] font-semibold text-brown-light">사진 준비중</span>
                <div className="absolute bottom-4 right-4 bg-brown-dark/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                  1 / 12
                </div>
              </div>
            </div>

            {/* Academy Header */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-md text-[0.75rem] font-semibold bg-white text-brown-dark border border-beige-dark">
                  {academy.region}
                </span>
                <span className="px-2.5 py-1 rounded-md text-[0.75rem] font-semibold bg-accent-green text-white">
                  {academy.style}
                </span>
                <div className="flex items-center gap-1 text-sm font-semibold text-brown-dark ml-auto">
                  <span className="text-gold">★</span> {academy.rating}
                  <span className="text-brown font-normal">({academy.reviewCount})</span>
                </div>
              </div>
              <h1 className="text-[1.8rem] md:text-[2.2rem] font-extrabold text-brown-dark tracking-tight">{academy.name}</h1>
              <p className="mt-2 text-brown text-base leading-relaxed">{academy.shortDesc}</p>
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-accent-green-light rounded-[16px] p-6 border border-accent-green/20">
                <h3 className="text-accent-green-dark font-bold mb-3 flex items-center gap-2">
                  <span>👍</span> 장점
                </h3>
                <ul className="space-y-2">
                  {academy.pros.map((pro) => (
                    <li key={pro} className="text-sm text-brown-dark flex items-start gap-2">
                      <span className="text-accent-green mt-0.5 shrink-0">✓</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-terracotta-light rounded-[16px] p-6 border border-terracotta/20">
                <h3 className="text-terracotta font-bold mb-3 flex items-center gap-2">
                  <span>📌</span> 참고사항
                </h3>
                <ul className="space-y-2">
                  {academy.cons.map((con) => (
                    <li key={con} className="text-sm text-brown-dark flex items-start gap-2">
                      <span className="text-terracotta mt-0.5 shrink-0">·</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommended For */}
            <div className="bg-white rounded-[16px] p-6 border border-beige-dark">
              <h3 className="font-bold text-brown-dark mb-3">🎯 이런 분에게 추천</h3>
              <div className="flex flex-wrap gap-2">
                {academy.recommendedFor.map((item) => (
                  <span key={item} className="px-3 py-1.5 bg-green-badge text-accent-green-dark rounded-full text-sm font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-[16px] p-6 border border-beige-dark">
              <h3 className="font-bold text-brown-dark mb-3">어학원 소개</h3>
              <p className="text-brown text-[0.9rem] leading-[1.8]">{academy.description}</p>
            </div>

            {/* Facilities */}
            <div className="bg-white rounded-[16px] p-6 border border-beige-dark">
              <h3 className="font-bold text-brown-dark mb-4">시설</h3>
              <div className="flex flex-wrap gap-2">
                {academy.facilities.map((f) => (
                  <span key={f} className="px-3 py-1.5 bg-beige text-brown rounded-[10px] text-sm font-medium">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Courses */}
            <div className="bg-white rounded-[16px] p-6 border border-beige-dark">
              <h3 className="font-bold text-brown-dark mb-4">코스 안내</h3>
              <div className="space-y-3">
                {academy.courses.map((c, i) => (
                  <div
                    key={c.name}
                    className={`p-4 rounded-[12px] border cursor-pointer transition-all ${
                      selectedCourse === i
                        ? "border-terracotta bg-terracotta-light/30"
                        : "border-beige-dark bg-beige/30 hover:border-brown-light"
                    }`}
                    onClick={() => setSelectedCourse(i)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-brown-dark">{c.name}</h4>
                        <span className="text-[0.72rem] px-2 py-0.5 bg-beige text-brown rounded font-medium">{c.category}</span>
                      </div>
                      <span className="text-terracotta font-bold">{c.pricePerWeek.toLocaleString()}원/주</span>
                    </div>
                    <p className="text-sm text-brown mb-2">{c.desc}</p>
                    <div className="flex gap-2 text-[0.75rem]">
                      <span className="px-2 py-0.5 bg-white border border-beige-dark rounded">1:1 {c.manToMan}시간</span>
                      <span className="px-2 py-0.5 bg-white border border-beige-dark rounded">그룹 {c.group}시간</span>
                      {c.optional > 0 && (
                        <span className="px-2 py-0.5 bg-white border border-beige-dark rounded">선택 {c.optional}시간</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dormitories */}
            <div className="bg-white rounded-[16px] p-6 border border-beige-dark">
              <h3 className="font-bold text-brown-dark mb-4">기숙사</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {academy.dormitories.map((d, i) => (
                  <div
                    key={d.type}
                    className={`p-4 rounded-[12px] border cursor-pointer transition-all text-center ${
                      selectedDorm === i
                        ? "border-terracotta bg-terracotta-light/30"
                        : "border-beige-dark bg-beige/30 hover:border-brown-light"
                    }`}
                    onClick={() => setSelectedDorm(i)}
                  >
                    <div className="font-bold text-brown-dark mb-1">{d.type}</div>
                    <div className="text-terracotta font-bold text-lg">{d.pricePerWeek.toLocaleString()}원<span className="text-sm text-brown font-normal">/주</span></div>
                    <div className="text-[0.75rem] text-brown mt-1">{d.meals}</div>
                    <div className="text-[0.72rem] text-brown-light mt-1">{d.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-[16px] p-6 border border-beige-dark">
              <h3 className="font-bold text-brown-dark mb-4">학생 후기</h3>
              <div className="space-y-4">
                {[
                  {
                    avatar: "김O",
                    name: "김OO님",
                    rating: 5,
                    text: "IELTS 준비하기에 최적의 환경이었어요. 캠퍼스 안에서 시험을 볼 수 있어서 실전 감각을 키우기 좋았습니다.",
                    course: "IELTS 8주",
                  },
                  {
                    avatar: "이O",
                    name: "이OO님",
                    rating: 4,
                    text: "스파르타 규정이 처음엔 힘들었지만, 덕분에 집중해서 공부할 수 있었어요. 시설은 조금 오래된 느낌이에요.",
                    course: "ESL 12주",
                  },
                ].map((review) => (
                  <div key={review.name} className="pb-4 border-b border-beige last:border-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-beige-dark flex items-center justify-center text-[0.85rem] font-bold text-brown">
                        {review.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{review.name}</div>
                        <div className="flex items-center gap-1">
                          <span className="text-gold text-sm">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                          <span className="text-[0.72rem] text-brown ml-1">{review.course}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-brown leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-3 border border-beige-dark rounded-[10px] text-sm font-bold text-brown hover:bg-beige transition-colors">
                후기 {academy.reviewCount}개 전체 보기
              </button>
            </div>
          </div>

          {/* Right Column - Quote Simulator (Sticky) */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-[20px] p-6 border border-beige-dark shadow-lg">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-terracotta to-accent-green rounded-t-[20px]" />
                <h3 className="font-bold text-brown-dark text-lg mb-4">견적 시뮬레이터</h3>

                {/* Selected Course */}
                <div className="mb-4">
                  <label className="text-sm font-semibold text-brown-dark mb-1.5 block">코스</label>
                  <div className="text-sm text-brown bg-beige rounded-[10px] px-4 py-3">
                    {course.name}
                    <span className="text-terracotta font-bold ml-2">{course.pricePerWeek.toLocaleString()}원/주</span>
                  </div>
                </div>

                {/* Selected Dorm */}
                <div className="mb-4">
                  <label className="text-sm font-semibold text-brown-dark mb-1.5 block">기숙사</label>
                  <div className="text-sm text-brown bg-beige rounded-[10px] px-4 py-3">
                    {dorm.type}
                    <span className="text-terracotta font-bold ml-2">{dorm.pricePerWeek.toLocaleString()}원/주</span>
                  </div>
                </div>

                {/* Duration */}
                <div className="mb-6">
                  <label className="text-sm font-semibold text-brown-dark mb-1.5 block">기간</label>
                  <select
                    value={weeks}
                    onChange={(e) => setWeeks(Number(e.target.value))}
                    className="w-full bg-beige border border-beige-dark rounded-[10px] px-4 py-3 text-sm text-brown-dark font-medium focus:outline-none cursor-pointer"
                  >
                    {[4, 8, 12, 16, 20, 24].map((w) => (
                      <option key={w} value={w}>
                        {w}주
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-brown">학비 ({weeks}주)</span>
                    <span className="font-bold text-brown-dark">{tuition.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brown">기숙사 ({weeks}주)</span>
                    <span className="font-bold text-brown-dark">{dormFee.toLocaleString()}원</span>
                  </div>
                  <div className="border-t border-beige-dark pt-3 flex justify-between">
                    <span className="font-semibold text-terracotta">최종 금액</span>
                    <span className="font-black text-terracotta text-xl">{total.toLocaleString()}원</span>
                  </div>
                </div>

                {/* Quote Count */}
                <div className="text-center text-[0.8rem] text-brown mb-4">
                  견적 조회 <span className="font-bold text-terracotta">0</span>/3회 사용
                </div>

                {/* CTA Buttons */}
                <Link to="/quote" className="block w-full py-3.5 bg-terracotta text-white rounded-[10px] font-bold hover:bg-terracotta-hover transition-colors mb-2 text-center no-underline">
                  견적서 이메일로 받기
                </Link>
                <Link to="/quote" className="block w-full py-3.5 bg-brown-dark text-white rounded-[10px] font-bold hover:bg-brown-text transition-colors mb-3 text-center no-underline">
                  이 조건으로 수속 신청
                </Link>
                <a
                  href="#"
                  className="block text-center text-sm text-brown hover:text-brown-dark no-underline font-medium"
                >
                  💬 카카오톡으로 상담하기
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
