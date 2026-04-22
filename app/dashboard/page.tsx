"use client"

import { Suspense, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { GradeSelector } from "@/components/GradeSelector"
import type { GradeBand } from "@/lib/types"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { LOCAL_STORAGE_KEYS } from "@/lib/constants"
import { listStoryProblems } from "@/lib/answer-engine"

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [preferredGrade, setPreferredGrade] = useLocalStorage<GradeBand | null>(
    LOCAL_STORAGE_KEYS.PREFERRED_GRADE,
    null
  )

  const [selectedGrade, setSelectedGrade] = useState<GradeBand>(
    (searchParams.get("grade") as GradeBand) || preferredGrade || "3-5"
  )

  const problems = useMemo(() => {
    return listStoryProblems().filter((problem) => problem.grade_band === selectedGrade)
  }, [selectedGrade])

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Story Picker</p>
          <h1 className="text-4xl font-extrabold">Choose a story</h1>
          <p className="text-muted-foreground mt-2">One screen, one story, one next move.</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/")}>Back Home</Button>
      </div>

      <Card className="mb-8 border-white/60 bg-white/75 backdrop-blur">
        <CardContent className="p-6 grid gap-4 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div>
            <p className="text-sm font-semibold text-coach-purple">Choose a grade band</p>
            <h2 className="text-2xl font-bold mt-1">Keep the screen simple</h2>
            <p className="text-muted-foreground mt-2">The app uses stored answers, simple hints, and big tap targets instead of a dashboard.</p>
          </div>
          <GradeSelector
            selectedGrade={selectedGrade}
            onSelect={(grade) => {
              setSelectedGrade(grade)
              setPreferredGrade(grade)
            }}
          />
        </CardContent>
      </Card>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {problems.map((problem, index) => (
          <motion.div
            key={problem.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <Card
              className="h-full cursor-pointer border-white/60 bg-white/80 shadow-lg hover:shadow-2xl transition-all"
              onClick={() => router.push(`/problem/${problem.id}`)}
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coach-blue">{problem.topic}</p>
                  <Sparkles className="h-4 w-4 text-coach-yellow" />
                </div>
                <h3 className="text-lg font-bold leading-snug">{problem.problem_text}</h3>
                <p className="text-sm text-muted-foreground">Tap-first flow, Hindi/English toggles, auto equation, and deterministic checking.</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-semibold text-foreground">Grade {problem.grade_band}</span>
                  <Button size="sm" variant="coach">
                    Start
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 max-w-7xl">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
