import { createContext, useContext } from 'react'

export interface AppActions {
  /** Smooth-scroll to an absolute Y position. */
  goTo: (y: number) => void
  /** Smooth-scroll to a section by element id ('top' → page top). */
  goToId: (id: string) => void
  showToast: (message: string) => void
  copyEmail: () => Promise<boolean>
  /** Open a project case study; pass the clicked tile to animate the morph. */
  openCase: (id: string, tile?: HTMLElement | null) => void
  openPalette: () => void
  openGame: () => void
  openMenu: () => void
}

const AppContext = createContext<AppActions | null>(null)

export const AppProvider = AppContext.Provider

export function useApp(): AppActions {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
