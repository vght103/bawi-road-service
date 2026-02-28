import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

interface EnrollmentStepperProps {
  currentStep: number;
  steps: { label: string; description: string }[];
}

export default function EnrollmentStepper({ currentStep, steps }: EnrollmentStepperProps) {
  return (
    <div className="relative flex items-start justify-between mb-8">
      {/* 연결선 배경 */}
      <div className="absolute top-[18px] left-0 right-0 mx-[calc(100%/6)] h-0.5 bg-secondary" />
      {/* 연결선 진행 */}
      {currentStep > 0 && (
        <div
          className="absolute top-[18px] left-0 mx-[calc(100%/6)] h-0.5 bg-primary transition-all"
          style={{
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
                ? "bg-primary text-white"
                : index === currentStep
                  ? "bg-primary text-white ring-4 ring-primary/20"
                  : "bg-secondary text-muted-foreground"
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
            <p className="text-[0.65rem] text-muted-foreground hidden sm:block">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
