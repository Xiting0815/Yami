import type { Device, DeviceSetting, DeviceStep } from '../../types'

type Opts = { minutes?: number; note?: string; temp?: number; core?: number }

/** BORA-Kochzone mit Stufe */
const bora = (level: string, o: Opts = {}): DeviceSetting => ({ device: 'bora', mode: 'Kochzone', level, ...o })
/** Gerät mit Betriebsart und Temperatur */
const dev = (device: Device, mode: string, temp: number, o: Opts = {}): DeviceSetting => ({ device, mode, temp, ...o })
/** Wasser aufkochen (Deckel) */
const boil = (): DeviceSetting => bora('Power', { note: 'aufkochen' })
/** Nudeln sprudelnd kochen: Power, dann Stufe 7 */
const pasta = (minutes: number): DeviceSetting[] => [boil(), bora('7', { minutes, note: 'Nudeln' })]

/** Geräte-Schritte (Rezept-ID → Schritte), Gruppe: it. Stil siehe docs/geraete/regeln.md */
export const DEVICE_STEPS: Record<string, DeviceStep[]> = {
  // ───────────── Pasta ─────────────
  'ragu-bolognese': [
    { text: 'Pancetta fein würfeln und im Olivenöl auslassen.', settings: [bora('5', { minutes: 4 })] },
    { text: 'Möhre, Sellerie und Zwiebel sehr fein würfeln (Soffritto), zur Pancetta geben und 10 Minuten sanft andünsten.', settings: [bora('4', { minutes: 10 })] },
    { text: 'Rinderhackfleisch und Schweinehackfleisch zugeben und braten, bis es krümelig ist und Röstaromen hat. Tomatenmark mitrösten und mit Rotwein ablöschen.', settings: [bora('8', { minutes: 8, note: 'Brücke' })] },
    { text: 'Passierte Tomaten und 200 ml Wasser zugeben, mit Deckel aufkochen und 2,5 Stunden bei kleinster Hitze schmoren. Bei Bedarf Wasser nachgießen. Zum Schluss die Milch einrühren und abschmecken.', settings: [bora('9', { note: 'aufkochen' }), bora('2', { minutes: 150, note: 'schmoren' })] },
    { text: 'Tagliatelle in Salzwasser bissfest kochen, mit dem Ragù und etwas Nudelwasser vermengen und mit Parmigiano Reggiano servieren.', settings: pasta(8) },
  ],
  carbonara: [
    { text: 'Guanciale in Streifen schneiden und in einer Pfanne ohne Fett langsam knusprig auslassen. Pfanne danach von der Kochzone nehmen.', settings: [bora('4', { minutes: 8, note: 'ohne Fett' })] },
    { text: 'Eigelbe, Ei, fein geriebenen Pecorino Romano und reichlich frisch gemahlenen Pfeffer zu einer dicken Creme verrühren.' },
    { text: 'Spaghetti in nur leicht gesalzenem Wasser bissfest kochen. Abgießen und eine Tasse Nudelwasser auffangen.', settings: pasta(9) },
    { text: 'Spaghetti in die Pfanne zum Guanciale geben. Abseits der Hitze die Eiercreme und einen Schuss Nudelwasser unterrühren, bis eine cremige Sauce entsteht. Die Eier dürfen nicht stocken. Sofort mit Pecorino und Pfeffer servieren.' },
  ],
  'aglio-olio': [
    { text: 'Spaghetti in Salzwasser bissfest kochen.', settings: pasta(9) },
    { text: 'Knoblauch in feine Scheiben, Chili in Ringe schneiden. Im Olivenöl bei niedriger Hitze goldgelb werden lassen, nicht braun.', settings: [bora('3', { minutes: 4, note: 'nicht braun' })] },
    { text: 'Spaghetti mit etwas Nudelwasser in die Pfanne geben und kräftig schwenken, bis eine leichte Emulsion entsteht.', settings: [bora('5', { minutes: 1 })] },
    { text: 'Gehackte Petersilie unterheben und sofort servieren.' },
  ],
  'cacio-e-pepe': [
    { text: 'Pecorino Romano sehr fein reiben. Pfefferkörner grob mörsern und in einer Pfanne ohne Fett kurz rösten.', settings: [bora('5', { minutes: 1, note: 'ohne Fett' })] },
    { text: 'Spaghetti in wenig, nur leicht gesalzenem Wasser kochen, damit das Nudelwasser stärkehaltig wird.', settings: pasta(9) },
    { text: 'Pecorino mit ein paar Löffeln lauwarmem Nudelwasser zu einer glatten Creme verrühren.' },
    { text: 'Spaghetti mit etwas Nudelwasser in die Pfefferpfanne geben, die Pfanne von der Kochzone nehmen, die Käsecreme unterrühren und cremig schwenken.' },
  ],
  amatriciana: [
    { text: 'Guanciale in Streifen schneiden und ohne Fett knusprig auslassen. Chili kurz mitbraten und mit Weißwein ablöschen.', settings: [bora('4', { minutes: 8 })] },
    { text: 'Guanciale herausnehmen. Geschälte Tomaten zerdrücken, ins Fett geben und 15 Minuten einkochen.', settings: [bora('5', { minutes: 15, note: 'einkochen' })] },
    { text: 'Bucatini in Salzwasser bissfest kochen.', settings: pasta(10) },
    { text: 'Guanciale zurück in die Sauce geben, Bucatini untermischen und mit Pecorino Romano servieren.' },
  ],
  arrabbiata: [
    { text: 'Knoblauch und Chili fein hacken und im Olivenöl anschwitzen.', settings: [bora('4', { minutes: 2 })] },
    { text: 'Geschälte Tomaten zerdrücken, zugeben, salzen und 15 Minuten scharf einkochen.', settings: [bora('6', { minutes: 15, note: 'einkochen' })] },
    { text: 'Penne in Salzwasser bissfest kochen und mit der Sauce vermengen.', settings: pasta(10) },
    { text: 'Mit Petersilie bestreuen.' },
  ],
  vongole: [
    { text: 'Venusmuscheln eine Stunde in Salzwasser legen, damit sie Sand verlieren. Geöffnete Muscheln aussortieren.' },
    { text: 'Knoblauch und Chili im Olivenöl anschwitzen. Muscheln und Weißwein zugeben, Deckel auflegen und 3 bis 4 Minuten garen, bis sie sich öffnen. Geschlossene Muscheln wegwerfen.', settings: [bora('4', { minutes: 2, note: 'Knoblauch' }), bora('7', { minutes: 4, note: 'Deckel drauf' })] },
    { text: 'Spaghetti 2 Minuten vor Ende der Garzeit abgießen und im Muschelsud fertig garen.', settings: [...pasta(7), bora('6', { minutes: 2, note: 'im Sud fertig' })] },
    { text: 'Mit reichlich Petersilie und einem Schuss Olivenöl servieren.' },
  ],
  'al-pomodoro': [
    { text: 'Knoblauch angedrückt im Olivenöl langsam anbraten und wieder herausnehmen.', settings: [bora('4', { minutes: 3 })] },
    { text: 'Datteltomaten halbieren, ins Öl geben, salzen und 15 Minuten zu einer Sauce zerfallen lassen.', settings: [bora('5', { minutes: 15 })] },
    { text: 'Spaghetti bissfest kochen und in der Sauce schwenken.', settings: pasta(9) },
    { text: 'Basilikum zupfen, unterheben und mit Parmigiano Reggiano servieren.' },
  ],
  puttanesca: [
    { text: 'Knoblauch, Chili und Sardellenfilets im Olivenöl anschwitzen, bis die Sardellen zerfallen.', settings: [bora('4', { minutes: 3 })] },
    { text: 'Geschälte Tomaten, entkernte schwarze Oliven und Kapern zugeben und 10 Minuten köcheln lassen.', settings: [bora('4', { minutes: 10 })] },
    { text: 'Spaghetti bissfest kochen und in der Sauce schwenken.', settings: pasta(9) },
    { text: 'Mit Petersilie servieren.' },
  ],
  'alla-norma': [
    { text: 'Aubergine würfeln, salzen und 20 Minuten ziehen lassen. Trocken tupfen und im Olivenöl goldbraun braten. Beim Braten den Abzug eine Stufe höher stellen.', settings: [bora('7', { minutes: 8, note: 'Abzug höher' })] },
    { text: 'Knoblauch anschwitzen, geschälte Tomaten zugeben und 15 Minuten einkochen.', settings: [bora('5', { minutes: 15 })] },
    { text: 'Rigatoni kochen, mit Sauce und Auberginen vermengen und Basilikum unterheben.', settings: pasta(11) },
    { text: 'Großzügig mit geriebener Ricotta salata bestreuen.' },
  ],
  'pesto-genovese': [
    { text: 'Basilikumblätter, Pinienkerne, Knoblauch und eine Prise grobes Salz im Mörser oder kurz im Mixer zerkleinern. Parmigiano Reggiano, Pecorino Romano und Olivenöl einarbeiten, nicht zu warm werden lassen.' },
    { text: 'Kartoffeln klein würfeln und grüne Bohnen in Stücke schneiden. Im Nudelwasser mitkochen.', settings: [boil(), bora('7', { minutes: 8, note: 'Kartoffeln, Bohnen' })] },
    { text: 'Trofie zugeben und bissfest garen.', settings: [bora('7', { minutes: 10 })] },
    { text: 'Abgießen und mit Pesto und etwas Nudelwasser vermengen.' },
  ],
  'orecchiette-salsiccia': [
    { text: 'Brokkoli in kleine Röschen teilen und mit den Orecchiette zusammen in Salzwasser kochen.', settings: pasta(12) },
    { text: 'Salsiccia aus der Haut drücken und zerbröselt im Olivenöl anbraten. Knoblauch und Chili zugeben.', settings: [bora('7', { minutes: 8 })] },
    { text: 'Orecchiette und Brokkoli abgießen, in die Pfanne geben und mit etwas Nudelwasser schwenken, bis der Brokkoli leicht zerfällt.', settings: [bora('5', { minutes: 2 })] },
    { text: 'Mit Pecorino Romano servieren.' },
  ],
  gricia: [
    { text: 'Guanciale in Streifen schneiden und langsam knusprig auslassen.', settings: [bora('4', { minutes: 8, note: 'ohne Fett' })] },
    { text: 'Rigatoni in leicht gesalzenem Wasser bissfest kochen.', settings: pasta(11) },
    { text: 'Rigatoni mit einer Kelle Nudelwasser zum Guanciale geben.' },
    { text: 'Pfanne von der Kochzone nehmen und Pecorino Romano und Pfeffer unterrühren, bis die Sauce cremig ist.' },
  ],
  'penne-vodka': [
    { text: 'Schalotte in Butter glasig dünsten, Tomatenmark und Chili zugeben und anrösten.', settings: [bora('4', { minutes: 5 })] },
    { text: 'Mit Wodka ablöschen und einkochen. Passierte Tomaten und Sahne zugeben und 10 Minuten köcheln lassen.', settings: [bora('6', { minutes: 2, note: 'Wodka einkochen' }), bora('4', { minutes: 10 })] },
    { text: 'Penne bissfest kochen und mit der Sauce vermengen.', settings: pasta(10) },
    { text: 'Mit Parmigiano Reggiano servieren.' },
  ],
  'tagliatelle-funghi': [
    { text: 'Steinpilze in 150 ml warmem Wasser 20 Minuten einweichen, ausdrücken und hacken. Das Einweichwasser durch ein Sieb gießen.' },
    { text: 'Champignons in Scheiben im Olivenöl scharf anbraten. Knoblauch und Steinpilze zugeben. Beim scharfen Anbraten den Abzug eine Stufe höher stellen.', settings: [bora('8', { minutes: 8, note: 'Abzug höher' })] },
    { text: 'Mit Weißwein und Einweichwasser ablöschen, Sahne zugeben und einkochen.', settings: [bora('5', { minutes: 8, note: 'einkochen' })] },
    { text: 'Tagliatelle in Salzwasser kochen, untermischen und mit Petersilie und Parmigiano Reggiano servieren.', settings: pasta(8) },
  ],
  'spaghetti-limone': [
    { text: 'Spaghetti in Salzwasser bissfest kochen.', settings: pasta(9) },
    { text: 'Butter mit fein abgeriebener Zitronenschale und dem Saft einer Zitrone schmelzen.', settings: [bora('Schmelzen', { note: 'Butter' })] },
    { text: 'Spaghetti mit etwas Nudelwasser in die Pfanne geben, Parmigiano Reggiano unterrühren und cremig schwenken.', settings: [bora('4', { minutes: 2 })] },
    { text: 'Mit Pfeffer und Basilikum servieren.' },
  ],
  nerano: [
    { text: 'Zucchini in dünne Scheiben schneiden und im heißen Sonnenblumenöl goldbraun frittieren. Abtropfen lassen und salzen. Beim Frittieren den Abzug eine Stufe höher stellen.', settings: [bora('7', { minutes: 10, note: 'Abzug höher' })] },
    { text: 'Zwei Drittel der Zucchini mit etwas Nudelwasser zu einer Creme pürieren.' },
    { text: 'Spaghetti bissfest kochen und mit Zucchinicreme, Butter, Zucchinischeiben, Provolone und Parmigiano Reggiano vermengen.', settings: pasta(9) },
    { text: 'Mit Basilikum und Pfeffer servieren.' },
  ],
  'linguine-gamberi': [
    { text: 'Garnelen auftauen und trocken tupfen.' },
    { text: 'Knoblauch und Chili im Olivenöl anschwitzen, Garnelen 2 Minuten scharf anbraten und herausnehmen.', settings: [bora('4', { minutes: 2, note: 'Knoblauch' }), bora('8', { minutes: 2, note: 'Garnelen' })] },
    { text: 'Halbierte Kirschtomaten in die Pfanne geben, mit Weißwein ablöschen und 5 Minuten schmoren.', settings: [bora('5', { minutes: 5 })] },
    { text: 'Linguine bissfest kochen und mit Garnelen und Petersilie in der Pfanne schwenken. Mit Zitronenschale servieren.', settings: pasta(9) },
  ],
  'tortellini-panna': [
    { text: 'Kochschinken würfeln und in Butter kurz anbraten.', settings: [bora('6', { minutes: 3 })] },
    { text: 'Sahne und Erbsen zugeben und 5 Minuten einkochen. Mit Muskat und Pfeffer würzen.', settings: [bora('5', { minutes: 5 })] },
    { text: 'Tortellini nach Packungsanweisung kochen.', settings: [boil(), bora('5', { minutes: 4, note: 'Tortellini' })] },
    { text: 'In der Sauce schwenken und mit Parmigiano Reggiano servieren.' },
  ],
  'gnocchi-gorgonzola': [
    { text: 'Gorgonzola mit der Sahne bei kleiner Hitze schmelzen.', settings: [bora('3', { minutes: 6 })] },
    { text: 'Walnüsse grob hacken und ohne Fett rösten.', settings: [bora('5', { minutes: 3, note: 'ohne Fett' })] },
    { text: 'Gnocchi in Salzwasser garen, bis sie oben schwimmen.', settings: [boil(), bora('6', { minutes: 3, note: 'bis sie schwimmen' })] },
    { text: 'In der Sauce schwenken und mit Walnüssen, Parmigiano Reggiano und Pfeffer servieren.' },
  ],
  'gnocchi-salbei': [
    { text: 'Kartoffeln mit Schale im CombiSteamer dämpfen, pellen und noch heiß durch die Presse drücken. Ausdampfen lassen. Den CombiSteamer vorheizen.', settings: [dev('steamer', 'Dämpfen', 100, { minutes: 35, note: 'ganze Kartoffeln' })] },
    { text: 'Mit Weizenmehl, Eigelb, Salz und Muskat rasch zu einem Teig verkneten. Rollen formen, in Stücke schneiden und über eine Gabel abrollen.' },
    { text: 'In siedendem Salzwasser garen, bis sie aufsteigen, und abschöpfen.', settings: [boil(), bora('4', { minutes: 3, note: 'bis sie aufsteigen' })] },
    { text: 'Butter mit Salbeiblättern aufschäumen, bis sie nussig duftet. Gnocchi darin schwenken und mit Parmigiano Reggiano servieren.', settings: [bora('5', { minutes: 4, note: 'Salbeibutter' })] },
  ],
  'ravioli-salbei': [
    { text: 'Ravioli in Salzwasser nach Packungsanweisung garen.', settings: [boil(), bora('4', { minutes: 4, note: 'sanft sieden' })] },
    { text: 'Butter mit Salbeiblättern bei mittlerer Hitze aufschäumen und leicht bräunen lassen.', settings: [bora('5', { minutes: 4 })] },
    { text: 'Ravioli mit einem Schuss Nudelwasser in der Butter schwenken.' },
    { text: 'Mit Parmigiano Reggiano, Zitronenschale und Pfeffer servieren.' },
  ],
  'pasta-tonno': [
    { text: 'Knoblauch und Chili im Olivenöl anschwitzen.', settings: [bora('4', { minutes: 2 })] },
    { text: 'Geschälte Tomaten und Kapern zugeben und 10 Minuten einkochen.', settings: [bora('5', { minutes: 10 })] },
    { text: 'Thunfisch zerpflücken und kurz in der Sauce erwärmen.', settings: [bora('3', { minutes: 2 })] },
    { text: 'Spaghetti in Salzwasser bissfest kochen, mit der Sauce vermengen und Petersilie unterheben.', settings: pasta(9) },
  ],
  'pasta-genovese': [
    { text: 'Rindergulasch in großen Stücken im Olivenöl anbraten. Fein gewürfelte Möhre und Sellerie zugeben.', settings: [bora('8', { minutes: 8, note: 'Brücke' })] },
    { text: 'Zwiebeln in feine Streifen schneiden und zugeben. Salzen und mit Weißwein ablöschen.', settings: [bora('5', { minutes: 5 })] },
    { text: 'Zugedeckt bei kleinster Hitze 3 Stunden schmoren, bis die Zwiebeln zu einer goldbraunen Creme zerfallen. Das Fleisch dabei zerfasern.', settings: [bora('2', { minutes: 180, note: 'Deckel drauf' })] },
    { text: 'Ziti in Stücke brechen, in Salzwasser kochen, mit dem Ragù vermengen und mit Parmigiano Reggiano servieren.', settings: pasta(11) },
  ],
  'rigatoni-salsiccia': [
    { text: 'Salsiccia aus der Haut drücken und zerbröselt im Olivenöl mit Schalotte und Rosmarin anbraten.', settings: [bora('7', { minutes: 8 })] },
    { text: 'Mit Weißwein ablöschen, Passierte Tomaten und Sahne zugeben und 10 Minuten köcheln lassen.', settings: [bora('4', { minutes: 10 })] },
    { text: 'Rigatoni bissfest kochen und mit der Sauce vermengen.', settings: pasta(11) },
    { text: 'Mit Parmigiano Reggiano servieren.' },
  ],
  'spaghetti-polpette': [
    { text: 'Weißbrot einweichen und ausdrücken. Mit Hackfleisch, Ei, Parmigiano Reggiano, Petersilie, Knoblauch, Salz und Pfeffer verkneten und walnussgroße Bällchen formen.' },
    { text: 'Bällchen im Olivenöl rundum anbraten.', settings: [bora('6', { minutes: 8 })] },
    { text: 'Zwiebel zugeben, Geschälte Tomaten und Passierte Tomaten zugeben und die Polpette darin 30 Minuten sanft schmoren.', settings: [bora('3', { minutes: 30, note: 'Deckel drauf' })] },
    { text: 'Spaghetti in Salzwasser kochen und mit den Polpette und Basilikum servieren.', settings: pasta(9) },
  ],
  'penne-salmone': [
    { text: 'Lachs würfeln. Schalotte in Butter dünsten und Tomatenmark kurz mitrösten.', settings: [bora('4', { minutes: 4 })] },
    { text: 'Mit Wodka ablöschen, Sahne zugeben und 5 Minuten einkochen.', settings: [bora('5', { minutes: 5 })] },
    { text: 'Lachs in der Sauce 3 Minuten gar ziehen lassen und mit Zitrone abschmecken.', settings: [bora('Simmern', { minutes: 3 })] },
    { text: 'Penne bissfest kochen, mit der Sauce vermengen und mit Dill bestreuen.', settings: pasta(10) },
  ],
  'pesto-rosso': [
    { text: 'Getrocknete Tomaten, Mandeln, Knoblauch, Basilikum, Chili, Ricotta, Parmigiano Reggiano und Olivenöl zu einem Pesto pürieren.' },
    { text: 'Fusilli in Salzwasser bissfest kochen.', settings: pasta(10) },
    { text: 'Fusilli mit Pesto und etwas Nudelwasser vermengen.' },
    { text: 'Mit Basilikum garnieren.' },
  ],
  'spaghetti-cozze': [
    { text: 'Miesmuscheln putzen und entbarten. Geöffnete Muscheln aussortieren.' },
    { text: 'Knoblauch und Chili im Olivenöl anschwitzen. Muscheln und Weißwein zugeben und zugedeckt garen, bis sie sich öffnen.', settings: [bora('4', { minutes: 2, note: 'Knoblauch' }), bora('7', { minutes: 5, note: 'Deckel drauf' })] },
    { text: 'Halbe Muscheln auslösen. Kirschtomaten in den Sud geben und 5 Minuten köcheln lassen.', settings: [bora('4', { minutes: 5 })] },
    { text: 'Spaghetti al dente kochen, im Sud fertig garen und mit Muscheln und Petersilie servieren.', settings: [...pasta(7), bora('6', { minutes: 2, note: 'im Sud fertig' })] },
  ],
  boscaiola: [
    { text: 'Schalotte und Schinkenwürfel in Butter anbraten. Champignons in Scheiben zugeben und kräftig braten.', settings: [bora('7', { minutes: 8, note: 'Abzug höher' })] },
    { text: 'Sahne und Passierte Tomaten zugeben und 8 Minuten einkochen.', settings: [bora('5', { minutes: 8 })] },
    { text: 'Penne bissfest kochen und mit der Sauce vermengen.', settings: pasta(10) },
    { text: 'Mit Petersilie und Parmigiano Reggiano servieren.' },
  ],
  'broccoli-acciughe': [
    { text: 'Paniermehl in 1 EL Olivenöl goldbraun rösten und beiseitestellen.', settings: [bora('5', { minutes: 3, note: 'ständig rühren' })] },
    { text: 'Brokkoli in kleinen Röschen zusammen mit den Orecchiette in Salzwasser kochen.', settings: pasta(12) },
    { text: 'Sardellenfilets, Knoblauch und Chili im restlichen Olivenöl zerfallen lassen.', settings: [bora('4', { minutes: 3 })] },
    { text: 'Orecchiette und Brokkoli darin mit etwas Nudelwasser schwenken und mit den Bröseln servieren.', settings: [bora('5', { minutes: 2 })] },
  ],
  'fettuccine-alfredo': [
    { text: 'Fettuccine in Salzwasser bissfest kochen.', settings: pasta(9) },
    { text: 'Butter in Stücken in eine vorgewärmte Schüssel geben.' },
    { text: 'Fettuccine mit einer Kelle Nudelwasser zur Butter geben und fein geriebenen Parmigiano Reggiano nach und nach unterrühren, bis eine seidige Sauce entsteht.' },
    { text: 'Sofort mit Pfeffer servieren.' },
  ],

  // ───────────── Hauptgerichte ─────────────
  'risotto-funghi': [
    { text: 'Getrocknete Steinpilze in warmem Wasser einweichen, hacken und das Wasser zur Gemüsebrühe geben. Brühe heiß halten.', settings: [bora('Warmhalten', { note: 'Brühe heiß halten' })] },
    { text: 'Champignons in Scheiben im Olivenöl anbraten und beiseitestellen. Danach Schalotte im selben Topf glasig dünsten, Risottoreis zugeben und glasig rösten. Mit Weißwein ablöschen.', settings: [bora('8', { minutes: 5, note: 'Champignons' }), bora('4', { minutes: 3, note: 'Schalotte' }), bora('5', { minutes: 2, note: 'Reis rösten' })] },
    { text: 'Unter Rühren nach und nach Brühe angießen, 18 Minuten. Zwischendurch die angebratenen Champignons und Steinpilze zugeben.', settings: [bora('5', { minutes: 18, note: 'rühren' })] },
    { text: 'Vom Herd nehmen und kalte Butter und Parmigiano Reggiano kräftig unterrühren (mantecare). 2 Minuten ruhen lassen und mit Petersilie servieren.' },
  ],
  'risotto-milanese': [
    { text: 'Safran in etwas heißer Hühnerbrühe auflösen. Restliche Brühe heiß halten.', settings: [bora('Warmhalten', { note: 'Brühe heiß halten' })] },
    { text: 'Schalotte in 20 g Butter dünsten, Risottoreis glasig rösten und mit Weißwein ablöschen.', settings: [bora('4', { minutes: 3 }), bora('5', { minutes: 2, note: 'Reis rösten' })] },
    { text: 'Nach und nach Brühe angießen und rühren. Nach 10 Minuten den Safran zugeben.', settings: [bora('5', { minutes: 18, note: 'rühren' })] },
    { text: 'Nach 18 Minuten vom Herd nehmen, restliche kalte Butter und Parmigiano Reggiano einrühren und cremig servieren.' },
  ],
  'risotto-zucca': [
    { text: 'Hokkaido-Kürbis fein würfeln. Die Hälfte mit der Schalotte in Butter andünsten.', settings: [bora('4', { minutes: 6 })] },
    { text: 'Risottoreis zugeben, glasig rösten und mit Weißwein ablöschen.', settings: [bora('5', { minutes: 3 })] },
    { text: 'Gemüsebrühe nach und nach angießen. Nach 8 Minuten die restlichen Kürbiswürfel zugeben.', settings: [bora('5', { minutes: 18, note: 'rühren' })] },
    { text: 'Mit Butter, Parmigiano Reggiano und Muskat cremig rühren. Salbei in Butter knusprig braten und darüber geben.', settings: [bora('5', { minutes: 2, note: 'Salbei braten' })] },
  ],
  saltimbocca: [
    { text: 'Kartoffeln würfeln, mit Olivenöl, Rosmarin und Salz mischen und auf einem Blech auf Ebene 2 in den vorgeheizten Combair schieben.', settings: [dev('combair', 'Heißluft', 190, { minutes: 35, note: 'vorheizen, Ebene 2' })] },
    { text: 'Kalbsschnitzel dünn klopfen, pfeffern, mit je einer Scheibe Parmaschinken und einem Salbeiblatt belegen und mit einem Zahnstocher feststecken.' },
    { text: 'Die Unterseite leicht mit Mehl bestäuben. In Butter erst auf der Schinkenseite, dann auf der anderen Seite je 1 bis 2 Minuten braten.', settings: [bora('6', { minutes: 4, note: 'Pfanne vorheizen' })] },
    { text: 'Mit Weißwein ablöschen, etwas einkochen und die Sauce über das Fleisch geben.', settings: [bora('5', { minutes: 2 })] },
  ],
  ossobuco: [
    { text: 'Kalbshaxenscheiben am Rand einschneiden, damit sie sich nicht wölben, salzen, pfeffern und mit Mehl bestäuben. In Butter rundum anbraten.', settings: [bora('7', { minutes: 8, note: 'Brücke' })] },
    { text: 'Zwiebel, Möhre und Sellerie fein würfeln und mitdünsten. Tomatenmark kurz mitrösten und mit Weißwein ablöschen.', settings: [bora('5', { minutes: 6 })] },
    { text: 'Kalbsfond angießen und die Haxen im geschlossenen Bräter im CombiSteamer 1,5 bis 2 Stunden sanft schmoren. Den CombiSteamer vorheizen.', settings: [dev('steamer', 'Heißluft feucht', 150, { minutes: 105, note: 'vorheizen, Ebene 2' })] },
    { text: 'Für die Gremolata Zitronenschale, Knoblauch und Petersilie fein hacken und darüber streuen. Dazu Risottoreis kochen: Reis in wenig Butter glasig rösten und mit heißem Wasser unter Rühren garen.', settings: [bora('5', { minutes: 18, note: 'Reis, rühren' })] },
  ],
  'pollo-cacciatora': [
    { text: 'Hähnchenschenkel salzen und pfeffern und im Olivenöl rundum goldbraun anbraten.', settings: [bora('7', { minutes: 10, note: 'Brücke' })] },
    { text: 'Zwiebel und Knoblauch zugeben und mit Rotwein ablöschen.', settings: [bora('5', { minutes: 4 })] },
    { text: 'Geschälte Tomaten, schwarze Oliven, Rosmarin und Thymian zugeben, den Bräter in den vorgeheizten Combair schieben und 45 Minuten schmoren.', settings: [dev('combair', 'Heißluft feucht', 180, { minutes: 45, core: 85, note: 'vorheizen, Ebene 2' })] },
    { text: 'Mit Ciabatta servieren.' },
  ],
  'scaloppine-limone': [
    { text: 'Kalbsschnitzel dünn klopfen, salzen, pfeffern und mit Mehl bestäuben.' },
    { text: 'In der Hälfte der Butter 1 Minute je Seite braten und herausnehmen.', settings: [bora('6', { minutes: 2, note: 'Pfanne vorheizen' })] },
    { text: 'Mit Weißwein und Zitronensaft ablöschen, Kapern und restliche kalte Butter einrühren. Fleisch darin kurz wenden.', settings: [bora('4', { minutes: 2 })] },
    { text: 'Blattspinat mit Knoblauch im Olivenöl zusammenfallen lassen, salzen und mit Ciabatta dazu servieren.', settings: [bora('6', { minutes: 3 })] },
  ],
  cotoletta: [
    { text: 'Kalbskoteletts am Knochen leicht flach klopfen.' },
    { text: 'In verquirltem Ei und dann in Paniermehl wenden und die Panade gut andrücken.' },
    { text: 'In reichlich Butter bei mittlerer Hitze je Seite 4 bis 5 Minuten goldbraun braten und salzen.', settings: [bora('6', { minutes: 10, note: 'Pfanne vorheizen' })] },
    { text: 'Rucola und halbierte Kirschtomaten mit Olivenöl, Zitrone und Salz anmachen und dazu servieren.' },
  ],
  'pizza-margherita': [
    { text: 'Mehl, 190 ml lauwarmes Wasser, Hefe und 7 g Salz 10 Minuten zu einem glatten Teig kneten. Zugedeckt 2 Stunden gehen lassen.' },
    { text: 'Den Combair mit dem Blech auf Ebene 2 vorheizen.', settings: [dev('combair', 'PizzaPlus', 280, { note: 'vorheizen, Ebene 2' })] },
    { text: 'Teig in 2 Kugeln teilen und von innen nach außen dünn ausziehen. Mit gesalzenen Passierten Tomaten bestreichen und mit zerzupftem, abgetropftem Mozzarella belegen.' },
    { text: 'Die Pizzen nacheinander auf dem heißen Blech 7 bis 9 Minuten backen. Mit Basilikum und Olivenöl servieren.', settings: [dev('combair', 'PizzaPlus', 280, { minutes: 8, note: 'je Pizza' })] },
  ],
  'pizza-diavola': [
    { text: 'Teig wie für Pizza Margherita zubereiten und 2 Stunden gehen lassen.' },
    { text: 'Den Combair mit dem Blech auf Ebene 2 vorheizen.', settings: [dev('combair', 'PizzaPlus', 280, { note: 'vorheizen, Ebene 2' })] },
    { text: 'Teig dünn ausziehen, mit gewürzten Passierten Tomaten bestreichen und mit Mozzarella, Salami piccante, Chiliringen und Oregano belegen.' },
    { text: 'Die Pizzen nacheinander 7 bis 9 Minuten backen und mit Olivenöl beträufeln.', settings: [dev('combair', 'PizzaPlus', 280, { minutes: 8, note: 'je Pizza' })] },
  ],
  piccata: [
    { text: 'Tomatensauce aus Knoblauch, Olivenöl und Geschälten Tomaten 15 Minuten köcheln lassen und mit Basilikum abschmecken.', settings: [bora('4', { minutes: 15 })] },
    { text: 'Eier mit geriebenem Parmigiano Reggiano verquirlen.' },
    { text: 'Schweineschnitzel dünn klopfen, würzen, mit Mehl bestäuben, durch die Eier-Käse-Masse ziehen und in Olivenöl goldgelb braten.', settings: [bora('6', { minutes: 6, note: 'Pfanne vorheizen' })] },
    { text: 'Spaghetti in Salzwasser kochen, mit der Sauce mischen und mit der Piccata servieren.', settings: pasta(9) },
  ],
  'pollo-romana': [
    { text: 'Hähnchenschenkel würzen und im Olivenöl rundum goldbraun braten.', settings: [bora('7', { minutes: 10, note: 'Brücke' })] },
    { text: 'Rote und gelbe Paprika in Streifen und Zwiebel zugeben, Knoblauch kurz mitbraten und mit Weißwein ablöschen.', settings: [bora('5', { minutes: 6 })] },
    { text: 'Geschälte Tomaten zugeben und 40 Minuten zugedeckt schmoren.', settings: [bora('3', { minutes: 40, note: 'Deckel drauf' })] },
    { text: 'Mit Majoran abschmecken.' },
  ],
  'polpette-sugo': [
    { text: 'Weißbrot einweichen, ausdrücken und mit Hackfleisch, Ei, Parmigiano Reggiano, Knoblauch, Petersilie, Salz und Pfeffer zu Bällchen formen.' },
    { text: 'Im Olivenöl anbraten.', settings: [bora('6', { minutes: 8 })] },
    { text: 'Zwiebel zugeben, Passierte Tomaten zugeben und 25 Minuten sanft köcheln lassen.', settings: [bora('3', { minutes: 25 })] },
    { text: 'Mit Basilikum und Ciabatta zum Stippen servieren.' },
  ],
  frittata: [
    { text: 'Kartoffeln in dünne Scheiben schneiden und mit der Zwiebel im Olivenöl weich braten.', settings: [bora('5', { minutes: 12 })] },
    { text: 'Eier mit Parmigiano Reggiano, Petersilie, Salz und Pfeffer verquirlen und darüber gießen.' },
    { text: 'Bei kleiner Hitze zugedeckt stocken lassen, dann mit Hilfe eines Tellers wenden und fertig backen.', settings: [bora('3', { minutes: 10, note: 'Deckel drauf' })] },
    { text: 'In Stücke schneiden und mit Rucola servieren.' },
  ],
  'polenta-funghi': [
    { text: '750 ml Salzwasser aufkochen, Polenta einrieseln lassen und unter Rühren 30 Minuten (Instant: 5 Minuten) garen.', settings: [boil(), bora('2', { minutes: 30, note: 'rühren' })] },
    { text: 'Champignons und Kräuterseitlinge in Stücke schneiden und im Olivenöl scharf anbraten. Knoblauch und Thymian zugeben und mit Weißwein ablöschen.', settings: [bora('8', { minutes: 8, note: 'Abzug höher' })] },
    { text: 'Butter und Parmigiano Reggiano unter die Polenta rühren.', settings: [bora('Warmhalten', { note: 'Polenta warm' })] },
    { text: 'Pilze auf der Polenta anrichten und mit Petersilie bestreuen.' },
  ],
  'acqua-pazza': [
    { text: 'Knoblauch und Chili im Olivenöl anschwitzen.', settings: [bora('4', { minutes: 2 })] },
    { text: 'Halbierte Kirschtomaten zugeben, kurz schmoren lassen und mit Weißwein und 100 ml Wasser ablöschen.', settings: [bora('5', { minutes: 5 })] },
    { text: 'Doradenfilets salzen, mit der Haut nach oben einlegen und zugedeckt 6 bis 8 Minuten gar ziehen lassen.', settings: [bora('Simmern', { minutes: 7, note: 'Deckel drauf' })] },
    { text: 'Mit Petersilie bestreuen und mit Ciabatta zum Auftunken servieren.' },
  ],
  'salsiccia-patate': [
    { text: 'Kartoffeln in Spalten schneiden und mit roter Zwiebel, Knoblauch, Rosmarin, Olivenöl, Salz und Pfeffer auf einem Blech mischen.' },
    { text: 'Das Blech auf Ebene 2 in den vorgeheizten Combair schieben und 20 Minuten backen.', settings: [dev('combair', 'Heißluft', 190, { minutes: 20, note: 'vorheizen, Ebene 2' })] },
    { text: 'Salsicce dazulegen, mit Weißwein beträufeln und weitere 25 Minuten backen, bis alles goldbraun ist.', settings: [dev('combair', 'Heißluft', 190, { minutes: 25 })] },
    { text: 'Direkt vom Blech servieren.' },
  ],
  involtini: [
    { text: 'Rinderrouladen mit Parmaschinken, geriebenem Pecorino Romano, Pinienkernen, Petersilie und Knoblauch belegen, aufrollen und feststecken.' },
    { text: 'Im Olivenöl rundum anbraten und mit Rotwein ablöschen.', settings: [bora('7', { minutes: 8, note: 'Brücke' })] },
    { text: 'Geschälte Tomaten zugeben und zugedeckt 60 Minuten schmoren.', settings: [bora('2', { minutes: 60, note: 'Deckel drauf' })] },
    { text: 'Die Sauce mit Rigatoni als Primo und die Involtini als Secondo servieren. Rigatoni in Salzwasser kochen.', settings: pasta(11) },
  ],
  calzone: [
    { text: 'Pizzateig aus Mehl, Hefe, Wasser und Salz zubereiten und 2 Stunden gehen lassen.' },
    { text: 'Den Combair mit dem Blech auf Ebene 2 vorheizen.', settings: [dev('combair', 'PizzaPlus', 250, { note: 'vorheizen, Ebene 2' })] },
    { text: 'Ricotta mit Parmigiano Reggiano, Pfeffer und gewürfeltem Kochschinken und Mozzarella mischen.' },
    { text: 'Teig in 2 Kreise ausziehen, eine Hälfte mit Passierten Tomaten und der Füllung belegen, zuklappen und die Ränder fest andrücken. Mit Olivenöl bestreichen.' },
    { text: 'Die Calzone auf dem heißen Blech 12 bis 15 Minuten backen.', settings: [dev('combair', 'PizzaPlus', 250, { minutes: 13 })] },
  ],
  pizzaiola: [
    { text: 'Rumpsteaks flach drücken und im heißen Olivenöl kurz von beiden Seiten anbraten. Herausnehmen. Beim scharfen Anbraten den Abzug eine Stufe höher stellen.', settings: [bora('9', { minutes: 4, note: 'Pfanne vorheizen' })] },
    { text: 'Knoblauch anschwitzen, Geschälte Tomaten, Oregano und Kapern zugeben und 10 Minuten köcheln lassen.', settings: [bora('4', { minutes: 10 })] },
    { text: 'Steaks in die Sauce legen und 3 bis 4 Minuten ziehen lassen.', settings: [bora('Simmern', { minutes: 4 })] },
    { text: 'Mit Ciabatta servieren.' },
  ],
  'risi-bisi': [
    { text: 'Pancetta und Zwiebel in der Hälfte der Butter anschwitzen.', settings: [bora('4', { minutes: 5 })] },
    { text: 'Risottoreis zugeben, glasig rösten und mit Gemüsebrühe aufgießen. Erbsen zugeben.', settings: [bora('5', { minutes: 2 })] },
    { text: 'Unter gelegentlichem Rühren 18 Minuten garen. Das Gericht soll suppiger sein als ein Risotto (all’onda).', settings: [bora('5', { minutes: 18 })] },
    { text: 'Restliche Butter, Parmigiano Reggiano und Petersilie einrühren.' },
  ],
  'fegato-veneziana': [
    { text: 'Zwiebeln in hauchdünne Ringe schneiden und in Olivenöl und Butter 25 Minuten sanft weich schmoren.', settings: [bora('3', { minutes: 25, note: 'Deckel drauf' })] },
    { text: 'Polenta in 750 ml Salzwasser garen und Parmigiano Reggiano unterrühren.', settings: [boil(), bora('2', { minutes: 30, note: 'rühren' })] },
    { text: 'Kalbsleber in feine Streifen schneiden, zu den Zwiebeln geben und bei hoher Hitze 2 Minuten braten.', settings: [bora('8', { minutes: 2, note: 'Abzug höher' })] },
    { text: 'Mit Essig ablöschen, salzen, pfeffern und mit Petersilie auf der Polenta servieren.' },
  ],

  // ───────────── Aufläufe ─────────────
  lasagne: [
    { text: 'Soffritto aus fein gewürfelter Zwiebel, Möhre und Sellerie im Olivenöl dünsten.', settings: [bora('4', { minutes: 8 })] },
    { text: 'Rinderhackfleisch und Schweinehackfleisch krümelig anbraten, Tomatenmark rösten und mit Rotwein ablöschen. Passierte Tomaten zugeben und 1 Stunde köcheln lassen.', settings: [bora('8', { minutes: 8, note: 'Brücke' }), bora('3', { minutes: 60, note: 'Ragù köcheln' })] },
    { text: 'Für die Béchamel Butter schmelzen, Mehl anschwitzen, Milch einrühren, 5 Minuten köcheln lassen und mit Muskat und Salz würzen.', settings: [bora('Schmelzen', { note: 'Butter' }), bora('4', { minutes: 5, note: 'Béchamel' })] },
    { text: 'In eine Form abwechselnd Ragù, Lasagneplatten, Béchamel und Parmigiano Reggiano schichten. Mit Béchamel und Parmigiano Reggiano abschließen.' },
    { text: 'Die Form auf Ebene 2 in den vorgeheizten Combair schieben und 40 Minuten backen. Vor dem Anschneiden 10 Minuten ruhen lassen.', settings: [dev('combair', 'Ober-/Unterhitze', 180, { minutes: 40, note: 'vorheizen, Ebene 2' })] },
  ],
  'lasagne-spinat': [
    { text: 'Blattspinat auftauen, gut ausdrücken, hacken und mit Ricotta, Ei, Knoblauch, Salz, Pfeffer und Muskat mischen.' },
    { text: 'Béchamel aus Butter, Mehl und Milch kochen und würzen.', settings: [bora('Schmelzen', { note: 'Butter' }), bora('4', { minutes: 5, note: 'Béchamel' })] },
    { text: 'Béchamel, Lasagneplatten und Spinat-Ricotta abwechselnd schichten. Mit Béchamel, Mozzarella und Parmigiano Reggiano abschließen.' },
    { text: 'Die Form auf Ebene 2 in den vorgeheizten Combair schieben und 40 Minuten backen.', settings: [dev('combair', 'Ober-/Unterhitze', 180, { minutes: 40, note: 'vorheizen, Ebene 2' })] },
  ],
  cannelloni: [
    { text: 'Blattspinat ausdrücken, hacken und mit Ricotta, Ei, der Hälfte des Parmigiano Reggiano, Salz, Pfeffer und Muskat mischen. In die Cannelloni füllen (am besten mit einem Spritzbeutel).' },
    { text: 'Passierte Tomaten mit Knoblauch und Salz kurz aufkochen und in eine Form geben. Cannelloni darauflegen.', settings: [bora('6', { minutes: 5, note: 'kurz aufkochen' })] },
    { text: 'Sahne darüber gießen und mit Mozzarella und restlichem Parmigiano Reggiano belegen.' },
    { text: 'Die Form auf Ebene 2 in den vorgeheizten Combair schieben und 35 Minuten backen.', settings: [dev('combair', 'Ober-/Unterhitze', 180, { minutes: 35, note: 'vorheizen, Ebene 2' })] },
  ],
  parmigiana: [
    { text: 'Auberginen längs in 1 cm dicke Scheiben schneiden, salzen, 30 Minuten ziehen lassen und trocken tupfen. Im Olivenöl goldbraun braten.', settings: [bora('7', { minutes: 15, note: 'in Portionen' })] },
    { text: 'Passierte Tomaten mit Knoblauch und Basilikum 15 Minuten zu einer Sauce kochen.', settings: [bora('4', { minutes: 15 })] },
    { text: 'Sauce, Auberginen, Mozzarella, Parmigiano Reggiano und Basilikum in eine Form schichten. Mit Sauce und Parmigiano Reggiano abschließen.' },
    { text: 'Die Form auf Ebene 2 in den vorgeheizten Combair schieben und 35 Minuten backen. Lauwarm mit Ciabatta servieren.', settings: [dev('combair', 'Ober-/Unterhitze', 180, { minutes: 35, note: 'vorheizen, Ebene 2' })] },
  ],
  'gnocchi-sorrentina': [
    { text: 'Tomatensauce aus Passierten Tomaten, Knoblauch und Olivenöl 10 Minuten köcheln lassen und salzen.', settings: [bora('4', { minutes: 10 })] },
    { text: 'Gnocchi garen, bis sie oben schwimmen, und mit Sauce und Basilikum mischen.', settings: [boil(), bora('6', { minutes: 3, note: 'bis sie schwimmen' })] },
    { text: 'In eine Form füllen und mit Mozzarella und Parmigiano Reggiano belegen.' },
    { text: 'Die Form auf Ebene 2 in den vorgeheizten Combair schieben und 10 Minuten überbacken, bis der Käse blubbert.', settings: [dev('combair', 'Ober-/Unterhitze', 220, { minutes: 10, note: 'vorheizen, Ebene 2' })] },
  ],
  'pasta-al-forno': [
    { text: 'Aubergine würfeln und im Olivenöl braten.', settings: [bora('7', { minutes: 8 })] },
    { text: 'Hackfleisch mit Zwiebel anbraten, Passierte Tomaten und Erbsen zugeben und 20 Minuten köcheln lassen.', settings: [bora('8', { minutes: 6, note: 'Brücke' }), bora('4', { minutes: 20 })] },
    { text: 'Rigatoni sehr bissfest kochen und mit Sauce, Auberginen, Basilikum, gewürfeltem Mozzarella und der Hälfte des Parmigiano Reggiano mischen.', settings: pasta(8) },
    { text: 'In eine Form füllen, mit Parmigiano Reggiano bestreuen, auf Ebene 2 in den vorgeheizten Combair schieben und 25 Minuten backen.', settings: [dev('combair', 'Ober-/Unterhitze', 200, { minutes: 25, note: 'vorheizen, Ebene 2' })] },
  ],
  'zucchine-ripiene': [
    { text: 'Zucchini längs halbieren und aushöhlen. Das Fruchtfleisch hacken.' },
    { text: 'Fruchtfleisch mit Hackfleisch, eingeweichtem Weißbrot, Ei, Parmigiano Reggiano, Knoblauch, Salz und Pfeffer mischen und in die Zucchini füllen.' },
    { text: 'Passierte Tomaten in eine Form geben, Zucchini daraufsetzen und mit Olivenöl beträufeln.' },
    { text: 'Die Form auf Ebene 2 in den vorgeheizten Combair schieben und 35 Minuten backen. Mit Basilikum und Ciabatta servieren.', settings: [dev('combair', 'Heißluft', 180, { minutes: 35, note: 'vorheizen, Ebene 2' })] },
  ],

  // ───────────── Suppen & Eintöpfe ─────────────
  minestrone: [
    { text: 'Zwiebel, Möhren und Sellerie im Olivenöl andünsten.', settings: [bora('4', { minutes: 6 })] },
    { text: 'Zucchini, Kartoffeln, grüne Bohnen und Wirsing würfeln, zugeben, Geschälte Tomaten und Gemüsebrühe angießen und 30 Minuten köcheln lassen.', settings: [bora('Power', { note: 'aufkochen' }), bora('4', { minutes: 30 })] },
    { text: 'Borlotti-Bohnen und Ditalini zugeben und weitere 10 Minuten garen.', settings: [bora('5', { minutes: 10 })] },
    { text: 'Mit einem Löffel Pesto Genovese und Parmigiano Reggiano servieren.' },
  ],
  'pasta-fagioli': [
    { text: 'Pancetta und Soffritto im Olivenöl anschwitzen. Tomatenmark und Rosmarin kurz mitrösten.', settings: [bora('5', { minutes: 8 })] },
    { text: 'Borlotti-Bohnen und Gemüsebrühe zugeben und 15 Minuten köcheln lassen. Ein Drittel der Bohnen pürieren.', settings: [bora('4', { minutes: 15 })] },
    { text: 'Ditalini direkt in der Suppe garen, bis sie sämig ist.', settings: [bora('5', { minutes: 10, note: 'rühren' })] },
    { text: 'Mit Olivenöl, Pfeffer und Parmigiano Reggiano servieren.' },
  ],
  'pasta-ceci': [
    { text: 'Knoblauch, Rosmarin und Sardellenfilets im Olivenöl anschwitzen. Tomatenmark kurz mitrösten.', settings: [bora('4', { minutes: 4 })] },
    { text: 'Kichererbsen und Gemüsebrühe zugeben und 15 Minuten köcheln lassen. Die Hälfte pürieren.', settings: [bora('4', { minutes: 15 })] },
    { text: 'Ditalini in der Suppe garen.', settings: [bora('5', { minutes: 10, note: 'rühren' })] },
    { text: 'Mit Olivenöl, Pfeffer und Pecorino Romano servieren.' },
  ],
  ribollita: [
    { text: 'Soffritto aus Zwiebel, Möhren und Sellerie im Olivenöl anschwitzen.', settings: [bora('4', { minutes: 8 })] },
    { text: 'Schwarzkohl und Wirsing in Streifen schneiden, zugeben, dann Geschälte Tomaten, Gemüsebrühe, Thymian und die Hälfte der Cannellini-Bohnen zugeben. 40 Minuten köcheln lassen.', settings: [bora('Power', { note: 'aufkochen' }), bora('3', { minutes: 40, note: 'Deckel drauf' })] },
    { text: 'Restliche Bohnen pürieren und unterrühren. Das Toskanische Brot in Stücken einlegen und 10 Minuten ziehen lassen, bis es zerfällt.', settings: [bora('Simmern', { minutes: 10 })] },
    { text: 'Mit reichlich Olivenöl servieren. Am nächsten Tag die Reste im CombiSteamer regenerieren, das schmeckt noch besser.', settings: [dev('steamer', 'Regenerieren', 120, { minutes: 15, note: 'Deckel' })] },
  ],
  stracciatella: [
    { text: 'Eier mit Parmigiano Reggiano, Paniermehl, Petersilie und Muskat verquirlen.' },
    { text: 'Hühnerbrühe aufkochen.', settings: [bora('Power', { note: 'aufkochen' }), bora('4', { note: 'sanft kochen' })] },
    { text: 'Die Eiermasse unter Rühren einlaufen lassen, so dass feine Flocken (stracci) entstehen.', settings: [bora('3', { minutes: 2 })] },
    { text: 'Mit Zitronenschale und Pfeffer servieren.' },
  ],
  'pappa-pomodoro': [
    { text: 'Knoblauch im Olivenöl anschwitzen. Frische Tomaten und Geschälte Tomaten zugeben und 15 Minuten köcheln lassen.', settings: [bora('4', { minutes: 3, note: 'Knoblauch' }), bora('4', { minutes: 15 })] },
    { text: 'Gemüsebrühe zugeben. Altbackenes Toskanisches Brot in Stücken einlegen und 15 Minuten ziehen lassen.', settings: [bora('Simmern', { minutes: 15 })] },
    { text: 'Kräftig rühren, bis ein dicker Brei entsteht.' },
    { text: 'Basilikum unterziehen und lauwarm mit viel Olivenöl servieren.' },
  ],
  'zuppa-lenticchie': [
    { text: 'Salsiccia in Stücken im Olivenöl anbraten. Soffritto zugeben und andünsten.', settings: [bora('6', { minutes: 5 }), bora('4', { minutes: 5, note: 'Soffritto' })] },
    { text: 'Tomatenmark kurz mitrösten. Tellerlinsen, Gemüsebrühe und Rosmarin zugeben.', settings: [bora('Power', { note: 'aufkochen' })] },
    { text: '35 Minuten köcheln lassen, bis die Linsen weich sind.', settings: [bora('4', { minutes: 35 })] },
    { text: 'Mit Olivenöl beträufeln und mit geröstetem Ciabatta servieren. Das Ciabatta dafür 3 Minuten im Airfryer rösten.', settings: [dev('airfryer', 'Heissluft', 180, { minutes: 3, note: 'Ciabatta' })] },
  ],
  spezzatino: [
    { text: 'Rindergulasch portionsweise im Olivenöl anbraten.', settings: [bora('8', { minutes: 10, note: 'Abzug höher' })] },
    { text: 'Soffritto aus Zwiebel, Möhre und Sellerie zugeben, Tomatenmark mitrösten und mit Rotwein ablöschen.', settings: [bora('5', { minutes: 6 })] },
    { text: 'Rinderfond, Rosmarin und Lorbeerblatt zugeben und im geschlossenen Bräter im CombiSteamer 90 Minuten schmoren. Den CombiSteamer vorheizen.', settings: [dev('steamer', 'Heißluft feucht', 150, { minutes: 90, note: 'vorheizen, Ebene 2' })] },
    { text: 'Kartoffelwürfel zugeben und weitere 30 Minuten garen.', settings: [dev('steamer', 'Heißluft feucht', 150, { minutes: 30 })] },
  ],
}
