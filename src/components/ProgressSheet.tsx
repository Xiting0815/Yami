import { useEffect, useState } from 'react'
import type { Profile } from '../energy'
import { targetKcal } from '../energy'
import {
  type Suggestion,
  type WeighIn,
  compositionHint,
  goalProgress,
  weekOf,
} from '../progress'
import { parseIso } from '../store'
import { LineChart } from './LineChart'

interface Props {
  profile: Profile
  weighIns: WeighIn[]
  today: string
  suggestion: Suggestion | null
  onSave: (w: WeighIn) => void
  onDelete: (date: string) => void
  onDecide: (accept: boolean) => void
  onGoal: (kg: number | undefined) => void
  onMuscleUnit: (u: 'kg' | '%') => void
  onClose: () => void
}

const de = (v: number, d = 1) => v.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d })
const signed = (v: number, d = 1) => (v > 0 ? '+' : v < 0 ? '−' : '±') + de(Math.abs(v), d)
const longDate = (iso: string) => parseIso(iso).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
const shortD = (iso: string) => {
  const d = parseIso(iso)
  return `${d.getDate()}.${d.getMonth() + 1}.${String(d.getFullYear()).slice(2)}`
}

function num(s: string): number | undefined {
  const v = parseFloat(s.replace(',', '.'))
  return isNaN(v) ? undefined : v
}

