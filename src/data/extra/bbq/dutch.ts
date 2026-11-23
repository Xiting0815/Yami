import { bbq } from '../../define'
import { dutch, vakuum } from '../../device-helpers'
import type { ExtraGroup } from '../types'

/**
 * BBQ · Dutch Oven (Gusseisen, auf der Gasflamme: Hockerkocher oder Gasgrill-Brenner): Chili, Schmorgerichte, Beans,
 * Cobbler. Einstellung = Flamme (niedrig/mittel/hoch) + Dauer, Deckel-Hinweis in der Notiz. Backen mit Oberhitze
 * (Cobbler, Brot): Dutch Oven im Gasgrill indirekt mit Deckel zu (`gasgrill()`), Ausweichweg Combair (`alt: true`).
 * Regeln: docs/bbq-regeln.md, Gerät: docs/geraete/grill-dutch.md, Baustein `dutch()`.
 */
export const dutchOven: ExtraGroup = {
  recipes: [
    bbq('chili-dutch-oven', 'Chili con Carne aus dem Dutch Oven',
      {
        group: 'dutch',
        time: 210,
        portions: 6,
        eat: 2,
        leftover: { name: 'Chili con Carne (vakuumiert)', amount: 4, unit: 'Portion', shelf: 90 },
        lighter: 'Die Hälfte des Rindfleischs durch eine zweite Dose Kidneybohnen ersetzen – spart rund 150 kcal pro Portion.',
      },
      '1200 g Rindergulasch | 2 EL Sonnenblumenöl | 3 Stk Zwiebel | 4 Zehe Knoblauch | 2 Stk Paprika rot | 2 EL Tomatenmark | 2 TL Kreuzkümmel | 1 EL Paprikapulver geräuchert | 1 TL Oregano getrocknet | 2 TL Chiliflocken | 330 ml Dunkelbier | 2 Dose Gehackte Tomaten | 400 ml Rinderbrühe | 500 g Kidneybohnen | 20 g Zartbitterschokolade | Salz | Pfeffer',
      [
        'Das Fleisch in 2 cm große Würfel schneiden, trocken tupfen und salzen. Zwiebeln und Paprika würfeln, Knoblauch fein hacken.',
        'Den Dutch Oven ohne Deckel stark erhitzen und das Fleisch im Öl portionsweise kräftig anbraten, herausnehmen.',
        'Zwiebeln und Paprika bei mittlerer Hitze 5 Minuten anschwitzen, Knoblauch, Tomatenmark, Kreuzkümmel, geräuchertes Paprikapulver, Oregano und Chiliflocken kurz mitrösten und mit dem Dunkelbier ablöschen.',
        'Fleisch, Tomaten und Brühe zugeben, aufkochen und mit Deckel bei kleiner Hitze 2,5 Stunden schmoren, ab und zu umrühren.',
        'Kidneybohnen abspülen und mit der Schokolade unterrühren, offen 20 Minuten köcheln lassen und mit Salz und Pfeffer abschmecken.',
        'Die Reste abkühlen lassen, in 4 Portionsbeutel füllen, vakuumieren und einfrieren (hält ca. 3 Monate).',
      ]),
  ],
  catalog: {},
  products: {},
  nutrition: {},
  grams: {},
  deviceSteps: {
    'chili-dutch-oven': [
      { text: 'Das Fleisch in 2 cm große Würfel schneiden, trocken tupfen und salzen. Zwiebeln und Paprika würfeln, Knoblauch fein hacken.' },
      {
        text: 'Den Dutch Oven (ca. 4,5 l, z. B. ft6) ohne Deckel auf den Hockerkocher stellen und auf hoher Flamme 5 Minuten vorheizen. Das Fleisch im Sonnenblumenöl in drei Portionen kräftig anbraten und herausnehmen.',
        settings: [dutch('Anbraten', 'hoch', { note: 'ohne Deckel, Hockerkocher' })],
      },
      {
        text: 'Die Flamme auf mittel stellen, Zwiebeln und Paprika 5 Minuten anschwitzen. Knoblauch, Tomatenmark, Kreuzkümmel, geräuchertes Paprikapulver, Oregano und Chiliflocken kurz mitrösten und mit dem Dunkelbier ablöschen.',
        settings: [dutch('Anbraten', 'mittel', { minutes: 5 })],
      },
      {
        text: 'Fleisch, gehackte Tomaten und Rinderbrühe zugeben und aufkochen. Die Flamme auf niedrig stellen, den Deckel auflegen und 2,5 Stunden schmoren, alle 30 Minuten umrühren und den Boden prüfen.',
        settings: [dutch('Schmoren', 'niedrig', { minutes: 150, note: 'Deckel zu' })],
      },
      {
        text: 'Kidneybohnen abspülen und mit der Zartbitterschokolade unterrühren. Ohne Deckel 20 Minuten köcheln lassen und mit Salz und Pfeffer abschmecken.',
        settings: [dutch('Köcheln', 'niedrig', { minutes: 20, note: 'ohne Deckel' })],
      },
      {
        text: 'Die Reste abkühlen lassen, in 4 Portionsbeutel füllen und im Vakuumierer mit Feucht-Modus vakuumieren. Flach einfrieren (hält ca. 3 Monate).',
        settings: [vakuum('Vakuumieren feucht', '4 Beutel à 1 Portion')],
      },
    ],
  },
  imageQueries: { 'chili-dutch-oven': 'chili con carne dutch oven' },
}
