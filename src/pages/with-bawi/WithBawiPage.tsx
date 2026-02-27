import { Link } from "react-router-dom";
import { useEffect } from "react";
import { CircleCheck, ArrowRight, Plug, Briefcase, BookOpen, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function WithBawiPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
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

  const orientationFeatures = [
    "현지 생활 필수 정보 안내 (교통, 환전, 유심 등)",
    "어학원 첫날 가이드 & 수업 준비",
    "준비물 체크리스트 제공",
    "현지 긴급 연락망 안내",
  ];

  const welcomeKitItems = [
    {
      icon: Plug,
      title: "여행용 멀티어댑터",
      description: "필리핀 콘센트 규격에 맞는 멀티어댑터로 도착 즉시 편리하게 사용하세요.",
    },
    {
      icon: Briefcase,
      title: "바위로드 트래블 파우치",
      description: "여행 필수품을 깔끔하게 정리할 수 있는 바위로드 전용 파우치입니다.",
    },
    {
      icon: BookOpen,
      title: "필리핀 생활 가이드북",
      description: "현지 생활에 꼭 필요한 정보를 담은 바위로드 맞춤형 가이드북입니다.",
    },
    {
      icon: Heart,
      title: "응원 손편지",
      description: "바위로드 팀이 직접 쓴 응원 편지로 새로운 시작을 함께 응원합니다.",
    },
  ];

  const airportPickupFeatures = [
    "마닐라/세부/클락 주요 공항 픽업",
    "어학원까지 안전한 차량 이동",
    "현지 스태프 동행 안내",
    "첫날 정착 서포트",
  ];

  return (
    <div className="bg-cream">
      <Navbar />

      {/* HERO */}
      <section className="pt-[140px] pb-16 px-6 text-center">
        <div className="max-w-[800px] mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-green-badge text-accent-green-dark px-3 py-1.5 rounded-2xl text-[0.75rem] font-semibold mb-5 animate-fade-in-up">
            바위로드 서포트
          </div>
          <h1
            className="text-[2rem] md:text-[3rem] font-black leading-[1.25] tracking-tight text-brown-dark animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            바위로드가 함께하는
            <br />
            <span className="text-terracotta">특별한 출국 준비</span>
          </h1>
          <p
            className="mt-5 text-[0.95rem] md:text-[1.1rem] leading-[1.7] text-brown animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            단순한 유학원 소개가 아닌, 출국 전부터 현지 도착까지
            <br />
            바위로드만의 케어 서비스를 경험하세요.
          </p>
        </div>
      </section>

      {/* SECTION 1: 출국 전 오리엔테이션 */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="reveal">
            <div className="inline-flex items-center gap-1.5 bg-terracotta-light text-terracotta px-3 py-1.5 rounded-2xl text-[0.75rem] font-semibold mb-4">
              STEP 01
            </div>
            <h2 className="text-[1.6rem] md:text-[2.2rem] font-extrabold tracking-tight text-brown-dark leading-[1.3]">
              출국 전 1:1 오리엔테이션
            </h2>
            <p className="mt-5 text-[0.95rem] leading-[1.75] text-brown">
              출국 전 담당 매니저와 <strong>1:1로 진행하는 맞춤형 오리엔테이션</strong>입니다. 어학원 생활부터
              현지 적응까지 꼭 알아야 할 정보를 미리 파악하고, <strong>첫날부터 자신 있게 시작</strong>할 수
              있도록 준비해드립니다.
            </p>
            <ul className="mt-6 space-y-3">
              {orientationFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-[0.9rem] text-brown leading-[1.6]">
                  <CircleCheck className="w-5 h-5 text-accent-green shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal rounded-[20px] aspect-[4/3] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80"
              alt="1:1 오리엔테이션 상담"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* SECTION 2: 출국 선물 증정 */}
      <section className="py-20 px-6 bg-cream">
        <div className="max-w-[1200px] mx-auto">
          <div className="reveal text-center mb-14">
            <div className="inline-flex items-center gap-1.5 bg-terracotta-light text-terracotta px-3 py-1.5 rounded-2xl text-[0.75rem] font-semibold mb-4">
              STEP 02
            </div>
            <h2 className="text-[1.6rem] md:text-[2.2rem] font-extrabold tracking-tight text-brown-dark leading-[1.3]">
              바위로드 웰컴 키트 증정
            </h2>
            <p className="mt-4 text-[0.95rem] leading-[1.7] text-brown max-w-[600px] mx-auto">
              출국하는 모든 학생에게 바위로드가 직접 준비한 웰컴 키트를 드립니다.
              <br />
              낯선 땅에서의 첫 발걸음을 함께 응원합니다.
            </p>
          </div>

          <div className="reveal grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {welcomeKitItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white rounded-[16px] border border-beige-dark p-6 flex flex-col items-start gap-4 hover:-translate-y-1 hover:shadow-md transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-terracotta-light flex items-center justify-center shrink-0">
                    <IconComponent className="w-5 h-5 text-terracotta" />
                  </div>
                  <div>
                    <h3 className="text-[0.95rem] font-bold text-brown-dark mb-2">{item.title}</h3>
                    <p className="text-[0.85rem] leading-[1.6] text-brown">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: 공항 픽업 서비스 */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="reveal rounded-[20px] aspect-[4/3] overflow-hidden order-last md:order-first">
            <img
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80"
              alt="공항 픽업 서비스"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="reveal">
            <div className="inline-flex items-center gap-1.5 bg-terracotta-light text-terracotta px-3 py-1.5 rounded-2xl text-[0.75rem] font-semibold mb-4">
              STEP 03
            </div>
            <h2 className="text-[1.6rem] md:text-[2.2rem] font-extrabold tracking-tight text-brown-dark leading-[1.3]">
              현지 공항 픽업 서비스
            </h2>
            <p className="mt-5 text-[0.95rem] leading-[1.75] text-brown">
              처음 방문하는 낯선 나라에서 혼자 이동하는 걱정은 접어두세요. 필리핀 도착과 동시에{" "}
              <strong>바위로드 현지 스태프가 직접 공항으로 마중</strong>을 나갑니다. 어학원까지 안전하게
              이동하고, 첫날 정착까지 함께합니다.
            </p>
            <ul className="mt-6 space-y-3">
              {airportPickupFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-[0.9rem] text-brown leading-[1.6]">
                  <CircleCheck className="w-5 h-5 text-accent-green shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-24 px-6 bg-brown-dark text-center relative overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(196,96,58,0.18)_0%,transparent_70%)] rounded-full" />
        <div className="max-w-[800px] mx-auto relative">
          <h2 className="text-[1.8rem] md:text-[2.6rem] font-black leading-[1.25] tracking-tight text-cream">
            바위로드와 함께
            <br />
            <span className="text-terracotta-light">걱정 없는 어학연수</span>
          </h2>
          <p className="mt-5 text-[0.95rem] md:text-[1.05rem] leading-[1.7] text-brown-light">
            출국 준비부터 현지 도착까지, 모든 과정을 함께합니다.
          </p>
          <div className="mt-10 flex gap-3.5 justify-center flex-wrap">
            <Link
              to="/inquiry?from=with-bawi"
              className="bg-terracotta text-white px-8 py-3.5 rounded-[10px] text-base font-bold no-underline inline-flex items-center gap-2 shadow-[0_4px_14px_rgba(196,96,58,0.4)] hover:bg-terracotta-hover hover:-translate-y-0.5 transition-all"
            >
              무료 상담 신청
              <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
            <Link
              to="/quote?from=with-bawi"
              className="bg-transparent text-cream px-8 py-3.5 rounded-[10px] text-base font-semibold border-2 border-white/30 no-underline inline-flex items-center gap-2 hover:bg-white/10 hover:border-white/50 hover:-translate-y-0.5 transition-all"
            >
              견적서 받기
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
