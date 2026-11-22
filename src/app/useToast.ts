import { useCallback, useRef, useState } from 'react'
import type { Snapshot } from './types'

const TOAST_MS = 2200
const TOAST_UNDO_MS = 6000
/** mit Auswahl („Warum?“): länger, damit man in Ruhe tippen kann */
const TOAST_CHOICE_MS = 12000

/** Knopf im Toast (z. B. „Vergessen zu kaufen“) */
export interface ToastChoice {
  label: string
  onPick: () => void
  /** schon gewählt (z. B. Abgelaufenes zählt als „Weggeworfen“) */
  on?: boolean
}

export interface Toast {
  msg: string
  undo?: Snapshot
  /** Frage mit Knöpfen (z. B. „Warum?“ nach dem Löschen eines Vorratspostens) */
  choices?: ToastChoice[]
}

export type Flash = (msg: string, undo?: Snapshot, choices?: ToastChoice[]) => void

export function useToast() {
  const [toast, setToast] = useState<Toast | null>(null)
  const toastTimer = useRef<number>()
  /** Toast zeigen; mit `undo` (Stand vor der Aktion) bleibt er länger und bekommt den Knopf „Rückgängig“ */
  const flash: Flash = useCallback((msg: string, undo?: Snapshot, choices?: ToastChoice[]) => {
    window.clearTimeout(toastTimer.current)
    setToast({ msg, undo, ...(choices?.length ? { choices } : {}) })
    toastTimer.current = window.setTimeout(() => setToast(null), choices?.length ? TOAST_CHOICE_MS : undo ? TOAST_UNDO_MS : TOAST_MS)
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
