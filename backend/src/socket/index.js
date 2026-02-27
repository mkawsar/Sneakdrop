import { Server } from 'socket.io';
import { startReservationExpiryJob, setSocketIo } from '../jobs/reservationExpiryJob.js';

let ioInstance = null;

export function attachSocket(server) {
  const io = new Server(server, {
    cors: { origin: true },
    transports: ['websocket', 'polling'],
  });

  ioInstance = io;
  setSocketIo(io);

  io.on('connection', () => {});

  startReservationExpiryJob();
  return io;
}

export function emitStockUpdate(dropId, newStock) {
  if (ioInstance) ioInstance.emit('stockUpdated', { dropId, newStock });
}

export function emitPurchase(dropId, newStock, purchaser) {
  if (ioInstance) ioInstance.emit('purchaseCompleted', { dropId, newStock, purchaser });
}
