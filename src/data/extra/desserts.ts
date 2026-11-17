// Backen & Desserts – Gruppe „Desserts“ (für Gäste). Regeln: docs/backen-regeln.md. Nur diese Datei bearbeiten.
import { backen, prod } from '../define'
import type { DeviceStep, DeviceSetting } from '../../types'
import type { ExtraGroup } from './types'

/** Geräte-Schritte aus denselben Texten wie die Rezeptschritte: `at` ordnet Einstellungen dem Schritt (Index ab 0) zu */
const ds = (steps: string[], at: Record<number, DeviceSetting[]> = {}): DeviceStep[] =>
  steps.map((text, i) => (at[i] ? { text, settings: at[i] } : { text }))


const pannaSteps = [
  'Die Gelatine in einer Schüssel mit reichlich kaltem Wasser 5 Minuten einweichen.',
  'Sahne, Milch, Zucker und Vanillezucker in einem Topf unter Rühren erhitzen, bis sie dampfen (nicht kochen lassen). Den Topf vom Herd nehmen.',
  'Die Gelatine gut ausdrücken, in der heißen Sahnemischung auflösen und die Masse durch ein Sieb in 6 Gläser oder Förmchen gießen. Abkühlen lassen und mindestens 4 Stunden im Kühlschrank fest werden lassen.',
  'Für die Beerensauce die Beerenmischung TK mit dem Puderzucker 5 Minuten köcheln lassen, kurz pürieren und abkühlen lassen. Zum Servieren über die Panna cotta geben.',
]
const mousseSteps = [
  'Die Zartbitterschokolade grob hacken und in einer Metallschüssel über einem Topf mit knapp siedendem Wasser schmelzen. Etwas abkühlen lassen.',
  'Die Eier trennen. Die Eigelbe mit der Hälfte des Zuckers cremig aufschlagen und die lauwarme Schokolade unterrühren.',
  'Die Sahne steif schlagen. Das Eiweiß mit der Prise Salz steif schlagen, den restlichen Zucker einrieseln lassen und weiterschlagen, bis die Masse glänzt.',
  'Erst die Sahne, dann das Eiweiß mit einem Teigschaber vorsichtig unter die Schokoladenmasse heben. In Gläser füllen und mindestens 4 Stunden, besser über Nacht, kalt stellen. Wegen der rohen Eier nur ganz frische Eier nehmen und innerhalb von 2 Tagen essen.',
]
const gruetzeSteps = [
  'Beerenmischung TK, Himbeeren TK, 100 g Zucker und Rotwein in einen Topf geben, aufkochen und 5 Minuten köcheln lassen.',
  'Die Speisestärke bis auf 1 TL (für die Vanillesauce) mit 5 EL kaltem Wasser glatt rühren, in die kochenden Früchte rühren und 1 Minute unter Rühren aufkochen. In eine Schüssel füllen, abkühlen lassen und kalt stellen.',
  'Für die Vanillesauce 400 ml von der Milch mit dem Vanillezucker erhitzen. Die Eigelbe mit den restlichen 50 g Zucker, 1 TL Speisestärke und der übrigen Milch verrühren.',
  'Die heiße Milch unter Rühren in die Eigelbmasse gießen, zurück in den Topf geben und bei niedriger Hitze rühren, bis die Sauce cremig bindet (nicht kochen, sie gerinnt sonst). Kalt oder lauwarm zur gut gekühlten Roten Grütze servieren.',
]
const semiSteps = [
  'Die Himbeeren TK auftauen lassen, 200 g davon pürieren und durch ein Sieb streichen. Die übrigen 100 g Himbeeren beiseitestellen.',
  'Die Eigelbe mit Zucker und Vanillezucker in einer Metallschüssel über einem Topf mit knapp siedendem Wasser 5 Minuten aufschlagen, bis die Masse dick ist und etwa 70 °C hat, dann kalt weiterschlagen, bis sie abgekühlt ist.',
  'Die Mandeln in einer trockenen Pfanne goldbraun rösten, abkühlen lassen und grob hacken.',
  'Die Sahne steif schlagen und mit den Mandeln vorsichtig unter die Eigelbmasse heben. Das Himbeerpüree nur grob unterziehen, sodass Marmorstreifen entstehen.',
  'Eine Kastenform (ca. 25 cm) mit Frischhaltefolie auslegen, die Masse einfüllen, die ganzen Himbeeren darauf verteilen und mindestens 6 Stunden, besser über Nacht, einfrieren. Zum Servieren 10 Minuten vorher aus dem Gefrierfach nehmen, stürzen und in Scheiben schneiden.',
]
const zabaioneSteps = [
  'Die Himbeeren TK auftauen lassen und auf 4 Gläser oder tiefe Teller verteilen.',
  'Die Eigelbe mit dem Zucker in einer Metallschüssel über einem Topf mit knapp siedendem Wasser (Wasserbad, die Schüssel darf das Wasser nicht berühren) verrühren und den Marsala nach und nach zugeben.',
  'Mit dem Schneebesen 8 bis 10 Minuten kräftig schlagen, bis die Masse dick, hell und schaumig ist und etwa 70 °C hat. Sofort warm über die Beeren geben und servieren.',
]
const gebranntSteps = [
  'Sahne, Milch und Vanillezucker in einem Topf erhitzen, bis sie dampfen, vom Herd nehmen und 10 Minuten ziehen lassen.',
  'Die Eigelbe mit 80 g Zucker verrühren (nicht schaumig schlagen), die warme Sahnemilch langsam unter Rühren zugießen und die Masse durch ein Sieb in 6 flache Förmchen (je ca. 150 ml) füllen. Schaum mit einem Löffel abnehmen.',
  'Die Förmchen mit Alufolie abdecken und im CombiSteamer auf dem gelochten Garbehälter stocken lassen, bis die Creme in der Mitte nur noch leicht wackelt. Auskühlen lassen und mindestens 4 Stunden kalt stellen.',
  'Kurz vor dem Servieren den restlichen Zucker (60 g) gleichmäßig auf die Cremes streuen und mit einem Küchenbrenner karamellisieren (oder unter dem Grill des Backofens, Förmchen dabei in Eiswasser stellen). Die Karamellschicht 2 Minuten hart werden lassen.',
]
const germSteps = [
  'Die Milch lauwarm erwärmen, die Hefe frisch hineinbröckeln und mit 1 TL vom Zucker auflösen. Mit Weizenmehl, dem übrigen Zucker, Ei, Salz und 50 g weicher Butter 8 Minuten zu einem glatten, weichen Teig kneten.',
  'Den Teig in der Schüssel abdecken und im CombiSteamer gehen lassen, bis er sich etwa verdoppelt hat.',
  'Den Teig in 8 gleich große Stücke teilen, flach drücken und je 1 EL Pflaumenmus (20 g) in die Mitte setzen. Den Teig darüber schließen und zu glatten Kugeln formen, mit der Naht nach unten 15 Minuten ruhen lassen.',
  'Den Wasserbehälter des CombiSteamers füllen. Die Knödel mit Abstand auf Backpapier in den gelochten Garbehälter legen und dämpfen, bis sie aufgegangen und fest sind.',
  'Die übrigen 60 g Butter zerlassen, Mohn und Puderzucker mischen. Die Germknödel mit der Butter übergießen und mit dem Mohnzucker bestreuen. Sofort servieren.',
]
const dampfSteps = [
  '200 ml von der Milch lauwarm erwärmen, die Hefe frisch hineinbröckeln und mit 1 TL vom Zucker auflösen. Mit Weizenmehl, 30 g Zucker, Ei, Salz und 50 g weicher Butter 8 Minuten zu einem glatten Teig kneten.',
  'Den Teig in der Schüssel abdecken und im CombiSteamer gehen lassen, bis er sich etwa verdoppelt hat.',
  'Den Teig in 8 Stücke teilen, zu Kugeln formen, mit etwas von der zerlassenen Butter (40 g) bestreichen und abgedeckt weitere 15 Minuten gehen lassen.',
  'Den Wasserbehälter des CombiSteamers füllen. Die Dampfnudeln mit Abstand auf Backpapier in den gelochten Garbehälter legen und dämpfen, bis sie aufgegangen und fest sind. Tür während des Garens nicht öffnen und mit der restlichen Butter bepinseln.',
  'Für die Vanillesauce die übrigen 400 ml Milch mit dem Vanillezucker erhitzen. Eigelbe, den restlichen Zucker (20 g) und die Speisestärke verrühren, die heiße Milch einrühren, zurück in den Topf geben und bei niedriger Hitze rühren, bis die Sauce bindet. Zu den warmen Dampfnudeln reichen.',
]
const cannoliSteps = [
  'Den Ricotta in einem Sieb mit Küchenpapier mindestens 1 Stunde im Kühlschrank abtropfen lassen.',
  'Ricotta, Mascarpone und Puderzucker glatt rühren. Von der Orange die Schale fein abreiben, den Saft auspressen und mit 1 EL Saft und der Schale unterrühren. Die Zartbitterschokolade fein hacken und die Hälfte unterheben.',
  'Die Löffelbiskuits grob zerbröseln, die Mandeln grob hacken und mischen.',
  'In 6 Gläser abwechselnd Brösel und Creme schichten, mit Creme abschließen. Mit der restlichen Schokolade bestreuen und mindestens 1 Stunde kalt stellen.',
]

