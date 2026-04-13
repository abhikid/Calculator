'use client'

import { useMemoryStore } from '@/store/memoryStore'
import { useCalculatorStore } from '@/store/calculatorStore'
import { cn } from '@/utils/classNames'

export function MemoryBar() {
  const { value, hasValue, mc, mr, ms, mPlus, mMinus } = useMemoryStore()
  const displayValue    = useCalculatorStore((s) => s.displayValue)
  const lastResult      = useCalculatorStore((s) => s.lastResult)
  const insertValue     = useCalculatorStore((s) => s.insertValue)

  // Use lastResult if available, otherwise try to parse displayValue
  const currentNumber = lastResult ?? parseFloat(displayValue)
  const isValidNum    = !isNaN(currentNumber) && isFinite(currentNumber)

  const handleMR = () => {
    const v = mr()
    if (v !== null) insertValue(String(v))
  }

  const btnBase = cn(
    'px-2 py-1 rounded-lg text-xs font-semibold transition-all duration-100',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]'
  )

  return (
    <div className="flex items-center gap-1.5 px-1">
      <button
        onClick={mc}
        disabled={!hasValue}
        aria-label="Memory Clear"
        className={cn(btnBase, 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] disabled:opacity-30')}
      >
        MC
      </button>
      <button
        onClick={handleMR}
        disabled={!hasValue}
        aria-label="Memory Recall"
        className={cn(btnBase, 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] disabled:opacity-30')}
      >
        MR
      </button>
      <button
        onClick={() => isValidNum && ms(currentNumber)}
        disabled={!isValidNum}
        aria-label="Memory Store"
        className={cn(btnBase, 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] disabled:opacity-30')}
      >
        MS
      </button>
      <button
        onClick={() => isValidNum && mPlus(currentNumber)}
        disabled={!isValidNum}
        aria-label="Memory Add"
        className={cn(btnBase, 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] disabled:opacity-30')}
      >
        M+
      </button>
      <button
        onClick={() => isValidNum && mMinus(currentNumber)}
        disabled={!isValidNum}
        aria-label="Memory Subtract"
        className={cn(btnBase, 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] disabled:opacity-30')}
      >
        M−
      </button>

      {/* Memory value indicator */}
      {hasValue && (
        <span
          className="ml-auto text-xs text-[var(--color-text-dim)] font-mono truncate max-w-[80px]"
          title={`Memory: ${value}`}
          aria-label={`Memory value: ${value}`}
        >
          M: {value}
        </span>
      )}
    </div>
  )
}
