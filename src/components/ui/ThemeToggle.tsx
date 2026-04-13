'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/utils/classNames'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch — only render after client mount
  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className={cn('w-8 h-8', className)} />

  const next =
    theme === 'light' ? 'dark'
    : theme === 'dark' ? 'system'
    : 'light'

  const Icon =
    theme === 'light' ? Sun
    : theme === 'dark' ? Moon
    : Monitor

  return (
    <button
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      className={cn(
        'w-8 h-8 rounded-xl flex items-center justify-center',
        'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
        'hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.06)]',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]',
        className
      )}
    >
      <Icon size={16} strokeWidth={1.8} />
    </button>
  )
}
