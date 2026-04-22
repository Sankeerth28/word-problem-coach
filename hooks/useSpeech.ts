"use client"

import { useState, useCallback, useEffect } from "react"

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)

  // Check for speech synthesis support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true)

      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices()
        setVoices(availableVoices)

        // Prefer a friendly, younger-sounding voice
        const preferredVoice = availableVoices.find(
          voice => voice.name.includes('Google') ||
                   voice.name.includes('Female') ||
                   voice.lang.startsWith('en')
        ) || availableVoices[0]

        setSelectedVoice(preferredVoice || null)
      }

      loadVoices()

      // Chrome loads voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices
      }
    }
  }, [])

  const speak = useCallback((text: string, options?: {
    rate?: number
    pitch?: number
    volume?: number
    onEnd?: () => void
  }) => {
    if (!isSupported) {
      console.warn('Speech synthesis not supported')
      return
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)

    if (selectedVoice) {
      utterance.voice = selectedVoice
    }

    utterance.rate = options?.rate ?? 0.9 // Slightly slower for clarity
    utterance.pitch = options?.pitch ?? 1.1 // Slightly higher for friendliness
    utterance.volume = options?.volume ?? 1

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => {
      setIsSpeaking(false)
      options?.onEnd?.()
    }
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event)
      setIsSpeaking(false)
    }

    window.speechSynthesis.speak(utterance)
  }, [isSupported, selectedVoice])

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [isSupported])

  const pause = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.pause()
    }
  }, [isSupported])

  const resume = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.resume()
    }
  }, [isSupported])

  const changeVoice = useCallback((voiceIndex: number) => {
    if (voices[voiceIndex]) {
      setSelectedVoice(voices[voiceIndex])
    }
  }, [voices])

  // Speech-to-text (dictation)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')

  const startListening = useCallback((options?: {
    onResult?: (transcript: string) => void
    onEnd?: () => void
  }) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported')
      return
    }

    // @ts-ignore - SpeechRecognition is not in TypeScript lib
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => setIsListening(true)

    recognition.onresult = (event: any) => {
      let finalTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        }
      }
      setTranscript(finalTranscript)
      options?.onResult?.(finalTranscript)
    }

    recognition.onend = () => {
      setIsListening(false)
      options?.onEnd?.()
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }

    recognition.start()
  }, [])

  const stopListening = useCallback(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.stop()
      setIsListening(false)
    }
  }, [])

  return {
    // Text-to-speech
    isSpeaking,
    isSpeechSupported: isSupported,
    voices,
    selectedVoice,
    speak,
    stop,
    pause,
    resume,
    changeVoice,

    // Speech-to-text
    isListening,
    isListeningSupported: typeof window !== 'undefined' &&
      ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window),
    transcript,
    startListening,
    stopListening,
  }
}
