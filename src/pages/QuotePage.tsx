import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarIcon, CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAcademies } from "@/hooks/useAcademies";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { QuoteLogInsert } from "@/types/quote";

export default function QuotePage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [academyId, setAcademyId] = useState("");
  const [courseIndex, setCourseIndex] = useState<number | "">("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [weeks, setWeeks] = useState("");
  const [dormIndex, setDormIndex] = useState<number | "">("");

  const [academyOpen, setAcademyOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [quoteCount, setQuoteCount] = useState<number | null>(null);
  const [quoteLimitReached, setQuoteLimitReached] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { user } = useAuth();
  const { academies, loading: academiesLoading } = useAcademies();

  const selectedAcademy = academies.find((a) => a.id === academyId);

  useEffect(() => {
    setCourseIndex("");
    setDormIndex("");
  }, [academyId]);

  function validateEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "이름을 입력해주세요.";
    if (!email.trim()) e.email = "이메일을 입력해주세요.";
    else if (!validateEmail(email)) e.email = "올바른 이메일 형식을 입력해주세요.";
    if (!academyId) e.academy = "어학원을 선택해주세요.";
    if (courseIndex === "") e.course = "코스를 선택해주세요.";
    if (!startDate) e.startDate = "수업 시작 희망일을 선택해주세요.";
    if (!weeks.trim()) e.weeks = "연수 기간을 입력해주세요.";
    else if (Number(weeks) < 1 || Number(weeks) > 52)
      e.weeks = "1~52주 사이로 입력해주세요.";
    if (dormIndex === "") e.dorm = "기숙사 타입을 선택해주세요.";
    return e;
  }

  async function handleEmailBlur() {
    if (!supabaseConfigured || !validateEmail(email)) return;
    const { data, error } = await supabase.rpc("get_quote_count", { p_email: email });
    if (!error && typeof data === "number") {
      setQuoteCount(data);
      setQuoteLimitReached(data >= 3);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    setSubmitError(null);
    if (Object.keys(v).length > 0) return;

    if (!supabaseConfigured) {
      setSubmitted(true);
      return;
    }

    setSubmitting(true);
    try {
      // Re-check quote count
      const { data: countData } = await supabase.rpc("get_quote_count", { p_email: email });
      const currentCount = typeof countData === "number" ? countData : 0;
      if (currentCount >= 3) {
        setQuoteCount(currentCount);
        setQuoteLimitReached(true);
        setSubmitting(false);
        return;
      }

      const payload: QuoteLogInsert = {
        user_id: user?.id ?? null,
        name,
        email,
        academy_id: academyId,
        academy_name: selectedAcademy!.name,
        course_name: selectedCourse!.name,
        dormitory_type: selectedDorm!.type,
        duration_weeks: weeksNum,
        start_date: startDate ? startDate.toISOString().split("T")[0] : null,
        quote_count: currentCount + 1,
      };

      const { error } = await supabase.from("quote_logs").insert(payload);
      if (error) {
        setSubmitError("견적 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        setSubmitting(false);
        return;
      }

      setQuoteCount(currentCount + 1);
      setSubmitted(true);
    } catch {
      setSubmitError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  const weeksNum = Number(weeks) || 0;
  const selectedCourse =
    selectedAcademy && courseIndex !== ""
      ? selectedAcademy.courses[courseIndex]
      : null;
  const selectedDorm =
    selectedAcademy && dormIndex !== ""
      ? selectedAcademy.dormitories[dormIndex]
      : null;

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 7);

  const endDate =
    startDate && weeksNum > 0
      ? new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate() + weeksNum * 7,
        )
      : null;

  if (academiesLoading) {
    return (
      <div className="bg-cream min-h-screen">
        <Navbar />
        <div className="pt-[140px] pb-20 px-6">
          <div className="max-w-[520px] mx-auto text-center">
            <p className="text-brown text-[0.9rem]">어학원 정보를 불러오는 중...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (quoteLimitReached && !submitted) {
    return (
      <div className="bg-cream min-h-screen">
        <Navbar />
        <div className="pt-[140px] pb-20 px-6">
          <div className="max-w-[520px] mx-auto text-center">
            <div className="bg-white rounded-[20px] p-10 border border-beige-dark shadow-lg">
              <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="text-2xl">&#128274;</span>
              </div>
              <h2 className="text-[1.5rem] font-extrabold text-brown-dark mb-3">
                견적 조회 3/3회를 모두 사용하셨습니다
              </h2>
              <p className="text-brown text-[0.9rem] leading-relaxed mb-6">
                더 자세한 맞춤 상담을 받아보세요.
                <br />
                카카오톡으로 1:1 상담을 진행해드립니다.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="secondary" asChild>
                  <Link to="/" className="no-underline">홈으로</Link>
                </Button>
                <Button asChild>
                  <a
                    href="https://pf.kakao.com/_placeholder"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline"
                  >
                    카카오톡 상담하기
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-cream min-h-screen">
        <Navbar />
        <div className="pt-[140px] pb-20 px-6">
          <div className="max-w-[520px] mx-auto text-center">
            <div className="bg-white rounded-[20px] p-10 border border-beige-dark shadow-lg">
              <div className="w-16 h-16 bg-accent-green-light rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckIcon className="w-8 h-8 text-accent-green" strokeWidth={2.5} />
              </div>
              <h2 className="text-[1.5rem] font-extrabold text-brown-dark mb-3">
                견적 요청이 완료되었습니다
              </h2>
              <p className="text-brown text-[0.9rem] leading-relaxed mb-2">
                <span className="font-bold text-brown-dark">{email}</span>으로
                <br />
                견적서를 보내드리겠습니다.
              </p>
              <p className="text-brown-light text-[0.82rem] mb-4">
                보통 1~2 영업일 이내에 회신드립니다.
              </p>
              {quoteCount !== null && (
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 bg-cream border border-beige-dark rounded-full px-4 py-2 text-[0.82rem]">
                    <span className="text-brown">견적 조회</span>
                    <span className="font-bold text-brown-dark">{quoteCount}/3</span>
                    <span className="text-brown">회 사용</span>
                  </div>
                  {quoteCount >= 3 && (
                    <p className="text-terracotta text-[0.75rem] mt-2">
                      다음부터는 카카오톡 상담을 이용해주세요.
                    </p>
                  )}
                </div>
              )}
              <div className="flex gap-3 justify-center">
                <Button variant="secondary" asChild>
                  <Link to="/" className="no-underline">홈으로</Link>
                </Button>
                <Button
                  onClick={() => {
                    setSubmitted(false);
                    setEmail("");
                    setName("");
                    setAcademyId("");
                    setCourseIndex("");
                    setStartDate(undefined);
                    setWeeks("");
                    setDormIndex("");
                    setErrors({});
                  }}
                >
                  새 견적 요청
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      {/* Breadcrumb */}
      <div className="pt-20 bg-white border-b border-beige-dark">
        <div className="max-w-[1200px] mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-brown">
            <Link to="/" className="hover:text-brown-dark no-underline text-brown">
              홈
            </Link>
            <span>/</span>
            <span className="text-brown-dark font-medium">견적 요청</span>
          </div>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[20px] p-6 md:p-8 border border-beige-dark">
              <h1 className="text-[1.5rem] md:text-[1.8rem] font-extrabold text-brown-dark tracking-tight mb-1">
                무료 견적 요청
              </h1>
              <p className="text-brown text-[0.9rem] mb-8">
                어학원과 코스를 선택하면 맞춤 견적서를 이메일로 보내드립니다.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* 이름 */}
                <div className="space-y-1.5">
                  <Label className="text-brown-dark font-semibold">
                    이름 <span className="text-terracotta">*</span>
                  </Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="홍길동"
                    aria-invalid={!!errors.name}
                    className="h-11 rounded-[10px]"
                  />
                  {errors.name && (
                    <p className="text-terracotta text-[0.75rem]">{errors.name}</p>
                  )}
                </div>

                {/* 이메일 */}
                <div className="space-y-1.5">
                  <Label className="text-brown-dark font-semibold">
                    이메일 <span className="text-terracotta">*</span>
                  </Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleEmailBlur}
                    placeholder="example@email.com"
                    aria-invalid={!!errors.email}
                    className="h-11 rounded-[10px]"
                  />
                  {errors.email && (
                    <p className="text-terracotta text-[0.75rem]">{errors.email}</p>
                  )}
                  {quoteLimitReached && (
                    <p className="text-terracotta text-[0.75rem]">
                      무료 견적 조회 3회를 모두 사용하셨습니다. 카카오톡 상담을 이용해주세요.
                    </p>
                  )}
                </div>

                {/* 어학원 - Combobox */}
                <div className="space-y-1.5">
                  <Label className="text-brown-dark font-semibold">
                    관심 어학원 <span className="text-terracotta">*</span>
                  </Label>
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
                              {selectedAcademy.region} · {selectedAcademy.style}
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
                            {academies.map((a) => (
                              <CommandItem
                                key={a.id}
                                value={`${a.name} ${a.region} ${a.style}`}
                                onSelect={() => {
                                  setAcademyId(a.id);
                                  setAcademyOpen(false);
                                }}
                                className="flex flex-col items-start gap-1 py-2.5"
                              >
                                <div className="flex items-center gap-2 w-full">
                                  <CheckIcon
                                    className={cn(
                                      "h-4 w-4 shrink-0",
                                      academyId === a.id ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  <span className="font-medium">{a.name}</span>
                                  <span className="text-[0.75rem] text-muted-foreground">
                                    {a.region} · {a.style}
                                  </span>
                                </div>
                                <div className="flex gap-1 ml-6">
                                  {a.tags.map((tag) => (
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
                  {errors.academy && (
                    <p className="text-terracotta text-[0.75rem]">{errors.academy}</p>
                  )}
                </div>

                {/* 코스 */}
                <div className="space-y-1.5">
                  <Label className="text-brown-dark font-semibold">
                    코스 <span className="text-terracotta">*</span>
                  </Label>
                  {selectedAcademy ? (
                    <div className="space-y-2">
                      {selectedAcademy.courses.map((c, i) => (
                        <button
                          type="button"
                          key={c.name}
                          onClick={() => setCourseIndex(i)}
                          className={cn(
                            "w-full text-left p-3.5 rounded-[10px] border transition-all",
                            courseIndex === i
                              ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                              : "border-input bg-white hover:border-muted-foreground/30",
                          )}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-brown-dark">
                              {c.name}
                            </span>
                            <span className="px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded text-[0.65rem] font-medium">
                              {c.category}
                            </span>
                            {courseIndex === i && (
                              <CheckIcon className="h-4 w-4 text-primary ml-auto" />
                            )}
                          </div>
                          <p className="text-[0.78rem] text-muted-foreground">{c.desc}</p>
                          <div className="flex gap-1.5 mt-1.5 text-[0.7rem]">
                            <span className="px-1.5 py-0.5 bg-cream border border-input rounded">
                              1:1 {c.manToMan}시간
                            </span>
                            <span className="px-1.5 py-0.5 bg-cream border border-input rounded">
                              그룹 {c.group}시간
                            </span>
                            {c.optional > 0 && (
                              <span className="px-1.5 py-0.5 bg-cream border border-input rounded">
                                선택 {c.optional}시간
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
                  {errors.course && (
                    <p className="text-terracotta text-[0.75rem]">{errors.course}</p>
                  )}
                </div>

                {/* 수업 시작 희망일 - Calendar Popover */}
                <div className="space-y-1.5">
                  <Label className="text-brown-dark font-semibold">
                    수업 시작 희망일 <span className="text-terracotta">*</span>
                  </Label>
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
                          setStartDate(date);
                          setCalendarOpen(false);
                        }}
                        disabled={(date) => date < minDate}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.startDate && (
                    <p className="text-terracotta text-[0.75rem]">{errors.startDate}</p>
                  )}
                  <p className="text-[0.72rem] text-muted-foreground">
                    대부분의 어학원은 매주 월요일 입학이 가능합니다.
                  </p>
                </div>

                {/* 주수 */}
                <div className="space-y-1.5">
                  <Label className="text-brown-dark font-semibold">
                    연수 기간 (주) <span className="text-terracotta">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={weeks}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^0-9]/g, "");
                        setWeeks(v);
                      }}
                      placeholder="예: 8"
                      aria-invalid={!!errors.weeks}
                      className="h-11 rounded-[10px] pr-10"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                      주
                    </span>
                  </div>
                  {errors.weeks && (
                    <p className="text-terracotta text-[0.75rem]">{errors.weeks}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    {[4, 8, 12, 16, 24].map((w) => (
                      <Button
                        type="button"
                        key={w}
                        variant={weeks === String(w) ? "default" : "secondary"}
                        size="sm"
                        className="rounded-full"
                        onClick={() => setWeeks(String(w))}
                      >
                        {w}주
                      </Button>
                    ))}
                  </div>
                </div>

                {/* 기숙사 */}
                <div className="space-y-1.5">
                  <Label className="text-brown-dark font-semibold">
                    기숙사 타입 <span className="text-terracotta">*</span>
                  </Label>
                  {selectedAcademy ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {selectedAcademy.dormitories.map((d, i) => (
                        <button
                          type="button"
                          key={d.type}
                          onClick={() => setDormIndex(i)}
                          className={cn(
                            "p-3.5 rounded-[10px] border transition-all text-center",
                            dormIndex === i
                              ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                              : "border-input bg-white hover:border-muted-foreground/30",
                          )}
                        >
                          <div className="font-bold text-brown-dark text-sm">
                            {d.type}
                          </div>
                          <div className="text-[0.7rem] text-muted-foreground mt-1">
                            {d.meals}
                          </div>
                          <div className="text-[0.65rem] text-muted-foreground/70 mt-0.5">
                            {d.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full bg-secondary border border-input rounded-[10px] px-4 py-3 text-sm text-muted-foreground">
                      어학원을 먼저 선택해주세요
                    </div>
                  )}
                  {errors.dorm && (
                    <p className="text-terracotta text-[0.75rem]">{errors.dorm}</p>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 text-base rounded-[10px]"
                  disabled={submitting || quoteLimitReached}
                >
                  {submitting ? "요청 중..." : quoteLimitReached ? "견적 조회 한도 초과" : "견적서 요청하기"}
                </Button>
                {submitError && (
                  <p className="text-terracotta text-[0.8rem] text-center">{submitError}</p>
                )}
              </form>
            </div>
          </div>

          {/* Right: Summary (Sticky) */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-[20px] p-6 border border-beige-dark shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent-green" />
                <h3 className="font-bold text-brown-dark text-lg mb-5">
                  요청 요약
                </h3>

                {selectedAcademy ? (
                  <div className="space-y-4">
                    <div>
                      <div className="text-[0.75rem] text-muted-foreground mb-1">어학원</div>
                      <div className="font-bold text-brown-dark">{selectedAcademy.name}</div>
                      <div className="text-[0.75rem] text-muted-foreground">
                        {selectedAcademy.region} · {selectedAcademy.style}
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
                            {endDate && (
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
                        {weeksNum > 0 && (
                          <div className="text-[0.75rem] text-muted-foreground">{weeksNum}주</div>
                        )}
                      </div>
                    )}

                    {selectedDorm && (
                      <div>
                        <div className="text-[0.75rem] text-muted-foreground mb-1">기숙사</div>
                        <div className="font-bold text-brown-dark">{selectedDorm.type}</div>
                      </div>
                    )}

                    {selectedCourse && selectedDorm && weeksNum > 0 && (
                      <div className="pt-4 border-t border-beige-dark">
                        <div className="text-[0.75rem] text-muted-foreground mb-1">참고 견적가</div>
                        <div className="font-bold text-brown-dark text-lg">
                          ${((selectedCourse.pricePerWeek + selectedDorm.pricePerWeek) * weeksNum).toLocaleString()}
                        </div>
                        <div className="text-[0.68rem] text-muted-foreground mt-1">
                          USD 기준 · 참고가이며, 정확한 할인 금액은 상담 후 안내드립니다.
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

                <div className="mt-6 p-3 bg-accent rounded-[10px]">
                  <p className="text-[0.75rem] text-accent-foreground leading-relaxed">
                    실제 견적은 프로모션, 등록비, SSP, 비자 연장비 등을 포함하여
                    이메일로 상세히 안내드립니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
