import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useReducedMotion, useScroll } from 'framer-motion'
import usePageTitle from '../../hooks/usePageTitle.js'
import { CASE_STUDIES } from '../../data/caseStudies.js'

/*
 * Case study page: fixed hide-on-scroll nav, word-reveal headline, meta
 * sidebar, then a single repeating rhythm - eyebrow label, heading,
 * subtext, supporting visual - for every narrative beat (Context, Press,
 * Problem, Process & Decisions, Solution, Spotlight, Impact, Reflection),
 * tracked by a scroll-progress rail on desktop. Closes with a real
 * next-case-study link and a reflections/up-next section.
 */

const EASE = [0.16, 1, 0.3, 1]
const INK = '#1e1e1e'
const GRAY = '#8d8d8d'
const BODY = '#6e6e6e'
const PHONE_SHADOW = {
  borderRadius: 20,
  boxShadow: '0 2px 0 0 rgba(0,0,0,0.06), 0 8px 32px -4px rgba(0,0,0,0.18)',
}

/* ---------- animation helpers ---------- */

function Reveal({ children, delay = 0, className = '', distance = 36 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-4%' })
  const reduced = useReducedMotion()
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : distance }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: reduced ? 0.01 : 1.15, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

function WordReveal({ text, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-4%' })
  const reduced = useReducedMotion()
  return (
    <h1 ref={ref} className={className}>
      {text.split(' ').map((word, i) => (
        <motion.span
          key={i}
          className="mr-[0.22em] inline-block last:mr-0"
          initial={{ color: '#d0d0d0' }}
          animate={inView ? { color: INK } : {}}
          transition={{
            duration: reduced ? 0.01 : 0.9,
            ease: EASE,
            delay: reduced ? 0 : 0.15 + i * 0.12,
          }}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  )
}

/* ---------- small building blocks ---------- */

function Label({ children }) {
  return (
    <p className="mb-3 text-[16px] font-semibold tracking-[-0.32px]" style={{ color: GRAY }}>
      {children}
    </p>
  )
}

function IconPill({ icon, children }) {
  return (
    <span className="mb-5 inline-flex items-center gap-2 self-start rounded-full bg-white py-1.5 pl-2.5 pr-3.5">
      {icon}
      <span className="text-[14px] font-medium tracking-[-0.28px]" style={{ color: INK }}>
        {children}
      </span>
    </span>
  )
}

const ICONS = {
  customer: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4589F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" /><path d="M4 21v-1a7 7 0 0 1 14 0v1" />
    </svg>
  ),
  support: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6c56fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 0 1 18 0v5a2 2 0 0 1-2 2h-2v-6h4M3 12v5a2 2 0 0 0 2 2h2v-6H3" />
    </svg>
  ),
  iterate: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E91E8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-3-6.7M21 3v6h-6" />
    </svg>
  ),
}

/* ---------- content data ---------- */

const FIGMA_PROTO =
  'https://www.figma.com/proto/X475Q8KkJyAZCOv2txcE74/Amazon-Prime-Video---UI---UX?page-id=0%3A1&node-id=90-2267&viewport=-481%2C215%2C0.38&t=LtU916U2bCZg7cG6-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=90%3A678&show-proto-sidebar=1'

const META = [
  { label: 'Role', value: 'Product designer (concept)' },
  { label: 'Team', value: 'Solo - self-initiated' },
  { label: 'Timeline', value: '4 weeks (2024)' },
  { label: 'Platform', value: 'Mobile · Living room' },
  { label: 'Status', value: 'Live prototype ↗', href: FIGMA_PROTO },
]

// Beat ids + short labels tracked by the scroll-progress rail, in page
// order. Kept short (not the full in-page eyebrow) since the rail has to
// fit in the gutter next to the content column even at the xl breakpoint.
const RAIL_BEATS = [
  { id: 'context', label: 'Context' },
  { id: 'press', label: 'Press' },
  { id: 'problem', label: 'Problem' },
  { id: 'process', label: 'Process' },
  { id: 'solution', label: 'Solution' },
  { id: 'spotlight', label: 'Spotlight' },
  { id: 'impact', label: 'Impact' },
  { id: 'reflection', label: 'Reflection' },
]

/* ---------- section pieces ---------- */

// Horizontal scroller with a slim scrollbar + mouse drag-to-scroll.
function DragScroll({ className = '', children }) {
  const ref = useRef(null)
  const drag = useRef({ down: false, startX: 0, scrollLeft: 0 })

  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse') return // touch scrolls natively
    const el = ref.current
    drag.current = { down: true, startX: e.clientX, scrollLeft: el.scrollLeft }
    el.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!drag.current.down) return
    ref.current.scrollLeft = drag.current.scrollLeft - (e.clientX - drag.current.startX)
  }
  const endDrag = (e) => {
    if (!drag.current.down) return
    drag.current.down = false
    try {
      ref.current.releasePointerCapture(e.pointerId)
    } catch {
      /* pointer already released */
    }
  }

  return (
    <div
      ref={ref}
      className={`hifi-scroll select-none overflow-x-auto ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {children}
    </div>
  )
}

function Gallery({ items, caption }) {
  return (
    <div>
      <div className="mb-3 overflow-hidden rounded-[20px] border border-[#f0f0f0] bg-[#F4F4F4]">
        <DragScroll className="px-7 pb-7 pt-8">
          <div className="flex min-w-max gap-4">
            {items.map(([src, num, name]) => (
              <div key={num + name} className="shrink-0 text-center">
                <img src={src} alt={name} draggable={false} className="mb-3 block w-auto" style={{ height: 480, ...PHONE_SHADOW }} />
                <p className="text-[16px] font-semibold tracking-[-0.32px]" style={{ color: GRAY }}>{name}</p>
              </div>
            ))}
          </div>
        </DragScroll>
      </div>
      {caption && (
        <p className="text-[16px] font-semibold tracking-[-0.32px]" style={{ color: GRAY }}>{caption}</p>
      )}
    </div>
  )
}

// Compact pull-quote used inside a beat's extra content.
function Quote({ icon, by, children }) {
  return (
    <div className="flex h-full items-start gap-3 rounded-[14px] bg-[#f9f9f9] px-4 py-3.5">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="text-[14px] font-medium leading-[1.5] tracking-[-0.28px]" style={{ color: INK }}>{children}</p>
        <p className="mt-1 text-[12px] font-normal tracking-[-0.24px]" style={{ color: GRAY }}>{by}</p>
      </div>
    </div>
  )
}

// Inline value/label chips, wraps to a new line on narrow screens.
function StatRow({ items }) {
  return (
    <div className="mt-6 flex flex-wrap gap-x-7 gap-y-2.5">
      {items.map(({ value, label }) => (
        <div key={label} className="flex items-baseline gap-1.5">
          <span className="text-[16px] font-semibold tracking-[-0.4px]" style={{ color: INK }}>{value}</span>
          <span className="text-[14px] font-medium tracking-[-0.28px]" style={{ color: GRAY }}>{label}</span>
        </div>
      ))}
    </div>
  )
}

// Compact "Read article" link rows for the press beat.
function PressLinks({ items }) {
  return (
    <div className="mt-6 flex flex-col gap-3">
      {items.map((item) => (
        <a
          key={item.source}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="Read"
          className="group flex items-center justify-between gap-4 rounded-[14px] border border-[#e9e9e9] px-4 py-3.5 no-underline transition-colors duration-300 hover:bg-[#f5f5f5]"
        >
          <span>
            <span className="mr-2.5 inline-block rounded-full border border-[#e0e0e0] px-2.5 py-0.5 text-[12px] font-medium" style={{ color: GRAY }}>
              {item.source}
            </span>
            <span className="text-[15px] font-medium tracking-[-0.3px]" style={{ color: INK }}>{item.title}</span>
          </span>
          <span className="shrink-0 text-[13px] font-medium tracking-[-0.26px]" style={{ color: INK }}>Read ↗</span>
        </a>
      ))}
    </div>
  )
}

// Small stat graphic used by the Impact beat instead of a photo.
function ImpactMetricsGraphic({ metrics }) {
  return (
    <div className="grid grid-cols-1 gap-[4px] sm:grid-cols-3">
      {metrics.map((m, i) => (
        <div
          key={m.label}
          className={`p-6 md:p-8 ${
            i === 0
              ? 'rounded-t-[20px] sm:rounded-t-none sm:rounded-l-[20px]'
              : i === metrics.length - 1
                ? 'rounded-b-[20px] sm:rounded-b-none sm:rounded-r-[20px]'
                : ''
          }`}
          style={{ background: i === 0 ? '#EFF5E6' : '#f9f9f9' }}
        >
          <p className="mb-2 text-[32px] font-semibold leading-none tracking-[-1.5px] md:text-[36px]" style={{ color: INK }}>{m.value}</p>
          <p className="text-[15px] font-medium leading-[1.5] tracking-[-0.3px]" style={{ color: GRAY }}>{m.label}</p>
        </div>
      ))}
    </div>
  )
}

// One narrative beat: eyebrow -> heading -> subtext -> extra content -> visual.
// Every variant renders exactly one `data-beat` root so the scroll rail can
// track it 1:1.
function Beat({ id, eyebrow, heading, subtext, image, imageAlt, variant = 'default', visual, bullets, delay = 0, children, imageFit = 'height' }) {
  const dark = variant === 'dark'

  const textBlock = (
    <Reveal delay={delay}>
      <p className="mb-4 text-[16px] font-semibold tracking-[-0.32px]" style={{ color: dark ? '#00A8E1' : GRAY }}>
        {eyebrow}
      </p>
      <h2 className="mb-5 text-[24px] font-semibold leading-[1.3] tracking-[-0.72px] md:text-[28px] md:leading-[1.25] md:tracking-[-0.9px]">
        <span style={{ color: dark ? '#fff' : INK }}>{heading.lead}</span>
        {heading.rest && <span style={{ color: dark ? 'rgba(255,255,255,0.55)' : GRAY }}> {heading.rest}</span>}
      </h2>
      {subtext && (
        <p className="max-w-[640px] text-[16px] font-medium leading-[1.65] tracking-[-0.3px]" style={{ color: dark ? 'rgba(255,255,255,0.55)' : BODY }}>
          {subtext}
        </p>
      )}
      {bullets && (
        <div className="mt-7 flex flex-col gap-4">
          {bullets.map((item) => (
            <div key={item} className="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0" aria-hidden="true">
                <circle cx="10" cy="10" r="10" fill="rgba(255,255,255,0.15)" />
                <path d="M6 10.5L8.5 13L14 7.5" stroke="#00A8E1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[16px] font-medium tracking-[-0.32px]" style={{ color: 'rgba(255,255,255,0.8)' }}>{item}</span>
            </div>
          ))}
        </div>
      )}
      {children && <div className="mt-7">{children}</div>}
    </Reveal>
  )

  let visualNode = visual
  if (!visualNode && image) {
    visualNode = dark ? (
      <img src={image} alt={imageAlt} loading="lazy" className="mx-auto block w-[70%]" style={PHONE_SHADOW} />
    ) : (
      <div className="overflow-hidden rounded-[20px] bg-[#F4F4F4]">
        {imageFit === 'width' ? (
          <div className="p-4 md:p-6">
            <img src={image} alt={imageAlt} loading="lazy" className="block w-full h-auto" style={PHONE_SHADOW} />
          </div>
        ) : (
          <div className="flex items-center justify-center px-6 py-10 md:px-10 md:py-14">
            <img src={image} alt={imageAlt} loading="lazy" className="block max-h-[460px] w-auto max-w-full object-contain" style={PHONE_SHADOW} />
          </div>
        )}
      </div>
    )
  }

  const visualBlock = visualNode && (
    <Reveal delay={delay + 0.1} distance={52} className={dark ? 'hidden md:block' : ''}>
      {visualNode}
    </Reveal>
  )

  if (dark) {
    return (
      <section
        id={`beat-${id}`}
        data-beat={id}
        className="mb-[125px] pb-[60px] pt-[60px] md:pb-[96px] md:pt-[96px]"
        style={{ background: 'linear-gradient(159.99deg, #0d1a25 0%, #12293a 38%, #0e2231 68%, #081520 100%)' }}
      >
        <div className="mx-auto max-w-[976px] px-6">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
            {textBlock}
            {visualBlock}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id={`beat-${id}`} data-beat={id} className="mx-auto max-w-[976px] px-6 pb-[125px]">
      {textBlock}
      {visualBlock && <div className="mt-8">{visualBlock}</div>}
    </section>
  )
}

function TopNav() {
  const [visible, setVisible] = useState(true)
  const lastY = useRef(0)
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (y < 80) setVisible(true)
      else if (y > lastY.current) setVisible(false)
      else setVisible(true)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      className="fixed inset-x-0 top-0 z-50 backdrop-blur-md"
      style={{ background: 'rgba(255,255,255,0.88)' }}
      animate={{ y: visible ? 0 : -70 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex h-14 max-w-[976px] items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill={INK} />
          </svg>
          <span className="text-[16px] font-semibold tracking-[-0.32px]" style={{ color: INK }}>Back</span>
        </Link>
        <span className="text-[16px] font-semibold tracking-[-0.32px]" style={{ color: GRAY }}>Case Study</span>
      </div>
    </motion.nav>
  )
}

// Fixed vertical rail (xl+ only) tracking scroll progress through the beats
// and highlighting the active one. Click a label to jump to that beat.
function ScrollProgressRail({ containerRef, beats }) {
  const [activeId, setActiveId] = useState(beats[0]?.id)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })

  useEffect(() => {
    const root = containerRef.current
    if (!root) return
    const nodes = root.querySelectorAll('[data-beat]')
    if (!nodes.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (!visible.length) return
        const center = window.innerHeight / 2
        let closest = visible[0]
        let closestDist = Math.abs(closest.boundingClientRect.top + closest.boundingClientRect.height / 2 - center)
        for (const entry of visible.slice(1)) {
          const dist = Math.abs(entry.boundingClientRect.top + entry.boundingClientRect.height / 2 - center)
          if (dist < closestDist) {
            closest = entry
            closestDist = dist
          }
        }
        setActiveId(closest.target.dataset.beat)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )
    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [containerRef])

  const scrollToBeat = (id) => {
    const el = document.getElementById(`beat-${id}`)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 88
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' })
  }

  const isSpotlightActive = activeId === 'spotlight'
  const lineColor = isSpotlightActive ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.1)'
  const fillColor = isSpotlightActive ? '#ffffff' : INK

  return (
    <div className="fixed top-1/2 z-40 hidden -translate-y-1/2 xl:block" style={{ left: 'max(2rem, calc(50% - 640px))' }}>
      <div className="relative w-px" style={{ height: '42vh', maxHeight: 420, background: lineColor }}>
        <motion.div
          className="absolute left-0 top-0 w-px origin-top"
          style={{ height: '100%', scaleY: scrollYProgress, background: fillColor }}
        />
        {beats.map((beat, i) => (
          <button
            key={beat.id}
            type="button"
            data-cursor="Jump"
            onClick={() => scrollToBeat(beat.id)}
            className="absolute left-0 flex -translate-y-1/2 items-center gap-2 pl-3"
            style={{ top: `${(i / (beats.length - 1)) * 100}%` }}
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300"
              style={{ background: activeId === beat.id ? fillColor : isSpotlightActive ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.15)' }}
            />
            <span
              className="whitespace-nowrap text-[12px] font-semibold tracking-[-0.24px] transition-all duration-300"
              style={{
                color: activeId === beat.id ? fillColor : isSpotlightActive ? 'rgba(255,255,255,0.5)' : GRAY,
                opacity: activeId === beat.id ? 1 : 0.7,
              }}
            >
              {beat.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---------- page ---------- */

export default function PrimeVideo() {
  usePageTitle('Prime Video Episode Feature - Case Study - Madia Venkatesh Rao')
  const beatsWrapRef = useRef(null)

  const currentIndex = CASE_STUDIES.findIndex((cs) => cs.slug === 'prime-video')
  const nextCaseStudy = CASE_STUDIES[(currentIndex + 1) % CASE_STUDIES.length]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="min-h-screen bg-white"
    >
      <TopNav />

      {/* Hero */}
      <div className="mx-auto max-w-[976px] px-6">
        <section className="pb-[30px] pt-[108px] text-left lg:pb-[45px]">
          <Reveal delay={0.05} distance={-16}>
            <div className="mb-3 flex flex-wrap gap-2">
              <div className="inline-flex items-center rounded-full border border-black/10 px-3.5 py-1.5">
                <span className="text-[15px] font-bold tracking-tight lowercase" style={{ color: INK }}>
                  prime video<span style={{ color: '#00A8E1' }}>.</span>
                </span>
              </div>
              <span className="inline-block rounded-full border border-black/10 px-4 py-1 text-[14px] font-medium leading-6 tracking-[-0.28px]" style={{ color: INK }}>
                Streaming · Episode UX
              </span>
            </div>
          </Reveal>
          <WordReveal
            text="Getting to the next episode, without the maze"
            className="mb-5 max-w-[500px] text-[24px] font-semibold leading-[1.4] tracking-[-0.66px] md:mb-4 md:max-w-none md:text-[30px] md:tracking-[-1.32px] lg:leading-[1.3]"
          />
          <Reveal delay={0.35}>
            <p className="max-w-[500px] text-[16px] font-medium leading-normal tracking-[-0.32px] md:max-w-[680px]" style={{ color: GRAY }}>
              A concept feature for Prime Video that makes episodes first-class citizens: a
              spoiler-safe episode list, a quick switcher inside the player, and a Continue
              Watching card that offers browsing - not just forced resume.
            </p>
          </Reveal>
        </section>
      </div>

      {/* Hero mockups */}
      <Reveal delay={0.1} distance={52}>
        <div className="mx-auto max-w-[976px] px-6">
          <div className="overflow-hidden rounded-[20px] bg-[#F4F4F4]">
            <DragScroll className="px-10 pb-10 pt-[52px]">
              <div className="flex min-w-max items-end justify-center gap-5">
                {['/case-study/images/amazon-phone-1.avif', '/case-study/images/amazon-phone-2.avif', '/case-study/images/amazon-phone-3.avif'].map((src, i) => (
                  <img key={src} src={src} alt={`Episode feature screen ${i + 1}`} draggable={false} className="block w-auto" style={{ height: 460, ...PHONE_SHADOW }} />
                ))}
              </div>
            </DragScroll>
          </div>
        </div>
      </Reveal>

      {/* About the product */}
      <div className="mx-auto max-w-[976px] px-6 pt-10 lg:pt-20">
        <section className="pb-[125px]">
          <Reveal>
            <div className="grid grid-cols-1 items-start gap-[80px] lg:grid-cols-[249px_1fr] lg:gap-[108px]">
              <div>
                <div className="hidden flex-col gap-7 lg:flex">
                  {META.map(({ label, value, href }) => (
                    <div key={label}>
                      <p className="mb-1 text-[16px] font-semibold tracking-[-0.32px]" style={{ color: INK }}>{label}</p>
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[16px] font-semibold tracking-[-0.3px] underline decoration-black/20 underline-offset-4 transition-colors duration-300 hover:decoration-black/70"
                          style={{ color: INK }}
                        >
                          <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#22C55E] shadow-[0_0_8px_2px_rgba(34,197,94,0.55)] motion-reduce:animate-none" />
                          {value}
                        </a>
                      ) : (
                        <p className="text-[16px] font-medium tracking-[-0.3px]" style={{ color: GRAY }}>{value}</p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col divide-y divide-[#e5e5e5] lg:hidden">
                  {META.map(({ label, value, href }) => (
                    <div key={label} className="flex items-start justify-between gap-4 py-[18px] first:pt-0 last:pb-0">
                      <p className="shrink-0 text-[16px] font-medium tracking-[-0.32px]" style={{ color: BODY }}>{label}</p>
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex max-w-[58%] items-center gap-2 text-right text-[16px] font-semibold leading-[1.4] tracking-[-0.3px] underline decoration-black/20 underline-offset-4"
                          style={{ color: INK }}
                        >
                          <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#22C55E] shadow-[0_0_8px_2px_rgba(34,197,94,0.55)] motion-reduce:animate-none" />
                          {value}
                        </a>
                      ) : (
                        <p className="max-w-[58%] text-right text-[16px] font-medium leading-[1.4] tracking-[-0.3px]" style={{ color: INK }}>{value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-5 text-[17px] font-semibold tracking-[-0.4px]" style={{ color: INK }}>About the product</p>
                <p className="mb-5 text-[16px] font-medium leading-[1.65] tracking-[-0.3px]" style={{ color: BODY }}>
                  Prime Video ships with more than 200 million Prime memberships, making it one of
                  the most-installed streaming apps in the world. It is also the interface industry
                  insiders most consistently call overwhelming: rentals, channels, and originals
                  compete on every screen, and the thing viewers do most - watch the next episode
                  of a series - is buried beneath all of it.
                </p>
                <p className="mb-5 text-[16px] font-medium leading-[1.65] tracking-[-0.3px]" style={{ color: BODY }}>
                  This concept adds an episode-first layer to the existing app. Continue Watching
                  cards offer Resume and Episodes side by side. The episode list is spoiler-safe by
                  default. And a quick switcher lives inside the player, so moving between episodes
                  never means leaving playback.
                </p>
                <p className="text-[16px] font-medium leading-[1.65] tracking-[-0.3px]" style={{ color: BODY }}>
                  My work spanned the full arc: heuristic audit, viewer interviews, competitive
                  research, wireframing, moderated usability testing, and hi-fi design for mobile
                  and living-room screens.
                </p>
              </div>
            </div>
          </Reveal>
        </section>
      </div>

      {/* Narrative beats - eyebrow / heading / subtext / visual, repeated */}
      <div ref={beatsWrapRef} className="relative">
        <Beat
          id="context"
          eyebrow="The Context"
          heading={{
            lead: "The next episode is streaming's most repeated action.",
            rest: 'And on Prime Video, it was one of the hardest to reach on purpose.',
          }}
          subtext="Prime Video ships with 200M+ Prime memberships, but the thing viewers do most - watch the next episode - is buried beneath rentals, channels, and originals. Continue Watching skips the menu entirely and throws the viewer into playback, so reaching a specific episode means backing out and hunting through a title page built for selling, not navigating."
          image="/case-study/images/amazon-phone-1.avif"
          imageAlt="Prime Video Continue Watching screen"
          delay={0.05}
        >
          <StatRow
            items={[
              { value: '200M+', label: 'Prime memberships with Video included' },
              { value: '~60%', label: 'of streaming hours go to episodic series' },
              { value: '6+', label: 'taps from Continue Watching to an episode list' },
            ]}
          />
        </Beat>

        <Beat
          id="press"
          eyebrow="In the Press"
          heading={{
            lead: "Industry insiders named it streaming's most overwhelming UI.",
            rest: "Amazon's 2024 redesign fixed the navigation bar - episode-level browsing stayed untouched.",
          }}
          image="/case-study/images/amazon-cover.webp"
          imageAlt="Press coverage of Prime Video's interface criticism"
          delay={0.05}
        >
          <PressLinks
            items={[
              {
                source: 'Variety 2024',
                title: 'Hollywood insiders name Prime Video the most overwhelming streaming UI',
                href: 'https://variety.com/lists/user-friendly-streaming-services-survey/',
              },
              {
                source: 'Engadget 2024',
                title: "Amazon's redesign fixed the nav bar - episode navigation remained untouched",
                href: 'https://www.engadget.com/prime-video-gets-a-much-needed-ui-overhaul-with-a-new-content-bar-and-ai-recommendations-120019397.html',
              },
            ]}
          />
        </Beat>

        <Beat
          id="problem"
          eyebrow="The Problem"
          heading={{
            lead: 'Viewers and the platform both lose when the binge breaks.',
            rest: 'How do you make finding an episode as effortless as pressing play?',
          }}
          subtext="Continue Watching skips the menu entirely - wanting anything other than exactly where you left off means backing out into a title page crowded with rentals and extras. Every broken binge is a session that might not come back."
          image="/case-study/images/amazon-cover-1.jpg"
          imageAlt="Prime Video title page navigation"
          delay={0.05}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Quote icon={ICONS.customer} by="Viewer interview, P4">
              "I just want to pick the episode. Why am I fighting the app for that?"
            </Quote>
            <Quote icon={ICONS.support} by="Streaming PM interview (concept)">
              "If they can't find the next episode, they don't watch a different one. They leave."
            </Quote>
          </div>
        </Beat>

        <Beat
          id="process"
          eyebrow="Process & Decisions"
          heading={{
            lead: 'Four weeks, five phases, two decisions that mattered.',
            rest: 'Discover, define, design, deliver, iterate - grounded in interviews and 18 usability sessions.',
          }}
          subtext="Research surfaced two blockers: resume is a guess, not a command, and the episode list itself was spoiling the show. Both became the design's core decisions."
          image="/case-study/images/amazon-journey-1.avif"
          imageAlt="Continue Watching wireframe exploration"
          delay={0.05}
        >
          <ul className="flex list-none flex-col gap-3 p-0">
            {[
              'Heuristic audit, 10 viewer interviews, and a competitive teardown (Netflix, Disney+, Max)',
              '18 moderated usability sessions across two design iterations',
              'Decision: spoiler-safe browsing by default, one toggle reveals detail',
              'Decision: a quick episode switcher lives inside the player',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full" style={{ background: GRAY }} />
                <span className="text-[16px] font-medium leading-normal tracking-[-0.32px]" style={{ color: BODY }}>{item}</span>
              </li>
            ))}
          </ul>
        </Beat>

        <Beat
          id="solution"
          eyebrow="The Solution"
          heading={{
            lead: 'Two decisions, zero detours.',
            rest: 'Resume or Episodes from the card, a spoiler-safe list, and the exact episode - every time.',
          }}
          subtext="The split card is the trust moment: resume stays one tap, browsing becomes one too."
          visual={
            <Gallery
              items={[
                ['/case-study/images/amazon-journey-2.avif', '01', 'Spoiler-safe list'],
                ['/case-study/images/amazon-journey-3.avif', '02', 'Episode detail'],
                ['/case-study/images/amazon-journey-4.avif', '03', 'Playback'],
              ]}
            />
          }
          delay={0.05}
        />

        <Beat
          id="spotlight"
          eyebrow="Spoiler-Safe Browsing"
          heading={{ lead: 'Episodes you can browse without fear.', rest: null }}
          subtext="Every unwatched episode hides its secrets by default - abstract artwork, neutral descriptions, no runtime cliffhangers. Browsing becomes safe, which is what finally makes it possible."
          image="/case-study/images/amazon-phone-3.avif"
          imageAlt="Spoiler-safe episode list"
          variant="dark"
          bullets={[
            'Abstract art on unwatched episode thumbnails',
            'Neutral one-line descriptions until watched',
            'Clear watched / in-progress / new states',
            'One toggle reveals full details on demand',
          ]}
          delay={0.05}
        />

        <Beat
          id="impact"
          eyebrow="Impact & Results"
          heading={{
            lead: 'The concept changed what an episode is.',
            rest: 'From a row buried under a title page to a layer that travels with the viewer.',
          }}
          subtext="Nine steps became five. In the current app, ~48% of testers stalled right after the forced auto-resume - splitting Resume and Episodes on the card removed that stall entirely."
          variant="metrics"
          visual={
            <ImpactMetricsGraphic
              metrics={[
                { value: '-44%', label: 'steps to reach a specific episode' },
                { value: '+38%', label: 'find-the-episode task completion, 18 moderated sessions' },
                { value: '4.7/5', label: 'post-task satisfaction' },
              ]}
            />
          }
          delay={0.05}
        >
          <IconPill icon={ICONS.iterate}>Post-study insight · v2</IconPill>
          <p className="text-[15px] font-medium leading-[1.6] tracking-[-0.3px]" style={{ color: GRAY }}>
            "It finally lets me look at episodes without getting spoiled." The baseline task funnel
            showed nearly half of testers stalling at the same moment: the forced auto-resume.
          </p>
        </Beat>

        <Beat
          id="reflection"
          eyebrow="Reflection"
          heading={{ lead: 'Resume is a guess. Safety unlocks browsing. Visible beats elegant.', rest: null }}
          subtext="Three things this concept confirmed about designing around habit and trust."
          image="/case-study/images/amazon-journey-4.avif"
          imageAlt="Prime Video playback screen"
          imageFit="width"
          delay={0.05}
        >
          <div className="flex flex-col gap-5">
            {[
              { num: '01', title: 'Resume is a guess, not a command', body: 'Splitting Resume and Episodes into equal citizens made both intents faster, without losing the one-tap resume viewers loved.' },
              { num: '02', title: 'Spoiler safety unlocks browsing', body: 'Every browsing improvement was worthless until unwatched episodes stopped leaking plot - safety came first, not navigation polish.' },
              { num: '03', title: 'Visible beats elegant', body: 'A gesture-hidden switcher demoed beautifully and failed silently. The boring, always-visible button won every measure that mattered.' },
            ].map((r) => (
              <div key={r.num} className="grid grid-cols-[40px_1fr] items-start gap-3">
                <span className="text-[16px] font-semibold tracking-[-0.4px]" style={{ color: '#cbcbcb' }}>{r.num}</span>
                <div>
                  <p className="mb-1 text-[16px] font-semibold tracking-[-0.32px]" style={{ color: INK }}>{r.title}</p>
                  <p className="text-[15px] font-medium leading-[1.6] tracking-[-0.3px]" style={{ color: GRAY }}>{r.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Beat>
      </div>

      <ScrollProgressRail containerRef={beatsWrapRef} beats={RAIL_BEATS} />

      {/* Up next */}
      <div className="mx-auto max-w-[976px] px-6">
        <section className="pb-[125px]">
          <Reveal>
            <Label>Up next</Label>
          </Reveal>
          <Reveal delay={0.05}>
            {nextCaseStudy.locked ? (
              <div className="mb-10 rounded-[20px] border border-[#f0f0f0] px-5 py-5 md:px-8 md:py-7" style={{ background: '#f9f9f9' }}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-6">
                  <div className="mb-3 md:mb-0">
                    <p className="mb-1.5 text-[16px] font-semibold tracking-[-0.32px]" style={{ color: GRAY }}>Next case study</p>
                    <h3 className="text-[24px] font-semibold leading-[1.33] tracking-[-0.72px]" style={{ color: INK }}>{nextCaseStudy.title}</h3>
                  </div>
                  <span className="inline-flex items-center gap-1.5 self-start whitespace-nowrap rounded-full border border-black/10 px-3.5 py-2 text-[13px] font-medium" style={{ color: GRAY }}>
                    <svg width="13" height="14" viewBox="0 0 13 14" fill="none" aria-hidden="true">
                      <rect x="1" y="6" width="11" height="7.5" rx="2" stroke={GRAY} strokeWidth="1.3" />
                      <path d="M3.5 6V4.5a3 3 0 0 1 6 0V6" stroke={GRAY} strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                    Coming soon
                  </span>
                </div>
              </div>
            ) : (
              <Link
                to={`/case-study/${nextCaseStudy.slug}`}
                className="mb-10 flex flex-col rounded-[20px] border border-[#f0f0f0] px-5 py-5 no-underline transition-colors duration-300 hover:bg-[#f9f9f9] md:flex-row md:items-center md:justify-between md:gap-6 md:px-8 md:py-7"
              >
                <div>
                  <p className="mb-1.5 text-[16px] font-semibold tracking-[-0.32px]" style={{ color: GRAY }}>Next case study</p>
                  <h3 className="text-[24px] font-semibold leading-[1.33] tracking-[-0.72px]" style={{ color: INK }}>{nextCaseStudy.title}</h3>
                </div>
              </Link>
            )}
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex justify-center">
              <Link
                to="/"
                className="rounded-full border border-black/10 px-5 py-2 text-[16px] font-semibold no-underline"
                style={{ color: '#737373' }}
              >
                View all work
              </Link>
            </div>
          </Reveal>
        </section>
      </div>
    </motion.div>
  )
}
