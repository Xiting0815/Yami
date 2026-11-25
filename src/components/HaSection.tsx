import { useState } from 'react'
import { HaClient, haErrorText } from '../homeassistant'
import { type HaSettings, HA_DEFAULTS, SYNC_LIST_DEFAULT, newHa, withHaTargets } from '../store'

interface Props {
  ha?: HaSettings
  onChange: (ha: HaSettings | undefined) => void
  /** gleich jetzt abgleichen */
  onSyncNow: () => void
  syncing: boolean
  /** Familien-Abgleich: „Synchronisiert vor 1 Min. · mit Lisa“ */
  familyStatus?: string
  /** Haupt-Gerät laut Sync-Liste (pflegt Einkaufsliste/Kalender in HA) */
  main?: { person: string; mine: boolean }
}

const PEOPLE = ['Marc', 'Lisa']

function when(iso?: string): string {
  if (!iso) return 'noch nie'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return 'noch nie'
  const same = d.toDateString() === new Date().toDateString()
  const t = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
  return same ? `heute, ${t} Uhr` : `${d.toLocaleDateString('de-DE')}, ${t} Uhr`
}

export function HaSection({ ha, onChange, onSyncNow, syncing, familyStatus, main }: Props) {
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
  const [syncList, setSyncList] = useState(ha?.syncList ?? SYNC_LIST_DEFAULT)
  const [notify, setNotify] = useState(ha?.notify ?? '')
  const [otherName, setOtherName] = useState(ha?.me && !PEOPLE.includes(ha.me) ? ha.me : '')
  const [otherOpen, setOtherOpen] = useState(!!ha?.me && !PEOPLE.includes(ha.me))
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
    if (ha) onChange(withHaTargets(ha, next))
  }

  return (
    <section className="backup ha" id="ha">
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
      {connected && ha && (
        <div className="ha-family" id="ha-family">
          <h4>👨‍👩 Familie teilen</h4>
          <p className="muted small">
            Wochenplan, Einkaufsliste, Vorrat, eigene Rezepte und Bewertungen mit den anderen im Haushalt teilen – jede Person mit eigenem Handy und eigenem Token. Profil, Kalorien, Wiegen und Frühstück bleiben auf deinem Gerät.
          </p>
          {ha.otherShare && !ha.share && (
            <div className="share-warn-box" role="alert">
              <p className="bf-note">
                ⚠ Auf einem anderen Gerät{ha.otherShare.person ? ` (${ha.otherShare.person})` : ''} ist „Familie teilen“ aktiv. Schalte es hier auch ein, sonst überschreibt dieses Gerät den Kalender mit altem Stand. Bis dahin pflegt dieses Gerät Einkaufsliste und Abendessen-Kalender nicht.
              </p>
              <button className="btn primary" disabled={!ha.enabled} onClick={() => onChange({ ...ha, share: true, error: undefined })}>Familie teilen hier einschalten</button>
            </div>
          )}
          <label className="ha-switch">
            <input type="checkbox" checked={!!ha.share} disabled={!ha.enabled} onChange={(e) => onChange({ ...ha, share: e.target.checked, error: undefined })} />
            <span>{ha.share ? 'Familie teilen ist an' : ha.enabled ? 'Familie teilen ist aus' : 'Erst den Abgleich einschalten'}</span>
          </label>
          {ha.share && (
            <>
              <p className="small"><b>Wer bist du?</b>{!ha.me && <span className="bf-note"> Bitte wählen – erst dann wird geteilt.</span>}</p>
              <div className="seg2 ha-who" role="radiogroup" aria-label="Wer bist du?">
                {PEOPLE.map((p) => (
                  <button key={p} role="radio" aria-checked={ha.me === p} className={ha.me === p ? 'on' : ''} onClick={() => { setOtherOpen(false); onChange({ ...ha, me: p }) }}>{p}</button>
                ))}
                <button role="radio" aria-checked={otherOpen} className={otherOpen ? 'on' : ''} onClick={() => setOtherOpen(true)}>Andere …</button>
              </div>
              {otherOpen && (
                <div className="ha-fields">
                  <label>
                    Dein Name
                    <input
                      value={otherName}
                      maxLength={30}
                      onChange={(e) => setOtherName(e.target.value)}
                      onBlur={(e) => e.target.value.trim() && onChange({ ...ha, me: e.target.value.trim() })}
                    />
                  </label>
                </div>
              )}
              {ha.me && familyStatus && <p className="small ha-family-status" role="status">{familyStatus}</p>}
              {ha.me && main && (
                <p className="small muted">
                  Einkaufsliste und Kalender in Home Assistant pflegt immer das Gerät, das gerade abgleicht – zuletzt {main.mine ? 'dieses Gerät' : `${main.person}s Gerät`}. Es gibt nichts doppelt.
                </p>
              )}
            </>
          )}
        </div>
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
        <div className="ha-fields">
          <label>
            Liste für „Familie teilen“
            <input
              value={syncList}
              onChange={(e) => setSyncList(e.target.value)}
              onBlur={(e) => {
                const v = e.target.value.trim()
                const val = /^todo\.[a-z0-9_]+$/.test(v) ? v : SYNC_LIST_DEFAULT
                setSyncList(val)
                if (ha && val !== ha.syncList) onChange({ ...ha, syncList: val })
              }}
              autoCapitalize="off"
              spellCheck={false}
            />
          </label>
        </div>
        <div className="ha-fields">
          <label>
            Sofort aufs Handy (notify-Dienst, optional)
            <input
              value={notify}
              placeholder="notify.mobile_app_…"
              aria-label="notify-Dienst"
              onChange={(e) => setNotify(e.target.value)}
              onBlur={(e) => {
                const v = e.target.value.trim()
                const val = /^notify\.[a-z0-9_]+$/.test(v) ? v : ''
                setNotify(val)
                if (ha && val !== (ha.notify ?? '')) {
                  const { notify: _n, ...rest } = ha
                  onChange(val ? { ...ha, notify: val } : rest)
                }
              }}
              autoCapitalize="off"
              spellCheck={false}
            />
          </label>
        </div>
        <p className="muted small">
          Fehlt fürs Essen heute oder morgen etwas (oder hat Yami ein Gericht deshalb verschoben), schickt Yami dir sofort eine Mitteilung – über
          diesen Dienst (z. B. derselbe wie in der Automation „Yami: Erinnerung aufs Handy“). Leer: als Erinnerung im Kalender, kommt dann etwa
          15–20 Minuten später.
        </p>
        <p className="muted small">Nur eigene Einträge (Beschreibung „Yami“) werden geändert oder gelöscht – alles andere in deinen Listen bleibt unberührt.</p>
      </details>
    </section>
  )
}
