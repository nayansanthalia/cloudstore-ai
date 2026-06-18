import { AnimatePresence, motion } from 'framer-motion'
import { 
  RotateCcw, 
  Trash2, 
  LogOut, 
  Cloud, 
  RefreshCw, 
  LayoutDashboard, 
  Files, 
  Settings, 
  HelpCircle, 
  Search,
  Command,
  ChevronDown
} from 'lucide-react'
import { memo, useCallback, useEffect, useState } from 'react'

import { FOLDER_META } from '@/constants'
import { useQueryStore } from '@/features/query/store/queryStore'
import { useStorageStore, selectFolderCounts } from '@/features/storage/store/storageStore'
import type { FolderName } from '@/types'
import { cn } from '@/utils/cn'

interface SidebarProps {
  activeTab: 'dashboard' | 'files'
  onTabChange: (tab: 'dashboard' | 'files') => void
}

// ─── Folder Sub-item ────────────────────────────────────────────────────────

interface FolderItemProps {
  name: string
  meta: { color: string; icon: string; description: string; name: string }
  count: number
  isActive: boolean
  onClick: () => void
  index: number
}

const FolderItem = memo(({ name, meta, count, isActive, onClick, index }: FolderItemProps) => (
  <motion.button
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: idxDelay(index), duration: 0.2 }}
    onClick={onClick}
    className={cn(
      'group w-full flex items-center gap-2 pl-6 pr-2.5 py-1.5 rounded-md text-left transition-all text-2xs',
      isActive
        ? 'bg-space-600/60 text-slate-200 font-semibold'
        : 'text-slate-500 hover:text-slate-350 hover:bg-space-600/35',
    )}
  >
    <span className="text-[11px] w-3.5 text-center" style={{ color: meta.color }}>{meta.icon}</span>
    <span className="flex-1 truncate">{name}</span>
    <span className="text-[10px] text-slate-700 group-hover:text-slate-500">{count}</span>
  </motion.button>
))
FolderItem.displayName = 'FolderItem'

const idxDelay = (i: number) => 0.05 + i * 0.03

// ─── History Sub-item ────────────────────────────────────────────────────────

interface HistoryItemProps {
  query: string
  onReplay: () => void
  index: number
}

const HistoryItem = memo(({ query, onReplay, index }: HistoryItemProps) => (
  <motion.button
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: idxDelay(index), duration: 0.2 }}
    onClick={onReplay}
    className={cn(
      'group w-full flex items-center gap-2 pl-6 pr-2.5 py-1.5 rounded-md text-left transition-all text-2xs text-slate-500 hover:text-slate-350 hover:bg-space-600/35',
    )}
  >
    <RotateCcw size={10} className="text-slate-650 group-hover:text-brand-500 transition-colors" />
    <span className="flex-1 truncate">{query}</span>
  </motion.button>
))
HistoryItem.displayName = 'HistoryItem'

// ─── Promo Card ──────────────────────────────────────────────────────────────

const PromoCard = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-xl p-3 flex flex-col justify-between relative overflow-hidden"
    style={{
      background: 'rgba(13, 27, 49, 0.25)',
      border: '1px solid rgba(255, 255, 255, 0.05)'
    }}
  >
    <div className="z-10">
      <h5 className="text-[11px] font-bold text-slate-200">Search with AI Pro</h5>
      <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
        Unlock semantic queries & instant document insights.
      </p>
    </div>
    <button className="w-full mt-2.5 py-1 rounded bg-brand-600 hover:bg-brand-500 text-[10px] font-bold text-white transition-colors z-10">
      Upgrade Now
    </button>
  </motion.div>
))
PromoCard.displayName = 'PromoCard'

// ─── Sidebar Component ─────────────────────────────────────────────────────

