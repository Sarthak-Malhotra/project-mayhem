/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from 'next/headers'
import { isDbAvailable, db } from '@/db'
import { users, timelineProgress, puzzleEvents, fragments, leaderboard } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { timelines } from './timelines'
import crypto from 'crypto'

export interface SessionData {
  userId: string
  name: string
  email: string
  integrity: number
  recovered: string[] // List of timeline IDs that have recovered their fragment
  hints: number
  wrongAttempts: Record<string, number> // timelineId -> count of wrong answers
}

const DEFAULT_DEMO_STATE: SessionData = {
  userId: 'demo-agent-uuid',
  name: 'Demo Agent',
  email: 'agent@aetherion.org',
  integrity: 100,
  recovered: [],
  hints: 0,
  wrongAttempts: {},
}

const SESSION_SECRET = process.env.SESSION_SECRET || 'a-very-secure-random-secret-for-cryptic-hunt-default'

function signCookie(value: string): string {
  const hmac = crypto.createHmac('sha256', SESSION_SECRET)
  hmac.update(value)
  const signature = hmac.digest('base64url')
  return `${value}.${signature}`
}

function verifyCookie(cookieValue: string): string | null {
  const parts = cookieValue.split('.')
  if (parts.length !== 2) return null
  const [value, signature] = parts
  const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(value).digest('base64url')
  
  const sigBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)
  if (sigBuffer.length !== expectedBuffer.length) {
    return null
  }
  if (crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return value
  }
  return null
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const rawSessionId = cookieStore.get('auth_session')?.value
  const sessionId = rawSessionId ? verifyCookie(rawSessionId) : null
  
  // Require auth cookie — do not auto-authenticate
  if (!sessionId) {
    return null
  }

  if (!isDbAvailable) {
    // Demo Mode: read state from cookie, or create a default session state
    const demoStateRawSigned = cookieStore.get('aetherion_demo_state')?.value
    const demoStateRaw = demoStateRawSigned ? verifyCookie(demoStateRawSigned) : null
    if (demoStateRaw) {
      try {
        const parsed = JSON.parse(demoStateRaw) as SessionData
        return { ...parsed, userId: sessionId }
      } catch {
        return { ...DEFAULT_DEMO_STATE, userId: sessionId }
      }
    }
    return { ...DEFAULT_DEMO_STATE, userId: sessionId }
  }

  // Live Database Mode: query Drizzle ORM
  try {
    const userRows = await db.select().from(users).where(eq(users.id, sessionId))
    let user = userRows[0]
    
    if (!user) {
      if (sessionId === 'default-agent-uuid' && process.env.NODE_ENV === 'development') {
        // Auto-create default user in database (dev only check)
        await db.insert(users).values({
          id: sessionId,
          name: 'Demo Agent',
          email: 'agent@aetherion.org',
        })
        user = {
          id: sessionId,
          name: 'Demo Agent',
          email: 'agent@aetherion.org',
          createdAt: new Date(),
        }

        // Initialize leaderboard entry if missing
        const lbRows = await db.select().from(leaderboard).where(eq(leaderboard.userId, sessionId))
        if (lbRows.length === 0) {
          await db.insert(leaderboard).values({
            userId: sessionId,
            fragmentCount: 0,
            hintCount: 0,
          })
        }

        // Initialize progress entries if missing
        const progressList = await db.select().from(timelineProgress).where(eq(timelineProgress.userId, sessionId))
        if (progressList.length === 0) {
          for (const t of timelines) {
            await db.insert(timelineProgress).values({
              userId: sessionId,
              timelineId: t.id,
              status: t.id === 'operation-deadlight' ? 'active' : 'locked',
              fragmentRecovered: false,
            })
          }
        }
      } else {
        return null
      }
    }

    // Get recovered fragments
    const recoveredRows = await db.select().from(fragments).where(eq(fragments.userId, sessionId))
    const recovered = recoveredRows.map((r: any) => r.timelineId)

    // Get wrong attempts to calculate integrity
    const events = await db.select().from(puzzleEvents).where(eq(puzzleEvents.userId, sessionId))
    
    const wrongAttempts: Record<string, number> = {}
    events.forEach((e: any) => {
      if (e.outcome === 'wrong') {
        wrongAttempts[e.timelineId] = (wrongAttempts[e.timelineId] || 0) + 1
      }
    })

    // Get leaderboard entry for hints
    const lbEntryRows = await db.select().from(leaderboard).where(eq(leaderboard.userId, sessionId))
    const lbEntry = lbEntryRows[0]
    const hints = lbEntry?.hintCount ?? 0

    // Integrity score: starts at 100, drops by 10 per wrong answer (min 0)
    let totalWrong = 0
    Object.values(wrongAttempts).forEach(count => {
      totalWrong += count
    })
    const integrity = Math.max(0, 100 - totalWrong * 10)

    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      integrity,
      recovered,
      hints,
      wrongAttempts,
    }
  } catch (error) {
    console.error('Database query error in getSession:', error)
    return null
  }
}

