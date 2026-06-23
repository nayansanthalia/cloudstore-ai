import { memo, useState } from 'react'

import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { QueryBar } from '@/features/query/components/QueryBar'
import { QueryResults } from '@/features/query/components/QueryResults'
import { FileGrid } from '@/features/storage/components/FileGrid'

export const DashboardPage = memo(() => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'files'>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex flex-row w-screen h-screen overflow-hidden bg-[#F0F9FF] dark:bg-[#090D16] font-sans">
      {/* ── Sidebar (Left Column - Full Height) ── */}
      <ErrorBoundary>
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </ErrorBoundary>

      {/* ── Main Content Area (Right Column) ── */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Decorative ambient glowing dots / grid in background */}
        <div className="absolute inset-0 grid-pattern opacity-60 pointer-events-none z-0" />
        
        {/* ── Floating Header ── */}
        <ErrorBoundary>
          <Header 
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </ErrorBoundary>

        {/* ── Page Body ── */}
        <main className="flex-1 overflow-hidden z-10 relative flex flex-col min-h-0">
          {activeTab === 'dashboard' ? (
            /* ── Dashboard Tab View (ChatGPT style chat layout) ── */
            <div className="flex-1 flex flex-col min-h-0 w-full animate-fade-in text-brandNavy dark:text-slate-200">
              {/* Centered Scrollable Conversation History */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 scrollbar-thin">
                <div className="max-w-3xl mx-auto h-full">
                  <ErrorBoundary>
                    <QueryResults />
                  </ErrorBoundary>
                </div>
              </div>

              {/* Centered Chat Input Box */}
              <div className="pb-4 px-4 md:px-6 shrink-0">
                <ErrorBoundary>
                  <QueryBar />
                </ErrorBoundary>
              </div>
            </div>
          ) : (
            /* ── File Explorer Tab View ── */
            <div className="flex-1 flex flex-col min-h-0 p-6 max-w-[1400px] w-full mx-auto animate-fade-in text-brandNavy dark:text-slate-200 gap-4">
              <div className="flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-xl font-display font-bold text-brandNavy dark:text-white tracking-tight">Resources</h2>
                  <p className="text-xs text-brandNavy/65 dark:text-slate-400 mt-0.5 font-semibold">Browse, search, sort, and star documents in your storage vaults.</p>
                </div>
              </div>

              {/* File Grid */}
              <div className="flex-1 glass-card rounded-2xl overflow-hidden border border-white/50 dark:border-white/10 shadow-sm flex flex-col min-h-0">
                <ErrorBoundary>
                  <FileGrid />
                </ErrorBoundary>
              </div>
            </div>
          )}
        </main>

        {/* ── Footer ── */}
        <ErrorBoundary>
          <Footer />
        </ErrorBoundary>
      </div>
    </div>
  )
})

DashboardPage.displayName = 'DashboardPage'