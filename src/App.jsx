import { useEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Sidebar } from './components/Sidebar'
import { Player } from './components/Player'
import { PlayButton } from './components/PlayButton'
import { HomePage } from './pages/HomePage'
import { ArtistPage } from './pages/ArtistPage'
import './styles/App.css'

function App() {
  const { pathname } = useLocation()
  const isArtistPage = pathname.startsWith('/artist/')
  const audioRef = useRef(null)

  const [currentTrack, setCurrentTrack] = useState(null)
  const [queue, setQueue] = useState([])
  const [queueIndex, setQueueIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(70)
  const [isShuffle, setIsShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState('off')
  const [isSeeking, setIsSeeking] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const touchStartXRef = useRef(0)
  const touchCurrentXRef = useRef(0)

  const quickPicks = [
    { title: 'Rap Việt 2026', subtitle: 'Năng lượng cao', tone: 'from-orange-500/70 to-rose-500/30' },
    { title: 'Lo-fi Focus', subtitle: 'Tập trung làm việc', tone: 'from-sky-500/70 to-cyan-500/30' },
    { title: 'V-Pop New Wave', subtitle: 'Xu hướng mới', tone: 'from-emerald-500/70 to-lime-500/30' },
    { title: 'Acoustic Night', subtitle: 'Thư giãn ban đêm', tone: 'from-violet-500/70 to-fuchsia-500/30' },
  ]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      if (!isSeeking) setCurrentTime(audio.currentTime)
    }
    const handleLoadedMetadata = () => setDuration(audio.duration || 0)
    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0
        audio.play()
        return
      }
      handleNext(true)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [queue, queueIndex, isSeeking, repeatMode])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack?.audioUrl) return

    audio.src = currentTrack.audioUrl
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false))
  }, [currentTrack])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume / 100
  }, [volume])

  function handlePlaySong({ song, queue: songQueue, index }) {
    setQueue(songQueue)
    setQueueIndex(index)
    setCurrentTrack(song)
    setCurrentTime(0)
  }

  function handleTogglePlay() {
    const audio = audioRef.current
    if (!audio || !currentTrack?.audioUrl) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
    }
  }

  function handleNext(fromEnded = false) {
    if (!queue.length) return
    if (isShuffle && queue.length > 1) {
      let randomIndex = queueIndex
      while (randomIndex === queueIndex) {
        randomIndex = Math.floor(Math.random() * queue.length)
      }
      setQueueIndex(randomIndex)
      setCurrentTrack(queue[randomIndex])
      return
    }

    if (queueIndex >= queue.length - 1) {
      if (repeatMode === 'all' || fromEnded) {
        setQueueIndex(0)
        setCurrentTrack(queue[0])
      }
      return
    }

    const nextIndex = queueIndex + 1
    setQueueIndex(nextIndex)
    setCurrentTrack(queue[nextIndex])
  }

  function handlePrev() {
    if (!queue.length) return
    if (currentTime > 3) {
      handleSeek(0)
      return
    }
    if (queueIndex <= 0) {
      if (repeatMode === 'all') {
        const lastIndex = queue.length - 1
        setQueueIndex(lastIndex)
        setCurrentTrack(queue[lastIndex])
      }
      return
    }
    const prevIndex = queueIndex - 1
    setQueueIndex(prevIndex)
    setCurrentTrack(queue[prevIndex])
  }

  function handleSeek(time) {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(time)) return
    audio.currentTime = time
    setCurrentTime(time)
  }

  function handleSeekPreview(value) {
    setIsSeeking(true)
    setCurrentTime(value)
  }

  function handleSeekCommit(value) {
    setIsSeeking(false)
    handleSeek(value)
  }

  function handleVolumeChange(value) {
    setVolume(value)
  }

  function handleToggleShuffle() {
    setIsShuffle((prev) => !prev)
  }

  function handleCycleRepeat() {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all'
      if (prev === 'all') return 'one'
      return 'off'
    })
  }

  function handleDrawerTouchStart(event) {
    touchStartXRef.current = event.touches[0].clientX
    touchCurrentXRef.current = touchStartXRef.current
  }

  function handleDrawerTouchMove(event) {
    touchCurrentXRef.current = event.touches[0].clientX
  }

  function handleDrawerTouchEnd() {
    const deltaX = touchCurrentXRef.current - touchStartXRef.current
    if (deltaX < -60) {
      setIsSidebarOpen(false)
    }
  }

  return (
    <div className="h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#2a2a2a_0%,#111_55%)] text-white">
      <audio ref={audioRef} preload="metadata" />

      <main className="mx-auto flex h-screen w-full flex-col gap-3 p-2 md:p-2">
        <div className="sticky top-0 z-40">
          <Navbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
        </div>

        {isSidebarOpen ? (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
          />
        ) : null}

        <aside
          className={`fixed left-0 top-0 z-50 h-full w-[88%] max-w-[380px] p-2 transition-transform duration-300 md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onTouchStart={handleDrawerTouchStart}
          onTouchMove={handleDrawerTouchMove}
          onTouchEnd={handleDrawerTouchEnd}
        >
          <div className="h-full rounded-2xl border border-white/10 bg-neutral-950/95 p-1 backdrop-blur">
            <Sidebar mobile />
          </div>
        </aside>

        <section className="grid min-h-0 flex-1 items-stretch gap-4 md:grid-cols-[280px_minmax(0,1fr)]">
          <div className="hidden md:block">
            <Sidebar />
          </div>
          <div className="scrollbar-hidden min-h-0 space-y-4 overflow-y-auto pb-36 pr-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/artist/:artistId"
                element={
                  <ArtistPage
                    onPlaySong={(payload) => {
                      handlePlaySong(payload)
                      setIsSidebarOpen(false)
                    }}
                    currentSongId={currentTrack?.id}
                    isPlaying={isPlaying}
                  />
                }
              />
            </Routes>

            {!isArtistPage && (
              <>
                <section className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
                  <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.35),transparent_45%),radial-gradient(circle_at_85%_15%,rgba(59,130,246,0.28),transparent_38%),linear-gradient(145deg,#0b0f13,#111827)] p-6">
                    <span className="inline-flex rounded-full border border-emerald-300/40 bg-emerald-300/15 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-emerald-100">
                      New For You
                    </span>
                    <h3 className="mt-4 max-w-lg text-3xl font-bold leading-tight text-white">
                      Daily Discovery Mix
                    </h3>
                    <p className="mt-3 max-w-xl text-sm text-neutral-200/90">
                      30 bài nhạc mới dựa trên nghệ sĩ bạn vừa nghe gần đây, cập nhật mỗi buổi sáng.
                    </p>
                    <div className="mt-6 flex items-center gap-3">
                      <button
                        type="button"
                        className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:scale-[1.03]"
                      >
                        Phát ngay
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20"
                      >
                        Lưu playlist
                      </button>
                    </div>
                  </article>

                  <article className="rounded-2xl border border-white/10 bg-neutral-900/80 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-sky-200">Trending</p>
                    <h3 className="mt-2 text-xl font-bold">Podcast đang lên</h3>
                    <ul className="mt-4 space-y-2 text-sm text-neutral-300">
                      <li className="flex items-center justify-between rounded-lg bg-neutral-800/70 px-3 py-2">
                        <span>Chuyện Công Nghệ #42</span>
                        <span className="text-xs text-neutral-500">+12%</span>
                      </li>
                      <li className="flex items-center justify-between rounded-lg bg-neutral-800/70 px-3 py-2">
                        <span>Late Night Chill Talk</span>
                        <span className="text-xs text-neutral-500">+9%</span>
                      </li>
                      <li className="flex items-center justify-between rounded-lg bg-neutral-800/70 px-3 py-2">
                        <span>Marketing 360</span>
                        <span className="text-xs text-neutral-500">+7%</span>
                      </li>
                    </ul>
                  </article>
                </section>

                <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
                  <article className="rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 p-5 shadow-[0_20px_40px_rgba(0,0,0,0.25)]">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-bold">Quick Picks</h3>
                      <button
                        type="button"
                        className="text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-white"
                      >
                        Làm mới
                      </button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {quickPicks.map((item) => (
                        <button
                          key={item.title}
                          type="button"
                          className="group flex items-center gap-3 rounded-xl border border-white/10 bg-neutral-800/60 px-3 py-3 text-left transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-neutral-700/70"
                        >
                          <span
                            className={`h-12 w-12 rounded-lg bg-gradient-to-br ${item.tone} shadow-[0_6px_16px_rgba(0,0,0,0.4)]`}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-white">{item.title}</span>
                            <span className="block truncate text-xs text-neutral-300">{item.subtitle}</span>
                          </span>
                          <PlayButton size="sm" variant="white" ariaLabel={`Play ${item.title}`} className="opacity-85" />
                        </button>
                      ))}
                    </div>
                  </article>

                  <article className="rounded-2xl border border-white/10 bg-gradient-to-b from-sky-500/20 to-neutral-900 p-5">
                    <h3 className="text-lg font-bold">Lịch sử nghe gần đây</h3>
                    <p className="mt-1 text-sm text-neutral-300">Dựa theo 7 ngày gần nhất</p>
                    <div className="mt-4 space-y-3 text-sm">
                      <div className="flex items-center justify-between rounded-lg bg-black/25 px-3 py-2">
                        <span>Exit Sign - HIEUTHUHAI</span>
                        <span className="text-neutral-400">42 lần</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-black/25 px-3 py-2">
                        <span>Không Sao Cả - 7dnight</span>
                        <span className="text-neutral-400">31 lần</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-black/25 px-3 py-2">
                        <span>Thức Giấc - Da LAB</span>
                        <span className="text-neutral-400">24 lần</span>
                      </div>
                    </div>
                  </article>
                </section>

                <section className="rounded-2xl border border-white/10 bg-neutral-900 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold">Mood theo thời điểm</h3>
                    <span className="text-xs uppercase tracking-[0.2em] text-neutral-400">Updated Daily</span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-xl border border-white/10 bg-gradient-to-br from-amber-400/30 to-neutral-900 p-4">
                      <p className="text-xs text-amber-100">Sáng</p>
                      <p className="mt-1 text-base font-semibold">Morning Boost</p>
                      <p className="mt-1 text-xs text-neutral-300">Nhịp nhanh, tích cực</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-gradient-to-br from-cyan-400/30 to-neutral-900 p-4">
                      <p className="text-xs text-cyan-100">Chiều</p>
                      <p className="mt-1 text-base font-semibold">Deep Focus</p>
                      <p className="mt-1 text-xs text-neutral-300">Tập trung làm việc</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-gradient-to-br from-pink-400/30 to-neutral-900 p-4">
                      <p className="text-xs text-pink-100">Tối</p>
                      <p className="mt-1 text-base font-semibold">Night Chill</p>
                      <p className="mt-1 text-xs text-neutral-300">Thư giãn cuối ngày</p>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-cyan-400/20 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14),transparent_45%),linear-gradient(145deg,#090f1a,#070b12)] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Neon Radar</p>
                      <h3 className="mt-1 text-lg font-bold">Radar bài hát nổi bật</h3>
                    </div>
                    <button
                      type="button"
                      className="rounded-full border border-cyan-300/35 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100 transition hover:bg-cyan-300/20"
                    >
                      Xem tất cả
                    </button>
                  </div>

                  <div className="relative overflow-hidden rounded-xl border border-cyan-300/20 bg-black/35 p-4">
                    <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-[1fr_1.4fr_1fr] md:items-center">
                      <article className="rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-3">
                        <p className="text-xs text-cyan-200">Node A</p>
                        <p className="mt-1 truncate text-sm font-semibold text-white">Không Sao Cả</p>
                        <p className="text-xs text-neutral-300">+12%</p>
                      </article>

                      <article className="relative overflow-hidden rounded-2xl border border-cyan-300/40 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.28),transparent_55%),#0b111d] p-5 text-center shadow-[0_0_35px_rgba(34,211,238,0.2)]">
                        <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Core Signal</p>
                        <p className="mt-2 truncate text-xl font-bold text-white">Exit Sign</p>
                        <p className="text-sm text-neutral-300">HIEUTHUHAI</p>
                        <div className="mt-3 h-1.5 rounded-full bg-white/10">
                          <div className="h-full w-[84%] rounded-full bg-[#1db954]" />
                        </div>
                        <p className="mt-2 text-xs text-cyan-100">Peak engagement 84%</p>
                      </article>

                      <article className="rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-3">
                        <p className="text-xs text-cyan-200">Node B</p>
                        <p className="mt-1 truncate text-sm font-semibold text-white">Thức Giấc</p>
                        <p className="text-xs text-neutral-300">+8%</p>
                      </article>
                    </div>

                    <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[1px] w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent md:block" />
                    <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[70%] w-[1px] -translate-y-1/2 bg-gradient-to-b from-transparent via-cyan-300/25 to-transparent md:block" />
                    <div className="mt-4 grid gap-2 text-xs text-neutral-400 md:grid-cols-3">
                      <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Signal Strength: High</div>
                      <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Update Rate: 15 min</div>
                      <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Audience Pulse: 9.4/10</div>
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </section>

        <Player
          track={currentTrack}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onTogglePlay={handleTogglePlay}
          onNext={handleNext}
          onPrev={handlePrev}
          onSeekPreview={handleSeekPreview}
          onSeekCommit={handleSeekCommit}
          volume={volume}
          onVolumeChange={handleVolumeChange}
          isShuffle={isShuffle}
          onToggleShuffle={handleToggleShuffle}
          repeatMode={repeatMode}
          onCycleRepeat={handleCycleRepeat}
        />
      </main>
    </div>
  )
}

export default App
