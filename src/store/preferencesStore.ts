'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AngleUnit, CalcMode } from '@/types/calculator'

interface PreferencesState {
  theme: 'light' | 'dark' | 'system'
  angleUnit: AngleUnit
  lastMode: CalcMode
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setAngleUnit: (unit: AngleUnit) => void
  setLastMode: (mode: CalcMode) => void
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: 'system',
      angleUnit: 'deg',
      lastMode: 'standard',
      setTheme: (theme) => set({ theme }),
      setAngleUnit: (angleUnit) => set({ angleUnit }),
      setLastMode: (lastMode) => set({ lastMode }),
    }),
    {
      name: 'calc-preferences',
    }
  )
)
