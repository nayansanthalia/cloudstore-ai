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
  subscribeWithSelector((set) => ({
    theme: 'dark',

    toggleTheme: () => {
      // Theme toggling is disabled. System is locked to dark mode.
      applyTheme('dark')
      set({ theme: 'dark' })
    },

    initTheme: () => {
      applyTheme('dark')
      set({ theme: 'dark' })
    },
  }))
)
