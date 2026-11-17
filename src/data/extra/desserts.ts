// Backen & Desserts – Gruppe „Desserts“ (für Gäste). Regeln: docs/backen-regeln.md. Nur diese Datei bearbeiten.
import { backen, prod } from '../define'
import type { ExtraGroup } from './types'

export const desserts: ExtraGroup = {
  recipes: [
    backen('dessert', 'tiramisu', 'Tiramisu',
      {
        cuisine: 'it',
        time: 390,
        yields: { name: 'Tiramisu (selbstgemacht)', amount: 6, unit: 'Portion', shelf: 2, store: 'im Kühlschrank' },
        lighter: 'Die Hälfte des Mascarpones durch Skyr ersetzen und 30 g Zucker weniger nehmen – spart rund 170 kcal pro Portion und schmeckt frischer.',
      },
      '500 g Mascarpone | 4 Stk Ei | 100 g Zucker | 200 g Löffelbiskuits | 20 g Kaffee gemahlen | 2 EL Backkakao | 1 Prise Salz',
      [
        'Den Kaffee gemahlen mit 300 ml kochendem Wasser aufbrühen (oder 4 Espresso), durch einen Filter gießen und abkühlen lassen.',
        'Die Eier trennen. Eigelb mit dem Zucker in einer Metallschüssel über einem Topf mit siedendem Wasser 5 Minuten hell und dick aufschlagen, bis die Masse etwa 70 °C hat, dann kalt weiterschlagen, bis sie abgekühlt ist.',
        'Den Mascarpone glatt rühren und die Eigelbmasse unterrühren. Das Eiweiß mit der Prise Salz steif schlagen und vorsichtig unterheben.',
        'Die Hälfte der Löffelbiskuits kurz in den Kaffee tauchen und eine Form (ca. 20 × 25 cm) damit auslegen, die Hälfte der Creme daraufstreichen. Mit den übrigen Löffelbiskuits und der restlichen Creme wiederholen.',
        'Abgedeckt mindestens 6 Stunden, besser über Nacht, im Kühlschrank durchziehen lassen. Vor dem Servieren dick mit Backkakao bestäuben.',
      ]),
  ],
  catalog: {
    konserven: ['Löffelbiskuits', 'Kaffee gemahlen'],
  },
  products: {
    Löffelbiskuits: prod(200, 'g', 1.29, 365, 30, 'Pck'),
    'Kaffee gemahlen': prod(500, 'g', 4.99, 365, 60, 'Pck'),
  },
  nutrition: {
    Löffelbiskuits: [390, 8, 4, 80, 1],
    // nur was beim Aufbrühen ins Getränk geht (20 g Pulver ≈ 300 ml Kaffee ≈ 6 kcal)
    'Kaffee gemahlen': [30, 1.5, 0, 3, 0],
  },
  grams: {},
  deviceSteps: {
    tiramisu: [
      {
        text: 'Den Kaffee gemahlen mit 300 ml kochendem Wasser aufbrühen (oder 4 Espresso), durch einen Filter gießen und abkühlen lassen.',
        settings: [{ device: 'bora', mode: 'Kochzone', level: 'Power', note: 'Wasser aufkochen' }],
      },
      {
        text: 'Die Eier trennen. Eigelb mit dem Zucker in einer Metallschüssel über einem Topf mit leise siedendem Wasser 5 Minuten hell und dick aufschlagen, bis die Masse etwa 70 °C hat, dann kalt weiterschlagen, bis sie abgekühlt ist.',
        settings: [{ device: 'bora', mode: 'Kochzone', level: '3', minutes: 5, note: 'Wasserbad' }],
      },
      { text: 'Den Mascarpone glatt rühren und die Eigelbmasse unterrühren. Das Eiweiß mit der Prise Salz steif schlagen und vorsichtig unterheben.' },
      {
        text: 'Die Hälfte der Löffelbiskuits kurz in den Kaffee tauchen und eine Form (ca. 20 × 25 cm) damit auslegen, die Hälfte der Creme daraufstreichen. Mit den übrigen Löffelbiskuits und der restlichen Creme wiederholen.',
      },
      { text: 'Abgedeckt mindestens 6 Stunden, besser über Nacht, im Kühlschrank durchziehen lassen. Vor dem Servieren dick mit Backkakao bestäuben.' },
    ],
  },
  imageQueries: {
    tiramisu: 'tiramisu dessert',
  },
}
