import { Link } from 'react-router-dom'
import Reveal from './Reveal.jsx'
import { CASE_STUDIES } from '../data/caseStudies.js'

function CardBody({ cs }) {
  return (
    <>
      {/* Full-bleed cover image */}
      <div className="relative aspect-[500/430] overflow-hidden rounded-3xl bg-[#F4F4F4]">
        <img
          src={cs.cover}
          alt={`${cs.title} case study cover`}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        />
        {/* Corner button: arrow for viewable, padlock for locked */}
        <span className="absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink shadow-sm transition-transform duration-300 group-hover:scale-110">
          {cs.locked ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          )}
        </span>
      </div>

      <h3 className="mt-6 text-[18px] font-semibold">{cs.title}</h3>
      <p className="mt-2 max-w-md leading-relaxed text-[#8D8D8D]">
        {cs.description}
      </p>
    </>
  )
}

export default function Work() {
  return (
    <section id="work" className="mx-auto max-w-[1072px] scroll-mt-24 px-6 py-14 md:py-20">
      <Reveal>
        <h2 className="text-lg font-semibold text-[#8D8D8D]">Case studies</h2>
      </Reveal>

      <div className="mt-8 grid gap-x-6 gap-y-10 md:grid-cols-[repeat(2,minmax(0,500px))]">
        {CASE_STUDIES.map((cs, i) => (
          <Reveal key={cs.slug} delay={i * 0.08}>
            {cs.locked ? (
              <div
                className="group block"
                data-cursor="Locked"
                aria-label={`${cs.title} case study — locked`}
              >
                <CardBody cs={cs} />
              </div>
            ) : (
              <Link
                to={`/case-study/${cs.slug}`}
                className="group block"
                data-cursor="View"
              >
                <CardBody cs={cs} />
              </Link>
            )}
          </Reveal>
        ))}
      </div>
    </section>
  )
}
