import { FaHeart, FaPlus } from 'react-icons/fa'
import { FiSearch } from 'react-icons/fi'
import { HiHome, HiMiniQueueList } from 'react-icons/hi2'
import { MdOutlineLibraryMusic } from 'react-icons/md'
import profileImage from '../assets/IMG_2727111.jpg'
import { UiButton } from './UiButton'

const playlists = [
  { name: 'Daily Mix', meta: '12 bài hát mới' },
  { name: 'Coding Flow', meta: 'Electro • 3 giờ' },
  { name: 'Top Hits', meta: 'Pop Việt thịnh hành' },
  { name: 'Chill Vibes', meta: 'Thư giãn buổi tối' },
]

export function Sidebar({ mobile = false }) {
  return (
    <aside className="flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-neutral-900/85 p-4 backdrop-blur">
      {mobile ? (
        <div className="rounded-xl border border-white/10 bg-neutral-800/50 p-3">
          <div className="mb-3 flex items-center gap-3">
            <img src={profileImage} alt="Thuận Phi" className="h-10 w-10 rounded-full object-cover" />
            <div>
              <p className="text-sm font-semibold text-white">Thuaan Fy</p>
              <p className="text-xs text-neutral-400">Premium</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-neutral-800/80 px-3 py-2">
            <FiSearch className="text-neutral-300" />
            <input
              type="text"
              placeholder="Tìm bài hát, nghệ sĩ..."
              className="w-full bg-transparent text-sm text-neutral-100 outline-none placeholder:text-neutral-400"
            />
          </div>
        </div>
      ) : null}

      <div className="rounded-xl border border-white/10 bg-neutral-800/50 p-2">
        <nav className="space-y-1">
          <UiButton variant="menu" icon={<HiHome />}>Home</UiButton>
          <UiButton variant="menu" icon={<HiMiniQueueList />}>Your Library</UiButton>
          <UiButton variant="menu" icon={<FaHeart />}>Liked Songs</UiButton>
        </nav>
      </div>

      <section className="min-h-0 flex-1 rounded-xl border border-white/10 bg-gradient-to-b from-neutral-800/40 to-neutral-900/40 p-3">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-700/70 text-neutral-200">
              <MdOutlineLibraryMusic />
            </span>
            <h2 className="text-sm font-semibold tracking-wide text-neutral-100">Playlists</h2>
          </div>
          <button
            type="button"
            className="rounded-full bg-neutral-700/70 p-2 text-neutral-200 transition hover:bg-neutral-600 hover:text-white"
            aria-label="Create playlist"
          >
            <FaPlus className="text-xs" />
          </button>
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black"
          >
            Tất cả
          </button>
          <button
            type="button"
            className="rounded-full bg-neutral-700/70 px-3 py-1 text-xs text-neutral-200 transition hover:bg-neutral-600"
          >
            Gần đây
          </button>
          <button
            type="button"
            className="rounded-full bg-neutral-700/70 px-3 py-1 text-xs text-neutral-200 transition hover:bg-neutral-600"
          >
            Đã lưu
          </button>
        </div>

        <ul className="space-y-1">
          {playlists.map((playlist) => (
            <li key={playlist.name}>
              <button
                type="button"
                className="w-full rounded-lg px-3 py-2 text-left transition hover:bg-neutral-700/60"
              >
                <p className="truncate text-sm font-medium text-neutral-100">{playlist.name}</p>
                <p className="truncate text-xs text-neutral-400">{playlist.meta}</p>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  )
}
