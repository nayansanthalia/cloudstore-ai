import { AnimatePresence, motion } from 'framer-motion'
import { FolderOpen, LayoutGrid, List, SortAsc, SortDesc } from 'lucide-react'
import { memo, useState } from 'react'

import { FOLDER_META } from '@/constants'
import { FileCard } from '@/features/storage/components/FileCard'
import { useStorageStore } from '@/features/storage/store/storageStore'
import type { SortField, ViewMode } from '@/types'
import { cn } from '@/utils/cn'

// ─── Toolbar ───────────────────────────────────────────────────────────────

interface ToolbarProps {
  fileCount: number
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  sortField: string
  sortDirection: 'asc' | 'desc'
  onSortChange: (field: SortField) => void
  onToggleDirection: () => void
  folderName: string
}

const Toolbar = memo(({
  fileCount,
  viewMode,
  onViewModeChange,
  sortField,
  sortDirection,
  onSortChange,
  onToggleDirection,
  folderName,
}: ToolbarProps) => {
  const meta = FOLDER_META[folderName]

  const sortOptions: { label: string; value: SortField }[] = [
    { label: 'Date', value: 'date' },
    { label: 'Name', value: 'name' },
    { label: 'Size', value: 'size' },
    { label: 'Type', value: 'type' },
  ]

  return (
    <div className="flex items-center gap-3 px-5 py-2.5 border-b border-white/50 shrink-0 bg-white/45 backdrop-blur-md">
      {/* Folder info */}
      <div className="flex items-center gap-2">
        <span
          className="text-sm"
          style={{ color: meta?.color ?? '#64748B' }}
        >
          {meta?.icon ?? <FolderOpen size={14} />}
        </span>
        <span className="text-xs font-bold text-brandNavy">{folderName}</span>
        <span className="text-2xs text-brandNavy/50 font-bold">
          · {fileCount} file{fileCount !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex-1" />

      {/* Sort */}
      <div className="flex items-center gap-1">
        {sortOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSortChange(opt.value)}
            className={cn(
              'px-2 py-1 rounded text-2xs font-bold transition-all duration-150',
              sortField === opt.value
                ? 'bg-brandNavy text-white shadow-2xs border border-brandNavy/10'
                : 'text-brandNavy/60 hover:text-brandNavy hover:bg-white/40',
            )}
          >
            {opt.label}
          </button>
        ))}
        <button
          onClick={onToggleDirection}
          className="ml-1 w-6 h-6 rounded flex items-center justify-center text-brandNavy/50 hover:text-brandNavy hover:bg-white/40 transition-all duration-150"
          title={`Sort ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}
        >
          {sortDirection === 'asc' ? <SortAsc size={12} /> : <SortDesc size={12} />}
        </button>
      </div>

      {/* Divider */}
      <div className="h-4 w-px bg-brandNavy/10" />

      {/* View toggle */}
      <div className="flex items-center gap-0.5 bg-white/60 rounded-md p-0.5 border border-white/80 shadow-2xs">
        <button
          onClick={() => onViewModeChange('grid')}
          className={cn(
            'w-6 h-6 rounded flex items-center justify-center',
            'transition-all duration-150',
            viewMode === 'grid'
              ? 'bg-brandNavy text-white shadow-3xs'
              : 'text-brandNavy/50 hover:text-brandNavy hover:bg-white/40',
          )}
          title="Grid view"
        >
          <LayoutGrid size={12} />
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={cn(
            'w-6 h-6 rounded flex items-center justify-center',
            'transition-all duration-150',
            viewMode === 'list'
              ? 'bg-brandNavy text-white shadow-3xs'
              : 'text-brandNavy/50 hover:text-brandNavy hover:bg-white/40',
          )}
          title="List view"
        >
          <List size={12} />
        </button>
      </div>
    </div>
  )
})
Toolbar.displayName = 'Toolbar'

// ─── Empty Folder State ────────────────────────────────────────────────────

const EmptyFolder = memo(({ folderName }: { folderName: string }) => (
  <div className="flex flex-col items-center justify-center h-full py-20 text-center text-brandNavy">
    <FolderOpen size={36} className="text-brandNavy/40 mb-3" />
    <p className="text-sm font-bold text-brandNavy/75 mb-1">No files in {folderName}</p>
    <p className="text-xs text-brandNavy/50 font-semibold">Upload files or switch to a different folder</p>
  </div>
))
EmptyFolder.displayName = 'EmptyFolder'

// ─── FileGrid Component ────────────────────────────────────────────────────

export const FileGrid = memo(() => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const {
    filteredFiles,
    filters,
    sort,
    setSortField,
    toggleSortDirection,
  } = useStorageStore()

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Toolbar */}
      <Toolbar
        fileCount={filteredFiles.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortField={sort.field}
        sortDirection={sort.direction}
        onSortChange={setSortField}
        onToggleDirection={toggleSortDirection}
        folderName={filters.folder}
      />

      {/* File Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
        {filteredFiles.length === 0 ? (
          <EmptyFolder folderName={filters.folder} />
        ) : viewMode === 'grid' ? (
          <motion.div
            layout
            className="grid gap-3"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))' }}
          >
            <AnimatePresence mode="popLayout">
              {filteredFiles.map((file, i) => (
                <FileCard key={file.id} file={file} index={i} viewMode="grid" />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div layout className="flex flex-col gap-1.5">
            {/* List header */}
            <div className="flex items-center gap-3 px-4 py-1.5 text-2xs text-brandNavy/50 font-bold uppercase tracking-wider">
              <span className="w-5 shrink-0" />
              <span className="flex-1">Name</span>
              <span className="w-24 text-right shrink-0">Folder</span>
              <span className="w-10 text-right shrink-0">Type</span>
              <span className="w-20 text-right shrink-0">Size</span>
              <span className="w-24 text-right shrink-0">Date</span>
              <span className="w-5 shrink-0" />
            </div>
            <AnimatePresence mode="popLayout">
              {filteredFiles.map((file, i) => (
                <FileCard key={file.id} file={file} index={i} viewMode="list" />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
})

FileGrid.displayName = 'FileGrid'