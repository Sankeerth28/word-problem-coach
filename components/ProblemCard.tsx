"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Problem } from "@/lib/types"
import { getDifficultyLabel, getGradeBandTextColor } from "@/lib/utils"

interface ProblemCardProps {
  problem: Problem
  onSelect?: () => void
  showDifficulty?: boolean
  selected?: boolean
}

export function ProblemCard({ problem, onSelect, showDifficulty = true, selected = false }: ProblemCardProps) {
  const isClickable = Boolean(onSelect)

  const handleSelect = () => {
    if (!onSelect) return
    console.log("[Dashboard] problem_card_click", {
      problemId: problem.id,
      topic: problem.topic,
      gradeBand: problem.grade_band,
    })
    onSelect()
  }

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isClickable) return
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      console.log("[Dashboard] problem_card_key_activate", {
        key: event.key,
        problemId: problem.id,
      })
      handleSelect()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={isClickable ? { y: -4 } : undefined}
      whileTap={isClickable ? { scale: 0.98 } : undefined}
    >
      <Card
        className={`transition-all duration-300 ${
          isClickable ? "cursor-pointer hover:shadow-2xl hover:border-coach-purple focus-within:ring-2 focus-within:ring-coach-blue" : ""
        } ${
          selected ? "border-coach-purple shadow-lg" : ""
        }`}
        onClick={handleSelect}
        onKeyDown={handleCardKeyDown}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : -1}
        aria-label={`Open ${problem.topic} problem`}
        aria-pressed={selected}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-${
              problem.grade_band === '3-5' ? 'green' :
              problem.grade_band === '6-8' ? 'blue' : 'purple'
            }-100 ${getGradeBandTextColor(problem.grade_band)}`}>
              {problem.grade_band === '3-5' ? 'Grades 3-5' :
               problem.grade_band === '6-8' ? 'Grades 6-8' : 'Algebra 1'}
            </span>
            {showDifficulty && (
              <span className="text-xs text-muted-foreground">
                {getDifficultyLabel(problem.difficulty)}
              </span>
            )}
          </div>
          <span className="text-xs font-medium text-coach-purple bg-coach-purple/10 px-2 py-0.5 rounded-full">
            {problem.topic}
          </span>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-relaxed text-foreground">
            {problem.problem_text}
          </p>
          {problem.diagram_url && (
            <div className="mt-4 rounded-xl overflow-hidden">
              <img
                src={problem.diagram_url}
                alt="Problem diagram"
                className="w-full h-32 object-cover"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
