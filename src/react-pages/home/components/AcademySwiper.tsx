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
  academies: Academy[];
}

export default function AcademySwiper({ academies }: AcademySwiperProps) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

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
          768: { slidesPerView: 2, slidesPerGroup: 2 },
          1024: { slidesPerView: 3, slidesPerGroup: 3 },
        }}
        onSwiper={setSwiperInstance}
        className="pb-12"
      >
        {academies.slice(0, 9).map((academy) => (
          <SwiperSlide key={academy.id}>
            <a
              href={`/academy/${academy.id}`}
              className="block bg-dark-card rounded-[20px] overflow-hidden border border-dark-border hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(196,96,58,0.12)] transition-all no-underline text-dark-text"
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
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="px-2.5 py-1 rounded-md text-[0.7rem] font-semibold bg-dark-base/80 backdrop-blur-sm text-dark-text">
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
                <div className="text-[1.1rem] font-bold text-dark-text">{academy.name}</div>
                <p className="mt-1.5 text-[0.82rem] text-dark-text-secondary leading-[1.5] line-clamp-2">{academy.desc}</p>
              </div>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
      <button
        onClick={() => swiperInstance?.slidePrev()}
        aria-label="이전 어학원 보기"
        className="absolute -left-5 top-[calc(50%-24px)] z-10 w-10 h-10 rounded-full bg-dark-surface shadow-md border border-dark-border items-center justify-center text-dark-text hover:bg-dark-card hover:border-dark-accent-orange transition-all hidden md:flex"
      >
        <ChevronLeft size={18} strokeWidth={2.5} />
      </button>
      <button
        onClick={() => swiperInstance?.slideNext()}
        aria-label="다음 어학원 보기"
        className="absolute -right-5 top-[calc(50%-24px)] z-10 w-10 h-10 rounded-full bg-dark-surface shadow-md border border-dark-border items-center justify-center text-dark-text hover:bg-dark-card hover:border-dark-accent-orange transition-all hidden md:flex"
      >
        <ChevronRight size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
}
