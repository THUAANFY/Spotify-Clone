import { FiBell, FiChevronDown, FiMenu, FiSearch } from 'react-icons/fi'
import { FaSpotify } from 'react-icons/fa'
import profileImage from '../assets/IMG_2727111.jpg'

export function Navbar({ onToggleSidebar }) {
  return (
    <header className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-neutral-900/80 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-neutral-800/80 text-neutral-200 md:hidden"
          aria-label="Toggle sidebar"
        >
          <FiMenu />
        </button>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1ed760] to-[#159643] text-black shadow-[0_6px_18px_rgba(30,215,96,0.35)]">
          <FaSpotify className="text-[22px]" />
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.18em] text-emerald-200/90">Welcome back</p>
          <h1 className="truncate text-lg font-semibold text-white">Spotify Clone</h1>
        </div>
      </div>

      <div className="hidden items-center gap-3 md:flex">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-neutral-800/80 px-3 py-2 transition focus-within:border-emerald-400/70 focus-within:ring-2 focus-within:ring-emerald-500/25">
          <FiSearch className="text-neutral-300" />
          <input
            type="text"
            placeholder="Bạn muốn nghe gì?"
            className="w-56 bg-transparent text-sm text-neutral-100 outline-none placeholder:text-neutral-400"
          />
        </div>

        <button
          type="button"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-neutral-800/80 text-neutral-200 transition hover:border-white/20 hover:text-white"
          aria-label="Notifications"
        >
          <FiBell />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-400" />
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-neutral-800/80 px-3 py-2 text-sm font-medium text-white transition hover:border-white/20"
          aria-label="Open profile"
        >
          <img src={profileImage} alt="Thuận Phi" className="h-6 w-6 rounded-full object-cover" />
          <span>Thuaan Fy</span>
          <FiChevronDown className="text-xs text-neutral-300" />
        </button>
      </div>

      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-neutral-800/80 text-neutral-200 md:hidden"
        aria-label="Open profile"
      >
        <img src={profileImage} alt="Thuận Phi" className="h-8 w-8 rounded-full object-cover" />
      </button>
    </header>
  )
}
