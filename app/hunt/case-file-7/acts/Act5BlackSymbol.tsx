'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ActCinematicIntro } from '../components/ActCinematicIntro'
import { DialogueBox } from '../components/DialogueBox'
import { SymbolReconstruction } from '../components/SymbolReconstruction'
import { PuzzleInput } from '@/components/deadlight/shared/PuzzleInput'
import styles from '../operation-deadlight.module.css'

interface Act5Props {
  onPuzzleSolved: () => void
}

export function Act5BlackSymbol({ onPuzzleSolved }: Act5Props) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        opacity: 0, duration: 0.6,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <>
      <ActCinematicIntro
        index="05"
        act="ANOMALY 1"
        title="THE BLACK SYMBOL"
        transmission="RECURRING SYMBOL DETECTED // 14 DOCUMENTS // NO TWO INSTANCES IDENTICAL"
      />

      <section ref={sectionRef} className={`${styles.act} ${styles.symbolAct}`}>
        <div className={styles.static} />
        <div className={styles.actContent}>
          <p className={styles.chapter}>Anomaly 1 · The Black Symbol</p>
          <h2>Something keeps <em>removing</em> them.</h2>

          <DialogueBox
            speaker="CHIEF LOGS — PROJECT NULL RECORDS"
            side="left"
            style="classified"
            text="Following the loss of communication, Site Kennedy was permanently abandoned. Official records describing the settlement were removed from public archives. The surviving evidence provides no definitive explanation. However, investigators identified several anomalies matching patterns observed in other cases. The first is a recurring black symbol."
          />

          <div className={styles.narrativeEtch} style={{ marginTop: '2rem', marginBottom: '2rem', lineHeight: '1.7' }}>
            <p>The symbol was discovered drawn in charcoal and etched into walls across 14 separate recovered documents. No two instances are identical, yet analysts confirm they all represent the same structural pattern. Dolen was investigating these fragments, but they kept disappearing from his desk. It was as if someone—or something—with access to the secure facility was scrubbing the evidence in real time.</p>
            <p style={{ marginTop: '1rem' }}>To reconstruct the symbol, you must secure 4 fragment partitions: solve the Matrix Parity registers, decode the Morse timeline signals, unlock the Combinational Logic Gate circuit, and decrypt the Vigenère communication logs. The answers lie in the archives.</p>
          </div>

          <SymbolReconstruction onSolved={() => { }} />

          <div style={{ marginTop: '2rem' }}>
            <DialogueBox
              speaker="SYSTEM"
              side="center"
              style="system"
              text='SYMBOL DECODED. "It isn&apos;t spreading. It&apos;s _______." Enter the decoded word to proceed.'
            />
            <PuzzleInput
              puzzleId="black-symbol"
              timelineId="operation-deadlight"
              onCorrect={onPuzzleSolved}
              placeholder="Enter decoded word..."
              theme="terminal"
            />
          </div>
        </div>
      </section>
    </>
  )
}

