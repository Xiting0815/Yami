import type { CustomIngredient } from '../../types'
import type { SpiceStatus } from '../../staples'
import { isQtyStaple } from '../../staples'
import { type PantryLot, discardWaste, wasteOf, WASTED_MAX } from '../../kitchen'
import type { ActionContext } from './context'
import type { Snapshot } from '../types'
import { eatOne } from '../../bake'
import { type AppState, type RemovalReason, type ShiftRecord, REMOVALS_MAX, SNACKS_MAX } from '../../store'
import { autoShift, shiftText } from '../../shortage'
import { forgotLabel, forgotScores } from '../../forgot'

const REASON_LABEL: Record<RemovalReason, string> = { forgot: 'Vergessen zu kaufen', used: 'Aufgebraucht', wasted: 'Weggeworfen' }

/**
 * Grund für einen gelöschten Posten eintragen (ein Grund je Posten, neu wählen überschreibt):
 * vergessen → zählt für „oft vergessen“ und nimmt den Haken auf der Einkaufsliste zurück (war ja nicht gekauft);
 * weggeworfen → Wochenrückblick/Lernen wie bisher (Abgelaufenes zählt ohne Antwort schon so);
 * aufgebraucht → bei Grundzutaten Verbrauch (lernt, wann sie leer werden).
 */
export function applyRemovalReason(s: AppState, lot: PantryLot, reason: RemovalReason, today: string): AppState {
  const removals = [...s.removals.filter((r) => r.id !== lot.id), { id: lot.id, date: today, name: lot.name, amount: lot.amount, unit: lot.unit, reason }].slice(-REMOVALS_MAX)
  // Weggeworfen-Eintrag dieses Postens (Abgelaufenes: Datum = Ablaufdatum, sonst heute) erst entfernen, ggf. neu
  let wasted = s.wasted
  const i = wasted.findIndex((w) => w.name === lot.name && Math.abs(w.amount - lot.amount) < 1e-6 && (w.date === lot.expires || w.date === today))
  if (i >= 0) wasted = [...wasted.slice(0, i), ...wasted.slice(i + 1)]
  if (reason === 'wasted') wasted = [...wasted, wasteOf(lot, lot.expires <= today ? lot.expires : today, s.prices)].slice(-WASTED_MAX)
  let { bought, checked } = s
  if (reason === 'forgot') {
    // war abgehakt, aber nicht gekauft → Haken zurück, damit es wieder auf der Liste steht
    for (const [k, m] of Object.entries(s.bought)) {
      const name = Object.keys(m ?? {}).find((n) => m[n].lotId === lot.id)
      if (!name) continue
      const rest = { ...m }
      delete rest[name]
      bought = { ...bought, [k]: rest }
      if (checked[k]?.includes(name)) checked = { ...checked, [k]: checked[k].filter((x) => x !== name) }
    }
  }
  return { ...s, removals, wasted, bought, checked }
}

/** Vorrat: Posten ändern/entfernen, eigene Zutaten, Gewürze */
export function pantryActions({ state, setState, cal, flash, snapshot }: ActionContext) {
  const { today } = cal

  /** „Warum?“ nach dem Löschen – Rückgängig bleibt (Stand vor dem Löschen, auch eine Verschiebung) */
  function askWhy(lot: PantryLot, snap: Snapshot, shifts: ShiftRecord[], chosen?: RemovalReason) {
    const expired = lot.expires <= today
    const head = `${lot.name} entfernt${shifts.length ? ` · ${shiftText(shifts[0])}` : ''} – warum?`
    const pick = (reason: RemovalReason) => () => setReason(lot, reason, snap, shifts)
    flash(head, snap, (['forgot', 'used', 'wasted'] as const).map((r) => ({ label: REASON_LABEL[r], onPick: pick(r), on: chosen ? chosen === r : r === 'wasted' && expired })))
  }

  function setReason(lot: PantryLot, reason: RemovalReason, snap: Snapshot, shifts: ShiftRecord[]) {
    const removals = [...state.removals.filter((r) => r.id !== lot.id), { id: lot.id, date: today, name: lot.name, amount: lot.amount, unit: lot.unit, reason }]
    setState((s) => applyRemovalReason(s, lot, reason, today))
    const shifted = shifts.length ? ` · ${shiftText(shifts[0])}` : ''
    if (reason === 'forgot') {
      const label = forgotLabel(forgotScores(removals, today)[lot.name])
      flash(`Gemerkt: ${lot.name} vergessen${label ? ' – steht ab jetzt mit ⚠️ auf der Einkaufsliste' : ''}${shifted}`, snap)
    } else if (reason === 'used') flash(`Gemerkt: ${lot.name} aufgebraucht${isQtyStaple(lot.name) ? ' – Gusto lernt, wie lange es reicht' : ''} ✓${shifted}`, snap)
    else flash(`${lot.name}: als weggeworfen gezählt (Wochenrückblick)${shifted}`, snap)
  }

  /**
   * neue Vorratsliste aus der Vorratsansicht. Ein entfernter Posten: fragt „Warum?“ und ist rückgängig machbar;
   * wird dadurch ein geplantes Abendessen unkochbar (und das Fehlende kommt nicht rechtzeitig), verschiebt Yami es.
   */
  function changePantry(pantry: PantryLot[]) {
    const removed = state.pantry.find((l) => !pantry.some((x) => x.id === l.id))
    if (!removed) {
      setState((s) => ({ ...s, pantry }))
      return
    }
    const snap = snapshot()
    // abgelaufen entfernt = weggeworfen (für den Wochenrückblick), solange kein anderer Grund gewählt wird
    const waste = discardWaste(removed, today, state.prices)
    const after: AppState = { ...state, pantry, wasted: waste ? [...state.wasted, waste].slice(-WASTED_MAX) : state.wasted }
    const shift = autoShift(state, after, today)
    setState((s) => ({
      ...s,
      pantry,
      wasted: waste ? [...s.wasted, waste].slice(-WASTED_MAX) : s.wasted,
      ...(shift.records.length && s.plan === state.plan ? { plan: shift.state.plan, shifts: shift.state.shifts } : {}),
    }))
    askWhy(removed, snap, shift.records)
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

  /** „1 gegessen“ (Kuchen, Brot, Dessert aus dem Vorrat): Stück abziehen (zählt fürs Lernen); Rückgängig über den Toast */
  function eatPiece(lotId: string) {
    const r = eatOne(state.pantry, lotId, today)
    const snack = r.snack
    if (!snack) return
    const snap = snapshot()
    setState((s) => {
      const x = eatOne(s.pantry, lotId, today)
      return x.snack ? { ...s, pantry: x.pantry, snacks: [...s.snacks, x.snack].slice(-SNACKS_MAX) } : s
    })
    flash(`${snack.name}: 1 gegessen ✓`, snap)
  }

  return { changePantry, noteRequest, createPantryItem, setSpice, eatPiece }
}
