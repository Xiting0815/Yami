import { useEffect, useMemo, useRef, useState } from 'react'
import { defaultReviewMonday, weekReview } from '../review'
import { suggestion as weightSuggestion, weighedThisWeek } from '../progress'
import { type AppState, addDays, isoDate, parseIso, sharingActive, weekDays } from '../store'
import { daysUntil } from '../kitchen'
import { eveningOn } from '../bbq'
import type { SetAppState } from './types'
import type { Calendar } from './useCalendar'
import type { Ui } from './useUi'

/** Erinnerungen & Hinweise: Start-Checkliste, Wiegetag, Sicherung, Wochenrückblick, bald ablaufender Vorrat */
export function useStatus(
  state: AppState,
  setState: SetAppState,
  { today, days }: Calendar,
  { tab, reviewMonday }: Pick<Ui, 'tab' | 'reviewMonday'>,
  picks: string[],
) {
  const profile = state.profile
  // ───── Wiegen & Anpassung ─────
  const weighIns = state.weighIns
  const pendingSuggestion = profile ? weightSuggestion(weighIns, profile, state.adjustDecidedAt) : null
  const needsWeighIn = !!profile && !weighedThisWeek(weighIns, today)

  // ───── Start-Checkliste (nur beim allerersten Benutzen) ─────
  const onboarding = !state.onboarding
  // ein Grillabend oder Tapas-Abend (im Backplan) zählt als Abendessen des Tages
  const plannedCount = days.filter((d) => state.plan[d] || eveningOn(state.bakePlan, d)).length
  const openDay = days.find((d) => !state.plan[d] && !eveningOn(state.bakePlan, d) && d >= today)
  const dinnersDone = plannedCount > 0 && !openDay
  const somethingPlanned = plannedCount > 0 || picks.length > 0
  const listDone = !!state.onboardingListSeen
  // Familie teilen: Profil und Frühstück sind persönlich und optional – die Checkliste verlangt sie nicht
  const allDone = (sharingActive(state.ha) || (!!profile && picks.length > 0)) && dinnersDone && listDone
  /** Start-Checkliste gerade abgeschlossen → einmal „Alles eingerichtet“ zeigen */
  const [justFinished, setJustFinished] = useState(false)
  const finishShown = useRef(false)
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

  return {
    pendingSuggestion,
    onboarding,
    plannedCount,
    openDay,
    dinnersDone,
    somethingPlanned,
    listDone,
    justFinished,
    weighDue,
    backupDue,
    cardMonday,
    cardReview,
    showReviewCard,
    sheetReview,
    urgentNames,
  }
}

export type Status = ReturnType<typeof useStatus>
