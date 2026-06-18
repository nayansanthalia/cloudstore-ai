import { z } from 'zod'

import {
  ERROR_MESSAGES,
  MAX_RESULTS,
} from '@/constants'

import type {
  AppError,
  CloudFile,
  ErrorCode,
  QueryResult,
} from '@/types'

const FileMatchSchema = z.object({
  id: z.number().int().positive(),
  relevance: z.enum(['high', 'medium', 'low']).default('medium'),
  reason: z.string(),
  highlight: z.string(),
})

const QueryResultSchema = z.object({
  answer: z.string(),
  matches: z.array(FileMatchSchema).max(MAX_RESULTS),
  insight: z.string().nullable().optional(),
})

function createAppError(
  code: ErrorCode,
  details?: string,
): AppError {
  return {
    code,
    message:
      ERROR_MESSAGES[code] ??
      ERROR_MESSAGES.UNKNOWN_ERROR,
    details,
    timestamp: new Date(),
  }
}

export interface QueryFilesParams {
  query: string
  files: CloudFile[]
  abortSignal?: AbortSignal
}

export interface QueryFilesResult {
  data: QueryResult | null
  error: AppError | null
}

export async function queryFiles(
  params: QueryFilesParams,
): Promise<QueryFilesResult> {
  const { query } = params

  if (!query.trim()) {
    return {
      data: null,
      error: createAppError(
        'VALIDATION_ERROR',
        'Query cannot be empty',
      ),
    }
  }

  try {
    const response = await fetch(
      'http://localhost:5000/api/query',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query,
        }),
      },
    )

    if (!response.ok) {
      throw new Error(
        `Backend returned ${response.status}`,
      )
    }

    const result = await response.json()

    const validated =
      QueryResultSchema.parse(result)

    return {
      data: validated,
      error: null,
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return {
        data: null,
        error: createAppError(
          'PARSE_ERROR',
          err.message,
        ),
      }
    }

    return {
      data: null,
      error: createAppError(
        'API_ERROR',
        String(err),
      ),
    }
  }
}