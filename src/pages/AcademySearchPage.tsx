import { Link } from "react-router-dom";

const academies = [
  {
    id: "smeag",
    name: "SMEAG Global Education",
    location: "Talavera, Cebu City",
    rating: 4.9,
    reviews: 128,
    price: 780,
    tags: ["ESL", "IELTS", "Business"],
    badge: "Top Rated",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuCv7i6GaoPo9FidyyWtAfpiaHFoIb_VXlQIGJKb2aDBkrB-t8DfAHVozF11opSkEZchV4aEV4134KDF6jMc6eRgcwEAo2ARH6v8vbp4I_TVHBgwZWZA3KvEijBa0KV-keRp3gglb4cNx8lVXEr-BckWPrbhAZOiVegfBjBDv-0y2535u63O5uC-ksIJR_WGQSHBtmzD-7IUBZp400bwoON_p4JxoTSKX5_DVMxCEqkXbyCeW76ZqmDylJ3NOJTW_ZlXyf_p4f5LQk",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcBp3a7zJG0-p9xNKtRggUuqdMjwbgSe50U1JUN6Btba9qu7hhwQJ6V8kKn5sDmH0224nj_p6HGaJEhXy9CuDCCo1eg-SlHcwoVpvZl60ZbAabReC-qbk1jnf_sJ966OwqtMbkU8eiNaLWFk5fMqweVrORdXBUSjA33zNQV7GDWd2yX6yQKCGuV-CwqX0UsbhYxAngo2a1_fe9VZSzVcAP4k851WzDxrYtvrzeXR18THUbwLIEVoe_NpUI1YmXDfteCE3l008KofuO",
  },
  {
    id: "cia",
    name: "CIA Academy Mactan",
    location: "Lapu-Lapu, Cebu",
    rating: 4.7,
    reviews: 95,
    price: 850,
    tags: ["TOEFL", "Premium Dorm"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDP1U4Wswy9nvr8B5dZT9GkP3eh3uj9jw_8RKFs6O-7bpyvpliepDDy_-TXq81r6HvyRZB8uvpcj7Epm3a9xxKKcUsIGJJmlg5miPGaLOqom7hFWBjg978oujI0QtnywqJ43DoSuKt-0lh0MKciRETsGWI5WmkmGDd_d1_gaHTVARndgzwAyw4PBOPyDgrXK4eVM-_kK6HgqANooiFpgAYmSRLgz81ZqOhL5AUTDdXqf1aSCNJ3xpeg132Agn_y7Wjl5FGhjwClfDha",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-sldGjRTAFVfs89XKa4ULAHH6UNhRoTueeWksTRUlueWSWtV_sxfJGBE0OfXCc4eTtOYZhiN7ZnecG8quzbqXv24CTJ_MP0Ck4mC6OH2MuJSn2eSsN3LwxTWSKGOka1t1u-n4jfN14HY112D1OYFvLsCkUBYkJko6uD_6UFyq9qVQCypJ5V8EdXsnZtMQVzlUNyUqlmEeXfl3ddEE73B3cFhFIk3sgwWgJ3cAQscly2M30NYS_yWTWq8WqWLgIb1y_NI1OfkZSlWy",
  },
  {
    id: "help",
    name: "HELP Academy Baguio",
    location: "Baguio City, Philippines",
    rating: 4.8,
    reviews: 112,
    price: 650,
    tags: ["Spartan", "TOEIC"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkNSseCgMEXIKVLodfLIboFB7bPbxSAD83CSMrz99K_R-w3j2TO2mCji-4cKwEqu_wF7yJbN60zMSe-9QI_CRCq8cCnHilrAFya7lAqdMEaet1GSB2glY5EpA09OgxOC1UGdw_6rANwTbGXkTz_8VeZJcKUw9-BMhwxKOxCnnfPsbv-cOMQ2Yjb4eux19ZcmwefoRPTjFQooZT7IqBSJv-2q4WpWZI76IH71CeS6e6udEA76Ve4gW_cQBTVPYoisfJfvho06AO02Od",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWxEDzncSyN4Abn_-2aWz94iTg2PXoWQI0F3MUpC1xxssixycRbqGBj3lVz1FVaxLfdcnvAalCTixR8OnpweC3Dn59Cig8mYhH-kN4Y0SO0BPuwOuKdtQqxClUYQ3RdpYyedcRL0m6uZuoAy3Ppx5vVcFkj0k-M3nmlIW5j0mBaRISFsXMYfpodNhdtw25P9fop-CRyoX-_lmAjsO2y7XC-fDEoKrvDIQuWluZ2DHFllr63nVu498XysrQXn1WX7FiyZ2bXS1BeTG_",
  },
];

export default function AcademySearchPage() {
  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-[#f6f7f8]/80 backdrop-blur-md border-b border-slate-200">
        <div className="flex items-center p-4 justify-between">
          <Link to="/" className="text-slate-900 flex size-10 shrink-0 items-center justify-center">
            <span className="material-symbols-outlined">arrow_back_ios</span>
          </Link>
          <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-tight flex-1 text-center">
            Find your Academy
          </h2>
          <div className="flex w-10 items-center justify-end">
            <span className="material-symbols-outlined text-[#2b8cee]">tune</span>
          </div>
        </div>

        {/* Search Field */}
        <div className="px-4 pb-3">
          <label className="flex flex-col min-w-40 h-11 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-white shadow-sm border border-slate-200">
              <div className="text-slate-400 flex items-center justify-center pl-4">
                <span className="material-symbols-outlined text-xl">search</span>
              </div>
              <input
                className="flex w-full min-w-0 flex-1 border-none bg-transparent focus:outline-none focus:ring-0 h-full placeholder:text-slate-400 px-3 text-sm font-normal"
                placeholder="Search school name or city..."
              />
            </div>
          </label>
        </div>

        {/* Horizontal Filter Chips */}
        <div className="flex gap-2 px-4 pb-4 overflow-x-auto hide-scrollbar">
          <button className="flex h-9 shrink-0 items-center justify-center gap-x-1 rounded-full bg-[#2b8cee] text-white px-4 text-sm font-semibold">
            <span>All Locations</span>
          </button>
          <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white border border-slate-200 px-4 text-sm font-medium">
            <span>Cebu</span>
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>
          <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white border border-slate-200 px-4 text-sm font-medium">
            <span>Course</span>
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>
          <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white border border-slate-200 px-4 text-sm font-medium">
            <span>Dorm</span>
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-4 space-y-6 pb-24">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-900 text-lg font-bold">42 Schools found</h3>
          <span className="text-[#2b8cee] text-sm font-semibold">Map View</span>
        </div>

        {/* Academy Cards */}
        {academies.map((academy) => (
          <div
            key={academy.id}
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100"
          >
            <div className="relative w-full aspect-[16/9] bg-slate-200 overflow-hidden">
              <img
                alt={academy.name}
                className="w-full h-full object-cover"
                src={academy.image}
              />
              {academy.badge && (
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-white/90 backdrop-blur-sm text-slate-900 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                    {academy.badge}
                  </span>
                </div>
              )}
              <div className="absolute top-3 right-3 bg-white p-1 rounded-lg shadow-md">
                <img alt="School Logo" className="w-8 h-8 rounded" src={academy.logo} />
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-1 text-[#2b8cee]">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span className="text-sm font-bold">{academy.rating}</span>
                  <span className="text-slate-400 text-xs font-normal">({academy.reviews} reviews)</span>
                </div>
                <span className="text-[#2b8cee] font-bold text-sm">Starting ${academy.price}</span>
              </div>
              <h4 className="text-slate-900 text-lg font-bold leading-tight mb-1">{academy.name}</h4>
              <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
                <span className="material-symbols-outlined text-base">location_on</span>
                <span>{academy.location}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {academy.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                to={`/academy/${academy.id}`}
                className="block w-full bg-[#2b8cee] text-white font-bold py-2.5 rounded-lg hover:bg-[#2b8cee]/90 transition-colors text-center"
              >
                View Academy Details
              </Link>
            </div>
          </div>
        ))}
      </main>

      {/* Floating Action Button: Consultancy */}
      <div className="fixed bottom-24 right-4 z-40">
        <button className="flex items-center gap-2 bg-[#2b8cee] text-white px-5 py-3 rounded-full shadow-lg border-2 border-white animate-bounce">
          <span className="material-symbols-outlined">support_agent</span>
          <span className="font-bold text-sm">Talk to Expert</span>
        </button>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-slate-200">
        <div className="flex justify-around items-center h-16">
          <Link to="/" className="flex flex-col items-center justify-center text-slate-400">
            <span className="material-symbols-outlined">home</span>
            <span className="text-[10px] mt-0.5">Home</span>
          </Link>
          <Link to="/search" className="flex flex-col items-center justify-center text-[#2b8cee]">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              search
            </span>
            <span className="text-[10px] mt-0.5 font-semibold">Search</span>
          </Link>
          <a href="#" className="flex flex-col items-center justify-center text-slate-400">
            <span className="material-symbols-outlined">forum</span>
            <span className="text-[10px] mt-0.5">Consult</span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center text-slate-400">
            <span className="material-symbols-outlined">favorite</span>
            <span className="text-[10px] mt-0.5">Saved</span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center text-slate-400">
            <span className="material-symbols-outlined">person</span>
            <span className="text-[10px] mt-0.5">Profile</span>
          </a>
        </div>
      </nav>

      {/* Map Trigger (Floating) */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40">
        <button className="bg-slate-900 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 text-xs font-bold">
          <span className="material-symbols-outlined text-sm">map</span>
          Map View
        </button>
      </div>
    </div>
  );
}
