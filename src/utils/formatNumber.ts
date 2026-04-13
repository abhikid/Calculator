/** Returns a human-readable timestamp like "Today 3:42 PM" or "Apr 11, 2:15 PM" */
export function formatTimestamp(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()

  const timeStr = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })

  if (isToday) return `Today ${timeStr}`

  const dateStr = date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
  return `${dateStr}, ${timeStr}`
}
