import { prod, r } from './define'
import type { ExtraIngredients } from './extra/types'

/**
 * Amerikanische Küche – Alltagsgerichte für den Wischstapel (Jambalaya, Gumbo, Sloppy Joe, Mac & Cheese, Resteessen
 * mit Pulled Pork …), alle Mengen für 2 Portionen, `r(id, titel, 'us', art, minuten, zutaten, schritte, bildsuche)`.
 * Alles, was Smoker oder Grill braucht, gehört in die BBQ-Sparte (src/data/extra/bbq/).
 *
 * Geräte-Schritte: src/data/device-steps/us.ts. Neue Zutaten NUR unten in `usZutaten` (Kategorie, Produkt, Nährwerte,
 * Gewicht, ggf. Gewürz) – sie werden zentral eingetragen (src/data/extra/index.ts), catalog.ts/products.ts/nutrition.ts
 * bleiben unberührt. Neue Fotos: Zeile in scripts/fotos-neu-beilagen-us.md.
 *
 * Resteessen: Zutat „Pulled Pork“ (kaufbar, bbq-smoker.ts) – liegt vakuumiertes „Pulled Pork (vakuumiert)“ im Vorrat,
 * nimmt Yami das zuerst und zieht solche Gerichte im Stapel nach vorn (Vorrat-Priorisierung).
 *
 * Abnehmen: Abendessen ca. 550–750 kcal je Portion; wo ein Gericht darüber liegt oder leicht leichter geht, nennt der
 * letzte Schritt „Leichter: …“.
 */
