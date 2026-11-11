import Icon from './Icon'

// The "2 Free Curated Screening Passes" promo card. Static text, no API needed.
function PassBanner() {
  return (
    <section className="flex flex-col justify-between gap-6 rounded-2xl bg-surface p-6 md:flex-row md:items-center">
      <div className="flex items-center gap-5">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gold/15 text-[32px] text-gold">
          <Icon name="confirmation_number" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-gold">Dolby Cinema &amp; IMAX Premiere Pass</span>
            <span className="rounded-full bg-surface-3 px-2 py-1 text-[10px] font-bold">Member Tier #048</span>
          </div>
          <h3 className="text-lg font-bold">2 Free Curated Screening Passes Ready</h3>
          <p className="text-xs text-muted">
            Complimentary admission for premium auditorium screenings valid through end of month at any
            CineScope partner theater.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-end gap-3">
        <button className="rounded-xl bg-surface-2 px-4 py-2.5 text-xs font-semibold text-muted hover:text-ink">
          View Pass Rules
        </button>
        <button className="flex items-center gap-1.5 rounded-xl bg-gold px-5 py-2.5 text-xs font-bold text-gold-dark hover:bg-gold-hover active:scale-[.98]">
          Redeem Pass <Icon name="redeem" className="text-base" />
        </button>
      </div>
    </section>
  )
}

export default PassBanner
