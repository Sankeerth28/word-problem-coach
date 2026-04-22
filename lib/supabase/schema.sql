-- Word Problem Coach Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROBLEMS TABLE
-- ============================================
CREATE TABLE problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grade_band TEXT NOT NULL CHECK (grade_band IN ('3-5', '6-8', 'algebra-1')),
  topic TEXT NOT NULL,
  problem_text TEXT NOT NULL,
  quantities JSONB NOT NULL DEFAULT '[]'::jsonb,
  unknown TEXT NOT NULL,
  operations TEXT[] NOT NULL DEFAULT '{}',
  equation TEXT NOT NULL,
  solution_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  diagram_url TEXT,
  difficulty INTEGER NOT NULL DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast grade-based queries
CREATE INDEX idx_problems_grade_band ON problems(grade_band);
CREATE INDEX idx_problems_topic ON problems(topic);
CREATE INDEX idx_problems_difficulty ON problems(difficulty);

-- ============================================
-- ATTEMPTS TABLE - Student problem attempts
-- ============================================
CREATE TABLE attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  student_quantities JSONB NOT NULL DEFAULT '[]'::jsonb,
  student_unknown TEXT,
  student_operations TEXT[] DEFAULT '{}',
  student_equation TEXT,
  ai_feedback JSONB DEFAULT '{}'::jsonb,
  misconception_tags TEXT[] DEFAULT '{}',
  is_correct BOOLEAN,
  time_spent_seconds INTEGER DEFAULT 0,
  step_reached TEXT DEFAULT 'quantities',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_attempts_problem_id ON attempts(problem_id);
CREATE INDEX idx_attempts_session_id ON attempts(session_id);
CREATE INDEX idx_attempts_created_at ON attempts(created_at);

-- ============================================
-- MISCONCEPTION LOGS - Analytics for teachers
-- ============================================
CREATE TABLE misconception_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID REFERENCES attempts(id) ON DELETE CASCADE,
  misconception_type TEXT NOT NULL,
  description TEXT,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_misconception_attempt_id ON misconception_logs(attempt_id);
CREATE INDEX idx_misconception_type ON misconception_logs(misconception_type);

-- ============================================
-- PROGRESS TABLE - Student analytics
-- ============================================
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL UNIQUE,
  total_attempts INTEGER DEFAULT 0,
  correct_attempts INTEGER DEFAULT 0,
  topics_mastered TEXT[] DEFAULT '{}',
  topics_struggling TEXT[] DEFAULT '{}',
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_progress_session_id ON progress(session_id);

-- ============================================
-- HINTS TABLE - Track hint usage
-- ============================================
CREATE TABLE hint_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID REFERENCES attempts(id) ON DELETE CASCADE,
  hint_level INTEGER NOT NULL CHECK (hint_level BETWEEN 1 AND 3),
  hint_text TEXT NOT NULL,
  was_helpful BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hint_usage_attempt_id ON hint_usage(attempt_id);

-- ============================================
-- AUTO-UPDATE UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_problems_updated_at
  BEFORE UPDATE ON problems
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attempts_updated_at
  BEFORE UPDATE ON attempts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) - Optional for multi-user
-- ============================================
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE misconception_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE hint_usage ENABLE ROW LEVEL SECURITY;

-- Allow public read access to problems (for MVP)
CREATE POLICY "Allow public read access to problems"
  ON problems FOR SELECT
  USING (true);

-- Allow anonymous writes to attempts (session-based)
CREATE POLICY "Allow anonymous insert to attempts"
  ON attempts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select own attempts"
  ON attempts FOR SELECT
  USING (session_id = current_setting('app.session_id', true));

-- Allow anonymous writes to misconception_logs and hint_usage
CREATE POLICY "Allow anonymous insert to misconception_logs"
  ON misconception_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anonymous insert to hint_usage"
  ON hint_usage FOR INSERT
  WITH CHECK (true);

-- Allow anonymous upsert to progress
CREATE POLICY "Allow anonymous upsert to progress"
  ON progress FOR UPSERT
  WITH CHECK (true);
