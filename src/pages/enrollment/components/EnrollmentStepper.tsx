import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

interface EnrollmentStepperProps {
  currentStep: number;
  steps: { label: string; description: string }[];
}

export default function EnrollmentStepper({ currentStep, steps }: EnrollmentStepperProps) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
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
                  "text-xs font-medium",
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
          {index < steps.length - 1 && (
            <div
              className={cn(
                "h-0.5 flex-1 mx-2 mt-[-1.5rem]",
                index < currentStep ? "bg-primary" : "bg-secondary"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
