import type { PlanEntry, Recipe } from '../../types'
import type { Rating } from '../../learning'
import { addDays, isoDate, mondayOf, parseIso, weekdayName } from '../../store'
import { cookDue, uncook } from '../../kitchen'
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
      const r = cookDue(plan, s.pantry, today)
      return { ...s, plan: r.plan, pantry: r.pantry }
    })
  }

  /** Bewertung eines gekochten Gerichts (Lernsignal) */
  function rate(day: string, v: Rating) {
    setState((s) => ({ ...s, ratings: { ...s.ratings, [day]: v } }))
    flash(v === 'down' ? 'Gemerkt – kommt seltener ✓' : v === 'again' ? 'Gemerkt – kommt bald wieder ✓' : 'Danke – gemerkt ✓')
  }

  function dismissRating(day: string) {
    setState((s) => ({ ...s, ratingDismissed: [...s.ratingDismissed, day].slice(-60) }))
  }

  return { setEntry, startSwipe, startPantrySwipe, take, planOn, reject, removeEntry, changeWeek, uncookDay, recookDay, rate, dismissRating }
}
