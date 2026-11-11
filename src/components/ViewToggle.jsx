import Icon from './Icon'

// The little grid / list switch.
function ViewToggle({ view, onChange }) {
  const button = (name, icon, label) => (
    <button
      onClick={() => onChange(name)}
      aria-pressed={view === name}
      aria-label={label}
      className={`flex size-8 items-center justify-center rounded-md text-lg ${
        view === name ? 'bg-surface-3 text-gold' : 'text-muted'
      }`}
    >
      <Icon name={icon} />
    </button>
  )

  return (
    <div className="flex items-center gap-1 rounded-lg bg-surface-2 p-1">
      {button('grid', 'grid_view', 'Grid view')}
      {button('list', 'view_list', 'List view')}
    </div>
  )
}

export default ViewToggle
