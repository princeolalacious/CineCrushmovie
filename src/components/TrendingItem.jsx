import { Link } from 'react-router-dom'
import Icon from './Icon'
import { IMAGE_URL } from '../api/tmdb'
import { useGenres } from '../context/GenresContext'

// One row in the "Trending This Week" list. "rank" is 1, 2, 3...
function TrendingItem({ movie, rank, className = '' }) {
  const { getGenreNames } = useGenres()
  const genreText = getGenreNames(movie.genre_ids, 2).join(' / ')

  // Rank 1 gets the gold badge, the others a grey one
  const rankStyle = rank === 1 ? 'bg-gold text-gold-dark' : 'bg-line text-ink'

  return (
    <Link
      to={`/movie/${movie.id}`}
      className={`relative gap-4 overflow-hidden rounded-2xl bg-surface p-4 transition duration-200 hover:-translate-y-1 ${className}`}
    >
      {/* Big faded number in the background */}
      <span className="absolute -top-3 right-4 text-[100px] font-extrabold leading-none text-white/5">
        {String(rank).padStart(2, '0')}
      </span>

      {/* Poster + rank badge */}
      <div className="relative h-36 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-3">
        {movie.poster_path && (
          <img
            src={`${IMAGE_URL}${movie.poster_path}`}
            alt={movie.title}
            loading="lazy"
            className="size-full object-cover"
          />
        )}
        <span
          className={`absolute bottom-2 left-1/2 flex size-6 -translate-x-1/2 items-center justify-center rounded-md text-[11px] font-extrabold ${rankStyle}`}
        >
          {rank}
        </span>
      </div>

      {/* Info */}
      <div className="relative flex min-w-0 flex-col justify-between py-1">
        <div className="flex flex-col gap-1">
          <span className="w-fit rounded bg-mint/15 px-2 py-0.5 text-[10px] font-bold text-mint">
            Trending
          </span>
          <h3 className="truncate text-base font-bold">{movie.title}</h3>
          <p className="text-xs text-soft">{genreText}</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 font-bold text-gold">
            <Icon name="star" className="text-sm" />
            {movie.vote_average.toFixed(1)}
          </span>
          <span className="text-muted">•</span>
          <span className="text-[11px] text-muted">{movie.vote_count.toLocaleString()} votes</span>
        </div>
      </div>
    </Link>
  )
}

export default TrendingItem
