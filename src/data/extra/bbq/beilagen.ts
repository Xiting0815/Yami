import { bbq } from '../../define'
import { bora, traeger } from '../../device-helpers'
import type { ExtraGroup } from '../types'

/**
 * BBQ · Beilagen (Pit Beans, Coleslaw, Cornbread, Mac & Cheese vom Smoker, Grillmais …). Am selben Tag wie das Fleisch
 * einplanen; Pit Beans laufen unter dem Fleisch im Traeger mit. Regeln: docs/bbq-regeln.md.
 */
export const beilagen: ExtraGroup = {
  recipes: [
    bbq('pit-beans', 'Pit Beans aus dem Smoker',
      { group: 'beilage', time: 180, portions: 4, eat: 4 },
      '2 Dose Weiße Bohnen | 100 g Speckwürfel | 1 Stk Zwiebel | 1 Stk Paprika grün | 150 ml BBQ-Sauce | 30 g Brauner Zucker | 1 EL Senf mittelscharf | 1 EL Apfelessig | 1 TL Paprikapulver geräuchert | Salz | Pfeffer',
      [
        'Die Speckwürfel in einer Pfanne auslassen, Zwiebel und Paprika gewürfelt zugeben und 4 Minuten anschwitzen.',
        'Die Bohnen abgießen und mit Speck, Gemüse, BBQ-Sauce, braunem Zucker, Senf, Apfelessig und geräuchertem Paprikapulver in einer Gusseisenpfanne oder Aluschale mischen.',
        'Offen bei 120 °C im Smoker 2 bis 3 Stunden unter das Fleisch stellen, damit Bratensaft hineintropft; jede Stunde umrühren.',
        'Mit Salz und Pfeffer abschmecken und heiß zum Fleisch servieren.',
      ]),
  ],
  catalog: {},
  products: {},
  nutrition: {},
  grams: {},
  deviceSteps: {
    'pit-beans': [
      {
        text: 'Die Speckwürfel in einer Pfanne auf dem BORA auslassen, Zwiebel und Paprika gewürfelt zugeben und 4 Minuten anschwitzen.',
        settings: [bora('5', { minutes: 4 })],
      },
      {
        text: 'Die weißen Bohnen abgießen und mit Speck, Gemüse, BBQ-Sauce, braunem Zucker, Senf, Apfelessig und geräuchertem Paprikapulver in einer Gusseisenpfanne oder Aluschale mischen.',
      },
      {
        text: 'Offen auf den unteren Rost des Traeger direkt unter das Fleisch stellen, damit Bratensaft hineintropft, und bei 121 °C (250 °F) 2 bis 3 Stunden mitgaren; jede Stunde umrühren.',
        settings: [traeger('Smoken', 250, { minutes: 150, note: 'unterer Rost, unter dem Fleisch' })],
      },
      { text: 'Mit Salz und Pfeffer abschmecken und heiß zum Fleisch servieren.' },
    ],
  },
  imageQueries: { 'pit-beans': 'barbecue baked beans cast iron' },
}
