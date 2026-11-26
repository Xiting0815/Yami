import type { DeviceStep } from '../../types'
import { bora, gasgrill, paella, vzug } from '../device-helpers'

/**
 * Geräte-Schritte (Rezept-ID → Schritte), Gruppe: es (Spanisch, Reis & Paella, Fisch & Meeresfrüchte – src/data/recipes-es.ts).
 * Paella für 2: `paella('32', …)` auf dem BORA mit Brücke; die große Pfanne für Gäste als „oder …“: `paella('46', …, { alt: true })`
 * nach einem `{ ...gasgrill('Vorheizen', …), alt: true }`. Nach der Reiszugabe nie „rühren“ schreiben (check-data meldet es).
 * Stil siehe docs/geraete/regeln.md, Geräte docs/geraete/paella-plancha.md.
 */
/** große Paellapfanne (46 cm, Gasgrill, Deckel offen) als „oder …“ neben der 32-cm-Pfanne */
const gross = (mode: Parameters<typeof paella>[1], o: Omit<Parameters<typeof paella>[2] & object, 'alt'> = {}) => paella('46', mode, { ...o, alt: true })
/** Gasgrill vorheizen für die große Pfanne (Deckel zu, danach offen) */
const grillVorheizen = { ...gasgrill('Vorheizen', 260, 'hoch', 'alle', { minutes: 10, note: 'große Pfanne 46 cm: Deckel zu, danach offen' }), alt: true }

