import { prod, r } from './define'
import type { ExtraIngredients } from './extra/types'

/**
 * Amerikanische Küche – Alltagsgerichte für den Wischstapel (Jambalaya, Gumbo, Sloppy Joe, Mac & Cheese, Resteessen
 * mit Pulled Pork …), alle Mengen für 2 Portionen, `r(id, titel, 'us', art, minuten, zutaten, schritte, bildsuche)`.
 * Alles, was Smoker oder Grill braucht, gehört in die BBQ-Sparte (src/data/extra/bbq/).
 *
 * Geräte-Schritte: src/data/device-steps/us.ts. Neue Zutaten NUR unten in `usZutaten` (Kategorie, Produkt, Nährwerte,
 * Gewicht, ggf. Gewürz) – sie werden zentral eingetragen (src/data/extra/index.ts), catalog.ts/products.ts/nutrition.ts
 * bleiben unberührt. Neue Fotos: ID in scripts/fotos-fehlen.txt + Zeile in scripts/gemini-fehlen.md.
 *
 * Resteessen: Zutat „Pulled Pork“ (kaufbar, bbq-smoker.ts) – liegt vakuumiertes „Pulled Pork (vakuumiert)“ im Vorrat,
 * nimmt Yami das zuerst und zieht solche Gerichte im Stapel nach vorn (Vorrat-Priorisierung).
 */
export const recipesUs = [
  r('jambalaya', 'Jambalaya mit Hähnchen, Wurst und Garnelen', 'us', 'haupt', 50,
    '200 g Hähnchenschenkelfilet | 0.5 Stk Cabanossi | 150 g Garnelen roh TK | 1 EL Sonnenblumenöl | 1 Stk Zwiebel | 1 Stk Paprika grün | 2 Stk Staudensellerie | 2 Zehe Knoblauch | 2 TL Cajun-Gewürz | 1 EL Tomatenmark | 1 Dose Gehackte Tomaten | 120 g Langkornreis | 350 ml Hühnerbrühe | 1 Blatt Lorbeerblatt | 2 Stk Frühlingszwiebel | Salz | Pfeffer',
    [
      'Die Garnelen im Kühlschrank auftauen lassen. Hähnchen in mundgerechte Stücke, die Wurst in Scheiben schneiden. Zwiebel, Paprika und Staudensellerie würfeln (die „Holy Trinity“ der Cajun-Küche), Knoblauch hacken.',
      'Hähnchen und Wurst im Öl in einem breiten Topf kräftig anbraten und herausnehmen.',
      'Zwiebel, Paprika und Sellerie im Bratfett 5 Minuten weich dünsten, Knoblauch, Cajun-Gewürz und Tomatenmark kurz mitrösten.',
      'Tomaten, Brühe, Reis und Lorbeer zugeben, Fleisch und Wurst wieder hinein, aufkochen und zugedeckt bei kleiner Hitze 20 Minuten garen, ohne umzurühren.',
      'Die Garnelen auf den Reis legen, zudecken und 5 Minuten garziehen lassen. Durchmischen, abschmecken und mit Frühlingszwiebelringen bestreuen.',
    ], 'jambalaya'),

  r('pulled-pork-quesadillas', 'Pulled-Pork-Quesadillas mit Cheddar und Mais', 'us', 'haupt', 25,
    '250 g Pulled Pork | 2 Stk Vollkorn-Tortilla | 60 g Cheddar gerieben | 0.5 Dose Mais | 1 Stk Zwiebel rot | 2 EL BBQ-Sauce | 60 g Saure Sahne | 1 Stk Limette | 0.5 Bund Koriander | Salz',
    [
      'Das Pulled Pork (aus dem Vorrat am Vortag im Kühlschrank auftauen) mit der BBQ-Sauce erwärmen. Mais abtropfen lassen, Zwiebel fein würfeln.',
      'Die Tortillas jeweils auf einer Hälfte mit Käse, Pulled Pork, Mais und Zwiebel belegen und zusammenklappen.',
      'In einer großen Pfanne ohne Fett bei mittlerer Hitze von jeder Seite 3 Minuten goldbraun braten, bis der Käse schmilzt. Dazu passt ein grüner Salat.',
      'Saure Sahne mit Limettensaft und Salz verrühren. Quesadillas halbieren, mit Koriander bestreuen und mit dem Limetten-Dip servieren.',
    ], 'quesadilla pulled pork'),
]

/** Neue Zutaten der Küche „Amerikanisch“ (Form wie die Extra-Gruppen, ohne Rezepte) */
export const usZutaten: ExtraIngredients = {
  catalog: { vorrat: ['Cajun-Gewürz'], molkerei: ['Cheddar gerieben'] },
  spices: ['Cajun-Gewürz'],
  products: {
    'Cajun-Gewürz': prod(50, 'g', 1.99, 730, 730, 'Dose'),
    'Cheddar gerieben': prod(150, 'g', 1.89, 30, 7, 'Beutel'),
  },
  nutrition: {
    'Cajun-Gewürz': [300, 12, 8, 50, 20],
    'Cheddar gerieben': [400, 25, 33, 1, 0],
  },
  grams: { 'Cajun-Gewürz': { EL: 7, TL: 2.5 } },
}
