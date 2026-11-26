import { r } from './define'
import type { ExtraIngredients } from './extra/types'

/**
 * Spanische Küche (Wischstapel) – Datei 1 von 2: REIS & PAELLA sowie FISCH & MEERESFRÜCHTE
 * (Paella valenciana, Paella de marisco, Arroz negro, Arroz a banda, Fideuà, Arroz al horno, Merluza en salsa verde,
 * Bacalao a la vizcaína, Zarzuela de mariscos, Suquet de peix …). Eintöpfe, Fleisch und Geflügel: src/data/recipes-es2.ts.
 *
 * Anlegen mit `r(id, 'Spanischer Titel (deutsche Erklärung)', 'es', art, minuten, zutaten, schritte, bildsuche)`, Mengen für
 * 2 Portionen. Paella für 2 = Paellapfanne 32 cm auf dem BORA mit Brücke; die große Pfanne (46 cm, Gasgrill, 6+ Portionen)
 * steht als „oder …“-Einstellung (`paella('46', …, { alt: true })`) daneben. Geräte-Schritte: src/data/device-steps/es.ts.
 * Abnehmen: Abendessen ca. 550–750 kcal je Portion; darüber nennt der letzte Schritt „Leichter: …“.
 *
 * Neue Zutaten NUR unten in `esZutaten` (Kategorie, Produkt, Nährwerte, Gewicht …) – sie werden zentral eingetragen
 * (src/data/extra/index.ts). Gemeinsame Spanien-Zutaten (Paellareis, Chorizo, Riesengarnelen mit Kopf TK,
 * Tintenfischringe TK, Tintenfischtinte, Kaninchenkeule, Ñoras getrocknet …): src/data/extra/zutaten-es.ts – nicht neu anlegen.
 * Regeln: docs/spanien-regeln.md (Paella-Regeln!) · Geräte: docs/geraete/paella-plancha.md.
 * Neue Fotos: Zeilen in scripts/fotos-neu-es.md („| id | Bildbeschreibung |“).
 */
export const recipesEs = [
  r('paella-valenciana', 'Paella valenciana (Paella mit Hähnchen, Kaninchen und Bohnen)', 'es', 'haupt', 75,
    '1 Stk Hähnchenschenkel | 150 g Kaninchenkeule | 150 g Grüne Bohnen | 0.5 Dose Weiße Bohnen | 1 Stk Tomate | 1 TL Paprikapulver edelsüß | 0.1 g Safranfäden | 2 Zweig Rosmarin | 2 EL Olivenöl | 140 g Paellareis | Salz',
    [
      'Hähnchenschenkel und Kaninchen mit Knochen in 4 bis 5 cm große Stücke hacken (oder vom Metzger hacken lassen) und salzen. Die grünen Bohnen putzen und in 4 cm lange Stücke brechen (Ersatz für die breiten „Ferraura“), die weißen Bohnen abspülen (Ersatz für die großen Limabohnen „Garrofó“). Die Tomate auf einer Reibe reiben, die Haut bleibt in der Hand. Den Safran in 2 EL warmem Wasser einweichen.',
      'Das Olivenöl in der Paellapfanne (32 cm für 2 Personen) erhitzen und das Fleisch bei mittlerer Hitze 15 Minuten rundum langsam goldbraun anbraten – diese Bräune ist der Geschmack der Paella.',
      'Grüne und weiße Bohnen zugeben und 5 Minuten mitbraten. Alles an den Rand schieben, die geriebene Tomate in die Mitte geben und 3 Minuten einkochen (Sofrito), dann das Paprikapulver nur einige Sekunden darin anrösten – es verbrennt sehr schnell und wird bitter.',
      'Sofort 700 ml Wasser angießen (bis knapp unter die Nieten der Griffe), Safran mit dem Einweichwasser zugeben, aufkochen und 20 Minuten kräftig köcheln lassen, damit eine kräftige Brühe entsteht. Abschmecken: leicht übersalzen, der Reis nimmt das Salz auf.',
      'Den Reis gleichmäßig in die Pfanne streuen, einmal mit dem Löffel verteilen – ab jetzt nicht mehr rühren. 10 Minuten bei starker, dann 8 Minuten bei kleiner Hitze garen, bis die Flüssigkeit aufgesogen ist; die Rosmarinzweige die letzten 5 Minuten obenauf legen.',
      'Für das „Socarrat“ (die begehrte, knusprig angeröstete Reisschicht am Boden) die Hitze zum Schluss 2 Minuten hochdrehen, bis es leise knistert und nach geröstetem Reis duftet – nicht verbrennen lassen.',
      'Vom Feuer nehmen, mit einem sauberen Küchentuch abdecken und 5 Minuten ruhen lassen. Rosmarin entfernen und direkt aus der Pfanne essen. Eine echte Paella valenciana hat weder Chorizo noch Meeresfrüchte, Erbsen oder Zwiebeln. Leichter: die Hähnchenhaut vor dem Anbraten abziehen und nur 1 EL Öl nehmen.',
    ], 'paella valenciana'),
]

/** Neue Zutaten der Datei recipes-es.ts (zentral eingetragen über src/data/extra/index.ts) */
export const esZutaten: ExtraIngredients = {
  catalog: {},
  products: {},
  nutrition: {},
  grams: {},
}
