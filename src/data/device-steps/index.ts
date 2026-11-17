import type { DeviceStep } from '../../types'
import { DEVICE_STEPS as de } from './de'
import { DEVICE_STEPS as de2 } from './de2'
import { DEVICE_STEPS as it } from './it'
import { DEVICE_STEPS as as } from './as'
import { DEVICE_STEPS as gr } from './gr'
import { DEVICE_STEPS as bf } from './bf'

/** Alle Geräte-Schritte: Rezept-ID → Schritte (de, it, as, gr = Abendessen; bf = Frühstück) */
export const DEVICE_STEPS: Record<string, DeviceStep[]> = { ...de, ...de2, ...it, ...as, ...gr, ...bf }
