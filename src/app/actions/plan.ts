import { isBake, isBbq, type PlanEntry, type Recipe } from '../../types'
import { bbqMeal, doneWord } from '../../bbq'
import { type PortionFeedback, type Rating, portionFactor } from '../../learning'
import { cookTarget, futureDuplicate } from '../../cookDone'
import { addDays, isoDate, mondayOf, parseIso, weekdayName } from '../../store'
import { cookBasic, cookDue, cookNow, uncook } from '../../kitchen'
import { householdFeedback } from '../../sync'
import { yieldText } from '../../bake'
import { markBaked, matchBake } from '../../bakePlan'
import type { ActionContext } from './context'

/** Abendessen planen: Wischen, Nehmen/Wegwischen, Tage leeren, gekocht/nicht gekocht, Bewertung, Woche wechseln */
export function planActions({ state, setState, cal, ui, flash, setToast, snapshot }: ActionContext) {
  const { today, days, monday, setMonday } = cal

  function setEntry(day: string, entry: PlanEntry | undefined) {
    setState((s) => {
      const plan = { ...s.plan }
      const old = plan[day]
      // ein bereits abgezogenes Gericht wird ersetzt → Zutaten zurück in den Vorrat
      const pantry = old?.status === 'cooked' ? uncook(old, s.pantry) : s.pantry
      if (entry) plan[day] = entry
      else delete plan[day]
      return { ...s, plan, pantry }
    })
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
    const nextEmpty = [...days.slice(idx + 1), ...days.slice(0, idx)].find((d) => d !== day && !state.plan[d] && d >= today)
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
    setEntry(day, { recipeId: recipe.id, servings: state.defaultServings })
    flash(`${recipe.title} → ${weekdayName(day)} ✓`, snap)
  }

  /** Karte nach links: ans Ende des Stapels */
  function reject(r: Recipe) {
    const snap = snapshot()
    ui.setRejected((x) => [...x.filter((id) => id !== r.id), r.id])
    setState((s) => ({ ...s, rejects: [...s.rejects, { id: r.id, date: today }].slice(-400) }))
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
    setState((s) => ({ ...s, ratings: { ...s.ratings, [day]: v } }))
    flash(v === 'down' ? 'Gemerkt – kommt seltener ✓' : v === 'again' ? 'Gemerkt – kommt bald wieder ✓' : 'Danke – gemerkt ✓')
  }

  /** Bewertung im „Wie war’s?“-Sheet: sofort speichern, nochmal tippen nimmt sie zurück (kein Toast – das Sheet bleibt offen) */
  function setRating(day: string, v: Rating | undefined) {
    setState((s) => {
      const ratings = { ...s.ratings }
      if (v) ratings[day] = v
      else delete ratings[day]
      return { ...s, ratings }
    })
  }

  /** Portion im „Wie war’s?“-Sheet (zu wenig / passt / zu viel) → lernt den Portionsfaktor */
  function setPortionFeedback(day: string, v: PortionFeedback | undefined) {
    setState((s) => {
      const portionFeedback = { ...s.portionFeedback }
      if (v != null) portionFeedback[day] = v
      else delete portionFeedback[day]
      return { ...s, portionFeedback }
    })
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
    // BBQ ohne Reste (Burger, Steak): nur Zutaten abziehen
    if (!recipe.basic || !(y || isBbq(recipe))) return
    const snap = snapshot()
    const bake = isBake(recipe)
    const meal = bbqMeal(recipe, today)
    setState((s) => {
      // eingeplantes Backen: dieser Eintrag gilt damit als gebacken (kein zweites Abziehen, keine Nachfrage mehr)
      const planned = matchBake(s.bakePlan, recipe.id, today, ctxDay)
      return {
        ...s,
        pantry: cookBasic(s.pantry, recipe, servings, today).pantry,
        baked: bake ? [...s.baked, { date: today, recipeId: recipe.id }].slice(-200) : s.baked,
        bakePlan: planned ? markBaked(s.bakePlan, planned, recipe.id) : s.bakePlan,
        // BBQ: eine Portion zählt als Abendessen in die Tagesbilanz
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

  return { undoSyncNotice, dismissSyncNotice, setEntry, startSwipe, startPantrySwipe, take, planOn, reject, removeEntry, changeWeek, uncookDay, recookDay, rate, setRating, setPortionFeedback, finishCooking, finishBasic, setBakeRating, dismissRating }
}
