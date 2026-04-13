'use client'

import { useState } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { cn } from '@/utils/classNames'
import type { ConversionCategory } from '@/types/calculator'

// ── Conversion data ────────────────────────────────────────────────────────

interface Unit {
  id: string
  label: string
  factor: number    // multiplier to convert to base unit
  offset?: number   // added after multiplication (only for temperature)
}

interface Category {
  id: ConversionCategory
  label: string
  baseUnit: string
  units: Unit[]
}

const CATEGORIES: Category[] = [
  {
    id: 'length', label: 'Length', baseUnit: 'meter',
    units: [
      { id: 'mm',  label: 'Millimeter',  factor: 0.001 },
      { id: 'cm',  label: 'Centimeter',  factor: 0.01 },
      { id: 'm',   label: 'Meter',       factor: 1 },
      { id: 'km',  label: 'Kilometer',   factor: 1000 },
      { id: 'in',  label: 'Inch',        factor: 0.0254 },
      { id: 'ft',  label: 'Foot',        factor: 0.3048 },
      { id: 'yd',  label: 'Yard',        factor: 0.9144 },
      { id: 'mi',  label: 'Mile',        factor: 1609.344 },
      { id: 'nmi', label: 'Nautical mile', factor: 1852 },
    ],
  },
  {
    id: 'weight', label: 'Weight', baseUnit: 'kg',
    units: [
      { id: 'mg',  label: 'Milligram',   factor: 1e-6 },
      { id: 'g',   label: 'Gram',        factor: 0.001 },
      { id: 'kg',  label: 'Kilogram',    factor: 1 },
      { id: 'lb',  label: 'Pound',       factor: 0.453592 },
      { id: 'oz',  label: 'Ounce',       factor: 0.0283495 },
      { id: 't',   label: 'Metric tonne', factor: 1000 },
      { id: 'st',  label: 'Stone',       factor: 6.35029 },
    ],
  },
  {
    id: 'temperature', label: 'Temperature', baseUnit: 'celsius',
    units: [
      { id: 'c',  label: 'Celsius',    factor: 1,       offset: 0 },
      { id: 'f',  label: 'Fahrenheit', factor: 5 / 9,   offset: -32 },
      { id: 'k',  label: 'Kelvin',     factor: 1,       offset: -273.15 },
    ],
  },
  {
    id: 'area', label: 'Area', baseUnit: 'm²',
    units: [
      { id: 'mm2',  label: 'mm²',          factor: 1e-6 },
      { id: 'cm2',  label: 'cm²',          factor: 1e-4 },
      { id: 'm2',   label: 'm²',           factor: 1 },
      { id: 'km2',  label: 'km²',          factor: 1e6 },
      { id: 'ha',   label: 'Hectare',      factor: 1e4 },
      { id: 'ac',   label: 'Acre',         factor: 4046.86 },
      { id: 'ft2',  label: 'ft²',          factor: 0.0929 },
      { id: 'mi2',  label: 'mi²',          factor: 2.59e6 },
    ],
  },
  {
    id: 'volume', label: 'Volume', baseUnit: 'liter',
    units: [
      { id: 'ml',   label: 'Milliliter',   factor: 0.001 },
      { id: 'l',    label: 'Liter',        factor: 1 },
      { id: 'm3',   label: 'm³',           factor: 1000 },
      { id: 'tsp',  label: 'Teaspoon',     factor: 0.00492892 },
      { id: 'tbsp', label: 'Tablespoon',   factor: 0.0147868 },
      { id: 'floz', label: 'Fl oz',        factor: 0.0295735 },
      { id: 'cup',  label: 'Cup',          factor: 0.236588 },
      { id: 'pt',   label: 'Pint',         factor: 0.473176 },
      { id: 'qt',   label: 'Quart',        factor: 0.946353 },
      { id: 'gal',  label: 'Gallon',       factor: 3.78541 },
    ],
  },
  {
    id: 'speed', label: 'Speed', baseUnit: 'm/s',
    units: [
      { id: 'ms',   label: 'm/s',          factor: 1 },
      { id: 'kmh',  label: 'km/h',         factor: 1 / 3.6 },
      { id: 'mph',  label: 'mph',          factor: 0.44704 },
      { id: 'kn',   label: 'Knot',         factor: 0.514444 },
      { id: 'mach', label: 'Mach',         factor: 340.29 },
    ],
  },
  {
    id: 'time', label: 'Time', baseUnit: 'second',
    units: [
      { id: 'ns',   label: 'Nanosecond',   factor: 1e-9 },
      { id: 'us',   label: 'Microsecond',  factor: 1e-6 },
      { id: 'ms',   label: 'Millisecond',  factor: 0.001 },
      { id: 's',    label: 'Second',       factor: 1 },
      { id: 'min',  label: 'Minute',       factor: 60 },
      { id: 'h',    label: 'Hour',         factor: 3600 },
      { id: 'd',    label: 'Day',          factor: 86400 },
      { id: 'wk',   label: 'Week',         factor: 604800 },
      { id: 'mo',   label: 'Month (30d)',  factor: 2592000 },
      { id: 'yr',   label: 'Year (365d)',  factor: 31536000 },
    ],
  },
  {
    id: 'data', label: 'Data', baseUnit: 'byte',
    units: [
      { id: 'b',   label: 'Bit',       factor: 0.125 },
      { id: 'B',   label: 'Byte',      factor: 1 },
      { id: 'KB',  label: 'Kilobyte',  factor: 1024 },
      { id: 'MB',  label: 'Megabyte',  factor: 1024 ** 2 },
      { id: 'GB',  label: 'Gigabyte',  factor: 1024 ** 3 },
      { id: 'TB',  label: 'Terabyte',  factor: 1024 ** 4 },
      { id: 'PB',  label: 'Petabyte',  factor: 1024 ** 5 },
    ],
  },
]

