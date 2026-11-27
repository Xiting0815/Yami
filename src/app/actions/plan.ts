import { finishable, isBake, isTapa, type PlanEntry, type Recipe } from '../../types'
import { bbqMeal, doneWord, eveningOn } from '../../bbq'
import { tapasMeal } from '../../tapas'
import { RECIPE_BY_ID } from '../../data/recipes'
import { type PortionFeedback, type Rating, MOVES_MAX, addReject, dropDish, moveDish, portionFactor, rekeyDish, setDishValue } from '../../learning'
import { cookTarget, futureDuplicate } from '../../cookDone'
import { addDays, isoDate, mondayOf, parseIso, weekdayName } from '../../store'
import { cookBasic, cookDue, cookNow, uncook } from '../../kitchen'
import { householdFeedback } from '../../sync'
import { yieldText } from '../../bake'
import { markBaked, matchBake, tapasFactor } from '../../bakePlan'
import type { AppState } from '../../store'
import type { ActionContext } from './context'

/**
 * Abendessen eines Tages setzen bzw. leeren. Ein schon abgezogenes Gericht gibt seine Zutaten zurück.
 * Kommt ein ANDERES Gericht auf den Tag (oder wird er geleert), gehören Bewertung, Portions-Rückmeldung und
 * „Wie war’s?“-Wegklicken des alten Gerichts nicht mehr zum Tag – sonst lernt die App sie fürs neue Gericht.
 */
export function withDinner<S extends Pick<AppState, 'plan' | 'pantry' | 'ratings' | 'portionFeedback' | 'ratingDismissed'>>(s: S, day: string, entry: PlanEntry | undefined): S {
  const plan = { ...s.plan }
  const old = plan[day]
  const pantry = old?.status === 'cooked' ? uncook(old, s.pantry) : s.pantry
  if (entry) plan[day] = entry
  else delete plan[day]
  if (!old || old.recipeId === entry?.recipeId) return { ...s, plan, pantry }
  const ratings = dropDish(s.ratings, day, old.recipeId)
  const portionFeedback = dropDish(s.portionFeedback, day, old.recipeId)
  return { ...s, plan, pantry, ratings, portionFeedback, ratingDismissed: s.ratingDismissed.filter((d) => d !== day) }
}

/**
 * Abendessen verschieben bzw. zwei Tage tauschen („↔ Verschieben/Tauschen“ in der Woche). Nur offene Gerichte
 * (nicht gekocht/übersprungen) – auf beiden Tagen. Bewertung, Portions-Rückmeldung und „Wie war’s?“-Wegklicken wandern
 * mit dem Gericht (sie gehören zum Gericht, nicht zum Tag). Kalender und Einkaufsliste folgen von selbst (aus dem Plan).
 * Gemerkt wird das aktiv verschobene Gericht in `moves` (Lernen: mehrmals nach hinten → leichtes Minus).
 * Gibt `null` zurück, wenn es nicht geht.
 */
export function movedDinner<S extends Pick<AppState, 'plan' | 'ratings' | 'portionFeedback' | 'ratingDismissed' | 'moves'>>(s: S, from: string, to: string, today: string): S | null {
  const a = s.plan[from]
  const b = s.plan[to]
  if (from === to || !a || a.status || b?.status) return null
  const plan = { ...s.plan, [to]: a }
  if (b) plan[from] = b
  else delete plan[from]
  // ältere Schlüssel nur mit Tag erst dem geplanten Gericht zuordnen, dann wandert alles mit seinem Gericht
  let ratings = rekeyDish(s.ratings, s.plan)
  let portionFeedback = rekeyDish(s.portionFeedback, s.plan)
  const ra = moveDish(ratings, from, to, a.recipeId)
  ratings = b ? moveDish(ra, to, from, b.recipeId) : ra
  const pa = moveDish(portionFeedback, from, to, a.recipeId)
  portionFeedback = b ? moveDish(pa, to, from, b.recipeId) : pa
  const dismissed = new Set(s.ratingDismissed)
  const ratingDismissed = s.ratingDismissed
    .filter((d) => d !== from && d !== to)
    .concat(dismissed.has(from) ? [to] : [], b && dismissed.has(to) ? [from] : [])
  const moves = [...(s.moves ?? []), { date: today, recipeId: a.recipeId, from, to }].slice(-MOVES_MAX)
  return { ...s, plan, ratings, portionFeedback, ratingDismissed, moves }
}

