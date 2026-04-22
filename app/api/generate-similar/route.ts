import { NextResponse } from "next/server"
import { generateAIResponse, parseAISimilarProblem } from "@/lib/ai/client"
import { SIMILAR_PROBLEM_GENERATION_PROMPT, composePrompt } from "@/lib/ai/prompts"
import type { Problem } from "@/lib/types"

// POST /api/generate-similar - Generate a simpler analogous problem
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      problemId,
      gradeBand,
      topic,
    } = body

    // Validate required fields
    if (!problemId || !gradeBand || !topic) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get the original problem
    const originalProblem = await getProblem(problemId)

    if (!originalProblem) {
      return NextResponse.json(
        { success: false, error: 'Problem not found' },
        { status: 404 }
      )
    }

    // Compose the similar problem generation prompt
    const prompt = composePrompt(SIMILAR_PROBLEM_GENERATION_PROMPT, {
      original_problem: originalProblem.problem_text,
      grade_band: gradeBand,
      topic: topic,
      operations: originalProblem.operations,
    })

    // Call AI
    const aiResponse = await generateAIResponse({
      prompt,
      systemPrompt: "You are the Word Problem Coach AI. Generate a simpler analogous problem with the same mathematical structure. Respond with valid JSON.",
      jsonMode: true,
    })

    if (!aiResponse) {
      throw new Error('AI returned no response')
    }

    // Parse the response
    const similarProblemData = parseAISimilarProblem(JSON.stringify(aiResponse))

    if (!similarProblemData) {
      throw new Error('Failed to parse similar problem')
    }

    // Create a new problem object
    const similarProblem: Problem = {
      id: `similar-${Date.now()}`,
      grade_band: gradeBand,
      topic: topic,
      problem_text: similarProblemData.problem_text,
      quantities: similarProblemData.quantities,
      unknown: similarProblemData.unknown,
      operations: similarProblemData.operations,
      equation: similarProblemData.equation,
      solution_steps: similarProblemData.solution_steps,
      difficulty: Math.max(1, similarProblemData.difficulty),
    }

    return NextResponse.json({
      success: true,
      problem: similarProblem,
    })
  } catch (error) {
    console.error('Similar problem generation error:', error)

    // Return a fallback similar problem
    const fallbackProblem: Problem = {
      id: `fallback-${Date.now()}`,
      grade_band: '3-5',
      topic: 'Practice',
      problem_text: 'Here is a similar problem to practice with. Try applying the same steps you just learned!',
      quantities: [{ name: 'practice', value: 10, unit: 'items' }],
      unknown: 'the answer',
      operations: ['addition'],
      equation: '10 + 5 = x',
      solution_steps: [
        { step: 1, description: 'Identify the quantities', math: '10 and 5' },
        { step: 2, description: 'Add them together', math: '10 + 5 = 15' },
        { step: 3, description: 'The answer is 15', math: 'x = 15' },
      ],
      difficulty: 1,
    }

    return NextResponse.json({
      success: true,
      problem: fallbackProblem,
    })
  }
}

// Helper to get problem (mock for now)
async function getProblem(problemId: string) {
  type MockProblem = Pick<Problem, 'id' | 'problem_text' | 'quantities' | 'unknown' | 'operations' | 'equation'>

  const mockProblems: Record<string, MockProblem> = {
    '550e8400-e29b-41d4-a716-446655440001': {
      id: '550e8400-e29b-41d4-a716-446655440001',
      problem_text: 'Maria has 23 stickers. She buys 15 more stickers at the store. Then she gives 8 stickers to her friend. How many stickers does Maria have now?',
      quantities: [
        { name: 'initial_stickers', value: 23, unit: 'stickers' },
        { name: 'bought_stickers', value: 15, unit: 'stickers' },
        { name: 'given_stickers', value: 8, unit: 'stickers' },
      ],
      unknown: 'final_stickers',
      operations: ['addition', 'subtraction'],
      equation: '23 + 15 - 8 = x',
    },
    '550e8400-e29b-41d4-a716-446655440002': {
      id: '550e8400-e29b-41d4-a716-446655440002',
      problem_text: 'A box contains 6 pencils. There are 4 boxes. How many pencils are there in total?',
      quantities: [
        { name: 'pencils_per_box', value: 6, unit: 'pencils' },
        { name: 'number_of_boxes', value: 4, unit: 'boxes' },
      ],
      unknown: 'total_pencils',
      operations: ['multiplication'],
      equation: '6 × 4 = x',
    },
    '550e8400-e29b-41d4-a716-446655440011': {
      id: '550e8400-e29b-41d4-a716-446655440011',
      problem_text: 'A phone plan costs $25 per month plus $0.10 per text message. If your bill was $37.50 last month, how many text messages did you send?',
      quantities: [
        { name: 'base_cost', value: 25, unit: 'dollars' },
        { name: 'cost_per_text', value: 0.10, unit: 'dollars' },
        { name: 'total_bill', value: 37.50, unit: 'dollars' },
      ],
      unknown: 'number_of_texts',
      operations: ['algebra', 'subtraction', 'division'],
      equation: '25 + 0.10x = 37.50',
    },
  }

  return mockProblems[problemId] || mockProblems['550e8400-e29b-41d4-a716-446655440001']
}
