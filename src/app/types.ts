import type { Dispatch, SetStateAction } from 'react'
import type { CustomRecipe, Recipe } from '../types'
import type { AppState } from '../store'

export type Tab = 'woche' | 'wischen' | 'liste' | 'vorrat' | 'rezepte'

/** Wischen & Rezepte: Abendessen oder Frühstück */
export type Meal = 'dinner' | 'breakfast'

export type SetAppState = Dispatch<SetStateAction<AppState>>

export interface SheetState {
  recipe: Recipe
  /** Tag, für den das Rezept angesehen wird (Wochenplan/Wischen) */
  day?: string
  mode: 'view' | 'take' | 'pick'
}

/** Rezept-Editor: leer = neues Rezept */
export interface EditorState {
  recipe?: CustomRecipe
}

/** Stand vor einer Aktion – „Rückgängig“ stellt ihn komplett wieder her */
export interface Snapshot {
  state: AppState
  rejected: string[]
  swipeDay: string
  tab: Tab
  meal: Meal
}
