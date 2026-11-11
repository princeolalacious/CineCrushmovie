import Icon from './Icon'
import { useFavorites } from '../context/FavoritesContext'

// Small message at the bottom of the screen ("Added to Favorites.").
// aria-live="polite" makes screen readers read it out without moving focus.
function Toast() {
  const { toast, dismissToast } = useFavorites()

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 sm:justify-end sm:px-6"
    >
      {toast && (
        <div
          role="status"
          className="pointer-events-auto flex items-center gap-4 rounded-xl bg-surface-3 px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,.5)]"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-surface-2 text-xl text-sky">
            <Icon name="info" />
          </div>
          <div>
            <p className="text-xs font-semibold">{toast.message}</p>
            {toast.detail && <p className="text-[11px] text-muted">{toast.detail}</p>}
          </div>
          {toast.onUndo && (
            <button
              onClick={toast.onUndo}
              className="rounded-lg bg-gold px-3 py-1.5 text-xs font-bold text-gold-dark hover:bg-gold-hover"
            >
              Undo
            </button>
          )}
          <button onClick={dismissToast} aria-label="Dismiss message" className="p-1 text-base text-muted">
            <Icon name="close" />
          </button>
        </div>
      )}
    </div>
  )
}

export default Toast
