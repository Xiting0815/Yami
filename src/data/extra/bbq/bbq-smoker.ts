import { bbq, prod } from '../../define'
import { bora, gasgrill, traeger, vakuum, vzug } from '../../device-helpers'
import type { DeviceStep } from '../../../types'
import type { ExtraGroup } from '../types'

/**
 * BBQ · Smoker (Traeger Timberline 850): Low & Slow – Pulled Pork, Ribs, Brisket, Burnt Ends, Chicken …
 * Zutaten für die GANZE Ladung (`bbq()` aus define.ts). Große Stücke: Rest → `leftover` (vakuumiert eingefroren, g),
 * dazu ein kaufbares Gegenstück + Austausch-Gruppe + `preferred`, damit Resteessen (recipes-us.ts) zuerst den Vorrat nehmen.
 * `fatLoss`: Anteil des Fleischfetts, der beim Smoken abtropft/ausgelassen wird (senkt kcal/Fett je Portion und der Reste).
 * Regeln: docs/bbq-regeln.md, Gerät: docs/geraete/traeger.md, Bausteine: `traeger()`, `vakuum()`, `vzug()` (device-helpers.ts).
 *
 * Bei den neuen Rezepten sind die klassischen Schritte (`steps`) dieselben Texte wie die Geräte-Schritte (`D`),
 * denn ohne Traeger gibt es keinen anderen Weg – so bleiben beide immer gleich.
 */

