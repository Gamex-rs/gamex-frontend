import { create } from 'zustand'
import type { User } from '@/types/auth'

interface AuthState {
  user: User | null
  accessToken: string | null
  platformIds: string[]
  setAuth: (user: User, accessToken: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  platformIds: [],
  setAuth: (user, accessToken) =>
    set({ user, accessToken, platformIds: user.platformIds }),
  clearAuth: () => set({ user: null, accessToken: null, platformIds: [] }),
}))
