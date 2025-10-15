'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { FavoritesManager } from '@/lib/favorites'
import { Movie } from '@/lib/types'
import MovieCard from '@/components/MovieCard'
import Navbar from '@/components/Navbar'
import { Heart, Trash2, ArrowRight } from 'lucide-react'

export default function FavoritesPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [favorites, setFavorites] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites()
    }
  }, [isAuthenticated])

  const loadFavorites = () => {
    try {
      const favoriteMovies = FavoritesManager.getFavorites()
      setFavorites(favoriteMovies)
    } catch (error) {
      console.error('Error loading favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFavoriteChange = () => {
    // Reload favorites when a movie is removed
    loadFavorites()
  }

  const clearAllFavorites = () => {
    if (window.confirm('Are you sure you want to remove all movies from your favorites?')) {
      favorites.forEach(movie => {
        FavoritesManager.removeFromFavorites(movie.id)
      })
      setFavorites([])
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
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 px-6 py-3 rounded-2xl mb-6">
            <Heart className="w-8 h-8 text-red-500 fill-current animate-pulse" />
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              My Favorites
            </h1>
          </div>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {favorites.length === 0 
              ? "Your personal movie collection is waiting to be filled with amazing films"
              : `You've curated ${favorites.length} incredible movie${favorites.length === 1 ? '' : 's'} in your collection`
            }
          </p>

          {/* Clear All Button */}
          {favorites.length > 0 && (
            <div className="mt-6">
              <button
                onClick={clearAllFavorites}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 rounded-2xl transition-all duration-200 hover:scale-105 border border-red-200 dark:border-red-800"
              >
                <Trash2 className="w-4 h-4" />
                <span className="font-medium">Clear All Favorites</span>
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : favorites.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-full mx-auto flex items-center justify-center mb-6">
                <Heart className="w-16 h-16 text-red-400 dark:text-red-500" />
              </div>
              <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-red-400/20 animate-ping"></div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Your favorites await
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto mb-8 text-lg leading-relaxed">
              Discover amazing movies and build your personal collection. Click the heart icon on any movie to add it to your favorites.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/')}
                className="group bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Explore Movies</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => router.push('/search')}
                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium px-8 py-4 rounded-2xl shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-600 transform hover:scale-105 transition-all duration-200"
              >
                Search Movies
              </button>
            </div>
          </div>
        ) : (
          /* Favorites Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {favorites.map((movie) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                onFavoriteChange={handleFavoriteChange}
              />
            ))}
          </div>
        )}

        {/* Stats */}
        {favorites.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6 text-center">
              <div className="text-2xl font-bold text-primary-600 mb-2">
                {favorites.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Total Favorites
              </div>
            </div>
            
            <div className="card p-6 text-center">
              <div className="text-2xl font-bold text-primary-600 mb-2">
                {(favorites.reduce((sum, movie) => sum + movie.vote_average, 0) / favorites.length).toFixed(1)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Average Rating
              </div>
            </div>
            
            <div className="card p-6 text-center">
              <div className="text-2xl font-bold text-primary-600 mb-2">
                {Math.max(...favorites.map(movie => new Date(movie.release_date).getFullYear()))}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Latest Year
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}