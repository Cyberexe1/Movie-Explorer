'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { AuthState } from './types'
import { SessionStorage } from './session-storage'

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status, update } = useSession()
  const [isInitialized, setIsInitialized] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (status !== 'loading') {
      setIsInitialized(true)
    }
  }, [status])

  // Update session storage when user is authenticated
  useEffect(() => {
    if (session?.user?.id && pathname) {
      SessionStorage.updateLastVisited(session.user.id, pathname)
    }
  }, [session?.user?.id, pathname])

  // Clean up expired sessions
  useEffect(() => {
    if (session?.user?.id) {
      const isExpired = SessionStorage.isSessionExpired(session.user.id)
      if (isExpired) {
        SessionStorage.clearSessionData()
      }
    }
  }, [session?.user?.id])

  const authState: AuthState = {
    user: session?.user ? {
      id: session.user.id as string,
      email: session.user.email!,
      name: session.user.name!,
    } : null,
    isAuthenticated: !!session && status === 'authenticated',
    isLoading: status === 'loading' || !isInitialized,
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' }
      }

      const result = await signIn('credentials', {
        email: email.trim(),
        password,
        action: 'login',
        redirect: false,
      })

      if (result?.error) {
        return { success: false, error: result.error }
      }

      if (result?.ok) {
        // Force session update
        await update()
        return { success: true }
      }

      return { success: false, error: 'Login failed. Please check your credentials.' }
    } catch (error: any) {
      console.error('Login error:', error)
      return { success: false, error: error.message || 'An unexpected error occurred' }
    }
  }

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!name || !email || !password) {
        return { success: false, error: 'All fields are required' }
      }

      if (name.trim().length < 2) {
        return { success: false, error: 'Name must be at least 2 characters long' }
      }

      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long' }
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return { success: false, error: 'Please enter a valid email address' }
      }

      const result = await signIn('credentials', {
        name: name.trim(),
        email: email.trim(),
        password,
        action: 'register',
        redirect: false,
      })

      if (result?.error) {
        return { success: false, error: result.error }
      }

      if (result?.ok) {
        // Force session update
        await update()
        return { success: true }
      }

      return { success: false, error: 'Registration failed. Please try again.' }
    } catch (error: any) {
      console.error('Registration error:', error)
      return { success: false, error: error.message || 'An unexpected error occurred' }
    }
  }

  const logout = async (): Promise<void> => {
    try {
      // Clear session storage before signing out
      SessionStorage.clearSessionData()

      await signOut({
        redirect: false,
        callbackUrl: '/login'
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}