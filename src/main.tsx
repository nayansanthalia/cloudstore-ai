import React from 'react'
import ReactDOM from 'react-dom/client'

import { AppProviders } from '@/app/providers/AppProviders'
import App from '@/App'
import '@/styles/globals.css'

// ─── Strict Mode + Providers ───────────────────────────────────────────────

const rootEl = document.getElementById('root')

if (!rootEl) {
  throw new Error('[main] Could not find #root element. Check your index.html.')
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
)