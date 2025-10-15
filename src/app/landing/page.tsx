'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Film, Search, Heart, TrendingUp, Sparkles } from 'lucide-react'

export default function LandingPage() {
    const { isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    // Redirect authenticated users to main app
    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.replace('/')
        }
    }, [isAuthenticated, isLoading, router])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
            </div>
        )
    }

    if (isAuthenticated) {
        return null // Will redirect
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
            {/* Navigation */}
            <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <Film className="w-8 h-8 text-primary-600" />
                                <div className="absolute -inset-1 bg-primary-600/20 rounded-full blur opacity-75"></div>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                                CineVault
                            </span>
                        </div>

                        {/* Auth Buttons */}
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/login"
                                className="px-6 py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-r from-primary-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                {/* Hero Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <div className="mb-8">
                        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-100 to-purple-100 dark:from-primary-900/20 dark:to-purple-900/20 px-4 py-2 rounded-full mb-6">
                            <Sparkles className="w-4 h-4 text-primary-600" />
                            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                                Welcome to CineVault
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 dark:from-white dark:via-primary-400 dark:to-purple-400 bg-clip-text text-transparent mb-6 leading-tight">
                            Your Ultimate
                            <br />
                            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 dark:from-purple-400 dark:via-pink-400 dark:to-red-400 bg-clip-text text-transparent">
                                Movie Experience
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
                            Discover, explore, and curate your perfect movie collection. From blockbusters to indie gems,
                            find your next favorite film with our intelligent recommendations.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                            <Link
                                href="/register"
                                className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
                            >
                                <span>Start Exploring</span>
                                <Film className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            </Link>

                            <Link
                                href="/login"
                                className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-2xl shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-600 transform hover:scale-105 transition-all duration-200"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                        <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-6 transition-transform">
                                <Search className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Smart Discovery</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Find movies with our advanced search and filtering system. Discover by genre, year, rating, and more.
                            </p>
                        </div>

                        <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-6 transition-transform">
                                <Heart className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Personal Collection</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Build your personal movie vault. Save favorites, create watchlists, and never lose track of great films.
                            </p>
                        </div>

                        <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-6 transition-transform">
                                <TrendingUp className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Trending Content</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Stay updated with the latest releases, trending movies, and top-rated films from around the world.
                            </p>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="bg-gradient-to-r from-primary-500/10 to-purple-500/10 backdrop-blur-sm rounded-3xl p-12 border border-primary-200/30 dark:border-primary-700/30">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                            Join Thousands of Movie Enthusiasts
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="text-4xl font-black bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                    50K+
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 font-medium">Movies Available</p>
                            </div>

                            <div className="text-center">
                                <div className="text-4xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                                    10K+
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 font-medium">Active Users</p>
                            </div>

                            <div className="text-center">
                                <div className="text-4xl font-black bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent mb-2">
                                    1M+
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 font-medium">Movies Favorited</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <Film className="w-6 h-6 text-primary-400" />
                        <span className="text-xl font-bold">CineVault</span>
                    </div>
                    <p className="text-gray-400">
                        Your ultimate movie discovery platform. Built with ❤️ for movie lovers.
                    </p>
                </div>
            </footer>
        </div>
    )
}