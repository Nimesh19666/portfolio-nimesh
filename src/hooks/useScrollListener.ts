import { useEffect, useRef } from 'react'

/** Calls `handler` on every scroll (and once on mount). Handler may change between renders. */
export function useScrollListener(handler: (scrollY: number) => void) {
  const saved = useRef(handler)
  useEffect(() => {
    saved.current = handler
  })

  useEffect(() => {
    const run = () => saved.current(window.scrollY)
    run()
    window.addEventListener('scroll', run, { passive: true })
    window.addEventListener('resize', run)
    return () => {
      window.removeEventListener('scroll', run)
      window.removeEventListener('resize', run)
    }
  }, [])
}
