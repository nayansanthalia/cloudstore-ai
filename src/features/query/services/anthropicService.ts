import axios, { type AxiosError } from 'axios'
import { z } from 'zod'

import {
  ANTHROPIC_API_URL,
  ANTHROPIC_MAX_TOKENS,
  ANTHROPIC_MODEL,
  ANTHROPIC_SYSTEM_PROMPT,
  ERROR_MESSAGES,
  MAX_RESULTS,
} from '@/constants'
import type { AppError, CloudFile, ErrorCode, QueryResult } from '@/types'

// ─── Zod Schemas for Runtime Validation ───────────────────────────────────

const FileMatchSchema = z.object({
  id: z.number().int().positive(),
  relevance: z.enum(['high', 'medium', 'low']).default('medium'),
  reason: z.string().min(1),
  highlight: z.string().min(1),
})

const QueryResultSchema = z.object({
  answer: z.string().min(1),
  matches: z.array(FileMatchSchema).max(MAX_RESULTS),
  insight: z.string().nullable().optional().transform((v) => v ?? null),
})

// ─── Error Factory ─────────────────────────────────────────────────────────

function createAppError(code: ErrorCode, details?: string): AppError {
  return {
    code,
    message: ERROR_MESSAGES[code] ?? ERROR_MESSAGES.UNKNOWN_ERROR,
    details,
    timestamp: new Date(),
  }
}

// ─── File Context Builder ──────────────────────────────────────────────────

function buildFileContext(files: CloudFile[]): string {
  return files
    .map(
      (f) =>
        `[ID:${f.id}] ${f.name} | Folder: ${f.folder} | Type: ${f.type.toUpperCase()} | Size: ${f.size} | Date: ${f.date}\nContent Summary: ${f.content}`,
    )
    .join('\n---\n')
}

// ─── Response Parser ───────────────────────────────────────────────────────

function parseAnthropicResponse(raw: string): QueryResult {
  // Strip markdown code fences if present
  const cleaned = raw
    .replace(/```(?:json)?\s*/gi, '')
    .replace(/```\s*/gi, '')
    .trim()

  // Find JSON object boundaries for resilience
  const jsonStart = cleaned.indexOf('{')
  const jsonEnd = cleaned.lastIndexOf('}')

  if (jsonStart === -1 || jsonEnd === -1) {
    throw createAppError('PARSE_ERROR', 'No JSON object found in response')
  }

  const jsonString = cleaned.slice(jsonStart, jsonEnd + 1)
  const rawParsed: unknown = JSON.parse(jsonString)

  // Validate with Zod
  const validated = QueryResultSchema.parse(rawParsed)

  return {
    answer: validated.answer,
    matches: validated.matches,
    insight: validated.insight ?? null,
  }
}

// ─── Main Query Function ───────────────────────────────────────────────────

export interface QueryFilesParams {
  query: string
  files: CloudFile[]
  abortSignal?: AbortSignal
}

export interface QueryFilesResult {
  data: QueryResult | null
  error: AppError | null
}

export async function queryFiles(params: QueryFilesParams): Promise<QueryFilesResult> {
  const { query, files, abortSignal } = params

  if (!query.trim()) {
    return {
      data: null,
      error: createAppError('VALIDATION_ERROR', 'Query cannot be empty'),
    }
  }

  const fileContext = buildFileContext(files)

  try {
    console.log('API KEY:', import.meta.env.VITE_ANTHROPIC_API_KEY)
    console.log('MODEL:', ANTHROPIC_MODEL)
    const response = await axios.post<{
      content: Array<{ type: string; text: string }>
    }>(
      ANTHROPIC_API_URL,
      {
        model: ANTHROPIC_MODEL,
        max_tokens: ANTHROPIC_MAX_TOKENS,
        system: ANTHROPIC_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Storage files available:\n${fileContext}\n\nUser query: "${query}"\n\nReturn JSON only:`,
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY as string,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        signal: abortSignal,
        timeout: 30_000,
      },
    )

    const rawText = response.data.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('')

    if (!rawText) {
      return {
        data: null,
        error: createAppError('PARSE_ERROR', 'Empty response from AI'),
      }
    }

    const result = parseAnthropicResponse(rawText)

    return { data: result, error: null }
  } catch (err) {
    if (axios.isCancel(err)) {
      return { data: null, error: null } // Cancelled — not an error
    }

    if (axios.isAxiosError(err)) {
      const axiosErr = err as AxiosError
      const status = axiosErr.response?.status

      if (status === 429) {
        return { data: null, error: createAppError('RATE_LIMIT_ERROR') }
      }
      if (status === 401 || status === 403) {
        return {
          data: null,
          error: createAppError('API_ERROR', 'Invalid or missing API key'),
        }
      }
      if (!axiosErr.response) {
        return { data: null, error: createAppError('NETWORK_ERROR') }
      }
      return {
        data: null,
        error: createAppError('API_ERROR', `HTTP ${String(status ?? 'unknown')}`),
      }
    }

    if (err instanceof z.ZodError) {
      return {
        data: null,
        error: createAppError('PARSE_ERROR', `Validation failed: ${err.message}`),
      }
    }

    if (err instanceof SyntaxError) {
      return {
        data: null,
        error: createAppError('PARSE_ERROR', 'JSON parse error'),
      }
    }

    if (err instanceof AppErrorClass) {
      return { data: null, error: err as unknown as AppError }
    }

    return {
      data: null,
      error: createAppError('UNKNOWN_ERROR', String(err)),
    }
  }
}

// Internal error class for typed throws
class AppErrorClass extends Error {
  constructor(public appError: AppError) {
    super(appError.message)
  }
}