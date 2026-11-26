import { prod, r } from './define'
import type { ExtraIngredients } from './extra/types'

/**
 * Spanische Küche (Wischstapel) – Datei 2 von 2: EINTÖPFE, FLEISCH & GEFLÜGEL
 * (Fabada asturiana, Cocido madrileño, Lentejas con chorizo, Pollo al ajillo, Pollo en pepitoria, Albóndigas en salsa
 * als Hauptgericht, Carrillada al Pedro Ximénez, Callos, Pisto manchego mit Ei, Marmitako …). Reis & Fisch: recipes-es.ts.
 *
 * Anlegen mit `r(id, 'Spanischer Titel (deutsche Erklärung)', 'es', art, minuten, zutaten, schritte, bildsuche)`, Mengen für
 * 2 Portionen, Einweichzeit über Nacht im ersten Schritt nennen (nicht in `minuten`). Geräte-Schritte: src/data/device-steps/es2.ts.
 * Abnehmen: Abendessen ca. 550–750 kcal je Portion; darüber nennt der letzte Schritt „Leichter: …“.
 *
 * Neue Zutaten NUR unten in `es2Zutaten` – zentral eingetragen über src/data/extra/index.ts. Gemeinsame Spanien-Zutaten
 * (Chorizo, Serrano-Schinken, Fabes getrocknet, Sherry fino, Kaninchenkeule …): src/data/extra/zutaten-es.ts – nicht neu anlegen.
 * Regeln: docs/spanien-regeln.md. Neue Fotos: Zeilen in scripts/fotos-neu-es2.md („| id | Bildbeschreibung |“).
 */
