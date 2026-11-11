import Icon from '../Icon'
import CastCard from './CastCard'
import { formatMoney } from '../../utils/format'

// A label on the left and a value on the right ("Music Score ... Ludwig Göransson")
function Row({ label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 text-xs">
      <span className="text-muted">{label}</span>
      <span className="text-right font-semibold">{value}</span>
    </div>
  )
}

// Names of crew members who have a certain job, e.g. "Editor"
function crewNames(crew, job) {
  return crew
    .filter((c) => c.job === job)
    .slice(0, 2)
    .map((c) => c.name)
    .join(', ')
}

function OverviewTab({ movie, cast, crew, onShowCast }) {
  const hasMoney = movie.revenue > 0
  const multiplier = movie.budget > 0 && hasMoney ? movie.revenue / movie.budget : null
  // The bar shows revenue compared with 10x the budget, capped at 100%
  const barPercent = multiplier ? Math.min(100, (multiplier / 10) * 100) : 0

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Left: story + cast */}
      <div className="flex flex-col gap-8 lg:col-span-2">
        <div className="flex flex-col gap-4 rounded-2xl bg-surface-2 p-6 md:p-8">
          <h2 className="flex items-center gap-2.5 text-xl font-bold">
            <Icon name="subject" className="text-2xl text-gold" />
            Storyline
          </h2>
          <p className="text-base leading-relaxed text-muted">{movie.overview || 'No synopsis available yet.'}</p>
        </div>

        {cast.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Top Cast Members</h2>
              <button onClick={onShowCast} className="flex items-center gap-1 text-xs font-bold text-gold">
                View All {cast.length} Cast Members <Icon name="arrow_forward" className="text-sm" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {cast.slice(0, 6).map((person) => (
                <CastCard key={person.credit_id} person={person} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: money + production facts */}
      <div className="flex flex-col gap-6">
        {hasMoney && (
          <div className="flex flex-col gap-4 rounded-2xl bg-surface-2 p-6">
            <p className="text-xs font-bold text-muted">Theatrical Box Office</p>
            <div>
              <p className="text-3xl font-extrabold">{formatMoney(movie.revenue)}</p>
              <p className="text-xs text-muted">Worldwide Gross Lifetime</p>
            </div>
            {multiplier && (
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-muted">Budget: {formatMoney(movie.budget)}</span>
                  <span className="font-bold text-mint">{multiplier.toFixed(2)}x Multiplier</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-line">
                  <div className="h-2 rounded-full bg-mint" style={{ width: `${barPercent}%` }} />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3 rounded-2xl bg-surface-2 p-6">
          <h3 className="text-base font-bold">Production Details</h3>
          <div className="flex flex-col divide-y divide-line">
            <Row label="Production Companies" value={movie.production_companies?.slice(0, 2).map((c) => c.name).join(', ')} />
            <Row label="Cinematography" value={crewNames(crew, 'Director of Photography')} />
            <Row label="Music Score" value={crewNames(crew, 'Original Music Composer')} />
            <Row label="Film Editing" value={crewNames(crew, 'Editor')} />
            <Row label="Countries" value={movie.production_countries?.map((c) => c.name).join(', ')} />
            <Row label="Spoken Languages" value={movie.spoken_languages?.map((l) => l.english_name).join(', ')} />
            <Row label="Release Date" value={movie.release_date} />
            <Row label="Status" value={movie.status} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OverviewTab
