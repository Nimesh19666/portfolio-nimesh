import { cx } from '@/lib/cx'

export function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cx(
        'pointer-events-none fixed bottom-7 left-1/2 z-160 max-w-[calc(100vw-32px)] -translate-x-1/2 rounded-full bg-ink px-[18px] py-3 text-center text-sm font-semibold text-on-dk transition-[opacity,transform] duration-350',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0',
      )}
    >
      {message}
    </div>
  )
}
