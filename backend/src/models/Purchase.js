import { DataTypes } from 'sequelize';
import sequelize from '../db/sequelize.js';

const Purchase = sequelize.define(
  'Purchase',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    drop_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'drops', key: 'id' },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    reservation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'reservations', key: 'id' },
    },
  },
  {
    tableName: 'purchases',
    indexes: [], // Created in migrate.js with IF NOT EXISTS for idempotency
  }
);

export default Purchase;
