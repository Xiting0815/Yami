import { useMemo, useState } from 'react'
import type { BasicKind, BbqGroup, CustomRecipe, Recipe, SalatGroup, TapasGroup } from '../types'
import {
  BBQ_GROUP_ICON, BBQ_GROUP_LABEL, CUISINE_LABEL, KIND_ICON, KIND_LABEL, SALAT_GROUP_ICON, SALAT_GROUP_LABEL, TAPAS_GROUP_ICON, TAPAS_GROUP_LABEL,
  isBakery, isBbq, isSalat, isStockDish, isTapa,
} from '../types'
import { bbqSection, leftoverText } from '../bbq'
import { salatSection } from '../salate'
import { type TapasIdea, TAPAS_MAX, TAPAS_MIN, eveningKcal, shortTitle, tapasSection } from '../tapas'
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
  /** Tapas-Auswahl für den Tapas-Abend (Rezept-IDs) */
  tapasPick?: string[]
  onTapasPick?: (ids: string[]) => void
  /** „Tapas-Abend planen“ (Tag wählen) */
  onPlanTapas?: () => void
  /** gelernte „Tapas-Abend-Ideen“ */
  tapasIdeas?: TapasIdea[]
}

/** Bereich der Rezeptliste (außer Frühstück/Abendessen) */
type Area = 'bake' | 'bbq' | 'tapas' | 'salat'

const BAKE_KINDS: BasicKind[] = ['dessert', 'kuchen', 'brot', 'gebaeck']
const BBQ_GROUPS: BbqGroup[] = ['smoker', 'grill', 'dutch', 'burger', 'beilage', 'rub']
const TAPAS_GROUPS: TapasGroup[] = ['fisch', 'fleisch', 'gemuese', 'ei', 'brot', 'sauce']
const SALAT_GROUPS: SalatGroup[] = ['nudel', 'kartoffel', 'reis', 'bohnen', 'gemuese']


/** Saison-Vorrang in der Backen-Liste (Plätzchenzeit 15. Nov. – 26. Dez.): größer als jede gelernte Vorliebe */
const SEASON_BOOST = 1000

