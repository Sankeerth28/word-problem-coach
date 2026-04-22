import type { AIFeedback, Hint, Problem } from "@/lib/types"

export type StoryStage = "spot" | "pick" | "confirm"

export type LanguageCode = "en" | "hi"

export interface StoryProblem extends Problem {
  expectedOperation: "addition" | "subtraction" | "multiplication" | "division" | "mixed"
  acceptedOperations: string[]
  answerEquation: string
  autoEquation: string
  highlightPhrases: string[]
  hintCues: [string, string, string]
}

export interface AnswerEngineInput {
  stage: StoryStage
  studentInput: Record<string, unknown>
  language?: LanguageCode
  easyMode?: boolean
}

export interface AnswerEngineResult {
  feedback: AIFeedback
  confidence: number
}

const MATH_HINTS = {
  en: {
    spot: ["Tap the numbers you can see.", "Pick the quantity chips that match the story.", "Focus on the numbers and units that matter."],
    pick: ["Are we combining, taking away, or making groups?", "Choose the action that matches the story.", "Think about what the story asks the numbers to do."],
    confirm: ["Check whether the equation shows the story correctly.", "Does your equation match the action you chose?", "Look for the numbers, the operation, and the equals sign."],
  },
  hi: {
    spot: ["Jo numbers dikh rahe hain unhe tap karo.", "Kahani se milne wale quantity chips chuno.", "Important numbers aur units par dhyan do."],
    pick: ["Kya hum jod rahe hain, ghata rahe hain, ya groups bana rahe hain?", "Wohi action chuno jo kahani se match kare.", "Socho numbers ke saath kya ho raha hai."],
    confirm: ["Check karo equation kahani ko sahi dikhata hai ya nahi.", "Kya equation tumhare chosen action se match karti hai?", "Numbers, operation, aur equals sign ko check karo."],
  },
} as const

export const STORY_PROBLEMS: Record<string, StoryProblem> = {
  "550e8400-e29b-41d4-a716-446655440001": {
    id: "550e8400-e29b-41d4-a716-446655440001",
    grade_band: "3-5",
    topic: "Stickers Story",
    problem_text: "Maria has 23 stickers. She buys 15 more stickers at the store. Then she gives 8 stickers to her friend. How many stickers does Maria have now?",
    quantities: [
      { name: "initial_stickers", value: 23, unit: "stickers" },
      { name: "bought_stickers", value: 15, unit: "stickers" },
      { name: "given_stickers", value: 8, unit: "stickers" },
    ],
    unknown: "final_stickers",
    operations: ["addition", "subtraction"],
    equation: "23 + 15 - 8 = x",
    solution_steps: [
      { step: 1, description: "Start with 23 stickers", math: "23" },
      { step: 2, description: "Add 15 more stickers", math: "23 + 15 = 38" },
      { step: 3, description: "Subtract 8 given away", math: "38 - 8 = 30" },
      { step: 4, description: "Maria has 30 stickers", math: "x = 30" },
    ],
    difficulty: 1,
    expectedOperation: "mixed",
    acceptedOperations: ["addition", "subtraction"],
    answerEquation: "23 + 15 - 8 = x",
    autoEquation: "x = 23 + 15 - 8",
    highlightPhrases: ["23 stickers", "15 more stickers", "8 stickers"],
    hintCues: [
      "Tap the sticker amounts first.",
      "Maria is getting more stickers, then losing some.",
      "Start with 23, then add 15, then subtract 8.",
    ],
  },
  "550e8400-e29b-41d4-a716-446655440002": {
    id: "550e8400-e29b-41d4-a716-446655440002",
    grade_band: "6-8",
    topic: "Boxes of Pencils",
    problem_text: "A box contains 6 pencils. There are 4 boxes. How many pencils are there in total?",
    quantities: [
      { name: "pencils_per_box", value: 6, unit: "pencils" },
      { name: "number_of_boxes", value: 4, unit: "boxes" },
    ],
    unknown: "total_pencils",
    operations: ["multiplication"],
    equation: "6 × 4 = x",
    solution_steps: [
      { step: 1, description: "6 pencils in each box", math: "6" },
      { step: 2, description: "4 boxes total", math: "× 4" },
      { step: 3, description: "Multiply to find total", math: "6 × 4 = 24" },
      { step: 4, description: "There are 24 pencils", math: "x = 24" },
    ],
    difficulty: 1,
    expectedOperation: "multiplication",
    acceptedOperations: ["multiplication"],
    answerEquation: "6 × 4 = x",
    autoEquation: "x = 6 × 4",
    highlightPhrases: ["6 pencils", "4 boxes"],
    hintCues: [
      "Tap both number chips.",
      "This story is about equal groups.",
      "Try multiplication because the same amount repeats 4 times.",
    ],
  },
  "550e8400-e29b-41d4-a716-446655440011": {
    id: "550e8400-e29b-41d4-a716-446655440011",
    grade_band: "algebra-1",
    topic: "Phone Plan",
    problem_text: "A phone plan costs $25 per month plus $0.10 per text message. If your bill was $37.50 last month, how many text messages did you send?",
    quantities: [
      { name: "base_cost", value: 25, unit: "dollars" },
      { name: "cost_per_text", value: 0.10, unit: "dollars" },
      { name: "total_bill", value: 37.50, unit: "dollars" },
    ],
    unknown: "number_of_texts",
    operations: ["subtraction", "division"],
    equation: "25 + 0.10x = 37.50",
    solution_steps: [
      { step: 1, description: "Write the equation", math: "25 + 0.10x = 37.50" },
      { step: 2, description: "Subtract 25 from both sides", math: "0.10x = 12.50" },
      { step: 3, description: "Divide by 0.10", math: "x = 125" },
      { step: 4, description: "You sent 125 text messages", math: "x = 125" },
    ],
    difficulty: 3,
    expectedOperation: "mixed",
    acceptedOperations: ["subtraction", "division"],
    answerEquation: "25 + 0.10x = 37.50",
    autoEquation: "25 + 0.10x = 37.50",
    highlightPhrases: ["$25 per month", "$0.10 per text", "$37.50"],
    hintCues: [
      "Tap the price numbers.",
      "This is a start amount plus a per-text amount.",
      "Subtraction and division help isolate the number of texts.",
    ],
  },
}

