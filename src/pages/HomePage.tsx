import { Link } from "react-router-dom";

const academyImages = {
  smeag: "https://lh3.googleusercontent.com/aida-public/AB6AXuBu79rPe7WuUmDwsTqsPP5URlkspz33bZSO1rqxw8G2FrLsaEVHem9hiMjW7YUIbitxuyDGZop-OyqOsMBBrC9CHWKUPSLqRmCtxNNlR5DBor9-CqS4baq37XrHZ95B5YHhee7XEoqN6J1fXX9lE5REEL4V7s0tm0xbSiEa20A3AHpKR3yf0nefg2Nw39ZcwGj6TjDJVXMRN4WgCqHuQxZnkUlqt3Zy1hTNRHLNMDqoBwH3RxzzgrfRtMpw-wPYvWpGlFlpOcZgu45h",
  help: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1XbUHl2tsbTxvuvt0ygZw61Prz4d2MJGuCT1UOhEPTXfAD1kdCC9cT2xEodAEogk6olmuS-KiNJTsQuxQ5np4Zmu8C_h3DbSrtkSZbr35kMS-QXK9SNrjTtaEg5MmycRNcCOvPuwJT8tnGLoAm6hgGSeuQqB8uTmNlntl9MfX41sNp907FphFVQlEV2ynPQ3wbXlJT1aYP2VfJNXakijdwH_N8GMJ7ZgRnZ8VrLfaZjRFUeq2ZsFtjbfggXxxC7Wb-LgRrDY2TuUa",
};

