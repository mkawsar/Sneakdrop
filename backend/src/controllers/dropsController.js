import * as dropService from '../services/dropService.js';

export async function listDrops(req, res, next) {
  try {
    const drops = await dropService.getActiveDropsWithLatestPurchasers();
    res.json({ drops });
  } catch (err) {
    next(err);
  }
}

export async function createDrop(req, res, next) {
  try {
    const { name, priceCents, totalStock, startsAt, endsAt } = req.body;
    if (!name || priceCents == null || totalStock == null) {
      return res.status(400).json({
        error: 'Missing required fields: name, priceCents, totalStock',
      });
    }
    const drop = await dropService.createDrop({
      name: String(name).trim(),
      priceCents: Number(priceCents),
      totalStock: Math.max(0, Math.floor(Number(totalStock))),
      startsAt: startsAt ? new Date(startsAt) : null,
      endsAt: endsAt ? new Date(endsAt) : null,
    });
    res.status(201).json({ drop: drop.get({ plain: true }) });
  } catch (err) {
    next(err);
  }
}
