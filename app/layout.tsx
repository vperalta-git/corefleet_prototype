import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CoreFleet - Fleet Management Dashboard',
  description: 'Professional fleet management and vehicle tracking system',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/logos/favicon_light.png', type: 'image/png', media: '(prefers-color-scheme: light)' },
      { url: '/logos/favicon_dark.png', type: 'image/png', media: '(prefers-color-scheme: dark)' },
    ],
    shortcut: [
      { url: '/logos/favicon_light.png', type: 'image/png', media: '(prefers-color-scheme: light)' },
      { url: '/logos/favicon_dark.png', type: 'image/png', media: '(prefers-color-scheme: dark)' },
    ],
    apple: [
      { url: '/logos/favicon_light.png', type: 'image/png', media: '(prefers-color-scheme: light)' },
      { url: '/logos/favicon_dark.png', type: 'image/png', media: '(prefers-color-scheme: dark)' },
    ],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-slate-50" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 text-slate-950 antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
