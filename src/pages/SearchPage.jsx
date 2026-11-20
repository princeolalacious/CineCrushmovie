import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Icon from '../components/Icon'
import MovieGrid from '../components/MovieGrid'
import GridSkeleton from '../components/GridSkeleton'
import Select from '../components/Select'
import ViewToggle from '../components/ViewToggle'
import Pagination from '../components/Pagination'
import { getSimilarMovies, searchMovies } from '../api/tmdb'
import { useGenres } from '../context/GenresContext'

const PAGE_SIZE = 20 // TMDB sends 20 movies per page
const SUGGESTIONS = ['Avengers', 'Batman', 'Dune', 'Inception', 'Star Wars']

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'title', label: 'Title A–Z' },
]

const YEAR_OPTIONS = [
  { value: 'all', label: 'All Years' },
  { value: '2020', label: '2020s' },
  { value: '2010', label: '2010s' },
  { value: '2000', label: '2000s' },
  { value: 'older', label: 'Before 2000' },
]

// Does this movie belong to the chosen decade?
function matchesYear(movie, yearFilter) {
  if (yearFilter === 'all') return true
  const year = Number(movie.release_date?.slice(0, 4))
  if (!year) return false
  if (yearFilter === 'older') return year < 2000
  return year >= Number(yearFilter) && year < Number(yearFilter) + 10
}

function sortMovies(movies, sort) {
  const list = [...movies] // copy, so we never change the original
  if (sort === 'rating') list.sort((a, b) => b.vote_average - a.vote_average)
  if (sort === 'newest') list.sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''))
  if (sort === 'oldest') list.sort((a, b) => (a.release_date || '9999').localeCompare(b.release_date || '9999'))
  if (sort === 'title') list.sort((a, b) => a.title.localeCompare(b.title))
  return list
}

