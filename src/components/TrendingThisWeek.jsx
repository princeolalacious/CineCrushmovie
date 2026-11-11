import Icon from './Icon'
import TrendingItem from './TrendingItem'

function TrendingThisWeek({ movies }) {
  return (
    <section className="flex flex-col gap-6">
      {/* Section heading */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-6 w-2.5 rounded-full bg-royal" />
          <h2 className="text-xl font-bold">Trending This Week</h2>
          <span className="hidden rounded-md bg-sky/15 px-2.5 py-1 text-xs font-extrabold text-sky sm:block">
            Top 10 Box Office
          </span>
        </div>
        <button className="flex size-9 items-center justify-center rounded-lg bg-surface-2 text-lg text-muted">
          <Icon name="trending_up" />
        </button>
      </div>

      {/* 1 column on phones, 2 on tablets, 3 on desktops.
          On phones we only show the first 3 (items 4-6 appear from "md" up). */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {movies.slice(0, 6).map((movie, i) => (
          <TrendingItem
            key={movie.id}
            movie={movie}
            rank={i + 1}
            className={i >= 3 ? 'hidden md:flex' : 'flex'}
          />
        ))}
      </div>
    </section>
  )
}

export default TrendingThisWeek
