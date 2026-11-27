import { useEffect, useState } from 'react'
import { registerSW } from 'virtual:pwa-register'

/**
 * App-Updates (PWA). Früher: automatisches Update, aber der Browser sucht nur beim echten Neustart der App
 * nach einer neuen Version – eine aus dem Hintergrund geholte PWA blieb tagelang auf dem alten Stand.
 * Jetzt: bei jeder Rückkehr in die App (und stündlich) nachsehen; liegt eine neue Version bereit,
 * erscheint oben „Neu laden“. Kein automatisches Neuladen mitten im Kochmodus oder beim Tippen.
 */
let apply: (() => void) | null = null
const listeners = new Set<() => void>()

export function initServiceWorker() {
  const update = registerSW({
    immediate: true,
    onNeedRefresh() {
      apply = () => {
        void update(true)
        // Sicherheitsnetz: lädt die Seite nicht von selbst neu (z. B. noch nicht vom Service Worker gesteuert)
        window.setTimeout(() => window.location.reload(), 3000)
      }
      listeners.forEach((f) => f())
    },
    onRegisteredSW(_url, reg) {
      if (!reg) return
      let last = Date.now()
      const check = () => {
        if (document.visibilityState !== 'visible' || !navigator.onLine || Date.now() - last < 60_000) return
        last = Date.now()
        reg.update().catch(() => {})
      }
      document.addEventListener('visibilitychange', check)
      window.setInterval(check, 60 * 60_000)
    },
  })
}

export function UpdateBanner() {
  const [ready, setReady] = useState(() => apply != null)
  useEffect(() => {
    const f = () => setReady(true)
    listeners.add(f)
    return () => {
      listeners.delete(f)
    }
  }, [])
  if (!ready) return null
  return (
    <div className="update-banner" role="status">
      <span>✨ Neue Version von Gusto ist da.</span>
      <button className="btn primary" onClick={() => apply?.()}>
        Neu laden
      </button>
    </div>
  )
}
