import type { Metadata } from 'next'
import { Cinzel, Lora, Geist_Mono } from 'next/font/google'
import { ScrollProvider } from '@/components/deadlight/ScrollProvider'
import './globals.css'

const cinzel = Cinzel({ variable: '--font-cinzel', subsets: ['latin'] })
const lora = Lora({ variable: '--font-body', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const viewport = { width: 'device-width', initialScale: 1 }
export const metadata: Metadata = { title: 'Aetherion — Recovery Protocol', description: 'A story-driven cryptic hunt across nine fractured timelines.', keywords: ['Aetherion', 'cryptic hunt', 'IEEE CS MUJ', 'puzzles'] }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${cinzel.variable} ${lora.variable} ${geistMono.variable} h-full antialiased dark`} style={{ colorScheme: 'dark' }}><body className="min-h-full bg-black text-[#f4ece1] antialiased"><div className="aetherion-grain" /><div className="aetherion-scanlines" /><ScrollProvider>{children}</ScrollProvider></body></html>
}