export const desserts: ExtraGroup = {
  recipes: [
    backen('dessert', 'tiramisu', 'Tiramisu',
      {
        cuisine: 'it',
        time: 390,
        yields: { name: 'Tiramisu (selbstgemacht)', amount: 6, unit: 'Portion', shelf: 2, store: 'im Kühlschrank' },
        lighter: 'Die Hälfte des Mascarpones durch Skyr ersetzen und 30 g Zucker weniger nehmen – spart rund 170 kcal pro Portion und schmeckt frischer.',
      },
      '500 g Mascarpone | 4 Stk Ei | 100 g Zucker | 200 g Löffelbiskuits | 20 g Kaffee gemahlen | 2 EL Backkakao | 1 Prise Salz',
      [
        'Den Kaffee gemahlen mit 300 ml kochendem Wasser aufbrühen (oder 4 Espresso), durch einen Filter gießen und abkühlen lassen.',
        'Die Eier trennen. Eigelb mit dem Zucker in einer Metallschüssel über einem Topf mit siedendem Wasser 5 Minuten hell und dick aufschlagen, bis die Masse etwa 70 °C hat, dann kalt weiterschlagen, bis sie abgekühlt ist.',
        'Den Mascarpone glatt rühren und die Eigelbmasse unterrühren. Das Eiweiß mit der Prise Salz steif schlagen und vorsichtig unterheben.',
        'Die Hälfte der Löffelbiskuits kurz in den Kaffee tauchen und eine Form (ca. 20 × 25 cm) damit auslegen, die Hälfte der Creme daraufstreichen. Mit den übrigen Löffelbiskuits und der restlichen Creme wiederholen.',
        'Abgedeckt mindestens 6 Stunden, besser über Nacht, im Kühlschrank durchziehen lassen. Vor dem Servieren dick mit Backkakao bestäuben.',
      ]),
    backen('dessert', 'panna-cotta', 'Panna cotta mit Beerensauce',
      {
        cuisine: 'it',
        time: 300,
        yields: { name: 'Panna cotta (selbstgemacht)', amount: 6, unit: 'Portion', shelf: 3, store: 'im Kühlschrank' },
        lighter: 'Die Hälfte der Sahne (250 ml) durch Milch ersetzen und 1 Blatt Gelatine mehr nehmen – spart rund 95 kcal pro Portion.',
      },
      '500 ml Sahne | 250 ml Milch | 80 g Zucker | 1 Pck Vanillezucker | 5 Blatt Gelatine | 300 g Beerenmischung TK | 40 g Puderzucker',
      pannaSteps),
    backen('dessert', 'mousse-au-chocolat', 'Mousse au Chocolat',
      {
        cuisine: 'de',
        time: 300,
        yields: { name: 'Mousse au Chocolat (selbstgemacht)', amount: 6, unit: 'Portion', shelf: 2, store: 'im Kühlschrank' },
        lighter: '100 ml Sahne weglassen und dafür 2 Eiklar zusätzlich steif schlagen und unterheben – spart rund 45 kcal pro Portion.',
      },
      '200 g Zartbitterschokolade | 4 Stk Ei | 30 g Zucker | 200 ml Sahne | 1 Prise Salz',
      mousseSteps),
    backen('dessert', 'rote-gruetze', 'Rote Grütze mit Vanillesauce',
      {
        cuisine: 'de',
        time: 240,
        yields: { name: 'Rote Grütze (selbstgemacht)', amount: 6, unit: 'Portion', shelf: 4, store: 'im Kühlschrank' },
        lighter: 'Die Vanillesauce durch 400 g Skyr mit 1 Pck Vanillezucker ersetzen – spart rund 80 kcal pro Portion.',
      },
      '600 g Beerenmischung TK | 200 g Himbeeren TK | 150 g Zucker | 250 ml Rotwein | 45 g Speisestärke | 500 ml Milch | 4 Stk Eigelb | 1 Pck Vanillezucker',
      gruetzeSteps),
    backen('dessert', 'zabaione-beeren', 'Zabaione mit Beeren',
      {
        cuisine: 'it',
        time: 25,
        yields: { name: 'Zabaione mit Beeren (selbstgemacht)', amount: 4, unit: 'Portion', shelf: 1, store: 'im Kühlschrank' },
        lighter: 'Den Zucker auf 40 g halbieren, der Marsala bringt genug Süße – spart rund 40 kcal pro Portion.',
      },
      '6 Stk Eigelb | 80 g Zucker | 150 ml Marsala | 300 g Himbeeren TK',
      zabaioneSteps),
    backen('dessert', 'gebrannte-creme', 'Gebrannte Creme (Crème brûlée)',
      {
        cuisine: 'de',
        time: 300,
        yields: { name: 'Gebrannte Creme (selbstgemacht)', amount: 6, unit: 'Portion', shelf: 2, store: 'im Kühlschrank' },
        lighter: 'Die Hälfte der Sahne (250 ml) durch Milch ersetzen – spart rund 95 kcal pro Portion, die Creme wird etwas weniger üppig.',
      },
      '500 ml Sahne | 100 ml Milch | 6 Stk Eigelb | 140 g Zucker | 2 Pck Vanillezucker',
      gebranntSteps),
    backen('dessert', 'germknoedel', 'Germknödel mit Mohn',
      {
        cuisine: 'de',
        time: 130,
        yields: { name: 'Germknödel (selbstgemacht)', amount: 8, unit: 'Stk', shelf: 2, store: 'im Kühlschrank' },
        lighter: 'Die Butter zum Übergießen halbieren (30 g) und den Mohnzucker mit der Hälfte Puderzucker mischen – spart rund 50 kcal pro Knödel.',
      },
      '400 g Weizenmehl | 25 g Hefe frisch | 200 ml Milch | 40 g Zucker | 110 g Butter | 1 Stk Ei | 1 Prise Salz | 160 g Pflaumenmus | 50 g Mohn | 50 g Puderzucker',
      germSteps),
    backen('dessert', 'dampfnudeln-vanillesauce', 'Dampfnudeln mit Vanillesauce',
      {
        cuisine: 'de',
        time: 120,
        yields: { name: 'Dampfnudeln (selbstgemacht)', amount: 8, unit: 'Stk', shelf: 2, store: 'im Kühlschrank' },
        lighter: 'Die Butter zum Bestreichen auf 20 g halbieren und den Zucker in der Vanillesauce halbieren – spart rund 30 kcal pro Dampfnudel.',
      },
      '400 g Weizenmehl | 25 g Hefe frisch | 600 ml Milch | 50 g Zucker | 90 g Butter | 1 Stk Ei | 1 Prise Salz | 3 Stk Eigelb | 1 Pck Vanillezucker | 1 TL Speisestärke',
      dampfSteps),
    backen('dessert', 'cannoli-creme', 'Cannoli-Creme im Glas',
      {
        cuisine: 'it',
        time: 130,
        yields: { name: 'Cannoli-Creme (selbstgemacht)', amount: 6, unit: 'Portion', shelf: 2, store: 'im Kühlschrank' },
        lighter: 'Den Mascarpone durch Skyr ersetzen und nur 40 g Schokolade nehmen – spart rund 110 kcal pro Portion.',
      },
      '400 g Ricotta | 125 g Mascarpone | 80 g Puderzucker | 80 g Zartbitterschokolade | 1 Stk Orange | 100 g Löffelbiskuits | 30 g Mandeln',
      cannoliSteps),
    backen('dessert', 'semifreddo-himbeeren', 'Semifreddo mit Himbeeren',
      {
        cuisine: 'it',
        time: 420,
        yields: { name: 'Semifreddo (selbstgemacht)', amount: 6, unit: 'Portion', shelf: 30, store: 'tiefgekühlt im Gefrierfach' },
        lighter: '100 ml Sahne durch 100 g Skyr ersetzen – spart rund 35 kcal pro Portion, das Semifreddo bleibt cremig.',
      },
      '4 Stk Eigelb | 100 g Zucker | 1 Pck Vanillezucker | 400 ml Sahne | 300 g Himbeeren TK | 50 g Mandeln',
      semiSteps),
  ],
  catalog: {
    konserven: ['Löffelbiskuits', 'Kaffee gemahlen', 'Zartbitterschokolade', 'Marsala', 'Pflaumenmus', 'Mohn', 'Gelatine'],
  },
  products: {
    Löffelbiskuits: prod(200, 'g', 1.29, 365, 30, 'Pck'),
    'Kaffee gemahlen': prod(500, 'g', 4.99, 365, 60, 'Pck'),
    Zartbitterschokolade: prod(200, 'g', 1.49, 270, 90, 'Tafel'),
    Marsala: prod(750, 'ml', 4.49, 1000, 180, 'Flasche'),
    Pflaumenmus: prod(400, 'g', 1.99, 365, 60, 'Glas'),
    Mohn: prod(100, 'g', 1.79, 365, 90, 'Pck'),
    Gelatine: prod(12, 'Blatt', 1.19, 730, 365, 'Pck'),
  },
  nutrition: {
    Löffelbiskuits: [390, 8, 4, 80, 1],
    // nur was beim Aufbrühen ins Getränk geht (20 g Pulver ≈ 300 ml Kaffee ≈ 6 kcal)
    'Kaffee gemahlen': [30, 1.5, 0, 3, 0],
    Zartbitterschokolade: [540, 6, 35, 45, 9],
    Marsala: [150, 0.1, 0, 12, 0],
    Pflaumenmus: [240, 1, 0.3, 56, 3],
    Mohn: [480, 20, 42, 5, 20],
    Gelatine: [335, 85, 0.1, 0, 0],
  },
  grams: { Gelatine: { Blatt: 2 } },
  nonVeg: ['Gelatine'],
  deviceSteps: {
    'cannoli-creme': ds(cannoliSteps),
    'panna-cotta': ds(pannaSteps, {
      1: [{ device: 'bora', mode: 'Kochzone', level: '4', note: 'erhitzen, nicht kochen' }],
      3: [{ device: 'bora', mode: 'Kochzone', level: '3', minutes: 5, note: 'köcheln' }],
    }),
    'mousse-au-chocolat': ds(mousseSteps, {
      0: [{ device: 'bora', mode: 'Kochzone', level: 'Schmelzen', note: 'Wasserbad' }],
    }),
    'rote-gruetze': ds(gruetzeSteps, {
      0: [{ device: 'bora', mode: 'Kochzone', level: '6', note: 'aufkochen' }, { device: 'bora', mode: 'Kochzone', level: '3', minutes: 5, note: 'köcheln' }],
      1: [{ device: 'bora', mode: 'Kochzone', level: '5', minutes: 1, note: 'aufkochen' }],
      2: [{ device: 'bora', mode: 'Kochzone', level: '5', note: 'Milch erhitzen' }],
      3: [{ device: 'bora', mode: 'Kochzone', level: '2', minutes: 5, note: 'zur Rose abziehen, nicht kochen' }],
    }),
    'zabaione-beeren': ds(zabaioneSteps, {
      1: [{ device: 'bora', mode: 'Kochzone', level: '3', note: 'Wasserbad, Wasser nur leicht siedend' }],
      2: [{ device: 'bora', mode: 'Kochzone', level: '3', minutes: 9, note: 'Wasserbad' }],
    }),
    'gebrannte-creme': ds(gebranntSteps, {
      0: [{ device: 'bora', mode: 'Kochzone', level: '4', note: 'erhitzen, nicht kochen' }],
      2: [{ device: 'steamer', mode: 'Dämpfen', temp: 90, minutes: 30, note: 'Wasserbehälter füllen, Förmchen mit Folie abdecken, gelocht' }],
    }),
    germknoedel: ds(germSteps, {
      1: [{ device: 'steamer', mode: 'Profi-Backen Aufgehen lassen', temp: 35, minutes: 45, note: 'Schüssel auf den Gitterrost' }],
      3: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 20, note: 'Wasserbehälter füllen, gelocht mit Backpapier' }],
    }),
    'dampfnudeln-vanillesauce': ds(dampfSteps, {
      1: [{ device: 'steamer', mode: 'Profi-Backen Aufgehen lassen', temp: 35, minutes: 45, note: 'Schüssel auf den Gitterrost' }],
      3: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 22, note: 'Wasserbehälter füllen, gelocht mit Backpapier' }],
      4: [{ device: 'bora', mode: 'Kochzone', level: '5', note: 'Milch erhitzen' }, { device: 'bora', mode: 'Kochzone', level: '2', minutes: 5, note: 'binden, nicht kochen' }],
    }),
    'semifreddo-himbeeren': ds(semiSteps, {
      1: [{ device: 'bora', mode: 'Kochzone', level: '3', minutes: 5, note: 'Wasserbad' }],
      2: [{ device: 'bora', mode: 'Kochzone', level: '5', minutes: 3, note: 'trockene Pfanne' }],
    }),
    tiramisu: [
      {
        text: 'Den Kaffee gemahlen mit 300 ml kochendem Wasser aufbrühen (oder 4 Espresso), durch einen Filter gießen und abkühlen lassen.',
        settings: [{ device: 'bora', mode: 'Kochzone', level: 'Power', note: 'Wasser aufkochen' }],
      },
      {
        text: 'Die Eier trennen. Eigelb mit dem Zucker in einer Metallschüssel über einem Topf mit leise siedendem Wasser 5 Minuten hell und dick aufschlagen, bis die Masse etwa 70 °C hat, dann kalt weiterschlagen, bis sie abgekühlt ist.',
        settings: [{ device: 'bora', mode: 'Kochzone', level: '3', minutes: 5, note: 'Wasserbad' }],
      },
      { text: 'Den Mascarpone glatt rühren und die Eigelbmasse unterrühren. Das Eiweiß mit der Prise Salz steif schlagen und vorsichtig unterheben.' },
      {
        text: 'Die Hälfte der Löffelbiskuits kurz in den Kaffee tauchen und eine Form (ca. 20 × 25 cm) damit auslegen, die Hälfte der Creme daraufstreichen. Mit den übrigen Löffelbiskuits und der restlichen Creme wiederholen.',
      },
      { text: 'Abgedeckt mindestens 6 Stunden, besser über Nacht, im Kühlschrank durchziehen lassen. Vor dem Servieren dick mit Backkakao bestäuben.' },
    ],
  },
  imageQueries: {
    tiramisu: 'tiramisu dessert',
    'panna-cotta': 'panna cotta',
    'mousse-au-chocolat': 'chocolate mousse',
    'rote-gruetze': 'Rote Grütze',
    'zabaione-beeren': 'zabaione',
    'gebrannte-creme': 'crème brûlée',
    germknoedel: 'Germknödel',
    'dampfnudeln-vanillesauce': 'Dampfnudeln',
    'cannoli-creme': 'cannoli cream dessert',
    'semifreddo-himbeeren': 'semifreddo',
  },
}
