import { useEffect, useState, type RefObject } from 'react'

interface Options extends IntersectionObserverInit {
  /** Stop observing after the first time the element is visible. */
  once?: boolean
}

/** Reports whether an element is intersecting the viewport. */
export function useInView<T extends Element>(ref: RefObject<T | null>, { once = false, ...init }: Options = {}) {
  const [inView, setInView] = useState(false)
  const { threshold, rootMargin, root } = init

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting && once) io.disconnect()
      },
      { threshold, rootMargin, root },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, once, threshold, rootMargin, root])

  return inView
}
