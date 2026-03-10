import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { CalendarIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Academy } from "@/data/academies";
import type { EnrollmentFormValues } from "../enrollmentSchema";

interface StepCourseSelectProps {
  academy: Academy | undefined; // 1단계에서 선택된 어학원
}

// 수속 신청 2단계: 코스·기숙사·일정 선택
// 어학원 미선택 시 코스·기숙사 영역 비활성화 안내 표시
export default function StepCourseSelect({ academy }: StepCourseSelectProps) {
  const { watch, setValue, formState: { errors } } = useFormContext<EnrollmentFormValues>();
  const [calendarOpen, setCalendarOpen] = useState(false); // 날짜 선택 달력 열림/닫힘

  const courseIndex = watch("courseIndex");
  const dormIndex = watch("dormIndex");
  const weeks = watch("weeks");
  const startDate = watch("startDate");

  // 수업 시작 가능한 최소 날짜: 오늘로부터 7일 후
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 7);

  return (
    <div className="space-y-5">
      {/* 코스 선택 */}
      <div className="space-y-1.5">
        <label className="text-brown-dark font-semibold text-sm required">코스</label>
        {academy ? (
          <div className="space-y-2">
            {academy.courses.map((course, index) => (
              <button
                type="button"
                key={course.name}
                onClick={() => setValue("courseIndex", index, { shouldValidate: true })}
                className={cn(
                  "w-full text-left p-3.5 rounded-[10px] border transition-all",
                  courseIndex === index
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"   // 선택됨
                    : "border-input bg-white hover:border-muted-foreground/30" // 미선택
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-brown-dark">{course.name}</span>
                  <span className="px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded text-[0.65rem] font-medium">
                    {course.category}
                  </span>
                  {courseIndex === index && (
                    <CheckIcon className="h-4 w-4 text-primary ml-auto" />
                  )}
                </div>
                <p className="text-[0.78rem] text-muted-foreground">{course.desc}</p>
                {/* 수업 구성: 1:1, 그룹, 선택 수업 시간 */}
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

      {/* 기숙사 타입 선택 */}
      <div className="space-y-1.5">
        <label className="text-brown-dark font-semibold text-sm required">기숙사 타입</label>
        {academy ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {academy.dormitories.map((dorm, index) => (
              <button
                type="button"
                key={dorm.type}
                onClick={() => setValue("dormIndex", index, { shouldValidate: true })}
                className={cn(
                  "p-3.5 rounded-[10px] border transition-all text-center",
                  dormIndex === index
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"   // 선택됨
                    : "border-input bg-white hover:border-muted-foreground/30" // 미선택
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

      {/* 수업 시작 희망일 선택 */}
      <div className="space-y-1.5">
        <label className="text-brown-dark font-semibold text-sm required">수업 시작 희망일</label>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start h-11 rounded-[10px] font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate
                ? startDate.toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "short", // 요일 포함 (예: "2024년 3월 4일 (월)")
                  })
                : "날짜를 선택해주세요"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => {
                setValue("startDate", date as Date, { shouldValidate: true });
                setCalendarOpen(false); // 날짜 선택 후 달력 닫기
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

      {/* 연수 기간 입력 */}
      <div className="space-y-1.5">
        <label className="text-brown-dark font-semibold text-sm required">연수 기간 (주)</label>
        <div className="relative">
          <Input
            type="text"
            inputMode="numeric" // 모바일에서 숫자 키패드
            value={weeks}
            onChange={(event) => {
              const value = event.target.value.replace(/[^0-9]/g, ""); // 숫자만 허용
              setValue("weeks", value);
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

        {/* 자주 선택하는 기간 퀵 버튼 */}
        <div className="flex gap-2 mt-2">
          {[4, 8, 12, 16, 24].map((weekOption) => (
            <Button
              type="button"
              key={weekOption}
              variant={weeks === String(weekOption) ? "default" : "secondary"} // 현재 입력값과 동일하면 강조
              size="sm"
              className="rounded-full"
              onClick={() => setValue("weeks", String(weekOption))}
            >
              {weekOption}주
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
