import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import usePageTitle from '../../hooks/usePageTitle.js'

/*
 * Case study page modeled 1:1 on the muhid.de/case-study/pathao-connect
 * structure: fixed hide-on-scroll nav, word-reveal headline, meta sidebar,
 * context stats, press cards, problem cards, process timeline, insight
 * cards, decision rows, scrollable hi-fi galleries, dark feature section,
 * impact metrics, post-launch funnel + flow comparison, reflections, up-next.
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

function Lead({ dark, rest, className = '' }) {
  return (
    <p
      className={`text-[22px] font-semibold leading-[1.35] tracking-[-0.66px] md:text-[24px] md:leading-[1.4] md:tracking-[-0.72px] ${className}`}
      style={{ color: GRAY }}
    >
      <span style={{ color: INK }}>{dark}</span> {rest}
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
  problem: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" /><path d="M12 8v4m0 4h.01" />
    </svg>
  ),
  decision: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6c56fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3v12a3 3 0 0 0 3 3h9m0 0-3-3m3 3-3 3" />
    </svg>
  ),
  outcome: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5d9c06" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
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
  funnel: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1e1e1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8d8d8d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" /><path d="M12 11v5m0-8h.01" />
    </svg>
  ),
  iterate: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E91E8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-3-6.7M21 3v6h-6" />
    </svg>
  ),
  data: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 20v-6m6 6V4m6 16v-9" />
    </svg>
  ),
}

const Calendar = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4m8-4v4M3 10h18" />
  </svg>
)

/* ---------- content data ---------- */

const FIGMA_PROTO =
  'https://www.figma.com/proto/X475Q8KkJyAZCOv2txcE74/Amazon-Prime-Video---UI---UX?page-id=0%3A1&node-id=90-2267&viewport=-481%2C215%2C0.38&t=LtU916U2bCZg7cG6-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=90%3A678&show-proto-sidebar=1'

const META = [
  { label: 'Role', value: 'Product designer (concept)' },
  { label: 'Team', value: 'Solo — self-initiated' },
  { label: 'Timeline', value: '4 weeks (2024)' },
  { label: 'Platform', value: 'Mobile · Living room' },
  { label: 'Status', value: 'Live prototype ↗', href: FIGMA_PROTO },
]

const CONTEXT_STATS = [
  { label: 'Prime members with Video included', value: '200M+' },
  { label: 'Insiders naming Prime Video worst streaming UI (Variety survey)', value: '15' },
  { label: 'Streaming time spent on episodic series', value: '~60%' },
  { label: 'Taps from Continue Watching to an episode list', value: '6+' },
]

const PRESS = [
  {
    source: 'Variety 2024',
    title: "Hollywood insiders spill on their (least) favorite streaming interfaces",
    body: 'In a survey of industry insiders, Prime Video drew the strongest consensus as the most overwhelming streaming UI — 15 sources named it worst, citing cluttered navigation and Continue Watching dropping viewers straight into playback instead of the episode menu.',
    img: '/case-study/images/amazon-cover.webp',
    href: 'https://variety.com/lists/user-friendly-streaming-services-survey/',
  },
  {
    source: 'Engadget 2024',
    title: 'Prime Video gets a much-needed UI overhaul',
    body: "Amazon's July 2024 redesign brought a content-forward navigation bar, clearer included-with-Prime labeling, and AI recommendations — acknowledging years of criticism. Episode-level navigation, however, remained largely untouched.",
    img: '/case-study/images/amazon-cover-1.jpg',
    href: 'https://www.engadget.com/prime-video-gets-a-much-needed-ui-overhaul-with-a-new-content-bar-and-ai-recommendations-120019397.html',
  },
]

const PROCESS = [
  { week: 'Week 1', color: '#4589F5', phase: 'Discover', items: ['Heuristic audit of the live app (mobile + TV)', '10 viewer interviews on binge habits', 'Press + community complaint analysis', 'Competitive teardown (Netflix, Disney+, Max)'] },
  { week: 'Week 1–2', color: '#E91E8C', phase: 'Define', items: ['HMW framing', 'Two intents mapped: resume vs. browse', 'Success metrics set', 'Scope: episode navigation only'] },
  { week: 'Week 2–3', color: '#6c56fc', phase: 'Design', items: ['Lo-fi wireframes, 3 directions', 'Moderated tests with 18 viewers', 'Two flow iterations', 'Hi-fi screens for mobile + TV'] },
  { week: 'Week 4', color: '#22C55E', phase: 'Deliver', items: ['Prototype usability validation', 'Spoiler-copy stress testing', 'Accessibility pass', 'Case study write-up'] },
  { week: 'Post-study', color: '#EF4444', phase: 'Iterate', items: ['Task-funnel re-analysis of test data', '~48% stall after forced auto-resume identified', 'Resume and Episodes split on the card', 'v2 flow: episode intent respected'] },
]

