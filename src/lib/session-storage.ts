// Utility for managing additional session data in localStorage
// This complements NextAuth.js cookies for enhanced user experience

interface UserPreferences {
  theme: 'light' | 'dark'
  favoriteGenres: string[]
  lastVisited: string
  searchHistory: string[]
}

interface SessionData {
  userId: string
  preferences: UserPreferences
  lastActivity: string
}

const SESSION_KEY = 'cinevault-session'
const MAX_SEARCH_HISTORY = 10

export class SessionStorage {
  static getSessionData(userId: string): SessionData | null {
    if (typeof window === 'undefined') return null
    
    try {
      const stored = localStorage.getItem(SESSION_KEY)
      if (!stored) return null
      
      const data = JSON.parse(stored)
      return data.userId === userId ? data : null
    } catch (error) {
      console.error('Error reading session data:', error)
      return null
    }
  }

  static setSessionData(userId: string, preferences: Partial<UserPreferences>): void {
    if (typeof window === 'undefined') return
    
    try {
      const existing = this.getSessionData(userId)
      const sessionData: SessionData = {
        userId,
        preferences: {
          theme: 'light',
          favoriteGenres: [],
          lastVisited: '/',
          searchHistory: [],
          ...existing?.preferences,
          ...preferences,
        },
        lastActivity: new Date().toISOString(),
      }
      
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData))
    } catch (error) {
      console.error('Error saving session data:', error)
    }
  }

  static addToSearchHistory(userId: string, query: string): void {
    if (!query.trim()) return
    
    const sessionData = this.getSessionData(userId)
    const currentHistory = sessionData?.preferences.searchHistory || []
    
    // Remove if already exists and add to beginning
    const filteredHistory = currentHistory.filter(item => 
      item.toLowerCase() !== query.toLowerCase()
    )
    const newHistory = [query, ...filteredHistory].slice(0, MAX_SEARCH_HISTORY)
    
    this.setSessionData(userId, { searchHistory: newHistory })
  }

  static getSearchHistory(userId: string): string[] {
    const sessionData = this.getSessionData(userId)
    return sessionData?.preferences.searchHistory || []
  }

  static updateLastVisited(userId: string, path: string): void {
    this.setSessionData(userId, { lastVisited: path })
  }

  static clearSessionData(): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.removeItem(SESSION_KEY)
    } catch (error) {
      console.error('Error clearing session data:', error)
    }
  }

  static isSessionExpired(userId: string, maxAgeHours: number = 24 * 30): boolean {
    const sessionData = this.getSessionData(userId)
    if (!sessionData) return true
    
    const lastActivity = new Date(sessionData.lastActivity)
    const now = new Date()
    const hoursDiff = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60)
    
    return hoursDiff > maxAgeHours
  }
}