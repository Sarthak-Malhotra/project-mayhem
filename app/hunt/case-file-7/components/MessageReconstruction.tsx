'use client'

import { useState, useRef, useEffect } from 'react'
import styles from '../operation-deadlight.module.css'

const HIDDEN_WORD = 'AETHERION'

type SubPuzzle = 'word' | 'fill' | 'line' | 'alignment'

export function MessageReconstruction({ onSolved }: { onSolved: () => void }) {
  const [currentPuzzle, setCurrentPuzzle] = useState<SubPuzzle>('word')
  const [completedPuzzles, setCompletedPuzzles] = useState<Set<SubPuzzle>>(new Set())
  const [revealLines, setRevealLines] = useState<string[]>([])
  const [allDone, setAllDone] = useState(false)

  function completePuzzle(puzzle: SubPuzzle) {
    setCompletedPuzzles(prev => {
      const next = new Set(prev)
      next.add(puzzle)
      
      if (puzzle === 'word') setCurrentPuzzle('fill')
      else if (puzzle === 'fill') setCurrentPuzzle('line')
      else if (puzzle === 'line') setCurrentPuzzle('alignment')
      else if (puzzle === 'alignment') {
        setTimeout(async () => {
          const lines = [
            '> FULL MESSAGE RECONSTRUCTED:',
            '',
            '"The fragment was never lost. It chose its host.',
            ' The organism exists to carry what cannot be contained.',
            ' When you find it — and you will — understand this:',
            ' The fragment is not the end.',
            '',
            ' It is waiting.',
            '',
            ' —  K."',
            '',
            '> TRANSMISSION AUTHOR: LEON S. KENNEDY',
            '> SIGNATURE INITIAL: K',
            '> AETHERION ANCHOR HARMONICS STABILIZED.',
          ]
          for (let i = 0; i < lines.length; i++) {
            await new Promise(r => setTimeout(r, 300))
            setRevealLines(prev => [...prev, lines[i]])
          }
          setAllDone(true)
          setTimeout(onSolved, 3000)
        }, 500)
      }
      return next
    })
  }

  if (revealLines.length > 0) {
    return (
      <div className={styles.crtTerminal}>
        <div className={styles.crtScanlines} />
        <div className={styles.terminalOutput}>
          {revealLines.map((line, i) => (
            <p key={i} className={
              line.includes('AETHERION') ? styles.tracingHighlight :
              line.startsWith('"') || line.startsWith(' ') ? styles.reconstructedLine : ''
            }>
              {line || '\u00A0'}
            </p>
          ))}
          {allDone && (
            <p className={styles.finalComplete}>AETHERION EXTRACTION READY...</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.messageContainer}>
      {/* Visual corruption/de-shielding status blocks */}
      <div className={styles.corruptionBlock} style={{ marginBottom: '1.5rem' }}>
        {completedPuzzles.has('word') ? (
          <p className={styles.decryptedSection} style={{ color: '#4aff4a' }}>✓ TEMPORAL ROTORS REALIGNED</p>
        ) : (
          <p className={styles.corruptedSection} style={{ color: '#ff5555' }}>[UNSTABLE] CHRONO-ROTOR ROTATION OVERLAPPING</p>
        )}
        {completedPuzzles.has('fill') ? (
          <p className={styles.decryptedSection} style={{ color: '#4aff4a' }}>✓ NEURAL ROUTING BRIDGE SECURED</p>
        ) : (
          <p className={styles.corruptedSection} style={{ color: '#ff5555' }}>[LOCKED] MAIN ROUTING BUFFER SEVERED</p>
        )}
        {completedPuzzles.has('line') ? (
          <p className={styles.decryptedSection} style={{ color: '#4aff4a' }}>✓ CODON SPLICING GRID SYNCHRONIZED</p>
        ) : (
          <p className={styles.corruptedSection} style={{ color: '#ff5555' }}>[SHIELDED] CODON TRANSPOSITION SCRAMBLED</p>
        )}
        {completedPuzzles.has('alignment') ? (
          <p className={styles.decryptedSection} style={{ color: '#4aff4a' }}>✓ POWER GRID NETWORK BALANCED</p>
        ) : (
          <p className={styles.corruptedSection} style={{ color: '#ff5555' }}>[STANDBY] COHERENCE GRID STABILIZER UNBALANCED</p>
        )}
      </div>

      {/* Chrono-Gear coupled stabilizer lock */}
      {currentPuzzle === 'word' && !completedPuzzles.has('word') && (
        <ChronoGearsPuzzle onSolved={() => completePuzzle('word')} />
      )}

      {/* Logic Gate Schematic Emulation */}
      {currentPuzzle === 'fill' && !completedPuzzles.has('fill') && (
        <LogicGatesPuzzle onSolved={() => completePuzzle('fill')} />
      )}

      {/* 4x4 Grid Shifter Puzzle */}
      {currentPuzzle === 'line' && !completedPuzzles.has('line') && (
        <GridShifterPuzzle onSolved={() => completePuzzle('line')} />
      )}

      {/* Kirchhoff Power Grid Balancer */}
      {currentPuzzle === 'alignment' && !completedPuzzles.has('alignment') && (
        <KirchhoffBalancerPuzzle onSolved={() => completePuzzle('alignment')} />
      )}
    </div>
  )
}

/* ═══════════════ SUB-PUZZLE A: CHRONO-GEAR COUPLING LOCK ═══════════════ */
function ChronoGearsPuzzle({ onSolved }: { onSolved: () => void }) {
  const [outerAngle, setOuterAngle] = useState(180)
  const [middleAngle, setMiddleAngle] = useState(90)
  const [innerAngle, setInnerAngle] = useState(270)
  const [wrong, setWrong] = useState(false)
  const [success, setSuccess] = useState(false)

  // Coupled rotation handlers
  const rotateOuter = () => {
    setOuterAngle(prev => (prev + 45) % 360)
    setMiddleAngle(prev => (prev - 45 + 360) % 360)
  }

  const rotateMiddle = () => {
    setMiddleAngle(prev => (prev + 45) % 360)
    setInnerAngle(prev => (prev + 45) % 360)
    setOuterAngle(prev => (prev + 45) % 360)
  }

  const rotateInner = () => {
    setInnerAngle(prev => (prev + 45) % 360)
    setMiddleAngle(prev => (prev - 45 + 360) % 360)
  }

  const handleVerify = () => {
    if (outerAngle === 0 && middleAngle === 0 && innerAngle === 0) {
      setSuccess(true)
      setTimeout(onSolved, 1200)
    } else {
      setWrong(true)
      setTimeout(() => setWrong(false), 800)
    }
  }

  return (
    <div className={`${styles.miniPuzzlePanel} ${wrong ? styles.miniPuzzleWrong : ''}`}>
      <h4>SUB-PUZZLE A: TEMPORAL ROTOR LOCK</h4>
      <p className={styles.miniPuzzleDesc}>
        <strong>CHRONO-COUPLED TIMELINE LOGS:</strong> &quot;Leon locked the final communication stream behind a three-gear coupled temporal rotor. Each gear represents an era (Past, Present, Future). You must align all three markers at the 12 o&apos;clock calibration vector.&quot;
      </p>

      {/* SVG Ring Rotors Visualizer */}
      <div style={{ position: 'relative', width: '200px', height: '200px', margin: '1rem auto' }}>
        <svg viewBox="0 0 200 200" width="200" height="200" style={{ display: 'block', background: '#020202', border: '1px solid #2d2420', borderRadius: '50%' }}>
          {/* Target Alignment indicator line at 12 o'clock */}
          <line x1="100" y1="5" x2="100" y2="40" stroke="#4aff4a" strokeWidth="2.5" strokeDasharray="3 3" opacity={success ? 1 : 0.6} />
          
          {/* Outer Gear - PAST */}
          <g style={{ transform: `rotate(${outerAngle}deg)`, transformOrigin: '100px 100px', transition: 'transform 0.4s ease-out' }}>
            <circle cx="100" cy="100" r="80" stroke="#ff4444" strokeWidth="2.5" fill="none" opacity="0.6" />
            <circle cx="100" cy="20" r="6" fill="#ff4444" />
            <text x="100" y="32" fill="#ff4444" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">PAST</text>
          </g>

          {/* Middle Gear - PRESENT */}
          <g style={{ transform: `rotate(${middleAngle}deg)`, transformOrigin: '100px 100px', transition: 'transform 0.4s ease-out' }}>
            <circle cx="100" cy="100" r="55" stroke="#e8c060" strokeWidth="2.5" fill="none" opacity="0.6" />
            <circle cx="100" cy="45" r="6" fill="#e8c060" />
            <text x="100" y="57" fill="#e8c060" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">PRES</text>
          </g>

          {/* Inner Gear - FUTURE */}
          <g style={{ transform: `rotate(${innerAngle}deg)`, transformOrigin: '100px 100px', transition: 'transform 0.4s ease-out' }}>
            <circle cx="100" cy="100" r="30" stroke="#4488ff" strokeWidth="2.5" fill="none" opacity="0.6" />
            <circle cx="100" cy="70" r="6" fill="#4488ff" />
            <text x="100" y="82" fill="#4488ff" fontSize="6" fontFamily="monospace" textAnchor="middle" fontWeight="bold">FUT</text>
          </g>
        </svg>
        {success && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,30,0,0.85)', color: '#4aff4a', fontWeight: 'bold', fontSize: '0.75rem', borderRadius: '50%'
          }}>
            ROTORS SYNCHRONIZED ✓
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
        <button type="button" onClick={rotateOuter} disabled={success}
          style={{ background: '#180808', border: '1px solid #ff4444', color: '#ff4444', padding: '0.5rem', cursor: 'pointer', fontFamily: 'monospace', fontSize: '0.65rem', fontWeight: 'bold' }}>
          ROTATE PAST (+45°)
        </button>
        <button type="button" onClick={rotateMiddle} disabled={success}
          style={{ background: '#181208', border: '1px solid #e8c060', color: '#e8c060', padding: '0.5rem', cursor: 'pointer', fontFamily: 'monospace', fontSize: '0.65rem', fontWeight: 'bold' }}>
          ROTATE PRES (+45°)
        </button>
        <button type="button" onClick={rotateInner} disabled={success}
          style={{ background: '#080c18', border: '1px solid #4488ff', color: '#4488ff', padding: '0.5rem', cursor: 'pointer', fontFamily: 'monospace', fontSize: '0.65rem', fontWeight: 'bold' }}>
          ROTATE FUT (+45°)
        </button>
      </div>

      <div style={{ background: '#0a0a08', border: '1px dashed #3a3020', padding: '0.6rem', fontSize: '0.65rem', color: '#8a8070', marginBottom: '1rem', lineHeight: '1.4', textAlign: 'left' }}>
        <strong>Rotor Coupling Coupling Laws:</strong>
        <ul style={{ margin: '0.3rem 0 0 1.2rem', padding: 0 }}>
          <li>Past Dial shifts Past (+45°) and Present (-45°).</li>
          <li>Present Dial shifts Past (+45°), Present (+45°), and Future (+45°).</li>
          <li>Future Dial shifts Future (+45°) and Present (-45°).</li>
        </ul>
      </div>

      <button onClick={handleVerify} disabled={success} className={styles.verifyBtn}>ALIGN ROTORS</button>
    </div>
  )
}

