/** Syntax classes: k keyword · s string · f function · c comment · n number · '' plain */
export type TokenClass = 'k' | 's' | 'f' | 'c' | 'n' | ''
export type Token = readonly [cls: TokenClass, text: string]

export interface Snippet {
  tab: string
  path: string
  lines: Token[][]
}

export const SNIPPETS: Snippet[] = [
  {
    tab: 'chat.ts',
    path: '~/ilc-portal/server',
    lines: [
      [['c', '// real-time CEO-to-CEO messaging']],
      [['k', 'io'], ['', '.'], ['f', 'on'], ['', '('], ['s', '"connection"'], ['', ', (socket) => {']],
      [['', '  socket.'], ['f', 'on'], ['', '('], ['s', '"message:send"'], ['', ', '], ['k', 'async'], ['', ' (msg) => {']],
      [['', '    '], ['k', 'const'], ['', ' saved = '], ['k', 'await'], ['', ' db.messages.'], ['f', 'create'], ['', '(msg);']],
      [['', '    io.'], ['f', 'to'], ['', '(msg.room).'], ['f', 'emit'], ['', '('], ['s', '"message:new"'], ['', ', saved);']],
      [['', '    '], ['f', 'notify'], ['', '(msg.to, { ttl: '], ['n', '8000'], ['', ' });']],
      [['', '  });']],
      [['', '});']],
    ],
  },
  {
    tab: 'logout.ts',
    path: '~/ilc-portal/auth',
    lines: [
      [['c', '// revoke the session on logout']],
      [['k', 'export async function'], ['', ' '], ['f', 'logout'], ['', '(req, res) {']],
      [['', '  '], ['k', 'const'], ['', ' hash = '], ['f', 'sha256'], ['', '(req.token);']],
      [['', '  '], ['k', 'await'], ['', ' db.revoked.'], ['f', 'insert'], ['', '({ hash });']],
      [['', '  res.'], ['f', 'clearCookie'], ['', '('], ['s', '"session"'], ['', ');']],
      [['', '  '], ['k', 'return'], ['', ' res.'], ['f', 'json'], ['', '({ ok: '], ['n', 'true'], ['', ' });']],
      [['', '}']],
    ],
  },
  {
    tab: 'pipeline.py',
    path: '~/viral_shorts_bot',
    lines: [
      [['c', '# discover → analyze → generate → upload']],
      [['k', 'def'], ['', ' '], ['f', 'run'], ['', '(niche):']],
      [['', '    shorts = '], ['f', 'discover'], ['', '(niche, top='], ['n', '10'], ['', ')']],
      [['', '    hooks  = '], ['f', 'analyze'], ['', '(shorts)  '], ['c', '# Gemini → JSON']],
      [['', '    video  = '], ['f', 'generate'], ['', '(hooks)']],
      [['', '    '], ['f', 'upload'], ['', '(video, ai_disclosure='], ['n', 'True'], ['', ')']],
    ],
  },
]

/** Draggable tech chips floating around the hero code window. */
export interface ChipDef {
  name: string
  abbr: string
  color: string
  /** position in % of the visual container */
  x: number
  y: number
  dark?: boolean
}

export const HERO_CHIPS: ChipDef[] = [
  { name: 'React', abbr: 'RE', color: '#2B3BF5', x: 2, y: 8 },
  { name: 'Next.js', abbr: 'NX', color: '#111114', x: 62, y: 2, dark: true },
  { name: 'Node.js', abbr: 'NO', color: '#3C873A', x: 80, y: 30 },
  { name: 'TypeScript', abbr: 'TS', color: '#3178C6', x: -2, y: 64 },
  { name: 'PostgreSQL', abbr: 'PG', color: '#336791', x: 64, y: 86, dark: true },
  { name: 'Socket.io', abbr: 'IO', color: '#FF5A36', x: 28, y: 92 },
  { name: 'AWS', abbr: 'AW', color: '#FF9900', x: 86, y: 62 },
]
