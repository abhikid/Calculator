'use client'

import { Trash2 } from 'lucide-react'
import { useCalculatorStore } from '@/store/calculatorStore'
import { useHistoryStore } from '@/store/historyStore'
import { formatTimestamp } from '@/utils/formatNumber'
import { cn } from '@/utils/classNames'
import type { HistoryEntry } from '@/types/calculator'

interface HistoryItemProps {
  entry: HistoryEntry
}

export function HistoryItem({ entry }: HistoryItemProps) {
  const insertValue  = useCalculatorStore((s) => s.insertValue)
  const removeEntry  = useHistoryStore((s) => s.removeEntry)

  const handleRestore = () => {
    insertValue(entry.result)
  }

  return (
    <div
      className={cn(
        'group flex items-start gap-3 px-3 py-2.5 rounded-2xl',
        'hover:bg-[rgba(0,0,0,0.04)] dark:hover:bg-[rgba(255,255,255,0.04)]',
        'transition-colors duration-100 cursor-pointer animate-fade-in'
      )}
      role="button"
      tabIndex={0}
      onClick={handleRestore}
      onKeyDown={(e) => e.key === 'Enter' && handleRestore()}
      aria-label={`Restore: ${entry.expression} = ${entry.result}`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-[var(--color-text-secondary)] text-xs font-mono truncate">
          {entry.expression}
        </p>
        <p className="text-[var(--color-text-primary)] text-base font-semibold font-mono truncate mt-0.5">
          = {entry.result}
        </p>
        <p className="text-[var(--color-text-dim)] text-[10px] mt-1">
          {formatTimestamp(entry.createdAt)}
          {entry.mode !== 'standard' && (
            <span className="ml-2 uppercase opacity-60">{entry.mode}</span>
          )}
          {entry.angleUnit && (
            <span className="ml-2 uppercase opacity-60">{entry.angleUnit}</span>
          )}
        </p>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); removeEntry(entry.id) }}
        aria-label="Remove history entry"
        className={cn(
          'mt-1 p-1.5 rounded-lg opacity-0 group-hover:opacity-100',
          'text-[var(--color-text-dim)] hover:text-red-400',
          'transition-opacity duration-150',
          'focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400'
        )}
      >
        <Trash2 size={13} />
      </button>
    </div>
  )
}
