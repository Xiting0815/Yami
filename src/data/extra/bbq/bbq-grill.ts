import { bbq, prod } from '../../define'
import { gasgrill } from '../../device-helpers'
import type { ExtraGroup } from '../types'

/**
 * BBQ · Grill (4-Brenner-Gasgrill, Deckelthermometer): Steaks, Spieße, Chicken, Reverse Sear, Planked Salmon …
 * Zonen über die Brenner: direkt = alle hoch, indirekt = Brenner 1+4 an, Mitte aus, Deckel zu. Kerntemperatur mit Thermometer.
 * Regeln: docs/bbq-regeln.md, Gerät: docs/geraete/grill-dutch.md, Baustein `gasgrill()` (device-helpers.ts).
 */
export const bbqGrill: ExtraGroup = {
  recipes: [
    bbq('beer-can-chicken', 'Beer Can Chicken vom Gasgrill',
      { group: 'grill', time: 150, portions: 4, eat: 2 },
      '1400 g Hähnchen ganz | 1 EL Sonnenblumenöl | 3 EL BBQ-Rub | 330 ml Bier hell | 100 ml BBQ-Sauce',
      [
        'Das Hähnchen innen und außen trocken tupfen, dünn mit Öl einreiben und rundum sowie innen mit dem Rub würzen. Mindestens 1 Stunde im Kühlschrank ziehen lassen.',
        'Den Grill für indirekte Hitze vorbereiten: nur die äußeren Brenner an, die Mitte aus, Deckel zu, etwa 180 °C.',
        'Eine halbvolle Bierdose (etwa 165 ml Bier) ins Hähnchen schieben und das Hähnchen aufrecht in die Mitte stellen. Bei geschlossenem Deckel 75 bis 90 Minuten grillen, bis die Keule innen 80 °C hat.',
        'Das Hähnchen 10 Minuten ruhen lassen, die heiße Dose vorsichtig mit Grillhandschuhen herausziehen, tranchieren und mit der BBQ-Sauce servieren.',
      ]),
  ],
  catalog: { fleisch: ['Hähnchen ganz'] },
  products: { 'Hähnchen ganz': prod(1400, 'g', 5.99, 3, 1, 'Stk') },
  // je 100 g Einkaufsgewicht mit Knochen (essbarer Anteil ca. 70 %)
  nutrition: { 'Hähnchen ganz': [150, 13, 11, 0, 0] },
  grams: {},
  deviceSteps: {
    'beer-can-chicken': [
      {
        text: 'Das Hähnchen innen und außen trocken tupfen, dünn mit Öl einreiben und rundum sowie innen mit dem BBQ-Rub würzen. Mindestens 1 Stunde im Kühlschrank ziehen lassen.',
      },
      {
        text: 'Den Gasgrill mit allen 4 Brennern auf hoch und geschlossenem Deckel 10 Minuten auf etwa 250 °C vorheizen und den Rost abbürsten. Dann die mittleren Brenner ausschalten und Brenner 1 und 4 auf mittel stellen: indirekte Hitze, das Deckelthermometer pendelt sich bei etwa 180 °C ein.',
        settings: [gasgrill('Vorheizen', 250, 'hoch', 'alle', { minutes: 10, note: 'Deckel zu' }), gasgrill('Indirekt', 180, 'mittel', '1+4', { note: 'Mitte aus' })],
      },
      {
        text: 'Etwa 165 ml vom Bier hell abgießen, die halbvolle Dose ins Hähnchen schieben und das Hähnchen aufrecht über die ausgeschalteten Brenner in die Mitte stellen. Bei geschlossenem Deckel und 180 °C 75 bis 90 Minuten grillen, bis das Thermometer in der Keule 80 °C zeigt (Brust mindestens 74 °C). Das Deckelthermometer misst oben unter dem Deckel und geht oft 10 bis 20 °C falsch – die Kerntemperatur entscheidet.',
        settings: [gasgrill('Indirekt', 180, 'mittel', '1+4', { minutes: 80, core: 80, note: 'Deckel zu' })],
      },
      {
        text: 'Das Hähnchen 10 Minuten ruhen lassen, die heiße Dose vorsichtig mit Grillhandschuhen herausziehen, tranchieren und mit der BBQ-Sauce servieren.',
      },
    ],
  },
  imageQueries: { 'beer-can-chicken': 'beer can chicken grill' },
}
