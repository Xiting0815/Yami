import type { Dispatch, SetStateAction } from 'react'
import type { AppState } from '../../store'
import type { SetAppState, Snapshot } from '../types'
import type { Calendar } from '../useCalendar'
import type { Flash, Toast } from '../useToast'
import type { Ui } from '../useUi'

/**
 * Alles, was die Aktionen brauchen – bei jedem Rendern neu, damit sie nie mit altem Stand arbeiten.
 * Undo-Muster: `const snap = snapshot()` vor der Änderung, danach `flash(text, snap)`.
 */
export interface ActionContext {
  state: AppState
  setState: SetAppState
  cal: Calendar
  ui: Ui
  flash: Flash
  setToast: Dispatch<SetStateAction<Toast | null>>
  snapshot: () => Snapshot
}
