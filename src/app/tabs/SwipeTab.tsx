import { RECIPE_BY_ID } from '../../data/recipes'
import { BREAKFAST_LABEL, type BreakfastType } from '../../types'
import { eveningOn } from '../../bbq'
import { shortDate, weekdayName } from '../../store'
import { MealToggle } from '../../components/MealToggle'
import { useActiveChipInView } from '../../components/FilterBar'
import { PrepDayChip } from '../../components/PrepDayChip'
import { SwipeDeck } from '../../components/SwipeDeck'
import { dayRangeText } from '../dates'
import type { AppModel } from '../useAppModel'

/** Tab „Wischen“: Frühstück (1–2 fürs Prep) oder Abendessen für den gewählten Tag */
export function SwipeTab({ m }: { m: AppModel }) {
  const { state, cal, ui, plan, bf, act } = m
  const { days } = cal
  const { meal, swipeDay, pantryMode } = ui
  const { picks } = bf
  // gewählte Frühstücksart bleibt beim Tabwechsel gesetzt → beim Öffnen sichtbar scrollen
  const bRow = useActiveChipInView<HTMLDivElement>(meal)
  return (
    <div className="swipe-screen">
      <MealToggle meal={meal} onChange={ui.setMeal} />
      {meal === 'breakfast' ? (
        <>
          <div className="swipe-head">
            <h1>
              ☀️ Frühstück <span className="accent">{dayRangeText(bf.covered)}</span>
            </h1>
            {picks.length === 1 ? (
              <button className="chip" onClick={() => ui.setTab('woche')} aria-label={`Nur ${RECIPE_BY_ID[picks[0]]?.title ?? 'dieses Frühstück'} nehmen – fertig`}>
                1/2 · Fertig →
              </button>
            ) : (
              <span className="muted small">{picks.length}/2 gewählt</span>
            )}
          </div>
          <div className="chips-row">
            <PrepDayChip prep={bf.prep} choices={bf.prepChoices} onChange={act.changePrepDay} today={cal.today} />
          </div>
          <p className="muted small swipe-note">
            Wähle 1–2 Frühstücke zum Vorbereiten. Das kürzer haltbare kommt an die ersten Tage, das länger haltbare ans Ende.
          </p>
          <div className="chips-row" ref={bRow}>
            <button className={`chip ${ui.bPantryOnly ? 'on' : ''}`} onClick={() => ui.setBPantryOnly((v) => !v)}>
              🧺 Nur mit Vorrat
            </button>
            {(Object.keys(BREAKFAST_LABEL) as BreakfastType[]).map((t) => (
              <button
                key={t}
                className={`chip ${ui.bTypes.includes(t) ? 'on' : ''}`}
                onClick={() => ui.setBTypes((x) => (x.includes(t) ? x.filter((y) => y !== t) : [...x, t]))}
              >
                {BREAKFAST_LABEL[t]}
              </button>
            ))}
          </div>
          <SwipeDeck
            deck={bf.bDeck}
            insights={bf.bInsights}
            onTake={act.pickBreakfast}
            onReject={act.reject}
            onInfo={(r) => ui.setSheet({ recipe: r, mode: 'take' })}
          />
          <p className="hint toast-slot">← nächstes · wählen →</p>
        </>
      ) : (
        <>
          <div className="day-dots">
            {days.map((d) => {
              // Tapas- oder Grillabend ist das Abendessen → belegt
              const taken = !!state.plan[d] || !!eveningOn(state.bakePlan, d)
              return (
                <button key={d} className={`dot ${d === swipeDay ? 'current' : ''} ${taken ? 'filled' : ''}`} onClick={() => ui.setSwipeDay(d)}>
                  <b>{weekdayName(d, true)}</b>
                  <span>{taken ? '✓' : shortDate(d)}</span>
                </button>
              )
            })}
          </div>
          <div className="swipe-head">
            <h1>
              Was gibt’s <span className="accent">{weekdayName(swipeDay)}</span>?
            </h1>
            <button className={`chip ${plan.activeFilters ? 'on' : ''}`} onClick={() => ui.setShowFilters(true)} aria-haspopup="dialog">
              ⚙︎ Filter{plan.activeFilters ? ` (${plan.activeFilters})` : ''}
            </button>
          </div>
          {pantryMode && (
            <div className="chips-row">
              <button className="chip pantry-mode" onClick={() => ui.setPantryMode(false)} aria-label="Vorrat zuerst beenden">
                🧺 Vorrat zuerst ✕
              </button>
            </div>
          )}
          {!state.plan[swipeDay] && eveningOn(state.bakePlan, swipeDay) && (
            <p className="muted small center swipe-note">
              Geplant: {eveningOn(state.bakePlan, swipeDay) === 'tapas' ? 'Tapas-Abend' : 'Grillabend'}.
            </p>
          )}
          {state.plan[swipeDay] && (
            <p className="muted small center swipe-note">
              Aktuell geplant: {RECIPE_BY_ID[state.plan[swipeDay]!.recipeId]?.title}. Nach rechts wischen ersetzt es.
            </p>
          )}
          <SwipeDeck
            deck={plan.deck}
            insights={plan.insights}
            pantryMode={pantryMode}
            onTake={(r) => act.take(r, swipeDay)}
            onReject={act.reject}
            onInfo={(r) => ui.setSheet({ recipe: r, day: swipeDay, mode: 'take' })}
          />
          <p className="hint toast-slot">
            {pantryMode ? '← wegwischen · nehmen → · sortiert nach dem, was du im Vorrat hast' : '← wegwischen · nehmen → · sortiert nach Vorrat, Preis & Abwechslung'}
          </p>
        </>
      )}
    </div>
  )
}
