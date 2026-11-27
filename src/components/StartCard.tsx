import { Icon } from './Icon'

export interface StartStep {
  title: string
  sub: string
  /** Text des Knopfs, solange der Schritt der aktuelle ist */
  verb: string
  done: boolean
  /** noch nicht möglich (Einkaufsliste, bevor etwas geplant ist) */
  locked?: boolean
  /** erledigte Schritte lassen sich wieder öffnen („ändern“) */
  editable?: boolean
  onClick: () => void
}

/** Start-Checkliste beim ersten Öffnen: ein klarer nächster Schritt statt mehrerer Banner */
export function StartCard({ steps, onDismiss, onShare }: { steps: StartStep[]; onDismiss: () => void; /** frische Installation: „mit jemandem zusammen“ → Home Assistant */ onShare?: () => void }) {
  const done = steps.filter((s) => s.done).length
  const current = steps.findIndex((s) => !s.done && !s.locked)
  return (
    <section className="start-card" aria-label="So startest du">
      <div className="start-head">
        <b>So startest du</b>
        <span>{done} von {steps.length} erledigt</span>
      </div>
      {onShare && (
        <button className="link small start-share" onClick={onShare}>
          Ich nutze Gusto mit jemandem zusammen → mit Home Assistant verbinden
        </button>
      )}
      <div className="start-bar" aria-hidden>
        {steps.map((s, i) => <i key={i} className={s.done ? 'on' : ''} />)}
      </div>
      {steps.map((s, i) => {
        const state = s.done ? 'done' : i === current ? 'current' : s.locked ? 'locked' : 'open'
        return (
          <button key={i} className={`start-step ${state}`} onClick={s.onClick} disabled={s.locked && !s.done}>
            <span className="start-num">{s.done ? <Icon name="check" size={16} /> : i + 1}</span>
            <span className="start-text">
              <b>{s.title}</b>
              <small>{s.sub}</small>
            </span>
            {state === 'current' ? (
              <span className="pill">{s.verb}</span>
            ) : state === 'done' ? (
              s.editable && <span className="start-edit">ändern</span>
            ) : (
              <Icon name="chevron" size={18} />
            )}
          </button>
        )
      })}
      <div className="start-foot">
        <button className="link small start-dismiss" onClick={onDismiss}>Ausblenden</button>
      </div>
    </section>
  )
}
