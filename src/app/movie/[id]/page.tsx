'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { tmdbApi } from '@/lib/tmdb'
import { FavoritesManager } from '@/lib/favorites'
import { MovieDetails } from '@/lib/types'
import { MovieDetailSkeleton } from '@/components/LoadingSkeleton'
import Navbar from '@/components/Navbar'
import Image from 'next/image'
import { Heart, Star, Calendar, Clock, ArrowLeft, Building2, Globe, Languages, DollarSign, CheckCircle, Film } from 'lucide-react'
import Link from 'next/link'

export default function MovieDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)

  const movieId = parseInt(params.id as string)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated && movieId) {
      loadMovieDetails()
      setIsFavorite(FavoritesManager.isFavorite(movieId))
    }
  }, [isAuthenticated, movieId])

  const loadMovieDetails = async () => {
    try {
      setLoading(true)
      const movieData = await tmdbApi.getMovieDetails(movieId)
      setMovie(movieData)
      setError(null)
    } catch (err) {
      setError('Failed to load movie details. Please try again.')
      console.error('Error loading movie details:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFavoriteToggle = () => {
    if (movie) {
      const newFavoriteStatus = FavoritesManager.toggleFavorite(movie)
      setIsFavorite(newFavoriteStatus)
    }
  }

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
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

        {/* Error State */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
            {error}
            <button
              onClick={loadMovieDetails}
              className="ml-4 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <MovieDetailSkeleton />
        ) : movie ? (
          <div className="space-y-12">
            {/* Hero Section with Backdrop */}
            {movie.backdrop_path && (
              <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 h-96 lg:h-[500px] overflow-hidden rounded-3xl">
                <Image
                  src={tmdbApi.getImageUrl(movie.backdrop_path, 'original')}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <h1 className="text-4xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
                    {movie.title}
                  </h1>
                  {movie.tagline && (
                    <p className="text-xl lg:text-2xl italic opacity-90 drop-shadow-md">
                      "{movie.tagline}"
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Enhanced Movie Poster */}
              <div className="w-full lg:w-80 flex-shrink-0">
                <div className="sticky top-24">
                  <div className="relative group">
                    {/* Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                    
                    {/* Poster Container */}
                    <div className="relative aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10 dark:border-gray-700/20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                      <Image
                        src={tmdbApi.getImageUrl(movie.poster_path, 'w780')}
                        alt={movie.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority
                      />
                      
                      {/* Gradient Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
                      
                      {/* Rating Badge on Poster */}
                      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-2xl flex items-center space-x-2 shadow-lg">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold">{movie.vote_average.toFixed(1)}</span>
                      </div>
                      
                      {/* Year Badge */}
                      <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-900 dark:text-white px-3 py-2 rounded-2xl font-bold shadow-lg">
                        {new Date(movie.release_date).getFullYear()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Movie Details */}
              <div className="flex-1 space-y-8">
                {/* Title and Basic Info - Only show if no backdrop */}
                {!movie.backdrop_path && (
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                      {movie.title}
                    </h1>
                    {movie.tagline && (
                      <p className="text-xl text-gray-600 dark:text-gray-400 italic">
                        "{movie.tagline}"
                      </p>
                    )}
                  </div>
                )}

                {/* Enhanced Rating and Meta Info */}
                <div className="flex flex-wrap items-center gap-4">
                  {/* Rating Badge */}
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-2 rounded-2xl shadow-lg">
                    <Star className="w-5 h-5 fill-white text-white" />
                    <span className="font-bold text-white text-lg">{movie.vote_average.toFixed(1)}</span>
                    <span className="text-yellow-100 text-sm">
                      ({movie.vote_count.toLocaleString()} votes)
                    </span>
                  </div>
                  
                  {/* Release Year */}
                  <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-2xl">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-semibold text-blue-800 dark:text-blue-300">
                      {new Date(movie.release_date).getFullYear()}
                    </span>
                  </div>
                  
                  {/* Runtime */}
                  {movie.runtime > 0 && (
                    <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-2xl">
                      <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="font-semibold text-green-800 dark:text-green-300">
                        {formatRuntime(movie.runtime)}
                      </span>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="flex items-center space-x-2 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-2xl">
                    <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="font-semibold text-purple-800 dark:text-purple-300">
                      {movie.status}
                    </span>
                  </div>
                </div>

                {/* Enhanced Genres */}
                {movie.genres.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                      <Film className="w-5 h-5 text-primary-500" />
                      <span>Genres</span>
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {movie.genres.map((genre, index) => (
                        <span
                          key={genre.id}
                          className={`px-4 py-2 rounded-2xl text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 ${
                            index % 4 === 0 ? 'bg-gradient-to-r from-red-400 to-pink-400 text-white' :
                            index % 4 === 1 ? 'bg-gradient-to-r from-blue-400 to-indigo-400 text-white' :
                            index % 4 === 2 ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white' :
                            'bg-gradient-to-r from-purple-400 to-violet-400 text-white'
                          }`}
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Enhanced Overview */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-3xl p-8 border border-gray-200/50 dark:border-gray-600/50">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl">
                      <Film className="w-6 h-6 text-white" />
                    </div>
                    <span>Overview</span>
                  </h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    {movie.overview}
                  </p>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleFavoriteToggle}
                    className={`group flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                      isFavorite
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white'
                        : 'bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-900 dark:text-white'
                    }`}
                  >
                    <Heart className={`w-6 h-6 transition-transform group-hover:scale-110 ${isFavorite ? 'fill-current' : ''}`} />
                    <span className="text-lg">{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                  </button>
                  
                  {/* Additional Action Buttons */}
                  <button className="group flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    <Star className="w-6 h-6 transition-transform group-hover:scale-110" />
                    <span className="text-lg">Rate Movie</span>
                  </button>
                  
                  <button className="group flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    <Calendar className="w-6 h-6 transition-transform group-hover:scale-110" />
                    <span className="text-lg">Add to Watchlist</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Details Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Production Info */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-8 border border-blue-200/50 dark:border-blue-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-2xl"></div>
                
                <div className="relative">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg">
                      <Film className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Production Details
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</span>
                        <p className="font-semibold text-gray-900 dark:text-white">{movie.status}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm">
                      <Languages className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Original Language</span>
                        <p className="font-semibold text-gray-900 dark:text-white uppercase">{movie.original_language}</p>
                      </div>
                    </div>
                    
                    {movie.budget > 0 && (
                      <div className="flex items-center space-x-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm">
                        <DollarSign className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Budget</span>
                          <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(movie.budget)}</p>
                        </div>
                      </div>
                    )}
                    
                    {movie.revenue > 0 && (
                      <div className="flex items-center space-x-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm">
                        <DollarSign className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</span>
                          <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(movie.revenue)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Production Companies */}
              {movie.production_companies.length > 0 && (
                <div className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-8 border border-purple-200/50 dark:border-purple-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl"></div>
                  
                  <div className="relative">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Production Companies
                      </h3>
                    </div>
                    
                    <div className="space-y-3">
                      {movie.production_companies.slice(0, 5).map((company, index) => (
                        <div key={company.id} className="flex items-center space-x-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{company.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Countries & Languages */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-3xl p-8 border border-emerald-200/50 dark:border-emerald-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-2xl"></div>
                
                <div className="relative">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Countries & Languages
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    {movie.production_countries.length > 0 && (
                      <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm">
                        <div className="flex items-center space-x-2 mb-3">
                          <Globe className="w-4 h-4 text-emerald-500" />
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Countries</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {movie.production_countries.map((country) => (
                            <span 
                              key={country.iso_3166_1} 
                              className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium"
                            >
                              {country.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {movie.spoken_languages.length > 0 && (
                      <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm">
                        <div className="flex items-center space-x-2 mb-3">
                          <Languages className="w-4 h-4 text-teal-500" />
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Languages</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {movie.spoken_languages.map((language) => (
                            <span 
                              key={language.iso_639_1} 
                              className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium"
                            >
                              {language.english_name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  )
}