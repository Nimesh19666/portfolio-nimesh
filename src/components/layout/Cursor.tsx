import { useEffect, useRef } from 'react'
import { FINE_POINTER } from '@/lib/env'

/**
 * Custom cursor: a small dot that grows over links/buttons and swaps to a labelled bubble
 * over project tiles and draggable items. Only active for fine pointers.
 */
export function Cursor({ suspended }: { suspended: boolean }) {
  const dot = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const d = dot.current
    const l = label.current
    if (!FINE_POINTER || !d || !l) return

    document.body.classList.add('has-cursor')
    let mx = innerWidth / 2
    let my = innerHeight / 2
    let dx = mx
    let dy = my
    let lx = mx
    let ly = my
    let raf = 0

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      const t = e.target as Element
      const tile = t.closest('[data-cursor="tile"]')
      const draggable = t.closest('[data-cursor="drag"]')
      d.toggleAttribute('data-big', !!t.closest('a,button,[data-cursor="grow"]') && !tile)
      d.toggleAttribute('data-hide', !!tile || !!draggable)
      l.textContent = tile ? 'View case study' : draggable ? 'Drag me' : ''
      l.toggleAttribute('data-on', !!tile || !!draggable)
    }
    const onLeave = () => document.body.classList.remove('has-cursor')
    const onEnter = () => document.body.classList.add('has-cursor')

    const frame = () => {
      dx += (mx - dx) * 0.25
      dy += (my - dy) * 0.25
      lx += (mx - lx) * 0.16
      ly += (my - ly) * 0.16
      d.style.transform = `translate(${dx}px,${dy}px)`
      l.style.left = `${lx}px`
      l.style.top = `${ly}px`
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.body.classList.remove('has-cursor')
    }
  }, [])

  // Overlays (case study, game) hide the custom cursor states while they open.
  useEffect(() => {
    if (!suspended) return
    label.current?.removeAttribute('data-on')
    dot.current?.removeAttribute('data-hide')
    dot.current?.removeAttribute('data-big')
  }, [suspended])

  return (
    <>
      <div
        ref={dot}
        className="pointer-events-none fixed top-0 left-0 z-150 -m-1.5 size-3 rounded-full bg-white opacity-0 mix-blend-difference transition-[width,height,margin,opacity] duration-350 ease-out-expo in-[.has-cursor]:opacity-100 data-big:-m-7 data-big:size-14 data-hide:opacity-0!"
        aria-hidden="true"
      />
      <div
        ref={label}
        className="pointer-events-none fixed top-0 left-0 z-151 -translate-x-1/2 -translate-y-1/2 scale-60 rounded-full bg-cobalt px-3.5 py-2 font-sans text-[13px] font-semibold whitespace-nowrap text-white opacity-0 transition-[opacity,scale] duration-250 data-on:scale-100 data-on:opacity-100"
        aria-hidden="true"
      />
    </>
  )
}
