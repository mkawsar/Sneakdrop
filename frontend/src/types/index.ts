export interface User {
  id: number
  username: string
}

export interface LatestPurchaser {
  id: number
  username: string | null
}

export interface Drop {
  id: number
  name: string
  price_cents: number
  total_stock: number
  available_stock: number
  starts_at: string | null
  ends_at: string | null
  latest_purchasers?: LatestPurchaser[]
}

export interface Reservation {
  id: number
  drop_id: number
  user_id: number
  expires_at: string
  status: 'active' | 'expired' | 'completed'
}

export interface ApiDropsResponse {
  drops: Drop[]
}

export interface StockUpdatedEvent {
  dropId: number
  newStock: number
}

export interface PurchaseCompletedEvent {
  dropId: number
  newStock: number
  purchaser: User
}
