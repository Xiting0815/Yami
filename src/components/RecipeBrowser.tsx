import { useMemo, useState } from 'react'
import type { BasicKind, CustomRecipe, Recipe } from '../types'
import { CUISINE_LABEL, KIND_ICON, KIND_LABEL, isBake } from '../types'
import { pieceName, yieldText } from '../bake'
import { yieldStock } from '../data/define'
import { BASICS, BREAKFASTS, RECIPES } from '../data/recipes'
import { BREAKFAST_LABEL } from '../types'
import { NutritionRow } from './NutritionRow'
import type { Filters } from '../store'
import { matches, formatTime } from '../filter'
import { formatEuro, recipeCost } from '../kitchen'
import { formatAmount } from '../shopping'
import { FilterBar } from './FilterBar'
import { RecipeImage } from './RecipeImage'
import { searchIngredients } from '../customIngredients'

interface Props {
  filters: Filters
  onFilters: (f: Filters) => void
  onOpen: (r: Recipe) => void
  /** Kosten pro Portion je Rezept */
  perPortion: Map<string, number>
  meal: 'dinner' | 'breakfast'
  onMeal: (m: 'dinner' | 'breakfast') => void
  /** eigene Rezepte (ändert sich beim Anlegen/Löschen → Liste neu aufbauen) */
  custom: CustomRecipe[]
  onNew: () => void
  /** gelernte Vorliebe für Backen & Desserts (sortiert die Liste, ❤️ bei deutlicher Vorliebe) */
  bakePref?: (r: Recipe) => { score: number; reason?: string }
}

const BAKE_KINDS: BasicKind[] = ['dessert', 'kuchen', 'brot']

