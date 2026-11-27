import { prod, r } from './define'
import type { ExtraIngredients } from './extra/types'

/**
 * Spanische Küche (Wischstapel) – Datei 1 von 2: REIS & PAELLA sowie FISCH & MEERESFRÜCHTE
 * (Paella valenciana, Paella de marisco, Arroz negro, Arroz a banda, Fideuà, Arroz al horno, Merluza en salsa verde,
 * Bacalao a la vizcaína, Zarzuela de mariscos, Suquet de peix …). Eintöpfe, Fleisch und Geflügel: src/data/recipes-es2.ts.
 *
 * Anlegen mit `r(id, 'Spanischer Titel (deutsche Erklärung)', 'es', art, minuten, zutaten, schritte, bildsuche)`, Mengen für
 * 2 Portionen. Paella für 2 = Paellapfanne 32 cm auf dem BORA mit Brücke; die große Pfanne (46 cm, Gasgrill, 6+ Portionen)
 * steht als „oder …“-Einstellung (`paella('46', …, { alt: true })`) daneben. Geräte-Schritte: src/data/device-steps/es.ts.
 *
 * Neue Zutaten NUR unten in `esZutaten` (Kategorie, Produkt, Nährwerte, Gewicht …) – sie werden zentral eingetragen
 * (src/data/extra/index.ts). Gemeinsame Spanien-Zutaten (Paellareis, Chorizo, Riesengarnelen mit Kopf TK,
 * Tintenfischringe TK, Tintenfischtinte, Kaninchenkeule, Ñoras getrocknet …): src/data/extra/zutaten-es.ts – nicht neu anlegen.
 * Regeln: docs/spanien-regeln.md (Paella-Regeln!) · Geräte: docs/geraete/paella-plancha.md.
 * Neue Fotos: Zeilen in scripts/fotos-neu-es.md („| id | Bildbeschreibung |“).
 */
