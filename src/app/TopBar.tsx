import { weekLabel } from '../store'
import type { AppModel } from './useAppModel'

/** Kopfzeile: Logo bzw. Tab-Titel, Wochenwechsel, Wiegen & Profil */
export function TopBar({ m }: { m: AppModel }) {
  const { state, cal, ui, status, act } = m
  const { tab } = ui
  const { monday } = cal
  const profile = state.profile
  const tabTitle = tab === 'vorrat' ? 'Vorrat' : tab === 'rezepte' ? 'Rezepte' : null

  const weekNav = (
    <div className="weeknav">
      <button className="icon-btn" onClick={() => act.changeWeek(-1)} aria-label="Vorige Woche">‹</button>
      <span className="week-label">
        <b>{weekLabel(monday).split(' · ')[0]}</b>
        <small>{weekLabel(monday).split(' · ')[1]}</small>
      </span>
      <button className="icon-btn" onClick={() => act.changeWeek(1)} aria-label="Nächste Woche">›</button>
    </div>
  )

  return (
    <header className="topbar">
      <div className="brand">
        <span className="logo">🍳</span> {tabTitle ? <h1 className="top-title">{tabTitle}</h1> : <span className="brand-name">Yami</span>}
      </div>
      <div className="top-right">
        {!tabTitle && weekNav}
        <button
          className={`icon-btn profile-btn ${status.weighDue || status.pendingSuggestion ? 'dot-badge' : ''}`}
          onClick={() => (profile ? ui.setShowProgress(true) : ui.setShowProfile(true))}
          aria-label="Wiegen & Fortschritt"
          title="Wiegen & Fortschritt"
        >
          ⚖️
        </button>
        <button className="icon-btn profile-btn" onClick={() => ui.setShowProfile(true)} aria-label="Profil & Kalorienziel" title="Profil & Kalorienziel">
          👤
        </button>
      </div>
    </header>
  )
}
