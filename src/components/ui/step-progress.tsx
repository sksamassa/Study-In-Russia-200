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
        className={cn("w-full", className)}
        {...props}
      >
        <div className="relative flex items-start justify-between">
          <div className="absolute left-0 top-4 h-0.5 w-full bg-muted-foreground/30" />
          <div
            className="absolute left-0 top-4 h-0.5 bg-primary transition-all duration-300"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
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
