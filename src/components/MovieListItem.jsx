import { Link } from 'react-router-dom'
import Icon from './Icon'
import { IMAGE_URL } from '../api/tmdb'
import { useFavorites } from '../context/FavoritesContext'
import { useGenres } from '../context/GenresContext'
import { getYear } from '../utils/format'

// The "list view" version of a movie: a row instead of a poster card.
function MovieListItem({ movie }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { getGenreNames } = useGenres()
  const saved = isFavorite(movie.id)

  return (
    <div className="flex items-center gap-4 rounded-xl bg-surface-2 p-3">
      <Link to={`/movie/${movie.id}`} className="flex min-w-0 flex-1 items-center gap-4">
        <div className="h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-3">
          {movie.poster_path && (
            <img src={`${IMAGE_URL}${movie.poster_path}`} alt="" loading="lazy" className="size-full object-cover" />
          )}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold">{movie.title}</h3>
          <p className="truncate text-xs text-muted">{getGenreNames(movie.genre_ids, 3).join(' • ')}</p>
          <p className="mt-2 flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 font-bold text-gold">
              <Icon name="star" className="text-sm" />
              {(movie.vote_average || 0).toFixed(1)}
            </span>
            <span className="text-muted">•</span>
            <span className="text-soft">{getYear(movie.release_date)}</span>
          </p>
        </div>
      </Link>
      <button
        onClick={() => toggleFavorite(movie)}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
        className={`flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-3 text-xl ${
          saved ? 'text-gold' : 'text-ink'
        }`}
      >
        <Icon name={saved ? 'favorite' : 'favorite_border'} />
      </button>
    </div>
  )
}

export default MovieListItem
