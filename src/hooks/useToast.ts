import { useCallback, useEffect, useRef, useState } from 'react'

/** Transient message pill. `show()` replaces any message already on screen. */
export function useToast(duration = 2600) {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)
  const timer = useRef<number>(0)

  const show = useCallback(
    (text: string) => {
      setMessage(text)
      setVisible(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setVisible(false), duration)
    },
    [duration],
  )

  useEffect(() => () => window.clearTimeout(timer.current), [])
  return { message, visible, show }
}
