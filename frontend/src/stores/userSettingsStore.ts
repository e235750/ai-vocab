import { create } from 'zustand'
import { UserSettings } from '@/types'

interface UserSettingsState {
  settings: UserSettings | null
  setSettings: (settings: UserSettings | null) => void
}

export const useUserSettingsStore = create<UserSettingsState>((set) => ({
  settings: null,
  setSettings: (settings) => set({ settings }),
}))