const cityImages = {
  cebu: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-Igiowl9YuK7fUmDMeeyzV_-slbpNUGr-wyguziuU7YOCOp72onDw3zvHw5z7kSV20a7-AOKd8-TTIm0NkyvIJqj3xuRjwHeVC1V0cMzmfilhS3wQ0BRph5xykFPJqSbtVd2jw9oiJ453vcuvNGcPKRmXB-KwtYl498jiJM83szuYXJl4tzeOu04OTAN_T5lryPCvOJYmuK7ReNJimR751qP81XIhaoOT4GvtmS6RDgH4N8EUPIkncnZzNpNBljQAZEfixu3dqbv2",
  baguio: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_F2YYWy-fymbdlOfQGEC6Ioy1uu13CW_uPtqOLa6fdZAx1cxiTVtctThbCW6oznFl4irWNGpD0gfgQEaeUsI2BIeZOoY2WoHpxj5LeQnZaufBFnj9mtXlGDYt_zkqg7BXBtmxZwPnUSzkOV6Ao2qxT0OnppUVxjPQHx1cQJl5pwHZbJTWI6SCZqG6Sqy9hdBw2IUY2p91qmgNJwMetH-wMn1tBxuUuONMmeiouUX286V7eaSYrB2Ll9NGdPcuMeWOvjlBStzx4aoq",
  davao: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBsQq14EOiOd9-BQ9YYyuq7l0ybMw2bEaz3VCmCKZonylTZJXVoidx3EGGcN0489OAytnoScyoKAbKKNVZhlvKHVJDcPIlNwYyMT5-xDUZR4H5h3W8lcJzG2ss-M_gD8bNN2QKBazUjrL2sJTgGnnGrAAUIq-IhqRwJDcukh-JQ9wnMqGkDJcWfXD5bJ0M_nqxKzRxO274Ij817Sp-FmYQ4nza9B-kkPiNSLDiw7Gy3C8n8bhJygRDj0MrAVb85TbaT61XA5hN9_Ge",
  manila: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCRAiWGtTKw84ICO-Rzk6XMGxf3rL9wPmFDory3RXqOO-qQUs1wKb-JdRNGU6b1E9sNYG4apKrzSCIp9IzEjX9G2ShkrRRXAQgwvS7s5HVk_F5dWVvpS5sOs3Oj314N_jBYZfG-DTECtrrTKynSb8gg8JAY7Ml1u75RVh1NdZSGPdfHN9Cy0niUY49SdzhVijwu1UvG7vdSo3zeA288aeWhddmaZEFz3Je44wBH3T6oEsGqW0NK7VzbEwbfpuCcJT-b9uOIvAEuMlS",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2b8cee] text-3xl">school</span>
            <h1 className="text-lg font-extrabold tracking-tight">StudyPH</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 transition-colors">
              <span className="material-symbols-outlined">favorite</span>
            </button>
            <button className="flex items-center justify-center size-10 rounded-full bg-slate-100">
              <span className="material-symbols-outlined">person</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="pb-24">
        {/* Hero Section */}
        <section className="relative px-4 pt-6 pb-8">
          <div className="relative overflow-hidden rounded-xl bg-[#2b8cee]/10 p-6 min-h-[320px] flex flex-col justify-center">
            {/* Abstract Decorative Background */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 size-64 bg-[#2b8cee]/20 rounded-full blur-3xl"></div>
            <div className="relative z-10 space-y-4">
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight">
                Find Your Perfect <span className="text-[#2b8cee]">English Academy</span>
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed max-w-[280px]">
                Expert guidance for language studies in the beautiful Philippines.
              </p>
              {/* Search Bar Component */}
              <div className="flex w-full items-stretch rounded-lg h-14 shadow-sm mt-4">
                <div className="flex bg-white items-center justify-center pl-4 rounded-l-lg border border-r-0 border-slate-200">
                  <span className="material-symbols-outlined text-slate-400">search</span>
                </div>
                <input
                  className="flex-1 bg-white border-y border-slate-200 px-3 text-sm focus:outline-none placeholder:text-slate-400"
                  placeholder="Search school or city..."
                  type="text"
                />
                <Link
                  to="/search"
                  className="bg-[#2b8cee] text-white px-5 rounded-r-lg font-bold text-sm flex items-center justify-center"
                >
                  Go
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories/Tags */}
        <section className="px-4 mb-8">
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            <div className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-[#2b8cee] text-white px-5 shadow-md shadow-[#2b8cee]/20">
              <span className="text-sm font-semibold">All Schools</span>
            </div>
            <div className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-white border border-slate-200 px-5">
              <span className="material-symbols-outlined text-sm">bolt</span>
              <span className="text-sm font-medium">Sparta</span>
            </div>
            <div className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-white border border-slate-200 px-5">
              <span className="material-symbols-outlined text-sm">workspace_premium</span>
              <span className="text-sm font-medium">IELTS</span>
            </div>
            <div className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-white border border-slate-200 px-5">
              <span className="material-symbols-outlined text-sm">family_restroom</span>
              <span className="text-sm font-medium">Family</span>
            </div>
          </div>
        </section>

        {/* Top Recommended Academies */}
        <section className="mb-8">
          <div className="flex items-center justify-between px-4 mb-4">
            <h3 className="text-xl font-bold tracking-tight">Top Recommended</h3>
            <Link to="/search" className="text-[#2b8cee] text-sm font-semibold">
              View All
            </Link>
          </div>
          <div className="flex overflow-x-auto hide-scrollbar px-4 gap-4">
            {/* Card 1 */}
            <Link
              to="/academy/smeag"
              className="min-w-[280px] bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100"
            >
              <div
                className="relative h-40 bg-cover bg-center"
                style={{ backgroundImage: `url('${academyImages.smeag}')` }}
              >
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#facc15] text-sm">star</span>
                  <span className="text-xs font-bold">4.9</span>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex gap-2">
                  <span className="bg-[#2b8cee]/10 text-[#2b8cee] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                    IELTS
                  </span>
                  <span className="bg-[#facc15]/10 text-amber-600 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                    Cebu
                  </span>
                </div>
                <h4 className="font-bold text-lg">SMEAG Global Education</h4>
                <p className="text-slate-500 text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  Talisay City, Cebu
                </p>
              </div>
            </Link>

            {/* Card 2 */}
            <Link
              to="/academy/help"
              className="min-w-[280px] bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100"
            >
              <div
                className="relative h-40 bg-cover bg-center"
                style={{ backgroundImage: `url('${academyImages.help}')` }}
              >
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#facc15] text-sm">star</span>
                  <span className="text-xs font-bold">4.8</span>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex gap-2">
                  <span className="bg-[#2b8cee]/10 text-[#2b8cee] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                    Sparta
                  </span>
                  <span className="bg-[#facc15]/10 text-amber-600 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                    Baguio
                  </span>
                </div>
                <h4 className="font-bold text-lg">Help Academy</h4>
                <p className="text-slate-500 text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  Longlong, Baguio City
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="px-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-100">
            <h3 className="text-xl font-bold mb-6">Why Study with Us?</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="size-10 rounded-lg bg-[#2b8cee]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#2b8cee]">verified_user</span>
                </div>
                <h5 className="font-bold text-sm">10+ Years</h5>
                <p className="text-xs text-slate-500 leading-tight">Expert educational consultancy</p>
              </div>
              <div className="space-y-2">
                <div className="size-10 rounded-lg bg-[#facc15]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-amber-600">reviews</span>
                </div>
                <h5 className="font-bold text-sm">5,000+ Reviews</h5>
                <p className="text-xs text-slate-500 leading-tight">Verified student feedback</p>
              </div>
              <div className="space-y-2">
                <div className="size-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-600">payments</span>
                </div>
                <h5 className="font-bold text-sm">Zero Fee</h5>
                <p className="text-xs text-slate-500 leading-tight">No agency service charges</p>
              </div>
              <div className="space-y-2">
                <div className="size-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-purple-600">support_agent</span>
                </div>
                <h5 className="font-bold text-sm">24/7 Support</h5>
                <p className="text-xs text-slate-500 leading-tight">On-site support in PH</p>
              </div>
            </div>
          </div>
        </section>

        {/* Region Quick Links */}
        <section className="px-4 mb-8">
          <h3 className="text-xl font-bold mb-4">Popular Cities</h3>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar">
            {[
              { name: "Cebu", image: cityImages.cebu },
              { name: "Baguio", image: cityImages.baguio },
              { name: "Clark", image: "https://placeholder.pics/svg/300" },
              { name: "Davao", image: cityImages.davao },
              { name: "Manila", image: cityImages.manila },
            ].map((city) => (
              <div key={city.name} className="flex flex-col items-center gap-2 shrink-0">
                <div className="size-16 rounded-full border-2 border-[#2b8cee]/20 p-1">
                  <div
                    className="size-full rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url('${city.image}')` }}
                  ></div>
                </div>
                <span className="text-xs font-semibold">{city.name}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 z-50">
        <button className="w-full bg-[#2b8cee] hover:bg-[#2b8cee]/90 text-white h-14 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#2b8cee]/30 transition-all active:scale-[0.98]">
          <span className="material-symbols-outlined">chat</span>
          <span>Get a Free Study Plan</span>
        </button>
      </div>
    </div>
  );
}
