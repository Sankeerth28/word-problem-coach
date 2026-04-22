import { NextResponse } from "next/server"
import type { QnARequest, QnAResponse } from "@/lib/types"
import { getStoryProblem } from "@/lib/answer-engine"
import { generateAIResponse } from "@/lib/ai/client"

function extractNumbers(text: string): number[] {
  return (text.match(/-?\d+(?:\.\d+)?/g) ?? [])
    .map((item) => Number(item))
    .filter((value) => Number.isFinite(value))
}

function trySolveExpression(text: string): { expression: string; value: number } | null {
  const normalized = text
    .replace(/[×xX]/g, "*")
    .replace(/[÷]/g, "/")
    .replace(/[=]/g, " ")

  const candidates = normalized.match(/[\d+\-*/().\s]{3,}/g) ?? []

  for (const rawCandidate of candidates) {
    const candidate = rawCandidate.trim().replace(/\s+/g, " ")
    if (!/[+\-*/]/.test(candidate)) {
      continue
    }
    if (!/^[\d+\-*/().\s]+$/.test(candidate)) {
      continue
    }

    try {
      const evaluator = new Function(`return (${candidate})`)
      const value = Number(evaluator())
      if (Number.isFinite(value)) {
        return { expression: candidate, value }
      }
    } catch {
      // Keep scanning candidates.
    }
  }

  return null
}

function buildLocalFallbackResponse(
  question: string,
  wantsStory: boolean,
  wantsStepByStep: boolean,
  language: "en" | "hi"
): QnAResponse {
  const lower = question.toLowerCase()
  const numbers = extractNumbers(question)
  const expression = trySolveExpression(question)

  if (expression) {
    const rounded = Number.isInteger(expression.value) ? String(expression.value) : expression.value.toFixed(2)
    return {
      mode: "solve",
      answer:
        language === "hi"
          ? `Expression ${expression.expression} ka answer ${rounded} hai.`
          : `The value of ${expression.expression} is ${rounded}.`,
      steps: language === "hi"
        ? [
            `Expression pehchana: ${expression.expression}`,
            "Operations ko order ke hisab se evaluate kiya.",
            `Final answer: ${rounded}`,
          ]
        : [
            `Identified expression: ${expression.expression}`,
            "Evaluated operations in order.",
            `Final answer: ${rounded}`,
          ],
    }
  }

  const hasEachPattern = /each|per|every|times|groups?|boxes?|packets?|rows?/i.test(lower)
  const hasSubtractPattern = /left|remain|gives?|gave|lost|spent|take away|minus|subtract|returned/i.test(lower)
  const hasAddPattern = /total|in all|together|sum|more|added/i.test(lower)

  if (numbers.length >= 2) {
    let current = numbers[0]
    const steps: string[] = []

    if (hasEachPattern) {
      current = numbers[0] * numbers[1]
      steps.push(
        language === "hi"
          ? `${numbers[0]} groups aur har group me ${numbers[1]}: ${numbers[0]} x ${numbers[1]} = ${current}`
          : `${numbers[0]} groups with ${numbers[1]} in each gives ${numbers[0]} x ${numbers[1]} = ${current}`
      )
      if (hasSubtractPattern && numbers.length >= 3) {
        current -= numbers[2]
        steps.push(
          language === "hi"
            ? `${numbers[2]} de diye, to ${current} bache.`
            : `Then subtract ${numbers[2]}, so ${current} remain.`
        )
      }
    } else if (hasSubtractPattern) {
      current = numbers[0] - numbers[1]
      steps.push(
        language === "hi"
          ? `${numbers[0]} - ${numbers[1]} = ${current}`
          : `${numbers[0]} - ${numbers[1]} = ${current}`
      )
    } else if (hasAddPattern || numbers.length === 2) {
      current = numbers[0] + numbers[1]
      steps.push(
        language === "hi"
          ? `${numbers[0]} + ${numbers[1]} = ${current}`
          : `${numbers[0]} + ${numbers[1]} = ${current}`
      )
    }

    if (steps.length > 0) {
      const response: QnAResponse = {
        mode: "solve",
        answer:
          language === "hi"
            ? `Final answer ${current} hai.`
            : `The final answer is ${current}.`,
        steps: wantsStepByStep ? steps : undefined,
      }

      if (wantsStory) {
        response.mode = "story"
        response.generatedStory = {
          title: language === "hi" ? "Crayon Story" : "Crayon Story",
          story:
            language === "hi"
              ? "Asha ke paas 3 packets hain. Har packet me 7 crayons hain. Fir woh 4 crayons de deti hai."
              : "Asha has 3 packets of crayons. Each packet has 7 crayons. Then she gives away 4 crayons.",
          question:
            language === "hi"
              ? "Asha ke paas ab kitne crayons bache?"
              : "How many crayons does Asha have now?",
          equationHint: "x = 3 * 7 - 4",
        }
      }

      return response
    }
  }

  const defaultResponse: QnAResponse = {
    mode: wantsStory ? "story" : "explain",
    answer:
      language === "hi"
        ? "Main help kar sakta hoon. Question me numbers aur kya find karna hai, wo likho."
        : "I can help. Include the numbers and what you need to find, and I will solve it.",
  }

  if (wantsStory) {
    defaultResponse.generatedStory = {
      title: "Snack Shop Story",
      story: "A snack shop sold 18 juice boxes in the morning and 14 in the afternoon. Then 5 were returned.",
      question: "How many juice boxes were sold in total after returns?",
      equationHint: "x = 18 + 14 - 5",
    }
  }

  return defaultResponse
}

// POST /api/qna - Let learners ask focused questions about the current story
export async function POST(request: Request) {
  let fallbackQuestion = ""
  let fallbackWantsStory = false
  let fallbackWantsStepByStep = false
  let fallbackLanguage: "en" | "hi" = "en"

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

    fallbackQuestion = question
    fallbackWantsStory = wantsStory
    fallbackWantsStepByStep = wantsStepByStep
    fallbackLanguage = language

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

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.trim().length === 0) {
      const fallback = buildLocalFallbackResponse(question, wantsStory, wantsStepByStep, language)
      return NextResponse.json({ success: true, ...fallback })
    }

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

    // Return a useful deterministic fallback instead of a generic message.
    const fallback = buildLocalFallbackResponse(
      fallbackQuestion,
      fallbackWantsStory,
      fallbackWantsStepByStep,
      fallbackLanguage
    )

    return NextResponse.json({
      success: true,
      ...fallback,
    })
  }
}
