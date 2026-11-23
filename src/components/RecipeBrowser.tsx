import { useMemo, useState } from 'react'
import type { BasicKind, BbqGroup, CustomRecipe, Recipe } from '../types'
import { BBQ_GROUP_ICON, BBQ_GROUP_LABEL, CUISINE_LABEL, KIND_ICON, KIND_LABEL, isBakery, isBbq } from '../types'
import { bbqSection, leftoverText } from '../bbq'
import { isBbqSeason } from '../data/season'
import { pieceName, yieldText } from '../bake'
import { yieldStock } from '../data/define'
import { BASICS, BREAKFASTS, RECIPES } from '../data/recipes'
import { BREAKFAST_LABEL } from '../types'
import { NutritionRow } from './NutritionRow'
import type { Filters } from '../store'
import { matches, formatTime } from '../filter'
import { festiveOf, formatEuro, recipeCost } from '../kitchen'
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

const BAKE_KINDS: BasicKind[] = ['dessert', 'kuchen', 'brot', 'gebaeck']
const BBQ_GROUPS: BbqGroup[] = ['smoker', 'grill', 'dutch', 'burger', 'beilage', 'rub']

/** Saison-Vorrang in der Backen-Liste (Plätzchenzeit 15. Nov. – 26. Dez.): größer als jede gelernte Vorliebe */
const SEASON_BOOST = 1000

