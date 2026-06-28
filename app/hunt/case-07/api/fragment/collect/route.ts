import { NextRequest, NextResponse } from 'next/server'
import { getSession, saveDemoState } from '@/app/hunt/case-07/lib/session'
import { isDbAvailable, db } from '@/db'
import { fragments, timelineProgress, leaderboard } from '@/db/schema'
import { and, eq } from 'drizzle-orm'

import { timelines } from '@/app/hunt/case-07/lib/timelines'

const validTimelineIds = new Set(timelines.map(t => t.id))

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ collected: false, message: 'Unauthenticated.' }, { status: 401 })
    }

    const body: unknown = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ collected: false, message: 'Invalid payload.' }, { status: 400 })
    }

    const { timelineId } = body as Record<string, unknown>
    if (typeof timelineId !== 'string' || !validTimelineIds.has(timelineId)) {
      return NextResponse.json({ collected: false, message: 'Invalid timeline ID.' }, { status: 400 })
    }

    if (isDbAvailable) {
      try {
        // 1. Insert into fragments table
        // First check if already collected to prevent duplicates
        const existingRows = await db
          .select()
          .from(fragments)
          .where(and(eq(fragments.userId, session.userId), eq(fragments.timelineId, timelineId)))
        const existing = existingRows[0]

        if (!existing) {
          await db.insert(fragments).values({
            userId: session.userId,
            timelineId: timelineId,
            recoveredAt: new Date(),
            evidenceLogUnlocked: true,
          })
        }

        // 2. Update timelineProgress status
        await db
          .update(timelineProgress)
          .set({
            status: 'completed',
            completedAt: new Date(),
            fragmentRecovered: true,
          })
          .where(and(eq(timelineProgress.userId, session.userId), eq(timelineProgress.timelineId, timelineId)))

        // 3. Update leaderboard
        const allRecovered = await db
          .select()
          .from(fragments)
          .where(eq(fragments.userId, session.userId))
        
        const count = allRecovered.length

        const lbRows = await db
          .select()
          .from(leaderboard)
          .where(eq(leaderboard.userId, session.userId))
        const lb = lbRows[0]

        const isAllDone = count === 9

        if (lb) {
          await db
            .update(leaderboard)
            .set({
              fragmentCount: count,
              completionTimestamp: isAllDone ? new Date() : lb.completionTimestamp,
            })
            .where(eq(leaderboard.userId, session.userId))
        } else {
          await db.insert(leaderboard).values({
            userId: session.userId,
            fragmentCount: count,
            completionTimestamp: isAllDone ? new Date() : null,
          })
        }
      } catch (dbError) {
        console.error('Database error in fragment collection:', dbError)
      }
    } else {
      // Demo Mode: save in session cookie
      if (!session.recovered.includes(timelineId)) {
        session.recovered.push(timelineId)
        await saveDemoState(session)
      }
    }

    return NextResponse.json({ collected: true })
  } catch (error) {
    console.error('Fragment collection API error:', error)
    return NextResponse.json({ collected: false, message: 'Server error collecting fragment.' }, { status: 500 })
  }
}
