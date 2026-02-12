import { Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function VisaInfoPage() {
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
            Visa & Local Costs
          </div>
          <h1
            className="text-[2rem] md:text-[3rem] font-black leading-[1.25] tracking-tight text-brown-dark animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="text-terracotta">비자</span> & 현지비용 안내
          </h1>
          <p
            className="mt-5 text-[0.95rem] md:text-[1.1rem] leading-[1.7] text-brown animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            SSP, 비자 연장, 유심 등은 모두 현지 어학원에서 대행해줍니다.
            <br />
            한국에서 준비할 건 여권과 항공권뿐이에요.
          </p>
        </div>
      </section>

      {/* 앵커 네비게이션 */}
      <div className="bg-white border-y border-beige-dark sticky top-16 z-30">
        <div className="max-w-[1200px] mx-auto px-6 flex gap-1 overflow-x-auto no-scrollbar">
          {["SSP", "비자 연장", "ACR-I Card", "기타 현지비용"].map((tab) => (
            <a
              key={tab}
              href={`#${tab.toLowerCase().replace(/\s+/g, "-")}`}
              className="shrink-0 px-4 py-3.5 text-[0.85rem] font-medium text-brown hover:text-terracotta hover:bg-terracotta-light/30 transition-colors no-underline rounded-t-lg"
            >
              {tab}
            </a>
          ))}
        </div>
      </div>

      {/* SSP */}
      <section id="ssp" className="py-20 px-6 bg-white">
        <div className="max-w-[900px] mx-auto">
          <div className="reveal">
            <div className="inline-flex items-center gap-1.5 bg-terracotta-light text-terracotta px-3 py-1.5 rounded-2xl text-[0.75rem] font-semibold mb-4">
              01
            </div>
            <h2 className="text-[1.6rem] md:text-[2.2rem] font-extrabold tracking-tight text-brown-dark leading-[1.3] mb-3">
              SSP <span className="text-[1rem] font-medium text-brown">(Special Study Permit)</span>
            </h2>
            <p className="text-[0.95rem] leading-[1.75] text-brown mb-6">
              필리핀에서 공부하기 위해 반드시 필요한 <strong>특별학습허가증</strong>입니다.
              관광 비자로 입국하되, 현지에서 합법적으로 수업을 받기 위해 SSP를 발급받아야 합니다.
            </p>

            <div className="bg-cream rounded-[20px] p-6 md:p-8 border border-beige-dark space-y-4">
              {[
                { label: "발급 비용", value: "약 6,500페소 (약 15만원)", note: "어학원마다 소폭 차이" },
                { label: "유효 기간", value: "6개월 (등록한 어학원에서만 유효)", note: "" },
                { label: "신청 방법", value: "어학원에서 대행 (학생이 직접 할 필요 없음)", note: "" },
                { label: "준비물", value: "여권 + 증명사진 2장 (현지 촬영 가능)", note: "" },
                { label: "납부 시점", value: "현지 도착 후, 어학원에 페소로 납부", note: "" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                  <div className="text-[0.85rem] font-semibold text-brown-dark min-w-[120px]">{item.label}</div>
                  <div className="text-[0.9rem] text-brown">
                    {item.value}
                    {item.note && <span className="text-[0.8rem] text-brown-light ml-2">({item.note})</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 bg-accent-green-light border border-accent-green/20 rounded-xl px-5 py-4 text-[0.85rem] text-accent-green-dark leading-[1.6]">
              <strong>참고:</strong> 어학원을 변경하면 SSP를 새로 발급받아야 합니다. 한 어학원에서 발급받은 SSP는 다른 어학원에서 사용할 수 없어요.
            </div>
          </div>
        </div>
      </section>

      {/* 비자 연장 */}
      <section id="비자-연장" className="py-20 px-6 bg-cream">
        <div className="max-w-[900px] mx-auto">
          <div className="reveal">
            <div className="inline-flex items-center gap-1.5 bg-terracotta-light text-terracotta px-3 py-1.5 rounded-2xl text-[0.75rem] font-semibold mb-4">
              02
            </div>
            <h2 className="text-[1.6rem] md:text-[2.2rem] font-extrabold tracking-tight text-brown-dark leading-[1.3] mb-3">
              필리핀 비자 연장
            </h2>
            <p className="text-[0.95rem] leading-[1.75] text-brown mb-8">
              한국인은 <strong>무비자로 30일간 체류</strong>할 수 있습니다. 4주 이상 연수할 경우 비자를 연장해야 하며,
              <strong> 어학원에서 대행</strong>해줍니다. 비용은 현지에서 페소로 납부합니다.
            </p>

            {/* 비자 연장 테이블 */}
            <div className="bg-white rounded-[20px] border border-beige-dark overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[0.85rem]">
                  <thead>
                    <tr className="bg-brown-dark text-cream">
                      <th className="text-left px-5 py-3.5 font-semibold">구분</th>
                      <th className="text-left px-5 py-3.5 font-semibold">체류 가능 기간</th>
                      <th className="text-left px-5 py-3.5 font-semibold">연수 기간</th>
                      <th className="text-right px-5 py-3.5 font-semibold">비용 (약)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { type: "무비자 입국", stay: "30일", period: "4주 이하", cost: "무료", highlight: true },
                      { type: "1차 연장", stay: "+29일 (59일)", period: "8주 이하", cost: "3,500페소 (~8만원)", highlight: false },
                      { type: "2차 연장", stay: "+30일 (89일)", period: "12주 이하", cost: "4,500페소 (~10만원)", highlight: false },
                      { type: "3차 연장", stay: "+30일 (119일)", period: "16주 이하", cost: "3,000페소 (~7만원)", highlight: false },
                      { type: "4차 연장", stay: "+30일 (149일)", period: "20주 이하", cost: "3,000페소 (~7만원)", highlight: false },
                      { type: "5차 연장", stay: "+30일 (179일)", period: "24주 이하", cost: "3,000페소 (~7만원)", highlight: false },
                    ].map((row, i) => (
                      <tr
                        key={row.type}
                        className={`border-t border-beige-dark ${row.highlight ? "bg-accent-green-light" : i % 2 === 0 ? "bg-white" : "bg-cream/50"}`}
                      >
                        <td className="px-5 py-3.5 font-medium text-brown-dark">{row.type}</td>
                        <td className="px-5 py-3.5 text-brown">{row.stay}</td>
                        <td className="px-5 py-3.5 text-brown">{row.period}</td>
                        <td className="px-5 py-3.5 text-right font-semibold text-brown-dark">{row.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-5 bg-cream border border-beige-dark rounded-xl px-5 py-4 text-[0.82rem] text-brown leading-[1.6]">
              <span className="font-semibold text-terracotta">TIP</span> &mdash;
              한국에서 필리핀 대사관에 미리 59일짜리 비자를 발급받으면 1차 연장 비용(약 8만원)을 절약할 수 있습니다.
              다만 대사관 방문이 번거롭고, 어학원에서 대행해주는 것이 더 편리해서 대부분 현지에서 연장합니다.
            </div>
          </div>
        </div>
      </section>

      {/* ACR-I Card */}
      <section id="acr-i-card" className="py-20 px-6 bg-white">
        <div className="max-w-[900px] mx-auto">
          <div className="reveal">
            <div className="inline-flex items-center gap-1.5 bg-terracotta-light text-terracotta px-3 py-1.5 rounded-2xl text-[0.75rem] font-semibold mb-4">
              03
            </div>
            <h2 className="text-[1.6rem] md:text-[2.2rem] font-extrabold tracking-tight text-brown-dark leading-[1.3] mb-3">
              ACR-I Card <span className="text-[1rem] font-medium text-brown">(외국인 등록증)</span>
            </h2>
            <p className="text-[0.95rem] leading-[1.75] text-brown mb-4">
              59일 이상 체류하는 외국인에게 발급되는 <strong>외국인 등록증</strong>입니다.
              <strong>8주 이상 연수하는 경우에만</strong> 필요하며, 4주 단기 연수라면 SSP만 있으면 됩니다.
            </p>
            <div className="mb-6 bg-beige border border-beige-dark rounded-xl px-4 py-3 text-[0.82rem] text-brown leading-[1.6]">
              4주 연수 = SSP만 필요 &nbsp;/&nbsp; 8주 이상 연수 = SSP + ACR-I Card 필요
            </div>

            <div className="bg-cream rounded-[20px] p-6 md:p-8 border border-beige-dark space-y-4">
              {[
                { label: "발급 비용", value: "약 3,500페소 (약 8만원)" },
                { label: "발급 대상", value: "59일 초과 체류자 (8주 이상 연수)" },
                { label: "유효 기간", value: "1년 (재입국 시에도 유효)" },
                { label: "신청 방법", value: "어학원에서 대행" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                  <div className="text-[0.85rem] font-semibold text-brown-dark min-w-[120px]">{item.label}</div>
                  <div className="text-[0.9rem] text-brown">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 기타 현지비용 */}
      <section id="기타-현지비용" className="py-20 px-6 bg-cream">
        <div className="max-w-[900px] mx-auto">
          <div className="reveal">
            <div className="inline-flex items-center gap-1.5 bg-terracotta-light text-terracotta px-3 py-1.5 rounded-2xl text-[0.75rem] font-semibold mb-4">
              04
            </div>
            <h2 className="text-[1.6rem] md:text-[2.2rem] font-extrabold tracking-tight text-brown-dark leading-[1.3] mb-3">
              기타 현지비용
            </h2>
            <p className="text-[0.95rem] leading-[1.75] text-brown mb-8">
              학비와 기숙사비 외에 현지에서 발생하는 비용들입니다.
              모두 <strong>현지 도착 후 페소로 납부</strong>하며, 어학원에 따라 금액이 다를 수 있습니다.
            </p>

            <div className="bg-white rounded-[20px] border border-beige-dark overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[0.85rem]">
                  <thead>
                    <tr className="bg-brown-dark text-cream">
                      <th className="text-left px-5 py-3.5 font-semibold">항목</th>
                      <th className="text-left px-5 py-3.5 font-semibold">금액 (약)</th>
                      <th className="text-left px-5 py-3.5 font-semibold">비고</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { item: "SSP", cost: "6,500페소 (약 15만원)", note: "필수, 위 참고" },
                      { item: "비자 연장 (1차)", cost: "3,500페소 (약 8만원)", note: "4주 초과 시" },
                      { item: "ACR-I Card", cost: "3,500페소 (약 8만원)", note: "8주 이상 시에만" },
                      { item: "교재비", cost: "1,000~2,500페소 (약 2~6만원)", note: "코스별 상이, 4주 기준" },
                      { item: "전기세", cost: "1,000~3,000페소/4주 (약 2~7만원)", note: "에어컨 사용량에 따라 차이" },
                      { item: "관리비 (수도세 포함)", cost: "500~1,500페소/4주 (약 1~3만원)", note: "어학원에 따라 상이" },
                      { item: "공항 픽업비", cost: "무료~1,500페소 (최대 약 3만원)", note: "학비 포함인 경우가 많음" },
                      { item: "ID카드 발급비", cost: "200~500페소 (약 0.5~1만원)", note: "1회" },
                      { item: "보증금", cost: "2,500~5,000페소 (약 6~12만원)", note: "퇴실 시 환불 (파손 없을 경우)" },
                    ].map((row, i) => (
                      <tr key={row.item} className={`border-t border-beige-dark ${i % 2 === 0 ? "bg-white" : "bg-cream/50"}`}>
                        <td className="px-5 py-3.5 font-medium text-brown-dark">{row.item}</td>
                        <td className="px-5 py-3.5 text-brown">{row.cost}</td>
                        <td className="px-5 py-3.5 text-[0.8rem] text-brown-light">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 요약 카드 */}
            <div className="reveal mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white rounded-[20px] p-6 border border-beige-dark">
                <div className="text-[0.85rem] font-semibold text-brown-dark mb-2">4주 연수 시 현지비용 합계 (약)</div>
                <div className="text-[1.8rem] font-black text-terracotta">약 20~25만원</div>
                <div className="text-[0.8rem] text-brown mt-1">SSP + 교재비 + 전기세 + 관리비 + 보증금</div>
              </div>
              <div className="bg-white rounded-[20px] p-6 border border-beige-dark">
                <div className="text-[0.85rem] font-semibold text-brown-dark mb-2">12주 연수 시 현지비용 합계 (약)</div>
                <div className="text-[1.8rem] font-black text-terracotta">약 55~70만원</div>
                <div className="text-[0.8rem] text-brown mt-1">SSP + 비자연장 2회 + ACR-I + 교재비 + 전기세 + 관리비 + 보증금</div>
              </div>
            </div>

            <div className="mt-6 bg-accent-green-light border border-accent-green/20 rounded-xl px-5 py-5 text-[0.85rem] text-accent-green-dark leading-[1.6]">
              <strong>SSP, 비자 연장, ACR-I Card, 유심 개통 등은 현지 어학원에서 모두 대행해줍니다.</strong>
              <br />
              학생이 직접 처리할 필요 없이, 도착 후 어학원 안내에 따라 비용만 납부하면 됩니다.
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-beige text-center relative overflow-hidden">
        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(196,96,58,0.08)_0%,transparent_70%)]" />
        <div className="max-w-[1200px] mx-auto relative">
          <h2 className="text-[2rem] font-extrabold tracking-tight text-brown-dark leading-[1.3]">
            정확한 비용이 궁금하신가요?
          </h2>
          <p className="mt-3 text-base leading-[1.7] text-brown max-w-[500px] mx-auto">
            어학원별 학비 + 기숙사 + 현지비용까지
            <br />
            견적 시뮬레이터에서 바로 확인해보세요.
          </p>
          <div className="mt-8 flex gap-3.5 justify-center flex-wrap">
            <Link
              to="/quote"
              className="bg-terracotta text-white px-8 py-3.5 rounded-[10px] text-base font-bold no-underline inline-flex items-center gap-2 shadow-[0_4px_14px_rgba(196,96,58,0.3)] hover:bg-terracotta-hover hover:-translate-y-0.5 transition-all"
            >
              무료 견적 받기
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href="#"
              className="bg-white text-brown-dark px-8 py-3.5 rounded-[10px] text-base font-semibold border-2 border-beige-dark no-underline inline-flex items-center gap-2 hover:border-brown-light hover:bg-beige hover:-translate-y-0.5 transition-all"
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
