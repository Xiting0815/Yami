import { weekLabel } from '../store'
import type { AppModel } from './useAppModel'
import { Icon } from '../components/Icon'
import { Logo } from '../components/Logo'

/** Kopfzeile: Logo bzw. Tab-Titel, Wochenwechsel, Einstellungen */
export function TopBar({ m }: { m: AppModel }) {
  const { cal, ui, act } = m
  const { tab } = ui
  const { monday } = cal
  const tabTitle = tab === 'vorrat' ? 'Vorrat' : tab === 'rezepte' ? 'Rezepte' : tab === 'liste' ? 'Einkauf' : null

  const weekNav = (
    <div className="weeknav">
      <button className="icon-btn" onClick={() => act.changeWeek(-1)} aria-label="Vorige Woche"><Icon name="chevronLeft" size={20} /></button>
      <span className="week-label">
        <b>{weekLabel(monday).split(' · ')[0]}</b>
        <small>{weekLabel(monday).split(' · ')[1]}</small>
      </span>
      <button className="icon-btn" onClick={() => act.changeWeek(1)} aria-label="Nächste Woche"><Icon name="chevron" size={20} /></button>
    </div>
  )

  return (
    <header className="topbar">
      <div className="brand">
        <Logo /> {tabTitle ? <h1 className="top-title">{tabTitle}</h1> : <span className="brand-name">Gusto</span>}
      </div>
      <div className="top-right">
        {!tabTitle && weekNav}
        <button className="icon-btn profile-btn" onClick={() => ui.setShowProfile(true)} aria-label="Einstellungen" title="Einstellungen">
          <Icon name="settings" />
        </button>
      </div>
    </header>
  )
}