const INSIGHTS = [
  { bg: '#E5F5FE', icon: ICONS.customer, label: 'Viewer Research', title: 'Resume is a guess, not a command', body: 'Nearly half the time, viewers opened a show wanting something other than "continue exactly here" — a rewatch, a skipped episode, or checking where they were. Auto-resume treated every open as one intent.' },
  { bg: '#F0EEFF', icon: ICONS.support, label: 'Behaviour Research', title: 'Binge momentum dies in menus', body: 'The gap between episodes is where sessions end. Every detour out of the player — back, title page, scroll, season picker — gave viewers a fresh chance to leave. The next episode had to live inside playback.' },
  { bg: '#EFF5E6', icon: ICONS.data, label: 'Content Gap', title: 'The episode list spoils the show', body: 'Thumbnails and descriptions routinely revealed deaths, reunions, and plot turns. Mid-season viewers avoided browsing episodes entirely — the safest move was not looking, which meant not navigating.' },
]

const DECISIONS = [
  {
    problem: { n: 1, title: 'Browsing episodes meant risking spoilers', body: 'Unwatched episodes showed full thumbnails and synopses. Viewers mid-season scrolled past with eyes half-closed — or refused to open the list at all.' },
    decision: { title: 'Spoiler-safe browsing by default', body: 'Unwatched episodes get abstract art and neutral one-liners ("The aftermath unfolds"). A single toggle reveals full details for viewers who want them.' },
    outcome: { title: 'Mid-season browsing stopped feeling risky', body: 'Testers explored episode lists freely for the first time — including seasons they had not reached yet.' },
  },
  {
    problem: { n: 2, title: 'Between episodes, momentum left the app', body: 'Picking anything other than "next" meant leaving the player: back out, find the title page, scroll to episodes, switch season. Four context switches mid-binge.' },
    decision: { title: 'A quick switcher inside the player', body: 'An Episodes button in the player controls opens an overlay strip — every episode, watched-state, season jump — without stopping playback underneath.' },
    outcome: { title: 'Binge flow without leaving playback', body: 'Episode switching became a two-tap action from anywhere in the app, including mid-playback.' },
  },
]

const JOURNEY_1 = [
  ['/case-study/images/amazon-journey-1.avif', '01', 'Continue Watching'],
  ['/case-study/images/amazon-journey-2.avif', '02', 'Spoiler-safe list'],
  ['/case-study/images/amazon-journey-3.avif', '03', 'Episode detail'],
  ['/case-study/images/amazon-journey-4.avif', '04', 'Playback'],
]

const FUNNEL = [
  { step: 'Open show', pct: 100, purple: false },
  { step: 'Auto-resume starts', pct: 94, purple: false },
  { step: 'Back out to title page', pct: 46, purple: true },
  { step: 'Find episode list', pct: 39, purple: false },
  { step: 'Correct episode located', pct: 33, purple: false },
  { step: 'Episode playing', pct: 30, purple: false },
]

const FLOW_V1 = [
  { step: 'Open app', note: null },
  { step: 'Tap Continue Watching card', note: null },
  { step: 'Auto-resume starts playing', note: { text: '~48% stall', color: '#6c56fc' } },
  { step: 'Back out of the player', note: { text: '~48% stall', color: '#6c56fc' } },
  { step: 'Find the title page', note: null },
  { step: 'Scroll past extras to episodes', note: null },
  { step: 'Switch season', note: null },
  { step: 'Select episode', note: null },
  { step: 'Playing', note: null },
]

const FLOW_V2 = [
  { step: 'Open app', note: null },
  { step: 'Continue Watching card', note: null },
  { step: 'Tap Episodes (or Resume)', note: { text: '← new split affordance', color: '#5d9c06' } },
  { step: 'Select episode', note: null },
  { step: 'Playing', note: null },
]

