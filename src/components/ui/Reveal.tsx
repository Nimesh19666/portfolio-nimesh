import { useRef, type CSSProperties, type ReactNode } from 'react'
import { cx } from '@/lib/cx'
import { useInView } from '@/hooks/useInView'

interface RevealProps {
  className?: string
  style?: CSSProperties
  /** seconds */
  delay?: number
  children: ReactNode
}

/** Fades and lifts its children into view the first time they scroll on screen. */
export function Reveal({ className, style, delay, children }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { once: true, threshold: 0.1, rootMargin: '0px 0px -6% 0px' })
  return (
    <div
      ref={ref}
      className={cx(
        'transition-[opacity,translate] duration-1000 ease-out-expo motion-reduce:translate-y-0 motion-reduce:opacity-100',
        seen ? 'translate-y-0 opacity-100' : 'translate-y-11 opacity-0',
        className,
      )}
      style={delay ? { transitionDelay: `${delay}s`, ...style } : style}
    >
      {children}
    </div>
  )
}