// ── Conversion logic ────────────────────────────────────────────────────────

function convert(value: number, from: Unit, to: Unit, category: Category): number {
  if (category.id === 'temperature') {
    // Special case: non-linear conversions
    // First convert to Celsius (base), then to target
    const celsius = (value + (from.offset ?? 0)) * from.factor
    return celsius / to.factor - (to.offset ?? 0)
  }
  // Linear: value × fromFactor / toFactor
  return (value * from.factor) / to.factor
}

function formatResult(value: number): string {
  if (!isFinite(value) || isNaN(value)) return 'Error'
  const abs = Math.abs(value)
  if (abs !== 0 && (abs < 0.001 || abs >= 1e12)) {
    return value.toExponential(6).replace(/\.?0+e/, 'e')
  }
  return parseFloat(value.toPrecision(10)).toString()
}

// ── Component ───────────────────────────────────────────────────────────────

export function ConverterPanel() {
  const [category, setCategory] = useState<ConversionCategory>('length')
  const [fromId, setFromId]     = useState('m')
  const [toId, setToId]         = useState('km')
  const [inputValue, setInput]  = useState('')

  const cat    = CATEGORIES.find((c) => c.id === category)!
  const fromUnit = cat.units.find((u) => u.id === fromId) ?? cat.units[0]
  const toUnit   = cat.units.find((u) => u.id === toId) ?? cat.units[1]

  // Reset unit selectors when category changes
  const handleCategoryChange = (id: ConversionCategory) => {
    setCategory(id)
    const newCat = CATEGORIES.find((c) => c.id === id)!
    setFromId(newCat.units[0].id)
    setToId(newCat.units[1]?.id ?? newCat.units[0].id)
    setInput('')
  }

  const numInput = parseFloat(inputValue)
  const result = !isNaN(numInput) ? convert(numInput, fromUnit, toUnit, cat) : null

  const swap = () => {
    setFromId(toId)
    setToId(fromId)
    if (result !== null) setInput(formatResult(result))
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Category tabs */}
      <div className="grid grid-cols-4 gap-1.5">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => handleCategoryChange(c.id)}
            aria-pressed={category === c.id}
            className={cn(
              'py-1.5 rounded-xl text-[11px] font-semibold transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]',
              category === c.id
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-[var(--color-btn-fn)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Conversion UI */}
      <div className="glass rounded-3xl p-4 flex flex-col gap-3">
        {/* From */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold text-[var(--color-text-dim)] uppercase tracking-wide">From</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInput(e.target.value)}
            placeholder="0"
            aria-label="Input value"
            className={cn(
              'w-full bg-transparent text-2xl font-semibold text-[var(--color-text-primary)]',
              'outline-none border-b border-[var(--color-border)] pb-1',
              'placeholder:text-[var(--color-text-dim)]'
            )}
          />
          <select
            value={fromId}
            onChange={(e) => setFromId(e.target.value)}
            aria-label="From unit"
            className={cn(
              'w-full bg-[var(--color-btn-fn)] text-[var(--color-text-primary)]',
              'rounded-xl px-3 py-1.5 text-sm border border-[var(--color-border)]',
              'outline-none focus:ring-2 focus:ring-[var(--color-accent)]'
            )}
          >
            {cat.units.map((u) => (
              <option key={u.id} value={u.id}>{u.label}</option>
            ))}
          </select>
        </div>

        {/* Swap button */}
        <div className="flex justify-center">
          <button
            onClick={swap}
            aria-label="Swap units"
            className={cn(
              'p-2 rounded-full bg-[var(--color-btn-fn)] text-[var(--color-text-secondary)]',
              'hover:text-[var(--color-accent)] hover:bg-[rgba(249,115,22,0.10)]',
              'transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]'
            )}
          >
            <ArrowLeftRight size={16} />
          </button>
        </div>

        {/* To */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold text-[var(--color-text-dim)] uppercase tracking-wide">To</label>
          <div className="w-full text-2xl font-semibold text-[var(--color-accent)] pb-1 border-b border-[var(--color-border)] min-h-[40px]">
            {result !== null ? formatResult(result) : <span className="text-[var(--color-text-dim)]">—</span>}
          </div>
          <select
            value={toId}
            onChange={(e) => setToId(e.target.value)}
            aria-label="To unit"
            className={cn(
              'w-full bg-[var(--color-btn-fn)] text-[var(--color-text-primary)]',
              'rounded-xl px-3 py-1.5 text-sm border border-[var(--color-border)]',
              'outline-none focus:ring-2 focus:ring-[var(--color-accent)]'
            )}
          >
            {cat.units.map((u) => (
              <option key={u.id} value={u.id}>{u.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
