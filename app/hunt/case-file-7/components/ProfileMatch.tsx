'use client'

import { useState, useEffect } from 'react'
import styles from '../operation-deadlight.module.css'

type ActiveNode = 'wave' | 'sequence' | 'balancer' | 'memory'

interface GuessAttempt {
  code: string
  correctPos: number
  correctVal: number
}

// Nonogram target solution for letter 'U' (1 = filled, 0 = empty)
const NONOGRAM_SOLUTION = [
  [1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 1, 1],
  [0, 1, 1, 1, 1, 0]
]

const NONOGRAM_ROW_CLUES = [
  ['1', '1'],
  ['1', '1'],
  ['1', '1'],
  ['1', '1'],
  ['2', '2'],
  ['4']
]

const NONOGRAM_COL_CLUES = [
  ['5'],
  ['2'],
  ['1'],
  ['1'],
  ['2'],
  ['5']
]

// Calcudoku cage configurations
interface Cage {
  id: string
  label: string
  cells: [number, number][]
  target: number
  color: string
}

const CALCUDOKU_CAGES: Cage[] = [
  { id: 'cA', label: '2x', cells: [[0, 0], [0, 1]], target: 2, color: 'rgba(74, 255, 74, 0.08)' },
  { id: 'cB', label: '8x', cells: [[0, 2], [1, 2]], target: 8, color: 'rgba(74, 180, 255, 0.08)' },
  { id: 'cC', label: '3x', cells: [[0, 3], [1, 3]], target: 3, color: 'rgba(255, 160, 74, 0.08)' },
  { id: 'cD', label: '4x', cells: [[1, 0], [2, 0]], target: 4, color: 'rgba(180, 74, 255, 0.08)' },
  { id: 'cE', label: '6x', cells: [[1, 1], [2, 1]], target: 6, color: 'rgba(255, 255, 74, 0.06)' },
  { id: 'cF', label: '12x', cells: [[2, 2], [3, 2], [3, 1]], target: 12, color: 'rgba(255, 74, 74, 0.08)' },
  { id: 'cG', label: '8x', cells: [[2, 3], [3, 3]], target: 8, color: 'rgba(200, 200, 200, 0.08)' },
  { id: 'cH', label: '3', cells: [[3, 0]], target: 3, color: 'rgba(74, 255, 180, 0.08)' }
]

const CALCUDOKU_SOLUTION = [
  [2, 1, 4, 3],
  [4, 3, 2, 1],
  [1, 2, 3, 4],
  [3, 4, 1, 2]
]

