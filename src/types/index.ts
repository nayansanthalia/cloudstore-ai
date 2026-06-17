// ─── File System Types ─────────────────────────────────────────────────────

export type FileType = 'pdf' | 'xlsx' | 'docx' | 'pptx' | 'csv' | 'txt' | 'img' | 'unknown'

export type FolderName = 'Invoices' | 'Resumes' | 'Reports' | 'Contracts' | 'Projects'

export interface CloudFile {
  id: number
  name: string
  folder: FolderName
  type: FileType
  size: string
  sizeBytes: number
  date: string
  dateISO: string
  content: string
  tags: string[]
  starred?: boolean
  shared?: boolean
}

export interface FolderMeta {
  name: FolderName | 'All'
  color: string
  icon: string
  description: string
}

// ─── Query / RAG Types ─────────────────────────────────────────────────────

export type RelevanceLevel = 'high' | 'medium' | 'low'

export interface FileMatch {
  id: number
  relevance: RelevanceLevel
  reason: string
  highlight: string
}

export interface QueryResult {
  answer: string
  matches: FileMatch[]
  insight: string | null
}

export interface QueryHistoryItem {
  id: string
  query: string
  matchCount: number
  timestamp: Date
  result: QueryResult
}

export type PipelineStepId = 1 | 2 | 3 | 4 | 5

export interface PipelineStep {
  id: PipelineStepId
  label: string
  description: string
  icon: string
}

// ─── API Types ─────────────────────────────────────────────────────────────

export interface AnthropicMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface AnthropicRequestBody {
  model: string
  max_tokens: number
  system: string
  messages: AnthropicMessage[]
}

export interface AnthropicContentBlock {
  type: 'text'
  text: string
}

export interface AnthropicResponse {
  id: string
  type: string
  role: string
  content: AnthropicContentBlock[]
  model: string
  stop_reason: string
  usage: {
    input_tokens: number
    output_tokens: number
  }
}

// ─── UI State Types ────────────────────────────────────────────────────────

export type ViewMode = 'grid' | 'list'

export type SortField = 'name' | 'date' | 'size' | 'type'
export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  field: SortField
  direction: SortDirection
}

export interface FilterConfig {
  folder: FolderName | 'All'
  fileTypes: FileType[]
  searchTerm: string
}

// ─── Error Types ───────────────────────────────────────────────────────────

export type ErrorCode =
  | 'API_ERROR'
  | 'NETWORK_ERROR'
  | 'PARSE_ERROR'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMIT_ERROR'
  | 'UNKNOWN_ERROR'

export interface AppError {
  code: ErrorCode
  message: string
  details?: string
  timestamp: Date
}

// ─── Utility Types ─────────────────────────────────────────────────────────

export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type AsyncState<T> = {
  data: Nullable<T>
  isLoading: boolean
  error: Nullable<AppError>
}