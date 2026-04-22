"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Latex from "react-latex-next"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface LaTeXPreviewProps {
  equation: string
  className?: string
  showLabel?: boolean
}

export function LaTeXPreview({ equation, className, showLabel = true }: LaTeXPreviewProps) {
  const [latex, setLatex] = useState('')

  useEffect(() => {
    // Convert equation to LaTeX format
    const converted = equation
      .replace(/×/g, '\\times ')
      .replace(/÷/g, '\\div ')
      .replace(/−/g, '-')
      .replace(/(\d+)([a-z])/gi, '$1{\\$2}') // 5x -> 5{x}
      .replace(/\^(\d+)/g, '^{($1)}')

    setLatex(converted)
  }, [equation])

  if (!equation) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn('space-y-2', className)}
    >
      {showLabel && (
        <p className="text-xs text-muted-foreground font-medium">
          Math Preview:
        </p>
      )}
      <Card className="p-6 bg-gradient-to-br from-coach-purple/5 to-coach-blue/5 border-coach-purple/20">
        <div className="text-center">
          <Latex>{`$$${latex}$$`}</Latex>
        </div>
      </Card>
    </motion.div>
  )
}
