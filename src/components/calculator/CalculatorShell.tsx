'use client'

import { useState } from 'react'
import { History } from 'lucide-react'
import { cn } from '@/utils/classNames'
import { useCalculatorStore } from '@/store/calculatorStore'
import { useHistoryStore } from '@/store/historyStore'
import { useKeyboard } from '@/hooks/useKeyboard'

import { Display }          from './Display'
import { StandardKeypad }   from './StandardKeypad'
import { ScientificKeypad } from './ScientificKeypad'
import { ProgrammerKeypad } from './ProgrammerKeypad'
import { ConverterPanel }   from './ConverterPanel'
import { MemoryBar }        from './MemoryBar'
import { ModeSelector }     from './ModeSelector'
import { AngleToggle }      from './AngleToggle'
import { HistoryPanel }     from './HistoryPanel'
import { ThemeToggle }      from '@/components/ui/ThemeToggle'

export function CalculatorShell() {
  const mode            = useCalculatorStore((s) => s.mode)
  const historyCount    = useHistoryStore((s) => s.entries.length)
  const [histOpen, setHistOpen] = useState(false)

  // Register global keyboard handler
  useKeyboard()

  return (
    <>
      <HistoryPanel isOpen={histOpen} onClose={() => setHistOpen(false)} />

      <div
        className={cn(
          'glass rounded-[2rem] shadow-2xl shadow-black/20',
          'w-full max-w-sm mx-auto p-4 flex flex-col gap-3 overflow-hidden',
          'animate-fade-in'
        )}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <ThemeToggle />
          <ModeSelector />
          <button
            onClick={() => setHistOpen(true)}
            aria-label={`Open history (${historyCount} entries)`}
            className={cn(
              'relative w-8 h-8 rounded-xl flex items-center justify-center',
              'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
              'hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.06)]',
              'transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]'
            )}
          >
            <History size={16} strokeWidth={1.8} />
            {historyCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[var(--color-accent)] text-white text-[8px] font-bold flex items-center justify-center">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
          </button>
        </div>

        {/* Display */}
        <Display />

        {/* Angle toggle — only in scientific mode */}
        {mode === 'scientific' && (
          <div className="flex justify-end pr-1">
            <AngleToggle />
          </div>
        )}

        {/* Memory bar — standard and scientific modes */}
        {(mode === 'standard' || mode === 'scientific') && (
          <MemoryBar />
        )}

        {/* Scientific keypad — scrollable panel above standard keypad */}
        {mode === 'scientific' && (
          <div className="animate-slide-up relative">
            <ScientificKeypad />
            {/* Fade hint to indicate scrollability */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[var(--color-bg-shell)] to-transparent rounded-b-xl" />
          </div>
        )}

        {/* Mode-specific content */}
        {mode === 'programmer' && (
          <div className="animate-slide-up">
            <ProgrammerKeypad />
          </div>
        )}

        {mode === 'converter' && (
          <div className="animate-slide-up">
            <ConverterPanel />
          </div>
        )}

        {/* Standard keypad — shown in standard and scientific modes */}
        {(mode === 'standard' || mode === 'scientific') && (
          <StandardKeypad />
        )}
      </div>
    </>
  )
}
