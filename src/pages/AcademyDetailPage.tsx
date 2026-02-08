import { Link } from "react-router-dom";

const images = {
  campus: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQYs--CJVDqt0Gr2228keBLU-TJWa_wYa3vbZtS634n7oP5PyBMPa8ENwQYS6cNTOi-dd67vysB1XVwKT_s_Knf0Iqh1s9eH_ITAKsotjeBVMQFcMkXakjTsroPO95wpis0hRCMolyy6nNdU-wffjW4xCPnmoqJMMtN5-q75mhLL3h6r84R_riiQQH83YceTFPGpeGwPREa_pAGd3ifOZGP7hCNG0hmYgQ3_7HWFkMYgu2q3vfz63lqdusnC60wG6GPSwM4nZaRfX_",
  lounge: "https://lh3.googleusercontent.com/aida-public/AB6AXuDM9a_XqwOnYFiY9v76T4RZcqazQmV1-AbQhxpQ2L2f-Xgiqywsjo7IdIJtcd5ViKQcwlEFY4aKlvTdB3oVUTxDp5VxJrVR2G1YX4mZ1uFq32-Nm13Cq4oNTod4H0HqGXDtLEGxLryOc4qF_SrmN7J-PRPeemVczHvOrFiWasZVoo9G3OGpuLadI9OHPVoTnTY0W11rAx_nBhez1xVCBk4M_YolFQQDr_eWZ-wpWOgXaVxUmIHY8HYR74eS8V586-v6XPHd5ve581WV",
  single: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAhfONl11TEaluh1NgHjwxiqvloMPKGpTjdaghNgsJ8-L2QRbkxr3apGMS7MiERlO3p7YyoT0o0xXT28q42qEcmgz6LK_1Eon5POmDLoHqXlBCS7OUMQmAopKW5H6dfXJz-MowZxxUgYSGAdrX4vY4tYgkBodI6xFX1xTB31lRiqWp5aff-f0QNPrBR2XPJtCLUHsLaPL5_WKZ7_ebi5XmQB3FNMeUyR1wtU2CL6kgIwcpjhnIklmoYDNgw2A0NU3Zaz5lpf6Y1Bxg",
  twin: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiS6TswTMl1R22WdmfsyOhqzGgDrdQSI8VkTOboaZzkMwkBF7VsGeMp8rv75UuhEyfKEztytvGej1kW8KK8hy1uq_Rpdwi8yZwBtaa9ZlNlkElLC1IARKxgi9PAB1kZAAVhOzctjEKTCWLmOQRFphyDOa5vWIbwxvNUNbVhzH8yuB-3ygA0pNqoFz2hcAXl6761K7Wxu-e1PoNFc9tGo9TAKoXHrxFKqiNH0zDXZeBIip78x6yr6Chd8KoNHTOPVi_KwwJ_pKDTS1u",
  cebu: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-Igiowl9YuK7fUmDMeeyzV_-slbpNUGr-wyguziuU7YOCOp72onDw3zvHw5z7kSV20a7-AOKd8-TTIm0NkyvIJqj3xuRjwHeVC1V0cMzmfilhS3wQ0BRph5xykFPJqSbtVd2jw9oiJ453vcuvNGcPKRmXB-KwtYl498jiJM83szuYXJl4tzeOu04OTAN_T5lryPCvOJYmuK7ReNJimR751qP81XIhaoOT4GvtmS6RDgH4N8EUPIkncnZzNpNBljQAZEfixu3dqbv2",
  reviewer1: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSrKuV-W9l3OGiNlQAGBY8PXCdHYC_F_ajqnhYdqco_--1oHqVfVulTpJl3zgyYCzOmNJe7zqBrs1zUmPriZVXWmy0KosheXT96OciAgoTvqn0N6l19pgKFyfzPs6RytMaZszr6feFBcE26rzZKOMXBFl-_OmAuzemdi79PERHKXbPpOmF2lA6ZyB3JDBTaaLoiJ2fnSDD36W1ITEQ4cXnoWBrYYDT7490Lv6TH8rJR97uAxR21tzTGAUshZT2HfGU_8hAjn_mnVxB",
  reviewer2: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcShv95M3W2t23s1tkRR-fRNy_g5L1rdghlqYHK9HiPl-aHNjs53Q7IoiBiF28ELXZZYaYJt4EzwvsrfDO03pU9a1fqqQ2ubxd7rvM1WxzUOQWrva49yq0EkxeyjKTOxaYoPqO6ogXRwb7OXNHH0v3TIvNAi8EFnJxoar1psfV1mgqjEgExvIfSHVb1Zt9jXeOYzwJXN3D0N_FXUtJytDwTHsVxUZ8ASvTkZHYlvYEzyvVEAn74dfXxnqDCp9vDMatoxdQszenKv3p",
};

