import { type ComponentType, Suspense, lazy } from 'react'

/**
 * Selten gebrauchte Ansichten (Kochmodus, Editor, Rückblick, Einstellungen/HA, Tapas-Ablauf …) erst bei Bedarf laden:
 * der Start der App muss weniger Code lesen. Offline kein Problem – alle Teile liegen im Vorab-Speicher (Service Worker).
 * Jede Ansicht bekommt ihr eigenes Suspense, damit beim Nachladen nichts anderes kurz verschwindet.
 */
export function lazyNamed<P extends object>(load: () => Promise<ComponentType<P>>): ComponentType<P> {
  const L = lazy(() =>
    load().then(
      (c) => ({ default: c }),
      (err) => {
        // Teil fehlt (z. B. alte Version im Fenster, neue auf dem Server): einmal neu laden statt leerer Ansicht
        let again = false
        try {
          again = sessionStorage.getItem('gusto-lazy-reload') === '1'
          sessionStorage.setItem('gusto-lazy-reload', '1')
        } catch {
          again = true
        }
        if (!again) window.location.reload()
        throw err
      },
    ),
  ) as unknown as ComponentType<P>
  const Wrapped = (props: P) => (
    <Suspense fallback={null}>
      <L {...props} />
    </Suspense>
  )
  return Wrapped
}
