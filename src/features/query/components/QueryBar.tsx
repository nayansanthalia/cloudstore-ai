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
      'px-3 py-1 rounded-full text-2xs font-bold shadow-2xs',
      'border border-white/80 text-brandNavy/65 bg-white/40',
      'hover:border-brandNavy/35 hover:text-brandNavy hover:bg-white',
      'transition-all duration-150 whitespace-nowrap',
      'focus-visible:outline-brandNavy',
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
        'border-b border-white/50 bg-white/45 backdrop-blur-md',
      )}
    >
      {/* Search Input */}
      <motion.div
        animate={{
          borderColor: isLoading
            ? 'rgba(14, 192, 115, 0.7)'
            : isFocused
              ? 'rgba(31, 55, 83, 0.4)'
              : 'rgba(255, 255, 255, 0.7)',
          boxShadow: isLoading
            ? '0 0 16px rgba(14, 192, 115, 0.15)'
            : isFocused
              ? '0 0 16px rgba(31, 55, 83, 0.05)'
              : '0 0 0px transparent',
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          'flex items-center gap-3 px-4 rounded-xl shadow-inner bg-white/50 border border-white/70',
          'transition-all duration-200',
        )}
        style={{ height: 48 }}
      >
        {/* Icon */}
        <div className="shrink-0 text-brandNavy/60">
          {isLoading ? (
            <Loader2 size={16} className="animate-spin text-brandEmerald" />
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
            'flex-1 bg-transparent text-sm text-brandNavy font-semibold placeholder-brandNavy/40',
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
                query.length >= MAX_QUERY_LENGTH ? 'text-rose-500 font-bold' : 'text-brandNavy/40',
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
                'text-brandNavy/40 hover:text-brandNavy hover:bg-slate-100',
                'transition-all duration-150',
              )}
            >
              <X size={12} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Keyboard hint (desktop only) */}
        {!isLoading && query.length === 0 && (
          <div className="hidden md:flex items-center gap-0.5 shrink-0 text-brandNavy/30 font-semibold">
            <Command size={10} />
            <span className="text-2xs">K</span>
          </div>
        )}

        {/* Divider */}
        <div className="h-5 w-px bg-brandNavy/10 shrink-0" />

        {/* Submit / Cancel Button */}
        <motion.button
          whileHover={canSubmit ? { scale: 1.02 } : {}}
          whileTap={canSubmit ? { scale: 0.98 } : {}}
          onClick={isLoading ? cancelQuery : handleSubmit}
          disabled={!canSubmit && !isLoading}
          className={cn(
            'shrink-0 h-9 px-4 rounded-lg text-xs font-bold border',
            'transition-all duration-200',
            isLoading
              ? 'bg-rose-600/20 text-rose-600 border-rose-600/30 hover:bg-rose-600/30'
              : canSubmit
                ? 'bg-brandNavy border-brandNavy text-white hover:bg-brandNavy/95 shadow-sm'
                : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed',
          )}
        >
          {isLoading ? 'Cancel' : 'Ask AI →'}
        </motion.button>
      </motion.div>

      {/* Suggestion Chips */}
      <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-0.5 no-scrollbar">
        <span className="text-2xs text-brandNavy/50 font-bold shrink-0">Try:</span>
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