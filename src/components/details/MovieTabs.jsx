// Overview | Full Cast & Crew | Trailers & Clips | Similar Movies
// "tabs" is a list like [{ id: 'overview', label: 'Overview', count: 4 }]
function MovieTabs({ tabs, activeTab, onChange }) {
  return (
    <div role="tablist" aria-label="Movie sections" className="flex gap-1 overflow-x-auto rounded-xl bg-surface p-1.5">
      {tabs.map((tab) => {
        const active = tab.id === activeTab
        return (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={active}
            aria-controls="tab-panel"
            onClick={() => onChange(tab.id)}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-5 py-2.5 text-sm ${
              active ? 'bg-gold font-bold text-gold-dark' : 'font-medium text-muted hover:bg-surface-2 hover:text-ink'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="rounded-full bg-line px-1.5 text-[10px] font-bold text-muted">{tab.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default MovieTabs
