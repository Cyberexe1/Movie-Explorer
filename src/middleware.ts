import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  // Skip middleware for API routes, static files, and NextAuth
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/placeholder-movie.svg')
  ) {
    return NextResponse.next()
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const isAuthenticated = !!token

  console.log('Middleware:', { pathname, isAuthenticated, hasToken: !!token })

  // Handle root path specifically
  if (pathname === '/') {
    if (!isAuthenticated) {
      console.log('Redirecting to landing - not authenticated')
      return NextResponse.redirect(new URL('/landing', req.url))
    }
    console.log('Allowing access to root - authenticated')
    return NextResponse.next()
  }

  // Allow debug and test pages for testing
  if (pathname === '/debug' || pathname === '/test-movies') {
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
}

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
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|placeholder-movie.svg).*)',
  ],
}