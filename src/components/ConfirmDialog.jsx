import { useEffect, useRef } from 'react'

// A popup that asks "Are you sure?".
// - Escape closes it
// - Tab stays inside the popup
// - Focus goes back to the button that opened it
function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onCancel }) {
  const dialogRef = useRef(null)
  const cancelRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const opener = document.activeElement // remember who opened the dialog
    cancelRef.current?.focus()

    function handleKey(event) {
      if (event.key === 'Escape') {
        onCancel()
        return
      }
      if (event.key === 'Tab') {
        const items = dialogRef.current.querySelectorAll('button')
        const first = items[0]
        const last = items[items.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('keydown', handleKey)
      opener?.focus()
    }
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onCancel}>
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-[0_20px_60px_rgba(0,0,0,.5)]"
      >
        <h2 id="confirm-title" className="text-lg font-bold">
          {title}
        </h2>
        <p className="mt-2 text-sm text-muted">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="rounded-xl bg-surface-3 px-4 py-2.5 text-sm font-semibold hover:bg-line"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl bg-gold px-4 py-2.5 text-sm font-bold text-gold-dark hover:bg-gold-hover"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
