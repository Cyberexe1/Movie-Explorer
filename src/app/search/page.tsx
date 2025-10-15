'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { SessionStorage } from '@/lib/session-storage'
import { tmdbApi } from '@/lib/tmdb'
import { Movie } from '@/lib/types'
import MovieCard from '@/components/MovieCard'
import { MovieGridSkeleton } from '@/components/LoadingSkeleton'
import Navbar from '@/components/Navbar'
import { Search, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [totalResults, setTotalResults] = useState(0)

  const query = searchParams.get('q') || ''

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated && query) {
      searchMovies()
    }
  }, [isAuthenticated, query])

  const searchMovies = async (pageNum: number = 1, append: boolean = false) => {
    if (!query.trim()) return

    try {
      if (append) {
        setLoadingMore(true)
      } else {
        setLoading(true)
        setMovies([])
        setPage(1)
        
        // Add to search history if user is authenticated
        if (user?.id) {
          SessionStorage.addToSearchHistory(user.id, query.trim())
        }
      }
      
      const response = await tmdbApi.searchMovies(query.trim(), pageNum)
      
      if (append) {
        setMovies(prev => [...prev, ...response.results])
      } else {
        setMovies(response.results)
      }
      
      setTotalResults(response.total_results)
      setHasMore(pageNum < response.total_pages)
      setError(null)
    } catch (err) {
      setError('Failed to search movies. Please try again.')
      console.error('Error searching movies:', err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      searchMovies(nextPage, true)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movies</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Search className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Search Results
            </h1>
          </div>
          
          {query && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <p className="text-gray-600 dark:text-gray-400">
                Searching for: <span className="font-medium text-gray-900 dark:text-white">"{query}"</span>
              </p>
              {!loading && totalResults > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                  {totalResults.toLocaleString()} result{totalResults === 1 ? '' : 's'} found
                </p>
              )}
            </div>
          )}
        </div>

        {/* No Query State */}
        {!query && (
          <div className="text-center py-16">
            <Search className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No search query
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Use the search bar in the navigation to find movies by title.
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
            {error}
            <button
              onClick={() => searchMovies()}
              className="ml-4 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && query ? (
          <MovieGridSkeleton />
        ) : query && !loading ? (
          <>
            {/* No Results */}
            {movies.length === 0 ? (
              <div className="text-center py-16">
                <Search className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  No movies found
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                  We couldn't find any movies matching "{query}". Try searching with different keywords.
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="btn-primary"
                >
                  Browse Popular Movies
                </button>
              </div>
            ) : (
              <>
                {/* Results Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
                  {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="flex justify-center">
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingMore ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Loading...</span>
                        </div>
                      ) : (
                        'Load More Results'
                      )}
                    </button>
                  </div>
                )}

                {/* End of Results */}
                {!hasMore && movies.length > 0 && (
                  <div className="text-center text-gray-600 dark:text-gray-400 py-8">
                    You've reached the end of the search results!
                  </div>
                )}
              </>
            )}
          </>
        ) : null}
      </main>
    </div>
  )
}