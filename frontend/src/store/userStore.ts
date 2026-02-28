import { create } from 'zustand'
import type { User } from '../types'
import { api } from '../api/client'

interface UserState {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  getOrCreateUser: (username: string) => Promise<User>
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,

  setUser: (user) => set({ user }),

  getOrCreateUser: async (username: string) => {
    set({ loading: true })
    try {
      const { user } = await api.getOrCreateUser(username.trim())
      set({ user, loading: false })
      return user
    } catch (e) {
      set({ loading: false })
      throw e
    }
  },
}))
