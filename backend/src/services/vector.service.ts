import fs from 'fs';
import path from 'path';
import { CloudflareService } from './cloudflare.service';
import { logger } from '../utils/logger';

export interface IndexedFile {
  id: string; // Google Drive file ID
  name: string;
  mimeType: string;
  sizeBytes: number;
  sizeLabel: string;
  folder: string; // 'Invoices' | 'Resumes' | 'Reports' | 'Contracts' | 'Projects' | 'Other'
  type: string; // pdf, docx, csv, txt, etc.
  dateISO: string;
  tags: string[];
  starred: boolean;
}

export interface VectorChunk {
  fileId: string;
  text: string;
  chunkIndex: number;
  vector: number[];
}

interface DBStructure {
  files: Record<string, IndexedFile>;
  chunks: VectorChunk[];
}

export class VectorService {
  private static dbPath = path.join(process.cwd(), 'db.json');
  private static db: DBStructure = { files: {}, chunks: [] };

  static initialize() {
    this.loadDatabase();
  }

  private static async generateEmbedding(
    text: string
  ): Promise<number[]> {
    return CloudflareService.generateEmbedding(text);
  }

  /**
   * Loads the database from db.json if it exists
   */
  private static loadDatabase() {
    try {
      if (fs.existsSync(this.dbPath)) {
        const rawData = fs.readFileSync(this.dbPath, 'utf-8');
        this.db = JSON.parse(rawData);
        logger.info(`Loaded database from disk: ${Object.keys(this.db.files).length} files, ${this.db.chunks.length} vector chunks.`);
      } else {
        logger.info('No database file found. Initialized empty in-memory DB.');
        this.saveDatabase();
      }
    } catch (error) {
      logger.error('Failed to load database from disk', error);
      // fallback to empty DB
      this.db = { files: {}, chunks: [] };
    }
  }

  /**
   * Saves the database in-memory state to db.json
   */
  private static saveDatabase() {
    try {
      // Ensure folder directory exists
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.dbPath, JSON.stringify(this.db, null, 2), 'utf-8');
      logger.debug('Database state saved to disk.');
    } catch (error) {
      logger.error('Failed to save database to disk', error);
    }
  }

  /**
   * Returns list of indexed files
   */
  static getFiles(): IndexedFile[] {
    return Object.values(this.db.files);
  }

  /**
   * Returns a specific file by its ID
   */
  static getFile(id: string): IndexedFile | undefined {
    return this.db.files[id];
  }

  /**
   * Toggles the starred status of a file
   */
  static toggleStarred(id: string): boolean {
    if (this.db.files[id]) {
      this.db.files[id].starred = !this.db.files[id].starred;
      this.saveDatabase();
      return this.db.files[id].starred;
    }
    return false;
  }

  /**
   * Clears all indexed files and vector chunks
   */
  static clearIndex() {
    this.db = { files: {}, chunks: [] };
    this.saveDatabase();
    logger.info('Vector database cleared.');
  }

  /**
   * Adds a file and its chunks to the vector database
   */
  static async indexFile(file: IndexedFile, chunks: { text: string; chunkIndex: number }[]) {
    try {
      // 1. Remove previous entries for this file to prevent duplication
      this.removeFileFromIndex(file.id);

      logger.info(`Generating embeddings for ${chunks.length} chunks of file "${file.name}"...`);

      // 2. Generate embeddings in batches of 10 to respect API rate limits
      const vectorChunks: VectorChunk[] = [];
      const batchSize = 10;
      
      for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        const embedPromises = batch.map(async (chunk) => {
          try {
            const embedding =
  await this.generateEmbedding(chunk.text);

return {
  fileId: file.id,
  text: chunk.text,
  chunkIndex: chunk.chunkIndex,
  vector: embedding
};
          } catch (err) {
            logger.error(`Error generating embedding for chunk ${chunk.chunkIndex} of "${file.name}"`, err);
            return null;
          }
        });

        const results = await Promise.all(embedPromises);
        for (const res of results) {
          if (res) vectorChunks.push(res);
        }
      }

      // 3. Save to database
      this.db.files[file.id] = file;
      this.db.chunks.push(...vectorChunks);
      this.saveDatabase();
      logger.info(`Successfully indexed file "${file.name}" with ${vectorChunks.length} chunks.`);
    } catch (error) {
      logger.error(`Failed to index file "${file.name}"`, error);
      throw error;
    }
  }

  /**
   * Removes a file and its chunks from the DB
   */
  static removeFileFromIndex(fileId: string) {
    if (this.db.files[fileId]) {
      delete this.db.files[fileId];
      this.db.chunks = this.db.chunks.filter((c) => c.fileId !== fileId);
      this.saveDatabase();
      logger.info(`Removed file ${fileId} from index.`);
    }
  }

  /**
   * Calculates cosine similarity between two vectors
   */
  private static cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0.0;
    let normA = 0.0;
    let normB = 0.0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Searches the database for top relevant chunks matching the query
   */
 static async searchSimilarity(
  query: string,
  limit = 5
): Promise<{ chunk: VectorChunk; score: number }[]> {
  try {
    logger.info(`Embedding query: "${query}"`);

    const queryVector =
      await this.generateEmbedding(query);

    const scoredChunks = this.db.chunks.map((chunk) => {
      const score = this.cosineSimilarity(
        queryVector,
        chunk.vector
      );

      return {
        chunk,
        score
      };
    });

    scoredChunks.sort((a, b) => b.score - a.score);

    return scoredChunks.slice(0, limit);
  } catch (error) {
    logger.error(
      `Similarity search failed for query: "${query}"`,
      error
    );

    throw error;
  }
}
}

export default VectorService;