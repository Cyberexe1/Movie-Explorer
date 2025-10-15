import { Movie, MovieDetails, TMDBResponse } from './types'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY

if (!TMDB_API_KEY) {
  throw new Error('TMDB API key is required. Please add NEXT_PUBLIC_TMDB_API_KEY to your environment variables.')
}

class TMDBApi {
  private async fetchFromTMDB<T>(endpoint: string): Promise<T> {
    const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${TMDB_API_KEY}`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`)
    }
    
    return response.json()
  }

  async getPopularMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    return this.fetchFromTMDB<TMDBResponse<Movie>>(`/movie/popular?page=${page}`)
  }

  async searchMovies(query: string, page: number = 1): Promise<TMDBResponse<Movie>> {
    const encodedQuery = encodeURIComponent(query)
    return this.fetchFromTMDB<TMDBResponse<Movie>>(`/search/movie?query=${encodedQuery}&page=${page}`)
  }

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    return this.fetchFromTMDB<MovieDetails>(`/movie/${movieId}`)
  }

  async getTopRatedMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    return this.fetchFromTMDB<TMDBResponse<Movie>>(`/movie/top_rated?page=${page}`)
  }

  async getUpcomingMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    return this.fetchFromTMDB<TMDBResponse<Movie>>(`/movie/upcoming?page=${page}`)
  }

  getImageUrl(path: string | null, size: 'w200' | 'w300' | 'w500' | 'w780' | 'original' = 'w500'): string {
    if (!path) return '/placeholder-movie.svg'
    return `https://image.tmdb.org/t/p/${size}${path}`
  }
}

export const tmdbApi = new TMDBApi()