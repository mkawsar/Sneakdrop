import { Router } from 'express';
import * as ctrl from '../controllers/reservationsController.js';

const router = Router();
router.post('/drops/:dropId/reserve', ctrl.reserve);
export default router;
