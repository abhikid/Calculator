'use client'

import { Button } from '@/components/ui/Button'
import { useCalculatorStore } from '@/store/calculatorStore'
import { useHistoryStore } from '@/store/historyStore'
import { cn } from '@/utils/classNames'
import type { ProgrammerBase } from '@/types/calculator'

// Convert a decimal number to the display string for a given base
function toBase(n: number, base: ProgrammerBase): string {
  if (!isFinite(n) || isNaN(n)) return 'Error'
  const int = Math.trunc(n)
  const prefix = base === 2 ? '0b' : base === 8 ? '0o' : base === 16 ? '0x' : ''
  return prefix + Math.abs(int).toString(base).toUpperCase() + (int < 0 ? ' (neg)' : '')
}

const BASE_LABELS: Record<ProgrammerBase, string> = {
  2: 'BIN',
  8: 'OCT',
  10: 'DEC',
  16: 'HEX',
}

export function ProgrammerKeypad() {
  const appendToken      = useCalculatorStore((s) => s.appendToken)
  const evaluate         = useCalculatorStore((s) => s.evaluate)
  const lastResult       = useCalculatorStore((s) => s.lastResult)
  const displayValue     = useCalculatorStore((s) => s.displayValue)
  const programmerBase   = useCalculatorStore((s) => s.programmerBase)
  const setProgrammerBase = useCalculatorStore((s) => s.setProgrammerBase)
  const mode             = useCalculatorStore((s) => s.mode)
  const angleUnit        = useCalculatorStore((s) => s.angleUnit)
  const addHistory       = useHistoryStore((s) => s.addEntry)

  const currentVal = lastResult ?? parseFloat(displayValue)
  const hasVal     = !isNaN(currentVal) && isFinite(currentVal)

  const tk = (t: string) => () => appendToken(t)

  const handleEquals = () => {
    const res = evaluate()
    if (res) addHistory({ expression: res.expression, result: res.result, mode, angleUnit })
  }

  // Hex digit buttons — disabled in non-hex modes
  const hexDigits = ['A', 'B', 'C', 'D', 'E', 'F']
  const hexDisabled = programmerBase !== 16

  return (
    <div className="flex flex-col gap-3">
      {/* Base selector */}
      <div className="flex gap-2">
        {([2, 8, 10, 16] as ProgrammerBase[]).map((base) => (
          <button
            key={base}
            onClick={() => setProgrammerBase(base)}
            aria-pressed={programmerBase === base}
            className={cn(
              'flex-1 py-1.5 rounded-xl text-xs font-bold transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]',
              programmerBase === base
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-[var(--color-btn-fn)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            )}
          >
            {BASE_LABELS[base]}
          </button>
        ))}
      </div>

      {/* Base representations of current value */}
      {hasVal && (
        <div className="glass rounded-2xl px-4 py-2 grid grid-cols-2 gap-x-4 gap-y-1">
          {([2, 8, 10, 16] as ProgrammerBase[]).map((base) => (
            <div key={base} className="flex items-center gap-2">
              <span className="text-[var(--color-text-dim)] text-[10px] font-bold w-6">{BASE_LABELS[base]}</span>
              <span className="text-[var(--color-text-secondary)] text-xs font-mono truncate">
                {toBase(currentVal, base)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Hex digit row */}
      <div className="grid grid-cols-6 gap-2">
        {hexDigits.map((d) => (
          <Button
            key={d}
            variant="function"
            disabled={hexDisabled}
            onClick={tk(d)}
            label={`Hex digit ${d}`}
          >
            {d}
          </Button>
        ))}
      </div>

      {/* Bitwise operations */}
      <div className="grid grid-cols-4 gap-2">
        <Button variant="function" onClick={tk(' AND ')}  label="Bitwise AND">AND</Button>
        <Button variant="function" onClick={tk(' OR ')}   label="Bitwise OR">OR</Button>
        <Button variant="function" onClick={tk(' XOR ')}  label="Bitwise XOR">XOR</Button>
        <Button variant="function" onClick={tk(' NOT ')}  label="Bitwise NOT">NOT</Button>
        <Button variant="function" onClick={tk('<<')}     label="Left shift">&lt;&lt;</Button>
        <Button variant="function" onClick={tk('>>')}     label="Right shift">&gt;&gt;</Button>
        <Button variant="function" onClick={tk('(')}      label="Open paren">(</Button>
        <Button variant="function" onClick={tk(')')}      label="Close paren">)</Button>
      </div>
    </div>
  )
}
