import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { DriveService } from '../services/drive.service';
import { logger } from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-signing-key';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export class AuthController {
  /**
   * GET /api/auth/google
   * Redirects user to Google OAuth consent screen
   */
  static login(_req: Request, res: Response) {
    try {
      const authUrl = DriveService.getAuthUrl();
      logger.info('Redirecting user to Google OAuth URL...');
      return res.redirect(authUrl);
    } catch (error) {
      logger.error('Failed to initiate login', error);
      return res.status(500).json({ error: 'Failed to initiate Google login' });
    }
  }

  /**
   * GET /api/auth/google/callback
   * Exchanges auth code for tokens, sets cookie, redirects back to React UI
   */
  static async callback(req: Request, res: Response) {
    const code = req.query.code as string;
    
    if (!code) {
      logger.warn('OAuth callback reached without authorization code.');
      return res.redirect(`${FRONTEND_URL}?error=missing_code`);
    }

    try {
      logger.info('OAuth callback code received, exchanging for tokens...');
      const tokens = await DriveService.getTokensFromCode(code);
      
      // Create JWT session token containing tokens
      const sessionToken = jwt.sign({ tokens }, JWT_SECRET, { expiresIn: '7d' });
      
      // Set HTTP-only secure cookie
      res.cookie('drive_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      logger.info('Google OAuth successful. Redirecting back to frontend dashboard.');
      return res.redirect(`${FRONTEND_URL}?connected=true`);
    } catch (error) {
      logger.error('Failed to process OAuth callback', error);
      return res.redirect(`${FRONTEND_URL}?error=oauth_failed`);
    }
  }

  /**
   * GET /api/auth/status
   * Checks if user is authenticated and returns profile details
   */
  static async status(req: Request, res: Response) {
    const sessionCookie = req.cookies?.drive_session;
    
    if (!sessionCookie) {
      return res.json({ connected: false });
    }

    try {
      const decoded = jwt.verify(sessionCookie, JWT_SECRET) as any;
      const tokens = decoded.tokens;

      if (!tokens) {
        return res.json({ connected: false });
      }

      // Fetch user profile from Google
      const profile = await DriveService.getUserProfile(tokens);
      return res.json({ connected: true, user: profile });
    } catch (error) {
      logger.warn('Auth status check failed, session cookie likely expired or invalid.');
      return res.json({ connected: false });
    }
  }

  /**
   * POST /api/auth/logout
   * Clears the session cookie
   */
  static logout(_req: Request, res: Response) {
    logger.info('Logging out user, clearing session cookie.');
    res.clearCookie('drive_session');
    return res.json({ success: true, message: 'Successfully disconnected Google Drive' });
  }

  /**
   * Helper utility to extract tokens from request cookies
   */
  static getTokens(req: Request): any | null {
    const sessionCookie = req.cookies?.drive_session;
    if (!sessionCookie) return null;
    
    try {
      const decoded = jwt.verify(sessionCookie, JWT_SECRET) as any;
      return decoded.tokens;
    } catch {
      return null;
    }
  }
}
export default AuthController;
