"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type OperationType = "add" | "subtract" | "multiply" | "divide"

type ParsedStep = {
  operation: OperationType
  value: number
  phrase: string
}

type ParsedOutput = {
  initial: number
  steps: ParsedStep[]
  entity: string
}

type SolvedStep = {
  operation: OperationType
  value: number
  previousTotal: number
  total: number
}

type VisualizationStep = {
  operation: OperationType
  value: number
  from: number
  to: number
  color: string
  direction: "forward" | "backward"
  motion: "appear" | "remove" | "transform"
}

type SolveResult = {
  parsed: ParsedOutput
  solvedSteps: SolvedStep[]
  visualization: VisualizationStep[]
  final: number
  explained: string[]
  icon: string
  warning?: string
}

interface CustomProblemEngineProps {
  onSolved?: (payload: { entity: string; finalAnswer: number; operationTypes: string[] }) => void
}

const ENTITY_ICON_MAP: Record<string, string> = {
  stickers: "🌟",
  sticker: "🌟",
  apples: "🍎",
  apple: "🍎",
  coins: "🪙",
  coin: "🪙",
  dollars: "💰",
  dollar: "💰",
  money: "💰",
  pencils: "✏️",
  pencil: "✏️",
  books: "📚",
  book: "📚",
  oranges: "🍊",
  orange: "🍊",
}

const OPERATION_RULES: Record<OperationType, string[]> = {
  add: ["add", "added", "more", "gained", "received", "bought"],
  subtract: ["remove", "removed", "lost", "gave", "spent", "taken away"],
  multiply: ["times", "each", "per", "every", "multiplied"],
  divide: ["divide", "divided", "equally", "split", "shared", "share"],
}

const FAIL_SAFE_MESSAGE = "uncertain parsing"

const toSafeNumber = (value: unknown) => {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) {
    throw new Error(FAIL_SAFE_MESSAGE)
  }
  return numeric
}

const clampTokenCount = (count: number) => Math.min(Math.max(0, Math.floor(count)), 80)

const splitIntoPhrases = (text: string) =>
  text
    .toLowerCase()
    .replace(/\s+/g, " ")
    .split(/(?:[.!?;]|\band then\b|\bthen\b|\bafter that\b|,)/)
    .map((phrase) => phrase.trim())
    .filter(Boolean)

const detectOperationInPhrase = (phrase: string, numberIndex: number): OperationType | null => {
  const contextStart = Math.max(0, numberIndex - 28)
  const contextEnd = Math.min(phrase.length, numberIndex + 28)
  const context = phrase.slice(contextStart, contextEnd)

  const candidates: OperationType[] = []
  ;(Object.keys(OPERATION_RULES) as OperationType[]).forEach((operation) => {
    const matched = OPERATION_RULES[operation].some((keyword) => {
      const pattern = new RegExp(`\\b${keyword}\\b`)
      return pattern.test(context)
    })
    if (matched) candidates.push(operation)
  })

  if (candidates.length === 1) {
    return candidates[0]
  }

  return null
}

const extractEntityNearInitial = (sourceText: string, initialValue: number) => {
  const escaped = String(initialValue).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const nearMatch = sourceText.toLowerCase().match(new RegExp(`${escaped}\\s+([a-zA-Z]+)`))
  if (!nearMatch?.[1]) return "items"
  return nearMatch[1].replace(/[^a-z]/g, "") || "items"
}

// parseProblem(text)
const parseProblem = (text: string): ParsedOutput => {
  const normalized = text.trim().replace(/\s+/g, " ")
  const phrases = splitIntoPhrases(normalized)

  if (phrases.length === 0) {
    throw new Error(FAIL_SAFE_MESSAGE)
  }

  let initial: number | null = null
  const steps: ParsedStep[] = []

  phrases.forEach((phrase) => {
    const numberMatches = Array.from(phrase.matchAll(/\d+(?:\.\d+)?/g))
    if (numberMatches.length === 0) return

    numberMatches.forEach((match) => {
      if (match.index === undefined) {
        throw new Error(FAIL_SAFE_MESSAGE)
      }

      const value = toSafeNumber(match[0])
      const operation = detectOperationInPhrase(phrase, match.index)

      if (operation) {
        steps.push({ operation, value, phrase })
        return
      }

      if (initial === null) {
        initial = value
        return
      }

      // Any later number without a phrase-level operation is ambiguous.
      throw new Error(FAIL_SAFE_MESSAGE)
    })
  })

  if (initial === null || steps.length === 0) {
    throw new Error(FAIL_SAFE_MESSAGE)
  }

  return {
    initial,
    steps,
    entity: extractEntityNearInitial(normalized, initial),
  }
}

