'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SavedFormula } from '@/types/calculator'

interface FormulasState {
  formulas: SavedFormula[]
  isLoaded: boolean
  load: () => Promise<void>
  add: (name: string, expression: string, description?: string) => Promise<void>
  remove: (id: string) => Promise<void>
}

export const useFormulasStore = create<FormulasState>()(
  persist(
    (set, get) => ({
      formulas: [],
      isLoaded: false,

      load: async () => {
        if (get().isLoaded) return
        try {
          const res = await fetch('/api/formulas')
          if (res.ok) {
            const data = await res.json()
            set({ formulas: data.formulas ?? [], isLoaded: true })
          }
        } catch {
          set({ isLoaded: true })
        }
      },

      add: async (name, expression, description) => {
        try {
          const res = await fetch('/api/formulas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, expression, description }),
          })
          if (res.ok) {
            const data = await res.json()
            set((s) => ({ formulas: [data.formula, ...s.formulas] }))
          }
        } catch {
          // Persist locally as fallback
          const local: SavedFormula = {
            id: `local-${Date.now()}`,
            name,
            expression,
            description,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          set((s) => ({ formulas: [local, ...s.formulas] }))
        }
      },

      remove: async (id) => {
        set((s) => ({ formulas: s.formulas.filter((f) => f.id !== id) }))
        await fetch(`/api/formulas/${id}`, { method: 'DELETE' }).catch(() => {})
      },
    }),
    {
      name: 'calc-formulas',
      partialize: (s) => ({ formulas: s.formulas }),
    }
  )
)
