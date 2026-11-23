import { bbq, prod } from '../../define'
import { bora, dutch, gasgrill, vzug } from '../../device-helpers'
import type { DeviceSetting } from '../../../types'
import type { ExtraGroup } from '../types'

/**
 * BBQ · Burger (Gasgrill direkt, Smash auf der Plancha, Pulled-Pork-Burger aus dem Vorrat …). Saucen/Rubs aus
 * rubs-saucen.ts als kaufbare Zutat nennen („BBQ-Sauce“, „Burgersauce“, „Ranch-Dressing“ …) – Selbstgemachtes wird
 * automatisch zuerst genommen, ebenso selbstgebackene Burger-Buns (brot.ts) für „Burger-Brötchen“.
 * Regeln: docs/bbq-regeln.md.
 */

/** Gasgrill: alle 4 Brenner hoch, Deckel zu, 10 Min. vorheizen */
const vorheizen = (temp: number, note = 'Deckel zu'): DeviceSetting => gasgrill('Vorheizen', temp, 'hoch', 'alle', { minutes: 10, note })

export const burger: ExtraGroup = {
  recipes: [
    bbq('bacon-cheeseburger-grill', 'Bacon-Cheeseburger vom Gasgrill',
      { group: 'burger', time: 40, portions: 2, eat: 2 },
      '360 g Rinderhackfleisch | 2 Stk Burger-Brötchen | 2 Scheibe Cheddar | 60 g Bacon | 1 Stk Tomate | 0.25 Stk Kopfsalat | 0.5 Stk Zwiebel rot | 1 Stk Gewürzgurke | 2 EL BBQ-Sauce | 1 EL Mayonnaise | Salz | Pfeffer',
      [
        'Das Hackfleisch ohne Kneten zu 2 Patties à 180 g formen, etwas größer als die Brötchen, mit einer Daumenmulde in der Mitte. Kalt stellen. Tomate, Zwiebel und Gewürzgurke in Scheiben schneiden, Salatblätter waschen.',
        'Den Grill sehr heiß vorheizen und den Rost bürsten.',
        'Die Patties salzen und pfeffern und 3 Minuten je Seite grillen, nur einmal wenden. Nach dem Wenden mit Cheddar belegen. Den Bacon daneben knusprig grillen.',
        'Die Brötchen auf den Schnittflächen kurz rösten. Mit Mayonnaise bestreichen und mit Salat, Tomate, Patty, Bacon, Zwiebel, Gurke und BBQ-Sauce belegen.',
      ]),

    bbq('smash-burger-plancha', 'Smash Burger von der Plancha mit Burger-Sauce',
      { group: 'burger', time: 35, portions: 2, eat: 2 },
      '360 g Rinderhackfleisch | 2 Stk Burger-Brötchen | 4 Scheibe Cheddar | 1 Stk Zwiebel | 2 Stk Gewürzgurke | 4 EL Burgersauce | 0.25 Stk Kopfsalat | 1 EL Butter | 1 EL Sonnenblumenöl | Salz | Pfeffer',
      [
        'Das Rinderhackfleisch (am besten mit ca. 20 % Fett) ohne Kneten zu 4 lockeren Kugeln à 90 g formen und kalt stellen. Die Zwiebel hauchdünn hobeln, die Gewürzgurken in Scheiben schneiden, den Salat waschen.',
        'Eine Plancha oder große Gusseisenpfanne auf den Grillrost legen und den Grill mit Deckel zu 10 Minuten sehr heiß vorheizen.',
        'Die Butter auf der Plancha schmelzen und die Brötchen mit der Schnittfläche nach unten kurz goldbraun rösten, herunternehmen.',
        'Die Plancha dünn ölen, 4 Kugeln mit Abstand auflegen, mit einem Stück Backpapier abdecken und mit einem schweren Wender sofort fest flach drücken („smashen“, ca. 1 cm dünn). Salzen, pfeffern und 2 Minuten braten, bis der Rand dunkelbraun und knusprig ist. Mit dem Wender samt Kruste abkratzen, wenden, Cheddar auflegen und 1 Minute fertig braten.',
        'Beide Brötchenhälften mit Burger-Sauce bestreichen und mit Salat, je 2 Patties übereinander, Zwiebeln und Gurken belegen.',
      ]),

    bbq('pulled-pork-burger', 'Pulled-Pork-Burger mit Coleslaw und Carolina-Vinegar-Sauce',
      { group: 'burger', time: 50, portions: 2, eat: 2 },
      '300 g Pulled Pork | 2 Stk Burger-Brötchen | 6 EL Carolina-Vinegar-Sauce | 200 g Weißkohl | 1 Stk Möhre | 2 EL Mayonnaise | 1 EL Apfelessig | 1 TL Zucker | 1 EL Butter | Salz | Pfeffer',
      [
        'Pulled Pork aus dem Vorrat am Vortag im Kühlschrank auftauen und im Beutel im Wasserbad bei 70 °C 30 Minuten erwärmen.',
        'Für den Coleslaw den Weißkohl fein hobeln, die Möhre raspeln, mit Salz und Zucker kräftig durchkneten. Mayonnaise, Apfelessig und Pfeffer unterrühren und 20 Minuten ziehen lassen.',
        'Das Pulled Pork aus dem Beutel nehmen, locker zupfen und mit 4 EL Vinegar Sauce mischen.',
        'Die Brötchen aufschneiden und in der Butter in der Pfanne goldbraun rösten.',
        'Das Pulled Pork auf die Unterhälften häufen, mit der übrigen Vinegar Sauce beträufeln, Coleslaw obenauf geben und den Deckel aufsetzen.',
      ]),

    bbq('brisket-burger', 'Brisket-Burger mit SPG, Pickled Onions und Chipotle-Mayo',
      { group: 'burger', time: 35, portions: 2, eat: 2 },
      '360 g Rinderbrust gewolft | 2 Stk Burger-Brötchen | 1 EL SPG-Rub | 2 Scheibe Cheddar | 60 g Rote Zwiebeln eingelegt | 3 EL Chipotle-Mayo | 1 Stk Tomate | 0.25 Stk Kopfsalat | 1 EL Butter',
      [
        'Die gewolfte Rinderbrust ohne Kneten zu 2 Patties à 180 g formen, mit Daumenmulde in der Mitte, und kalt stellen. Tomate in Scheiben schneiden, Salat waschen, die eingelegten Zwiebeln abtropfen lassen.',
        'Den Grill sehr heiß vorheizen und den Rost bürsten.',
        'Die Patties erst direkt vor dem Grillen rundum mit dem SPG-Rub bestreuen und 3 bis 4 Minuten je Seite grillen, nur einmal wenden. Nach dem Wenden mit Cheddar belegen. Kern mindestens 70 °C.',
        'Die Brötchen mit der Butter bestreichen und kurz rösten. Unten mit Chipotle-Mayo bestreichen und mit Salat, Tomate, Patty und Pickled Onions belegen.',
      ]),

    bbq('jalapeno-popper-burger', 'Jalapeño-Popper-Burger mit Frischkäse, Bacon und Ranch',
      { group: 'burger', time: 40, portions: 2, eat: 2 },
      '360 g Rinderhackfleisch | 2 Stk Burger-Brötchen | 60 g Bacon | 60 g Frischkäse | 40 g Cheddar gerieben | 40 g Jalapeños eingelegt | 3 EL Ranch-Dressing | 1 Stk Tomate | 0.25 Stk Kopfsalat | 1 EL Butter | Salz | Pfeffer',
      [
        'Das Hackfleisch ohne Kneten zu 2 Patties à 180 g formen, mit Daumenmulde, kalt stellen. Tomate in Scheiben schneiden, Salat waschen.',
        'Den Grill sehr heiß vorheizen. Den Bacon knusprig grillen, abkühlen lassen und zerbröseln.',
        'Für die „Popper“-Creme die Jalapeños hacken und mit Frischkäse, geriebenem Cheddar und dem Bacon verrühren – so schmeckt sie wie die beliebten gefüllten, überbackenen Jalapeño Poppers.',
        'Die Patties salzen, pfeffern und 3 Minuten grillen, wenden, die Creme daraufstreichen und mit geschlossenem Deckel weitere 3 bis 4 Minuten grillen, bis sie zerläuft. Kern mindestens 70 °C.',
        'Die Brötchen mit Butter bestreichen und kurz rösten, mit Ranch-Dressing, Salat, Tomate und Patty belegen.',
      ]),

    bbq('oklahoma-onion-burger', 'Oklahoma Onion Burger mit Carolina-Gold-Senfsauce',
      { group: 'burger', time: 35, portions: 2, eat: 2 },
      '360 g Rinderhackfleisch | 2 Stk Zwiebel | 2 Stk Burger-Brötchen | 4 Scheibe Cheddar | 3 Stk Gewürzgurke | 3 EL Honig-Senf-Sauce | 1 EL Sonnenblumenöl | Salz',
      [
        'Die Zwiebeln hauchdünn hobeln (Mandoline), mit 1 TL Salz mischen und 10 Minuten ziehen lassen, dann kräftig ausdrücken. Das Hackfleisch zu 4 lockeren Kugeln à 90 g formen, die Gurken in Scheiben schneiden.',
        'Eine Plancha oder Gusseisenpfanne auf dem Grill sehr heiß vorheizen.',
        'Die Plancha dünn ölen, die Kugeln auflegen, je eine dicke Handvoll Zwiebeln daraufgeben und mit einem schweren Wender fest flach drücken, sodass sich Zwiebeln und Fleisch verbinden. Salzen und 2 Minuten braten.',
        'Wenden, sodass die Zwiebeln unten karamellisieren, Cheddar auflegen und die Brötchenhälften direkt obenauf setzen, damit sie im Zwiebeldampf weich werden. 2 Minuten braten.',
        'Die Unterhälften mit der Senfsauce bestreichen, Gurken auflegen, je 2 Patties mit den Zwiebeln darauf stapeln und den gedämpften Deckel aufsetzen.',
      ]),

    bbq('mushroom-swiss-burger', 'Mushroom-Swiss-Burger mit Alabama White Sauce',
      { group: 'burger', time: 40, portions: 2, eat: 2 },
      '360 g Rinderhackfleisch | 2 Stk Burger-Brötchen | 250 g Champignons braun | 0.5 Stk Zwiebel | 20 g Butter | 2 Zweig Thymian | 1 EL Worcestersauce | 4 Scheibe Emmentaler | 4 EL Alabama White Sauce | 0.25 Stk Kopfsalat | Salz | Pfeffer',
      [
        'Die Champignons in Scheiben schneiden, die Zwiebel fein würfeln. Das Hackfleisch ohne Kneten zu 2 Patties à 180 g mit Daumenmulde formen und kalt stellen.',
        'Die Pilze in einer heißen Pfanne ohne Fett 5 Minuten scharf anbraten, bis sie Farbe haben. Butter, Zwiebel und Thymianblättchen zugeben und 3 Minuten weiterbraten, mit Worcestersauce ablöschen, salzen und pfeffern.',
        'Den Grill sehr heiß vorheizen. Die Patties salzen, pfeffern und 3 Minuten je Seite grillen. Nach dem Wenden die Pilze und je 2 Scheiben Emmentaler darauf verteilen und mit Deckel schmelzen lassen.',
        'Die Brötchen kurz rösten, mit Alabama White Sauce bestreichen und mit Salat und Patty belegen.',
      ]),

    bbq('bbq-bacon-burger-onion-rings', 'BBQ-Bacon-Burger mit Onion Rings',
      { group: 'burger', time: 50, portions: 2, eat: 2 },
      '360 g Rinderhackfleisch | 2 Stk Burger-Brötchen | 1 EL BBQ-Rub | 80 g Bacon | 2 Scheibe Cheddar | 4 EL BBQ-Sauce | 1 Stk Zwiebel | 150 ml Buttermilch | 50 g Weizenmehl | 60 g Panko | 1 TL Paprikapulver geräuchert | 1 EL Sonnenblumenöl | 0.25 Stk Kopfsalat | Salz',
      [
        'Für die Onion Rings die Zwiebel in 1 cm dicke Ringe schneiden und 15 Minuten in der Buttermilch einlegen. Das Mehl mit Paprikapulver und Salz mischen.',
        'Die Ringe abtropfen lassen, im Mehl wenden, nochmals durch die Buttermilch ziehen und im Panko wälzen. Mit Öl einsprühen und im Airfryer bei 200 °C 10 Minuten knusprig backen, nach der Hälfte wenden.',
        'Das Hackfleisch ohne Kneten zu 2 Patties à 180 g formen und rundum mit dem BBQ-Rub bestreuen. Den Grill sehr heiß vorheizen.',
        'Die Patties 3 Minuten je Seite grillen, nach dem Wenden mit BBQ-Sauce bestreichen und mit Cheddar belegen. Den Bacon daneben knusprig grillen. Kern mindestens 70 °C.',
        'Die Brötchen kurz rösten. Unten mit BBQ-Sauce, Salat, Patty, Bacon und 2 bis 3 Onion Rings belegen, die übrigen Ringe dazu servieren.',
      ]),

    bbq('nashville-hot-chicken-burger', 'Nashville Hot Chicken Burger mit Hot Honey',
      {
        group: 'burger',
        time: 180,
        portions: 2,
        eat: 2,
        lighter: 'Statt im Öl frittieren: die panierten Schenkel mit Öl einsprühen und im Airfryer bei 200 °C 18 bis 20 Minuten backen – spart rund 150 kcal pro Portion.',
      },
      '400 g Hähnchenschenkelfilet | 250 ml Buttermilch | 100 g Weizenmehl | 750 ml Frittieröl | 2 EL Cayennepfeffer | 1 EL Brauner Zucker | 1 TL Paprikapulver geräuchert | 1 TL Knoblauchpulver | 2 Stk Burger-Brötchen | 4 Stk Gewürzgurke | 3 EL Ranch-Dressing | 2 EL Chili-Honig | 0.25 Stk Kopfsalat | Salz | Pfeffer',
      [
        'Die Hähnchenschenkelfilets salzen, pfeffern und mindestens 2 Stunden (gern über Nacht) in der Buttermilch im Kühlschrank marinieren – die Milchsäure macht sie zart.',
        'Das Mehl mit Salz und Pfeffer mischen und 2 EL der Buttermilch hineinreiben, sodass kleine Klümpchen entstehen (die geben die zerklüftete Kruste). Die Schenkel abtropfen lassen, kräftig im Mehl wenden und 10 Minuten ruhen lassen.',
        'Das Frittieröl im Dutch Oven auf 165 °C erhitzen und die Schenkel in 2 Runden 6 bis 7 Minuten frittieren, einmal wenden, bis sie goldbraun sind. Kern mindestens 80 °C.',
        'Für die „Hot“-Paste 3 EL vom heißen Öl vorsichtig über Cayennepfeffer, braunen Zucker, Paprikapulver, Knoblauchpulver und 1 TL Salz gießen, verrühren und das Hähnchen damit bepinseln.',
        'Die Brötchen kurz rösten, unten mit Ranch-Dressing, Salat und Hähnchen belegen, Gewürzgurken auflegen und mit Hot Honey beträufeln.',
      ]),
  ],
  catalog: {
    fleisch: ['Rinderbrust gewolft'],
    konserven: ['Jalapeños eingelegt'],
  },
  products: {
    // beim Metzger: Rinderbrust (Brisket) durch die grobe Scheibe gewolft, ca. 20–25 % Fett
    'Rinderbrust gewolft': prod(500, 'g', 7.49, 2, 1, 'Pck'),
    'Jalapeños eingelegt': prod(200, 'g', 1.99, 365, 21, 'Glas'),
  },
  nutrition: {
    'Rinderbrust gewolft': [250, 18, 20, 0, 0],
    'Jalapeños eingelegt': [25, 1, 0.4, 4, 2.5],
  },
  grams: {
    'Jalapeños eingelegt': { EL: 15, Stk: 15 },
  },
  deviceSteps: {
    'bacon-cheeseburger-grill': [
      {
        text: 'Das Rinderhackfleisch ohne Kneten zu 2 Patties à 180 g formen, etwas größer als die Burger-Brötchen, mit einer Daumenmulde in der Mitte. Kalt stellen. Tomate, Zwiebel und Gewürzgurke in Scheiben schneiden, Kopfsalat-Blätter waschen.',
      },
      {
        text: 'Den Gasgrill mit allen 4 Brennern auf hoch und geschlossenem Deckel 10 Minuten auf etwa 260 °C vorheizen und den Rost abbürsten.',
        settings: [vorheizen(260)],
      },
      {
        text: 'Die Patties salzen und pfeffern und direkt über der Flamme 3 Minuten je Seite grillen, nur einmal wenden. Nach dem Wenden mit Cheddar belegen und den Deckel kurz schließen, bis er schmilzt. Den Bacon daneben knusprig grillen. Das Thermometer zeigt im Patty mindestens 70 °C.',
        settings: [gasgrill('Direkt', 260, 'hoch', 'alle', { minutes: 6, core: 70 })],
      },
      {
        text: 'Die Burger-Brötchen auf den Schnittflächen 30 Sekunden rösten. Unten mit Mayonnaise bestreichen und mit Salat, Tomate, Patty, Bacon, Zwiebel, Gurke und BBQ-Sauce belegen.',
      },
    ],
    'smash-burger-plancha': [
      {
        text: 'Das Rinderhackfleisch (am besten mit ca. 20 % Fett) ohne Kneten zu 4 lockeren Kugeln à 90 g formen und kalt stellen. Die Zwiebel hauchdünn hobeln, die Gewürzgurken in Scheiben schneiden, den Kopfsalat waschen.',
      },
      {
        text: 'Eine Plancha (Grillplatte aus Gusseisen) oder große Gusseisenpfanne auf den Rost legen und den Gasgrill mit allen 4 Brennern auf hoch und geschlossenem Deckel 10 Minuten auf etwa 290 °C vorheizen. Die Platte muss so heiß sein, dass ein Wassertropfen sofort zischend verdampft.',
        settings: [vorheizen(290, 'Plancha/Gusspfanne auf dem Rost, Deckel zu')],
      },
      {
        text: 'Die Butter auf der Plancha schmelzen und die Burger-Brötchen mit der Schnittfläche nach unten 30 Sekunden goldbraun rösten, herunternehmen.',
      },
      {
        text: 'Die Plancha dünn mit Sonnenblumenöl einpinseln, die 4 Kugeln mit Abstand auflegen, mit einem Stück Backpapier abdecken und mit einem schweren Wender sofort fest flach drücken („smashen“, ca. 1 cm dünn) – nur in den ersten Sekunden, danach nicht mehr drücken, sonst läuft der Saft heraus. Salzen, pfeffern und 2 Minuten braten, bis der Rand dunkelbraun und knusprig ist (die Kruste ist der ganze Trick). Mit dem Wender samt Kruste abkratzen, wenden, je eine Scheibe Cheddar auflegen und 1 Minute fertig braten. Die dünnen Patties sind dann durchgegart.',
        settings: [gasgrill('Direkt', 290, 'hoch', 'alle', { minutes: 3, note: 'Plancha, Deckel offen' })],
      },
      {
        text: 'Beide Brötchenhälften mit Burgersauce bestreichen und mit Kopfsalat, je 2 Patties übereinander, Zwiebel und Gewürzgurken belegen.',
      },
    ],
    'pulled-pork-burger': [
      {
        text: 'Das Pulled Pork aus dem Vorrat (vakuumierter Beutel) am Vortag im Kühlschrank auftauen. Den Beutel im CombiSteamer mit Vacuisine (Sous-vide-Garen) bei 70 °C 30 Minuten erwärmen. Gekauftes Pulled Pork nach Packungsangabe erwärmen.',
        settings: [vzug('steamer', 'Vacuisine', 70, { minutes: 30, note: 'Beutel aufgetaut, Ebene 2' })],
      },
      {
        text: 'Inzwischen für den Coleslaw (amerikanischer Krautsalat) den Weißkohl fein hobeln, die Möhre raspeln und beides mit Salz und Zucker kräftig durchkneten, bis der Kohl weicher wird. Mayonnaise, Apfelessig und Pfeffer unterrühren und 20 Minuten ziehen lassen.',
      },
      {
        text: 'Den Beutel aufschneiden, das Pulled Pork locker zupfen und mit 4 EL Carolina-Vinegar-Sauce mischen – die scharf-saure Essigsauce schneidet das Fett, typisch für North Carolina.',
      },
      {
        text: 'Die Burger-Brötchen aufschneiden und in der Butter in einer Pfanne auf dem BORA 2 Minuten goldbraun rösten.',
        settings: [bora('5', { minutes: 2 })],
      },
      {
        text: 'Das Pulled Pork auf die Unterhälften häufen, mit der übrigen Vinegar Sauce beträufeln, Coleslaw obenauf geben („Carolina Style“) und den Deckel aufsetzen.',
      },
    ],
    'brisket-burger': [
      {
        text: 'Die gewolfte Rinderbrust (beim Metzger durch die grobe Scheibe drehen lassen, ca. 20–25 % Fett – das gibt den saftigen, kräftigen Brisket-Geschmack) ohne Kneten zu 2 Patties à 180 g formen, mit einer Daumenmulde in der Mitte, und kalt stellen. Tomate in Scheiben schneiden, Kopfsalat waschen, die eingelegten roten Zwiebeln abtropfen lassen.',
      },
      {
        text: 'Den Gasgrill mit allen 4 Brennern auf hoch und geschlossenem Deckel 10 Minuten auf etwa 260 °C vorheizen und den Rost abbürsten.',
        settings: [vorheizen(260)],
      },
      {
        text: 'Die Patties erst direkt vor dem Grillen rundum mit dem SPG-Rub bestreuen (früher gesalzen wird Hack fest wie Wurst) und direkt über der Flamme 3 bis 4 Minuten je Seite grillen, nur einmal wenden. Nach dem Wenden mit Cheddar belegen und den Deckel kurz schließen. Das Thermometer zeigt im Patty mindestens 70 °C.',
        settings: [gasgrill('Direkt', 260, 'hoch', 'alle', { minutes: 7, core: 70 })],
      },
      {
        text: 'Die Burger-Brötchen mit der Butter bestreichen und 30 Sekunden auf dem Rost rösten. Unten mit Chipotle-Mayo bestreichen und mit Kopfsalat, Tomate, Patty und Pickled Onions belegen.',
      },
    ],
    'jalapeno-popper-burger': [
      {
        text: 'Das Rinderhackfleisch ohne Kneten zu 2 Patties à 180 g formen, mit einer Daumenmulde in der Mitte, und kalt stellen. Tomate in Scheiben schneiden, Kopfsalat waschen.',
      },
      {
        text: 'Den Gasgrill mit allen 4 Brennern auf hoch und geschlossenem Deckel 10 Minuten auf etwa 260 °C vorheizen und den Rost abbürsten.',
        settings: [vorheizen(260)],
      },
      {
        text: 'Den Bacon auf dem Rost 4 Minuten knusprig grillen, auf Küchenpapier abkühlen lassen und zerbröseln.',
        settings: [gasgrill('Direkt', 260, 'hoch', 'alle', { minutes: 4 })],
      },
      {
        text: 'Für die „Popper“-Creme die Jalapeños hacken und mit Frischkäse, Cheddar gerieben und dem Bacon verrühren – sie schmeckt wie die in Amerika beliebten, mit Frischkäse gefüllten und überbackenen Jalapeño Poppers.',
      },
      {
        text: 'Die Patties salzen, pfeffern und direkt über der Flamme 3 Minuten grillen, wenden, die Creme daraufstreichen und mit geschlossenem Deckel weitere 3 bis 4 Minuten grillen, bis sie zerläuft. Das Thermometer zeigt im Patty mindestens 70 °C.',
        settings: [gasgrill('Direkt', 260, 'hoch', 'alle', { minutes: 7, core: 70, note: 'nach dem Wenden Deckel zu' })],
      },
      {
        text: 'Die Burger-Brötchen mit Butter bestreichen und 30 Sekunden rösten. Unten mit Ranch-Dressing bestreichen und mit Kopfsalat, Tomate und Patty belegen.',
      },
    ],
    'oklahoma-onion-burger': [
      {
        text: 'Die Zwiebeln hauchdünn hobeln (Mandoline), mit 1 TL Salz mischen, 10 Minuten ziehen lassen und kräftig ausdrücken – so bräunen sie schneller. Das Rinderhackfleisch zu 4 lockeren Kugeln à 90 g formen, die Gewürzgurken in Scheiben schneiden. Der Onion Burger stammt aus El Reno, Oklahoma: In der Wirtschaftskrise der 1920er streckte man das teure Fleisch mit viel Zwiebel.',
      },
      {
        text: 'Eine Plancha oder große Gusseisenpfanne auf den Rost legen und den Gasgrill mit allen 4 Brennern auf hoch und geschlossenem Deckel 10 Minuten auf etwa 260 °C vorheizen.',
        settings: [vorheizen(260, 'Plancha/Gusspfanne auf dem Rost, Deckel zu')],
      },
      {
        text: 'Die Plancha dünn mit Sonnenblumenöl einpinseln, die Kugeln auflegen, je eine dicke Handvoll Zwiebeln daraufgeben und mit einem schweren Wender fest flach drücken, sodass sich Zwiebeln und Fleisch verbinden. Salzen und 2 Minuten braten, bis die Unterseite eine dunkle Kruste hat.',
        settings: [gasgrill('Direkt', 260, 'hoch', 'alle', { minutes: 2, note: 'Plancha' })],
      },
      {
        text: 'Wenden, sodass die Zwiebeln unten auf der Platte karamellisieren, Cheddar auflegen und die Brötchenhälften der Burger-Brötchen direkt obenauf setzen, damit sie im Zwiebeldampf weich werden. 2 Minuten braten, bis die Zwiebeln goldbraun sind.',
        settings: [gasgrill('Direkt', 260, 'hoch', 'alle', { minutes: 2, note: 'Plancha' })],
      },
      {
        text: 'Die Unterhälften mit der Honig-Senf-Sauce (Carolina Gold) bestreichen – in El Reno gehören Senf und Gurke drauf –, Gurken auflegen, je 2 Patties mit den Zwiebeln darauf stapeln und den gedämpften Deckel aufsetzen.',
      },
    ],
    'mushroom-swiss-burger': [
      {
        text: 'Die Champignons in Scheiben schneiden, die Zwiebel fein würfeln. Das Rinderhackfleisch ohne Kneten zu 2 Patties à 180 g mit einer Daumenmulde formen und kalt stellen.',
      },
      {
        text: 'Die Pilze in einer heißen Pfanne auf dem BORA ohne Fett 5 Minuten scharf anbraten, bis sie Farbe haben (erst dann geben sie kein Wasser mehr ab). Butter, Zwiebel und Thymianblättchen zugeben, 3 Minuten weiterbraten, mit Worcestersauce ablöschen, salzen und pfeffern. Warm halten.',
        settings: [bora('8', { minutes: 5, note: 'Pfanne vorheizen' }), bora('5', { minutes: 3 })],
      },
      {
        text: 'Den Gasgrill mit allen 4 Brennern auf hoch und geschlossenem Deckel 10 Minuten auf etwa 260 °C vorheizen und den Rost abbürsten.',
        settings: [vorheizen(260)],
      },
      {
        text: 'Die Patties salzen, pfeffern und direkt über der Flamme 3 Minuten je Seite grillen. Nach dem Wenden die Pilze und je 2 Scheiben Emmentaler (unser „Swiss Cheese“) darauf verteilen und mit geschlossenem Deckel schmelzen lassen. Das Thermometer zeigt im Patty mindestens 70 °C.',
        settings: [gasgrill('Direkt', 260, 'hoch', 'alle', { minutes: 6, core: 70 })],
      },
      {
        text: 'Die Burger-Brötchen 30 Sekunden rösten, beide Hälften mit Alabama White Sauce bestreichen und mit Kopfsalat und Patty belegen.',
      },
    ],
    'bbq-bacon-burger-onion-rings': [
      {
        text: 'Für die Onion Rings die Zwiebel (am besten eine große Gemüsezwiebel) in 1 cm dicke Ringe schneiden, die Ringe trennen und 15 Minuten in der Buttermilch einlegen. Das Weizenmehl mit geräuchertem Paprikapulver und Salz mischen.',
      },
      {
        text: 'Die Ringe abtropfen lassen, im Mehl wenden, nochmals durch die Buttermilch ziehen und im Panko wälzen. Den Airfryer vorheizen, die Ringe nebeneinander in den Korb legen, mit Sonnenblumenöl einsprühen und bei 200 °C knusprig backen, nach der Hälfte der Zeit wenden.',
        settings: [{ device: 'airfryer', mode: 'Heissluft', temp: 200, minutes: 10, note: 'vorheizen, nach der Hälfte wenden' }],
      },
      {
        text: 'Das Rinderhackfleisch ohne Kneten zu 2 Patties à 180 g formen und rundum mit dem BBQ-Rub bestreuen. Den Gasgrill mit allen 4 Brennern auf hoch und geschlossenem Deckel 10 Minuten auf etwa 260 °C vorheizen und den Rost abbürsten.',
        settings: [vorheizen(260)],
      },
      {
        text: 'Die Patties direkt über der Flamme 3 Minuten je Seite grillen, nach dem Wenden mit etwas BBQ-Sauce bestreichen und mit Cheddar belegen, Deckel kurz schließen. Den Bacon daneben knusprig grillen. Das Thermometer zeigt im Patty mindestens 70 °C.',
        settings: [gasgrill('Direkt', 260, 'hoch', 'alle', { minutes: 6, core: 70 })],
      },
      {
        text: 'Die Burger-Brötchen 30 Sekunden rösten. Unten mit der restlichen BBQ-Sauce bestreichen und mit Kopfsalat, Patty, Bacon und 2 bis 3 Onion Rings belegen, die übrigen Ringe dazu servieren.',
      },
    ],
    'nashville-hot-chicken-burger': [
      {
        text: 'Die Hähnchenschenkelfilets salzen, pfeffern und mindestens 2 Stunden (gern über Nacht) in der Buttermilch im Kühlschrank marinieren – die Milchsäure macht das Fleisch zart. Schenkel bleiben beim Frittieren saftiger als Brust.',
      },
      {
        text: 'Das Weizenmehl mit Salz und Pfeffer mischen und 2 EL der Buttermilch-Marinade mit den Fingern hineinreiben, sodass kleine Klümpchen entstehen – die geben die typisch zerklüftete, krosse Kruste. Die Schenkel abtropfen lassen, kräftig im Mehl wenden, gut andrücken und 10 Minuten ruhen lassen.',
      },
      {
        text: 'Das Frittieröl im Dutch Oven (ca. 4,5 l) auf dem Gasbrenner mit einem Thermometer auf 165 °C erhitzen und die Temperatur mit der Flamme halten. Die Schenkel in 2 Runden 6 bis 7 Minuten frittieren, einmal wenden, bis sie tief goldbraun sind. Kern mindestens 80 °C. Auf einem Gitter abtropfen lassen. Heißes Öl nie unbeaufsichtigt lassen und kein Wasser in die Nähe bringen.',
        settings: [dutch('Anbraten', 'mittel', { minutes: 14, core: 80, note: 'Öl 165 °C mit Thermometer, ohne Deckel' })],
      },
      {
        text: 'Für die „Hot“-Paste (das Markenzeichen aus Nashville, Tennessee) 3 EL vom heißen Frittieröl mit einer Kelle vorsichtig über Cayennepfeffer, braunen Zucker, geräuchertes Paprikapulver, Knoblauchpulver und 1 TL Salz in einer hitzefesten Schüssel gießen, verrühren und das Hähnchen damit rundum bepinseln.',
      },
      {
        text: 'Die Burger-Brötchen kurz rösten. Unten mit Ranch-Dressing bestreichen, mit Kopfsalat und dem Hähnchen belegen, die Gewürzgurken auflegen und mit dem Hot Honey (Chili-Honig) beträufeln.',
      },
    ],
  },
  imageQueries: {
    'bacon-cheeseburger-grill': 'bacon cheeseburger grilled',
    'smash-burger-plancha': 'smash burger',
    'pulled-pork-burger': 'pulled pork sandwich coleslaw',
    'brisket-burger': 'brisket burger pickled onions',
    'jalapeno-popper-burger': 'jalapeno popper burger',
    'oklahoma-onion-burger': 'oklahoma onion burger',
    'mushroom-swiss-burger': 'mushroom swiss burger',
    'bbq-bacon-burger-onion-rings': 'bbq bacon burger onion rings',
    'nashville-hot-chicken-burger': 'nashville hot chicken sandwich',
  },
}
