'use client'

class SoundGenerator {
  private ctx: AudioContext | null = null

  private initCtx() {
    try {
      if (typeof window === 'undefined') return
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
        if (AudioCtx) {
          this.ctx = new AudioCtx()
        }
      }
      // Resume context if suspended (browser security autoplays)
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {})
      }
    } catch (e) {
      console.warn('Failed to initialize AudioContext:', e)
    }
  }

  // Soft key click
  playClick() {
    try {
      this.initCtx()
      if (!this.ctx) return

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(1500, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.05)

      gain.gain.setValueAtTime(0.02, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.05)
    } catch (e) {
      console.warn('Audio playClick failed:', e)
    }
  }

  // White noise parchment rustle sweep
  playPageFlip() {
    try {
      this.initCtx()
      if (!this.ctx) return

      const bufferSize = this.ctx.sampleRate * 0.4
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const data = buffer.getChannelData(0)

      // Generate white noise
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }

      const noise = this.ctx.createBufferSource()
      noise.buffer = buffer

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(600, this.ctx.currentTime)
      filter.frequency.exponentialRampToValueAtTime(1500, this.ctx.currentTime + 0.25)
      filter.Q.setValueAtTime(1.0, this.ctx.currentTime)

      const gain = this.ctx.createGain()
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35)

      noise.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)

      noise.start()
      noise.stop(this.ctx.currentTime + 0.4)
    } catch (e) {
      console.warn('Audio playPageFlip failed:', e)
    }
  }

  // Heavy thump + click
  playStamp() {
    try {
      this.initCtx()
      if (!this.ctx) return

      const oscThump = this.ctx.createOscillator()
      const gainThump = this.ctx.createGain()

      // Deep thump
      oscThump.type = 'triangle'
      oscThump.frequency.setValueAtTime(90, this.ctx.currentTime)
      oscThump.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.15)

      gainThump.gain.setValueAtTime(0.3, this.ctx.currentTime)
      gainThump.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2)

      oscThump.connect(gainThump)
      gainThump.connect(this.ctx.destination)

      oscThump.start()
      oscThump.stop(this.ctx.currentTime + 0.2)

      // Metallic click
      const oscClick = this.ctx.createOscillator()
      const gainClick = this.ctx.createGain()

      oscClick.type = 'sine'
      oscClick.frequency.setValueAtTime(2000, this.ctx.currentTime)
      oscClick.frequency.setValueAtTime(800, this.ctx.currentTime + 0.02)

      gainClick.gain.setValueAtTime(0.08, this.ctx.currentTime)
      gainClick.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05)

      oscClick.connect(gainClick)
      gainClick.connect(this.ctx.destination)

      oscClick.start()
      oscClick.stop(this.ctx.currentTime + 0.05)
    } catch (e) {
      console.warn('Audio playStamp failed:', e)
    }
  }

  // Ethereal rising sweep
  playReveal() {
    try {
      this.initCtx()
      if (!this.ctx) return

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(300, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.6)

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 0.2)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.6)
    } catch (e) {
      console.warn('Audio playReveal failed:', e)
    }
  }

  // Pentatonic scale chime
  playSuccess() {
    try {
      this.initCtx()
      if (!this.ctx) return

      const now = this.ctx.currentTime
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99] // C E G C E G
      
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator()
        const gain = this.ctx!.createGain()
        const delay = idx * 0.08

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now + delay)

        gain.gain.setValueAtTime(0.0, now + delay)
        gain.gain.linearRampToValueAtTime(0.08, now + delay + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.45)

        osc.connect(gain)
        gain.connect(this.ctx!.destination)

        osc.start(now + delay)
        osc.stop(now + delay + 0.5)
      })
    } catch (e) {
      console.warn('Audio playSuccess failed:', e)
    }
  }

  // Heavy low double buzz
  playError() {
    try {
      this.initCtx()
      if (!this.ctx) return

      const now = this.ctx.currentTime
      
      const playBuzz = (delay: number) => {
        const osc = this.ctx!.createOscillator()
        const gain = this.ctx!.createGain()

        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(100, now + delay)
        osc.frequency.setValueAtTime(95, now + delay + 0.15)

        gain.gain.setValueAtTime(0.08, now + delay)
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.2)

        osc.connect(gain)
        gain.connect(this.ctx!.destination)

        osc.start(now + delay)
        osc.stop(now + delay + 0.2)
      }

      playBuzz(0)
      playBuzz(0.12)
    } catch (e) {
      console.warn('Audio playError failed:', e)
    }
  }
}

export const sounds = new SoundGenerator()
