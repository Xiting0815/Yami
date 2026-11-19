// Prüft, ob Text und Geräte-Einstellungen eines Geräte-Schritts zusammenpassen
// (Temperatur, Betriebsart, Gerät, Minuten). Dieselben Regeln laufen in check-data.ts als Fehler mit.
//   npx vite-node scripts/check-device-text.ts
import { deviceTextFindings } from './device-text-rules'

const all = deviceTextFindings()
for (const x of all) console.log(`${x.id} #${x.step}: ${x.msg}\n    „${x.text}“`)
console.log(all.length ? `${all.length} Widersprüche in ${new Set(all.map((x) => x.id)).size} Rezepten` : 'Keine Widersprüche zwischen Text und Einstellung')
if (all.length) process.exitCode = 1
