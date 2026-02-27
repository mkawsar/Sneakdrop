import { Router } from 'express';
import * as ctrl from '../controllers/usersController.js';

const router = Router();
router.post('/get-or-create', ctrl.getOrCreateUser);
export default router;
