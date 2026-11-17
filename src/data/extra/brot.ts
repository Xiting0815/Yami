// Backen & Desserts – Gruppe „Brot & Brötchen“ (deutsch + italienisch, Sauerteig, Focaccia).
// Regeln: docs/backen-regeln.md. Nur diese Datei bearbeiten.
import { backen, prod } from '../define'
import type { ExtraGroup } from './types'

export const brot: ExtraGroup = {
  recipes: [
    // Grundrezept: Ergebnis „Anstellgut“ ist Zutat der Sauerteigbrote
    backen('grundrezept', 'sauerteig-anstellgut', 'Sauerteig ansetzen (Anstellgut)',
      {
        time: 7200,
        yields: { name: 'Anstellgut', amount: 200, unit: 'g', shelf: 7, store: 'im Kühlschrank (Glas, Deckel locker)' },
      },
      '250 g Roggenmehl',
      [
        'Tag 1: 50 g Roggenmehl mit 50 ml lauwarmem Wasser (ca. 30 °C) in einem großen Schraubglas glatt rühren, den Deckel nur auflegen und an einem warmen Ort (24–28 °C) 24 Stunden stehen lassen.',
        'Tag 2 bis 4: Jeden Tag 50 g Roggenmehl und 50 ml lauwarmes Wasser unterrühren und wieder 24 Stunden warm stehen lassen. Ab Tag 3 riecht es säuerlich und bildet Bläschen.',
        'Tag 5: Noch einmal 50 g Roggenmehl und 50 ml Wasser unterrühren. Der Sauerteig ist aktiv, wenn er sich danach in 6–8 Stunden etwa verdoppelt – sonst noch 1–2 Tage weiterfüttern.',
        'Rund 200 g als Anstellgut im Glas in den Kühlschrank stellen (hält ca. 1 Woche), den Rest wegwerfen. Vor jedem Backen mit je 50 g Roggenmehl und 50 ml Wasser auffrischen.',
      ]),

    backen('brot', 'bauernbrot-sauerteig', 'Bauernbrot mit Sauerteig',
      {
        time: 1140,
        yields: { name: 'Bauernbrot selbstgebacken', amount: 1000, unit: 'g', shelf: 5, store: 'in Papier oder im Brotkasten', frozen: 90 },
        lighter: 'Dünn schneiden (35 g statt 50 g pro Scheibe) und mit Kräuterquark statt Butter belegen – spart pro Scheibe rund 60 kcal.',
      },
      '30 g Anstellgut | 450 g Roggenmehl | 220 g Weizenmehl | 14 g Salz | 5 g Hefe frisch | 1 TL Kümmel',
      [
        'Am Vorabend für den Sauerteig das Anstellgut mit 250 g vom Roggenmehl und 250 ml lauwarmem Wasser (ca. 35 °C) verrühren und abgedeckt 12–16 Stunden bei Raumtemperatur reifen lassen.',
        'Am Backtag den Sauerteig mit dem restlichen Roggenmehl, dem Weizenmehl (am besten Type 1050), Salz, Kümmel, der zerbröselten Hefe frisch und 220 ml lauwarmem Wasser 8–10 Minuten langsam zu einem weichen, klebrigen Teig kneten.',
        'Den Teig abgedeckt 30 Minuten ruhen lassen, dann mit nassen Händen rund formen, mit der Naht nach oben in ein bemehltes Gärkörbchen legen und 60–75 Minuten gehen lassen, bis die Oberfläche feine Risse zeigt.',
        'Den Backofen mit einem Blech und einer ofenfesten Schale auf dem Boden auf 250 °C vorheizen. Den Laib auf Backpapier stürzen und mit Mehl bestäuben.',
        'Das Brot auf das heiße Blech ziehen, eine Tasse Wasser in die Schale gießen, sofort schließen und 10 Minuten anbacken.',
        'Den Dampf ablassen, auf 200 °C herunterschalten und weitere 45–50 Minuten backen, bis das Brot beim Klopfen auf die Unterseite hohl klingt.',
        'Auf einem Gitter mindestens 3 Stunden auskühlen lassen, erst dann anschneiden.',
      ]),
  ],
  catalog: {
    vorrat: ['Roggenmehl'],
  },
  products: {
    Roggenmehl: prod(1000, 'g', 1.19, 365, 180, 'Pck'),
  },
  nutrition: {
    Roggenmehl: [324, 8.3, 1.4, 68, 8],
    // Anstellgut = Roggenmehl und Wasser 1:1 (die automatische Berechnung kennt das Wasser nicht)
    Anstellgut: [162, 4.2, 0.7, 34, 4],
  },
  grams: {
    Roggenmehl: { EL: 10 },
  },
  convert: {
    Roggenmehl: { EL: 10 },
  },
  substitutes: {
    // selbstgebackenes Brot (im Vorrat in Scheiben à 50 g) deckt Vollkornbrot, z. B. in den Frühstücksboxen – und wird zuerst genommen
    groups: { 'brot-scheibe': ['Bauernbrot selbstgebacken'] },
    preferred: { Vollkornbrot: ['Bauernbrot selbstgebacken'] },
  },
  deviceSteps: {
    // Anstellgut braucht kein Gerät (nur Wärme) – daher keine Geräte-Schritte
    'bauernbrot-sauerteig': [
      { text: 'Am Vorabend für den Sauerteig das Anstellgut mit 250 g vom Roggenmehl und 250 ml lauwarmem Wasser (ca. 35 °C) verrühren und abgedeckt 12–16 Stunden bei Raumtemperatur reifen lassen.' },
      { text: 'Am Backtag den Sauerteig mit dem restlichen Roggenmehl, dem Weizenmehl (am besten Type 1050), Salz, Kümmel, der zerbröselten Hefe frisch und 220 ml lauwarmem Wasser 8–10 Minuten langsam zu einem weichen, klebrigen Teig kneten.' },
      { text: 'Den Teig abgedeckt 30 Minuten ruhen lassen, dann mit nassen Händen rund formen, mit der Naht nach oben in ein bemehltes Gärkörbchen legen und 60–75 Minuten bei Raumtemperatur gehen lassen, bis die Oberfläche feine Risse zeigt.' },
      {
        text: 'Den Wasserbehälter füllen und den CombiSteamer mit dem Kuchenblech auf Ebene 2 vorheizen. Den Laib auf Backpapier stürzen und mit Mehl bestäuben.',
        settings: [{ device: 'steamer', mode: 'Heißluft mit Beschwaden', temp: 230, note: 'vorheizen, Kuchenblech Ebene 2' }],
      },
      {
        text: 'Das Brot mit dem Backpapier auf das heiße Blech ziehen und 10 Minuten mit Dampf anbacken – die Tür dabei geschlossen lassen.',
        settings: [{ device: 'steamer', mode: 'Heißluft mit Beschwaden', temp: 230, minutes: 10, note: 'Ebene 2' }],
      },
      {
        text: 'Auf Heißluft ohne Dampf umschalten und weitere 45 Minuten backen, bis das Brot beim Klopfen auf die Unterseite hohl klingt.',
        settings: [{ device: 'steamer', mode: 'Heißluft', temp: 200, minutes: 45, note: 'trocken, für die Kruste' }],
      },
      { text: 'Auf einem Gitter mindestens 3 Stunden auskühlen lassen, erst dann anschneiden.' },
    ],
  },
  imageQueries: {
    'sauerteig-anstellgut': 'sourdough starter jar',
    'bauernbrot-sauerteig': 'Bauernbrot sourdough rye bread loaf',
  },
}
