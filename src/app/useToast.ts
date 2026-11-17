import { useCallback, useRef, useState } from 'react'
import type { Snapshot } from './types'

const TOAST_MS = 2200
const TOAST_UNDO_MS = 6000

export interface Toast {
  msg: string
  undo?: Snapshot
}

export type Flash = (msg: string, undo?: Snapshot) => void

export function useToast() {
  const [toast, setToast] = useState<Toast | null>(null)
  const toastTimer = useRef<number>()
  /** Toast zeigen; mit `undo` (Stand vor der Aktion) bleibt er länger und bekommt den Knopf „Rückgängig“ */
  const flash: Flash = useCallback((msg: string, undo?: Snapshot) => {
    window.clearTimeout(toastTimer.current)
    setToast({ msg, undo })
    toastTimer.current = window.setTimeout(() => setToast(null), undo ? TOAST_UNDO_MS : TOAST_MS)
  }, [])
  return { toast, setToast, flash }
}

/**
 * Immer der aktuelle Stand – auch für Callbacks, die verzögert feuern (Karten-Animation).
 * `snapshot()` vor einer Aktion aufrufen und an `flash` geben → „Rückgängig“.
 */
export function useSnapshot(current: Snapshot): () => Snapshot {
  const live = useRef<Snapshot>(current)
  live.current = current
  return () => live.current
}
