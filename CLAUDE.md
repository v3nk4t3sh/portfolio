# Venkatesh Rao — Portfolio Website

Personal portfolio of **Madia Venkatesh Rao** (goes by Venkatesh), Product/Creative Designer at Zoapi Innovations, Bengaluru. 2.8+ years of experience. Contact: vomsi03@gmail.com · LinkedIn: https://www.linkedin.com/in/venkatesh-rao-b330a719b/

Modeled on modern designer portfolios (primary reference: muhid.de). Fully static SPA — no backend, no database, no external API calls at runtime.

## Stack & commands

- Vite 6 + React 18 (JavaScript, no TypeScript) · Tailwind CSS **v4** (via `@tailwindcss/vite` plugin — no tailwind.config file, tokens live in `@theme` in `src/index.css`) · Framer Motion 11 · React Router 6 (BrowserRouter)
- `npm run dev` → localhost:5173 · `npm run build` → `dist/` (must always pass; case studies code-split into own chunks)
- Deployed on **Vercel** from GitHub repo `v3nk4t3sh/portfolio` (branch `main`, auto-deploy on push). `vercel.json` has the SPA rewrite. Machine may have multiple GitHub accounts — pushes must authenticate as `v3nk4t3sh`, NOT `venkatesh-zoapi` (work account).
- Tailwind v4 notes: `rotate-6` etc. compile to the native CSS `rotate`/`translate` properties (not `transform`) — they compose with Framer Motion's transform without conflict. Custom keyframes (`spin-vinyl`, `marquee`, `eq`) are defined in `@theme` in index.css.

## Design system

- **Colors**: background `#FFFFFF` (`--color-paper`), ink `#111111` (`--color-ink`), secondary text `#8D8D8D` (used everywhere for gray text), body gray on case pages `#6e6e6e`, card gray `#F4F4F4`, navbar/pill gray `#F0F0F0`. Accent greens/purples on case-study cards: `#EFF5E6`, `#E5F5FE`, `#F0EEFF`, `#e8f4fd`, `#eeecfb`, `#F0EEFE`, purple `#6c56fc`.
- **Fonts** (all self-hosted in `public/fonts/`, wired via `@font-face` in `src/index.css`): "Open Runde" 400/500/600/700 (primary, `font-sans`), "Caveat" (`font-hand`, handwritten accents like "My stack"), "Press Start 2P" (`font-pixel`, the "Pixels" heading + game HUD).
- **Type scale**: hero title 26px desktop / 24px mobile (weight 600, one line on lg+ via `lg:whitespace-nowrap`); section headings ~28-30px semibold; card/project titles 18px/600; body 16px; gray labels 16-17px/600 `#8D8D8D`.
- Pill-shaped buttons everywhere, large rounded corners (cards 24px, case-study blocks 20px), generous whitespace.
- **Animations**: premium slow feel. Easing `[0.22, 1, 0.36, 1]` sitewide (case pages use `[0.16, 1, 0.3, 1]`). Entrance durations 0.85–1.35s. Everything respects reduced motion via `<MotionConfig reducedMotion="user">` in main.jsx + CSS media query kills for CSS animations.
- **Section rhythm**: mobile = even 56px vertical padding (`py-14`) on all home sections; desktop keeps larger original paddings (`md:py-20`/`md:py-24`).

## File map (src/)

