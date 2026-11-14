import { useCallback, useEffect, useMemo, useState } from 'react'
import type { PlanEntry, Recipe } from './types'
import { RECIPES, RECIPE_BY_ID } from './data/recipes'
import { addDays, mondayOf, isoDate, shortDate, useAppState, weekDays, weekdayName, weekLabel } from './store'
import { matches } from './filter'
import { formatAmount } from './shopping'
import {
  type BuyItem,
  addDaysIso,
  cookDue,
  daysUntil,
  insight,
  lastSeenMap,
  planWeek,
  uid,
  uncook,
} from './kitchen'
import { WeekView } from './components/WeekView'
import { SwipeDeck } from './components/SwipeDeck'
import { FilterBar } from './components/FilterBar'
import { RecipeSheet } from './components/RecipeSheet'
import { ShoppingList } from './components/ShoppingList'
import { RecipeBrowser } from './components/RecipeBrowser'
import { PantryView } from './components/PantryView'

type Tab = 'woche' | 'wischen' | 'liste' | 'vorrat' | 'rezepte'

interface SheetState {
  recipe: Recipe
  /** Tag, für den das Rezept angesehen wird (Wochenplan/Wischen) */
  day?: string
  mode: 'view' | 'take' | 'pick'
}

export default function App() {
  const [state, setState] = useAppState()
  const [tab, setTab] = useState<Tab>('woche')
  const [today, setToday] = useState(() => isoDate(new Date()))
  const [monday, setMonday] = useState(() => {
    // ab Samstag automatisch die nächste Woche zeigen
    const now = new Date()
    const m = mondayOf(now)
    return now.getDay() === 6 || now.getDay() === 0 ? addDays(m, 7) : m
  })
  const days = useMemo(() => weekDays(monday), [monday])
  const weekKey = days[0]
  const [swipeDay, setSwipeDay] = useState<string>(days[0])
  const [sheet, setSheet] = useState<SheetState | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [rejected, setRejected] = useState<string[]>([])

  // Datum aktuell halten (App bleibt oft tagelang offen)
  useEffect(() => {
    const tick = () => setToday(isoDate(new Date()))
    const id = window.setInterval(tick, 60_000)
    document.addEventListener('visibilitychange', tick)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [])

  // vergangene Gerichte gelten als gekocht → Zutaten vom Vorrat abziehen
  useEffect(() => {
    setState((s) => {
      const r = cookDue(s.plan, s.pantry, today)
      return r.changed ? { ...s, plan: r.plan, pantry: r.pantry } : s
    })
  }, [today, setState])

  useEffect(() => setRejected([]), [weekKey])

  const flash = useCallback((msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2200)
  }, [])

  const setEntry = useCallback(
    (day: string, entry: PlanEntry | undefined) => {
      setState((s) => {
        const plan = { ...s.plan }
        const old = plan[day]
        // ein bereits abgezogenes Gericht wird ersetzt → Zutaten zurück in den Vorrat
        const pantry = old?.status === 'cooked' ? uncook(old, s.pantry) : s.pantry
        if (entry) plan[day] = entry
        else delete plan[day]
        return { ...s, plan, pantry }
      })
    },
    [setState],
  )

  // ───── Planung, Vorrat & Empfehlungen ─────
  const week = useMemo(
    () => planWeek(state.plan, days, state.pantry, state.bought[weekKey] ?? {}, today, state.prices, formatAmount),
    [state.plan, days, state.pantry, state.bought, weekKey, today, state.prices],
  )
  const weekRecipes = useMemo(
    () => days.map((d) => state.plan[d]).filter((e) => e && e.status !== 'skipped').map((e) => RECIPE_BY_ID[e!.recipeId]).filter(Boolean),
    [days, state.plan],
  )
  const lastSeen = useMemo(() => lastSeenMap(state.plan, days[0]), [state.plan, days])
  const jitter = useMemo(
    () => new Map(RECIPES.map((r) => [r.id, Math.random()])),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [weekKey],
  )
  const insights = useMemo(
    () =>
      new Map(
        RECIPES.map((r) => [
          r.id,
          insight(r, state.defaultServings, week.leftovers, today, state.prices, lastSeen, jitter.get(r.id) ?? 0, weekRecipes),
        ]),
      ),
    [week.leftovers, today, state.prices, lastSeen, jitter, state.defaultServings, weekRecipes],
  )
  const perPortion = useMemo(() => new Map([...insights].map(([id, i]) => [id, i.perPortion])), [insights])

  const plannedIds = useMemo(
    () => new Set(days.map((d) => state.plan[d]).filter((e) => e && e.status !== 'skipped').map((e) => e!.recipeId)),
    [days, state.plan],
  )
  const filteredCount = RECIPES.filter((r) => matches(r, state.filters, perPortion.get(r.id))).length
  const deck = useMemo(() => {
    const list = RECIPES.filter((r) => matches(r, state.filters, perPortion.get(r.id)) && !plannedIds.has(r.id))
    const rej = new Set(rejected)
    const fresh = list.filter((r) => !rej.has(r.id)).sort((a, b) => insights.get(b.id)!.score - insights.get(a.id)!.score)
    const later = rejected.map((id) => list.find((r) => r.id === id)).filter((r): r is Recipe => !!r)
    return [...fresh, ...later]
  }, [state.filters, perPortion, plannedIds, rejected, insights])

  const urgentNames = new Set(state.pantry.filter((l) => daysUntil(l.expires, today) <= 2).map((l) => l.name))

  function startSwipe(day: string) {
    setSwipeDay(day)
    setTab('wischen')
  }

  function take(recipe: Recipe, day: string, servings = state.defaultServings) {
    setEntry(day, { recipeId: recipe.id, servings })
    const idx = days.indexOf(day)
    const nextEmpty = [...days.slice(idx + 1), ...days.slice(0, idx)].find((d) => d !== day && !state.plan[d] && d >= today)
    if (nextEmpty) {
      flash(`${weekdayName(day)}: ${recipe.title} ✓`)
      setSwipeDay(nextEmpty)
    } else {
      flash('Woche komplett geplant! 🎉')
      setTab('woche')
    }
  }

  function changeWeek(delta: number) {
    const m = addDays(monday, delta * 7)
    setMonday(m)
    setSwipeDay(isoDate(m))
  }

  function toggleBuy(item: BuyItem) {
    setState((s) => {
      const wk = { ...(s.bought[weekKey] ?? {}) }
      const checked = new Set(s.checked[weekKey] ?? [])
      let pantry = s.pantry
      const b = wk[item.name]
      if (b) {
        pantry = pantry.map((l) => (l.id === b.lotId ? { ...l, amount: l.amount - b.amount } : l)).filter((l) => l.amount > 1e-6)
        delete wk[item.name]
        checked.delete(item.key)
      } else {
        const amount = item.packs * item.product.pack
        const lot = { id: uid(), name: item.name, amount, unit: item.unit, expires: addDaysIso(today, item.product.shelf) }
        pantry = [...pantry, lot]
        wk[item.name] = { lotId: lot.id, amount }
        checked.add(item.key)
      }
      return { ...s, pantry, bought: { ...s.bought, [weekKey]: wk }, checked: { ...s.checked, [weekKey]: [...checked] } }
    })
  }

  function resetChecks() {
    setState((s) => {
      const wk = s.bought[weekKey] ?? {}
      let pantry = s.pantry
      for (const b of Object.values(wk)) {
        pantry = pantry.map((l) => (l.id === b.lotId ? { ...l, amount: l.amount - b.amount } : l)).filter((l) => l.amount > 1e-6)
      }
      return { ...s, pantry, bought: { ...s.bought, [weekKey]: {} }, checked: { ...s.checked, [weekKey]: [] } }
    })
  }

  function uncookDay(day: string) {
    setState((s) => {
      const e = s.plan[day]
      if (!e) return s
      return { ...s, pantry: uncook(e, s.pantry), plan: { ...s.plan, [day]: { ...e, status: 'skipped', consumed: undefined } } }
    })
    flash('Zutaten zurück im Vorrat')
  }

  function recookDay(day: string) {
    setState((s) => {
      const e = s.plan[day]
      if (!e) return s
      const plan = { ...s.plan, [day]: { ...e, status: undefined } }
      const r = cookDue(plan, s.pantry, today)
      return { ...s, plan: r.plan, pantry: r.pantry }
    })
  }

  const weekNav = (
    <div className="weeknav">
      <button className="icon-btn" onClick={() => changeWeek(-1)} aria-label="Vorige Woche">‹</button>
      <span>{weekLabel(monday)}</span>
      <button className="icon-btn" onClick={() => changeWeek(1)} aria-label="Nächste Woche">›</button>
    </div>
  )

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="logo">🍳</span> Yami
        </div>
        {tab !== 'rezepte' && tab !== 'vorrat' && weekNav}
      </header>

      <main className="content">
        {tab === 'woche' && (
          <WeekView
            days={days}
            plan={state.plan}
            today={today}
            total={week.total}
            prices={state.prices}
            urgentCount={urgentNames.size}
            onSwipeDay={startSwipe}
            onOpen={(r, day) => setSheet({ recipe: r, day, mode: 'view' })}
            onUpdate={setEntry}
            onUncook={uncookDay}
            onRecook={recookDay}
            onShop={() => setTab('liste')}
            onPantry={() => setTab('vorrat')}
          />
        )}

        {tab === 'wischen' && (
          <div className="swipe-screen">
            <div className="day-dots">
              {days.map((d) => (
                <button
                  key={d}
                  className={`dot ${d === swipeDay ? 'current' : ''} ${state.plan[d] ? 'filled' : ''}`}
                  onClick={() => setSwipeDay(d)}
                >
                  <b>{weekdayName(d, true)}</b>
                  <span>{state.plan[d] ? '✓' : shortDate(d)}</span>
                </button>
              ))}
            </div>
            <div className="swipe-head">
              <h1>
                Was gibt’s <span className="accent">{weekdayName(swipeDay)}</span>?
              </h1>
              <button className={`chip ${showFilters ? 'on' : ''}`} onClick={() => setShowFilters((v) => !v)}>
                ⚙︎ Filter{filteredCount !== RECIPES.length ? ` (${filteredCount})` : ''}
              </button>
            </div>
            {state.plan[swipeDay] && (
              <p className="muted small center">
                Aktuell geplant: {RECIPE_BY_ID[state.plan[swipeDay]!.recipeId]?.title}. Nach rechts wischen ersetzt es.
              </p>
            )}
            {showFilters && (
              <FilterBar filters={state.filters} onChange={(f) => setState((s) => ({ ...s, filters: f }))} count={filteredCount} />
            )}
            <SwipeDeck
              deck={deck}
              insights={insights}
              onTake={(r) => take(r, swipeDay)}
              onReject={(r) => setRejected((x) => [...x.filter((id) => id !== r.id), r.id])}
              onInfo={(r) => setSheet({ recipe: r, day: swipeDay, mode: 'take' })}
            />
            <p className="hint">← wegwischen · nehmen → · sortiert nach Vorrat, Preis & Abwechslung</p>
          </div>
        )}

        {tab === 'liste' && (
          <ShoppingList
            result={week}
            planned={days.filter((d) => state.plan[d]).length}
            checked={state.checked[weekKey] ?? []}
            custom={state.custom[weekKey] ?? []}
            onToggleBuy={toggleBuy}
            onToggleKey={(key) =>
              setState((s) => {
                const cur = new Set(s.checked[weekKey] ?? [])
                if (cur.has(key)) cur.delete(key)
                else cur.add(key)
                return { ...s, checked: { ...s.checked, [weekKey]: [...cur] } }
              })
            }
            onResetChecks={resetChecks}
            onAddCustom={(item) =>
              setState((s) => ({ ...s, custom: { ...s.custom, [weekKey]: [...(s.custom[weekKey] ?? []), item] } }))
            }
            onRemoveCustom={(id) =>
              setState((s) => ({ ...s, custom: { ...s.custom, [weekKey]: (s.custom[weekKey] ?? []).filter((c) => c.id !== id) } }))
            }
            onEditPrice={(name, pack, price) => setState((s) => ({ ...s, prices: { ...s.prices, [name]: { pack, price } } }))}
            onGoPlan={() => setTab('woche')}
          />
        )}

        {tab === 'vorrat' && (
          <PantryView
            pantry={state.pantry}
            leftovers={week.leftovers}
            today={today}
            onChange={(pantry) => setState((s) => ({ ...s, pantry }))}
            onCook={() => {
              const free = days.find((d) => !state.plan[d] && d >= today)
              if (free) startSwipe(free)
              else {
                // Woche voll → nächste Woche planen
                changeWeek(1)
                setTab('wischen')
              }
            }}
          />
        )}

        {tab === 'rezepte' && (
          <RecipeBrowser
            filters={state.filters}
            onFilters={(f) => setState((s) => ({ ...s, filters: f }))}
            onOpen={(r) => setSheet({ recipe: r, mode: 'pick' })}
            perPortion={perPortion}
          />
        )}
      </main>

      <nav className="tabbar">
        {(
          [
            ['woche', '📅', 'Woche'],
            ['wischen', '👆', 'Wischen'],
            ['liste', '🛒', 'Liste'],
            ['vorrat', '🧺', 'Vorrat'],
            ['rezepte', '📖', 'Rezepte'],
          ] as [Tab, string, string][]
        ).map(([t, icon, label]) => (
          <button
            key={t}
            className={tab === t ? 'active' : ''}
            onClick={() => {
              if (t === 'wischen') setSwipeDay(days.find((d) => !state.plan[d] && d >= today) ?? swipeDay)
              setTab(t)
            }}
          >
            <span className="tab-icon">
              {icon}
              {t === 'vorrat' && urgentNames.size > 0 && <i className="tab-badge">{urgentNames.size}</i>}
            </span>
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {sheet && (
        <RecipeSheet
          key={sheet.recipe.id}
          recipe={sheet.recipe}
          prices={state.prices}
          insight={insights.get(sheet.recipe.id)}
          servings={(sheet.day && state.plan[sheet.day]?.recipeId === sheet.recipe.id ? state.plan[sheet.day]?.servings : undefined) ?? state.defaultServings}
          onClose={() => setSheet(null)}
          action={
            sheet.mode === 'take' && sheet.day
              ? {
                  label: `Für ${weekdayName(sheet.day)} nehmen`,
                  onClick: (servings) => {
                    take(sheet.recipe, sheet.day!, servings)
                    setSheet(null)
                  },
                }
              : sheet.mode === 'view' && sheet.day && !state.plan[sheet.day]?.status
                ? {
                    label: 'Portionen übernehmen',
                    onClick: (servings) => {
                      setEntry(sheet.day!, { recipeId: sheet.recipe.id, servings })
                      setSheet(null)
                    },
                  }
                : undefined
          }
        />
      )}

      {sheet?.mode === 'pick' && (
        <DayPicker
          days={days}
          plan={state.plan}
          onPick={(day) => {
            setEntry(day, { recipeId: sheet.recipe.id, servings: state.defaultServings })
            flash(`${sheet.recipe.title} → ${weekdayName(day)} ✓`)
            setSheet(null)
          }}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

function DayPicker({ days, plan, onPick }: { days: string[]; plan: Record<string, PlanEntry | undefined>; onPick: (d: string) => void }) {
  return (
    <div className="daypicker">
      <span>Einplanen für:</span>
      <div className="daypicker-days">
        {days.map((d) => (
          <button key={d} className={`dot ${plan[d] ? 'filled' : ''}`} onClick={() => onPick(d)}>
            <b>{weekdayName(d, true)}</b>
            <span>{shortDate(d)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
