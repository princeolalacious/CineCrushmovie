import { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'cinescope:favorites:v1'
const FavoritesContext = createContext(null)

// Read saved movies from the browser. If anything is wrong, start with an empty list.
function loadFavorites() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(data) ? data.filter((m) => m && typeof m.id === 'number') : []
  } catch {
    return []
  }
}

// We only keep the few fields we need to show a card, even offline.
function toSavedMovie(movie) {
  return {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path || null,
    vote_average: movie.vote_average || 0,
    release_date: movie.release_date || '',
    // list results have genre_ids, the details page has genres: [{id, name}]
    genre_ids: movie.genre_ids || (movie.genres || []).map((g) => g.id),
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(loadFavorites)
  const [toast, setToast] = useState(null) // { message, detail?, onUndo? }

  // Save to the browser whenever the list changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // storage can be full or blocked - the app still works, it just won't remember
    }
  }, [favorites])

  // Keep other open tabs in sync.
  useEffect(() => {
    function handleStorage(event) {
      if (event.key === STORAGE_KEY) setFavorites(loadFavorites())
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // Hide the toast after 4 seconds.
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(timer)
  }, [toast])

  function isFavorite(id) {
    return favorites.some((m) => m.id === id)
  }

  function addFavorite(movie) {
    setFavorites((current) =>
      current.some((m) => m.id === movie.id) ? current : [...current, toSavedMovie(movie)],
    )
  }

  // Add the movie, or remove it if it is already saved.
  function toggleFavorite(movie) {
    if (isFavorite(movie.id)) {
      const saved = favorites.find((m) => m.id === movie.id)
      setFavorites((current) => current.filter((m) => m.id !== movie.id))
      setToast({
        message: 'Removed from Favorites',
        detail: 'Tap Undo to restore title instantly',
        onUndo: () => {
          addFavorite(saved)
          setToast(null)
        },
      })
    } else {
      addFavorite(movie)
      setToast({ message: 'Added to Favorites.' })
    }
  }

  function clearFavorites() {
    setFavorites([])
    setToast({ message: 'Favorites cleared' })
  }

  const value = {
    favorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    toast,
    dismissToast: () => setToast(null),
  }

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

// Use it in any component:  const { isFavorite, toggleFavorite } = useFavorites()
export function useFavorites() {
  return useContext(FavoritesContext)
}
