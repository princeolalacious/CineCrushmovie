import { createContext, useContext, useEffect, useState } from 'react'
import { getGenres } from '../api/tmdb'

const GenresContext = createContext(null)

export function GenresProvider({ children }) {
  const [genres, setGenres] = useState([])

  useEffect(() => {
    getGenres()
      .then(setGenres)
      .catch(() => {}) // the pages show their own error if TMDB is not reachable
  }, [])

  // [28, 12] -> ['Action', 'Adventure']
  function getGenreNames(ids = [], max = 2) {
    return ids
      .map((id) => genres.find((g) => g.id === id)?.name)
      .filter(Boolean)
      .slice(0, max)
  }

  return <GenresContext.Provider value={{ genres, getGenreNames }}>{children}</GenresContext.Provider>
}

// Use it in any component:  const { genres } = useGenres()
export function useGenres() {
  return useContext(GenresContext)
}
