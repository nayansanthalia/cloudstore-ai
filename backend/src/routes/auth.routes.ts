import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

router.get('/google', AuthController.login);
router.get('/google/callback', AuthController.callback);
router.get('/status', AuthController.status);
router.post('/logout', AuthController.logout);

export default router;
