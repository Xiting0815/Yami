import { shortDate, weekdayName } from '../store'

interface Props {
  prep: string
  choices: string[]
  onChange: (iso: string) => void
}

/** „Vorbereitung: So, 15.11.“ – antippen und anderen Tag wählen (die App lernt den üblichen Wochentag) */
export function PrepDayChip({ prep, choices, onChange }: Props) {
  return (
    <label className="chip prep-day">
      <span>Vorbereitung: <b>{weekdayName(prep, true)}, {shortDate(prep)}</b> ▾</span>
      <select value={prep} onChange={(e) => onChange(e.target.value)} aria-label="Tag fürs Vorbereiten">
        {choices.map((d) => (
          <option key={d} value={d}>{weekdayName(d)}, {shortDate(d)}</option>
        ))}
      </select>
    </label>
  )
}
