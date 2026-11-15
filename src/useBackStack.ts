import { useEffect, useRef } from 'react'

const read = (): number => (typeof history.state?.yamiDepth === 'number' ? history.state.yamiDepth : 0)

/**
 * Koppelt die „Ebenen“ der App (Tab ≠ Woche, offene Sheets) an den Browser-Verlauf,
 * damit die Zurück-Taste (Android) erst Sheets schließt, dann zur Woche wechselt und erst dort die App verlässt.
 *
 * `depth` = Anzahl aktuell offener Ebenen. Der Hook hält genau so viele eigene Verlaufseinträge:
 * - Ebene kommt dazu → pushState
 * - Ebene wird in der App geschlossen (✕, Hintergrund, Escape, Aktion) → history.go(-n), der Eintrag verschwindet wieder
 * - Zurück-Taste → `onBack(target)`: die App schließt Ebenen, bis nur noch `target` offen sind
 */
export function useBackStack(depth: number, onBack: (targetDepth: number) => void) {
  const want = useRef(depth)
  want.current = depth
  const cb = useRef(onBack)
  cb.current = onBack
  /** eigene Einträge unterhalb der aktuellen Position */
  const pushed = useRef(0)
  /** eine selbst ausgelöste Navigation (history.go) läuft noch → deren popstate ignorieren */
  const busy = useRef(false)
  const sync = useRef(() => {})

  useEffect(() => {
    // nach einem Reload kann der aktuelle Eintrag noch von uns stammen → wird unten abgebaut
    pushed.current = read()
    sync.current = () => {
      if (busy.current) return
      const d = want.current
      while (pushed.current < d) history.pushState({ yamiDepth: ++pushed.current }, '')
      if (pushed.current > d) {
        busy.current = true
        history.go(d - pushed.current)
      }
    }
    const onPop = () => {
      const own = busy.current
      busy.current = false
      pushed.current = read()
      if (!own && pushed.current < want.current) cb.current(pushed.current)
      // eigene Navigation fertig oder „Vorwärts“ in einen alten Eintrag → wieder angleichen
      else sync.current()
    }
    window.addEventListener('popstate', onPop)
    sync.current()
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => sync.current(), [depth])
}
