import type { DeviceStep } from '../../types'
import { bora, plancha, vakuum, vzug } from '../device-helpers'

/**
 * Geräte-Schritte (Rezept-ID → Schritte), Gruppe: es2 (Spanisch, Eintöpfe, Fleisch & Geflügel – src/data/recipes-es2.ts).
 * Lange Eintöpfe: BORA Stufe 2 mit Deckel, CombiSteamer oder Dutch Oven; Plancha `plancha()` für Kurzgebratenes.
 * Stil siehe docs/geraete/regeln.md, Geräte docs/geraete/paella-plancha.md.
 */
export const DEVICE_STEPS: Record<string, DeviceStep[]> = {
  'fabada-asturiana': [
    { text: 'Die Fabes (große, buttrige weiße Bohnen aus Asturien) am Vortag in reichlich kaltem Wasser 12 Stunden einweichen. Den geräucherten Schweinebauch ebenfalls 1 Stunde wässern, damit er nicht zu salzig ist.' },
    {
      text: 'Die Bohnen abgießen und in einen breiten Topf geben, knapp mit kaltem Wasser bedecken. Die halbierte Zwiebel, Knoblauch, Lorbeer sowie Chorizo, Blutwurst (Ersatz für die asturische Morcilla) und Schweinebauch im Ganzen darauflegen – dieses „Compango“ gibt den Geschmack. Auf dem BORA langsam aufkochen und den Schaum abschöpfen.',
      settings: [bora('6', { note: 'langsam aufkochen' })],
    },
    {
      text: 'Die Safranfäden und das Paprikapulver in etwas Kochwasser verrühren und zugeben. Den Eintopf zugedeckt 2,5 Stunden ganz leise simmern lassen. Nicht umrühren – die Bohnen platzen sonst –, nur ab und zu den Topf schwenken. Zwei- bis dreimal einen Schuss kaltes Wasser zugeben („asustar las fabes“, die Bohnen erschrecken): so bleibt die Haut zart und ganz.',
      settings: [bora('2', { minutes: 150, note: 'Deckel drauf, ganz leise simmern' })],
    },
    { text: 'Wenn die Bohnen butterweich sind, Wurst und Fleisch herausnehmen und in Scheiben schneiden, Zwiebel und Lorbeer entfernen. Erst jetzt salzen, die Wurst gibt viel Salz ab.' },
    { text: 'Den Eintopf 15 Minuten ruhen lassen, damit er sämig wird. In tiefen Tellern servieren und das Compango obenauf legen oder getrennt reichen.' },
  ],
  'cocido-madrileno': [
    { text: 'Die Kichererbsen am Vortag in reichlich lauwarmem Wasser mit 1 TL Salz 12 Stunden einweichen. Den geräucherten Schweinebauch (Ersatz für den spanischen „Tocino“) 1 Stunde wässern.' },
    {
      text: 'Suppenfleisch Rind, Hähnchenschenkel, Schweinebauch und Serrano-Schinken (er ersetzt den Schinkenknochen) in einem großen Topf mit 2,5 l kaltem Wasser aufsetzen und auf dem BORA langsam aufkochen. Den grauen Schaum abschöpfen, bis die Brühe klar bleibt.',
      settings: [bora('6', { note: 'langsam aufkochen, großer Topf' })],
    },
    {
      text: 'Die abgetropften Kichererbsen in ein Kochnetz füllen und in die kochende Brühe geben – kalt zugegeben würden sie hart bleiben. Zugedeckt 2 Stunden ganz leise simmern lassen; die Brühe soll nur zittern, dann bleibt sie klar.',
      settings: [bora('2', { minutes: 120, note: 'Deckel drauf, nur zittern lassen' })],
    },
    {
      text: 'Die Kartoffeln schälen und im Ganzen, die Möhre in großen Stücken in den Topf geben und alles weitere 30 Minuten garen. Garprobe: Die Kichererbsen lassen sich mit der Zunge am Gaumen zerdrücken, das Fleisch ist weich.',
      settings: [bora('3', { minutes: 30 })],
    },
    {
      text: 'Inzwischen den Wasserbehälter des CombiSteamers füllen. Den Weißkohl in breite Streifen schneiden und mit der Chorizo im gelochten Garbehälter bei 100 °C 15 Minuten dämpfen – getrennt gegart färbt die Chorizo die Brühe nicht rot. Den Knoblauch in Scheiben im Olivenöl auf dem BORA hellgolden braten und den Kohl darin kurz schwenken („rehogar“).',
      settings: [vzug('steamer', 'Dämpfen', 100, { minutes: 15, note: 'gelochter Garbehälter, Ebene 2' }), bora('4', { note: 'Pfanne, Knoblauch hellgolden' })],
    },
    {
      text: 'Erster Gang – „Sopa“: Die Brühe durch ein Sieb abgießen (Fleisch, Kichererbsen und Gemüse mit etwas Brühe zugedeckt warm halten). 500 ml davon auf dem BORA aufkochen, die Suppennudeln (in Spanien „Fideos finos“) darin 4 Minuten garen und mit Salz abschmecken.',
      settings: [bora('6', { minutes: 4 })],
    },
    { text: 'Zweiter Gang – „Vuelco“ (das Umstürzen): Kichererbsen, Kartoffeln, Möhre und Kohl auf einer Platte anrichten, das Fleisch und die Chorizo in Stücke schneiden und dazulegen. Mit einem Spritzer Olivenöl servieren.' },
    {
      text: 'Reste und Vorrat: Übrige Brühe abkühlen lassen, im Beutel anfrieren und mit dem Vakuumierer portionsweise vakuumieren – sie ist die Basis für die nächste Sopa. Übriges Fleisch wird in Madrid am nächsten Tag zu „Ropa vieja“ (mit Zwiebeln in der Pfanne gebraten) oder zu Croquetas.',
      settings: [vakuum('Vakuumieren feucht', 'Brühe angefroren, Beutel à 500 ml')],
    },
  ],
  'lentejas-con-chorizo': [
    { text: 'Die Linsen in einem Sieb abspülen, Einweichen ist nicht nötig. In Spanien nimmt man kleine braune „Pardina“-Linsen (spanische Feinkost, online), Tellerlinsen gelingen genauso. Zwiebel, Paprika und Knoblauch fein würfeln, die Möhre in Scheiben schneiden. Die Chorizo in 1 cm dicke Scheiben schneiden.' },
    {
      text: 'Das Olivenöl im Topf auf dem BORA erhitzen und die Chorizo 2 Minuten anbraten, bis sie rotes Fett abgibt. Zwiebel, Paprika und Knoblauch zugeben und 5 Minuten glasig dünsten. Die Tomate hineinreiben, die Schale bleibt in der Hand.',
      settings: [bora('5', { minutes: 7 })],
    },
    {
      text: 'Den Topf kurz von der Kochzone ziehen, das Paprikapulver einrühren (es verbrennt sonst sofort und wird bitter) und gleich Linsen, Möhre, Lorbeer und 900 ml kaltes Wasser zugeben. Aufkochen und zugedeckt 25 Minuten leise köcheln lassen.',
      settings: [bora('Power', { note: 'aufkochen' }), bora('3', { minutes: 25, note: 'Deckel drauf' })],
    },
    {
      text: 'Die Kartoffeln schälen und in Stücke „brechen“: anschneiden und abbrechen – die rauen Kanten geben Stärke ab und binden den Eintopf. Zugeben und weitere 20 Minuten köcheln, bis Linsen und Kartoffeln weich sind; bei Bedarf einen Schuss Wasser nachgießen. Erst jetzt salzen und den Lorbeer entfernen.',
      settings: [bora('3', { minutes: 20 })],
    },
    { text: 'Vor dem Servieren 5 Minuten ruhen lassen. Lentejas schmecken am nächsten Tag noch besser – gern die doppelte Menge kochen und den Rest einfrieren. In Spanien gibt es Brot dazu und manchmal einen Spritzer Essig.' },
  ],
  'potaje-de-garbanzos-y-espinacas': [
    { text: 'Die Kichererbsen am Vortag in reichlich lauwarmem Wasser 12 Stunden einweichen.' },
    {
      text: 'Die Kichererbsen abgießen, mit dem Lorbeer in 1,2 l kaltem Wasser aufsetzen, auf dem BORA aufkochen und zugedeckt 75 Minuten leise köcheln lassen. Garprobe: Eine Kichererbse lässt sich mit der Zunge am Gaumen zerdrücken.',
      settings: [bora('Power', { note: 'aufkochen' }), bora('3', { minutes: 75, note: 'Deckel drauf' })],
    },
    {
      text: 'Inzwischen den Wasserbehälter des CombiSteamers füllen, die Eier im gelochten Garbehälter bei 100 °C 11 Minuten dämpfen, kalt abschrecken und pellen.',
      settings: [vzug('steamer', 'Dämpfen', 100, { minutes: 11, note: 'gelochter Garbehälter' })],
    },
    {
      text: 'Für das „Majado“ (die würzige Bindung aus dem Mörser) 2 EL Olivenöl in einer Pfanne erhitzen, die geschälten Knoblauchzehen und das Weißbrot darin 3 Minuten goldbraun braten. Herausnehmen und im Mörser oder Blitzhacker mit dem Kreuzkümmel und 3 EL Kochwasser der Kichererbsen zu einer Paste zerstoßen.',
      settings: [bora('5', { minutes: 3 })],
    },
    {
      text: 'Im restlichen Öl die fein gewürfelte Zwiebel glasig dünsten, die Tomate hineinreiben und kurz einkochen. Von der Kochzone ziehen, das Paprikapulver einrühren und sofort zu den Kichererbsen geben.',
      settings: [bora('4', { note: 'Zwiebel glasig, Tomate einkochen' })],
    },
    {
      text: 'Den gewaschenen Spinat portionsweise in den Topf geben und zusammenfallen lassen, das Majado einrühren und alles offen 10 Minuten köcheln, bis der Potaje sämig ist. Mit Salz und Pfeffer abschmecken, Lorbeer entfernen.',
      settings: [bora('4', { minutes: 10, note: 'offen' })],
    },
    { text: 'Die Eier vierteln und auf den Potaje legen. Als „Potaje de vigilia“ für die Fastenfreitage kommt in Andalusien noch gewässerter Bacalao (Salzkabeljau) hinein – frischer Kabeljau, in den letzten 8 Minuten auf den Eintopf gelegt, geht auch.' },
  ],
  'pollo-al-ajillo': [
    { text: 'Die Hähnchenschenkel am Gelenk teilen und Ober- und Unterschenkel mit einem schweren Messer quer durchhacken – in Spanien wird das Huhn „troceado“, in kleine Stücke mit Knochen, damit viel Fläche bräunt. Kräftig salzen und pfeffern. Die Knoblauchzehen mit Schale mit dem Handballen andrücken („ajos chafados“).' },
    { text: 'Die Kartoffeln schälen, in 1 cm dicke Stäbchen schneiden, 10 Minuten wässern, trocken tupfen und mit 1 EL Olivenöl und Salz mischen.' },
    {
      text: '3 EL Olivenöl in einer breiten Pfanne (spanisch „Cazuela“) auf dem BORA erhitzen, die Hähnchenstücke mit der Haut nach unten hineinlegen und bei mittlerer Hitze 15 Minuten rundum langsam goldbraun braten.',
      settings: [bora('6', { minutes: 15 })],
    },
    {
      text: 'Knoblauch, Chili (in Spanien „Guindilla“) und Lorbeer zugeben und 3 Minuten mitbraten, bis der Knoblauch duftet und Farbe nimmt – nicht schwarz werden lassen. Mit dem Sherry fino ablöschen (trockener Weißwein geht auch), zugedeckt 15 Minuten schmoren, dann offen einkochen, bis eine kleine, ölige Sauce übrig ist. Garprobe: Der Fleischsaft an der dicksten Stelle läuft klar.',
      settings: [bora('5', { minutes: 3, note: 'Knoblauch' }), bora('3', { minutes: 15, note: 'Deckel drauf, dann offen einkochen' })],
    },
    {
      text: 'Währenddessen den Airfryer auf 190 °C vorheizen und die Kartoffelstäbchen darin 22 Minuten knusprig backen, zweimal schütteln.',
      settings: [{ device: 'airfryer', mode: 'Heissluft', temp: 190, minutes: 22, note: 'vorheizen, 2× schütteln' }],
    },
    { text: 'Die Petersilie hacken, über das Huhn streuen und mit den Kartoffeln servieren; den weichen Knoblauch drückt man bei Tisch aus der Schale.' },
  ],
  'pollo-en-pepitoria': [
    { text: 'Die Hähnchenschenkel am Gelenk teilen, salzen, pfeffern und dünn im Weizenmehl wenden. Die Zwiebel fein würfeln.' },
    {
      text: 'Den Wasserbehälter des CombiSteamers füllen, die Eier im gelochten Garbehälter bei 100 °C 11 Minuten dämpfen, kalt abschrecken, pellen und Eigelb und Eiweiß trennen.',
      settings: [vzug('steamer', 'Dämpfen', 100, { minutes: 11, note: 'gelochter Garbehälter' })],
    },
    {
      text: 'Das Olivenöl in einem Schmortopf auf dem BORA erhitzen, die Mandeln (am besten geschälte), den geschälten Knoblauch und das Weißbrot darin 3 Minuten goldgelb rösten und herausnehmen – sie binden später die Sauce.',
      settings: [bora('5', { minutes: 3 })],
    },
    {
      text: 'Im selben Öl die Hähnchenteile rundum goldbraun anbraten, die Zwiebel zugeben und weich dünsten. Mit dem Sherry fino ablöschen und kurz einkochen. Hühnerbrühe und Lorbeer zugeben und zugedeckt 35 Minuten leise schmoren.',
      settings: [bora('6', { note: 'anbraten' }), bora('2', { minutes: 35, note: 'Deckel drauf' })],
    },
    { text: 'Inzwischen die Safranfäden in einer trockenen Pfanne wenige Sekunden anrösten und im Mörser mit Mandeln, Knoblauch, Brot, den Eigelben und 3 EL Schmorflüssigkeit zu einer glatten Paste zerstoßen (Blitzhacker geht auch) – das ist die „Pepitoria“.' },
    {
      text: 'Die Paste in die Sauce rühren und offen 5 Minuten köcheln, bis sie cremig gebunden ist. Garprobe: Das Fleisch löst sich leicht vom Knochen. Mit Salz abschmecken, Lorbeer entfernen.',
      settings: [bora('3', { minutes: 5 })],
    },
    { text: 'Mit gehacktem Eiweiß und Petersilie bestreut servieren, dazu Brot zum Tunken. Das Gericht stammt aus der kastilischen Küche des 18. Jahrhunderts und ist ein klassisches Sonntagsessen in Madrid.' },
  ],
  'rabo-de-toro': [
    { text: 'Den Ochsenschwanz in Scheiben (beim Metzger vorbestellen, oft auch tiefgekühlt; in Córdoba nimmt man den Schwanz des Kampfstiers, hier ist Rind üblich) trocken tupfen, salzen, pfeffern und dünn mit Weizenmehl bestauben. Zwiebel, Möhren, Paprika und Knoblauch würfeln.' },
    {
      text: 'Das Olivenöl in einem ofenfesten Bräter mit Deckel auf dem BORA erhitzen und den Ochsenschwanz darin rundum 10 Minuten kräftig anbraten, herausnehmen. Den Abzug dabei eine Stufe höher stellen.',
      settings: [bora('8', { minutes: 10, note: 'Bräter, ggf. Brücke' })],
    },
    {
      text: 'Den Combair auf 160 °C Ober-/Unterhitze vorheizen. Im Bratfett das Gemüse anrösten, die Tomate hineinreiben und kurz einkochen. Mit dem Weinbrand (in Spanien Brandy de Jerez) und dem Rotwein ablöschen und etwas einkochen.',
      settings: [vzug('combair', 'Ober-/Unterhitze', 160, { note: 'vorheizen' }), bora('6', { note: 'Gemüse anrösten, ablöschen' })],
    },
    {
      text: 'Fleisch, Rinderfond, Lorbeer und Thymian in den Bräter geben – das Fleisch soll knapp bedeckt sein. Zugedeckt im vorgeheizten Combair bei 160 °C Ober-/Unterhitze 3,5 Stunden schmoren, nach der Hälfte die Stücke wenden.',
      settings: [vzug('combair', 'Ober-/Unterhitze', 160, { minutes: 210, note: 'Bräter mit Deckel, Ebene 1' })],
    },
    {
      text: 'In den letzten 30 Minuten den Wasserbehälter des CombiSteamers füllen, die Kartoffeln schälen, vierteln und im gelochten Garbehälter bei 100 °C 25 Minuten dämpfen.',
      settings: [vzug('steamer', 'Dämpfen', 100, { minutes: 25, note: 'gelochter Garbehälter' })],
    },
    {
      text: 'Garprobe: Das Fleisch löst sich mühelos vom Knochen. Die Stücke herausnehmen, die Sauce durch ein Sieb streichen oder pürieren und auf dem BORA offen 10 Minuten sämig einkochen, abschmecken.',
      settings: [bora('6', { minutes: 10, note: 'offen einkochen' })],
    },
    { text: 'Das Fleisch in der Sauce mit den Kartoffeln servieren – in Córdoba gibt es oft Pommes dazu. Rabo de toro schmeckt aufgewärmt noch besser: am Vortag schmoren, über Nacht kalt stellen und die feste Fettschicht abheben.' },
  ],
  'carrillada-iberica-al-pedro-ximenez': [
    { text: 'Die Schweinebäckchen von Sehnen und silbriger Haut befreien (Ibérico-Bäckchen gibt es bei spanischen Feinkost-Versänden und im Großmarkt, normale Schweinebäckchen beim Metzger vorbestellen). Salzen, pfeffern und im Weizenmehl wenden. Zwiebel, Möhre und Knoblauch fein würfeln.' },
    {
      text: 'Das Olivenöl in einem Schmortopf auf dem BORA erhitzen und die Bäckchen 6 Minuten rundum kräftig anbraten, herausnehmen. Das Gemüse im Bratfett 8 Minuten anrösten.',
      settings: [bora('8', { minutes: 6, note: 'Bäckchen anbraten' }), bora('5', { minutes: 8, note: 'Gemüse' })],
    },
    {
      text: 'Mit dem Pedro Ximénez ablöschen (ein sehr süßer, fast schwarzer Sherry aus getrockneten Trauben – Weinhandel oder online) und kurz einkochen. Bäckchen, Rinderfond, Lorbeer und Thymian zugeben, aufkochen und zugedeckt 2,5 Stunden ganz leise schmoren, ab und zu wenden.',
      settings: [bora('7', { note: 'aufkochen' }), bora('2', { minutes: 150, note: 'Deckel drauf' })],
    },
    {
      text: 'Für das Püree in den letzten 30 Minuten den Wasserbehälter des CombiSteamers füllen, die Kartoffeln schälen, vierteln und im gelochten Garbehälter bei 100 °C 25 Minuten dämpfen. Mit der warmen Milch und der Butter zerstampfen und salzen.',
      settings: [vzug('steamer', 'Dämpfen', 100, { minutes: 25, note: 'gelochter Garbehälter' })],
    },
    {
      text: 'Garprobe: Die Bäckchen lassen sich mit dem Löffel teilen. Herausnehmen, Lorbeer und Thymian entfernen, die Sauce pürieren und offen 10 Minuten zu einer glänzenden, dicken Sauce einkochen; abschmecken.',
      settings: [bora('5', { minutes: 10, note: 'offen einkochen' })],
    },
    { text: 'Die Bäckchen in der Sauce wenden und auf dem Püree anrichten.' },
  ],
  'secreto-iberico-con-patatas-panaderas': [
    {
      text: 'Den Combair auf 180 °C Heißluft vorheizen. Die Kartoffeln schälen und in 3–4 mm dünne Scheiben schneiden, Zwiebel und Paprika in feine Streifen, den Knoblauch in Scheiben.',
      settings: [vzug('combair', 'Heißluft', 180, { note: 'vorheizen' })],
    },
    {
      text: 'Alles in einer Auflaufform mit 2 EL Olivenöl, Salz und Pfeffer mischen, den Weißwein und 50 ml Wasser angießen. Im Combair bei 180 °C Heißluft 45 Minuten garen und nach 20 Minuten einmal wenden – die „Panaderas“ (früher beim Bäcker in der Restwärme gegart) sollen weich sein und an den Rändern bräunen.',
      settings: [vzug('combair', 'Heißluft', 180, { minutes: 45, note: 'Auflaufform, Ebene 2' })],
    },
    { text: 'Den Secreto 20 Minuten vor dem Braten aus dem Kühlschrank nehmen und trocken tupfen. Das „Geheimnis“ ist ein dünner, stark marmorierter Muskel zwischen Schulter und Rückenspeck des Ibérico-Schweins (spanische Feinkost-Versände, Großmarkt, oft tiefgekühlt); Ersatz: Schweinenacken in 1,5 cm dicken Scheiben.' },
    {
      text: 'Die Plancha (Gusseisenpfanne) ohne Fett auf dem BORA 5 Minuten sehr heiß werden lassen. Den Secreto am Stück mit dem restlichen Olivenöl einreiben und 3 Minuten je Seite kräftig bräunen; innen darf er bei Ibérico leicht rosa bleiben.',
      settings: [
        plancha('bora', 'Vorheizen', { level: '8', minutes: 5 }),
        plancha('bora', 'Braten', { level: '8', minutes: 6, note: 'nach 3 Min. wenden' }),
        plancha('gasgrill', 'Braten', { level: 'hoch', minutes: 6, note: 'Plancha 10 Min. mit Deckel zu vorheizen', alt: true }),
      ],
    },
    { text: 'Den Secreto 3 Minuten ruhen lassen, quer zur Faser in Streifen schneiden, mit grobem Salz und gehackter Petersilie bestreuen und auf den Kartoffeln servieren.' },
  ],
  'cordero-al-chilindron': [
    { text: 'Die Ñoras (getrocknete runde Paprika; in Aragón nimmt man die ähnliche „Pimiento choricero“) entkernen und 30 Minuten in heißem Wasser einweichen. Danach das rote Fruchtfleisch mit einem Löffel von der Haut kratzen.' },
    { text: 'Die Lammschulter von groben Fettstücken befreien, in 4 cm große Stücke schneiden, salzen und pfeffern. Paprika und Zwiebel in Streifen, Knoblauch in Scheiben und den Serrano-Schinken in feine Streifen schneiden.' },
    {
      text: 'Das Olivenöl im Schmortopf auf dem BORA stark erhitzen und das Lamm in zwei Portionen rundum kräftig anbraten, herausnehmen.',
      settings: [bora('8', { note: 'portionsweise anbraten' })],
    },
    {
      text: 'Zwiebel, Paprika, Knoblauch und Serrano-Schinken im Bratfett 10 Minuten weich schmoren. Die Tomaten hineinreiben und 5 Minuten einkochen. Von der Kochzone ziehen, Paprikapulver und Ñora-Fruchtfleisch einrühren.',
      settings: [bora('4', { minutes: 15 })],
    },
    {
      text: 'Das Lamm zurück in den Topf geben, mit dem Weißwein ablöschen, den Lorbeer zugeben und zugedeckt 75 Minuten leise schmoren; nur so viel Wasser nachgießen, dass eine dicke Sauce bleibt. Garprobe: Das Fleisch lässt sich mit der Gabel zerteilen.',
      settings: [bora('2', { minutes: 75, note: 'Deckel drauf' })],
    },
    { text: 'Abschmecken und mit Brot servieren. Der Name kommt von einem alten Kartenspiel; in Aragón und Navarra wird so auch Huhn geschmort.' },
  ],
  'estofado-de-ternera': [
    { text: 'Das Rindergulasch (in Spanien nimmt man „Morcillo“ aus der Hesse oder „Aguja“ aus dem Nacken) trocken tupfen, salzen und pfeffern. Zwiebel und Knoblauch fein würfeln, die Möhren in Scheiben schneiden.' },
    {
      text: 'Das Olivenöl in einem Schmortopf auf dem BORA stark erhitzen und das Fleisch in zwei Portionen kräftig anbraten, herausnehmen.',
      settings: [bora('8', { note: 'portionsweise anbraten' })],
    },
    {
      text: 'Zwiebel und Knoblauch im Bratfett glasig dünsten, die Tomate hineinreiben und kurz einkochen. Von der Kochzone ziehen, das Paprikapulver einrühren und sofort mit dem Rotwein ablöschen.',
      settings: [bora('4', { note: 'glasig dünsten' })],
    },
    {
      text: 'Fleisch, Rinderfond, Möhren und Lorbeer zugeben, aufkochen und zugedeckt 75 Minuten leise schmoren.',
      settings: [bora('7', { note: 'aufkochen' }), bora('2', { minutes: 75, note: 'Deckel drauf' })],
    },
    {
      text: 'Die Kartoffeln schälen, in Stücke brechen (anschneiden und abbrechen – das bindet die Sauce) und zugeben, bei Bedarf so viel Wasser angießen, dass sie knapp bedeckt sind. Weitere 25 Minuten schmoren, in den letzten 5 Minuten die Erbsen zugeben.',
      settings: [bora('3', { minutes: 25, note: 'Deckel drauf' })],
    },
    { text: 'Garprobe: Fleisch und Kartoffeln sind weich. Abschmecken, Lorbeer entfernen und 10 Minuten ruhen lassen.' },
  ],
  'solomillo-con-pimientos-asados': [
    {
      text: 'Den Combair auf 200 °C Heißluft vorheizen. Die ganzen Paprika und die halbierten Kartoffeln mit Schale mit 1 EL Olivenöl einreiben, salzen und auf ein Blech legen.',
      settings: [vzug('combair', 'Heißluft', 200, { note: 'vorheizen' })],
    },
    {
      text: 'Im Combair bei 200 °C Heißluft 40 Minuten rösten, die Paprika nach der Hälfte wenden, bis die Haut schwarze Blasen wirft und die Kartoffeln weich sind.',
      settings: [vzug('combair', 'Heißluft', 200, { minutes: 40, note: 'Blech, Ebene 2' })],
    },
    { text: 'Die Paprika sofort in eine Schüssel legen, abdecken und 10 Minuten ziehen lassen – dann löst sich die Haut leicht. Häuten, entkernen und in Streifen zupfen, den Saft auffangen.' },
    { text: 'Die Paprikastreifen mit dem Saft, dem in feine Scheiben geschnittenen Knoblauch, 1 EL Olivenöl, Sherryessig und Salz anmachen – so sind „Pimientos asados“ in Andalusien auch eine eigene Vorspeise und schmecken lauwarm am besten.' },
    {
      text: 'Das Schweinefilet in 3 cm dicke Medaillons schneiden, leicht flach drücken, salzen und pfeffern. Die Plancha (Gusseisenpfanne) auf dem BORA 5 Minuten sehr heiß werden lassen, die Medaillons mit dem restlichen Olivenöl einpinseln und 3 Minuten je Seite braten, bis sie innen gerade zartrosa sind.',
      settings: [
        plancha('bora', 'Vorheizen', { level: '8', minutes: 5 }),
        plancha('bora', 'Braten', { level: '7', minutes: 6, note: 'nach 3 Min. wenden' }),
      ],
    },
    { text: 'Die Medaillons 2 Minuten ruhen lassen und mit den Paprika und den Kartoffeln servieren.' },
  ],
  'pisto-manchego-con-huevo': [
    { text: 'Die Tomaten halbieren und auf der groben Reibe reiben, die Haut bleibt in der Hand. Zwiebel, Paprika und Zucchini in 1 cm große Würfel schneiden, den Knoblauch hacken.' },
    {
      text: '2 EL Olivenöl in einer breiten Pfanne auf dem BORA erhitzen und die Zwiebel mit dem Knoblauch glasig dünsten. Die Paprika zugeben und 10 Minuten weich schmoren.',
      settings: [bora('4', { minutes: 10 })],
    },
    {
      text: 'Die Zucchini zugeben und kurz mitschmoren, dann Tomaten, Zucker und Salz zugeben und offen 25 Minuten leise einkochen, ab und zu umrühren, bis das Pisto dick und fast marmeladig ist. Jedes Gemüse kommt nacheinander in die Pfanne – so behält es seinen eigenen Geschmack.',
      settings: [bora('3', { minutes: 25, note: 'offen einkochen' })],
    },
    {
      text: 'Kurz vor dem Servieren die Eier im restlichen Olivenöl in einer zweiten Pfanne zu Spiegeleiern braten, bis das Eiweiß fest und das Eigelb noch flüssig ist (ca. 3 Minuten). Das Weißbrot rösten.',
      settings: [bora('5', { minutes: 3 })],
    },
    { text: 'Das Pisto mit Pfeffer abschmecken, auf Teller verteilen, je zwei Spiegeleier darauflegen und mit dem Brot servieren. In La Mancha bricht man das Eigelb auf und tunkt es mit Brot und Gemüse auf. Pisto hält im Kühlschrank 3 Tage und schmeckt warm wie kalt.' },
  ],
  'huevos-rotos-con-jamon': [
    { text: 'Die Kartoffeln schälen, in 1 cm dicke Stäbchen schneiden, 10 Minuten wässern und gut trocken tupfen. Mit 2 EL Olivenöl und Salz mischen.' },
    {
      text: 'Den Airfryer auf 190 °C vorheizen und die Kartoffeln darin 22 Minuten goldbraun und knusprig backen, dabei zweimal schütteln. Klassisch werden sie in reichlich Olivenöl frittiert – im Airfryer spart das rund 200 kcal je Portion.',
      settings: [{ device: 'airfryer', mode: 'Heissluft', temp: 190, minutes: 22, note: 'vorheizen, 2× schütteln' }],
    },
    {
      text: 'In den letzten 5 Minuten das restliche Olivenöl in einer Pfanne auf dem BORA erhitzen und die Eier darin braten, bis das Eiweiß fest und am Rand knusprig ist, das Eigelb aber flüssig bleibt (ca. 3 Minuten).',
      settings: [bora('6', { minutes: 3 })],
    },
    { text: 'Die Kartoffeln auf eine Platte geben, den Serrano-Schinken in Stücken darauf verteilen und die Spiegeleier obenauf legen. Am Tisch mit Messer und Gabel „zerbrechen“ – das Eigelb läuft über die Kartoffeln, darum geht es. Berühmt gemacht hat sie das Madrider Lokal „Casa Lucio“.' },
  ],
}
