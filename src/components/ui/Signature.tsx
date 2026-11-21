import type { Ref } from 'react'
import { SIGNATURE_FLOURISH, SIGNATURE_PATHS, SIGNATURE_VIEWBOX } from '@/data/signature'
import { cx } from '@/lib/cx'

interface Props {
  ref?: Ref<SVGSVGElement>
  /** Sizing classes, e.g. "w-[min(760px,88vw)]". */
  className?: string
  /** Stroke width class for the pen line while drawing. */
  stroke?: string
  /** Include the coral underline stroke (preloader). */
  flourish?: boolean
  /** Accessible name; omit to hide from assistive tech. */
  label?: string
}

/**
 * The signature. Strokes are drawn in by lib/signature.ts, which then sets `data-filled`
 * on the <svg> so the letterforms fade from outline to solid.
 */
export function Signature({ ref, className, stroke = 'stroke-7', flourish = false, label }: Props) {
  return (
    <svg
      ref={ref}
      className={cx('group h-auto overflow-visible', className)}
      viewBox={SIGNATURE_VIEWBOX}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      {SIGNATURE_PATHS.map((d, i) => (
        <path
          key={i}
          d={d}
          className={cx(
            'fill-transparent stroke-current transition-[fill] duration-700 [stroke-linecap:round] [stroke-linejoin:round] group-data-filled:fill-current',
            stroke,
          )}
        />
      ))}
      {flourish && <path d={SIGNATURE_FLOURISH} className="fill-none stroke-coral stroke-14 [stroke-linecap:round] [stroke-linejoin:round]" />}
    </svg>
  )
}
