import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { EXPERIENCE } from '@/data'
import { REDUCED_MOTION } from '@/lib/env'
import { cx } from '@/lib/cx'
import { RichText } from '@/lib/RichText'
import { useApp } from '@/context/AppContext'
import { useScrollListener } from '@/hooks/useScrollListener'
import { ACCENT } from '@/components/ui/SectionHeading'
import { PosterArt } from '@/components/art/PosterArt'

const CORNER =
  'pointer-events-none absolute z-3 rounded-[10px] bg-white/70 px-3.5 py-[9px] font-mono text-[11px] font-medium tracking-[.12em] text-ink-2 uppercase'
const N = EXPERIENCE.length
/** Scroll distance per poster, in viewport heights. */
const VH_PER_POSTER = 65

/**
 * Scroll-pinned "poster stack": as you scroll through the section the posters fly past on a
 * diagonal while the card on the left swaps to the matching job. Transforms are written
 * directly to the DOM from a rAF loop; React state only tracks the focused poster.
 */
export function Experience() {
  const { goTo } = useApp()
  const section = useRef<HTMLElement>(null)
  const posters = useRef<(HTMLButtonElement | null)[]>([])
  const target = useRef(0)
  const cur = useRef(0)
  const posterWidth = useRef(270)

  const [pw, setPw] = useState(270)
  const [active, setActive] = useState(0)
  const [shownIndex, setShownIndex] = useState(0)
  const [swapping, setSwapping] = useState(false)
  const firstCard = useRef(true)

  useEffect(() => {
    posterWidth.current = pw
  }, [pw])

  // poster size follows the section width
  useEffect(() => {
    const el = section.current
    if (!el) return
    const size = () => setPw(el.clientWidth < 700 ? 190 : Math.min(290, el.clientWidth * 0.2))
    size()
    const ro = new ResizeObserver(size)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // scroll position → target poster index
  useScrollListener(() => {
    const el = section.current
    if (!el || REDUCED_MOTION) return
    const span = el.offsetHeight - innerHeight
    const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / Math.max(1, span)))
    target.current = p * (N - 1)
  })

  // animation loop
  useEffect(() => {
    let raf = 0
    const frame = () => {
      cur.current += (target.current - cur.current) * (REDUCED_MOTION ? 1 : 0.09)
      const w = posterWidth.current
      posters.current.forEach((el, i) => {
        if (!el) return
        const d = i - cur.current
        const ad = Math.abs(d)
        el.style.transform = `translate3d(${d * w * 0.92}px,${d * w * 0.6}px,${-ad * 170}px) rotateZ(${-7 + d * 4}deg) rotateY(${-d * 24}deg) rotateX(${d * 10}deg)`
        el.style.zIndex = `${100 - Math.round(ad * 10)}`
        el.style.opacity = ad > 3.3 ? '0' : '1'
        el.style.filter = ad > 0.6 ? `blur(${Math.min(6, (ad - 0.6) * 2.4)}px)` : 'none'
        // chromatic-aberration shadow on posters that are off-centre
        el.style.boxShadow =
          ad > 0.9
            ? `${-ad * 5}px 0 0 rgba(0,200,255,.28),${ad * 5}px 0 0 rgba(255,40,90,.28),0 30px 50px -26px rgba(17,17,20,.55)`
            : '0 40px 60px -26px rgba(17,17,20,.6)'
      })
      setActive(Math.max(0, Math.min(N - 1, Math.round(cur.current))))
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [])

  // cross-fade the detail card when the focused poster changes
  useEffect(() => {
    if (firstCard.current) {
      firstCard.current = false
      return
    }
    setSwapping(true)
    const t = window.setTimeout(() => {
      setShownIndex(active)
      setSwapping(false)
    }, 180)
    return () => window.clearTimeout(t)
  }, [active])

  const jumpTo = (i: number) => {
    if (REDUCED_MOTION || !section.current) {
      target.current = i
      return
    }
    const span = section.current.offsetHeight - innerHeight
    goTo(section.current.offsetTop + span * (i / (N - 1)) + 1)
  }

  const job = EXPERIENCE[shownIndex]

  return (
    <section
      ref={section}
      className="relative bg-paper"
      id="experience"
      aria-labelledby="exp-h"
      style={{ height: REDUCED_MOTION ? 'auto' : `calc(${N * VH_PER_POSTER}vh + 100vh)` }}
    >
      <div className="sticky top-0 h-svh overflow-hidden px-[clamp(14px,2.4vw,32px)] pt-[84px] pb-[clamp(14px,2.4vw,32px)]">
        <div className="relative h-full overflow-hidden rounded-[32px] border border-line bg-[#EDEBE7] [perspective:1400px]">
          <span className={`${CORNER} top-[18px] right-[18px]`}>Experience archive Nº04</span>
          <span className={`${CORNER} right-[18px] bottom-[18px]`}>2023 — Now</span>

          <div className="absolute top-[76px] left-[clamp(18px,3vw,44px)] z-10 flex w-[min(380px,34%)] flex-col gap-3 max-[900px]:top-auto max-[900px]:right-3.5 max-[900px]:bottom-[52px] max-[900px]:left-3.5 max-[900px]:w-auto">
            <h2
              id="exp-h"
              className="m-0 mb-1.5 font-display text-[clamp(40px,4.6vw,72px)] leading-[.86] font-extrabold uppercase wdth-74 max-[900px]:hidden"
            >
              Where I’ve <em className={ACCENT}>built.</em>
            </h2>
            <div
              className={cx(
                'flex flex-col gap-2 rounded-[20px] border border-line bg-white/82 px-5 py-[18px] backdrop-blur-[10px] transition-[opacity,translate] duration-300',
                swapping && 'translate-y-2.5 opacity-0',
              )}
            >
              <span className="mono">{job.dates}</span>
              <h3 className="m-0 font-display text-2xl leading-[1.05] font-bold wdth-85">{job.role}</h3>
              <div className="text-[15px] font-medium text-ink-2">
                {job.company} · {job.where}
              </div>
              <ul className="mt-1 flex list-none flex-col gap-2 p-0 text-[14.5px] max-[900px]:hidden">
                {job.points.map((p) => (
                  <li key={p} className="relative pl-5 text-ink-2 before:absolute before:left-0 before:text-cobalt before:content-['→']">
                    <RichText text={p} />
                  </li>
                ))}
              </ul>
              {job.link && (
                <a className="inline-flex min-h-10 items-center self-start rounded-full bg-ink px-4 text-sm font-semibold text-on-dk" href={job.link} target="_blank" rel="noopener">
                  Read the paper ↗
                </a>
              )}
            </div>
          </div>

          <div
            className="absolute inset-0 left-[clamp(380px,36%,520px)] z-1 [mask-image:linear-gradient(to_right,transparent_0,#000_14%)] [transform-style:preserve-3d] max-[900px]:top-[-18%] max-[900px]:left-0 max-[900px]:[mask-image:linear-gradient(to_bottom,#000_70%,transparent_92%)]"
            style={{ '--pw': `${pw}px` } as CSSProperties}>
            {EXPERIENCE.map((j, i) => (
              <button
                key={j.company}
                ref={(el) => {
                  posters.current[i] = el
                }}
                type="button"
                className="absolute top-1/2 left-1/2 mt-[calc(var(--pw,270px)*-.68)] ml-[calc(var(--pw,270px)/-2)] flex h-[calc(var(--pw,270px)*1.36)] w-[var(--pw,270px)] cursor-pointer flex-col justify-between overflow-hidden rounded-[6px] border-0 p-4 text-left font-[inherit] will-change-[transform,filter,opacity]"
                style={{ background: j.poster.bg, color: j.poster.fg }}
                aria-label={`${j.company} — ${j.role}`}
                onClick={() => jumpTo(i)}
              >
                <PosterArt id={j.poster.art} />
                <span className="relative flex justify-between font-mono text-[10.5px] font-medium tracking-[.06em] uppercase opacity-85">
                  <span>{j.poster.meta[0]}</span>
                  <span>{j.poster.meta[1]}</span>
                </span>
                <span className="relative">
                  <span className="block font-display text-[calc(var(--pw,270px)*.155)] leading-[.86] font-extrabold tracking-[-.01em] uppercase wdth-64">{j.poster.short}</span>
                  <span className="mt-2.5 block text-[12.5px] leading-[1.25] font-semibold opacity-90">
                    {j.role.split(' — ')[0]}
                    <br />
                    {j.dates}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <div className="absolute bottom-[22px] left-1/2 z-6 flex -translate-x-1/2 gap-1.5" aria-hidden="true">
            {EXPERIENCE.map((j, i) => (
              <i
                key={j.company}
                className={cx('h-[3px] rounded-sm transition-[width,background-color] duration-350', i === active ? 'w-[34px] bg-cobalt' : 'w-[18px] bg-ink/18')}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
