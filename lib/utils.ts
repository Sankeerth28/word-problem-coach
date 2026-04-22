import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatLaTeX(equation: string): string {
  // Convert common math symbols to LaTeX format
  return equation
    .replace(/×/g, '\\times ')
    .replace(/÷/g, '\\div ')
    .replace(/=/g, ' = ')
    .replace(/\^/g, '^')
    .replace(/(\d+)\/(\d+)/g, '\\frac{$1}{$2}')
}

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

export function getSessionId(): string {
  if (typeof window === 'undefined') {
    return 'server-session'
  }

  let sessionId = localStorage.getItem('wpc_session_id')
  if (!sessionId) {
    sessionId = generateSessionId()
    localStorage.setItem('wpc_session_id', sessionId)
  }
  return sessionId
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins > 0) {
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  return `${secs}s`
}

export function getGradeBandColor(gradeBand: string): string {
  const colors: Record<string, string> = {
    '3-5': 'bg-green-500',
    '6-8': 'bg-blue-500',
    'algebra-1': 'bg-purple-500',
  }
  return colors[gradeBand] || 'bg-gray-500'
}

export function getGradeBandTextColor(gradeBand: string): string {
  const colors: Record<string, string> = {
    '3-5': 'text-green-600',
    '6-8': 'text-blue-600',
    'algebra-1': 'text-purple-600',
  }
  return colors[gradeBand] || 'text-gray-600'
}

export function getDifficultyLabel(difficulty: number): string {
  if (difficulty <= 1) return '🌱 Starter'
  if (difficulty === 2) return '🌿 Growing'
  if (difficulty === 3) return '🌳 Getting There'
  if (difficulty === 4) return '🏔️ Challenging'
  return '🏆 Expert'
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim()
    .substring(0, 500)
}

export function parseEquationInput(input: string): string {
  // Normalize common variations
  return input
    .replace(/\s+/g, ' ')
    .replace(/x/g, 'x')
    .replace(/\*/g, '×')
    .replace(/\//g, '÷')
    .trim()
}

export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}

export function getEncouragementMessage(isCorrect: boolean, _step: string): string {
  void _step

  const correctMessages = [
    "Awesome work! 🎉",
    "You're crushing it! 🔥",
    "Math legend in the making! ⭐",
    "That's the way! 💪",
    "Perfect thinking! ✨",
  ]

  const keepGoingMessages = [
    "Keep going, you got this! 💪",
    "On the right track! 🚀",
    "Great start! Let's continue! 🌟",
    "You're thinking like a mathematician! 🧮",
    "Love the effort! Let's build on this! 📈",
  ]

  const messages = isCorrect ? correctMessages : keepGoingMessages
  return messages[Math.floor(Math.random() * messages.length)]
}

export function getStepTitle(step: string): string {
  const titles: Record<string, string> = {
    spot: "Spot the Important Stuff",
    pick: "Pick What to Do",
    confirm: "Build and Check",
    quantities: "What do we know?",
    unknown: "What are we solving for?",
    operations: "How are they related?",
    equation: "Build the equation!",
    complete: "You did it!",
  }
  return titles[step] || step
}

export function getStepDescription(step: string): string {
  const descriptions: Record<string, string> = {
    spot: "Tap the numbers and units that matter most",
    pick: "Choose the math action that fits the story",
    confirm: "Check the equation the app builds for you",
    quantities: "List all the important numbers and what they mean",
    unknown: "Figure out what the problem is asking you to find",
    operations: "Choose the math operations that connect everything",
    equation: "Write it all as a math equation",
    complete: "Time to check your work!",
  }
  return descriptions[step] || ""
}

// Operation options for the picker
export const OPERATION_OPTIONS = [
  { id: 'addition', label: 'Addition', symbol: '+', description: 'Combining, total, altogether', gradeBands: ['3-5', '6-8', 'algebra-1'] as const },
  { id: 'subtraction', label: 'Subtraction', symbol: '−', description: 'Taking away, difference, left', gradeBands: ['3-5', '6-8', 'algebra-1'] as const },
  { id: 'multiplication', label: 'Multiplication', symbol: '×', description: 'Groups of, times, product', gradeBands: ['3-5', '6-8', 'algebra-1'] as const },
  { id: 'division', label: 'Division', symbol: '÷', description: 'Sharing, split, per', gradeBands: ['3-5', '6-8', 'algebra-1'] as const },
  { id: 'equals', label: 'Equals', symbol: '=', description: 'Is, results in, gives', gradeBands: ['3-5', '6-8', 'algebra-1'] as const },
  { id: 'ratio', label: 'Ratio', symbol: ':', description: 'Comparison, for every', gradeBands: ['6-8', 'algebra-1'] as const },
  { id: 'rate', label: 'Rate', symbol: 'per', description: 'Speed, price per, each', gradeBands: ['6-8', 'algebra-1'] as const },
  { id: 'percent', label: 'Percent', symbol: '%', description: 'Out of 100, portion', gradeBands: ['6-8', 'algebra-1'] as const },
  { id: 'fraction', label: 'Fraction', symbol: 'a/b', description: 'Part of a whole', gradeBands: ['3-5', '6-8'] as const },
  { id: 'proportion', label: 'Proportion', symbol: '::', description: 'Equal ratios', gradeBands: ['6-8', 'algebra-1'] as const },
] as const
