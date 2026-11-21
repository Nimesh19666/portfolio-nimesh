import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { PROJECTS, SITE } from '@/data'
import { cx } from '@/lib/cx'
import { useApp } from '@/context/AppContext'
import { Search } from '@/components/ui/Icons'

const GROUP = 'px-3 pt-2.5 pb-1.5 font-mono text-[11px] text-muted'

interface PaletteAction {
  group: string
  name: string
  hint: string
  run?: () => void
  href?: string
}

const SECTIONS: [id: string, name: string][] = [
  ['top', 'Home'],
  ['about', 'About'],
  ['numbers', 'By the numbers'],
  ['work', 'Selected work'],
  ['experience', 'Experience'],
  ['stack', 'Stack'],
  ['guestbook', 'Guestbook'],
  ['contact', 'Contact'],
]

interface Props {
  open: boolean
  onClose: () => void
}

/** ⌘K / "/" launcher: jump to sections, open case studies, copy email, open links. */
export function CommandPalette({ open, onClose }: Props) {
  const { goToId, openCase, openGame, copyEmail, showToast } = useApp()
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)

  const actions = useMemo<PaletteAction[]>(
    () => [
      ...SECTIONS.map(([id, name]) => ({ group: 'Go to', name, hint: 'section', run: () => goToId(id) })),
      ...PROJECTS.map((p) => ({ group: 'Projects', name: p.name, hint: p.year, run: () => openCase(p.id) })),
      { group: 'Actions', name: 'Play Commit Snake', hint: 'game', run: openGame },
      { group: 'Actions', name: 'Copy email address', hint: SITE.email, run: () => void copyEmail() },
      { group: 'Actions', name: 'Download résumé', hint: 'pdf', run: () => showToast('Résumé PDF link coming soon — email me for a copy.') },
      { group: 'Links', name: 'GitHub — Nimesh19666', hint: '↗', href: SITE.github },
      { group: 'Links', name: 'LinkedIn — nimesh-gujari', hint: '↗', href: SITE.linkedin },
      { group: 'Links', name: 'Research paper — ResearchGate', hint: '↗', href: SITE.paper },
    ],
    [goToId, openCase, openGame, copyEmail, showToast],
  )

  const q = query.trim().toLowerCase()
  const items = actions.filter((a) => !q || `${a.name} ${a.group}`.toLowerCase().includes(q))
  const current = Math.min(selected, Math.max(0, items.length - 1))

  useEffect(() => {
    if (open) {
      returnFocus.current = document.activeElement as HTMLElement | null
      setQuery('')
      setSelected(0)
      const t = window.setTimeout(() => input.current?.focus(), 30)
      return () => window.clearTimeout(t)
    }
    returnFocus.current?.focus?.()
  }, [open])

  useEffect(() => {
    list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [current, items.length])

  const run = (i: number) => {
    const action = items[i]
    if (!action) return
    onClose()
    if (action.href) {
      if (!window.open(action.href, '_blank', 'noopener')) window.location.href = action.href
    } else {
      window.setTimeout(action.run!, 60)
    }
  }

  const onKey = (e: KeyboardEvent) => {
    const n = Math.max(1, items.length)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected((current + 1) % n)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected((current - 1 + n) % n)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(current)
    }
  }

  return (
    <div
      className={cx(
        'fixed inset-0 z-120 flex items-start justify-center bg-ink/35 px-4 pt-[14vh] pb-4 backdrop-blur-[6px] transition-opacity duration-250',
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
      )}
      aria-hidden={!open}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={cx(
          'w-[min(620px,100%)] overflow-hidden rounded-[22px] border border-line-2 bg-paper shadow-[0_40px_80px_-30px_rgba(0,0,0,.4)] transition-transform duration-300 ease-out-expo',
          open ? 'translate-y-0 scale-100' : '-translate-y-2.5 scale-[.98]',
        )}
        role="dialog" aria-modal="true" aria-label="Command menu">
        <div className="flex items-center gap-3 border-b border-line px-[18px] py-1.5">
          <Search />
          <input
            ref={input}
            className="min-h-14 flex-1 border-0 bg-transparent text-lg outline-0"
            type="text"
            placeholder="Jump to a section, project or action…"
            aria-label="Search commands"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelected(0)
            }}
            onKeyDown={onKey}
          />
        </div>
        <ul ref={list} data-native-scroll className="m-0 max-h-[min(420px,56vh)] list-none overflow-y-auto p-2" role="listbox">
          {items.length === 0 && <li className={GROUP}>No matches — try “work” or “email”</li>}
          {items.map((a, i) => (
            <li key={`${a.group}-${a.name}`} role="presentation">
              {(i === 0 || items[i - 1].group !== a.group) && (
                <div className={GROUP} role="presentation">
                  {a.group}
                </div>
              )}
              <button
                type="button"
                role="option"
                aria-selected={i === current}
                className={cx(
                  'flex min-h-12 w-full cursor-pointer items-center justify-between gap-3 rounded-xl border-0 px-3.5 text-left text-[15px] font-medium',
                  i === current ? 'bg-ink text-on-dk' : 'bg-transparent',
                )}
                onClick={() => run(i)}
              >
                <span>{a.name}</span>
                <span className={cx('font-mono text-xs', i === current ? 'text-on-dk-2' : 'text-muted')}>{a.hint}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-4 border-t border-line px-[18px] py-2.5 font-mono text-[11px] text-muted">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  )
}
