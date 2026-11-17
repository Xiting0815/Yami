// Backen & Desserts – Gruppe „Kuchen“ (Blechkuchen & Hefeteig). Regeln: docs/backen-regeln.md. Nur diese Datei bearbeiten.
import { backen, prod } from '../define'
import type { DeviceStep } from '../../types'
import type { RawRecipe } from '../define'
import type { ExtraGroup } from './types'

const recipes: RawRecipe[] = [
    backen('kuchen', 'bienenstich', 'Bienenstich',
      {
        time: 210,
        yields: { name: 'Bienenstich (selbstgebacken)', amount: 12, unit: 'Stk', shelf: 3, store: 'im Kühlschrank' },
        lighter: 'Für die Creme 250 g Magerquark statt der geschlagenen Sahne unter den Pudding rühren und nur 100 g Mandelblättchen nehmen – spart rund 60 kcal pro Stück.',
      },
      '375 g Weizenmehl | 21 g Hefe frisch | 675 ml Milch | 210 g Zucker | 160 g Butter | 1 Stk Ei | 1 Prise Salz | 2 EL Honig | 245 ml Sahne | 150 g Mandelblättchen | 1 Pck Vanillepuddingpulver',
      [
        'Für den Hefeteig 175 ml von der Milch lauwarm erwärmen und die Hefe frisch mit 1 TL vom Zucker darin auflösen. Mit dem Weizenmehl, 50 g Zucker, 60 g weicher Butter, dem Ei und der Prise Salz 5 Minuten zu einem glatten Teig kneten.',
        'Den Teig zugedeckt an einem warmen Ort 45 Minuten gehen lassen, bis er sich etwa verdoppelt hat.',
        'Für den Belag 100 g Butter, 100 g Zucker, den Honig und 45 ml von der Sahne aufkochen, die Mandelblättchen unterrühren und 2 Minuten köcheln lassen. Etwas abkühlen lassen.',
        'Eine Springform (26 cm) fetten, den Teig hineindrücken, den Mandelbelag daraufstreichen und weitere 15 Minuten gehen lassen. Den Ofen auf 180 °C Ober-/Unterhitze vorheizen.',
        'Den Kuchen 25–30 Minuten goldbraun backen und auf einem Gitter vollständig auskühlen lassen.',
        'Aus dem Vanillepuddingpulver, 500 ml Milch und 60 g Zucker nach Packungsangabe einen Pudding kochen, Frischhaltefolie direkt auf die Oberfläche legen und abkühlen lassen.',
        'Den Kuchen waagerecht halbieren und den Mandeldeckel in 12 Stücke schneiden. 200 ml Sahne steif schlagen, den kalten Pudding glatt rühren und die Sahne unterheben.',
        'Die Creme auf den Boden streichen, die Mandelstücke darauflegen und den Bienenstich mindestens 1 Stunde kühlen.',
      ]),

    backen('kuchen', 'butterkuchen', 'Butterkuchen vom Blech',
      {
        time: 120,
        yields: { name: 'Butterkuchen (selbstgebacken)', amount: 16, unit: 'Stk', shelf: 2, store: 'luftdicht bei Raumtemperatur', frozen: 90 },
        lighter: 'Die Butterflöckchen auf 100 g und die Mandelblättchen auf 50 g reduzieren – spart rund 35 kcal pro Stück.',
      },
      '400 g Weizenmehl | 21 g Hefe frisch | 200 ml Milch | 150 g Zucker | 210 g Butter | 1 Stk Ei | 1 Prise Salz | 1 Pck Vanillezucker | 80 g Mandelblättchen',
      [
        'Die Milch lauwarm erwärmen und die Hefe frisch mit 1 TL vom Zucker darin auflösen. Mit dem Weizenmehl, 50 g Zucker, 60 g weicher Butter, dem Ei und der Prise Salz 5 Minuten zu einem glatten Teig kneten.',
        'Den Teig zugedeckt an einem warmen Ort 45 Minuten gehen lassen, bis er sich etwa verdoppelt hat.',
        'Den Teig auf einem mit Backpapier belegten Blech (ca. 30 x 40 cm) ausrollen und weitere 20 Minuten gehen lassen. Inzwischen den Ofen auf 180 °C Ober-/Unterhitze vorheizen.',
        'Mit dem Finger oder Kochlöffelstiel tiefe Mulden in den Teig drücken. 150 g kalte Butter in Flöckchen auf dem Teig verteilen, mit 100 g Zucker, dem Vanillezucker und den Mandelblättchen bestreuen.',
        'Den Kuchen 20–25 Minuten goldbraun backen, auf dem Blech etwas abkühlen lassen und noch lauwarm in 16 Stücke schneiden.',
      ]),

    backen('kuchen', 'zwetschgendatschi', 'Zwetschgendatschi',
      {
        time: 130,
        yields: { name: 'Zwetschgendatschi (selbstgebacken)', amount: 16, unit: 'Stk', shelf: 2, store: 'luftdicht bei Raumtemperatur', frozen: 90 },
        lighter: 'Den Zucker im Teig auf 30 g und auf den Früchten auf 40 g halbieren – reife Zwetschgen sind süß genug und das spart rund 10 kcal pro Stück.',
      },
      '400 g Weizenmehl | 21 g Hefe frisch | 200 ml Milch | 100 g Zucker | 60 g Butter | 1 Stk Ei | 1 Prise Salz | 1200 g Zwetschgen | 3 EL Paniermehl | 1 TL Zimt gemahlen',
      [
        'Die Milch lauwarm erwärmen und die Hefe frisch mit 1 TL vom Zucker darin auflösen. Mit dem Weizenmehl, 40 g Zucker, 60 g weicher Butter, dem Ei und der Prise Salz 5 Minuten zu einem glatten Teig kneten.',
        'Den Teig zugedeckt an einem warmen Ort 45 Minuten gehen lassen, bis er sich etwa verdoppelt hat.',
        'Die Zwetschgen waschen, entsteinen und je nach Größe halbieren oder vierteln, dabei jeweils fast durchschneiden, damit sie wie Fächer aufstehen.',
        'Den Teig auf einem mit Backpapier belegten Blech (ca. 30 x 40 cm) ausrollen, mit dem Paniermehl bestreuen und die Zwetschgen dicht an dicht mit der Schnittseite nach oben darauflegen. Weitere 20 Minuten gehen lassen. Inzwischen den Ofen auf 180 °C Ober-/Unterhitze vorheizen.',
        'Den Zimt mit 60 g Zucker mischen und über die Früchte streuen. Den Datschi 30–35 Minuten backen, bis der Rand goldbraun ist, und in 16 Stücke schneiden.',
      ]),

    backen('kuchen', 'streuselkuchen-apfel', 'Streuselkuchen mit Äpfeln',
      {
        time: 135,
        yields: { name: 'Streuselkuchen mit Äpfeln (selbstgebacken)', amount: 16, unit: 'Stk', shelf: 2, store: 'luftdicht bei Raumtemperatur', frozen: 90 },
        lighter: 'Die Streusel mit 100 g statt 150 g Butter und 110 g statt 150 g Zucker machen – spart rund 35 kcal pro Stück.',
      },
      '650 g Weizenmehl | 21 g Hefe frisch | 200 ml Milch | 190 g Zucker | 210 g Butter | 1 Stk Ei | 1 Prise Salz | 4 Stk Apfel säuerlich | 1 Pck Vanillezucker | 1 TL Zimt gemahlen',
      [
        'Die Milch lauwarm erwärmen und die Hefe frisch mit 1 TL vom Zucker darin auflösen. Mit 400 g Weizenmehl, 40 g Zucker, 60 g weicher Butter, dem Ei und der Prise Salz 5 Minuten zu einem glatten Teig kneten.',
        'Den Teig zugedeckt an einem warmen Ort 45 Minuten gehen lassen, bis er sich etwa verdoppelt hat.',
        'Für die Streusel 250 g Weizenmehl, 150 g Zucker, den Vanillezucker, den Zimt und 150 g Butter in Stückchen mit den Händen zu groben Streuseln verkneten und kalt stellen.',
        'Die Äpfel schälen, entkernen und in dünne Spalten schneiden.',
        'Den Teig auf einem mit Backpapier belegten Blech (ca. 30 x 40 cm) ausrollen, mit den Apfelspalten belegen und weitere 20 Minuten gehen lassen. Inzwischen den Ofen auf 180 °C Ober-/Unterhitze vorheizen.',
        'Die Streusel gleichmäßig auf den Äpfeln verteilen und den Kuchen 30–35 Minuten goldbraun backen. Auskühlen lassen und in 16 Stücke schneiden.',
      ]),

    backen('kuchen', 'marmorkuchen', 'Marmorkuchen',
      {
        time: 90,
        yields: { name: 'Marmorkuchen (selbstgebacken)', amount: 12, unit: 'Stk', shelf: 5, store: 'luftdicht bei Raumtemperatur', frozen: 60 },
        lighter: 'Die Butter auf 150 g reduzieren und dafür 150 g Magerquark in den Teig rühren – spart rund 55 kcal pro Stück.',
      },
      '300 g Weizenmehl | 250 g Butter | 200 g Zucker | 1 Pck Vanillezucker | 4 Stk Ei | 2 TL Backpulver | 150 ml Milch | 1 Prise Salz | 3 EL Backkakao',
      [
        'Die Kastenform (ca. 28 cm) fetten und mit Mehl ausstäuben. Den Ofen auf 175 °C Ober-/Unterhitze vorheizen.',
        'Die weiche Butter mit Zucker, Vanillezucker und der Prise Salz cremig rühren. Die Eier einzeln unterrühren.',
        'Das Weizenmehl mit dem Backpulver mischen und abwechselnd mit 100 ml von der Milch unter den Teig rühren, bis er schwer vom Löffel reißt.',
        'Die Hälfte des Teigs in die Form füllen. Unter die andere Hälfte den Backkakao und die restlichen 50 ml Milch rühren und den dunklen Teig daraufgeben. Mit einer Gabel spiralförmig durch beide Teige ziehen, damit ein Marmormuster entsteht.',
        'Den Kuchen 55–60 Minuten backen, bis ein Holzstäbchen ohne Teig herauskommt. 10 Minuten in der Form ruhen lassen, stürzen und auskühlen lassen.',
      ]),

    backen('kuchen', 'kaesekuchen-ohne-boden', 'Käsekuchen ohne Boden',
      {
        time: 110,
        yields: { name: 'Käsekuchen (selbstgebacken)', amount: 12, unit: 'Stk', shelf: 4, store: 'im Kühlschrank', frozen: 60 },
        lighter: 'Den Speisequark komplett durch Magerquark ersetzen und die Butter weglassen – spart rund 65 kcal pro Stück.',
      },
      '500 g Speisequark | 500 g Magerquark | 4 Stk Ei | 200 g Zucker | 1 Pck Vanillezucker | 1 Pck Vanillepuddingpulver | 80 g Butter | 250 ml Milch | 1 Stk Zitrone unbehandelt',
      [
        'Eine Springform (26 cm) fetten. Den Ofen auf 170 °C Ober-/Unterhitze vorheizen. Die Butter in einem Topf schmelzen und etwas abkühlen lassen.',
        'Die Zitrone heiß abwaschen, die Schale abreiben und den Saft auspressen.',
        'Speisequark, Magerquark, Eier, Zucker, Vanillezucker, Vanillepuddingpulver, die geschmolzene Butter, Milch sowie Zitronenschale und Zitronensaft mit dem Schneebesen zu einer glatten Masse verrühren und in die Form gießen.',
        'Den Käsekuchen 60 Minuten backen, bis die Oberfläche goldgelb ist und die Mitte noch leicht wackelt. Den Ofen ausschalten und den Kuchen bei leicht geöffneter Tür 15 Minuten darin ruhen lassen.',
        'Den Kuchen vollständig in der Form auskühlen lassen, vom Rand lösen und mindestens 2 Stunden kühlen. In 12 Stücke schneiden.',
      ]),

    backen('kuchen', 'hefezopf', 'Hefezopf',
      {
        time: 150,
        yields: { name: 'Hefezopf (selbstgebacken)', amount: 12, unit: 'Stk', shelf: 3, store: 'in Folie bei Raumtemperatur', frozen: 90 },
        lighter: 'Die Butter im Teig auf 40 g und den Zucker auf 50 g reduzieren sowie die Mandelblättchen weglassen – spart rund 45 kcal pro Stück.',
      },
      '500 g Weizenmehl | 21 g Hefe frisch | 220 ml Milch | 70 g Zucker | 80 g Butter | 1 Stk Ei | 1 Stk Eigelb | 1 Prise Salz | 1 Pck Vanillezucker | 1 Stk Zitrone unbehandelt | 30 g Mandelblättchen',
      [
        'Die Milch bis auf 20 ml lauwarm erwärmen und die Hefe frisch mit 1 TL vom Zucker darin auflösen. Mit Weizenmehl, restlichem Zucker, Butter in Stückchen, Ei, Salz, Vanillezucker und der abgeriebenen Zitronenschale 8 Minuten zu einem glatten, weichen Teig kneten.',
        'Den Teig abgedeckt 45 Minuten gehen lassen, bis er sich etwa verdoppelt hat.',
        'Den Teig in drei gleich große Stücke teilen, jedes zu einem etwa 45 cm langen Strang rollen und die Stränge zu einem Zopf flechten. Die Enden unterschlagen.',
        'Den Zopf auf ein mit Backpapier belegtes Kuchenblech legen und 20 Minuten gehen lassen. Inzwischen den Ofen auf 180 °C Ober-/Unterhitze vorheizen.',
        'Das Eigelb mit den 20 ml Milch verquirlen, den Zopf damit bestreichen und die Mandelblättchen darüberstreuen.',
        'Den Zopf auf dem Blech 30–35 Minuten goldbraun backen. Er klingt beim Klopfen auf die Unterseite hohl. Auf einem Gitter auskühlen lassen und in 12 Scheiben schneiden.',
      ]),

    backen('kuchen', 'torta-della-nonna', 'Torta della Nonna',
      {
        cuisine: 'it',
        time: 150,
        yields: { name: 'Torta della Nonna (selbstgebacken)', amount: 12, unit: 'Stk', shelf: 3, store: 'im Kühlschrank' },
        lighter: 'Nur die Hälfte der Pinienkerne verwenden und die Creme mit 30 g weniger Zucker kochen – spart rund 20 kcal pro Stück.',
      },
      '300 g Weizenmehl | 150 g Butter | 220 g Zucker | 6 Stk Eigelb | 1 TL Backpulver | 2 Stk Zitrone unbehandelt | 500 ml Milch | 40 g Speisestärke | 1 Pck Vanillezucker | 40 g Pinienkerne | 2 EL Puderzucker',
      [
        'Für den Mürbeteig Weizenmehl, Backpulver, 100 g Zucker und die kalte Butter in Stückchen verkneten. Zwei Eigelb und die abgeriebene Schale von 1 Zitrone zugeben und rasch zu einem glatten Teig kneten. In Folie gewickelt 30 Minuten kühlen.',
        'Für die Creme die Milch mit der Schale von 1 Zitrone (in breiten Streifen geschält) aufkochen. Inzwischen die restlichen 4 Eigelb mit 120 g Zucker, Vanillezucker und der Speisestärke glatt verrühren.',
        'Die heiße Milch durch ein Sieb unter Rühren zur Eigelbmasse gießen, zurück in den Topf geben und unter ständigem Rühren aufkochen, bis die Creme dick wird. Frischhaltefolie direkt auf die Oberfläche legen und abkühlen lassen.',
        'Zwei Drittel des Teigs ausrollen und eine gefettete Springform (24 cm) damit auskleiden, den Rand etwa 3 cm hochziehen. Den Ofen auf 180 °C Ober-/Unterhitze vorheizen.',
        'Die Creme glatt rühren und auf dem Boden verteilen. Den restlichen Teig ausrollen, als Deckel auflegen, den Rand fest andrücken und die Oberfläche mit der Gabel einstechen. Die Pinienkerne darauf verteilen.',
        'Die Torte 40 Minuten goldbraun backen, in der Form auskühlen lassen, mit dem Puderzucker bestäuben und mindestens 2 Stunden kühlen.',
      ]),

    backen('kuchen', 'torta-caprese', 'Torta Caprese',
      {
        cuisine: 'it',
        time: 75,
        yields: { name: 'Torta Caprese (selbstgebacken)', amount: 12, unit: 'Stk', shelf: 4, store: 'luftdicht bei Raumtemperatur', frozen: 60 },
        lighter: 'Die Butter auf 150 g und den Zucker auf 120 g reduzieren – spart rund 40 kcal pro Stück.',
      },
      '200 g Zartbitterschokolade | 200 g Butter | 200 g Mandeln gemahlen | 150 g Zucker | 4 Stk Ei | 1 Prise Salz | 2 EL Puderzucker',
      [
        'Eine Springform (24 cm) fetten und mit Backpapier auslegen. Den Ofen auf 170 °C Ober-/Unterhitze vorheizen.',
        'Die Schokolade grob hacken und mit der Butter in einem Topf bei kleinster Hitze schmelzen. Etwas abkühlen lassen.',
        'Die Eier trennen. Die Eigelbe mit 100 g Zucker 5 Minuten hell und schaumig schlagen, die Schokoladen-Butter und die gemahlenen Mandeln unterrühren.',
        'Die Eiweiße mit der Prise Salz steif schlagen, dabei die restlichen 50 g Zucker einrieseln lassen. Den Eischnee in zwei Portionen vorsichtig unter die Schokomasse heben.',
        'Den Teig in die Form füllen und 35–40 Minuten backen. Die Oberfläche soll fest sein, ein Holzstäbchen darf mit feuchten Krümeln herauskommen.',
        'Den Kuchen in der Form auskühlen lassen, vorsichtig herauslösen und mit dem Puderzucker bestäuben.',
      ]),

    backen('kuchen', 'crostata-marmellata', 'Crostata di marmellata',
      {
        cuisine: 'it',
        time: 90,
        yields: { name: 'Crostata di marmellata (selbstgebacken)', amount: 12, unit: 'Stk', shelf: 5, store: 'luftdicht bei Raumtemperatur', frozen: 60 },
        lighter: 'Den Teig mit 70 g statt 100 g Zucker und 120 g statt 150 g Butter kneten und die Marmelade dünner streichen – spart rund 30 kcal pro Stück.',
      },
      '300 g Weizenmehl | 150 g Butter | 100 g Zucker | 2 Stk Ei | 1 Stk Zitrone unbehandelt | 1 Prise Salz | 1 TL Backpulver | 400 g Aprikosenmarmelade',
      [
        'Weizenmehl, Backpulver, Zucker, Salz und die kalte Butter in Stückchen zu Bröseln verkneten. Die Eier und die abgeriebene Schale der Zitrone zugeben und rasch zu einem glatten Teig kneten. In Folie gewickelt 30 Minuten kühlen.',
        'Eine Tarteform oder Springform (26 cm) fetten. Den Ofen auf 180 °C Ober-/Unterhitze vorheizen.',
        'Zwei Drittel des Teigs ausrollen, die Form damit auskleiden und den Rand andrücken. Den Boden mit der Gabel einstechen und die Aprikosenmarmelade darauf glattstreichen.',
        'Den restlichen Teig ausrollen, in Streifen schneiden und als Gitter über die Marmelade legen. Die Enden am Rand andrücken.',
        'Die Crostata 35 Minuten goldbraun backen, in der Form auskühlen lassen und in 12 Stücke schneiden.',
      ]),
]

