import type { ShopCat } from '../types'

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
    'Lauchzwiebel dick', 'Limette', 'Majoran frisch', 'Möhre', 'Pak Choi', 'Paprika gelb', 'Paprika grün',
    'Paprika rot', 'Petersilie', 'Rosenkohl', 'Rosmarin', 'Rote Bete gekocht', 'Rotkohl', 'Rucola', 'Salatgurke',
    'Salbei', 'Schalotte', 'Schnittlauch', 'Schwarzkohl', 'Shiitake', 'Sojasprossen', 'Spargel weiß',
    'Spitzpaprika grün', 'Staudensellerie', 'Steckrübe', 'Thai-Basilikum', 'Thymian', 'Tomate', 'Tomaten reif',
    'Weißkohl', 'Wirsing', 'Zitrone', 'Zitrone unbehandelt', 'Zitronengras', 'Zucchini', 'Zuckerschoten', 'Zwiebel',
    'Zwiebel rot',
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
    'Perlgraupen', 'Pesto Genovese', 'Pfeffer grün eingelegt', 'Pinienkerne', 'Polenta', 'Rahmmais', 'Reisessig',
    'Rinderfond', 'Risottoreis', 'Rosinen', 'Röstzwiebeln', 'Rotwein', 'Safranfäden', 'Sake', 'Sardellenfilet',
    'Sauerkraut', 'Schälerbsen gelb', 'Sesam', 'Sesampaste', 'Shaoxing-Reiswein', 'Sojabohnenpaste gelb',
    'Steinpilze getrocknet', 'Sushireis', 'Tamarindenpaste', 'Tellerlinsen', 'Thunfisch in Olivenöl', 'Tomatenmark',
    'Walnusskerne', 'Weinbrand', 'Weiße Bohnen', 'Weißwein', 'Weizenmehl Tipo 00', 'Wodka', 'Yakisoba-Sauce',
    'Zuckerrübensirup',
  ],
  backwaren: ['Vollkornbrot', 'Vollkorn-Knäckebrot', 'Vollkorn-Tortilla','Brötchen vom Vortag', 'Ciabatta', 'Printen', 'Toastbrot', 'Toskanisches Brot', 'Weißbrot'],
  molkerei: [
    'Skyr', 'Magerquark', 'Hüttenkäse', 'Eiklar', 'Hummus',
    'Bandnudeln', 'Bergkäse', 'Bucatini', 'Butter', 'Butterschmalz', 'Cannelloni', 'Ditalini', 'Ei', 'Eigelb',
    'Ei hart gekocht', 'Emmentaler', 'Emmentaler gerieben', 'Feta', 'Fettuccine', 'Flammkuchenteig', 'Fusilli',
    'Gnocchi', 'Gorgonzola dolce', 'Gouda gerieben', 'Gruyère', 'Hefe frisch', 'Joghurt natur', 'Kartoffelsalat',
    'Lasagneplatten', 'Linguine', 'Maultaschen', 'Mie-Nudeln', 'Milch', 'Mozzarella', 'Orecchiette',
    'Parmigiano Reggiano', 'Pecorino Romano', 'Penne', 'Provolone', 'Ramen-Nudeln', 'Ravioli Ricotta-Spinat frisch',
    'Reisbandnudeln', 'Ricotta', 'Ricotta salata', 'Rigatoni', 'Sahne', 'Saure Sahne', 'Schmand', 'Schmelzkäse',
    'Schupfnudeln', 'Schweineschmalz', 'Spaghetti', 'Spätzle frisch', 'Speisequark', 'Suppennudeln', 'Tagliatelle',
    'Tofu natur', 'Tofu seiden', 'Tortellini frisch', 'Trofie', 'Weizennudeln asiatisch', 'Yakisoba-Nudeln', 'Ziti',
  ],
  fleisch: [
    'Bacon', 'Blutwurst', 'Bockwurst', 'Bratwurst', 'Cabanossi', 'Doradenfilet', 'Fleischwurst', 'Guanciale',
    'Hackfleisch gemischt', 'Hähnchenbrustfilet', 'Hähnchenflügel', 'Hähnchenschenkel', 'Hähnchenschenkelfilet',
    'Kabeljaufilet', 'Kalbfleisch Schnitzel', 'Kalbsbrät', 'Kalbshaxe in Scheiben', 'Kalbskotelett', 'Kalbsleber',
    'Kalbsschnitzel', 'Kalbsschnitzel klein', 'Kasseler Kotelett', 'Kasseler Nacken', 'Katenschinken', 'Kochschinken',
    'Lachsfilet', 'Lammschulter', 'Leberkäse', 'Markknochen', 'Matjesfilet', 'Mettenden', 'Miesmuscheln',
    'Nordseekrabben', 'Nürnberger Rostbratwürstchen', 'Pancetta', 'Parmaschinken', 'Pinkelwurst', 'Rinderbeinscheibe',
    'Rinderbraten aus der Keule', 'Rindergulasch', 'Rinderhackfleisch', 'Rinderhüfte', 'Rinderleber', 'Rinderroulade',
    'Rinderroulade dünn', 'Rollmops', 'Rumpsteak', 'Salami', 'Salami piccante', 'Salsiccia', 'Scholle küchenfertig',
    'Schweinebauch', 'Schweinebauch dünn geschnitten', 'Schweinebauch geräuchert', 'Schweinefilet',
    'Schweinefleisch Schnitzel', 'Schweinegulasch', 'Schweinehackfleisch', 'Schweinekotelett', 'Schweinenacken',
    'Schweineschnitzel', 'Schweineschnitzel klein', 'Schweineschulter mit Schwarte', 'Schweinshaxe hinten',
    'Seelachsfilet', 'Speckwürfel', 'Suppenfleisch Rind', 'Tafelspitz', 'Venusmuscheln', 'Wiener Würstchen',
  ],
  tk: [
    'Beerenmischung TK', 'Heidelbeeren TK', 'Himbeeren TK', 'Mango TK',
    'Blattspinat TK', 'Erbsen TK', 'Erbsen und Möhren TK', 'Garnelen roh TK', 'Jiaozi-Teigblätter TK',
    'Pommes frites TK', 'Rahmspinat TK', 'Wan-Tan-Teigblätter TK',
  ],
  vorrat: [
    'Zimt gemahlen', 'Backpulver', 'Kreuzkümmel',
    'Apfelessig', 'Chili getrocknet', 'Chiliflocken', 'Currypulver', 'Frittieröl', 'Fünf-Gewürze-Pulver',
    'Gemüsebrühe', 'Honig', 'Hühnerbrühe', 'Kümmel', 'Kümmel gemahlen', 'Kürbiskernöl', 'Leinöl', 'Lorbeerblatt',
    'Majoran', 'Muskatnuss', 'Nelke', 'Olivenöl', 'Oregano getrocknet', 'Paprikapulver edelsüß',
    'Paprikapulver rosenscharf', 'Pfeffer', 'Pfeffer schwarz grob', 'Pfeffer weiß', 'Pfefferkörner', 'Puderzucker',
    'Rinderbrühe', 'Rotweinessig', 'Salz', 'Senf grobkörnig', 'Senf mittelscharf', 'Senf süß', 'Sesamöl',
    'Sojasauce', 'Sojasauce dunkel', 'Sonnenblumenöl', 'Speisestärke', 'Sternanis', 'Szechuanpfeffer',
    'Tomatenketchup', 'Vanillezucker', 'Wacholderbeere', 'Weißweinessig', 'Weizenmehl', 'Worcestersauce', 'Zimtstange',
    'Zucker',
  ],
}

export const CATALOG: Record<string, ShopCat> = {}
for (const [cat, names] of Object.entries(groups) as [ShopCat, string[]][]) {
  for (const n of names) CATALOG[n] = cat
}

/** Varianten, die auf der Einkaufsliste zusammengefasst werden */
export const SHOP_ALIAS: Record<string, string> = {
  Eigelb: 'Ei',
  'Apfel säuerlich': 'Apfel',
  'Ei hart gekocht': 'Ei',
  'Kalbsschnitzel klein': 'Kalbsschnitzel',
  'Schweineschnitzel klein': 'Schweineschnitzel',
  'Zitrone unbehandelt': 'Zitrone',
}

/** Nicht-vegetarische Zutaten außerhalb der Fleisch/Fisch-Kategorie */
export const NON_VEG = new Set([
  'Corned Beef', 'Sardellenfilet', 'Thunfisch in Olivenöl', 'Fischsauce', 'Austernsauce', 'Garnelenpaste',
  'Rinderfond', 'Kalbsfond', 'Fischfond', 'Hühnerbrühe', 'Rinderbrühe', 'Garnelen roh TK', 'Jiaozi-Teigblätter TK',
  'Schweineschmalz',
])
