import type { Profile } from '../../energy'
import { targetKcal } from '../../energy'
import { exportBackup } from '../../backup'
import { type Suggestion, type WeighIn, upsertWeighIn } from '../../progress'
import type { AppState, HaSettings } from '../../store'
import { settleDue } from '../upkeep'
import type { ActionContext } from './context'

/** Profil, Wiegen & Zielanpassung, Gelerntes zurücksetzen, Sicherung, Home-Assistant-Einstellungen */
export function profileActions({ state, setState, cal, ui, flash, snapshot }: ActionContext, pendingSuggestion: Suggestion | null) {
  const { today } = cal

  function saveProfile(p: Profile) {
    setState((s) => ({ ...s, profile: p, profileCreated: s.profile ? s.profileCreated : today }))
    ui.setShowProfile(false)
    flash(`Tagesziel: ${targetKcal(p).toLocaleString('de-DE')} kcal ✓`)
  }

  function saveWeighIn(w: WeighIn) {
    setState((s) => {
      const list = upsertWeighIn(s.weighIns, w)
      const latest = list[list.length - 1]
      // Profil folgt der neuesten Messung (Gewicht & Körperfett → genauere Bedarfsformel)
      const profile = s.profile ? { ...s.profile, weightKg: latest.weight, fatPct: latest.fat ?? s.profile.fatPct } : s.profile
      return { ...s, weighIns: list, profile }
    })
    flash('Messung gespeichert ✓')
  }

  function deleteWeighIn(date: string) {
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
  }

  /** Vorschlag zum Tagesziel annehmen oder ablehnen */
  function decideAdjust(accept: boolean) {
    setState((s) => ({
      ...s,
      adjustDecidedAt: s.weighIns.length,
      profile: accept && s.profile && pendingSuggestion ? { ...s.profile, adjust: (s.profile.adjust ?? 0) + pendingSuggestion.delta } : s.profile,
    }))
    flash(accept ? 'Tagesziel angepasst ✓' : 'Ziel bleibt wie es ist')
  }

  function setGoal(kg: number | undefined) {
    setState((s) => (s.profile ? { ...s, profile: { ...s.profile, goalWeight: kg && kg > 30 ? kg : undefined } } : s))
  }

  function setMuscleUnit(u: 'kg' | '%') {
    setState((s) => (s.profile ? { ...s, profile: { ...s.profile, muscleUnit: u } } : s))
  }

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
    setState({ ...s, ha: keepHa, plan: d.plan, breakfast: d.breakfast, pantry: d.pantry, wasted: d.wasted, lastBackup: s.lastBackup ?? today })
    ui.setShowProfile(false)
    flash('Sicherung geladen ✓', snap)
  }

  function setHa(h: HaSettings | undefined) {
    setState((s) => ({ ...s, ha: h }))
  }

  return { saveProfile, saveWeighIn, deleteWeighIn, decideAdjust, setGoal, setMuscleUnit, resetLearning, exportData, importData, setHa }
}
