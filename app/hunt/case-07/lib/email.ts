import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

interface EmailOptions {
  to: string
  subject: string
  text: string
  html?: string
}

export async function sendEmail({ to, subject, text, html }: EmailOptions): Promise<{ success: boolean; method: string; error?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const emailFrom = process.env.EMAIL_FROM || 'PROJECT NULL <noreply@aetherion.org>'

  // 1. Resend API Method
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: emailFrom,
          to,
          subject,
          text,
          html: html || text.replace(/\n/g, '<br />'),
        }),
      })

      if (res.ok) {
        return { success: true, method: 'resend' }
      } else {
        const errorText = await res.text()
        console.error('Resend API failed:', errorText)
        return { success: false, method: 'resend', error: errorText }
      }
    } catch (err: any) {
      console.error('Error sending via Resend:', err)
      return { success: false, method: 'resend', error: err.message || String(err) }
    }
  }

  // 2. Nodemailer SMTP Method
  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort || '587'),
        secure: smtpPort === '465',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })

      await transporter.sendMail({
        from: emailFrom,
        to,
        subject,
        text,
        html: html || text.replace(/\n/g, '<br />'),
      })

      return { success: true, method: 'smtp' }
    } catch (err: any) {
      console.error('Error sending via SMTP:', err)
      return { success: false, method: 'smtp', error: err.message || String(err) }
    }
  }

  // 3. Fallback/Local Log Method (Offline / Dev environment)
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
SUBJECT: ${subject}
----------------------------------------
${text}
========================================
\n`
    fs.appendFileSync(logFilePath, logEntry, 'utf-8')
    console.log('\n[LOCAL EMAIL SIMULATOR] Email logged to artifacts/sent_emails.log:\n', logEntry)
    return { success: true, method: 'local_log' }
  } catch (err: any) {
    console.error('Error writing fallback email log:', err)
    return { success: false, method: 'local_log', error: err.message || String(err) }
  }
}
