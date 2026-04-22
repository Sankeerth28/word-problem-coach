// Word Problem Coach - TypeScript Types

export type GradeBand = '3-5' | '6-8' | 'algebra-1';

export type ProblemStep = 'quantities' | 'unknown' | 'operations' | 'equation' | 'complete';

export interface Quantity {
  name: string;
  value?: number;
  unit: string;
}

export interface Problem {
  id: string;
  grade_band: GradeBand;
  topic: string;
  problem_text: string;
  quantities: Quantity[];
  unknown: string;
  operations: string[];
  equation: string;
  solution_steps: SolutionStep[];
  diagram_url?: string;
  difficulty: number;
}

export interface SolutionStep {
  step: number;
  description: string;
  math: string;
}

export interface ProblemState {
  currentStep: ProblemStep;
  quantities: StudentQuantity[];
  unknown: string;
  operations: string[];
  relationship: string;
  equation: string;
  feedback: string | null;
  hints: string[];
  currentHintLevel: number;
  isComplete: boolean;
  showSolution: boolean;
}

export interface StudentQuantity {
  name: string;
  value?: number;
  unit: string;
  isCorrect?: boolean;
}

export interface AIFeedback {
  isValid: boolean;
  message: string;
  misconceptions: Misconception[];
  encouragement: string;
  nextStepHint?: string;
  confidence?: number;
}

export interface Misconception {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  studentInput: string;
  correction: string;
}

export interface Hint {
  level: 1 | 2 | 3;
  hint: string;
  isRevealing: boolean;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface EvaluateRequest {
  problemId: string;
  step: ProblemStep;
  studentInput: {
    quantities?: StudentQuantity[];
    unknown?: string;
    operations?: string[];
    relationship?: string;
    equation?: string;
  };
  conversationHistory: Message[];
}

export interface EvaluateResponse {
  feedback: AIFeedback;
  conversationHistory: Message[];
}

export interface HintRequest {
  problemId: string;
  step: ProblemStep;
  studentInput: {
    quantities?: StudentQuantity[];
    unknown?: string;
    operations?: string[];
    relationship?: string;
    equation?: string;
  };
  currentHintLevel: number;
}

export interface HintResponse {
  hint: Hint;
  nextHintLevel: number;
}

export interface SimilarProblemRequest {
  problemId: string;
  gradeBand: GradeBand;
  topic: string;
}

export interface SimilarProblemResponse {
  problem: Problem;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface AttemptRecord {
  id: string;
  problem_id: string;
  session_id: string;
  student_quantities: StudentQuantity[];
  student_unknown: string;
  student_operations: string[];
  student_equation: string;
  ai_feedback: AIFeedback;
  misconception_tags: string[];
  is_correct: boolean;
  time_spent_seconds: number;
  step_reached: ProblemStep;
  created_at: string;
}

export interface ProgressData {
  session_id: string;
  total_attempts: number;
  correct_attempts: number;
  accuracy: number;
  topics_mastered: string[];
  topics_struggling: string[];
  last_active?: string;
  recent_problems: {
    topic: string;
    was_correct: boolean;
    date: string;
  }[];
}

export interface OperationOption {
  id: string;
  label: string;
  symbol: string;
  description: string;
  gradeBands: GradeBand[];
}

// Common misconception types
export const MISCONCEPTION_TYPES = {
  WRONG_OPERATION: 'wrong_operation',
  REVERSED_RELATIONSHIP: 'reversed_relationship',
  MISSING_QUANTITY: 'missing_quantity',
  EXTRA_QUANTITY: 'extra_quantity',
  UNIT_CONFUSION: 'unit_confusion',
  UNKNOWN_IDENTIFICATION: 'unknown_identification',
  EQUATION_STRUCTURE: 'equation_structure',
  VARIABLE_PLACEMENT: 'variable_placement',
} as const;

export type MisconceptionType = typeof MISCONCEPTION_TYPES[keyof typeof MISCONCEPTION_TYPES];
