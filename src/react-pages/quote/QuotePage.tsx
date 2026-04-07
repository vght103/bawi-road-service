import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { createIsland } from "@/lib/createIsland";
import { fetchAcademies } from "@/api/academy/academies";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { quoteSchema, type QuoteFormValues } from "./quoteSchema";
import type { QuoteLogInsert } from "@/types/quote";
import type { Academy } from "@/data/academies";
import LoadingOverlay from "@/components/LoadingOverlay";

// 무료 견적 요청 페이지 — 어학원/코스/기숙사/기간 선택 시 실시간 예상 비용 계산 후 이메일 발송
function QuotePage() {
  const searchParams = new URLSearchParams(window.location.search);
  const source = searchParams.get("from"); // 유입 경로 (home-hero, academy-detail 등)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    resetField,
    reset,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      name: "",
      email: "",
      academyId: "",
      weeks: "",
    },
  });

  // UI 상태
  const [academyOpen, setAcademyOpen] = useState(false); // 어학원 콤보박스
  const [calendarOpen, setCalendarOpen] = useState(false); // 날짜 달력 팝오버
  const [submitted, setSubmitted] = useState(false); // 완료 화면 전환 여부
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { user } = useAuth();

  const { data: academies = [], isLoading: academiesLoading } = useQuery<Academy[]>({
    queryKey: ["academies"],
    queryFn: fetchAcademies,
  });

  // watch로 폼 값 실시간 구독
  const academyId = watch("academyId");
  const courseIndex = watch("courseIndex");
  const dormIndex = watch("dormIndex");
  const weeks = watch("weeks");
  const startDate = watch("startDate");
  const email = watch("email");

  const selectedAcademy = academies?.find((academy) => academy.id === academyId); // academyId로 선택된 어학원 객체

  // 어학원 변경 시 코스·기숙사 선택 초기화 — 어학원마다 목록이 다르므로 필수
  useEffect(() => {
    resetField("courseIndex");
    resetField("dormIndex");
  }, [academyId, resetField]);

  const weeksNum = Number(weeks) || 0; // 연수 기간 숫자 변환
  const selectedCourse = selectedAcademy && courseIndex !== undefined ? selectedAcademy.courses[courseIndex] : null;
  const selectedDorm = selectedAcademy && dormIndex !== undefined ? selectedAcademy.dormitories[dormIndex] : null;
  const minDate = new Date(); // 오늘로부터 7일 이후만 선택 가능
  minDate.setDate(minDate.getDate() + 7);

  // 예상 종료일: 시작일 + 연수 기간(주 × 7일)
  const endDate =
    startDate && weeksNum > 0
      ? new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + weeksNum * 7)
      : null;

  // 견적 요청 폼 제출 — zod 검증 통과 후 Supabase quote_list 삽입 → 완료 화면
  async function onSubmit(data: QuoteFormValues) {
    setSubmitError(null);

    // Supabase 미설정 환경(개발/테스트)에서는 DB 저장 없이 완료 처리
    if (!supabaseConfigured) {
      setSubmitted(true);
      return;
    }

    setSubmitting(true);
    try {
      const payload: QuoteLogInsert = {
        user_id: user?.id ?? null, // 비로그인이면 null
        name: data.name,
        email: data.email,
        academy_id: data.academyId,
        academy_name: selectedAcademy!.name,
        course_name: selectedCourse!.name,
        dormitory_type: selectedDorm!.type,
        duration_weeks: Number(data.weeks),
        start_date: data.startDate.toISOString().split("T")[0],
        source, // 유입 경로
      };

      const { error } = await supabase.from("quote_list").insert(payload);
      if (error) {
        setSubmitError("견적 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  if (academiesLoading) {
    return <LoadingOverlay visible />;
  }

  // 견적 요청 완료 화면
  if (submitted) {
    return (
      <div className="bg-cream min-h-[calc(100vh-180px)] flex items-center justify-center">
        <div className="px-6 py-12">
          <div className="max-w-[520px] mx-auto text-center">
            <div className="bg-white rounded-[20px] p-10 border border-beige-dark shadow-lg">
              <div className="w-16 h-16 bg-accent-green-light rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckIcon className="w-8 h-8 text-accent-green" strokeWidth={2.5} />
              </div>
              <h2 className="text-[1.5rem] font-extrabold text-brown-dark mb-3">견적 요청이 완료되었습니다</h2>
              <p className="text-brown text-[0.9rem] leading-relaxed mb-2">
                <span className="font-bold text-brown-dark">{email}</span>으로
                <br />
                견적서를 보내드리겠습니다.
              </p>
              <p className="text-brown-light text-[0.82rem] mb-4">보통 1~2 영업일 이내에 회신드립니다.</p>
              <div className="flex gap-3 justify-center">
                <Button variant="secondary" asChild>
                  <a href="/" className="no-underline">
                    홈으로
                  </a>
                </Button>
                {/* 폼 초기화 후 새 견적 요청 */}
                <Button
                  onClick={() => {
                    setSubmitted(false);
                    reset();
                  }}
                >
                  새 견적 요청
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <LoadingOverlay visible={submitting} />

      {/* 브레드크럼: 홈 > 견적 요청 */}
      <div className="bg-white border-b border-beige-dark">
        <div className="max-w-[1200px] mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-brown">
            <a href="/" className="hover:text-brown-dark no-underline text-brown">
              홈
            </a>
            <span>/</span>
            <span className="text-brown-dark font-medium">견적 요청</span>
          </div>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-6 py-8">
        {/* 5:2 비율 — 왼쪽 폼 / 오른쪽 요약 패널 */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* 견적 요청 폼 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[20px] p-6 md:p-10 border border-beige-dark">
              <h1 className="text-[1.5rem] md:text-[1.8rem] font-extrabold text-brown-dark tracking-tight mb-1">
                무료 견적 요청
              </h1>
              <p className="text-brown text-[0.9rem] mb-8">
                어학원과 코스를 선택하면 맞춤 견적서를 이메일로 보내드립니다.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                {/* 개인 정보 섹션 */}
                <div className="space-y-5">
                  {/* 이름 */}
                  <div className="space-y-2">
                    <Label className="text-brown-dark font-semibold required">이름</Label>
                    <Input
                      type="text"
                      {...register("name")}
                      placeholder="홍길동"
                      aria-invalid={!!errors.name}
                      className="h-12 rounded-[10px]"
                    />
                    {errors.name && <p className="text-terracotta text-[0.75rem]">{errors.name.message}</p>}
                  </div>

                  {/* 이메일 (견적서 수신) */}
                  <div className="space-y-2">
                    <Label className="text-brown-dark font-semibold required">이메일</Label>
                    <Input
                      type="email"
                      {...register("email")}
                      placeholder="example@email.com"
                      aria-invalid={!!errors.email}
                      className="h-12 rounded-[10px]"
                    />
                    {errors.email && <p className="text-terracotta text-[0.75rem]">{errors.email.message}</p>}
                  </div>
                </div>

                {/* 섹션 구분선 */}
                <hr className="border-beige-dark" />

                {/* 연수 정보 섹션 */}
                {/* 어학원 선택 콤보박스 */}
                <div className="space-y-2">
                  <Label className="text-brown-dark font-semibold required">관심 어학원</Label>
                  <Popover open={academyOpen} onOpenChange={setAcademyOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={academyOpen}
                        className={cn(
                          "w-full justify-between h-11 rounded-[10px] font-normal",
                          !academyId && "text-muted-foreground",
                        )}
                      >
                        {selectedAcademy ? (
                          <span>
                            {selectedAcademy.name}
                            <span className="ml-2 text-muted-foreground text-[0.75rem]">
                              {selectedAcademy.region} · {selectedAcademy.academy_system}
                            </span>
                          </span>
                        ) : (
                          "어학원을 선택해주세요"
                        )}
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="어학원 검색..." />
                        <CommandList>
                          <CommandEmpty>검색 결과가 없습니다</CommandEmpty>
                          <CommandGroup>
                            {/* 이름 + 지역 + 수업방식으로 검색 */}
                            {academies?.map((academy) => (
                              <CommandItem
                                key={academy.id}
                                value={`${academy.name} ${academy.region} ${academy.academy_system}`}
                                onSelect={() => {
                                  setValue("academyId", academy.id);
                                  setAcademyOpen(false);
                                }}
                                className="flex flex-col items-start gap-1 py-2.5"
                              >
                                <div className="flex items-center gap-2 w-full">
                                  {/* 선택된 항목에 체크 아이콘 */}
                                  <CheckIcon
                                    className={cn(
                                      "h-4 w-4 shrink-0",
                                      academyId === academy.id ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  <span className="font-medium">{academy.name}</span>
                                  <span className="text-[0.75rem] text-muted-foreground">
                                    {academy.region} · {academy.academy_system}
                                  </span>
                                </div>
                                <div className="flex gap-1 ml-6">
                                  {academy.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="px-1.5 py-0.5 bg-secondary text-secondary-foreground text-[0.65rem] rounded"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {errors.academyId && <p className="text-terracotta text-[0.75rem]">{errors.academyId.message}</p>}
                </div>

                {/* 코스 선택 — 어학원 선택 후 해당 코스만 표시 */}
                <div className="space-y-2">
                  <Label className="text-brown-dark font-semibold required">코스</Label>
                  {selectedAcademy ? (
                    <div className="space-y-2">
                      {selectedAcademy.courses.map((course, index) => (
                        <button
                          type="button"
                          key={course.name}
                          onClick={() => setValue("courseIndex", index)}
                          className={cn(
                            "w-full text-left p-3.5 rounded-[10px] border transition-all",
                            courseIndex === index
                              ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                              : "border-input bg-white hover:border-muted-foreground/30",
                          )}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-brown-dark">{course.name}</span>
                            <span className="px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded text-[0.65rem] font-medium">
                              {course.category}
                            </span>
                            {courseIndex === index && <CheckIcon className="h-4 w-4 text-primary ml-auto" />}
                          </div>
                          <p className="text-[0.78rem] text-muted-foreground">{course.desc}</p>
                          {/* 수업 구성: 1:1 / 그룹 / 선택 */}
                          <div className="flex gap-1.5 mt-1.5 text-[0.7rem]">
                            <span className="px-1.5 py-0.5 bg-cream border border-input rounded">
                              1:1 {course.manToMan}시간
                            </span>
                            <span className="px-1.5 py-0.5 bg-cream border border-input rounded">
                              그룹 {course.group}시간
                            </span>
                            {course.optional > 0 && (
                              <span className="px-1.5 py-0.5 bg-cream border border-input rounded">
                                선택 {course.optional}시간
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full bg-secondary border border-input rounded-[10px] px-4 py-3 text-sm text-muted-foreground">
                      어학원을 먼저 선택해주세요
                    </div>
                  )}
                  {errors.courseIndex && <p className="text-terracotta text-[0.75rem]">{errors.courseIndex.message}</p>}
                </div>

                {/* 수업 시작 희망일 — 오늘로부터 7일 이후만 선택 가능 */}
                <div className="space-y-2">
                  <Label className="text-brown-dark font-semibold required">수업 시작 희망일</Label>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start h-11 rounded-[10px] font-normal",
                          !startDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate
                          ? startDate.toLocaleDateString("ko-KR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              weekday: "short",
                            })
                          : "날짜를 선택해주세요"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                          if (date) setValue("startDate", date);
                          setCalendarOpen(false);
                        }}
                        disabled={(date) => date < minDate} // 7일 이내 선택 불가
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.startDate && <p className="text-terracotta text-[0.75rem]">{errors.startDate.message}</p>}
                  <p className="text-[0.72rem] text-muted-foreground">
                    대부분의 어학원은 매주 월요일 입학이 가능합니다.
                  </p>
                </div>

                {/* 연수 기간 (주 단위) */}
                <div className="space-y-2">
                  <Label className="text-brown-dark font-semibold required">연수 기간 (주)</Label>
                  <div className="relative">
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={weeks}
                      onChange={(event) => {
                        const filtered = event.target.value.replace(/[^0-9]/g, ""); // 숫자만 허용
                        setValue("weeks", filtered);
                      }}
                      placeholder="예: 8"
                      aria-invalid={!!errors.weeks}
                      className="h-11 rounded-[10px] pr-10"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                      주
                    </span>
                  </div>
                  {errors.weeks && <p className="text-terracotta text-[0.75rem]">{errors.weeks.message}</p>}
                  {/* 자주 사용하는 기간 빠른 선택 */}
                  <div className="flex gap-2 mt-2">
                    {[4, 8, 12, 16, 24].map((weekOption) => (
                      <Button
                        type="button"
                        key={weekOption}
                        variant={weeks === String(weekOption) ? "default" : "secondary"}
                        size="sm"
                        className="rounded-full"
                        onClick={() => setValue("weeks", String(weekOption))}
                      >
                        {weekOption}주
                      </Button>
                    ))}
                  </div>
                </div>

                {/* 기숙사 타입 선택 — 어학원 선택 후 해당 기숙사만 표시 */}
                <div className="space-y-2">
                  <Label className="text-brown-dark font-semibold required">기숙사 타입</Label>
                  {selectedAcademy ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {selectedAcademy.dormitories.map((dorm, index) => (
                        <button
                          type="button"
                          key={dorm.type}
                          onClick={() => setValue("dormIndex", index)}
                          className={cn(
                            "p-3.5 rounded-[10px] border transition-all text-center",
                            dormIndex === index
                              ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                              : "border-input bg-white hover:border-muted-foreground/30",
                          )}
                        >
                          <div className="font-bold text-brown-dark text-sm">{dorm.type}</div>
                          <div className="text-[0.7rem] text-muted-foreground mt-1">{dorm.meals}</div>
                          <div className="text-[0.65rem] text-muted-foreground/70 mt-0.5">{dorm.desc}</div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full bg-secondary border border-input rounded-[10px] px-4 py-3 text-sm text-muted-foreground">
                      어학원을 먼저 선택해주세요
                    </div>
                  )}
                  {errors.dormIndex && <p className="text-terracotta text-[0.75rem]">{errors.dormIndex.message}</p>}
                </div>

                <Button type="submit" size="lg" className="w-full h-12 text-base rounded-[10px]" disabled={submitting}>
                  {submitting ? "요청 중..." : "견적서 요청하기"}
                </Button>
                {submitError && <p className="text-terracotta text-[0.8rem] text-center">{submitError}</p>}
              </form>
            </div>
          </div>

          {/* 요약 패널 (스크롤 고정) — 선택 내용과 실시간 예상 비용 표시 */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-[20px] p-6 border border-beige-dark shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent-green" />
                <h3 className="font-bold text-brown-dark text-lg mb-5">요청 요약</h3>

                {selectedAcademy ? (
                  <div className="space-y-4">
                    <div>
                      <div className="text-[0.75rem] text-muted-foreground mb-1">어학원</div>
                      <div className="font-bold text-brown-dark">{selectedAcademy.name}</div>
                      <div className="text-[0.75rem] text-muted-foreground">
                        {selectedAcademy.region} · {selectedAcademy.academy_system}
                      </div>
                    </div>

                    {selectedCourse && (
                      <div>
                        <div className="text-[0.75rem] text-muted-foreground mb-1">코스</div>
                        <div className="font-bold text-brown-dark">{selectedCourse.name}</div>
                      </div>
                    )}

                    {(startDate || weeksNum > 0) && (
                      <div>
                        <div className="text-[0.75rem] text-muted-foreground mb-1">일정</div>
                        {startDate && (
                          <div className="font-bold text-brown-dark">
                            {startDate.toLocaleDateString("ko-KR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                            {endDate && ( // 종료일이 계산된 경우 "~" 형식으로 표시
                              <>
                                {" ~ "}
                                {endDate.toLocaleDateString("ko-KR", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </>
                            )}
                          </div>
                        )}
                        {weeksNum > 0 && <div className="text-[0.75rem] text-muted-foreground">{weeksNum}주</div>}
                      </div>
                    )}

                    {selectedDorm && (
                      <div>
                        <div className="text-[0.75rem] text-muted-foreground mb-1">기숙사</div>
                        <div className="font-bold text-brown-dark">{selectedDorm.type}</div>
                      </div>
                    )}

                    {/* 참고 견적가: (코스 주당 + 기숙사 주당) × 기간 */}
                    {selectedCourse && selectedDorm && weeksNum > 0 && (
                      <div className="pt-4 border-t border-beige-dark">
                        <div className="text-[0.75rem] text-muted-foreground mb-1">참고 견적가</div>
                        <div className="font-bold text-brown-dark text-lg">
                          {((selectedCourse.pricePerWeek + selectedDorm.pricePerWeek) * weeksNum).toLocaleString()}원
                        </div>
                        <div className="text-[0.68rem] text-muted-foreground mt-1">
                          참고가이며, 정확한 할인 금액은 상담 후 안내드립니다.
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                      <CalendarIcon className="w-6 h-6 text-muted-foreground" strokeWidth={1.5} />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      어학원과 코스를 선택하면
                      <br />
                      요약 정보가 표시됩니다
                    </p>
                  </div>
                )}

                {/* 실제 견적에는 추가 비용 포함 안내 */}
                <div className="mt-6 p-3 bg-accent rounded-[10px]">
                  <p className="text-[0.75rem] text-accent-foreground leading-relaxed">
                    실제 견적은 프로모션, 등록비, SSP, 비자 연장비 등을 포함하여 이메일로 상세히 안내드립니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}

export default createIsland(QuotePage);
