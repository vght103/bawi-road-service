import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Swiper as SwiperType } from "swiper";
import { Star, ArrowRight, ChevronLeft, ChevronRight, Check, MessageCircle, Send } from "lucide-react";
import { fetchAcademies } from "@/api/academy/academies";
import type { Academy } from "@/data/academies";
import { getAcademySystemChipClass } from "@/data/academy/chipColors";

export default function HomePage() {
  const [aiKeyword, setAiKeyword] = useState("");
  const [academySwiper, setAcademySwiper] = useState<SwiperType | null>(null);

  const { data: academies = [] } = useQuery<Academy[]>({
    queryKey: ["academies"],
    queryFn: fetchAcademies,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 },
    );
    document.querySelectorAll(".reveal").forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.opacity = "0";
      htmlEl.style.transform = "translateY(20px)";
      htmlEl.style.transition = "all 0.5s ease";
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-cream">
      <Navbar />

      {/* HERO */}
      <section className="pt-[120px] pb-14 px-6 max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-[60px] items-center">
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 bg-green-badge text-accent-green-dark px-3.5 py-1.5 rounded-full text-[0.8rem] font-semibold mb-5 animate-fade-in-up">
            <Star size={14} fill="currentColor" />
            수수료 0원, 가격 완전 공개
          </div>
          <h1
            className="text-[2rem] md:text-[3.2rem] font-black leading-[1.25] tracking-tight text-brown-dark animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            필리핀 어학연수
            <br />
            <span className="text-terracotta">다 보여주는</span> 유학원
          </h1>
          <p
            className="mt-5 text-[0.95rem] md:text-[1.1rem] leading-[1.7] text-brown animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            어학원 가격, 시설, 장단점까지 전부 공개합니다.
            <br />
            숨기는 거 없이, 비교하고 직접 고르세요.
          </p>
          {/* AI 상담 */}
          <div className="mt-9 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-terracotta to-amber-400 flex items-center justify-center shrink-0">
                <MessageCircle size={12} strokeWidth={2.5} className="text-white" />
              </div>
              <span className="text-[0.8rem] font-semibold text-brown">
                <span className="bg-gradient-to-r from-terracotta to-amber-500 bg-clip-text text-transparent font-extrabold">
                  AI
                </span>{" "}
                상담으로 물어보기
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-[10px] px-3.5 py-2.5 border border-beige-dark max-w-[440px]">
              <Input
                type="text"
                value={aiKeyword}
                onChange={(event) => setAiKeyword(event.target.value)}
                placeholder="어학연수 궁금한 점을 물어보세요"
                className="flex-1 bg-transparent text-[0.82rem] placeholder:text-brown-light border-none shadow-none focus-visible:ring-0 h-auto p-0"
              />
              <Button
                size="icon-sm"
                className="rounded-full bg-terracotta hover:bg-terracotta-hover shrink-0"
                disabled={!aiKeyword}
              >
                <Send size={14} strokeWidth={2.5} className="text-white" />
              </Button>
            </div>
          </div>
        </div>

        {/* Hero Visual - Quote CTA Card */}
        <div
          className="relative flex justify-center items-center animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="bg-white rounded-[20px] p-7 md:p-9 shadow-lg w-full max-w-[440px] border border-beige-dark relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-terracotta to-accent-green" />

            <div className="inline-flex items-center gap-1.5 bg-terracotta-light text-terracotta px-3 py-1 rounded-full text-[0.75rem] font-bold mb-4">
              무료 견적 서비스
            </div>

            <h3 className="text-[1.3rem] md:text-[1.5rem] font-extrabold text-brown-dark leading-[1.3] mb-2">
              내 연수 비용,
              <br />
              <span className="text-terracotta">무료로 확인</span>하세요
            </h3>
            <p className="text-[0.85rem] text-brown leading-[1.6] mb-5">
              어학원, 기간, 기숙사를 선택하면 예상 비용이 바로 나와요.
            </p>

            <div className="flex flex-col gap-2.5 mb-6">
              {["수수료 0원 — 학생 부담 제로", "가격 100% 공개 — 숨김 비용 없음", "상담 없이 바로 확인 가능"].map(
                (point) => (
                  <div key={point} className="flex items-center gap-2.5 text-[0.82rem] text-brown-dark">
                    <div className="w-5 h-5 rounded-full bg-accent-green-light flex items-center justify-center shrink-0">
                      <Check size={12} strokeWidth={3} className="text-accent-green-dark" />
                    </div>
                    <span className="font-medium">{point}</span>
                  </div>
                ),
              )}
            </div>

            <Link
              to="/quote"
              className="flex items-center justify-center gap-2 w-full bg-terracotta text-white py-3.5 rounded-[10px] text-[0.95rem] font-bold no-underline shadow-[0_4px_14px_rgba(196,96,58,0.3)] hover:bg-terracotta-hover hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(196,96,58,0.35)] transition-all"
            >
              무료 견적서 받기
              <ArrowRight size={18} strokeWidth={2.5} />
            </Link>

          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="bg-beige py-10 px-6 border-y border-beige-dark">
        <div className="max-w-[1200px] mx-auto flex justify-center gap-6 md:gap-12 flex-wrap">
          {["학생 수수료 0원", "가격 100% 공개", "검증된 어학원만", "솔직한 장단점 비교"].map((text) => (
            <div key={text} className="flex items-center gap-2.5 text-[0.95rem] font-semibold text-brown">
              <div className="w-1.5 h-1.5 rounded-full bg-terracotta shrink-0" />
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* ACADEMIES SECTION */}
      <section className="py-20 px-6 bg-cream">
        <div className="max-w-[1200px] mx-auto md:px-7">
          <div className="inline-flex items-center gap-1.5 bg-green-badge text-accent-green-dark px-3 py-1.5 rounded-2xl text-[0.75rem] font-semibold uppercase tracking-wider mb-3">
            인기 어학원
          </div>
          <h2 className="text-[1.6rem] md:text-[2.2rem] font-extrabold tracking-tight text-brown-dark leading-[1.3]">
            학생들이 많이 찾는 어학원
          </h2>
          <p className="mt-3 text-base leading-[1.7] text-brown max-w-[600px]">
            가격, 시설, 수업 스타일까지 한눈에 비교해보세요.
          </p>
          <div className="mt-12 relative">
            <Swiper
              modules={[Pagination]}
              pagination={{ clickable: true }}
              spaceBetween={20}
              slidesPerView={1}
              slidesPerGroup={1}
              loop
              breakpoints={{
                768: { slidesPerView: 2, slidesPerGroup: 2 },
                1024: { slidesPerView: 3, slidesPerGroup: 3 },
              }}
              onSwiper={setAcademySwiper}
              className="pb-12"
            >
              {academies.slice(0, 9).map((academy) => (
                <SwiperSlide key={academy.id}>
                  <Link
                    to={`/academy/${academy.id}`}
                    className="block bg-white rounded-[20px] overflow-hidden border border-beige-dark hover:-translate-y-1 hover:shadow-lg transition-all no-underline text-brown-text"
                  >
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
                    <div className="p-5">
                      <div className="text-[1.1rem] font-bold text-brown-dark">{academy.name}</div>
                      <p className="mt-1.5 text-[0.82rem] text-brown leading-[1.5] line-clamp-2">{academy.desc}</p>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
            <button
              onClick={() => academySwiper?.slidePrev()}
              className="absolute -left-5 top-[calc(50%-24px)] z-10 w-10 h-10 rounded-full bg-white shadow-md border border-beige-dark items-center justify-center text-brown-dark hover:bg-beige hover:border-brown-light transition-all hidden md:flex"
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => academySwiper?.slideNext()}
              className="absolute -right-5 top-[calc(50%-24px)] z-10 w-10 h-10 rounded-full bg-white shadow-md border border-beige-dark items-center justify-center text-brown-dark hover:bg-beige hover:border-brown-light transition-all hidden md:flex"
            >
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/academies"
              className="inline-flex items-center gap-2 px-9 py-3.5 bg-white text-brown-dark border-2 border-beige-dark rounded-[10px] font-semibold text-[0.95rem] no-underline hover:border-terracotta hover:text-terracotta hover:-translate-y-0.5 hover:shadow-sm transition-all"
            >
              전체 어학원 보기
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY SECTION */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-green-badge text-accent-green-dark px-3 py-1.5 rounded-2xl text-[0.75rem] font-semibold uppercase tracking-wider mb-3">
            🌱 Why 바위로드
          </div>
          <h2 className="text-[1.6rem] md:text-[2.2rem] font-extrabold tracking-tight text-brown-dark leading-[1.3]">
            왜 바위로드와 함께해야 할까요?
          </h2>
          <p className="mt-3 text-base leading-[1.7] text-brown max-w-[600px]">
            어학원 선택부터 출국까지, 필요한 정보를 한곳에 모았습니다.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🔍",
                color: "bg-terracotta-light",
                title: "가격 완전 공개",
                desc: "학비, 기숙사비, 현지 비용까지 모두 웹사이트에서 확인할 수 있어요. 상담 없이도 정확한 비용을 알 수 있습니다.",
              },
              {
                icon: "⚖️",
                color: "bg-accent-green-light",
                title: "솔직한 비교",
                desc: "어학원마다 장점만 나열하지 않아요. 단점도 솔직하게 알려드려서 나에게 맞는 곳을 찾을 수 있어요.",
              },
              {
                icon: "🤝",
                color: "bg-beige",
                title: "수수료 제로",
                desc: "학생에게 수수료를 받지 않습니다. 어학원에서 받는 커미션으로 운영해요. 여러분이 내는 금액은 직접 등록과 동일합니다.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="reveal bg-cream rounded-[20px] p-8 border border-beige-dark hover:-translate-y-1 hover:shadow-md hover:border-brown-light transition-all"
              >
                <div
                  className={`w-[52px] h-[52px] rounded-[14px] mb-5 flex items-center justify-center text-2xl ${card.color}`}
                >
                  {card.icon}
                </div>
                <h3 className="text-[1.15rem] font-bold mb-2.5 text-brown-dark">{card.title}</h3>
                <p className="text-[0.9rem] leading-[1.65] text-brown">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section className="py-20 px-6 bg-beige">
        <div className="max-w-[1200px] mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-green-badge text-accent-green-dark px-3 py-1.5 rounded-2xl text-[0.75rem] font-semibold uppercase tracking-wider mb-3">
            📋 수속 절차
          </div>
          <h2 className="text-[1.6rem] md:text-[2.2rem] font-extrabold tracking-tight text-brown-dark leading-[1.3]">
            상담부터 출국까지, 4단계로 끝
          </h2>
          <p className="mt-3 text-base leading-[1.7] text-brown max-w-[600px]">
            복잡할 거 없어요. 바위로드가 전부 안내해드려요.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              {
                step: "01",
                title: "무료 상담",
                desc: "카카오톡이나 견적 폼으로 간편 상담. 어학원 추천부터 비용까지 안내해드려요.",
              },
              {
                step: "02",
                title: "어학원 확정",
                desc: "비교표와 상세 정보를 보고 나에게 맞는 어학원을 직접 선택하세요.",
              },
              {
                step: "03",
                title: "수속 진행",
                desc: "입학 신청, 항공권, 보험 등 출국 준비를 도와드립니다. 서류 걱정 없어요.",
              },
              {
                step: "04",
                title: "출국!",
                desc: "현지 픽업부터 어학원 입학까지 바위로드가 끝까지 함께합니다.",
              },
            ].map((stepItem) => (
              <div
                key={stepItem.step}
                className="reveal bg-white rounded-[20px] p-6 border border-beige-dark text-center hover:-translate-y-1 hover:shadow-md transition-all"
              >
                <div className="w-11 h-11 rounded-full bg-terracotta-light flex items-center justify-center mx-auto mb-4">
                  <span className="text-[0.75rem] font-extrabold text-terracotta">{stepItem.step}</span>
                </div>
                <h3 className="text-[1.05rem] font-bold text-brown-dark mb-2">{stepItem.title}</h3>
                <p className="text-[0.82rem] leading-[1.65] text-brown">{stepItem.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              to="/process"
              className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-terracotta hover:text-terracotta-hover no-underline transition-colors"
            >
              자세한 절차 보기
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* COST SECTION */}
      <section id="cost" className="py-20 px-6 bg-brown-dark text-cream relative overflow-hidden">
        <div className="absolute -top-1/2 -right-[20%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(196,96,58,0.15)_0%,transparent_70%)] rounded-full" />
        <div className="max-w-[1200px] mx-auto relative">
          <div className="inline-flex items-center gap-1.5 bg-[rgba(74,140,92,0.2)] text-[#8FD4A0] px-3 py-1.5 rounded-2xl text-[0.75rem] font-semibold uppercase tracking-wider mb-3">
            비용 한눈에
          </div>
          <h2 className="text-[1.6rem] md:text-[2.2rem] font-extrabold tracking-tight text-cream leading-[1.3]">
            기간별 예상 비용
          </h2>
          <p className="mt-3 text-base leading-[1.7] text-brown-light max-w-[600px]">
            학비 + 기숙사 기준, 어학원과 옵션에 따라 달라질 수 있어요.
          </p>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {[
              {
                weeks: "4주",
                price: "150만원~",
                sub: "약 $1,100~",
                detail: "단기 체험\n기초 회화 집중",
                popular: false,
              },
              {
                weeks: "8주",
                price: "280만원~",
                sub: "약 $2,000~",
                detail: "가장 인기\n실력 향상 체감",
                popular: true,
              },
              {
                weeks: "12주",
                price: "400만원~",
                sub: "약 $2,900~",
                detail: "중급 목표\n시험 준비 가능",
                popular: false,
              },
              {
                weeks: "24주",
                price: "750만원~",
                sub: "약 $5,500~",
                detail: "장기 마스터\n고급 레벨 도달",
                popular: false,
              },
            ].map((item) => (
              <div
                key={item.weeks}
                className={`reveal rounded-[20px] p-7 text-center backdrop-blur-[4px] border transition-all hover:-translate-y-1 relative ${
                  item.popular
                    ? "bg-[rgba(196,96,58,0.15)] border-terracotta"
                    : "bg-white/[0.06] border-white/10 hover:bg-white/10"
                }`}
              >
                {item.popular && (
                  <span className="absolute -top-2.5 right-4 bg-terracotta text-white px-3 py-0.5 rounded-[10px] text-[0.7rem] font-bold">
                    인기
                  </span>
                )}
                <div className="text-[0.85rem] text-brown-light font-semibold mb-2">{item.weeks}</div>
                <div className="text-[1.8rem] font-black text-cream tracking-tight">{item.price}</div>
                <div className="text-[0.75rem] text-brown-light mt-1">{item.sub}</div>
                <div className="mt-4 pt-4 border-t border-white/10 text-[0.78rem] text-brown-light leading-[1.6] whitespace-pre-line">
                  {item.detail}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/visa-info"
              className="inline-flex items-center gap-2 text-[0.9rem] text-brown-light hover:text-cream font-medium no-underline transition-colors"
            >
              현지에서 발생하는 부대비용 알아보기
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" className="py-20 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-green-badge text-accent-green-dark px-3 py-1.5 rounded-2xl text-[0.75rem] font-semibold uppercase tracking-wider mb-3">
            💬 학생 후기
          </div>
          <h2 className="text-[1.6rem] md:text-[2.2rem] font-extrabold tracking-tight text-brown-dark leading-[1.3]">
            바위로드와 함께한 이야기
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                stars: "★★★★★",
                text: '"다른 유학원은 상담해야 가격을 알려주는데, 여기는 웹사이트에서 다 비교할 수 있어서 편했어요. 진짜 숨기는 거 없더라구요."',
                name: "김OO님",
                meta: "SMEAG Capital · ESL 8주",
                avatar: "김O",
              },
              {
                stars: "★★★★★",
                text: '"직장 다니면서 준비하느라 시간이 없었는데, 견적도 바로 나오고 수속도 온라인으로 끝나서 정말 편했습니다."',
                name: "이OO님",
                meta: "CPI · ESL 12주",
                avatar: "이O",
              },
              {
                stars: "★★★★☆",
                text: '"장단점을 솔직하게 알려줘서 오히려 믿음이 갔어요. 바기오가 저한테 맞는다는 걸 여기서 알게 됐습니다."',
                name: "박OO님",
                meta: "PINES · ESL 8주",
                avatar: "박O",
              },
            ].map((review) => (
              <div
                key={review.name}
                className="reveal bg-cream rounded-[20px] p-7 border border-beige-dark hover:-translate-y-0.5 hover:shadow-md transition-all"
              >
                <div className="text-gold text-[0.9rem] mb-3.5 tracking-widest">{review.stars}</div>
                <p className="font-serif text-[0.95rem] leading-[1.8] text-brown-dark mb-5">{review.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-beige-dark">
                  <div className="w-10 h-10 rounded-full bg-beige-dark flex items-center justify-center text-[0.85rem] font-bold text-brown">
                    {review.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-[0.85rem]">{review.name}</div>
                    <div className="text-[0.75rem] text-brown">{review.meta}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 bg-brown-dark text-center relative overflow-hidden">
        {/* 배경 radial glow 효과 */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_120%,rgba(196,96,58,0.25)_0%,transparent_70%)]" />
        <div className="absolute -top-[200px] -left-[200px] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(196,96,58,0.08)_0%,transparent_70%)] rounded-full" />
        <div className="absolute -bottom-[150px] -right-[150px] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(74,140,92,0.06)_0%,transparent_70%)] rounded-full" />
        <div className="max-w-[720px] mx-auto relative">
          <div className="reveal inline-flex items-center gap-1.5 bg-[rgba(255,255,255,0.08)] text-brown-light px-3.5 py-1.5 rounded-full text-[0.78rem] font-semibold mb-6 border border-white/10">
            무료 견적 서비스
          </div>
          <h2 className="reveal text-[2rem] md:text-[2.8rem] font-extrabold tracking-tight text-cream leading-[1.2]">
            내 연수 비용,
            <br />
            <span className="text-terracotta">1분이면 확인돼요</span>
          </h2>
          <p className="reveal mt-5 text-[0.95rem] md:text-[1.05rem] leading-[1.75] text-brown-light max-w-[500px] mx-auto">
            어학원, 기간, 기숙사 옵션을 선택하면 예상 비용이 바로 나와요.
            <br />
            상담 없이도 견적서를 받아보세요.
          </p>
          {/* 강조 포인트 배지 3개 */}
          <div className="reveal mt-7 flex flex-wrap justify-center gap-2.5">
            {["✓ 30초 만에 견적 확인", "✓ 상담 없이 가능", "✓ 가격 100% 투명 공개"].map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/[0.07] border border-white/15 text-[0.8rem] font-semibold text-cream"
              >
                {badge}
              </span>
            ))}
          </div>
          {/* CTA 버튼 */}
          <div className="reveal mt-10 flex gap-3.5 justify-center flex-wrap">
            <Link
              to="/quote"
              className="bg-terracotta text-white px-10 py-4 rounded-[10px] text-base font-bold no-underline inline-flex items-center gap-2.5 shadow-[0_6px_24px_rgba(196,96,58,0.4)] hover:bg-terracotta-hover hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(196,96,58,0.45)] transition-all"
            >
              무료 견적서 받기
              <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
            <a
              href="#"
              className="bg-white/8 text-cream px-8 py-4 rounded-[10px] text-base font-semibold border border-white/20 no-underline inline-flex items-center gap-2 hover:bg-white/14 hover:-translate-y-0.5 transition-all"
            >
              카카오톡 상담
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