function norm(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function RecipeBrowser({ filters, onFilters, onOpen, perPortion, meal, onMeal, custom, onNew, bakePref }: Props) {
  const [q, setQ] = useState('')
  const [mine, setMine] = useState(false)
  // Grundrezepte (Fonds, Anstellgut): eigene Ansicht, unabhängig von Frühstück/Abendessen und Filtern
  const [basics, setBasics] = useState(false)
  // Backen & Desserts: eigene Ansicht (null = zu); 'alle' = Desserts, Kuchen und Brot
  const [bake, setBake] = useState<BasicKind | 'alle' | null>(null)
  const list = useMemo(() => {
    const nq = norm(q.trim())
    const base = bake
      ? BASICS.filter((r) => isBake(r) && (bake === 'alle' || r.kind === bake))
      : basics
        ? BASICS.filter((r) => r.kind === 'grundrezept')
        : meal === 'breakfast'
          ? BREAKFASTS
          : RECIPES.filter((r) => matches(r, filters, perPortion.get(r.id)))
    const pool = base.filter((r) => basics || bake || !mine || r.custom)
    const exact = pool.filter((r) => !nq || norm(r.title).includes(nq) || r.ingredients.some((i) => norm(i.name).includes(nq)))
    // nichts gefunden (z. B. Tippfehler „Tunfisch“) → über ähnlich geschriebene Zutaten suchen
    const fuzzy = exact.length || nq.length < 3 ? [] : (() => {
      const names = new Set(searchIngredients(q, 6))
      return pool.filter((r) => r.ingredients.some((i) => names.has(i.name)))
    })()
    const byTitle = (a: Recipe, b: Recipe) => a.title.localeCompare(b.title, 'de')
    // Backen: was du gern bäckst und isst, kommt nach vorn (gelernt)
    const score = new Map(bake && bakePref ? base.map((r) => [r.id, bakePref(r).score]) : [])
    return (exact.length ? exact : fuzzy).sort((a, b) => (score.get(b.id) ?? 0) - (score.get(a.id) ?? 0) || byTitle(a, b))
  }, [q, filters, perPortion, meal, mine, custom, basics, bake, bakePref])
  // Wortvorschläge beim Tippen (Zutaten, auch bei Tippfehlern)
  const words = useMemo(() => {
    const t = q.trim()
    if (t.length < 3) return []
    return searchIngredients(t, 5).filter((n) => norm(n) !== norm(t))
  }, [q])

  return (
    <div className="browser">
      <input className="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍 Gericht oder Zutat suchen …" />
      {words.length > 0 && (
        <div className="search-words" aria-label="Vorschläge">
          {words.map((w) => (
            <button key={w} className="chip" onClick={() => setQ(w)}>
              {w}
            </button>
          ))}
        </div>
      )}
      <div className="segmented three">
        <button className={!bake && meal === 'breakfast' ? 'on' : ''} onClick={() => { setBake(null); onMeal('breakfast') }}>☀️ Frühstück</button>
        <button className={!bake && meal === 'dinner' ? 'on' : ''} onClick={() => { setBake(null); onMeal('dinner') }}>🌙 Abendessen</button>
        <button className={bake ? 'on' : ''} onClick={() => { setBake('alle'); setBasics(false); setMine(false) }}>🍰 Backen</button>
      </div>
      {bake ? (
        <div className="chips-row own-row" role="group" aria-label="Backen & Desserts">
          {(['alle', ...BAKE_KINDS] as const).map((k) => (
            <button key={k} className={`chip ${bake === k ? 'on' : ''}`} aria-pressed={bake === k} onClick={() => setBake(k)}>
              {k === 'alle' ? 'Alle' : `${KIND_ICON[k]} ${KIND_LABEL[k]}`}
            </button>
          ))}
        </div>
      ) : (
      <div className="chips-row own-row">
        <button className="chip own-new" onClick={onNew}>
          + Eigenes Rezept
        </button>
        <button className={`chip ${mine && !basics ? 'on' : ''}`} onClick={() => { setMine(!mine); setBasics(false) }} aria-pressed={mine && !basics}>
          Meine Rezepte{custom.length ? ` (${custom.length})` : ''}
        </button>
        <button className={`chip ${basics ? 'on' : ''}`} onClick={() => setBasics(!basics)} aria-pressed={basics}>
          Grundrezepte
        </button>
      </div>
      )}
      {bake ? (
        <p className="muted small">{list.length} Rezepte · „Fertig gebacken“ legt alles in den Vorrat, jedes gegessene Stück zählt in die Tagesbilanz.</p>
      ) : basics ? (
        <p className="muted small">{list.length} Grundrezepte · Fond auf Vorrat kochen und portionsweise einfrieren – Braten und Saucen nehmen ihn dann zuerst.</p>
      ) : meal === 'dinner' ? (
        <FilterBar filters={filters} onChange={onFilters} count={list.length} />
      ) : (
        <p className="muted small">{list.length} Meal-Prep-Frühstücke · je ca. 370–470 kcal, ≥ 25 g Eiweiß, ≥ 8 g Ballaststoffe</p>
      )}
      {mine && !basics && !bake && list.length === 0 && (
        <p className="muted small">Noch kein eigenes Rezept{meal === 'breakfast' ? ' fürs Frühstück' : ' fürs Abendessen'}. Tipp auf „+ Eigenes Rezept“.</p>
      )}
      <div className="grid">
        {list.map((r) => (
          <button key={r.id} className="tile" onClick={() => onOpen(r)}>
            <RecipeImage recipe={r} className="tile-img" />
            <div className="tile-text">
              <div className="tile-title">
                {r.custom && <span className="own-badge">Eigenes</span>}
                {r.title}
              </div>
              {isBake(r) && r.yields ? (
                <div className="muted small">
                  {bakePref?.(r).reason ? '❤️ ' : ''}
                  {KIND_LABEL[r.kind!]} · {formatTime(r.time)} · {yieldText(r, r.servings)}
                  {r.yields.perPiece ? ` · ${r.yields.perPiece.kcal.toLocaleString('de-DE')} kcal/${pieceName(yieldStock(r.kind, r.yields).unit)}` : ''}
                </div>
              ) : r.basic && r.yields ? (
                <div className="muted small">
                  Grundrezept · {formatTime(r.time)} · ergibt {formatAmount(r.yields.amount, r.yields.unit)} · ≈ {formatEuro(recipeCost(r, r.servings))}
                </div>
              ) : r.breakfast ? (
                <>
                  <div className="muted small">{BREAKFAST_LABEL[r.breakfast.type]} · hält {r.breakfast.fridgeDays} T.</div>
                  <NutritionRow n={r.nutrition} className="tiny" />
                </>
              ) : (
                <div className="muted small">
                  {CUISINE_LABEL[r.cuisine]} · {formatTime(r.time)} · ≈ {formatEuro(perPortion.get(r.id) ?? 0)}/P. · {r.nutrition.kcal.toLocaleString('de-DE')} kcal
                  {r.vegetarian ? ' · 🌱' : ''}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
