import 'dotenv/config';
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../src/app.js';
import { sequelize } from '../src/models/index.js';

before(async () => {
  await sequelize.authenticate();
});

after(async () => {
  await sequelize.close();
});

describe('GET /api/drops', () => {
  it('returns 200 and drops array', async () => {
    const res = await request(app).get('/api/drops');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.drops));
  });
});

describe('POST /api/drops', () => {
  it('returns 400 when missing required fields', async () => {
    const res = await request(app).post('/api/drops').send({});
    assert.strictEqual(res.status, 400);
    assert.ok(res.body.error);
  });

  it('returns 201 and drop when body is valid', async () => {
    const res = await request(app)
      .post('/api/drops')
      .send({
        name: 'Test Drop',
        priceCents: 9900,
        totalStock: 10,
      });
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.drop);
    assert.strictEqual(res.body.drop.name, 'Test Drop');
    assert.strictEqual(res.body.drop.price_cents, 9900);
    assert.strictEqual(res.body.drop.total_stock, 10);
    assert.strictEqual(res.body.drop.available_stock, 10);
  });
});

describe('POST /api/users/get-or-create', () => {
  it('returns 400 when username is missing', async () => {
    const res = await request(app).post('/api/users/get-or-create').send({});
    assert.strictEqual(res.status, 400);
    assert.ok(res.body.error);
  });

  it('returns 200 and user when username is provided', async () => {
    const res = await request(app)
      .post('/api/users/get-or-create')
      .send({ username: 'testuser-' + Date.now() });
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.user);
    assert.ok(res.body.user.id);
    assert.ok(res.body.user.username);
  });
});
