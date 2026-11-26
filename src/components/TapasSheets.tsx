import { useEffect, useState } from 'react'
import type { BakeEntry, Recipe } from '../types'
import { TAPAS_GROUP_ICON } from '../types'
import { TAPAS_MIN, eveningKcal, eveningProtein, shortTitle } from '../tapas'
import { tapasFactorFor } from '../bakePlan'
import { shortDate, weekdayName } from '../store'
import { BakeDays } from './BakeDays'
import { Icon } from './Icon'
import { RecipeImage } from './RecipeImage'

function useSheetKeys(onClose: () => void) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', h)
      document.body.style.overflow = ''
    }
  }, [onClose])
}

const factorText = (n: number) => {
  const f = tapasFactorFor(n)
  return f === 1 ? 'je ein Teller für 2' : `je ×${String(f).replace('.', ',')} (für ${n} Tapas angepasst)`
}

/**
 * „Tapas-Abend planen“: Auswahl prüfen, Tag wählen. „Ersetzt das Abendessen“ ist vorgewählt (wie beim BBQ); die Zutaten
 * aller Tapas kommen zusammen auf die Einkaufsliste, im Kalender steht ein Termin „🍽️ 🫒 Tapas-Abend: …“.
 */
export function TapasPlanSheet({ picks, today, plannedDays, dinnerOn, onRemove, onPlan, onClose }: {
  picks: Recipe[]
  today: string
  /** Tage, an denen schon ein Tapas-Abend geplant ist */
  plannedDays: string[]
  /** geplantes Abendessen eines Tages (Titel), das ersetzt würde */
  dinnerOn: (day: string) => string | undefined
  onRemove: (id: string) => void
  onPlan: (day: string, replace: boolean) => void
  onClose: () => void
}) {
  useSheetKeys(onClose)
  const [replace, setReplace] = useState(true)
  const n = picks.length
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet actions tapas-plan" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Tapas-Abend planen">
        <div className="act-head">
          <span className="tapas-head-icon" aria-hidden>🫒</span>
          <div className="act-head-text">
            <b>Tapas-Abend planen</b>
            <small>
              {n} Tapas · ≈ {eveningKcal(picks).toLocaleString('de-DE')} kcal · {eveningProtein(picks)} g Eiweiß p. P. · {factorText(n)}
            </small>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Schließen"><Icon name="close" size={18} /></button>
        </div>
        <ul className="tapas-pick-list">
          {picks.map((r) => (
            <li key={r.id}>
              <span>{TAPAS_GROUP_ICON[r.tapas!]} {shortTitle(r.title)}</span>
              <button className="icon-btn" onClick={() => onRemove(r.id)} aria-label={`${shortTitle(r.title)} entfernen`}><Icon name="close" size={16} /></button>
            </li>
          ))}
        </ul>
        {n < 4 && <p className="muted small">Tipp: 4–6 Tapas sind ideal – je eine mit Fisch, Fleisch, Gemüse, Ei/Kartoffel und Brot/Dip.</p>}
        <label className="small bbq-replace">
          <input type="checkbox" checked={replace} onChange={(e) => setReplace(e.target.checked)} /> Ersetzt das Abendessen an dem Tag (geplantes Gericht wird gestrichen)
        </label>
        <div className="bake-plan-head"><b>Für welchen Tag?</b><span className="muted small">Zutaten kommen auf die Einkaufsliste, der Abend in den Kalender</span></div>
        {n >= TAPAS_MIN ? (
          <BakeDays today={today} marked={(d) => plannedDays.includes(d)} onPick={(d) => onPlan(d, replace && !!dinnerOn(d))} />
        ) : (
          <p className="muted small">Bitte mindestens {TAPAS_MIN} Tapas auswählen.</p>
        )}
      </div>
    </div>
  )
}

/** Antippen von „🫒 Tapas-Abend“ in der Woche: Kochmodus, Tapas ansehen, alles gemacht, verschieben, entfernen */
export function TapasEveningSheet({ day, today, entries, plannedDays, startMove, onCook, onView, onDone, onMove, onRemove, onClose }: {
  day: string
  today: string
  entries: { entry: BakeEntry; recipe: Recipe }[]
  plannedDays: string[]
  startMove?: boolean
  onCook: () => void
  onView: (r: Recipe) => void
  onDone: () => void
  onMove: (to: string) => void
  onRemove: () => void
  onClose: () => void
}) {
  useSheetKeys(onClose)
  const [moving, setMoving] = useState(!!startMove)
  const recipes = entries.map((x) => x.recipe)
  const open = entries.some((x) => !x.entry.status)
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet actions" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={`Tapas-Abend ${weekdayName(day)}`}>
        <div className="act-head">
          <span className="tapas-head-icon" aria-hidden>🫒</span>
          <div className="act-head-text">
            <b>Tapas-Abend · {weekdayName(day, true)} {shortDate(day)}</b>
            <small>{recipes.length} Tapas · ≈ {eveningKcal(recipes).toLocaleString('de-DE')} kcal p. P. · statt Abendessen</small>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Schließen"><Icon name="close" size={18} /></button>
        </div>
        <button className="act-row" onClick={onCook}><Icon name="pot" /> Kochmodus Tapas-Abend (Ablaufplan)</button>
        {entries.map(({ entry, recipe }) => (
          <button key={recipe.id} className="act-row" onClick={() => onView(recipe)}>
            <RecipeImage recipe={recipe} className="thumb tapas-thumb" />
            <span className="act-label">
              {entry.status === 'baked' ? '✓ ' : ''}{shortTitle(recipe.title)}
              <small>{recipe.time} Min. · {recipe.serve === 'kalt' ? 'kalt' : recipe.serve === 'lauwarm' ? 'lauwarm' : 'heiß'}</small>
            </span>
          </button>
        ))}
        {open && <button className="act-row" onClick={onDone}><Icon name="check" /> Ja, alles gemacht – Zutaten abziehen</button>}
        {open && <button className="act-row" aria-expanded={moving} onClick={() => setMoving((m) => !m)}><Icon name="calendar" /> Auf einen anderen Tag verschieben</button>}
        {open && moving && <BakeDays today={today} current={day} marked={(d) => plannedDays.includes(d)} onPick={onMove} />}
        <button className="act-row danger" onClick={onRemove}><Icon name="trash" /> Tapas-Abend entfernen</button>
      </div>
    </div>
  )
}
