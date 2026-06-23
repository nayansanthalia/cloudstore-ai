import { motion } from 'framer-motion'
import { memo, useState } from 'react'

interface MonthlyActivity {
  month: string
  queries: number
  heightPercent: number
  isHighlighted?: boolean
  dateLabel?: string
  trendBadge?: string
}

export const SearchActivityChart = memo(() => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(3) // Default highlighted to Dec
  const [timeframe, setTimeframe] = useState<'Monthly' | 'Weekly' | 'Daily'>('Monthly')

  // Generate data based on selected timeframe
  const getActivityData = (): MonthlyActivity[] => {
    switch (timeframe) {
      case 'Weekly':
        return [
          { month: 'W1', queries: 80, heightPercent: 20 },
          { month: 'W2', queries: 150, heightPercent: 40 },
          { month: 'W3', queries: 290, heightPercent: 70 },
          { month: 'W4', queries: 460, heightPercent: 95, isHighlighted: true, dateLabel: 'Week 4', trendBadge: '+91% queries' },
          { month: 'W5', queries: 310, heightPercent: 75 },
          { month: 'W6', queries: 220, heightPercent: 55 },
          { month: 'W7', queries: 190, heightPercent: 45 },
        ]
      case 'Daily':
        return [
          { month: 'Mon', queries: 12, heightPercent: 25 },
          { month: 'Tue', queries: 24, heightPercent: 45 },
          { month: 'Wed', queries: 36, heightPercent: 65 },
          { month: 'Thu', queries: 58, heightPercent: 90, isHighlighted: true, dateLabel: 'Today', trendBadge: 'Peak Activity' },
          { month: 'Fri', queries: 40, heightPercent: 70 },
          { month: 'Sat', queries: 18, heightPercent: 35 },
          { month: 'Sun', queries: 10, heightPercent: 15 },
        ]
      case 'Monthly':
      default:
        return [
          { month: 'Sep', queries: 250, heightPercent: 35 },
          { month: 'Oct', queries: 480, heightPercent: 50 },
          { month: 'Nov', queries: 620, heightPercent: 65 },
          { month: 'Dec', queries: 1250, heightPercent: 88, isHighlighted: true, dateLabel: '08.12.2024', trendBadge: '+46% queries' },
          { month: 'Jan', queries: 920, heightPercent: 82 },
          { month: 'Feb', queries: 740, heightPercent: 70 },
          { month: 'Mar', queries: 680, heightPercent: 60 },
        ]
    }
  }

  const activityData = getActivityData()

  return (
    <div className="glass-card rounded-2xl p-4.5 flex flex-col justify-between flex-1 min-h-[300px] border border-white/50 dark:border-white/5 shadow-sm text-brandNavy dark:text-slate-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-display font-bold text-brandNavy dark:text-white">Search Analytics</h3>
          <p className="text-3xs text-brandNavy/65 dark:text-slate-400 mt-0.5 font-semibold">Tracking queries, response success, and search trends</p>
        </div>
        <select 
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as any)}
          className="text-3xs bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded px-2.5 py-1 text-brandNavy dark:text-slate-200 font-semibold outline-none hover:border-brandNavy/25 dark:hover:border-white/20 cursor-pointer shadow-sm"
        >
          <option value="Monthly">Monthly</option>
          <option value="Weekly">Weekly</option>
          <option value="Daily">Daily</option>
        </select>
      </div>

      {/* SVG Chart Area */}
      <div className="flex-1 flex flex-col justify-between relative mt-2 min-h-[180px]">
        {/* Dotted Y-Axis Helper Lines */}
        <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between pointer-events-none pb-6">
          {[1200, 800, 400, 200].map((val) => (
            <div key={val} className="w-full flex items-center gap-2">
              <span className="text-[8px] text-brandNavy/40 font-mono w-6 text-right font-bold">{val}</span>
              <div className="flex-1 border-t border-dashed border-brandNavy/10" />
            </div>
          ))}
        </div>

        {/* Floating Tooltip matching Sample 1 */}
        {hoveredIdx !== null && (
          <div 
            className="absolute z-20 bg-white dark:bg-[#1E293B] border border-brandNavy/15 dark:border-white/10 rounded-lg px-2.5 py-1 text-center shadow-lg transition-all duration-300"
            style={{
              left: `${14.28 * hoveredIdx + 7.14}%`,
              transform: 'translateX(-50%)',
              top: `${110 - (activityData[hoveredIdx].heightPercent * 1.1)}px`
            }}
          >
            <div className="flex flex-col items-center">
              <span className="text-[8px] text-brandNavy/50 dark:text-slate-400 leading-none font-bold">{activityData[hoveredIdx].dateLabel || 'Active Month'}</span>
              <span className="text-2xs font-bold text-brandNavy dark:text-white mt-0.5 font-mono">{activityData[hoveredIdx].queries} Queries</span>
              {activityData[hoveredIdx].trendBadge && (
                <span className="text-[8px] text-brandEmerald font-bold font-mono mt-0.5">{activityData[hoveredIdx].trendBadge}</span>
              )}
            </div>
            {/* Small tooltip arrow */}
            <div className="w-1.5 h-1.5 bg-white dark:bg-[#1E293B] border-r border-b border-brandNavy/15 dark:border-white/10 rotate-45 transform translate-y-0.5 mx-auto" />
          </div>
        )}

        {/* Bars Container */}
        <div className="flex-1 flex items-end justify-between pl-8 pr-2 pb-6 pt-6 z-10 h-full">
          {activityData.map((item, idx) => {
            return (
              <div
                key={item.month}
                className="flex flex-col items-center flex-1 h-full cursor-pointer relative group"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Bar */}
                <div className="w-7 md:w-9 flex-1 flex items-end">
                  <div className="w-full relative rounded-md overflow-hidden shadow-2xs">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${item.heightPercent}%` }}
                      transition={{ type: 'spring', stiffness: 100, damping: 15, delay: idx * 0.05 }}
                      className="w-full rounded-t-md origin-bottom relative"
                      style={{
                        height: '100%',
                        background: item.isHighlighted
                          ? 'linear-gradient(to top, rgba(14, 192, 115, 0.3), rgba(14, 192, 115, 0.8))'
                          : 'linear-gradient(to top, rgba(131, 233, 255, 0.2), rgba(131, 233, 255, 0.8))',
                        border: item.isHighlighted ? '1px solid rgba(14, 192, 115, 0.5)' : '1px solid rgba(31, 55, 83, 0.15)'
                      }}
                    >
                      {/* Striped Diagonal Pattern matching Sample 1 */}
                      {item.isHighlighted && (
                        <div 
                          className="absolute inset-0 opacity-20"
                          style={{
                            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,1) 4px, rgba(255,255,255,1) 8px)`
                          }}
                        />
                      )}
                    </motion.div>
                  </div>
                </div>

                {/* X-Axis Label */}
                <span className="text-[10px] font-bold text-brandNavy/50 dark:text-slate-500 mt-2 absolute bottom-[-20px]">
                  {item.month}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
})

SearchActivityChart.displayName = 'SearchActivityChart'
