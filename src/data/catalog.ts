import type { ShopCat } from '../types'
import { EXTRA_CATALOG, EXTRA_NON_VEG, EXTRA_SPICES, EXTRA_YIELDS } from './extra'

/**
 * Zutatenkatalog: jede Zutat aus den Rezepten gehört genau einer Einkaufslisten-Kategorie an.
 * `npm run check-data` prüft, dass alle Rezeptzutaten hier eingetragen sind.
 */
const groups: Record<ShopCat, string[]> = {
  gemuese: [
    'Banane', 'Ananas', 'Apfel', 'Apfel säuerlich', 'Aubergine', 'Basilikum', 'Birne', 'Blattspinat frisch', 'Blumenkohl', 'Bohnenkraut',
    'Brokkoli', 'Champignons', 'Champignons braun', 'Chicorée', 'Chili rot', 'Chinakohl', 'Datteltomaten', 'Dill',
    'Feldsalat', 'Frühlingszwiebel', 'Galgant', 'Grüne Bohnen', 'Grünkohl', 'Hokkaido-Kürbis', 'Ingwer',
    'Kaffirlimettenblätter', 'Kartoffeln festkochend', 'Kartoffeln mehligkochend', 'Kirschtomaten', 'Knoblauch',
    'Knollensellerie', 'Kohlrabi', 'Kopfsalat', 'Koriander', 'Kräuter für Grüne Soße', 'Kräuterseitlinge', 'Lauch',
    'Limette', 'Majoran frisch', 'Möhre', 'Pak Choi', 'Radieschen', 'Paprika gelb', 'Paprika grün',
    'Paprika rot', 'Petersilie', 'Rosenkohl', 'Rosmarin', 'Rote Bete gekocht', 'Rotkohl', 'Rucola', 'Salatgurke',
    'Salbei', 'Schalotte', 'Schnittlauch', 'Schwarzkohl', 'Shiitake', 'Sojasprossen', 'Spargel weiß',
    'Spitzpaprika grün', 'Staudensellerie', 'Steckrübe', 'Thai-Basilikum', 'Thymian', 'Tomate',
    'Weißkohl', 'Wirsing', 'Orange', 'Zitrone', 'Zitrone unbehandelt', 'Zitronengras', 'Zucchini', 'Zuckerschoten', 'Zwiebel',
    'Zwiebel rot', 'Maronen vorgegart',
  ],
  konserven: [
    'Chiasamen', 'Leinsamen geschrotet', 'Backkakao', 'Erdnussmus', 'Kokosraspeln', 'Haselnusskerne', 'Kidneybohnen',
    'Alblinsen', 'Apfelmus', 'Austernsauce', 'Bambussprossen', 'Bier hell', 'Borlotti-Bohnen', 'Cannellini-Bohnen',
    'Cashewkerne', 'Chiliöl', 'Chinkiang-Essig', 'Cola', 'Corned Beef', 'Currypaste grün', 'Currypaste Massaman',
    'Currypaste rot', 'Doubanjiang', 'Dunkelbier', 'Erdnüsse geröstet', 'Fermentierte schwarze Bohnen', 'Fischfond',
    'Fischsauce', 'Garnelenpaste', 'Gehackte Tomaten', 'Geschälte Tomaten', 'Getrocknete Tomaten in Öl',
    'Gewürzgurke', 'Gochujang', 'Haferflocken', 'Hoisinsauce', 'Japanische Curry-Würfel', 'Jasminreis', 'Kalbsfond',
    'Kandiszucker', 'Kapern', 'Kartoffelknödel halb und halb', 'Kecap Manis', 'Kichererbsen', 'Kokosmilch',
    'Kürbiskerne', 'Langkornreis', 'Mais', 'Mandeln', 'Mayonnaise', 'Meerrettich gerieben', 'Mirin',
    'Mu-Err-Pilze getrocknet', 'Nori', 'Oliven schwarz', 'Palmzucker', 'Paniermehl', 'Panko', 'Passierte Tomaten',
    'Perlgraupen', 'Pesto Genovese', 'Pfeffer grün eingelegt', 'Pinienkerne', 'Pistazien', 'Polenta', 'Rahmmais', 'Reisessig',
    'Rinderfond', 'Risottoreis', 'Rosinen', 'Röstzwiebeln', 'Rotwein', 'Safranfäden', 'Sake', 'Sardellenfilet',
    'Sauerkraut', 'Schälerbsen gelb', 'Sesam', 'Sesampaste', 'Shaoxing-Reiswein', 'Sojabohnenpaste gelb',
    'Steinpilze getrocknet', 'Sushireis', 'Tamarindenpaste', 'Tellerlinsen', 'Thunfisch in Olivenöl', 'Tomatenmark',
    'Walnusskerne', 'Metaxa', 'Weinbrand', 'Lammfond', 'Morcheln getrocknet', 'Weiße Bohnen', 'Weißwein', 'Weizenmehl Tipo 00', 'Reismehl', 'Sojamehl', 'Wodka', 'Yakisoba-Sauce',
    'Zuckerrübensirup',
  ],
  backwaren: ['Burger-Brötchen', 'Laugenbrezel', 'Pitabrot', 'Vollkornbrot', 'Vollkorn-Knäckebrot', 'Vollkorn-Tortilla','Brötchen vom Vortag', 'Ciabatta', 'Printen', 'Toastbrot', 'Toskanisches Brot', 'Weißbrot'],
  molkerei: [
    'Cheddar', 'Skyr', 'Camembert', 'Magerquark', 'Hüttenkäse', 'Eiklar', 'Hummus',
    'Bandnudeln', 'Bergkäse', 'Bucatini', 'Butter', 'Butterschmalz', 'Cannelloni', 'Ditalini', 'Ei', 'Kritharaki', 'Tzatziki', 'Eigelb',
    'Ei hart gekocht', 'Emmentaler', 'Emmentaler gerieben', 'Feta', 'Fettuccine', 'Flammkuchenteig', 'Fusilli',
    'Burrata', 'Gnocchi', 'Gorgonzola dolce', 'Gouda gerieben', 'Gruyère', 'Hefe frisch', 'Joghurt natur', 'Kartoffelsalat',
    'Lasagneplatten', 'Linguine', 'Maultaschen', 'Mie-Nudeln', 'Milch', 'Mozzarella', 'Orecchiette',
    'Parmigiano Reggiano', 'Pecorino Romano', 'Penne', 'Provolone', 'Ramen-Nudeln', 'Ravioli Ricotta-Spinat frisch',
    'Reisbandnudeln', 'Crème fraîche', 'Sauce Hollandaise', 'Nudeln', 'Frischkäse', 'Mascarpone', 'Ricotta', 'Ricotta salata', 'Rigatoni', 'Sahne', 'Saure Sahne', 'Schmand', 'Schmelzkäse',
    'Schupfnudeln', 'Schweineschmalz', 'Spaghetti', 'Spätzle frisch', 'Speisequark', 'Suppennudeln', 'Tagliatelle',
    'Tofu natur', 'Tofu seiden', 'Tortellini frisch', 'Trofie', 'Weizennudeln asiatisch', 'Yakisoba-Nudeln', 'Ziti',
  ],
  fleisch: [
    'Bacon', 'Blutwurst', 'Bockwurst', 'Bratwurst', 'Cabanossi', 'Doradenfilet', 'Fleischwurst', 'Guanciale',
    'Gänsekeule', 'Entenbrust', 'Entenkeule', 'Gyros-Fleisch gewürzt', 'Kalbsbraten',
    'Hackfleisch gemischt', 'Hähnchenbrustfilet', 'Hähnchenflügel', 'Hähnchenschenkel', 'Hähnchenschenkelfilet',
    'Kabeljaufilet', 'Kalbsbrät', 'Kalbshaxe in Scheiben', 'Kalbskotelett', 'Kalbsleber',
    'Kalbsschnitzel', 'Kalbsschnitzel klein', 'Kasseler Kotelett', 'Kasseler Nacken', 'Katenschinken', 'Kochschinken',
    'Lachsfilet', 'Lammschulter', 'Leberkäse', 'Markknochen', 'Matjesfilet', 'Mettenden', 'Mortadella', 'Miesmuscheln',
    'Nordseekrabben', 'Nürnberger Rostbratwürstchen', 'Pancetta', 'Parmaschinken', 'Pinkelwurst', 'Rinderbeinscheibe',
    'Rinderbraten aus der Keule', 'Rindergulasch', 'Rinderhackfleisch', 'Rinderhüfte', 'Rinderleber', 'Rinderroulade',
    'Rinderroulade dünn', 'Putenbrust', 'Zanderfilet', 'Rollmops', 'Rumpsteak', 'Salami', 'Salami piccante', 'Salsiccia', 'Scholle küchenfertig',
    'Schweinebauch', 'Schweinebauch dünn geschnitten', 'Schweinebauch geräuchert', 'Schweinefilet',
    'Schweinegulasch', 'Schweinehackfleisch', 'Schweinekotelett', 'Schweinenacken',
    'Schweineschnitzel', 'Schweineschnitzel klein', 'Schweineschulter mit Schwarte', 'Schweinshaxe hinten',
    'Seelachsfilet', 'Speckwürfel', 'Suppenfleisch Rind', 'Tafelspitz', 'Venusmuscheln', 'Wiener Würstchen',
    // Braten & Schmorstücke (gehoben) und Knochen für Fonds
    'Ochsenbäckchen', 'Rinderfilet', 'Roastbeef', 'Schäufele', 'Schweinebauch mit Schwarte', 'Kalbshüfte',
    'Kalbsbäckchen', 'Kalbsbrust', 'Lammkeule ohne Knochen', 'Lammhaxe', 'Rinderknochen', 'Kalbsknochen', 'Lammknochen',
  ],
  tk: [
    'Beerenmischung TK', 'Heidelbeeren TK', 'Himbeeren TK', 'Mango TK',
    'Blattspinat TK', 'Erbsen TK', 'Erbsen und Möhren TK', 'Garnelen roh TK', 'Jiaozi-Teigblätter TK',
    'Pommes frites TK', 'Rahmspinat TK', 'Wan-Tan-Teigblätter TK',
    // selbst gekocht (Grundrezepte), portionsweise eingefroren
    'Rinderfond selbstgemacht', 'Kalbsfond selbstgemacht', 'Lammfond selbstgemacht',
  ],
  vorrat: [
    'BBQ-Sauce', 'Zimt gemahlen', 'Backpulver', 'Kreuzkümmel',
    'Apfelessig', 'Chili getrocknet', 'Chiliflocken', 'Currypulver', 'Frittieröl', 'Fünf-Gewürze-Pulver',
    'Gemüsebrühe', 'Honig', 'Hühnerbrühe', 'Kümmel', 'Kümmel gemahlen', 'Kürbiskernöl', 'Leinöl', 'Lorbeerblatt',
    'Majoran', 'Muskatnuss', 'Nelke', 'Olivenöl', 'Oregano getrocknet', 'Paprikapulver edelsüß',
    'Paprikapulver rosenscharf', 'Pfeffer', 'Pfeffer schwarz grob', 'Pfeffer weiß', 'Pfefferkörner', 'Puderzucker',
    'Rinderbrühe', 'Rotweinessig', 'Salz', 'Senf grobkörnig', 'Senf mittelscharf', 'Senf süß', 'Sesamöl',
    'Sojasauce', 'Sojasauce dunkel', 'Sonnenblumenöl', 'Speisestärke', 'Sternanis', 'Szechuanpfeffer',
    'Tomatenketchup', 'Vanillezucker', 'Wacholderbeere', 'Weißweinessig', 'Weizenmehl', 'Worcestersauce', 'Zimtstange',
    'Zucker',
    'Gemüsebrühe Pulver', 'Gemüsebrühe Würfel', 'Gemüsebrühe flüssig',
    'Hühnerbrühe Pulver', 'Hühnerbrühe Würfel', 'Hühnerbrühe flüssig',
    'Rinderbrühe Pulver', 'Rinderbrühe Würfel', 'Rinderbrühe flüssig',
  ],
}

