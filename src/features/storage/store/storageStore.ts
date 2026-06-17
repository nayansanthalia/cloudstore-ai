import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'

import { MOCK_FILES } from '@/features/storage/data/mockFiles'
import type { CloudFile, FilterConfig, FolderName, SortConfig, SortField } from '@/types'

// ─── Types ─────────────────────────────────────────────────────────────────

interface StorageState {
  // Data
  files: CloudFile[]

  // Filter & Sort
  filters: FilterConfig
  sort: SortConfig

  // Computed (derived)
  filteredFiles: CloudFile[]

  // Actions
  setFolder: (folder: FolderName | 'All') => void
  setSearchTerm: (term: string) => void
  setSortField: (field: SortField) => void
  toggleSortDirection: () => void
  resetFilters: () => void
  toggleStarred: (id: number) => void
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function applyFiltersAndSort(files: CloudFile[], filters: FilterConfig, sort: SortConfig): CloudFile[] {
  let result = [...files]

  // Filter by folder
  if (filters.folder !== 'All') {
    result = result.filter((f) => f.folder === filters.folder)
  }

  // Filter by search term (name, tags, content)
  if (filters.searchTerm.trim()) {
    const term = filters.searchTerm.toLowerCase()
    result = result.filter(
      (f) =>
        f.name.toLowerCase().includes(term) ||
        f.tags.some((t) => t.includes(term)) ||
        f.content.toLowerCase().includes(term),
    )
  }

  // Filter by file types
  if (filters.fileTypes.length > 0) {
    result = result.filter((f) => filters.fileTypes.includes(f.type))
  }

  // Sort
  result.sort((a, b) => {
    let comparison = 0
    switch (sort.field) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'date':
        comparison = new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime()
        break
      case 'size':
        comparison = a.sizeBytes - b.sizeBytes
        break
      case 'type':
        comparison = a.type.localeCompare(b.type)
        break
    }
    return sort.direction === 'asc' ? comparison : -comparison
  })

  return result
}

// ─── Initial State ─────────────────────────────────────────────────────────

const DEFAULT_FILTERS: FilterConfig = {
  folder: 'All',
  fileTypes: [],
  searchTerm: '',
}

const DEFAULT_SORT: SortConfig = {
  field: 'date',
  direction: 'desc',
}

// ─── Store ─────────────────────────────────────────────────────────────────

export const useStorageStore = create<StorageState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial data
      files: MOCK_FILES,
      filters: DEFAULT_FILTERS,
      sort: DEFAULT_SORT,
      filteredFiles: applyFiltersAndSort(MOCK_FILES, DEFAULT_FILTERS, DEFAULT_SORT),

      // ── Actions ──────────────────────────────────────────────────────────

      setFolder: (folder) => {
        set((state) => {
          const filters = { ...state.filters, folder }
          return {
            filters,
            filteredFiles: applyFiltersAndSort(state.files, filters, state.sort),
          }
        })
      },

      setSearchTerm: (searchTerm) => {
        set((state) => {
          const filters = { ...state.filters, searchTerm }
          return {
            filters,
            filteredFiles: applyFiltersAndSort(state.files, filters, state.sort),
          }
        })
      },

      setSortField: (field) => {
        set((state) => {
          const sort = { ...state.sort, field }
          return {
            sort,
            filteredFiles: applyFiltersAndSort(state.files, state.filters, sort),
          }
        })
      },

      toggleSortDirection: () => {
        set((state) => {
          const sort = {
            ...state.sort,
            direction: (state.sort.direction === 'asc' ? 'desc' : 'asc') as 'asc' | 'desc',
          }
          return {
            sort,
            filteredFiles: applyFiltersAndSort(state.files, state.filters, sort),
          }
        })
      },

      resetFilters: () => {
        const { files } = get()
        set({
          filters: DEFAULT_FILTERS,
          sort: DEFAULT_SORT,
          filteredFiles: applyFiltersAndSort(files, DEFAULT_FILTERS, DEFAULT_SORT),
        })
      },

      toggleStarred: (id) => {
        set((state) => {
          const files = state.files.map((f) =>
            f.id === id ? { ...f, starred: !f.starred } : f,
          )
          return {
            files,
            filteredFiles: applyFiltersAndSort(files, state.filters, state.sort),
          }
        })
      },
    })),
    { name: 'cloudstore-storage' },
  ),
)

// ─── Selectors (memoized outside component for performance) ────────────────

export const selectFilesInFolder = (folder: FolderName | 'All') => (state: StorageState) =>
  folder === 'All' ? state.files : state.files.filter((f) => f.folder === folder)

export const selectFolderCounts = (state: StorageState): Record<string, number> => {
  const counts: Record<string, number> = { All: state.files.length }
  for (const file of state.files) {
    counts[file.folder] = (counts[file.folder] ?? 0) + 1
  }
  return counts
}