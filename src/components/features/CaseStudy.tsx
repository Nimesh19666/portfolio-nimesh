import { useEffect, useRef, useState, type ReactNode } from 'react'
import { PROJECTS, type Project } from '@/data'
import { REDUCED_MOTION } from '@/lib/env'
import { cx } from '@/lib/cx'
import { boxOf, fullscreenBox, morph } from '@/lib/morph'
import { Button } from '@/components/ui/Button'
import { ICON_BTN } from '@/components/ui/classes'
import { Close } from '@/components/ui/Icons'
import { ProjectCover } from '@/components/art/ProjectCover'

const PAPER = '#F4F2EE'
const nextFrame = (fn: () => void) => requestAnimationFrame(() => requestAnimationFrame(fn))

interface Props {
  /** Project to show; null = closed. */
  caseId: string | null
  /** Tile the case study grows out of (and shrinks back into). */
  fromTile: HTMLElement | null
  onClose: () => void
  onNavigate: (id: string) => void
}

const TAG = 'rounded-full border border-line-2 px-[13px] py-[7px] font-mono text-[13px] whitespace-nowrap'

/** One label/body pair in the details grid. */
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <div className="border-t border-line py-7 max-[900px]:pb-2">
        <h4 className="m-0 font-mono text-[13px] font-medium text-muted">{label}</h4>
      </div>
      <div className="border-t border-line py-7 text-lg text-ink-2 max-[900px]:border-t-0 max-[900px]:pt-0">{children}</div>
    </>
  )
}

