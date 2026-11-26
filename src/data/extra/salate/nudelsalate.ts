import { salat } from '../../define'
import { bora, vzug } from '../../device-helpers'
import type { ExtraGroup } from '../types'

/**
 * Salate & Beilagen · Nudelsalate aller Küchen: deutsch (klassisch mit Mayo, mit Fleischwurst, Schichtsalat-Art),
 * italienisch (Insalata di pasta mit Pesto/Tomaten/Mozzarella), spanisch (Ensalada de pasta mit Thunfisch und Oliven),
 * griechisch (Kritharaki-Salat) …
 * Anlegen mit `salat(id, titel, { group: 'nudel', cuisine, time, portions, name: '… (selbstgemacht)', shelf, lighter }, zutaten, schritte)`.
 * Mengen für `portions` Beilagen-Portionen (Grillabend/Gäste: 4–8). Ergebnis kommt bei „Fertig“ in den Vorrat (Kühlschrank).
 * Haltbarkeit: mit Mayo/Ei/Fleischwurst 2 Tage, mit Essig-Öl-Dressing 3 Tage. Regeln: docs/spanien-regeln.md (Abschnitt Salate).
 * Neue Fotos: Zeilen in scripts/fotos-neu-nudelsalate.md.
 */
export const nudelsalate: ExtraGroup = {
  recipes: [
    salat('nudelsalat-klassisch', 'Nudelsalat klassisch mit Fleischwurst, Erbsen und Gurke',
      {
        group: 'nudel', cuisine: 'de', time: 45, portions: 6, name: 'Nudelsalat (selbstgemacht)', shelf: 2,
        lighter: 'Fleischwurst durch Kochschinken ersetzen und die Mayonnaise ganz durch Joghurt mit 1 TL Senf – spart rund 120 kcal je Portion.',
      },
      '250 g Fusilli | 150 g Erbsen TK | 2 Stk Ei | 200 g Fleischwurst | 4 Stk Gewürzgurke | 0.5 Stk Paprika rot | 80 g Mayonnaise | 200 g Joghurt natur | 1 TL Senf mittelscharf | 0.5 Bund Schnittlauch | Salz | Pfeffer | Zucker',
      [
        'Die Nudeln in reichlich Salzwasser 1 Minute länger als angegeben kochen (im Salat ziehen sie Flüssigkeit, zu bissfeste Nudeln werden hart). In den letzten 2 Minuten die Erbsen mitkochen. Abgießen, kurz kalt abschrecken und abtropfen lassen. Die Eier 10 Minuten hart kochen und abschrecken.',
        'Fleischwurst, Gewürzgurken und Paprika in kleine Würfel schneiden, die Eier pellen und hacken, den Schnittlauch in Röllchen schneiden.',
        'Mayonnaise, Joghurt, Senf und 4 EL Gurkenwasser aus dem Glas glatt rühren, mit Salz, Pfeffer und einer Prise Zucker kräftig abschmecken – Nudeln schlucken viel Würze.',
        'Alles vorsichtig mischen und mindestens 1 Stunde abgedeckt im Kühlschrank durchziehen lassen. Vor dem Servieren nochmals abschmecken und, falls er zu fest geworden ist, mit 2 bis 3 EL Gurkenwasser oder Milch lockern. Hält gut gekühlt 2 Tage.',
      ]),
    salat('insalata-di-pasta-pesto', 'Insalata di pasta al pesto (italienischer Nudelsalat mit Pesto, getrockneten Tomaten und Rucola)',
      {
        group: 'nudel', cuisine: 'it', time: 40, portions: 6, name: 'Insalata di pasta al pesto (selbstgemacht)', shelf: 3,
        lighter: 'Nur 4 EL Pesto nehmen und mit 4 EL Nudelwasser strecken, das Öl der Tomaten weglassen und den Parmesan halbieren – spart rund 90 kcal je Portion.',
      },
      '250 g Fusilli | 6 EL Pesto Genovese | 80 g Getrocknete Tomaten in Öl | 250 g Kirschtomaten | 30 g Pinienkerne | 40 g Parmigiano Reggiano | 60 g Rucola | 0.5 Stk Zitrone | Olivenöl | Salz | Pfeffer',
      [
        'Die Nudeln in reichlich Salzwasser 1 Minute länger als angegeben kochen. Vor dem Abgießen 1 Tasse Nudelwasser abschöpfen, die Nudeln kurz kalt abschrecken und gut abtropfen lassen.',
        'Die Pinienkerne in einer Pfanne ohne Fett bei mittlerer Hitze 3 Minuten goldbraun rösten (dabeibleiben, sie verbrennen schnell) und abkühlen lassen.',
        'Die getrockneten Tomaten abtropfen lassen und in Streifen schneiden, die Kirschtomaten halbieren, den Parmigiano Reggiano grob hobeln.',
        'Das Pesto Genovese mit 4 EL Nudelwasser, 1 EL Zitronensaft und 1 EL Olivenöl glatt rühren – das Nudelwasser bindet die Sauce, so klebt nichts zusammen. Mit Nudeln, getrockneten Tomaten und Kirschtomaten mischen, salzen und pfeffern und 30 Minuten durchziehen lassen.',
        'Erst kurz vor dem Servieren den Rucola unterheben und mit Pinienkernen und Parmesan bestreuen – Rucola welkt sonst. Reste ohne Rucola halten gekühlt 3 Tage; vor dem Servieren 30 Minuten Zimmertemperatur gönnen, kalt schmeckt Pesto stumpf.',
      ]),
    salat('nudelsalat-joghurt', 'Leichter Nudelsalat mit Joghurt-Dressing, Kochschinken und Radieschen',
      {
        group: 'nudel', cuisine: 'de', time: 40, portions: 6, name: 'Nudelsalat mit Joghurt-Dressing (selbstgemacht)', shelf: 2,
        lighter: 'Ist schon die leichte Variante: für noch weniger kcal ein Drittel der Nudeln durch Gurke und Radieschen ersetzen.',
      },
      '250 g Fusilli | 150 g Erbsen TK | 150 g Kochschinken | 1 Bund Radieschen | 0.5 Stk Salatgurke | 3 Stk Gewürzgurke | 300 g Joghurt natur | 2 EL Mayonnaise | 1 TL Senf mittelscharf | 0.5 Bund Dill | 0.5 Bund Schnittlauch | Salz | Pfeffer | Zucker',
      [
        'Die Nudeln in reichlich Salzwasser 1 Minute länger als angegeben kochen, in den letzten 2 Minuten die Erbsen mitkochen. Abgießen, kalt abschrecken und gut abtropfen lassen.',
        'Kochschinken und Gewürzgurken in kleine Würfel schneiden, die Radieschen in dünne Scheiben, die Salatgurke längs halbieren, die Kerne mit einem Löffel herauskratzen (sonst wird der Salat wässrig) und würfeln. Dill und Schnittlauch fein schneiden.',
        'Joghurt, Mayonnaise, Senf und 3 EL Gurkenwasser aus dem Glas glatt rühren, mit Salz, Pfeffer und einer Prise Zucker kräftig abschmecken. Ein Teil Mayonnaise bleibt drin – nur Joghurt schmeckt schnell sauer und flockt aus.',
        'Nudeln, Erbsen, Schinken, Gewürzgurken und Salatgurke mit dem Dressing mischen und 1 Stunde abgedeckt kalt stellen. Radieschen und Kräuter erst vor dem Servieren unterheben, damit sie knackig und grün bleiben. Hält gekühlt 2 Tage; wird er fest, mit 2 EL Joghurt lockern.',
      ]),
    salat('ensalada-de-pasta', 'Ensalada de pasta (spanischer Nudelsalat mit Thunfisch, Oliven und Paprika)',
      {
        group: 'nudel', cuisine: 'es', time: 40, portions: 6, name: 'Ensalada de pasta (selbstgemacht)', shelf: 2,
        lighter: 'Thunfisch gut abtropfen lassen und nur 3 EL Olivenöl ins Dressing geben, dafür 1 EL mehr Essig und etwas Wasser – spart rund 70 kcal je Portion.',
      },
      '250 g Fusilli | 2 Dose Thunfisch in Olivenöl | 2 Stk Ei | 80 g Oliven grün | 1 Stk Paprika rot | 1 Stk Paprika grün | 1 Stk Zwiebel rot | 0.5 Dose Mais | 5 EL Olivenöl | 2 EL Sherryessig | 0.5 TL Paprikapulver edelsüß | 0.5 Bund Petersilie | Salz | Pfeffer',
      [
        'Die Nudeln (in Spanien „hélices“, also Spiralnudeln) in reichlich Salzwasser 1 Minute länger als angegeben kochen, kalt abschrecken und abtropfen lassen. Die Eier 10 Minuten hart kochen, abschrecken und pellen.',
        'Paprika rot und grün in kleine Würfel schneiden, die Zwiebel rot fein würfeln und 10 Minuten in kaltes Wasser legen (nimmt die Schärfe), dann abtropfen lassen. Die Oliven halbieren, den Mais abtropfen lassen, die Petersilie hacken. Den Thunfisch abtropfen lassen und grob zerpflücken.',
        'Für die Vinagreta das Olivenöl mit dem Sherryessig, dem Paprikapulver, Salz und Pfeffer kräftig verschlagen – ganz ohne Mayonnaise, so isst man den Salat in Spanien im Sommer am Strand oder als Picknick.',
        'Nudeln, Paprika, Zwiebel, Mais, Oliven und Thunfisch mit der Vinagreta mischen, 1 Stunde kalt stellen. Mit Eierachteln und Petersilie belegen. Hält gekühlt 2 Tage (Fisch und Ei).',
      ]),
    salat('kritharaki-salat', 'Kritharaki-Salat (griechischer Nudelsalat mit Feta, Gurke und Oliven)',
      {
        group: 'nudel', cuisine: 'gr', time: 35, portions: 6, name: 'Kritharaki-Salat (selbstgemacht)', shelf: 3,
        lighter: 'Feta auf 120 g reduzieren und dafür mehr Gurke und Paprika nehmen – spart rund 50 kcal je Portion.',
      },
      '250 g Kritharaki | 1 Stk Salatgurke | 250 g Kirschtomaten | 1 Stk Paprika grün | 1 Stk Zwiebel rot | 60 g Oliven schwarz | 200 g Feta | 5 EL Olivenöl | 2 EL Rotweinessig | 1 Stk Zitrone | 1 TL Oregano getrocknet | 0.5 Bund Petersilie | Salz | Pfeffer',
      [
        'Die Kritharaki (griechische Reisnudeln, im Nudelregal oder als „Orzo“) in reichlich Salzwasser nach Packungsangabe bissfest kochen, abgießen, kalt abschrecken und mit 1 EL Olivenöl mischen, damit sie nicht verkleben.',
        'Die Salatgurke würfeln, die Kirschtomaten vierteln, die Paprika grün würfeln, die Zwiebel rot in feine Streifen schneiden. Die Oliven schwarz (am besten Kalamata) halbieren, die Petersilie hacken.',
        'Das übrige Olivenöl mit Rotweinessig, dem Saft der Zitrone, dem Oregano (zwischen den Fingern zerreiben, das weckt das Aroma), Salz und Pfeffer verschlagen. Vorsichtig salzen, der Feta bringt viel Salz mit.',
        'Nudeln, Gemüse, Oliven und Petersilie mit dem Dressing mischen, den Feta darüberbröseln und 30 Minuten durchziehen lassen. Hält gekühlt 3 Tage; die Nudeln ziehen nach, dann mit 1 EL Zitronensaft und Öl auffrischen.',
      ]),
    salat('asiatischer-nudelsalat', 'Asiatischer Nudelsalat mit Mie-Nudeln, Hähnchen, Sesam und Erdnüssen',
      {
        group: 'nudel', cuisine: 'as', time: 40, portions: 4, name: 'Asiatischer Nudelsalat (selbstgemacht)', shelf: 3,
        lighter: 'Erdnüsse halbieren, Sesamöl auf 1 EL reduzieren und dafür mehr Gurke und Möhre nehmen – spart rund 70 kcal je Portion.',
      },
      '200 g Mie-Nudeln | 250 g Hähnchenbrustfilet | 2 Stk Möhre | 1 Stk Paprika rot | 0.5 Stk Salatgurke | 4 Stk Frühlingszwiebel | 0.5 Bund Koriander | 40 g Erdnüsse geröstet | 1 EL Sesam | 4 EL Sojasauce | 3 EL Reisessig | 2 EL Sesamöl | 1 EL Honig | 1 Stk Limette | 15 g Ingwer | 1 Zehe Knoblauch | Salz',
      [
        'Die Hähnchenbrust in leicht gesalzenem Wasser 12 bis 15 Minuten knapp unter dem Siedepunkt gar ziehen lassen (Garprobe: innen nicht mehr rosa, Kern 72 °C), abkühlen lassen und in feine Streifen zupfen.',
        'Die Mie-Nudeln nach Packungsangabe garen (meist 4 Minuten in kochendem Wasser), kalt abschrecken, gut abtropfen lassen und mit einer Schere ein paarmal durchschneiden, damit sich der Salat besser mischen lässt.',
        'Den Sesam in einer Pfanne ohne Fett 2 Minuten goldgelb rösten. Die Erdnüsse grob hacken. Möhren schälen und in feine Streifen hobeln, Paprika rot und Salatgurke in Streifen schneiden, die Frühlingszwiebeln in Ringe, den Koriander grob zupfen.',
        'Für das Dressing Ingwer und Knoblauch fein reiben, mit Sojasauce, Reisessig, Sesamöl, Honig und dem Saft der Limette verrühren.',
        'Nudeln, Hähnchen und Gemüse mit dem Dressing mischen und 20 Minuten durchziehen lassen. Mit Sesam, Erdnüssen und Koriander bestreuen. Hält gekühlt 3 Tage; Erdnüsse und Koriander bei Resten frisch darüber.',
      ]),
    salat('tortellini-salat', 'Tortellini-Salat mit Tomaten, Mozzarella und Basilikum-Vinaigrette',
      {
        group: 'nudel', cuisine: 'it', time: 35, portions: 6, name: 'Tortellini-Salat (selbstgemacht)', shelf: 2,
        lighter: 'Halb Tortellini, halb Kirschtomaten und Paprika nehmen und Mozzarella light verwenden – spart rund 100 kcal je Portion.',
      },
      '500 g Tortellini frisch | 250 g Kirschtomaten | 1 Stk Paprika gelb | 125 g Mozzarella | 1 Bund Basilikum | 1 Zehe Knoblauch | 5 EL Olivenöl | 3 EL Weißweinessig | 1 TL Senf mittelscharf | 20 g Parmigiano Reggiano | Salz | Pfeffer | Zucker',
      [
        'Die Tortellini in reichlich Salzwasser nach Packungsangabe kochen (meist 2 bis 3 Minuten, bis sie oben schwimmen), abgießen, kalt abschrecken und mit 1 EL Olivenöl mischen.',
        'Die Kirschtomaten halbieren, die Paprika gelb würfeln, den Mozzarella abtropfen lassen und würfeln.',
        'Für die Vinaigrette die Basilikumblätter mit Knoblauch, übrigem Olivenöl, Weißweinessig, Senf, 2 EL Wasser, Salz, Pfeffer und einer Prise Zucker mit dem Stabmixer kurz pürieren – nur kurz, sonst wird das Basilikum warm und bitter.',
        'Tortellini, Tomaten, Paprika und Mozzarella mit der Vinaigrette mischen, 30 Minuten durchziehen lassen und mit gehobeltem Parmigiano Reggiano bestreuen. Hält gekühlt 2 Tage (Käsefüllung und Mozzarella).',
      ]),
    salat('orzo-salat-zitrone', 'Orzo-Salat mit Zitrone, Hähnchen, Zucchini und Spinat',
      {
        group: 'nudel', cuisine: 'it', time: 45, portions: 4, name: 'Orzo-Salat mit Zitrone (selbstgemacht)', shelf: 3,
        lighter: 'Halb Orzo, halb gewürfelte Zucchini nehmen und den Parmesan weglassen – spart rund 80 kcal je Portion.',
      },
      '200 g Kritharaki | 300 g Hähnchenbrustfilet | 1 Stk Zucchini | 80 g Blattspinat frisch | 1 Stk Zitrone unbehandelt | 1 Bund Petersilie | 1 Zehe Knoblauch | 4 EL Olivenöl | 1 TL Honig | 30 g Parmigiano Reggiano | Salz | Pfeffer',
      [
        'Orzo heißt die reiskornförmige Pasta in Italien und den USA – in Deutschland gibt es sie als Kritharaki. Die Nudeln in Salzwasser nach Packungsangabe bissfest kochen, kalt abschrecken und mit 1 EL Olivenöl mischen.',
        'Die Hähnchenbrust salzen und pfeffern und in einer Pfanne mit 1 EL Olivenöl bei mittlerer Hitze je Seite 5 bis 6 Minuten braten (Garprobe: Kern 72 °C, Saft klar). Kurz ruhen lassen und in Würfel schneiden.',
        'Die Zucchini würfeln und in derselben Pfanne 4 Minuten kräftig anbraten, bis sie Farbe hat, aber noch Biss. Salzen und abkühlen lassen.',
        'Die Zitronenschale fein abreiben, den Saft auspressen. Mit dem übrigen Olivenöl, dem fein geriebenen Knoblauch, Honig, Salz und Pfeffer verrühren. Petersilie hacken, den Blattspinat grob schneiden.',
        'Orzo, Hähnchen, Zucchini, Spinat und Petersilie mit dem Dressing mischen und mit gehobeltem Parmigiano Reggiano bestreuen. Schmeckt lauwarm oder kalt, hält gekühlt 3 Tage – vor dem Servieren mit etwas Zitronensaft auffrischen.',
      ]),
  ],
  catalog: {},
  products: {},
  nutrition: {},
  grams: {},
  deviceSteps: {
    'nudelsalat-klassisch': [
      {
        text: 'Reichlich Salzwasser im großen Topf auf dem BORA aufkochen. Die Nudeln 1 Minute länger als angegeben kochen (im Salat ziehen sie Flüssigkeit, zu bissfeste Nudeln werden hart), in den letzten 2 Minuten die Erbsen mitkochen. Abgießen, kurz kalt abschrecken und abtropfen lassen.',
        settings: [bora('Power', { note: 'Wasser aufkochen' }), bora('7', { minutes: 11, note: 'sprudelnd kochen' })],
      },
      {
        text: 'Die Eier in einem kleinen Topf 10 Minuten hart kochen und kalt abschrecken.',
        settings: [bora('7', { minutes: 10 })],
      },
      { text: 'Fleischwurst, Gewürzgurken und Paprika in kleine Würfel schneiden, die Eier pellen und hacken, den Schnittlauch in Röllchen schneiden.' },
      { text: 'Mayonnaise, Joghurt, Senf und 4 EL Gurkenwasser aus dem Glas glatt rühren, mit Salz, Pfeffer und einer Prise Zucker kräftig abschmecken – Nudeln schlucken viel Würze.' },
      { text: 'Alles vorsichtig mischen und mindestens 1 Stunde abgedeckt im Kühlschrank durchziehen lassen. Vor dem Servieren nochmals abschmecken und, falls er zu fest geworden ist, mit 2 bis 3 EL Gurkenwasser oder Milch lockern. Hält gut gekühlt 2 Tage.' },
    ],
    'insalata-di-pasta-pesto': [
      {
        text: 'Reichlich Salzwasser im großen Topf auf dem BORA aufkochen und die Nudeln 1 Minute länger als angegeben kochen. Vor dem Abgießen 1 Tasse Nudelwasser abschöpfen, die Nudeln kurz kalt abschrecken und gut abtropfen lassen.',
        settings: [bora('Power', { note: 'Wasser aufkochen' }), bora('7', { minutes: 12, note: 'sprudelnd kochen' })],
      },
      {
        text: 'Die Pinienkerne in einer Pfanne ohne Fett 3 Minuten goldbraun rösten (dabeibleiben, sie verbrennen schnell) und abkühlen lassen.',
        settings: [bora('5', { minutes: 3 })],
      },
      { text: 'Die getrockneten Tomaten abtropfen lassen und in Streifen schneiden, die Kirschtomaten halbieren, den Parmigiano Reggiano grob hobeln.' },
      { text: 'Das Pesto Genovese mit 4 EL Nudelwasser, 1 EL Zitronensaft und 1 EL Olivenöl glatt rühren – das Nudelwasser bindet die Sauce, so klebt nichts zusammen. Mit Nudeln, getrockneten Tomaten und Kirschtomaten mischen, salzen und pfeffern und 30 Minuten durchziehen lassen.' },
      { text: 'Erst kurz vor dem Servieren den Rucola unterheben und mit Pinienkernen und Parmesan bestreuen – Rucola welkt sonst. Reste ohne Rucola halten gekühlt 3 Tage; vor dem Servieren 30 Minuten Zimmertemperatur gönnen, kalt schmeckt Pesto stumpf.' },
    ],
    'nudelsalat-joghurt': [
      {
        text: 'Reichlich Salzwasser im großen Topf auf dem BORA aufkochen. Die Nudeln 1 Minute länger als angegeben kochen, in den letzten 2 Minuten die Erbsen mitkochen. Abgießen, kalt abschrecken und gut abtropfen lassen.',
        settings: [bora('Power', { note: 'Wasser aufkochen' }), bora('7', { minutes: 11, note: 'sprudelnd kochen' })],
      },
      { text: 'Kochschinken und Gewürzgurken in kleine Würfel schneiden, die Radieschen in dünne Scheiben, die Salatgurke längs halbieren, die Kerne mit einem Löffel herauskratzen (sonst wird der Salat wässrig) und würfeln. Dill und Schnittlauch fein schneiden.' },
      { text: 'Joghurt, Mayonnaise, Senf und 3 EL Gurkenwasser aus dem Glas glatt rühren, mit Salz, Pfeffer und einer Prise Zucker kräftig abschmecken. Ein Teil Mayonnaise bleibt drin – nur Joghurt schmeckt schnell sauer und flockt aus.' },
      { text: 'Nudeln, Erbsen, Schinken, Gewürzgurken und Salatgurke mit dem Dressing mischen und 1 Stunde abgedeckt kalt stellen. Radieschen und Kräuter erst vor dem Servieren unterheben, damit sie knackig und grün bleiben. Hält gekühlt 2 Tage; wird er fest, mit 2 EL Joghurt lockern.' },
    ],
    'ensalada-de-pasta': [
      {
        text: 'Reichlich Salzwasser im großen Topf auf dem BORA aufkochen und die Nudeln (in Spanien „hélices“, also Spiralnudeln) 1 Minute länger als angegeben kochen. Abgießen, kalt abschrecken und abtropfen lassen.',
        settings: [bora('Power', { note: 'Wasser aufkochen' }), bora('7', { minutes: 11, note: 'sprudelnd kochen' })],
      },
      {
        text: 'Den Wasserbehälter des CombiSteamers füllen und die Eier im gelochten Garbehälter bei 100 °C 11 Minuten dämpfen, kalt abschrecken und pellen.',
        settings: [vzug('steamer', 'Dämpfen', 100, { minutes: 11, note: 'gelochter Garbehälter' })],
      },
      { text: 'Paprika rot und grün in kleine Würfel schneiden, die Zwiebel rot fein würfeln und 10 Minuten in kaltes Wasser legen (nimmt die Schärfe), dann abtropfen lassen. Die Oliven halbieren, den Mais abtropfen lassen, die Petersilie hacken. Den Thunfisch abtropfen lassen und grob zerpflücken.' },
      { text: 'Für die Vinagreta das Olivenöl mit dem Sherryessig, dem Paprikapulver, Salz und Pfeffer kräftig verschlagen – ganz ohne Mayonnaise, so isst man den Salat in Spanien im Sommer am Strand oder als Picknick.' },
      { text: 'Nudeln, Paprika, Zwiebel, Mais, Oliven und Thunfisch mit der Vinagreta mischen, 1 Stunde kalt stellen. Mit Eierachteln und Petersilie belegen. Hält gekühlt 2 Tage (Fisch und Ei).' },
    ],
    'kritharaki-salat': [
      {
        text: 'Reichlich Salzwasser auf dem BORA aufkochen und die Kritharaki (griechische Reisnudeln, im Nudelregal oder als „Orzo“) nach Packungsangabe bissfest kochen, dabei ab und zu umrühren. Abgießen, kalt abschrecken und mit 1 EL Olivenöl mischen, damit sie nicht verkleben.',
        settings: [bora('Power', { note: 'Wasser aufkochen' }), bora('7', { minutes: 9, note: 'sprudelnd kochen' })],
      },
      { text: 'Die Salatgurke würfeln, die Kirschtomaten vierteln, die Paprika grün würfeln, die Zwiebel rot in feine Streifen schneiden. Die Oliven schwarz (am besten Kalamata) halbieren, die Petersilie hacken.' },
      { text: 'Das übrige Olivenöl mit Rotweinessig, dem Saft der Zitrone, dem Oregano (zwischen den Fingern zerreiben, das weckt das Aroma), Salz und Pfeffer verschlagen. Vorsichtig salzen, der Feta bringt viel Salz mit.' },
      { text: 'Nudeln, Gemüse, Oliven und Petersilie mit dem Dressing mischen, den Feta darüberbröseln und 30 Minuten durchziehen lassen. Hält gekühlt 3 Tage; die Nudeln ziehen nach, dann mit 1 EL Zitronensaft und Öl auffrischen.' },
    ],
    'asiatischer-nudelsalat': [
      {
        text: 'Den Wasserbehälter des CombiSteamers füllen. Die Hähnchenbrust salzen und im gelochten Garbehälter bei 90 °C 18 Minuten dämpfen (Garprobe: innen nicht mehr rosa, Kern 72 °C), abkühlen lassen und in feine Streifen zupfen.',
        settings: [vzug('steamer', 'Dämpfen', 90, { minutes: 18, core: 72, note: 'gelochter Garbehälter, Ebene 2' })],
      },
      {
        text: 'Wasser im Topf auf dem BORA aufkochen und die Mie-Nudeln nach Packungsangabe garen (meist 4 Minuten), kalt abschrecken, gut abtropfen lassen und mit einer Schere ein paarmal durchschneiden, damit sich der Salat besser mischen lässt.',
        settings: [bora('Power', { note: 'Wasser aufkochen' }), bora('6', { minutes: 4 })],
      },
      {
        text: 'Den Sesam in einer Pfanne ohne Fett 2 Minuten goldgelb rösten. Die Erdnüsse grob hacken. Möhren schälen und in feine Streifen hobeln, Paprika rot und Salatgurke in Streifen schneiden, die Frühlingszwiebeln in Ringe, den Koriander grob zupfen.',
        settings: [bora('5', { minutes: 2 })],
      },
      { text: 'Für das Dressing Ingwer und Knoblauch fein reiben, mit Sojasauce, Reisessig, Sesamöl, Honig und dem Saft der Limette verrühren.' },
      { text: 'Nudeln, Hähnchen und Gemüse mit dem Dressing mischen und 20 Minuten durchziehen lassen. Mit Sesam, Erdnüssen und Koriander bestreuen. Hält gekühlt 3 Tage; Erdnüsse und Koriander bei Resten frisch darüber.' },
    ],
    'tortellini-salat': [
      {
        text: 'Reichlich Salzwasser auf dem BORA aufkochen und die Tortellini nach Packungsangabe kochen (meist 2 bis 3 Minuten, bis sie oben schwimmen). Abgießen, kalt abschrecken und mit 1 EL Olivenöl mischen.',
        settings: [bora('Power', { note: 'Wasser aufkochen' }), bora('6', { minutes: 3, note: 'nur leicht sprudeln, sonst platzen sie' })],
      },
      { text: 'Die Kirschtomaten halbieren, die Paprika gelb würfeln, den Mozzarella abtropfen lassen und würfeln.' },
      { text: 'Für die Vinaigrette die Basilikumblätter mit Knoblauch, übrigem Olivenöl, Weißweinessig, Senf, 2 EL Wasser, Salz, Pfeffer und einer Prise Zucker mit dem Stabmixer kurz pürieren – nur kurz, sonst wird das Basilikum warm und bitter.' },
      { text: 'Tortellini, Tomaten, Paprika und Mozzarella mit der Vinaigrette mischen, 30 Minuten durchziehen lassen und mit gehobeltem Parmigiano Reggiano bestreuen. Hält gekühlt 2 Tage (Käsefüllung und Mozzarella).' },
    ],
    'orzo-salat-zitrone': [
      {
        text: 'Orzo heißt die reiskornförmige Pasta in Italien und den USA – in Deutschland gibt es sie als Kritharaki. Salzwasser auf dem BORA aufkochen, die Nudeln nach Packungsangabe bissfest kochen, kalt abschrecken und mit 1 EL Olivenöl mischen.',
        settings: [bora('Power', { note: 'Wasser aufkochen' }), bora('7', { minutes: 9, note: 'sprudelnd kochen' })],
      },
      {
        text: 'Die Pfanne 1 Minute vorheizen. Die Hähnchenbrust salzen und pfeffern und mit 1 EL Olivenöl bei mittlerer Hitze je Seite 5 bis 6 Minuten braten (Garprobe: Kern 72 °C, Saft klar). Kurz ruhen lassen und in Würfel schneiden.',
        settings: [bora('6', { minutes: 12, note: 'Pfanne 1 Min. vorheizen' })],
      },
      {
        text: 'Die Zucchini würfeln und in derselben Pfanne 4 Minuten kräftig anbraten, bis sie Farbe hat, aber noch Biss. Salzen und abkühlen lassen.',
        settings: [bora('8', { minutes: 4 })],
      },
      { text: 'Die Zitronenschale fein abreiben, den Saft auspressen. Mit dem übrigen Olivenöl, dem fein geriebenen Knoblauch, Honig, Salz und Pfeffer verrühren. Petersilie hacken, den Blattspinat grob schneiden.' },
      { text: 'Orzo, Hähnchen, Zucchini, Spinat und Petersilie mit dem Dressing mischen und mit gehobeltem Parmigiano Reggiano bestreuen. Schmeckt lauwarm oder kalt, hält gekühlt 3 Tage – vor dem Servieren mit etwas Zitronensaft auffrischen.' },
    ],
  },
  imageQueries: {
    'nudelsalat-klassisch': 'german pasta salad',
    'insalata-di-pasta-pesto': 'pasta salad pesto sun-dried tomatoes rucola',
    'nudelsalat-joghurt': 'pasta salad yogurt dressing ham radish',
    'ensalada-de-pasta': 'ensalada de pasta atún',
    'kritharaki-salat': 'greek orzo salad feta',
    'asiatischer-nudelsalat': 'asian noodle salad sesame chicken',
    'tortellini-salat': 'tortellini salad',
    'orzo-salat-zitrone': 'lemon orzo salad chicken',
  },
}
