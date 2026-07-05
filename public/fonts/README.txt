SELF-HOSTED FONTS
=================

Download and place these EXACT .woff2 files in this folder
(the @font-face rules in src/index.css reference them):

  OpenRunde-Regular.woff2    (weight 400)
  OpenRunde-Medium.woff2     (weight 500)
  OpenRunde-Semibold.woff2   (weight 600)
  OpenRunde-Bold.woff2       (weight 700)
  Caveat-Regular.ttf         (variable, weights 400-700)
  PressStart2P-Regular.ttf   (pixel font — "Pixels" accent text, SIL OFL)

All files are in place. Sources:
- Open Runde: https://github.com/lauridskern/open-runde (free, SIL OFL)
- Caveat: https://fonts.google.com/specimen/Caveat

Tip: converting Caveat-Regular.ttf to .woff2 would shrink it (~250 KB
to ~100 KB); if you do, update the @font-face src in src/index.css.
