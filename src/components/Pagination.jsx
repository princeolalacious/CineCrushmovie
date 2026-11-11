// Previous / 1 2 3 4 5 / Next
// TMDB never returns more than 500 pages, so we stop there.
function Pagination({ page, totalPages, onChange }) {
  const last = Math.min(totalPages, 500)
  if (last <= 1) return null

  const start = Math.max(1, Math.min(page - 2, last - 4))
  const end = Math.min(last, start + 4)
  const pages = []
  for (let p = start; p <= end; p++) pages.push(p)

  const base = 'flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-xs font-semibold'

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className={`${base} bg-surface-2 text-ink disabled:opacity-40`}
      >
        Previous
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          aria-current={p === page ? 'page' : undefined}
          className={`${base} ${p === page ? 'bg-gold font-bold text-gold-dark' : 'bg-surface-2 text-ink'}`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= last}
        className={`${base} bg-surface-2 text-ink disabled:opacity-40`}
      >
        Next
      </button>
    </nav>
  )
}

export default Pagination
