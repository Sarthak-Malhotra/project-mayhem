import { NextRequest, NextResponse } from 'next/server'
import { setSession, clearSession } from '@/app/hunt/case-07/lib/session'

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, message: 'Invalid payload.' }, { status: 400 })
    }

    const { name, email } = body as Record<string, unknown>
    if (typeof name !== 'string' || !name.trim() || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json({ success: false, message: 'Name and Email are required.' }, { status: 400 })
    }

    const userId = await setSession(name.trim(), email.trim().toLowerCase())
    return NextResponse.json({ success: true, userId })
  } catch (error) {
    console.error('Session API error:', error)
    return NextResponse.json({ success: false, message: 'Server error setting session.' }, { status: 500 })
  }
}

export async function DELETE() {
  await clearSession()
  return NextResponse.json({ success: true })
}
