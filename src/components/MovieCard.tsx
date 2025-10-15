'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Movie } from '@/lib/types'
import { tmdbApi } from '@/lib/tmdb'
import { FavoritesManager } from '@/lib/favorites'
import { Heart, Star, Play, Calendar, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'

interface MovieCardProps {
  movie: Movie
  onFavoriteChange?: () => void
  index?: number
}

export default function MovieCard({ movie, onFavoriteChange, index = 0 }: MovieCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    setIsFavorite(FavoritesManager.isFavorite(movie.id))
  }, [movie.id])

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsLoading(true)
    
    try {
      const newFavoriteStatus = FavoritesManager.toggleFavorite(movie)
      setIsFavorite(newFavoriteStatus)
      onFavoriteChange?.()
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatRating = (rating: number) => {
    return rating.toFixed(1)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBA'
    return new Date(dateString).getFullYear().toString()
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-400 bg-green-500/20'
    if (rating >= 7) return 'text-yellow-400 bg-yellow-500/20'
    if (rating >= 6) return 'text-orange-400 bg-orange-500/20'
    return 'text-red-400 bg-red-500/20'
  }

  const getPopularityBadge = (popularity: number) => {
    if (popularity > 100) return { label: 'Trending', icon: TrendingUp, color: 'text-purple-400 bg-purple-500/20' }
    if (popularity > 50) return { label: 'Popular', icon: Star, color: 'text-blue-400 bg-blue-500/20' }
    return null
  }

  const popularityBadge = getPopularityBadge(movie.popularity)

  return (
    <div 
      className="group relative"
      style={{ 
        animationDelay: `${index * 100}ms`,
        animation: 'slideUp 0.6s ease-out forwards'
      }}
    >
      <Link href={`/movie/${movie.id}`}>
        <div 
          className="card-interactive overflow-hidden relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Movie Poster */}
          <div className="relative aspect-[2/3] overflow-hidden bg-gray-200 dark:bg-gray-700">
            {!imageLoaded && (
              <div className="absolute inset-0 shimmer rounded-t-2xl" />
            )}
            
            <Image
              src={tmdbApi.getImageUrl(movie.poster_path, 'w500')}
              alt={movie.title}
              fill
              className={`object-cover transition-all duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              } ${isHovered ? 'scale-110' : 'scale-100'}`}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageLoaded(true)
                // You could set a fallback image here if needed
              }}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
            
            {/* Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`} />
            
            {/* Play Button */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}>
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 hover:bg-white/30 transition-all duration-200">
                <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
              </div>
            </div>

            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex flex-col space-y-2">
              {/* Rating Badge */}
              <div className={`px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1 backdrop-blur-sm ${getRatingColor(movie.vote_average)}`}>
                <Star className="w-3 h-3 fill-current" />
                <span>{formatRating(movie.vote_average)}</span>
              </div>
              
              {/* Popularity Badge */}
              {popularityBadge && (
                <div className={`px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1 backdrop-blur-sm ${popularityBadge.color}`}>
                  <popularityBadge.icon className="w-3 h-3" />
                  <span>{popularityBadge.label}</span>
                </div>
              )}
            </div>

            {/* Favorite Button */}
            <button
              onClick={handleFavoriteToggle}
              disabled={isLoading}
              className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-sm transition-all duration-300 transform ${
                isFavorite 
                  ? 'bg-red-500/90 text-white scale-110' 
                  : 'bg-black/40 text-white hover:bg-red-500/90 hover:scale-110'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart 
                className={`w-4 h-4 transition-all duration-200 ${
                  isFavorite ? 'fill-current scale-110' : ''
                } ${isLoading ? 'animate-pulse' : ''}`} 
              />
            </button>
          </div>

          {/* Movie Info */}
          <div className="p-5 space-y-3 min-h-[180px] flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 text-lg leading-tight">
                {movie.title}
              </h3>
              
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(movie.release_date)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>{movie.vote_count.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {movie.overview && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-4 leading-relaxed">
                {movie.overview}
              </p>
            )}

            {/* Progress Bar for Rating */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Rating</span>
                <span>{formatRating(movie.vote_average)}/10</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-1000 ${
                    movie.vote_average >= 8 ? 'bg-green-500' :
                    movie.vote_average >= 7 ? 'bg-yellow-500' :
                    movie.vote_average >= 6 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(movie.vote_average / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Hover Glow Effect */}
          <div className={`absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10`} />
        </div>
      </Link>
    </div>
  )
}