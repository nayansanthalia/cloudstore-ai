import { Router } from 'express';
import { QueryController } from '../controllers/query.controller';

const router = Router();

router.post('/', QueryController.query);

export default router;
