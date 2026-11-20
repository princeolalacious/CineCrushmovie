import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import MovieBackdrop from '../components/details/MovieBackdrop'
import MoviePoster from '../components/details/MoviePoster'
import MovieInfo from '../components/details/MovieInfo'
import MovieTabs from '../components/details/MovieTabs'
import OverviewTab from '../components/details/OverviewTab'
import CastTab from '../components/details/CastTab'
import TrailersTab from '../components/details/TrailersTab'
import MovieGrid from '../components/MovieGrid'
import { getMovieFull } from '../api/tmdb'
import { getCertification } from '../utils/format'

const TAB_IDS = ['overview', 'cast', 'trailers', 'similar']

// Videos worth showing: YouTube only, real trailers first
function pickVideos(movie) {
  const order = { Trailer: 0, Teaser: 1, Clip: 2, Featurette: 3 }
  return (movie.videos?.results || [])
    .filter((v) => v.site === 'YouTube' && v.type in order)
    .sort((a, b) => order[a.type] - order[b.type])
}

function MovieDetailsPage() {
  const { id } = useParams() // the :id from /movie/:id
  const [searchParams, setSearchParams] = useSearchParams()
  const [movie, setMovie] = useState(null)
  const [status, setStatus] = useState('loading') // loading | success | error
  const [errorMessage, setErrorMessage] = useState('')

  // The open tab is stored in the URL (?tab=cast) so links can point straight to it.
  const requestedTab = searchParams.get('tab')
  const activeTab = TAB_IDS.includes(requestedTab) ? requestedTab : 'overview'
  function changeTab(tab) {
    setSearchParams(tab === 'overview' ? {} : { tab }, { replace: true })
  }

  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')
    window.scrollTo({ top: 0 })

    getMovieFull(id, controller.signal)
      .then((data) => {
        setMovie(data)
        setStatus('success')
        document.title = `${data.title} · CineHub`
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setErrorMessage(err.message)
        setStatus('error')
      })

    return () => controller.abort()
  }, [id])

  if (status === 'loading') {
    return (
      <main className="flex-1 pb-16" role="status" aria-label="Loading movie">
        <div className="h-[348px] animate-pulse bg-surface-2 md:h-[420px]" />
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-[300px_1fr] md:gap-12">
          <div className="-mt-24 aspect-2/3 w-full max-w-[300px] animate-pulse rounded-xl bg-surface-3 md:-mt-40" />
          <div className="flex flex-col gap-4 pt-4">
            <div className="h-10 w-2/3 animate-pulse rounded bg-surface-2" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-surface-2" />
            <div className="h-40 animate-pulse rounded-xl bg-surface-2" />
          </div>
        </div>
      </main>
    )
  }

  if (status === 'error') {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <div role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-sm text-red-300">
          <p className="font-bold">We couldn’t load this movie</p>
          <p className="mt-1">{errorMessage}</p>
          <Link to="/" className="mt-4 inline-block font-semibold text-gold">
            ← Back to Home
          </Link>
        </div>
      </main>
    )
  }

  // ---- Pick the data we need out of the big response ----
  const cast = movie.credits?.cast || []
  const crew = movie.credits?.crew || []
  const director = crew.find((c) => c.job === 'Director')?.name
  const writer = crew.find((c) => ['Screenplay', 'Writer', 'Story'].includes(c.job))?.name
  const videos = pickVideos(movie)
  const similar = (movie.similar?.results || []).filter((m) => m.poster_path)

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'cast', label: 'Full Cast & Crew' },
    { id: 'trailers', label: 'Trailers & Clips', count: videos.length },
    { id: 'similar', label: 'Similar Movies' },
  ]

  return (
    <main className="flex-1 pb-16">
      <MovieBackdrop movie={movie} />

      <div className="mx-auto max-w-7xl px-6">
        <section className="grid gap-8 md:grid-cols-[300px_1fr] md:gap-12">
          <MoviePoster movie={movie} hasTrailer={videos.length > 0} onWatchTrailer={() => changeTab('trailers')} />
          <MovieInfo
            movie={movie}
            director={director}
            writer={writer}
            certification={getCertification(movie)}
            hasTrailer={videos.length > 0}
            onWatchTrailer={() => changeTab('trailers')}
          />
        </section>

        <section className="mt-16 flex flex-col gap-8">
          <MovieTabs tabs={tabs} activeTab={activeTab} onChange={changeTab} />

          <div id="tab-panel" role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
            {activeTab === 'overview' && (
              <OverviewTab movie={movie} cast={cast} crew={crew} onShowCast={() => changeTab('cast')} />
            )}
            {activeTab === 'cast' && <CastTab cast={cast} crew={crew} />}
            {activeTab === 'trailers' && <TrailersTab key={movie.id} videos={videos} />}
            {activeTab === 'similar' &&
              (similar.length > 0 ? (
                <MovieGrid movies={similar} />
              ) : (
                <p className="rounded-xl bg-surface-2 p-6 text-sm text-muted">No similar movies found.</p>
              ))}
          </div>
        </section>

        {activeTab !== 'similar' && similar.length > 0 && (
          <section className="mt-16 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="h-6 w-1 rounded-full bg-gold" />
              <h2 className="text-2xl font-bold">More Like This</h2>
            </div>
            <MovieGrid movies={similar.slice(0, 6)} />
          </section>
        )}
      </div>
    </main>
  )
}

export default MovieDetailsPage
