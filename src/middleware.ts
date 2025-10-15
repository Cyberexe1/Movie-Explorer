import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const isAuthenticated = !!req.nextauth.token

    // Handle root path specifically
    if (pathname === '/') {
      if (!isAuthenticated) {
        return NextResponse.redirect(new URL('/landing', req.url))
      }
      return NextResponse.next()
    }

    // If user is not authenticated and trying to access protected routes
    if (!isAuthenticated && isProtectedRoute(pathname)) {
      return NextResponse.redirect(new URL('/landing', req.url))
    }

    // If user is authenticated and trying to access auth/landing pages, redirect to home
    if (isAuthenticated && (isAuthRoute(pathname) || pathname === '/landing')) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Always allow public routes
        if (isPublicRoute(pathname)) {
          return true
        }
        
        // For root path, let middleware handle the redirect
        if (pathname === '/') {
          return true
        }
        
        // For protected routes, require authentication
        if (isProtectedRoute(pathname)) {
          return !!token
        }
        
        // Default: allow access
        return true
      },
    },
  }
)

function isPublicRoute(pathname: string): boolean {
  const publicRoutes = [
    '/landing',
    '/login',
    '/register',
    '/api/auth',
    '/_next',
    '/favicon.ico',
    '/placeholder-movie.svg',
  ]
  
  return publicRoutes.some(route => pathname.startsWith(route))
}

function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = [
    '/',
    '/movie',
    '/favorites',
    '/search',
  ]
  
  // Don't protect landing page
  if (pathname === '/landing') return false
  
  return protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
}

function isAuthRoute(pathname: string): boolean {
  return pathname === '/login' || pathname === '/register'
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|placeholder-movie.svg).*)',
  ],
}