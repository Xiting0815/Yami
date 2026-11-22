import { useEffect, useState } from 'react'
import type { Recipe } from '../types'
import { BREAKFAST_LABEL, CUISINE_LABEL, KIND_ICON, KIND_LABEL, TYPE_LABEL, isBake } from '../types'
import { pieceName, shelfText, yieldText } from '../bake'
import { yieldStock } from '../data/define'
import { NutritionTable } from './NutritionRow'
import { formatTime } from '../filter'
import { formatAmount, scale } from '../shopping'
import { RecipeImage } from './RecipeImage'
import imageMap from '../data/images.json'
import { type Insight, type PriceOverrides, formatEuro, recipeCost } from '../kitchen'
import { InsightBadges } from './SwipeDeck'
import type { Portion } from '../energy'
import { CookMode, type CookFinish } from './CookMode'
import { DeviceChips } from './DeviceChip'
import { basicFor } from '../data/recipes'
import { BakeDays } from './BakeDays'

/** kurze Erklärung für Zutaten, die man leicht verwechselt */
const INGREDIENT_HINT: Record<string, string> = {
  Eiklar: 'flüssiges Eiweiß aus der Flasche (Kühlregal) – 100 g ≈ das Weiße von 3 Eiern',
  Eigelb: 'nur das Gelbe vom Ei',
}

type Credit = { author: string; license: string; source: string } | null | undefined
const credits = imageMap as unknown as Record<string, Credit>

interface Props {
  recipe: Recipe
  servings: number
  onClose: () => void
  /** Hauptaktion, z. B. "Für Montag nehmen" */
  action?: { label: string; onClick: (servings: number) => void }
  insight?: Insight
  prices: PriceOverrides
  /** deine Portion (Abendessen, mit Profil) */
  portion?: Portion & { budget: number; /** gelernt: „ihr braucht eher etwas mehr (+10 %)“ */ household?: string }
  /** Kochmodus offen – App zählt ihn als Zurück-Ebene */
  cooking: boolean
  /** „Fertig gekocht“ im Kochmodus */
  onFinish?: CookFinish
  onCooking: (on: boolean) => void
  /** nur bei eigenen Rezepten */
  onEdit?: () => void
  onDelete?: () => void
  /** anderes Rezept öffnen (Tipp „Fond selbst kochen“ → Grundrezept) */
  onOpenRecipe?: (r: Recipe) => void
  /** klassische Schritte statt Geräte-Schritte zeigen (gemerkt) */
  showClassic?: boolean
  onShowClassic?: (v: boolean) => void
  /** Backen & Desserts / Grundrezepte: „Einplanen für“ – Tag wählen legt das Rezept (mit der gewählten Rezeptmenge) in den Backplan */
  bakePlanner?: { today: string; plannedDays: string[]; onPlan: (day: string, amount: number) => void }
}

