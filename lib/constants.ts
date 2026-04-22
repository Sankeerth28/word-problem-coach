// Math Story Decoder - Constants

export const APP_NAME = "Math Story Decoder"
export const APP_TAGLINE = "Decode the story, then build the math."

export const GRADE_BANDS = [
  { id: '3-5', label: 'Grades 3-5', description: 'Ages 8-11', color: 'green' },
  { id: '6-8', label: 'Grades 6-8', description: 'Ages 11-14', color: 'blue' },
  { id: 'algebra-1', label: 'Algebra 1', description: 'High School', color: 'purple' },
] as const

export const LANGUAGE_OPTIONS = [
  { id: 'en', label: 'English' },
  { id: 'hi', label: 'Hindi' },
] as const

export const FLOW_STEPS = ['spot', 'pick', 'confirm'] as const

export const STEP_ORDER = ['quantities', 'unknown', 'operations', 'equation', 'complete'] as const

export const HINT_LEVELS = {
  1: {
    title: "Visual cue",
    description: "Highlight the important part",
    revealing: false,
  },
  2: {
    title: "Direction",
    description: "Point toward the right action",
    revealing: false,
  },
  3: {
    title: "Partial answer",
    description: "Show the next best move",
    revealing: true,
  },
} as const

export const COACH_MESSAGES = {
  welcome: [
    "Hey math legend! Ready to turn some stories into equations? 🔥",
    "Welcome back! Let's crack some word problems today! 💪",
    "Time to be a math detective! Let's go! 🕵️",
  ],
  stepComplete: [
    "Nice work! Let's keep rolling! 🚀",
    "That's it! On to the next part! ⭐",
    "Perfect! You're getting the hang of this! 🎯",
  ],
  allStepsComplete: [
    "You built the whole equation! Legend status! 🏆",
    "Look at you, math translator extraordinaire! 🌟",
    "Boom! Equation complete! Ready to check it? 💥",
  ],
  needsHelp: [
    "Hmm, let's think about this together... 🤔",
    "Interesting! Let me help you see it differently... 💡",
    "Good try! Let's figure this out... 🔍",
  ],
  correct: [
    "EXACTLY RIGHT! You're a math wizard! 🧙‍♂️",
    "Nailed it! That's textbook perfect! 📚✨",
    "YES! That's what I'm talking about! 🔥",
  ],
  incorrect: [
    "Not quite, but I love the thinking! Let's adjust... 🔄",
    "Close! Let's tweak one thing... 🔧",
    "Good effort! Here's how to think about it... 💭",
  ],
  tryAgain: [
    "Give it another shot! You got this! 💪",
    "Second time's the charm! 🍀",
    "Let's try a different angle! 📐",
  ],
}

export const LOCAL_STORAGE_KEYS = {
  SESSION_ID: 'wpc_session_id',
  PREFERRED_GRADE: 'wpc_preferred_grade',
  PROGRESS: 'wpc_progress',
  SETTINGS: 'wpc_settings',
} as const

export const API_ENDPOINTS = {
  PROBLEMS: (gradeBand: string) => `/api/problems/${gradeBand}`,
  EVALUATE: '/api/evaluate',
  HINTS: '/api/hints',
  GENERATE_SIMILAR: '/api/generate-similar',
  SUBMIT_SETUP: '/api/submit-setup',
} as const

export const ANALYTICS_EVENTS = {
  PROBLEM_STARTED: 'problem_started',
  STEP_COMPLETED: 'step_completed',
  HINT_REQUESTED: 'hint_requested',
  PROBLEM_COMPLETED: 'problem_completed',
  SIMILAR_REQUESTED: 'similar_requested',
  MISTAKE_MADE: 'mistake_made',
} as const

// Accessibility
export const ARIA_LABELS = {
  MAIN_NAV: 'Main navigation',
  PROBLEM_CONTENT: 'Word problem content',
  STEP_PROGRESS: 'Story decoding progress',
  QUANTITY_INPUT: 'Tap the important numbers',
  EQUATION_INPUT: 'Confirm your equation',
  HINT_BUTTON: 'Get a hint',
  SUBMIT_BUTTON: 'Check my answer',
  COACH_AVATAR: 'Your math coach assistant',
} as const

// Animation durations (ms)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  STEP_TRANSITION: 400,
  FEEDBACK_SHOW: 2000,
} as const

// Font sizes for different grade bands
export const FONT_SIZES = {
  '3-5': 'text-lg',
  '6-8': 'text-base',
  'algebra-1': 'text-base',
} as const
