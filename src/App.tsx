import { useCallback, useEffect, useMemo, useState } from 'react'
import { SITE } from '@/data'
import { REDUCED_MOTION } from '@/lib/env'
import { cx } from '@/lib/cx'
import { AppProvider, type AppActions } from '@/context/AppContext'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import { useToast } from '@/hooks/useToast'
import { BackToTop } from '@/components/layout/BackToTop'
import { Cursor } from '@/components/layout/Cursor'
import { Grain } from '@/components/layout/Grain'
import { Header } from '@/components/layout/Header'
import { Preloader } from '@/components/layout/Preloader'
import { ScrollProgress } from '@/components/layout/ScrollProgress'
import { Toast } from '@/components/layout/Toast'
import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'
import { Experience } from '@/components/sections/Experience'
import { Guestbook } from '@/components/sections/Guestbook'
import { Hero } from '@/components/sections/Hero'
import { Marquee } from '@/components/sections/Marquee'
import { Numbers } from '@/components/sections/Numbers'
import { Stack } from '@/components/sections/Stack'
import { Work } from '@/components/sections/Work'
import { CaseStudy } from '@/components/features/CaseStudy'
import { CommandPalette } from '@/components/features/CommandPalette'
import { SnakeGame } from '@/components/features/SnakeGame'

const RESUME_MESSAGE = 'Résumé PDF link coming soon — email me for a copy.'
const CASE_HASH = '#case-'

export default function App() {
  const [loaded, setLoaded] = useState(REDUCED_MOTION)
  const [showPreloader, setShowPreloader] = useState(!REDUCED_MOTION)
  const [menuOpen, setMenuOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [gameOpen, setGameOpen] = useState(false)
  const [caseId, setCaseId] = useState<string | null>(null)
  const [caseTile, setCaseTile] = useState<HTMLElement | null>(null)
  const toast = useToast()

  const overlayOpen = menuOpen || paletteOpen || gameOpen || caseId !== null
  const goTo = useSmoothScroll(overlayOpen)

  /* ---------- actions shared through context ---------- */
  const goToId = useCallback(
    (id: string) => {
      const el = document.getElementById(id)
      if (!el) return
      goTo(id === 'top' ? 0 : el.getBoundingClientRect().top + window.scrollY - (id === 'contact' ? 0 : 70))
    },
    [goTo],
  )

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(SITE.email)
      toast.show('Email copied to clipboard')
      return true
    } catch {
      toast.show(SITE.email)
      return false
    }
  }, [toast.show])

  const openCase = useCallback((id: string, tile?: HTMLElement | null) => {
    setCaseTile(tile ?? document.querySelector<HTMLElement>(`[data-cursor="tile"][data-id="${id}"]`))
    setCaseId(id)
    history.replaceState(null, '', `${CASE_HASH}${id}`)
  }, [])

  const closeCase = useCallback(() => {
    setCaseId(null)
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }, [])

  const actions = useMemo<AppActions>(
    () => ({
      goTo,
      goToId,
      showToast: toast.show,
      copyEmail,
      openCase,
      openPalette: () => setPaletteOpen(true),
      openGame: () => setGameOpen(true),
      openMenu: () => setMenuOpen(true),
    }),
    [goTo, goToId, toast.show, copyEmail, openCase],
  )

  /* ---------- global behaviour ---------- */
  // in-page anchors: smooth scroll, close the mobile menu, stub the résumé link
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href')!.slice(1)
      if (id === 'resume') {
        e.preventDefault()
        toast.show(RESUME_MESSAGE)
        return
      }
      if (!document.getElementById(id)) return
      e.preventDefault()
      setMenuOpen(false)
      goToId(id)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [goToId, toast.show])

  // keyboard: ⌘K / Ctrl+K and "/" open the palette; Esc closes the top-most overlay
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      } else if (e.key === '/' && !(e.target as Element).closest('input,textarea') && !paletteOpen && !gameOpen) {
        e.preventDefault()
        setPaletteOpen(true)
      } else if (e.key === 'Escape') {
        if (gameOpen) return // the game handles its own Esc
        if (paletteOpen) setPaletteOpen(false)
        else if (caseId) closeCase()
        else if (menuOpen) setMenuOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [paletteOpen, gameOpen, caseId, menuOpen, closeCase])

  // deep links: #case-<id>
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash
      if (h.startsWith(CASE_HASH)) openCase(h.slice(CASE_HASH.length))
    }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    return () => window.removeEventListener('hashchange', fromHash)
  }, [openCase])

  // freeze page scroll behind the case study
  useEffect(() => {
    document.body.style.overflow = caseId ? 'hidden' : ''
  }, [caseId])

  return (
    <AppProvider value={actions}>
      <div className={cx(loaded && 'loaded')}>
        <Grain />
        {showPreloader && <Preloader onReveal={() => setLoaded(true)} onGone={() => setShowPreloader(false)} />}
        <ScrollProgress />
        <Cursor suspended={overlayOpen} />
        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <main>
          <Hero loaded={loaded} />
          <Marquee />
          <About />
          <Numbers />
          <Work />
          <Experience />
          <Stack />
          <Guestbook />
          <Contact />
        </main>

        <CaseStudy caseId={caseId} fromTile={caseTile} onClose={closeCase} onNavigate={(id) => openCase(id, document.querySelector<HTMLElement>(`[data-cursor="tile"][data-id="${id}"]`))} />
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
        <BackToTop />
        <SnakeGame open={gameOpen} onClose={() => setGameOpen(false)} />
        <Toast message={toast.message} visible={toast.visible} />
      </div>
    </AppProvider>
  )
}
