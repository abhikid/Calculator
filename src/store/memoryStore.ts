'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MemoryState {
  value: number
  hasValue: boolean
  // Memory Store
  ms: (value: number) => void
  // Memory Recall
  mr: () => number | null
  // Memory Clear
  mc: () => void
  // Memory Add
  mPlus: (value: number) => void
  // Memory Subtract
  mMinus: (value: number) => void
}

export const useMemoryStore = create<MemoryState>()(
  persist(
    (set, get) => ({
      value: 0,
      hasValue: false,

      ms: (value) => set({ value, hasValue: true }),
      mr: () => {
        const { hasValue, value } = get()
        return hasValue ? value : null
      },
      mc: () => set({ value: 0, hasValue: false }),
      mPlus: (value) =>
        set((s) => ({ value: s.value + value, hasValue: true })),
      mMinus: (value) =>
        set((s) => ({ value: s.value - value, hasValue: true })),
    }),
    {
      name: 'calc-memory',
    }
  )
)
