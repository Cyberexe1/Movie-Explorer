'use client'

import { useState, useEffect } from 'react'
import { Filter, X, ChevronDown, Star, Calendar, Clock, Globe } from 'lucide-react'
import { tmdbApi } from '@/lib/tmdb'

interface Genre {
  id: number
  name: string
}

interface FilterOptions {
  genres: number[]
  year: string
  rating: string
  sortBy: string
}

interface MovieFilterProps {
  onFilterChange: (filters: FilterOptions) => void
  isLoading?: boolean
}

export default function MovieFilter({ onFilterChange, isLoading = false }: MovieFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [genres, setGenres] = useState<Genre[]>([])
  const [filters, setFilters] = useState<FilterOptions>({
    genres: [],
    year: '',
    rating: '',
    sortBy: 'popularity.desc'
  })

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

  const sortOptions = [
    { value: 'popularity.desc', label: 'Most Popular' },
    { value: 'vote_average.desc', label: 'Highest Rated' },
    { value: 'release_date.desc', label: 'Newest First' },
    { value: 'release_date.asc', label: 'Oldest First' },
    { value: 'title.asc', label: 'A-Z' },
    { value: 'title.desc', label: 'Z-A' }
  ]

  const ratingOptions = [
    { value: '', label: 'Any Rating' },
    { value: '9', label: '9+ Stars' },
    { value: '8', label: '8+ Stars' },
    { value: '7', label: '7+ Stars' },
    { value: '6', label: '6+ Stars' },
    { value: '5', label: '5+ Stars' }
  ]

  useEffect(() => {
    loadGenres()
  }, [])

  // Remove the automatic useEffect call - let the parent handle when to apply filters

  const loadGenres = async () => {
    try {
      // In a real app, you'd fetch genres from TMDB API
      // For now, we'll use common movie genres
      const commonGenres = [
        { id: 28, name: 'Action' },
        { id: 12, name: 'Adventure' },
        { id: 16, name: 'Animation' },
        { id: 35, name: 'Comedy' },
        { id: 80, name: 'Crime' },
        { id: 99, name: 'Documentary' },
        { id: 18, name: 'Drama' },
        { id: 10751, name: 'Family' },
        { id: 14, name: 'Fantasy' },
        { id: 36, name: 'History' },
        { id: 27, name: 'Horror' },
        { id: 10402, name: 'Music' },
        { id: 9648, name: 'Mystery' },
        { id: 10749, name: 'Romance' },
        { id: 878, name: 'Science Fiction' },
        { id: 10770, name: 'TV Movie' },
        { id: 53, name: 'Thriller' },
        { id: 10752, name: 'War' },
        { id: 37, name: 'Western' }
      ]
      setGenres(commonGenres)
    } catch (error) {
      console.error('Error loading genres:', error)
    }
  }

  const handleGenreToggle = (genreId: number) => {
    const newFilters = {
      ...filters,
      genres: filters.genres.includes(genreId)
        ? filters.genres.filter(id => id !== genreId)
        : [...filters.genres, genreId]
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const newFilters = {
      genres: [],
      year: '',
      rating: '',
      sortBy: 'popularity.desc'
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const hasActiveFilters = filters.genres.length > 0 || filters.year || filters.rating || filters.sortBy !== 'popularity.desc'

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-all duration-200 ${
          hasActiveFilters
            ? 'bg-primary-500 text-white shadow-lg'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
      >
        <Filter className="w-5 h-5" />
        <span>Filters</span>
        {hasActiveFilters && (
          <div className="w-2 h-2 bg-white rounded-full"></div>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 z-50 w-[600px] max-w-[90vw] sm:max-w-[600px] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Filter Movies</h3>
            <div className="flex items-center space-x-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Sort By */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Star className="w-4 h-4" />
                <span>Sort By</span>
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => {
                  const newFilters = { ...filters, sortBy: e.target.value }
                  setFilters(newFilters)
                  onFilterChange(newFilters)
                }}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Release Year */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Calendar className="w-4 h-4" />
                <span>Release Year</span>
              </label>
              <select
                value={filters.year}
                onChange={(e) => {
                  const newFilters = { ...filters, year: e.target.value }
                  setFilters(newFilters)
                  onFilterChange(newFilters)
                }}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Any Year</option>
                {years.map(year => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Minimum Rating */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Star className="w-4 h-4" />
                <span>Minimum Rating</span>
              </label>
              <select
                value={filters.rating}
                onChange={(e) => {
                  const newFilters = { ...filters, rating: e.target.value }
                  setFilters(newFilters)
                  onFilterChange(newFilters)
                }}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {ratingOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Genres */}
          <div className="mt-6">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <Globe className="w-4 h-4" />
              <span>Genres</span>
              {filters.genres.length > 0 && (
                <span className="text-xs bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-2 py-1 rounded-full">
                  {filters.genres.length} selected
                </span>
              )}
            </label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {genres.map(genre => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreToggle(genre.id)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    filters.genres.includes(genre.id)
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}