'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ActCinematicIntro } from '../components/ActCinematicIntro'
import { DialogueBox } from '../components/DialogueBox'
import { PersonnelDossier } from '../components/PersonnelDossier'
import { PuzzleInput } from '@/components/deadlight/shared/PuzzleInput'
import styles from '../operation-deadlight.module.css'

interface Act6Props {
  onPuzzleSolved: () => void
}

export function Act6Identity({ onPuzzleSolved }: Act6Props) {
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
        index="06"
        act="ANOMALY 2"
        title="IDENTITY DISTORTION"
        transmission="PERSONNEL FILES MODIFIED // ONE FILE PLANTED // IDENTITY FABRICATED"
      />

      <section ref={sectionRef} className={`${styles.act} ${styles.identityAct}`}>
        <div className={styles.static} />
        <div className={styles.actContent}>
          <p className={styles.chapter}>Anomaly 2 · Identity Distortion</p>
          <h2>None of us remember <em>arriving.</em></h2>

          <DialogueBox
            speaker="PROJECT NULL AUDIT REPORT"
            side="left"
            style="classified"
            text="During the investigation of Site Kennedy, task force forensic analysts detected a critical anomaly: an Identity Distortion Event. While the records of the 12 assigned specialists appeared regular, deep-scan routines revealed that one dossier was planted long after the site went dark. Furthermore, we recovered a handwritten note from the ashes of the terminal room. It contained a single, chilling sentence: 'None of us remember arriving here.'"
          />

          <div className={styles.narrativeEtch} style={{ marginTop: '2rem', marginBottom: '2rem', lineHeight: '1.7' }}>
            <p>The system records of Bravo team were sealed during the containment lockdown. However, someone modified the directory indexes from *inside* the quarantined zone, trying to retroactively plant an operator file. The fabricator was meticulous, duplicating clearances and division logs, but they made a critical error in dates and locations.</p>
            <p style={{ marginTop: '1rem' }}>Expand and cross-reference the 12 personnel files. Compare clearances, assignment dates, and patrols to locate the plant. Once identified, you will need to sort their scrambled timeline logs to restore database integrity and reveal the decryption instructions.</p>
          </div>

          <PersonnelDossier onSolved={() => { }} />

          <div style={{ marginTop: '2rem' }}>
            <DialogueBox
              speaker="SYSTEM"
              side="center"
              style="system"
              text="Something created an identity to exist among us. Enter its method of infiltration to proceed."
            />
            <PuzzleInput
              puzzleId="identity-distortion"
              timelineId="operation-deadlight"
              onCorrect={onPuzzleSolved}
              placeholder="Enter method of infiltration..."
              theme="terminal"
            />
          </div>
        </div>
      </section>
    </>
  )
}

