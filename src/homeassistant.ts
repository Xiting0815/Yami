/**
 * Kleiner Home-Assistant-Client über die WebSocket-API.
 * Browser wenden auf WebSockets kein CORS an – darum geht hier alles über wss://…/api/websocket (kein REST).
 */

export type HaErrorKind = 'auth' | 'network' | 'unsupported' | 'failed'

export class HaError extends Error {
  kind: HaErrorKind
  code?: string
  constructor(kind: HaErrorKind, message: string, code?: string) {
    super(message)
    this.kind = kind
    this.code = code
  }
}

/** Deutsche Meldung für einen Fehler */
export function haErrorText(e: unknown): string {
  if (e instanceof HaError) {
    if (e.kind === 'auth') return 'Token falsch oder abgelaufen.'
    if (e.kind === 'network') return 'Adresse nicht erreichbar.'
    if (e.kind === 'unsupported') return 'Home Assistant unterstützt diesen Befehl nicht.'
    return `Home Assistant meldet: ${e.message}`
  }
  return e instanceof Error ? e.message : 'Unbekannter Fehler.'
}

/** Eingabe zu wss://host/api/websocket machen; null, wenn keine brauchbare Adresse */
export function normalizeUrl(input: string): string | null {
  let s = input.trim()
  if (!s) return null
  if (!/^[a-z]+:\/\//i.test(s)) s = 'https://' + s
  let u: URL
  try {
    u = new URL(s)
  } catch {
    return null
  }
  const proto = u.protocol.toLowerCase()
  let ws: string
  if (proto === 'https:' || proto === 'wss:') ws = 'wss:'
  else if (proto === 'http:' || proto === 'ws:') ws = 'ws:'
  else return null
  if (!u.host) return null
  // Pfad ab "/api" abschneiden, abschließende Schrägstriche entfernen
  let path = u.pathname
  const i = path.indexOf('/api')
  if (i >= 0) path = path.slice(0, i)
  path = path.replace(/\/+$/, '')
  return `${ws}//${u.host}${path}/api/websocket`
}

export interface WsLike {
  readyState: number
  send(data: string): void
  close(): void
  onopen: ((ev?: unknown) => void) | null
  onmessage: ((ev: { data: unknown }) => void) | null
  onclose: ((ev?: unknown) => void) | null
  onerror: ((ev?: unknown) => void) | null
}
export type WsCtor = new (url: string) => WsLike

export interface HaClientOptions {
  WebSocket?: WsCtor
  /** Wartezeiten (ms) zwischen Wiederverbindungsversuchen */
  backoff?: number[]
  /** so lange darf die Seite verborgen sein, bevor die Verbindung geschlossen wird (ms) */
  hiddenGraceMs?: number
  connectTimeoutMs?: number
}

export type HaStatus = 'idle' | 'connecting' | 'ready' | 'closed'

interface Pending {
  resolve: (v: unknown) => void
  reject: (e: unknown) => void
}
interface Sub {
  id?: number
  msg: Record<string, unknown>
  cb: (event: unknown) => void
}

export class HaClient {
  status: HaStatus = 'idle'
  haVersion?: string
  /** Rückruf bei jeder Statusänderung (auch Wiederverbindung) */
  onStatus?: (s: HaStatus, err?: HaError) => void

  private WS: WsCtor
  private backoff: number[]
  private graceMs: number
  private timeoutMs: number
  private ws: WsLike | null = null
  private url = ''
  private token = ''
  private nextId = 1
  private pending = new Map<number, Pending>()
  private subs = new Map<number, Sub>()
  private wantOpen = false
  private visible = true
  private attempt = 0
  private reconnectTimer: ReturnType<typeof setTimeout> | undefined
  private hiddenTimer: ReturnType<typeof setTimeout> | undefined
  private suspended = false

  constructor(opts: HaClientOptions = {}) {
    this.WS = opts.WebSocket ?? (globalThis as unknown as { WebSocket: WsCtor }).WebSocket
    this.backoff = opts.backoff ?? [1000, 2000, 5000, 10_000, 30_000]
    this.graceMs = opts.hiddenGraceMs ?? 5 * 60_000
    this.timeoutMs = opts.connectTimeoutMs ?? 10_000
  }

  /** Verbinden und anmelden. Wirft HaError('auth' | 'network'). */
  async connect(url: string, token: string): Promise<void> {
    const ws = normalizeUrl(url)
    if (!ws) throw new HaError('network', 'Adresse ungültig')
    this.close()
    this.url = ws
    this.token = token.trim()
    this.wantOpen = true
    this.suspended = false
    this.attempt = 0
    try {
      await this.open()
    } catch (e) {
      // erster Versuch gescheitert: nicht im Hintergrund weiterprobieren, der Aufrufer entscheidet
      this.close()
      throw e
    }
  }

  /** Verbindung schließen und nicht wieder aufbauen */
  close(): void {
    this.wantOpen = false
    this.suspended = false
    clearTimeout(this.reconnectTimer)
    clearTimeout(this.hiddenTimer)
    this.subs.clear()
    this.drop(new HaError('network', 'Verbindung geschlossen'))
    this.setStatus('closed')
  }

  /** Seite sichtbar/verborgen – verborgen länger als die Schonfrist: Verbindung schließen, beim Zurückkehren neu öffnen */
  setVisible(v: boolean): void {
    this.visible = v
    clearTimeout(this.hiddenTimer)
    if (!this.wantOpen) return
    if (v) {
      if (this.status !== 'ready' && this.status !== 'connecting') {
        this.suspended = false
        this.attempt = 0
        this.open().catch(() => {})
      }
    } else {
      this.hiddenTimer = setTimeout(() => {
        if (!this.wantOpen || this.visible) return
        this.suspended = true
        clearTimeout(this.reconnectTimer)
        this.drop(new HaError('network', 'Verbindung pausiert'))
        this.setStatus('closed')
      }, this.graceMs)
    }
  }

  get ready(): boolean {
    return this.status === 'ready'
  }

  command<T = unknown>(msg: Record<string, unknown>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      if (!this.ws || this.status !== 'ready') return reject(new HaError('network', 'Nicht verbunden'))
      const id = this.nextId++
      this.pending.set(id, { resolve: resolve as (v: unknown) => void, reject })
      try {
        this.ws.send(JSON.stringify({ ...msg, id }))
      } catch {
        this.pending.delete(id)
        reject(new HaError('network', 'Senden fehlgeschlagen'))
      }
    })
  }

  callService<T = unknown>(
    domain: string,
    service: string,
    data: Record<string, unknown> = {},
    target?: Record<string, unknown>,
    returnResponse = false,
  ): Promise<T> {
    const msg: Record<string, unknown> = { type: 'call_service', domain, service, service_data: data }
    if (target) msg.target = target
    if (returnResponse) msg.return_response = true
    return this.command<T>(msg)
  }

  /** Abo (z. B. todo/item/subscribe). Ergibt eine Funktion zum Beenden. Wird nach einer Wiederverbindung erneuert. */
  async subscribe(msg: Record<string, unknown>, cb: (event: unknown) => void): Promise<() => void> {
    const sub: Sub = { msg, cb }
    await this.startSub(sub)
    return () => {
      const id = sub.id
      if (id == null) return
      this.subs.delete(id)
      sub.id = undefined
      if (this.ready) this.command({ type: 'unsubscribe_events', subscription: id }).catch(() => {})
    }
  }

  // ───── intern ─────

  private async startSub(sub: Sub): Promise<number> {
    if (!this.ws || this.status !== 'ready') throw new HaError('network', 'Nicht verbunden')
    const id = this.nextId++
    sub.id = id
    this.subs.set(id, sub)
    try {
      await new Promise<void>((resolve, reject) => {
        this.pending.set(id, { resolve: () => resolve(), reject })
        this.ws!.send(JSON.stringify({ ...sub.msg, id }))
      })
    } catch (e) {
      this.subs.delete(id)
      throw e
    }
    return id
  }

  private setStatus(s: HaStatus, err?: HaError) {
    this.status = s
    this.onStatus?.(s, err)
  }

  private drop(err: HaError) {
    const ws = this.ws
    this.ws = null
    if (ws) {
      ws.onopen = ws.onmessage = ws.onclose = ws.onerror = null
      try {
        ws.close()
      } catch {
        /* egal */
      }
    }
    for (const p of this.pending.values()) p.reject(err)
    this.pending.clear()
  }

  private open(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.setStatus('connecting')
      let settled = false
      const fail = (e: HaError) => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        this.drop(e)
        if (e.kind === 'auth') {
          this.wantOpen = false
          this.setStatus('closed', e)
        } else {
          this.setStatus('closed', e)
          this.scheduleReconnect()
        }
        reject(e)
      }
      let ws: WsLike
      try {
        ws = new this.WS(this.url)
      } catch {
        // nicht aus dem Promise-Konstruktor heraus verbinden → als Netzwerkfehler melden
        settled = true
        this.setStatus('closed')
        reject(new HaError('network', 'Adresse ungültig'))
        return
      }
      this.ws = ws
      const timer = setTimeout(() => fail(new HaError('network', 'Zeitüberschreitung')), this.timeoutMs)
      ws.onerror = () => fail(new HaError('network', 'Verbindung fehlgeschlagen'))
      ws.onclose = () => {
        if (!settled) return fail(new HaError('network', 'Verbindung getrennt'))
        this.onLost()
      }
      ws.onmessage = (ev) => {
        let m: Record<string, unknown>
        try {
          m = JSON.parse(String(ev.data))
        } catch {
          return
        }
        if (!settled) {
          if (m.type === 'auth_required') ws.send(JSON.stringify({ type: 'auth', access_token: this.token }))
          else if (m.type === 'auth_ok') {
            settled = true
            clearTimeout(timer)
            this.haVersion = typeof m.ha_version === 'string' ? m.ha_version : undefined
            this.attempt = 0
            this.setStatus('ready')
            void this.resubscribe()
            resolve()
          } else if (m.type === 'auth_invalid') fail(new HaError('auth', String(m.message ?? 'Token falsch')))
          return
        }
        this.handle(m)
      }
    })
  }

  private handle(m: Record<string, unknown>) {
    const id = m.id as number
    if (m.type === 'result') {
      const p = this.pending.get(id)
      if (!p) return
      this.pending.delete(id)
      if (m.success) p.resolve(m.result)
      else {
        const err = (m.error ?? {}) as { code?: string; message?: string }
        const unsupported = err.code === 'unknown_command' || err.code === 'not_supported'
        p.reject(new HaError(unsupported ? 'unsupported' : 'failed', err.message ?? 'Fehler', err.code))
      }
    } else if (m.type === 'event') {
      this.subs.get(id)?.cb(m.event)
    }
  }

  private onLost() {
    this.drop(new HaError('network', 'Verbindung verloren'))
    this.setStatus('closed')
    // Abos bleiben gemerkt (mit alten Ids) und werden nach dem Wiederverbinden neu gestartet
    if (this.wantOpen) this.scheduleReconnect()
  }

  private scheduleReconnect() {
    if (!this.wantOpen || this.suspended || !this.visible) return
    clearTimeout(this.reconnectTimer)
    const wait = this.backoff[Math.min(this.attempt, this.backoff.length - 1)]
    this.attempt++
    this.reconnectTimer = setTimeout(() => {
      if (this.wantOpen && !this.suspended && this.visible) this.open().catch(() => {})
    }, wait)
  }

  private async resubscribe() {
    const old = [...this.subs.values()]
    this.subs.clear()
    for (const s of old) {
      try {
        await this.startSub(s)
      } catch {
        /* Abo nicht möglich – die Synchronisierung läuft trotzdem bei Fokus */
      }
    }
  }
}
