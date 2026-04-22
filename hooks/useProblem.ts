"use client"

import { useState, useCallback, useEffect } from "react"
import type { Problem, ProblemState, ProblemStep, StudentQuantity } from "@/lib/types"
import { STEP_ORDER } from "@/lib/constants"
import { getSessionId } from "@/lib/utils"

const initialState: ProblemState = {
  currentStep: 'quantities',
  quantities: [],
  unknown: '',
  operations: [],
  relationship: '',
  equation: '',
  feedback: null,
  hints: [],
  currentHintLevel: 0,
  isComplete: false,
  showSolution: false,
}

export function useProblem(problem?: Problem) {
  const [state, setState] = useState<ProblemState>(initialState)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [timeSpent, setTimeSpent] = useState(0)

  // Track time spent
  useEffect(() => {
    if (!startTime || state.isComplete) return

    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime.getTime()) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime, state.isComplete])

  // Reset when problem changes
  useEffect(() => {
    if (problem) {
      setState(initialState)
      setStartTime(new Date())
      setTimeSpent(0)
    }
  }, [problem])

  const updateStep = useCallback((updates: Partial<ProblemState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  const nextStep = useCallback(() => {
    setState(prev => {
      const currentIndex = STEP_ORDER.indexOf(prev.currentStep)
      const nextIndex = currentIndex + 1

      if (nextIndex >= STEP_ORDER.length) {
        return { ...prev, isComplete: true, currentStep: 'complete' }
      }

      return { ...prev, currentStep: STEP_ORDER[nextIndex] as ProblemStep }
    })
  }, [])

  const prevStep = useCallback(() => {
    setState(prev => {
      const currentIndex = STEP_ORDER.indexOf(prev.currentStep)
      const prevIndex = Math.max(0, currentIndex - 1)

      return { ...prev, currentStep: STEP_ORDER[prevIndex] as ProblemStep }
    })
  }, [])

  const setQuantities = useCallback((quantities: StudentQuantity[]) => {
    setState(prev => ({ ...prev, quantities }))
  }, [])

  const setUnknown = useCallback((unknown: string) => {
    setState(prev => ({ ...prev, unknown }))
  }, [])

  const setOperations = useCallback((operations: string[]) => {
    setState(prev => ({ ...prev, operations }))
  }, [])

  const setRelationship = useCallback((relationship: string) => {
    setState(prev => ({ ...prev, relationship }))
  }, [])

  const setEquation = useCallback((equation: string) => {
    setState(prev => ({ ...prev, equation }))
  }, [])

  const setFeedback = useCallback((feedback: string | null) => {
    setState(prev => ({ ...prev, feedback }))
  }, [])

  const addHint = useCallback((hint: string) => {
    setState(prev => ({ ...prev, hints: [...prev.hints, hint] }))
  }, [])

  const incrementHintLevel = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentHintLevel: Math.min(prev.currentHintLevel + 1, 3)
    }))
  }, [])

  const resetHintLevel = useCallback(() => {
    setState(prev => ({ ...prev, currentHintLevel: 0 }))
  }, [])

  const setShowSolution = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showSolution: show }))
  }, [])

  const markComplete = useCallback(() => {
    setState(prev => ({ ...prev, isComplete: true, currentStep: 'complete' }))
  }, [])

  const resetProblem = useCallback(() => {
    setState(initialState)
    setStartTime(new Date())
    setTimeSpent(0)
  }, [])

  const getCompletedSteps = useCallback((): ProblemStep[] => {
    const currentIndex = STEP_ORDER.indexOf(state.currentStep)
    return STEP_ORDER.slice(0, currentIndex) as ProblemStep[]
  }, [state.currentStep])

  const canProceed = useCallback(() => {
    switch (state.currentStep) {
      case 'quantities':
        return state.quantities.length > 0
      case 'unknown':
        return state.unknown.trim().length > 0
      case 'operations':
        return state.operations.length > 0 && state.relationship.trim().length > 0
      case 'equation':
        return state.equation.trim().length > 0 && state.equation.includes('=')
      default:
        return true
    }
  }, [state])

  const submitAttempt = useCallback(async () => {
    const sessionId = getSessionId()

    try {
      const response = await fetch('/api/submit-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem_id: problem?.id,
          session_id: sessionId,
          student_quantities: state.quantities,
          student_unknown: state.unknown,
          student_operations: state.operations,
          student_equation: state.equation,
          time_spent_seconds: timeSpent,
          step_reached: state.currentStep,
          is_correct: state.isComplete && !state.showSolution,
        }),
      })

      return await response.json()
    } catch (error) {
      console.error('Failed to submit attempt:', error)
      return null
    }
  }, [problem?.id, state, timeSpent])

  return {
    state,
    timeSpent,
    updateStep,
    nextStep,
    prevStep,
    setQuantities,
    setUnknown,
    setOperations,
    setRelationship,
    setEquation,
    setFeedback,
    addHint,
    incrementHintLevel,
    resetHintLevel,
    setShowSolution,
    markComplete,
    resetProblem,
    getCompletedSteps,
    canProceed,
    submitAttempt,
  }
}
