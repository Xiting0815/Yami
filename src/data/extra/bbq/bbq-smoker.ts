import { bbq, prod } from '../../define'
import { traeger, vakuum, vzug } from '../../device-helpers'
import type { ExtraGroup } from '../types'

/**
 * BBQ · Smoker (Traeger Timberline 850): Low & Slow – Pulled Pork, Ribs, Brisket, Burnt Ends, Chicken …
 * Zutaten für die GANZE Ladung (`bbq()` aus define.ts). Große Stücke: Rest → `leftover` (vakuumiert eingefroren, g),
 * dazu ein kaufbares Gegenstück + Austausch-Gruppe + `preferred`, damit Resteessen (recipes-us.ts) zuerst den Vorrat nehmen.
 * Regeln: docs/bbq-regeln.md, Gerät: docs/geraete/traeger.md, Bausteine: `traeger()`, `vakuum()`, `vzug()` (device-helpers.ts).
 */
export const bbqSmoker: ExtraGroup = {
  recipes: [
    bbq('pulled-pork', 'Pulled Pork vom Traeger',
      {
        group: 'smoker',
        time: 960,
        portions: 10,
        eat: 2,
        leftover: { name: 'Pulled Pork (vakuumiert)', amount: 1500, unit: 'g', portion: 250, shelf: 90 },
        lighter: 'Mageres aus der Mitte zupfen, das Fett aus den Randstücken großzügig wegschneiden und die Sauce separat reichen – spart rund 120 kcal pro Portion.',
      },
      '3000 g Schweinenacken | 2 EL Senf mittelscharf | 70 g BBQ-Rub | 300 ml Apfelsaft | 100 ml Apfelessig | 300 ml BBQ-Sauce',
      [
        'Am Vorabend den Schweinenacken (am Stück, gern mit Knochen) trocken tupfen, dünn mit Senf einstreichen und rundum kräftig mit dem Rub einreiben. Abgedeckt über Nacht im Kühlschrank durchziehen lassen.',
        'Den Smoker mit Hickory- oder Kirschholz auf 107 °C (225 °F) vorheizen. Den Nacken mit der Fettseite nach oben auf den Rost legen und das Thermometer in die dickste Stelle stecken, nicht an den Knochen.',
        'Bei 107 °C etwa 3 Stunden räuchern. Ab der zweiten Stunde stündlich mit einer Mischung aus 200 ml Apfelsaft und dem Apfelessig einsprühen.',
        'Auf 121 °C (250 °F) erhöhen und weitergaren, bis die Kruste (Bark) dunkel und fest ist und die Kerntemperatur bei etwa 74 °C stehen bleibt (der „Stall“).',
        'Den Nacken mit dem restlichen Apfelsaft fest in Butcherpapier oder doppelt Alufolie wickeln (Texas Crutch) und bei 121 °C bis 95 °C Kerntemperatur weitergaren, etwa 3 bis 4 Stunden. Fertig ist er, wenn das Thermometer ohne Widerstand hineingleitet.',
        'Eingewickelt in einer leeren Kühlbox, mit Handtüchern abgedeckt, mindestens 1 Stunde ruhen lassen.',
        'Knochen herausziehen, das Fleisch mit zwei Gabeln zupfen, grobes Fett entfernen und mit dem Bratensaft und 100 ml BBQ-Sauce mischen. Die restliche Sauce dazu reichen.',
        'Was übrig bleibt, abkühlen lassen, in Beutel à 250 g mit etwas Bratensaft füllen, vakuumieren und sofort einfrieren (hält ca. 3 Monate).',
      ]),
  ],
  // Kaufbares Pulled Pork (Kühlregal) – Resteessen nennen „Pulled Pork“, der vakuumierte Rest aus dem Vorrat geht vor
  catalog: { fleisch: ['Pulled Pork'], konserven: ['Apfelsaft'] },
  products: {
    'Pulled Pork': prod(400, 'g', 4.99, 21, 3, 'Pck'),
    Apfelsaft: prod(1000, 'ml', 1.29, 365, 5, 'Flasche'),
  },
  nutrition: {
    'Pulled Pork': [190, 19, 9, 8, 0.5],
    Apfelsaft: [46, 0.1, 0.1, 11, 0.1],
  },
  grams: {},
  substitutes: {
    groups: { 'pulled-pork': ['Pulled Pork', 'Pulled Pork (vakuumiert)'] },
    preferred: { 'Pulled Pork': ['Pulled Pork (vakuumiert)'] },
  },
  deviceSteps: {
    'pulled-pork': [
      {
        text: 'Am Vorabend den Schweinenacken (am Stück, gern mit Knochen) trocken tupfen, dünn mit Senf einstreichen und rundum kräftig mit dem BBQ-Rub einreiben. Abgedeckt über Nacht im Kühlschrank durchziehen lassen.',
      },
      {
        text: 'Den Traeger mit Hickory-Pellets füllen, einschalten und bei geschlossenem Deckel auf 107 °C (225 °F) vorheizen, etwa 15 Minuten.',
        settings: [traeger('Vorheizen', 225, { minutes: 15, note: 'Pellets Hickory, Deckel zu' })],
      },
      {
        text: 'Den Nacken mit der Fettseite nach oben auf den mittleren Rost legen und den Fühler in die dickste Stelle stecken, nicht an den Knochen. Im Super Smoke bei 107 °C (225 °F) 3 Stunden räuchern. Ab der zweiten Stunde stündlich mit einer Mischung aus 200 ml Apfelsaft und dem Apfelessig einsprühen.',
        settings: [traeger('Super Smoke', 225, { minutes: 180 })],
      },
      {
        text: 'Den Traeger auf 121 °C (250 °F) stellen und weitergaren, bis die Kruste (Bark) dunkel und fest ist und die Kerntemperatur bei etwa 74 °C stehen bleibt (der „Stall“) – meist nach weiteren 3 Stunden.',
        settings: [traeger('Smoken', 250, { core: 74 })],
      },
      {
        text: 'Den Nacken mit dem restlichen Apfelsaft (100 ml) fest in Butcherpapier oder doppelt Alufolie wickeln (Texas Crutch), mit dem Fühler zurück in den Traeger legen und bei 121 °C (250 °F) bis 95 °C Kerntemperatur garen, etwa 3 bis 4 Stunden. Fertig ist er, wenn der Fühler ohne Widerstand hineingleitet (probe tender).',
        settings: [traeger('Smoken', 250, { minutes: 210, core: 95 })],
      },
      {
        text: 'Eingewickelt in einer leeren Kühlbox, mit Handtüchern abgedeckt, mindestens 1 Stunde ruhen lassen.',
      },
      {
        text: 'Knochen herausziehen, das Fleisch mit zwei Gabeln zupfen, grobes Fett entfernen und mit dem aufgefangenen Bratensaft und 100 ml BBQ-Sauce mischen. Die restliche Sauce dazu reichen.',
      },
      {
        text: 'Was übrig bleibt, abkühlen lassen, in Beutel à 250 g mit etwas Bratensaft füllen, flach drücken und im Vakuumierer mit Feucht-Modus vakuumieren. Sofort einfrieren (hält ca. 3 Monate). Später den Beutel aufgetaut im CombiSteamer mit Vacuisine bei 70 °C 30 Minuten erwärmen.',
        settings: [vakuum('Vakuumieren feucht', 'Beutel à 250 g'), vzug('steamer', 'Vacuisine', 70, { minutes: 30, note: 'später: Beutel aufwärmen' })],
      },
    ],
  },
  imageQueries: { 'pulled-pork': 'pulled pork smoked pork shoulder' },
}