// validateSteps(steps)
const validateSteps = (steps: ParsedStep[]) => {
  if (!Array.isArray(steps) || steps.length === 0) {
    throw new Error(FAIL_SAFE_MESSAGE)
  }

  steps.forEach((step) => {
    if (!["add", "subtract", "multiply", "divide"].includes(step.operation)) {
      throw new Error(FAIL_SAFE_MESSAGE)
    }

    if (!Number.isFinite(step.value)) {
      throw new Error(FAIL_SAFE_MESSAGE)
    }

    if (step.operation === "divide" && step.value === 0) {
      throw new Error("Cannot divide by zero.")
    }
  })
}

const validateStructure = (parsed: ParsedOutput) => {
  if (!Number.isFinite(parsed.initial)) {
    throw new Error(FAIL_SAFE_MESSAGE)
  }
  if (!Array.isArray(parsed.steps) || parsed.steps.length === 0) {
    throw new Error(FAIL_SAFE_MESSAGE)
  }
  validateSteps(parsed.steps)
}

// solveSteps(initial, steps)
const solveSteps = (initial: number, steps: ParsedStep[]) => {
  let total = toSafeNumber(initial)
  const solved: SolvedStep[] = []
  const explained: string[] = [`Start with ${total}`]

  steps.forEach((step) => {
    const previousTotal = total

    if (step.operation === "add") total += step.value
    if (step.operation === "subtract") total -= step.value
    if (step.operation === "multiply") total *= step.value
    if (step.operation === "divide") {
      if (step.value === 0) {
        throw new Error("Cannot divide by zero.")
      }
      total /= step.value
    }

    if (!Number.isFinite(total)) {
      throw new Error("Computation failed due to invalid numeric state.")
    }

    solved.push({
      operation: step.operation,
      value: step.value,
      previousTotal,
      total,
    })

    const label = step.operation.charAt(0).toUpperCase() + step.operation.slice(1)
    explained.push(`${label} ${step.value} -> ${total}`)
  })

  return { final: total, solvedSteps: solved, explained }
}

const recomputeFinalIndependently = (initial: number, steps: ParsedStep[]) => {
  let total = toSafeNumber(initial)

  steps.forEach((step) => {
    if (step.operation === "add") total = total + step.value
    else if (step.operation === "subtract") total = total - step.value
    else if (step.operation === "multiply") total = total * step.value
    else if (step.operation === "divide") {
      if (step.value === 0) {
        throw new Error("Cannot divide by zero.")
      }
      total = total / step.value
    }
  })

  if (!Number.isFinite(total)) {
    throw new Error("Computation failed due to invalid numeric state.")
  }

  return total
}

// generateVisualizationData(steps)
const generateVisualizationData = (steps: SolvedStep[]) =>
  steps.map<VisualizationStep>((step) => ({
    operation: step.operation,
    value: step.value,
    from: step.previousTotal,
    to: step.total,
    color: step.operation === "subtract" ? "#ef4444" : "#16a34a",
    direction: step.total >= step.previousTotal ? "forward" : "backward",
    motion: step.operation === "add" ? "appear" : step.operation === "subtract" ? "remove" : "transform",
  }))

const getOperationText = (operation: OperationType, value: number, total: number) => {
  if (operation === "add") return `+ ${value} -> ${total}`
  if (operation === "subtract") return `- ${value} -> ${total}`
  if (operation === "multiply") return `x ${value} -> ${total}`
  return `/ ${value} -> ${total}`
}

