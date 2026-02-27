import sequelize from './sequelize.js';
import '../models/index.js';
import { User, Drop } from '../models/index.js';

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });

    const [u1] = await User.findOrCreate({ where: { username: 'alice' }, defaults: { username: 'alice' } });
    const [u2] = await User.findOrCreate({ where: { username: 'bob' }, defaults: { username: 'bob' } });
    const [u3] = await User.findOrCreate({ where: { username: 'charlie' }, defaults: { username: 'charlie' } });

    await Drop.findOrCreate({
      where: { name: 'Air Jordan 1 Retro High' },
      defaults: {
        name: 'Air Jordan 1 Retro High',
        price_cents: 19900,
        total_stock: 100,
        available_stock: 100,
        starts_at: new Date(),
        ends_at: null,
      },
    });
    await Drop.findOrCreate({
      where: { name: 'Nike Dunk Low' },
      defaults: {
        name: 'Nike Dunk Low',
        price_cents: 12000,
        total_stock: 50,
        available_stock: 50,
        starts_at: new Date(),
        ends_at: null,
      },
    });

    console.log('Seed complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
