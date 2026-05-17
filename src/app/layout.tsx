import type { Metadata } from 'next'
import { Cormorant_Garamond, Syncopate, DM_Sans } from 'next/font/google'
import { ThemeProvider } from '@/design/theme'
import { PersonaProvider } from '@/design/persona'
import { ToastProvider } from '@/components/ui/Toast'
import AppShell from '@/components/shell/AppShell'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
})

const syncopate = Syncopate({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-syncopate',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'Atlas Coach',
  description: 'The operating system for modern coaches.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${syncopate.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ThemeProvider>
          <PersonaProvider>
            <ToastProvider>
              <AppShell>{children}</AppShell>
            </ToastProvider>
          </PersonaProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
