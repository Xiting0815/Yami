import type { AppModel } from './useAppModel'

/** Kurze Meldung unten, ggf. mit Auswahl-Knöpfen („Warum?“) und „Rückgängig“ */
export function ToastBar({ m }: { m: AppModel }) {
  const { toast, undo } = m
  if (!toast) return null
  if (toast.choices?.length)
    return (
      <div className="toast has-choices" role="status">
        <span className="toast-msg">{toast.msg}</span>
        <span className="toast-choices">
          {toast.choices.map((c) => (
            <button key={c.label} className={`toast-choice ${c.on ? 'on' : ''}`} aria-pressed={!!c.on} onClick={c.onPick}>
              {c.label}
            </button>
          ))}
          {toast.undo && (
            <button className="toast-undo" onClick={undo}>
              Rückgängig
            </button>
          )}
        </span>
      </div>
    )
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
