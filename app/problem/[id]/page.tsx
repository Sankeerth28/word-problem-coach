"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Check, Languages, RefreshCw, Sparkles, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CoachAvatar } from "@/components/CoachAvatar"
import { useSpeech } from "@/hooks/useSpeech"
import { buildHint, evaluateAnswer, getStoryProblem, listStoryProblems, type LanguageCode, type StoryStage } from "@/lib/answer-engine"
import { getEncouragementMessage } from "@/lib/utils"
import type { Hint } from "@/lib/types"

const operationCopy: Record<string, { label: string; description: string }> = {
  addition: { label: "Add", description: "Put amounts together" },
  subtraction: { label: "Subtract", description: "Take away or find the difference" },
  multiplication: { label: "Multiply", description: "Use equal groups" },
  division: { label: "Divide", description: "Share or split evenly" },
}

const languageCopy: Record<LanguageCode, { title: string; subtitle: string; check: string; autoRead: string }> = {
  en: {
    title: "Spot the Important Stuff",
    subtitle: "Tap the numbers first, then pick the action, then confirm the equation.",
    check: "Check answer",
    autoRead: "Auto voice reading",
  },
  hi: {
    title: "Important cheezein pehchano",
    subtitle: "Pehle numbers tap karo, phir action chuno, phir equation confirm karo.",
    check: "Answer check karo",
    autoRead: "Auto voice reading",
  },
}

function normalizeProblemId(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? ""
  return value ?? ""
}

function nextStage(stage: StoryStage): StoryStage {
  if (stage === "spot") return "pick"
  if (stage === "pick") return "confirm"
  return "confirm"
}

