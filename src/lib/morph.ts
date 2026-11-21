export interface MorphBox {
  left: number
  top: number
  width: number
  height: number
  /** CSS border-radius */
  radius: string
}

export const boxOf = (el: Element, radius: string): MorphBox => {
  const r = el.getBoundingClientRect()
  return { left: r.left, top: r.top, width: r.width, height: r.height, radius }
}

export const fullscreenBox = (): MorphBox => ({ left: 0, top: 0, width: innerWidth, height: innerHeight, radius: '0px' })

const px = (b: MorphBox) => ({ left: `${b.left}px`, top: `${b.top}px`, width: `${b.width}px`, height: `${b.height}px`, borderRadius: b.radius })

/** Animate a throwaway fixed rectangle from one box/colour to another (tile ⇄ full-screen page). */
export function morph(from: MorphBox, to: MorphBox, fromColor: string, toColor: string, onDone?: () => void) {
  const el = document.createElement('div')
  el.className = 'pointer-events-none fixed z-99'
  document.body.appendChild(el)
  const anim = el.animate(
    [
      { ...px(from), backgroundColor: fromColor },
      { ...px(to), backgroundColor: toColor },
    ],
    { duration: 650, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'forwards' },
  )
  anim.onfinish = () => {
    onDone?.()
    window.setTimeout(() => el.remove(), 380)
  }
}