export default function AcademyDetailPage() {
  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto">
          <Link
            to="/search"
            className="text-slate-900 flex size-10 shrink-0 items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined">arrow_back_ios</span>
          </Link>
          <h2 className="text-slate-900 text-base font-bold leading-tight tracking-tight flex-1 text-center truncate">
            PhilEnglish Global Academy
          </h2>
          <div className="flex size-10 items-center justify-end cursor-pointer">
            <span className="material-symbols-outlined text-[#2b8cee]">share</span>
          </div>
        </div>
      </div>

      <main className="max-w-md mx-auto pb-32">
        {/* Hero Image Gallery */}
        <div className="relative w-full aspect-[4/3] bg-slate-200 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${images.campus}')` }}
          ></div>
          <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
            1 / 12
          </div>
        </div>

        {/* Academy Header Info */}
        <div className="px-4 pt-6 pb-4 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#2b8cee]/10 text-[#2b8cee] text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
              Premium Member
            </span>
            <span className="bg-green-100 text-green-700 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
              Verified
            </span>
          </div>
          <h1 className="text-2xl font-bold leading-tight mb-2">PhilEnglish Global Academy</h1>
          <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-4">
            <span className="material-symbols-outlined text-base">location_on</span>
            <span>Cebu City, Philippines</span>
            <span className="mx-1">•</span>
            <span className="flex items-center text-amber-500 font-bold">
              <span className="material-symbols-outlined text-base mr-0.5">star</span> 4.9
            </span>
            <span className="text-slate-400">(128 Reviews)</span>
          </div>
        </div>

        {/* Segmented Control (Tabs) */}
        <div className="sticky top-[72px] z-40 bg-white border-b border-slate-200 overflow-x-auto no-scrollbar">
          <div className="flex px-4 gap-6 min-w-max">
            <a
              className="flex flex-col items-center justify-center border-b-2 border-[#2b8cee] text-[#2b8cee] pb-3 pt-4 font-bold text-sm"
              href="#programs"
            >
              Programs
            </a>
            <a
              className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 pb-3 pt-4 font-bold text-sm"
              href="#facilities"
            >
              Facilities
            </a>
            <a
              className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 pb-3 pt-4 font-bold text-sm"
              href="#dormitory"
            >
              Dormitory
            </a>
            <a
              className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 pb-3 pt-4 font-bold text-sm"
              href="#reviews"
            >
              Reviews
            </a>
          </div>
        </div>

        {/* Program Info Section */}
        <section className="p-4 bg-white mt-2" id="programs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Available Programs</h3>
            <span className="text-[#2b8cee] text-sm font-semibold">View All</span>
          </div>
          <div className="space-y-3">
            <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-800">Power Speaking ESL</h4>
                <span className="text-[#2b8cee] font-bold text-sm">$320 / wk</span>
              </div>
              <p className="text-sm text-slate-600 mb-3">
                Intensive focus on conversational fluency with 6 daily 1-on-1 classes.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-medium">
                  1:1 Class (6h)
                </span>
                <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-medium">
                  Group Class (2h)
                </span>
              </div>
            </div>
            <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-800">IELTS Guarantee 6.5</h4>
                <span className="text-[#2b8cee] font-bold text-sm">$450 / wk</span>
              </div>
              <p className="text-sm text-slate-600 mb-3">
                Comprehensive test prep with weekly mock exams and professional feedback.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-medium">
                  Test Prep
                </span>
                <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-medium">
                  Min 12 weeks
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Campus Facilities Section */}
        <section className="p-4 bg-white mt-2" id="facilities">
          <h3 className="text-lg font-bold mb-4">Campus Facilities</h3>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="flex flex-col items-center gap-1">
              <div className="size-12 rounded-full bg-[#2b8cee]/10 flex items-center justify-center text-[#2b8cee]">
                <span className="material-symbols-outlined">wifi</span>
              </div>
              <span className="text-[10px] font-medium">Free Wi-Fi</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="size-12 rounded-full bg-[#2b8cee]/10 flex items-center justify-center text-[#2b8cee]">
                <span className="material-symbols-outlined">fitness_center</span>
              </div>
              <span className="text-[10px] font-medium">Gym</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="size-12 rounded-full bg-[#2b8cee]/10 flex items-center justify-center text-[#2b8cee]">
                <span className="material-symbols-outlined">pool</span>
              </div>
              <span className="text-[10px] font-medium">Pool</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="size-12 rounded-full bg-[#2b8cee]/10 flex items-center justify-center text-[#2b8cee]">
                <span className="material-symbols-outlined">restaurant</span>
              </div>
              <span className="text-[10px] font-medium">Cafeteria</span>
            </div>
          </div>
          <div className="relative w-full h-48 rounded-xl bg-slate-200 overflow-hidden mb-4">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${images.lounge}')` }}
            ></div>
            <div className="absolute bottom-3 left-3 bg-white/90 px-2 py-1 rounded text-[10px] font-bold">
              New Student Lounge
            </div>
          </div>
        </section>

        {/* Dormitory Details Section */}
        <section className="p-4 bg-white mt-2" id="dormitory">
          <h3 className="text-lg font-bold mb-4">Dormitory Options</h3>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            <div className="min-w-[240px] border border-slate-100 rounded-xl overflow-hidden shadow-sm">
              <div
                className="h-32 bg-cover bg-center"
                style={{ backgroundImage: `url('${images.single}')` }}
              ></div>
              <div className="p-3">
                <h5 className="font-bold text-sm">Single Suite</h5>
                <p className="text-xs text-slate-500 mb-2">Maximum privacy & quiet</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#2b8cee] font-bold text-sm">$220/wk</span>
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded">Ensuite Bath</span>
                </div>
              </div>
            </div>
            <div className="min-w-[240px] border border-slate-100 rounded-xl overflow-hidden shadow-sm">
              <div
                className="h-32 bg-cover bg-center"
                style={{ backgroundImage: `url('${images.twin}')` }}
              ></div>
              <div className="p-3">
                <h5 className="font-bold text-sm">Twin Share</h5>
                <p className="text-xs text-slate-500 mb-2">Best for making friends</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#2b8cee] font-bold text-sm">$150/wk</span>
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded">Weekly Cleaning</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Real Student Reviews */}
        <section className="p-4 bg-white mt-2" id="reviews">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Student Reviews</h3>
            <span className="text-[#2b8cee] text-sm font-semibold">Write Review</span>
          </div>
          <div className="space-y-4">
            <div className="pb-4 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="size-10 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url('${images.reviewer1}')` }}
                  ></div>
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-bold">Haruka T.</h5>
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[14px]">
                        star
                      </span>
                    ))}
                    <span className="text-slate-400 text-[10px] ml-2 font-medium">1 week ago</span>
                  </div>
                </div>
                <span className="bg-[#2b8cee]/5 text-[#2b8cee] text-[10px] px-2 py-1 rounded-full font-bold">
                  IELTS 6.5
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                The teachers here are incredibly patient. I improved my speaking score from 5.0 to 6.5 in just 8
                weeks! Highly recommend the intensive course.
              </p>
            </div>
            <div className="pb-4 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="size-10 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url('${images.reviewer2}')` }}
                  ></div>
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-bold">Ji-hun L.</h5>
                  <div className="flex items-center text-amber-500">
                    {[...Array(4)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[14px]">
                        star
                      </span>
                    ))}
                    <span className="material-symbols-outlined text-[14px]">star_half</span>
                    <span className="text-slate-400 text-[10px] ml-2 font-medium">3 weeks ago</span>
                  </div>
                </div>
                <span className="bg-[#2b8cee]/5 text-[#2b8cee] text-[10px] px-2 py-1 rounded-full font-bold">
                  Business ESL
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                Facility is great and the location is very convenient. The cafeteria food is decent but sometimes
                repetitive.
              </p>
            </div>
          </div>
          <button className="w-full py-3 mt-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600">
            Read all 128 reviews
          </button>
        </section>

        {/* Location Map Section */}
        <section className="p-4 bg-white mt-2">
          <h3 className="text-lg font-bold mb-4">Location</h3>
          <div className="w-full h-40 rounded-xl bg-slate-100 overflow-hidden relative border border-slate-200">
            <div
              className="absolute inset-0 bg-cover bg-center grayscale opacity-70"
              style={{ backgroundImage: `url('${images.cebu}')` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#2b8cee] text-4xl">location_on</span>
            </div>
            <div className="absolute bottom-2 right-2">
              <button className="bg-white shadow-md px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">open_in_new</span> Google Maps
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">info</span>
            15 mins from Mactan-Cebu International Airport
          </p>
        </section>
      </main>

      {/* Sticky Bottom CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-8 pt-4 px-4 z-50">
        <div className="max-w-md mx-auto flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 border border-slate-200 py-3.5 rounded-xl font-bold text-sm text-slate-700">
            <span className="material-symbols-outlined text-lg">download</span>
            Brochure
          </button>
          <button className="flex-[2] bg-[#2b8cee] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-[#2b8cee]/20 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg">chat_bubble</span>
            Consultation Request
          </button>
        </div>
      </div>
    </div>
  );
}
