import type { DeviceStep } from '../../types'
import { gasgrill, paella } from '../device-helpers'

/**
 * Geräte-Schritte (Rezept-ID → Schritte), Gruppe: es (Spanisch, Reis & Paella, Fisch & Meeresfrüchte – src/data/recipes-es.ts).
 * Paella für 2: `paella('32', …)` auf dem BORA mit Brücke; die große Pfanne für Gäste als „oder …“: `paella('46', …, { alt: true })`
 * nach einem `{ ...gasgrill('Vorheizen', …), alt: true }`. Nach der Reiszugabe nie „rühren“ schreiben (check-data meldet es).
 * Stil siehe docs/geraete/regeln.md, Geräte docs/geraete/paella-plancha.md.
 */
export const DEVICE_STEPS: Record<string, DeviceStep[]> = {
  'paella-valenciana': [
    {
      text: 'Hähnchenschenkel und Kaninchen mit Knochen in 4 bis 5 cm große Stücke hacken (oder vom Metzger hacken lassen) und salzen. Die grünen Bohnen putzen und in 4 cm lange Stücke brechen (Ersatz für die breiten „Ferraura“), die weißen Bohnen abspülen (Ersatz für die großen Limabohnen „Garrofó“). Die Tomate auf einer Reibe reiben, die Haut bleibt in der Hand. Den Safran in 2 EL warmem Wasser einweichen.',
    },
    {
      text: 'Die Paellapfanne (32 cm) auf den BORA setzen und beide Kochzonen mit der Brücke koppeln – für die große Runde stattdessen den Gasgrill vorheizen und dann den Deckel öffnen. Das Olivenöl erhitzen und das Fleisch 15 Minuten rundum langsam goldbraun anbraten – diese Bräune ist der Geschmack der Paella.',
      settings: [
        paella('32', 'Anbraten', { level: '6', minutes: 15 }),
        { ...gasgrill('Vorheizen', 260, 'hoch', 'alle', { minutes: 10, note: 'große Pfanne 46 cm: Deckel zu, danach offen' }), alt: true },
        paella('46', 'Anbraten', { level: 'mittel', minutes: 15, alt: true, note: 'große Runde 6–8 Personen: alle Mengen ×3' }),
      ],
    },
    {
      text: 'Grüne und weiße Bohnen zugeben und 5 Minuten mitbraten. Alles an den Rand schieben, die geriebene Tomate in die Mitte geben und 3 Minuten einkochen (Sofrito), dann das Paprikapulver nur einige Sekunden darin anrösten – es verbrennt sehr schnell und wird bitter.',
      settings: [paella('32', 'Sofrito', { level: '5', minutes: 8 }), paella('46', 'Sofrito', { level: 'mittel', minutes: 8, alt: true })],
    },
    {
      text: 'Sofort 700 ml Wasser angießen (bis knapp unter die Nieten der Griffe; große Pfanne ca. 2,1 Liter), Safran mit dem Einweichwasser zugeben, aufkochen und 20 Minuten kräftig köcheln lassen, damit eine kräftige Brühe entsteht. Abschmecken: leicht übersalzen, der Reis nimmt das Salz auf.',
      settings: [paella('32', 'Köcheln', { level: '8', minutes: 20 }), paella('46', 'Köcheln', { level: 'hoch', minutes: 20, alt: true })],
    },
    {
      text: 'Den Reis gleichmäßig in die Pfanne streuen, einmal mit dem Löffel verteilen – ab jetzt nicht mehr rühren. 10 Minuten bei starker, dann 8 Minuten bei kleiner Hitze garen, bis die Flüssigkeit aufgesogen ist; die Rosmarinzweige die letzten 5 Minuten obenauf legen.',
      settings: [
        paella('32', 'Köcheln', { level: '8', minutes: 10 }),
        paella('32', 'Köcheln', { level: '4', minutes: 8 }),
        paella('46', 'Köcheln', { level: 'hoch', minutes: 10, alt: true }),
        paella('46', 'Köcheln', { level: 'niedrig', minutes: 8, alt: true, note: 'Pfanne alle 2 Min. eine Vierteldrehung, damit der Rand mitgart' }),
      ],
    },
    {
      text: 'Für das „Socarrat“ (die begehrte, knusprig angeröstete Reisschicht am Boden) die Hitze zum Schluss 2 Minuten hochdrehen, bis es leise knistert und nach geröstetem Reis duftet – nicht verbrennen lassen.',
      settings: [paella('32', 'Socarrat', { level: '9', minutes: 2 }), paella('46', 'Socarrat', { level: 'hoch', minutes: 2, alt: true })],
    },
    {
      text: 'Vom Feuer nehmen, mit einem sauberen Küchentuch abdecken und 5 Minuten ruhen lassen. Rosmarin entfernen und direkt aus der Pfanne essen. Eine echte Paella valenciana hat weder Chorizo noch Meeresfrüchte, Erbsen oder Zwiebeln. Leichter: die Hähnchenhaut vor dem Anbraten abziehen und nur 1 EL Öl nehmen.',
      settings: [paella('32', 'Ruhen', { minutes: 5 }), paella('46', 'Ruhen', { minutes: 5, alt: true })],
    },
  ],
}
