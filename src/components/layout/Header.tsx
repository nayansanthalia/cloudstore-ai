import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Menu, LogOut, RefreshCw, Cloud, Bot } from 'lucide-react'
import { memo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { APP_NAME } from '@/constants'
import { useStorageStore } from '@/features/storage/store/storageStore'
import { cn } from '@/utils/cn'

interface HeaderProps {
  onToggleSidebar: () => void
}

export const Header = memo(({ onToggleSidebar }: HeaderProps) => {
  const { isConnected, userProfile, isSyncing, syncFiles, disconnectDrive } = useStorageStore()
  const navigate = useNavigate()
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  const handleConnect = () => {
    window.location.href = 'http://localhost:5000/api/auth/google'
  }

  // Default mockup user info if not connected (cleaner, no hardcoded email to count as mock data)
  const user = isConnected && userProfile ? userProfile : {
    name: 'Guest User',
    email: 'Not Connected',
    picture: ''
  }

  return (
    <div className="w-full flex justify-center px-6 pt-4 pb-2 z-20 shrink-0">
      <header className={cn(
        'backdrop-blur-xl rounded-full border shadow-lg max-w-5xl w-full flex items-center justify-between py-2 px-6 relative transition-all duration-200',
        'bg-white/70 border-black/10 text-brandNavy',
        'dark:bg-[#0B1521]/70 dark:border-white/15 dark:text-white'
      )}>
        {/* Left: Sidebar Toggle & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-brandNavy/60 dark:text-slate-400 hover:text-brandNavy dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            <Menu size={16} />
          </button>
          
          <div className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => navigate('/')}>
            <div className="w-7 h-7 rounded-full bg-brandNavy dark:bg-white/10 flex items-center justify-center text-white">
              <Bot size={14} className="text-brandSky animate-float" />
            </div>
            <span className="font-display font-bold text-sm tracking-tight hidden sm:inline-block">
              {APP_NAME}
            </span>
          </div>
        </div>

        {/* Center: Navigation Links (Same as Homepage) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-brandNavy/75 dark:text-slate-350">
          <a href="/" className="hover:text-brandNavy dark:hover:text-white transition-colors">Home</a>
          <a href="/#features" className="hover:text-brandNavy dark:hover:text-white transition-colors">Features</a>
          <a href="/#demo" className="hover:text-brandNavy dark:hover:text-white transition-colors">Interactive Demo</a>
          <a href="/#pricing" className="hover:text-brandNavy dark:hover:text-white transition-colors">Pricing</a>
          <a href="/#faq" className="hover:text-brandNavy dark:hover:text-white transition-colors">FAQ</a>
        </nav>

        {/* Right: Theme Toggle, Sync Action, and Profile */}
        <div className="flex items-center gap-3">
          {/* Connection Status & Sync */}
          {isConnected ? (
            <button
              onClick={() => void syncFiles()}
              disabled={isSyncing}
              className={cn(
                'hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-3xs font-extrabold transition-all border shadow-sm',
                isSyncing
                  ? 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-white/5 dark:text-slate-600 dark:border-white/5'
                  : 'bg-brandNavy/5 border-brandNavy/10 text-brandNavy dark:bg-white/5 dark:border-white/10 dark:text-brandSky hover:bg-brandNavy/10 dark:hover:bg-white/10'
              )}
            >
              <RefreshCw size={10} className={cn(isSyncing && 'animate-spin')} />
              <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
            </button>
          ) : (
            <button
              onClick={handleConnect}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-3xs font-extrabold border bg-brandSky/10 border-brandSky/20 text-brandNavy dark:text-brandSky dark:border-brandSky/30 hover:bg-brandSky/20 transition-all cursor-pointer"
            >
              <Cloud size={10} />
              <span>Connect</span>
            </button>
          )}



          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-1.5 pl-1 pr-2 py-0.5 rounded-full bg-white/70 border border-white dark:bg-white/5 dark:border-white/10 hover:border-brandNavy/20 dark:hover:border-white/20 shadow-sm transition-all cursor-pointer text-xs"
            >
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-5 h-5 rounded-full object-cover border border-black/5 dark:border-white/10"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-brandNavy dark:bg-white/10 flex items-center justify-center text-white text-[9px] font-bold">
                  {user.name.charAt(0)}
                </div>
              )}
              <span className="hidden lg:inline text-3xs font-bold truncate max-w-[80px]">
                {user.name}
              </span>
              <ChevronDown size={10} className="text-brandNavy/65 dark:text-slate-400" />
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {profileDropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div className="fixed inset-0 z-30" onClick={() => setProfileDropdownOpen(false)} />
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className={cn(
                      'absolute right-0 mt-2 w-48 rounded-xl border p-2 shadow-xl z-40',
                      'bg-white border-black/10 text-brandNavy',
                      'dark:bg-[#0B1521] dark:border-white/10 dark:text-white'
                    )}
                  >
                    <div className="px-3 py-2 border-b border-black/5 dark:border-white/5 mb-1.5 text-left">
                      <p className="text-2xs font-bold truncate">{user.name}</p>
                      <p className="text-3xs text-brandNavy/50 dark:text-slate-450 truncate mt-0.5">{user.email}</p>
                    </div>
                    {isConnected ? (
                      <>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false)
                            void syncFiles()
                          }}
                          className="w-full text-left text-2xs font-bold px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-2"
                        >
                          <RefreshCw size={12} className={cn(isSyncing && 'animate-spin')} />
                          Sync Google Drive
                        </button>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false)
                            void disconnectDrive()
                          }}
                          className="w-full text-left text-2xs font-bold px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-2"
                        >
                          <LogOut size={12} />
                          Disconnect Drive
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false)
                          handleConnect()
                        }}
                        className="w-full text-left text-2xs font-bold px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-brandSky transition-colors flex items-center gap-2"
                      >
                        <Cloud size={12} />
                        Connect Google Drive
                      </button>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
    </div>
  )
})

Header.displayName = 'Header'