import { useEffect, useState } from 'react'
import type { BakeEntry, Recipe } from '../types'
import { isBbq, replacesDinner } from '../types'
import { doneWord, planWord } from '../bbq'
import { yieldText } from '../bake'
import { shortDate, weekdayName } from '../store'
import { Icon } from './Icon'
import { RecipeImage } from './RecipeImage'
import { BakeDays } from './BakeDays'
import type { DayNote } from './DayPicker'

interface Props {
  day: string
  entry: BakeEntry
  recipe: Recipe
  today: string
  /** Tage, an denen dieses Rezept schon eingeplant ist (ohne Status) */
  plannedDays: string[]
  /** gleich den Tag zum Verschieben wählen (aus der Frage „Gebacken?“) */
  startMove?: boolean
  /** offenes Abendessen eines Tages (ein verschobener Grillabend ersetzt es) */
  dinnerOn?: (day: string) => string | undefined
  /** was an jedem Tag schon geplant ist */
  dayNote?: (day: string) => DayNote
  onClose: () => void
  onAmount: (n: number) => void
  onView: () => void
  onBaked: () => void
  onMove: (to: string) => void
  onRemove: () => void
}

/** Antippen von „🍰 Backen: …“ in der Wochenansicht: Ansehen, Verschieben, Entfernen (und „Gebacken“) */
export function BakeSheet({ day, entry, recipe, today, plannedDays, startMove, dinnerOn, dayNote, onClose, onAmount, onView, onBaked, onMove, onRemove }: Props) {
  const [moving, setMoving] = useState(!!startMove)
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', h)
      document.body.style.overflow = ''
    }
  }, [onClose])
  const open = !entry.status
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet actions" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={`${planWord(recipe)}: ${recipe.title}`}>
        <div className="act-head">
          <RecipeImage recipe={recipe} className="thumb" />
          <div className="act-head-text">
            <b>{recipe.title}</b>
            <small>
              {planWord(recipe)} · {weekdayName(day, true)} {shortDate(day)}{entry.status === 'baked' ? ` · ✓ ${doneWord(recipe)}` : ''}
              {isBbq(recipe) ? ` · ca. ${(recipe.portions ?? 2) * entry.amount} Portionen` : ''}
              {recipe.yields ? ` · ${isBbq(recipe) ? 'Rest' : 'ergibt'} ${yieldText(recipe, entry.amount * recipe.servings)}` : ''}
            </small>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Schließen"><Icon name="close" size={18} /></button>
        </div>

        {open && (
          <div className="act-row static">
            <span className="act-label">
              Rezeptmenge
              <small>Für die Einkaufsliste.</small>
            </span>
            <div className="stepper">
              <button onClick={() => onAmount(Math.max(1, entry.amount - 1))} aria-label="weniger">−</button>
              <b>{entry.amount}</b>
              <button onClick={() => onAmount(Math.min(12, entry.amount + 1))} aria-label="mehr">+</button>
            </div>
          </div>
        )}
        <button className="act-row" onClick={onView}><Icon name="book" /> Rezept ansehen</button>
        {open && (
          <button className="act-row" onClick={onBaked}><Icon name="check" /> Ja, {doneWord(recipe)} – {recipe.yields ? 'Vorrat buchen' : 'Zutaten abziehen'}</button>
        )}
        {open && (
          <button className="act-row" aria-expanded={moving} onClick={() => setMoving((m) => !m)}><Icon name="calendar" /> Auf einen anderen Tag verschieben</button>
        )}
        {open && moving && <BakeDays today={today} current={day} marked={(d) => plannedDays.includes(d)} note={dayNote} replaces={replacesDinner(recipe) ? dinnerOn : undefined} onPick={onMove} />}
        <button className="act-row danger" onClick={onRemove}><Icon name="trash" /> Aus dem Plan entfernen</button>
      </div>
    </div>
  )
}
