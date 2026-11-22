import { useEffect, useRef, useState } from 'react'
import type { LearnedSummary } from '../learning'
import { ACTIVITY, DEFAULT_PROFILE, PACE, type Profile, bmr, bmrFormula, floorKcal, leanMass, proteinTarget, targetKcal, tdee, DEFAULT_BREAKFAST_KCAL } from '../energy'
import { PREP_ADVERB } from '../breakfast'
import { parseBackup } from '../backup'
import { type AppState, type HaSettings, parseIso } from '../store'
import { HaSection } from './HaSection'

interface Props {
  profile?: Profile
  onSave: (p: Profile) => void
  onClose: () => void
  /** gelernte Vorlieben */
  learned?: LearnedSummary
  /** gelernter Portionsfaktor als Text (leer = 1,0) */
  portionNote?: string
  /** gelernt aus „bis mittags satt?“ (Frühstück) */
  satietyNote?: string
  /** gelernt beim Löschen im Vorrat: „Vergessen zu kaufen“ (Zutat → Markierung) */
  forgotten?: Record<string, string>
  /** oft in den Vorrat gelegt, aber kaum Rezepte dafür */
  wishes?: { name: string; count: number; recipes: number }[]
  /** gelernter Prep-Wochentag (0 = Sonntag = Standard) */
  prepWeekday?: number
  onResetLearning?: () => void
  /** Datum (ISO) der letzten Sicherung */
  lastBackup?: string
  onExport: () => void
  onImport: (s: AppState) => void
  /** Home Assistant */
  ha?: HaSettings
  onHaChange: (ha: HaSettings | undefined) => void
  onHaSyncNow: () => void
  haSyncing: boolean
  /** Familien-Abgleich (Status, Haupt-Gerät) */
  familyStatus?: string
  haMain?: { person: string; mine: boolean }
  /** gelernte Vorlieben der anderen Personen im Haushalt */
  learnedOthers?: { name: string; learned: LearnedSummary }[]
  /** Profil ist optional (Familie teilen, kein eigenes Kalorienziel nötig) */
  profileOptional?: boolean
  /** gleich zum Home-Assistant-Abschnitt springen */
  focusHa?: boolean
}

const fmt = (n: number) => Math.round(n).toLocaleString('de-DE')