/**
 * Grundzutaten (Kategorie "vorrat") gibt es in zwei Arten:
 * – Mengen-Grundzutaten (Öl, Brühe, Mehl, Zucker, Saucen …): wie normale Zutaten im Vorrat mit Menge geführt
 * – Gewürze: nur Status „da“ / „alle“, ohne Mengen
 */
export const SPICES = new Set([
  'Salz', 'Pfeffer', 'Pfeffer schwarz grob', 'Pfeffer weiß', 'Pfefferkörner', 'Muskatnuss', 'Paprikapulver edelsüß',
  'Paprikapulver rosenscharf', 'Kümmel', 'Kümmel gemahlen', 'Kreuzkümmel', 'Majoran', 'Oregano getrocknet', 'Lorbeerblatt',
  'Nelke', 'Zimt gemahlen', 'Zimtstange', 'Sternanis', 'Szechuanpfeffer', 'Fünf-Gewürze-Pulver', 'Currypulver',
  'Chili getrocknet', 'Chiliflocken', 'Wacholderbeere',
  // neue Gewürze aus src/data/extra (BBQ-Rubs, Cajun …)
  ...EXTRA_SPICES,
])

/** Brühen: Rezeptname → Formen im Vorrat (Pulver, Würfel, flüssig – alles in ml fertiger Brühe) */
export const BROTH_FORMS: Record<string, string[]> = {
  Gemüsebrühe: ['Gemüsebrühe Pulver', 'Gemüsebrühe Würfel', 'Gemüsebrühe flüssig'],
  Hühnerbrühe: ['Hühnerbrühe Pulver', 'Hühnerbrühe Würfel', 'Hühnerbrühe flüssig'],
  Rinderbrühe: ['Rinderbrühe Pulver', 'Rinderbrühe Würfel', 'Rinderbrühe flüssig'],
}