export default function ProblemPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const problemId = normalizeProblemId(params?.id)
  const problem = getStoryProblem(problemId) ?? listStoryProblems()[0]

  const [stage, setStage] = useState<StoryStage>("spot")
  const [selectedValues, setSelectedValues] = useState<number[]>([])
  const [selectedOperation, setSelectedOperation] = useState("")
  const [equationDraft, setEquationDraft] = useState(problem.autoEquation)
  const [feedback, setFeedback] = useState<ReturnType<typeof evaluateAnswer>["feedback"] | null>(null)
  const [hint, setHint] = useState<Hint | null>(null)
  const [hintLevel, setHintLevel] = useState<1 | 2 | 3>(1)
  const [easyMode, setEasyMode] = useState(true)
  const [language, setLanguage] = useState<LanguageCode>("en")
  const [showSolution, setShowSolution] = useState(false)
  const [autoRead, setAutoRead] = useState(true)

  const { speak, stop, isSpeechSupported, isSpeaking } = useSpeech()

  useEffect(() => {
    setStage("spot")
    setSelectedValues([])
    setSelectedOperation("")
    setEquationDraft(problem.autoEquation)
    setFeedback(null)
    setHint(null)
    setHintLevel(1)
    setShowSolution(false)
  }, [problem.id, problem.autoEquation])

  useEffect(() => {
    if (autoRead && isSpeechSupported) {
      speak(problem.problem_text, { rate: easyMode ? 0.85 : 0.95, pitch: 1.05 })
    }

    return () => stop()
  }, [autoRead, easyMode, isSpeechSupported, problem.problem_text, speak, stop])

  const operationOptions = useMemo(() => {
    const primary = problem.acceptedOperations[0] ?? "addition"
    const fallbackChoices = ["addition", "subtraction", "multiplication", "division"]
    const preferred = [primary, ...fallbackChoices.filter((choice) => choice !== primary)]
    return preferred.slice(0, 3).map((operation) => ({
      operation,
      ...operationCopy[operation],
    }))
  }, [problem.acceptedOperations])

  const stageTitle = languageCopy[language].title
  const stageSubtitle = languageCopy[language].subtitle

  const toggleQuantity = (value: number) => {
    setSelectedValues((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    )
  }

  const handleHint = () => {
    const nextLevel = (Math.min(hintLevel + 1, 3) as 1 | 2 | 3)
    const nextHint = buildHint(problem, stage, nextLevel, language)
    setHint(nextHint)
    setHintLevel(nextLevel)
  }

  const handleCheck = () => {
    const studentInput =
      stage === "spot"
        ? { selectedValues }
        : stage === "pick"
          ? { operation: selectedOperation }
          : { equation: equationDraft }

    const result = evaluateAnswer(problem, stage, studentInput)
    setFeedback(result.feedback)
    setHint(null)

    if (result.feedback.isValid) {
      if (stage === "confirm") {
        setShowSolution(true)
      } else {
        setStage(nextStage(stage))
      }
    }
  }

  const handleTryAnother = () => {
    const currentIndex = listStoryProblems().findIndex((item) => item.id === problem.id)
    const nextProblem = listStoryProblems()[(currentIndex + 1) % listStoryProblems().length]
    router.push(`/problem/${nextProblem.id}`)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{problem.topic}</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold mt-2">{stageTitle}</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">{stageSubtitle}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setEasyMode((current) => !current)}>
              {easyMode ? "Easy mode on" : "Easy mode off"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setLanguage((current) => (current === "en" ? "hi" : "en"))}>
              <Languages className="w-4 h-4 mr-2" />
              {language === "en" ? "English" : "Hindi"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setAutoRead((current) => !current)}>
              {autoRead ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
              {languageCopy[language].autoRead}
            </Button>
          </div>
        </div>

        <Card className="border-white/60 bg-white/85 backdrop-blur shadow-lg">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-start gap-4">
              <CoachAvatar message={easyMode ? "Tap the clues. Keep it simple." : "Look for the numbers, pick the action, then confirm the equation."} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-coach-purple">Read the story</p>
                <p className="text-lg leading-relaxed mt-2">{problem.problem_text}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {problem.highlightPhrases.map((phrase) => (
                    <span key={phrase} className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-900">
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {problem.quantities.map((quantity) => {
                const value = Number(quantity.value)
                const isSelected = selectedValues.includes(value)
                return (
                  <button
                    key={quantity.name}
                    type="button"
                    onClick={() => toggleQuantity(value)}
                    className={`rounded-2xl border-2 px-4 py-4 text-left transition-all ${
                      isSelected
                        ? "border-coach-green bg-green-50 shadow-md"
                        : "border-dashed border-slate-300 bg-slate-50 hover:border-coach-blue"
                    }`}
                  >
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Tap me</div>
                    <div className="mt-2 text-2xl font-extrabold">{quantity.value}</div>
                    <div className="text-sm text-muted-foreground">{quantity.unit}</div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-white/60 bg-white/85 backdrop-blur shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-sm font-semibold text-coach-blue">Step {stage === "spot" ? 1 : stage === "pick" ? 2 : 3}</p>
                  <h2 className="text-2xl font-bold">{stage === "spot" ? "Spot the Important Stuff" : stage === "pick" ? "Pick What to Do" : "Build and Check"}</h2>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="warning" onClick={handleHint}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Hint
                  </Button>
                  <Button variant="coach" onClick={handleCheck}>
                    <Check className="w-4 h-4 mr-2" />
                    {languageCopy[language].check}
                  </Button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {stage === "spot" && (
                  <motion.div key="spot" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
                    <p className="text-muted-foreground">Tap the quantity cards above. The app checks your picks against the stored answer.</p>
                    <p className="text-sm text-muted-foreground">Selected: {selectedValues.length > 0 ? selectedValues.join(", ") : "none yet"}</p>
                  </motion.div>
                )}

                {stage === "pick" && (
                  <motion.div key="pick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
                    <p className="text-muted-foreground">Choose the action that matches the story. Big buttons, no typing.</p>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {operationOptions.map((option) => (
                        <button
                          key={option.operation}
                          type="button"
                          onClick={() => setSelectedOperation(option.operation)}
                          className={`rounded-2xl border-2 p-4 text-left transition-all ${
                            selectedOperation === option.operation
                              ? "border-coach-purple bg-purple-50 shadow-md"
                              : "border-slate-200 bg-slate-50 hover:border-coach-purple"
                          }`}
                        >
                          <div className="text-2xl font-extrabold">{option.label}</div>
                          <div className="text-sm text-muted-foreground mt-1">{option.description}</div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {stage === "confirm" && (
                  <motion.div key="confirm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
                    <p className="text-muted-foreground">The app built an equation for you. Confirm it or edit it if you want.</p>
                    <textarea
                      value={equationDraft}
                      onChange={(event) => setEquationDraft(event.target.value)}
                      className="min-h-[120px] w-full rounded-2xl border-2 border-slate-200 bg-white p-4 text-lg font-mono outline-none focus:border-coach-purple"
                    />
                    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-muted-foreground">
                      Auto equation: <span className="font-mono text-foreground">{problem.autoEquation}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Equation preview: {equationDraft}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          <Card className="border-white/60 bg-white/85 backdrop-blur shadow-lg">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-bold">Hints</h3>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 min-h-28">
                {hint ? (
                  <>
                    <p className="text-xs uppercase tracking-[0.2em] text-amber-700">Hint {hint.level}</p>
                    <p className="mt-2 text-sm leading-relaxed text-amber-900">{hint.hint}</p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Tap the hint button for a visual cue, direction, or partial answer.</p>
                )}
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Micro-win</p>
                  <p className="mt-2 text-sm">{feedback?.isValid ? "You got one step right." : "A small win will show up here after each check."}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Voice</p>
                  <p className="mt-2 text-sm">{isSpeaking ? "Reading the story aloud." : autoRead ? "Auto-read is on." : "Auto-read is off."}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 14 }}>
              <Card className={`border-2 ${feedback.isValid ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className={`text-xs uppercase tracking-[0.2em] ${feedback.isValid ? "text-green-700" : "text-amber-700"}`}>{feedback.isValid ? "Correct" : "Try again"}</p>
                      <p className="mt-2 text-lg font-semibold">{feedback.message}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{feedback.encouragement}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">Confidence: {Math.round((feedback.confidence ?? 0) * 100)}%</div>
                  </div>

                  {feedback.isValid && stage === "confirm" && showSolution && (
                    <div className="mt-5 rounded-2xl bg-white/80 p-4">
                      <p className="text-sm font-semibold mb-2">Stored solution</p>
                      <p className="font-mono">{problem.answerEquation}</p>
                      <div className="mt-4 space-y-2">
                        {problem.solution_steps.map((stepItem) => (
                          <div key={stepItem.step} className="flex gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500 text-xs text-white">{stepItem.step}</span>
                            <div>
                              <p className="text-sm">{stepItem.description}</p>
                              <p className="font-mono text-sm text-green-700">{stepItem.math}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="outline" onClick={handleTryAnother}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try another story
          </Button>
          <div className="flex gap-3 flex-wrap">
            <Button variant="ghost" onClick={() => setHint(null)}>
              Clear hint
            </Button>
            {stage !== "spot" && (
              <Button variant="outline" onClick={() => setStage((current) => (current === "confirm" ? "pick" : "spot"))}>
                Previous step
              </Button>
            )}
            <Button variant="coach" onClick={handleCheck}>
              <ArrowRight className="w-4 h-4 mr-2" />
              Check again
            </Button>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          {getEncouragementMessage(Boolean(feedback?.isValid), stage)}
        </div>
      </motion.div>
    </div>
  )
}