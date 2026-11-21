import { useEffect, type RefObject } from 'react'
import { FINE_POINTER, REDUCED_MOTION } from '@/lib/env'

/**
 * Pulls an element toward the cursor while hovered.
 * `innerSelector` (optional) moves a child at half strength for a parallax feel.
 */
export function useMagnetic<T extends HTMLElement>(ref: RefObject<T | null>, strength = 0.22, innerSelector?: string) {
  useEffect(() => {
    const el = ref.current
    if (!el || !strength || !FINE_POINTER || REDUCED_MOTION) return
    const inner = innerSelector ? el.querySelector<HTMLElement>(innerSelector) : null

    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const x = e.clientX - r.left - r.width / 2
      const y = e.clientY - r.top - r.height / 2
      el.style.transform = `translate(${x * strength}px,${y * strength}px)`
      if (inner) inner.style.transform = `translate(${x * strength * 0.5}px,${y * strength * 0.5}px)`
    }
    const leave = () => {
      el.style.transform = ''
      if (inner) inner.style.transform = ''
    }
    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', leave)
    return () => {
      el.removeEventListener('mousemove', move)
      el.removeEventListener('mouseleave', leave)
    }
  }, [ref, strength, innerSelector])
}
