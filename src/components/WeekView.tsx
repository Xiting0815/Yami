import type { ReactNode } from 'react'
import type { Recipe, WeekPlan } from '../types'
import { RECIPE_BY_ID } from '../data/recipes'
import { shortDate, weekdayName } from '../store'
import { formatTime } from '../filter'
import { type PriceOverrides, formatEuro, recipeCost } from '../kitchen'
import { RecipeImage } from './RecipeImage'
import { Icon } from './Icon'
import type { DayBalance, Portion } from '../energy'

export const kcal = (n: number) => n.toLocaleString('de-DE')

/** höchstens ein Hinweis über dem Plan (Vorrat läuft ab > Vorschlag > Wiegetag) */
export interface Notice {
  text: string
  tone?: 'warn' | 'ok'
  onClick?: () => void
}

interface Props {
  days: string[]
  plan: WeekPlan
  today: string
  total: number
  prices: PriceOverrides
  notice?: Notice
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
  /** Tagesbilanz Mo–Fr (nur mit Profil) */
  balances: Record<string, DayBalance | undefined>
  portions: Record<string, Portion | undefined>
}

export function NoticeRow({ notice }: { notice: Notice }) {
  const inner = (
    <>
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
  const { days, plan, today, total, prices, notice, startSlot, hideDays, onSwipeDay, onOpen, onMore, onShop, breakfastSlot, ratingSlot, balances, portions } = props
  const planned = days.filter((d) => plan[d]).length

  return (
    <div className="week">
      {startSlot}

      {!hideDays && (
        <div className="week-status">
          <span className={planned === 7 ? 'full' : ''}>{planned} von 7 geplant{planned === 7 ? ' ✓' : ''}</span>
          {planned > 0 && (
            <button className="link status-link" onClick={onShop}>
              Einkauf ≈ {formatEuro(total)} <Icon name="chevron" size={14} />
            </button>
          )}
        </div>
      )}

      {notice && <NoticeRow notice={notice} />}

      {ratingSlot}

      {breakfastSlot}

      {hideDays ? (
        <p className="muted small center start-hint">Dein Wochenplan erscheint hier, sobald du das erste Abendessen gewählt hast.</p>
      ) : (
        <ul className="days">
          {days.map((day) => {
            const entry = plan[day]
            const recipe = entry ? RECIPE_BY_ID[entry.recipeId] : undefined
            const past = day < today
            const b = balances[day]
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
                  {past ? (
                    <div className="day-empty past" aria-label="nichts geplant">–</div>
                  ) : (
                    <button className="day-empty" onClick={() => onSwipeDay(day)}>
                      <span>+ Gericht wischen</span>
                      {b && <small>bis {kcal(b.dinnerBudget)} kcal</small>}
                    </button>
                  )}
                </li>
              )
            }

            const portion = portions[day]
            const cooked = entry.status === 'cooked'
            const skipped = entry.status === 'skipped'
            const facts = `${formatTime(recipe.time)} · ≈ ${formatEuro(recipeCost(recipe, entry.servings, prices))}`
            const over = b ? b.total - b.target : 0
            // Zeile 2: deine Portion (mit Profil Mo–Fr), sonst Zeit & Preis
            const l2 = skipped ? (
              <span className="day-l2 muted">nicht gekocht</span>
            ) : portion ? (
              <span className={`day-l2 ${cooked ? 'ok' : ''}`}>
                {cooked ? '✓ gekocht' : portion.label} · {kcal(portion.kcal)} kcal
              </span>
            ) : (
              <span className={`day-l2 ${cooked ? 'ok' : 'muted'}`}>{cooked ? `✓ gekocht · ${facts}` : facts}</span>
            )
            return (
              <li key={day} className={cls}>
                {label}
                <div className={`day-card ${skipped ? 'skipped' : ''}`}>
                  <button className="day-main" onClick={() => onOpen(recipe, day)}>
                    <span className="day-thumb">
                      <RecipeImage recipe={recipe} className="thumb" />
                      <i className="servings-pill">×{entry.servings}</i>
                      {cooked && <i className="cooked-mark"><Icon name="check" size={12} /></i>}
                    </span>
                    <span className="day-text">
                      <span className={`day-title ${b ? '' : 'two'}`}>{recipe.title}</span>
                      {l2}
                      {b && (
                        <span className={`day-l3 ${over > 50 ? 'over' : ''}`}>
                          Tag {kcal(b.total)} / {kcal(b.target)} kcal{over > 50 ? ` · +${kcal(over)}` : ''}
                        </span>
                      )}
                    </span>
                  </button>
                  <button className="day-more" onClick={() => onMore(day)} aria-label={`Aktionen für ${weekdayName(day)}`}>
                    <Icon name="more" />
                  </button>
                  {b && <BalanceBar b={b} />}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

/** Tagesbilanz als 4-px-Leiste am unteren Kartenrand: Frühstück + Mittag + Abendportion im Vergleich zum Ziel */
function BalanceBar({ b }: { b: DayBalance }) {
  const max = Math.max(b.target, b.total)
  const pct = (v: number) => `${(v / max) * 100}%`
  const dinner = b.dinner ?? 0
  const overPart = Math.max(0, b.total - b.target)
  return (
    <div className="balance-bar" aria-hidden>
      <div className="seg bf" style={{ width: pct(b.breakfast) }} />
      <div className="seg lunch" style={{ width: pct(b.lunch) }} />
      <div className="seg dinner" style={{ width: pct(dinner - Math.min(dinner, overPart)) }} />
      <div className="seg over" style={{ width: pct(overPart) }} />
      <div className="target-mark" style={{ left: pct(b.target) }} />
    </div>
  )
}
