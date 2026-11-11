import Icon from '../Icon'
import { PROFILE_URL } from '../../api/tmdb'

// One actor: round photo, name and the character they play.
function CastCard({ person }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl bg-surface-2 p-4 text-center">
      <div className="flex size-20 items-center justify-center overflow-hidden rounded-full bg-surface-3 text-4xl text-line">
        {person.profile_path ? (
          <img src={`${PROFILE_URL}${person.profile_path}`} alt="" loading="lazy" className="size-full object-cover" />
        ) : (
          <Icon name="person" />
        )}
      </div>
      <p className="text-sm font-bold">{person.name}</p>
      {person.character && <p className="text-xs text-muted">{person.character}</p>}
    </div>
  )
}

export default CastCard
