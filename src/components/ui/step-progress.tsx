"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface StepProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  totalSteps: number
  currentStep: number
}

const StepProgress = React.forwardRef<HTMLDivElement, StepProgressProps>(
  ({ className, totalSteps, currentStep, ...props }, ref) => {
    const steps = Array.from({ length: totalSteps }, (_, i) => i + 1)

    return (
      <div
        ref={ref}
        className={cn("flex w-full items-center", className)}
        {...props}
      >
        {steps.map((step) => {
          const isCompleted = step < currentStep
          const isCurrent = step === currentStep
          const isUpcoming = step > currentStep

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
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
                  {step}
                </div>
              </div>
              {step < steps.length && (
                <div
                  className={cn(
                    "h-0.5 flex-1",
                    step < currentStep ? "bg-primary" : "bg-muted-foreground/30"
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
