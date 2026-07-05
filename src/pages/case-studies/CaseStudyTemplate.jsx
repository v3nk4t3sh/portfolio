import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import usePageTitle from '../../hooks/usePageTitle.js'
import Reveal from '../../components/Reveal.jsx'

const EASE = [0.22, 1, 0.36, 1]
const itemReveal = (i) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.85, delay: i * 0.12, ease: EASE },
})

const MARKER_ICONS = {
  problem: (
    <path d="M12 2 1 21h22L12 2zm0 6v6m0 3v.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  research: (
    <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm10 17-5-5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  decision: (
    <path d="M9 12l2 2 4-5m6 3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round" />
  ),
  journey: (
    <path d="M3 12h18m0 0-6-6m6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  ),
  outcome: (
    <path d="M4 20v-6m6 6V4m6 16v-9m4 9H2" strokeLinecap="round" strokeLinejoin="round" />
  ),
}

function SectionMarker({ icon, label }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          {MARKER_ICONS[icon]}
        </svg>
      </span>
      <span className="text-xs font-semibold uppercase tracking-widest text-muted">
        {label}
      </span>
    </div>
  )
}

export default function CaseStudyTemplate({ data }) {
  usePageTitle(`${data.name} Case Study — Madia Venkatesh Rao`)

  const [firstWord, ...restWords] = data.headline.split(' ')

  return (
    <div className="min-h-screen bg-paper">
      {/* Top bar */}
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link
          to="/"
          className="text-sm font-semibold text-muted transition-colors hover:text-ink"
        >
          ← Back
        </Link>
        <span className="text-xs font-semibold uppercase tracking-widest text-muted">
          Case Study
        </span>
      </div>

      <main className="mx-auto max-w-5xl px-6 pb-24">
        {/* Hero */}
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm font-bold">
              {data.name}
            </span>
            <span className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-muted">
              {data.category}
            </span>
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            <span className="text-ink">{firstWord}</span>{' '}
            <span className="text-gray-400">{restWords.join(' ')}</span>
          </h1>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted">
            {data.summary}
          </p>
        </Reveal>

        {/* Hero image container with phone mockups */}
        <Reveal className="mt-12">
          <div className="flex items-end justify-center gap-6 overflow-hidden rounded-3xl bg-gray-100 px-6 pt-12 md:gap-10 md:px-12">
            {data.heroImages.map((src, i) => (
              <motion.img
                key={src}
                {...itemReveal(i)}
                src={src}
                alt={`${data.name} phone mockup ${i + 1}`}
                className={`w-32 rounded-t-2xl shadow-xl md:w-48 ${i === 1 ? 'md:-translate-y-6' : ''}`}
              />
            ))}
          </div>
        </Reveal>

        {/* Problem */}
        <Reveal className="mt-20 max-w-3xl">
          <SectionMarker icon="problem" label="Problem" />
          <h2 className="text-2xl font-bold md:text-3xl">{data.problem.title}</h2>
          <p className="mt-4 leading-relaxed text-muted">{data.problem.body}</p>
        </Reveal>

        {/* Research */}
        <Reveal className="mt-16 max-w-3xl">
          <SectionMarker icon="research" label="Research" />
          <h2 className="text-2xl font-bold md:text-3xl">{data.research.title}</h2>
          <p className="mt-4 leading-relaxed text-muted">{data.research.body}</p>
        </Reveal>

        {/* The Decision */}
        <Reveal className="mt-16 max-w-3xl">
          <SectionMarker icon="decision" label="The Decision" />
          <h2 className="text-2xl font-bold md:text-3xl">{data.decision.title}</h2>
          <p className="mt-4 leading-relaxed text-muted">{data.decision.body}</p>
        </Reveal>

        {/* User Journey */}
        <Reveal className="mt-16">
          <SectionMarker icon="journey" label="User Journey" />
          <h2 className="text-2xl font-bold md:text-3xl">
            From first tap to done
          </h2>
          <div className="mt-8 flex gap-6 overflow-x-auto pb-4">
            {data.journey.map((step, i) => (
              <motion.figure key={step.caption} {...itemReveal(i)} className="w-44 shrink-0 md:w-52">
                <img
                  src={step.img}
                  alt={step.caption}
                  className="aspect-[9/19] w-full rounded-2xl border border-black/5 bg-gray-100 object-cover shadow-md"
                  loading="lazy"
                />
                <figcaption className="mt-3 text-center text-sm text-muted">
                  {step.caption}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </Reveal>

        {/* Outcome */}
        <Reveal className="mt-16">
          <SectionMarker icon="outcome" label="Outcome" />
          <h2 className="text-2xl font-bold md:text-3xl">What shipped, what moved</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {data.outcome.map((metric, i) => (
              <motion.div
                key={metric.label}
                {...itemReveal(i)}
                className="rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm"
              >
                <p className="text-4xl font-bold md:text-5xl">{metric.value}</p>
                <p className="mt-2 text-sm text-muted">{metric.label}</p>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </main>
    </div>
  )
}
