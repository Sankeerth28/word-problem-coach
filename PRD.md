# Product Requirements Document (PRD)
## Word Problem Coach

**Version:** 1.0  
**Last Updated:** 2026-04-22  
**Status:** MVP Complete

---

## 1. Executive Summary

### 1.1 Product Vision
Word Problem Coach is an AI-powered educational tool that helps K-12 students (ages 8-14) master the critical skill of **translating word problems into mathematical equations**. The product addresses the fundamental bottleneck in K-12 math education: students struggle not with arithmetic itself, but with understanding what a problem is asking and setting it up correctly.

### 1.2 Core Value Proposition
| Traditional Approach | Word Problem Coach Approach |
|---------------------|----------------------------|
| Gives answers directly | Guides students to discover solutions |
| One-size-fits-all feedback | Scaffolded, personalized feedback |
| Summative assessment (right/wrong) | Formative coaching throughout the process |
| Static problem banks | AI-generated similar problems for practice |

### 1.3 Key Differentiators
- **Never gives answers** — Forces active reasoning through guided discovery
- **4-step translation framework** — Breaks down the cognitive load systematically
- **AI-powered misconception detection** — Identifies root causes, not just surface errors
- **Fun coach persona** — Encouraging, age-appropriate, slightly sassy energy

---

## 2. Problem Statement

### 2.1 The Educational Challenge
Research in mathematics education consistently shows that the primary barrier to success in K-12 math is not computational ability, but **problem translation** — the process of converting natural language descriptions into mathematical representations.

### 2.2 Target User Pain Points
| User Type | Pain Point | Impact |
|-----------|------------|--------|
| Students (Grades 3-5) | "I don't know what the problem is asking" | Frustration, math anxiety |
| Students (Grades 6-8) | "I know the operations but can't set up the equation" | Poor test performance |
| Students (Algebra 1) | "Word problems are confusing vs. pure equations" | Avoidance, learned helplessness |
| Teachers | "I can't give individual help to every student" | Students fall behind |
| Parents | "I want to help but don't know how to explain" | Homework struggles |

### 2.3 Market Opportunity
- **TAM:** ~50M K-12 students in the US alone
- **SAM:** Students struggling with word problem translation (estimated 60%)
- **SOM:** Early adopters via teacher recommendations and direct-to-parent marketing

---

## 3. Target Users

### 3.1 Primary Users

#### Segment 1: Elementary Students (Grades 3-5, Ages 8-11)
**Characteristics:**
- Learning basic operations (addition, subtraction, multiplication, division)
- Need concrete, visual representations
- Respond well to gamification and encouragement
- Reading level: elementary

**Needs:**
- Simple language and explanations
- Visual models (bar diagrams, tape diagrams)
- Immediate positive reinforcement
- Scaffolded support without frustration

#### Segment 2: Middle School Students (Grades 6-8, Ages 11-14)
**Characteristics:**
- Transitioning to more abstract mathematical thinking
- Encountering ratios, percentages, proportions
- Developing algebraic reasoning
- Reading level: intermediate

**Needs:**
- More precise mathematical vocabulary
- Clear structure for multi-step problems
- Feedback that treats them as capable learners
- Practice with real-world contexts

#### Segment 3: High School Students (Algebra 1, Ages 14+)
**Characteristics:**
- Working with linear equations, systems, quadratics
- Need to translate complex scenarios
- Often have accumulated misconceptions
- Reading level: advanced

**Needs:**
- Treatment as young adults
- Focus on algebraic structure
- Identification of deep misconceptions
- Efficient practice with targeted feedback

### 3.2 Secondary Users

#### Teachers
**Use Cases:**
- Assign problems to class
- Monitor student progress
- Identify common misconceptions
- Differentiate instruction

#### Parents
**Use Cases:**
- Support homework at home
- Provide additional practice
- Track child's progress
- Understand where child struggles

---

## 4. Product Requirements

### 4.1 Functional Requirements

#### FR-1: Grade Band Selection
| Attribute | Description |
|-----------|-------------|
| ID | FR-1 |
| Title | Grade Band Selector |
| Priority | P0 (Critical) |
| Description | Users can select their grade band: Grades 3-5, Grades 6-8, or Algebra 1 |
| Acceptance Criteria | - Three grade band options displayed clearly<br>- Selection persists across session<br>- Problem difficulty adapts to selection<br>- UI language adapts to grade band |

#### FR-2: Problem Dashboard
| Attribute | Description |
|-----------|-------------|
| ID | FR-2 |
| Title | Problem Dashboard |
| Priority | P0 |
| Description | Users can browse and select problems from a curated problem bank |
| Acceptance Criteria | - Problems filtered by grade band<br>- Problems categorized by topic<br>- Visual indicators for difficulty<br>- Progress tracking per problem |

