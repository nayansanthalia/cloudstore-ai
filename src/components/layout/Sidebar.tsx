import { AnimatePresence, motion } from 'framer-motion'
import { Clock, RotateCcw, Trash2 } from 'lucide-react'
import { memo, useCallback } from 'react'

import { FOLDER_META } from '@/constants'
import { useQueryStore } from '@/features/query/store/queryStore'
import { useStorageStore, selectFolderCounts } from '@/features/storage/store/storageStore'
import type { FolderName } from '@/types'
import { cn } from '@/utils/cn'

// ─── Folder Item ───────────────────────────────────────────────────────────

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
    initial={{ opacity: 0, x: -12 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.05 + index * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    onClick={onClick}
    title={meta.description}
    className={cn(
      'group w-full flex items-center gap-2 px-2.5 py-2 rounded-md',
      'text-left transition-all duration-150',
      'border-l-2',
      isActive
        ? 'bg-brand-950/60 text-slate-200'
        : 'border-transparent text-slate-600 hover:text-slate-400 hover:bg-space-600/50',
    )}
    style={
      isActive
        ? { borderLeftColor: meta.color, borderLeftWidth: 2 }
        : { borderLeftColor: 'transparent', borderLeftWidth: 2 }
    }
  >
    <span className="text-sm w-4 text-center shrink-0">{meta.icon}</span>
    <span className="flex-1 text-xs font-medium truncate">{name}</span>
    <span
      className={cn(
        'text-2xs font-bold px-1.5 py-0.5 rounded-full tabular-nums',
        isActive ? 'text-white' : 'text-slate-700 bg-space-500/50 group-hover:text-slate-600',
      )}
      style={isActive ? { background: `${meta.color}30`, color: meta.color } : {}}
    >
      {count}
    </span>
  </motion.button>
))
FolderItem.displayName = 'FolderItem'

// ─── History Item ──────────────────────────────────────────────────────────

interface HistoryItemProps {
  query: string
  matchCount: number
  onReplay: () => void
  index: number
}

const HistoryItem = memo(({ query, matchCount, onReplay, index }: HistoryItemProps) => (
  <motion.button
    initial={{ opacity: 0, x: -8 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.04 }}
    onClick={onReplay}
    className={cn(
      'group w-full text-left px-2.5 py-2 rounded-md',
      'hover:bg-space-600/50 transition-colors duration-150',
    )}
  >
    <div className="flex items-start gap-1.5">
      <RotateCcw
        size={10}
        className="text-slate-700 group-hover:text-brand-500 mt-0.5 shrink-0 transition-colors duration-150"
      />
      <div className="min-w-0">
        <p className="text-2xs text-slate-600 group-hover:text-slate-400 truncate transition-colors duration-150">
          {query}
        </p>
        <p className="text-2xs text-slate-800 mt-0.5">
          {matchCount} result{matchCount !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  </motion.button>
))
HistoryItem.displayName = 'HistoryItem'

// ─── Section Label ─────────────────────────────────────────────────────────

const SectionLabel = memo(({ children }: { children: React.ReactNode }) => (
  <p className="px-2.5 pb-1 pt-0.5 text-2xs font-semibold text-slate-800 uppercase tracking-widest">
    {children}
  </p>
))
SectionLabel.displayName = 'SectionLabel'

// ─── Sidebar Component ─────────────────────────────────────────────────────

export const Sidebar = memo(() => {
  const { filters, setFolder } = useStorageStore()
  const folderCounts = useStorageStore(selectFolderCounts)
  const { history, replayHistoryItem, clearHistory } = useQueryStore()

  const handleFolderClick = useCallback(
    (folder: FolderName | 'All') => {
      setFolder(folder)
    },
    [setFolder],
  )

  const folders = Object.keys(FOLDER_META)

  return (
    <aside
      className={cn(
        'flex flex-col shrink-0 py-3 gap-0.5 overflow-y-auto overflow-x-hidden',
        'border-r border-space-300 bg-space-800',
      )}
      style={{ width: 'var(--sidebar-w)' }}
    >
      {/* Folders Section */}
      <SectionLabel>Folders</SectionLabel>
      <div className="px-1.5 flex flex-col gap-0.5">
        {folders.map((name, index) => {
          const meta = FOLDER_META[name]
          if (!meta) return null
          return (
            <FolderItem
              key={name}
              name={name}
              meta={meta}
              count={folderCounts[name] ?? 0}
              isActive={filters.folder === name}
              onClick={() => handleFolderClick(name as FolderName | 'All')}
              index={index}
            />
          )
        })}
      </div>

      {/* Divider */}
      <div className="h-px bg-space-300 mx-3 my-2" />

      {/* History Section */}
      <div className="flex items-center justify-between px-2.5 pb-1">
        <div className="flex items-center gap-1.5">
          <Clock size={10} className="text-slate-700" />
          <SectionLabel>Recent Queries</SectionLabel>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            title="Clear history"
            className="text-slate-800 hover:text-rose-500 transition-colors duration-150 p-0.5 rounded"
          >
            <Trash2 size={10} />
          </button>
        )}
      </div>

      <div className="px-1.5 flex flex-col gap-0.5">
        <AnimatePresence mode="popLayout">
          {history.length === 0 ? (
            <p className="px-2.5 py-2 text-2xs text-slate-800 italic">
              No queries yet. Ask something!
            </p>
          ) : (
            history.map((item, i) => (
              <HistoryItem
                key={item.id}
                query={item.query}
                matchCount={item.matchCount}
                onReplay={() => replayHistoryItem(item)}
                index={i}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </aside>
  )
})

Sidebar.displayName = 'Sidebar'