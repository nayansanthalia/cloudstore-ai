import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import { logger } from '../utils/logger';

export interface DocumentChunk {
  text: string;
  chunkIndex: number;
}

export class ParserService {
  /**
   * Extracts text content from file buffer based on MIME type
   */
  static async extractText(buffer: Buffer, mimeType: string, fileName: string): Promise<string> {
    try {
      logger.info(`Parsing file "${fileName}" with MIME type: ${mimeType}`);

      if (mimeType === 'application/pdf' || fileName.endsWith('.pdf')) {
        const data = await pdf(buffer);
        return data.text || '';
      }

      if (
        mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        fileName.endsWith('.docx')
      ) {
        const result = await mammoth.extractRawText({ buffer });
        return result.value || '';
      }

      if (
        mimeType === 'text/plain' ||
        mimeType === 'text/markdown' ||
        fileName.endsWith('.txt') ||
        fileName.endsWith('.md')
      ) {
        return buffer.toString('utf-8');
      }

      if (
        mimeType === 'text/csv' ||
        mimeType === 'application/vnd.ms-excel' ||
        fileName.endsWith('.csv')
      ) {
        // Return CSV text directly
        return buffer.toString('utf-8');
      }

      // Default fallback
      logger.warn(`Unsupported file type for parsing: ${mimeType}. Attempting to convert buffer to string.`);
      return buffer.toString('utf-8');
    } catch (error) {
      logger.error(`Failed to parse text from file "${fileName}"`, error);
      throw new Error(`Parser failed for ${fileName}: ${(error as Error).message}`);
    }
  }

  /**
   * Splits document text into smaller, overlapping chunks
   */
  static chunkText(text: string, chunkSize = 1500, overlap = 200): DocumentChunk[] {
    const cleanedText = text.replace(/\s+/g, ' ').trim();
    if (!cleanedText) return [];

    const chunks: DocumentChunk[] = [];
    let start = 0;
    let index = 0;

    while (start < cleanedText.length) {
      const end = Math.min(start + chunkSize, cleanedText.length);
      let chunk = cleanedText.slice(start, end);

      // Try to align chunk boundary with a sentence end to preserve semantic structure
      if (end < cleanedText.length) {
        const lastSentenceBoundary = Math.max(
          chunk.lastIndexOf('. '),
          chunk.lastIndexOf('? '),
          chunk.lastIndexOf('! ')
        );

        // Only adjust if the sentence boundary is within a reasonable distance (e.g., last 20% of the chunk)
        if (lastSentenceBoundary > chunkSize * 0.8) {
          const adjustedEnd = start + lastSentenceBoundary + 1;
          chunk = cleanedText.slice(start, adjustedEnd);
          start = adjustedEnd - overlap;
        } else {
          start = end - overlap;
        }
      } else {
        start = end;
      }

      chunks.push({
        text: chunk.trim(),
        chunkIndex: index++
      });

      // Avoid infinite loop if start does not progress
      if (overlap >= chunkSize) {
        logger.error('Overlap must be strictly less than chunkSize');
        break;
      }
    }

    return chunks;
  }
}
