"use client"

import { useState, useEffect, useCallback } from "react"
import { LOCAL_STORAGE_KEYS } from "@/lib/constants"

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Get from localStorage then parse stored json
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  }, [initialValue, key])

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(readValue)

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value

      // Save state
      setStoredValue(valueToStore)

      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  useEffect(() => {
    setStoredValue(readValue())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [storedValue, setValue]
}

// Specialized hooks for common localStorage use cases

export function usePreferredGrade() {
  return useLocalStorage<'3-5' | '6-8' | 'algebra-1' | null>(
    LOCAL_STORAGE_KEYS.PREFERRED_GRADE,
    null
  )
}

export function useSessionId() {
  return useLocalStorage<string>(
    LOCAL_STORAGE_KEYS.SESSION_ID,
    `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  )
}

export function useProgress() {
  return useLocalStorage<{
    totalAttempts: number
    correctAttempts: number
    topicsMastered: string[]
    topicsStruggling: string[]
    lastActive: string
  }>(
    LOCAL_STORAGE_KEYS.PROGRESS,
    {
      totalAttempts: 0,
      correctAttempts: 0,
      topicsMastered: [],
      topicsStruggling: [],
      lastActive: new Date().toISOString(),
    }
  )
}

export function useSettings() {
  return useLocalStorage<{
    soundEnabled: boolean
    animationsEnabled: boolean
    readAloudEnabled: boolean
  }>(
    LOCAL_STORAGE_KEYS.SETTINGS,
    {
      soundEnabled: true,
      animationsEnabled: true,
      readAloudEnabled: false,
    }
  )
}
