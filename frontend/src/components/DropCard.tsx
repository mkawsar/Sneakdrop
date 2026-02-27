import type { Drop } from '../types'
import { useUserStore } from '../store/userStore'
import { useReservationStore } from '../store/reservationStore'
import { useDropStore } from '../store/dropStore'
import { useCallback } from 'react'
import toast from 'react-hot-toast'

interface DropCardProps {
  drop: Drop
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

export function DropCard({ drop }: DropCardProps) {
  const user = useUserStore((s) => s.user)
  const reservation = useReservationStore((s) => s.reservation)
  const reserve = useReservationStore((s) => s.reserve)
  const purchase = useReservationStore((s) => s.purchase)
  const reserving = useReservationStore((s) => s.reserving)
  const purchasing = useReservationStore((s) => s.purchasing)
  const setStock = useDropStore((s) => s.setStock)

  const isReservedForThis = reservation?.drop_id === drop.id
  const canReserve = user && drop.available_stock > 0 && !isReservedForThis
  const canPurchase = user && isReservedForThis

  const handleReserve = useCallback(async () => {
    if (!user) return
    const result = await reserve(drop.id, user.id)
    if ('error' in result) {
      toast.error(result.error)
    } else {
      setStock(drop.id, result.newStock)
      toast.success('Reserved! Complete purchase within 60 seconds.')
    }
  }, [user, drop.id, reserve, setStock])

  const handlePurchase = useCallback(async () => {
    if (!user) return
    const result = await purchase(drop.id, user.id)
    if ('error' in result) {
      toast.error(result.error)
    } else {
      setStock(drop.id, result.newStock)
      toast.success('Purchase complete!')
    }
  }, [user, drop.id, purchase, setStock])

  const latest = drop.latest_purchasers ?? []

  return (
    <article className="drop-card">
      <div className="drop-card-header">
        <h3>{drop.name}</h3>
        <span className="price">{formatPrice(drop.price_cents)}</span>
      </div>
      <div className="stock-row">
        <span className="label">Stock</span>
        <span className="stock-count" data-drop-id={drop.id}>
          {drop.available_stock}
        </span>
      </div>
      {latest.length > 0 && (
        <div className="latest-purchasers">
          <span className="label">Recent purchasers:</span>
          <ul>
            {latest.map((p) => (
              <li key={`${drop.id}-${p.id}`}>{p.username ?? '—'}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="actions">
        {canReserve && (
          <button
            type="button"
            onClick={handleReserve}
            disabled={reserving}
            className="btn-reserve"
          >
            {reserving ? 'Reserving...' : 'Reserve'}
          </button>
        )}
        {canPurchase && (
          <button
            type="button"
            onClick={handlePurchase}
            disabled={purchasing}
            className="btn-purchase"
          >
            {purchasing ? 'Processing...' : 'Complete Purchase'}
          </button>
        )}
        {!user && (
          <p className="hint">Sign in to reserve or purchase.</p>
        )}
      </div>
    </article>
  )
}
