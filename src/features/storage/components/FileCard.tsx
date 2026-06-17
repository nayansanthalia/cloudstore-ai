import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { memo, useCallback } from 'react'

import { FILE_TYPE_ICONS, FOLDER_META } from '@/constants'
import { useAIQuery } from '@/features/query/hooks/useAIQuery'
import { useStorageStore } from '@/features/storage/store/storageStore'
import type { CloudFile } from '@/types'
import { cn } from '@/utils/cn'

// ─── Types ─────────────────────────────────────────────────────────────────

interface FileCardProps {
  file: CloudFile
  index: number
  viewMode: 'grid' | 'list'
}

// ─── Grid Card ─────────────────────────────────────────────────────────────

const GridCard = memo(({ file, index, onQuery, onStar }: {
  file: CloudFile
  index: number
  onQuery: () => void
  onStar: () => void
}) => {
  const folderMeta = FOLDER_META[file.folder]
  const color = folderMeta?.color ?? '#64748B'
  const icon = FILE_TYPE_ICONS[file.type] ?? '📁'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: Math.min(index * 0.035, 0.4),
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={cn(
        'group relative rounded-xl border border-space-300 p-3.5',
        'bg-space-600 cursor-pointer',
        'hover:border-space-200 hover:shadow-card-hover',
        'transition-all duration-200',
      )}
      onClick={onQuery}
    >
      {/* Star button */}
      <button
        onClick={(e) => { e.stopPropagation(); onStar() }}
        className={cn(
          'absolute top-2.5 right-2.5 w-6 h-6 rounded-md',
          'flex items-center justify-center',
          'opacity-0 group-hover:opacity-100',
          'transition-all duration-150',
          'hover:bg-space-400',
          file.starred ? 'opacity-100 text-amber-400' : 'text-slate-700',
        )}
      >
        <Star size={12} fill={file.starred ? 'currentColor' : 'none'} />
      </button>

      {/* Type icon + folder badge */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
          style={{ background: `${color}15` }}
        >
          {icon}
        </div>
        <span
          className="badge text-2xs"
          style={{
            background: `${color}15`,
            color,
            border: `1px solid ${color}25`,
          }}
        >
          {folderMeta?.icon} {file.folder}
        </span>
      </div>

      {/* File name */}
      <p className="text-xs font-semibold text-slate-300 leading-snug mb-2 line-clamp-2">
        {file.name}
      </p>

      {/* Meta */}
      <div className="flex items-center justify-between mt-auto">
        <span className="text-2xs text-slate-700 uppercase font-mono">
          {file.type}
        </span>
        <span className="text-2xs text-slate-700">{file.date}</span>
      </div>

      {/* Hover overlay: "Click to query" */}
      <div
        className={cn(
          'absolute inset-0 rounded-xl flex items-center justify-center',
          'bg-brand-950/80 opacity-0 group-hover:opacity-100',
          'transition-opacity duration-200',
          'border border-brand-600/30',
        )}
      >
        <span className="text-xs font-semibold text-brand-400 flex items-center gap-1.5">
          <span>✦</span> Ask AI about this file
        </span>
      </div>
    </motion.div>
  )
})
GridCard.displayName = 'GridCard'

// ─── List Row ──────────────────────────────────────────────────────────────

const ListRow = memo(({ file, index, onQuery, onStar }: {
  file: CloudFile
  index: number
  onQuery: () => void
  onStar: () => void
}) => {
  const folderMeta = FOLDER_META[file.folder]
  const color = folderMeta?.color ?? '#64748B'
  const icon = FILE_TYPE_ICONS[file.type] ?? '📁'

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index * 0.025, 0.3), duration: 0.3 }}
      className={cn(
        'group flex items-center gap-3 px-4 py-2.5 rounded-lg',
        'bg-space-600 border border-space-300 cursor-pointer',
        'hover:border-space-200 hover:bg-space-500',
        'transition-all duration-150',
      )}
      onClick={onQuery}
    >
      <span className="text-lg shrink-0">{icon}</span>
      <p className="flex-1 text-xs font-medium text-slate-300 truncate">{file.name}</p>
      <span
        className="badge text-2xs shrink-0"
        style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}
      >
        {file.folder}
      </span>
      <span className="text-2xs text-slate-700 uppercase font-mono w-10 text-right shrink-0">
        {file.type}
      </span>
      <span className="text-2xs text-slate-700 w-20 text-right shrink-0">{file.size}</span>
      <span className="text-2xs text-slate-700 w-24 text-right shrink-0">{file.date}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onStar() }}
        className={cn(
          'w-5 h-5 shrink-0 flex items-center justify-center rounded',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-150',
          file.starred ? 'opacity-100 text-amber-400' : 'text-slate-700',
        )}
      >
        <Star size={11} fill={file.starred ? 'currentColor' : 'none'} />
      </button>
    </motion.div>
  )
})
ListRow.displayName = 'ListRow'

// ─── FileCard Component (dispatcher) ──────────────────────────────────────

export const FileCard = memo(({ file, index, viewMode }: FileCardProps) => {
  const { toggleStarred } = useStorageStore()
  const { setQuery, executeQuery } = useAIQuery()

  const handleQuery = useCallback(() => {
    const q = `Tell me about ${file.name}`
    setQuery(q)
    void executeQuery(q)
  }, [file.name, setQuery, executeQuery])

  const handleStar = useCallback(() => {
    toggleStarred(file.id)
  }, [file.id, toggleStarred])

  if (viewMode === 'list') {
    return <ListRow file={file} index={index} onQuery={handleQuery} onStar={handleStar} />
  }

  return <GridCard file={file} index={index} onQuery={handleQuery} onStar={handleStar} />
})

FileCard.displayName = 'FileCard'