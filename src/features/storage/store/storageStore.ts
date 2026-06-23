import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import axios from 'axios'

import type { CloudFile, FilterConfig, FolderName, SortConfig, SortField } from '@/types'

const API_BASE_URL = 'http://localhost:5000/api'

// Configure axios to send cookies with requests
axios.defaults.withCredentials = true

// ─── Types ─────────────────────────────────────────────────────────────────

interface StorageState {
  // Data
  files: CloudFile[]
  isConnected: boolean
  isSyncing: boolean
  userProfile: { name: string; email: string; picture: string } | null
  error: string | null

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
  toggleStarred: (id: number) => Promise<void>
  
  // Google Drive & API Actions
  checkAuthStatus: () => Promise<boolean>
  syncFiles: () => Promise<void>
  disconnectDrive: () => Promise<void>
  fetchFiles: () => Promise<void>
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
        (f.content && f.content.toLowerCase().includes(term)),
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
      // Initial data - start empty (no mock data)
      files: [],
      isConnected: false,
      isSyncing: false,
      userProfile: null,
      error: null,
      filters: DEFAULT_FILTERS,
      sort: DEFAULT_SORT,
      filteredFiles: [],

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

      toggleStarred: async (id) => {
        const { isConnected } = get()
        
        // If connected, syncstarred state with backend
        if (isConnected) {
          try {
            await axios.post(`${API_BASE_URL}/drive/files/${id}/star`)
          } catch (err) {
            console.error('Failed to update star state on server', err)
          }
        }

        // Always update local UI state
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

      // ── Google Drive & API Actions ──────────────────────────────────────────

      checkAuthStatus: async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/auth/status`)
          if (response.data.connected) {
            set({
              isConnected: true,
              userProfile: response.data.user,
              error: null
            })
            // Fetch real synced files
            await get().fetchFiles()
            return true
          } else {
            set({
              isConnected: false,
              userProfile: null,
              files: [], // Empty files if disconnected
              filteredFiles: []
            })
            return false
          }
        } catch (err) {
          console.error('Failed to check OAuth status', err)
          set({ isConnected: false, userProfile: null })
          return false
        }
      },

      fetchFiles: async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/drive/files`)
          const fetchedFiles = response.data
          
          set({
            files: fetchedFiles,
            filteredFiles: applyFiltersAndSort(fetchedFiles, get().filters, get().sort),
            error: null
          })
        } catch (err) {
          console.error('Failed to fetch files from server', err)
          set({ error: 'Failed to fetch indexed files.' })
        }
      },

      syncFiles: async () => {
        const { isSyncing, isConnected } = get()
        if (isSyncing || !isConnected) return

        set({ isSyncing: true, error: null })
        try {
          await axios.post(`${API_BASE_URL}/drive/sync`)
          await get().fetchFiles() // Reload files list after sync completes
        } catch (err: any) {
          console.error('Sync failed', err)
          set({ error: err.response?.data?.error || 'Synchronization failed.' })
        } finally {
          set({ isSyncing: false })
        }
      },

      disconnectDrive: async () => {
        try {
          await axios.post(`${API_BASE_URL}/auth/logout`)
        } catch (err) {
          console.error('Failed to logout of Google Drive', err)
        } finally {
          set({
            isConnected: false,
            userProfile: null,
            files: [], // Reset to empty
            filteredFiles: [],
            error: null
          })
        }
      }
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