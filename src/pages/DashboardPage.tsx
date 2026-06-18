import { memo, useState } from 'react'

import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { StatsRow } from '@/components/layout/StatsRow'
import { QueryBar } from '@/features/query/components/QueryBar'
import { QueryResults } from '@/features/query/components/QueryResults'
import { StorageDistributionChart } from '@/features/query/components/StorageDistributionChart'
import { SearchActivityChart } from '@/features/query/components/SearchActivityChart'
import { SmartAIInsights } from '@/features/query/components/SmartAIInsights'
import { FileGrid } from '@/features/storage/components/FileGrid'

export const DashboardPage = memo(() => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'files'>('dashboard')

  return (
    <div className="flex flex-row w-screen h-screen overflow-hidden bg-[#030812]">
      {/* ── Sidebar (Left Column - Full Height) ── */}
      <ErrorBoundary>
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </ErrorBoundary>

      {/* ── Main Content Area (Right Column) ── */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Decorative ambient glowing dots / grid in background */}
        <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none z-0" />
        
        {/* ── Header ── */}
        <ErrorBoundary>
          <Header />
        </ErrorBoundary>

        {/* ── Page Body ── */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 z-10 relative scrollable">
          {activeTab === 'dashboard' ? (
            /* ── Dashboard Tab View ── */
            <div className="flex flex-col gap-5 max-w-[1400px] mx-auto animate-fade-in">
              {/* Header Title section */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-display font-bold text-slate-100 tracking-tight">My Dashboard</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Welcome back! Here is a summary of your indexed document repository.</p>
                </div>
              </div>

              {/* Stats Row */}
              <ErrorBoundary>
                <StatsRow />
              </ErrorBoundary>

              {/* Core Layout Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
                {/* Left Area (65% on large screens): Query Bar, Results & Search Activity */}
                <div className="lg:col-span-2 flex flex-col gap-5 min-w-0">
                  <ErrorBoundary>
                    <div className="glass-card rounded-2xl overflow-hidden border border-space-300">
                      <QueryBar />
                      <QueryResults />
                    </div>
                  </ErrorBoundary>

                  <ErrorBoundary>
                    <SearchActivityChart />
                  </ErrorBoundary>
                </div>

                {/* Right Area (35% on large screens): Distribution & Smart Insights */}
                <div className="flex flex-col gap-5 min-w-0">
                  <ErrorBoundary>
                    <StorageDistributionChart />
                  </ErrorBoundary>

                  <ErrorBoundary>
                    <SmartAIInsights />
                  </ErrorBoundary>
                </div>
              </div>
            </div>
          ) : (
            /* ── File Explorer Tab View ── */
            <div className="flex flex-col gap-4 h-full max-w-[1400px] mx-auto animate-fade-in">
              <div className="flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-xl font-display font-bold text-slate-100 tracking-tight">Resources</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Browse, search, sort, and star documents in your storage vaults.</p>
                </div>
              </div>

              {/* File Grid */}
              <div className="flex-1 glass-card rounded-2xl overflow-hidden border border-space-300 flex flex-col min-h-[500px]">
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