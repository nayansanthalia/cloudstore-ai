import { motion } from 'framer-motion'
import { Bell, ChevronDown, Moon, Sun } from 'lucide-react'
import { memo } from 'react'

import { APP_NAME, APP_TAGLINE } from '@/constants'
import { useStorageStore } from '@/features/storage/store/storageStore'
import { useThemeStore } from '@/store/themeStore'
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
        className="w-6 h-6 rounded-full border border-space-900 dark:border-slate-800 object-cover"
      />
    ))}
    <div className="w-6 h-6 rounded-full bg-space-600 border border-space-300 dark:bg-slate-800 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400 dark:text-slate-300">
      +3
    </div>
  </div>
))
TeamAvatars.displayName = 'TeamAvatars'

// ─── Header Component ──────────────────────────────────────────────────────

export const Header = memo(() => {
  const { isConnected, userProfile } = useStorageStore()
  const { theme, toggleTheme } = useThemeStore()

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
        'border-b border-white/50 dark:border-white/5',
        'bg-white/45 dark:bg-[#0B1521]/70 backdrop-blur-md shadow-sm',
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
            'bg-brandNavy dark:bg-white/10',
            'flex items-center justify-center',
            'shadow-sm',
          )}
        >
          <span className="text-[#83E9FF] text-base leading-none select-none">☁</span>
        </div>
        <div>
          <h1 className="font-display font-bold text-sm text-brandNavy dark:text-white tracking-tight leading-tight">
            {APP_NAME}
          </h1>
          <p className="text-2xs text-brandNavy/65 dark:text-slate-400 leading-tight">{APP_TAGLINE}</p>
        </div>
      </motion.div>

      {/* Right: Actions, Avatars, Notifications, User Profile */}
      <div className="flex items-center gap-5">
        {/* Avatars group */}
        <TeamAvatars />

        {/* Vertical divider */}
        <div className="h-4 w-px bg-brandNavy/10 dark:bg-white/10" />

        {/* Icons */}
        <div className="flex items-center gap-3 text-brandNavy/60 dark:text-slate-400">
          {/* Status icon */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/60 border border-white/80 dark:bg-white/5 dark:border-white/10 text-3xs font-semibold shadow-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brandEmerald opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brandEmerald" />
            </span>
            <span className="text-brandNavy/60 dark:text-slate-300">{isConnected ? 'Drive Sync' : 'Mock Preview'}</span>
          </div>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="p-1 rounded-md hover:bg-white/60 hover:text-brandNavy dark:hover:bg-white/10 dark:hover:text-white transition-colors text-brandNavy/60 dark:text-slate-400"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          {/* Notifications bell */}
          <button className="relative p-1 rounded-md hover:bg-white/60 hover:text-brandNavy dark:hover:bg-white/10 dark:hover:text-white transition-colors">
            <Bell size={15} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#F79256] rounded-full" />
          </button>
        </div>

        {/* Vertical divider */}
        <div className="h-4 w-px bg-brandNavy/10 dark:bg-white/10" />

        {/* User Card matching Sample 1 */}
        <div className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-full bg-white/70 border border-white dark:bg-white/5 dark:border-white/10 hover:border-brandNavy/20 dark:hover:border-white/20 shadow-sm transition-all cursor-pointer">
          <img
            src={user.picture}
            alt={user.name}
            className="w-7 h-7 rounded-full object-cover border border-brandNavy/10 dark:border-white/10"
            referrerPolicy="no-referrer"
          />
          <div className="hidden sm:flex flex-col text-left leading-none">
            <span className="text-2xs font-bold text-brandNavy dark:text-white truncate max-w-[100px]">
              {user.name}
            </span>
            <span className="text-3xs text-brandNavy/60 dark:text-slate-400 truncate max-w-[120px] mt-0.5">
              {user.email}
            </span>
          </div>
          <ChevronDown size={11} className="text-brandNavy/65 dark:text-slate-400" />
        </div>
      </div>
    </header>
  )
})

Header.displayName = 'Header'