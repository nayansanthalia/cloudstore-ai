import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes';
import { VectorService } from './services/vector.service';
import { GeminiService } from './services/gemini.service';
import { logger } from './utils/logger';

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// 1. Configure CORS to allow secure credentials (cookies)
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 2. Configure body-parsers and cookie parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 3. Register routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// 4. Initialize RAG Services
try {
  logger.info('Initializing Vector and Gemini services...');
  VectorService.initialize();
  GeminiService.initialize();
  logger.info('Services initialized successfully.');
} catch (err) {
  logger.error('Failed to initialize core RAG services on startup', err);
}

export default app;