function LogicGatesPuzzle({ onSolved }: { onSolved: () => void }) {
  const [gateA, setGateA] = useState<'AND' | 'OR' | 'XOR' | 'NAND'>('AND')
  const [gateB, setGateB] = useState<'AND' | 'OR' | 'XOR' | 'NAND'>('AND')
  const [gateC, setGateC] = useState<'AND' | 'OR' | 'XOR' | 'NAND'>('AND')
  const [gateD, setGateD] = useState<'AND' | 'OR' | 'XOR' | 'NAND'>('AND')
  const [wrong, setWrong] = useState(false)
  const [success, setSuccess] = useState(false)

  const TEST_CASES = [
    { in: [1, 0, 1, 0], out: [0, 1] },
    { in: [0, 1, 0, 1], out: [1, 0] },
    { in: [1, 1, 0, 0], out: [1, 1] },
    { in: [0, 0, 1, 1], out: [1, 0] }
  ]

  const evalGate = (type: 'AND' | 'OR' | 'XOR' | 'NAND', x: number, y: number): number => {
    switch (type) {
      case 'AND': return (x === 1 && y === 1) ? 1 : 0
      case 'OR': return (x === 1 || y === 1) ? 1 : 0
      case 'XOR': return (x !== y) ? 1 : 0
      case 'NAND': return (x === 1 && y === 1) ? 0 : 1
    }
  }

  const runCircuit = (inputs: number[]): number[] => {
    const [in0, in1, in2, in3] = inputs
    const a = evalGate(gateA, in0, in1)
    const b = evalGate(gateB, in2, in3)
    const c = evalGate(gateC, a, in2)
    const d = evalGate(gateD, b, c)
    return [c, d]
  }

  const cycleGate = (gate: 'A' | 'B' | 'C' | 'D') => {
    const sequence: ('AND' | 'OR' | 'XOR' | 'NAND')[] = ['AND', 'OR', 'XOR', 'NAND']
    const setter = gate === 'A' ? setGateA : gate === 'B' ? setGateB : gate === 'C' ? setGateC : setGateD
    const current = gate === 'A' ? gateA : gate === 'B' ? gateB : gate === 'C' ? gateC : gateD
    const nextIdx = (sequence.indexOf(current) + 1) % sequence.length
    setter(sequence[nextIdx])
  }

  const caseStatus = TEST_CASES.map(tc => {
    const out = runCircuit(tc.in)
    const pass = out[0] === tc.out[0] && out[1] === tc.out[1]
    return { ...tc, actual: out, pass }
  })

  const allPassed = caseStatus.every(cs => cs.pass)

  const handleVerify = () => {
    if (allPassed) {
      setSuccess(true)
      setTimeout(onSolved, 1500)
    } else {
      setWrong(true)
      setTimeout(() => setWrong(false), 800)
    }
  }

  return (
    <div className={`${styles.miniPuzzlePanel} ${wrong ? styles.miniPuzzleWrong : ''}`}>
      <h4>SUB-PUZZLE B: LOGIC GATE SCHEMATIC EMULATION</h4>
      <p className={styles.miniPuzzleDesc}>
        <strong>CIRCUIT EMULATOR:</strong> &quot;The firewall's logical schema has suffered localized sector burnout. You must configure the gate operations for nodes <strong>A, B, C,</strong> and <strong>D</strong> so that all four verification test vectors pass successfully.&quot;
      </p>

      {/* Schematic diagram */}
      <div style={{ background: '#020202', border: '1px solid #2d2420', padding: '1rem', borderRadius: '4px', margin: '1rem 0', fontFamily: 'monospace', fontSize: '0.65rem', textAlign: 'left', lineHeight: '1.4' }}>
        <strong>Circuit Topology Map:</strong>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
          <div>
            <div>• GATE A (Inputs: IN0, IN1) ➔ Output: [A]</div>
            <div>• GATE B (Inputs: IN2, IN3) ➔ Output: [B]</div>
          </div>
          <div>
            <div>• GATE C (Inputs: A, IN2) ➔ Output: [OUT0]</div>
            <div>• GATE D (Inputs: B, OUT0) ➔ Output: [OUT1]</div>
          </div>
        </div>
      </div>

      {/* Interactive Gates */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', margin: '1.5rem 0' }}>
        {[
          { label: 'GATE A', val: gateA, key: 'A' },
          { label: 'GATE B', val: gateB, key: 'B' },
          { label: 'GATE C', val: gateC, key: 'C' },
          { label: 'GATE D', val: gateD, key: 'D' }
        ].map(g => (
          <button
            key={g.key}
            type="button"
            onClick={() => cycleGate(g.key as any)}
            disabled={success}
            style={{
              background: '#0d0b08',
              border: '1px solid #3a3020',
              padding: '0.8rem 0.4rem',
              cursor: success ? 'default' : 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <span style={{ fontSize: '0.55rem', color: '#8a8070' }}>{g.label}</span>
            <strong style={{ color: 'var(--accent-gold)', fontSize: '0.85rem', fontFamily: 'monospace' }}>{g.val}</strong>
            <span style={{ fontSize: '0.45rem', color: '#555' }}>[CYCLE ➔]</span>
          </button>
        ))}
      </div>

      {/* Test Case Monitor */}
      <div style={{ background: '#050505', border: '1px solid #1a1510', padding: '0.8rem', borderRadius: '2px', textAlign: 'left', fontFamily: 'monospace', fontSize: '0.7rem' }}>
        <strong style={{ color: 'var(--accent-gold)' }}>TEST VECTORS STATUS MONITOR:</strong>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
          {caseStatus.map((cs, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: cs.pass ? '#4aff4a' : '#ff5555' }}>
              <span>CASE {idx + 1}: IN[{cs.in.join(',')}] ➔ EXPECT[{cs.out.join(',')}]</span>
              <span>ACTUAL[{cs.actual.join(',')}] ➔ {cs.pass ? '✓ PASS' : '░ FAIL'}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleVerify} disabled={success} className={styles.verifyBtn} style={{ marginTop: '1.2rem' }}>
        {success ? 'VOLTAGE LOCKED ✓' : 'VERIFY LOGIC SCHEMATIC'}
      </button>
    </div>
  )
}

/* ═══════════════ SUB-PUZZLE C: TRANSPOSITION MATRIX DECRYPTION ═══════════════ */
function GridShifterPuzzle({ onSolved }: { onSolved: () => void }) {
  const TARGET = [
    ['A', 'E', 'T', 'H'],
    ['E', 'R', 'I', 'O'],
    ['N', 'C', 'O', 'R'],
    ['E', 'X', 'Y', 'Z']
  ]

  const [grid, setGrid] = useState<string[][]>([
    ['E', 'A', 'T', 'H'],
    ['R', 'E', 'I', 'O'],
    ['N', 'O', 'C', 'R'],
    ['X', 'E', 'Y', 'Z']
  ])
  const [wrong, setWrong] = useState(false)
  const [success, setSuccess] = useState(false)

  const shiftRow = (rowIdx: number, direction: 'L' | 'R') => {
    if (success) return
    setGrid(prev => {
      const next = prev.map(r => [...r])
      const row = next[rowIdx]
      if (direction === 'L') {
        const first = row.shift()!
        row.push(first)
      } else {
        const last = row.pop()!
        row.unshift(last)
      }
      return next
    })
  }

  const shiftCol = (colIdx: number, direction: 'U' | 'D') => {
    if (success) return
    setGrid(prev => {
      const next = prev.map(r => [...r])
      const col = [next[0][colIdx], next[1][colIdx], next[2][colIdx], next[3][colIdx]]
      if (direction === 'U') {
        const first = col.shift()!
        col.push(first)
      } else {
        const last = col.pop()!
        col.unshift(last)
      }
      for (let r = 0; r < 4; r++) {
        next[r][colIdx] = col[r]
      }
      return next
    })
  }

  const checkMatch = () => {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (grid[r][c] !== TARGET[r][c]) return false
      }
    }
    return true
  }

  const isMatched = checkMatch()

  const handleVerify = () => {
    if (isMatched) {
      setSuccess(true)
      setTimeout(onSolved, 1500)
    } else {
      setWrong(true)
      setTimeout(() => setWrong(false), 800)
    }
  }

  return (
    <div className={`${styles.miniPuzzlePanel} ${wrong ? styles.miniPuzzleWrong : ''}`}>
      <h4>SUB-PUZZLE C: CODON SECTOR GRID SHIFTER</h4>
      <p className={styles.miniPuzzleDesc}>
        <strong>TRANSPOSITION GRID SPLICER:</strong> &quot;Leon locked the decryption block keys behind a 4x4 matrix shift register. You must shift the rows and columns to align the characters to spell out the target core signature: <strong>A-E-T-H-E-R-I-O-N C-O-R-E</strong> (padded with X-Y-Z).&quot;
      </p>

      {/* Target state reference */}
      <div style={{ background: '#0a0a0a', border: '1px dashed #3a3020', padding: '0.6rem', fontSize: '0.65rem', color: '#8a8070', margin: '0.8rem 0', fontFamily: 'monospace', textAlign: 'center' }}>
        <strong>Target Decryption Signature Matrix:</strong>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 16px)', gap: '4px', width: 'fit-content', margin: '0.3rem auto' }}>
          {TARGET.flatMap((row, r) => row.map((char, c) => (
            <span key={`${r}-${c}`} style={{ color: char === 'X' || char === 'Y' || char === 'Z' ? '#555' : 'var(--accent-gold)' }}>{char}</span>
          )))}
        </div>
      </div>

      {/* Interactive Grid with Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', margin: '1.5rem 0' }}>
        {/* Top Shift Column Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 36px)', gap: '6px', marginLeft: '50px', marginRight: '50px' }}>
          {[0, 1, 2, 3].map(colIdx => (
            <button key={colIdx} type="button" onClick={() => shiftCol(colIdx, 'U')} disabled={success}
              style={{ width: '36px', height: '20px', background: '#070705', border: '1px solid #3a3020', color: 'var(--accent-gold)', fontSize: '0.55rem', cursor: 'pointer', fontFamily: 'monospace' }}>
              ▲
            </button>
          ))}
        </div>

        {/* Rows with Shift Row Buttons */}
        {grid.map((row, rIdx) => (
          <div key={rIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button type="button" onClick={() => shiftRow(rIdx, 'R')} disabled={success}
              style={{ width: '20px', height: '36px', background: '#070705', border: '1px solid #3a3020', color: 'var(--accent-gold)', fontSize: '0.55rem', cursor: 'pointer', fontFamily: 'monospace' }}>
              ◀
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 36px)', gap: '6px' }}>
              {row.map((char, cIdx) => (
                <div
                  key={cIdx}
                  style={{
                    width: '36px',
                    height: '36px',
                    border: '1px solid #2d2420',
                    background: grid[rIdx][cIdx] === TARGET[rIdx][cIdx] ? 'rgba(74,255,74,0.15)' : '#070705',
                    color: grid[rIdx][cIdx] === TARGET[rIdx][cIdx] ? '#4aff4a' : '#c8bca8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                >
                  {char}
                </div>
              ))}
            </div>
            <button type="button" onClick={() => shiftRow(rIdx, 'L')} disabled={success}
              style={{ width: '20px', height: '36px', background: '#070705', border: '1px solid #3a3020', color: 'var(--accent-gold)', fontSize: '0.55rem', cursor: 'pointer', fontFamily: 'monospace' }}>
              ▶
            </button>
          </div>
        ))}

        {/* Bottom Shift Column Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 36px)', gap: '6px', marginLeft: '50px', marginRight: '50px' }}>
          {[0, 1, 2, 3].map(colIdx => (
            <button key={colIdx} type="button" onClick={() => shiftCol(colIdx, 'D')} disabled={success}
              style={{ width: '36px', height: '20px', background: '#070705', border: '1px solid #3a3020', color: 'var(--accent-gold)', fontSize: '0.55rem', cursor: 'pointer', fontFamily: 'monospace' }}>
              ▼
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleVerify} disabled={success} className={styles.verifyBtn}>
        {success ? 'GRID ALIGNED ✓' : 'VERIFY SHIFT ALIGNMENT'}
      </button>
    </div>
  )
}

function KirchhoffBalancerPuzzle({ onSolved }: { onSolved: () => void }) {
  const [i1, setI1] = useState(3)
  const [i2, setI2] = useState(3)
  const [i3, setI3] = useState(3)
  const [i4, setI4] = useState(3)
  const [i5, setI5] = useState(3)

  const [wrong, setWrong] = useState(false)
  const [success, setSuccess] = useState(false)

  const netA = i1 - i2 - i3
  const netB = i2 - i4 - i5
  const netC = i3 + i4 - 7

  const balanced = netA === 0 && netB === 0 && netC === 0

  const adjustCurrent = (current: 1 | 2 | 3 | 4 | 5, delta: number) => {
    if (success) return
    const setter =
      current === 1 ? setI1 :
      current === 2 ? setI2 :
      current === 3 ? setI3 :
      current === 4 ? setI4 : setI5
    
    const getter =
      current === 1 ? i1 :
      current === 2 ? i2 :
      current === 3 ? i3 :
      current === 4 ? i4 : i5

    const newVal = getter + delta
    if (newVal >= 1 && newVal <= 12) {
      setter(newVal)
    }
  }

  const handleVerify = () => {
    if (balanced) {
      setSuccess(true)
      setTimeout(onSolved, 1500)
    } else {
      setWrong(true)
      setTimeout(() => setWrong(false), 800)
    }
  }

  return (
    <div className={`${styles.miniPuzzlePanel} ${wrong ? styles.miniPuzzleWrong : ''}`}>
      <h4>SUB-PUZZLE D: KIRCHHOFF POWER GRID BALANCER</h4>
      <p className={styles.miniPuzzleDesc}>
        <strong>COHERENCE GRID STABILIZER:</strong> &quot;Before the Aetherion fragment can be extracted, you must balance the bio-containment power network. Set current nodes <strong>I1</strong> through <strong>I5</strong> using the controls to balance nodes A, B, and C to exactly 0 V net voltage.&quot;
      </p>

      {/* Node status readouts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', margin: '1rem 0' }}>
        {[
          { label: 'NODE A NET', val: netA, desc: 'I1 - I2 - I3' },
          { label: 'NODE B NET', val: netB, desc: 'I2 - I4 - I5' },
          { label: 'NODE C NET', val: netC, desc: 'I3 + I4 - 7' }
        ].map((node, idx) => (
          <div
            key={idx}
            style={{
              background: '#070705',
              border: `1px solid ${node.val === 0 ? '#4aff4a' : 'var(--warning-red)'}`,
              padding: '0.6rem 0.3rem',
              borderRadius: '2px',
              fontFamily: 'monospace',
              fontSize: '0.62rem',
              textAlign: 'center',
              boxShadow: node.val === 0 ? '0 0 10px rgba(74,255,74,0.1)' : 'none'
            }}
          >
            <div style={{ color: '#8a8070', fontSize: '0.52rem' }}>{node.label}</div>
            <strong style={{ color: node.val === 0 ? '#4aff4a' : '#ff5555', fontSize: '0.9rem', display: 'block', margin: '0.2rem 0' }}>
              {node.val > 0 ? `+${node.val}` : node.val} V
            </strong>
            <div style={{ color: '#555', fontSize: '0.45rem' }}>{node.desc}</div>
            <div style={{ color: node.val === 0 ? '#4aff4a' : '#ff5555', fontSize: '0.5rem', fontWeight: 'bold', marginTop: '0.25rem' }}>
              {node.val === 0 ? '✓ STABLE' : '░ UNBALANCED'}
            </div>
          </div>
        ))}
      </div>

      {/* Adjusters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', margin: '1.2rem 0', textAlign: 'left' }}>
        {[
          { label: 'I1 Current (Main Input)', val: i1, key: 1 },
          { label: 'I2 Current (Junction A -> B)', val: i2, key: 2 },
          { label: 'I3 Current (Junction A -> C)', val: i3, key: 3 },
          { label: 'I4 Current (Junction B -> C)', val: i4, key: 4 },
          { label: 'I5 Current (Junction B Ground)', val: i5, key: 5 }
        ].map(item => (
          <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0a0a09', padding: '0.4rem 0.6rem', border: '1px solid #1a1510' }}>
            <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#c8bca8' }}>
              {item.label}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <button type="button" onClick={() => adjustCurrent(item.key as any, -1)} disabled={success || item.val <= 1}
                style={{ width: '24px', height: '24px', background: '#1a1005', border: '1px solid #8b6914', color: '#e8c87a', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold' }}>
                -
              </button>
              <strong style={{ display: 'inline-block', width: '22px', textAlign: 'center', fontFamily: 'monospace', color: 'var(--accent-gold)', fontSize: '0.85rem' }}>
                {item.val}
              </strong>
              <button type="button" onClick={() => adjustCurrent(item.key as any, 1)} disabled={success || item.val >= 12}
                style={{ width: '24px', height: '24px', background: '#1a1005', border: '1px solid #8b6914', color: '#e8c87a', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold' }}>
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleVerify} disabled={success} className={styles.verifyBtn}>
        {success ? 'POWER DISTRIBUTION BALANCED ✓' : 'VERIFY HARMONIC DISTRIBUTION'}
      </button>
    </div>
  )
}