export function ProfileMatch({ onSolved }: { onSolved: () => void }) {
  const [activeNode, setActiveNode] = useState<ActiveNode>('wave')
  const [solvedNodes, setSolvedNodes] = useState<Record<ActiveNode, boolean>>({
    wave: false,
    sequence: false,
    balancer: false,
    memory: false,
  })
  const [phase, setPhase] = useState<'puzzle' | 'reveal'>('puzzle')
  const [revealLines, setRevealLines] = useState<string[]>([])
  const [nodeError, setNodeError] = useState<Record<ActiveNode, string>>({
    wave: '',
    sequence: '',
    balancer: '',
    memory: '',
  })

  const triggerErrorShake = () => {
    document.body.classList.add('chromatic-split')
    setTimeout(() => document.body.classList.remove('chromatic-split'), 400)
  }

  // --- NODE 1: WAVE STATES ---
  const [userFreq, setUserFreq] = useState(2.0)
  const [userAmp, setUserAmp] = useState(30)
  const [userPhase, setUserPhase] = useState(0)

  const targetFreq = 6.0
  const targetAmp = 70
  const targetPhase = 135

  const generateSinePath = (freq: number, amp: number, phase: number) => {
    let path = 'M 0 75'
    for (let x = 0; x <= 300; x += 3) {
      const radians = (x * freq * Math.PI) / 150 + (phase * Math.PI) / 180
      const y = 75 + amp * Math.sin(radians)
      path += ` L ${x} ${y}`
    }
    return path
  }

  const handleLockWave = () => {
    const freqMatch = Math.abs(userFreq - targetFreq) <= 0.2
    const ampMatch = Math.abs(userAmp - targetAmp) <= 2
    const phaseMatch = Math.abs(userPhase - targetPhase) <= 5

    if (freqMatch && ampMatch && phaseMatch) {
      setSolvedNodes(prev => ({ ...prev, wave: true }))
      setNodeError(prev => ({ ...prev, wave: '' }))
    } else {
      setNodeError(prev => ({ ...prev, wave: 'CALIBRATION ERROR: Signature mismatch. Check logs.' }))
      triggerErrorShake()
    }
  }

  // --- NODE 2: 6x6 NONOGRAM STATES ---
  // 0 = empty, 1 = filled, 2 = crossed out (X)
  const [nonogramGrid, setNonogramGrid] = useState<number[][]>(
    Array.from({ length: 6 }, () => Array(6).fill(0))
  )

  const handleNonogramCellClick = (r: number, c: number) => {
    if (solvedNodes.sequence) return
    setNodeError(prev => ({ ...prev, sequence: '' }))

    setNonogramGrid(prev => {
      const next = prev.map(row => [...row])
      // Cycle: 0 (empty) -> 1 (filled) -> 2 (crossed) -> 0 (empty)
      next[r][c] = (next[r][c] + 1) % 3
      return next
    })
  }

  const handleVerifyNonogram = () => {
    let isCorrect = true
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        const shouldBeFilled = NONOGRAM_SOLUTION[r][c] === 1
        const isFilled = nonogramGrid[r][c] === 1
        if (shouldBeFilled !== isFilled) {
          isCorrect = false
          break
        }
      }
      if (!isCorrect) break
    }

    if (isCorrect) {
      setSolvedNodes(prev => ({ ...prev, sequence: true }))
      setNodeError(prev => ({ ...prev, sequence: '' }))
    } else {
      setNodeError(prev => ({ ...prev, sequence: 'GENOMIC SEQUENCE MISMATCH: Incompatible DNA electrophoresis alignment.' }))
      triggerErrorShake()
    }
  }

  const resetNonogram = () => {
    setNonogramGrid(Array.from({ length: 6 }, () => Array(6).fill(0)))
    setNodeError(prev => ({ ...prev, sequence: '' }))
  }

  // --- NODE 3: 4x4 CALCUDOKU STATES ---
  // 0 represents empty cell
  const [calcudokuGrid, setCalcudokuGrid] = useState<number[][]>(
    Array.from({ length: 4 }, () => Array(4).fill(0))
  )

  const handleCalcudokuCellClick = (r: number, c: number) => {
    if (solvedNodes.balancer) return
    setNodeError(prev => ({ ...prev, balancer: '' }))

    setCalcudokuGrid(prev => {
      const next = prev.map(row => [...row])
      // Cycle: 0 -> 1 -> 2 -> 3 -> 4 -> 0
      next[r][c] = (next[r][c] + 1) % 5
      return next
    })
  }

  const handleVerifyCalcudoku = () => {
    // 1. Verify completely filled
    const allFilled = calcudokuGrid.every(row => row.every(val => val !== 0))
    if (!allFilled) {
      setNodeError(prev => ({ ...prev, balancer: 'CALIBRATION ERROR: All grid chambers must be assigned a BSL rating.' }))
      return
    }

    // 2. Verify rows and columns have no repeats
    let hasRepeats = false
    for (let i = 0; i < 4; i++) {
      const rowVals = new Set()
      const colVals = new Set()
      for (let j = 0; j < 4; j++) {
        rowVals.add(calcudokuGrid[i][j])
        colVals.add(calcudokuGrid[j][i])
      }
      if (rowVals.size !== 4 || colVals.size !== 4) {
        hasRepeats = true
        break
      }
    }

    if (hasRepeats) {
      setNodeError(prev => ({ ...prev, balancer: 'OVERLOAD: Duplicate BSL ratings detected in intersecting containment rows/columns.' }))
      triggerErrorShake()
      return
    }

    // 3. Verify math constraints for cages
    let cagesValid = true
    for (const cage of CALCUDOKU_CAGES) {
      const vals = cage.cells.map(([r, c]) => calcudokuGrid[r][c])
      const product = vals.reduce((acc, curr) => acc * curr, 1)

      if (cage.label.endsWith('x')) {
        if (product !== cage.target) {
          cagesValid = false
          break
        }
      } else {
        // Val cage
        if (vals[0] !== cage.target) {
          cagesValid = false
          break
        }
      }
    }

    if (cagesValid) {
      setSolvedNodes(prev => ({ ...prev, balancer: true }))
      setNodeError(prev => ({ ...prev, balancer: '' }))
    } else {
      setNodeError(prev => ({ ...prev, balancer: 'ALIGNMENT ERROR: Chamber pressure products exceed safety threshold values.' }))
      triggerErrorShake()
    }
  }

  const resetCalcudoku = () => {
    setCalcudokuGrid(Array.from({ length: 4 }, () => Array(4).fill(0)))
    setNodeError(prev => ({ ...prev, balancer: '' }))
  }

  // Helper to find cage styling details
  const getCellCageDetails = (r: number, c: number) => {
    const cage = CALCUDOKU_CAGES.find(cg => cg.cells.some(([cr, cc]) => cr === r && cc === c))
    if (!cage) return { color: '#0d0b08', label: '' }
    
    // Only show label on the top-leftmost cell of the cage
    const sortedCells = [...cage.cells].sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1])
    const isTopLeft = sortedCells[0][0] === r && sortedCells[0][1] === c

    return {
      color: cage.color,
      label: isTopLeft ? cage.label : ''
    }
  }

  // --- NODE 4: CODE BREAKER STATES ---
  const secretCode = '4163'
  const [guess, setGuess] = useState('')
  const [guesses, setGuesses] = useState<GuessAttempt[]>([])

  const handleSubmitGuess = (e: React.FormEvent) => {
    e.preventDefault()
    if (solvedNodes.memory) return
    const trimmed = guess.trim()
    
    if (trimmed.length !== 4 || !/^[1-6]+$/.test(trimmed)) {
      setNodeError(prev => ({ ...prev, memory: 'INVALID REGISTER: Override key must be exactly 4 digits containing values 1-6.' }))
      return
    }

    let correctPos = 0
    let correctVal = 0

    const codeArr = secretCode.split('')
    const guessArr = trimmed.split('')

    const codeMatched = [false, false, false, false]
    const guessMatched = [false, false, false, false]

    for (let i = 0; i < 4; i++) {
      if (guessArr[i] === codeArr[i]) {
        correctPos++
        codeMatched[i] = true
        guessMatched[i] = true
      }
    }

    for (let i = 0; i < 4; i++) {
      if (guessMatched[i]) continue
      for (let j = 0; j < 4; j++) {
        if (!codeMatched[j] && guessArr[i] === codeArr[j]) {
          correctVal++
          codeMatched[j] = true
          break
        }
      }
    }

    const attempt: GuessAttempt = {
      code: trimmed,
      correctPos,
      correctVal
    }

    setGuesses(prev => [attempt, ...prev])
    setGuess('')
    setNodeError(prev => ({ ...prev, memory: '' }))

    if (trimmed === secretCode) {
      setSolvedNodes(prev => ({ ...prev, memory: true }))
    } else {
      triggerErrorShake()
    }
  }

  // Compile full access vector
  useEffect(() => {
    if (solvedNodes.wave && solvedNodes.sequence && solvedNodes.balancer && solvedNodes.memory) {
      triggerCompile()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solvedNodes])

  const triggerCompile = async () => {
    setTimeout(async () => {
      setPhase('reveal')
      const lines = [
        '> INITIALIZING SYSTEM MAIN DECRYPTION VECTOR...',
        '> [NODE 1] SIGNAL STABILIZED — DECRYPTED SIGNALS RECEIVED',
        '> [NODE 2] GENOMIC STRUCTURE ALIGNED',
        '> [NODE 3] ATMOSPHERIC CHAMBERS PRESSURE-BALANCED',
        '> [NODE 4] CMOS REGISTERS OVERRIDDEN',
        '> ALL DIAGNOSTIC SUBSYSTEMS ONLINE',
        '> DECRYPTED ACCESS PORT SECURED PHASES:',
        '>   [ NODE 1 ] -> L',
        '>   [ NODE 2 ] -> U',
        '>   [ NODE 3 ] -> R',
        '>   [ NODE 4 ] -> E',
        '> ACCESS VECTOR RE-ASSEMBLED.',
        '> BIOLAB ACCESS PORT UNLOCKED. ENTER CLASSIFICATION KEY.',
        '> TRANSMITTING BYPASS SIGNALS...',
      ]
      for (let i = 0; i < lines.length; i++) {
        await new Promise(r => setTimeout(r, 500))
        setRevealLines(prev => [...prev, lines[i]])
      }
      onSolved()
    }, 1200)
  }

  return (
    <div className={styles.profileMatchContainer}>
      {phase === 'puzzle' && (
        <>
          <div className={styles.memorizeTimer}>
            MAINFRAME SYSTEM RECONSTRUCTION WORKSPACE
          </div>

          {/* Tab Selection */}
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
            {(['wave', 'sequence', 'balancer', 'memory'] as const).map(node => {
              const isActive = activeNode === node
              const isSolved = solvedNodes[node]
              return (
                <button
                  key={node}
                  onClick={() => setActiveNode(node)}
                  style={{
                    background: isActive ? 'var(--accent-gold, #b8862a)' : '#0d0b08',
                    border: '1px solid #3a3020',
                    color: isActive ? '#1a1205' : isSolved ? '#4aff4a' : '#c8bca8',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.7rem',
                    padding: '0.5rem 0.8rem',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    letterSpacing: '0.05em'
                  }}
                >
                  Node {node === 'wave' ? '1: Signal' : node === 'sequence' ? '2: DNA Scan' : node === 'balancer' ? '3: BSL Balancer' : '4: CMOS Override'} {isSolved ? '✓' : ''}
                </button>
              )
            })}
          </div>

          {/* Active Puzzle Box */}
          <div style={{
            background: 'rgba(18, 16, 10, 0.4)',
            border: '1px solid #3a3020',
            padding: '1.5rem',
            borderRadius: '4px',
            fontFamily: 'var(--font-mono, monospace)',
            minHeight: '340px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            textAlign: 'left'
          }}>

            {/* NODE 1: SIGNAL WAVE RIDDLE */}
            {activeNode === 'wave' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', margin: 0 }}>NODE 1: OBSERVER LOG — TRANSCRIPTS</h4>
                
                {/* Clues */}
                <div style={{ background: '#070705', border: '1px dashed #3a3020', padding: '0.75rem', fontSize: '0.7rem', color: '#8a8070', lineHeight: '1.4' }}>
                  <strong>RESEARCH NOTE (March 8, 1996):</strong>
                  <p style={{ margin: '0.4rem 0' }}>&quot;We intercepted a low-frequency neural pulse from the patient's frontal lobe. The signal calibration parameters are hidden within the biological constants:</p>
                  <ul style={{ margin: '0.4rem 0 0 1.2rem', padding: 0 }}>
                    <li><strong>Frequency (Hz)</strong>: Equal to the number of vertices on a standard geometric Heptagon, decremented by exactly 1 unit to filter the background noise.</li>
                    <li><strong>Amplitude (V)</strong>: Registered at the square of the first prime number greater than 5, offset by a positive calibration boost of 21 units.</li>
                    <li><strong>Phase Offset (°)</strong>: Found at the angular quadrant coordinate in the second quadrant where the sine wave value is exactly equal to its negative cosine.&quot;</li>
                  </ul>
                </div>

                {/* SVG Real-time Oscilloscope */}
                <div style={{ background: '#020202', border: '1px solid #2d2420', position: 'relative', height: '120px' }}>
                  <svg width="100%" height="120" style={{ display: 'block' }}>
                    <path d={generateSinePath(targetFreq, targetAmp, targetPhase)} fill="none" stroke="#b8862a" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.6" />
                    <path d={generateSinePath(userFreq, userAmp, userPhase)} fill="none" stroke={solvedNodes.wave ? '#4aff4a' : '#ff4444'} strokeWidth="1.8" />
                  </svg>
                  {solvedNodes.wave && (
                    <div style={{
                      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(0,30,0,0.85)', color: '#4aff4a', fontWeight: 'bold', fontSize: '0.75rem', gap: '0.5rem'
                    }}>
                      <div>SIGNAL STABILIZED — NODE 1 SECURED ✓</div>
                      <div style={{ color: '#fff', fontSize: '0.85rem', border: '1px dashed #4aff4a', padding: '0.3rem 0.6rem', background: '#000' }}>
                        DECRYPTED SIGNAL CHAR A: <span style={{ color: 'var(--accent-gold)', fontSize: '1.1rem' }}>L</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sliders */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#8a8070' }}>
                      <span>FREQUENCY</span>
                      <span>{userFreq.toFixed(1)} Hz</span>
                    </div>
                    <input
                      type="range" min="1.0" max="10.0" step="0.2" value={userFreq} disabled={solvedNodes.wave}
                      onChange={e => setUserFreq(parseFloat(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent-gold)' }}
                    />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#8a8070' }}>
                      <span>AMPLITUDE</span>
                      <span>{userAmp} V</span>
                    </div>
                    <input
                      type="range" min="10" max="90" step="2" value={userAmp} disabled={solvedNodes.wave}
                      onChange={e => setUserAmp(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent-gold)' }}
                    />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#8a8070' }}>
                      <span>PHASE</span>
                      <span>{userPhase}°</span>
                    </div>
                    <input
                      type="range" min="0" max="360" step="5" value={userPhase} disabled={solvedNodes.wave}
                      onChange={e => setUserPhase(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent-gold)' }}
                    />
                  </div>
                </div>

                {nodeError.wave && <span style={{ color: 'var(--warning-red)', fontSize: '0.7rem' }}>{nodeError.wave}</span>}
                
                <button
                  type="button" disabled={solvedNodes.wave} onClick={handleLockWave}
                  style={{
                    background: 'var(--accent-gold)', border: 'none', color: '#1a1205',
                    fontSize: '0.7rem', fontWeight: 'bold', padding: '0.5rem', cursor: 'pointer', textAlign: 'center'
                  }}
                >
                  LOCK WAVE SIGNATURE
                </button>
              </div>
            )}

            {/* NODE 2: 6x6 NONOGRAM */}
            {activeNode === 'sequence' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <h4 style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', margin: 0 }}>NODE 2: BIOLAB DIAGNOSTIC JOURNAL</h4>
                <div style={{ background: '#070705', border: '1px dashed #3a3020', padding: '0.75rem', fontSize: '0.7rem', color: '#8a8070', lineHeight: '1.4' }}>
                  <strong>LAB FORENSICS LOG — DR. VALE:</strong>
                  <p style={{ margin: '0.4rem 0' }}>&quot;The pathogen's DNA sequence scan shows a highly structured grid of radioactive genetic bands. The row and column indicators represent consecutive fragments of base-pair alignments. Align the electrophoresis cells so they conform to the lane constraints. Click cells to toggle: **Empty** $\rightarrow$ **Pathogen Active** $\rightarrow$ **Eliminated (✖)**.&quot;</p>
                </div>

                {/* Nonogram Game Panel */}
                <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  
                  {/* Grid Container */}
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    {/* Column Clues */}
                    <div style={{ display: 'flex', marginLeft: '40px', marginBottom: '4px' }}>
                      {NONOGRAM_COL_CLUES.map((clues, cIdx) => (
                        <div key={cIdx} style={{
                          width: '32px', height: '50px', display: 'flex', flexDirection: 'column',
                          justifyContent: 'flex-end', alignItems: 'center', fontSize: '0.65rem', color: 'var(--accent-gold)',
                          marginRight: '3px'
                        }}>
                          {clues.map((clue, idx) => <span key={idx} style={{ lineHeight: '1.1' }}>{clue}</span>)}
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex' }}>
                      {/* Row Clues */}
                      <div style={{ display: 'flex', flexDirection: 'column', width: '36px', marginRight: '4px' }}>
                        {NONOGRAM_ROW_CLUES.map((clues, rIdx) => (
                          <div key={rIdx} style={{
                            height: '32px', display: 'flex', justifyContent: 'flex-end',
                            alignItems: 'center', fontSize: '0.65rem', color: 'var(--accent-gold)', gap: '4px',
                            marginBottom: '3px'
                          }}>
                            {clues.map((clue, idx) => <span key={idx}>{clue}</span>)}
                          </div>
                        ))}
                      </div>

                      {/* Board cells */}
                      <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(6, 32px)', gap: '3px',
                        background: '#020202', border: '1px solid #3a3020', padding: '4px'
                      }}>
                        {nonogramGrid.map((row, r) =>
                          row.map((val, c) => (
                            <button
                              key={`${r}-${c}`}
                              type="button" disabled={solvedNodes.sequence}
                              onClick={() => handleNonogramCellClick(r, c)}
                              style={{
                                width: '32px', height: '32px', padding: 0,
                                background: val === 1 ? 'var(--accent-gold, #b8862a)' : '#0d0b08',
                                border: '1px solid #221a15',
                                color: val === 2 ? '#ff4444' : '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.8rem', fontWeight: 'bold',
                                cursor: solvedNodes.sequence ? 'not-allowed' : 'pointer',
                                outline: 'none'
                              }}
                            >
                              {val === 2 ? '✖' : ''}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Commands */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '150px' }}>
                    <button
                      type="button" disabled={solvedNodes.sequence} onClick={handleVerifyNonogram}
                      style={{
                        background: 'var(--accent-gold)', border: 'none', color: '#1a1205',
                        fontSize: '0.7rem', fontWeight: 'bold', padding: '0.6rem', cursor: 'pointer'
                      }}
                    >
                      VERIFY DNA PATTERN
                    </button>
                    <button
                      type="button" disabled={solvedNodes.sequence} onClick={resetNonogram}
                      style={{
                        background: 'transparent', border: '1px solid #3a3020', color: '#8a8070',
                        fontSize: '0.65rem', padding: '0.5rem', cursor: 'pointer'
                      }}
                    >
                      RESET GEL GRID
                    </button>
                  </div>
                </div>

                {solvedNodes.sequence && (
                  <div style={{ background: 'rgba(0,30,0,0.8)', borderLeft: '3px solid #4aff4a', padding: '0.6rem', fontSize: '0.75rem', color: '#c0f0c0', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div>DNA SEQUENCE ALIGNED — NODE 2 SECURED ✓</div>
                    <div style={{ color: '#fff', fontSize: '0.8rem', border: '1px dashed #4aff4a', padding: '0.2rem 0.5rem', background: '#000', width: 'fit-content' }}>
                      DECRYPTED SIGNAL CHAR B: <span style={{ color: 'var(--accent-gold)', fontSize: '1rem', fontWeight: 'bold' }}>U</span>
                    </div>
                  </div>
                )}
                {nodeError.sequence && (
                  <div style={{ background: 'rgba(30,0,0,0.75)', borderLeft: '3px solid #cc1111', padding: '0.5rem', fontSize: '0.75rem', color: '#ffbbbb' }}>
                    {nodeError.sequence}
                  </div>
                )}
              </div>
            )}

            {/* NODE 3: 4x4 CALCUDOKU */}
            {activeNode === 'balancer' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <h4 style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', margin: 0 }}>NODE 3: VENTILATION INTERFACE DIAL</h4>
                <div style={{ background: '#070705', border: '1px dashed #3a3020', padding: '0.75rem', fontSize: '0.7rem', color: '#8a8070', lineHeight: '1.4' }}>
                  <strong>CONTAINMENT SHUTDOWN PROTOCOLS:</strong>
                  <p style={{ margin: '0.4rem 0' }}>&quot;To seal the quarantined sectors, assign Biosafety Level ratings (1 to 4) across the 4x4 facility grid. To prevent atmospheric leakage, no two chambers in the same row or column may share a rating. Each color-coded vault zone has a venting pressure coefficient (e.g. `12x`, `8x`) which must equal the mathematical product of all chamber ratings in that zone. Sector H requires BSL 3.&quot;</p>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                  
                  {/* Grid */}
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(4, 52px)', gap: '2px',
                    background: '#2d2420', border: '2px solid #3a3020', padding: '3px'
                  }}>
                    {calcudokuGrid.map((row, r) =>
                      row.map((val, c) => {
                        const { color, label } = getCellCageDetails(r, c)
                        return (
                          <button
                            key={`${r}-${c}`}
                            type="button" disabled={solvedNodes.balancer}
                            onClick={() => handleCalcudokuCellClick(r, c)}
                            style={{
                              width: '52px', height: '52px', padding: '2px',
                              background: color,
                              border: '1px solid rgba(184,134,42,0.15)',
                              color: '#fff',
                              fontFamily: 'var(--font-mono, monospace)',
                              cursor: solvedNodes.balancer ? 'not-allowed' : 'pointer',
                              position: 'relative',
                              outline: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {/* Cage Label */}
                            {label && (
                              <span style={{
                                position: 'absolute', top: '2px', left: '3px',
                                fontSize: '0.5rem', color: 'var(--accent-gold, #b8862a)', fontWeight: 'bold'
                              }}>
                                {label}
                              </span>
                            )}
                            {/* Cell Value */}
                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: val === 0 ? 'transparent' : '#e8c060' }}>
                              {val === 0 ? '-' : val}
                            </span>
                          </button>
                        )
                      })
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '150px' }}>
                    <button
                      type="button" disabled={solvedNodes.balancer} onClick={handleVerifyCalcudoku}
                      style={{
                        background: 'var(--accent-gold)', border: 'none', color: '#1a1205',
                        fontSize: '0.7rem', fontWeight: 'bold', padding: '0.6rem', cursor: 'pointer'
                      }}
                    >
                      VERIFY CONTAINMENT BALANCE
                    </button>
                    <button
                      type="button" disabled={solvedNodes.balancer} onClick={resetCalcudoku}
                      style={{
                        background: 'transparent', border: '1px solid #3a3020', color: '#8a8070',
                        fontSize: '0.65rem', padding: '0.5rem', cursor: 'pointer'
                      }}
                    >
                      RESET CHAMBER GRID
                    </button>
                  </div>
                </div>

                {solvedNodes.balancer && (
                  <div style={{ background: 'rgba(0,30,0,0.8)', borderLeft: '3px solid #4aff4a', padding: '0.6rem', fontSize: '0.75rem', color: '#c0f0c0', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div>PRESSURE BALANCED — NODE 3 SECURED ✓</div>
                    <div style={{ color: '#fff', fontSize: '0.8rem', border: '1px dashed #4aff4a', padding: '0.2rem 0.5rem', background: '#000', width: 'fit-content' }}>
                      DECRYPTED SIGNAL CHAR C: <span style={{ color: 'var(--accent-gold)', fontSize: '1rem', fontWeight: 'bold' }}>R</span>
                    </div>
                  </div>
                )}
                {nodeError.balancer && (
                  <div style={{ background: 'rgba(30,0,0,0.75)', borderLeft: '3px solid #cc1111', padding: '0.5rem', fontSize: '0.75rem', color: '#ffbbbb' }}>
                    {nodeError.balancer}
                  </div>
                )}
              </div>
            )}

            {/* NODE 4: NUMERIC CODE BREAKER */}
            {activeNode === 'memory' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <h4 style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', margin: 0 }}>NODE 4: BIOS LOGIC BYPASS LOGS</h4>
                <div style={{ background: '#070705', border: '1px dashed #3a3020', padding: '0.75rem', fontSize: '0.7rem', color: '#8a8070', lineHeight: '1.4' }}>
                  <strong>MAINFRAME BYPASS LOG — CHIEF ARCHIVIST:</strong>
                  <p style={{ margin: '0.4rem 0' }}>&quot;The terminal lock is controlled by a 4-digit security code using values 1 to 6. Our diagnostic utility provides feedback: **Pos** indicates correct digits in the exact correct register position, and **Dig** indicates correct digits in the wrong register position. Deduce the code sequence to override the CMOS BIOS and receive the final vector part.&quot;</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {/* Guess Input Form */}
                  <form onSubmit={handleSubmitGuess} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.65rem', color: '#8a8070', marginBottom: '0.2rem' }}>ENTER 4-DIGIT CODE</label>
                      <input
                        type="text"
                        value={guess}
                        disabled={solvedNodes.memory}
                        onChange={e => setGuess(e.target.value.replace(/[^1-6]/g, '').substring(0, 4))}
                        placeholder="e.g. 1234"
                        style={{
                          width: '100%', background: '#050505', border: '1px solid #3a3020',
                          color: '#e8c060', padding: '0.5rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono, monospace)',
                          outline: 'none', boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <button
                      type="submit" disabled={solvedNodes.memory}
                      style={{
                        background: 'var(--accent-gold)', border: 'none', color: '#1a1205',
                        fontSize: '0.7rem', fontWeight: 'bold', padding: '0.5rem', cursor: 'pointer'
                      }}
                    >
                      SUBMIT BYPASS ATTEMPT
                    </button>
                    {nodeError.memory && <span style={{ color: 'var(--warning-red)', fontSize: '0.7rem' }}>{nodeError.memory}</span>}
                  </form>

                  {/* Guess History Terminal */}
                  <div style={{
                    flex: 1.2, background: '#020202', border: '1px solid #2d2420',
                    padding: '0.6rem', height: '150px', overflowY: 'auto', fontSize: '0.65rem'
                  }}>
                    <p style={{ color: '#8a8070', margin: '0 0 0.4rem 0', borderBottom: '1px solid #222', paddingBottom: '0.2rem' }}>ACCESS LOGS:</p>
                    {guesses.length === 0 ? (
                      <em style={{ color: '#444' }}>Terminal idle. Waiting for bypass attempts...</em>
                    ) : (
                      guesses.map((g, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', margin: '0.25rem 0', borderBottom: '1px dashed #111', paddingBottom: '0.2rem' }}>
                          <span style={{ color: '#fff', fontWeight: 'bold' }}>G-{guesses.length - i}: {g.code}</span>
                          <span style={{ color: '#8a8070' }}>
                            <strong style={{ color: '#4aff4a' }}>{g.correctPos}</strong> Pos | <strong style={{ color: 'var(--accent-gold)' }}>{g.correctVal}</strong> Dig
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {solvedNodes.memory && (
                  <div style={{ background: 'rgba(0,30,0,0.8)', borderLeft: '3px solid #4aff4a', padding: '0.6rem', fontSize: '0.75rem', color: '#c0f0c0', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div>CMOS LOCK BYPASSED — NODE 4 SECURED ✓</div>
                    <div style={{ color: '#fff', fontSize: '0.8rem', border: '1px dashed #4aff4a', padding: '0.2rem 0.5rem', background: '#000', width: 'fit-content' }}>
                      DECRYPTED SIGNAL CHAR D: <span style={{ color: 'var(--accent-gold)', fontSize: '1rem', fontWeight: 'bold' }}>E</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Node status counter */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #3a3020',
              paddingTop: '0.8rem', fontSize: '0.7rem', color: '#8a8070', marginTop: '1rem'
            }}>
              <span>DIAGNOSTIC SUBSYSTEMS:</span>
              <span style={{ fontWeight: 'bold', color: Object.values(solvedNodes).every(Boolean) ? '#4aff4a' : '#e8c060' }}>
                {Object.values(solvedNodes).filter(Boolean).length}/4 NODES SECURED
              </span>
            </div>

          </div>
        </>
      )}

      {phase === 'reveal' && (
        <div className={styles.crtTerminal}>
          <div className={styles.crtScanlines} />
          <div className={styles.terminalOutput}>
            {revealLines.map((line, i) => (
              <p key={i} className={
                line.includes('STABILIZED') || line.includes('RECOVERED') ? styles.infectedLine : ''
              }>
                {line}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

