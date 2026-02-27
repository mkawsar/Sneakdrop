import { create } from 'zustand'
import type { Reservation } from '../types'
import { api } from '../api/client'

interface ReservationState {
  reservation: Reservation | null
  reserving: boolean
  purchasing: boolean
  reserve: (dropId: number, userId: number) => Promise<{ newStock: number } | { error: string }>
  purchase: (dropId: number, userId: number) => Promise<{ newStock: number } | { error: string }>
  clearReservation: () => void
  setReservation: (r: Reservation | null) => void
}

export const useReservationStore = create<ReservationState>((set, get) => ({
  reservation: null,
  reserving: false,
  purchasing: false,

  reserve: async (dropId, userId) => {
    set({ reserving: true })
    try {
      const data = await api.reserve(dropId, userId)
      set({
        reservation: data.reservation,
        reserving: false,
      })
      return { newStock: data.newStock }
    } catch (e) {
      const error = e instanceof Error ? e.message : 'Reserve failed'
      set({ reserving: false })
      return { error }
    }
  },

  purchase: async (dropId, userId) => {
    set({ purchasing: true })
    try {
      const data = await api.purchase(dropId, userId)
      set({ reservation: null, purchasing: false })
      return { newStock: data.newStock }
    } catch (e) {
      const error = e instanceof Error ? e.message : 'Purchase failed'
      set({ purchasing: false })
      return { error }
    }
  },

  clearReservation: () => set({ reservation: null }),
  setReservation: (reservation) => set({ reservation }),
}))
