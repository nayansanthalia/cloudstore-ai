import type { FolderMeta, PipelineStep } from '@/types'

// ─── App Constants ─────────────────────────────────────────────────────────

export const APP_NAME = 'CloudSphere AI' as const
export const APP_TAGLINE = 'Intelligent Storage Query Engine' as const
export const APP_VERSION = import.meta.env.VITE_APP_VERSION ?? '1.0.0'

// ─── API Constants ─────────────────────────────────────────────────────────

export const ANTHROPIC_MODEL = import.meta.env.VITE_ANTHROPIC_MODEL ?? 'claude-sonnet-4-6'
export const ANTHROPIC_MAX_TOKENS = Number(import.meta.env.VITE_ANTHROPIC_MAX_TOKENS ?? 1500)
export const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

// ─── Query Constants ───────────────────────────────────────────────────────

export const MAX_QUERY_LENGTH = 500
export const MAX_HISTORY_ITEMS = 10
export const MAX_RESULTS = 6
export const DEBOUNCE_MS = 300

// ─── UI Constants ──────────────────────────────────────────────────────────

export const SIDEBAR_WIDTH = 220
export const HEADER_HEIGHT = 60
export const FOOTER_HEIGHT = 36

export const PIPELINE_STEP_DELAY_MS = 520
export const ANIMATION_DURATION_MS = 300

// ─── Folder Metadata ───────────────────────────────────────────────────────

export const FOLDER_META: Record<string, FolderMeta> = {
  All: {
    name: 'All',
    color: '#64748B',
    icon: '◈',
    description: 'All files across all folders',
  },
  Invoices: {
    name: 'Invoices',
    color: '#F59E0B',
    icon: '🧾',
    description: 'Billing invoices and payment records',
  },
  Resumes: {
    name: 'Resumes',
    color: '#10B981',
    icon: '👤',
    description: 'Candidate CVs and profiles',
  },
  Reports: {
    name: 'Reports',
    color: '#3B82F6',
    icon: '📊',
    description: 'Business analytics and reports',
  },
  Contracts: {
    name: 'Contracts',
    color: '#8B5CF6',
    icon: '📜',
    description: 'Legal agreements and contracts',
  },
  Projects: {
    name: 'Projects',
    color: '#EF4444',
    icon: '🚀',
    description: 'Project plans and documentation',
  },
}

// ─── File Type Icons ───────────────────────────────────────────────────────

export const FILE_TYPE_ICONS: Record<string, string> = {
  pdf: '📄',
  xlsx: '📊',
  docx: '📝',
  pptx: '📋',
  csv: '🗂️',
  txt: '📃',
  img: '🖼️',
  unknown: '📁',
}

// ─── RAG Pipeline Steps ────────────────────────────────────────────────────

export const PIPELINE_STEPS: PipelineStep[] = [
  { id: 1, label: 'Parse',    description: 'Extract text & metadata',  icon: '⚙' },
  { id: 2, label: 'Chunk',    description: '512-token segments',        icon: '✂' },
  { id: 3, label: 'Embed',    description: 'Vector generation',         icon: '🔮' },
  { id: 4, label: 'Retrieve', description: 'Semantic similarity',       icon: '🔍' },
  { id: 5, label: 'Reason',   description: 'LLM synthesis',             icon: '🧠' },
]

// ─── Suggested Queries ─────────────────────────────────────────────────────

export const SUGGESTED_QUERIES: string[] = [
  'Find invoices above ₹10,000',
  'Python developer resumes',
  '3-year contracts',
  'Q4 revenue summary',
  'Who knows Kubernetes?',
  'ML roles in hiring plan',
  'Contracts expiring in 2027',
  'Summarize marketing ROI',
]

// ─── System Prompt for Claude ──────────────────────────────────────────────

export const ANTHROPIC_SYSTEM_PROMPT = `You are CloudSphere AI — an intelligent file query engine embedded in a cloud storage platform. You analyze file metadata and content to answer natural language queries from enterprise users.

Return ONLY a raw JSON object. No markdown fences, no explanation text before or after. Exact schema:
{
  "answer": "<2-3 sentence direct answer to the query>",
  "matches": [
    {
      "id": <integer>,
      "relevance": "high" | "medium",
      "reason": "<one sentence explaining why this file matches>",
      "highlight": "<the single most relevant data point or figure from this file>"
    }
  ],
  "insight": "<optional: one sentence pattern observed across matched files, or null>"
}

Rules:
1. Include only genuinely relevant files (max ${MAX_RESULTS})
2. For monetary queries (e.g., "above ₹10,000"), apply precise numeric filtering
3. For skill queries, check actual skills listed in content
4. Relevance "high" = directly answers the query; "medium" = partially relevant
5. If nothing matches: return empty matches array with an explanatory answer
6. Never fabricate file content — only use what is explicitly provided` as const

// ─── Error Messages ────────────────────────────────────────────────────────

export const ERROR_MESSAGES: Record<string, string> = {
  API_ERROR: 'The AI service returned an error. Please try again.',
  NETWORK_ERROR: 'Unable to connect. Check your internet connection.',
  PARSE_ERROR: 'Could not parse the AI response. Please retry.',
  VALIDATION_ERROR: 'Your query is invalid. Please rephrase it.',
  RATE_LIMIT_ERROR: 'Too many requests. Please wait a moment.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
}