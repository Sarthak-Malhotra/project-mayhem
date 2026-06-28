import { Resend } from 'resend'
import fs from 'fs'
import path from 'path'

let resendInstance: Resend | null = null
let cachedApiKey: string | undefined = undefined

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    resendInstance = null
    cachedApiKey = undefined
    return null
  }
  if (apiKey !== cachedApiKey) {
    cachedApiKey = apiKey
    resendInstance = new Resend(apiKey)
  }
  return resendInstance
}

interface SendEmailParams {
  to: string
  subject: string
  html: string
  text: string
}

export async function sendClassifiedEmail({
  to,
  subject,
  html,
  text,
}: SendEmailParams): Promise<{ success: boolean; id?: string; error?: string; method: 'resend' | 'local_log' }> {
  const from = process.env.EMAIL_FROM || 'PROJECT NULL <onboarding@resend.dev>'
  const client = getResendClient()

  // If Resend API is configured, use it
  if (client) {
    try {
      const response = await client.emails.send({
        from,
        to,
        subject,
        html,
        text,
      })

      if (response.error) {
        console.error('Resend delivery failed:', response.error)
        return { success: false, error: response.error.message, method: 'resend' }
      }

      return { success: true, id: response.data?.id, method: 'resend' }
    } catch (err: any) {
      console.error('Exception during Resend transmission:', err)
      return { success: false, error: err.message || String(err), method: 'resend' }
    }
  }

  // Fallback: Local log writing for offline / demo mode
  try {
    const logDir = path.join(process.cwd(), 'artifacts')
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true })
    }
    const logFilePath = path.join(logDir, 'sent_emails.log')
    const logEntry = `
========================================
TIMESTAMP: ${new Date().toISOString()}
TO: ${to}
FROM: ${from}
SUBJECT: ${subject}
----------------------------------------
[HTML CONTENT]:
${html}

[TEXT CONTENT]:
${text}
========================================
\n`
    fs.appendFileSync(logFilePath, logEntry, 'utf-8')
    console.log('\n[LOCAL EMAIL SIMULATOR] Email logged to artifacts/sent_emails.log:\n', logEntry)
    
    return { success: true, id: 'simulated-resend-id-' + Math.random().toString(36).substr(2, 9), method: 'local_log' }
  } catch (err: any) {
    console.error('Failed to log email to local artifacts:', err)
    return { success: false, error: err.message || String(err), method: 'local_log' }
  }
}
