import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { EXPERIENCE, PROJECTS, SITE, SKILLS } from '@/data'
import { useApp } from '@/context/AppContext'

interface Entry {
  id: number
  command?: string
  output: ReactNode
}

const P = 'text-[#8E9AFF]'
const C = 'text-[#FF8C70]'
const D = 'text-[#8E8C99]'
const DOT = 'size-[11px] rounded-full bg-[#34343E] first:bg-coral'

const QUICK_COMMANDS = ['whoami', 'skills', 'projects', 'experience', 'contact', 'play', 'clear']

/** Interactive fake shell on the About section. */
export function Terminal() {
  const { openGame } = useApp()
  const outRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(0)
  const [input, setInput] = useState('')

  const commands: Record<string, () => ReactNode> = {
    help: () => (
      <>
        available:{' '}
        {['whoami', 'skills', 'projects', 'experience', 'contact', 'play', 'clear'].map((c) => (
          <span key={c}>
            <span className={C}>{c}</span>{' '}
          </span>
        ))}
      </>
    ),
    whoami: () =>
      `${SITE.name} — full stack developer, Mumbai.\n2.9 yrs · React · Next.js · Node.js · TypeScript · PostgreSQL\nNow: Full Stack Developer @ ET Edge (Times Group)`,
    skills: () =>
      Object.entries(SKILLS).map(([group, list]) => (
        <div key={group}>
          <span className={C}>{group.padEnd(12)}</span>
          {list.slice(0, 5).join(', ')}
          {list.length > 5 ? '…' : ''}
        </div>
      )),
    projects: () => (
      <>
        {PROJECTS.map((p, i) => (
          <div key={p.id}>
            <span className={D}>{String(i + 1).padStart(2, '0')}</span> {p.name}
          </div>
        ))}
        <span className={D}>→ open any tile in Selected work for the case study</span>
      </>
    ),
    experience: () =>
      EXPERIENCE.slice(0, 4).map((j) => (
        <div key={j.company}>
          <span className={C}>{j.dates}</span> {j.role} @ {j.company}
        </div>
      )),
    contact: () =>
      `email     ${SITE.email}\ngithub    ${SITE.github.replace('https://', '')}\nlinkedin  ${SITE.linkedin.replace('https://', '')}`,
    play: () => {
      window.setTimeout(openGame, 300)
      return (
        <>
          launching commit-snake… <span className={D}>(esc to quit)</span>
        </>
      )
    },
    snake: () => {
      window.setTimeout(openGame, 300)
      return 'launching commit-snake…'
    },
    sudo: () => 'nice try :)',
  }

  const evaluate = (raw: string): Entry | 'clear' | null => {
    const command = raw.trim().toLowerCase()
    if (!command) return null
    if (command === 'clear') return 'clear'
    const run = commands[command]
    const output = run ? (
      run()
    ) : (
      <>
        command not found: {command} — try <span className={C}>help</span>
      </>
    )
    return { id: nextId.current++, command, output }
  }

  const [entries, setEntries] = useState<Entry[]>(() => {
    const first = evaluate('whoami')
    return first && first !== 'clear' ? [first] : []
  })

  const run = (raw: string) => {
    const result = evaluate(raw)
    if (result === 'clear') setEntries([])
    else if (result) setEntries((prev) => [...prev, result])
  }

  useEffect(() => {
    const el = outRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [entries])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    run(input)
    setInput('')
  }

  return (
    <>
      <div className="flex items-center gap-[7px] border-b border-white/8 px-4 py-3.5">
        <i className={DOT} />
        <i className={DOT} />
        <i className={DOT} />
        <span className="ml-auto text-xs text-[#8E8C99]">nimesh@portfolio — zsh</span>
      </div>
      <div
        ref={outRef}
        data-native-scroll
        className="max-h-[300px] flex-1 overflow-y-auto px-[18px] pt-3.5 break-words whitespace-pre-wrap"
        aria-live="polite"
      >
        <span className={D}>Last login: today on ttys001 — Mumbai</span>
        {'\n'}
        {entries.map((e) => (
          <div key={e.id}>
            <div>
              <span className={P}>~ $</span> {e.command}
            </div>
            <div>{e.output}</div>
            <br />
          </div>
        ))}
      </div>
      <form className="flex items-center gap-2 px-[18px] pt-2" autoComplete="off" onSubmit={submit}>
        <label htmlFor="terminal-input" className={`whitespace-nowrap ${P}`}>~ $</label>
        <input
          id="terminal-input"
          className="min-h-9 flex-1 border-0 bg-transparent font-[inherit] text-base text-white caret-coral outline-0"
          type="text"
          spellCheck={false}
          placeholder="type help"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
      <div className="flex flex-wrap gap-1.5 px-[18px] pt-2.5">
        {QUICK_COMMANDS.map((c) => (
          <button
            key={c}
            type="button"
            className="min-h-8 cursor-pointer rounded-full border border-white/16 bg-transparent px-3 font-mono text-xs text-[#CFCDD8] hover:bg-white hover:text-ink"
            onClick={() => run(c)}
          >
            {c}
          </button>
        ))}
      </div>
    </>
  )
}