- `main.jsx` — BrowserRouter (v7 future flags on) + MotionConfig
- `App.jsx` — routes; case studies via React.lazy: `/` and `/case-study/prime-video`. Renders `<ScrollToTop/>` and `<CustomCursor/>` globally.
- `data/caseStudies.js` — home Work-grid cards: slug, title, description, `cover` image, `locked` flag. **Only prime-video is unlocked**; airbnb / notion / uber are locked (cards render as non-link divs with padlock + "Locked" cursor label).
- `components/`
  - `Navbar.jsx` — floating gray pill bar, VR logo (`/Logo.png`), links + Resume button. Shrinks from max-w-6xl to max-w-2xl when scrolled past 40px.
  - `Hero.jsx` — badge "2.8+ YOE", title + gray subtext, View work (EYE icon) / Resume (DOC icon) buttons, "My stack" repulsion icons (order: Figma, Claude, Cursor, Framer, Adobe, Blender, WordPress, Unreal, Notion, Affinity; 40px circles, -10px overlap). Contains reusable `Repel` component (cursor repulsion: radius 90, strength 27.5, window-level mousemove + springs).
  - `MusicPlayer.jsx` — vinyl card, tilted 6°, straightens on hover with handwritten "Play ↓" label. ONE HTML5 Audio in useRef, TRACKS array (3 tracks, `/Music/jazz-*.mp3`, per-track `vol` + optional `offset`), click-anywhere-to-play, tonearm swings when playing, 3 track-indicator dots, EQ bars, artist line "Design in Progress". Vinyl spins via CSS `animate-spin-vinyl` + `animationPlayState`.
  - `SlideIcon.jsx` — shared slide-in-from-left icon-on-hover for buttons. Exports `SlideIcon`, `ARROW_RIGHT`, `EYE`, `DOC`.
  - `LogoMarquee.jsx` — client logo strip (Zoapi, Novatech, Swio, Imagitec, Academy from `/logos/client-*`), 4 strip copies for seamless -50% loop, center-fade via CSS mask (35%/65% stops), pause on hover, 28px logos / 96px gaps / 0.5 opacity grayscale.
  - `Work.jsx` — "Case studies" section, 2×500px cards (aspect 500/430, bg #F4F4F4, full-bleed `cover` image, corner arrow/padlock button). Locked cards aren't links. Section container max-w-[1072px] so the grid centers.
  - `About.jsx` — polaroid photo stack (hover: 3 grayscale polaroids fan out — top 142%, left 148%, right 48%), "About" label + stats (stats hidden on mobile), heading "Curiosity led me to design. / Problem-solving made me stay.", bio paragraph, EXPERIENCE accordion (Framer height animation, one open at a time, hover translate-x; company+period 16px; `shortName` field renders on mobile).
  - `LifeOutsidePixels.jsx` — desktop: 300vh scroll-pinned scatter (cards fly out from center behind hero card, staggered `start` values; "Life Outside / Pixels" text center, Pixels in font-pixel 26px; cards drift up at end while text stays; per-card hover spring lift). Mobile (<768, via matchMedia + resize listener): simple 2-col masonry grid with heading + "Few snippets from my photography." Two Spotify-style cards (Terminal Frost/Pink Floyd, Persephone/Opeth). Photos in `/life/photo-1..10`.
  - `Contact.jsx` — "Looking for the right problem to own." (30px), mailto (hidden on mobile), right rows: Email (mobile-only) / Resume / LinkedIn / GitHub with slide-hover. GitHub intentionally → `https://github.com/404%20error` (joke 404 — confirm before "fixing").
  - `Footer.jsx` — **playable pixel runner game** on canvas (dino-style: click/Space to jump, coins +10 with popups, parallax city, birds, gears/trees/blocks obstacles, HI score in localStorage `pixelRunnerHi`, ambient motion when idle, IntersectionObserver pauses offscreen, canvas.dataset.mode = idle|running|over, cursor label Play/Jump). Dark bar: "© {year} all rights reserved by Venkatesh Rao".
  - `CustomCursor.jsx` — black dot cursor (native cursor hidden via CSS on fine pointers), enlarges on interactive elements, black label pill pops out up-left for elements with `data-cursor` attr. Labels in use: View, Locked, Read, Scroll, Play/Jump.
  - `Reveal.jsx` — shared whileInView fade+slide (0.9s).
  - `ScrollToTop.jsx`, `hooks/usePageTitle.js`.
- `pages/Home.jsx` — Navbar, Hero, LogoMarquee, Work, About, LifeOutsidePixels, Contact, Footer.
- `pages/case-studies/PrimeVideo.jsx` — THE flagship case study (route `/case-study/prime-video`), ~900 lines, structure cloned 1:1 from muhid.de/case-study/pathao-connect. All content lives in data arrays at the top (META, CONTEXT_STATS, PRESS, PROCESS, INSIGHTS, DECISIONS, JOURNEY_1, FUNNEL, FLOW_V1/V2, REFLECTIONS). Sections in order: hide-on-scroll TopNav · hero (word-by-word color reveal h1) · phone strip · About-the-product + meta sidebar (Status = green pulsing dot + "Live prototype ↗" → FIGMA_PROTO const) · The Context (stats) · In the press (2 cards, grayscale→color images, "Read" cursor) · The Problem (2 tinted cards + quotes) · Design Process (5 cards) · Research Insights (3) · Key Design Decisions (Problem/Decision/Outcome rows) · Hi-Fi gallery (DragScroll: slim `.hifi-scroll` scrollbar + mouse drag-to-scroll) · dark full-bleed section (navy gradient, #00A8E1 accent) · Impact metrics (-44% / +38% / 4.7/5 — concept numbers, replaceable) · Post-study card · funnel chart · flow v1 vs v2 · Reflections · Up next (Airbnb, locked). Content grounded in real sources: Variety streaming-UI survey 2024, Engadget Prime Video redesign article.
  - `CaseStudyTemplate.jsx` + `Airbnb/Notion/Uber.jsx` — old simple template, only reachable if unlocked. **To build a new case study: clone PrimeVideo.jsx, swap the data arrays, add route in App.jsx, unlock in caseStudies.js.**

## public/ assets

- `Logo.png` — VR monogram (navbar 36px + favicon). ⚠ 935KB, should be re-exported ~144px.
- `Madia-Venkatesh-Rao_Resume.pdf` — linked from navbar/hero/contact.
- `about-photo.jpg` + `about-photo-2/3/4.JPG` — polaroid stack (extensions/case matter on Vercel!).
- `Music/jazz-1|2|3.mp3` — player tracks.
- `fonts/` — OpenRunde woff2 ×4, Caveat-Regular.ttf, PressStart2P-Regular.ttf.
- `logos/` — stack-* icons, client-* marquee logos, case.svg (badge icon).
- `life/photo-1..10` (mixed .JPG/.jpg/.png) — gallery. ⚠ photo-2 (6MB), photo-7.png (7.4MB), photo-9 (6.8MB) still need compression.
- `case-study/images/` — prime-main-cover.png + airbnb/notion/uber-main-cover.png (home cards), amazon-phone-1..3.avif (hero strip), amazon-journey-1..4.avif (gallery), amazon-cover.webp + amazon-cover-1.jpg (press cards). Filenames still say "amazon" though slug is prime-video — works fine, rename optional.
- ⚠ `OGIMAGE.jpg` is referenced by meta tags in index.html but **does not exist yet** — needs a 1200×630 export.

## Conventions & gotchas

- File paths are case-sensitive in production (Vercel) but not on Windows dev — always match exact filename case in code.
- The dev-preview browser tab is often backgrounded: rAF, scroll events, and matchMedia change events freeze there; that's an environment artifact, not a bug.
- When adding hover effects, remember the custom cursor: interactive elements get the enlarged dot automatically; add `data-cursor="Label"` for a label pill.
- Keep entrance animations on the established easing/durations; stagger children ~0.1–0.18s.
- Locked project cards: flip `locked: false` in `caseStudies.js` — link, arrow icon, and cursor label all follow automatically.
- Music attribution (Kevin MacLeod CC BY 4.0) was removed from the footer at owner's request — if the jazz tracks are really MacLeod's, attribution should exist somewhere (resume page, about note).
- `.gitignore` excludes node_modules/, dist/, .claude/settings.local.json. Never commit those (the initial commit had to be amended to strip 2,972 node_modules files).

## Update workflow

1. Edit locally, check `npm run dev`.
2. `npm run build` must pass.
3. `git add . && git commit -m "..." && git push` → Vercel auto-deploys in ~2 min. Rollback via Vercel dashboard → Deployments → promote a previous one.

## Known TODOs

- Compress: life/photo-2, photo-7, photo-9, about-photo.jpg, Logo.png.
- Create public/OGIMAGE.jpg (1200×630) for link previews.
- Build out Airbnb (Work-Friendly Stays Filter), Notion (AI Plan Builder), Uber (Driver Reliability Score) case studies — clone the PrimeVideo.jsx structure.
- Replace concept metrics in PrimeVideo.jsx with real numbers if available.
- Confirm the GitHub 404 joke link is intentional.
