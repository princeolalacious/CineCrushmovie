import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'
import { BACKDROP_URL, getMovieDetails } from '../api/tmdb'
import { useFavorites } from '../context/FavoritesContext'
import { formatRuntime, getCertification, getMatchPercent, getYear } from '../utils/format'

// "movies" = the few movies we rotate through in the big banner
function Hero({ movies }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const [index, setIndex] = useState(0) // which movie is showing
  const [details, setDetails] = useState(null) // extra info for that movie

  const movie = movies[index]

  // Whenever the movie changes, fetch its runtime + age rating.
  useEffect(() => {
    if (!movie) return
    getMovieDetails(movie.id)
      .then(setDetails)
      .catch(() => setDetails(null))
  }, [movie])

  if (!movie) return null

  const saved = isFavorite(movie.id)
  const genres = details?.genres?.slice(0, 2).map((g) => g.name).join(' / ')
  const certification = getCertification(details)
  const matchPercent = getMatchPercent(movie.vote_average)

  function showPrevious() {
    setIndex((index - 1 + movies.length) % movies.length)
  }
  function showNext() {
    setIndex((index + 1) % movies.length)
  }

  return (
    <section className="relative flex min-h-[460px] items-end overflow-hidden rounded-[20px] bg-surface md:min-h-[520px]">
      {/* Background picture + dark gradient so the text is readable */}
      {movie.backdrop_path && (
        <img
          src={`${BACKDROP_URL}${movie.backdrop_path}`}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-surface via-surface/70 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-r from-surface/80 to-transparent" />

      {/* Text content */}
      <div className="relative flex max-w-3xl flex-col gap-5 p-8 pb-20">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-1 text-[11px] font-bold text-gold">
            Now Trending <Icon name="movie_filter" className="text-sm" />
          </span>
          <span className="rounded-lg bg-mint/15 px-2.5 py-1 text-[11px] font-bold text-mint">
            {matchPercent}% Match
          </span>
        </div>

        <h1 className="text-4xl font-extrabold md:text-5xl">{movie.title}</h1>

        {/* Rating • year • genres • age rating • runtime */}
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2 text-xs">
          <span className="flex items-center gap-1 rounded bg-black/40 px-2 py-0.5 font-bold text-gold">
            <Icon name="star" className="text-[15px]" />
            {movie.vote_average.toFixed(1)}
            <span className="font-normal text-muted">/ 10</span>
          </span>
          <span className="text-muted">•</span>
          <span className="font-medium">{getYear(movie.release_date)}</span>
          {genres && (
            <>
              <span className="text-muted">•</span>
              <span className="text-muted">{genres}</span>
            </>
          )}
          {certification && (
            <>
              <span className="text-muted">•</span>
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-muted">
                {certification}
              </span>
            </>
          )}
          {details?.runtime > 0 && (
            <>
              <span className="text-muted">•</span>
              <span className="text-muted">{formatRuntime(details.runtime)}</span>
            </>
          )}
        </div>

        <p className="line-clamp-4 text-sm text-muted">{movie.overview}</p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-4">
          <Link
            to={`/movie/${movie.id}`}
            className="flex h-12 items-center gap-2 rounded-xl bg-gold px-6 text-sm font-bold text-gold-dark hover:bg-gold-hover active:scale-[.98]"
          >
            View Details <Icon name="info" className="text-lg" />
          </Link>
          <Link
            to={`/movie/${movie.id}?tab=trailers`}
            className="flex h-12 items-center gap-2 rounded-xl bg-white/10 px-6 text-sm font-semibold hover:bg-white/20"
          >
            Watch Trailer <Icon name="play_circle" className="text-xl" />
          </Link>
          <button
            onClick={() => toggleFavorite(movie)}
            aria-pressed={saved}
            aria-label={saved ? 'Remove from favorites' : 'Save to favorites'}
            className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-xl hover:bg-white/20 ${
              saved ? 'text-gold' : 'text-muted'
            }`}
          >
            <Icon name={saved ? 'bookmark' : 'bookmark_border'} />
          </button>
        </div>
      </div>

      {/* Slide dots + previous / next arrows */}
      <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between md:justify-start md:gap-6">
        <div className="flex items-center gap-1.5">
          {movies.map((m, i) => (
            <span
              key={m.id}
              className={`h-1.5 rounded-full ${i === index ? 'w-7 bg-gold' : 'w-2 bg-line'}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={showPrevious}
            aria-label="Previous movie"
            className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-lg hover:bg-white/20"
          >
            <Icon name="chevron_left" />
          </button>
          <button
            onClick={showNext}
            aria-label="Next movie"
            className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-lg hover:bg-white/20"
          >
            <Icon name="chevron_right" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero
