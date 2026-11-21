import { useEffect, useMemo, useRef } from 'react'
import { createSmoothScroller } from '@/lib/smoothScroll'

/** Installs inertial scrolling (while `locked` is false) and returns a `goTo(y)` jump function. */
export function useSmoothScroll(locked: boolean) {
  const lockedRef = useRef(locked)
  useEffect(() => {
    lockedRef.current = locked
  }, [locked])

  const scroller = useMemo(() => createSmoothScroller(() => lockedRef.current), [])
  useEffect(() => scroller.attach(), [scroller])
  return scroller.goTo
}
