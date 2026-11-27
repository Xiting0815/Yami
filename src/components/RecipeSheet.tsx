import { useEffect, useState } from 'react'
import type { Recipe } from '../types'
import { BBQ_GROUP_LABEL, BREAKFAST_LABEL, CUISINE_LABEL, KIND_ICON, KIND_LABEL, SALAT_GROUP_LABEL, TAPAS_GROUP_LABEL, TYPE_LABEL, isBake, isBbq, isSalat, isStockDish, isTapa, replacesDinner } from '../types'
import { leftoverText } from '../bbq'
import { shelfText, yieldText } from '../bake'
import { formatTime } from '../filter'
import { formatAmount, scale } from '../shopping'
import { RecipeImage } from './RecipeImage'
import imageMap from '../data/images.json'
import { type Insight, type PriceOverrides, formatEuro, recipeCost } from '../kitchen'
import { InsightBadges } from './SwipeDeck'
import type { CookFinish } from './CookMode'
import { lazyNamed } from '../app/lazy'

// Kochmodus erst beim Start des Kochens laden
const CookMode = lazyNamed(() => import('./CookMode').then((m) => m.CookMode))
import { DeviceChips } from './DeviceChip'
import { basicFor } from '../data/recipes'
import { BakeDays } from './BakeDays'
import type { DayNote } from './DayPicker'

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
  /** gelernt aus der Portions-Rückmeldung: „ihr braucht eher etwas mehr (+10 %)“ (nur Abendessen) */
  householdNote?: string
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
  /**
   * Backen & Desserts / Grundrezepte / BBQ: „Einplanen für“ – Tag wählen legt das Rezept (mit der gewählten Rezeptmenge) in den Backplan.
   * BBQ: `replace` = das geplante Abendessen des Tages streichen (BBQ ersetzt es); `dinnerOn` nennt es für die Frage.
   */
  bakePlanner?: { today: string; plannedDays: string[]; onPlan: (day: string, amount: number, replace?: boolean) => void; dinnerOn?: (day: string) => string | undefined; dayNote?: (day: string) => DayNote }
}

