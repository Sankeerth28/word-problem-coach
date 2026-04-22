# Math Story Decoder for Kids 🧩

**A story-first math app that helps kids spot the important clues, pick the right action, and confirm the equation with deterministic checking.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/word-problem-coach)

## 🎯 What Is This?

Math Story Decoder helps K-12 students (ages 8-14) decode word problems without overwhelming them. The app is built around confidence, tap-first interaction, and a rule-based answer engine so the check is consistent every time.

### Core Philosophy
- **Give just enough clarity** — Help the child keep moving
- **Confidence over struggle** — Reduce friction and dropout
- **AI is the helper, not the authority** — Stored solutions verify the answer
- **One screen at a time** — Big buttons, simple steps, no clutter

---

## ✨ Features

### Student Experience
- 🎨 **Kid-friendly UI** — Big tap targets, clear contrast, playful motion
- 📚 **Grade band selector** — Grades 3-5 | 6-8 | Algebra 1
- 🧩 **3-step kid flow**:
  1. **Spot the Important Stuff** — Tap the numbers and units
  2. **Pick What to Do** — Add, subtract, multiply, or divide
  3. **Build and Check** — The app auto-builds the equation, then the kid confirms or edits
- 💡 **Visual hint ladder** — Cue, direction, partial answer
- ✅ **Deterministic answer engine** — Stored solutions verify correctness
- 🔄 **Similar story practice** — Practice with simpler or nearby stories
- 🔊 **Auto voice reading** — ON by default, with a toggle
- 🌐 **Hindi + English toggle** — Interface support for both languages

### AI Magic
- AI can still help with rephrased hints and similar problem generation
- The app does **not** rely on AI for correctness checks
- Low-confidence or missing data falls back to templates and stored solutions

### Nice-to-Haves (Included!)
- 📱 **Mobile-first responsive** — Works well on low-end devices
- ♿ **Accessibility-first** — ARIA labels, keyboard support, high contrast
- ⚡ **Performance-minded** — Fewer API calls, cached hints, lazy AI usage
- 🧠 **Mistake memory ready** — The data model supports wrong-operation tracking and adaptive follow-up

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier works)
- Anthropic API key (Claude)

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/word-problem-coach.git
cd word-problem-coach
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Anthropic (Claude)
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Optional: OpenAI fallback
OPENAI_API_KEY=sk-your-key-here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Supabase Database

# Math Story Decoder for Kids 🧩

**A story-first math app that helps kids spot the important clues, pick the right action, and confirm the equation with deterministic checking.**

Math Story Decoder helps K-12 students (ages 8-14) decode word problems without overwhelming them. The app is built around confidence, tap-first interaction, and a rule-based answer engine so the check is consistent every time.
```bash
npm run dev
- **Give just enough clarity** — Help the child keep moving
- **Confidence over struggle** — Reduce friction and dropout
- **AI is the helper, not the authority** — Stored solutions verify the answer
- **One screen at a time** — Big buttons, simple steps, no clutter

### Student Experience
- 🎨 **Kid-friendly UI** — Big tap targets, clear contrast, playful motion
- 📚 **Grade band selector** — Grades 3-5 | 6-8 | Algebra 1
- 🧩 **3-step kid flow**:
  1. **Spot the Important Stuff** — Tap the numbers and units
  2. **Pick What to Do** — Add, subtract, multiply, or divide
  3. **Build and Check** — The app auto-builds the equation, then the kid confirms or edits
- 💡 **Visual hint ladder** — Cue, direction, partial answer
- ✅ **Deterministic answer engine** — Stored solutions verify correctness
- 🔄 **Similar story practice** — Practice with simpler or nearby stories
- 🔊 **Auto voice reading** — ON by default, with a toggle
- 🌐 **Hindi + English toggle** — Interface support for both languages
│   ├── problem/
### AI Magic
- AI can still help with rephrased hints and similar problem generation
- The app does **not** rely on AI for correctness checks
- Low-confidence or missing data falls back to templates and stored solutions
│       ├── problems/[grade]/   # GET problems by grade
### Nice-to-Haves (Included!)
- 📱 **Mobile-first responsive** — Works well on low-end devices
- ♿ **Accessibility-first** — ARIA labels, keyboard support, high contrast
- ⚡ **Performance-minded** — Fewer API calls, cached hints, lazy AI usage
- 🧠 **Mistake memory ready** — The data model supports wrong-operation tracking and adaptive follow-up
├── components/
│   ├── ui/                     # shadcn primitives
│   ├── OperationPicker.tsx
│   ├── EquationEditor.tsx
│   ├── LaTeXPreview.tsx
│   ├── HintPanel.tsx
│   ├── FeedbackToast.tsx
│   ├── CoachAvatar.tsx
│   ├── VisualModelBuilder.tsx  # Konva diagrams
│   └── ProgressHeatmap.tsx
├── hooks/
│   ├── useProblem.ts           # Problem state management
│   ├── useAIFeedback.ts        # AI interaction
│   ├── useSpeech.ts            # Text-to-speech
│   └── useLocalStorage.ts      # Persistence
├── lib/
│   ├── ai/
│   │   ├── prompts.ts          # ALL system prompts (elite quality)
│   │   └── client.ts           # Vercel AI SDK setup
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── schema.sql
│   │   ├── seed.sql
│   │   └── database.types.ts
│   ├── types.ts                # TypeScript types
│   ├── utils.ts                # Utilities
│   └── constants.ts            # App constants
└── package.json
```

