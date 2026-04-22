"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MessageCircle, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"

interface CoachAvatarProps {
  message?: string
  isSpeaking?: boolean
  onSpeak?: () => void
}

export function CoachAvatar({ message, isSpeaking, onSpeak }: CoachAvatarProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative">
      {/* Animated Avatar */}
      <motion.div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          y: isHovered ? [0, -5, 0] : [0, -3, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-coach-purple to-coach-blue rounded-full blur-xl opacity-30 animate-pulse" />

        {/* Avatar Circle */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-coach-purple via-coach-blue to-coach-green p-1 shadow-2xl">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-5xl sm:text-6xl">
            🧙‍♂️
          </div>
        </div>

        {/* Sparkles Animation */}
        <motion.div
          className="absolute -top-2 -right-2"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-6 h-6 text-coach-yellow" />
        </motion.div>

        {/* Speak Button */}
        {onSpeak && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onSpeak}
            className={`absolute -bottom-2 -right-2 p-2 rounded-full bg-coach-blue text-white shadow-lg ${
              isSpeaking ? 'animate-pulse' : ''
            }`}
          >
            <MessageCircle className="w-5 h-5" />
          </motion.button>
        )}
      </motion.div>

      {/* Speech Bubble */}
      {message && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute left-full top-0 ml-4 sm:ml-8 max-w-xs sm:max-w-md"
        >
          <Card className="p-4 bg-gradient-to-br from-white to-coach-purple/5 border-coach-purple/20">
            <div className="relative">
              {/* Speech Bubble Arrow */}
              <div className="absolute -left-2 top-4 w-4 h-4 bg-white border-l border-b border-coach-purple/20 transform rotate-45" />
              <p className="text-sm sm:text-base leading-relaxed">
                {message}
              </p>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
