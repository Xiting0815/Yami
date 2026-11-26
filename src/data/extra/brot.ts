// Backen & Desserts – Gruppe „Brot & Brötchen“ (deutsch + italienisch, Sauerteig, Focaccia).
// Regeln: docs/backen-regeln.md. Nur diese Datei bearbeiten.
import { backen, prod } from '../define'
import type { DeviceSetting, DeviceStep } from '../../types'
import type { ExtraGroup } from './types'
import { famag, mitFamag } from '../device-helpers'

/** Geräte-Schritt: Text + optionale Einstellungen */
const st = (text: string, ...settings: DeviceSetting[]): DeviceStep => (settings.length ? { text, settings } : { text })
/** Knet-Schritt im Famag (Spiralkneter): Text nennt Kneter und Dauer, dazu weitere Einstellungen (z. B. Milch lauwarm) */
const kn = (text: string, minutes: number, o: Parameters<typeof famag>[1] = {}, ...more: DeviceSetting[]): DeviceStep =>
  st(mitFamag(text, minutes), ...more, famag(minutes, o))
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
        'Rund 200 g als Anstellgut im Glas in den Kühlschrank stellen (hält ca. 1 Woche), den Rest wegwerfen. Vor jedem Backen auffrischen (füttern): 50 g Roggenmehl und 50 ml lauwarmes Wasser unterrühren und 6–8 Stunden warm stehen lassen, bis es Blasen wirft und sich etwa verdoppelt hat.',
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

    // ========== Ohne Sauerteig: Toastbrote, Brötchen, Brote mit Hefe, Backpulver oder Natron ==========

    // ---------- Klassisches Toastbrot (Kastenform, auch als Sandwichtoast mit Deckel) ----------
    backen('brot', 'toastbrot-klassisch', 'Klassisches Toastbrot',
      {
        time: 240,
        yields: { name: 'Toastbrot selbstgebacken', amount: 820, unit: 'g', shelf: 4, store: 'in einem Brotbeutel bei Raumtemperatur (in Scheiben eingefroren bis 3 Monate)', frozen: 90 },
        lighter: 'Butter auf 15 g und Zucker auf 10 g verringern – spart rund 15 kcal pro 50 g; wer 25-g-Scheiben toastet, halbiert zusätzlich die Kalorien pro Scheibe.',
      },
      '500 g Weizenmehl | 10 g Salz | 15 g Hefe frisch | 20 g Zucker | 40 g Butter | 150 ml Milch',
      [
        'Die Hefe frisch mit dem Zucker in der lauwarmen Milch und 150 ml lauwarmem Wasser auflösen. Mit Weizenmehl und Salz 5 Minuten kneten, dann die weiche Butter in Stückchen zugeben und weitere 5 Minuten zu einem glatten, elastischen Teig kneten.',
        'Fensterprobe machen: Ein kleines Teigstück vorsichtig zwischen den Fingern ausziehen. Lässt es sich hauchdünn dehnen, sodass Licht durchscheint, ohne zu reißen, ist der Teig fertig – sonst noch 2 Minuten weiterkneten. Den Teig abgedeckt 60 Minuten gehen lassen, bis er sich verdoppelt hat.',
        'Eine Kastenform (30 cm) mit Backpapier auslegen. Den Teig in 3 gleich große Stücke teilen, jedes rund formen und die Kugeln nebeneinander in die Form setzen. Abgedeckt 40–50 Minuten gehen lassen, bis der Teig etwa 1 cm unter dem Rand steht. Inzwischen den Backofen auf 190 °C Ober-/Unterhitze vorheizen.',
        'Das Toastbrot auf der unteren Schiene 35 Minuten goldbraun backen. Sofort aus der Form lösen: Es klingt beim Klopfen auf die Unterseite hohl.',
        'Auf einem Gitter mindestens 1 Stunde auskühlen lassen. Zum Einfrieren in 1 cm dicke Scheiben schneiden, portionsweise in Gefrierbeutel füllen und die Scheiben gefroren direkt in den Toaster stecken.',
      ]),

    // ---------- Dinkel-Vollkorntoast ----------
    backen('brot', 'dinkel-vollkorntoast', 'Dinkel-Vollkorntoast',
      {
        time: 230,
        yields: { name: 'Dinkel-Vollkorntoast selbstgebacken', amount: 830, unit: 'g', shelf: 4, store: 'in einem Brotbeutel bei Raumtemperatur (in Scheiben eingefroren bis 3 Monate)', frozen: 90 },
        lighter: 'Die Butter weglassen und die Milch durch Wasser ersetzen – spart rund 20 kcal pro 50 g; die Krume wird etwas fester.',
      },
      '300 g Dinkelvollkornmehl | 200 g Dinkelmehl | 10 g Salz | 15 g Hefe frisch | 15 g Honig | 30 g Butter | 200 ml Milch',
      [
        'Dinkelvollkornmehl und Dinkelmehl mit der lauwarmen Milch und 150 ml lauwarmem Wasser verrühren und abgedeckt 20 Minuten quellen lassen – so nimmt das Vollkornmehl das Wasser auf und der Toast wird nicht krümelig.',
        'Die Hefe frisch mit dem Honig verrühren, mit Salz und der weichen Butter zum Teig geben und 6 Minuten langsam zu einem weichen, leicht klebrigen Teig kneten (Dinkel nicht überkneten). Abgedeckt 45 Minuten gehen lassen.',
        'Eine Kastenform (30 cm) mit Backpapier auslegen. Den Teig auf wenig Mehl zu einem Rechteck (ca. 25 × 30 cm) drücken, von der kurzen Seite her straff aufrollen und mit der Naht nach unten in die Form legen.',
        'Abgedeckt 30–35 Minuten gehen lassen, bis der Teig knapp den Rand erreicht (Dinkel nicht zu lange gehen lassen, sonst fällt er ein). Inzwischen den Backofen auf 190 °C Ober-/Unterhitze vorheizen.',
        'Den Toast auf der unteren Schiene 35 Minuten backen, sofort aus der Form lösen und die Klopfprobe machen: Die Unterseite klingt hohl.',
        'Auf einem Gitter mindestens 1 Stunde auskühlen lassen. Zum Einfrieren in Scheiben schneiden und portionsweise in Gefrierbeutel füllen; die Scheiben gefroren toasten.',
      ]),

    // ---------- Hokkaido-Milchtoast mit Tangzhong ----------
    backen('brot', 'milchtoast-hokkaido', 'Hokkaido-Milchtoast (Buttertoast)',
      {
        time: 250,
        yields: { name: 'Milchtoast selbstgebacken', amount: 760, unit: 'g', shelf: 4, store: 'in einem Brotbeutel bei Raumtemperatur (in Scheiben eingefroren bis 3 Monate)', frozen: 90 },
        lighter: 'Zucker auf 20 g und Butter auf 20 g verringern – spart rund 15 kcal pro 50 g, der Toast bleibt dank Tangzhong trotzdem weich.',
      },
      '400 g Weizenmehl | 8 g Salz | 10 g Hefe frisch | 40 g Zucker | 40 g Butter | 260 ml Milch | 1 Stk Ei',
      [
        'Für das Tangzhong (Mehlkochstück) 25 g vom Weizenmehl mit 125 ml von der Milch in einem kleinen Topf glatt rühren und bei mittlerer Hitze unter ständigem Rühren 2–3 Minuten erhitzen, bis eine puddingartige Masse entsteht (ca. 65 °C). Abgedeckt auf Handwärme abkühlen lassen. Das gebundene Wasser macht den Toast besonders weich und länger frisch.',
        'Die Hefe frisch mit dem Zucker in 125 ml lauwarmer Milch auflösen. Mit dem restlichen Weizenmehl, Salz, Ei und dem Tangzhong 6 Minuten kneten, dann die weiche Butter in Stückchen zugeben und weitere 6 Minuten kneten, bis der Teig die Fensterprobe besteht (lässt sich hauchdünn ausziehen, ohne zu reißen).',
        'Den Teig abgedeckt 60 Minuten gehen lassen, bis er sich verdoppelt hat.',
        'Den Teig in 3 Stücke teilen, jedes zu einem Oval (ca. 12 × 25 cm) ausrollen, von der kurzen Seite her aufrollen und die Rollen nebeneinander in eine mit Backpapier ausgelegte Kastenform (30 cm) setzen. Abgedeckt 45 Minuten gehen lassen, bis der Teig fast den Rand erreicht.',
        'Den Backofen auf 180 °C Ober-/Unterhitze vorheizen. Den Toast mit den restlichen 10 ml Milch bestreichen und auf der unteren Schiene 30 Minuten goldbraun backen; wird er zu dunkel, nach 20 Minuten mit Backpapier abdecken.',
        'Sofort aus der Form lösen und auf einem Gitter mindestens 1 Stunde auskühlen lassen. Zum Einfrieren in Scheiben schneiden und portionsweise in Gefrierbeutel füllen.',
      ]),

    // ---------- Schnelle Quarkbrötchen (Backpulver, ohne Hefe) ----------
    backen('brot', 'quarkbroetchen', 'Schnelle Quarkbrötchen',
      {
        time: 50,
        yields: { name: 'Quarkbrötchen selbstgebacken', amount: 10, unit: 'Stk', shelf: 2, store: 'in einer Papiertüte bei Raumtemperatur', frozen: 90 },
        lighter: 'Das Öl auf 25 ml halbieren und 12 statt 10 Brötchen formen – spart rund 55 kcal pro Brötchen.',
      },
      '400 g Weizenmehl | 1 Pck Backpulver | 6 g Salz | 10 g Zucker | 250 g Magerquark | 1 Stk Ei | 70 ml Milch | 50 ml Sonnenblumenöl | 2 TL Sesam',
      [
        'Den Backofen auf 200 °C Ober-/Unterhitze vorheizen und ein Blech mit Backpapier belegen.',
        'Weizenmehl, Backpulver (1 Päckchen, 15 g), Salz und Zucker mischen. Magerquark, Ei, 60 ml von der Milch und Sonnenblumenöl zugeben und mit den Händen nur kurz zu einem glatten Teig verkneten – Backpulverteig nicht lange kneten, sonst wird er zäh.',
        'Den Teig in 10 Stücke (je ca. 85 g) teilen, mit bemehlten Händen rund formen und mit Abstand auf das Blech setzen. Mit den restlichen 10 ml Milch bestreichen, mit Sesam bestreuen und mit einem Messer kreuzweise einschneiden.',
        'Die Brötchen sofort 20–22 Minuten backen, bis sie goldbraun sind. Auf einem Gitter auskühlen lassen; am Folgetag kurz aufbacken.',
      ]),

    // ---------- Körnerbrötchen (Mehrkorn) ----------
    backen('brot', 'koernerbroetchen', 'Körnerbrötchen',
      {
        time: 180,
        yields: { name: 'Körnerbrötchen selbstgebacken', amount: 10, unit: 'Stk', shelf: 2, store: 'in einer Papiertüte bei Raumtemperatur', frozen: 90 },
        lighter: 'Die Kürbiskerne obendrauf weglassen und nur mit Haferflocken bestreuen – spart rund 15 kcal pro Brötchen.',
      },
      '350 g Weizenmehl | 150 g Weizenvollkornmehl | 30 g Sonnenblumenkerne | 3 EL Kürbiskerne | 20 g Leinsamen geschrotet | 5 TL Sesam | 40 g Haferflocken | 11 g Salz | 15 g Hefe frisch | 10 g Honig',
      [
        'Für das Brühstück Sonnenblumenkerne, Leinsamen, 3 TL vom Sesam und 20 g von den Haferflocken mit 100 ml kochendem Wasser übergießen und abgedeckt 30 Minuten quellen lassen – so ziehen die Körner dem Teig später kein Wasser mehr.',
        'Die Hefe frisch mit dem Honig in 280 ml lauwarmem Wasser auflösen. Mit Weizenmehl, Weizenvollkornmehl und Salz 8 Minuten zu einem glatten Teig kneten, dann das Brühstück 2 Minuten unterarbeiten.',
        'Den Teig abgedeckt 60 Minuten gehen lassen, bis er sich verdoppelt hat.',
        'Den Teig in 10 Stücke (je ca. 105 g) teilen und rund formen. Kürbiskerne, den restlichen Sesam und die restlichen Haferflocken auf einem Teller mischen, die Brötchen oben mit Wasser befeuchten und hineindrücken. Mit Abstand auf ein Blech mit Backpapier setzen und abgedeckt 30 Minuten gehen lassen.',
        'Den Backofen mit einer ofenfesten Schale auf dem Boden auf 220 °C vorheizen. Eine Tasse Wasser in die Schale gießen und die Brötchen 12 Minuten backen.',
        'Den Dampf ablassen, auf 200 °C herunterschalten und weitere 8 Minuten backen, bis sie kräftig braun sind und hohl klingen. Auf einem Gitter auskühlen lassen.',
      ]),

    // ---------- Milchbrötchen ----------
    backen('brot', 'milchbroetchen', 'Milchbrötchen',
      {
        time: 150,
        yields: { name: 'Milchbrötchen selbstgebacken', amount: 12, unit: 'Stk', shelf: 3, store: 'luftdicht in einem Beutel bei Raumtemperatur', frozen: 90 },
        lighter: 'Zucker auf 25 g und Butter auf 40 g verringern – spart rund 25 kcal pro Brötchen.',
      },
      '500 g Weizenmehl | 9 g Salz | 21 g Hefe frisch | 50 g Zucker | 70 g Butter | 280 ml Milch | 2 Stk Ei',
      [
        'Die Hefe frisch mit dem Zucker in 260 ml lauwarmer Milch auflösen. Mit Weizenmehl, Salz und einem Ei 5 Minuten kneten, dann die weiche Butter in Stückchen zugeben und weitere 6 Minuten zu einem glatten, glänzenden Teig kneten.',
        'Den Teig abgedeckt 60 Minuten gehen lassen, bis er sich verdoppelt hat.',
        'Den Teig in 12 Stücke (je ca. 80 g) teilen, rund wirken und mit 2 cm Abstand auf ein Blech mit Backpapier setzen – beim Backen wachsen sie leicht zusammen und bleiben seitlich weich. Abgedeckt 30 Minuten gehen lassen.',
        'Den Backofen auf 170 °C Heißluft vorheizen. Das zweite Ei mit den restlichen 20 ml Milch verquirlen und die Brötchen damit bestreichen.',
        'Die Milchbrötchen 18 Minuten goldbraun backen. Auf einem Gitter auskühlen lassen.',
      ]),

    // ---------- Irisches Soda Bread (Natron statt Hefe) ----------
    backen('brot', 'soda-bread', 'Irisches Soda Bread',
      {
        time: 90,
        yields: { name: 'Soda Bread selbstgebacken', amount: 820, unit: 'g', shelf: 3, store: 'in ein Küchentuch gewickelt im Brotkasten', frozen: 90 },
        lighter: 'Dünn schneiden (35 g statt 50 g pro Scheibe) und mit Kräuterquark statt Butter belegen – spart pro Scheibe rund 80 kcal.',
      },
      '250 g Weizenvollkornmehl | 200 g Weizenmehl | 30 g Haferflocken | 6 g Backnatron | 8 g Salz | 10 g Zucker | 420 ml Buttermilch',
      [
        'Den Backofen auf 200 °C Ober-/Unterhitze vorheizen und ein Blech mit Backpapier belegen.',
        'Weizenvollkornmehl, Weizenmehl, 20 g von den Haferflocken, Backnatron, Salz und Zucker in einer Schüssel mischen. Die Buttermilch zugießen und mit einem Löffel nur so lange verrühren, bis kein trockenes Mehl mehr zu sehen ist – nicht kneten.',
        'Den klebrigen Teig sofort mit bemehlten Händen zu einem runden Laib (ca. 18 cm) formen, auf das Blech setzen, mit den restlichen Haferflocken bestreuen und mit einem bemehlten Messer ein tiefes Kreuz (ca. 2 cm) einschneiden.',
        'Das Soda Bread 40 Minuten backen, bis es kräftig braun ist und beim Klopfen auf die Unterseite hohl klingt.',
        'Auf einem Gitter auskühlen lassen – für eine weiche Kruste in ein Küchentuch wickeln. Am besten am Backtag und am Folgetag essen, danach toasten.',
      ]),

    // ---------- Bauernbrot mit Hefe (Weizen-Roggen-Mischbrot, Vorteig) ----------
    backen('brot', 'bauernbrot-hefe', 'Bauernbrot mit Hefe (ohne Sauerteig)',
      {
        time: 1020,
        yields: { name: 'Hefe-Bauernbrot selbstgebacken', amount: 920, unit: 'g', shelf: 4, store: 'in Papier oder im Brotkasten', frozen: 90 },
        lighter: 'Dünn schneiden (35 g statt 50 g pro Scheibe) und mit Magerquark und Schnittlauch statt Butter belegen – spart pro Scheibe rund 80 kcal.',
      },
      '350 g Weizenmehl | 150 g Roggenmehl | 11 g Salz | 8 g Hefe frisch | 1 TL Kümmel',
      [
        'Am Vorabend einen Vorteig ansetzen: Das Roggenmehl mit 150 ml kaltem Wasser und 1 g von der Hefe frisch verrühren und abgedeckt 12–16 Stunden bei Raumtemperatur reifen lassen. Er ersetzt den Sauerteig als Aromageber.',
        'Am Backtag den Vorteig mit Weizenmehl, der restlichen Hefe frisch, Salz, Kümmel und 200 ml lauwarmem Wasser 8 Minuten langsam zu einem weichen, leicht klebrigen Teig kneten.',
        'Den Teig abgedeckt 45 Minuten gehen lassen. Dann rund formen und mit der Naht nach oben in ein bemehltes Gärkörbchen legen.',
        'Abgedeckt 45 Minuten gehen lassen, bis der Teig sichtbar aufgegangen ist. Inzwischen den Backofen mit einem Blech und einer ofenfesten Schale auf dem Boden auf 230 °C vorheizen.',
        'Den Laib auf Backpapier stürzen, auf das heiße Blech ziehen, eine Tasse Wasser in die Schale gießen und 10 Minuten anbacken.',
        'Den Dampf ablassen, auf 200 °C herunterschalten und weitere 40 Minuten backen, bis das Brot beim Klopfen auf die Unterseite hohl klingt. Auf einem Gitter mindestens 2 Stunden auskühlen lassen.',
      ]),

    // ---------- Baguette mit Poolish ----------
    backen('brot', 'baguette-poolish', 'Baguette mit Poolish',
      {
        time: 960,
        yields: { name: 'Baguette selbstgebacken', amount: 3, unit: 'Stk', shelf: 1, store: 'in Papier bei Raumtemperatur', frozen: 90 },
        lighter: 'Ein Baguette auf vier statt drei Portionen teilen und mit Tomate statt Butter essen – spart rund 140 kcal pro Portion.',
      },
      '500 g Weizenmehl | 10 g Salz | 4 g Hefe frisch',
      [
        'Am Vorabend den Poolish ansetzen: 200 g vom Weizenmehl, 200 ml kaltes Wasser und 1 g von der Hefe frisch verrühren und abgedeckt 12–16 Stunden bei Raumtemperatur stehen lassen, bis er voller Blasen ist.',
        'Am Backtag den Poolish mit dem restlichen Weizenmehl, der restlichen Hefe frisch und 130 ml Wasser 2 Minuten mischen, dann das Salz zugeben und 8 Minuten zu einem glatten Teig kneten.',
        'Den Teig abgedeckt 90 Minuten bei Raumtemperatur gehen lassen und nach 30 und 60 Minuten dehnen und falten.',
        'Den Teig in 3 Stücke (je ca. 280 g) teilen, locker zu Rollen vorformen und 20 Minuten ruhen lassen. Dann jedes Stück flach drücken, von der langen Seite her straff aufrollen und zu 35 cm langen Stangen rollen. Auf bemehltes Backpapier legen und abgedeckt 40 Minuten gehen lassen.',
        'Den Backofen mit einem Blech und einer ofenfesten Schale auf dem Boden auf 240 °C vorheizen. Die Baguettes dreimal schräg und flach einschneiden, auf das heiße Blech ziehen, eine Tasse Wasser in die Schale gießen und 12 Minuten backen.',
        'Den Dampf ablassen und weitere 12 Minuten bei 220 °C backen, bis die Kruste kräftig braun ist. Auf einem Gitter auskühlen lassen.',
      ]),

    // ---------- Wasserweck / Schnittbrötchen ----------
    backen('brot', 'wasserweck', 'Wasserweck (Schnittbrötchen)',
      {
        time: 140,
        yields: { name: 'Wasserweck selbstgebacken', amount: 10, unit: 'Stk', shelf: 1, store: 'in einer Papiertüte bei Raumtemperatur', frozen: 90 },
        lighter: 'Aus dem Teig 12 statt 10 kleinere Wecken formen – spart rund 30 kcal pro Brötchen.',
      },
      '500 g Weizenmehl | 10 g Salz | 15 g Hefe frisch | 5 g Zucker | 10 ml Sonnenblumenöl',
      [
        'Die Hefe frisch mit dem Zucker in 300 ml lauwarmem Wasser auflösen. Mit Weizenmehl, Salz und Sonnenblumenöl 10 Minuten zu einem glatten, festen Teig kneten.',
        'Den Teig abgedeckt 45 Minuten gehen lassen, bis er sich fast verdoppelt hat.',
        'Den Teig in 10 Stücke (je ca. 83 g) teilen, rund wirken und zu ovalen Wecken (ca. 10 cm) rollen. Mit der Naht nach oben auf ein bemehltes Tuch legen und abgedeckt 30 Minuten gehen lassen.',
        'Den Backofen mit einer ofenfesten Schale auf dem Boden auf 220 °C vorheizen. Die Wecken umdrehen, auf ein Blech mit Backpapier setzen und mit einem scharfen Messer der Länge nach ca. 1 cm tief einschneiden.',
        'Eine Tasse Wasser in die Schale gießen und die Wecken 12 Minuten backen. Den Dampf ablassen, auf 200 °C herunterschalten und weitere 8 Minuten backen, bis sie goldbraun sind. Auf einem Gitter auskühlen lassen.',
      ]),
  ],
  catalog: {
    vorrat: ['Roggenmehl', 'Dinkelmehl', 'Dinkelvollkornmehl', 'Hartweizengrieß', 'Backnatron', 'Weizenvollkornmehl'],
    konserven: ['Sonnenblumenkerne'],
  },
  products: {
    Roggenmehl: prod(1000, 'g', 1.19, 365, 180, 'Pck'),
    Dinkelmehl: prod(1000, 'g', 1.69, 365, 180, 'Pck'),
    Dinkelvollkornmehl: prod(1000, 'g', 1.79, 365, 120, 'Pck'),
    Hartweizengrieß: prod(500, 'g', 1.49, 540, 365, 'Pck'),
    Backnatron: prod(50, 'g', 0.89, 1095, 1095, 'Pck'),
    Weizenvollkornmehl: prod(1000, 'g', 1.29, 365, 120, 'Pck'),
    Sonnenblumenkerne: prod(200, 'g', 1.29, 365, 90, 'Pck'),
  },
  nutrition: {
    Roggenmehl: [324, 8.3, 1.4, 68, 8],
    Dinkelmehl: [346, 12, 2, 70, 4],
    Dinkelvollkornmehl: [330, 14, 2.7, 60, 10],
    Hartweizengrieß: [347, 11, 1.1, 71, 3.5],
    Backnatron: [0, 0, 0, 0, 0],
    Weizenvollkornmehl: [325, 12, 2.4, 60, 10],
    Sonnenblumenkerne: [584, 21, 51, 12, 9],
    // Anstellgut = Roggenmehl und Wasser 1:1 (die automatische Berechnung kennt das Wasser nicht)
    Anstellgut: [162, 4.2, 0.7, 34, 4],
  },
  grams: {
    Roggenmehl: { EL: 10 },
    Weizenvollkornmehl: { EL: 10 },
    Sonnenblumenkerne: { EL: 10 },
  },
  convert: {
    Roggenmehl: { EL: 10 },
  },
  substitutes: {
    // selbstgebackenes Brot (im Vorrat in Scheiben à 50 g) deckt Vollkornbrot, z. B. in den Frühstücksboxen – und wird zuerst genommen
    groups: {
      'brot-scheibe': ['Bauernbrot selbstgebacken', 'Dinkelvollkornbrot selbstgebacken', 'Roggenmischbrot selbstgebacken', 'Pane pugliese selbstgebacken', 'Hefe-Bauernbrot selbstgebacken', 'Soda Bread selbstgebacken'],
      ciabatta: ['Ciabatta selbstgebacken'],
      // Brötchen (Stk): selbstgebackene vor „Brötchen vom Vortag“; Laugengebäck deckt Laugenbrezeln
      broetchen: ['Dinkelbrötchen selbstgebacken', 'Kaiserbrötchen selbstgebacken', 'Quarkbrötchen selbstgebacken', 'Körnerbrötchen selbstgebacken', 'Wasserweck selbstgebacken'],
      // Toastbrot (Scheiben): selbstgebackener Toast vor dem gekauften. Achtung: eine Vorrats-Scheibe = 50 g, gekaufte Toastscheibe ≈ 25 g
      toast: ['Toastbrot', 'Toastbrot selbstgebacken', 'Dinkel-Vollkorntoast selbstgebacken', 'Milchtoast selbstgebacken'],
      laugen: ['Laugenbrezel', 'Laugenbrötchen selbstgebacken'],
      // Burger-Brötchen (Stk): selbstgebackene Buns vor den gekauften
      'burger-broetchen': ['Burger-Brötchen', 'Burger-Buns selbstgebacken'],
    },
    preferred: {
      Vollkornbrot: ['Bauernbrot selbstgebacken', 'Dinkelvollkornbrot selbstgebacken', 'Roggenmischbrot selbstgebacken', 'Hefe-Bauernbrot selbstgebacken', 'Soda Bread selbstgebacken'],
      Toastbrot: ['Toastbrot selbstgebacken', 'Dinkel-Vollkorntoast selbstgebacken', 'Milchtoast selbstgebacken'],
      Ciabatta: ['Ciabatta selbstgebacken'],
      'Brötchen vom Vortag': ['Dinkelbrötchen selbstgebacken', 'Kaiserbrötchen selbstgebacken', 'Quarkbrötchen selbstgebacken', 'Körnerbrötchen selbstgebacken', 'Wasserweck selbstgebacken'],
      Laugenbrezel: ['Laugenbrötchen selbstgebacken'],
      'Burger-Brötchen': ['Burger-Buns selbstgebacken'],
    },
  },
  deviceSteps: {
    // Anstellgut braucht kein Gerät (nur Wärme) – daher keine Geräte-Schritte
    'bauernbrot-sauerteig': [
      { text: 'Am Vorabend für den Sauerteig das aufgefrischte Anstellgut (siehe Grundrezept „Sauerteig ansetzen“) mit 250 g vom Roggenmehl und 250 ml lauwarmem Wasser (ca. 35 °C) verrühren und abgedeckt 12–16 Stunden bei Raumtemperatur reifen lassen, bis er voller Bläschen ist und säuerlich riecht.' },
      kn('Am Backtag den Sauerteig mit dem restlichen Roggenmehl, dem Weizenmehl (am besten Type 1050), Salz, Kümmel, der zerbröselten Hefe frisch und 220 ml lauwarmem Wasser 8–10 Minuten langsam zu einem weichen, klebrigen Teig kneten.', 8, { mode: 'Kneten langsam', note: 'Roggen nur gut vermischen' }),
      { text: 'Den Teig abgedeckt 30 Minuten ruhen lassen, dann mit nassen Händen zu einer runden Kugel formen und mit der Naht (der Stelle, an der die Teigränder zusammenlaufen) nach oben in ein bemehltes Gärkörbchen legen – ersatzweise in eine Schüssel mit einem gut bemehlten Küchentuch. Abgedeckt 60–75 Minuten bei Raumtemperatur gehen lassen, bis die Oberfläche feine Risse zeigt.' },
      {
        text: 'Den Wasserbehälter füllen und den CombiSteamer mit dem Kuchenblech auf Ebene 2 vorheizen. Den Laib auf Backpapier stürzen (das Körbchen umdrehen, sodass die Naht unten liegt) und mit Mehl bestäuben.',
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
      kn('Dinkelvollkornmehl, Dinkelmehl, Salz und Leinsamen in der Schüssel des Famag mischen. Die Hefe frisch mit dem Honig in 520 ml lauwarmem Wasser auflösen, zum Mehl geben und 8 Minuten zu einem weichen Teig kneten (Dinkel nicht überkneten).', 6, { mode: 'Kneten langsam', note: 'Dinkel nicht überkneten' }),
      st('Den Teig abgedeckt 20 Minuten quellen lassen (das Vollkornmehl saugt Wasser auf), kurz mit der Hand durchkneten und mit einer nassen Hand in eine mit Backpapier ausgelegte Kastenform (30 cm) streichen. Die Oberfläche glatt verstreichen.'),
      st('Die Form abgedeckt im CombiSteamer 40 Minuten gehen lassen, bis der Teig fast bis zum Rand steigt.', gare(40, 'Form auf den Gitterrost')),
      st('Die Form herausnehmen und abgedeckt stehen lassen. Den Wasserbehälter füllen und den CombiSteamer mit dem Kuchenblech auf Ebene 2 vorheizen.', preheat()),
      st('Die Form auf das heiße Blech stellen und 10 Minuten mit Dampf anbacken – die Tür dabei geschlossen lassen.', steamer('Heißluft mit Beschwaden', 230, 10, 'Ebene 2')),
      st('Auf Heißluft ohne Dampf umschalten und 45 Minuten backen. Das Brot aus der Form nehmen: Es klingt beim Klopfen auf die Unterseite hohl.', steamer('Heißluft', 190, 45, 'trocken, für die Kruste')),
      st('Auf einem Gitter mindestens 2 Stunden auskühlen lassen, erst dann anschneiden.'),
    ],
    'roggenmischbrot-sauerteig': [
      st('Am Vorabend für den Sauerteig das aufgefrischte Anstellgut (siehe Grundrezept „Sauerteig ansetzen“) mit 250 g vom Roggenmehl und 250 ml lauwarmem Wasser (ca. 35 °C) verrühren und abgedeckt 12–16 Stunden bei Raumtemperatur reifen lassen, bis er voller Bläschen ist und säuerlich riecht.'),
      kn('Am Backtag den Sauerteig mit dem restlichen Roggenmehl, dem Weizenmehl, Salz, Kümmel, der zerbröselten Hefe frisch und 300 ml lauwarmem Wasser 8 Minuten zu einem weichen, leicht klebrigen Teig kneten.', 8, { mode: 'Kneten langsam', note: 'Roggen nur gut vermischen' }),
      st('Den Teig 20 Minuten abgedeckt ruhen lassen. Eine Kastenform (30 cm) mit Backpapier auslegen, den Teig mit nasser Hand einfüllen, glatt streichen und mit etwas Mehl bestäuben.'),
      st('Die Form abgedeckt im CombiSteamer 60 Minuten gehen lassen, bis der Teig deutlich steigt und die Oberfläche feine Risse zeigt.', gare(60, 'Form auf den Gitterrost')),
      st('Die Form herausnehmen und abgedeckt stehen lassen. Den Wasserbehälter füllen und den CombiSteamer mit dem Kuchenblech auf Ebene 2 vorheizen.', preheat()),
      st('Die Form auf das heiße Blech stellen und 10 Minuten mit Dampf anbacken – die Tür dabei geschlossen lassen.', steamer('Heißluft mit Beschwaden', 230, 10, 'Ebene 2')),
      st('Auf Heißluft ohne Dampf umschalten und 40 Minuten backen, bis das Brot beim Klopfen auf die Unterseite hohl klingt.', steamer('Heißluft', 200, 40, 'trocken, für die Kruste')),
      st('Auf einem Gitter mindestens 3 Stunden auskühlen lassen, erst dann anschneiden.'),
    ],
    'dinkelbroetchen-ueber-nacht': [
      kn('Am Abend die Hefe frisch mit dem Honig in 400 ml kaltem Wasser auflösen, mit Dinkelmehl und Salz 6 Minuten kurz zu einem weichen Teig kneten (Dinkel nicht überkneten). Eine Stunde bei Raumtemperatur ruhen lassen.', 6, { mode: 'Kneten langsam', note: 'Dinkel nicht überkneten' }),
      st('Die Schüssel abdecken und den Teig über Nacht 10–14 Stunden im Kühlschrank reifen lassen (kalte Gare: der Teig geht langsam im Kalten und bekommt mehr Aroma).'),
      st('Am Morgen den kalten Teig auf eine bemehlte Fläche stürzen, in 10 Stücke (je ca. 90 g) teilen und rund wirken: jedes Stück unter der hohlen Hand auf der Arbeitsfläche kreisend rollen, bis eine glatte, straffe Kugel entsteht. Mit Abstand auf Backpapier auf das Kuchenblech setzen und bemehlen.'),
      st('Die Brötchen auf dem Kuchenblech im CombiSteamer 20 Minuten anwärmen und leicht aufgehen lassen.', gare(20, 'Kuchenblech Ebene 2')),
      st('Das Blech herausnehmen und die Brötchen mit dem Backpapier auf ein Brett ziehen. Das leere Blech wieder auf Ebene 2 einschieben, den Wasserbehälter füllen und den CombiSteamer vorheizen. Die Brötchen mit einem scharfen Messer ca. 1 cm tief einschneiden.', preheat(220)),
      st('Die Brötchen mit dem Backpapier auf das heiße Blech ziehen und 12 Minuten mit Dampf backen – die Tür dabei geschlossen lassen.', steamer('Heißluft mit Beschwaden', 220, 12, 'Ebene 2')),
      st('Auf Heißluft ohne Dampf umschalten und weitere 8–10 Minuten backen, bis sie goldbraun sind und hohl klingen. Auf einem Gitter auskühlen lassen.', steamer('Heißluft', 190, 9, 'trocken, für die Kruste')),
    ],
    'sonntagsbroetchen-kaiser': [
      kn('Die Hefe frisch mit dem Zucker in der lauwarmen Milch und 50 ml lauwarmem Wasser auflösen. Mit Weizenmehl, Salz und der weichen Butter 8 Minuten zu einem glatten, geschmeidigen Teig kneten.', 8, {}, { device: 'bora', mode: 'Kochzone', level: '2', note: 'Milch nur lauwarm' }),
      st('Den Teig in der Schüssel abdecken und im CombiSteamer 30 Minuten gehen lassen, bis er sich fast verdoppelt hat.', gare(30)),
      st('Den Teig in 10 Stücke (je ca. 80 g) teilen, zu glatten Kugeln formen (unter der hohlen Hand kreisend rollen) und zu Scheiben flach drücken. Für das Kaiser-Muster die Ränder fünfmal reihum zur Mitte einschlagen und jeweils mit dem Daumen festdrücken. Mit der Naht nach unten auf Backpapier setzen.'),
      st('Die Brötchen mit Wasser bepinseln, mit dem Sesam bestreuen und auf dem Backpapier (z. B. auf einem Brett) 20 Minuten abgedeckt bei Raumtemperatur gehen lassen. Inzwischen den Wasserbehälter füllen und den CombiSteamer mit dem Kuchenblech auf Ebene 2 vorheizen.', preheat(220)),
      st('Die Brötchen mit dem Backpapier auf das heiße Blech ziehen und 10 Minuten mit Dampf backen – die Tür dabei geschlossen lassen.', steamer('Heißluft mit Beschwaden', 220, 10, 'Ebene 2')),
      st('Auf Heißluft ohne Dampf umschalten und weitere 8 Minuten backen, bis sie goldbraun sind. Auf einem Gitter auskühlen lassen.', steamer('Heißluft', 190, 8, 'trocken, für die Kruste')),
    ],
    'brioche-burger-buns': [
      st('Die Hefe frisch mit dem Zucker in der lauwarmen Milch auflösen. Mit Weizenmehl, Salz und einem Ei in den Famag geben und 5 Minuten kneten. Dann die weiche Butter in Stückchen nach und nach zugeben und weitere 7 Minuten kneten, bis der Teig glänzt und sich vom Schüsselrand löst.', famag(5), famag(7, { note: 'Butter nach und nach' })),
      st('Den Teig in der Schüssel abdecken und im CombiSteamer 60 Minuten gehen lassen, bis er sich verdoppelt hat.', gare(60)),
      st('Den Teig in 8 Stücke (je ca. 90 g) teilen, rund wirken (unter der hohlen Hand kreisend zu glatten Kugeln rollen) und mit Abstand auf Backpapier auf das Kuchenblech setzen. Mit der Handfläche auf ca. 8 cm flach drücken und abgedeckt im CombiSteamer 40 Minuten gehen lassen.', gare(40, 'Kuchenblech Ebene 2')),
      st('Das Blech mit den Buns herausnehmen und abgedeckt stehen lassen. Den Wasserbehälter füllen und den CombiSteamer vorheizen. Das zweite Ei verquirlen, die Buns damit bestreichen und mit Sesam bestreuen.', preheat(180)),
      st('Das Blech auf Ebene 2 einschieben und die Buns 16 Minuten mit Dampf backen, bis sie goldbraun sind – die Tür dabei geschlossen lassen. Auf einem Gitter auskühlen lassen und vor dem Belegen waagerecht aufschneiden.', steamer('Heißluft mit Beschwaden', 180, 16, 'Ebene 2')),
    ],
    'laugenbroetchen': [
      kn('Die Hefe frisch mit dem Zucker in 270 ml lauwarmem Wasser auflösen. Mit Weizenmehl, 10 g vom Salz und der weichen Butter 8 Minuten zu einem festen, glatten Teig kneten.', 8),
      st('Den Teig in der Schüssel abdecken und im CombiSteamer 40 Minuten gehen lassen, bis er sich fast verdoppelt hat.', gare(40)),
      st('Den Teig in 8 Stücke (je ca. 105 g) teilen und zu glatten Kugeln formen. Für Brezeln zu 50 cm langen Strängen rollen, die Enden überkreuzen, einmal umeinanderdrehen und auf den dicken Mittelteil drücken. Die Teiglinge auf Backpapier 20 Minuten im Kühlschrank oder Tiefkühlfach anziehen lassen (die Oberfläche wird fest), damit sie in der Lauge nicht zusammenfallen. Inzwischen den Combair vorheizen.', { device: 'combair', mode: 'Ober-/Unterhitze', temp: 210, note: 'vorheizen, Ebene 2' }),
      st('Für die Lauge 1 Liter Wasser in einem Edelstahl- oder Emailletopf aufkochen (nie Aluminium, das wird angegriffen) und das Backnatron vorsichtig einrühren – es schäumt kräftig auf. Diese Natron-Lauge ist milder als echte Natronlauge, reizt aber trotzdem Haut und Augen: Handschuhe tragen und Kinder fernhalten.', { device: 'bora', mode: 'Kochzone', level: '6', note: 'aufkochen' }),
      st('Die Teiglinge einzeln mit einer Schaumkelle 20–30 Sekunden in die heiße Lauge legen (einmal wenden), abtropfen lassen und auf ein mit Backpapier belegtes Blech setzen (kein blankes Aluminium). Die Brötchen kreuzweise einschneiden und mit den restlichen 6 g Salz bestreuen. Die Lauge nach dem Abkühlen im Ausguss mit viel Wasser wegspülen.'),
      st('Die Laugenbrötchen 18–20 Minuten backen, bis sie dunkelbraun glänzen. Auf einem Gitter auskühlen lassen und am gleichen Tag essen – Laugengebäck wird am Folgetag zäh.', { device: 'combair', mode: 'Ober-/Unterhitze', temp: 210, minutes: 19, note: 'Ebene 2' }),
    ],
    'ciabatta': [
      st('Am Vorabend einen Vorteig (Poolish: flüssiger Vorteig aus Mehl, Wasser und sehr wenig Hefe, der über Nacht Aroma bildet) ansetzen: 100 g vom Weizenmehl, 100 ml kaltes Wasser und 1 g von der Hefe frisch verrühren und abgedeckt 12–16 Stunden bei Raumtemperatur stehen lassen, bis er blasig ist.'),
      st('Am Backtag den Vorteig mit dem restlichen Weizenmehl, der restlichen Hefe, dem Salz, dem Olivenöl und zunächst 250 ml der insgesamt 300 ml Wasser in den Famag geben und 12 Minuten kneten. Die übrigen 50 ml Wasser in den letzten 4 Minuten schluckweise zugießen, bis ein sehr weicher, klebriger Teig entsteht, der sich vom Schüsselrand löst.', famag(12, { note: 'letztes Wasser schluckweise' })),
      st('Den Teig abgedeckt 90 Minuten bei Raumtemperatur in der Schüssel gehen lassen und dabei dreimal im Abstand von 30 Minuten dehnen und falten: Den Teig mit nasser Hand an einer Seite hochziehen und über den restlichen Teig legen, die Schüssel eine Vierteldrehung weiterdrehen und das reihum viermal wiederholen. So wird der weiche Teig ohne Kneten kräftiger. Am Ende hat er sich etwa verdoppelt und ist voller Blasen.'),
      st('Den Teig vorsichtig auf eine stark bemehlte Fläche gleiten lassen (nicht kneten, die Luft soll bleiben), in 3 Rechtecke (ca. 10 × 25 cm) teilen und auf bemehltes Backpapier legen.'),
      st('Die Ciabatta auf dem Kuchenblech im CombiSteamer 30 Minuten ruhen lassen.', gare(30, 'Kuchenblech Ebene 2')),
      st('Das Blech herausnehmen und die Ciabatta mit dem Backpapier auf ein Brett ziehen. Das leere Blech wieder auf Ebene 2 einschieben, den Wasserbehälter füllen und den CombiSteamer vorheizen. Dann die Ciabatta mit dem Backpapier auf das heiße Blech ziehen.', preheat()),
      st('Die Ciabatta 10 Minuten mit Dampf backen – die Tür dabei geschlossen lassen.', steamer('Heißluft mit Beschwaden', 230, 10, 'Ebene 2')),
      st('Auf Heißluft ohne Dampf umschalten und weitere 15 Minuten backen, bis die Kruste goldbraun ist. Auf einem Gitter auskühlen lassen.', steamer('Heißluft', 210, 15, 'trocken, für die Kruste')),
    ],
    'focaccia-genovese': [
      kn('Die Hefe frisch mit dem Honig in 300 ml lauwarmem Wasser auflösen. Mit Weizenmehl, 10 g vom Salz und 60 ml vom Olivenöl 8 Minuten zu einem weichen, glänzenden Teig kneten.', 8),
      st('Den Teig in der Schüssel abdecken und im CombiSteamer 45 Minuten gehen lassen, bis er sich verdoppelt hat.', gare(45)),
      st('Ein dunkles Blech (ca. 30 × 40 cm) mit 30 ml vom Olivenöl einfetten, den Teig daraufgeben und mit geölten Händen bis in die Ecken ziehen. Abgedeckt 30 Minuten gehen lassen. Inzwischen den Combair vorheizen.', { device: 'combair', mode: 'PizzaPlus', temp: 230, note: 'vorheizen, Ebene 2' }),
      st('Mit den Fingerspitzen tiefe Mulden in den Teig drücken. Aus den restlichen 20 ml Olivenöl, 50 ml Wasser und den restlichen 2 g Salz eine Lake rühren, über den Teig gießen und die Nadeln der Rosmarinzweige darüberstreuen.'),
      st('Die Focaccia auf dem dunklen Blech ohne Backpapier 20 Minuten backen, bis sie goldgelb ist. Kurz auf dem Blech abkühlen lassen und in 12 Stücke schneiden.', { device: 'combair', mode: 'PizzaPlus', temp: 230, minutes: 20, note: 'dunkles Blech mit Öl, ohne Backpapier, Ebene 2' }),
    ],
    'pane-pugliese': [
      st('Am Vorabend einen Vorteig ansetzen: das aufgefrischte Anstellgut (siehe Grundrezept „Sauerteig ansetzen“) mit 100 g vom Weizenmehl und 100 ml lauwarmem Wasser verrühren und abgedeckt 12 Stunden bei Raumtemperatur reifen lassen, bis er voller Bläschen ist.'),
      kn('Am Backtag den Vorteig mit 350 g vom Hartweizengrieß, dem restlichen Weizenmehl, Salz, der zerbröselten Hefe frisch und 380 ml lauwarmem Wasser 10 Minuten zu einem geschmeidigen, leicht klebrigen Teig kneten.', 10),
      st('Den Teig 30 Minuten abgedeckt ruhen lassen, dann zu einer straffen Kugel formen und mit der Naht (der Stelle, an der die Teigränder zusammenlaufen) nach oben in ein mit dem restlichen Hartweizengrieß bestäubtes Gärkörbchen legen.'),
      st('Das Gärkörbchen abgedeckt im CombiSteamer 45 Minuten gehen lassen, bis der Teig sichtbar aufgegangen ist.', gare(45, 'Körbchen auf den Gitterrost')),
      st('Das Körbchen herausnehmen. Den Wasserbehälter füllen und den CombiSteamer mit dem Kuchenblech auf Ebene 2 vorheizen. Den Laib auf Backpapier stürzen (Körbchen umdrehen, die Naht liegt dann unten) und mit einem scharfen Messer kreuzweise ca. 1 cm tief einschneiden.', preheat()),
      st('Das Brot mit dem Backpapier auf das heiße Blech ziehen und 10 Minuten mit Dampf anbacken – die Tür dabei geschlossen lassen.', steamer('Heißluft mit Beschwaden', 230, 10, 'Ebene 2')),
      st('Auf Heißluft ohne Dampf umschalten und weitere 40 Minuten backen, bis das Brot beim Klopfen auf die Unterseite hohl klingt.', steamer('Heißluft', 200, 40, 'trocken, für die Kruste')),
      st('Auf einem Gitter mindestens 2 Stunden auskühlen lassen, erst dann anschneiden.'),
    ],
    'pittule-salentine': [
      st('Die Hefe frisch in 420 ml lauwarmem Wasser auflösen. Weizenmehl in die Schüssel des Famag geben, das Hefewasser bei laufendem Kneter nach und nach zugießen und nach 3 Minuten das Salz zugeben. Insgesamt 10 Minuten kneten, bis ein sehr weicher, klebriger, glatter Teig entsteht.', famag(10, { note: 'Wasser nach und nach' })),
      st('Die Schüssel abdecken und den Teig im CombiSteamer 90 Minuten gehen lassen, bis er sich mindestens verdoppelt hat und viele Blasen wirft.', gare(90)),
      st('Die Kirschtomaten klein würfeln und abtropfen lassen, die Oliven schwarz entsteinen und hacken, die Kapern abspülen. Ein Drittel des Teigs vorsichtig mit Kirschtomaten, Oliven und Kapern vermengen, der Rest bleibt pur.'),
      st('Das Frittieröl in einem hohen Topf auf 175 °C erhitzen (Thermometer). Mit einem in Wasser getauchten Esslöffel walnussgroße Teigstücke abstechen, portionsweise ins Öl gleiten lassen und 3–4 Minuten rundum goldbraun ausbacken. Auf Küchenpapier abtropfen lassen.', { device: 'bora', mode: 'Kochzone', level: 'Power', note: 'Öl aufheizen' } as DeviceSetting, { device: 'bora', mode: 'Kochzone', level: '7', minutes: 4, note: '175 °C halten, Abzug Power' } as DeviceSetting),
      st('Die herzhaften Pittule pur servieren, die puren nach Wunsch mit Honig beträufeln oder mit Puderzucker bestäuben. Sofort warm essen.'),
    ],
    'grissini': [
      kn('Die Hefe frisch in 160 ml lauwarmem Wasser auflösen. Mit Weizenmehl, 30 g vom Hartweizengrieß, Salz und Olivenöl 6 Minuten zu einem glatten Teig kneten.', 6),
      st('Den Teig in der Schüssel abdecken und im CombiSteamer 30 Minuten gehen lassen.', gare(30)),
      st('Die Schüssel herausnehmen und den CombiSteamer mit dem Kuchenblech auf Ebene 2 vorheizen. Den Teig zu einem Rechteck (ca. 24 × 30 cm) ausrollen und in 24 Streifen schneiden. Jeden Streifen zu einer 30 cm langen Stange rollen und im restlichen Hartweizengrieß wälzen. Mit Abstand auf Backpapier legen.', steamer('Heißluft', 200, undefined, 'vorheizen, Kuchenblech Ebene 2')),
      st('Die Grissini mit dem Backpapier auf das heiße Blech ziehen und 15–18 Minuten backen, bis sie goldbraun sind. Danach den CombiSteamer ausschalten, die Tür einen Spalt öffnen und die Stangen 10 Minuten nachtrocknen lassen.', steamer('Heißluft', 200, 16, 'Ebene 2, ohne Dampf')),
    ],
    // ---------- ohne Sauerteig ----------
    'toastbrot-klassisch': [
      st('Die Hefe frisch mit dem Zucker in der lauwarmen Milch und 150 ml lauwarmem Wasser auflösen. Mit Weizenmehl und Salz in den Famag geben und 5 Minuten kneten, dann die weiche Butter in Stückchen nach und nach zugeben und weitere 5 Minuten zu einem glatten, elastischen Teig kneten.', famag(5), famag(5, { note: 'Butter nach und nach' })),
      st('Fensterprobe machen: Ein kleines Teigstück vorsichtig zwischen den Fingern ausziehen. Lässt es sich hauchdünn dehnen, sodass Licht durchscheint, ohne zu reißen, hat sich das Klebergerüst gebildet und der Teig ist fertig – reißt es sofort, noch 2 Minuten weiterkneten.'),
      st('Den Teig in der Schüssel abdecken und im CombiSteamer 50 Minuten gehen lassen, bis er sich verdoppelt hat (Gare: die Hefe bildet Gas, der Teig wird luftig).', gare(50)),
      st('Eine Kastenform (30 cm) mit Backpapier auslegen. Den Teig in 3 gleich große Stücke teilen, jedes unter der hohlen Hand zu einer straffen Kugel rollen und die Kugeln nebeneinander in die Form setzen – so steigt der Toast gleichmäßig und bekommt die typischen Kuppeln. Für Sandwichtoast mit geraden Kanten später eine Kastenform mit Deckel (Pullman-Form) nehmen und den Deckel schließen, sobald der Teig 1 cm unter dem Rand steht.'),
      st('Die Form abgedeckt im CombiSteamer 40 Minuten gehen lassen, bis der Teig etwa 1 cm unter dem Rand steht (Stückgare). Nach 25 Minuten den Combair auf 190 °C Ober-/Unterhitze vorheizen.', gare(40, 'Form auf den Gitterrost'), { device: 'combair', mode: 'Ober-/Unterhitze', temp: 190, note: 'vorheizen, Ebene 1 (hohe Form)' }),
      st('Die Form auf dem Gitterrost auf Ebene 1 in den Combair stellen und das Toastbrot 35 Minuten goldbraun backen. Sofort aus der Form lösen: Es klingt beim Klopfen auf die Unterseite hohl, sonst ohne Form noch 5 Minuten nachbacken.', { device: 'combair', mode: 'Ober-/Unterhitze', temp: 190, minutes: 35, note: 'Ebene 1 (hohe Form)' }),
      st('Auf einem Gitter mindestens 1 Stunde auskühlen lassen, erst dann schneiden. Zum Einfrieren das ausgekühlte Brot in 1 cm dicke Scheiben schneiden, portionsweise (z. B. 4 Scheiben) in Gefrierbeutel füllen und flach einfrieren (hält ca. 3 Monate). Die Scheiben gefroren direkt in den Toaster stecken.'),
    ],
    'dinkel-vollkorntoast': [
      st('Dinkelvollkornmehl und Dinkelmehl mit der lauwarmen Milch und 150 ml lauwarmem Wasser in der Schüssel des Famag verrühren und abgedeckt 20 Minuten quellen lassen – so nimmt das Vollkornmehl das Wasser auf und der Toast wird nicht krümelig.'),
      st('Die Hefe frisch mit dem Honig verrühren, mit Salz und der weichen Butter zum Teig geben und im Famag 6 Minuten langsam zu einem weichen, leicht klebrigen Teig kneten (Dinkel nicht überkneten, sonst reißt das Klebergerüst).', famag(6, { mode: 'Kneten langsam', note: 'Dinkel nicht überkneten' })),
      st('Den Teig in der Schüssel abdecken und im CombiSteamer 40 Minuten gehen lassen.', gare(40)),
      st('Eine Kastenform (30 cm) mit Backpapier auslegen. Den Teig auf wenig Mehl zu einem Rechteck (ca. 25 × 30 cm) drücken, von der kurzen Seite her straff aufrollen und mit der Naht nach unten in die Form legen.'),
      st('Die Form abgedeckt im CombiSteamer 30 Minuten gehen lassen, bis der Teig knapp den Rand erreicht (Dinkel nicht zu lange gehen lassen, sonst fällt er ein). Nach 15 Minuten den Combair auf 190 °C Ober-/Unterhitze vorheizen.', gare(30, 'Form auf den Gitterrost'), { device: 'combair', mode: 'Ober-/Unterhitze', temp: 190, note: 'vorheizen, Ebene 1 (hohe Form)' }),
      st('Die Form auf dem Gitterrost auf Ebene 1 in den Combair stellen und den Toast 35 Minuten backen. Sofort aus der Form lösen und die Klopfprobe machen: Die Unterseite klingt hohl.', { device: 'combair', mode: 'Ober-/Unterhitze', temp: 190, minutes: 35, note: 'Ebene 1 (hohe Form)' }),
      st('Auf einem Gitter mindestens 1 Stunde auskühlen lassen. Zum Einfrieren in 1 cm dicke Scheiben schneiden, portionsweise in Gefrierbeutel füllen und flach einfrieren (ca. 3 Monate); die Scheiben gefroren toasten.'),
    ],
    'milchtoast-hokkaido': [
      st('Für das Tangzhong (Mehlkochstück) 25 g vom Weizenmehl mit 125 ml von der Milch in einem kleinen Topf glatt rühren und unter ständigem Rühren erhitzen, bis eine puddingartige Masse entsteht (ca. 65 °C, nach 2–3 Minuten). Abgedeckt auf Handwärme abkühlen lassen. Das gebundene Wasser macht den Toast besonders weich und länger frisch.', { device: 'bora', mode: 'Kochzone', level: '3', note: 'ständig rühren' }),
      st('Die Hefe frisch mit dem Zucker in 125 ml lauwarmer Milch auflösen. Mit dem restlichen Weizenmehl, Salz, Ei und dem Tangzhong in den Famag geben und 6 Minuten kneten. Dann die weiche Butter in Stückchen nach und nach zugeben und weitere 6 Minuten kneten, bis der Teig die Fensterprobe besteht (ein Teigstück lässt sich hauchdünn ausziehen, ohne zu reißen).', famag(6), famag(6, { note: 'Butter nach und nach' })),
      st('Den Teig in der Schüssel abdecken und im CombiSteamer 60 Minuten gehen lassen, bis er sich verdoppelt hat.', gare(60)),
      st('Den Teig in 3 Stücke teilen, jedes zu einem Oval (ca. 12 × 25 cm) ausrollen, von der kurzen Seite her aufrollen und die Rollen nebeneinander in eine mit Backpapier ausgelegte Kastenform (30 cm) setzen.'),
      st('Die Form abgedeckt im CombiSteamer 45 Minuten gehen lassen, bis der Teig fast den Rand erreicht. Nach 30 Minuten den Combair auf 180 °C Ober-/Unterhitze vorheizen.', gare(45, 'Form auf den Gitterrost'), { device: 'combair', mode: 'Ober-/Unterhitze', temp: 180, note: 'vorheizen, Ebene 1 (hohe Form)' }),
      st('Den Toast mit den restlichen 10 ml Milch bestreichen, die Form auf dem Gitterrost auf Ebene 1 in den Combair stellen und 30 Minuten goldbraun backen. Wird die Oberfläche zu dunkel, locker mit Backpapier abdecken.', { device: 'combair', mode: 'Ober-/Unterhitze', temp: 180, minutes: 30, note: 'Ebene 1 (hohe Form)' }),
      st('Sofort aus der Form lösen (Klopfprobe: die Unterseite klingt hohl) und auf einem Gitter mindestens 1 Stunde auskühlen lassen. Zum Einfrieren in Scheiben schneiden, portionsweise in Gefrierbeutel füllen und flach einfrieren; gefroren toasten oder 15 Minuten antauen lassen.'),
    ],
    'quarkbroetchen': [
      st('Den Combair auf 200 °C Ober-/Unterhitze vorheizen und ein Blech mit Backpapier belegen.', { device: 'combair', mode: 'Ober-/Unterhitze', temp: 200, note: 'vorheizen, Ebene 2' }),
      st('Weizenmehl, Backpulver (1 Päckchen, 15 g), Salz und Zucker mischen. Magerquark, Ei, 60 ml von der Milch und Sonnenblumenöl zugeben und mit den Händen nur kurz zu einem glatten Teig verkneten – Backpulverteig nicht lange kneten, sonst wird er zäh. Er geht nicht wie Hefeteig, das Backpulver lockert erst in der Hitze.'),
      st('Den Teig in 10 Stücke (je ca. 85 g) teilen, mit bemehlten Händen rund formen und mit Abstand auf das Blech setzen. Mit den restlichen 10 ml Milch bestreichen, mit Sesam bestreuen und mit einem Messer kreuzweise einschneiden.'),
      st('Die Brötchen sofort auf Ebene 2 in den Combair schieben und 21 Minuten backen, bis sie goldbraun sind. Auf einem Gitter auskühlen lassen; am Folgetag kurz aufbacken.', { device: 'combair', mode: 'Ober-/Unterhitze', temp: 200, minutes: 21, note: 'Ebene 2' }),
    ],
    'koernerbroetchen': [
      st('Für das Brühstück Sonnenblumenkerne, Leinsamen, 3 TL vom Sesam und 20 g von den Haferflocken mit 100 ml kochendem Wasser übergießen und abgedeckt 30 Minuten quellen lassen – so ziehen die Körner dem Teig später kein Wasser mehr und die Brötchen bleiben saftig.'),
      st('Die Hefe frisch mit dem Honig in 280 ml lauwarmem Wasser auflösen. Mit Weizenmehl, Weizenvollkornmehl und Salz im Famag 8 Minuten zu einem glatten Teig kneten, dann das Brühstück zugeben und 2 Minuten unterarbeiten.', famag(8), famag(2, { mode: 'Mischen', note: 'Brühstück unterarbeiten' })),
      st('Den Teig in der Schüssel abdecken und im CombiSteamer 50 Minuten gehen lassen, bis er sich verdoppelt hat.', gare(50)),
      st('Den Teig in 10 Stücke (je ca. 105 g) teilen und rund wirken (unter der hohlen Hand kreisend zu straffen Kugeln rollen). Kürbiskerne, den restlichen Sesam und die restlichen Haferflocken auf einem Teller mischen, die Brötchen oben mit Wasser befeuchten und hineindrücken. Mit Abstand auf Backpapier auf das Kuchenblech setzen.'),
      st('Die Brötchen auf dem Kuchenblech im CombiSteamer 25 Minuten gehen lassen.', gare(25, 'Kuchenblech Ebene 2')),
      st('Das Blech herausnehmen und die Brötchen mit dem Backpapier auf ein Brett ziehen. Das leere Blech wieder auf Ebene 2 einschieben, den Wasserbehälter füllen und den CombiSteamer vorheizen.', preheat(220)),
      st('Die Brötchen mit dem Backpapier auf das heiße Blech ziehen und 12 Minuten mit Dampf backen – die Tür dabei geschlossen lassen.', steamer('Heißluft mit Beschwaden', 220, 12, 'Ebene 2')),
      st('Auf Heißluft ohne Dampf umschalten und weitere 8 Minuten backen, bis sie kräftig braun sind und beim Klopfen auf die Unterseite hohl klingen. Auf einem Gitter auskühlen lassen.', steamer('Heißluft', 200, 8, 'trocken, für die Kruste')),
    ],
    'milchbroetchen': [
      st('Die Hefe frisch mit dem Zucker in 260 ml lauwarmer Milch auflösen. Mit Weizenmehl, Salz und einem Ei in den Famag geben und 5 Minuten kneten, dann die weiche Butter in Stückchen nach und nach zugeben und weitere 6 Minuten zu einem glatten, glänzenden Teig kneten.', famag(5), famag(6, { note: 'Butter nach und nach' })),
      st('Den Teig in der Schüssel abdecken und im CombiSteamer 50 Minuten gehen lassen, bis er sich verdoppelt hat.', gare(50)),
      st('Den Teig in 12 Stücke (je ca. 80 g) teilen, rund wirken und mit 2 cm Abstand auf ein Blech mit Backpapier setzen – beim Backen wachsen sie leicht zusammen und bleiben seitlich weich.'),
      st('Das Blech im CombiSteamer 30 Minuten gehen lassen. Nach 15 Minuten den Combair auf 170 °C Heißluft feucht vorheizen.', gare(30, 'Blech Ebene 2'), { device: 'combair', mode: 'Heißluft feucht', temp: 170, note: 'vorheizen, Ebene 2' }),
      st('Das zweite Ei mit den restlichen 20 ml Milch verquirlen und die Brötchen damit bestreichen. Auf Ebene 2 in den Combair schieben und 18 Minuten goldbraun backen. Auf einem Gitter auskühlen lassen.', { device: 'combair', mode: 'Heißluft feucht', temp: 170, minutes: 18, note: 'Ebene 2' }),
    ],
    'soda-bread': [
      st('Den Combair auf 200 °C Ober-/Unterhitze vorheizen und ein Blech mit Backpapier belegen.', { device: 'combair', mode: 'Ober-/Unterhitze', temp: 200, note: 'vorheizen, Ebene 2' }),
      st('Weizenvollkornmehl, Weizenmehl, 20 g von den Haferflocken, Backnatron, Salz und Zucker in einer Schüssel mischen. Die Buttermilch zugießen und mit einem Löffel nur so lange verrühren, bis kein trockenes Mehl mehr zu sehen ist – nicht kneten: Das Natron reagiert sofort mit der Säure der Buttermilch und lockert den Teig, Kneten macht das Brot zäh.'),
      st('Den klebrigen Teig sofort mit bemehlten Händen zu einem runden Laib (ca. 18 cm) formen, auf das Blech setzen, mit den restlichen Haferflocken bestreuen und mit einem bemehlten Messer ein tiefes Kreuz (ca. 2 cm) einschneiden, damit das Brot innen gleichmäßig durchbackt.'),
      st('Das Soda Bread auf Ebene 2 in den Combair schieben und 40 Minuten backen, bis es kräftig braun ist und beim Klopfen auf die Unterseite hohl klingt.', { device: 'combair', mode: 'Ober-/Unterhitze', temp: 200, minutes: 40, note: 'Ebene 2' }),
      st('Auf einem Gitter auskühlen lassen – für eine weiche Kruste in ein Küchentuch wickeln. Am besten am Backtag und am Folgetag essen, danach toasten; in Scheiben eingefroren hält es ca. 3 Monate.'),
    ],
    'bauernbrot-hefe': [
      st('Am Vorabend einen Vorteig ansetzen: Das Roggenmehl mit 150 ml kaltem Wasser und 1 g von der Hefe frisch verrühren und abgedeckt 12–16 Stunden bei Raumtemperatur reifen lassen, bis er voller Bläschen ist. Er ersetzt den Sauerteig als Aromageber und macht das Brot saftiger.'),
      st('Am Backtag den Vorteig mit Weizenmehl, der restlichen Hefe frisch, Salz, Kümmel und 200 ml lauwarmem Wasser im Famag 8 Minuten langsam zu einem weichen, leicht klebrigen Teig kneten.', famag(8, { mode: 'Kneten langsam', note: 'Mischteig mit Roggen' })),
      st('Den Teig in der Schüssel abdecken und im CombiSteamer 45 Minuten gehen lassen.', gare(45)),
      st('Den Teig auf wenig Mehl zu einer straffen Kugel formen und mit der Naht (der Stelle, an der die Teigränder zusammenlaufen) nach oben in ein bemehltes Gärkörbchen legen – ersatzweise in eine Schüssel mit einem gut bemehlten Küchentuch.'),
      st('Das Gärkörbchen abgedeckt im CombiSteamer 45 Minuten gehen lassen, bis der Teig sichtbar aufgegangen ist und auf leichten Fingerdruck langsam zurückfedert.', gare(45, 'Körbchen auf den Gitterrost')),
      st('Das Körbchen herausnehmen. Den Wasserbehälter füllen und den CombiSteamer mit dem Kuchenblech auf Ebene 2 vorheizen. Den Laib auf Backpapier stürzen (die Naht liegt dann unten) und mit Mehl bestäuben.', preheat()),
      st('Das Brot mit dem Backpapier auf das heiße Blech ziehen und 10 Minuten mit Dampf anbacken – die Tür dabei geschlossen lassen.', steamer('Heißluft mit Beschwaden', 230, 10, 'Ebene 2')),
      st('Auf Heißluft ohne Dampf umschalten und weitere 40 Minuten backen, bis das Brot beim Klopfen auf die Unterseite hohl klingt.', steamer('Heißluft', 200, 40, 'trocken, für die Kruste')),
      st('Auf einem Gitter mindestens 2 Stunden auskühlen lassen, erst dann anschneiden.'),
    ],
    'baguette-poolish': [
      st('Am Vorabend den Poolish (flüssiger Vorteig mit sehr wenig Hefe, der über Nacht Aroma bildet) ansetzen: 200 g vom Weizenmehl, 200 ml kaltes Wasser und 1 g von der Hefe frisch verrühren und abgedeckt 12–16 Stunden bei Raumtemperatur stehen lassen, bis er voller Blasen ist.'),
      st('Am Backtag den Poolish mit dem restlichen Weizenmehl, der restlichen Hefe frisch und 130 ml Wasser im Famag 2 Minuten mischen, dann das Salz zugeben und 8 Minuten zu einem glatten Teig kneten.', famag(2, { mode: 'Mischen' }), famag(8)),
      st('Den Teig abgedeckt 90 Minuten bei Raumtemperatur gehen lassen und nach 30 und 60 Minuten dehnen und falten: Den Teig mit nasser Hand an einer Seite hochziehen und über den restlichen Teig legen, die Schüssel eine Vierteldrehung weiterdrehen und das reihum viermal wiederholen.'),
      st('Den Teig in 3 Stücke (je ca. 280 g) teilen, locker zu Rollen vorformen und 20 Minuten ruhen lassen. Dann jedes Stück flach drücken, von der langen Seite her straff aufrollen, die Naht festdrücken und zu 35 cm langen Stangen rollen. Mit der Naht nach unten auf bemehltes Backpapier auf das Kuchenblech legen.'),
      st('Die Baguettes auf dem Kuchenblech im CombiSteamer 35 Minuten gehen lassen.', gare(35, 'Kuchenblech Ebene 2')),
      st('Das Blech herausnehmen und die Baguettes mit dem Backpapier auf ein Brett ziehen. Das leere Blech wieder auf Ebene 2 einschieben, den Wasserbehälter füllen und den CombiSteamer vorheizen. Die Baguettes mit einer Rasierklinge oder einem sehr scharfen Messer dreimal schräg und flach einschneiden.', preheat()),
      st('Die Baguettes mit dem Backpapier auf das heiße Blech ziehen und 12 Minuten mit Dampf backen – die Tür dabei geschlossen lassen.', steamer('Heißluft mit Beschwaden', 230, 12, 'Ebene 2')),
      st('Auf Heißluft ohne Dampf umschalten und weitere 12 Minuten backen, bis die Kruste kräftig braun ist und knistert. Auf einem Gitter auskühlen lassen.', steamer('Heißluft', 220, 12, 'trocken, für die Kruste')),
    ],
    'wasserweck': [
      st('Die Hefe frisch mit dem Zucker in 300 ml lauwarmem Wasser auflösen. Mit Weizenmehl, Salz und Sonnenblumenöl im Famag 10 Minuten zu einem glatten, festen Teig kneten.', famag(10)),
      st('Den Teig in der Schüssel abdecken und im CombiSteamer 40 Minuten gehen lassen, bis er sich fast verdoppelt hat.', gare(40)),
      st('Den Teig in 10 Stücke (je ca. 83 g) teilen, rund wirken und zu ovalen Wecken (ca. 10 cm) rollen. Mit der Naht nach oben auf ein bemehltes Küchentuch legen und abgedeckt 30 Minuten bei Raumtemperatur gehen lassen. Inzwischen den Wasserbehälter füllen und den CombiSteamer mit dem Kuchenblech auf Ebene 2 vorheizen.', preheat(220)),
      st('Die Wecken umdrehen, auf Backpapier setzen und mit einem scharfen Messer der Länge nach ca. 1 cm tief einschneiden. Mit dem Backpapier auf das heiße Blech ziehen und 12 Minuten mit Dampf backen – die Tür dabei geschlossen lassen.', steamer('Heißluft mit Beschwaden', 220, 12, 'Ebene 2')),
      st('Auf Heißluft ohne Dampf umschalten und weitere 8 Minuten backen, bis die Wecken goldbraun sind und beim Klopfen auf die Unterseite hohl klingen. Auf einem Gitter auskühlen lassen.', steamer('Heißluft', 200, 8, 'trocken, für die Kruste')),
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
    'toastbrot-klassisch': 'homemade white sandwich bread loaf pan',
    'dinkel-vollkorntoast': 'whole grain spelt sandwich bread loaf',
    'milchtoast-hokkaido': 'Hokkaido milk bread loaf',
    'quarkbroetchen': 'Quarkbrötchen quark bread rolls',
    'koernerbroetchen': 'Körnerbrötchen multigrain bread rolls seeds',
    'milchbroetchen': 'Milchbrötchen soft milk bread rolls',
    'soda-bread': 'Irish soda bread',
    'bauernbrot-hefe': 'German mixed rye wheat bread loaf',
    'baguette-poolish': 'Baguette French bread',
    'wasserweck': 'Wasserweck Brötchen bread rolls',
  },
}
