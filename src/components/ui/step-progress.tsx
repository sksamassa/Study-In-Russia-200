
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface Step {
  name: string;
}

interface StepProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  highestCompletedStep?: number;
}

const StepProgress = React.forwardRef<HTMLDivElement, StepProgressProps>(
  ({ className, steps, currentStep, onStepClick, highestCompletedStep = 0, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <div className="relative flex items-start justify-between">
          {/* Background line */}
          <div
            className="absolute top-4 h-0.5 bg-muted-foreground/30"
            style={{ left: "16px", width: "calc(100% - 32px)" }}
          />
          {/* Progress line */}
          <div
            className="absolute top-4 h-0.5 bg-primary transition-all duration-300"
            style={{
              left: "16px",
              width: `calc(${
                (highestCompletedStep) / (steps.length - 1)
              } * (100% - 32px))`,
            }}
          />
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber <= highestCompletedStep;
            const isCurrent = stepNumber === currentStep;
            const isClickable = onStepClick && stepNumber <= highestCompletedStep + 1 && stepNumber < steps.length;


            const StepWrapper = isClickable ? 'button' : 'div';

            return (
              <StepWrapper
                key={step.name}
                onClick={isClickable ? () => onStepClick(index) : undefined}
                className={cn("relative z-10 flex flex-col items-center gap-2", isClickable ? "cursor-pointer" : "cursor-default")}
                disabled={!isClickable}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold bg-background transition-colors duration-300",
                    isCompleted && !isCurrent
                      ? "border-primary bg-primary text-primary-foreground"
                      : isCurrent
                      ? "border-primary text-primary"
                      : "border-muted-foreground/30 text-muted-foreground/50",
                    isClickable && "hover:border-primary/70"
                  )}
                >
                  {stepNumber}
                </div>
                <p
                  className={cn(
                    "text-center text-xs max-w-[80px] transition-colors duration-300",
                    isCurrent
                      ? "font-bold text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {step.name}
                </p>
              </StepWrapper>
            );
          })}
        </div>
      </div>
    );
  }
);
StepProgress.displayName = "StepProgress";

export { StepProgress };
