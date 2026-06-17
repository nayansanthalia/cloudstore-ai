import { motion } from 'framer-motion'
import { Activity, Database, Files, HardDrive } from 'lucide-react'
import { memo } from 'react'

import { APP_NAME, APP_TAGLINE } from '@/constants'
import { STORAGE_STATS } from '@/features/storage/data/mockFiles'
import { cn } from '@/utils/cn'

// ─── Stat Pill ─────────────────────────────────────────────────────────────

interface StatPillProps {
  icon: React.ReactNode
  value: string
  label: string
  index: number
}

const StatPill = memo(({ icon, value, label, index }: StatPillProps) => (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
    className={cn(
      'flex items-center gap-2 px-3 py-1.5 rounded-lg',
      'bg-space-600 border border-space-300',
      'hover:border-space-200 transition-colors duration-150',
    )}
  >
    <span className="text-brand-500 w-3.5 h-3.5 shrink-0">{icon}</span>
    <span className="text-xs font-bold text-brand-400 font-mono">{value}</span>
    <span className="text-2xs text-slate-600">{label}</span>
  </motion.div>
))
StatPill.displayName = 'StatPill'

// ─── Online Status Dot ─────────────────────────────────────────────────────

const StatusDot = memo(() => (
  <span className="relative flex h-2 w-2">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
  </span>
))
StatusDot.displayName = 'StatusDot'

// ─── Header Component ──────────────────────────────────────────────────────

export const Header = memo(() => {
  const stats = [
    {
      icon: <Files size={14} />,
      value: String(STORAGE_STATS.totalFiles),
      label: 'Files',
    },
    {
      icon: <Database size={14} />,
      value: String(STORAGE_STATS.totalFolders),
      label: 'Folders',
    },
    {
      icon: <HardDrive size={14} />,
      value: STORAGE_STATS.totalSizeLabel,
      label: 'Indexed',
    },
    {
      icon: <Activity size={14} />,
      value: '10K',
      label: 'Q/day',
    },
  ]

  return (
    <header
      className={cn(
        'flex items-center gap-3 px-5 shrink-0 z-10',
        'border-b border-space-300',
        'bg-gradient-to-b from-space-800 to-space-900',
      )}
      style={{ height: 'var(--header-h)' }}
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-3 shrink-0"
      >
        <div
          className={cn(
            'w-8 h-8 rounded-lg shrink-0',
            'bg-gradient-to-br from-brand-600 to-accent-600',
            'flex items-center justify-center',
            'shadow-glow-sm',
          )}
        >
          <span className="text-white text-base leading-none select-none">☁</span>
        </div>
        <div>
          <h1 className="font-display font-bold text-sm text-slate-200 tracking-tight leading-tight">
            {APP_NAME}
          </h1>
          <p className="text-2xs text-slate-600 leading-tight">{APP_TAGLINE}</p>
        </div>
      </motion.div>

      {/* Divider */}
      <div className="h-6 w-px bg-space-300 mx-1 shrink-0" />

      {/* RAG Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-1.5 text-2xs text-slate-600"
      >
        <StatusDot />
        <span>RAG Engine</span>
      </motion.div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Stats */}
      <div className="flex items-center gap-2">
        {stats.map((stat, i) => (
          <StatPill key={stat.label} {...stat} index={i} />
        ))}
      </div>
    </header>
  )
})

Header.displayName = 'Header'