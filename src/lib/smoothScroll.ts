import { FINE_POINTER, REDUCED_MOTION } from './env'

const SMOOTH = FINE_POINTER && !REDUCED_MOTION
const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight

/**
 * Inertial wheel scrolling for fine pointers. Touch devices and users who prefer
 * reduced motion keep native scrolling; programmatic jumps still go through goTo().
 */
export function createSmoothScroller(isLocked: () => boolean) {
  let target = 0
  let cur = 0
  let driving = false

  function step() {
    if (!driving) return
    cur += (target - cur) * 0.1
    if (Math.abs(target - cur) < 0.5) {
      cur = target
      driving = false
    }
    window.scrollTo(0, cur)
    if (driving) requestAnimationFrame(step)
  }

  function goTo(y: number) {
    y = Math.max(0, Math.min(maxScroll(), y))
    if (!SMOOTH) {
      window.scrollTo({ top: y, behavior: REDUCED_MOTION ? 'auto' : 'smooth' })
      return
    }
    target = y
    if (!driving) {
      cur = window.scrollY
      driving = true
      requestAnimationFrame(step)
    }
  }

  function onWheel(e: WheelEvent) {
    if (isLocked() || e.ctrlKey) return
    if (e.target instanceof Element && e.target.closest('[data-native-scroll]')) return
    e.preventDefault()
    if (!driving) target = window.scrollY
    goTo(target + e.deltaY * (e.deltaMode === 1 ? 32 : 1))
  }

  function onScroll() {
    if (!driving) target = cur = window.scrollY
  }

  function attach() {
    if (!SMOOTH) return () => {}
    target = cur = window.scrollY
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      driving = false
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
    }
  }

  return { goTo, attach }
}
