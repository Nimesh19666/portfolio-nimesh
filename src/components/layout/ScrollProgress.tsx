import { useRef } from 'react'
import { useScrollListener } from '@/hooks/useScrollListener'

/** 3px cobalt bar across the top that fills as you scroll. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)
  useScrollListener((y) => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    if (ref.current) ref.current.style.transform = `scaleX(${y / Math.max(1, max)})`
  })
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed top-0 left-0 z-80 h-[3px] w-full origin-left scale-x-0 bg-cobalt"
    />
  )
}
