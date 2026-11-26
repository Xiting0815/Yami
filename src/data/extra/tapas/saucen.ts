import { backen, prod } from '../../define'
import { bora, vzug } from '../../device-helpers'
import type { DeviceStep } from '../../../types'
import type { ExtraGroup } from '../types'

/**
 * Tapas · Grundsaucen (Grundrezepte): Alioli, Salsa brava, Romesco, Mojo rojo, Mojo verde … selbstgemacht auf Vorrat.
 * „Fertig gekocht“ legt sie in den Vorrat (Kühlschrank); Tapas, die sie brauchen, nehmen das Selbstgemachte zuerst
 * (`substitutes.preferred`), das gekaufte Glas bleibt Ersatz (gleiche Austausch-Gruppe, GLEICHE Einheit).
 * Anlegen mit `backen('grundrezept', id, titel, { cuisine: 'es', tapas: 'sauce', time, yields: { name: '… selbstgemacht', amount, unit, shelf, store, cat: 'konserven' } }, zutaten, schritte)`.
 * Regeln: docs/spanien-regeln.md (Abschnitt Saucen).
 *
 * Kaufbare Grundnamen (schon angelegt – die anderen Tapas-Gruppen verwenden NUR diese Namen; Selbstgemachtes wird automatisch zuerst genommen):
 *   'Alioli' (ml) · 'Salsa brava' (ml) · 'Romesco' (g) · 'Mojo rojo' (ml) · 'Mojo verde' (ml)
 * Phase 2: je Sauce ein Grundrezept mit `yields.name` = '<Grundname> selbstgemacht' (Einheit wie oben), dazu
 * `substitutes.groups` (z. B. bravas: ['Salsa brava', 'Salsa brava selbstgemacht']) und `substitutes.preferred`.
 */

/** Kalte Saucen ohne Gerät (Mörser, Stabmixer): Geräte-Schritte = die klassischen Schritte */
const plain = (steps: string[]): DeviceStep[] => steps.map((text) => ({ text }))

const ALIOLI_STEPS = [
  'Alle Zutaten auf Zimmertemperatur bringen (kaltes Ei und Öl verbinden sich schlecht). Den Knoblauch schälen, längs halbieren, den grünen Keim entfernen (er macht die Alioli bitter und scharf) und mit einer Prise Salz im Mörser oder mit der Messerklinge zu einer glatten Paste zerreiben.',
  'Das Ei, die Knoblauchpaste, 1 TL Zitronensaft und eine Prise Salz in einen hohen, schmalen Mixbecher geben, beide Öle darübergießen. Halb Sonnenblumenöl, weil kräftiges natives Olivenöl beim schnellen Mixen bitter wird.',
  'Den Stabmixer ganz auf den Boden setzen, einschalten und erst nach 10 bis 15 Sekunden langsam nach oben ziehen, bis alles zu einer dicken, glänzenden Creme emulgiert ist.',
  'Mit Salz und Zitronensaft abschmecken und in ein sauberes Glas füllen. Mit rohem Ei höchstens 3 Tage im Kühlschrank aufbewahren. Die ursprüngliche katalanisch-valencianische „All i oli“ besteht nur aus Knoblauch, Salz und Olivenöl, im Mörser tropfenweise aufgeschlagen – das braucht 15 Minuten Geduld und gelingt nicht immer; die Variante mit Ei ist in Spanien heute die übliche.',
]

