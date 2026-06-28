'use client'

import { useState } from 'react'

interface RecoveryKeyModalProps {
  isOpen: boolean
  onClose: () => void
  onVerified: () => void
}

export function RecoveryKeyModal({ isOpen, onClose, onVerified }: RecoveryKeyModalProps) {
  const [recoveryKey, setRecoveryKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  if (!isOpen) return null

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (!recoveryKey.trim()) return

    setLoading(true)
    setStatus('idle')
    setMessage('')

    try {
      const res = await fetch('/hunt/case-07/api/transmissions/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recoveryKey: recoveryKey.trim() }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setStatus('success')
        setMessage('ACCESS GRANTED. VERIFYING SECURED DATA INTEGRITY...')
        setTimeout(() => {
          onVerified()
          onClose()
        }, 1800)
      } else {
        setStatus('error')
        setMessage(data.message || 'Verification key rejected. Checksum mismatch.')
      }
    } catch (err) {
      console.error('Verify endpoint error:', err)
      setStatus('error')
      setMessage('Security network connection failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 4, 3, 0.9)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
    }}>
      <div style={{
        background: '#0a0806',
        border: status === 'success' ? '2px solid #4aff4a' : status === 'error' ? '2px solid #ff4444' : '1px solid #3a3020',
        padding: '2.5rem',
        maxWidth: '450px',
        width: '90%',
        fontFamily: 'var(--font-mono, monospace)',
        boxShadow: status === 'success' ? '0 0 35px rgba(74,255,74,0.15)' : '0 0 25px rgba(0,0,0,0.8)',
        position: 'relative',
      }}>
        {/* CRT Scanline */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.2) 50%)',
          backgroundSize: '100% 4px',
          pointerEvents: 'none',
          opacity: 0.3,
        }} />

        <h3 style={{
          color: status === 'success' ? '#4aff4a' : status === 'error' ? '#ff4444' : '#b8862a',
          marginTop: 0,
          fontSize: '1rem',
          letterSpacing: '0.1em',
          borderBottom: '1px solid #3a3020',
          paddingBottom: '0.6rem',
        }}>
          {status === 'success' ? '🔓 DECRYPTION COMPLETE' : status === 'error' ? '☠ ACCESS DENIED' : '🔑 DECRYPTION TERMINAL'}
        </h3>

        <p style={{ color: '#8a8070', fontSize: '0.75rem', lineHeight: 1.5, margin: '1rem 0' }}>
          Input the recovered recovery key string.
          Example format: <code style={{ color: '#aaa08f' }}>XXXX-XXXXXX-XXXX</code>
        </p>

        <form onSubmit={handleVerify}>
          <input
            type="text"
            disabled={loading || status === 'success'}
            value={recoveryKey}
            onChange={e => setRecoveryKey(e.target.value)}
            placeholder="XXXX-XXXXXX-XXXX"
            autoComplete="off"
            required
            style={{
              width: '100%',
              background: '#050505',
              border: '1px solid #3a3020',
              color: status === 'success' ? '#4aff4a' : '#c8c0b0',
              padding: '0.8rem',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.9rem',
              letterSpacing: '0.05em',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />

          <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
            <button
              type="submit"
              disabled={loading || status === 'success'}
              style={{
                flex: 1,
                background: status === 'success' ? '#2d5933' : '#b8862a',
                border: 'none',
                color: '#1a1205',
                padding: '0.7rem',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                cursor: loading || status === 'success' ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'DETERMINING INTEGRITY...' : status === 'success' ? 'VERIFIED ✓' : 'VALIDATE KEY'}
            </button>
            
            <button
              type="button"
              onClick={onClose}
              disabled={loading || status === 'success'}
              style={{
                background: 'transparent',
                border: '1px solid #3a3020',
                color: '#8a8070',
                padding: '0.7rem 1.2rem',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              CANCEL
            </button>
          </div>
        </form>

        {message && (
          <p style={{
            color: status === 'success' ? '#4aff4a' : '#ff4444',
            fontSize: '0.7rem',
            marginTop: '1rem',
            lineHeight: 1.4,
            textAlign: 'center'
          }}>
            {status === 'success' ? '✓' : '⚠'} {message}
          </p>
        )}
      </div>
    </div>
  )
}