#### FR-3: 4-Step Problem Solver
| Attribute | Description |
|-----------|-------------|
| ID | FR-3 |
| Title | Guided 4-Step Translation Flow |
| Priority | P0 |
| Description | Users work through a structured 4-step process to translate word problems |
| Acceptance Criteria | - **Step 1 (Quantities):** List all quantities with units<br>- **Step 2 (Unknown):** Identify what needs to be solved<br>- **Step 3 (Operations):** Select operations and describe relationships<br>- **Step 4 (Equation):** Build the mathematical equation<br>- Each step must be validated before proceeding |

#### FR-4: AI-Powered Feedback
| Attribute | Description |
|-----------|-------------|
| ID | FR-4 |
| Title | Real-time AI Feedback |
| Priority | P0 |
| Description | After each step, AI evaluates student input and provides scaffolded feedback |
| Acceptance Criteria | - Feedback within 3 seconds<br>- Identifies specific misconceptions<br>- Provides actionable guidance<br>- Never gives away the answer directly<br>- Grade-appropriate language |

#### FR-5: 3-Level Hint System
| Attribute | Description |
|-----------|-------------|
| ID | FR-5 |
| Title | Escalating Hint System |
| Priority | P0 |
| Description | Students can request hints at three levels of specificity |
| Acceptance Criteria | - **Level 1:** Light nudge (general direction)<br>- **Level 2:** More specific guidance<br>- **Level 3:** Very helpful but still requires student completion<br>- Hint levels unlock sequentially |

#### FR-6: Similar Problem Generator
| Attribute | Description |
|-----------|-------------|
| ID | FR-6 |
| Title | Analogous Problem Generator |
| Priority | P1 (High) |
| Description | AI generates simpler analogous problems for additional practice |
| Acceptance Criteria | - Same mathematical structure as original<br>- Slightly lower difficulty (by 1 level)<br>- Different context/scenario<br>- Friendlier numbers |

#### FR-7: Progress Dashboard
| Attribute | Description |
|-----------|-------------|
| ID | FR-7 |
| Title | Student Progress Dashboard |
| Priority | P1 |
| Description | Visual display of student progress across topics |
| Acceptance Criteria | - Heat map of topics mastered/struggling<br>- Session-based tracking<br>- Accuracy metrics<br>- Recent problem history |

#### FR-8: Visual Model Builder
| Attribute | Description |
|-----------|-------------|
| ID | FR-8 |
| Title | Bar/Tape Diagram Builder |
| Priority | P2 (Medium) |
| Description | Interactive visual models to support problem comprehension |
| Acceptance Criteria | - Bar diagrams for part-whole relationships<br>- Tape diagrams for ratios<br>- Interactive manipulation<br>- Toggle on/off |

#### FR-9: Solution Explorer
| Attribute | Description |
|-----------|-------------|
| ID | FR-9 |
| Title | Step-by-Step Solution Display |
| Priority | P0 |
| Description | After completing all steps, students can view the official solution |
| Acceptance Criteria | - Shows each solution step clearly<br>- Compares student equation to correct (if different)<br>- Explains reasoning, not just answer<br>- Ends with encouragement |

#### FR-10: Session Persistence
| Attribute | Description |
|-----------|-------------|
| ID | FR-10 |
| Title | Local Storage Session Management |
| Priority | P1 |
| Description | Student progress persists across page refreshes |
| Acceptance Criteria | - Session ID stored in localStorage<br>- Problem state saved per step<br>- Preferred grade band remembered<br>- Settings persisted |

### 4.2 Non-Functional Requirements

#### NFR-1: Performance
| Attribute | Description |
|-----------|-------------|
| ID | NFR-1 |
| Title | Response Time |
| Priority | P0 |
| Description | AI feedback must appear within acceptable latency |
| Acceptance Criteria | - Time to first feedback: < 3 seconds<br>- Page load time: < 2 seconds<br>- Lighthouse performance score: > 90 |

#### NFR-2: Accessibility
| Attribute | Description |
|-----------|-------------|
| ID | NFR-2 |
| Title | WCAG 2.1 AA Compliance |
| Priority | P0 |
| Description | Application must be accessible to all students |
| Acceptance Criteria | - ARIA labels on all interactive elements<br>- Full keyboard navigation<br>- Screen reader compatible<br>- High contrast mode support<br>- Focus indicators visible |

