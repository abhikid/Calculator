/**
 * Unit tests for the math expression engine.
 * Run with: npx jest src/engine/__tests__/engine.test.ts
 */

import { calculate, formatNumber } from '../index'

describe('formatNumber', () => {
  it('formats integers cleanly', () => {
    expect(formatNumber(42)).toBe('42')
    expect(formatNumber(0)).toBe('0')
    expect(formatNumber(-5)).toBe('-5')
  })

  it('uses scientific notation for very large numbers', () => {
    expect(formatNumber(1e20)).toMatch(/e/)
  })

  it('uses scientific notation for very small numbers', () => {
    expect(formatNumber(1e-12)).toMatch(/e/)
  })

  it('strips trailing zeros', () => {
    expect(formatNumber(1.5)).toBe('1.5')
    expect(formatNumber(1.0)).toBe('1')
  })
})

describe('calculate – basic arithmetic', () => {
  const calc = (expr: string) => calculate(expr, { angleUnit: 'deg' })

  it('adds', () => expect(calc('2+3').value).toBe(5))
  it('subtracts', () => expect(calc('10-4').value).toBe(6))
  it('multiplies', () => expect(calc('3*4').value).toBe(12))
  it('divides', () => expect(calc('15/3').value).toBe(5))
  it('handles decimals', () => expect(calc('0.1+0.2').value).toBeCloseTo(0.3))
  it('handles negative numbers', () => expect(calc('-5+3').value).toBe(-2))
  it('handles parentheses', () => expect(calc('(2+3)*4').value).toBe(20))
})

describe('calculate – operator precedence', () => {
  const calc = (expr: string) => calculate(expr, { angleUnit: 'deg' })

  it('multiplies before adding: 2+3*4 = 14', () => expect(calc('2+3*4').value).toBe(14))
  it('handles nested: (2+3)*4 = 20', () => expect(calc('(2+3)*4').value).toBe(20))
  it('exponent before multiply: 2*3^2 = 18', () => expect(calc('2*3^2').value).toBe(18))
  it('right-associative exponent: 2^3^2 = 512', () => expect(calc('2^3^2').value).toBe(512))
})

describe('calculate – unary operators', () => {
  const calc = (expr: string) => calculate(expr, { angleUnit: 'deg' })

  it('negation: -5', () => expect(calc('-5').value).toBe(-5))
  it('double negation: -(-3) = 3', () => expect(calc('-(-3)').value).toBe(3))
  it('unary plus: +5', () => expect(calc('+5').value).toBe(5))
})

describe('calculate – scientific functions (degrees)', () => {
  const calc = (expr: string) => calculate(expr, { angleUnit: 'deg' })

  it('sin(90) = 1', () => expect(calc('sin(90)').value).toBeCloseTo(1))
  it('cos(0) = 1', () => expect(calc('cos(0)').value).toBeCloseTo(1))
  it('tan(45) ≈ 1', () => expect(calc('tan(45)').value).toBeCloseTo(1))
  it('asin(1) = 90', () => expect(calc('asin(1)').value).toBeCloseTo(90))
  it('acos(1) = 0', () => expect(calc('acos(1)').value).toBeCloseTo(0))
  it('atan(1) = 45', () => expect(calc('atan(1)').value).toBeCloseTo(45))
})

describe('calculate – scientific functions (radians)', () => {
  const calc = (expr: string) => calculate(expr, { angleUnit: 'rad' })

  it('sin(pi/2) = 1', () => expect(calc('sin(pi/2)').value).toBeCloseTo(1))
  it('cos(pi) = -1', () => expect(calc('cos(pi)').value).toBeCloseTo(-1))
  it('asin(1) = pi/2', () => expect(calc('asin(1)').value).toBeCloseTo(Math.PI / 2))
})

describe('calculate – logarithms and exponentials', () => {
  const calc = (expr: string) => calculate(expr, { angleUnit: 'deg' })

  it('log(100) = 2', () => expect(calc('log(100)').value).toBeCloseTo(2))
  it('ln(e) = 1', () => expect(calc('ln(e)').value).toBeCloseTo(1))
  it('exp(0) = 1', () => expect(calc('exp(0)').value).toBe(1))
  it('pow10(2) = 100', () => expect(calc('pow10(2)').value).toBe(100))
})

describe('calculate – roots and powers', () => {
  const calc = (expr: string) => calculate(expr, { angleUnit: 'deg' })

  it('sqrt(9) = 3', () => expect(calc('sqrt(9)').value).toBe(3))
  it('cbrt(27) = 3', () => expect(calc('cbrt(27)').value).toBeCloseTo(3))
  it('nrt(3, 27) = 3', () => expect(calc('nrt(3,27)').value).toBeCloseTo(3))
  it('2^10 = 1024', () => expect(calc('2^10').value).toBe(1024))
})

describe('calculate – factorial and misc', () => {
  const calc = (expr: string) => calculate(expr, { angleUnit: 'deg' })

  it('fact(5) = 120', () => expect(calc('fact(5)').value).toBe(120))
  it('5! = 120 (postfix)', () => expect(calc('5!').value).toBe(120))
  it('abs(-7) = 7', () => expect(calc('abs(-7)').value).toBe(7))
  it('floor(3.7) = 3', () => expect(calc('floor(3.7)').value).toBe(3))
  it('ceil(3.2) = 4', () => expect(calc('ceil(3.2)').value).toBe(4))
  it('round(3.5) = 4', () => expect(calc('round(3.5)').value).toBe(4))
})

describe('calculate – implicit multiplication', () => {
  const calc = (expr: string) => calculate(expr, { angleUnit: 'deg' })

  it('2pi ≈ 6.283', () => expect(calc('2pi').value).toBeCloseTo(Math.PI * 2))
  it('3(4+1) = 15', () => expect(calc('3(4+1)').value).toBe(15))
  it('(2)(3) = 6', () => expect(calc('(2)(3)').value).toBe(6))
})

describe('calculate – constants', () => {
  const calc = (expr: string) => calculate(expr, { angleUnit: 'deg' })

  it('pi ≈ 3.14159', () => expect(calc('pi').value).toBeCloseTo(Math.PI))
  it('e ≈ 2.71828', () => expect(calc('e').value).toBeCloseTo(Math.E))
})

describe('calculate – error handling', () => {
  const calc = (expr: string) => calculate(expr, { angleUnit: 'deg' })

  it('1/0 returns EVAL_ERROR', () => {
    const r = calc('1/0')
    expect(r.value).toBeNull()
    expect(r.error?.kind).toBe('EVAL_ERROR')
    expect(r.error?.message).toMatch(/zero/i)
  })

  it('sqrt(-1) returns EVAL_ERROR', () => {
    const r = calc('sqrt(-1)')
    expect(r.value).toBeNull()
    expect(r.error?.kind).toBe('EVAL_ERROR')
  })

  it('asin(2) returns EVAL_ERROR (domain)', () => {
    const r = calc('asin(2)')
    expect(r.value).toBeNull()
    expect(r.error?.kind).toBe('EVAL_ERROR')
  })

  it('unknown identifier returns TOKENIZE_ERROR', () => {
    const r = calc('foo(2)')
    expect(r.value).toBeNull()
    expect(r.error?.kind).toBe('TOKENIZE_ERROR')
  })

  it('mismatched parens returns PARSE_ERROR', () => {
    const r = calc('(2+3')
    expect(r.value).toBeNull()
    expect(r.error?.kind).toBe('PARSE_ERROR')
  })

  it('empty input returns null value without error', () => {
    const r = calc('')
    expect(r.value).toBeNull()
    expect(r.error).toBeUndefined()
  })
})
