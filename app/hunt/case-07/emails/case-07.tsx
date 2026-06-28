import * as React from 'react'
import { Html, Head, Body, Container, Section, Text, Heading, Hr } from '@react-email/components'

interface DeadlightTransmissionEmailProps {
  name: string
  sector: string
  recoveryKey: string
}

export const DeadlightTransmissionEmail = ({
  name = 'RECOVERY AGENT',
  sector = 'DELTA',
  recoveryKey = 'NULL-PLAGAS-7412',
}: DeadlightTransmissionEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Text style={warningBanner}>⚡ WARNING: AUTHORIZED DIRECTIVE ONLY ⚡</Text>
            <Heading style={headerTitle}>CASE FILE 07 — OPERATION DEADLIGHT</Heading>
            <Text style={classification}>CLASSIFICATION: RESTRICTED // SITE KENNEDY ARCHIVES</Text>
          </Section>
          
          <Hr style={divider} />

          <Section style={bodySection}>
            <Text style={monospaceText}>
              <strong>AGENT STATUS:</strong> <span style={highlightRed}>FLAGGED</span><br />
              <strong>SECTOR ASSIGNMENT:</strong> {sector.toUpperCase()}<br />
              <strong>RECIPIENT:</strong> {name.toUpperCase()}
            </Text>

            <Text style={bodyText}>
              6 encoded data packets were intercepted from the organism&apos;s neural network. Each packet uses a different encoding method and contains a single number.
            </Text>

            <Section style={instructionBox}>
              <Text style={instructionTitle}>INSTRUCTIONS:</Text>
              <Text style={instructionItem}>1. Decode each packet to its <strong style={highlightGold}>decimal value</strong>.</Text>
              <Text style={instructionItem}>2. Map each decimal to the alphabet (<span style={highlightGold}>1=A, 2=B, ... 26=Z</span>).</Text>
              <Text style={instructionItem}>3. Compile the 6 letters in packet order to form the <strong style={highlightGold}>classification code</strong>.</Text>
            </Section>

            {/* Packet 1 */}
            <Section style={packetCardGreen}>
              <Text style={packetHeaderGreen}>PACKET 1 — BINARY (Base-2)</Text>
              <code style={packetData}>00010000</code>
              <Text style={packetDesc}>
                Standard 8-bit binary. Bit positions: (128, 64, 32, 16, 8, 4, 2, 1). Sum the positions where &apos;1&apos; appears.
              </Text>
            </Section>

            {/* Packet 2 */}
            <Section style={packetCardBlue}>
              <Text style={packetHeaderBlue}>PACKET 2 — HEXADECIMAL (Base-16)</Text>
              <code style={packetData}>0x0C</code>
              <Text style={packetDesc}>
                Base-16 digits: 0-9, then A=10, B=11, C=12, D=13, E=14, F=15. Convert to decimal.
              </Text>
            </Section>

            {/* Packet 3 */}
            <Section style={packetCardPurple}>
              <Text style={packetHeaderPurple}>PACKET 3 — OCTAL (Base-8)</Text>
              <code style={packetData}>01</code>
              <Text style={packetDesc}>
                Base-8 number system. Each digit represents powers of 8. Convert to decimal.
              </Text>
            </Section>

            {/* Packet 4 */}
            <Section style={packetCardGold}>
              <Text style={packetHeaderGold}>PACKET 4 — BASE64</Text>
              <code style={packetData}>Bw==</code>
              <Text style={packetDesc}>
                Base64 decodes to raw bytes. Decode &quot;Bw==&quot; to get a single byte, then read its decimal value.<br />
                <span style={packetTechnicalHint}>Technical hint: &apos;B&apos; = index 1, &apos;w&apos; = index 48. Combined: (1 &lt;&lt; 2) | (48 &gt;&gt; 4) = 7.</span>
              </Text>
            </Section>

            {/* Packet 5 */}
            <Section style={packetCardGreen}>
              <Text style={packetHeaderGreen}>PACKET 5 — ASCII ARITHMETIC</Text>
              <code style={packetData}>chr(66) - chr(65)</code>
              <Text style={packetDesc}>
                ASCII character code subtraction. Look up the decimal values: &apos;A&apos;=65, &apos;B&apos;=66, &apos;C&apos;=67, etc. Subtract.
              </Text>
            </Section>

            {/* Packet 6 */}
            <Section style={packetCardRed}>
              <Text style={packetHeaderRed}>PACKET 6 — BINARY XOR</Text>
              <code style={packetData}>11001 XOR 01010</code>
              <Text style={packetDesc}>
                Bitwise XOR on two 5-bit numbers, then convert result to decimal.<br />
                XOR rule: same bits &rarr; 0, different bits &rarr; 1.
              </Text>
            </Section>

            <Section style={referenceBox}>
              <Text style={referenceTitle}>ALPHABET REFERENCE:</Text>
              <code style={referenceCode}>
                A=1 &nbsp; B=2 &nbsp; C=3 &nbsp; D=4 &nbsp; E=5 &nbsp; F=6 &nbsp; G=7 &nbsp; H=8 &nbsp; I=9 &nbsp; J=10 &nbsp; K=11 &nbsp; L=12 &nbsp; M=13<br />
                N=14 &nbsp; O=15 &nbsp; P=16 &nbsp; Q=17 &nbsp; R=18 &nbsp; S=19 &nbsp; T=20 &nbsp; U=21 &nbsp; V=22 &nbsp; W=23 &nbsp; X=24 &nbsp; Y=25 &nbsp; Z=26
              </code>
            </Section>

            <Text style={bodyText}>
              Upon proper reconstruction, investigators established the decryption validation key format:
            </Text>

            <Section style={keySection}>
              <Text style={keyText}>XXXX-[DECODED_CODE]-XXXX</Text>
            </Section>

            <Text style={bodyText}>
              Replace <strong style={highlightGold}>[DECODED_CODE]</strong> with the 6-letter classification code you deciphered from the 6 data packets above to form the final validation key (e.g., <code style={{ color: '#aaa08f' }}>XXXX-XXXXXX-XXXX</code>).
            </Text>

            <Text style={alertText}>
              ⚠ DO NOT SHARE THIS KEY. ALL VALIDATION ATTEMPTS ARE LOGGED SERVER-SIDE AND TRACED TO AGENT CREDENTIALS.
            </Text>

          </Section>

          <Hr style={divider} />

          <Section style={footerSection}>
            <Text style={footerText}>
              PROJECT NULL // SITE KENNEDY COMMAND HQ // 1996<br />
              SECURITY DIVISION — BIOLOGICAL CONTAINMENT RESPONSE
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default DeadlightTransmissionEmail

// Styling
const main = {
  backgroundColor: '#050505',
  color: '#c8c0b0',
  fontFamily: 'monospace, "Courier New", Courier',
  padding: '20px 0',
}

const container = {
  backgroundColor: '#0a0806',
  border: '1px solid #1a4a1a',
  margin: '0 auto',
  padding: '30px',
  maxWidth: '600px',
}

const headerSection = {
  textAlign: 'center' as const,
  marginBottom: '20px',
}

const warningBanner = {
  color: '#ff4444',
  fontSize: '12px',
  fontWeight: 'bold',
  letterSpacing: '0.1em',
  margin: '0 0 10px 0',
}

const headerTitle = {
  color: '#4aff4a',
  fontSize: '20px',
  margin: '10px 0',
  letterSpacing: '0.05em',
}

const classification = {
  color: '#8a8070',
  fontSize: '10px',
  margin: '0',
}

const divider = {
  borderColor: '#1a4a1a',
  margin: '20px 0',
}

const bodySection = {
  marginBottom: '20px',
}

const monospaceText = {
  fontSize: '12px',
  lineHeight: '1.6',
  color: '#aaa08f',
  backgroundColor: '#0f0c08',
  padding: '12px',
  borderLeft: '2px solid #8b1a1a',
  marginBottom: '20px',
}

const highlightRed = {
  color: '#ff4444',
  fontWeight: 'bold',
}

const bodyText = {
  fontSize: '13px',
  lineHeight: '1.6',
  margin: '15px 0',
  color: '#c8c0b0',
}

const instructionBox = {
  backgroundColor: '#0a0a0a',
  border: '1px solid #3a3020',
  padding: '12px',
  margin: '16px 0',
}

const instructionTitle = {
  color: '#b8862a',
  fontWeight: 'bold',
  margin: '0 0 6px 0',
  fontSize: '12px',
}

const instructionItem = {
  fontSize: '12px',
  margin: '4px 0',
  color: '#c8c0b0',
}

const highlightGold = {
  color: '#e8c060',
}

// Packet styles
const packetCardGreen = {
  backgroundColor: '#080806',
  borderLeft: '3px solid #1a4a1a',
  padding: '12px',
  margin: '12px 0',
}
const packetHeaderGreen = {
  color: '#4aff4a',
  margin: '0 0 6px 0',
  fontSize: '12px',
  fontWeight: 'bold',
}

const packetCardBlue = {
  backgroundColor: '#080806',
  borderLeft: '3px solid #1a3a5a',
  padding: '12px',
  margin: '12px 0',
}
const packetHeaderBlue = {
  color: '#aaccff',
  margin: '0 0 6px 0',
  fontSize: '12px',
  fontWeight: 'bold',
}

const packetCardPurple = {
  backgroundColor: '#080806',
  borderLeft: '3px solid #5a1a5a',
  padding: '12px',
  margin: '12px 0',
}
const packetHeaderPurple = {
  color: '#cc88ff',
  margin: '0 0 6px 0',
  fontSize: '12px',
  fontWeight: 'bold',
}

const packetCardGold = {
  backgroundColor: '#080806',
  borderLeft: '3px solid #5a3a1a',
  padding: '12px',
  margin: '12px 0',
}
const packetHeaderGold = {
  color: '#ffaa44',
  margin: '0 0 6px 0',
  fontSize: '12px',
  fontWeight: 'bold',
}

const packetCardRed = {
  backgroundColor: '#080806',
  borderLeft: '3px solid #5a1a1a',
  padding: '12px',
  margin: '12px 0',
}
const packetHeaderRed = {
  color: '#ff6644',
  margin: '0 0 6px 0',
  fontSize: '12px',
  fontWeight: 'bold',
}

const packetData = {
  color: '#e8c060',
  fontSize: '14px',
  fontWeight: 'bold',
  fontFamily: 'monospace',
}

const packetDesc = {
  color: '#8a8070',
  fontSize: '11px',
  margin: '6px 0 0 0',
  lineHeight: '1.4',
}

const packetTechnicalHint = {
  color: '#6a6050',
}

// Reference box
const referenceBox = {
  backgroundColor: '#0c0c0c',
  border: '1px dashed #3a3020',
  padding: '12px',
  margin: '20px 0',
}
const referenceTitle = {
  color: '#b8862a',
  fontWeight: 'bold',
  margin: '0 0 6px 0',
  fontSize: '11px',
}
const referenceCode = {
  color: '#8a8070',
  fontSize: '10px',
  lineHeight: '1.6',
}

const keySection = {
  backgroundColor: '#12100a',
  border: '1px solid #b8862a',
  padding: '15px',
  textAlign: 'center' as const,
  margin: '20px 0',
}

const keyText = {
  color: '#b8862a',
  fontSize: '18px',
  fontWeight: 'bold',
  letterSpacing: '0.2em',
  margin: '0',
  textShadow: '0 0 8px rgba(184, 134, 42, 0.3)',
}

const alertText = {
  color: '#8b1a1a',
  fontSize: '11px',
  lineHeight: '1.4',
  textAlign: 'center' as const,
  marginTop: '20px',
}

const footerSection = {
  textAlign: 'center' as const,
}

const footerText = {
  color: '#5a5040',
  fontSize: '10px',
  lineHeight: '1.6',
  margin: '0',
}
