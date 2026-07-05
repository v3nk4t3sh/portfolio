import { motion } from 'framer-motion'
import Reveal from './Reveal.jsx'

const LINKS = [
  {
    label: 'Email',
    href: 'mailto:vomsi03@gmail.com',
    mobileOnly: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m2 7 10 7L22 7" />
      </svg>
    ),
  },
  {
    label: 'Resume',
    href: '/Madia-Venkatesh-Rao_Resume.pdf',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5z" />
        <path d="M14 2v5h5M9 13h6M9 17h4" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/venkatesh-rao-b330a719b/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/404%20error',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V21c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
      </svg>
    ),
  },
]

const ARROW_UP_RIGHT = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
)

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 bg-white py-14 md:py-24">
      <div className="mx-auto grid max-w-6xl items-start gap-14 px-6 md:grid-cols-[1.3fr_1fr] md:gap-24">
        <Reveal>
          <p className="text-lg font-semibold text-[#8D8D8D]">Contact</p>
          <h2 className="mt-4 text-[30px] font-semibold leading-tight tracking-tight text-ink">
            Looking for the right
            <br />
            problem to own.
          </h2>
          <a
            href="mailto:vomsi03@gmail.com"
            className="group mt-9 hidden items-center gap-3 text-lg font-medium text-ink md:inline-flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m2 7 10 7L22 7" />
            </svg>
            vomsi03@gmail.com
            <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
              {ARROW_UP_RIGHT}
            </span>
          </a>
        </Reveal>

        <Reveal delay={0.1}>
          <div>
            {LINKS.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.85, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className={`group items-center justify-between border-b border-black/10 py-5 transition-transform duration-300 ease-out hover:translate-x-1.5 motion-reduce:transition-none ${
                  link.mobileOnly ? 'flex md:hidden' : 'flex'
                }`}
              >
                <span className="flex items-center gap-3 text-[17px] font-semibold text-ink">
                  {link.icon}
                  {link.label}
                </span>
                <span className="text-ink transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  {ARROW_UP_RIGHT}
                </span>
              </motion.a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
