"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { parseEquationInput } from "@/lib/utils"

interface EquationEditorProps {
  value: string
  onChange: (equation: string) => void
  quantities?: Array<{ name: string; value?: number; unit: string }>
  unknown?: string
}

export function EquationEditor({ value, onChange, quantities, unknown }: EquationEditorProps) {
  const [localValue, setLocalValue] = useState(value)
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = (newValue: string) => {
    const parsed = parseEquationInput(newValue)
    setLocalValue(parsed)
    onChange(parsed)
  }

  const insertSymbol = (symbol: string) => {
    handleChange(localValue + ' ' + symbol + ' ')
  }

  return (
    <div className="space-y-4">
      {/* Instruction */}
      <div className="bg-coach-green/10 rounded-xl p-4 border border-coach-green/20">
        <p className="text-sm text-coach-green">
          <strong>✏️ Build your equation:</strong> Use what you know to write the full equation.
          Don&apos;t forget the equals sign!
        </p>
      </div>

      {/* Available Variables */}
      {(quantities && quantities.length > 0) || unknown ? (
        <Card className="p-4">
          <h4 className="text-sm font-semibold mb-3">Your quantities and unknown:</h4>
          <div className="flex flex-wrap gap-2">
            {quantities?.map((q, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                onClick={() => insertSymbol(q.name)}
                className="text-xs"
              >
                {q.name} {q.value !== undefined && `(${q.value})`}
              </Button>
            ))}
            {unknown && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => insertSymbol('x')}
                className="text-xs bg-coach-purple/10 text-coach-purple"
              >
                x ({unknown})
              </Button>
            )}
          </div>
        </Card>
      ) : null}

      {/* Equation Input */}
      <div className="space-y-3">
        <div className="relative">
          <Input
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="e.g., 23 + 15 - 8 = x"
            className="text-lg font-mono h-14"
            onFocus={() => setShowHelp(true)}
            onBlur={() => setTimeout(() => setShowHelp(false), 200)}
          />
        </div>

        {/* Symbol Palette */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: showHelp ? 1 : 0, y: showHelp ? 0 : 10 }}
          className="flex gap-2 flex-wrap"
        >
          {['+', '−', '×', '÷', '=', '(', ')', 'x'].map((symbol) => (
            <Button
              key={symbol}
              variant="outline"
              size="lg"
              onClick={() => insertSymbol(symbol)}
              className="w-12 h-12 text-xl font-mono"
            >
              {symbol}
            </Button>
          ))}
        </motion.div>
      </div>

      {/* LaTeX Preview */}
      {localValue && (
        <Card className="p-4 bg-muted/50">
          <p className="text-xs text-muted-foreground mb-2">Preview:</p>
          <p className="text-lg font-mono">{localValue}</p>
        </Card>
      )}

      {/* Tips */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Use <code className="bg-muted px-1 rounded">x</code> for your unknown</p>
        <p>• Don&apos;t forget the equals sign!</p>
        <p>• You can use the buttons above or type directly</p>
      </div>
    </div>
  )
}
