import { Request, Response } from 'express';
import { VectorService } from '../services/vector.service';
import { GeminiService } from '../services/gemini.service';
import { logger } from '../utils/logger';

export class QueryController {
  /**
   * POST /api/query
   * Accepts user query, performs vector search, and generates LLM response with sources
   */
  static async query(req: Request, res: Response) {
    const { query } = req.body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
      logger.info(`Received RAG query: "${query}"`);

      // 1. Get all indexed files
      const indexedFiles = VectorService.getFiles();
      if (indexedFiles.length === 0) {
        logger.warn('Query requested but no files have been indexed yet.');
        return res.json({
          answer: 'Your file index is currently empty. Please connect Google Drive and click "Sync" to index your files first, then you can search them!',
          matches: [],
          insight: 'Connect your cloud storage to unlock semantic analytics.'
        });
      }

      // Convert array of files to a Record map for fast lookup
      const fileMap = indexedFiles.reduce((acc, file) => {
        acc[file.id] = file;
        return acc;
      }, {} as Record<string, typeof indexedFiles[0]>);

      // 2. Perform Cosine Similarity vector search (retrieve top 6 context chunks)
      const topChunks = await VectorService.searchSimilarity(query, 6);

      if (topChunks.length === 0 || topChunks[0].score < 0.1) {
        logger.info(`No high-relevance chunks found.`);
        return res.json({
          answer: 'I could not find any relevant information matching your query in the currently indexed files.',
          matches: [],
          insight: null
        });
      }

      // Log retrieved chunks details
      logger.info(`Retrieved ${topChunks.length} chunks. Highest similarity score: ${topChunks[0].score.toFixed(3)}`);
      topChunks.forEach((c, idx) => {
        const f = fileMap[c.chunk.fileId];
        logger.debug(`Chunk #${idx + 1}: File "${f?.name || c.chunk.fileId}" (Score: ${c.score.toFixed(3)})`);
      });

      // 3. Request RAG answer generation from Gemini
      const ragResponse = await GeminiService.queryRAG(query, topChunks, fileMap);
      
      return res.json(ragResponse);
    } catch (error) {
      logger.error('Query processing failed', error);
      return res.status(500).json({ error: `AI query processing failed: ${(error as Error).message}` });
    }
  }
}
export default QueryController;
