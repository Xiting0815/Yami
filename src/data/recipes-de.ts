import { fest, r } from './define'

// Deutsche Küche – alle Mengen für 2 Portionen
export const recipesDe = [
  // ───────────── Hauptgerichte ─────────────
  r('rinderrouladen', 'Rinderrouladen mit Rotkohl und Klößen', 'de', 'haupt', 150,
    '2 Stk Rinderroulade | 2 TL Senf mittelscharf | 4 Scheibe Bacon | 2 Stk Gewürzgurke | 2 Stk Zwiebel | 1 Stk Möhre | 100 g Knollensellerie | 1 EL Tomatenmark | 150 ml Rotwein | 300 ml Rinderfond | 2 EL Butterschmalz | 500 g Rotkohl | 1 Stk Apfel | 2 EL Rotweinessig | 1 EL Zucker | 1 Blatt Lorbeerblatt | 2 Stk Nelke | 500 g Kartoffeln mehligkochend | 40 g Speisestärke | Salz | Pfeffer',
    [
      'Rouladen flach klopfen, salzen, pfeffern und mit Senf bestreichen. Mit je 2 Scheiben Bacon, einer längs geviertelten Gewürzgurke und einer halben Zwiebel in Streifen belegen, aufrollen und mit Rouladennadeln oder Küchengarn fixieren.',
      'Butterschmalz im Bräter erhitzen, Rouladen rundum kräftig anbraten und herausnehmen. Restliche Zwiebel, Möhre und Sellerie gewürfelt anrösten, Tomatenmark kurz mitrösten, mit Rotwein ablöschen und einkochen lassen.',
      'Fond angießen, Rouladen zurück in den Bräter legen und zugedeckt 1,5 Stunden sanft schmoren. Sauce durch ein Sieb passieren, abschmecken und nach Wunsch mit etwas angerührter Stärke binden.',
      'Rotkohl fein hobeln, mit gewürfeltem Apfel, Essig, Zucker, Lorbeer, Nelken und 100 ml Wasser ca. 45 Minuten weich schmoren, mit Salz abschmecken.',
      'Für die Klöße Kartoffeln kochen, pellen, durchpressen und abkühlen lassen. Mit 30 g Stärke, Salz und etwas Muskat verkneten, Klöße formen und 20 Minuten in siedendem Salzwasser ziehen lassen.',
    ], 'Rinderrouladen'),

  r('sauerbraten', 'Rheinischer Sauerbraten', 'de', 'haupt', 180,
    '800 g Rinderbraten aus der Keule | 250 ml Rotwein | 250 ml Rotweinessig | 2 Stk Zwiebel | 1 Stk Möhre | 100 g Knollensellerie | 2 Blatt Lorbeerblatt | 5 Stk Wacholderbeere | 4 Stk Nelke | 1 TL Pfefferkörner | 2 EL Butterschmalz | 50 g Rosinen | 4 Stk Printen | 1 EL Zuckerrübensirup | 500 g Kartoffeln mehligkochend | 300 g Rotkohl | Salz',
    [
      'Wein, Essig, 250 ml Wasser, grob geschnittenes Gemüse und Gewürze aufkochen und abkühlen lassen. Das Fleisch darin zugedeckt im Kühlschrank 3 bis 5 Tage marinieren und täglich wenden.',
      'Fleisch herausnehmen, trocken tupfen und salzen. Die Marinade durch ein Sieb gießen und auffangen. Das Fleisch im Butterschmalz rundum scharf anbraten, das Gemüse aus der Marinade mitrösten.',
      'Mit 500 ml Marinade ablöschen und zugedeckt ca. 2 Stunden schmoren lassen, bis das Fleisch zart ist.',
      'Fleisch herausnehmen. Die Sauce passieren, zerbröselte Printen, Rosinen und Sirup einrühren und sämig einköcheln. Mit Salz und Zucker süß-sauer abschmecken.',
      'Dazu Salzkartoffeln oder Klöße und Rotkohl servieren.',
    ], 'Sauerbraten'),

  r('schweinebraten', 'Bayerischer Schweinebraten mit Kruste und Knödeln', 'de', 'haupt', 150,
    '800 g Schweineschulter mit Schwarte | 2 Stk Zwiebel | 1 Stk Möhre | 2 Zehe Knoblauch | 330 ml Dunkelbier | 1 TL Kümmel | 1 TL Majoran | 4 Stk Brötchen vom Vortag | 200 ml Milch | 2 Stk Ei | 0.5 Bund Petersilie | Salz | Pfeffer',
    [
      'Die Schwarte rautenförmig einschneiden, ohne das Fleisch zu verletzen. Das Fleisch kräftig mit Salz, Pfeffer, Kümmel, Majoran und Knoblauch einreiben.',
      'Den Braten mit der Schwarte nach unten in einen Bräter mit 2 cm Wasser legen und bei 180 °C 30 Minuten garen. Umdrehen, grob geschnittene Zwiebeln und Möhre zugeben und weitere 90 Minuten garen. Dabei immer wieder mit Bier übergießen.',
      'Für die Kruste die letzten 15 Minuten den Grill zuschalten, bis die Schwarte aufpoppt.',
      'Für die Semmelknödel die Brötchen würfeln, mit warmer Milch übergießen und 15 Minuten ziehen lassen. Eier, Petersilie und Salz untermischen, Knödel formen und 20 Minuten in siedendem Salzwasser ziehen lassen.',
      'Den Bratensatz durch ein Sieb streichen, abschmecken und zum Braten mit den Knödeln servieren.',
    ], 'Schweinebraten'),

  r('wiener-schnitzel', 'Wiener Schnitzel mit Kartoffel-Gurken-Salat', 'de', 'haupt', 60,
    '2 Stk Kalbsschnitzel | 2 Stk Ei | 60 g Weizenmehl | 100 g Paniermehl | 100 g Butterschmalz | 1 Stk Zitrone | 500 g Kartoffeln festkochend | 0.5 Stk Salatgurke | 1 Stk Zwiebel | 200 ml Gemüsebrühe | 3 EL Weißweinessig | 3 EL Sonnenblumenöl | 1 TL Senf mittelscharf | 0.5 Bund Schnittlauch | Salz | Pfeffer | Zucker',
    [
      'Kartoffeln als Pellkartoffeln kochen, pellen und noch warm in Scheiben schneiden. Fein gewürfelte Zwiebel in der Brühe aufkochen, mit Essig, Senf, Salz, Pfeffer und einer Prise Zucker über die Kartoffeln gießen und 30 Minuten ziehen lassen.',
      'Gurke fein hobeln, leicht salzen, ausdrücken und mit Öl und Schnittlauch unter den Salat heben.',
      'Schnitzel zwischen Frischhaltefolie dünn klopfen (ca. 4 mm), salzen und pfeffern. Nacheinander in Mehl, verquirltem Ei und Paniermehl wenden. Die Panade nicht andrücken.',
      'Butterschmalz in einer großen Pfanne fingerhoch erhitzen. Die Schnitzel schwimmend 2 bis 3 Minuten je Seite goldbraun ausbacken, dabei die Pfanne schwenken, damit die Panade souffliert. Auf Küchenpapier abtropfen lassen und mit Zitronenspalten servieren.',
    ], 'Wiener Schnitzel'),

  r('jaegerschnitzel', 'Jägerschnitzel mit Spätzle', 'de', 'haupt', 45,
    '2 Stk Schweineschnitzel | 250 g Champignons | 1 Stk Zwiebel | 50 g Speckwürfel | 150 ml Sahne | 150 ml Rinderfond | 2 EL Weizenmehl | 2 EL Butterschmalz | 300 g Spätzle frisch | 1 EL Butter | 0.5 Bund Petersilie | Salz | Pfeffer | Paprikapulver edelsüß',
    [
      'Schnitzel flach klopfen, mit Salz, Pfeffer und Paprika würzen und leicht mehlieren. Im heißen Butterschmalz 3 Minuten je Seite braten und im Ofen bei 80 °C warm halten.',
      'Im Bratfett Speck und Zwiebelwürfel anbraten, dann die in Scheiben geschnittenen Champignons zugeben und kräftig braten.',
      'Mit Fond und Sahne ablöschen, 5 Minuten einköcheln lassen und mit Salz und Pfeffer abschmecken. Petersilie unterrühren.',
      'Spätzle in Butter schwenken und mit Schnitzel und Pilzsauce servieren.',
    ], 'Jägerschnitzel'),

  r('paprikaschnitzel', 'Paprikaschnitzel mit Pommes', 'de', 'haupt', 45,
    '2 Stk Schweineschnitzel | 1 Stk Paprika rot | 1 Stk Paprika gelb | 1 Stk Zwiebel | 1 EL Tomatenmark | 200 g Passierte Tomaten | 100 ml Gemüsebrühe | 1 TL Paprikapulver edelsüß | 1 TL Paprikapulver rosenscharf | 2 EL Weizenmehl | 2 EL Butterschmalz | 400 g Pommes frites TK | Salz | Pfeffer | Zucker',
    [
      'Pommes nach Packungsanweisung im Ofen backen.',
      'Schnitzel flach klopfen, würzen, mehlieren und im Butterschmalz 3 Minuten je Seite braten. Warm halten.',
      'Paprika und Zwiebel in Streifen schneiden und im Bratfett andünsten. Tomatenmark und Paprikapulver kurz mitrösten.',
      'Passierte Tomaten und Brühe zugeben und 10 Minuten köcheln lassen. Mit Salz, Pfeffer und einer Prise Zucker abschmecken und über die Schnitzel geben.',
    ], 'Paprikaschnitzel'),

  r('rahmschnitzel', 'Rahmschnitzel mit Butterspätzle', 'de', 'haupt', 35,
    '2 Stk Schweineschnitzel | 1 Stk Schalotte | 200 ml Sahne | 100 ml Rinderfond | 1 TL Senf mittelscharf | 2 EL Weizenmehl | 2 EL Butterschmalz | 300 g Spätzle frisch | 1 EL Butter | Salz | Pfeffer',
    [
      'Schnitzel dünn klopfen, salzen, pfeffern, mehlieren und in Butterschmalz goldbraun braten. Herausnehmen und warm halten.',
      'Schalottenwürfel im Bratfett glasig dünsten, mit Fond ablöschen und den Bratensatz lösen.',
      'Sahne und Senf zugeben und cremig einkochen. Abschmecken und die Schnitzel kurz in der Sauce ziehen lassen.',
      'Spätzle in Butter goldgelb anbraten und dazu servieren.',
    ], 'Rahmschnitzel'),

  r('cordon-bleu', 'Cordon bleu mit Bratkartoffeln', 'de', 'haupt', 50,
    '2 Stk Schweineschnitzel | 2 Scheibe Kochschinken | 2 Scheibe Emmentaler | 2 Stk Ei | 50 g Weizenmehl | 100 g Paniermehl | 80 g Butterschmalz | 500 g Kartoffeln festkochend | 1 Stk Zwiebel | 50 g Speckwürfel | 1 Stk Zitrone | Salz | Pfeffer',
    [
      'Kartoffeln am Vortag oder vorab als Pellkartoffeln kochen, pellen und in Scheiben schneiden.',
      'Schnitzel seitlich zu einer Tasche einschneiden oder dünn klopfen. Mit Schinken und Käse füllen, zuklappen und die Ränder andrücken. Salzen und pfeffern.',
      'In Mehl, Ei und Paniermehl panieren und in reichlich Butterschmalz bei mittlerer Hitze je Seite 4 bis 5 Minuten goldbraun braten.',
      'Kartoffeln in einer zweiten Pfanne mit etwas Fett knusprig braten, Speck und Zwiebel zugeben und mit Salz und Pfeffer würzen. Mit Zitrone servieren.',
    ], 'Cordon bleu'),

  r('koenigsberger-klopse', 'Königsberger Klopse mit Kapernsauce', 'de', 'haupt', 50,
    '400 g Hackfleisch gemischt | 1 Stk Brötchen vom Vortag | 1 Stk Ei | 1 Stk Zwiebel | 2 Stk Sardellenfilet | 1 l Gemüsebrühe | 30 g Butter | 30 g Weizenmehl | 100 ml Sahne | 2 EL Kapern | 1 Stk Eigelb | 1 Stk Zitrone | 400 g Kartoffeln festkochend | Salz | Pfeffer',
    [
      'Brötchen einweichen und gut ausdrücken. Mit Hack, Ei, fein gewürfelter Zwiebel, gehackten Sardellen, Salz und Pfeffer verkneten und 8 Klopse formen.',
      'Brühe aufkochen, Klopse hineingeben und bei schwacher Hitze 15 Minuten gar ziehen lassen. Herausnehmen und die Brühe aufbewahren.',
      'Butter schmelzen, Mehl darin anschwitzen und nach und nach 400 ml Brühe einrühren. 5 Minuten köcheln lassen, dann Sahne und Kapern zugeben.',
      'Topf vom Herd nehmen, Eigelb einrühren (nicht mehr kochen) und mit Zitronensaft, Salz und Pfeffer abschmecken. Klopse in der Sauce erwärmen und mit Salzkartoffeln servieren.',
    ], 'Königsberger Klopse'),

  r('frikadellen', 'Frikadellen mit Kartoffelpüree und Erbsen-Möhren', 'de', 'haupt', 45,
    '400 g Hackfleisch gemischt | 1 Stk Brötchen vom Vortag | 1 Stk Ei | 1 Stk Zwiebel | 1 TL Senf mittelscharf | 0.5 TL Majoran | 2 EL Butterschmalz | 600 g Kartoffeln mehligkochend | 150 ml Milch | 40 g Butter | 300 g Erbsen und Möhren TK | Muskatnuss | Salz | Pfeffer | Paprikapulver edelsüß',
    [
      'Brötchen einweichen und ausdrücken. Zwiebel fein würfeln und glasig dünsten. Mit Hack, Ei, Senf, Majoran, Salz, Pfeffer und Paprika verkneten und 6 flache Frikadellen formen.',
      'Frikadellen im Butterschmalz bei mittlerer Hitze 5 bis 6 Minuten je Seite braten.',
      'Kartoffeln schälen, in Salzwasser weich kochen, abgießen und mit heißer Milch und Butter stampfen. Mit Muskat und Salz abschmecken.',
      'Erbsen und Möhren mit etwas Butter und wenig Wasser 5 Minuten dünsten, salzen und servieren.',
    ], 'Frikadellen'),

  r('rindergulasch', 'Rindergulasch mit Bandnudeln', 'de', 'haupt', 150,
    '600 g Rindergulasch | 400 g Zwiebel | 1 Stk Paprika rot | 2 EL Tomatenmark | 2 EL Paprikapulver edelsüß | 1 TL Paprikapulver rosenscharf | 1 TL Kümmel gemahlen | 1 TL Majoran | 2 Zehe Knoblauch | 150 ml Rotwein | 500 ml Rinderfond | 2 EL Butterschmalz | 250 g Bandnudeln | Salz | Pfeffer',
    [
      'Fleisch trocken tupfen und portionsweise im heißen Butterschmalz kräftig anbraten. Herausnehmen.',
      'Zwiebeln in Streifen schneiden und im Bräter 10 Minuten goldbraun schmoren. Tomatenmark und Paprikapulver kurz mitrösten, das Pulver darf nicht verbrennen.',
      'Mit Rotwein ablöschen, Fleisch, Fond, Kümmel, Majoran und gehackten Knoblauch zugeben. Zugedeckt 1,5 bis 2 Stunden schmoren lassen, bis das Fleisch zart ist.',
      'Paprika würfeln und 20 Minuten vor Schluss zugeben. Abschmecken und mit Bandnudeln servieren.',
    ], 'Rindergulasch'),

  r('szegediner-gulasch', 'Szegediner Gulasch mit Salzkartoffeln', 'de', 'haupt', 100,
    '500 g Schweinegulasch | 2 Stk Zwiebel | 500 g Sauerkraut | 1 EL Tomatenmark | 2 EL Paprikapulver edelsüß | 1 TL Kümmel | 400 ml Gemüsebrühe | 100 g Schmand | 2 EL Sonnenblumenöl | 400 g Kartoffeln festkochend | Salz | Pfeffer',
    [
      'Fleisch im Öl anbraten, gewürfelte Zwiebeln zugeben und glasig schmoren.',
      'Tomatenmark und Paprikapulver kurz mitrösten und mit Brühe ablöschen. Kümmel zugeben und 40 Minuten schmoren lassen.',
      'Sauerkraut kurz abspülen, zugeben und weitere 30 Minuten garen.',
      'Mit Salz und Pfeffer abschmecken. Mit einem Klecks Schmand und Salzkartoffeln servieren.',
    ], 'Szegediner Gulasch'),

  r('kassler-sauerkraut', 'Kasseler mit Sauerkraut und Kartoffelpüree', 'de', 'haupt', 60,
    '500 g Kasseler Kotelett | 500 g Sauerkraut | 1 Stk Zwiebel | 1 Stk Apfel | 1 EL Butterschmalz | 150 ml Weißwein | 1 Blatt Lorbeerblatt | 4 Stk Wacholderbeere | 600 g Kartoffeln mehligkochend | 150 ml Milch | 40 g Butter | Muskatnuss | Salz | Zucker',
    [
      'Zwiebel würfeln und in Butterschmalz andünsten. Sauerkraut, gewürfelten Apfel, Wein, Lorbeer, Wacholder und 100 ml Wasser zugeben.',
      'Kasseler auf das Kraut legen und alles zugedeckt 40 Minuten sanft garen. Mit einer Prise Zucker abschmecken.',
      'Kartoffeln schälen, kochen und mit heißer Milch und Butter zu Püree stampfen. Mit Muskat und Salz würzen.',
      'Kasseler in Scheiben schneiden und mit Kraut und Püree servieren.',
    ], 'Kassler mit Sauerkraut'),

  r('leberkaese', 'Leberkäse mit Spiegelei und Bratkartoffeln', 'de', 'haupt', 35,
    '2 Scheibe Leberkäse | 2 Stk Ei | 500 g Kartoffeln festkochend | 1 Stk Zwiebel | 3 EL Butterschmalz | 2 EL Senf süß | Salz | Pfeffer | Kümmel',
    [
      'Kartoffeln als Pellkartoffeln vorkochen, pellen und in Scheiben schneiden.',
      'In 2 EL Butterschmalz ohne zu wenden 5 Minuten anbraten, dann wenden und knusprig braten. Zwiebelwürfel zugeben und mit Salz, Pfeffer und etwas Kümmel würzen.',
      'Leberkäse-Scheiben in einer zweiten Pfanne von beiden Seiten knusprig braten. Daneben die Spiegeleier braten.',
      'Mit süßem Senf servieren.',
    ], 'Leberkäse Spiegelei'),

  r('bratwurst-sauerkraut', 'Nürnberger Rostbratwürstchen mit Sauerkraut und Püree', 'de', 'haupt', 45,
    '8 Stk Nürnberger Rostbratwürstchen | 500 g Sauerkraut | 1 Stk Zwiebel | 50 g Speckwürfel | 1 TL Kümmel | 1 Blatt Lorbeerblatt | 600 g Kartoffeln mehligkochend | 150 ml Milch | 40 g Butter | 1 EL Butterschmalz | Muskatnuss | Salz | Senf mittelscharf',
    [
      'Speck und Zwiebel anbraten, Sauerkraut, Kümmel, Lorbeer und 100 ml Wasser zugeben und 30 Minuten schmoren.',
      'Kartoffeln kochen und mit heißer Milch und Butter zu Püree stampfen. Mit Muskat und Salz würzen.',
      'Würstchen im Butterschmalz rundum braun braten.',
      'Mit Senf servieren.',
    ], 'Nürnberger Rostbratwurst'),

  r('currywurst', 'Currywurst mit Pommes', 'de', 'haupt', 35,
    '4 Stk Bratwurst | 1 Stk Zwiebel | 1 EL Tomatenmark | 300 g Passierte Tomaten | 2 EL Currypulver | 1 TL Paprikapulver edelsüß | 2 EL Apfelessig | 2 EL Zucker | 1 EL Worcestersauce | 400 g Pommes frites TK | 1 EL Sonnenblumenöl | Salz',
    [
      'Pommes nach Packungsanweisung backen.',
      'Für die Sauce die Zwiebel fein würfeln und in Öl anschwitzen. Tomatenmark, Curry und Paprika kurz mitrösten.',
      'Passierte Tomaten, Essig, Zucker und Worcestersauce zugeben und 10 Minuten köcheln lassen. Fein pürieren und abschmecken.',
      'Würste braten, in Scheiben schneiden, mit Sauce übergießen und mit Currypulver bestäuben.',
    ], 'Currywurst'),

  r('kaesespaetzle', 'Allgäuer Käsespätzle mit Röstzwiebeln', 'de', 'haupt', 40,
    '250 g Weizenmehl | 3 Stk Ei | 200 g Bergkäse | 3 Stk Zwiebel | 40 g Butter | 0.5 Bund Schnittlauch | Muskatnuss | Salz | Pfeffer',
    [
      'Mehl, Eier, 1 TL Salz und ca. 80 ml Wasser zu einem zähen Teig schlagen, bis er Blasen wirft. 10 Minuten ruhen lassen.',
      'Zwiebeln in Ringe schneiden und in Butter langsam goldbraun rösten.',
      'Teig portionsweise ins siedende Salzwasser schaben oder pressen. Sobald die Spätzle oben schwimmen, abschöpfen.',
      'Spätzle und geriebenen Käse lagenweise in eine vorgewärmte Form schichten, mit Pfeffer und Muskat würzen und kurz in den Ofen stellen. Mit Röstzwiebeln und Schnittlauch servieren.',
    ], 'Käsespätzle'),

  r('krautschupfnudeln', 'Schupfnudeln mit Sauerkraut und Speck', 'de', 'haupt', 30,
    '500 g Schupfnudeln | 400 g Sauerkraut | 100 g Speckwürfel | 1 Stk Zwiebel | 1 EL Butterschmalz | 0.5 TL Kümmel | 50 ml Gemüsebrühe | Salz | Pfeffer',
    [
      'Speck im Butterschmalz knusprig auslassen, Zwiebelwürfel zugeben und glasig dünsten.',
      'Sauerkraut, Kümmel und Brühe zugeben und 10 Minuten dünsten.',
      'Schupfnudeln in einer zweiten Pfanne goldbraun braten.',
      'Alles vermengen, kurz zusammen braten und mit Pfeffer abschmecken.',
    ], 'Schupfnudeln Sauerkraut'),

  r('geschmaelzte-maultaschen', 'Geschmälzte Maultaschen mit Zwiebeln und Ei', 'de', 'haupt', 25,
    '6 Stk Maultaschen | 2 Stk Zwiebel | 3 Stk Ei | 30 g Butter | 0.5 Bund Schnittlauch | 200 g Kartoffelsalat | Salz | Pfeffer',
    [
      'Maultaschen in Streifen schneiden.',
      'Zwiebeln in Ringe schneiden und in Butter goldbraun braten.',
      'Maultaschen zugeben und anbraten. Eier verquirlen, salzen, pfeffern und darüber gießen, dann stocken lassen.',
      'Mit Schnittlauch bestreuen und nach schwäbischer Art mit Kartoffelsalat servieren.',
    ], 'Maultaschen'),

  r('kartoffelpuffer', 'Kartoffelpuffer mit Apfelmus', 'de', 'haupt', 40,
    '800 g Kartoffeln mehligkochend | 1 Stk Zwiebel | 2 Stk Ei | 2 EL Weizenmehl | 100 ml Sonnenblumenöl | 1 Glas Apfelmus | Muskatnuss | Salz',
    [
      'Kartoffeln schälen und mit der Zwiebel fein reiben. In einem Tuch kräftig ausdrücken.',
      'Mit Eiern, Mehl, Salz und Muskat vermengen.',
      'Öl in einer Pfanne erhitzen, je 1 bis 2 EL Teig hineingeben, flach drücken und von beiden Seiten 3 bis 4 Minuten knusprig braten.',
      'Auf Küchenpapier abtropfen lassen und mit Apfelmus servieren.',
    ], 'Kartoffelpuffer Apfelmus'),

  r('himmel-und-erde', 'Himmel und Erde mit gebratener Blutwurst', 'de', 'haupt', 40,
    '600 g Kartoffeln mehligkochend | 3 Stk Apfel säuerlich | 300 g Blutwurst | 2 Stk Zwiebel | 40 g Butter | 100 ml Milch | 1 EL Zucker | 1 EL Butterschmalz | Muskatnuss | Salz',
    [
      'Kartoffeln schälen, kochen und mit Milch und Butter stampfen. Mit Salz und Muskat würzen.',
      'Äpfel schälen, entkernen, würfeln und mit Zucker und etwas Wasser zu stückigem Kompott dünsten. Unter das Püree heben.',
      'Zwiebeln in Ringe schneiden und in Butterschmalz goldbraun braten.',
      'Blutwurst in dicke Scheiben schneiden und von beiden Seiten kurz anbraten. Mit Zwiebeln auf dem Püree anrichten.',
    ], 'Himmel un Ääd'),

  r('labskaus', 'Labskaus mit Spiegelei und Rollmops', 'de', 'haupt', 50,
    '300 g Corned Beef | 500 g Kartoffeln mehligkochend | 1 Stk Zwiebel | 150 g Rote Bete gekocht | 2 Stk Gewürzgurke | 2 Stk Rollmops | 2 Stk Ei | 1 EL Butterschmalz | Salz | Pfeffer',
    [
      'Kartoffeln schälen, weich kochen und grob stampfen.',
      'Zwiebel würfeln und im Butterschmalz glasig dünsten. Corned Beef zerpflücken, zugeben und mit etwas Gurkenwasser und Rote-Bete-Saft mischen.',
      'Kartoffeln und die Hälfte der gewürfelten Rote Bete unterrühren, bis alles rosa ist. Mit Pfeffer abschmecken.',
      'Mit Spiegelei, Rollmops, Gewürzgurke und restlicher Rote Bete servieren.',
    ], 'Labskaus'),

  r('senfeier', 'Senfeier mit Kartoffelpüree', 'de', 'haupt', 30,
    '6 Stk Ei | 30 g Butter | 30 g Weizenmehl | 300 ml Gemüsebrühe | 150 ml Sahne | 3 EL Senf mittelscharf | 1 EL Senf grobkörnig | 600 g Kartoffeln mehligkochend | 150 ml Milch | 0.5 Bund Schnittlauch | Muskatnuss | Salz | Zucker',
    [
      'Eier 8 Minuten wachsweich kochen, abschrecken und pellen.',
      'Butter schmelzen, Mehl anschwitzen, mit Brühe und Sahne aufgießen und 5 Minuten köcheln lassen. Beide Senfsorten einrühren und mit Salz und einer Prise Zucker abschmecken.',
      'Kartoffeln kochen und mit Milch und Butter zu Püree stampfen.',
      'Eier halbieren, in die Sauce legen und mit Schnittlauch und Püree servieren.',
    ], 'Senfeier'),

  r('spinat-spiegelei', 'Rahmspinat mit Spiegelei und Salzkartoffeln', 'de', 'haupt', 30,
    '450 g Rahmspinat TK | 4 Stk Ei | 600 g Kartoffeln festkochend | 1 EL Butter | Muskatnuss | Salz | Pfeffer',
    [
      'Kartoffeln schälen und in Salzwasser ca. 20 Minuten gar kochen.',
      'Rahmspinat nach Packungsanweisung erhitzen und mit Muskat und Pfeffer abschmecken.',
      'Spiegeleier in Butter braten.',
      'Alles zusammen anrichten. Ein Klassiker wie bei Oma.',
    ], 'Spinat Spiegelei Kartoffeln'),

  r('huehnerfrikassee', 'Hühnerfrikassee mit Reis', 'de', 'haupt', 50,
    '400 g Hähnchenbrustfilet | 200 g Champignons | 150 g Spargel weiß | 100 g Erbsen TK | 30 g Butter | 30 g Weizenmehl | 400 ml Hühnerbrühe | 100 ml Sahne | 1 Stk Zitrone | 150 g Langkornreis | 1 EL Kapern | Salz | Pfeffer',
    [
      'Hähnchen in der Brühe ca. 15 Minuten gar ziehen lassen, herausnehmen und in Stücke schneiden. Die Brühe aufbewahren.',
      'Spargel in Stücke schneiden und mit den geviertelten Champignons in Butter andünsten. Mehl darüber stäuben und anschwitzen.',
      'Mit Brühe und Sahne aufgießen und 5 Minuten köcheln lassen. Erbsen, Kapern und Fleisch zugeben und mit Zitrone, Salz und Pfeffer abschmecken.',
      'Den Reis nach Packungsanweisung kochen und dazu servieren.',
    ], 'Hühnerfrikassee'),

  r('haehnchen-rahm-bandnudeln', 'Hähnchen-Champignon-Rahmgeschnetzeltes mit Bandnudeln', 'de', 'haupt', 30,
    '400 g Hähnchenbrustfilet | 250 g Champignons | 1 Stk Zwiebel | 200 ml Sahne | 100 ml Hühnerbrühe | 1 TL Senf mittelscharf | 1 TL Paprikapulver edelsüß | 1 TL Speisestärke | 2 EL Sonnenblumenöl | 250 g Bandnudeln | 0.5 Bund Petersilie | Salz | Pfeffer',
    [
      'Bandnudeln in reichlich Salzwasser nach Packungsangabe bissfest kochen.',
      'Hähnchenbrust in schmale Streifen schneiden, mit Salz, Pfeffer und Paprikapulver würzen und in Öl in einer großen Pfanne 4 bis 5 Minuten rundum goldbraun braten. Herausnehmen.',
      'Zwiebel würfeln, Champignons in Scheiben schneiden und im Bratfett 5 Minuten anbraten, bis sie Farbe haben.',
      'Mit Brühe ablöschen, Sahne und Senf einrühren und 3 Minuten köcheln. Stärke in wenig kaltem Wasser anrühren und die Soße damit leicht binden.',
      'Hähnchen zurück in die Soße geben und nur noch erwärmen. Abschmecken, mit Petersilie bestreuen und mit den Bandnudeln servieren.',
    ], 'chicken mushroom cream sauce tagliatelle'),

  r('zuercher-geschnetzeltes', 'Zürcher Geschnetzeltes mit Rösti', 'de', 'haupt', 45,
    '400 g Kalbsschnitzel | 200 g Champignons | 1 Stk Schalotte | 100 ml Weißwein | 200 ml Sahne | 100 ml Kalbsfond | 1 EL Weizenmehl | 2 EL Butterschmalz | 600 g Kartoffeln festkochend | 0.5 Bund Petersilie | Salz | Pfeffer',
    [
      'Kartoffeln vorab als Pellkartoffeln kochen, auskühlen lassen und grob raspeln. Salzen, in Butterschmalz zu 2 Rösti formen und von jeder Seite 8 Minuten knusprig braten.',
      'Fleisch in feine Streifen schneiden, leicht mehlieren und portionsweise scharf anbraten. Herausnehmen.',
      'Schalotte und Champignons im Bratfett andünsten, mit Wein ablöschen, dann Fond und Sahne zugeben und sämig einkochen.',
      'Das Fleisch nur noch erwärmen, nicht mehr kochen. Abschmecken, mit Petersilie bestreuen und mit Rösti servieren.',
    ], 'Zürcher Geschnetzeltes'),

  r('schweinemedaillons-pfefferrahm', 'Schweinemedaillons in Pfefferrahm mit Spätzle', 'de', 'haupt', 35,
    '400 g Schweinefilet | 1 Stk Schalotte | 1 EL Pfeffer grün eingelegt | 200 ml Sahne | 50 ml Weinbrand | 100 ml Rinderfond | 1 EL Butterschmalz | 300 g Spätzle frisch | 1 EL Butter | Salz',
    [
      'Filet in 3 cm dicke Medaillons schneiden und leicht flach drücken.',
      'Im heißen Butterschmalz 3 Minuten je Seite braten, salzen und im Ofen bei 80 °C warm halten.',
      'Schalotte im Bratfett andünsten, mit Weinbrand ablöschen, dann Fond, Sahne und grünen Pfeffer zugeben und cremig einkochen.',
      'Spätzle in Butter schwenken und mit den Medaillons und der Sauce servieren.',
    ], 'Schweinemedaillons'),

  r('kohlrouladen', 'Kohlrouladen in Tomatensauce', 'de', 'haupt', 90,
    '1 Stk Weißkohl | 400 g Hackfleisch gemischt | 1 Stk Brötchen vom Vortag | 1 Stk Ei | 1 Stk Zwiebel | 2 EL Tomatenmark | 400 ml Rinderfond | 100 g Schmand | 2 EL Butterschmalz | 500 g Kartoffeln festkochend | Kümmel | Salz | Pfeffer | Paprikapulver edelsüß',
    [
      'Den Strunk des Kohls herausschneiden, den Kohl in Salzwasser kochen und 8 große Blätter nach und nach ablösen. Die dicken Blattrippen flach schneiden.',
      'Hack mit eingeweichtem Brötchen, Ei, Zwiebelwürfeln, Salz, Pfeffer, Paprika und Kümmel verkneten. Auf die Blätter verteilen, einrollen und mit Garn binden.',
      'Rouladen im Butterschmalz rundum anbraten, Tomatenmark mitrösten und mit Fond ablöschen.',
      'Zugedeckt 45 Minuten schmoren lassen. Die Sauce mit Schmand verfeinern und mit Salzkartoffeln servieren.',
    ], 'Kohlrouladen'),

  r('gefuellte-paprika', 'Gefüllte Paprika mit Tomatensauce und Reis', 'de', 'haupt', 60,
    '4 Stk Paprika rot | 300 g Hackfleisch gemischt | 80 g Langkornreis | 1 Stk Zwiebel | 1 Stk Ei | 400 g Passierte Tomaten | 1 EL Tomatenmark | 100 ml Gemüsebrühe | 50 g Schmand | 1 TL Paprikapulver edelsüß | Salz | Pfeffer | Zucker',
    [
      'Reis halb gar kochen. Paprika köpfen und entkernen.',
      'Hack, Reis, Ei, Zwiebelwürfel, Salz, Pfeffer und Paprikapulver vermengen und in die Schoten füllen. Deckel aufsetzen.',
      'Passierte Tomaten, Tomatenmark und Brühe in einem Topf aufkochen und würzen. Paprika hineinsetzen und zugedeckt 40 Minuten schmoren lassen.',
      'Die Sauce mit Schmand verfeinern und mit restlichem Reis servieren.',
    ], 'Gefüllte Paprika'),

  r('hackbraten', 'Hackbraten mit Bratensauce und Kartoffelpüree', 'de', 'haupt', 80,
    '500 g Hackfleisch gemischt | 1 Stk Brötchen vom Vortag | 1 Stk Ei | 2 Stk Ei hart gekocht | 1 Stk Zwiebel | 1 TL Senf mittelscharf | 4 Scheibe Bacon | 300 ml Rinderfond | 50 ml Sahne | 600 g Kartoffeln mehligkochend | 150 ml Milch | 40 g Butter | Salz | Pfeffer | Muskatnuss',
    [
      'Hack mit eingeweichtem Brötchen, rohem Ei, Zwiebelwürfeln, Senf, Salz und Pfeffer verkneten.',
      'Die Hälfte der Masse zu einem flachen Laib formen, die gepellten harten Eier darauflegen, mit der restlichen Masse umhüllen und mit Bacon belegen.',
      'In einer Form bei 180 °C 50 Minuten backen. Nach 20 Minuten den Fond angießen.',
      'Bratensaft mit Sahne aufkochen und abschmecken. Dazu Kartoffelpüree servieren.',
    ], 'Hackbraten'),

  r('speckpfannkuchen', 'Speckpfannkuchen mit Feldsalat', 'de', 'haupt', 30,
    '150 g Weizenmehl | 3 Stk Ei | 300 ml Milch | 150 g Bacon | 1 EL Butterschmalz | 100 g Feldsalat | 1 Stk Schalotte | 2 EL Weißweinessig | 3 EL Sonnenblumenöl | 1 TL Senf mittelscharf | Salz | Pfeffer',
    [
      'Mehl, Eier, Milch und eine Prise Salz glatt rühren und 10 Minuten quellen lassen.',
      'Bacon in einer Pfanne knusprig braten, Teig für einen Pfannkuchen darüber gießen und von beiden Seiten goldbraun backen. So 3 bis 4 Pfannkuchen backen.',
      'Feldsalat waschen. Aus Schalotte, Essig, Öl, Senf, Salz und Pfeffer ein Dressing rühren.',
      'Pfannkuchen mit dem Salat servieren.',
    ], 'Pfannkuchen Speck'),

  r('flammkuchen', 'Flammkuchen Elsässer Art', 'de', 'haupt', 30,
    '1 Pck Flammkuchenteig | 200 g Schmand | 150 g Speckwürfel | 1 Stk Zwiebel | Muskatnuss | Salz | Pfeffer',
    [
      'Ofen mit Blech auf höchste Stufe (250 °C) vorheizen.',
      'Teig ausrollen und mit gewürztem Schmand dünn bestreichen.',
      'Zwiebel in hauchdünne Ringe schneiden und mit dem Speck auf dem Teig verteilen.',
      'Auf dem heißen Blech 10 bis 12 Minuten knusprig backen.',
    ], 'Flammkuchen'),

  r('bauernfruehstueck', 'Bauernfrühstück mit Gewürzgurke', 'de', 'haupt', 30,
    '500 g Kartoffeln festkochend | 4 Stk Ei | 100 g Speckwürfel | 1 Stk Zwiebel | 2 EL Milch | 0.5 Bund Schnittlauch | 2 Stk Gewürzgurke | 1 EL Butterschmalz | Salz | Pfeffer',
    [
      'Kartoffeln als Pellkartoffeln vorkochen, pellen und in Scheiben schneiden.',
      'Im Butterschmalz knusprig braten, dann Speck und Zwiebel zugeben.',
      'Eier mit Milch, Salz und Pfeffer verquirlen, darüber gießen und bei kleiner Hitze stocken lassen.',
      'Mit Schnittlauch bestreuen und mit Gewürzgurken servieren.',
    ], 'Bauernfrühstück'),

  r('matjes-hausfrauenart', 'Matjes nach Hausfrauenart mit Pellkartoffeln', 'de', 'haupt', 30,
    '4 Stk Matjesfilet | 1 Stk Apfel säuerlich | 1 Stk Zwiebel rot | 2 Stk Gewürzgurke | 150 g Saure Sahne | 100 g Joghurt natur | 0.5 Bund Dill | 600 g Kartoffeln festkochend | Salz | Pfeffer | Zucker',
    [
      'Kartoffeln mit Schale kochen.',
      'Apfel, Zwiebel und Gurke in feine Streifen schneiden.',
      'Saure Sahne und Joghurt verrühren, mit Salz, Pfeffer und einer Prise Zucker würzen. Apfel, Zwiebel, Gurke und gehackten Dill unterheben.',
      'Matjes in mundgerechte Stücke schneiden, unter die Sauce ziehen und mit den Pellkartoffeln servieren.',
    ], 'Matjes Hausfrauenart'),

  r('backfisch', 'Backfisch mit Remoulade und Kartoffelsalat', 'de', 'haupt', 45,
    '400 g Kabeljaufilet | 100 g Weizenmehl | 150 ml Bier hell | 1 Stk Ei | 500 ml Frittieröl | 100 g Mayonnaise | 1 Stk Gewürzgurke | 1 TL Kapern | 0.5 Bund Petersilie | 500 g Kartoffeln festkochend | 1 Stk Zwiebel | 200 ml Gemüsebrühe | 3 EL Weißweinessig | 1 Stk Zitrone | Salz | Pfeffer',
    [
      'Kartoffeln als Pellkartoffeln kochen, in Scheiben schneiden und mit heißer Brühe, Zwiebelwürfeln, Essig, Salz und Pfeffer zu Kartoffelsalat anmachen.',
      'Für die Remoulade die Mayonnaise mit fein gehackter Gurke, Kapern und Petersilie verrühren.',
      'Mehl, Bier, Ei und Salz zu einem dickflüssigen Bierteig verrühren. Fisch in Stücke schneiden, salzen und mit Zitrone beträufeln.',
      'Fisch durch den Teig ziehen und im 175 °C heißen Öl 4 bis 5 Minuten goldbraun ausbacken. Mit Remoulade und Salat servieren.',
    ], 'Backfisch'),

  r('lachs-senf-dill', 'Lachsfilet mit Senf-Dill-Sauce und Petersilienkartoffeln', 'de', 'haupt', 35,
    '2 Stk Lachsfilet | 150 ml Sahne | 2 EL Senf mittelscharf | 1 TL Honig | 0.5 Bund Dill | 0.5 Bund Petersilie | 500 g Kartoffeln festkochend | 1 EL Butter | 1 EL Sonnenblumenöl | 1 Stk Zitrone | Salz | Pfeffer',
    [
      'Kartoffeln schälen und in Salzwasser gar kochen. In Butter mit gehackter Petersilie schwenken.',
      'Lachs salzen und pfeffern und in Öl auf der Hautseite 4 Minuten braten. Wenden und 2 Minuten fertig garen.',
      'Sahne mit Senf und Honig aufkochen, 3 Minuten einköcheln lassen, gehackten Dill einrühren und mit Zitrone abschmecken.',
      'Lachs mit Sauce und Kartoffeln anrichten.',
    ], 'Lachs Dillsauce'),

  r('pellkartoffeln-kraeuterquark', 'Pellkartoffeln mit Kräuterquark und Leinöl', 'de', 'haupt', 30,
    '800 g Kartoffeln festkochend | 500 g Speisequark | 100 ml Milch | 1 Bund Schnittlauch | 0.5 Bund Petersilie | 0.5 Bund Dill | 1 Stk Zwiebel rot | 2 EL Leinöl | Salz | Pfeffer',
    [
      'Kartoffeln mit Schale in Salzwasser ca. 25 Minuten gar kochen.',
      'Quark mit Milch glatt rühren. Kräuter fein hacken, Zwiebel fein würfeln und beides unterrühren. Mit Salz und Pfeffer würzen.',
      'Quark mit einer Mulde anrichten und Leinöl hineingießen, wie in der Lausitz.',
      'Mit den Pellkartoffeln servieren.',
    ], 'Pellkartoffeln Quark'),

  r('gruene-sosse', 'Frankfurter Grüne Soße mit Eiern und Kartoffeln', 'de', 'haupt', 40,
    '1 Bund Kräuter für Grüne Soße | 200 g Schmand | 150 g Saure Sahne | 100 g Joghurt natur | 1 TL Senf mittelscharf | 6 Stk Ei | 600 g Kartoffeln festkochend | Salz | Pfeffer | Zucker',
    [
      'Kartoffeln mit Schale kochen. 4 Eier 10 Minuten hart kochen.',
      'Die sieben Kräuter (Borretsch, Kerbel, Kresse, Petersilie, Pimpinelle, Sauerampfer, Schnittlauch) waschen, grob schneiden und sehr fein pürieren oder wiegen.',
      'Schmand, saure Sahne, Joghurt und Senf unterrühren. 2 hart gekochte Eigelbe zerdrücken und einrühren. Mit Salz, Pfeffer und einer Prise Zucker abschmecken und 30 Minuten ziehen lassen.',
      'Mit halbierten Eiern und Kartoffeln servieren.',
    ], 'Grüne Soße Frankfurt'),

  r('tafelspitz', 'Tafelspitz mit Meerrettichsauce und Wurzelgemüse', 'de', 'haupt', 180,
    '800 g Tafelspitz | 2 Stk Möhre | 150 g Knollensellerie | 1 Stk Lauch | 1 Stk Zwiebel | 1 Blatt Lorbeerblatt | 1 TL Pfefferkörner | 30 g Butter | 30 g Weizenmehl | 100 ml Sahne | 2 EL Meerrettich gerieben | 500 g Kartoffeln festkochend | 0.5 Bund Schnittlauch | Salz',
    [
      'Zwiebel halbieren und in einem Topf ohne Fett dunkel anrösten. Mit 2,5 l Wasser aufgießen, Fleisch, Lorbeer und Pfefferkörner zugeben und aufkochen.',
      'Bei kleinster Hitze 2,5 Stunden simmern lassen und den Schaum abschöpfen. Die letzten 30 Minuten Möhren, Sellerie und Lauch in Stücken mitgaren und salzen.',
      'Für die Sauce Butter schmelzen, Mehl anschwitzen, mit 300 ml Brühe und Sahne aufgießen, 5 Minuten köcheln lassen und Meerrettich einrühren.',
      'Fleisch gegen die Faser aufschneiden und mit Gemüse, Salzkartoffeln, Sauce und Schnittlauch servieren. Die Brühe ergibt eine Suppe als Vorspeise.',
    ], 'Tafelspitz'),

  r('schweinshaxe', 'Knusprige Schweinshaxe mit Kartoffelknödeln und Krautsalat', 'de', 'haupt', 180,
    '2 Stk Schweinshaxe hinten | 2 Stk Zwiebel | 1 Stk Möhre | 500 ml Dunkelbier | 1 TL Kümmel | 2 Zehe Knoblauch | 1 Pck Kartoffelknödel halb und halb | 300 g Weißkohl | 2 EL Weißweinessig | 2 EL Sonnenblumenöl | Salz | Pfeffer | Zucker',
    [
      'Haxen mit Salz, Pfeffer, Kümmel und Knoblauch einreiben. Mit grob geschnittenem Gemüse und 300 ml Bier in einen Bräter geben.',
      'Bei 160 °C 2,5 Stunden garen, regelmäßig wenden und mit Bier übergießen. Zum Schluss 15 Minuten bei 220 °C mit Grillfunktion knusprig backen.',
      'Kohl fein hobeln, mit Salz kräftig durchkneten und mit Essig, Öl, Zucker und Kümmel zu Krautsalat anmachen.',
      'Knödel nach Packungsanweisung zubereiten. Bratensaft passieren und dazu reichen.',
    ], 'Schweinshaxe'),

  r('leber-berliner-art', 'Leber Berliner Art mit Apfel, Zwiebeln und Püree', 'de', 'haupt', 35,
    '400 g Kalbsleber | 2 Stk Zwiebel | 2 Stk Apfel | 2 EL Weizenmehl | 2 EL Butterschmalz | 600 g Kartoffeln mehligkochend | 150 ml Milch | 40 g Butter | Muskatnuss | Salz | Pfeffer',
    [
      'Kartoffeln kochen und mit Milch und Butter zu Püree stampfen.',
      'Zwiebeln in Ringe schneiden und goldbraun braten. Äpfel in Ringe schneiden und in Butter kurz von beiden Seiten braten.',
      'Leber in Scheiben schneiden, mehlieren und in heißem Butterschmalz 2 Minuten je Seite braten. Erst danach salzen und pfeffern.',
      'Leber mit Apfel- und Zwiebelringen auf dem Püree anrichten.',
    ], 'Leber Berliner Art'),

  r('spargel-hollandaise', 'Spargel mit Sauce Hollandaise, Schinken und Kartoffeln', 'de', 'haupt', 40,
    '1 kg Spargel weiß | 150 g Katenschinken | 500 g Kartoffeln festkochend | 150 g Butter | 2 Stk Eigelb | 2 EL Weißwein | 1 Stk Zitrone | 1 TL Zucker | Salz | Pfeffer',
    [
      'Spargel schälen und die Enden abschneiden. In Salzwasser mit Zucker und einem Stück Butter 12 bis 15 Minuten garen.',
      'Kartoffeln schälen und kochen.',
      'Für die Hollandaise die Butter schmelzen. Eigelbe mit Weißwein über einem warmen Wasserbad cremig aufschlagen, dann die Butter langsam einlaufen lassen. Mit Zitrone, Salz und Pfeffer abschmecken.',
      'Spargel mit Sauce, Schinken und Kartoffeln anrichten.',
    ], 'Spargel Hollandaise'),

  r('semmelknoedel-rahmpilze', 'Semmelknödel mit Rahmschwammerl', 'de', 'haupt', 45,
    '5 Stk Brötchen vom Vortag | 200 ml Milch | 2 Stk Ei | 1 Stk Zwiebel | 1 Bund Petersilie | 400 g Champignons | 100 g Kräuterseitlinge | 200 ml Sahne | 100 ml Gemüsebrühe | 20 g Butter | Muskatnuss | Salz | Pfeffer',
    [
      'Brötchen würfeln. Die Hälfte der Zwiebel fein würfeln, in Butter andünsten und zu den Brotwürfeln geben. Mit warmer Milch übergießen und 15 Minuten ziehen lassen.',
      'Eier, die Hälfte der Petersilie, Salz und Muskat zugeben, gut verkneten und 6 Knödel formen. In siedendem Salzwasser 20 Minuten ziehen lassen.',
      'Pilze in Scheiben schneiden, mit der restlichen Zwiebel in Butter kräftig anbraten, mit Brühe und Sahne ablöschen und cremig einkochen.',
      'Mit restlicher Petersilie, Salz und Pfeffer abschmecken und mit den Knödeln servieren.',
    ], 'Semmelknödel Pilze'),

  r('linsen-spaetzle', 'Linsen mit Spätzle und Saitenwürstle', 'de', 'haupt', 60,
    '200 g Alblinsen | 1 Stk Zwiebel | 1 Stk Möhre | 100 g Knollensellerie | 50 g Speckwürfel | 1 EL Weizenmehl | 600 ml Gemüsebrühe | 3 EL Rotweinessig | 1 Blatt Lorbeerblatt | 4 Stk Wiener Würstchen | 300 g Spätzle frisch | 1 EL Butter | Salz | Pfeffer | Zucker',
    [
      'Speck auslassen und Zwiebel, Möhre und Sellerie fein gewürfelt anschwitzen. Mehl darüber stäuben und kurz mitrösten.',
      'Linsen, Brühe und Lorbeer zugeben und 35 bis 40 Minuten weich köcheln lassen.',
      'Mit Essig, Salz, Pfeffer und einer Prise Zucker säuerlich abschmecken. Würstchen in den Linsen erhitzen.',
      'Spätzle in Butter schwenken und alles zusammen servieren.',
    ], 'Linsen Spätzle'),

  r('zwiebelrostbraten', 'Schwäbischer Zwiebelrostbraten mit Spätzle', 'de', 'haupt', 45,
    '2 Stk Rumpsteak | 3 Stk Zwiebel | 2 EL Weizenmehl | 200 ml Rinderfond | 50 ml Rotwein | 1 TL Paprikapulver edelsüß | 2 EL Butterschmalz | 300 g Spätzle frisch | 1 EL Butter | Salz | Pfeffer',
    [
      'Zwiebeln in feine Ringe schneiden, in Mehl mit Paprika wenden und im Butterschmalz knusprig frittieren. Abtropfen lassen.',
      'Den Fettrand der Steaks einschneiden. Steaks pfeffern und im heißen Fett je Seite 2 bis 3 Minuten braten. Salzen und warm stellen.',
      'Bratensatz mit Wein und Fond ablöschen und kräftig einkochen.',
      'Steaks mit Sauce und Röstzwiebeln anrichten und mit Butterspätzle servieren.',
    ], 'Zwiebelrostbraten'),

  r('kaiserschmarrn', 'Kaiserschmarrn mit Apfelmus', 'de', 'haupt', 30,
    '150 g Weizenmehl | 4 Stk Ei | 250 ml Milch | 2 EL Zucker | 1 Pck Vanillezucker | 40 g Rosinen | 40 g Butter | 2 EL Puderzucker | 1 Glas Apfelmus | Salz',
    [
      'Eier trennen. Eigelb, Mehl, Milch, Vanillezucker und eine Prise Salz glatt rühren. Rosinen untermischen.',
      'Eiweiß mit dem Zucker steif schlagen und locker unter den Teig heben.',
      'Butter in einer großen Pfanne schmelzen, Teig hineingießen und bei mittlerer Hitze 5 Minuten stocken lassen. Wenden und mit zwei Gabeln in Stücke reißen.',
      'Mit etwas Butter und Zucker karamellisieren lassen, mit Puderzucker bestäuben und mit Apfelmus servieren.',
    ], 'Kaiserschmarrn'),

  r('pannfisch', 'Hamburger Pannfisch mit Senfsauce und Bratkartoffeln', 'de', 'haupt', 40,
    '400 g Seelachsfilet | 500 g Kartoffeln festkochend | 1 Stk Zwiebel | 2 EL Senf mittelscharf | 150 ml Sahne | 100 ml Fischfond | 2 EL Weizenmehl | 2 EL Butterschmalz | 0.5 Bund Dill | 1 Stk Zitrone | Salz | Pfeffer',
    [
      'Gekochte Pellkartoffeln in Scheiben schneiden und mit Zwiebeln im Butterschmalz zu Bratkartoffeln braten.',
      'Fisch in Stücke schneiden, mit Zitrone beträufeln, salzen, mehlieren und in Butterschmalz goldbraun braten.',
      'Fond, Sahne und Senf aufkochen, sämig einkochen und Dill einrühren.',
      'Fisch und Kartoffeln in der Pfanne anrichten und mit Senfsauce servieren.',
    ], 'Pannfisch'),

  r('gruenkohl', 'Grünkohl mit Kasseler und Pinkel', 'de', 'haupt', 120,
    '800 g Grünkohl | 2 Stk Zwiebel | 2 EL Schweineschmalz | 2 Stk Pinkelwurst | 300 g Kasseler Nacken | 2 EL Haferflocken | 500 ml Gemüsebrühe | 1 EL Senf mittelscharf | 600 g Kartoffeln festkochend | 1 EL Zucker | Salz | Pfeffer',
    [
      'Grünkohl von den Strünken zupfen, waschen, kurz blanchieren und grob hacken.',
      'Zwiebeln im Schmalz andünsten, Grünkohl und Brühe zugeben und 1 Stunde zugedeckt schmoren.',
      'Kasseler und Pinkel auf den Kohl legen und weitere 45 Minuten mitgaren. Mit Haferflocken binden und mit Senf, Salz, Pfeffer und Zucker abschmecken.',
      'Kartoffeln kochen, in Butter und Zucker karamellisieren und dazu servieren.',
    ], 'Grünkohl Pinkel'),

  r('schaschlik-pfanne', 'Schaschlik-Pfanne mit Reis', 'de', 'haupt', 50,
    '400 g Schweinenacken | 100 g Bacon | 1 Stk Paprika rot | 1 Stk Paprika grün | 2 Stk Zwiebel | 2 EL Tomatenmark | 300 g Passierte Tomaten | 150 ml Gemüsebrühe | 3 EL Tomatenketchup | 1 EL Worcestersauce | 1 TL Paprikapulver edelsüß | 2 EL Sonnenblumenöl | 150 g Langkornreis | Salz | Pfeffer',
    [
      'Fleisch, Paprika, Zwiebeln und Bacon in mundgerechte Stücke schneiden.',
      'Fleisch und Bacon im Öl scharf anbraten, Gemüse zugeben und 5 Minuten mitbraten.',
      'Tomatenmark und Paprika anrösten, dann passierte Tomaten, Brühe, Ketchup und Worcestersauce zugeben. 30 Minuten schmoren lassen.',
      'Kräftig abschmecken und mit Reis servieren.',
    ], 'Schaschlik'),

  r('ragout-fin', 'Ragout fin mit Toast und Zitrone', 'de', 'haupt', 45,
    '300 g Hähnchenbrustfilet | 150 g Champignons | 30 g Butter | 30 g Weizenmehl | 300 ml Hühnerbrühe | 50 ml Weißwein | 50 ml Sahne | 1 Stk Eigelb | 1 Stk Zitrone | 1 TL Worcestersauce | 50 g Gouda gerieben | 4 Scheibe Toastbrot | Salz | Pfeffer',
    [
      'Hähnchen in Brühe 15 Minuten gar ziehen lassen und klein würfeln.',
      'Butter schmelzen, Mehl anschwitzen, mit Brühe, Wein und Sahne aufgießen und 5 Minuten köcheln lassen. Champignons fein würfeln und mitgaren.',
      'Vom Herd nehmen, Eigelb einrühren und mit Zitrone, Worcestersauce, Salz und Pfeffer abschmecken. Fleisch zugeben.',
      'In ofenfeste Förmchen füllen, mit Käse bestreuen, kurz gratinieren und mit Toast und Zitronenspalten servieren.',
    ], 'Ragout fin'),

  r('kotelett-rahmkohlrabi', 'Schweinekotelett mit Rahmkohlrabi und Salzkartoffeln', 'de', 'haupt', 40,
    '2 Stk Schweinekotelett | 2 Stk Kohlrabi | 150 ml Sahne | 100 ml Gemüsebrühe | 1 EL Butter | 1 EL Weizenmehl | 0.5 Bund Petersilie | 500 g Kartoffeln festkochend | 1 EL Butterschmalz | Muskatnuss | Salz | Pfeffer',
    [
      'Kartoffeln schälen und in Salzwasser kochen.',
      'Kohlrabi schälen, in Stifte schneiden und in Butter andünsten. Mehl darüber stäuben, mit Brühe und Sahne aufgießen und 10 Minuten garen. Mit Muskat und Petersilie abschmecken.',
      'Koteletts pfeffern, im Butterschmalz 4 Minuten je Seite braten und salzen.',
      'Alles zusammen anrichten.',
    ], 'Schweinekotelett'),

  r('scholle-finkenwerder', 'Scholle Finkenwerder Art mit Kartoffelsalat', 'de', 'haupt', 45,
    '2 Stk Scholle küchenfertig | 100 g Speckwürfel | 100 g Nordseekrabben | 2 EL Weizenmehl | 40 g Butter | 1 Stk Zitrone | 0.5 Bund Petersilie | 500 g Kartoffeln festkochend | 1 Stk Zwiebel | 200 ml Gemüsebrühe | 3 EL Weißweinessig | Salz | Pfeffer',
    [
      'Pellkartoffeln mit Brühe, Zwiebel, Essig, Salz und Pfeffer zu lauwarmem Kartoffelsalat anmachen.',
      'Speck in einer großen Pfanne knusprig auslassen und herausnehmen.',
      'Schollen salzen, mehlieren und im Speckfett mit Butter 4 bis 5 Minuten je Seite braten.',
      'Speck und Krabben kurz in der Pfanne erwärmen, über die Schollen geben und mit Petersilie und Zitrone servieren.',
    ], 'Scholle Finkenwerder'),

  // ───────────── Eintöpfe ─────────────
  r('linseneintopf', 'Linseneintopf mit Mettwürstchen', 'de', 'eintopf', 60,
    '200 g Tellerlinsen | 1 Stk Zwiebel | 2 Stk Möhre | 150 g Knollensellerie | 1 Stk Lauch | 300 g Kartoffeln festkochend | 50 g Speckwürfel | 1 l Gemüsebrühe | 2 Stk Mettenden | 2 EL Rotweinessig | 1 Blatt Lorbeerblatt | 0.5 Bund Petersilie | Salz | Pfeffer | Zucker',
    [
      'Speck auslassen, Zwiebel und gewürfeltes Gemüse darin anschwitzen.',
      'Linsen, Kartoffelwürfel, Lorbeer und Brühe zugeben und 35 Minuten köcheln lassen.',
      'Mettenden in Scheiben schneiden und 10 Minuten mitziehen lassen.',
      'Mit Essig, Salz, Pfeffer und einer Prise Zucker abschmecken und mit Petersilie servieren.',
    ], 'Linseneintopf'),

  r('erbseneintopf', 'Erbseneintopf mit Bockwurst', 'de', 'eintopf', 90,
    '250 g Schälerbsen gelb | 1 Stk Zwiebel | 2 Stk Möhre | 150 g Knollensellerie | 1 Stk Lauch | 300 g Kartoffeln mehligkochend | 200 g Kasseler Nacken | 1.2 l Gemüsebrühe | 2 Stk Bockwurst | 1 TL Majoran | Salz | Pfeffer',
    [
      'Erbsen abspülen und mit Brühe und Kasseler aufkochen. 45 Minuten köcheln lassen.',
      'Zwiebel, Möhren, Sellerie, Lauch und Kartoffeln würfeln, zugeben und weitere 30 Minuten garen, bis die Erbsen zerfallen.',
      'Kasseler herausnehmen, würfeln und zurückgeben. Bockwurst in Scheiben im Eintopf erhitzen.',
      'Mit Majoran, Salz und Pfeffer abschmecken.',
    ], 'Erbsensuppe Bockwurst'),

  r('bohneneintopf', 'Grüner Bohneneintopf mit Hammelfleisch', 'de', 'eintopf', 90,
    '400 g Lammschulter | 500 g Grüne Bohnen | 400 g Kartoffeln festkochend | 1 Stk Zwiebel | 1 l Gemüsebrühe | 1 Bund Bohnenkraut | 1 EL Butterschmalz | Salz | Pfeffer',
    [
      'Fleisch würfeln, im Butterschmalz anbraten und Zwiebel mitdünsten. Mit Brühe aufgießen und 45 Minuten köcheln lassen.',
      'Bohnen putzen und brechen, Kartoffeln würfeln.',
      'Bohnen, Kartoffeln und Bohnenkraut zugeben und 25 Minuten garen.',
      'Bohnenkraut herausnehmen und mit Salz und Pfeffer abschmecken.',
    ], 'Bohneneintopf'),

  r('weisskohleintopf', 'Weißkohleintopf mit Hackfleisch', 'de', 'eintopf', 50,
    '500 g Weißkohl | 300 g Hackfleisch gemischt | 1 Stk Zwiebel | 2 Stk Möhre | 300 g Kartoffeln festkochend | 1 EL Tomatenmark | 1 l Gemüsebrühe | 1 TL Kümmel | 1 EL Sonnenblumenöl | 0.5 Bund Petersilie | Salz | Pfeffer | Paprikapulver edelsüß',
    [
      'Hack im Öl krümelig braten, Zwiebel und Tomatenmark zugeben und mitrösten.',
      'Kohl in Streifen, Möhren und Kartoffeln in Würfel schneiden und zugeben.',
      'Mit Brühe aufgießen, Kümmel und Paprika zugeben und 30 Minuten köcheln lassen.',
      'Abschmecken und mit Petersilie servieren.',
    ], 'Weißkohleintopf'),

  r('pichelsteiner', 'Pichelsteiner Eintopf', 'de', 'eintopf', 90,
    '150 g Rindergulasch | 150 g Schweinegulasch | 150 g Lammschulter | 2 Stk Zwiebel | 2 Stk Möhre | 150 g Knollensellerie | 1 Stk Lauch | 400 g Kartoffeln festkochend | 150 g Wirsing | 750 ml Rinderfond | 1 EL Butterschmalz | 1 Bund Petersilie | Salz | Pfeffer',
    [
      'Fleisch in Würfel schneiden und im Butterschmalz anbraten.',
      'Gemüse und Kartoffeln würfeln. Abwechselnd mit dem Fleisch in einen Topf schichten, jede Lage salzen und pfeffern.',
      'Fond angießen und zugedeckt bei kleiner Hitze 75 Minuten garen, ohne umzurühren.',
      'Mit reichlich Petersilie servieren.',
    ], 'Pichelsteiner'),

  r('steckrueben-eintopf', 'Steckrübeneintopf mit Kasseler', 'de', 'eintopf', 70,
    '600 g Steckrübe | 300 g Kartoffeln mehligkochend | 2 Stk Möhre | 1 Stk Zwiebel | 300 g Kasseler Nacken | 1 l Gemüsebrühe | 1 EL Butterschmalz | 1 Bund Petersilie | Muskatnuss | Salz | Pfeffer',
    [
      'Zwiebel im Butterschmalz andünsten. Kasseler und Brühe zugeben und 20 Minuten köcheln lassen.',
      'Steckrübe, Kartoffeln und Möhren schälen und würfeln. Zugeben und 30 Minuten garen.',
      'Kasseler herausnehmen und würfeln. Einen Teil des Gemüses grob zerstampfen, damit der Eintopf sämig wird.',
      'Fleisch zurückgeben, mit Muskat, Salz und Pfeffer abschmecken und mit Petersilie bestreuen.',
    ], 'Steckrübeneintopf'),

  r('wirsingeintopf', 'Wirsingeintopf mit Mettwurst', 'de', 'eintopf', 50,
    '500 g Wirsing | 400 g Kartoffeln festkochend | 2 Stk Möhre | 1 Stk Zwiebel | 2 Stk Mettenden | 1 l Gemüsebrühe | 1 EL Butterschmalz | 100 ml Sahne | Muskatnuss | Salz | Pfeffer',
    [
      'Zwiebel in Butterschmalz andünsten.',
      'Wirsing in Streifen, Kartoffeln und Möhren in Würfel schneiden und kurz mitdünsten.',
      'Brühe und Mettenden in Scheiben zugeben und 25 Minuten köcheln lassen.',
      'Mit Sahne verfeinern und mit Muskat, Salz und Pfeffer abschmecken.',
    ], 'Wirsingeintopf'),

  r('moehreneintopf', 'Möhreneintopf mit Rindfleisch', 'de', 'eintopf', 80,
    '300 g Rindergulasch | 600 g Möhre | 400 g Kartoffeln festkochend | 1 Stk Zwiebel | 1 l Rinderfond | 1 EL Butterschmalz | 1 Bund Petersilie | Muskatnuss | Salz | Pfeffer | Zucker',
    [
      'Rindfleisch im Butterschmalz anbraten und Zwiebel mitdünsten. Mit Fond aufgießen und 45 Minuten köcheln lassen.',
      'Möhren in Scheiben und Kartoffeln in Würfel schneiden, zugeben und 25 Minuten garen.',
      'Mit Muskat, Salz, Pfeffer und einer Prise Zucker abschmecken.',
      'Reichlich Petersilie unterrühren.',
    ], 'Möhreneintopf'),

  r('huehnereintopf', 'Hühnereintopf mit Nudeln', 'de', 'eintopf', 90,
    '2 Stk Hähnchenschenkel | 2 Stk Möhre | 150 g Knollensellerie | 1 Stk Lauch | 1 Stk Zwiebel | 1 Blatt Lorbeerblatt | 100 g Suppennudeln | 1 Bund Petersilie | Salz | Pfeffer | Muskatnuss',
    [
      'Hähnchenschenkel mit halbierter Zwiebel, Lorbeer und 1,5 l Wasser aufkochen und 50 Minuten leise köcheln lassen. Dabei den Schaum abschöpfen.',
      'Fleisch herausnehmen, von Haut und Knochen lösen und zerpflücken.',
      'Gemüse würfeln und in der Brühe 15 Minuten garen. Nudeln zugeben und nach Packungsangabe garen.',
      'Fleisch zurückgeben und mit Salz, Pfeffer, Muskat und Petersilie abschmecken.',
    ], 'Hühnersuppe Nudeln'),

  r('graupeneintopf', 'Graupeneintopf mit geräuchertem Bauch', 'de', 'eintopf', 70,
    '150 g Perlgraupen | 200 g Schweinebauch geräuchert | 1 Stk Zwiebel | 2 Stk Möhre | 150 g Knollensellerie | 1 Stk Lauch | 300 g Kartoffeln festkochend | 1.2 l Gemüsebrühe | 1 TL Majoran | 1 Bund Petersilie | Salz | Pfeffer',
    [
      'Bauchfleisch würfeln und auslassen, Zwiebel zugeben.',
      'Graupen kurz mitrösten und mit Brühe aufgießen. 30 Minuten köcheln lassen.',
      'Gemüse und Kartoffeln würfeln, zugeben und weitere 25 Minuten garen.',
      'Mit Majoran, Salz, Pfeffer und Petersilie abschmecken.',
    ], 'Graupensuppe'),

  r('gaisburger-marsch', 'Gaisburger Marsch', 'de', 'eintopf', 150,
    '500 g Suppenfleisch Rind | 1 Stk Markknochen | 2 Stk Möhre | 150 g Knollensellerie | 1 Stk Lauch | 2 Stk Zwiebel | 400 g Kartoffeln festkochend | 200 g Spätzle frisch | 1 Blatt Lorbeerblatt | 1 EL Butter | 1 Bund Schnittlauch | Muskatnuss | Salz | Pfeffer',
    [
      'Fleisch und Knochen mit 2 l Wasser, Lorbeer und einer halbierten Zwiebel aufkochen und 2 Stunden leise köcheln lassen. Abschäumen.',
      'Fleisch herausnehmen und würfeln. Die Brühe durch ein Sieb gießen.',
      'Gemüse und Kartoffeln würfeln und in der Brühe 20 Minuten garen. Spätzle und Fleisch zugeben.',
      'Die zweite Zwiebel in Ringe schneiden, in Butter schmälzen und über den Eintopf geben. Mit Muskat und Schnittlauch servieren.',
    ], 'Gaisburger Marsch'),

  r('serbische-bohnensuppe', 'Serbische Bohnensuppe', 'de', 'eintopf', 50,
    '2 Dose Weiße Bohnen | 1 Stk Zwiebel | 1 Stk Paprika rot | 1 Stk Paprika grün | 2 Zehe Knoblauch | 2 Stk Cabanossi | 100 g Speckwürfel | 2 EL Tomatenmark | 1 Dose Gehackte Tomaten | 800 ml Rinderfond | 1 TL Paprikapulver edelsüß | 0.5 TL Paprikapulver rosenscharf | 1 TL Majoran | Salz | Pfeffer',
    [
      'Speck auslassen, Zwiebel, Knoblauch und Paprikawürfel darin anbraten.',
      'Tomatenmark und Paprikapulver mitrösten, dann Tomaten und Fond zugeben.',
      'Bohnen abgießen, mit der Cabanossi in Scheiben zugeben und 25 Minuten köcheln lassen.',
      'Mit Majoran, Salz und Pfeffer kräftig abschmecken.',
    ], 'Serbische Bohnensuppe'),

  r('kartoffeleintopf', 'Kartoffeleintopf mit Wiener Würstchen', 'de', 'eintopf', 45,
    '700 g Kartoffeln mehligkochend | 2 Stk Möhre | 1 Stk Lauch | 150 g Knollensellerie | 1 Stk Zwiebel | 50 g Speckwürfel | 1 l Gemüsebrühe | 4 Stk Wiener Würstchen | 1 TL Majoran | 1 Bund Petersilie | Muskatnuss | Salz | Pfeffer',
    [
      'Speck und Zwiebel anbraten.',
      'Kartoffeln und Gemüse würfeln, zugeben, mit Brühe aufgießen und 25 Minuten köcheln lassen.',
      'Etwa ein Drittel grob zerstampfen, damit der Eintopf sämig wird. Würstchen in Scheiben darin erhitzen.',
      'Mit Majoran, Muskat, Salz, Pfeffer und Petersilie abschmecken.',
    ], 'Kartoffelsuppe Würstchen'),

  r('weisse-bohnen-eintopf', 'Weiße-Bohnen-Eintopf mit Kassler', 'de', 'eintopf', 60,
    '2 Dose Weiße Bohnen | 250 g Kasseler Nacken | 1 Stk Zwiebel | 2 Stk Möhre | 300 g Kartoffeln festkochend | 1 Stk Lauch | 1 EL Tomatenmark | 1 l Gemüsebrühe | 1 Zweig Thymian | 1 Bund Petersilie | Salz | Pfeffer',
    [
      'Kasseler würfeln, kurz anbraten und Zwiebel mitdünsten. Tomatenmark kurz mitrösten.',
      'Möhren, Lauch und Kartoffeln klein schneiden, zugeben und mit Brühe aufgießen. Thymian zugeben.',
      '25 Minuten köcheln lassen. Bohnen abgießen und die letzten 10 Minuten mitgaren.',
      'Abschmecken und mit Petersilie servieren.',
    ], 'Bohneneintopf weiße Bohnen'),

  // ───────────── Suppen ─────────────
  r('kartoffelsuppe', 'Kartoffelsuppe mit Majoran und Speck', 'de', 'suppe', 40,
    '600 g Kartoffeln mehligkochend | 1 Stk Möhre | 100 g Knollensellerie | 1 Stk Lauch | 1 Stk Zwiebel | 800 ml Gemüsebrühe | 100 ml Sahne | 80 g Speckwürfel | 1 TL Majoran | 0.5 Bund Petersilie | Muskatnuss | Salz | Pfeffer',
    [
      'Zwiebel und Gemüse würfeln und in etwas Fett andünsten.',
      'Kartoffeln würfeln, zugeben, mit Brühe aufgießen und 20 Minuten weich kochen.',
      'Grob pürieren, so dass noch Stücke bleiben. Sahne einrühren und mit Majoran, Muskat, Salz und Pfeffer abschmecken.',
      'Speck knusprig braten und mit Petersilie über die Suppe streuen.',
    ], 'Kartoffelsuppe'),

  r('gulaschsuppe', 'Deftige Gulaschsuppe', 'de', 'suppe', 100,
    '400 g Rindergulasch | 2 Stk Zwiebel | 1 Stk Paprika rot | 300 g Kartoffeln festkochend | 2 EL Tomatenmark | 2 EL Paprikapulver edelsüß | 1 TL Paprikapulver rosenscharf | 1 TL Kümmel gemahlen | 2 Zehe Knoblauch | 1 l Rinderfond | 2 EL Butterschmalz | Salz | Pfeffer | Majoran',
    [
      'Fleisch klein würfeln und im Butterschmalz anbraten. Zwiebeln zugeben und goldbraun schmoren.',
      'Tomatenmark und Paprikapulver kurz mitrösten und mit Fond ablöschen. Kümmel und Knoblauch zugeben und 60 Minuten köcheln lassen.',
      'Kartoffeln und Paprika würfeln, zugeben und weitere 25 Minuten garen.',
      'Mit Majoran, Salz und Pfeffer kräftig abschmecken.',
    ], 'Gulaschsuppe'),

  r('kaese-lauch-suppe', 'Käse-Lauch-Suppe mit Hackfleisch', 'de', 'suppe', 35,
    '300 g Hackfleisch gemischt | 2 Stk Lauch | 1 Stk Zwiebel | 600 ml Gemüsebrühe | 200 g Schmelzkäse | 100 ml Sahne | 1 EL Sonnenblumenöl | Muskatnuss | Salz | Pfeffer',
    [
      'Hack im Öl krümelig anbraten und Zwiebel zugeben.',
      'Lauch in Ringe schneiden und kurz mitdünsten.',
      'Mit Brühe aufgießen und 15 Minuten köcheln lassen.',
      'Schmelzkäse und Sahne einrühren, bis alles cremig ist. Mit Muskat, Salz und Pfeffer abschmecken.',
    ], 'Käse-Lauch-Suppe'),

  r('kuerbissuppe', 'Kürbissuppe mit Kürbiskernöl', 'de', 'suppe', 40,
    '800 g Hokkaido-Kürbis | 1 Stk Zwiebel | 150 g Kartoffeln mehligkochend | 20 g Ingwer | 700 ml Gemüsebrühe | 100 ml Sahne | 2 EL Kürbiskerne | 1 EL Kürbiskernöl | 1 EL Butter | Muskatnuss | Salz | Pfeffer',
    [
      'Kürbis entkernen und mit Schale würfeln. Zwiebel, Kartoffel und Ingwer klein schneiden.',
      'Alles in Butter andünsten, mit Brühe aufgießen und 20 Minuten weich kochen.',
      'Fein pürieren, Sahne einrühren und mit Muskat, Salz und Pfeffer abschmecken.',
      'Kürbiskerne ohne Fett rösten und mit Kürbiskernöl über die Suppe geben.',
    ], 'Kürbissuppe'),

  r('tomatensuppe', 'Tomatensuppe mit Reis', 'de', 'suppe', 35,
    '2 Dose Geschälte Tomaten | 1 Stk Zwiebel | 2 Zehe Knoblauch | 1 EL Tomatenmark | 500 ml Gemüsebrühe | 100 ml Sahne | 60 g Langkornreis | 1 EL Butter | 0.5 Bund Basilikum | Salz | Pfeffer | Zucker',
    [
      'Reis separat garen.',
      'Zwiebel und Knoblauch in Butter andünsten und Tomatenmark kurz mitrösten.',
      'Tomaten und Brühe zugeben, 20 Minuten köcheln lassen und fein pürieren.',
      'Mit Sahne, Salz, Pfeffer und etwas Zucker abschmecken. Reis einrühren und mit Basilikum servieren.',
    ], 'Tomatensuppe'),

  r('champignoncremesuppe', 'Champignoncremesuppe', 'de', 'suppe', 30,
    '400 g Champignons | 1 Stk Zwiebel | 1 EL Butter | 1 EL Weizenmehl | 600 ml Gemüsebrühe | 150 ml Sahne | 0.5 Bund Petersilie | 1 Stk Zitrone | Muskatnuss | Salz | Pfeffer',
    [
      'Ein paar schöne Pilze in Scheiben beiseitelegen. Die übrigen Champignons mit der Zwiebel grob hacken.',
      'In Butter kräftig anbraten, Mehl darüber stäuben und mit Brühe aufgießen. 15 Minuten köcheln lassen.',
      'Sahne zugeben, fein pürieren und mit Zitrone, Muskat, Salz und Pfeffer abschmecken.',
      'Pilzscheiben anbraten und mit Petersilie als Einlage servieren.',
    ], 'Champignoncremesuppe'),

  r('spargelcremesuppe', 'Spargelcremesuppe', 'de', 'suppe', 40,
    '500 g Spargel weiß | 1 Stk Schalotte | 30 g Butter | 30 g Weizenmehl | 150 ml Sahne | 1 Stk Eigelb | 1 TL Zucker | 1 Stk Zitrone | 0.5 Bund Schnittlauch | Salz | Muskatnuss',
    [
      'Spargel schälen. Schalen und Enden in 1 l Salzwasser mit Zucker 20 Minuten auskochen und abseihen.',
      'Spargelstangen in Stücke schneiden und im Sud 10 Minuten garen. Herausnehmen.',
      'Butter schmelzen, Schalotte andünsten, Mehl anschwitzen und mit 800 ml Sud aufgießen. 5 Minuten köcheln lassen.',
      'Sahne mit Eigelb verquirlen und einrühren (nicht mehr kochen). Mit Zitrone und Muskat abschmecken. Spargelstücke zugeben und mit Schnittlauch servieren.',
    ], 'Spargelcremesuppe'),

  r('flaedlesuppe', 'Schwäbische Flädlesuppe', 'de', 'suppe', 30,
    '80 g Weizenmehl | 1 Stk Ei | 150 ml Milch | 1 EL Butter | 800 ml Rinderbrühe | 1 Bund Schnittlauch | Muskatnuss | Salz',
    [
      'Mehl, Ei, Milch und eine Prise Salz zu einem dünnen Pfannkuchenteig verrühren und 10 Minuten ruhen lassen.',
      'In Butter hauchdünne Pfannkuchen ausbacken, auskühlen lassen und aufrollen.',
      'Die Rollen in feine Streifen (Flädle) schneiden.',
      'Brühe aufkochen, mit Muskat würzen, über die Flädle gießen und mit Schnittlauch servieren.',
    ], 'Flädlesuppe'),

  r('maultaschensuppe', 'Maultaschen in der Brühe', 'de', 'suppe', 25,
    '6 Stk Maultaschen | 1 l Rinderbrühe | 1 Stk Möhre | 1 Stk Lauch | 1 Stk Zwiebel | 1 EL Butter | 1 Bund Schnittlauch | Muskatnuss | Salz',
    [
      'Möhre und Lauch in feine Streifen schneiden und in der Brühe 5 Minuten garen.',
      'Maultaschen zugeben und 10 Minuten ziehen lassen (nicht kochen).',
      'Zwiebel in Ringe schneiden und in Butter goldbraun schmälzen.',
      'Suppe mit Muskat abschmecken und mit Zwiebeln und Schnittlauch servieren.',
    ], 'Maultaschensuppe'),

  r('leberknoedelsuppe', 'Leberknödelsuppe', 'de', 'suppe', 50,
    '150 g Rinderleber | 2 Stk Brötchen vom Vortag | 100 ml Milch | 1 Stk Ei | 1 Stk Zwiebel | 0.5 Bund Petersilie | 0.5 TL Majoran | 1 EL Paniermehl | 1 l Rinderbrühe | 1 Bund Schnittlauch | Salz | Pfeffer',
    [
      'Brötchen in warmer Milch einweichen und ausdrücken.',
      'Leber fein hacken oder wolfen. Mit Brötchen, Ei, angedünsteter Zwiebel, Petersilie, Majoran, Paniermehl, Salz und Pfeffer zu einer formbaren Masse mischen.',
      'Mit nassen Händen 4 Knödel formen und in leicht siedender Brühe 20 Minuten ziehen lassen.',
      'Mit Schnittlauch in der Brühe servieren.',
    ], 'Leberknödelsuppe'),

  r('hochzeitssuppe', 'Hochzeitssuppe mit Eierstich und Klößchen', 'de', 'suppe', 60,
    '1 l Hühnerbrühe | 200 g Kalbsbrät | 2 Stk Ei | 100 ml Milch | 150 g Spargel weiß | 1 Stk Möhre | 1 Bund Schnittlauch | Muskatnuss | Salz',
    [
      'Für den Eierstich Eier mit Milch, Salz und Muskat verquirlen, in eine gefettete Tasse füllen und im Wasserbad bei 80 °C 25 Minuten stocken lassen. Abkühlen lassen und würfeln.',
      'Brät mit nassen Händen zu kleinen Klößchen formen und in siedender Brühe 8 Minuten ziehen lassen.',
      'Spargel und Möhre in Stücke schneiden und in der Brühe gar ziehen lassen.',
      'Eierstich zugeben und mit Schnittlauch servieren.',
    ], 'Hochzeitssuppe'),

  r('soljanka', 'Soljanka', 'de', 'suppe', 45,
    '200 g Fleischwurst | 100 g Salami | 100 g Kochschinken | 1 Stk Zwiebel | 1 Stk Paprika rot | 3 Stk Gewürzgurke | 2 EL Tomatenmark | 1 Dose Gehackte Tomaten | 700 ml Rinderfond | 1 Stk Zitrone | 100 g Saure Sahne | 0.5 Bund Dill | 1 TL Paprikapulver edelsüß | Salz | Pfeffer',
    [
      'Wurst, Schinken, Paprika, Gurken und Zwiebel in Streifen schneiden.',
      'Zwiebel und Wurst anbraten, Tomatenmark und Paprikapulver mitrösten.',
      'Tomaten, Fond, Paprika, Gurken und einen Schuss Gurkenwasser zugeben und 20 Minuten köcheln lassen.',
      'Kräftig abschmecken. Mit einer Zitronenscheibe, einem Klecks saurer Sahne und Dill servieren.',
    ], 'Soljanka'),

  // ───────────── Aufläufe & Gratins ─────────────
  r('kartoffelgratin', 'Kartoffelgratin mit Feldsalat', 'de', 'auflauf', 70,
    '800 g Kartoffeln festkochend | 250 ml Sahne | 150 ml Milch | 2 Zehe Knoblauch | 100 g Gruyère | 1 EL Butter | 100 g Feldsalat | 2 EL Walnusskerne | 2 EL Weißweinessig | 3 EL Sonnenblumenöl | Muskatnuss | Salz | Pfeffer',
    [
      'Kartoffeln schälen und in 3 mm dünne Scheiben hobeln (nicht waschen).',
      'Sahne und Milch mit zerdrücktem Knoblauch, Salz, Pfeffer und Muskat aufkochen.',
      'Kartoffeln dachziegelartig in eine gebutterte Form schichten, mit der Sahnemilch übergießen und mit Käse bestreuen. Bei 180 °C 50 Minuten goldbraun backen.',
      'Feldsalat mit Essig, Öl, Salz und gerösteten Walnüssen anmachen und dazu servieren.',
    ], 'Kartoffelgratin'),

  r('kartoffel-hack-auflauf', 'Kartoffel-Hackfleisch-Auflauf', 'de', 'auflauf', 70,
    '700 g Kartoffeln festkochend | 400 g Hackfleisch gemischt | 1 Stk Zwiebel | 1 EL Tomatenmark | 1 Dose Gehackte Tomaten | 200 ml Sahne | 150 g Gouda gerieben | 1 EL Sonnenblumenöl | 1 TL Oregano getrocknet | Salz | Pfeffer | Paprikapulver edelsüß',
    [
      'Kartoffeln schälen, in Scheiben schneiden und 8 Minuten in Salzwasser vorkochen.',
      'Hack mit Zwiebel anbraten, Tomatenmark mitrösten und Tomaten zugeben. Mit Oregano, Paprika, Salz und Pfeffer würzen.',
      'Kartoffeln und Hacksauce in eine Form schichten, mit gewürzter Sahne übergießen und mit Käse bestreuen.',
      'Bei 200 °C 30 Minuten backen.',
    ], 'Kartoffelauflauf Hackfleisch'),

  r('schinkennudel-auflauf', 'Nudelauflauf mit Schinken und Käse', 'de', 'auflauf', 45,
    '250 g Penne | 200 g Kochschinken | 1 Stk Zwiebel | 3 Stk Ei | 200 ml Sahne | 100 ml Milch | 150 g Emmentaler gerieben | 100 g Erbsen TK | Muskatnuss | Salz | Pfeffer',
    [
      'Nudeln bissfest kochen.',
      'Schinken würfeln und mit der Zwiebel kurz anbraten.',
      'Nudeln, Schinken und Erbsen in eine Form geben. Eier mit Sahne, Milch, Salz, Pfeffer und Muskat verquirlen und darüber gießen.',
      'Mit Käse bestreuen und bei 200 °C 25 Minuten goldbraun backen.',
    ], 'Nudelauflauf Schinken'),

  r('brokkoli-kartoffel-auflauf', 'Brokkoli-Kartoffel-Auflauf', 'de', 'auflauf', 55,
    '600 g Kartoffeln festkochend | 400 g Brokkoli | 200 ml Sahne | 2 Stk Ei | 150 g Gouda gerieben | Muskatnuss | Salz | Pfeffer',
    [
      'Kartoffeln in Scheiben 8 Minuten vorkochen. Brokkoli in Röschen teilen und 3 Minuten blanchieren.',
      'Beides in eine gefettete Form schichten.',
      'Sahne mit Eiern, Salz, Pfeffer und Muskat verquirlen und darüber gießen.',
      'Mit Käse bestreuen und bei 200 °C 30 Minuten backen.',
    ], 'Brokkoli-Auflauf'),

  r('blumenkohl-auflauf', 'Blumenkohl-Auflauf mit Schinken und Béchamel', 'de', 'auflauf', 50,
    '1 Stk Blumenkohl | 150 g Kochschinken | 30 g Butter | 30 g Weizenmehl | 400 ml Milch | 100 g Bergkäse | Muskatnuss | Salz | Pfeffer',
    [
      'Blumenkohl in Röschen teilen und 6 Minuten in Salzwasser vorgaren.',
      'Butter schmelzen, Mehl anschwitzen, Milch einrühren und 5 Minuten köcheln lassen. Mit Muskat, Salz und Pfeffer würzen und die Hälfte des Käses einrühren.',
      'Blumenkohl und gewürfelten Schinken in eine Form geben, mit der Sauce übergießen und den restlichen Käse darüber streuen.',
      'Bei 200 °C 20 Minuten gratinieren.',
    ], 'Blumenkohl überbacken'),

  r('zucchini-hack-auflauf', 'Zucchini-Hack-Auflauf mit Feta', 'de', 'auflauf', 50,
    '2 Stk Zucchini | 300 g Hackfleisch gemischt | 1 Stk Zwiebel | 1 Dose Gehackte Tomaten | 150 g Feta | 100 g Gouda gerieben | 1 TL Oregano getrocknet | 1 EL Olivenöl | Salz | Pfeffer',
    [
      'Zucchini in Scheiben schneiden.',
      'Hack mit Zwiebel in Olivenöl anbraten, Tomaten und Oregano zugeben, würzen und 5 Minuten köcheln lassen.',
      'Zucchini und Hacksauce in eine Form schichten, Feta darüber bröseln und mit Gouda bestreuen.',
      'Bei 200 °C 30 Minuten backen.',
    ], 'Zucchiniauflauf'),

  r('spaetzle-auflauf', 'Spätzle-Hähnchen-Auflauf mit Champignons', 'de', 'auflauf', 45,
    '400 g Spätzle frisch | 250 g Hähnchenbrustfilet | 200 g Champignons | 1 Stk Zwiebel | 200 ml Sahne | 150 g Emmentaler gerieben | 1 EL Sonnenblumenöl | 0.5 Bund Schnittlauch | Paprikapulver edelsüß | Salz | Pfeffer',
    [
      'Hähnchen in Streifen schneiden, würzen und im Öl anbraten. Zwiebel und Pilze zugeben und kurz mitbraten.',
      'Mit Sahne ablöschen und abschmecken.',
      'Mit den Spätzle mischen, in eine Form füllen und mit Käse bestreuen.',
      'Bei 200 °C 20 Minuten überbacken und mit Schnittlauch servieren.',
    ], 'Spätzleauflauf'),

  r('fischauflauf', 'Fischauflauf mit Spinat und Kartoffeln', 'de', 'auflauf', 55,
    '400 g Seelachsfilet | 450 g Blattspinat TK | 500 g Kartoffeln festkochend | 1 Stk Zwiebel | 200 ml Sahne | 100 g Gouda gerieben | 1 Stk Zitrone | Muskatnuss | Salz | Pfeffer',
    [
      'Kartoffeln in Scheiben schneiden und 8 Minuten vorkochen. Spinat auftauen und ausdrücken.',
      'Zwiebel andünsten, Spinat zugeben und mit Muskat, Salz und Pfeffer würzen.',
      'Kartoffeln, Spinat und den mit Zitrone beträufelten, gesalzenen Fisch in eine Form schichten. Sahne darüber gießen.',
      'Mit Käse bestreuen und bei 200 °C 25 Minuten backen.',
    ], 'Fischauflauf'),

  r('sauerkraut-auflauf', 'Sauerkraut-Kartoffel-Auflauf mit Kasseler', 'de', 'auflauf', 60,
    '600 g Kartoffeln mehligkochend | 400 g Sauerkraut | 250 g Kasseler Nacken | 1 Stk Zwiebel | 150 ml Milch | 150 g Bergkäse | 1 EL Butter | Muskatnuss | Salz | Pfeffer',
    [
      'Kartoffeln kochen und mit Milch und Butter zu Püree stampfen.',
      'Zwiebel andünsten, Sauerkraut und gewürfelten Kasseler zugeben und 10 Minuten dünsten.',
      'Kraut in eine Form geben, das Püree darauf verstreichen und mit Käse bestreuen.',
      'Bei 200 °C 25 Minuten goldbraun backen.',
    ], 'Sauerkraut Auflauf'),

  r('rosenkohl-gratin', 'Rosenkohl-Gratin mit Speck', 'de', 'auflauf', 50,
    '600 g Rosenkohl | 500 g Kartoffeln festkochend | 100 g Speckwürfel | 200 ml Sahne | 100 g Bergkäse | Muskatnuss | Salz | Pfeffer',
    [
      'Rosenkohl putzen, halbieren und 6 Minuten blanchieren. Kartoffeln in Scheiben schneiden und vorkochen.',
      'Speck knusprig anbraten.',
      'Alles in eine Form geben, gewürzte Sahne darüber gießen und mit Käse bestreuen.',
      'Bei 200 °C 25 Minuten gratinieren.',
    ], 'Rosenkohl Gratin'),

  r('chicoree-gratin', 'Chicorée-Schinken-Gratin', 'de', 'auflauf', 40,
    '4 Stk Chicorée | 4 Scheibe Kochschinken | 30 g Butter | 30 g Weizenmehl | 350 ml Milch | 100 g Gruyère | 1 Stk Zitrone | 500 g Kartoffeln festkochend | Muskatnuss | Salz | Pfeffer',
    [
      'Chicorée halbieren, den bitteren Strunk keilförmig herausschneiden und 5 Minuten in Salzwasser mit Zitronensaft vorgaren.',
      'Jede Hälfte in eine halbe Scheibe Schinken wickeln und in eine Form legen.',
      'Béchamel aus Butter, Mehl und Milch kochen, würzen, über den Chicorée gießen und mit Käse bestreuen.',
      'Bei 200 °C 20 Minuten gratinieren. Dazu Salzkartoffeln servieren.',
    ], 'Chicorée überbacken'),

  r('kartoffel-lauch-gratin', 'Kartoffel-Lauch-Gratin mit Bratwurst', 'de', 'auflauf', 60,
    '700 g Kartoffeln festkochend | 2 Stk Lauch | 2 Stk Bratwurst | 200 ml Sahne | 100 ml Gemüsebrühe | 100 g Bergkäse | Muskatnuss | Salz | Pfeffer',
    [
      'Kartoffeln in dünne Scheiben hobeln, Lauch in Ringe schneiden.',
      'Bratwurst aus der Pelle drücken, in kleinen Stücken anbraten und den Lauch kurz mitdünsten.',
      'Kartoffeln und Lauch-Wurst-Mischung in eine Form schichten. Sahne und Brühe würzen und darüber gießen.',
      'Mit Käse bestreuen und bei 190 °C 45 Minuten backen.',
    ], 'Kartoffel-Lauch-Auflauf'),

  // ───────────── Festtage & Klassiker ─────────────
  fest(r('gaensekeulen-rotkohl', 'Gänsekeulen mit Rotkohl und Kartoffelklößen', 'de', 'haupt', 190,
    '2 Stk Gänsekeule | 2 Stk Zwiebel | 1 Stk Apfel | 1 Stk Orange | 2 TL Majoran | 200 ml Rotwein | 300 ml Rinderfond | 800 g Rotkohl | 1 Stk Apfel säuerlich | 2 EL Rotweinessig | 1 EL Zucker | 1 Blatt Lorbeerblatt | 2 Stk Nelke | 1 Pck Kartoffelknödel halb und halb | 1 EL Speisestärke | 1 EL Butterschmalz | Salz | Pfeffer',
    [
      'Gänsekeulen waschen, trocken tupfen, mit Salz, Pfeffer und Majoran einreiben. Die Haut mit einer Gabel mehrfach einstechen, damit das Fett austreten kann.',
      'Keulen mit der Hautseite nach unten in einem Bräter in Butterschmalz anbraten, wenden und herausnehmen. Zwiebeln, Apfel und Orange in Stücken im Fett leicht anrösten und mit Rotwein ablöschen.',
      'Fond angießen, Keulen mit der Haut nach oben einlegen und im Ofen bei 160 °C zugedeckt 2 Stunden schmoren. Anschließend ohne Deckel bei 200 °C 20 bis 25 Minuten kross braten.',
      'Rotkohl fein hobeln, mit gewürfeltem Apfel, Essig, Zucker, Lorbeer, Nelken und 100 ml Wasser ca. 45 Minuten weich schmoren und abschmecken.',
      'Klöße nach Packungsanweisung in siedendem Wasser garen. Bratensatz durch ein Sieb passieren, entfetten und mit angerührter Stärke zur Soße binden. Alles zusammen servieren.',
    ], 'roast goose leg red cabbage dumplings'), 'martini', 'weihnachten'),

  fest(r('entenbrust-orangensauce', 'Entenbrust mit Orangensauce, Rotkohl und Kartoffelgratin', 'de', 'haupt', 90,
    '350 g Entenbrust | 2 Stk Orange | 1 EL Honig | 100 ml Kalbsfond | 2 EL Butter | 400 g Rotkohl | 1 Stk Apfel säuerlich | 1 EL Rotweinessig | 1 TL Zucker | 500 g Kartoffeln festkochend | 150 ml Sahne | 1 Zehe Knoblauch | 50 g Gruyère | Muskatnuss | Salz | Pfeffer',
    [
      'Kartoffeln in dünne Scheiben hobeln, in eine gebutterte Form schichten, mit Sahne, Knoblauch, Salz, Pfeffer und Muskat übergießen, mit Gruyère bestreuen und bei 180 °C 45 Minuten backen.',
      'Rotkohl fein hobeln, mit gewürfeltem Apfel, Essig, Zucker, Salz und 80 ml Wasser 35 Minuten weich schmoren.',
      'Die Haut der Entenbrust rautenförmig einritzen, salzen und pfeffern. Mit der Hautseite nach unten in eine kalte Pfanne legen, langsam erhitzen und 8 bis 10 Minuten knusprig auslassen. Wenden, 4 Minuten braten und dann 5 Minuten im 160 °C warmen Ofen fertig garen. Ruhen lassen.',
      'Für die Soße den Saft von 1 Orange mit Honig und Fond einkochen, mit kalter Butter aufschlagen. Die zweite Orange filetieren und kurz in der Soße erwärmen.',
      'Entenbrust aufschneiden und mit Soße, Rotkohl und Gratin servieren.',
    ], 'duck breast orange sauce'), 'weihnachten'),

  fest(r('entenkeulen-rotkohl', 'Knusprige Entenkeulen mit Rotkohl und Klößen', 'de', 'haupt', 140,
    '2 Stk Entenkeule | 2 Stk Zwiebel | 1 Stk Apfel | 1 TL Majoran | 150 ml Rotwein | 200 ml Rinderfond | 600 g Rotkohl | 1 Stk Apfel säuerlich | 2 EL Rotweinessig | 1 EL Zucker | 1 Blatt Lorbeerblatt | 1 Pck Kartoffelknödel halb und halb | 1 EL Speisestärke | Salz | Pfeffer',
    [
      'Entenkeulen salzen, pfeffern und mit Majoran einreiben. Haut mehrfach einstechen.',
      'Keulen mit Zwiebelspalten und Apfelstücken in einen Bräter legen, Rotwein und Fond angießen und zugedeckt bei 170 °C 75 Minuten schmoren.',
      'Deckel abnehmen, die Hitze auf 210 °C erhöhen und weitere 25 Minuten braten, bis die Haut knusprig ist.',
      'Rotkohl fein hobeln und mit Apfel, Essig, Zucker, Lorbeer und 100 ml Wasser ca. 45 Minuten schmoren. Klöße nach Packungsanweisung garen.',
      'Bratensud passieren, entfetten, mit angerührter Stärke binden und abschmecken. Alles zusammen anrichten.',
    ], 'roast duck legs red cabbage'), 'weihnachten'),

  r('kalbsbraten-rahmsauce', 'Kalbsbraten mit Rahmsauce und Spätzle', 'de', 'haupt', 120,
    '800 g Kalbsbraten | 1 Stk Zwiebel | 1 Stk Möhre | 2 EL Butterschmalz | 150 ml Weißwein | 200 ml Kalbsfond | 150 ml Sahne | 200 g Champignons | 400 g Spätzle frisch | 1 EL Butter | 1 TL Speisestärke | Salz | Pfeffer',
    [
      'Kalbsbraten salzen und pfeffern und in Butterschmalz im Bräter rundum anbraten. Zwiebel und Möhre würfeln, kurz mitrösten und mit Weißwein ablöschen.',
      'Fond angießen und den Braten zugedeckt bei 160 °C ca. 75 Minuten garen, bis die Kerntemperatur 68 °C erreicht. Herausnehmen und in Folie ruhen lassen.',
      'Bratensud durch ein Sieb gießen, mit Sahne aufkochen und sämig einkochen. Champignons in Butter anbraten und zugeben, nach Bedarf mit Stärke binden.',
      'Spätzle in Butter schwenken oder nach Packung erhitzen. Braten aufschneiden und mit Rahmsauce und Spätzle servieren.',
    ], 'veal roast cream sauce spaetzle'),

  // ───────────── Gehobene Braten (Wochenendprojekte; Fond: gekauft oder Grundrezept) ─────────────
  r('rinderschmorbraten-rotwein', 'Rinderschmorbraten in Rotweinsauce mit Serviettenknödeln und Apfelrotkohl', 'de', 'haupt', 210,
    '800 g Rinderbraten aus der Keule | 2 EL Butterschmalz | 2 Stk Zwiebel | 2 Stk Möhre | 150 g Knollensellerie | 1 EL Tomatenmark | 400 ml Rotwein | 400 ml Rinderfond | 1 Blatt Lorbeerblatt | 4 Stk Wacholderbeere | 2 Zweig Thymian | 4 Stk Brötchen vom Vortag | 200 ml Milch | 2 Stk Ei | 0.5 Bund Petersilie | 40 g Butter | 500 g Rotkohl | 1 Stk Apfel | 2 EL Rotweinessig | 1 EL Zucker | 2 Stk Nelke | Muskatnuss | Salz | Pfeffer',
    [
      'Den Rinderbraten salzen, pfeffern und im Butterschmalz im Bräter rundum kräftig anbraten, dann herausnehmen. 1 Zwiebel, Möhren und Sellerie grob würfeln und im Bratfett anrösten, das Tomatenmark kurz mitrösten.',
      'Mit dem Rotwein in drei Portionen ablöschen und jeweils fast ganz einkochen lassen. Rinderfond, Lorbeer, Wacholderbeeren und Thymian zugeben, den Braten einlegen und zugedeckt bei 150 °C ca. 2,5 Stunden schmoren, bis eine Gabel leicht hineingleitet.',
      'Für die Serviettenknödel die Brötchen würfeln, mit warmer Milch übergießen und 15 Minuten ziehen lassen. Die zweite Zwiebel fein würfeln und in 10 g Butter glasig dünsten. Mit Eiern, gehackter Petersilie, Salz und Muskat unter die Brötchen kneten.',
      'Die Masse zu einer Rolle (ca. 7 cm dick) formen, fest in gebutterte Frischhaltefolie oder ein Tuch wickeln, die Enden abbinden und 35 Minuten über Dampf garen.',
      'Den Rotkohl fein hobeln und mit gewürfeltem Apfel, Essig, Zucker, Nelken, Salz und 100 ml Wasser zugedeckt 45 Minuten weich schmoren.',
      'Den Braten herausnehmen, die Sauce durch ein Sieb passieren, auf ca. 300 ml einkochen und 20 g kalte Butter einschwenken. Knödelscheiben in der restlichen Butter goldbraun braten, den Braten aufschneiden und alles mit Sauce und Rotkohl anrichten.',
    ], 'braised beef red wine sauce bread dumpling'),

  r('ochsenbaeckchen-spaetburgunder', 'Ochsenbäckchen in Spätburgunder mit Selleriepüree und glasierten Möhren', 'de', 'haupt', 240,
    '800 g Ochsenbäckchen | 1 EL Weizenmehl | 2 EL Butterschmalz | 2 Stk Schalotte | 5 Stk Möhre | 600 g Knollensellerie | 1 Zehe Knoblauch | 1 EL Tomatenmark | 500 ml Rotwein | 500 ml Rinderfond | 2 Zweig Thymian | 1 Blatt Lorbeerblatt | 150 ml Milch | 50 g Butter | 1 TL Zucker | 0.5 Bund Petersilie | Muskatnuss | Salz | Pfeffer',
    [
      'Die Ochsenbäckchen von Fett und Silberhaut befreien, salzen, pfeffern und dünn im Mehl wenden. Im Butterschmalz im Bräter rundum dunkel anbraten und herausnehmen.',
      'Schalotten, 1 Möhre, 100 g Sellerie und Knoblauch würfeln und im Bratfett anrösten, Tomatenmark mitrösten. Den Rotwein (Spätburgunder) nach und nach angießen und jeweils sirupartig einkochen.',
      'Rinderfond, Thymian und Lorbeer zugeben, die Bäckchen einlegen und zugedeckt bei 140 °C ca. 3 Stunden schmoren, bis sie butterweich sind.',
      'Für das Püree den restlichen Sellerie schälen, würfeln und in der Milch mit etwas Salz zugedeckt 20 Minuten weich garen. Mit 30 g Butter fein pürieren und mit Muskat abschmecken.',
      'Die übrigen Möhren schräg in Scheiben schneiden und mit 20 g Butter, Zucker, Salz und 50 ml Wasser glasieren, bis die Flüssigkeit verkocht ist. Mit Petersilie bestreuen.',
      'Die Bäckchen herausnehmen, die Sauce passieren und sämig einkochen. Die Bäckchen darin glasieren und mit Püree und Möhren anrichten.',
    ], 'braised ox cheeks red wine celeriac puree'),

  r('rinderfilet-rotweinjus', 'Rinderfilet rosa mit Rotweinjus, Herzoginkartoffeln und Speckbohnen', 'de', 'haupt', 150,
    '500 g Rinderfilet | 1 EL Butterschmalz | 2 Zweig Thymian | 2 Stk Schalotte | 200 ml Rotwein | 300 ml Rinderfond | 70 g Butter | 500 g Kartoffeln mehligkochend | 2 Stk Eigelb | 300 g Grüne Bohnen | 6 Scheibe Bacon | Muskatnuss | Salz | Pfeffer',
    [
      'Das Rinderfilet 1 Stunde vorher aus dem Kühlschrank nehmen, parieren und mit Küchengarn in Form binden. Direkt vor dem Anbraten salzen und im Butterschmalz rundum höchstens 5 Minuten anbraten, den Thymian kurz mitbraten.',
      'Das Filet bei 80 °C mit Bratenthermometer garen, bis die Kerntemperatur 54 °C erreicht (ca. 1,5 Stunden). Pfeffern und kurz ruhen lassen.',
      'Die Kartoffeln schälen und weich garen, die Bohnen putzen und 7 Minuten garen, dann kalt abschrecken.',
      'Die Kartoffeln ausdampfen lassen, durchpressen und mit Eigelb, 30 g Butter, Salz und Muskat glatt rühren. Mit einem Spritzbeutel Rosetten auf ein Blech spritzen und bei 200 °C ca. 15 Minuten goldbraun backen.',
      'Die Bohnen zu 6 Bündeln mit je einer Scheibe Bacon umwickeln und in der Pfanne rundum knusprig braten.',
      'Für den Jus die Schalotten fein würfeln und im Bratensatz anschwitzen. Mit Rotwein ablöschen und fast ganz einkochen, Rinderfond zugeben und auf ein Drittel reduzieren. Durch ein Sieb gießen und 40 g kalte Butter einschwenken. Das Filet aufschneiden und anrichten.',
    ], 'beef tenderloin medium rare red wine jus duchess potatoes'),

  r('roastbeef-remoulade', 'Roastbeef rosa mit Remoulade und Bratkartoffeln', 'de', 'haupt', 150,
    '600 g Roastbeef | 2 EL Butterschmalz | 600 g Kartoffeln festkochend | 50 g Speckwürfel | 1 Stk Zwiebel | 100 g Mayonnaise | 100 g Joghurt natur | 2 Stk Gewürzgurke | 1 EL Kapern | 1 TL Senf mittelscharf | 0.5 Bund Petersilie | 0.5 Bund Schnittlauch | Pfeffer schwarz grob | Salz',
    [
      'Das Roastbeef 1 Stunde vorher aus dem Kühlschrank nehmen und den Fettdeckel rautenförmig einritzen. Direkt vor dem Anbraten salzen und in 1 EL Butterschmalz rundum höchstens 5 Minuten anbraten, die Fettseite zuerst.',
      'Bei 80 °C mit Bratenthermometer garen, bis die Kerntemperatur 55 °C erreicht (ca. 2 Stunden). Mit grobem Pfeffer einreiben, ruhen lassen und lauwarm oder kalt hauchdünn aufschneiden.',
      'Die Kartoffeln mit Schale garen (gern schon am Vortag), pellen und in Scheiben schneiden.',
      'Für die Remoulade Gewürzgurken, Kapern, Petersilie und Schnittlauch fein hacken und mit Mayonnaise, Joghurt und Senf verrühren. Mit Salz, Pfeffer und etwas Gurkenwasser abschmecken.',
      'Die Speckwürfel in der Pfanne auslassen, die Kartoffeln im restlichen Butterschmalz goldbraun braten und die gewürfelte Zwiebel die letzten Minuten mitbraten. Salzen, pfeffern und mit Roastbeef und Remoulade servieren.',
    ], 'roast beef sliced remoulade fried potatoes'),

  r('schaeufele-kloesse', 'Fränkisches Schäufele mit Kartoffelklößen und Speck-Krautsalat', 'de', 'haupt', 210,
    '1000 g Schäufele | 1 TL Kümmel | 2 Stk Zwiebel | 1 Stk Möhre | 100 g Knollensellerie | 330 ml Dunkelbier | 300 ml Rinderfond | 1 EL Speisestärke | 800 g Kartoffeln mehligkochend | 1 Stk Brötchen vom Vortag | 10 g Butter | 400 g Weißkohl | 50 g Speckwürfel | 3 EL Weißweinessig | 2 EL Sonnenblumenöl | 1 TL Zucker | Salz | Pfeffer',
    [
      'Die Schwarte des Schäufele rautenförmig einschneiden, ohne ins Fleisch zu schneiden. Das Fleisch mit Salz, Pfeffer und Kümmel einreiben und mit der Schwarte nach unten in einen Bräter mit 2 cm Wasser legen. Bei 180 °C 30 Minuten garen.',
      'Das Schäufele umdrehen, Zwiebeln, Möhre und Sellerie grob geschnitten zugeben, das Dunkelbier angießen und bei 170 °C 2 Stunden garen. Dabei immer wieder mit dem Sud übergießen.',
      'Zum Schluss bei 220 °C 20 Minuten weiterbraten, bis die Schwarte knusprig aufpoppt.',
      'Für die Klöße 300 g Kartoffeln mit Schale garen, pellen und fein stampfen. Die übrigen Kartoffeln schälen, fein reiben und in einem Tuch kräftig ausdrücken, die abgesetzte Stärke aus dem Saft wieder zugeben. Alles mit Salz zu einem Teig verkneten. Das Brötchen würfeln und in Butter rösten, 6 Klöße formen und je einige Croutons in die Mitte drücken.',
      'Die Klöße 25 Minuten über Dampf oder in siedendem Salzwasser garen, ohne dass das Wasser sprudelt.',
      'Für den Krautsalat den Weißkohl fein hobeln und mit Salz kräftig durchkneten. Die Speckwürfel knusprig auslassen und mit Essig, Öl und Zucker unter den Kohl mischen.',
      'Den Bratensud durch ein Sieb gießen, entfetten, mit Rinderfond aufgießen und etwas einkochen. Mit angerührter Speisestärke binden und abschmecken.',
    ], 'Schäufele'),

  r('krustenbraten-dunkelbier', 'Krustenbraten vom Schweinebauch mit Dunkelbiersauce, Brezenknödeln und Rosenkohl mit Maronen', 'de', 'haupt', 180,
    '600 g Schweinebauch mit Schwarte | 1 TL Kümmel | 1 TL Majoran | 2 Zehe Knoblauch | 2 Stk Zwiebel | 1 Stk Möhre | 330 ml Dunkelbier | 200 ml Rinderfond | 1 TL Speisestärke | 3 Stk Laugenbrezel | 150 ml Milch | 2 Stk Ei | 0.5 Bund Petersilie | 30 g Butter | 400 g Rosenkohl | 100 g Maronen vorgegart | 1 TL Zucker | Muskatnuss | Salz | Pfeffer',
    [
      'Die Schwarte des Schweinebauchs in 1-cm-Rauten einschneiden. Die Fleischseite mit Salz, Pfeffer, Kümmel, Majoran und Knoblauch einreiben, die Schwarte nur salzen. Mit der Schwarte nach unten in einen Bräter mit 2 cm Wasser legen und bei 170 °C 30 Minuten garen.',
      'Den Braten umdrehen, 1 Zwiebel und die Möhre grob geschnitten zugeben, das Dunkelbier angießen und bei 160 °C ca. 75 Minuten garen, bis der Kern 75 °C erreicht.',
      'Für die Kruste bei 220 °C 20 Minuten weiterbraten, bis die Schwarte aufpoppt.',
      'Für die Brezenknödel die Laugenbrezeln in Würfel schneiden und mit warmer Milch übergießen. Die zweite Zwiebel fein würfeln, in 10 g Butter glasig dünsten und mit Eiern, Petersilie, Salz und Muskat unter die Brezen mischen. 15 Minuten ziehen lassen und 6 Knödel formen.',
      'Die Knödel in reichlich Salzwasser 20 Minuten sanft ziehen lassen, ohne dass es kocht.',
      'Den Rosenkohl putzen und in Salzwasser 8 Minuten garen. In der restlichen Butter mit den Maronen und dem Zucker kurz glasieren.',
      'Den Bratensud durch ein Sieb gießen, entfetten, mit Rinderfond aufgießen, etwas einkochen und mit angerührter Speisestärke binden. Den Braten in Scheiben schneiden und mit Knödeln, Rosenkohl und Sauce servieren.',
    ], 'crispy pork belly roast crackling dumpling'),

  r('schweinefilet-speckmantel', 'Schweinefilet im Speck-Kräuter-Mantel mit Rahmwirsing und Schupfnudeln', 'de', 'haupt', 60,
    '500 g Schweinefilet | 8 Scheibe Bacon | 2 Zweig Thymian | 1 Zweig Rosmarin | 0.5 Bund Petersilie | 1 TL Senf mittelscharf | 1 EL Butterschmalz | 500 g Wirsing | 1 Stk Zwiebel | 100 ml Kalbsfond | 150 ml Sahne | 400 g Schupfnudeln | 20 g Butter | Muskatnuss | Salz | Pfeffer',
    [
      'Das Schweinefilet parieren, pfeffern und dünn mit Senf bestreichen. Thymian, Rosmarin und Petersilie fein hacken, das Filet darin wälzen und mit den Baconscheiben überlappend umwickeln.',
      'Im Butterschmalz rundum 4 Minuten anbraten und bei 180 °C ca. 18 Minuten garen, bis der Kern 62 °C erreicht. 5 Minuten ruhen lassen.',
      'Den Wirsing in feine Streifen schneiden, die Zwiebel würfeln und in 10 g Butter glasig dünsten. Wirsing zugeben, mit Kalbsfond und Sahne aufgießen und 10 Minuten sämig garen. Mit Salz, Pfeffer und Muskat abschmecken.',
      'Die Schupfnudeln in der restlichen Butter goldbraun braten.',
      'Das Filet in dicke Scheiben schneiden und mit Rahmwirsing und Schupfnudeln anrichten.',
    ], 'pork tenderloin wrapped bacon savoy cabbage'),

  r('kalbshuefte-morchelrahm', 'Kalbshüfte rosa mit Morchelrahm und Butterspätzle', 'de', 'haupt', 150,
    '600 g Kalbshüfte | 1 EL Butterschmalz | 20 g Morcheln getrocknet | 2 Stk Schalotte | 100 ml Weißwein | 200 ml Kalbsfond | 150 ml Sahne | 250 g Weizenmehl | 3 Stk Ei | 40 g Butter | 0.5 Bund Schnittlauch | Muskatnuss | Salz | Pfeffer',
    [
      'Die Morcheln in 200 ml lauwarmem Wasser 30 Minuten einweichen. Abgießen, das Einweichwasser durch einen Kaffeefilter auffangen, die Pilze gründlich waschen und große halbieren.',
      'Die Kalbshüfte 1 Stunde vorher aus dem Kühlschrank nehmen und Sehnen entfernen. Direkt vor dem Anbraten salzen und im Butterschmalz rundum höchstens 5 Minuten anbraten.',
      'Bei 80 °C mit Bratenthermometer garen, bis die Kerntemperatur 61 °C erreicht (ca. 1,5 bis 2 Stunden). Pfeffern und ruhen lassen.',
      'Für die Spätzle Mehl, Eier, ca. 80 ml Wasser, Salz und Muskat kräftig schlagen, bis der Teig Blasen wirft, und 10 Minuten ruhen lassen.',
      'Den Teig portionsweise in siedendes Salzwasser schaben oder drücken. Sobald die Spätzle oben schwimmen, abschöpfen.',
      'Für den Rahm die Schalotten fein würfeln und in 10 g Butter anschwitzen, die Morcheln 2 Minuten mitdünsten. Mit Weißwein ablöschen und einkochen, Kalbsfond, Einweichwasser und Sahne zugeben und sämig einkochen.',
      'Die Spätzle in der restlichen Butter schwenken und mit Schnittlauch bestreuen. Die Hüfte aufschneiden und mit Morchelrahm und Spätzle anrichten.',
    ], 'veal roast morel cream sauce spaetzle'),

  r('kalbsbaeckchen-weissweinrahm', 'Geschmorte Kalbsbäckchen in Weißweinrahm mit Kartoffelpüree und Butter-Erbsen', 'de', 'haupt', 180,
    '600 g Kalbsbäckchen | 1 EL Weizenmehl | 2 EL Butterschmalz | 2 Stk Schalotte | 1 Stk Möhre | 100 g Knollensellerie | 200 ml Weißwein | 500 ml Kalbsfond | 1 Blatt Lorbeerblatt | 2 Zweig Thymian | 100 ml Sahne | 600 g Kartoffeln mehligkochend | 150 ml Milch | 50 g Butter | 200 g Erbsen TK | Muskatnuss | Salz | Pfeffer',
    [
      'Die Kalbsbäckchen parieren, salzen, pfeffern und dünn im Mehl wenden. Im Butterschmalz rundum hell anbraten und herausnehmen.',
      'Schalotten, Möhre und Sellerie fein würfeln und glasig anschwitzen. Mit Weißwein ablöschen und zur Hälfte einkochen.',
      'Kalbsfond, Lorbeer und Thymian zugeben, die Bäckchen einlegen und zugedeckt bei 150 °C ca. 2 Stunden schmoren, bis sie weich sind.',
      'Die Kartoffeln schälen und weich garen. Ausdampfen lassen, durchpressen und mit heißer Milch, 30 g Butter, Salz und Muskat zu Püree rühren.',
      'Die Erbsen in der restlichen Butter 4 Minuten dünsten und salzen.',
      'Die Bäckchen herausnehmen, die Sauce passieren, Sahne zugeben und sämig einkochen. Die Bäckchen in der Sauce erwärmen und mit Püree und Erbsen anrichten.',
    ], 'braised veal cheeks mashed potatoes'),

  r('lammkeule-rosmarinjus', 'Lammkeule rosa mit Rosmarin-Knoblauch-Jus, grünen Bohnen und Kartoffelgratin', 'de', 'haupt', 180,
    '800 g Lammkeule ohne Knochen | 4 Zehe Knoblauch | 3 Zweig Rosmarin | 1 EL Olivenöl | 600 g Kartoffeln festkochend | 150 ml Sahne | 100 ml Milch | 40 g Gruyère | 40 g Butter | 2 Stk Schalotte | 150 ml Rotwein | 300 ml Lammfond | 300 g Grüne Bohnen | Muskatnuss | Salz | Pfeffer',
    [
      'Die Lammkeule 1 Stunde vorher aus dem Kühlschrank nehmen und mit Küchengarn in Form binden. Direkt vor dem Anbraten salzen und im Olivenöl rundum höchstens 5 Minuten anbraten, 2 angedrückte Knoblauchzehen und 2 Zweige Rosmarin kurz mitbraten.',
      'Bei 80 °C mit Bratenthermometer garen, bis die Kerntemperatur 60 °C erreicht (ca. 2 Stunden). Pfeffern und ruhen lassen.',
      'Für das Gratin die Kartoffeln schälen und in dünne Scheiben hobeln. Eine Form mit 1 Knoblauchzehe ausreiben und mit 10 g Butter fetten. Kartoffeln einschichten, Sahne und Milch mit Salz, Pfeffer und Muskat darübergießen, mit Gruyère bestreuen und bei 170 °C ca. 45 Minuten backen.',
      'Für den Jus die Schalotten fein würfeln und im Bratensatz anschwitzen, den restlichen Rosmarin zugeben. Mit Rotwein ablöschen und fast ganz einkochen, Lammfond zugeben und auf ein Drittel reduzieren. Passieren und 20 g kalte Butter einschwenken.',
      'Die Bohnen in Salzwasser 7 Minuten garen und in der restlichen Butter mit der letzten, fein gehackten Knoblauchzehe schwenken.',
      'Die Keule aufschneiden und mit Jus, Bohnen und Gratin anrichten.',
    ], 'roast leg of lamb pink gratin green beans'),

  r('lammhaxen-polenta', 'Geschmorte Lammhaxen mit Rosmarin, Schmorgemüse und cremiger Polenta', 'de', 'haupt', 180,
    '2 Stk Lammhaxe | 2 EL Olivenöl | 2 Stk Zwiebel | 2 Stk Möhre | 100 g Knollensellerie | 3 Zehe Knoblauch | 1 EL Tomatenmark | 250 ml Rotwein | 500 ml Lammfond | 1 Dose Gehackte Tomaten | 3 Zweig Rosmarin | 1 Blatt Lorbeerblatt | 150 g Polenta | 300 ml Milch | 30 g Parmigiano Reggiano | 20 g Butter | 0.5 Bund Petersilie | 1 Stk Zitrone unbehandelt | Salz | Pfeffer',
    [
      'Die Lammhaxen salzen, pfeffern und im Olivenöl im Bräter rundum kräftig anbraten, dann herausnehmen.',
      'Zwiebeln, Möhren und Sellerie grob würfeln, 2 Knoblauchzehen andrücken und alles im Bratfett anrösten. Tomatenmark mitrösten, mit Rotwein ablöschen und einkochen.',
      'Lammfond, Tomaten, Rosmarin und Lorbeer zugeben, die Haxen einlegen und zugedeckt bei 160 °C ca. 2,5 Stunden schmoren, bis sich das Fleisch vom Knochen löst. Nach der Hälfte wenden.',
      'Für die Polenta Milch, 300 ml Wasser und Salz aufkochen, die Polenta einrieseln lassen und unter Rühren bei kleiner Hitze 15 Minuten quellen lassen. Parmesan und Butter unterrühren.',
      'Für die Gremolata Petersilie und den letzten Knoblauch fein hacken und mit abgeriebener Zitronenschale mischen.',
      'Die Schmorsauce etwas einkochen und abschmecken. Die Haxen mit Schmorgemüse und Sauce auf der Polenta anrichten und mit Gremolata bestreuen.',
    ], 'braised lamb shank polenta'),

  r('kalbsbrust-gefuellt', 'Gefüllte Kalbsbrust mit Kräuterfüllung und schwäbischem Kartoffelsalat', 'de', 'haupt', 180,
    '800 g Kalbsbrust | 3 Stk Brötchen vom Vortag | 150 ml Milch | 2 Stk Ei | 3 Stk Zwiebel | 1 Bund Petersilie | 20 g Butter | 2 EL Butterschmalz | 1 Stk Möhre | 150 ml Weißwein | 400 ml Kalbsfond | 600 g Kartoffeln festkochend | 200 ml Rinderbrühe | 3 EL Weißweinessig | 2 EL Sonnenblumenöl | 1 TL Senf mittelscharf | 0.5 Bund Schnittlauch | Muskatnuss | Salz | Pfeffer',
    [
      'Für die Füllung die Brötchen würfeln, mit warmer Milch übergießen und 15 Minuten ziehen lassen. 1 Zwiebel fein würfeln und in der Butter glasig dünsten, mit Eiern, gehackter Petersilie, Salz und Muskat unter die Brötchen kneten.',
      'Die Kalbsbrust (vom Metzger eine Tasche einschneiden lassen) innen und außen salzen und pfeffern. Die Füllung hineingeben und die Öffnung mit Küchengarn zunähen.',
      'Die Brust im Butterschmalz im Bräter rundum anbraten, 1 Zwiebel und die Möhre grob geschnitten mitrösten. Mit Weißwein ablöschen und den Kalbsfond angießen.',
      'Zugedeckt bei 150 °C ca. 2 Stunden garen, bis der Kern 75 °C erreicht, dabei öfter begießen. Die letzten 15 Minuten ohne Deckel bei 200 °C bräunen.',
      'Für den Kartoffelsalat die Kartoffeln mit Schale garen, pellen und warm in dünne Scheiben schneiden. Die letzte Zwiebel fein würfeln, mit Brühe, Essig, Senf, Salz und Pfeffer aufkochen und heiß über die Kartoffeln gießen. 20 Minuten ziehen lassen, dann Öl und Schnittlauch unterheben.',
      'Den Bratensud passieren und etwas einkochen. Die Kalbsbrust in dicke Scheiben schneiden und mit Sauce und Kartoffelsalat servieren.',
    ], 'stuffed veal breast potato salad'),

  // ───────────── Eintöpfe ─────────────
  r('bud-spencer-eintopf', 'Bud-Spencer-Eintopf mit Hack, Bohnen und Mais', 'de', 'eintopf', 45,
    '400 g Hackfleisch gemischt | 1 Stk Zwiebel | 2 Zehe Knoblauch | 1 Stk Paprika rot | 1 Dose Kidneybohnen | 1 Dose Weiße Bohnen | 1 Dose Mais | 400 g Passierte Tomaten | 2 EL Tomatenmark | 400 ml Rinderbrühe | 2 TL Paprikapulver edelsüß | 1 TL Kreuzkümmel | 1 TL Chiliflocken | 2 EL Sonnenblumenöl | Salz | Pfeffer',
    [
      'Zwiebel, Knoblauch und Paprika würfeln. Hack in Öl im großen Topf krümelig und kräftig anbraten.',
      'Zwiebel, Knoblauch und Paprika zugeben, Tomatenmark und Gewürze 2 Minuten mitrösten.',
      'Passierte Tomaten und Brühe angießen. Abgetropfte Bohnen und Mais zugeben und 25 Minuten köcheln lassen.',
      'Kräftig mit Salz, Pfeffer und Chili abschmecken. Dazu passt Brot.',
    ], 'bean mince stew pot'),

  r('schnippelbohneneintopf', 'Schnippelbohneneintopf mit Mettwurst', 'de', 'eintopf', 60,
    '500 g Grüne Bohnen | 500 g Kartoffeln festkochend | 1 Stk Zwiebel | 2 Stk Mettenden | 1 EL Butterschmalz | 700 ml Gemüsebrühe | 1 Bund Bohnenkraut | 1 Stk Möhre | 1 Bund Petersilie | Salz | Pfeffer | Weißweinessig',
    [
      'Bohnen putzen und in kleine Stücke schneiden (schnippeln). Kartoffeln und Möhre würfeln, Zwiebel hacken.',
      'Zwiebel in Butterschmalz andünsten, Bohnen, Möhre und Kartoffeln zugeben, mit Brühe auffüllen und Bohnenkraut zugeben.',
      'Zugedeckt 25 Minuten köcheln. Mettenden in Scheiben schneiden und die letzten 10 Minuten mitgaren.',
      'Mit Salz, Pfeffer und einem Schuss Essig abschmecken und mit Petersilie bestreuen.',
    ], 'green bean stew sausage'),

  r('sauerkrauteintopf-kasseler', 'Sauerkrauteintopf mit Kasseler', 'de', 'eintopf', 55,
    '400 g Kasseler Nacken | 500 g Sauerkraut | 500 g Kartoffeln mehligkochend | 1 Stk Zwiebel | 1 EL Butterschmalz | 800 ml Rinderbrühe | 5 Stk Wacholderbeere | 1 Blatt Lorbeerblatt | 1 TL Paprikapulver edelsüß | 100 g Schmand | Salz | Pfeffer',
    [
      'Zwiebel würfeln und in Butterschmalz glasig dünsten, Paprikapulver kurz mitrösten.',
      'Sauerkraut zugeben und kurz anschwitzen. Kartoffeln würfeln und mit Brühe, Wacholder und Lorbeer dazugeben.',
      'Kasseler in Würfel schneiden, zufügen und 30 Minuten bei kleiner Hitze köcheln.',
      'Mit Salz und Pfeffer abschmecken und mit einem Klecks Schmand servieren.',
    ], 'sauerkraut stew smoked pork'),

  r('kuerbis-hack-eintopf', 'Kürbis-Hack-Eintopf mit Kartoffeln', 'de', 'eintopf', 45,
    '400 g Hackfleisch gemischt | 600 g Hokkaido-Kürbis | 300 g Kartoffeln festkochend | 1 Stk Zwiebel | 1 Stk Paprika rot | 2 EL Tomatenmark | 700 ml Rinderbrühe | 1 TL Paprikapulver edelsüß | 1 TL Majoran | 100 g Schmand | 1 EL Sonnenblumenöl | Salz | Pfeffer',
    [
      'Kürbis entkernen und mit Schale (Hokkaido) würfeln. Kartoffeln, Zwiebel und Paprika würfeln.',
      'Hack in Öl krümelig anbraten, Zwiebel zugeben und Tomatenmark mitrösten. Mit Paprika und Majoran würzen.',
      'Kürbis, Kartoffeln und Paprika zugeben, Brühe angießen und 20 Minuten köcheln, bis alles weich ist.',
      'Einen Teil des Kürbisses zerdrücken, damit der Eintopf sämig wird. Mit Schmand, Salz und Pfeffer abschmecken.',
    ], 'pumpkin minced meat stew'),

  r('paprika-hack-topf', 'Paprika-Hack-Topf mit Sahne', 'de', 'eintopf', 40,
    '400 g Hackfleisch gemischt | 3 Stk Paprika rot | 1 Stk Paprika gelb | 1 Stk Zwiebel | 2 Zehe Knoblauch | 400 g Kartoffeln festkochend | 2 EL Tomatenmark | 500 ml Rinderbrühe | 150 ml Sahne | 2 TL Paprikapulver edelsüß | 1 EL Sonnenblumenöl | Salz | Pfeffer',
    [
      'Paprika in Streifen, Kartoffeln in kleine Würfel schneiden, Zwiebel und Knoblauch hacken.',
      'Hack in Öl scharf anbraten, Zwiebel und Knoblauch zugeben. Tomatenmark und Paprikapulver kurz mitrösten.',
      'Paprika und Kartoffeln zugeben, mit Brühe auffüllen und 20 Minuten köcheln.',
      'Sahne einrühren, kurz aufkochen und mit Salz und Pfeffer abschmecken.',
    ], 'paprika minced meat stew cream'),

  r('westfaelisches-blindhuhn', 'Westfälisches Blindhuhn mit Bohnen, Birnen und Speck', 'de', 'eintopf', 70,
    '300 g Grüne Bohnen | 400 g Kartoffeln festkochend | 2 Stk Birne | 1 Stk Apfel | 150 g Schweinebauch geräuchert | 100 g Speckwürfel | 1 Stk Zwiebel | 800 ml Gemüsebrühe | 1 Bund Bohnenkraut | 1 Stk Möhre | Salz | Pfeffer',
    [
      'Räucherbauch im Ganzen in der Brühe 30 Minuten vorgaren. Speckwürfel in einem Topf auslassen, Zwiebel darin andünsten.',
      'Kartoffeln und Möhre würfeln, Bohnen in Stücke brechen. Mit der Brühe samt Bauch und Bohnenkraut zu den Zwiebeln geben und 20 Minuten garen.',
      'Birne und Apfel schälen, in Spalten schneiden und die letzten 10 Minuten mitgaren.',
      'Fleisch herausnehmen, würfeln und zurück in den Eintopf geben. Mit Salz und Pfeffer abschmecken.',
    ], 'Westfälisches Blindhuhn'),

  r('schnuesch', 'Schnüsch – norddeutscher Gemüseeintopf mit Schinken', 'de', 'eintopf', 50,
    '300 g Möhre | 200 g Grüne Bohnen | 300 g Kartoffeln mehligkochend | 150 g Katenschinken | 200 ml Milch | 500 ml Gemüsebrühe | 1 Stk Zwiebel | 1 EL Butter | 1 EL Weizenmehl | 0.5 Bund Petersilie | Muskatnuss | Salz | Pfeffer',
    [
      'Möhren und Kartoffeln würfeln, Bohnen in Stücke schneiden, Schinken in kleine Würfel schneiden. Zwiebel würfeln.',
      'Zwiebel in Butter andünsten, Mehl darüberstäuben, Brühe und Milch einrühren.',
      'Gemüse zugeben und 20 Minuten köcheln, bis es weich ist.',
      'Schinken zugeben, mit Muskat, Salz und Pfeffer abschmecken und mit Petersilie servieren.',
    ], 'vegetable stew ham milk'),

  r('chili-con-carne', 'Chili con Carne mit Kidneybohnen und Mais', 'de', 'eintopf', 60,
    '450 g Rinderhackfleisch | 1 Stk Zwiebel | 2 Zehe Knoblauch | 1 Stk Paprika rot | 1 Dose Kidneybohnen | 1 Dose Mais | 400 g Gehackte Tomaten | 2 EL Tomatenmark | 200 ml Rinderbrühe | 2 TL Paprikapulver edelsüß | 1 TL Kreuzkümmel | 1 Stk Chili rot | 1 EL Sonnenblumenöl | 100 g Schmand | Salz | Pfeffer',
    [
      'Zwiebel, Knoblauch, Paprika und Chili würfeln. Hack in Öl kräftig und krümelig anbraten.',
      'Zwiebel, Knoblauch und Gewürze zugeben, Tomatenmark kurz mitrösten.',
      'Tomaten, Brühe und Paprika zugeben und 30 Minuten bei kleiner Hitze köcheln. Bohnen und Mais zufügen und 10 Minuten mitkochen.',
      'Abschmecken und mit Schmand servieren, dazu passt Brot oder Reis.',
    ], 'chili con carne bowl'),

  // ───────────── Leicht & sättigend (Abnehm-Abendessen, ca. 500–650 kcal pro Portion) ─────────────
  r('haehnchen-paprika-pfanne', 'Hähnchen-Paprika-Pfanne mit Kartoffelspalten', 'de', 'haupt', 35,
    '300 g Hähnchenbrustfilet | 2 Stk Paprika rot | 1 Stk Paprika gelb | 2 Stk Zwiebel | 200 g Champignons | 1 TL Paprikapulver edelsüß | 1 EL Tomatenmark | 150 ml Hühnerbrühe | 2 EL Sonnenblumenöl | 300 g Kartoffeln festkochend | 0.5 Bund Petersilie | Salz | Pfeffer',
    [
      'Kartoffeln mit Schale in Spalten schneiden, mit 1 EL Öl, Salz und Paprikapulver mischen und im Airfryer knusprig garen.',
      'Hähnchen in mundgerechte Streifen schneiden, salzen und pfeffern. Paprika und Zwiebeln in Streifen, Champignons in Scheiben schneiden.',
      'Restliches Öl in einer großen Pfanne erhitzen und das Hähnchen 5 Minuten kräftig anbraten, herausnehmen.',
      'Zwiebeln, Paprika und Champignons im Bratfett 6 Minuten braten. Tomatenmark kurz mitrösten und mit der Brühe ablöschen.',
      'Hähnchen zurück in die Pfanne geben, 5 Minuten köcheln lassen, abschmecken und mit Petersilie bestreut zu den Kartoffelspalten servieren.',
    ], 'chicken bell pepper skillet'),

  r('puten-champignon-geschnetzeltes', 'Putengeschnetzeltes in leichter Champignonsauce mit Reis', 'de', 'haupt', 30,
    '300 g Putenbrust | 300 g Champignons | 1 Stk Zwiebel | 1 Zehe Knoblauch | 1 EL Weizenmehl | 200 ml Hühnerbrühe | 60 g Crème fraîche | 1 EL Sonnenblumenöl | 0.5 Bund Petersilie | 100 g Langkornreis | Salz | Pfeffer',
    [
      'Reis nach Packungsanweisung garen.',
      'Putenbrust in dünne Streifen schneiden, salzen, pfeffern und mit dem Mehl bestäuben. Champignons in Scheiben, Zwiebel und Knoblauch fein würfeln.',
      'Öl in einer großen Pfanne erhitzen und das Fleisch portionsweise 3 Minuten anbraten, herausnehmen.',
      'Zwiebel, Knoblauch und Champignons im Bratfett 6 Minuten braten, mit der Brühe ablöschen und 5 Minuten einköcheln lassen.',
      'Crème fraîche einrühren, das Fleisch zurück in die Sauce geben, kurz erwärmen und mit Petersilie über dem Reis servieren.',
    ], 'turkey geschnetzeltes mushroom'),

  r('senf-haehnchen-ofengemuese', 'Senf-Hähnchen mit Ofengemüse und Kartoffeln', 'de', 'haupt', 45,
    '320 g Hähnchenbrustfilet | 2 EL Senf mittelscharf | 2 EL Joghurt natur | 2 Stk Möhre | 1 Stk Zucchini | 1 Stk Paprika rot | 1 Stk Zwiebel rot | 300 g Kartoffeln festkochend | 2 Zweig Thymian | 1 EL Sonnenblumenöl | Salz | Pfeffer',
    [
      'Kartoffeln, Möhren, Zucchini, Paprika und Zwiebel in mundgerechte Stücke schneiden, mit Öl, Thymian, Salz und Pfeffer mischen und auf einem Blech verteilen.',
      'Senf mit Joghurt, Salz und Pfeffer verrühren und das Hähnchen damit rundum bestreichen.',
      'Das Gemüse im vorgeheizten Ofen 15 Minuten garen, das Hähnchen daraufsetzen und weitere 20 Minuten garen, bis es durch ist.',
    ], 'mustard chicken roasted vegetables'),

  r('seelachs-gemuesebett', 'Seelachs auf Lauch-Möhren-Gemüsebett mit Dillkartoffeln', 'de', 'haupt', 35,
    '320 g Seelachsfilet | 1 Stk Lauch | 2 Stk Möhre | 1 Stk Zwiebel | 300 g Kartoffeln festkochend | 100 ml Weißwein | 1 EL Senf mittelscharf | 1 EL Crème fraîche | 1 EL Butter | 0.5 Bund Dill | 1 Stk Zitrone | Salz | Pfeffer',
    [
      'Kartoffeln schälen, halbieren, salzen und garen. Lauch in Ringe, Möhren in dünne Scheiben, Zwiebel in feine Würfel schneiden.',
      'Butter in einer weiten Pfanne erhitzen, Zwiebel, Lauch und Möhren 5 Minuten dünsten. Mit Weißwein ablöschen, Senf einrühren und salzen.',
      'Seelachs mit Zitronensaft, Salz und Pfeffer würzen, auf das Gemüse legen und zugedeckt 10 Minuten sanft garen.',
      'Crème fraîche unter das Gemüse rühren. Kartoffeln mit Dill mischen und zum Fisch servieren.',
    ], 'steamed fish leek carrots potatoes dill'),

  r('zander-gurkengemuese', 'Zanderfilet mit Gurkengemüse und Dillkartoffeln', 'de', 'haupt', 35,
    '320 g Zanderfilet | 1 Stk Salatgurke | 1 Stk Zwiebel | 300 g Kartoffeln festkochend | 100 ml Gemüsebrühe | 50 g Crème fraîche | 1 EL Weizenmehl | 1 EL Butter | 0.5 Bund Dill | 1 Stk Zitrone | Salz | Pfeffer',
    [
      'Kartoffeln schälen, halbieren und in Salzwasser garen. Gurke schälen, entkernen und in Stücke schneiden, Zwiebel fein würfeln.',
      'Die Hälfte der Butter erhitzen, Zwiebel und Gurke 3 Minuten dünsten, mit Mehl bestäuben, mit Brühe aufgießen und 5 Minuten köcheln. Crème fraîche und die Hälfte des Dills einrühren, salzen und pfeffern.',
      'Den Zander salzen, pfeffern, mit Zitronensaft beträufeln und in der restlichen Butter 3 bis 4 Minuten je Seite braten.',
      'Kartoffeln mit dem restlichen Dill mischen und alles zusammen anrichten.',
    ], 'pikeperch cucumber vegetables dill potatoes'),

  r('schweinefilet-bohnen', 'Schweinefilet-Medaillons mit grünen Bohnen und Kartoffeln', 'de', 'haupt', 35,
    '350 g Schweinefilet | 2 Scheibe Bacon | 300 g Grüne Bohnen | 300 g Kartoffeln festkochend | 1 Stk Zwiebel | 100 ml Rinderbrühe | 1 TL Senf mittelscharf | 0.5 Bund Bohnenkraut | 1 EL Sonnenblumenöl | 1 EL Butter | Salz | Pfeffer',
    [
      'Kartoffeln schälen, halbieren, salzen und garen. Bohnen putzen und die letzten 10 Minuten mitgaren.',
      'Schweinefilet in 2 cm dicke Medaillons schneiden, leicht flach drücken, salzen und pfeffern.',
      'Bacon in Streifen im heißen Öl auslassen, herausnehmen. Medaillons im Speckfett 3 Minuten je Seite braten und herausnehmen.',
      'Zwiebel im Bratfett anschwitzen, mit Brühe ablöschen, Senf einrühren und kurz einköcheln lassen.',
      'Bohnen mit Butter, Bohnenkraut und Bacon schwenken und mit den Medaillons, Sauce und Kartoffeln servieren.',
    ], 'pork tenderloin medallions green beans'),

  // ───────────── Brotzeit / Abendbrot (kalte, leichte Abendessen) ─────────────
  r('brotzeitbrett', 'Brotzeitbrett mit Aufschnitt, Obazda und Radieschen', 'de', 'brotzeit', 15,
    '5 Scheibe Vollkornbrot | 80 g Katenschinken | 100 g Kochschinken | 100 g Camembert | 40 g Frischkäse | 1 Stk Zwiebel | 1 TL Paprikapulver edelsüß | 2 EL Bier hell | 1 Bund Radieschen | 0.5 Stk Salatgurke | 1 Stk Tomate | 0.5 Bund Schnittlauch | Salz | Pfeffer',
    [
      'Camembert mit einer Gabel zerdrücken, mit Frischkäse, Paprikapulver, Bier, fein gewürfelter Zwiebel, Salz und Pfeffer zu Obazda verkneten und mit Schnittlauch bestreuen.',
      'Radieschen putzen, Gurke in Scheiben, Tomate in Spalten schneiden.',
      'Brot, Schinken, Obazda und das Gemüse auf einem Brett anrichten.',
    ], 'Brotzeit Obazda Radieschen board'),

  r('strammer-max', 'Strammer Max mit Salat', 'de', 'brotzeit', 15,
    '4 Scheibe Vollkornbrot | 120 g Katenschinken | 4 Stk Ei | 1 EL Butter | 2 Stk Gewürzgurke | 0.5 Stk Kopfsalat | 1 Stk Tomate | 0.5 Stk Salatgurke | 1 EL Weißweinessig | 1 EL Sonnenblumenöl | 1 TL Senf mittelscharf | 0.5 Bund Schnittlauch | Salz | Pfeffer',
    [
      'Senf mit Essig, Öl, Salz und Pfeffer verrühren. Salat, Tomate und Gurke klein schneiden und mit der Vinaigrette mischen.',
      'Brot mit Schinken belegen.',
      'Butter in einer Pfanne erhitzen und die Eier als Spiegeleier braten, salzen und pfeffern.',
      'Je zwei Spiegeleier auf das Brot legen, mit Schnittlauch bestreuen und mit Gewürzgurken und Salat servieren.',
    ], 'Strammer Max ham fried egg bread'),

  r('bauernsalat-speck', 'Deftiger Bauernsalat mit Speck, Ei und Vollkornbrot', 'de', 'brotzeit', 20,
    '60 g Speckwürfel | 3 Stk Tomate | 1 Stk Salatgurke | 1 Stk Paprika rot | 1 Stk Zwiebel rot | 2 Stk Ei | 4 Scheibe Vollkornbrot | 2 EL Rotweinessig | 2 EL Sonnenblumenöl | 1 TL Senf mittelscharf | 0.5 Bund Schnittlauch | Salz | Pfeffer',
    [
      'Eier hart kochen, abschrecken und pellen.',
      'Speckwürfel ohne Fett knusprig auslassen und auf Küchenpapier abtropfen lassen.',
      'Tomaten, Gurke, Paprika in Stücke, Zwiebel in feine Ringe schneiden. Essig, Öl, Senf, Salz und Pfeffer verrühren und mit dem Gemüse mischen.',
      'Eier vierteln, mit Speck und Schnittlauch auf den Salat geben und mit dem Vollkornbrot servieren.',
    ], 'farmer salad bacon egg bread'),

  r('wurstsalat-schweizer-art', 'Schweizer Wurstsalat mit Emmentaler und Brötchen', 'de', 'brotzeit', 20,
    '200 g Fleischwurst | 3 Scheibe Emmentaler | 2 Stk Gewürzgurke | 1 Stk Zwiebel | 0.5 Bund Radieschen | 2 EL Weißweinessig | 2 EL Sonnenblumenöl | 1 TL Senf mittelscharf | 0.5 Bund Schnittlauch | 2 Stk Brötchen vom Vortag | Salz | Pfeffer',
    [
      'Fleischwurst pellen und in dünne Streifen schneiden, Emmentaler in Streifen, Gewürzgurken und Radieschen in Scheiben, Zwiebel in feine Ringe schneiden.',
      'Essig, Öl, Senf, 3 EL Wasser, Salz und Pfeffer verrühren, mit allem mischen und 15 Minuten durchziehen lassen.',
      'Mit Schnittlauch bestreuen und mit den Brötchen servieren.',
    ], 'Swiss sausage salad Wurstsalat'),

  // ───────────── Rosenkohl (Saison Oktober bis Februar) ─────────────
  r('rosenkohl-speck-bratwurst', 'Gerösteter Rosenkohl mit Speck und Zwiebeln, Bratwurst und Kartoffelpüree', 'de', 'haupt', 50,
    '400 g Rosenkohl | 80 g Speckwürfel | 1 Stk Zwiebel | 1 EL Olivenöl | 4 Stk Bratwurst | 1 EL Butterschmalz | 700 g Kartoffeln mehligkochend | 150 ml Milch | 40 g Butter | Muskatnuss | Salz | Pfeffer',
    [
      'Rosenkohl putzen, den Strunk kürzen und die Röschen halbieren. Die Zwiebel in Spalten schneiden. Beides mit Speckwürfeln, Olivenöl, Salz und Pfeffer mischen und auf einem mit Backpapier belegten Blech verteilen.',
      'Im Ofen bei 200 °C ca. 25 Minuten rösten, nach der Hälfte einmal wenden, bis die Ränder dunkel und der Speck knusprig ist.',
      'Kartoffeln schälen, vierteln und in Salzwasser ca. 20 Minuten weich kochen. Abgießen, mit heißer Milch und Butter stampfen und mit Muskat und Salz abschmecken.',
      'Die Bratwürste im Butterschmalz bei mittlerer Hitze 10 bis 12 Minuten rundum braun braten. Mit Rosenkohl und Püree anrichten.',
    ], 'Rosenkohl Speck Bratwurst Kartoffelpüree'),

  r('rahm-rosenkohl-frikadellen', 'Rahm-Rosenkohl mit Muskat, Frikadellen und Salzkartoffeln', 'de', 'haupt', 45,
    '500 g Rosenkohl | 1 EL Butter | 120 ml Sahne | 100 ml Gemüsebrühe | Muskatnuss | 300 g Hackfleisch gemischt | 1 Stk Brötchen vom Vortag | 1 Stk Ei | 1 Stk Zwiebel | 1 TL Senf mittelscharf | 0.5 TL Majoran | 1 EL Butterschmalz | 700 g Kartoffeln festkochend | 0.5 Bund Petersilie | Salz | Pfeffer | Paprikapulver edelsüß',
    [
      'Brötchen einweichen und ausdrücken. Zwiebel fein würfeln und mit Hack, Ei, Senf, Majoran, Salz, Pfeffer und Paprika verkneten. Daraus 4 flache Frikadellen formen.',
      'Kartoffeln schälen, halbieren und in Salzwasser 20 bis 25 Minuten weich kochen. Abgießen und mit gehackter Petersilie bestreuen.',
      'Rosenkohl putzen und halbieren. In der Butter 3 Minuten andünsten, Brühe und Sahne zugießen und zugedeckt 12 Minuten köcheln lassen. Mit Muskat, Salz und Pfeffer abschmecken.',
      'Frikadellen im Butterschmalz bei mittlerer Hitze 5 bis 6 Minuten je Seite braten. Mit Rahm-Rosenkohl und Salzkartoffeln servieren.',
    ], 'Rosenkohl Sahne Frikadellen'),

  r('rosenkohl-speck-kasseler', 'Rosenkohl mit Speck, Kasseler-Kotelett und Kartoffeln', 'de', 'haupt', 40,
    '400 g Rosenkohl | 80 g Speckwürfel | 1 Stk Zwiebel | 1 EL Butter | Muskatnuss | 360 g Kasseler Kotelett | 1 EL Butterschmalz | 700 g Kartoffeln festkochend | 0.5 Bund Petersilie | Salz | Pfeffer',
    [
      'Kartoffeln schälen, halbieren und in Salzwasser 20 bis 25 Minuten weich kochen. Rosenkohl putzen, halbieren und in den letzten 12 Minuten im selben Topf oder daneben bissfest garen.',
      'Speckwürfel in einer Pfanne knusprig auslassen. Die fein gewürfelte Zwiebel mit der Butter zugeben und glasig dünsten.',
      'Den abgetropften Rosenkohl in die Speckpfanne geben, 3 Minuten schwenken und mit Muskat, Salz und Pfeffer abschmecken.',
      'Die Kasseler-Koteletts im Butterschmalz bei mittlerer Hitze 3 bis 4 Minuten je Seite braten. Mit Rosenkohl und den Kartoffeln in Petersilie anrichten.',
    ], 'Kasseler Kotelett Rosenkohl Kartoffeln'),

  // ───────────── Burger (Brötchen aus dem Haus oder gekauft) ─────────────
  r('cheeseburger-classic', 'Classic Cheeseburger mit Pommes aus dem Airfryer', 'de', 'haupt', 55,
    '360 g Rinderhackfleisch | 2 Stk Burger-Brötchen | 2 Scheibe Cheddar | 60 g Kopfsalat | 1 Stk Tomate | 0.5 Stk Zwiebel rot | 3 Stk Gewürzgurke | 2 EL Mayonnaise | 1 EL Tomatenketchup | 1 TL Senf mittelscharf | 1 EL Butter | 2 EL Sonnenblumenöl | 450 g Kartoffeln festkochend | Salz | Pfeffer',
    [
      'Kartoffeln schälen, in 1 cm dicke Stifte schneiden, 30 Minuten in kaltem Wasser wässern, gründlich abtrocknen und mit 1 EL Öl und Salz mischen.',
      'Für die Burgersauce Mayonnaise, Ketchup, Senf und eine fein gehackte Gewürzgurke verrühren. Die übrigen Gurken in Scheiben, Tomate und rote Zwiebel in Ringe schneiden, den Salat zupfen.',
      'Das Hack leicht kneten, in 2 Patties à 180 g formen und in der Mitte eine kleine Mulde eindrücken. Kalt stellen.',
      'Die Pommes bei 180 °C ca. 22 Minuten backen, nach 10 und 16 Minuten schütteln.',
      'Die Patties salzen und pfeffern und im restlichen Öl bei starker Hitze 4 Minuten je Seite braten. In der letzten Minute je eine Scheibe Cheddar auflegen und mit Deckel schmelzen lassen.',
      'Die Brötchen aufschneiden und in der Butter anrösten. Unterseite mit Sauce, Salat, Tomate, Zwiebel, Gurke und Patty belegen, Deckel darauf. Mit den Pommes servieren.',
    ], 'Cheeseburger'),

  r('smashed-burger', 'Smashed Burger mit doppelt Cheddar, Zwiebeln und Pommes', 'de', 'haupt', 35,
    '360 g Rinderhackfleisch | 2 Stk Burger-Brötchen | 4 Scheibe Cheddar | 1 Stk Zwiebel | 3 Stk Gewürzgurke | 2 EL Mayonnaise | 1 EL Tomatenketchup | 1 TL Senf mittelscharf | 1 EL Butter | 1 EL Sonnenblumenöl | 400 g Pommes frites TK | Salz | Pfeffer',
    [
      'Das Hack in 4 lockere Kugeln à 90 g formen und kalt stellen (nicht kneten). Die Zwiebel in hauchdünne Scheiben hobeln, die Gurken in Scheiben schneiden.',
      'Mayonnaise, Ketchup und Senf zur Sauce verrühren. Die Pommes bei 190 °C 16 bis 18 Minuten knusprig backen, einmal schütteln.',
      'Eine Gusseisenpfanne sehr heiß werden lassen, dünn ölen und 2 Kugeln hineinlegen. Einige Zwiebelscheiben darauflegen und jede Kugel sofort mit einem stabilen Wender fest flach drücken. Salzen, pfeffern und 2 Minuten braten, bis der Rand dunkel und knusprig ist.',
      'Die Patties abkratzen, wenden, je eine Scheibe Cheddar auflegen und 1 Minute braten. Die zweite Runde genauso braten.',
      'Die Brötchenhälften in der Butter anrösten, mit Sauce bestreichen und je 2 Patties mit Käse und restlichen Zwiebeln und Gurken belegen. Mit den Pommes servieren.',
    ], 'Smash burger'),

  r('bacon-bbq-burger', 'Bacon-BBQ-Burger mit Röstzwiebeln und Coleslaw', 'de', 'haupt', 45,
    '360 g Rinderhackfleisch | 2 Stk Burger-Brötchen | 6 Scheibe Bacon | 2 Scheibe Cheddar | 3 EL BBQ-Sauce | 2 EL Röstzwiebeln | 40 g Kopfsalat | 1 EL Butter | 1 EL Sonnenblumenöl | 250 g Weißkohl | 1 Stk Möhre | 2 EL Mayonnaise | 50 g Joghurt natur | 1 EL Apfelessig | 1 TL Zucker | Salz | Pfeffer',
    [
      'Für den Coleslaw den Weißkohl fein hobeln, die Möhre raspeln. Mit Salz und Zucker kräftig durchkneten. Mayonnaise, Joghurt und Essig verrühren, untermischen und 20 Minuten durchziehen lassen.',
      'Das Hack in 2 Patties à 180 g formen, salzen und pfeffern. Den Bacon in einer Pfanne knusprig braten und auf Küchenpapier legen.',
      'Die Patties im restlichen Öl bei starker Hitze 4 Minuten braten, wenden, mit je 1 EL BBQ-Sauce bestreichen, Cheddar auflegen und 3 Minuten fertig braten.',
      'Die Brötchen aufschneiden, in der Butter anrösten und mit Salat belegen. Patty, Bacon, Röstzwiebeln und die restliche BBQ-Sauce daraufgeben, Deckel auflegen. Mit dem Coleslaw servieren.',
    ], 'Bacon BBQ burger coleslaw'),

  r('chicken-burger-leicht', 'Leichter Chicken-Burger mit Coleslaw', 'de', 'haupt', 40,
    '300 g Hähnchenbrustfilet | 2 Stk Burger-Brötchen | 1 EL Weizenmehl | 1 Stk Ei | 40 g Panko | 1 TL Paprikapulver edelsüß | 1 TL Sonnenblumenöl | 40 g Kopfsalat | 1 Stk Tomate | 200 g Weißkohl | 1 Stk Möhre | 80 g Joghurt natur | 1 EL Apfelessig | 1 TL Senf mittelscharf | 1 TL Honig | Salz | Pfeffer',
    [
      'Für den Coleslaw den Weißkohl fein hobeln, die Möhre raspeln. Joghurt, Essig, Senf, Honig, Salz und Pfeffer verrühren, untermischen und durchziehen lassen.',
      'Das Hähnchenbrustfilet waagerecht halbieren, zwischen Folie dünn klopfen, salzen und pfeffern. Mehl, das verquirlte Ei und Panko mit Paprikapulver in drei Teller geben und die Schnitzel nacheinander darin wenden. Das Panko gut andrücken.',
      'Die Schnitzel mit Öl einsprühen oder einpinseln und im Airfryer bei 180 °C 12 bis 14 Minuten goldbraun backen, nach der Hälfte wenden. Innen darf nichts mehr rosa sein.',
      'Die Brötchen kurz aufbacken. Unterseite mit Salat, Tomatenscheiben, Hähnchenschnitzel und etwas Coleslaw belegen, Deckel darauf. Den übrigen Coleslaw dazu servieren.',
    ], 'Chicken burger'),
]
