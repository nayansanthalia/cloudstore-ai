import { useCallback, useRef } from 'react'
import axios from 'axios'

import { PIPELINE_STEP_DELAY_MS } from '@/constants'
import { useQueryStore } from '@/features/query/store/queryStore'

const API_BASE_URL = 'http://localhost:5000/api'

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useAIQuery() {
  const abortControllerRef = useRef<AbortController | null>(null)

  const { query, isLoading, result, error, pipelineStep, setQuery, setLoading, setPipelineStep, setResult, setError, clearResult, clearError, reset } =
    useQueryStore()

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

      try {
        // Start pipeline animation and API call concurrently
        const [, apiResponse] = await Promise.all([
          animatePipeline(),
          axios.post(
            `${API_BASE_URL}/query`,
            { query: trimmed },
            {
              signal: abortControllerRef.current.signal,
              withCredentials: true
            }
          ).catch((err) => {
            // Throw error to be caught in try-catch block
            throw err
          })
        ])

        if (apiResponse && apiResponse.data) {
          setResult(apiResponse.data, trimmed)
        }
      } catch (err: any) {
        if (axios.isCancel(err)) {
          // Query was aborted, ignore
          return
        }

        console.error('RAG query failed', err)
        setError({
          code: 'API_ERROR',
          message: err.response?.data?.error || 'The AI service returned an error. Please try again.',
          timestamp: new Date()
        })
      }
    },
    [isLoading, animatePipeline, clearResult, clearError, setLoading, setPipelineStep, setResult, setError],
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