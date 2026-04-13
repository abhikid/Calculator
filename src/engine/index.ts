/**
 * Public API for the expression engine.
 * Components should import only from here — never from tokenizer/parser/evaluator directly.
 */

import type { CalcResult, EngineConfig } from '@/types/calculator'
import { tokenize, TokenizeError } from './tokenizer'
import { parse, ParseError } from './parser'
import { evaluate, EvalError } from './evaluator'

export { FUNCTIONS } from './functions'
export { CONSTANTS } from './constants'

const MAX_DISPLAY_DIGITS = 15

/**
 * Formats a number for display:
 * - Switches to scientific notation for very large/small values
 * - Strips trailing zeros after the decimal point
 * - Preserves up to MAX_DISPLAY_DIGITS significant figures
 */
export function formatNumber(value: number): string {
  if (!isFinite(value)) return value > 0 ? '∞' : '-∞'
  if (isNaN(value)) return 'NaN'

  const abs = Math.abs(value)

  // Use scientific notation for extreme values
  if ((abs !== 0 && abs < 1e-9) || abs >= 1e15) {
    return value.toExponential(6).replace(/\.?0+e/, 'e')
  }

  // Avoid floating point display artifacts
  const s = parseFloat(value.toPrecision(MAX_DISPLAY_DIGITS)).toString()
  return s
}

/**
 * Safe expression evaluation.
 * Never throws — all errors are returned in the result object.
 *
 * @param expression - The raw expression string from the user
 * @param config - Engine configuration (angle unit, etc.)
 * @returns CalcResult with value, display string, and optional error
 */
export function calculate(
  expression: string,
  config: EngineConfig = { angleUnit: 'deg' }
): CalcResult {
  const trimmed = expression.trim()

  if (!trimmed) {
    return { value: null, display: '' }
  }

  try {
    const tokens = tokenize(trimmed)
    const ast = parse(tokens)
    const value = evaluate(ast, config.angleUnit)
    return { value, display: formatNumber(value) }
  } catch (err) {
    if (
      err instanceof TokenizeError ||
      err instanceof ParseError ||
      err instanceof EvalError
    ) {
      return { value: null, display: 'Error', error: err.engineError }
    }
    // Unexpected error — surface a generic message
    return {
      value: null,
      display: 'Error',
      error: { kind: 'EVAL_ERROR', message: 'Unexpected error' },
    }
  }
}

/**
 * Returns true if the expression is a valid, complete expression
 * that can be evaluated to a result.
 */
export function isValidExpression(expression: string, config?: EngineConfig): boolean {
  const r = calculate(expression, config)
  return r.value !== null
}
