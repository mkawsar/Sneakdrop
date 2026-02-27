import { Router } from 'express';
import * as ctrl from '../controllers/purchasesController.js';

const router = Router();
router.post('/drops/:dropId/purchase', ctrl.completePurchase);
export default router;