export const recipesEs2 = [
  r('fabada-asturiana', 'Fabada asturiana (asturischer Bohneneintopf mit Chorizo und Morcilla)', 'es', 'eintopf', 200,
    '160 g Fabes getrocknet | 70 g Chorizo | 60 g Blutwurst | 60 g Schweinebauch geräuchert | 1 Stk Zwiebel | 2 Zehe Knoblauch | 1 Blatt Lorbeerblatt | 0.05 g Safranfäden | 1 TL Paprikapulver edelsüß | Salz',
    [
      'Die Fabes (große, buttrige weiße Bohnen aus Asturien) am Vortag in reichlich kaltem Wasser 12 Stunden einweichen. Den geräucherten Schweinebauch ebenfalls 1 Stunde wässern, damit er nicht zu salzig ist.',
      'Die Bohnen abgießen und in einen breiten Topf geben, knapp mit kaltem Wasser bedecken. Die halbierte Zwiebel, Knoblauch, Lorbeer sowie Chorizo, Blutwurst (Ersatz für die asturische Morcilla) und Schweinebauch im Ganzen darauflegen – dieses „Compango“ gibt den Geschmack. Langsam aufkochen und den Schaum abschöpfen.',
      'Die Safranfäden und das Paprikapulver in etwas Kochwasser verrühren und zugeben. Den Eintopf zugedeckt 2,5 Stunden ganz leise simmern lassen. Nicht umrühren – die Bohnen platzen sonst –, nur ab und zu den Topf schwenken. Zwei- bis dreimal einen Schuss kaltes Wasser zugeben („asustar las fabes“, die Bohnen erschrecken): so bleibt die Haut zart und ganz.',
      'Wenn die Bohnen butterweich sind, Wurst und Fleisch herausnehmen und in Scheiben schneiden, Zwiebel und Lorbeer entfernen. Erst jetzt salzen, die Wurst gibt viel Salz ab.',
      'Den Eintopf 15 Minuten ruhen lassen, damit er sämig wird. In tiefen Tellern servieren und das Compango obenauf legen oder getrennt reichen. Leichter: Blutwurst weglassen und den Schweinebauch durch mageren Kochschinken ersetzen – die Fabes und die Chorizo tragen den Geschmack.',
    ], 'fabada asturiana'),
  r('cocido-madrileno', 'Cocido madrileño (Madrider Kichererbsen-Eintopf in zwei Gängen: Suppe, dann Fleisch und Gemüse)', 'es', 'eintopf', 210,
    '100 g Kichererbsen getrocknet | 200 g Suppenfleisch Rind | 1 Stk Hähnchenschenkel | 40 g Schweinebauch geräuchert | 30 g Serrano-Schinken | 50 g Chorizo | 300 g Kartoffeln festkochend | 1 Stk Möhre | 300 g Weißkohl | 2 Zehe Knoblauch | 40 g Suppennudeln | 1 EL Olivenöl | Salz',
    [
      'Die Kichererbsen am Vortag in reichlich lauwarmem Wasser mit 1 TL Salz 12 Stunden einweichen. Den geräucherten Schweinebauch (Ersatz für den spanischen „Tocino“) 1 Stunde wässern.',
      'Suppenfleisch Rind, Hähnchenschenkel, Schweinebauch und Serrano-Schinken (er ersetzt den Schinkenknochen) in einem großen Topf mit 2,5 l kaltem Wasser aufsetzen und langsam aufkochen. Den grauen Schaum abschöpfen, bis die Brühe klar bleibt.',
      'Die abgetropften Kichererbsen in ein Kochnetz füllen und in die kochende Brühe geben – kalt zugegeben würden sie hart bleiben. Zugedeckt 2 Stunden ganz leise simmern lassen; die Brühe soll nur zittern, dann bleibt sie klar.',
      'Die Kartoffeln schälen und im Ganzen, die Möhre in großen Stücken in den Topf geben und alles weitere 30 Minuten garen. Garprobe: Die Kichererbsen lassen sich mit der Zunge am Gaumen zerdrücken, das Fleisch ist weich.',
      'Inzwischen den Weißkohl in breite Streifen schneiden und mit der Chorizo getrennt garen – so färbt die Chorizo die Brühe nicht rot. Den Knoblauch in Scheiben im Olivenöl hellgolden braten und den Kohl darin kurz schwenken („rehogar“).',
      'Erster Gang – „Sopa“: Die Brühe durch ein Sieb abgießen (Fleisch, Kichererbsen und Gemüse mit etwas Brühe zugedeckt warm halten). 500 ml davon aufkochen, die Suppennudeln (in Spanien „Fideos finos“) darin 4 Minuten garen und mit Salz abschmecken.',
      'Zweiter Gang – „Vuelco“ (das Umstürzen): Kichererbsen, Kartoffeln, Möhre und Kohl auf einer Platte anrichten, das Fleisch und die Chorizo in Stücke schneiden und dazulegen. Mit einem Spritzer Olivenöl servieren.',
      'Reste und Vorrat: Übrige Brühe abkühlen lassen und portionsweise vakuumieren oder einfrieren – sie ist die Basis für die nächste Sopa. Übriges Fleisch wird in Madrid am nächsten Tag zu „Ropa vieja“ (mit Zwiebeln in der Pfanne gebraten) oder zu Croquetas. Leichter: Schweinebauch weglassen, die Brühe nach dem Abkühlen entfetten und im zweiten Gang mehr Kohl und weniger Kichererbsen nehmen.',
    ], 'cocido madrileño'),
  r('lentejas-con-chorizo', 'Lentejas con chorizo (spanischer Linseneintopf mit Chorizo)', 'es', 'eintopf', 60,
    '160 g Tellerlinsen | 100 g Chorizo | 1 Stk Zwiebel | 0.5 Stk Paprika grün | 1 Stk Möhre | 200 g Kartoffeln festkochend | 2 Zehe Knoblauch | 1 Stk Tomate | 1 Blatt Lorbeerblatt | 1 TL Paprikapulver edelsüß | 1 EL Olivenöl | Salz',
    [
      'Die Linsen in einem Sieb abspülen, Einweichen ist nicht nötig. In Spanien nimmt man kleine braune „Pardina“-Linsen (spanische Feinkost, online), Tellerlinsen gelingen genauso. Zwiebel, Paprika und Knoblauch fein würfeln, die Möhre in Scheiben schneiden. Die Chorizo in 1 cm dicke Scheiben schneiden.',
      'Das Olivenöl im Topf erhitzen und die Chorizo 2 Minuten anbraten, bis sie rotes Fett abgibt. Zwiebel, Paprika und Knoblauch zugeben und 5 Minuten glasig dünsten. Die Tomate hineinreiben, die Schale bleibt in der Hand.',
      'Den Topf kurz vom Herd ziehen, das Paprikapulver einrühren (es verbrennt sonst sofort und wird bitter) und gleich Linsen, Möhre, Lorbeer und 900 ml kaltes Wasser zugeben. Aufkochen und zugedeckt 25 Minuten leise köcheln lassen.',
      'Die Kartoffeln schälen und in Stücke „brechen“: anschneiden und abbrechen – die rauen Kanten geben Stärke ab und binden den Eintopf. Zugeben und weitere 20 Minuten köcheln, bis Linsen und Kartoffeln weich sind; bei Bedarf einen Schuss Wasser nachgießen. Erst jetzt salzen und den Lorbeer entfernen.',
      'Vor dem Servieren 5 Minuten ruhen lassen. Lentejas schmecken am nächsten Tag noch besser – gern die doppelte Menge kochen und den Rest einfrieren. In Spanien gibt es Brot dazu und manchmal einen Spritzer Essig.',
    ], 'lentejas con chorizo'),
  r('potaje-de-garbanzos-y-espinacas', 'Potaje de garbanzos y espinacas (Kichererbsen-Spinat-Eintopf der Fastenzeit mit Ei)', 'es', 'eintopf', 100,
    '150 g Kichererbsen getrocknet | 300 g Blattspinat frisch | 2 Stk Ei | 1 Stk Zwiebel | 3 Zehe Knoblauch | 1 Scheibe Weißbrot | 1 Stk Tomate | 1 TL Paprikapulver edelsüß | 0.5 TL Kreuzkümmel | 1 Blatt Lorbeerblatt | 3 EL Olivenöl | Salz | Pfeffer',
    [
      'Die Kichererbsen am Vortag in reichlich lauwarmem Wasser 12 Stunden einweichen.',
      'Die Kichererbsen abgießen, mit dem Lorbeer in 1,2 l kaltem Wasser aufsetzen, aufkochen und zugedeckt 75 Minuten leise köcheln lassen. Garprobe: Eine Kichererbse lässt sich mit der Zunge am Gaumen zerdrücken.',
      'Inzwischen die Eier 11 Minuten hart kochen, kalt abschrecken und pellen.',
      'Für das „Majado“ (die würzige Bindung aus dem Mörser) 2 EL Olivenöl in einer Pfanne erhitzen, die geschälten Knoblauchzehen und das Weißbrot darin 3 Minuten goldbraun braten. Herausnehmen und im Mörser oder Blitzhacker mit dem Kreuzkümmel und 3 EL Kochwasser der Kichererbsen zu einer Paste zerstoßen.',
      'Im restlichen Öl die fein gewürfelte Zwiebel glasig dünsten, die Tomate hineinreiben und kurz einkochen. Vom Herd ziehen, das Paprikapulver einrühren und sofort zu den Kichererbsen geben.',
      'Den gewaschenen Spinat portionsweise in den Topf geben und zusammenfallen lassen, das Majado einrühren und alles offen 10 Minuten köcheln, bis der Potaje sämig ist. Mit Salz und Pfeffer abschmecken, Lorbeer entfernen.',
      'Die Eier vierteln und auf den Potaje legen. Als „Potaje de vigilia“ für die Fastenfreitage kommt in Andalusien noch gewässerter Bacalao (Salzkabeljau) hinein – frischer Kabeljau, in den letzten 8 Minuten auf den Eintopf gelegt, geht auch.',
    ], 'potaje de garbanzos y espinacas'),
  r('pollo-al-ajillo', 'Pollo al ajillo (Knoblauch-Hähnchen mit Sherry)', 'es', 'haupt', 55,
    '2 Stk Hähnchenschenkel | 400 g Kartoffeln festkochend | 8 Zehe Knoblauch | 80 ml Sherry fino | 1 Blatt Lorbeerblatt | 1 Stk Chili getrocknet | 0.5 Bund Petersilie | 4 EL Olivenöl | Salz | Pfeffer',
    [
      'Die Hähnchenschenkel am Gelenk teilen und Ober- und Unterschenkel mit einem schweren Messer quer durchhacken – in Spanien wird das Huhn „troceado“, in kleine Stücke mit Knochen, damit viel Fläche bräunt. Kräftig salzen und pfeffern. Die Knoblauchzehen mit Schale mit dem Handballen andrücken („ajos chafados“).',
      'Die Kartoffeln schälen, in 1 cm dicke Stäbchen schneiden, 10 Minuten wässern, trocken tupfen und mit 1 EL Olivenöl und Salz mischen.',
      '3 EL Olivenöl in einer breiten Pfanne (spanisch „Cazuela“) erhitzen, die Hähnchenstücke mit der Haut nach unten hineinlegen und bei mittlerer Hitze 15 Minuten rundum langsam goldbraun braten.',
      'Knoblauch, Chili (in Spanien „Guindilla“) und Lorbeer zugeben und 3 Minuten mitbraten, bis der Knoblauch duftet und Farbe nimmt – nicht schwarz werden lassen. Mit dem Sherry fino ablöschen (trockener Weißwein geht auch), zugedeckt 15 Minuten schmoren, dann offen einkochen, bis eine kleine, ölige Sauce übrig ist. Garprobe: Der Fleischsaft an der dicksten Stelle läuft klar.',
      'Währenddessen die Kartoffelstäbchen 22 Minuten knusprig backen, zweimal schütteln.',
      'Die Petersilie hacken, über das Huhn streuen und mit den Kartoffeln servieren; den weichen Knoblauch drückt man bei Tisch aus der Schale. Leichter: die Haut vor dem Braten abziehen, nur 2 EL Öl in die Pfanne geben und statt der Kartoffeln einen grünen Salat reichen.',
    ], 'pollo al ajillo'),
  r('pollo-en-pepitoria', 'Pollo en pepitoria (Huhn in Mandel-Safran-Sauce mit Eigelb)', 'es', 'haupt', 75,
    '2 Stk Hähnchenschenkel | 30 g Mandeln | 2 Stk Ei | 0.1 g Safranfäden | 1 Stk Zwiebel | 2 Zehe Knoblauch | 1 Scheibe Weißbrot | 100 ml Sherry fino | 250 ml Hühnerbrühe | 1 Blatt Lorbeerblatt | 1 EL Weizenmehl | 0.5 Bund Petersilie | 2 EL Olivenöl | Salz | Pfeffer',
    [
      'Die Hähnchenschenkel am Gelenk teilen, salzen, pfeffern und dünn im Weizenmehl wenden. Die Zwiebel fein würfeln.',
      'Die Eier 11 Minuten hart kochen, kalt abschrecken, pellen und Eigelb und Eiweiß trennen.',
      'Das Olivenöl in einem Schmortopf erhitzen, die Mandeln (am besten geschälte), den geschälten Knoblauch und das Weißbrot darin 3 Minuten goldgelb rösten und herausnehmen – sie binden später die Sauce.',
      'Im selben Öl die Hähnchenteile rundum goldbraun anbraten, die Zwiebel zugeben und weich dünsten. Mit dem Sherry fino ablöschen und kurz einkochen. Hühnerbrühe und Lorbeer zugeben und zugedeckt 35 Minuten leise schmoren.',
      'Inzwischen die Safranfäden in einer trockenen Pfanne wenige Sekunden anrösten und im Mörser mit Mandeln, Knoblauch, Brot, den Eigelben und 3 EL Schmorflüssigkeit zu einer glatten Paste zerstoßen (Blitzhacker geht auch) – das ist die „Pepitoria“.',
      'Die Paste in die Sauce rühren und offen 5 Minuten köcheln, bis sie cremig gebunden ist. Garprobe: Das Fleisch löst sich leicht vom Knochen. Mit Salz abschmecken, Lorbeer entfernen.',
      'Mit gehacktem Eiweiß und Petersilie bestreut servieren, dazu Brot zum Tunken. Das Gericht stammt aus der kastilischen Küche des 18. Jahrhunderts und ist ein klassisches Sonntagsessen in Madrid. Leichter: die Haut abziehen und die Mandeln auf 20 g reduzieren – die Sauce bindet trotzdem.',
    ], 'pollo en pepitoria'),
  r('rabo-de-toro', 'Rabo de toro (geschmorter Ochsenschwanz nach Art von Córdoba)', 'es', 'haupt', 270,
    '700 g Ochsenschwanz | 1 Stk Zwiebel | 2 Stk Möhre | 1 Stk Paprika rot | 3 Zehe Knoblauch | 1 Stk Tomate | 200 ml Rotwein | 300 ml Rinderfond | 30 ml Weinbrand | 1 EL Weizenmehl | 1 Blatt Lorbeerblatt | 2 Zweig Thymian | 2 EL Olivenöl | 250 g Kartoffeln festkochend | Salz | Pfeffer',
    [
      'Den Ochsenschwanz in Scheiben (beim Metzger vorbestellen, oft auch tiefgekühlt; in Córdoba nimmt man den Schwanz des Kampfstiers, hier ist Rind üblich) trocken tupfen, salzen, pfeffern und dünn mit Weizenmehl bestauben. Zwiebel, Möhren, Paprika und Knoblauch würfeln.',
      'Das Olivenöl in einem Bräter mit Deckel erhitzen und den Ochsenschwanz darin rundum 10 Minuten kräftig anbraten, herausnehmen.',
      'Den Backofen auf 160 °C Ober-/Unterhitze vorheizen. Im Bratfett das Gemüse anrösten, die Tomate hineinreiben und kurz einkochen. Mit dem Weinbrand (in Spanien Brandy de Jerez) und dem Rotwein ablöschen und etwas einkochen.',
      'Fleisch, Rinderfond, Lorbeer und Thymian in den Bräter geben – das Fleisch soll knapp bedeckt sein. Zugedeckt im Backofen bei 160 °C Ober-/Unterhitze 3,5 Stunden schmoren, nach der Hälfte die Stücke wenden.',
      'In den letzten 30 Minuten die Kartoffeln schälen, vierteln und 25 Minuten dämpfen.',
      'Garprobe: Das Fleisch löst sich mühelos vom Knochen. Die Stücke herausnehmen, die Sauce durch ein Sieb streichen oder pürieren und offen 10 Minuten sämig einkochen, abschmecken.',
      'Das Fleisch in der Sauce mit den Kartoffeln servieren – in Córdoba gibt es oft Pommes dazu. Rabo de toro schmeckt aufgewärmt noch besser: am Vortag schmoren, über Nacht kalt stellen und die feste Fettschicht abheben. Leichter: genau so entfetten (spart gut 100 kcal je Portion) und mehr Gemüse statt Kartoffeln.',
    ], 'rabo de toro'),
  r('carrillada-iberica-al-pedro-ximenez', 'Carrillada ibérica al Pedro Ximénez (Schweinebäckchen in süßer Sherrysauce mit Püree)', 'es', 'haupt', 180,
    '400 g Schweinebäckchen | 100 ml Sherry Pedro Ximénez | 250 ml Rinderfond | 1 Stk Zwiebel | 1 Stk Möhre | 2 Zehe Knoblauch | 1 Blatt Lorbeerblatt | 2 Zweig Thymian | 1 EL Weizenmehl | 1.5 EL Olivenöl | 400 g Kartoffeln mehligkochend | 80 ml Milch | 10 g Butter | Salz | Pfeffer',
    [
      'Die Schweinebäckchen von Sehnen und silbriger Haut befreien (Ibérico-Bäckchen gibt es bei spanischen Feinkost-Versänden und im Großmarkt, normale Schweinebäckchen beim Metzger vorbestellen). Salzen, pfeffern und im Weizenmehl wenden. Zwiebel, Möhre und Knoblauch fein würfeln.',
      'Das Olivenöl in einem Schmortopf erhitzen und die Bäckchen 6 Minuten rundum kräftig anbraten, herausnehmen. Das Gemüse im Bratfett 8 Minuten anrösten.',
      'Mit dem Pedro Ximénez ablöschen (ein sehr süßer, fast schwarzer Sherry aus getrockneten Trauben – Weinhandel oder online) und kurz einkochen. Bäckchen, Rinderfond, Lorbeer und Thymian zugeben, aufkochen und zugedeckt 2,5 Stunden ganz leise schmoren, ab und zu wenden.',
      'Für das Püree in den letzten 30 Minuten die Kartoffeln schälen, vierteln und 25 Minuten dämpfen. Mit der warmen Milch und der Butter zerstampfen und salzen.',
      'Garprobe: Die Bäckchen lassen sich mit dem Löffel teilen. Herausnehmen, Lorbeer und Thymian entfernen, die Sauce pürieren und offen 10 Minuten zu einer glänzenden, dicken Sauce einkochen; abschmecken.',
      'Die Bäckchen in der Sauce wenden und auf dem Püree anrichten. Leichter: statt Püree gedämpfte Kartoffeln ohne Butter und die Sauce vor dem Einkochen entfetten.',
    ], 'carrillada al pedro ximenez'),
  r('secreto-iberico-con-patatas-panaderas', 'Secreto ibérico con patatas panaderas (Ibérico-Schwein von der Plancha mit Bäckerinnen-Kartoffeln)', 'es', 'haupt', 70,
    '300 g Secreto ibérico | 500 g Kartoffeln festkochend | 1 Stk Zwiebel | 1 Stk Paprika grün | 2 Zehe Knoblauch | 50 ml Weißwein | 3 EL Olivenöl | 0.5 Bund Petersilie | Salz | Pfeffer',
    [
      'Den Backofen auf 180 °C Heißluft vorheizen. Die Kartoffeln schälen und in 3–4 mm dünne Scheiben schneiden, Zwiebel und Paprika in feine Streifen, den Knoblauch in Scheiben.',
      'Alles in einer Auflaufform mit 2 EL Olivenöl, Salz und Pfeffer mischen, den Weißwein und 50 ml Wasser angießen. Bei 180 °C Heißluft 45 Minuten garen und nach 20 Minuten einmal wenden – die „Panaderas“ (früher beim Bäcker in der Restwärme gegart) sollen weich sein und an den Rändern bräunen.',
      'Den Secreto 20 Minuten vor dem Braten aus dem Kühlschrank nehmen und trocken tupfen. Das „Geheimnis“ ist ein dünner, stark marmorierter Muskel zwischen Schulter und Rückenspeck des Ibérico-Schweins (spanische Feinkost-Versände, Großmarkt, oft tiefgekühlt); Ersatz: Schweinenacken in 1,5 cm dicken Scheiben.',
      'Eine Gusseisenpfanne (Plancha) ohne Fett sehr heiß werden lassen. Den Secreto am Stück mit dem restlichen Olivenöl einreiben und 3 Minuten je Seite kräftig bräunen; innen darf er bei Ibérico leicht rosa bleiben.',
      'Den Secreto 3 Minuten ruhen lassen, quer zur Faser in Streifen schneiden, mit grobem Salz und gehackter Petersilie bestreuen und auf den Kartoffeln servieren. Leichter: Schweinefilet statt Secreto (spart rund 250 kcal je Portion) und nur 1 EL Öl an die Kartoffeln.',
    ], 'secreto iberico'),
  r('cordero-al-chilindron', 'Cordero al chilindrón (Lammragout mit Paprika und Serrano aus Aragón)', 'es', 'haupt', 110,
    '450 g Lammschulter | 2 Stk Paprika rot | 1 Stk Zwiebel | 3 Zehe Knoblauch | 2 Stk Tomate | 40 g Serrano-Schinken | 2 Stk Ñoras getrocknet | 100 ml Weißwein | 1 TL Paprikapulver edelsüß | 1 Blatt Lorbeerblatt | 2 EL Olivenöl | Salz | Pfeffer',
    [
      'Die Ñoras (getrocknete runde Paprika; in Aragón nimmt man die ähnliche „Pimiento choricero“) entkernen und 30 Minuten in heißem Wasser einweichen. Danach das rote Fruchtfleisch mit einem Löffel von der Haut kratzen.',
      'Die Lammschulter von groben Fettstücken befreien, in 4 cm große Stücke schneiden, salzen und pfeffern. Paprika und Zwiebel in Streifen, Knoblauch in Scheiben und den Serrano-Schinken in feine Streifen schneiden.',
      'Das Olivenöl im Schmortopf erhitzen und das Lamm in zwei Portionen rundum kräftig anbraten, herausnehmen.',
      'Zwiebel, Paprika, Knoblauch und Serrano-Schinken im Bratfett 10 Minuten weich schmoren. Die Tomaten hineinreiben und 5 Minuten einkochen. Vom Herd ziehen, Paprikapulver und Ñora-Fruchtfleisch einrühren.',
      'Das Lamm zurück in den Topf geben, mit dem Weißwein ablöschen, den Lorbeer zugeben und zugedeckt 75 Minuten leise schmoren; nur so viel Wasser nachgießen, dass eine dicke Sauce bleibt. Garprobe: Das Fleisch lässt sich mit der Gabel zerteilen.',
      'Abschmecken und mit Brot servieren. Der Name kommt von einem alten Kartenspiel; in Aragón und Navarra wird so auch Huhn geschmort. Leichter: Lammkeule statt Schulter nehmen – sie ist deutlich magerer.',
    ], 'cordero al chilindron'),
  r('estofado-de-ternera', 'Estofado de ternera (spanischer Rindfleisch-Schmortopf mit Kartoffeln und Erbsen)', 'es', 'eintopf', 130,
    '500 g Rindergulasch | 400 g Kartoffeln festkochend | 2 Stk Möhre | 100 g Erbsen TK | 1 Stk Zwiebel | 2 Zehe Knoblauch | 1 Stk Tomate | 150 ml Rotwein | 300 ml Rinderfond | 1 Blatt Lorbeerblatt | 1 TL Paprikapulver edelsüß | 2 EL Olivenöl | Salz | Pfeffer',
    [
      'Das Rindergulasch (in Spanien nimmt man „Morcillo“ aus der Hesse oder „Aguja“ aus dem Nacken) trocken tupfen, salzen und pfeffern. Zwiebel und Knoblauch fein würfeln, die Möhren in Scheiben schneiden.',
      'Das Olivenöl in einem Schmortopf stark erhitzen und das Fleisch in zwei Portionen kräftig anbraten, herausnehmen.',
      'Zwiebel und Knoblauch im Bratfett glasig dünsten, die Tomate hineinreiben und kurz einkochen. Vom Herd ziehen, das Paprikapulver einrühren und sofort mit dem Rotwein ablöschen.',
      'Fleisch, Rinderfond, Möhren und Lorbeer zugeben, aufkochen und zugedeckt 75 Minuten leise schmoren.',
      'Die Kartoffeln schälen, in Stücke brechen (anschneiden und abbrechen – das bindet die Sauce) und zugeben, bei Bedarf so viel Wasser angießen, dass sie knapp bedeckt sind. Weitere 25 Minuten schmoren, in den letzten 5 Minuten die Erbsen zugeben.',
      'Garprobe: Fleisch und Kartoffeln sind weich. Abschmecken, Lorbeer entfernen und 10 Minuten ruhen lassen. Leichter: nur 250 g Kartoffeln und dafür mehr Möhren und Erbsen.',
    ], 'estofado de ternera'),
  r('solomillo-con-pimientos-asados', 'Solomillo de cerdo con pimientos asados (Schweinefilet mit gerösteter Paprika und Knoblauch)', 'es', 'haupt', 60,
    '400 g Schweinefilet | 3 Stk Paprika rot | 400 g Kartoffeln festkochend | 3 Zehe Knoblauch | 3 EL Olivenöl | 1 EL Sherryessig | Salz | Pfeffer',
    [
      'Den Backofen auf 200 °C Heißluft vorheizen. Die ganzen Paprika und die halbierten Kartoffeln mit Schale mit 1 EL Olivenöl einreiben, salzen und auf ein Blech legen.',
      'Bei 200 °C Heißluft 40 Minuten rösten, die Paprika nach der Hälfte wenden, bis die Haut schwarze Blasen wirft und die Kartoffeln weich sind.',
      'Die Paprika sofort in eine Schüssel legen, abdecken und 10 Minuten ziehen lassen – dann löst sich die Haut leicht. Häuten, entkernen und in Streifen zupfen, den Saft auffangen.',
      'Die Paprikastreifen mit dem Saft, dem in feine Scheiben geschnittenen Knoblauch, 1 EL Olivenöl, Sherryessig und Salz anmachen – so sind „Pimientos asados“ in Andalusien auch eine eigene Vorspeise und schmecken lauwarm am besten.',
      'Das Schweinefilet in 3 cm dicke Medaillons schneiden, leicht flach drücken, salzen und pfeffern. Eine Gusseisenpfanne (Plancha) sehr heiß werden lassen, die Medaillons mit dem restlichen Olivenöl einpinseln und 3 Minuten je Seite braten, bis sie innen gerade zartrosa sind.',
      'Die Medaillons 2 Minuten ruhen lassen und mit den Paprika und den Kartoffeln servieren.',
    ], 'pimientos asados solomillo'),
  r('pisto-manchego-con-huevo', 'Pisto manchego con huevo (Gemüseschmortopf aus La Mancha mit Spiegelei)', 'es', 'haupt', 60,
    '1 Stk Zucchini | 1 Stk Paprika rot | 1 Stk Paprika grün | 1 Stk Zwiebel | 2 Zehe Knoblauch | 5 Stk Tomate | 3 EL Olivenöl | 1 Prise Zucker | 4 Stk Ei | 2 Scheibe Weißbrot | Salz | Pfeffer',
    [
      'Die Tomaten halbieren und auf der groben Reibe reiben, die Haut bleibt in der Hand. Zwiebel, Paprika und Zucchini in 1 cm große Würfel schneiden, den Knoblauch hacken.',
      '2 EL Olivenöl in einer breiten Pfanne erhitzen und die Zwiebel mit dem Knoblauch glasig dünsten. Die Paprika zugeben und 10 Minuten weich schmoren.',
      'Die Zucchini zugeben und kurz mitschmoren, dann Tomaten, Zucker und Salz zugeben und offen 25 Minuten leise einkochen, ab und zu umrühren, bis das Pisto dick und fast marmeladig ist. Jedes Gemüse kommt nacheinander in die Pfanne – so behält es seinen eigenen Geschmack.',
      'Kurz vor dem Servieren die Eier im restlichen Olivenöl in einer zweiten Pfanne zu Spiegeleiern braten, bis das Eiweiß fest und das Eigelb noch flüssig ist (ca. 3 Minuten). Das Weißbrot rösten.',
      'Das Pisto mit Pfeffer abschmecken, auf Teller verteilen, je zwei Spiegeleier darauflegen und mit dem Brot servieren. In La Mancha bricht man das Eigelb auf und tunkt es mit Brot und Gemüse auf. Pisto hält im Kühlschrank 3 Tage und schmeckt warm wie kalt.',
    ], 'pisto manchego huevo'),
  r('huevos-rotos-con-jamon', 'Huevos rotos con jamón („zerbrochene Eier“ auf Kartoffeln mit Serrano-Schinken)', 'es', 'haupt', 40,
    '600 g Kartoffeln festkochend | 4 Stk Ei | 60 g Serrano-Schinken | 3 EL Olivenöl | Salz',
    [
      'Die Kartoffeln schälen, in 1 cm dicke Stäbchen schneiden, 10 Minuten wässern und gut trocken tupfen. Mit 2 EL Olivenöl und Salz mischen.',
      'Die Kartoffeln 22 Minuten goldbraun und knusprig backen, dabei zweimal schütteln. Klassisch werden sie in reichlich Olivenöl frittiert.',
      'In den letzten 5 Minuten das restliche Olivenöl in einer Pfanne erhitzen und die Eier darin braten, bis das Eiweiß fest und am Rand knusprig ist, das Eigelb aber flüssig bleibt (ca. 3 Minuten).',
      'Die Kartoffeln auf eine Platte geben, den Serrano-Schinken in Stücken darauf verteilen und die Spiegeleier obenauf legen. Am Tisch mit Messer und Gabel „zerbrechen“ – das Eigelb läuft über die Kartoffeln, darum geht es. Berühmt gemacht hat sie das Madrider Lokal „Casa Lucio“.',
    ], 'huevos rotos jamon'),
]

