'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/utils/classNames'

export type ButtonVariant = 'digit' | 'operator' | 'function' | 'equals' | 'clear' | 'memory' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  /** Makes the button span 2 columns in a grid layout */
  wide?: boolean
  /** Makes the button span 2 rows */
  tall?: boolean
  label?: string  // aria-label override
}

const variantStyles: Record<ButtonVariant, string> = {
  digit:
    'bg-[var(--color-btn-digit)] text-[var(--color-text-primary)] hover:brightness-95 active:brightness-90 shadow-sm',
  operator:
    'bg-[var(--color-btn-op)] text-white hover:brightness-110 active:brightness-95 shadow-sm',
  function:
    'bg-[var(--color-btn-fn)] text-[var(--color-text-primary)] hover:brightness-95 active:brightness-90 shadow-sm text-sm',
  equals:
    'bg-[var(--color-btn-eq)] text-white hover:brightness-110 active:brightness-95 shadow-md font-bold',
  clear:
    'bg-[var(--color-btn-clear)] text-white hover:brightness-110 active:brightness-95 shadow-sm font-semibold',
  memory:
    'bg-[var(--color-btn-mem)] text-white hover:brightness-110 active:brightness-90 shadow-sm text-xs font-semibold',
  ghost:
    'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] active:bg-[var(--color-border)]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'digit', wide, tall, label, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        aria-label={label ?? (typeof children === 'string' ? children : undefined)}
        className={cn(
          // Layout
          'relative flex items-center justify-center',
          'rounded-2xl select-none cursor-pointer',
          // Fill grid cell, minimum touch target height only (width controlled by grid)
          'w-full min-h-[52px]',
          // Typography
          'font-medium text-lg leading-none',
          // Transition
          'transition-all duration-[80ms] ease-out',
          // Press feedback
          'btn-press',
          // Focus ring for keyboard navigation
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
          // Variant
          variantStyles[variant],
          // Span modifiers
          wide && 'col-span-2',
          tall && 'row-span-2',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
