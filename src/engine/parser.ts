/**
 * Recursive descent parser.
 * Converts a Token[] into an AST using this grammar:
 *
 *   expression  := term (('+' | '-') term)*
 *   term        := power (('*' | '/' | '%') power)*
 *   power       := postfix ('^' unary)*      — right-associative
 *   postfix     := unary ('!')*
 *   unary       := ('-' | '+') unary | primary
 *   primary     := NUMBER
 *               | IDENTIFIER '(' arglist ')'  — function call
 *               | IDENTIFIER                  — constant
 *               | '(' expression ')'
 *   arglist     := expression (',' expression)*
 */

import type { ASTNode, EngineError } from '@/types/calculator'
import { FUNCTIONS, getArgCount } from './functions'
import { CONSTANTS } from './constants'
import { type Token } from './tokenizer'

export class ParseError extends Error {
  readonly engineError: EngineError
  constructor(message: string) {
    super(message)
    this.engineError = { kind: 'PARSE_ERROR', message }
  }
}

export function parse(tokens: Token[]): ASTNode {
  let pos = 0

  const peek = (): Token => tokens[pos] ?? { type: 'EOF', value: '', pos: 0 }
  const consume = (): Token => tokens[pos++] ?? { type: 'EOF', value: '', pos: 0 }
  const expect = (type: Token['type']): Token => {
    const t = consume()
    if (t.type !== type) {
      throw new ParseError(`Expected ${type} but got ${t.type} ("${t.value}") at position ${t.pos}`)
    }
    return t
  }

  function parseExpression(): ASTNode {
    let left = parseTerm()
    while (peek().type === 'PLUS' || peek().type === 'MINUS') {
      const op = consume().value as '+' | '-'
      const right = parseTerm()
      left = { type: 'binary', op, left, right }
    }
    return left
  }

  function parseTerm(): ASTNode {
    let left = parsePower()
    while (
      peek().type === 'STAR' ||
      peek().type === 'SLASH' ||
      peek().type === 'PERCENT'
    ) {
      const t = consume()
      const op = t.value === '%' ? '%' : t.value as '*' | '/'
      const right = parsePower()
      left = { type: 'binary', op, left, right }
    }
    return left
  }

  function parsePower(): ASTNode {
    const base = parsePostfix()
    if (peek().type === 'CARET') {
      consume() // consume '^'
      // Right-associative: recurse back into parsePower so 2^3^2 = 2^(3^2) = 512
      const exp = parsePower()
      return { type: 'binary', op: '^', left: base, right: exp }
    }
    return base
  }

  function parsePostfix(): ASTNode {
    let node = parseUnary()
    // Postfix factorial: n!
    while (peek().type === 'EXCLAIM') {
      consume()
      node = { type: 'call', name: 'fact', args: [node] }
    }
    return node
  }

  function parseUnary(): ASTNode {
    if (peek().type === 'MINUS') {
      consume()
      return { type: 'unary', op: '-', operand: parseUnary() }
    }
    if (peek().type === 'PLUS') {
      consume()
      return { type: 'unary', op: '+', operand: parseUnary() }
    }
    return parsePrimary()
  }

  function parsePrimary(): ASTNode {
    const t = peek()

    if (t.type === 'NUMBER') {
      consume()
      return { type: 'number', value: parseFloat(t.value) }
    }

    if (t.type === 'IDENTIFIER') {
      consume()
      const name = t.value

      // Function call: name(...)
      if (peek().type === 'LPAREN') {
        consume() // consume '('
        const args: ASTNode[] = []

        if (peek().type !== 'RPAREN') {
          args.push(parseExpression())
          while (peek().type === 'COMMA') {
            consume()
            args.push(parseExpression())
          }
        }
        expect('RPAREN')

        // Validate argument count
        if (name in FUNCTIONS) {
          const range = getArgCount(name)
          if (range && (args.length < range.min || args.length > range.max)) {
            throw new ParseError(
              `${name}() expects ${range.min === range.max ? range.min : `${range.min}–${range.max}`} argument(s), got ${args.length}`
            )
          }
        }

        return { type: 'call', name, args }
      }

      // Constant
      if (name in CONSTANTS) {
        return { type: 'constant', name }
      }

      // A function name used without parens is a syntax error
      if (name in FUNCTIONS) {
        throw new ParseError(`Function "${name}" requires parentheses`)
      }

      throw new ParseError(`Unknown identifier: "${name}"`)
    }

    if (t.type === 'LPAREN') {
      consume()
      const inner = parseExpression()
      expect('RPAREN')
      return inner
    }

    if (t.type === 'EOF') {
      throw new ParseError('Unexpected end of expression')
    }

    throw new ParseError(`Unexpected token "${t.value}" at position ${t.pos}`)
  }

  const ast = parseExpression()

  // After parsing a complete expression, the next token must be EOF
  if (peek().type !== 'EOF') {
    const t = peek()
    throw new ParseError(`Unexpected token "${t.value}" at position ${t.pos}`)
  }

  return ast
}
