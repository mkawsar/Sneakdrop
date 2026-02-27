import * as purchaseService from '../services/purchaseService.js';
import { emitStockUpdate, emitPurchase } from '../socket/index.js';

export async function completePurchase(req, res, next) {
  try {
    const dropId = Number(req.params.dropId);
    const userId = Number(req.body.userId ?? req.query.userId);
    if (!userId || !dropId) {
      return res.status(400).json({ error: 'dropId and userId required' });
    }
    const result = await purchaseService.completePurchase(dropId, userId);
    if (!result.success) {
      return res.status(409).json({ error: result.error });
    }
    emitStockUpdate(dropId, result.newStock);
    emitPurchase(dropId, result.newStock, result.purchaser);
    res.json({
      purchase: result.purchase,
      newStock: result.newStock,
      purchaser: result.purchaser,
    });
  } catch (err) {
    next(err);
  }
}
