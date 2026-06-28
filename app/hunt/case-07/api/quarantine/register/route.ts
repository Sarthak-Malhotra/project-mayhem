import { NextRequest, NextResponse } from 'next/server'
import { setSession } from '@/app/hunt/case-07/lib/session'
import { sendEmail } from '@/app/hunt/case-07/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, message: 'Invalid payload.' }, { status: 400 })
    }

    const { residentId, email, sector } = body as Record<string, unknown>
    if (
      typeof residentId !== 'string' ||
      !residentId.trim() ||
      typeof email !== 'string' ||
      !email.trim() ||
      typeof sector !== 'string' ||
      !sector.trim()
    ) {
      return NextResponse.json({ success: false, message: 'Resident ID, Email and Sector are required.' }, { status: 400 })
    }

    const trimmedId = residentId.trim()
    const trimmedEmail = email.trim().toLowerCase()
    const trimmedSector = sector.trim()

    // 1. Save user session (registers the user in the database or cookies)
    const userId = await setSession(trimmedId, trimmedEmail)

    // 2. Prepare the themed email contents — multi-step data packet puzzle
    const emailSubject = `[PROJECT NULL] INTERCEPTED DATA PACKETS — SITE KENNEDY CLASSIFICATION REQUIRED`
    
    const emailText = `PROJECT NULL // INTERCEPTED DATA PACKETS // SITE KENNEDY
----------------------------------------------------------------------
RECOVERY AGENT ${trimmedId} — SECTOR: ${trimmedSector}

Your registration has been logged. To bypass the quarantine checkpoint 
and access Level IX of the Archive, you must decode the classification 
code of the biological organism at Site Kennedy.

6 encoded data packets were intercepted from the organism's neural 
network. Each packet uses a different encoding method and contains a 
single number.

STEP 1: Decode each packet to its decimal value.
STEP 2: Map each decimal to its position in the alphabet (1=A, 2=B, ... 26=Z).
STEP 3: Compile the 6 letters in order to form the classification code.

----------------------------------------------------------------------

PACKET 1 — BINARY ENCODING (Base-2)
Data: 00010000
Method: Standard 8-bit unsigned binary.
Each bit position represents a power of 2: (128, 64, 32, 16, 8, 4, 2, 1).
Add up the positions where a '1' appears.

PACKET 2 — HEXADECIMAL ENCODING (Base-16)
Data: 0x0C
Method: Base-16 number system. 
Digits: 0-9 then A=10, B=11, C=12, D=13, E=14, F=15.
Convert to decimal.

PACKET 3 — OCTAL ENCODING (Base-8)
Data: 01
Method: Base-8 number system.
Each digit represents a power of 8. Convert to decimal.

PACKET 4 — BASE64 ENCODING
Data: Bw==
Method: Base64 decodes to raw bytes. 
Decode "Bw==" to get a single byte. The byte's decimal value is your number.
Technical hint: 'B' in Base64 = index 1, 'w' = index 48. Combined: (1 << 2) | (48 >> 4) = 7.

PACKET 5 — ASCII ARITHMETIC
Data: chr(66) - chr(65)
Method: ASCII character code subtraction.
Look up the ASCII decimal values of the characters, then subtract.
'A' = 65, 'B' = 66, 'C' = 67, etc.

PACKET 6 — BINARY XOR OPERATION
Data: 11001 XOR 01010
Method: Perform bitwise XOR on the two 5-bit binary numbers, 
then convert the result to decimal.
XOR rule: same bits = 0, different bits = 1.

----------------------------------------------------------------------
REFERENCE TABLE: 
A=1  B=2  C=3  D=4  E=5  F=6  G=7  H=8  I=9  J=10 K=11 L=12 M=13
N=14 O=15 P=16 Q=17 R=18 S=19 T=20 U=21 V=22 W=23 X=24 Y=25 Z=26
----------------------------------------------------------------------

CONFIDENTIALITY NOTICE: This transmission is classified under PROJECT NULL.
SITE Command HQ // 1996`

    const emailHtml = `
      <div style="background-color: #050505; color: #c8c0b0; font-family: 'Courier New', Courier, monospace; padding: 24px; border: 1px solid #1a4a1a; max-width: 640px; margin: 0 auto;">
        <h2 style="color: #4aff4a; border-bottom: 2px solid #1a4a1a; padding-bottom: 10px; margin-top: 0;">
          PROJECT NULL // INTERCEPTED DATA PACKETS
        </h2>
        <p style="color: #ff4444; font-weight: bold;">
          &#9888; CLASSIFIED TRANSMISSION — SITE KENNEDY QUARANTINE
        </p>
        <p>
          Recovery Agent <strong style="color: #fff;">${trimmedId}</strong> — Sector: <strong>${trimmedSector}</strong>
        </p>
        <p style="margin: 16px 0; line-height: 1.5;">
          6 encoded data packets were intercepted from the organism&apos;s neural network. Each packet uses a different encoding method and contains a single number.
        </p>
        
        <div style="background-color: #0a0a0a; border: 1px solid #3a3020; padding: 12px; margin: 16px 0;">
          <p style="color: #b8862a; font-weight: bold; margin-top: 0;">INSTRUCTIONS:</p>
          <p style="margin: 4px 0;">1. Decode each packet to its <strong style="color: #e8c060;">decimal value</strong>.</p>
          <p style="margin: 4px 0;">2. Map each decimal to the alphabet (<span style="color: #e8c060;">1=A, 2=B, ... 26=Z</span>).</p>
          <p style="margin: 4px 0;">3. Compile the 6 letters in packet order to form the <strong style="color: #e8c060;">classification code</strong>.</p>
        </div>

        <div style="background-color: #080806; border-left: 3px solid #1a4a1a; padding: 12px; margin: 12px 0;">
          <h4 style="color: #4aff4a; margin: 0 0 6px 0;">PACKET 1 — BINARY (Base-2)</h4>
          <code style="color: #e8c060; font-size: 1.1rem;">00010000</code>
          <p style="color: #8a8070; font-size: 0.85rem; margin: 6px 0 0 0;">
            Standard 8-bit binary. Bit positions: (128, 64, 32, 16, 8, 4, 2, 1). Sum the positions where &apos;1&apos; appears.
          </p>
        </div>

        <div style="background-color: #080806; border-left: 3px solid #1a3a5a; padding: 12px; margin: 12px 0;">
          <h4 style="color: #aaccff; margin: 0 0 6px 0;">PACKET 2 — HEXADECIMAL (Base-16)</h4>
          <code style="color: #e8c060; font-size: 1.1rem;">0x0C</code>
          <p style="color: #8a8070; font-size: 0.85rem; margin: 6px 0 0 0;">
            Base-16 digits: 0-9, then A=10, B=11, C=12, D=13, E=14, F=15. Convert to decimal.
          </p>
        </div>

        <div style="background-color: #080806; border-left: 3px solid #5a1a5a; padding: 12px; margin: 12px 0;">
          <h4 style="color: #cc88ff; margin: 0 0 6px 0;">PACKET 3 — OCTAL (Base-8)</h4>
          <code style="color: #e8c060; font-size: 1.1rem;">01</code>
          <p style="color: #8a8070; font-size: 0.85rem; margin: 6px 0 0 0;">
            Base-8 number system. Each digit represents powers of 8. Convert to decimal.
          </p>
        </div>

        <div style="background-color: #080806; border-left: 3px solid #5a3a1a; padding: 12px; margin: 12px 0;">
          <h4 style="color: #ffaa44; margin: 0 0 6px 0;">PACKET 4 — BASE64</h4>
          <code style="color: #e8c060; font-size: 1.1rem;">Bw==</code>
          <p style="color: #8a8070; font-size: 0.85rem; margin: 6px 0 0 0;">
            Base64 decodes to raw bytes. Decode &quot;Bw==&quot; to get a single byte, then read its decimal value.<br />
            <span style="color: #6a6050;">Technical hint: &apos;B&apos; = index 1, &apos;w&apos; = index 48. Combined: (1 &lt;&lt; 2) | (48 &gt;&gt; 4) = 7.</span>
          </p>
        </div>

        <div style="background-color: #080806; border-left: 3px solid #1a5a1a; padding: 12px; margin: 12px 0;">
          <h4 style="color: #44ff88; margin: 0 0 6px 0;">PACKET 5 — ASCII ARITHMETIC</h4>
          <code style="color: #e8c060; font-size: 1.1rem;">chr(66) - chr(65)</code>
          <p style="color: #8a8070; font-size: 0.85rem; margin: 6px 0 0 0;">
            ASCII character code subtraction. Look up the decimal values: &apos;A&apos;=65, &apos;B&apos;=66, &apos;C&apos;=67, etc. Subtract.
          </p>
        </div>

        <div style="background-color: #080806; border-left: 3px solid #5a1a1a; padding: 12px; margin: 12px 0;">
          <h4 style="color: #ff6644; margin: 0 0 6px 0;">PACKET 6 — BINARY XOR</h4>
          <code style="color: #e8c060; font-size: 1.1rem;">11001 XOR 01010</code>
          <p style="color: #8a8070; font-size: 0.85rem; margin: 6px 0 0 0;">
            Bitwise XOR on two 5-bit numbers, then convert result to decimal.<br />
            XOR rule: same bits &rarr; 0, different bits &rarr; 1.
          </p>
        </div>

        <div style="background-color: #0c0c0c; border: 1px dashed #3a3020; padding: 12px; margin: 20px 0;">
          <p style="color: #b8862a; font-weight: bold; margin-top: 0; font-size: 0.85rem;">ALPHABET REFERENCE:</p>
          <code style="color: #8a8070; font-size: 0.75rem; line-height: 1.6;">
            A=1 &nbsp; B=2 &nbsp; C=3 &nbsp; D=4 &nbsp; E=5 &nbsp; F=6 &nbsp; G=7 &nbsp; H=8 &nbsp; I=9 &nbsp; J=10 &nbsp; K=11 &nbsp; L=12 &nbsp; M=13<br />
            N=14 &nbsp; O=15 &nbsp; P=16 &nbsp; Q=17 &nbsp; R=18 &nbsp; S=19 &nbsp; T=20 &nbsp; U=21 &nbsp; V=22 &nbsp; W=23 &nbsp; X=24 &nbsp; Y=25 &nbsp; Z=26
          </code>
        </div>

        <p style="color: #6a6050; font-size: 0.8rem; border-top: 1px solid #1a4a1a; padding-top: 15px; margin-top: 30px;">
          CONFIDENTIALITY NOTICE: Classified under PROJECT NULL. Unauthorized forwarding will trigger credential termination.<br />
          <strong>SITE Command HQ // 1996</strong>
        </p>
      </div>
    `

    // 3. Send email asynchronously to not block API response
    // We await it here but catch errors inside sendEmail so it doesn't crash
    const sendResult = await sendEmail({
      to: trimmedEmail,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    })

    return NextResponse.json({
      success: true,
      userId,
      emailSent: sendResult.success,
      emailMethod: sendResult.method,
    })
  } catch (error) {
    console.error('Quarantine registration error:', error)
    return NextResponse.json({ success: false, message: 'Server error during quarantine registration.' }, { status: 500 })
  }
}