export const Sidebar = memo(({ activeTab, onTabChange }: SidebarProps) => {
  const {
    filters,
    setFolder,
    setSearchTerm,
    isConnected,
    isSyncing,
    userProfile,
    syncFiles,
    disconnectDrive,
    checkAuthStatus,
  } = useStorageStore()
  const folderCounts = useStorageStore(selectFolderCounts)
  const { history, replayHistoryItem, clearHistory } = useQueryStore()
  const [localSearch, setLocalSearch] = useState('')
  const [foldersExpanded, setFoldersExpanded] = useState(true)

  // Check auth status on load
  useEffect(() => {
    void checkAuthStatus()
  }, [checkAuthStatus])

  // Sync local search term to storage store
  const handleSearchChange = (val: string) => {
    setLocalSearch(val)
    setSearchTerm(val)
    // If not in files tab, auto-switch to files tab to show results
    if (val.trim() && activeTab !== 'files') {
      onTabChange('files')
    }
  }

  const handleFolderClick = useCallback(
    (folder: FolderName | 'All') => {
      setFolder(folder)
      onTabChange('files')
    },
    [setFolder, onTabChange],
  )

  const handleConnect = () => {
    window.location.href = 'http://localhost:5000/api/auth/google'
  }

  const folders = Object.keys(FOLDER_META).filter(f => f !== 'All')

  return (
    <aside
      className={cn(
        'flex flex-col shrink-0 p-4.5 pb-12 gap-4 h-full overflow-y-auto overflow-x-hidden',
        'border-r border-space-300 bg-space-900/30 backdrop-blur-xl',
      )}
      style={{ width: 'var(--sidebar-w)' }}
    >
      {/* Brand Header inside Sidebar matching Sample 1 */}
      <div className="flex items-center gap-2.5 pl-1.5 py-1">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center text-sm text-white font-bold select-none shadow-glow-sm">
          ☁
        </div>
        <span className="font-display font-bold text-sm text-slate-100 tracking-tight">
          CloudStore AI
        </span>
      </div>

      {/* Glass Search Input inside Sidebar matching Sample 1 */}
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-650 w-3.5 h-3.5" />
        <input
          type="text"
          value={localSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search for..."
          className="w-full pl-8 pr-8 py-1.5 rounded-lg text-2xs bg-space-800 border border-space-300 text-slate-200 placeholder-slate-600 outline-none hover:border-space-200 focus:border-brand-600 transition-colors"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-slate-650 text-[9px] font-semibold bg-space-600 px-1 py-0.5 rounded border border-space-300 select-none">
          <Command size={8} />
          <span>F</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest pl-1.5 mb-1.5">Overview</span>
        
        {/* Dashboard Tab */}
        <button
          onClick={() => onTabChange('dashboard')}
          className={cn(
            'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all text-xs',
            activeTab === 'dashboard'
              ? 'bg-slate-100 text-slate-950 font-semibold shadow-lg'
              : 'text-slate-450 hover:text-slate-200 hover:bg-space-800/40'
          )}
        >
          <LayoutDashboard size={14} />
          <span>Dashboard</span>
        </button>

        {/* Files Tab */}
        <button
          onClick={() => {
            setFolder('All')
            onTabChange('files')
            setFoldersExpanded(!foldersExpanded)
          }}
          className={cn(
            'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all text-xs',
            activeTab === 'files' && filters.folder === 'All'
              ? 'bg-slate-100 text-slate-950 font-semibold shadow-lg'
              : 'text-slate-450 hover:text-slate-200 hover:bg-space-800/40'
          )}
        >
          <Files size={14} />
          <span>Resources</span>
          <ChevronDown 
            size={12} 
            className={cn(
              'ml-auto transition-transform duration-200 text-slate-500', 
              !foldersExpanded && '-rotate-90',
              activeTab === 'files' && filters.folder === 'All' && 'text-slate-950'
            )} 
          />
        </button>

        {/* Folder Sub-menu */}
        <AnimatePresence initial={false}>
          {foldersExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="flex flex-col mt-1 overflow-hidden"
            >
              {folders.map((name, i) => {
                const meta = FOLDER_META[name]
                const count = folderCounts[name] ?? 0
                const isActive = activeTab === 'files' && filters.folder === name
                return (
                  <FolderItem
                    key={name}
                    name={name}
                    meta={meta}
                    count={count}
                    isActive={isActive}
                    onClick={() => handleFolderClick(name as FolderName)}
                    index={i}
                  />
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* History Sub-menu */}
      {history.length > 0 && (
        <div className="flex flex-col gap-0.5 mt-1">
          <div className="flex items-center justify-between pl-1.5 pr-1 mb-1">
            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Recent Queries</span>
            <button
              onClick={clearHistory}
              className="text-slate-650 hover:text-rose-500 transition-colors p-0.5 rounded"
              title="Clear recent queries"
            >
              <Trash2 size={9} />
            </button>
          </div>
          <div className="flex flex-col">
            {history.slice(0, 3).map((item, i) => (
              <HistoryItem
                key={item.id}
                query={item.query}
                onReplay={() => {
                  replayHistoryItem(item)
                  onTabChange('dashboard')
                }}
                index={i}
              />
            ))}
          </div>
        </div>
      )}

      {/* Support Section */}
      <div className="flex flex-col gap-0.5 mt-auto">
        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest pl-1.5 mb-1.5">Support</span>
        <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left text-xs text-slate-450 hover:text-slate-200 hover:bg-space-800/40 transition-all">
          <Settings size={14} />
          <span>Settings</span>
        </button>
        <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left text-xs text-slate-450 hover:text-slate-200 hover:bg-space-800/40 transition-all">
          <HelpCircle size={14} />
          <span>Help</span>
        </button>
      </div>

      {/* Promo AI Banner */}
      <PromoCard />

      {/* Google Drive Status Section inside Sidebar bottom */}
      <div className="border-t border-space-300 pt-3.5 flex flex-col gap-2">
        {isConnected ? (
          <div className="rounded-lg bg-space-800/50 border border-space-300 p-2.5 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {userProfile?.picture ? (
                <img
                  src={userProfile.picture}
                  alt={userProfile.name}
                  className="w-5 h-5 rounded-full border border-brand-500/20 object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-brand-950 flex items-center justify-center text-brand-400 font-bold text-[8px]">
                  {userProfile?.name?.charAt(0) || 'U'}
                </div>
              )}
              <div className="min-w-0 flex-1 leading-tight">
                <p className="text-[10px] font-semibold text-slate-300 truncate">
                  {userProfile?.name}
                </p>
                <p className="text-[8px] text-slate-700 truncate mt-0.5">
                  {userProfile?.email}
                </p>
              </div>
              <button
                onClick={() => void disconnectDrive()}
                title="Disconnect Google Drive"
                className="text-slate-650 hover:text-rose-500 transition-colors p-0.5 rounded"
              >
                <LogOut size={10} />
              </button>
            </div>

            <button
              onClick={() => void syncFiles()}
              disabled={isSyncing}
              className={cn(
                'w-full flex items-center justify-center gap-1 py-1 rounded text-[10px] font-bold transition-all',
                isSyncing
                  ? 'bg-space-600 text-slate-500 cursor-not-allowed'
                  : 'bg-brand-950/70 text-brand-450 border border-brand-900/40 hover:bg-brand-900 hover:text-white',
              )}
            >
              <RefreshCw size={8} className={cn(isSyncing && 'animate-spin')} />
              {isSyncing ? 'Syncing...' : 'Sync Drive'}
            </button>
          </div>
        ) : (
          <div className="rounded-lg bg-space-950/40 border border-dashed border-space-300 p-2.5 text-center flex flex-col gap-1.5">
            <div className="flex items-center justify-center gap-1 text-slate-650">
              <Cloud size={11} />
              <span className="text-[9px] font-semibold uppercase tracking-wider">Storage Status</span>
            </div>
            <p className="text-[9px] text-slate-700 leading-normal">
              Showing preview documents.
            </p>
            <button
              onClick={handleConnect}
              className="w-full flex items-center justify-center gap-1.5 py-1 px-2.5 rounded bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-[9px] font-bold text-white shadow-glow-sm transition-all"
            >
              Connect Drive
            </button>
          </div>
        )}
      </div>
    </aside>
  )
})

Sidebar.displayName = 'Sidebar'