import { useState } from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
import type { Academy } from "@/data/academies";

interface StepAcademySelectProps {
  academies: Academy[];
  academyId: string;
  onSelect: (id: string) => void;
  error?: string;
}

export default function StepAcademySelect({
  academies,
  academyId,
  onSelect,
  error,
}: StepAcademySelectProps) {
  const [open, setOpen] = useState(false);
  const selected = academies.find((academy) => academy.id === academyId);

  return (
    <div className="space-y-1.5">
      <label className="text-brown-dark font-semibold text-sm">
        어학원 선택 <span className="text-terracotta">*</span>
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between h-11 rounded-[10px] font-normal",
              !academyId && "text-muted-foreground"
            )}
          >
            {selected ? (
              <span>
                {selected.name}
                <span className="ml-2 text-muted-foreground text-[0.75rem]">
                  {selected.region} · {selected.style}
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
                {academies.map((academy) => (
                  <CommandItem
                    key={academy.id}
                    value={`${academy.name} ${academy.region} ${academy.style}`}
                    onSelect={() => {
                      onSelect(academy.id);
                      setOpen(false);
                    }}
                    className="flex flex-col items-start gap-1 py-2.5"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <CheckIcon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          academyId === academy.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="font-medium">{academy.name}</span>
                      <span className="text-[0.75rem] text-muted-foreground">
                        {academy.region} · {academy.style}
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
      {error && <p className="text-terracotta text-[0.75rem]">{error}</p>}
    </div>
  );
}
