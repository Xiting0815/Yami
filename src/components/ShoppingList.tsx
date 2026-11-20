import { type ReactNode, useState } from 'react'
import type { ShopSection } from '../types'
import { SHOP_ICON, SHOP_LABEL } from '../types'
import { compareShop, shopOrderOf } from '../shopSection'
import { forDaysText, formatAmount, isBought, missingPacks, packText } from '../shopping'
import type { CustomItem } from '../store'
import { type BuyItem, type TripItem, formatEuro } from '../kitchen'

interface Props {
  result: { buy: TripItem[]; covered: BuyItem[]; staples: { key: string; name: string; amount: string }[]; total: number }
  planned: number
  checked: string[]
  custom: CustomItem[]
  onToggleBuy: (item: BuyItem) => void
  onToggleKey: (key: string) => void
  onResetChecks: () => void
  onAddCustom: (item: CustomItem) => void
  onRemoveCustom: (id: string) => void
  onEditPrice: (name: string, pack: number, price: number) => void
  onGoPlan: () => void
  /** Liste ist mit Home Assistant verbunden */
  haShared?: boolean
  /** Meldung, wenn der Abgleich nicht klappt (blockiert nichts) */
  haError?: string
  /** angezeigte Liste wird mit HA abgeglichen (freigegeben) */
  haOnWeek?: boolean
  /** Kopf über der Liste (Einkauf, Status, Prüfen/Freigeben) */
  header?: ReactNode
  /** nach der Freigabe dazugekommen */
  newKeys?: Set<string>
  /** Text, wenn nichts geplant ist */
  emptyText?: string
  /** Abschnitts-Reihenfolge des Haushalts (`AppState.shopOrder`); fehlt = Ladenreihenfolge */
  shopOrder?: string[]
}

export { isBought, missingPacks, packText }

/** Warum eine Grundzutat auf der Liste steht */
const NOTE_TEXT = { knapp: 'wird knapp', leer: 'bald leer', alle: 'ist alle' } as const

