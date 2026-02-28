import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Seo from "@/components/Seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchAcademy } from "@/api/academy/academies";
import type { AcademyDetail } from "@/data/academies";
import { getAcademySystemChipClass, getTagChipClass } from "@/data/academy/chipColors";
import LoadingOverlay from "@/components/LoadingOverlay";

export default function AcademyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const { data: academy, isLoading } = useQuery<AcademyDetail | null>({
    queryKey: ["academy", id],
    queryFn: () => fetchAcademy(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  if (!academy) {
    return (
      <div className="bg-cream min-h-screen">
        <Navbar />
        <div className="pt-20 text-center py-16">
          <p className="text-brown text-lg">어학원을 찾을 수 없습니다.</p>
          <Link to="/academies" className="text-terracotta font-medium mt-4 inline-block no-underline">어학원 목록으로 돌아가기</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <Seo title={academy.name} description={academy.shortDesc ?? academy.desc} path={`/academy/${id}`} />
      <Navbar />

      {/* Breadcrumb */}
      <div className="pt-20 bg-white border-b border-beige-dark">
        <div className="max-w-[1200px] mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-brown">
            <Link to="/" className="hover:text-brown-dark no-underline text-brown">
              홈
            </Link>
            <span>/</span>
            <Link to="/academies" className="hover:text-brown-dark no-underline text-brown">
              어학원
            </Link>
            <span>/</span>
            <span className="text-brown-dark font-medium">{academy.name}</span>
          </div>
        </div>
      </div>

      <main className="max-w-[900px] mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Image Swiper */}
          <div className="rounded-[20px] overflow-hidden border border-beige-dark relative group">
            {academy.images.length > 1 ? (
              <>
                <Swiper
                  modules={[Pagination]}
                  pagination={{ clickable: true }}
                  loop
                  onSwiper={(swiper) => setSwiperInstance(swiper)}
                  className="h-[300px] md:h-[400px] academy-swiper"
                >
                  {academy.images.map((imageUrl, index) => (
                    <SwiperSlide key={imageUrl}>
                      <img
                        src={imageUrl}
                        alt={`${academy.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <button
                  onClick={() => swiperInstance?.slidePrev()}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-brown-dark hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft size={20} strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => swiperInstance?.slideNext()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-brown-dark hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight size={20} strokeWidth={2.5} />
                </button>
              </>
            ) : (
              <div className="h-[300px] md:h-[400px]">
                <img
                  src={academy.images[0]}
                  alt={academy.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Academy Header */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-md text-[0.75rem] font-semibold bg-white text-brown-dark border border-beige-dark">
                {academy.region}
              </span>
              <span className={`px-2.5 py-1 rounded-md text-[0.75rem] font-semibold ${getAcademySystemChipClass(academy.academy_system)}`}>
                {academy.academy_system}
              </span>
              {academy.tags.map((tag) => (
                <span key={tag} className={`px-2.5 py-1 rounded-md text-[0.75rem] font-semibold ${getTagChipClass(tag)}`}>
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-[1.8rem] md:text-[2.2rem] font-extrabold text-brown-dark tracking-tight">{academy.name}</h1>
            <p className="mt-2 text-brown text-base leading-relaxed">{academy.shortDesc ?? academy.desc}</p>
          </div>

          {/* 기본 정보 */}
          <div className="bg-white rounded-[16px] p-6 border border-beige-dark">
            <h3 className="font-bold text-brown-dark mb-4">기본 정보</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {academy.established_year && (
                <div>
                  <div className="text-xs text-brown-light mb-1">설립연도</div>
                  <div className="text-sm font-semibold text-brown-dark">{academy.established_year}년</div>
                </div>
              )}
              {academy.capacity && (
                <div>
                  <div className="text-xs text-brown-light mb-1">정원</div>
                  <div className="text-sm font-semibold text-brown-dark">{academy.capacity}명</div>
                </div>
              )}
              {academy.korean_ratio && (
                <div>
                  <div className="text-xs text-brown-light mb-1">한국인 비율</div>
                  <div className="text-sm font-semibold text-brown-dark">{academy.korean_ratio}</div>
                </div>
              )}
              {academy.location_detail && (
                <div>
                  <div className="text-xs text-brown-light mb-1">세부 위치</div>
                  <div className="text-sm font-semibold text-brown-dark">{academy.location_detail}</div>
                </div>
              )}
              {academy.address && (
                <div>
                  <div className="text-xs text-brown-light mb-1">주소</div>
                  <div className="text-sm font-semibold text-brown-dark">{academy.address}</div>
                </div>
              )}
              {academy.website && (
                <div>
                  <div className="text-xs text-brown-light mb-1">웹사이트</div>
                  <a
                    href={academy.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-terracotta hover:underline no-underline"
                  >
                    {academy.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Pros & Cons */}
          {(academy.pros?.length || academy.cons?.length) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {academy.pros?.length && (
                <div className="bg-accent-green-light rounded-[16px] p-6 border border-accent-green/20">
                  <h3 className="text-accent-green-dark font-bold mb-3 flex items-center gap-2">
                    <span>👍</span> 장점
                  </h3>
                  <ul className="space-y-2">
                    {academy.pros.map((pro) => (
                      <li key={pro} className="text-sm text-brown-dark flex items-start gap-2">
                        <span className="text-accent-green mt-0.5 shrink-0">✓</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {academy.cons?.length && (
                <div className="bg-terracotta-light rounded-[16px] p-6 border border-terracotta/20">
                  <h3 className="text-terracotta font-bold mb-3 flex items-center gap-2">
                    <span>📌</span> 참고사항
                  </h3>
                  <ul className="space-y-2">
                    {academy.cons.map((con) => (
                      <li key={con} className="text-sm text-brown-dark flex items-start gap-2">
                        <span className="text-terracotta mt-0.5 shrink-0">·</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Recommended For */}
          {academy.recommendedFor?.length && (
            <div className="bg-white rounded-[16px] p-6 border border-beige-dark">
              <h3 className="font-bold text-brown-dark mb-3">🎯 이런 분에게 추천</h3>
              <div className="flex flex-wrap gap-2">
                {academy.recommendedFor.map((item) => (
                  <span key={item} className="px-3 py-1.5 bg-green-badge text-accent-green-dark rounded-full text-sm font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {academy.description && (
            <div className="bg-white rounded-[16px] p-6 border border-beige-dark">
              <h3 className="font-bold text-brown-dark mb-3">어학원 소개</h3>
              <p className="text-brown text-[0.9rem] leading-[1.8]">{academy.description}</p>
            </div>
          )}

          {/* Facilities */}
          {academy.facilities?.length && (
            <div className="bg-white rounded-[16px] p-6 border border-beige-dark">
              <h3 className="font-bold text-brown-dark mb-4">시설</h3>
              <div className="flex flex-wrap gap-2">
                {academy.facilities.map((facility) => (
                  <span key={facility} className="px-3 py-1.5 bg-beige text-brown rounded-[10px] text-sm font-medium">
                    {facility}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Courses */}
          <div className="bg-white rounded-[16px] p-6 border border-beige-dark">
            <h3 className="font-bold text-brown-dark mb-4">코스 안내</h3>
            <div className="space-y-3">
              {academy.courses.map((course) => (
                <div
                  key={course.name}
                  className="p-4 rounded-[12px] border border-beige-dark bg-beige/30"
                >
                  <div className="mb-2">
                    <h4 className="font-bold text-brown-dark">{course.name}</h4>
                    <span className={`text-[0.72rem] px-2 py-0.5 rounded font-medium ${getTagChipClass(course.category)}`}>{course.category}</span>
                  </div>
                  <p className="text-sm text-brown mb-2">{course.desc}</p>
                  <div className="flex gap-2 text-[0.75rem]">
                    <span className="px-2 py-0.5 bg-white border border-beige-dark rounded">1:1 {course.manToMan}시간</span>
                    <span className="px-2 py-0.5 bg-white border border-beige-dark rounded">그룹 {course.group}시간</span>
                    {course.optional > 0 && (
                      <span className="px-2 py-0.5 bg-white border border-beige-dark rounded">선택 {course.optional}시간</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dormitories */}
          <div className="bg-white rounded-[16px] p-6 border border-beige-dark">
            <h3 className="font-bold text-brown-dark mb-4">기숙사</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {academy.dormitories.map((dormitory) => (
                <div
                  key={dormitory.type}
                  className="p-4 rounded-[12px] border border-beige-dark bg-beige/30 text-center"
                >
                  <div className="font-bold text-brown-dark mb-1">{dormitory.type}</div>
                  <div className="text-sm font-bold text-terracotta">{(dormitory.pricePerWeek / 10000).toFixed(0)}만원<span className="text-[0.7rem] font-normal text-brown-light">/주</span></div>
                  <div className="text-[0.75rem] text-brown mt-1">{dormitory.meals}</div>
                  <div className="text-[0.72rem] text-brown-light mt-1">{dormitory.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-white rounded-[16px] p-6 border border-beige-dark text-center space-y-3">
            <Link to="/quote?from=academy-detail" className="block w-full py-3.5 bg-terracotta text-white rounded-[10px] font-bold hover:bg-terracotta-hover transition-colors text-center no-underline">
              무료 견적 받기
            </Link>
            <Link to="/process" className="block w-full py-3.5 bg-brown-dark text-white rounded-[10px] font-bold hover:bg-brown-text transition-colors text-center no-underline">
              이 어학원으로 수속 신청
            </Link>
            <a
              href="#"
              className="block text-center text-sm text-brown hover:text-brown-dark no-underline font-medium"
            >
              💬 카카오톡으로 상담하기
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
