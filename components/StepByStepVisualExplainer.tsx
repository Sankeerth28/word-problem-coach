"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"

interface Quantity {
  name: string
  value?: number
  unit: string
}

interface StepByStepVisualExplainerProps {
  quantities?: Quantity[]
  problemText?: string
}

type SceneKind = "initial" | "change-1" | "change-2" | "final"
type ActionKind = "start" | "add" | "remove"

interface Scene {
  id: SceneKind
  action: ActionKind
  title: string
  total: number
  delta: number
  fromTotal: number
  toTotal: number
  icon: string
}

export function StepByStepVisualExplainer({
  quantities = [],
  problemText = "",
}: StepByStepVisualExplainerProps) {
  const [currentScene, setCurrentScene] = useState<number>(0)
  const [chunkSize, setChunkSize] = useState<5 | 10>(5)
  const [autoPlay, setAutoPlay] = useState<boolean>(false)
  const [debugMode, setDebugMode] = useState<boolean>(true)

  const logEvent = useCallback((event: string, payload: Record<string, unknown> = {}) => {
    // Always log interactions/state transitions for debugging.
    console.log("[StepVisual]", event, payload)
  }, [])

  const sanitizeValue = (value?: number): number => {
    if (!Number.isFinite(value)) return 0
    return Math.max(0, Math.floor(Number(value)))
  }


  const inferAction = (label: string): ActionKind => {
    const normalized = label.toLowerCase()
    if (/(initial|start|begin|original|first)/.test(normalized)) return "start"
    if (/(buy|bought|add|gain|more|receive|received|extra|increase)/.test(normalized)) return "add"
    if (/(give|given|spent|lose|lost|left|remove|decrease|used|away)/.test(normalized)) return "remove"
    return "add"
  }

  const getIcon = (unit: string, label: string): string => {
    const probe = `${unit} ${label}`.toLowerCase()
    if (/sticker/.test(probe)) return "🌟"
    if (/(book|notebook)/.test(probe)) return "📚"
    if (/(pencil|pen|eraser)/.test(probe)) return "✏️"
    if (/(dollar|money|coin|rupee|cash)/.test(probe)) return "💰"
    if (/(apple|fruit|orange|banana)/.test(probe)) return "🍎"
    return "🔹"
  }

  const scenes = useMemo<Scene[]>(() => {
    const source = Array.isArray(quantities) ? quantities : []
    const normalized = source.map((q) => ({
      name: q.name || "items",
      action: inferAction(q.name || "items"),
      value: sanitizeValue(q.value),
      unit: q.unit || "items",
      icon: getIcon(q.unit || "items", q.name || "items"),
    }))

    const startCandidate = normalized.find((q) => q.action === "start") || normalized[0] || {
      name: "initial items",
      action: "start" as ActionKind,
      value: 0,
      unit: "items",
      icon: "🔹",
    }

    const nonStart = normalized.filter((q) => q !== startCandidate)
    const change1 = nonStart[0] || {
      name: "change one",
      action: "add" as ActionKind,
      value: 0,
      unit: startCandidate.unit,
      icon: startCandidate.icon,
    }
    const change2 = nonStart[1] || {
      name: "change two",
      action: "add" as ActionKind,
      value: 0,
      unit: startCandidate.unit,
      icon: startCandidate.icon,
    }

    const initialTotal = startCandidate.value
    const afterFirst = Math.max(
      0,
      change1.action === "remove" ? initialTotal - change1.value : initialTotal + change1.value
    )
    const afterSecond = Math.max(
      0,
      change2.action === "remove" ? afterFirst - change2.value : afterFirst + change2.value
    )

    return [
      {
        id: "initial",
        action: "start",
        title: "1. Initial",
        total: initialTotal,
        delta: initialTotal,
        fromTotal: 0,
        toTotal: initialTotal,
        icon: startCandidate.icon,
      },
      {
        id: "change-1",
        action: change1.action,
        title: "2. First Change",
        total: afterFirst,
        delta: change1.value,
        fromTotal: initialTotal,
        toTotal: afterFirst,
        icon: change1.icon,
      },
      {
        id: "change-2",
        action: change2.action,
        title: "3. Second Change",
        total: afterSecond,
        delta: change2.value,
        fromTotal: afterFirst,
        toTotal: afterSecond,
        icon: change2.icon,
      },
      {
        id: "final",
        action: "start",
        title: "4. Final Result",
        total: afterSecond,
        delta: afterSecond,
        fromTotal: afterSecond,
        toTotal: afterSecond,
        icon: startCandidate.icon,
      },
    ]
  }, [quantities])

  const safeSceneIndex = Math.min(Math.max(0, currentScene), Math.max(0, scenes.length - 1))
  const activeScene = scenes[safeSceneIndex]

  const maxCountForObjects = Math.max(0, activeScene?.toTotal || 0)

  const chunkedRows = useMemo(() => {
    const rows: number[][] = []
    const count = maxCountForObjects
    for (let start = 0; start < count; start += chunkSize) {
      const row: number[] = []
      for (let i = start; i < Math.min(start + chunkSize, count); i++) {
        row.push(i)
      }
      rows.push(row)
    }
    return rows
  }, [maxCountForObjects, chunkSize])

  const onSceneSelect = useCallback((index: number, source: string) => {
    const safe = Math.min(Math.max(index, 0), scenes.length - 1)
    logEvent("scene_select", { index: safe, source })
    setCurrentScene(safe)
  }, [logEvent, scenes.length])

  const onInteractiveKeyDown = useCallback((event: React.KeyboardEvent, action: () => void, label: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      logEvent("key_activate", { label, key: event.key })
      action()
    }
  }, [logEvent])

  const onPrev = useCallback(() => {
    onSceneSelect(safeSceneIndex - 1, "prev_button")
  }, [onSceneSelect, safeSceneIndex])

  const onNext = useCallback(() => {
    onSceneSelect(safeSceneIndex + 1, "next_button")
  }, [onSceneSelect, safeSceneIndex])

  useEffect(() => {
    if (currentScene > scenes.length - 1) {
      setCurrentScene(Math.max(0, scenes.length - 1))
    }
  }, [currentScene, scenes.length])

  useEffect(() => {
    if (!autoPlay) return
    const timer = window.setInterval(() => {
      setCurrentScene((prev) => {
        const next = prev >= scenes.length - 1 ? 0 : prev + 1
        logEvent("autoplay_tick", { previous: prev, next })
        return next
      })
    }, 1800)

    return () => window.clearInterval(timer)
  }, [autoPlay, scenes.length, logEvent])

  useEffect(() => {
    logEvent("state_update", {
      currentScene: safeSceneIndex,
      chunkSize,
      autoPlay,
      debugMode,
      activeTotal: activeScene?.total || 0,
    })
  }, [safeSceneIndex, chunkSize, autoPlay, debugMode, activeScene?.total, logEvent])

  const canGoPrev = safeSceneIndex > 0
  const canGoNext = safeSceneIndex < scenes.length - 1

  const getDeltaBadge = () => {
    if (!activeScene) return null
    if (activeScene.id === "initial" || activeScene.id === "final") return null

    const isAdd = activeScene.action === "add"
    const colorClass = isAdd
      ? "bg-emerald-100 text-emerald-700 border-emerald-300"
      : "bg-rose-100 text-rose-700 border-rose-300"

    return (
      <motion.div
        key={`delta-${safeSceneIndex}`}
        initial={isAdd ? { opacity: 0, x: -30 } : { opacity: 1, scale: 1 }}
        animate={isAdd ? { opacity: 1, x: 0 } : { opacity: 1, scale: [1, 0.95, 1] }}
        transition={{ duration: 0.4 }}
        className={`px-3 py-1 rounded-full border text-sm font-semibold ${colorClass}`}
      >
        {isAdd ? "+" : "-"}
        {activeScene.delta}
      </motion.div>
    )
  }

  const renderNumberLine = () => {
    const maxValue = Math.max(1, ...scenes.map((s) => s.toTotal))
    const ticks = Math.min(maxValue + 1, 11)
    const width = 640
    const xPos = (value: number) => 24 + (value / Math.max(1, maxValue)) * (width - 48)

    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <svg width="100%" viewBox={`0 0 ${width} 96`} role="img" aria-label="Number line with jumps">
          <line x1={24} y1={54} x2={width - 24} y2={54} stroke="#94a3b8" strokeWidth="3" />

          {Array.from({ length: ticks }).map((_, i) => {
            const value = Math.round((i * maxValue) / Math.max(1, ticks - 1))
            const x = xPos(value)
            return (
              <g key={`tick-${i}`}>
                <line x1={x} y1={48} x2={x} y2={60} stroke="#94a3b8" strokeWidth="2" />
                <text x={x} y={76} textAnchor="middle" fontSize="11" fill="#475569">
                  {value}
                </text>
              </g>
            )
          })}

          {scenes.slice(0, 3).map((s, index) => {
            const isVisible = safeSceneIndex >= index
            const jumpColor = s.action === "remove" ? "#ef4444" : "#10b981"
            const from = xPos(s.fromTotal)
            const to = xPos(s.toTotal)
            const mid = (from + to) / 2
            const arcY = s.action === "remove" ? 26 : 14

            return (
              <g key={`jump-${s.id}`} opacity={isVisible ? 1 : 0.25}>
                <path
                  d={`M ${from} 54 Q ${mid} ${arcY} ${to} 54`}
                  fill="none"
                  stroke={jumpColor}
                  strokeWidth="2.5"
                  strokeDasharray="5 5"
                />
                {index > 0 && (
                  <text x={mid} y={arcY - 4} textAnchor="middle" fontSize="12" fill={jumpColor} fontWeight="700">
                    {s.action === "remove" ? "-" : "+"}
                    {s.delta}
                  </text>
                )}
              </g>
            )
          })}

          <motion.circle
            cx={xPos(activeScene?.toTotal || 0)}
            cy="54"
            r="7"
            fill="#2563eb"
            animate={{ cx: xPos(activeScene?.toTotal || 0) }}
            transition={{ duration: 0.45 }}
          />
        </svg>
      </div>
    )
  }

  return (
    <Card className="p-5 md:p-6 space-y-5 bg-gradient-to-b from-sky-50 to-white">
      {problemText ? (
        <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
          {problemText}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Running Total</p>
          <motion.div
            key={`running-${safeSceneIndex}`}
            initial={{ scale: 0.85, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="text-4xl md:text-5xl font-black text-blue-600"
          >
            {activeScene?.total || 0}
          </motion.div>
          {getDeltaBadge()}
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={debugMode}
            onChange={(event) => {
              const checked = event.target.checked
              setDebugMode(checked)
              logEvent("debug_mode_change", { checked })
            }}
            onKeyDown={(event) => onInteractiveKeyDown(event, () => setDebugMode((v) => !v), "debug_mode_toggle")}
            className="h-4 w-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          />
          Debug Logs
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {scenes.map((scene, index) => {
          const active = index === safeSceneIndex
          return (
            <motion.button
              key={scene.id}
              type="button"
              onClick={() => onSceneSelect(index, "scene_card")}
              onKeyDown={(event) => onInteractiveKeyDown(event, () => onSceneSelect(index, "scene_card_key"), scene.id)}
              tabIndex={0}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full text-left rounded-lg border px-3 py-3 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                active
                  ? "border-blue-500 bg-blue-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
              aria-pressed={active}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{scene.title}</p>
              <p className="text-xl font-bold text-slate-800 mt-1">{scene.total}</p>
            </motion.button>
          )
        })}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={chunkSize === 5 ? "default" : "outline"}
            onClick={() => {
              setChunkSize(5)
              logEvent("chunk_change", { chunkSize: 5 })
            }}
            onKeyDown={(event) => onInteractiveKeyDown(event, () => {
              setChunkSize(5)
              logEvent("chunk_change", { chunkSize: 5, via: "key" })
            }, "chunk_5")}
            className="cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Group 5
          </Button>
          <Button
            type="button"
            size="sm"
            variant={chunkSize === 10 ? "default" : "outline"}
            onClick={() => {
              setChunkSize(10)
              logEvent("chunk_change", { chunkSize: 10 })
            }}
            onKeyDown={(event) => onInteractiveKeyDown(event, () => {
              setChunkSize(10)
              logEvent("chunk_change", { chunkSize: 10, via: "key" })
            }, "chunk_10")}
            className="cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Group 10
          </Button>
        </div>

        <Button
          type="button"
          size="sm"
          variant={autoPlay ? "default" : "outline"}
          onClick={() => {
            setAutoPlay((prev) => {
              const next = !prev
              logEvent("autoplay_toggle", { next })
              return next
            })
          }}
          onKeyDown={(event) => onInteractiveKeyDown(event, () => {
            setAutoPlay((prev) => {
              const next = !prev
              logEvent("autoplay_toggle", { next, via: "key" })
              return next
            })
          }, "autoplay_toggle")}
          className="cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {autoPlay ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
          {autoPlay ? "Pause" : "Auto Play"}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`scene-${safeSceneIndex}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl border border-slate-200 bg-white p-4"
        >
          <div className="space-y-3" style={{ minHeight: "220px" }}>
            {chunkedRows.map((row, rowIndex) => (
              <div key={`row-${rowIndex}`} className="flex flex-wrap gap-2 justify-center">
                {row.map((token) => {
                  const changeScene = activeScene?.id === "change-1" || activeScene?.id === "change-2"
                  const fromTotal = activeScene?.fromTotal || 0
                  const delta = activeScene?.delta || 0
                  const removeStart = Math.max(0, fromTotal - delta)
                  const isNewAdd = changeScene && activeScene?.action === "add" && token >= fromTotal
                  const isRemovedZone = changeScene && activeScene?.action === "remove" && token >= removeStart && token < fromTotal

                  return (
                    <motion.div
                      key={`token-${rowIndex}-${token}`}
                      initial={isNewAdd ? { opacity: 0, x: -20, scale: 0.7 } : { opacity: 1 }}
                      animate={
                        isRemovedZone
                          ? { opacity: 0.2, scale: 0.8 }
                          : { opacity: 1, x: 0, scale: 1 }
                      }
                      transition={{ duration: 0.28, delay: isNewAdd ? (token - fromTotal) * 0.04 : 0 }}
                      className={`h-12 w-12 rounded-xl text-2xl flex items-center justify-center border ${
                        isNewAdd
                          ? "bg-emerald-100 border-emerald-300"
                          : isRemovedZone
                            ? "bg-rose-100 border-rose-300"
                            : "bg-sky-50 border-sky-200"
                      }`}
                    >
                      {activeScene?.icon || "🔹"}
                    </motion.div>
                  )
                })}
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {renderNumberLine()}

      <div className="flex items-center justify-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          onKeyDown={(event) => onInteractiveKeyDown(event, onPrev, "prev")}
          disabled={!canGoPrev}
          className="cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Prev
        </Button>
        <p className="text-sm font-semibold text-slate-700 min-w-20 text-center">
          {safeSceneIndex + 1} / {scenes.length}
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={onNext}
          onKeyDown={(event) => onInteractiveKeyDown(event, onNext, "next")}
          disabled={!canGoNext}
          className="cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </Card>
  )
}
