import { useMemo, useRef, useState } from 'react'
import { REDUCED_MOTION } from '@/lib/env'
import { cx } from '@/lib/cx'
import { useScrollListener } from '@/hooks/useScrollListener'

/**
 * A paragraph whose words light up as it scrolls into view.
 * Wrap a word in *asterisks* to highlight it in cobalt.
 */
export function ScrollStory({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const words = useMemo(
    () => text.trim().split(/\s+/).map((w) => ({ text: w.replace(/\*/g, ''), highlight: w.includes('*') })),
    [text],
  )
  const [lit, setLit] = useState(REDUCED_MOTION ? words.length : 0)

  useScrollListener(() => {
    if (REDUCED_MOTION || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const q = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.3)))
    setLit(Math.round(q * words.length))
  })

  return (
    <p ref={ref} className="mb-14 max-w-[1120px] font-display text-[clamp(28px,3.2vw,48px)] leading-[1.16] font-medium tracking-[-.02em] wdth-96">
      {words.map((w, i) => (
        <span key={i}>
          <span className={cx('transition-opacity duration-300', i < lit ? 'opacity-100' : 'opacity-[.14]', w.highlight && 'text-cobalt')}>
            {w.text}
          </span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </p>
  )
}
