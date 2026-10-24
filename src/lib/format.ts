import i18n from '@/lib/i18n'

/** "2022-02-25" → "25. februar 2022." in the active locale. */
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  // Construct in local time: `new Date("2022-02-25")` is UTC midnight and can shift a day.
  return new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' })
    .format(new Date(year, month - 1, day))
}

export function releaseYear(isoDate: string | null): string | null {
  return isoDate ? isoDate.slice(0, 4) : null
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat(i18n.language).format(value)
}
