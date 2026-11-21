import { useEffect, useRef } from 'react'
import { MARQUEE_STACK } from '@/data'
import { REDUCED_MOTION } from '@/lib/env'

/** Endless ticker that speeds up — and reverses — with scroll velocity. */
export function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track || REDUCED_MOTION) return
    let x = 0
    let dir = 1
    let vel = 0
    let lastY = scrollY
    let raf = 0

    const onScroll = () => {
      vel += (scrollY - lastY) * 0.15
      lastY = scrollY
    }
    const frame = () => {
      const v = vel
      vel *= 0.9
      if (Math.abs(v) > 0.4) dir = v > 0 ? 1 : -1
      x -= (0.6 + Math.min(Math.abs(v), 20)) * dir
      const half = track.scrollWidth / 2 // content is rendered twice
      if (half) {
        if (x <= -half) x += half
        if (x > 0) x -= half
      }
      track.style.transform = `translate3d(${x}px,0,0)`
      raf = requestAnimationFrame(frame)
    }
    addEventListener('scroll', onScroll, { passive: true })
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('scroll', onScroll)
    }
  }, [])

  const items = [...MARQUEE_STACK, ...MARQUEE_STACK]
  return (
    <div className="overflow-hidden bg-dk py-[22px] text-on-dk" aria-label="Tech stack">
      <div ref={trackRef} className="flex w-max will-change-transform">
        {items.map((name, i) => (
          <span
            key={i}
            className="flex items-center gap-[30px] pr-[30px] font-display text-[clamp(28px,3.6vw,52px)] leading-none font-bold whitespace-nowrap uppercase wdth-80 nth-[3n+2]:text-transparent nth-[3n+2]:[-webkit-text-stroke:1.2px_var(--color-on-dk)]"
          >
            {name}
            <i className="size-3.5 rounded-full bg-cobalt" />
          </span>
        ))}
      </div>
    </div>
  )
}