function SearchPage() {
  // The search text and page number live in the URL: /search?q=Avengers&page=2
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim() || ''
  const page = Number(searchParams.get('page')) || 1

  const { genres } = useGenres()
  const [input, setInput] = useState(query)
  const [data, setData] = useState(null) // { results, total_results, total_pages }
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('')
  const [similar, setSimilar] = useState([])

  const [sort, setSort] = useState('relevance')
  const [yearFilter, setYearFilter] = useState('all')
  const [genreFilter, setGenreFilter] = useState(null)
  const [view, setView] = useState('grid')

  // Keep the text box in step with the URL (for example when pressing the Back button).
  useEffect(() => {
    setInput(query)
  }, [query])

  useEffect(() => {
    document.title = query ? `“${query}” · CineHub` : 'Search · CineHub'
  }, [query])

  // Load results whenever the search text or page changes.
  useEffect(() => {
    if (!query) {
      setData(null)
      setStatus('idle')
      return
    }

    // AbortController lets us cancel the old request if a new search starts.
    const controller = new AbortController()
    setStatus('loading')
    setGenreFilter(null)

    searchMovies(query, page, controller.signal)
      .then((response) => {
        setData(response)
        setStatus('success')
      })
      .catch((err) => {
        if (err.name === 'AbortError') return // cancelled on purpose
        setErrorMessage(err.message)
        setStatus('error')
      })

    return () => controller.abort()
  }, [query, page])

  // "Similar to ..." section: based on the first result.
  const firstResult = data?.results?.[0]
  useEffect(() => {
    if (!firstResult) {
      setSimilar([])
      return
    }
    const controller = new AbortController()
    getSimilarMovies(firstResult.id, controller.signal)
      .then(setSimilar)
      .catch(() => {})
    return () => controller.abort()
  }, [firstResult])

  function handleSubmit(event) {
    event.preventDefault()
    const text = input.trim()
    setSearchParams(text ? { q: text } : {})
  }

  function clearSearch() {
    setInput('')
    setSearchParams({})
  }

  function goToPage(newPage) {
    setSearchParams({ q: query, page: String(newPage) })
    window.scrollTo({ top: 0 })
  }

  // ---- Work out what to show ----
  const results = data?.results || []

  // Count how many results each genre has -> the filter chips
  const counts = {}
  results.forEach((movie) => movie.genre_ids.forEach((id) => (counts[id] = (counts[id] || 0) + 1)))
  const genreChips = Object.entries(counts)
    .map(([id, count]) => ({ id: Number(id), count, name: genres.find((g) => g.id === Number(id))?.name }))
    .filter((chip) => chip.name)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4)

  const filtered = results
    .filter((movie) => genreFilter === null || movie.genre_ids.includes(genreFilter))
    .filter((movie) => matchesYear(movie, yearFilter))
  const visible = sortMovies(filtered, sort)

  const filtersActive = genreFilter !== null || yearFilter !== 'all'
  function clearFilters() {
    setGenreFilter(null)
    setYearFilter('all')
  }

  const chipBase = 'flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs'
  const total = data?.total_results || 0
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const to = (page - 1) * PAGE_SIZE + results.length

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-8 sm:px-6">
      <div className="flex flex-col gap-10">
        {/* Search box */}
        <form onSubmit={handleSubmit} role="search" className="flex flex-col gap-3">
          <label className="flex h-14 items-center gap-3 rounded-xl bg-surface-3 px-4">
            <Icon name="search" className="text-2xl text-gold" />
            <input
              type="search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search for a movie title..."
              aria-label="Search movies"
              className="w-full bg-transparent text-base font-medium outline-none placeholder:text-muted"
            />
            {input && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-base text-muted"
              >
                <Icon name="close" />
              </button>
            )}
          </label>
          <div className="flex items-center gap-2 px-2 text-xs text-muted">
            <span className="size-1.5 rounded-full bg-mint" />
            Powered by TMDB
          </div>
        </form>

        {/* No search yet */}
        {status === 'idle' && (
          <div className="flex flex-col items-center gap-5 rounded-2xl bg-surface p-10 text-center">
            <div className="flex size-20 items-center justify-center rounded-2xl bg-surface-3 text-4xl text-gold">
              <Icon name="travel_explore" />
            </div>
            <h1 className="text-2xl font-bold">Search the movie database</h1>
            <p className="max-w-md text-sm text-muted">Type a title above and press Enter. Or try one of these:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((name) => (
                <Link
                  key={name}
                  to={`/search?q=${encodeURIComponent(name)}`}
                  className="rounded-lg bg-surface-2 px-4 py-2 text-xs font-semibold hover:text-gold"
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {status === 'loading' && (
          <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-extrabold">
              Searching for <span className="text-[#ffe6b3]">“{query}”</span>…
            </h1>
            <GridSkeleton count={12} />
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-5 text-sm text-red-300">
            <p className="font-bold">Something went wrong</p>
            <p className="mt-1">{errorMessage}</p>
          </div>
        )}

        {/* Results */}
        {status === 'success' && (
          <>
            <section className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gold">Search Query</span>
                  <span className="rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-bold text-gold-dark">
                    Found: {total.toLocaleString()} {total === 1 ? 'movie' : 'movies'}
                  </span>
                </div>
                <h1 className="text-2xl font-extrabold md:text-3xl">
                  Search Results for <span className="text-[#ffe6b3]">“{query}”</span>
                </h1>
              </div>

              {total > 0 && (
                <>
                  <div className="flex flex-wrap items-center gap-3">
                    <Select label="Sort by:" value={sort} onChange={setSort} options={SORT_OPTIONS} />
                    <Select label="Year:" value={yearFilter} onChange={setYearFilter} options={YEAR_OPTIONS} />
                    <div className="ml-auto">
                      <ViewToggle view={view} onChange={setView} />
                    </div>
                  </div>

                  {/* Genre chips with counts */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1 text-xs font-bold text-muted">
                      <Icon name="tune" className="text-base" /> Filters:
                    </span>
                    <button
                      onClick={() => setGenreFilter(null)}
                      className={`${chipBase} ${genreFilter === null ? 'bg-gold font-bold text-gold-dark' : 'bg-surface-2 font-medium text-muted'}`}
                    >
                      All ({results.length})
                    </button>
                    {genreChips.map((chip) => (
                      <button
                        key={chip.id}
                        onClick={() => setGenreFilter(chip.id)}
                        className={`${chipBase} ${genreFilter === chip.id ? 'bg-gold font-bold text-gold-dark' : 'bg-surface-2 font-medium text-muted'}`}
                      >
                        {chip.name}
                        <span className="rounded bg-line px-1.5 text-[10px] text-ink">{chip.count}</span>
                      </button>
                    ))}
                    {filtersActive && (
                      <button onClick={clearFilters} className="px-3 py-2 text-xs font-semibold text-gold">
                        Clear Filters
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <p className="text-sm font-bold">Top Direct Matches</p>
                    <p className="text-gold">
                      {from}–{to} of {total.toLocaleString()}
                    </p>
                  </div>

                  {visible.length > 0 ? (
                    <MovieGrid movies={visible} view={view} />
                  ) : (
                    <p className="rounded-xl bg-surface p-6 text-sm text-muted">
                      No movies on this page match those filters.{' '}
                      <button onClick={clearFilters} className="font-semibold text-gold">
                        Clear filters
                      </button>
                    </p>
                  )}
                </>
              )}

              {total === 0 && (
                <div className="rounded-2xl bg-surface p-10 text-center">
                  <h2 className="text-xl font-bold">No movies found</h2>
                  <p className="mt-2 text-sm text-muted">Check the spelling or try a shorter title.</p>
                </div>
              )}
            </section>

            {/* Summary + pagination */}
            {total > 0 && (
              <div className="flex flex-col items-center justify-between gap-4 rounded-xl bg-surface p-6 md:flex-row">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-surface-2 text-2xl text-gold">
                    <Icon name="analytics" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Results Summary</p>
                    <p className="text-xs text-muted">
                      Showing {results.length} titles matching “{query}” on page {page} of{' '}
                      {Math.min(data.total_pages, 500)}.
                    </p>
                  </div>
                </div>
                <Pagination page={page} totalPages={data.total_pages} onChange={goToPage} />
              </div>
            )}

            {/* Similar movies */}
            {similar.length > 0 && (
              <section className="flex flex-col gap-5">
                <div>
                  <h2 className="text-lg font-bold">More Like “{firstResult.title}”</h2>
                  <p className="text-xs text-muted">Frequently co-viewed and narrative-linked titles</p>
                </div>
                <MovieGrid movies={similar.slice(0, 6)} />
              </section>
            )}
          </>
        )}
      </div>
    </main>
  )
}

export default SearchPage
