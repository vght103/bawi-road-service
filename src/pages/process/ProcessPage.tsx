import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Info, CircleCheck, ArrowRight } from "lucide-react";
import Seo from "@/components/Seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProcessPage() {
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
      <Seo title="필리핀 어학연수 준비 절차 | 신청~출국 완벽 가이드" description="어학원 선택부터 비자, 항공권, 준비물까지. 필리핀 어학연수 준비 체크리스트와 단계별 절차를 안내합니다." path="/process" />
      <Navbar />

      {/* HERO */}
      <section className="pt-[140px] pb-16 px-6 text-center">
        <div className="max-w-[800px] mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-green-badge text-accent-green-dark px-3.5 py-1.5 rounded-full text-[0.8rem] font-semibold mb-5 animate-fade-in-up">
            Step by Step
          </div>
          <h1
            className="text-[2rem] md:text-[3rem] font-black leading-[1.25] tracking-tight text-brown-dark animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            연수 <span className="text-terracotta">절차</span> & 준비물
          </h1>
          <p
            className="mt-5 text-[0.95rem] md:text-[1.1rem] leading-[1.7] text-brown animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            필리핀 어학연수는 복잡하지 않습니다.
            <br />
            한국에서 비자를 따로 준비할 필요도 없어요.
          </p>
        </div>
      </section>

      {/* 안내 배너 */}
      <div className="bg-accent-green-light border-y border-accent-green/20 py-4 px-6">
        <div className="max-w-[1200px] mx-auto flex items-center justify-center gap-3 text-[0.9rem] text-accent-green-dark font-medium">
          <Info className="w-5 h-5 shrink-0" />
          필리핀은 30일 무비자 입국 가능. SSP, 비자 연장, 유심 등은 현지 어학원에서 모두 대행해줍니다.
        </div>
      </div>

      {/* 6 STEPS */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[900px] mx-auto">
          <div className="reveal text-center mb-16">
            <h2 className="text-[1.6rem] md:text-[2.2rem] font-extrabold tracking-tight text-brown-dark leading-[1.3]">
              연수 진행 절차
            </h2>
            <p className="mt-3 text-[0.95rem] text-brown">
              상담부터 출국까지, 6단계로 간단하게
            </p>
          </div>

          <div className="space-y-0">
            {[
              {
                step: "01",
                title: "어학원 비교 & 상담",
                desc: "어학원 정보, 가격, 장단점을 비교하고 견적 시뮬레이터로 비용을 확인하세요. 궁금한 점은 카카오톡으로 편하게 물어보세요.",
                tip: "견적 시뮬레이터에서 비용을 미리 확인할 수 있어요.",
                duration: "",
              },
              {
                step: "02",
                title: "수속 신청 & 등록금 납부",
                desc: "어학원을 결정했다면 온라인으로 수속을 신청합니다. 개인정보 작성 후 등록금(계약금)을 납부하면 어학원에 입학 신청이 진행됩니다.",
                tip: "등록금은 보통 총 학비의 일부(10~30%)입니다.",
                duration: "",
              },
              {
                step: "03",
                title: "입학 확정",
                desc: "어학원에서 입학 가능 여부를 확인합니다. 자리가 확정되면 입학 확정 안내를 드려요. 보통 1~2 영업일 내에 확인됩니다.",
                tip: "성수기(7~8월, 1~2월)에는 조기 마감될 수 있으니 여유 있게 신청하세요.",
                duration: "1~2 영업일",
              },
              {
                step: "04",
                title: "여권 & 항공권 준비",
                desc: "여권 유효기간이 입학일 기준 6개월 이상 남아있는지 확인하세요. 입학일이 확정되면 항공권을 구매합니다. 왕복 항공권이 필요합니다.",
                tip: "여권이 없거나 만료 예정이면 미리 재발급 신청하세요 (약 1~2주 소요).",
                duration: "",
              },
              {
                step: "05",
                title: "보험 가입 & 출국 준비",
                desc: "여행자보험(또는 유학생보험)에 가입하고, e-Travel(입국 QR코드)을 등록합니다. 출국 전 오리엔테이션 자료와 체크리스트를 안내해드릴게요.",
                tip: "출국 2~3주 전까지 보험 가입과 서류 등록을 완료하세요.",
                duration: "출국 2~3주 전",
              },
              {
                step: "06",
                title: "출국!",
                desc: "공항 픽업 서비스를 신청하면 현지 공항에서 어학원까지 안전하게 이동할 수 있어요. 도착 후 레벨 테스트를 거쳐 바로 수업이 시작됩니다.",
                tip: "첫날은 오리엔테이션 + 레벨 테스트로 진행됩니다.",
                duration: "",
              },
            ].map((item, index) => (
              <div key={item.step} className="reveal flex gap-5 md:gap-8">
                {/* Timeline */}
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-[0.85rem] font-bold shrink-0 ${
                      index === 5 ? "bg-terracotta text-white" : "bg-terracotta-light text-terracotta"
                    }`}
                  >
                    {item.step}
                  </div>
                  {index < 5 && <div className="w-[2px] h-full min-h-[40px] bg-beige-dark my-1" />}
                </div>

                {/* Content */}
                <div className={`pb-10 ${index === 5 ? "pb-0" : ""}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-[1.1rem] font-bold text-brown-dark">{item.title}</h3>
                    {item.duration && (
                      <span className="text-[0.72rem] bg-beige px-2.5 py-1 rounded-full text-brown font-medium">
                        {item.duration}
                      </span>
                    )}
                  </div>
                  <p className="text-[0.9rem] leading-[1.7] text-brown">{item.desc}</p>
                  {item.tip && (
                    <div className="mt-3 bg-cream border border-beige-dark rounded-xl px-4 py-3 text-[0.82rem] text-brown leading-[1.6]">
                      <span className="font-semibold text-terracotta">TIP</span> &mdash; {item.tip}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 준비 서류 */}
      <section className="py-20 px-6 bg-cream">
        <div className="max-w-[1200px] mx-auto">
          <div className="reveal text-center mb-14">
            <h2 className="text-[1.6rem] md:text-[2.2rem] font-extrabold tracking-tight text-brown-dark leading-[1.3]">
              출국 준비 서류
            </h2>
            <p className="mt-3 text-[0.95rem] text-brown">대상별로 필요한 서류를 확인하세요</p>
          </div>

          <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 성인 */}
            <div className="bg-white rounded-[20px] p-7 border border-beige-dark hover:shadow-md transition-all">
              <div className="inline-flex px-3 py-1.5 rounded-lg text-[0.8rem] font-bold bg-terracotta-light text-terracotta mb-4">
                성인 (만 15세 이상)
              </div>
              <p className="text-[0.85rem] text-brown mb-5">가장 일반적인 경우입니다.</p>
              <div className="space-y-3">
                {[
                  { doc: "여권", detail: "유효기간 6개월 이상" },
                  { doc: "왕복 항공권", detail: "입학일·종료일 기준" },
                  { doc: "여행자보험", detail: "체류 기간 전체 커버" },
                  { doc: "e-Travel", detail: "입국 QR코드 (온라인 등록)" },
                ].map((item) => (
                  <div key={item.doc} className="flex items-start gap-3">
                    <CircleCheck className="w-5 h-5 text-accent-green shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[0.9rem] font-semibold text-brown-dark">{item.doc}</div>
                      <div className="text-[0.8rem] text-brown">{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 가족연수 */}
            <div className="bg-white rounded-[20px] p-7 border border-beige-dark hover:shadow-md transition-all">
              <div className="inline-flex px-3 py-1.5 rounded-lg text-[0.8rem] font-bold bg-accent-green-light text-accent-green-dark mb-4">
                가족연수
              </div>
              <p className="text-[0.85rem] text-brown mb-5">부모 + 자녀가 함께 연수할 경우</p>
              <div className="space-y-3">
                {[
                  { doc: "여권", detail: "전원 유효기간 6개월 이상" },
                  { doc: "왕복 항공권", detail: "전원 왕복 항공권" },
                  { doc: "여행자보험", detail: "전원 가입" },
                  { doc: "e-Travel", detail: "전원 등록" },
                  { doc: "영문 가족관계증명서", detail: "주민센터 발급 가능" },
                ].map((item) => (
                  <div key={item.doc} className="flex items-start gap-3">
                    <CircleCheck className="w-5 h-5 text-accent-green shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[0.9rem] font-semibold text-brown-dark">{item.doc}</div>
                      <div className="text-[0.8rem] text-brown">{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 주니어 */}
            <div className="bg-white rounded-[20px] p-7 border border-beige-dark hover:shadow-md transition-all">
              <div className="inline-flex px-3 py-1.5 rounded-lg text-[0.8rem] font-bold bg-beige text-brown-dark mb-4">
                주니어 단독 (만 15세 미만)
              </div>
              <p className="text-[0.85rem] text-brown mb-5">보호자 없이 단독 입국하는 경우</p>
              <div className="space-y-3">
                {[
                  { doc: "여권", detail: "유효기간 6개월 이상" },
                  { doc: "왕복 항공권", detail: "입학일·종료일 기준" },
                  { doc: "여행자보험", detail: "체류 기간 전체 커버" },
                  { doc: "e-Travel", detail: "입국 QR코드" },
                  { doc: "WEG (보호자 동의서)", detail: "필리핀 대사관 공증 필요" },
                  { doc: "동행 인솔자", detail: "만 18세 이상 동행인 또는 UM 서비스" },
                ].map((item) => (
                  <div key={item.doc} className="flex items-start gap-3">
                    <CircleCheck className="w-5 h-5 text-accent-green shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[0.9rem] font-semibold text-brown-dark">{item.doc}</div>
                      <div className="text-[0.8rem] text-brown">{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-beige text-center relative overflow-hidden">
        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(196,96,58,0.08)_0%,transparent_70%)]" />
        <div className="max-w-[1200px] mx-auto relative">
          <h2 className="text-[2rem] font-extrabold tracking-tight text-brown-dark leading-[1.3]">
            연수 준비, 생각보다 간단해요
          </h2>
          <p className="mt-3 text-base leading-[1.7] text-brown max-w-[500px] mx-auto">
            어학원 선택부터 출국까지, 한 번에 해결하세요.
          </p>
          <div className="mt-8 flex gap-3.5 justify-center flex-wrap">
            <Link
              to="/academies"
              className="bg-terracotta text-white px-8 py-3.5 rounded-[10px] text-base font-bold no-underline inline-flex items-center gap-2 shadow-[0_4px_14px_rgba(196,96,58,0.3)] hover:bg-terracotta-hover hover:-translate-y-0.5 transition-all"
            >
              어학원 비교하기
              <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
            <Link
              to="/visa-info"
              className="bg-white text-brown-dark px-8 py-3.5 rounded-[10px] text-base font-semibold border-2 border-beige-dark no-underline inline-flex items-center gap-2 hover:border-brown-light hover:bg-beige hover:-translate-y-0.5 transition-all"
            >
              비자·현지비용 알아보기
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