export function CustomProblemEngine({ onSolved }: CustomProblemEngineProps) {
  const [problemInput, setProblemInput] = useState("")
  const [isSolving, setIsSolving] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [debugMode, setDebugMode] = useState(true)
  const [result, setResult] = useState<SolveResult | null>(null)

  const displaySteps = useMemo(() => {
    if (!result) return []
    return [
      {
        label: "Initial value",
        operation: "initial",
        value: result.parsed.initial,
        previousTotal: result.parsed.initial,
        total: result.parsed.initial,
      },
      ...result.solvedSteps.map((step, index) => ({
        label: `Step ${index + 1}`,
        operation: step.operation,
        value: step.value,
        previousTotal: step.previousTotal,
        total: step.total,
      })),
      {
        label: "Final result",
        operation: "final",
        value: result.final,
        previousTotal: result.final,
        total: result.final,
      },
    ]
  }, [result])

  const handleSolve = () => {
    const input = problemInput.trim()
    console.log("[CustomEngine] solve_click", { inputLength: input.length })

    if (!input) {
      setErrorMessage("Please type a word problem first.")
      setResult(null)
      return
    }

    setIsSolving(true)
    setErrorMessage("")

    try {
      const parsed = parseProblem(input)
      validateStructure(parsed)

      const solved = solveSteps(parsed.initial, parsed.steps)
      const recomputedFinal = recomputeFinalIndependently(parsed.initial, parsed.steps)
      if (Math.abs(solved.final - recomputedFinal) > 0.0000001) {
        throw new Error("Validation mismatch: final answer does not match step calculations.")
      }

      const visualization = generateVisualizationData(solved.solvedSteps)
      const icon = ENTITY_ICON_MAP[parsed.entity] ?? "🔹"

      const maybeWarning = solved.final < 0 ? "Result is negative." : undefined

      console.log({
        initial: parsed.initial,
        steps: parsed.steps.map((step) => ({ operation: step.operation, value: step.value })),
        final: solved.final,
      })

      if (debugMode) {
        console.log("[CustomEngine] parsed", parsed)
        console.log("[CustomEngine] visualization", visualization)
      }

      setResult({
        parsed,
        solvedSteps: solved.solvedSteps,
        visualization,
        final: solved.final,
        explained: solved.explained,
        icon,
        warning: maybeWarning,
      })

      onSolved?.({
        entity: parsed.entity,
        finalAnswer: solved.final,
        operationTypes: parsed.steps.map((step) => step.operation),
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : FAIL_SAFE_MESSAGE
      setResult(null)
      setErrorMessage(message === FAIL_SAFE_MESSAGE ? FAIL_SAFE_MESSAGE : message)
      console.log("[CustomEngine] solve_error", { message })
    } finally {
      setIsSolving(false)
    }
  }

  const handleSolveKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleSolve()
    }
  }

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault()
      handleSolve()
    }
  }

  const allLineValues = result
    ? [result.parsed.initial, ...result.solvedSteps.flatMap((step) => [step.previousTotal, step.total])]
    : [0]
  const minLine = Math.min(...allLineValues, 0)
  const maxLine = Math.max(...allLineValues, 1)
  const lineRange = Math.max(1, maxLine - minLine)
  const toLineX = (value: number) => 24 + ((value - minLine) / lineRange) * (620 - 48)

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Try Your Own Word Problem</h2>
        <label className="text-xs font-medium flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={debugMode}
            onChange={(event) => setDebugMode(event.target.checked)}
            className="cursor-pointer"
          />
          Debug Mode
        </label>
      </div>

      <textarea
        value={problemInput}
        onChange={(event) => setProblemInput(event.target.value)}
        onKeyDown={handleInputKeyDown}
        placeholder="Example: A basket has 30 oranges. 10 are removed, then 5 more are added."
        className="w-full min-h-28 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coach-blue"
      />

      <div className="flex items-center gap-3">
        <Button onClick={handleSolve} onKeyDown={handleSolveKeyDown} disabled={isSolving} className="cursor-pointer">
          {isSolving ? "Solving..." : "Solve"}
        </Button>
        <p className="text-xs text-muted-foreground">Press Ctrl/Cmd + Enter to solve quickly.</p>
      </div>

      {errorMessage ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      {result ? (
        <div className="space-y-4">
          <div className="rounded-lg border bg-slate-50 p-3">
            <p className="text-sm font-semibold">Final Answer: {result.final}</p>
            {result.warning ? <p className="text-xs text-amber-700">{result.warning}</p> : null}
            {debugMode ? (
              <pre className="mt-2 text-[11px] overflow-auto rounded-md bg-slate-100 p-2 text-slate-700">
{JSON.stringify({
  initial: result.parsed.initial,
  steps: result.parsed.steps.map((step) => ({ operation: step.operation, value: step.value })),
}, null, 2)}
              </pre>
            ) : null}
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {displaySteps.map((step, index) => {
              const isAdd = step.operation === "add"
              const isSubtract = step.operation === "subtract"
              const tokenCount = clampTokenCount(isSubtract ? step.previousTotal : step.total)
              const removeStart = clampTokenCount(step.previousTotal - step.value)

              return (
                <motion.div
                  key={`${step.label}-${index}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-xl border bg-white p-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{step.label}</p>
                    {step.operation === "initial" || step.operation === "final" ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">{step.total}</span>
                    ) : (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isAdd ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                      }`}>
                        {getOperationText(step.operation as OperationType, step.value, step.total)}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground mt-1">Running total: {step.total}</p>

                  <div className="flex flex-wrap gap-1 mt-3 min-h-12">
                    <AnimatePresence>
                      {Array.from({ length: tokenCount }).map((_, tokenIndex) => {
                        const isAppearing = isAdd && tokenIndex >= clampTokenCount(step.previousTotal)
                        const isRemoving = isSubtract && tokenIndex >= removeStart

                        return (
                          <motion.div
                            key={`${step.label}-${tokenIndex}`}
                            initial={isAppearing ? { opacity: 0, scale: 0.4, y: 10 } : { opacity: 1 }}
                            animate={isRemoving ? { opacity: 0, scale: 0.5, x: -10 } : { opacity: 1, scale: 1, x: 0, y: 0 }}
                            transition={{ duration: 0.25, delay: isAppearing ? (tokenIndex % 10) * 0.02 : 0 }}
                            className={`h-8 w-8 rounded-md border flex items-center justify-center text-base ${
                              isAppearing
                                ? "bg-emerald-100 border-emerald-300"
                                : isRemoving
                                  ? "bg-rose-100 border-rose-300"
                                  : "bg-sky-50 border-sky-200"
                            }`}
                          >
                            {result.icon}
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <div className="rounded-xl border bg-white p-3">
            <p className="text-sm font-semibold mb-2">Number Line Jumps</p>
            <svg width="100%" viewBox="0 0 620 96" role="img" aria-label="number line jumps">
              <line x1={24} y1={56} x2={596} y2={56} stroke="#94a3b8" strokeWidth="3" />

              {Array.from({ length: 11 }).map((_, index) => {
                const value = minLine + (index / 10) * lineRange
                const x = toLineX(value)
                return (
                  <g key={`tick-${index}`}>
                    <line x1={x} y1={50} x2={x} y2={62} stroke="#94a3b8" strokeWidth="1.5" />
                    <text x={x} y={76} textAnchor="middle" fontSize="11" fill="#475569">{Math.round(value)}</text>
                  </g>
                )
              })}

              {result.visualization.map((step, index) => {
                const fromX = toLineX(step.from)
                const toX = toLineX(step.to)
                const arcY = step.operation === "subtract" ? 30 : 14
                const arrowSize = 5
                return (
                  <g key={`jump-${index}`}>
                    <path
                      d={`M ${fromX} 56 Q ${(fromX + toX) / 2} ${arcY} ${toX} 56`}
                      fill="none"
                      stroke={step.color}
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                    />
                    <polygon
                      points={step.direction === "forward"
                        ? `${toX},56 ${toX - arrowSize},${56 - arrowSize} ${toX - arrowSize},${56 + arrowSize}`
                        : `${toX},56 ${toX + arrowSize},${56 - arrowSize} ${toX + arrowSize},${56 + arrowSize}`
                      }
                      fill={step.color}
                    />
                    <text x={(fromX + toX) / 2} y={arcY - 3} textAnchor="middle" fontSize="12" fill={step.color} fontWeight="700">
                      {step.operation === "subtract" ? "-" : step.operation === "add" ? "+" : step.operation === "multiply" ? "x" : "/"}
                      {step.value}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        </div>
      ) : null}
    </Card>
  )
}
