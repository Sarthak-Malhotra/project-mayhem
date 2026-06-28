'use client'

import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import styles from '../operation-deadlight.module.css'

interface Particle {
  id: number
  dx: number
  dy: number
  size: number
}

const SCAN_TIMELINES = [
  { id: 'heart-of-osiris', code: 'CF-01-HO', title: 'The Heart of Osiris', era: 'PAST', setting: 'EGYPT · 1323 BC' },
  { id: 'age-of-embers', code: 'CF-02-AE', title: 'Age of Embers', era: 'PAST', setting: 'LOST ERA' },
  { id: 'echoes-of-the-artifact', code: 'CF-03-EA', title: 'Echoes of the Artifact', era: 'PAST', setting: 'WESTEROS' },
  { id: 'midnight-carnival', code: 'CF-04-MC', title: 'Midnight Carnival', era: 'PRESENT', setting: 'CARNIVAL · 1888' },
  { id: 'project-heisenberg', code: 'CF-05-PH', title: 'Project Heisenberg', era: 'PRESENT', setting: 'ALBUQUERQUE' },
  { id: 'protocol-zero', code: 'CF-06-PZ', title: 'Protocol Zero', era: 'PRESENT', setting: 'NEAR FUTURE' },
  { id: 'operation-deadlight', code: 'CF-07-OD', title: 'Operation Deadlight', era: 'FUTURE', setting: 'SITE KENNEDY · 1996' },
  { id: 'the-card-cabinets', code: 'CF-08-CC', title: 'The Card Cabinets', era: 'FUTURE', setting: 'SHIBUYA' },
  { id: 'final-stage', code: 'CF-09-FS', title: 'Final Stage', era: 'FUTURE', setting: 'CONVERGENCE' },
]

type EndingState = 'idle' | 'burst' | 'seven-others' | 'verification' | 'blackout' | 'done'

