import { useState } from 'react'
import { ShoppingList } from '../../components/ShoppingList'
import { TripReview } from '../../components/TripReview'
import { type Trip, mainTrip } from '../../kitchen'
import { isBought } from '../../shopping'
import { isReleased, newSinceRelease, shopDaySuggestion, tripCoverText, tripDateText, weekdayAdverb } from '../../tripState'
import type { AppModel } from '../useAppModel'

const DAY_NAMES = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
const openCount = (t: Trip) => t.buy.filter((b) => !isBought(b)).length

/**
 * Tab „Liste“: Einkäufe statt Wochen – zuerst der nächste Haupteinkauf, daneben Zusatzeinkauf (Mi) und der
 * übernächste; „Heute noch“, wenn vor dem nächsten Einkauf etwas fehlt. Unabhängig von der Woche oben.
 * Entwurf → „Liste prüfen“ (Habe ich / Brauche ich) → „Freigeben“ → erst dann geht die Liste an Google Tasks.
 */
export function ListTab({ m }: { m: AppModel }) {
  const { state, cal, ui, plan, act, ha } = m
  const { today } = cal
  const trips = plan.trips
  const [sel, setSel] = useState<string | null>(null)
  const [reviewing, setReviewing] = useState(false)
  const now = trips.find((t) => t.kind === 'now')
  const main = mainTrip(trips)
  // zuerst der nächste Einkauf – ist für ihn noch nichts geplant, aber heute fehlt etwas: „Heute noch“
  const first = main && !main.days.length && now ? now : main
  const trip = trips.find((t) => t.date === sel) ?? first
  if (!trip) return null
  const st = state.trips[trip.date]
  const released = isReleased(state.trips, trip, today)
  const list = { key: trip.key, legacyKey: trip.legacyKey }
  const custom = [...(state.custom[trip.key] ?? []), ...(trip.legacyKey ? state.custom[trip.legacyKey] ?? [] : [])]
  const checked = [...(state.checked[trip.key] ?? []), ...(trip.legacyKey ? state.checked[trip.legacyKey] ?? [] : [])]
  const learnedDay = shopDaySuggestion(state, today)
  const haOn = !!state.ha?.enabled
  const left = openCount(trip)
  const choose = (t: Trip) => {
    setSel(t.date)
    setReviewing(false)
  }

  const header = (
    <div className="trip-head">
      {trips.length > 1 && (
        <div className="trip-tabs" role="tablist" aria-label="Einkäufe">
          {trips.map((t) => (
            <button key={t.date} role="tab" aria-selected={t === trip} className={`${t === trip ? 'on' : ''} ${t.kind}`} onClick={() => choose(t)}>
              <b>{tripDateText(t)}</b>
              <small>{t.kind === 'now' ? 'sofort' : t.kind === 'extra' ? 'Zusatz' : 'Einkauf'} · {openCount(t)}</small>
            </button>
          ))}
        </div>
      )}
      {learnedDay != null && (
        <div className="trip-suggest">
          <p>🛒 Einkauf meist <b>{weekdayAdverb(learnedDay)}</b> – übernehmen?</p>
          <div className="row-btns">
            <button className="btn ghost grow" onClick={() => act.dismissShopDay(learnedDay)}>Nein</button>
            <button className="btn primary grow" onClick={() => act.setShopDay(learnedDay)}>Übernehmen</button>
          </div>
        </div>
      )}
      {now && now !== trip && openCount(now) > 0 && (
        <button className="trip-now" onClick={() => choose(now)}>
          ⚡ Heute noch besorgen: {openCount(now)} {openCount(now) === 1 ? 'Artikel' : 'Artikel'} →
        </button>
      )}
      <div className="trip-title">
        <h2>{trip.kind === 'now' ? 'Heute noch besorgen' : `${trip.kind === 'extra' ? 'Zusatzeinkauf' : 'Einkauf'} ${tripDateText(trip)}`}</h2>
        <p className="muted small">{tripCoverText(trip)}</p>
        <div className="trip-status">
          {released ? <span className="pill soft">✓ Freigegeben{haOn ? ' · in Google Tasks' : ''}</span> : <span className="pill ghost">Entwurf</span>}
          {released && st?.released && (
            <button className="link small" onClick={() => act.unreleaseTrip(trip)}>Freigabe zurücknehmen</button>
          )}
        </div>
        {!released && !reviewing && left > 0 && (
          <>
            <div className="row-btns">
              <button className="btn ghost grow" onClick={() => setReviewing(true)}>Liste prüfen</button>
              <button className="btn primary grow" onClick={() => act.releaseTrip(trip)}>Freigeben</button>
            </div>
            <p className="muted small">Prüfe kurz, was schon da ist{haOn ? ' – erst nach „Freigeben“ landet die Liste in Google Tasks' : ''}.</p>
          </>
        )}
      </div>
    </div>
  )

  if (reviewing && !released)
    return (
      <div className="shop">
        {header}
        <TripReview
          trip={trip}
          states={state.trips}
          stockAsk={state.stockAsk}
          onHave={(it, amount) => act.answerHave(trip, it, amount)}
          onNeed={(it) => act.answerNeed(trip, it)}
          onStock={act.answerStock}
          onRelease={() => {
            act.releaseTrip(trip)
            setReviewing(false)
          }}
          onClose={() => setReviewing(false)}
        />
      </div>
    )

  return (
    <>
      <ShoppingList
        header={header}
        result={trip}
        planned={trip.days.length}
        checked={checked}
        custom={custom}
        onToggleBuy={(it) => act.toggleBuy(it, list)}
        haShared={ha.live === 'ok' || ha.live === 'connecting'}
        haError={ha.live === 'error' ? state.ha?.error ?? 'Abgleich mit Home Assistant fehlgeschlagen' : undefined}
        haOnWeek={released}
        newKeys={newSinceRelease(trip, st)}
        emptyText={trip.kind === 'main' ? 'Für diesen Einkauf ist noch nichts geplant.' : 'Nichts zu kaufen.'}
        onToggleKey={(k) => act.toggleChecked(k, list)}
        onResetChecks={() => act.resetChecks(list)}
        onAddCustom={(c) => act.addCustomItem(c, list)}
        onRemoveCustom={(id) => act.removeCustomItem(id, list)}
        onEditPrice={act.editPrice}
        onGoPlan={() => ui.setTab('woche')}
      />
      <p className="muted small trip-day">
        Haupteinkauf:{' '}
        <select value={state.shopDay ?? 6} onChange={(e) => act.setShopDay(Number(e.target.value))} aria-label="Haupteinkaufstag">
          {[1, 2, 3, 4, 5, 6, 0].map((d) => (
            <option key={d} value={d}>{DAY_NAMES[d]}</option>
          ))}
        </select>
        {' '}· Zusatzeinkauf nur, wenn etwas sonst nicht frisch bleibt.
      </p>
    </>
  )
}
