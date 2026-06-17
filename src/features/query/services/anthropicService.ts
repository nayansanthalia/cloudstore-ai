import { GoogleGenerativeAI } from '@google/generative-ai'
import { z } from 'zod'

import {
  ANTHROPIC_SYSTEM_PROMPT,
  ERROR_MESSAGES,
  MAX_RESULTS,
} from '@/constants'
import type {
  AppError,
  CloudFile,
  ErrorCode,
  QueryResult,
} from '@/types'

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY,
)

const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
})

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

function buildFileContext(files: CloudFile[]): string {
  return files
    .map(
      (f) =>
        `[ID:${f.id}] ${f.name}
Folder: ${f.folder}
Type: ${f.type}
Size: ${f.size}
Date: ${f.date}
Content: ${f.content}`,
    )
    .join('\n\n')
}

function parseGeminiResponse(raw: string): QueryResult {
  const cleaned = raw
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()

  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')

  if (start === -1 || end === -1) {
    throw new Error('No JSON found')
  }

  const jsonString = cleaned.slice(start, end + 1)

  const parsed = JSON.parse(jsonString)

  const validated =
    QueryResultSchema.parse(parsed)

  return {
    answer: validated.answer,
    matches: validated.matches,
    insight: validated.insight ?? null,
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
  const { query, files } = params

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
    const fileContext =
      buildFileContext(files)

    const prompt = `
${ANTHROPIC_SYSTEM_PROMPT}

Storage files:

${fileContext}

User Query:
"${query}"

Return ONLY JSON.
`

    const response =
      await model.generateContent(prompt)

    const rawText =
      response.response.text()

    const result =
      parseGeminiResponse(rawText)

    return {
      data: result,
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

    if (err instanceof SyntaxError) {
      return {
        data: null,
        error: createAppError(
          'PARSE_ERROR',
          'Invalid JSON response',
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