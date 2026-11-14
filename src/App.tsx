import { useCallback, useMemo, useState } from 'react'
import type { PlanEntry, Recipe } from './types'
import { RECIPES } from './data/recipes'
import { addDays, mondayOf, isoDate, shortDate, useAppState, weekDays, weekdayName, weekLabel } from './store'
import { matches } from './filter'
import { WeekView } from './components/WeekView'
import { SwipeDeck } from './components/SwipeDeck'
import { FilterBar } from './components/FilterBar'
import { RecipeSheet } from './components/RecipeSheet'
import { ShoppingList } from './components/ShoppingList'
import { RecipeBrowser } from './components/RecipeBrowser'

type Tab = 'woche' | 'wischen' | 'liste' | 'rezepte'

interface SheetState {
  recipe: Recipe
  /** Tag, für den das Rezept angesehen wird (Wochenplan/Wischen) */
  day?: string
  mode: 'view' | 'take' | 'pick'
}

export default function App() {
  const [state, setState] = useAppState()
  const [tab, setTab] = useState<Tab>('woche')
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

  const flash = useCallback((msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2200)
  }, [])

  const setEntry = useCallback(
    (day: string, entry: PlanEntry | undefined) => {
      setState((s) => {
        const plan = { ...s.plan }
        if (entry) plan[day] = entry
        else delete plan[day]
        return { ...s, plan }
      })
    },
    [setState],
  )

  const plannedIds = useMemo(() => new Set(days.map((d) => state.plan[d]?.recipeId).filter(Boolean)), [days, state.plan])
  const pool = useMemo(
    () => RECIPES.filter((r) => matches(r, state.filters) && !plannedIds.has(r.id)),
    // Pool nur bei Filter- oder Wochenwechsel neu mischen, nicht nach jedem Nehmen
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.filters, weekKey],
  )
  const filteredCount = RECIPES.filter((r) => matches(r, state.filters)).length

  function startSwipe(day: string) {
    setSwipeDay(day)
    setTab('wischen')
  }

  function take(recipe: Recipe, day: string, servings = state.defaultServings) {
    setEntry(day, { recipeId: recipe.id, servings })
    const idx = days.indexOf(day)
    const nextEmpty = [...days.slice(idx + 1), ...days.slice(0, idx)].find((d) => d !== day && !state.plan[d])
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
        {tab !== 'rezepte' && weekNav}
      </header>

      <main className="content">
        {tab === 'woche' && (
          <WeekView
            days={days}
            plan={state.plan}
            onSwipeDay={startSwipe}
            onOpen={(r, day) => setSheet({ recipe: r, day, mode: 'view' })}
            onUpdate={setEntry}
            onShop={() => setTab('liste')}
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
                Aktuell geplant: {RECIPES.find((r) => r.id === state.plan[swipeDay]?.recipeId)?.title}. Nach rechts wischen ersetzt es.
              </p>
            )}
            {showFilters && (
              <FilterBar filters={state.filters} onChange={(f) => setState((s) => ({ ...s, filters: f }))} count={filteredCount} />
            )}
            <SwipeDeck
              pool={pool}
              onTake={(r) => take(r, swipeDay)}
              onInfo={(r) => setSheet({ recipe: r, day: swipeDay, mode: 'take' })}
            />
            <p className="hint">← wegwischen · nehmen →</p>
          </div>
        )}

        {tab === 'liste' && (
          <ShoppingList
            days={days}
            plan={state.plan}
            checked={state.checked[weekKey] ?? []}
            custom={state.custom[weekKey] ?? []}
            onToggle={(key) =>
              setState((s) => {
                const cur = new Set(s.checked[weekKey] ?? [])
                if (cur.has(key)) cur.delete(key)
                else cur.add(key)
                return { ...s, checked: { ...s.checked, [weekKey]: [...cur] } }
              })
            }
            onResetChecks={() => setState((s) => ({ ...s, checked: { ...s.checked, [weekKey]: [] } }))}
            onAddCustom={(item) =>
              setState((s) => ({ ...s, custom: { ...s.custom, [weekKey]: [...(s.custom[weekKey] ?? []), item] } }))
            }
            onRemoveCustom={(id) =>
              setState((s) => ({ ...s, custom: { ...s.custom, [weekKey]: (s.custom[weekKey] ?? []).filter((c) => c.id !== id) } }))
            }
            onGoPlan={() => setTab('woche')}
          />
        )}

        {tab === 'rezepte' && (
          <RecipeBrowser
            filters={state.filters}
            onFilters={(f) => setState((s) => ({ ...s, filters: f }))}
            onOpen={(r) => setSheet({ recipe: r, mode: 'pick' })}
          />
        )}
      </main>

      <nav className="tabbar">
        {(
          [
            ['woche', '📅', 'Woche'],
            ['wischen', '👆', 'Wischen'],
            ['liste', '🛒', 'Liste'],
            ['rezepte', '📖', 'Rezepte'],
          ] as [Tab, string, string][]
        ).map(([t, icon, label]) => (
          <button
            key={t}
            className={tab === t ? 'active' : ''}
            onClick={() => {
              if (t === 'wischen') setSwipeDay(days.find((d) => !state.plan[d]) ?? swipeDay)
              setTab(t)
            }}
          >
            <span className="tab-icon">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {sheet && (
        <RecipeSheet
          key={sheet.recipe.id}
          recipe={sheet.recipe}
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
              : sheet.mode === 'view' && sheet.day
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
