import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
  initTheme: () => void
}

/** Applies the theme class to <html> and saves to localStorage */
function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
    root.setAttribute('data-theme', 'dark')
  } else {
    root.classList.remove('dark')
    root.setAttribute('data-theme', 'light')
  }
  try {
    localStorage.setItem('theme', theme)
  } catch {
    // Private browsing / blocked storage – silently ignore
  }
}

export const useThemeStore = create<ThemeState>()(
  subscribeWithSelector((set, get) => ({
    theme: 'light',

    toggleTheme: () => {
      const next: Theme = get().theme === 'light' ? 'dark' : 'light'
      applyTheme(next)
      set({ theme: next })
    },

    initTheme: () => {
      let saved: string | null = null
      try {
        saved = localStorage.getItem('theme')
      } catch {
        // ignore
      }
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const initial: Theme =
        saved === 'dark' || saved === 'light' ? (saved as Theme) : systemDark ? 'dark' : 'light'

      applyTheme(initial)
      set({ theme: initial })
    },
  }))
)
