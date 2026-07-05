import CaseStudyTemplate from './CaseStudyTemplate.jsx'

const DATA = {
  name: 'Notion',
  category: 'SaaS · Web',
  headline: 'Templates people can actually find.',
  summary:
    'A concept redesign of template discovery for first-time Notion users. The blank page is powerful for experts and paralyzing for everyone else.',
  heroImages: [
    '/case-study/images/notion-phone-1.svg',
    '/case-study/images/notion-phone-2.svg',
    '/case-study/images/notion-phone-3.svg',
  ],
  problem: {
    title: 'The blank-page cliff',
    body: 'New users landing on an empty workspace churned at nearly twice the rate of users who started from a template. Yet the template gallery sat three clicks deep, organized by Notion\'s internal categories rather than by what a new user was trying to do.',
  },
  research: {
    title: 'Card sorts and first-session replays',
    body: 'An open card sort with 30 participants showed people group templates by job-to-be-done ("plan a trip", "run a team") rather than by product category. Session replays confirmed that users who found a relevant template in their first five minutes were dramatically more likely to return the next week.',
  },
  decision: {
    title: 'Ask one question, then curate',
    body: 'The redesign replaces the empty state with a single question — "What are you here to do?" — and returns a curated shelf of three templates per intent, each with a live preview. The full gallery remains one click away for browsers, but nobody starts at zero.',
  },
  journey: [
    { img: '/case-study/images/notion-journey-1.svg', caption: 'One intent question' },
    { img: '/case-study/images/notion-journey-2.svg', caption: 'Curated shelf of three' },
    { img: '/case-study/images/notion-journey-3.svg', caption: 'Live template preview' },
    { img: '/case-study/images/notion-journey-4.svg', caption: 'Start with content in place' },
  ],
  outcome: [
    { value: '+38%', label: 'First-session template adoption' },
    { value: '-24%', label: 'Week-one churn in test cohort' },
    { value: '3 min', label: 'Median time to first real content' },
  ],
}

export default function Notion() {
  return <CaseStudyTemplate data={DATA} />
}
