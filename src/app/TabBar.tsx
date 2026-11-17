import type { Tab } from './types'
import type { AppModel } from './useAppModel'

const TABS: [Tab, string, string][] = [
  ['woche', '📅', 'Woche'],
  ['wischen', '👆', 'Wischen'],
  ['liste', '🛒', 'Liste'],
  ['vorrat', '🧺', 'Vorrat'],
  ['rezepte', '📖', 'Rezepte'],
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
          onClick={() => {
            if (t === 'wischen') ui.setSwipeDay(days.find((d) => !state.plan[d] && d >= today) ?? ui.swipeDay)
            ui.setTab(t)
          }}
        >
          <span className="tab-icon">
            {icon}
            {t === 'vorrat' && urgent > 0 && <i className="tab-badge">{urgent}</i>}
          </span>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}
