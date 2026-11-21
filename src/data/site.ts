export const SITE = {
  name: 'Nimesh Gujari',
  email: 'gujarinimesh@gmail.com',
  phone: '+91 91366 68654',
  phoneHref: 'tel:+919136668654',
  github: 'https://github.com/Nimesh19666',
  linkedin: 'https://linkedin.com/in/nimesh-gujari',
  paper:
    'https://www.researchgate.net/publication/390721885_AI-Generated-Image_Detection_Using_Deep_Learning_Techniques',
  timeZone: 'Asia/Kolkata',
} as const

export interface NavItem {
  id: string
  label: string
}

/** Desktop nav links (also used for scroll-spy). */
export const NAV_LINKS: NavItem[] = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'stack', label: 'Stack' },
]

/** Full-screen mobile menu. */
export const MENU_LINKS: NavItem[] = [...NAV_LINKS, { id: 'guestbook', label: 'Guestbook' }, { id: 'contact', label: 'Contact' }]

/** Scrolling marquee under the hero. */
export const MARQUEE_STACK = [
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'PostgreSQL',
  'Socket.io',
  'Tailwind',
  'TanStack Query',
  'Django REST',
  'AWS',
  'Dokploy',
  'Gemini API',
  'Python',
  'MongoDB',
]