// Geräte-Schritte: gleiche Schritte wie oben, dazu die Einstellungen je Schritt-Nummer (ab 0); `texts` ersetzt einzelne Schritttexte
type Settings = NonNullable<DeviceStep['settings']>
const withDevices = (id: string, settings: Record<number, Settings>, texts: Record<number, string> = {}): DeviceStep[] =>
  recipes.find((r) => r.id === id)!.steps.map((t, i) => {
    const text = texts[i] ?? t
    return settings[i] ? { text, settings: settings[i] } : { text }
  })

const lauwarm: Settings = [{ device: 'bora', mode: 'Kochzone', level: '2', note: 'nur lauwarm' }]
const gehen: Settings = [{ device: 'steamer', mode: 'Profi-Backen Aufgehen lassen', temp: 35, minutes: 45, note: 'Schüssel auf den Gitterrost' }]
const gehenText = 'Den Teig in der Schüssel abdecken und im CombiSteamer 45 Minuten gehen lassen, bis er sich etwa verdoppelt hat.'
const ouVorheizen = (temp: number): Settings => [{ device: 'combair', mode: 'Ober-/Unterhitze', temp, note: 'vorheizen' }]
const ouBacken = (temp: number, minutes: number): Settings => [{ device: 'combair', mode: 'Ober-/Unterhitze', temp, minutes, note: 'Ebene 2, Stäbchenprobe' }]
const schmelzen: Settings = [{ device: 'bora', mode: 'Kochzone', level: 'Schmelzen', note: 'Butter schmelzen' }]

