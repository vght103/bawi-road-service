import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Academy } from "@/data/academies";
import { getAcademySystemChipClass } from "@/data/academy/chipColors";
import "swiper/css";
import "swiper/css/pagination";

interface AcademySwiperProps {
  academies: Academy[]; // 슬라이더에 표시할 어학원 목록
}

// 홈페이지 인기 어학원 슬라이더 — 모바일 1개, 태블릿 2개, 데스크탑 3개씩 표시
export default function AcademySwiper({ academies }: AcademySwiperProps) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null); // 화살표 버튼 제어용

  return (
    <div className="relative">
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={20}
        slidesPerView={1}
        slidesPerGroup={1}
        loop
        breakpoints={{
          768: { slidesPerView: 2, slidesPerGroup: 2 },  // 태블릿
          1024: { slidesPerView: 3, slidesPerGroup: 3 }, // 데스크탑
        }}
        onSwiper={setSwiperInstance}
        className="pb-12"
      >
        {/* 최대 9개만 표시 */}
        {academies.slice(0, 9).map((academy) => (
          <SwiperSlide key={academy.id}>
            <a
              href={`/academy/${academy.id}`}
              className="block bg-white rounded-[20px] overflow-hidden border border-beige-dark hover:-translate-y-1 hover:shadow-lg transition-all no-underline text-brown-text"
            >
              <div className="h-[180px] relative overflow-hidden">
                <img
                  src={academy.images[0]}
                  alt={academy.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={400}
                  height={180}
                />
                {/* 이미지 위 지역 + 수업 방식 뱃지 */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="px-2.5 py-1 rounded-md text-[0.7rem] font-semibold bg-white/90 text-brown-dark">
                    {academy.region}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-md text-[0.7rem] font-semibold ${getAcademySystemChipClass(academy.academy_system)}`}
                  >
                    {academy.academy_system}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="text-[1.1rem] font-bold text-brown-dark">{academy.name}</div>
                <p className="mt-1.5 text-[0.82rem] text-brown leading-[1.5] line-clamp-2">{academy.desc}</p>
              </div>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* 이전 버튼 (데스크탑 전용) */}
      <button
        onClick={() => swiperInstance?.slidePrev()}
        aria-label="이전 어학원 보기"
        className="absolute -left-5 top-[calc(50%-24px)] z-10 w-10 h-10 rounded-full bg-white shadow-md border border-beige-dark items-center justify-center text-brown-dark hover:bg-beige hover:border-brown-light transition-all hidden md:flex"
      >
        <ChevronLeft size={18} strokeWidth={2.5} />
      </button>
      {/* 다음 버튼 (데스크탑 전용) */}
      <button
        onClick={() => swiperInstance?.slideNext()}
        aria-label="다음 어학원 보기"
        className="absolute -right-5 top-[calc(50%-24px)] z-10 w-10 h-10 rounded-full bg-white shadow-md border border-beige-dark items-center justify-center text-brown-dark hover:bg-beige hover:border-brown-light transition-all hidden md:flex"
      >
        <ChevronRight size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
}
