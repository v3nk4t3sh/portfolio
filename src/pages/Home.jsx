import usePageTitle from '../hooks/usePageTitle.js'
import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import LogoMarquee from '../components/LogoMarquee.jsx'
import Work from '../components/Work.jsx'
import About from '../components/About.jsx'
import LifeOutsidePixels from '../components/LifeOutsidePixels.jsx'
import Contact from '../components/Contact.jsx'
import Footer from '../components/Footer.jsx'

export default function Home() {
  usePageTitle('Madia Venkatesh Rao - Product/UX Designer')

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <LogoMarquee />
        <Work />
        <About />
        <LifeOutsidePixels />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
