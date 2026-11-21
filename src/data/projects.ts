export type CoverId = 'chat' | 'jury' | 'artha' | 'shorts' | 'tenants' | 'ecg'

export interface Project {
  id: string
  cover: CoverId
  dark?: boolean
  name: string
  org: string
  year: string
  line: string
  tags: string[]
  problem: string
  role: string
  stack: string[]
  features: string[]
  metrics: [value: string, label: string][]
  github?: string
}

export const PROJECTS: Project[] = [
  {
    id: 'ilc',
    cover: 'chat',
    dark: true,
    name: 'ILC Member Portal',
    org: 'ET Edge (Times Group)',
    year: '2026',
    line: 'The India Leadership Council’s invite-only CEO portal, with real-time CEO-to-CEO messaging.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Socket.io'],
    problem:
      'The India Leadership Council needed an invite-only member portal where CEOs could connect and message each other privately and securely.',
    role: 'Built it end-to-end and own its deployment — frontend, backend, auth, real-time messaging and infrastructure.',
    stack: ['React', 'Vite', 'Tailwind', 'Node.js', 'Express', 'PostgreSQL', 'Socket.io', 'AWS S3', 'AWS EC2', 'Dokploy VPS', 'Traefik'],
    features: [
      'Real-time CEO-to-CEO messaging with Socket.io: live notifications, unread counts and deep links',
      'AWS S3 file attachments with MIME-type validation',
      'JWT revocation on logout and password change, bcrypt hashing and role-based access control',
      'OTP rate limiting (3 attempts per 15 min) and a nightly job that purges expired tokens',
      'Auto-deploying dev/prod branches on a Dokploy VPS behind Traefik, with startup migrations',
    ],
    metrics: [
      ['3 / 15 min', 'OTP attempt limit'],
      ['2', 'auto-deploying environments (dev + prod)'],
    ],
  },
  {
    id: 'fbes',
    cover: 'jury',
    name: 'FBES Jury Platform',
    org: 'ET NOW · ET Edge',
    year: '2026',
    line: 'Live jury scoring for the ET NOW Family Business Excellence Summit.',
    tags: ['Socket.io', 'Gemini', 'SQL'],
    problem:
      'The ET NOW Family Business Excellence Summit needed a jury platform with live scoring across many voting units and reliable tie handling.',
    role: 'Built the jury platform.',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Socket.io', 'Gemini API'],
    features: [
      'Live scoring across 16 voting units',
      'Gemini-powered nomination analysis',
      'Automatic tie detection',
      'Found and fixed a SQL bug that inflated vote counts 9×',
    ],
    metrics: [
      ['16', 'voting units scored live'],
      ['9×', 'vote inflation found and fixed'],
    ],
  },
  {
    id: 'artha',
    cover: 'artha',
    name: 'ArthaTech Film Budgets',
    org: 'Product',
    year: 'Project',
    line: 'Offline-first app for film production houses to record and audit daily shoot spending.',
    tags: ['React 18', 'Django REST', 'PostgreSQL', 'AWS S3'],
    problem:
      'Film production houses tracked daily shoot spending — crew attendance, vehicles, expenses, cash vouchers and bills — on paper dockets, where mistakes surfaced weeks later.',
    role: 'Built the web app.',
    stack: ['React 18', 'Vite', 'Tailwind', 'Django REST', 'PostgreSQL (Neon)', 'AWS S3'],
    features: [
      'Auditor → Head Auditor sign-off workflow: approve, reject or send back for recheck, with review history and day locking',
      '9 roles across houses and projects with permission-driven screens',
      'Offline-first: edits save on the device and sync when signal returns',
      'S3 bill uploads with 5-minute expiring links',
      'Excel reports with 6 sheets covering up to 92 days',
    ],
    metrics: [
      ['9', 'roles with permission-driven screens'],
      ['6', 'sheets per Excel report'],
      ['92', 'days per report, max'],
    ],
  },
  {
    id: 'shorts',
    cover: 'shorts',
    name: 'AI Shorts Pipeline',
    org: 'Side project',
    year: 'Project',
    line: 'A 4-stage pipeline that studies viral Shorts and publishes new ones, unattended.',
    tags: ['Python', 'Gemini 2.5 Flash', 'ElevenLabs', 'MoviePy'],
    problem: 'Producing short-form video consistently is slow: finding what works in a niche, scripting, voicing, editing and uploading.',
    role: 'Built the full pipeline.',
    stack: ['Python', 'Gemini 2.5 Flash', 'ElevenLabs', 'YouTube Data API', 'MoviePy', 'OAuth'],
    features: [
      'Finds the most-viewed recent Shorts in a niche',
      'Uses Gemini video understanding to extract the hook, pacing and emotional trigger as structured JSON',
      'Writes a new 45–60 second script, title and tags',
      'Voices it with ElevenLabs and renders a 1080×1920 video with MoviePy',
      'Auto-uploads via the YouTube API with OAuth and the AI-content disclosure flag, every 6 hours',
    ],
    metrics: [
      ['4', 'automated stages'],
      ['6 h', 'between unattended runs'],
    ],
    github: 'https://github.com/Nimesh19666/viral_shorts_bot',
  },
  {
    id: 'tenant',
    cover: 'tenants',
    name: 'White-Label Ordering',
    org: 'Kayana World',
    year: '2024–26',
    line: 'One codebase, 20+ branded production storefronts.',
    tags: ['React', 'Multi-tenant'],
    problem: 'Restaurant brands each needed their own branded online-ordering storefront without a separate codebase per client.',
    role: 'Built the white-label multi-tenant platform and deployed the storefronts.',
    stack: ['React', 'Node.js', 'REST APIs'],
    features: [
      'Online ordering and cart management',
      'Per-tenant branding from a single codebase',
      'Partner Admin Panel rebuilt in React — menus, orders, analytics, company profiles — used by 50+ restaurant partners',
      'Request caching and React memoization to fix slow dashboards',
    ],
    metrics: [
      ['20+', 'branded production storefronts'],
      ['50+', 'restaurant partners on the admin panel'],
    ],
  },
  {
    id: 'cardiac',
    cover: 'ecg',
    dark: true,
    name: 'Cardiac Dashboards',
    org: 'Acuradyne Systems (IIT Bombay)',
    year: '2024',
    line: 'Real-time cardiac data dashboards on AWS.',
    tags: ['Python', 'Dash', 'Plotly'],
    problem: 'Manual diagnosis from cardiac data took too long.',
    role: 'Software developer intern — built the dashboards, designed the MySQL schema and deployed them.',
    stack: ['Python', 'Dash', 'Plotly', 'MySQL', 'AWS', 'Nginx', 'CI/CD'],
    features: ['Real-time cardiac data dashboards', 'MySQL schema design', 'CI/CD deployment behind Nginx'],
    metrics: [['60%', 'less manual diagnosis time']],
  },
]
