import { bbq } from '../../define'
import { gasgrill } from '../../device-helpers'
import type { ExtraGroup } from '../types'

/**
 * BBQ · Burger (Gasgrill direkt, Smash auf der Plancha, Pulled-Pork-Burger aus dem Vorrat …). Saucen/Rubs aus
 * rubs-saucen.ts als Zutat nennen („BBQ-Sauce“, „BBQ-Rub“) – Selbstgemachtes wird automatisch zuerst genommen.
 * Regeln: docs/bbq-regeln.md.
 */
export const burger: ExtraGroup = {
  recipes: [
    bbq('bacon-cheeseburger-grill', 'Bacon-Cheeseburger vom Gasgrill',
      { group: 'burger', time: 40, portions: 2, eat: 2 },
      '360 g Rinderhackfleisch | 2 Stk Burger-Brötchen | 2 Scheibe Cheddar | 60 g Bacon | 1 Stk Tomate | 0.25 Stk Kopfsalat | 0.5 Stk Zwiebel rot | 1 Stk Gewürzgurke | 2 EL BBQ-Sauce | 1 EL Mayonnaise | Salz | Pfeffer',
      [
        'Das Hackfleisch ohne Kneten zu 2 Patties à 180 g formen, etwas größer als die Brötchen, mit einer Daumenmulde in der Mitte. Kalt stellen. Tomate, Zwiebel und Gewürzgurke in Scheiben schneiden, Salatblätter waschen.',
        'Den Grill sehr heiß vorheizen und den Rost bürsten.',
        'Die Patties salzen und pfeffern und 3 Minuten je Seite grillen, nur einmal wenden. Nach dem Wenden mit Cheddar belegen. Den Bacon daneben knusprig grillen.',
        'Die Brötchen auf den Schnittflächen kurz rösten. Mit Mayonnaise bestreichen und mit Salat, Tomate, Patty, Bacon, Zwiebel, Gurke und BBQ-Sauce belegen.',
      ]),
  ],
  catalog: {},
  products: {},
  nutrition: {},
  grams: {},
  deviceSteps: {
    'bacon-cheeseburger-grill': [
      {
        text: 'Das Rinderhackfleisch ohne Kneten zu 2 Patties à 180 g formen, etwas größer als die Burger-Brötchen, mit einer Daumenmulde in der Mitte. Kalt stellen. Tomate, Zwiebel und Gewürzgurke in Scheiben schneiden, Kopfsalat-Blätter waschen.',
      },
      {
        text: 'Den Gasgrill mit allen 4 Brennern auf hoch und geschlossenem Deckel 10 Minuten auf etwa 260 °C vorheizen und den Rost abbürsten.',
        settings: [gasgrill('Vorheizen', 260, 'hoch', 'alle', { minutes: 10, note: 'Deckel zu' })],
      },
      {
        text: 'Die Patties salzen und pfeffern und direkt über der Flamme 3 Minuten je Seite grillen, nur einmal wenden. Nach dem Wenden mit Cheddar belegen und den Deckel kurz schließen, bis er schmilzt. Den Bacon daneben knusprig grillen. Das Thermometer zeigt im Patty mindestens 70 °C.',
        settings: [gasgrill('Direkt', 260, 'hoch', 'alle', { minutes: 6, core: 70 })],
      },
      {
        text: 'Die Burger-Brötchen auf den Schnittflächen 30 Sekunden rösten. Unten mit Mayonnaise bestreichen und mit Salat, Tomate, Patty, Bacon, Zwiebel, Gurke und BBQ-Sauce belegen.',
      },
    ],
  },
  imageQueries: { 'bacon-cheeseburger-grill': 'bacon cheeseburger grilled' },
}
