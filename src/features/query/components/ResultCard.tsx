import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, Lightbulb, Sparkles } from 'lucide-react'
import { memo, useState } from 'react'

import { FILE_TYPE_ICONS, FOLDER_META } from '@/constants'
import { MOCK_FILES } from '@/features/storage/data/mockFiles'
import type { FileMatch } from '@/types'
import { cn } from '@/utils/cn'

// ─── Types ─────────────────────────────────────────────────────────────────

interface ResultCardProps {
  match: FileMatch
  index: number
}

// ─── Relevance Badge ───────────────────────────────────────────────────────

interface RelevanceBadgeProps {
  relevance: 'high' | 'medium' | 'low'
  folderColor: string
}

const RelevanceBadge = memo(({ relevance, folderColor }: RelevanceBadgeProps) => {
  const isHigh = relevance === 'high'
  return (
    <span
      className={cn(
        'badge text-2xs font-bold shrink-0',
        'border transition-colors duration-150',
      )}
      style={
        isHigh
          ? {
              background: `${folderColor}18`,
              color: folderColor,
              borderColor: `${folderColor}40`,
            }
          : {
              background: 'rgba(18,32,53,1)',
              color: '#475569',
              borderColor: 'rgba(18,32,53,1)',
            }
      }
    >
      {relevance.toUpperCase()}
    </span>
  )
})
RelevanceBadge.displayName = 'RelevanceBadge'

// ─── Info Row ──────────────────────────────────────────────────────────────

interface InfoRowProps {
  label: string
  value: string
  accent?: string
}

const InfoRow = memo(({ label, value, accent }: InfoRowProps) => (
  <div className="px-3 py-2 bg-space-900 rounded-lg">
    <p
      className="text-2xs font-bold uppercase tracking-wider mb-1"
      style={{ color: accent ?? '#2563EB' }}
    >
      {label}
    </p>
    <p className="text-xs text-slate-500 leading-relaxed">{value}</p>
  </div>
))
InfoRow.displayName = 'InfoRow'

// ─── Result Card ───────────────────────────────────────────────────────────

export const ResultCard = memo(({ match, index }: ResultCardProps) => {
  const [expanded, setExpanded] = useState(false)

  const file = MOCK_FILES.find((f) => f.id === match.id)
  if (!file) return null

  const folderMeta = FOLDER_META[file.folder]
  const folderColor = folderMeta?.color ?? '#64748B'
  const fileIcon = FILE_TYPE_ICONS[file.type] ?? '📁'
  const isHigh = match.relevance === 'high'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.07,
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        'rounded-xl border overflow-hidden',
        'transition-all duration-200',
        'hover:border-space-200',
        isHigh ? 'border-space-300' : 'border-space-300/60',
      )}
      style={{
        background: 'rgba(8, 22, 41, 1)',
        borderLeft: isHigh ? `3px solid ${folderColor}` : '3px solid rgba(18,32,53,1)',
      }}
    >
      {/* Card Header */}
      <div className="px-4 py-3 flex items-start gap-3">
        {/* File Icon */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0 mt-0.5"
          style={{ background: `${folderColor}15` }}
        >
          {fileIcon}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-200 truncate leading-tight">
            {file.name}
          </p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {/* Folder tag */}
            <span
              className="badge text-2xs"
              style={{
                background: `${folderColor}15`,
                color: folderColor,
                border: `1px solid ${folderColor}30`,
              }}
            >
              {folderMeta?.icon} {file.folder}
            </span>
            <span className="text-2xs text-slate-700">·</span>
            <span className="text-2xs text-slate-600">{file.size}</span>
            <span className="text-2xs text-slate-700">·</span>
            <span className="text-2xs text-slate-600">{file.date}</span>
          </div>
        </div>

        {/* Right side: relevance + expand */}
        <div className="flex items-center gap-2 shrink-0">
          <RelevanceBadge relevance={match.relevance} folderColor={folderColor} />
          <button
            onClick={() => setExpanded((v) => !v)}
            className={cn(
              'w-6 h-6 rounded-md flex items-center justify-center',
              'text-slate-700 hover:text-slate-400 hover:bg-space-500',
              'transition-all duration-150',
            )}
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Match Details — always visible */}
      <div className="px-4 pb-3 flex flex-col gap-2">
        <InfoRow label="Why it matched" value={match.reason} accent="#2563EB" />
        <InfoRow label="Key data" value={match.highlight} accent="#7C3AED" />
      </div>

      {/* Expanded: Full content */}
      <motion.div
        initial={false}
        animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <div className="px-4 pb-3 border-t border-space-300 pt-3">
          <p className="text-2xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Full Content Summary
          </p>
          <p className="text-xs text-slate-600 leading-relaxed font-mono">{file.content}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {file.tags.map((tag) => (
              <span
                key={tag}
                className="text-2xs px-2 py-0.5 rounded-full bg-space-500 text-slate-700 border border-space-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
})

ResultCard.displayName = 'ResultCard'

// ─── AI Answer Card ────────────────────────────────────────────────────────

interface AnswerCardProps {
  answer: string
  insight: string | null
  matchCount: number
}

export const AnswerCard = memo(({ answer, insight, matchCount }: AnswerCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: -12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    className={cn(
      'rounded-xl border border-space-200 overflow-hidden mb-4',
      'bg-gradient-to-br from-space-600 to-space-700',
    )}
    style={{ borderLeft: '3px solid #2563EB' }}
  >
    <div className="px-5 py-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={14} className="text-brand-500 shrink-0" />
        <span className="text-2xs font-bold text-brand-400 uppercase tracking-widest">
          AI Answer
        </span>
        <div className="flex-1" />
        <span className="text-2xs text-slate-700">
          {matchCount} file{matchCount !== 1 ? 's' : ''} matched
        </span>
      </div>

      {/* Answer text */}
      <p className="text-sm text-slate-300 leading-relaxed">{answer}</p>

      {/* Insight */}
      {insight && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.2 }}
          className={cn(
            'mt-3 px-3 py-2 rounded-lg',
            'border-l-2 border-accent-600',
            'bg-space-900/60',
          )}
        >
          <div className="flex items-start gap-2">
            <Lightbulb size={12} className="text-accent-500 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 leading-relaxed">{insight}</p>
          </div>
        </motion.div>
      )}
    </div>
  </motion.div>
))

AnswerCard.displayName = 'AnswerCard'