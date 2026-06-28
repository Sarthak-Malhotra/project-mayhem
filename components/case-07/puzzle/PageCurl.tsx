'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { sounds } from '@/app/hunt/case-07/utils/SoundEffects'

interface Props {
  solved: boolean
  onCurlComplete?: () => void
  flipPage?: boolean
  pageBackground?: string
}

export function PageCurl({ solved, onCurlComplete, flipPage = true, pageBackground = '#1f1d1a' }: Props) {
  const curlRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!solved || !curlRef.current) return

    // Play sound on flip activation
    sounds.playPageFlip()

    const targetCard = curlRef.current.closest('.page-spread')

    const tl = gsap.timeline({
      onComplete: () => {
        if (onCurlComplete) onCurlComplete()
      }
    })

    // Curl the corner
    tl.to(curlRef.current, {
      width: 120,
      height: 120,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.inOut',
    })

    if (flipPage && targetCard) {
      tl.to(targetCard, {
        rotateY: -180,
        transformOrigin: 'left center',
        duration: 0.9,
        ease: 'power3.inOut',
      }, '-=0.1')
        .to(targetCard, {
          opacity: 0,
          scale: 0.9,
          duration: 0.3,
          pointerEvents: 'none',
        }, '-=0.3')
    }
  }, [solved, onCurlComplete, flipPage])

  return (
    <div
      ref={curlRef}
      className="absolute bottom-0 right-0 w-0 h-0 opacity-0 pointer-events-none z-50 transition-shadow duration-300"
      style={{
        background: `linear-gradient(225deg, ${pageBackground} 45%, rgba(0,0,0,0.4) 50%, #3a3530 55%, #121110 80%)`,
        boxShadow: '-4px -4px 15px rgba(0, 0, 0, 0.5)',
        borderBottomLeftRadius: '100%',
      }}
    />
  )
}
