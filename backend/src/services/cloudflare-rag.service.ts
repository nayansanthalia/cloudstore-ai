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

export class CloudflareRAGService {
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

    const context = searchResults
      .map((result) => {
        const file = allFiles[result.chunk.fileId];

        return `
FILE: ${file?.name}
FILE_ID: ${result.chunk.fileId}

${result.chunk.text}
`;
      })
      .join('\n\n');

    const prompt = `
You are CloudStore AI.

Answer ONLY using the provided context.

If answer not found, say:
"I could not find that information in the indexed files."

CONTEXT:
${context}

QUESTION:
${query}
`;

    logger.info('Generating Cloudflare AI response...');

    const answer =
      await CloudflareService.generateAnswer(prompt);

    const matches = searchResults.slice(0, 5).map((r) => ({
      id: this.getNumericId(r.chunk.fileId),
      driveId: r.chunk.fileId,
      relevance: 'high' as const,
      reason: 'Relevant semantic match',
      highlight: r.chunk.text.slice(0, 200)
    }));

    return {
      answer,
      matches,
      insight: null
    };
  }
}

export default CloudflareRAGService;