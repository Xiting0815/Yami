import { bbq, prod } from '../../define'
import { bora, dutch, gasgrill, vakuum, vzug } from '../../device-helpers'
import type { DeviceStep } from '../../../types'
import type { ExtraGroup } from '../types'

/**
 * BBQ · Dutch Oven (Gusseisen, auf der Gasflamme: Hockerkocher oder Gasgrill-Brenner): Chili, Schmorgerichte, Beans,
 * Cobbler. Einstellung = Flamme (niedrig/mittel/hoch) + Dauer, Deckel-Hinweis in der Notiz. Backen mit Oberhitze
 * (Cobbler, Brot): Dutch Oven im Gasgrill indirekt mit Deckel zu (`gasgrill()`), Ausweichweg Combair (`alt: true`).
 * Regeln: docs/bbq-regeln.md, Gerät: docs/geraete/grill-dutch.md, Baustein `dutch()`.
 */

/** Letzter Schritt der Schmorgerichte: Reste portionsweise vakuumieren, später im CombiSteamer (Vacuisine) erwärmen */
const resteVakuum = (beutel: number): DeviceStep => ({
  text: `Die Reste innerhalb von 2 Stunden abkühlen lassen, in ${beutel} Beutel à 1 Portion füllen, im Vakuumierer mit Feucht-Modus vakuumieren und flach einfrieren (hält ca. 3 Monate). Zum Essen über Nacht im Kühlschrank auftauen und im Beutel im CombiSteamer mit Vacuisine bei 75 °C 30 Minuten erwärmen.`,
  settings: [vakuum('Vakuumieren feucht', `${beutel} Beutel à 1 Portion`), vzug('steamer', 'Vacuisine', 75, { minutes: 30, note: 'aufgetaut, im Beutel' })],
})

/** Klassischer Schritt dazu */
const resteText = (beutel: number) => `Die Reste abkühlen lassen, in ${beutel} Portionsbeutel füllen, vakuumieren und einfrieren (hält ca. 3 Monate).`

