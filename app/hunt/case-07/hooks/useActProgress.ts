/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useCallback, useEffect, useState } from 'react'

type ActId = 'act-2' | 'act-3' | 'act-4' | 'act-5' | 'act-6' | 'act-7' | 'act-8'
const STORAGE_KEY = 'aetherion-operation-deadlight-acts'

export function useActProgress() {
  const [complete, setComplete] = useState<ActId[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    async function loadProgress() {
      try {
        const res = await fetch("/api/progress?caseId=07")
        const data = await res.json()
        if (data.success && data.progress?.case7State) {
          const list = data.progress.case7State
          if (
            Array.isArray(list) &&
            list.every((item) =>
              item === 'act-2' || item === 'act-3' || item === 'act-4' ||
              item === 'act-5' || item === 'act-6' || item === 'act-7' || item === 'act-8'
            )
          ) {
            setComplete(list as ActId[])
          }
        }
      } catch (err) {
        console.error("Failed to load Case 7 progress from DB:", err)
      } finally {
        setHydrated(true)
      }
    }
    loadProgress()
  }, [])

  const markComplete = useCallback((act: ActId) => {
    setComplete((current) => {
      if (current.includes(act)) return current
      const next = [...current, act]
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: "07",
          key: "case7State",
          value: next,
        }),
      }).catch((err) => console.error("Failed to save Case 7 progress to DB:", err))
      return next
    })
  }, [])

  const resetProgress = useCallback(() => {
    setComplete([])
    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        caseId: "07",
        key: "case7State",
        value: [],
      }),
    }).catch((err) => console.error("Failed to reset Case 7 progress in DB:", err))
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

