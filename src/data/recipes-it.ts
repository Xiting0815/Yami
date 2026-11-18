import { r } from './define'

// Italienische Küche – alle Mengen für 2 Portionen
export const recipesIt = [
  // ───────────── Pasta ─────────────
  r('ragu-bolognese', 'Tagliatelle al Ragù alla Bolognese', 'it', 'pasta', 180,
    '250 g Tagliatelle | 150 g Rinderhackfleisch | 100 g Schweinehackfleisch | 50 g Pancetta | 1 Stk Möhre | 1 Stk Staudensellerie | 1 Stk Zwiebel | 2 EL Tomatenmark | 200 g Passierte Tomaten | 100 ml Rotwein | 100 ml Milch | 2 EL Olivenöl | 40 g Parmigiano Reggiano | Salz | Pfeffer',
    [
      'Pancetta fein würfeln und im Olivenöl auslassen. Möhre, Sellerie und Zwiebel sehr fein würfeln (Soffritto) und 10 Minuten sanft andünsten.',
      'Hackfleisch zugeben und braten, bis es krümelig ist und Röstaromen hat. Tomatenmark mitrösten und mit Rotwein ablöschen.',
      'Passierte Tomaten und 200 ml Wasser zugeben und zugedeckt bei kleinster Hitze 2,5 Stunden schmoren. Bei Bedarf Wasser nachgießen. Zum Schluss die Milch einrühren und abschmecken.',
      'Tagliatelle in Salzwasser bissfest kochen, mit dem Ragù und etwas Nudelwasser vermengen und mit Parmesan servieren.',
    ], 'Tagliatelle al ragù'),

  r('carbonara', 'Spaghetti alla Carbonara', 'it', 'pasta', 25,
    '250 g Spaghetti | 120 g Guanciale | 3 Stk Eigelb | 1 Stk Ei | 60 g Pecorino Romano | Pfeffer schwarz grob | Salz',
    [
      'Guanciale in Streifen schneiden und in einer Pfanne ohne Fett langsam knusprig auslassen. Pfanne vom Herd nehmen.',
      'Eigelbe, Ei, fein geriebenen Pecorino und reichlich frisch gemahlenen Pfeffer zu einer dicken Creme verrühren.',
      'Spaghetti in nur leicht gesalzenem Wasser bissfest kochen. Abgießen und eine Tasse Nudelwasser auffangen.',
      'Spaghetti in die Pfanne zum Guanciale geben. Abseits der Hitze die Eiercreme und einen Schuss Nudelwasser unterrühren, bis eine cremige Sauce entsteht. Die Eier dürfen nicht stocken. Sofort mit Pecorino und Pfeffer servieren.',
    ], 'Spaghetti carbonara'),

  r('aglio-olio', 'Spaghetti Aglio, Olio e Peperoncino', 'it', 'pasta', 20,
    '250 g Spaghetti | 4 Zehe Knoblauch | 1 Stk Chili rot | 6 EL Olivenöl | 0.5 Bund Petersilie | Salz',
    [
      'Spaghetti in Salzwasser bissfest kochen.',
      'Knoblauch in feine Scheiben, Chili in Ringe schneiden. Im Olivenöl bei niedriger Hitze goldgelb werden lassen, nicht braun.',
      'Spaghetti mit etwas Nudelwasser in die Pfanne geben und kräftig schwenken, bis eine leichte Emulsion entsteht.',
      'Gehackte Petersilie unterheben und sofort servieren.',
    ], 'Spaghetti aglio e olio'),

  r('cacio-e-pepe', 'Tonnarelli Cacio e Pepe', 'it', 'pasta', 20,
    '250 g Spaghetti | 100 g Pecorino Romano | 2 TL Pfeffer schwarz grob | Salz',
    [
      'Pecorino sehr fein reiben. Pfefferkörner grob mörsern und in einer Pfanne ohne Fett kurz rösten.',
      'Pasta in wenig, nur leicht gesalzenem Wasser kochen, damit das Nudelwasser stärkehaltig wird.',
      'Pecorino mit ein paar Löffeln lauwarmem Nudelwasser zu einer glatten Creme verrühren.',
      'Pasta mit etwas Nudelwasser in die Pfefferpfanne geben, vom Herd nehmen, die Käsecreme unterrühren und cremig schwenken.',
    ], 'Cacio e pepe'),

  r('amatriciana', 'Bucatini all\'Amatriciana', 'it', 'pasta', 30,
    '250 g Bucatini | 120 g Guanciale | 1 Dose Geschälte Tomaten | 50 ml Weißwein | 1 Stk Chili rot | 50 g Pecorino Romano | Salz',
    [
      'Guanciale in Streifen schneiden und ohne Fett knusprig auslassen. Chili kurz mitbraten und mit Weißwein ablöschen.',
      'Guanciale herausnehmen. Tomaten zerdrücken, ins Fett geben und 15 Minuten einkochen.',
      'Bucatini bissfest kochen.',
      'Guanciale zurück in die Sauce geben, Pasta untermischen und mit Pecorino servieren.',
    ], 'Bucatini amatriciana'),

  r('arrabbiata', 'Penne all\'Arrabbiata', 'it', 'pasta', 25,
    '250 g Penne | 1 Dose Geschälte Tomaten | 3 Zehe Knoblauch | 2 Stk Chili rot | 3 EL Olivenöl | 0.5 Bund Petersilie | Salz',
    [
      'Knoblauch und Chili fein hacken und im Olivenöl anschwitzen.',
      'Tomaten zerdrücken, zugeben, salzen und 15 Minuten scharf einkochen.',
      'Penne bissfest kochen und mit der Sauce vermengen.',
      'Mit Petersilie bestreuen.',
    ], 'Penne arrabbiata'),

  r('vongole', 'Spaghetti alle Vongole', 'it', 'pasta', 35,
    '250 g Spaghetti | 800 g Venusmuscheln | 3 Zehe Knoblauch | 1 Stk Chili rot | 100 ml Weißwein | 4 EL Olivenöl | 1 Bund Petersilie | Salz',
    [
      'Muscheln eine Stunde in Salzwasser legen, damit sie Sand verlieren. Geöffnete Muscheln aussortieren.',
      'Knoblauch und Chili im Olivenöl anschwitzen. Muscheln und Wein zugeben, Deckel auflegen und 3 bis 4 Minuten garen, bis sie sich öffnen. Geschlossene Muscheln wegwerfen.',
      'Spaghetti 2 Minuten vor Ende der Garzeit abgießen und im Muschelsud fertig garen.',
      'Mit reichlich Petersilie und einem Schuss Olivenöl servieren.',
    ], 'Spaghetti alle vongole'),

  r('al-pomodoro', 'Spaghetti al Pomodoro e Basilico', 'it', 'pasta', 30,
    '250 g Spaghetti | 400 g Datteltomaten | 2 Zehe Knoblauch | 4 EL Olivenöl | 1 Bund Basilikum | 30 g Parmigiano Reggiano | Salz',
    [
      'Knoblauch angedrückt im Olivenöl langsam anbraten und wieder herausnehmen.',
      'Tomaten halbieren, ins Öl geben, salzen und 15 Minuten zu einer Sauce zerfallen lassen.',
      'Spaghetti bissfest kochen und in der Sauce schwenken.',
      'Basilikum zupfen, unterheben und mit Parmesan servieren.',
    ], 'Spaghetti pomodoro'),

  r('puttanesca', 'Spaghetti alla Puttanesca', 'it', 'pasta', 25,
    '250 g Spaghetti | 1 Dose Geschälte Tomaten | 4 Stk Sardellenfilet | 60 g Oliven schwarz | 1 EL Kapern | 2 Zehe Knoblauch | 1 Stk Chili rot | 3 EL Olivenöl | 0.5 Bund Petersilie | Salz',
    [
      'Knoblauch, Chili und Sardellen im Olivenöl anschwitzen, bis die Sardellen zerfallen.',
      'Tomaten, entkernte Oliven und Kapern zugeben und 10 Minuten köcheln lassen.',
      'Spaghetti bissfest kochen und in der Sauce schwenken.',
      'Mit Petersilie servieren.',
    ], 'Spaghetti puttanesca'),

  r('alla-norma', 'Pasta alla Norma', 'it', 'pasta', 40,
    '250 g Rigatoni | 1 Stk Aubergine | 1 Dose Geschälte Tomaten | 2 Zehe Knoblauch | 6 EL Olivenöl | 0.5 Bund Basilikum | 60 g Ricotta salata | Salz',
    [
      'Aubergine würfeln, salzen und 20 Minuten ziehen lassen. Trocken tupfen und im Olivenöl goldbraun braten.',
      'Knoblauch anschwitzen, Tomaten zugeben und 15 Minuten einkochen.',
      'Pasta kochen, mit Sauce und Auberginen vermengen und Basilikum unterheben.',
      'Großzügig mit geriebener Ricotta salata bestreuen.',
    ], 'Pasta alla Norma'),

  r('pesto-genovese', 'Trofie al Pesto Genovese mit Kartoffeln und Bohnen', 'it', 'pasta', 30,
    '250 g Trofie | 2 Bund Basilikum | 30 g Pinienkerne | 1 Zehe Knoblauch | 40 g Parmigiano Reggiano | 20 g Pecorino Romano | 80 ml Olivenöl | 150 g Kartoffeln festkochend | 100 g Grüne Bohnen | Salz',
    [
      'Basilikumblätter, Pinienkerne, Knoblauch und eine Prise grobes Salz im Mörser oder kurz im Mixer zerkleinern. Käse und Olivenöl einarbeiten, nicht zu warm werden lassen.',
      'Kartoffel klein würfeln und Bohnen in Stücke schneiden. Im Nudelwasser mitkochen.',
      'Trofie zugeben und bissfest garen.',
      'Abgießen und mit Pesto und etwas Nudelwasser vermengen.',
    ], 'Trofie al pesto'),

  r('orecchiette-salsiccia', 'Orecchiette mit Salsiccia und Brokkoli', 'it', 'pasta', 30,
    '250 g Orecchiette | 250 g Salsiccia | 400 g Brokkoli | 2 Zehe Knoblauch | 1 Stk Chili rot | 3 EL Olivenöl | 40 g Pecorino Romano | Salz',
    [
      'Brokkoli in kleine Röschen teilen und mit den Orecchiette zusammen in Salzwasser kochen.',
      'Salsiccia aus der Haut drücken und zerbröselt im Olivenöl anbraten. Knoblauch und Chili zugeben.',
      'Pasta und Brokkoli abgießen, in die Pfanne geben und mit etwas Nudelwasser schwenken, bis der Brokkoli leicht zerfällt.',
      'Mit Pecorino servieren.',
    ], 'Orecchiette broccoli salsiccia'),

  r('gricia', 'Rigatoni alla Gricia', 'it', 'pasta', 20,
    '250 g Rigatoni | 150 g Guanciale | 70 g Pecorino Romano | Pfeffer schwarz grob | Salz',
    [
      'Guanciale in Streifen schneiden und langsam knusprig auslassen.',
      'Rigatoni in leicht gesalzenem Wasser bissfest kochen.',
      'Pasta mit einer Kelle Nudelwasser zum Guanciale geben.',
      'Vom Herd nehmen und Pecorino und Pfeffer unterrühren, bis die Sauce cremig ist.',
    ], 'Pasta alla gricia'),

  r('penne-vodka', 'Penne alla Vodka', 'it', 'pasta', 25,
    '250 g Penne | 1 Stk Schalotte | 2 EL Tomatenmark | 200 g Passierte Tomaten | 50 ml Wodka | 150 ml Sahne | 1 EL Butter | 30 g Parmigiano Reggiano | 1 Stk Chili rot | Salz',
    [
      'Schalotte in Butter glasig dünsten, Tomatenmark und Chili zugeben und anrösten.',
      'Mit Wodka ablöschen und einkochen. Passierte Tomaten und Sahne zugeben und 10 Minuten köcheln lassen.',
      'Penne bissfest kochen und mit der Sauce vermengen.',
      'Mit Parmesan servieren.',
    ], 'Penne alla vodka'),

  r('tagliatelle-funghi', 'Tagliatelle ai Funghi Porcini', 'it', 'pasta', 30,
    '250 g Tagliatelle | 20 g Steinpilze getrocknet | 250 g Champignons braun | 2 Zehe Knoblauch | 50 ml Weißwein | 100 ml Sahne | 2 EL Olivenöl | 0.5 Bund Petersilie | 30 g Parmigiano Reggiano | Salz | Pfeffer',
    [
      'Steinpilze in 150 ml warmem Wasser 20 Minuten einweichen, ausdrücken und hacken. Das Einweichwasser durch ein Sieb gießen.',
      'Champignons in Scheiben im Olivenöl scharf anbraten. Knoblauch und Steinpilze zugeben.',
      'Mit Wein und Einweichwasser ablöschen, Sahne zugeben und einkochen.',
      'Tagliatelle untermischen und mit Petersilie und Parmesan servieren.',
    ], 'Tagliatelle funghi porcini'),

  r('spaghetti-limone', 'Spaghetti al Limone', 'it', 'pasta', 20,
    '250 g Spaghetti | 2 Stk Zitrone unbehandelt | 40 g Butter | 60 g Parmigiano Reggiano | 0.5 Bund Basilikum | Pfeffer | Salz',
    [
      'Spaghetti bissfest kochen.',
      'Butter mit fein abgeriebener Zitronenschale und dem Saft einer Zitrone schmelzen.',
      'Spaghetti mit etwas Nudelwasser in die Pfanne geben, Parmesan unterrühren und cremig schwenken.',
      'Mit Pfeffer und Basilikum servieren.',
    ], 'Spaghetti al limone'),

  r('nerano', 'Spaghetti alla Nerano mit Zucchini', 'it', 'pasta', 35,
    '250 g Spaghetti | 3 Stk Zucchini | 100 ml Sonnenblumenöl | 60 g Provolone | 30 g Parmigiano Reggiano | 1 Bund Basilikum | 1 EL Butter | Salz | Pfeffer',
    [
      'Zucchini in dünne Scheiben schneiden und im heißen Öl goldbraun frittieren. Abtropfen lassen und salzen.',
      'Zwei Drittel der Zucchini mit etwas Nudelwasser zu einer Creme pürieren.',
      'Spaghetti bissfest kochen und mit Zucchinicreme, Butter, Zucchinischeiben und beiden Käsesorten vermengen.',
      'Mit Basilikum und Pfeffer servieren.',
    ], 'Spaghetti alla Nerano'),

  r('linguine-gamberi', 'Linguine mit Garnelen, Kirschtomaten und Knoblauch', 'it', 'pasta', 25,
    '250 g Linguine | 250 g Garnelen roh TK | 250 g Kirschtomaten | 3 Zehe Knoblauch | 1 Stk Chili rot | 50 ml Weißwein | 4 EL Olivenöl | 0.5 Bund Petersilie | 1 Stk Zitrone | Salz',
    [
      'Garnelen auftauen und trocken tupfen.',
      'Knoblauch und Chili im Olivenöl anschwitzen, Garnelen 2 Minuten scharf anbraten und herausnehmen.',
      'Halbierte Tomaten in die Pfanne geben, mit Wein ablöschen und 5 Minuten schmoren.',
      'Linguine bissfest kochen und mit Garnelen und Petersilie in der Pfanne schwenken. Mit Zitronenschale servieren.',
    ], 'Linguine gamberi'),

  r('tortellini-panna', 'Tortellini Panna e Prosciutto', 'it', 'pasta', 20,
    '500 g Tortellini frisch | 150 g Kochschinken | 200 ml Sahne | 20 g Butter | 100 g Erbsen TK | 40 g Parmigiano Reggiano | Muskatnuss | Salz | Pfeffer',
    [
      'Schinken würfeln und in Butter kurz anbraten.',
      'Sahne und Erbsen zugeben und 5 Minuten einkochen. Mit Muskat und Pfeffer würzen.',
      'Tortellini nach Packungsanweisung kochen.',
      'In der Sauce schwenken und mit Parmesan servieren.',
    ], 'Tortellini panna prosciutto'),

  r('gnocchi-gorgonzola', 'Gnocchi al Gorgonzola mit Walnüssen', 'it', 'pasta', 20,
    '500 g Gnocchi | 150 g Gorgonzola dolce | 150 ml Sahne | 30 g Walnusskerne | 20 g Parmigiano Reggiano | Pfeffer | Salz',
    [
      'Gorgonzola mit der Sahne bei kleiner Hitze schmelzen.',
      'Walnüsse grob hacken und ohne Fett rösten.',
      'Gnocchi in Salzwasser garen, bis sie oben schwimmen.',
      'In der Sauce schwenken und mit Walnüssen, Parmesan und Pfeffer servieren.',
    ], 'Gnocchi gorgonzola'),

  r('gnocchi-salbei', 'Selbstgemachte Gnocchi in Salbeibutter', 'it', 'pasta', 60,
    '700 g Kartoffeln mehligkochend | 180 g Weizenmehl | 1 Stk Eigelb | 60 g Butter | 1 Bund Salbei | 40 g Parmigiano Reggiano | Muskatnuss | Salz',
    [
      'Kartoffeln mit Schale kochen, pellen und noch heiß durch die Presse drücken. Ausdampfen lassen.',
      'Mit Mehl, Eigelb, Salz und Muskat rasch zu einem Teig verkneten. Rollen formen, in Stücke schneiden und über eine Gabel abrollen.',
      'In siedendem Salzwasser garen, bis sie aufsteigen, und abschöpfen.',
      'Butter mit Salbeiblättern aufschäumen, bis sie nussig duftet. Gnocchi darin schwenken und mit Parmesan servieren.',
    ], 'Gnocchi burro e salvia'),

  r('ravioli-salbei', 'Ricotta-Spinat-Ravioli mit Salbeibutter', 'it', 'pasta', 20,
    '500 g Ravioli Ricotta-Spinat frisch | 60 g Butter | 0.5 Bund Salbei | 40 g Parmigiano Reggiano | 1 Stk Zitrone | Pfeffer | Salz',
    [
      'Ravioli in Salzwasser nach Packungsanweisung garen.',
      'Butter mit Salbeiblättern bei mittlerer Hitze aufschäumen und leicht bräunen lassen.',
      'Ravioli mit einem Schuss Nudelwasser in der Butter schwenken.',
      'Mit Parmesan, Zitronenschale und Pfeffer servieren.',
    ], 'Ravioli salvia'),

  r('pasta-tonno', 'Spaghetti al Tonno', 'it', 'pasta', 25,
    '250 g Spaghetti | 1 Dose Thunfisch in Olivenöl | 1 Dose Geschälte Tomaten | 2 Zehe Knoblauch | 1 EL Kapern | 1 Stk Chili rot | 2 EL Olivenöl | 0.5 Bund Petersilie | Salz',
    [
      'Knoblauch und Chili im Olivenöl anschwitzen.',
      'Tomaten und Kapern zugeben und 10 Minuten einkochen.',
      'Thunfisch zerpflücken und kurz in der Sauce erwärmen.',
      'Mit den gekochten Spaghetti vermengen und Petersilie unterheben.',
    ], 'Pasta al tonno'),

  r('pasta-genovese', 'Ziti alla Genovese (Neapolitanisches Zwiebelragù)', 'it', 'pasta', 200,
    '250 g Ziti | 300 g Rindergulasch | 1 kg Zwiebel | 1 Stk Möhre | 1 Stk Staudensellerie | 100 ml Weißwein | 4 EL Olivenöl | 40 g Parmigiano Reggiano | Salz | Pfeffer',
    [
      'Fleisch in großen Stücken im Olivenöl anbraten. Fein gewürfelte Möhre und Sellerie zugeben.',
      'Zwiebeln in feine Streifen schneiden und zugeben. Salzen und mit Wein ablöschen.',
      'Zugedeckt bei kleinster Hitze 3 Stunden schmoren, bis die Zwiebeln zu einer goldbraunen Creme zerfallen. Das Fleisch dabei zerfasern.',
      'Ziti in Stücke brechen, kochen, mit dem Ragù vermengen und mit Parmesan servieren.',
    ], 'Pasta alla genovese'),

  r('rigatoni-salsiccia', 'Rigatoni mit Salsiccia-Sahnesauce', 'it', 'pasta', 30,
    '250 g Rigatoni | 250 g Salsiccia | 1 Stk Schalotte | 50 ml Weißwein | 150 ml Sahne | 100 g Passierte Tomaten | 1 Zweig Rosmarin | 30 g Parmigiano Reggiano | 1 EL Olivenöl | Salz | Pfeffer',
    [
      'Salsiccia aus der Haut drücken und zerbröselt im Olivenöl mit Schalotte und Rosmarin anbraten.',
      'Mit Wein ablöschen, Tomaten und Sahne zugeben und 10 Minuten köcheln lassen.',
      'Rigatoni bissfest kochen und mit der Sauce vermengen.',
      'Mit Parmesan servieren.',
    ], 'Rigatoni salsiccia'),

  r('spaghetti-polpette', 'Spaghetti con Polpette al Sugo', 'it', 'pasta', 60,
    '250 g Spaghetti | 300 g Hackfleisch gemischt | 1 Scheibe Weißbrot | 1 Stk Ei | 30 g Parmigiano Reggiano | 0.5 Bund Petersilie | 1 Zehe Knoblauch | 1 Stk Zwiebel | 1 Dose Geschälte Tomaten | 200 g Passierte Tomaten | 0.5 Bund Basilikum | 3 EL Olivenöl | Salz | Pfeffer',
    [
      'Weißbrot einweichen und ausdrücken. Mit Hack, Ei, Parmesan, Petersilie, Knoblauch, Salz und Pfeffer verkneten und walnussgroße Bällchen formen.',
      'Bällchen im Olivenöl rundum anbraten.',
      'Zwiebel zugeben, Tomaten und passierte Tomaten zugeben und die Polpette darin 30 Minuten sanft schmoren.',
      'Mit Spaghetti und Basilikum servieren.',
    ], 'Spaghetti polpette'),

  r('penne-salmone', 'Penne al Salmone', 'it', 'pasta', 25,
    '250 g Penne | 200 g Lachsfilet | 1 Stk Schalotte | 50 ml Wodka | 200 ml Sahne | 1 EL Tomatenmark | 1 EL Butter | 0.5 Bund Dill | 1 Stk Zitrone | Salz | Pfeffer',
    [
      'Lachs würfeln. Schalotte in Butter dünsten und Tomatenmark kurz mitrösten.',
      'Mit Wodka ablöschen, Sahne zugeben und 5 Minuten einkochen.',
      'Lachs in der Sauce 3 Minuten gar ziehen lassen und mit Zitrone abschmecken.',
      'Mit den Penne vermengen und mit Dill bestreuen.',
    ], 'Penne salmone'),

  r('pesto-rosso', 'Fusilli mit Pesto alla Siciliana', 'it', 'pasta', 20,
    '250 g Fusilli | 80 g Getrocknete Tomaten in Öl | 30 g Mandeln | 50 g Ricotta | 30 g Parmigiano Reggiano | 1 Zehe Knoblauch | 0.5 Bund Basilikum | 4 EL Olivenöl | 1 Stk Chili rot | Salz',
    [
      'Getrocknete Tomaten, Mandeln, Knoblauch, Basilikum, Chili, Ricotta, Parmesan und Olivenöl zu einem Pesto pürieren.',
      'Fusilli bissfest kochen.',
      'Pasta mit Pesto und etwas Nudelwasser vermengen.',
      'Mit Basilikum garnieren.',
    ], 'Pesto rosso'),

  r('spaghetti-cozze', 'Spaghetti alle Cozze', 'it', 'pasta', 35,
    '250 g Spaghetti | 1 kg Miesmuscheln | 200 g Kirschtomaten | 3 Zehe Knoblauch | 100 ml Weißwein | 4 EL Olivenöl | 1 Bund Petersilie | 1 Stk Chili rot | Salz',
    [
      'Muscheln putzen und entbarten. Geöffnete Muscheln aussortieren.',
      'Knoblauch und Chili im Olivenöl anschwitzen. Muscheln und Wein zugeben und zugedeckt garen, bis sie sich öffnen.',
      'Halbe Muscheln auslösen. Kirschtomaten in den Sud geben und 5 Minuten köcheln lassen.',
      'Spaghetti al dente im Sud fertig garen und mit Muscheln und Petersilie servieren.',
    ], 'Spaghetti cozze'),

  r('boscaiola', 'Penne alla Boscaiola', 'it', 'pasta', 30,
    '250 g Penne | 250 g Champignons | 120 g Kochschinken | 1 Stk Schalotte | 150 ml Sahne | 100 g Passierte Tomaten | 1 EL Butter | 0.5 Bund Petersilie | 30 g Parmigiano Reggiano | Salz | Pfeffer',
    [
      'Schalotte und Schinkenwürfel in Butter anbraten. Champignons in Scheiben zugeben und kräftig braten.',
      'Sahne und Tomaten zugeben und 8 Minuten einkochen.',
      'Penne bissfest kochen und mit der Sauce vermengen.',
      'Mit Petersilie und Parmesan servieren.',
    ], 'Pasta boscaiola'),

  r('broccoli-acciughe', 'Pasta mit Brokkoli, Sardellen und Pangrattato', 'it', 'pasta', 25,
    '250 g Orecchiette | 400 g Brokkoli | 4 Stk Sardellenfilet | 2 Zehe Knoblauch | 1 Stk Chili rot | 4 EL Olivenöl | 30 g Paniermehl | Salz',
    [
      'Paniermehl in 1 EL Olivenöl goldbraun rösten und beiseitestellen.',
      'Brokkoli in kleinen Röschen zusammen mit der Pasta kochen.',
      'Sardellen, Knoblauch und Chili im restlichen Olivenöl zerfallen lassen.',
      'Pasta und Brokkoli darin mit etwas Nudelwasser schwenken und mit den Bröseln servieren.',
    ], 'Pasta broccoli acciughe'),

  r('fettuccine-alfredo', 'Fettuccine al Burro e Parmigiano (Alfredo)', 'it', 'pasta', 15,
    '250 g Fettuccine | 80 g Butter | 100 g Parmigiano Reggiano | Pfeffer | Salz',
    [
      'Fettuccine in Salzwasser bissfest kochen.',
      'Butter in Stücken in eine vorgewärmte Schüssel geben.',
      'Pasta mit einer Kelle Nudelwasser zur Butter geben und fein geriebenen Parmesan nach und nach unterrühren, bis eine seidige Sauce entsteht.',
      'Sofort mit Pfeffer servieren.',
    ], 'Fettuccine Alfredo'),

  // ───────────── Hauptgerichte ─────────────
  r('risotto-funghi', 'Risotto ai Funghi', 'it', 'haupt', 40,
    '180 g Risottoreis | 15 g Steinpilze getrocknet | 250 g Champignons braun | 1 Stk Schalotte | 100 ml Weißwein | 800 ml Gemüsebrühe | 40 g Butter | 50 g Parmigiano Reggiano | 0.5 Bund Petersilie | 1 EL Olivenöl | Salz | Pfeffer',
    [
      'Steinpilze in warmem Wasser einweichen, hacken und das Wasser zur Brühe geben. Brühe heiß halten.',
      'Schalotte in Olivenöl glasig dünsten, Reis zugeben und glasig rösten. Mit Wein ablöschen.',
      'Unter Rühren nach und nach Brühe angießen, 18 Minuten. Zwischendurch die angebratenen Champignons und Steinpilze zugeben.',
      'Vom Herd nehmen und kalte Butter und Parmesan kräftig unterrühren (mantecare). 2 Minuten ruhen lassen und mit Petersilie servieren.',
    ], 'Risotto ai funghi'),

  r('risotto-milanese', 'Risotto alla Milanese', 'it', 'haupt', 35,
    '180 g Risottoreis | 1 Stk Schalotte | 0.2 g Safranfäden | 100 ml Weißwein | 800 ml Hühnerbrühe | 50 g Butter | 60 g Parmigiano Reggiano | Salz',
    [
      'Safran in etwas heißer Brühe auflösen.',
      'Schalotte in 20 g Butter dünsten, Reis glasig rösten und mit Wein ablöschen.',
      'Nach und nach Brühe angießen und rühren. Nach 10 Minuten den Safran zugeben.',
      'Nach 18 Minuten vom Herd nehmen, kalte Butter und Parmesan einrühren und cremig servieren.',
    ], 'Risotto alla milanese'),

  r('risotto-zucca', 'Risotto alla Zucca mit Salbei', 'it', 'haupt', 40,
    '180 g Risottoreis | 400 g Hokkaido-Kürbis | 1 Stk Schalotte | 100 ml Weißwein | 800 ml Gemüsebrühe | 40 g Butter | 50 g Parmigiano Reggiano | 0.5 Bund Salbei | Muskatnuss | Salz',
    [
      'Kürbis fein würfeln. Die Hälfte mit der Schalotte in Butter andünsten.',
      'Reis zugeben, glasig rösten und mit Wein ablöschen.',
      'Brühe nach und nach angießen. Nach 8 Minuten die restlichen Kürbiswürfel zugeben.',
      'Mit Butter, Parmesan und Muskat cremig rühren. Salbei in Butter knusprig braten und darüber geben.',
    ], 'Risotto zucca'),

  r('saltimbocca', 'Saltimbocca alla Romana mit Rosmarinkartoffeln', 'it', 'haupt', 40,
    '4 Stk Kalbsschnitzel klein | 4 Scheibe Parmaschinken | 4 Blatt Salbei | 2 EL Weizenmehl | 100 ml Weißwein | 30 g Butter | 500 g Kartoffeln festkochend | 2 Zweig Rosmarin | 3 EL Olivenöl | Salz | Pfeffer',
    [
      'Kartoffeln würfeln, mit Olivenöl, Rosmarin und Salz mischen und bei 200 °C 35 Minuten im Ofen rösten.',
      'Schnitzel dünn klopfen, pfeffern, mit je einer Scheibe Parmaschinken und einem Salbeiblatt belegen und mit einem Zahnstocher feststecken.',
      'Die Unterseite leicht mehlieren. In Butter erst auf der Schinkenseite, dann auf der anderen Seite je 1 bis 2 Minuten braten.',
      'Mit Weißwein ablöschen, etwas einkochen und die Sauce über das Fleisch geben.',
    ], 'Saltimbocca'),

  r('ossobuco', 'Ossobuco alla Milanese mit Gremolata', 'it', 'haupt', 150,
    '2 Stk Kalbshaxe in Scheiben | 2 EL Weizenmehl | 1 Stk Zwiebel | 1 Stk Möhre | 1 Stk Staudensellerie | 150 ml Weißwein | 300 ml Kalbsfond | 1 EL Tomatenmark | 30 g Butter | 1 Stk Zitrone unbehandelt | 1 Zehe Knoblauch | 0.5 Bund Petersilie | 150 g Risottoreis | Salz | Pfeffer',
    [
      'Haxenscheiben am Rand einschneiden, damit sie sich nicht wölben, salzen, pfeffern und mehlieren. In Butter rundum anbraten.',
      'Gemüse fein würfeln und mitdünsten. Tomatenmark kurz mitrösten und mit Wein ablöschen.',
      'Fond angießen und zugedeckt 1,5 bis 2 Stunden sanft schmoren.',
      'Für die Gremolata Zitronenschale, Knoblauch und Petersilie fein hacken und darüber streuen. Dazu passt ein Risotto alla Milanese.',
    ], 'Ossobuco'),

  r('pollo-cacciatora', 'Pollo alla Cacciatora', 'it', 'haupt', 70,
    '4 Stk Hähnchenschenkel | 1 Stk Zwiebel | 2 Zehe Knoblauch | 1 Dose Geschälte Tomaten | 100 ml Rotwein | 60 g Oliven schwarz | 1 Zweig Rosmarin | 1 Zweig Thymian | 3 EL Olivenöl | 1 Stk Ciabatta | Salz | Pfeffer',
    [
      'Hähnchenteile salzen und pfeffern und im Olivenöl rundum goldbraun anbraten.',
      'Zwiebel und Knoblauch zugeben und mit Rotwein ablöschen.',
      'Tomaten, Oliven und Kräuter zugeben und zugedeckt 45 Minuten schmoren.',
      'Mit Ciabatta servieren.',
    ], 'Pollo alla cacciatora'),

  r('scaloppine-limone', 'Scaloppine al Limone mit Spinat', 'it', 'haupt', 30,
    '4 Stk Kalbsschnitzel klein | 2 EL Weizenmehl | 1 Stk Zitrone | 50 ml Weißwein | 40 g Butter | 1 EL Kapern | 400 g Blattspinat frisch | 1 Zehe Knoblauch | 1 EL Olivenöl | 1 Stk Ciabatta | Salz | Pfeffer',
    [
      'Schnitzel dünn klopfen, salzen, pfeffern und mehlieren.',
      'In der Hälfte der Butter 1 Minute je Seite braten und herausnehmen.',
      'Mit Wein und Zitronensaft ablöschen, Kapern und restliche kalte Butter einrühren. Fleisch darin kurz wenden.',
      'Spinat mit Knoblauch im Olivenöl zusammenfallen lassen, salzen und mit Ciabatta dazu servieren.',
    ], 'Scaloppine al limone'),

  r('cotoletta', 'Cotoletta alla Milanese mit Rucola und Tomaten', 'it', 'haupt', 30,
    '2 Stk Kalbskotelett | 2 Stk Ei | 150 g Paniermehl | 80 g Butter | 100 g Rucola | 200 g Kirschtomaten | 1 Stk Zitrone | 2 EL Olivenöl | Salz',
    [
      'Koteletts am Knochen leicht flach klopfen.',
      'In verquirltem Ei und dann in Paniermehl wenden und die Panade gut andrücken.',
      'In reichlich Butter bei mittlerer Hitze je Seite 4 bis 5 Minuten goldbraun braten und salzen.',
      'Rucola und halbierte Tomaten mit Olivenöl, Zitrone und Salz anmachen und dazu servieren.',
    ], 'Cotoletta milanese'),

  r('pizza-margherita', 'Pizza Margherita', 'it', 'haupt', 150,
    '300 g Weizenmehl Tipo 00 | 4 g Hefe frisch | 200 g Passierte Tomaten | 250 g Mozzarella | 1 Bund Basilikum | 2 EL Olivenöl | Salz',
    [
      'Mehl, 190 ml lauwarmes Wasser, Hefe und 7 g Salz 10 Minuten zu einem glatten Teig kneten. Zugedeckt 2 Stunden gehen lassen.',
      'Ofen mit Pizzastein oder Blech auf höchste Stufe vorheizen.',
      'Teig in 2 Kugeln teilen und von innen nach außen dünn ausziehen. Mit gesalzenen Tomaten bestreichen und mit zerzupftem, abgetropftem Mozzarella belegen.',
      'Auf dem heißen Stein 7 bis 9 Minuten backen. Mit Basilikum und Olivenöl servieren.',
    ], 'Pizza Margherita'),

  r('pizza-diavola', 'Pizza Diavola mit scharfer Salami', 'it', 'haupt', 150,
    '300 g Weizenmehl Tipo 00 | 4 g Hefe frisch | 200 g Passierte Tomaten | 200 g Mozzarella | 100 g Salami piccante | 1 Stk Chili rot | 1 TL Oregano getrocknet | 2 EL Olivenöl | Salz',
    [
      'Teig wie für Pizza Margherita zubereiten und 2 Stunden gehen lassen.',
      'Ofen auf höchste Stufe vorheizen.',
      'Teig dünn ausziehen, mit gewürzten Tomaten bestreichen und mit Mozzarella, Salami, Chiliringen und Oregano belegen.',
      '7 bis 9 Minuten backen und mit Olivenöl beträufeln.',
    ], 'Pizza diavola'),

  r('piccata', 'Piccata Milanese mit Tomatenspaghetti', 'it', 'haupt', 35,
    '4 Stk Schweineschnitzel klein | 2 Stk Ei | 50 g Parmigiano Reggiano | 2 EL Weizenmehl | 2 EL Olivenöl | 200 g Spaghetti | 1 Dose Geschälte Tomaten | 1 Zehe Knoblauch | 0.5 Bund Basilikum | Salz | Pfeffer',
    [
      'Tomatensauce aus Knoblauch, Olivenöl und Tomaten 15 Minuten köcheln lassen und mit Basilikum abschmecken.',
      'Eier mit geriebenem Parmesan verquirlen.',
      'Schnitzel dünn klopfen, würzen, mehlieren, durch die Eier-Käse-Masse ziehen und in Olivenöl goldgelb braten.',
      'Spaghetti kochen, mit der Sauce mischen und mit der Piccata servieren.',
    ], 'Piccata milanese'),

  r('pollo-romana', 'Pollo alla Romana con Peperoni', 'it', 'haupt', 60,
    '4 Stk Hähnchenschenkel | 2 Stk Paprika rot | 1 Stk Paprika gelb | 1 Stk Zwiebel | 2 Zehe Knoblauch | 1 Dose Geschälte Tomaten | 100 ml Weißwein | 1 Zweig Majoran frisch | 3 EL Olivenöl | Salz | Pfeffer',
    [
      'Hähnchen würzen und im Olivenöl rundum goldbraun braten.',
      'Paprika in Streifen und Zwiebel zugeben, Knoblauch kurz mitbraten und mit Wein ablöschen.',
      'Tomaten zugeben und 40 Minuten zugedeckt schmoren.',
      'Mit Majoran abschmecken.',
    ], 'Pollo alla romana'),

  r('polpette-sugo', 'Polpette al Sugo mit Weißbrot', 'it', 'haupt', 50,
    '400 g Hackfleisch gemischt | 2 Scheibe Weißbrot | 1 Stk Ei | 40 g Parmigiano Reggiano | 1 Zehe Knoblauch | 0.5 Bund Petersilie | 1 Stk Zwiebel | 400 g Passierte Tomaten | 0.5 Bund Basilikum | 3 EL Olivenöl | 1 Stk Ciabatta | Salz | Pfeffer',
    [
      'Weißbrot einweichen, ausdrücken und mit Hack, Ei, Parmesan, Knoblauch, Petersilie, Salz und Pfeffer zu Bällchen formen.',
      'Im Olivenöl anbraten.',
      'Zwiebel zugeben, Tomaten zugeben und 25 Minuten sanft köcheln lassen.',
      'Mit Basilikum und Ciabatta zum Stippen servieren.',
    ], 'Polpette al sugo'),

  r('frittata', 'Frittata mit Kartoffeln, Zwiebeln und Rucola', 'it', 'haupt', 30,
    '6 Stk Ei | 300 g Kartoffeln festkochend | 1 Stk Zwiebel | 40 g Parmigiano Reggiano | 3 EL Olivenöl | 60 g Rucola | 0.5 Bund Petersilie | Salz | Pfeffer',
    [
      'Kartoffeln in dünne Scheiben schneiden und mit der Zwiebel im Olivenöl weich braten.',
      'Eier mit Parmesan, Petersilie, Salz und Pfeffer verquirlen und darüber gießen.',
      'Bei kleiner Hitze zugedeckt stocken lassen, dann mit Hilfe eines Tellers wenden und fertig backen.',
      'In Stücke schneiden und mit Rucola servieren.',
    ], 'Frittata'),

  r('polenta-funghi', 'Cremige Polenta mit Pilzragout', 'it', 'haupt', 40,
    '150 g Polenta | 400 g Champignons braun | 150 g Kräuterseitlinge | 2 Zehe Knoblauch | 1 Zweig Thymian | 50 ml Weißwein | 40 g Butter | 50 g Parmigiano Reggiano | 2 EL Olivenöl | 0.5 Bund Petersilie | Salz | Pfeffer',
    [
      '750 ml Salzwasser aufkochen, Polenta einrieseln lassen und unter Rühren 30 Minuten (Instant: 5 Minuten) garen.',
      'Pilze in Stücke schneiden und im Olivenöl scharf anbraten. Knoblauch und Thymian zugeben und mit Wein ablöschen.',
      'Butter und Parmesan unter die Polenta rühren.',
      'Pilze auf der Polenta anrichten und mit Petersilie bestreuen.',
    ], 'Polenta funghi'),

  r('acqua-pazza', 'Pesce all\'Acqua Pazza', 'it', 'haupt', 30,
    '2 Stk Doradenfilet | 250 g Kirschtomaten | 2 Zehe Knoblauch | 1 Stk Chili rot | 100 ml Weißwein | 4 EL Olivenöl | 1 Bund Petersilie | 1 Stk Ciabatta | Salz',
    [
      'Knoblauch und Chili im Olivenöl anschwitzen.',
      'Halbierte Tomaten zugeben, kurz schmoren lassen und mit Wein und 100 ml Wasser ablöschen.',
      'Fischfilets salzen, mit der Haut nach oben einlegen und zugedeckt 6 bis 8 Minuten gar ziehen lassen.',
      'Mit Petersilie bestreuen und mit Ciabatta zum Auftunken servieren.',
    ], 'Acqua pazza'),

  r('salsiccia-patate', 'Salsiccia con Patate al Forno', 'it', 'haupt', 55,
    '4 Stk Salsiccia | 600 g Kartoffeln festkochend | 1 Stk Zwiebel rot | 2 Zweig Rosmarin | 3 Zehe Knoblauch | 4 EL Olivenöl | 100 ml Weißwein | Salz | Pfeffer',
    [
      'Kartoffeln in Spalten schneiden und mit Zwiebel, Knoblauch, Rosmarin, Olivenöl, Salz und Pfeffer auf einem Blech mischen.',
      'Bei 200 °C 20 Minuten backen.',
      'Salsicce dazulegen, mit Wein beträufeln und weitere 25 Minuten backen, bis alles goldbraun ist.',
      'Direkt vom Blech servieren.',
    ], 'Salsiccia patate'),

  r('involtini', 'Involtini al Sugo', 'it', 'haupt', 80,
    '4 Stk Rinderroulade dünn | 4 Scheibe Parmaschinken | 40 g Pecorino Romano | 2 EL Pinienkerne | 0.5 Bund Petersilie | 1 Zehe Knoblauch | 1 Dose Geschälte Tomaten | 100 ml Rotwein | 3 EL Olivenöl | 200 g Rigatoni | Salz | Pfeffer',
    [
      'Fleisch mit Schinken, geriebenem Pecorino, Pinienkernen, Petersilie und Knoblauch belegen, aufrollen und feststecken.',
      'Im Olivenöl rundum anbraten und mit Rotwein ablöschen.',
      'Tomaten zugeben und zugedeckt 60 Minuten schmoren.',
      'Die Sauce mit Rigatoni als Primo und die Involtini als Secondo servieren.',
    ], 'Involtini'),

  r('calzone', 'Calzone mit Schinken, Ricotta und Mozzarella', 'it', 'haupt', 150,
    '300 g Weizenmehl Tipo 00 | 4 g Hefe frisch | 200 g Ricotta | 150 g Mozzarella | 120 g Kochschinken | 100 g Passierte Tomaten | 30 g Parmigiano Reggiano | 2 EL Olivenöl | Salz | Pfeffer',
    [
      'Pizzateig zubereiten und 2 Stunden gehen lassen.',
      'Ricotta mit Parmesan, Pfeffer und gewürfeltem Schinken und Mozzarella mischen.',
      'Teig in 2 Kreise ausziehen, eine Hälfte mit Tomaten und der Füllung belegen, zuklappen und die Ränder fest andrücken.',
      'Mit Olivenöl bestreichen und bei 250 °C 12 bis 15 Minuten backen.',
    ], 'Calzone'),

  r('pizzaiola', 'Carne alla Pizzaiola', 'it', 'haupt', 30,
    '2 Stk Rumpsteak | 1 Dose Geschälte Tomaten | 2 Zehe Knoblauch | 1 TL Oregano getrocknet | 1 EL Kapern | 3 EL Olivenöl | 1 Stk Ciabatta | Salz | Pfeffer',
    [
      'Steaks flach drücken und im heißen Olivenöl kurz von beiden Seiten anbraten. Herausnehmen.',
      'Knoblauch anschwitzen, Tomaten, Oregano und Kapern zugeben und 10 Minuten köcheln lassen.',
      'Steaks in die Sauce legen und 3 bis 4 Minuten ziehen lassen.',
      'Mit Ciabatta servieren.',
    ], 'Carne alla pizzaiola'),

  r('risi-bisi', 'Risi e Bisi (Venezianischer Erbsenreis)', 'it', 'haupt', 35,
    '180 g Risottoreis | 300 g Erbsen TK | 50 g Pancetta | 1 Stk Zwiebel | 900 ml Gemüsebrühe | 40 g Butter | 50 g Parmigiano Reggiano | 0.5 Bund Petersilie | Salz | Pfeffer',
    [
      'Pancetta und Zwiebel in der Hälfte der Butter anschwitzen.',
      'Reis zugeben, glasig rösten und mit Brühe aufgießen. Erbsen zugeben.',
      'Unter gelegentlichem Rühren 18 Minuten garen. Das Gericht soll suppiger sein als ein Risotto (all\'onda).',
      'Butter, Parmesan und Petersilie einrühren.',
    ], 'Risi e bisi'),

  r('fegato-veneziana', 'Fegato alla Veneziana mit Polenta', 'it', 'haupt', 45,
    '350 g Kalbsleber | 3 Stk Zwiebel | 3 EL Olivenöl | 20 g Butter | 2 EL Weißweinessig | 0.5 Bund Petersilie | 150 g Polenta | 30 g Parmigiano Reggiano | Salz | Pfeffer',
    [
      'Zwiebeln in hauchdünne Ringe schneiden und in Olivenöl und Butter 25 Minuten sanft weich schmoren.',
      'Polenta in 750 ml Salzwasser garen und Parmesan unterrühren.',
      'Leber in feine Streifen schneiden, zu den Zwiebeln geben und bei hoher Hitze 2 Minuten braten.',
      'Mit Essig ablöschen, salzen, pfeffern und mit Petersilie auf der Polenta servieren.',
    ], 'Fegato alla veneziana'),

  // ───────────── Aufläufe ─────────────
  r('lasagne', 'Lasagne alla Bolognese', 'it', 'auflauf', 150,
    '9 Stk Lasagneplatten | 200 g Rinderhackfleisch | 150 g Schweinehackfleisch | 1 Stk Zwiebel | 1 Stk Möhre | 1 Stk Staudensellerie | 2 EL Tomatenmark | 400 g Passierte Tomaten | 100 ml Rotwein | 50 g Butter | 50 g Weizenmehl | 600 ml Milch | 80 g Parmigiano Reggiano | 2 EL Olivenöl | Muskatnuss | Salz | Pfeffer',
    [
      'Soffritto aus fein gewürfelter Zwiebel, Möhre und Sellerie im Olivenöl dünsten. Hack krümelig anbraten, Tomatenmark rösten und mit Wein ablöschen. Tomaten zugeben und 1 Stunde köcheln lassen.',
      'Für die Béchamel Butter schmelzen, Mehl anschwitzen, Milch einrühren, 5 Minuten köcheln lassen und mit Muskat und Salz würzen.',
      'In eine Form abwechselnd Ragù, Lasagneplatten, Béchamel und Parmesan schichten. Mit Béchamel und Parmesan abschließen.',
      'Bei 180 °C 40 Minuten backen und vor dem Anschneiden 10 Minuten ruhen lassen.',
    ], 'Lasagne'),

  r('lasagne-spinat', 'Lasagne mit Spinat und Ricotta', 'it', 'auflauf', 70,
    '9 Stk Lasagneplatten | 450 g Blattspinat TK | 250 g Ricotta | 1 Stk Ei | 1 Zehe Knoblauch | 50 g Butter | 50 g Weizenmehl | 600 ml Milch | 125 g Mozzarella | 60 g Parmigiano Reggiano | Muskatnuss | Salz | Pfeffer',
    [
      'Spinat auftauen, gut ausdrücken, hacken und mit Ricotta, Ei, Knoblauch, Salz, Pfeffer und Muskat mischen.',
      'Béchamel aus Butter, Mehl und Milch kochen und würzen.',
      'Béchamel, Platten und Spinat-Ricotta abwechselnd schichten. Mit Béchamel, Mozzarella und Parmesan abschließen.',
      'Bei 180 °C 40 Minuten backen.',
    ], 'Lasagne spinaci'),

  r('cannelloni', 'Cannelloni Ricotta e Spinaci', 'it', 'auflauf', 60,
    '12 Stk Cannelloni | 450 g Blattspinat TK | 250 g Ricotta | 1 Stk Ei | 60 g Parmigiano Reggiano | 400 g Passierte Tomaten | 1 Zehe Knoblauch | 200 ml Sahne | 125 g Mozzarella | Muskatnuss | Salz | Pfeffer',
    [
      'Spinat ausdrücken, hacken und mit Ricotta, Ei, der Hälfte des Parmesans, Salz, Pfeffer und Muskat mischen. In die Cannelloni füllen (am besten mit einem Spritzbeutel).',
      'Tomaten mit Knoblauch und Salz kurz aufkochen und in eine Form geben. Cannelloni darauflegen.',
      'Sahne darüber gießen und mit Mozzarella und restlichem Parmesan belegen.',
      'Bei 180 °C 35 Minuten backen.',
    ], 'Cannelloni'),

  r('parmigiana', 'Parmigiana di Melanzane', 'it', 'auflauf', 90,
    '2 Stk Aubergine | 400 g Passierte Tomaten | 1 Zehe Knoblauch | 250 g Mozzarella | 80 g Parmigiano Reggiano | 1 Bund Basilikum | 100 ml Olivenöl | 1 Stk Ciabatta | Salz',
    [
      'Auberginen längs in 1 cm dicke Scheiben schneiden, salzen, 30 Minuten ziehen lassen und trocken tupfen. Im Olivenöl goldbraun braten.',
      'Tomaten mit Knoblauch und Basilikum 15 Minuten zu einer Sauce kochen.',
      'Sauce, Auberginen, Mozzarella, Parmesan und Basilikum in eine Form schichten. Mit Sauce und Parmesan abschließen.',
      'Bei 180 °C 35 Minuten backen und lauwarm mit Ciabatta servieren.',
    ], 'Parmigiana di melanzane'),

  r('gnocchi-sorrentina', 'Gnocchi alla Sorrentina', 'it', 'auflauf', 30,
    '500 g Gnocchi | 400 g Passierte Tomaten | 1 Zehe Knoblauch | 200 g Mozzarella | 40 g Parmigiano Reggiano | 0.5 Bund Basilikum | 2 EL Olivenöl | Salz',
    [
      'Tomatensauce mit Knoblauch und Olivenöl 10 Minuten köcheln lassen und salzen.',
      'Gnocchi garen, bis sie oben schwimmen, und mit Sauce und Basilikum mischen.',
      'In eine Form füllen und mit Mozzarella und Parmesan belegen.',
      'Bei 220 °C 10 Minuten überbacken, bis der Käse blubbert.',
    ], 'Gnocchi alla sorrentina'),

  r('pasta-al-forno', 'Pasta al Forno Siciliana', 'it', 'auflauf', 75,
    '250 g Rigatoni | 1 Stk Aubergine | 250 g Hackfleisch gemischt | 1 Stk Zwiebel | 400 g Passierte Tomaten | 100 g Erbsen TK | 150 g Mozzarella | 60 g Parmigiano Reggiano | 4 EL Olivenöl | 0.5 Bund Basilikum | Salz | Pfeffer',
    [
      'Aubergine würfeln und im Olivenöl braten.',
      'Hack mit Zwiebel anbraten, Tomaten und Erbsen zugeben und 20 Minuten köcheln lassen.',
      'Rigatoni sehr bissfest kochen und mit Sauce, Auberginen, Basilikum, gewürfeltem Mozzarella und der Hälfte des Parmesans mischen.',
      'In eine Form füllen, mit Parmesan bestreuen und bei 200 °C 25 Minuten backen.',
    ], 'Pasta al forno'),

  r('zucchine-ripiene', 'Zucchine Ripiene (Gefüllte Zucchini)', 'it', 'auflauf', 50,
    '3 Stk Zucchini | 250 g Hackfleisch gemischt | 1 Scheibe Weißbrot | 1 Stk Ei | 40 g Parmigiano Reggiano | 1 Zehe Knoblauch | 200 g Passierte Tomaten | 2 EL Olivenöl | 0.5 Bund Basilikum | 1 Stk Ciabatta | Salz | Pfeffer',
    [
      'Zucchini längs halbieren und aushöhlen. Das Fruchtfleisch hacken.',
      'Fruchtfleisch mit Hack, eingeweichtem Weißbrot, Ei, Parmesan, Knoblauch, Salz und Pfeffer mischen und in die Zucchini füllen.',
      'Tomaten in eine Form geben, Zucchini daraufsetzen und mit Olivenöl beträufeln.',
      'Bei 190 °C 35 Minuten backen und mit Basilikum und Ciabatta servieren.',
    ], 'Zucchine ripiene'),

  // ───────────── Suppen & Eintöpfe ─────────────
  r('minestrone', 'Minestrone alla Genovese', 'it', 'suppe', 60,
    '1 Stk Zwiebel | 2 Stk Möhre | 1 Stk Staudensellerie | 1 Stk Zucchini | 150 g Kartoffeln festkochend | 100 g Grüne Bohnen | 150 g Wirsing | 1 Dose Borlotti-Bohnen | 1 Dose Geschälte Tomaten | 1 l Gemüsebrühe | 60 g Ditalini | 2 EL Olivenöl | 40 g Parmigiano Reggiano | 2 EL Pesto Genovese | Salz | Pfeffer',
    [
      'Zwiebel, Möhren und Sellerie im Olivenöl andünsten.',
      'Restliches Gemüse würfeln, zugeben, Tomaten und Brühe angießen und 30 Minuten köcheln lassen.',
      'Bohnen und Nudeln zugeben und weitere 10 Minuten garen.',
      'Mit einem Löffel Pesto und Parmesan servieren.',
    ], 'Minestrone'),

  r('pasta-fagioli', 'Pasta e Fagioli', 'it', 'eintopf', 45,
    '2 Dose Borlotti-Bohnen | 100 g Ditalini | 50 g Pancetta | 1 Stk Zwiebel | 1 Stk Möhre | 1 Stk Staudensellerie | 2 EL Tomatenmark | 800 ml Gemüsebrühe | 1 Zweig Rosmarin | 3 EL Olivenöl | 30 g Parmigiano Reggiano | Salz | Pfeffer',
    [
      'Pancetta und Soffritto im Olivenöl anschwitzen. Tomatenmark und Rosmarin kurz mitrösten.',
      'Bohnen und Brühe zugeben und 15 Minuten köcheln lassen. Ein Drittel der Bohnen pürieren.',
      'Nudeln direkt in der Suppe garen, bis sie sämig ist.',
      'Mit Olivenöl, Pfeffer und Parmesan servieren.',
    ], 'Pasta e fagioli'),

  r('pasta-ceci', 'Pasta e Ceci alla Romana', 'it', 'eintopf', 40,
    '2 Dose Kichererbsen | 100 g Ditalini | 2 Zehe Knoblauch | 1 Zweig Rosmarin | 2 Stk Sardellenfilet | 1 EL Tomatenmark | 700 ml Gemüsebrühe | 4 EL Olivenöl | 30 g Pecorino Romano | Salz | Pfeffer',
    [
      'Knoblauch, Rosmarin und Sardellen im Olivenöl anschwitzen. Tomatenmark kurz mitrösten.',
      'Kichererbsen und Brühe zugeben und 15 Minuten köcheln lassen. Die Hälfte pürieren.',
      'Nudeln in der Suppe garen.',
      'Mit Olivenöl, Pfeffer und Pecorino servieren.',
    ], 'Pasta e ceci'),

  r('ribollita', 'Ribollita (Toskanischer Brotsuppen-Eintopf)', 'it', 'eintopf', 75,
    '1 Stk Zwiebel | 2 Stk Möhre | 1 Stk Staudensellerie | 300 g Schwarzkohl | 150 g Wirsing | 1 Dose Cannellini-Bohnen | 1 Dose Geschälte Tomaten | 1 l Gemüsebrühe | 4 Scheibe Toskanisches Brot | 4 EL Olivenöl | 1 Zweig Thymian | Salz | Pfeffer',
    [
      'Soffritto im Olivenöl anschwitzen.',
      'Kohl in Streifen schneiden, zugeben, dann Tomaten, Brühe, Thymian und die Hälfte der Bohnen zugeben. 40 Minuten köcheln lassen.',
      'Restliche Bohnen pürieren und unterrühren. Das Brot in Stücken einlegen und 10 Minuten ziehen lassen, bis es zerfällt.',
      'Mit reichlich Olivenöl servieren. Am nächsten Tag aufgewärmt schmeckt sie noch besser.',
    ], 'Ribollita'),

  r('stracciatella', 'Stracciatella alla Romana', 'it', 'suppe', 15,
    '800 ml Hühnerbrühe | 3 Stk Ei | 40 g Parmigiano Reggiano | 1 EL Paniermehl | 0.5 Bund Petersilie | 1 Stk Zitrone | Muskatnuss | Salz | Pfeffer',
    [
      'Eier mit Parmesan, Paniermehl, Petersilie und Muskat verquirlen.',
      'Brühe aufkochen.',
      'Die Eiermasse unter Rühren einlaufen lassen, so dass feine Flocken (stracci) entstehen.',
      'Mit Zitronenschale und Pfeffer servieren.',
    ], 'Stracciatella soup'),

  r('pappa-pomodoro', 'Pappa al Pomodoro', 'it', 'suppe', 40,
    '500 g Tomate | 1 Dose Geschälte Tomaten | 250 g Toskanisches Brot | 3 Zehe Knoblauch | 1 Bund Basilikum | 500 ml Gemüsebrühe | 5 EL Olivenöl | Salz | Pfeffer',
    [
      'Knoblauch im Olivenöl anschwitzen. Frische und geschälte Tomaten zugeben und 15 Minuten köcheln lassen.',
      'Brühe zugeben. Altbackenes Brot in Stücken einlegen und 15 Minuten ziehen lassen.',
      'Kräftig rühren, bis ein dicker Brei entsteht.',
      'Basilikum unterziehen und lauwarm mit viel Olivenöl servieren.',
    ], 'Pappa al pomodoro'),

  r('zuppa-lenticchie', 'Zuppa di Lenticchie mit Salsiccia', 'it', 'eintopf', 50,
    '200 g Tellerlinsen | 2 Stk Salsiccia | 1 Stk Zwiebel | 1 Stk Möhre | 1 Stk Staudensellerie | 1 EL Tomatenmark | 1 l Gemüsebrühe | 1 Zweig Rosmarin | 3 EL Olivenöl | 1 Stk Ciabatta | Salz | Pfeffer',
    [
      'Salsiccia in Stücken im Olivenöl anbraten. Soffritto zugeben und andünsten.',
      'Tomatenmark kurz mitrösten. Linsen, Brühe und Rosmarin zugeben.',
      '35 Minuten köcheln lassen, bis die Linsen weich sind.',
      'Mit Olivenöl beträufeln und mit geröstetem Ciabatta servieren.',
    ], 'Zuppa di lenticchie'),

  r('spezzatino', 'Spezzatino di Manzo con Patate', 'it', 'eintopf', 150,
    '500 g Rindergulasch | 400 g Kartoffeln festkochend | 1 Stk Zwiebel | 1 Stk Möhre | 1 Stk Staudensellerie | 2 EL Tomatenmark | 150 ml Rotwein | 400 ml Rinderfond | 1 Zweig Rosmarin | 1 Blatt Lorbeerblatt | 3 EL Olivenöl | Salz | Pfeffer',
    [
      'Fleisch portionsweise im Olivenöl anbraten.',
      'Soffritto zugeben, Tomatenmark mitrösten und mit Wein ablöschen.',
      'Fond, Rosmarin und Lorbeer zugeben und zugedeckt 90 Minuten schmoren.',
      'Kartoffelwürfel zugeben und weitere 30 Minuten garen.',
    ], 'Spezzatino'),

  // ───────────── Leicht & sättigend (Abnehm-Abendessen) ─────────────
  r('cacciatora-leggera', 'Pollo alla Cacciatora leggero mit Polenta', 'it', 'haupt', 45,
    '350 g Hähnchenschenkelfilet | 2 Stk Paprika rot | 1 Stk Zwiebel | 200 g Champignons | 2 Zehe Knoblauch | 1 Dose Geschälte Tomaten | 80 ml Weißwein | 30 g Oliven schwarz | 1 EL Kapern | 1 Zweig Rosmarin | 1 EL Olivenöl | 60 g Polenta | Salz | Pfeffer',
    [
      'Hähnchen in große Stücke schneiden, salzen, pfeffern und im Olivenöl rundum goldbraun braten, herausnehmen.',
      'Zwiebel, Paprika und Champignons zugeben und 5 Minuten braten, Knoblauch mitbraten und mit Weißwein ablöschen.',
      'Tomaten, Rosmarin, Oliven und Kapern zugeben, das Hähnchen zurücklegen und zugedeckt 25 Minuten schmoren.',
      'Polenta nach Packungsanweisung in ca. 400 ml Salzwasser zu einem weichen Brei kochen und mit dem Hähnchen servieren.',
    ], 'chicken cacciatore polenta'),

  r('puten-saltimbocca', 'Puten-Saltimbocca mit Zucchini und Rosmarinkartoffeln', 'it', 'haupt', 35,
    '300 g Putenbrust | 4 Scheibe Parmaschinken | 4 Blatt Salbei | 1 EL Weizenmehl | 80 ml Weißwein | 1 EL Butter | 2 Stk Zucchini | 1 Zehe Knoblauch | 300 g Kartoffeln festkochend | 2 Zweig Rosmarin | 1 EL Olivenöl | Salz | Pfeffer',
    [
      'Kartoffeln in 2 cm große Würfel schneiden, mit der Hälfte des Olivenöls, Rosmarin und Salz mischen und im Airfryer knusprig garen.',
      'Putenbrust in vier dünne Schnitzel schneiden und flach klopfen, pfeffern. Jeweils mit Salbei und Parmaschinken belegen, mit einem Zahnstocher feststecken und auf der Unterseite leicht mehlieren.',
      'Zucchini in Scheiben mit Knoblauch im restlichen Olivenöl 5 Minuten braten und salzen, warm halten.',
      'Saltimbocca in Butter zuerst auf der Schinkenseite, dann auf der anderen je 2 Minuten braten. Mit Weißwein ablöschen, kurz einkochen und die Sauce über das Fleisch geben.',
    ], 'turkey saltimbocca zucchini'),

  r('merluzzo-livornese', 'Kabeljau alla Livornese mit Toskanischem Brot', 'it', 'haupt', 30,
    '320 g Kabeljaufilet | 250 g Kirschtomaten | 1 Stk Zwiebel | 2 Zehe Knoblauch | 30 g Oliven schwarz | 1 EL Kapern | 80 ml Weißwein | 1 EL Olivenöl | 0.5 Bund Petersilie | 4 Scheibe Toskanisches Brot | Salz | Pfeffer',
    [
      'Zwiebel und Knoblauch fein würfeln und im Olivenöl 3 Minuten andünsten. Kirschtomaten halbieren, zugeben und mit Weißwein ablöschen.',
      'Oliven und Kapern zugeben und die Sauce 8 Minuten einköcheln lassen.',
      'Kabeljau salzen, pfeffern, in die Sauce legen und zugedeckt 8 bis 10 Minuten garen.',
      'Mit Petersilie bestreuen und mit dem Brot servieren.',
    ], 'cod livornese tomatoes olives capers'),

  r('straccetti-rucola', 'Straccetti di Manzo mit Rucola und Kirschtomaten', 'it', 'haupt', 25,
    '300 g Rinderhüfte | 100 g Rucola | 200 g Kirschtomaten | 2 Zehe Knoblauch | 1 Zweig Rosmarin | 1 EL Olivenöl | 1 EL Rotweinessig | 20 g Parmigiano Reggiano | 4 Scheibe Toskanisches Brot | Salz | Pfeffer',
    [
      'Rinderhüfte quer zur Faser in dünne Streifen schneiden, mit Salz, Pfeffer und gehacktem Rosmarin würzen.',
      'Kirschtomaten halbieren. Olivenöl in einer sehr heißen Pfanne erhitzen und das Fleisch mit dem Knoblauch in zwei Portionen je 2 Minuten scharf anbraten.',
      'Tomaten kurz mit anbraten und mit Essig ablöschen.',
      'Rucola auf zwei Tellern verteilen, das Fleisch darauf anrichten und mit gehobeltem Parmigiano Reggiano und dem Brot servieren.',
    ], 'straccetti di manzo rucola'),
]
