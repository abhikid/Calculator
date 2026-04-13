'use client'

import { X, Trash2, ClockIcon } from 'lucide-react'
import { useHistoryStore } from '@/store/historyStore'
import { HistoryItem } from './HistoryItem'
import { cn } from '@/utils/classNames'

interface HistoryPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function HistoryPanel({ isOpen, onClose }: HistoryPanelProps) {
  const entries  = useHistoryStore((s) => s.entries)
  const clearAll = useHistoryStore((s) => s.clearAll)

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <div
        role="dialog"
        aria-label="Calculation History"
        aria-modal="true"
        className={cn(
          'fixed right-0 top-0 bottom-0 z-50 w-80 max-w-full',
          'glass flex flex-col',
          'transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <ClockIcon size={15} className="text-[var(--color-text-secondary)]" />
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">History</h2>
            {entries.length > 0 && (
              <span className="text-[10px] text-[var(--color-text-dim)] bg-[var(--color-border)] px-1.5 py-0.5 rounded-full">
                {entries.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {entries.length > 0 && (
              <button
                onClick={clearAll}
                aria-label="Clear all history"
                className="p-1.5 rounded-lg text-[var(--color-text-dim)] hover:text-red-400 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close history panel"
              className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-2 px-1">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-[var(--color-text-dim)]">
              <ClockIcon size={32} strokeWidth={1} />
              <p className="text-sm">No calculations yet</p>
            </div>
          ) : (
            entries.map((entry) => (
              <HistoryItem key={entry.id} entry={entry} />
            ))
          )}
        </div>
      </div>
    </>
  )
}
