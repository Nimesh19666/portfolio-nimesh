export type NumberArtId = 'years' | 'stores' | 'partners' | 'votes' | 'bug' | 'ecg' | 'gauge'

export interface KeyNumber {
  value: string
  unit: string
  title: string
  blurb: string
  art: NumberArtId
  source: string
  /** card background */
  bg: string
  /** card text colour */
  fg: string
  /** accent colour for the unit */
  accent: string
}

export const KEY_NUMBERS: KeyNumber[] = [
  { value: '2.9', unit: 'y', title: 'Years shipping', blurb: 'Production web apps, end-to-end.', art: 'years', source: 'Dec 2023 → now', bg: '#2B3BF5', fg: '#fff', accent: '#FFE58A' },
  { value: '20', unit: '+', title: 'Live storefronts', blurb: 'One multi-tenant codebase.', art: 'stores', source: 'Kayana World', bg: '#FF5A36', fg: '#111114', accent: '#fff' },
  { value: '50', unit: '+', title: 'Restaurant partners', blurb: 'On the admin panel I rebuilt.', art: 'partners', source: 'Kayana World', bg: '#FFE58A', fg: '#111114', accent: '#FF5A36' },
  { value: '16', unit: '', title: 'Voting units', blurb: 'Scored live at the FBES awards.', art: 'votes', source: 'ET NOW · FBES', bg: '#111114', fg: '#F4F2EE', accent: '#FF5A36' },
  { value: '9', unit: '×', title: 'Vote inflation', blurb: 'Found and fixed in one SQL bug.', art: 'bug', source: 'FBES jury platform', bg: '#7BEFA2', fg: '#111114', accent: '#2B3BF5' },
  { value: '60', unit: '%', title: 'Less diagnosis time', blurb: 'Real-time cardiac dashboards.', art: 'ecg', source: 'Acuradyne · IIT Bombay', bg: '#FFB3CF', fg: '#111114', accent: '#2B3BF5' },
  { value: '94', unit: '%', title: 'Model accuracy', blurb: 'AI-image detection · 0.991 ROC-AUC.', art: 'gauge', source: 'IJARSCT 2025', bg: '#2B3BF5', fg: '#fff', accent: '#7BEFA2' },
]
