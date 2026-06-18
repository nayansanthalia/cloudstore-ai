import { motion } from 'framer-motion'
import { Bell, ChevronDown } from 'lucide-react'
import { memo } from 'react'

import { APP_NAME, APP_TAGLINE } from '@/constants'
import { useStorageStore } from '@/features/storage/store/storageStore'
import { cn } from '@/utils/cn'

// ─── Team Avatars ──────────────────────────────────────────────────────────

const TeamAvatars = memo(() => (
  <div className="flex items-center -space-x-2 shrink-0">
    {[
      { src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80', alt: 'Sarah' },
      { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80', alt: 'Michael' },
      { src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80', alt: 'Emma' },
    ].map((u, i) => (
      <img
        key={i}
        src={u.src}
        alt={u.alt}
        className="w-6 h-6 rounded-full border border-space-900 object-cover"
      />
    ))}
    <div className="w-6 h-6 rounded-full bg-space-600 border border-space-300 flex items-center justify-center text-[10px] font-bold text-slate-400">
      +3
    </div>
  </div>
))
TeamAvatars.displayName = 'TeamAvatars'

// ─── Header Component ──────────────────────────────────────────────────────

export const Header = memo(() => {
  const { isConnected, userProfile } = useStorageStore()

  // Default mockup user info if not connected
  const mockUser = {
    name: 'Alex Williamson',
    email: 'williamson213@gmail.com',
    picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=80',
  }

  const user = isConnected && userProfile ? userProfile : mockUser

  return (
    <header
      className={cn(
        'flex items-center justify-between px-5 shrink-0 z-10',
        'border-b border-space-300',
        'bg-space-900/60 backdrop-blur-md',
      )}
      style={{ height: 'var(--header-h)' }}
    >
      {/* Left: Brand Logo */}
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

      {/* Right: Actions, Avatars, Notifications, User Profile */}
      <div className="flex items-center gap-5">
        {/* Avatars group */}
        <TeamAvatars />

        {/* Vertical divider */}
        <div className="h-4 w-px bg-space-300" />

        {/* Icons */}
        <div className="flex items-center gap-3 text-slate-400">
          {/* Status icon */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-space-800 border border-space-300 text-3xs font-semibold">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span className="text-slate-500">{isConnected ? 'Drive Sync' : 'Mock Preview'}</span>
          </div>

          {/* Notifications bell */}
          <button className="relative p-1 rounded-md hover:bg-space-600 hover:text-slate-200 transition-colors">
            <Bell size={15} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-rose-500 rounded-full" />
          </button>
        </div>

        {/* Vertical divider */}
        <div className="h-4 w-px bg-space-300" />

        {/* User Card matching Sample 1 */}
        <div className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-full bg-space-800/80 border border-space-300 hover:border-space-200 transition-all cursor-pointer">
          <img
            src={user.picture}
            alt={user.name}
            className="w-7 h-7 rounded-full object-cover border border-brand-500/20"
            referrerPolicy="no-referrer"
          />
          <div className="hidden sm:flex flex-col text-left leading-none">
            <span className="text-2xs font-bold text-slate-300 truncate max-w-[100px]">
              {user.name}
            </span>
            <span className="text-3xs text-slate-600 truncate max-w-[120px] mt-0.5">
              {user.email}
            </span>
          </div>
          <ChevronDown size={11} className="text-slate-500" />
        </div>
      </div>
    </header>
  )
})

Header.displayName = 'Header'