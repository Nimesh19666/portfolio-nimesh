import { useEffect, useState } from 'react'
import { REDUCED_MOTION } from '@/lib/env'

/** Shows `value`; each time `play` flips true it counts up from zero (ease-out cubic). */
export function CountUp({ value, play }: { value: string; play: boolean }) {
  const [text, setText] = useState(value)

  useEffect(() => {
    setText(value)
    if (!play || REDUCED_MOTION) return

    const to = parseFloat(value)
    const decimals = (value.split('.')[1] || '').length
    const t0 = performance.now()
    let raf = 0
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 1100)
      setText((to * (1 - Math.pow(1 - k, 3))).toFixed(decimals))
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value, play])

  return <span>{text}</span>
}
