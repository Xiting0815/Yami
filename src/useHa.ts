import { useCallback, useEffect, useRef, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { HaClient, haErrorText } from './homeassistant'
import { type Desired, type LocalItem, plannedDinners, plannedReminders, syncCalendar, syncTodo } from './haSync'
import type { AppState, HaSettings } from './store'

/** eine Verbindung für die ganze App */
export const haClient = new HaClient()

export interface HaInput {
  ha?: HaSettings
  setState: Dispatch<SetStateAction<AppState>>
  /** Einkaufsliste der Abgleich-Woche */
  local: LocalItem[]
  state: Pick<AppState, 'plan' | 'breakfastPicks' | 'prepDays' | 'weighIns' | 'pantry' | 'profile'>
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
      const h = ref.current.ha!
      const now = new Date()
      const st = ref.current.state
      const todo = await syncTodo(haClient, h, ref.current.local, (keys) => ref.current.onBought(keys))
      const reminders: Desired[] = plannedReminders(
        { breakfastPicks: st.breakfastPicks, prepDays: st.prepDays, weighIns: st.weighIns, hasProfile: !!st.profile, pantry: st.pantry },
        now,
      )
      const cal = await syncCalendar(haClient, h, plannedDinners(st.plan, isoLocal(now)), reminders, now)
      const error = todo.error ?? cal.error
      patch({
        items: todo.items,
        done: todo.done,
        events: cal.events,
        lastSync: now.toISOString(),
        error: error ? `Nicht alles ließ sich abgleichen: ${error}` : undefined,
      })
      setLive(error ? 'error' : 'ok')
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
      haClient.close()
      setLive('off')
      return
    }
    request(300)
    return () => window.clearTimeout(timer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, ha?.url, ha?.token, ha?.todo])

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

  return { live, syncing, syncNow: () => run() }
}

function isoLocal(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