export const CATALOG: Record<string, ShopCat> = {}
for (const [cat, names] of Object.entries(groups) as [ShopCat, string[]][]) {
  for (const n of names) CATALOG[n] = cat
}

/** Zutaten aus src/data/extra, die es schon gab (Fehler in check-data – der eingebaute Eintrag gilt) */
export const EXTRA_DUPLICATES: string[] = []
for (const [cat, names] of Object.entries(EXTRA_CATALOG) as [ShopCat, string[]][])
  for (const n of names) {
    if (CATALOG[n]) EXTRA_DUPLICATES.push(n)
    else CATALOG[n] = cat
  }
// Ergebnisse von Backen & Desserts (z. B. „Bienenstich (selbstgebacken)“) liegen unter Backwaren,
// BBQ-Reste (vakuumiert eingefroren) unter Tiefkühl, Rubs/Saucen dort, wo `yields.cat` sagt
for (const { name, recipe } of EXTRA_YIELDS) if (!CATALOG[name]) CATALOG[name] = recipe.yields?.cat ?? 'backwaren'

/** Varianten, die auf der Einkaufsliste zusammengefasst werden */
export const SHOP_ALIAS: Record<string, string> = {
  Eigelb: 'Ei',
  'Apfel säuerlich': 'Apfel',
  'Ei hart gekocht': 'Ei',
  'Kalbsschnitzel klein': 'Kalbsschnitzel',
  'Schweineschnitzel klein': 'Schweineschnitzel',
  'Zitrone unbehandelt': 'Zitrone',
  // Gewürz-Varianten teilen sich einen Status / eine Packung
  'Pfeffer schwarz grob': 'Pfeffer',
  Pfefferkörner: 'Pfeffer',
  'Kümmel gemahlen': 'Kümmel',
  // Frittieröl ist Sonnenblumenöl
  Frittieröl: 'Sonnenblumenöl',
}