/** Geräte-Schritte je Rezept-ID (Texte = Schritte des Rezepts) */
const D: Record<string, DeviceStep[]> = {
  // ───── St. Louis Spareribs 3-2-1 ─────
  'spareribs-321': [
    {
      text: 'Die Spareribs (St. Louis Cut: ohne Knorpelplatte und Brustspitze – beim Metzger so bestellen) trocken tupfen. Auf der Knochenseite die Silberhaut mit einem Löffelstiel anheben, mit Küchenpapier greifen und ganz abziehen. Die Rippchen dünn mit Senf mittelscharf einstreichen (hält den Rub, schmeckt man später nicht) und rundum mit dem BBQ-Rub würzen. 30 Minuten ziehen lassen.',
    },
    {
      text: 'Den Traeger mit Kirsch- oder Hickory-Pellets füllen, einschalten und bei geschlossenem Deckel auf 107 °C (225 °F) vorheizen, etwa 15 Minuten.',
      settings: [traeger('Vorheizen', 225, { minutes: 15, note: 'Pellets Kirsche oder Hickory, Deckel zu' })],
    },
    {
      text: 'Phase „3“ – Rauch: Die Racks mit der Knochenseite nach unten auf den mittleren Rost legen und im Super Smoke bei 107 °C (225 °F) 3 Stunden räuchern. Ab der zweiten Stunde etwa alle 45 Minuten mit 100 ml Apfelsaft aus einer Sprühflasche benetzen, damit die Oberfläche nicht austrocknet.',
      settings: [traeger('Super Smoke', 225, { minutes: 180 })],
    },
    {
      text: 'Phase „2“ – gewickelt (Texas Crutch): Je Rack zwei Lagen Alufolie auslegen und jeweils die Hälfte von Butter (in Flocken), braunem Zucker und Honig darauf verteilen. Das Rack mit der Fleischseite nach unten darauflegen, je 50 ml Apfelsaft dazugießen und die Folie dicht verschließen. Zurück in den Traeger und bei 121 °C (250 °F) 2 Stunden garen – im eigenen Dampf wird das Fleisch zart.',
      settings: [traeger('Smoken', 250, { minutes: 120 })],
    },
    {
      text: 'Phase „1“ – glasieren: Die Folie vorsichtig öffnen (heißer Dampf), die Racks mit der Knochenseite nach unten zurück auf den Rost legen und dünn mit BBQ-Sauce bestreichen. Bei 121 °C (250 °F) noch 1 Stunde garen, nach 30 Minuten ein zweites Mal bestreichen, bis die Sauce klebrig glänzt.',
      settings: [traeger('Smoken', 250, { minutes: 60 })],
    },
    {
      text: 'Garprobe mit dem Bend-Test: Ein Rack in der Mitte mit der Grillzange anheben. Biegt es sich deutlich durch und reißt die Oberfläche dabei ein, sind die Rippchen fertig (zwischen den Knochen dann etwa 93 °C). Bleibt es steif, 15 Minuten weitergaren und erneut testen.',
    },
    {
      text: 'Die Racks 10 Minuten ruhen lassen und zwischen den Knochen in Stücke schneiden. Restliche Sauce dazu reichen; dazu passen Coleslaw, Cornbread oder Pit Beans.',
    },
    {
      text: 'Übrige Rippchen innerhalb von 2 Stunden abkühlen lassen, in Stücke à etwa 250 g (2–3 Knochen) mit einem Löffel Sauce in Beutel füllen, im Vakuumierer mit Feucht-Modus vakuumieren und sofort einfrieren (hält ca. 3 Monate). Später aufgetaut im CombiSteamer mit Vacuisine bei 65 °C 40 Minuten erwärmen.',
      settings: [vakuum('Vakuumieren feucht', '4 Beutel à 250 g'), vzug('steamer', 'Vacuisine', 65, { minutes: 40, note: 'später: Beutel aufwärmen' })],
    },
  ],

  // ───── Baby Back Ribs 2-2-1 ─────
  'baby-back-ribs': [
    {
      text: 'Die Baby Back Ribs (Kotelettrippen vom Rücken: kürzer, magerer und schneller gar als Spareribs – beim Metzger bestellen) trocken tupfen und die Silberhaut auf der Knochenseite mit einem Löffelstiel anheben und abziehen. Dünn mit Senf mittelscharf einstreichen und rundum mit dem BBQ-Rub würzen. 30 Minuten ziehen lassen.',
    },
    {
      text: 'Den Traeger mit Apfel- oder Kirsch-Pellets füllen und bei geschlossenem Deckel auf 107 °C (225 °F) vorheizen, etwa 15 Minuten.',
      settings: [traeger('Vorheizen', 225, { minutes: 15, note: 'Pellets Apfel oder Kirsche, Deckel zu' })],
    },
    {
      text: 'Phase „2“ – Rauch: Die Racks mit der Knochenseite nach unten auf den mittleren Rost legen und im Super Smoke bei 107 °C (225 °F) 2 Stunden räuchern. Nach der ersten Stunde alle 30 Minuten mit 100 ml Apfelsaft aus der Sprühflasche benetzen.',
      settings: [traeger('Super Smoke', 225, { minutes: 120 })],
    },
    {
      text: 'Phase „2“ – gewickelt: Jedes Rack auf eine doppelte Lage Alufolie legen (Fleischseite nach unten), je die Hälfte von Honig und Butter darauf verteilen, je 25 ml Apfelsaft dazugießen und dicht einwickeln (Texas Crutch). Bei 121 °C (250 °F) 2 Stunden weitergaren.',
      settings: [traeger('Smoken', 250, { minutes: 120 })],
    },
    {
      text: 'Phase „1“ – glasieren: Die Folie öffnen, die Racks zurück auf den Rost legen und mit BBQ-Sauce bestreichen. Bei 121 °C (250 °F) noch 1 Stunde garen, bis die Sauce fest und glänzend ist. Wer es Memphis-Style „dry“ mag, streut statt Sauce noch etwas Rub darüber.',
      settings: [traeger('Smoken', 250, { minutes: 60 })],
    },
    {
      text: 'Bend-Test: Ein Rack mit der Zange in der Mitte anheben – biegt es sich durch und die Kruste reißt ein, ist es fertig. Baby Backs sollen am Knochen hängen bleiben, aber sauber abbeißen lassen („competition tender“), nicht vom Knochen fallen.',
    },
    {
      text: 'Die Racks 10 Minuten ruhen lassen, zwischen den Knochen aufschneiden und mit der restlichen Sauce servieren.',
    },
    {
      text: 'Übrige Rippchen innerhalb von 2 Stunden abkühlen lassen, in Stücke à etwa 250 g mit etwas Sauce in Beutel füllen, im Vakuumierer mit Feucht-Modus vakuumieren und einfrieren (hält ca. 3 Monate). Später aufgetaut im CombiSteamer mit Vacuisine bei 65 °C 40 Minuten erwärmen.',
      settings: [vakuum('Vakuumieren feucht', '2 Beutel à 250 g'), vzug('steamer', 'Vacuisine', 65, { minutes: 40, note: 'später: Beutel aufwärmen' })],
    },
  ],

  // ───── Pork Belly Burnt Ends ─────
  'pork-belly-burnt-ends': [
    {
      text: 'Den Schweinebauch (ohne Schwarte, sonst vom Metzger entfernen lassen) in 3–4 cm große Würfel schneiden. Die Würfel dünn mit Senf mittelscharf einstreichen und rundum mit dem BBQ-Rub würzen.',
    },
    {
      text: 'Den Traeger mit Hickory- oder Kirsch-Pellets füllen und bei geschlossenem Deckel auf 121 °C (250 °F) vorheizen, etwa 15 Minuten.',
      settings: [traeger('Vorheizen', 250, { minutes: 15, note: 'Pellets Hickory oder Kirsche, Deckel zu' })],
    },
    {
      text: 'Die Würfel mit 2 cm Abstand auf ein Grillgitter oder direkt auf den mittleren Rost setzen und bei 121 °C (250 °F) etwa 3 Stunden räuchern, bis sich eine dunkle, feste Kruste (Bark) gebildet hat. Dabei tropft schon ein guter Teil des Fetts ab.',
      settings: [traeger('Smoken', 250, { minutes: 180 })],
    },
    {
      text: 'Die Würfel in eine Aluschale geben. Butter in Flocken, braunen Zucker, Honig und die BBQ-Sauce darüber verteilen und alles behutsam mischen. Die Schale mit Alufolie abdecken und bei 121 °C (250 °F) weitergaren, bis die Kerntemperatur 95 °C erreicht und die Würfel butterweich sind, etwa 1,5 Stunden.',
      settings: [traeger('Smoken', 250, { minutes: 90, core: 95 })],
    },
    {
      text: 'Die Folie abnehmen, die Würfel in der Sauce wenden und ohne Abdeckung bei 121 °C (250 °F) noch 15 Minuten garen, bis die Sauce eindickt und glänzend am Fleisch klebt.',
      settings: [traeger('Smoken', 250, { minutes: 15 })],
    },
    {
      text: 'Die Burnt Ends 10 Minuten abkühlen lassen (die Glasur ist sehr heiß) und mit Zahnstochern als Fingerfood oder mit Coleslaw und Brötchen servieren.',
    },
    {
      text: 'Den Rest abkühlen lassen, in Beutel à 250 g mit der Glasur füllen, im Vakuumierer mit Feucht-Modus vakuumieren und einfrieren (hält ca. 3 Monate). Später aufgetaut im CombiSteamer mit Vacuisine bei 70 °C 30 Minuten erwärmen.',
      settings: [vakuum('Vakuumieren feucht', '2 Beutel à 250 g'), vzug('steamer', 'Vacuisine', 70, { minutes: 30, note: 'später: Beutel aufwärmen' })],
    },
  ],

  // ───── Texas Brisket ─────
  'texas-brisket': [
    {
      text: 'Größe: Ein ganzes Brisket („Packer“ = ganze Rinderbrust mit flachem Flat und dickem Point/Brustkern) wiegt 4,5–6 kg; kleinere Stücke trocknen leicht aus. Beim Metzger 3–5 Tage vorher „ganze Rinderbrust am Stück, US-Zuschnitt, mit Fettdeckel“ bestellen.',
    },
    {
      text: 'Am Vorabend die kalte Rinderbrust trimmen: den Fettdeckel auf der Oberseite auf etwa 6 mm kürzen, harte Fettklumpen an der Unterseite und zwischen Flat und Point herausschneiden, dünne Zipfel und Kanten rund abschneiden (zu dünne Stellen verbrennen). Rund 0,7–1 kg Abschnitte fallen weg.',
    },
    {
      text: 'Salz, Pfeffer schwarz grob und Knoblauchpulver mischen (Texas-Rub: Salz und Pfeffer etwa 1:1) und das Brisket rundum gleichmäßig bestreuen. Unbedeckt über Nacht im Kühlschrank ruhen lassen – die trockene Oberfläche gibt später eine bessere Kruste.',
    },
    {
      text: 'Den Traeger mit Eichen- oder Hickory-Pellets (Mesquite höchstens beimischen, allein schmeckt es bitter) füllen und bei geschlossenem Deckel auf 107 °C (225 °F) vorheizen, etwa 15 Minuten.',
      settings: [traeger('Vorheizen', 225, { minutes: 15, note: 'Pellets Eiche oder Hickory, Deckel zu' })],
    },
    {
      text: 'Das Brisket mit der Fettseite nach unten (die Hitze kommt beim Traeger von unten, das Fett schützt) auf den mittleren Rost legen, der dicke Point zeigt zum Kamin. Den Fühler von der Seite in die dickste Stelle des Flat stecken und im Super Smoke bei 107 °C (225 °F) 3 Stunden räuchern.',
      settings: [traeger('Super Smoke', 225, { minutes: 180 })],
    },
    {
      text: 'Den Traeger auf 121 °C (250 °F) stellen. Den Apfelessig mit 100 ml Wasser in eine Sprühflasche füllen und das Brisket stündlich einsprühen, sobald die Oberfläche trocken wirkt. Weitergaren, bis die Kruste (Bark) fast schwarz und fest ist und sich beim Reiben nicht mehr löst. Die Kerntemperatur bleibt dabei stundenlang bei etwa 74 °C stehen – das ist der Stall: Feuchtigkeit verdunstet an der Oberfläche und kühlt das Fleisch, meist 3 bis 5 Stunden.',
      settings: [traeger('Smoken', 250, { minutes: 240, core: 74 })],
    },
    {
      text: 'Texas Crutch: Zwei Bahnen Butcherpapier (unbeschichtetes Metzgerpapier; ersatzweise doppelt Alufolie, dann wird die Kruste weicher) überlappend auslegen, das Brisket mit der Fettseite nach oben darauflegen und straff einwickeln. Mit dem Fühler zurück in den Traeger und bei 121 °C (250 °F) bis 95 °C Kerntemperatur garen, etwa 4 bis 6 Stunden.',
      settings: [traeger('Smoken', 250, { minutes: 300, core: 95 })],
    },
    {
      text: 'Probe tender: Fertig ist das Brisket, wenn der Fühler überall im Flat ohne Widerstand hineingleitet – wie in weiche Butter. Die Zahl ist nur ein Richtwert (meist 93–96 °C), das Gefühl entscheidet; an zähen Stellen noch 30 Minuten weitergaren.',
    },
    {
      text: 'Ruhezeit: Das Brisket eingewickelt in eine leere Kühlbox legen, mit Handtüchern abdecken und mindestens 2 Stunden, besser 3–4 Stunden ruhen lassen. Der Saft verteilt sich wieder, das Fleisch wird saftiger und lässt sich sauber schneiden.',
    },
    {
      text: 'Auspacken und den Saft im Papier auffangen. Flat und Point an der Fettschicht trennen. Den Flat quer zur Faser in bleistiftdicke Scheiben schneiden, den Point (Faser läuft anders) um 90 Grad drehen und etwas dicker schneiden. Texas-Style ohne Sauce servieren, dazu Pit Beans und Coleslaw.',
    },
    {
      text: 'Den Rest nicht aufschneiden: in Stücken à 250 g mit etwas aufgefangenem Saft in Beutel füllen, innerhalb von 2 Stunden abkühlen lassen, im Vakuumierer mit Feucht-Modus vakuumieren und einfrieren (hält ca. 3 Monate). Später aufgetaut im CombiSteamer mit Vacuisine bei 70 °C 45 Minuten erwärmen, dann aufschneiden.',
      settings: [vakuum('Vakuumieren feucht', '9 Beutel à 250 g'), vzug('steamer', 'Vacuisine', 70, { minutes: 45, note: 'später: Beutel aufwärmen' })],
    },
  ],

  // ───── Brisket Burnt Ends (Kansas City) ─────
  'brisket-burnt-ends': [
    {
      text: 'Burnt Ends sind die Kansas-City-Spezialität aus dem fetten Point (Brustkern) der Rinderbrust. Beim Metzger „Rinderbrust, dicker Teil (Brustkern) am Stück, ca. 2,5 kg“ bestellen. Den Fettdeckel auf etwa 6 mm trimmen und harte Fettklumpen herausschneiden.',
    },
    {
      text: 'BBQ-Rub und Pfeffer schwarz grob mischen und den Point rundum kräftig damit würzen. Mindestens 1 Stunde, gern über Nacht, im Kühlschrank ziehen lassen.',
    },
    {
      text: 'Den Traeger mit Hickory- oder Eichen-Pellets füllen und bei geschlossenem Deckel auf 121 °C (250 °F) vorheizen, etwa 15 Minuten.',
      settings: [traeger('Vorheizen', 250, { minutes: 15, note: 'Pellets Hickory oder Eiche, Deckel zu' })],
    },
    {
      text: 'Den Point mit der Fettseite nach unten auf den mittleren Rost legen, den Fühler in die dickste Stelle stecken und bei 121 °C (250 °F) räuchern, bis die Kruste dunkel ist und die Kerntemperatur im Stall bei etwa 74 °C stehen bleibt, meist 5 bis 6 Stunden.',
      settings: [traeger('Smoken', 250, { minutes: 330, core: 74 })],
    },
    {
      text: 'Den Point straff in Butcherpapier oder doppelt Alufolie wickeln (Texas Crutch) und bei 121 °C (250 °F) bis 93 °C Kerntemperatur weitergaren, etwa 2 bis 3 Stunden, bis der Fühler leicht hineingleitet.',
      settings: [traeger('Smoken', 250, { minutes: 150, core: 93 })],
    },
    {
      text: 'Den Point eingewickelt 30 Minuten ruhen lassen. Dann in 3 cm große Würfel schneiden und in eine Aluschale geben. Die BBQ-Sauce, Honig, braunen Zucker und Butter in Flocken darüber verteilen und alles gut mischen.',
    },
    {
      text: 'Den Traeger auf 135 °C (275 °F) stellen und die Schale offen hineinstellen. Etwa 1,5 bis 2 Stunden garen und alle 30 Minuten umrühren, bis die Sauce karamellisiert und an den Würfeln klebt – außen knusprig, innen zart.',
      settings: [traeger('Smoken', 275, { minutes: 105 })],
    },
    {
      text: 'Die Burnt Ends 10 Minuten abkühlen lassen und auf Weißbrot oder mit Pit Beans und Coleslaw servieren.',
    },
    {
      text: 'Den Rest abkühlen lassen, in Beutel à 250 g mit der Sauce füllen, im Vakuumierer mit Feucht-Modus vakuumieren und einfrieren (hält ca. 3 Monate). Später aufgetaut im CombiSteamer mit Vacuisine bei 70 °C 30 Minuten erwärmen.',
      settings: [vakuum('Vakuumieren feucht', '4 Beutel à 250 g'), vzug('steamer', 'Vacuisine', 70, { minutes: 30, note: 'später: Beutel aufwärmen' })],
    },
  ],

  // ───── Smoked Chicken Wings ─────
  'chicken-wings-smoker': [
    {
      text: 'Die Hähnchenflügel am Gelenk in Unterarm (Flat) und Oberarm (Drumette) teilen, die Flügelspitzen abschneiden (für Fond einfrieren). Gründlich trocken tupfen – trockene Haut wird knusprig.',
    },
    {
      text: 'Backpulver und BBQ-Rub mischen und die Flügel darin wenden. Das Backpulver (nicht Natron) zieht Feuchtigkeit aus der Haut und macht sie später knusprig. Auf einem Gitter unbedeckt mindestens 1 Stunde, gern über Nacht, im Kühlschrank trocknen lassen.',
    },
    {
      text: 'Den Traeger mit Kirsch- oder Apfel-Pellets füllen und bei geschlossenem Deckel auf 82 °C (180 °F) vorheizen, etwa 15 Minuten.',
      settings: [traeger('Vorheizen', 180, { minutes: 15, note: 'Pellets Kirsche oder Apfel, Deckel zu' })],
    },
    {
      text: 'Die Flügel mit etwas Abstand auf den mittleren Rost legen und im Super Smoke bei 82 °C (180 °F) 30 Minuten räuchern – bei niedriger Temperatur nehmen sie am meisten Rauch an.',
      settings: [traeger('Super Smoke', 180, { minutes: 30 })],
    },
    {
      text: 'Den Traeger auf 204 °C (400 °F) hochdrehen und die Flügel 35 bis 45 Minuten grillen, nach der Hälfte wenden, bis die Haut goldbraun und knusprig ist und die Kerntemperatur mindestens 80 °C erreicht – Flügel dürfen ruhig etwas heißer werden, dann sind sie am zartesten.',
      settings: [traeger('Grillen', 400, { minutes: 40, core: 80 })],
    },
    {
      text: 'Inzwischen für die Buffalo-Sauce die Butter in einem kleinen Topf auf dem BORA bei Stufe 3 schmelzen und die Hot Sauce (z. B. Frank’s RedHot) einrühren, etwa 2 Minuten.',
      settings: [bora('3', { minutes: 2 })],
    },
    {
      text: 'Die heißen Flügel in einer Schüssel mit der Sauce schwenken und sofort servieren. Klassisch dazu: Selleriestangen und Blauschimmelkäse-Dip.',
    },
  ],

  // ───── Spatchcock Chicken ─────
  'spatchcock-chicken': [
    {
      text: 'Spatchcock heißt: flach aufgeklappt, dadurch gart das Hähnchen gleichmäßig und schneller. Das Hähnchen mit der Brust nach unten legen und mit einer Geflügelschere links und rechts am Rückgrat entlang aufschneiden, das Rückgrat entfernen (für Fond einfrieren). Umdrehen und mit dem Handballen fest auf das Brustbein drücken, bis es knackt und das Hähnchen flach liegt.',
    },
    {
      text: 'Das Hähnchen trocken tupfen. Die weiche Butter mit der Hälfte des BBQ-Rubs verkneten und mit den Fingern unter der Brust- und Keulenhaut verteilen. Außen mit dem restlichen Rub würzen. Unbedeckt mindestens 1 Stunde im Kühlschrank ruhen lassen (trocknet die Haut).',
    },
    {
      text: 'Den Traeger mit Apfel- oder Kirsch-Pellets füllen und bei geschlossenem Deckel auf 107 °C (225 °F) vorheizen, etwa 15 Minuten.',
      settings: [traeger('Vorheizen', 225, { minutes: 15, note: 'Pellets Apfel oder Kirsche, Deckel zu' })],
    },
    {
      text: 'Das Hähnchen mit der Hautseite nach oben auf den mittleren Rost legen, den Fühler in die dickste Stelle der Brust stecken (nicht an den Knochen) und im Super Smoke bei 107 °C (225 °F) 45 Minuten räuchern.',
      settings: [traeger('Super Smoke', 225, { minutes: 45 })],
    },
    {
      text: 'Den Traeger auf 191 °C (375 °F) stellen und weitergaren, bis die Haut goldbraun und knusprig ist und die Brust 74 °C Kerntemperatur erreicht, etwa 45 bis 60 Minuten.',
      settings: [traeger('Grillen', 375, { minutes: 50, core: 74 })],
    },
    {
      text: 'Zur Sicherheit auch die Keule messen: An der dicksten Stelle sollte sie 80–85 °C haben, dann ist sie saftig und löst sich gut vom Knochen. Das Hähnchen 10 Minuten ruhen lassen.',
    },
    {
      text: 'Die Zitrone halbieren, über das Hähnchen träufeln und in Brust, Keulen und Flügel zerteilen. Dazu passen Coleslaw und Grillmais.',
    },
  ],

  // ───── Moink Balls ─────
  'moink-balls': [
    {
      text: 'MOINK steht für „Moo“ (Rind) und „Oink“ (Schwein): Hackbällchen im Speckmantel. Die Zwiebel sehr fein würfeln und mit dem Hackfleisch gemischt, dem Ei, dem Paniermehl und der Hälfte des BBQ-Rubs zügig verkneten.',
    },
    {
      text: 'Aus der Masse 24 Bällchen à etwa 25 g formen. Die Bacon-Scheiben halbieren, jedes Bällchen mit einem halben Streifen umwickeln und mit einem Zahnstocher fixieren. Rundum mit dem restlichen Rub bestreuen.',
    },
    {
      text: 'Den Traeger mit Hickory- oder Kirsch-Pellets füllen und bei geschlossenem Deckel auf 107 °C (225 °F) vorheizen, etwa 15 Minuten.',
      settings: [traeger('Vorheizen', 225, { minutes: 15, note: 'Pellets Hickory oder Kirsche, Deckel zu' })],
    },
    {
      text: 'Die Bällchen auf ein Grillgitter oder den mittleren Rost setzen und im Super Smoke bei 107 °C (225 °F) 1 Stunde räuchern.',
      settings: [traeger('Super Smoke', 225, { minutes: 60 })],
    },
    {
      text: 'Den Traeger auf 135 °C (275 °F) stellen und weitergaren, bis der Bacon knusprig ist und die Kerntemperatur der Bällchen 70 °C erreicht (Hack immer durchgaren), etwa 45 Minuten.',
      settings: [traeger('Smoken', 275, { minutes: 45, core: 70 })],
    },
    {
      text: 'Die Bällchen rundum mit der BBQ-Sauce bestreichen und bei 135 °C (275 °F) noch 15 Minuten garen, bis die Sauce glänzt und klebt. Heiß als Fingerfood servieren.',
      settings: [traeger('Smoken', 275, { minutes: 15 })],
    },
  ],

  // ───── Atomic Buffalo Turds (ABTs) ─────
  'atomic-buffalo-turds': [
    {
      text: 'Einweghandschuhe anziehen. Die Jalapeño-Schoten (Gemüsetheke oder Asia-Markt; ersatzweise große grüne Peperoni oder kleine Spitzpaprika für eine milde Variante) längs halbieren, Kerne und weiße Trennwände mit einem Teelöffel herauskratzen – darin sitzt die Schärfe.',
    },
    {
      text: 'Frischkäse, Cheddar gerieben und Paprikapulver geräuchert glatt verrühren und die Jalapeño-Hälften damit füllen.',
    },
    {
      text: 'Die Bacon-Scheiben halbieren und jede gefüllte Hälfte mit einem halben Streifen umwickeln, die Enden unten einschlagen oder mit einem Zahnstocher fixieren. Leicht mit dem BBQ-Rub bestreuen.',
    },
    {
      text: 'Den Traeger mit Apfel- oder Hickory-Pellets füllen und bei geschlossenem Deckel auf 135 °C (275 °F) vorheizen, etwa 15 Minuten.',
      settings: [traeger('Vorheizen', 275, { minutes: 15, note: 'Pellets Apfel oder Hickory, Deckel zu' })],
    },
    {
      text: 'Die ABTs mit der Füllung nach oben in einen Jalapeño-Halter oder eine Aluschale mit Löchern setzen und bei 135 °C (275 °F) 60 bis 90 Minuten räuchern, bis der Bacon knusprig und die Schote weich ist.',
      settings: [traeger('Smoken', 275, { minutes: 75 })],
    },
    {
      text: 'Die ABTs 5 Minuten abkühlen lassen – die Füllung ist sehr heiß – und als Vorspeise servieren.',
    },
  ],

  // ───── Heißgeräucherter Lachs ─────
  'smoked-salmon': [
    {
      text: 'Für die Lake (Brine) das Salz und den braunen Zucker in 1 l kaltem Wasser vollständig auflösen. Das Lachsfilet (mit Haut, Gräten mit einer Pinzette ziehen) in einer flachen Form ganz damit bedecken und abgedeckt im Kühlschrank 3 Stunden ziehen lassen. Die Lake würzt durch und hält den Fisch saftig.',
    },
    {
      text: 'Den Lachs abspülen, trocken tupfen und mit der Hautseite nach unten auf einem Gitter unbedeckt 1 Stunde im Kühlschrank trocknen lassen. Es bildet sich eine leicht klebrige Haut (Pellikel), an der der Rauch gut haftet. Mit Pfeffer schwarz grob bestreuen.',
    },
    {
      text: 'Den Traeger mit Erlen- oder Apfel-Pellets füllen und bei geschlossenem Deckel auf 82 °C (180 °F) vorheizen, etwa 15 Minuten.',
      settings: [traeger('Vorheizen', 180, { minutes: 15, note: 'Pellets Erle oder Apfel, Deckel zu' })],
    },
    {
      text: 'Den Lachs mit der Hautseite nach unten auf den mittleren Rost legen, den Fühler von der Seite in die dickste Stelle stecken und im Super Smoke bei 82 °C (180 °F) 1 Stunde räuchern.',
      settings: [traeger('Super Smoke', 180, { minutes: 60 })],
    },
    {
      text: 'Den Lachs dünn mit dem Honig bestreichen, den Traeger auf 107 °C (225 °F) stellen und weitergaren, bis die Kerntemperatur 60 °C erreicht und sich das Fleisch mit einer Gabel leicht in Lamellen teilen lässt, etwa 30 bis 45 Minuten.',
      settings: [traeger('Smoken', 225, { minutes: 40, core: 60 })],
    },
    {
      text: 'Den Lachs mit einem breiten Pfannenwender von der Haut heben, mit gehacktem Dill bestreuen und mit Zitrone servieren – warm oder kalt. Reste halten abgedeckt im Kühlschrank 3 Tage.',
    },
  ],

  // ───── Carolina Pulled Pork ─────
  'carolina-pulled-pork': [
    {
      text: 'Von der Schweineschulter mit Schwarte die Schwarte abschneiden (oder vom Metzger entfernen lassen), dabei etwa 5 mm Fett stehen lassen. Am Vorabend trocken tupfen, rundum kräftig mit dem BBQ-Rub einreiben und abgedeckt über Nacht im Kühlschrank durchziehen lassen.',
    },
    {
      text: 'Für den Vinegar Mop (Essig-Sauce aus Eastern North Carolina) Apfelessig, braunen Zucker, Chiliflocken, Cayennepfeffer, Salz und Pfeffer schwarz grob verrühren, bis sich Zucker und Salz gelöst haben. Die Hälfte zum Einpinseln beiseitestellen, die andere Hälfte kommt am Ende als Sauce ans Fleisch.',
    },
    {
      text: 'Den Traeger mit Hickory-Pellets füllen und bei geschlossenem Deckel auf 107 °C (225 °F) vorheizen, etwa 15 Minuten.',
      settings: [traeger('Vorheizen', 225, { minutes: 15, note: 'Pellets Hickory, Deckel zu' })],
    },
    {
      text: 'Die Schulter mit der Fettseite nach oben auf den mittleren Rost legen, den Fühler in die dickste Stelle stecken (nicht an den Knochen) und im Super Smoke bei 107 °C (225 °F) 3 Stunden räuchern. Ab der zweiten Stunde stündlich mit dem Mop einpinseln (mopping).',
      settings: [traeger('Super Smoke', 225, { minutes: 180 })],
    },
    {
      text: 'Den Traeger auf 121 °C (250 °F) stellen und weiter stündlich mopfen, bis die Kruste dunkel ist und die Kerntemperatur im Stall bei etwa 74 °C stehen bleibt, meist 3 Stunden.',
      settings: [traeger('Smoken', 250, { minutes: 180, core: 74 })],
    },
    {
      text: 'Die Schulter fest in Butcherpapier oder doppelt Alufolie wickeln (Texas Crutch) und bei 121 °C (250 °F) bis 95 °C Kerntemperatur garen, etwa 3 bis 4 Stunden. Fertig ist sie, wenn der Fühler ohne Widerstand hineingleitet und sich der Knochen leicht herausdrehen lässt.',
      settings: [traeger('Smoken', 250, { minutes: 210, core: 95 })],
    },
    {
      text: 'Eingewickelt in einer leeren Kühlbox mit Handtüchern mindestens 1 Stunde ruhen lassen.',
    },
    {
      text: 'Den Knochen herausziehen, das Fleisch grob zupfen oder hacken (in Carolina „chopped“), grobes Fett entfernen und mit der zweiten Hälfte der Essig-Sauce mischen. Auf aufgeschnittenen Burger-Brötchen mit einem Löffel Coleslaw obendrauf servieren – so isst man es in Carolina.',
    },
    {
      text: 'Den Rest abkühlen lassen, in Beutel à 250 g mit etwas Bratensaft füllen, im Vakuumierer mit Feucht-Modus vakuumieren und sofort einfrieren (hält ca. 3 Monate). Später aufgetaut im CombiSteamer mit Vacuisine bei 70 °C 30 Minuten erwärmen.',
      settings: [vakuum('Vakuumieren feucht', '6 Beutel à 250 g'), vzug('steamer', 'Vacuisine', 70, { minutes: 30, note: 'später: Beutel aufwärmen' })],
    },
  ],

  // ───── Smoked Meatloaf ─────
  'smoked-meatloaf': [
    {
      text: 'Das Paniermehl in der Milch 5 Minuten einweichen. Die Zwiebel sehr fein würfeln, den Knoblauch fein hacken.',
    },
    {
      text: 'Hackfleisch gemischt, eingeweichtes Paniermehl, Zwiebel, Knoblauch, die Eier, Worcestersauce und die Hälfte des BBQ-Rubs mit den Händen nur so lange mischen, bis alles verbunden ist (zu viel Kneten macht den Meatloaf zäh).',
    },
    {
      text: 'Die Masse auf einem Stück Backpapier zu einem flachen Laib von etwa 25 × 12 cm formen und rundum mit dem restlichen Rub bestreuen. Für die Glasur Tomatenketchup, braunen Zucker und Apfelessig verrühren.',
    },
    {
      text: 'Den Traeger mit Hickory- oder Kirsch-Pellets füllen und bei geschlossenem Deckel auf 107 °C (225 °F) vorheizen, etwa 15 Minuten.',
      settings: [traeger('Vorheizen', 225, { minutes: 15, note: 'Pellets Hickory oder Kirsche, Deckel zu' })],
    },
    {
      text: 'Den Meatloaf mit dem Backpapier auf den mittleren Rost ziehen, den Fühler von der Seite in die Mitte stecken und im Super Smoke bei 107 °C (225 °F) 1 Stunde räuchern.',
      settings: [traeger('Super Smoke', 225, { minutes: 60 })],
    },
    {
      text: 'Den Traeger auf 177 °C (350 °F) stellen und garen, bis die Kerntemperatur 70 °C erreicht, etwa 45 bis 60 Minuten. In den letzten 20 Minuten zweimal dick mit der Glasur bestreichen.',
      settings: [traeger('Smoken', 350, { minutes: 50, core: 70 })],
    },
    {
      text: 'Den Meatloaf 10 Minuten ruhen lassen, dann in fingerdicke Scheiben schneiden. Dazu passen Kartoffelpüree und grüne Bohnen.',
    },
    {
      text: 'Übrige Scheiben abkühlen lassen, in Beutel à 250 g füllen, im Vakuumierer vakuumieren und einfrieren (hält ca. 3 Monate). Später aufgetaut im CombiSteamer mit Vacuisine bei 65 °C 30 Minuten erwärmen – oder kalt als Sandwich.',
      settings: [vakuum('Vakuumieren', '3 Beutel à 250 g'), vzug('steamer', 'Vacuisine', 65, { minutes: 30, note: 'später: Beutel aufwärmen' })],
    },
  ],

  // ───── Bacon Explosion / Fatty ─────
  'bacon-fatty': [
    {
      text: 'Die Zwiebel und die Paprika fein würfeln und in einer Pfanne auf dem BORA bei Stufe 6 ohne Öl 5 Minuten anschwitzen. Abkühlen lassen.',
      settings: [bora('6', { minutes: 5 })],
    },
    {
      text: 'Ein „Fatty“ ist eine gefüllte Hackrolle im Speckgitter. Auf Backpapier 6 Bacon-Scheiben eng nebeneinander legen. Jede zweite Scheibe zur Hälfte zurückklappen, eine Scheibe quer darüberlegen, zurückklappen; dann die anderen Scheiben zurückklappen und die nächste Querscheibe legen – so entsteht mit den übrigen 6 Scheiben ein geflochtenes Gitter (Bacon Weave).',
    },
    {
      text: 'Das Schweinehackfleisch mit der Hälfte des BBQ-Rubs mischen, in einen großen Gefrierbeutel geben und mit dem Nudelholz zu einem Quadrat von etwa 25 × 25 cm flach drücken. Den Beutel aufschneiden und die Hackplatte auf das Bacon-Gitter stürzen.',
    },
    {
      text: 'Das abgekühlte Gemüse und den Cheddar gerieben auf dem unteren Drittel verteilen. Mit Hilfe des Backpapiers fest aufrollen, sodass der Speck außen liegt, die Enden zusammendrücken. Mit dem restlichen Rub bestreuen und 30 Minuten kalt stellen.',
    },
    {
      text: 'Den Traeger mit Hickory-Pellets füllen und bei geschlossenem Deckel auf 107 °C (225 °F) vorheizen, etwa 15 Minuten.',
      settings: [traeger('Vorheizen', 225, { minutes: 15, note: 'Pellets Hickory, Deckel zu' })],
    },
    {
      text: 'Den Fatty mit der Naht nach unten auf den mittleren Rost legen, den Fühler von der Seite in die Mitte stecken und im Super Smoke bei 107 °C (225 °F) 1 Stunde räuchern.',
      settings: [traeger('Super Smoke', 225, { minutes: 60 })],
    },
    {
      text: 'Den Traeger auf 177 °C (350 °F) stellen und garen, bis der Bacon knusprig ist und die Kerntemperatur 70 °C erreicht, etwa 45 Minuten. In den letzten 10 Minuten mit der BBQ-Sauce bestreichen.',
      settings: [traeger('Smoken', 350, { minutes: 45, core: 70 })],
    },
    {
      text: 'Den Fatty 10 Minuten ruhen lassen und in 2 cm dicke Scheiben schneiden. Reste schmecken kalt aufgeschnitten am nächsten Tag.',
    },
  ],

  // ───── Picanha Reverse Sear ─────
  'picanha-reverse-sear': [
    {
      text: 'Picanha heißt in Deutschland Tafelspitz – beim Metzger „Tafelspitz mit Fettdeckel“ verlangen, ca. 1,2–1,4 kg. Den Fettdeckel im Rautenmuster (2 cm) einschneiden, ohne ins Fleisch zu schneiden. Rundum mit Salz bestreuen (Dry Brine) und unbedeckt mindestens 2 Stunden, gern über Nacht, im Kühlschrank ruhen lassen.',
    },
    {
      text: 'Den Traeger mit Eichen- oder Hickory-Pellets (etwas Mesquite dazu passt zu Rind) füllen und bei geschlossenem Deckel auf 107 °C (225 °F) vorheizen, etwa 15 Minuten. Das Fleisch mit Pfeffer schwarz grob und Knoblauchpulver würzen.',
      settings: [traeger('Vorheizen', 225, { minutes: 15, note: 'Pellets Eiche oder Hickory, Deckel zu' })],
    },
    {
      text: 'Reverse Sear heißt: erst langsam garen, dann scharf anbraten. Die Picanha mit der Fettseite nach oben auf den mittleren Rost legen, den Fühler von der Seite in die dickste Stelle stecken und bei 107 °C (225 °F) räuchern, bis die Kerntemperatur 48 °C erreicht, etwa 60 bis 90 Minuten.',
      settings: [traeger('Smoken', 225, { minutes: 75, core: 48 })],
    },
    {
      text: 'Etwa 15 Minuten vor Ende den Gasgrill mit allen 4 Brennern auf hoch bei geschlossenem Deckel 10 Minuten vorheizen und den Rost abbürsten.',
      settings: [gasgrill('Vorheizen', 260, 'hoch', 'alle', { minutes: 10, note: 'Deckel zu' })],
    },
    {
      text: 'Die Picanha vom Traeger auf den Gasgrill legen: erst die Fettseite 2 Minuten, dann jede Seite 1 Minute scharf anbraten, bis eine braune Kruste entsteht. Die Kerntemperatur steigt dabei auf etwa 54 °C (medium-rare).',
      settings: [gasgrill('Direkt', 260, 'hoch', 'alle', { minutes: 4, core: 54 })],
    },
    {
      text: 'Die Picanha 5 Minuten ruhen lassen und quer zur Faser in 1 cm dicke Scheiben schneiden. Dazu passen Grillgemüse oder ein Tomatensalat.',
    },
    {
      text: 'Den Rest am Stück abkühlen lassen, in Beutel à 200 g füllen, im Vakuumierer vakuumieren und einfrieren (hält ca. 3 Monate). Später aufgetaut im CombiSteamer mit Vacuisine bei 54 °C 30 Minuten erwärmen – oder hauchdünn als kalter Aufschnitt.',
      settings: [vakuum('Vakuumieren', '2 Beutel à 200 g'), vzug('steamer', 'Vacuisine', 54, { minutes: 30, note: 'später: Beutel aufwärmen' })],
    },
  ],
}

