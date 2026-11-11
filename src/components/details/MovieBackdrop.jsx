import { Link } from 'react-router-dom'
import Icon from '../Icon'
import { BACKDROP_URL } from '../../api/tmdb'

// The wide picture at the top of the page, with the breadcrumb
// ("Browse / Drama / Oppenheimer") and the release status.
function MovieBackdrop({ movie }) {
  const firstGenre = movie.genres?.[0]?.name

  return (
    <div className="relative h-[348px] overflow-hidden bg-surface md:h-[420px]">
      {movie.backdrop_path && (
        <img
          src={`${BACKDROP_URL}${movie.backdrop_path}`}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
      )}
      {/* dark layers keep the text readable */}
      <div className="absolute inset-0 bg-linear-to-t from-page via-page/60 to-page/30" />

      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 pt-6">
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2 text-xs text-muted">
          <Link to="/" className="flex items-center gap-1.5 hover:text-gold">
            <Icon name="arrow_back" className="text-base" />
            Browse
          </Link>
          {firstGenre && (
            <>
              <span className="text-line">/</span>
              <span className="hidden sm:inline">{firstGenre}</span>
              <span className="hidden text-line sm:inline">/</span>
            </>
          )}
          <span className="truncate font-bold text-ink">{movie.title}</span>
        </nav>

        {movie.status && (
          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-[11px] font-semibold text-mint">
            {movie.status}
            <span className="size-1.5 rounded-full bg-mint" />
          </span>
        )}
      </div>
    </div>
  )
}

export default MovieBackdrop
