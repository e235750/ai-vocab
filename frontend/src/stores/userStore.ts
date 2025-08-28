import { create } from 'zustand'
import { UserProfile } from '@/types'

interface UserStoreState {
  profile: UserProfile | null
  setProfile: (profile: UserProfile | null) => void
}

export const useUserStore = create<UserStoreState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
}))
