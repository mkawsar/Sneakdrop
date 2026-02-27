import sequelize from './sequelize.js';
import '../models/index.js';

// Drop legacy indexes that Sequelize may have created with default names (idempotent)
const DROP_LEGACY_INDEXES = [
  'DROP INDEX IF EXISTS "purchases_drop_id"',
  'DROP INDEX IF EXISTS "purchases_user_id"',
];

const INDEXES_SQL = [
  'CREATE INDEX IF NOT EXISTS idx_drops_starts_at ON drops (starts_at)',
  'CREATE INDEX IF NOT EXISTS idx_drops_ends_at ON drops (ends_at)',
  'CREATE INDEX IF NOT EXISTS idx_drops_available_stock ON drops (available_stock)',
  'CREATE INDEX IF NOT EXISTS idx_reservations_drop_id ON reservations (drop_id)',
  'CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON reservations (user_id)',
  'CREATE INDEX IF NOT EXISTS idx_reservations_expires_at ON reservations (expires_at)',
  'CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations (status)',
  'CREATE INDEX IF NOT EXISTS idx_reservations_drop_user_status ON reservations (drop_id, user_id, status)',
  'CREATE INDEX IF NOT EXISTS idx_purchases_drop_id ON purchases (drop_id)',
  'CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases (user_id)',
  'CREATE INDEX IF NOT EXISTS idx_purchases_drop_id_created_at ON purchases (drop_id, created_at DESC)',
];

async function migrate() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    for (const sql of DROP_LEGACY_INDEXES) {
      await sequelize.query(sql);
    }
    for (const sql of INDEXES_SQL) {
      await sequelize.query(sql);
    }
    console.log('Database synced.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
