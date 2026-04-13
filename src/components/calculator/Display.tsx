'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/utils/classNames'
import { useCalculatorStore } from '@/store/calculatorStore'

export function Display() {
  const expression   = useCalculatorStore((s) => s.expression)
  const displayValue = useCalculatorStore((s) => s.displayValue)
  const previewValue = useCalculatorStore((s) => s.previewValue)
  const isResultFinal = useCalculatorStore((s) => s.isResultFinal)

  const exprRef = useRef<HTMLDivElement>(null)
  // Key to trigger re-animation when result changes
  const [animKey, setAnimKey] = useState(0)

  // Auto-scroll expression to the right
  useEffect(() => {
    if (exprRef.current) {
      exprRef.current.scrollLeft = exprRef.current.scrollWidth
    }
  }, [expression])

  // Trigger pop animation on each new final result
  useEffect(() => {
    if (isResultFinal) {
      setAnimKey((k) => k + 1)
    }
  }, [isResultFinal, displayValue])

  // Dynamically scale font size for long results
  const resultLen = displayValue.length
  const resultFontClass =
    resultLen > 14 ? 'text-3xl'
    : resultLen > 10 ? 'text-4xl'
    : resultLen > 7  ? 'text-5xl'
    : 'text-6xl'

  return (
    <div
      className={cn(
        'glass rounded-3xl px-5 py-4 flex flex-col gap-1',
        'min-h-[120px] select-none'
      )}
    >
      {/* Expression line */}
      <div
        ref={exprRef}
        className="expression-scroll text-right"
        aria-label="Current expression"
      >
        <span
          className={cn(
            'font-mono text-base transition-opacity duration-150',
            expression
              ? 'text-[var(--color-text-secondary)]'
              : 'text-[var(--color-text-dim)] opacity-40'
          )}
        >
          {expression || '0'}
        </span>
      </div>

      {/* Preview (live result while typing) */}
      {previewValue && !isResultFinal && (
        <div className="text-right">
          <span className="text-[var(--color-text-dim)] text-sm font-mono animate-fade-in">
            = {previewValue}
          </span>
        </div>
      )}

      {/* Main result */}
      <div
        className="text-right mt-auto overflow-hidden"
        aria-label="Result"
        aria-live="polite"
        aria-atomic="true"
      >
        <span
          key={animKey}
          className={cn(
            'font-semibold tracking-tight',
            'text-[var(--color-text-primary)]',
            'inline-block',
            resultFontClass,
            isResultFinal && 'animate-num-pop',
          )}
        >
          {displayValue}
        </span>
      </div>
    </div>
  )
}
