import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"
import type { GradeBand } from "@/lib/types"

// GET /api/problems/[grade] - Fetch problems by grade band
export async function GET(
  request: Request,
  { params }: { params: Promise<{ grade: string }> }
) {
  try {
    const { grade } = await params
    const gradeBand = grade as GradeBand

    // Validate grade band
    if (!['3-5', '6-8', 'algebra-1'].includes(gradeBand)) {
      return NextResponse.json(
        { success: false, error: 'Invalid grade band' },
        { status: 400 }
      )
    }

    // Fetch from Supabase
    const { data: problems, error } = await supabase
      .from('problems')
      .select('*')
      .eq('grade_band', gradeBand)
      .order('difficulty', { ascending: true })
      .limit(10)

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    // Return mock data if no problems found (for demo)
    if (!problems || problems.length === 0) {
      const mockProblems = getMockProblems(gradeBand)
      return NextResponse.json({
        success: true,
        data: mockProblems,
      })
    }

    return NextResponse.json({
      success: true,
      data: problems,
    })
  } catch (error) {
    console.error('Error fetching problems:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch problems' },
      { status: 500 }
    )
  }
}

// Mock problems for demo/testing
function getMockProblems(gradeBand: GradeBand) {
  const problems = {
    '3-5': [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        grade_band: '3-5',
        topic: 'Addition & Subtraction',
        problem_text: 'Maria has 23 stickers. She buys 15 more stickers at the store. Then she gives 8 stickers to her friend. How many stickers does Maria have now?',
        quantities: [
          { name: 'initial_stickers', value: 23, unit: 'stickers' },
          { name: 'bought_stickers', value: 15, unit: 'stickers' },
          { name: 'given_stickers', value: 8, unit: 'stickers' },
        ],
        unknown: 'final_stickers',
        operations: ['addition', 'subtraction'],
        equation: '23 + 15 - 8 = x',
        solution_steps: [
          { step: 1, description: 'Start with 23 stickers', math: '23' },
          { step: 2, description: 'Add 15 more stickers', math: '23 + 15 = 38' },
          { step: 3, description: 'Subtract 8 given away', math: '38 - 8 = 30' },
          { step: 4, description: 'Maria has 30 stickers', math: 'x = 30' },
        ],
        difficulty: 1,
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        grade_band: '3-5',
        topic: 'Multiplication',
        problem_text: 'A box contains 6 pencils. There are 4 boxes. How many pencils are there in total?',
        quantities: [
          { name: 'pencils_per_box', value: 6, unit: 'pencils' },
          { name: 'number_of_boxes', value: 4, unit: 'boxes' },
        ],
        unknown: 'total_pencils',
        operations: ['multiplication'],
        equation: '6 × 4 = x',
        solution_steps: [
          { step: 1, description: '6 pencils in each box', math: '6' },
          { step: 2, description: '4 boxes total', math: '× 4' },
          { step: 3, description: 'Multiply to find total', math: '6 × 4 = 24' },
          { step: 4, description: 'There are 24 pencils', math: 'x = 24' },
        ],
        difficulty: 1,
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440005',
        grade_band: '3-5',
        topic: 'Multi-step',
        problem_text: 'Tom has $50. He buys 3 books that cost $8 each. How much money does Tom have left?',
        quantities: [
          { name: 'initial_money', value: 50, unit: 'dollars' },
          { name: 'books_bought', value: 3, unit: 'books' },
          { name: 'cost_per_book', value: 8, unit: 'dollars' },
        ],
        unknown: 'remaining_money',
        operations: ['multiplication', 'subtraction'],
        equation: '50 - (3 × 8) = x',
        solution_steps: [
          { step: 1, description: 'Find total cost of books', math: '3 × $8 = $24' },
          { step: 2, description: 'Subtract from initial money', math: '$50 - $24' },
          { step: 3, description: 'Calculate remaining', math: '$50 - $24 = $26' },
          { step: 4, description: 'Tom has $26 left', math: 'x = 26' },
        ],
        difficulty: 3,
      },
    ],
    '6-8': [
      {
        id: '550e8400-e29b-41d4-a716-446655440006',
        grade_band: '6-8',
        topic: 'Ratios',
        problem_text: 'The ratio of boys to girls in a class is 3:4. There are 21 boys in the class. How many students are there in total?',
        quantities: [
          { name: 'ratio_boys', value: 3, unit: 'parts' },
          { name: 'ratio_girls', value: 4, unit: 'parts' },
          { name: 'actual_boys', value: 21, unit: 'students' },
        ],
        unknown: 'total_students',
        operations: ['ratio', 'multiplication', 'addition'],
        equation: '21 ÷ 3 = 7 (multiplier), (3 + 4) × 7 = x',
        solution_steps: [
          { step: 1, description: 'Find the multiplier', math: '21 ÷ 3 = 7' },
          { step: 2, description: 'Total ratio parts', math: '3 + 4 = 7 parts' },
          { step: 3, description: 'Multiply by multiplier', math: '7 × 7 = 49' },
          { step: 4, description: 'There are 49 students total', math: 'x = 49' },
        ],
        difficulty: 3,
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440007',
        grade_band: '6-8',
        topic: 'Percentages',
        problem_text: 'A shirt originally costs $45. It is on sale for 20% off. What is the sale price?',
        quantities: [
          { name: 'original_price', value: 45, unit: 'dollars' },
          { name: 'discount_percent', value: 20, unit: 'percent' },
        ],
        unknown: 'sale_price',
        operations: ['percentage', 'subtraction'],
        equation: '45 - (45 × 0.20) = x',
        solution_steps: [
          { step: 1, description: 'Calculate discount amount', math: '$45 × 0.20 = $9' },
          { step: 2, description: 'Subtract discount from original', math: '$45 - $9' },
          { step: 3, description: 'Sale price', math: '$45 - $9 = $36' },
          { step: 4, description: 'The sale price is $36', math: 'x = 36' },
        ],
        difficulty: 2,
      },
    ],
    'algebra-1': [
      {
        id: '550e8400-e29b-41d4-a716-446655440011',
        grade_band: 'algebra-1',
        topic: 'Linear Equations',
        problem_text: 'A phone plan costs $25 per month plus $0.10 per text message. If your bill was $37.50 last month, how many text messages did you send?',
        quantities: [
          { name: 'base_cost', value: 25, unit: 'dollars' },
          { name: 'cost_per_text', value: 0.10, unit: 'dollars' },
          { name: 'total_bill', value: 37.50, unit: 'dollars' },
        ],
        unknown: 'number_of_texts',
        operations: ['algebra', 'subtraction', 'division'],
        equation: '25 + 0.10x = 37.50',
        solution_steps: [
          { step: 1, description: 'Write the equation', math: '25 + 0.10x = 37.50' },
          { step: 2, description: 'Subtract 25 from both sides', math: '0.10x = 12.50' },
          { step: 3, description: 'Divide by 0.10', math: 'x = 125' },
          { step: 4, description: 'You sent 125 text messages', math: 'x = 125' },
        ],
        difficulty: 3,
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440012',
        grade_band: 'algebra-1',
        topic: 'Systems of Equations',
        problem_text: 'The sum of two numbers is 45. The difference between the two numbers is 15. What are the two numbers?',
        quantities: [
          { name: 'sum', value: 45, unit: '' },
          { name: 'difference', value: 15, unit: '' },
        ],
        unknown: 'both_numbers',
        operations: ['algebra', 'addition', 'subtraction'],
        equation: 'x + y = 45, x - y = 15',
        solution_steps: [
          { step: 1, description: 'Set up the system', math: 'x + y = 45, x - y = 15' },
          { step: 2, description: 'Add the equations', math: '2x = 60' },
          { step: 3, description: 'Solve for x', math: 'x = 30' },
          { step: 4, description: 'Substitute to find y', math: '30 + y = 45, y = 15' },
          { step: 5, description: 'The numbers are 30 and 15', math: 'x = 30, y = 15' },
        ],
        difficulty: 4,
      },
    ],
  }

  return problems[gradeBand] || problems['3-5']
}
