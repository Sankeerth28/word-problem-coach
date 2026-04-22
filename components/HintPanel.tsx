"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HINT_LEVELS } from "@/lib/constants"
import type { Hint } from "@/lib/types"

interface HintPanelProps {
  onGetHint: (level: number) => void
  currentHintLevel: number
  currentHint?: Hint
  isLoading?: boolean
}

export function HintPanel({ onGetHint, currentHintLevel, currentHint, isLoading }: HintPanelProps) {
  const handleGetHint = () => {
    const nextLevel = Math.min(currentHintLevel + 1, 3) as 1 | 2 | 3
    onGetHint(nextLevel)
  }

  return (
    <div className="space-y-3">
      <Button
        variant="warning"
        onClick={handleGetHint}
        disabled={isLoading || currentHintLevel >= 3}
        className="w-full"
        size="lg"
      >
        <Lightbulb className="w-5 h-5 mr-2" />
        {currentHintLevel >= 3
          ? "No more hints available"
          : currentHintLevel === 0
          ? "Get a Hint"
          : `Get Level ${currentHintLevel + 1} Hint`}
      </Button>

      <AnimatePresence>
        {currentHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className={`p-4 border-l-4 ${
              currentHint.level === 1 ? 'border-l-yellow-500 bg-yellow-50' :
              currentHint.level === 2 ? 'border-l-orange-500 bg-orange-50' :
              'border-l-red-500 bg-red-50'
            }`}>
              <div className="flex items-start gap-3">
                <div className="text-2xl">
                  {currentHint.level === 1 ? '💡' :
                   currentHint.level === 2 ? '🔦' : '🎯'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm mb-1">
                    {HINT_LEVELS[currentHint.level as keyof typeof HINT_LEVELS]?.title}
                  </p>
                  <p className="text-sm leading-relaxed">
                    {currentHint.hint}
                  </p>
                  {currentHint.isRevealing && (
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      This hint is pretty revealing! Try to understand WHY this works.
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint Level Indicator */}
      <div className="flex gap-1 justify-center">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              level <= currentHintLevel
                ? 'bg-coach-yellow'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
