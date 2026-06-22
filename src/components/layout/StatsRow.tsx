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
        className="glass-card rounded-2xl p-4.5 flex flex-col justify-between min-h-[125px] relative overflow-hidden border border-white/50 dark:border-white/5 shadow-sm"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold text-brandNavy/65 dark:text-slate-400 uppercase tracking-wider">Total Files</span>
            <p className="text-2xs text-brandNavy/50 dark:text-slate-500 mt-0.5 font-medium">Increase compared to 6 months earlier</p>
          </div>
          <button className="text-brandNavy/40 dark:text-slate-500 hover:text-brandNavy dark:hover:text-white transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-white/5">
            <MoreHorizontal size={14} />
          </button>
        </div>

        <div className="flex items-baseline gap-2 mt-4">
          <span className="text-3xl font-display font-bold text-brandNavy dark:text-white">{totalFiles}</span>
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-2xs font-bold text-brandEmerald font-mono">+12.4%</span>
            <span className="text-3xs px-2 py-0.5 rounded-full bg-brandEmerald/10 border border-brandEmerald/20 text-brandEmerald font-bold font-mono">
              +15 New
            </span>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-[0.04] dark:opacity-[0.08] text-brandNavy dark:text-white pointer-events-none transform translate-y-4 translate-x-2">
          <Files size={120} />
        </div>
      </motion.div>

      {/* Storage Managed Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        className="glass-card rounded-2xl p-4.5 flex flex-col justify-between min-h-[125px] relative overflow-hidden border border-white/50 dark:border-white/5 shadow-sm"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold text-brandNavy/65 dark:text-slate-400 uppercase tracking-wider">Storage Index</span>
            <p className="text-2xs text-brandNavy/50 dark:text-slate-500 mt-0.5 font-medium">Redundancy reduction optimal</p>
          </div>
          <button className="text-brandNavy/40 dark:text-slate-500 hover:text-brandNavy dark:hover:text-white transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-white/5">
            <MoreHorizontal size={14} />
          </button>
        </div>

        <div className="flex items-baseline gap-1 mt-4">
          <span className="text-3xl font-display font-bold text-brandNavy dark:text-white">{storage.value}</span>
          <span className="text-sm font-semibold text-brandNavy/65 dark:text-slate-400 font-mono ml-0.5">{storage.unit}</span>
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-2xs font-bold text-brandCoral font-mono">-18.2%</span>
            <span className="text-3xs px-2 py-0.5 rounded-full bg-[#F79256]/10 border border-[#F79256]/20 text-[#F79256] font-bold font-mono">
              Deduplicated
            </span>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-[0.04] text-brandNavy pointer-events-none transform translate-y-4 translate-x-2">
          <HardDrive size={120} />
        </div>
      </motion.div>

      {/* RAG Pipeline Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="glass-card rounded-2xl p-4.5 flex flex-col justify-between min-h-[125px] relative overflow-hidden border border-white/50 dark:border-white/5 shadow-sm"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold text-brandNavy/65 dark:text-slate-400 uppercase tracking-wider">Search Latency</span>
            <p className="text-2xs text-brandNavy/50 dark:text-slate-500 mt-0.5 font-medium">Average semantic lookup time</p>
          </div>
          <button className="text-brandNavy/40 dark:text-slate-500 hover:text-brandNavy dark:hover:text-white transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-white/5">
            <MoreHorizontal size={14} />
          </button>
        </div>

        <div className="flex items-baseline gap-1 mt-4">
          <span className="text-3xl font-display font-bold text-brandNavy dark:text-white">42</span>
          <span className="text-sm font-semibold text-brandNavy/65 dark:text-slate-400 font-mono ml-0.5">ms</span>
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-2xs font-bold text-brandEmerald font-mono">⚡ 99.8%</span>
            <span className="text-3xs px-2 py-0.5 rounded-full bg-brandNavy/5 border border-brandNavy/10 text-brandNavy/70 font-bold font-mono">
              Accuracy
            </span>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-[0.04] text-brandNavy pointer-events-none transform translate-y-4 translate-x-2">
          <Cpu size={120} />
        </div>
      </motion.div>
    </div>
  )
})

StatsRow.displayName = 'StatsRow'
