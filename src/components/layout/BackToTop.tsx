import { useRef, useState } from 'react'
import { cx } from '@/lib/cx'
import { useScrollListener } from '@/hooks/useScrollListener'
import { useApp } from '@/context/AppContext'
import { ArrowUp } from '@/components/ui/Icons'

const RADIUS = 31
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/** Floating button with a progress ring; appears after the first screen. */
export function BackToTop() {
  const { goTo } = useApp()
  const ring = useRef<SVGCircleElement>(null)
  const [show, setShow] = useState(false)

  useScrollListener((y) => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    if (ring.current) ring.current.style.strokeDashoffset = `${CIRCUMFERENCE * (1 - y / Math.max(1, max))}`
    setShow(y > 700)
  })

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => goTo(0)}
      className={cx(
        'totop fixed right-3.5 bottom-3.5 z-58 grid size-[58px] cursor-pointer place-items-center rounded-full border-0 bg-ink text-on-dk transition-[opacity,transform] duration-350 ease-out-expo sm:right-5 sm:bottom-5',
        show ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-4 scale-90 opacity-0',
      )}
    >
      <svg className="absolute -inset-1 size-[66px] -rotate-90" viewBox="0 0 66 66" aria-hidden="true">
        <circle
          ref={ring}
          cx="33"
          cy="33"
          r={RADIUS}
          fill="none"
          stroke="var(--color-cobalt)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
        />
      </svg>
      <ArrowUp />
    </button>
  )
}
