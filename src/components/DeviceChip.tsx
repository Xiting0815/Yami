import type { DeviceSetting } from '../types'
import { settingText } from '../deviceText'
import { Icon } from './Icon'

/** Geräte-Einstellung als kompakter Chip mit Geräte-Symbol */
export function DeviceChip({ s }: { s: DeviceSetting }) {
  return (
    <span className={`dev-chip dev-${s.device}${s.alt ? ' dev-alt' : ''}`}>
      <Icon name={s.device} size={16} />
      <span>
        {settingText(s)}
        {s.note && <span className="dev-note"> ({s.note})</span>}
      </span>
    </span>
  )
}

/** Alle Einstellungen eines Schritts (nichts, wenn keine vorhanden) */
export function DeviceChips({ settings }: { settings?: DeviceSetting[] }) {
  if (!settings || settings.length === 0) return null
  return (
    <span className="dev-chips">
      {settings.map((s, i) => (
        <DeviceChip key={i} s={s} />
      ))}
    </span>
  )
}