/** Neue Zutaten der Datei recipes-es2.ts (zentral eingetragen über src/data/extra/index.ts) */
export const es2Zutaten: ExtraIngredients = {
  catalog: {
    konserven: ['Kichererbsen getrocknet', 'Sherry Pedro Ximénez'],
    fleisch: ['Ochsenschwanz', 'Schweinebäckchen', 'Secreto ibérico'],
  },
  products: {
    'Kichererbsen getrocknet': prod(500, 'g', 1.79, 365, 180, 'Pck'),
    'Sherry Pedro Ximénez': prod(750, 'ml', 12.99, 730, 60, 'Flasche'),
    // beim Metzger vorbestellen oder TK (Kaufland, Metro)
    Ochsenschwanz: prod(1000, 'g', 14.99, 3, 1, 'Pck'),
    // normale Bäckchen beim Metzger, Ibérico-Bäckchen bei spanischen Feinkost-Versänden/Großmarkt
    Schweinebäckchen: prod(500, 'g', 7.99, 3, 1, 'Pck'),
    // spanische Feinkost-Versände, Metro, oft TK
    'Secreto ibérico': prod(500, 'g', 12.99, 3, 1, 'Pck'),
  },
  // je 100 g/ml: kcal, Eiweiß, Fett, Kohlenhydrate, Ballaststoffe (BLS/USDA bzw. Herstellerangaben, gerundet)
  nutrition: {
    'Kichererbsen getrocknet': [340, 19, 6, 44, 17],
    // Pedro Ximénez: ca. 15 % vol., 400 g Zucker je Liter
    'Sherry Pedro Ximénez': [245, 0.2, 0, 40, 0],
    // Gewicht mit Knochen: gut die Hälfte ist Fleisch
    Ochsenschwanz: [145, 10, 11, 0, 0],
    Schweinebäckchen: [170, 19, 10.5, 0, 0],
    'Secreto ibérico': [290, 16, 25, 0, 0],
  },
  grams: {},
}
