import { prod, tapa } from '../../define'
import { bora, plancha, vzug } from '../../device-helpers'
import type { DeviceSetting, DeviceStep } from '../../../types'
import type { ExtraGroup } from '../types'

/**
 * Tapas · Gemüse, Ei & Kartoffel, Brot & Dips: drei Untergruppen in einer Datei –
 *   group 'gemuese': Pimientos de Padrón, Champiñones al ajillo, Berenjenas con miel, Espinacas con garbanzos, Pisto …
 *   group 'ei':      Tortilla de patatas, Patatas bravas, Patatas alioli, Huevos rotos, Ensaladilla als Tapa …
 *   group 'brot':    Pan con tomate, Pan con alioli, Montaditos, Queso manchego con membrillo, Aceitunas aliñadas …
 * Anlegen mit `tapa(id, 'Spanischer Titel (deutsche Erklärung)', { group, time, serve, ahead? }, zutaten, schritte)`.
 * Saucen nur über die kaufbaren Grundnamen ('Alioli', 'Salsa brava', 'Romesco', 'Mojo rojo', 'Mojo verde') – das
 * Selbstgemachte aus tapas/saucen.ts nimmt Yami automatisch zuerst. Mengen: EIN Teller für 2 Personen als eine von ca. 5 Tapas.
 * Regeln: docs/spanien-regeln.md. Neue Fotos: Zeilen in scripts/fotos-neu-tapas-gemuese-saucen-desserts.md.
 */

/** Airfryer-Einstellung (Heißluft, Temperatur, Minuten) */
const airfryer = (temp: number, minutes: number, note?: string): DeviceSetting => ({
  device: 'airfryer',
  mode: 'Heissluft',
  temp,
  minutes,
  ...(note ? { note } : {}),
})

/** Kalte Tapas ohne Gerät: Geräte-Schritte = die klassischen Schritte (Kochmodus zeigt dieselben Texte) */
const plain = (steps: string[]): DeviceStep[] => steps.map((text) => ({ text }))

const MANCHEGO_STEPS = [
  'Den Manchego (am besten „curado“, 6–12 Monate gereift) 30 Minuten vorher aus dem Kühlschrank nehmen, die Rinde abschneiden und den Käse in 5 mm dünne Dreiecke schneiden.',
  'Die Quittenpaste („Dulce de membrillo“, in Spanien-Wochen bei Lidl/Aldi, im Feinkostregal oder online; ersatzweise Quittenbrot) in ebenso dünne, etwas kleinere Scheiben schneiden.',
  'Auf einem Brettchen abwechselnd Käse und Membrillo anrichten oder je ein Stück Membrillo auf ein Käsedreieck legen – in Spanien heißt die Kombination „Postre de músico“ der Hirten aus La Mancha. Zimmerwarm servieren.',
]

const ACEITUNAS_STEPS = [
  'Die grünen Oliven (am besten Manzanilla oder Gordal mit Stein) abgießen und abspülen. Jede Olive mit dem Messerrücken oder einem flachen Glas leicht anquetschen, bis sie aufplatzt („aceitunas machacadas“) – so zieht die Marinade bis zum Stein.',
  'Den Knoblauch andrücken, von der Zitrone mit dem Sparschäler 3 dünne Streifen Schale abschälen. Mit Thymian, Oregano, Kreuzkümmel, Paprikapulver, Sherryessig, Olivenöl und 3 EL Wasser in einem Glas mischen.',
  'Die Oliven untermischen, das Glas verschließen, kräftig schütteln und mindestens 24 Stunden (besser 2–3 Tage) im Kühlschrank ziehen lassen, ab und zu wenden. 30 Minuten vor dem Essen herausnehmen und mit etwas Marinade in einem Tonschälchen servieren. Im Kühlschrank halten sie gut 2 Wochen.',
]

