import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PlanEntry, Recipe } from './types'
import { BREAKFASTS, RECIPES, RECIPE_BY_ID } from './data/recipes'
import { BREAKFAST_LABEL, type BreakfastType } from './types'
import { assignBreakfasts, prepPlan, workdays } from './breakfast'
import { BreakfastCard, shortTitle } from './components/BreakfastCard'
import { DayActionsSheet } from './components/DayActionsSheet'
import { StartCard, type StartStep } from './components/StartCard'
import { PrepSheet } from './components/PrepSheet'
import { ProfileSheet } from './components/ProfileSheet'
import { ProgressSheet } from './components/ProgressSheet'
import { suggestion as weightSuggestion, upsertWeighIn, weighedThisWeek } from './progress'
import { type DayBalance, type Portion, dayBalance, isWorkday, portionFor, targetKcal, DEFAULT_BREAKFAST_KCAL } from './energy'
import { type AppState, addDays, mondayOf, isoDate, parseIso, shortDate, useAppState, weekDays, weekdayName, weekLabel } from './store'
import { useBackStack } from './useBackStack'
import { matches } from './filter'
import { formatAmount } from './shopping'
import {
  type BuyItem,
  addDaysIso,
  cookDue,
  daysUntil,
  formatEuro,
  insight,
  lastSeenMap,
  planWeek,
  uid,
  uncook,
  PANTRY_ONLY_MAX_EURO,
} from './kitchen'
import { type Notice, WeekView } from './components/WeekView'
import { SwipeDeck } from './components/SwipeDeck'
import { FilterSheet, activeFilterCount } from './components/FilterBar'
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

/** Stand vor einer Aktion – „Rückgängig“ stellt ihn komplett wieder her */
interface Snapshot {
  state: AppState
  rejected: string[]
  swipeDay: string
  tab: Tab
  meal: 'dinner' | 'breakfast'
}

