import { useCallback, useEffect, useRef, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { HaClient, haErrorText } from './homeassistant'
import type { LocalItem } from './haSync'
import { haRound } from './haRun'
import { type AppState, type HaSettings, sharingActive } from './store'

/** eine Verbindung für die ganze App */
export const haClient = new HaClient()

export interface HaInput {
  ha?: HaSettings
  setState: Dispatch<SetStateAction<AppState>>
  /** Einkaufsliste der Abgleich-Woche */
  local: LocalItem[]
  state: AppState
  /** in HA abgehakt → in Yami als gekauft markieren */
  onBought: (keys: string[]) => void
}

export type HaLive = 'off' | 'connecting' | 'ok' | 'error'

/**
 * Hält die HA-Verbindung und gleicht ab: nach Änderungen (2 s verzögert), beim Zurückkehren in die App,
 * bei Live-Meldungen der Einkaufsliste und alle 15 Minuten.
 */
export function useHomeAssistant(input: HaInput) {
  const ref = useRef(input)
  ref.current = input
  const [live, setLive] = useState<HaLive>('off')
  const [syncing, setSyncing] = useState(false)
  const running = useRef(false)
  const again = useRef(false)
  const timer = useRef<number>()
  const unsub = useRef<(() => void) | null>(null)
  const unsubSync = useRef<(() => void) | null>(null)
  const connecting = useRef<Promise<void> | null>(null)

  const ha = input.ha
  const active = !!ha && ha.enabled && !!ha.url && !!ha.token

  const patch = useCallback((p: Partial<HaSettings>) => {
    ref.current.setState((s) => (s.ha ? { ...s, ha: { ...s.ha, ...p } } : s))
  }, [])

  const ensureConnected = useCallback(async () => {
    if (haClient.ready) return
    if (!connecting.current) {
      const h = ref.current.ha!
      setLive('connecting')
      connecting.current = haClient
        .connect(h.url, h.token)
        .then(async () => {
          unsub.current?.()
          unsub.current = await haClient.subscribe({ type: 'todo/item/subscribe', entity_id: ref.current.ha!.todo }, () => requestRef.current(500)).catch(() => null)
          // Familien-Abgleich: Änderungen der anderen kommen live über die Sync-Liste
          unsubSync.current?.()
          unsubSync.current = null
          if (sharingActive(ref.current.ha))
            unsubSync.current = await haClient.subscribe({ type: 'todo/item/subscribe', entity_id: ref.current.ha.syncList }, () => requestRef.current(500)).catch(() => null)
        })
        .finally(() => {
          connecting.current = null
        })
    }
    await connecting.current
  }, [])

  const run = useCallback(async () => {
    const cur = ref.current
    if (!cur.ha || !cur.ha.enabled || !cur.ha.url || !cur.ha.token) return
    if (running.current) {
      again.current = true
      return
    }
    running.current = true
    setSyncing(true)
    try {
      await ensureConnected()
      // Familien-Abgleich → Schreibstab → Einkaufsliste & Kalender (src/haRun.ts)
      const r = await haRound({
        api: haClient,
        getState: () => ref.current.state,
        setState: (fn) => ref.current.setState(fn),
        onBought: (keys) => ref.current.onBought(keys),
        now: new Date(),
      })
      if (r.again) again.current = true
      setLive(r.error ? 'error' : 'ok')
    } catch (e) {
      patch({ error: haErrorText(e) })
      setLive('error')
    } finally {
      running.current = false
      setSyncing(false)
      if (again.current) {
        again.current = false
        requestRef.current(1000)
      }
    }
  }, [ensureConnected, patch])

  const request = useCallback(
    (delay = 2000) => {
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => void run(), delay)
    },
    [run],
  )
  const requestRef = useRef(request)
  requestRef.current = request

  // Verbindung an/aus, Zugangsdaten geändert
  useEffect(() => {
    if (!active) {
      unsub.current?.()
      unsub.current = null
      unsubSync.current?.()
      unsubSync.current = null
      haClient.close()
      setLive('off')
      return
    }
    request(300)
    return () => window.clearTimeout(timer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, ha?.url, ha?.token, ha?.todo])

  // Familien-Abgleich an/aus, Person, Sync-Liste → Abos neu
  const shareKey = sharingActive(ha) ? `${ha.syncList}|${ha.me}` : ''
  const firstShare = useRef(true)
  useEffect(() => {
    if (firstShare.current) {
      firstShare.current = false
      return
    }
    if (!active) return
    unsub.current?.()
    unsub.current = null
    unsubSync.current?.()
    unsubSync.current = null
    if (haClient.ready) {
      connecting.current = null
      haClient.close()
    }
    request(300)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareKey])

  // geteilte Daten geändert → 2 s später abgleichen
  const st = input.state
  const firstShared = useRef(true)
  useEffect(() => {
    if (firstShared.current) {
      firstShared.current = false
      return
    }
    if (active && sharingActive(ha)) request(2000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [st.plan, st.pantry, st.bought, st.checked, st.custom, st.wasted, st.customRecipes, st.customIngredients, st.prices, st.staples, st.spices, st.pantryRequests, st.ratings, st.rejects, st.portionFeedback, st.bakeRatings, st.baked])

  // Änderungen an Liste, Plan, Vorrat → abgleichen
  const sig = JSON.stringify([input.local, Object.entries(input.state.plan).map(([d, e]) => [d, e?.recipeId, e?.servings, e?.status]), input.state.breakfastPicks, input.state.prepDays, input.state.weighIns.length, input.state.pantry.map((l) => [l.name, l.expires]), ha?.calendar, ha?.reminders])
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (active) request(2000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig])

  // Fokus, Sichtbarkeit, Intervall
  useEffect(() => {
    if (!active) return
    const onVis = () => {
      haClient.setVisible(!document.hidden)
      if (!document.hidden) requestRef.current(300)
    }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('focus', onVis)
    const id = window.setInterval(() => !document.hidden && requestRef.current(0), 15 * 60_000)
    return () => {
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('focus', onVis)
      window.clearInterval(id)
    }
  }, [active])

  return {
    live,
    syncing,
    syncNow: () => run(),
  }
}
