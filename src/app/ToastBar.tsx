import type { AppModel } from './useAppModel'

/** Kurze Meldung unten, ggf. mit „Rückgängig“ */
export function ToastBar({ m }: { m: AppModel }) {
  const { toast, undo } = m
  if (!toast) return null
  return (
    <div className={`toast ${toast.undo ? 'has-undo' : ''}`} role="status">
      <span className="toast-msg">{toast.msg}</span>
      {toast.undo && (
        <button className="toast-undo" onClick={undo}>
          Rückgängig
        </button>
      )}
    </div>
  )
}
