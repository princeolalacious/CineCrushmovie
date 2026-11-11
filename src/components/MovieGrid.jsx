import MovieCard from './MovieCard'
import MovieListItem from './MovieListItem'

// Shows a list of movies as poster cards ("grid") or rows ("list").
function MovieGrid({ movies, view = 'grid' }) {
  if (view === 'list') {
    return (
      <div className="flex flex-col gap-3">
        {movies.map((movie) => (
          <MovieListItem key={movie.id} movie={movie} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}

export default MovieGrid
