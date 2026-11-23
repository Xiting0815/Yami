import { backen, prod } from '../../define'
import { bora } from '../../device-helpers'
import type { ExtraGroup } from '../types'

/**
 * BBQ · Rubs & Saucen (Grundrezepte): selbstgemacht auf Vorrat, kommen bei „Fertig gekocht“ in den Vorrat und werden in
 * BBQ-/Burger-Rezepten zuerst genommen (`substitutes.preferred`); das Fertigprodukt bleibt Ersatz (gleiche Austausch-Gruppe).
 * Anlegen mit `backen('grundrezept', id, titel, { cuisine: 'us', bbq: 'rub', time, yields: { …, cat } }, zutaten, schritte)`.
 * Regeln: docs/bbq-regeln.md. Neue Gewürze hier unter `spices` (+ catalog.vorrat, products, nutrition, grams).
 *
 * Kaufbare Grundnamen für die Rezepte der anderen Gruppen (Selbstgemachtes wird automatisch zuerst genommen):
 *   'BBQ-Rub' (Memphis-Rub, Magic Dust) · 'SPG-Rub' (Texas SPG) · 'Cajun-Gewürz' · 'BBQ-Sauce' (Kansas City)
 *   'Honig-Senf-Sauce' (Carolina Gold) · 'Carolina-Vinegar-Sauce' · 'Alabama White Sauce' · 'Burgersauce'
 *   'Chipotle-Mayo' · 'Ranch-Dressing' · 'Rote Zwiebeln eingelegt' · 'Chili-Honig' (Hot Honey)
 */
