import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import type { Academy } from "@/data/academies";
import type { EnrollmentFormValues } from "../enrollmentSchema";

interface StepAcademySelectProps {
  academies: Academy[];
}

// 수속 신청 1단계: 드롭다운 검색(Combobox)으로 어학원 선택
export default function StepAcademySelect({ academies }: StepAcademySelectProps) {
  const { watch, setValue, formState: { errors } } = useFormContext<EnrollmentFormValues>();
  const [open, setOpen] = useState(false); // 드롭다운 열림/닫힘

  const academyId = watch("academyId");
  const selected = academies.find((academy) => academy.id === academyId); // 선택된 어학원 (버튼 표시용)

  return (
    <div className="space-y-1.5">
      <div className="my-3">
        <label className="text-brown-dark font-semibold text-sm required mb-2">어학원 선택</label>
      </div>

      {/* Combobox 패턴: Popover + Command */}
      <Popover open={open} onOpenChange={setOpen}>
        {/* 선택된 어학원이 있으면 이름 표시, 없으면 플레이스홀더 */}
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between h-11 rounded-[10px] font-normal",
              !academyId && "text-muted-foreground",
            )}
          >
            {selected ? (
              <span>
                {selected.name}
                <span className="ml-2 text-muted-foreground text-[0.75rem]">
                  {selected.region} · {selected.academy_system}
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
            {/* 이름·지역·시스템 통합 검색 */}
            <CommandInput placeholder="어학원 검색..." />
            <CommandList>
              <CommandEmpty>검색 결과가 없습니다</CommandEmpty>
              <CommandGroup>
                {academies.map((academy) => (
                  <CommandItem
                    key={academy.id}
                    value={`${academy.name} ${academy.region} ${academy.academy_system}`} // 검색 시 이름·지역·시스템 모두 매칭
                    onSelect={() => {
                      setValue("academyId", academy.id, { shouldValidate: true });
                      setOpen(false); // 선택 후 드롭다운 닫기
                    }}
                    className="flex flex-col items-start gap-1 py-2.5"
                  >
                    <div className="flex items-center gap-2 w-full">
                      {/* 현재 선택된 어학원에만 체크 아이콘 */}
                      <CheckIcon
                        className={cn("h-4 w-4 shrink-0", academyId === academy.id ? "opacity-100" : "opacity-0")}
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
  );
}
