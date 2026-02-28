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
    <article className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex justify-between items-start gap-2 mb-3">
        <h3 className="m-0 text-base font-semibold text-gray-900 dark:text-gray-100">
          {drop.name}
        </h3>
        <span className="font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
          {formatPrice(drop.price_cents)}
        </span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">Stock</span>
        <span
          className="font-bold text-lg min-w-[2ch] text-gray-900 dark:text-gray-100"
          data-drop-id={drop.id}
        >
          {drop.available_stock}
        </span>
      </div>
      <div className="mb-3 text-sm text-gray-600 dark:text-gray-300">
        <span className="text-gray-500 dark:text-gray-400">Recent purchasers:</span>
        {latest.length > 0 ? (
          <ul className="mt-1 pl-5 list-disc">
            {latest.map((p) => (
              <li key={`${drop.id}-${p.id}`}>{p.username ?? '—'}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 m-0 text-gray-400 dark:text-gray-500">No purchases yet.</p>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        {canReserve && (
          <button
            type="button"
            onClick={handleReserve}
            disabled={reserving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium cursor-pointer hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            {reserving ? 'Reserving...' : 'Reserve'}
          </button>
        )}
        {canPurchase && (
          <button
            type="button"
            onClick={handlePurchase}
            disabled={purchasing}
            className="px-4 py-2 bg-emerald-700 text-white rounded-md text-sm font-medium cursor-pointer hover:bg-emerald-800 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            {purchasing ? 'Processing...' : 'Complete Purchase'}
          </button>
        )}
        {!user && (
          <p className="m-0 text-sm text-gray-500 dark:text-gray-400">
            Sign in to reserve or purchase.
          </p>
        )}
      </div>
    </article>
  )
}
