import type { BakeSuggestion } from '../bakePlan'
import { weekdayLabel } from '../bakePlan'
import type { Recipe } from '../types'
import { doneWord, type BbqIdeas } from '../bbq'
import { Icon } from './Icon'

/** „Hast du den Bienenstich gebacken?“ – am Tag nach dem geplanten Backen, bis beantwortet */
export function BakeAskCard({ recipe, day, onYes, onMove, onNo }: { recipe: Recipe; day: string; onYes: () => void; onMove: () => void; onNo: () => void }) {
  return (
    <section className="rate-card bake-ask" aria-label="Backen nachfragen">
      <div className="rate-head">
        <span>
          Hast du <b>{recipe.title}</b> {doneWord(recipe)}? <small className="muted">(geplant für {weekdayLabel(day)}, {day.slice(8)}.{day.slice(5, 7)}.)</small>
        </span>
      </div>
      <div className="rate-btns">
        <button onClick={onYes}><span aria-hidden>✅</span> Ja</button>
        <button onClick={onMove}><span aria-hidden>📅</span> Verschieben</button>
        <button onClick={onNo}><span aria-hidden>🗑️</span> Nein, entfernen</button>
      </div>
    </section>
  )
}

/** sanfter Vorschlag zum Backen (höchstens einer, wegklickbar) */
export function BakeHintCard({ s, onAccept, onDismiss }: { s: BakeSuggestion; onAccept: () => void; onDismiss: () => void }) {
  return (
    <div className="notice bake-hint" role="status">
      <span className="notice-icon" aria-hidden>🍰</span>
      <span className="notice-text">{s.text}</span>
      <button className="link small" onClick={onAccept}>Einplanen</button>
      <button className="sync-x" aria-label="Vorschlag schließen" onClick={onDismiss}><Icon name="close" size={16} /></button>
    </div>
  )
}

/**
 * „BBQ-Wetter? Ideen für Samstag“ – dezent, nur März–September, höchstens eine Karte; Antippen öffnet das Rezept
 * (dort „Einplanen für“), ✕ ruht die Karte (gelernt, wie Backvorschläge).
 */
export function BbqIdeasCard({ ideas, onOpen, onDismiss }: { ideas: BbqIdeas; onOpen: (r: Recipe) => void; onDismiss: () => void }) {
  return (
    <div className="notice bake-hint bbq-ideas" role="status">
      <span className="notice-icon" aria-hidden>🔥</span>
      <span className="notice-text">
        {ideas.text}:{' '}
        {ideas.recipes.map((r, i) => (
          <span key={r.id}>
            {i > 0 && ' · '}
            <button className="link small" onClick={() => onOpen(r)}>{r.title}</button>
          </span>
        ))}
      </span>
      <button className="sync-x" aria-label="BBQ-Ideen schließen" onClick={onDismiss}><Icon name="close" size={16} /></button>
    </div>
  )
}
