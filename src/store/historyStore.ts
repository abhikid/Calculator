'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { HistoryEntry, CalcMode, AngleUnit } from '@/types/calculator'

interface HistoryState {
  entries: HistoryEntry[]
  addEntry: (entry: Omit<HistoryEntry, 'id' | 'createdAt'>) => void
  removeEntry: (id: string) => void
  clearAll: () => void
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (entry) => {
        const newEntry: HistoryEntry = {
          ...entry,
          id: generateId(),
          createdAt: new Date().toISOString(),
        }

        set((s) => ({
          // Prepend and keep the most recent 200 entries
          entries: [newEntry, ...s.entries].slice(0, 200),
        }))

        // Fire-and-forget sync to backend
        void fetch('/api/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            expression: entry.expression,
            result: entry.result,
            mode: entry.mode,
            angleUnit: entry.angleUnit,
          }),
        }).catch(() => {
          // Backend sync failure is non-fatal — local state is the source of truth
        })
      },

      removeEntry: (id) => {
        set((s) => ({ entries: s.entries.filter((e) => e.id !== id) }))
        void fetch(`/api/history/${id}`, { method: 'DELETE' }).catch(() => {})
      },

      clearAll: () => {
        set({ entries: [] })
        void fetch('/api/history', { method: 'DELETE' }).catch(() => {})
      },
    }),
    {
      name: 'calc-history',
      // Only persist the entries array, not the action functions
      partialize: (state) => ({ entries: state.entries }),
    }
  )
)