const todayIso = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function norm(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function RecipeBrowser({ filters, onFilters, onOpen, perPortion, meal, onMeal, custom, onNew, bakePref, tapasPick = [], onTapasPick, onPlanTapas, tapasIdeas = [] }: Props) {
  const [q, setQ] = useState('')
  const [mine, setMine] = useState(false)
  // Grundrezepte (Fonds, Anstellgut): eigene Ansicht, unabhängig von Frühstück/Abendessen und Filtern
  const [basics, setBasics] = useState(false)
  // Backen & Desserts: eigene Ansicht (null = zu); 'alle' = Desserts, Kuchen und Brot
  const [bake, setBake] = useState<BasicKind | 'alle' | null>(null)
  // BBQ-Sparte: eigene Ansicht (null = zu); 'alle' = alle Gruppen inkl. Rubs & Saucen
  const [bbq, setBbq] = useState<BbqGroup | 'alle' | null>(null)
  // Tapas (Auswahl für den Tapas-Abend) und „Salate & Beilagen“: eigene Ansichten (null = zu)
  const [tapas, setTapas] = useState<TapasGroup | 'alle' | null>(null)
  const [salat, setSalat] = useState<SalatGroup | 'bbq' | 'alle' | null>(null)
  const area: Area | null = bake ? 'bake' : bbq ? 'bbq' : tapas ? 'tapas' : salat ? 'salat' : null
  /** einen Bereich öffnen (die anderen schließen); null = Frühstück/Abendessen */
  const openArea = (a: Area | null) => {
    setBake(a === 'bake' ? 'alle' : null)
    setBbq(a === 'bbq' ? 'alle' : null)
    setTapas(a === 'tapas' ? 'alle' : null)
    setSalat(a === 'salat' ? 'alle' : null)
    if (a) {
      setBasics(false)
      setMine(false)
    }
  }
  const list = useMemo(() => {
    const nq = norm(q.trim())
    const base = tapas
      ? tapasSection(tapas === 'alle' ? undefined : tapas)
      : salat
      ? salatSection(salat === 'alle' ? undefined : salat)
      : bbq
      ? bbqSection(bbq === 'alle' ? undefined : bbq)
      : bake
      ? BASICS.filter((r) => isBakery(r) && (bake === 'alle' || r.kind === bake))
      : basics
        ? BASICS.filter((r) => r.kind === 'grundrezept')
        : meal === 'breakfast'
          ? BREAKFASTS
          : RECIPES.filter((r) => matches(r, filters, perPortion.get(r.id)))
    const pool = base.filter((r) => basics || area || !mine || r.custom)
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
    // BBQ/Tapas/Salate: gelernte Vorliebe (geplant, gemacht, bewertet) sortiert – Rubs & Saucen ans Ende der Gesamtliste
    const score = new Map(
      area
        ? base.map((r) => [
            r.id,
            (bakePref?.(r).score ?? 0) + (festiveOf(r, day)?.active ? SEASON_BOOST : 0) -
              ((bbq === 'alle' && !isBbq(r)) || (tapas === 'alle' && !isTapa(r)) ? SEASON_BOOST : 0),
          ])
        : [],
    )
    return (exact.length ? exact : fuzzy).sort((a, b) => (score.get(b.id) ?? 0) - (score.get(a.id) ?? 0) || byTitle(a, b))
  }, [q, filters, perPortion, meal, mine, custom, basics, bake, bbq, tapas, salat, area, bakePref])
  const picked = tapasPick.map((id) => BASICS.find((r) => r.id === id)).filter((r): r is Recipe => !!r)
  const togglePick = (id: string) =>
    onTapasPick?.(tapasPick.includes(id) ? tapasPick.filter((x) => x !== id) : tapasPick.length >= TAPAS_MAX ? tapasPick : [...tapasPick, id])
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
      <div className="segmented six">
        <button className={!area && meal === 'breakfast' ? 'on' : ''} onClick={() => { openArea(null); onMeal('breakfast') }}>☀️ Frühstück</button>
        <button className={!area && meal === 'dinner' ? 'on' : ''} onClick={() => { openArea(null); onMeal('dinner') }}>🌙 Abendessen</button>
        <button className={bake ? 'on' : ''} onClick={() => openArea('bake')}>🍰 Backen</button>
        <button className={bbq ? 'on' : ''} onClick={() => openArea('bbq')}>🔥 BBQ</button>
        <button className={tapas ? 'on' : ''} onClick={() => openArea('tapas')}>🫒 Tapas</button>
        <button className={salat ? 'on' : ''} onClick={() => openArea('salat')}>🥗 Salate</button>
      </div>
      {tapas ? (
        <div className="chips-row own-row" role="group" aria-label="Tapas">
          {(['alle', ...TAPAS_GROUPS] as const).map((k) => (
            <button key={k} className={`chip ${tapas === k ? 'on' : ''}`} aria-pressed={tapas === k} onClick={() => setTapas(k)}>
              {k === 'alle' ? 'Alle' : `${TAPAS_GROUP_ICON[k]} ${TAPAS_GROUP_LABEL[k]}`}
            </button>
          ))}
        </div>
      ) : salat ? (
        <div className="chips-row own-row" role="group" aria-label="Salate & Beilagen">
          {(['alle', ...SALAT_GROUPS, 'bbq'] as const).map((k) => (
            <button key={k} className={`chip ${salat === k ? 'on' : ''}`} aria-pressed={salat === k} onClick={() => setSalat(k)}>
              {k === 'alle' ? 'Alle' : k === 'bbq' ? '🔥 BBQ-Beilagen' : `${SALAT_GROUP_ICON[k]} ${SALAT_GROUP_LABEL[k]}`}
            </button>
          ))}
        </div>
      ) : bbq ? (
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
      {tapas ? (
        <>
          <p className="muted small">
            {list.length} Rezepte · Wähle 4–6 Tapas (＋) und plane sie zusammen als Tapas-Abend – ersetzt das Abendessen, alle Zutaten kommen auf die Einkaufsliste.
          </p>
          {tapas === 'alle' && !q.trim() && tapasIdeas.length > 0 && (
            <section className="tapas-ideas" aria-label="Tapas-Abend-Ideen">
              <h3>💡 Tapas-Abend-Ideen</h3>
              {tapasIdeas.map((idea) => (
                <div key={idea.label} className="tapas-idea">
                  <div className="tapas-idea-text">
                    <b>{idea.label}</b>: {idea.recipes.map((r) => shortTitle(r.title)).join(' · ')}
                    <small className="muted"> · ≈ {idea.kcal.toLocaleString('de-DE')} kcal p. P.</small>
                    <small className="muted tapas-idea-why">{idea.reason}</small>
                  </div>
                  <button className="btn ghost" onClick={() => onTapasPick?.(idea.recipes.map((r) => r.id))}>Auswählen</button>
                </div>
              ))}
            </section>
          )}
        </>
      ) : salat ? (
        <p className="muted small">{list.length} Rezepte · für alle Küchen. „Einplanen für“ einen Tag als Zusatz zum Abendessen (Grillabend, Gäste, Mitbringsel) – Reste kommen in den Vorrat.</p>
      ) : bbq ? (
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
      {mine && !basics && !area && list.length === 0 && (
        <p className="muted small">Noch kein eigenes Rezept{meal === 'breakfast' ? ' fürs Frühstück' : ' fürs Abendessen'}. Tipp auf „+ Eigenes Rezept“.</p>
      )}
      <div className="grid">
        {list.map((r) =>
          isTapa(r) ? (
            <div key={r.id} className={`tile tapa-tile ${tapasPick.includes(r.id) ? 'picked' : ''}`}>
              <button className="tile-open" onClick={() => onOpen(r)}>
                <RecipeImage recipe={r} className="tile-img" />
                <div className="tile-text">
                  <div className="tile-title">{shortTitle(r.title)}</div>
                  <div className="muted small">
                    {bakePref?.(r).reason ? '❤️ ' : ''}
                    {TAPAS_GROUP_ICON[r.tapas!]} {formatTime(r.time)} · {r.nutrition.kcal.toLocaleString('de-DE')} kcal p. P.
                  </div>
                </div>
              </button>
              <button
                className="tapa-pick"
                aria-pressed={tapasPick.includes(r.id)}
                aria-label={tapasPick.includes(r.id) ? `${shortTitle(r.title)} abwählen` : `${shortTitle(r.title)} auswählen`}
                onClick={() => togglePick(r.id)}
              >
                {tapasPick.includes(r.id) ? `✓ ${tapasPick.indexOf(r.id) + 1}` : '＋'}
              </button>
            </div>
          ) : (
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
              ) : isStockDish(r) && r.yields ? (
                <div className="muted small">
                  {festiveOf(r, todayIso())?.active && <span className="badge eco">{festiveOf(r, todayIso())?.label}</span>}{' '}
                  {bakePref?.(r).reason ? '❤️ ' : ''}
                  {isSalat(r) ? `${CUISINE_LABEL[r.cuisine]} · ` : `${KIND_LABEL[r.kind!]} · `}{formatTime(r.time)} · {yieldText(r, r.servings)}
                  {r.yields.perPiece ? ` · ${r.yields.perPiece.kcal.toLocaleString('de-DE')} kcal/${pieceName(yieldStock(r.kind, r.yields).unit)}` : ''}
                </div>
              ) : r.basic && r.yields ? (
                <div className="muted small">
                  {r.bbq === 'rub' ? `${BBQ_GROUP_ICON.rub} ` : r.tapas === 'sauce' ? `${TAPAS_GROUP_ICON.sauce} ` : ''}Grundrezept · {formatTime(r.time)} · ergibt {formatAmount(r.yields.amount, r.yields.unit)} · ≈ {formatEuro(recipeCost(r, r.servings))}
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
          ),
        )}
      </div>
      {tapas && picked.length > 0 && (
        <div className="tapas-bar" role="region" aria-label="Tapas-Auswahl">
          <div className="tapas-bar-text">
            <b>🫒 {picked.length} {picked.length === 1 ? 'Tapa' : 'Tapas'}</b>
            <small>
              ≈ {eveningKcal(picked).toLocaleString('de-DE')} kcal p. P.{picked.length < 4 ? ' · 4–6 sind ideal' : picked.length > 6 ? ' · viel – 4–6 reichen' : ''}
            </small>
          </div>
          <button className="btn ghost" onClick={() => onTapasPick?.([])}>Leeren</button>
          <button className="btn primary" disabled={picked.length < TAPAS_MIN} onClick={onPlanTapas}>Planen</button>
        </div>
      )}
    </div>
  )
}
