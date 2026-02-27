import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  reservationTtlSeconds: parseInt(process.env.RESERVATION_TTL_SECONDS || '60', 10),
  reservationExpiryJobIntervalMs: parseInt(
    process.env.RESERVATION_EXPIRY_JOB_INTERVAL_MS || '5000',
    10
  ),
  database: {
    url: process.env.DATABASE_URL,
  },
};
