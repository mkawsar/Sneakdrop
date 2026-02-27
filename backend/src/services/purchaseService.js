import { Reservation, Purchase, Drop, User } from '../models/index.js';
import sequelize from '../db/sequelize.js';
import { getActiveReservationForUser } from './reservationService.js';

/**
 * Complete purchase for a reserved item. Stock is already reduced by reservation; we just mark reservation completed and create purchase.
 */
export async function completePurchase(dropId, userId) {
  const reservation = await getActiveReservationForUser(dropId, userId);
  if (!reservation) {
    return { success: false, error: 'No active reservation or reservation expired' };
  }

  const t = await sequelize.transaction();
  try {
    await Reservation.update(
      { status: 'completed' },
      { where: { id: reservation.id }, transaction: t }
    );

    const purchase = await Purchase.create(
      {
        drop_id: dropId,
        user_id: userId,
        reservation_id: reservation.id,
      },
      { transaction: t }
    );

    await t.commit();

    const user = await User.findByPk(userId, { attributes: ['id', 'username'], raw: true });
    const drop = await Drop.findByPk(dropId, { attributes: ['id', 'available_stock'], raw: true });

    return {
      success: true,
      purchase: purchase.get({ plain: true }),
      purchaser: user,
      newStock: drop?.available_stock ?? 0,
    };
  } catch (err) {
    await t.rollback();
    throw err;
  }
}
