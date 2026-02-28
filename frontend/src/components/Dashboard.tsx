import { useEffect, useCallback } from 'react'
import { useDropStore } from '../store/dropStore'
import { useReservationStore } from '../store/reservationStore'
import { useSocketStock } from '../hooks/useSocketStock'
import { useSocketPurchase } from '../hooks/useSocketPurchase'
import { DropCard } from './DropCard'

export function Dashboard() {
  const { drops, loading, error, fetchDrops, setStock, addLatestPurchaser } = useDropStore()
  const clearReservation = useReservationStore((s) => s.clearReservation)

  useEffect(() => {
    fetchDrops()
  }, [fetchDrops])

  const onStockUpdated = useCallback(
    (e: { dropId: number; newStock: number }) => {
      setStock(e.dropId, e.newStock)
      const res = useReservationStore.getState().reservation
      if (res?.drop_id === e.dropId) clearReservation()
    },
    [setStock, clearReservation]
  )

  useSocketStock(onStockUpdated)

  const onPurchaseCompleted = useCallback(
    (e: { dropId: number; newStock: number; purchaser: { id: number; username: string } }) => {
      setStock(e.dropId, e.newStock)
      addLatestPurchaser(e.dropId, e.purchaser)
    },
    [setStock, addLatestPurchaser]
  )

  useSocketPurchase(onPurchaseCompleted)

  if (loading && drops.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-8">
        Loading drops...
      </p>
    )
  }
  if (error) {
    return (
      <p className="text-center text-red-600 dark:text-red-400 py-8">
        Error: {error}
      </p>
    )
  }
  if (drops.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-8">
        No active drops.
      </p>
    )
  }

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-black tracking-tight">
        Limited Edition Drops
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {drops.map((drop) => (
          <DropCard key={drop.id} drop={drop} />
        ))}
      </div>
    </section>
  )
}
