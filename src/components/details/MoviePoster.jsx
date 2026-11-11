import Icon from '../Icon'
import { IMAGE_URL } from '../../api/tmdb'
import { getMatchPercent } from '../../utils/format'

// Big poster on the left. If the movie has a trailer, the play button opens the Trailers tab.
function MoviePoster({ movie, hasTrailer, onWatchTrailer }) {
  return (
    <div className="relative z-10 mx-auto -mt-24 w-full max-w-[300px] md:mx-0 md:-mt-40">
      <div className="relative aspect-2/3 overflow-hidden rounded-xl bg-surface-2 shadow-[0_20px_60px_rgba(0,0,0,.5)]">
        {movie.poster_path ? (
          <img src={`${IMAGE_URL}${movie.poster_path}`} alt={`${movie.title} poster`} className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center text-6xl text-line">
            <Icon name="movie" />
          </div>
        )}

        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs font-bold text-mint">
          {getMatchPercent(movie.vote_average)}% Match <Icon name="verified" className="text-sm" />
        </span>

        {hasTrailer && (
          <button
            onClick={onWatchTrailer}
            aria-label="Play trailer"
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/20 hover:bg-black/30"
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-gold text-4xl text-gold-dark">
              <Icon name="play_arrow" />
            </span>
            <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-semibold">Play Trailer</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default MoviePoster
