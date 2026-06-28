'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from '../operation-deadlight.module.css'

interface ActCinematicIntroProps {
  act: string
  title: string
  index: string
  transmission: string
  danger?: boolean
}

export function ActCinematicIntro({ act, title, index, transmission, danger = false }: ActCinematicIntroProps) {
  const introRef = useRef<HTMLElement>(null)
  const irisRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef<HTMLParagraphElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const transmissionRef = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ scrollTrigger: { trigger: introRef.current, start: 'top 78%', toggleActions: 'play none none reverse' } })
      timeline.fromTo(irisRef.current, { scale: 1.5, opacity: 1 }, { scale: 0, opacity: 0, duration: 1.05, ease: 'power4.inOut' })
        .fromTo(indexRef.current, { letterSpacing: '1.2em', opacity: 0 }, { letterSpacing: '.32em', opacity: 1, duration: .45, ease: 'power2.out' }, '-=.55')
        .fromTo(titleRef.current, { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .85, ease: 'power4.out' }, '-=.2')
        .fromTo(transmissionRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .45 }, '-=.3')
    }, introRef)
    return () => context.revert()
  }, [])

  return <section ref={introRef} className={`${styles.cinematicIntro} ${danger ? styles.cinematicDanger : ''}`}>
    <div className={styles.cinematicGrid} />
    <div ref={irisRef} className={styles.cinematicIris} />
    <div className={styles.cinematicContent}>
      <p ref={indexRef} className={styles.cinematicIndex}>{index}{' // '}{act}</p>
      <div className={styles.cinematicTitleWrap}><h2 ref={titleRef} className={styles.cinematicTitle}>{title}</h2></div>
      <p ref={transmissionRef} className={styles.cinematicTransmission}>{transmission}</p>
    </div>
    <span className={styles.cinematicContinue}>scroll to breach <i>↓</i></span>
  </section>
}