/** Schritte eines Rezepts = Texte der Geräte-Schritte */
const steps = (id: string): string[] => D[id].map((s) => s.text)

export const bbqSmoker: ExtraGroup = {
  recipes: [
    bbq('pulled-pork', 'Pulled Pork vom Traeger',
      {
        group: 'smoker',
        time: 960,
        portions: 10,
        eat: 2,
        fatLoss: 0.25,
        leftover: { name: 'Pulled Pork (vakuumiert)', amount: 1500, unit: 'g', portion: 250, shelf: 90 },
        lighter: 'Mageres aus der Mitte zupfen, das Fett aus den Randstücken großzügig wegschneiden und die Sauce separat reichen – spart rund 120 kcal pro Portion.',
      },
      '3000 g Schweinenacken | 2 EL Senf mittelscharf | 70 g BBQ-Rub | 300 ml Apfelsaft | 100 ml Apfelessig | 300 ml BBQ-Sauce',
      [
        'Am Vorabend den Schweinenacken (am Stück, gern mit Knochen) trocken tupfen, dünn mit Senf einstreichen und rundum kräftig mit dem Rub einreiben. Abgedeckt über Nacht im Kühlschrank durchziehen lassen.',
        'Den Smoker mit Hickory- oder Kirschholz auf 107 °C (225 °F) vorheizen. Den Nacken mit der Fettseite nach oben auf den Rost legen und das Thermometer in die dickste Stelle stecken, nicht an den Knochen.',
        'Bei 107 °C etwa 3 Stunden räuchern. Ab der zweiten Stunde stündlich mit einer Mischung aus 200 ml Apfelsaft und dem Apfelessig einsprühen.',
        'Auf 121 °C (250 °F) erhöhen und weitergaren, bis die Kruste (Bark) dunkel und fest ist und die Kerntemperatur bei etwa 74 °C stehen bleibt (der „Stall“).',
        'Den Nacken mit dem restlichen Apfelsaft fest in Butcherpapier oder doppelt Alufolie wickeln (Texas Crutch) und bei 121 °C bis 95 °C Kerntemperatur weitergaren, etwa 3 bis 4 Stunden. Fertig ist er, wenn das Thermometer ohne Widerstand hineingleitet.',
        'Eingewickelt in einer leeren Kühlbox, mit Handtüchern abgedeckt, mindestens 1 Stunde ruhen lassen.',
        'Knochen herausziehen, das Fleisch mit zwei Gabeln zupfen, grobes Fett entfernen und mit dem Bratensaft und 100 ml BBQ-Sauce mischen. Die restliche Sauce dazu reichen.',
        'Was übrig bleibt, abkühlen lassen, in Beutel à 250 g mit etwas Bratensaft füllen, vakuumieren und sofort einfrieren (hält ca. 3 Monate).',
      ]),

    bbq('spareribs-321', 'St. Louis Spareribs 3-2-1',
      {
        group: 'smoker',
        time: 420,
        portions: 6,
        eat: 2,
        fatLoss: 0.3,
        leftover: { name: 'Spareribs (vakuumiert)', amount: 1000, unit: 'g', portion: 250, shelf: 90 },
        lighter: 'Beim Wickeln Butter und Zucker weglassen und nur Apfelsaft nehmen, die Sauce dünn auftragen – spart rund 150 kcal pro Portion.',
      },
      '2600 g Spareribs | 3 EL Senf mittelscharf | 60 g BBQ-Rub | 200 ml Apfelsaft | 40 g Butter | 40 g Brauner Zucker | 2 EL Honig | 200 ml BBQ-Sauce',
      steps('spareribs-321')),

    bbq('baby-back-ribs', 'Baby Back Ribs 2-2-1',
      {
        group: 'smoker',
        time: 330,
        portions: 4,
        eat: 2,
        fatLoss: 0.25,
        leftover: { name: 'Baby Back Ribs (vakuumiert)', amount: 500, unit: 'g', portion: 250, shelf: 90 },
        lighter: 'Memphis-Style „dry“ – nur mit Rub statt Sauce und ohne Butter im Wickel – spart rund 120 kcal pro Portion.',
      },
      '1800 g Baby Back Ribs | 2 EL Senf mittelscharf | 45 g BBQ-Rub | 150 ml Apfelsaft | 2 EL Honig | 30 g Butter | 200 ml BBQ-Sauce',
      steps('baby-back-ribs')),

    bbq('pork-belly-burnt-ends', 'Pork Belly Burnt Ends',
      {
        group: 'smoker',
        time: 330,
        portions: 6,
        eat: 2,
        fatLoss: 0.4,
        leftover: { name: 'Pork Belly Burnt Ends (vakuumiert)', amount: 500, unit: 'g', portion: 250, shelf: 90 },
        lighter: 'Als Vorspeise statt Hauptgang servieren (3–4 Würfel pro Person) und die Butter in der Glasur weglassen.',
      },
      '1500 g Schweinebauch | 2 EL Senf mittelscharf | 40 g BBQ-Rub | 60 g Butter | 60 g Brauner Zucker | 3 EL Honig | 200 ml BBQ-Sauce',
      steps('pork-belly-burnt-ends')),

    bbq('texas-brisket', 'Texas Brisket (ganzes Stück)',
      {
        group: 'smoker',
        time: 1500,
        portions: 14,
        eat: 2,
        fatLoss: 0.4,
        leftover: { name: 'Brisket (vakuumiert)', amount: 2250, unit: 'g', portion: 250, shelf: 90 },
        lighter: 'Scheiben vom mageren Flat statt vom fetten Point nehmen – spart rund 150 kcal pro Portion.',
      },
      '5000 g Rinderbrust | 40 g Salz | 40 g Pfeffer schwarz grob | 2 EL Knoblauchpulver | 100 ml Apfelessig',
      steps('texas-brisket')),

    bbq('brisket-burnt-ends', 'Brisket Burnt Ends (Kansas City)',
      {
        group: 'smoker',
        time: 780,
        portions: 7,
        eat: 2,
        fatLoss: 0.4,
        leftover: { name: 'Brisket Burnt Ends (vakuumiert)', amount: 1000, unit: 'g', portion: 250, shelf: 90 },
        lighter: 'Honig und Butter weglassen, nur mit BBQ-Sauce glasieren – spart rund 80 kcal pro Portion.',
      },
      '2500 g Rinderbrust | 50 g BBQ-Rub | 2 EL Pfeffer schwarz grob | 300 ml BBQ-Sauce | 3 EL Honig | 40 g Brauner Zucker | 40 g Butter',
      steps('brisket-burnt-ends')),

    bbq('chicken-wings-smoker', 'Smoked Chicken Wings (Buffalo)',
      {
        group: 'smoker',
        time: 180,
        portions: 2,
        eat: 2,
        fatLoss: 0.25,
        lighter: 'Butter in der Sauce halbieren und die Flügel nur dünn einpinseln statt darin zu schwenken – spart rund 100 kcal pro Portion.',
      },
      '1000 g Hähnchenflügel | 2 TL Backpulver | 30 g BBQ-Rub | 30 g Butter | 100 ml Hot Sauce',
      steps('chicken-wings-smoker')),

    bbq('spatchcock-chicken', 'Spatchcock Chicken vom Traeger',
      {
        group: 'smoker',
        time: 210,
        portions: 3,
        eat: 2,
        fatLoss: 0.2,
        lighter: 'Ohne Butter unter der Haut und die Haut beim Essen weglassen – spart rund 150 kcal pro Portion.',
      },
      '1400 g Hähnchen ganz | 30 g Butter | 30 g BBQ-Rub | 1 Stk Zitrone',
      steps('spatchcock-chicken')),

    bbq('moink-balls', 'Moink Balls',
      {
        group: 'smoker',
        time: 150,
        portions: 4,
        eat: 4,
        fatLoss: 0.2,
        lighter: 'Nur jedes zweite Bällchen in Bacon wickeln – spart rund 80 kcal pro Portion.',
      },
      '600 g Hackfleisch gemischt | 1 Stk Zwiebel | 1 Stk Ei | 40 g Paniermehl | 20 g BBQ-Rub | 12 Scheibe Bacon | 150 ml BBQ-Sauce',
      steps('moink-balls')),

    bbq('atomic-buffalo-turds', 'Atomic Buffalo Turds (ABTs)',
      {
        group: 'smoker',
        time: 135,
        portions: 4,
        eat: 4,
        fatLoss: 0.25,
        lighter: 'Frischkäse in der leichten Stufe nehmen und den Cheddar weglassen – spart rund 70 kcal pro Portion.',
      },
      '12 Stk Jalapeño | 200 g Frischkäse | 60 g Cheddar gerieben | 1 TL Paprikapulver geräuchert | 12 Scheibe Bacon | 1 EL BBQ-Rub',
      steps('atomic-buffalo-turds')),

    bbq('smoked-salmon', 'Heißgeräucherter Lachs',
      {
        group: 'smoker',
        time: 330,
        portions: 2,
        eat: 2,
        // Lake wird abgespült: vom Zucker bleibt nur ein kleiner Teil am Fisch
        eaten: { Salz: 0.1, 'Brauner Zucker': 0.1 },
      },
      '500 g Lachsfilet | 50 g Salz | 50 g Brauner Zucker | 1 TL Pfeffer schwarz grob | 1 EL Honig | 1 Bund Dill | 1 Stk Zitrone',
      steps('smoked-salmon')),

    bbq('carolina-pulled-pork', 'Carolina Pulled Pork mit Vinegar Mop',
      {
        group: 'smoker',
        time: 1020,
        portions: 11,
        eat: 2,
        fatLoss: 0.3,
        leftover: { name: 'Carolina Pulled Pork (vakuumiert)', amount: 1500, unit: 'g', portion: 250, shelf: 90 },
        lighter: 'Die Essig-Sauce ist schon leicht – das Fett beim Zupfen konsequent entfernen und ohne Brötchen auf Coleslaw essen.',
      },
      '3500 g Schweineschulter mit Schwarte | 60 g BBQ-Rub | 400 ml Apfelessig | 2 EL Brauner Zucker | 2 TL Chiliflocken | 1 TL Cayennepfeffer | 2 TL Salz | 1 EL Pfeffer schwarz grob | 4 Stk Burger-Brötchen',
      steps('carolina-pulled-pork')),

    bbq('smoked-meatloaf', 'Smoked Meatloaf',
      {
        group: 'smoker',
        time: 180,
        portions: 6,
        eat: 2,
        fatLoss: 0.15,
        leftover: { name: 'Smoked Meatloaf (vakuumiert)', amount: 750, unit: 'g', portion: 250, shelf: 90 },
        lighter: 'Halb Rinderhack, halb Hackfleisch gemischt nehmen und die Glasur dünn auftragen – spart rund 60 kcal pro Portion.',
      },
      '1000 g Hackfleisch gemischt | 1 Stk Zwiebel | 2 Zehe Knoblauch | 2 Stk Ei | 60 g Paniermehl | 100 ml Milch | 2 EL Worcestersauce | 20 g BBQ-Rub | 150 ml Tomatenketchup | 30 g Brauner Zucker | 1 EL Apfelessig',
      steps('smoked-meatloaf')),

    bbq('bacon-fatty', 'Bacon Fatty (gefüllte Hackrolle)',
      {
        group: 'smoker',
        time: 180,
        portions: 4,
        eat: 2,
        fatLoss: 0.2,
        lighter: 'Kleinere Scheiben servieren und viel Coleslaw dazu – der Fatty ist eher etwas für besondere Tage.',
      },
      '12 Scheibe Bacon | 600 g Schweinehackfleisch | 20 g BBQ-Rub | 1 Stk Zwiebel | 1 Stk Paprika rot | 80 g Cheddar gerieben | 100 ml BBQ-Sauce',
      steps('bacon-fatty')),

    bbq('picanha-reverse-sear', 'Picanha Reverse Sear',
      {
        group: 'smoker',
        time: 240,
        portions: 4,
        eat: 2,
        fatLoss: 0.1,
        leftover: { name: 'Picanha (vakuumiert)', amount: 400, unit: 'g', portion: 200, shelf: 90 },
        lighter: 'Den Fettdeckel nach dem Anbraten abschneiden – spart rund 100 kcal pro Portion.',
      },
      '1300 g Tafelspitz | 15 g Salz | 1 EL Pfeffer schwarz grob | 1 TL Knoblauchpulver',
      steps('picanha-reverse-sear')),
  ],
  // 'Hot Sauce' kommt aus recipes-us.ts (usZutaten). Kaufbares Pulled Pork / Pulled Beef (Kühlregal) – Resteessen nennen diese, der vakuumierte Rest aus dem Vorrat geht vor
  catalog: {
    fleisch: ['Pulled Pork', 'Pulled Beef', 'Spareribs', 'Baby Back Ribs', 'Rinderbrust'],
    konserven: ['Apfelsaft'],
    gemuese: ['Jalapeño'],
  },
  products: {
    'Pulled Pork': prod(400, 'g', 4.99, 21, 3, 'Pck'),
    'Pulled Beef': prod(400, 'g', 5.99, 21, 3, 'Pck'),
    Apfelsaft: prod(1000, 'ml', 1.29, 365, 5, 'Flasche'),
    // St. Louis Cut, ein Rack ca. 1,3 kg (Metzger/Kaufland-Theke)
    Spareribs: prod(1300, 'g', 11.99, 3, 1, 'Rack'),
    // Kotelettrippen (Baby Back), ein Rack ca. 0,9 kg – beim Metzger bestellen
    'Baby Back Ribs': prod(900, 'g', 12.99, 3, 1, 'Rack'),
    // Rinderbrust am Stück (Metzger, vorbestellen): 2,5 kg je Stück, ganzes Brisket = 2 Stück
    Rinderbrust: prod(2500, 'g', 44.75, 4, 1, 'Stück'),
    Jalapeño: prod(6, 'Stk', 1.99, 10, 5, 'Schale'),
  },
  // je 100 g Einkaufsgewicht (Ribs mit Knochen, Rinderbrust mit Fettdeckel)
  nutrition: {
    'Pulled Pork': [190, 19, 9, 8, 0.5],
    'Pulled Beef': [180, 22, 9, 3, 0],
    Apfelsaft: [46, 0.1, 0.1, 11, 0.1],
    Spareribs: [215, 13, 18, 0, 0],
    'Baby Back Ribs': [195, 14, 15.5, 0, 0],
    Rinderbrust: [225, 18, 17, 0, 0],
    Jalapeño: [29, 0.9, 0.4, 6.5, 2.8],
  },
  grams: { Jalapeño: { Stk: 20 } },
  substitutes: {
    groups: {
      'pulled-pork': ['Pulled Pork', 'Pulled Pork (vakuumiert)', 'Carolina Pulled Pork (vakuumiert)'],
      'pulled-beef': ['Pulled Beef', 'Brisket (vakuumiert)'],
    },
    preferred: {
      'Pulled Pork': ['Pulled Pork (vakuumiert)', 'Carolina Pulled Pork (vakuumiert)'],
      'Pulled Beef': ['Brisket (vakuumiert)'],
    },
  },
  deviceSteps: {
    'pulled-pork': [
      {
        text: 'Am Vorabend den Schweinenacken (am Stück, gern mit Knochen) trocken tupfen, dünn mit Senf einstreichen und rundum kräftig mit dem BBQ-Rub einreiben. Abgedeckt über Nacht im Kühlschrank durchziehen lassen.',
      },
      {
        text: 'Den Traeger mit Hickory-Pellets füllen, einschalten und bei geschlossenem Deckel auf 107 °C (225 °F) vorheizen, etwa 15 Minuten.',
        settings: [traeger('Vorheizen', 225, { minutes: 15, note: 'Pellets Hickory, Deckel zu' })],
      },
      {
        text: 'Den Nacken mit der Fettseite nach oben auf den mittleren Rost legen und den Fühler in die dickste Stelle stecken, nicht an den Knochen. Im Super Smoke bei 107 °C (225 °F) 3 Stunden räuchern. Ab der zweiten Stunde stündlich mit einer Mischung aus 200 ml Apfelsaft und dem Apfelessig einsprühen.',
        settings: [traeger('Super Smoke', 225, { minutes: 180 })],
      },
      {
        text: 'Den Traeger auf 121 °C (250 °F) stellen und weitergaren, bis die Kruste (Bark) dunkel und fest ist und die Kerntemperatur bei etwa 74 °C stehen bleibt (der „Stall“: Feuchtigkeit verdunstet an der Oberfläche und kühlt das Fleisch) – meist nach weiteren 3 Stunden.',
        settings: [traeger('Smoken', 250, { core: 74 })],
      },
      {
        text: 'Den Nacken mit dem restlichen Apfelsaft (100 ml) fest in Butcherpapier oder doppelt Alufolie wickeln (Texas Crutch), mit dem Fühler zurück in den Traeger legen und bei 121 °C (250 °F) bis 95 °C Kerntemperatur garen, etwa 3 bis 4 Stunden. Fertig ist er, wenn der Fühler ohne Widerstand hineingleitet (probe tender).',
        settings: [traeger('Smoken', 250, { minutes: 210, core: 95 })],
      },
      {
        text: 'Eingewickelt in einer leeren Kühlbox, mit Handtüchern abgedeckt, mindestens 1 Stunde ruhen lassen.',
      },
      {
        text: 'Knochen herausziehen, das Fleisch mit zwei Gabeln zupfen, grobes Fett entfernen und mit dem aufgefangenen Bratensaft und 100 ml BBQ-Sauce mischen. Die restliche Sauce dazu reichen.',
      },
      {
        text: 'Was übrig bleibt, abkühlen lassen, in Beutel à 250 g mit etwas Bratensaft füllen, flach drücken und im Vakuumierer mit Feucht-Modus vakuumieren. Sofort einfrieren (hält ca. 3 Monate). Später den Beutel aufgetaut im CombiSteamer mit Vacuisine bei 70 °C 30 Minuten erwärmen.',
        settings: [vakuum('Vakuumieren feucht', 'Beutel à 250 g'), vzug('steamer', 'Vacuisine', 70, { minutes: 30, note: 'später: Beutel aufwärmen' })],
      },
    ],
    ...D,
  },
  imageQueries: {
    'pulled-pork': 'pulled pork smoked pork shoulder',
    'spareribs-321': 'smoked st louis spare ribs bbq',
    'baby-back-ribs': 'baby back ribs barbecue glazed',
    'pork-belly-burnt-ends': 'pork belly burnt ends',
    'texas-brisket': 'texas smoked brisket sliced bark',
    'brisket-burnt-ends': 'brisket burnt ends kansas city',
    'chicken-wings-smoker': 'smoked buffalo chicken wings',
    'spatchcock-chicken': 'spatchcock smoked chicken',
    'moink-balls': 'moink balls bacon wrapped meatballs',
    'atomic-buffalo-turds': 'atomic buffalo turds bacon jalapeno poppers',
    'smoked-salmon': 'hot smoked salmon fillet',
    'carolina-pulled-pork': 'carolina pulled pork sandwich coleslaw',
    'smoked-meatloaf': 'smoked meatloaf glazed sliced',
    'bacon-fatty': 'bacon explosion fatty sliced',
    'picanha-reverse-sear': 'picanha sliced fat cap',
  },
}
