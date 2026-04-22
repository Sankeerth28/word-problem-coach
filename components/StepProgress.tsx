"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { STEP_ORDER } from "@/lib/constants"
import type { ProblemStep } from "@/lib/types"
import { getStepTitle } from "@/lib/utils"

interface StepProgressProps {
  currentStep: ProblemStep
  completedSteps: ProblemStep[]
}

const stepIcons: Record<ProblemStep, string> = {
  quantities: '📋',
  unknown: '🎯',
  operations: '🔗',
  equation: '✏️',
  complete: '🎉',
}

export function StepProgress({ currentStep, completedSteps }: StepProgressProps) {
  const stepOrder = STEP_ORDER as readonly string[]
  const currentIndex = stepOrder.indexOf(currentStep)

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-2 bg-gray-200 rounded-full" />
        </div>
        <motion.div
          className="absolute inset-0 flex items-center"
          initial={{ width: '0%' }}
          animate={{
            width: `${(currentIndex / (stepOrder.length - 1)) * 100}%`
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="h-2 bg-gradient-to-r from-coach-purple via-coach-blue to-coach-green rounded-full" />
        </motion.div>
        <div className="relative flex justify-between">
          {STEP_ORDER.map((step) => {
            const stepIndex = stepOrder.indexOf(step)
            const isCompleted = completedSteps.includes(step) || stepIndex < currentIndex
            const isCurrent = step === currentStep

            return (
              <motion.div
                key={step}
                className="flex flex-col items-center"
                initial={{ scale: 0.8 }}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300",
                    isCompleted
                      ? "bg-coach-green text-white shadow-lg"
                      : isCurrent
                      ? "bg-coach-purple text-white shadow-lg ring-4 ring-coach-purple/30"
                      : "bg-gray-200 text-gray-500"
                  )}
                  whileHover={{ scale: 1.1 }}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    stepIcons[step]
                  )}
                </motion.div>
                <span
                  className={cn(
                    "text-xs mt-2 font-medium hidden sm:block",
                    isCurrent ? "text-coach-purple" :
                    isCompleted ? "text-coach-green" : "text-gray-400"
                  )}
                >
                  {getStepTitle(step).split('?')[0]}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Current Step Title */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-foreground mb-1">
          {stepIcons[currentStep]} {getStepTitle(currentStep)}
        </h2>
      </motion.div>
    </div>
  )
}
