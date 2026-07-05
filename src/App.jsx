import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop.jsx'
import CustomCursor from './components/CustomCursor.jsx'
import Home from './pages/Home.jsx'

const PrimeVideo = lazy(() => import('./pages/case-studies/PrimeVideo.jsx'))
const Airbnb = lazy(() => import('./pages/case-studies/Airbnb.jsx'))
const Notion = lazy(() => import('./pages/case-studies/Notion.jsx'))
const Uber = lazy(() => import('./pages/case-studies/Uber.jsx'))

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center text-muted">
      Loading…
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <CustomCursor />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/case-study/prime-video" element={<PrimeVideo />} />
          <Route path="/case-study/airbnb" element={<Airbnb />} />
          <Route path="/case-study/notion" element={<Notion />} />
          <Route path="/case-study/uber" element={<Uber />} />
        </Routes>
      </Suspense>
    </>
  )
}
