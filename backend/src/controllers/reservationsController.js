import * as reservationService from '../services/reservationService.js';
import { emitStockUpdate } from '../socket/index.js';

export async function reserve(req, res, next) {
  try {
    const dropId = Number(req.params.dropId);
    const userId = Number(req.body.userId ?? req.query.userId);
    if (!userId || !dropId) {
      return res.status(400).json({ error: 'dropId and userId required' });
    }
    const result = await reservationService.reserve(dropId, userId);
    if (!result.success) {
      return res.status(409).json({ error: result.error });
    }
    emitStockUpdate(dropId, result.newStock);
    res.status(201).json({
      reservation: result.reservation,
      newStock: result.newStock,
    });
  } catch (err) {
    next(err);
  }
}