export const kuchen: ExtraGroup = {
  recipes,
  catalog: {
    konserven: ['Mandelblättchen', 'Vanillepuddingpulver', 'Mandeln gemahlen', 'Aprikosenmarmelade'],
    gemuese: ['Zwetschgen'],
  },
  products: {
    Mandelblättchen: prod(200, 'g', 2.29, 365, 90, 'Pck'),
    Vanillepuddingpulver: prod(3, 'Pck', 0.69, 365, 365, 'Packung'),
    'Mandeln gemahlen': prod(200, 'g', 1.99, 365, 90, 'Pck'),
    Aprikosenmarmelade: prod(450, 'g', 1.49, 365, 60, 'Glas'),
    Zwetschgen: prod(1000, 'g', 3.49, 5, 3, 'Kiste'),
  },
  nutrition: {
    Mandelblättchen: [600, 22, 54, 6, 11],
    Vanillepuddingpulver: [350, 0.3, 0.1, 86, 0],
    'Mandeln gemahlen': [610, 22, 54, 5, 12],
    Aprikosenmarmelade: [250, 0.4, 0.1, 60, 1],
    Zwetschgen: [46, 0.7, 0.2, 10, 1.6],
  },
  grams: {
    Vanillepuddingpulver: { Pck: 37 },
  },
  season: {
    Zwetschgen: [8, 9, 10],
  },
  deviceSteps: {
    bienenstich: [
      {
        text: 'Für den Hefeteig 175 ml von der Milch lauwarm erwärmen und die Hefe frisch mit 1 TL vom Zucker darin auflösen. Mit dem Weizenmehl, 50 g Zucker, 60 g weicher Butter, dem Ei und der Prise Salz 5 Minuten zu einem glatten Teig kneten.',
        settings: [{ device: 'bora', mode: 'Kochzone', level: '2', note: 'nur lauwarm' }],
      },
      {
        text: 'Den Teig in der Schüssel abdecken und im CombiSteamer 45 Minuten gehen lassen, bis er sich etwa verdoppelt hat.',
        settings: [{ device: 'steamer', mode: 'Profi-Backen Aufgehen lassen', temp: 35, minutes: 45, note: 'Schüssel auf den Gitterrost' }],
      },
      {
        text: 'Für den Belag 100 g Butter, 100 g Zucker, den Honig und 45 ml von der Sahne aufkochen, die Mandelblättchen unterrühren und 2 Minuten köcheln lassen. Etwas abkühlen lassen.',
        settings: [
          { device: 'bora', mode: 'Kochzone', level: '5', note: 'aufkochen' },
          { device: 'bora', mode: 'Kochzone', level: '3', minutes: 2 },
        ],
      },
      {
        text: 'Eine Springform (26 cm) fetten, den Teig hineindrücken, den Mandelbelag daraufstreichen und weitere 15 Minuten gehen lassen. Inzwischen den Combair vorheizen.',
        settings: [{ device: 'combair', mode: 'Ober-/Unterhitze', temp: 180, note: 'vorheizen' }],
      },
      {
        text: 'Die Form auf dem Gitterrost in den vorgeheizten Combair schieben, den Kuchen 25–30 Minuten goldbraun backen und auf einem Gitter vollständig auskühlen lassen.',
        settings: [{ device: 'combair', mode: 'Ober-/Unterhitze', temp: 180, minutes: 25, note: 'Ebene 2, Stäbchenprobe' }],
      },
      {
        text: 'Aus dem Vanillepuddingpulver, 500 ml Milch und 60 g Zucker nach Packungsangabe einen Pudding kochen, Frischhaltefolie direkt auf die Oberfläche legen und abkühlen lassen.',
        settings: [
          { device: 'bora', mode: 'Kochzone', level: '6', note: 'Milch aufkochen' },
          { device: 'bora', mode: 'Kochzone', level: '3', minutes: 1, note: 'Pulver einrühren, unter Rühren' },
        ],
      },
      { text: 'Den Kuchen waagerecht halbieren und den Mandeldeckel in 12 Stücke schneiden. 200 ml Sahne steif schlagen, den kalten Pudding glatt rühren und die Sahne unterheben.' },
      { text: 'Die Creme auf den Boden streichen, die Mandelstücke darauflegen und den Bienenstich mindestens 1 Stunde kühlen.' },
    ],
    butterkuchen: withDevices('butterkuchen', { 0: lauwarm, 1: gehen, 2: ouVorheizen(180), 4: ouBacken(180, 22) }, { 1: gehenText }),
    zwetschgendatschi: withDevices('zwetschgendatschi', { 0: lauwarm, 1: gehen, 3: ouVorheizen(180), 4: ouBacken(180, 32) }, { 1: gehenText }),
    'streuselkuchen-apfel': withDevices('streuselkuchen-apfel', { 0: lauwarm, 1: gehen, 4: ouVorheizen(180), 5: ouBacken(180, 32) }, { 1: gehenText }),
    marmorkuchen: withDevices('marmorkuchen', { 0: ouVorheizen(175), 4: ouBacken(175, 58) }),
    'kaesekuchen-ohne-boden': withDevices('kaesekuchen-ohne-boden', { 0: [...schmelzen, ...ouVorheizen(170)], 3: ouBacken(170, 60) }),
    hefezopf: withDevices('hefezopf', {
      0: lauwarm,
      1: gehen,
      3: [{ device: 'steamer', mode: 'Heißluft mit Beschwaden', temp: 170, note: 'vorheizen, Wasserbehälter füllen' }],
      5: [{ device: 'steamer', mode: 'Heißluft mit Beschwaden', temp: 170, minutes: 32, note: 'Kuchenblech Ebene 2, Tür zu' }],
    }, {
      1: gehenText,
      3: 'Den Zopf auf ein mit Backpapier belegtes Kuchenblech legen und 20 Minuten gehen lassen. Inzwischen den Wasserbehälter des CombiSteamers füllen und das Gerät vorheizen.',
      5: 'Den Zopf auf dem Blech im CombiSteamer 30–35 Minuten goldbraun backen. Er klingt beim Klopfen auf die Unterseite hohl. Auf einem Gitter auskühlen lassen und in 12 Scheiben schneiden.',
    }),
    'torta-della-nonna': withDevices('torta-della-nonna', {
      1: [{ device: 'bora', mode: 'Kochzone', level: '6', note: 'Milch aufkochen' }],
      2: [{ device: 'bora', mode: 'Kochzone', level: '3', minutes: 3, note: 'unter Rühren eindicken' }],
      3: ouVorheizen(180),
      5: ouBacken(180, 40),
    }),
    'torta-caprese': withDevices('torta-caprese', { 0: ouVorheizen(170), 1: schmelzen, 4: ouBacken(170, 38) }),
    'crostata-marmellata': withDevices('crostata-marmellata', { 1: ouVorheizen(180), 4: ouBacken(180, 35) }),
  },
  imageQueries: {
    bienenstich: 'Bienenstich cake',
    butterkuchen: 'Butterkuchen',
    zwetschgendatschi: 'Zwetschgendatschi plum cake',
    'streuselkuchen-apfel': 'Streuselkuchen apple crumb cake',
    marmorkuchen: 'Marmorkuchen marble cake',
    'kaesekuchen-ohne-boden': 'Käsekuchen cheesecake',
    hefezopf: 'Hefezopf braided bread',
    'torta-della-nonna': 'Torta della nonna',
    'torta-caprese': 'Torta caprese',
    'crostata-marmellata': 'Crostata jam tart',
  },
}
