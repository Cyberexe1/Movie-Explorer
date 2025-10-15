'use client'

import { useAuth } from '@/lib/auth-context'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { tmdbApi } from '@/lib/tmdb'

export default function DebugPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const { data: session, status } = useSession()
  const [apiTest, setApiTest] = useState<any>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  useEffect(() => {
    // Test TMDB API
    const testApi = async () => {
      try {
        const result = await tmdbApi.getPopularMovies(1)
        setApiTest(result)
      } catch (error: any) {
        setApiError(error.message)
      }
    }
    testApi()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Debug Information</h1>
        
        {/* Authentication Debug */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Authentication Status</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Auth Loading:</strong> {authLoading ? 'Yes' : 'No'}</p>
            <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>Session Status:</strong> {status}</p>
            <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'None'}</p>
            <p><strong>Session:</strong> {session ? JSON.stringify(session, null, 2) : 'None'}</p>
          </div>
        </div>

        {/* API Debug */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">TMDB API Test</h2>
          {apiError ? (
            <div className="text-red-600 dark:text-red-400">
              <p><strong>API Error:</strong> {apiError}</p>
            </div>
          ) : apiTest ? (
            <div className="text-green-600 dark:text-green-400">
              <p><strong>API Success:</strong> Loaded {apiTest.results?.length} movies</p>
              <p><strong>First Movie:</strong> {apiTest.results?.[0]?.title}</p>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">Loading API test...</p>
          )}
        </div>

        {/* Environment Debug */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Environment</h2>
          <div className="space-y-2 text-sm">
            <p><strong>TMDB API Key:</strong> {process.env.NEXT_PUBLIC_TMDB_API_KEY ? 'Set' : 'Not Set'}</p>
            <p><strong>NextAuth URL:</strong> {process.env.NEXTAUTH_URL || 'Not Set'}</p>
            <p><strong>NextAuth Secret:</strong> {process.env.NEXTAUTH_SECRET ? 'Set' : 'Not Set'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}