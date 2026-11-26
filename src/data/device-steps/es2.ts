import type { DeviceStep } from '../../types'
import { bora } from '../device-helpers'

/**
 * Geräte-Schritte (Rezept-ID → Schritte), Gruppe: es2 (Spanisch, Eintöpfe, Fleisch & Geflügel – src/data/recipes-es2.ts).
 * Lange Eintöpfe: BORA Stufe 2 mit Deckel, CombiSteamer oder Dutch Oven; Plancha `plancha()` für Kurzgebratenes.
 * Stil siehe docs/geraete/regeln.md, Geräte docs/geraete/paella-plancha.md.
 */
export const DEVICE_STEPS: Record<string, DeviceStep[]> = {
  'fabada-asturiana': [
    { text: 'Die Fabes (große, buttrige weiße Bohnen aus Asturien) am Vortag in reichlich kaltem Wasser 12 Stunden einweichen. Den geräucherten Schweinebauch ebenfalls 1 Stunde wässern, damit er nicht zu salzig ist.' },
    {
      text: 'Die Bohnen abgießen und in einen breiten Topf geben, knapp mit kaltem Wasser bedecken. Die halbierte Zwiebel, Knoblauch, Lorbeer sowie Chorizo, Blutwurst (Ersatz für die asturische Morcilla) und Schweinebauch im Ganzen darauflegen – dieses „Compango“ gibt den Geschmack. Auf dem BORA langsam aufkochen und den Schaum abschöpfen.',
      settings: [bora('6', { note: 'langsam aufkochen' })],
    },
    {
      text: 'Safran und Paprikapulver in etwas Kochwasser verrühren und zugeben. Den Eintopf zugedeckt 2,5 Stunden ganz leise simmern lassen. Nicht umrühren – die Bohnen platzen sonst –, nur ab und zu den Topf schwenken. Zwei- bis dreimal einen Schuss kaltes Wasser zugeben („asustar las fabes“, die Bohnen erschrecken): so bleibt die Haut zart und ganz.',
      settings: [bora('2', { minutes: 150, note: 'Deckel drauf, ganz leise simmern' })],
    },
    { text: 'Wenn die Bohnen butterweich sind, Wurst und Fleisch herausnehmen und in Scheiben schneiden, Zwiebel und Lorbeer entfernen. Erst jetzt salzen, die Wurst gibt viel Salz ab.' },
    { text: 'Den Eintopf 15 Minuten ruhen lassen, damit er sämig wird. In tiefen Tellern servieren und das Compango obenauf legen oder getrennt reichen. Leichter: Blutwurst weglassen und den Schweinebauch durch mageren Kochschinken ersetzen – die Fabes und die Chorizo tragen den Geschmack.' },
  ],
}
