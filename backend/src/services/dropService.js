import { Op } from 'sequelize';
import { Drop, Purchase, User } from '../models/index.js';

const LATEST_PURCHASERS_LIMIT = 3;

/**
 * Create a new merch drop.
 * @param {{ name: string, priceCents: number, totalStock: number, startsAt?: Date, endsAt?: Date }}
 */
export async function createDrop({ name, priceCents, totalStock, startsAt = null, endsAt = null }) {
  const drop = await Drop.create({
    name,
    price_cents: priceCents,
    total_stock: totalStock,
    available_stock: totalStock,
    starts_at: startsAt ?? null,
    ends_at: endsAt ?? null,
  });
  return drop;
}

/**
 * Get all active drops with latest 3 purchasers per drop.
 * Uses 2 queries to avoid N+1: (1) all drops, (2) all purchases for those drops with users, then group in memory.
 */
export async function getActiveDropsWithLatestPurchasers() {
  const now = new Date();

  const drops = await Drop.findAll({
    where: {
      available_stock: { [Op.gt]: 0 },
      [Op.and]: [
        { [Op.or]: [{ starts_at: null }, { starts_at: { [Op.lte]: now } }] },
        { [Op.or]: [{ ends_at: null }, { ends_at: { [Op.gte]: now } }] },
      ],
    },
    order: [['id', 'ASC']],
    raw: false,
  });

  if (drops.length === 0) {
    return [];
  }

  const dropIds = drops.map((d) => d.id);

  const purchases = await Purchase.findAll({
    where: { drop_id: { [Op.in]: dropIds } },
    include: [
      {
        model: User,
        as: 'User',
        attributes: ['id', 'username'],
        required: true,
      },
    ],
    order: [
      ['drop_id', 'ASC'],
      ['created_at', 'DESC'],
    ],
    raw: false,
  });

  const purchasersByDropId = new Map();
  for (const p of purchases) {
    const did = p.drop_id;
    if (!purchasersByDropId.has(did)) purchasersByDropId.set(did, []);
    const list = purchasersByDropId.get(did);
    if (list.length < LATEST_PURCHASERS_LIMIT) {
      list.push({
        id: p.User?.id,
        username: p.User?.username ?? null,
      });
    }
  }

  return drops.map((drop) => {
    const d = drop.get({ plain: true });
    d.latest_purchasers = purchasersByDropId.get(drop.id) ?? [];
    return d;
  });
}

/**
 * Get single drop by id (for validation).
 */
export async function getDropById(id) {
  return Drop.findByPk(id);
}
