import { backen, prod } from '../../define'
import { bora } from '../../device-helpers'
import type { ExtraGroup } from '../types'

/**
 * BBQ · Rubs & Saucen (Grundrezepte): selbstgemacht auf Vorrat, kommen bei „Fertig gekocht“ in den Vorrat und werden in
 * BBQ-/Burger-Rezepten zuerst genommen (`substitutes.preferred`); das Fertigprodukt bleibt Ersatz (gleiche Austausch-Gruppe).
 * Anlegen mit `backen('grundrezept', id, titel, { cuisine: 'us', bbq: 'rub', time, yields: { …, cat } }, zutaten, schritte)`.
 * Regeln: docs/bbq-regeln.md. Neue Gewürze hier unter `spices` (+ catalog.vorrat, products, nutrition, grams).
 */
export const rubsSaucen: ExtraGroup = {
  recipes: [
    backen('grundrezept', 'kc-bbq-sauce', 'Kansas-City-BBQ-Sauce',
      {
        cuisine: 'us',
        bbq: 'rub',
        time: 35,
        yields: { name: 'BBQ-Sauce selbstgemacht', amount: 600, unit: 'ml', shelf: 28, store: 'im Kühlschrank (Glas mit Deckel)', frozen: 90, cat: 'vorrat' },
      },
      '20 g Butter | 1 Stk Zwiebel | 2 Zehe Knoblauch | 400 ml Tomatenketchup | 80 g Brauner Zucker | 3 EL Zuckerrübensirup | 80 ml Apfelessig | 2 EL Worcestersauce | 1 EL Senf mittelscharf | 1 EL Paprikapulver geräuchert | 1 TL Knoblauchpulver | 1 TL Zwiebelpulver | 0.5 TL Cayennepfeffer | Pfeffer | Salz',
      [
        'Zwiebel und Knoblauch sehr fein würfeln und in der Butter im Topf bei kleiner Hitze 5 Minuten glasig dünsten.',
        'Tomatenketchup, braunen Zucker, Zuckerrübensirup, Apfelessig, Worcestersauce, Senf und 100 ml Wasser einrühren. Mit geräuchertem Paprikapulver, Knoblauchpulver, Zwiebelpulver, Cayennepfeffer und reichlich Pfeffer würzen.',
        'Aufkochen und offen bei kleiner Hitze 20 bis 25 Minuten dicklich einköcheln lassen, dabei oft umrühren, weil die Sauce leicht ansetzt. Mit Salz, Essig und Zucker süß-sauer-rauchig abschmecken.',
        'Für eine glatte Sauce pürieren, heiß in saubere Gläser füllen, verschließen und abkühlen lassen. Im Kühlschrank hält sie ca. 4 Wochen, eingefroren ca. 3 Monate.',
      ]),

    backen('grundrezept', 'memphis-rub', 'Memphis-Rub (Allround-Rub für Pork & Ribs)',
      {
        cuisine: 'us',
        bbq: 'rub',
        time: 10,
        yields: { name: 'BBQ-Rub selbstgemacht', amount: 160, unit: 'g', shelf: 180, store: 'luftdicht und dunkel im Schraubglas', cat: 'vorrat' },
      },
      '60 g Brauner Zucker | 4 EL Paprikapulver geräuchert | 2 EL Paprikapulver edelsüß | 2 EL Salz | 1 EL Pfeffer schwarz grob | 1 EL Knoblauchpulver | 1 EL Zwiebelpulver | 1 TL Kreuzkümmel | 1 TL Cayennepfeffer',
      [
        'Den braunen Zucker in einer Schüssel mit den Fingern zerreiben, bis keine Klümpchen mehr da sind.',
        'Geräuchertes und edelsüßes Paprikapulver, Salz, groben Pfeffer, Knoblauchpulver, Zwiebelpulver, Kreuzkümmel und Cayennepfeffer zugeben und gründlich vermischen.',
        'In ein sauberes, trockenes Schraubglas füllen und dunkel lagern (hält ca. 6 Monate). Faustregel: 2 bis 3 EL Rub je Kilo Fleisch, für Pulled Pork über Nacht einziehen lassen.',
      ]),
  ],
  catalog: {
    vorrat: ['BBQ-Rub', 'Paprikapulver geräuchert', 'Knoblauchpulver', 'Zwiebelpulver', 'Cayennepfeffer'],
  },
  spices: ['Paprikapulver geräuchert', 'Knoblauchpulver', 'Zwiebelpulver', 'Cayennepfeffer'],
  products: {
    'BBQ-Rub': prod(100, 'g', 2.99, 730, 365, 'Dose'),
    'Paprikapulver geräuchert': prod(50, 'g', 1.79, 730, 730, 'Dose'),
    Knoblauchpulver: prod(60, 'g', 1.49, 730, 730, 'Dose'),
    Zwiebelpulver: prod(50, 'g', 1.49, 730, 730, 'Dose'),
    Cayennepfeffer: prod(40, 'g', 1.69, 730, 730, 'Dose'),
  },
  nutrition: {
    'BBQ-Rub': [290, 8, 5, 52, 12],
    'Paprikapulver geräuchert': [330, 14, 13, 20, 35],
    Knoblauchpulver: [330, 17, 0.7, 73, 9],
    Zwiebelpulver: [340, 10, 1, 79, 15],
    Cayennepfeffer: [320, 12, 17, 57, 27],
  },
  grams: {
    'BBQ-Rub': { EL: 9, TL: 3 },
    'Paprikapulver geräuchert': { EL: 7, TL: 2.5 },
    Knoblauchpulver: { EL: 9, TL: 3 },
    Zwiebelpulver: { EL: 7, TL: 2.5 },
    Cayennepfeffer: { EL: 6, TL: 2 },
  },
  // Selbstgemachte Sauce/Rub ersetzt die gekaufte (gleiche Einheit: ml bzw. g) und wird zuerst genommen
  substitutes: {
    groups: { 'bbq-sauce': ['BBQ-Sauce', 'BBQ-Sauce selbstgemacht'], 'bbq-rub': ['BBQ-Rub', 'BBQ-Rub selbstgemacht'] },
    preferred: { 'BBQ-Sauce': ['BBQ-Sauce selbstgemacht'], 'BBQ-Rub': ['BBQ-Rub selbstgemacht'] },
  },
  deviceSteps: {
    'kc-bbq-sauce': [
      { text: 'Zwiebel und Knoblauch sehr fein würfeln und in der Butter im Topf auf dem BORA 5 Minuten glasig dünsten.', settings: [bora('3', { minutes: 5 })] },
      {
        text: 'Tomatenketchup, braunen Zucker, Zuckerrübensirup, Apfelessig, Worcestersauce, Senf und 100 ml Wasser einrühren. Mit geräuchertem Paprikapulver, Knoblauchpulver, Zwiebelpulver, Cayennepfeffer und reichlich Pfeffer würzen.',
      },
      {
        text: 'Auf Stufe 7 aufkochen, dann offen 20 bis 25 Minuten dicklich einköcheln lassen und oft umrühren, weil die Sauce leicht ansetzt. Mit Salz, Essig und Zucker süß-sauer-rauchig abschmecken.',
        settings: [bora('7', { note: 'aufkochen' }), bora('3', { minutes: 25 })],
      },
      { text: 'Für eine glatte Sauce pürieren, heiß in saubere Gläser füllen, verschließen und abkühlen lassen. Im Kühlschrank hält sie ca. 4 Wochen, eingefroren ca. 3 Monate.' },
    ],
  },
  imageQueries: { 'kc-bbq-sauce': 'barbecue sauce jar', 'memphis-rub': 'barbecue dry rub spices' },
}
