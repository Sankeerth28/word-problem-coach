import { NextResponse } from "next/server"
import type { QnARequest, QnAResponse } from "@/lib/types"
import { getStoryProblem } from "@/lib/answer-engine"
import { generateAIResponse } from "@/lib/ai/client"

// POST /api/qna - Let learners ask focused questions about the current story
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<QnARequest>
    const question = body.question?.trim()
    const problemId = body.problemId?.trim()

    if (!question) {
      return NextResponse.json(
        { success: false, error: "Question is required" },
        { status: 400 }
      )
    }

    if (question.length > 500) {
      return NextResponse.json(
        { success: false, error: "Question is too long" },
        { status: 400 }
      )
    }

    const problem = problemId ? getStoryProblem(problemId) : null
    const wantsStory = body.askForStory || /similar|like this|new story|another story|story problem/i.test(question)
    const wantsStepByStep = body.askForStepByStep || /step by step|solve|solution|how to solve/i.test(question)
    const language = body.language === "hi" ? "hi" : "en"

    const prompt = [
      language === "hi"
        ? "Learner language preference: Hindi (Roman Hindi allowed)."
        : "Learner language preference: English.",
      problem ? `Current story problem: ${problem.problem_text}` : "No active story problem is required for this question.",
      `Learner question: ${question}`,
      `Need step-by-step solve: ${wantsStepByStep ? "yes" : "no"}`,
      `Need similar story generation: ${wantsStory ? "yes" : "no"}`,
      body.context?.stage ? `Current stage: ${body.context.stage}` : "",
      body.context?.selectedOperation ? `Selected operation: ${body.context.selectedOperation}` : "",
      body.context?.equationDraft ? `Equation draft: ${body.context.equationDraft}` : "",
      "Return strict JSON only with keys: mode, answer, steps, generatedStory.",
      "mode must be one of: explain, solve, story.",
      "answer must be short and clear for students.",
      "steps must be an array of short strings when solving is requested.",
      "generatedStory must be null unless user requests a similar/new story, then include title, story, question, equationHint.",
    ]
      .filter(Boolean)
      .join("\n")

    const rawResponse = await generateAIResponse({
      prompt,
      systemPrompt:
        "You are a friendly math tutor for kids. You can answer any math question, solve when requested, and create a similar story problem when requested. Keep responses clear, age-appropriate, and concise.",
      jsonMode: true,
    })

    const ai = (rawResponse ?? {}) as Partial<QnAResponse>

    const response: QnAResponse = {
      mode: ai.mode === "solve" || ai.mode === "story" ? ai.mode : "explain",
      answer:
        typeof ai.answer === "string" && ai.answer.trim().length > 0
          ? ai.answer
          : "Great question. Tell me what part you want to understand, solve, or turn into a story problem.",
      steps: Array.isArray(ai.steps)
        ? ai.steps.filter((step): step is string => typeof step === "string" && step.trim().length > 0).slice(0, 6)
        : undefined,
      generatedStory:
        ai.generatedStory &&
        typeof ai.generatedStory === "object" &&
        typeof ai.generatedStory.title === "string" &&
        typeof ai.generatedStory.story === "string" &&
        typeof ai.generatedStory.question === "string"
          ? {
              title: ai.generatedStory.title,
              story: ai.generatedStory.story,
              question: ai.generatedStory.question,
              equationHint:
                typeof ai.generatedStory.equationHint === "string"
                  ? ai.generatedStory.equationHint
                  : undefined,
            }
          : undefined,
    }

    if (wantsStory && !response.generatedStory) {
      response.generatedStory = {
        title: "Snack Shop Story",
        story: "A snack shop sold 18 juice boxes in the morning and 14 in the afternoon. Then 5 were returned.",
        question: "How many juice boxes were sold in total after returns?",
        equationHint: "x = 18 + 14 - 5",
      }
      response.mode = "story"
    }

    return NextResponse.json({
      success: true,
      ...response,
    })
  } catch (error) {
    console.error("QnA error:", error)

    return NextResponse.json({
      success: true,
      mode: "explain",
      answer: "I can help with any math question. Ask me to explain, solve step-by-step, or create a similar story problem.",
    })
  }
}