export function ProgressSheet(props: Props) {
  const { profile, weighIns, today, suggestion, onSave, onDelete, onDecide, onGoal, onMuscleUnit, onClose } = props
  const last = weighIns[weighIns.length - 1]
  const [date, setDate] = useState(today)
  const [weight, setWeight] = useState(last ? de(last.weight) : de(profile.weightKg))
  const [fat, setFat] = useState(last?.fat != null ? de(last.fat) : '')
  const [muscle, setMuscle] = useState(last?.muscle != null ? de(last.muscle) : '')
  const [water, setWater] = useState(last?.water != null ? de(last.water) : '')
  const [goal, setGoal] = useState(profile.goalWeight != null ? de(profile.goalWeight) : '')
  const unit = profile.muscleUnit ?? 'kg'

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const replaces = weighIns.find((w) => weekOf(w.date) === weekOf(date))
  const w = num(weight)
  const valid = w != null && w > 30 && w < 300
  const prev = weighIns[weighIns.length - 2]
  const first = weighIns[0]
  const gp = goalProgress(weighIns, profile, today)
  const hint = compositionHint(weighIns)
  const fatPoints = weighIns.filter((x) => x.fat != null).map((x) => ({ date: x.date, value: x.fat! }))

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet progress" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Wiegen & Fortschritt">
        <button className="sheet-close dark" onClick={onClose} aria-label="Schließen">✕</button>
        <div className="sheet-body">
          <h2>⚖️ Wiegen & Fortschritt</h2>
          <p className="muted small">1× pro Woche, am besten immer am gleichen Tag morgens nüchtern. Tagesziel aktuell: {targetKcal(profile).toLocaleString('de-DE')} kcal.</p>

          {/* ───── Eintragen ───── */}
          <section className="card-box">
            <div className="form-grid two">
              <label>
                Datum
                <input type="date" value={date} max={today} onChange={(e) => e.target.value && setDate(e.target.value)} />
              </label>
              <label>
                Gewicht
                <input inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} />
                <span>kg</span>
              </label>
              <label>
                Körperfett
                <input inputMode="decimal" value={fat} placeholder="–" onChange={(e) => setFat(e.target.value)} />
                <span>%</span>
              </label>
              <label>
                Muskelmasse
                <input inputMode="decimal" value={muscle} placeholder="–" onChange={(e) => setMuscle(e.target.value)} />
                {/* Einheit im Feld ist der Umschalter (steht nach dem Input, damit das Label das Feld fokussiert) */}
                <button
                  type="button"
                  className="unit-toggle"
                  onClick={() => onMuscleUnit(unit === 'kg' ? '%' : 'kg')}
                  aria-label={`Einheit: ${unit} – wechseln zu ${unit === 'kg' ? '%' : 'kg'}`}
                >
                  {unit} ⇄
                </button>
              </label>
              <label>
                Körperwasser
                <input inputMode="decimal" value={water} placeholder="–" onChange={(e) => setWater(e.target.value)} />
                <span>%</span>
              </label>
            </div>
            {replaces && <p className="muted small">Ersetzt die Messung vom {shortD(replaces.date)} (1 Messung pro Woche).</p>}
            <button
              className="btn primary wide"
              disabled={!valid}
              onClick={() => onSave({ date, weight: w!, fat: num(fat), muscle: num(muscle), water: num(water) })}
            >
              Messung speichern
            </button>
          </section>

          {/* ───── Vorschlag ───── */}
          {suggestion && (
            <section className="suggest-card">
              <b>💡 Vorschlag: Tagesziel {suggestion.title}</b>
              <p>{suggestion.reason}</p>
              <div className="row-btns">
                <button className="btn primary" onClick={() => onDecide(true)}>Übernehmen</button>
                <button className="btn ghost" onClick={() => onDecide(false)}>Nein, danke</button>
              </div>
            </section>
          )}
          {hint && <p className="bf-note warn-note">⚠️ {hint}</p>}

          {/* ───── Ziel ───── */}
          <section className="card-box">
            <div className="goal-head">
              <b>🎯 Zielgewicht</b>
              <span className="goal-input">
                <input inputMode="decimal" value={goal} placeholder="z. B. 85" onChange={(e) => setGoal(e.target.value)} onBlur={() => onGoal(num(goal))} />
                kg
              </span>
            </div>
            {gp ? (
              <>
                <div className="bar big"><div style={{ width: `${gp.pct * 100}%` }} /></div>
                <div className="goal-facts">
                  <span>{Math.round(gp.pct * 100)} % geschafft</span>
                  <span>
                    {gp.remaining > 0 ? `noch ${de(gp.remaining)} kg` : '🎉 Ziel erreicht!'}
                  </span>
                </div>
                {gp.eta && gp.remaining > 0 && (
                  <p className="muted small">
                    Bei {gp.basis === 'trend' ? 'deinem aktuellen Tempo' : 'deinem geplanten Tempo'} erreichst du dein Ziel etwa am <b>{longDate(gp.eta)}</b>.
                  </p>
                )}
              </>
            ) : (
              <p className="muted small">{weighIns.length ? 'Trag ein Zielgewicht ein, um Fortschritt und Prognose zu sehen.' : 'Nach der ersten Messung siehst du hier deinen Fortschritt.'}</p>
            )}
          </section>

          {/* ───── Kennzahlen ───── */}
          {last && (
            <div className="stat-grid">
              <div>
                <span>Gewicht</span>
                <b>{de(last.weight)} kg</b>
                {prev && <small>{signed(last.weight - prev.weight)} kg zur Vorwoche</small>}
                {first && first !== last && <small>{signed(last.weight - first.weight)} kg seit Start</small>}
              </div>
              {last.fat != null && (
                <div>
                  <span>Körperfett</span>
                  <b>{de(last.fat)} %</b>
                  {prev?.fat != null && <small>{signed(last.fat - prev.fat)} %-Pkt. zur Vorwoche</small>}
                  <small>≈ {de((last.weight * last.fat) / 100)} kg Fett</small>
                </div>
              )}
              {last.muscle != null && (
                <div>
                  <span>Muskelmasse</span>
                  <b>{de(last.muscle)} {unit}</b>
                  {prev?.muscle != null && <small>{signed(last.muscle - prev.muscle)} {unit} zur Vorwoche</small>}
                </div>
              )}
              {last.water != null && (
                <div>
                  <span>Körperwasser</span>
                  <b>{de(last.water)} %</b>
                  {prev?.water != null && <small>{signed(last.water - prev.water)} %-Pkt.</small>}
                </div>
              )}
            </div>
          )}

          {/* ───── Verlauf ───── */}
          {weighIns.length > 0 && (
            <>
              <LineChart title="Gewicht" unit="kg" tone="weight" points={weighIns.map((x) => ({ date: x.date, value: x.weight }))} goal={profile.goalWeight} />
              {fatPoints.length > 0 && <LineChart title="Körperfett" unit="%" tone="fat" points={fatPoints} />}

              <h3>Alle Messungen</h3>
              <div className="table-wrap">
                <table className="weigh-table">
                  <thead>
                    <tr>
                      <th>Datum</th>
                      <th>kg</th>
                      <th>Fett %</th>
                      <th>Muskel {unit}</th>
                      <th>Wasser %</th>
                      <th aria-label="Löschen" />
                    </tr>
                  </thead>
                  <tbody>
                    {[...weighIns].reverse().map((x) => (
                      <tr key={x.date}>
                        <td>{shortD(x.date)}</td>
                        <td>{de(x.weight)}</td>
                        <td>{x.fat != null ? de(x.fat) : '–'}</td>
                        <td>{x.muscle != null ? de(x.muscle) : '–'}</td>
                        <td>{x.water != null ? de(x.water) : '–'}</td>
                        <td>
                          <button className="icon-btn tiny" aria-label={`Messung vom ${shortD(x.date)} löschen`} onClick={() => onDelete(x.date)}>
                            🗑
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          <p className="muted small">Körperfettwaagen messen über Strom und schwanken mit dem Wasserhaushalt – auf den Trend über mehrere Wochen achten, nicht auf einzelne Werte.</p>
        </div>
      </div>
    </div>
  )
}
