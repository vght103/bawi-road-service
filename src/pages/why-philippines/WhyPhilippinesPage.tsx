import { Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function WhyPhilippinesPage() {
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

  return (
    <div className="bg-cream">
      <Navbar />

      {/* HERO */}
      <section className="pt-[140px] pb-16 px-6 text-center">
        <div className="max-w-[800px] mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-green-badge text-accent-green-dark px-3.5 py-1.5 rounded-full text-[0.8rem] font-semibold mb-5 animate-fade-in-up">
            Why Philippines?
          </div>
          <h1
            className="text-[2rem] md:text-[3rem] font-black leading-[1.25] tracking-tight text-brown-dark animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            왜 <span className="text-terracotta">필리핀</span> 어학연수인가요?
          </h1>
          <p
            className="mt-5 text-[0.95rem] md:text-[1.1rem] leading-[1.7] text-brown animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            최소한의 비용으로 최대의 영어 실력 향상을 원한다면,
            <br />
            필리핀 어학연수가 정답입니다.
          </p>
        </div>
      </section>

      {/* 탭 네비게이션 */}
      <div className="bg-white border-y border-beige-dark sticky top-16 z-30">
        <div className="max-w-[1200px] mx-auto px-6 flex gap-1 overflow-x-auto no-scrollbar">
          {["1:1 맨투맨 수업", "스파르타 시스템", "기숙형 어학원", "합리적 비용", "지리적 장점"].map((tab, i) => (
            <a
              key={tab}
              href={`#section-${i}`}
              className="shrink-0 px-4 py-3.5 text-[0.85rem] font-medium text-brown hover:text-terracotta hover:bg-terracotta-light/30 transition-colors no-underline rounded-t-lg"
            >
              {tab}
            </a>
          ))}
        </div>
      </div>

      {/* SECTION 1: 1:1 맨투맨 수업 */}
      <section id="section-0" className="py-20 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="reveal">
            <div className="inline-flex items-center gap-1.5 bg-terracotta-light text-terracotta px-3 py-1.5 rounded-2xl text-[0.75rem] font-semibold mb-4">
              POINT 01
            </div>
            <h2 className="text-[1.6rem] md:text-[2.2rem] font-extrabold tracking-tight text-brown-dark leading-[1.3]">
              1:1 맨투맨 수업으로
              <br />
              <span className="text-terracotta">확실한 스피킹 향상</span>
            </h2>
            <p className="mt-5 text-[0.95rem] leading-[1.75] text-brown">
              필리핀 어학연수의 가장 큰 장점은 <strong>하루 4~6시간의 1:1 수업</strong>입니다.
              서양권 어학연수는 대부분 10~15명 그룹 수업이라 말할 기회가 적지만,
              필리핀에서는 선생님과 단둘이 수업하기 때문에 <strong>내성적인 성격이라도 영어를 말할 수밖에 없는 환경</strong>이 만들어집니다.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "하루 4~6시간 1:1 수업 + 2~4시간 그룹 수업",
                "개인 레벨과 목표에 맞춘 커리큘럼",
                "선생님과 친밀한 관계 형성으로 학습 동기 유지",
                "내향적인 성격도 자연스럽게 스피킹 연습",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[0.9rem] text-brown leading-[1.6]">
                  <svg className="w-5 h-5 text-accent-green shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal rounded-[20px] aspect-[4/3] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80"
              alt="1:1 맨투맨 영어 수업"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* SECTION 2: 스파르타 시스템 */}
      <section id="section-1" className="py-20 px-6 bg-cream">
        <div className="max-w-[1200px] mx-auto">
          <div className="reveal text-center mb-14">
            <div className="inline-flex items-center gap-1.5 bg-terracotta-light text-terracotta px-3 py-1.5 rounded-2xl text-[0.75rem] font-semibold mb-4">
              POINT 02
            </div>
            <h2 className="text-[1.6rem] md:text-[2.2rem] font-extrabold tracking-tight text-brown-dark leading-[1.3]">
              나에게 맞는 <span className="text-terracotta">학습 스타일</span> 선택
            </h2>
            <p className="mt-4 text-[0.95rem] leading-[1.7] text-brown max-w-[600px] mx-auto">
              필리핀 어학원은 학습 강도에 따라 3가지 타입으로 나뉩니다.
              <br />
              자신의 성향에 맞는 스타일을 선택할 수 있어요.
            </p>
          </div>

          <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                type: "스파르타",
                color: "terracotta",
                bgColor: "bg-terracotta-light",
                borderColor: "border-terracotta/30",
                textColor: "text-terracotta",
                hours: "하루 10~12시간",
                curfew: "평일 외출 금지",
                features: ["의무 자습 + 단어 시험", "평일 외출 불가 (주말 가능)", "단기간 집중 학습에 최적", "강제성이 있어 자기관리 약한 분에게 추천"],
                best: "단기간 확실한 성과가 필요한 분",
              },
              {
                type: "세미스파르타",
                color: "accent-green",
                bgColor: "bg-accent-green-light",
                borderColor: "border-accent-green/30",
                textColor: "text-accent-green-dark",
                hours: "하루 8~10시간",
                curfew: "평일 저녁 외출 가능",
                features: ["수업 참여 의무 + 자율 복습", "평일 저녁 외출 가능 (통금 있음)", "학습과 생활의 균형", "가장 인기 있는 스타일"],
                best: "학습과 여가를 균형 있게 즐기고 싶은 분",
              },
              {
                type: "자율형",
                color: "brown",
                bgColor: "bg-beige",
                borderColor: "border-beige-dark",
                textColor: "text-brown-dark",
                hours: "하루 6~8시간",
                curfew: "자유 외출",
                features: ["수업 외 시간 완전 자율", "외출·외박 자유", "자기주도 학습 가능한 분에게 적합", "현지 문화 체험 병행 가능"],
                best: "자기관리를 잘하는 분, 장기 연수자",
              },
            ].map((item) => (
              <div
                key={item.type}
                className={`bg-white rounded-[20px] p-7 border ${item.borderColor} hover:-translate-y-1 hover:shadow-md transition-all`}
              >
                <div className={`inline-flex px-3 py-1.5 rounded-lg text-[0.8rem] font-bold ${item.bgColor} ${item.textColor} mb-4`}>
                  {item.type}
                </div>
                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2 text-[0.9rem]">
                    <span className="text-brown">수업량</span>
                    <span className="font-semibold text-brown-dark">{item.hours}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[0.9rem]">
                    <span className="text-brown">외출</span>
                    <span className="font-semibold text-brown-dark">{item.curfew}</span>
                  </div>
                </div>
                <div className="border-t border-beige-dark pt-5 space-y-2.5">
                  {item.features.map((f) => (
                    <div key={f} className="flex items-start gap-2 text-[0.85rem] text-brown leading-[1.5]">
                      <div className="w-1.5 h-1.5 rounded-full bg-brown-light shrink-0 mt-2" />
                      {f}
                    </div>
                  ))}
                </div>
                <div className={`mt-5 pt-4 border-t border-beige-dark text-[0.82rem] font-medium ${item.textColor}`}>
                  {item.best}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: 기숙형 어학원 */}
      <section id="section-2" className="py-20 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="reveal rounded-[20px] aspect-[4/3] overflow-hidden order-last md:order-first">
            <img
              src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80"
              alt="어학원 캠퍼스 전경"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="reveal">
            <div className="inline-flex items-center gap-1.5 bg-terracotta-light text-terracotta px-3 py-1.5 rounded-2xl text-[0.75rem] font-semibold mb-4">
              POINT 03
            </div>
            <h2 className="text-[1.6rem] md:text-[2.2rem] font-extrabold tracking-tight text-brown-dark leading-[1.3]">
              기숙사 + 식사 + 수업
              <br />
              <span className="text-terracotta">올인원 시스템</span>
            </h2>
            <p className="mt-5 text-[0.95rem] leading-[1.75] text-brown">
              필리핀 어학원은 대부분 <strong>기숙사, 식당, 강의실이 한 캠퍼스</strong> 안에 있습니다.
              숙소를 따로 구하거나 밥을 챙겨 먹을 걱정 없이 <strong>오직 공부에만 집중</strong>할 수 있어요.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-3">
              {[
                { icon: "🏠", text: "기숙사와 강의실이 같은 건물, 통학 시간 제로" },
                { icon: "🍽️", text: "하루 3식 제공 (한식 위주), 식비 걱정 없음" },
                { icon: "🧹", text: "청소, 세탁 서비스 제공 (주 2~3회)" },
                { icon: "👥", text: "외국인 룸메이트와 자연스러운 영어 사용" },
                { icon: "🛡️", text: "한국인 매니저 상주, 생활 상담 가능" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 bg-cream rounded-xl px-5 py-3.5 border border-beige-dark">
                  <span className="text-xl shrink-0">{item.icon}</span>
                  <span className="text-[0.9rem] text-brown-dark">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: 합리적 비용 */}
      <section id="section-3" className="py-20 px-6 bg-brown-dark text-cream relative overflow-hidden">
        <div className="absolute -top-1/2 -right-[20%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(196,96,58,0.15)_0%,transparent_70%)] rounded-full" />
        <div className="max-w-[1200px] mx-auto relative">
          <div className="reveal text-center mb-14">
            <div className="inline-flex items-center gap-1.5 bg-[rgba(74,140,92,0.2)] text-[#8FD4A0] px-3 py-1.5 rounded-2xl text-[0.75rem] font-semibold mb-4">
              POINT 04
            </div>
            <h2 className="text-[1.6rem] md:text-[2.2rem] font-extrabold tracking-tight text-cream leading-[1.3]">
              학비에 숙식비가 포함,
              <br />
              <span className="text-terracotta-light">타 국가 대비 절반 이하 비용</span>
            </h2>
            <p className="mt-4 text-[0.95rem] leading-[1.7] text-brown-light max-w-[600px] mx-auto">
              필리핀은 학비 자체가 저렴한 데다 숙식비까지 포함되어 있어
              <br />
              다른 영어권 국가와 비교하면 비용이 훨씬 합리적입니다.
            </p>
          </div>

          <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                country: "필리핀",
                period: "8주 기준",
                cost: "약 280만원~",
                includes: "학비 + 기숙사 + 식사 포함",
                highlight: true,
                details: ["1:1 수업 4~6시간/일", "기숙사 + 3식 포함", "생활비 별도 (월 20~30만원)"],
              },
              {
                country: "호주 · 캐나다",
                period: "8주 기준",
                cost: "약 600~800만원",
                includes: "학비만 (숙식 별도)",
                highlight: false,
                details: ["그룹 수업 15~20명", "홈스테이 별도 (월 100만원+)", "생활비 별도 (월 80~120만원)"],
              },
              {
                country: "미국 · 영국",
                period: "8주 기준",
                cost: "약 800~1,200만원",
                includes: "학비만 (숙식 별도)",
                highlight: false,
                details: ["그룹 수업 10~15명", "기숙사/셰어하우스 별도", "생활비 별도 (월 150~200만원)"],
              },
            ].map((item) => (
              <div
                key={item.country}
                className={`rounded-[20px] p-7 backdrop-blur-[4px] border transition-all hover:-translate-y-1 ${
                  item.highlight
                    ? "bg-[rgba(196,96,58,0.15)] border-terracotta"
                    : "bg-white/[0.06] border-white/10 hover:bg-white/10"
                }`}
              >
                {item.highlight && (
                  <span className="inline-block bg-terracotta text-white px-3 py-0.5 rounded-[10px] text-[0.7rem] font-bold mb-3">
                    추천
                  </span>
                )}
                <div className="text-[1rem] font-bold text-cream mb-1">{item.country}</div>
                <div className="text-[0.8rem] text-brown-light mb-4">{item.period}</div>
                <div className="text-[2rem] font-black text-cream tracking-tight">{item.cost}</div>
                <div className="text-[0.8rem] text-brown-light mt-1 mb-5">{item.includes}</div>
                <div className="border-t border-white/10 pt-4 space-y-2">
                  {item.details.map((d) => (
                    <div key={d} className="flex items-start gap-2 text-[0.82rem] text-brown-light leading-[1.5]">
                      <div className="w-1 h-1 rounded-full bg-brown-light shrink-0 mt-2" />
                      {d}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: 지리적 장점 */}
      <section id="section-4" className="py-20 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="reveal text-center mb-14">
            <div className="inline-flex items-center gap-1.5 bg-terracotta-light text-terracotta px-3 py-1.5 rounded-2xl text-[0.75rem] font-semibold mb-4">
              POINT 05
            </div>
            <h2 className="text-[1.6rem] md:text-[2.2rem] font-extrabold tracking-tight text-brown-dark leading-[1.3]">
              가깝고, 시차 없고, 즐길 거 많고
            </h2>
            <p className="mt-4 text-[0.95rem] leading-[1.7] text-brown max-w-[600px] mx-auto">
              공부만 하기엔 아쉽잖아요. 필리핀은 학습과 여가를 모두 누릴 수 있는 곳입니다.
            </p>
          </div>

          <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                image: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=600&q=80",
                title: "직항 약 4시간",
                desc: "인천에서 세부·마닐라까지 직항으로 약 4시간. 항공권도 편도 10~20만원대로 저렴합니다. 주말에 가족이 방문하기에도 부담 없는 거리예요.",
              },
              {
                image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=600&q=80",
                title: "시차 단 1시간",
                desc: "한국보다 1시간 느린 시차. 가족, 친구와 실시간 연락에 전혀 불편함이 없어요. 시차 적응 스트레스도 없습니다.",
              },
              {
                image: "https://images.unsplash.com/photo-1573790387438-4da905039392?auto=format&fit=crop&w=600&q=80",
                title: "다양한 액티비티",
                desc: "주말마다 아일랜드 호핑, 스노클링, 다이빙, 망고 마켓 투어 등을 즐길 수 있어요. 공부와 여행을 동시에!",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-cream rounded-[20px] overflow-hidden border border-beige-dark hover:-translate-y-1 hover:shadow-md transition-all"
              >
                <div className="h-[180px] overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-7 text-center">
                  <h3 className="text-[1.15rem] font-bold mb-3 text-brown-dark">{item.title}</h3>
                  <p className="text-[0.9rem] leading-[1.7] text-brown">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-beige text-center relative overflow-hidden">
        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(196,96,58,0.08)_0%,transparent_70%)]" />
        <div className="max-w-[1200px] mx-auto relative">
          <h2 className="text-[2rem] font-extrabold tracking-tight text-brown-dark leading-[1.3]">
            필리핀 어학연수, 시작해볼까요?
          </h2>
          <p className="mt-3 text-base leading-[1.7] text-brown max-w-[500px] mx-auto">
            어학원 비교부터 견적까지, 바로 확인해보세요.
          </p>
          <div className="mt-8 flex gap-3.5 justify-center flex-wrap">
            <Link
              to="/academies"
              className="bg-terracotta text-white px-8 py-3.5 rounded-[10px] text-base font-bold no-underline inline-flex items-center gap-2 shadow-[0_4px_14px_rgba(196,96,58,0.3)] hover:bg-terracotta-hover hover:-translate-y-0.5 transition-all"
            >
              어학원 비교하기
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              to="/process"
              className="bg-white text-brown-dark px-8 py-3.5 rounded-[10px] text-base font-semibold border-2 border-beige-dark no-underline inline-flex items-center gap-2 hover:border-brown-light hover:bg-beige hover:-translate-y-0.5 transition-all"
            >
              연수 절차 알아보기
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
