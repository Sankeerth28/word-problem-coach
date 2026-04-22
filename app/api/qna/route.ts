import { NextResponse } from "next/server"
import type { QnARequest, QnAResponse } from "@/lib/types"
import { getStoryProblem } from "@/lib/answer-engine"
import { generateAIResponse } from "@/lib/ai/client"

// POST /api/qna - Let learners ask focused questions about the current story
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<QnARequest>
    const problemId = body.problemId?.trim()
    const question = body.question?.trim()

    if (!problemId || !question) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (question.length > 500) {
      return NextResponse.json(
        { success: false, error: "Question is too long" },
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

    const prompt = [
      `Problem: ${problem.problem_text}`,
      `Question from learner: ${question}`,
      body.context?.stage ? `Current stage: ${body.context.stage}` : "",
      body.context?.selectedOperation ? `Selected operation: ${body.context.selectedOperation}` : "",
      body.context?.equationDraft ? `Equation draft: ${body.context.equationDraft}` : "",
    ]
      .filter(Boolean)
      .join("\n")

    const rawAnswer = await generateAIResponse({
      prompt,
      systemPrompt:
        "You are a friendly math helper for kids. Give short, clear guidance. Do not reveal the full final answer unless explicitly asked to check a completed setup.",
    })

    const answer = typeof rawAnswer === "string"
      ? rawAnswer
      : "Great question. Try focusing on what the story asks you to find first, then choose the matching operation."

    const response: QnAResponse = { answer }

    return NextResponse.json({
      success: true,
      ...response,
    })
  } catch (error) {
    console.error("QnA error:", error)

    return NextResponse.json({
      success: true,
      answer: "I can help with that. Try asking in one short sentence about the step you are on.",
    })
  }
}