export function RecipeSheet({ recipe, servings: initial, onClose, action, insight, prices, householdNote, cooking, onFinish, onCooking, onEdit, onDelete, onOpenRecipe, showClassic, onShowClassic, bakePlanner }: Props) {
  const [servings, setServings] = useState(initial)
  const credit = credits[recipe.id]
  const hasDevice = !!recipe.deviceSteps && !!recipe.classicSteps
  const classic = hasDevice && !!showClassic
  const isBasic = !!recipe.basic && !!recipe.yields
  const bbq = isBbq(recipe)
  const bake = isStockDish(recipe) && !!recipe.yields
  const tapa = isTapa(recipe)
  const salat = isSalat(recipe)
  // ersetzt das Abendessen (Grillabend) – BBQ-Beilagen und Salate sind Zusatz
  const replaces = replacesDinner(recipe)
  // BBQ ersetzt meist das Abendessen des Tages – vorgewählt, abwählbar
  const [replaceDinner, setReplaceDinner] = useState(true)
  // Grundrezepte/Gebackenes, die eine Zutat dieses Rezepts selbst herstellen (Rinderfond → Brauner Rinderfond,
  // Anstellgut → Sauerteig ansetzen, Vollkornbrot → selbstgebackenes Brot)
  const basicTips = [...new Map(recipe.ingredients.map((i) => basicFor(i.name)).filter((b): b is Recipe => !!b && b.id !== recipe.id).map((b) => [b.id, b])).values()]
  const y = recipe.yields

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
              {bbq ? (
                <span>{KIND_ICON.bbq} BBQ{recipe.bbq ? ` · ${BBQ_GROUP_LABEL[recipe.bbq]}` : ''}</span>
              ) : tapa ? (
                <>
                  <span>{KIND_ICON.tapas} Tapas{recipe.tapas ? ` · ${TAPAS_GROUP_LABEL[recipe.tapas]}` : ''}</span>
                  {recipe.vegetarian && <span>🌱 Veggie</span>}
                </>
              ) : salat ? (
                <>
                  <span>{KIND_ICON.salat} {recipe.salat ? SALAT_GROUP_LABEL[recipe.salat] : KIND_LABEL.salat}</span>
                  <span>{CUISINE_LABEL[recipe.cuisine]}</span>
                </>
              ) : isBasic ? (
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
              <span>{tapa ? 'Teller (für 2)' : bake || bbq ? 'Rezeptmenge' : isBasic ? 'Ansätze' : 'Portionen'}</span>
              <div className="stepper">
                <button onClick={() => setServings((s) => Math.max(1, s - 1))} aria-label="weniger">−</button>
                <b>{servings}</b>
                <button onClick={() => setServings((s) => Math.min(12, s + 1))} aria-label="mehr">+</button>
              </div>
            </div>

            {(isBasic || bbq) && bakePlanner && (
              <div className="bake-plan">
                <div className="bake-plan-head">
                  <b>Einplanen für</b>
                  <span className="muted small">Zutaten kommen auf die Einkaufsliste{replaces ? ', der Tag in den Kalender' : salat || bbq ? ' – als Zusatz zum Abendessen' : ''}</span>
                </div>
                {replaces && (
                  <label className="small bbq-replace">
                    <input type="checkbox" checked={replaceDinner} onChange={(e) => setReplaceDinner(e.target.checked)} /> Ersetzt das Abendessen an dem Tag (geplantes Gericht wird gestrichen)
                  </label>
                )}
                <BakeDays
                  today={bakePlanner.today}
                  marked={(d) => bakePlanner.plannedDays.includes(d)}
                  onPick={(d) => bakePlanner.onPlan(d, servings, replaces && replaceDinner && !!bakePlanner.dinnerOn?.(d))}
                  note={bakePlanner.dayNote}
                  replaces={replaces && replaceDinner ? bakePlanner.dinnerOn : undefined}
                />
              </div>
            )}

            {recipe.breakfast && (
              <p className="muted small bf-portion-hint">
                1 Portion = 1 Frühstück ({recipe.breakfast.container}). Vorbelegt mit deinen Frühstückstagen dieser Woche – „Fertig vorbereitet“ am Ende des Kochmodus legt sie in den Vorrat.
              </p>
            )}

            {tapa ? (
              <div className="prep-facts bake-facts">
                <div>{KIND_ICON.tapas} Ein Teller für 2 – als eine von ca. 5 Tapas</div>
                <div>🍽️ Kommt {recipe.serve === 'kalt' ? 'kalt' : recipe.serve === 'lauwarm' ? 'lauwarm' : 'heiß, ganz zum Schluss'} auf den Tisch{recipe.ahead ? ` · Vorher: ${recipe.ahead}` : ''}</div>
                <div className="muted small">Tapas planst du zusammen: im Rezepte-Tab „🫒 Tapas“ 4–6 auswählen → „Planen“. Die Mengen passt Gusto an die Zahl der Tapas an.</div>
              </div>
            ) : bbq ? (
              <div className="prep-facts bake-facts">
                <div>{KIND_ICON.bbq} Ladung für ca. <b>{(recipe.portions ?? 2) * servings} Portionen</b></div>
                {y && <div>❄️ Rest: <b>{leftoverText(recipe, servings)}</b> · hält ca. {shelfText(y.shelf)} – Gusto schlägt dann Resteessen vor</div>}
                <div className="muted small">✓ „Fertig gegrillt“ im Kochmodus zieht die Zutaten ab{y ? ' und legt den Rest in den Vorrat' : ''}.</div>
              </div>
            ) : bake ? (
              <div className="prep-facts bake-facts">
                <div>{KIND_ICON[recipe.kind!]} Ergibt <b>{yieldText(recipe, servings)}</b> · hält <b>{shelfText(y!.shelf)}</b>{y!.store ? ` ${y!.store}` : ''}</div>
                {y!.frozen ? <div>❄️ Eingefroren ca. {shelfText(y!.frozen)} haltbar</div> : null}
                <div className="muted small">
                  {salat
                    ? '✓ „Fertig“ im Kochmodus legt alle Portionen in den Vorrat (Kühlschrank). Dort „1 Portion gegessen“ tippen – so weiß Gusto, was noch da ist.'
                    : `✓ „${recipe.kind === 'dessert' ? 'Fertig' : 'Fertig gebacken'}“ im Kochmodus legt alles in den Vorrat. Dort „1 gegessen“ tippen – so weiß Gusto, was noch da ist.`}
                </div>
              </div>
            ) : isBasic ? (
              <div className="prep-facts">
                <div>🫙 Ergibt <b>{yieldText(recipe, servings)} {y!.name}</b></div>
                <div>
                  {y!.shelf >= 60 ? `❄️ Portionsweise eingefroren ca. ${shelfText(y!.shelf)} haltbar` : `🧊 Hält ${shelfText(y!.shelf)}${y!.store ? ` ${y!.store}` : ''}`}
                </div>
                <div>✓ „Fertig gekocht“ im Kochmodus legt es in den Vorrat – Rezepte damit nehmen dann zuerst das Selbstgemachte.</div>
              </div>
            ) : null}

            {householdNote && !recipe.breakfast && !recipe.basic && (
              <p className="muted small portion-note">👥 Erfahrungsgemäß: {householdNote}. Fürs Einkaufen rechne ich damit.</p>
            )}

            {recipe.breakfast && (
              <div className="prep-facts">
                <div>🧊 Hält <b>{recipe.breakfast.fridgeDays} Tage</b> im Kühlschrank</div>
                <div>{recipe.breakfast.freezer ? '❄️ Lässt sich portionsweise einfrieren' : '🚫 Nicht zum Einfrieren geeignet'}</div>
                <div>🫙 Pro Portion: 1 {recipe.breakfast.container}</div>
              </div>
            )}

            <p className="muted small cost-line">
              {tapa
                ? `Warenwert ≈ ${formatEuro(recipeCost(recipe, servings, prices))} für ${servings === 1 ? 'den Teller' : `${servings} Teller`} (2 Personen, ohne Gewürze)`
                : bbq
                ? `Warenwert ≈ ${formatEuro(recipeCost(recipe, servings, prices))} für die Ladung · ${formatEuro(recipeCost(recipe, servings, prices) / ((recipe.portions ?? 2) * servings))} pro Portion (ohne Gewürze)`
                : isBasic
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
                  : isBbq(b)
                    ? <>🔥 Tipp: Reste vom BBQ (vakuumiert im Vorrat) – <u>{b.title}</u></>
                  : b.bbq === 'rub' || b.tapas === 'sauce'
                    ? <>🫙 Tipp: selbst gemacht schmeckt’s besser – <u>{b.title}</u></>
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
