import { motion } from 'framer-motion'
import { Files, HardDrive, Cpu, MoreHorizontal } from 'lucide-react'
import { memo } from 'react'
import { useStorageStore } from '@/features/storage/store/storageStore'

export const StatsRow = memo(() => {
  const { files } = useStorageStore()

  // Dynamic calculations
  const totalFiles = files.length
  const totalSizeBytes = files.reduce((acc, f) => acc + (f.sizeBytes || 0), 0)

  const formatBytes = (bytes: number): { value: string; unit: string } => {
    if (bytes === 0) return { value: '0', unit: 'KB' }
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return {
      value: parseFloat((bytes / Math.pow(k, i)).toFixed(2)).toString(),
      unit: sizes[i]
    }
  }

  const storage = formatBytes(totalSizeBytes)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-4.5">
      {/* Total Files Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card rounded-2xl p-4.5 flex flex-col justify-between min-h-[125px] relative overflow-hidden"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Files</span>
            <p className="text-2xs text-slate-500 mt-0.5">Increase compared to 6 months earlier</p>
          </div>
          <button className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-md hover:bg-space-500/30">
            <MoreHorizontal size={14} />
          </button>
        </div>

        <div className="flex items-baseline gap-2 mt-4">
          <span className="text-3xl font-display font-semibold text-slate-100">{totalFiles}</span>
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-2xs font-bold text-emerald-400 font-mono">+12.4%</span>
            <span className="text-3xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold font-mono">
              +15 New
            </span>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-[0.02] text-slate-100 pointer-events-none transform translate-y-4 translate-x-2">
          <Files size={120} />
        </div>
      </motion.div>

      {/* Storage Managed Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        className="glass-card rounded-2xl p-4.5 flex flex-col justify-between min-h-[125px] relative overflow-hidden"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Storage Index</span>
            <p className="text-2xs text-slate-500 mt-0.5">Redundancy reduction optimal</p>
          </div>
          <button className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-md hover:bg-space-500/30">
            <MoreHorizontal size={14} />
          </button>
        </div>

        <div className="flex items-baseline gap-1 mt-4">
          <span className="text-3xl font-display font-semibold text-slate-100">{storage.value}</span>
          <span className="text-sm font-semibold text-slate-400 font-mono ml-0.5">{storage.unit}</span>
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-2xs font-bold text-rose-400 font-mono">-18.2%</span>
            <span className="text-3xs px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-semibold font-mono">
              Deduplicated
            </span>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-[0.02] text-slate-100 pointer-events-none transform translate-y-4 translate-x-2">
          <HardDrive size={120} />
        </div>
      </motion.div>

      {/* RAG Pipeline Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="glass-card rounded-2xl p-4.5 flex flex-col justify-between min-h-[125px] relative overflow-hidden"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Search Latency</span>
            <p className="text-2xs text-slate-500 mt-0.5">Average semantic lookup time</p>
          </div>
          <button className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-md hover:bg-space-500/30">
            <MoreHorizontal size={14} />
          </button>
        </div>

        <div className="flex items-baseline gap-1 mt-4">
          <span className="text-3xl font-display font-semibold text-slate-100">42</span>
          <span className="text-sm font-semibold text-slate-400 font-mono ml-0.5">ms</span>
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-2xs font-bold text-emerald-400 font-mono">⚡ 99.8%</span>
            <span className="text-3xs px-2 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 font-semibold font-mono">
              Accuracy
            </span>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-[0.02] text-slate-100 pointer-events-none transform translate-y-4 translate-x-2">
          <Cpu size={120} />
        </div>
      </motion.div>
    </div>
  )
})

StatsRow.displayName = 'StatsRow'
