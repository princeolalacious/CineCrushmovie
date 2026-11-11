// Small helper so we can write <Icon name="star" /> anywhere.
// Browse all icon names at https://fonts.google.com/icons
// aria-hidden stops screen readers from reading the icon's name ("favorite_border")
function Icon({ name, className = '' }) {
  return (
    <span aria-hidden="true" className={`material-icons select-none ${className}`}>
      {name}
    </span>
  )
}

export default Icon
