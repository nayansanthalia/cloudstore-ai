import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { DashboardPage } from '@/pages/DashboardPage'
import { LandingPage } from '@/pages/LandingPage'
import { useThemeStore } from '@/store/themeStore'

function App() {
  const initTheme = useThemeStore((state) => state.initTheme)
  const theme = useThemeStore((state) => state.theme)

  // Initialize on mount — read localStorage / system preference
  useEffect(() => {
    initTheme()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Defensive sync: whenever Zustand theme state changes,
  // make sure the <html> class matches (guards against any edge case)
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      root.setAttribute('data-theme', 'dark')
    } else {
      root.classList.remove('dark')
      root.setAttribute('data-theme', 'light')
    }
  }, [theme])

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Fallback route */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App