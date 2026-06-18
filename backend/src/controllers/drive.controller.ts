import { Request, Response } from 'express';
import { DriveService } from '../services/drive.service';
import { ParserService } from '../services/parser.service';
import { VectorService, IndexedFile } from '../services/vector.service';
import { AuthController } from './auth.controller';
import { GeminiService } from '../services/gemini.service';
import { logger } from '../utils/logger';

export class DriveController {
  /**
   * Helper to categorize files based on names for the React UI folders
   */
  private static categorizeFile(name: string): string {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('invoice') || lowerName.includes('receipt') || lowerName.includes('bill') || lowerName.includes('payment')) {
      return 'Invoices';
    }
    if (lowerName.includes('resume') || lowerName.includes('cv') || lowerName.includes('portfolio') || lowerName.includes('hiring') || lowerName.includes('candidate')) {
      return 'Resumes';
    }
    if (lowerName.includes('contract') || lowerName.includes('nda') || lowerName.includes('agreement') || lowerName.includes('policy') || lowerName.includes('terms')) {
      return 'Contracts';
    }
    if (lowerName.includes('report') || lowerName.includes('sales') || lowerName.includes('roi') || lowerName.includes('analysis') || lowerName.includes('sheet') || lowerName.includes('quarterly')) {
      return 'Reports';
    }
    return 'Projects';
  }

  /**
   * Helper to get simple file type labels
   */
  private static getFileType(fileName: string, mimeType: string): string {
    if (fileName.endsWith('.pdf') || mimeType === 'application/pdf') return 'pdf';
    if (fileName.endsWith('.docx') || mimeType.includes('officedocument.wordprocessingml')) return 'docx';
    if (fileName.endsWith('.xlsx') || mimeType.includes('spreadsheet') || mimeType.includes('ms-excel')) return 'xlsx';
    if (fileName.endsWith('.csv') || mimeType === 'text/csv') return 'csv';
    if (fileName.endsWith('.txt') || mimeType === 'text/plain') return 'txt';
    return 'unknown';
  }

  /**
   * Helper to format file sizes nicely
   */
  private static formatBytes(bytes: number | string | undefined): string {
    if (!bytes) return '0 KB';
    const numBytes = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
    if (isNaN(numBytes) || numBytes === 0) return '0 KB';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(numBytes) / Math.log(k));
    
    return parseFloat((numBytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  /**
   * GET /api/drive/files
   * Returns list of all indexed files formatted for the frontend
   */
  static getFiles(_req: Request, res: Response) {
    try {
      const indexedFiles = VectorService.getFiles();
      
      // Map to UI-friendly CloudFile schema
      const mappedFiles = indexedFiles.map((file) => ({
        id: GeminiService.getNumericId(file.id),
        driveId: file.id,
        name: file.name,
        folder: file.folder,
        type: file.type,
        size: file.sizeLabel,
        sizeBytes: file.sizeBytes,
        date: new Date(file.dateISO).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        dateISO: file.dateISO,
        tags: file.tags,
        starred: file.starred,
        content: '', // Do not return raw contents of all files to optimize payload size
      }));

      return res.json(mappedFiles);
    } catch (error) {
      logger.error('Failed to get indexed files', error);
      return res.status(500).json({ error: 'Failed to retrieve indexed files' });
    }
  }

  /**
   * POST /api/drive/sync
   * Polls Google Drive and synchronizes new/modified files
   */
  static async sync(req: Request, res: Response) {
    const tokens = AuthController.getTokens(req);
    if (!tokens) {
      return res.status(401).json({ error: 'Unauthorized. Connect Google Drive account first.' });
    }

    try {
      logger.info('Starting sync process from Google Drive...');
      const driveFiles = await DriveService.listFiles(tokens);
      
      let indexedCount = 0;
      let skippedCount = 0;
      let failedCount = 0;
      const errors: string[] = [];

      for (const df of driveFiles) {
        try {
          const fileId = df.id!;
          const name = df.name || 'Untitled File';
          const sizeBytes = df.size ? parseInt(df.size, 10) : 0;
          const modifiedTime = df.modifiedTime || new Date().toISOString();
          
          // Check if file is already indexed and unchanged
          const existingFile = VectorService.getFile(fileId);
          if (
            existingFile &&
            existingFile.sizeBytes === sizeBytes &&
            existingFile.dateISO === modifiedTime
          ) {
            skippedCount++;
            continue;
          }

          // File is either new or modified, download it
          logger.info(`Syncing file: "${name}" (${fileId})`);
          const downloadResult = await DriveService.downloadFile(tokens, fileId, df.mimeType!);
          
          // Parse text content
          const text = await ParserService.extractText(downloadResult.buffer, downloadResult.cleanMimeType, name);
          
          if (!text.trim()) {
            logger.warn(`File "${name}" has no readable text. Skipping indexing.`);
            skippedCount++;
            continue;
          }

          // Chunk text
          const chunks = ParserService.chunkText(text);
          if (chunks.length === 0) {
            skippedCount++;
            continue;
          }

          // Generate file metadata tags dynamically based on type and content
          const fileType = DriveController.getFileType(name, df.mimeType!);
          const tags = [fileType, DriveController.categorizeFile(name).toLowerCase()];
          if (name.includes('Reliance') || text.includes('Reliance')) tags.push('reliance');
          if (name.includes('Invoice') || text.includes('Invoice')) tags.push('invoice');
          if (name.includes('Resume') || text.includes('Resume')) tags.push('resume');

          const indexedFile: IndexedFile = {
            id: fileId,
            name,
            mimeType: df.mimeType!,
            sizeBytes,
            sizeLabel: DriveController.formatBytes(sizeBytes),
            folder: DriveController.categorizeFile(name),
            type: fileType,
            dateISO: modifiedTime,
            tags,
            starred: existingFile ? existingFile.starred : false,
          };

          // Index file and its chunks in Vector database
          await VectorService.indexFile(indexedFile, chunks);
          indexedCount++;
        } catch (fileError) {
          failedCount++;
          const errMsg = `Failed to process "${df.name}": ${(fileError as Error).message}`;
          logger.error(errMsg, fileError);
          errors.push(errMsg);
        }
      }

      logger.info(`Sync complete. Scanned: ${driveFiles.length}, Indexed: ${indexedCount}, Skipped: ${skippedCount}, Failed: ${failedCount}`);
      
      return res.json({
        success: true,
        scanned: driveFiles.length,
        indexed: indexedCount,
        skipped: skippedCount,
        failed: failedCount,
        errors: errors.length > 0 ? errors : undefined,
      });
    } catch (error) {
      logger.error('Failed to sync Google Drive files', error);
      return res.status(500).json({ error: `Sync failed: ${(error as Error).message}` });
    }
  }

  /**
   * POST /api/drive/files/:id/star
   * Toggles the starred state of a file
   */
  static toggleStar(req: Request, res: Response) {
    const numericId = parseInt(req.params.id, 10);
    if (isNaN(numericId)) {
      return res.status(400).json({ error: 'Invalid file ID' });
    }

    try {
      // Find the file by numeric ID
      const allFiles = VectorService.getFiles();
      const file = allFiles.find((f) => GeminiService.getNumericId(f.id) === numericId);

      if (!file) {
        return res.status(404).json({ error: 'File not found in index' });
      }

      const isStarred = VectorService.toggleStarred(file.id);
      return res.json({ success: true, starred: isStarred });
    } catch (error) {
      logger.error(`Failed to toggle star for file ${numericId}`, error);
      return res.status(500).json({ error: 'Failed to star/unstar file' });
    }
  }
}
export default DriveController;
