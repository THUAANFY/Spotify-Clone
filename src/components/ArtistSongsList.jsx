import { PlayButton } from './PlayButton'

export function ArtistSongsList({ artistName, songs, onPlaySong, currentSongId }) {
  return (
    <div className="mt-6">
      <h3 className="mb-3 text-lg font-semibold">Bài hát của {artistName}</h3>
      <ul className="space-y-2">
        {songs.map((song, index) => {
          const isCurrent = currentSongId === song.id
          return (
            <li key={song.id ?? `${song.title}-${index}`}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => onPlaySong(song, songs, index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onPlaySong(song, songs, index)
                }}
                className="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-neutral-800"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="relative inline-flex h-5 w-5 items-center justify-center">
                    <span className="text-sm text-neutral-400 transition duration-200 group-hover:scale-90 group-hover:opacity-0">
                      {index + 1}
                    </span>
                    <PlayButton
                      size="sm"
                      className="absolute h-5 w-5 scale-90 opacity-0 transition duration-200 group-hover:scale-100 group-hover:opacity-100"
                      iconClassName="text-[8px]"
                      ariaLabel={`Play ${song.title}`}
                    />
                  </span>
                  <div className="min-w-0">
                    <p className={`truncate text-sm font-medium ${isCurrent ? 'text-emerald-400' : 'text-white'}`}>
                      {song.title}
                    </p>
                    <p className="truncate text-xs text-neutral-400">{song.artist ?? artistName}</p>
                  </div>
                </div>
                <span className="text-xs text-neutral-400">{song.duration ?? song.time ?? '--:--'}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
