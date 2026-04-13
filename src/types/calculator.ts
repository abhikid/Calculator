// Core types shared across the calculator app

export type CalcMode = 'standard' | 'scientific' | 'programmer' | 'converter'

export type AngleUnit = 'deg' | 'rad'

export type ProgrammerBase = 2 | 8 | 10 | 16

// ─── Engine types ────────────────────────────────────────────────────────────

export type EngineErrorKind =
  | 'TOKENIZE_ERROR'
  | 'PARSE_ERROR'
  | 'EVAL_ERROR'

export interface EngineError {
  kind: EngineErrorKind
  message: string
}

export interface CalcResult {
  value: number | null
  display: string
  error?: EngineError
}

export interface EngineConfig {
  angleUnit: AngleUnit
  programmerBase?: ProgrammerBase
}

// ─── AST node types ──────────────────────────────────────────────────────────

export interface NumberNode {
  type: 'number'
  value: number
}

export interface ConstantNode {
  type: 'constant'
  name: string
}

export interface BinaryOpNode {
  type: 'binary'
  op: '+' | '-' | '*' | '/' | '%' | '^'
  left: ASTNode
  right: ASTNode
}

export interface UnaryOpNode {
  type: 'unary'
  op: '-' | '+'
  operand: ASTNode
}

export interface FunctionCallNode {
  type: 'call'
  name: string
  args: ASTNode[]
}

export type ASTNode =
  | NumberNode
  | ConstantNode
  | BinaryOpNode
  | UnaryOpNode
  | FunctionCallNode

// ─── History ─────────────────────────────────────────────────────────────────

export interface HistoryEntry {
  id: string
  expression: string
  result: string
  mode: CalcMode
  angleUnit?: AngleUnit
  createdAt: string // ISO string
}

// ─── Memory ──────────────────────────────────────────────────────────────────

export interface MemoryState {
  value: number
  hasValue: boolean
}

// ─── Converter ───────────────────────────────────────────────────────────────

export type ConversionCategory =
  | 'length'
  | 'weight'
  | 'temperature'
  | 'area'
  | 'volume'
  | 'speed'
  | 'time'
  | 'data'

export interface ConversionUnit {
  id: string
  label: string
  // For linear conversions: value in base unit = input * factor + offset
  factor: number
  offset?: number
}

export interface ConversionConfig {
  category: ConversionCategory
  fromUnit: string
  toUnit: string
  inputValue: string
}

// ─── Saved formulas ──────────────────────────────────────────────────────────

export interface SavedFormula {
  id: string
  name: string
  expression: string
  description?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}
