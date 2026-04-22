"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { GRADE_BANDS } from "@/lib/constants"
import type { GradeBand } from "@/lib/types"

interface GradeSelectorProps {
  onSelect: (gradeBand: GradeBand) => void
  selectedGrade?: GradeBand
}

export function GradeSelector({ onSelect, selectedGrade }: GradeSelectorProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-4xl">
      {GRADE_BANDS.map((grade, index) => (
        <motion.div
          key={grade.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card
            className={`cursor-pointer transition-all duration-300 hover:shadow-2xl ${
              selectedGrade === grade.id
                ? `ring-4 ring-${grade.color}-500 border-${grade.color}-500`
                : 'hover:border-coach-purple/50'
            }`}
            onClick={() => onSelect(grade.id as GradeBand)}
          >
            <CardContent className="p-8 text-center">
              <motion.div
                className={`mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center text-3xl bg-gradient-to-br from-${grade.color}-400 to-${grade.color}-600 text-white shadow-lg`}
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                {grade.id === '3-5' && '🌟'}
                {grade.id === '6-8' && '🚀'}
                {grade.id === 'algebra-1' && '📐'}
              </motion.div>
              <h3 className={`text-xl font-bold mb-2 text-${grade.color}-600`}>
                {grade.label}
              </h3>
              <p className="text-muted-foreground text-sm">
                {grade.description}
              </p>
              <Button
                variant="coach"
                className="mt-4 w-full"
                size="lg"
              >
                Start Here!
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
