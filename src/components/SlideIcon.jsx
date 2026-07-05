// Icon that slides in from the left on hover of a parent with `group`.
export function SlideIcon({ children }) {
  return (
    <span className="inline-flex w-0 -translate-x-3 items-center overflow-hidden opacity-0 transition-all duration-300 ease-out group-hover:w-6 group-hover:translate-x-0 group-hover:opacity-100">
      {children}
    </span>
  )
}

export const ARROW_RIGHT = (
  <svg
    className="shrink-0"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 12h16m-6-6 6 6-6 6" />
  </svg>
)

export const EYE = (
  <svg
    className="shrink-0"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

export const DOC = (
  <svg
    className="shrink-0"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5z" />
    <path d="M14 2v5h5M9 13h6M9 17h4" />
  </svg>
)
