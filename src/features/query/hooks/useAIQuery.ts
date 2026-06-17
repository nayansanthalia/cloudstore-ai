import { useCallback, useRef } from 'react'

import { PIPELINE_STEP_DELAY_MS } from '@/constants'
import { queryFiles } from '@/features/query/services/anthropicService'
import { useQueryStore } from '@/features/query/store/queryStore'
import { useStorageStore } from '@/features/storage/store/storageStore'

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useAIQuery() {
  const abortControllerRef = useRef<AbortController | null>(null)

  const { query, isLoading, result, error, pipelineStep, setQuery, setLoading, setPipelineStep, setResult, setError, clearResult, clearError, reset } =
    useQueryStore()

  const { files } = useStorageStore()

  /**
   * Animate the RAG pipeline steps sequentially
   */
  const animatePipeline = useCallback(async (): Promise<void> => {
    for (let step = 1; step <= 5; step++) {
      await new Promise<void>((resolve) => setTimeout(resolve, PIPELINE_STEP_DELAY_MS))
      setPipelineStep(step)
    }
  }, [setPipelineStep])

  /**
   * Execute the AI query with pipeline animation
   */
  const executeQuery = useCallback(
    async (queryText: string): Promise<void> => {
      const trimmed = queryText.trim()
      if (!trimmed || isLoading) return

      // Cancel any in-flight request
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()

      clearResult()
      clearError()
      setLoading(true)
      setPipelineStep(0)

      // Start pipeline animation and API call concurrently
      const [, queryResult] = await Promise.all([
        animatePipeline(),
        queryFiles({
          query: trimmed,
          files,
          abortSignal: abortControllerRef.current.signal,
        }),
      ])

      if (queryResult.error) {
        setError(queryResult.error)
      } else if (queryResult.data) {
        setResult(queryResult.data, trimmed)
      }
    },
    [isLoading, files, animatePipeline, clearResult, clearError, setLoading, setPipelineStep, setResult, setError],
  )

  /**
   * Handle quick suggestion click
   */
  const handleSuggestion = useCallback(
    (suggestion: string) => {
      setQuery(suggestion)
      void executeQuery(suggestion)
    },
    [setQuery, executeQuery],
  )

  /**
   * Cancel the ongoing query
   */
  const cancelQuery = useCallback(() => {
    abortControllerRef.current?.abort()
    reset()
  }, [reset])

  return {
    // State
    query,
    isLoading,
    result,
    error,
    pipelineStep,

    // Actions
    setQuery,
    executeQuery,
    handleSuggestion,
    cancelQuery,
    clearResult,
    clearError,
  }
}