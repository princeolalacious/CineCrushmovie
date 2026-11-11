import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import MovieGrid from '../components/MovieGrid'
import Select from '../components/Select'
import ViewToggle from '../components/ViewToggle'
import ConfirmDialog from '../components/ConfirmDialog'
import { useFavorites } from '../context/FavoritesContext'
import { useGenres } from '../context/GenresContext'

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently Added' },
  { value: 'title', label: 'Title A–Z' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'year', label: 'Release Year' },
]

function sortMovies(movies, sort) {
  const list = [...movies]
  if (sort === 'recent') list.reverse() // last saved first
  if (sort === 'title') list.sort((a, b) => a.title.localeCompare(b.title))
  if (sort === 'rating') list.sort((a, b) => b.vote_average - a.vote_average)
  if (sort === 'year') list.sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''))
  return list
}

// Shown when nothing has been saved yet
function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl bg-surface-2 p-10 text-center md:p-16">
      <div className="flex size-20 items-center justify-center rounded-2xl bg-surface-3 text-[40px] text-[#9c8f78]">
        <Icon name="bookmark_border" />
      </div>
      <h2 className="text-xl font-bold">Your favorites list is empty</h2>
      <p className="max-w-md text-sm text-muted">
        Start discovering movies and save the ones you love to build your cinematic archive. All curated titles
        will appear here.
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 rounded-xl bg-gold px-7 py-3 text-sm font-bold text-gold-dark hover:bg-gold-hover active:scale-[.98]"
      >
        <Icon name="explore" className="text-xl" />
        Browse Movies
      </Link>
    </div>
  )
}

function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites()
  const { genres } = useGenres()

  const [genreFilter, setGenreFilter] = useState(null)
  const [sort, setSort] = useState('recent')
  const [view, setView] = useState('grid')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [shareLabel, setShareLabel] = useState('Share Collection')

  useEffect(() => {
    document.title = 'My Favorites · CineScope'
  }, [])

  // ---- Numbers for the banner ----
  const ratings = favorites.map((m) => m.vote_average)
  const average = ratings.length ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0
  const minRating = ratings.length ? Math.min(...ratings) : 0
  const maxRating = ratings.length ? Math.max(...ratings) : 0

  // Genre chips with how many saved movies each has
  const counts = {}
  favorites.forEach((movie) => movie.genre_ids.forEach((id) => (counts[id] = (counts[id] || 0) + 1)))
  const genreChips = Object.entries(counts)
    .map(([id, count]) => ({ id: Number(id), count, name: genres.find((g) => g.id === Number(id))?.name }))
    .filter((chip) => chip.name)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // If the chosen genre no longer has movies (after removing one), show everything again.
  const activeGenre = genreFilter !== null && counts[genreFilter] ? genreFilter : null
  const visible = sortMovies(
    favorites.filter((m) => activeGenre === null || m.genre_ids.includes(activeGenre)),
    sort,
  )

  // ---- Buttons ----
  // Download the list as a .json file
  function handleExport() {
    const blob = new Blob([JSON.stringify(favorites, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'cinescope-favorites.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  // Share the titles as text (phone share sheet, or copy to clipboard)
  async function handleShare() {
    const text = `My CineScope favorites:\n${favorites.map((m) => `• ${m.title}`).join('\n')}`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My CineScope favorites', text })
      } else {
        await navigator.clipboard.writeText(text)
        setShareLabel('Copied to clipboard')
        setTimeout(() => setShareLabel('Share Collection'), 2000)
      }
    } catch {
      // sharing was cancelled
    }
  }

  const chipBase = 'rounded-lg px-4 py-2 text-xs'

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-8 sm:px-6">
      <div className="flex flex-col gap-10">
        {/* Breadcrumb + "saved on this device" */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-muted">
            <Link to="/" className="hover:text-gold">
              Home
            </Link>
            <span>/</span>
            <span className="text-gold">My Favorites</span>
          </nav>
          <span className="flex items-center gap-2 rounded-lg bg-surface px-3 py-1.5 text-xs text-muted">
            <Icon name="lock" className="text-base text-gold" />
            Saved on this device
          </span>
        </div>

        {/* Banner */}
        <section className="flex flex-col justify-between gap-8 rounded-2xl bg-surface p-6 md:flex-row md:items-end md:p-8">
          <div className="flex max-w-2xl flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-md bg-surface-2 px-2.5 py-1 text-[11px] font-bold text-gold">
                Private Collection
              </span>
              {favorites.length > 0 && (
                <span className="flex items-center gap-2 rounded-full bg-surface-3 px-3 py-1.5 text-xs font-semibold">
                  <span className="text-gold">★</span>
                  {average.toFixed(1)} Avg Rating
                </span>
              )}
            </div>
            <h1 className="text-3xl font-extrabold">
              My Favorites <span className="text-2xl font-bold text-gold">({favorites.length})</span>
            </h1>
            <p className="text-sm text-muted">
              Your personal cinematic archive. Save movies from anywhere in CineScope and find them all here.
            </p>
          </div>

          {favorites.length > 0 && (
            <div className="flex flex-col gap-5 md:items-end">
              {/* Rating distribution: one bar per saved movie */}
              <div className="flex items-center gap-4">
                <div className="text-right text-xs">
                  <p className="text-[11px] text-muted">Rating Distribution</p>
                  <p className="font-bold">
                    Min {minRating.toFixed(1)} • Max {maxRating.toFixed(1)}
                  </p>
                </div>
                <div className="flex h-8 items-end gap-1.5 rounded-lg bg-surface-2 px-2 py-1" aria-hidden="true">
                  {[...ratings]
                    .sort((a, b) => a - b)
                    .slice(-6)
                    .map((rating, i) => (
                      <span
                        key={i}
                        className="w-2.5 rounded-t bg-gold"
                        style={{ height: `${Math.max(4, (rating / 10) * 24)}px` }}
                      />
                    ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setConfirmOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-surface-2 px-4 py-2.5 text-xs font-semibold text-muted hover:text-ink"
                >
                  <Icon name="delete_sweep" className="text-lg" />
                  Clear All
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 rounded-xl bg-surface-2 px-5 py-2.5 text-xs font-semibold hover:bg-surface-3"
                >
                  <Icon name="ios_share" className="text-lg text-sky" />
                  Export List
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-xs font-bold text-gold-dark hover:bg-gold-hover active:scale-[.98]"
                >
                  <Icon name="share" className="text-lg" />
                  {shareLabel}
                </button>
              </div>
            </div>
          )}
        </section>

        {favorites.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Filters + sort + view */}
            <section className="flex flex-col gap-4 rounded-xl bg-surface p-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setGenreFilter(null)}
                  className={`${chipBase} ${activeGenre === null ? 'bg-gold font-bold text-gold-dark' : 'bg-surface-2 font-medium text-muted'}`}
                >
                  All ({favorites.length})
                </button>
                {genreChips.map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => setGenreFilter(chip.id)}
                    className={`${chipBase} ${activeGenre === chip.id ? 'bg-gold font-bold text-gold-dark' : 'bg-surface-2 font-medium text-muted'}`}
                  >
                    {chip.name} ({chip.count})
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <Select label="Sort:" value={sort} onChange={setSort} options={SORT_OPTIONS} />
                <ViewToggle view={view} onChange={setView} />
              </div>
            </section>

            <MovieGrid movies={visible} view={view} />
          </>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Clear all favorites?"
        message={`This removes all ${favorites.length} saved movies from this device. This can't be undone.`}
        confirmLabel="Clear All"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          clearFavorites()
          setConfirmOpen(false)
        }}
      />
    </main>
  )
}

export default FavoritesPage
