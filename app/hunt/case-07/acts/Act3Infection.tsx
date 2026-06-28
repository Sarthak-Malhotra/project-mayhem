'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ActCinematicIntro } from '../components/ActCinematicIntro'
import { DialogueBox } from '../components/DialogueBox'
import { ProfileMatch } from '../components/ProfileMatch'
import { PuzzleInput } from '@/components/case-07/shared/PuzzleInput'
import styles from '../operation-deadlight.module.css'

interface Act3Props {
  onPuzzleSolved: () => void
}

export function Act3Infection({ onPuzzleSolved }: Act3Props) {
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
        index="03"
        act="THE INFECTION"
        title="STAGE 2"
        transmission="BEHAVIORAL PROFILING SYSTEM // PARASITIC ORGANISM DETECTED // IDENTITY UNCERTAIN"
      />

      <section ref={sectionRef} className={`${styles.act} ${styles.infectionAct}`}>
        <div className={styles.static} />
        <div className={styles.actContent}>
          <p className={styles.chapter}>Stage 2 · The Infection</p>
          <h2>Who is <em>infected?</em></h2>

          <DialogueBox
            speaker="MEDICAL DIVISION — CASE FILE RECORD"
            side="left"
            style="classified"
            text="The task force initially deployed to investigate reports of unexplained disappearances within remote settlement Site Kennedy. Those who returned from the quarantine zone displayed significant behavioral shifts. They looked the same, sounded the same, but family members claimed they were entirely different people. Medical examinations failed to identify any known pathogens."
          />

          <div className={styles.narrativeEtch} style={{ marginTop: '2rem', marginBottom: '2rem', lineHeight: '1.7' }}>
            <p>As the investigation progressed, task force personnel discovered evidence suggesting the presence of an unidentified parasitic organism. The organism appeared capable of spreading undetected through the settlement, leaving no physical trace on its hosts.</p>
            <p style={{ marginTop: '1rem' }}>Instead of physical symptoms, the infection manifested through subtle behavioral changes: memory inconsistencies, personality shifts, and periods of missing time. Recovered transmissions indicate growing panic among researchers as they realized multiple hosts could be influenced simultaneously.</p>
            <p style={{ marginTop: '1rem' }}>The final complete medical report ends with a chilling warning: <strong>&quot;We can no longer determine who is infected.&quot;</strong> To secure the facility, you must calibrate the diagnostic subsystems of the quarantine terminal and bypass the locking mechanism.</p>
          </div>

          <ProfileMatch onSolved={() => { }} />

          <div style={{ marginTop: '2rem' }}>
            <DialogueBox
              speaker="SYSTEM"
              side="center"
              style="system"
              text="Diagnostic nodes restored. Reconstruct the decrypted letters in node sequence (1 to 4) to decrypt the access key."
            />
            <PuzzleInput
              puzzleId="behavioral-match"
              timelineId="operation-deadlight"
              onCorrect={onPuzzleSolved}
              placeholder="Enter decrypted access key..."
              theme="terminal"
            />
          </div>
        </div>
      </section>
    </>
  )
}


