import http from 'http';
import app from './app.js';
import { config } from './config/index.js';
import { sequelize } from './models/index.js';
import { attachSocket } from './socket/index.js';

const server = http.createServer(app);
attachSocket(server);

async function start() {
  try {
    await sequelize.authenticate();
    server.listen(config.port, () => {
      console.log(`Server listening on port ${config.port}`);
    });
  } catch (err) {
    console.error('Failed to start:', err);
    process.exit(1);
  }
}

start();
