import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserStats {
  income?: number
  expenses?: number
  savings?: number
  invested?: number
  debt?: number
}

interface StatsStore {
  hasUploadedStats: boolean
  stats: UserStats | null
  setStatsUploaded: (stats: UserStats) => void
  resetStats: () => void
}

export const useStatsStore = create<StatsStore>()(
  persist(
    (set) => ({
      hasUploadedStats: false,
      stats: null,
      setStatsUploaded: (stats) => 
        set({ hasUploadedStats: true, stats }),
      resetStats: () => 
        set({ hasUploadedStats: false, stats: null }),
    }),
    {
      name: 'invested-stats-storage',
    }
  )
)