---

## 🧠 AI System Prompts

The magic is in `lib/ai/prompts.ts`. Key prompts:

### Base System Prompt
Defines the coach persona: fun, encouraging, never gives answers.

### Step-Specific Prompts
- `QUANTITY_EXTRACTION_PROMPT` — Evaluate quantity identification
- `UNKNOWN_IDENTIFICATION_PROMPT` — Evaluate unknown identification
- `OPERATION_DETECTION_PROMPT` — Evaluate operation selection
- `EQUATION_VALIDATION_PROMPT` — Evaluate equation structure

### Support Prompts
- `HINT_GENERATION_PROMPT` — 3-level escalating hints
- `SIMILAR_PROBLEM_GENERATION_PROMPT` — Create analogous problems
- `SOLUTION_EXPLANATION_PROMPT` — Step-by-step solutions
- `MISCONCEPTION_ANALYSIS_PROMPT` — Deep error analysis

---

## 🗄️ Database Schema

### Tables

**problems**
- `id` (UUID), `grade_band`, `topic`, `problem_text`
- `quantities` (JSONB), `unknown`, `operations` (array)
- `equation`, `solution_steps` (JSONB), `difficulty`

**attempts**
- Tracks every student attempt with full state
- Links to `misconception_logs` for analytics

**progress**
- Session-based progress tracking
- Topics mastered/struggling arrays

See `lib/supabase/schema.sql` for full schema.

---

## 🎨 UI Components

Built with shadcn/ui + Tailwind + Framer Motion:

- **Kid-friendly colors** — Purple, blue, green, yellow, orange, pink
- **Animated transitions** — Step changes, feedback, hints
- **Micro-interactions** — Button press effects, hover states
- **Progress indicators** — Visual step tracking
- **Toast notifications** — Non-intrusive feedback

---

## 📊 Sample Problems

20+ problems seeded across grade bands:

**Grades 3-5** (Elementary)
- Addition/Subtraction: "Maria has 23 stickers..."
- Multiplication: "A box contains 6 pencils..."
**Grades 6-8** (Middle School)
- Proportions: "Recipe calls for 2 cups flour for 3 cups sugar..."

**Algebra 1** (High School)
- Inequalities: "$100 budget, $35 per game..."
---

### Vercel (Recommended)


**One-Click Deploy Button:**
```markdown
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
---
- [ ] Problem loads correctly
- [ ] All 4 steps function
- [ ] AI feedback appears after each step
- [ ] Hint system (3 levels) works
- [ ] "Check My Setup" reveals solution
- [ ] "Similar Problem" generates new problem
- [ ] Story picker and progress memory updates
- [ ] Mobile responsive (test on phone)
- [ ] Accessibility (keyboard nav, screen reader)

### Automated Testing (Future)
```bash
npm run test
npm run test:e2e
```

---

## 🎯 Roadmap

- Assignment creation

### Phase 3 (Future)
- Multiplayer mode
- Voice input/output
- Adaptive difficulty
- Parent reports

- Improve AI prompts

MIT License — build something awesome!

- **Vercel AI SDK** — Seamless AI integration
- **shadcn/ui** — Beautiful, accessible components
**Made with 💜 for math students everywhere.**

*"Alright legend, let's turn that story into math! 🔥"*
