import Icon from './Icon'

// The row of genre chips. "selectedGenre" is null when "All Genres" is active.
function GenreFilter({ genres, selectedGenre, onSelectGenre }) {
  const chipBase = 'shrink-0 rounded-xl px-4 py-2.5 text-xs'
  const active = 'bg-gold font-bold text-gold-dark'
  const inactive = 'bg-surface-2 font-medium text-muted hover:text-ink'

  return (
    <section className="flex items-center gap-2.5 overflow-x-auto py-1">
      <button
        onClick={() => onSelectGenre(null)}
        className={`${chipBase} ${selectedGenre === null ? active : inactive}`}
      >
        All Genres
      </button>

      {genres.slice(0, 7).map((genre) => (
        <button
          key={genre.id}
          onClick={() => onSelectGenre(genre.id)}
          className={`${chipBase} ${selectedGenre === genre.id ? active : inactive}`}
        >
          {genre.name}
        </button>
      ))}

      <span className="mx-1 h-6 w-px shrink-0 bg-line" />

      <button className="flex shrink-0 items-center gap-1.5 rounded-xl bg-surface px-3.5 py-2 text-xs font-medium text-sky">
        Filter by Year &amp; Rating <Icon name="tune" className="text-base" />
      </button>
    </section>
  )
}

export default GenreFilter
