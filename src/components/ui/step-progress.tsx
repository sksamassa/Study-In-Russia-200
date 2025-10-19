
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface Step {
  name: string;
}

interface StepProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: Step[]
  currentStep: number
}

const StepProgress = React.forwardRef<HTMLDivElement, StepProgressProps>(
  ({ className, steps, currentStep, ...props }, ref) => {
    const totalSteps = steps.length;
    const progressPercentage = totalSteps > 1 ? ((currentStep - 1) / (totalSteps - 1)) * 100 : 0;

    return (
      <div
        ref={ref}
        className={cn("relative w-full", className)}
        {...props}
      >
        <div className="relative flex justify-between items-start">
          <div className="absolute top-4 left-0 w-full h-0.5 -translate-y-1/2 px-4">
              <div className="w-full h-full bg-muted-foreground/30 relative">
                  <div 
                    className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
              </div>
          </div>

            {steps.map((step, index) => {
            const stepNumber = index + 1
            const isCompleted = stepNumber < currentStep
            const isCurrent = stepNumber === currentStep

            return (
                <div key={step.name} className="relative z-10 flex flex-col items-center gap-2">
                    <div
                    className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold bg-background transition-colors duration-300",
                        isCompleted
                        ? "border-primary bg-primary text-primary-foreground"
                        : isCurrent
                        ? "border-primary text-primary"
                        : "border-muted-foreground/30 text-muted-foreground/50"
                    )}
                    >
                    {stepNumber}
                    </div>
                    <p className={cn(
                    "text-center text-xs max-w-[80px] transition-colors duration-300",
                    isCurrent ? "font-bold text-primary" : "text-muted-foreground"
                    )}>
                    {step.name}
                    </p>
                </div>
            )
            })}
        </div>
      </div>
    )
  }
)
StepProgress.displayName = "StepProgress"

export { StepProgress }
