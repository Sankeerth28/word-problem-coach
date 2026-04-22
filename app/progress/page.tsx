"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { ProgressHeatmap } from "@/components/ProgressHeatmap"
import { CoachAvatar } from "@/components/CoachAvatar"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { LOCAL_STORAGE_KEYS } from "@/lib/constants"
import type { ProgressData } from "@/lib/types"

export default function ProgressPage() {
  const [progress] = useLocalStorage<ProgressData>(LOCAL_STORAGE_KEYS.PROGRESS, {
    session_id: '',
    total_attempts: 0,
    correct_attempts: 0,
    topics_mastered: [],
    topics_struggling: [],
    last_active: new Date().toISOString(),
    accuracy: 0,
    recent_problems: [],
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <h1 className="text-3xl font-bold">Your Progress Dashboard</h1>
          <CoachAvatar message="Look at all that progress! You're crushing it! 🎉" />
        </div>
        <p className="text-muted-foreground">
          Track your math translation skills and see how far you&apos;ve come!
        </p>
      </motion.div>

      {/* Progress Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ProgressHeatmap progress={progress} />
      </motion.div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span className="text-xl">💡</span>
            Tips for Improvement:
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Practice identifying ALL quantities before moving to the next step</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Read the problem aloud to catch important details</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Use the visual model builder to see relationships clearly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Don&apos;t rush—take time to explain the relationship in your own words</span>
            </li>
          </ul>
        </Card>
      </motion.div>

      {/* Achievement Badges (Future Feature Placeholder) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <h3 className="font-semibold mb-4">🏆 Coming Soon: Achievements!</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { emoji: '🌟', label: 'First Problem', unlocked: progress.total_attempts >= 1 },
            { emoji: '🔥', label: '5 Streak', unlocked: progress.correct_attempts >= 5 },
            { emoji: '🧮', label: 'Math Wizard', unlocked: (progress.topics_mastered?.length || 0) >= 3 },
            { emoji: '💪', label: 'Perseverance', unlocked: progress.total_attempts >= 10 },
          ].map((badge) => (
            <Card
              key={badge.label}
              className={`p-4 text-center ${
                badge.unlocked ? 'opacity-100' : 'opacity-40 grayscale'
              }`}
            >
              <div className="text-3xl mb-1">{badge.emoji}</div>
              <p className="text-xs font-medium">{badge.label}</p>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
