import type { AngleUnit } from '@/types/calculator'

// Convert degrees to radians
function toRad(x: number, unit: AngleUnit): number {
  return unit === 'deg' ? (x * Math.PI) / 180 : x
}

// Convert radians to degrees for inverse trig output
function fromRad(x: number, unit: AngleUnit): number {
  return unit === 'deg' ? (x * 180) / Math.PI : x
}

// Gamma function via Lanczos approximation (for factorial of non-integers)
function gamma(n: number): number {
  if (n < 0.5) {
    return Math.PI / (Math.sin(Math.PI * n) * gamma(1 - n))
  }
  n -= 1
  const g = 7
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ]
  let x = c[0]
  for (let i = 1; i < g + 2; i++) {
    x += c[i] / (n + i)
  }
  const t = n + g + 0.5
  return Math.sqrt(2 * Math.PI) * Math.pow(t, n + 0.5) * Math.exp(-t) * x
}

type MathFn = (args: number[], angleUnit: AngleUnit) => number

// Registry of all supported functions.
// Adding a new function here is all that is needed to make it available in expressions.
export const FUNCTIONS: Record<string, MathFn> = {
  // Trigonometric
  sin: ([x], u) => Math.sin(toRad(x, u)),
  cos: ([x], u) => Math.cos(toRad(x, u)),
  tan: ([x], u) => {
    const r = toRad(x, u)
    // tan(90°) should be undefined (not a very large number)
    if (u === 'deg' && Math.abs(x % 180) === 90) throw new Error('tan undefined')
    return Math.tan(r)
  },

  // Inverse trig — outputs in current angle unit
  asin: ([x], u) => {
    if (x < -1 || x > 1) throw new Error('asin domain: input must be in [-1, 1]')
    return fromRad(Math.asin(x), u)
  },
  acos: ([x], u) => {
    if (x < -1 || x > 1) throw new Error('acos domain: input must be in [-1, 1]')
    return fromRad(Math.acos(x), u)
  },
  atan: ([x], u) => fromRad(Math.atan(x), u),
  atan2: ([y, x], u) => fromRad(Math.atan2(y, x), u),

  // Hyperbolic
  sinh: ([x]) => Math.sinh(x),
  cosh: ([x]) => Math.cosh(x),
  tanh: ([x]) => Math.tanh(x),
  asinh: ([x]) => Math.asinh(x),
  acosh: ([x]) => {
    if (x < 1) throw new Error('acosh domain: input must be ≥ 1')
    return Math.acosh(x)
  },
  atanh: ([x]) => {
    if (x <= -1 || x >= 1) throw new Error('atanh domain: input must be in (-1, 1)')
    return Math.atanh(x)
  },

  // Logarithms
  log: ([x]) => {
    if (x <= 0) throw new Error('log domain: input must be > 0')
    return Math.log10(x)
  },
  log2: ([x]) => {
    if (x <= 0) throw new Error('log2 domain: input must be > 0')
    return Math.log2(x)
  },
  ln: ([x]) => {
    if (x <= 0) throw new Error('ln domain: input must be > 0')
    return Math.log(x)
  },
  // log base b: log(x, b)
  logb: ([x, b]) => {
    if (x <= 0 || b <= 0 || b === 1) throw new Error('logb domain error')
    return Math.log(x) / Math.log(b)
  },

  // Exponentials
  exp: ([x]) => Math.exp(x),
  pow10: ([x]) => Math.pow(10, x),
  pow2: ([x]) => Math.pow(2, x),

  // Roots
  sqrt: ([x]) => {
    if (x < 0) throw new Error('sqrt domain: input must be ≥ 0')
    return Math.sqrt(x)
  },
  cbrt: ([x]) => Math.cbrt(x),
  // nth root: nrt(n, x)
  nrt: ([n, x]) => {
    if (n === 0) throw new Error('nrt: n cannot be 0')
    if (x < 0 && n % 2 === 0) throw new Error('nrt: even root of negative number')
    return x < 0 ? -Math.pow(-x, 1 / n) : Math.pow(x, 1 / n)
  },

  // Misc
  abs: ([x]) => Math.abs(x),
  ceil: ([x]) => Math.ceil(x),
  floor: ([x]) => Math.floor(x),
  round: ([x]) => Math.round(x),
  sign: ([x]) => Math.sign(x),
  min: (args) => Math.min(...args),
  max: (args) => Math.max(...args),
  hypot: (args) => Math.hypot(...args),
  clamp: ([x, lo, hi]) => Math.min(Math.max(x, lo), hi),

  // Factorial — uses gamma for non-integers
  fact: ([x]) => {
    if (x < 0) throw new Error('factorial: input must be ≥ 0')
    if (x > 170) throw new Error('factorial: result too large')
    if (Number.isInteger(x)) {
      let r = 1
      for (let i = 2; i <= x; i++) r *= i
      return r
    }
    return gamma(x + 1)
  },

  // Random number
  rand: () => Math.random(),
  randint: ([lo, hi]) => Math.floor(Math.random() * (hi - lo + 1)) + lo,

  // Modulo (explicit function form)
  mod: ([a, b]) => {
    if (b === 0) throw new Error('mod: divisor cannot be 0')
    return ((a % b) + b) % b
  },

  // Reciprocal
  inv: ([x]) => {
    if (x === 0) throw new Error('reciprocal: division by zero')
    return 1 / x
  },

  // Percent (as a function)
  percent: ([x]) => x / 100,
}

/** Returns the expected argument count range for a function, or null if variadic */
export function getArgCount(name: string): { min: number; max: number } | null {
  const fixed: Record<string, number> = {
    sin: 1, cos: 1, tan: 1,
    asin: 1, acos: 1, atan: 1,
    sinh: 1, cosh: 1, tanh: 1,
    asinh: 1, acosh: 1, atanh: 1,
    log: 1, log2: 1, ln: 1, logb: 2,
    exp: 1, pow10: 1, pow2: 1,
    sqrt: 1, cbrt: 1, nrt: 2,
    abs: 1, ceil: 1, floor: 1, round: 1, sign: 1,
    fact: 1, rand: 0, percent: 1, inv: 1,
    atan2: 2, mod: 2, randint: 2, clamp: 3,
  }
  if (name in fixed) return { min: fixed[name], max: fixed[name] }
  // variadic: min, max, hypot, hypot
  if (['min', 'max', 'hypot'].includes(name)) return { min: 1, max: Infinity }
  return null
}
