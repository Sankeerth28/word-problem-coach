"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { ProgressData } from "@/lib/types"
import { calculateAccuracy } from "@/lib/utils"

interface ProgressHeatmapProps {
  progress: ProgressData
}

const topicEmojis: Record<string, string> = {
  'Addition & Subtraction': '➕',
  'Multiplication': '✖️',
  'Division': '➗',
  'Fractions': '🍰',
  'Ratios': '⚖️',
  'Percentages': '📊',
  'Rates': '🏃',
  'Linear Equations': '📈',
  'Systems of Equations': '🔢',
  'Quadratic Equations': '🎯',
  'Inequalities': '≠',
  'Multi-step': '🧩',
}

export function ProgressHeatmap({ progress }: ProgressHeatmapProps) {
  const accuracy = calculateAccuracy(progress.correct_attempts, progress.total_attempts)

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-coach-purple">{progress.total_attempts}</p>
          <p className="text-xs text-muted-foreground">Problems Attempted</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-coach-green">{progress.correct_attempts}</p>
          <p className="text-xs text-muted-foreground">Correct</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-coach-blue">{accuracy}%</p>
          <p className="text-xs text-muted-foreground">Accuracy</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-coach-yellow">{progress.topics_mastered?.length || 0}</p>
          <p className="text-xs text-muted-foreground">Topics Mastered</p>
        </Card>
      </div>

      {/* Accuracy Progress */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Overall Progress</h3>
        <Progress value={accuracy} className="h-4" />
        <p className="text-sm text-muted-foreground mt-2">
          {accuracy < 50 ? "Keep practicing - you're building skills! 💪" :
           accuracy < 75 ? "Great progress! You're getting the hang of it! 🌟" :
           accuracy < 90 ? "Awesome! You&apos;re a math wizard! 🧙‍♂️" :
           "Legendary! You&apos;ve mastered this! 🏆"}
        </p>
      </Card>

      {/* Topics Mastered */}
      {(progress.topics_mastered?.length || 0) > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">🎯 Topics You&apos;ve Mastered</h3>
          <div className="flex flex-wrap gap-2">
            {progress.topics_mastered.map((topic, i) => (
              <motion.span
                key={topic}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium"
              >
                {topicEmojis[topic] || '📚'} {topic}
              </motion.span>
            ))}
          </div>
        </Card>
      )}

      {/* Topics to Work On */}
      {(progress.topics_struggling?.length || 0) > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">💪 Topics to Practice</h3>
          <div className="flex flex-wrap gap-2">
            {progress.topics_struggling.map((topic, i) => (
              <motion.span
                key={topic}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
              >
                {topicEmojis[topic] || '📚'} {topic}
              </motion.span>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Activity */}
      {progress.recent_problems && progress.recent_problems.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Recent Problems</h3>
          <div className="space-y-2">
            {progress.recent_problems.slice(0, 5).map((problem, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {topicEmojis[problem.topic] || '📝'}
                  </span>
                  <span className="text-sm font-medium">{problem.topic}</span>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  problem.was_correct
                    ? 'bg-green-100 text-green-700'
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {problem.was_correct ? '✓ Correct' : '⚠️ Review'}
                </span>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