const todayIso = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

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
  // BBQ-Sparte: eigene Ansicht (null = zu); 'alle' = alle Gruppen inkl. Rubs & Saucen
  const [bbq, setBbq] = useState<BbqGroup | 'alle' | null>(null)
  const list = useMemo(() => {
    const nq = norm(q.trim())
    const base = bbq
      ? bbqSection(bbq === 'alle' ? undefined : bbq)
      : bake
      ? BASICS.filter((r) => isBakery(r) && (bake === 'alle' || r.kind === bake))
      : basics
        ? BASICS.filter((r) => r.kind === 'grundrezept')
        : meal === 'breakfast'
          ? BREAKFASTS
          : RECIPES.filter((r) => matches(r, filters, perPortion.get(r.id)))
    const pool = base.filter((r) => basics || bake || bbq || !mine || r.custom)
    const exact = pool.filter((r) => !nq || norm(r.title).includes(nq) || r.ingredients.some((i) => norm(i.name).includes(nq)))
    // nichts gefunden (z. B. Tippfehler „Tunfisch“) → über ähnlich geschriebene Zutaten suchen
    const fuzzy = exact.length || nq.length < 3 ? [] : (() => {
      const names = new Set(searchIngredients(q, 6))
      return pool.filter((r) => r.ingredients.some((i) => names.has(i.name)))
    })()
    const byTitle = (a: Recipe, b: Recipe) => a.title.localeCompare(b.title, 'de')
    // Backen: was du gern bäckst und isst, kommt nach vorn (gelernt)
    // Saisongebäck (Plätzchen) steht in seiner Zeit ganz oben, danach folgt die gelernte Vorliebe
    const day = todayIso()
    // BBQ: gelernte Vorliebe (geplant, gegrillt, bewertet) sortiert – Rubs & Saucen ans Ende der Gesamtliste
    const score = new Map(
      bake || bbq
        ? base.map((r) => [r.id, (bakePref?.(r).score ?? 0) + (festiveOf(r, day)?.active ? SEASON_BOOST : 0) - (bbq === 'alle' && !isBbq(r) ? SEASON_BOOST : 0)])
        : [],
    )
    return (exact.length ? exact : fuzzy).sort((a, b) => (score.get(b.id) ?? 0) - (score.get(a.id) ?? 0) || byTitle(a, b))
  }, [q, filters, perPortion, meal, mine, custom, basics, bake, bbq, bakePref])
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
      <div className="segmented four">
        <button className={!bake && !bbq && meal === 'breakfast' ? 'on' : ''} onClick={() => { setBake(null); setBbq(null); onMeal('breakfast') }}>☀️ Frühstück</button>
        <button className={!bake && !bbq && meal === 'dinner' ? 'on' : ''} onClick={() => { setBake(null); setBbq(null); onMeal('dinner') }}>🌙 Abendessen</button>
        <button className={bake ? 'on' : ''} onClick={() => { setBake('alle'); setBbq(null); setBasics(false); setMine(false) }}>🍰 Backen</button>
        <button className={bbq ? 'on' : ''} onClick={() => { setBbq('alle'); setBake(null); setBasics(false); setMine(false) }}>🔥 BBQ</button>
      </div>
      {bbq ? (
        <div className="chips-row own-row" role="group" aria-label="BBQ & Grillen">
          {(['alle', ...BBQ_GROUPS] as const).map((k) => (
            <button key={k} className={`chip ${bbq === k ? 'on' : ''}`} aria-pressed={bbq === k} onClick={() => setBbq(k)}>
              {k === 'alle' ? 'Alle' : `${BBQ_GROUP_ICON[k]} ${BBQ_GROUP_LABEL[k]}`}
            </button>
          ))}
        </div>
      ) : bake ? (
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
      {bbq ? (
        <p className="muted small">
          {list.length} Rezepte · {isBbqSeason(todayIso()) ? 'Grillsaison! ' : ''}„Einplanen für“ einen Tag setzt die Zutaten auf die Einkaufsliste und ersetzt auf Wunsch das Abendessen. Große Stücke rechnen die ganze Ladung – Reste kommen vakuumiert in den Vorrat.
        </p>
      ) : bake ? (
        <p className="muted small">{list.length} Rezepte · „Fertig gebacken“ legt alles in den Vorrat, jedes gegessene Stück zählt in die Tagesbilanz.</p>
      ) : basics ? (
        <p className="muted small">{list.length} Grundrezepte · Fond auf Vorrat kochen und portionsweise einfrieren – Braten und Saucen nehmen ihn dann zuerst.</p>
      ) : meal === 'dinner' ? (
        <FilterBar filters={filters} onChange={onFilters} count={list.length} />
      ) : (
        <p className="muted small">{list.length} Meal-Prep-Frühstücke · je ca. 370–470 kcal, ≥ 25 g Eiweiß, ≥ 8 g Ballaststoffe</p>
      )}
      {mine && !basics && !bake && !bbq && list.length === 0 && (
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
              {isBbq(r) ? (
                <div className="muted small">
                  {bakePref?.(r).reason ? '❤️ ' : ''}
                  {r.bbq ? BBQ_GROUP_LABEL[r.bbq] : KIND_LABEL.bbq} · {formatTime(r.time)} · {r.portions ?? 2} Portionen · {r.nutrition.kcal.toLocaleString('de-DE')} kcal/P.
                  {r.yields ? ` · Rest: ${leftoverText(r)}` : ''}
                </div>
              ) : isBakery(r) && r.yields ? (
                <div className="muted small">
                  {festiveOf(r, todayIso())?.active && <span className="badge eco">{festiveOf(r, todayIso())?.label}</span>}{' '}
                  {bakePref?.(r).reason ? '❤️ ' : ''}
                  {KIND_LABEL[r.kind!]} · {formatTime(r.time)} · {yieldText(r, r.servings)}
                  {r.yields.perPiece ? ` · ${r.yields.perPiece.kcal.toLocaleString('de-DE')} kcal/${pieceName(yieldStock(r.kind, r.yields).unit)}` : ''}
                </div>
              ) : r.basic && r.yields ? (
                <div className="muted small">
                  {r.bbq === 'rub' ? `${BBQ_GROUP_ICON.rub} ` : ''}Grundrezept · {formatTime(r.time)} · ergibt {formatAmount(r.yields.amount, r.yields.unit)} · ≈ {formatEuro(recipeCost(r, r.servings))}
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
