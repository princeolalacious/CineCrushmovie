import Icon from './Icon'

// A dropdown (<select>) styled for the dark theme.
// options = [{ value: 'rating', label: 'Highest Rated' }, ...]
function Select({ label, value, onChange, options }) {
  return (
    <label className="flex items-center gap-2 text-xs font-medium text-muted">
      <span>{label}</span>
      <span className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 appearance-none rounded-lg bg-surface-2 pl-3.5 pr-9 text-xs font-semibold text-ink scheme-dark"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon name="expand_more" className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-lg" />
      </span>
    </label>
  )
}

export default Select
