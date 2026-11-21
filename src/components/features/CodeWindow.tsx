import { Fragment, useEffect, useMemo, useState, type ReactNode, type Ref } from 'react'
import { SNIPPETS, type Snippet, type TokenClass } from '@/data'
import { REDUCED_MOTION } from '@/lib/env'
import { cx } from '@/lib/cx'

const TOKEN_STYLE: Record<TokenClass, string> = {
  k: 'text-[#8E9AFF]',
  s: 'text-[#9BE9A8]',
  f: 'text-[#FFB199]',
  c: 'text-[#6B6A76] italic',
  n: 'text-[#F4D58D]',
  '': '',
}

/** Render the first `count` characters of a snippet (each line break counts as one). */
function renderTyped(snippet: Snippet, count: number): ReactNode[] {
  let left = count
  const out: ReactNode[] = []
  snippet.lines.forEach((line, li) => {
    if (left < 0) return
    const parts: ReactNode[] = [
      <span className="inline-block w-[2.2em] text-[#55545F] select-none max-sm:w-[1.8em]" key="n">
        {li + 1}
      </span>,
    ]
    line.forEach(([cls, text], ti) => {
      if (left <= 0) return
      const part = text.slice(0, left)
      left -= text.length
      parts.push(
        cls ? (
          <span key={ti} className={TOKEN_STYLE[cls]}>
            {part}
          </span>
        ) : (
          part
        ),
      )
    })
    if (left >= 0) {
      parts.push('\n')
      left -= 1
    }
    out.push(<Fragment key={li}>{parts}</Fragment>)
  })
  return out
}

interface Props {
  /** Start typing (false while the preloader is up). */
  active: boolean
  ref?: Ref<HTMLDivElement>
}

/** Fake editor that "types" the project snippets in a loop. */
export function CodeWindow({ active, ref }: Props) {
  const [index, setIndex] = useState(0)
  const [count, setCount] = useState(0)
  const [shipped, setShipped] = useState(false)

  const snippet = SNIPPETS[index]
  const total = useMemo(() => snippet.lines.reduce((a, l) => a + l.reduce((b, [, t]) => b + t.length, 0) + 1, 0), [snippet])

  useEffect(() => {
    if (!active) return
    if (REDUCED_MOTION) {
      setCount(total)
      setShipped(true)
      return
    }
    setCount(0)
    setShipped(false)
    let n = 0
    let timer = 0
    const step = () => {
      n += 1 + Math.floor(Math.random() * 2)
      setCount(n)
      if (n < total) {
        timer = window.setTimeout(step, 26 + Math.random() * 40)
      } else {
        setShipped(true)
        timer = window.setTimeout(() => setIndex((i) => (i + 1) % SNIPPETS.length), 3200)
      }
    }
    step()
    return () => window.clearTimeout(timer)
  }, [active, index, total])

  return (
    <div ref={ref} className="absolute top-1/2 right-[4%] left-[6%] -translate-y-1/2 overflow-hidden rounded-3xl bg-dk text-[#E6E5EE] shadow-[0_50px_80px_-40px_rgba(17,17,20,.55)] transition-transform duration-800 ease-out-expo [transform:perspective(1200px)_rotateY(var(--ry,-6deg))_rotateX(var(--rx,4deg))] max-[900px]:right-0 max-[900px]:left-0"
      role="img" aria-label="Code editor showing example code">
      <div className="flex items-center gap-[7px] border-b border-white/8 px-4 py-3.5">
        {[0, 1, 2].map((i) => (
          <i key={i} className={cx('size-[11px] rounded-full', i === 0 ? 'bg-coral' : 'bg-[#34343E]')} />
        ))}
        <div className="ml-3 flex gap-1">
          {SNIPPETS.map((s, i) => (
            <span
              key={s.tab}
              className={cx(
                'rounded-lg px-2.5 py-[5px] font-mono text-xs',
                i === index ? 'bg-white/8 text-white' : 'text-[#8E8C99]',
                i === 1 && 'max-sm:hidden',
              )}
            >
              {s.tab}
            </span>
          ))}
        </div>
      </div>
      <pre
        className="m-0 min-h-[236px] overflow-hidden px-5 pt-[18px] pb-2 font-mono text-[13.5px] leading-[1.75] whitespace-pre max-sm:min-h-[210px] max-sm:px-3 max-sm:pt-3.5 max-sm:pb-1.5 max-sm:text-[11.5px]"
        aria-hidden="true"
      >
        {renderTyped(snippet, count)}
        <span className="inline-block h-[1.15em] w-2 animate-blink bg-coral align-[-3px]" />
      </pre>
      <div className="flex items-center justify-between gap-3 border-t border-white/8 px-[18px] py-3 font-mono text-xs text-[#8E8C99]">
        <span>{snippet.path}</span>
        <span
          className={cx(
            'inline-flex items-center gap-2 rounded-full bg-[rgba(59,227,122,.12)] px-2.5 py-[5px] text-[#7BEFA2] transition duration-400',
            shipped ? 'opacity-100' : 'translate-y-1.5 opacity-0',
          )}
        >● deployed · dokploy/prod</span>
      </div>
    </div>
  )
}