export function FragmentCollect() {
  const [collected, setCollected] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [endingState, setEndingState] = useState<EndingState>('idle')
  
  const [agentName, setAgentName] = useState('Demo Agent')
  const [agentEmail, setAgentEmail] = useState('agent@aetherion.org')
  const [scanActiveIndex, setScanActiveIndex] = useState(-1)
  const [verificationLines, setVerificationLines] = useState<string[]>([])
  const [blackoutLines, setBlackoutLines] = useState<string[]>([])

  const burstRef = useRef<HTMLDivElement>(null)
  const auraRef = useRef<HTMLDivElement>(null)
  const fragmentRef = useRef<HTMLDivElement>(null)

  // Load user credentials from API on mount
  useEffect(() => {
    async function loadProgress() {
      try {
        const response = await fetch('/hunt/case-07/api/progress')
        if (response.ok) {
          const data = await response.json()
          if (data.name) setAgentName(data.name)
          if (data.email) setAgentEmail(data.email)
        }
      } catch (err) {
        console.error('Failed to load progress for ending:', err)
      }
    }
    loadProgress()
  }, [])

  // Floating shard aura effects
  useEffect(() => {
    if (endingState !== 'idle') return
    if (!auraRef.current || !fragmentRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(auraRef.current, {
        scale: 1.15, opacity: 0.8, duration: 2,
        yoyo: true, repeat: -1, ease: 'sine.inOut'
      })
      gsap.to(fragmentRef.current, {
        y: -8, duration: 3,
        yoyo: true, repeat: -1, ease: 'sine.inOut'
      })
    })
    return () => ctx.revert()
  }, [endingState])

  const runTimelineScan = () => {
    let index = 0
    const interval = setInterval(() => {
      setScanActiveIndex(index)
      index++
      if (index >= SCAN_TIMELINES.length) {
        clearInterval(interval)
        setTimeout(() => {
          setEndingState('verification')
          runVerificationSequence()
        }, 1500)
      }
    }, 400)
  }

  const runVerificationSequence = async () => {
    const lines = [
      '> FINAL VERIFICATION RUNNING...',
      `> CROSS-REFERENCING AGENT CREDENTIALS WITH PROJECT NULL DATABASE...`,
      `> AGENT IDENTIFIER: [ ${agentName.toUpperCase()} ]`,
      `> REGISTRATION ADDRESS: [ ${agentEmail.toLowerCase()} ]`,
      '> CROSS-REFERENCE COMPLETE. MATCH DETECTED.',
      `> ⚠ ERROR: RESIDENT LOG MATCH FOUND IN SITE KENNEDY ARCHIVES — 1996.`,
      '> BEHAVIORAL MARKERS: IDENTIFIED.',
      '> MEMORY ADDRESS SHIFTS: TIMELINE CORRUPTED.',
      '> WARNING: YOU HAVE BEEN HERE BEFORE.',
      '> YOU DO NOT REMEMBER ARRIVING.',
      '> SECURING SESSION OVERLAY...',
    ]
    for (let i = 0; i < lines.length; i++) {
      await new Promise(r => setTimeout(r, 600))
      setVerificationLines(prev => [...prev, lines[i]])
    }
    setTimeout(() => {
      setEndingState('blackout')
      runBlackoutSequence()
    }, 1800)
  }

  const runBlackoutSequence = async () => {
    const lines = [
      '"None of us remember arriving here."',
      '',
      'CASE FILE 07 — OPERATION DEADLIGHT — CLOSED.',
      '',
      'ANOMALY DETECTED IN AGENT SESSION LEDGER.',
      'A SECONDARY DEEP REVIEW HAS BEEN INITIATED.',
      '',
      'CASE FILE 08 — CLASSIFIED.',
      'ACCESSING MAIN NODE...',
      '',
      '[ ACCESS DENIED ]',
      '',
      '"We know you looked."',
    ]
    for (let i = 0; i < lines.length; i++) {
      const delay = lines[i].includes('DENIED') ? 1200 : lines[i] === '' ? 200 : 800
      await new Promise(r => setTimeout(r, delay))
      setBlackoutLines(prev => [...prev, lines[i]])
    }
    setTimeout(() => {
      setEndingState('done')
    }, 2000)
  }

  async function collect() {
    try {
      const response = await fetch('/hunt/case-07/api/fragment/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timelineId: 'operation-deadlight' }),
      })
      if (!response.ok) return
      triggerParticleBurst()
      setCollected(true)
      setEndingState('burst')

      setTimeout(() => {
        setEndingState('seven-others')
        runTimelineScan()
      }, 2500)
    } catch (error) {
      console.error('Fragment collection failed:', error)
    }
  }

  const triggerParticleBurst = () => {
    const temp: Particle[] = Array.from({ length: 40 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2
      const radius = 60 + Math.random() * 150
      return {
        id: i,
        dx: Math.cos(angle) * radius,
        dy: Math.sin(angle) * radius,
        size: 3 + Math.random() * 6,
      }
    })
    setParticles(temp)

    requestAnimationFrame(() => {
      const container = burstRef.current
      if (!container) return
      const particleNodes = container.querySelectorAll(`.${styles.goldParticle}`)
      particleNodes.forEach((node) => {
        const dx = node.getAttribute('data-dx')
        const dy = node.getAttribute('data-dy')
        gsap.to(node, {
          x: dx ? parseFloat(dx) : 0,
          y: dy ? parseFloat(dy) : 0,
          opacity: 0, scale: 0.1,
          duration: 1.0 + Math.random() * 0.4,
          ease: 'power3.out',
        })
      })
    })
  }

  return (
    <div className={`${styles.collection} ${collected ? styles.collectionDone : ''}`} style={{ position: 'relative', minHeight: '400px' }}>
      
      {/* Step 4 & 5: Blackout Ending Overlay */}
      {(endingState === 'blackout' || endingState === 'done') && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#000',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontFamily: 'monospace',
          padding: '2rem',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'center' }}>
            {blackoutLines.map((line, idx) => {
              const isQuote = line.startsWith('"')
              const isDenied = line.includes('DENIED')
              return (
                <div
                  key={idx}
                  style={{
                    fontSize: isQuote ? '1.2rem' : '0.8rem',
                    color: isDenied ? '#ff3333' : isQuote ? '#fff' : '#888',
                    fontStyle: isQuote ? 'italic' : 'normal',
                    fontWeight: isDenied ? 'bold' : 'normal',
                    letterSpacing: isDenied ? '0.2em' : 'normal',
                    minHeight: line === '' ? '1.5rem' : 'auto',
                  }}
                >
                  {line}
                </div>
              )
            })}
            
            {endingState === 'done' && (
              <a
                href="/dashboard"
                style={{
                  marginTop: '2rem',
                  display: 'inline-block',
                  background: 'transparent',
                  border: '1px solid #444',
                  color: '#ffdd77',
                  padding: '0.6rem 1.5rem',
                  fontSize: '0.75rem',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: 'bold',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ffdd77'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#ffdd77'; }}
              >
                Return to Console Dashboard ➔
              </a>
            )}
          </div>
        </div>
      )}

      {/* Step 2: High-speed timeline scan terminal */}
      {endingState === 'seven-others' && (
        <div className={styles.crtTerminal} style={{ padding: '1.5rem', textAlign: 'left', minHeight: '380px', position: 'relative', overflow: 'hidden' }}>
          <div className={styles.crtScanlines} />
          <div style={{ color: '#4aff4a', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '1rem', borderBottom: '1px solid #1a4a1a', paddingBottom: '0.4rem', fontFamily: 'monospace' }}>
            AETHERION SYSTEM QUERY — TIMELINE CORRELATION SCAN
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontFamily: 'monospace' }}>
            {SCAN_TIMELINES.map((t, idx) => {
              const isPast = idx < scanActiveIndex
              const isActive = idx === scanActiveIndex
              return (
                <div key={t.id} style={{
                  fontSize: '0.72rem',
                  color: isActive ? '#fff' : isPast ? '#689d63' : '#2c402c',
                  fontWeight: isActive ? 'bold' : 'normal',
                  display: 'flex',
                  justifyContent: 'space-between',
                  background: isActive ? 'rgba(74,255,74,0.1)' : 'transparent',
                  padding: '2px 6px',
                  borderLeft: isActive ? '3px solid #4aff4a' : '3px solid transparent',
                  transition: 'color 0.2s',
                }}>
                  <span>{t.code} // {t.title.toUpperCase()}</span>
                  <span>[{t.era} // {t.setting}] {isActive ? '◀ SCANNING' : isPast ? '✓ LINKED' : '░ LOCKED'}</span>
                </div>
              )
            })}
          </div>
          {scanActiveIndex === SCAN_TIMELINES.length - 1 && (
            <div style={{ marginTop: '1.2rem', color: '#ff5555', fontSize: '0.75rem', fontWeight: 'bold', animation: 'blink 0.8s infinite steps(2)', fontFamily: 'monospace' }}>
              &gt; WARNING: MULTIPLE TIMELINE SYNAPSE DETECTED. THE HUNT IS NOT OVER.
            </div>
          )}
        </div>
      )}

      {/* Step 3: Security Verification details log */}
      {endingState === 'verification' && (
        <div className={styles.crtTerminal} style={{ padding: '1.5rem', textAlign: 'left', minHeight: '380px', position: 'relative', overflow: 'hidden' }}>
          <div className={styles.crtScanlines} />
          <div style={{ color: '#ff5555', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '1rem', borderBottom: '1px solid #cc1111', paddingBottom: '0.4rem', textTransform: 'uppercase', fontFamily: 'monospace' }}>
            SECURITY VERIFICATION ENGINE // IDENTITY CHECK
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.72rem', color: '#ffbbbb', fontFamily: 'monospace' }}>
            {verificationLines.map((line, idx) => (
              <div key={idx} style={{
                color: line.includes('⚠') || line.includes('ERROR') ? '#ff4444' : line.includes('MATCH') ? '#e8c060' : '#ffbbbb',
                fontWeight: line.includes('⚠') || line.includes('ERROR') ? 'bold' : 'normal',
              }}>
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Normal Visual Orb & Extraction HUD */}
      {(endingState === 'idle' || endingState === 'burst') && (
        <>
          <div ref={burstRef} className={styles.particleBurst}>
            {particles.map((p) => (
              <div
                key={p.id}
                className={styles.goldParticle}
                data-dx={p.dx}
                data-dy={p.dy}
                style={{
                  width: `${p.size}px`, height: `${p.size}px`,
                  left: '50%', top: '50%',
                  transform: 'translate(-50%, -50%)',
                  position: 'absolute',
                }}
              />
            ))}
          </div>

          <div className={styles.fragmentVisual} aria-hidden="true" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', height: '180px' }}>
            {/* Pulsating biological parasite aura (Crimson/Dark Red) */}
            <div
              ref={auraRef}
              style={{
                position: 'absolute', width: '160px', height: '160px',
                background: 'radial-gradient(circle, rgba(139,26,26,0.6) 0%, rgba(37,8,8,0.2) 60%, rgba(0,0,0,0) 80%)',
                borderRadius: '50%', filter: 'blur(8px)', zIndex: 1,
              }}
            />
            {/* Pulsating parasite tendrils (SVG drawn) */}
            <svg width="180" height="180" style={{ position: 'absolute', zIndex: 2, pointerEvents: 'none' }}>
              <g stroke="#8b1a1a" strokeWidth="2.5" fill="none" opacity="0.8">
                <path d="M 90 20 C 70 50, 40 70, 20 90 C 40 100, 70 80, 90 90 C 110 80, 140 100, 160 90 C 140 70, 110 50, 90 20 Z" />
                <path d="M 20 90 C 50 110, 70 140, 90 160 C 100 140, 80 110, 90 90 C 80 70, 50 50, 20 90 Z" />
                <path d="M 90 160 C 110 130, 140 110, 160 90 C 140 80, 110 100, 90 90 C 100 110, 130 130, 90 160 Z" />
              </g>
              <circle cx="90" cy="90" r="30" fill="rgba(139,26,26,0.3)" stroke="#ff4444" strokeWidth="1" strokeDasharray="3 3" />
            </svg>
            {/* Floating Golden Aetherion shard in center */}
            <div
              ref={fragmentRef}
              style={{
                zIndex: 3,
                position: 'relative',
                width: '45px',
                height: '65px',
                background: 'linear-gradient(135deg, #fff2a5 0%, #b8862a 50%, #5a3c0c 100%)',
                clipPath: 'polygon(50% 0%, 100% 35%, 80% 100%, 20% 100%, 0% 35%)',
                filter: 'drop-shadow(0 0 15px rgba(244,196,48,0.8))',
              }}
            />
          </div>

          <h3>{collected ? 'AETHERION FRAGMENT EXTRACTED' : 'Aetherion fragment located'}</h3>

          <p style={{ lineHeight: '1.6' }}>
            {collected
              ? 'BIO-LOGISTICAL OVERRIDE COMPLETE. The Aetherion fragment has been extracted from the Las Plagas parasite cell core. The host\'s temporal feedback loops have collapsed. Site Kennedy incident declassified under PROJECT NULL: Case File CF-07-OK-1996 is officially SEALED.'
              : 'The Aetherion fragment is suspended within the biological containment chamber, wrapped in calcified parasite tissue. Extract the fragment before the local timeline coordinates fracture.'}
          </p>

          {!collected && (
            <button onClick={collect} style={{ maxWidth: '280px', margin: '1.5rem auto 0' }}>
              Extract Fragment
            </button>
          )}
        </>
      )}

      {/* Embedded Animation keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}} />
    </div>
  )
}