const ALLIOLI_STEPS = [
  'Alle Zutaten auf Zimmertemperatur bringen. Den Knoblauch schälen, längs halbieren und den grünen Keim entfernen. Ein großer, schwerer Mörser (Stein oder glasierter Ton) ist Pflicht – ein kleiner Holzmörser reicht nicht.',
  'Den Knoblauch mit einer guten Prise grobem Salz im Mörser mit kreisenden Bewegungen zu einer völlig glatten, fast flüssigen Paste zerreiben (3–4 Minuten) – je feiner die Paste, desto sicherer bindet sie.',
  'Das Olivenöl zuerst tropfenweise, dann in einem ganz dünnen Faden zugießen und dabei mit dem Stößel immer in dieselbe Richtung kreisen, ohne Pause. Nach etwa 10–15 Minuten entsteht eine feste, weiß-gelbliche Creme, in der der Stößel stehen bleibt. Ein paar Tropfen Wasser zwischendurch machen sie stabiler.',
  'Trennt sich die Masse („se corta“), in einer zweiten Schale einen Teelöffel Wasser mit etwas Knoblauchpaste vorlegen und die geronnene Masse löffelweise wieder einarbeiten. Sehr kräftig – nur in kleinen Mengen zu Fleisch, Fisch vom Grill oder Arroz a banda reichen. Im Glas im Kühlschrank 4 Tage haltbar.',
]

const MOJO_ROJO_STEPS = [
  'Die Ñoras (in Spanien-Feinkostläden oder online; auf den Kanaren nimmt man „pimienta palmera“) entstielen, entkernen und 30 Minuten in heißem Wasser einweichen. Dann mit einem Löffel das weiche Fruchtfleisch von der Haut schaben, die Haut wegwerfen. Die getrocknete Chili entkernen – sie macht den Mojo zum „Mojo picón“.',
  'Den Knoblauch schälen. Mit dem Kreuzkümmel (ganze Samen) und einer kräftigen Prise grobem Salz im Mörser zu einer Paste zerstoßen, dann das Ñora-Fruchtfleisch, die Chili und das Paprikapulver dazu und weiterreiben.',
  'Den Weißweinessig einrühren und das Olivenöl in dünnem Strahl unter ständigem Rühren einarbeiten, bis eine sämige, leuchtend rote Sauce entsteht (geht auch mit dem Stabmixer). Mit 1–2 EL Wasser auf die gewünschte Dicke bringen.',
  'Abschmecken – kräftig salzig, säuerlich und scharf – und in ein sauberes Glas füllen. Mit Öl bedeckt im Kühlschrank etwa 1 Woche haltbar; vor dem Servieren aufrühren. Klassisch zu Papas arrugadas, gegrilltem Fisch und Fleisch.',
]

const MOJO_VERDE_STEPS = [
  'Den Koriander waschen, trocken schleudern und mit den zarten Stielen grob hacken. Die grüne Paprika entkernen und klein würfeln, den Knoblauch schälen.',
  'Knoblauch, Kreuzkümmel und eine kräftige Prise grobes Salz im Mörser zerstoßen, Paprika und Koriander dazugeben und zu einer groben Paste reiben (oder alles im Mixbecher mit dem Stabmixer pürieren).',
  'Den Weißweinessig einrühren und das Olivenöl in dünnem Strahl unterschlagen, bis eine sämige grüne Sauce entsteht. Mit Salz und Essig abschmecken.',
  'In ein sauberes Glas füllen und im Kühlschrank aufbewahren – die Farbe hält etwa 4 Tage. Auf den Kanaren klassisch zu Papas arrugadas und Fisch; wer keinen Koriander mag, nimmt Petersilie (dann „mojo de perejil“).',
]