#### NFR-3: Mobile Responsiveness
| Attribute | Description |
|-----------|-------------|
| ID | NFR-3 |
| Title | Mobile-First Design |
| Priority | P0 |
| Description | Application works on all device sizes |
| Acceptance Criteria | - Responsive breakpoints: 320px, 768px, 1024px, 1440px<br>- Touch-friendly tap targets (44px minimum)<br>- No horizontal scrolling<br>- Tested on iOS Safari, Chrome Android |

#### NFR-4: Security
| Attribute | Description |
|-----------|-------------|
| ID | NFR-4 |
| Title | Data Protection |
| Priority | P0 |
| Description | Student data must be protected |
| Acceptance Criteria | - API keys stored server-side only<br>- No PII collected from students<br>- Supabase RLS (Row Level Security) enabled<br>- HTTPS enforced |

#### NFR-5: Scalability
| Attribute | Description |
|-----------|-------------|
| ID | NFR-5 |
| Title | Traffic Handling |
| Priority | P1 |
| Description | System handles expected traffic growth |
| Acceptance Criteria | - Support 1,000 concurrent users<br>- API rate limiting in place<br>- Database queries optimized<br>- CDN for static assets |

#### NFR-6: Reliability
| Attribute | Description |
|-----------|-------------|
| ID | NFR-6 |
| Title | Uptime SLA |
| Priority | P1 |
| Description | Application availability target |
| Acceptance Criteria | - 99.5% uptime target<br>- Graceful error handling<br>- Retry logic for AI calls<br>- Fallback messages for errors |

---

## 5. Technical Architecture

### 5.1 Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend Framework** | Next.js 14 (App Router) | SSR, SEO, built-in API routes |
| **UI Library** | React 18 + TypeScript | Type safety, component ecosystem |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid development, consistent design |
| **Animations** | Framer Motion | Smooth, declarative animations |
| **State Management** | React Hooks (custom) | Simple, no overhead |
| **Database** | Supabase (PostgreSQL) | Easy setup, real-time capable |
| **AI/LLM** | Anthropic Claude 3.5 Sonnet | Best reasoning for education |
| **Hosting** | Vercel | Optimized for Next.js, edge functions |
| **Visualizations** | React Konva | Interactive diagrams |

