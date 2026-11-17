// Backen & Desserts – Gruppe „Kuchen“ (Blechkuchen & Hefeteig). Regeln: docs/backen-regeln.md. Nur diese Datei bearbeiten.
import { backen, prod } from '../define'
import type { ExtraGroup } from './types'

export const kuchen: ExtraGroup = {
  recipes: [
    backen('kuchen', 'bienenstich', 'Bienenstich',
      {
        time: 210,
        yields: { name: 'Bienenstich (selbstgebacken)', amount: 12, unit: 'Stk', shelf: 3, store: 'im Kühlschrank' },
        lighter: 'Für die Creme 250 g Magerquark statt der geschlagenen Sahne unter den Pudding rühren und nur 100 g Mandelblättchen nehmen – spart rund 60 kcal pro Stück.',
      },
      '375 g Weizenmehl | 21 g Hefe frisch | 675 ml Milch | 210 g Zucker | 160 g Butter | 1 Stk Ei | 1 Prise Salz | 2 EL Honig | 245 ml Sahne | 150 g Mandelblättchen | 1 Pck Vanillepuddingpulver',
      [
        'Für den Hefeteig 175 ml von der Milch lauwarm erwärmen und die Hefe frisch mit 1 TL vom Zucker darin auflösen. Mit dem Weizenmehl, 50 g Zucker, 60 g weicher Butter, dem Ei und der Prise Salz 5 Minuten zu einem glatten Teig kneten.',
        'Den Teig zugedeckt an einem warmen Ort 45 Minuten gehen lassen, bis er sich etwa verdoppelt hat.',
        'Für den Belag 100 g Butter, 100 g Zucker, den Honig und 45 ml von der Sahne aufkochen, die Mandelblättchen unterrühren und 2 Minuten köcheln lassen. Etwas abkühlen lassen.',
        'Eine Springform (26 cm) fetten, den Teig hineindrücken, den Mandelbelag daraufstreichen und weitere 15 Minuten gehen lassen. Den Ofen auf 180 °C Ober-/Unterhitze vorheizen.',
        'Den Kuchen 25–30 Minuten goldbraun backen und auf einem Gitter vollständig auskühlen lassen.',
        'Aus dem Vanillepuddingpulver, 500 ml Milch und 60 g Zucker nach Packungsangabe einen Pudding kochen, Frischhaltefolie direkt auf die Oberfläche legen und abkühlen lassen.',
        'Den Kuchen waagerecht halbieren und den Mandeldeckel in 12 Stücke schneiden. 200 ml Sahne steif schlagen, den kalten Pudding glatt rühren und die Sahne unterheben.',
        'Die Creme auf den Boden streichen, die Mandelstücke darauflegen und den Bienenstich mindestens 1 Stunde kühlen.',
      ]),
  ],
  catalog: {
    konserven: ['Mandelblättchen', 'Vanillepuddingpulver'],
  },
  products: {
    Mandelblättchen: prod(200, 'g', 2.29, 365, 90, 'Pck'),
    Vanillepuddingpulver: prod(3, 'Pck', 0.69, 365, 365, 'Packung'),
  },
  nutrition: {
    Mandelblättchen: [600, 22, 54, 6, 11],
    Vanillepuddingpulver: [350, 0.3, 0.1, 86, 0],
  },
  grams: {
    Vanillepuddingpulver: { Pck: 37 },
  },
  deviceSteps: {
    bienenstich: [
      {
        text: 'Für den Hefeteig 175 ml von der Milch lauwarm erwärmen und die Hefe frisch mit 1 TL vom Zucker darin auflösen. Mit dem Weizenmehl, 50 g Zucker, 60 g weicher Butter, dem Ei und der Prise Salz 5 Minuten zu einem glatten Teig kneten.',
        settings: [{ device: 'bora', mode: 'Kochzone', level: '2', note: 'nur lauwarm' }],
      },
      {
        text: 'Den Teig in der Schüssel abdecken und im CombiSteamer 45 Minuten gehen lassen, bis er sich etwa verdoppelt hat.',
        settings: [{ device: 'steamer', mode: 'Profi-Backen Aufgehen lassen', temp: 35, minutes: 45, note: 'Schüssel auf den Gitterrost' }],
      },
      {
        text: 'Für den Belag 100 g Butter, 100 g Zucker, den Honig und 45 ml von der Sahne aufkochen, die Mandelblättchen unterrühren und 2 Minuten köcheln lassen. Etwas abkühlen lassen.',
        settings: [
          { device: 'bora', mode: 'Kochzone', level: '5', note: 'aufkochen' },
          { device: 'bora', mode: 'Kochzone', level: '3', minutes: 2 },
        ],
      },
      {
        text: 'Eine Springform (26 cm) fetten, den Teig hineindrücken, den Mandelbelag daraufstreichen und weitere 15 Minuten gehen lassen. Inzwischen den Combair vorheizen.',
        settings: [{ device: 'combair', mode: 'Ober-/Unterhitze', temp: 180, note: 'vorheizen' }],
      },
      {
        text: 'Die Form auf dem Gitterrost in den vorgeheizten Combair schieben, den Kuchen 25–30 Minuten goldbraun backen und auf einem Gitter vollständig auskühlen lassen.',
        settings: [{ device: 'combair', mode: 'Ober-/Unterhitze', temp: 180, minutes: 25, note: 'Ebene 2, Stäbchenprobe' }],
      },
      {
        text: 'Aus dem Vanillepuddingpulver, 500 ml Milch und 60 g Zucker nach Packungsangabe einen Pudding kochen, Frischhaltefolie direkt auf die Oberfläche legen und abkühlen lassen.',
        settings: [
          { device: 'bora', mode: 'Kochzone', level: '6', note: 'Milch aufkochen' },
          { device: 'bora', mode: 'Kochzone', level: '3', minutes: 1, note: 'Pulver einrühren, unter Rühren' },
        ],
      },
      { text: 'Den Kuchen waagerecht halbieren und den Mandeldeckel in 12 Stücke schneiden. 200 ml Sahne steif schlagen, den kalten Pudding glatt rühren und die Sahne unterheben.' },
      { text: 'Die Creme auf den Boden streichen, die Mandelstücke darauflegen und den Bienenstich mindestens 1 Stunde kühlen.' },
    ],
  },
  imageQueries: {
    bienenstich: 'Bienenstich cake',
  },
}
