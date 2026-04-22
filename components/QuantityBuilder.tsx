"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import type { StudentQuantity } from "@/lib/types"

interface QuantityBuilderProps {
  quantities: StudentQuantity[]
  onChange: (quantities: StudentQuantity[]) => void
  problemText: string
}

export function QuantityBuilder({ quantities, onChange }: QuantityBuilderProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [newQuantity, setNewQuantity] = useState<StudentQuantity>({
    name: '',
    value: undefined,
    unit: '',
  })

  const handleAdd = () => {
    if (newQuantity.name && newQuantity.unit) {
      onChange([...quantities, { ...newQuantity, id: Date.now().toString() } as StudentQuantity])
      setNewQuantity({ name: '', value: undefined, unit: '' })
      setIsAdding(false)
    }
  }

  const handleRemove = (index: number) => {
    onChange(quantities.filter((_, i) => i !== index))
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setNewQuantity(quantities[index])
  }

  const handleSaveEdit = () => {
    if (editingIndex !== null && newQuantity.name && newQuantity.unit) {
      const updated = [...quantities]
      updated[editingIndex] = newQuantity
      onChange(updated)
      setEditingIndex(null)
      setNewQuantity({ name: '', value: undefined, unit: '' })
    }
  }

  return (
    <div className="space-y-4">
      {/* Instruction */}
      <div className="bg-coach-blue/10 rounded-xl p-4 border border-coach-blue/20">
        <p className="text-sm text-coach-blue">
          <strong>💡 Tip:</strong> Look for numbers in the problem that have units (like 23 stickers or $50).
          These are your quantities!
        </p>
      </div>

      {/* Existing Quantities */}
      <AnimatePresence>
        {quantities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <h4 className="text-sm font-semibold text-muted-foreground">Your Quantities:</h4>
            {quantities.map((q, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                layout
              >
                <Card className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📊</span>
                    <div>
                      {editingIndex === index ? (
                        <div className="flex gap-2">
                          <Input
                            value={newQuantity.name}
                            onChange={(e) => setNewQuantity({ ...newQuantity, name: e.target.value })}
                            className="w-32 h-8"
                            placeholder="Name"
                          />
                          <Input
                            type="number"
                            value={newQuantity.value ?? ''}
                            onChange={(e) => setNewQuantity({ ...newQuantity, value: parseFloat(e.target.value) || undefined })}
                            className="w-20 h-8"
                            placeholder="Value"
                          />
                          <Input
                            value={newQuantity.unit}
                            onChange={(e) => setNewQuantity({ ...newQuantity, unit: e.target.value })}
                            className="w-24 h-8"
                            placeholder="Unit"
                          />
                          <Button size="sm" onClick={handleSaveEdit}>Save</Button>
                        </div>
                      ) : (
                        <>
                          <p className="font-medium">
                            {q.name} {q.value !== undefined && `= ${q.value}`} {q.unit}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  {editingIndex !== index && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(index)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleRemove(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add New Quantity */}
      <AnimatePresence>
        {isAdding ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="p-4 space-y-3">
              <h4 className="text-sm font-semibold">Add a Quantity:</h4>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  value={newQuantity.name}
                  onChange={(e) => setNewQuantity({ ...newQuantity, name: e.target.value })}
                  placeholder="Name (e.g., apples)"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <Input
                  type="number"
                  value={newQuantity.value ?? ''}
                  onChange={(e) => setNewQuantity({ ...newQuantity, value: parseFloat(e.target.value) || undefined })}
                  placeholder="Value"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <Input
                  value={newQuantity.unit}
                  onChange={(e) => setNewQuantity({ ...newQuantity, unit: e.target.value })}
                  placeholder="Unit (e.g., apples)"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAdd} size="sm">
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsAdding(false)
                    setNewQuantity({ name: '', value: undefined, unit: '' })
                  }}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setIsAdding(true)}
            className="w-full border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" /> Add a Quantity
          </Button>
        )}
      </AnimatePresence>
    </div>
  )
}
