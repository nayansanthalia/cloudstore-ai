import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { MAX_HISTORY_ITEMS } from '@/constants'
import type { AppError, QueryHistoryItem, QueryResult } from '@/types'
import { generateId } from '@/utils/formatters'

// ─── Types ─────────────────────────────────────────────────────────────────

interface QueryState {
  // Input
  query: string
  isLoading: boolean

  // Results
  result: QueryResult | null
  error: AppError | null

  // Pipeline animation state
  pipelineStep: number

  // History
  history: QueryHistoryItem[]

  // Actions
  setQuery: (query: string) => void
  setLoading: (loading: boolean) => void
  setPipelineStep: (step: number) => void
  setResult: (result: QueryResult, query: string) => void
  setError: (error: AppError | null) => void
  clearResult: () => void
  clearError: () => void
  replayHistoryItem: (item: QueryHistoryItem) => void
  clearHistory: () => void
  reset: () => void
}

// ─── Store ─────────────────────────────────────────────────────────────────

export const useQueryStore = create<QueryState>()(
  devtools(
    (set) => ({
      // Initial state
      query: '',
      isLoading: false,
      result: null,
      error: null,
      pipelineStep: 0,
      history: [],

      // ── Actions ──────────────────────────────────────────────────────────

      setQuery: (query) => set({ query }),

      setLoading: (isLoading) => set({ isLoading }),

      setPipelineStep: (pipelineStep) => set({ pipelineStep }),

      setResult: (result, query) => {
        const historyItem: QueryHistoryItem = {
          id: generateId(),
          query,
          matchCount: result.matches.length,
          timestamp: new Date(),
          result,
        }

        set((state) => ({
          result,
          error: null,
          isLoading: false,
          pipelineStep: 0,
          history: [historyItem, ...state.history].slice(0, MAX_HISTORY_ITEMS),
        }))
      },

      setError: (error) =>
        set({
          error,
          isLoading: false,
          pipelineStep: 0,
        }),

      clearResult: () => set({ result: null }),

      clearError: () => set({ error: null }),

      replayHistoryItem: (item) =>
        set({
          query: item.query,
          result: item.result,
          error: null,
        }),

      clearHistory: () => set({ history: [] }),

      reset: () =>
        set({
          query: '',
          isLoading: false,
          result: null,
          error: null,
          pipelineStep: 0,
        }),
    }),
    { name: 'cloudstore-query' },
  ),
)

// ─── Selectors ─────────────────────────────────────────────────────────────

export const selectHasResult = (state: QueryState) => state.result !== null
export const selectMatchCount = (state: QueryState) => state.result?.matches.length ?? 0
export const selectHistoryCount = (state: QueryState) => state.history.length