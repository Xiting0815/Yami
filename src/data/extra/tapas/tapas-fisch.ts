import { prod, tapa } from '../../define'
import { bora, plancha, vzug } from '../../device-helpers'
import type { ExtraGroup } from '../types'

/**
 * Tapas · Fisch & Meeresfrüchte (Gambas al ajillo, Gambas a la plancha, Pulpo a la gallega, Boquerones en vinagre,
 * Calamares a la romana, Mejillones a la marinera, Pescaíto frito …).
 * Anlegen mit `tapa(id, 'Spanischer Titel (deutsche Erklärung)', { group: 'fisch', time, serve, ahead? }, zutaten, schritte)`.
 * Mengen: EIN Teller für 2 Personen als eine von ca. 5 Tapas (TAPAS_STD), ca. 120–200 kcal je Person (Yami skaliert
 * je nach Anzahl der Tapas des Abends). Regeln: docs/spanien-regeln.md · Geräte: docs/geraete/paella-plancha.md
 * (Plancha: `plancha('bora' | 'gasgrill', 'Vorheizen' | 'Braten', { level, temp?, minutes })`).
 * Neue Fotos: Zeilen in scripts/fotos-neu-tapas-fisch.md.
 */
export const tapasFisch: ExtraGroup = {
  recipes: [
    tapa('gambas-al-ajillo', 'Gambas al ajillo (Knoblauchgarnelen in Olivenöl)',
      { group: 'fisch', time: 15, serve: 'heiss', ahead: 'Garnelen am Vortag im Kühlschrank auftauen lassen' },
      '180 g Garnelen roh TK | 4 Zehe Knoblauch | 1 Stk Chili getrocknet | 2 EL Olivenöl | 0.25 Bund Petersilie | Salz',
      [
        'Die Garnelen am Vortag im Kühlschrank auftauen lassen, trocken tupfen, Darm entfernen und leicht salzen. Den Knoblauch in dünne Scheiben schneiden, die getrocknete Chili (in Spanien „Guindilla“) in 2 bis 3 Stücke brechen, die Petersilie fein hacken.',
        'Das Olivenöl mit Knoblauch und Chili in einer kleinen feuerfesten Tonschale („Cazuela de barro“) oder einem kleinen Pfännchen bei kleiner Hitze 3 Minuten langsam erwärmen, bis der Knoblauch hellgolden ist – er darf nicht braun werden, sonst wird er bitter.',
        'Die Hitze erhöhen, die Garnelen hineingeben und 2 Minuten garen, dabei einmal wenden, bis sie gerade rosa sind; in der heißen Schale ziehen sie noch nach.',
        'Mit Petersilie bestreuen und sofort brutzelnd servieren, dazu Brot zum Tunken ins Knoblauchöl. Gambas al ajillo kommen beim Tapas-Abend als Letztes auf den Tisch.',
      ]),

    tapa('gambas-a-la-plancha', 'Gambas a la plancha (Riesengarnelen von der heißen Platte mit grobem Salz)',
      { group: 'fisch', time: 15, serve: 'heiss', ahead: 'Garnelen am Vortag im Kühlschrank auftauen lassen' },
      '10 Stk Riesengarnelen mit Kopf TK | 1 TL Olivenöl | 0.5 Stk Zitrone | Salz',
      [
        'Die Riesengarnelen am Vortag im Kühlschrank auftauen lassen. Kopf und Schale bleiben dran – darin steckt der Geschmack, und die Schale schützt das Fleisch vor dem Austrocknen. Gründlich trocken tupfen.',
        'Eine Plancha (Gusseisen-Grillplatte) oder schwere Gusseisenpfanne ohne Fett sehr heiß werden lassen, bis ein Wassertropfen sofort zischend verdampft.',
        'Die Platte hauchdünn mit dem Olivenöl einpinseln, die Garnelen nebeneinander auflegen und kräftig mit grobem Meersalz („sal gorda“) bestreuen. 2 Minuten je Seite braten, bis die Schale rot und an den Rändern leicht gebräunt ist und das Fleisch gerade nicht mehr glasig ist (Garprobe: am Schwanzende aufbrechen).',
        'Sofort mit Zitronenspalten servieren und mit den Fingern essen. In Spanien saugt man den Saft aus den Köpfen – das ist das Beste.',
      ]),

    tapa('pulpo-a-la-gallega', 'Pulpo a la gallega (Krake nach galicischer Art mit Kartoffeln und Pimentón)',
      { group: 'fisch', time: 30, serve: 'lauwarm', ahead: 'Pulpo fertig gekocht kaufen – oder am Vortag TK-Pulpo selbst im CombiSteamer garen' },
      '150 g Pulpo gekocht | 120 g Kartoffeln festkochend | 1 EL Olivenöl | 0.5 TL Paprikapulver geräuchert | 1 Prise Paprikapulver rosenscharf | Salz',
      [
        'Den gekochten Pulpo (Kühlregal oder Fischtheke, z. B. bei Kaufland, Rewe, Edeka oder Lidl) aus der Packung nehmen. Wer ihn selbst garen will: am Vortag einen aufgetauten TK-Pulpo (ca. 1 kg – das Einfrieren macht ihn zart) 50–60 Minuten dämpfen bzw. in Salzwasser simmern, bis ein Holzspieß an der dicksten Stelle eines Arms ohne Widerstand hineingleitet; übrige Arme portionsweise einfrieren.',
        'Die Kartoffeln schälen und in 1 cm dicke Scheiben schneiden – in Galicien heißen sie „cachelos“. Leicht gesalzen 15 Minuten weich garen.',
        'Den Pulpo die letzten 5 Minuten zu den Kartoffeln geben, damit er gleichmäßig warm wird.',
        'Die Kartoffelscheiben auf einem Holzbrett oder flachen Teller auslegen. Die Pulpo-Arme mit der Küchenschere in 1 cm dicke Scheiben schneiden und darauf verteilen.',
        'Mit grobem Meersalz, dem geräucherten Paprikapulver (Pimentón de la Vera) und einer Prise rosenscharfem Paprikapulver bestreuen und mit dem Olivenöl beträufeln. Lauwarm servieren – so heißt das Gericht in Galicien auch „Pulpo á feira“ (Jahrmarkts-Pulpo).',
      ]),

    tapa('calamares-a-la-romana', 'Calamares a la romana (frittierte Tintenfischringe in Mehl und Ei)',
      {
        group: 'fisch', time: 25, serve: 'heiss', ahead: 'Tintenfischringe am Vortag im Kühlschrank auftauen lassen',
      },
      '120 g Tintenfischringe TK | 20 g Weizenmehl | 0.5 Stk Ei | 300 ml Frittieröl | 0.5 Stk Zitrone | Salz',
      [
        'Die Tintenfischringe am Vortag im Kühlschrank auftauen lassen, sehr gründlich mit Küchenpapier trocken tupfen (nasse Ringe spritzen im Fett) und leicht salzen.',
        'Die Ringe im Weizenmehl wenden, überschüssiges Mehl in einem Sieb abschütteln und dann durch das verquirlte Ei ziehen – genau das ist „a la romana“: Mehl und Ei, kein Bierteig.',
        'Das Frittieröl in einem kleinen, hohen Topf (ca. 16 cm, mindestens 1,5 cm hoch Öl) auf 180 °C erhitzen; ohne Thermometer: am Stiel eines hineingehaltenen Holzlöffels steigen sofort viele Bläschen auf. In Andalusien nimmt man mildes Olivenöl.',
        'Die Ringe portionsweise (2 Runden) je 2 Minuten goldgelb ausbacken, dabei einmal wenden, und auf Küchenpapier abtropfen lassen. Nicht zu viele auf einmal, sonst kühlt das Öl ab und sie werden fettig.',
        'Sofort mit Zitronenspalten und etwas Salz servieren. Tintenfisch nicht länger garen – nach 2 bis 3 Minuten wird er zäh wie Gummi.',
      ]),

    tapa('boquerones-en-vinagre', 'Boquerones en vinagre (in Essig marinierte frische Sardellen)',
      { group: 'fisch', time: 35, serve: 'kalt', ahead: 'Sardellen mindestens 5 Tage vorher filetieren und einfrieren (Anisakis), am Vortag auftauen und 6 Stunden in Essig marinieren' },
      '150 g Sardellen frisch | 100 ml Weißweinessig | 2 EL Olivenöl | 1 Zehe Knoblauch | 0.25 Bund Petersilie | Salz',
      [
        'Frische Sardellen gibt es an guten Fischtheken (meist auf Bestellung), im Großmarkt oder bei spanischen/portugiesischen Händlern; sie müssen glänzen und klare Augen haben. Den Kopf abziehen, mit dem Daumen den Bauch öffnen, die Innereien herausstreifen, die Gräte vom Kopfende her herausziehen und die beiden Filets am Schwanz trennen. Die Filets 10 Minuten in Eiswasser legen, damit sich das Blut löst und sie schön weiß werden, dann trocken tupfen.',
        'Wichtig: Die Filets mindestens 5 Tage im Gefrierschrank (−18 °C) einfrieren und am Vortag im Kühlschrank auftauen. So empfiehlt es die spanische Lebensmittelbehörde AESAN gegen Anisakis (Fadenwurm-Larven, die in rohem Fisch vorkommen) – Essig tötet sie nicht ab, Einfrieren schon.',
        'Den Weißweinessig mit 50 ml Wasser und 1 TL Salz verrühren. Die Filets mit der Hautseite nach unten in eine flache Form legen, mit der Essigmischung bedecken und abgedeckt 6 Stunden im Kühlschrank ziehen lassen, bis das Fleisch durch und durch weiß ist.',
        'Den Essig abgießen. Den Knoblauch sehr fein hacken, die Petersilie hacken.',
        'Die Filets fächerartig auf einen Teller legen, Knoblauch und Petersilie darüberstreuen und mit dem Olivenöl beträufeln. Kalt servieren; im Öl halten sie sich abgedeckt 3 Tage im Kühlschrank.',
      ]),

    tapa('mejillones-a-la-vinagreta', 'Mejillones a la vinagreta (kalte Miesmuscheln mit Paprika-Zwiebel-Vinaigrette)',
      { group: 'fisch', time: 30, serve: 'kalt', ahead: 'Muscheln und Vinagreta bis zu einem Tag vorher zubereiten und abgedeckt kalt stellen' },
      '500 g Miesmuscheln | 1 Blatt Lorbeerblatt | 0.25 Stk Paprika rot | 0.25 Stk Paprika grün | 0.25 Stk Zwiebel | 1 EL Sherryessig | 1.5 EL Olivenöl | 0.25 Bund Petersilie | Salz',
      [
        'Die Miesmuscheln kalt abspülen und die Bärte (Fäden) abziehen. Geöffnete Muscheln kurz auf die Arbeitsfläche klopfen – wer sich nicht schließt, wird weggeworfen, ebenso Muscheln mit kaputter Schale.',
        'Die Muscheln mit dem Lorbeerblatt in einen Topf mit 3 EL Wasser geben, Deckel drauf, aufkochen und 5 Minuten dämpfen, dabei einmal schütteln, bis sich die Schalen geöffnet haben. Muscheln, die geschlossen bleiben, wegwerfen. Abkühlen lassen.',
        'Für die Vinagreta Paprika rot, Paprika grün und Zwiebel in sehr feine Würfel (ca. 3 mm) schneiden, die Petersilie hacken. Mit Sherryessig, Olivenöl und einer Prise Salz verrühren.',
        'Von jeder Muschel die leere Schalenhälfte abbrechen, das Muschelfleisch in der anderen Hälfte lösen und die Muscheln dicht nebeneinander auf eine Platte setzen.',
        'Je einen Löffel Vinagreta auf jede Muschel geben und mindestens 30 Minuten kalt stellen, damit alles durchzieht. Kalt servieren – ein Klassiker der galicischen Rías, wo die meisten europäischen Miesmuscheln herkommen.',
      ]),

    tapa('pescaito-frito', 'Pescaíto frito (knusprig ausgebackene kleine Sardellen nach Art von Málaga)',
      { group: 'fisch', time: 25, serve: 'heiss', ahead: 'Sardellen am Nachmittag ausnehmen und gut trocken im Kühlschrank aufbewahren' },
      '200 g Sardellen frisch | 15 g Weizenmehl | 10 g Hartweizengrieß | 1 EL Olivenöl | 0.5 Stk Zitrone | Salz',
      [
        'Die Sardellen ausnehmen: Kopf abziehen, den Bauch mit dem Daumen öffnen und die Innereien herausstreifen; die Gräte darf drin bleiben. Kurz kalt abspülen und sehr gründlich trocken tupfen, dann salzen. In Málaga drückt man 4 bis 5 Fischchen an den Schwänzen zu einem Fächer („abanico“) zusammen.',
        'Weizenmehl und Hartweizengrieß mischen – das ersetzt das spanische „harina de freír“, ein gröberes Mehl, das besonders knusprig wird. Die Fische darin wenden und in einem Sieb gut abschütteln, es soll nur ein hauchdünner Film bleiben.',
        'Die Fische nebeneinander in den vorgeheizten Airfryer-Korb legen, mit dem Olivenöl beträufeln und bei 200 °C 8 Minuten knusprig goldbraun backen, nach der Hälfte wenden. Klassisch werden sie portionsweise in reichlich heißem Olivenöl schwimmend ausgebacken.',
        'Sofort mit Zitronenspalten servieren. Durchgegarter Fisch ist unbedenklich – Anisakis-Larven sterben beim Braten und Frittieren ab, Einfrieren ist hier nicht nötig.',
      ]),
  ],
  catalog: {
    fleisch: ['Sardellen frisch'],
  },
  products: {
    // Fischtheke (meist auf Bestellung), Großmarkt oder spanisch-portugiesische Händler; nach Gewicht
    'Sardellen frisch': prod(250, 'g', 3.49, 1, 1, 'Schale'),
  },
  nutrition: {
    // ganze Fische (ausgenommen ca. 65 % essbar): Sardelle roh je 100 g Filet ca. 131 kcal, 20 g Eiweiß, 4,8 g Fett
    'Sardellen frisch': [85, 13, 3, 0, 0],
  },
  grams: {
    'Sardellen frisch': { Stk: 20 },
  },
  deviceSteps: {
    'gambas-al-ajillo': [
      { text: 'Die Garnelen am Vortag im Kühlschrank auftauen lassen, trocken tupfen, Darm entfernen und leicht salzen. Den Knoblauch in dünne Scheiben schneiden, die getrocknete Chili (in Spanien „Guindilla“) in 2 bis 3 Stücke brechen, die Petersilie fein hacken.' },
      {
        text: 'Das Olivenöl mit Knoblauch und Chili in einem kleinen Pfännchen auf dem BORA 3 Minuten langsam erwärmen, bis der Knoblauch hellgolden ist – er darf nicht braun werden, sonst wird er bitter. (Die klassische Tonschale funktioniert auf dem Induktionsfeld nicht; zum Servieren vorgewärmt bereitstellen.)',
        settings: [bora('3', { minutes: 3, note: 'kleines Pfännchen' })],
      },
      {
        text: 'Auf Stufe 7 erhöhen, die Garnelen hineingeben und 2 Minuten garen, dabei einmal wenden, bis sie gerade rosa sind; im heißen Öl ziehen sie noch nach.',
        settings: [bora('7', { minutes: 2 })],
      },
      { text: 'Mit Petersilie bestreuen und sofort brutzelnd in der vorgewärmten Schale servieren, dazu Brot zum Tunken ins Knoblauchöl. Gambas al ajillo kommen beim Tapas-Abend als Letztes auf den Tisch.' },
    ],
    'gambas-a-la-plancha': [
      { text: 'Die Riesengarnelen am Vortag im Kühlschrank auftauen lassen. Kopf und Schale bleiben dran – darin steckt der Geschmack, und die Schale schützt das Fleisch vor dem Austrocknen. Gründlich trocken tupfen.' },
      {
        text: 'Die Plancha (Gusseisenplatte oder schwere Gusseisenpfanne) ohne Fett auf dem BORA 5 Minuten vorheizen, bis die Oberfläche etwa 250 °C hat (Infrarot-Thermometer) und ein Wassertropfen sofort zischend verdampft.',
        settings: [plancha('bora', 'Vorheizen', { level: '8', temp: 250, minutes: 5 }), plancha('gasgrill', 'Vorheizen', { level: 'hoch', temp: 250, minutes: 10, note: 'Plancha auf dem Rost, Deckel zu', alt: true })],
      },
      {
        text: 'Die Platte hauchdünn mit dem Olivenöl einpinseln, die Garnelen nebeneinander auflegen und kräftig mit grobem Meersalz („sal gorda“) bestreuen. 2 Minuten je Seite braten, bis die Schale rot und an den Rändern leicht gebräunt ist und das Fleisch gerade nicht mehr glasig ist (Garprobe: am Schwanzende aufbrechen). Den BORA-Abzug eine Stufe höher stellen.',
        settings: [plancha('bora', 'Braten', { level: '8', minutes: 4, note: '2 Min. je Seite' }), plancha('gasgrill', 'Braten', { level: 'hoch', minutes: 4, note: 'Deckel offen', alt: true })],
      },
      { text: 'Sofort mit Zitronenspalten servieren und mit den Fingern essen. In Spanien saugt man den Saft aus den Köpfen – das ist das Beste.' },
    ],
    'pulpo-a-la-gallega': [
      { text: 'Den gekochten Pulpo (Kühlregal oder Fischtheke, z. B. bei Kaufland, Rewe, Edeka oder Lidl) aus der Packung nehmen. Wer ihn selbst garen will: am Vortag einen aufgetauten TK-Pulpo (ca. 1 kg – das Einfrieren macht ihn zart) im CombiSteamer bei 100 °C Dämpfen 50–60 Minuten garen, bis ein Holzspieß an der dicksten Stelle eines Arms ohne Widerstand hineingleitet; übrige Arme portionsweise einfrieren.' },
      {
        text: 'Den Wasserbehälter des CombiSteamers füllen. Die Kartoffeln schälen und in 1 cm dicke Scheiben schneiden – in Galicien heißen sie „cachelos“. Leicht salzen, im gelochten Garbehälter einschieben und bei 100 °C 15 Minuten dämpfen.',
        settings: [vzug('steamer', 'Dämpfen', 100, { minutes: 15, note: 'gelochter Garbehälter, Ebene 2' })],
      },
      {
        text: 'Den Pulpo die letzten 5 Minuten zu den Kartoffeln in den CombiSteamer legen, damit er gleichmäßig warm wird.',
        settings: [vzug('steamer', 'Dämpfen', 100, { minutes: 5, note: 'Pulpo dazulegen' })],
      },
      { text: 'Die Kartoffelscheiben auf einem Holzbrett oder flachen Teller auslegen. Die Pulpo-Arme mit der Küchenschere in 1 cm dicke Scheiben schneiden und darauf verteilen.' },
      { text: 'Mit grobem Meersalz, dem geräucherten Paprikapulver (Pimentón de la Vera) und einer Prise rosenscharfem Paprikapulver bestreuen und mit dem Olivenöl beträufeln. Lauwarm servieren – so heißt das Gericht in Galicien auch „Pulpo á feira“ (Jahrmarkts-Pulpo).' },
    ],
    'calamares-a-la-romana': [
      { text: 'Die Tintenfischringe am Vortag im Kühlschrank auftauen lassen, sehr gründlich mit Küchenpapier trocken tupfen (nasse Ringe spritzen im Fett) und leicht salzen.' },
      { text: 'Die Ringe im Weizenmehl wenden, überschüssiges Mehl in einem Sieb abschütteln und dann durch das verquirlte Ei ziehen – genau das ist „a la romana“: Mehl und Ei, kein Bierteig.' },
      {
        text: 'Das Frittieröl in einem kleinen, hohen Topf (ca. 16 cm, mindestens 1,5 cm hoch Öl) auf dem BORA auf 180 °C erhitzen; ohne Thermometer: am Stiel eines hineingehaltenen Holzlöffels steigen sofort viele Bläschen auf. In Andalusien nimmt man mildes Olivenöl.',
        settings: [bora('7', { minutes: 5, note: 'Öl auf 180 °C' })],
      },
      {
        text: 'Die Ringe portionsweise (2 Runden) je 2 Minuten goldgelb ausbacken, dabei einmal wenden, und auf Küchenpapier abtropfen lassen. Nicht zu viele auf einmal, sonst kühlt das Öl ab und sie werden fettig. Den BORA-Abzug eine Stufe höher stellen. Alternative im Airfryer: Ringe in Mehl, Ei und Panko wenden, mit wenig Öl einsprühen und 8 Minuten backen.',
        settings: [bora('7', { minutes: 4, note: '2 Runden à 2 Min.' }), { device: 'airfryer', mode: 'Heissluft', temp: 180, minutes: 8, note: 'nur paniert (Mehl–Ei–Panko), vorheizen, nach 4 Min. wenden', alt: true }],
      },
      { text: 'Sofort mit Zitronenspalten und etwas Salz servieren. Tintenfisch nicht länger garen – nach 2 bis 3 Minuten wird er zäh wie Gummi.' },
    ],
    'mejillones-a-la-vinagreta': [
      { text: 'Die Miesmuscheln kalt abspülen und die Bärte (Fäden) abziehen. Geöffnete Muscheln kurz auf die Arbeitsfläche klopfen – wer sich nicht schließt, wird weggeworfen, ebenso Muscheln mit kaputter Schale.' },
      {
        text: 'Den Wasserbehälter des CombiSteamers füllen. Die Muscheln mit dem Lorbeerblatt in den gelochten Garbehälter geben und bei 100 °C 6 Minuten dämpfen, bis sich die Schalen geöffnet haben. Muscheln, die geschlossen bleiben, wegwerfen. Abkühlen lassen.',
        settings: [vzug('steamer', 'Dämpfen', 100, { minutes: 6, note: 'gelochter Garbehälter, Ebene 2' })],
      },
      { text: 'Für die Vinagreta Paprika rot, Paprika grün und Zwiebel in sehr feine Würfel (ca. 3 mm) schneiden, die Petersilie hacken. Mit Sherryessig, Olivenöl und einer Prise Salz verrühren.' },
      { text: 'Von jeder Muschel die leere Schalenhälfte abbrechen, das Muschelfleisch in der anderen Hälfte lösen und die Muscheln dicht nebeneinander auf eine Platte setzen.' },
      { text: 'Je einen Löffel Vinagreta auf jede Muschel geben und mindestens 30 Minuten kalt stellen, damit alles durchzieht. Kalt servieren – ein Klassiker der galicischen Rías, wo die meisten europäischen Miesmuscheln herkommen.' },
    ],
    'pescaito-frito': [
      { text: 'Die Sardellen ausnehmen: Kopf abziehen, den Bauch mit dem Daumen öffnen und die Innereien herausstreifen; die Gräte darf drin bleiben. Kurz kalt abspülen und sehr gründlich trocken tupfen, dann salzen. In Málaga drückt man 4 bis 5 Fischchen an den Schwänzen zu einem Fächer („abanico“) zusammen.' },
      { text: 'Weizenmehl und Hartweizengrieß mischen – das ersetzt das spanische „harina de freír“, ein gröberes Mehl, das besonders knusprig wird. Die Fische darin wenden und in einem Sieb gut abschütteln, es soll nur ein hauchdünner Film bleiben.' },
      {
        text: 'Den Airfryer auf 200 °C vorheizen.',
        settings: [{ device: 'airfryer', mode: 'Heissluft', temp: 200, minutes: 3, note: 'vorheizen' }],
      },
      {
        text: 'Die Fische nebeneinander in den Korb legen, mit dem Olivenöl beträufeln oder einsprühen und 8 Minuten knusprig goldbraun backen, nach der Hälfte vorsichtig wenden. Klassisch werden sie portionsweise in reichlich heißem Olivenöl schwimmend ausgebacken.',
        settings: [{ device: 'airfryer', mode: 'Heissluft', temp: 200, minutes: 8, note: 'nebeneinander, nach der Hälfte wenden' }],
      },
      { text: 'Sofort mit Zitronenspalten servieren. Durchgegarter Fisch ist unbedenklich – Anisakis-Larven sterben beim Braten und Frittieren ab, Einfrieren ist hier nicht nötig.' },
    ],
  },
  imageQueries: {
    'gambas-al-ajillo': 'gambas al ajillo',
    'gambas-a-la-plancha': 'gambas a la plancha',
    'pulpo-a-la-gallega': 'pulpo a la gallega',
    'calamares-a-la-romana': 'calamares a la romana',
    'boquerones-en-vinagre': 'boquerones en vinagre',
    'mejillones-a-la-vinagreta': 'mejillones a la vinagreta',
    'pescaito-frito': 'pescaito frito boquerones fritos',
  },
}
