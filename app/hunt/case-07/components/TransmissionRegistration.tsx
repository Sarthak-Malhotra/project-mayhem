'use client'

import { useState } from 'react'
import styles from '../operation-deadlight.module.css'

interface TransmissionRegistrationProps {
  onSuccess: (name: string, email: string, sector: string) => void
}

export function TransmissionRegistration({ onSuccess }: TransmissionRegistrationProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [sector, setSector] = useState('A-BLOCK')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !sector.trim()) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/hunt/case-07/api/transmissions/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          sector: sector.trim(),
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        onSuccess(name.trim(), email.trim(), sector.trim())
      } else {
        setError(data.message || 'Verification registration failed.')
      }
    } catch (err: any) {
      console.error('Registration send error:', err)
      setError('Connection to security mainframe lost. Retry transmission.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.crtTerminal}>
      <div className={styles.crtScanlines} />
      <div className={styles.crtHeader}>
        <p>SITE KENNEDY — CLASSIFIED TRANSMISSION REGISTRATION</p>
        <p>GOVERNMENT CLEARANCE LEVEL II REQUIRED</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.registrationForm}>
        <div className={styles.formField}>
          <label htmlFor="resident-name">RECOVERY AGENT ID (NAME)</label>
          <input
            id="resident-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter Agent Name..."
            autoComplete="off"
            required
            disabled={loading}
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="resident-email">SECURED ROUTING EMAIL</label>
          <input
            id="resident-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="agent@aetherion.org"
            autoComplete="off"
            required
            disabled={loading}
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="resident-sector">SECTOR COORDINATES</label>
          <select
            id="resident-sector"
            value={sector}
            onChange={e => setSector(e.target.value)}
            disabled={loading}
          >
            <option value="A-BLOCK">A-BLOCK (LABS)</option>
            <option value="B-BLOCK">B-BLOCK (ADMIN)</option>
            <option value="C-BLOCK">C-BLOCK (CONTAINMENT)</option>
          </select>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'DISPATCHING DIRECTIVE...' : 'SUBMIT FOR VERIFICATION'}
        </button>

        {error && (
          <p style={{
            color: '#ff4444',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.7rem',
            marginTop: '0.5rem',
            textAlign: 'center'
          }}>
            ⚠ {error}
          </p>
        )}

        <p className={styles.formWarning}>⚠ Warning: All unauthorized registration requests are logged and prosecuted.</p>
      </form>
    </div>
  )
}

