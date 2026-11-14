import { b } from './define'

/**
 * Meal-Prep-Frühstücke – Mengen für 1 Portion.
 * Ziel pro Portion: ca. 350–450 kcal, ≥ 25 g Eiweiß, ≥ 8 g Ballaststoffe.
 * fridgeDays = Tage haltbar im Kühlschrank ab Zubereitung (am Prep-Sonntag).
 */
export const breakfasts = [
  // ───────────── Süß & kalt ─────────────
  b('oats-apfel-zimt', 'Overnight Oats Apfel-Zimt', 'suess', 5, 3, false, 'Glas',
    '40 g Haferflocken | 150 g Skyr | 100 ml Milch | 10 g Chiasamen | 0.5 Stk Apfel | 1 TL Zimt gemahlen',
    [
      'Haferflocken, Chiasamen und Zimt ins Glas geben.',
      'Skyr und Milch dazu und gründlich verrühren, bis keine trockenen Flocken mehr zu sehen sind.',
      'Apfel erst morgens frisch reiben oder würfeln, so bleibt er knackig. Alternativ am Prep-Tag würfeln und mit etwas Zitronensaft beträufeln.',
      'Deckel drauf und in den Kühlschrank.',
    ],
    'Umrühren, Apfel drüber, kalt essen. Ist es zu fest, einen Schuss Milch dazugeben.', 'overnight oats apple cinnamon'),

  b('oats-beeren', 'Overnight Oats Beeren-Skyr', 'suess', 5, 3, false, 'Glas',
    '40 g Haferflocken | 150 g Skyr | 100 ml Milch | 10 g Chiasamen | 100 g Beerenmischung TK | 1 TL Honig',
    [
      'Haferflocken, Chiasamen, Skyr, Milch und Honig im Glas verrühren.',
      'Gefrorene Beeren obenauf geben. Sie tauen über Nacht auf und färben die Oats.',
      'Verschließen und kühl stellen.',
    ],
    'Einmal durchrühren und kalt genießen.', 'overnight oats berries'),

  b('oats-schoko-banane', 'Overnight Oats Schoko-Banane', 'suess', 5, 3, false, 'Glas',
    '40 g Haferflocken | 150 g Skyr | 100 ml Milch | 10 g Chiasamen | 1 EL Backkakao | 0.5 Stk Banane',
    [
      'Haferflocken, Chiasamen und Backkakao im Glas mischen.',
      'Skyr und Milch einrühren, bis eine glatte Schoko-Masse entsteht.',
      'Banane erst morgens in Scheiben schneiden. Sie wird sonst braun.',
      'Verschließen und kühl stellen.',
    ],
    'Banane in Scheiben obendrauf und umrühren.', 'chocolate overnight oats'),

  b('oats-karottenkuchen', 'Overnight Oats Karottenkuchen', 'suess', 10, 3, false, 'Glas',
    '40 g Haferflocken | 150 g Skyr | 100 ml Milch | 10 g Chiasamen | 0.5 Stk Möhre | 10 g Walnusskerne | 10 g Rosinen | 1 TL Zimt gemahlen',
    [
      'Möhre fein reiben.',
      'Mit Haferflocken, Chiasamen, Rosinen, Zimt, Skyr und Milch im Glas verrühren.',
      'Walnüsse grob hacken und separat in ein kleines Döschen geben, damit sie knackig bleiben.',
      'Kühl stellen.',
    ],
    'Walnüsse drüberstreuen. Schmeckt wie Karottenkuchen.', 'carrot cake overnight oats'),

  b('oats-erdnuss-apfel', 'Overnight Oats Erdnuss-Apfel', 'suess', 5, 3, false, 'Glas',
    '40 g Haferflocken | 150 g Skyr | 100 ml Milch | 10 g Chiasamen | 10 g Erdnussmus | 0.5 Stk Apfel',
    [
      'Erdnussmus mit der Milch glatt rühren.',
      'Haferflocken, Chiasamen und Skyr dazugeben und gut verrühren.',
      'Verschließen und kühl stellen.',
    ],
    'Apfel frisch würfeln und unterheben.', 'peanut butter overnight oats'),

  b('oats-mango-kokos', 'Overnight Oats Mango-Kokos', 'suess', 5, 3, false, 'Glas',
    '40 g Haferflocken | 150 g Skyr | 80 ml Milch | 10 g Chiasamen | 100 g Mango TK | 5 g Kokosraspeln',
    [
      'Haferflocken, Chiasamen, Skyr und Milch im Glas verrühren.',
      'Gefrorene Mangowürfel und Kokosraspeln obenauf geben.',
      'Verschließen und kühl stellen.',
    ],
    'Durchrühren und kalt essen.', 'mango overnight oats'),

  b('oats-himbeer-cheesecake', 'Overnight Oats Himbeer-Cheesecake', 'suess', 5, 3, false, 'Glas',
    '40 g Haferflocken | 150 g Magerquark | 100 ml Milch | 10 g Chiasamen | 100 g Himbeeren TK | 1 TL Honig | 1 Prise Zimt gemahlen',
    [
      'Magerquark mit Milch und Honig cremig rühren.',
      'Haferflocken und Chiasamen unterrühren und ins Glas füllen.',
      'Gefrorene Himbeeren obenauf geben.',
      'Verschließen und kühl stellen.',
    ],
    'Durchrühren. Schmeckt wie Käsekuchen mit Himbeeren.', 'raspberry overnight oats'),

  b('chia-beeren', 'Chia-Pudding mit Beeren und Skyr', 'suess', 5, 5, false, 'Glas',
    '25 g Chiasamen | 200 ml Milch | 150 g Skyr | 100 g Beerenmischung TK | 1 TL Honig',
    [
      'Chiasamen mit Milch und Honig verrühren, 10 Minuten quellen lassen und nochmals kräftig umrühren, damit nichts klumpt.',
      'Skyr in das Glas schichten, Chia-Pudding darauf geben.',
      'Gefrorene Beeren obenauf geben.',
      'Verschließen. Hält bis zu 5 Tage im Kühlschrank.',
    ],
    'Durchrühren und kalt genießen.', 'chia pudding berries'),

  b('chia-mango', 'Chia-Pudding Mango-Vanille', 'suess', 5, 5, false, 'Glas',
    '25 g Chiasamen | 200 ml Milch | 150 g Skyr | 100 g Mango TK | 1 TL Honig',
    [
      'Chiasamen mit Milch und Honig verrühren, 10 Minuten quellen lassen und nochmals umrühren.',
      'Skyr und Chia-Pudding ins Glas schichten.',
      'Gefrorene Mango obenauf geben.',
      'Verschließen. Hält bis zu 5 Tage im Kühlschrank.',
    ],
    'Durchrühren und kalt genießen.', 'mango chia pudding'),

  b('chia-schoko', 'Schoko-Chia-Pudding mit Banane', 'suess', 5, 4, false, 'Glas',
    '25 g Chiasamen | 200 ml Milch | 150 g Skyr | 1 EL Backkakao | 0.5 Stk Banane | 1 TL Honig',
    [
      'Backkakao mit etwas Milch glatt rühren, dann restliche Milch, Honig und Chiasamen einrühren.',
      'Nach 10 Minuten nochmals umrühren und mit dem Skyr ins Glas schichten.',
      'Verschließen und kühl stellen.',
    ],
    'Banane frisch in Scheiben dazu.', 'chocolate chia pudding'),

  b('quark-bowl-apfel', 'Quark-Bowl Apfel-Zimt mit Hafercrunch', 'suess', 10, 3, false, 'Dose',
    '200 g Magerquark | 1 Stk Apfel | 20 g Haferflocken | 5 g Walnusskerne | 10 g Leinsamen geschrotet | 1 TL Honig | 1 TL Zimt gemahlen',
    [
      'Haferflocken und gehackte Walnüsse ohne Fett in einer Pfanne goldbraun rösten, mit Zimt und Honig mischen und abkühlen lassen. Separat in ein Döschen füllen.',
      'Quark mit Leinsamen und einem Schuss Wasser cremig rühren und in die Dose füllen.',
      'Kühl stellen.',
    ],
    'Apfel frisch würfeln, Crunch drüber.', 'quark apple bowl'),

  b('skyr-birne', 'Skyr-Bowl Birne mit Leinsamen', 'suess', 5, 3, false, 'Dose',
    '200 g Skyr | 1 Stk Birne | 15 g Leinsamen geschrotet | 20 g Haferflocken | 1 Prise Zimt gemahlen',
    [
      'Skyr mit Leinsamen, Haferflocken und Zimt verrühren.',
      'In die Dose füllen, die Birne bleibt ganz (sie wird sonst braun).',
      'Kühl stellen. Die Flocken werden über Nacht schön weich.',
    ],
    'Birne frisch würfeln und unterheben.', 'skyr pear'),

  b('bircher', 'Protein-Bircher-Müsli', 'suess', 10, 3, false, 'Glas',
    '35 g Haferflocken | 150 g Skyr | 80 ml Milch | 1 Stk Apfel | 5 g Haselnusskerne | 10 g Leinsamen geschrotet | 0.25 Stk Zitrone',
    [
      'Haferflocken mit Milch und Leinsamen 10 Minuten einweichen.',
      'Apfel grob reiben, sofort mit Zitronensaft mischen und mit Skyr unter die Flocken heben.',
      'Gehackte Haselnüsse separat einpacken.',
      'Ins Glas füllen und kühl stellen.',
    ],
    'Nüsse drüber und kalt essen.', 'bircher muesli'),

  // ───────────── Herzhaft ─────────────
  b('eiermuffins-spinat-feta', 'Eiermuffins Spinat-Feta mit Vollkornbrot', 'herzhaft', 35, 4, true, 'Dose',
    '1 Stk Ei | 100 g Eiklar | 40 g Hüttenkäse | 100 g Blattspinat TK | 20 g Feta | 0.25 Stk Paprika rot | 1 Scheibe Vollkornbrot | 1 Stk Möhre | Salz | Pfeffer',
    [
      'Ofen auf 180 °C vorheizen, Muffinform fetten oder Silikonförmchen nehmen.',
      'Spinat auftauen und gut ausdrücken. Paprika klein würfeln.',
      'Ei, Eiklar und Hüttenkäse verquirlen, salzen und pfeffern. Spinat, Paprika und zerbröselten Feta unterrühren.',
      'In 3 Mulden pro Portion füllen und 20 Minuten backen, bis sie gestockt sind. Abkühlen lassen.',
      'Möhre in Sticks schneiden. Muffins, Möhrensticks und Brot zusammen in eine Dose packen.',
    ],
    'Kalt essen oder 40 Sekunden in die Mikrowelle. Dazu Brot und Möhrensticks.', 'egg muffins spinach'),

  b('eiermuffins-schinken', 'Eiermuffins Schinken-Paprika mit Vollkornbrot', 'herzhaft', 35, 4, true, 'Dose',
    '1 Stk Ei | 100 g Eiklar | 40 g Kochschinken | 0.5 Stk Paprika rot | 1 Stk Frühlingszwiebel | 15 g Gouda gerieben | 1 Scheibe Vollkornbrot | 1 Stk Möhre | Salz | Pfeffer',
    [
      'Ofen auf 180 °C vorheizen, Muffinform vorbereiten.',
      'Schinken, Paprika und Frühlingszwiebel klein schneiden.',
      'Ei und Eiklar verquirlen, würzen und mit Schinken und Gemüse mischen. In 3 Mulden pro Portion füllen und mit Käse bestreuen.',
      '20 Minuten backen und abkühlen lassen.',
      'Möhre in Sticks schneiden und mit Muffins und Brot in eine Dose packen.',
    ],
    'Kalt oder kurz in der Mikrowelle aufwärmen.', 'egg muffins ham'),

  b('burrito', 'Frühstücks-Burrito mit Ei und Bohnen', 'herzhaft', 30, 4, true, 'Alufolie/Dose',
    '1 Stk Vollkorn-Tortilla | 1 Stk Ei | 100 g Eiklar | 60 g Kidneybohnen | 0.25 Stk Paprika rot | 15 g Gouda gerieben | 2 EL Passierte Tomaten | 1 Prise Paprikapulver edelsüß | Salz | Pfeffer',
    [
      'Paprika würfeln und in einer beschichteten Pfanne kurz anbraten.',
      'Ei und Eiklar verquirlen, würzen, dazugeben und zu Rührei stocken lassen.',
      'Bohnen abspülen und mit passierten Tomaten und Paprikapulver kurz erwärmen.',
      'Tortilla mit Rührei, Bohnen und Käse füllen, die Seiten einklappen und fest aufrollen.',
      'Abkühlen lassen und in Backpapier und Alufolie wickeln. Für Do/Fr einfrieren.',
    ],
    'Folie ab, in Backpapier 1,5–2 Minuten in die Mikrowelle (gefroren 3 Minuten).', 'breakfast burrito'),

  b('wrap-haehnchen', 'Vollkorn-Wrap mit Hähnchen und Hummus', 'herzhaft', 25, 3, false, 'Dose',
    '1 Stk Vollkorn-Tortilla | 90 g Hähnchenbrustfilet | 30 g Hummus | 30 g Kopfsalat | 0.25 Stk Salatgurke | 0.25 Stk Paprika rot | 1 Stk Möhre | 0.5 TL Paprikapulver edelsüß | Salz | Pfeffer',
    [
      'Hähnchen mit Paprikapulver, Salz und Pfeffer würzen und in einer beschichteten Pfanne 5–6 Minuten je Seite durchbraten. Abkühlen lassen und in Streifen schneiden.',
      'Gemüse in Streifen schneiden, die Möhre als Sticks.',
      'Hummus und Salat in den Wrap geben. Am besten getrennt einpacken und erst auf der Arbeit füllen, dann weicht nichts durch.',
    ],
    'Wrap mit Hummus bestreichen, Hähnchen und Gemüse rein, aufrollen. Möhrensticks dazu.', 'chicken wrap hummus'),

  b('huettenkaese-glas', 'Hüttenkäse-Glas mit Gemüse und Knäckebrot', 'herzhaft', 10, 3, false, 'Glas',
    '200 g Hüttenkäse | 100 g Kirschtomaten | 0.25 Stk Salatgurke | 0.5 Stk Paprika rot | 0.25 Bund Schnittlauch | 15 g Leinsamen geschrotet | 2 Scheibe Vollkorn-Knäckebrot | Salz | Pfeffer',
    [
      'Gemüse klein würfeln, Schnittlauch fein schneiden.',
      'Hüttenkäse mit Schnittlauch, Leinsamen, Salz und Pfeffer verrühren.',
      'Gemüse unten ins Glas, Hüttenkäse darüber. Knäckebrot separat einpacken.',
    ],
    'Umrühren und mit dem Knäckebrot essen.', 'cottage cheese vegetables'),

  b('brot-box', 'Vollkornbrot-Box mit Ei, Hüttenkäse und Rohkost', 'herzhaft', 15, 3, false, 'Dose',
    '1 Scheibe Vollkornbrot | 2 Stk Ei | 100 g Hüttenkäse | 1 Stk Möhre | 0.5 Stk Paprika rot | 0.25 Stk Salatgurke | Salz | Pfeffer',
    [
      'Eier 9 Minuten hart kochen, abschrecken und ungeschält kühl lagern.',
      'Möhre, Paprika und Gurke in Sticks schneiden.',
      'Hüttenkäse würzen und mit Rohkost und Brot in eine Dose packen.',
    ],
    'Ei pellen, Brot mit Hüttenkäse bestreichen, Rohkost dazu.', 'boiled egg vegetables lunchbox'),

  b('frittata-stuecke', 'Gemüse-Frittata vom Blech mit Vollkornbrot', 'herzhaft', 35, 4, true, 'Dose',
    '1 Stk Ei | 120 g Eiklar | 1 Stk Zucchini | 0.5 Stk Paprika rot | 30 g Feta | 0.25 Stk Zwiebel | 1 Scheibe Vollkornbrot | Salz | Pfeffer',
    [
      'Ofen auf 180 °C vorheizen, eine kleine Auflaufform mit Backpapier auslegen.',
      'Zucchini, Paprika und Zwiebel würfeln und auf dem Blech verteilen.',
      'Ei und Eiklar verquirlen, würzen und darüber gießen. Feta darüber bröseln.',
      '25 Minuten backen, abkühlen lassen und in Portionsstücke schneiden.',
    ],
    'Kalt oder 1 Minute in der Mikrowelle aufwärmen, dazu das Brot.', 'vegetable frittata'),

  b('linsen-ei-salat', 'Herzhafter Linsensalat mit Ei und Feta', 'herzhaft', 30, 4, false, 'Glas',
    '50 g Tellerlinsen | 1 Stk Ei | 30 g Feta | 100 g Kirschtomaten | 0.25 Stk Salatgurke | 0.25 Bund Petersilie | 1 TL Olivenöl | 1 TL Weißweinessig | 0.5 TL Senf mittelscharf | Salz | Pfeffer',
    [
      'Linsen ca. 20 Minuten bissfest kochen, abgießen und abkühlen lassen.',
      'Ei 9 Minuten hart kochen.',
      'Öl, Essig und Senf verrühren, mit Linsen, Tomaten, Gurke und Petersilie mischen.',
      'Ins Glas füllen und Feta darüber bröseln. Ei ungeschält dazulegen.',
    ],
    'Ei pellen, halbieren, dazu essen. Herzhaft und hält lange satt.', 'lentil salad egg feta'),

  // ───────────── Warm (Mikrowelle) ─────────────
  b('baked-oats-blaubeer', 'Baked Oats Blaubeere im Glas', 'warm', 35, 4, true, 'Glas (ofenfest)',
    '40 g Haferflocken | 1 Stk Ei | 100 g Skyr | 50 ml Milch | 0.5 Stk Banane | 80 g Heidelbeeren TK | 10 g Chiasamen | 0.5 TL Backpulver',
    [
      'Ofen auf 180 °C vorheizen.',
      'Banane zerdrücken und mit Ei, Skyr, Milch, Haferflocken, Chiasamen und Backpulver verrühren.',
      'In ofenfeste Gläser oder Förmchen füllen und Heidelbeeren hineindrücken.',
      '25 Minuten backen, abkühlen lassen und verschließen. Portionen für Do/Fr einfrieren.',
    ],
    '1 Minute in der Mikrowelle erwärmen. Schmeckt wie warmer Kuchen.', 'baked oats blueberry'),

  b('baked-oats-apfel', 'Baked Oats Apfel-Zimt im Glas', 'warm', 35, 4, true, 'Glas (ofenfest)',
    '40 g Haferflocken | 1 Stk Ei | 100 g Skyr | 50 ml Milch | 1 Stk Apfel | 10 g Leinsamen geschrotet | 1 TL Zimt gemahlen | 0.5 TL Backpulver',
    [
      'Ofen auf 180 °C vorheizen. Den halben Apfel reiben, die andere Hälfte würfeln.',
      'Geriebenen Apfel mit Ei, Skyr, Milch, Haferflocken, Leinsamen, Zimt und Backpulver verrühren.',
      'In ofenfeste Gläser füllen und die Apfelwürfel obenauf verteilen.',
      '25 Minuten backen, abkühlen lassen und verschließen.',
    ],
    '1 Minute in der Mikrowelle erwärmen.', 'baked oats apple'),

  b('porridge-glas', 'Protein-Porridge zum Aufwärmen', 'warm', 10, 4, false, 'Glas',
    '40 g Haferflocken | 200 ml Milch | 100 g Skyr | 10 g Leinsamen geschrotet | 1 Stk Apfel | 1 TL Zimt gemahlen',
    [
      'Haferflocken, Leinsamen und Zimt trocken ins Glas geben (hält ewig).',
      'Skyr in ein kleines Döschen, den Apfel ganz lassen.',
      'Milch auf der Arbeit aus dem Kühlschrank nehmen oder im Fläschchen mitnehmen.',
    ],
    'Milch zu den Flocken, 2 Minuten in die Mikrowelle (zwischendurch umrühren), dann Skyr und gewürfelten Apfel unterrühren.', 'porridge apple'),

  b('savory-oats', 'Herzhafter Haferbrei mit Spinat und Ei', 'warm', 15, 3, false, 'Glas',
    '40 g Haferflocken | 200 ml Gemüsebrühe | 150 g Blattspinat TK | 10 g Leinsamen geschrotet | 1 Stk Ei | 100 g Hüttenkäse | Pfeffer',
    [
      'Ei 9 Minuten hart kochen.',
      'Haferflocken in der Brühe mit Spinat und Leinsamen 3 Minuten köcheln, Hüttenkäse unterrühren und pfeffern.',
      'Ins Glas füllen, Ei ungeschält dazu.',
    ],
    '1,5 Minuten in der Mikrowelle erwärmen, Ei pellen und in Scheiben drauf.', 'savory oatmeal egg spinach'),

  b('shakshuka-glas', 'Shakshuka mit Kichererbsen im Glas', 'warm', 30, 3, false, 'Glas',
    '1 Stk Ei | 100 g Eiklar | 150 g Gehackte Tomaten | 0.5 Stk Paprika rot | 0.25 Stk Zwiebel | 80 g Kichererbsen | 20 g Feta | 0.5 TL Paprikapulver edelsüß | 1 Prise Kreuzkümmel | 1 TL Olivenöl | Salz | Pfeffer',
    [
      'Zwiebel und Paprika im Öl andünsten, Gewürze kurz mitrösten.',
      'Tomaten und abgespülte Kichererbsen zugeben und 10 Minuten einkochen.',
      'Ei und Eiklar verquirlen, in die Sauce rühren und unter Rühren stocken lassen.',
      'In Gläser füllen und Feta darüber bröseln.',
    ],
    '1,5 Minuten in der Mikrowelle erwärmen.', 'shakshuka'),

  b('quarkauflauf', 'Apfel-Quark-Auflauf (ohne Zucker)', 'warm', 40, 4, true, 'Dose',
    '200 g Magerquark | 1 Stk Ei | 25 g Haferflocken | 0.5 Stk Apfel | 10 g Leinsamen geschrotet | 1 TL Zimt gemahlen | 0.5 TL Backpulver',
    [
      'Ofen auf 180 °C vorheizen.',
      'Quark, Ei, Haferflocken, Leinsamen, Zimt und Backpulver verrühren.',
      'In eine kleine Form füllen, Apfelscheiben obenauf legen.',
      '30 Minuten backen, abkühlen lassen und in Portionsstücke schneiden.',
    ],
    'Kalt oder 1 Minute in der Mikrowelle erwärmen.', 'quark casserole apple'),
]
