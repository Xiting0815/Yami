import { bbq } from '../../define'
import { bora, dutch, gasgrill, traeger, vakuum, vzug } from '../../device-helpers'
import type { DeviceSetting } from '../../../types'
import type { ExtraGroup } from '../types'

/** Airfryer (Heissluft 80–200 °C) */
const airfryerSetting = (temp: number, minutes: number, note?: string): DeviceSetting => ({
  device: 'airfryer',
  mode: 'Heissluft',
  temp,
  minutes,
  ...(note ? { note } : {}),
})

/**
 * BBQ · Beilagen (Pit Beans, Kartoffelsalat mit und ohne Mayo, Mac & Cheese vom Smoker und aus dem Topf, Coleslaw,
 * Cornbread, Biscuits, Hush Puppies, Southern Greens, Baked Potatoes …). Am selben Tag wie das Fleisch einplanen;
 * Pit Beans laufen unter dem Fleisch im Traeger mit. Regeln: docs/bbq-regeln.md.
 * Mengen: Salate/Slaws/Mac & Cheese für 4 Beilagen-Portionen (halten 2–4 Tage im Kühlschrank), Baked Potatoes für 2,
 * Cornbread 6 Stücke (Rest einzeln vakuumiert eingefroren). Grillmais macht die Grill-Gruppe (Elote) – hier nicht doppelt.
 */
