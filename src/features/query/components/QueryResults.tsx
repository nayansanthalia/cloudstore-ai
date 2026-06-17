import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, RefreshCw, SearchX } from 'lucide-react'
import { memo } from 'react'

import { useAIQuery } from '@/features/query/hooks/useAIQuery'
import { PipelineViz } from './PipelineViz'
import { AnswerCard, ResultCard } from './ResultCard'
import { cn } from '@/utils/cn'

// ─── Empty State ───────────────────────────────────────────────────────────

const EmptyQueryState = memo(() => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center h-full text-center px-8 py-16"
  >
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className="text-5xl mb-4 select-none"
    >
      ✦
    </motion.div>
    <h2 className="font-display text-lg font-semibold text-slate-400 mb-2">
      Ask your storage anything
    </h2>
    <p className="text-sm text-slate-700 max-w-sm leading-relaxed mb-6">
      Use natural language to find, analyse, and manage your files. Powered by RAG + Claude.
    </p>
    <div className="flex flex-col gap-2 text-xs text-slate-800">
      {[
        '"Find all invoices above ₹10,000 from Q1"',
        '"Show resumes with Python and Kubernetes skills"',
        '"Summarise our Q4 sales performance"',
        '"Which contracts expire in 2027?"',
      ].map((example) => (
        <p key={example} className="font-mono">{example}</p>
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
    <SearchX size={36} className="text-slate-700 mb-4" />
    <h3 className="text-sm font-semibold text-slate-500 mb-2">No files matched</h3>
    <p className="text-xs text-slate-700 max-w-sm leading-relaxed">{answer}</p>
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
    <div className="h-px flex-1 bg-space-300" />
    <span className="text-2xs text-slate-700 px-2">
      {count} file{count !== 1 ? 's' : ''} matched
    </span>
    <div className="h-px flex-1 bg-space-300" />
  </motion.div>
))
MatchCountHeader.displayName = 'MatchCountHeader'

// ─── QueryResults Component ────────────────────────────────────────────────

export const QueryResults = memo(() => {
  const { query, isLoading, result, error, pipelineStep, executeQuery, clearError } =
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
            <EmptyQueryState />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
})

QueryResults.displayName = 'QueryResults'