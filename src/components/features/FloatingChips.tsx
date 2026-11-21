import { useRef, useState, type PointerEvent, type RefObject } from 'react'
import { HERO_CHIPS, type ChipDef } from '@/data'
import { cx } from '@/lib/cx'

interface ChipProps {
  chip: ChipDef
  index: number
  bounds: RefObject<HTMLElement | null>
}

function DraggableChip({ chip, index, bounds }: ChipProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const origin = useRef({ sx: 0, sy: 0, ox: 0, oy: 0 })

  const onDown = (e: PointerEvent<HTMLSpanElement>) => {
    const el = e.currentTarget
    el.setPointerCapture(e.pointerId)
    origin.current = { sx: e.clientX, sy: e.clientY, ox: el.offsetLeft, oy: el.offsetTop }
    setPos({ x: el.offsetLeft, y: el.offsetTop })
    setDragging(true)
    e.preventDefault()
  }

  const onMove = (e: PointerEvent<HTMLSpanElement>) => {
    if (!dragging || !bounds.current) return
    const box = bounds.current.getBoundingClientRect()
    const el = e.currentTarget
    const { sx, sy, ox, oy } = origin.current
    // let chips overhang the edges by 30px so they can tuck behind the code window
    const x = Math.max(-30, Math.min(box.width - el.offsetWidth + 30, ox + e.clientX - sx))
    const y = Math.max(-30, Math.min(box.height - el.offsetHeight + 30, oy + e.clientY - sy))
    setPos({ x, y })
  }

  const end = () => setDragging(false)

  return (
    <span
      data-cursor="drag"
      className={cx(
        'absolute z-3 inline-flex touch-none items-center gap-2 rounded-full border py-2.5 pr-4 pl-2.5 text-[15px] font-semibold select-none [@media(hover:hover)_and_(pointer:fine)]:cursor-grab',
        chip.dark ? 'border-dk bg-dk text-on-dk' : 'border-line bg-card',
        dragging
          ? 'z-5 animate-none cursor-grabbing! shadow-[0_30px_40px_-18px_var(--color-shadow)]'
          : 'animate-bob shadow-[0_14px_30px_-16px_var(--color-shadow)]',
      )}
      style={{
        left: pos ? pos.x : `${chip.x}%`,
        top: pos ? pos.y : `${chip.y}%`,
        animationDelay: `${-index * 0.8}s`,
      }}
      aria-hidden="true"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={end}
      onPointerCancel={end}
    >
      <i className="grid size-[26px] place-items-center rounded-full font-mono text-[10px] font-bold text-white not-italic" style={{ background: chip.color }}>{chip.abbr}</i>
      {chip.name}
    </span>
  )
}

/** Tech chips that float around the hero visual and can be dragged anywhere inside it. */
export function FloatingChips({ bounds }: { bounds: RefObject<HTMLElement | null> }) {
  return (
    <div>
      {HERO_CHIPS.map((chip, i) => (
        <DraggableChip key={chip.name} chip={chip} index={i} bounds={bounds} />
      ))}
    </div>
  )
}
