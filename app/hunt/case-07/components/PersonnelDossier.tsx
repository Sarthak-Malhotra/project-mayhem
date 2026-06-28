'use client'

import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import styles from '../operation-deadlight.module.css'

interface PersonnelFile {
  id: string
  name: string
  codename: string
  clearance: string
  assignmentDate: string
  team: string
  verificationNote: string
  status: string
  symptoms?: string
  dossierNotes: string
  isPlanted: boolean
}

const PERSONNEL: PersonnelFile[] = [
  {
    id: 'p1',
    name: 'Cpt. HARLAN',
    codename: 'RAVEN',
    clearance: 'LEVEL VII',
    assignmentDate: 'March 2, 1996',
    team: 'ALPHA',
    verificationNote: 'Completed Day 5 briefing. All protocols nominal.',
    status: 'MISSING (DAY 18)',
    symptoms: 'Auditory hallucinations (whispering walls)',
    dossierNotes: 'First officer to request sector quarantine. Recommended immediate lock of the church ruins. Cabin found empty and locked from inside.',
    isPlanted: false,
  },
  {
    id: 'p2',
    name: 'Dr. MOSLEY',
    codename: 'SCALPEL',
    clearance: 'LEVEL VIII',
    assignmentDate: 'March 3, 1996',
    team: 'MEDICAL',
    verificationNote: 'Led autopsy on Subject 4. Report filed Day 7.',
    status: 'ACTIVE',
    symptoms: 'Obsessive tool-washing, bloodshot eyes',
    dossierNotes: 'Performed autopsy on Subject 4. Reported that myocardial tissue continued to contract 4 hours post-extraction. Refuses to detail cell structure.',
    isPlanted: false,
  },
  {
    id: 'p3',
    name: 'Sgt. PENN',
    codename: 'ANVIL',
    clearance: 'LEVEL VI',
    assignmentDate: 'March 2, 1996',
    team: 'BRAVO',
    verificationNote: 'Patrol log entries consistent through Day 14.',
    status: 'ACTIVE',
    symptoms: 'Hyper-vigilance, extreme paranoia',
    dossierNotes: 'Requested transfer out of C-Block due to "irregular shadow movements" in the vents. Claims some gate guards have unnatural walking gates.',
    isPlanted: false,
  },
  {
    id: 'p4',
    name: 'Opr. WARD',
    codename: 'GHOST',
    clearance: 'BRAVO TEAM ONLY',
    assignmentDate: 'April 8, 1996',
    team: 'ALPHA',
    verificationNote: 'Present at Day 22 coordination meeting. Confirmed.',
    status: 'ACTIVE',
    symptoms: 'Unresponsive; speech echoes command pre-records',
    dossierNotes: 'Alpha logs state he never boarded the deployment transport at HQ, but was logged present at the Day 22 coordination meeting.',
    isPlanted: true,
  },
  {
    id: 'p5',
    name: 'Lt. CROSS',
    codename: 'MERIDIAN',
    clearance: 'LEVEL VII',
    assignmentDate: 'March 4, 1996',
    team: 'ALPHA',
    verificationNote: 'Radio operator. All transmission logs intact.',
    status: 'QUARANTINED (DAY 15)',
    symptoms: 'Severe retro-cognitive memory loss',
    dossierNotes: 'Transmitted initial static-filled distress message. Retained after attempting to communicate with Ganado figures outside the perimeter gates.',
    isPlanted: false,
  },
  {
    id: 'p6',
    name: 'Dr. VALE',
    codename: 'PRISM',
    clearance: 'LEVEL VIII',
    assignmentDate: 'March 3, 1996',
    team: 'MEDICAL',
    verificationNote: 'Behavioral screening records filed Days 3–12.',
    status: 'MISSING (DAY 12)',
    symptoms: 'Extreme paranoia, files missing',
    dossierNotes: 'Led behavioral screening. Her final log suggests that infected hosts retain awareness but link into a collective mind. Disappeared near the well.',
    isPlanted: false,
  },
  {
    id: 'p7',
    name: 'Cpl. TATE',
    codename: 'IRON',
    clearance: 'LEVEL V',
    assignmentDate: 'March 5, 1996',
    team: 'BRAVO',
    verificationNote: 'Gate duty rotation confirmed through Day 16.',
    status: 'ACTIVE',
    symptoms: 'Insomnia, refusal to sleep',
    dossierNotes: 'Sector 4-B gate duty. Logged multiple perimeter anomalies that technicians dismissed. Insists "the trees are changing positions" at night.',
    isPlanted: false,
  },
  {
    id: 'p8',
    name: 'Agt. FROST',
    codename: 'SPECTER',
    clearance: 'LEVEL VII',
    assignmentDate: 'March 2, 1996',
    team: 'ALPHA',
    verificationNote: 'Forward observation post reports nominal.',
    status: 'UNCONFIRMED',
    symptoms: 'Disorientation',
    dossierNotes: 'Forward observer. Sent irregular radio bursts describing "tall figures holding lanterns" near Salazar Castle ruins before static cut out.',
    isPlanted: false,
  },
  {
    id: 'p9',
    name: 'Spc. KIRK',
    codename: 'VOLT',
    clearance: 'LEVEL VI',
    assignmentDate: 'March 6, 1996',
    team: 'TECHNICAL',
    verificationNote: 'Communications array maintenance logged Days 4–18.',
    status: 'ACTIVE',
    symptoms: 'Dilation of pupils, heavy breathing',
    dossierNotes: 'Communications technician. Reports incoming signals are echoing backward. Confirmed hearing Dolen\'s voice on line days after Dolen went missing.',
    isPlanted: false,
  },
  {
    id: 'p10',
    name: 'Dr. NASH',
    codename: 'LENS',
    clearance: 'LEVEL VIII',
    assignmentDate: 'March 3, 1996',
    team: 'MEDICAL',
    verificationNote: 'Lab specimen analysis complete. Filed Day 10.',
    status: 'QUARANTINED (DAY 14)',
    symptoms: 'Obsessive repeating of mathematical variables',
    dossierNotes: 'Extracted and locked specimen registers. DNA scans matched baseline parameters on Day 3, but showed significant phase shifts by Day 10.',
    isPlanted: false,
  },
  {
    id: 'p11',
    name: 'Pvt. COLE',
    codename: 'EMBER',
    clearance: 'LEVEL IV',
    assignmentDate: 'March 7, 1996',
    team: 'BRAVO',
    verificationNote: 'Perimeter watch. No incidents reported.',
    status: 'ACTIVE',
    symptoms: 'Auditory buzzing in skull',
    dossierNotes: 'Perimeter guard. Logged seeing a child in red rags wandering the marshlands, though command logs confirm no children are present.',
    isPlanted: false,
  },
  {
    id: 'p12',
    name: 'Lt. BLAKE',
    codename: 'BASALT',
    clearance: 'LEVEL VII',
    assignmentDate: 'March 4, 1996',
    team: 'ALPHA',
    verificationNote: 'Supply chain audit. All manifests verified.',
    status: 'ACTIVE',
    symptoms: 'None',
    dossierNotes: 'Supply auditor. Discovered multiple supply crates marked "Project Null biological samples" in manifests that were never cleared by Site Command.',
    isPlanted: false,
  },
]

