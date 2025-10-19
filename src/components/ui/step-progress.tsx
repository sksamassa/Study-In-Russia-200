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
        className={cn("flex w-full items-start justify-center", className)}
        {...props}
      >
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isUpcoming = stepNumber > currentStep

          return (
            <React.Fragment key={step.name}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold",
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
                  "text-center text-xs",
                  isCurrent ? "font-bold text-primary" : "text-muted-foreground"
                )}>
                  {step.name}
                </p>
              </div>
              {stepNumber < steps.length && (
                <div
                  className={cn(
                    "h-0.5 flex-1 translate-y-3.5",
                    stepNumber < currentStep ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    )
  }
)
StepProgress.displayName = "StepProgress"

export { StepProgress }
