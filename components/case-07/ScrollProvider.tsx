'use client'

import { useSmoothScroll } from '@/app/hunt/case-07/hooks/useSmoothScroll'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function ScrollProvider({ children }: Props) {
  useSmoothScroll()
  return <>{children}</>
}
