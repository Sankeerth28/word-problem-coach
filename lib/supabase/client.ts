import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Using mock data.')
}

export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabaseAny = supabase as any

// Helper to get problems by grade band
export async function getProblemsByGrade(gradeBand: string, limit = 10) {
  const { data, error } = await supabaseAny
    .from('problems')
    .select('*')
    .eq('grade_band', gradeBand)
    .order('difficulty', { ascending: true })
    .limit(limit)

  if (error) {
    console.error('Error fetching problems:', error)
    return []
  }

  return data || []
}

// Helper to get a single problem by ID
export async function getProblemById(id: string) {
  const { data, error } = await supabaseAny
    .from('problems')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching problem:', error)
    return null
  }

  return data
}

// Helper to save an attempt
export async function saveAttempt(attempt: {
  problem_id: string
  session_id: string
  student_quantities: unknown[]
  student_unknown: string
  student_operations: string[]
  student_equation: string
  ai_feedback: unknown
  misconception_tags: string[]
  is_correct: boolean
  time_spent_seconds: number
  step_reached: string
}) {
  const { data, error } = await supabaseAny
    .from('attempts')
    .insert([attempt])
    .select()
    .single()

  if (error) {
    console.error('Error saving attempt:', error)
    return null
  }

  return data
}

// Helper to log a misconception
export async function logMisconception({
  attempt_id,
  misconception_type,
  description,
  severity,
}: {
  attempt_id: string
  misconception_type: string
  description?: string
  severity: 'low' | 'medium' | 'high'
}) {
  const { data, error } = await supabaseAny
    .from('misconception_logs')
    .insert([{
      attempt_id,
      misconception_type,
      description,
      severity,
    }])
    .select()
    .single()

  if (error) {
    console.error('Error logging misconception:', error)
    return null
  }

  return data
}

// Helper to log hint usage
export async function logHintUsage({
  attempt_id,
  hint_level,
  hint_text,
  was_helpful,
}: {
  attempt_id: string
  hint_level: number
  hint_text: string
  was_helpful?: boolean
}) {
  const { data, error } = await supabaseAny
    .from('hint_usage')
    .insert([{
      attempt_id,
      hint_level,
      hint_text,
      was_helpful,
    }])
    .select()
    .single()

  if (error) {
    console.error('Error logging hint usage:', error)
    return null
  }

  return data
}

// Helper to get or create progress
export async function getOrCreateProgress(sessionId: string) {
  const { data: existing } = await supabaseAny
    .from('progress')
    .select('*')
    .eq('session_id', sessionId)
    .single()

  if (existing) {
    return existing
  }

  const { data: newProgress } = await supabaseAny
    .from('progress')
    .insert([{
      session_id: sessionId,
      total_attempts: 0,
      correct_attempts: 0,
      topics_mastered: [],
      topics_struggling: [],
    }])
    .select()
    .single()

  return newProgress
}

// Helper to update progress
export async function updateProgress(
  sessionId: string,
  updates: {
    total_attempts?: number
    correct_attempts?: number
    topics_mastered?: string[]
    topics_struggling?: string[]
  }
) {
  const { data, error } = await supabaseAny
    .from('progress')
    .update(updates)
    .eq('session_id', sessionId)
    .select()
    .single()

  if (error) {
    console.error('Error updating progress:', error)
    return null
  }

  return data
}
