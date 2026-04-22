import { NextResponse } from "next/server"
import type { Hint } from "@/lib/types"
import { buildHint, getStoryProblem } from "@/lib/answer-engine"

// POST /api/hints - Generate scaffolded hints
export async function POST(request: Request) {
  let requestedHintLevel: number = 1
  let stepForFallback: string = 'quantities'
  let problemIdForFallback: string | undefined

  try {
    const body = await request.json()
    const {
      problemId,
      step,
      currentHintLevel,
    } = body

    requestedHintLevel = currentHintLevel
    stepForFallback = step
    problemIdForFallback = problemId

    // Validate required fields
    if (!problemId || !step || currentHintLevel === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Cap hint level at 3
    const hintLevel = Math.min(Math.max(currentHintLevel, 1), 3) as Hint['level']

    const problem = getStoryProblem(problemId)

    if (!problem) {
      return NextResponse.json(
        { success: false, error: 'Problem not found' },
        { status: 404 }
      )
    }

    const hint: Hint = buildHint(problem, step === 'operations' ? 'pick' : step === 'equation' ? 'confirm' : 'spot', hintLevel)

    return NextResponse.json({
      success: true,
      hint,
      nextHintLevel: hintLevel < 3 ? hintLevel + 1 : 3,
    })
  } catch (error) {
    console.error('Hint generation error:', error)

    const level = Math.min(requestedHintLevel, 3) as Hint['level']
    const fallbackProblem = (problemIdForFallback ? getStoryProblem(problemIdForFallback) : null) ?? getStoryProblem('550e8400-e29b-41d4-a716-446655440001')
    const fallbackHint = buildHint(fallbackProblem!, stepForFallback === 'operations' ? 'pick' : stepForFallback === 'equation' ? 'confirm' : 'spot', level)

    return NextResponse.json({
      success: true,
      hint: fallbackHint,
      nextHintLevel: Math.min(requestedHintLevel + 1, 3),
    })
  }
}

