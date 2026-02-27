-- Optional: run this only if you prefer manual schema over Sequelize sync.
-- Otherwise use: npm run db:migrate (runs Sequelize sync).

CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(255) NOT NULL UNIQUE,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "drops" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "price_cents" INTEGER NOT NULL,
  "total_stock" INTEGER NOT NULL,
  "available_stock" INTEGER NOT NULL,
  "starts_at" TIMESTAMP WITH TIME ZONE,
  "ends_at" TIMESTAMP WITH TIME ZONE,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "reservations" (
  "id" SERIAL PRIMARY KEY,
  "drop_id" INTEGER NOT NULL REFERENCES "drops"("id"),
  "user_id" INTEGER NOT NULL REFERENCES "users"("id"),
  "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
  "status" VARCHAR(20) NOT NULL DEFAULT 'active',
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "purchases" (
  "id" SERIAL PRIMARY KEY,
  "drop_id" INTEGER NOT NULL REFERENCES "drops"("id"),
  "user_id" INTEGER NOT NULL REFERENCES "users"("id"),
  "reservation_id" INTEGER NOT NULL REFERENCES "reservations"("id"),
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reservations_drop_id ON reservations(drop_id);
CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_expires_at ON reservations(expires_at);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_purchases_drop_id_created_at ON purchases(drop_id, created_at DESC);
