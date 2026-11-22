import { useEffect, useState } from 'react'
import type { BreakfastType } from '../types'
import { useBackStack } from '../useBackStack'
import type { EditorState, Meal, SheetState, Tab } from './types'

/** Bildschirm-Zustand: Tab, Wischen, offene Sheets – plus Zurück-Taste */
export function useUi(days: string[], weekKey: string) {
  const [tab, setTab] = useState<Tab>('woche')
  const [swipeDay, setSwipeDay] = useState<string>(days[0])
  const [sheet, setSheet] = useState<SheetState | null>(null)
  /** Kochmodus über dem Rezept-Sheet */
  const [cooking, setCooking] = useState(false)
  useEffect(() => {
    if (!sheet) setCooking(false)
  }, [sheet])
  const [showFilters, setShowFilters] = useState(false)
  /** weggewischte Karten dieser Woche (kommen ans Ende des Stapels) */
  const [rejected, setRejected] = useState<string[]>([])
  const [meal, setMeal] = useState<Meal>('dinner')
  const [bTypes, setBTypes] = useState<BreakfastType[]>([])
  const [bPantryOnly, setBPantryOnly] = useState(false)
  const [editor, setEditor] = useState<EditorState | null>(null)
  const [showPrep, setShowPrep] = useState(false)
  const [showProfile, setShowProfileRaw] = useState(false)
  /** Profil-Sheet direkt beim Home-Assistant-Abschnitt öffnen */
  const [profileFocus, setProfileFocus] = useState<'ha' | null>(null)
  const setShowProfile = (v: boolean, focus: 'ha' | null = null) => {
    setProfileFocus(v ? focus : null)
    setShowProfileRaw(v)
  }
  const [showProgress, setShowProgress] = useState(false)
  /** Wochenrückblick-Sheet: Montag der gezeigten Woche (null = zu) */
  const [reviewMonday, setReviewMonday] = useState<string | null>(null)
  /** Tag, dessen „⋯“-Aktionen offen sind */
  const [actionsDay, setActionsDay] = useState<string | null>(null)
  /** „Was koche ich damit?“: Tag wählen (Sheet) und Wischen nach Vorrat sortieren */
  /** „Wie war’s?“-Sheet nach „Fertig gekocht“: Tag des Gerichts (null = zu) */
  const [rateDay, setRateDay] = useState<string | null>(null)
  /** „Wie war’s?“ nach „Fertig gebacken“ (Backen & Desserts) */
  const [rateBake, setRateBake] = useState<{ recipeId: string; date: string } | null>(null)
  /** „Wie war’s?“ nach „Fertig vorbereitet“ (Frühstück): Schlüssel `Prep-Tag:Rezept-Id` */
  const [rateBf, setRateBf] = useState<{ recipeId: string; date: string } | null>(null)
  /** Backen-Aktionen (Antippen in der Wochenansicht): Tag + Rezept, `move` = gleich den Tag zum Verschieben wählen */
  const [bakeSheet, setBakeSheet] = useState<{ day: string; recipeId: string; move?: boolean } | null>(null)
  const [pantryChooser, setPantryChooser] = useState(false)
  const [pantryMode, setPantryMode] = useState(false)

  useEffect(() => setRejected([]), [weekKey])
  // Vorrats-Modus endet mit dem Tab-Wechsel
  useEffect(() => {
    if (tab !== 'wischen' || meal !== 'dinner') setPantryMode(false)
  }, [tab, meal])

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
    [rateDay !== null, () => setRateDay(null)],
    [rateBake !== null, () => setRateBake(null)],
    [rateBf !== null, () => setRateBf(null)],
    [!!bakeSheet, () => setBakeSheet(null)],
  ]
  const open = layers.filter(([on]) => on)
  useBackStack(open.length, (target) => open.slice(target).forEach(([, close]) => close()))

  return {
    tab, setTab,
    swipeDay, setSwipeDay,
    sheet, setSheet,
    cooking, setCooking,
    showFilters, setShowFilters,
    rejected, setRejected,
    meal, setMeal,
    bTypes, setBTypes,
    bPantryOnly, setBPantryOnly,
    editor, setEditor,
    showPrep, setShowPrep,
    showProfile, setShowProfile, profileFocus,
    showProgress, setShowProgress,
    reviewMonday, setReviewMonday,
    actionsDay, setActionsDay,
    pantryChooser, setPantryChooser,
    rateDay, setRateDay,
    rateBake, setRateBake,
    rateBf, setRateBf,
    bakeSheet, setBakeSheet,
    pantryMode, setPantryMode,
  }
}

export type Ui = ReturnType<typeof useUi>
