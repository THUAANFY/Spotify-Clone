import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { popularArtists } from '../data/musicData'
import { PlayButton } from './PlayButton'

function ArtistCard({ artist }) {
  return (
    <Link
      to={`/artist/${artist.id}`}
      className="artist-card group block w-full rounded-xl p-2 text-left transition hover:bg-neutral-800"
    >
      <div className="relative mb-2">
        <img
          src={artist.image}
          alt={artist.name}
          className="aspect-square w-full rounded-full object-cover shadow-[0_8px_20px_rgba(0,0,0,0.45)]"
        />
        <PlayButton
          size="sm"
          className="absolute bottom-2 right-2 opacity-0 shadow-lg duration-200 group-hover:opacity-100"
          ariaLabel={`Play ${artist.name}`}
        />
      </div>
      <p className="truncate text-base font-semibold text-white">{artist.name}</p>
      <p className="mt-1 text-sm text-neutral-400">Nghệ sĩ</p>
    </Link>
  )
}

export function PopularArtistsSection() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Nghệ sĩ phổ biến</h2>
        <button
          type="button"
          className="text-sm font-semibold text-neutral-300 transition hover:text-white"
        >
          Hiện tất cả
        </button>
      </div>

      <div className="artist-swiper-wrap relative max-w-full overflow-hidden">
        <button type="button" className="artist-nav artist-nav-prev" aria-label="Nghệ sĩ trước">
          <FiChevronLeft />
        </button>
        <button type="button" className="artist-nav artist-nav-next" aria-label="Nghệ sĩ tiếp theo">
          <FiChevronRight />
        </button>

        <Swiper
          className="artist-swiper"
          modules={[Navigation]}
          navigation={{ prevEl: '.artist-nav-prev', nextEl: '.artist-nav-next' }}
          initialSlide={0}
          centeredSlides={false}
          spaceBetween={12}
          slidesPerView={5.2}
          breakpoints={{
            0: { slidesPerView: 2.15, spaceBetween: 8 },
            640: { slidesPerView: 2.2 },
            768: { slidesPerView: 2.8 },
            1024: { slidesPerView: 3.6 },
            1280: { slidesPerView: 4.4 },
            1536: { slidesPerView: 5.2 },
          }}
        >
          {popularArtists.map((artist) => (
            <SwiperSlide key={artist.id}>
              <ArtistCard artist={artist} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
