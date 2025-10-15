'use client'

import { useAuth } from '@/lib/auth-context'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { tmdbApi } from '@/lib/tmdb'
import { Movie } from '@/lib/types'
import MovieCard from '@/components/MovieCard'
import { MovieGridSkeleton } from '@/components/LoadingSkeleton'
import Navbar from '@/components/Navbar'
import MovieFilter from '@/components/MovieFilter'
import { Sparkles, TrendingUp, Star, Calendar, ChevronRight } from 'lucide-react'

export default function HomePage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const router = useRouter()
  const [allMovies, setAllMovies] = useState<Movie[]>([]) // Store all movies
  const [movies, setMovies] = useState<Movie[]>([]) // Filtered movies for display
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([])
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [activeTab, setActiveTab] = useState<'popular' | 'top-rated' | 'upcoming'>('popular')
  const [filters, setFilters] = useState({
    genres: [],
    year: '',
    rating: '',
    sortBy: 'popularity.desc'
  })

  // Temporarily disable authentication checks for debugging
  useEffect(() => {
    console.log('HomePage - Auth status:', { isAuthenticated, authLoading, user })
    // Load movies regardless of auth status for debugging
    loadAllMovies()
  }, [])

  // TODO: Re-enable authentication after debugging
  /*
  // Handle authentication redirect
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace('/landing')
        return
      }
    }
  }, [isAuthenticated, authLoading, router])

  // Don't render anything if not authenticated
  if (!authLoading && !isAuthenticated) {
    return null
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadAllMovies()
    }
  }, [isAuthenticated])
  */

  const loadAllMovies = async () => {
    try {
      setLoading(true)
      // Load diverse movie categories for better variety
      const [
        popularPage1, popularPage2,
        topRatedPage1, topRatedPage2,
        upcomingPage1, upcomingPage2
      ] = await Promise.all([
        tmdbApi.getPopularMovies(1),
        tmdbApi.getPopularMovies(2),
        tmdbApi.getTopRatedMovies(1),
        tmdbApi.getTopRatedMovies(2),
        tmdbApi.getUpcomingMovies(1),
        tmdbApi.getUpcomingMovies(2)
      ])

      // Mix different categories for better diversity
      const diverseMovies = [
        ...popularPage1.results.slice(0, 15),  // Top 15 popular
        ...topRatedPage1.results.slice(0, 15), // Top 15 rated
        ...upcomingPage1.results.slice(0, 10), // Top 10 upcoming
        ...popularPage2.results.slice(0, 10),  // More popular
        ...topRatedPage2.results.slice(0, 10)  // More top rated
      ]

      // Remove duplicates and ensure genre diversity
      const uniqueMovies = diverseMovies
        .filter((movie, index, self) =>
          index === self.findIndex(m => m.id === movie.id)
        )
        .filter(movie => {
          // Ensure we have poster images
          return movie.poster_path !== null
        })

      // Shuffle array for better diversity
      const shuffledMovies = uniqueMovies.sort(() => Math.random() - 0.5)

      // Store all movies and set display movies
      setAllMovies(shuffledMovies)
      setMovies(shuffledMovies)
      setTopRatedMovies([...topRatedPage1.results, ...topRatedPage2.results])
      setUpcomingMovies([...upcomingPage1.results, ...upcomingPage2.results])
      setHasMore(2 < popularPage1.total_pages)
      setError(null)
    } catch (err) {
      setError('Failed to load movies. Please try again.')
      console.error('Error loading movies:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadMovies = async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true)
      }

      let response
      switch (activeTab) {
        case 'top-rated':
          response = await tmdbApi.getTopRatedMovies(pageNum)
          break
        case 'upcoming':
          response = await tmdbApi.getUpcomingMovies(pageNum)
          break
        default:
          response = await tmdbApi.getPopularMovies(pageNum)
      }

      if (append) {
        setMovies(prev => [...prev, ...response.results])
      } else {
        setMovies(response.results)
      }

      setHasMore(pageNum < response.total_pages)
      setError(null)
    } catch (err) {
      setError('Failed to load movies. Please try again.')
      console.error('Error loading movies:', err)
    } finally {
      setLoadingMore(false)
    }
  }

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      loadMovies(nextPage, true)
    }
  }

  const handleTabChange = async (tab: 'popular' | 'top-rated' | 'upcoming') => {
    setActiveTab(tab)
    setPage(1)
    setLoading(true)

    try {
      let sourceMovies: Movie[] = []
      switch (tab) {
        case 'top-rated':
          // Load more top-rated movies for better filtering
          const [topPage1, topPage2, topPage3] = await Promise.all([
            tmdbApi.getTopRatedMovies(1),
            tmdbApi.getTopRatedMovies(2),
            tmdbApi.getTopRatedMovies(3)
          ])
          sourceMovies = [...topPage1.results, ...topPage2.results, ...topPage3.results]
          break
        case 'upcoming':
          // Load more upcoming movies for better filtering
          const [upPage1, upPage2, upPage3] = await Promise.all([
            tmdbApi.getUpcomingMovies(1),
            tmdbApi.getUpcomingMovies(2),
            tmdbApi.getUpcomingMovies(3)
          ])
          sourceMovies = [...upPage1.results, ...upPage2.results, ...upPage3.results]
          break
        default:
          sourceMovies = allMovies
      }

      // Apply current filters to the selected tab's movies
      setAllMovies(sourceMovies)
      applyFilters(sourceMovies, filters)
    } catch (err) {
      setError('Failed to load movies for this category.')
      console.error('Error loading movies:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = useCallback((movieList: Movie[], filterOptions: any) => {
    if (!movieList || movieList.length === 0) {
      return // Don't filter if no movies are loaded
    }

    let filteredMovies = [...movieList]

    // Filter by genres (only if genres are selected)
    if (filterOptions.genres && filterOptions.genres.length > 0) {
      filteredMovies = filteredMovies.filter(movie =>
        movie.genre_ids && movie.genre_ids.some(genreId => filterOptions.genres.includes(genreId))
      )
    }

    // Filter by year (only if year is selected)
    if (filterOptions.year) {
      filteredMovies = filteredMovies.filter(movie => {
        if (!movie.release_date) return false
        return new Date(movie.release_date).getFullYear().toString() === filterOptions.year
      })
    }

    // Filter by rating (only if rating is selected)
    if (filterOptions.rating) {
      const minRating = parseFloat(filterOptions.rating)
      filteredMovies = filteredMovies.filter(movie => movie.vote_average >= minRating)
    }

    // Sort movies
    switch (filterOptions.sortBy) {
      case 'vote_average.desc':
        filteredMovies.sort((a, b) => b.vote_average - a.vote_average)
        break
      case 'release_date.desc':
        filteredMovies.sort((a, b) => {
          const dateA = new Date(a.release_date || '').getTime()
          const dateB = new Date(b.release_date || '').getTime()
          return dateB - dateA
        })
        break
      case 'release_date.asc':
        filteredMovies.sort((a, b) => {
          const dateA = new Date(a.release_date || '').getTime()
          const dateB = new Date(b.release_date || '').getTime()
          return dateA - dateB
        })
        break
      case 'title.asc':
        filteredMovies.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'title.desc':
        filteredMovies.sort((a, b) => b.title.localeCompare(a.title))
        break
      default: // popularity.desc
        filteredMovies.sort((a, b) => b.popularity - a.popularity)
    }

    // Ensure we have at least 12 movies (3 rows of 4) by showing all if filtered results are too few
    if (filteredMovies.length < 12 && movieList.length >= 12) {
      // If filters are too restrictive, show more movies by relaxing some filters
      let relaxedMovies = [...movieList]

      // Only apply the most important filters
      if (filterOptions.genres && filterOptions.genres.length > 0) {
        relaxedMovies = relaxedMovies.filter(movie =>
          movie.genre_ids && movie.genre_ids.some(genreId => filterOptions.genres.includes(genreId))
        )
      }

      // Apply sorting to relaxed results
      switch (filterOptions.sortBy) {
        case 'vote_average.desc':
          relaxedMovies.sort((a, b) => b.vote_average - a.vote_average)
          break
        case 'release_date.desc':
          relaxedMovies.sort((a, b) => {
            const dateA = new Date(a.release_date || '').getTime()
            const dateB = new Date(b.release_date || '').getTime()
            return dateB - dateA
          })
          break
        default:
          relaxedMovies.sort((a, b) => b.popularity - a.popularity)
      }

      // Use relaxed results if they provide more movies
      if (relaxedMovies.length > filteredMovies.length) {
        filteredMovies = relaxedMovies
      }
    }

    setMovies(filteredMovies)
  }, [])

  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters)
    setPage(1)
    // Apply filters to current source movies
    applyFilters(allMovies, newFilters)
  }, [allMovies, applyFilters])

  // Apply filters when allMovies changes
  useEffect(() => {
    if (allMovies.length > 0) {
      applyFilters(allMovies, filters)
    }
  }, [allMovies])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  // Temporarily show loading only for movie data, not auth
  // TODO: Re-enable auth loading after debugging
  /*
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
            <div className="absolute inset-0 rounded-full bg-primary-100 dark:bg-primary-900 opacity-20 animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }
  */

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Hero Section */}
        <div className="mb-16 text-center relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-10 left-1/4 w-72 h-72 bg-gradient-to-r from-primary-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          {/* Enhanced Greeting Badge */}
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-primary-200/30 dark:border-primary-700/30 px-6 py-3 rounded-2xl mb-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="relative">
              <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400 group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute -inset-1 bg-primary-400/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="text-base font-semibold bg-gradient-to-r from-primary-700 to-purple-700 dark:from-primary-300 dark:to-purple-300 bg-clip-text text-transparent">
              {getGreeting()}, {user?.name || 'Movie Lover'}!
            </span>
            <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full animate-pulse"></div>
          </div>
          
          {/* Enhanced Title */}
          <div className="relative mb-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 dark:from-white dark:via-primary-400 dark:to-purple-400 bg-clip-text text-transparent mb-4 leading-tight">
              Your Cinematic
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 dark:from-purple-400 dark:via-pink-400 dark:to-red-400 bg-clip-text text-transparent">
                Universe Awaits
              </span>
            </h1>
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-60 animate-bounce delay-300"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-60 animate-bounce delay-700"></div>
          </div>
          
          {/* Enhanced Description */}
          <div className="max-w-4xl mx-auto mb-8">
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium mb-4">
              Discover blockbusters, indie gems, and timeless classics.
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
              Curate your perfect movie vault with our intelligent recommendations and powerful filtering tools.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-md">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Curated Collections</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-md">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Trending Now</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-md">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Coming Soon</span>
            </div>
          </div>

          {/* Call to Action */}
          <div className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 font-medium group cursor-pointer">
            <span>Start exploring</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </div>



        {/* Category Tabs and Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2 p-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
            {[
              { id: 'popular', label: 'Popular', icon: TrendingUp },
              { id: 'top-rated', label: 'Top Rated', icon: Star },
              { id: 'upcoming', label: 'Coming Soon', icon: Calendar }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Filter Component */}
          <MovieFilter
            onFilterChange={handleFilterChange}
            isLoading={loading}
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-2xl mb-8 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => loadAllMovies()}
                className="px-4 py-2 bg-red-100 dark:bg-red-800/30 hover:bg-red-200 dark:hover:bg-red-800/50 rounded-lg transition-colors font-medium"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <MovieGridSkeleton />
        ) : (
          <>
            {/* Movies Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-12">
              {movies.map((movie, index) => (
                <MovieCard key={movie.id} movie={movie} index={index} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && activeTab === 'popular' && (
              <div className="flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="group flex items-center space-x-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Loading more movies...</span>
                    </>
                  ) : (
                    <>
                      <span>Load More Movies</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* No More Movies */}
            {!hasMore && movies.length > 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-6 py-3 rounded-full">
                  <Sparkles className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    You've explored all available movies!
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}