export const recipesUs = [
  r('jambalaya', 'Jambalaya mit Hähnchen, Wurst und Garnelen', 'us', 'haupt', 50,
    '200 g Hähnchenschenkelfilet | 0.5 Stk Cabanossi | 150 g Garnelen roh TK | 1 EL Sonnenblumenöl | 1 Stk Zwiebel | 1 Stk Paprika grün | 2 Stk Staudensellerie | 2 Zehe Knoblauch | 2 TL Cajun-Gewürz | 1 EL Tomatenmark | 1 Dose Gehackte Tomaten | 120 g Langkornreis | 350 ml Hühnerbrühe | 1 Blatt Lorbeerblatt | 2 Stk Frühlingszwiebel | Salz | Pfeffer',
    [
      'Die Garnelen im Kühlschrank auftauen lassen. Hähnchen in mundgerechte Stücke, die Wurst in Scheiben schneiden. Zwiebel, Paprika und Staudensellerie würfeln (die „Holy Trinity“ der Cajun-Küche), Knoblauch hacken.',
      'Hähnchen und Wurst im Öl in einem breiten Topf kräftig anbraten und herausnehmen.',
      'Zwiebel, Paprika und Sellerie im Bratfett 5 Minuten weich dünsten, Knoblauch, Cajun-Gewürz und Tomatenmark kurz mitrösten.',
      'Tomaten, Brühe, Reis und Lorbeer zugeben, Fleisch und Wurst wieder hinein, aufkochen und zugedeckt bei kleiner Hitze 20 Minuten garen, ohne umzurühren.',
      'Die Garnelen auf den Reis legen, zudecken und 5 Minuten garziehen lassen. Durchmischen, abschmecken und mit Frühlingszwiebelringen bestreuen. Das ist die rote Creole-Jambalaya aus New Orleans (mit Tomaten); die Cajun-Variante vom Land kommt ohne Tomaten aus und wird durch sehr dunkel angebratenes Fleisch braun.',
    ], 'jambalaya'),

  r('pulled-pork-quesadillas', 'Pulled-Pork-Quesadillas mit Cheddar und Mais', 'us', 'haupt', 25,
    '250 g Pulled Pork | 2 Stk Vollkorn-Tortilla | 60 g Cheddar gerieben | 0.5 Dose Mais | 1 Stk Zwiebel rot | 2 EL BBQ-Sauce | 60 g Saure Sahne | 1 Stk Limette | 0.5 Bund Koriander | Salz',
    [
      'Das Pulled Pork (aus dem Vorrat am Vortag im Kühlschrank auftauen) mit der BBQ-Sauce erwärmen. Mais abtropfen lassen, Zwiebel fein würfeln.',
      'Die Tortillas jeweils auf einer Hälfte mit Käse, Pulled Pork, Mais und Zwiebel belegen und zusammenklappen.',
      'In einer großen Pfanne ohne Fett bei mittlerer Hitze von jeder Seite 3 Minuten goldbraun braten, bis der Käse schmilzt. Dazu passt ein grüner Salat.',
      'Saure Sahne mit Limettensaft und Salz verrühren. Quesadillas halbieren, mit Koriander bestreuen und mit dem Limetten-Dip servieren.',
    ], 'quesadilla pulled pork'),

  // ───────────── Louisiana: Cajun & Creole ─────────────
  r('chicken-andouille-gumbo', 'Chicken & Sausage Gumbo mit dunkler Roux', 'us', 'eintopf', 100,
    '300 g Hähnchenschenkelfilet | 2 TL Cajun-Gewürz | 0.5 Stk Cabanossi | 30 ml Sonnenblumenöl | 30 g Weizenmehl | 1 Stk Zwiebel | 1 Stk Paprika grün | 2 Stk Staudensellerie | 3 Zehe Knoblauch | 700 ml Hühnerbrühe | 1 Blatt Lorbeerblatt | 2 Zweig Thymian | 1 TL Worcestersauce | 90 g Langkornreis | 3 Stk Frühlingszwiebel | 0.5 Bund Petersilie | Salz | Pfeffer',
    [
      'Zwiebel, Paprika und Staudensellerie fein würfeln (die „Holy Trinity“ der Cajun-Küche), Knoblauch hacken. Das Hähnchen in mundgerechte Stücke schneiden und mit 1 TL Cajun-Gewürz würzen, die Cabanossi in Scheiben schneiden (Ersatz für die grobe, kräftig geräucherte Andouille aus Louisiana). Alles bereitstellen – bei der Roux muss man ununterbrochen rühren.',
      'Hähnchen und Wurst in einem schweren Topf in 1 EL vom Öl kräftig anbraten und herausnehmen.',
      'Für die dunkle Roux das restliche Öl und das Mehl im selben Topf verrühren und bei mittlerer Hitze unter ständigem Rühren 20 bis 25 Minuten rösten, bis die Mehlschwitze die Farbe von Zartbitterschokolade hat und nussig riecht. Schwarze Pünktchen heißen verbrannt – dann neu anfangen.',
      'Sofort Zwiebel, Paprika und Sellerie in die heiße Roux geben – das stoppt das Rösten – und weich dünsten, Knoblauch und restliches Cajun-Gewürz kurz mitrösten.',
      'Die Brühe nach und nach unter Rühren angießen, Lorbeer, Thymian, Worcestersauce, Hähnchen und Wurst zugeben und offen 45 Minuten leise köcheln lassen; Fett an der Oberfläche abschöpfen.',
      'Inzwischen den Reis in Salzwasser garen. Den Gumbo abschmecken, in tiefe Teller füllen, einen Löffel Reis in die Mitte setzen und mit Frühlingszwiebeln und Petersilie bestreuen. Leichter: Hähnchenbrust statt Schenkel und die Wurst weglassen – die dunkle Roux trägt den Geschmack.',
    ], 'chicken sausage gumbo'),

  r('red-beans-and-rice', 'Red Beans and Rice mit Räucherwurst', 'us', 'eintopf', 60,
    '2 Dose Kidneybohnen | 1 Stk Zwiebel | 1 Stk Paprika grün | 2 Stk Staudensellerie | 2 Zehe Knoblauch | 1 Stk Mettenden | 40 g Speckwürfel | 2 TL Cajun-Gewürz | 400 ml Hühnerbrühe | 1 Blatt Lorbeerblatt | 2 Zweig Thymian | 100 g Langkornreis | 1 TL Apfelessig | 2 Stk Frühlingszwiebel | Salz | Pfeffer',
    [
      'Die Kidneybohnen abgießen und abspülen. Zwiebel, Paprika und Staudensellerie würfeln, Knoblauch hacken, die Mettenden in Scheiben schneiden (Ersatz für Andouille).',
      'Speckwürfel und Mettenden in einem Topf anbraten, bis Fett austritt. Zwiebel, Paprika und Sellerie darin weich dünsten, Knoblauch und Cajun-Gewürz kurz mitrösten.',
      'Bohnen, Brühe, Lorbeer und Thymian zugeben und offen 30 Minuten köcheln. Ein Drittel der Bohnen am Topfrand zerdrücken – so wird es cremig, ganz ohne Sahne.',
      'Inzwischen den Reis in Salzwasser garen.',
      'Mit Apfelessig, Salz und Pfeffer abschmecken, auf dem Reis anrichten und mit Frühlingszwiebeln bestreuen. In New Orleans ist das das traditionelle Montagsessen; am Tisch kommt Hot Sauce dazu.',
    ], 'red beans and rice'),

  r('shrimp-and-grits', 'Shrimp & Grits mit Cheddar-Polenta', 'us', 'haupt', 35,
    '250 g Garnelen roh TK | 1 TL Cajun-Gewürz | 2 Zehe Knoblauch | 3 Stk Frühlingszwiebel | 300 ml Milch | 100 g Polenta | 50 g Speckwürfel | 100 ml Hühnerbrühe | 0.5 Stk Zitrone | 50 g Cheddar gerieben | 15 g Butter | Salz | Pfeffer',
    [
      'Die Garnelen im Kühlschrank auftauen lassen, trocken tupfen und mit dem Cajun-Gewürz mischen. Knoblauch fein hacken, Frühlingszwiebeln in Ringe schneiden.',
      'Für die Grits die Milch mit 300 ml Wasser und 1 TL Salz aufkochen, die Polenta einrieseln lassen und bei kleiner Hitze nach Packungsangabe quellen lassen, öfter umrühren. Grits sind grob gemahlener weißer Mais aus den Südstaaten – Polenta kommt dem am nächsten.',
      'Die Speckwürfel in einer Pfanne knusprig auslassen und herausnehmen. Die Garnelen im Speckfett bei starker Hitze 1 Minute je Seite braten, bis sie rosa sind, den Knoblauch kurz mitbraten.',
      'Mit Brühe und Zitronensaft ablöschen, 1 Minute einkochen, Speck und die Hälfte der Frühlingszwiebeln zurückgeben.',
      'Cheddar und Butter unter die Grits rühren, abschmecken, in tiefe Teller geben, die Garnelen mit der Sauce darauf verteilen und mit den restlichen Frühlingszwiebeln bestreuen.',
    ], 'shrimp and grits'),

  r('shrimp-etouffee', 'Shrimp Étouffée mit Reis', 'us', 'haupt', 45,
    '300 g Garnelen roh TK | 1 Stk Zwiebel | 1 Stk Paprika grün | 2 Stk Staudensellerie | 2 Zehe Knoblauch | 30 g Butter | 25 g Weizenmehl | 1 EL Tomatenmark | 2 TL Cajun-Gewürz | 300 ml Fischfond | 1 TL Worcestersauce | 120 g Langkornreis | 3 Stk Frühlingszwiebel | 0.5 Bund Petersilie | 0.5 Stk Zitrone | Salz',
    [
      'Die Garnelen im Kühlschrank auftauen lassen. Zwiebel, Paprika und Staudensellerie fein würfeln, Knoblauch hacken.',
      'Für die blonde Roux die Butter schmelzen, das Mehl einrühren und unter Rühren 8 bis 10 Minuten rösten, bis sie die Farbe von Erdnussbutter hat.',
      'Zwiebel, Paprika und Sellerie in der Roux weich dünsten, Knoblauch, Tomatenmark und Cajun-Gewürz kurz mitrösten.',
      'Fond und Worcestersauce nach und nach unterrühren und 15 Minuten sämig köcheln. Inzwischen den Reis in Salzwasser garen.',
      'Die Garnelen in die Sauce geben und 4 Minuten gar ziehen lassen. Mit Zitronensaft und Salz abschmecken, über den Reis geben und mit Frühlingszwiebeln und Petersilie bestreuen. „Étouffée“ heißt „erstickt“ – die Garnelen garen bedeckt in der dicken Sauce.',
    ], 'shrimp etouffee'),

  // ───────────── Südstaaten & Diner-Klassiker ─────────────
  r('southern-fried-chicken', 'Southern Fried Chicken mit Buttermilch-Marinade und Coleslaw', 'us', 'haupt', 60,
    '2 Stk Hähnchenschenkel | 200 ml Buttermilch | 0.5 TL Cayennepfeffer | 250 g Weißkohl | 1 Stk Möhre | 4 EL Joghurt natur | 1 EL Apfelessig | 60 g Weizenmehl | 1 TL Backpulver | 1 TL Paprikapulver edelsüß | 1 TL Knoblauchpulver | 500 ml Frittieröl | Salz | Pfeffer',
    [
      'Die Hähnchenschenkel im Gelenk in Ober- und Unterschenkel teilen. Buttermilch mit 1 TL Salz und der Hälfte des Cayennepfeffers verrühren und das Fleisch darin zugedeckt mindestens 4 Stunden, besser über Nacht im Kühlschrank marinieren („Buttermilk Brine“: die milde Säure macht das Fleisch zart und saftig).',
      'Für den Coleslaw Weißkohl fein hobeln, Möhre raspeln und mit Joghurt, Apfelessig, Salz und Pfeffer mischen (leichter als mit Mayonnaise).',
      'Mehl, Backpulver, Paprikapulver, Knoblauchpulver, restlichen Cayennepfeffer, 1 TL Salz und Pfeffer mischen und 2 EL Marinade hineinreiben – die Klümpchen werden zur krossen, zerklüfteten Kruste. Die Hähnchenteile abtropfen lassen, kräftig darin wenden, andrücken und 10 Minuten ruhen lassen.',
      'Das Frittieröl in einem schweren Topf auf 165 °C erhitzen und die Teile 14 bis 16 Minuten goldbraun ausbacken, dabei mehrmals wenden. Innen müssen sie mindestens 80 °C haben.',
      'Auf einem Gitter abtropfen lassen und mit dem Coleslaw servieren. Leichter: die Haut vor dem Panieren abziehen und im Airfryer statt im Fett garen – spart zusammen rund 200 kcal je Portion.',
    ], 'southern fried chicken'),

  r('chicken-fried-steak', 'Chicken Fried Steak mit Pfeffer-Gravy, Kartoffelpüree und Bohnen', 'us', 'haupt', 50,
    '2 Stk Rinderroulade dünn | 400 g Kartoffeln mehligkochend | 250 g Grüne Bohnen | 60 g Weizenmehl | 1 TL Paprikapulver edelsüß | 0.5 TL Knoblauchpulver | 1 Prise Cayennepfeffer | 1 Stk Ei | 80 ml Buttermilch | 2 EL Sonnenblumenöl | 300 ml Milch | 15 g Butter | Salz | Pfeffer',
    [
      'Die Kartoffeln schälen, vierteln und in Salzwasser 20 Minuten weich kochen; die Grünen Bohnen putzen und die letzten 8 Minuten mitgaren.',
      'Das Rindfleisch zwischen Frischhaltefolie dünn klopfen, salzen und pfeffern. 45 g Mehl mit Paprikapulver, Knoblauchpulver und Cayennepfeffer mischen, Ei und Buttermilch verquirlen. Das Fleisch erst im Mehl, dann im Ei, dann nochmal im Mehl wenden und gut andrücken.',
      'Das Öl in einer großen Pfanne erhitzen und die Steaks bei mittlerer Hitze 3 Minuten je Seite goldbraun braten, warm stellen.',
      'Für die Country Gravy das Bratfett bis auf 2 EL abgießen, das restliche Mehl einrühren und 1 Minute anschwitzen, 250 ml Milch einrühren und 4 Minuten sämig köcheln, kräftig mit Salz und viel grobem Pfeffer würzen.',
      'Die Kartoffeln mit Butter und der übrigen Milch zu Püree stampfen. Die Steaks mit der Gravy übergießen, mit Püree und Bohnen servieren. Der Name: das Rindfleisch wird paniert wie Fried Chicken – ein Texas-Klassiker, den deutsche Einwanderer vom Schnitzel abgeleitet haben.',
    ], 'chicken fried steak gravy'),

  r('sloppy-joes', 'Sloppy Joes mit Krautsalat', 'us', 'haupt', 30,
    '200 g Weißkohl | 1 Stk Möhre | 3 EL Joghurt natur | 1 EL Apfelessig | 300 g Rinderhackfleisch | 1 Stk Zwiebel | 1 Stk Paprika grün | 2 Zehe Knoblauch | 1 EL Tomatenmark | 1 TL Paprikapulver edelsüß | 150 g Passierte Tomaten | 2 EL Tomatenketchup | 1 EL Worcestersauce | 1 TL Brauner Zucker | 1 TL Senf mittelscharf | 2 Stk Burger-Brötchen | 2 Stk Gewürzgurke | Salz | Pfeffer',
    [
      'Für den Krautsalat Weißkohl fein hobeln, Möhre raspeln, mit Joghurt, Apfelessig, Salz und Pfeffer mischen und ziehen lassen.',
      'Zwiebel und Paprika fein würfeln, Knoblauch hacken. Das Hackfleisch in einer großen Pfanne krümelig braun anbraten, Zwiebel und Paprika 4 Minuten mitbraten, Knoblauch, Tomatenmark und Paprikapulver kurz mitrösten.',
      'Passierte Tomaten, Tomatenketchup, Worcestersauce, braunen Zucker und Senf einrühren und 10 Minuten dicklich einköcheln, mit Salz und Pfeffer abschmecken.',
      'Die Brötchen aufschneiden und kurz anrösten, mit dem Hackfleisch füllen – „sloppy“ heißt schlampig, es darf herauslaufen – und mit Gewürzgurken und Krautsalat servieren.',
    ], 'sloppy joe'),

  r('meatloaf-mashed-potatoes', 'Meatloaf mit Ketchup-Glasur, Mashed Potatoes und Bohnen', 'us', 'haupt', 75,
    '1 Stk Zwiebel | 1 Zehe Knoblauch | 30 g Paniermehl | 150 ml Milch | 250 g Hackfleisch gemischt | 1 Stk Ei | 1 TL Worcestersauce | 1 TL Senf mittelscharf | 2 Zweig Thymian | 3 EL Tomatenketchup | 1 EL Brauner Zucker | 1 TL Apfelessig | 400 g Kartoffeln mehligkochend | 300 g Grüne Bohnen | 10 g Butter | Salz | Pfeffer',
    [
      'Den Backofen auf 180 °C Umluft vorheizen. Zwiebel und Knoblauch sehr fein würfeln, das Paniermehl in 50 ml Milch einweichen.',
      'Hackfleisch, Ei, eingeweichtes Paniermehl, Zwiebel, Knoblauch, Worcestersauce, Senf, abgezupften Thymian, Salz und Pfeffer locker vermengen – nicht zu lange kneten, sonst wird der Meatloaf fest. Auf einem Blech mit Backpapier zu einem flachen Laib formen und 25 Minuten backen.',
      'Tomatenketchup, braunen Zucker und Apfelessig verrühren, den Meatloaf damit bestreichen und weitere 15 Minuten backen, bis er innen 72 °C hat und die Glasur glänzt.',
      'Inzwischen die Kartoffeln schälen, vierteln und in Salzwasser 20 Minuten weich kochen, die Bohnen die letzten 8 Minuten mitgaren.',
      'Die Kartoffeln mit Butter und der restlichen Milch stampfen. Den Meatloaf 5 Minuten ruhen lassen, in Scheiben schneiden und mit Püree und Bohnen servieren. Leichter: halb Rinder-, halb Putenhack.',
    ], 'meatloaf mashed potatoes'),

  r('chicken-pot-pie', 'Chicken Pot Pie mit Blätterteigdeckel', 'us', 'auflauf', 60,
    '1 Stk Zwiebel | 2 Stk Möhre | 2 Stk Staudensellerie | 350 g Hähnchenbrustfilet | 20 g Butter | 25 g Weizenmehl | 300 ml Hühnerbrühe | 100 ml Milch | 2 Zweig Thymian | 100 g Erbsen TK | 140 g Blätterteig | Salz | Pfeffer',
    [
      'Den Backofen auf 200 °C Ober-/Unterhitze vorheizen. Zwiebel, Möhren und Staudensellerie in kleine Würfel, das Hähnchen in 2 cm große Stücke schneiden.',
      'Die Butter in einem Topf schmelzen, Zwiebel, Möhren und Sellerie 5 Minuten andünsten, das Hähnchen kurz mitbraten. Mehl darüberstäuben und 1 Minute anschwitzen.',
      'Brühe und 80 ml Milch nach und nach einrühren, Thymianblättchen zugeben und 5 Minuten sämig köcheln. Erbsen unterrühren und kräftig mit Salz und Pfeffer abschmecken.',
      'Die Füllung in zwei ofenfeste Förmchen oder eine kleine Auflaufform füllen. Den Blätterteig darauflegen, am Rand andrücken, mit der übrigen Milch bestreichen und mehrmals einschneiden, damit Dampf entweichen kann.',
      'Etwa 25 Minuten goldbraun backen und 5 Minuten abkühlen lassen. Dazu passt ein grüner Salat.',
    ], 'chicken pot pie'),

  r('philly-cheesesteak', 'Philly Cheesesteak mit Provolone', 'us', 'haupt', 40,
    '300 g Rinderhüfte | 1 Stk Zwiebel | 1 Stk Paprika grün | 150 g Champignons | 1 EL Sonnenblumenöl | 60 g Provolone | 1 Stk Ciabatta | Salz | Pfeffer',
    [
      'Das Fleisch 30 Minuten ins Gefrierfach legen, dann lässt es sich hauchdünn quer zur Faser schneiden.',
      'Zwiebel und Paprika in feine Streifen, Champignons in Scheiben schneiden. In der Hälfte vom Öl bei mittlerer Hitze 8 Minuten weich und leicht gebräunt braten, salzen und herausnehmen.',
      'Das restliche Öl in der Pfanne sehr heiß werden lassen, das Fleisch darin 2 Minuten scharf anbraten und mit dem Pfannenwender zerhacken. Salzen, pfeffern und das Gemüse untermischen.',
      'Die Mischung in zwei Portionen teilen, den Provolone darauflegen und zugedeckt 1 Minute schmelzen lassen.',
      'Das Ciabatta halbieren, längs aufschneiden und kurz aufbacken. Mit dem Pfanneninhalt füllen und sofort essen. In Philadelphia bestellt man „wit“ (mit Zwiebeln); statt Provolone gibt es dort auch Cheez Whiz. Leichter: etwas Innenteig aus dem Brot zupfen und einen grünen Salat dazu.',
    ], 'philly cheesesteak'),

  r('buffalo-chicken-wraps', 'Buffalo Chicken Wraps mit Blue-Cheese-Dip', 'us', 'haupt', 30,
    '350 g Hähnchenbrustfilet | 1 TL Knoblauchpulver | 1 TL Paprikapulver edelsüß | 3 EL Hot Sauce | 10 g Butter | 100 g Joghurt natur | 30 g Gorgonzola dolce | 0.5 Stk Zitrone | 2 Stk Staudensellerie | 1 Stk Möhre | 0.5 Stk Kopfsalat | 2 Stk Vollkorn-Tortilla | Salz | Pfeffer',
    [
      'Das Hähnchen in fingerdicke Streifen schneiden und mit Knoblauchpulver, Paprikapulver, Salz und Pfeffer würzen.',
      'In einer Pfanne bei mittlerer bis starker Hitze 6 bis 8 Minuten braten, bis die Streifen durchgegart sind.',
      'Für die Buffalo-Sauce Hot Sauce und Butter in einem kleinen Topf schmelzen und mit den Hähnchenstreifen mischen. Das Original stammt aus Buffalo (New York) und wird mit Frank’s RedHot gemacht.',
      'Für den Dip Joghurt mit zerdrücktem Gorgonzola und Zitronensaft verrühren. Staudensellerie und Möhre in feine Stifte schneiden, Salat in Streifen.',
      'Die Tortillas kurz erwärmen, mit Salat, Gemüsestiften, Hähnchen und Dip belegen, fest einrollen und halbieren.',
    ], 'buffalo chicken wrap'),

  // ───────────── Resteessen mit Pulled Pork aus dem Vorrat ─────────────
  r('pulled-pork-mac-and-cheese', 'Mac & Cheese mit Pulled Pork und Brokkoli', 'us', 'pasta', 40,
    '150 g Pulled Pork | 2 EL BBQ-Sauce | 140 g Nudeln | 300 g Brokkoli | 15 g Butter | 15 g Weizenmehl | 250 ml Milch | 60 g Cheddar gerieben | 1 TL Senf mittelscharf | 1 TL Paprikapulver geräuchert | 15 g Panko | Salz | Pfeffer',
    [
      'Das Pulled Pork (aus dem Vorrat am Vortag im Kühlschrank auftauen) mit der BBQ-Sauce in einem kleinen Topf erwärmen.',
      'Die Nudeln (am besten kurze Hörnchennudeln) in Salzwasser bissfest kochen, den Brokkoli in kleinen Röschen die letzten 3 Minuten mitgaren und alles abgießen.',
      'Butter schmelzen, Mehl einrühren und 1 Minute anschwitzen, die Milch nach und nach einrühren und 5 Minuten köcheln. Vom Herd nehmen, Cheddar, Senf und geräuchertes Paprikapulver einrühren, salzen und pfeffern.',
      'Nudeln und Brokkoli mit der Käsesauce mischen, in eine Auflaufform füllen, das Pulled Pork darauf verteilen und mit Panko bestreuen.',
      'Unter dem Backofengrill 4 Minuten goldbraun überbacken und sofort servieren.',
    ], 'mac and cheese pulled pork'),

  r('pulled-pork-nachos', 'Pulled-Pork-Nachos vom Blech mit Pico de Gallo', 'us', 'haupt', 35,
    '2 Stk Vollkorn-Tortilla | 2 TL Sonnenblumenöl | 200 g Pulled Pork | 2 EL BBQ-Sauce | 0.5 Dose Kidneybohnen | 0.5 Dose Mais | 60 g Cheddar gerieben | 2 Stk Tomate | 0.5 Stk Zwiebel rot | 1 Stk Chili rot | 0.5 Stk Limette | 0.5 Bund Koriander | 60 g Saure Sahne | Salz',
    [
      'Den Backofen auf 180 °C Umluft vorheizen. Die Tortillas in je 8 Dreiecke schneiden, dünn mit dem Öl bepinseln, salzen und auf einem Blech 8 Minuten knusprig backen – selbstgemachte Chips haben deutlich weniger Fett als gekaufte.',
      'Das Pulled Pork (aus dem Vorrat am Vortag im Kühlschrank auftauen) mit der BBQ-Sauce erwärmen. Kidneybohnen und Mais abspülen und abtropfen lassen.',
      'Die Chips auf dem Blech eng zusammenschieben, Pulled Pork, Bohnen, Mais und Cheddar darauf verteilen und 5 Minuten backen, bis der Käse schmilzt.',
      'Für das Pico de Gallo Tomaten, Zwiebel und Chili fein würfeln, mit Limettensaft, gehacktem Koriander und Salz mischen. Die Nachos mit Pico de Gallo und Saurer Sahne direkt vom Blech servieren.',
    ], 'pulled pork nachos'),
]

