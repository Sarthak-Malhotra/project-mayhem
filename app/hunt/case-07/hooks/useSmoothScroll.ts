/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function useSmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    if (typeof window !== 'undefined') {
      (window as any).lenis = lenis
    }

    const update = () => ScrollTrigger.update()
    const tick = (time: number) => lenis.raf(time * 1000)

    lenis.on('scroll', update)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // Prevent native focus scroll jumps which conflict with Lenis and ScrollTrigger pins
    let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0
    let lastScrollX = typeof window !== 'undefined' ? window.scrollX : 0

    const updateLastScroll = () => {
      lastScrollY = window.scrollY
      lastScrollX = window.scrollX
    }

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA'
      )) {
        // 1. Restore synchronously to minimize visual flicker
        window.scrollTo(lastScrollX, lastScrollY)
        lenis.scrollTo(lastScrollY, { immediate: true })

        if (document.documentElement) document.documentElement.scrollLeft = 0
        if (document.body) document.body.scrollLeft = 0
        
        let parent = target.parentElement
        while (parent) {
          if (parent.scrollLeft !== 0) {
            parent.scrollLeft = 0
          }
          parent = parent.parentElement
        }

        // 2. Queue in next tick to override any browser-native layout shifts that happen after event dispatch
        setTimeout(() => {
          window.scrollTo(lastScrollX, lastScrollY)
          lenis.scrollTo(lastScrollY, { immediate: true })

          if (document.documentElement) document.documentElement.scrollLeft = 0
          if (document.body) document.body.scrollLeft = 0
          
          let p = target.parentElement
          while (p) {
            if (p.scrollLeft !== 0) {
              p.scrollLeft = 0
            }
            p = p.parentElement
          }
        }, 0)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('pointerdown', updateLastScroll, { passive: true })
      window.addEventListener('keydown', updateLastScroll, { passive: true })
      window.addEventListener('focusin', handleFocusIn, { passive: true })
    }

    return () => {
      lenis.off('scroll', update)
      gsap.ticker.remove(tick)
      lenis.destroy()
      if (typeof window !== 'undefined') {
        delete (window as any).lenis
        window.removeEventListener('pointerdown', updateLastScroll)
        window.removeEventListener('keydown', updateLastScroll)
        window.removeEventListener('focusin', handleFocusIn)
      }
    }
  }, [])
}
