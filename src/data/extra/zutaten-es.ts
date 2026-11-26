import { prod } from '../define'
import type { ExtraIngredients } from './types'

/**
 * Spanien: GEMEINSAME Zutaten, die mehrere Schreib-Gruppen brauchen (Tapas, Paella/Reis, Eintöpfe, Salate, Desserts).
 * Damit parallel schreibende Gruppen nichts doppelt anlegen, stehen Spezialitäten wie Chorizo, Serrano-Schinken,
 * Manchego, Paellareis oder Pimientos de Padrón NUR hier. In Phase 2 ändert diese Datei nur der Koordinator –
 * eine Gruppe, die zusätzlich etwas braucht, legt es in ihrer EIGENEN Datei an (vorher hier und in allen anderen Dateien
 * suchen: `grep -rn "'Name'" src/data`). Bezugsquellen in Deutschland: docs/spanien-regeln.md.
 *
 * Pimentón de la Vera = Zutat 'Paprikapulver geräuchert' (dulce); scharf = zusätzlich 'Paprikapulver rosenscharf' bzw. 'Cayennepfeffer'.
 * Morcilla = 'Blutwurst' · Jamón = 'Serrano-Schinken' · Garrofó/Fabes-Ersatz aus der Dose = 'Weiße Bohnen' · Ferraura = 'Grüne Bohnen'.
 */
export const zutatenEs: ExtraIngredients = {
  catalog: {
    gemuese: ['Pimientos de Padrón'],
    konserven: ['Oliven grün', 'Piquillo-Paprika', 'Paellareis', 'Fabes getrocknet', 'Sherry fino', 'Sherryessig', 'Cidre', 'Tintenfischtinte'],
    molkerei: ['Manchego'],
    fleisch: ['Chorizo', 'Serrano-Schinken', 'Kaninchenkeule', 'Pulpo gekocht'],
    tk: ['Riesengarnelen mit Kopf TK', 'Tintenfischringe TK'],
    vorrat: ['Ñoras getrocknet'],
  },
  products: {
    'Pimientos de Padrón': prod(200, 'g', 2.99, 7, 3, 'Schale'),
    'Oliven grün': prod(200, 'g', 1.49, 365, 14, 'Glas'),
    'Piquillo-Paprika': prod(220, 'g', 2.99, 365, 5, 'Glas'),
    Paellareis: prod(1000, 'g', 3.49, 365, 180, 'Pck'),
    'Fabes getrocknet': prod(500, 'g', 5.99, 365, 180, 'Pck'),
    'Sherry fino': prod(750, 'ml', 7.99, 730, 30, 'Flasche'),
    Sherryessig: prod(250, 'ml', 2.99, 730, 365, 'Flasche'),
    Cidre: prod(750, 'ml', 2.99, 365, 3, 'Flasche'),
    Tintenfischtinte: prod(8, 'g', 2.99, 365, 3, 'Pck'),
    Manchego: prod(150, 'g', 3.49, 60, 14, 'Stück'),
    Chorizo: prod(200, 'g', 2.99, 30, 7, 'Pck'),
    'Serrano-Schinken': prod(100, 'g', 2.49, 30, 5, 'Pck'),
    Kaninchenkeule: prod(500, 'g', 6.99, 3, 1, 'Pck'),
    'Pulpo gekocht': prod(300, 'g', 7.99, 14, 2, 'Pck'),
    'Riesengarnelen mit Kopf TK': prod(800, 'g', 11.99, 180, 180, 'Pck'),
    'Tintenfischringe TK': prod(500, 'g', 4.99, 180, 180, 'Pck'),
    'Ñoras getrocknet': prod(30, 'g', 3.99, 365, 365, 'Tüte'),
  },
  // je 100 g/ml: kcal, Eiweiß, Fett, Kohlenhydrate, Ballaststoffe (BLS bzw. Herstellerangaben, gerundet)
  nutrition: {
    'Pimientos de Padrón': [25, 1.5, 0.3, 3, 2],
    'Oliven grün': [145, 1.2, 15, 0.5, 3],
    'Piquillo-Paprika': [30, 1, 0.3, 5, 1.5],
    Paellareis: [350, 7, 0.6, 78, 1.4],
    'Fabes getrocknet': [300, 22, 1.5, 42, 20],
    'Sherry fino': [120, 0.2, 0, 1.5, 0],
    Sherryessig: [20, 0, 0, 1, 0],
    Cidre: [40, 0, 0, 4, 0],
    Tintenfischtinte: [80, 2, 0.5, 15, 0],
    Manchego: [390, 26, 32, 0.5, 0],
    Chorizo: [455, 24, 38, 2, 0],
    'Serrano-Schinken': [240, 30, 13, 0, 0],
    Kaninchenkeule: [130, 21, 5, 0, 0],
    'Pulpo gekocht': [110, 22, 1.5, 2, 0],
    // Gewicht mit Kopf und Schale: nur gut die Hälfte ist Fleisch
    'Riesengarnelen mit Kopf TK': [55, 12, 0.7, 0.3, 0],
    'Tintenfischringe TK': [76, 15, 1, 2, 0],
    'Ñoras getrocknet': [290, 11, 6, 50, 25],
  },
  grams: {
    'Pimientos de Padrón': { Stk: 8 },
    'Oliven grün': { Stk: 4 },
    'Piquillo-Paprika': { Stk: 20 },
    Chorizo: { Scheibe: 8 },
    'Serrano-Schinken': { Scheibe: 15 },
    Kaninchenkeule: { Stk: 220 },
    'Riesengarnelen mit Kopf TK': { Stk: 40 },
    'Ñoras getrocknet': { Stk: 4 },
  },
  convert: {
    'Oliven grün': { Stk: 4 },
    'Piquillo-Paprika': { Stk: 20 },
    Chorizo: { Scheibe: 8 },
    'Serrano-Schinken': { Scheibe: 15 },
    Kaninchenkeule: { Stk: 220 },
    'Riesengarnelen mit Kopf TK': { Stk: 40 },
    'Pimientos de Padrón': { Stk: 8 },
  },
  season: { 'Pimientos de Padrón': [6, 7, 8, 9, 10] },
  substitutes: {
    // Bomba/Calasparra/Senia → in Deutschland notfalls Risottoreis (rund, nimmt viel Flüssigkeit auf)
    groups: { paellareis: ['Paellareis', 'Risottoreis'] },
  },
  nonVeg: ['Tintenfischtinte', 'Riesengarnelen mit Kopf TK', 'Tintenfischringe TK'],
  spices: ['Ñoras getrocknet'],
}