/** Neue Zutaten der Küche „Amerikanisch“ (Form wie die Extra-Gruppen, ohne Rezepte) */
export const usZutaten: ExtraIngredients = {
  catalog: { vorrat: ['Cajun-Gewürz', 'Hot Sauce'], molkerei: ['Cheddar gerieben', 'Blätterteig'] },
  spices: ['Cajun-Gewürz'],
  products: {
    'Cajun-Gewürz': prod(50, 'g', 1.99, 730, 730, 'Dose'),
    'Cheddar gerieben': prod(150, 'g', 1.89, 30, 7, 'Beutel'),
    // Frank’s RedHot (Original Buffalo-Basis) oder eine andere milde Cayenne-Chilisauce
    'Hot Sauce': prod(148, 'ml', 2.99, 730, 180, 'Flasche'),
    Blätterteig: prod(275, 'g', 1.29, 21, 2, 'Rolle'),
  },
  nutrition: {
    'Cajun-Gewürz': [300, 12, 8, 50, 20],
    'Cheddar gerieben': [400, 25, 33, 1, 0],
    'Hot Sauce': [15, 0.5, 0.5, 1.5, 0.5],
    Blätterteig: [400, 5.5, 26, 35, 1.5],
  },
  grams: { 'Cajun-Gewürz': { EL: 7, TL: 2.5 }, 'Hot Sauce': { EL: 15, TL: 5 } },
}
