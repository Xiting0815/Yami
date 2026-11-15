import { type AppState, STATE_KEYS, isoDate, sanitize } from './store'

const APP = 'yami'
const VERSION = 1

/**
 * Sicherung erstellen: Teilen (z. B. Google Drive auf Android), sonst Datei herunterladen.
 * Ergibt `true`, wenn gesichert wurde – `false`, wenn der Nutzer das Teilen abgebrochen hat.
 * Aufruf direkt aus dem Klick (vor dem ersten await), sonst erlaubt der Browser das Teilen nicht.
 */
export async function exportBackup(state: AppState): Promise<boolean> {
  const body = {
    app: APP,
    version: VERSION,
    exportedAt: new Date().toISOString(),
    state,
  }
  const name = `yami-sicherung-${isoDate(new Date())}.json`
  const blob = new Blob([JSON.stringify(body, null, 2)], { type: 'application/json' })
  const file = new File([blob], name, { type: 'application/json' })

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Yami-Sicherung' })
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
    throw new Error('Die Datei ist kein lesbares JSON. Wähle eine Yami-Sicherung (.json).')
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Das ist keine Yami-Sicherung.')
  }

  let raw: unknown = data
  if ('app' in data || 'state' in data) {
    const wrapped = data as { app?: unknown; version?: unknown; state?: unknown }
    if (wrapped.app !== APP) throw new Error('Diese Datei gehört nicht zu Yami.')
    if (wrapped.version !== undefined && wrapped.version !== VERSION) {
      throw new Error('Diese Sicherung stammt von einer neueren Version der App.')
    }
    raw = wrapped.state
  }

  if (!raw || typeof raw !== 'object' || Array.isArray(raw) || !Object.keys(raw).some((k) => STATE_KEYS.includes(k))) {
    throw new Error('Das ist keine Yami-Sicherung – es fehlen die Daten.')
  }
  return sanitize(raw)
}
