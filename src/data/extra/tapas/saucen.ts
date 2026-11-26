import { backen, prod } from '../../define'
import type { ExtraGroup } from '../types'

/**
 * Tapas · Grundsaucen (Grundrezepte): Alioli, Salsa brava, Romesco, Mojo rojo, Mojo verde … selbstgemacht auf Vorrat.
 * „Fertig gekocht“ legt sie in den Vorrat (Kühlschrank); Tapas, die sie brauchen, nehmen das Selbstgemachte zuerst
 * (`substitutes.preferred`), das gekaufte Glas bleibt Ersatz (gleiche Austausch-Gruppe, GLEICHE Einheit).
 * Anlegen mit `backen('grundrezept', id, titel, { cuisine: 'es', tapas: 'sauce', time, yields: { name: '… selbstgemacht', amount, unit, shelf, store, cat: 'konserven' } }, zutaten, schritte)`.
 * Regeln: docs/spanien-regeln.md (Abschnitt Saucen).
 *
 * Kaufbare Grundnamen (schon angelegt – die anderen Tapas-Gruppen verwenden NUR diese Namen; Selbstgemachtes wird automatisch zuerst genommen):
 *   'Alioli' (ml) · 'Salsa brava' (ml) · 'Romesco' (g) · 'Mojo rojo' (ml) · 'Mojo verde' (ml)
 * Phase 2: je Sauce ein Grundrezept mit `yields.name` = '<Grundname> selbstgemacht' (Einheit wie oben), dazu
 * `substitutes.groups` (z. B. bravas: ['Salsa brava', 'Salsa brava selbstgemacht']) und `substitutes.preferred`.
 */
export const saucen: ExtraGroup = {
  recipes: [
    backen('grundrezept', 'alioli', 'Alioli (Knoblauch-Öl-Emulsion)',
      {
        cuisine: 'es',
        tapas: 'sauce',
        time: 15,
        yields: { name: 'Alioli selbstgemacht', amount: 220, unit: 'ml', shelf: 3, store: 'im Kühlschrank (Glas mit Deckel)', cat: 'konserven' },
      },
      '1 Stk Ei | 3 Zehe Knoblauch | 100 ml Olivenöl | 100 ml Sonnenblumenöl | 0.25 Stk Zitrone | Salz',
      [
        'Alle Zutaten auf Zimmertemperatur bringen (kaltes Ei und Öl verbinden sich schlecht). Den Knoblauch schälen, längs halbieren, den grünen Keim entfernen (er macht die Alioli bitter und scharf) und mit einer Prise Salz im Mörser oder mit der Messerklinge zu einer glatten Paste zerreiben.',
        'Das Ei, die Knoblauchpaste, 1 TL Zitronensaft und eine Prise Salz in einen hohen, schmalen Mixbecher geben, beide Öle darübergießen. Halb Sonnenblumenöl, weil kräftiges natives Olivenöl beim schnellen Mixen bitter wird.',
        'Den Stabmixer ganz auf den Boden setzen, einschalten und erst nach 10 bis 15 Sekunden langsam nach oben ziehen, bis alles zu einer dicken, glänzenden Creme emulgiert ist.',
        'Mit Salz und Zitronensaft abschmecken und in ein sauberes Glas füllen. Mit rohem Ei höchstens 3 Tage im Kühlschrank aufbewahren. Die ursprüngliche katalanisch-valencianische „All i oli“ besteht nur aus Knoblauch, Salz und Olivenöl, im Mörser tropfenweise aufgeschlagen – das braucht 15 Minuten Geduld und gelingt nicht immer; die Variante mit Ei ist in Spanien heute die übliche.',
      ]),
  ],
  catalog: {
    konserven: ['Alioli', 'Salsa brava', 'Romesco', 'Mojo rojo', 'Mojo verde'],
  },
  products: {
    Alioli: prod(200, 'ml', 1.99, 180, 14, 'Glas'),
    'Salsa brava': prod(200, 'ml', 2.99, 365, 14, 'Glas'),
    Romesco: prod(180, 'g', 3.49, 365, 14, 'Glas'),
    'Mojo rojo': prod(200, 'ml', 2.99, 365, 30, 'Glas'),
    'Mojo verde': prod(200, 'ml', 2.99, 365, 30, 'Glas'),
  },
  nutrition: {
    Alioli: [650, 1, 70, 3, 0],
    'Salsa brava': [70, 1.5, 4, 7, 1.5],
    Romesco: [330, 6, 30, 9, 4],
    'Mojo rojo': [300, 2, 30, 6, 2],
    'Mojo verde': [330, 1.5, 34, 4, 2],
  },
  grams: {},
  substitutes: {
    groups: { alioli: ['Alioli', 'Alioli selbstgemacht'] },
    preferred: { Alioli: ['Alioli selbstgemacht'] },
  },
  deviceSteps: {},
  imageQueries: {
    alioli: 'allioli garlic sauce',
  },
}
