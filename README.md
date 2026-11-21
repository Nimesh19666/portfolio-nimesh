# Nimesh Gujari Portfolio

React 19 + TypeScript + Vite + Tailwind CSS v4.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build → dist/
npm run preview    # serve the build
```

## Structure

```
src/
  App.tsx                 page shell, overlay state, global keyboard/anchor handling
  context/AppContext      goTo, showToast, openCase, openPalette, openGame…
  data/                   ALL content lives here (projects, experience, skills, numbers, site info)
  hooks/                  useSmoothScroll, useInView, useMagnetic, useFontProximity, useLocalStorage…
  lib/                    env flags, smooth-scroll engine, signature drawing, snake engine, morph
  components/
    layout/               Header, Preloader, Cursor, ScrollProgress, BackToTop, Toast, Grain
    sections/             Hero, Marquee, About, Numbers, Work, Experience, Stack, Guestbook, Contact
    features/             Carousel, CaseStudy, CommandPalette, SnakeGame, Terminal, CodeWindow…
    art/                  SVG illustrations (project covers, poster art, number-card art)
    ui/                   Button, Reveal, SectionHeading, Signature, Icons
  styles/
    index.css             the only stylesheet: Tailwind import, design tokens (@theme),
                          keyframes (--animate-*), a few custom utilities (wrap, band, mono, wdth-*)
```

## Editing content

Change text, projects, jobs, skills and stats in `src/data/*` no component edits needed.
In `experience.ts`, wrap words in `**double asterisks**` to bold them.

## Notes

- All styling is Tailwind utilities in the JSX. Colours/fonts are theme tokens in `src/styles/index.css` (`bg-cobalt`, `text-ink`, `font-display`, …); Archivo's width axis is `wdth-75` etc.
- Per-frame effects (carousel, posters, cursor, smooth scroll) write transforms straight to the DOM from rAF loops; React state only tracks what is on screen.
- Respects `prefers-reduced-motion`; custom cursor, tilt and magnetic effects are fine-pointer only.
- The résumé button is a placeholder set its `href` in `Hero.tsx` and remove the `#resume` branch in `App.tsx`.
