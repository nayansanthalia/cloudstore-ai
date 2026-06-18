import { Router } from 'express';
import authRoutes from './auth.routes';
import driveRoutes from './drive.routes';
import queryRoutes from './query.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/drive', driveRoutes);
router.use('/query', queryRoutes);

export default router;
