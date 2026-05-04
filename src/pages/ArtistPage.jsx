import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArtistSongsList } from '../components/ArtistSongsList'
import { popularArtists } from '../data/musicData'

const artistAliases = {
  'son-tung': 'son-tung-mtp',
}

function resolveArtistKey(artists, artistId) {
  if (artists[artistId]) return artistId
  const aliasKey = artistAliases[artistId]
  if (aliasKey && artists[aliasKey]) return aliasKey
  return null
}

export function ArtistPage({ onPlaySong, currentSongId, isPlaying }) {
  const { artistId } = useParams()
  const [songsData, setSongsData] = useState({})

  useEffect(() => {
    let active = true

    fetch('/data/songs.json')
      .then((res) => res.json())
      .then((data) => {
        if (active) setSongsData(data.artists ?? {})
      })
      .catch(() => {
        if (active) setSongsData({})
      })

    return () => {
      active = false
    }
  }, [])

  const artist = useMemo(
    () => popularArtists.find((item) => item.id === artistId) ?? popularArtists[0],
    [artistId]
  )

  const resolvedArtistKey = resolveArtistKey(songsData, artist.id)
  const songs = resolvedArtistKey ? songsData[resolvedArtistKey]?.songs ?? [] : []

  const normalizedSongs = songs.map((song, index) => ({
    ...song,
    id: song.id ?? `${resolvedArtistKey}-${index}`,
    artist: songsData[resolvedArtistKey]?.artistName ?? artist.name,
    artistImage: artist.image,
  }))

  return (
    <div className="min-w-0 rounded-2xl bg-neutral-900 p-4 md:p-6">
      <Link to="/" className="mb-4 inline-block text-sm text-neutral-300 hover:text-white">
        ← Quay lại nghệ sĩ
      </Link>

      <section className="mb-5 grid overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-800 md:grid-cols-[220px_minmax(0,1fr)]">
        <div className="relative h-56 w-full md:h-full">
          <img src={artist.image} alt={artist.name} className="h-full w-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/35" />
        </div>
        <div className="flex flex-col justify-end p-5 md:p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-300">Artist</p>
          <h2 className="mt-1 text-3xl font-bold text-white">{artist.name}</h2>
          <p className="mt-1 text-sm text-neutral-300">{normalizedSongs.length} bài hát</p>
        </div>
      </section>

      {normalizedSongs.length > 0 ? (
        <ArtistSongsList
          artistName={artist.name}
          songs={normalizedSongs}
          onPlaySong={(song, list, index) =>
            onPlaySong({ song, queue: list, index })
          }
          currentSongId={currentSongId}
          isPlaying={isPlaying}
        />
      ) : (
        <div className="rounded-xl border border-white/10 bg-neutral-800/40 p-4 text-sm text-neutral-300">
          Nghệ sĩ này hiện chưa có bài hát trong dữ liệu.
        </div>
      )}
    </div>
  )
}
