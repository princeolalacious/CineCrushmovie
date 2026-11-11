// All TMDB (The Movie Database) requests live in this one file.
// Components call these small functions instead of writing fetch() everywhere.

const BASE_URL = 'https://api.themoviedb.org/3'
const TOKEN = import.meta.env.VITE_TMDB_TOKEN

// TMDB only gives us the END of an image URL (e.g. "/abc.jpg"),
// so we add this start part to make a full link.
export const IMAGE_URL = 'https://image.tmdb.org/t/p/w500' // posters
export const BACKDROP_URL = 'https://image.tmdb.org/t/p/w1280' // big background pictures
export const PROFILE_URL = 'https://image.tmdb.org/t/p/w185' // actor photos

// One helper that every request goes through.
// "signal" lets us cancel a request we no longer need (see AbortController).
async function get(path, signal) {
  const response = await fetch(`${BASE_URL}${path}`, {
    signal,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`TMDB request failed (${response.status}). Check your token in .env`)
  }
  return response.json()
}

// List of genres: [{ id: 28, name: 'Action' }, ...]
// We remember the answer so the genre list is only downloaded once.
let genresPromise = null
export function getGenres() {
  if (!genresPromise) {
    genresPromise = get('/genre/movie/list')
      .then((data) => data.genres)
      .catch((error) => {
        genresPromise = null // allow a retry later
        throw error
      })
  }
  return genresPromise
}

// Popular movies. If a genreId is given, only movies of that genre.
export async function getPopularMovies(genreId) {
  if (genreId) {
    const data = await get(`/discover/movie?with_genres=${genreId}&sort_by=popularity.desc`)
    return data.results
  }
  const data = await get('/movie/popular')
  return data.results
}

// Movies trending this week
export async function getTrendingMovies() {
  const data = await get('/trending/movie/week')
  return data.results
}

// Used by the home banner: runtime + age rating
export async function getMovieDetails(id) {
  return get(`/movie/${id}?append_to_response=release_dates`)
}

// Search by title. Returns { results, total_results, total_pages, page }
export async function searchMovies(query, page = 1, signal) {
  return get(
    `/search/movie?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`,
    signal,
  )
}

// Everything the details page needs in ONE request:
// movie info + cast/crew + videos + similar movies + age ratings
export async function getMovieFull(id, signal) {
  return get(`/movie/${id}?append_to_response=credits,videos,similar,release_dates`, signal)
}

// Movies similar to another movie (used on the search page)
export async function getSimilarMovies(id, signal) {
  const data = await get(`/movie/${id}/similar`, signal)
  return data.results
}