export const rubsSaucen: ExtraGroup = {
  recipes: [
    backen('grundrezept', 'kc-bbq-sauce', 'Kansas-City-BBQ-Sauce',
      {
        cuisine: 'us',
        bbq: 'rub',
        time: 35,
        yields: { name: 'BBQ-Sauce selbstgemacht', amount: 600, unit: 'ml', shelf: 28, store: 'im Kühlschrank (Glas mit Deckel)', frozen: 90, cat: 'vorrat' },
      },
      '20 g Butter | 1 Stk Zwiebel | 2 Zehe Knoblauch | 400 ml Tomatenketchup | 80 g Brauner Zucker | 3 EL Zuckerrübensirup | 80 ml Apfelessig | 2 EL Worcestersauce | 1 EL Senf mittelscharf | 1 EL Paprikapulver geräuchert | 1 TL Knoblauchpulver | 1 TL Zwiebelpulver | 0.5 TL Cayennepfeffer | Pfeffer | Salz',
      [
        'Zwiebel und Knoblauch sehr fein würfeln und in der Butter im Topf bei kleiner Hitze 5 Minuten glasig dünsten.',
        'Tomatenketchup, braunen Zucker, Zuckerrübensirup, Apfelessig, Worcestersauce, Senf und 100 ml Wasser einrühren. Mit geräuchertem Paprikapulver, Knoblauchpulver, Zwiebelpulver, Cayennepfeffer und reichlich Pfeffer würzen.',
        'Aufkochen und offen bei kleiner Hitze 20 bis 25 Minuten dicklich einköcheln lassen, dabei oft umrühren, weil die Sauce leicht ansetzt. Mit Salz, Essig und Zucker süß-sauer-rauchig abschmecken.',
        'Für eine glatte Sauce pürieren, heiß in saubere Gläser füllen, verschließen und abkühlen lassen. Im Kühlschrank hält sie ca. 4 Wochen, eingefroren ca. 3 Monate.',
      ]),

    backen('grundrezept', 'memphis-rub', 'Memphis-Rub (Allround-Rub für Pork & Ribs)',
      {
        cuisine: 'us',
        bbq: 'rub',
        time: 10,
        yields: { name: 'BBQ-Rub selbstgemacht', amount: 160, unit: 'g', shelf: 180, store: 'luftdicht und dunkel im Schraubglas', cat: 'vorrat' },
      },
      '60 g Brauner Zucker | 4 EL Paprikapulver geräuchert | 2 EL Paprikapulver edelsüß | 2 EL Salz | 1 EL Pfeffer schwarz grob | 1 EL Knoblauchpulver | 1 EL Zwiebelpulver | 1 TL Kreuzkümmel | 1 TL Cayennepfeffer',
      [
        'Den Kreuzkümmel in einer trockenen Pfanne bei mittlerer Hitze unter Rühren kurz anrösten, bis er duftet, und sofort auf einen Teller geben, damit er nicht bitter wird.',
        'Den braunen Zucker in einer Schüssel mit den Fingern zerreiben, bis keine Klümpchen mehr da sind.',
        'Geräuchertes und edelsüßes Paprikapulver, Salz, groben Pfeffer, Knoblauchpulver, Zwiebelpulver, den abgekühlten Kreuzkümmel und Cayennepfeffer zugeben und gründlich vermischen.',
        'In ein sauberes, trockenes Schraubglas füllen und dunkel lagern (hält ca. 6 Monate). Faustregel: 2 bis 3 EL Rub je Kilo Fleisch, für Pulled Pork über Nacht einziehen lassen.',
      ]),

    backen('grundrezept', 'texas-spg', 'Texas SPG (Salz-Pfeffer-Knoblauch für Brisket & Steak)',
      {
        cuisine: 'us',
        bbq: 'rub',
        time: 5,
        yields: { name: 'SPG-Rub selbstgemacht', amount: 140, unit: 'g', shelf: 180, store: 'luftdicht und dunkel im Schraubglas', cat: 'vorrat' },
      },
      '60 g Pfeffer schwarz grob | 60 g Salz | 20 g Knoblauchpulver',
      [
        'Groben schwarzen Pfeffer, Salz und Knoblauchpulver in einem Schraubglas gründlich mischen. Am besten sind grobes Meersalz und Pfeffer in „16 Mesh“ (grob geschrotet, wie Steakpfeffer) – so haftet der Rub und bildet auf Brisket die typische dunkle Kruste („Bark“).',
        'In Texas heißt das schlicht „SPG“; ohne Knoblauch ist es der klassische „Dalmatian Rub“ aus halb Salz, halb Pfeffer. Faustregel: rundum gleichmäßig bestreuen, bis das Fleisch wie gesprenkelt aussieht (ca. 2 EL je Kilo).',
        'Verschlossen und dunkel lagern; der Pfeffer verliert nach ca. 6 Monaten deutlich an Aroma.',
      ]),

    backen('grundrezept', 'magic-dust', 'Magic Dust (All-Purpose-Rub nach Mike Mills)',
      {
        cuisine: 'us',
        bbq: 'rub',
        time: 10,
        yields: { name: 'Magic Dust selbstgemacht', amount: 170, unit: 'g', shelf: 180, store: 'luftdicht und dunkel im Schraubglas', cat: 'vorrat' },
      },
      '4 EL Paprikapulver edelsüß | 2 EL Paprikapulver geräuchert | 2 EL Salz | 2 EL Zucker | 2 EL Kreuzkümmel | 2 EL Knoblauchpulver | 1 EL Senfpulver | 1 EL Pfeffer schwarz grob | 1 TL Cayennepfeffer',
      [
        'Magic Dust ist der berühmte Allround-Rub des Memphis-Pitmasters Mike Mills: weniger süß als ein Memphis-Rub, dafür würziger durch Kreuzkümmel und Senfpulver – passt zu Schwein, Hähnchen und auf Pommes.',
        'Den Kreuzkümmel in einer trockenen Pfanne bei mittlerer Hitze unter Rühren kurz anrösten, bis er duftet, und auf einem Teller abkühlen lassen.',
        'Edelsüßes und geräuchertes Paprikapulver, Salz, Zucker, den Kreuzkümmel, Knoblauchpulver, Senfpulver, groben Pfeffer und Cayennepfeffer in einer Schüssel gründlich vermischen.',
        'In ein trockenes Schraubglas füllen und dunkel lagern (hält ca. 6 Monate). Für Ribs und Hähnchen 1 bis 2 EL je Kilo, dünn über Senf als Haftgrund.',
      ]),

    backen('grundrezept', 'cajun-gewuerz', 'Cajun-Gewürz (Louisiana-Mischung)',
      {
        cuisine: 'us',
        bbq: 'rub',
        time: 5,
        yields: { name: 'Cajun-Gewürz selbstgemacht', amount: 110, unit: 'g', shelf: 180, store: 'luftdicht und dunkel im Schraubglas', cat: 'vorrat' },
      },
      '3 EL Paprikapulver edelsüß | 2 EL Salz | 1 EL Knoblauchpulver | 1 EL Zwiebelpulver | 1 EL Pfeffer | 1 TL Pfeffer weiß | 2 TL Cayennepfeffer | 1 EL Oregano getrocknet | 1 EL Thymian getrocknet',
      [
        'Oregano und Thymian zwischen den Fingern fein zerreiben, damit sich die Kräuter gleichmäßig verteilen.',
        'Mit Paprikapulver, Salz, Knoblauchpulver, Zwiebelpulver, schwarzem Pfeffer, weißem Pfeffer und Cayennepfeffer in einem Schraubglas gründlich mischen. Weißer und schwarzer Pfeffer zusammen mit Cayenne geben die typische Louisiana-Schärfe in drei Stufen.',
        'Dunkel lagern (hält ca. 6 Monate). Für Jambalaya, Gumbo und Blackened Chicken; da schon Salz drin ist, beim Kochen erst am Ende nachsalzen.',
      ]),

    backen('grundrezept', 'carolina-gold-sauce', 'Carolina Gold (Senf-BBQ-Sauce aus South Carolina)',
      {
        cuisine: 'us',
        bbq: 'rub',
        time: 20,
        yields: { name: 'Carolina-Gold-Sauce selbstgemacht', amount: 350, unit: 'ml', shelf: 28, store: 'im Kühlschrank (Glas mit Deckel)', cat: 'vorrat' },
      },
      '200 ml Senf mittelscharf | 80 ml Apfelessig | 50 g Brauner Zucker | 2 EL Honig | 1 EL Worcestersauce | 15 g Butter | 1 TL Knoblauchpulver | 0.5 TL Cayennepfeffer | Pfeffer | Salz',
      [
        'Senf, Apfelessig, braunen Zucker, Honig und Worcestersauce in einem kleinen Topf glatt rühren. Amerikanischer „Yellow Mustard“ ist milder als deutscher Senf mittelscharf – wer es sanfter mag, nimmt ein Viertel süßen Senf dazu.',
        'Knoblauchpulver, Cayennepfeffer und reichlich Pfeffer einrühren und die Sauce bei kleiner Hitze 10 Minuten leise köcheln lassen, dabei oft rühren.',
        'Vom Herd nehmen, die Butter einrühren und mit Salz, Zucker und Essig süß-scharf-säuerlich abschmecken. Heiß in ein sauberes Glas füllen; im Kühlschrank hält sie ca. 4 Wochen. Klassisch zu Pulled Pork, Hähnchen und Burgern.',
      ]),

    backen('grundrezept', 'carolina-vinegar-sauce', 'Eastern Carolina Vinegar Sauce',
      {
        cuisine: 'us',
        bbq: 'rub',
        time: 10,
        yields: { name: 'Carolina-Vinegar-Sauce selbstgemacht', amount: 300, unit: 'ml', shelf: 90, store: 'im Kühlschrank (Flasche oder Glas)', cat: 'vorrat' },
      },
      '300 ml Apfelessig | 1 EL Brauner Zucker | 1 EL Chiliflocken | 1 TL Cayennepfeffer | 1 TL Pfeffer schwarz grob | 2 TL Salz',
      [
        'Die dünne, scharf-saure Essigsauce aus dem Osten North Carolinas ist die älteste BBQ-Sauce der USA: kein Ketchup, nur Essig und Chili. Sie wird unter gezupftes Schweinefleisch gemischt und schneidet das Fett.',
        'Den Apfelessig mit braunem Zucker und Salz in einem kleinen Topf nur erwärmen, bis sich Zucker und Salz gelöst haben – nicht kochen.',
        'Chiliflocken, Cayennepfeffer und groben Pfeffer einrühren, abkühlen lassen und in eine saubere Flasche füllen. Mindestens einen Tag durchziehen lassen; im Kühlschrank hält sie ca. 3 Monate.',
      ]),

    backen('grundrezept', 'alabama-white-sauce', 'Alabama White Sauce',
      {
        cuisine: 'us',
        bbq: 'rub',
        time: 10,
        yields: { name: 'Alabama White Sauce selbstgemacht', amount: 280, unit: 'ml', shelf: 7, store: 'im Kühlschrank (Glas mit Deckel)', cat: 'vorrat' },
      },
      '200 g Mayonnaise | 60 ml Apfelessig | 1 EL Meerrettich gerieben | 0.5 Stk Zitrone | 1 TL Senf mittelscharf | 1 TL Zucker | 1 TL Pfeffer schwarz grob | 0.25 TL Cayennepfeffer | Salz',
      [
        'Die weiße Mayo-Essig-Sauce stammt aus Decatur, Alabama (Big Bob Gibson, 1925) und gehört dort zu geräuchertem Hähnchen – sie passt aber genauso zu Pilz-Burgern und Pulled Chicken.',
        'Die Zitrone auspressen. Mayonnaise, Apfelessig, Zitronensaft, Meerrettich, Senf und Zucker glatt rühren.',
        'Mit grobem Pfeffer, Cayennepfeffer und Salz kräftig würzen – sie soll pfeffrig und deutlich säuerlich schmecken und so flüssig sein, dass sie vom Löffel läuft.',
        'Abgedeckt mindestens 1 Stunde kalt stellen, damit sich die Aromen verbinden. Im Kühlschrank hält sie ca. 1 Woche.',
      ]),

    backen('grundrezept', 'burger-sauce', 'Burger-Sauce (Big-Mac-Style)',
      {
        cuisine: 'us',
        bbq: 'rub',
        time: 10,
        yields: { name: 'Burgersauce selbstgemacht', amount: 250, unit: 'ml', shelf: 7, store: 'im Kühlschrank (Glas mit Deckel)', cat: 'vorrat' },
      },
      '150 g Mayonnaise | 3 Stk Gewürzgurke | 1 EL Senf mittelscharf | 1 TL Weißweinessig | 1 TL Zucker | 1 TL Paprikapulver edelsüß | 0.5 TL Knoblauchpulver | 0.5 TL Zwiebelpulver | Salz',
      [
        'Die Gewürzgurken sehr fein hacken – das ersetzt das amerikanische „Sweet Relish“ (süß-saure Gurkenwürfel).',
        'Mayonnaise, gehackte Gurken, Senf, Weißweinessig und Zucker verrühren und mit Paprikapulver, Knoblauchpulver, Zwiebelpulver und Salz abschmecken. Sie soll cremig, leicht süß und säuerlich schmecken.',
        'Abgedeckt mindestens 1 Stunde kalt stellen, damit sie durchzieht. Im Kühlschrank hält sie ca. 1 Woche.',
      ]),

    backen('grundrezept', 'chipotle-mayo', 'Chipotle-Mayo',
      {
        cuisine: 'us',
        bbq: 'rub',
        time: 10,
        yields: { name: 'Chipotle-Mayo selbstgemacht', amount: 180, unit: 'ml', shelf: 7, store: 'im Kühlschrank (Glas mit Deckel)', cat: 'vorrat' },
      },
      '150 g Mayonnaise | 30 g Chipotle in Adobo | 0.5 Stk Limette | 1 Zehe Knoblauch | Salz',
      [
        'Chipotles sind geräucherte Jalapeños in würziger Adobo-Sauce (Dose, im Asia-/Mexiko-Regal größerer Märkte oder online). Ersatzweise 1 TL geräuchertes Paprikapulver und eine Prise Cayenne nehmen.',
        'Die Chipotle in Adobo mit etwas von der Sauce sehr fein hacken, den Knoblauch fein reiben und die Limette auspressen.',
        'Mit der Mayonnaise und 1 EL Limettensaft glatt rühren und mit Salz abschmecken. Kalt stellen; hält im Kühlschrank ca. 1 Woche. Übrige Chipotles portionsweise einfrieren.',
      ]),

    backen('grundrezept', 'ranch-dressing', 'Ranch Dressing',
      {
        cuisine: 'us',
        bbq: 'rub',
        time: 15,
        yields: { name: 'Ranch-Dressing selbstgemacht', amount: 350, unit: 'ml', shelf: 5, store: 'im Kühlschrank (Glas mit Deckel)', cat: 'vorrat' },
      },
      '100 g Mayonnaise | 100 g Saure Sahne | 150 ml Buttermilch | 0.5 Bund Dill | 0.5 Bund Schnittlauch | 0.5 Bund Petersilie | 1 TL Knoblauchpulver | 1 TL Zwiebelpulver | 0.25 Stk Zitrone | Salz | Pfeffer',
      [
        'Dill, Schnittlauch und Petersilie waschen, trocken schütteln und sehr fein hacken.',
        'Mayonnaise und saure Sahne glatt rühren, dann die Buttermilch nach und nach einrühren, bis ein cremiges, gießfähiges Dressing entsteht.',
        'Die Kräuter, Knoblauchpulver, Zwiebelpulver und den Saft der Zitrone untermischen, mit Salz und Pfeffer abschmecken.',
        'Abgedeckt mindestens 30 Minuten kalt stellen. Im Kühlschrank hält es ca. 5 Tage – zu Chicken Wings, Nashville Hot Chicken, Burgern und als Dip für Gemüse.',
      ]),

    backen('grundrezept', 'pickled-red-onions', 'Pickled Red Onions (schnell eingelegte rote Zwiebeln)',
      {
        cuisine: 'us',
        bbq: 'rub',
        time: 20,
        yields: { name: 'Rote Zwiebeln eingelegt selbstgemacht', amount: 400, unit: 'g', shelf: 21, store: 'im Kühlschrank (Schraubglas, mit Sud bedeckt)', cat: 'konserven' },
      },
      '3 Stk Zwiebel rot | 200 ml Apfelessig | 2 EL Zucker | 2 TL Salz | 1 Blatt Lorbeerblatt',
      [
        'Die roten Zwiebeln schälen, halbieren und in feine Halbringe schneiden. Fest in ein sauberes Schraubglas (ca. 500 ml) schichten.',
        'Apfelessig, 100 ml Wasser, Zucker, Salz und das Lorbeerblatt in einem kleinen Topf aufkochen, bis sich Zucker und Salz gelöst haben.',
        'Den heißen Sud über die Zwiebeln gießen, sodass sie bedeckt sind, verschließen und abkühlen lassen. Nach 1 Stunde sind sie leuchtend pink und knackig-säuerlich; im Kühlschrank halten sie ca. 3 Wochen.',
      ]),

    backen('grundrezept', 'hot-honey', 'Hot Honey (Chili-Honig)',
      {
        cuisine: 'us',
        bbq: 'rub',
        time: 40,
        yields: { name: 'Chili-Honig selbstgemacht', amount: 250, unit: 'g', shelf: 90, store: 'dunkel bei Raumtemperatur im Schraubglas', cat: 'vorrat' },
      },
      '250 g Honig | 2 TL Chiliflocken | 1 EL Apfelessig',
      [
        'Den flüssigen Honig mit den Chiliflocken in einem kleinen Topf bei sehr kleiner Hitze 5 Minuten erwärmen, bis er dünnflüssig ist und leicht blubbert – nicht kochen, sonst wird er bitter.',
        'Vom Herd nehmen und 30 Minuten ziehen lassen, dann den Apfelessig einrühren: Er bringt die typische leichte Säure und schärft den Geschmack.',
        'Für einen klaren Honig durch ein feines Sieb gießen, sonst mit den Flocken abfüllen. Nur getrocknete Chili verwenden (frische Chili bringt Wasser in den Honig und macht ihn verderblich). Dunkel gelagert hält er ca. 3 Monate – zu Fried Chicken, Pizza, Cornbread und Käse.',
      ]),
  ],
  catalog: {
    vorrat: [
      'BBQ-Rub', 'Paprikapulver geräuchert', 'Knoblauchpulver', 'Zwiebelpulver', 'Cayennepfeffer', 'Senfpulver', 'Thymian getrocknet',
      'SPG-Rub', 'Honig-Senf-Sauce', 'Carolina-Vinegar-Sauce', 'Alabama White Sauce', 'Burgersauce', 'Chipotle-Mayo', 'Ranch-Dressing', 'Chili-Honig',
    ],
    konserven: ['Rote Zwiebeln eingelegt', 'Chipotle in Adobo'],
    molkerei: ['Buttermilch'],
  },
  spices: ['Paprikapulver geräuchert', 'Knoblauchpulver', 'Zwiebelpulver', 'Cayennepfeffer', 'Senfpulver', 'Thymian getrocknet'],
  products: {
    'BBQ-Rub': prod(100, 'g', 2.99, 730, 365, 'Dose'),
    'Paprikapulver geräuchert': prod(50, 'g', 1.79, 730, 730, 'Dose'),
    Knoblauchpulver: prod(60, 'g', 1.49, 730, 730, 'Dose'),
    Zwiebelpulver: prod(50, 'g', 1.49, 730, 730, 'Dose'),
    Cayennepfeffer: prod(40, 'g', 1.69, 730, 730, 'Dose'),
    Senfpulver: prod(50, 'g', 2.49, 730, 730, 'Dose'),
    'Thymian getrocknet': prod(15, 'g', 0.99, 730, 730, 'Dose'),
    'SPG-Rub': prod(100, 'g', 3.49, 730, 365, 'Dose'),
    'Honig-Senf-Sauce': prod(250, 'ml', 1.49, 365, 60, 'Flasche'),
    'Carolina-Vinegar-Sauce': prod(350, 'ml', 5.99, 365, 180, 'Flasche (Import/online)'),
    'Alabama White Sauce': prod(350, 'ml', 6.99, 365, 60, 'Flasche (Import/online)'),
    Burgersauce: prod(250, 'ml', 1.49, 365, 60, 'Flasche'),
    'Chipotle-Mayo': prod(250, 'ml', 1.99, 365, 60, 'Flasche'),
    'Ranch-Dressing': prod(250, 'ml', 1.99, 365, 30, 'Flasche'),
    'Chili-Honig': prod(250, 'g', 4.99, 730, 365, 'Glas'),
    'Rote Zwiebeln eingelegt': prod(200, 'g', 2.29, 365, 21, 'Glas'),
    'Chipotle in Adobo': prod(200, 'g', 3.49, 730, 14, 'Dose'),
    Buttermilch: prod(500, 'ml', 0.69, 14, 4, 'Becher'),
  },
  nutrition: {
    'BBQ-Rub': [290, 8, 5, 52, 12],
    'Paprikapulver geräuchert': [330, 14, 13, 20, 35],
    Knoblauchpulver: [330, 17, 0.7, 73, 9],
    Zwiebelpulver: [340, 10, 1, 79, 15],
    Cayennepfeffer: [320, 12, 17, 57, 27],
    Senfpulver: [510, 26, 36, 28, 12],
    'Thymian getrocknet': [276, 9, 7.4, 64, 37],
    'SPG-Rub': [170, 6, 1.5, 33, 10],
    'Honig-Senf-Sauce': [250, 1.5, 13, 31, 0.5],
    'Carolina-Vinegar-Sauce': [60, 0.2, 0.1, 14, 0.3],
    'Alabama White Sauce': [480, 1, 50, 5, 0.3],
    Burgersauce: [330, 1, 32, 10, 0.5],
    'Chipotle-Mayo': [480, 1, 50, 6, 0.5],
    'Ranch-Dressing': [420, 1.5, 43, 6, 0.2],
    'Chili-Honig': [310, 0.4, 0, 80, 0.2],
    'Rote Zwiebeln eingelegt': [45, 1, 0.1, 10, 1.5],
    'Chipotle in Adobo': [80, 2, 3, 12, 4],
    Buttermilch: [37, 3.5, 0.5, 4, 0],
  },
  grams: {
    'BBQ-Rub': { EL: 9, TL: 3 },
    'Paprikapulver geräuchert': { EL: 7, TL: 2.5 },
    Knoblauchpulver: { EL: 9, TL: 3 },
    Zwiebelpulver: { EL: 7, TL: 2.5 },
    Cayennepfeffer: { EL: 6, TL: 2 },
    Senfpulver: { EL: 7, TL: 2.5 },
    'Thymian getrocknet': { EL: 3, TL: 1 },
    'SPG-Rub': { EL: 12, TL: 4 },
    'Honig-Senf-Sauce': { EL: 16, TL: 5 },
    'Carolina-Vinegar-Sauce': { EL: 15, TL: 5 },
    'Alabama White Sauce': { EL: 15, TL: 5 },
    Burgersauce: { EL: 15, TL: 5 },
    'Chipotle-Mayo': { EL: 15, TL: 5 },
    'Ranch-Dressing': { EL: 15, TL: 5 },
    'Chili-Honig': { EL: 20, TL: 7 },
    'Rote Zwiebeln eingelegt': { EL: 15 },
    'Chipotle in Adobo': { Stk: 12, EL: 15, TL: 5 },
    Buttermilch: { EL: 15 },
  },
  convert: {
    'Chili-Honig': { EL: 20, TL: 7 },
    'Rote Zwiebeln eingelegt': { EL: 15 },
    'Chipotle in Adobo': { Stk: 12, EL: 15, TL: 5 },
  },
  // Selbstgemachtes ersetzt das Gekaufte (gleiche Einheit: ml bzw. g) und wird zuerst genommen
  substitutes: {
    groups: {
      'bbq-sauce': ['BBQ-Sauce', 'BBQ-Sauce selbstgemacht'],
      'bbq-rub': ['BBQ-Rub', 'BBQ-Rub selbstgemacht', 'Magic Dust selbstgemacht'],
      'spg-rub': ['SPG-Rub', 'SPG-Rub selbstgemacht'],
      'cajun-gewuerz': ['Cajun-Gewürz', 'Cajun-Gewürz selbstgemacht'],
      'senf-bbq-sauce': ['Honig-Senf-Sauce', 'Carolina-Gold-Sauce selbstgemacht'],
      'vinegar-sauce': ['Carolina-Vinegar-Sauce', 'Carolina-Vinegar-Sauce selbstgemacht'],
      'alabama-white': ['Alabama White Sauce', 'Alabama White Sauce selbstgemacht'],
      burgersauce: ['Burgersauce', 'Burgersauce selbstgemacht'],
      'chipotle-mayo': ['Chipotle-Mayo', 'Chipotle-Mayo selbstgemacht'],
      ranch: ['Ranch-Dressing', 'Ranch-Dressing selbstgemacht'],
      'zwiebeln-eingelegt': ['Rote Zwiebeln eingelegt', 'Rote Zwiebeln eingelegt selbstgemacht'],
      'hot-honey': ['Chili-Honig', 'Chili-Honig selbstgemacht'],
    },
    preferred: {
      'BBQ-Sauce': ['BBQ-Sauce selbstgemacht'],
      'BBQ-Rub': ['BBQ-Rub selbstgemacht', 'Magic Dust selbstgemacht'],
      'SPG-Rub': ['SPG-Rub selbstgemacht'],
      'Cajun-Gewürz': ['Cajun-Gewürz selbstgemacht'],
      'Honig-Senf-Sauce': ['Carolina-Gold-Sauce selbstgemacht'],
      'Carolina-Vinegar-Sauce': ['Carolina-Vinegar-Sauce selbstgemacht'],
      'Alabama White Sauce': ['Alabama White Sauce selbstgemacht'],
      Burgersauce: ['Burgersauce selbstgemacht'],
      'Chipotle-Mayo': ['Chipotle-Mayo selbstgemacht'],
      'Ranch-Dressing': ['Ranch-Dressing selbstgemacht'],
      'Rote Zwiebeln eingelegt': ['Rote Zwiebeln eingelegt selbstgemacht'],
      'Chili-Honig': ['Chili-Honig selbstgemacht'],
    },
  },
  deviceSteps: {
    'kc-bbq-sauce': [
      { text: 'Zwiebel und Knoblauch sehr fein würfeln und in der Butter im Topf auf dem BORA 5 Minuten glasig dünsten.', settings: [bora('3', { minutes: 5 })] },
      {
        text: 'Tomatenketchup, braunen Zucker, Zuckerrübensirup, Apfelessig, Worcestersauce, Senf und 100 ml Wasser einrühren. Mit geräuchertem Paprikapulver, Knoblauchpulver, Zwiebelpulver, Cayennepfeffer und reichlich Pfeffer würzen.',
      },
      {
        text: 'Auf Stufe 7 aufkochen, dann offen 20 bis 25 Minuten dicklich einköcheln lassen und oft umrühren, weil die Sauce leicht ansetzt. Mit Salz, Essig und Zucker süß-sauer-rauchig abschmecken.',
        settings: [bora('7', { note: 'aufkochen' }), bora('3', { minutes: 25 })],
      },
      { text: 'Für eine glatte Sauce pürieren, heiß in saubere Gläser füllen, verschließen und abkühlen lassen. Im Kühlschrank hält sie ca. 4 Wochen, eingefroren ca. 3 Monate.' },
    ],
    'memphis-rub': [
      {
        text: 'Den Kreuzkümmel in einer trockenen Pfanne auf dem BORA unter Rühren 1 Minute anrösten, bis er duftet, und sofort auf einen Teller geben, damit er nicht bitter wird.',
        settings: [bora('4', { minutes: 1, note: 'trockene Pfanne' })],
      },
      { text: 'Den braunen Zucker in einer Schüssel mit den Fingern zerreiben, bis keine Klümpchen mehr da sind.' },
      { text: 'Geräuchertes und edelsüßes Paprikapulver, Salz, groben Pfeffer, Knoblauchpulver, Zwiebelpulver, den abgekühlten Kreuzkümmel und Cayennepfeffer zugeben und gründlich vermischen.' },
      { text: 'In ein sauberes, trockenes Schraubglas füllen und dunkel lagern (hält ca. 6 Monate). Faustregel: 2 bis 3 EL Rub je Kilo Fleisch, für Pulled Pork über Nacht einziehen lassen.' },
    ],
    'texas-spg': [
      { text: 'Groben schwarzen Pfeffer, Salz und Knoblauchpulver in einem Schraubglas gründlich mischen. Am besten sind grobes Meersalz und Pfeffer in „16 Mesh“ (grob geschrotet, wie Steakpfeffer) – so haftet der Rub und bildet auf Brisket die typische dunkle Kruste („Bark“).' },
      { text: 'In Texas heißt das schlicht „SPG“; ohne Knoblauch ist es der klassische „Dalmatian Rub“ aus halb Salz, halb Pfeffer. Faustregel: rundum gleichmäßig bestreuen, bis das Fleisch wie gesprenkelt aussieht (ca. 2 EL je Kilo).' },
      { text: 'Verschlossen und dunkel lagern; der Pfeffer verliert nach ca. 6 Monaten deutlich an Aroma.' },
    ],
    'magic-dust': [
      { text: 'Magic Dust ist der berühmte Allround-Rub des Memphis-Pitmasters Mike Mills: weniger süß als ein Memphis-Rub, dafür würziger durch Kreuzkümmel und Senfpulver – passt zu Schwein, Hähnchen und auf Pommes.' },
      {
        text: 'Den Kreuzkümmel in einer trockenen Pfanne auf dem BORA unter Rühren 1 Minute anrösten, bis er duftet, und auf einem Teller abkühlen lassen.',
        settings: [bora('4', { minutes: 1, note: 'trockene Pfanne' })],
      },
      { text: 'Edelsüßes und geräuchertes Paprikapulver, Salz, Zucker, den Kreuzkümmel, Knoblauchpulver, Senfpulver, groben Pfeffer und Cayennepfeffer in einer Schüssel gründlich vermischen.' },
      { text: 'In ein trockenes Schraubglas füllen und dunkel lagern (hält ca. 6 Monate). Für Ribs und Hähnchen 1 bis 2 EL je Kilo, dünn über Senf als Haftgrund.' },
    ],
    'cajun-gewuerz': [
      { text: 'Oregano und Thymian zwischen den Fingern fein zerreiben, damit sich die Kräuter gleichmäßig verteilen.' },
      { text: 'Mit Paprikapulver, Salz, Knoblauchpulver, Zwiebelpulver, schwarzem Pfeffer, weißem Pfeffer und Cayennepfeffer in einem Schraubglas gründlich mischen. Weißer und schwarzer Pfeffer zusammen mit Cayenne geben die typische Louisiana-Schärfe in drei Stufen.' },
      { text: 'Dunkel lagern (hält ca. 6 Monate). Für Jambalaya, Gumbo und Blackened Chicken; da schon Salz drin ist, beim Kochen erst am Ende nachsalzen.' },
    ],
    'carolina-gold-sauce': [
      { text: 'Senf, Apfelessig, braunen Zucker, Honig und Worcestersauce in einem kleinen Topf glatt rühren. Amerikanischer „Yellow Mustard“ ist milder als deutscher Senf mittelscharf – wer es sanfter mag, nimmt ein Viertel süßen Senf dazu.' },
      {
        text: 'Knoblauchpulver, Cayennepfeffer und reichlich Pfeffer einrühren und die Sauce auf dem BORA 10 Minuten leise köcheln lassen, dabei oft rühren.',
        settings: [bora('3', { minutes: 10 })],
      },
      { text: 'Vom Kochfeld nehmen, die Butter einrühren und mit Salz, Zucker und Essig süß-scharf-säuerlich abschmecken. Heiß in ein sauberes Glas füllen; im Kühlschrank hält sie ca. 4 Wochen. Klassisch zu Pulled Pork, Hähnchen und Burgern.' },
    ],
    'carolina-vinegar-sauce': [
      { text: 'Die dünne, scharf-saure Essigsauce aus dem Osten North Carolinas ist die älteste BBQ-Sauce der USA: kein Ketchup, nur Essig und Chili. Sie wird unter gezupftes Schweinefleisch gemischt und schneidet das Fett.' },
      {
        text: 'Den Apfelessig mit braunem Zucker und Salz in einem kleinen Topf auf dem BORA nur erwärmen, bis sich Zucker und Salz gelöst haben (ca. 3 Minuten) – nicht kochen.',
        settings: [bora('4', { minutes: 3 })],
      },
      { text: 'Chiliflocken, Cayennepfeffer und groben Pfeffer einrühren, abkühlen lassen und in eine saubere Flasche füllen. Mindestens einen Tag durchziehen lassen; im Kühlschrank hält sie ca. 3 Monate.' },
    ],
    'alabama-white-sauce': [
      { text: 'Die weiße Mayo-Essig-Sauce stammt aus Decatur, Alabama (Big Bob Gibson, 1925) und gehört dort zu geräuchertem Hähnchen – sie passt aber genauso zu Pilz-Burgern und Pulled Chicken.' },
      { text: 'Die Zitrone auspressen. Mayonnaise, Apfelessig, Zitronensaft, Meerrettich, Senf und Zucker glatt rühren.' },
      { text: 'Mit grobem Pfeffer, Cayennepfeffer und Salz kräftig würzen – sie soll pfeffrig und deutlich säuerlich schmecken und so flüssig sein, dass sie vom Löffel läuft.' },
      { text: 'Abgedeckt mindestens 1 Stunde kalt stellen, damit sich die Aromen verbinden. Im Kühlschrank hält sie ca. 1 Woche.' },
    ],
    'burger-sauce': [
      { text: 'Die Gewürzgurken sehr fein hacken – das ersetzt das amerikanische „Sweet Relish“ (süß-saure Gurkenwürfel).' },
      { text: 'Mayonnaise, gehackte Gurken, Senf, Weißweinessig und Zucker verrühren und mit Paprikapulver, Knoblauchpulver, Zwiebelpulver und Salz abschmecken. Sie soll cremig, leicht süß und säuerlich schmecken.' },
      { text: 'Abgedeckt mindestens 1 Stunde kalt stellen, damit sie durchzieht. Im Kühlschrank hält sie ca. 1 Woche.' },
    ],
    'chipotle-mayo': [
      { text: 'Chipotles sind geräucherte Jalapeños in würziger Adobo-Sauce (Dose, im Asia-/Mexiko-Regal größerer Märkte oder online). Ersatzweise 1 TL geräuchertes Paprikapulver und eine Prise Cayenne nehmen.' },
      { text: 'Die Chipotle in Adobo mit etwas von der Sauce sehr fein hacken, den Knoblauch fein reiben und die Limette auspressen.' },
      { text: 'Mit der Mayonnaise und 1 EL Limettensaft glatt rühren und mit Salz abschmecken. Kalt stellen; hält im Kühlschrank ca. 1 Woche. Übrige Chipotles portionsweise einfrieren.' },
    ],
    'ranch-dressing': [
      { text: 'Dill, Schnittlauch und Petersilie waschen, trocken schütteln und sehr fein hacken.' },
      { text: 'Mayonnaise und saure Sahne glatt rühren, dann die Buttermilch nach und nach einrühren, bis ein cremiges, gießfähiges Dressing entsteht.' },
      { text: 'Die Kräuter, Knoblauchpulver, Zwiebelpulver und den Saft der Zitrone untermischen, mit Salz und Pfeffer abschmecken.' },
      { text: 'Abgedeckt mindestens 30 Minuten kalt stellen. Im Kühlschrank hält es ca. 5 Tage – zu Chicken Wings, Nashville Hot Chicken, Burgern und als Dip für Gemüse.' },
    ],
    'pickled-red-onions': [
      { text: 'Die roten Zwiebeln schälen, halbieren und in feine Halbringe schneiden. Fest in ein sauberes Schraubglas (ca. 500 ml) schichten.' },
      {
        text: 'Apfelessig, 100 ml Wasser, Zucker, Salz und das Lorbeerblatt in einem kleinen Topf auf dem BORA aufkochen, bis sich Zucker und Salz gelöst haben.',
        settings: [bora('7', { note: 'aufkochen' })],
      },
      { text: 'Den heißen Sud über die Zwiebeln gießen, sodass sie bedeckt sind, verschließen und abkühlen lassen. Nach 1 Stunde sind sie leuchtend pink und knackig-säuerlich; im Kühlschrank halten sie ca. 3 Wochen.' },
    ],
    'hot-honey': [
      {
        text: 'Den flüssigen Honig mit den Chiliflocken in einem kleinen Topf auf dem BORA 5 Minuten sanft erwärmen, bis er dünnflüssig ist und leicht blubbert – nicht kochen, sonst wird er bitter.',
        settings: [bora('2', { minutes: 5 })],
      },
      { text: 'Vom Kochfeld nehmen und 30 Minuten ziehen lassen, dann den Apfelessig einrühren: Er bringt die typische leichte Säure und schärft den Geschmack.' },
      { text: 'Für einen klaren Honig durch ein feines Sieb gießen, sonst mit den Flocken abfüllen. Nur getrocknete Chili verwenden (frische Chili bringt Wasser in den Honig und macht ihn verderblich). Dunkel gelagert hält er ca. 3 Monate – zu Fried Chicken, Pizza, Cornbread und Käse.' },
    ],
  },
  imageQueries: {
    'kc-bbq-sauce': 'barbecue sauce jar',
    'memphis-rub': 'barbecue dry rub spices',
    'texas-spg': 'salt pepper garlic rub',
    'magic-dust': 'barbecue spice rub bowl',
    'cajun-gewuerz': 'cajun seasoning',
    'carolina-gold-sauce': 'carolina gold mustard barbecue sauce',
    'carolina-vinegar-sauce': 'vinegar barbecue sauce',
    'alabama-white-sauce': 'alabama white sauce',
    'burger-sauce': 'burger sauce',
    'chipotle-mayo': 'chipotle mayonnaise',
    'ranch-dressing': 'ranch dressing',
    'pickled-red-onions': 'pickled red onions jar',
    'hot-honey': 'hot honey chili',
  },
}
