import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, RefreshCw, SearchX, Sparkles, DollarSign, Users, FileText, Clock } from 'lucide-react'
import { memo } from 'react'

import { useAIQuery } from '@/features/query/hooks/useAIQuery'
import { PipelineViz } from './PipelineViz'
import { AnswerCard, ResultCard } from './ResultCard'
import { cn } from '@/utils/cn'

// ─── Suggestion Cards Config ───────────────────────────────────────────────

const SUGGESTIONS = [
  {
    title: 'Financial Analysis',
    prompt: 'Find invoices above ₹10,000',
    icon: DollarSign,
    color: '#0EFA80'
  },
  {
    title: 'Talent Acquisition',
    prompt: 'Python developer resumes',
    icon: Users,
    color: '#60A5FA'
  },
  {
    title: 'Agreement Review',
    prompt: '3-year contracts',
    icon: FileText,
    color: '#F59E0B'
  },
  {
    title: 'Contract Expiries',
    prompt: 'Contracts expiring in 2027',
    icon: Clock,
    color: '#EC4899'
  }
]

interface SuggestionCardProps {
  title: string
  prompt: string
  icon: any
  color: string
  onClick: () => void
}

const SuggestionCard = memo(({ title, prompt, icon: Icon, color, onClick }: SuggestionCardProps) => (
  <motion.button
    whileHover={{ y: -2, scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    onClick={onClick}
    className={cn(
      'glass-card p-3.5 rounded-xl border text-left flex items-start gap-3.5 transition-all duration-200 cursor-pointer w-full',
      'bg-white/40 border-white/60 hover:bg-white/70 hover:border-brandNavy/15 shadow-2xs hover:shadow-sm',
      'dark:bg-white/5 dark:border-white/5 dark:hover:bg-white/10 dark:hover:border-white/10'
    )}
  >
    <div 
      className="p-2 rounded-lg shrink-0 flex items-center justify-center border"
      style={{ 
        background: `${color}15`, 
        borderColor: `${color}25`,
        color: color 
      }}
    >
      <Icon size={14} />
    </div>
    <div className="flex-1 min-w-0 leading-tight">
      <h4 className="text-2xs font-extrabold text-brandNavy dark:text-white uppercase tracking-wider">{title}</h4>
      <p className="text-2xs text-brandNavy/60 dark:text-slate-400 mt-1 font-semibold leading-normal truncate">{prompt}</p>
    </div>
  </motion.button>
))
SuggestionCard.displayName = 'SuggestionCard'

// ─── Empty State ───────────────────────────────────────────────────────────

const EmptyQueryState = memo(({ onSelectSuggestion }: { onSelectSuggestion: (s: string) => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center h-full text-center px-6 py-12"
  >
    {/* Sparkling Ambient Glow Logo */}
    <div className="relative mb-6">
      <div className="absolute inset-0 bg-brandSky/25 dark:bg-brandSky/20 rounded-full blur-xl animate-pulse" />
      <div className="relative w-14 h-14 rounded-2xl bg-white/70 border border-white/80 dark:bg-white/5 dark:border-white/10 flex items-center justify-center text-brandSky shadow-md">
        <Sparkles size={22} className="animate-pulse" />
      </div>
    </div>

    {/* Header */}
    <h2 className="font-display text-2xl font-extrabold text-brandNavy dark:text-white tracking-tight mb-2">
      Ask your storage anything
    </h2>
    <p className="text-xs text-brandNavy/60 dark:text-slate-450 max-w-sm leading-relaxed mb-8 font-semibold">
      Use natural language to find, analyse, and manage your files. Powered by RAG + Claude.
    </p>

    {/* Section Label */}
    <span className="text-[10px] font-extrabold text-brandNavy/40 dark:text-slate-500 uppercase tracking-widest mb-3.5">
      Get started with a suggestion
    </span>

    {/* 2x2 Responsive Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl w-full">
      {SUGGESTIONS.map((item) => (
        <SuggestionCard
          key={item.prompt}
          title={item.title}
          prompt={item.prompt}
          icon={item.icon}
          color={item.color}
          onClick={() => onSelectSuggestion(item.prompt)}
        />
      ))}
    </div>
  </motion.div>
))
EmptyQueryState.displayName = 'EmptyQueryState'

// ─── No Results State ──────────────────────────────────────────────────────

const NoResultsState = memo(({ answer }: { answer: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center text-center px-8 py-16"
  >
    <SearchX size={36} className="text-brandNavy/30 dark:text-slate-600 mb-4" />
    <h3 className="text-sm font-semibold text-brandNavy/60 dark:text-slate-400 mb-2">No files matched</h3>
    <p className="text-xs text-brandNavy/50 dark:text-slate-500 max-w-sm leading-relaxed">{answer}</p>
  </motion.div>
))
NoResultsState.displayName = 'NoResultsState'

// ─── Error State ───────────────────────────────────────────────────────────

interface ErrorStateProps {
  message: string
  onRetry: () => void
  query: string
}

const ErrorState = memo(({ message, onRetry, query }: ErrorStateProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    className={cn(
      'rounded-xl border border-rose-900/40 p-4 mb-3',
      'bg-rose-950/20',
    )}
  >
    <div className="flex items-start gap-3">
      <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-rose-400">Query Failed</p>
        <p className="text-xs text-rose-700 mt-0.5">{message}</p>
      </div>
      {query && (
        <button
          onClick={onRetry}
          className={cn(
            'shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg',
            'text-xs font-medium text-rose-400',
            'border border-rose-900/50 hover:bg-rose-950/50',
            'transition-all duration-150',
          )}
        >
          <RefreshCw size={11} />
          Retry
        </button>
      )}
    </div>
  </motion.div>
))
ErrorState.displayName = 'ErrorState'

// ─── Match Count Header ────────────────────────────────────────────────────

const MatchCountHeader = memo(({ count }: { count: number }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center gap-2 mb-3"
  >
    <div className="h-px flex-1 bg-brandNavy/10 dark:bg-white/10" />
    <span className="text-2xs text-brandNavy/50 dark:text-slate-400 px-2">
      {count} file{count !== 1 ? 's' : ''} matched
    </span>
    <div className="h-px flex-1 bg-brandNavy/10 dark:bg-white/10" />
  </motion.div>
))
MatchCountHeader.displayName = 'MatchCountHeader'

// ─── QueryResults Component ────────────────────────────────────────────────

export const QueryResults = memo(() => {
  const { query, isLoading, result, error, pipelineStep, executeQuery, clearError, handleSuggestion } =
    useAIQuery()

  const handleRetry = () => {
    clearError()
    void executeQuery(query)
  }

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 min-h-0">
      <AnimatePresence mode="popLayout">

        {/* ── Pipeline Animation ── */}
        {isLoading && (
          <motion.div key="pipeline" layout>
            <PipelineViz currentStep={pipelineStep} />
          </motion.div>
        )}

        {/* ── Error State ── */}
        {error && !isLoading && (
          <motion.div key="error" layout>
            <ErrorState
              message={error.message}
              onRetry={handleRetry}
              query={query}
            />
          </motion.div>
        )}

        {/* ── Results ── */}
        {result && !isLoading && (
          <motion.div key="results" layout>
            {/* AI Answer Card */}
            <AnswerCard
              answer={result.answer}
              insight={result.insight}
              matchCount={result.matches.length}
            />

            {/* File Matches */}
            {result.matches.length > 0 ? (
              <>
                <MatchCountHeader count={result.matches.length} />
                <div className="flex flex-col gap-3">
                  {result.matches.map((match, i) => (
                    <ResultCard key={match.id} match={match} index={i} />
                  ))}
                </div>
              </>
            ) : (
              <NoResultsState answer={result.answer} />
            )}
          </motion.div>
        )}

        {/* ── Default Empty State ── */}
        {!result && !isLoading && !error && (
          <motion.div key="empty" className="h-full" layout>
            <EmptyQueryState onSelectSuggestion={handleSuggestion} />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
})

QueryResults.displayName = 'QueryResults'