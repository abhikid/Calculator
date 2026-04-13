'use client'

import { useCalculatorStore } from '@/store/calculatorStore'
import { cn } from '@/utils/classNames'

export function AngleToggle() {
  const angleUnit     = useCalculatorStore((s) => s.angleUnit)
  const toggleAngle   = useCalculatorStore((s) => s.toggleAngleUnit)

  return (
    <button
      onClick={toggleAngle}
      aria-label={`Angle unit: ${angleUnit}. Click to switch.`}
      aria-pressed={angleUnit === 'rad'}
      className={cn(
        'flex items-center gap-0.5 px-1 py-0.5 rounded-lg text-xs font-mono font-semibold',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]',
        angleUnit === 'deg'
          ? 'text-[var(--color-accent)] bg-[rgba(249,115,22,0.12)]'
          : 'text-[var(--color-text-secondary)] bg-[var(--color-border)]'
      )}
    >
      <span className={angleUnit === 'deg' ? 'opacity-100' : 'opacity-40'}>DEG</span>
      <span className="opacity-30 mx-0.5">/</span>
      <span className={angleUnit === 'rad' ? 'opacity-100' : 'opacity-40'}>RAD</span>
    </button>
  )
}