export const saucen: ExtraGroup = {
  recipes: [
    backen('grundrezept', 'alioli', 'Alioli (Knoblauch-Öl-Emulsion)',
      {
        cuisine: 'es',
        tapas: 'sauce',
        time: 15,
        yields: { name: 'Alioli selbstgemacht', amount: 220, unit: 'ml', shelf: 3, store: 'im Kühlschrank (Glas mit Deckel)', cat: 'konserven' },
      },
      '1 Stk Ei | 3 Zehe Knoblauch | 100 ml Olivenöl | 100 ml Sonnenblumenöl | 0.25 Stk Zitrone | Salz',
      ALIOLI_STEPS),

    backen('grundrezept', 'allioli-de-mortero', 'Allioli de mortero (Original-Allioli nur aus Knoblauch und Öl, im Mörser)',
      {
        cuisine: 'es',
        tapas: 'sauce',
        time: 25,
        yields: { name: 'Allioli (Mörser) selbstgemacht', amount: 120, unit: 'ml', shelf: 4, store: 'im Kühlschrank (Glas mit Deckel)', cat: 'konserven' },
      },
      '4 Zehe Knoblauch | 120 ml Olivenöl | Salz',
      ALLIOLI_STEPS),

    backen('grundrezept', 'salsa-brava', 'Salsa brava (scharfe Paprikasauce nach Madrider Art)',
      {
        cuisine: 'es',
        tapas: 'sauce',
        time: 25,
        yields: { name: 'Salsa brava selbstgemacht', amount: 350, unit: 'ml', shelf: 5, store: 'im Kühlschrank (Glas mit Deckel)', cat: 'konserven' },
      },
      '4 EL Olivenöl | 0.5 Stk Zwiebel | 1 Zehe Knoblauch | 2 EL Weizenmehl | 1 EL Paprikapulver geräuchert | 1 TL Paprikapulver rosenscharf | 0.25 TL Cayennepfeffer | 400 ml Hühnerbrühe | 1 TL Sherryessig | Salz',
      [
        'Die Zwiebel und den Knoblauch sehr fein würfeln. Das Olivenöl in einem kleinen Topf erhitzen und beides darin bei kleiner Hitze 5 Minuten glasig dünsten, ohne dass es Farbe nimmt.',
        'Das Weizenmehl darüberstäuben und unter Rühren 2 Minuten anschwitzen, bis es nach Keks riecht (eine helle Mehlschwitze, die später bindet).',
        'Den Topf vom Herd nehmen, Paprikapulver geräuchert (Pimentón de la Vera), Paprikapulver rosenscharf und Cayennepfeffer einrühren – nur wenige Sekunden, Pimentón verbrennt sofort und wird bitter. Sofort die Hühnerbrühe mit dem Schneebesen einrühren.',
        'Unter gelegentlichem Rühren 10 Minuten leise köcheln lassen, bis die Sauce sämig ist. Mit dem Stabmixer glatt pürieren, mit Sherryessig und Salz abschmecken – sie soll deutlich scharf sein („brava“ = wild). Die echte Madrider Salsa brava enthält keine Mayonnaise und keinen Ketchup.',
        'Abkühlen lassen, in ein sauberes Glas füllen und im Kühlschrank aufbewahren. Zum Servieren erwärmen; wird sie zu dick, mit einem Schuss Wasser verdünnen.',
      ]),

    backen('grundrezept', 'romesco', 'Salsa romesco (katalanische Ñora-Mandel-Sauce)',
      {
        cuisine: 'es',
        tapas: 'sauce',
        time: 60,
        yields: { name: 'Romesco selbstgemacht', amount: 400, unit: 'g', shelf: 5, store: 'im Kühlschrank (Glas mit Deckel, mit Öl bedeckt)', cat: 'konserven' },
      },
      '4 Stk Ñoras getrocknet | 3 Stk Tomate | 6 Zehe Knoblauch | 40 g Mandeln | 30 g Haselnusskerne | 1 Scheibe Weißbrot | 100 ml Olivenöl | 2 EL Sherryessig | 1 Stk Chili getrocknet | Salz',
      [
        'Die Ñoras (getrocknete, runde, milde Paprika aus Murcia/Valencia – spanische Feinkost oder online) entstielen, entkernen und 30 Minuten in heißem Wasser einweichen. Dann das weiche Fruchtfleisch mit einem Löffel von der Haut schaben.',
        'Die Tomaten und den Knoblauch (mit Schale) auf einem Blech im Backofen bei 200 °C 25 Minuten rösten, bis die Tomatenhaut aufplatzt und schwarze Stellen hat. Etwas abkühlen lassen, Tomaten häuten, Knoblauch aus der Schale drücken.',
        'Inzwischen Mandeln und Haselnusskerne in einer trockenen Pfanne goldbraun rösten (Haselnüsse danach in einem Tuch abrubbeln). Das Weißbrot in 1 EL vom Olivenöl von beiden Seiten goldbraun braten.',
        'Ñora-Fruchtfleisch, Tomaten, Knoblauch, Nüsse, Brot und die zerbröselte Chili im Mörser (traditionell) oder mit dem Stabmixer zu einer leicht körnigen Paste verarbeiten. Das restliche Olivenöl in dünnem Strahl einarbeiten, mit Sherryessig und Salz abschmecken.',
        'In ein Glas füllen, mit etwas Öl bedecken und im Kühlschrank aufbewahren. Klassisch zu Calçots, gegrilltem Gemüse, Fisch und Fleisch.',
      ]),

    backen('grundrezept', 'mojo-rojo', 'Mojo rojo picón (scharfe rote Kanaren-Sauce)',
      {
        cuisine: 'es',
        tapas: 'sauce',
        time: 40,
        yields: { name: 'Mojo rojo selbstgemacht', amount: 160, unit: 'ml', shelf: 7, store: 'im Kühlschrank (Glas mit Deckel)', cat: 'konserven' },
      },
      '2 Stk Ñoras getrocknet | 1 Stk Chili getrocknet | 4 Zehe Knoblauch | 1 TL Kreuzkümmel | 1 EL Paprikapulver edelsüß | 2 EL Weißweinessig | 100 ml Olivenöl | Salz',
      MOJO_ROJO_STEPS),

    backen('grundrezept', 'mojo-verde', 'Mojo verde (grüne Koriander-Knoblauch-Sauce von den Kanaren)',
      {
        cuisine: 'es',
        tapas: 'sauce',
        time: 15,
        yields: { name: 'Mojo verde selbstgemacht', amount: 200, unit: 'ml', shelf: 4, store: 'im Kühlschrank (Glas mit Deckel)', cat: 'konserven' },
      },
      '1 Bund Koriander | 0.5 Stk Paprika grün | 4 Zehe Knoblauch | 0.5 TL Kreuzkümmel | 2 EL Weißweinessig | 100 ml Olivenöl | Salz',
      MOJO_VERDE_STEPS),
  ],
  catalog: {
    konserven: ['Alioli', 'Salsa brava', 'Romesco', 'Mojo rojo', 'Mojo verde'],
  },
  products: {
    Alioli: prod(200, 'ml', 1.99, 180, 14, 'Glas'),
    'Salsa brava': prod(200, 'ml', 2.99, 365, 14, 'Glas'),
    Romesco: prod(180, 'g', 3.49, 365, 14, 'Glas'),
    'Mojo rojo': prod(200, 'ml', 2.99, 365, 30, 'Glas'),
    'Mojo verde': prod(200, 'ml', 2.99, 365, 30, 'Glas'),
  },
  nutrition: {
    Alioli: [650, 1, 70, 3, 0],
    'Salsa brava': [70, 1.5, 4, 7, 1.5],
    Romesco: [330, 6, 30, 9, 4],
    'Mojo rojo': [300, 2, 30, 6, 2],
    'Mojo verde': [330, 1.5, 34, 4, 2],
  },
  grams: {},
  substitutes: {
    groups: {
      alioli: ['Alioli', 'Alioli selbstgemacht', 'Allioli (Mörser) selbstgemacht'],
      bravas: ['Salsa brava', 'Salsa brava selbstgemacht'],
      romesco: ['Romesco', 'Romesco selbstgemacht'],
      'mojo-rojo': ['Mojo rojo', 'Mojo rojo selbstgemacht'],
      'mojo-verde': ['Mojo verde', 'Mojo verde selbstgemacht'],
    },
    preferred: {
      Alioli: ['Alioli selbstgemacht', 'Allioli (Mörser) selbstgemacht'],
      'Salsa brava': ['Salsa brava selbstgemacht'],
      Romesco: ['Romesco selbstgemacht'],
      'Mojo rojo': ['Mojo rojo selbstgemacht'],
      'Mojo verde': ['Mojo verde selbstgemacht'],
    },
  },
  deviceSteps: {
    alioli: plain(ALIOLI_STEPS),
    'allioli-de-mortero': plain(ALLIOLI_STEPS),
    'salsa-brava': [
      {
        text: 'Die Zwiebel und den Knoblauch sehr fein würfeln. Das Olivenöl in einem kleinen Topf auf dem BORA erhitzen und beides darin 5 Minuten glasig dünsten, ohne dass es Farbe nimmt.',
        settings: [bora('3', { minutes: 5 })],
      },
      {
        text: 'Das Weizenmehl darüberstäuben und unter Rühren 2 Minuten anschwitzen, bis es nach Keks riecht (eine helle Mehlschwitze, die später bindet).',
        settings: [bora('3', { minutes: 2 })],
      },
      { text: 'Den Topf vom Kochfeld ziehen, Paprikapulver geräuchert (Pimentón de la Vera), Paprikapulver rosenscharf und Cayennepfeffer einrühren – nur wenige Sekunden, Pimentón verbrennt sofort und wird bitter. Sofort die Hühnerbrühe mit dem Schneebesen einrühren.' },
      {
        text: 'Zurück auf das Kochfeld stellen und unter gelegentlichem Rühren 10 Minuten leise köcheln lassen, bis die Sauce sämig ist. Mit dem Stabmixer glatt pürieren, mit Sherryessig und Salz abschmecken – sie soll deutlich scharf sein („brava“ = wild). Die echte Madrider Salsa brava enthält keine Mayonnaise und keinen Ketchup.',
        settings: [bora('3', { minutes: 10 })],
      },
      { text: 'Abkühlen lassen, in ein sauberes Glas füllen und im Kühlschrank aufbewahren. Zum Servieren erwärmen; wird sie zu dick, mit einem Schuss Wasser verdünnen.' },
    ],
    romesco: [
      { text: 'Die Ñoras (getrocknete, runde, milde Paprika aus Murcia/Valencia – spanische Feinkost oder online) entstielen, entkernen und 30 Minuten in heißem Wasser einweichen. Dann das weiche Fruchtfleisch mit einem Löffel von der Haut schaben.' },
      {
        text: 'Die Tomaten und den Knoblauch (mit Schale) auf dem Kuchenblech im vorgeheizten Combair bei 200 °C Heißluft 25 Minuten rösten, bis die Tomatenhaut aufplatzt und schwarze Stellen hat. Etwas abkühlen lassen, Tomaten häuten, Knoblauch aus der Schale drücken.',
        settings: [vzug('combair', 'Heißluft', 200, { minutes: 25, note: 'vorheizen, Ebene 2' })],
      },
      {
        text: 'Inzwischen Mandeln und Haselnusskerne in einer trockenen Pfanne auf dem BORA goldbraun rösten (Haselnüsse danach in einem Tuch abrubbeln). Das Weißbrot in 1 EL vom Olivenöl von beiden Seiten goldbraun braten.',
        settings: [bora('5')],
      },
      { text: 'Ñora-Fruchtfleisch, Tomaten, Knoblauch, Nüsse, Brot und die zerbröselte Chili im Mörser (traditionell) oder mit dem Stabmixer zu einer leicht körnigen Paste verarbeiten. Das restliche Olivenöl in dünnem Strahl einarbeiten, mit Sherryessig und Salz abschmecken.' },
      { text: 'In ein Glas füllen, mit etwas Öl bedecken und im Kühlschrank aufbewahren. Klassisch zu Calçots, gegrilltem Gemüse, Fisch und Fleisch.' },
    ],
    'mojo-rojo': plain(MOJO_ROJO_STEPS),
    'mojo-verde': plain(MOJO_VERDE_STEPS),
  },
  imageQueries: {
    alioli: 'allioli garlic sauce',
    'allioli-de-mortero': 'allioli mortar',
    'salsa-brava': 'salsa brava',
    romesco: 'romesco sauce',
    'mojo-rojo': 'mojo picon',
    'mojo-verde': 'mojo verde',
  },
}
