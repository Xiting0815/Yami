import { type AppState, STATE_KEYS, isoDate, sanitize } from './store'

/** Kennung in der Datei – bleibt „yami“ (frühere Name der App), damit ältere App-Stände die Sicherung weiter lesen */
const APP = 'yami'
/** auch so gekennzeichnete Dateien werden gelesen */
const APP_IDS = ['yami', 'gusto']
const VERSION = 1

/**
 * Sicherung erstellen: Teilen (z. B. Google Drive auf Android), sonst Datei herunterladen.
 * Ergibt `true`, wenn gesichert wurde – `false`, wenn der Nutzer das Teilen abgebrochen hat.
 * Aufruf direkt aus dem Klick (vor dem ersten await), sonst erlaubt der Browser das Teilen nicht.
 */
/** Inhalt der Sicherungsdatei – der Home-Assistant-Token und die Gerätekennung bleiben draußen, die Adresse nicht */
export function backupBody(state: AppState) {
  const { ha, ...rest } = state
  const haOut = ha ? (({ device: _device, ...h }) => ({ ...h, token: '', error: undefined }))(ha) : undefined
  return {
    app: APP,
    version: VERSION,
    exportedAt: new Date().toISOString(),
    state: haOut ? { ...rest, ha: haOut } : rest,
  }
}

export async function exportBackup(state: AppState): Promise<boolean> {
  const body = backupBody(state)
  const name = `gusto-sicherung-${isoDate(new Date())}.json`
  const blob = new Blob([JSON.stringify(body, null, 2)], { type: 'application/json' })
  const file = new File([blob], name, { type: 'application/json' })

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Gusto-Sicherung' })
      return true
    } catch (e) {
      // Nutzer hat das Teilen abgebrochen → nichts tun
      if (e instanceof DOMException && e.name === 'AbortError') return false
      // sonst weiter mit dem normalen Download
    }
  }

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  return true
}

/** Sicherungsdatei lesen: mit Hülle `{ app, version, state }` oder als nackter Stand. Wirft einen Error mit deutscher Meldung. */
export function parseBackup(text: string): AppState {
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('Die Datei ist kein lesbares JSON. Wähle eine Gusto-Sicherung (.json).')
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Das ist keine Gusto-Sicherung.')
  }

  let raw: unknown = data
  if ('app' in data || 'state' in data) {
    const wrapped = data as { app?: unknown; version?: unknown; state?: unknown }
    if (typeof wrapped.app !== 'string' || !APP_IDS.includes(wrapped.app)) throw new Error('Diese Datei gehört nicht zu Gusto.')
    if (wrapped.version !== undefined && wrapped.version !== VERSION) {
      throw new Error('Diese Sicherung stammt von einer neueren Version der App.')
    }
    raw = wrapped.state
  }

  if (!raw || typeof raw !== 'object' || Array.isArray(raw) || !Object.keys(raw).some((k) => STATE_KEYS.includes(k))) {
    throw new Error('Das ist keine Gusto-Sicherung – es fehlen die Daten.')
  }
  return sanitize(raw)
}
