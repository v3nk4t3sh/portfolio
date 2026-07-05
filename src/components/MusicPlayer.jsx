import { useEffect, useRef, useState } from 'react'

const TRACKS = [
  { title: 'Track 1', artist: 'Design in Progress', src: '/Music/jazz-1.mp3', vol: 0.8 },
  { title: 'Track 2', artist: 'Design in Progress', src: '/Music/jazz-2.mp3', vol: 0.8, offset: 4 },
  { title: 'Track 3', artist: 'Design in Progress', src: '/Music/jazz-3.mp3', vol: 0.45 },
]

export default function MusicPlayer() {
  const audioRef = useRef(null)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const track = TRACKS[currentTrackIndex]

  // Single Audio element for the whole player, created once.
  useEffect(() => {
    const audio = new Audio()
    audioRef.current = audio
    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  // Auto-advance on end (wrap around).
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onEnded = () =>
      setCurrentTrackIndex((i) => (i + 1) % TRACKS.length)
    audio.addEventListener('ended', onEnded)
    return () => audio.removeEventListener('ended', onEnded)
  }, [])

  // Load the current track: apply volume normalization + optional offset.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.src = track.src
    audio.volume = track.vol
    audio.currentTime = track.offset ?? 0
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
    }
  }

  const skip = (dir) => {
    setCurrentTrackIndex((i) => (i + dir + TRACKS.length) % TRACKS.length)
  }

  return (
    <div
      className="group relative w-72 rotate-6 cursor-pointer select-none transition-transform duration-500 ease-out hover:rotate-0 motion-reduce:rotate-0"
      onClick={togglePlay}
      role="button"
      aria-label={isPlaying ? 'Pause music' : 'Play music'}
    >
      {/* Handwritten label, appears overhead on hover */}
      <span className="pointer-events-none absolute -top-44 left-1/2 -translate-x-1/2 -rotate-6 font-hand text-2xl text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {isPlaying ? 'Pause ↓' : 'Play ↓'}
      </span>

      {/* Vinyl disc tucked behind the card — only the top peeks out.
          Spins while playing; the sheen + label notch make the spin visible. */}
      <div
        className="animate-spin-vinyl pointer-events-none absolute -top-36 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full shadow-xl shadow-black/25"
        style={{
          background:
            'repeating-radial-gradient(circle at center, #0d1b12 0 2.5px, #16281c 2.5px 5px)',
          animationPlayState: isPlaying ? 'running' : 'paused',
        }}
      >
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'conic-gradient(from 20deg, rgba(255,255,255,0) 0deg, rgba(255,255,255,0.10) 35deg, rgba(255,255,255,0) 70deg, rgba(255,255,255,0) 180deg, rgba(255,255,255,0.06) 215deg, rgba(255,255,255,0) 250deg)',
          }}
        />
        {/* Center label with a notch marker + spindle hole */}
        <span
          className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
          style={{ background: '#f3ead5' }}
        >
          <span className="absolute left-1/2 top-1 h-2 w-0.5 -translate-x-1/2 rounded bg-ink/40" />
          <span className="h-2 w-2 rounded-full bg-ink/80" />
        </span>
      </div>

      {/* Card face — covers the lower part of the vinyl */}
      <div className="relative rounded-[28px] bg-white px-8 pb-8 pt-10 shadow-2xl shadow-black/15">
        {/* Track indicator dots — one per track */}
        <div className="mb-3 flex items-center justify-center gap-1.5" aria-hidden="true">
          {TRACKS.map((t, i) => (
            <span
              key={t.src}
              className={`h-1 w-1 rounded-full transition-colors duration-300 ${
                i === currentTrackIndex ? 'bg-ink' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-center gap-2">
          {isPlaying && (
            <span className="flex h-3.5 items-end gap-0.5" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="animate-eq h-full w-0.5 origin-bottom rounded-full bg-ink"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </span>
          )}
          <p className="truncate text-lg font-bold">{track.title}</p>
        </div>
        <p className="mb-5 text-center text-sm text-muted">{track.artist}</p>

        <div className="flex items-center justify-center gap-8">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              skip(-1)
            }}
            aria-label="Previous track"
            className="text-ink/70 transition-colors hover:text-ink"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 5v14" />
              <path d="M18 5l-9 7 9 7V5z" fill="currentColor" stroke="none" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              togglePlay()
            }}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="text-ink transition-transform hover:scale-110"
          >
            {isPlaying ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M7 5h4v14H7zm6 0h4v14h-4z" />
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7L8 5z" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              skip(1)
            }}
            aria-label="Next track"
            className="text-ink/70 transition-colors hover:text-ink"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 5v14" />
              <path d="M6 5l9 7-9 7V5z" fill="currentColor" stroke="none" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tonearm — swings onto the record while playing */}
      <svg
        width="26"
        height="150"
        viewBox="0 0 26 150"
        className="pointer-events-none absolute -top-[136px] right-1 origin-[13px_12px] transition-transform duration-700 ease-in-out"
        style={{ transform: isPlaying ? 'rotate(32deg)' : 'rotate(-4deg)' }}
        aria-hidden="true"
      >
        <circle cx="13" cy="12" r="8" fill="#c2c8d0" />
        <circle cx="13" cy="12" r="3" fill="#6b7280" />
        <rect x="11.5" y="14" width="3" height="106" rx="1.5" fill="#b0b7c0" />
        <rect x="8" y="118" width="10" height="24" rx="3" fill="#111" />
      </svg>
    </div>
  )
}
