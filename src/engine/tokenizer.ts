import type { EngineError } from '@/types/calculator'
import { CONSTANTS } from './constants'
import { FUNCTIONS } from './functions'

// ─── Token types ─────────────────────────────────────────────────────────────

export type TokenType =
  | 'NUMBER'
  | 'IDENTIFIER' // function or constant name
  | 'PLUS'
  | 'MINUS'
  | 'STAR'
  | 'SLASH'
  | 'PERCENT'
  | 'CARET'
  | 'LPAREN'
  | 'RPAREN'
  | 'COMMA'
  | 'EXCLAIM' // postfix factorial: n!
  | 'EOF'

export interface Token {
  type: TokenType
  value: string
  pos: number // character position for error messages
}

export class TokenizeError extends Error {
  readonly engineError: EngineError
  constructor(message: string) {
    super(message)
    this.engineError = { kind: 'TOKENIZE_ERROR', message }
  }
}

// Characters that start an identifier
const ALPHA = /[a-zA-Zπ_]/
// All valid identifier characters
const ALNUM = /[a-zA-Z0-9π_]/

/**
 * Converts an expression string into a flat array of tokens.
 * Also inserts synthetic STAR tokens for implicit multiplication:
 *   - number followed by identifier: "2pi" → 2 * pi
 *   - number followed by LPAREN: "3(4+1)" → 3 * (4+1)
 *   - RPAREN followed by LPAREN: "(2)(3)" → (2) * (3)
 *   - RPAREN followed by identifier: "(2)pi" → (2) * pi
 */
export function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  let pos = 0

  const peek = () => input[pos] ?? ''
  const advance = () => input[pos++]

  while (pos < input.length) {
    const start = pos
    const ch = peek()

    // Skip whitespace
    if (/\s/.test(ch)) {
      advance()
      continue
    }

    // Number literal (including decimal and scientific notation: 1.5e-3)
    if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(input[pos + 1] ?? ''))) {
      let num = ''
      // Integer or decimal part
      while (/[0-9]/.test(peek())) num += advance()
      if (peek() === '.') {
        num += advance()
        while (/[0-9]/.test(peek())) num += advance()
      }
      // Scientific notation suffix: e+3 / e-3 / e3
      if (peek() === 'e' || peek() === 'E') {
        const lookahead = input[pos + 1] ?? ''
        if (/[0-9+\-]/.test(lookahead)) {
          num += advance() // consume 'e'
          if (peek() === '+' || peek() === '-') num += advance()
          while (/[0-9]/.test(peek())) num += advance()
        }
      }
      tokens.push({ type: 'NUMBER', value: num, pos: start })
      continue
    }

    // Identifier (function name or constant)
    if (ALPHA.test(ch)) {
      let name = ''
      while (ALNUM.test(peek())) name += advance()
      // Validate it's a known function or constant
      if (!(name in FUNCTIONS) && !(name in CONSTANTS)) {
        throw new TokenizeError(`Unknown identifier: "${name}"`)
      }
      tokens.push({ type: 'IDENTIFIER', value: name, pos: start })
      continue
    }

    // Single-character tokens
    switch (ch) {
      case '+': advance(); tokens.push({ type: 'PLUS', value: '+', pos: start }); break
      case '-': advance(); tokens.push({ type: 'MINUS', value: '-', pos: start }); break
      case '*': advance(); tokens.push({ type: 'STAR', value: '*', pos: start }); break
      case '/': advance(); tokens.push({ type: 'SLASH', value: '/', pos: start }); break
      case '%': advance(); tokens.push({ type: 'PERCENT', value: '%', pos: start }); break
      case '^': advance(); tokens.push({ type: 'CARET', value: '^', pos: start }); break
      case '(': advance(); tokens.push({ type: 'LPAREN', value: '(', pos: start }); break
      case ')': advance(); tokens.push({ type: 'RPAREN', value: ')', pos: start }); break
      case ',': advance(); tokens.push({ type: 'COMMA', value: ',', pos: start }); break
      case '!': advance(); tokens.push({ type: 'EXCLAIM', value: '!', pos: start }); break
      // Unicode multiplication/division symbols
      case '×': advance(); tokens.push({ type: 'STAR', value: '*', pos: start }); break
      case '÷': advance(); tokens.push({ type: 'SLASH', value: '/', pos: start }); break
      default:
        throw new TokenizeError(`Unexpected character: "${ch}" at position ${pos}`)
    }
  }

  // Insert implicit multiplication tokens
  const result: Token[] = []
  for (let i = 0; i < tokens.length; i++) {
    const cur = tokens[i]
    const next = tokens[i + 1]
    result.push(cur)

    if (next && needsImplicitMul(cur, next)) {
      result.push({ type: 'STAR', value: '*', pos: cur.pos })
    }
  }

  result.push({ type: 'EOF', value: '', pos: input.length })
  return result
}

function needsImplicitMul(left: Token, right: Token): boolean {
  const leftEnds = left.type === 'NUMBER' || left.type === 'RPAREN' || left.type === 'EXCLAIM'
  const rightStarts = right.type === 'NUMBER' || right.type === 'IDENTIFIER' || right.type === 'LPAREN'
  // Don't insert * between identifier and LPAREN — that's a function call
  if (left.type === 'IDENTIFIER' && right.type === 'LPAREN') return false
  return leftEnds && rightStarts
}
