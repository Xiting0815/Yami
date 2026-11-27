import { salat } from '../../define'
import { bora, vzug } from '../../device-helpers'
import type { ExtraGroup } from '../types'

/**
 * Salate & Beilagen · Kartoffel-, Reis-, Bohnen- und Gemüsesalate aller Küchen: schwäbischer und norddeutscher
 * Kartoffelsalat, Ensaladilla rusa, Ensalada de arroz, Empedrado (Bohnen mit Bacalao), Pipirrana, Esqueixada,
 * italienischer Reissalat, Linsensalat, griechischer Bauernsalat als Beilage, Krautsalat …
 * Anlegen mit `salat(id, titel, { group: 'kartoffel' | 'reis' | 'bohnen' | 'gemuese', cuisine, time, portions,
 * name: '… (selbstgemacht)', shelf }, zutaten, schritte)`. Die BBQ-Beilagen (src/data/extra/bbq/beilagen.ts)
 * erscheinen in diesem Bereich automatisch mit – dort Vorhandenes nicht doppelt anlegen (Southern Potato Salad, Coleslaw …).
 * Regeln: docs/spanien-regeln.md (Abschnitt Salate). Neue Fotos: Zeilen in scripts/fotos-neu-salate.md.
 */
export const salate: ExtraGroup = {
  recipes: [
    salat('ensaladilla-rusa', 'Ensaladilla rusa (spanischer Kartoffelsalat mit Thunfisch)',
      {
        group: 'kartoffel', cuisine: 'es', time: 90, portions: 6, name: 'Ensaladilla rusa (selbstgemacht)', shelf: 2,
      },
      '500 g Kartoffeln festkochend | 1 Stk Möhre | 100 g Erbsen TK | 2 Stk Ei | 1 Dose Thunfisch in Olivenöl | 10 Stk Oliven grün | 1 Stk Piquillo-Paprika | 150 g Mayonnaise | 0.25 Stk Zitrone | Salz | Pfeffer',
      [
        'Kartoffeln und Möhre schälen und in 1 cm große Würfel schneiden. In Salzwasser 12 bis 15 Minuten weich, aber nicht zerfallen kochen, die Erbsen in den letzten 3 Minuten mitgaren. Die Eier 10 Minuten hart kochen. Alles abkühlen lassen.',
        'Den Thunfisch gut abtropfen lassen und zerpflücken, die Eier pellen – ein Ei grob hacken, eines für die Deko in Spalten schneiden. Die Oliven halbieren, die Piquillo-Paprika in Streifen schneiden.',
        'Die Mayonnaise mit 1 TL Zitronensaft glatt rühren. Kartoffeln, Möhre, Erbsen, Thunfisch, gehacktes Ei und die Hälfte der Oliven mit zwei Dritteln der Mayonnaise vorsichtig mischen, salzen und pfeffern – ein paar zerdrückte Kartoffelstücke machen die Ensaladilla typisch cremig.',
        'In eine flache Schale streichen, mit der übrigen Mayonnaise glatt überziehen und mit Eispalten, Oliven und Paprikastreifen belegen. Mindestens 1 Stunde kalt stellen und kalt servieren. Sie ist in jeder spanischen Bar eine Tapa – und hält gekühlt 2 Tage.',
      ]),
    salat('kartoffelsalat-schwaebisch', 'Schwäbischer Kartoffelsalat (mit Brühe, Essig und Öl, ohne Mayo)',
      {
        group: 'kartoffel', cuisine: 'de', time: 60, portions: 6, name: 'Schwäbischer Kartoffelsalat (selbstgemacht)', shelf: 3,
      },
      '1200 g Kartoffeln festkochend | 1 Stk Zwiebel | 300 ml Rinderbrühe | 5 EL Weißweinessig | 1 TL Senf mittelscharf | 5 EL Sonnenblumenöl | 1 TL Zucker | 1 Bund Schnittlauch | Salz | Pfeffer',
      [
        'Die Kartoffeln (festkochend, z. B. Sieglinde oder Annabelle) mit Schale in Salzwasser 20 bis 25 Minuten garen (Garprobe: ein Messer gleitet leicht hinein), abgießen und kurz ausdampfen lassen.',
        'Die Kartoffeln noch warm pellen und in dünne Scheiben (3 mm) schneiden oder hobeln, in eine große Schüssel geben.',
        'Die Zwiebel sehr fein würfeln und mit der Brühe aufkochen. Vom Herd nehmen, Weißweinessig, Senf, Zucker, 1 TL Salz und Pfeffer einrühren und die heiße Marinade sofort über die warmen Kartoffeln gießen – nur warme Kartoffeln saugen die Brühe auf.',
        'Vorsichtig mischen und 30 Minuten ziehen lassen, dabei zwei- bis dreimal wenden. Erst dann das Sonnenblumenöl unterheben (zuerst Öl würde die Kartoffeln versiegeln). Der Salat soll glänzen und „schlonzig“ sein; ist er zu trocken, noch etwas warme Brühe dazu.',
        'Kräftig abschmecken und mit Schnittlauchröllchen bestreuen. Am besten lauwarm servieren – zu Schnitzel, Leberkäse oder Maultaschen. Hält gekühlt 3 Tage; vor dem Servieren Zimmertemperatur annehmen lassen.',
      ]),
    salat('kartoffelsalat-norddeutsch', 'Norddeutscher Kartoffelsalat mit Mayonnaise, Gewürzgurke, Ei und Apfel',
      {
        group: 'kartoffel', cuisine: 'de', time: 75, portions: 6, name: 'Norddeutscher Kartoffelsalat (selbstgemacht)', shelf: 2,
      },
      '1000 g Kartoffeln festkochend | 3 Stk Ei | 5 Stk Gewürzgurke | 1 Stk Apfel säuerlich | 1 Stk Zwiebel | 150 g Mayonnaise | 150 g Joghurt natur | 1 TL Senf mittelscharf | 0.5 Bund Schnittlauch | Salz | Pfeffer | Zucker',
      [
        'Die Kartoffeln mit Schale in Salzwasser 20 bis 25 Minuten garen (Garprobe: Messer gleitet hinein), abgießen, pellen und vollständig abkühlen lassen – im Norden kommt die Mayo an kalte Kartoffeln, sonst wird sie ölig. Die Eier 10 Minuten hart kochen und abschrecken.',
        'Die Kartoffeln in Scheiben schneiden. Gewürzgurken und Zwiebel fein würfeln, den Apfel (säuerlich, z. B. Boskoop) schälen und klein würfeln, die Eier pellen und hacken.',
        'Mayonnaise, Joghurt, Senf und 6 EL Gurkenwasser aus dem Glas glatt rühren, mit Salz, Pfeffer und einer Prise Zucker abschmecken. Das Gurkenwasser macht den Salat saftig und typisch norddeutsch-säuerlich.',
        'Alles vorsichtig unterheben und mindestens 2 Stunden, besser über Nacht, kalt durchziehen lassen. Vor dem Servieren nachwürzen, mit Schnittlauch bestreuen – klassisch zu Bratwurst, Frikadellen oder Würstchen. Hält gekühlt 2 Tage.',
      ]),
    salat('insalata-di-riso', 'Insalata di riso (italienischer Reissalat mit Thunfisch, Ei und Gemüse)',
      {
        group: 'reis', cuisine: 'it', time: 50, portions: 8, name: 'Insalata di riso (selbstgemacht)', shelf: 2,
      },
      '300 g Langkornreis | 1 Dose Thunfisch in Olivenöl | 2 Stk Ei | 100 g Erbsen TK | 0.5 Dose Mais | 1 Stk Paprika rot | 4 Stk Gewürzgurke | 60 g Oliven grün | 3 Stk Wiener Würstchen | 3 Scheibe Emmentaler | 5 EL Olivenöl | 0.5 Stk Zitrone | Salz | Pfeffer',
      [
        'Den Reis in reichlich Salzwasser wie Nudeln 1 Minute kürzer als angegeben kochen (in Italien nimmt man Parboiled-Reis wie „Ribe“, Langkornreis klappt genauso). In den letzten 3 Minuten die Erbsen mitkochen. Abgießen, kalt abspülen, damit die Körner nicht kleben, und gut abtropfen lassen. Die Eier 10 Minuten hart kochen und abschrecken.',
        'Paprika rot, Gewürzgurken, Wiener Würstchen (in Italien „würstel“) und Emmentaler in kleine Würfel schneiden, die Oliven in Ringe. Den Mais abtropfen lassen, den Thunfisch abtropfen lassen und zerpflücken.',
        'Reis, Erbsen, Mais, Paprika, Gurken, Oliven, Würstchen, Käse und Thunfisch mischen. Mit Olivenöl, dem Saft der Zitrone, Salz und Pfeffer anmachen – keine Mayonnaise, so wird die Insalata di riso in Italien als Sommer-Klassiker gegessen.',
        'Mindestens 1 Stunde kalt stellen, die Eier pellen und geviertelt darauflegen. Vor dem Servieren mit 1 EL Olivenöl auffrischen, der Reis schluckt das Dressing. Hält gekühlt 2 Tage (Fisch und Ei).',
      ]),
    salat('bohnensalat', 'Grüner Bohnensalat mit Speck und Bohnenkraut',
      {
        group: 'bohnen', cuisine: 'de', time: 35, portions: 4, name: 'Bohnensalat (selbstgemacht)', shelf: 3,
      },
      '600 g Grüne Bohnen | 1 Stk Zwiebel | 60 g Speckwürfel | 3 EL Weißweinessig | 3 EL Sonnenblumenöl | 0.5 Bund Bohnenkraut | 1 TL Zucker | Salz | Pfeffer',
      [
        'Die Bohnen waschen und die Enden abknipsen. Mit 2 Zweigen Bohnenkraut in Salzwasser 8 bis 10 Minuten bissfest garen (Garprobe: knacken noch leicht, schmecken aber nicht mehr grasig – rohe grüne Bohnen sind giftig, sie müssen immer gegart werden). In Eiswasser abschrecken, so bleiben sie leuchtend grün, und abtropfen lassen.',
        'Die Zwiebel fein würfeln. Die Speckwürfel in einer Pfanne ohne Fett knusprig auslassen, die Zwiebel 2 Minuten mitbraten.',
        'Weißweinessig, Sonnenblumenöl, Zucker, Salz und Pfeffer verrühren, die übrigen Bohnenkrautblätter fein hacken und dazugeben. Bohnen, Speck und Zwiebeln mit dem Dressing mischen.',
        'Mindestens 30 Minuten durchziehen lassen und vor dem Servieren nochmals abschmecken. Passt zu Braten, Frikadellen und vom Grill. Hält gekühlt 3 Tage (die Bohnen werden durch den Essig etwas blasser, schmecken aber gut).',
      ]),
    salat('insalata-fagioli-tonno', 'Insalata di fagioli e tonno (toskanischer Bohnensalat mit Thunfisch und roter Zwiebel)',
      {
        group: 'bohnen', cuisine: 'it', time: 20, portions: 4, name: 'Insalata di fagioli e tonno (selbstgemacht)', shelf: 2,
      },
      '2 Dose Cannellini-Bohnen | 1 Dose Thunfisch in Olivenöl | 1 Stk Zwiebel rot | 1 Bund Petersilie | 1 Stk Zitrone | 1 EL Rotweinessig | 3 EL Olivenöl | Salz | Pfeffer',
      [
        'Die Zwiebel rot halbieren und in hauchdünne Streifen schneiden, 10 Minuten in kaltes Wasser mit 1 Schuss Rotweinessig legen – sie wird mild und leuchtend rosa.',
        'Die Cannellini-Bohnen in einem Sieb abspülen und gut abtropfen lassen. Den Thunfisch abtropfen lassen und in grobe Stücke zupfen. Die Petersilie grob hacken.',
        'Den Saft der Zitrone mit dem übrigen Rotweinessig, dem Olivenöl, Salz und reichlich Pfeffer verschlagen.',
        'Bohnen, abgetropfte Zwiebel, Thunfisch und Petersilie mit dem Dressing mischen und 15 Minuten ziehen lassen. Mit einem Faden Olivenöl servieren – in der Toskana ein klassisches Antipasto und eine eiweißreiche Beilage. Hält gekühlt 2 Tage.',
      ]),
    salat('ensalada-mixta', 'Ensalada mixta (spanischer gemischter Salat mit Thunfisch, Ei und Oliven)',
      {
        group: 'gemuese', cuisine: 'es', time: 25, portions: 4, name: 'Ensalada mixta (selbstgemacht)', shelf: 2,
      },
      '1 Stk Kopfsalat | 3 Stk Tomate | 1 Stk Zwiebel | 1 Stk Möhre | 0.5 Dose Mais | 1 Dose Thunfisch in Olivenöl | 2 Stk Ei | 60 g Oliven grün | 4 EL Olivenöl | 2 EL Sherryessig | Salz',
      [
        'Die Eier 10 Minuten hart kochen, abschrecken, pellen und vierteln.',
        'Den Kopfsalat (in Spanien „lechuga“, gern auch Römersalat) waschen, trocken schleudern und in mundgerechte Stücke zupfen. Die Tomaten in Spalten schneiden, die Zwiebel in feine Ringe, die Möhre schälen und grob raspeln. Den Mais und den Thunfisch abtropfen lassen.',
        'Den Salat auf einer großen Platte verteilen, Tomaten, Zwiebelringe, Möhre und Mais darauf verteilen, Thunfisch, Eier und Oliven obenauf legen – die Ensalada mixta wird in Spanien angerichtet, nicht gemischt.',
        'Gewürzt wird erst am Tisch: zuerst Salz, dann Sherryessig, zuletzt reichlich Olivenöl darüber (die spanische Reihenfolge – Salz löst sich nur im Essig, nicht im Öl). Reste ohne Dressing getrennt aufbewahren; Salat und Belag halten so gekühlt 2 Tage.',
      ]),
    salat('pipirrana', 'Pipirrana (andalusischer Tomaten-Paprika-Gurken-Salat mit Thunfisch und Ei)',
      {
        group: 'gemuese', cuisine: 'es', time: 30, portions: 4, name: 'Pipirrana (selbstgemacht)', shelf: 2,
      },
      '4 Stk Tomate | 1 Stk Paprika grün | 1 Stk Salatgurke | 1 Stk Zwiebel | 2 Stk Ei | 1 Dose Thunfisch in Olivenöl | 1 Zehe Knoblauch | 5 EL Olivenöl | 2 EL Sherryessig | Salz',
      [
        'Die Eier 10 Minuten hart kochen und abschrecken. Die Tomaten (reif und aromatisch, im Winter lieber Rispentomaten) und die Paprika grün (in Andalusien die lange „pimiento italiano“, Spitzpaprika passt auch) in sehr kleine Würfel von 5 mm schneiden – das feine Schneiden ist das Wesen der Pipirrana.',
        'Die Salatgurke schälen und ebenso fein würfeln, die Zwiebel sehr fein hacken. Alles in einer Schüssel mit 1 TL Salz mischen.',
        'Die Eier pellen und das Eigelb mit dem Knoblauch und einer Prise Salz im Mörser zerdrücken, nach und nach Olivenöl und Sherryessig einrühren – so macht man es in Jaén, das Dressing wird leicht cremig. Das Eiweiß hacken.',
        'Dressing, gehacktes Eiweiß und den abgetropften, zerpflückten Thunfisch unter das Gemüse heben und mindestens 30 Minuten kalt durchziehen lassen. Eiskalt servieren, im Sommer mit Brot zum Tunken. Hält gekühlt 2 Tage.',
      ]),
    salat('krautsalat-bayerisch', 'Bayerischer Krautsalat (warm angemacht, mit Speck und Kümmel)',
      {
        group: 'gemuese', cuisine: 'de', time: 50, portions: 6, name: 'Bayerischer Krautsalat (selbstgemacht)', shelf: 4,
      },
      '800 g Weißkohl | 100 g Speckwürfel | 1 Stk Zwiebel | 150 ml Gemüsebrühe | 5 EL Weißweinessig | 3 EL Sonnenblumenöl | 1 TL Kümmel | 1 TL Zucker | Salz | Pfeffer',
      [
        'Den Weißkohl vierteln, den Strunk herausschneiden und das Kraut mit dem Hobel oder einem scharfen Messer in sehr feine Streifen schneiden. Mit 1 TL Salz 5 Minuten kräftig mit den Händen durchkneten, bis es weicher wird und Saft zieht.',
        'Die Speckwürfel in einer Pfanne ohne Fett bei mittlerer Hitze knusprig auslassen, die fein gewürfelte Zwiebel 2 Minuten mitbraten.',
        'Gemüsebrühe, Weißweinessig, Zucker und Kümmel in die Pfanne geben und aufkochen. Die heiße Marinade mit Speck und Zwiebeln sofort über das Kraut gießen – das „Abbrühen“ macht den bayerischen Krautsalat mild und saftig.',
        'Das Sonnenblumenöl unterheben, pfeffern und mindestens 1 Stunde (besser über Nacht) ziehen lassen, dabei ab und zu wenden. Lauwarm oder kalt zu Schweinebraten, Haxe oder Leberkäse. Hält gekühlt 4 Tage und wird mit jedem Tag besser.',
      ]),
    salat('gurkensalat', 'Gurkensalat mit Dill und Joghurt-Dressing',
      {
        group: 'gemuese', cuisine: 'de', time: 20, portions: 4, name: 'Gurkensalat (selbstgemacht)', shelf: 2,
      },
      '2 Stk Salatgurke | 150 g Joghurt natur | 2 EL Saure Sahne | 1 EL Weißweinessig | 0.5 Bund Dill | 1 Stk Zwiebel rot | 1 TL Zucker | Salz | Pfeffer',
      [
        'Die Salatgurken waschen, nach Geschmack schälen oder gestreift schälen, und in hauchdünne Scheiben hobeln. Mit 1 TL Salz mischen und 10 Minuten ziehen lassen, dann das Wasser gut ausdrücken – so wird der Salat nicht wässrig.',
        'Die Zwiebel rot in feine Ringe schneiden, den Dill fein hacken.',
        'Joghurt, saure Sahne, Weißweinessig und Zucker verrühren, mit Pfeffer und wenig Salz abschmecken (die Gurken sind schon gesalzen).',
        'Gurken, Zwiebel und Dill mit dem Dressing mischen und sofort oder nach 15 Minuten servieren. Hält gekühlt 2 Tage, zieht aber Wasser – vor dem Servieren abgießen und neu abschmecken.',
      ]),
  ],
  catalog: {},
  products: {},
  nutrition: {},
  grams: {},
  deviceSteps: {
    'ensaladilla-rusa': [
      {
        text: 'Kartoffeln und Möhre schälen und in 1 cm große Würfel schneiden. Den Wasserbehälter des CombiSteamers füllen, die Würfel im gelochten Garbehälter auf Ebene 2 bei 100 °C 18 Minuten dämpfen; die Eier nach 6 Minuten dazulegen und die Erbsen in den letzten 3 Minuten dazugeben.',
        settings: [vzug('steamer', 'Dämpfen', 100, { minutes: 18, note: 'gelochter Garbehälter, Ebene 2; Eier ab Minute 6 mit' })],
      },
      { text: 'Die Eier kalt abschrecken, alles abkühlen lassen. Den Thunfisch gut abtropfen lassen und zerpflücken, die Eier pellen – ein Ei grob hacken, eines für die Deko in Spalten schneiden. Die Oliven halbieren, die Piquillo-Paprika in Streifen schneiden.' },
      { text: 'Die Mayonnaise mit 1 TL Zitronensaft glatt rühren. Kartoffeln, Möhre, Erbsen, Thunfisch, gehacktes Ei und die Hälfte der Oliven mit zwei Dritteln der Mayonnaise vorsichtig mischen, salzen und pfeffern – ein paar zerdrückte Kartoffelstücke machen die Ensaladilla typisch cremig.' },
      { text: 'In eine flache Schale streichen, mit der übrigen Mayonnaise glatt überziehen und mit Eispalten, Oliven und Paprikastreifen belegen. Mindestens 1 Stunde kalt stellen und kalt servieren. Sie ist in jeder spanischen Bar eine Tapa – und hält gekühlt 2 Tage.' },
    ],
    'kartoffelsalat-schwaebisch': [
      {
        text: 'Den Wasserbehälter des CombiSteamers füllen und die ungeschälten Kartoffeln (festkochend, z. B. Sieglinde oder Annabelle) im gelochten Garbehälter bei 100 °C 30 Minuten dämpfen (Garprobe: ein Messer gleitet leicht hinein). Kurz ausdampfen lassen.',
        settings: [vzug('steamer', 'Dämpfen', 100, { minutes: 30, note: 'gelochter Garbehälter, Ebene 2' })],
      },
      { text: 'Die Kartoffeln noch warm pellen und in dünne Scheiben (3 mm) schneiden oder hobeln, in eine große Schüssel geben.' },
      {
        text: 'Die Zwiebel sehr fein würfeln und mit der Brühe in einem kleinen Topf aufkochen. Vom Herd nehmen, Weißweinessig, Senf, Zucker, 1 TL Salz und Pfeffer einrühren und die heiße Marinade sofort über die warmen Kartoffeln gießen – nur warme Kartoffeln saugen die Brühe auf.',
        settings: [bora('Power', { note: 'aufkochen' })],
      },
      { text: 'Vorsichtig mischen und 30 Minuten ziehen lassen, dabei zwei- bis dreimal wenden. Erst dann das Sonnenblumenöl unterheben (zuerst Öl würde die Kartoffeln versiegeln). Der Salat soll glänzen und „schlonzig“ sein; ist er zu trocken, noch etwas warme Brühe dazu.' },
      { text: 'Kräftig abschmecken und mit Schnittlauchröllchen bestreuen. Am besten lauwarm servieren – zu Schnitzel, Leberkäse oder Maultaschen. Hält gekühlt 3 Tage; vor dem Servieren Zimmertemperatur annehmen lassen.' },
    ],
    'kartoffelsalat-norddeutsch': [
      {
        text: 'Den Wasserbehälter des CombiSteamers füllen und die ungeschälten Kartoffeln im gelochten Garbehälter bei 100 °C 30 Minuten dämpfen (Garprobe: Messer gleitet hinein); die Eier für die letzten 11 Minuten dazulegen. Eier kalt abschrecken, Kartoffeln pellen und vollständig abkühlen lassen – im Norden kommt die Mayo an kalte Kartoffeln, sonst wird sie ölig.',
        settings: [vzug('steamer', 'Dämpfen', 100, { minutes: 30, note: 'gelochter Garbehälter, Ebene 2; Eier ab Minute 19 mit' })],
      },
      { text: 'Die Kartoffeln in Scheiben schneiden. Gewürzgurken und Zwiebel fein würfeln, den Apfel (säuerlich, z. B. Boskoop) schälen und klein würfeln, die Eier pellen und hacken.' },
      { text: 'Mayonnaise, Joghurt, Senf und 6 EL Gurkenwasser aus dem Glas glatt rühren, mit Salz, Pfeffer und einer Prise Zucker abschmecken. Das Gurkenwasser macht den Salat saftig und typisch norddeutsch-säuerlich.' },
      { text: 'Alles vorsichtig unterheben und mindestens 2 Stunden, besser über Nacht, kalt durchziehen lassen. Vor dem Servieren nachwürzen, mit Schnittlauch bestreuen – klassisch zu Bratwurst, Frikadellen oder Würstchen. Hält gekühlt 2 Tage.' },
    ],
    'insalata-di-riso': [
      {
        text: 'Reichlich Salzwasser im großen Topf auf dem BORA aufkochen und den Reis darin wie Nudeln 1 Minute kürzer als angegeben kochen (in Italien nimmt man Parboiled-Reis wie „Ribe“, Langkornreis klappt genauso). In den letzten 3 Minuten die Erbsen mitkochen. Abgießen, kalt abspülen, damit die Körner nicht kleben, und gut abtropfen lassen.',
        settings: [bora('Power', { note: 'Wasser aufkochen' }), bora('6', { minutes: 11, note: 'sprudelnd kochen' })],
      },
      {
        text: 'Den Wasserbehälter des CombiSteamers füllen und die Eier im gelochten Garbehälter bei 100 °C 11 Minuten dämpfen, kalt abschrecken.',
        settings: [vzug('steamer', 'Dämpfen', 100, { minutes: 11, note: 'gelochter Garbehälter' })],
      },
      { text: 'Paprika rot, Gewürzgurken, Wiener Würstchen (in Italien „würstel“) und Emmentaler in kleine Würfel schneiden, die Oliven in Ringe. Den Mais abtropfen lassen, den Thunfisch abtropfen lassen und zerpflücken.' },
      { text: 'Reis, Erbsen, Mais, Paprika, Gurken, Oliven, Würstchen, Käse und Thunfisch mischen. Mit Olivenöl, dem Saft der Zitrone, Salz und Pfeffer anmachen – keine Mayonnaise, so wird die Insalata di riso in Italien als Sommer-Klassiker gegessen.' },
      { text: 'Mindestens 1 Stunde kalt stellen, die Eier pellen und geviertelt darauflegen. Vor dem Servieren mit 1 EL Olivenöl auffrischen, der Reis schluckt das Dressing. Hält gekühlt 2 Tage (Fisch und Ei).' },
    ],
    bohnensalat: [
      {
        text: 'Den Wasserbehälter des CombiSteamers füllen. Die Bohnen waschen, die Enden abknipsen und mit 2 Zweigen Bohnenkraut im gelochten Garbehälter bei 100 °C 12 Minuten dämpfen (Garprobe: knacken noch leicht, schmecken aber nicht mehr grasig – rohe grüne Bohnen sind giftig, sie müssen immer gegart werden). Sofort in Eiswasser abschrecken, so bleiben sie leuchtend grün, und abtropfen lassen.',
        settings: [vzug('steamer', 'Dämpfen', 100, { minutes: 12, note: 'gelochter Garbehälter, Ebene 2' })],
      },
      {
        text: 'Die Zwiebel fein würfeln. Die Speckwürfel in einer Pfanne ohne Fett knusprig auslassen, die Zwiebel 2 Minuten mitbraten.',
        settings: [bora('5', { note: 'auslassen, dann Zwiebel mit' })],
      },
      { text: 'Weißweinessig, Sonnenblumenöl, Zucker, Salz und Pfeffer verrühren, die übrigen Bohnenkrautblätter fein hacken und dazugeben. Bohnen, Speck und Zwiebeln mit dem Dressing mischen.' },
      { text: 'Mindestens 30 Minuten durchziehen lassen und vor dem Servieren nochmals abschmecken. Passt zu Braten, Frikadellen und vom Grill. Hält gekühlt 3 Tage (die Bohnen werden durch den Essig etwas blasser, schmecken aber gut).' },
    ],
    'ensalada-mixta': [
      {
        text: 'Den Wasserbehälter des CombiSteamers füllen und die Eier im gelochten Garbehälter bei 100 °C 11 Minuten dämpfen, kalt abschrecken, pellen und vierteln.',
        settings: [vzug('steamer', 'Dämpfen', 100, { minutes: 11, note: 'gelochter Garbehälter' })],
      },
      { text: 'Den Kopfsalat (in Spanien „lechuga“, gern auch Römersalat) waschen, trocken schleudern und in mundgerechte Stücke zupfen. Die Tomaten in Spalten schneiden, die Zwiebel in feine Ringe, die Möhre schälen und grob raspeln. Den Mais und den Thunfisch abtropfen lassen.' },
      { text: 'Den Salat auf einer großen Platte verteilen, Tomaten, Zwiebelringe, Möhre und Mais darauf verteilen, Thunfisch, Eier und Oliven obenauf legen – die Ensalada mixta wird in Spanien angerichtet, nicht gemischt.' },
      { text: 'Gewürzt wird erst am Tisch: zuerst Salz, dann Sherryessig, zuletzt reichlich Olivenöl darüber (die spanische Reihenfolge – Salz löst sich nur im Essig, nicht im Öl). Reste ohne Dressing getrennt aufbewahren; Salat und Belag halten so gekühlt 2 Tage.' },
    ],
    pipirrana: [
      {
        text: 'Den Wasserbehälter des CombiSteamers füllen und die Eier im gelochten Garbehälter bei 100 °C 11 Minuten dämpfen, kalt abschrecken. Inzwischen die Tomaten (reif und aromatisch, im Winter lieber Rispentomaten) und die Paprika grün (in Andalusien die lange „pimiento italiano“, Spitzpaprika passt auch) in sehr kleine Würfel von 5 mm schneiden – das feine Schneiden ist das Wesen der Pipirrana.',
        settings: [vzug('steamer', 'Dämpfen', 100, { minutes: 11, note: 'gelochter Garbehälter' })],
      },
      { text: 'Die Salatgurke schälen und ebenso fein würfeln, die Zwiebel sehr fein hacken. Alles in einer Schüssel mit 1 TL Salz mischen.' },
      { text: 'Die Eier pellen und das Eigelb mit dem Knoblauch und einer Prise Salz im Mörser zerdrücken, nach und nach Olivenöl und Sherryessig einrühren – so macht man es in Jaén, das Dressing wird leicht cremig. Das Eiweiß hacken.' },
      { text: 'Dressing, gehacktes Eiweiß und den abgetropften, zerpflückten Thunfisch unter das Gemüse heben und mindestens 30 Minuten kalt durchziehen lassen. Eiskalt servieren, im Sommer mit Brot zum Tunken. Hält gekühlt 2 Tage.' },
    ],
    'krautsalat-bayerisch': [
      { text: 'Den Weißkohl vierteln, den Strunk herausschneiden und das Kraut mit dem Hobel oder einem scharfen Messer in sehr feine Streifen schneiden. Mit 1 TL Salz 5 Minuten kräftig mit den Händen durchkneten, bis es weicher wird und Saft zieht.' },
      {
        text: 'Die Speckwürfel in einer Pfanne ohne Fett bei mittlerer Hitze knusprig auslassen, die fein gewürfelte Zwiebel 2 Minuten mitbraten.',
        settings: [bora('5', { note: 'auslassen, dann Zwiebel mit' })],
      },
      {
        text: 'Gemüsebrühe, Weißweinessig, Zucker und Kümmel in die Pfanne geben und aufkochen. Die heiße Marinade mit Speck und Zwiebeln sofort über das Kraut gießen – das „Abbrühen“ macht den bayerischen Krautsalat mild und saftig.',
        settings: [bora('9', { note: 'aufkochen' })],
      },
      { text: 'Das Sonnenblumenöl unterheben, pfeffern und mindestens 1 Stunde (besser über Nacht) ziehen lassen, dabei ab und zu wenden. Lauwarm oder kalt zu Schweinebraten, Haxe oder Leberkäse. Hält gekühlt 4 Tage und wird mit jedem Tag besser.' },
    ],
  },
  imageQueries: {
    'ensaladilla-rusa': 'ensaladilla rusa',
    'kartoffelsalat-schwaebisch': 'swabian potato salad',
    'kartoffelsalat-norddeutsch': 'german potato salad mayonnaise',
    'insalata-di-riso': 'insalata di riso',
    bohnensalat: 'green bean salad bacon',
    'insalata-fagioli-tonno': 'insalata fagioli tonno',
    'ensalada-mixta': 'ensalada mixta',
    pipirrana: 'pipirrana',
    'krautsalat-bayerisch': 'bayerischer krautsalat',
    gurkensalat: 'german cucumber salad dill',
  },
}
