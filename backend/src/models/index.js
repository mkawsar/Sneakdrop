import sequelize from '../db/sequelize.js';
import User from './User.js';
import Drop from './Drop.js';
import Reservation from './Reservation.js';
import Purchase from './Purchase.js';

// Associations
User.hasMany(Reservation, { foreignKey: 'user_id' });
Reservation.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Purchase, { foreignKey: 'user_id' });
Purchase.belongsTo(User, { foreignKey: 'user_id' });

Drop.hasMany(Reservation, { foreignKey: 'drop_id' });
Reservation.belongsTo(Drop, { foreignKey: 'drop_id' });

Drop.hasMany(Purchase, { foreignKey: 'drop_id' });
Purchase.belongsTo(Drop, { foreignKey: 'drop_id' });

Reservation.hasOne(Purchase, { foreignKey: 'reservation_id' });
Purchase.belongsTo(Reservation, { foreignKey: 'reservation_id' });

export { sequelize, User, Drop, Reservation, Purchase };
