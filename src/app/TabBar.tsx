import type { Tab } from './types'
import type { AppModel } from './useAppModel'
import { Icon, type IconName } from '../components/Icon'

const TABS: [Tab, IconName, string][] = [
  ['woche', 'calendar', 'Woche'],
  ['wischen', 'cards', 'Wischen'],
  ['liste', 'cart', 'Liste'],
  ['vorrat', 'basket', 'Vorrat'],
  ['rezepte', 'book', 'Rezepte'],
]

/** Tab-Leiste unten; „Wischen“ springt zum nächsten freien Tag */
export function TabBar({ m }: { m: AppModel }) {
  const { state, cal, ui, status } = m
  const { days, today } = cal
  const urgent = status.urgentNames.size
  return (
    <nav className="tabbar">
      {TABS.map(([t, icon, label]) => (
        <button
          key={t}
          className={ui.tab === t ? 'active' : ''}
          aria-current={ui.tab === t ? 'page' : undefined}
          onClick={() => {
            // alles ab heute geplant → nicht auf einem vergangenen Tag landen, sondern heute zeigen
            if (t === 'wischen')
              ui.setSwipeDay(days.find((d) => !state.plan[d] && d >= today) ?? (ui.swipeDay < today && days.includes(today) ? today : ui.swipeDay))
            ui.setTab(t)
          }}
        >
          <span className="tab-icon">
            <Icon name={icon} size={24} />
            {t === 'vorrat' && urgent > 0 && <i className="tab-badge">{urgent}</i>}
          </span>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}
