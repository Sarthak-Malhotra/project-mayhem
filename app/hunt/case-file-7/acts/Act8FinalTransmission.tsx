'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ActCinematicIntro } from '../components/ActCinematicIntro'
import { DialogueBox } from '../components/DialogueBox'
import { MessageReconstruction } from '../components/MessageReconstruction'
import { FragmentCollect } from '../components/FragmentCollect'
import { PuzzleInput } from '@/components/deadlight/shared/PuzzleInput'
import { useActProgress } from '../hooks/useActProgress'
import styles from '../operation-deadlight.module.css'

export function Act8FinalTransmission({ onPuzzleSolved }: { onPuzzleSolved: () => void }) {
  const sectionRef = useRef<HTMLElement>(null)
  const { isComplete } = useActProgress()
  const isAct8Complete = isComplete('act-8')
  const [reconstructionSolved, setReconstructionSolved] = useState(false)

  // Ensure reconstructionSolved is set to true on mount if act-8 is already complete
  useEffect(() => {
    if (isAct8Complete) {
      setReconstructionSolved(true)
    }
  }, [isAct8Complete])

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
        index="08"
        act="FINAL TRANSMISSION"
        title="THE LAST MESSAGE"
        transmission="CORRUPTED TRANSMISSION // 11 MONTHS TO RECONSTRUCT // THE MESSAGE WAS AN INSTRUCTION"
        danger
      />

      <section ref={sectionRef} className={`${styles.act} ${styles.finalAct}`}>
        <div className={styles.static} />
        <div className={styles.fractureShards}>
          <i /><i /><i />
        </div>

        <div className={styles.actContent} style={{ zIndex: 10 }}>
          <p className={styles.chapter}>Final Transmission</p>
          <h2>It was an <em>instruction.</em></h2>

          <DialogueBox
            speaker="PROJECT NULL — RECONSTRUCTED MEMO"
            side="left"
            style="classified"
            text="We successfully intercepted the final transmission from Site Kennedy. It was corrupted beyond standard recognition. It took task force engineers 11 months of deep-scan timeline calculations to partially reconstruct the stream. What we recovered changed everything. The message was not a distress call—it was a direct instruction."
          />

          <div className={styles.narrativeEtch} style={{ marginTop: '2rem', marginBottom: '2rem', lineHeight: '1.7' }}>
            <p>The final logs indicate that Leon S. Kennedy located the Aetherion fragment embedded in theLas Plagas parasite cluster. Rather than returning, he merged the fragment's temporal wave signature with the terminal archives to prevent external replication. The fragment was never lost; it chose its host, waiting for a recovery agent with the correct cross-act authorization vector.</p>
            <p style={{ marginTop: '1rem' }}>Reconstruct the final transmission logs below. Solve the character scrambling grid, verify the cross-act logic gaps, decode the final line of the transmission, and align the temporal waveforms to retrieve the Aetherion fragment.</p>
          </div>

          <MessageReconstruction onSolved={() => setReconstructionSolved(true)} />

          {reconstructionSolved && (
            <div style={{ marginTop: '2rem' }}>
              <DialogueBox
                speaker="SYSTEM"
                side="center"
                style="system"
                text="The fragment's name was hidden in the transmission all along. Enter the name of the artifact to complete the recovery."
              />
              <PuzzleInput
                puzzleId="final-transmission"
                timelineId="operation-deadlight"
                onCorrect={onPuzzleSolved}
                placeholder="Enter the artifact name..."
                theme="terminal"
              />
            </div>
          )}

          {isAct8Complete && (
            <FragmentCollect />
          )}
        </div>
      </section>
    </>
  )
}

