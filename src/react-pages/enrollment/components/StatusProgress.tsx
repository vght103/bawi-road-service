import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EnrollmentStatus } from "@/types/enrollment";
import { STATUS_CONFIG, STATUS_STEPS } from "@/data/enrollment/status";

interface StatusProgressProps {
  currentStatus: EnrollmentStatus;
}

// 수속 진행 상태를 단계별로 시각화하는 컴포넌트
// CANCELLED인 경우 단계 대신 취소 안내 메시지만 표시
export default function StatusProgress({ currentStatus }: StatusProgressProps) {
  if (currentStatus === "CANCELLED") {
    return (
      <div className="rounded-[10px] border border-red-200 bg-red-50 p-4 text-center">
        <p className="text-red-700 font-semibold">수속이 취소되었습니다</p>
        <p className="text-red-600 text-sm mt-1">{STATUS_CONFIG.CANCELLED.description}</p>
      </div>
    );
  }

  const currentOrder = STATUS_CONFIG[currentStatus].order; // 진행선 너비 계산에 사용

  return (
    <div className="space-y-4">
      <div className="relative flex items-start justify-between">
        {/* 전체 연결선 배경 (회색) */}
        <div className="absolute top-5 left-0 right-0 mx-[calc(100%/8)] h-0.5 bg-secondary" />

        {/* 진행된 부분 연결선 (주색상) */}
        <div
          className="absolute top-5 left-0 mx-[calc(100%/8)] h-0.5 bg-primary transition-all"
          style={{
            width: currentOrder >= STATUS_STEPS.length - 1
              ? `calc(100% - 100%/4)`
              : `calc(${(currentOrder / (STATUS_STEPS.length - 1)) * 100}% * (1 - 1/${STATUS_STEPS.length}) + 0%)`,
          }}
        />

        {STATUS_STEPS.map((step, index) => {
          const config = STATUS_CONFIG[step];
          const isCompleted = config.order < currentOrder; // 현재보다 이전 단계
          const isCurrent = step === currentStatus;

          return (
            <div key={step} className="relative z-10 flex flex-col items-center" style={{ width: `${100 / STATUS_STEPS.length}%` }}>
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
                  isCompleted
                    ? "bg-primary text-white"                         // 완료
                    : isCurrent
                      ? "bg-primary text-white ring-4 ring-primary/20"  // 현재 (링 강조)
                      : "bg-secondary text-muted-foreground"             // 미진행
                )}
              >
                {isCompleted ? <CheckIcon className="w-5 h-5" /> : index + 1}
              </div>

              {/* 현재/완료 단계는 진한 색, 미진행은 흐린 색 */}
              <p
                className={cn(
                  "mt-2 text-xs font-medium text-center leading-tight",
                  isCompleted || isCurrent ? "text-brown-dark" : "text-muted-foreground"
                )}
              >
                {config.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* 현재 상태 설명 박스 */}
      <div className={cn("rounded-[10px] border p-4", STATUS_CONFIG[currentStatus].bgColor)}>
        <p className={cn("font-semibold text-sm", STATUS_CONFIG[currentStatus].color)}>
          {STATUS_CONFIG[currentStatus].label}
        </p>
        <p className="text-sm text-brown mt-1">{STATUS_CONFIG[currentStatus].description}</p>
      </div>
    </div>
  );
}
