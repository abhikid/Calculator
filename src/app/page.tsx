import { CalculatorShell } from '@/components/calculator/CalculatorShell'

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-3 py-6 min-h-dvh w-full overflow-x-hidden">
      <CalculatorShell />
    </main>
  )
}
