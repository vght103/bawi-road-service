import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EnrollmentStatus } from "@/types/enrollment";
import { STATUS_CONFIG, STATUS_STEPS } from "@/data/enrollment/status";

interface StatusProgressProps {
  currentStatus: EnrollmentStatus;
}

export default function StatusProgress({ currentStatus }: StatusProgressProps) {
  if (currentStatus === "CANCELLED") {
    return (
      <div className="rounded-[10px] border border-red-200 bg-red-50 p-4 text-center">
        <p className="text-red-700 font-semibold">수속이 취소되었습니다</p>
        <p className="text-red-600 text-sm mt-1">{STATUS_CONFIG.CANCELLED.description}</p>
      </div>
    );
  }

  const currentOrder = STATUS_CONFIG[currentStatus].order;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-0">
        {STATUS_STEPS.map((step, index) => {
          const config = STATUS_CONFIG[step];
          const isCompleted = config.order < currentOrder;
          const isCurrent = step === currentStatus;

          return (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                    isCompleted
                      ? "bg-primary text-white"
                      : isCurrent
                        ? "bg-primary text-white ring-4 ring-primary/20"
                        : "bg-secondary text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <p
                  className={cn(
                    "mt-2 text-xs font-medium text-center",
                    isCompleted || isCurrent ? "text-brown-dark" : "text-muted-foreground"
                  )}
                >
                  {config.label}
                </p>
              </div>
              {index < STATUS_STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-1 mt-[-1.5rem]",
                    isCompleted ? "bg-primary" : "bg-secondary"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Current status description */}
      <div className={cn("rounded-[10px] border p-4", STATUS_CONFIG[currentStatus].bgColor)}>
        <p className={cn("font-semibold text-sm", STATUS_CONFIG[currentStatus].color)}>
          {STATUS_CONFIG[currentStatus].label}
        </p>
        <p className="text-sm text-brown mt-1">{STATUS_CONFIG[currentStatus].description}</p>
      </div>
    </div>
  );
}
