
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
    return (
      <div
        ref={ref}
        className={cn("relative flex w-full items-start justify-between", className)}
        {...props}
      >
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isUpcoming = stepNumber > currentStep

          return (
            <React.Fragment key={step.name}>
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold bg-background",
                    isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : "",
                    isCurrent
                      ? "border-primary text-primary"
                      : "",
                    isUpcoming
                      ? "border-muted-foreground/30 text-muted-foreground/50"
                      : ""
                  )}
                >
                  {stepNumber}
                </div>
                <p className={cn(
                  "text-center text-xs max-w-[80px]",
                  isCurrent ? "font-bold text-primary" : "text-muted-foreground"
                )}>
                  {step.name}
                </p>
              </div>
            </React.Fragment>
          )
        })}
        <div className="absolute top-4 left-0 w-full h-0.5 -z-1">
          <div className="w-full h-full bg-muted-foreground/30"></div>
          <div 
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    )
  }
)
StepProgress.displayName = "StepProgress"

export { StepProgress }