export function ProfileSheet({ profile, onSave, onClose, learned, portionNote, satietyNote, forgotten = {}, wishes = [], prepWeekday = 0, onResetLearning, lastBackup, onExport, onImport, ha, onHaChange, onHaSyncNow, haSyncing, familyStatus, haMain, learnedOthers = [], profileOptional, focusHa }: Props) {
  const [p, setP] = useState<Profile>(profile ?? DEFAULT_PROFILE)
  const fileInput = useRef<HTMLInputElement>(null)
  const [backupError, setBackupError] = useState<string | null>(null)

  async function loadFile(file: File) {
    setBackupError(null)
    let next: AppState
    try {
      next = parseBackup(await file.text())
    } catch (e) {
      setBackupError(e instanceof Error ? e.message : 'Die Sicherung konnte nicht gelesen werden.')
      return
    }
    if (!window.confirm('Aktuelle Daten durch die Sicherung ersetzen?')) return
    onImport(next)
  }
  useEffect(() => {
    if (focusHa) window.setTimeout(() => document.getElementById('ha')?.scrollIntoView({ block: 'start' }), 50)
  }, [focusHa])
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // getippter Text je Feld – sonst ließe sich kein Komma eingeben (die Zahl „91,“ würde sofort wieder zu „91“)
  const [typed, setTyped] = useState<Partial<Record<keyof Profile, string>>>({})
  const num = (k: keyof Profile, min: number, max: number) => ({
    inputMode: 'decimal' as const,
    value: typed[k] ?? String(p[k]).replace('.', ','),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseFloat(e.target.value.replace(',', '.'))
      setTyped({ ...typed, [k]: e.target.value })
      setP({ ...p, [k]: isNaN(v) ? 0 : Math.min(max, Math.max(min, v)) })
    },
  })

  const valid = p.age >= 14 && p.heightCm >= 120 && p.weightKg >= 35
  const target = targetKcal(p)
  const atFloor = tdee(p) - p.deficit + (p.adjust ?? 0) < floorKcal(p)

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet profile" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Profil">
        <button className="sheet-close dark" onClick={onClose} aria-label="Schließen">✕</button>
        <div className="sheet-body">
          <h2>👤 Dein Profil</h2>
          {profileOptional && !profile && <p className="small profile-optional"><b>Optional: eigenes Kalorienziel.</b> Für den gemeinsamen Plan brauchst du kein Profil.</p>}
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

          {p.fatPct != null && (
            <p className="muted small">
              Körperfett aus der letzten Messung: {String(p.fatPct).replace('.', ',')} % → genauere Berechnung über die fettfreie Masse.
            </p>
          )}
          <div className="form-grid one">
            <label>Zielgewicht<input inputMode="decimal" value={typed.goalWeight ?? (p.goalWeight != null ? String(p.goalWeight).replace('.', ',') : '')} placeholder="optional" onChange={(e) => {
              const v = parseFloat(e.target.value.replace(',', '.'))
              setTyped({ ...typed, goalWeight: e.target.value })
              setP({ ...p, goalWeight: !isNaN(v) && v >= 30 && v <= 300 ? v : undefined })
            }} /><span>kg</span></label>
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
              <div>
                <span>
                  {bmrFormula(p) === 'katch'
                    ? `Grundumsatz (Katch-McArdle, ${fmt(leanMass(p)!)} kg fettfreie Masse)`
                    : 'Grundumsatz (Mifflin-St Jeor)'}
                </span>
                <b>{fmt(bmr(p))} kcal</b>
              </div>
              <div><span>× Aktivität {String(p.activity).replace('.', ',')} = Bedarf</span><b>{fmt(tdee(p))} kcal</b></div>
              <div><span>− Defizit</span><b>−{fmt(p.deficit)} kcal</b></div>
              {!!p.adjust && (
                <div>
                  <span>
                    Bestätigte Anpassung{' '}
                    <button className="link small" onClick={() => setP({ ...p, adjust: 0 })}>zurücksetzen</button>
                  </span>
                  <b>{p.adjust > 0 ? '+' : '−'}{fmt(Math.abs(p.adjust))} kcal</b>
                </div>
              )}
              <div className="total"><span>Dein Tagesziel</span><b>{fmt(target)} kcal</b></div>
              <div>
                <span>Eiweißziel (1,6 g × {p.goalWeight != null ? 'Zielgewicht' : 'Gewicht'})</span>
                <b>{fmt(proteinTarget(p))} g pro Tag</b>
              </div>
              <div className="split">
                ☀️ Frühstück ≈ {DEFAULT_BREAKFAST_KCAL} · 🥪 Mittag {fmt(p.lunchKcal)} · 🌙 Abendessen ≈ {fmt(Math.max(0, target - DEFAULT_BREAKFAST_KCAL - p.lunchKcal))} kcal
              </div>
              {atFloor && <p className="bf-note">ℹ️ Begrenzt auf die Mindestmenge von {fmt(floorKcal(p))} kcal – weniger wäre auf Dauer ungesund.</p>}
            </div>
          )}
          {learned && (
            <section className="learned">
              <h3>🧠 Das habe ich gelernt</h3>
              {learned.signals < 5 ? (
                <p className="muted small">Noch zu wenig Daten. Ich lerne aus dem, was du wischst, wirklich kochst und bewertest.</p>
              ) : (
                <>
                  {learned.favorites.length > 0 && (
                    <p><b>Lieblingsgerichte:</b> {learned.favorites.map((f) => f.title).join(' · ')}</p>
                  )}
                  {learned.liked.length > 0 && (
                    <p><b>Magst du:</b> {learned.liked.map((f) => f.label).join(' · ')}</p>
                  )}
                  {learned.disliked.length > 0 && (
                    <p><b>Eher nicht:</b> {learned.disliked.map((f) => f.label).join(' · ')}</p>
                  )}
                  {!learned.favorites.length && !learned.liked.length && !learned.disliked.length && (
                    <p className="muted small">Noch keine klaren Vorlieben erkennbar.</p>
                  )}
                  <p className="muted small">Aus {learned.signals} Signalen; ältere zählen weniger, damit sich dein Geschmack ändern darf.</p>
                </>
              )}
              {learnedOthers.map(({ name, learned: o }) => (
                <div key={name} className="learned-other">
                  <p><b>{name}:</b> {o.signals < 5
                    ? 'noch zu wenig Daten.'
                    : [o.favorites.length ? `liebt ${o.favorites.slice(0, 3).map((f) => f.title).join(', ')}` : '', o.liked.length ? `mag ${o.liked.slice(0, 3).map((f) => f.label).join(', ')}` : '', o.disliked.length ? `eher nicht: ${o.disliked.slice(0, 2).map((f) => f.label).join(', ')}` : ''].filter(Boolean).join(' · ') || 'noch keine klaren Vorlieben.'}</p>
                </div>
              ))}
              {learnedOthers.length > 0 && <p className="muted small">Vorschläge berücksichtigen euch alle: was eine Person gar nicht mag, rutscht nach hinten.</p>}
              {portionNote && <p><b>Portionen:</b> {portionNote}.</p>}
              {satietyNote && <p><b>Frühstück:</b> {satietyNote}.</p>}
              {Object.keys(forgotten).length > 0 && (
                <p><b>Oft vergessen:</b> {Object.keys(forgotten).sort((a, b) => a.localeCompare(b, 'de')).join(', ')} – steht auf der Einkaufsliste und in Google Tasks mit ⚠️ vorne in der Abteilung.</p>
              )}
              {wishes.map((w) => (
                <p key={w.name}>
                  <b>Vorrat:</b> Du hast oft {w.name} im Vorrat – dafür gibt es noch {w.recipes === 0 ? 'keine' : 'kaum'} Rezepte.
                </p>
              ))}
              {prepWeekday > 0 && <p><b>Meal-Prep:</b> Du bereitest meist {PREP_ADVERB[prepWeekday]} vor.</p>}
              {onResetLearning && learned.signals > 0 && (
                <button className="link small" onClick={onResetLearning}>Gelerntes zurücksetzen</button>
              )}
            </section>
          )}

          <section className="backup">
            <h3>💾 Datensicherung</h3>
            <p className="muted small">Plan, Vorrat, Messungen und Gelerntes als Datei sichern – z. B. in Google Drive.</p>
            <p className="small">Letzte Sicherung: <b>{lastBackup ? parseIso(lastBackup).toLocaleDateString('de-DE') : 'noch nie'}</b></p>
            <div className="backup-actions">
              <button className="btn primary" onClick={onExport}>Sicherung speichern</button>
              <button className="btn ghost" onClick={() => fileInput.current?.click()}>Sicherung laden</button>
            </div>
            <input
              ref={fileInput}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0]
                e.target.value = '' // gleiche Datei danach wieder wählbar
                if (file) void loadFile(file)
              }}
            />
            {backupError && <p className="bf-note" role="alert">⚠ {backupError}</p>}
          </section>

          <HaSection ha={ha} onChange={onHaChange} onSyncNow={onHaSyncNow} syncing={haSyncing} familyStatus={familyStatus} main={haMain} />

          <p className="muted small">
            Richtwerte, keine ärztliche Beratung. Bei Vorerkrankungen das Ziel bitte mit dem Hausarzt abstimmen.
          </p>
        </div>
        <div className="sheet-footer">
          {profileOptional && !profile ? (
            <>
              <button className="btn ghost" disabled={!valid} onClick={() => onSave(p)}>Kalorienziel speichern</button>
              <button className="btn primary wide" onClick={onClose}>Schließen</button>
            </>
          ) : (
            <button className="btn primary wide" disabled={!valid} onClick={() => onSave(p)}>
              Speichern
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
