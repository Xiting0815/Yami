import { useEffect, useState } from 'react'
import { ACTIVITY, DEFAULT_PROFILE, PACE, type Profile, bmr, floorKcal, targetKcal, tdee, DEFAULT_BREAKFAST_KCAL } from '../energy'

interface Props {
  profile?: Profile
  onSave: (p: Profile) => void
  onClose: () => void
}

const fmt = (n: number) => Math.round(n).toLocaleString('de-DE')

export function ProfileSheet({ profile, onSave, onClose }: Props) {
  const [p, setP] = useState<Profile>(profile ?? DEFAULT_PROFILE)
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const num = (k: keyof Profile, min: number, max: number) => ({
    inputMode: 'decimal' as const,
    value: String(p[k]),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseFloat(e.target.value.replace(',', '.'))
      setP({ ...p, [k]: isNaN(v) ? 0 : Math.min(max, Math.max(min, v)) })
    },
  })

  const valid = p.age >= 14 && p.heightCm >= 120 && p.weightKg >= 35
  const target = targetKcal(p)
  const atFloor = tdee(p) - p.deficit < floorKcal(p)

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet profile" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Profil">
        <button className="sheet-close dark" onClick={onClose} aria-label="Schließen">✕</button>
        <div className="sheet-body">
          <h2>👤 Dein Profil</h2>
          <p className="muted small">Bleibt nur auf diesem Handy. Daraus berechnet die App dein Kalorienziel für Mo–Fr.</p>

          <div className="seg2">
            {(['m', 'w'] as const).map((s) => (
              <button key={s} className={p.sex === s ? 'on' : ''} onClick={() => setP({ ...p, sex: s })}>
                {s === 'm' ? 'Mann' : 'Frau'}
              </button>
            ))}
          </div>

          <div className="form-grid">
            <label>Alter<input {...num('age', 0, 110)} /><span>Jahre</span></label>
            <label>Größe<input {...num('heightCm', 0, 230)} /><span>cm</span></label>
            <label>Gewicht<input {...num('weightKg', 0, 300)} /><span>kg</span></label>
          </div>

          <h3>Aktivität</h3>
          <div className="radio-list">
            {ACTIVITY.map((a) => (
              <button key={a.value} className={p.activity === a.value ? 'on' : ''} onClick={() => setP({ ...p, activity: a.value })}>
                <b>{a.label}</b>
                <span>{a.hint}</span>
              </button>
            ))}
          </div>

          <h3>Ziel</h3>
          <div className="radio-list">
            {PACE.map((a) => (
              <button key={a.deficit} className={p.deficit === a.deficit ? 'on' : ''} onClick={() => setP({ ...p, deficit: a.deficit })}>
                <b>{a.label}</b>
                {a.deficit > 0 && <span>−{a.deficit} kcal pro Tag</span>}
              </button>
            ))}
          </div>

          <h3>Mittagessen (Pauschale)</h3>
          <div className="form-grid one">
            <label>Mittag<input {...num('lunchKcal', 0, 2000)} /><span>kcal</span></label>
          </div>
          <p className="muted small">Wird nicht geplant, nur vom Tagesziel abgezogen. Kantine/Brotzeit: meist 500–800 kcal.</p>

          {valid && (
            <div className="calc-box">
              <div><span>Grundumsatz (Mifflin-St Jeor)</span><b>{fmt(bmr(p))} kcal</b></div>
              <div><span>× Aktivität {String(p.activity).replace('.', ',')} = Bedarf</span><b>{fmt(tdee(p))} kcal</b></div>
              <div><span>− Defizit</span><b>−{fmt(p.deficit)} kcal</b></div>
              <div className="total"><span>Dein Tagesziel</span><b>{fmt(target)} kcal</b></div>
              <div className="split">
                ☀️ Frühstück ≈ {DEFAULT_BREAKFAST_KCAL} · 🥪 Mittag {fmt(p.lunchKcal)} · 🌙 Abendessen ≈ {fmt(Math.max(0, target - DEFAULT_BREAKFAST_KCAL - p.lunchKcal))} kcal
              </div>
              {atFloor && <p className="bf-note">ℹ️ Begrenzt auf die Mindestmenge von {fmt(floorKcal(p))} kcal – weniger wäre auf Dauer ungesund.</p>}
            </div>
          )}
          <p className="muted small">
            Richtwerte, keine ärztliche Beratung. Bei Vorerkrankungen das Ziel bitte mit dem Hausarzt abstimmen.
          </p>
        </div>
        <div className="sheet-footer">
          <button className="btn primary wide" disabled={!valid} onClick={() => onSave(p)}>
            Speichern
          </button>
        </div>
      </div>
    </div>
  )
}
