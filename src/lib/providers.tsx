'use client'

import { SessionProvider } from 'next-auth/react'
import { AuthProvider } from '@/lib/auth-context'
import { ThemeProvider } from '@/lib/theme-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}