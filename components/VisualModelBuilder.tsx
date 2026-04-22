"use client"

import { useState, useRef, useEffect } from "react"
import { Stage, Layer, Rect, Text as KonvaText, Group, Line } from "react-konva"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface VisualModelBuilderProps {
  quantities?: Array<{ name: string; value?: number; unit: string }>
  problemText?: string
}

export function VisualModelBuilder({ quantities, problemText }: VisualModelBuilderProps) {
  const CANVAS_PADDING = 24
  const CANVAS_GAP = 14
  const ROW_HEIGHT = 94
  const MIN_BAR_WIDTH = 110
  const MAX_BAR_WIDTH = 320
  const VALUE_SCALE = 11
  const BAR_DEPTH = 10

  const normalizeLabel = (raw: string) =>
    raw
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim()

  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

  const adjustHexColor = (hex: string, amount: number) => {
    const normalized = hex.replace("#", "")
    const safe = normalized.length === 3
      ? normalized.split("").map((c) => `${c}${c}`).join("")
      : normalized

    const r = clamp(parseInt(safe.slice(0, 2), 16) + amount, 0, 255)
    const g = clamp(parseInt(safe.slice(2, 4), 16) + amount, 0, 255)
    const b = clamp(parseInt(safe.slice(4, 6), 16) + amount, 0, 255)

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
  }

  const inferAction = (label: string): "start" | "add" | "remove" | "track" => {
    const normalized = label.toLowerCase()

    if (/(initial|start|begin|original|first)/.test(normalized)) return "start"
    if (/(buy|bought|add|gain|more|receive|received|extra|increase)/.test(normalized)) return "add"
    if (/(give|given|spent|spent_|lose|lost|left|remove|decrease|used|away)/.test(normalized)) return "remove"

    return "track"
  }

  const getUnitIcon = (unit: string, label: string) => {
    const probe = `${unit} ${label}`.toLowerCase()
    if (/sticker/.test(probe)) return "🌟"
    if (/(book|notebook)/.test(probe)) return "📚"
    if (/(pencil|pen|eraser)/.test(probe)) return "✏️"
    if (/(dollar|money|coin|rupee|cash)/.test(probe)) return "💰"
    if (/(apple|fruit|orange|banana)/.test(probe)) return "🍎"
    if (/(toy|ball)/.test(probe)) return "🧩"
    return "🔹"
  }

  const formatStoryBeat = (label: string, value: number, unit: string, index: number) => {
    const action = inferAction(label)
    const prettyLabel = normalizeLabel(label)

    if (action === "start") {
      return `Scene ${index + 1}: Start with ${value} ${unit}.`
    }
    if (action === "add") {
      return `Scene ${index + 1}: Add ${value} ${unit}.`
    }
    if (action === "remove") {
      return `Scene ${index + 1}: Remove ${value} ${unit}.`
    }

    return `Scene ${index + 1}: Track ${value} ${unit} for ${prettyLabel}.`
  }

  const getBarWidth = (value: number) =>
    Math.max(MIN_BAR_WIDTH, Math.min(MAX_BAR_WIDTH, value * VALUE_SCALE))

  const getSignedValue = (action: "start" | "add" | "remove" | "track", value: number, index: number) => {
    if (action === "remove") return -value
    if (action === "start" && index === 0) return value
    return value
  }

  const getLabelForBar = (label: string) => {
    const pretty = normalizeLabel(label)
    return pretty.length > 24 ? `${pretty.slice(0, 21)}...` : pretty
  }

  const layoutBars = <T extends { width: number }>(items: T[], canvasWidth: number) => {
    let x = CANVAS_PADDING
    let y = 48

    return items.map((item) => {
      if (x + item.width > canvasWidth - CANVAS_PADDING) {
        x = CANVAS_PADDING
        y += ROW_HEIGHT
      }

      const positioned = {
        ...item,
        x,
        y,
      }

      x += item.width + CANVAS_GAP
      return positioned
    })
  }

  const [bars, setBars] = useState<Array<{
    id: string
    label: string
    value: number
    unit: string
    action: "start" | "add" | "remove" | "track"
    color: string
    width: number
    x: number
    y: number
  }>>([])
  const [selectedColor, setSelectedColor] = useState('#8B5CF6')
  const [visualMode, setVisualMode] = useState<"3d" | "classic">("3d")
  const [learnerLevel, setLearnerLevel] = useState<"kids" | "middle" | "intermediate">("kids")
  const containerRef = useRef<HTMLDivElement | null>(null)
  const hasAutoSeededRef = useRef(false)
  const [canvasWidth, setCanvasWidth] = useState(800)

  const colors = [
    '#8B5CF6',
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#F97316',
    '#EC4899',
  ]

  const addBar = (label: string, value: number, unit = "items") => {
    const safeValue = Number.isFinite(value) && value > 0 ? value : 1

    setBars((previousBars) => {
      const newBar = {
        id: `bar-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        label,
        value: safeValue,
        unit,
        action: inferAction(label),
        color: selectedColor,
        width: getBarWidth(safeValue),
        x: 0,
        y: 0,
      }

      return layoutBars([...previousBars, newBar], canvasWidth)
    })
  }

  const removeBar = (id: string) => {
    setBars((previousBars) => layoutBars(previousBars.filter((bar) => bar.id !== id), canvasWidth))
  }

  const clearAll = () => {
    setBars([])
  }

  useEffect(() => {
    if (!containerRef.current) return

    const updateWidth = () => {
      const measuredWidth = Math.floor(containerRef.current?.clientWidth || 800)
      setCanvasWidth(Math.max(320, measuredWidth))
    }

    updateWidth()

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(() => updateWidth())
      observer.observe(containerRef.current)
      return () => observer.disconnect()
    }

    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  useEffect(() => {
    setBars((previousBars) => layoutBars(previousBars, canvasWidth))
  }, [canvasWidth])

  useEffect(() => {
    if (!quantities || quantities.length === 0) return
    if (hasAutoSeededRef.current) return

    hasAutoSeededRef.current = true
    const timers: ReturnType<typeof setTimeout>[] = []

    quantities.forEach((q, index) => {
      const timer = setTimeout(() => {
        addBar(q.name, q.value || 10, q.unit)
      }, index * 120)

      timers.push(timer)
    })

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [quantities])

  const sourceForStory = bars.length > 0
    ? bars.map((bar) => ({ name: bar.label, value: bar.value, unit: bar.unit }))
    : (quantities || []).filter((q) => typeof q.value === "number")

  const storyBeats = sourceForStory.map((q, index) =>
    formatStoryBeat(q.name, q.value || 0, q.unit, index)
  )

  const sceneMath = bars.reduce<Array<{ expression: string; total: number }>>((acc, bar, index) => {
    const signedValue = getSignedValue(bar.action, bar.value, index)
    const previousTotal = index === 0 ? 0 : acc[index - 1].total
    const nextTotal = (bar.action === "start" && index === 0)
      ? bar.value
      : previousTotal + signedValue
    const sign = signedValue >= 0 ? "+" : "-"

    acc.push({
      expression: `${sign} ${Math.abs(signedValue)} ${bar.unit}`,
      total: nextTotal,
    })

    return acc
  }, [])

  const rowsUsed = Math.max(1, ...bars.map((bar) => Math.floor((bar.y - 48) / ROW_HEIGHT) + 1))
  const stageHeight = Math.max(250, rowsUsed * ROW_HEIGHT + 88)
  const finalTotal = sceneMath.length > 0 ? sceneMath[sceneMath.length - 1].total : null

  const levelGuide = {
    kids: "Kids Mode: Read each scene and count the picture blocks.",
    middle: "Middle Mode: Follow scene actions and check the running total.",
    intermediate: "Intermediate Mode: Track operations and verify each step mathematically.",
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Story Model Builder</h3>
        {bars.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-1" /> Clear
          </Button>
        )}
      </div>

      {problemText && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          Story: {problemText}
        </p>
      )}

      {storyBeats.length > 0 && (
        <div className="rounded-xl border bg-slate-50 p-3 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Story Timeline
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={learnerLevel === "kids" ? "default" : "outline"}
                onClick={() => setLearnerLevel("kids")}
                className="h-7 px-2"
              >
                Kids
              </Button>
              <Button
                size="sm"
                variant={learnerLevel === "middle" ? "default" : "outline"}
                onClick={() => setLearnerLevel("middle")}
                className="h-7 px-2"
              >
                Middle
              </Button>
              <Button
                size="sm"
                variant={learnerLevel === "intermediate" ? "default" : "outline"}
                onClick={() => setLearnerLevel("intermediate")}
                className="h-7 px-2"
              >
                Intermediate
              </Button>
            </div>
          </div>
          <p className="text-xs text-slate-600">{levelGuide[learnerLevel]}</p>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Scenes
          </p>
          <div className="space-y-1.5">
            {storyBeats.map((beat) => (
              <motion.p
                key={beat}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-slate-700"
              >
                {beat}
              </motion.p>
            ))}
          </div>
          {sceneMath.length > 0 && (
            <div className="pt-2 border-t border-slate-200">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2">
                Story Math
              </p>
              <div className="flex flex-wrap gap-2">
                {sceneMath.map((scene, index) => (
                  <span
                    key={`${scene.expression}-${index}`}
                    className="text-xs px-2 py-1 rounded-full bg-white border text-slate-700"
                  >
                    Scene {index + 1}: {scene.expression} to total {scene.total}
                  </span>
                ))}
              </div>
              {finalTotal !== null && (
                <div className="mt-2 text-sm font-semibold text-slate-800">
                  Final Answer: {finalTotal}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={visualMode === "3d" ? "default" : "outline"}
            onClick={() => setVisualMode("3d")}
          >
            3D View
          </Button>
          <Button
            size="sm"
            variant={visualMode === "classic" ? "default" : "outline"}
            onClick={() => setVisualMode("classic")}
          >
            Classic View
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        {colors.map(color => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            className={`w-8 h-8 rounded-full transition-transform ${
              selectedColor === color ? 'scale-125 ring-2 ring-offset-2 ring-gray-400' : ''
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {quantities && quantities.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {quantities.map((q, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              onClick={() => addBar(q.name, q.value || 10, q.unit)}
            >
              {getUnitIcon(q.unit, q.name)} scene: {normalizeLabel(q.name)} {q.value && `(${q.value})`}
            </Button>
          ))}
        </div>
      )}

      <div ref={containerRef} className="border rounded-xl overflow-hidden bg-gray-50">
        <Stage
          width={canvasWidth}
          height={stageHeight}
          className="cursor-crosshair"
        >
          <Layer>
            {[...Array(Math.max(1, Math.floor((canvasWidth - CANVAS_PADDING * 2) / 50)))].map((_, i) => (
              <Rect
                key={`vgrid-${i}`}
                x={CANVAS_PADDING + i * 50}
                y={20}
                width={1}
                height={Math.max(200, stageHeight - 50)}
                fill="#e5e5e5"
              />
            ))}

            {bars.map((bar) => (
              <Group key={bar.id} x={bar.x} y={bar.y}>
                {visualMode === "3d" ? (
                  <>
                    <Line
                      points={[
                        0, 0,
                        BAR_DEPTH, -BAR_DEPTH,
                        bar.width + BAR_DEPTH, -BAR_DEPTH,
                        bar.width, 0,
                      ]}
                      closed
                      fill={adjustHexColor(bar.color, 35)}
                    />
                    <Line
                      points={[
                        bar.width, 0,
                        bar.width + BAR_DEPTH, -BAR_DEPTH,
                        bar.width + BAR_DEPTH, 60 - BAR_DEPTH,
                        bar.width, 60,
                      ]}
                      closed
                      fill={adjustHexColor(bar.color, -35)}
                    />
                    <Rect
                      width={bar.width}
                      height={60}
                      fill={bar.color}
                      cornerRadius={8}
                      shadowColor="black"
                      shadowBlur={10}
                      shadowOpacity={0.2}
                    />
                  </>
                ) : (
                  <Rect
                    width={bar.width}
                    height={60}
                    fill={bar.color}
                    cornerRadius={8}
                    shadowColor="black"
                    shadowBlur={10}
                    shadowOpacity={0.2}
                  />
                )}
                <KonvaText
                  text={getLabelForBar(bar.label)}
                  fontSize={14}
                  fontFamily="Arial"
                  fill="#333"
                  x={0}
                  y={-25}
                  align="center"
                  width={bar.width}
                />
                <KonvaText
                  text={`${getUnitIcon(bar.unit, bar.label)} ${bar.action === "remove" ? "-" : ""}${bar.value} ${bar.unit}`}
                  fontSize={16}
                  fontFamily="Arial"
                  fontStyle="bold"
                  fill="white"
                  x={0}
                  y={20}
                  align="center"
                  width={bar.width}
                />
                <Group
                  x={bar.width - 20}
                  y={-10}
                  onClick={() => removeBar(bar.id)}
                  onTap={() => removeBar(bar.id)}
                  onMouseEnter={(e) => {
                    const stage = e.target.getStage()
                    if (stage) {
                      stage.container().style.cursor = 'pointer'
                    }
                  }}
                  onMouseLeave={(e) => {
                    const stage = e.target.getStage()
                    if (stage) {
                      stage.container().style.cursor = 'crosshair'
                    }
                  }}
                >
                  <Rect
                    x={0}
                    y={0}
                    width={20}
                    height={20}
                    fill="#ef4444"
                    cornerRadius={10}
                  />
                  <KonvaText
                    text="x"
                    fontSize={14}
                    fill="white"
                    x={0}
                    y={5}
                    align="center"
                    width={20}
                    listening={false}
                  />
                </Group>
              </Group>
            ))}
          </Layer>
        </Stage>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Build the story scene by scene in 3D. Click x on any block to remove that scene.
      </p>
    </Card>
  )
}
