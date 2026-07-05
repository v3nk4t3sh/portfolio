import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'

/*
 * Dot cursor. Uses mix-blend-difference, so over the white site it reads
 * as a black dot and inverts whatever it passes over (text turns white).
 * Grows over interactive elements. Over elements carrying a data-cursor
 * attribute ("View" / "Locked" / "Scroll" / "Play") a small black pill
 * with the label pops out beside the dot.
 * Only renders for fine pointers — untouched on touch devices.
 */

const DOT_SIZES = { default: 14, link: 36, label: 12 }

const INTERACTIVE = 'a, button, [role="button"], input, select, textarea'

export default function CustomCursor() {
  const [fine, setFine] = useState(false)
  const [mode, setMode] = useState({ type: 'default', label: null })
  const [hidden, setHidden] = useState(true)
  const modeRef = useRef(mode)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const spring = { stiffness: 650, damping: 45, mass: 0.5 }
  const sx = useSpring(x, spring)
  const sy = useSpring(y, spring)

  useEffect(() => {
    setFine(window.matchMedia('(pointer: fine)').matches)
  }, [])

  useEffect(() => {
    if (!fine) return

    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setHidden(false)

      const t = e.target instanceof Element ? e.target : null
      const labelEl = t?.closest('[data-cursor]')
      let next
      if (labelEl) {
        next = { type: 'label', label: labelEl.getAttribute('data-cursor') }
      } else if (t?.closest(INTERACTIVE)) {
        next = { type: 'link', label: null }
      } else {
        next = { type: 'default', label: null }
      }
      if (next.type !== modeRef.current.type || next.label !== modeRef.current.label) {
        modeRef.current = next
        setMode(next)
      }
    }
    const onLeave = () => setHidden(true)
    const onEnter = () => setHidden(false)

    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
    }
  }, [fine, x, y])

  if (!fine) return null

  const dotSize = DOT_SIZES[mode.type]

  return (
    <motion.div
      aria-hidden="true"
      data-cursor-dot
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{ x: sx, y: sy }}
      animate={{ opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Dot — solid black */}
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-ink"
        animate={{ width: dotSize, height: dotSize }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      />
      {/* Label pill — pops out up-left of the dot */}
      <AnimatePresence>
        {mode.type === 'label' && (
          <motion.div
            key={mode.label}
            initial={{ opacity: 0, scale: 0.6, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-4 right-3 origin-bottom-right whitespace-nowrap rounded-full bg-ink px-4 py-2 text-[12px] font-semibold leading-none text-white shadow-lg shadow-black/20"
          >
            {mode.label}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
