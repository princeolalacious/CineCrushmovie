import { Link } from 'react-router-dom'
import Icon from './Icon'
import { IMAGE_URL } from '../api/tmdb'
import { useFavorites } from '../context/FavoritesContext'
import { useGenres } from '../context/GenresContext'
import { getMatchPercent, getYear } from '../utils/format'

// One poster card. Click it to open the details page.
// The heart button saves the movie to favorites.
function MovieCard({ movie }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { getGenreNames } = useGenres()

  const saved = isFavorite(movie.id)
  const genreText = getGenreNames(movie.genre_ids, 2).join(' • ')

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-surface-2 shadow-[0_8px_24px_rgba(0,0,0,.22)] transition duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(0,0,0,.34)]">
      <Link to={`/movie/${movie.id}`} className="flex flex-1 flex-col">
        {/* Poster (always 2:3 so the grid never jumps) */}
        <div className="relative aspect-2/3 overflow-hidden bg-surface-3">
          {movie.poster_path ? (
            <img
              src={`${IMAGE_URL}${movie.poster_path}`}
              alt={movie.title}
              loading="lazy"
              className="size-full object-cover transition duration-200 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-4xl text-line">
              <Icon name="movie" />
            </div>
          )}
          <span className="absolute left-2.5 top-2.5 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold text-mint">
            {getMatchPercent(movie.vote_average)}%
          </span>
        </div>

        {/* Title, genres, rating + year */}
        <div className="flex flex-1 flex-col justify-between gap-3 p-3">
          <div>
            <h3 className="truncate text-sm font-bold">{movie.title}</h3>
            <p className="truncate text-[11px] text-muted">{genreText || '\u00A0'}</p>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-surface-3 px-2 py-1.5 text-[11px]">
            <span className="flex items-center gap-1 font-bold">
              <Icon name="star" className="text-[13px] text-gold" />
              {(movie.vote_average || 0).toFixed(1)}
            </span>
            <span className="font-medium text-soft">{getYear(movie.release_date)}</span>
          </div>
        </div>
      </Link>

      {/* Heart is outside the Link so a click doesn't open the details page */}
      <button
        onClick={() => toggleFavorite(movie)}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
        className={`absolute right-2.5 top-2.5 flex size-8 items-center justify-center rounded-full bg-black/60 text-lg active:scale-110 ${
          saved ? 'text-gold' : 'text-ink'
        }`}
      >
        <Icon name={saved ? 'favorite' : 'favorite_border'} />
      </button>
    </div>
  )
}

export default MovieCard
