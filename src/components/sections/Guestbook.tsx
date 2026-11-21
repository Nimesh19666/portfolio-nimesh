import { useRef, useState, type FormEvent, type PointerEvent, type RefObject } from 'react'
import { cx } from '@/lib/cx'
import { useApp } from '@/context/AppContext'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Accent, SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import { Plus } from '@/components/ui/Icons'

const FIELD = 'min-h-[52px] rounded-[14px] border border-line-2 bg-card px-4 text-base outline-0 focus:border-cobalt'

interface Note {
  id: string
  text: string
  name: string
  color: string
  /** position in % of the board */
  x: number
  y: number
  /** degrees */
  rotation: number
  /** created by this visitor → can be deleted */
  own: boolean
}

const COLORS = ['#FFE58A', '#C9D0FF', '#FFC2B3', '#C8F2D4']

const SEED_NOTES: Note[] = [
  { id: 'n0', text: 'Hey, thanks for stopping by! Pin a note and drag it anywhere.', name: 'Nimesh', color: COLORS[0], x: 6, y: 10, rotation: -4, own: false },
  { id: 'n1', text: 'Hiring or have a project in mind? The form below writes the email for you.', name: 'Nimesh', color: COLORS[1], x: 54, y: 40, rotation: 3, own: false },
]

const isNotes = (v: unknown): v is Note[] =>
  Array.isArray(v) && v.every((n) => n && typeof n.id === 'string' && typeof n.text === 'string' && typeof n.x === 'number')

interface CardProps {
  note: Note
  board: RefObject<HTMLDivElement | null>
  popped: boolean
  onDrop: (id: string, x: number, y: number) => void
  onDelete: (id: string) => void
}

function NoteCard({ note, board, popped, onDrop, onDelete }: CardProps) {
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null)
  const origin = useRef({ sx: 0, sy: 0, ox: 0, oy: 0 })
  const last = useRef({ x: 0, y: 0 })

  const down = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest('[data-delete]')) return
    const el = e.currentTarget
    el.setPointerCapture(e.pointerId)
    origin.current = { sx: e.clientX, sy: e.clientY, ox: el.offsetLeft, oy: el.offsetTop }
    last.current = { x: el.offsetLeft, y: el.offsetTop }
    setDrag(last.current)
  }
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag || !board.current) return
    const el = e.currentTarget
    const { sx, sy, ox, oy } = origin.current
    last.current = {
      x: Math.max(0, Math.min(board.current.clientWidth - el.offsetWidth, ox + e.clientX - sx)),
      y: Math.max(0, Math.min(board.current.clientHeight - el.offsetHeight, oy + e.clientY - sy)),
    }
    setDrag(last.current)
  }
  const up = () => {
    if (!drag || !board.current) return
    setDrag(null)
    onDrop(note.id, (last.current.x / board.current.clientWidth) * 100, (last.current.y / board.current.clientHeight) * 100)
  }

  return (
    <div
      data-cursor="drag"
      className={cx(
        'absolute flex min-h-[150px] w-[190px] touch-none flex-col justify-between gap-3 rounded-tl-md rounded-tr-md rounded-br-[18px] rounded-bl-md p-4 pb-3.5 text-[15px] leading-[1.35] text-ink select-none transition-[box-shadow,scale] duration-300 max-sm:min-h-[130px] max-sm:w-40',
        drag ? 'z-20 scale-[1.04] cursor-grabbing shadow-[0_30px_40px_-18px_rgba(17,17,20,.5)]' : 'cursor-grab shadow-[0_18px_28px_-18px_rgba(17,17,20,.45)]',
        popped && 'animate-drop',
      )}
      style={{
        left: drag ? drag.x : `${note.x}%`,
        top: drag ? drag.y : `${note.y}%`,
        background: note.color,
        rotate: `${note.rotation}deg`,
      }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
    >
      <p className="m-0 font-sans text-[17px] leading-[1.3] font-medium break-words">{note.text}</p>
      <div className="flex items-center justify-between font-mono text-[11px] text-ink/62">
        <span>— {note.name || 'Anonymous'}</span>
        {note.own && (
          <button
            data-delete
            className="grid size-7 cursor-pointer place-items-center rounded-full border-0 bg-ink/8 p-0"
            type="button"
            aria-label="Delete note" onClick={() => onDelete(note.id)}>
            ×
          </button>
        )}
      </div>
    </div>
  )
}

