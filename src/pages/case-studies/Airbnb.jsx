import CaseStudyTemplate from './CaseStudyTemplate.jsx'

const DATA = {
  name: 'Airbnb',
  category: 'Travel · Onboarding',
  headline: 'Hosting without the cold feet.',
  summary:
    'A concept redesign of host onboarding. New hosts abandoned setup when pricing and liability questions appeared before any sense of what hosting would earn them.',
  heroImages: [
    '/case-study/images/airbnb-phone-1.svg',
    '/case-study/images/airbnb-phone-2.svg',
    '/case-study/images/airbnb-phone-3.svg',
  ],
  problem: {
    title: 'Commitment asked before confidence earned',
    body: 'The existing flow front-loaded the scary parts: legal terms, cancellation policies, and pricing decisions arrived before a prospective host had seen a single projection of earnings. Funnel data showed 61% of started listings never published.',
  },
  research: {
    title: 'Interviews with hosts who almost weren\'t',
    body: 'I interviewed 15 recent hosts and 10 people who abandoned setup. The abandoners shared a pattern: they weren\'t rejecting hosting — they were postponing a decision that felt irreversible. Every one of them wanted an earnings estimate and an example listing before committing to anything.',
  },
  decision: {
    title: 'Show the payoff first, defer the paperwork',
    body: 'The redesigned flow opens with an address-only earnings estimate, then builds the listing progressively with sensible defaults that can be edited later. Legal and policy steps move to a final review screen where the host already has something worth publishing.',
  },
  journey: [
    { img: '/case-study/images/airbnb-journey-1.svg', caption: 'Enter your address' },
    { img: '/case-study/images/airbnb-journey-2.svg', caption: 'See earning potential' },
    { img: '/case-study/images/airbnb-journey-3.svg', caption: 'Auto-drafted listing' },
    { img: '/case-study/images/airbnb-journey-4.svg', caption: 'Tweak the details' },
    { img: '/case-study/images/airbnb-journey-5.svg', caption: 'Review & publish' },
  ],
  outcome: [
    { value: '+42%', label: 'Listing completion in prototype tests' },
    { value: '8 min', label: 'Median time to a publishable draft' },
    { value: '2×', label: 'More hosts finishing on first session' },
  ],
}

export default function Airbnb() {
  return <CaseStudyTemplate data={DATA} />
}
