import { Server } from 'socket.io';
import { startReservationExpiryJob, setSocketIo } from '../jobs/reservationExpiryJob.js';

let ioInstance = null;

export function attachSocket(server) {
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean)
    : null;

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins && allowedOrigins.length > 0 ? allowedOrigins : true,
      methods: ['GET', 'POST'],
    },
    transports: ['polling', 'websocket'],
    pingTimeout: 20000,
    pingInterval: 10000,
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
