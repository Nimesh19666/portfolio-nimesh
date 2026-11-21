import { useRef, type MouseEvent } from 'react'
import { PROJECTS, type Project } from '@/data'
import { FINE_POINTER, REDUCED_MOTION } from '@/lib/env'
import { cx } from '@/lib/cx'
import { useApp } from '@/context/AppContext'
import { Accent, SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { ArrowUpRight } from '@/components/ui/Icons'
import { ProjectCover } from '@/components/art/ProjectCover'

/** Bento placement per tile (12-column grid; collapses on small screens). */
const CELL_CLASS = [
  'col-span-7 row-span-3 max-[1100px]:col-span-12',
  'col-span-5 row-span-2 max-[1100px]:col-span-6',
  'col-span-5 row-span-2 max-[1100px]:col-span-6',
  'col-span-4 row-span-2 max-[1100px]:col-span-6',
  'col-span-4 row-span-2 max-[1100px]:col-span-6',
  'col-span-4 row-span-2 max-[1100px]:col-span-12',
]
/** Each tile gets one oversized rounded corner on its cover. */
const COVER_CORNER = ['rounded-bl-[70px]', 'rounded-tr-[70px]', '', '', 'rounded-tl-[70px]', '']

function Tile({ project, index }: { project: Project; index: number }) {
  const { openCase } = useApp()
  const ref = useRef<HTMLButtonElement>(null)

  const tilt = (e: MouseEvent<HTMLButtonElement>) => {
    if (!FINE_POINTER || REDUCED_MOTION) return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--ry', `${(x - 0.5) * 6}deg`)
    el.style.setProperty('--rx', `${(0.5 - y) * 6}deg`)
    el.style.setProperty('--gx', `${x * 100}%`)
    el.style.setProperty('--gy', `${y * 100}%`)
  }
  const reset = () => {
    ref.current?.style.setProperty('--rx', '0deg')
    ref.current?.style.setProperty('--ry', '0deg')
  }

  return (
    <button
      ref={ref}
      type="button"
      data-id={project.id}
      data-cursor="tile"
      className={cx(
        'group relative flex size-full cursor-pointer flex-col overflow-hidden rounded-[26px] border p-0 text-left will-change-transform',
        '[transform:perspective(1000px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))_translateY(var(--ty,0px))]',
        'transition-[transform,box-shadow] duration-500 ease-out-expo hover:[--ty:-8px] focus-visible:[--ty:-8px]',
        'hover:shadow-[0_44px_70px_-36px_var(--color-shadow)] focus-visible:shadow-[0_44px_70px_-36px_var(--color-shadow)]',
        // soft cobalt spotlight that follows the pointer (--gx/--gy)
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-[radial-gradient(500px_circle_at_var(--gx,50%)_var(--gy,50%),rgba(43,59,245,.09),transparent_45%)] after:opacity-0 after:transition-opacity after:duration-400 after:content-[''] hover:after:opacity-100",
        project.dark ? 'border-dk bg-dk text-on-dk' : 'border-line bg-card text-ink',
      )}
      aria-label={`${project.name} — view case study`}
      onClick={() => openCase(project.id, ref.current)}
      onMouseMove={tilt}
      onMouseLeave={reset}
    >
      <span className="absolute top-[18px] left-5 z-4 rounded-full bg-white/90 px-2.5 py-[5px] font-mono text-xs font-medium text-ink">{String(index + 1).padStart(2, '0')}</span>
      <span className="absolute top-[18px] right-[18px] z-4 inline-flex -translate-y-2 items-center gap-2 rounded-full bg-cobalt px-[15px] py-[9px] text-[13px] font-semibold text-white opacity-0 transition duration-400 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        View case study <ArrowUpRight size={15} />
      </span>
      <div className={cx('relative mx-2 mt-2 min-h-[210px] flex-1 overflow-hidden rounded-[20px]', COVER_CORNER[index])}>
        <ProjectCover id={project.cover} className="gap-[9px] p-[22px] pt-[52px] transition-transform duration-800 ease-out-expo group-hover:scale-[1.045]" />
      </div>
      <div className="flex flex-col gap-2.5 px-[22px] pt-[18px] pb-[22px]">
        <div className="flex items-baseline justify-between gap-3">
          <h3
            className={cx(
              'm-0 font-display font-extrabold tracking-[-.01em] uppercase wdth-82',
              index === 0 ? 'text-[clamp(30px,2.8vw,42px)] leading-none' : 'text-2xl leading-none',
            )}
          >
            {project.name}
          </h3>
          <span className={cx('mono', project.dark && 'text-on-dk-2')}>{project.year}</span>
        </div>
        <p className={cx('m-0 text-[15px]', project.dark ? 'text-on-dk-2' : 'text-ink-2')}>{project.line}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <span key={t} className={cx('rounded-full border px-[11px] py-[5px] font-mono text-xs whitespace-nowrap', project.dark ? 'border-on-dk/25' : 'border-line-2')}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </button>
  )
}

export function Work() {
  return (
    <section className="band" id="work" aria-labelledby="work-h" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <SectionHeading label="02 / Selected work" id="work-h">
          Things I’ve <Accent>shipped.</Accent>
        </SectionHeading>
        <div className="grid auto-rows-[minmax(150px,auto)] grid-cols-12 gap-4 max-sm:grid-cols-1">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.id} className={cx(CELL_CLASS[i], 'max-sm:col-auto max-sm:row-auto')} delay={(i % 3) * 0.08}>
              <Tile project={p} index={i} />
            </Reveal>
          ))}
        </div>
        <p className="mt-[18px] text-[13px] text-muted">Covers are illustrated — real screenshots to be added. Click any project for the full case study.</p>
      </div>
    </section>
  )
}