export const recipesEs = [
  r('paella-valenciana', 'Paella valenciana (Paella mit Hähnchen, Kaninchen und Bohnen)', 'es', 'haupt', 75,
    '1 Stk Hähnchenschenkel | 150 g Kaninchenkeule | 150 g Grüne Bohnen | 0.5 Dose Weiße Bohnen | 1 Stk Tomate | 1 TL Paprikapulver edelsüß | 0.1 g Safranfäden | 2 Zweig Rosmarin | 2 EL Olivenöl | 140 g Paellareis | Salz',
    [
      'Hähnchenschenkel und Kaninchen mit Knochen in 4 bis 5 cm große Stücke hacken (oder vom Metzger hacken lassen) und salzen. Die grünen Bohnen putzen und in 4 cm lange Stücke brechen (Ersatz für die breiten „Ferraura“), die weißen Bohnen abspülen (Ersatz für die großen Limabohnen „Garrofó“). Die Tomate auf einer Reibe reiben, die Haut bleibt in der Hand. Die Safranfäden in 2 EL warmem Wasser einweichen.',
      'Das Olivenöl in der Paellapfanne (32 cm für 2 Personen) erhitzen und das Fleisch bei mittlerer Hitze 15 Minuten rundum langsam goldbraun anbraten – diese Bräune ist der Geschmack der Paella.',
      'Grüne und weiße Bohnen zugeben und 5 Minuten mitbraten. Alles an den Rand schieben, die geriebene Tomate in die Mitte geben und 3 Minuten einkochen (Sofrito), dann das Paprikapulver nur einige Sekunden darin anrösten – es verbrennt sehr schnell und wird bitter.',
      'Sofort 700 ml Wasser angießen (bis knapp unter die Nieten der Griffe), Safranfäden mit dem Einweichwasser zugeben, aufkochen und 20 Minuten kräftig köcheln lassen, damit eine kräftige Brühe entsteht. Abschmecken: leicht übersalzen, der Reis nimmt das Salz auf.',
      'Den Reis gleichmäßig in die Pfanne streuen, einmal mit dem Löffel verteilen – ab jetzt nicht mehr rühren. 10 Minuten bei starker, dann 8 Minuten bei kleiner Hitze garen, bis die Flüssigkeit aufgesogen ist; die Rosmarinzweige die letzten 5 Minuten obenauf legen.',
      'Für das „Socarrat“ (die begehrte, knusprig angeröstete Reisschicht am Boden) die Hitze zum Schluss 2 Minuten hochdrehen, bis es leise knistert und nach geröstetem Reis duftet – nicht verbrennen lassen.',
      'Vom Feuer nehmen, mit einem sauberen Küchentuch abdecken und 5 Minuten ruhen lassen. Rosmarin entfernen und direkt aus der Pfanne essen. Eine echte Paella valenciana hat weder Chorizo noch Meeresfrüchte, Erbsen oder Zwiebeln.',
    ], 'paella valenciana'),

  r('paella-de-marisco', 'Paella de marisco (Meeresfrüchte-Paella mit Garnelen, Muscheln und Tintenfisch)', 'es', 'haupt', 60,
    '6 Stk Riesengarnelen mit Kopf TK | 250 g Miesmuscheln | 150 g Tintenfischringe TK | 1 Stk Paprika rot | 2 Zehe Knoblauch | 1 Stk Tomate | 1 TL Paprikapulver edelsüß | 0.1 g Safranfäden | 500 ml Fischfond | 3 EL Olivenöl | 150 g Paellareis | 1 Stk Zitrone | Salz',
    [
      'Riesengarnelen und Tintenfischringe über Nacht im Kühlschrank auftauen lassen, abspülen und trocken tupfen. Die Miesmuscheln unter kaltem Wasser abbürsten und die Bärte abziehen; offene Muscheln, die sich beim Antippen nicht schließen, wegwerfen. Die Paprika in Streifen schneiden, den Knoblauch fein hacken, die Tomate auf einer Reibe reiben (die Haut bleibt in der Hand) und die Safranfäden in 2 EL warmem Wasser einweichen.',
      'Die Muscheln mit 100 ml Wasser in einem Topf zugedeckt bei starker Hitze 3 bis 4 Minuten garen, bis sie sich öffnen. Durch ein Sieb abgießen, den Muschelsud zum Fischfond geben; Muscheln, die geschlossen bleiben, wegwerfen.',
      'Das Olivenöl in der Paellapfanne (32 cm für 2 Personen) erhitzen. Die Garnelen 1 Minute je Seite anbraten und herausnehmen – sie garen später auf dem Reis fertig und geben ihr Aroma ans Öl ab. Die Tintenfischringe darin 3 Minuten braten, bis ihr Saft verdampft ist.',
      'Paprika und Knoblauch zugeben und 3 Minuten braten. Die geriebene Tomate zugeben und 5 Minuten einkochen, bis sie dunkel und dicklich ist (Sofrito). Das Paprikapulver nur einige Sekunden darin anrösten – es verbrennt sehr schnell und wird bitter.',
      'Sofort Fischfond mit Muschelsud angießen und mit Wasser auf 700 ml auffüllen, die Safranfäden mit dem Einweichwasser zugeben, aufkochen und 5 Minuten kräftig köcheln lassen. Abschmecken: leicht übersalzen, der Reis nimmt das Salz auf.',
      'Den Paellareis gleichmäßig einstreuen und einmal mit dem Löffel verteilen – ab jetzt nicht mehr rühren. 10 Minuten bei starker Hitze kochen, dann Garnelen und Muscheln mit der Öffnung nach oben in den Reis drücken und 8 Minuten bei kleiner Hitze garen, bis die Flüssigkeit aufgesogen ist. Garprobe: Das Reiskorn ist weich mit einem hauchdünnen Kern.',
      'Für das „Socarrat“ (die knusprig angeröstete Reisschicht am Boden) die Hitze zum Schluss 2 Minuten hochdrehen, bis es leise knistert und nach geröstetem Reis duftet – nicht verbrennen lassen.',
      'Vom Feuer nehmen, mit einem sauberen Küchentuch abdecken und 5 Minuten ruhen lassen. Mit Zitronenspalten direkt aus der Pfanne essen. In eine Paella de marisco gehören weder Chorizo noch Hähnchen – gemischt heißt sie „Paella mixta“.',
    ], 'paella de marisco'),

  r('arroz-negro', 'Arroz negro (schwarzer Reis mit Tintenfisch und Alioli)', 'es', 'haupt', 55,
    '300 g Tintenfischringe TK | 1 Stk Zwiebel | 1 Stk Paprika grün | 2 Zehe Knoblauch | 1 Stk Tomate | 1 Stk Ñoras getrocknet | 8 g Tintenfischtinte | 650 ml Fischfond | 2 EL Olivenöl | 150 g Paellareis | 40 ml Alioli | Salz',
    [
      'Die Tintenfischringe über Nacht im Kühlschrank auftauen lassen, trocken tupfen und halbieren. Original nimmt man Sepia mit ihrem Tintenbeutel (Fischhändler, Asia-Markt); die Tintenfischtinte gibt es in kleinen Tütchen beim Fischhändler und im spanischen Feinkostversand. Zwiebel und Paprika fein würfeln, den Knoblauch hacken, die Tomate reiben. Die Ñora (kleine, süße getrocknete Paprika aus Murcia) aufbrechen und die Kerne ausschütteln.',
      'Das Olivenöl in der Paellapfanne (32 cm) erhitzen, die Ñora darin 30 Sekunden anbraten – sie darf nicht schwarz werden – und herausnehmen. Mit 2 EL Fischfond im Mörser oder Mini-Hacker zu einer Paste zerreiben. Den Tintenfisch im Öl 5 Minuten braten, bis der Saft verdampft ist und er leicht Farbe nimmt.',
      'Zwiebel und Paprika zugeben und 8 Minuten weich braten, dann Knoblauch, geriebene Tomate und Ñora-Paste zugeben und 4 Minuten einkochen (Sofrito).',
      'Den Fischfond angießen, die Tintenfischtinte in einer Kelle Fond auflösen und dazugießen. Aufkochen, 5 Minuten köcheln lassen und kräftig abschmecken (leicht übersalzen).',
      'Den Paellareis gleichmäßig einstreuen und einmal verteilen – ab jetzt nicht mehr rühren. 10 Minuten bei starker, dann 8 Minuten bei kleiner Hitze garen, bis die Flüssigkeit aufgesogen ist.',
      'Für das Socarrat die Hitze 2 Minuten hochdrehen, bis es leise knistert.',
      'Vom Feuer nehmen, mit einem Tuch abdecken und 5 Minuten ruhen lassen. Mit Alioli (am besten selbstgemacht) aus der Pfanne essen – erst die Alioli macht den Arroz negro rund.',
    ], 'arroz negro'),

  r('arroz-a-banda', 'Arroz a banda (Reis aus Alicante im kräftigen Fischsud, mit Alioli)', 'es', 'haupt', 50,
    '200 g Tintenfischringe TK | 150 g Garnelen roh TK | 1 Stk Ñoras getrocknet | 3 Zehe Knoblauch | 1 Stk Tomate | 1 TL Paprikapulver edelsüß | 0.1 g Safranfäden | 650 ml Fischfond | 2 EL Olivenöl | 150 g Paellareis | 40 ml Alioli | Salz',
    [
      '„A banda“ heißt „getrennt“: Die Fischer von Alicante kochten den Fisch in einem Sud, aßen ihn als eigenen Gang und garten den Reis im Sud. Heute kommen kleine, geschälte Meeresfrüchte in den Reis – nichts mit Schale, alles wird mit dem Löffel gegessen. Tintenfischringe und Garnelen über Nacht im Kühlschrank auftauen lassen, trocken tupfen und den Tintenfisch in kleine Stücke schneiden. Knoblauch hacken, die Tomate reiben, die Ñora entkernen und die Safranfäden in 2 EL warmem Wasser einweichen.',
      'Das Olivenöl in der Paellapfanne (32 cm) erhitzen, die Ñora 30 Sekunden anbraten, herausnehmen und mit dem Knoblauch und 2 EL Fischfond im Mörser oder Mini-Hacker zu einer Paste zerreiben. Den Tintenfisch im Öl 4 Minuten braten, die Garnelen zugeben und 1 Minute mitbraten.',
      'Die geriebene Tomate zugeben und 4 Minuten einkochen, die Ñora-Knoblauch-Paste unterrühren und das Paprikapulver nur einige Sekunden anrösten (Sofrito).',
      'Sofort den Fischfond und die Safranfäden mit dem Einweichwasser angießen, aufkochen und 3 Minuten köcheln lassen. Kräftig abschmecken (leicht übersalzen).',
      'Den Paellareis einstreuen und einmal verteilen – die Reisschicht ist beim Arroz a banda dünn, nur etwa einen Finger hoch. Ab jetzt nicht mehr rühren: 10 Minuten bei starker, dann 7 Minuten bei kleiner Hitze garen, bis die Flüssigkeit aufgesogen ist.',
      'Für das Socarrat die Hitze 2 Minuten hochdrehen, bis es leise knistert.',
      'Vom Feuer nehmen, mit einem Tuch abdecken und 5 Minuten ruhen lassen. Mit Alioli servieren (selbstgemacht schmeckt am besten).',
    ], 'arroz a banda'),

  r('fideua', 'Fideuà (Nudel-Paella mit Meeresfrüchten aus Gandia)', 'es', 'haupt', 45,
    '180 g Spaghetti | 6 Stk Riesengarnelen mit Kopf TK | 150 g Tintenfischringe TK | 1 Stk Ñoras getrocknet | 2 Zehe Knoblauch | 1 Stk Tomate | 1 TL Paprikapulver edelsüß | 0.1 g Safranfäden | 500 ml Fischfond | 2 EL Olivenöl | 40 ml Alioli | Salz',
    [
      'Riesengarnelen und Tintenfischringe über Nacht im Kühlschrank auftauen lassen und trocken tupfen. Die Spaghetti in ein Küchentuch wickeln und über der Tischkante in 2 bis 3 cm lange Stücke brechen – Ersatz für die kurzen dünnen „Fideos Nr. 2“ (spanische Feinkost: „Fideos para fideuà“). Die Ñora entkernen und in 100 ml heißem Fischfond 15 Minuten einweichen, dann das Fruchtfleisch mit einem Messer von der Haut schaben. Knoblauch hacken, die Tomate reiben, die Safranfäden in den restlichen Fischfond geben und den Fond erhitzen.',
      'Das Olivenöl in der Paellapfanne (32 cm) erhitzen, die Garnelen 1 Minute je Seite anbraten und herausnehmen. Die Tintenfischringe 3 Minuten braten, an den Rand schieben und die Nudelstücke in der Mitte unter Wenden 3 Minuten goldbraun rösten – so bleiben sie später bissfest.',
      'Knoblauch, geriebene Tomate und Ñora-Fruchtfleisch zugeben und 4 Minuten einkochen (Sofrito), dann das Paprikapulver nur einige Sekunden anrösten.',
      'Den heißen Fond samt Einweichfond angießen und einmal verteilen – ab jetzt nicht mehr rühren. 8 Minuten bei starker Hitze kochen, die Garnelen auflegen und 4 Minuten bei kleiner Hitze garen, bis die Flüssigkeit aufgesogen ist.',
      'Die Hitze 2 Minuten hochdrehen, bis es am Boden leise knistert (Socarrat) und sich die Nudelenden an der Oberfläche aufstellen („de punta“).',
      'Vom Feuer nehmen, mit einem Tuch abdecken und 3 Minuten ruhen lassen. Mit Alioli servieren – in Gandia gehört sie immer dazu.',
    ], 'fideua'),

  r('arroz-caldoso-de-marisco', 'Arroz caldoso de marisco (saftiger Meeresfrüchte-Reis im Sud)', 'es', 'haupt', 50,
    '6 Stk Riesengarnelen mit Kopf TK | 250 g Miesmuscheln | 150 g Tintenfischringe TK | 1 Stk Zwiebel | 1 Stk Paprika rot | 2 Zehe Knoblauch | 1 Stk Tomate | 1 Stk Ñoras getrocknet | 0.1 g Safranfäden | 40 ml Weinbrand | 900 ml Fischfond | 2 EL Olivenöl | 140 g Paellareis | 0.5 Bund Petersilie | Salz',
    [
      'Riesengarnelen und Tintenfischringe über Nacht im Kühlschrank auftauen lassen. Die Garnelen bis auf das Schwanzende schälen, Köpfe und Schalen aufheben. Die Miesmuscheln abbürsten und entbarten (offene, die sich nicht schließen, wegwerfen). Zwiebel und Paprika fein würfeln, Knoblauch hacken, die Tomate reiben. Die Ñora entkernen und in einer Tasse heißem Wasser einweichen, die Safranfäden in 2 EL warmem Wasser.',
      'In einem breiten Topf 1 EL Olivenöl erhitzen, Garnelenköpfe und -schalen darin 3 Minuten kräftig rösten und die Köpfe dabei andrücken. Mit dem Fischfond ablöschen, 10 Minuten köcheln lassen und durch ein Sieb gießen – das ist die Seele des Gerichts.',
      'Den Topf auswischen, das restliche Öl erhitzen und die Tintenfischringe 4 Minuten anbraten. Zwiebel und Paprika zugeben und 8 Minuten weich braten, dann Knoblauch, geriebene Tomate und das abgeschabte Ñora-Fruchtfleisch 4 Minuten einkochen (Sofrito).',
      'Den Weinbrand angießen und fast vollständig einkochen lassen. Den Paellareis zugeben, 1 Minute im Sofrito wenden, dann den heißen Fond und die Safranfäden mit dem Einweichwasser angießen und aufkochen. Abschmecken.',
      'Bei mittlerer Hitze 16 Minuten köcheln lassen und ab und zu umrühren – anders als bei der Paella darf man hier, der Reis soll in reichlich Brühe schwimmen. Nach 10 Minuten Muscheln und Garnelen hineinlegen. Garprobe: Der Reis ist bissfest, im Topf ist noch viel Brühe.',
      'Die Petersilie hacken und darüberstreuen, 2 Minuten ruhen lassen und sofort in tiefen Tellern servieren – der Reis saugt sonst die Brühe auf. Für ein Fest nimmt man in Spanien einen halbierten Hummer („bogavante“) statt der Garnelen.',
    ], 'arroz caldoso marisco'),

  r('arroz-al-horno', 'Arroz al horno (Ofenreis aus Valencia mit Schweinebauch, Blutwurst und Kichererbsen)', 'es', 'haupt', 80,
    '120 g Schweinebauch | 100 g Blutwurst | 0.5 Dose Kichererbsen | 150 g Kartoffeln festkochend | 2 Stk Tomate | 10 Zehe Knoblauch | 1 TL Paprikapulver edelsüß | 0.1 g Safranfäden | 400 ml Hühnerbrühe | 1 EL Olivenöl | 140 g Paellareis | Salz',
    [
      'Den Backofen auf 220 °C Ober-/Unterhitze vorheizen. Die Kichererbsen abspülen. Die Kartoffel schälen und in 5 mm dicke Scheiben schneiden. Den Schweinebauch in 3 cm große Stücke, die Blutwurst in 2 cm dicke Scheiben schneiden (Original: Morcilla de cebolla mit Zwiebeln aus der spanischen Feinkost; Blutwurst ist der übliche Ersatz). Eine Tomate halbieren, die andere reiben. Vom Knoblauch (eine ganze Knolle, etwa 10 Zehen) nur die lose Außenschale abreiben, die Knolle bleibt ganz. Die Safranfäden in die Hühnerbrühe geben und die Brühe erhitzen – traditionell nimmt man die Brühe vom Vortags-Eintopf (Cocido).',
      'Das Olivenöl in einer Pfanne erhitzen und den Schweinebauch 8 Minuten rundum goldbraun braten. Die Kartoffelscheiben 4 Minuten mitbraten, dann die Blutwurst nur 1 Minute je Seite (sie zerfällt leicht) und alles herausnehmen. Knoblauchknolle und Tomatenhälften mit der Schnittfläche nach unten kurz anbraten.',
      'Die geriebene Tomate im Bratfett 3 Minuten einkochen, das Paprikapulver nur einige Sekunden anrösten, dann den Paellareis und die Kichererbsen 1 Minute darin wenden.',
      'Die Reismischung in einer flachen ofenfesten Form (Cazuela aus Ton oder Auflaufform, ca. 26 cm) verteilen und die heiße Brühe angießen. Knoblauchknolle in die Mitte setzen, Tomatenhälften, Kartoffeln, Schweinebauch und Blutwurst darauf legen. Im Backofen 20 Minuten garen, ohne zu rühren, bis die Brühe aufgesogen ist und die Oberfläche trocken und leicht geröstet ist. Garprobe: Reis weich mit kaum Biss.',
      '5 Minuten ruhen lassen und in der Form servieren; die weichen Knoblauchzehen aus der Schale drücken und mit dem Reis essen.',
    ], 'arroz al horno'),

  r('merluza-en-salsa-verde', 'Merluza en salsa verde (Seehecht in grüner Knoblauch-Petersilien-Sauce mit Venusmuscheln)', 'es', 'haupt', 45,
    '350 g Kabeljaufilet | 250 g Venusmuscheln | 4 Zehe Knoblauch | 1 Bund Petersilie | 1 EL Weizenmehl | 100 ml Weißwein | 200 ml Fischfond | 3 EL Olivenöl | 50 g Erbsen TK | 1 Stk Ei | 400 g Kartoffeln festkochend | Salz',
    [
      'Die Venusmuscheln 30 Minuten in kaltem Salzwasser liegen lassen, damit sie Sand ausspucken, dann abspülen. Seehecht (Merluza – an der Fischtheke oder tiefgekühlt) ist das Original; Kabeljau ist der übliche Ersatz. Den Fisch in 2 dicke Stücke schneiden und salzen. Den Knoblauch fein hacken, die Petersilie sehr fein hacken. Die Kartoffeln schälen und vierteln.',
      'Kartoffeln in Salzwasser 20 bis 25 Minuten garen, das Ei 10 Minuten hart kochen, abschrecken und schälen.',
      'Das Olivenöl in einer breiten Pfanne oder Cazuela bei kleiner Hitze erwärmen und den Knoblauch 2 Minuten darin ziehen lassen, ohne dass er Farbe nimmt. Das Mehl einstreuen und 1 Minute anschwitzen, mit Weißwein und Fischfond ablöschen und unter Rühren aufkochen.',
      'Den Fisch mit der Hautseite nach oben in die Sauce legen, Muscheln und Erbsen dazugeben und 7 Minuten sanft köcheln lassen; den Fisch nach 4 Minuten wenden. Dabei die Pfanne immer wieder hin und her schwenken („meneo“) – die Gelatine aus dem Fisch bindet so die Sauce. Garprobe: Der Fisch ist innen gerade weiß und blättert, die Muscheln sind offen (geschlossene wegwerfen).',
      'Die Petersilie unterschwenken, das Ei vierteln und dazulegen und mit den Kartoffeln servieren.',
    ], 'merluza salsa verde'),

  r('bacalao-a-la-vizcaina', 'Bacalao a la vizcaína (Klippfisch in baskischer Paprika-Zwiebel-Sauce)', 'es', 'haupt', 80,
    '400 g Klippfisch | 4 Stk Ñoras getrocknet | 3 Stk Zwiebel | 2 Zehe Knoblauch | 30 g Serrano-Schinken | 1 Scheibe Weißbrot | 3 EL Olivenöl | 400 g Kartoffeln festkochend | Salz',
    [
      '36 bis 48 Stunden vorher den Klippfisch (Bacalao: gesalzener, getrockneter Kabeljau – portugiesische oder spanische Lebensmittelläden, Feinkostversand; am besten dicke Rückenstücke, „Lomos“) abspülen und mit der Haut nach oben in reichlich kaltem Wasser im Kühlschrank wässern; das Wasser 3- bis 4-mal am Tag wechseln. Probe: Ein kleines Stück schmeckt nur noch angenehm salzig. In 2 Portionsstücke teilen, Gräten zupfen und trocken tupfen.',
      'Die Ñoras entkernen und 30 Minuten in 300 ml heißem Wasser einweichen (Ersatz für die großen baskischen „Pimientos choriceros“; noch echter ist „Carne de pimiento choricero“ aus dem Glas). Die Zwiebeln in feine Streifen schneiden, den Knoblauch hacken, den Schinken klein würfeln.',
      '2 EL Olivenöl in einem Topf erhitzen, Zwiebeln, Knoblauch und Schinken zugeben und zugedeckt bei kleiner Hitze 40 Minuten weich und süß schmoren – sie sollen nicht braun werden.',
      'Das Fruchtfleisch der Ñoras mit einem Messer von der Haut schaben. Mit dem gewürfelten Weißbrot und 200 ml Einweichwasser zu den Zwiebeln geben, 10 Minuten köcheln lassen, fein pürieren und durch ein Sieb streichen. Die Sauce ist rotbraun, süßlich und sämig. Erst jetzt abschmecken, der Fisch salzt mit.',
      'Inzwischen die Kartoffeln schälen, vierteln und in Salzwasser 20 bis 25 Minuten garen.',
      'Das restliche Öl in einer flachen Pfanne erwärmen und den Fisch mit der Haut nach unten bei kleiner Hitze 4 Minuten braten, wenden und 2 Minuten weiterbraten. Die Sauce angießen, den Fisch mit der Haut nach oben hineinlegen und zugedeckt 8 Minuten sanft ziehen lassen, die Pfanne ab und zu schwenken. Garprobe: Der Fisch zerfällt in große, glasige Blätter.',
      'Mit den Kartoffeln servieren.',
    ], 'bacalao vizcaina'),

  r('zarzuela-de-mariscos', 'Zarzuela de mariscos (katalanischer Fisch- und Meeresfrüchtetopf mit Mandel-Picada)', 'es', 'haupt', 60,
    '250 g Seelachsfilet | 6 Stk Riesengarnelen mit Kopf TK | 300 g Miesmuscheln | 150 g Tintenfischringe TK | 1 Stk Zwiebel | 2 Zehe Knoblauch | 2 Stk Tomate | 1 TL Paprikapulver edelsüß | 0.1 g Safranfäden | 40 ml Weinbrand | 100 ml Weißwein | 300 ml Fischfond | 15 g Mandeln | 1 Scheibe Weißbrot | 0.5 Bund Petersilie | 1 EL Weizenmehl | 3 EL Olivenöl | Salz',
    [
      'Riesengarnelen und Tintenfischringe über Nacht im Kühlschrank auftauen lassen. Die Miesmuscheln abbürsten und entbarten (offene, die sich nicht schließen, wegwerfen). Den Seelachs (klassisch Seeteufel – teurer, aber sehr fest) in 4 cm große Stücke schneiden, salzen und dünn in Mehl wenden. Zwiebel fein würfeln, Knoblauch hacken, die Tomaten reiben, die Safranfäden in 2 EL warmem Wasser einweichen.',
      'Für die Picada (katalanische Würzpaste, die die Sauce bindet) 1 EL Olivenöl in einer breiten Pfanne oder Cazuela erhitzen und Mandeln und Brotscheibe darin 3 Minuten goldbraun rösten. Herausnehmen und mit 1 Knoblauchzehe, der Hälfte der Petersilie, den Safranfäden samt Wasser und 2 EL Fischfond im Mörser oder Mini-Hacker zu einer Paste zerreiben.',
      'Das restliche Öl erhitzen, den Fisch 1 Minute je Seite anbraten, die Garnelen 1 Minute je Seite, dann die Tintenfischringe 2 Minuten – alles herausnehmen, es gart später in der Sauce fertig.',
      'Zwiebel 6 Minuten weich braten, restlichen Knoblauch und die geriebenen Tomaten zugeben und 5 Minuten einkochen, das Paprikapulver nur einige Sekunden anrösten. Mit dem Weinbrand ablöschen und einkochen lassen, dann den Weißwein angießen und 2 Minuten einkochen.',
      'Fischfond und Picada einrühren, 5 Minuten köcheln lassen und abschmecken. Die Muscheln zugeben und zugedeckt garen, bis sie sich öffnen, dann Fisch, Garnelen und Tintenfisch hineinlegen und alles zusammen 6 Minuten zugedeckt sanft ziehen lassen. Garprobe: Fisch innen gerade weiß, Muscheln offen (geschlossene wegwerfen).',
      'Mit der restlichen gehackten Petersilie bestreuen und in der Pfanne servieren.',
    ], 'zarzuela mariscos'),

  r('suquet-de-peix', 'Suquet de peix (katalanischer Fischeintopf mit Kartoffeln und Picada)', 'es', 'eintopf', 50,
    '300 g Seelachsfilet | 150 g Garnelen roh TK | 400 g Kartoffeln festkochend | 3 Zehe Knoblauch | 1 Stk Tomate | 1 Stk Ñoras getrocknet | 1 TL Paprikapulver edelsüß | 500 ml Fischfond | 15 g Mandeln | 1 Scheibe Weißbrot | 0.5 Bund Petersilie | 3 EL Olivenöl | Salz',
    [
      'Die Ñora entkernen und 20 Minuten in heißem Wasser einweichen, die Garnelen im Kühlschrank auftauen lassen. Den Seelachs (die Fischer der Costa Brava nehmen Drachenkopf, Seeteufel oder Knurrhahn; Kabeljau geht auch) in große Stücke schneiden und salzen. Die Kartoffeln schälen und „chascar“: mit dem Messer etwas einschneiden und das Stück abbrechen – die rauen Kanten geben Stärke ab und binden die Brühe. Die Tomate reiben.',
      'Das Olivenöl in einem breiten Topf erhitzen und 2 ganze Knoblauchzehen, die Mandeln und die Brotscheibe darin 3 Minuten goldbraun rösten. Herausnehmen und mit der Petersilie und dem abgeschabten Ñora-Fruchtfleisch im Mörser oder Mini-Hacker zur Picada zerreiben.',
      'Die restliche Knoblauchzehe hacken und mit der geriebenen Tomate im Öl 4 Minuten einkochen, das Paprikapulver nur einige Sekunden anrösten. Die Kartoffeln 2 Minuten darin wenden, den Fischfond angießen, aufkochen und 15 Minuten köcheln lassen, bis die Kartoffeln fast weich sind.',
      'Die Picada einrühren und abschmecken. Fisch und Garnelen auf die Kartoffeln legen und zugedeckt 6 Minuten sanft ziehen lassen; den Topf schwenken statt umzurühren, damit der Fisch nicht zerfällt. Garprobe: Der Fisch ist innen gerade weiß.',
      '2 Minuten ruhen lassen und im Topf servieren – „suc“ heißt Saft: Die gebundene Brühe wird mit Brot aufgetunkt.',
    ], 'suquet de peix'),

  r('dorada-a-la-sal', 'Dorada a la sal (Dorade in der Salzkruste)', 'es', 'haupt', 55,
    '800 g Dorade ganz | 2000 g Meersalz grob | 1 Stk Zitrone | 2 Blatt Lorbeerblatt | 0.5 Bund Petersilie | 1 Zehe Knoblauch | 400 g Kartoffeln festkochend | 3 EL Olivenöl',
    [
      'Den Backofen auf 200 °C Ober-/Unterhitze vorheizen. Die 2 Doraden (je ca. 400 g) beim Fischhändler ausnehmen, aber nicht schuppen lassen – die Schuppen schützen das Fleisch vor dem Salz. Abspülen, trocken tupfen und in jeden Bauch 2 Zitronenscheiben, 1 Lorbeerblatt und ein paar Petersilienstiele legen.',
      'Das grobe Meersalz mit etwa 150 ml Wasser mischen, bis es sich wie nasser Sand formen lässt. Ein Blech mit Backpapier belegen, ein 1 cm dickes Salzbett aufstreichen, die Fische darauflegen und mit dem restlichen Salz vollständig bedecken und andrücken.',
      'Im Backofen 25 Minuten garen. Gleichzeitig die Kartoffeln schälen, vierteln und in Salzwasser 20 bis 25 Minuten kochen. Garprobe Fisch: Ein Holzspieß gleitet durch die Kruste an der dicksten Stelle ohne Widerstand.',
      'Die restliche Petersilie und den Knoblauch fein hacken und mit Olivenöl und dem Saft der übrigen Zitrone verrühren („ajo y perejil“).',
      'Die Kruste am Tisch mit dem Messerrücken aufklopfen und abheben, die Haut abziehen und die Filets von der Gräte heben. Mit Kartoffeln und dem Knoblauch-Petersilien-Öl servieren – der Fisch ist durch die Kruste saftig und genau richtig gesalzen.',
    ], 'dorada a la sal'),

  r('calamares-en-su-tinta', 'Calamares en su tinta (Tintenfisch in schwarzer Sauce mit Reis)', 'es', 'haupt', 60,
    '400 g Tintenfischringe TK | 2 Stk Zwiebel | 1 Stk Paprika grün | 2 Zehe Knoblauch | 1 Stk Tomate | 8 g Tintenfischtinte | 100 ml Weißwein | 150 ml Fischfond | 1 Scheibe Weißbrot | 3 EL Olivenöl | 120 g Langkornreis | Salz',
    [
      'Die Tintenfischringe über Nacht im Kühlschrank auftauen lassen und trocken tupfen. Im Baskenland nimmt man kleine ganze Kalmare („chipirones“) vom Fischhändler, hackt die Tentakel und füllt sie in die Tuben. Zwiebeln und Paprika fein würfeln, Knoblauch hacken, die Tomate reiben, das Brot würfeln.',
      '2 EL Olivenöl in einem Topf stark erhitzen, den Tintenfisch 4 Minuten scharf anbraten und herausnehmen.',
      'Das restliche Öl in den Topf geben, Zwiebeln und Paprika bei kleiner Hitze 15 Minuten weich und süß braten, dann Knoblauch, geriebene Tomate und Brot zugeben und 5 Minuten einkochen.',
      'Den Tintenfisch zurück in den Topf geben, mit Weißwein ablöschen und 2 Minuten einkochen. Die Tintenfischtinte im Fischfond auflösen, angießen und zugedeckt bei kleiner Hitze 25 Minuten schmoren, bis der Tintenfisch zart ist.',
      'Inzwischen den Reis mit 180 ml Wasser und etwas Salz zugedeckt 20 Minuten bei kleiner Hitze garen.',
      'Den Tintenfisch herausheben, die Sauce mit dem Stabmixer fein pürieren, abschmecken und den Tintenfisch darin 2 Minuten erhitzen. Mit dem Reis servieren – klassisch als weißer Reisring neben der tiefschwarzen Sauce.',
    ], 'calamares en su tinta'),

  r('marmitako', 'Marmitako (baskischer Thunfisch-Kartoffel-Eintopf)', 'es', 'eintopf', 50,
    '300 g Thunfischsteak TK | 500 g Kartoffeln festkochend | 1 Stk Zwiebel | 1 Stk Paprika grün | 2 Stk Ñoras getrocknet | 2 Zehe Knoblauch | 1 Stk Tomate | 600 ml Fischfond | 2 EL Olivenöl | 0.5 Bund Petersilie | Salz',
    [
      'Die Thunfischsteaks über Nacht im Kühlschrank auftauen lassen (Original: weißer Thun, „Bonito del Norte“, im Sommer frisch an der Fischtheke), in 3 cm große Würfel schneiden, salzen und kalt stellen. Die Ñoras entkernen und 20 Minuten in heißem Wasser einweichen (Ersatz für die baskischen „Pimientos choriceros“). Zwiebel und Paprika würfeln, Knoblauch hacken, die Tomate reiben. Die Kartoffeln schälen und „chascar“: einschneiden und in Stücke brechen, damit sie Stärke abgeben und die Brühe binden.',
      'Das Olivenöl in einem Topf erhitzen und Zwiebel, Paprika und Knoblauch 10 Minuten weich braten.',
      'Die geriebene Tomate und das abgeschabte Ñora-Fruchtfleisch zugeben und 4 Minuten einkochen. Die Kartoffeln 2 Minuten darin wenden, den Fischfond angießen, aufkochen und 20 Minuten köcheln lassen, bis die Kartoffeln weich sind und die Brühe leicht gebunden ist. Abschmecken.',
      'Den Herd ausschalten, die Thunfischwürfel in die heiße Brühe geben und zugedeckt 5 Minuten ziehen lassen – so bleibt der Thunfisch saftig und innen zart rosa; gekocht wird er trocken.',
      'Mit gehackter Petersilie bestreuen und im Topf servieren.',
    ], 'marmitako'),
]

