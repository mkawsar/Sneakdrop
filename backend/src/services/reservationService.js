import { Op } from 'sequelize';
import { Drop, Reservation, User } from '../models/index.js';
import sequelize from '../db/sequelize.js';
import { config } from '../config/index.js';

const RESERVATION_TTL_MS = config.reservationTtlSeconds * 1000;

/**
 * Atomically reserve one unit of a drop for a user.
 * Uses SELECT ... FOR UPDATE to prevent overselling when many users reserve the last item.
 * @param { number } dropId
 * @param { number } userId
 * @returns {{ success: boolean, reservation?: object, error?: string }}
 */
export async function reserve(dropId, userId) {
  const t = await sequelize.transaction();

  try {
    const drop = await Drop.findByPk(dropId, {
      lock: true,
      transaction: t,
    });

    if (!drop) {
      await t.rollback();
      return { success: false, error: 'Drop not found' };
    }

    if (drop.available_stock < 1) {
      await t.rollback();
      return { success: false, error: 'Insufficient stock' };
    }

    const expiresAt = new Date(Date.now() + RESERVATION_TTL_MS);

    const reservation = await Reservation.create(
      {
        drop_id: dropId,
        user_id: userId,
        expires_at: expiresAt,
        status: 'active',
      },
      { transaction: t }
    );

    await drop.decrement('available_stock', { by: 1, transaction: t });
    await t.commit();

    const updatedDrop = await Drop.findByPk(dropId, { attributes: ['id', 'available_stock'] });
    return {
      success: true,
      reservation: reservation.get({ plain: true }),
      newStock: updatedDrop?.available_stock ?? drop.available_stock - 1,
    };
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

/**
 * Find and release all expired reservations, return list of { dropId, newStock } for socket broadcast.
 */
export async function releaseExpiredReservations() {
  const now = new Date();
  const expired = await Reservation.findAll({
    where: {
      status: 'active',
      expires_at: { [Op.lte]: now },
    },
    attributes: ['id', 'drop_id'],
    raw: true,
  });

  if (expired.length === 0) return [];

  const updates = [];
  const t = await sequelize.transaction();

  try {
    for (const r of expired) {
      await Reservation.update(
        { status: 'expired' },
        { where: { id: r.id }, transaction: t }
      );
      await Drop.increment('available_stock', {
        by: 1,
        where: { id: r.drop_id },
        transaction: t,
      });
      updates.push({ dropId: r.drop_id });
    }
    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }

  const dropIds = [...new Set(updates.map((u) => u.dropId))];
  const stocks = await Drop.findAll({
    where: { id: { [Op.in]: dropIds } },
    attributes: ['id', 'available_stock'],
    raw: true,
  });
  const stockMap = Object.fromEntries(stocks.map((s) => [s.id, s.available_stock]));

  return dropIds.map((dropId) => ({ dropId, newStock: stockMap[dropId] ?? 0 }));
}

/**
 * Get active reservation for user and drop (for purchase flow).
 */
export async function getActiveReservationForUser(dropId, userId) {
  return Reservation.findOne({
    where: {
      drop_id: dropId,
      user_id: userId,
      status: 'active',
      expires_at: { [Op.gt]: new Date() },
    },
  });
}
