'use client'

import { Button } from '@/components/ui/Button'
import { useCalculatorStore } from '@/store/calculatorStore'
import { useMemoryStore } from '@/store/memoryStore'
import { useHistoryStore } from '@/store/historyStore'
import { Divide, X, Minus, Plus, Delete, Percent } from 'lucide-react'

export function StandardKeypad() {
  const appendToken   = useCalculatorStore((s) => s.appendToken)
  const evaluate      = useCalculatorStore((s) => s.evaluate)
  const clear         = useCalculatorStore((s) => s.clear)
  const backspace     = useCalculatorStore((s) => s.backspace)
  const toggleSign    = useCalculatorStore((s) => s.toggleSign)
  const applyPercent  = useCalculatorStore((s) => s.applyPercent)
  const mode          = useCalculatorStore((s) => s.mode)
  const angleUnit     = useCalculatorStore((s) => s.angleUnit)
  const addHistory    = useHistoryStore((s) => s.addEntry)

  const handleEquals = () => {
    const res = evaluate()
    if (res) {
      addHistory({
        expression: res.expression,
        result: res.result,
        mode,
        angleUnit,
      })
    }
  }

  const D = (v: string) => () => appendToken(v)

  return (
    <div className="grid grid-cols-4 gap-2.5">
      {/* Row 1 */}
      <Button variant="clear"    onClick={clear}        label="All Clear">AC</Button>
      <Button variant="function" onClick={toggleSign}   label="Toggle sign">+/−</Button>
      <Button variant="function" onClick={applyPercent} label="Percent"><Percent size={18} /></Button>
      <Button variant="operator" onClick={D('/')}        label="Divide"><Divide size={20} /></Button>

      {/* Row 2 */}
      <Button variant="digit" onClick={D('7')}>7</Button>
      <Button variant="digit" onClick={D('8')}>8</Button>
      <Button variant="digit" onClick={D('9')}>9</Button>
      <Button variant="operator" onClick={D('*')} label="Multiply"><X size={20} /></Button>

      {/* Row 3 */}
      <Button variant="digit" onClick={D('4')}>4</Button>
      <Button variant="digit" onClick={D('5')}>5</Button>
      <Button variant="digit" onClick={D('6')}>6</Button>
      <Button variant="operator" onClick={D('-')} label="Subtract"><Minus size={20} /></Button>

      {/* Row 4 */}
      <Button variant="digit" onClick={D('1')}>1</Button>
      <Button variant="digit" onClick={D('2')}>2</Button>
      <Button variant="digit" onClick={D('3')}>3</Button>
      <Button variant="operator" onClick={D('+')} label="Add"><Plus size={20} /></Button>

      {/* Row 5 */}
      <Button variant="digit" wide onClick={D('0')} label="Zero">0</Button>
      <Button variant="digit"      onClick={D('.')} label="Decimal point">.</Button>
      <Button variant="equals"     onClick={handleEquals} label="Equals">=</Button>
    </div>
  )
}
