import { useState } from 'react'
import Icon from '../Icon'

// Clicking a video plays it right on the page (YouTube embed).
function TrailersTab({ videos }) {
  const [playingKey, setPlayingKey] = useState(videos[0]?.key || null)
  const playing = videos.find((v) => v.key === playingKey)

  if (videos.length === 0) {
    return <p className="rounded-xl bg-surface-2 p-6 text-sm text-muted">No trailers or clips available for this movie.</p>
  }

  return (
    <div className="flex flex-col gap-6">
      {playing && (
        <div className="aspect-video overflow-hidden rounded-2xl bg-black">
          <iframe
            key={playing.key}
            src={`https://www.youtube-nocookie.com/embed/${playing.key}`}
            title={playing.name}
            allow="accelerometer; encrypted-media; picture-in-picture"
            allowFullScreen
            className="size-full"
          />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {videos.map((video) => (
          <button
            key={video.key}
            onClick={() => setPlayingKey(video.key)}
            aria-pressed={video.key === playingKey}
            className={`overflow-hidden rounded-xl bg-surface-2 text-left ${
              video.key === playingKey ? 'ring-2 ring-gold' : ''
            }`}
          >
            <div className="relative aspect-video bg-surface-3">
              <img
                src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                alt=""
                loading="lazy"
                className="size-full object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex size-11 items-center justify-center rounded-full bg-black/70 text-2xl text-gold">
                  <Icon name="play_arrow" />
                </span>
              </span>
            </div>
            <div className="p-3">
              <p className="line-clamp-2 text-sm font-bold">{video.name}</p>
              <p className="text-xs text-muted">{video.type}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default TrailersTab
