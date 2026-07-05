import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SlideIcon, DOC } from './SlideIcon.jsx'

const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 px-4 pt-4 sm:px-6"
    >
      <nav
        className={`mx-auto flex items-center justify-between rounded-full bg-[#F0F0F0]/90 py-2 pl-6 pr-2 backdrop-blur-md transition-all duration-500 ease-out ${
          scrolled ? 'max-w-2xl shadow-lg shadow-black/5' : 'max-w-6xl'
        }`}
      >
        <Link to="/" className="flex items-center" aria-label="Home">
          <img src="/Logo.png" alt="Venkatesh Rao" className="h-9 w-9 rounded-full" />
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hidden rounded-full px-4 py-2 text-[15px] font-medium text-gray-500 transition-colors hover:bg-black/5 hover:text-ink sm:block"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/Madia-Venkatesh-Rao_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group ml-1 inline-flex items-center rounded-full bg-ink px-6 py-2.5 text-[15px] font-semibold text-white transition-opacity hover:opacity-80"
          >
            <SlideIcon>{DOC}</SlideIcon>
            Resume
          </a>
        </div>
      </nav>
    </motion.header>
  )
}
