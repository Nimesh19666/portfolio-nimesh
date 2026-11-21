export type PosterArtId = 'waves' | 'shops' | 'ecg' | 'browsers' | 'net'

export interface ExperienceEntry {
  role: string
  company: string
  where: string
  dates: string
  /** `**bold**` markers are rendered as <strong>. */
  points: string[]
  link?: string
  poster: {
    bg: string
    fg: string
    art: PosterArtId
    short: string
    meta: [string, string]
  }
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    role: 'Full Stack Developer',
    company: 'ET Edge (Times Group)',
    where: 'Mumbai',
    dates: 'Apr 2026 — Present',
    points: [
      'Built the **India Leadership Council’s invite-only CEO portal** end-to-end and own its deployment on a Dokploy VPS behind Traefik, AWS S3 and EC2.',
      'Built **real-time CEO-to-CEO messaging** with Socket.io — live notifications, unread counts, deep links and S3 attachments.',
      '**Hardened auth** — JWT revocation, bcrypt, OTP rate limiting, RBAC and a nightly expired-token purge.',
      'Built the **FBES jury platform** — 16 voting units, Gemini analysis, tie detection; fixed a SQL bug inflating votes 9×.',
      'Contributed to the events admin platform and built a **PIN-protected QR scanner** for event check-in.',
    ],
    poster: { bg: '#2B3BF5', fg: '#fff', art: 'waves', short: 'ET Edge', meta: ['Exp 01', 'Times Group'] },
  },
  {
    role: 'Frontend Developer, later Full Stack',
    company: 'Kayana World Ltd.',
    where: 'Mumbai',
    dates: 'Dec 2024 — Apr 2026',
    points: [
      'Built a **white-label multi-tenant ordering platform** and deployed 20+ branded production storefronts.',
      'Rebuilt the **Partner Admin Panel** in React, used by 50+ restaurant partners.',
      'Fixed slow dashboards with request caching and React memoization.',
      'Built a **gym management & booking platform** — memberships, scheduling, bookings and payments.',
    ],
    poster: { bg: '#FF5A36', fg: '#111114', art: 'shops', short: 'Kayana World', meta: ['Exp 02', 'Mumbai'] },
  },
  {
    role: 'Software Developer Intern',
    company: 'Acuradyne Systems (IIT Bombay)',
    where: 'Mumbai',
    dates: 'Jul 2024 — Oct 2024',
    points: [
      'Built real-time cardiac dashboards on AWS that cut manual diagnosis time by **60%**; designed the MySQL schema and deployed with CI/CD behind Nginx.',
    ],
    poster: { bg: '#111114', fg: '#F4F2EE', art: 'ecg', short: 'Acuradyne', meta: ['Exp 03', 'IIT Bombay'] },
  },
  {
    role: 'Full Stack Developer (Freelance)',
    company: 'House of Couton',
    where: 'Mumbai',
    dates: 'Dec 2023 — Jun 2024',
    points: [
      'Delivered **5+ client websites** — e-commerce, portfolios, landing pages — with React, Next.js and Node.js/Express on MongoDB and PostgreSQL, hosted on Vercel and Hostinger.',
    ],
    poster: { bg: '#FFE58A', fg: '#111114', art: 'browsers', short: 'House of Couton', meta: ['Exp 04', 'Freelance'] },
  },
  {
    role: 'Research paper — AI-Generated Image Detection',
    company: 'IJARSCT',
    where: 'Published',
    dates: '2025',
    points: ['A **CNN ensemble** for detecting AI-generated images.', '**94%** accuracy and **0.991** ROC-AUC.'],
    link: 'https://www.researchgate.net/publication/390721885_AI-Generated-Image_Detection_Using_Deep_Learning_Techniques',
    poster: { bg: '#FFB3CF', fg: '#111114', art: 'net', short: 'IJARSCT Paper', meta: ['Research', '2025'] },
  },
]