function CaseContent({
  project,
  shown,
  onNavigate,
  onClose,
}: {
  project: Project
  shown: boolean
  onNavigate: (id: string) => void
  onClose: () => void
}) {
  const i = PROJECTS.indexOf(project)
  const next = PROJECTS[(i + 1) % PROJECTS.length]
  /** Staggered fade-up once the panel is shown. */
  const rise = (delay: number) => ({
    className: cx(
      'transition-[opacity,translate] duration-700 ease-out-expo',
      shown ? 'translate-y-0 opacity-100' : 'translate-y-[30px] opacity-0',
    ),
    style: { transitionDelay: shown ? `${delay}s` : '0s' },
  })
  return (
    <>
      <div className="sticky top-0 z-2 flex items-center justify-between gap-3 border-b border-line bg-paper/88 px-[clamp(18px,3.5vw,56px)] py-3.5 backdrop-blur-xl">
        <span className="mono">
          Case study · {String(i + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
        </span>
        <button className={cx(ICON_BTN, 'grid')} type="button" aria-label="Close case study" onClick={onClose}>
          <Close />
        </button>
      </div>
      <div className="wrap">
        <div className="pt-[clamp(32px,5vw,64px)] pb-9">
          <span className={cx('mono block', rise(0).className)} style={rise(0).style}>
            {project.org} · {project.year}
          </span>
          <h2
            id="cs-title"
            className={cx(
              'mt-3.5 mb-[18px] font-display text-[clamp(44px,7vw,120px)] leading-[.9] font-extrabold tracking-[-.025em] uppercase wdth-78',
              rise(0.06).className,
            )}
            style={rise(0.06).style}
          >
            {project.name}
          </h2>
          <p className={cx('m-0 max-w-[640px] text-xl text-ink-2', rise(0.12).className)} style={rise(0.12).style}>
            {project.line}
          </p>
        </div>

        <div
          className={cx('relative mb-14 h-[clamp(260px,40vw,480px)] overflow-hidden rounded-[26px]', rise(0.18).className)}
          style={rise(0.18).style}
        >
          <ProjectCover id={project.cover} className="p-[clamp(22px,4vw,48px)]" />
        </div>

        <div
          className={cx('grid grid-cols-[minmax(0,.6fr)_minmax(0,1.4fr)] gap-x-16 pb-10 max-[900px]:grid-cols-1', rise(0.26).className)}
          style={rise(0.26).style}
        >
          <Row label="The problem">{project.problem}</Row>
          <Row label="My role">{project.role}</Row>
          <Row label="Tech stack">
            <div className="flex flex-wrap gap-1.5">
              {project.stack.map((t) => (
                <span key={t} className={TAG}>
                  {t}
                </span>
              ))}
            </div>
          </Row>
          <Row label="Key features">
            <ul className="m-0 grid list-none gap-3 p-0">
              {project.features.map((f) => (
                <li key={f} className="relative pl-6 before:absolute before:left-0 before:text-cobalt before:content-['→']">
                  {f}
                </li>
              ))}
            </ul>
          </Row>
          <Row label="Results">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3">
              {project.metrics.map(([value, label]) => (
                <div key={label} className="rounded-[20px] border border-line bg-card p-[22px]">
                  <b className="mb-2 block font-display text-[clamp(36px,3.6vw,56px)] leading-none font-extrabold text-cobalt wdth-78">{value}</b>
                  <span className="text-[15px] text-ink-2">{label}</span>
                </div>
              ))}
            </div>
          </Row>
        </div>

        <div className={cx('flex flex-wrap gap-2.5 pt-2 pb-20', rise(0.32).className)} style={rise(0.32).style}>
          {project.github ? (
            <Button href={project.github} target="_blank" rel="noopener">
              View on GitHub
            </Button>
          ) : (
            <span className="inline-flex min-h-14 items-center rounded-full border border-dashed border-line-2 px-[22px] text-[15px] text-muted">
              Live / GitHub links — to be added
            </span>
          )}
          <button
            className="min-h-14 cursor-pointer rounded-full border border-line-2 bg-transparent px-[22px] font-semibold hover:bg-ink hover:text-on-dk"
            type="button"
            onClick={() => onNavigate(next.id)}
          >
            Next: {next.name} →
          </button>
        </div>
      </div>
    </>
  )
}

/**
 * Full-screen case study. Opening morphs the clicked tile into the page; closing shrinks it back.
 * `open` controls visibility/pointer-events, `shown` triggers the staggered content fade-in.
 */
export function CaseStudy({ caseId, fromTile, onClose, onNavigate }: Props) {
  const panel = useRef<HTMLDivElement>(null)
  const prevId = useRef<string | null>(null)
  const tile = useRef<HTMLElement | null>(null)
  const lastFocus = useRef<HTMLElement | null>(null)
  const timers = useRef<number[]>([])
  const generation = useRef(0)
  const [renderId, setRenderId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    tile.current = fromTile
  }, [fromTile])

  useEffect(() => {
    const prev = prevId.current
    prevId.current = caseId
    // Every transition bumps `gen`; callbacks from an older transition become no-ops.
    const gen = ++generation.current
    const current = () => gen === generation.current
    const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(() => current() && fn(), ms))
    const afterPaint = (fn: () => void) => nextFrame(() => current() && fn())
    const tileBg = () => (tile.current ? getComputedStyle(tile.current).backgroundColor : PAPER)

    if (caseId && !prev) {
      // open
      lastFocus.current = document.activeElement as HTMLElement | null
      setRenderId(caseId)
      const reveal = () => {
        if (!current()) return
        setOpen(true)
        if (panel.current) panel.current.scrollTop = 0
        afterPaint(() => setShown(true))
        later(() => panel.current?.focus(), 60)
      }
      const t = tile.current
      if (t && !REDUCED_MOTION) morph(boxOf(t, '26px'), fullscreenBox(), tileBg(), PAPER, reveal)
      else reveal()
    } else if (caseId && prev && caseId !== prev) {
      // switch project while open
      setShown(false)
      later(() => {
        setRenderId(caseId)
        if (panel.current) panel.current.scrollTop = 0
        afterPaint(() => setShown(true))
      }, 250)
    } else if (!caseId && prev) {
      // close
      setShown(false)
      setOpen(false)
      const restore = () => {
        lastFocus.current?.focus({ preventScroll: true })
        lastFocus.current = null
      }
      const t = tile.current
      if (t && !REDUCED_MOTION) morph(fullscreenBox(), boxOf(t, '26px'), PAPER, tileBg(), restore)
      else restore()
    }
  }, [caseId])

  useEffect(() => {
    const list = timers.current
    return () => list.forEach(window.clearTimeout)
  }, [])

  const project = PROJECTS.find((p) => p.id === renderId)

  return (
    <div
      className={cx(
        'fixed inset-0 z-100 flex transition-opacity duration-350',
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
      )}
      aria-hidden={!open}
    >
      <div
        ref={panel}
        className="relative h-svh w-full overflow-y-auto overscroll-contain bg-paper text-ink outline-0"
        role="dialog" aria-modal="true" aria-labelledby="cs-title" tabIndex={-1}>
        {project && <CaseContent project={project} shown={shown} onNavigate={onNavigate} onClose={onClose} />}
      </div>
    </div>
  )
}
