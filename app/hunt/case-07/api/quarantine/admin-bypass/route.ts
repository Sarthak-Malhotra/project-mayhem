import { NextRequest, NextResponse } from 'next/server'
import { createHash, timingSafeEqual } from 'node:crypto'

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ valid: false, message: 'Invalid request.' }, { status: 400 })
    }

    const { overrideCode } = body as Record<string, unknown>
    if (typeof overrideCode !== 'string' || !overrideCode.trim()) {
      return NextResponse.json({ valid: false, message: 'Override code is required.' }, { status: 400 })
    }

    const expected = process.env.ADMIN_OVERRIDE_CODE
    if (!expected) {
      console.error('ADMIN_OVERRIDE_CODE not configured in environment variables.')
      return NextResponse.json({ valid: false, message: 'Override system not configured.' }, { status: 500 })
    }

    // Timing-safe comparison to prevent timing attacks
    const inputHash = createHash('sha256').update(overrideCode.trim().toUpperCase()).digest()
    const expectedHash = createHash('sha256').update(expected.trim().toUpperCase()).digest()
    const valid = timingSafeEqual(inputHash, expectedHash)

    return NextResponse.json({ valid })
  } catch (error) {
    console.error('Admin bypass error:', error)
    return NextResponse.json({ valid: false, message: 'Server error.' }, { status: 500 })
  }
}