/** Sticky-note board; notes are draggable and saved in the visitor's browser only. */
export function Guestbook() {
  const { showToast } = useApp()
  const board = useRef<HTMLDivElement>(null)
  const textInput = useRef<HTMLInputElement>(null)
  const [notes, setNotes] = useLocalStorage<Note[]>('portfolio:guestbook', SEED_NOTES, isNotes)
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [color, setColor] = useState(COLORS[0])
  const [justAdded, setJustAdded] = useState<string | null>(null)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) {
      textInput.current?.focus()
      return
    }
    const id = `n${Date.now()}`
    setNotes((prev) => [
      ...prev,
      {
        id,
        text: trimmed,
        name: name.trim(),
        color,
        x: 8 + Math.random() * 60,
        y: 8 + Math.random() * 50,
        rotation: Math.round(Math.random() * 10 - 5),
        own: true,
      },
    ])
    setJustAdded(id)
    setText('')
    showToast('Note pinned to the board')
  }

  /** Dropped notes move to the end of the list so they stack on top. */
  const drop = (id: string, x: number, y: number) =>
    setNotes((prev) => {
      const note = prev.find((n) => n.id === id)
      return note ? [...prev.filter((n) => n.id !== id), { ...note, x, y }] : prev
    })

  return (
    <section className="band" id="guestbook" aria-labelledby="gb-h" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <SectionHeading label="05 / Guestbook" id="gb-h">
          Leave a <Accent>note.</Accent>
        </SectionHeading>
        <div>
          <Reveal>
            <div
              ref={board}
              className="relative h-[520px] overflow-hidden rounded-[28px] border border-line bg-card bg-[radial-gradient(var(--color-line-2)_1px,transparent_1px)] [background-size:22px_22px] max-sm:h-[560px]" aria-label="Guestbook board — drag notes to move them">
              {notes.map((n) => (
                <NoteCard
                  key={n.id}
                  note={n}
                  board={board}
                  popped={n.id === justAdded}
                  onDrop={drop}
                  onDelete={(id) => setNotes((prev) => prev.filter((x) => x.id !== id))}
                />
              ))}
            </div>
            <form
              className="mt-4 grid grid-cols-[minmax(0,1fr)_minmax(0,200px)_auto_auto] items-center gap-2.5 max-[900px]:grid-cols-2 max-sm:grid-cols-1"
              autoComplete="off"
              onSubmit={submit}
            >
              <input
                ref={textInput}
                className={`${FIELD} max-[900px]:col-span-full`}
                type="text"
                maxLength={90}
                placeholder="Write something nice…"
                aria-label="Your note"
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <input className={FIELD} type="text" maxLength={24} placeholder="Your name (optional)" aria-label="Your name" value={name} onChange={(e) => setName(e.target.value)} />
              <div className="flex gap-1.5 max-sm:justify-start" role="group" aria-label="Note colour">
                {COLORS.map((c, i) => (
                  <button
                    key={c}
                    type="button"
                    className="size-8 cursor-pointer rounded-full border-2 border-transparent p-0 outline-offset-2 aria-pressed:border-ink"
                    style={{ background: c }} aria-label={`Colour ${i + 1}`} aria-pressed={c === color} onClick={() => setColor(c)} />
                ))}
              </div>
              <Button type="submit" arrow={<Plus size={14} />}>
                Pin it
              </Button>
            </form>
            <p className="mt-3 text-[13px] text-muted">Drag any note around the board. Notes are saved in your browser only.</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