### 5.2 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Landing   │  │  Dashboard  │  │  Problem Solver     │  │
│  │    Page     │  │    Page     │  │      (4-Step)       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Progress  │  │    Custom   │  │  Visual Model       │  │
│  │  Heatmap    │  │   Problems  │  │      Builder        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       API LAYER (Next.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  /api/problems│  │  /api/evaluate│  │   /api/hints    │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │ /api/generate│  │ /api/submit  │                         │
│  │   -similar   │  │   -setup     │                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                           │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              AI Service (Claude 3.5 Sonnet)             │ │
│  │  - Prompt composition                                   │ │
│  │  - Response parsing                                     │ │
│  │  - Conversation memory                                  │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Database Service (Supabase)                │ │
│  │  - Problem retrieval                                    │ │
│  │  - Attempt logging                                      │ │
│  │  - Progress tracking                                    │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 Data Model

#### Core Entities

**Problems**
```typescript
interface Problem {
  id: string;              // UUID
  grade_band: GradeBand;   // '3-5' | '6-8' | 'algebra-1'
  topic: string;           // e.g., 'Addition & Subtraction'
  problem_text: string;    // The word problem narrative
  quantities: Quantity[];  // Known values with units
  unknown: string;         // What needs to be solved
  operations: string[];    // Required operations
  equation: string;        // Correct equation
  solution_steps: SolutionStep[];
  difficulty: number;      // 1-5 scale
}
```

**Attempts**
```typescript
interface Attempt {
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
  created_at: timestamp;
}
```

**Progress**
```typescript
interface Progress {
  session_id: string;
  total_attempts: number;
  correct_attempts: number;
  accuracy: number;        // 0-100%
  topics_mastered: string[];
  topics_struggling: string[];
  recent_problems: ProblemHistory[];
}
```

### 5.4 API Endpoints

| Endpoint | Method | Description | Request | Response |
|----------|--------|-------------|---------|----------|
| `/api/problems/[grade]` | GET | Fetch problems by grade band | `gradeBand` | `Problem[]` |
| `/api/evaluate` | POST | Evaluate student step | `EvaluateRequest` | `EvaluateResponse` |
| `/api/hints` | POST | Generate hint | `HintRequest` | `HintResponse` |
| `/api/generate-similar` | POST | Generate analogous problem | `SimilarProblemRequest` | `SimilarProblemResponse` |
| `/api/submit-setup` | POST | Save attempt to database | `AttemptRecord` | `{ success: boolean }` |

---

## 6. User Experience Requirements

### 6.1 Design Principles

1. **Kid-Friendly but Not Babyish** — Colorful, fun, but age-appropriate
2. **Clear Visual Hierarchy** — Students know exactly what to do next
3. **Encouraging Tone** — Celebrate effort, not just correctness
4. **Minimal Cognitive Load** — One thing at a time, clear instructions
5. **Instant Feedback** — No waiting, no ambiguity

### 6.2 Color System

| Color | Usage | Hex |
|-------|-------|-----|
| Coach Purple (Primary) | Brand, CTAs, highlights | `#7C3AED` |
| Coach Blue (Secondary) | Links, info states | `#2563EB` |
| Coach Green (Success) | Correct answers, progress | `#10B981` |
| Coach Yellow (Warning) | Hints, attention | `#F59E0B` |
| Coach Pink (Error) | Mistakes, retry states | `#EC4899` |
| Coach Orange (Accent) | Highlights, badges | `#F97316` |

### 6.3 Key User Flows

#### Flow 1: First-Time User
```
1. Landing Page → Select Grade Band
2. Dashboard → Browse Problems → Select Problem
3. Problem Solver → Complete 4 Steps → View Solution
4. Progress Dashboard → See Results
```

#### Flow 2: Returning Student
```
1. Landing Page → Auto-load Preferred Grade
2. Dashboard → Continue Previous Problem OR New Problem
3. Problem Solver → Resume at Last Step
4. Complete → Try Similar Problem
```

#### Flow 3: Stuck Student
```
1. Student makes incorrect submission
2. AI provides misconception-focused feedback
3. Student requests Level 1 Hint → Still stuck
4. Student requests Level 2 Hint → Still stuck
5. Student requests Level 3 Hint → Completes step
6. System resets hint level for next step
```

---

## 7. AI/LLM Requirements

### 7.1 Model Selection

| Requirement | Specification |
|-------------|---------------|
| Primary Model | Anthropic Claude 3.5 Sonnet |
| Fallback Model | OpenAI GPT-4o (optional) |
| Context Window | Minimum 8K tokens (for conversation history) |
| Response Format | JSON structured output |
| Latency Target | < 3 seconds for feedback |

### 7.2 Prompt Architecture

The AI system uses a **modular prompt architecture**:

1. **Base System Prompt** — Defines coach persona, core rules, grade adaptation
2. **Step-Specific Prompts** — Tailored evaluation for each of the 4 steps
3. **Support Prompts** — Hints, similar problems, solution explanations
4. **Analysis Prompts** — Deep misconception diagnosis

### 7.3 AI Safety Guardrails

| Guardrail | Implementation |
|-----------|----------------|
| Never give answers | Explicit instruction in system prompt |
| Age-appropriate language | Grade band adaptation rules |
| No harmful content | Anthropic's built-in safety filters |
| Consistent persona | Few-shot examples in prompts |
| Structured output | JSON schema enforcement |

### 7.4 Conversation Memory

| Feature | Description |
|---------|-------------|
| Per-Problem History | Messages stored per problem session |
| Context Window | Last 10 messages retained |
| Summarization | Older messages summarized if needed |
| Reset on New Problem | Fresh context for each problem |

---

## 8. Content Requirements

### 8.1 Problem Bank

#### Initial Content (MVP)
| Grade Band | Topics | Problem Count |
|------------|--------|---------------|
| Grades 3-5 | Addition/Subtraction, Multiplication, Division, Fractions, Multi-step | 8 problems |
| Grades 6-8 | Ratios, Percentages, Rates, Linear Equations, Proportions | 7 problems |
| Algebra 1 | Linear Equations, Systems, Quadratics, Inequalities, Distance-Rate-Time | 8 problems |
| **Total** | | **23 problems** |

#### Content Quality Criteria
- Real-world contexts students relate to
- Clear, unambiguous language
- Appropriate difficulty progression
- Diverse scenarios (money, objects, time, distance)

### 8.2 Coach Messages

Pre-written message templates for common states:

| State | Example Messages |
|-------|------------------|
| Welcome | "Hey math legend! Ready to turn some stories into equations?" |
| Step Complete | "Nice work! Let's keep rolling!" |
| Correct Answer | "EXACTLY RIGHT! You're a math wizard!" |
| Needs Help | "Hmm, let's think about this together..." |
| Completion | "You built the whole equation! Legend status!" |

---

## 9. Analytics & Measurement

### 9.1 Key Metrics

#### Engagement Metrics
| Metric | Definition | Target |
|--------|------------|--------|
| Problems Started | Count of problems begun | Track per session |
| Completion Rate | % of problems reaching Step 4 | > 70% |
| Time per Problem | Average time from Step 1 to completion | 3-8 minutes |
| Hint Usage | Average hints requested per problem | 1-3 hints |

#### Learning Metrics
| Metric | Definition | Target |
|--------|------------|--------|
| First-Try Accuracy | % of steps correct on first submission | > 50% |
| Misconception Rate | % of submissions with detected misconceptions | Track by type |
| Topic Mastery | Problems completed correctly per topic | 3+ per topic |

#### Technical Metrics
| Metric | Definition | Target |
|--------|------------|--------|
| API Latency | P95 response time for AI calls | < 3000ms |
| Error Rate | % of failed API calls | < 1% |
| Page Load | Time to Interactive | < 2500ms |

### 9.2 Event Tracking

| Event | Properties |
|-------|------------|
| `problem_started` | problem_id, grade_band, topic |
| `step_completed` | problem_id, step, is_correct, time_spent |
| `hint_requested` | problem_id, step, hint_level |
| `problem_completed` | problem_id, total_time, hints_used, correct |
| `mistake_made` | problem_id, step, misconception_type |

---

## 10. Go-to-Market Strategy

### 10.1 Launch Phases

#### Phase 1: MVP (Current)
- Core 4-step problem solver
- 23 problems across 3 grade bands
- AI feedback and hint system
- Progress dashboard
- Deploy to Vercel

#### Phase 2: Teacher Features (Next)
- Teacher dashboard
- Class management
- Assignment creation
- Student progress reports
- Misconception analytics

#### Phase 3: Advanced Features (Future)
- Multiplayer mode
- Voice input/output
- Adaptive difficulty
- Parent reports
- Custom problem creation

### 10.2 Distribution Channels

| Channel | Strategy |
|---------|----------|
| Direct-to-Parent | Social media, parenting blogs, SEO |
| Teacher Communities | Reddit r/Teachers, Facebook groups |
| Educational Blogs | Guest posts, product reviews |
| Product Hunt | Launch campaign |
| Word of Mouth | Referral incentives |

---

## 11. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| AI gives wrong feedback | Low | High | Human review of problem/answer pairs, fallback validation |
| High API costs | Medium | Medium | Cache similar problems, rate limiting, usage monitoring |
| Low student engagement | Medium | High | Gamification, progress rewards, teacher integration |
| Accessibility gaps | Low | High | WCAG audit before launch, user testing with disabilities |
| Scalability issues | Low | Medium | Vercel auto-scaling, database indexing, CDN |

---

## 12. Success Criteria

### 12.1 MVP Launch Criteria
- [ ] All 23 problems functional
- [ ] 4-step flow complete with AI feedback
- [ ] Hint system working (3 levels)
- [ ] Progress dashboard displays data
- [ ] Mobile responsive (tested on 3 devices)
- [ ] Accessibility audit passed
- [ ] Lighthouse score > 90
- [ ] No critical bugs

### 12.2 30-Day Post-Launch Criteria
- [ ] 100+ active students
- [ ] > 70% problem completion rate
- [ ] < 2 second average API latency
- [ ] 4+ star user rating (if applicable)
- [ ] Teacher testimonials collected

### 12.3 Long-Term Success (6 Months)
- [ ] 1,000+ monthly active students
- [ ] Measurable learning gains (pre/post assessment)
- [ ] Teacher adoption in 10+ classrooms
- [ ] Sustainable unit economics (LTV > 3x CAC)

---

## 13. Open Questions

| Question | Owner | Status |
|----------|-------|--------|
| Should we add user accounts for progress persistence? | Product | TBD |
| What pricing model for premium features? | Business | TBD |
| How to handle multiple students per device? | Product | TBD |
| Should teachers be able to create custom problems? | Product | Backlog |
| Integration with Google Classroom? | Technical | Backlog |

---

## 14. Appendix

### 14.1 Glossary

| Term | Definition |
|------|------------|
| **Translation** | Converting word problem to equation |
| **Quantities** | Known values with units in a problem |
| **Unknown** | The value to be solved for |
| **Scaffolded Feedback** | Graduated support that fades as student progresses |
| **Misconception** | Systematic error in student thinking |

### 14.2 References

- National Council of Teachers of Mathematics (NCTM) Standards
- Common Core State Standards for Mathematics
- Research on word problem translation difficulties
- Universal Design for Learning (UDL) Guidelines

### 14.3 Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-04-22 | AI Assistant | Initial PRD creation |

---

**"Alright legend, let's turn that story into math! 🔥"**