export const beilagen: ExtraGroup = {
  recipes: [
    bbq('pit-beans', 'Pit Beans aus dem Smoker',
      { group: 'beilage', time: 180, portions: 4, eat: 4 },
      '2 Dose Weiße Bohnen | 100 g Speckwürfel | 1 Stk Zwiebel | 1 Stk Paprika grün | 150 ml BBQ-Sauce | 30 g Brauner Zucker | 1 EL Senf mittelscharf | 1 EL Apfelessig | 1 TL Paprikapulver geräuchert | Salz | Pfeffer',
      [
        'Die Speckwürfel in einer Pfanne auslassen, Zwiebel und Paprika gewürfelt zugeben und 4 Minuten anschwitzen.',
        'Die Bohnen abgießen und mit Speck, Gemüse, BBQ-Sauce, braunem Zucker, Senf, Apfelessig und geräuchertem Paprikapulver in einer Gusseisenpfanne oder Aluschale mischen.',
        'Offen bei 120 °C im Smoker 2 bis 3 Stunden unter das Fleisch stellen, damit Bratensaft hineintropft; jede Stunde umrühren.',
        'Mit Salz und Pfeffer abschmecken und heiß zum Fleisch servieren.',
      ]),

    // ───────────── Kartoffelsalat: mit Mayo (Südstaaten) und ohne Mayo (German-Style mit Speck-Vinaigrette) ─────────────
    bbq('southern-potato-salad', 'Southern Potato Salad mit Mayo, Senf und Ei',
      { group: 'beilage', time: 120, portions: 4, eat: 4, lighter: 'Die Hälfte der Mayonnaise durch Joghurt ersetzen – spart rund 100 kcal je Portion und schmeckt trotzdem cremig.' },
      '800 g Kartoffeln festkochend | 3 Stk Ei | 1 EL Apfelessig | 120 g Mayonnaise | 2 EL Senf mittelscharf | 1 TL Zucker | 2 Stk Staudensellerie | 0.5 Stk Zwiebel rot | 2 Stk Gewürzgurke | 1 TL Paprikapulver edelsüß | 0.5 Bund Schnittlauch | Salz | Pfeffer',
      [
        'Die Kartoffeln schälen, in 2 cm große Würfel schneiden und in Salzwasser 12 bis 15 Minuten gar kochen. Die Eier 10 Minuten hart kochen und kalt abschrecken.',
        'Die noch warmen Kartoffelwürfel mit dem Apfelessig und etwas Salz beträufeln – warm nehmen sie die Würze am besten auf – und abkühlen lassen.',
        'Mayonnaise, Senf, Zucker, Salz und Pfeffer verrühren. Staudensellerie, rote Zwiebel und Gewürzgurken fein würfeln (sie ersetzen das süße „Pickle Relish“), die Eier pellen und grob hacken.',
        'Alles vorsichtig mit den Kartoffeln mischen – ein paar zerfallene Ecken machen den Salat typisch cremig – und mindestens 1 Stunde kalt stellen. Mit Paprikapulver und Schnittlauch bestreuen.',
      ]),

    bbq('german-potato-salad-bacon', 'Warmer Kartoffelsalat mit Speck-Vinaigrette (ohne Mayo)',
      { group: 'beilage', time: 50, portions: 4, eat: 4 },
      '800 g Kartoffeln festkochend | 100 g Speckwürfel | 1 Stk Zwiebel | 80 ml Apfelessig | 100 ml Hühnerbrühe | 1 EL Zucker | 1 EL Senf grobkörnig | 0.5 Bund Petersilie | Salz | Pfeffer',
      [
        'Die Kartoffeln mit Schale in Salzwasser 20 bis 25 Minuten kochen, bis ein Messer leicht hineingleitet.',
        'Inzwischen die Speckwürfel in einer großen Pfanne langsam knusprig auslassen und herausnehmen, das Fett in der Pfanne lassen.',
        'Die Zwiebel fein würfeln und im Speckfett glasig dünsten. Apfelessig, Hühnerbrühe, Zucker und Senf zugeben und kurz einkochen – das ist die warme Speck-Vinaigrette.',
        'Die Kartoffeln heiß pellen, in Scheiben schneiden, sofort mit der heißen Vinaigrette mischen und 10 Minuten ziehen lassen.',
        'Speck und gehackte Petersilie unterheben, mit Salz und Pfeffer abschmecken und lauwarm servieren. In den USA heißt das „Hot German Potato Salad“ – deutsche Einwanderer haben ihn nach Texas und in den Mittleren Westen gebracht.',
      ]),

    // ───────────── Mac and Cheese: aus dem Smoker und klassisch aus dem Topf ─────────────
    bbq('smoked-mac-and-cheese', 'Smoked Mac and Cheese aus dem Traeger',
      { group: 'beilage', time: 90, portions: 4, eat: 4, lighter: 'Halb Milch, halb Gemüsebrühe für die Sauce und nur Cheddar (ohne Gouda) – spart rund 120 kcal je Portion.' },
      '250 g Nudeln | 30 g Butter | 25 g Weizenmehl | 500 ml Milch | 150 g Cheddar gerieben | 100 g Gouda gerieben | 1 TL Senf mittelscharf | 1 TL Paprikapulver geräuchert | 0.5 TL Knoblauchpulver | 30 g Panko | Salz | Pfeffer',
      [
        'Den Smoker auf 107 °C (225 °F) vorheizen. Die Nudeln (am besten kurze Hörnchennudeln) in Salzwasser 2 Minuten kürzer als auf der Packung angegeben kochen und abgießen.',
        'Die Butter in einem Topf schmelzen, das Mehl einrühren und 1 Minute anschwitzen. Die Milch nach und nach einrühren und 5 Minuten köcheln, bis die Sauce bindet.',
        'Vom Herd nehmen, Cheddar und Gouda bis auf je eine Handvoll einrühren, mit Senf, geräuchertem Paprikapulver, Knoblauchpulver, Salz und Pfeffer abschmecken. Die Nudeln untermischen und in eine Gusseisenpfanne füllen.',
        'Restlichen Käse und Panko darüberstreuen und offen 1 Stunde im Smoker garen, bis die Oberfläche goldgelb ist und Blasen wirft. 5 Minuten ruhen lassen.',
      ]),

    bbq('stovetop-mac-and-cheese', 'Stovetop Mac and Cheese (cremig aus dem Topf)',
      { group: 'beilage', time: 25, portions: 4, eat: 4, lighter: 'Mit 50 g weniger Cheddar und einer Handvoll gedämpftem Brokkoli unter den Nudeln wird es deutlich leichter.' },
      '250 g Nudeln | 250 ml Milch | 15 g Butter | 50 g Schmelzkäse | 150 g Cheddar gerieben | 0.5 TL Senf mittelscharf | 1 Prise Cayennepfeffer | Salz',
      [
        'Die Nudeln (am besten kurze Hörnchennudeln) in Salzwasser bissfest kochen und abgießen.',
        'Im selben Topf Milch und Butter erwärmen, aber nicht kochen. Bei kleiner Hitze den Schmelzkäse einrühren, bis er sich auflöst.',
        'Den Cheddar nach und nach einrühren, bis eine glatte Sauce entsteht; nicht mehr kochen lassen. Mit Senf, Cayennepfeffer und Salz abschmecken.',
        'Die Nudeln unterheben, kurz durchwärmen und sofort servieren.',
      ]),

    // ───────────── Coleslaw: cremig und mit Essig (Carolina) ─────────────
    bbq('creamy-coleslaw', 'Cremiger Coleslaw',
      { group: 'beilage', time: 80, portions: 4, eat: 4, lighter: 'Nur Joghurt statt Mayonnaise nehmen – spart rund 80 kcal je Portion.' },
      '500 g Weißkohl | 1 EL Zucker | 2 Stk Möhre | 80 g Mayonnaise | 80 g Joghurt natur | 2 EL Apfelessig | 1 TL Senf mittelscharf | Salz | Pfeffer',
      [
        'Den Weißkohl vierteln, den Strunk herausschneiden und den Kohl in sehr feine Streifen hobeln. Mit 1 TL Salz und dem Zucker kräftig verkneten, 10 Minuten ziehen lassen und das austretende Wasser gut ausdrücken – so bleibt der Coleslaw knackig und wird nicht wässrig.',
        'Die Möhren schälen und grob raspeln.',
        'Mayonnaise, Joghurt, Apfelessig und Senf verrühren, mit Pfeffer abschmecken und mit Kohl und Möhren mischen.',
        'Mindestens 1 Stunde kalt stellen. Passt klassisch auf Pulled-Pork-Sandwiches und hält 2 Tage im Kühlschrank.',
      ]),

    bbq('vinegar-slaw', 'Carolina Vinegar Slaw (ohne Mayo)',
      { group: 'beilage', time: 75, portions: 4, eat: 4 },
      '500 g Weißkohl | 1 Stk Möhre | 0.5 Stk Zwiebel rot | 80 ml Apfelessig | 2 EL Zucker | 1 TL Senf mittelscharf | 0.5 TL Chiliflocken | 2 EL Sonnenblumenöl | Salz | Pfeffer',
      [
        'Den Weißkohl ohne Strunk fein hobeln, die Möhre grob raspeln und die rote Zwiebel in hauchdünne Ringe schneiden.',
        'Apfelessig, Zucker, Senf, Chiliflocken und 1 TL Salz in einem kleinen Topf aufkochen, bis sich der Zucker gelöst hat. Vom Herd nehmen und das Sonnenblumenöl einrühren.',
        'Das warme Dressing über das Gemüse gießen, gut mischen und mindestens 1 Stunde kalt stellen; zwischendurch umrühren, der Kohl fällt dabei zusammen.',
        'Mit Pfeffer abschmecken. In North Carolina kommt der Slaw direkt aufs Pulled-Pork-Sandwich; in Lexington gehört ein Schuss Ketchup ins Dressing („Red Slaw“). Hält 4 Tage im Kühlschrank.',
      ]),

    // ───────────── Brot: Cornbread, Biscuits, Hush Puppies ─────────────
    bbq('skillet-cornbread', 'Southern Cornbread aus der Gusspfanne',
      {
        group: 'beilage', time: 50, portions: 6, eat: 2,
        leftover: { name: 'Cornbread (vakuumiert)', amount: 4, unit: 'Portion', portion: 1, shelf: 90 },
        lighter: 'Ein Stück Cornbread hat rund 270 kcal – zum Fleisch reicht eins pro Person; den Rest gleich einfrieren.',
      },
      '200 g Polenta | 350 ml Buttermilch | 80 g Weizenmehl | 1 TL Backpulver | 0.5 TL Backnatron | 1 EL Zucker | 50 g Butter | 2 Stk Ei | 1 EL Schweineschmalz | Salz',
      [
        'Den Backofen mit einer Gusseisenpfanne (ca. 25 cm) auf 220 °C Ober-/Unterhitze vorheizen.',
        'Polenta mit der Buttermilch verrühren und 10 Minuten quellen lassen (Polenta ist gröber als amerikanisches Cornmeal und wird so weicher). Weizenmehl, Backpulver, Backnatron, Zucker und 1 TL Salz mischen.',
        'Die Butter schmelzen, die Eier verquirlen und beides mit der Polenta-Buttermilch und der Mehlmischung nur kurz zu einem dicken Teig verrühren.',
        'Das Schweineschmalz in der heißen Pfanne schmelzen, den Teig hineingießen und 20 bis 25 Minuten goldbraun backen, bis ein Holzstäbchen sauber herauskommt.',
        'Kurz ruhen lassen, in 6 Stücke schneiden und warm mit Butter oder Honig servieren. Übrige Stücke abgekühlt einzeln einfrieren.',
      ]),

    bbq('buttermilk-biscuits', 'Buttermilk Biscuits',
      { group: 'beilage', time: 35, portions: 4, eat: 4, lighter: 'Ein Biscuit hat rund 200 kcal – zum Fleisch eins pro Person, die übrigen ungebacken einfrieren und bei Bedarf frisch backen.' },
      '250 g Weizenmehl | 2 TL Backpulver | 0.5 TL Backnatron | 1 TL Zucker | 90 g Butter | 180 ml Buttermilch | Salz',
      [
        'Den Backofen auf 220 °C Ober-/Unterhitze vorheizen. Weizenmehl, Backpulver, Backnatron, Zucker und 1 TL Salz mischen.',
        'Die Butter eiskalt in kleine Würfel schneiden und mit den Fingerspitzen schnell ins Mehl reiben, bis erbsengroße Stücke bleiben.',
        'Die kalte Buttermilch zugießen und nur so lange rühren, bis ein zottiger Teig entsteht. 2 cm dick drücken, dreimal falten und wieder flach drücken.',
        '8 Biscuits gerade ausstechen, ohne zu drehen, und dicht an dicht auf ein Blech mit Backpapier setzen.',
        'Etwa 14 Minuten goldbraun backen und warm servieren.',
      ]),

    bbq('hush-puppies', 'Hush Puppies aus dem Airfryer',
      { group: 'beilage', time: 35, portions: 4, eat: 4, lighter: 'Aus dem Airfryer haben Hush Puppies nur etwa halb so viel Fett wie frittiert.' },
      '150 g Polenta | 60 g Weizenmehl | 1 TL Backpulver | 0.5 TL Backnatron | 1 TL Zucker | 1 Prise Cayennepfeffer | 0.5 Stk Zwiebel | 2 Stk Frühlingszwiebel | 1 Stk Ei | 150 ml Buttermilch | Frittieröl | Salz',
      [
        'Polenta, Weizenmehl, Backpulver, Backnatron, Zucker, Cayennepfeffer und 1 TL Salz mischen. Die Zwiebel sehr fein würfeln, die Frühlingszwiebeln in feine Ringe schneiden.',
        'Ei und Buttermilch verquirlen, mit den Zwiebeln unter die trockenen Zutaten rühren und 10 Minuten quellen lassen. Der Teig muss auf dem Löffel stehen bleiben.',
        'Frittieröl im Topf auf 175 °C erhitzen und walnussgroße Kugeln mit zwei Teelöffeln portionsweise hineingeben.',
        'Je Portion 3 bis 4 Minuten goldbraun ausbacken, auf Küchenpapier abtropfen lassen und heiß servieren.',
      ]),

    // ───────────── Gemüse & Kartoffeln ─────────────
    bbq('southern-greens', 'Southern Greens mit Speck (Grünkohl statt Collard Greens)',
      { group: 'beilage', time: 75, portions: 4, eat: 4 },
      '500 g Grünkohl | 1 Stk Zwiebel | 2 Zehe Knoblauch | 100 g Speckwürfel | 400 ml Hühnerbrühe | 1 TL Brauner Zucker | 0.5 TL Chiliflocken | 2 EL Apfelessig | Salz | Pfeffer',
      [
        'Den Grünkohl waschen, die dicken Stiele herausschneiden und die Blätter grob zupfen. Zwiebel würfeln, Knoblauch hacken.',
        'Die Speckwürfel in einem schweren Topf knusprig auslassen, Zwiebel und Knoblauch kurz mitbraten.',
        'Den Grünkohl portionsweise zusammenfallen lassen, Hühnerbrühe, braunen Zucker und Chiliflocken zugeben und zugedeckt 50 Minuten weich schmoren.',
        'Mit Apfelessig, Salz und Pfeffer abschmecken. Die Brühe („Pot Likker“) gehört dazu – mit Cornbread auftunken.',
      ]),

    bbq('grill-baked-potatoes', 'Baked Potatoes vom Grill mit Sour Cream und Speck',
      { group: 'beilage', time: 80, portions: 2, eat: 2, lighter: 'Statt Saurer Sahne Kräuterquark nehmen und den Speck weglassen – spart rund 150 kcal je Kartoffel.' },
      '600 g Kartoffeln mehligkochend | 1 EL Olivenöl | 50 g Speckwürfel | 0.5 Bund Schnittlauch | 20 g Butter | 100 g Saure Sahne | 30 g Cheddar gerieben | Salz | Pfeffer',
      [
        'Zwei große Kartoffeln (je ca. 300 g) waschen, trocken reiben, mehrmals mit der Gabel einstechen und mit Olivenöl und grobem Salz einreiben.',
        'Bei etwa 200 °C indirekt mit geschlossenem Deckel 60 Minuten garen, bis ein Holzspieß ohne Widerstand hineingleitet.',
        'Inzwischen die Speckwürfel knusprig braten und den Schnittlauch in Röllchen schneiden.',
        'Die Kartoffeln längs einschneiden, aufdrücken und das Innere auflockern. Mit Butter, Salz und Pfeffer würzen, mit Saurer Sahne, Cheddar, Speck und Schnittlauch füllen.',
      ]),
  ],
  // Buttermilch legt rubs-saucen.ts an (dort parallel entstanden)
  catalog: {},
  products: {},
  nutrition: {},
  grams: {},
  deviceSteps: {
    'pit-beans': [
      {
        text: 'Die Speckwürfel in einer Pfanne auf dem BORA auslassen, Zwiebel und Paprika gewürfelt zugeben und 4 Minuten anschwitzen.',
        settings: [bora('5', { minutes: 4 })],
      },
      {
        text: 'Die weißen Bohnen abgießen und mit Speck, Gemüse, BBQ-Sauce, braunem Zucker, Senf, Apfelessig und geräuchertem Paprikapulver in einer Gusseisenpfanne oder Aluschale mischen.',
      },
      {
        text: 'Offen auf den unteren Rost des Traeger direkt unter das Fleisch stellen, damit Bratensaft hineintropft, und bei 121 °C (250 °F) 2 bis 3 Stunden mitgaren; jede Stunde umrühren.',
        settings: [traeger('Smoken', 250, { minutes: 150, note: 'unterer Rost, unter dem Fleisch' })],
      },
      { text: 'Mit Salz und Pfeffer abschmecken und heiß zum Fleisch servieren.' },
    ],
    'southern-potato-salad': [
      {
        text: 'Den Wasserbehälter des CombiSteamers füllen. Die Kartoffeln schälen, in 2 cm große Würfel schneiden und im gelochten Garbehälter bei 100 °C dämpfen; die Eier daneben legen, nach 11 Minuten herausnehmen und kalt abschrecken, die Kartoffeln nach 18 Minuten.',
        settings: [vzug('steamer', 'Dämpfen', 100, { minutes: 18, note: 'gelochter Garbehälter, Eier nach 11 Min. heraus' })],
      },
      { text: 'Die noch warmen Kartoffelwürfel mit dem Apfelessig und etwas Salz beträufeln – warm nehmen sie die Würze am besten auf – und abkühlen lassen.' },
      { text: 'Mayonnaise, Senf, Zucker, Salz und Pfeffer verrühren. Staudensellerie, rote Zwiebel und Gewürzgurken fein würfeln (sie ersetzen das süße „Pickle Relish“), die Eier pellen und grob hacken.' },
      { text: 'Alles vorsichtig mit den Kartoffeln mischen – ein paar zerfallene Ecken machen den Salat typisch cremig – und mindestens 1 Stunde kalt stellen. Mit Paprikapulver und Schnittlauch bestreuen.' },
    ],
    'german-potato-salad-bacon': [
      {
        text: 'Den Wasserbehälter des CombiSteamers füllen. Die Kartoffeln mit Schale im gelochten Garbehälter bei 100 °C 30 Minuten dämpfen, bis ein Messer leicht hineingleitet.',
        settings: [vzug('steamer', 'Dämpfen', 100, { minutes: 30, note: 'gelochter Garbehälter' })],
      },
      {
        text: 'Inzwischen die Speckwürfel in einer großen Pfanne auf dem BORA langsam knusprig auslassen und herausnehmen, das Fett in der Pfanne lassen.',
        settings: [bora('5', { minutes: 6 })],
      },
      {
        text: 'Die Zwiebel fein würfeln und im Speckfett 3 Minuten glasig dünsten. Apfelessig, Hühnerbrühe, Zucker und Senf zugeben, aufkochen und 2 Minuten einkochen – das ist die warme Speck-Vinaigrette.',
        settings: [bora('4', { minutes: 5 })],
      },
      { text: 'Die Kartoffeln heiß pellen, in Scheiben schneiden, sofort mit der heißen Vinaigrette mischen und 10 Minuten ziehen lassen.' },
      { text: 'Speck und gehackte Petersilie unterheben, mit Salz und Pfeffer abschmecken und lauwarm servieren. In den USA heißt das „Hot German Potato Salad“ – deutsche Einwanderer haben ihn nach Texas und in den Mittleren Westen gebracht.' },
    ],
    'smoked-mac-and-cheese': [
      {
        text: 'Den Traeger mit geschlossenem Deckel auf 107 °C (225 °F) vorheizen, Pellets Hickory oder Apfel. Die Nudeln (am besten kurze Hörnchennudeln, in den USA „Elbow Macaroni“) in Salzwasser 2 Minuten kürzer als auf der Packung angegeben kochen und abgießen – sie garen im Traeger weiter.',
        settings: [traeger('Vorheizen', 225, { minutes: 15, note: 'Deckel zu · Pellets Hickory oder Apfel' }), bora('Power', { note: 'Wasser aufkochen' }), bora('7', { note: 'Nudeln' })],
      },
      {
        text: 'Für die Käsesauce die Butter in einem Topf schmelzen, das Mehl einrühren und 1 Minute anschwitzen (eine helle Mehlschwitze, auf Englisch „Roux“). Die Milch nach und nach einrühren und 5 Minuten köcheln, bis die Sauce bindet.',
        settings: [bora('4', { minutes: 6 })],
      },
      { text: 'Den Topf vom Herd nehmen, Cheddar und Gouda bis auf je eine Handvoll einrühren, mit Senf, geräuchertem Paprikapulver, Knoblauchpulver, Salz und Pfeffer abschmecken. Die Nudeln untermischen und in eine Gusseisenpfanne oder Aluschale füllen.' },
      {
        text: 'Restlichen Käse und das Panko darüberstreuen. Offen in den Traeger stellen und bei 107 °C (225 °F) 60 Minuten garen, bis die Oberfläche goldgelb ist und Blasen wirft; läuft gerade Fleisch, auf den oberen Rost stellen. 5 Minuten ruhen lassen, damit die Sauce wieder anzieht.',
        settings: [traeger('Smoken', 225, { minutes: 60, note: 'oberer Rost, offen' })],
      },
    ],
    'stovetop-mac-and-cheese': [
      {
        text: 'Die Nudeln (am besten kurze Hörnchennudeln, in den USA „Elbow Macaroni“) in Salzwasser bissfest kochen und abgießen.',
        settings: [bora('Power', { note: 'Wasser aufkochen' }), bora('7', { note: 'Nudeln' })],
      },
      {
        text: 'Im selben Topf Milch und Butter erwärmen, aber nicht kochen. Bei kleiner Hitze den Schmelzkäse einrühren, bis er sich auflöst – er übernimmt die Rolle des amerikanischen „American Cheese“ und hält die Sauce glatt.',
        settings: [bora('3')],
      },
      {
        text: 'Den Cheddar nach und nach einrühren, bis eine glatte Sauce entsteht; nicht mehr kochen lassen, sonst flockt der Käse aus. Mit Senf, Cayennepfeffer und Salz abschmecken.',
        settings: [bora('2')],
      },
      { text: 'Die Nudeln unterheben, 1 Minute durchwärmen und sofort servieren – die Sauce zieht beim Stehen an; wird sie zu dick, einen Schuss Wasser einrühren.' },
    ],
    'vinegar-slaw': [
      { text: 'Den Weißkohl ohne Strunk fein hobeln, die Möhre grob raspeln und die rote Zwiebel in hauchdünne Ringe schneiden.' },
      {
        text: 'Apfelessig, Zucker, Senf, Chiliflocken und 1 TL Salz in einem kleinen Topf auf dem BORA aufkochen, bis sich der Zucker gelöst hat. Vom Herd nehmen und das Sonnenblumenöl einrühren.',
        settings: [bora('6', { note: 'aufkochen' })],
      },
      { text: 'Das warme Dressing über das Gemüse gießen, gut mischen und mindestens 1 Stunde kalt stellen; zwischendurch umrühren, der Kohl fällt dabei zusammen.' },
      { text: 'Mit Pfeffer abschmecken. In North Carolina kommt der Slaw direkt aufs Pulled-Pork-Sandwich; in Lexington gehört ein Schuss Ketchup ins Dressing („Red Slaw“). Hält 4 Tage im Kühlschrank.' },
    ],
    'skillet-cornbread': [
      {
        text: 'Den Gasgrill mit allen Brennern auf hoch und geschlossenem Deckel 10 Minuten vorheizen, dann Brenner 1 und 4 auf mittel stellen und die mittleren ausschalten (indirekt, etwa 220 °C am Deckelthermometer). Die Gusseisenpfanne (ca. 25 cm) in die Mitte stellen und mit aufheizen. Ohne Grill: die Pfanne im Combair bei 200 °C Heißluft mit vorheizen.',
        settings: [
          gasgrill('Vorheizen', 220, 'hoch', 'alle', { minutes: 10 }),
          gasgrill('Indirekt', 220, 'mittel', '1+4', { note: 'Pfanne mit aufheizen' }),
          vzug('combair', 'Heißluft', 200, { note: 'vorheizen, Pfanne Ebene 2', alt: true }),
        ],
      },
      { text: 'Die Polenta mit der Buttermilch verrühren und 10 Minuten quellen lassen – Polenta ist gröber als das amerikanische Cornmeal und wird so weicher. Weizenmehl, Backpulver, Backnatron, Zucker und 1 TL Salz mischen.' },
      {
        text: 'Die Butter auf dem BORA schmelzen, die Eier verquirlen und beides mit der Polenta-Buttermilch und der Mehlmischung nur kurz zu einem dicken Teig verrühren – Klümpchen sind in Ordnung.',
        settings: [bora('Schmelzen')],
      },
      {
        text: 'Das Schweineschmalz in die heiße Pfanne geben (Grillhandschuhe!), den Teig ins zischende Fett gießen – das gibt die typische knusprige Kruste – und indirekt bei geschlossenem Deckel 22 Minuten backen, bis die Oberfläche goldbraun ist und ein Holzstäbchen sauber herauskommt.',
        settings: [
          gasgrill('Indirekt', 220, 'mittel', '1+4', { minutes: 22, note: 'Deckel zu' }),
          vzug('combair', 'Heißluft', 200, { minutes: 22, note: 'Ebene 2', alt: true }),
        ],
      },
      {
        text: 'Kurz ruhen lassen, in 6 Stücke schneiden und warm mit Butter oder Honig servieren. Übrige Stücke abgekühlt einzeln vakuumieren und einfrieren; aufgetaut im Airfryer bei 160 °C 5 Minuten aufbacken.',
        settings: [vakuum('Vakuumieren', '4 Beutel à 1 Stück'), airfryerSetting(160, 5, 'aufgetaut aufbacken')],
      },
    ],
    'buttermilk-biscuits': [
      {
        text: 'Den Combair auf 220 °C Ober-/Unterhitze vorheizen (Ebene 2). Weizenmehl, Backpulver, Backnatron, Zucker und 1 TL Salz in einer Schüssel mischen.',
        settings: [vzug('combair', 'Ober-/Unterhitze', 220, { note: 'vorheizen, Ebene 2' })],
      },
      { text: 'Die Butter eiskalt in kleine Würfel schneiden (oder gefroren grob reiben) und mit den Fingerspitzen schnell ins Mehl reiben, bis erbsengroße Stücke bleiben – sie verdampfen beim Backen und machen die Biscuits locker und blättrig.' },
      { text: 'Die kalte Buttermilch zugießen und mit einer Gabel nur so lange rühren, bis ein zottiger Teig entsteht. Auf der bemehlten Arbeitsfläche 2 cm dick drücken, einmal falten, wieder flach drücken und noch zweimal falten – so entstehen die typischen Schichten.' },
      { text: '8 Biscuits mit einem Glas (6 cm) gerade ausstechen, nicht drehen (sonst gehen sie schief auf), und dicht an dicht auf ein Blech mit Backpapier setzen; Reste zusammendrücken und ebenfalls ausstechen.' },
      {
        text: 'Auf Ebene 2 im Combair 14 Minuten goldbraun backen und warm mit Butter, Honig oder zu Fried Chicken servieren.',
        settings: [vzug('combair', 'Ober-/Unterhitze', 220, { minutes: 14, note: 'Ebene 2' })],
      },
    ],
    'hush-puppies': [
      { text: 'Polenta, Weizenmehl, Backpulver, Backnatron, Zucker, Cayennepfeffer und 1 TL Salz mischen. Die Zwiebel sehr fein würfeln oder reiben, die Frühlingszwiebeln in feine Ringe schneiden.' },
      { text: 'Ei und Buttermilch verquirlen, mit den Zwiebeln unter die trockenen Zutaten rühren und 10 Minuten quellen lassen. Der Teig muss so fest sein, dass er auf dem Löffel stehen bleibt (sonst 1 bis 2 EL Polenta nachgeben).' },
      {
        text: 'Den Airfryer auf 190 °C vorheizen. Mit zwei Teelöffeln oder nassen Händen walnussgroße Kugeln formen, rundum mit Frittieröl einsprühen und mit Abstand in den Korb (mit gelochtem Backpapier) setzen.',
        settings: [airfryerSetting(190, 3, 'vorheizen')],
      },
      {
        text: 'In zwei Runden je 10 Minuten goldbraun backen, nach der Hälfte der Zeit wenden und nochmal einsprühen.',
        settings: [airfryerSetting(190, 10, 'je Runde, 1× wenden')],
      },
      {
        text: 'Klassisch frittiert: das Frittieröl im Topf auf 175 °C erhitzen (Thermometer) und die Kugeln portionsweise 3 bis 4 Minuten ausbacken. Heiß servieren – in den Südstaaten zu Fisch, Fried Chicken und BBQ.',
        settings: [bora('7', { note: 'nur beim Frittieren im Topf' })],
      },
    ],
    'southern-greens': [
      { text: 'Collard Greens (Blattkohl) gibt es bei uns kaum; Grünkohl kommt ihnen am nächsten, außerhalb der Saison passt Wirsing (dann nur 20 Minuten garen). Den Grünkohl waschen, die dicken Stiele herausschneiden und die Blätter grob zupfen. Zwiebel würfeln, Knoblauch hacken.' },
      {
        text: 'Den Dutch Oven auf mittlerer Flamme heiß werden lassen, die Speckwürfel 5 Minuten knusprig auslassen, Zwiebel und Knoblauch 3 Minuten mitbraten.',
        settings: [dutch('Anbraten', 'mittel', { minutes: 8, note: 'ohne Deckel' })],
      },
      {
        text: 'Den Grünkohl portionsweise zugeben und zusammenfallen lassen, Hühnerbrühe, braunen Zucker und Chiliflocken zugeben. Mit Deckel auf niedriger Flamme 50 Minuten schmoren, bis der Kohl weich ist; zwischendurch umrühren.',
        settings: [dutch('Schmoren', 'niedrig', { minutes: 50, note: 'Deckel zu' })],
      },
      { text: 'Mit Apfelessig, Salz und Pfeffer abschmecken. Die Brühe („Pot Likker“) gehört dazu – mit Cornbread auftunken.' },
    ],
    'grill-baked-potatoes': [
      {
        text: 'Den Gasgrill mit allen Brennern auf hoch und geschlossenem Deckel 10 Minuten vorheizen. Zwei große Kartoffeln (je ca. 300 g, mehligkochend – sie werden innen locker wie die amerikanischen Russets) waschen, trocken reiben, mehrmals mit der Gabel einstechen und mit Olivenöl und grobem Salz einreiben.',
        settings: [gasgrill('Vorheizen', 250, 'hoch', 'alle', { minutes: 10 })],
      },
      {
        text: 'Brenner 1 und 4 auf mittel stellen, die mittleren aus, und die Kartoffeln in die Mitte auf den Rost legen. Indirekt bei etwa 200 °C mit geschlossenem Deckel 60 Minuten garen, bis die Kerntemperatur 96 °C erreicht; das Deckelthermometer ist nur ein Richtwert – ein Holzspieß muss ohne Widerstand hineingleiten.',
        settings: [gasgrill('Indirekt', 200, 'mittel', '1+4', { minutes: 60, core: 96, note: 'Deckel zu' })],
      },
      {
        text: 'Inzwischen die Speckwürfel in einer Pfanne auf dem BORA knusprig braten und den Schnittlauch in Röllchen schneiden.',
        settings: [bora('5')],
      },
      { text: 'Die Kartoffeln längs einschneiden, von den Enden zur Mitte drücken, damit sie aufplatzen, und das Innere mit der Gabel auflockern. Mit Butter, Salz und Pfeffer würzen, mit Saurer Sahne, Cheddar, Speck und Schnittlauch füllen.' },
    ],
  },
  imageQueries: {
    'pit-beans': 'barbecue baked beans cast iron',
    'southern-potato-salad': 'southern potato salad mustard egg',
    'german-potato-salad-bacon': 'hot german potato salad bacon',
    'smoked-mac-and-cheese': 'smoked mac and cheese cast iron skillet',
    'stovetop-mac-and-cheese': 'stovetop macaroni and cheese',
    'creamy-coleslaw': 'creamy coleslaw',
    'vinegar-slaw': 'carolina vinegar coleslaw',
    'skillet-cornbread': 'skillet cornbread cast iron',
    'buttermilk-biscuits': 'buttermilk biscuits',
    'hush-puppies': 'hush puppies fried cornmeal',
    'southern-greens': 'southern collard greens bacon',
    'grill-baked-potatoes': 'loaded baked potato sour cream bacon',
  },
}