export function RecipeSheet({ recipe, servings: initial, onClose, action, insight, prices, portion, cooking, onFinish, onCooking, onEdit, onDelete, onOpenRecipe, showClassic, onShowClassic, bakePlanner }: Props) {
  const [servings, setServings] = useState(initial)
  const credit = credits[recipe.id]
  const hasDevice = !!recipe.deviceSteps && !!recipe.classicSteps
  const classic = hasDevice && !!showClassic
  const isBasic = !!recipe.basic && !!recipe.yields
  const bake = isBake(recipe) && !!recipe.yields
  // Grundrezepte/Gebackenes, die eine Zutat dieses Rezepts selbst herstellen (Rinderfond → Brauner Rinderfond,
  // Anstellgut → Sauerteig ansetzen, Vollkornbrot → selbstgebackenes Brot)
  const basicTips = [...new Map(recipe.ingredients.map((i) => basicFor(i.name)).filter((b): b is Recipe => !!b && b.id !== recipe.id).map((b) => [b.id, b])).values()]
  const y = recipe.yields
  const piece = y && recipe.basic ? pieceName(yieldStock(recipe.kind, y).unit) : ''

  useEffect(() => {
    // Escape schließt zuerst den Kochmodus (dort), nicht das Sheet
    const h = (e: KeyboardEvent) => e.key === 'Escape' && !cooking && onClose()
    window.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', h)
      document.body.style.overflow = ''
    }
  }, [onClose, cooking])

  return (
    <>
    <div className="sheet-backdrop" onClick={onClose}>
        <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={recipe.title}>
          <button className="sheet-close" onClick={onClose} aria-label="Schließen">✕</button>
          <div className="sheet-hero">
            <RecipeImage recipe={recipe} className="sheet-img" />
          </div>
          <div className="sheet-body">
            <div className="card-tags dark">
              {isBasic ? (
                <span>{KIND_ICON[recipe.kind ?? 'grundrezept']} {recipe.kind && recipe.kind !== 'grundrezept' ? KIND_LABEL[recipe.kind] : 'Grundrezept'}</span>
              ) : recipe.breakfast ? (
                <>
                  <span>☀️ Frühstück</span>
                  <span>{BREAKFAST_LABEL[recipe.breakfast.type]}</span>
                </>
              ) : (
                <>
                  <span>{CUISINE_LABEL[recipe.cuisine]}</span>
                  <span>{TYPE_LABEL[recipe.type]}</span>
                  {recipe.vegetarian && <span>🌱 Veggie</span>}
                </>
              )}
              <span>⏱ {formatTime(recipe.time)}</span>
              {recipe.custom && <span>✏️ Eigenes</span>}
            </div>
            <h2>{recipe.title}</h2>
            {insight && <div className="sheet-badges"><InsightBadges ins={insight} /></div>}

            <div className="servings">
              <span>{bake ? 'Rezeptmenge' : isBasic ? 'Ansätze' : 'Portionen'}</span>
              <div className="stepper">
                <button onClick={() => setServings((s) => Math.max(1, s - 1))} aria-label="weniger">−</button>
                <b>{servings}</b>
                <button onClick={() => setServings((s) => Math.min(12, s + 1))} aria-label="mehr">+</button>
              </div>
            </div>

            {isBasic && bakePlanner && (
              <div className="bake-plan">
                <div className="bake-plan-head">
                  <b>Einplanen für</b>
                  <span className="muted small">Zutaten kommen auf die Einkaufsliste</span>
                </div>
                <BakeDays today={bakePlanner.today} marked={(d) => bakePlanner.plannedDays.includes(d)} onPick={(d) => bakePlanner.onPlan(d, servings)} />
              </div>
            )}

            {recipe.breakfast && (
              <p className="muted small bf-portion-hint">
                1 Portion = 1 Frühstück ({recipe.breakfast.container}). Vorbelegt mit deinen Frühstückstagen dieser Woche – „Fertig vorbereitet“ am Ende des Kochmodus legt sie in den Vorrat.
              </p>
            )}

            {bake ? (
              <div className="prep-facts bake-facts">
                <div>{KIND_ICON[recipe.kind!]} Ergibt <b>{yieldText(recipe, servings)}</b> · hält <b>{shelfText(y!.shelf)}</b>{y!.store ? ` ${y!.store}` : ''}</div>
                {y!.frozen ? <div>❄️ Eingefroren ca. {shelfText(y!.frozen)} haltbar</div> : null}
                {y!.perPiece && (
                  <div>🔥 Pro {piece}: <b>{y!.perPiece.kcal.toLocaleString('de-DE')} kcal</b> · {String(y!.perPiece.protein).replace('.', ',')} g Eiweiß</div>
                )}
                {recipe.lighter && <div className="lighter">💡 <b>Leichter:</b> {recipe.lighter}</div>}
                <div className="muted small">✓ „{recipe.kind === 'dessert' ? 'Fertig' : 'Fertig gebacken'}“ im Kochmodus legt alles in den Vorrat. Dort „1 gegessen“ tippen – das Stück zählt in die Tagesbilanz.</div>
              </div>
            ) : isBasic ? (
              <div className="prep-facts">
                <div>🫙 Ergibt <b>{yieldText(recipe, servings)} {y!.name}</b></div>
                <div>
                  {y!.shelf >= 60 ? `❄️ Portionsweise eingefroren ca. ${shelfText(y!.shelf)} haltbar` : `🧊 Hält ${shelfText(y!.shelf)}${y!.store ? ` ${y!.store}` : ''}`}
                </div>
                <div>✓ „Fertig gekocht“ im Kochmodus legt es in den Vorrat – Rezepte damit nehmen dann zuerst das Selbstgemachte.</div>
              </div>
            ) : (
              <NutritionTable n={recipe.nutrition} servings={1} />
            )}

            {portion && (
              <div className={`portion-box ${portion.fraction < 1 ? 'smaller' : ''}`}>
                <div>
                  🍽️ <b>Deine Portion: {portion.label}</b> · {portion.kcal.toLocaleString('de-DE')} kcal
                </div>
                <div className="muted small">
                  Abendbudget heute ≈ {portion.budget.toLocaleString('de-DE')} kcal (Tagesziel − Frühstück − Mittag). Eine normale Portion hat {recipe.nutrition.kcal.toLocaleString('de-DE')} kcal.
                  {portion.rest > 0.05 &&
                    (() => {
                      const r = Math.round(portion.rest * 4) / 4
                      return ` Übrig für die anderen: ca. ${String(r).replace('.', ',')} ${r === 1 ? 'Portion' : 'Portionen'}.`
                    })()}
                </div>
                {portion.tip && <div className="small">🥗 {portion.tip}</div>}
                {portion.household && <div className="muted small">👥 Erfahrungsgemäß: {portion.household}. Fürs Einkaufen rechne ich damit.</div>}
              </div>
            )}

            {recipe.breakfast && (
              <div className="prep-facts">
                <div>🧊 Hält <b>{recipe.breakfast.fridgeDays} Tage</b> im Kühlschrank</div>
                <div>{recipe.breakfast.freezer ? '❄️ Lässt sich portionsweise einfrieren' : '🚫 Nicht zum Einfrieren geeignet'}</div>
                <div>🫙 Pro Portion: 1 {recipe.breakfast.container}</div>
              </div>
            )}

            <p className="muted small cost-line">
              {isBasic
                ? `Warenwert ≈ ${formatEuro(recipeCost(recipe, servings, prices))} für ${yieldText(recipe, servings)} (ohne Gewürze und Grundzutaten)`
                : `Warenwert ≈ ${formatEuro(recipeCost(recipe, servings, prices))} · ${formatEuro(recipeCost(recipe, servings, prices) / servings)} pro Portion (ohne Gewürze)`}
            </p>

            <button className="btn ghost wide cook-start" onClick={() => onCooking(true)}>
              👩‍🍳 Kochmodus starten
            </button>

            <h3>Zutaten</h3>
            <ul className="ingredients">
              {recipe.ingredients.map((ing, i) => (
                <li key={i}>
                  <span className="amt">{formatAmount(scale(ing, recipe.servings, servings), ing.unit, !!recipe.kind && recipe.kind !== 'grundrezept') || 'n. B.'}</span>
                  <span>
                    {ing.name}
                    {INGREDIENT_HINT[ing.name] && <small className="ing-hint">{INGREDIENT_HINT[ing.name]}</small>}
                  </span>
                </li>
              ))}
            </ul>

            {basicTips.map((b) => (
              <button key={b.id} className="basic-tip small" onClick={() => onOpenRecipe?.(b)}>
                {b.kind === 'brot'
                  ? <>🍞 Tipp: Brot selbst backen – <u>{b.title}</u></>
                  : isBake(b)
                    ? <>💡 Tipp: selbst gemacht – <u>{b.title}</u></>
                    : b.yields && /fond/i.test(b.yields.name)
                      ? <>💡 Tipp: mit selbstgemachtem Fond (Grundrezept) noch besser – <u>{b.title}</u></>
                      : <>💡 Grundrezept dazu – <u>{b.title}</u></>}
              </button>
            ))}

            <h3>{recipe.breakfast ? 'Vorbereitung (am Prep-Tag)' : 'Zubereitung'}</h3>
            {hasDevice && (
              <p className="dev-toggle muted small">
                <span>{classic ? 'Klassische Schritte' : 'Für deine Geräte angepasst'}</span>
                <button onClick={() => onShowClassic?.(!classic)}>{classic ? 'Für meine Geräte anzeigen' : 'Klassisch anzeigen'}</button>
              </p>
            )}
            <ol className="steps">
              {classic
                ? recipe.classicSteps!.map((s, i) => <li key={i}>{s}</li>)
                : recipe.steps.map((s, i) => (
                    <li key={i}>
                      {s}
                      <DeviceChips settings={recipe.deviceSteps?.[i]?.settings} />
                    </li>
                  ))}
            </ol>

            {recipe.breakfast && (
              <>
                <h3>Morgens / auf der Arbeit</h3>
                <p className="morning">☀️ {recipe.breakfast.morning}</p>
              </>
            )}

            {recipe.custom && (
              <div className="own-actions">
                <button className="btn ghost" onClick={onEdit}>✏️ Bearbeiten</button>
                <button className="btn ghost danger" onClick={onDelete}>🗑️ Löschen</button>
              </div>
            )}

            {credit && credit.license === 'KI' && <p className="credit">Bild: KI-generiert ({credit.author})</p>}
            {credit && credit.license !== 'KI' && (
              <p className="credit">
                Foto: {credit.author} ·{' '}
                <a href={credit.source} target="_blank" rel="noreferrer">
                  {credit.license}, Wikimedia Commons
                </a>
              </p>
            )}
          </div>
          {action && (
            <div className="sheet-footer">
              <button className="btn primary wide" onClick={() => action.onClick(servings)}>
                {action.label}
              </button>
            </div>
          )}
        </div>
      </div>
      {cooking && <CookMode recipe={recipe} servings={servings} finish={onFinish} onClose={() => onCooking(false)} />}
    </>
  )
}
