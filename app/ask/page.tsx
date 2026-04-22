"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft, Languages, MessageCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { QnAResponse } from "@/lib/types"

type AskTurn = {
  id: string
  question: string
  response: QnAResponse
}

export default function AskAnythingPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const [question, setQuestion] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [turns, setTurns] = useState<AskTurn[]>([])

  const askQuestion = async () => {
    const trimmed = question.trim()
    if (!trimmed || loading) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/qna", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: trimmed,
          language,
          askForStepByStep: /step by step|solve|solution/i.test(trimmed),
          askForStory: /similar|like this|another story|new story|story problem/i.test(trimmed),
        }),
      })

      const data = (await response.json()) as { success?: boolean; error?: string } & Partial<QnAResponse>

      if (!response.ok || !data.success || !data.answer) {
        throw new Error(data.error ?? "Unable to answer right now.")
      }

      const nextTurn: AskTurn = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        question: trimmed,
        response: data as QnAResponse,
      }

      setTurns((current) => [nextTurn, ...current])
      setQuestion("")
    } catch (requestError) {
      console.error("Ask anything request failed:", requestError)
      setError(requestError instanceof Error ? requestError.message : "Unable to answer right now.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
        <Button variant="ghost" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to stories
        </Button>
        <Button variant="outline" size="sm" onClick={() => setLanguage((current) => (current === "en" ? "hi" : "en"))}>
          <Languages className="w-4 h-4 mr-2" />
          {language === "en" ? "English" : "Hindi"}
        </Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Ask Anything</p>
          <h1 className="text-4xl font-extrabold mt-2">Math Chat + Story Builder</h1>
          <p className="text-muted-foreground mt-2">
            Ask any math question, ask for a step-by-step solve, or request a similar story problem.
          </p>
        </div>

        <Card className="border-white/60 bg-white/85 backdrop-blur shadow-lg">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-coach-blue" />
              <h2 className="text-xl font-bold">Your question</h2>
            </div>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Try: Solve 72 / 8, explain fractions, or make a similar story problem"
              className="min-h-[120px] w-full rounded-2xl border-2 border-slate-200 bg-white p-4 text-sm outline-none focus:border-coach-purple"
            />
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs text-muted-foreground">Tip: include words like solve, step by step, or similar story.</p>
              <Button variant="coach" onClick={askQuestion} disabled={loading || question.trim().length === 0}>
                {loading ? "Thinking..." : "Ask"}
              </Button>
            </div>
            {error && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {turns.length === 0 && (
            <Card className="border-white/60 bg-white/70 backdrop-blur">
              <CardContent className="p-6 text-sm text-muted-foreground">
                No questions yet. Start by asking for an explanation, a solved example, or a new story problem.
              </CardContent>
            </Card>
          )}

          {turns.map((turn) => (
            <Card key={turn.id} className="border-white/60 bg-white/85 backdrop-blur shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">You asked</p>
                  <p className="mt-2 text-sm font-medium">{turn.question}</p>
                </div>

                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-blue-700">Answer</p>
                  <p className="mt-2 text-sm leading-relaxed text-blue-900">{turn.response.answer}</p>
                </div>

                {turn.response.steps && turn.response.steps.length > 0 && (
                  <div className="rounded-2xl bg-white border border-slate-200 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-600">Step-by-step</p>
                    <ol className="mt-2 list-decimal pl-5 space-y-1 text-sm text-slate-900">
                      {turn.response.steps.map((step, index) => (
                        <li key={`${turn.id}-step-${index}`}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {turn.response.generatedStory && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-700" />
                      <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Generated story</p>
                    </div>
                    <p className="text-sm font-semibold text-emerald-900">{turn.response.generatedStory.title}</p>
                    <p className="text-sm text-emerald-900">{turn.response.generatedStory.story}</p>
                    <p className="text-sm font-medium text-emerald-900">{turn.response.generatedStory.question}</p>
                    {turn.response.generatedStory.equationHint && (
                      <p className="text-xs text-emerald-700">Equation hint: {turn.response.generatedStory.equationHint}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  )
}