export function getStoryProblem(problemId: string): StoryProblem | null {
  return STORY_PROBLEMS[problemId] ?? null
}

export function listStoryProblems() {
  return Object.values(STORY_PROBLEMS)
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[\s_]+/g, " ")
    .replace(/[×*]/g, "x")
    .replace(/[÷/]/g, "/")
    .replace(/\s*\+\s*/g, "+")
    .replace(/\s*-\s*/g, "-")
    .replace(/\s*=\s*/g, "=")
    .trim()
}

function extractSelectedValues(input: Record<string, unknown>) {
  const rawSelections = input.selectedValues ?? input.quantities ?? input.spotSelections ?? []
  if (!Array.isArray(rawSelections)) return [] as number[]

  return rawSelections
    .map((item) => {
      if (typeof item === "number") return item
      if (typeof item === "string") return Number(item)
      if (item && typeof item === "object" && "value" in item) {
        return Number((item as { value?: unknown }).value)
      }
      return Number.NaN
    })
    .filter((value) => Number.isFinite(value))
}

function buildFeedback(message: string, isValid: boolean, correction: string, studentInput: unknown, type: string): AIFeedback {
  return {
    isValid,
    message,
    misconceptions: isValid
      ? []
      : [
          {
            type,
            description: correction,
            severity: "medium",
            studentInput: JSON.stringify(studentInput ?? ""),
            correction,
          },
        ],
    encouragement: isValid ? "Nice work. You found the right part of the story." : "Keep going. The story is giving you clues.",
    confidence: isValid ? 0.96 : 0.62,
  }
}

export function evaluateAnswer(problem: StoryProblem, stage: StoryStage, studentInput: Record<string, unknown>): AnswerEngineResult {
  if (stage === "spot") {
    const expected = problem.quantities
      .map((quantity) => quantity.value)
      .filter((value): value is number => typeof value === "number")
      .sort((a, b) => a - b)
    const selected = extractSelectedValues(studentInput).sort((a, b) => a - b)

    const isValid = expected.length > 0 && expected.length === selected.length && expected.every((value, index) => value === selected[index])

    return {
      feedback: buildFeedback(
        isValid
          ? "Nice! You spotted the important numbers and units."
          : `Try the numbers that really matter: ${expected.join(", ")}.`,
        isValid,
        "Tap the numbers that actually appear in the story.",
        studentInput,
        "missing_quantity",
      ),
      confidence: isValid ? 0.95 : 0.55,
    }
  }

  if (stage === "pick") {
    const chosen = String(studentInput.operation ?? studentInput.choice ?? studentInput.selectedOperation ?? "").toLowerCase()
    const isValid = problem.acceptedOperations.includes(chosen)

    return {
      feedback: buildFeedback(
        isValid
          ? "Yes. That action matches the story."
          : `Look again. This story is about ${problem.acceptedOperations.join(" and ")}.`,
        isValid,
        `Choose one of these actions: ${problem.acceptedOperations.join(", ")}.`,
        studentInput,
        "wrong_operation",
      ),
      confidence: isValid ? 0.9 : 0.6,
    }
  }

  const equationInput = String(studentInput.equation ?? studentInput.answer ?? studentInput.value ?? "")
  const normalizedInput = normalize(equationInput)
  const normalizedExpected = normalize(problem.answerEquation)
  const isValid = normalizedInput === normalizedExpected || normalizedInput === normalize(problem.autoEquation)

  return {
    feedback: buildFeedback(
      isValid
        ? "Boom. That equation matches the story."
        : `Check the structure. The equation should look like ${problem.autoEquation}.`,
      isValid,
      `Try building the equation as: ${problem.autoEquation}.`,
      studentInput,
      "equation_structure",
    ),
    confidence: isValid ? 0.98 : 0.7,
  }
}

export function buildHint(problem: StoryProblem, stage: StoryStage, hintLevel: number, language: LanguageCode = "en"): Hint {
  const key = language === "hi" ? "hi" : "en"
  const level = Math.min(Math.max(hintLevel, 1), 3) as 1 | 2 | 3
  const hint = MATH_HINTS[key][stage][level - 1]

  return {
    level,
    hint: stage === "confirm" && level === 3 ? `${hint} ${problem.autoEquation}` : hint,
    isRevealing: level === 3,
  }
}
