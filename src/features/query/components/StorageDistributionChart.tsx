import { motion } from 'framer-motion'
import { memo, useState } from 'react'

interface StorageData {
  folder: string
  count: number
  countPercent: number
  size: string
  sizePercent: number
  color: string
}

export const StorageDistributionChart = memo(() => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [timeframe, setTimeframe] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Monthly')
  
  // Custom styled storage data representing our folder distribution
  const getData = (): StorageData[] => {
    switch (timeframe) {
      case 'Weekly':
        return [
          { folder: 'Invoices', count: 18, countPercent: 42, size: '0.4 GB', sizePercent: 28, color: '#F59E0B' },
          { folder: 'Resumes', count: 32, countPercent: 78, size: '0.2 GB', sizePercent: 15, color: '#10B981' },
          { folder: 'Reports', count: 8, countPercent: 25, size: '0.9 GB', sizePercent: 62, color: '#3B82F6' },
          { folder: 'Contracts', count: 12, countPercent: 35, size: '0.6 GB', sizePercent: 48, color: '#8B5CF6' },
          { folder: 'Projects', count: 9, countPercent: 30, size: '0.3 GB', sizePercent: 20, color: '#EF4444' },
        ]
      case 'Yearly':
        return [
          { folder: 'Invoices', count: 420, countPercent: 88, size: '12.4 GB', sizePercent: 75, color: '#F59E0B' },
          { folder: 'Resumes', count: 580, countPercent: 95, size: '5.8 GB', sizePercent: 35, color: '#10B981' },
          { folder: 'Reports', count: 180, countPercent: 70, size: '24.2 GB', sizePercent: 92, color: '#3B82F6' },
          { folder: 'Contracts', count: 290, countPercent: 62, size: '14.1 GB', sizePercent: 68, color: '#8B5CF6' },
          { folder: 'Projects', count: 140, countPercent: 55, size: '6.3 GB', sizePercent: 42, color: '#EF4444' },
        ]
      case 'Monthly':
      default:
        return [
          { folder: 'Invoices', count: 85, countPercent: 78, size: '2.4 GB', sizePercent: 68, color: '#F59E0B' },
          { folder: 'Resumes', count: 124, countPercent: 92, size: '1.2 GB', sizePercent: 45, color: '#10B981' },
          { folder: 'Reports', count: 42, countPercent: 65, size: '4.8 GB', sizePercent: 88, color: '#3B82F6' },
          { folder: 'Contracts', count: 68, countPercent: 54, size: '3.1 GB', sizePercent: 58, color: '#8B5CF6' },
          { folder: 'Projects', count: 35, countPercent: 48, size: '1.3 GB', sizePercent: 35, color: '#EF4444' },
        ]
    }
  }

  const data = getData()

  return (
    <div className="glass-card rounded-2xl p-4.5 flex flex-col justify-between flex-1 min-h-[300px]">
      {/* Header & Dropdown */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-display font-semibold text-slate-200">Storage Distribution</h3>
          <p className="text-3xs text-slate-500 mt-0.5">Tracking index size vs. document counts across categories</p>
        </div>
        <select 
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as any)}
          className="text-3xs bg-space-600 border border-space-300 rounded px-1.5 py-0.5 text-slate-400 outline-none hover:border-space-200 cursor-pointer"
        >
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-3xs font-semibold mb-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-slate-400">File Count Share</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-400" />
          <span className="text-slate-400">Index Size Share</span>
        </div>
      </div>

      {/* Dotted scale indicator */}
      <div className="relative flex-1 flex flex-col justify-between py-2">
        {/* Scale lines */}
        <div className="absolute inset-y-0 inset-x-0 flex justify-between pointer-events-none">
          {[0, 20, 40, 60, 80, 100].map((val) => (
            <div key={val} className="flex flex-col items-center h-full relative">
              <div className="w-px h-[90%] border-l border-dashed border-space-300/30" />
              <span className="text-[9px] text-slate-700 font-mono mt-1 absolute bottom-0">{val}</span>
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-4.5 z-10 pr-4 pl-1">
          {data.map((item, idx) => (
            <div 
              key={item.folder} 
              className="flex items-center gap-3 relative group"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Folder Label */}
              <span className="text-2xs font-semibold text-slate-400 w-14 truncate" style={{ color: item.color }}>
                {item.folder}
              </span>

              {/* Stacked Progress Bars */}
              <div className="flex-1 flex flex-col gap-1.5 relative py-1">
                {/* File Count Share Bar */}
                <div className="h-2 w-full bg-space-900/40 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.countPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.08 }}
                    className="h-full bg-gradient-to-r from-emerald-500/80 to-emerald-400 rounded-full"
                  />
                </div>

                {/* Index Size Share Bar */}
                <div className="h-2 w-full bg-space-900/40 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.sizePercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.08 + 0.05 }}
                    className="h-full bg-gradient-to-r from-rose-500/80 to-rose-400 rounded-full"
                  />
                </div>
              </div>

              {/* Tooltip Hover Badge matching Sample 1 */}
              {hoveredIdx === idx && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute z-20 left-[60%] top-[-25px] transform -translate-x-1/2 bg-slate-950/95 border border-space-200 px-2.5 py-1 rounded-lg shadow-xl flex items-center gap-2 text-[10px] font-bold font-mono"
                >
                  <span className="text-emerald-400">{item.count} docs ({item.countPercent}%)</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-rose-400">{item.size} ({item.sizePercent}%)</span>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

StorageDistributionChart.displayName = 'StorageDistributionChart'
