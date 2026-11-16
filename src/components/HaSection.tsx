import { useState } from 'react'
import { HaClient, haErrorText } from '../homeassistant'
import { type HaSettings, HA_DEFAULTS, newHa } from '../store'

interface Props {
  ha?: HaSettings
  onChange: (ha: HaSettings | undefined) => void
  /** gleich jetzt abgleichen */
  onSyncNow: () => void
  syncing: boolean
}

function when(iso?: string): string {
  if (!iso) return 'noch nie'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return 'noch nie'
  const same = d.toDateString() === new Date().toDateString()
  const t = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
  return same ? `heute, ${t} Uhr` : `${d.toLocaleDateString('de-DE')}, ${t} Uhr`
}

export function HaSection({ ha, onChange, onSyncNow, syncing }: Props) {
  const [url, setUrl] = useState(ha?.url ?? '')
  const [token, setToken] = useState(ha?.token ?? '')
  const [show, setShow] = useState(false)
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null)
  const [entities, setEntities] = useState({
    todo: ha?.todo ?? HA_DEFAULTS.todo,
    calendar: ha?.calendar ?? HA_DEFAULTS.calendar,
    reminders: ha?.reminders ?? HA_DEFAULTS.reminders,
  })
  const connected = !!ha?.token && !!ha.url

  async function test() {
    setTesting(true)
    setResult(null)
    const client = new HaClient()
    try {
      await client.connect(url, token)
      const next: HaSettings = { ...(ha ?? newHa()), url: url.trim(), token: token.trim(), enabled: true, ...entities, error: undefined }
      onChange(next)
      setResult({ ok: true, text: `✓ Verbunden${client.haVersion ? ` – Home Assistant ${client.haVersion}` : ''}` })
    } catch (e) {
      setResult({ ok: false, text: haErrorText(e) })
    } finally {
      client.close()
      setTesting(false)
    }
  }

  function saveEntity(k: keyof typeof entities, v: string) {
    const val = v.trim()
    const ok = /^[a-z_]+\.[a-z0-9_]+$/.test(val)
    const next = { ...entities, [k]: ok ? val : HA_DEFAULTS[k] }
    setEntities(next)
    if (ha) onChange({ ...ha, ...next })
  }

  return (
    <section className="backup ha">
      <h3>🏠 Home Assistant</h3>
      <p className="muted small">
        Einkaufsliste, Erinnerungen und Plan mit deinem Home Assistant abgleichen. Alles läuft direkt zwischen diesem Gerät und deinem Home Assistant; der Token bleibt nur hier und kommt nicht in die Sicherung.
      </p>
      <label className="ha-switch">
        <input
          type="checkbox"
          checked={!!ha?.enabled}
          disabled={!connected}
          onChange={(e) => ha && onChange({ ...ha, enabled: e.target.checked, error: undefined })}
        />
        <span>{ha?.enabled ? 'Abgleich ist an' : connected ? 'Abgleich ist aus' : 'Erst verbinden, dann einschalten'}</span>
      </label>
      <div className="ha-fields">
        <label>
          Adresse (Nabu-Casa-URL)
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://abcdef.ui.nabu.casa" inputMode="url" autoCapitalize="off" autoCorrect="off" spellCheck={false} />
        </label>
        <label>
          Zugriffs-Token
          <span className="ha-token">
            <input type={show ? 'text' : 'password'} value={token} onChange={(e) => setToken(e.target.value)} autoComplete="off" autoCapitalize="off" spellCheck={false} />
            <button type="button" className="link small" onClick={() => setShow((v) => !v)}>{show ? 'Verbergen' : 'Anzeigen'}</button>
          </span>
        </label>
      </div>
      <p className="muted small">
        Token erstellen: In Home Assistant unten links auf deinen Namen tippen → Sicherheit → Langlebige Zugriffstoken → Token erstellen.
      </p>
      <div className="backup-actions">
        <button className="btn primary" disabled={testing || !url.trim() || !token.trim()} onClick={() => void test()}>
          {testing ? 'Teste …' : 'Verbinden & testen'}
        </button>
      </div>
      {result && (
        <p className={result.ok ? 'small' : 'bf-note'} role={result.ok ? 'status' : 'alert'}>
          {result.ok ? result.text : `⚠ ${result.text}`}
        </p>
      )}
      {connected && (
        <>
          <p className="small">Zuletzt abgeglichen: <b>{when(ha?.lastSync)}</b></p>
          {ha?.error && <p className="bf-note" role="alert">⚠ {ha.error}</p>}
          <div className="backup-actions">
            <button className="btn ghost" disabled={syncing || !ha?.enabled} onClick={onSyncNow}>{syncing ? 'Gleiche ab …' : 'Jetzt abgleichen'}</button>
            <button
              className="btn ghost"
              onClick={() => {
                if (!window.confirm('Verbindung trennen? Der Token wird von diesem Gerät gelöscht.')) return
                onChange(ha && { ...ha, token: '', enabled: false, error: undefined })
                setToken('')
                setResult(null)
              }}
            >
              Verbindung trennen
            </button>
          </div>
        </>
      )}
      <details className="ha-adv">
        <summary>Erweitert</summary>
        <div className="ha-fields">
          <label>
            Einkaufsliste
            <input value={entities.todo} onChange={(e) => setEntities({ ...entities, todo: e.target.value })} onBlur={(e) => saveEntity('todo', e.target.value)} autoCapitalize="off" spellCheck={false} />
          </label>
          <label>
            Kalender für den Plan
            <input value={entities.calendar} onChange={(e) => setEntities({ ...entities, calendar: e.target.value })} onBlur={(e) => saveEntity('calendar', e.target.value)} autoCapitalize="off" spellCheck={false} />
          </label>
          <label>
            Kalender für Erinnerungen
            <input value={entities.reminders} onChange={(e) => setEntities({ ...entities, reminders: e.target.value })} onBlur={(e) => saveEntity('reminders', e.target.value)} autoCapitalize="off" spellCheck={false} />
          </label>
        </div>
        <p className="muted small">Nur eigene Einträge (Beschreibung „Yami“) werden geändert oder gelöscht – alles andere in deinen Listen bleibt unberührt.</p>
      </details>
    </section>
  )
}
