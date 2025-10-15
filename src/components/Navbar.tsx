'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useTheme } from '@/lib/theme-context'
import { Search, Heart, Moon, Sun, LogOut, User, Menu, X, Film } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setIsSearchFocused(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    setIsMobileMenuOpen(false)
    router.push('/login')
  }

  const isActivePath = (path: string) => pathname === path

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50' 
        : 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 space-x-6">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group flex-shrink-0">
            <div className="relative">
              <Film className="w-8 h-8 text-primary-600 group-hover:text-primary-700 transition-colors duration-200" />
              <div className="absolute -inset-1 bg-primary-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">
              CineVault
            </span>
          </Link>

          {/* Desktop Navigation - Home First */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-2">
              {/* Home Link */}
              <Link
                href="/"
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 group ${
                  isActivePath('/')
                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Film className={`w-5 h-5 transition-all duration-200 ${
                  isActivePath('/') 
                    ? 'scale-110' 
                    : 'group-hover:scale-110'
                }`} />
                <span className="font-medium">Home</span>
              </Link>

              {/* Favorites Link */}
              <Link
                href="/favorites"
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 group ${
                  isActivePath('/favorites')
                    ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Heart className={`w-5 h-5 transition-all duration-200 ${
                  isActivePath('/favorites') 
                    ? 'fill-current scale-110' 
                    : 'group-hover:scale-110'
                }`} />
                <span className="font-medium">Favorites</span>
              </Link>
            </div>
          )}

          {/* Search Bar - Desktop */}
          {isAuthenticated && (
            <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-2xl">
              <div className={`relative transition-all duration-300 ${
                isSearchFocused ? 'transform scale-105' : ''
              }`}>
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                  isSearchFocused ? 'text-primary-500' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  placeholder="Search for movies, actors, genres..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={`w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 ${
                    isSearchFocused 
                      ? 'ring-2 ring-primary-500 shadow-lg' 
                      : 'shadow-md hover:shadow-lg'
                  }`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Right Side Navigation */}
          <div className="hidden md:flex items-center space-x-2 flex-shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-primary-600 transition-colors" />
              ) : (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-yellow-500 transition-colors" />
              )}
            </button>

            {isAuthenticated ? (
              <>
                {/* User Menu */}
                <div className="flex items-center space-x-3 ml-4">
                  <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border border-primary-200 dark:border-primary-700">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user?.name}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-all duration-200 group"
                  >
                    <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="btn-ghost"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 space-y-4 fade-in">
            {/* Mobile Search */}
            {isAuthenticated && (
              <form onSubmit={handleSearch} className="px-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search movies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field pl-12 pr-4 py-3 rounded-2xl"
                  />
                </div>
              </form>
            )}

            {/* Mobile Navigation Items */}
            <div className="space-y-2 px-2">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
                <span className="text-gray-700 dark:text-gray-300">
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </span>
              </button>

              {isAuthenticated ? (
                <>
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Film className="w-5 h-5 text-primary-500" />
                    <span className="text-gray-700 dark:text-gray-300">Home</span>
                  </Link>

                  <Link
                    href="/favorites"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="text-gray-700 dark:text-gray-300">Favorites</span>
                  </Link>

                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full block text-center btn-ghost"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full block text-center btn-primary"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}