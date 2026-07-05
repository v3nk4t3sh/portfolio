// Add your logo files to /public/logos/ and list them here.
// With src → renders the image; without src → gray placeholder box.
const LOGOS = [
  { name: 'Zoapi', src: '/logos/client-zoapi.svg' },
  { name: 'Novatech', src: '/logos/client-novatech.png' },
  { name: 'Swio', src: '/logos/client-swio.png' },
  { name: 'Imagitec', src: '/logos/client-imagitec.png' },
  { name: 'Academy', src: '/logos/client-academy.png' },
]

function LogoStrip({ ariaHidden = false }) {
  return (
    <div className="flex shrink-0 items-center gap-24 pr-24" aria-hidden={ariaHidden}>
      {LOGOS.map((logo) =>
        logo.src ? (
          <img
            key={logo.name}
            src={logo.src}
            alt={logo.name}
            className="h-7 w-auto max-w-32 shrink-0 object-contain"
            style={{ filter: 'grayscale(1)', opacity: 0.5 }}
          />
        ) : (
          <div
            key={logo.name}
            className="flex h-12 w-36 shrink-0 items-center justify-center rounded-lg bg-gray-200 text-sm font-semibold text-gray-500"
            style={{ filter: 'grayscale(1)', opacity: 0.55 }}
          >
            {logo.name}
          </div>
        ),
      )}
    </div>
  )
}

import { motion } from 'framer-motion'

export default function LogoMarquee() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1.3, ease: 'easeOut' }}
      className="bg-white pt-[56px] pb-[40px] md:pt-[90px] md:pb-[50px]"
    >
      {/* Gradient mask: only the center logos fully visible, fading toward both ends */}
      <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_35%,black_65%,transparent_100%)]">
        <div className="animate-marquee flex w-max group-hover:[animation-play-state:paused]">
          {/* 4 copies (animation loops at -50%) so short strips still cover wide screens */}
          {[0, 1, 2, 3].map((i) => (
            <LogoStrip key={i} ariaHidden={i > 0} />
          ))}
        </div>
      </div>
    </motion.section>
  )
}
