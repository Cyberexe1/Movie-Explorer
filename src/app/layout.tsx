import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/lib/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CineVault - Your Ultimate Movie Discovery Platform',
  description: 'Discover, explore, and curate your perfect movie collection with CineVault - the ultimate cinematic experience.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}