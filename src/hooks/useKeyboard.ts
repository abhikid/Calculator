'use client'

import { useEffect } from 'react'
import { useCalculatorStore } from '@/store/calculatorStore'
import { useHistoryStore } from '@/store/historyStore'

// Characters safe to paste as expression tokens
const SAFE_PASTE_CHARS = /^[0-9+\-*/^%().sincostanlogpieabsqrtcbrtfact\s,]+$/i

export function useKeyboard() {
  const appendToken  = useCalculatorStore((s) => s.appendToken)
  const evaluate     = useCalculatorStore((s) => s.evaluate)
  const clear        = useCalculatorStore((s) => s.clear)
  const backspace    = useCalculatorStore((s) => s.backspace)
  const toggleSign   = useCalculatorStore((s) => s.toggleSign)
  const mode         = useCalculatorStore((s) => s.mode)
  const angleUnit    = useCalculatorStore((s) => s.angleUnit)
  const addHistory   = useHistoryStore((s) => s.addEntry)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't intercept keyboard inside input/textarea elements (e.g. converter)
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      // Don't intercept when modifier keys are held (except Shift for special chars)
      if (e.ctrlKey && e.key !== 'v' && e.key !== 'V') return
      if (e.metaKey) return

      switch (e.key) {
        // ── Digits and decimal ──────────────────────────────────────────────
        case '0': case '1': case '2': case '3': case '4':
        case '5': case '6': case '7': case '8': case '9':
          e.preventDefault()
          appendToken(e.key)
          break
        case '.':
          e.preventDefault()
          appendToken('.')
          break

        // ── Operators ───────────────────────────────────────────────────────
        case '+': e.preventDefault(); appendToken('+'); break
        case '-': e.preventDefault(); appendToken('-'); break
        case '*': e.preventDefault(); appendToken('*'); break
        case '/': e.preventDefault(); appendToken('/'); break
        case '%': e.preventDefault(); appendToken('%'); break
        case '^': e.preventDefault(); appendToken('^'); break

        // ── Parentheses ─────────────────────────────────────────────────────
        case '(':
          e.preventDefault()
          appendToken('(')
          break
        case ')':
          e.preventDefault()
          appendToken(')')
          break

        // ── Evaluate ────────────────────────────────────────────────────────
        case 'Enter':
        case '=':
          e.preventDefault()
          {
            const res = evaluate()
            if (res) addHistory({ expression: res.expression, result: res.result, mode, angleUnit })
          }
          break

        // ── Backspace ───────────────────────────────────────────────────────
        case 'Backspace':
          e.preventDefault()
          backspace()
          break

        // ── Clear ───────────────────────────────────────────────────────────
        case 'Escape':
        case 'Delete':
          e.preventDefault()
          clear()
          break

        // ── Sign toggle ─────────────────────────────────────────────────────
        case 'F9':
          e.preventDefault()
          toggleSign()
          break

        // ── Paste ────────────────────────────────────────────────────────────
        case 'v':
        case 'V':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            navigator.clipboard.readText().then((text) => {
              const clean = text.trim()
              if (SAFE_PASTE_CHARS.test(clean) && clean.length <= 500) {
                // Replace the entire expression with the pasted value
                for (const ch of clean) {
                  if (ch !== ' ') appendToken(ch)
                }
              }
            }).catch(() => { /* clipboard access denied — ignore */ })
          }
          break
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [appendToken, evaluate, clear, backspace, toggleSign, mode, angleUnit, addHistory])
}
