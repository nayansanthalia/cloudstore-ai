import { google } from 'googleapis';
import { logger } from '../utils/logger';

export class DriveService {
  private static getOAuth2Client() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      logger.error('Missing Google OAuth environment variables');
      throw new Error('Google OAuth credentials not configured in backend .env');
    }

    return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  }

  /**
   * Generates OAuth redirect URL for Google login
   */
  static getAuthUrl(state?: string): string {
    const client = this.getOAuth2Client();
    return client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ],
      prompt: 'consent',
      state: state
    });
  }

  /**
   * Exchanges callback code for access and refresh tokens
   */
  static async getTokensFromCode(code: string): Promise<any> {
    const client = this.getOAuth2Client();
    const { tokens } = await client.getToken(code);
    return tokens;
  }

  /**
   * Returns a configured google.drive client using user tokens
   */
  static getDriveClient(tokens: any) {
    const client = this.getOAuth2Client();
    client.setCredentials(tokens);
    return google.drive({ version: 'v3', auth: client });
  }

  /**
   * Returns details of the logged in user
   */
  static async getUserProfile(tokens: any): Promise<{ name: string; email: string; picture: string }> {
    const client = this.getOAuth2Client();
    client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: client });
    const userInfo = await oauth2.userinfo.get();
    
    return {
      name: userInfo.data.name || '',
      email: userInfo.data.email || '',
      picture: userInfo.data.picture || ''
    };
  }

  /**
   * Lists searchable files from Google Drive
   */
  static async listFiles(tokens: any): Promise<any[]> {
    try {
      const drive = this.getDriveClient(tokens);
      logger.info('Fetching list of files from Google Drive...');
      
      const query = [
        "mimeType = 'application/pdf'",
        "mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'",
        "mimeType = 'text/plain'",
        "mimeType = 'text/csv'",
        "mimeType = 'application/vnd.google-apps.document'",
        "mimeType = 'application/vnd.google-apps.spreadsheet'"
      ].join(' or ');

      const response = await drive.files.list({
        q: `(${query}) and trashed = false`,
        fields: 'files(id, name, mimeType, size, createdTime, modifiedTime, parents)',
        pageSize: 100
      });

      return response.data.files || [];
    } catch (error) {
      logger.error('Failed to list files from Google Drive', error);
      throw error;
    }
  }

  /**
   * Downloads a file (or exports GDoc/GSheet) to a buffer
   */
  static async downloadFile(tokens: any, fileId: string, mimeType: string): Promise<{ buffer: Buffer; cleanMimeType: string }> {
    try {
      const drive = this.getDriveClient(tokens);
      logger.info(`Downloading file "${fileId}" (original MIME: ${mimeType})...`);

      // 1. Handle Google Workspace native apps by exporting them
      if (mimeType === 'application/vnd.google-apps.document') {
        // Export Google Doc as plain text
        logger.info(`Exporting Google Doc ${fileId} as plain text...`);
        const response = await drive.files.export(
          { fileId, mimeType: 'text/plain' },
          { responseType: 'arraybuffer' }
        );
        return {
          buffer: Buffer.from(response.data as ArrayBuffer),
          cleanMimeType: 'text/plain'
        };
      }

      if (mimeType === 'application/vnd.google-apps.spreadsheet') {
        // Export Google Sheet as CSV
        logger.info(`Exporting Google Sheet ${fileId} as CSV...`);
        const response = await drive.files.export(
          { fileId, mimeType: 'text/csv' },
          { responseType: 'arraybuffer' }
        );
        return {
          buffer: Buffer.from(response.data as ArrayBuffer),
          cleanMimeType: 'text/csv'
        };
      }

      // 2. Handle standard binary files (PDF, DOCX, TXT, CSV) by downloading directly
      const response = await drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'arraybuffer' }
      );
      
      return {
        buffer: Buffer.from(response.data as ArrayBuffer),
        cleanMimeType: mimeType
      };
    } catch (error) {
      logger.error(`Failed to download/export file "${fileId}" from Google Drive`, error);
      throw error;
    }
  }
}
export default DriveService;