export const dutchOven: ExtraGroup = {
  recipes: [
    bbq('chili-dutch-oven', 'Chili con Carne aus dem Dutch Oven',
      {
        group: 'dutch',
        time: 210,
        portions: 6,
        eat: 2,
        leftover: { name: 'Chili con Carne (vakuumiert)', amount: 4, unit: 'Portion', shelf: 90 },
        lighter: 'Die Hälfte des Rindfleischs durch eine zweite Dose Kidneybohnen ersetzen – spart rund 150 kcal pro Portion.',
      },
      '1200 g Rindergulasch | 2 EL Sonnenblumenöl | 3 Stk Zwiebel | 4 Zehe Knoblauch | 2 Stk Paprika rot | 2 EL Tomatenmark | 2 TL Kreuzkümmel | 1 EL Paprikapulver geräuchert | 1 TL Oregano getrocknet | 2 TL Chiliflocken | 330 ml Dunkelbier | 2 Dose Gehackte Tomaten | 400 ml Rinderbrühe | 500 g Kidneybohnen | 20 g Zartbitterschokolade | Salz | Pfeffer',
      [
        'Das Fleisch in 2 cm große Würfel schneiden, trocken tupfen und salzen. Zwiebeln und Paprika würfeln, Knoblauch fein hacken.',
        'Den Dutch Oven ohne Deckel stark erhitzen und das Fleisch im Öl portionsweise kräftig anbraten, herausnehmen.',
        'Zwiebeln und Paprika bei mittlerer Hitze 5 Minuten anschwitzen, Knoblauch, Tomatenmark, Kreuzkümmel, geräuchertes Paprikapulver, Oregano und Chiliflocken kurz mitrösten und mit dem Dunkelbier ablöschen.',
        'Fleisch, Tomaten und Brühe zugeben, aufkochen und mit Deckel bei kleiner Hitze 2,5 Stunden schmoren, ab und zu umrühren.',
        'Kidneybohnen abspülen und mit der Schokolade unterrühren, offen 20 Minuten köcheln lassen und mit Salz und Pfeffer abschmecken.',
        'Die Reste abkühlen lassen, in 4 Portionsbeutel füllen, vakuumieren und einfrieren (hält ca. 3 Monate).',
      ]),

    bbq('texas-chili', 'Texas Chili (Bowl of Red) aus dem Dutch Oven',
      {
        group: 'dutch',
        time: 240,
        portions: 8,
        eat: 2,
        leftover: { name: 'Texas Chili (vakuumiert)', amount: 6, unit: 'Portion', shelf: 90 },
        lighter: 'Mageres Fleisch aus der Keule nehmen, das Schmalz halbieren und den Cheddar weglassen – spart rund 120 kcal pro Portion.',
      },
      '4 Stk Ancho-Chili getrocknet | 4 Stk Guajillo-Chili getrocknet | 2 Stk Chili getrocknet | 500 ml Rinderbrühe | 1500 g Rinderschulter | 2 Stk Zwiebel | 6 Zehe Knoblauch | 2 EL Schweineschmalz | 1 EL Kreuzkümmel | 2 TL Oregano getrocknet | 1 EL Paprikapulver geräuchert | 2 EL Tomatenmark | 330 ml Dunkelbier | 2 EL Polenta | 1 EL Apfelessig | 15 g Zartbitterschokolade | 1 TL Brauner Zucker | 60 g Cheddar gerieben | Salz | Pfeffer',
      [
        'Von Ancho- und Guajillo-Chilis Stiele und Kerne entfernen und die Schoten in einer trockenen Pfanne kurz rösten, bis sie duften.',
        'Die gerösteten Schoten und die getrockneten Chilis mit 300 ml heißer Rinderbrühe 20 Minuten einweichen und zu einer glatten Paste pürieren.',
        'Die Rinderschulter in 2–3 cm große Würfel schneiden, trocken tupfen und salzen. Zwiebeln fein würfeln, Knoblauch hacken.',
        'Das Fleisch im heißen Schweineschmalz im Dutch Oven portionsweise kräftig anbraten und herausnehmen.',
        'Zwiebeln bei mittlerer Hitze anschwitzen, Knoblauch, Kreuzkümmel, Oregano, geräuchertes Paprikapulver und Tomatenmark kurz mitrösten.',
        'Mit Dunkelbier ablöschen, Fleisch, Chili-Paste und restliche Brühe zugeben und mit Deckel bei kleiner Hitze 2,5 bis 3 Stunden schmoren, bis das Fleisch zerfällt.',
        'Polenta mit etwas Wasser anrühren, mit Apfelessig, Zartbitterschokolade und braunem Zucker unterrühren und offen 20 Minuten köcheln lassen. Mit Salz und Pfeffer abschmecken.',
        'Mit Cheddar bestreut servieren; Bohnen gibt es in Texas, wenn überhaupt, separat dazu.',
        resteText(6),
      ]),

    bbq('schichtfleisch', 'Schichtfleisch aus dem Dutch Oven',
      {
        group: 'dutch',
        cuisine: 'de',
        time: 450,
        portions: 8,
        eat: 2,
        leftover: { name: 'Schichtfleisch (vakuumiert)', amount: 6, unit: 'Portion', shelf: 90 },
        lighter: 'Statt Bacon nur eine dünne Lage Zwiebeln als Boden nehmen und das Fett vor dem Servieren abschöpfen – spart rund 120 kcal pro Portion.',
      },
      '2000 g Schweinenacken | 3 EL Sonnenblumenöl | 2 EL Senf mittelscharf | 2 EL Paprikapulver edelsüß | 1 EL Paprikapulver geräuchert | 4 Zehe Knoblauch | 1 TL Majoran | 6 Stk Zwiebel | 2 Stk Paprika rot | 250 g Bacon | 330 ml Bier hell | Salz | Pfeffer',
      [
        'Den Schweinenacken in 1,5 cm dicke Scheiben schneiden. Öl, Senf, beide Paprikapulver, gepressten Knoblauch, Majoran und Pfeffer verrühren, die Scheiben damit einstreichen und mindestens 4 Stunden, besser über Nacht, marinieren.',
        'Zwiebeln in Ringe, Paprika in Streifen schneiden.',
        'Den Boden des Dutch Oven mit der Hälfte vom Bacon auslegen, dann Fleisch, Zwiebeln und Paprika abwechselnd einschichten, jede Fleischlage leicht salzen, mit Bacon abschließen und das Bier angießen.',
        'Mit Deckel aufkochen und bei kleiner Hitze 3 Stunden schmoren, nicht umrühren.',
        'Schichtweise ausstechen und mit Brot oder Kartoffelsalat servieren.',
        resteText(6),
      ]),

    bbq('cowboy-beans', 'Cowboy Beans mit Hack und Bacon',
      {
        group: 'dutch',
        time: 120,
        portions: 6,
        eat: 2,
        leftover: { name: 'Cowboy Beans (vakuumiert)', amount: 4, unit: 'Portion', shelf: 90 },
        lighter: 'Den Bacon halbieren und den braunen Zucker auf 30 g reduzieren – spart rund 100 kcal pro Portion.',
      },
      '200 g Bacon | 2 Stk Zwiebel | 1 Stk Paprika grün | 3 Zehe Knoblauch | 500 g Kidneybohnen | 2 Dose Weiße Bohnen | 500 g Rinderhackfleisch | 250 ml BBQ-Sauce | 100 ml Tomatenketchup | 60 g Brauner Zucker | 2 EL Senf mittelscharf | 2 EL Apfelessig | 1 EL Worcestersauce | 1 TL Chiliflocken | 1 TL Paprikapulver geräuchert | 200 ml Rinderbrühe | Salz | Pfeffer',
      [
        'Bacon in Streifen schneiden, Zwiebeln und Paprika würfeln, Knoblauch hacken, Kidneybohnen und weiße Bohnen abspülen.',
        'Den Bacon im Dutch Oven knusprig auslassen, dann das Rinderhackfleisch krümelig anbraten.',
        'Zwiebeln, Paprika und Knoblauch 5 Minuten mitbraten.',
        'BBQ-Sauce, Ketchup, braunen Zucker, Senf, Apfelessig, Worcestersauce, Chiliflocken, Paprikapulver und Brühe einrühren, die Bohnen unterheben und mit Deckel bei kleiner Hitze 60 Minuten schmoren.',
        'Offen 15 Minuten köcheln lassen, bis die Sauce sämig ist, und abschmecken.',
        resteText(4),
      ]),

    bbq('pulled-chicken-dutch', 'Pulled Chicken aus dem Dutch Oven',
      {
        group: 'dutch',
        time: 150,
        portions: 6,
        eat: 2,
        leftover: { name: 'Pulled Chicken (vakuumiert)', amount: 1000, unit: 'g', portion: 250, shelf: 90 },
        lighter: 'Statt im Brötchen auf Salat oder in einer Vollkorn-Tortilla servieren – spart rund 150 kcal pro Portion.',
      },
      '1500 g Hähnchenschenkelfilet | 3 EL BBQ-Rub | 2 Stk Zwiebel | 3 Zehe Knoblauch | 1 EL Sonnenblumenöl | 200 ml Apfelsaft | 150 ml Hühnerbrühe | 2 EL Apfelessig | 300 ml BBQ-Sauce | 2 Stk Burger-Brötchen | Salz',
      [
        'Die Hähnchenschenkelfilets mit dem Rub würzen, Zwiebeln in Streifen schneiden, Knoblauch hacken.',
        'Die Filets im heißen Öl im Dutch Oven portionsweise anbraten und herausnehmen.',
        'Zwiebeln und Knoblauch anschwitzen, mit Apfelsaft, Brühe und Apfelessig ablöschen.',
        'Fleisch und 100 ml BBQ-Sauce zugeben und mit Deckel bei kleiner Hitze 90 Minuten schmoren, bis es zerfällt.',
        'Das Fleisch zerzupfen, die restliche Sauce unterrühren, offen 10 Minuten einköcheln und salzen.',
        'In angerösteten Burger-Brötchen servieren.',
        'Den Rest abkühlen lassen, in 4 Beutel à 250 g vakuumieren und einfrieren (hält ca. 3 Monate).',
      ]),

    bbq('pot-roast', 'Yankee Pot Roast – Schmorbraten mit Gemüse',
      {
        group: 'dutch',
        time: 240,
        portions: 6,
        eat: 2,
        leftover: { name: 'Pot Roast (vakuumiert)', amount: 4, unit: 'Portion', shelf: 90 },
        lighter: 'Mehr Möhren und Sellerie, dafür nur die Hälfte der Kartoffeln – spart rund 60 kcal pro Portion.',
      },
      '1500 g Rinderschulter | 2 EL Weizenmehl | 2 Stk Zwiebel | 4 Zehe Knoblauch | 800 g Kartoffeln festkochend | 4 Stk Möhre | 2 Stk Staudensellerie | 2 EL Sonnenblumenöl | 2 EL Tomatenmark | 250 ml Rotwein | 500 ml Rinderbrühe | 2 EL Worcestersauce | 4 Zweig Thymian | 2 Zweig Rosmarin | 2 Blatt Lorbeerblatt | Salz | Pfeffer',
      [
        'Die Rinderschulter binden, salzen, pfeffern und mit Mehl bestäuben.',
        'Zwiebeln vierteln, Knoblauch andrücken, Kartoffeln halbieren, Möhren und Sellerie in 5 cm lange Stücke schneiden.',
        'Den Braten im heißen Öl im Dutch Oven rundum dunkelbraun anbraten und herausnehmen.',
        'Zwiebeln, Knoblauch und Tomatenmark anrösten, mit Rotwein ablöschen, Brühe, Worcestersauce, Thymian, Rosmarin und Lorbeer zugeben.',
        'Den Braten einsetzen und mit Deckel bei kleiner Hitze 2 Stunden schmoren.',
        'Gemüse dazugeben und weitere 60 bis 75 Minuten schmoren, bis das Fleisch zerfällt.',
        'In Scheiben schneiden, die Sauce abschmecken und mit dem Gemüse servieren.',
        resteText(4),
      ]),

    bbq('peach-cobbler', 'Peach Cobbler aus dem Dutch Oven',
      { group: 'dutch', time: 80, portions: 6, lighter: 'Den Zucker im Teig auf 100 g reduzieren und statt Eis einen Klecks Joghurt dazu – spart rund 80 kcal pro Portion.' },
      '2 Dose Pfirsichhälften | 60 g Brauner Zucker | 1 TL Zimt gemahlen | 0.5 Stk Zitrone | 180 g Weizenmehl | 150 g Zucker | 1 Pck Vanillezucker | 2 TL Backpulver | 1 Prise Salz | 240 ml Milch | 120 g Butter',
      [
        'Die Pfirsiche abtropfen lassen (100 ml Saft auffangen), in Spalten schneiden und mit braunem Zucker, Zimt, Zitronensaft und dem Saft mischen.',
        'Mehl, Zucker, Vanillezucker, Backpulver und Salz mischen und die Milch glatt einrühren.',
        'Den Grill für indirekte Hitze bei etwa 180 °C vorbereiten (oder den Ofen auf 180 °C Ober-/Unterhitze vorheizen).',
        'Die Butter im Dutch Oven schmelzen.',
        'Den Teig in die Butter gießen, nicht umrühren, die Pfirsiche mit Saft darauf verteilen und 40 bis 45 Minuten goldbraun backen.',
        'Etwas abkühlen lassen und warm servieren, klassisch mit Vanilleeis.',
      ]),

    bbq('no-knead-brot', 'No-Knead-Brot aus dem Dutch Oven',
      { group: 'dutch', time: 1200, portions: 8 },
      '500 g Weizenmehl | 10 g Salz | 2 g Hefe frisch',
      [
        'Mehl und Salz mischen, die Hefe in 380 ml lauwarmem Wasser auflösen, zugeben und nur verrühren, bis kein trockenes Mehl mehr zu sehen ist. Abgedeckt 12 bis 18 Stunden bei Raumtemperatur gehen lassen.',
        'Den Teig auf eine bemehlte Fläche kippen, zur Mitte falten und mit der Naht nach unten auf Backpapier 1 bis 2 Stunden gehen lassen.',
        'Den Dutch Oven mit Deckel 30 Minuten bei 250 °C mit aufheizen.',
        'Den Teig mit dem Backpapier in den heißen Topf heben und mit Deckel 30 Minuten backen.',
        'Den Deckel abnehmen und weitere 15 Minuten backen, bis die Kruste tief braun ist.',
        'Mindestens 1 Stunde auf einem Gitter auskühlen lassen.',
      ]),

    bbq('brunswick-stew', 'Brunswick Stew mit Hähnchen und Pulled Pork',
      {
        group: 'dutch',
        time: 120,
        portions: 6,
        eat: 2,
        leftover: { name: 'Brunswick Stew (vakuumiert)', amount: 4, unit: 'Portion', shelf: 90 },
        lighter: 'Den Rahmmais durch eine zweite Dose Mais ersetzen und die Butter weglassen – spart rund 60 kcal pro Portion.',
      },
      '800 g Hähnchenschenkelfilet | 2 Stk Zwiebel | 3 Zehe Knoblauch | 600 g Kartoffeln festkochend | 1 Dose Weiße Bohnen | 1 Dose Mais | 30 g Butter | 1 Dose Gehackte Tomaten | 1 Dose Rahmmais | 750 ml Hühnerbrühe | 200 ml BBQ-Sauce | 2 EL Worcestersauce | 2 EL Apfelessig | 0.5 TL Cayennepfeffer | 400 g Pulled Pork | Salz | Pfeffer',
      [
        'Hähnchenschenkelfilets in Stücke schneiden und salzen, Zwiebeln würfeln, Knoblauch hacken, Kartoffeln würfeln, weiße Bohnen und Mais abspülen.',
        'Das Hähnchen in Butter im Dutch Oven anbraten, Zwiebeln und Knoblauch mitschwitzen.',
        'Kartoffeln, gehackte Tomaten, Rahmmais, Hühnerbrühe, BBQ-Sauce, Worcestersauce, Apfelessig und Cayennepfeffer zugeben und mit Deckel 45 Minuten schmoren.',
        'Pulled Pork, Mais und Bohnen unterrühren und offen 30 Minuten dick einköcheln. Mit Salz und Pfeffer abschmecken.',
        'Mit Weißbrot oder Cornbread servieren.',
        resteText(4),
      ]),
  ],
  catalog: {
    fleisch: ['Rinderschulter'],
    vorrat: ['Ancho-Chili getrocknet', 'Guajillo-Chili getrocknet'],
    konserven: ['Pfirsichhälften'],
  },
  products: {
    // Metzger: dicke Schulter / Schaufelstück (amerikanisch „Chuck“)
    Rinderschulter: prod(1000, 'g', 14.99, 3, 1, 'Stk'),
    // online (Chili-Versand) oder Lateinamerika-/Asialaden
    'Ancho-Chili getrocknet': prod(50, 'g', 4.99, 365, 180, 'Tüte'),
    'Guajillo-Chili getrocknet': prod(50, 'g', 4.49, 365, 180, 'Tüte'),
    // Dose 820 g, Abtropfgewicht ca. 480 g, leicht gezuckert
    Pfirsichhälften: prod(1, 'Dose', 1.79, 730, 3, 'Dose'),
  },
  nutrition: {
    Rinderschulter: [170, 20, 10, 0, 0],
    'Ancho-Chili getrocknet': [280, 12, 8, 51, 22],
    'Guajillo-Chili getrocknet': [300, 11, 6, 55, 22],
    Pfirsichhälften: [65, 0.5, 0.1, 15, 1.2],
  },
  grams: {
    'Ancho-Chili getrocknet': { Stk: 12 },
    'Guajillo-Chili getrocknet': { Stk: 6 },
    Pfirsichhälften: { Dose: 480 },
  },
  convert: {
    'Ancho-Chili getrocknet': { Stk: 12 },
    'Guajillo-Chili getrocknet': { Stk: 6 },
  },
  deviceSteps: {
    'chili-dutch-oven': [
      { text: 'Das Fleisch in 2 cm große Würfel schneiden, trocken tupfen und salzen. Zwiebeln und Paprika würfeln, Knoblauch fein hacken.' },
      {
        text: 'Den Dutch Oven (ca. 4,5 l, z. B. ft6) ohne Deckel auf den Hockerkocher stellen und auf hoher Flamme 5 Minuten vorheizen. Das Fleisch im Sonnenblumenöl in drei Portionen kräftig anbraten und herausnehmen.',
        settings: [dutch('Anbraten', 'hoch', { note: 'ohne Deckel, Hockerkocher' })],
      },
      {
        text: 'Die Flamme auf mittel stellen, Zwiebeln und Paprika 5 Minuten anschwitzen. Knoblauch, Tomatenmark, Kreuzkümmel, geräuchertes Paprikapulver, Oregano und Chiliflocken kurz mitrösten und mit dem Dunkelbier ablöschen.',
        settings: [dutch('Anbraten', 'mittel', { minutes: 5 })],
      },
      {
        text: 'Fleisch, gehackte Tomaten und Rinderbrühe zugeben und aufkochen. Die Flamme auf niedrig stellen, den Deckel auflegen und 2,5 Stunden schmoren, alle 30 Minuten umrühren und den Boden prüfen.',
        settings: [dutch('Schmoren', 'niedrig', { minutes: 150, note: 'Deckel zu' })],
      },
      {
        text: 'Kidneybohnen abspülen und mit der Zartbitterschokolade unterrühren. Ohne Deckel 20 Minuten köcheln lassen und mit Salz und Pfeffer abschmecken.',
        settings: [dutch('Köcheln', 'niedrig', { minutes: 20, note: 'ohne Deckel' })],
      },
      {
        text: 'Die Reste abkühlen lassen, in 4 Portionsbeutel füllen und im Vakuumierer mit Feucht-Modus vakuumieren. Flach einfrieren (hält ca. 3 Monate).',
        settings: [vakuum('Vakuumieren feucht', '4 Beutel à 1 Portion')],
      },
    ],

    'texas-chili': [
      {
        text: 'Von den Ancho- und Guajillo-Chilis Stiele und Kerne entfernen und die Schoten flach aufreißen. In einer trockenen Pfanne auf dem BORA bei mittlerer Hitze je Seite 20 bis 30 Sekunden rösten, bis sie duften – nicht schwärzen, sonst werden sie bitter. Ancho (getrocknete Poblano, mild und rosinig) und Guajillo (mild, fruchtig) gibt es im Chili-Versand oder im Lateinamerika-Laden. Ersatz: 4 EL mildes Chilipulver ohne Salz.',
        settings: [bora('5', { note: 'trockene Pfanne' })],
      },
      {
        text: 'Die gerösteten Schoten und die getrockneten Chilis (für die Schärfe) in eine Schüssel geben, mit 300 ml heißer Rinderbrühe übergießen und 20 Minuten einweichen. Dann mit der Brühe im Mixer zu einer glatten Paste pürieren. Diese Chili-Paste ist das Herz eines Texas-Chilis – es kommt ohne fertiges Chilipulver aus.',
      },
      {
        text: 'Die Rinderschulter in 2 bis 3 cm große Würfel schneiden (Texas-Chili wird traditionell aus gewürfeltem Fleisch gekocht, nicht aus Hack), trocken tupfen und salzen. Die Zwiebeln fein würfeln, den Knoblauch hacken.',
      },
      {
        text: 'Den Dutch Oven (ft6, ca. 4,5 l) ohne Deckel auf den Hockerkocher stellen und bei hoher Flamme 5 Minuten vorheizen. Das Schweineschmalz darin schmelzen und das Fleisch in drei Portionen je 4 bis 5 Minuten kräftig braun anbraten, herausnehmen.',
        settings: [dutch('Anbraten', 'hoch', { note: 'ohne Deckel, Hockerkocher' })],
      },
      {
        text: 'Die Flamme auf mittel stellen und die Zwiebeln 5 Minuten anschwitzen. Knoblauch, Kreuzkümmel, Oregano, geräuchertes Paprikapulver und Tomatenmark 1 Minute mitrösten.',
        settings: [dutch('Anbraten', 'mittel', { minutes: 6 })],
      },
      {
        text: 'Mit dem Dunkelbier ablöschen und den Bratsatz vom Boden lösen. Fleisch, Chili-Paste und die restliche Rinderbrühe zugeben und aufkochen. Die Flamme auf niedrig stellen, den Deckel auflegen und 2,5 bis 3 Stunden schmoren, bis das Fleisch mit dem Löffel zerfällt. Alle 30 Minuten umrühren und den Boden prüfen – Gusseisen setzt leicht an.',
        settings: [dutch('Schmoren', 'niedrig', { minutes: 165, note: 'Deckel zu' })],
      },
      {
        text: 'Die Polenta mit 4 EL Wasser glatt rühren – sie ersetzt Masa Harina, das mexikanische Maismehl, und bindet das Chili. Mit dem Apfelessig, der Zartbitterschokolade und dem braunen Zucker unterrühren und ohne Deckel 20 Minuten köcheln lassen, bis das Chili sämig ist. Mit Salz und Pfeffer abschmecken.',
        settings: [dutch('Köcheln', 'niedrig', { minutes: 20, note: 'ohne Deckel' })],
      },
      {
        text: 'Mit Cheddar bestreut servieren, klassisch mit Saltine-Crackern oder Cornbread. Bohnen gehören in Texas nicht ins Chili („If you know beans about chili, you know chili ain’t got no beans“). Wer mag, wärmt eine Dose Kidney- oder Pintobohnen separat und gibt sie am Tisch dazu – das ist dann eher Chili nach Art des übrigen Landes.',
      },
      resteVakuum(6),
    ],

    schichtfleisch: [
      {
        text: 'Den Schweinenacken in 1,5 cm dicke Scheiben (Nackensteaks) schneiden. Sonnenblumenöl, Senf, Paprikapulver edelsüß und geräuchert, den gepressten Knoblauch, Majoran und Pfeffer verrühren, die Steaks damit rundum einstreichen und abgedeckt mindestens 4 Stunden, besser über Nacht, im Kühlschrank marinieren. Erst beim Schichten salzen.',
      },
      {
        text: 'Die Zwiebeln schälen und in Ringe schneiden, die Paprika rot entkernen und in Streifen schneiden.',
      },
      {
        text: 'Den Boden des Dutch Oven (ft6 oder größer) mit der Hälfte vom Bacon auslegen – er schützt das Fleisch vor dem Anbrennen. Dann abwechselnd Nackensteaks, Zwiebelringe und Paprikastreifen einschichten, jede Fleischlage leicht salzen, und mit dem restlichen Bacon abschließen. Das Bier hell am Rand angießen.',
      },
      {
        text: 'Den Dutch Oven mit Deckel auf den Hockerkocher stellen und bei mittlerer Flamme 10 Minuten ankochen, bis es im Topf brodelt. Dann die Flamme auf niedrig stellen und 3 Stunden schmoren. Nicht umrühren – die Zwiebeln geben genug Flüssigkeit ab. Nach etwa der Hälfte der Zeit am Rand prüfen, ob der Boden ansetzt. Klassisch steht der Topf auf Briketts (etwa 8 unten, 16 auf dem Deckel); auf Gas reicht die kleine Flamme.',
        settings: [dutch('Köcheln', 'mittel', { minutes: 10, note: 'Deckel zu, ankochen' }), dutch('Schmoren', 'niedrig', { minutes: 180, note: 'Deckel zu, nicht umrühren' })],
      },
      {
        text: 'Das Schichtfleisch mit einer großen Kelle von oben nach unten ausstechen, damit jeder Teller Fleisch, Zwiebeln und Sauce bekommt. Dazu passen Baguette oder Kartoffelsalat.',
      },
      resteVakuum(6),
    ],

    'cowboy-beans': [
      {
        text: 'Den Bacon in 1 cm breite Streifen schneiden, Zwiebeln und Paprika grün würfeln, Knoblauch hacken. Kidneybohnen und weiße Bohnen in einem Sieb abspülen und abtropfen lassen.',
      },
      {
        text: 'Den Dutch Oven ohne Deckel auf den Hockerkocher stellen und den Bacon bei mittlerer Flamme 6 bis 8 Minuten knusprig auslassen. Dann die Flamme auf hoch stellen, das Rinderhackfleisch zugeben und krümelig braun anbraten.',
        settings: [dutch('Anbraten', 'mittel', { minutes: 7, note: 'ohne Deckel, Hockerkocher' }), dutch('Anbraten', 'hoch', { minutes: 6 })],
      },
      {
        text: 'Die Flamme auf mittel stellen, Zwiebeln, Paprika und Knoblauch zugeben und 5 Minuten mitbraten.',
        settings: [dutch('Anbraten', 'mittel', { minutes: 5 })],
      },
      {
        text: 'BBQ-Sauce, Tomatenketchup, braunen Zucker, Senf, Apfelessig, Worcestersauce, Chiliflocken, geräuchertes Paprikapulver und Rinderbrühe einrühren, die Bohnen unterheben und aufkochen. Die Flamme auf niedrig stellen, den Deckel auflegen und 60 Minuten schmoren, zwischendurch umrühren und den Boden prüfen.',
        settings: [dutch('Schmoren', 'niedrig', { minutes: 60, note: 'Deckel zu' })],
      },
      {
        text: 'Den Deckel abnehmen und 15 Minuten köcheln lassen, bis die Sauce sämig ist. Mit Salz und Pfeffer abschmecken. Dazu passen Cornbread oder Coleslaw.',
        settings: [dutch('Köcheln', 'niedrig', { minutes: 15, note: 'ohne Deckel' })],
      },
      resteVakuum(4),
    ],

    'pulled-chicken-dutch': [
      {
        text: 'Die Hähnchenschenkelfilets trocken tupfen und rundum mit dem BBQ-Rub würzen. Die Zwiebeln in Streifen schneiden, den Knoblauch hacken. Schenkelfleisch bleibt beim langen Schmoren saftig, Brustfilet würde trocken.',
      },
      {
        text: 'Den Dutch Oven ohne Deckel auf den Hockerkocher stellen und bei hoher Flamme 5 Minuten vorheizen. Das Sonnenblumenöl zugeben und die Filets in zwei Portionen je Seite 2 Minuten scharf anbraten, herausnehmen.',
        settings: [dutch('Anbraten', 'hoch', { note: 'ohne Deckel, Hockerkocher' })],
      },
      {
        text: 'Die Flamme auf mittel stellen, Zwiebeln und Knoblauch 4 Minuten anschwitzen und mit Apfelsaft, Hühnerbrühe und Apfelessig ablöschen. Den Bratsatz vom Boden lösen.',
        settings: [dutch('Anbraten', 'mittel', { minutes: 4 })],
      },
      {
        text: 'Das Fleisch mit dem ausgetretenen Saft zurück in den Topf geben und 100 ml von der BBQ-Sauce unterrühren. Die Flamme auf niedrig stellen, den Deckel auflegen und 90 Minuten schmoren, bis das Fleisch mit zwei Gabeln mühelos zerfällt (Kern 90 °C).',
        settings: [dutch('Schmoren', 'niedrig', { minutes: 90, core: 90, note: 'Deckel zu' })],
      },
      {
        text: 'Das Fleisch im Topf mit zwei Gabeln zerzupfen, die restliche BBQ-Sauce unterrühren und ohne Deckel 10 Minuten köcheln lassen, bis die Sauce am Fleisch haftet. Mit Salz abschmecken.',
        settings: [dutch('Köcheln', 'niedrig', { minutes: 10, note: 'ohne Deckel' })],
      },
      {
        text: 'Die Burger-Brötchen halbieren, mit der Schnittfläche in einer Pfanne kurz anrösten und mit dem Pulled Chicken füllen. Dazu passt Coleslaw.',
      },
      {
        text: 'Den Rest innerhalb von 2 Stunden abkühlen lassen, in 4 Beutel à 250 g füllen, im Vakuumierer mit Feucht-Modus vakuumieren und flach einfrieren (hält ca. 3 Monate). Aufgetaut im Beutel im CombiSteamer mit Vacuisine bei 70 °C 30 Minuten erwärmen.',
        settings: [vakuum('Vakuumieren feucht', '4 Beutel à 250 g'), vzug('steamer', 'Vacuisine', 70, { minutes: 30, note: 'aufgetaut, im Beutel' })],
      },
    ],

    'pot-roast': [
      {
        text: 'Die Rinderschulter (amerikanisch „Chuck Roast“, beim Metzger dicke Schulter oder Schaufelstück) mit Küchengarn in Form binden, trocken tupfen, kräftig mit Salz und Pfeffer würzen und rundum dünn mit dem Weizenmehl bestäuben – das Mehl bräunt mit und bindet später die Sauce.',
      },
      {
        text: 'Die Zwiebeln vierteln, den Knoblauch andrücken. Die Kartoffeln schälen und halbieren, Möhren und Staudensellerie in 5 cm lange Stücke schneiden.',
      },
      {
        text: 'Den Dutch Oven ohne Deckel auf den Hockerkocher stellen und bei hoher Flamme vorheizen. Das Sonnenblumenöl zugeben und den Braten rundum in etwa 10 Minuten dunkelbraun anbraten, herausnehmen.',
        settings: [dutch('Anbraten', 'hoch', { minutes: 10, note: 'ohne Deckel, Hockerkocher' })],
      },
      {
        text: 'Die Flamme auf mittel stellen, Zwiebeln, Knoblauch und Tomatenmark 3 Minuten anrösten, mit dem Rotwein ablöschen und den Bratsatz vom Boden kratzen. Rinderbrühe, Worcestersauce, Thymian, Rosmarin und Lorbeerblätter zugeben.',
        settings: [dutch('Anbraten', 'mittel', { minutes: 3 })],
      },
      {
        text: 'Den Braten zurück in den Topf setzen und aufkochen. Die Flamme auf niedrig stellen, den Deckel auflegen und 2 Stunden schmoren, dabei den Braten einmal wenden.',
        settings: [dutch('Schmoren', 'niedrig', { minutes: 120, note: 'Deckel zu' })],
      },
      {
        text: 'Kartoffeln, Möhren und Sellerie rund um den Braten in die Sauce legen und mit Deckel weitere 60 bis 75 Minuten schmoren, bis das Fleisch „probe tender“ ist: Ein Thermometer gleitet ohne Widerstand hinein, der Kern hat etwa 93 °C.',
        settings: [dutch('Schmoren', 'niedrig', { minutes: 70, core: 93, note: 'Deckel zu' })],
      },
      {
        text: 'Den Braten in dicke Scheiben schneiden oder grob zerzupfen. Lorbeer und Kräuterstiele entfernen, die Sauce mit Salz und Pfeffer abschmecken und alles mit dem Gemüse servieren.',
      },
      resteVakuum(4),
    ],

    'peach-cobbler': [
      {
        text: 'Die Pfirsichhälften abtropfen lassen und dabei 100 ml Saft auffangen. Die Pfirsiche in Spalten schneiden und mit braunem Zucker, Zimt, dem Saft der halben Zitrone und dem aufgefangenen Saft mischen. Im Sommer gehen auch 6 reife frische Pfirsiche.',
      },
      {
        text: 'Für den Teig Weizenmehl, Zucker, Vanillezucker, Backpulver und Salz mischen und die Milch einrühren, nur bis keine Klümpchen mehr da sind.',
      },
      {
        text: 'Den Gasgrill mit allen 4 Brennern auf hoch und geschlossenem Deckel 10 Minuten vorheizen. Dann Brenner 1 und 4 auf mittel stellen und die mittleren Brenner ausschalten, bis sich das Deckelthermometer bei etwa 180 °C einpendelt. Ausweichweg bei Regen: den Combair auf 180 °C Ober-/Unterhitze vorheizen (Dutch Oven ohne Füße oder eine gusseiserne Auflaufform, Ebene 1).',
        settings: [
          gasgrill('Vorheizen', 250, 'hoch', 'alle', { minutes: 10, note: 'Deckel zu' }),
          gasgrill('Indirekt', 180, 'mittel', '1+4', { note: 'Mitte aus' }),
          vzug('combair', 'Ober-/Unterhitze', 180, { note: 'vorheizen, Ebene 1', alt: true }),
        ],
      },
      {
        text: 'Die Butter in den Dutch Oven (ft6) geben, den Topf ohne Deckel in die Mitte über die ausgeschalteten Brenner stellen und bei geschlossenem Grilldeckel 5 Minuten schmelzen lassen.',
        settings: [gasgrill('Indirekt', 180, 'mittel', '1+4', { minutes: 5, note: 'Deckel zu' }), vzug('combair', 'Ober-/Unterhitze', 180, { minutes: 5, note: 'Ebene 1', alt: true })],
      },
      {
        text: 'Den Teig gleichmäßig in die geschmolzene Butter gießen und nicht umrühren. Die Pfirsiche mit dem Saft löffelweise darauf verteilen – der Teig steigt beim Backen um die Früchte herum nach oben. Ohne Topfdeckel bei geschlossenem Grilldeckel 40 bis 45 Minuten indirekt backen, bis die Oberfläche goldbraun ist und ein Holzstäbchen im Teig sauber herauskommt. Den Topf nach der Hälfte der Zeit einmal drehen.',
        settings: [
          gasgrill('Indirekt', 180, 'mittel', '1+4', { minutes: 45, note: 'Deckel zu, Topf ohne Deckel' }),
          vzug('combair', 'Ober-/Unterhitze', 180, { minutes: 45, note: 'Ebene 1', alt: true }),
        ],
      },
      {
        text: 'Den Cobbler 15 Minuten abkühlen lassen und warm servieren, klassisch mit Vanilleeis.',
      },
    ],

    'no-knead-brot': [
      {
        text: 'Weizenmehl (am besten Type 550) und Salz in einer großen Schüssel mischen. Die Hefe in 380 ml lauwarmem Wasser auflösen, zugießen und mit einem Löffel nur so lange rühren, bis kein trockenes Mehl mehr zu sehen ist – Kneten ist nicht nötig, die lange Gare entwickelt das Klebergerüst von selbst. Abgedeckt bei Raumtemperatur 12 bis 18 Stunden gehen lassen, bis der Teig Blasen wirft und sich verdoppelt hat.',
      },
      {
        text: 'Den klebrigen Teig auf eine gut bemehlte Arbeitsfläche kippen, von allen Seiten zur Mitte falten und mit der Naht nach unten auf ein bemehltes Backpapier legen. Abgedeckt 1 bis 2 Stunden gehen lassen.',
      },
      {
        text: 'Den Gasgrill mit allen 4 Brennern auf hoch vorheizen. Den leeren Dutch Oven mit Deckel in die Mitte auf den Rost stellen, dann Brenner 1 und 4 auf hoch lassen und die mittleren Brenner ausschalten. Bei geschlossenem Grilldeckel aufheizen, bis das Deckelthermometer etwa 250 °C zeigt und der Topf durchgeheizt ist. Ausweichweg: den Dutch Oven mit Deckel im Combair auf Ebene 1 bei 250 °C Ober-/Unterhitze mit aufheizen.',
        settings: [
          gasgrill('Vorheizen', 260, 'hoch', 'alle', { minutes: 10, note: 'Deckel zu' }),
          gasgrill('Indirekt', 250, 'hoch', '1+4', { minutes: 30, note: 'Dutch Oven mit Deckel mit aufheizen' }),
          vzug('combair', 'Ober-/Unterhitze', 250, { minutes: 30, note: 'Dutch Oven mit Deckel, Ebene 1', alt: true }),
        ],
      },
      {
        text: 'Den heißen Dutch Oven mit Grillhandschuhen öffnen, den Teig mit dem Backpapier hineinheben, den Deckel auflegen und bei geschlossenem Grilldeckel 30 Minuten indirekt backen. Der Dampf aus dem Teig bleibt im Topf und lässt das Brot aufgehen.',
        settings: [
          gasgrill('Indirekt', 250, 'hoch', '1+4', { minutes: 30, note: 'Deckel zu, Topf mit Deckel' }),
          vzug('combair', 'Ober-/Unterhitze', 250, { minutes: 30, note: 'Ebene 1', alt: true }),
        ],
      },
      {
        text: 'Den Topfdeckel abnehmen und das Brot weitere 15 Minuten indirekt backen, bis die Kruste tief braun ist und der Laib beim Klopfen auf die Unterseite hohl klingt (Kern 96 °C).',
        settings: [
          gasgrill('Indirekt', 250, 'hoch', '1+4', { minutes: 15, core: 96, note: 'Topf ohne Deckel' }),
          vzug('combair', 'Ober-/Unterhitze', 250, { minutes: 15, note: 'Ebene 1, Topf ohne Deckel', alt: true }),
        ],
      },
      {
        text: 'Das Brot herausheben und auf einem Gitter mindestens 1 Stunde auskühlen lassen, bevor es angeschnitten wird – sonst ist die Krume noch klitschig.',
      },
    ],

    'brunswick-stew': [
      {
        text: 'Die Hähnchenschenkelfilets in 3 cm große Stücke schneiden und salzen. Zwiebeln würfeln, Knoblauch hacken, Kartoffeln schälen und in 1,5 cm große Würfel schneiden. Weiße Bohnen (Ersatz für die amerikanischen Lima- oder Butterbohnen) und Mais in einem Sieb abspülen.',
      },
      {
        text: 'Den Dutch Oven ohne Deckel auf den Hockerkocher stellen und bei mittlerer Flamme vorheizen. Die Butter schmelzen und das Hähnchen 5 Minuten anbraten. Zwiebeln und Knoblauch zugeben und weitere 4 Minuten anschwitzen.',
        settings: [dutch('Anbraten', 'mittel', { minutes: 9, note: 'ohne Deckel, Hockerkocher' })],
      },
      {
        text: 'Kartoffeln, gehackte Tomaten, Rahmmais, Hühnerbrühe, BBQ-Sauce, Worcestersauce, Apfelessig und Cayennepfeffer zugeben und aufkochen. Die Flamme auf niedrig stellen, den Deckel auflegen und 45 Minuten schmoren, gelegentlich umrühren.',
        settings: [dutch('Schmoren', 'niedrig', { minutes: 45, note: 'Deckel zu' })],
      },
      {
        text: 'Pulled Pork (am besten aus dem Vorrat vom letzten Smoken), Mais und Bohnen unterrühren und ohne Deckel 30 Minuten köcheln lassen, bis der Eintopf richtig dick ist – in Georgia sagt man, der Löffel soll fast darin stehen. Mit Salz, Pfeffer und einem Schuss mehr Apfelessig abschmecken.',
        settings: [dutch('Köcheln', 'niedrig', { minutes: 30, note: 'ohne Deckel' })],
      },
      {
        text: 'Mit Weißbrot oder Cornbread servieren. In Georgia und Virginia ist Brunswick Stew die klassische Beilage zum Barbecue, als Eintopf ist er aber auch ein vollständiges Abendessen.',
      },
      resteVakuum(4),
    ],
  },
  imageQueries: {
    'chili-dutch-oven': 'chili con carne dutch oven',
    'texas-chili': 'texas chili bowl of red',
    schichtfleisch: 'schichtfleisch dutch oven',
    'cowboy-beans': 'cowboy beans dutch oven',
    'pulled-chicken-dutch': 'pulled chicken sandwich',
    'pot-roast': 'pot roast dutch oven vegetables',
    'peach-cobbler': 'peach cobbler dutch oven',
    'no-knead-brot': 'no knead bread dutch oven',
    'brunswick-stew': 'brunswick stew',
  },
}
