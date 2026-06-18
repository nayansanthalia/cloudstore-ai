import { motion } from 'framer-motion'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { memo } from 'react'

export const SmartAIInsights = memo(() => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl overflow-hidden min-h-[300px] flex flex-col justify-between p-4.5 relative"
      style={{
        background: 'rgba(13, 27, 49, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}
    >

      {/* Floating Header Badges */}
      <div className="flex items-start justify-between w-full z-10">
        <span className="text-3xs font-semibold px-2 py-0.5 rounded bg-space-950/60 border border-space-300 text-slate-400">
          High Accuracy
        </span>
        <span className="text-3xs font-bold px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
          <Sparkles size={8} /> +12% Expected
        </span>
      </div>

      {/* Center 3D-like Glowing Sphere with Lightning Bolt */}
      <div className="relative flex items-center justify-center flex-1 my-4">
        {/* Glow behind sphere */}
        <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-emerald-500/20 to-purple-500/20 blur-xl animate-pulse-glow pointer-events-none" />

        {/* Sphere Container */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(200, 255, 230, 0.2), rgba(16, 185, 129, 0.8) 40%, rgba(5, 40, 30, 1) 90%)',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.45), inset 0 2px 10px rgba(255, 255, 255, 0.3), inset -2px -2px 15px rgba(0, 0, 0, 0.8)'
          }}
        >
          {/* Animated lightning bolt */}
          <motion.svg
            animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-10 h-10 text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </motion.svg>
        </motion.div>
      </div>

      {/* Glassmorphic Panel at Bottom matching Sample 1 */}
      <div className="glass-strong rounded-xl p-3 w-full z-10 flex items-center justify-between border border-white/5">
        <div className="min-w-0">
          <h4 className="text-xs font-display font-semibold text-slate-100 flex items-center gap-1">
            Smart AI Insights
          </h4>
          <p className="text-[10px] text-slate-400 mt-0.5 leading-normal truncate pr-2">
            Your storage needs are likely to increase by 12% next month.
          </p>
        </div>

        <button className="w-7 h-7 rounded-full bg-slate-100 text-slate-950 flex items-center justify-center shrink-0 hover:bg-white transition-colors">
          <ArrowUpRight size={14} />
        </button>
      </div>
    </motion.div>
  )
})

SmartAIInsights.displayName = 'SmartAIInsights'
