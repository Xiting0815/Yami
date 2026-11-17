import { addDays, isoDate, mondayOf, weekdayName } from '../store'

/** ab Samstag automatisch die nächste Woche zeigen */
export function initialMonday(): Date {
  const now = new Date()
  const m = mondayOf(now)
  return now.getDay() === 6 || now.getDay() === 0 ? addDays(m, 7) : m
}

/** Montag der „aktuellen“ Woche zu einem Tag (ab Samstag die nächste) */
export const defaultMonday = (iso: string) => {
  const d = new Date(iso + 'T12:00:00')
  const m = mondayOf(d)
  return isoDate(d.getDay() === 6 || d.getDay() === 0 ? addDays(m, 7) : m)
}

/** „Di–Fr“ aus den abgedeckten Tagen */
export function dayRangeText(ds: string[]): string {
  if (!ds.length) return '–'
  return ds.length === 1 ? weekdayName(ds[0], true) : `${weekdayName(ds[0], true)}–${weekdayName(ds[ds.length - 1], true)}`
}
