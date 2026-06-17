import { AnimatePresence, motion } from 'framer-motion'
import { Command, Loader2, Search, X } from 'lucide-react'
import { memo, useCallback, useEffect, useRef, useState } from 'react'

import { MAX_QUERY_LENGTH, SUGGESTED_QUERIES } from '@/constants'
import { useAIQuery } from '@/features/query/hooks/useAIQuery'
import { cn } from '@/utils/cn'

// ─── Suggestion Chip ───────────────────────────────────────────────────────

interface SuggestionChipProps {
  label: string
  onClick: () => void
  index: number
}

const SuggestionChip = memo(({ label, onClick, index }: SuggestionChipProps) => (
  <motion.button
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.1 + index * 0.03 }}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className={cn(
      'px-3 py-1 rounded-full text-2xs font-medium',
      'border border-space-300 text-slate-600',
      'hover:border-brand-600/50 hover:text-slate-300 hover:bg-brand-950/40',
      'transition-all duration-150 whitespace-nowrap',
      'focus-visible:outline-brand-500',
    )}
  >
    {label}
  </motion.button>
))
SuggestionChip.displayName = 'SuggestionChip'

// ─── QueryBar Component ────────────────────────────────────────────────────

export const QueryBar = memo(() => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  const { query, isLoading, setQuery, executeQuery, handleSuggestion, cancelQuery, clearResult, clearError } =
    useAIQuery()

  // ⌘K / Ctrl+K shortcut to focus
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
      if (e.key === 'Escape' && isLoading) {
        cancelQuery()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isLoading, cancelQuery])

  const handleSubmit = useCallback(() => {
    void executeQuery(query)
  }, [query, executeQuery])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
      if (e.key === 'Escape') {
        if (isLoading) cancelQuery()
        else inputRef.current?.blur()
      }
    },
    [handleSubmit, isLoading, cancelQuery],
  )

  const handleClear = useCallback(() => {
    setQuery('')
    clearResult()
    clearError()
    inputRef.current?.focus()
  }, [setQuery, clearResult, clearError])

  const canSubmit = query.trim().length > 0 && !isLoading

  return (
    <div
      className={cn(
        'px-5 pt-4 pb-3 shrink-0',
        'border-b border-space-300 bg-space-800',
      )}
    >
      {/* Search Input */}
      <motion.div
        animate={{
          borderColor: isLoading
            ? 'rgba(37, 99, 235, 0.7)'
            : isFocused
              ? 'rgba(37, 99, 235, 0.4)'
              : 'rgba(18, 32, 53, 1)',
          boxShadow: isLoading
            ? '0 0 0 3px rgba(37, 99, 235, 0.15)'
            : isFocused
              ? '0 0 0 2px rgba(37, 99, 235, 0.1)'
              : '0 0 0 0px transparent',
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          'flex items-center gap-3 px-4 rounded-xl',
          'bg-space-600 border',
          'transition-colors duration-200',
        )}
        style={{ height: 48 }}
      >
        {/* Icon */}
        <div className="shrink-0 text-brand-500">
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Search size={16} />
          )}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder='Ask your storage anything — "Find invoices above ₹10,000 from January"'
          maxLength={MAX_QUERY_LENGTH}
          disabled={isLoading}
          className={cn(
            'flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600',
            'outline-none border-none',
            'disabled:opacity-60',
          )}
          aria-label="Search cloud storage with natural language"
          autoComplete="off"
          spellCheck={false}
        />

        {/* Character count (shows near limit) */}
        <AnimatePresence>
          {query.length > MAX_QUERY_LENGTH * 0.8 && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                'text-2xs font-mono shrink-0',
                query.length >= MAX_QUERY_LENGTH ? 'text-rose-500' : 'text-slate-700',
              )}
            >
              {query.length}/{MAX_QUERY_LENGTH}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Clear button */}
        <AnimatePresence>
          {query.length > 0 && !isLoading && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className={cn(
                'shrink-0 w-5 h-5 rounded-full flex items-center justify-center',
                'text-slate-700 hover:text-slate-400 hover:bg-space-400',
                'transition-all duration-150',
              )}
            >
              <X size={12} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Keyboard hint (desktop only) */}
        {!isLoading && query.length === 0 && (
          <div className="hidden md:flex items-center gap-0.5 shrink-0 text-slate-800">
            <Command size={10} />
            <span className="text-2xs">K</span>
          </div>
        )}

        {/* Divider */}
        <div className="h-5 w-px bg-space-300 shrink-0" />

        {/* Submit / Cancel Button */}
        <motion.button
          whileHover={canSubmit ? { scale: 1.02 } : {}}
          whileTap={canSubmit ? { scale: 0.98 } : {}}
          onClick={isLoading ? cancelQuery : handleSubmit}
          disabled={!canSubmit && !isLoading}
          className={cn(
            'shrink-0 h-9 px-4 rounded-lg text-xs font-semibold',
            'transition-all duration-200',
            isLoading
              ? 'bg-rose-600/20 text-rose-400 border border-rose-600/30 hover:bg-rose-600/30'
              : canSubmit
                ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-glow-sm'
                : 'bg-space-500 text-slate-700 cursor-not-allowed',
          )}
        >
          {isLoading ? 'Cancel' : 'Ask AI →'}
        </motion.button>
      </motion.div>

      {/* Suggestion Chips */}
      <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-0.5 no-scrollbar">
        <span className="text-2xs text-slate-800 shrink-0">Try:</span>
        {SUGGESTED_QUERIES.slice(0, 6).map((s, i) => (
          <SuggestionChip
            key={s}
            label={s}
            index={i}
            onClick={() => handleSuggestion(s)}
          />
        ))}
      </div>
    </div>
  )
})

QueryBar.displayName = 'QueryBar'