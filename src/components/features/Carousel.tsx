import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { KEY_NUMBERS } from '@/data'
import { REDUCED_MOTION } from '@/lib/env'
import { cx } from '@/lib/cx'
import { NumberArt } from '@/components/art/NumberArt'
import { CountUp } from './CountUp'

const ARROW_BTN =
  'grid size-[52px] cursor-pointer place-items-center rounded-full border-[1.5px] border-ink bg-transparent transition duration-250 hover:bg-ink hover:text-on-dk'
const N = KEY_NUMBERS.length
const AUTOPLAY_MS = 3600
/** Horizontal spacing between neighbouring cards, as a fraction of card width. */
const SPREAD = 0.74

/** Shortest signed distance on the ring of N cards. */
const ringDelta = (d: number) => {
  d = ((d % N) + N) % N
  return d > N / 2 ? d - N : d
}

interface Props {
  /** Carousel is on screen — autoplay only runs while true. */
  visible: boolean
  onActiveChange: (index: number) => void
}

/**
 * 3D coverflow of "key number" cards. A rAF loop eases `cur` toward `target` and writes
 * transforms straight to the DOM; React state only tracks which card is centred.
 */
export function Carousel({ visible, onActiveChange }: Props) {
  const stage = useRef<HTMLDivElement>(null)
  const cards = useRef<(HTMLButtonElement | null)[]>([])
  const width = useRef(400)
  const target = useRef(0)
  const cur = useRef(0)
  const drag = useRef({ startX: 0, startCur: 0, moved: 0, card: -1 })

  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(REDUCED_MOTION)
  const [hovering, setHovering] = useState(false)
  const [dragging, setDragging] = useState(false)
  const draggingRef = useRef(false)

  const goTo = useCallback((i: number) => {
    const base = Math.round(target.current)
    target.current = base + ringDelta(i - (((base % N) + N) % N))
  }, [])

  // card width follows the container
  useEffect(() => {
    const el = stage.current
    if (!el) return
    const size = () => {
      const w = el.clientWidth
      width.current = w < 640 ? Math.min(300, w * 0.78) : Math.min(420, w * 0.3)
      el.style.setProperty('--kw', `${width.current}px`)
    }
    size()
    const ro = new ResizeObserver(size)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // animation loop
  useEffect(() => {
    let raf = 0
    const frame = () => {
      if (!draggingRef.current) cur.current += (target.current - cur.current) * (REDUCED_MOTION ? 1 : 0.11)
      const kw = width.current
      cards.current.forEach((c, i) => {
        if (!c) return
        const d = ringDelta(i - cur.current)
        const ad = Math.abs(d)
        c.style.transform = `translate3d(${d * kw * SPREAD}px,${ad * ad * 10}px,${-ad * 170}px) rotateY(${-d * 20}deg) rotateZ(${d * 2.5}deg) scale(${1 - Math.min(ad, 3) * 0.08})`
        c.style.zIndex = `${100 - Math.round(ad * 10)}`
        c.style.opacity = `${ad > 2.6 ? 0 : ad > 1.6 ? 2.6 - ad : 1}`
        c.style.filter = ad > 0.5 ? `saturate(${1 - Math.min(0.4, ad * 0.15)}) brightness(${1 - Math.min(0.12, ad * 0.05)})` : 'none'
      })
      setActive(((Math.round(cur.current) % N) + N) % N)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => onActiveChange(active), [active, onActiveChange])

  // autoplay: advance after AUTOPLAY_MS unless paused / hovered / dragged / offscreen
  const running = !paused && !hovering && !dragging && visible
  useEffect(() => {
    if (!running) return
    const t = window.setTimeout(() => goTo(active + 1), AUTOPLAY_MS)
    return () => window.clearTimeout(t)
  }, [running, active, goTo])

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true
    setDragging(true)
    drag.current = {
      startX: e.clientX,
      startCur: cur.current,
      moved: 0,
      card: Number((e.target as Element).closest<HTMLElement>('.kc')?.dataset.i ?? -1),
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    const dx = e.clientX - drag.current.startX
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx))
    cur.current = drag.current.startCur - dx / (width.current * SPREAD)
  }
  const onUp = () => {
    if (!draggingRef.current) return
    draggingRef.current = false
    setDragging(false)
    const { moved, card } = drag.current
    if (moved < 6 && card >= 0 && card !== active) goTo(card)
    else target.current = Math.round(cur.current)
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      goTo(active + 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goTo(active - 1)
    }
  }

  return (
    <>
      <div
        ref={stage}
        className={cx(
          'relative z-1 mt-[clamp(10px,2vw,24px)] h-[clamp(500px,64vh,600px)] touch-pan-y [perspective:1600px] select-none',
          dragging ? 'cursor-grabbing' : 'cursor-grab',
        )}
        role="region"
        aria-roledescription="carousel"
        aria-label="Key numbers"
        tabIndex={0}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onKeyDown={onKey}
      >
        {KEY_NUMBERS.map((n, i) => {
          const isActive = i === active
          return (
            <button
              key={n.title}
              ref={(el) => {
                cards.current[i] = el
              }}
              type="button"
              data-i={i}
              className="absolute top-1/2 left-1/2 flex h-[calc(var(--kw,400px)*1.24)] w-[var(--kw,400px)] mt-[calc(var(--kw,400px)*-.62)] ml-[calc(var(--kw,400px)/-2)] cursor-pointer flex-col gap-3 overflow-hidden rounded-[30px] border-0 p-[clamp(16px,1.8vw,24px)] text-left font-[inherit] shadow-[0_40px_60px_-34px_rgba(17,17,20,.55)] will-change-[transform,opacity]"
              style={{ background: n.bg, color: n.fg, '--ke': n.accent } as CSSProperties}
              aria-label={`${n.value}${n.unit} ${n.title} — ${n.blurb}`}
              aria-hidden={!isActive}
              tabIndex={isActive ? 0 : -1}
            >
              <span className="flex items-center justify-between font-mono text-[11.5px] font-medium tracking-[.06em] uppercase opacity-80">
                <span>
                  {String(i + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
                </span>
                <span>{n.source}</span>
              </span>
              <span className="relative grid min-h-0 flex-1 place-items-center overflow-hidden rounded-[20px] bg-white p-[18px]">
                <NumberArt id={n.art} active={isActive} />
              </span>
              <span className="flex items-end justify-between gap-3.5">
                <span className="font-display text-[calc(var(--kw,400px)*.3)] leading-[.8] font-extrabold tracking-[-.035em] wdth-64">
                  <CountUp value={n.value} play={isActive} />
                  <em className="text-[.55em] text-[color:var(--ke)] not-italic">{n.unit}</em>
                </span>
                <span className="max-w-[52%] text-right">
                  <b className="block font-display text-[calc(var(--kw,400px)*.062)] leading-[.95] font-extrabold uppercase wdth-80">{n.title}</b>
                  <span className="mt-1.5 block text-[13.5px] leading-[1.35] opacity-85 max-sm:hidden">{n.blurb}</span>
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="relative z-1 mt-[clamp(10px,2vw,22px)] flex items-center justify-center gap-4">
        <button className={ARROW_BTN} type="button" aria-label="Previous" onClick={() => goTo(active - 1)}>
          ←
        </button>
        <div className="flex gap-2">
          {KEY_NUMBERS.map((n, i) => (
            <button
              key={n.title}
              type="button"
              aria-label={`Go to ${n.title}`}
              aria-current={i === active}
              className="relative h-11 w-[34px] cursor-pointer border-0 bg-transparent p-0 before:absolute before:inset-x-0 before:top-5 before:h-1 before:rounded-sm before:bg-line-2 before:content-[''] max-sm:w-[22px]"
              onClick={() => goTo(i)}
            >
              <i
                className={cx(
                  'absolute top-5 left-0 h-1 rounded-sm bg-ink',
                  i !== active ? 'w-0' : running ? 'w-0 animate-kfill' : 'w-full',
                )}
                style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
              />
            </button>
          ))}
        </div>
        <button className={ARROW_BTN} type="button" aria-label="Next" onClick={() => goTo(active + 1)}>
          →
        </button>
        <button
          className="min-h-11 cursor-pointer rounded-full border border-line-2 bg-transparent px-3.5 font-mono text-xs font-medium max-sm:hidden"
          type="button" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
          {paused ? 'Play' : 'Pause'}
        </button>
      </div>
    </>
  )
}
