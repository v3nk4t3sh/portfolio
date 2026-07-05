import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

// Scatter positions are relative to the viewport center (vw/vh offsets).
// `start` staggers when each card begins flying out (0..1 scroll progress).
const ITEMS = [
  { key: 'p1', type: 'photo', src: '/life/photo-1.JPG', cardClass: 'w-40 md:w-56 aspect-[16/10]', x: '-36vw', y: '-34vh', rotate: -6, z: 1, start: 0.1 },
  { key: 's1', type: 'spotify', title: 'Terminal Frost', artist: 'Pink Floyd', art: '/life/photo-2.jpg', x: '-20vw', y: '-24vh', rotate: 4, z: 2, start: 0.14 },
  { key: 'p3', type: 'photo', src: '/life/photo-3.JPG', cardClass: 'w-36 md:w-52 aspect-square', x: '-1vw', y: '-36vh', rotate: -3, z: 1, start: 0.18 },
  { key: 'p4', type: 'photo', src: '/life/photo-4.png', cardClass: 'w-32 md:w-44 aspect-[3/4]', x: '22vw', y: '-32vh', rotate: 6, z: 1, start: 0.22 },
  { key: 's2', type: 'spotify', title: 'Persephone', artist: 'Opeth', art: '/life/photo-5.JPG', x: '37vw', y: '-27vh', rotate: -5, z: 2, start: 0.26 },
  { key: 'p6', type: 'photo', src: '/life/photo-6.JPG', cardClass: 'w-48 md:w-64 aspect-[16/9]', x: '-35vw', y: '0vh', rotate: -4, z: 1, start: 0.3 },
  { key: 'p7', type: 'photo', src: '/life/photo-7.png', cardClass: 'w-36 md:w-48 aspect-[3/4]', x: '-17vw', y: '20vh', rotate: 3, z: 2, start: 0.34 },
  { key: 'p8', type: 'photo', src: '/life/photo-8.JPG', cardClass: 'w-40 md:w-56 aspect-[16/10]', x: '-36vw', y: '34vh', rotate: -6, z: 1, start: 0.38 },
  { key: 'p9', type: 'photo', src: '/life/photo-9.jpg', cardClass: 'w-40 md:w-56 aspect-[16/10]', x: '10vw', y: '34vh', rotate: 3, z: 1, start: 0.42 },
  // The hero card — visible from the start, drifts right as the rest scatter.
  { key: 'hero', type: 'photo', src: '/life/photo-10.JPG', cardClass: 'w-48 md:w-64 aspect-[4/5]', x: '32vw', y: '15vh', rotate: 5, z: 3, start: 0.15, hero: true },
]

function CardContent({ item }) {
  if (item.type === 'spotify') {
    return (
      <div className="w-36 rounded-2xl bg-[#161616] p-3 shadow-2xl shadow-black/30 md:w-44">
        <img src={item.art} alt={`${item.title} album art`} className="aspect-square w-full rounded-xl object-cover" />
        <p className="mt-3 text-sm font-bold text-white">{item.title}</p>
        <p className="text-xs font-medium text-gray-400">{item.artist}</p>
        <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#1DB954]">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
              <path d="M6 9.5c4-1 8-.5 11 1M7 13c3.2-.8 6.4-.4 9 .9M8 16.3c2.5-.6 5-.3 7 .7" />
            </svg>
          </span>
          Spotify
        </p>
      </div>
    )
  }
  return (
    <img
      src={item.src}
      alt=""
      className={`${item.cardClass} rounded-2xl object-cover shadow-xl shadow-black/20`}
    />
  )
}

function ScatterCard({ item, progress }) {
  const end = Math.min(item.start + 0.38, 0.9)
  const x = useTransform(progress, [item.start, end], ['0vw', item.x])
  const y = useTransform(progress, [item.start, end], ['0vh', item.y])
  const rotate = useTransform(progress, [item.start, end], [0, item.rotate])
  const scaleMV = useTransform(progress, [item.start, end], [0.55, 1])
  const opacityMV = useTransform(progress, [item.start, item.start + 0.06], [0, 1])

  return (
    <motion.div
      className="absolute"
      style={{
        x,
        y,
        rotate,
        scale: item.hero ? 1 : scaleMV,
        opacity: item.hero ? 1 : opacityMV,
        zIndex: item.z,
      }}
    >
      {/* Inner wrapper handles hover so it can't fight the scroll transforms */}
      <motion.div
        whileHover={{ scale: 1.06, rotate: item.rotate > 0 ? -3 : 3, y: -6 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      >
        <CardContent item={item} />
      </motion.div>
    </motion.div>
  )
}

function CenterText({ className = '', style }) {
  return (
    <motion.h2
      style={style}
      className={`text-center text-[30px] font-bold leading-tight tracking-tight text-ink ${className}`}
    >
      Life Outside
      <br />
      <span className="font-pixel text-[26px] leading-loose">Pixels</span>
    </motion.h2>
  )
}

export default function LifeOutsidePixels() {
  const ref = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    window.addEventListener('resize', update)
    return () => {
      mq.removeEventListener('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  const textOpacity = useTransform(scrollYProgress, [0.22, 0.45], [0, 1])
  const textScale = useTransform(scrollYProgress, [0.22, 0.45], [0.92, 1])
  // Slight upward drift at the end, easing into the contact section.
  const driftY = useTransform(scrollYProgress, [0.75, 1], ['0vh', '-8vh'])

  // Mobile: a simple two-column photo grid instead of the scroll choreography.
  if (isMobile) {
    return (
      <section className="bg-white px-6 py-14">
        <h2 className="text-[22px] font-bold tracking-tight text-ink">
          Life Outside Pixels
        </h2>
        <p className="mt-1 text-[15px] font-medium text-[#8D8D8D]">
          Few snippets from my photography.
        </p>
        <div className="mt-6 columns-2 gap-3">
          {ITEMS.filter((item) => item.type === 'photo').map((item) => (
            <img
              key={item.key}
              src={item.src}
              alt=""
              loading="lazy"
              className="mb-3 w-full rounded-2xl"
            />
          ))}
        </div>
      </section>
    )
  }

  // Reduced motion: static scattered layout, no scroll choreography.
  if (prefersReducedMotion) {
    return (
      <section className="relative overflow-hidden bg-white" data-cursor="Scroll">
        <div className="relative flex h-screen items-center justify-center">
          <CenterText />
          {ITEMS.map((item) => (
            <div
              key={item.key}
              className="absolute"
              style={{
                transform: `translate(${item.x}, ${item.y}) rotate(${item.rotate}deg)`,
                zIndex: item.z,
              }}
            >
              <CardContent item={item} />
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} className="relative h-[300vh] bg-white" data-cursor="Scroll">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative flex h-full items-center justify-center">
          <CenterText style={{ opacity: textOpacity, scale: textScale }} />
          {/* Drift wrapper: after the scatter, only the cards keep moving up */}
          <motion.div
            style={{ y: driftY }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {ITEMS.map((item) => (
              <ScatterCard key={item.key} item={item} progress={scrollYProgress} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
