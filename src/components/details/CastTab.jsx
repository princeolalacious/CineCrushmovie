import CastCard from './CastCard'

// Jobs we show in the "Key Crew" list
const KEY_JOBS = ['Director', 'Screenplay', 'Writer', 'Producer', 'Director of Photography', 'Original Music Composer', 'Editor']

function CastTab({ cast, crew }) {
  const keyCrew = crew.filter((c) => KEY_JOBS.includes(c.job)).slice(0, 12)

  if (cast.length === 0 && keyCrew.length === 0) {
    return <p className="rounded-xl bg-surface-2 p-6 text-sm text-muted">Cast information is not available yet.</p>
  }

  return (
    <div className="flex flex-col gap-10">
      {cast.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Cast</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {cast.slice(0, 24).map((person) => (
              <CastCard key={person.credit_id} person={person} />
            ))}
          </div>
        </section>
      )}

      {keyCrew.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Key Crew</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {keyCrew.map((person) => (
              <div key={person.credit_id} className="rounded-xl bg-surface-2 p-4">
                <p className="text-sm font-bold">{person.name}</p>
                <p className="text-xs text-muted">{person.job}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default CastTab