/**
 * Zusammengeführte Doppelungen (alter Name → neuer Name). Gespeicherte Stände (Vorrat, eigene Rezepte,
 * Preise …) werden beim Laden umbenannt; Mengen rechnet die App in die Einheit des neuen Produkts um.
 */
export const RENAMED: Record<string, string> = {
  'Kalbfleisch Schnitzel': 'Kalbsschnitzel',
  'Schweinefleisch Schnitzel': 'Schweineschnitzel',
  'Tomaten reif': 'Tomate',
  'Lauchzwiebel dick': 'Frühlingszwiebel',
}

/** Nicht-vegetarische Zutaten außerhalb der Fleisch/Fisch-Kategorie */
export const NON_VEG = new Set([
  'Corned Beef', 'Sardellenfilet', 'Thunfisch in Olivenöl', 'Fischsauce', 'Austernsauce', 'Garnelenpaste',
  'Rinderfond', 'Kalbsfond', 'Fischfond', 'Hühnerbrühe', 'Rinderbrühe', 'Garnelen roh TK', 'Jiaozi-Teigblätter TK',
  'Schweineschmalz', 'Lammfond', 'Rinderfond selbstgemacht', 'Kalbsfond selbstgemacht', 'Lammfond selbstgemacht',
  'Hühnerbrühe Pulver', 'Hühnerbrühe Würfel', 'Hühnerbrühe flüssig',
  'Rinderbrühe Pulver', 'Rinderbrühe Würfel', 'Rinderbrühe flüssig',
  ...EXTRA_NON_VEG,
])
// Ergebnisse aus Rezepten mit Fleisch (z. B. „Pulled Pork (vakuumiert)“, Rub mit Speck) sind nicht vegetarisch – zwei Durchgänge,
// falls ein Ergebnis aus einem anderen Ergebnis entsteht
for (let pass = 0; pass < 2; pass++)
  for (const { name, recipe } of EXTRA_YIELDS)
    if (recipe.ingredients.some((i) => CATALOG[i.name] === 'fleisch' || NON_VEG.has(i.name))) NON_VEG.add(name)