export const DEVICE_STEPS: Record<string, DeviceStep[]> = {
  'paella-valenciana': [
    {
      text: 'Hähnchenschenkel und Kaninchen mit Knochen in 4 bis 5 cm große Stücke hacken (oder vom Metzger hacken lassen) und salzen. Die grünen Bohnen putzen und in 4 cm lange Stücke brechen (Ersatz für die breiten „Ferraura“), die weißen Bohnen abspülen (Ersatz für die großen Limabohnen „Garrofó“). Die Tomate auf einer Reibe reiben, die Haut bleibt in der Hand. Die Safranfäden in 2 EL warmem Wasser einweichen.',
    },
    {
      text: 'Die Paellapfanne (32 cm) auf den BORA setzen und beide Kochzonen mit der Brücke koppeln – für die große Runde stattdessen den Gasgrill vorheizen und dann den Deckel öffnen. Das Olivenöl erhitzen und das Fleisch 15 Minuten rundum langsam goldbraun anbraten – diese Bräune ist der Geschmack der Paella.',
      settings: [
        paella('32', 'Anbraten', { level: '6', minutes: 15 }),
        { ...gasgrill('Vorheizen', 260, 'hoch', 'alle', { minutes: 10, note: 'große Pfanne 46 cm: Deckel zu, danach offen' }), alt: true },
        paella('46', 'Anbraten', { level: 'mittel', minutes: 15, alt: true, note: 'große Runde 6–8 Personen: alle Mengen ×3' }),
      ],
    },
    {
      text: 'Grüne und weiße Bohnen zugeben und 5 Minuten mitbraten. Alles an den Rand schieben, die geriebene Tomate in die Mitte geben und 3 Minuten einkochen (Sofrito), dann das Paprikapulver nur einige Sekunden darin anrösten – es verbrennt sehr schnell und wird bitter.',
      settings: [paella('32', 'Sofrito', { level: '5', minutes: 8 }), paella('46', 'Sofrito', { level: 'mittel', minutes: 8, alt: true })],
    },
    {
      text: 'Sofort 700 ml Wasser angießen (bis knapp unter die Nieten der Griffe; große Pfanne ca. 2,1 Liter), Safranfäden mit dem Einweichwasser zugeben, aufkochen und 20 Minuten kräftig köcheln lassen, damit eine kräftige Brühe entsteht. Abschmecken: leicht übersalzen, der Reis nimmt das Salz auf.',
      settings: [paella('32', 'Köcheln', { level: '8', minutes: 20 }), paella('46', 'Köcheln', { level: 'hoch', minutes: 20, alt: true })],
    },
    {
      text: 'Den Reis gleichmäßig in die Pfanne streuen, einmal mit dem Löffel verteilen – ab jetzt nicht mehr rühren. 10 Minuten bei starker, dann 8 Minuten bei kleiner Hitze garen, bis die Flüssigkeit aufgesogen ist; die Rosmarinzweige die letzten 5 Minuten obenauf legen.',
      settings: [
        paella('32', 'Köcheln', { level: '8', minutes: 10 }),
        paella('32', 'Köcheln', { level: '4', minutes: 8 }),
        paella('46', 'Köcheln', { level: 'hoch', minutes: 10, alt: true }),
        paella('46', 'Köcheln', { level: 'niedrig', minutes: 8, alt: true, note: 'Pfanne alle 2 Min. eine Vierteldrehung, damit der Rand mitgart' }),
      ],
    },
    {
      text: 'Für das „Socarrat“ (die begehrte, knusprig angeröstete Reisschicht am Boden) die Hitze zum Schluss 2 Minuten hochdrehen, bis es leise knistert und nach geröstetem Reis duftet – nicht verbrennen lassen.',
      settings: [paella('32', 'Socarrat', { level: '9', minutes: 2 }), paella('46', 'Socarrat', { level: 'hoch', minutes: 2, alt: true })],
    },
    {
      text: 'Vom Feuer nehmen, mit einem sauberen Küchentuch abdecken und 5 Minuten ruhen lassen. Rosmarin entfernen und direkt aus der Pfanne essen. Eine echte Paella valenciana hat weder Chorizo noch Meeresfrüchte, Erbsen oder Zwiebeln. Leichter: die Hähnchenhaut vor dem Anbraten abziehen und nur 1 EL Öl nehmen.',
      settings: [paella('32', 'Ruhen', { minutes: 5 }), paella('46', 'Ruhen', { minutes: 5, alt: true })],
    },
  ],
  'paella-de-marisco': [
    {
      text: 'Riesengarnelen und Tintenfischringe über Nacht im Kühlschrank auftauen lassen, abspülen und trocken tupfen. Die Miesmuscheln unter kaltem Wasser abbürsten und die Bärte abziehen; offene Muscheln, die sich beim Antippen nicht schließen, wegwerfen. Die Paprika in Streifen schneiden, den Knoblauch fein hacken, die Tomate auf einer Reibe reiben (die Haut bleibt in der Hand) und die Safranfäden in 2 EL warmem Wasser einweichen.',
    },
    {
      text: 'Die Muscheln mit 100 ml Wasser in einem Topf zugedeckt 3 bis 4 Minuten garen, bis sie sich öffnen. Durch ein Sieb abgießen, den Muschelsud zum Fischfond geben; Muscheln, die geschlossen bleiben, wegwerfen.',
      settings: [bora('Power', { minutes: 4, note: 'Deckel drauf' })],
    },
    {
      text: 'Die Paellapfanne (32 cm) auf den BORA setzen und beide Kochzonen mit der Brücke koppeln – für Gäste (6–8 Personen, alle Mengen ×3) stattdessen die große Pfanne auf den vorgeheizten Gasgrill stellen und den Deckel offen lassen. Das Olivenöl erhitzen, die Garnelen 1 Minute je Seite anbraten und herausnehmen – sie garen später auf dem Reis fertig. Die Tintenfischringe darin 3 Minuten braten, bis ihr Saft verdampft ist.',
      settings: [
        paella('32', 'Anbraten', { level: '7', minutes: 5 }),
        grillVorheizen,
        gross('Anbraten', { level: 'hoch', minutes: 5, note: 'große Runde 6–8 Personen: alle Mengen ×3' }),
      ],
    },
    {
      text: 'Paprika und Knoblauch zugeben und 3 Minuten braten. Die geriebene Tomate zugeben und 5 Minuten einkochen, bis sie dunkel und dicklich ist (Sofrito). Das Paprikapulver nur einige Sekunden darin anrösten – es verbrennt sehr schnell und wird bitter.',
      settings: [paella('32', 'Sofrito', { level: '5', minutes: 8 }), gross('Sofrito', { level: 'mittel', minutes: 8 })],
    },
    {
      text: 'Sofort Fischfond mit Muschelsud angießen und mit Wasser auf 700 ml auffüllen (große Pfanne ca. 2,1 Liter), die Safranfäden mit dem Einweichwasser zugeben, aufkochen und 5 Minuten kräftig köcheln lassen. Abschmecken: leicht übersalzen, der Reis nimmt das Salz auf.',
      settings: [paella('32', 'Köcheln', { level: '8', minutes: 5 }), gross('Köcheln', { level: 'hoch', minutes: 5 })],
    },
    {
      text: 'Den Paellareis gleichmäßig einstreuen und einmal mit dem Löffel verteilen – ab jetzt nicht mehr rühren. 10 Minuten bei starker Hitze kochen, dann Garnelen und Muscheln mit der Öffnung nach oben in den Reis drücken und 8 Minuten bei kleiner Hitze garen, bis die Flüssigkeit aufgesogen ist. Die Pfanne alle 3 bis 4 Minuten eine Vierteldrehung weiterdrehen, damit der Rand mitgart. Garprobe: Das Reiskorn ist weich mit einem hauchdünnen Kern.',
      settings: [
        paella('32', 'Köcheln', { level: '8', minutes: 10 }),
        paella('32', 'Köcheln', { level: '4', minutes: 8 }),
        gross('Köcheln', { level: 'hoch', minutes: 10 }),
        gross('Köcheln', { level: 'niedrig', minutes: 8, note: 'Pfanne alle 2 Min. eine Vierteldrehung' }),
      ],
    },
    {
      text: 'Für das „Socarrat“ (die knusprig angeröstete Reisschicht am Boden) die Hitze zum Schluss 2 Minuten hochdrehen, bis es leise knistert und nach geröstetem Reis duftet – nicht verbrennen lassen.',
      settings: [paella('32', 'Socarrat', { level: '9', minutes: 2 }), gross('Socarrat', { level: 'hoch', minutes: 2 })],
    },
    {
      text: 'Vom Feuer nehmen, mit einem sauberen Küchentuch abdecken und 5 Minuten ruhen lassen. Mit Zitronenspalten direkt aus der Pfanne essen. In eine Paella de marisco gehören weder Chorizo noch Hähnchen – gemischt heißt sie „Paella mixta“.',
      settings: [paella('32', 'Ruhen', { minutes: 5 }), gross('Ruhen', { minutes: 5 })],
    },
  ],
  'arroz-negro': [
    {
      text: 'Die Tintenfischringe über Nacht im Kühlschrank auftauen lassen, trocken tupfen und halbieren. Original nimmt man Sepia mit ihrem Tintenbeutel (Fischhändler, Asia-Markt); die Tintenfischtinte gibt es in kleinen Tütchen beim Fischhändler und im spanischen Feinkostversand. Zwiebel und Paprika fein würfeln, den Knoblauch hacken, die Tomate reiben. Die Ñora (kleine, süße getrocknete Paprika aus Murcia) aufbrechen und die Kerne ausschütteln.',
    },
    {
      text: 'Die Paellapfanne (32 cm) auf den BORA setzen und die Brücke einschalten – für Gäste die große Pfanne auf den vorgeheizten Gasgrill, Deckel offen. Das Olivenöl erhitzen, die Ñora darin 30 Sekunden anbraten – sie darf nicht schwarz werden – und herausnehmen; mit 2 EL Fischfond im Mörser oder Mini-Hacker zu einer Paste zerreiben. Den Tintenfisch im Öl 5 Minuten braten, bis der Saft verdampft ist und er leicht Farbe nimmt.',
      settings: [
        paella('32', 'Anbraten', { level: '7', minutes: 6 }),
        grillVorheizen,
        gross('Anbraten', { level: 'hoch', minutes: 6, note: 'große Runde 6–8 Personen: alle Mengen ×3' }),
      ],
    },
    {
      text: 'Zwiebel und Paprika zugeben und 8 Minuten weich braten, dann Knoblauch, geriebene Tomate und Ñora-Paste zugeben und 4 Minuten einkochen (Sofrito).',
      settings: [paella('32', 'Sofrito', { level: '4', minutes: 12 }), gross('Sofrito', { level: 'mittel', minutes: 12 })],
    },
    {
      text: 'Den Fischfond angießen (große Pfanne ca. 2 Liter), die Tintenfischtinte in einer Kelle Fond auflösen und dazugießen. Aufkochen, 5 Minuten köcheln lassen und kräftig abschmecken (leicht übersalzen).',
      settings: [paella('32', 'Köcheln', { level: '8', minutes: 5 }), gross('Köcheln', { level: 'hoch', minutes: 5 })],
    },
    {
      text: 'Den Paellareis gleichmäßig einstreuen und einmal verteilen – ab jetzt nicht mehr rühren. 10 Minuten bei starker, dann 8 Minuten bei kleiner Hitze garen, bis die Flüssigkeit aufgesogen ist; die Pfanne alle 3 bis 4 Minuten eine Vierteldrehung weiterdrehen.',
      settings: [
        paella('32', 'Köcheln', { level: '8', minutes: 10 }),
        paella('32', 'Köcheln', { level: '4', minutes: 8 }),
        gross('Köcheln', { level: 'hoch', minutes: 10 }),
        gross('Köcheln', { level: 'niedrig', minutes: 8, note: 'Pfanne alle 2 Min. eine Vierteldrehung' }),
      ],
    },
    {
      text: 'Für das Socarrat die Hitze 2 Minuten hochdrehen, bis es leise knistert.',
      settings: [paella('32', 'Socarrat', { level: '9', minutes: 2 }), gross('Socarrat', { level: 'hoch', minutes: 2 })],
    },
    {
      text: 'Vom Feuer nehmen, mit einem Tuch abdecken und 5 Minuten ruhen lassen. Mit Alioli (am besten selbstgemacht) aus der Pfanne essen – erst die Alioli macht den Arroz negro rund. Leichter: Alioli nur als Klecks zum Tunken, nicht unterrühren.',
      settings: [paella('32', 'Ruhen', { minutes: 5 }), gross('Ruhen', { minutes: 5 })],
    },
  ],
  'arroz-a-banda': [
    {
      text: '„A banda“ heißt „getrennt“: Die Fischer von Alicante kochten den Fisch in einem Sud, aßen ihn als eigenen Gang und garten den Reis im Sud. Heute kommen kleine, geschälte Meeresfrüchte in den Reis – nichts mit Schale, alles wird mit dem Löffel gegessen. Tintenfischringe und Garnelen über Nacht im Kühlschrank auftauen lassen, trocken tupfen und den Tintenfisch in kleine Stücke schneiden. Knoblauch hacken, die Tomate reiben, die Ñora entkernen und die Safranfäden in 2 EL warmem Wasser einweichen.',
    },
    {
      text: 'Die Paellapfanne (32 cm) auf den BORA setzen und die Brücke einschalten – für Gäste die große Pfanne auf den vorgeheizten Gasgrill, Deckel offen. Das Olivenöl erhitzen, die Ñora 30 Sekunden anbraten, herausnehmen und mit dem Knoblauch und 2 EL Fischfond im Mörser oder Mini-Hacker zu einer Paste zerreiben. Den Tintenfisch im Öl 4 Minuten braten, die Garnelen zugeben und 1 Minute mitbraten.',
      settings: [
        paella('32', 'Anbraten', { level: '7', minutes: 5 }),
        grillVorheizen,
        gross('Anbraten', { level: 'hoch', minutes: 5, note: 'große Runde 6–8 Personen: alle Mengen ×3' }),
      ],
    },
    {
      text: 'Die geriebene Tomate zugeben und 4 Minuten einkochen, die Ñora-Knoblauch-Paste unterrühren und das Paprikapulver nur einige Sekunden anrösten (Sofrito).',
      settings: [paella('32', 'Sofrito', { level: '5', minutes: 5 }), gross('Sofrito', { level: 'mittel', minutes: 5 })],
    },
    {
      text: 'Sofort den Fischfond (große Pfanne ca. 2 Liter) und die Safranfäden mit dem Einweichwasser angießen, aufkochen und 3 Minuten köcheln lassen. Kräftig abschmecken (leicht übersalzen).',
      settings: [paella('32', 'Köcheln', { level: '8', minutes: 3 }), gross('Köcheln', { level: 'hoch', minutes: 3 })],
    },
    {
      text: 'Den Paellareis einstreuen und einmal verteilen – die Reisschicht ist beim Arroz a banda dünn, nur etwa einen Finger hoch. Ab jetzt nicht mehr rühren: 10 Minuten bei starker, dann 7 Minuten bei kleiner Hitze garen, bis die Flüssigkeit aufgesogen ist; die Pfanne alle 3 bis 4 Minuten eine Vierteldrehung weiterdrehen.',
      settings: [
        paella('32', 'Köcheln', { level: '8', minutes: 10 }),
        paella('32', 'Köcheln', { level: '4', minutes: 7 }),
        gross('Köcheln', { level: 'hoch', minutes: 10 }),
        gross('Köcheln', { level: 'niedrig', minutes: 7, note: 'Pfanne alle 2 Min. eine Vierteldrehung' }),
      ],
    },
    {
      text: 'Für das Socarrat die Hitze 2 Minuten hochdrehen, bis es leise knistert.',
      settings: [paella('32', 'Socarrat', { level: '9', minutes: 2 }), gross('Socarrat', { level: 'hoch', minutes: 2 })],
    },
    {
      text: 'Vom Feuer nehmen, mit einem Tuch abdecken und 5 Minuten ruhen lassen. Mit Alioli servieren (selbstgemacht schmeckt am besten). Leichter: Alioli nur als kleiner Klecks.',
      settings: [paella('32', 'Ruhen', { minutes: 5 }), gross('Ruhen', { minutes: 5 })],
    },
  ],
  fideua: [
    {
      text: 'Riesengarnelen und Tintenfischringe über Nacht im Kühlschrank auftauen lassen und trocken tupfen. Die Spaghetti in ein Küchentuch wickeln und über der Tischkante in 2 bis 3 cm lange Stücke brechen – Ersatz für die kurzen dünnen „Fideos Nr. 2“ (spanische Feinkost: „Fideos para fideuà“). Die Ñora entkernen und in 100 ml heißem Fischfond 15 Minuten einweichen, dann das Fruchtfleisch mit einem Messer von der Haut schaben. Knoblauch hacken, die Tomate reiben, die Safranfäden in den restlichen Fischfond geben und den Fond erhitzen.',
    },
    {
      text: 'Die Paellapfanne (32 cm) auf den BORA setzen und die Brücke einschalten – für Gäste die große Pfanne auf den vorgeheizten Gasgrill, Deckel offen. Das Olivenöl erhitzen, die Garnelen 1 Minute je Seite anbraten und herausnehmen. Die Tintenfischringe 3 Minuten braten, an den Rand schieben und die Nudelstücke in der Mitte unter Wenden 3 Minuten goldbraun rösten – so bleiben sie später bissfest.',
      settings: [
        paella('32', 'Anbraten', { level: '6', minutes: 8 }),
        grillVorheizen,
        gross('Anbraten', { level: 'mittel', minutes: 8, note: 'große Runde 6–8 Personen: alle Mengen ×3' }),
      ],
    },
    {
      text: 'Knoblauch, geriebene Tomate und Ñora-Fruchtfleisch zugeben und 4 Minuten einkochen (Sofrito), dann das Paprikapulver nur einige Sekunden anrösten.',
      settings: [paella('32', 'Sofrito', { level: '5', minutes: 5 }), gross('Sofrito', { level: 'mittel', minutes: 5 })],
    },
    {
      text: 'Den heißen Fond samt Einweichfond angießen (große Pfanne ca. 1,5 Liter) und einmal verteilen – ab jetzt nicht mehr rühren. 8 Minuten bei starker Hitze kochen, die Garnelen auflegen und 4 Minuten bei kleiner Hitze garen, bis die Flüssigkeit aufgesogen ist.',
      settings: [
        paella('32', 'Köcheln', { level: '8', minutes: 8 }),
        paella('32', 'Köcheln', { level: '4', minutes: 4 }),
        gross('Köcheln', { level: 'hoch', minutes: 8 }),
        gross('Köcheln', { level: 'niedrig', minutes: 4, note: 'Pfanne alle 2 Min. eine Vierteldrehung' }),
      ],
    },
    {
      text: 'Die Hitze 2 Minuten hochdrehen, bis es am Boden leise knistert (Socarrat) und sich die Nudelenden an der Oberfläche aufstellen („de punta“).',
      settings: [paella('32', 'Socarrat', { level: '9', minutes: 2 }), gross('Socarrat', { level: 'hoch', minutes: 2 })],
    },
    {
      text: 'Vom Feuer nehmen, mit einem Tuch abdecken und 3 Minuten ruhen lassen. Mit Alioli servieren – in Gandia gehört sie immer dazu. Leichter: Alioli nur als kleiner Klecks.',
      settings: [paella('32', 'Ruhen', { minutes: 3 }), gross('Ruhen', { minutes: 3 })],
    },
  ],
  'arroz-caldoso-de-marisco': [
    {
      text: 'Riesengarnelen und Tintenfischringe über Nacht im Kühlschrank auftauen lassen. Die Garnelen bis auf das Schwanzende schälen, Köpfe und Schalen aufheben. Die Miesmuscheln abbürsten und entbarten (offene, die sich nicht schließen, wegwerfen). Zwiebel und Paprika fein würfeln, Knoblauch hacken, die Tomate reiben. Die Ñora entkernen und in einer Tasse heißem Wasser einweichen, die Safranfäden in 2 EL warmem Wasser.',
    },
    {
      text: 'In einem breiten Topf 1 EL Olivenöl erhitzen, Garnelenköpfe und -schalen darin 3 Minuten kräftig rösten und die Köpfe dabei andrücken. Mit dem Fischfond ablöschen, 10 Minuten köcheln lassen und durch ein Sieb gießen – das ist die Seele des Gerichts.',
      settings: [bora('8', { minutes: 3 }), bora('4', { minutes: 10 })],
    },
    {
      text: 'Den Topf auswischen, das restliche Öl erhitzen und die Tintenfischringe 4 Minuten anbraten. Zwiebel und Paprika zugeben und 8 Minuten weich braten, dann Knoblauch, geriebene Tomate und das abgeschabte Ñora-Fruchtfleisch 4 Minuten einkochen (Sofrito).',
      settings: [bora('7', { minutes: 4 }), bora('4', { minutes: 12 })],
    },
    {
      text: 'Den Weinbrand angießen und fast vollständig einkochen lassen. Den Paellareis zugeben, 1 Minute im Sofrito wenden, dann den heißen Fond und die Safranfäden mit dem Einweichwasser angießen und aufkochen. Abschmecken.',
      settings: [bora('6', { minutes: 2 }), bora('Power', { note: 'aufkochen' })],
    },
    {
      text: 'Bei mittlerer Hitze 16 Minuten köcheln lassen und ab und zu umrühren – anders als bei der Paella darf man hier, der Reis soll in reichlich Brühe schwimmen. Nach 10 Minuten Muscheln und Garnelen hineinlegen. Garprobe: Der Reis ist bissfest, im Topf ist noch viel Brühe.',
      settings: [bora('5', { minutes: 16 })],
    },
    {
      text: 'Die Petersilie hacken und darüberstreuen, 2 Minuten ruhen lassen und sofort in tiefen Tellern servieren – der Reis saugt sonst die Brühe auf. Für ein Fest nimmt man in Spanien einen halbierten Hummer („bogavante“) statt der Garnelen.',
    },
  ],
  'arroz-al-horno': [
    {
      text: 'Den Combair auf 220 °C Ober-/Unterhitze vorheizen. Die Kichererbsen abspülen. Die Kartoffel schälen und in 5 mm dicke Scheiben schneiden. Den Schweinebauch in 3 cm große Stücke, die Blutwurst in 2 cm dicke Scheiben schneiden (Original: Morcilla de cebolla mit Zwiebeln aus der spanischen Feinkost; Blutwurst ist der übliche Ersatz). Eine Tomate halbieren, die andere reiben. Vom Knoblauch (eine ganze Knolle, etwa 10 Zehen) nur die lose Außenschale abreiben, die Knolle bleibt ganz. Die Safranfäden in die Hühnerbrühe geben und die Brühe erhitzen – traditionell nimmt man die Brühe vom Vortags-Eintopf (Cocido).',
      settings: [vzug('combair', 'Ober-/Unterhitze', 220, { note: 'vorheizen, Ebene 2' })],
    },
    {
      text: 'Das Olivenöl in einer Pfanne erhitzen und den Schweinebauch 8 Minuten rundum goldbraun braten. Die Kartoffelscheiben 4 Minuten mitbraten, dann die Blutwurst nur 1 Minute je Seite (sie zerfällt leicht) und alles herausnehmen. Knoblauchknolle und Tomatenhälften mit der Schnittfläche nach unten kurz anbraten.',
      settings: [bora('6', { minutes: 14 })],
    },
    {
      text: 'Die geriebene Tomate im Bratfett 3 Minuten einkochen, das Paprikapulver nur einige Sekunden anrösten, dann den Paellareis und die Kichererbsen 1 Minute darin wenden.',
      settings: [bora('5', { minutes: 4 })],
    },
    {
      text: 'Die Reismischung in einer flachen ofenfesten Form (Cazuela aus Ton oder Auflaufform, ca. 26 cm) verteilen und die heiße Brühe angießen. Knoblauchknolle in die Mitte setzen, Tomatenhälften, Kartoffeln, Schweinebauch und Blutwurst darauf legen. Im vorgeheizten Combair bei 220 °C Ober-/Unterhitze auf Ebene 2 20 Minuten garen, ohne zu rühren, bis die Brühe aufgesogen ist und die Oberfläche trocken und leicht geröstet ist. Garprobe: Reis weich mit kaum Biss.',
      settings: [vzug('combair', 'Ober-/Unterhitze', 220, { minutes: 20, note: 'Ebene 2' })],
    },
    {
      text: '5 Minuten ruhen lassen und in der Form servieren; die weichen Knoblauchzehen aus der Schale drücken und mit dem Reis essen. Leichter: nur 60 g Schweinebauch nehmen und dafür die ganze Dose Kichererbsen.',
    },
  ],
  'merluza-en-salsa-verde': [
    {
      text: 'Die Venusmuscheln 30 Minuten in kaltem Salzwasser liegen lassen, damit sie Sand ausspucken, dann abspülen. Seehecht (Merluza – an der Fischtheke oder tiefgekühlt) ist das Original; Kabeljau ist der übliche Ersatz. Den Fisch in 2 dicke Stücke schneiden und salzen. Den Knoblauch fein hacken, die Petersilie sehr fein hacken. Die Kartoffeln schälen und vierteln.',
    },
    {
      text: 'Den Wasserbehälter des CombiSteamers füllen. Die Kartoffeln im gelochten Garbehälter bei 100 °C 25 Minuten dämpfen; das Ei nach 13 Minuten dazulegen (dann 12 Minuten, hart), danach abschrecken und schälen.',
      settings: [vzug('steamer', 'Dämpfen', 100, { minutes: 25, note: 'gelochter Garbehälter, Ebene 2' })],
    },
    {
      text: 'Inzwischen das Olivenöl in einer breiten Pfanne oder Cazuela bei kleiner Hitze erwärmen und den Knoblauch 2 Minuten darin ziehen lassen, ohne dass er Farbe nimmt. Das Mehl einstreuen und 1 Minute anschwitzen, mit Weißwein und Fischfond ablöschen und unter Rühren aufkochen.',
      settings: [bora('3', { minutes: 3 }), bora('6', { note: 'aufkochen' })],
    },
    {
      text: 'Den Fisch mit der Hautseite nach oben in die Sauce legen, Muscheln und Erbsen dazugeben und 7 Minuten sanft köcheln lassen; den Fisch nach 4 Minuten wenden. Dabei die Pfanne immer wieder hin und her schwenken („meneo“) – die Gelatine aus dem Fisch bindet so die Sauce. Garprobe: Der Fisch ist innen gerade weiß und blättert, die Muscheln sind offen (geschlossene wegwerfen).',
      settings: [bora('3', { minutes: 7 })],
    },
    {
      text: 'Die Petersilie unterschwenken, das Ei vierteln und dazulegen und mit den Kartoffeln servieren. Leichter: nur 2 EL Öl nehmen.',
    },
  ],
  'bacalao-a-la-vizcaina': [
    {
      text: '36 bis 48 Stunden vorher den Klippfisch (Bacalao: gesalzener, getrockneter Kabeljau – portugiesische oder spanische Lebensmittelläden, Feinkostversand; am besten dicke Rückenstücke, „Lomos“) abspülen und mit der Haut nach oben in reichlich kaltem Wasser im Kühlschrank wässern; das Wasser 3- bis 4-mal am Tag wechseln. Probe: Ein kleines Stück schmeckt nur noch angenehm salzig. In 2 Portionsstücke teilen, Gräten zupfen und trocken tupfen.',
    },
    {
      text: 'Die Ñoras entkernen und 30 Minuten in 300 ml heißem Wasser einweichen (Ersatz für die großen baskischen „Pimientos choriceros“; noch echter ist „Carne de pimiento choricero“ aus dem Glas). Die Zwiebeln in feine Streifen schneiden, den Knoblauch hacken, den Schinken klein würfeln.',
    },
    {
      text: '2 EL Olivenöl in einem Topf erhitzen, Zwiebeln, Knoblauch und Schinken zugeben und zugedeckt bei kleiner Hitze 40 Minuten weich und süß schmoren – sie sollen nicht braun werden.',
      settings: [bora('3', { minutes: 40, note: 'Deckel drauf' })],
    },
    {
      text: 'Das Fruchtfleisch der Ñoras mit einem Messer von der Haut schaben. Mit dem gewürfelten Weißbrot und 200 ml Einweichwasser zu den Zwiebeln geben, 10 Minuten köcheln lassen, fein pürieren und durch ein Sieb streichen. Die Sauce ist rotbraun, süßlich und sämig. Erst jetzt abschmecken, der Fisch salzt mit.',
      settings: [bora('3', { minutes: 10 })],
    },
    {
      text: 'Inzwischen den Wasserbehälter des CombiSteamers füllen, die Kartoffeln schälen, vierteln und im gelochten Garbehälter bei 100 °C 25 Minuten dämpfen.',
      settings: [vzug('steamer', 'Dämpfen', 100, { minutes: 25, note: 'gelochter Garbehälter, Ebene 2' })],
    },
    {
      text: 'Das restliche Öl in einer flachen Pfanne erwärmen und den Fisch mit der Haut nach unten bei kleiner Hitze 4 Minuten braten, wenden und 2 Minuten weiterbraten. Die Sauce angießen, den Fisch mit der Haut nach oben hineinlegen und zugedeckt 8 Minuten sanft ziehen lassen, die Pfanne ab und zu schwenken. Garprobe: Der Fisch zerfällt in große, glasige Blätter.',
      settings: [bora('3', { minutes: 6 }), bora('Simmern', { minutes: 8, note: 'Deckel drauf' })],
    },
    {
      text: 'Mit den Kartoffeln servieren. Leichter: den Fisch nicht anbraten, sondern direkt in der Sauce garen und nur 2 EL Öl nehmen.',
    },
  ],
  'zarzuela-de-mariscos': [
    {
      text: 'Riesengarnelen und Tintenfischringe über Nacht im Kühlschrank auftauen lassen. Die Miesmuscheln abbürsten und entbarten (offene, die sich nicht schließen, wegwerfen). Den Seelachs (klassisch Seeteufel – teurer, aber sehr fest) in 4 cm große Stücke schneiden, salzen und dünn in Mehl wenden. Zwiebel fein würfeln, Knoblauch hacken, die Tomaten reiben, die Safranfäden in 2 EL warmem Wasser einweichen.',
    },
    {
      text: 'Für die Picada (katalanische Würzpaste, die die Sauce bindet) 1 EL Olivenöl in einer breiten Pfanne oder Cazuela erhitzen und Mandeln und Brotscheibe darin 3 Minuten goldbraun rösten. Herausnehmen und mit 1 Knoblauchzehe, der Hälfte der Petersilie, den Safranfäden samt Wasser und 2 EL Fischfond im Mörser oder Mini-Hacker zu einer Paste zerreiben.',
      settings: [bora('5', { minutes: 3 })],
    },
    {
      text: 'Das restliche Öl erhitzen, den Fisch 1 Minute je Seite anbraten, die Garnelen 1 Minute je Seite, dann die Tintenfischringe 2 Minuten – alles herausnehmen, es gart später in der Sauce fertig.',
      settings: [bora('7', { minutes: 6 })],
    },
    {
      text: 'Zwiebel 6 Minuten weich braten, restlichen Knoblauch und die geriebenen Tomaten zugeben und 5 Minuten einkochen, das Paprikapulver nur einige Sekunden anrösten. Mit dem Weinbrand ablöschen und einkochen lassen, dann den Weißwein angießen und 2 Minuten einkochen.',
      settings: [bora('4', { minutes: 14 })],
    },
    {
      text: 'Fischfond und Picada einrühren, 5 Minuten köcheln lassen und abschmecken. Die Muscheln zugeben und zugedeckt garen, bis sie sich öffnen, dann Fisch, Garnelen und Tintenfisch hineinlegen und alles zusammen 6 Minuten zugedeckt sanft ziehen lassen. Garprobe: Fisch innen gerade weiß, Muscheln offen (geschlossene wegwerfen).',
      settings: [bora('4', { minutes: 5 }), bora('3', { minutes: 6, note: 'Deckel drauf' })],
    },
    {
      text: 'Mit der restlichen gehackten Petersilie bestreuen und in der Pfanne servieren.',
    },
  ],
  'suquet-de-peix': [
    {
      text: 'Die Ñora entkernen und 20 Minuten in heißem Wasser einweichen, die Garnelen im Kühlschrank auftauen lassen. Den Seelachs (die Fischer der Costa Brava nehmen Drachenkopf, Seeteufel oder Knurrhahn; Kabeljau geht auch) in große Stücke schneiden und salzen. Die Kartoffeln schälen und „chascar“: mit dem Messer etwas einschneiden und das Stück abbrechen – die rauen Kanten geben Stärke ab und binden die Brühe. Die Tomate reiben.',
    },
    {
      text: 'Das Olivenöl in einem breiten Topf erhitzen und 2 ganze Knoblauchzehen, die Mandeln und die Brotscheibe darin 3 Minuten goldbraun rösten. Herausnehmen und mit der Petersilie und dem abgeschabten Ñora-Fruchtfleisch im Mörser oder Mini-Hacker zur Picada zerreiben.',
      settings: [bora('5', { minutes: 3 })],
    },
    {
      text: 'Die restliche Knoblauchzehe hacken und mit der geriebenen Tomate im Öl 4 Minuten einkochen, das Paprikapulver nur einige Sekunden anrösten. Die Kartoffeln 2 Minuten darin wenden, den Fischfond angießen, aufkochen und 15 Minuten köcheln lassen, bis die Kartoffeln fast weich sind.',
      settings: [bora('4', { minutes: 6 }), bora('Power', { note: 'aufkochen' }), bora('4', { minutes: 15 })],
    },
    {
      text: 'Die Picada einrühren und abschmecken. Fisch und Garnelen auf die Kartoffeln legen und zugedeckt 6 Minuten sanft ziehen lassen; den Topf schwenken statt umzurühren, damit der Fisch nicht zerfällt. Garprobe: Der Fisch ist innen gerade weiß.',
      settings: [bora('Simmern', { minutes: 6, note: 'Deckel drauf' })],
    },
    {
      text: '2 Minuten ruhen lassen und im Topf servieren – „suc“ heißt Saft: Die gebundene Brühe wird mit Brot aufgetunkt.',
    },
  ],
  'dorada-a-la-sal': [
    {
      text: 'Den Combair auf 200 °C Ober-/Unterhitze vorheizen. Die 2 Doraden (je ca. 400 g) beim Fischhändler ausnehmen, aber nicht schuppen lassen – die Schuppen schützen das Fleisch vor dem Salz. Abspülen, trocken tupfen und in jeden Bauch 2 Zitronenscheiben, 1 Lorbeerblatt und ein paar Petersilienstiele legen.',
      settings: [vzug('combair', 'Ober-/Unterhitze', 200, { note: 'vorheizen, Ebene 2' })],
    },
    {
      text: 'Das grobe Meersalz mit etwa 150 ml Wasser mischen, bis es sich wie nasser Sand formen lässt. Ein Blech mit Backpapier belegen, ein 1 cm dickes Salzbett aufstreichen, die Fische darauflegen und mit dem restlichen Salz vollständig bedecken und andrücken.',
    },
    {
      text: 'Den Kerntemperaturfühler durch die Kruste in die dickste Stelle eines Fisches stecken und das Blech im Combair bei 200 °C Ober-/Unterhitze auf Ebene 2 garen, bis der Fühler 55 °C zeigt (etwa 25 Minuten). Gleichzeitig den Wasserbehälter des CombiSteamers füllen und die geschälten, geviertelten Kartoffeln im gelochten Garbehälter bei 100 °C 25 Minuten dämpfen.',
      settings: [
        vzug('combair', 'Ober-/Unterhitze', 200, { minutes: 25, core: 55, note: 'Ebene 2' }),
        vzug('steamer', 'Dämpfen', 100, { minutes: 25, note: 'gelochter Garbehälter, Ebene 2' }),
      ],
    },
    {
      text: 'Die restliche Petersilie und den Knoblauch fein hacken und mit Olivenöl und dem Saft der übrigen Zitrone verrühren („ajo y perejil“).',
    },
    {
      text: 'Die Kruste am Tisch mit dem Messerrücken aufklopfen und abheben, die Haut abziehen und die Filets von der Gräte heben. Mit Kartoffeln und dem Knoblauch-Petersilien-Öl servieren – der Fisch ist durch die Kruste saftig und genau richtig gesalzen.',
    },
  ],
  'calamares-en-su-tinta': [
    {
      text: 'Die Tintenfischringe über Nacht im Kühlschrank auftauen lassen und trocken tupfen. Im Baskenland nimmt man kleine ganze Kalmare („chipirones“) vom Fischhändler, hackt die Tentakel und füllt sie in die Tuben. Zwiebeln und Paprika fein würfeln, Knoblauch hacken, die Tomate reiben, das Brot würfeln.',
    },
    {
      text: '2 EL Olivenöl in einem Topf stark erhitzen, den Tintenfisch 4 Minuten scharf anbraten und herausnehmen.',
      settings: [bora('8', { minutes: 4 })],
    },
    {
      text: 'Das restliche Öl in den Topf geben, Zwiebeln und Paprika bei kleiner Hitze 15 Minuten weich und süß braten, dann Knoblauch, geriebene Tomate und Brot zugeben und 5 Minuten einkochen.',
      settings: [bora('3', { minutes: 20 })],
    },
    {
      text: 'Den Tintenfisch zurück in den Topf geben, mit Weißwein ablöschen und 2 Minuten einkochen. Die Tintenfischtinte im Fischfond auflösen, angießen und zugedeckt bei kleiner Hitze 25 Minuten schmoren, bis der Tintenfisch zart ist.',
      settings: [bora('6', { minutes: 2 }), bora('2', { minutes: 25, note: 'Deckel drauf' })],
    },
    {
      text: 'Inzwischen den Wasserbehälter des CombiSteamers füllen. Den Reis mit 180 ml Wasser und etwas Salz in einer flachen Schale auf den gelochten Garbehälter stellen und bei 100 °C 20 Minuten dämpfen.',
      settings: [vzug('steamer', 'Dämpfen', 100, { minutes: 20, note: 'Schale auf gelochtem Garbehälter, Ebene 2' })],
    },
    {
      text: 'Den Tintenfisch herausheben, die Sauce mit dem Stabmixer fein pürieren, abschmecken und den Tintenfisch darin 2 Minuten erhitzen. Mit dem Reis servieren – klassisch als weißer Reisring neben der tiefschwarzen Sauce. Leichter: nur 2 EL Öl nehmen.',
      settings: [bora('4', { minutes: 2 })],
    },
  ],
  marmitako: [
    {
      text: 'Die Thunfischsteaks über Nacht im Kühlschrank auftauen lassen (Original: weißer Thun, „Bonito del Norte“, im Sommer frisch an der Fischtheke), in 3 cm große Würfel schneiden, salzen und kalt stellen. Die Ñoras entkernen und 20 Minuten in heißem Wasser einweichen (Ersatz für die baskischen „Pimientos choriceros“). Zwiebel und Paprika würfeln, Knoblauch hacken, die Tomate reiben. Die Kartoffeln schälen und „chascar“: einschneiden und in Stücke brechen, damit sie Stärke abgeben und die Brühe binden.',
    },
    {
      text: 'Das Olivenöl in einem Topf erhitzen und Zwiebel, Paprika und Knoblauch 10 Minuten weich braten.',
      settings: [bora('4', { minutes: 10 })],
    },
    {
      text: 'Die geriebene Tomate und das abgeschabte Ñora-Fruchtfleisch zugeben und 4 Minuten einkochen. Die Kartoffeln 2 Minuten darin wenden, den Fischfond angießen, aufkochen und 20 Minuten köcheln lassen, bis die Kartoffeln weich sind und die Brühe leicht gebunden ist. Abschmecken.',
      settings: [bora('4', { minutes: 6 }), bora('Power', { note: 'aufkochen' }), bora('3', { minutes: 20 })],
    },
    {
      text: 'Die Kochzone ausschalten, die Thunfischwürfel in die heiße Brühe geben und zugedeckt 5 Minuten ziehen lassen – so bleibt der Thunfisch saftig und innen zart rosa; gekocht wird er trocken.',
    },
    {
      text: 'Mit gehackter Petersilie bestreuen und im Topf servieren.',
    },
  ],
}
