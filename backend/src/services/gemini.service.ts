import { CloudflareService } from './cloudflare.service';
import { VectorChunk, IndexedFile } from './vector.service';
import { logger } from '../utils/logger';

export interface RAGResponseMatch {
  id: number;
  driveId: string;
  relevance: 'high' | 'medium' | 'low';
  reason: string;
  highlight: string;
}

export interface RAGResponse {
  answer: string;
  matches: RAGResponseMatch[];
  insight: string | null;
}

export class GeminiService {
  static initialize() {
    logger.info('Cloudflare AI initialized');
  }

  /**
   * Deterministic string-to-number hashing function
   */
  static getNumericId(driveId: string): number {
    let hash = 0;

    for (let i = 0; i < driveId.length; i++) {
      const char = driveId.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }

    return Math.abs(hash) || 1;
  }

  static async queryRAG(
    query: string,
    searchResults: { chunk: VectorChunk; score: number }[],
    allFiles: Record<string, IndexedFile>
  ): Promise<RAGResponse> {
    try {
      logger.info(
        `Running Cloudflare RAG with ${searchResults.length} chunks...`
      );

      const context = searchResults
        .map((result, idx) => {
          const file = allFiles[result.chunk.fileId];

          return `
[Document ${idx + 1}]
FILE_ID: ${result.chunk.fileId}
FILE_NAME: ${file?.name || 'Unknown'}
FOLDER: ${file?.folder || 'Unknown'}

${result.chunk.text}
`;
        })
        .join('\n\n');

      const prompt = `
You are CloudStore AI.

Answer ONLY using the supplied document context.

If the answer is not found, reply:
"I could not find that information in the indexed files."

CONTEXT:
${context}

QUESTION:
${query}

Provide a concise answer.
`;

      const answer =
        await CloudflareService.generateAnswer(prompt);

      const matches: RAGResponseMatch[] = [];

      const seen = new Set<string>();

      for (const result of searchResults.slice(0, 5)) {
        if (seen.has(result.chunk.fileId)) continue;

        seen.add(result.chunk.fileId);

        matches.push({
          id: this.getNumericId(result.chunk.fileId),
          driveId: result.chunk.fileId,
          relevance: 'high',
          reason: 'Semantic similarity match',
          highlight:
            result.chunk.text.length > 200
              ? result.chunk.text.slice(0, 200) + '...'
              : result.chunk.text
        });
      }

      return {
        answer,
        matches,
        insight: null
      };
    } catch (error) {
      logger.error('Cloudflare RAG failed', error);
      throw error;
    }
  }
}

export default GeminiService;