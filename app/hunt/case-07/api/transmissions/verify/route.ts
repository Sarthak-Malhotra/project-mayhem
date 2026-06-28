import { NextRequest, NextResponse } from 'next/server'
import { isDbAvailable, db } from '@/db'
import { emailTransmissions } from '@/db/schema'
import { mockTransmissions } from '@/app/hunt/case-07/lib/mockDb'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, message: 'Invalid payload.' }, { status: 400 })
    }

    const { recoveryKey } = body as Record<string, unknown>
    if (typeof recoveryKey !== 'string' || !recoveryKey.trim()) {
      return NextResponse.json({ success: false, message: 'Recovery key is required.' }, { status: 400 })
    }

    const cleanedKey = recoveryKey.trim().toUpperCase()

    if (isDbAvailable) {
      const records = await db
        .select()
        .from(emailTransmissions)
        .where(eq(emailTransmissions.recoveryKey, cleanedKey))
      
      const record = records[0]
      if (!record) {
        return NextResponse.json({ success: false, message: 'Invalid recovery key.' }, { status: 404 })
      }

      await db
        .update(emailTransmissions)
        .set({
          isVerified: true,
          verifiedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(emailTransmissions.id, record.id))

      return NextResponse.json({ success: true })
    } else {
      // Offline/Mock store search
      const record = Array.from(mockTransmissions.values()).find(
        t => t.recoveryKey === cleanedKey
      )

      if (!record) {
        return NextResponse.json({ success: false, message: 'Invalid recovery key.' }, { status: 404 })
      }

      mockTransmissions.set(record.id, {
        ...record,
        isVerified: true,
        verifiedAt: new Date(),
        updatedAt: new Date(),
      })

      return NextResponse.json({ success: true })
    }
  } catch (error: any) {
    console.error('Verify API error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error.' },
      { status: 500 }
    )
  }
}
