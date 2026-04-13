/**
 * Tree-walking evaluator: visits an AST and produces a number.
 * All math errors are thrown as EvalError instances and caught in index.ts.
 */

import type { ASTNode, AngleUnit, EngineError } from '@/types/calculator'
import { CONSTANTS } from './constants'
import { FUNCTIONS } from './functions'

export class EvalError extends Error {
  readonly engineError: EngineError
  constructor(message: string) {
    super(message)
    this.engineError = { kind: 'EVAL_ERROR', message }
  }
}

export function evaluate(node: ASTNode, angleUnit: AngleUnit): number {
  switch (node.type) {
    case 'number':
      return node.value

    case 'constant': {
      const val = CONSTANTS[node.name]
      if (val === undefined) throw new EvalError(`Unknown constant: ${node.name}`)
      return val
    }

    case 'unary': {
      const v = evaluate(node.operand, angleUnit)
      return node.op === '-' ? -v : v
    }

    case 'binary': {
      const l = evaluate(node.left, angleUnit)
      const r = evaluate(node.right, angleUnit)

      switch (node.op) {
        case '+': return l + r
        case '-': return l - r
        case '*': return l * r
        case '/':
          if (r === 0) throw new EvalError('Division by zero')
          return l / r
        case '%':
          if (r === 0) throw new EvalError('Modulo by zero')
          return l % r
        case '^': return Math.pow(l, r)
      }
      break
    }

    case 'call': {
      const fn = FUNCTIONS[node.name]
      if (!fn) throw new EvalError(`Unknown function: ${node.name}`)

      const args = node.args.map(a => evaluate(a, angleUnit))

      let result: number
      try {
        result = fn(args, angleUnit)
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        throw new EvalError(msg)
      }

      if (!isFinite(result) && !isNaN(result)) {
        // Infinity is a valid result (e.g. tan(90°)) but we surface it as an error
        throw new EvalError('Result is infinite')
      }
      if (isNaN(result)) {
        throw new EvalError('Result is not a number')
      }

      return result
    }
  }

  throw new EvalError('Unknown AST node')
}
