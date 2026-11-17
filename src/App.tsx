import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CustomIngredient, CustomRecipe, PlanEntry, Recipe } from './types'
import { BREAKFASTS, RECIPES, RECIPE_BY_ID } from './data/recipes'
import { BREAKFAST_LABEL, type BreakfastType } from './types'
import { applyBreakfastPicks, assignBreakfasts, coveredDays, learnedPrepWeekday, prepOptions, prepPlan, resolvePrepDay } from './breakfast'
import { BreakfastCard, shortTitle } from './components/BreakfastCard'
import { DayActionsSheet } from './components/DayActionsSheet'
import { PantryDaySheet } from './components/PantryDaySheet'
import { StartCard, type StartStep } from './components/StartCard'
import { PrepSheet } from './components/PrepSheet'
import { PrepDayChip } from './components/PrepDayChip'
import { pantryWishes } from './learning'
import { type Rating, buildModel, pendingRating, preference, summarize } from './learning'
import { ProfileSheet } from './components/ProfileSheet'
import { exportBackup } from './backup'
import { ProgressSheet } from './components/ProgressSheet'
import { ReviewCard } from './components/ReviewCard'
import { ReviewSheet } from './components/ReviewSheet'
import { defaultReviewMonday, weekReview } from './review'
import { suggestion as weightSuggestion, upsertWeighIn, weighedThisWeek } from './progress'
import { type DayBalance, type Portion, dayBalance, isProteinLow, isWorkday, portionFor, proteinBoost, targetKcal, DEFAULT_BREAKFAST_KCAL } from './energy'
import { type AppState, addDays, mondayOf, isoDate, parseIso, shortDate, useAppState, weekDays, weekdayName, weekLabel } from './store'
import { useBackStack } from './useBackStack'
import { matches } from './filter'
import { formatAmount, isBought } from './shopping'
import { isSpice, stapleHints, toggleSpiceBought, useEvents, type SpiceStatus } from './staples'
import {
  type BuyItem,
  addDaysIso,
  cookDue,
  discardWaste,
  moveExpired,
  daysUntil,
  formatEuro,
  insight,
  lastSeenMap,
  planWeek,
  uid,
  uncook,
  unbuy,
  PANTRY_ONLY_MAX_EURO,
  WASTED_MAX,
} from './kitchen'
import { type Notice, WeekView } from './components/WeekView'
import { SwipeDeck } from './components/SwipeDeck'
import { FilterSheet, activeFilterCount } from './components/FilterBar'
import { RecipeSheet } from './components/RecipeSheet'
import { ShoppingList } from './components/ShoppingList'
import { localItems } from './haSync'
import { useHomeAssistant } from './useHa'
import { RecipeBrowser } from './components/RecipeBrowser'
import { RecipeEditor } from './components/RecipeEditor'
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
  /** Kochmodus über dem Rezept-Sheet */
  const [cooking, setCooking] = useState(false)
  useEffect(() => {
    if (!sheet) setCooking(false)
  }, [sheet])
  const [toast, setToast] = useState<{ msg: string; undo?: Snapshot } | null>(null)
  const toastTimer = useRef<number>()
  const [showFilters, setShowFilters] = useState(false)
  const [rejected, setRejected] = useState<string[]>([])
  /** Wischen & Rezepte: Abendessen oder Frühstück */
  const [meal, setMeal] = useState<'dinner' | 'breakfast'>('dinner')
  const [bTypes, setBTypes] = useState<BreakfastType[]>([])
  const [bPantryOnly, setBPantryOnly] = useState(false)
  /** Rezept-Editor: leer = neues Rezept */
  const [editor, setEditor] = useState<{ recipe?: CustomRecipe } | null>(null)
  const [showPrep, setShowPrep] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  /** Wochenrückblick-Sheet: Montag der gezeigten Woche (null = zu) */
  const [reviewMonday, setReviewMonday] = useState<string | null>(null)
  /** Tag, dessen „⋯“-Aktionen offen sind */
  const [actionsDay, setActionsDay] = useState<string | null>(null)
  /** Start-Checkliste gerade abgeschlossen → einmal „Alles eingerichtet“ zeigen */
  const [justFinished, setJustFinished] = useState(false)
  /** „Was koche ich damit?“: Tag wählen (Sheet) und Wischen nach Vorrat sortieren */
  const [pantryChooser, setPantryChooser] = useState(false)
  const [pantryMode, setPantryMode] = useState(false)
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

  // vergangene Gerichte gelten als gekocht → Zutaten vom Vorrat abziehen – beim Tageswechsel und sobald ein vergangener
  // Tag neu belegt wird (z. B. „Anderes Gericht wischen“ für gestern, Frühstück neu verteilt); cookDue ist idempotent
  useEffect(() => {
    setState((s) => {
      const r = cookDue(s.plan, s.pantry, today)
      const b = cookDue(s.breakfast, r.pantry, today)
      // vor mehr als 7 Tagen abgelaufen → gilt als weggeworfen
      const x = moveExpired(b.pantry, s.wasted, today, s.prices)
      return r.changed || b.changed || x.changed ? { ...s, plan: r.plan, breakfast: b.plan, pantry: x.pantry, wasted: x.wasted } : s
    })
  }, [today, state.plan, state.breakfast, setState])

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
    // Home-Assistant-Zuordnung bleibt, wie sie ist (sie beschreibt, was dort schon liegt)
    setState((cur) => ({ ...u.state, ha: cur.ha }))
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
    [!!editor, () => setEditor(null)],
    [cooking, () => setCooking(false)],
    [showPrep, () => setShowPrep(false)],
    [showProgress, () => setShowProgress(false)],
    [showProfile, () => setShowProfile(false)],
    [reviewMonday !== null, () => setReviewMonday(null)],
    [pantryChooser, () => setPantryChooser(false)],
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
  // Saison: Monat des gewischten Kochtags (Abendessen) bzw. heute (Frühstück & Wocheneinkauf)
  const todayMonth = new Date(today + 'T12:00:00').getMonth() + 1
  const swipeMonth = new Date(swipeDay + 'T12:00:00').getMonth() + 1
  // ab Samstag ist die Liste die der nächsten Woche: was für Sa/So der laufenden Woche noch fehlt, kommt mit drauf
  const carryFor = (key: string) => today < key && key === defaultMonday(today)
  const week = useMemo(
    () => planWeek(state.plan, days, state.pantry, state.bought[weekKey] ?? {}, today, state.prices, formatAmount, state.breakfast, todayMonth, { memo: state.staples, spices: state.spices, carry: carryFor(weekKey) }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.plan, days, state.pantry, state.bought, weekKey, today, state.prices, state.breakfast, todayMonth, state.customRecipes, state.customIngredients, state.staples, state.spices],
  )
  // Lernen: wie lange reichen Öl, Brühe & Co. noch (aus dem Verbrauch der gekochten Gerichte)
  const hints = useMemo(() => stapleHints(useEvents(state.plan, state.breakfast), state.pantry, today), [state.plan, state.breakfast, state.pantry, today])
  // Einkaufsliste für Home Assistant: immer die „aktuelle“ Woche (ab Samstag die nächste), unabhängig von der angezeigten
  const haKey = defaultMonday(today)
  const haWeek = useMemo(
    () =>
      haKey === weekKey
        ? week
        : planWeek(state.plan, weekDays(parseIso(haKey)), state.pantry, state.bought[haKey] ?? {}, today, state.prices, formatAmount, state.breakfast, todayMonth, { memo: state.staples, spices: state.spices, carry: carryFor(haKey) }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [haKey, weekKey, week, state.plan, state.pantry, state.bought, today, state.prices, state.breakfast, todayMonth, state.customRecipes, state.customIngredients, state.staples, state.spices],
  )
  const haLocal = useMemo(() => localItems(haWeek.buy), [haWeek])
  const haRef = useRef({ buy: haWeek.buy, key: haKey })
  haRef.current = { buy: haWeek.buy, key: haKey }
  const ha = useHomeAssistant({
    ha: state.ha,
    setState,
    local: haLocal,
    state,
    // in HA abgehakt → wie Abhaken in der Liste (Vorrat füllt sich)
    onBought: (keys) => {
      const { buy, key } = haRef.current
      for (const k of keys) {
        const it = buy.find((b) => b.key === k)
        if (it && !isBought(it)) toggleBuy(it, key)
      }
    },
  })
  const weekRecipes = useMemo(
    () => days.map((d) => state.plan[d]).filter((e) => e && e.status !== 'skipped').map((e) => RECIPE_BY_ID[e!.recipeId]).filter(Boolean),
    [days, state.plan, state.customRecipes],
  )
  const lastSeen = useMemo(() => lastSeenMap(state.plan, days[0]), [state.plan, days])
  const jitter = useMemo(
    () => new Map(RECIPES.map((r) => [r.id, Math.random()])),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [weekKey],
  )
  // ───── Gelernte Vorlieben ─────
  const taste = useMemo(
    () =>
      buildModel({
        plan: state.plan,
        breakfast: state.breakfast,
        breakfastPicks: state.breakfastPicks,
        rejects: state.rejects,
        ratings: state.ratings,
        wasted: state.wasted,
        today,
        since: state.tasteSince,
        customRecipes: state.customRecipes,
      }),
    [state.plan, state.breakfast, state.breakfastPicks, state.rejects, state.ratings, state.wasted, today, state.tasteSince, state.customRecipes],
  )

  // ───── Eiweiß lernen: zu wenig Eiweiß an den letzten Arbeitstagen → Abendessen mit viel Eiweiß steigen ─────
  const proteinHigh = useMemo(() => {
    if (!state.profile) return false
    const weekEnd = isoDate(addDays(mondayOf(parseIso(today)), 6))
    const last = Object.keys(state.plan)
      .filter((d) => d <= weekEnd && isWorkday(d) && state.plan[d] && state.plan[d]!.status !== 'skipped')
      .sort()
      .slice(-10)
    const low = last.filter((d) => isProteinLow(dayBalance(state.profile!, state.breakfast[d], state.plan[d]))).length
    return low >= 3
  }, [state.profile, state.plan, state.breakfast, today])

  // Einkauf am Wochenanfang (oder heute) → wie viele Tage bis zum gewischten Kochtag?
  const freshDays = Math.max(0, daysUntil(swipeDay, today > days[0] ? today : days[0]))
  const insights = useMemo(
    () =>
      new Map(
        RECIPES.map((r) => {
          // „Was koche ich damit?“: nur der echte Vorrat (ohne geplante Einkäufe) zählt für „x von y da“ und die Reihenfolge
          const ins = insight(r, state.defaultServings, pantryMode ? week.pantryLeft : week.leftovers, today, state.prices, lastSeen, jitter.get(r.id) ?? 0, weekRecipes, {
            freshDays: freshDays,
            month: swipeMonth,
            day: swipeDay,
          })
          const pref = preference(taste, r, swipeDay)
          const bonus = proteinHigh ? proteinBoost(r.nutrition.protein) : 0
          // Vorrats-Modus: Vorrat zuerst, gelernte Vorliebe nur als Tie-Breaker (×0,3)
          return [r.id, { ...ins, score: ins.score + pref.score + bonus, modeScore: ins.modeScore + pref.score * 0.3, taste: pref.reason ?? (bonus > 0 ? '💪 viel Eiweiß' : undefined) }]
        }),
      ),
    [week.leftovers, week.pantryLeft, pantryMode, today, state.prices, lastSeen, jitter, state.defaultServings, weekRecipes, freshDays, taste, swipeDay, swipeMonth, proteinHigh, state.customRecipes, state.customIngredients],
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
    // Vorrats-Modus: nur Gerichte, die etwas aus dem Vorrat brauchen, nach Vorratsnutzung sortiert
    const pool = pantryMode ? list.filter((r) => insights.get(r.id)!.fromPantry.length > 0) : list
    const key = (id: string) => (pantryMode ? insights.get(id)!.modeScore : insights.get(id)!.score)
    const fresh = pool.filter((r) => !rej.has(r.id)).sort((a, b) => key(b.id) - key(a.id))
    const later = rejected.map((id) => pool.find((r) => r.id === id)).filter((r): r is Recipe => !!r)
    return [...fresh, ...later]
  }, [state.filters, perPortion, plannedIds, rejected, insights, pantryMode])
  // Vorrats-Modus endet mit dem Tab-Wechsel
  useEffect(() => {
    if (tab !== 'wischen' || meal !== 'dinner') setPantryMode(false)
  }, [tab, meal])

  // ───── Frühstück ─────
  const picks = state.breakfastPicks[weekKey] ?? []
  const prep = useMemo(() => resolvePrepDay(state.prepDays, days, today), [state.prepDays, days, today])
  const prepChoices = useMemo(() => prepOptions(days), [days])
  const covered = useMemo(() => coveredDays(days, prep), [days, prep])
  const assignment = useMemo(() => assignBreakfasts(picks, days, prep), [picks, days, prep])
  const prepItems = useMemo(() => prepPlan(assignment), [assignment])
  const prepTotal = prepItems.reduce((n, i) => n + i.recipe.steps.length, 0)
  const prepDone = (state.prepChecked[weekKey] ?? []).filter((k) => prepItems.some((i) => k.startsWith(i.recipe.id + ':'))).length
  const bLastSeen = useMemo(() => lastSeenMap(state.breakfast, days[0]), [state.breakfast, days])
  const bInsights = useMemo(
    () =>
      new Map(
        // Portionen, die dieses Frühstück abdecken würde: erstes ≈ 3 Tage, zweites ≈ 2 Tage
        BREAKFASTS.map((r) => {
          const ins = insight(r, picks.length ? 2 : 3, week.leftovers, today, state.prices, bLastSeen, jitter.get(r.id) ?? 0, [], {
            month: todayMonth,
          })
          const pref = preference(taste, r)
          return [r.id, { ...ins, score: ins.score + pref.score, taste: pref.reason }]
        }),
      ),
    [week.leftovers, today, state.prices, bLastSeen, jitter, picks.length, taste, todayMonth, state.customRecipes, state.customIngredients],
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
    const fits = (r: Recipe) => picks.length !== 1 || Object.keys(assignBreakfasts([picks[0], r.id], days, prep).days).length === covered.length
    const score = (r: Recipe) => bInsights.get(r.id)!.score + (fits(r) ? 0 : -30)
    const fresh = list.filter((r) => !rej.has(r.id)).sort((a, b) => score(b) - score(a))
    const later = rejected.map((id) => list.find((r) => r.id === id)).filter((r): r is Recipe => !!r)
    return [...fresh, ...later]
  }, [bTypes, picks, rejected, bInsights, days, bPantryOnly, prep, covered])

  /** Frühstücke für die Woche festlegen und auf die Tage nach dem Prep-Tag verteilen (Tage davor bekommen keins) */
  function setPicks(ids: string[], prepDay: string = prep) {
    setState((s) => {
      // schon gegessene Tage bleiben (auch ihr Abzug im Vorrat)
      const breakfast = applyBreakfastPicks(s.breakfast, ids, days, prepDay, today)
      // Der gewählte Prep-Tag wird gemerkt – daraus lernt die App den üblichen Wochentag
      const prepDays = ids.length || s.prepDays[weekKey] ? { ...s.prepDays, [weekKey]: prepDay } : s.prepDays
      return { ...s, breakfast, prepDays, breakfastPicks: { ...s.breakfastPicks, [weekKey]: ids } }
    })
  }

  /** Prep-Tag ändern: Verteilung neu berechnen (rückgängig machbar) */
  function changePrepDay(iso: string) {
    if (iso === prep) return
    const snap = snapshot()
    setPicks(picks, iso)
    if (!picks.length) setState((s) => ({ ...s, prepDays: { ...s.prepDays, [weekKey]: iso } }))
    const n = Object.keys(assignBreakfasts(picks, days, iso).days).length
    flash(
      picks.length
        ? `Vorbereitung ${weekdayName(iso, true)}, ${shortDate(iso)} – Frühstück an ${n} Tagen`
        : `Vorbereitung: ${weekdayName(iso, true)}, ${shortDate(iso)}`,
      snap,
    )
  }

  function pickBreakfast(r: Recipe) {
    const snap = snapshot()
    const next = [...picks.filter((id) => id !== r.id), r.id].slice(-2)
    setPicks(next)
    const coveredN = Object.keys(assignBreakfasts(next, days, prep).days).length
    if (next.length >= 2 || coveredN === covered.length) {
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
  }, [profile, days, state.breakfast, state.plan, state.customRecipes])
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
  // Sicherung: fehlt oder ist älter als 28 Tage – aber erst, wenn es schon Daten gibt, die älter als eine Woche sind
  const backupDue = (() => {
    const dates = Object.keys(state.plan)
    if (!profile && dates.length === 0) return false
    const weekAgo = isoDate(addDays(parseIso(today), -7))
    if (!dates.some((d) => d < weekAgo) && !weighIns.some((w) => w.date < weekAgo)) return false
    return !state.lastBackup || state.lastBackup < isoDate(addDays(parseIso(today), -28))
  })()

  // ───── Wochenrückblick: sonntags als Karte oben in der Woche (für die Woche, die heute endet) ─────
  const isSunday = parseIso(today).getDay() === 0
  const cardMonday = defaultReviewMonday(today)
  const cardReview = useMemo(
    () => (isSunday && !onboarding ? weekReview(state, weekDays(parseIso(cardMonday)), today) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSunday, onboarding, state, cardMonday, today],
  )
  const showReviewCard = !!cardReview && cardReview.hasData && !state.reviewDismissed.includes(cardMonday)
  const sheetReview = useMemo(
    () => (reviewMonday ? weekReview(state, weekDays(parseIso(reviewMonday)), today) : null),
    [reviewMonday, state, today],
  )

  const urgentNames = new Set(state.pantry.filter((l) => daysUntil(l.expires, today) <= 2).map((l) => l.name))

  function startSwipe(day: string) {
    setMeal('dinner')
    setSwipeDay(day)
    setTab('wischen')
  }

  /** „Was koche ich damit?“ → Tag gewählt: Woche des Tages zeigen und nach Vorrat wischen */
  function startPantrySwipe(day: string) {
    setPantryChooser(false)
    setMeal('dinner')
    setMonday(mondayOf(parseIso(day)))
    setSwipeDay(day)
    setRejected([])
    setPantryMode(true)
    setTab('wischen')
  }

  function take(recipe: Recipe, day: string, servings = state.defaultServings) {
    const snap = snapshot()
    setEntry(day, { recipeId: recipe.id, servings })
    if (pantryMode) {
      flash(`${weekdayName(day)}: ${recipe.title} ✓`, snap)
      setPantryMode(false)
      setTab('woche')
      return
    }
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
    setState((s) => ({ ...s, rejects: [...s.rejects, { id: r.id, date: today }].slice(-400) }))
    flash(`Übersprungen: ${r.title}`, snap)
  }

  /** Eigenes Rezept anlegen oder ändern */
  function saveCustom(r: Omit<CustomRecipe, 'id' | 'created'> & { id?: string }) {
    const snap = snapshot()
    const old = state.customRecipes.find((c) => c.id === r.id)
    const rec: CustomRecipe = { ...r, id: old?.id ?? `my-${uid()}`, created: old?.created ?? today }
    setState((s) => ({
      ...s,
      customRecipes: old ? s.customRecipes.map((c) => (c.id === rec.id ? rec : c)) : [...s.customRecipes, rec],
    }))
    setEditor(null)
    setMeal(rec.meal)
    flash(old ? `${rec.title} gespeichert ✓` : `${rec.title} angelegt ✓`, snap)
  }

  /** Zutat in den Vorrat getippt – merken, wofür es (noch) kaum Rezepte gibt */
  function noteRequest(name: string) {
    setState((s) => ({ ...s, pantryRequests: { ...s.pantryRequests, [name]: (s.pantryRequests[name] ?? 0) + 1 } }))
  }

  function createIngredient(c: CustomIngredient) {
    setState((s) => (s.customIngredients.some((x) => x.name === c.name) ? s : { ...s, customIngredients: [...s.customIngredients, c] }))
  }

  /** Eigenes Rezept löschen – inklusive aller Plan-Einträge (Rückgängig stellt alles wieder her) */
  function deleteCustom(id: string) {
    const snap = snapshot()
    const title = RECIPE_BY_ID[id]?.title ?? 'Rezept'
    setState((s) => {
      let pantry = s.pantry
      const strip = (p: typeof s.plan) => {
        const next = { ...p }
        for (const [d, e] of Object.entries(p)) {
          if (e?.recipeId !== id) continue
          if (e.status === 'cooked') pantry = uncook(e, pantry)
          delete next[d]
        }
        return next
      }
      const plan = strip(s.plan)
      const breakfast = strip(s.breakfast)
      return {
        ...s,
        plan,
        breakfast,
        pantry,
        customRecipes: s.customRecipes.filter((c) => c.id !== id),
        breakfastPicks: Object.fromEntries(Object.entries(s.breakfastPicks).map(([k, ids]) => [k, ids.filter((x) => x !== id)])),
      }
    })
    setSheet(null)
    flash(`${title} gelöscht`, snap)
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

  function toggleBuy(item: BuyItem, forWeek = weekKey) {
    // Gewürz: abhaken heißt „wieder da“ (kein Vorratsposten), Abwählen wieder „alle“
    if (isSpice(item.name)) {
      setState((s) => {
        const r = toggleSpiceBought(s.spices, s.bought[forWeek] ?? {}, item.name, item.product.pack)
        const checked = new Set(s.checked[forWeek] ?? [])
        if (r.on) checked.add(item.key)
        else checked.delete(item.key)
        return { ...s, spices: r.spices, bought: { ...s.bought, [forWeek]: r.bought }, checked: { ...s.checked, [forWeek]: [...checked] } }
      })
      return
    }
    setState((s) => {
      const wk = { ...(s.bought[forWeek] ?? {}) }
      const checked = new Set(s.checked[forWeek] ?? [])
      let pantry = s.pantry
      let { plan, breakfast } = s
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
        // doch nicht gekauft: nur den Rest des Postens entfernen; schon damit Gekochtes verweist danach nicht mehr darauf
        const u = unbuy(pantry, [plan, breakfast], b.lotId, b.amount)
        pantry = u.pantry
        ;[plan, breakfast] = u.plans
        delete wk[item.name]
        checked.delete(item.key)
      } else {
        const amount = item.packs * item.product.pack
        const lot = { id: uid(), name: item.name, amount, unit: item.unit, expires: addDaysIso(today, item.product.shelf) }
        pantry = [...pantry, lot]
        wk[item.name] = { lotId: lot.id, amount }
        checked.add(item.key)
      }
      return { ...s, pantry, plan, breakfast, bought: { ...s.bought, [forWeek]: wk }, checked: { ...s.checked, [forWeek]: [...checked] } }
    })
  }

  function resetChecks() {
    const snap = snapshot()
    flash('Haken zurückgesetzt', snap)
    setState((s) => {
      const wk = s.bought[weekKey] ?? {}
      let pantry = s.pantry
      let plans = [s.plan, s.breakfast]
      const spices = { ...s.spices }
      for (const [name, b] of Object.entries(wk)) {
        if (b.lotId.startsWith('spice:')) {
          spices[name] = 'alle'
          continue
        }
        ;({ pantry, plans } = unbuy(pantry, plans, b.lotId, b.amount))
      }
      return { ...s, spices, pantry, plan: plans[0], breakfast: plans[1], bought: { ...s.bought, [weekKey]: {} }, checked: { ...s.checked, [weekKey]: [] } }
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
      title: `Frühstück für ${dayRangeText(covered)} wählen`,
      sub: picks.length ? picks.map((id) => shortTitle(RECIPE_BY_ID[id]?.title ?? '')).join(' + ') : `1–2 Rezepte, einmal vorbereiten (${weekdayName(prep, true)}, ${shortDate(prep)})`,
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
          : backupDue
            ? { text: '💾 Lange nicht gesichert – jetzt Sicherung speichern', onClick: () => setShowProfile(true) }
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
            ratingSlot={(() => {
              const day = pendingRating(state.plan, state.ratings, today, state.ratingDismissed)
              const r = day ? RECIPE_BY_ID[state.plan[day]!.recipeId] : undefined
              if (!day || !r) return null
              const rate = (v: Rating) => {
                setState((s) => ({ ...s, ratings: { ...s.ratings, [day]: v } }))
                flash(v === 'down' ? 'Gemerkt – kommt seltener ✓' : v === 'again' ? 'Gemerkt – kommt bald wieder ✓' : 'Danke – gemerkt ✓')
              }
              return (
                <section className="rate-card" aria-label="Bewertung">
                  <div className="rate-head">
                    <span>
                      Wie war <b>{r.title}</b> am {weekdayName(day)}?
                    </span>
                    <button
                      className="icon-btn tiny"
                      aria-label="Nicht bewerten"
                      onClick={() => setState((s) => ({ ...s, ratingDismissed: [...s.ratingDismissed, day].slice(-60) }))}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="rate-btns">
                    <button onClick={() => rate('up')}>👍 Gut</button>
                    <button onClick={() => rate('again')}>🔁 Bald wieder</button>
                    <button onClick={() => rate('down')}>👎 Nicht so</button>
                  </div>
                </section>
              )
            })()}
            days={days}
            plan={state.plan}
            today={today}
            total={week.total}
            prices={state.prices}
            notice={notice}
            reviewSlot={
              showReviewCard && cardReview ? (
                <ReviewCard
                  review={cardReview}
                  onOpen={() => setReviewMonday(cardMonday)}
                  onDismiss={() => {
                    setState((s) => ({ ...s, reviewDismissed: [...s.reviewDismissed, cardMonday].slice(-60) }))
                    flash('Rückblick ausgeblendet – du findest ihn unter ⚖️')
                  }}
                />
              ) : undefined
            }
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
            hideDays={onboarding && plannedCount === 0 && !picks.length}
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
                  prep={prep}
                  prepChoices={prepChoices}
                  covered={covered}
                  onPrepDay={changePrepDay}
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
                    ☀️ Frühstück <span className="accent">{dayRangeText(covered)}</span>
                  </h1>
                  {picks.length === 1 ? (
                    <button className="chip" onClick={() => setTab('woche')} aria-label={`Nur ${RECIPE_BY_ID[picks[0]]?.title ?? 'dieses Frühstück'} nehmen – fertig`}>
                      1/2 · Fertig →
                    </button>
                  ) : (
                    <span className="muted small">{picks.length}/2 gewählt</span>
                  )}
                </div>
                <div className="chips-row">
                  <PrepDayChip prep={prep} choices={prepChoices} onChange={changePrepDay} />
                </div>
                <p className="muted small swipe-note">
                  Wähle 1–2 Frühstücke zum Vorbereiten. Das kürzer haltbare kommt an die ersten Tage, das länger haltbare ans Ende.
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
            {pantryMode && (
              <div className="chips-row">
                <button className="chip pantry-mode" onClick={() => setPantryMode(false)} aria-label="Vorrat zuerst beenden">
                  🧺 Vorrat zuerst ✕
                </button>
              </div>
            )}
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
              pantryMode={pantryMode}
              onTake={(r) => take(r, swipeDay)}
              onReject={reject}
              onInfo={(r) => setSheet({ recipe: r, day: swipeDay, mode: 'take' })}
            />
            <p className="hint toast-slot">
              {pantryMode ? '← wegwischen · nehmen → · sortiert nach dem, was du im Vorrat hast' : '← wegwischen · nehmen → · sortiert nach Vorrat, Preis & Abwechslung'}
            </p>
              </>
            )}
          </div>
        )}

        {tab === 'liste' && (
          <ShoppingList
            result={week}
            planned={days.filter((d) => state.plan[d] || state.breakfast[d]).length}
            checked={state.checked[weekKey] ?? []}
            custom={state.custom[weekKey] ?? []}
            onToggleBuy={(it) => toggleBuy(it)}
            haShared={ha.live === 'ok' || ha.live === 'connecting'}
            haError={ha.live === 'error' ? state.ha?.error ?? 'Abgleich mit Home Assistant fehlgeschlagen' : undefined}
            haOnWeek={weekKey === haKey}
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
            hints={hints}
            spices={state.spices}
            onSpice={(name: string, status: SpiceStatus | null) =>
              setState((s) => {
                const spices = { ...s.spices }
                if (status) spices[name] = status
                else delete spices[name]
                return { ...s, spices }
              })
            }
            today={today}
            onChange={(pantry) => {
              const removed = state.pantry.find((l) => !pantry.some((x) => x.id === l.id))
              if (removed) flash(`${removed.name} entfernt`, snapshot())
              // abgelaufen entfernt = weggeworfen (für den Wochenrückblick)
              const waste = removed ? discardWaste(removed, today, state.prices) : null
              setState((s) => ({ ...s, pantry, wasted: waste ? [...s.wasted, waste].slice(-WASTED_MAX) : s.wasted }))
            }}
            onAdded={noteRequest}
            onCreate={(c, lot) => {
              setState((s) => ({
                ...s,
                customIngredients: s.customIngredients.some((x) => x.name === c.name) ? s.customIngredients : [...s.customIngredients, c],
                pantry: [...s.pantry, lot],
                pantryRequests: { ...s.pantryRequests, [c.name]: (s.pantryRequests[c.name] ?? 0) + 1 },
              }))
              flash(`${c.name} angelegt und im Vorrat ✓`)
            }}
            onCook={() => setPantryChooser(true)}
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
            custom={state.customRecipes}
            onNew={() => setEditor({})}
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
          cooking={cooking}
          onCooking={setCooking}
          onEdit={() => {
            const c = state.customRecipes.find((x) => x.id === sheet.recipe.id)
            setSheet(null)
            if (c) setEditor({ recipe: c })
          }}
          onDelete={() => deleteCustom(sheet.recipe.id)}
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

      {editor && (
        <RecipeEditor
          key={editor.recipe?.id ?? 'new'}
          initial={editor.recipe}
          defaultMeal={meal}
          onSave={saveCustom}
          onCreateIngredient={createIngredient}
          onClose={() => setEditor(null)}
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

      {pantryChooser && (
        <PantryDaySheet today={today} plan={state.plan} onClose={() => setPantryChooser(false)} onPick={startPantrySwipe} />
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
          prep={prep}
          prepChoices={prepChoices}
          onPrepDay={changePrepDay}
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
          onReview={() => setReviewMonday(defaultReviewMonday(today))}
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
          learned={summarize(taste)}
          wishes={pantryWishes(state.pantryRequests)}
          prepWeekday={learnedPrepWeekday(state.prepDays, today)}
          onResetLearning={() => {
            const snap = snapshot()
            setState((s) => ({ ...s, tasteSince: today, rejects: [], ratings: {}, ratingDismissed: [] }))
            flash('Gelerntes zurückgesetzt', snap)
          }}
          lastBackup={state.lastBackup}
          ha={state.ha}
          onHaChange={(h) => setState((s) => ({ ...s, ha: h }))}
          onHaSyncNow={() => void ha.syncNow()}
          haSyncing={ha.syncing}
          onExport={() => {
            // Stand mit heutigem Datum speichern, damit die Datei selbst die letzte Sicherung kennt
            exportBackup({ ...state, lastBackup: today })
              .then((saved) => {
                if (!saved) return
                setState((s) => ({ ...s, lastBackup: today }))
                flash('Sicherung erstellt ✓')
              })
              .catch(() => flash('Sicherung fehlgeschlagen – bitte nochmal versuchen'))
          }}
          onImport={(s) => {
            const snap = snapshot()
            // wie beim Start: vergangene Gerichte gelten als gekocht
            const r = cookDue(s.plan, s.pantry, today)
            const b = cookDue(s.breakfast, r.pantry, today)
            const x = moveExpired(b.pantry, s.wasted, today, s.prices)
            // der Token steht nie in der Sicherung: bei gleicher Adresse den vorhandenen behalten
            const keepHa = s.ha && state.ha && s.ha.url === state.ha.url && !s.ha.token ? { ...s.ha, token: state.ha.token } : s.ha
            setState({ ...s, ha: keepHa, plan: r.plan, breakfast: b.plan, pantry: x.pantry, wasted: x.wasted, lastBackup: s.lastBackup ?? today })
            setShowProfile(false)
            flash('Sicherung geladen ✓', snap)
          }}
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

      {sheetReview && reviewMonday && (
        <ReviewSheet
          review={sheetReview}
          canNext={reviewMonday < defaultReviewMonday(today)}
          onWeek={(delta) => setReviewMonday((m) => (m ? isoDate(addDays(parseIso(m), delta * 7)) : m))}
          onClose={() => setReviewMonday(null)}
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

/** „Di–Fr“ aus den abgedeckten Tagen */
function dayRangeText(ds: string[]): string {
  if (!ds.length) return '–'
  return ds.length === 1 ? weekdayName(ds[0], true) : `${weekdayName(ds[0], true)}–${weekdayName(ds[ds.length - 1], true)}`
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