export function ShoppingList(props: Props) {
  const { result, planned, checked, custom, onToggleBuy, onToggleKey, onResetChecks, onAddCustom, onRemoveCustom, onEditPrice, onGoPlan, haShared, haError, haOnWeek, header, newKeys, emptyText, shopOrder } = props
  const order = shopOrderOf(shopOrder)
  const [newName, setNewName] = useState('')
  const [newCat, setNewCat] = useState<ShopSection>('gemuese')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showCovered, setShowCovered] = useState(false)
  const checkedSet = new Set(checked)

  // leer nur, wenn auch nichts für Sa/So der laufenden Woche fehlt (ab Samstag zeigt die Liste schon die nächste Woche)
  if (planned === 0 && custom.length === 0 && !result.buy.length) {
    return (
      <div className="empty-state">
        {header}
        <div className="big-emoji">🛒</div>
        <p>{emptyText ?? 'Noch keine Gerichte für diese Woche geplant.'}</p>
        <button className="btn primary" onClick={onGoPlan}>Zur Wochenplanung</button>
      </div>
    )
  }

  const keys = [...result.buy.map((b) => b.key), ...custom.map((c) => `custom:${c.id}`)]
  const done =
    result.buy.filter(isBought).length + custom.filter((c) => checkedSet.has(`custom:${c.id}`)).length

  return (
    <div className="shop">
      {header}
      <div className="shop-total">
        <div>
          <div className="muted small">Einkauf geschätzt</div>
          <div className="total">{formatEuro(result.total)}</div>
        </div>
        <div className="right muted small">
          {result.buy.length} Artikel{result.covered.length ? ` · ${result.covered.length} schon im Vorrat` : ''}
        </div>
      </div>
      <div className="week-progress">
        <div className="bar"><div style={{ width: `${keys.length ? (done / keys.length) * 100 : 0}%` }} /></div>
        <span>{done} von {keys.length} im Wagen</span>
        {done > 0 && <button className="link" onClick={onResetChecks}>Haken zurücksetzen</button>}
      </div>
      <p className="muted small">Abgehakte Artikel wandern automatisch in deinen Vorrat.</p>
      {haShared && haOnWeek && <p className="muted small">🏠 Mit Home Assistant geteilt</p>}
      {haError && haOnWeek && <p className="muted small" role="status">🏠 Home Assistant: {haError} – die Liste hier funktioniert trotzdem.</p>}

      {order.filter((c) => c !== 'vorrat').map((cat) => {
        const items = result.buy.filter((b) => b.cat === cat)
        const cust = custom.filter((c) => c.cat === cat)
        if (!items.length && !cust.length) return null
        const sorted = [...items].sort(
          (a, b) => Number(isBought(a)) - Number(isBought(b)) || compareShop(order)(a, b),
        )
        return (
          <section key={cat} className={`shop-section cat-${cat}`}>
            <h3>
              <span>{SHOP_ICON[cat]}</span> {SHOP_LABEL[cat]}
            </h3>
            <ul>
              {sorted.map((it) => {
                const on = isBought(it)
                const partly = !on && it.bought > 0
                return (
                  <li key={it.key} className={on ? 'done' : ''}>
                    <label>
                      <input type="checkbox" checked={on} onChange={() => onToggleBuy(it)} />
                      <span className="check" aria-hidden />
                      <span className="item-name">
                        {it.name}
                        {it.note && <small className="item-note">{NOTE_TEXT[it.note]}</small>}
                        {it.reason && <small className="item-note">🕒 {it.reason}</small>}
                        {it.forDays && <small className="item-note">{forDaysText(it)}</small>}
                        {newKeys?.has(it.key) && <small className="item-note new">neu seit Freigabe</small>}
                      </span>
                      <span className="item-amt">
                        {partly ? `noch ${missingPacks(it)} ${it.product.packName ?? 'Stk'}` : packText(it)}
                        <small>{partly ? 'Portionen erhöht' : formatEuro(it.cost)}</small>
                      </span>
                    </label>
                    <button className="icon-btn tiny" onClick={() => setExpanded(expanded === it.key ? null : it.key)} aria-label="Details">
                      {it.recipes.length > 1 ? `${it.recipes.length}×` : 'ⓘ'}
                    </button>
                    {expanded === it.key && <ItemDetails it={it} onEditPrice={onEditPrice} />}
                  </li>
                )
              })}
              {cust.map((c) => {
                const key = `custom:${c.id}`
                const on = checkedSet.has(key)
                return (
                  <li key={key} className={on ? 'done' : ''}>
                    <label>
                      <input type="checkbox" checked={on} onChange={() => onToggleKey(key)} />
                      <span className="check" aria-hidden />
                      <span className="item-name">{c.name}</span>
                    </label>
                    <button className="icon-btn tiny" onClick={() => onRemoveCustom(c.id)} aria-label="Entfernen">✕</button>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}

      {result.staples.length > 0 && (
        <section className="shop-section cat-vorrat">
          <h3>
            <span>{SHOP_ICON.vorrat}</span> {SHOP_LABEL.vorrat}
            <small> – Gewürze & Grundzutaten, kurz prüfen</small>
          </h3>
          <ul>
            {[...result.staples]
              .sort((a, b) => Number(checkedSet.has(a.key)) - Number(checkedSet.has(b.key)) || a.name.localeCompare(b.name, 'de'))
              .map((it) => {
                const on = checkedSet.has(it.key)
                return (
                  <li key={it.key} className={on ? 'done' : ''}>
                    <label>
                      <input type="checkbox" checked={on} onChange={() => onToggleKey(it.key)} />
                      <span className="check" aria-hidden />
                      <span className="item-name">{it.name}</span>
                      <span className="item-amt">{it.amount}</span>
                    </label>
                  </li>
                )
              })}
          </ul>
        </section>
      )}

      {result.covered.length > 0 && (
        <section className="shop-section covered">
          <h3>
            <button className="link plain" onClick={() => setShowCovered((v) => !v)}>
              ✅ Schon im Vorrat ({result.covered.length}) {showCovered ? '▴' : '▾'}
            </button>
          </h3>
          {showCovered && (
            <ul>
              {result.covered.map((it) => (
                <li key={it.key}>
                  <span className="item-name">
                    {it.name}
                    {it.substitutes.length > 0 && <small className="exp">aus Vorrat: {it.substitutes.map((x) => x.name).join(', ')} statt {it.name}</small>}
                  </span>
                  <span className="item-amt">{formatAmount(it.required, it.unit)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <form
        className="add-custom"
        onSubmit={(e) => {
          e.preventDefault()
          const name = newName.trim()
          if (!name) return
          onAddCustom({ id: Math.random().toString(36).slice(2, 9), name, cat: newCat })
          setNewName('')
        }}
      >
        <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Eigener Artikel, z. B. Kaffee" />
        <select value={newCat} onChange={(e) => setNewCat(e.target.value as ShopSection)} aria-label="Kategorie">
          {order.map((c) => (
            <option key={c} value={c}>
              {SHOP_ICON[c]} {SHOP_LABEL[c]}
            </option>
          ))}
        </select>
        <button className="btn primary" type="submit">+</button>
      </form>
    </div>
  )
}

function ItemDetails({ it, onEditPrice }: { it: BuyItem; onEditPrice: (name: string, pack: number, price: number) => void }) {
  const [editing, setEditing] = useState(false)
  const [pack, setPack] = useState(String(it.product.pack))
  const [price, setPrice] = useState(it.product.price.toFixed(2).replace('.', ','))
  return (
    <div className="item-recipes">
      {it.note === 'alle' ? <div>Du hast „alle“ markiert – abgehakt ist es wieder „da“.</div> : it.required <= 0 ? <div>Nach deinem Verbrauch der letzten Wochen bald leer.</div> : (
      <div>
        Brauchst {formatAmount(it.required, it.unit)}
        {it.fromPantry > 0 && (
          <>
            {' '}· {formatAmount(it.fromPantry, it.unit)} aus dem Vorrat
            {it.substitutes.length > 0 && <> ({it.substitutes.map((x) => x.name).join(', ')} statt {it.name})</>}
          </>
        )}
        {it.leftover > 0.01 && <> · <b className="accent">{formatAmount(it.leftover, it.unit)} bleiben übrig</b></>}
      </div>
      )}
      {it.recipes.length > 0 && <div>Für: {it.recipes.join(' · ')}</div>}
      {!editing ? (
        <button className="link small" onClick={() => setEditing(true)}>
          Packung {formatAmount(it.product.pack, it.unit)} für {formatEuro(it.product.price)} ✎ anpassen
        </button>
      ) : (
        <form
          className="price-edit"
          onSubmit={(e) => {
            e.preventDefault()
            const pk = parseFloat(pack.replace(',', '.'))
            const pr = parseFloat(price.replace(',', '.'))
            if (pk > 0 && pr >= 0) onEditPrice(it.name, pk, pr)
            setEditing(false)
          }}
        >
          <label>
            Packung <input inputMode="decimal" value={pack} onChange={(e) => setPack(e.target.value)} /> {it.unit}
          </label>
          <label>
            Preis <input inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} /> €
          </label>
          <button className="btn primary small-btn" type="submit">OK</button>
        </form>
      )}
    </div>
  )
}
