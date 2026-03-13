import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

interface EnrollmentStepperProps {
  currentStep: number; // 현재 활성 단계 번호 (0부터 시작)
  steps: { label: string; description: string }[];
}

// 수속 신청 폼의 진행 단계를 시각적으로 표시하는 스테퍼
// 완료 단계: 체크 아이콘, 현재 단계: 링 강조, 미완료 단계: 회색
export default function EnrollmentStepper({ currentStep, steps }: EnrollmentStepperProps) {
  return (
    <div className="relative flex items-start justify-between mb-8">
      {/* 전체 연결선 배경 (회색) — 원의 중앙 높이(top-[18px])에 위치 */}
      <div className="absolute top-[18px] left-0 right-0 mx-[calc(100%/6)] h-0.5 bg-secondary" />

      {/* 진행된 부분 연결선 (주색상) */}
      {currentStep > 0 && (
        <div
          className="absolute top-[18px] left-0 mx-[calc(100%/6)] h-0.5 bg-primary transition-all"
          style={{
            // 마지막 단계: 전체 너비, 중간 단계: 비율에 따라 조절
            width: currentStep >= steps.length - 1
              ? `calc(100% - 100%/3)`
              : `calc(${(currentStep / (steps.length - 1)) * 100}% * (1 - 1/${steps.length}))`,
          }}
        />
      )}

      {steps.map((step, index) => (
        <div key={step.label} className="relative z-10 flex flex-col items-center" style={{ width: `${100 / steps.length}%` }}>
          <div
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all",
              index < currentStep
                ? "bg-primary text-white"                        // 완료
                : index === currentStep
                  ? "bg-primary text-white ring-4 ring-primary/20" // 현재 (링 강조)
                  : "bg-secondary text-muted-foreground"            // 미완료
            )}
          >
            {index < currentStep ? (
              <CheckIcon className="w-5 h-5" />
            ) : (
              index + 1
            )}
          </div>

          <div className="mt-2 text-center">
            <p
              className={cn(
                "text-xs font-medium leading-tight",
                index <= currentStep ? "text-brown-dark" : "text-muted-foreground"
              )}
            >
              {step.label}
            </p>
            {/* 설명은 sm 미만에서 숨김 */}
            <p className="text-[0.65rem] text-muted-foreground hidden sm:block">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
