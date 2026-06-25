import dotenv from 'dotenv';
import path from 'path';

// Load environmental variables
dotenv.config({ path: path.join(__dirname, '../.env') });

import app from './app';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`==================================================`);
  logger.info(`CloudSphere AI Backend started in ${process.env.NODE_ENV || 'development'} mode.`);
  logger.info(`Server is running at http://localhost:${PORT}`);
  logger.info(`Connected to Frontend at ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  logger.info(`==================================================`);
});
