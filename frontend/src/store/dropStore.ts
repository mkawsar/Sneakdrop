import { create } from 'zustand'
import type { Drop, LatestPurchaser } from '../types'
import { api } from '../api/client'

interface DropState {
  drops: Drop[]
  loading: boolean
  error: string | null
  fetchDrops: () => Promise<void>
  setStock: (dropId: number, newStock: number) => void
  addLatestPurchaser: (dropId: number, purchaser: { id: number; username: string }) => void
}

export const useDropStore = create<DropState>((set, get) => ({
  drops: [],
  loading: false,
  error: null,

  fetchDrops: async () => {
    set({ loading: true, error: null })
    try {
      const { drops } = await api.getDrops()
      set({ drops, loading: false })
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : 'Failed to load drops',
        loading: false,
      })
    }
  },

  setStock: (dropId, newStock) => {
    set((s) => ({
      drops: s.drops.map((d) =>
        d.id === dropId ? { ...d, available_stock: newStock } : d
      ),
    }))
  },

  addLatestPurchaser: (dropId, purchaser) => {
    set((s) => ({
      drops: s.drops.map((d) => {
        if (d.id !== dropId) return d
        const list: LatestPurchaser[] = [
          { id: purchaser.id, username: purchaser.username },
          ...(d.latest_purchasers ?? []).slice(0, 2),
        ]
        return { ...d, latest_purchasers: list, available_stock: d.available_stock }
      }),
    }))
  },
}))
