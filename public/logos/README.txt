CLIENT / COMPANY LOGOS
======================

Drop your logo files here (SVG or PNG, ideally ~48px tall with
transparent background), e.g.:

  logo-1.svg
  logo-2.svg
  ...

Then edit the LOGOS array in src/components/LogoMarquee.jsx to point
at them, e.g.:

  const LOGOS = [
    { name: 'Acme', src: '/logos/logo-1.svg' },
    ...
  ]

and swap the gray placeholder <div> for an <img>. The marquee CSS
(grayscale, 0.55 opacity, pause on hover) already applies to whatever
is inside the strip.
