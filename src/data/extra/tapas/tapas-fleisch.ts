import { prod, tapa } from '../../define'
import { bora, plancha } from '../../device-helpers'
import type { ExtraGroup } from '../types'

/**
 * Tapas · Fleisch & Wurst (Pinchos morunos, Albóndigas en salsa, Chorizo a la sidra, Jamón con melón, Croquetas de jamón,
 * Pollo al ajillo als Tapa, Carrillada …).
 * Anlegen mit `tapa(id, 'Spanischer Titel (deutsche Erklärung)', { group: 'fleisch', time, serve, ahead? }, zutaten, schritte)`.
 * Gemeinsame Spanien-Zutaten (Chorizo, Serrano-Schinken, Manchego, Sidra …): src/data/extra/zutaten-es.ts – nicht neu anlegen.
 * Mengen: EIN Teller für 2 Personen als eine von ca. 5 Tapas, ca. 120–200 kcal je Person. Marinaden gehören in `ahead`
 * (Ablaufplan „Vorher“). Regeln: docs/spanien-regeln.md. Neue Fotos: Zeilen in scripts/fotos-neu-tapas-fleisch.md.
 */
export const tapasFleisch: ExtraGroup = {
  recipes: [
    tapa('pinchos-morunos', 'Pinchos morunos (maurische Schweinefleisch-Spießchen)',
      { group: 'fleisch', time: 25, serve: 'heiss', ahead: 'Fleisch mindestens 2 Stunden, am besten über Nacht marinieren' },
      '160 g Schweinefilet | 1 TL Paprikapulver geräuchert | 0.5 TL Kreuzkümmel | 0.5 TL Oregano getrocknet | 1 Zehe Knoblauch | 2 TL Olivenöl | 0.25 Stk Zitrone | 0.25 Bund Petersilie | Salz | Pfeffer',
      [
        'Das Schweinefilet (in Spanien „Lomo“) in 2 cm große Würfel schneiden. Knoblauch fein reiben und mit Olivenöl, geräuchertem Paprikapulver (in Spanien „Pimentón de la Vera“), Kreuzkümmel, Oregano und Pfeffer verrühren. Das Fleisch darin wenden und abgedeckt mindestens 2 Stunden, am besten über Nacht im Kühlschrank marinieren.',
        'Die Würfel auf 4 kleine Holzspieße stecken (vorher 30 Minuten in Wasser legen, dann verkohlen sie nicht) und erst kurz vor dem Braten salzen.',
        'Eine Gusseisenpfanne oder Plancha sehr heiß werden lassen und die Spieße darin 6 Minuten rundum braten, bis sie außen gebräunt und innen gerade durch sind.',
        'Mit Zitronensaft beträufeln, mit Petersilie bestreuen und heiß servieren. Der Name erinnert an die maurische Herkunft – in Andalusien werden sie heute meist mit Schweinefleisch gemacht, ursprünglich mit Lamm.',
      ]),

    tapa('albondigas-tapa', 'Albóndigas en salsa de tomate (Fleischbällchen in Tomatensauce)',
      {
        group: 'fleisch', time: 40, serve: 'heiss', ahead: 'Albóndigas am Vortag fertig schmoren und zum Servieren aufwärmen – durchgezogen schmecken sie noch besser',
      },
      '100 g Hackfleisch gemischt | 0.5 Scheibe Weißbrot | 1 EL Milch | 0.5 Stk Ei | 1 Zehe Knoblauch | 0.25 Bund Petersilie | 1 TL Weizenmehl | 2 TL Olivenöl | 0.25 Stk Zwiebel | 0.5 TL Paprikapulver edelsüß | 30 ml Weißwein | 120 g Passierte Tomaten | Salz | Pfeffer',
      [
        'Das Weißbrot ohne Rinde in der Milch einweichen. Knoblauch und die Hälfte der Petersilie fein hacken. Mit dem Hackfleisch, dem ausgedrückten Brot, dem verquirlten halben Ei, Salz und Pfeffer gut verkneten und mit nassen Händen 6 walnussgroße Bällchen formen. Rundherum dünn im Weizenmehl wälzen – so bekommen sie Farbe und binden später die Sauce.',
        'Das Olivenöl in einer kleinen Pfanne erhitzen und die Bällchen bei mittlerer Hitze 5 Minuten rundum braun anbraten (innen dürfen sie noch roh sein). Herausnehmen.',
        'Die Zwiebel fein würfeln und im Bratfett 4 Minuten glasig dünsten. Das Paprikapulver nur wenige Sekunden mitrösten (es verbrennt sofort und wird bitter), dann gleich mit dem Weißwein ablöschen und kurz einkochen lassen.',
        'Die passierten Tomaten zugeben, die Bällchen hineinlegen und mit Deckel bei kleiner Hitze 15 Minuten schmoren, bis sie durchgegart sind (Garprobe: ein Bällchen aufschneiden, innen nicht mehr rosa). Ist die Sauce zu dick, einen Schluck Wasser zugeben.',
        'Mit Salz und Pfeffer abschmecken, mit der restlichen Petersilie bestreuen und heiß in einer kleinen Tonschale servieren. In Spanien gibt es sie als Tapa in fast jeder Bar – mit Brot zum Tunken der Sauce.',
      ]),

    tapa('chorizo-a-la-sidra', 'Chorizo a la sidra (Chorizo in asturischem Apfelwein geschmort)',
      { group: 'fleisch', time: 20, serve: 'heiss' },
      '80 g Chorizo | 150 ml Cidre | 1 Blatt Lorbeerblatt',
      [
        'Eine Chorizo zum Braten nehmen (in Spanien „chorizo para cocinar“ oder „semicurado“, im Supermarkt als Chorizo-Bratwurst bzw. Sarta), nicht die harte Aufschnitt-Chorizo. Die Haut abziehen, wenn sie dick ist, und die Wurst in 1,5 cm dicke Scheiben schneiden.',
        'Die Scheiben ohne Fett in einer kleinen Pfanne oder Tonschale 2 Minuten anbraten, bis sie ihr rotes Fett abgeben.',
        'Mit dem Cidre ablöschen, das Lorbeerblatt zugeben und offen bei kleiner bis mittlerer Hitze 15 Minuten köcheln lassen, bis der Cidre um gut die Hälfte eingekocht und leicht sirupartig ist. In Asturien nimmt man naturtrübe, herbe „Sidra natural“ – am nächsten kommen ihr trockener Cidre brut aus der Normandie oder hessischer Apfelwein, süßer Cidre macht die Sauce klebrig.',
        'Das Lorbeerblatt entfernen und die Chorizo heiß mit der Sauce in der Schale servieren, mit Zahnstochern zum Aufpieken.',
      ]),

    tapa('croquetas-de-jamon', 'Croquetas de jamón (cremige Schinken-Kroketten)',
      {
        group: 'fleisch', time: 50, serve: 'heiss', ahead: 'Béchamel-Masse am Vortag kochen und kalt stellen – oder die panierten Croquetas bis 3 Monate vorher einfrieren und am Abend gefroren in den Airfryer geben',
      },
      '12 g Butter | 15 g Weizenmehl | 125 ml Milch | 25 g Serrano-Schinken | Muskatnuss | 0.5 Stk Ei | 20 g Paniermehl | 1 TL Olivenöl | Salz',
      [
        'Den Serrano-Schinken in sehr kleine Würfel (2–3 mm) schneiden. Die Butter in einem kleinen Topf bei mittlerer Hitze schmelzen, den Schinken 1 Minute darin anschwitzen.',
        'Das Weizenmehl darüberstäuben und unter Rühren 2 Minuten anschwitzen, ohne dass es Farbe nimmt – so verliert die Mehlschwitze den rohen Mehlgeschmack.',
        'Die kalte Milch in kleinen Schlucken zugießen und jedes Mal glatt rühren, bevor der nächste Schluck kommt. Dann bei kleiner Hitze unter ständigem Rühren 10 Minuten köcheln, bis eine sehr dicke Béchamel entsteht, die sich vom Topfboden löst. Mit Muskatnuss würzen, kaum salzen – der Schinken ist salzig. Das Geheimnis guter Croquetas: so wenig Mehl wie möglich, damit sie innen fast flüssig cremig bleiben.',
        'Die Masse in eine flache Form streichen, Frischhaltefolie direkt auf die Oberfläche legen (sonst bildet sich eine Haut) und mindestens 4 Stunden, besser über Nacht, im Kühlschrank fest werden lassen.',
        'Mit zwei Teelöffeln oder leicht geölten Händen 6 kleine längliche Croquetas formen. Erst im verquirlten Ei, dann im Paniermehl (in Spanien „pan rallado“) wenden und gut andrücken. Jetzt lassen sie sich einfrieren: einzeln auf einem Brett vorfrieren, dann in einen Beutel. Frische Croquetas vor dem Airfryer 30 Minuten ins Gefrierfach legen – dann platzen sie nicht.',
        'Den Airfryer auf 200 °C vorheizen. Die Croquetas mit dem Olivenöl einpinseln oder einsprühen, nebeneinander in den Korb legen und 10 Minuten goldbraun backen, nach der Hälfte vorsichtig wenden (direkt aus dem Tiefkühler 2–3 Minuten länger). Klassisch werden sie in reichlich heißem Olivenöl schwimmend ausgebacken.',
        'Kurz abkühlen lassen (innen sind sie sehr heiß) und servieren. Eine größere Menge lohnt sich: die doppelte oder dreifache Masse kochen und den Rest panieren und einfrieren.',
      ]),

    tapa('montaditos-de-lomo', 'Montaditos de lomo (Brotscheiben mit gebratenem Schweinefilet und Piquillo-Paprika)',
      { group: 'fleisch', time: 20, serve: 'heiss', ahead: 'Fleisch am Vortag oder mindestens 30 Minuten vorher im „adobo“ marinieren' },
      '100 g Schweinefilet | 1 Zehe Knoblauch | 0.5 TL Paprikapulver geräuchert | 0.25 TL Oregano getrocknet | 2 TL Olivenöl | 0.25 Stk Ciabatta | 2 Stk Piquillo-Paprika | Salz',
      [
        'Das Schweinefilet in 4 Medaillons schneiden und zwischen Frischhaltefolie auf 5 mm flach klopfen. In Spanien nimmt man „cinta de lomo“ (Schweinelachs), das Filet ist zarter und bleibt bei der kurzen Garzeit saftig. Den Knoblauch fein reiben und mit geräuchertem Paprikapulver, Oregano und 1 TL Olivenöl verrühren – das ist der „adobo“. Das Fleisch darin wenden und mindestens 30 Minuten marinieren.',
        'Die Ciabatta schräg in 4 Scheiben schneiden. Die Piquillo-Paprika abtropfen lassen und halbieren.',
        'Eine Gusseisenpfanne oder Plancha sehr heiß werden lassen. Die Brotscheiben darin ohne Fett 1 Minute je Seite anrösten, herausnehmen.',
        'Die Platte mit dem restlichen Olivenöl einpinseln, das Fleisch erst jetzt salzen und 1 Minute je Seite braten, bis es gerade durch ist. Die Piquillos daneben kurz anwärmen.',
        'Auf jede Brotscheibe ein Stück Lomo und eine Piquillo-Hälfte legen und mit einem Zahnstocher feststecken. Heiß servieren – „montar“ heißt aufsetzen, daher der Name.',
      ]),

    tapa('jamon-con-melon', 'Jamón con melón (luftgetrockneter Schinken mit kalter Melone)',
      { group: 'fleisch', time: 10, serve: 'kalt', ahead: 'Melone einige Stunden vorher kalt stellen' },
      '60 g Serrano-Schinken | 300 g Honigmelone | Pfeffer',
      [
        'Die Honigmelone gut gekühlt halbieren, die Kerne mit einem Löffel herauskratzen, die Schale abschneiden und das Fruchtfleisch in 8 schmale Spalten schneiden. In Spanien nimmt man die grünschalige „Piel de sapo“ (gibt es im Sommer bei Rewe, Edeka oder Lidl); Honig- oder Galiamelone schmeckt genauso gut – sie soll reif sein und duften.',
        'Den Serrano-Schinken 15 Minuten vor dem Servieren aus dem Kühlschrank nehmen, damit das Fett glänzt und er sein volles Aroma entfaltet. Wer es besonders gut meint, nimmt Jamón ibérico.',
        'Die Melonenspalten auf einer Platte auslegen und die Schinkenscheiben locker darüberlegen oder um die Spalten wickeln. Mit frisch gemahlenem Pfeffer bestreuen und sofort kalt servieren – die Sommer-Tapa schlechthin.',
      ]),

    tapa('morcilla-con-cebolla', 'Morcilla con cebolla y pimientos (gebratene Blutwurst mit geschmorten Zwiebeln und Piquillos)',
      {
        group: 'fleisch', time: 25, serve: 'heiss', ahead: 'Zwiebeln am Nachmittag schmoren und zum Servieren kurz aufwärmen',
      },
      '100 g Blutwurst | 0.5 Stk Zwiebel | 1 TL Olivenöl | 2 Stk Piquillo-Paprika | Salz',
      [
        'Die Zwiebel in feine Streifen schneiden und im Olivenöl mit einer Prise Salz bei kleiner Hitze 15 Minuten langsam weich und goldbraun schmoren, gelegentlich umrühren.',
        'Die Piquillo-Paprika in Streifen schneiden und die letzten 2 Minuten zu den Zwiebeln geben. Warm halten.',
        'Die Blutwurst in 1,5 cm dicke Scheiben schneiden, die Haut abziehen, wenn sie nicht essbar ist. Original ist die „Morcilla de Burgos“ mit Reis und Zwiebeln (spanischer Feinkostversand, manchmal bei Lidl-Spanienwochen); deutsche Blutwurst zum Braten oder französische Boudin noir sind der übliche Ersatz.',
        'Die Scheiben in einer heißen Gusseisenpfanne oder auf der Plancha ohne Fett 2 Minuten je Seite braten, bis sie außen knusprig sind; vorsichtig wenden, Morcilla de Burgos zerfällt leicht.',
        'Die Zwiebel-Paprika-Mischung auf einen Teller geben, die Blutwurst darauf setzen und heiß servieren.',
      ]),
  ],
  catalog: {
    gemuese: ['Honigmelone'],
  },
  products: {
    Honigmelone: prod(1, 'Stk', 2.49, 7, 3, 'Stk'),
  },
  nutrition: {
    Honigmelone: [54, 0.9, 0.1, 12, 0.9],
  },
  grams: {
    Honigmelone: { Stk: 1500 },
  },
  convert: {
    Honigmelone: { g: 1 / 1500 },
  },
  season: { Honigmelone: [6, 7, 8, 9] },
  deviceSteps: {
    'pinchos-morunos': [
      { text: 'Das Schweinefilet (in Spanien „Lomo“) in 2 cm große Würfel schneiden. Knoblauch fein reiben und mit Olivenöl, geräuchertem Paprikapulver (in Spanien „Pimentón de la Vera“), Kreuzkümmel, Oregano und Pfeffer verrühren. Das Fleisch darin wenden und abgedeckt mindestens 2 Stunden, am besten über Nacht im Kühlschrank marinieren.' },
      { text: 'Die Würfel auf 4 kleine Holzspieße stecken (vorher 30 Minuten in Wasser legen, dann verkohlen sie nicht) und erst kurz vor dem Braten salzen.' },
      {
        text: 'Die Plancha (Gusseisenpfanne) ohne Fett auf dem BORA 4 Minuten sehr heiß werden lassen.',
        settings: [plancha('bora', 'Vorheizen', { level: '8', minutes: 4 }), plancha('gasgrill', 'Vorheizen', { level: 'hoch', temp: 280, minutes: 10, note: 'Plancha auf dem Rost, Deckel zu', alt: true })],
      },
      {
        text: 'Die Spieße auf der Plancha 6 Minuten rundum braten, bis sie außen gebräunt und innen gerade durch sind.',
        settings: [plancha('bora', 'Braten', { level: '7', minutes: 6, note: 'alle 1–2 Min. wenden' }), plancha('gasgrill', 'Braten', { level: 'hoch', minutes: 6, alt: true })],
      },
      { text: 'Mit Zitronensaft beträufeln, mit Petersilie bestreuen und heiß servieren. Der Name erinnert an die maurische Herkunft – in Andalusien werden sie heute meist mit Schweinefleisch gemacht, ursprünglich mit Lamm.' },
    ],
    'albondigas-tapa': [
      { text: 'Das Weißbrot ohne Rinde in der Milch einweichen. Knoblauch und die Hälfte der Petersilie fein hacken. Mit dem Hackfleisch, dem ausgedrückten Brot, dem verquirlten halben Ei, Salz und Pfeffer gut verkneten und mit nassen Händen 6 walnussgroße Bällchen formen. Rundherum dünn im Weizenmehl wälzen – so bekommen sie Farbe und binden später die Sauce.' },
      {
        text: 'Das Olivenöl in einer kleinen Pfanne auf dem BORA erhitzen und die Bällchen 5 Minuten rundum braun anbraten (innen dürfen sie noch roh sein). Herausnehmen.',
        settings: [bora('6', { minutes: 5 })],
      },
      {
        text: 'Die Zwiebel fein würfeln und im Bratfett 4 Minuten glasig dünsten. Das Paprikapulver nur wenige Sekunden mitrösten (es verbrennt sofort und wird bitter), dann gleich mit dem Weißwein ablöschen und kurz einkochen lassen.',
        settings: [bora('4', { minutes: 4 })],
      },
      {
        text: 'Die passierten Tomaten zugeben, die Bällchen hineinlegen und mit Deckel 15 Minuten schmoren, bis sie durchgegart sind (Garprobe: ein Bällchen aufschneiden, innen nicht mehr rosa). Ist die Sauce zu dick, einen Schluck Wasser zugeben.',
        settings: [bora('3', { minutes: 15, note: 'Deckel drauf' })],
      },
      { text: 'Mit Salz und Pfeffer abschmecken, mit der restlichen Petersilie bestreuen und heiß in einer kleinen Tonschale servieren. In Spanien gibt es sie als Tapa in fast jeder Bar – mit Brot zum Tunken der Sauce.' },
    ],
    'chorizo-a-la-sidra': [
      { text: 'Eine Chorizo zum Braten nehmen (in Spanien „chorizo para cocinar“ oder „semicurado“, im Supermarkt als Chorizo-Bratwurst bzw. Sarta), nicht die harte Aufschnitt-Chorizo. Die Haut abziehen, wenn sie dick ist, und die Wurst in 1,5 cm dicke Scheiben schneiden.' },
      {
        text: 'Die Scheiben ohne Fett in einer kleinen Pfanne auf dem BORA 2 Minuten anbraten, bis sie ihr rotes Fett abgeben.',
        settings: [bora('6', { minutes: 2 })],
      },
      {
        text: 'Mit dem Cidre ablöschen, das Lorbeerblatt zugeben und offen 15 Minuten köcheln lassen, bis der Cidre um gut die Hälfte eingekocht und leicht sirupartig ist. In Asturien nimmt man naturtrübe, herbe „Sidra natural“ – am nächsten kommen ihr trockener Cidre brut aus der Normandie oder hessischer Apfelwein, süßer Cidre macht die Sauce klebrig.',
        settings: [bora('4', { minutes: 15 })],
      },
      { text: 'Das Lorbeerblatt entfernen und die Chorizo heiß mit der Sauce in einer vorgewärmten Tonschale servieren, mit Zahnstochern zum Aufpieken.' },
    ],
    'croquetas-de-jamon': [
      {
        text: 'Den Serrano-Schinken in sehr kleine Würfel (2–3 mm) schneiden. Die Butter in einem kleinen Topf auf dem BORA schmelzen, den Schinken 1 Minute darin anschwitzen.',
        settings: [bora('4', { minutes: 1 })],
      },
      {
        text: 'Das Weizenmehl darüberstäuben und unter Rühren 2 Minuten anschwitzen, ohne dass es Farbe nimmt – so verliert die Mehlschwitze den rohen Mehlgeschmack.',
        settings: [bora('4', { minutes: 2 })],
      },
      {
        text: 'Die kalte Milch in kleinen Schlucken zugießen und jedes Mal glatt rühren, bevor der nächste Schluck kommt. Dann unter ständigem Rühren 10 Minuten köcheln, bis eine sehr dicke Béchamel entsteht, die sich vom Topfboden löst. Mit Muskatnuss würzen, kaum salzen – der Schinken ist salzig. Das Geheimnis guter Croquetas: so wenig Mehl wie möglich, damit sie innen fast flüssig cremig bleiben.',
        settings: [bora('3', { minutes: 10 })],
      },
      { text: 'Die Masse in eine flache Form streichen, Frischhaltefolie direkt auf die Oberfläche legen (sonst bildet sich eine Haut) und mindestens 4 Stunden, besser über Nacht, im Kühlschrank fest werden lassen.' },
      { text: 'Mit zwei Teelöffeln oder leicht geölten Händen 6 kleine längliche Croquetas formen. Erst im verquirlten Ei, dann im Paniermehl (in Spanien „pan rallado“) wenden und gut andrücken. Jetzt lassen sie sich einfrieren: einzeln auf einem Brett vorfrieren, dann in einen Beutel. Frische Croquetas vor dem Airfryer 30 Minuten ins Gefrierfach legen – dann platzen sie nicht.' },
      {
        text: 'Den Airfryer auf 200 °C vorheizen.',
        settings: [{ device: 'airfryer', mode: 'Heissluft', temp: 200, minutes: 3, note: 'vorheizen' }],
      },
      {
        text: 'Die Croquetas mit dem Olivenöl einpinseln oder einsprühen, nebeneinander in den Korb legen und 10 Minuten goldbraun backen, nach der Hälfte vorsichtig wenden; direkt aus dem Tiefkühler 2–3 Minuten länger. Klassisch werden sie in reichlich heißem Olivenöl schwimmend ausgebacken.',
        settings: [{ device: 'airfryer', mode: 'Heissluft', temp: 200, minutes: 10, note: 'gefroren 12–13 Min.' }],
      },
      { text: 'Kurz abkühlen lassen (innen sind sie sehr heiß) und servieren. Eine größere Menge lohnt sich: die doppelte oder dreifache Masse kochen und den Rest panieren und einfrieren.' },
    ],
    'montaditos-de-lomo': [
      { text: 'Das Schweinefilet in 4 Medaillons schneiden und zwischen Frischhaltefolie auf 5 mm flach klopfen. In Spanien nimmt man „cinta de lomo“ (Schweinelachs), das Filet ist zarter und bleibt bei der kurzen Garzeit saftig. Den Knoblauch fein reiben und mit geräuchertem Paprikapulver, Oregano und 1 TL Olivenöl verrühren – das ist der „adobo“. Das Fleisch darin wenden und mindestens 30 Minuten marinieren.' },
      { text: 'Die Ciabatta schräg in 4 Scheiben schneiden. Die Piquillo-Paprika abtropfen lassen und halbieren.' },
      {
        text: 'Die Plancha (Gusseisenplatte oder -pfanne) ohne Fett auf dem BORA 4 Minuten sehr heiß werden lassen.',
        settings: [plancha('bora', 'Vorheizen', { level: '8', minutes: 4 }), plancha('gasgrill', 'Vorheizen', { level: 'hoch', temp: 260, minutes: 10, note: 'Plancha auf dem Rost, Deckel zu', alt: true })],
      },
      {
        text: 'Die Brotscheiben auf der Plancha ohne Fett 1 Minute je Seite anrösten, herausnehmen.',
        settings: [plancha('bora', 'Braten', { level: '7', minutes: 2 }), plancha('gasgrill', 'Braten', { level: 'mittel', minutes: 2, alt: true })],
      },
      {
        text: 'Die Plancha mit dem restlichen Olivenöl einpinseln, das Fleisch erst jetzt salzen und 1 Minute je Seite braten, bis es gerade durch ist. Die Piquillos daneben kurz anwärmen.',
        settings: [plancha('bora', 'Braten', { level: '8', minutes: 2 }), plancha('gasgrill', 'Braten', { level: 'hoch', minutes: 2, alt: true })],
      },
      { text: 'Auf jede Brotscheibe ein Stück Lomo und eine Piquillo-Hälfte legen und mit einem Zahnstocher feststecken. Heiß servieren – „montar“ heißt aufsetzen, daher der Name.' },
    ],
    'morcilla-con-cebolla': [
      {
        text: 'Die Zwiebel in feine Streifen schneiden und im Olivenöl mit einer Prise Salz in einer Pfanne auf dem BORA 15 Minuten langsam weich und goldbraun schmoren, gelegentlich umrühren.',
        settings: [bora('4', { minutes: 15 })],
      },
      {
        text: 'Die Piquillo-Paprika in Streifen schneiden und die letzten 2 Minuten zu den Zwiebeln geben. Warm halten.',
        settings: [bora('4', { minutes: 2 }), bora('Warmhalten')],
      },
      { text: 'Die Blutwurst in 1,5 cm dicke Scheiben schneiden, die Haut abziehen, wenn sie nicht essbar ist. Original ist die „Morcilla de Burgos“ mit Reis und Zwiebeln (spanischer Feinkostversand, manchmal bei Lidl-Spanienwochen); deutsche Blutwurst zum Braten oder französische Boudin noir sind der übliche Ersatz.' },
      {
        text: 'Die Scheiben auf der heißen Plancha oder in einer Gusseisenpfanne ohne Fett 2 Minuten je Seite braten, bis sie außen knusprig sind; vorsichtig wenden, Morcilla de Burgos zerfällt leicht.',
        settings: [plancha('bora', 'Braten', { level: '6', minutes: 4, note: '2 Min. je Seite, vorher 3 Min. vorheizen' })],
      },
      { text: 'Die Zwiebel-Paprika-Mischung auf einen Teller geben, die Blutwurst darauf setzen und heiß servieren.' },
    ],
  },
  imageQueries: {
    'pinchos-morunos': 'pinchos morunos',
    'albondigas-tapa': 'albóndigas en salsa de tomate',
    'chorizo-a-la-sidra': 'chorizo a la sidra',
    'croquetas-de-jamon': 'croquetas de jamón',
    'montaditos-de-lomo': 'montadito de lomo',
    'jamon-con-melon': 'jamón con melón',
    'morcilla-con-cebolla': 'morcilla de Burgos frita',
  },
}
