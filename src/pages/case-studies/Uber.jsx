import CaseStudyTemplate from './CaseStudyTemplate.jsx'

const DATA = {
  name: 'Uber',
  category: 'Mobility · Safety',
  headline: 'Late-night rides that check in on you.',
  summary:
    'A concept feature for safer late-night rides: proactive check-ins that watch for route anomalies and make reaching help a one-tap action, not a buried menu.',
  heroImages: [
    '/case-study/images/uber-phone-1.svg',
    '/case-study/images/uber-phone-2.svg',
    '/case-study/images/uber-phone-3.svg',
  ],
  problem: {
    title: 'Safety tools nobody can find at 2am',
    body: 'Uber\'s safety toolkit existed, but it lived behind a shield icon most riders had never tapped. In the moments that matter — an unexpected detour, a stop that goes on too long — a stressed rider had to navigate three levels of UI to share their trip or reach support.',
  },
  research: {
    title: 'Diary studies from the night shift',
    body: 'A two-week diary study with 18 frequent late-night riders showed that discomfort is gradual, not sudden: riders described a rising unease long before they would consider an SOS button. What they wanted was acknowledgement — a sign the app noticed the same thing they did.',
  },
  decision: {
    title: 'Check in before they have to reach out',
    body: 'The concept adds trip-aware check-ins: when the route deviates or the car is stationary unusually long, a calm full-width prompt asks "Everything okay?" with one-tap paths to share the trip, message the driver, or reach support. Silence escalates gently; a tap dismisses it without friction.',
  },
  journey: [
    { img: '/case-study/images/uber-journey-1.svg', caption: 'Normal ride view' },
    { img: '/case-study/images/uber-journey-2.svg', caption: 'Route deviation detected' },
    { img: '/case-study/images/uber-journey-3.svg', caption: '"Everything okay?" check-in' },
    { img: '/case-study/images/uber-journey-4.svg', caption: 'One-tap trip sharing' },
    { img: '/case-study/images/uber-journey-5.svg', caption: 'Escalation to support' },
  ],
  outcome: [
    { value: '92%', label: 'Riders who found help in under 5s' },
    { value: '+27', label: 'NPS lift among late-night riders' },
    { value: '0', label: 'False-alarm SOS calls in testing' },
  ],
}

export default function Uber() {
  return <CaseStudyTemplate data={DATA} />
}
