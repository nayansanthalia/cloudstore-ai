import { AnimatePresence, motion } from 'framer-motion'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { memo, useState } from 'react'

import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { QueryBar } from '@/features/query/components/QueryBar'
import { QueryResults } from '@/features/query/components/QueryResults'
import { FileGrid } from '@/features/storage/components/FileGrid'
import { cn } from '@/utils/cn'

// ─── Resize Handle ─────────────────────────────────────────────────────────

const ResizeHandle = memo(() => (
  <div
    className={cn(
      'w-px shrink-0 bg-space-300 relative group cursor-col-resize',
      'hover:bg-brand-600/60 transition-colors duration-200',
    )}
  >
    <div className="absolute inset-y-0 -inset-x-1 group-hover:bg-brand-600/10 transition-colors duration-200" />
  </div>
))
ResizeHandle.displayName = 'ResizeHandle'

// ─── Sidebar Toggle ────────────────────────────────────────────────────────

interface SidebarToggleProps {
  isOpen: boolean
  onToggle: () => void
}

const SidebarToggle = memo(({ isOpen, onToggle }: SidebarToggleProps) => (
  <button
    onClick={onToggle}
    title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
    className={cn(
      'absolute top-3 -right-3 z-20',
      'w-6 h-6 rounded-full flex items-center justify-center',
      'bg-space-600 border border-space-300',
      'text-slate-600 hover:text-slate-300 hover:border-space-200',
      'transition-all duration-200 shadow-card',
    )}
  >
    {isOpen ? <PanelLeftClose size={12} /> : <PanelLeftOpen size={12} />}
  </button>
))
SidebarToggle.displayName = 'SidebarToggle'

// ─── Dashboard Page ────────────────────────────────────────────────────────

export const DashboardPage = memo(() => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="layout-root bg-space-900">
      {/* ── Header ── */}
      <Header />

      {/* ── Body ── */}
      <div className="layout-body">

        {/* ── Sidebar ── */}
        <div className="relative shrink-0">
          <SidebarToggle isOpen={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
          <AnimatePresence initial={false}>
            {sidebarOpen && (
              <motion.div
                key="sidebar"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'var(--sidebar-w)', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden h-full"
              >
                <ErrorBoundary>
                  <Sidebar />
                </ErrorBoundary>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Split Panels ── */}
        <div className="layout-main">

          {/* Upper Panel: Query Interface */}
          <div
            className="flex flex-col border-b border-space-300 overflow-hidden"
            style={{ flex: '0 0 55%' }}
          >
            <ErrorBoundary>
              <QueryBar />
              <QueryResults />
            </ErrorBoundary>
          </div>

          <ResizeHandle />

          {/* Lower Panel: File Browser */}
          <div className="flex flex-col overflow-hidden" style={{ flex: '1 1 45%' }}>
            <ErrorBoundary>
              <FileGrid />
            </ErrorBoundary>
          </div>

        </div>
      </div>

      {/* ── Footer ── */}
      <Footer />
    </div>
  )
})

DashboardPage.displayName = 'DashboardPage'