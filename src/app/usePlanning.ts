import { useMemo } from 'react'
import type { Recipe } from '../types'
import { RECIPES, RECIPE_BY_ID } from '../data/recipes'
import { type PersonModel, buildModel, householdPreference, portionFactor } from '../learning'
import { householdFeedback } from '../sync'
import { sharingActive } from '../store'
import { dayBalance, isProteinLow, isWorkday, proteinBoost } from '../energy'
import { type AppState, addDays, isoDate, mondayOf, parseIso } from '../store'
import { matches } from '../filter'
import { formatAmount } from '../shopping'
import { stapleHints, useEvents } from '../staples'
import { daysUntil, insight, lastSeenMap, planWeek, PANTRY_ONLY_MAX_EURO } from '../kitchen'
import { activeFilterCount } from '../components/FilterBar'
import { haTripItems, tripsOf } from '../tripState'
import type { Calendar } from './useCalendar'
import type { Ui } from './useUi'

/** Planung, Vorrat & Empfehlungen fürs Abendessen: Wocheneinkauf, gelernte Vorlieben, Wisch-Stapel */
export function usePlanning(state: AppState, { today, days, weekKey }: Calendar, { swipeDay, pantryMode, rejected }: Pick<Ui, 'swipeDay' | 'pantryMode' | 'rejected'>) {
  // Saison: Monat des gewischten Kochtags (Abendessen) bzw. heute (Frühstück & Wocheneinkauf)
  const todayMonth = new Date(today + 'T12:00:00').getMonth() + 1
  const swipeMonth = new Date(swipeDay + 'T12:00:00').getMonth() + 1
  // Lernen: wie groß sind die Portionen wirklich (Rückmeldung nach dem Essen) → Mengen fürs Einkaufen
  const portion = useMemo(() => portionFactor(householdFeedback(state), today), [state.portionFeedback, state.sync?.household, state.ha?.share, state.ha?.me, today])
  // Wochenzahlen (Kosten/Artikel im Wochenkopf, Vorrat danach): was die Gerichte DIESER Woche brauchen.
  // Die Einkaufsliste selbst richtet sich nach Einkäufen (trips), nicht nach Wochen.
  const week = useMemo(
    () => planWeek(state.plan, days, state.pantry, state.bought[weekKey] ?? {}, today, state.prices, formatAmount, state.breakfast, todayMonth, { memo: state.staples, spices: state.spices, portion }, state.bakePlan),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.plan, state.bakePlan, days, state.pantry, state.bought, weekKey, today, state.prices, state.breakfast, todayMonth, state.customRecipes, state.customIngredients, state.staples, state.spices, portion],
  )
  // Lernen: wie lange reichen Öl, Brühe & Co. noch (aus dem Verbrauch der gekochten Gerichte)
  const hints = useMemo(() => stapleHints(useEvents(state.plan, state.breakfast), state.pantry, today), [state.plan, state.breakfast, state.pantry, today])
  // Einkäufe ab heute (Haupteinkauf, ggf. Zusatzeinkauf, „Heute noch“) – unabhängig von der angezeigten Woche
  const trips = useMemo(
    () => tripsOf(state, today),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.plan, state.bakePlan, state.pantry, state.bought, today, state.prices, state.breakfast, state.prepDays, state.customRecipes, state.customIngredients, state.staples, state.spices, state.shopDay, portion],
  )
  // Home Assistant bekommt nur freigegebene Einkäufe
  const haLocal = useMemo(() => haTripItems(trips, state.trips, today, state.shopOrder), [trips, state.trips, today, state.shopOrder])
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
        baked: state.baked,
        snacks: state.snacks,
        bakeRatings: state.bakeRatings,
        bfPrepped: state.bfPreps,
        bfRatings: state.bfRatings,
        bfSatiety: state.bfSatiety,
      }),
    [state.plan, state.breakfast, state.breakfastPicks, state.rejects, state.ratings, state.wasted, today, state.tasteSince, state.customRecipes, state.baked, state.snacks, state.bakeRatings, state.bfPreps, state.bfRatings, state.bfSatiety],
  )

  // ───── Familie: Geschmack der anderen Personen (eigene Bewertungen/Wischen, gemeinsamer Plan) ─────
  const household = sharingActive(state.ha) ? state.sync?.household : undefined
  const others: PersonModel[] = useMemo(
    () =>
      Object.entries(household ?? {})
        .filter(([name]) => name !== state.ha?.me)
        .map(([name, p]) => ({
          name,
          model: buildModel({
            plan: state.plan,
            breakfast: {},
            breakfastPicks: {},
            rejects: p.rejects,
            ratings: p.ratings,
            wasted: state.wasted,
            today,
            since: state.tasteSince,
            customRecipes: state.customRecipes,
            baked: p.baked,
            bakeRatings: p.bakeRatings,
          }),
        })),
    [household, state.ha?.me, state.plan, state.wasted, today, state.tasteSince, state.customRecipes],
  )

  // ───── Eiweiß lernen: zu wenig Eiweiß an den letzten Arbeitstagen → Abendessen mit viel Eiweiß steigen ─────
  const proteinHigh = useMemo(() => {
    if (!state.profile) return false
    const weekEnd = isoDate(addDays(mondayOf(parseIso(today)), 6))
    const last = Object.keys(state.plan)
      .filter((d) => d <= weekEnd && isWorkday(d) && state.plan[d] && state.plan[d]!.status !== 'skipped')
      .sort()
      .slice(-10)
    const low = last.filter((d) => isProteinLow(dayBalance(state.profile!, state.breakfast[d], state.plan[d], state.snacks, d))).length
    return low >= 3
  }, [state.profile, state.plan, state.breakfast, state.snacks, today])

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
          const pref = householdPreference(taste, others, r, swipeDay)
          const bonus = proteinHigh ? proteinBoost(r.nutrition.protein) : 0
          // Vorrats-Modus: Vorrat zuerst, gelernte Vorliebe nur als Tie-Breaker (×0,3)
          return [r.id, { ...ins, score: ins.score + pref.score + bonus, modeScore: ins.modeScore + pref.score * 0.3, taste: pref.reason ?? (bonus > 0 ? '💪 viel Eiweiß' : undefined) }]
        }),
      ),
    [week.leftovers, week.pantryLeft, pantryMode, today, state.prices, lastSeen, jitter, state.defaultServings, weekRecipes, freshDays, taste, others, swipeDay, swipeMonth, proteinHigh, state.customRecipes, state.customIngredients],
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

  return { portion, todayMonth, week, hints, trips, haLocal, jitter, taste, others, insights, perPortion, activeFilters, filteredCount, deck }
}

export type Planning = ReturnType<typeof usePlanning>
