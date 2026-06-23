import { memo } from 'react'
import { cn } from '@/utils/cn'
import { APP_VERSION, ANTHROPIC_MODEL } from '@/constants'
import { useStorageStore } from '@/features/storage/store/storageStore'

export const Footer = memo(() => {
  const { files } = useStorageStore()
  
  return (
    <footer
      className={cn(
        'flex items-center gap-2 px-5 shrink-0',
        'border-t border-white/50 dark:border-white/5 bg-white/45 dark:bg-[#0B1521]/70 backdrop-blur-md shadow-sm',
        'text-2xs text-brandNavy/50 dark:text-slate-400',
      )}
      style={{ height: 'var(--footer-h)' }}
    >
      {/* Status */}
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brandEmerald opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brandEmerald" />
      </span>
      <span className="text-brandNavy/60 dark:text-slate-300">RAG Engine Active</span>
      <Dot />
      <span>Pinecone · OpenAI ada-002 · {ANTHROPIC_MODEL}</span>
      <Dot />
      <span>{files.length} file{files.length !== 1 ? 's' : ''} indexed</span>

      <div className="flex-1" />

      <span className="text-brandNavy/40 dark:text-slate-500 font-medium">v{APP_VERSION} · Demo</span>
    </footer>
  )
})

Footer.displayName = 'Footer'

const Dot = () => <span className="text-brandNavy/30 dark:text-slate-600">·</span>