import type { CustomIngredient } from '../../types'
import type { SpiceStatus } from '../../staples'
import { type PantryLot, discardWaste, WASTED_MAX } from '../../kitchen'
import type { ActionContext } from './context'
import { eatOne } from '../../bake'
import { isWorkday } from '../../energy'
import { SNACKS_MAX } from '../../store'

/** Vorrat: Posten ändern/entfernen, eigene Zutaten, Gewürze */
export function pantryActions({ state, setState, cal, flash, snapshot }: ActionContext) {
  const { today } = cal

  /** neue Vorratsliste aus der Vorratsansicht; ein entfernter Posten ist rückgängig machbar */
  function changePantry(pantry: PantryLot[]) {
    const removed = state.pantry.find((l) => !pantry.some((x) => x.id === l.id))
    if (removed) flash(`${removed.name} entfernt`, snapshot())
    // abgelaufen entfernt = weggeworfen (für den Wochenrückblick)
    const waste = removed ? discardWaste(removed, today, state.prices) : null
    setState((s) => ({ ...s, pantry, wasted: waste ? [...s.wasted, waste].slice(-WASTED_MAX) : s.wasted }))
  }

  /** Zutat in den Vorrat getippt – merken, wofür es (noch) kaum Rezepte gibt */
  function noteRequest(name: string) {
    setState((s) => ({ ...s, pantryRequests: { ...s.pantryRequests, [name]: (s.pantryRequests[name] ?? 0) + 1 } }))
  }

  /** eigene Zutat anlegen und gleich in den Vorrat legen */
  function createPantryItem(c: CustomIngredient, lot: PantryLot) {
    setState((s) => ({
      ...s,
      customIngredients: s.customIngredients.some((x) => x.name === c.name) ? s.customIngredients : [...s.customIngredients, c],
      pantry: [...s.pantry, lot],
      pantryRequests: { ...s.pantryRequests, [c.name]: (s.pantryRequests[c.name] ?? 0) + 1 },
    }))
    flash(`${c.name} angelegt und im Vorrat ✓`)
  }

  function setSpice(name: string, status: SpiceStatus | null) {
    setState((s) => {
      const spices = { ...s.spices }
      if (status) spices[name] = status
      else delete spices[name]
      return { ...s, spices }
    })
  }

  /** „1 gegessen“ (Kuchen, Brot, Dessert aus dem Vorrat): Stück abziehen, kcal in die heutige Tagesbilanz; Rückgängig über den Toast */
  function eatPiece(lotId: string) {
    const r = eatOne(state.pantry, lotId, today)
    const snack = r.snack
    if (!snack) return
    const snap = snapshot()
    setState((s) => {
      const x = eatOne(s.pantry, lotId, today)
      return x.snack ? { ...s, pantry: x.pantry, snacks: [...s.snacks, x.snack].slice(-SNACKS_MAX) } : s
    })
    flash(`${snack.name}: ${snack.kcal} kcal ${isWorkday(today) ? 'in der Tagesbilanz' : 'gegessen (Sa/So ohne Bilanz)'} ✓`, snap)
  }

  return { changePantry, noteRequest, createPantryItem, setSpice, eatPiece }
}
