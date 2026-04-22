"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AIFeedback } from "@/lib/types"

interface FeedbackToastProps {
  feedback: AIFeedback | null
  onDismiss: () => void
  autoDismiss?: boolean
  autoDismissDelay?: number
}

export function FeedbackToast({
  feedback,
  onDismiss,
  autoDismiss = true,
  autoDismissDelay = 5000
}: FeedbackToastProps) {
  useEffect(() => {
    if (feedback && autoDismiss) {
      const timer = setTimeout(onDismiss, autoDismissDelay)
      return () => clearTimeout(timer)
    }
  }, [feedback, autoDismiss, autoDismissDelay, onDismiss])

  if (!feedback) return null

  const isSuccess = feedback.isValid && feedback.misconceptions.length === 0
  const hasMisconceptions = feedback.misconceptions.length > 0

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className={cn(
          "fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-50 rounded-2xl shadow-2xl border-2 p-4",
          isSuccess
            ? "bg-green-50 border-green-500"
            : hasMisconceptions
            ? "bg-amber-50 border-amber-500"
            : "bg-blue-50 border-blue-500"
        )}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            {isSuccess ? (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            ) : hasMisconceptions ? (
              <AlertCircle className="w-6 h-6 text-amber-600" />
            ) : (
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Encouragement */}
            <p className="font-semibold text-sm text-gray-900 mb-1">
              {feedback.encouragement}
            </p>

            {/* Main Message */}
            <p className="text-sm text-gray-700 mb-2">
              {feedback.message}
            </p>

            {/* Misconceptions */}
            {hasMisconceptions && (
              <div className="space-y-2 mt-3">
                {feedback.misconceptions.map((m, i) => (
                  <div
                    key={i}
                    className="bg-white/70 rounded-lg p-2 text-xs"
                  >
                    <p className="font-medium text-amber-800 mb-1">
                      {m.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                    <p className="text-amber-700">{m.description}</p>
                    <p className="text-green-700 mt-1 font-medium">
                      💡 {m.correction}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Next Step Hint */}
            {feedback.nextStepHint && (
              <div className="mt-3 p-2 bg-blue-100 rounded-lg">
                <p className="text-xs text-blue-800 font-medium">
                  💭 Next step: {feedback.nextStepHint}
                </p>
              </div>
            )}
          </div>

          {/* Dismiss Button */}
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
