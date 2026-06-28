import { NextRequest, NextResponse } from 'next/server'
import { sendClassifiedEmail } from '@/app/hunt/case-07/lib/resend'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const to = searchParams.get('to')

    if (!to) {
      return NextResponse.json(
        { success: false, message: 'Please provide a "to" email address in the query parameters (e.g., ?to=agent@example.com).' },
        { status: 400 }
      )
    }

    const cleanedEmail = to.trim().toLowerCase()
    const testSubject = `[TEST] Resend Integration Verification`
    const testHtml = `
      <div style="background-color: #050505; color: #c8c0b0; font-family: 'Courier New', Courier, monospace; padding: 24px; border: 1px solid #1a4a1a; max-width: 640px; margin: 0 auto;">
        <h2 style="color: #4aff4a; border-bottom: 2px solid #1a4a1a; padding-bottom: 10px; margin-top: 0;">
          PROJECT NULL // RESEND TEST
        </h2>
        <p style="color: #b8862a; font-weight: bold;">
          ⚡ CONNECTION VERIFICATION SUCCESSFUL ⚡
        </p>
        <p>
          If you are reading this email, the Resend integration is working perfectly.
        </p>
        <p style="margin: 16px 0; line-height: 1.5; color: #8a8070;">
          Timestamp: ${new Date().toISOString()}<br />
          Sender: ${process.env.EMAIL_FROM || 'onboarding@resend.dev (Default)'}<br />
          API Key Loaded: ${process.env.RESEND_API_KEY ? 'YES (Starts with ' + process.env.RESEND_API_KEY.substring(0, 6) + '...)' : 'NO (Simulator Fallback Active)'}
        </p>
        <p style="color: #6a6050; font-size: 0.8rem; border-top: 1px solid #1a4a1a; padding-top: 15px; margin-top: 30px;">
          CONFIDENTIALITY NOTICE: SITE Command HQ // 1996
        </p>
      </div>
    `
    const testText = `
PROJECT NULL // RESEND TEST
----------------------------------------------------------------------
If you are receiving this, the Resend integration works!

Timestamp: ${new Date().toISOString()}
Sender: ${process.env.EMAIL_FROM || 'onboarding@resend.dev (Default)'}
API Key Loaded: ${process.env.RESEND_API_KEY ? 'YES' : 'NO (Simulator Fallback Active)'}
    `.trim()

    const delivery = await sendClassifiedEmail({
      to: cleanedEmail,
      subject: testSubject,
      html: testHtml,
      text: testText,
    })

    return NextResponse.json({
      success: delivery.success,
      method: delivery.method,
      id: delivery.id || null,
      error: delivery.error || null,
      message: delivery.success
        ? (delivery.method === 'resend' ? 'Email sent successfully via Resend API!' : 'Email logged to local simulation log (no Resend API key configured).')
        : 'Failed to deliver test email.'
    })
  } catch (error: any) {
    console.error('Test email API error:', error)
    return NextResponse.json(
      { success: false, error: error.message || String(error) },
      { status: 500 }
    )
  }
}