export const tapasGemuese: ExtraGroup = {
  recipes: [
    tapa('tortilla-de-patatas', 'Tortilla de patatas (spanisches Kartoffel-Omelett)',
      { group: 'ei', time: 45, serve: 'lauwarm', ahead: 'Tortilla bis 2 Stunden vorher braten – lauwarm schmeckt sie am besten' },
      '180 g Kartoffeln festkochend | 2 Stk Ei | 0.5 Stk Zwiebel | 1 EL Olivenöl | Salz',
      [
        'Die Kartoffeln schälen, vierteln und in 3 mm dünne Scheiben schneiden, die Zwiebel in feine Streifen. Mit Salz mischen.',
        'Reichlich Olivenöl (ca. 150 ml, es wird danach abgegossen und wiederverwendet) in einer kleinen Pfanne (16–18 cm) erwärmen. Kartoffeln und Zwiebel darin bei kleiner Hitze 20 Minuten weich schmoren, nicht braten – sie sollen hell bleiben. In ein Sieb gießen und das Öl auffangen.',
        'Die Eier in einer Schüssel mit einer Prise Salz verquirlen, die noch warmen Kartoffeln untermischen und 10 Minuten ziehen lassen – so wird die Tortilla saftig.',
        '1 EL vom aufgefangenen Öl in der Pfanne erhitzen, die Masse hineingeben, glatt streichen und bei mittlerer Hitze 3 Minuten stocken lassen, dabei die Pfanne rütteln, damit nichts ansetzt.',
        'Einen flachen Teller auflegen, die Pfanne mit Schwung umdrehen, die Tortilla zurück in die Pfanne gleiten lassen und 2 Minuten fertig braten. Innen darf sie noch leicht cremig sein („jugosa“).',
        'Auf einen Teller gleiten lassen und lauwarm in Würfeln oder Spalten servieren. Mit oder ohne Zwiebel ist in Spanien eine Glaubensfrage – hier mit.',
      ]),

    // ---------- Ei & Kartoffel ----------
    tapa('patatas-bravas', 'Patatas bravas (Kartoffelwürfel mit scharfer Paprikasauce)',
      { group: 'ei', time: 35, serve: 'heiss', ahead: 'Salsa brava am Vortag kochen (Grundrezept) und die Kartoffeln vorher schneiden und wässern' },
      '300 g Kartoffeln festkochend | 1 EL Olivenöl | 80 ml Salsa brava | Salz',
      [
        'Die Kartoffeln schälen und in unregelmäßige Stücke von 2–3 cm schneiden – die Kanten werden besonders knusprig. 10 Minuten in kaltem Wasser wässern (spült Stärke ab), dann sehr gründlich trocken tupfen.',
        'Klassisch werden sie zweimal frittiert: erst 8 Minuten in Olivenöl bei 140 °C weich garen, abtropfen lassen, dann 3 Minuten bei 180 °C goldbraun und knusprig ausbacken. Mit dem Olivenöl aus der Zutatenliste geht es im Ofen oder Airfryer (siehe Geräte-Schritte). Mit Salz bestreuen.',
        'Die Salsa brava in einem kleinen Topf erwärmen – selbstgemacht nach Madrider Art (Pimentón, Brühe, keine Mayonnaise) schmeckt sie am besten.',
        'Die Kartoffeln auf einen Teller häufen und die heiße Salsa brava darübergeben. In Madrid gibt es nur die rote Sauce; in Katalonien kommen „bravas dobles“ zusätzlich mit Alioli. Mit Zahnstochern sofort servieren.',
      ]),

    tapa('patatas-alioli', 'Patatas alioli (Kartoffeln in Knoblauchcreme)',
      { group: 'ei', time: 35, serve: 'kalt', ahead: 'Kartoffeln am Vortag dämpfen, mit Alioli anmachen und kalt stellen – 30 Minuten vor dem Essen herausnehmen' },
      '250 g Kartoffeln festkochend | 40 ml Alioli | 0.25 Bund Petersilie | Salz',
      [
        'Die Kartoffeln schälen und in 2 cm große Würfel schneiden. In Salzwasser 12–15 Minuten garen, bis ein Messer ohne Widerstand hineingleitet, sie aber nicht zerfallen.',
        'Abgießen, ausdampfen lassen und auf lauwarm abkühlen lassen – heiße Kartoffeln lassen die Alioli ölig werden.',
        'Die Petersilie fein hacken. Kartoffeln vorsichtig mit der Alioli und der Hälfte der Petersilie mischen, mit Salz abschmecken.',
        'Mindestens 30 Minuten durchziehen lassen und zimmerkühl mit der übrigen Petersilie bestreut servieren. Mit selbstgemachter Alioli (am Vortag) wird es am besten.',
      ]),

    tapa('papas-arrugadas', 'Papas arrugadas con mojo (kanarische Runzelkartoffeln mit roter und grüner Sauce)',
      { group: 'ei', time: 40, serve: 'lauwarm', ahead: 'Mojo rojo und Mojo verde am Vortag zubereiten (Grundrezepte)' },
      '300 g Kartoffeln festkochend | 30 g Salz | 30 ml Mojo rojo | 30 ml Mojo verde',
      [
        'Kleine Kartoffeln (Drillinge, auf den Kanaren „papas bonitas“) gründlich waschen, aber nicht schälen. In einen breiten Topf legen, knapp mit Wasser bedecken und das Salz dazugeben – das Wasser soll salzig wie Meerwasser sein.',
        'Ohne Deckel aufkochen und 20 Minuten kochen, bis die Kartoffeln weich sind (Garprobe mit dem Messer).',
        'Das Wasser bis auf einen Fingerbreit abgießen, den Topf zurück auf kleine Hitze stellen und die Kartoffeln unter gelegentlichem Rütteln 5 Minuten trocknen lassen, bis die Schale schrumpelig ist und eine weiße Salzkruste hat.',
        'Mit Mojo rojo (scharf, rot) und Mojo verde (Koriander) in zwei Schälchen servieren. Man isst sie mit Schale – das Salz bleibt außen.',
      ]),

    tapa('huevos-rellenos', 'Huevos rellenos (gefüllte Eier mit Thunfisch)',
      { group: 'ei', time: 30, serve: 'kalt', ahead: 'Eier am Vortag kochen und füllen, abgedeckt kalt stellen' },
      '3 Stk Ei | 0.4 Dose Thunfisch in Olivenöl | 1 EL Mayonnaise | 1 Stk Piquillo-Paprika | Salz',
      [
        'Die Eier in kochendem Wasser 10 Minuten hart kochen, in Eiswasser abschrecken und schälen.',
        'Längs halbieren, die Eigelbe herauslösen. Den Thunfisch gut abtropfen lassen.',
        'Thunfisch, zwei Drittel der Eigelbe und die Mayonnaise mit der Gabel zu einer glatten Creme zerdrücken und mit Salz abschmecken. Mit einem Teelöffel oder Spritzbeutel in die Eiweißhälften füllen.',
        'Die Piquillo-Paprika in feine Streifen schneiden und auf die Eier legen, das restliche Eigelb fein darüberreiben. Bis zum Servieren kalt stellen – ein Klassiker jeder spanischen Bar-Vitrine.',
      ]),

    // ---------- Gemüse ----------
    tapa('pimientos-de-padron', 'Pimientos de Padrón (gebratene grüne Paprika mit grobem Salz)',
      { group: 'gemuese', time: 10, serve: 'heiss', ahead: 'Paprika vorher waschen und sehr gut trocknen' },
      '200 g Pimientos de Padrón | 1 EL Olivenöl | Salz',
      [
        'Die Pimientos de Padrón (Sommer bis Herbst im Gemüseregal) waschen und sehr gründlich trocken tupfen – nasse Paprika spritzen im heißen Öl. Die Stiele dranlassen, an ihnen isst man sie.',
        'Eine schwere Pfanne oder Plancha sehr heiß werden lassen.',
        'Das Olivenöl hineingeben, die Paprika darin 4 Minuten braten und dabei oft wenden, bis die Haut Blasen wirft und stellenweise braun wird, das Fruchtfleisch aber noch Biss hat.',
        'Auf einen Teller geben und kräftig mit grobem Salz („sal gorda“ oder Meersalzflocken) bestreuen. Sofort servieren – „unos pican y otros no“: etwa jede zehnte ist scharf.',
      ]),

    tapa('champinones-al-ajillo', 'Champiñones al ajillo (Knoblauch-Champignons mit Sherry)',
      { group: 'gemuese', time: 15, serve: 'heiss', ahead: 'Champignons putzen, Knoblauch schneiden und Petersilie hacken' },
      '250 g Champignons | 3 Zehe Knoblauch | 1 Stk Chili getrocknet | 1.5 EL Olivenöl | 30 ml Sherry fino | 0.25 Bund Petersilie | Salz',
      [
        'Die Champignons mit einem Pinsel oder Küchenpapier säubern (nicht waschen, sonst saugen sie Wasser) und halbieren, große vierteln. Den Knoblauch in dünne Scheiben schneiden, die getrocknete Chili („Guindilla“) zerbröseln, die Petersilie hacken.',
        'Das Olivenöl in einer Pfanne stark erhitzen, die Champignons hineingeben und 5 Minuten scharf anbraten – erst wenden, wenn sie unten goldbraun sind. Salzen.',
        'Die Hitze reduzieren, Knoblauch und Chili dazugeben und 1 Minute mitbraten, bis der Knoblauch duftet, aber nicht braun ist. Mit dem Sherry ablöschen und 2 Minuten einkochen lassen, bis eine kleine sämige Sauce entsteht.',
        'Mit Petersilie bestreuen und brutzelnd in einer Tonschale („Cazuela“) servieren.',
      ]),

    tapa('berenjenas-con-miel', 'Berenjenas con miel de caña (Auberginen-Sticks mit Zuckerrohrsirup)',
      { group: 'gemuese', time: 45, serve: 'heiss', ahead: 'Auberginen schneiden und in Salzwasser einlegen' },
      '1 Stk Aubergine | 3 EL Weizenmehl | 1.5 EL Olivenöl | 1.5 EL Zuckerrübensirup | Salz',
      [
        'Die Aubergine längs in 1 cm dicke Scheiben und diese in 1 cm breite Sticks schneiden. 30 Minuten in kaltes Salzwasser (oder Milch, wie in Córdoba) legen – das nimmt Bitterstoffe und die Aubergine saugt später weniger Öl.',
        'Abgießen, sehr gut trocken tupfen und im Weizenmehl mit einer Prise Salz wenden, überschüssiges Mehl abklopfen.',
        'Klassisch in heißem Olivenöl (180 °C) portionsweise 2–3 Minuten goldbraun frittieren; mit dem Olivenöl aus der Zutatenliste gelingt es fettärmer im Ofen oder Airfryer (siehe Geräte-Schritte).',
        'Auf einem Teller anrichten und mit dem Sirup beträufeln. Original ist „Miel de caña“ (Zuckerrohrsirup aus Frigiliana bei Málaga, im spanischen Feinkost-Versand); Zuckerrübensirup schmeckt sehr ähnlich, Zuckerrohr-Melasse aus dem Reformhaus ist herber. Mit Meersalzflocken sofort servieren.',
      ]),

    tapa('espinacas-con-garbanzos', 'Espinacas con garbanzos (Spinat mit Kichererbsen nach Sevilla-Art)',
      { group: 'gemuese', time: 25, serve: 'heiss', ahead: 'Lässt sich am Vortag komplett kochen und aufwärmen – schmeckt dann noch besser' },
      '250 g Blattspinat frisch | 0.5 Dose Kichererbsen | 2 Zehe Knoblauch | 1 Scheibe Weißbrot | 1.5 EL Olivenöl | 1 TL Kreuzkümmel | 1 TL Paprikapulver geräuchert | 1 TL Sherryessig | Salz | Pfeffer',
      [
        'Den Spinat waschen und abtropfen lassen, große Stiele entfernen. Die Kichererbsen abgießen und abspülen. Den Knoblauch in Scheiben schneiden, das Weißbrot ohne Rinde würfeln.',
        'Das Olivenöl in einer Pfanne erhitzen, Brot und Knoblauch darin 3 Minuten goldbraun rösten. In einen Mörser geben, Kreuzkümmel, Paprikapulver und Sherryessig dazu und mit 3 EL Wasser zu einer dicken Paste zerstoßen – dem „Majado“, das die Sauce bindet (geht auch mit dem Stabmixer).',
        'Den Spinat in die heiße Pfanne geben und 3 Minuten zusammenfallen lassen.',
        'Kichererbsen, Majado und 100 ml Wasser unterrühren und 5 Minuten köcheln lassen, bis alles sämig ist. Mit Salz und Pfeffer abschmecken und in einer Tonschale servieren – in Sevilla eine typische Fasten-Tapa der Karwoche.',
      ]),

    // ---------- Brot & Dips ----------
    tapa('pan-con-tomate', 'Pan con tomate (Pa amb tomàquet – geröstetes Brot mit Tomate und Olivenöl)',
      { group: 'brot', time: 10, serve: 'lauwarm', ahead: 'Brot vorher in Scheiben schneiden – rösten und einreiben erst kurz vor dem Essen' },
      '0.35 Stk Ciabatta | 1 Stk Tomate | 1 Zehe Knoblauch | 1 EL Olivenöl | Salz',
      [
        'Das Ciabatta (oder ein anderes rustikales Weißbrot, in Katalonien „pan de payés“) in 4 Scheiben von 1,5 cm schneiden. Eine sehr reife Tomate quer halbieren, den Knoblauch schälen und halbieren.',
        'Die Brotscheiben in einer trockenen Pfanne oder auf dem Grill von beiden Seiten knusprig rösten.',
        'Die warmen Scheiben ganz leicht mit der Schnittfläche des Knoblauchs einreiben, dann kräftig mit der Tomatenhälfte, bis nur noch die Haut in der Hand bleibt.',
        'Mit dem Olivenöl beträufeln, leicht salzen und sofort servieren. Variante aus Andalusien („tostada con tomate“): die Tomate reiben und das Mus auf das Brot streichen.',
      ]),

    tapa('queso-manchego-con-membrillo', 'Queso manchego con membrillo (Schafskäse mit Quittenpaste)',
      { group: 'brot', time: 5, serve: 'kalt', ahead: 'Käse und Membrillo vorher aufschneiden und abgedeckt bereitstellen' },
      '70 g Manchego | 50 g Quittenpaste',
      MANCHEGO_STEPS),

    tapa('aceitunas-alinadas', 'Aceitunas aliñadas (marinierte grüne Oliven)',
      { group: 'brot', time: 10, serve: 'kalt', ahead: 'Oliven mindestens einen Tag (besser 2–3 Tage) vorher einlegen' },
      '120 g Oliven grün | 1 Zehe Knoblauch | 0.25 Stk Zitrone unbehandelt | 2 Zweig Thymian | 0.5 TL Oregano getrocknet | 0.5 TL Kreuzkümmel | 0.5 TL Paprikapulver edelsüß | 1 EL Sherryessig | 1 EL Olivenöl',
      ACEITUNAS_STEPS),
  ],
  catalog: {
    konserven: ['Quittenpaste'],
  },
  products: {
    // „Dulce de membrillo“: Schale 400 g (Spanien-Wochen Lidl/Aldi, Feinkost, online), angebrochen im Kühlschrank ca. 1 Monat
    Quittenpaste: prod(400, 'g', 3.99, 365, 30, 'Schale'),
  },
  nutrition: {
    Quittenpaste: [260, 0.4, 0.1, 64, 2],
  },
  grams: {},
  deviceSteps: {
    'tortilla-de-patatas': [
      { text: 'Die Kartoffeln schälen, vierteln und in 3 mm dünne Scheiben schneiden, die Zwiebel in feine Streifen. Mit Salz mischen.' },
      {
        text: 'Reichlich Olivenöl (ca. 150 ml, es wird danach abgegossen und wiederverwendet) in einer kleinen Pfanne (16–18 cm) auf dem BORA erwärmen. Kartoffeln und Zwiebel darin 20 Minuten weich schmoren, nicht braten – sie sollen hell bleiben. In ein Sieb gießen und das Öl auffangen.',
        settings: [bora('4', { minutes: 20 })],
      },
      { text: 'Die Eier in einer Schüssel mit einer Prise Salz verquirlen, die noch warmen Kartoffeln untermischen und 10 Minuten ziehen lassen – so wird die Tortilla saftig.' },
      {
        text: '1 EL vom aufgefangenen Öl in der Pfanne erhitzen, die Masse hineingeben, glatt streichen und 3 Minuten stocken lassen, dabei die Pfanne rütteln, damit nichts ansetzt.',
        settings: [bora('6', { minutes: 3 })],
      },
      {
        text: 'Einen flachen Teller auflegen, die Pfanne mit Schwung umdrehen, die Tortilla zurück in die Pfanne gleiten lassen und 2 Minuten fertig braten. Innen darf sie noch leicht cremig sein („jugosa“).',
        settings: [bora('6', { minutes: 2 })],
      },
      { text: 'Auf einen Teller gleiten lassen und lauwarm in Würfeln oder Spalten servieren. Mit oder ohne Zwiebel ist in Spanien eine Glaubensfrage – hier mit.' },
    ],
    'patatas-bravas': [
      { text: 'Die Kartoffeln schälen und in unregelmäßige Stücke von 2–3 cm schneiden – die Kanten werden besonders knusprig. 10 Minuten in kaltem Wasser wässern (spült Stärke ab), dann sehr gründlich trocken tupfen.' },
      {
        text: 'Die Kartoffeln mit dem Olivenöl und Salz mischen und im vorgeheizten Airfryer bei 200 °C 22 Minuten knusprig backen, dabei 2- bis 3-mal schütteln. Garprobe: außen goldbraun, innen gleitet ein Messer ohne Widerstand hinein.',
        settings: [airfryer(200, 22, 'vorheizen, 2–3× schütteln')],
      },
      {
        text: 'Inzwischen die Salsa brava in einem kleinen Topf auf dem BORA 3 Minuten erwärmen – selbstgemacht nach Madrider Art (Pimentón, Brühe, keine Mayonnaise) schmeckt sie am besten.',
        settings: [bora('4', { minutes: 3 })],
      },
      { text: 'Die Kartoffeln auf einen Teller häufen und die heiße Salsa brava darübergeben. In Madrid gibt es nur die rote Sauce; in Katalonien kommen „bravas dobles“ zusätzlich mit Alioli. Mit Zahnstochern sofort servieren.' },
    ],
    'patatas-alioli': [
      { text: 'Die Kartoffeln schälen und in 2 cm große Würfel schneiden. Den Wasserbehälter des CombiSteamers füllen.' },
      {
        text: 'Die Würfel im gelochten Garbehälter leicht salzen und im CombiSteamer 18 Minuten dämpfen, bis ein Messer ohne Widerstand hineingleitet, sie aber nicht zerfallen. Auf lauwarm abkühlen lassen – heiße Kartoffeln lassen die Alioli ölig werden.',
        settings: [vzug('steamer', 'Dämpfen', 100, { minutes: 18, note: 'gelochter Garbehälter' })],
      },
      { text: 'Die Petersilie fein hacken. Kartoffeln vorsichtig mit der Alioli und der Hälfte der Petersilie mischen, mit Salz abschmecken.' },
      { text: 'Mindestens 30 Minuten durchziehen lassen und zimmerkühl mit der übrigen Petersilie bestreut servieren. Mit selbstgemachter Alioli (am Vortag) wird es am besten.' },
    ],
    'papas-arrugadas': [
      { text: 'Kleine Kartoffeln (Drillinge, auf den Kanaren „papas bonitas“) gründlich waschen, aber nicht schälen. In einen breiten Topf legen, knapp mit Wasser bedecken und das Salz dazugeben – das Wasser soll salzig wie Meerwasser sein.' },
      {
        text: 'Ohne Deckel auf dem BORA aufkochen und 20 Minuten kochen, bis die Kartoffeln weich sind (Garprobe mit dem Messer).',
        settings: [bora('Power', { note: 'aufkochen' }), bora('6', { minutes: 20 })],
      },
      {
        text: 'Das Wasser bis auf einen Fingerbreit abgießen, den Topf zurück auf das Kochfeld stellen und die Kartoffeln unter gelegentlichem Rütteln 5 Minuten trocknen lassen, bis die Schale schrumpelig ist und eine weiße Salzkruste hat.',
        settings: [bora('3', { minutes: 5 })],
      },
      { text: 'Mit Mojo rojo (scharf, rot) und Mojo verde (Koriander) in zwei Schälchen servieren. Man isst sie mit Schale – das Salz bleibt außen.' },
    ],
    'huevos-rellenos': [
      {
        text: 'Den Wasserbehälter des CombiSteamers füllen. Die Eier im gelochten Garbehälter 11 Minuten dämpfen, bis sie hart sind, dann in Eiswasser abschrecken und schälen.',
        settings: [vzug('steamer', 'Dämpfen', 100, { minutes: 11, note: 'gelochter Garbehälter' })],
      },
      { text: 'Längs halbieren, die Eigelbe herauslösen. Den Thunfisch gut abtropfen lassen.' },
      { text: 'Thunfisch, zwei Drittel der Eigelbe und die Mayonnaise mit der Gabel zu einer glatten Creme zerdrücken und mit Salz abschmecken. Mit einem Teelöffel oder Spritzbeutel in die Eiweißhälften füllen.' },
      { text: 'Die Piquillo-Paprika in feine Streifen schneiden und auf die Eier legen, das restliche Eigelb fein darüberreiben. Bis zum Servieren kalt stellen – ein Klassiker jeder spanischen Bar-Vitrine.' },
    ],
    'pimientos-de-padron': [
      { text: 'Die Pimientos de Padrón (Sommer bis Herbst im Gemüseregal) waschen und sehr gründlich trocken tupfen – nasse Paprika spritzen im heißen Öl. Die Stiele dranlassen, an ihnen isst man sie.' },
      {
        text: 'Die Plancha (oder schwere Gusseisenpfanne) auf dem BORA 4 Minuten trocken vorheizen.',
        settings: [plancha('bora', 'Vorheizen', { level: '8', minutes: 4 })],
      },
      {
        text: 'Das Olivenöl auf die Plancha geben, die Paprika darauf 4 Minuten braten und dabei oft wenden, bis die Haut Blasen wirft und stellenweise braun wird, das Fruchtfleisch aber noch Biss hat.',
        settings: [plancha('bora', 'Braten', { level: '8', minutes: 4 })],
      },
      { text: 'Auf einen Teller geben und kräftig mit grobem Salz („sal gorda“ oder Meersalzflocken) bestreuen. Sofort servieren – „unos pican y otros no“: etwa jede zehnte ist scharf.' },
    ],
    'champinones-al-ajillo': [
      { text: 'Die Champignons mit einem Pinsel oder Küchenpapier säubern (nicht waschen, sonst saugen sie Wasser) und halbieren, große vierteln. Den Knoblauch in dünne Scheiben schneiden, die getrocknete Chili („Guindilla“) zerbröseln, die Petersilie hacken.' },
      {
        text: 'Die Pfanne auf dem BORA vorheizen, das Olivenöl hineingeben, die Champignons darin 5 Minuten scharf anbraten – erst wenden, wenn sie unten goldbraun sind. Salzen.',
        settings: [bora('8', { minutes: 5 })],
      },
      {
        text: 'Auf Stufe 4 zurückschalten, Knoblauch und Chili dazugeben und 1 Minute mitbraten, bis der Knoblauch duftet, aber nicht braun ist. Mit dem Sherry ablöschen und 2 Minuten einkochen lassen, bis eine kleine sämige Sauce entsteht.',
        settings: [bora('4', { minutes: 3 })],
      },
      { text: 'Mit Petersilie bestreuen und brutzelnd in einer vorgewärmten Tonschale („Cazuela“) servieren.' },
    ],
    'berenjenas-con-miel': [
      { text: 'Die Aubergine längs in 1 cm dicke Scheiben und diese in 1 cm breite Sticks schneiden. 30 Minuten in kaltes Salzwasser (oder Milch, wie in Córdoba) legen – das nimmt Bitterstoffe und die Aubergine saugt später weniger Öl.' },
      { text: 'Abgießen, sehr gut trocken tupfen und im Weizenmehl mit einer Prise Salz wenden, überschüssiges Mehl abklopfen.' },
      {
        text: 'Die Sticks nebeneinander in den vorgeheizten Airfryer legen, mit dem Olivenöl beträufeln oder einsprühen und bei 200 °C 12 Minuten goldbraun backen, nach der Hälfte der Zeit wenden. Sie werden nicht ganz so knusprig wie frittiert, aber außen kross und innen cremig.',
        settings: [airfryer(200, 12, 'vorheizen, nach der Hälfte wenden')],
      },
      { text: 'Auf einem Teller anrichten und mit dem Sirup beträufeln. Original ist „Miel de caña“ (Zuckerrohrsirup aus Frigiliana bei Málaga, im spanischen Feinkost-Versand); Zuckerrübensirup schmeckt sehr ähnlich, Zuckerrohr-Melasse aus dem Reformhaus ist herber. Mit Meersalzflocken sofort servieren.' },
    ],
    'espinacas-con-garbanzos': [
      { text: 'Den Spinat waschen und abtropfen lassen, große Stiele entfernen. Die Kichererbsen abgießen und abspülen. Den Knoblauch in Scheiben schneiden, das Weißbrot ohne Rinde würfeln.' },
      {
        text: 'Das Olivenöl in einer Pfanne auf dem BORA erhitzen, Brot und Knoblauch darin 3 Minuten goldbraun rösten. In einen Mörser geben, Kreuzkümmel, Paprikapulver und Sherryessig dazu und mit 3 EL Wasser zu einer dicken Paste zerstoßen – dem „Majado“, das die Sauce bindet (geht auch mit dem Stabmixer).',
        settings: [bora('5', { minutes: 3 })],
      },
      {
        text: 'Den Spinat in die heiße Pfanne geben und 3 Minuten zusammenfallen lassen.',
        settings: [bora('7', { minutes: 3 })],
      },
      {
        text: 'Kichererbsen, Majado und 100 ml Wasser unterrühren und 5 Minuten köcheln lassen, bis alles sämig ist. Mit Salz und Pfeffer abschmecken und in einer Tonschale servieren – in Sevilla eine typische Fasten-Tapa der Karwoche.',
        settings: [bora('3', { minutes: 5 })],
      },
    ],
    'pan-con-tomate': [
      { text: 'Das Ciabatta (oder ein anderes rustikales Weißbrot, in Katalonien „pan de payés“) in 4 Scheiben von 1,5 cm schneiden. Eine sehr reife Tomate quer halbieren, den Knoblauch schälen und halbieren.' },
      {
        text: 'Die Plancha (oder Gusseisenpfanne) auf dem BORA 4 Minuten trocken vorheizen.',
        settings: [plancha('bora', 'Vorheizen', { level: '7', minutes: 4 })],
      },
      {
        text: 'Die Brotscheiben ohne Fett auf der Plancha 2 Minuten je Seite rösten, bis sie knusprig sind und dunkle Röststreifen haben.',
        settings: [plancha('bora', 'Braten', { level: '7', minutes: 4 })],
      },
      { text: 'Die warmen Scheiben ganz leicht mit der Schnittfläche des Knoblauchs einreiben, dann kräftig mit der Tomatenhälfte, bis nur noch die Haut in der Hand bleibt. Mit dem Olivenöl beträufeln, leicht salzen und sofort servieren. Variante aus Andalusien („tostada con tomate“): die Tomate reiben und das Mus auf das Brot streichen.' },
    ],
    'queso-manchego-con-membrillo': plain(MANCHEGO_STEPS),
    'aceitunas-alinadas': plain(ACEITUNAS_STEPS),
  },
  imageQueries: {
    'tortilla-de-patatas': 'tortilla de patatas',
    'patatas-bravas': 'patatas bravas',
    'patatas-alioli': 'patatas alioli',
    'papas-arrugadas': 'papas arrugadas mojo',
    'huevos-rellenos': 'huevos rellenos',
    'pimientos-de-padron': 'pimientos de padron',
    'champinones-al-ajillo': 'champiñones al ajillo',
    'berenjenas-con-miel': 'berenjenas con miel',
    'espinacas-con-garbanzos': 'espinacas con garbanzos',
    'pan-con-tomate': 'pa amb tomaquet',
    'queso-manchego-con-membrillo': 'queso manchego membrillo',
    'aceitunas-alinadas': 'aceitunas aliñadas',
  },
}
