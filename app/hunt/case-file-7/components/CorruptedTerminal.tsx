'use client'

import { useState, useRef, useEffect } from 'react'

interface LogFile {
  name: string
  type: string
  data: string
  hint: string
  hint2: string
  solution: string
  firstWord: string
  letter: string
  repaired: boolean
}

const INITIAL_FILES: LogFile[] = [
  {
    name: 'boot_loader.sys',
    type: 'SYSTEM BIOS CORE INITIALIZATION',
    data: 'MAIN FRAME DATA BLOCK RECOVERY UTILITY:\nSystem core bios status: OFFLINE.\nSubsector mapping modules: SUSPENDED.\nRun "repair boot_loader.sys" and input the decryption key "BOOT" to initialize baseline memory allocation.',
    hint: 'Enter "BOOT" in the repair validation prompt to load system bios.',
    hint2: 'Type the word BOOT (case insensitive) to decrypt and load the bios block.',
    solution: 'boot',
    firstWord: 'Boot',
    letter: '',
    repaired: false,
  },
  {
    name: 'corrupted_001.log',
    type: 'BASE64 OF BINARY (ASCII)',
    data: 'RESEARCH NOTE — DAY 4: Site command issued emergency [MDEwMDExMTEgMDExMTAwMTAgMDExMDAxMDAgMDExMDAxMDEgMDExMTAwMTAgMDExMTAwMTU=] to seal all entry gates. The bracketed transmission sequence is double-encrypted.',
    hint: 'First decode the Base64 sequence to reveal the 8-bit binary blocks, then convert the binary values to ASCII characters.',
    hint2: 'Base64 decode yields binary. Map each 8-bit binary sequence to decimal, then retrieve the ASCII character code.',
    solution: 'orders',
    firstWord: 'Orders',
    letter: 'O',
    repaired: false,
  },
  {
    name: 'corrupted_002.log',
    type: 'HEXADECIMAL ENCODING (ASCII)',
    data: 'RESEARCH NOTE — DAY 7: The organism has breached the medical [55 6E 69 74] division. All staff have been isolated inside their workspaces. Decrypt the Base-16 values.',
    hint: 'Hexadecimal numbers represent character codes. Convert each pair to decimal, then retrieve the ASCII character.',
    hint2: 'Convert each hex value to its base-10 equivalent, then lookup the character in the standard ASCII table.',
    solution: 'unit',
    firstWord: 'Unit',
    letter: 'U',
    repaired: false,
  },
  {
    name: 'corrupted_003.log',
    type: 'CAESAR SHIFT 3 OF ROT13',
    data: 'RESEARCH NOTE — DAY 9: It has been [jxuhu] weeks since we arrived, or so the calendar claims. But I feel like I\'ve been here years. Decrypt the double-encrypted ciphertext.',
    hint: 'Apply Caesar Shift 3 backward (subtract 3 from each letter), then apply the ROT13 substitution.',
    hint2: 'For each character, shift back by 3 in alphabet. Then apply standard ROT13 translation.',
    solution: 'three',
    firstWord: 'Three',
    letter: 'T',
    repaired: false,
  },
  {
    name: 'corrupted_004.log',
    type: 'REVERSED STRING',
    data: 'RESEARCH NOTE — DAY 11: Alert. External sensors indicate a major [hcaerB] in Sector A-Block. All personnel are ordered to seal their rooms. Decrypt the reversed string.',
    hint: 'The text sequence in brackets has been completely inverted. Reverse the string to restore the original value.',
    hint2: 'Invert the ordering of the characters in the data stream.',
    solution: 'breach',
    firstWord: 'Breach',
    letter: 'B',
    repaired: false,
  },
  {
    name: 'corrupted_005.log',
    type: 'HEXADECIMAL OF REVERSED STRING',
    data: 'RESEARCH NOTE — DAY 13: We lost the primary [6F 69 64 61 72] link. The airwaves are full of static, but I swear the noise is speaking to us. Decrypt the hex and reverse the output.',
    hint: 'This is double-encrypted: Hexadecimal ASCII representation of a reversed word. Convert hex to ASCII characters, then reverse the string.',
    hint2: 'Decipher hex codes first to retrieve reversed word. Then read characters right to left.',
    solution: 'radio',
    firstWord: 'Radio',
    letter: 'R',
    repaired: false,
  },
  {
    name: 'corrupted_006.log',
    type: 'BASE64 ENCODING',
    data: 'RESEARCH NOTE — DAY 15: Site command has initiated the final [RXZhY3VhdGlvbg==] order. But the transport shuttles never arrived. Decrypt the Base64 sequence.',
    hint: 'Standard Base64 encoding. Use a Base64 decoder to restore the text.',
    hint2: 'Translate standard Base64 characters back into ASCII text representation.',
    solution: 'evacuation',
    firstWord: 'Evacuation',
    letter: 'E',
    repaired: false,
  },
  {
    name: 'corrupted_007.log',
    type: 'ATBASH CIPHER',
    data: 'RESEARCH NOTE — DAY 17: The symptoms are spreading. [Zoo] of us are showing signs of memory distortion. I cannot trust my own thoughts. Decrypt the Atbash cipher.',
    hint: 'Atbash is a substitution cipher where the alphabet is mapped backwards: A<->Z, B<->Y, etc.',
    hint2: 'Perform substitution: 1st letter of alphabet is swapped with the 26th, 2nd with the 25th, and so on.',
    solution: 'all',
    firstWord: 'All',
    letter: 'A',
    repaired: false,
  },
  {
    name: 'corrupted_008.log',
    type: 'MORSE CODE',
    data: 'RESEARCH NOTE — DAY 19: The mainframe database has been [-.- . -.-- . -..] to a lock signature that we did not generate. Decrypt the Morse code sequence.',
    hint: 'Standard international Morse code representation. Dots and dashes.',
    hint2: 'Standard international morse code translation: decode each sequence separated by spaces.',
    solution: 'keyed',
    firstWord: 'Keyed',
    letter: 'K',
    repaired: false,
  },
]

