import { useState } from 'react'
import Icon from '../Icon'
import { useFavorites } from '../../context/FavoritesContext'
import { formatRuntime, getYear, languageName } from '../../utils/format'

// One small box in the facts grid (Release, Runtime, ...)
function Fact({ icon, label, value, iconClass = 'text-muted' }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg bg-surface-2 p-3">
      <Icon name={icon} className={`text-[22px] ${iconClass}`} />
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted">{label}</p>
        <p className="truncate text-sm font-bold">{value}</p>
      </div>
    </div>
  )
}

// Title, credits, facts, genres and the action buttons.
function MovieInfo({ movie, director, writer, certification, hasTrailer, onWatchTrailer }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const [copied, setCopied] = useState(false)
  const saved = isFavorite(movie.id)

  // Share: use the phone's share sheet if there is one, otherwise copy the link.
  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({ title: movie.title, url: window.location.href })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      // the person closed the share sheet - nothing to do
    }
  }

  const company = movie.production_companies?.[0]?.name

  return (
    <div className="flex flex-col gap-6 pt-2">
      {/* Company + title + credits */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          {company && (
            <span className="rounded bg-surface-2 px-2.5 py-0.5 text-[11px] font-extrabold text-gold">{company}</span>
          )}
          {movie.original_title !== movie.title && (
            <span className="text-xs font-medium text-muted">{movie.original_title}</span>
          )}
        </div>
        <h1 className="text-4xl font-extrabold md:text-5xl">{movie.title}</h1>
        <p className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
          {director && (
            <>
              <span className="font-medium">Directed by</span>
              <span className="font-bold text-ink">{director}</span>
            </>
          )}
          {director && writer && <span className="text-line">•</span>}
          {writer && <span>Written by {writer}</span>}
        </p>
      </div>

      {movie.tagline && <blockquote className="text-base font-light text-muted">“{movie.tagline}”</blockquote>}

      {/* Facts grid */}
      <div className="grid grid-cols-2 gap-3 rounded-xl bg-surface p-3.5 lg:grid-cols-3">
        <Fact
          icon="star"
          label={`${(movie.vote_count || 0).toLocaleString()} votes`}
          value={`${(movie.vote_average || 0).toFixed(1)} / 10`}
          iconClass="text-gold"
        />
        <Fact icon="calendar_today" label="Release" value={getYear(movie.release_date) || 'TBA'} />
        <Fact icon="schedule" label="Runtime" value={formatRuntime(movie.runtime) || 'N/A'} />
        <Fact icon="verified_user" label="Rating" value={certification || 'Not rated'} iconClass="text-[#ffb4ab]" />
        <Fact
          icon="language"
          label="Language"
          value={languageName(movie.original_language)}
          iconClass="text-sky"
        />
      </div>

      {/* Genres */}
      {movie.genres?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {movie.genres.map((genre) => (
            <span key={genre.id} className="rounded-full bg-surface-2 px-3.5 py-1.5 text-xs font-semibold">
              {genre.name}
            </span>
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => toggleFavorite(movie)}
          aria-pressed={saved}
          className={`flex h-12 items-center gap-2.5 rounded-xl px-6 text-sm font-bold active:scale-[.98] ${
            saved ? 'bg-gold text-gold-dark hover:bg-gold-hover' : 'bg-surface-3 text-ink hover:bg-line'
          }`}
        >
          <Icon name={saved ? 'favorite' : 'favorite_border'} className="text-xl" />
          {saved ? 'Added to Favorites' : 'Add to Favorites'}
        </button>

        {hasTrailer && (
          <button
            onClick={onWatchTrailer}
            className="flex h-12 items-center gap-2 rounded-xl bg-surface-3 px-5 text-sm font-semibold hover:bg-line"
          >
            <Icon name="smart_display" className="text-xl text-sky" />
            Watch Trailer
          </button>
        )}

        {movie.homepage && (
          <a
            href={movie.homepage}
            target="_blank"
            rel="noreferrer"
            className="flex h-12 items-center gap-2 rounded-xl bg-royal px-5 text-sm font-semibold text-[#dce3ff] hover:brightness-110"
          >
            <Icon name="open_in_new" className="text-xl" />
            Official Site
          </a>
        )}

        <button
          onClick={handleShare}
          aria-label="Share this movie"
          className="flex h-12 items-center gap-2 rounded-xl bg-surface-3 px-4 text-sm font-semibold text-muted hover:bg-line"
        >
          <Icon name="share" className="text-xl" />
          {copied && <span className="text-xs">Link copied</span>}
        </button>
      </div>
    </div>
  )
}

export default MovieInfo
