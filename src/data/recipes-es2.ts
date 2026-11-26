import { r } from './define'
import type { ExtraIngredients } from './extra/types'

/**
 * Spanische Küche (Wischstapel) – Datei 2 von 2: EINTÖPFE, FLEISCH & GEFLÜGEL
 * (Fabada asturiana, Cocido madrileño, Lentejas con chorizo, Pollo al ajillo, Pollo en pepitoria, Albóndigas en salsa
 * als Hauptgericht, Carrillada al Pedro Ximénez, Callos, Pisto manchego mit Ei, Marmitako …). Reis & Fisch: recipes-es.ts.
 *
 * Anlegen mit `r(id, 'Spanischer Titel (deutsche Erklärung)', 'es', art, minuten, zutaten, schritte, bildsuche)`, Mengen für
 * 2 Portionen, Einweichzeit über Nacht im ersten Schritt nennen (nicht in `minuten`). Geräte-Schritte: src/data/device-steps/es2.ts.
 * Abnehmen: Abendessen ca. 550–750 kcal je Portion; darüber nennt der letzte Schritt „Leichter: …“.
 *
 * Neue Zutaten NUR unten in `es2Zutaten` – zentral eingetragen über src/data/extra/index.ts. Gemeinsame Spanien-Zutaten
 * (Chorizo, Serrano-Schinken, Fabes getrocknet, Sherry fino, Kaninchenkeule …): src/data/extra/zutaten-es.ts – nicht neu anlegen.
 * Regeln: docs/spanien-regeln.md. Neue Fotos: Zeilen in scripts/fotos-neu-es2.md („| id | Bildbeschreibung |“).
 */
export const recipesEs2 = [
  r('fabada-asturiana', 'Fabada asturiana (asturischer Bohneneintopf mit Chorizo und Morcilla)', 'es', 'eintopf', 200,
    '160 g Fabes getrocknet | 70 g Chorizo | 60 g Blutwurst | 60 g Schweinebauch geräuchert | 1 Stk Zwiebel | 2 Zehe Knoblauch | 1 Blatt Lorbeerblatt | 0.05 g Safranfäden | 1 TL Paprikapulver edelsüß | Salz',
    [
      'Die Fabes (große, buttrige weiße Bohnen aus Asturien) am Vortag in reichlich kaltem Wasser 12 Stunden einweichen. Den geräucherten Schweinebauch ebenfalls 1 Stunde wässern, damit er nicht zu salzig ist.',
      'Die Bohnen abgießen und in einen breiten Topf geben, knapp mit kaltem Wasser bedecken. Die halbierte Zwiebel, Knoblauch, Lorbeer sowie Chorizo, Blutwurst (Ersatz für die asturische Morcilla) und Schweinebauch im Ganzen darauflegen – dieses „Compango“ gibt den Geschmack. Langsam aufkochen und den Schaum abschöpfen.',
      'Safran und Paprikapulver in etwas Kochwasser verrühren und zugeben. Den Eintopf zugedeckt 2,5 Stunden ganz leise simmern lassen. Nicht umrühren – die Bohnen platzen sonst –, nur ab und zu den Topf schwenken. Zwei- bis dreimal einen Schuss kaltes Wasser zugeben („asustar las fabes“, die Bohnen erschrecken): so bleibt die Haut zart und ganz.',
      'Wenn die Bohnen butterweich sind, Wurst und Fleisch herausnehmen und in Scheiben schneiden, Zwiebel und Lorbeer entfernen. Erst jetzt salzen, die Wurst gibt viel Salz ab.',
      'Den Eintopf 15 Minuten ruhen lassen, damit er sämig wird. In tiefen Tellern servieren und das Compango obenauf legen oder getrennt reichen. Leichter: Blutwurst weglassen und den Schweinebauch durch mageren Kochschinken ersetzen – die Fabes und die Chorizo tragen den Geschmack.',
    ], 'fabada asturiana'),
]

/** Neue Zutaten der Datei recipes-es2.ts (zentral eingetragen über src/data/extra/index.ts) */
export const es2Zutaten: ExtraIngredients = {
  catalog: {},
  products: {},
  nutrition: {},
  grams: {},
}
