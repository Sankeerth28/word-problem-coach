// Generated Supabase TypeScript types
// Run `npx supabase gen types typescript --project-id YOUR_PROJECT_ID` to regenerate

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      problems: {
        Row: {
          id: string
          grade_band: '3-5' | '6-8' | 'algebra-1'
          topic: string
          problem_text: string
          quantities: Json
          unknown: string
          operations: string[]
          equation: string
          solution_steps: Json
          diagram_url: string | null
          difficulty: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          grade_band: '3-5' | '6-8' | 'algebra-1'
          topic: string
          problem_text: string
          quantities?: Json
          unknown: string
          operations?: string[]
          equation: string
          solution_steps?: Json
          diagram_url?: string | null
          difficulty?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          grade_band?: '3-5' | '6-8' | 'algebra-1'
          topic?: string
          problem_text?: string
          quantities?: Json
          unknown?: string
          operations?: string[]
          equation?: string
          solution_steps?: Json
          diagram_url?: string | null
          difficulty?: number
          created_at?: string
          updated_at?: string
        }
      }
      attempts: {
        Row: {
          id: string
          problem_id: string | null
          session_id: string
          student_quantities: Json
          student_unknown: string | null
          student_operations: string[]
          student_equation: string | null
          ai_feedback: Json
          misconception_tags: string[]
          is_correct: boolean | null
          time_spent_seconds: number
          step_reached: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          problem_id?: string | null
          session_id: string
          student_quantities?: Json
          student_unknown?: string | null
          student_operations?: string[]
          student_equation?: string | null
          ai_feedback?: Json
          misconception_tags?: string[]
          is_correct?: boolean | null
          time_spent_seconds?: number
          step_reached?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          problem_id?: string | null
          session_id?: string
          student_quantities?: Json
          student_unknown?: string | null
          student_operations?: string[]
          student_equation?: string | null
          ai_feedback?: Json
          misconception_tags?: string[]
          is_correct?: boolean | null
          time_spent_seconds?: number
          step_reached?: string
          created_at?: string
          updated_at?: string
        }
      }
      misconception_logs: {
        Row: {
          id: string
          attempt_id: string | null
          misconception_type: string
          description: string | null
          severity: 'low' | 'medium' | 'high' | null
          created_at: string
        }
        Insert: {
          id?: string
          attempt_id?: string | null
          misconception_type: string
          description?: string | null
          severity?: 'low' | 'medium' | 'high' | null
          created_at?: string
        }
        Update: {
          id?: string
          attempt_id?: string | null
          misconception_type?: string
          description?: string | null
          severity?: 'low' | 'medium' | 'high' | null
          created_at?: string
        }
      }
      progress: {
        Row: {
          id: string
          session_id: string
          total_attempts: number
          correct_attempts: number
          topics_mastered: string[]
          topics_struggling: string[]
          last_active: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          total_attempts?: number
          correct_attempts?: number
          topics_mastered?: string[]
          topics_struggling?: string[]
          last_active?: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          total_attempts?: number
          correct_attempts?: number
          topics_mastered?: string[]
          topics_struggling?: string[]
          last_active?: string
          created_at?: string
        }
      }
      hint_usage: {
        Row: {
          id: string
          attempt_id: string | null
          hint_level: number
          hint_text: string
          was_helpful: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          attempt_id?: string | null
          hint_level: number
          hint_text: string
          was_helpful?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          attempt_id?: string | null
          hint_level?: number
          hint_text?: string
          was_helpful?: boolean | null
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
