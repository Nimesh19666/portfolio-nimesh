import { useEffect, type RefObject } from 'react'
import { FINE_POINTER, REDUCED_MOTION } from '@/lib/env'

interface Options {
  /** px distance within which letters react to the cursor */
  radius: number
  base: { wdth: number; wght: number }
  /** added to `base` at distance 0 (may be negative) */
  delta: { wdth: number; wght: number }
}

/**
 * Letters matched by `selector` widen/lighten as the cursor approaches (Archivo is a variable font).
 * `rootRef` holds the letters; `listenRef` is the element whose mouse movement drives the effect.
 */
export function useFontProximity(
  rootRef: RefObject<HTMLElement | null>,
  listenRef: RefObject<HTMLElement | null>,
  selector: string,
  { radius, base, delta }: Options,
) {
  const { wdth: bw, wght: bg } = base
  const { wdth: dw, wght: dg } = delta

  useEffect(() => {
    const root = rootRef.current
    const target = listenRef.current
    if (!root || !target || !FINE_POINTER || REDUCED_MOTION) return

    const move = (e: MouseEvent) => {
      root.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        const b = el.getBoundingClientRect()
        const d = Math.hypot(e.clientX - (b.left + b.width / 2), e.clientY - (b.top + b.height / 2))
        const k = Math.max(0, 1 - d / radius)
        el.style.fontVariationSettings = `'wdth' ${bw + k * dw},'wght' ${bg + k * dg}`
      })
    }
    const leave = () => root.querySelectorAll<HTMLElement>(selector).forEach((el) => (el.style.fontVariationSettings = ''))

    target.addEventListener('mousemove', move)
    target.addEventListener('mouseleave', leave)
    return () => {
      target.removeEventListener('mousemove', move)
      target.removeEventListener('mouseleave', leave)
    }
  }, [rootRef, listenRef, selector, radius, bw, bg, dw, dg])
}
