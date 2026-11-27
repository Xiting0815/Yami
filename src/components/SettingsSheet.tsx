import { useEffect, useRef, useState } from 'react'
import type { LearnedSummary } from '../learning'
import { PREP_ADVERB } from '../breakfast'
import { parseBackup } from '../backup'
import { type AppState, type HaSettings, parseIso } from '../store'
import { HaSection } from './HaSection'

interface Props {
  onClose: () => void
  /** Wochenrückblick öffnen */
  onReview?: () => void
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
  /** gleich zum Home-Assistant-Abschnitt springen */
  focusHa?: boolean
}

/** Einstellungen: Gelerntes, Wochenrückblick, Datensicherung, Home Assistant & Familie */
export function SettingsSheet({ onClose, onReview, learned, portionNote, satietyNote, forgotten = {}, wishes = [], prepWeekday = 0, onResetLearning, lastBackup, onExport, onImport, ha, onHaChange, onHaSyncNow, haSyncing, familyStatus, haMain, learnedOthers = [], focusHa }: Props) {
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

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet profile" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Einstellungen">
        <button className="sheet-close dark" onClick={onClose} aria-label="Schließen">✕</button>
        <div className="sheet-body">
          <h2>⚙️ Einstellungen</h2>
          {onReview && (
            <button className="btn ghost wide review-open" onClick={onReview}>📅 Wochenrückblick ansehen</button>
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
            <p className="muted small">Plan, Vorrat, eigene Rezepte und Gelerntes als Datei sichern – z. B. in Google Drive.</p>
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
        </div>
        <div className="sheet-footer">
          <button className="btn primary wide" onClick={onClose}>Fertig</button>
        </div>
      </div>
    </div>
  )
}
