import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Reveal from './Reveal.jsx'

const EXPERIENCE = [
  {
    company: 'Zoapi Innovations',
    period: 'Oct 2025 – Present',
    role: 'Creative Designer',
    bullets: [
      "Led the redesign of Zoapi's SaaS platform, mobile application, and website, creating a more cohesive and scalable user experience across customer touchpoints.",
      'Owned end-to-end product design, from research and workflow analysis to high-fidelity UI, prototyping, and developer handoff, delivering 20+ feature enhancements and product improvements.',
      'Simplified complex user journeys and interaction patterns, improving task efficiency by 15–25% while reducing friction across key product workflows.',
      'Partnered closely with engineering, product, and business stakeholders to align user needs with business goals and ensure high-quality implementation.',
      'Established consistent design patterns and scalable UI standards that improved product usability, visual consistency, and overall customer experience.',
    ],
  },
  {
    company: 'MM NOVA TECH',
    period: 'Apr 2025 – Jun 2025',
    role: 'UI/UX & Graphic Designer',
    bullets: [
      'Designed landing pages, websites, email campaigns, and digital marketing assets that strengthened brand consistency and improved user engagement across multiple channels.',
      'Collaborated with stakeholders and teams across India and Canada to translate business objectives into effective digital experiences and visual communication solutions.',
      'Worked closely with developers, marketers, and project stakeholders to deliver high-quality design solutions within fast-paced project timelines.',
      'Applied visual hierarchy, branding, and user-centered design principles to drive a 15–20% increase in engagement while improving consistency across digital touchpoints.',
    ],
  },
  {
    company: 'National Skill Academy',
    shortName: 'National Skill Acad.',
    period: 'Jan 2024 – Mar 2025',
    role: 'UI/UX & Graphic Designer',
    bullets: [
      'Led UX/UI design for 25+ web products and client projects, creating intuitive experiences with a focus on usability, accessibility, and scalable design.',
      'Translated business and marketing goals into clear user journeys, improving engagement, navigation, and overall product effectiveness.',
      'Designed end-to-end experiences from wireframes and user flows to high-fidelity interfaces, while establishing reusable design patterns for consistency and scale.',
      'Partnered with cross-functional teams to deliver projects efficiently, improving delivery speed by 30% and contributing to a 10–20% increase in user engagement across key projects.',
    ],
  },
  {
    company: 'Agency',
    period: 'Mar 2023 – Aug 2023',
    role: 'Graphic Design, Video Editing & Motion Graphics (Intern)',
    bullets: [
      'Created motion graphics, video content, and digital marketing assets for agency and media projects, supporting brand communication and audience engagement.',
      'Collaborated with creative teams to develop visual concepts, promotional materials, and storytelling-driven content across digital and broadcast platforms.',
      'Built foundational skills in visual design, animation, video production, and creative problem-solving that continue to inform product design decisions today.',
    ],
  },
]

const STATS = ['2.8+ Years Experience', 'Shipped Products at Scale', 'Bengaluru · Remote-Open']

function Polaroid({ src, className = '', grayscale = false }) {
  return (
    <div
      className={`rounded-[6px] bg-white p-3 pb-9 shadow-[0_14px_34px_rgba(0,0,0,0.14)] ${className}`}
    >
      <img
        src={src}
        alt=""
        className="aspect-square w-full rounded-[3px] object-cover"
        style={grayscale ? { filter: 'grayscale(1)' } : undefined}
      />
    </div>
  )
}

function PhotoStack() {
  return (
    <div className="group relative z-10 w-64 md:w-72">
      {/* Pop-out photos — tucked behind the main polaroid, fan out on hover */}
      <Polaroid
        src="/about-photo-2.JPG"
        grayscale
        className="absolute left-1/2 top-1/2 z-0 w-40 -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 ease-out group-hover:-translate-y-[142%] group-hover:rotate-3 motion-reduce:transition-none"
      />
      <Polaroid
        src="/about-photo-3.JPG"
        grayscale
        className="absolute left-1/2 top-1/2 z-0 w-40 -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 ease-out group-hover:-translate-x-[148%] group-hover:-rotate-12 motion-reduce:transition-none"
      />
      <Polaroid
        src="/about-photo-4.JPG"
        grayscale
        className="absolute left-1/2 top-1/2 z-0 w-40 -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 ease-out group-hover:translate-x-[48%] group-hover:rotate-12 motion-reduce:transition-none"
      />
      {/* Main photo — straightens to center on hover */}
      <Polaroid
        src="/about-photo.jpg"
        className="relative z-10 -rotate-3 transition-transform duration-500 ease-out group-hover:rotate-0 motion-reduce:transition-none"
      />
    </div>
  )
}

function ExperienceList() {
  const [open, setOpen] = useState(null)

  return (
    <div className="mt-14">
      {EXPERIENCE.map((job, i) => (
        <motion.div
          key={job.company}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.85, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="border-b border-black/10"
        >
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="flex w-full items-center justify-between gap-4 py-5 text-left transition-transform duration-300 ease-out hover:translate-x-1.5 motion-reduce:transition-none"
          >
            <span className="text-[16px] font-semibold text-ink">
              {job.shortName ? (
                <>
                  <span className="md:hidden">{job.shortName}</span>
                  <span className="hidden md:inline">{job.company}</span>
                </>
              ) : (
                job.company
              )}
            </span>
            <span className="flex items-center gap-2 text-[16px] font-medium text-[#8D8D8D]">
              {job.period}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <p className="text-[#8D8D8D]">{job.role}</p>
                <ul className="mt-4 space-y-3 pb-6">
                  {job.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-3 leading-relaxed text-[#8D8D8D]"
                    >
                      <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-gray-400" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 bg-white py-14 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-[320px_1fr] md:gap-20">
        {/* Left: photo stack + stats + featured on */}
        <Reveal>
          <PhotoStack />

          <p className="mt-8 text-[17px] font-semibold text-[#8D8D8D] md:mt-12">About</p>
          <div className="mt-3 hidden space-y-1.5 md:block">
            {STATS.map((stat) => (
              <p key={stat} className="text-[17px] font-semibold text-ink">
                {stat}
              </p>
            ))}
          </div>

        </Reveal>

        {/* Right: heading + bio + experience accordion */}
        <Reveal delay={0.1}>
          <h2 className="text-2xl font-semibold leading-snug tracking-tight text-ink md:text-[28px]">
            Curiosity led me to design.
            <br />
            Problem-solving made me stay.
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-[#8D8D8D]">
            I'm drawn to problems where the design question is tangled up in a
            business question — the messy, cross-functional kind. Over three
            years I've shipped products used by teams at scale, and lately
            I've rebuilt how I work: prototyping in code with Claude and
            Cursor to test ten directions in the time one used to take.
          </p>

          <ExperienceList />
        </Reveal>
      </div>
    </section>
  )
}
