import { salat } from '../../define'
import { bora } from '../../device-helpers'
import type { ExtraGroup } from '../types'

/**
 * Salate & Beilagen · Nudelsalate aller Küchen: deutsch (klassisch mit Mayo, mit Fleischwurst, Schichtsalat-Art),
 * italienisch (Insalata di pasta mit Pesto/Tomaten/Mozzarella), spanisch (Ensalada de pasta mit Thunfisch und Oliven),
 * griechisch (Kritharaki-Salat) …
 * Anlegen mit `salat(id, titel, { group: 'nudel', cuisine, time, portions, name: '… (selbstgemacht)', shelf, lighter }, zutaten, schritte)`.
 * Mengen für `portions` Beilagen-Portionen (Grillabend/Gäste: 4–8). Ergebnis kommt bei „Fertig“ in den Vorrat (Kühlschrank).
 * Haltbarkeit: mit Mayo/Ei/Fleischwurst 2 Tage, mit Essig-Öl-Dressing 3 Tage. Regeln: docs/spanien-regeln.md (Abschnitt Salate).
 * Neue Fotos: Zeilen in scripts/fotos-neu-nudelsalate.md.
 */
export const nudelsalate: ExtraGroup = {
  recipes: [
    salat('nudelsalat-klassisch', 'Nudelsalat klassisch mit Fleischwurst, Erbsen und Gurke',
      {
        group: 'nudel', cuisine: 'de', time: 45, portions: 6, name: 'Nudelsalat (selbstgemacht)', shelf: 2,
        lighter: 'Fleischwurst durch Kochschinken ersetzen und die Mayonnaise ganz durch Joghurt mit 1 TL Senf – spart rund 120 kcal je Portion.',
      },
      '250 g Fusilli | 150 g Erbsen TK | 2 Stk Ei | 200 g Fleischwurst | 4 Stk Gewürzgurke | 0.5 Stk Paprika rot | 80 g Mayonnaise | 200 g Joghurt natur | 1 TL Senf mittelscharf | 0.5 Bund Schnittlauch | Salz | Pfeffer | Zucker',
      [
        'Die Nudeln in reichlich Salzwasser 1 Minute länger als angegeben kochen (im Salat ziehen sie Flüssigkeit, zu bissfeste Nudeln werden hart). In den letzten 2 Minuten die Erbsen mitkochen. Abgießen, kurz kalt abschrecken und abtropfen lassen. Die Eier 10 Minuten hart kochen und abschrecken.',
        'Fleischwurst, Gewürzgurken und Paprika in kleine Würfel schneiden, die Eier pellen und hacken, den Schnittlauch in Röllchen schneiden.',
        'Mayonnaise, Joghurt, Senf und 4 EL Gurkenwasser aus dem Glas glatt rühren, mit Salz, Pfeffer und einer Prise Zucker kräftig abschmecken – Nudeln schlucken viel Würze.',
        'Alles vorsichtig mischen und mindestens 1 Stunde abgedeckt im Kühlschrank durchziehen lassen. Vor dem Servieren nochmals abschmecken und, falls er zu fest geworden ist, mit 2 bis 3 EL Gurkenwasser oder Milch lockern. Hält gut gekühlt 2 Tage.',
      ]),
  ],
  catalog: {},
  products: {},
  nutrition: {},
  grams: {},
  deviceSteps: {
    'nudelsalat-klassisch': [
      {
        text: 'Reichlich Salzwasser im großen Topf auf dem BORA aufkochen. Die Nudeln 1 Minute länger als angegeben kochen (im Salat ziehen sie Flüssigkeit, zu bissfeste Nudeln werden hart), in den letzten 2 Minuten die Erbsen mitkochen. Abgießen, kurz kalt abschrecken und abtropfen lassen.',
        settings: [bora('Power', { note: 'Wasser aufkochen' }), bora('7', { minutes: 11, note: 'sprudelnd kochen' })],
      },
      {
        text: 'Die Eier in einem kleinen Topf 10 Minuten hart kochen und kalt abschrecken.',
        settings: [bora('7', { minutes: 10 })],
      },
      { text: 'Fleischwurst, Gewürzgurken und Paprika in kleine Würfel schneiden, die Eier pellen und hacken, den Schnittlauch in Röllchen schneiden.' },
      { text: 'Mayonnaise, Joghurt, Senf und 4 EL Gurkenwasser aus dem Glas glatt rühren, mit Salz, Pfeffer und einer Prise Zucker kräftig abschmecken – Nudeln schlucken viel Würze.' },
      { text: 'Alles vorsichtig mischen und mindestens 1 Stunde abgedeckt im Kühlschrank durchziehen lassen. Vor dem Servieren nochmals abschmecken und, falls er zu fest geworden ist, mit 2 bis 3 EL Gurkenwasser oder Milch lockern. Hält gut gekühlt 2 Tage.' },
    ],
  },
  imageQueries: {
    'nudelsalat-klassisch': 'german pasta salad',
  },
}
