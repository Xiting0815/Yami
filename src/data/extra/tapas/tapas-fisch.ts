import { tapa } from '../../define'
import { bora } from '../../device-helpers'
import type { ExtraGroup } from '../types'

/**
 * Tapas · Fisch & Meeresfrüchte (Gambas al ajillo, Gambas a la plancha, Pulpo a la gallega, Boquerones en vinagre,
 * Calamares a la romana, Mejillones a la marinera, Pescaíto frito …).
 * Anlegen mit `tapa(id, 'Spanischer Titel (deutsche Erklärung)', { group: 'fisch', time, serve, ahead? }, zutaten, schritte)`.
 * Mengen: EIN Teller für 2 Personen als eine von ca. 5 Tapas (TAPAS_STD), ca. 120–200 kcal je Person (Yami skaliert
 * je nach Anzahl der Tapas des Abends). Regeln: docs/spanien-regeln.md · Geräte: docs/geraete/paella-plancha.md
 * (Plancha: `plancha('bora' | 'gasgrill', 'Vorheizen' | 'Braten', { level, temp?, minutes })`).
 * Neue Fotos: Zeilen in scripts/fotos-neu-tapas-fisch.md.
 */
export const tapasFisch: ExtraGroup = {
  recipes: [
    tapa('gambas-al-ajillo', 'Gambas al ajillo (Knoblauchgarnelen in Olivenöl)',
      { group: 'fisch', time: 15, serve: 'heiss', ahead: 'Garnelen am Vortag im Kühlschrank auftauen lassen' },
      '180 g Garnelen roh TK | 4 Zehe Knoblauch | 1 Stk Chili getrocknet | 2 EL Olivenöl | 0.25 Bund Petersilie | Salz',
      [
        'Die Garnelen am Vortag im Kühlschrank auftauen lassen, trocken tupfen, Darm entfernen und leicht salzen. Den Knoblauch in dünne Scheiben schneiden, die getrocknete Chili (in Spanien „Guindilla“) in 2 bis 3 Stücke brechen, die Petersilie fein hacken.',
        'Das Olivenöl mit Knoblauch und Chili in einer kleinen feuerfesten Tonschale („Cazuela de barro“) oder einem kleinen Pfännchen bei kleiner Hitze 3 Minuten langsam erwärmen, bis der Knoblauch hellgolden ist – er darf nicht braun werden, sonst wird er bitter.',
        'Die Hitze erhöhen, die Garnelen hineingeben und 2 Minuten garen, dabei einmal wenden, bis sie gerade rosa sind; in der heißen Schale ziehen sie noch nach.',
        'Mit Petersilie bestreuen und sofort brutzelnd servieren, dazu Brot zum Tunken ins Knoblauchöl. Gambas al ajillo kommen beim Tapas-Abend als Letztes auf den Tisch.',
      ]),
  ],
  catalog: {},
  products: {},
  nutrition: {},
  grams: {},
  deviceSteps: {
    'gambas-al-ajillo': [
      { text: 'Die Garnelen am Vortag im Kühlschrank auftauen lassen, trocken tupfen, Darm entfernen und leicht salzen. Den Knoblauch in dünne Scheiben schneiden, die getrocknete Chili (in Spanien „Guindilla“) in 2 bis 3 Stücke brechen, die Petersilie fein hacken.' },
      {
        text: 'Das Olivenöl mit Knoblauch und Chili in einem kleinen Pfännchen auf dem BORA 3 Minuten langsam erwärmen, bis der Knoblauch hellgolden ist – er darf nicht braun werden, sonst wird er bitter. (Die klassische Tonschale funktioniert auf dem Induktionsfeld nicht; zum Servieren vorgewärmt bereitstellen.)',
        settings: [bora('3', { minutes: 3, note: 'kleines Pfännchen' })],
      },
      {
        text: 'Auf Stufe 7 erhöhen, die Garnelen hineingeben und 2 Minuten garen, dabei einmal wenden, bis sie gerade rosa sind; im heißen Öl ziehen sie noch nach.',
        settings: [bora('7', { minutes: 2 })],
      },
      { text: 'Mit Petersilie bestreuen und sofort brutzelnd in der vorgewärmten Schale servieren, dazu Brot zum Tunken ins Knoblauchöl. Gambas al ajillo kommen beim Tapas-Abend als Letztes auf den Tisch.' },
    ],
  },
  imageQueries: {
    'gambas-al-ajillo': 'gambas al ajillo',
  },
}
