import { DataTypes } from 'sequelize';
import sequelize from '../db/sequelize.js';

const Drop = sequelize.define(
  'Drop',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    price_cents: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    available_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    starts_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ends_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'drops',
    indexes: [], // Created in migrate.js with IF NOT EXISTS for idempotency
  }
);

export default Drop;