/** Neue Zutaten der Datei recipes-es.ts (zentral eingetragen über src/data/extra/index.ts) */
export const esZutaten: ExtraIngredients = {
  catalog: {
    fleisch: ['Klippfisch', 'Dorade ganz'],
    tk: ['Thunfischsteak TK'],
    vorrat: ['Meersalz grob'],
  },
  products: {
    // Bacalao: gesalzener, getrockneter Kabeljau (Lomos), vor dem Kochen 36–48 h wässern
    Klippfisch: prod(400, 'g', 9.99, 180, 7, 'Pck'),
    'Dorade ganz': prod(400, 'g', 5.99, 2, 1, 'Stk'),
    'Thunfischsteak TK': prod(250, 'g', 5.99, 180, 180, 'Pck'),
    'Meersalz grob': prod(1000, 'g', 0.99, 1460, 1460, 'Pck'),
  },
  // je 100 g: kcal, Eiweiß, Fett, Kohlenhydrate, Ballaststoffe
  nutrition: {
    // Einkaufsgewicht (halbtrocken gesalzen); nach dem Wässern ca. 75 kcal je 100 g
    Klippfisch: [130, 29, 1, 0, 0],
    // ganzer Fisch mit Kopf und Gräten: gut die Hälfte ist Filet
    'Dorade ganz': [62, 10, 2.3, 0, 0],
    'Thunfischsteak TK': [110, 24, 1, 0, 0],
    'Meersalz grob': [0, 0, 0, 0, 0],
  },
  grams: {
    'Dorade ganz': { Stk: 400 },
  },
  nonVeg: ['Thunfischsteak TK'],
}
