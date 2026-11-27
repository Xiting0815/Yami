import { exportBackup } from '../../backup'
import type { AppState, HaSettings } from '../../store'
import { settleDue } from '../upkeep'
import type { ActionContext } from './context'

/** Einstellungen: Gelerntes zurücksetzen, Sicherung, Home-Assistant */
export function profileActions({ state, setState, cal, ui, flash, snapshot }: ActionContext) {
  const { today } = cal

  function resetLearning() {
    const snap = snapshot()
    setState((s) => ({ ...s, tasteSince: today, rejects: [], ratings: {}, ratingDismissed: [], portionFeedback: {} }))
    flash('Gelerntes zurückgesetzt', snap)
  }

  function exportData() {
    // Stand mit heutigem Datum speichern, damit die Datei selbst die letzte Sicherung kennt
    exportBackup({ ...state, lastBackup: today })
      .then((saved) => {
        if (!saved) return
        setState((s) => ({ ...s, lastBackup: today }))
        flash('Sicherung erstellt ✓')
      })
      .catch(() => flash('Sicherung fehlgeschlagen – bitte nochmal versuchen'))
  }

  function importData(s: AppState) {
    const snap = snapshot()
    // wie beim Start: vergangene Gerichte gelten als gekocht
    const d = settleDue(s, today)
    // der Token steht nie in der Sicherung: bei gleicher Adresse den vorhandenen behalten
    const keepHa = s.ha && state.ha && s.ha.url === state.ha.url && !s.ha.token ? { ...s.ha, token: state.ha.token } : s.ha
    // Familien-Abgleich: Gerät und Stand bleiben; der Abgleich-Stand beginnt neu → die Sicherung ergänzt den Haushalt nur, überschreibt nichts
    const ha = keepHa && state.ha ? { ...keepHa, device: state.ha.device, me: keepHa.me ?? state.ha.me } : keepHa
    setState({ ...s, ha, sync: undefined, plan: d.plan, breakfast: d.breakfast, pantry: d.pantry, wasted: d.wasted, lastBackup: s.lastBackup ?? today })
    ui.setShowProfile(false)
    flash('Sicherung geladen ✓', snap)
  }

  function setHa(h: HaSettings | undefined) {
    setState((s) => ({ ...s, ha: h }))
  }

  return { resetLearning, exportData, importData, setHa }
}
