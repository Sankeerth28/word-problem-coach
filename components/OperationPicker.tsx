"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { OPERATION_OPTIONS } from "@/lib/utils"
import type { GradeBand } from "@/lib/types"

interface OperationPickerProps {
  selectedOperations: string[]
  onChange: (operations: string[]) => void
  relationship: string
  onRelationshipChange: (relationship: string) => void
  gradeBand: GradeBand
}

export function OperationPicker({
  selectedOperations,
  onChange,
  relationship,
  onRelationshipChange,
  gradeBand,
}: OperationPickerProps) {
  const [customRelationship, setCustomRelationship] = useState(relationship)

  const toggleOperation = (opId: string) => {
    if (selectedOperations.includes(opId)) {
      onChange(selectedOperations.filter(o => o !== opId))
    } else {
      onChange([...selectedOperations, opId])
    }
  }

  // Filter operations by grade band
  const availableOperations = OPERATION_OPTIONS.filter(op =>
    (op.gradeBands as readonly string[]).includes(gradeBand)
  )

  return (
    <div className="space-y-6">
      {/* Instruction */}
      <div className="bg-coach-purple/10 rounded-xl p-4 border border-coach-purple/20">
        <p className="text-sm text-coach-purple">
          <strong>💡 Tip:</strong> Think about what&apos;s happening in the problem.
          Are things being combined? Taken away? Split up? Compare?
        </p>
      </div>

      {/* Operation Chips */}
      <div>
        <h4 className="text-sm font-semibold text-muted-foreground mb-3">
          Choose the operations/relationships:
        </h4>
        <div className="flex flex-wrap gap-2">
          {availableOperations.map((op) => {
            const isSelected = selectedOperations.includes(op.id)
            return (
              <motion.button
                key={op.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleOperation(op.id)}
                className={`
                  relative px-4 py-3 rounded-xl font-medium transition-all duration-200
                  ${isSelected
                    ? 'bg-coach-purple text-white shadow-lg'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{op.symbol}</span>
                  <span>{op.label}</span>
                  {isSelected && (
                    <Check className="w-4 h-4 absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5" />
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Relationship Description */}
      <div>
        <h4 className="text-sm font-semibold text-muted-foreground mb-3">
          In your own words, how are these quantities related?
        </h4>
        <Card className="p-4">
          <Input
            value={customRelationship}
            onChange={(e) => {
              setCustomRelationship(e.target.value)
              onRelationshipChange(e.target.value)
            }}
            placeholder="e.g., 'We add the bought stickers to the starting amount, then subtract what was given away'"
            className="min-h-[80px]"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Don&apos;t worry about being perfect - just explain it like you would to a friend!
          </p>
        </Card>
      </div>
    </div>
  )
}
