'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ActCinematicIntro } from '../components/ActCinematicIntro'
import { DialogueBox } from '../components/DialogueBox'
import { AlertElimination } from '../components/AlertElimination'
import styles from '../operation-deadlight.module.css'

interface Act4Props {
  onPuzzleSolved: () => void
}

export function Act4Silence({ onPuzzleSolved }: Act4Props) {
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
        index="04"
        act="THE SILENCE"
        title="STAGE 3"
        transmission="ALL CONTAINMENT SYSTEMS FAILED // MULTIPLE BREACH EVENTS // MANUAL OVERRIDE REQUIRED"
        danger
      />

      <section ref={sectionRef} className={`${styles.act} ${styles.silenceAct}`}>
        <div className={styles.static} />
        <div className={styles.actContent}>
          <p className={styles.chapter}>Stage 3 · The Silence</p>
          <h2>Containment has <em>failed.</em></h2>

          <DialogueBox
            speaker="CONTAINMENT PROTOCOLS — SECTOR 4"
            side="left"
            style="classified"
            text="The final days of Operation Kennedy remain largely unknown. Most records were intentionally destroyed. Recovered radio transmissions reveal increasing confusion among containment teams. Personnel reported individuals appearing in locations they had never entered. Security footage showed conflicting events occurring at the same time."
          />

          <div className={styles.narrativeEtch} style={{ marginTop: '2rem', marginBottom: '2rem', lineHeight: '1.7' }}>
            <p>Entire sections of the settlement became completely inaccessible despite appearing physically unchanged. The final message received from Site Kennedy was heavily corrupted. After reconstruction, only a single sentence remained: <em>&quot;It isn&apos;t spreading. It&apos;s replacing.&quot;</em></p>
            <p style={{ marginTop: '1rem' }}>Moments later, all communication ceased. No further contact was ever established, and the site was permanently abandoned. An active warning cascade is now threatening to wipe the remaining mainframe buffers. You must clear the alerts to halt the deletion sequence.</p>
          </div>

          <AlertElimination onSolved={onPuzzleSolved} />
        </div>
      </section>
    </>
  )
}