export async function setSession(name: string, email: string): Promise<string> {
  const cookieStore = await cookies()
  const newUserId = crypto.randomUUID()
  const isProd = process.env.NODE_ENV === 'production'
  const cookieOptions = { 
    maxAge: 60 * 60 * 24 * 7, 
    path: '/', 
    httpOnly: true, 
    secure: isProd, 
    sameSite: 'lax' as const 
  }

  if (!isDbAvailable) {
    // Demo Mode: save dummy session and state cookies
    const newSessionState: SessionData = {
      ...DEFAULT_DEMO_STATE,
      userId: newUserId,
      name,
      email,
    }
    cookieStore.set('auth_session', signCookie(newUserId), cookieOptions)
    cookieStore.set('aetherion_demo_state', signCookie(JSON.stringify(newSessionState)), cookieOptions)
    return newUserId
  }

  // Live Database Mode
  try {
    // Check if user exists by email
    const userRows = await db.select().from(users).where(eq(users.email, email))
    let user = userRows[0]
    
    if (!user) {
      // Create user
      await db.insert(users).values({
        id: newUserId,
        name,
        email,
      })
      user = { id: newUserId, name, email, createdAt: new Date() }
    }

    // Initialize leaderboard entry if missing
    const lbRows = await db.select().from(leaderboard).where(eq(leaderboard.userId, user.id))
    const lb = lbRows[0]
    if (!lb) {
      await db.insert(leaderboard).values({
        userId: user.id,
        fragmentCount: 0,
        hintCount: 0,
      })
    }

    // Initialize timeline progress for all 9 timelines
    const currentProgress = await db.select().from(timelineProgress).where(eq(timelineProgress.userId, user.id))
    const missingTimelines = timelines.filter(t => !currentProgress.some((p: any) => p.timelineId === t.id))

    if (missingTimelines.length > 0) {
      for (const t of missingTimelines) {
        await db.insert(timelineProgress).values({
          userId: user.id,
          timelineId: t.id,
          status: t.id === 'operation-deadlight' ? 'active' : 'locked',
          fragmentRecovered: false,
        })
      }
    }

    cookieStore.set('auth_session', signCookie(user.id), cookieOptions)
    return user.id
  } catch (error) {
    console.error('Database write error in setSession:', error)
    // Fall back to cookie session if DB write fails
    cookieStore.set('auth_session', signCookie(newUserId), cookieOptions)
    return newUserId
  }
}

export async function saveDemoState(state: SessionData) {
  const cookieStore = await cookies()
  const isProd = process.env.NODE_ENV === 'production'
  const cookieOptions = { 
    maxAge: 60 * 60 * 24 * 7, 
    path: '/', 
    httpOnly: true, 
    secure: isProd, 
    sameSite: 'lax' as const 
  }
  cookieStore.set('aetherion_demo_state', signCookie(JSON.stringify(state)), cookieOptions)
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete('auth_session')
  cookieStore.delete('aetherion_demo_state')
}
