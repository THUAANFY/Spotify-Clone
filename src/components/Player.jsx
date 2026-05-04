import { HiMiniBackward, HiMiniForward, HiMiniPause } from 'react-icons/hi2'
import {
  MdOutlineDevices,
  MdOutlineFullscreen,
  MdOutlinePlaylistPlay,
  MdOutlineRepeat,
  MdOutlineRepeatOne,
  MdOutlineShuffle,
  MdOutlineVolumeUp,
} from 'react-icons/md'
import { PiMicrophoneStageLight } from 'react-icons/pi'
import { PlayButton } from './PlayButton'

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export function Player({
  track,
  isPlaying,
  currentTime,
  duration,
  onTogglePlay,
  onNext,
  onPrev,
  onSeekPreview,
  onSeekCommit,
  volume,
  onVolumeChange,
  isShuffle,
  onToggleShuffle,
  repeatMode,
  onCycleRepeat,
}) {
  const hasTrack = Boolean(track)
  const seekValue = duration > 0 ? Math.min(currentTime, duration) : 0
  const progressPercent = duration > 0 ? (seekValue / duration) * 100 : 0
  const volumePercent = Math.min(Math.max(volume ?? 0, 0), 100)

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 px-2 pb-2">
      <div className="mx-auto grid items-center gap-4 rounded-xl border border-white/10 bg-black px-4 py-2 lg:grid-cols-[300px_1fr_300px]">
        <div className="flex min-w-0 items-center gap-3">
          {track?.artistImage || track?.coverUrl ? (
            <img
              src={track.artistImage ?? track.coverUrl}
              alt={track?.artist ?? track?.title}
              className="h-14 w-14 shrink-0 rounded-md object-cover"
            />
          ) : (
            <div className="h-14 w-14 shrink-0 rounded-md bg-gradient-to-br from-orange-700 via-red-700 to-black" />
          )}
          <div className="min-w-0">
            <p className="truncate text-sm leading-tight text-white md:text-base">
              {track?.title ?? 'Chưa chọn bài hát'}
            </p>
            <p className="truncate text-xs text-neutral-400">{track?.artist ?? 'Unknown Artist'}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-4 text-[20px] text-neutral-300">
            <button
              type="button"
              className={`rounded-full p-2 transition hover:bg-white/10 hover:text-white ${isShuffle ? 'text-emerald-400' : ''}`}
              aria-label="Shuffle"
              onClick={onToggleShuffle}
            >
              <MdOutlineShuffle />
            </button>
            <button
              type="button"
              className="rounded-full p-2 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
              aria-label="Previous"
              onClick={onPrev}
              disabled={!hasTrack}
            >
              <HiMiniBackward />
            </button>
            {isPlaying ? (
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 text-black shadow-[0_8px_24px_rgba(255,255,255,0.2)] transition hover:scale-105"
                aria-label="Pause"
                onClick={onTogglePlay}
                disabled={!hasTrack}
              >
                <HiMiniPause className="text-base" />
              </button>
            ) : (
              <PlayButton
                size="lg"
                variant="white"
                ariaLabel="Play"
                className="h-11 w-11 disabled:opacity-40 shadow-[0_8px_24px_rgba(255,255,255,0.2)]"
                onClick={onTogglePlay}
                disabled={!hasTrack}
              />
            )}
            <button
              type="button"
              className="rounded-full p-2 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
              aria-label="Next"
              onClick={onNext}
              disabled={!hasTrack}
            >
              <HiMiniForward />
            </button>
            <button
              type="button"
              className={`relative rounded-full p-2 transition hover:bg-white/10 hover:text-white ${repeatMode !== 'off' ? 'text-emerald-400' : ''}`}
              aria-label={`Repeat ${repeatMode}`}
              onClick={onCycleRepeat}
            >
              {repeatMode === 'one' ? <MdOutlineRepeatOne /> : <MdOutlineRepeat />}
            </button>
          </div>
          <div className="flex w-full items-center gap-2">
            <span className="w-9 text-right text-[11px] text-neutral-300">{formatTime(currentTime)}</span>
            <div
              className="group relative h-1 w-full rounded-full bg-neutral-700"
              style={{
                background: `linear-gradient(to right, #1db954 ${progressPercent}%, #404040 ${progressPercent}%)`,
              }}
            >
              <input
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={seekValue}
                onChange={(e) => onSeekPreview(Number(e.target.value))}
                onMouseUp={(e) => onSeekCommit(Number(e.currentTarget.value))}
                onTouchEnd={(e) => onSeekCommit(Number(e.currentTarget.value))}
                onKeyUp={(e) => onSeekCommit(Number(e.currentTarget.value))}
                className="absolute inset-0 h-1 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#1db954] [&::-webkit-slider-thumb]:opacity-0 group-hover:[&::-webkit-slider-thumb]:opacity-100"
                aria-label="Progress"
                disabled={!hasTrack}
              />
            </div>
            <span className="w-9 text-[11px] text-neutral-300">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="hidden items-center justify-end gap-4 text-xl text-neutral-300 lg:flex">
          <button type="button" className="transition hover:text-white" aria-label="Lyrics">
            <PiMicrophoneStageLight />
          </button>
          <button type="button" className="transition hover:text-white" aria-label="Queue">
            <MdOutlinePlaylistPlay />
          </button>
          <button type="button" className="transition hover:text-white" aria-label="Devices">
            <MdOutlineDevices />
          </button>
          <button type="button" className="transition hover:text-white" aria-label="Volume">
            <MdOutlineVolumeUp />
          </button>
          <div
            className="group relative h-1 w-24 rounded-full bg-neutral-700"
            style={{
              background: `linear-gradient(to right, #1db954 ${volumePercent}%, #404040 ${volumePercent}%)`,
            }}
          >
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="absolute inset-0 h-1 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#1db954] [&::-webkit-slider-thumb]:opacity-0 group-hover:[&::-webkit-slider-thumb]:opacity-100"
              aria-label="Volume control"
            />
          </div>
          <button type="button" className="transition hover:text-white" aria-label="Fullscreen">
            <MdOutlineFullscreen />
          </button>
        </div>
      </div>
    </footer>
  )
}
