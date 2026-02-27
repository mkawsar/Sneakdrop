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

  if (loading && drops.length === 0) return <p className="loading">Loading drops...</p>
  if (error) return <p className="error">Error: {error}</p>
  if (drops.length === 0) return <p className="empty">No active drops.</p>

  return (
    <section className="dashboard">
      <h1>Limited Edition Drops</h1>
      <div className="drop-grid">
        {drops.map((drop) => (
          <DropCard key={drop.id} drop={drop} />
        ))}
      </div>
    </section>
  )
}
