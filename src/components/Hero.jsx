import { useEffect, useRef } from 'react'
import { motion, useSpring, useReducedMotion } from 'framer-motion'
import MusicPlayer from './MusicPlayer.jsx'
import { SlideIcon, EYE, DOC } from './SlideIcon.jsx'

const STACK_TOOLS = [
  { name: 'Figma', src: '/logos/stack-figma.svg' },
  { name: 'Claude', src: '/logos/claude-icon.png' },
  { name: 'Cursor', src: '/logos/stack-cursor.png' },
  { name: 'Framer', src: '/logos/stack-framer.svg' },
  { name: 'Adobe', src: '/logos/stack-adobe.svg' },
  { name: 'Blender', src: '/logos/stack-blender.svg' },
  { name: 'WordPress', src: '/logos/stack-wordpress.svg' },
  { name: 'Unreal Engine', src: '/logos/stack-unreal.svg' },
  { name: 'Notion', src: '/logos/stack-notion.svg' },
  { name: 'Affinity', src: '/logos/stack-affinity.png' },
]

// Repulsion radius and max push distance (px).
const REPEL_RADIUS = 90
const REPEL_STRENGTH = 27.5

function Repel({ children, className = '' }) {
  const ref = useRef(null)
  const x = useSpring(0, { stiffness: 300, damping: 18, mass: 0.5 })
  const y = useSpring(0, { stiffness: 300, damping: 18, mass: 0.5 })
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return
    const onMove = (e) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const dx = rect.left + rect.width / 2 - e.clientX
      const dy = rect.top + rect.height / 2 - e.clientY
      const dist = Math.hypot(dx, dy)
      if (dist < REPEL_RADIUS && dist > 0) {
        const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH
        x.set((dx / dist) * force)
        y.set((dy / dist) * force)
      } else {
        x.set(0)
        y.set(0)
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [prefersReducedMotion, x, y])

  return (
    <motion.div ref={ref} style={{ x, y }} className={className}>
      {children}
    </motion.div>
  )
}

// Premium entrance choreography: headline fades in, everything else
// slides up in a stagger. Respects reduced motion via MotionConfig.
const EASE = [0.22, 1, 0.36, 1]
const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.25 } },
}
const slideUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 1.05, ease: EASE } },
}
const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 1.35, ease: EASE } },
}

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-[50px] md:grid-cols-[1.3fr_1fr]">
      <motion.div variants={heroContainer} initial="hidden" animate="show">
        <motion.div variants={slideUp}>
          <Repel className="inline-block">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#F0F0F0] px-4 py-2 text-xs font-semibold tracking-wide text-ink">
              <img src="/logos/case.svg" alt="" width="14" height="14" aria-hidden="true" />
              2.8+ YOE
            </span>
          </Repel>
        </motion.div>

        <motion.h1
          variants={fadeIn}
          className="mt-6 text-[24px] font-semibold leading-[1.35] tracking-tight text-ink md:text-[26px] lg:whitespace-nowrap"
        >
          I design for the moment things get complicated.
        </motion.h1>

        <motion.p
          variants={slideUp}
          className="mt-4 max-w-lg text-[17px] font-medium leading-relaxed text-[#8D8D8D]"
        >
          Product designer · I ship, prototype in code, and let AI make me
          faster.
        </motion.p>

        <motion.div variants={slideUp} className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#work"
            className="group inline-flex items-center rounded-full bg-ink px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80"
          >
            <SlideIcon>{EYE}</SlideIcon>
            View work
          </a>
          <a
            href="/Madia-Venkatesh-Rao_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center rounded-full border border-black/15 px-7 py-3 text-sm font-semibold transition-colors hover:bg-black/5"
          >
            <SlideIcon>{DOC}</SlideIcon>
            Resume
          </a>
        </motion.div>

        <motion.div variants={slideUp} className="mt-12">
          <p className="font-hand text-[14px] text-muted">My stack</p>
          <div className="flex flex-wrap -space-x-2.5">
            {STACK_TOOLS.map((tool) => (
              <Repel key={tool.name}>
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white shadow-[0_6px_16px_rgba(0,0,0,0.08)]"
                  title={tool.name}
                >
                  <img
                    src={tool.src}
                    alt={tool.name}
                    className="h-5 w-5 object-contain"
                  />
                </span>
              </Repel>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 48 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.15, delay: 0.55, ease: EASE }}
        className="flex justify-center pt-40 md:justify-end md:pr-6 md:pt-24"
      >
        <MusicPlayer />
      </motion.div>
    </section>
  )
}
