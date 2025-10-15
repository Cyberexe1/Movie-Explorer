'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ComponentType } from 'react'

interface WithAuthProps {
  [key: string]: any
}

export function withAuth<P extends WithAuthProps>(
  WrappedComponent: ComponentType<P>,
  options: { redirectTo?: string; requireAuth?: boolean } = {}
) {
  const { redirectTo = '/login', requireAuth = true } = options

  return function AuthenticatedComponent(props: P) {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
      if (status === 'loading') return // Still loading

      if (requireAuth && !session) {
        router.push(redirectTo)
        return
      }

      if (!requireAuth && session) {
        router.push('/')
        return
      }
    }, [session, status, router])

    // Show loading spinner while checking authentication
    if (status === 'loading') {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      )
    }

    // Don't render the component if auth requirements aren't met
    if (requireAuth && !session) {
      return null
    }

    if (!requireAuth && session) {
      return null
    }

    return <WrappedComponent {...props} />
  }
}

// Convenience wrapper for protected pages
export function withProtectedRoute<P extends WithAuthProps>(
  WrappedComponent: ComponentType<P>
) {
  return withAuth(WrappedComponent, { requireAuth: true })
}

// Convenience wrapper for guest-only pages (login, register)
export function withGuestRoute<P extends WithAuthProps>(
  WrappedComponent: ComponentType<P>
) {
  return withAuth(WrappedComponent, { requireAuth: false })
}