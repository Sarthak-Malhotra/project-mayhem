/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useCallback, useEffect, useState } from 'react'

type ActId = 'act-2' | 'act-3' | 'act-4' | 'act-5' | 'act-6' | 'act-7' | 'act-8'
const STORAGE_KEY = 'aetherion-operation-deadlight-acts'

export function useActProgress() {
  const [complete, setComplete] = useState<ActId[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved) as unknown
        if (
          Array.isArray(data) &&
          data.every((item) =>
            item === 'act-2' || item === 'act-3' || item === 'act-4' ||
            item === 'act-5' || item === 'act-6' || item === 'act-7' || item === 'act-8'
          )
        ) {
          setTimeout(() => setComplete(data as ActId[]), 0)
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY)
      }
    }
    setTimeout(() => setHydrated(true), 0)
  }, [])

  const markComplete = useCallback((act: ActId) => {
    setComplete((current) => {
      if (current.includes(act)) return current
      const next = [...current, act]
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const resetProgress = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY)
    setComplete([])
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).resetProgress = resetProgress
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).resetProgress
      }
    }
  }, [resetProgress])

  return {
    isComplete: (act: ActId) => complete.includes(act),
    markComplete,
    resetProgress,
    hydrated,
  }
}

