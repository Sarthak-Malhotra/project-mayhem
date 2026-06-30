import { NextRequest, NextResponse } from 'next/server'
import { createHash, timingSafeEqual } from 'node:crypto'
import { getClientIp, isRateLimited, verifyCsrf } from '@/app/hunt/case-07/lib/rateLimit'

export async function POST(request: NextRequest) {
  try {
    // 1. CSRF validation
    if (!verifyCsrf(request)) {
      return NextResponse.json({ valid: false, message: 'CSRF validation failed.' }, { status: 403 })
    }

    // 2. IP-based rate limiting (Max 5 attempts per 10 minutes)
    const ip = getClientIp(request)
    if (isRateLimited(ip, 5, 10 * 60 * 1000, 'admin-bypass')) {
      return NextResponse.json(
        { valid: false, message: 'Too many bypass attempts. Please try again later.' },
        { status: 429 }
      )
    }

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
