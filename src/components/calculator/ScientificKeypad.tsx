'use client'

import { Button } from '@/components/ui/Button'
import { useCalculatorStore } from '@/store/calculatorStore'
import { useHistoryStore } from '@/store/historyStore'

export function ScientificKeypad() {
  const appendToken = useCalculatorStore((s) => s.appendToken)
  const evaluate    = useCalculatorStore((s) => s.evaluate)
  const mode        = useCalculatorStore((s) => s.mode)
  const angleUnit   = useCalculatorStore((s) => s.angleUnit)
  const addHistory  = useHistoryStore((s) => s.addEntry)

  const fn  = (name: string) => () => appendToken(`${name}(`)
  const cst = (name: string) => () => appendToken(name)
  const tk  = (t: string)    => () => appendToken(t)

  const handleEquals = () => {
    const res = evaluate()
    if (res) addHistory({ expression: res.expression, result: res.result, mode, angleUnit })
  }

  return (
    // Scrollable container — shows ~3 rows, user scrolls for more
    // This keeps the total calculator height manageable
    <div
      className="overflow-y-auto"
      style={{ maxHeight: '200px' }}
      aria-label="Scientific functions"
    >
      <div className="grid grid-cols-4 gap-2 pb-1">
        {/* Trig */}
        <Button variant="function" onClick={fn('sin')}   label="sine">sin</Button>
        <Button variant="function" onClick={fn('cos')}   label="cosine">cos</Button>
        <Button variant="function" onClick={fn('tan')}   label="tangent">tan</Button>
        <Button variant="function" onClick={tk('(')}     label="Open paren">(</Button>

        <Button variant="function" onClick={fn('asin')}  label="arc sine">sin⁻¹</Button>
        <Button variant="function" onClick={fn('acos')}  label="arc cosine">cos⁻¹</Button>
        <Button variant="function" onClick={fn('atan')}  label="arc tangent">tan⁻¹</Button>
        <Button variant="function" onClick={tk(')')}     label="Close paren">)</Button>

        {/* Hyperbolic */}
        <Button variant="function" onClick={fn('sinh')}  label="hyperbolic sine">sinh</Button>
        <Button variant="function" onClick={fn('cosh')}  label="hyperbolic cosine">cosh</Button>
        <Button variant="function" onClick={fn('tanh')}  label="hyperbolic tangent">tanh</Button>
        <Button variant="function" onClick={tk('^')}     label="Power">xʸ</Button>

        {/* Logs & exp */}
        <Button variant="function" onClick={fn('log')}   label="log base 10">log</Button>
        <Button variant="function" onClick={fn('ln')}    label="natural log">ln</Button>
        <Button variant="function" onClick={fn('exp')}   label="e to the x">eˣ</Button>
        <Button variant="function" onClick={fn('pow10')} label="10 to the x">10ˣ</Button>

        {/* Roots & powers */}
        <Button variant="function" onClick={fn('sqrt')}  label="Square root">√</Button>
        <Button variant="function" onClick={fn('cbrt')}  label="Cube root">∛</Button>
        <Button variant="function" onClick={fn('nrt')}   label="nth root">ⁿ√</Button>
        <Button variant="function" onClick={() => appendToken('^2')} label="Square">x²</Button>

        {/* Misc */}
        <Button variant="function" onClick={cst('pi')}   label="Pi">π</Button>
        <Button variant="function" onClick={cst('e')}    label="Euler number">e</Button>
        <Button variant="function" onClick={fn('abs')}   label="Absolute value">|x|</Button>
        <Button variant="function" onClick={fn('fact')}  label="Factorial">n!</Button>

        <Button variant="function" onClick={fn('rand')}  label="Random number">RND</Button>
        <Button variant="function" onClick={fn('inv')}   label="Reciprocal">1/x</Button>
        <Button variant="function" onClick={fn('asinh')} label="inverse hyperbolic sine">sinh⁻¹</Button>
        <Button variant="function" onClick={fn('acosh')} label="inverse hyperbolic cosine">cosh⁻¹</Button>
      </div>
    </div>
  )
}
