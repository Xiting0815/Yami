import { Fragment, type ReactNode } from 'react'
import type { BakeEntry, BakePlan, Recipe, WeekPlan } from '../types'
import { isBakery, isBbq, isSalat, isTapa } from '../types'
import { bakeLine } from '../bakePlan'
import { eveningOn } from '../bbq'
import { shortTitle } from '../tapas'
import { RECIPE_BY_ID } from '../data/recipes'
import { shortDate, weekdayName } from '../store'
import { formatTime } from '../filter'
import { type PriceOverrides, formatEuro, recipeCost } from '../kitchen'
import { RecipeImage } from './RecipeImage'
import { Icon, type IconName } from './Icon'

/** höchstens ein Hinweis über dem Plan (Vorrat läuft ab > Sicherung) */
export interface Notice {
  text: string
  tone?: 'warn' | 'ok'
  /** kleines Symbol vor dem Text */
  icon?: IconName
  onClick?: () => void
}

interface Props {
  days: string[]
  plan: WeekPlan
  today: string
  total: number
  prices: PriceOverrides
  notice?: Notice
  /** Wochenrückblick-Karte (sonntags) */
  reviewSlot?: ReactNode
  /** Start-Checkliste (ersetzt Hinweis und leere Frühstückszeile) */
  startSlot?: ReactNode
  /** Tageszeilen ausblenden (Checkliste läuft und noch kein Abendessen geplant) */
  hideDays?: boolean
  onSwipeDay: (day: string) => void
  onOpen: (r: Recipe, day: string) => void
  /** „⋯“: Aktionen für den Tag */
  onMore: (day: string) => void
  onShop: () => void
  /** Frühstückszeile (Meal-Prep) oberhalb der Tage */
  breakfastSlot?: ReactNode
  /** Bewertungsfrage nach dem Essen */
  ratingSlot?: ReactNode
  /** Familie teilen: wer (andere Person) das Gericht des Tages ausgesucht hat */
  planBy?: (day: string) => string | undefined
  /** Hinweise zu Änderungen der anderen („Lisa hat Montag geändert …“) */
  syncSlot?: ReactNode
  /** eingeplantes Backen: Zeile „🍰 Backen: …“ unter dem Abendessen */
  bakes?: BakePlan
  /** Backen antippen (Aktionen: Ansehen, Verschieben, Entfernen) */
  onBake?: (day: string, recipeId: string) => void
  /** Tapas-Abend antippen (Kochmodus, Verschieben, Entfernen) */
  onTapas?: (day: string) => void
  /** Nachfrage „Gebacken?“ und sanfter Backvorschlag */
  bakeSlot?: ReactNode
  /** Warnung unter einem Tag („⚠️ Es fehlt: Sahne“, Hinweis nach automatischem Verschieben) */
  dayAlert?: (day: string) => ReactNode
}

export function NoticeRow({ notice }: { notice: Notice }) {
  const inner = (
    <>
      <span className="notice-icon"><Icon name={notice.icon ?? 'info'} size={18} /></span>
      <span className="notice-text">{notice.text}</span>
      {notice.onClick && <Icon name="chevron" size={18} />}
    </>
  )
  return notice.onClick ? (
    <button className={`notice ${notice.tone ?? ''}`} onClick={notice.onClick}>{inner}</button>
  ) : (
    <div className={`notice ${notice.tone ?? ''}`} role="status">{inner}</div>
  )
}

