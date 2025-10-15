'use client'

import { useEffect, useState } from 'react'
import { tmdbApi } from '@/lib/tmdb'
import { Movie } from '@/lib/types'
import MovieCard from '@/components/MovieCard'

export default function TestMoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMovies = async () => {
      try {
        console.log('Loading movies...')
        const response = await tmdbApi.getPopularMovies(1)
        console.log('Movies loaded:', response)
        setMovies(response.results)
        setError(null)
      } catch (err: any) {
        console.error('Error loading movies:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadMovies()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Test Movies Page</h1>
        
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Loaded {movies.length} movies successfully!
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movies.map((movie, index) => (
                <MovieCard key={movie.id} movie={movie} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}