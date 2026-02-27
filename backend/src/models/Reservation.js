import { DataTypes } from 'sequelize';
import sequelize from '../db/sequelize.js';

const Reservation = sequelize.define(
  'Reservation',
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
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'expired', 'completed'),
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    tableName: 'reservations',
    indexes: [], // Created in migrate.js with IF NOT EXISTS for idempotency
  }
);

export default Reservation;
