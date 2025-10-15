import { Movie } from './types'

const FAVORITES_KEY = 'movie_favorites'

export class FavoritesManager {
  static getFavorites(): Movie[] {
    if (typeof window === 'undefined') return []
    
    try {
      const favorites = localStorage.getItem(FAVORITES_KEY)
      return favorites ? JSON.parse(favorites) : []
    } catch (error) {
      console.error('Error loading favorites:', error)
      return []
    }
  }

  static addToFavorites(movie: Movie): void {
    if (typeof window === 'undefined') return
    
    try {
      const favorites = this.getFavorites()
      const isAlreadyFavorite = favorites.some(fav => fav.id === movie.id)
      
      if (!isAlreadyFavorite) {
        const updatedFavorites = [...favorites, movie]
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites))
      }
    } catch (error) {
      console.error('Error adding to favorites:', error)
    }
  }

  static removeFromFavorites(movieId: number): void {
    if (typeof window === 'undefined') return
    
    try {
      const favorites = this.getFavorites()
      const updatedFavorites = favorites.filter(movie => movie.id !== movieId)
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites))
    } catch (error) {
      console.error('Error removing from favorites:', error)
    }
  }

  static isFavorite(movieId: number): boolean {
    if (typeof window === 'undefined') return false
    
    try {
      const favorites = this.getFavorites()
      return favorites.some(movie => movie.id === movieId)
    } catch (error) {
      console.error('Error checking favorite status:', error)
      return false
    }
  }

  static toggleFavorite(movie: Movie): boolean {
    const isFav = this.isFavorite(movie.id)
    
    if (isFav) {
      this.removeFromFavorites(movie.id)
      return false
    } else {
      this.addToFavorites(movie)
      return true
    }
  }
}