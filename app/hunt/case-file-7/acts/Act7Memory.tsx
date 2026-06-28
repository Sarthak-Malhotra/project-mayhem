'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ActCinematicIntro } from '../components/ActCinematicIntro'
import { DialogueBox } from '../components/DialogueBox'
import { CorruptedTerminal } from '../components/CorruptedTerminal'
import { PuzzleInput } from '@/components/deadlight/shared/PuzzleInput'
import styles from '../operation-deadlight.module.css'

interface Act7Props {
  onPuzzleSolved: () => void
}

export function Act7Memory({ onPuzzleSolved }: Act7Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const [terminalSolved, setTerminalSolved] = useState(false)

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
        index="07"
        act="ANOMALY 3"
        title="MEMORY CORRUPTION"
        transmission="TIMELINE SCRAMBLED // SEQUENCE WRONG // TRUTH MUST BE RECONSTRUCTED"
      />

      <section ref={sectionRef} className={`${styles.act} ${styles.memoryAct}`}>
        <div className={styles.static} />
        <div className={styles.actContent}>
          <p className={styles.chapter}>Anomaly 3 · Memory Corruption</p>
          <h2>The sequence is <em>wrong.</em></h2>

          <DialogueBox
            speaker="MAINFRAME COGNITIVE LOG #704"
            side="right"
            style="classified"
            text="CRITICAL INSTABILITY ALERT: Temporal drift detected. System address lines are overlapping. Crew retro-cognitive memories are overwriting active registers. Sequence coherence is lost."
          />

          <DialogueBox
            speaker="ANALYST DOLEN — JOURNAL"
            side="left"
            style="analyst"
            text="I've started writing everything down. The others are forgetting. Not forgetting — I know what forgetting looks like. This is different. The sequence of events is wrong for them. Tuesday after Thursday. The briefing before the arrival."
          />

          <div className={styles.narrativeEtch} style={{ marginTop: '2rem', marginBottom: '2rem', lineHeight: '1.7' }}>
            <p>Analyst Dolen was the first to notice the drift. He documented the cognitive lapses in his journals: whole days appearing in wrong sequences, staff forgetting names they had worked with for years, and clocks running at offset cycles. The mainframe itself began experiencing similar temporal decay—its storage sectors degrading into biological clusters, overwriting operational system files with corrupted logs.</p>
            <p style={{ marginTop: '1rem' }}>Before his disappearance, Dolen attempted to map the memory sectors back into stable partitions. He left a series of recovery files in the terminal, but the system bios must be loaded first to unlock the sector allocation tools.</p>
            <p style={{ marginTop: '1rem' }}>Initiate the recovery terminal. Load the boot loader system file (`boot_loader.sys`), resolve block dependencies in sequential order (from corrupted_001 to corrupted_008), and monitor the real-time Memory Core Defragmenter grid on the right to guide the sector reconstruction.</p>
          </div>

          <CorruptedTerminal onSolved={() => setTerminalSolved(true)} />

          {terminalSolved && (
            <div style={{ marginTop: '2rem' }}>
              <DialogueBox
                speaker="SYSTEM"
                side="center"
                style="system"
                text="Terminal logs reconstructed. Extract the first letter of each repaired file word in sequence to form the classification code."
              />
              <PuzzleInput
                puzzleId="memory-corruption"
                timelineId="operation-deadlight"
                onCorrect={onPuzzleSolved}
                placeholder="Enter classification code..."
                theme="terminal"
              />
            </div>
          )}
        </div>
      </section>
    </>
  )
}

