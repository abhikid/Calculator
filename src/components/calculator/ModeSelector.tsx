'use client'

import { useCalculatorStore } from '@/store/calculatorStore'
import { usePreferencesStore } from '@/store/preferencesStore'
import { cn } from '@/utils/classNames'
import type { CalcMode } from '@/types/calculator'

const MODES: { id: CalcMode; label: string; shortLabel: string }[] = [
  { id: 'standard',    label: 'Standard',   shortLabel: 'Std' },
  { id: 'scientific',  label: 'Scientific', shortLabel: 'Sci' },
  { id: 'programmer',  label: 'Programmer', shortLabel: 'Prog' },
  { id: 'converter',   label: 'Converter',  shortLabel: 'Conv' },
]

export function ModeSelector() {
  const mode         = useCalculatorStore((s) => s.mode)
  const setMode      = useCalculatorStore((s) => s.setMode)
  const setLastMode  = usePreferencesStore((s) => s.setLastMode)

  const handleSelect = (m: CalcMode) => {
    setMode(m)
    setLastMode(m)
  }

  return (
    <div
      role="tablist"
      aria-label="Calculator mode"
      className="flex gap-1 p-1 rounded-2xl bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.05)]"
    >
      {MODES.map((m) => (
        <button
          key={m.id}
          role="tab"
          aria-selected={mode === m.id}
          onClick={() => handleSelect(m.id)}
          className={cn(
            'flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]',
            mode === m.id
              ? 'bg-[var(--color-bg-shell)] text-[var(--color-text-primary)] shadow-sm'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          )}
        >
          {/* Show short label on small screens, full on wider */}
          <span className="sm:hidden">{m.shortLabel}</span>
          <span className="hidden sm:inline">{m.label}</span>
        </button>
      ))}
    </div>
  )
}