const LOGS_TO_SORT = [
  { id: 'l1', day: 3, text: "Dr. Vale begins compiling initial behavioral screening records for returning residents." },
  { id: 'l2', day: 5, text: "Site Command authorizes emergency medical autopsy on Subject 4. Scheduled within 24 hours." },
  { id: 'l3', day: 7, text: "Subject 4 autopsy report filed by Dr. Mosley. Anomalous cellular degradation and tissue regeneration noted." },
  { id: 'l4', day: 10, text: "Dr. Nash completes laboratory specimen extractions and locks quarantined sample registers." },
  { id: 'l5', day: 12, text: "Dr. Vale completes the final behavioral screening logs, warning that infected hosts retain awareness." },
  { id: 'l6', day: 16, text: "Gate duty rotations archived. Cpl. Tate logs perimeter security gate signature checks in Sector 4-B." },
  { id: 'l7', day: 22, text: "Operator Ward logs attendance at post-lockdown coordination meeting. Severe access key discrepancy flagged." }
]

export function PersonnelDossier({ onSolved }: { onSolved: () => void }) {
  const [expandedCards, setExpandedCards] = useState<string[]>([])
  const [suspectId, setSuspectId] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)
  const [result, setResult] = useState<'none' | 'wrong' | 'timeline' | 'correct'>('none')
  const [revealLines, setRevealLines] = useState<string[]>([])
  const [sortedLogs, setSortedLogs] = useState<typeof LOGS_TO_SORT>([])
  const [timelineError, setTimelineError] = useState('')
  const cooldownRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const triggerErrorShake = () => {
    document.body.classList.add('chromatic-split')
    setTimeout(() => document.body.classList.remove('chromatic-split'), 400)
  }

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return
    cooldownRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current)
          setResult('none')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current)
    }
  }, [cooldown])

  function toggleExpand(id: string) {
    setExpandedCards(prev => {
      if (prev.includes(id)) return prev.filter(p => p !== id)
      // Max 2 expanded at a time
      if (prev.length >= 2) return [prev[1], id]
      return [...prev, id]
    })
  }

  function moveLog(index: number, direction: 'up' | 'down') {
    const nextIndex = direction === 'up' ? index - 1 : index + 1
    if (nextIndex < 0 || nextIndex >= sortedLogs.length) return
    const next = [...sortedLogs]
    const temp = next[index]
    next[index] = next[nextIndex]
    next[nextIndex] = temp
    setSortedLogs(next)
  }

  async function submitSuspect(id: string) {
    if (cooldown > 0) return
    setSuspectId(id)

    const file = PERSONNEL.find(p => p.id === id)
    if (!file) return

    if (file.isPlanted) {
      // Scramble logs for timeline sorting phase
      const scrambled = [...LOGS_TO_SORT].sort(() => Math.random() - 0.5)
      setSortedLogs(scrambled)
      setResult('timeline')
    } else {
      setResult('wrong')
      setCooldown(120)
    }
  }

  async function verifyTimeline() {
    const isCorrect = sortedLogs.every((log, index) => log.id === `l${index + 1}`)
    if (isCorrect) {
      setResult('correct')
      const file = PERSONNEL.find(p => p.id === suspectId)
      const lines = [
        `> CHRONOLOGY VALIDATED. MAIN DATABASE INTEGRITY RESTORED.`,
        `> CROSS-REFERENCING ${file?.name ?? 'SUSPECT'}...`,
        `> CHECKING ASSIGNMENT DATE...`,
        '  ⚠ DATE ANOMALY: ASSIGNED 7 DAYS AFTER CONTAINMENT ENDED',
        `> CHECKING TEAM DESIGNATION...`,
        '  ⚠ CLEARANCE MISMATCH: BRAVO CLEARANCE, ALPHA ASSIGNMENT',
        `> CHECKING VERIFICATION NOTE...`,
        '  ⚠ REFERENCE TO DAY 22: INCIDENT CONCLUDED DAY 19',
        `> CONCLUSION: FILE IS FABRICATED`,
        `> OPERATIVE ${file?.name.split(' ')[1] ?? 'WARD'} DOES NOT EXIST IN PRIOR DATABASES`,
        '> IDENTITY: DISTORTED',
        '> CLASSIFIED BYPASS PATH METHOD ENCRYPTED.',
        '> CIPHERTEXT DATA: MRJMPXVEXI',
        '> DECRYPTION ALGORITHM: SHIFT EACH CHARACTER BACKWARD BY 4 (CAESAR)',
      ]
      for (let i = 0; i < lines.length; i++) {
        await new Promise(r => setTimeout(r, 450))
        setRevealLines(prev => [...prev, lines[i]])
      }
      onSolved()
    } else {
      setTimelineError('CHRONOLOGY CHECK SUM ERROR: Temporal discrepancy detected in sequence.')
      triggerErrorShake()
      setTimeout(() => setTimelineError(''), 3000)
    }
  }

  return (
    <div className={styles.dossierContainer}>
      {result === 'correct' && (
        <div className={styles.crtTerminal}>
          <div className={styles.crtScanlines} />
          <div className={styles.terminalOutput}>
            {revealLines.map((line, i) => (
              <p key={i} className={line.includes('⚠') ? styles.anomalyLine : ''}>
                {line}
              </p>
            ))}
          </div>
        </div>
      )}

      {result === 'timeline' && (
        <div style={{
          background: 'rgba(18, 16, 10, 0.4)',
          border: '1px solid #3a3020',
          padding: '1.5rem',
          borderRadius: '4px',
          fontFamily: 'var(--font-mono, monospace)',
          textAlign: 'left'
        }}>
          <h3 style={{ color: 'var(--accent-gold)', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>
            CRITICAL DATABASE TIMELINE RECONSTRUCTION
          </h3>
          <p style={{ color: '#8a8070', fontSize: '0.7rem', lineHeight: '1.4', marginBottom: '1rem' }}>
            Warning: The suspect file has scrambled security timestamps. Sort these 7 events chronologically in the timeline (earliest Day to latest Day) to stabilize the records.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.2rem' }}>
            {sortedLogs.map((log, idx) => (
              <div key={log.id} style={{
                background: '#070705',
                border: '1px solid #2d2420',
                padding: '0.6rem 0.8rem',
                fontSize: '0.7rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem'
              }}>
                <div style={{ color: '#c8bca8', flex: 1 }}>{log.text}</div>
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  <button
                    type="button"
                    onClick={() => moveLog(idx, 'up')}
                    disabled={idx === 0}
                    style={{
                      background: '#15120e',
                      border: '1px solid #3a3020',
                      color: idx === 0 ? '#444' : '#e8c060',
                      cursor: idx === 0 ? 'not-allowed' : 'pointer',
                      padding: '2px 6px',
                      fontSize: '0.6rem',
                    }}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => moveLog(idx, 'down')}
                    disabled={idx === sortedLogs.length - 1}
                    style={{
                      background: '#15120e',
                      border: '1px solid #3a3020',
                      color: idx === sortedLogs.length - 1 ? '#444' : '#e8c060',
                      cursor: idx === sortedLogs.length - 1 ? 'not-allowed' : 'pointer',
                      padding: '2px 6px',
                      fontSize: '0.6rem',
                    }}
                  >
                    ▼
                  </button>
                </div>
              </div>
            ))}
          </div>

          {timelineError && (
            <p style={{ color: 'var(--warning-red)', fontSize: '0.7rem', margin: '0 0 1rem 0' }}>
              {timelineError}
            </p>
          )}

          <button
            type="button"
            onClick={verifyTimeline}
            style={{
              background: 'var(--accent-gold)',
              border: 'none',
              color: '#1a1205',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              padding: '0.6rem 1.2rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono, monospace)',
            }}
          >
            VERIFY CHRONOLOGY
          </button>
        </div>
      )}

      {result !== 'correct' && result !== 'timeline' && (
        <>
          {cooldown > 0 && (
            <div className={styles.cooldownBanner}>
              WRONG SUSPECT. Cooldown: {cooldown}s before next submission.
            </div>
          )}

          <div className={styles.personnelGrid}>
            {PERSONNEL.map(file => {
              const isExpanded = expandedCards.includes(file.id)
              return (
                <div
                  key={file.id}
                  className={`${styles.personnelCard} ${isExpanded ? styles.personnelCardExpanded : ''} ${suspectId === file.id && result === 'wrong' ? styles.personnelCardWrong : ''}`}
                >
                  <div className={styles.personnelCardHeader} onClick={() => toggleExpand(file.id)}>
                    <strong>{file.name}</strong>
                    <span className={styles.personnelCodename}>{file.codename}</span>
                  </div>
                  {isExpanded && (
                    <div className={styles.personnelCardBody}>
                      <dl>
                        <div><dt>Clearance</dt><dd>{file.clearance}</dd></div>
                        <div><dt>Assignment Date</dt><dd>{file.assignmentDate}</dd></div>
                        <div><dt>Team</dt><dd>{file.team}</dd></div>
                        <div><dt>Status</dt><dd style={{ color: file.status.includes('MISSING') || file.status.includes('QUARANTINED') ? '#ff5555' : '#4aff4a' }}>{file.status}</dd></div>
                        {file.symptoms && <div><dt>Observed Symptoms</dt><dd style={{ color: '#ffbbbb' }}>{file.symptoms}</dd></div>}
                        <div><dt>Verification Log</dt><dd>{file.verificationNote}</dd></div>
                        <div style={{ display: 'block', borderBottom: 'none', padding: '0.6rem 0 0 0', marginTop: '0.5rem', borderTop: '1px dashed #3a3020' }}>
                          <dt style={{ color: 'var(--accent-gold)', marginBottom: '0.25rem', textAlign: 'left' }}>Dossier Notes</dt>
                          <dd style={{ color: '#aaa08f', textIndent: '0', textAlign: 'left', lineHeight: '1.4', fontSize: '0.68rem' }}>{file.dossierNotes}</dd>
                        </div>
                      </dl>
                      <button
                        className={styles.suspectBtn}
                        onClick={(e) => { e.stopPropagation(); submitSuspect(file.id) }}
                        disabled={cooldown > 0}
                      >
                        {cooldown > 0 ? `COOLDOWN ${cooldown}s` : 'SUBMIT AS SUSPECT'}
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <p className={styles.dossierHint}>
            Click a card to expand. Two cards can be open for comparison.
            <br />
            Cross-reference details carefully. One of these files was planted.
          </p>
        </>
      )}
    </div>
  )
}

