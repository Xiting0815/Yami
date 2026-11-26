import { tapa } from '../../define'
import { plancha } from '../../device-helpers'
import type { ExtraGroup } from '../types'

/**
 * Tapas · Fleisch & Wurst (Pinchos morunos, Albóndigas en salsa, Chorizo a la sidra, Jamón con melón, Croquetas de jamón,
 * Pollo al ajillo als Tapa, Carrillada …).
 * Anlegen mit `tapa(id, 'Spanischer Titel (deutsche Erklärung)', { group: 'fleisch', time, serve, ahead? }, zutaten, schritte)`.
 * Gemeinsame Spanien-Zutaten (Chorizo, Serrano-Schinken, Manchego, Sidra …): src/data/extra/zutaten-es.ts – nicht neu anlegen.
 * Mengen: EIN Teller für 2 Personen als eine von ca. 5 Tapas, ca. 120–200 kcal je Person. Marinaden gehören in `ahead`
 * (Ablaufplan „Vorher“). Regeln: docs/spanien-regeln.md. Neue Fotos: Zeilen in scripts/fotos-neu-tapas-fleisch.md.
 */
export const tapasFleisch: ExtraGroup = {
  recipes: [
    tapa('pinchos-morunos', 'Pinchos morunos (maurische Schweinefleisch-Spießchen)',
      { group: 'fleisch', time: 25, serve: 'heiss', ahead: 'Fleisch mindestens 2 Stunden, am besten über Nacht marinieren' },
      '160 g Schweinefilet | 1 TL Paprikapulver geräuchert | 0.5 TL Kreuzkümmel | 0.5 TL Oregano getrocknet | 1 Zehe Knoblauch | 2 TL Olivenöl | 0.25 Stk Zitrone | 0.25 Bund Petersilie | Salz | Pfeffer',
      [
        'Das Schweinefilet (in Spanien „Lomo“) in 2 cm große Würfel schneiden. Knoblauch fein reiben und mit Olivenöl, geräuchertem Paprikapulver (in Spanien „Pimentón de la Vera“), Kreuzkümmel, Oregano und Pfeffer verrühren. Das Fleisch darin wenden und abgedeckt mindestens 2 Stunden, am besten über Nacht im Kühlschrank marinieren.',
        'Die Würfel auf 4 kleine Holzspieße stecken (vorher 30 Minuten in Wasser legen, dann verkohlen sie nicht) und erst kurz vor dem Braten salzen.',
        'Eine Gusseisenpfanne oder Plancha sehr heiß werden lassen und die Spieße darin 6 Minuten rundum braten, bis sie außen gebräunt und innen gerade durch sind.',
        'Mit Zitronensaft beträufeln, mit Petersilie bestreuen und heiß servieren. Der Name erinnert an die maurische Herkunft – in Andalusien werden sie heute meist mit Schweinefleisch gemacht, ursprünglich mit Lamm.',
      ]),
  ],
  catalog: {},
  products: {},
  nutrition: {},
  grams: {},
  deviceSteps: {
    'pinchos-morunos': [
      { text: 'Das Schweinefilet (in Spanien „Lomo“) in 2 cm große Würfel schneiden. Knoblauch fein reiben und mit Olivenöl, geräuchertem Paprikapulver (in Spanien „Pimentón de la Vera“), Kreuzkümmel, Oregano und Pfeffer verrühren. Das Fleisch darin wenden und abgedeckt mindestens 2 Stunden, am besten über Nacht im Kühlschrank marinieren.' },
      { text: 'Die Würfel auf 4 kleine Holzspieße stecken (vorher 30 Minuten in Wasser legen, dann verkohlen sie nicht) und erst kurz vor dem Braten salzen.' },
      {
        text: 'Die Plancha (Gusseisenpfanne) ohne Fett auf dem BORA 4 Minuten sehr heiß werden lassen.',
        settings: [plancha('bora', 'Vorheizen', { level: '8', minutes: 4 }), plancha('gasgrill', 'Vorheizen', { level: 'hoch', temp: 280, minutes: 10, note: 'Plancha auf dem Rost, Deckel zu', alt: true })],
      },
      {
        text: 'Die Spieße auf der Plancha 6 Minuten rundum braten, bis sie außen gebräunt und innen gerade durch sind.',
        settings: [plancha('bora', 'Braten', { level: '7', minutes: 6, note: 'alle 1–2 Min. wenden' }), plancha('gasgrill', 'Braten', { level: 'hoch', minutes: 6, alt: true })],
      },
      { text: 'Mit Zitronensaft beträufeln, mit Petersilie bestreuen und heiß servieren. Der Name erinnert an die maurische Herkunft – in Andalusien werden sie heute meist mit Schweinefleisch gemacht, ursprünglich mit Lamm.' },
    ],
  },
  imageQueries: {
    'pinchos-morunos': 'pinchos morunos',
  },
}
