import { useEffect, useRef } from 'react'
import { useReservationStore } from '../store/reservationStore'

/** Clears reservation in store when expires_at has passed (client-side UX). */
export function useReservationExpiry() {
  const reservation = useReservationStore((s) => s.reservation)
  const clearReservation = useReservationStore((s) => s.clearReservation)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!reservation?.expires_at) {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      return
    }
    const expiresAt = new Date(reservation.expires_at).getTime()
    const now = Date.now()
    const ms = Math.max(0, expiresAt - now)
    timerRef.current = setTimeout(() => {
      clearReservation()
      timerRef.current = null
    }, ms)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [reservation?.id, reservation?.expires_at, clearReservation])
}
