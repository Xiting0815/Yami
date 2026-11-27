import { bbq, prod } from '../../define'
import { gasgrill, vakuum, vzug, bora } from '../../device-helpers'
import type { ExtraGroup } from '../types'

/**
 * BBQ · Grill (4-Brenner-Gasgrill, Deckelthermometer): Steaks, Spieße, Chicken, Reverse Sear, Planked Salmon …
 * Zonen über die Brenner: direkt = alle hoch, indirekt = Brenner 1+4 an, Mitte aus, Deckel zu. Kerntemperatur mit Thermometer.
 * Regeln: docs/bbq-regeln.md, Gerät: docs/geraete/grill-dutch.md, Baustein `gasgrill()` (device-helpers.ts).
 */

/** Gasgrill 10 Minuten mit allen Brennern vorheizen (Deckel zu) */
const vorheizen = (temp = 260) => gasgrill('Vorheizen', temp, 'hoch', 'alle', { minutes: 10, note: 'Deckel zu' })

export const bbqGrill: ExtraGroup = {
  recipes: [
    bbq('beer-can-chicken', 'Beer Can Chicken vom Gasgrill',
      { group: 'grill', time: 150, portions: 4, eat: 2 },
      '1400 g Hähnchen ganz | 1 EL Sonnenblumenöl | 3 EL BBQ-Rub | 330 ml Bier hell | 100 ml BBQ-Sauce',
      [
        'Das Hähnchen innen und außen trocken tupfen, dünn mit Öl einreiben und rundum sowie innen mit dem Rub würzen. Mindestens 1 Stunde im Kühlschrank ziehen lassen.',
        'Den Grill für indirekte Hitze vorbereiten: nur die äußeren Brenner an, die Mitte aus, Deckel zu, etwa 180 °C.',
        'Eine halbvolle Bierdose (etwa 165 ml Bier) ins Hähnchen schieben und das Hähnchen aufrecht in die Mitte stellen. Bei geschlossenem Deckel 75 bis 90 Minuten grillen, bis die Keule innen 80 °C hat.',
        'Das Hähnchen 10 Minuten ruhen lassen, die heiße Dose vorsichtig mit Grillhandschuhen herausziehen, tranchieren und mit der BBQ-Sauce servieren.',
      ]),

    bbq('rumpsteak-gasgrill', 'New York Strip (Rumpsteak) mit Baked Potato',
      { group: 'grill', time: 100, portions: 2 },
      '2 Stk Rumpsteak | 500 g Kartoffeln mehligkochend | 1 TL Sonnenblumenöl | 40 g Butter | 2 Zehe Knoblauch | 2 Zweig Thymian | 100 g Saure Sahne | 0.5 Bund Schnittlauch | Salz | Pfeffer',
      [
        'Die Rumpsteaks (in den USA „New York Strip“, möglichst 2,5–3 cm dick) 30 Minuten vor dem Grillen aus dem Kühlschrank nehmen, trocken tupfen und den Fettrand alle 2 cm einschneiden. Die Kartoffeln einstechen, mit Öl einreiben, salzen und in Alufolie wickeln.',
        'Den Grill vorheizen und eine Zwei-Zonen-Glut einrichten: eine Seite mittel, die andere aus, etwa 200 °C unter dem Deckel.',
        'Die Kartoffeln auf der kalten Seite bei geschlossenem Deckel etwa 60 Minuten garen, bis ein Spieß leicht hineingleitet.',
        'Butter mit gehacktem Knoblauch und Thymianblättchen verrühren. Schnittlauch in Röllchen schneiden und mit der sauren Sahne, Salz und Pfeffer verrühren.',
        'Die Kartoffeln warm halten, die heiße Seite auf hoch stellen und die gesalzenen Steaks 2 Minuten je Seite scharf angrillen.',
        'Die Steaks auf die kalte Seite ziehen und mit Deckel bis 52 °C Kerntemperatur (medium-rare) garziehen lassen, 4 bis 8 Minuten.',
        'Die Steaks 5 Minuten ruhen lassen, mit der Kräuterbutter belegen, pfeffern und mit den aufgeschnittenen Kartoffeln und der Schnittlauch-Sahne servieren.',
      ]),

    bbq('ribeye-reverse-sear', 'Reverse Sear Ribeye (oder Tomahawk)',
      { group: 'grill', time: 150, portions: 2 },
      '600 g Ribeye-Steak | 6 g Salz | 1 TL Sonnenblumenöl | 20 g Butter | 2 Zehe Knoblauch | 2 Zweig Rosmarin | Pfeffer',
      [
        'Das Ribeye-Steak (4–5 cm dick) rundum salzen und unabgedeckt auf einem Gitter mindestens 1 Stunde, besser über Nacht, im Kühlschrank ruhen lassen (Dry Brine).',
        'Den Grill für sehr sanfte indirekte Hitze vorbereiten: ein Brenner niedrig, die anderen aus, etwa 110 °C.',
        'Das Steak auf der kalten Seite mit Deckel garen, bis der Kern 46 °C zeigt, etwa 45 bis 75 Minuten. Alternative: vakuumiert im CombiSteamer mit Vacuisine bei 54 °C 2,5 Stunden garen.',
        'Den Grill mit allen Brennern auf hoch etwa 280 °C heiß werden lassen.',
        'Das Steak dünn mit Öl bestreichen und direkt 1 bis 2 Minuten je Seite scharf angrillen, bis der Kern 54 °C zeigt. Butter, Knoblauch und Rosmarin in einer kleinen Pfanne aufschäumen und darüberlöffeln.',
        'Gegen die Faser aufschneiden, pfeffern und sofort servieren.',
      ]),

    bbq('shish-kebab', 'Shish Kebab – Rinderspieße mit Reis-Pilaw',
      { group: 'grill', time: 180, portions: 2 },
      '500 g Rinderhüfte | 40 ml Olivenöl | 1 Stk Zitrone | 3 Zehe Knoblauch | 1 TL Oregano getrocknet | 1 TL Kreuzkümmel | 1 TL Paprikapulver edelsüß | 1 Stk Paprika rot | 1 Stk Paprika grün | 1 Stk Zwiebel rot | 200 g Champignons | 200 g Kirschtomaten | 10 g Butter | 120 g Langkornreis | 240 ml Hühnerbrühe | 150 g Joghurt natur | Salz | Pfeffer',
      [
        'Die Rinderhüfte in 3 cm große Würfel schneiden. Olivenöl, Saft und Schale der Zitrone, 2 gepresste Zehen Knoblauch, Oregano, Kreuzkümmel, Paprikapulver, Salz und Pfeffer verrühren und das Fleisch darin mindestens 2 Stunden marinieren.',
        'Paprika und rote Zwiebel in 3 cm große Stücke schneiden. Fleisch, Gemüse, Champignons und Kirschtomaten abwechselnd auf Spieße stecken.',
        'Für den Reis-Pilaw den Langkornreis in Butter anrösten, mit Hühnerbrühe aufgießen und zugedeckt 15 Minuten quellen lassen.',
        'Den Joghurt mit der restlichen Knoblauchzehe, Salz und Pfeffer verrühren.',
        'Die Spieße bei mittlerer bis hoher Hitze rundum 8 bis 10 Minuten grillen, bis das Fleisch außen gebräunt und innen rosa ist.',
        'Mit Reis-Pilaw und Joghurtsauce servieren.',
      ]),

    bbq('chicken-thighs-alabama', 'Grilled Chicken mit Alabama White Sauce',
      { group: 'grill', time: 90, portions: 2 },
      '3 Stk Hähnchenschenkel | 2 EL BBQ-Rub | 100 g Mayonnaise | 60 ml Apfelessig | 1 EL Meerrettich gerieben | 0.5 Stk Zitrone | 1 TL Brauner Zucker | 0.25 TL Cayennepfeffer | 1 TL Pfeffer | Salz',
      [
        'Die Hähnchenschenkel trocken tupfen, am Gelenk einschneiden, mit dem BBQ-Rub würzen und 30 Minuten ziehen lassen.',
        'Für die Alabama White Sauce Mayonnaise, Apfelessig, Meerrettich, Zitronensaft, braunen Zucker, Cayennepfeffer, reichlich groben Pfeffer und eine Prise Salz verrühren und kalt stellen.',
        'Den Grill für indirekte Hitze bei etwa 190 °C vorbereiten (äußere Brenner an, Mitte aus).',
        'Die Schenkel mit der Hautseite nach oben in die Mitte legen und mit Deckel 35 bis 45 Minuten grillen, bis die dickste Stelle 80 °C hat.',
        'Alle Brenner auf hoch stellen und die Schenkel 2 bis 3 Minuten je Seite direkt grillen, bis die Haut knusprig ist.',
        'Die heißen Schenkel in die Hälfte der Sauce tauchen und mit der restlichen Sauce servieren.',
      ]),

    bbq('elote', 'Mexican Street Corn (Elote) vom Grill',
      { group: 'grill', time: 30, portions: 2 },
      '4 Stk Maiskolben | 1 EL Sonnenblumenöl | 60 g Mayonnaise | 60 g Saure Sahne | 1 Zehe Knoblauch | 1 Stk Limette | 80 g Feta | 0.5 Bund Koriander | 1 TL Paprikapulver geräuchert | 0.25 TL Cayennepfeffer | Salz',
      [
        'Die Maiskolben putzen (vorgegarte nur trocken tupfen), mit Öl einreiben und salzen.',
        'Mayonnaise, saure Sahne, gepressten Knoblauch und den Saft einer halben Limette verrühren. Feta zerbröseln, Koriander hacken, die zweite Limettenhälfte in Spalten schneiden.',
        'Den Grill auf hoher Stufe vorheizen.',
        'Die Kolben bei mittlerer Hitze 10 bis 12 Minuten rundum grillen, bis die Körner gebräunt und stellenweise geröstet sind.',
        'Die heißen Kolben mit der Creme bestreichen, mit Feta, geräuchertem Paprikapulver, Cayennepfeffer und Koriander bestreuen und mit Limettenspalten servieren.',
      ]),

    bbq('cajun-garnelen-spiesse', 'Cajun-Garnelen-Spieße mit Knoblauchbutter',
      { group: 'grill', time: 45, portions: 2 },
      '500 g Garnelen roh TK | 1 Stk Paprika rot | 1 Stk Zwiebel rot | 1 EL Sonnenblumenöl | 2 EL Cajun-Gewürz | 150 g Langkornreis | 50 g Butter | 3 Zehe Knoblauch | 1 Stk Zitrone | 0.5 Bund Petersilie | Salz',
      [
        'Die Garnelen im Kühlschrank auftauen, bis auf das Schwanzende schälen, den Darm entfernen und trocken tupfen.',
        'Paprika und rote Zwiebel in Stücke schneiden. Die Garnelen mit Öl und Cajun-Gewürz mischen und abwechselnd mit dem Gemüse aufspießen.',
        'Den Langkornreis mit 225 ml Wasser und etwas Salz garen.',
        'Die Butter schmelzen, gehackten Knoblauch kurz darin ziehen lassen, Zitronensaft und gehackte Petersilie unterrühren.',
        'Die Spieße bei hoher Hitze 2 bis 3 Minuten je Seite grillen, bis die Garnelen rosa sind, zuletzt mit etwas Knoblauchbutter bestreichen.',
        'Auf dem Reis anrichten und mit der restlichen Knoblauchbutter beträufeln.',
      ]),

    bbq('cedar-plank-salmon', 'Cedar Plank Salmon – Lachs vom Zedernholzbrett',
      { group: 'grill', time: 100, portions: 2 },
      '500 g Lachsfilet | 2 EL Brauner Zucker | 1 EL Senf mittelscharf | 1 EL Sojasauce | 1 Zehe Knoblauch | 1 Stk Zitrone | 400 g Grüne Bohnen | 10 g Butter | 0.5 Bund Dill | Salz | Pfeffer',
      [
        'Eine Zedernholz-Planke mindestens 1 Stunde in Wasser einlegen.',
        'Braunen Zucker, Senf, Sojasauce, gepressten Knoblauch und abgeriebene Zitronenschale verrühren. Den Lachs salzen, pfeffern und oben mit der Glasur bestreichen.',
        'Den Grill vorheizen, dann eine Seite auf mittel, die andere aus (etwa 190 °C).',
        'Die Planke über der heißen Seite anrösten, bis sie knistert, dann wenden.',
        'Den Lachs auf die Planke legen, auf die kalte Seite ziehen und mit Deckel 20 bis 25 Minuten garen, bis der Kern 52 °C zeigt.',
        'Inzwischen die grünen Bohnen bissfest dämpfen und in Butter schwenken.',
        'Den Lachs mit Dill bestreuen und mit Zitronenspalten und den Bohnen servieren.',
      ]),
  ],
  catalog: { fleisch: ['Hähnchen ganz', 'Ribeye-Steak'], gemuese: ['Maiskolben'] },
  products: {
    'Hähnchen ganz': prod(1400, 'g', 5.99, 3, 1, 'Stk'),
    // Metzger/Kaufland-Theke, ca. 30–35 €/kg
    'Ribeye-Steak': prod(400, 'g', 12.99, 4, 1, 'Stk'),
    // vorgegart und vakuumiert (ganzjährig), frisch August–Oktober
    Maiskolben: prod(2, 'Stk', 1.99, 30, 2, 'Pck'),
  },
  // je 100 g Einkaufsgewicht mit Knochen (essbarer Anteil ca. 70 %)
  nutrition: {
    'Hähnchen ganz': [150, 13, 11, 0, 0],
    'Ribeye-Steak': [250, 19, 19, 0, 0],
    // je 100 g Kolben mit Strunk (Körner ca. 65 %)
    Maiskolben: [75, 2.5, 1, 14, 2],
  },
  grams: { Maiskolben: { Stk: 220 } },
  deviceSteps: {
    'beer-can-chicken': [
      {
        text: 'Das Hähnchen innen und außen trocken tupfen, dünn mit Öl einreiben und rundum sowie innen mit dem BBQ-Rub würzen. Mindestens 1 Stunde im Kühlschrank ziehen lassen.',
      },
      {
        text: 'Den Gasgrill mit allen 4 Brennern auf hoch und geschlossenem Deckel 10 Minuten auf etwa 250 °C vorheizen und den Rost abbürsten. Dann die mittleren Brenner ausschalten und Brenner 1 und 4 auf mittel stellen: indirekte Hitze, das Deckelthermometer pendelt sich bei etwa 180 °C ein.',
        settings: [gasgrill('Vorheizen', 250, 'hoch', 'alle', { minutes: 10, note: 'Deckel zu' }), gasgrill('Indirekt', 180, 'mittel', '1+4', { note: 'Mitte aus' })],
      },
      {
        text: 'Etwa 165 ml vom Bier hell abgießen, die halbvolle Dose ins Hähnchen schieben und das Hähnchen aufrecht über die ausgeschalteten Brenner in die Mitte stellen. Bei geschlossenem Deckel und 180 °C 75 bis 90 Minuten grillen, bis das Thermometer in der Keule 80 °C zeigt (Brust mindestens 74 °C). Das Deckelthermometer misst oben unter dem Deckel und geht oft 10 bis 20 °C falsch – die Kerntemperatur entscheidet.',
        settings: [gasgrill('Indirekt', 180, 'mittel', '1+4', { minutes: 80, core: 80, note: 'Deckel zu' })],
      },
      {
        text: 'Das Hähnchen 10 Minuten ruhen lassen, die heiße Dose vorsichtig mit Grillhandschuhen herausziehen, tranchieren und mit der BBQ-Sauce servieren.',
      },
    ],

    'rumpsteak-gasgrill': [
      {
        text: 'Die Rumpsteaks (in den USA „New York Strip“, möglichst 2,5 bis 3 cm dick) 30 Minuten vor dem Grillen aus dem Kühlschrank nehmen, trocken tupfen und den Fettrand alle 2 cm leicht einschneiden, damit sich das Steak nicht wölbt. Die Kartoffeln waschen, mit einer Gabel mehrmals einstechen, mit dem Sonnenblumenöl einreiben, salzen und einzeln in Alufolie wickeln.',
      },
      {
        text: 'Den Gasgrill mit allen 4 Brennern auf hoch und geschlossenem Deckel 10 Minuten auf etwa 260 °C vorheizen und den Rost abbürsten. Dann Brenner 1 und 2 auf mittel stellen und die beiden rechten Brenner ausschalten: So entsteht ein Zwei-Zonen-Grill mit einer heißen und einer kalten Seite, unter dem Deckel etwa 200 °C.',
        settings: [vorheizen(), gasgrill('Indirekt', 200, 'mittel', '1+2', { note: 'rechte Brenner aus' })],
      },
      {
        text: 'Die Kartoffeln in der Folie auf die kalte Seite ohne Flamme legen und bei geschlossenem Deckel 60 Minuten indirekt garen, bis ein Holzspieß ohne Widerstand hineingleitet. Das ist die klassische Steakhouse-Beilage „Baked Potato“.',
        settings: [gasgrill('Indirekt', 200, 'mittel', '1+2', { minutes: 60, note: 'Deckel zu, Kartoffeln auf der kalten Seite' })],
      },
      {
        text: 'Inzwischen für die Kräuterbutter die weiche Butter mit fein gehacktem Knoblauch und abgezupften Thymianblättchen verrühren. Den Schnittlauch in Röllchen schneiden und mit der sauren Sahne, Salz und Pfeffer verrühren.',
      },
      {
        text: 'Die fertigen Kartoffeln in der Folie vom Rost nehmen und in ein Küchentuch gewickelt warm halten. Brenner 1 und 2 auf hoch stellen, den Deckel 5 Minuten schließen, bis die heiße Seite etwa 280 °C hat. Die Steaks salzen und über der direkten Hitze 2 Minuten je Seite scharf angrillen; für ein Rautenmuster nach 1 Minute um 90 Grad drehen.',
        settings: [gasgrill('Direkt', 280, 'hoch', '1+2', { minutes: 4, note: 'heiße Seite' })],
      },
      {
        text: 'Die Steaks auf die kalte Seite über die ausgeschalteten Brenner ziehen, den Deckel schließen und indirekt 4 bis 8 Minuten garziehen lassen, bis das Thermometer im Kern 52 °C zeigt. Das ist medium-rare; beim Ruhen steigt die Temperatur noch um etwa 3 Grad. Für medium etwa 4 Grad später herausnehmen.',
        settings: [gasgrill('Indirekt', 250, 'hoch', '1+2', { minutes: 6, core: 52, note: 'Deckel zu, Steaks auf der kalten Seite' })],
      },
      {
        text: 'Die Steaks 5 Minuten ruhen lassen, mit der Kräuterbutter belegen und pfeffern. Die Kartoffeln längs aufschneiden, etwas auseinanderdrücken und mit der Schnittlauch-Sahne füllen.',
      },
    ],

    'ribeye-reverse-sear': [
      {
        text: 'Das Ribeye-Steak (4 bis 5 cm dick) trocken tupfen, rundum mit dem Salz einreiben und unabgedeckt auf einem Gitter mindestens 1 Stunde, am besten über Nacht, im Kühlschrank ruhen lassen. Dieses „Dry Brine“ würzt das Fleisch bis innen und trocknet die Oberfläche, damit sie später schneller bräunt. Ein Tomahawk (ca. 1,2 kg mit Knochen, beim Metzger vorbestellen) geht genauso und braucht im ersten Garschritt etwa 20 Minuten länger.',
      },
      {
        text: 'Den Gasgrill mit allen 4 Brennern auf hoch und geschlossenem Deckel 10 Minuten auf etwa 260 °C vorheizen und den Rost abbürsten. Dann nur Brenner 1 auf niedrig lassen und die übrigen drei Brenner ausschalten, bis sich das Deckelthermometer bei etwa 110 °C einpendelt. Wird es heißer, den Deckel einen Fingerbreit offen lassen.',
        settings: [vorheizen(), gasgrill('Indirekt', 110, 'niedrig', '1', { note: 'nur ein Brenner an' })],
      },
      {
        text: 'Das Steak auf die kalte Seite ganz rechts legen, ein Funkthermometer waagerecht in die dickste Stelle stecken und bei geschlossenem Deckel indirekt garen, bis der Kern 46 °C zeigt, etwa 45 bis 75 Minuten. Das Deckelthermometer ist nur ein grober Richtwert – die Kerntemperatur entscheidet. Sous-vide-Alternative: das gesalzene Steak vakuumieren und im CombiSteamer mit Vacuisine bei 54 °C 2,5 Stunden garen, dann aus dem Beutel nehmen und sehr gut trocken tupfen.',
        settings: [
          gasgrill('Indirekt', 110, 'niedrig', '1', { minutes: 60, core: 46, note: 'Deckel zu' }),
          { ...vakuum('Vakuumieren', 'Sous-vide-Variante'), alt: true },
          vzug('steamer', 'Vacuisine', 54, { minutes: 150, note: 'Sous-vide-Variante, Beutel Ebene 2', alt: true }),
        ],
      },
      {
        text: 'Das Steak kurz vom Rost nehmen, alle 4 Brenner auf hoch stellen und den Grill mit geschlossenem Deckel 10 Minuten auf etwa 280 °C aufheizen. Nach dem Reverse Sear muss das Steak vorher nicht ruhen.',
        settings: [gasgrill('Vorheizen', 280, 'hoch', 'alle', { minutes: 10, note: 'Deckel zu' })],
      },
      {
        text: 'Das Steak dünn mit dem Sonnenblumenöl bestreichen und über der direkten Hitze 1 bis 2 Minuten je Seite scharf angrillen, auch den Fettrand kurz aufstellen, bis der Kern 54 °C zeigt (medium-rare). Dabei Butter, angedrückten Knoblauch und Rosmarin in einer kleinen Gusseisenpfanne auf dem Rost aufschäumen und das Steak damit beträufeln.',
        settings: [gasgrill('Direkt', 280, 'hoch', 'alle', { minutes: 4, core: 54 })],
      },
      {
        text: 'Das Steak gegen die Faser in fingerdicke Scheiben schneiden, mit grobem Pfeffer bestreuen und sofort servieren. Rückwärts gegart ist es von Rand zu Rand gleichmäßig rosa, der graue Ring unter der Kruste bleibt hauchdünn.',
      },
    ],

    'shish-kebab': [
      {
        text: 'Die Rinderhüfte in 3 cm große Würfel schneiden. Olivenöl, Saft und abgeriebene Schale der Zitrone, 2 gepresste Zehen Knoblauch, Oregano, Kreuzkümmel, Paprikapulver, Salz und Pfeffer verrühren. Das Fleisch darin wenden und abgedeckt mindestens 2 Stunden, besser über Nacht, im Kühlschrank marinieren. So kennt man Shish Kebab aus den armenisch-griechischen Diners der USA.',
      },
      {
        text: 'Paprika rot und grün sowie die rote Zwiebel in 3 cm große Stücke schneiden, die Champignons putzen. Fleisch, Gemüse, Champignons und Kirschtomaten abwechselnd auf 6 Metallspieße stecken (Holzspieße vorher 1 Stunde wässern). Tipp: Wer es perfekt mag, steckt Fleisch und Gemüse auf getrennte Spieße, weil das Gemüse schneller gar ist.',
      },
      {
        text: 'Für den Reis-Pilaw die Butter in einem Topf auf dem BORA zerlassen und den Langkornreis darin 2 Minuten unter Rühren glasig rösten. Mit der Hühnerbrühe aufgießen, aufkochen und zugedeckt auf kleinster Stufe 15 Minuten quellen lassen.',
        settings: [bora('5', { minutes: 2 }), bora('Simmern', { minutes: 15, note: 'Deckel drauf' })],
      },
      {
        text: 'Den Joghurt mit der übrigen gepressten Knoblauchzehe, Salz und Pfeffer zu einer Sauce verrühren.',
      },
      {
        text: 'Den Gasgrill mit allen 4 Brennern auf hoch und geschlossenem Deckel 10 Minuten auf etwa 260 °C vorheizen, den Rost abbürsten und mit einem geölten Küchenpapier abreiben.',
        settings: [vorheizen()],
      },
      {
        text: 'Alle Brenner auf mittel stellen und die Spieße über der direkten Hitze 8 bis 10 Minuten grillen, dabei alle paar Minuten eine Vierteldrehung weiter wenden, bis das Fleisch außen gebräunt und innen noch rosa ist (Kern 57 °C, medium).',
        settings: [gasgrill('Direkt', 230, 'mittel', 'alle', { minutes: 10, core: 57 })],
      },
      {
        text: 'Die Spieße 3 Minuten ruhen lassen und mit dem Reis-Pilaw und der Joghurtsauce servieren.',
      },
    ],

    'chicken-thighs-alabama': [
      {
        text: 'Die Hähnchenschenkel trocken tupfen, am Gelenk einmal bis auf den Knochen einschneiden und rundum mit dem BBQ-Rub würzen. 30 Minuten oder abgedeckt über Nacht im Kühlschrank ziehen lassen.',
      },
      {
        text: 'Für die Alabama White Sauce Mayonnaise, Apfelessig, Meerrettich, den Saft der halben Zitrone, braunen Zucker, Cayennepfeffer, 1 TL grob gemahlenen Pfeffer und eine Prise Salz glatt rühren. Die Sauce stammt von Big Bob Gibson aus Decatur, Alabama (1925): Dort wird das gegrillte Hähnchen komplett hineingetaucht. Bis zum Servieren kalt stellen.',
      },
      {
        text: 'Den Gasgrill mit allen 4 Brennern auf hoch und geschlossenem Deckel 10 Minuten vorheizen und den Rost abbürsten. Dann Brenner 1 und 4 auf mittel stellen und die mittleren Brenner ausschalten: indirekte Hitze mit etwa 190 °C unter dem Deckel.',
        settings: [vorheizen(), gasgrill('Indirekt', 190, 'mittel', '1+4', { note: 'Mitte aus' })],
      },
      {
        text: 'Die Hähnchenschenkel mit der Hautseite nach oben in die Mitte legen und bei geschlossenem Deckel 35 bis 45 Minuten indirekt grillen, bis das Thermometer an der dicksten Stelle (nicht am Knochen) 80 °C zeigt. Keulenfleisch wird erst so richtig zart. Das Deckelthermometer ist nur ein Richtwert – die Kerntemperatur entscheidet.',
        settings: [gasgrill('Indirekt', 190, 'mittel', '1+4', { minutes: 40, core: 80, note: 'Deckel zu' })],
      },
      {
        text: 'Alle 4 Brenner auf hoch stellen und die Schenkel über der direkten Hitze 2 bis 3 Minuten je Seite grillen, bis die Haut knusprig ist. Tropfendes Fett flammt auf: Schenkel dann kurz zur Seite ziehen.',
        settings: [gasgrill('Direkt', 260, 'hoch', 'alle', { minutes: 6 })],
      },
      {
        text: 'Die heißen Schenkel nacheinander in die Hälfte der Alabama White Sauce tauchen, 5 Minuten ruhen lassen und die restliche Sauce dazu reichen. Dazu passen Coleslaw und Weißbrot.',
      },
    ],

    elote: [
      {
        text: 'Bei frischen Maiskolben Blätter und Fäden entfernen, vorgegarte Kolben nur trocken tupfen. Die Maiskolben dünn mit dem Sonnenblumenöl einreiben und leicht salzen.',
      },
      {
        text: 'Für die Creme Mayonnaise, saure Sahne, die gepresste Knoblauchzehe und den Saft einer halben Limette verrühren. Den Feta fein zerbröseln (Ersatz für den mexikanischen Cotija-Käse), den Koriander hacken und die zweite Limettenhälfte in Spalten schneiden.',
      },
      {
        text: 'Den Gasgrill mit allen 4 Brennern auf hoch und geschlossenem Deckel 10 Minuten auf etwa 260 °C vorheizen und den Rost abbürsten.',
        settings: [vorheizen()],
      },
      {
        text: 'Alle Brenner auf mittel stellen und die Kolben über der direkten Hitze 10 bis 12 Minuten grillen, dabei immer wieder ein Stück weiterdrehen, bis die Körner rundum gebräunt und stellenweise dunkel geröstet sind. Frische, rohe Kolben brauchen ein paar Minuten länger.',
        settings: [gasgrill('Direkt', 220, 'mittel', 'alle', { minutes: 12 })],
      },
      {
        text: 'Die heißen Kolben sofort rundum mit der Creme bestreichen, im Feta wälzen, mit geräuchertem Paprikapulver und Cayennepfeffer bestäuben (statt des mexikanischen Chilipulvers) und mit Koriander bestreuen. Mit den Limettenspalten servieren.',
      },
    ],

    'cajun-garnelen-spiesse': [
      {
        text: 'Die Garnelen über Nacht im Kühlschrank auftauen (oder im geschlossenen Beutel 20 Minuten in kaltes Wasser legen), bis auf das Schwanzende schälen, den dunklen Darm am Rücken entfernen und gut trocken tupfen.',
      },
      {
        text: 'Paprika rot und rote Zwiebel in 3 cm große Stücke schneiden. Die Garnelen mit dem Sonnenblumenöl und dem Cajun-Gewürz mischen und abwechselnd mit dem Gemüse auf 6 Spieße stecken. Jede Garnele oben und am Schwanz durchstechen, dann dreht sie sich beim Wenden nicht.',
      },
      {
        text: 'Den Wasserbehälter des CombiSteamers füllen. Den Langkornreis mit 225 ml Wasser und einer Prise Salz in einer flachen Schale auf den gelochten Garbehälter stellen und im CombiSteamer mit Dämpfen bei 100 °C 20 Minuten garen.',
        settings: [vzug('steamer', 'Dämpfen', 100, { minutes: 20, note: 'Ebene 2' })],
      },
      {
        text: 'Die Butter in einem kleinen Topf auf dem BORA schmelzen, den fein gehackten Knoblauch darin 2 Minuten sanft anschwitzen, vom Kochfeld nehmen und den Saft der Zitrone und die gehackte Petersilie unterrühren.',
        settings: [bora('3', { minutes: 2 })],
      },
      {
        text: 'Den Gasgrill mit allen 4 Brennern auf hoch und geschlossenem Deckel 10 Minuten auf etwa 260 °C vorheizen, den Rost abbürsten und einölen.',
        settings: [vorheizen()],
      },
      {
        text: 'Die Spieße über der direkten Hitze 2 bis 3 Minuten je Seite grillen, bis die Garnelen rosa und gerade nicht mehr glasig sind (Kern 60 °C) – länger werden sie zäh. Kurz vor Schluss mit etwas Knoblauchbutter bestreichen.',
        settings: [gasgrill('Direkt', 260, 'hoch', 'alle', { minutes: 5, core: 60 })],
      },
      {
        text: 'Die Spieße auf dem Reis anrichten und mit der restlichen Knoblauchbutter beträufeln.',
      },
    ],

    'cedar-plank-salmon': [
      {
        text: 'Eine unbehandelte Zedernholz-Planke (Grillzubehör, etwa 30 × 15 cm) mindestens 1 Stunde in Wasser einlegen und beschweren, damit sie untergeht. Nasses Holz brennt nicht, es raucht und gart den Fisch sanft von unten.',
      },
      {
        text: 'Braunen Zucker, Senf, Sojasauce, den gepressten Knoblauch und die abgeriebene Schale der Zitrone verrühren. Das Lachsfilet mit Haut trocken tupfen, salzen, pfeffern und die Oberseite mit der Glasur bestreichen.',
      },
      {
        text: 'Den Gasgrill mit allen 4 Brennern auf hoch und geschlossenem Deckel 10 Minuten vorheizen. Dann Brenner 1 und 2 auf mittel stellen und die beiden rechten Brenner ausschalten: Zwei-Zonen-Grill mit etwa 190 °C unter dem Deckel.',
        settings: [vorheizen(), gasgrill('Indirekt', 190, 'mittel', '1+2', { note: 'rechte Brenner aus' })],
      },
      {
        text: 'Die nasse Planke 3 bis 4 Minuten über die heißen Brenner 1 und 2 legen, bis sie knistert und leicht zu rauchen beginnt, dann wenden.',
        settings: [gasgrill('Direkt', 190, 'mittel', '1+2', { minutes: 4, note: 'Planke anrösten' })],
      },
      {
        text: 'Den Lachs mit der Hautseite nach unten auf die Planke legen, die Planke auf die kalte Seite ziehen und bei geschlossenem Deckel indirekt 20 bis 25 Minuten garen, bis der Kern 52 °C zeigt und der Lachs gerade beginnt zu blättern. Eine Sprühflasche mit Wasser bereithalten, falls der Rand der Planke Feuer fängt.',
        settings: [gasgrill('Indirekt', 190, 'mittel', '1+2', { minutes: 22, core: 52, note: 'Deckel zu, Planke auf der kalten Seite' })],
      },
      {
        text: 'Inzwischen den Wasserbehälter des CombiSteamers füllen, die grünen Bohnen putzen und im gelochten Garbehälter mit Dämpfen bei 100 °C 10 Minuten bissfest garen. Mit der Butter, Salz und Pfeffer schwenken.',
        settings: [vzug('steamer', 'Dämpfen', 100, { minutes: 10, note: 'gelochter Garbehälter' })],
      },
      {
        text: 'Den Lachs direkt auf der Planke servieren, mit gehacktem Dill bestreuen und mit Zitronenspalten und den Bohnen anrichten. Die Planke lässt sich abgebürstet ein- bis zweimal wiederverwenden.',
      },
    ],
  },
  imageQueries: {
    'beer-can-chicken': 'beer can chicken grill',
    'rumpsteak-gasgrill': 'new york strip steak baked potato',
    'ribeye-reverse-sear': 'reverse sear ribeye steak sliced',
    'shish-kebab': 'shish kebab beef skewers grill',
    'chicken-thighs-alabama': 'alabama white sauce grilled chicken',
    elote: 'elote mexican street corn',
    'cajun-garnelen-spiesse': 'cajun shrimp skewers grill',
    'cedar-plank-salmon': 'cedar plank salmon',
  },
}
