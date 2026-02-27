import { Router } from 'express';
import * as ctrl from '../controllers/dropsController.js';

const router = Router();
router.get('/', ctrl.listDrops);
router.post('/', ctrl.createDrop);
export default router;
