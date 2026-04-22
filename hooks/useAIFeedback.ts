"use client"

import { useState, useCallback } from "react"
import type {
  AIFeedback,
  Hint,
  ProblemStep,
  StudentQuantity,
  Problem,
} from "@/lib/types"

export function useAIFeedback(problem?: Problem) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversationHistory, setConversationHistory] = useState<Array<{
    role: string
    content: string
  }>>([])

  const evaluateStep = useCallback(async (
    step: ProblemStep,
    studentInput: {
      quantities?: StudentQuantity[]
      unknown?: string
      operations?: string[]
      relationship?: string
      equation?: string
    }
  ): Promise<AIFeedback | null> => {
    if (!problem) return null

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: problem.id,
          step,
          studentInput,
          conversationHistory,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI feedback')
      }

      const data = await response.json()
      setConversationHistory(prev => [...prev,
        { role: 'user', content: JSON.stringify(studentInput) },
        { role: 'assistant', content: data.feedback.message }
      ])

      return data.feedback
    } catch (err) {
      console.error('AI Evaluation Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to get feedback')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [problem, conversationHistory])

  const getHint = useCallback(async (
    step: ProblemStep,
    studentInput: {
      quantities?: StudentQuantity[]
      unknown?: string
      operations?: string[]
      relationship?: string
      equation?: string
    },
    currentHintLevel: number
  ): Promise<Hint | null> => {
    if (!problem) return null

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/hints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: problem.id,
          step,
          studentInput,
          currentHintLevel,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get hint')
      }

      const data = await response.json()
      return data.hint
    } catch (err) {
      console.error('AI Hint Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to get hint')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [problem])

  const getSimilarProblem = useCallback(async (): Promise<Problem | null> => {
    if (!problem) return null

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-similar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: problem.id,
          gradeBand: problem.grade_band,
          topic: problem.topic,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate similar problem')
      }

      const data = await response.json()
      return data.problem
    } catch (err) {
      console.error('Similar Problem Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate similar problem')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [problem])

  const checkSolution = useCallback(async (): Promise<{
    introduction: string
    solution_steps: string[]
    final_answer: string
    closing_encouragement: string
  } | null> => {
    if (!problem) return null

    setIsLoading(true)
    setError(null)

    try {
      // This would be a separate API endpoint or part of evaluate
      // For now, we'll handle it in the component
      return {
        introduction: "Great work completing all the steps!",
        solution_steps: problem.solution_steps.map(s => `${s.step}. ${s.description}: ${s.math}`),
        final_answer: problem.equation,
        closing_encouragement: "You're thinking like a mathematician! 🌟",
      }
    } catch (err) {
      console.error('Solution Check Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to check solution')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [problem])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const clearHistory = useCallback(() => {
    setConversationHistory([])
  }, [])

  return {
    isLoading,
    error,
    conversationHistory,
    evaluateStep,
    getHint,
    getSimilarProblem,
    checkSolution,
    clearError,
    clearHistory,
  }
}
