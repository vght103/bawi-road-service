import { useEffect, useState, lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { createIsland } from "@/lib/createIsland";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Star, ArrowRight, Check, MessageCircle, Send } from "lucide-react";
import { fetchAcademies } from "@/api/academy/academies";
import type { Academy } from "@/data/academies";

const AcademySwiper = lazy(() => import("./components/AcademySwiper"));

function HomePage() {
  const [aiKeyword, setAiKeyword] = useState("");

  function handleAiSubmit() {
    if (!aiKeyword.trim()) return;
    window.location.href = `/chat?q=${encodeURIComponent(aiKeyword.trim())}`;
  }

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
    <>
      {/* HERO */}
      <section className="bg-cream pt-[120px] pb-14 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-[60px] items-center">
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 bg-green-badge text-accent-green-dark px-3.5 py-1.5 rounded-full text-[0.8rem] font-semibold mb-5">
              <Star size={14} fill="currentColor" />
              수수료 0원, 가격 완전 공개
            </div>
            <h1
              className="text-[2rem] md:text-[3.2rem] font-black leading-[1.25] tracking-tight text-brown-dark"
            >
              필리핀 어학연수
              <br />
              <span className="text-terracotta">다 보여주는</span> 유학원
            </h1>
            <p
              className="mt-5 text-[0.95rem] md:text-[1.1rem] leading-[1.7] text-brown"
            >
              어학원 가격, 시설, 장단점까지 전부 공개합니다.
              <br />
              숨기는 거 없이, 비교하고 직접 고르세요.
            </p>
            {/* AI 상담 */}
            <div
              className="mt-9 animate-fade-in-up max-w-[440px] bg-white rounded-[16px] p-5 border border-beige-dark shadow-sm relative overflow-hidden"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-terracotta to-accent-green" />
              <div className="flex items-center gap-2.5 mb-3">
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
              <div className="flex items-center gap-2  rounded-[10px] px-3.5 py-2.5 border border-beige-dark">
                <Input
                  type="text"
                  value={aiKeyword}
                  onChange={(event) => setAiKeyword(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handleAiSubmit();
                  }}
                  placeholder="어학연수 궁금한 점을 물어보세요"
                  className="flex-1 bg-transparent text-brown-dark text-base placeholder:text-brown-light border-none shadow-none focus-visible:ring-0 h-auto p-0"
                />
                <Button
                  size="icon-sm"
                  className="rounded-full bg-terracotta hover:bg-terracotta-hover shrink-0"
                  disabled={!aiKeyword}
                  onClick={handleAiSubmit}
                  aria-label="AI 상담 전송"
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

              <a
                href="/quote?from=home-hero"
                className="flex items-center justify-center gap-2 w-full bg-terracotta text-white py-3.5 rounded-[10px] text-[0.95rem] font-bold no-underline shadow-[0_4px_14px_rgba(196,96,58,0.3)] hover:bg-terracotta-hover hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(196,96,58,0.35)] transition-all"
              >
                무료 견적서 받기
                <ArrowRight size={18} strokeWidth={2.5} />
              </a>
              <a
                href="/inquiry?from=home-hero"
                className="flex items-center justify-center gap-2 w-full mt-2.5 bg-transparent text-brown border border-beige-dark py-3 rounded-[10px] text-[0.88rem] font-semibold no-underline hover:border-terracotta hover:text-terracotta hover:-translate-y-0.5 transition-all"
              >
                1:1 상담 신청하기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="bg-white py-10 px-6 border-y border-beige-dark">
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
          <div className="mt-12">
            <Suspense fallback={<div className="h-[300px] flex items-center justify-center text-brown">로딩 중...</div>}>
              <AcademySwiper academies={academies} />
            </Suspense>
          </div>
          <div className="mt-10 text-center">
            <a
              href="/academies"
              className="inline-flex items-center gap-2 px-9 py-3.5 bg-white text-brown-dark border-2 border-beige-dark rounded-[10px] font-semibold text-[0.95rem] no-underline hover:border-terracotta hover:text-terracotta hover:-translate-y-0.5 hover:shadow-sm transition-all"
            >
              전체 어학원 보기
              <ArrowRight size={16} strokeWidth={2.5} />
            </a>
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
      <section className="py-20 px-6 bg-cream">
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
            <a
              href="/process"
              className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-terracotta hover:text-terracotta-hover no-underline transition-colors"
            >
              자세한 절차 보기
              <ArrowRight size={16} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </section>

      {/* 바위로드와 함께 CTA */}
      <section className="py-24 px-6 bg-white text-center">
        <div className="max-w-[720px] mx-auto">
          <div className="reveal inline-flex items-center gap-1.5 bg-green-badge text-accent-green-dark px-3.5 py-1.5 rounded-full text-[0.78rem] font-semibold mb-6">
            바위로드 서포트
          </div>
          <h2 className="reveal text-[2rem] md:text-[2.8rem] font-extrabold tracking-tight text-brown-dark leading-[1.2]">
            출국 준비부터 현지 도착까지,
            <br />
            <span className="text-terracotta">바위로드가 함께합니다</span>
          </h2>
          <p className="reveal mt-5 text-[0.95rem] md:text-[1.05rem] leading-[1.75] text-brown max-w-[500px] mx-auto">
            오리엔테이션, 웰컴 키트, 공항 픽업까지
            <br />
            바위로드만의 특별한 케어를 경험하세요.
          </p>
          <div className="reveal mt-10 flex gap-3.5 justify-center flex-wrap">
            <a
              href="/with-bawi"
              className="bg-terracotta text-white px-10 py-4 rounded-[10px] text-base font-bold no-underline inline-flex items-center gap-2.5 shadow-[0_6px_24px_rgba(196,96,58,0.4)] hover:bg-terracotta-hover hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(196,96,58,0.45)] transition-all"
            >
              자세히 알아보기
              <ArrowRight size={18} strokeWidth={2.5} />
            </a>
            <a
              href="/inquiry?from=home-cta"
              className="bg-brown-dark text-cream px-8 py-4 rounded-[10px] text-base font-semibold no-underline inline-flex items-center gap-2 hover:bg-brown-dark/90 hover:-translate-y-0.5 transition-all"
            >
              1:1 상담 신청
            </a>
          </div>
        </div>
      </section>

    </>
  );
}

export default createIsland(HomePage);