/** Zieltag für „↔ Verschieben/Tauschen“ */
export interface MoveTarget {
  day: string
  /** dort geplantes offenes Gericht (wird getauscht) */
  swapWith?: string
  /** nicht wählbar und warum (schon gekocht, Tapas-/Grillabend) */
  blocked?: string
}

/** mögliche Zieltage: ab heute bis eine Woche nach dem Tag (höchstens 14), ohne den Tag selbst */
export function moveTargets(plan: AppState['plan'], bakePlan: AppState['bakePlan'], from: string, today: string): MoveTarget[] {
  const out: MoveTarget[] = []
  const start = parseIso(today)
  for (let i = 0; i < 14; i++) {
    const day = isoDate(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i))
    if (i >= 8 && day > isoDate(addDays(parseIso(from), 7))) break
    if (day === from) continue
    const e = plan[day]
    const ev = eveningOn(bakePlan, day)
    const t: MoveTarget = { day }
    if (e?.status) t.blocked = e.status === 'cooked' ? 'schon gekocht' : 'abgeschlossen'
    else if (e) t.swapWith = RECIPE_BY_ID[e.recipeId]?.title ?? 'Gericht'
    else if (ev) t.blocked = ev === 'tapas' ? 'Tapas-Abend' : 'Grillabend'
    out.push(t)
  }
  return out
}