const REFLECTIONS = [
  { num: '01', title: 'Resume is a guess, not a command', body: 'Defaulting to resume is good design; forcing it is not. The moment we split "Resume" and "Episodes" into equal citizens on the same card, both intents got faster — and nobody lost the one-tap resume they loved.' },
  { num: '02', title: 'Spoiler safety is table stakes for browsing', body: "Viewers won't explore an episode list that might spoil the story they're invested in. Every browsing improvement was worthless until unwatched episodes stopped leaking plot — safety unlocked navigation, not the other way around." },
  { num: '03', title: 'Visible beats elegant', body: 'An early version hid the quick switcher behind a swipe gesture. It demoed beautifully and failed silently — testers never found it. The boring, always-visible Episodes button won every measure that mattered.' },
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

/* ---------- page ---------- */

export default function PrimeVideo() {
  usePageTitle('Prime Video Episode Feature — Case Study — Madia Venkatesh Rao')

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
              Watching card that offers browsing — not just forced resume.
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

      <div className="mx-auto max-w-[976px] px-6 pt-10 lg:pt-20">
        {/* About the product */}
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
                  compete on every screen, and the thing viewers do most — watch the next episode
                  of a series — is buried beneath all of it.
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

        {/* The Context */}
        <section className="pb-[125px]">
          <Reveal>
            <Label>The Context</Label>
            <Lead
              dark="The next episode is streaming's most repeated action."
              rest="And on Prime Video, it was also one of the hardest to reach on purpose."
              className="mb-[50px]"
            />
          </Reveal>
          <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-32">
            <Reveal delay={0.05}>
              <div>
                {CONTEXT_STATS.map(({ label, value }, i) => (
                  <div
                    key={label}
                    className="flex items-center justify-between"
                    style={{ padding: i === 0 ? '0 0 20px 0' : '20px 0', borderBottom: i < CONTEXT_STATS.length - 1 ? '1px solid #e5e5e5' : 'none' }}
                  >
                    <span className="max-w-[55%] text-[16px] font-medium leading-[1.4] tracking-[-0.3px]" style={{ color: BODY }}>{label}</span>
                    <span className="text-[20px] font-semibold leading-[1.1] tracking-[-0.96px]" style={{ color: INK }}>{value}</span>
                  </div>
                ))}
                <p className="mt-4 text-[12px] font-normal tracking-[-0.24px]" style={{ color: GRAY }}>
                  Source: Variety streaming-interface survey 2024, Amazon disclosures, industry estimates
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mb-5 text-[16px] font-medium leading-[1.6] tracking-[-0.3px]" style={{ color: BODY }}>
                Most streaming hours go to series, not films — which makes episode navigation the
                highest-frequency journey in the app. On Prime Video, tapping a show in Continue
                Watching skips the menu entirely and throws the viewer into playback, so reaching
                a specific episode means backing out and hunting through the title page.
              </p>
              <p className="text-[16px] font-medium leading-[1.6] tracking-[-0.3px]" style={{ color: BODY }}>
                The stakes compound at the end of every episode. That ten-second gap is where a
                session either continues or dies — and every extra menu, season picker, and
                spoiler-laden list gives the viewer another reason to put the remote down.
              </p>
            </Reveal>
          </div>
        </section>

        {/* In the press */}
        <section className="pb-[125px]">
          <Reveal>
            <Label>In the press</Label>
          </Reveal>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {PRESS.map((item, i) => (
              <Reveal key={item.source} delay={0.05 + i * 0.1} className="h-full">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="Read"
                  className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-[#E9E9E9] no-underline transition-colors duration-300 hover:bg-[#f5f5f5]"
                >
                  <div className="flex flex-1 flex-col px-5 pb-6 pt-5 md:px-7 md:pt-7">
                    <span className="mb-5 inline-block self-start rounded-full border border-[#e0e0e0] bg-white px-3.5 py-1 text-[13px] font-medium" style={{ color: GRAY }}>
                      {item.source}
                    </span>
                    <h3 className="mb-4 text-[20px] font-semibold leading-[1.35] tracking-[-0.6px]" style={{ color: INK }}>{item.title}</h3>
                    <p className="mb-6 flex-1 text-[16px] font-medium leading-[1.65] tracking-[-0.3px]" style={{ color: GRAY }}>{item.body}</p>
                    <span className="text-[14px] font-medium tracking-[-0.28px]" style={{ color: INK }}>Read article ↗</span>
                  </div>
                  {item.img && (
                    <img src={item.img} alt={item.source} className="mt-5 block aspect-[3/2] w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0" />
                  )}
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        {/* The Problem */}
        <section className="pb-[125px]">
          <Reveal>
            <Label>The Problem</Label>
            <Lead
              dark="Viewers and the platform both lose when the binge breaks."
              rest="How do you make finding an episode as effortless as pressing play?"
              className="mb-8"
            />
          </Reveal>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:items-stretch">
            {[
              {
                bg: '#e8f4fd', icon: ICONS.customer, who: 'Viewers',
                title: 'Continue Watching skips the menu',
                body: 'Tapping a show forced playback from the last position. Wanting anything else — a different episode, a rewatch, checking where you were — meant backing out and navigating a title page crowded with rentals, extras, and X-Ray.',
                quote: '"I just want to pick the episode. Why am I fighting the app for that?"',
                by: '- Viewer interview, P4',
              },
              {
                bg: '#eeecfb', icon: ICONS.support, who: 'The platform',
                title: 'Every broken binge is churn risk',
                body: 'Sessions end in the gaps between episodes. A viewer who cannot find episode four watches nothing — and industry surveys kept naming this interface the most overwhelming in streaming, dragging the whole Prime bundle down with it.',
                quote: '"If they can\'t find the next episode, they don\'t watch a different one. They leave."',
                by: '- Streaming PM interview (concept)',
              },
            ].map((card) => (
              <Reveal key={card.who} delay={0.05} className="h-full">
                <div className="flex h-full flex-col rounded-[20px] p-5 md:p-7" style={{ background: card.bg }}>
                  <div className="flex-1">
                    <IconPill icon={card.icon}>{card.who}</IconPill>
                    <h3 className="mb-4 text-[20px] font-semibold leading-[1.25] tracking-[-0.6px]" style={{ color: INK }}>{card.title}</h3>
                    <p className="text-[16px] font-medium leading-[1.65] tracking-[-0.3px]" style={{ color: GRAY }}>{card.body}</p>
                  </div>
                  <div className="mt-6 rounded-[14px] bg-white px-5 py-[18px]">
                    <p className="mb-2.5 text-[15px] font-medium leading-[1.55] tracking-[-0.3px]" style={{ color: INK }}>{card.quote}</p>
                    <p className="text-[13px] font-normal tracking-[-0.26px]" style={{ color: GRAY }}>{card.by}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Design Process */}
        <section className="pb-[125px]">
          <Reveal>
            <Label>Design Process</Label>
          </Reveal>
          <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-3">
            {PROCESS.slice(0, 3).map((p, i) => (
              <Reveal key={p.phase} delay={0.05 + i * 0.1} className="h-full">
                <ProcessCard {...p} />
              </Reveal>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {PROCESS.slice(3).map((p, i) => (
              <Reveal key={p.phase} delay={0.2 + i * 0.1} className="h-full">
                <ProcessCard {...p} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* Research Insights */}
        <section className="pb-[125px]">
          <Reveal>
            <Label>Research Insights</Label>
          </Reveal>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:items-stretch">
            {INSIGHTS.map((card, i) => (
              <Reveal key={card.label} delay={0.05 + i * 0.1} className="h-full">
                <div className="flex h-full flex-col rounded-[20px] p-5 md:p-8" style={{ background: card.bg }}>
                  <IconPill icon={card.icon}>{card.label}</IconPill>
                  <h3 className="mb-4 text-[20px] font-semibold leading-[1.25] tracking-[-0.6px]" style={{ color: INK }}>{card.title}</h3>
                  <p className="text-[16px] font-medium leading-[1.65] tracking-[-0.3px]" style={{ color: BODY }}>{card.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Key Design Decisions */}
        <section className="pb-[125px]">
          <Reveal>
            <Label>Key Design Decisions</Label>
          </Reveal>
          {DECISIONS.map((row, r) => (
            <div key={r} className={`grid grid-cols-1 gap-[4px] md:grid-cols-3 ${r < DECISIONS.length - 1 ? 'mb-[30px]' : ''}`}>
              {[
                { icon: ICONS.problem, label: `Problem ${row.problem.n}`, data: row.problem, bg: '#f9f9f9', radius: 'rounded-t-[20px] md:rounded-none md:rounded-l-[20px]' },
                { icon: ICONS.decision, label: 'The decision', data: row.decision, bg: '#f9f9f9', radius: 'rounded-none' },
                { icon: ICONS.outcome, label: 'Outcome', data: row.outcome, bg: '#EFF5E6', radius: 'rounded-b-[20px] md:rounded-none md:rounded-r-[20px]' },
              ].map((cell, c) => (
                <Reveal key={c} delay={0.05 + r * 0.1 + c * 0.08} className="h-full">
                  <div className={`flex h-full flex-col p-5 md:p-7 ${cell.radius}`} style={{ background: cell.bg }}>
                    <IconPill icon={cell.icon}>{cell.label}</IconPill>
                    <h3 className="mb-3.5 text-[20px] font-semibold leading-[1.3] tracking-[-0.6px]" style={{ color: INK }}>{cell.data.title}</h3>
                    <p className="text-[16px] font-medium leading-[1.6] tracking-[-0.32px]" style={{ color: GRAY }}>{cell.data.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          ))}
        </section>

        {/* Hi-Fi Design */}
        <section className="pb-[125px]">
          <Reveal>
            <Label>Hi-Fi Design</Label>
            <Lead
              dark="The final flow:"
              rest="the viewer chooses Resume or Episodes from the Continue Watching card, scans a spoiler-safe list with clear watched-states, and lands exactly where they meant to — two decisions, zero detours."
              className="mb-8 max-w-[720px]"
            />
          </Reveal>
          <Reveal delay={0.1} distance={52}>
            <Gallery items={JOURNEY_1} caption="The split card is the trust moment: resume stays one tap, browsing becomes one too" />
          </Reveal>
        </section>
      </div>

      {/* Refund clarity — full-bleed dark section */}
      <section
        className="mb-[125px] pb-[60px] pt-[60px] md:pb-[96px] md:pt-[96px]"
        style={{ background: 'linear-gradient(159.99deg, #0d1a25 0%, #12293a 38%, #0e2231 68%, #081520 100%)' }}
      >
        <div className="mx-auto max-w-[976px] px-6">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
            <Reveal>
              <p className="mb-4 text-[16px] font-semibold tracking-[-0.32px]" style={{ color: '#00A8E1' }}>Spoiler-Safe Browsing</p>
              <h2 className="mb-5 text-[32px] font-semibold leading-[1.2] tracking-[-1px] text-white">
                Episodes you can browse without fear
              </h2>
              <p className="mb-9 text-[16px] font-medium leading-[1.6] tracking-[-0.32px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Every unwatched episode hides its secrets by default: abstract artwork, neutral
                descriptions, no runtime cliffhangers. Browsing becomes safe — which is what
                finally makes it possible.
              </p>
              <div className="flex flex-col gap-4">
                {['Abstract art on unwatched episode thumbnails', 'Neutral one-line descriptions until watched', 'Clear watched / in-progress / new states', 'One toggle reveals full details on demand'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0" aria-hidden="true">
                      <circle cx="10" cy="10" r="10" fill="rgba(255,255,255,0.15)" />
                      <path d="M6 10.5L8.5 13L14 7.5" stroke="#00A8E1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[16px] font-medium tracking-[-0.32px]" style={{ color: 'rgba(255,255,255,0.8)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal className="hidden md:block" distance={52}>
              <img src="/case-study/images/amazon-phone-3.avif" alt="Spoiler-safe episode list" loading="lazy" className="mx-auto block w-[70%]" style={PHONE_SHADOW} />
            </Reveal>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[976px] px-6">
        {/* Impact */}
        <section className="pb-[125px]">
          <Reveal>
            <Label>Impact</Label>
          </Reveal>
          <div className="mb-[30px] grid grid-cols-1 gap-[4px] md:grid-cols-2 md:items-stretch">
            <Reveal delay={0.05} className="h-full">
              <div className="flex h-full flex-col rounded-t-[20px] p-5 md:rounded-t-none md:rounded-l-[20px] md:p-8" style={{ background: '#EFF5E6' }}>
                <IconPill icon={ICONS.outcome}>Fewer Steps</IconPill>
                <p className="mb-2 text-[32px] font-semibold leading-none tracking-[-1.5px] md:text-[40px]" style={{ color: INK }}>-44%</p>
                <p className="mb-5 text-[16px] font-medium tracking-[-0.32px]" style={{ color: INK }}>steps to reach a specific episode</p>
                <p className="text-[16px] font-medium leading-[1.6] tracking-[-0.32px]" style={{ color: GRAY }}>
                  Nine steps became five. Resume kept its one-tap speed while browsing gained an
                  equal, always-visible path — no viewer intent was sacrificed for the other.
                </p>
              </div>
            </Reveal>
            <div className="flex flex-col gap-[4px]">
              <Reveal delay={0.15} className="flex-1">
                <div className="h-full p-5 md:rounded-tr-[20px] md:p-8" style={{ background: '#f9f9f9' }}>
                  <p className="mb-2 text-[32px] font-semibold leading-none tracking-[-1.5px] md:text-[40px]" style={{ color: INK }}>+38%</p>
                  <p className="mb-2 text-[16px] font-medium tracking-[-0.32px]" style={{ color: INK }}>find-the-episode task completion</p>
                  <p className="text-[16px] font-medium leading-[1.6] tracking-[-0.32px]" style={{ color: GRAY }}>Across 18 moderated sessions vs. the current app.</p>
                </div>
              </Reveal>
              <Reveal delay={0.25} className="flex-1">
                <div className="h-full rounded-b-[20px] p-5 md:rounded-b-none md:rounded-br-[20px] md:p-8" style={{ background: '#f9f9f9' }}>
                  <p className="mb-2 text-[32px] font-semibold leading-none tracking-[-1.5px] md:text-[40px]" style={{ color: INK }}>4.7/5</p>
                  <p className="mb-2 text-[16px] font-medium tracking-[-0.32px]" style={{ color: INK }}>post-task satisfaction</p>
                  <p className="text-[16px] font-medium leading-[1.6] tracking-[-0.32px]" style={{ color: GRAY }}>"It finally lets me look at episodes without getting spoiled."</p>
                </div>
              </Reveal>
            </div>
          </div>
          <Reveal delay={0.1}>
            <div className="rounded-[20px] px-5 py-5 text-center md:px-12 md:py-14" style={{ background: '#f9f9f9' }}>
              <p className="mx-auto max-w-[760px] text-[24px] font-semibold leading-[35px] tracking-[-0.72px] md:text-[32px] md:leading-[40px] md:tracking-[-0.96px]" style={{ color: GRAY }}>
                <span style={{ color: INK }}>The concept changed what an episode is.</span>{' '}
                From a row buried under a title page to a layer that travels with the viewer —
                on the card, in the list, and inside the player itself.
              </p>
            </div>
          </Reveal>
        </section>

        {/* Post-study card */}
        <Reveal delay={0.05}>
          <div className="relative mb-[125px] overflow-hidden rounded-[20px] px-10 py-12 text-center" style={{ background: '#F0EEFE' }}>
            <svg aria-hidden="true" width="457" height="488" viewBox="0 0 457 488" fill="none" className="pointer-events-none absolute right-0 top-0 h-[150%] w-auto select-none">
              <path d="M85.3256 272.328L15.654 303.03C5.20327 307.635 1.30623 317.672 5.9114 328.123L67.3137 467.466C71.9189 477.917 81.9561 481.814 92.4069 477.209L162.078 446.507C172.529 441.902 176.426 431.865 171.821 421.414L110.419 282.071C105.814 271.62 95.7763 267.723 85.3256 272.328ZM333.311 79.8523L263.639 110.553C253.189 115.159 249.291 125.196 253.897 135.647L346 344.661C350.605 355.112 360.643 359.009 371.093 354.404L440.765 323.703C451.216 319.098 455.113 309.06 450.507 298.61L358.404 89.5949C353.799 79.1442 343.762 75.2471 333.311 79.8523ZM132.565 1.9114L62.8938 32.6125C52.443 37.2177 48.546 47.255 53.1511 57.7057L206.657 406.064C211.262 416.514 221.299 420.412 231.75 415.806L301.422 385.105C311.872 380.5 315.769 370.463 311.164 360.012L157.659 11.654C153.053 1.20327 143.016 -2.69377 132.565 1.9114Z" fill="#E9E6FE" />
            </svg>
            <div className="relative z-[1]">
              <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-white py-1.5 pl-2.5 pr-4">
                {ICONS.iterate}
                <span className="text-[14px] font-medium tracking-[-0.28px]" style={{ color: INK }}>Post-study · v2</span>
              </span>
              <h2 className="mb-5 text-[24px] font-semibold leading-[1.33] tracking-[-0.72px]" style={{ color: INK }}>
                We tested. Then we watched the recordings.
              </h2>
              <p className="mx-auto max-w-[620px] text-[16px] font-medium leading-[1.65] tracking-[-0.32px]" style={{ color: GRAY }}>
                The switcher and spoiler-safe list scored well, but the baseline task funnel told
                a sharper story. Asked to play a specific episode in the current app, nearly half
                of participants stalled at the same moment: the forced auto-resume. A behaviour
                designed for convenience had become a wall between intent and episode.
              </p>
            </div>
          </div>
        </Reveal>

        {/* What the data showed */}
        <section className="pb-[125px]">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-[70px]">
            <Reveal delay={0.05}>
              <Label>What the data showed</Label>
              <h2 className="mb-5 text-[24px] font-semibold leading-[1.33] tracking-[-0.72px]" style={{ color: INK }}>
                ~48% stalled after the forced auto-resume
              </h2>
              <p className="mb-4 text-[16px] font-medium leading-[1.65] tracking-[-0.32px]" style={{ color: GRAY }}>
                Auto-resume was designed with good intent: get returning viewers back into the
                story in one tap. In practice it hijacked every open — including the half of
                opens where the viewer wanted a different episode, a rewatch, or just to look.
              </p>
              <p className="text-[16px] font-medium leading-[1.65] tracking-[-0.32px]" style={{ color: GRAY }}>
                Viewers who knew exactly which episode they wanted were being dropped into the
                wrong one first, then left to find their own way out through a title page built
                for selling, not navigating.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="pt-9">
                <div className="mb-3 rounded-[20px] px-6 pb-7 pt-6" style={{ background: '#f9f9f9' }}>
                  <div className="mb-5">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white py-1.5 pl-2.5 pr-3.5">
                      {ICONS.funnel}
                      <span className="text-[14px] font-medium tracking-[-0.28px]" style={{ color: INK }}>Baseline task funnel</span>
                    </span>
                  </div>
                  <div className="flex flex-col gap-4">
                    {FUNNEL.map(({ step, pct, purple }) => (
                      <div key={step}>
                        <div className="mb-1.5 flex justify-between">
                          <span className="text-[14px] font-medium tracking-[-0.28px]" style={{ color: INK }}>{step}</span>
                          <span className="text-[14px] font-semibold tracking-[-0.28px]" style={{ color: INK }}>{pct}%</span>
                        </div>
                        <div className="h-[5px] rounded-[3px] bg-[#e5e5e5]">
                          <div className="h-full rounded-[3px]" style={{ width: `${pct}%`, background: purple ? '#6c56fc' : INK }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-center text-[16px] font-medium tracking-[-0.32px]" style={{ color: GRAY }}>
                  Task funnel showing <span className="font-semibold" style={{ color: '#6c56fc' }}>~48% stall</span> after the forced auto-resume
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Flow Analysis */}
        <section className="pb-[125px]">
          <Reveal>
            <Label>Flow Analysis</Label>
            <h2 className="mb-2 text-[24px] font-semibold leading-[1.33] tracking-[-0.72px]" style={{ color: INK }}>
              Four detour steps removed
            </h2>
            <p className="mb-7 text-[16px] font-medium leading-normal tracking-[-0.32px]" style={{ color: GRAY }}>
              The fix was structural: split Resume and Episodes on the card. Stalls fell, completions rose.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 md:gap-2">
            {[
              { title: 'Current app flow', steps: FLOW_V1, badgeIcon: ICONS.info, badge: '9 steps · resume was forced' },
              { title: 'Concept flow', steps: FLOW_V2, badgeIcon: ICONS.outcome, badge: '5 steps · resume and browse split' },
            ].map((col, i) => (
              <Reveal key={col.title} delay={0.05 + i * 0.1} className="h-full">
                <div className="flex h-full flex-col rounded-[20px] p-5 md:p-7" style={{ background: '#f9f9f9' }}>
                  <p className="mb-5 text-[20px] font-semibold tracking-[-0.5px]" style={{ color: INK }}>{col.title}</p>
                  <div className="flex flex-1 flex-col gap-3">
                    {col.steps.map(({ step, note }, n) => (
                      <div key={step} className="flex items-center gap-2.5">
                        <span className="w-4 shrink-0 text-right text-[14px] font-medium" style={{ color: GRAY }}>{n + 1}</span>
                        <span className="text-[16px] font-medium tracking-[-0.32px]" style={{ color: INK }}>{step}</span>
                        {note && (
                          <span className="text-[13px] font-semibold tracking-[-0.26px]" style={{ color: note.color }}>{note.text}</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto pt-6">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e5e5e5] bg-white px-3 py-1.5">
                      {col.badgeIcon}
                      <span className="text-[13px] font-semibold tracking-[-0.26px]" style={{ color: INK }}>{col.badge}</span>
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-[90px] grid grid-cols-1 items-stretch gap-3 md:grid-cols-3 md:gap-[4px]">
            {[
              { icon: ICONS.iterate, label: 'Iteration Decision', title: 'Auto-resume → optional. Episodes → visible.', body: 'The forced resume was the #1 stall point. Viewers who knew exactly which episode they wanted were dropped into the wrong one and left to find their way out.', bg: '#f9f9f9', radius: 'rounded-[20px] md:rounded-none md:rounded-l-[20px]' },
              { icon: ICONS.decision, label: 'The change', title: 'Split the entry point', body: 'Continue Watching cards now carry Resume and Episodes side by side. Resume keeps its one-tap speed; browsing no longer requires escaping playback first.', bg: '#f9f9f9', radius: 'rounded-[20px] md:rounded-none' },
              { icon: ICONS.outcome, label: 'Outcome', title: 'Eliminated the top stall point in the funnel', body: 'Four fewer detour steps. Faster time-to-episode for both intents. Auto-resume preserved for the viewers who want exactly that.', bg: '#EFF5E6', radius: 'rounded-[20px] md:rounded-none md:rounded-r-[20px]' },
            ].map((cell, i) => (
              <Reveal key={cell.label} delay={0.05 + i * 0.08} className="h-full">
                <div className={`flex h-full flex-col p-5 md:p-7 ${cell.radius}`} style={{ background: cell.bg }}>
                  <IconPill icon={cell.icon}>{cell.label}</IconPill>
                  <h3 className="mb-3.5 text-[20px] font-semibold leading-[1.3] tracking-[-0.6px]" style={{ color: INK }}>{cell.title}</h3>
                  <p className="text-[16px] font-medium leading-[1.6] tracking-[-0.32px]" style={{ color: GRAY }}>{cell.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Reflections */}
        <section className="pb-[125px]">
          <Reveal>
            <Label>Reflections</Label>
          </Reveal>
          <div className="flex flex-col gap-[52px]">
            {REFLECTIONS.map(({ num, title, body }, i) => (
              <Reveal key={num} delay={i * 0.08}>
                <div className="grid grid-cols-[72px_1fr] items-start gap-7">
                  <span className="text-[40px] font-semibold leading-[1.1] tracking-[-1.5px]" style={{ color: '#cbcbcb' }}>{num}</span>
                  <div>
                    <h3 className="mb-2.5 text-[20px] font-semibold leading-[1.3] tracking-[-0.6px]" style={{ color: INK }}>{title}</h3>
                    <p className="text-[16px] font-medium leading-normal tracking-[-0.32px]" style={{ color: GRAY }}>{body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Up next */}
        <section className="pb-[125px]">
          <Reveal>
            <Label>Up next</Label>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="mb-10 rounded-[20px] border border-[#f0f0f0] px-5 py-5 md:px-8 md:py-7" style={{ background: '#f9f9f9' }}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-6">
                <div className="mb-3 md:mb-0">
                  <p className="mb-1.5 text-[16px] font-semibold tracking-[-0.32px]" style={{ color: GRAY }}>Next case study</p>
                  <h3 className="text-[24px] font-semibold leading-[1.33] tracking-[-0.72px]" style={{ color: INK }}>Airbnb Host Onboarding</h3>
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

function ProcessCard({ week, color, phase, items }) {
  return (
    <div className="h-full rounded-[20px] px-5 py-5 md:px-7 md:pb-8 md:pt-7" style={{ background: '#f9f9f9' }}>
      <div className="mb-5 flex items-center gap-2">
        <Calendar color={color} />
        <span className="text-[14px] font-medium tracking-[-0.28px]" style={{ color: BODY }}>{week}</span>
      </div>
      <p className="mb-5 text-[20px] font-semibold leading-[1.2] tracking-[-0.6px]" style={{ color: INK }}>{phase}</p>
      <ul className="flex list-none flex-col gap-[11px] p-0">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full" style={{ background: GRAY }} />
            <span className="text-[16px] font-medium leading-normal tracking-[-0.32px]" style={{ color: BODY }}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
