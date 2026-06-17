import { memo } from 'react'
import { cn } from '@/utils/cn'
import { APP_VERSION, ANTHROPIC_MODEL } from '@/constants'
import { MOCK_FILES } from '@/features/storage/data/mockFiles'

export const Footer = memo(() => (
  <footer
    className={cn(
      'flex items-center gap-2 px-5 shrink-0',
      'border-t border-space-300 bg-space-800',
      'text-2xs text-slate-800',
    )}
    style={{ height: 'var(--footer-h)' }}
  >
    {/* Status */}
    <span className="relative flex h-1.5 w-1.5 shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
    </span>
    <span className="text-slate-700">RAG Engine Active</span>
    <Dot />
    <span>Pinecone · OpenAI ada-002 · {ANTHROPIC_MODEL}</span>
    <Dot />
    <span>{MOCK_FILES.length} files indexed</span>

    <div className="flex-1" />

    <span className="text-space-300">v{APP_VERSION} · Demo</span>
  </footer>
))

Footer.displayName = 'Footer'

const Dot = () => <span className="text-space-300">·</span>