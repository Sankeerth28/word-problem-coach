"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GradeSelector } from "@/components/GradeSelector"
import { CoachAvatar } from "@/components/CoachAvatar"
import type { GradeBand } from "@/lib/types"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { LOCAL_STORAGE_KEYS } from "@/lib/constants"

export default function LandingPage() {
  const router = useRouter()
  const [, setPreferredGrade] = useLocalStorage<GradeBand | null>(
    LOCAL_STORAGE_KEYS.PREFERRED_GRADE,
    null
  )

  const handleGradeSelect = (gradeBand: GradeBand) => {
    setPreferredGrade(gradeBand)
    router.push(`/dashboard?grade=${gradeBand}`)
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:py-20 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-block mb-6"
        >
          <div className="relative">
            <div className="text-7xl sm:text-8xl animate-float">🧩</div>
            <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-coach-yellow animate-pulse" />
          </div>
        </motion.div>

        <h1 className="text-4xl sm:text-6xl font-extrabold mb-4">
          <span className="gradient-text">Math Story Decoder</span>
        </h1>

        <p className="text-xl sm:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto">
          Decode the story, tap the clues, and let the app build the math.
        </p>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Designed for kids who want one screen, big buttons, clear hints, and an answer engine that checks the work the same way every time.
        </p>

        <div className="flex justify-center mb-8">
          <CoachAvatar message="Pick a grade, pick a story, and we&apos;ll keep it simple. 🔥" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid sm:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto"
      >
        {[
          { emoji: '👆', title: 'Tap the clues', desc: 'Numbers and units are highlighted for you' },
          { emoji: '🧠', title: 'Pick the action', desc: 'Add, subtract, multiply, or divide' },
          { emoji: '✅', title: 'Confirm the equation', desc: 'The answer engine checks it deterministically' },
        ].map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-lg text-center border border-white/60"
          >
            <div className="text-3xl mb-2">{feature.emoji}</div>
            <h3 className="font-bold text-sm mb-1">{feature.title}</h3>
            <p className="text-xs text-muted-foreground">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-center mb-3">
          Choose a grade band
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          Tap a grade to jump into the story picker.
        </p>
        <GradeSelector onSelect={handleGradeSelect} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center"
      >
        <Button
          variant="coach"
          size="lg"
          onClick={() => router.push('/dashboard')}
          className="group"
        >
          Pick a Story
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>
    </div>
  )
}
