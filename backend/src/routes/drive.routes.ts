import { Router } from 'express';
import { DriveController } from '../controllers/drive.controller';

const router = Router();

router.get('/files', DriveController.getFiles);
router.post('/sync', DriveController.sync);
router.post('/files/:id/star', DriveController.toggleStar);

export default router;
