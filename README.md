# `Sneakdrop` — Limited Edition Sneaker Drop

Real-time high-traffic inventory system: reserve items for 60 seconds, then complete purchase. Stock updates sync across all clients via WebSockets. No overselling under concurrent requests.

## Stack

- **Frontend:** React, TypeScript, Vite, Zustand, Socket.io-client, Tailwind-style CSS vars, react-hot-toast
- **Backend:** Node.js, Express, Sequelize, PostgreSQL, Socket.io
- **Real-time:** Socket.io (WebSockets)

## Live demo

- **Frontend:** [https://sneakdrop.vercel.app/](https://sneakdrop.vercel.app/)
- **Backend API:** [https://sneakdrop.onrender.com/](https://sneakdrop.onrender.com/)

> **Note:** The backend is deployed on Render’s Free plan, which implements automatic service suspension after inactivity. Initial requests may experience cold-start latency (~15–30 seconds). If the API appears unavailable, open the backend URL once to trigger service wake-up, then reload the frontend.

## Quick start

### 1. Database

Create a PostgreSQL database and set its URL:

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env: set DATABASE_URL=postgres://user:password@localhost:5432/sneakdrop
```

Optional: apply schema manually (otherwise Sequelize sync will create tables):

```bash
psql $DATABASE_URL -f backend/src/db/schema.sql
```

### 2. Backend

```bash
cd backend
npm install
npm run db:migrate   # Sequelize sync (creates tables)
npm run db:seed      # Optional: sample users + drops
npm run dev          # http://localhost:3001
```

**Default usernames** (after `db:seed`): `alice`, `bob`, `charlie`. You can sign in with any of these or enter a new username (users are created on first use).

### 3. Frontend

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173 (proxies /api and /socket.io to backend)
```

Open http://localhost:5173, enter a username, then reserve and purchase from the dashboard.

### 4. Tests

**Backend** (requires PostgreSQL; use a test DB):

```bash
cd backend
npm install
DATABASE_URL=postgres://user:password@localhost:5432/sneakdrop_test npm run db:migrate
DATABASE_URL=postgres://user:password@localhost:5432/sneakdrop_test npm test
```

**Frontend:**

```bash
cd frontend
npm install
npm test
```

**CI:** GitHub Actions runs both test suites on push/PR to `main` or `master` (see `.github/workflows/test.yml`). Backend tests use a PostgreSQL service container.

### 5. Deployment (Vercel + Render)

- **Backend (Render):** Deploy the `backend` folder, set `DATABASE_URL` and other env vars in Render. Your API will be at e.g. `https://your-app.onrender.com`. Optional: set **`CORS_ORIGIN`** to your Vercel URL (e.g. `https://your-app.vercel.app`) for stricter Socket.io CORS; if unset, all origins are allowed.
- **Frontend (Vercel):** Deploy the `frontend` folder. In Vercel → Project → Settings → Environment Variables, add:
  - **`VITE_API_URL`** = your Render backend URL (e.g. `https://your-app.onrender.com`) — **no trailing slash** (required for API and Socket.io).
- Without `VITE_API_URL`, the frontend calls `/api` on the Vercel domain and gets 404. With it set, API and Socket.io connect to the Render backend. The client uses polling then WebSocket and will reconnect if the backend was sleeping (Render free tier).

---

## Architecture

### 60-second reservation expiry

- **Server:** A recurring job runs every 5s (configurable via `RESERVATION_EXPIRY_JOB_INTERVAL_MS`). It finds reservations with `status = 'active'` and `expires_at <= now`, sets them to `expired`, increments `available_stock` on the drop, then emits `stockUpdated` to all clients via Socket.io.
- **Client:** On reserve, the UI stores the reservation and a timer clears it at `expires_at`. When the client receives `stockUpdated` for the same drop it has reserved, it clears the reservation so the “Complete Purchase” button disappears if the server expired it first.

### Concurrency (no overselling)

- **Atomic reserve:** Reserve is implemented in a single database transaction with row locking:
  1. Start transaction (READ COMMITTED).
  2. `SELECT` the drop row with `FOR UPDATE` (Sequelize `lock: true`), so only one transaction can hold the lock per drop.
  3. If `available_stock < 1`, rollback and return “Insufficient stock”.
  4. Insert a new reservation, decrement `available_stock` by 1, commit.
- So if many users try to reserve the last unit at the same time, only one transaction commits; the others see 0 stock or fail and get a 409 with a clear error.

### Real-time stock

- After any reserve or purchase, the backend emits `stockUpdated` with `{ dropId, newStock }`.
- The expiry job does the same when it releases expired reservations.
- The frontend subscribes to `stockUpdated` and updates the Zustand store so all tabs and clients see the new count immediately.

### No N+1 on drops + latest purchasers

- **Drops list:** One query loads all active drops (by stock and optional `starts_at` / `ends_at`).
- **Latest 3 purchasers per drop:** A second query loads all purchases for those drop IDs, with `User` included, ordered by `drop_id` and `created_at DESC`. The service then groups by `drop_id` and keeps the first 3 per drop in memory. So we never do one query per drop (no N+1).

---

## API (no admin UI)

### Create a drop (Merch Drop)

```http
POST /api/drops
Content-Type: application/json

{
  "name": "Air Jordan 1 - 100 units",
  "priceCents": 19900,
  "totalStock": 100,
  "startsAt": "2025-03-01T00:00:00Z",  // optional
  "endsAt": null                          // optional
}
```

- **Data structure:** `drops` table: `name`, `price_cents`, `total_stock`, `available_stock`, `starts_at`, `ends_at`. New drops start with `available_stock = total_stock`.
- **Timestamps:** `starts_at` / `ends_at` define the active window; list endpoint only returns drops where `(starts_at IS NULL OR starts_at <= now)` and `(ends_at IS NULL OR ends_at >= now)` and `available_stock > 0`.

### Other endpoints

- `GET /api/drops` — Active drops with nested `latest_purchasers` (top 3 per drop).
- `POST /api/users/get-or-create` — Body: `{ "username": "alice" }`. Returns or creates user.
- `POST /api/drops/:dropId/reserve` — Body: `{ "userId": 1 }`. Atomic reserve; 409 if no stock.
- `POST /api/drops/:dropId/purchase` — Body: `{ "userId": 1 }`. Completes purchase for current reservation; 409 if none or expired.

---

## Project layout

```
sneakdrop/
├── backend/
│   ├── src/
│   │   ├── config/         # env and app config
│   │   ├── db/             # Sequelize instance, migrate, seed, schema.sql
│   │   ├── models/         # User, Drop, Reservation, Purchase
│   │   ├── services/       # dropService, reservationService, purchaseService
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/     # error handler
│   │   ├── jobs/           # reservation expiry job
│   │   ├── socket/         # Socket.io attach + emitStockUpdate / emitPurchase
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
├── frontend/
│   └── src/
│       ├── api/            # REST client
│       ├── lib/            # socket.io client
│       ├── store/           # Zustand: drops, user, reservation
│       ├── hooks/           # useSocketStock, useSocketPurchase, useReservationExpiry
│       ├── components/     # UsernamePrompt, Dashboard, DropCard
│       ├── types/
│       ├── App.tsx
│       └── main.tsx
└── README.md
```

---

## Environment (backend)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | Server port (default 3001) |
| `RESERVATION_TTL_SECONDS` | Reservation lifetime (default 60) |
| `RESERVATION_EXPIRY_JOB_INTERVAL_MS` | How often to release expired reservations (default 5000) |
