// Word Problem Coach - AI Client Setup
// Using Vercel AI SDK with OpenAI

import { streamText, generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import type { AIFeedback, Hint, Misconception } from '@/lib/types'

function getOpenAIProvider() {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error('OPENAI_API_KEY is missing. Add it to .env.local and restart the dev server.')
  }

  return createOpenAI({ apiKey })
}

// Model configuration
const MODEL_CONFIG = {
  model: 'gpt-4o', // GPT-4o - best for education
  maxTokens: 1024,
  temperature: 0.7, // Balanced creativity/consistency
}

// Streaming response for real-time feedback
export async function streamAIResponse({
  prompt,
  systemPrompt,
  onChunk,
}: {
  prompt: string
  systemPrompt: string
  onChunk?: (chunk: string) => void
}) {
  try {
    const openaiProvider = getOpenAIProvider()
    const result = await streamText({
      model: openaiProvider.languageModel(MODEL_CONFIG.model),
      system: systemPrompt,
      prompt,
      temperature: MODEL_CONFIG.temperature,
      maxTokens: MODEL_CONFIG.maxTokens,
      onFinish: (result) => {
        console.log('AI Response completed:', result.text.substring(0, 100))
      },
    })

    return result
  } catch (error) {
    console.error('AI Streaming Error:', error)
    throw error
  }
}

// Non-streaming response for hints and similar problems
export async function generateAIResponse({
  prompt,
  systemPrompt,
  jsonMode = false,
}: {
  prompt: string
  systemPrompt: string
  jsonMode?: boolean
}) {
  try {
    const openaiProvider = getOpenAIProvider()
    const result = await generateText({
      model: openaiProvider.languageModel(MODEL_CONFIG.model),
      system: systemPrompt,
      prompt,
      temperature: jsonMode ? 0.3 : MODEL_CONFIG.temperature, // Lower temp for JSON
      maxTokens: MODEL_CONFIG.maxTokens,
    })

    if (jsonMode) {
      // Extract JSON from response if wrapped in markdown
      const jsonMatch = result.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0])
        } catch (parseError) {
          console.error('Failed to parse AI JSON response:', parseError)
          console.log('Raw response:', result.text)
          return null
        }
      }
      return null
    }

    return result.text
  } catch (error) {
    console.error('AI Generation Error:', error)
    throw error
  }
}

// Conversation memory helper
export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: Date
}

export function buildConversationContext(
  messages: ConversationMessage[],
  maxMessages = 10
): string {
  const recentMessages = messages.slice(-maxMessages)

  return recentMessages
    .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
    .join('\n\n')
}

// Structured response parsers
export function parseAIFeedback(response: string): AIFeedback {
  const normalizeSeverity = (severity: unknown): Misconception['severity'] => {
    if (severity === 'low' || severity === 'medium' || severity === 'high') {
      return severity
    }
    return 'medium'
  }

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const parsed = JSON.parse(jsonMatch[0])

    return {
      isValid: parsed.isValid ?? false,
      message: parsed.message ?? 'Good thinking! Let\'s work through this.',
      misconceptions: Array.isArray(parsed.misconceptions)
        ? parsed.misconceptions.map((m: any) => ({
            type: m?.type ?? 'unknown',
            description: m?.description ?? '',
            severity: normalizeSeverity(m?.severity),
            studentInput: m?.studentInput ?? '',
            correction: m?.correction ?? '',
          }))
        : [],
      encouragement: parsed.encouragement ?? 'Keep going!',
      nextStepHint: parsed.nextStepHint,
    }
  } catch (error) {
    console.error('Failed to parse feedback:', error)
    // Return safe defaults
    return {
      isValid: false,
      message: 'Interesting approach! Let me help you think about this...',
      misconceptions: [],
      encouragement: 'You\'re on the right track!',
      nextStepHint: undefined,
    }
  }
}

export function parseAIHint(response: string): Hint {
  const normalizeLevel = (level: unknown): Hint['level'] => {
    if (level === 1 || level === 2 || level === 3) {
      return level
    }
    return 1
  }

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in hint response')
    }

    const parsed = JSON.parse(jsonMatch[0])

    return {
      hint: parsed.hint ?? 'Think about what the problem is telling you...',
      level: normalizeLevel(parsed.level),
      isRevealing: parsed.isRevealing ?? false,
    }
  } catch (error) {
    console.error('Failed to parse hint:', error)
    return {
      hint: 'Look back at the problem. What quantities are mentioned?',
      level: 1,
      isRevealing: false,
    }
  }
}

export function parseAISimilarProblem(response: string): {
  problem_text: string
  quantities: Array<{ name: string; value: number; unit: string }>
  unknown: string
  operations: string[]
  equation: string
  solution_steps: Array<{ step: number; description: string; math: string }>
  difficulty: number
} | null {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in similar problem response')
    }

    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Failed to parse similar problem:', error)
    return null
  }
}

export function parseAISolution(response: string): {
  introduction: string
  equation_comparison?: string
  solution_steps: string[]
  final_answer: string
  closing_encouragement: string
} {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in solution response')
    }

    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Failed to parse solution:', error)
    return {
      introduction: 'Great work completing all the steps!',
      solution_steps: ['See the correct solution above.'],
      final_answer: 'See above.',
      closing_encouragement: 'Keep practicing - you\'re improving!',
    }
  }
}

// Health check for AI service
export async function checkAIHealth(): Promise<boolean> {
  try {
    await generateAIResponse({
      prompt: 'Respond with just "OK"',
      systemPrompt: 'You are a health check. Respond with just "OK"',
    })
    return true
  } catch {
    return false
  }
}
