// Backen & Desserts – Gruppe „Brot & Brötchen“ (deutsch + italienisch, Sauerteig, Focaccia).
// Regeln: docs/backen-regeln.md. Nur diese Datei bearbeiten.
import { backen, prod } from '../define'
import type { DeviceSetting, DeviceStep } from '../../types'
import type { ExtraGroup } from './types'

/** Geräte-Schritt: Text + optionale Einstellungen */
const st = (text: string, ...settings: DeviceSetting[]): DeviceStep => (settings.length ? { text, settings } : { text })
const steamer = (mode: string, temp: number, minutes?: number, note?: string): DeviceSetting => ({ device: 'steamer', mode, temp, ...(minutes ? { minutes } : {}), ...(note ? { note } : {}) }) as DeviceSetting
const gare = (minutes: number, note = 'Schüssel auf den Gitterrost'): DeviceSetting => steamer('Profi-Backen Aufgehen lassen', 35, minutes, note)
const preheat = (temp = 230): DeviceSetting => steamer('Heißluft mit Beschwaden', temp, undefined, 'vorheizen, Kuchenblech Ebene 2')

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

    // ---------- Dinkelvollkornbrot (Kastenform, Hefe) ----------
    backen('brot', 'dinkelvollkornbrot', 'Dinkelvollkornbrot',
      {
        time: 270,
        yields: { name: 'Dinkelvollkornbrot selbstgebacken', amount: 1100, unit: 'g', shelf: 5, store: 'in Papier oder im Brotkasten', frozen: 90 },
        lighter: 'Dünn schneiden (35 g statt 50 g pro Scheibe) und mit Magerquark und Radieschen statt Butter belegen – spart pro Scheibe rund 60 kcal.',
      },
      '500 g Dinkelvollkornmehl | 250 g Dinkelmehl | 15 g Salz | 21 g Hefe frisch | 1 EL Honig | 40 g Leinsamen geschrotet',
      [
        'Dinkelvollkornmehl, Dinkelmehl, Salz und Leinsamen in einer Schüssel mischen. Die Hefe frisch mit dem Honig in 520 ml lauwarmem Wasser auflösen, zum Mehl geben und 8 Minuten zu einem weichen Teig kneten.',
        'Den Teig abgedeckt 20 Minuten quellen lassen, kurz durchkneten und mit einer nassen Hand in eine mit Backpapier ausgelegte Kastenform (30 cm) streichen. Die Oberfläche glatt verstreichen.',
        'Die Form abgedeckt 45–60 Minuten bei Raumtemperatur gehen lassen, bis der Teig fast bis zum Rand steigt.',
        'Den Backofen mit einem Blech und einer ofenfesten Schale auf dem Boden auf 230 °C vorheizen. Die Form auf das heiße Blech stellen, eine Tasse Wasser in die Schale gießen, sofort schließen und 10 Minuten anbacken.',
        'Den Dampf ablassen, auf 190 °C herunterschalten und 45 Minuten backen. Das Brot aus der Form nehmen: Es klingt beim Klopfen auf die Unterseite hohl.',
        'Auf einem Gitter mindestens 2 Stunden auskühlen lassen, erst dann anschneiden.',
      ]),

    // ---------- Roggenmischbrot mit Sauerteig (Kastenform) ----------
    backen('brot', 'roggenmischbrot-sauerteig', 'Roggenmischbrot mit Sauerteig',
      {
        time: 1080,
        yields: { name: 'Roggenmischbrot selbstgebacken', amount: 1100, unit: 'g', shelf: 6, store: 'in Papier oder im Brotkasten', frozen: 90 },
        lighter: 'Scheiben dünn schneiden (35 g statt 50 g) und mit Frischkäse light und Gurke belegen – spart pro Scheibe rund 55 kcal.',
      },
      '40 g Anstellgut | 350 g Roggenmehl | 350 g Weizenmehl | 15 g Salz | 4 g Hefe frisch | 1 TL Kümmel',
      [
        'Am Vorabend für den Sauerteig das Anstellgut mit 250 g vom Roggenmehl und 250 ml lauwarmem Wasser (ca. 35 °C) verrühren und abgedeckt 12–16 Stunden bei Raumtemperatur reifen lassen.',
        'Am Backtag den Sauerteig mit dem restlichen Roggenmehl, dem Weizenmehl, Salz, Kümmel, der zerbröselten Hefe frisch und 300 ml lauwarmem Wasser 8 Minuten zu einem weichen, leicht klebrigen Teig kneten.',
        'Den Teig 20 Minuten abgedeckt ruhen lassen. Eine Kastenform (30 cm) mit Backpapier auslegen, den Teig mit nasser Hand einfüllen, glatt streichen und mit etwas Mehl bestäuben.',
        'Die Form abgedeckt 60–75 Minuten bei Raumtemperatur gehen lassen, bis der Teig deutlich steigt und die Oberfläche feine Risse zeigt.',
        'Den Backofen mit einem Blech und einer ofenfesten Schale auf dem Boden auf 230 °C vorheizen. Die Form auf das Blech stellen, eine Tasse Wasser in die Schale gießen, schließen und 10 Minuten anbacken.',
        'Den Dampf ablassen, auf 200 °C herunterschalten und 40–45 Minuten backen, bis das Brot beim Klopfen auf die Unterseite hohl klingt.',
        'Auf einem Gitter mindestens 3 Stunden auskühlen lassen, erst dann anschneiden.',
      ]),

    // ---------- Dinkelbrötchen über Nacht (kalte Gare) ----------
    backen('brot', 'dinkelbroetchen-ueber-nacht', 'Dinkelbrötchen über Nacht',
      {
        time: 900,
        yields: { name: 'Dinkelbrötchen selbstgebacken', amount: 10, unit: 'Stk', shelf: 2, store: 'in einer Papiertüte bei Raumtemperatur', frozen: 90 },
        lighter: 'Aus dem Teig 12 statt 10 kleinere Brötchen formen – spart rund 35 kcal pro Brötchen.',
      },
      '600 g Dinkelmehl | 12 g Salz | 4 g Hefe frisch | 1 TL Honig',
      [
        'Am Abend die Hefe frisch mit dem Honig in 400 ml kaltem Wasser auflösen, mit Dinkelmehl und Salz 6 Minuten kurz zu einem weichen Teig kneten (Dinkel nicht überkneten). Eine Stunde bei Raumtemperatur ruhen lassen.',
        'Die Schüssel abdecken und den Teig über Nacht 10–14 Stunden im Kühlschrank reifen lassen (kalte Gare).',
        'Am Morgen den kalten Teig auf eine bemehlte Fläche stürzen, in 10 Stücke (je ca. 90 g) teilen und rund wirken. Mit Abstand auf ein mit Backpapier belegtes Blech setzen, bemehlen und 20–30 Minuten bei Raumtemperatur akklimatisieren lassen.',
        'Den Backofen mit einer ofenfesten Schale auf dem Boden auf 220 °C vorheizen, die Brötchen mit einem scharfen Messer einschneiden, eine Tasse Wasser in die Schale gießen und 12 Minuten backen.',
        'Den Dampf ablassen, auf 190 °C herunterschalten und weitere 8–10 Minuten backen, bis die Brötchen goldbraun sind und hohl klingen. Auf einem Gitter auskühlen lassen.',
      ]),

    // ---------- Brioche-Burger-Buns ----------
    backen('brot', 'brioche-burger-buns', 'Brioche-Burger-Buns',
      {
        time: 180,
        yields: { name: 'Burger-Buns selbstgebacken', amount: 8, unit: 'Stk', shelf: 3, store: 'in einer Papiertüte bei Raumtemperatur', frozen: 90 },
        lighter: 'Die Butter auf 30 g und den Zucker auf 25 g verringern – spart rund 25 kcal pro Bun.',
      },
      '400 g Weizenmehl | 7 g Salz | 40 g Zucker | 20 g Hefe frisch | 170 ml Milch | 2 Stk Ei | 50 g Butter | 2 TL Sesam',
      [
        'Die Hefe frisch mit dem Zucker in der lauwarmen Milch auflösen. Mit Weizenmehl, Salz, einem Ei und der weichen Butter 10 Minuten zu einem weichen, glänzenden Teig kneten, der sich vom Schüsselrand löst.',
        'Den Teig in der Schüssel abdecken und 60 Minuten gehen lassen, bis er sich verdoppelt hat.',
        'Den Teig in 8 Stücke (je ca. 90 g) teilen, rund wirken und mit Abstand auf ein mit Backpapier belegtes Blech setzen. Mit der Handfläche auf ca. 8 cm flach drücken und abgedeckt 40 Minuten gehen lassen.',
        'Den Backofen auf 180 °C vorheizen. Das zweite Ei verquirlen, die Buns damit bestreichen und mit Sesam bestreuen.',
        'Die Buns 15–18 Minuten backen, bis sie goldbraun sind. Auf einem Gitter auskühlen lassen und vor dem Belegen waagerecht aufschneiden.',
      ]),

    // ---------- Sonntagsbrötchen / Kaiserbrötchen ----------
    backen('brot', 'sonntagsbroetchen-kaiser', 'Sonntagsbrötchen (Kaiserbrötchen)',
      {
        time: 150,
        yields: { name: 'Kaiserbrötchen selbstgebacken', amount: 10, unit: 'Stk', shelf: 2, store: 'in einer Papiertüte bei Raumtemperatur', frozen: 90 },
        lighter: 'Butter weglassen und die Milch durch Wasser ersetzen – spart rund 35 kcal pro Brötchen.',
      },
      '500 g Weizenmehl | 10 g Salz | 21 g Hefe frisch | 1 TL Zucker | 30 g Butter | 250 ml Milch | 2 TL Sesam',
      [
        'Die Hefe frisch mit dem Zucker in der lauwarmen Milch und 50 ml lauwarmem Wasser auflösen. Mit Weizenmehl, Salz und der weichen Butter 8 Minuten zu einem glatten, geschmeidigen Teig kneten.',
        'Den Teig abgedeckt 30–40 Minuten bei Raumtemperatur gehen lassen, bis er sich fast verdoppelt hat.',
        'Den Teig in 10 Stücke (je ca. 80 g) teilen, rund formen und zu Scheiben flach drücken. Für das Kaiser-Muster die Ränder fünfmal reihum zur Mitte einschlagen und jeweils mit dem Daumen festdrücken. Mit der Naht nach unten auf ein mit Backpapier belegtes Blech setzen.',
        'Die Brötchen mit Wasser bepinseln, mit Sesam bestreuen und 20 Minuten abgedeckt gehen lassen. Inzwischen den Backofen mit einer ofenfesten Schale auf dem Boden auf 220 °C vorheizen.',
        'Eine Tasse Wasser in die Schale gießen und die Brötchen 10 Minuten backen. Den Dampf ablassen, auf 190 °C herunterschalten und weitere 8 Minuten backen, bis sie goldbraun sind. Auf einem Gitter auskühlen lassen.',
      ]),

    // ---------- Laugenbrötchen / Laugenbrezeln mit Backnatron-Lauge ----------
    backen('brot', 'laugenbroetchen', 'Laugenbrötchen und Laugenbrezeln',
      {
        time: 150,
        yields: { name: 'Laugenbrötchen selbstgebacken', amount: 8, unit: 'Stk', shelf: 2, store: 'in einer Papiertüte bei Raumtemperatur (nicht luftdicht)', frozen: 90 },
        lighter: 'Aus dem Teig 10 statt 8 kleinere Brötchen formen – spart rund 50 kcal pro Stück.',
      },
      '500 g Weizenmehl | 16 g Salz | 21 g Hefe frisch | 1 TL Zucker | 40 g Butter | 40 g Backnatron',
      [
        'Die Hefe frisch mit dem Zucker in 270 ml lauwarmem Wasser auflösen. Mit Weizenmehl, 10 g vom Salz und der weichen Butter 8 Minuten zu einem festen, glatten Teig kneten.',
        'Den Teig abgedeckt 40–50 Minuten gehen lassen, bis er sich fast verdoppelt hat.',
        'Den Teig in 8 Stücke (je ca. 105 g) teilen und rund formen (für Brezeln zu 50 cm langen Strängen rollen und schlingen). Die Teiglinge auf Backpapier 20 Minuten im Kühlschrank oder Tiefkühlfach anziehen lassen, damit sie in der Lauge nicht zusammenfallen.',
        'Sicherheit: Lauge ist ätzend. Gummihandschuhe und Schutzbrille tragen, Kinder fernhalten, nur einen Edelstahl- oder Emailletopf verwenden (nie Aluminium, das wird angegriffen), kein Backblech aus Aluminium ohne Backpapier. Als milde Haushaltsvariante statt Natronlauge 1 Liter Wasser aufkochen und 40 g Backnatron vorsichtig einrühren – es schäumt kräftig auf.',
        'Die Teiglinge einzeln mit einer Schaumkelle 20–30 Sekunden in die heiße Lauge legen (einmal wenden), abtropfen lassen und auf ein mit Backpapier belegtes Blech setzen. Die Brötchen kreuzweise einschneiden und mit den restlichen 6 g Salz bestreuen. Die Lauge nach dem Abkühlen im Ausguss mit viel Wasser wegspülen.',
        'Im auf 210 °C vorgeheizten Backofen (Ober-/Unterhitze) 18–20 Minuten backen, bis sie dunkelbraun glänzen. Auf einem Gitter auskühlen lassen und am gleichen Tag essen – Laugengebäck wird am Folgetag zäh.',
      ]),

    // ---------- Ciabatta (Poolish) ----------
    backen('brot', 'ciabatta', 'Ciabatta',
      {
        cuisine: 'it',
        time: 1050,
        yields: { name: 'Ciabatta selbstgebacken', amount: 3, unit: 'Stk', shelf: 2, store: 'in Papier bei Raumtemperatur', frozen: 90 },
        lighter: 'Das Olivenöl im Teig weglassen (der Teig wird trotzdem luftig) – spart rund 60 kcal pro Ciabatta.',
      },
      '500 g Weizenmehl Tipo 00 | 10 g Salz | 4 g Hefe frisch | 20 ml Olivenöl',
      [
        'Am Vorabend einen Vorteig (Poolish) ansetzen: 100 g vom Mehl, 100 ml kaltes Wasser und 1 g von der Hefe frisch verrühren und abgedeckt 12–16 Stunden bei Raumtemperatur stehen lassen, bis er blasig ist.',
        'Am Backtag den Vorteig mit dem restlichen Mehl, der restlichen Hefe, dem Salz, dem Olivenöl und 300 ml Wasser 10 Minuten zu einem sehr weichen, klebrigen Teig kneten.',
        'Den Teig 90 Minuten in der Schüssel gehen lassen und dabei dreimal im Abstand von 30 Minuten dehnen und falten: Den Teig mit nasser Hand seitlich hochziehen und über sich falten.',
        'Den Teig vorsichtig auf eine stark bemehlte Fläche gleiten lassen (nicht kneten, die Luft soll bleiben), in 3 Rechtecke (ca. 10 × 25 cm) teilen und auf bemehltes Backpapier legen. Abgedeckt 30 Minuten ruhen lassen.',
        'Den Backofen mit einem Blech und einer ofenfesten Schale auf dem Boden auf 230 °C vorheizen. Die Ciabatta mit dem Backpapier auf das heiße Blech ziehen, eine Tasse Wasser in die Schale gießen und 10 Minuten backen.',
        'Den Dampf ablassen, auf 210 °C herunterschalten und weitere 15 Minuten backen, bis die Kruste goldbraun ist. Auf einem Gitter auskühlen lassen.',
      ]),

    // ---------- Focaccia Genovese ----------
    backen('brot', 'focaccia-genovese', 'Focaccia Genovese',
      {
        cuisine: 'it',
        time: 150,
        yields: { name: 'Focaccia selbstgebacken', amount: 12, unit: 'Stk', shelf: 2, store: 'in Papier bei Raumtemperatur', frozen: 90 },
        lighter: 'Nur 70 statt 110 ml Olivenöl verwenden (weniger auf das Blech) – spart rund 30 kcal pro Stück.',
      },
      '500 g Weizenmehl Tipo 00 | 12 g Salz | 15 g Hefe frisch | 1 TL Honig | 110 ml Olivenöl | 2 Zweig Rosmarin',
      [
        'Die Hefe frisch mit dem Honig in 300 ml lauwarmem Wasser auflösen. Mit Weizenmehl, 10 g vom Salz und 60 ml vom Olivenöl 8 Minuten zu einem weichen, glänzenden Teig kneten.',
        'Den Teig abgedeckt 45–60 Minuten bei Raumtemperatur gehen lassen, bis er sich verdoppelt hat.',
        'Ein dunkles Blech (ca. 30 × 40 cm) mit 30 ml vom Olivenöl einfetten, den Teig daraufgeben und mit geölten Händen bis in die Ecken ziehen. Abgedeckt 30 Minuten gehen lassen. Inzwischen den Backofen auf 230 °C vorheizen.',
        'Mit den Fingerspitzen tiefe Mulden in den Teig drücken. Aus den restlichen 20 ml Olivenöl, 50 ml Wasser und den restlichen 2 g Salz eine Lake rühren, über den Teig gießen und die Nadeln der Rosmarinzweige darüberstreuen.',
        'Die Focaccia 20 Minuten backen, bis sie goldgelb ist. Kurz auf dem Blech abkühlen lassen und in 12 Stücke schneiden.',
      ]),

    // ---------- Pane pugliese ----------
    backen('brot', 'pane-pugliese', 'Pane pugliese',
      {
        cuisine: 'it',
        time: 1020,
        yields: { name: 'Pane pugliese selbstgebacken', amount: 1050, unit: 'g', shelf: 5, store: 'in Papier oder im Brotkasten', frozen: 90 },
        lighter: 'Dünn schneiden (35 g statt 50 g pro Scheibe) und mit Tomate und Basilikum belegen statt mit Öl zu beträufeln – spart pro Scheibe rund 50 kcal.',
      },
      '50 g Anstellgut | 400 g Hartweizengrieß | 300 g Weizenmehl Tipo 00 | 14 g Salz | 4 g Hefe frisch',
      [
        'Am Vorabend einen Vorteig ansetzen: das Anstellgut mit 100 g vom Weizenmehl und 100 ml lauwarmem Wasser verrühren und abgedeckt 12 Stunden bei Raumtemperatur reifen lassen.',
        'Am Backtag den Vorteig mit 350 g vom Hartweizengrieß, dem restlichen Weizenmehl, Salz, der zerbröselten Hefe frisch und 380 ml lauwarmem Wasser 10 Minuten zu einem geschmeidigen, leicht klebrigen Teig kneten.',
        'Den Teig 30 Minuten abgedeckt ruhen lassen, dann rund formen und mit der Naht nach oben in ein mit dem restlichen Hartweizengrieß bestäubtes Gärkörbchen legen.',
        'Abgedeckt 45–60 Minuten bei Raumtemperatur gehen lassen. Inzwischen den Backofen mit einem Blech und einer ofenfesten Schale auf dem Boden auf 230 °C vorheizen.',
        'Den Laib auf Backpapier stürzen, kreuzweise einschneiden, auf das heiße Blech ziehen, eine Tasse Wasser in die Schale gießen und 10 Minuten anbacken.',
        'Den Dampf ablassen, auf 200 °C herunterschalten und weitere 40 Minuten backen, bis das Brot beim Klopfen auf die Unterseite hohl klingt. Auf einem Gitter mindestens 2 Stunden auskühlen lassen.',
      ]),

    // ---------- Grissini ----------
    backen('brot', 'pittule-salentine', 'Pittule aus dem Salento',
      {
        cuisine: 'it',
        time: 150,
        yields: { name: 'Pittule frisch', amount: 30, unit: 'Stk', shelf: 1, store: 'am besten sofort warm essen' },
        lighter: 'Kleinere Pittule (1 TL statt 1 EL Teig) und nach dem Frittieren gut auf Küchenpapier abtropfen lassen – pro 5 Stück spart das rund 60 kcal. Süß mit Puderzucker statt Honig spart nochmal ca. 30 kcal.',
      },
      '500 g Weizenmehl Tipo 00 | 12 g Hefe frisch | 10 g Salz | 100 g Kirschtomaten | 40 g Oliven schwarz | 1 EL Kapern | 1000 ml Frittieröl | 2 EL Honig | 2 EL Puderzucker',
      [
        'Die Hefe frisch in 420 ml lauwarmem Wasser auflösen. Weizenmehl in eine große Schüssel geben, das Hefewasser nach und nach einrühren und zum Schluss das Salz zugeben. Mit der Hand oder einem Holzlöffel 10 Minuten kräftig schlagen, bis ein sehr weicher, klebriger, glatter Teig entsteht.',
        'Den Teig abgedeckt an einem warmen Ort 2 Stunden gehen lassen, bis er sich mindestens verdoppelt hat und viele Blasen wirft.',
        'Die Kirschtomaten klein würfeln und gut abtropfen lassen, die Oliven schwarz entsteinen und hacken, die Kapern abspülen. Ein Drittel des Teigs vorsichtig mit Kirschtomaten, Oliven und Kapern vermengen, der Rest bleibt pur.',
        'Das Frittieröl in einem hohen Topf auf 175 °C erhitzen. Die Hände bzw. einen Esslöffel immer wieder in Wasser tauchen, walnussgroße Teigstücke abstechen und portionsweise ins heiße Öl gleiten lassen. 3–4 Minuten rundum goldbraun ausbacken und auf Küchenpapier abtropfen lassen.',
        'Die herzhaften Pittule pur oder mit Salz servieren, die puren nach Wunsch mit Honig beträufeln oder mit Puderzucker bestäuben. Am besten sofort warm essen.',
      ]),
    backen('brot', 'grissini', 'Grissini',
      {
        cuisine: 'it',
        time: 100,
        yields: { name: 'Grissini selbstgebacken', amount: 24, unit: 'Stk', shelf: 7, store: 'luftdicht in einer Dose bei Raumtemperatur' },
        lighter: 'Aus dem Teig 36 statt 24 dünnere Stangen rollen – spart bei drei Stangen rund 60 kcal.',
      },
      '250 g Weizenmehl Tipo 00 | 50 g Hartweizengrieß | 5 g Salz | 7 g Hefe frisch | 40 ml Olivenöl',
      [
        'Die Hefe frisch in 160 ml lauwarmem Wasser auflösen. Mit Weizenmehl, 30 g vom Hartweizengrieß, Salz und Olivenöl 6 Minuten zu einem glatten Teig kneten.',
        'Den Teig abgedeckt 30 Minuten bei Raumtemperatur gehen lassen. Inzwischen den Backofen auf 200 °C vorheizen.',
        'Den Teig zu einem Rechteck (ca. 24 × 30 cm) ausrollen und in 24 Streifen schneiden. Jeden Streifen mit den Händen zu einer 30 cm langen Stange rollen und im restlichen Hartweizengrieß wälzen. Mit Abstand auf zwei mit Backpapier belegte Bleche legen.',
        'Die Grissini 15–18 Minuten backen, bis sie goldbraun sind. Den Ofen ausschalten, die Tür einen Spalt öffnen und die Stangen 10 Minuten nachtrocknen lassen, bis sie knusprig sind.',
      ]),
  ],
  catalog: {
    vorrat: ['Roggenmehl', 'Dinkelmehl', 'Dinkelvollkornmehl', 'Hartweizengrieß', 'Backnatron'],
  },
  products: {
    Roggenmehl: prod(1000, 'g', 1.19, 365, 180, 'Pck'),
    Dinkelmehl: prod(1000, 'g', 1.69, 365, 180, 'Pck'),
    Dinkelvollkornmehl: prod(1000, 'g', 1.79, 365, 120, 'Pck'),
    Hartweizengrieß: prod(500, 'g', 1.49, 540, 365, 'Pck'),
    Backnatron: prod(50, 'g', 0.89, 1095, 1095, 'Pck'),
  },
  nutrition: {
    Roggenmehl: [324, 8.3, 1.4, 68, 8],
    Dinkelmehl: [346, 12, 2, 70, 4],
    Dinkelvollkornmehl: [330, 14, 2.7, 60, 10],
    Hartweizengrieß: [347, 11, 1.1, 71, 3.5],
    Backnatron: [0, 0, 0, 0, 0],
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
    groups: {
      'brot-scheibe': ['Bauernbrot selbstgebacken', 'Dinkelvollkornbrot selbstgebacken', 'Roggenmischbrot selbstgebacken', 'Pane pugliese selbstgebacken'],
      ciabatta: ['Ciabatta selbstgebacken'],
      // Brötchen (Stk): selbstgebackene vor „Brötchen vom Vortag“; Laugengebäck deckt Laugenbrezeln
      broetchen: ['Dinkelbrötchen selbstgebacken', 'Kaiserbrötchen selbstgebacken'],
      laugen: ['Laugenbrezel', 'Laugenbrötchen selbstgebacken'],
      // Burger-Brötchen (Stk): selbstgebackene Buns vor den gekauften
      'burger-broetchen': ['Burger-Brötchen', 'Burger-Buns selbstgebacken'],
    },
    preferred: {
      Vollkornbrot: ['Bauernbrot selbstgebacken', 'Dinkelvollkornbrot selbstgebacken', 'Roggenmischbrot selbstgebacken'],
      Ciabatta: ['Ciabatta selbstgebacken'],
      'Brötchen vom Vortag': ['Dinkelbrötchen selbstgebacken', 'Kaiserbrötchen selbstgebacken'],
      Laugenbrezel: ['Laugenbrötchen selbstgebacken'],
      'Burger-Brötchen': ['Burger-Buns selbstgebacken'],
    },
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
    'dinkelvollkornbrot': [
      st('Dinkelvollkornmehl, Dinkelmehl, Salz und Leinsamen in einer Schüssel mischen. Die Hefe frisch mit dem Honig in 520 ml lauwarmem Wasser auflösen, zum Mehl geben und 8 Minuten zu einem weichen Teig kneten.'),
      st('Den Teig abgedeckt 20 Minuten quellen lassen, kurz durchkneten und mit einer nassen Hand in eine mit Backpapier ausgelegte Kastenform (30 cm) streichen. Die Oberfläche glatt verstreichen.'),
      st('Die Form abgedeckt im CombiSteamer 40 Minuten gehen lassen, bis der Teig fast bis zum Rand steigt.', gare(40, 'Form auf den Gitterrost')),
      st('Den Wasserbehälter füllen und den CombiSteamer mit dem Kuchenblech auf Ebene 2 vorheizen.', preheat()),
      st('Die Form auf das heiße Blech stellen und 10 Minuten mit Dampf anbacken – die Tür dabei geschlossen lassen.', steamer('Heißluft mit Beschwaden', 230, 10, 'Ebene 2')),
      st('Auf Heißluft ohne Dampf umschalten und 45 Minuten backen. Das Brot aus der Form nehmen: Es klingt beim Klopfen auf die Unterseite hohl.', steamer('Heißluft', 190, 45, 'trocken, für die Kruste')),
      st('Auf einem Gitter mindestens 2 Stunden auskühlen lassen, erst dann anschneiden.'),
    ],
    'roggenmischbrot-sauerteig': [
      st('Am Vorabend für den Sauerteig das Anstellgut mit 250 g vom Roggenmehl und 250 ml lauwarmem Wasser (ca. 35 °C) verrühren und abgedeckt 12–16 Stunden bei Raumtemperatur reifen lassen.'),
      st('Am Backtag den Sauerteig mit dem restlichen Roggenmehl, dem Weizenmehl, Salz, Kümmel, der zerbröselten Hefe frisch und 300 ml lauwarmem Wasser 8 Minuten zu einem weichen, leicht klebrigen Teig kneten.'),
      st('Den Teig 20 Minuten abgedeckt ruhen lassen. Eine Kastenform (30 cm) mit Backpapier auslegen, den Teig mit nasser Hand einfüllen, glatt streichen und mit etwas Mehl bestäuben.'),
      st('Die Form abgedeckt im CombiSteamer 60 Minuten gehen lassen, bis der Teig deutlich steigt und die Oberfläche feine Risse zeigt.', gare(60, 'Form auf den Gitterrost')),
      st('Den Wasserbehälter füllen und den CombiSteamer mit dem Kuchenblech auf Ebene 2 vorheizen.', preheat()),
      st('Die Form auf das heiße Blech stellen und 10 Minuten mit Dampf anbacken – die Tür dabei geschlossen lassen.', steamer('Heißluft mit Beschwaden', 230, 10, 'Ebene 2')),
      st('Auf Heißluft ohne Dampf umschalten und 40 Minuten backen, bis das Brot beim Klopfen auf die Unterseite hohl klingt.', steamer('Heißluft', 200, 40, 'trocken, für die Kruste')),
      st('Auf einem Gitter mindestens 3 Stunden auskühlen lassen, erst dann anschneiden.'),
    ],
    'dinkelbroetchen-ueber-nacht': [
      st('Am Abend die Hefe frisch mit dem Honig in 400 ml kaltem Wasser auflösen, mit Dinkelmehl und Salz 6 Minuten kurz zu einem weichen Teig kneten (Dinkel nicht überkneten). Eine Stunde bei Raumtemperatur ruhen lassen.'),
      st('Die Schüssel abdecken und den Teig über Nacht 10–14 Stunden im Kühlschrank reifen lassen (kalte Gare).'),
      st('Am Morgen den kalten Teig auf eine bemehlte Fläche stürzen, in 10 Stücke (je ca. 90 g) teilen und rund wirken. Mit Abstand auf Backpapier setzen und bemehlen.'),
      st('Die Brötchen auf dem Kuchenblech im CombiSteamer 20 Minuten akklimatisieren lassen.', gare(20, 'Kuchenblech Ebene 2')),
      st('Den Wasserbehälter füllen und den CombiSteamer auf Ebene 2 mit dem Blech vorheizen. Die Brötchen mit einem scharfen Messer einschneiden.', preheat(220)),
      st('Die Brötchen 12 Minuten mit Dampf backen – die Tür dabei geschlossen lassen.', steamer('Heißluft mit Beschwaden', 220, 12, 'Ebene 2')),
      st('Auf Heißluft ohne Dampf umschalten und weitere 8–10 Minuten backen, bis sie goldbraun sind und hohl klingen. Auf einem Gitter auskühlen lassen.', steamer('Heißluft', 190, 9, 'trocken, für die Kruste')),
    ],
    'sonntagsbroetchen-kaiser': [
      st('Die Hefe frisch mit dem Zucker in der lauwarmen Milch und 50 ml lauwarmem Wasser auflösen. Mit Weizenmehl, Salz und der weichen Butter 8 Minuten zu einem glatten, geschmeidigen Teig kneten.', { device: 'bora', mode: 'Kochzone', level: '2', note: 'Milch nur lauwarm' }),
      st('Den Teig in der Schüssel abdecken und im CombiSteamer 30 Minuten gehen lassen, bis er sich fast verdoppelt hat.', gare(30)),
      st('Den Teig in 10 Stücke (je ca. 80 g) teilen, rund formen und zu Scheiben flach drücken. Für das Kaiser-Muster die Ränder fünfmal reihum zur Mitte einschlagen und jeweils mit dem Daumen festdrücken. Mit der Naht nach unten auf Backpapier setzen.'),
      st('Die Brötchen mit Wasser bepinseln, mit dem Sesam bestreuen und auf dem Kuchenblech 20 Minuten abgedeckt bei Raumtemperatur gehen lassen. Inzwischen den Wasserbehälter füllen und den CombiSteamer auf Ebene 2 mit dem Blech vorheizen.', preheat(220)),
      st('Die Brötchen 10 Minuten mit Dampf backen – die Tür dabei geschlossen lassen.', steamer('Heißluft mit Beschwaden', 220, 10, 'Ebene 2')),
      st('Auf Heißluft ohne Dampf umschalten und weitere 8 Minuten backen, bis sie goldbraun sind. Auf einem Gitter auskühlen lassen.', steamer('Heißluft', 190, 8, 'trocken, für die Kruste')),
    ],
    'brioche-burger-buns': [
      st('Die Hefe frisch mit dem Zucker in der lauwarmen Milch auflösen. Mit Weizenmehl, Salz, einem Ei und der weichen Butter 10 Minuten zu einem weichen, glänzenden Teig kneten, der sich vom Schüsselrand löst.'),
      st('Den Teig in der Schüssel abdecken und im CombiSteamer 60 Minuten gehen lassen, bis er sich verdoppelt hat.', gare(60)),
      st('Den Teig in 8 Stücke (je ca. 90 g) teilen, rund wirken und mit Abstand auf Backpapier auf das Kuchenblech setzen. Mit der Handfläche auf ca. 8 cm flach drücken und abgedeckt im CombiSteamer 40 Minuten gehen lassen.', gare(40, 'Kuchenblech Ebene 2')),
      st('Den Wasserbehälter füllen und den CombiSteamer auf Ebene 2 mit dem Blech vorheizen. Das zweite Ei verquirlen, die Buns damit bestreichen und mit Sesam bestreuen.', preheat(180)),
      st('Die Buns 16 Minuten mit Dampf backen, bis sie goldbraun sind – die Tür dabei geschlossen lassen. Auf einem Gitter auskühlen lassen und vor dem Belegen waagerecht aufschneiden.', steamer('Heißluft mit Beschwaden', 180, 16, 'Ebene 2')),
    ],
    'laugenbroetchen': [
      st('Die Hefe frisch mit dem Zucker in 270 ml lauwarmem Wasser auflösen. Mit Weizenmehl, 10 g vom Salz und der weichen Butter 8 Minuten zu einem festen, glatten Teig kneten.'),
      st('Den Teig in der Schüssel abdecken und im CombiSteamer 40 Minuten gehen lassen, bis er sich fast verdoppelt hat.', gare(40)),
      st('Den Teig in 8 Stücke (je ca. 105 g) teilen und rund formen (für Brezeln zu 50 cm langen Strängen rollen und schlingen). Die Teiglinge auf Backpapier 20 Minuten im Kühlschrank oder Tiefkühlfach anziehen lassen, damit sie in der Lauge nicht zusammenfallen. Inzwischen den Combair vorheizen.', { device: 'combair', mode: 'Ober-/Unterhitze', temp: 210, note: 'vorheizen, Ebene 2' }),
      st('Sicherheit: Lauge ist ätzend. Gummihandschuhe und Schutzbrille tragen, Kinder fernhalten, nur einen Edelstahl- oder Emailletopf verwenden (nie Aluminium, das wird angegriffen). Als milde Haushaltsvariante statt Natronlauge 1 Liter Wasser aufkochen und 40 g Backnatron vorsichtig einrühren – es schäumt kräftig auf.', { device: 'bora', mode: 'Kochzone', level: '6', note: 'aufkochen' }),
      st('Die Teiglinge einzeln mit einer Schaumkelle 20–30 Sekunden in die heiße Lauge legen (einmal wenden), abtropfen lassen und auf ein mit Backpapier belegtes Blech setzen (kein blankes Aluminium). Die Brötchen kreuzweise einschneiden und mit den restlichen 6 g Salz bestreuen. Die Lauge nach dem Abkühlen im Ausguss mit viel Wasser wegspülen.'),
      st('Die Laugenbrötchen 18–20 Minuten backen, bis sie dunkelbraun glänzen. Auf einem Gitter auskühlen lassen und am gleichen Tag essen – Laugengebäck wird am Folgetag zäh.', { device: 'combair', mode: 'Ober-/Unterhitze', temp: 210, minutes: 19, note: 'Ebene 2' }),
    ],
    'ciabatta': [
      st('Am Vorabend einen Vorteig (Poolish) ansetzen: 100 g vom Mehl, 100 ml kaltes Wasser und 1 g von der Hefe frisch verrühren und abgedeckt 12–16 Stunden bei Raumtemperatur stehen lassen, bis er blasig ist.'),
      st('Am Backtag den Vorteig mit dem restlichen Mehl, der restlichen Hefe, dem Salz, dem Olivenöl und 300 ml Wasser 10 Minuten zu einem sehr weichen, klebrigen Teig kneten.'),
      st('Den Teig 90 Minuten in der Schüssel gehen lassen und dabei dreimal im Abstand von 30 Minuten dehnen und falten: Den Teig mit nasser Hand seitlich hochziehen und über sich falten.'),
      st('Den Teig vorsichtig auf eine stark bemehlte Fläche gleiten lassen (nicht kneten, die Luft soll bleiben), in 3 Rechtecke (ca. 10 × 25 cm) teilen und auf bemehltes Backpapier legen.'),
      st('Die Ciabatta auf dem Kuchenblech im CombiSteamer 30 Minuten ruhen lassen.', gare(30, 'Kuchenblech Ebene 2')),
      st('Den Wasserbehälter füllen und den CombiSteamer mit dem Kuchenblech auf Ebene 2 vorheizen. Die Ciabatta mit dem Backpapier auf das heiße Blech ziehen.', preheat()),
      st('Die Ciabatta 10 Minuten mit Dampf backen – die Tür dabei geschlossen lassen.', steamer('Heißluft mit Beschwaden', 230, 10, 'Ebene 2')),
      st('Auf Heißluft ohne Dampf umschalten und weitere 15 Minuten backen, bis die Kruste goldbraun ist. Auf einem Gitter auskühlen lassen.', steamer('Heißluft', 210, 15, 'trocken, für die Kruste')),
    ],
    'focaccia-genovese': [
      st('Die Hefe frisch mit dem Honig in 300 ml lauwarmem Wasser auflösen. Mit Weizenmehl, 10 g vom Salz und 60 ml vom Olivenöl 8 Minuten zu einem weichen, glänzenden Teig kneten.'),
      st('Den Teig in der Schüssel abdecken und im CombiSteamer 45 Minuten gehen lassen, bis er sich verdoppelt hat.', gare(45)),
      st('Ein dunkles Blech (ca. 30 × 40 cm) mit 30 ml vom Olivenöl einfetten, den Teig daraufgeben und mit geölten Händen bis in die Ecken ziehen. Abgedeckt 30 Minuten gehen lassen. Inzwischen den Combair vorheizen.', { device: 'combair', mode: 'PizzaPlus', temp: 230, note: 'vorheizen, Ebene 2' }),
      st('Mit den Fingerspitzen tiefe Mulden in den Teig drücken. Aus den restlichen 20 ml Olivenöl, 50 ml Wasser und den restlichen 2 g Salz eine Lake rühren, über den Teig gießen und die Nadeln der Rosmarinzweige darüberstreuen.'),
      st('Die Focaccia auf dem dunklen Blech ohne Backpapier 20 Minuten backen, bis sie goldgelb ist. Kurz auf dem Blech abkühlen lassen und in 12 Stücke schneiden.', { device: 'combair', mode: 'PizzaPlus', temp: 230, minutes: 20, note: 'dunkles Blech mit Öl, ohne Backpapier, Ebene 2' }),
    ],
    'pane-pugliese': [
      st('Am Vorabend einen Vorteig ansetzen: das Anstellgut mit 100 g vom Weizenmehl und 100 ml lauwarmem Wasser verrühren und abgedeckt 12 Stunden bei Raumtemperatur reifen lassen.'),
      st('Am Backtag den Vorteig mit 350 g vom Hartweizengrieß, dem restlichen Weizenmehl, Salz, der zerbröselten Hefe frisch und 380 ml lauwarmem Wasser 10 Minuten zu einem geschmeidigen, leicht klebrigen Teig kneten.'),
      st('Den Teig 30 Minuten abgedeckt ruhen lassen, dann rund formen und mit der Naht nach oben in ein mit dem restlichen Hartweizengrieß bestäubtes Gärkörbchen legen.'),
      st('Das Gärkörbchen abgedeckt im CombiSteamer 45 Minuten gehen lassen.', gare(45, 'Körbchen auf den Gitterrost')),
      st('Den Wasserbehälter füllen und den CombiSteamer mit dem Kuchenblech auf Ebene 2 vorheizen. Den Laib auf Backpapier stürzen und kreuzweise einschneiden.', preheat()),
      st('Das Brot mit dem Backpapier auf das heiße Blech ziehen und 10 Minuten mit Dampf anbacken – die Tür dabei geschlossen lassen.', steamer('Heißluft mit Beschwaden', 230, 10, 'Ebene 2')),
      st('Auf Heißluft ohne Dampf umschalten und weitere 40 Minuten backen, bis das Brot beim Klopfen auf die Unterseite hohl klingt.', steamer('Heißluft', 200, 40, 'trocken, für die Kruste')),
      st('Auf einem Gitter mindestens 2 Stunden auskühlen lassen, erst dann anschneiden.'),
    ],
    'pittule-salentine': [
      st('Die Hefe frisch in 420 ml lauwarmem Wasser auflösen. Weizenmehl in eine große Schüssel geben, das Hefewasser nach und nach einrühren und zum Schluss das Salz zugeben. 10 Minuten kräftig schlagen, bis ein sehr weicher, klebriger, glatter Teig entsteht.'),
      st('Die Schüssel abdecken und den Teig im CombiSteamer gehen lassen, bis er sich mindestens verdoppelt hat und viele Blasen wirft.', gare(90)),
      st('Die Kirschtomaten klein würfeln und abtropfen lassen, die Oliven schwarz hacken, die Kapern abspülen. Ein Drittel des Teigs vorsichtig mit Kirschtomaten, Oliven und Kapern vermengen, der Rest bleibt pur.'),
      st('Das Frittieröl in einem hohen Topf auf 175 °C erhitzen (Thermometer). Mit einem in Wasser getauchten Esslöffel walnussgroße Teigstücke abstechen, portionsweise ins Öl gleiten lassen und 3–4 Minuten rundum goldbraun ausbacken. Auf Küchenpapier abtropfen lassen.', { device: 'bora', mode: 'Kochzone', level: 'Power', note: 'Öl aufheizen' } as DeviceSetting, { device: 'bora', mode: 'Kochzone', level: '7', minutes: 4, note: '175 °C halten, Abzug Power' } as DeviceSetting),
      st('Die herzhaften Pittule pur servieren, die puren nach Wunsch mit Honig beträufeln oder mit Puderzucker bestäuben. Sofort warm essen.'),
    ],
    'grissini': [
      st('Die Hefe frisch in 160 ml lauwarmem Wasser auflösen. Mit Weizenmehl, 30 g vom Hartweizengrieß, Salz und Olivenöl 6 Minuten zu einem glatten Teig kneten.'),
      st('Den Teig in der Schüssel abdecken und im CombiSteamer 30 Minuten gehen lassen.', gare(30)),
      st('Den CombiSteamer mit dem Kuchenblech auf Ebene 2 vorheizen. Den Teig zu einem Rechteck (ca. 24 × 30 cm) ausrollen und in 24 Streifen schneiden. Jeden Streifen zu einer 30 cm langen Stange rollen und im restlichen Hartweizengrieß wälzen. Mit Abstand auf Backpapier legen.', steamer('Heißluft', 200, undefined, 'vorheizen, Kuchenblech Ebene 2')),
      st('Die Grissini mit dem Backpapier auf das heiße Blech ziehen und 15–18 Minuten backen, bis sie goldbraun sind. Danach den Ofen ausschalten, die Tür einen Spalt öffnen und die Stangen 10 Minuten nachtrocknen lassen.', steamer('Heißluft', 200, 16, 'Ebene 2, ohne Dampf')),
    ],
  },
  imageQueries: {
    'sauerteig-anstellgut': 'sourdough starter jar',
    'bauernbrot-sauerteig': 'Bauernbrot sourdough rye bread loaf',
    'dinkelvollkornbrot': 'Dinkelvollkornbrot spelt wholemeal bread loaf',
    'roggenmischbrot-sauerteig': 'Roggenmischbrot rye bread loaf sourdough',
    'dinkelbroetchen-ueber-nacht': 'Dinkelbrötchen spelt bread rolls',
    'sonntagsbroetchen-kaiser': 'Kaiserbrötchen Kaisersemmel',
    'laugenbroetchen': 'Laugenbrötchen pretzel rolls',
    'brioche-burger-buns': 'Brioche burger buns',
    'ciabatta': 'Ciabatta bread',
    'focaccia-genovese': 'Focaccia genovese',
    'pane-pugliese': 'Pane pugliese Altamura bread',
    'pittule-salentine': 'pittule Salento fried dough balls',
    'grissini': 'Grissini breadsticks',
  },
}