/** Abendessen planen: Wischen, Nehmen/Wegwischen, Tage leeren, gekocht/nicht gekocht, Bewertung, Woche wechseln */
export function planActions({ state, setState, cal, ui, flash, setToast, snapshot }: ActionContext) {
  const { today, days, monday, setMonday } = cal

  function setEntry(day: string, entry: PlanEntry | undefined) {
    setState((s) => withDinner(s, day, entry))
  }

  function startSwipe(day: string) {
    ui.setMeal('dinner')
    ui.setSwipeDay(day)
    ui.setTab('wischen')
  }

  /** „Was koche ich damit?“ → Tag gewählt: Woche des Tages zeigen und nach Vorrat wischen */
  function startPantrySwipe(day: string) {
    ui.setPantryChooser(false)
    ui.setMeal('dinner')
    setMonday(mondayOf(parseIso(day)))
    ui.setSwipeDay(day)
    ui.setRejected([])
    ui.setPantryMode(true)
    ui.setTab('wischen')
  }

  function take(recipe: Recipe, day: string, servings = state.defaultServings) {
    if (recipe.basic) return // Grundrezepte sind kein Abendessen
    const snap = snapshot()
    setEntry(day, { recipeId: recipe.id, servings })
    if (ui.pantryMode) {
      flash(`${weekdayName(day)}: ${recipe.title} ✓`, snap)
      ui.setPantryMode(false)
      ui.setTab('woche')
      return
    }
    const idx = days.indexOf(day)
    // ein Tapas- oder Grillabend belegt den Tag schon (ist das Abendessen) → nicht als „frei“ anspringen
    const nextEmpty = [...days.slice(idx + 1), ...days.slice(0, idx)].find((d) => d !== day && !state.plan[d] && !eveningOn(state.bakePlan, d) && d >= today)
    if (nextEmpty) {
      flash(`${weekdayName(day)}: ${recipe.title} ✓`, snap)
      ui.setSwipeDay(nextEmpty)
    } else {
      flash('Woche komplett geplant! 🎉', snap)
      ui.setTab('woche')
    }
  }

  /** Rezept aus dem Rezepte-Tab direkt auf einen Tag legen */
  function planOn(recipe: Recipe, day: string) {
    if (recipe.basic) return
    const snap = snapshot()
    const old = state.plan[day]
    const replaced = old && old.recipeId !== recipe.id ? RECIPE_BY_ID[old.recipeId]?.title : undefined
    setEntry(day, { recipeId: recipe.id, servings: state.defaultServings })
    flash(`${recipe.title} → ${weekdayName(day)} ✓${replaced ? ` (ersetzt: ${replaced})` : ''}`, snap)
  }

  /** Karte nach links: ans Ende des Stapels */
  function reject(r: Recipe) {
    const snap = snapshot()
    ui.setRejected((x) => [...x.filter((id) => id !== r.id), r.id])
    setState((s) => ({ ...s, rejects: addReject(s.rejects, r.id, today) }))
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
    ui.setSwipeDay(isoDate(m))
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
      const r = cookDue(plan, s.pantry, today, portionFactor(householdFeedback(s), today))
      return { ...s, plan: r.plan, pantry: r.pantry }
    })
  }

  /** Bewertung eines gekochten Gerichts (Lernsignal) */
  function rate(day: string, v: Rating) {
    setState((s) => {
      const id = s.plan[day]?.recipeId
      return id ? { ...s, ratings: setDishValue(s.ratings, day, id, v) } : s
    })
    flash(v === 'down' ? 'Gemerkt – kommt seltener ✓' : v === 'again' ? 'Gemerkt – kommt bald wieder ✓' : 'Danke – gemerkt ✓')
  }

  /** Bewertung im „Wie war’s?“-Sheet: sofort speichern, nochmal tippen nimmt sie zurück (kein Toast – das Sheet bleibt offen) */
  function setRating(day: string, v: Rating | undefined) {
    setState((s) => {
      const id = s.plan[day]?.recipeId
      return id ? { ...s, ratings: setDishValue(s.ratings, day, id, v) } : s
    })
  }

  /** Portion im „Wie war’s?“-Sheet (zu wenig / passt / zu viel) → lernt den Portionsfaktor */
  function setPortionFeedback(day: string, v: PortionFeedback | undefined) {
    setState((s) => {
      const id = s.plan[day]?.recipeId
      return id ? { ...s, portionFeedback: setDishValue(s.portionFeedback, day, id, v ?? undefined) } : s
    })
  }

  /** „↔ Verschieben/Tauschen“: Gericht auf einen anderen Tag; ist der belegt, werden beide getauscht (Rückgängig im Toast) */
  function moveDinner(from: string, to: string) {
    const a = state.plan[from]
    const b = state.plan[to]
    if (!movedDinner(state, from, to, today)) return
    const snap = snapshot()
    setState((s) => movedDinner(s, from, to, today) ?? s)
    const ta = RECIPE_BY_ID[a!.recipeId]?.title ?? 'Gericht'
    flash(b ? `${weekdayName(from)} ↔ ${weekdayName(to)} getauscht` : `${ta} → ${weekdayName(to)} ✓`, snap)
  }

  /**
   * „Fertig gekocht“: Eintrag sofort als gekocht eintragen (Vorrat wird jetzt abgezogen, cookDue morgen nicht noch einmal),
   * danach fragt das „Wie war’s?“-Sheet nach Bewertung und Portion. Bei `replace` wird ein anderes Gericht von heute ersetzt.
   */
  function finishCooking(recipe: Recipe, servings: number, ctxDay?: string, replace = false) {
    const t = cookTarget(state.plan, recipe.id, today, ctxDay)
    if (t.kind === 'conflict' && !replace) return
    const snap = snapshot()
    if (!(t.kind === 'entry' && t.done)) {
      setState((s) => {
        const r = cookNow(s.plan, s.pantry, t.day, { recipeId: recipe.id, servings }, portionFactor(householdFeedback(s), today))
        // für später geplant, heute gekocht → verschieben statt doppelt
        const moved = futureDuplicate(s.plan, recipe.id, today, ctxDay)
        if (moved && moved !== t.day) delete r.plan[moved]
        return { ...s, plan: r.plan, pantry: r.pantry }
      })
    }
    flash(`${recipe.title} als gekocht eingetragen`, snap)
    ui.setCooking(false)
    ui.setSheet(null)
    ui.setRateDay(t.day)
  }

  /**
   * Grundrezept „Fertig gekocht“ bzw. Backen & Desserts „Fertig gebacken“: Zutaten vom Vorrat abziehen und das Ergebnis
   * als Posten (Haltbarkeit aus `yields`) in den Vorrat legen. Kein Planeintrag; Rückgängig über den Toast.
   * Gebackenes zählt fürs Lernen (+ „Wie war’s?“), Grundrezepte nicht.
   */
  function finishBasic(recipe: Recipe, servings: number, ctxDay?: string) {
    const y = recipe.yields
    // BBQ ohne Reste (Burger, Steak) und Tapas: nur Zutaten abziehen
    if (!finishable(recipe)) return
    const snap = snapshot()
    const bake = isBake(recipe)
    const tapaDay = isTapa(recipe) ? matchBake(state.bakePlan, recipe.id, today, ctxDay) : undefined
    // Tapa vom Tapas-Abend: Menge des Abends; sonst ein Teller (Faktor 1)
    const f = tapaDay ? tapasFactor(state.bakePlan, tapaDay) : 1
    const meal = isTapa(recipe) ? tapasMeal(recipe, today) : bbqMeal(recipe, today)
    setState((s) => {
      // eingeplantes Backen: dieser Eintrag gilt damit als gebacken (kein zweites Abziehen, keine Nachfrage mehr)
      const planned = matchBake(s.bakePlan, recipe.id, today, ctxDay)
      return {
        ...s,
        pantry: cookBasic(s.pantry, recipe, servings * f, today).pantry,
        baked: bake ? [...s.baked, { date: today, recipeId: recipe.id }].slice(-200) : s.baked,
        bakePlan: planned ? markBaked(s.bakePlan, planned, recipe.id) : s.bakePlan,
        // BBQ/Tapas: zählt fürs Lernen als „gegessen“
        snacks: meal ? [...s.snacks, meal].slice(-400) : s.snacks,
      }
    })
    flash(y ? `${yieldText(recipe, servings)} ${y.name} im Vorrat ✓` : `${recipe.title} ${doneWord(recipe)} ✓`, snap)
    ui.setCooking(false)
    ui.setSheet(null)
    if (bake) ui.setRateBake({ recipeId: recipe.id, date: today })
  }

  /** Bewertung nach „Fertig gebacken“ (nochmal tippen nimmt zurück) */
  function setBakeRating(date: string, recipeId: string, v: Rating | undefined) {
    const key = `${date}:${recipeId}`
    setState((s) => {
      const bakeRatings = { ...s.bakeRatings }
      if (v) bakeRatings[key] = v
      else delete bakeRatings[key]
      return { ...s, bakeRatings }
    })
  }

  /** Hinweis „Lisa hat Montag geändert …“: Rückgängig setzt den alten Eintrag wieder (gilt dann als eigene, neuere Änderung) */
  function undoSyncNotice(id: string) {
    const n = state.sync?.notices.find((x) => x.id === id)
    setState((s) => {
      if (!s.sync) return s
      const notices = s.sync.notices.filter((x) => x.id !== id)
      const u = n?.undo
      if (!u) return { ...s, sync: { ...s.sync, notices } }
      const plan = { ...s.plan }
      if (u.value && typeof u.value === 'object') plan[u.day] = u.value as PlanEntry
      else delete plan[u.day]
      return { ...s, plan, sync: { ...s.sync, notices } }
    })
    if (n?.undo) flash(`${weekdayName(n.undo.day)} zurückgesetzt ✓`)
  }

  function dismissSyncNotice(id?: string) {
    setState((s) => (s.sync ? { ...s, sync: { ...s.sync, notices: id ? s.sync.notices.filter((x) => x.id !== id) : [] } } : s))
  }

  function dismissRating(day: string) {
    setState((s) => ({ ...s, ratingDismissed: [...s.ratingDismissed, day].slice(-60) }))
  }

  return { undoSyncNotice, dismissSyncNotice, setEntry, moveDinner, startSwipe, startPantrySwipe, take, planOn, reject, removeEntry, changeWeek, uncookDay, recookDay, rate, setRating, setPortionFeedback, finishCooking, finishBasic, setBakeRating, dismissRating }
}
