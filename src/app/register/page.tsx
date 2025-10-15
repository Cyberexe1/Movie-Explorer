'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Film, Mail, Lock, User, ArrowRight, Sparkles, Check } from 'lucide-react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  
  const { register, isAuthenticated } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push('/')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)

    const result = await register(name, email, password)
    
    if (result.success) {
      router.push('/')
    } else {
      setError(result.error || 'Registration failed. Please try again.')
    }
    
    setLoading(false)
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 6) strength++
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++
    if (password.match(/\d/)) strength++
    if (password.match(/[^a-zA-Z\d]/)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(password)
  const passwordsMatch = password && confirmPassword && password === confirmPassword

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-primary-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-primary-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-primary-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-primary-500 rounded-2xl mb-6 shadow-lg">
            <Film className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
            Join CineVault
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Create your account and unlock the ultimate movie experience
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full name
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${
                  focusedField === 'name' ? 'text-primary-500' : 'text-gray-400'
                }`}>
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-12 pr-4 py-4 border rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 ${
                    focusedField === 'name'
                      ? 'border-primary-300 dark:border-primary-600 shadow-lg' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${
                  focusedField === 'email' ? 'text-primary-500' : 'text-gray-400'
                }`}>
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-12 pr-4 py-4 border rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 ${
                    focusedField === 'email'
                      ? 'border-primary-300 dark:border-primary-600 shadow-lg' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${
                  focusedField === 'password' ? 'text-primary-500' : 'text-gray-400'
                }`}>
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-12 pr-12 py-4 border rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 ${
                    focusedField === 'password'
                      ? 'border-primary-300 dark:border-primary-600 shadow-lg' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          passwordStrength >= level
                            ? passwordStrength === 1 ? 'bg-red-500'
                            : passwordStrength === 2 ? 'bg-yellow-500'
                            : passwordStrength === 3 ? 'bg-blue-500'
                            : 'bg-green-500'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${
                    passwordStrength === 1 ? 'text-red-600'
                    : passwordStrength === 2 ? 'text-yellow-600'
                    : passwordStrength === 3 ? 'text-blue-600'
                    : 'text-green-600'
                  }`}>
                    {passwordStrength === 1 && 'Weak password'}
                    {passwordStrength === 2 && 'Fair password'}
                    {passwordStrength === 3 && 'Good password'}
                    {passwordStrength === 4 && 'Strong password'}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm password
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${
                  focusedField === 'confirmPassword' ? 'text-primary-500' : 'text-gray-400'
                }`}>
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-12 pr-12 py-4 border rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 ${
                    focusedField === 'confirmPassword'
                      ? 'border-primary-300 dark:border-primary-600 shadow-lg' 
                      : confirmPassword && passwordsMatch
                      ? 'border-green-300 dark:border-green-600'
                      : confirmPassword && !passwordsMatch
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Confirm your password"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  {confirmPassword && (
                    <div className="mr-2">
                      {passwordsMatch ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-red-500"></div>
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full bg-gradient-to-r from-purple-500 to-primary-500 hover:from-purple-600 hover:to-primary-600 text-white font-medium py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Creating your account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium hover:underline transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="bg-gradient-to-r from-primary-50/80 to-purple-50/80 dark:from-primary-900/20 dark:to-purple-900/20 backdrop-blur-sm border border-primary-200/50 dark:border-primary-800/50 rounded-2xl p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-primary-800 dark:text-primary-200 mb-2">
                What you'll get with CineVault
              </h3>
              <ul className="text-xs text-primary-600 dark:text-primary-300 space-y-1">
                <li>• Discover trending and popular movies</li>
                <li>• Create your personal favorites collection</li>
                <li>• Search through thousands of movies</li>
                <li>• Get detailed movie information and ratings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}