export function WeekView(props: Props) {
  const { days, plan, today, total, prices, notice, reviewSlot, startSlot, hideDays, onSwipeDay, onOpen, onMore, onShop, breakfastSlot, ratingSlot, planBy, syncSlot, bakes = {}, onBake, onTapas, bakeSlot, dayAlert } = props
  // ein Grillabend oder Tapas-Abend (im Backplan) zählt als Abendessen des Tages
  const planned = days.filter((d) => plan[d] || eveningOn(bakes, d)).length
  // nur der nächste freie Tag bekommt die Akzentfarbe – die übrigen leeren Tage bleiben ruhig
  const nextOpen = days.find((d) => d >= today && !plan[d] && !eveningOn(bakes, d))

  return (
    <div className="week">
      {reviewSlot}

      {startSlot}

      {!hideDays && (
        <div className="week-status">
          <span className={planned === 7 ? 'full' : ''}>
            <b>{planned}</b> von 7 geplant{planned === 7 ? ' ✓' : ''}
          </span>
          {(planned > 0 || total > 0) && (
            <button className="link status-link" onClick={onShop}>
              Einkauf ≈ {formatEuro(total)} <Icon name="chevron" size={14} />
            </button>
          )}
        </div>
      )}

      {syncSlot}

      {notice && <NoticeRow notice={notice} />}

      {ratingSlot}

      {bakeSlot}

      {breakfastSlot}

      {hideDays ? (
        <p className="muted small center start-hint">Dein Wochenplan erscheint hier, sobald du das erste Abendessen gewählt hast.</p>
      ) : (
        <ul className="days">
          {days.map((day) => (
            <Fragment key={day}>
              {renderDay(day)}
              {dayAlert?.(day)}
              <BakeRow day={day} list={bakes[day]} today={today} onBake={onBake} onTapas={onTapas} />
            </Fragment>
          ))}
        </ul>
      )}
    </div>
  )

  function renderDay(day: string) {
            const entry = plan[day]
            const recipe = entry ? RECIPE_BY_ID[entry.recipeId] : undefined
            const past = day < today
            const label = (
              <div className="day-label">
                <b>{weekdayName(day, true)}</b>
                <span>{shortDate(day)}</span>
              </div>
            )
            const cls = `day ${day === today ? 'today' : ''} ${past ? 'past' : ''}`

            if (!recipe || !entry) {
              return (
                <li key={day} className={`${cls} ${past ? 'gone' : 'open'}`}>
                  {label}
                  {eveningOn(bakes, day) === 'tapas' ? (
                    <button className="day-empty bbq-day tapas-day" onClick={() => onTapas?.(day)}>
                      <span className="day-empty-text">🫒 Tapas-Abend</span>
                      <small>statt Abendessen</small>
                    </button>
                  ) : eveningOn(bakes, day) === 'bbq' ? (
                    <button className="day-empty bbq-day" onClick={() => (past ? undefined : onSwipeDay(day))} disabled={past}>
                      <span className="day-empty-text">🔥 Grillabend</span>
                      <small>statt Abendessen</small>
                    </button>
                  ) : past ? (
                    <div className="day-empty past" aria-label="nichts geplant">–</div>
                  ) : (
                    <button className={`day-empty ${day === nextOpen ? 'next' : ''}`} onClick={() => onSwipeDay(day)}>
                      <span className="day-empty-text"><Icon name="plus" size={18} /> Gericht wischen</span>
                    </button>
                  )}
                </li>
              )
            }

            const by = planBy?.(day)
            const cooked = entry.status === 'cooked'
            const skipped = entry.status === 'skipped'
            const facts = `${formatTime(recipe.time)} · ≈ ${formatEuro(recipeCost(recipe, entry.servings, prices))}`
            // Zeile 2: Zeit & Preis
            const l2 = skipped ? (
              <span className="day-l2 muted">nicht gekocht</span>
            ) : (
              <span className={`day-l2 ${cooked ? 'ok' : 'muted'}`}>{cooked ? `✓ gekocht · ${facts}` : facts}</span>
            )
            return (
              <li key={day} className={cls}>
                {label}
                <div className={`day-card ${skipped ? 'skipped' : ''} ${cooked ? 'cooked' : ''}`}>
                  <button className="day-main" onClick={() => onOpen(recipe, day)}>
                    <span className="day-thumb">
                      <RecipeImage recipe={recipe} className="thumb" />
                      <i className="servings-pill">×{entry.servings}</i>
                      {cooked && <i className="cooked-mark"><Icon name="check" size={12} /></i>}
                    </span>
                    <span className="day-text">
                      <span className="day-title two">{recipe.title}</span>
                      {by && <span className="day-by">von {by}</span>}
                      {l2}
                    </span>
                  </button>
                  <button className="day-more" onClick={() => onMore(day)} aria-label={`Aktionen für ${weekdayName(day)}`}>
                    <Icon name="more" />
                  </button>
                </div>
              </li>
            )
  }
}

/**
 * „🍰 Backen: Bienenstich · Dinkelbrötchen“, „🔥 BBQ: Pulled Pork vom Traeger · Pit Beans“, „🫒 Tapas-Abend: Gambas · Tortilla“
 * bzw. „🥗 Dazu: Nudelsalat“ unter dem Abendessen eines Tages (Antippen: Aktionen) – je Art eine eigene Zeile.
 */
function BakeRow({ day, list, today, onBake, onTapas }: { day: string; list?: BakeEntry[]; today: string; onBake?: (day: string, recipeId: string) => void; onTapas?: (day: string) => void }) {
  const all = bakeLine(list ?? [])
  const rows = [
    { key: 'tapas', lead: '🫒', word: 'Tapas:', items: all.filter((x) => isTapa(x.recipe)) },
    { key: 'bbq', lead: '🔥', word: 'BBQ:', items: all.filter((x) => isBbq(x.recipe)) },
    { key: 'salat', lead: '🥗', word: 'Dazu:', items: all.filter((x) => isSalat(x.recipe)) },
    { key: 'bake', lead: '🍰', word: 'Backen:', items: all.filter((x) => isBakery(x.recipe) || x.recipe.kind === 'grundrezept') },
  ].filter((r) => r.items.length)
  if (!rows.length) return null
  return (
    <>
      {rows.map((row) => (
        <li key={row.key} className={`day-bakes day-${row.key} ${day < today ? 'past' : ''}`}>
          <span className="bake-lead" aria-hidden>{row.lead}</span>
          <span className="bake-items">
            {row.key === 'tapas' ? (
              <button className="bake-word link-word" onClick={() => onTapas?.(day)}>{row.word}</button>
            ) : (
              <span className="bake-word">{row.word}</span>
            )}
            {row.items.map(({ entry, recipe }, i) => (
              <Fragment key={recipe.id}>
                {i > 0 && <span className="bake-sep" aria-hidden> · </span>}
                <button className={`bake-item ${entry.status ?? ''} ${!entry.status && day < today ? 'ask' : ''}`} onClick={() => (row.key === 'tapas' ? onTapas?.(day) : onBake?.(day, recipe.id))}>
                  {entry.status === 'baked' ? '✓ ' : ''}{row.key === 'tapas' ? shortTitle(recipe.title) : recipe.title}{entry.amount > 1 ? ` ×${entry.amount}` : ''}
                </button>
              </Fragment>
            ))}
          </span>
        </li>
      ))}
    </>
  )
}
