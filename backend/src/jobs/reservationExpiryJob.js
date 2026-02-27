import { config } from '../config/index.js';
import { releaseExpiredReservations } from '../services/reservationService.js';

let ioRef = null;

export function setSocketIo(io) {
  ioRef = io;
}

export function startReservationExpiryJob() {
  const intervalMs = config.reservationExpiryJobIntervalMs;

  setInterval(async () => {
    try {
      const updates = await releaseExpiredReservations();
      if (ioRef && updates.length > 0) {
        for (const { dropId, newStock } of updates) {
          ioRef.emit('stockUpdated', { dropId, newStock });
        }
      }
    } catch (err) {
      console.error('Reservation expiry job error:', err);
    }
  }, intervalMs);

  console.log(`Reservation expiry job started (interval: ${intervalMs}ms)`);
}
