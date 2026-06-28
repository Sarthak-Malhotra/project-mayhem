'use client'

import { useEffect, useState, useRef } from 'react'
import styles from '../operation-deadlight.module.css'

interface DialogueBoxProps {
  speaker: string
  side: 'left' | 'right' | 'center'
  style: 'command' | 'analyst' | 'distress' | 'classified' | 'organism' | 'system'
  text: string
  signalStrength?: number
}

export function DialogueBox({ speaker, side, style, text, signalStrength = 100 }: DialogueBoxProps) {
  const [visibleText, setVisibleText] = useState('')
  const [showStatic, setShowStatic] = useState(false)
  const isCancelledRef = useRef(false)

  useEffect(() => {
    isCancelledRef.current = false
    setTimeout(() => setVisibleText(''), 0)
    setTimeout(() => setShowStatic(true), 0)

    const chars = 'XYZ#@$&*[]{}0123456789'
    let currentStr = ''
    let idx = 0

    async function typeNext() {
      if (isCancelledRef.current || idx >= text.length) return

      const char = text[idx]

      // Scramble effect: show random characters for 3 frames before locking
      for (let frame = 0; frame < 3; frame++) {
        if (isCancelledRef.current) return
        const randChar = chars[Math.floor(Math.random() * chars.length)]
        setVisibleText(currentStr + randChar)
        await new Promise(r => setTimeout(r, 20))
      }

      currentStr += char
      if (isCancelledRef.current) return
      setVisibleText(currentStr)
      idx++

      // Punctuation pause
      let delay = 12
      if (['.', '!', '?', '…'].includes(char)) {
        delay = 200
      }

      setTimeout(typeNext, delay)
    }

    // Between-message static for 0.4s
    const staticTimer = setTimeout(() => {
      if (isCancelledRef.current) return
      setShowStatic(false)
      typeNext()
    }, 400)

    return () => {
      isCancelledRef.current = true
      clearTimeout(staticTimer)
    }
  }, [text])

  const sideClass = side === 'right' ? styles.dialogueRight : side === 'center' ? styles.dialogueCenter : styles.dialogueLeft
  
  const themeClass = 
    style === 'command' ? styles.dialogueCommand :
    style === 'analyst' ? styles.dialogueAnalyst :
    style === 'distress' ? styles.dialogueDistress :
    style === 'classified' ? styles.dialogueClassified :
    style === 'organism' ? styles.dialogueOrganism :
    styles.dialogueSystem

  return (
    <div className={`${styles.dialogueContainer} ${sideClass}`}>
      {showStatic && <div className={styles.dialogueStaticNoise} />}
      
      <blockquote className={`${styles.dialogue} ${themeClass}`}>
        <header>
          <span>{speaker}</span>
          
          {/* Command signal bars */}
          {style === 'command' && (
            <span className={styles.signal}>
              SIG {signalStrength}% 
              <i style={{ width: `${signalStrength}%` }} />
            </span>
          )}

          {/* Classified seal */}
          {style === 'classified' && (
            <span className={styles.classifiedSeal}>◆ NEXUS ◆</span>
          )}

          {/* Organism corruption indicator */}
          {style === 'organism' && (
            <span className={styles.corruptionIndicator}>
              ◈ ANOMALY ◈
            </span>
          )}
        </header>

        <p style={{ fontStyle: style === 'distress' ? 'italic' : 'normal' }}>
          {showStatic ? 'CONNECTING...' : visibleText}
          {!showStatic && <span className={styles.caret}>▋</span>}
        </p>

        {/* Distress signal wave */}
        {style === 'distress' && (
          <div className={styles.distressWaveContainer}>
            <div className={styles.distressWave} />
          </div>
        )}
      </blockquote>
    </div>
  )
}