interface TerminalLine {
  text: string
  type: 'input' | 'output' | 'error' | 'success'
}

export function CorruptedTerminal({ onSolved }: { onSolved: () => void }) {
  const [files, setFiles] = useState<LogFile[]>(INITIAL_FILES)
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: 'SITE KENNEDY — CORRUPTED MAINFRAME RECOVERY TERMINAL v2.4', type: 'output' },
    { text: 'SESSION: DEPUTY RECOVERY AGENT // ACCESS LEVEL: GOLDEN-RING', type: 'output' },
    { text: 'Type "help" to list available mainframe command-line tools.', type: 'output' },
    { text: '------------------------------------------------------------', type: 'output' },
  ])
  const [inputVal, setInputVal] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [repairTarget, setRepairTarget] = useState<string | null>(null)
  const [temp, setTemp] = useState(48.2)
  const terminalEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom on updates
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  // Check if all files are repaired and trigger solved
  useEffect(() => {
    const allRepaired = files.every(f => f.repaired)
    if (allRepaired) {
      onSolved()
    }
  }, [files, onSolved])

  // Temperature variation
  useEffect(() => {
    const timer = setInterval(() => {
      setTemp(prev => {
        const delta = (Math.random() - 0.5) * 0.4
        return parseFloat((prev + delta).toFixed(1))
      })
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const addLine = (text: string, type: 'input' | 'output' | 'error' | 'success' = 'output') => {
    setHistory(prev => [...prev, { text, type }])
  }

  const handleCommand = (cmdText: string) => {
    const trimmed = cmdText.trim()
    if (!trimmed) return

    setCommandHistory(prev => [trimmed, ...prev])
    setHistoryIndex(-1)
    addLine(`$ ${trimmed}`, 'input')

    if (repairTarget) {
      const file = files.find(f => f.name === repairTarget)
      if (file) {
        if (trimmed.toLowerCase() === file.solution) {
          setFiles(prev =>
            prev.map(f => (f.name === repairTarget ? { ...f, repaired: true } : f))
          )
          addLine(`✓ REPAIR SUCCESSFUL — Verification integrity check passed.`, 'success')
          if (file.name === 'boot_loader.sys') {
            addLine(`  Decoded string: "${file.firstWord}" -> System sector utilities: INITIALIZED. Sector mapping enabled.`, 'success')
          } else {
            addLine(`  Decoded string: "${file.firstWord}" -> Identified key identifier: [${file.letter}]`, 'success')
          }
        } else {
          addLine(`✗ REPAIR FAILED — Solution does not match file checksum.`, 'error')
        }
      }
      setRepairTarget(null)
      setInputVal('')
      return
    }

    const tokens = trimmed.split(/\s+/)
    const command = tokens[0].toLowerCase()
    const arg = tokens[1]

    switch (command) {
      case 'help':
        addLine('Available utilities:')
        addLine('  ls                       - List all files in the current workspace directory.')
        addLine('  cat <filename>           - Read the binary contents and metadata of a file.')
        addLine('  repair <filename>        - Initialize cryptographic repair sequence.')
        addLine('  hint <filename>          - Retrieve secondary recovery hint.')
        addLine('  status                   - Query state of all active repaired assets.')
        addLine('  clear                    - Flush terminal log history.')
        addLine('  help                     - Display utility documentation.')
        break

      case 'ls':
        addLine('Workspace contents:')
        files.forEach(f => {
          addLine(`  ${f.name.padEnd(20)} [${f.repaired ? 'REPAIRED ✓' : 'CORRUPTED ⚠'}]`, f.repaired ? 'success' : 'error')
        })
        addLine('  README.txt           [UNLOCKED]')
        break

      case 'cat':
        if (!arg) {
          addLine('Usage: cat <filename>', 'error')
          break
        }
        if (arg.toLowerCase() === 'readme.txt') {
          addLine('----------------- README.txt -----------------', 'output')
          addLine('ANALYST DOLEN — EMERGENCY DECRYPTION PROCEDURES:', 'output')
          addLine('System core bios must be initialized first using boot_loader.sys.', 'output')
          addLine('8 subsequent core log files were recovered from the grid.', 'output')
          addLine('Each is locked due to biological feedback corruption.', 'output')
          addLine('Use the "repair" command to verify and unlock each one in sequence.', 'output')
          addLine('The first word of each repaired log (001-008) is significant.', 'output')
          addLine('The first letter of each log\'s first word spells out', 'output')
          addLine('the mainframe bypass classification code.', 'output')
          addLine('---------------------------------------------', 'output')
          break
        }
        const fileToRead = files.find(f => f.name.toLowerCase() === arg.toLowerCase())
        if (!fileToRead) {
          addLine(`File not found: ${arg}`, 'error')
        } else {
          addLine(`----------------- ${fileToRead.name} -----------------`, 'output')
          addLine(`CORRUPTION INTERCEPT STAMP: ${fileToRead.type}`)
          addLine(`DATA STACK STREAM: ${fileToRead.data}`)
          addLine(`VERIFICATION CLUE: ${fileToRead.hint}`)
          addLine(`STATUS: ${fileToRead.repaired ? 'INTEGRITY SECURED' : 'DATA DEGRADED'}`, fileToRead.repaired ? 'success' : 'error')
          addLine('---------------------------------------------', 'output')
        }
        break

      case 'repair':
        if (!arg) {
          addLine('Usage: repair <filename>', 'error')
          break
        }
        const fileIdx = files.findIndex(f => f.name.toLowerCase() === arg.toLowerCase())
        if (fileIdx === -1) {
          addLine(`File not found: ${arg}`, 'error')
          break
        }
        const fileToRepair = files[fileIdx]
        if (fileToRepair.repaired) {
          addLine(`File is already repaired. Checksum verified.`, 'success')
        } else {
          const precedingRepaired = files.slice(0, fileIdx).every(f => f.repaired)
          if (!precedingRepaired) {
            const precedingFile = files[fileIdx - 1].name
            addLine(`REPAIR ERROR: Sector block allocation failed. Sector depends on ${precedingFile}.`, 'error')
          } else {
            setRepairTarget(fileToRepair.name)
            addLine(`Cryptographic repair sequence initialized for ${fileToRepair.name}...`)
            addLine(`Enter decoded text input:`, 'output')
          }
        }
        break

      case 'hint':
        if (!arg) {
          addLine('Usage: hint <filename>', 'error')
          break
        }
        const fileForHint = files.find(f => f.name.toLowerCase() === arg.toLowerCase())
        if (!fileForHint) {
          addLine(`File not found: ${arg}`, 'error')
        } else {
          addLine(`RECOVERY HINT FOR ${fileForHint.name}:`)
          addLine(`  ${fileForHint.hint2}`)
        }
        break

      case 'status': {
        const count = files.filter(f => f.repaired).length
        const total = files.length
        addLine(`REPAIR STATUS: ${count}/${total} FILES SECURED`)
        addLine(`PROGRESS: [${'█'.repeat(count)}${'░'.repeat(total - count)}]`)
        
        const recoveredLetters = files
          .filter(f => f.repaired && f.letter)
          .map(f => f.letter)
          .join('')
        if (recoveredLetters) {
          addLine(`RECOVERED SEGMENT KEYS: ${recoveredLetters.split('').join(' - ')}`)
        }
        
        if (count === total) {
          addLine('✓ ALL GRID SEGMENTS RECOVERED. SECURITY OVERRIDE COMPLETED.', 'success')
        } else {
          addLine('⚠ MAIN OVERRIDE SUSPENDED. REPAIR COMPROMISED FILES.', 'error')
        }
        break
      }

      case 'clear':
        setHistory([])
        break

      default:
        addLine(`Command not recognized: ${command}. Type "help" for a list of utilities.`, 'error')
    }

    setInputVal('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length === 0) return
      const nextIndex = historyIndex + 1
      if (nextIndex < commandHistory.length) {
        setHistoryIndex(nextIndex)
        setInputVal(commandHistory[nextIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const nextIndex = historyIndex - 1
      if (nextIndex >= 0) {
        setHistoryIndex(nextIndex)
        setInputVal(commandHistory[nextIndex])
      } else {
        setHistoryIndex(-1)
        setInputVal('')
      }
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      gap: '1.5rem',
      width: '100%',
      flexWrap: 'wrap',
    }}>
      {/* Left: Terminal CLI */}
      <div style={{
        flex: '1 1 500px',
        background: '#030503',
        border: '2px solid #2d5933',
        borderRadius: '4px',
        color: '#80ba79',
        fontFamily: 'var(--font-mono, monospace)',
        fontSize: '0.8rem',
        padding: '1rem',
        boxShadow: '0 0 25px rgba(45,89,51,0.15), inset 0 0 20px rgba(0,0,0,0.8)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%)',
          backgroundSize: '100% 4px',
          pointerEvents: 'none',
          zIndex: 10,
          opacity: 0.4,
        }} />

        <div style={{
          height: '380px',
          overflowY: 'auto',
          marginBottom: '1rem',
          paddingRight: '0.5rem',
        }}>
          {history.map((line, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: '0.4rem',
                color: line.type === 'error' ? '#ff5555'
                     : line.type === 'success' ? '#4aff4a'
                     : line.type === 'input' ? '#e8c060'
                     : '#80ba79',
                lineHeight: 1.4,
                whiteSpace: 'pre-wrap',
              }}
            >
              {line.text}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          borderTop: '1px solid #2d5933',
          paddingTop: '0.8rem',
        }}>
          <span style={{ color: repairTarget ? '#ff5555' : '#e8c060', marginRight: '0.5rem', fontWeight: 'bold' }}>
            {repairTarget ? `[REPAIR: ${repairTarget}] > ` : '$ '}
          </span>
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={repairTarget ? 'Type solution...' : 'Type command (ls, cat, repair, help)...'}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: repairTarget ? '#fff' : '#80ba79',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.8rem',
            }}
            autoComplete="off"
          />
        </div>
      </div>

      {/* Right: Defragmenter Grid Panel */}
      <div style={{
        width: '320px',
        background: '#030503',
        border: '2px solid #2d5933',
        borderRadius: '4px',
        color: '#80ba79',
        fontFamily: 'var(--font-mono, monospace)',
        fontSize: '0.8rem',
        padding: '1rem',
        boxShadow: '0 0 25px rgba(45,89,51,0.15), inset 0 0 20px rgba(0,0,0,0.8)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%)',
          backgroundSize: '100% 4px',
          pointerEvents: 'none',
          zIndex: 10,
          opacity: 0.4,
        }} />

        <div style={{ borderBottom: '1px solid #2d5933', paddingBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.85rem', color: '#b2dfa9' }}>
          MEMORY CORE DEFRAGMENTER
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(10, 1fr)',
          gap: '3px',
          background: '#010301',
          padding: '8px',
          border: '1px solid #1a3820',
          borderRadius: '2px',
        }}>
          {Array.from({ length: 100 }).map((_, idx) => {
            const blockIndex = Math.floor(idx / 10)
            const file = files[blockIndex]
            
            let color = '#2c1212'
            let isFlashing = false

            if (blockIndex === 9) {
              const allFilesRepaired = files.slice(0, 9).every(f => f.repaired)
              if (allFilesRepaired) {
                color = '#4aff4a'
              } else {
                color = idx % 2 === 0 ? '#ff5555' : '#2c1212'
                isFlashing = true
              }
            } else if (file) {
              if (file.repaired) {
                color = '#4aff4a'
              } else if (repairTarget === file.name) {
                color = '#e8c060'
                isFlashing = true
              } else {
                const precedingRepaired = files.slice(0, blockIndex).every(f => f.repaired)
                if (precedingRepaired) {
                  color = '#ff5555'
                } else {
                  color = '#3a1c1c'
                }
              }
            }

            return (
              <div
                key={idx}
                className={isFlashing ? 'flashing-sector' : ''}
                style={{
                  width: '100%',
                  paddingBottom: '100%',
                  position: 'relative',
                  backgroundColor: color,
                  border: '1px solid rgba(45,89,51,0.2)',
                  borderRadius: '1px',
                  boxShadow: color === '#4aff4a' ? '0 0 4px rgba(74,255,74,0.4)' : 'none',
                  transition: 'background-color 0.3s, box-shadow 0.3s',
                }}
                title={blockIndex === 9 ? 'System Reserved' : `${file?.name} (Sector ${idx})`}
              />
            )
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.7rem', color: '#689d63', marginTop: '0.3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#4aff4a', boxShadow: '0 0 3px #4aff4a' }} />
            <span>SECURED</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#e8c060' }} />
            <span>SCANNING</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#ff5555' }} />
            <span>CORRUPT</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#3a1c1c' }} />
            <span>LOCKED</span>
          </div>
        </div>

        {/* System Diagnostics */}
        <div style={{ borderTop: '1px solid #1a3820', paddingTop: '0.5rem', marginTop: '0.2rem', fontSize: '0.7rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', color: '#689d63' }}>
          <div>MAINFRAME TEMP: <span style={{ color: '#fff' }}>{temp}°C</span></div>
          <div>MEM INTEGRITY: <span style={{ color: '#4aff4a' }}>{Math.round((files.filter(f => f.repaired).length / files.length) * 100)}%</span></div>
          <div>SECTORS: <span style={{ color: '#fff' }}>90/100 ALLOCATED</span></div>
          <div>SECTOR LOGIC: <span style={{ color: '#e8c060' }}>SEQUENTIAL CHAIN</span></div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes sector-flash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .flashing-sector {
          animation: sector-flash 0.8s infinite ease-in-out;
        }
      `}} />
    </div>
  )
}

