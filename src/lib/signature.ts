import { REDUCED_MOTION } from './env'

/** Hide every stroke so the signature can be drawn in later. */
export function prepareSignature(svg: SVGSVGElement) {
  svg.querySelectorAll('path').forEach((p) => {
    const len = p.getTotalLength()
    p.style.strokeDasharray = `${len}`
    p.style.strokeDashoffset = `${len}`
  })
}

/**
 * Animate each stroke in sequence, then fill the letterforms.
 * Returns a cancel function.
 */
export function drawSignature(svg: SVGSVGElement, duration: number, onDone?: () => void) {
  const paths = [...svg.querySelectorAll('path')]
  const lengths = paths.map((p) => p.getTotalLength())
  const total = lengths.reduce((a, b) => a + b, 0)

  paths.forEach((p, i) => {
    p.style.strokeDasharray = `${lengths[i]}`
    p.style.strokeDashoffset = `${lengths[i]}`
  })

  if (REDUCED_MOTION || !paths[0]?.animate) {
    paths.forEach((p) => (p.style.strokeDashoffset = '0'))
    svg.setAttribute('data-filled', '')
    onDone?.()
    return () => {}
  }

  let acc = 0
  const animations = paths.map((p, i) => {
    const d = (duration * lengths[i]) / total
    const a = p.animate([{ strokeDashoffset: lengths[i] }, { strokeDashoffset: 0 }], {
      duration: d,
      delay: acc,
      easing: 'cubic-bezier(.45,.05,.35,1)',
      fill: 'forwards',
    })
    acc += d * 0.82
    return a
  })
  const timer = window.setTimeout(() => {
    svg.setAttribute('data-filled', '')
    onDone?.()
  }, acc + 250)

  return () => {
    window.clearTimeout(timer)
    animations.forEach((a) => a.cancel())
  }
}