const TOAST_MS = 2200
const TOAST_UNDO_MS = 6000

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
  // App bleibt oft tagelang offen: wer die „aktuelle“ Woche ansieht, wandert beim Wochenwechsel mit
  const defaultMonday = (iso: string) => {
    const d = new Date(iso + 'T12:00:00')
    const m = mondayOf(d)
    return isoDate(d.getDay() === 6 || d.getDay() === 0 ? addDays(m, 7) : m)
  }
  const lastToday = useRef(today)
  useEffect(() => {
    const prev = lastToday.current
    lastToday.current = today
    if (prev !== today && isoDate(monday) === defaultMonday(prev) && defaultMonday(today) !== defaultMonday(prev)) {
      setMonday(parseIso(defaultMonday(today)))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today])
  const weekKey = days[0]
  const [swipeDay, setSwipeDay] = useState<string>(days[0])
  const [sheet, setSheet] = useState<SheetState | null>(null)
  const [toast, setToast] = useState<{ msg: string; undo?: Snapshot } | null>(null)
  const toastTimer = useRef<number>()
  const [showFilters, setShowFilters] = useState(false)
  const [rejected, setRejected] = useState<string[]>([])
  /** Wischen & Rezepte: Abendessen oder Frühstück */
  const [meal, setMeal] = useState<'dinner' | 'breakfast'>('dinner')
  const [bTypes, setBTypes] = useState<BreakfastType[]>([])
  const [bPantryOnly, setBPantryOnly] = useState(false)
  const [showPrep, setShowPrep] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  /** Tag, dessen „⋯“-Aktionen offen sind */
  const [actionsDay, setActionsDay] = useState<string | null>(null)
  /** Start-Checkliste gerade abgeschlossen → einmal „Alles eingerichtet“ zeigen */
  const [justFinished, setJustFinished] = useState(false)
  const finishShown = useRef(false)

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
      const b = cookDue(s.breakfast, r.pantry, today)
      return r.changed || b.changed ? { ...s, plan: r.plan, breakfast: b.plan, pantry: b.pantry } : s
    })
  }, [today, setState])

  useEffect(() => setRejected([]), [weekKey])

  /** Toast zeigen; mit `undo` (Stand vor der Aktion) bleibt er länger und bekommt den Knopf „Rückgängig“ */
  const flash = useCallback((msg: string, undo?: Snapshot) => {
    window.clearTimeout(toastTimer.current)
    setToast({ msg, undo })
    toastTimer.current = window.setTimeout(() => setToast(null), undo ? TOAST_UNDO_MS : TOAST_MS)
  }, [])

  // immer der aktuelle Stand – auch für Callbacks, die verzögert feuern (Karten-Animation)
  const live = useRef<Snapshot>(null!)
  live.current = { state, rejected, swipeDay, tab, meal }
  const snapshot = () => live.current

  function undo() {
    const u = toast?.undo
    if (!u) return
    setState(u.state)
    setRejected(u.rejected)
    setSwipeDay(u.swipeDay)
    setTab(u.tab)
    setMeal(u.meal)
    flash('Rückgängig gemacht ✓')
  }

  // ───── Zurück-Taste: erst Sheets schließen, dann zur Woche, erst dort die App verlassen ─────
  const layers: [boolean, () => void][] = [
    [tab !== 'woche', () => setTab('woche')],
    [showFilters, () => setShowFilters(false)],
    [!!actionsDay, () => setActionsDay(null)],
    [!!sheet, () => setSheet(null)],
    [showPrep, () => setShowPrep(false)],
    [showProgress, () => setShowProgress(false)],
    [showProfile, () => setShowProfile(false)],
  ]
  const open = layers.filter(([on]) => on)
  useBackStack(open.length, (target) => open.slice(target).forEach(([, close]) => close()))

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
    () => planWeek(state.plan, days, state.pantry, state.bought[weekKey] ?? {}, today, state.prices, formatAmount, state.breakfast),
    [state.plan, days, state.pantry, state.bought, weekKey, today, state.prices, state.breakfast],
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
  // Einkauf am Wochenanfang (oder heute) → wie viele Tage bis zum gewischten Kochtag?
  const freshDays = Math.max(0, daysUntil(swipeDay, today > days[0] ? today : days[0]))
  const insights = useMemo(
    () =>
      new Map(
        RECIPES.map((r) => [
          r.id,
          insight(r, state.defaultServings, week.leftovers, today, state.prices, lastSeen, jitter.get(r.id) ?? 0, weekRecipes, {
            freshDays: freshDays,
          }),
        ]),
      ),
    [week.leftovers, today, state.prices, lastSeen, jitter, state.defaultServings, weekRecipes, freshDays],
  )
  const perPortion = useMemo(() => new Map([...insights].map(([id, i]) => [id, i.perPortion])), [insights])

  const plannedIds = useMemo(
    () => new Set(days.map((d) => state.plan[d]).filter((e) => e && e.status !== 'skipped').map((e) => e!.recipeId)),
    [days, state.plan],
  )
  const activeFilters = activeFilterCount(state.filters)
  const filteredCount = RECIPES.filter(
    (r) => matches(r, state.filters, perPortion.get(r.id)) && (!state.filters.pantryOnly || insights.get(r.id)!.buyCost <= PANTRY_ONLY_MAX_EURO),
  ).length
  const deck = useMemo(() => {
    const list = RECIPES.filter(
      (r) =>
        matches(r, state.filters, perPortion.get(r.id)) &&
        !plannedIds.has(r.id) &&
        (!state.filters.pantryOnly || insights.get(r.id)!.buyCost <= PANTRY_ONLY_MAX_EURO),
    )
    const rej = new Set(rejected)
    const fresh = list.filter((r) => !rej.has(r.id)).sort((a, b) => insights.get(b.id)!.score - insights.get(a.id)!.score)
    const later = rejected.map((id) => list.find((r) => r.id === id)).filter((r): r is Recipe => !!r)
    return [...fresh, ...later]
  }, [state.filters, perPortion, plannedIds, rejected, insights])

  // ───── Frühstück ─────
  const picks = state.breakfastPicks[weekKey] ?? []
  const assignment = useMemo(() => assignBreakfasts(picks, days), [picks, days])
  const prepItems = useMemo(() => prepPlan(assignment), [assignment])
  const prepTotal = prepItems.reduce((n, i) => n + i.recipe.steps.length, 0)
  const prepDone = (state.prepChecked[weekKey] ?? []).filter((k) => prepItems.some((i) => k.startsWith(i.recipe.id + ':'))).length
  const bLastSeen = useMemo(() => lastSeenMap(state.breakfast, days[0]), [state.breakfast, days])
  const bInsights = useMemo(
    () =>
      new Map(
        // Portionen, die dieses Frühstück abdecken würde: erstes ≈ 3 Tage, zweites ≈ 2 Tage
        BREAKFASTS.map((r) => [r.id, insight(r, picks.length ? 2 : 3, week.leftovers, today, state.prices, bLastSeen, jitter.get(r.id) ?? 0, [])]),
      ),
    [week.leftovers, today, state.prices, bLastSeen, jitter, picks.length],
  )
  const bDeck = useMemo(() => {
    const list = BREAKFASTS.filter(
      (r) =>
        (!bTypes.length || bTypes.includes(r.breakfast!.type)) &&
        !picks.includes(r.id) &&
        (!bPantryOnly || bInsights.get(r.id)!.buyCost <= PANTRY_ONLY_MAX_EURO),
    )
    const rej = new Set(rejected)
    // beim zweiten Frühstück: Kombinationen bevorzugen, die Mo–Fr komplett abdecken
    const fits = (r: Recipe) => picks.length !== 1 || Object.keys(assignBreakfasts([picks[0], r.id], days).days).length === 5
    const score = (r: Recipe) => bInsights.get(r.id)!.score + (fits(r) ? 0 : -30)
    const fresh = list.filter((r) => !rej.has(r.id)).sort((a, b) => score(b) - score(a))
    const later = rejected.map((id) => list.find((r) => r.id === id)).filter((r): r is Recipe => !!r)
    return [...fresh, ...later]
  }, [bTypes, picks, rejected, bInsights, days, bPantryOnly])

  /** Frühstücke für die Woche festlegen und auf Mo–Fr verteilen */
  function setPicks(ids: string[]) {
    const a = assignBreakfasts(ids, days)
    setState((s) => {
      const breakfast = { ...s.breakfast }
      let pantry = s.pantry
      for (const d of workdays(days)) {
        const old = breakfast[d]
        if (old?.status === 'cooked') pantry = uncook(old, pantry)
        delete breakfast[d]
        if (a.days[d]) breakfast[d] = { recipeId: a.days[d], servings: 1 }
      }
      return { ...s, breakfast, pantry, breakfastPicks: { ...s.breakfastPicks, [weekKey]: ids } }
    })
  }

  function pickBreakfast(r: Recipe) {
    const snap = snapshot()
    const next = [...picks.filter((id) => id !== r.id), r.id].slice(-2)
    setPicks(next)
    const covered = Object.keys(assignBreakfasts(next, days).days).length
    if (next.length >= 2 || covered === 5) {
      flash(`☀️ Frühstück steht: ${next.map((id) => RECIPE_BY_ID[id].title).join(' + ')}`, snap)
      setTab('woche')
    } else {
      flash(`${r.title} ✓ – wähle noch eins`, snap)
    }
  }

  // ───── Kalorienbilanz (Mo–Fr) ─────
  const profile = state.profile
  const { balances, portions } = useMemo(() => {
    const balances: Record<string, DayBalance | undefined> = {}
    const portions: Record<string, Portion | undefined> = {}
    if (profile) {
      for (const d of days) {
        if (!isWorkday(d)) continue
        const b = dayBalance(profile, state.breakfast[d], state.plan[d])
        balances[d] = b
        const e = state.plan[d]
        if (e && RECIPE_BY_ID[e.recipeId]) portions[d] = portionFor(RECIPE_BY_ID[e.recipeId], b.dinnerBudget, e.servings)
      }
    }
    return { balances, portions }
  }, [profile, days, state.breakfast, state.plan])
  /** Abendbudget für einen Tag (auch wenn dort noch nichts geplant ist) */
  const dinnerBudgetFor = (day: string) =>
    profile && isWorkday(day)
      ? Math.max(0, targetKcal(profile) - (RECIPE_BY_ID[state.breakfast[day]?.recipeId ?? '']?.nutrition.kcal ?? DEFAULT_BREAKFAST_KCAL) - profile.lunchKcal)
      : undefined

  // ───── Wiegen & Anpassung ─────
  const weighIns = state.weighIns
  const pendingSuggestion = profile ? weightSuggestion(weighIns, profile, state.adjustDecidedAt) : null
  const needsWeighIn = !!profile && !weighedThisWeek(weighIns, today)

  // ───── Start-Checkliste (nur beim allerersten Benutzen) ─────
  const onboarding = !state.onboarding
  const plannedCount = days.filter((d) => state.plan[d]).length
  const openDay = days.find((d) => !state.plan[d] && d >= today)
  const dinnersDone = plannedCount > 0 && !openDay
  const somethingPlanned = plannedCount > 0 || picks.length > 0
  const listDone = !!state.onboardingListSeen
  const allDone = !!profile && picks.length > 0 && dinnersDone && listDone
  useEffect(() => {
    if (!onboarding) return
    if (tab === 'liste' && somethingPlanned && !listDone) setState((s) => ({ ...s, onboardingListSeen: true }))
    else if (allDone) {
      setState((s) => ({ ...s, onboarding: 'done' }))
      setJustFinished(true)
    }
  }, [onboarding, tab, somethingPlanned, listDone, allDone, setState])
  // „Alles eingerichtet“ verschwindet, sobald man die Woche einmal damit gesehen hat und den Tab wechselt
  useEffect(() => {
    if (!justFinished) return
    if (tab === 'woche') finishShown.current = true
    else if (finishShown.current) setJustFinished(false)
  }, [tab, justFinished])
  // Wiegetag: nicht während der Checkliste und frühestens am Tag nach dem Anlegen des Profils
  const weighDue = needsWeighIn && !onboarding && (!state.profileCreated || today > state.profileCreated)

  const urgentNames = new Set(state.pantry.filter((l) => daysUntil(l.expires, today) <= 2).map((l) => l.name))

  function startSwipe(day: string) {
    setMeal('dinner')
    setSwipeDay(day)
    setTab('wischen')
  }

  function take(recipe: Recipe, day: string, servings = state.defaultServings) {
    const snap = snapshot()
    setEntry(day, { recipeId: recipe.id, servings })
    const idx = days.indexOf(day)
    const nextEmpty = [...days.slice(idx + 1), ...days.slice(0, idx)].find((d) => d !== day && !state.plan[d] && d >= today)
    if (nextEmpty) {
      flash(`${weekdayName(day)}: ${recipe.title} ✓`, snap)
      setSwipeDay(nextEmpty)
    } else {
      flash('Woche komplett geplant! 🎉', snap)
      setTab('woche')
    }
  }

  /** Karte nach links: ans Ende des Stapels */
  function reject(r: Recipe) {
    const snap = snapshot()
    setRejected((x) => [...x.filter((id) => id !== r.id), r.id])
    flash(`Übersprungen: ${r.title}`, snap)
  }

  function removeEntry(day: string) {
    const snap = snapshot()
    setEntry(day, undefined)
    flash(`${weekdayName(day)} geleert`, snap)
  }

  function changeWeek(delta: number) {
    // ein Snapshot gehört zur angezeigten Woche
    setToast((t) => (t?.undo ? null : t))
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
      const needed = item.packs * item.product.pack
      if (b && b.amount < needed - 1e-6) {
        // Portionen wurden nach dem Einkauf erhöht → nur die fehlende Menge nachkaufen
        const delta = needed - b.amount
        const has = pantry.some((l) => l.id === b.lotId)
        if (has) pantry = pantry.map((l) => (l.id === b.lotId ? { ...l, amount: l.amount + delta } : l))
        else pantry = [...pantry, { id: b.lotId, name: item.name, amount: delta, unit: item.unit, expires: addDaysIso(today, item.product.shelf) }]
        wk[item.name] = { lotId: b.lotId, amount: needed }
        checked.add(item.key)
      } else if (b) {
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
    const snap = snapshot()
    flash('Haken zurückgesetzt', snap)
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
    const snap = snapshot()
    const wasCooked = state.plan[day]?.status === 'cooked'
    setState((s) => {
      const e = s.plan[day]
      if (!e) return s
      return { ...s, pantry: uncook(e, s.pantry), plan: { ...s.plan, [day]: { ...e, status: 'skipped', consumed: undefined } } }
    })
    flash(wasCooked ? 'Zutaten zurück im Vorrat' : `${weekdayName(day)}: nicht gekocht`, snap)
  }

  function recookDay(day: string) {
    flash(`${weekdayName(day)}: doch gekocht`, snapshot())
    setState((s) => {
      const e = s.plan[day]
      if (!e) return s
      const plan = { ...s.plan, [day]: { ...e, status: undefined } }
      const r = cookDue(plan, s.pantry, today)
      return { ...s, plan: r.plan, pantry: r.pantry }
    })
  }

  const startSteps: StartStep[] = [
    {
      title: 'Profil anlegen',
      sub: profile ? `Tagesziel ${targetKcal(profile).toLocaleString('de-DE')} kcal` : 'Alter, Größe, Gewicht – daraus wird dein Kalorienziel',
      verb: 'Anlegen',
      done: !!profile,
      editable: true,
      onClick: () => setShowProfile(true),
    },
    {
      title: 'Frühstück für Mo–Fr wählen',
      sub: picks.length ? picks.map((id) => shortTitle(RECIPE_BY_ID[id]?.title ?? '')).join(' + ') : '1–2 Rezepte, einmal am Sonntag vorbereiten',
      verb: 'Wählen',
      done: picks.length > 0,
      editable: true,
      onClick: () => {
        setMeal('breakfast')
        setTab('wischen')
      },
    },
    {
      title: 'Abendessen wischen',
      sub: dinnersDone
        ? `${plannedCount} von 7 Tagen geplant`
        : plannedCount > 0 && openDay
          ? `${plannedCount} von 7 Tagen geplant – weiter ab ${weekdayName(openDay)}`
          : 'Für jeden Tag ein Gericht – nach Vorrat und Preis sortiert',
      verb: plannedCount > 0 ? 'Weiter' : 'Los geht’s',
      done: dinnersDone,
      editable: true,
      onClick: () => startSwipe(openDay ?? days.find((d) => d >= today) ?? days[0]),
    },
    {
      title: 'Einkaufsliste ansehen',
      sub: listDone
        ? `≈ ${formatEuro(week.total)} · ${week.buy.length} Artikel`
        : somethingPlanned
          ? 'Nach Regal sortiert, mit Packungsgrößen und Preisen'
          : 'Sobald etwas geplant ist',
      verb: 'Zur Liste',
      done: listDone,
      locked: !somethingPlanned,
      onClick: () => setTab('liste'),
    },
  ]

  // höchstens ein Hinweis über dem Plan: Vorrat läuft ab > Vorschlag > Wiegetag
  const notice: Notice | undefined = justFinished
    ? { text: '✓ Alles eingerichtet – guten Appetit!', tone: 'ok' }
    : urgentNames.size > 0
      ? { text: `⚠ ${urgentNames.size} ${urgentNames.size === 1 ? 'Zutat läuft' : 'Zutaten laufen'} bald ab`, tone: 'warn', onClick: () => setTab('vorrat') }
      : pendingSuggestion
        ? { text: `Vorschlag: Tagesziel ${pendingSuggestion.title}`, onClick: () => setShowProgress(true) }
        : weighDue
          ? { text: 'Wiegetag – Werte eintragen', onClick: () => setShowProgress(true) }
          : undefined

  const tabTitle = tab === 'vorrat' ? 'Vorrat' : tab === 'rezepte' ? 'Rezepte' : null
  const actionsEntry = actionsDay ? state.plan[actionsDay] : undefined
  const actionsRecipe = actionsEntry ? RECIPE_BY_ID[actionsEntry.recipeId] : undefined

  const weekNav = (
    <div className="weeknav">
      <button className="icon-btn" onClick={() => changeWeek(-1)} aria-label="Vorige Woche">‹</button>
      <span className="week-label">
        <b>{weekLabel(monday).split(' · ')[0]}</b>
        <small>{weekLabel(monday).split(' · ')[1]}</small>
      </span>
      <button className="icon-btn" onClick={() => changeWeek(1)} aria-label="Nächste Woche">›</button>
    </div>
  )

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="logo">🍳</span> {tabTitle ? <h1 className="top-title">{tabTitle}</h1> : <span className="brand-name">Yami</span>}
        </div>
        <div className="top-right">
          {!tabTitle && weekNav}
          <button
            className={`icon-btn profile-btn ${weighDue || pendingSuggestion ? 'dot-badge' : ''}`}
            onClick={() => (profile ? setShowProgress(true) : setShowProfile(true))}
            aria-label="Wiegen & Fortschritt"
            title="Wiegen & Fortschritt"
          >
            ⚖️
          </button>
          <button className="icon-btn profile-btn" onClick={() => setShowProfile(true)} aria-label="Profil & Kalorienziel" title="Profil & Kalorienziel">
            👤
          </button>
        </div>
      </header>

      <main className={`content ${tab === 'wischen' ? 'swipe' : ''}`}>
        {tab === 'woche' && (
          <WeekView
            days={days}
            plan={state.plan}
            today={today}
            total={week.total}
            prices={state.prices}
            notice={notice}
            startSlot={
              onboarding ? (
                <StartCard
                  steps={startSteps}
                  onDismiss={() => {
                    setState((s) => ({ ...s, onboarding: 'dismissed' }))
                    flash('Du findest Profil und Wiegen oben rechts.')
                  }}
                />
              ) : undefined
            }
            hideDays={onboarding && plannedCount === 0}
            onSwipeDay={startSwipe}
            onOpen={(r, day) => setSheet({ recipe: r, day, mode: 'view' })}
            onMore={setActionsDay}
            onShop={() => setTab('liste')}
            balances={balances}
            portions={portions}
            breakfastSlot={
              onboarding && !picks.length ? undefined : (
                <BreakfastCard
                  picks={picks}
                  assignment={assignment}
                  prepProgress={{ done: prepDone, total: prepTotal }}
                  open={!!state.bfOpen}
                  onToggle={() => setState((s) => ({ ...s, bfOpen: !s.bfOpen }))}
                  onPlan={() => {
                    setMeal('breakfast')
                    setTab('wischen')
                  }}
                  onPrep={() => setShowPrep(true)}
                  onOpen={(r) => setSheet({ recipe: r, mode: 'view' })}
                  onReset={() => {
                    flash('Frühstück zurückgesetzt', snapshot())
                    setPicks([])
                    setMeal('breakfast')
                    setTab('wischen')
                  }}
                />
              )
            }
          />
        )}

        {tab === 'wischen' && (
          <div className="swipe-screen">
            <MealToggle meal={meal} onChange={setMeal} />
            {meal === 'breakfast' ? (
              <>
                <div className="swipe-head">
                  <h1>
                    ☀️ Frühstück <span className="accent">Mo–Fr</span>
                  </h1>
                  {picks.length === 1 ? (
                    <button className="chip" onClick={() => setTab('woche')} aria-label={`Nur ${RECIPE_BY_ID[picks[0]]?.title ?? 'dieses Frühstück'} nehmen – fertig`}>
                      1/2 · Fertig →
                    </button>
                  ) : (
                    <span className="muted small">{picks.length}/2 gewählt</span>
                  )}
                </div>
                <p className="muted small swipe-note">
                  Wähle 1–2 Frühstücke zum Vorbereiten am Sonntag. Das kürzer haltbare kommt Mo–Mi, das länger haltbare Do–Fr.
                </p>
                <div className="chips-row">
                  <button className={`chip ${bPantryOnly ? 'on' : ''}`} onClick={() => setBPantryOnly((v) => !v)}>
                    🧺 Nur mit Vorrat
                  </button>
                  {(Object.keys(BREAKFAST_LABEL) as BreakfastType[]).map((t) => (
                    <button
                      key={t}
                      className={`chip ${bTypes.includes(t) ? 'on' : ''}`}
                      onClick={() => setBTypes((x) => (x.includes(t) ? x.filter((y) => y !== t) : [...x, t]))}
                    >
                      {BREAKFAST_LABEL[t]}
                    </button>
                  ))}
                </div>
                <SwipeDeck
                  deck={bDeck}
                  insights={bInsights}
                  onTake={pickBreakfast}
                  onReject={reject}
                  onInfo={(r) => setSheet({ recipe: r, mode: 'take' })}
                />
                <p className="hint toast-slot">← nächstes · wählen →</p>
              </>
            ) : (
              <>
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
              <button className={`chip ${activeFilters ? 'on' : ''}`} onClick={() => setShowFilters(true)} aria-haspopup="dialog">
                ⚙︎ Filter{activeFilters ? ` (${activeFilters})` : ''}
              </button>
            </div>
            {state.plan[swipeDay] && (
              <p className="muted small center swipe-note">
                Aktuell geplant: {RECIPE_BY_ID[state.plan[swipeDay]!.recipeId]?.title}. Nach rechts wischen ersetzt es.
              </p>
            )}
            <SwipeDeck
              portionOf={(r) => {
                const budget = dinnerBudgetFor(swipeDay)
                return budget != null ? portionFor(r, budget, state.defaultServings) : undefined
              }}
              deck={deck}
              insights={insights}
              onTake={(r) => take(r, swipeDay)}
              onReject={reject}
              onInfo={(r) => setSheet({ recipe: r, day: swipeDay, mode: 'take' })}
            />
            <p className="hint toast-slot">← wegwischen · nehmen → · sortiert nach Vorrat, Preis & Abwechslung</p>
              </>
            )}
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
            onChange={(pantry) => {
              const removed = state.pantry.find((l) => !pantry.some((x) => x.id === l.id))
              if (removed) flash(`${removed.name} entfernt`, snapshot())
              setState((s) => ({ ...s, pantry }))
            }}
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
            meal={meal}
            onMeal={setMeal}
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
          portion={(() => {
            const day = sheet.day
            if (sheet.recipe.breakfast || !day) return undefined
            const budget = dinnerBudgetFor(day)
            return budget != null ? { ...portionFor(sheet.recipe, budget, state.plan[day]?.servings ?? state.defaultServings), budget } : undefined
          })()}
          servings={
            sheet.recipe.breakfast
              ? 1
              : ((sheet.day && state.plan[sheet.day]?.recipeId === sheet.recipe.id ? state.plan[sheet.day]?.servings : undefined) ??
                state.defaultServings)
          }
          onClose={() => setSheet(null)}
          action={
            sheet.recipe.breakfast
              ? sheet.mode === 'take' || sheet.mode === 'pick'
                ? {
                    label: picks.includes(sheet.recipe.id) ? '✓ Schon gewählt' : '☀️ Fürs Frühstück Mo–Fr wählen',
                    onClick: () => {
                      if (!picks.includes(sheet.recipe.id)) pickBreakfast(sheet.recipe)
                      setSheet(null)
                    },
                  }
                : undefined
              : sheet.mode === 'take' && sheet.day
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

      {sheet?.mode === 'pick' && !sheet.recipe.breakfast && (
        <DayPicker
          days={days}
          plan={state.plan}
          onPick={(day) => {
            const snap = snapshot()
            setEntry(day, { recipeId: sheet.recipe.id, servings: state.defaultServings })
            flash(`${sheet.recipe.title} → ${weekdayName(day)} ✓`, snap)
            setSheet(null)
          }}
        />
      )}

      {actionsDay && actionsEntry && actionsRecipe && (
        <DayActionsSheet
          day={actionsDay}
          entry={actionsEntry}
          recipe={actionsRecipe}
          today={today}
          prices={state.prices}
          balance={balances[actionsDay]}
          portion={portions[actionsDay]}
          onClose={() => setActionsDay(null)}
          onServings={(n) => setEntry(actionsDay, { ...actionsEntry, servings: n })}
          onView={() => {
            setActionsDay(null)
            setSheet({ recipe: actionsRecipe, day: actionsDay, mode: 'view' })
          }}
          onSwap={() => {
            setActionsDay(null)
            startSwipe(actionsDay)
          }}
          onUncook={() => {
            setActionsDay(null)
            uncookDay(actionsDay)
          }}
          onRecook={() => {
            setActionsDay(null)
            recookDay(actionsDay)
          }}
          onRemove={() => {
            setActionsDay(null)
            removeEntry(actionsDay)
          }}
        />
      )}

      {showPrep && (
        <PrepSheet
          items={prepItems}
          notes={assignment.notes}
          checked={state.prepChecked[weekKey] ?? []}
          onToggle={(key) =>
            setState((s) => {
              const cur = new Set(s.prepChecked[weekKey] ?? [])
              if (cur.has(key)) cur.delete(key)
              else cur.add(key)
              return { ...s, prepChecked: { ...s.prepChecked, [weekKey]: [...cur] } }
            })
          }
          onClose={() => setShowPrep(false)}
        />
      )}

      {showProgress && profile && (
        <ProgressSheet
          profile={profile}
          weighIns={weighIns}
          today={today}
          suggestion={pendingSuggestion}
          onClose={() => setShowProgress(false)}
          onSave={(w) => {
            setState((s) => {
              const list = upsertWeighIn(s.weighIns, w)
              const latest = list[list.length - 1]
              // Profil folgt der neuesten Messung (Gewicht & Körperfett → genauere Bedarfsformel)
              const profile = s.profile ? { ...s.profile, weightKg: latest.weight, fatPct: latest.fat ?? s.profile.fatPct } : s.profile
              return { ...s, weighIns: list, profile }
            })
            flash('Messung gespeichert ✓')
          }}
          onDelete={(date) => {
            flash('Messung gelöscht', snapshot())
            setState((s) => {
              const weighIns = s.weighIns.filter((x) => x.date !== date)
              const latest = weighIns[weighIns.length - 1]
              const profile =
                s.profile && latest
                  ? { ...s.profile, weightKg: latest.weight, fatPct: [...weighIns].reverse().find((x) => x.fat != null)?.fat }
                  : s.profile
              return { ...s, weighIns, profile }
            })
          }}
          onDecide={(accept) => {
            setState((s) => ({
              ...s,
              adjustDecidedAt: s.weighIns.length,
              profile: accept && s.profile && pendingSuggestion ? { ...s.profile, adjust: (s.profile.adjust ?? 0) + pendingSuggestion.delta } : s.profile,
            }))
            flash(accept ? 'Tagesziel angepasst ✓' : 'Ziel bleibt wie es ist')
          }}
          onGoal={(kg) => setState((s) => (s.profile ? { ...s, profile: { ...s.profile, goalWeight: kg && kg > 30 ? kg : undefined } } : s))}
          onMuscleUnit={(u) => setState((s) => (s.profile ? { ...s, profile: { ...s.profile, muscleUnit: u } } : s))}
        />
      )}

      {showProfile && (
        <ProfileSheet
          profile={profile}
          onClose={() => setShowProfile(false)}
          onSave={(p) => {
            setState((s) => ({ ...s, profile: p, profileCreated: s.profile ? s.profileCreated : today }))
            setShowProfile(false)
            flash(`Tagesziel: ${targetKcal(p).toLocaleString('de-DE')} kcal ✓`)
          }}
        />
      )}

      {showFilters && (
        <FilterSheet
          filters={state.filters}
          onChange={(f) => setState((s) => ({ ...s, filters: f }))}
          count={filteredCount}
          onClose={() => setShowFilters(false)}
        />
      )}

      {toast && (
        <div className={`toast ${toast.undo ? 'has-undo' : ''}`} role="status">
          <span className="toast-msg">{toast.msg}</span>
          {toast.undo && (
            <button className="toast-undo" onClick={undo}>
              Rückgängig
            </button>
          )}
        </div>
      )}
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

function MealToggle({ meal, onChange }: { meal: 'dinner' | 'breakfast'; onChange: (m: 'dinner' | 'breakfast') => void }) {
  return (
    <div className="segmented" role="tablist">
      <button className={meal === 'breakfast' ? 'on' : ''} onClick={() => onChange('breakfast')} role="tab" aria-selected={meal === 'breakfast'}>
        ☀️ Frühstück
      </button>
      <button className={meal === 'dinner' ? 'on' : ''} onClick={() => onChange('dinner')} role="tab" aria-selected={meal === 'dinner'}>
        🌙 Abendessen
      </button>
    </div>
  )
}

export { MealToggle }
