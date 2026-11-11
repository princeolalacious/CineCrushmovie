import { Link } from 'react-router-dom'
import Icon from './Icon'
import MovieGrid from './MovieGrid'
import GridSkeleton from './GridSkeleton'

function PopularMovies({ movies }) {
  return (
    <section className="flex flex-col gap-5">
      {/* Section heading */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-6 w-2.5 rounded-full bg-gold" />
          <h2 className="text-xl font-bold">Popular Movies</h2>
        </div>
        <Link to="/search" className="flex items-center gap-1 text-xs font-bold text-gold">
          Search all <Icon name="chevron_right" className="text-base" />
        </Link>
      </div>

      {movies.length === 0 ? <GridSkeleton /> : <MovieGrid movies={movies.slice(0, 12)} />}
    </section>
  )
}

export default PopularMovies
