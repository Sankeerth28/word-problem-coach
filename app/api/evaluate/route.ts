import { NextResponse } from "next/server"
import type { ProblemStep } from "@/lib/types"
import { evaluateAnswer, getStoryProblem, type StoryStage } from "@/lib/answer-engine"

function normalizeStage(step: ProblemStep): StoryStage {
  if (step === "operations") return "pick"
  if (step === "equation") return "confirm"
  return "spot"
}

// POST /api/evaluate - Deterministic step evaluation
export async function POST(request: Request) {
  let stepForFallback: ProblemStep | undefined
  let studentInputForFallback: Record<string, unknown> | undefined
  let problemIdForFallback: string | undefined

  try {
    const body = await request.json()
    const {
      problemId,
      step,
      studentInput,
    }: {
      problemId?: string
      step?: ProblemStep
      studentInput?: Record<string, unknown>
    } = body

    stepForFallback = step
    studentInputForFallback = studentInput
    problemIdForFallback = problemId

    if (!problemId || !step || !studentInput) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const problem = getStoryProblem(problemId)

    if (!problem) {
      return NextResponse.json(
        { success: false, error: "Problem not found" },
        { status: 404 }
      )
    }

    const result = evaluateAnswer(problem, normalizeStage(step), studentInput)

    return NextResponse.json({
      success: true,
      feedback: result.feedback,
      confidence: result.confidence,
      conversationHistory: [],
    })
  } catch (error) {
    console.error("Evaluation error:", error)

    const fallbackProblem = problemIdForFallback
      ? getStoryProblem(problemIdForFallback)
      : null

    if (stepForFallback && studentInputForFallback && fallbackProblem) {
      const fallback = evaluateAnswer(
        fallbackProblem,
        normalizeStage(stepForFallback),
        studentInputForFallback
      )

      return NextResponse.json({
        success: true,
        feedback: fallback.feedback,
        confidence: fallback.confidence,
        conversationHistory: [],
      })
    }

    return NextResponse.json({
      success: true,
      feedback: {
        isValid: false,
        message: "Hmm, let's try that again. Tap the story clue that matches the numbers.",
        misconceptions: [],
        encouragement: "I love how you're working through this. Keep going.",
        confidence: 0.25,
      },
      confidence: 0.25,
      conversationHistory: [],
    })
  }
}
