import { useState } from "react";
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

interface StepCourseSelectProps {
  academy: Academy | undefined;
  courseIndex: number | "";
  onCourseSelect: (index: number) => void;
  dormIndex: number | "";
  onDormSelect: (index: number) => void;
  weeks: string;
  onWeeksChange: (weeks: string) => void;
  startDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  errors: Record<string, string>;
}

export default function StepCourseSelect({
  academy,
  courseIndex,
  onCourseSelect,
  dormIndex,
  onDormSelect,
  weeks,
  onWeeksChange,
  startDate,
  onStartDateChange,
  errors,
}: StepCourseSelectProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

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
                onClick={() => onCourseSelect(index)}
                className={cn(
                  "w-full text-left p-3.5 rounded-[10px] border transition-all",
                  courseIndex === index
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-input bg-white hover:border-muted-foreground/30"
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
        {errors.course && <p className="text-terracotta text-[0.75rem]">{errors.course}</p>}
      </div>

      {/* 기숙사 선택 */}
      <div className="space-y-1.5">
        <label className="text-brown-dark font-semibold text-sm required">기숙사 타입</label>
        {academy ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {academy.dormitories.map((dorm, index) => (
              <button
                type="button"
                key={dorm.type}
                onClick={() => onDormSelect(index)}
                className={cn(
                  "p-3.5 rounded-[10px] border transition-all text-center",
                  dormIndex === index
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-input bg-white hover:border-muted-foreground/30"
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
        {errors.dorm && <p className="text-terracotta text-[0.75rem]">{errors.dorm}</p>}
      </div>

      {/* 수업 시작일 */}
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
                onStartDateChange(date);
                setCalendarOpen(false);
              }}
              disabled={(date) => date < minDate}
            />
          </PopoverContent>
        </Popover>
        {errors.startDate && <p className="text-terracotta text-[0.75rem]">{errors.startDate}</p>}
        <p className="text-[0.72rem] text-muted-foreground">
          대부분의 어학원은 매주 월요일 입학이 가능합니다.
        </p>
      </div>

      {/* 연수 기간 */}
      <div className="space-y-1.5">
        <label className="text-brown-dark font-semibold text-sm required">연수 기간 (주)</label>
        <div className="relative">
          <Input
            type="text"
            inputMode="numeric"
            value={weeks}
            onChange={(event) => {
              const value = event.target.value.replace(/[^0-9]/g, "");
              onWeeksChange(value);
            }}
            placeholder="예: 8"
            aria-invalid={!!errors.weeks}
            className="h-11 rounded-[10px] pr-10"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
            주
          </span>
        </div>
        {errors.weeks && <p className="text-terracotta text-[0.75rem]">{errors.weeks}</p>}
        <div className="flex gap-2 mt-2">
          {[4, 8, 12, 16, 24].map((weekOption) => (
            <Button
              type="button"
              key={weekOption}
              variant={weeks === String(weekOption) ? "default" : "secondary"}
              size="sm"
              className="rounded-full"
              onClick={() => onWeeksChange(String(weekOption))}
            >
              {weekOption}주
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
