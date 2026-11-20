import type { Device, DeviceSetting, DeviceStep } from '../../types'
import { famag, wittBacken, wittVorheizen } from '../device-helpers'

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
    { text: 'Spaghetti mit etwas Nudelwasser in die Pfanne geben und kräftig schwenken, bis eine leichte Emulsion entsteht (Öl und stärkehaltiges Nudelwasser verbinden sich zu einer sämigen Sauce, die an den Nudeln haftet).', settings: [bora('5', { minutes: 1 })] },
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
    { text: 'Venusmuscheln eine Stunde in Salzwasser legen, damit sie Sand verlieren. Muscheln, die offen sind und sich beim Antippen nicht schließen, sind verdorben und werden aussortiert.' },
    { text: 'Einen großen Topf Salzwasser aufkochen und die Spaghetti hineingeben. Sie werden 2 Minuten vor Ende der Packungs-Garzeit abgegossen und im Muschelsud fertig gegart.', settings: pasta(7) },
    { text: 'Während die Spaghetti kochen, Knoblauch und Chili im Olivenöl anschwitzen. Muscheln und Weißwein zugeben, Deckel auflegen und 3 bis 4 Minuten garen, bis sie sich öffnen. Geschlossene Muscheln wegwerfen.', settings: [bora('4', { minutes: 2, note: 'Knoblauch' }), bora('7', { minutes: 4, note: 'Deckel drauf' })] },
    { text: 'Die Spaghetti abgießen, dabei eine Tasse Nudelwasser auffangen. Spaghetti in den Muschelsud geben und unter Schwenken 2 Minuten fertig garen, bis sie bissfest sind und der Sud leicht sämig ist (bei Bedarf etwas Nudelwasser zugeben).', settings: [bora('6', { minutes: 2, note: 'im Sud fertig' })] },
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
    { text: 'Einen großen Topf Salzwasser aufkochen. Kartoffeln schälen und in 1 cm kleine Würfel schneiden, grüne Bohnen putzen und in 3 cm lange Stücke schneiden. Beides ins kochende Nudelwasser geben und vorgaren.', settings: [boil(), bora('7', { minutes: 8, note: 'Kartoffeln, Bohnen' })] },
    { text: 'Trofie zum Gemüse in den Topf geben und bissfest garen. Die Kartoffeln dürfen dabei leicht zerfallen, das macht die Sauce cremig.', settings: [bora('7', { minutes: 10 })] },
    { text: 'Eine Tasse Nudelwasser auffangen, dann alles abgießen. Nudeln und Gemüse in einer Schüssel mit dem Pesto und 2 bis 3 EL Nudelwasser vermengen, bis das Pesto cremig gebunden ist. Das Pesto nicht erhitzen, sonst wird das Basilikum braun und bitter.' },
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
    { text: 'Den Wasserbehälter des CombiSteamers füllen. Die Kartoffeln mit Schale auf den gelochten Garbehälter legen und im CombiSteamer etwa 35 Minuten dämpfen, bis ein Messer leicht hineingleitet. Noch heiß pellen, durch die Kartoffelpresse auf die Arbeitsfläche drücken und gut ausdampfen lassen – je trockener die Masse, desto weniger Mehl braucht der Teig.', settings: [dev('steamer', 'Dämpfen', 100, { minutes: 35, note: 'ganze Kartoffeln' })] },
    { text: 'Die Kartoffelmasse mit Weizenmehl, Eigelb, Salz und Muskat rasch zu einem weichen, nicht mehr klebenden Teig verkneten – nicht zu lange kneten, sonst werden die Gnocchi zäh. Einen großen Topf Salzwasser aufsetzen. Den Teig zu daumendicken Rollen formen, in 2 cm lange Stücke schneiden und über die Rückseite einer Gabel abrollen (die Rillen halten später die Butter).' },
    { text: 'Die Gnocchi portionsweise ins nur noch leicht siedende Salzwasser geben. Sobald sie an die Oberfläche steigen, noch 1 Minute ziehen lassen und mit einer Schaumkelle herausheben.', settings: [boil(), bora('4', { minutes: 3, note: 'bis sie aufsteigen' })] },
    { text: 'Butter mit Salbeiblättern in einer großen Pfanne aufschäumen, bis sie hellbraun ist und nussig duftet. Gnocchi darin schwenken und mit Parmigiano Reggiano servieren.', settings: [bora('5', { minutes: 4, note: 'Salbeibutter' })] },
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
    { text: 'Weißbrot 5 Minuten in Wasser einweichen und gut ausdrücken. Petersilie und Knoblauch fein hacken. Mit Hackfleisch, Ei, Parmigiano Reggiano, Salz und Pfeffer verkneten und walnussgroße Bällchen formen.' },
    { text: 'Bällchen im Olivenöl rundum anbraten.', settings: [bora('6', { minutes: 8 })] },
    { text: 'Zwiebel fein würfeln und kurz mitdünsten, Geschälte Tomaten und Passierte Tomaten zugeben und die Polpette darin 30 Minuten sanft schmoren.', settings: [bora('3', { minutes: 30, note: 'Deckel drauf' })] },
    { text: 'In den letzten 15 Minuten der Schmorzeit Salzwasser aufkochen und die Spaghetti darin bissfest kochen. Abgießen, mit etwas Sauce vermengen und mit den Polpette und gezupftem Basilikum servieren.', settings: pasta(9) },
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
    { text: 'Miesmuscheln unter kaltem Wasser abbürsten und entbarten (die Haarbüschel am Schalenrand abziehen). Muscheln, die offen sind und sich beim Antippen nicht schließen, sind verdorben und werden aussortiert. Einen großen Topf Salzwasser für die Spaghetti aufsetzen.', settings: [boil()] },
    { text: 'Knoblauch hacken, Chili in Ringe schneiden und beides im Olivenöl anschwitzen. Muscheln und Weißwein zugeben und zugedeckt garen, bis sie sich öffnen. Geschlossene Muscheln wegwerfen.', settings: [bora('4', { minutes: 2, note: 'Knoblauch' }), bora('7', { minutes: 5, note: 'Deckel drauf' })] },
    { text: 'Die Spaghetti ins kochende Salzwasser geben. Inzwischen die Hälfte der Muscheln aus der Schale lösen, die Kirschtomaten halbieren, in den Sud geben und 5 Minuten köcheln lassen.', settings: [bora('7', { minutes: 7, note: 'Nudeln' }), bora('4', { minutes: 5, note: 'Sud' })] },
    { text: 'Die Spaghetti 2 Minuten vor Ende der Packungs-Garzeit abgießen (al dente, also innen noch mit leichtem Biss), im Sud unter Schwenken fertig garen und mit allen Muscheln und gehackter Petersilie servieren.', settings: [bora('6', { minutes: 2, note: 'im Sud fertig' })] },
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
    { text: 'Getrocknete Steinpilze 20 Minuten in 150 ml warmem Wasser einweichen, ausdrücken und hacken. Das Einweichwasser durch ein Sieb zur Gemüsebrühe gießen. Die Brühe in einem Topf aufkochen und heiß halten – kalte Brühe würde das Garen unterbrechen.', settings: [bora('Warmhalten', { note: 'Brühe heiß halten' })] },
    { text: 'Champignons in Scheiben im Olivenöl anbraten und beiseitestellen. Danach Schalotte im selben Topf glasig dünsten, Risottoreis zugeben und glasig rösten. Mit Weißwein ablöschen.', settings: [bora('8', { minutes: 5, note: 'Champignons' }), bora('4', { minutes: 3, note: 'Schalotte' }), bora('5', { minutes: 2, note: 'Reis rösten' })] },
    { text: 'Eine Kelle heiße Brühe angießen und unter Rühren einkochen lassen, dann die nächste Kelle zugeben, insgesamt etwa 18 Minuten. Nach der Hälfte der Zeit die angebratenen Champignons und Steinpilze zugeben. Das Risotto ist fertig, wenn die Körner außen weich und innen noch leicht bissfest sind und es cremig fließt.', settings: [bora('5', { minutes: 18, note: 'rühren' })] },
    { text: 'Vom Herd nehmen und kalte Butter und Parmigiano Reggiano kräftig unterrühren (mantecare: das Rühren bindet Fett und Stärke zu einer cremigen Sauce). 2 Minuten ruhen lassen und mit Petersilie servieren.' },
  ],
  'risotto-milanese': [
    { text: 'Die Hühnerbrühe in einem Topf aufkochen und heiß halten. Die Safranfäden in einer Tasse mit 3 EL heißer Brühe einweichen, damit sie Farbe und Aroma abgeben.', settings: [bora('Warmhalten', { note: 'Brühe heiß halten' })] },
    { text: 'Schalotte fein würfeln und in 20 g Butter glasig dünsten. Risottoreis zugeben und unter Rühren rösten, bis die Körner glasig sind. Mit Weißwein ablöschen und den Wein verkochen lassen.', settings: [bora('4', { minutes: 3 }), bora('5', { minutes: 2, note: 'Reis rösten' })] },
    { text: 'Kellenweise heiße Brühe angießen und unter Rühren einkochen lassen, bevor die nächste Kelle folgt. Nach 10 Minuten den Safran mit der Flüssigkeit zugeben. Nach 18 Minuten sollen die Körner innen noch leicht bissfest und das Risotto cremig-flüssig sein.', settings: [bora('5', { minutes: 18, note: 'rühren' })] },
    { text: 'Den Topf von der Kochzone nehmen, die restliche kalte Butter in Stücken und den geriebenen Parmigiano Reggiano kräftig einrühren (mantecare: so wird das Risotto cremig), 2 Minuten ruhen lassen und servieren.' },
  ],
  'risotto-zucca': [
    { text: 'Hokkaido-Kürbis fein würfeln. Die Hälfte mit der Schalotte in Butter andünsten.', settings: [bora('4', { minutes: 6 })] },
    { text: 'Risottoreis zugeben, glasig rösten und mit Weißwein ablöschen.', settings: [bora('5', { minutes: 3 })] },
    { text: 'Die Gemüsebrühe heiß halten und kellenweise unter Rühren angießen, jeweils einkochen lassen. Nach 8 Minuten die restlichen Kürbiswürfel zugeben. Nach 18 Minuten sind die Körner innen noch leicht bissfest und die ersten Kürbiswürfel zerfallen.', settings: [bora('5', { minutes: 18, note: 'rühren' })] },
    { text: 'Den Topf von der Kochzone nehmen und einen Teil der Butter, Parmigiano Reggiano und Muskat kräftig unterrühren, bis das Risotto cremig ist. Die Salbeiblätter in der restlichen Butter in einer kleinen Pfanne knusprig braten und darüber geben.', settings: [bora('5', { minutes: 2, note: 'Salbei braten' })] },
  ],
  saltimbocca: [
    { text: 'Den Combair vorheizen. Kartoffeln in 2 cm große Würfel schneiden, mit Olivenöl, den abgezupften Rosmarinnadeln und Salz mischen, auf einem Blech verteilen und auf Ebene 2 goldbraun und knusprig rösten. Nach der Hälfte der Zeit einmal wenden.', settings: [dev('combair', 'Heißluft', 190, { minutes: 35, note: 'vorheizen, Ebene 2' })] },
    { text: 'Kalbsschnitzel dünn klopfen, pfeffern, mit je einer Scheibe Parmaschinken und einem Salbeiblatt belegen und mit einem Zahnstocher feststecken.' },
    { text: 'Die Unterseite leicht mit Mehl bestäuben. In Butter erst auf der Schinkenseite, dann auf der anderen Seite je 1 bis 2 Minuten braten.', settings: [bora('6', { minutes: 4, note: 'Pfanne vorheizen' })] },
    { text: 'Mit Weißwein ablöschen, dabei den Bratensatz vom Pfannenboden lösen und die Sauce etwas einkochen. Über das Fleisch geben und mit den Rosmarinkartoffeln servieren.', settings: [bora('5', { minutes: 2 })] },
  ],
  ossobuco: [
    { text: 'Kalbshaxenscheiben am Rand einschneiden, damit sie sich nicht wölben, salzen, pfeffern und mit Mehl bestäuben. In einem ofenfesten Bräter in 20 g Butter rundum goldbraun anbraten.', settings: [bora('7', { minutes: 8, note: 'Brücke' })] },
    { text: 'Den CombiSteamer auf 150 °C Heißluft feucht vorheizen. Zwiebel, Möhre und Sellerie fein würfeln und im Bräter mitdünsten. Tomatenmark kurz mitrösten und mit Weißwein ablöschen, dabei den Bratensatz vom Boden lösen.', settings: [bora('5', { minutes: 6 }), dev('steamer', 'Heißluft feucht', 150, { note: 'vorheizen' })] },
    { text: 'Kalbsfond angießen, den Bräter mit Deckel auf Ebene 2 in den vorgeheizten CombiSteamer schieben und die Haxen 1,5 bis 2 Stunden sanft schmoren, bis sich das Fleisch leicht vom Knochen löst.', settings: [dev('steamer', 'Heißluft feucht', 150, { minutes: 105, note: 'Ebene 2, Deckel drauf' })] },
    { text: 'Etwa 25 Minuten vor Ende der Schmorzeit den Reis zubereiten: 500 ml Salzwasser aufkochen und heiß halten. Den Risottoreis in einem zweiten Topf in der restlichen Butter glasig rösten, dann kellenweise heißes Salzwasser angießen und unter Rühren garen, bis die Körner innen noch leicht bissfest sind.', settings: [boil(), bora('5', { minutes: 18, note: 'Reis, rühren' })] },
    { text: 'Für die Gremolata die Zitronenschale fein abreiben, Knoblauch und Petersilie fein hacken und alles mischen. Die Haxen mit der Schmorsauce auf dem Reis anrichten und die Gremolata darüber streuen.' },
  ],
  'pollo-cacciatora': [
    { text: 'Hähnchenschenkel salzen und pfeffern und im Olivenöl rundum goldbraun anbraten.', settings: [bora('7', { minutes: 10, note: 'Brücke' })] },
    { text: 'Zwiebel in Streifen und Knoblauch in Scheiben schneiden, zugeben, kurz mitdünsten und mit Rotwein ablöschen.', settings: [bora('5', { minutes: 4 })] },
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
  // ───────────── Pizza: Teig im Famag (Spiralkneter), backen im Witt Rotante; „oder Combair“ für Regen/Winter ─────────────
  'pizza-margherita': [
    { text: 'Mehl, 190 ml lauwarmes Wasser und die Hefe in den Famag geben und 2 Minuten mischen. 7 g Salz zugeben und weitere 10 Minuten kneten, bis der Teig glatt ist und sich vom Haken löst. Zugedeckt 2 Stunden gehen lassen.', settings: [famag(2, { mode: 'Mischen' }), famag(10, { note: 'nach dem Salz' })] },
    { text: 'Den Witt Rotante 25 Minuten vorheizen, bis der Stein etwa 450 °C hat (mit dem Infrarot-Thermometer prüfen). Bei Regen oder im Winter stattdessen den Combair mit dem dunklen Blech auf Ebene 2 auf 280 °C PizzaPlus vorheizen.', settings: wittVorheizen(450) },
    { text: 'Teig in 2 Kugeln teilen und von innen nach außen dünn ausziehen, den Rand dicker lassen. Auf eine bemehlte Pizzaschaufel legen, mit gesalzenen Passierten Tomaten bestreichen und mit zerzupftem, abgetropftem Mozzarella belegen.' },
    { text: 'Die Pizza auf den drehenden Stein schieben und 60–90 Sekunden backen, bis der Rand aufgeht und dunkle Flecken hat. Im Combair jede Pizza auf dem heißen Blech 7 bis 9 Minuten backen. Mit Basilikum und Olivenöl servieren.', settings: wittBacken(450, 90, 8) },
  ],
  'pizza-diavola': [
    { text: 'Den Teig wie für Pizza Margherita zubereiten: Mehl, 190 ml lauwarmes Wasser und die Hefe im Famag 2 Minuten mischen, 7 g Salz zugeben und weitere 10 Minuten kneten. Zugedeckt 2 Stunden gehen lassen.', settings: [famag(2, { mode: 'Mischen' }), famag(10, { note: 'nach dem Salz' })] },
    { text: 'Den Witt Rotante 25 Minuten vorheizen, bis der Stein etwa 450 °C hat. Bei Regen oder im Winter stattdessen den Combair mit dem dunklen Blech auf Ebene 2 auf 280 °C PizzaPlus vorheizen.', settings: wittVorheizen(450) },
    { text: 'Teig dünn ausziehen, auf die bemehlte Pizzaschaufel legen, mit gewürzten Passierten Tomaten bestreichen und mit Mozzarella, Salami piccante, Chiliringen und Oregano belegen.' },
    { text: 'Die Pizza auf den drehenden Stein schieben und 60–90 Sekunden backen. Im Combair jede Pizza 7 bis 9 Minuten backen. Mit Olivenöl beträufeln.', settings: wittBacken(450, 90, 8) },
  ],
  'pizza-napoletana': [
    { text: 'Am Vortag starten: Mehl, 215 ml kaltes Wasser und die Hefe in den Famag geben und 2 Minuten mischen. 9 g Salz zugeben und weitere 10 Minuten kneten, bis der Teig glatt ist und sich vom Haken löst. Abgedeckt 2 Stunden bei Raumtemperatur ruhen lassen.', settings: [famag(2, { mode: 'Mischen' }), famag(10, { note: 'nach dem Salz' })] },
    { text: 'Den Teig in 2 Kugeln (je ca. 275 g) teilen, straff rund formen und in geölten Dosen 24–48 Stunden im Kühlschrank reifen lassen.' },
    { text: 'Die Teigkugeln 3–4 Stunden vor dem Backen aus dem Kühlschrank nehmen und abgedeckt bei Raumtemperatur akklimatisieren lassen.' },
    { text: 'Den Witt Rotante 25 Minuten vorheizen, bis der Stein etwa 450 °C hat (mit dem Infrarot-Thermometer prüfen). Bei Regen oder im Winter stattdessen den Combair mit dem dunklen Blech auf Ebene 2 auf 280 °C PizzaPlus vorheizen. Die Geschälten Tomaten mit den Händen zerdrücken und leicht salzen.', settings: wittVorheizen(450) },
    { text: 'Die Kugeln auf einer bemehlten Fläche von der Mitte nach außen flach drücken, den Rand (Cornicione) nicht plattdrücken. Auf die bemehlte Pizzaschaufel legen, mit den Tomaten bestreichen und mit dem Mozzarella in Stücken, etwas Parmigiano Reggiano und Basilikum belegen.' },
    { text: 'Die Pizza auf den drehenden Stein schieben und 60–90 Sekunden backen, bis der Rand aufgeht und dunkle Flecken hat. Im Combair jede Pizza auf dem heißen Blech 6–8 Minuten backen. Mit Olivenöl beträufeln und sofort servieren.', settings: wittBacken(450, 90, 7) },
  ],
  'pizza-teglia-romana': [
    { text: 'Am Vortag starten: Mehl, Hefe und 160 ml kaltes Wasser in den Famag geben und 5 Minuten kneten. 6 g Salz zugeben, dann die restlichen 40 ml Wasser und 1 EL vom Olivenöl schluckweise zugießen und weitere 7 Minuten kneten, bis der sehr weiche Teig glänzt und sich vom Schüsselrand löst.', settings: [famag(5), famag(7, { note: 'Wasser schluckweise' })] },
    { text: 'Den Teig in einer geölten Dose 1 Stunde bei Raumtemperatur ruhen lassen, dabei einmal dehnen und falten. Dann über Nacht 18–24 Stunden im Kühlschrank reifen lassen.' },
    { text: 'Den Teig 3 Stunden vor dem Backen aus dem Kühlschrank nehmen. Ein dunkles Blech mit 1 EL vom Olivenöl einfetten, den Teig daraufgleiten lassen und mit geölten Fingerspitzen behutsam auf ca. 30 × 25 cm drücken. 1 Stunde gehen lassen.' },
    { text: 'Die Kartoffeln hauchdünn hobeln und mit dem restlichen Olivenöl, den Nadeln vom Rosmarin, Salz und Pfeffer mischen. Die Salsiccia aus der Haut drücken und in kleine Stücke zupfen.' },
    { text: 'Den Combair auf 250 °C PizzaPlus vorheizen – die Teglia ist ein Blech und passt nicht auf den runden Stein des Witt Rotante. Den Teig mit dem Mozzarella in Stücken, den Kartoffeln und der Salsiccia belegen.', settings: [dev('combair', 'PizzaPlus', 250, { note: 'vorheizen, Ebene 2' })] },
    { text: 'Die Teglia auf Ebene 2 18–22 Minuten backen, bis der Boden knusprig ist und die Kartoffeln goldbraun sind. In Rechtecke schneiden.', settings: [dev('combair', 'PizzaPlus', 250, { minutes: 20, note: 'dunkles Blech, ohne Backpapier' })] },
  ],
  'pinsa-romana': [
    { text: 'Am Vortag starten: Weizenmehl Tipo 00, Reismehl und Sojamehl in der Schüssel des Famag mischen. Hefe und 150 ml kaltes Wasser zugeben und 5 Minuten kneten. Dann 6 g Salz, 1 EL vom Olivenöl und schluckweise die restlichen 50 ml Wasser zugeben und weitere 7 Minuten kneten, bis der Teig glatt und glänzend ist.', settings: [famag(5), famag(7, { note: 'Wasser schluckweise' })] },
    { text: 'Den Teig abgedeckt 1 Stunde bei Raumtemperatur ruhen lassen, dann in einer geölten Dose 24–48 Stunden im Kühlschrank reifen lassen.' },
    { text: 'Den Teig 3 Stunden vor dem Backen in 2 Stücke teilen, zu länglichen Laiben formen und abgedeckt bei Raumtemperatur gehen lassen.' },
    { text: 'Den Witt Rotante 25 Minuten vorheizen, dann die Flamme klein stellen, bis der Stein etwa 380 °C hat – die dickere Pinsa braucht weniger Hitze als eine Neapolitana. Bei Regen oder im Winter stattdessen den Combair mit dem dunklen Blech auf Ebene 2 auf 280 °C PizzaPlus vorheizen.', settings: wittVorheizen(380) },
    { text: 'Die Teiglinge auf einer bemehlten Fläche mit den Fingerspitzen zu ovalen Fladen (ca. 30 × 20 cm) drücken, die Luftblasen sollen bleiben. Auf die bemehlte Pizzaschaufel legen, mit den Passierten Tomaten bestreichen, leicht salzen und mit dem Mozzarella in Stücken belegen.' },
    { text: 'Die Pinsa auf den drehenden Stein schieben und 2–3 Minuten (ca. 150 Sekunden) backen, bis der Rand goldbraun und knusprig ist. Im Combair jede Pinsa 8–10 Minuten auf dem heißen Blech backen.', settings: wittBacken(380, 150, 9, 280, 'Flamme klein, je Pinsa') },
    { text: 'Mit Parmaschinken und Rucola belegen, mit dem restlichen Olivenöl beträufeln und sofort servieren.' },
  ],
  'pizza-bianca-mortadella': [
    { text: 'Am Vortag starten: Mehl, Hefe und 175 ml kaltes Wasser in den Famag geben und 2 Minuten mischen. 6 g Salz zugeben und weitere 10 Minuten kneten, bis der Teig glatt ist. Abgedeckt 1 Stunde bei Raumtemperatur ruhen lassen.', settings: [famag(2, { mode: 'Mischen' }), famag(10, { note: 'nach dem Salz' })] },
    { text: 'Den Teig in 2 Kugeln teilen und in geölten Dosen 18–24 Stunden im Kühlschrank reifen lassen. 3 Stunden vor dem Backen herausnehmen und abgedeckt bei Raumtemperatur akklimatisieren lassen.' },
    { text: 'Den Witt Rotante 25 Minuten vorheizen, bis der Stein etwa 420 °C hat. Bei Regen oder im Winter stattdessen den Combair mit dem dunklen Blech auf Ebene 2 auf 280 °C PizzaPlus vorheizen. Die Pistazien grob hacken und die Nadeln vom Rosmarin abzupfen.', settings: wittVorheizen(420) },
    { text: 'Die Kugeln zu dünnen Fladen ausziehen, auf die bemehlte Pizzaschaufel legen, mit den Fingerspitzen Mulden hineindrücken, mit 1 EL vom Olivenöl bestreichen und mit Rosmarin und etwas grobem Salz bestreuen.' },
    { text: 'Den Fladen auf den drehenden Stein schieben und 60–90 Sekunden backen, bis er aufgeht und goldbraun ist. Im Combair jeden Fladen 6–8 Minuten auf dem heißen Blech backen.', settings: wittBacken(420, 75, 7) },
    { text: 'Die heißen Fladen mit der Mortadella in hauchdünnen Scheiben belegen, die Burrata darauf zerzupfen, mit den Pistazien bestreuen und mit dem restlichen Olivenöl beträufeln. Sofort servieren.' },
  ],
  piccata: [
    { text: 'Einen großen Topf Salzwasser für die Spaghetti aufsetzen. Für die Tomatensauce den Knoblauch hacken, im Olivenöl (1 EL) kurz anschwitzen, die Geschälten Tomaten zerdrücken, zugeben, salzen und 15 Minuten köcheln lassen. Mit gezupftem Basilikum abschmecken.', settings: [boil(), bora('4', { minutes: 15 })] },
    { text: 'Eier mit geriebenem Parmigiano Reggiano verquirlen. Schweineschnitzel dünn klopfen, mit Salz und Pfeffer würzen und mit Mehl bestäuben.' },
    { text: 'Die Spaghetti ins kochende Salzwasser geben und bissfest kochen.', settings: [bora('7', { minutes: 9, note: 'Nudeln' })] },
    { text: 'Währenddessen die Schnitzel durch die Eier-Käse-Masse ziehen und im restlichen Olivenöl bei mittlerer Hitze etwa 3 Minuten je Seite goldgelb braten.', settings: [bora('6', { minutes: 6, note: 'Pfanne vorheizen' })] },
    { text: 'Die Spaghetti abgießen, mit der Sauce mischen und mit der Piccata servieren.' },
  ],
  'pollo-romana': [
    { text: 'Hähnchenschenkel würzen und im Olivenöl rundum goldbraun braten.', settings: [bora('7', { minutes: 10, note: 'Brücke' })] },
    { text: 'Rote und gelbe Paprika und die Zwiebel in Streifen schneiden und zugeben, den Knoblauch hacken und kurz mitbraten, dann mit Weißwein ablöschen.', settings: [bora('5', { minutes: 6 })] },
    { text: 'Geschälte Tomaten zerdrücken, zugeben, salzen und 40 Minuten zugedeckt schmoren, bis sich das Fleisch leicht vom Knochen löst.', settings: [bora('3', { minutes: 40, note: 'Deckel drauf' })] },
    { text: 'Die Majoranblättchen abzupfen, unterrühren und mit Salz und Pfeffer abschmecken.' },
  ],
  'polpette-sugo': [
    { text: 'Weißbrot 5 Minuten in Wasser einweichen und gut ausdrücken. Knoblauch und Petersilie fein hacken. Alles mit Hackfleisch, Ei, Parmigiano Reggiano, Salz und Pfeffer verkneten und zu walnussgroßen Bällchen formen.' },
    { text: 'Im Olivenöl anbraten.', settings: [bora('6', { minutes: 8 })] },
    { text: 'Zwiebel fein würfeln und kurz mitdünsten, Passierte Tomaten zugeben und die Bällchen darin 25 Minuten sanft köcheln lassen.', settings: [bora('3', { minutes: 25 })] },
    { text: 'Mit Basilikum und Ciabatta zum Stippen servieren.' },
  ],
  frittata: [
    { text: 'Kartoffeln schälen und in dünne Scheiben schneiden, die Zwiebel in Streifen. Beides in einer beschichteten Pfanne im Olivenöl weich braten.', settings: [bora('5', { minutes: 12 })] },
    { text: 'Eier mit Parmigiano Reggiano, Petersilie, Salz und Pfeffer verquirlen und darüber gießen.' },
    { text: 'Bei kleiner Hitze zugedeckt stocken lassen, bis die Oberfläche fast fest ist. Zum Wenden einen großen Teller auf die Pfanne legen, beides umdrehen und die Frittata vom Teller zurück in die Pfanne gleiten lassen. Die zweite Seite noch einige Minuten fertig backen.', settings: [bora('3', { minutes: 10, note: 'Deckel drauf' })] },
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
    { text: 'Den Combair vorheizen. Kartoffeln in Spalten schneiden, die rote Zwiebel in Spalten, Knoblauchzehen andrücken. Mit Rosmarin, Olivenöl, Salz und Pfeffer auf einem Blech mischen.', settings: [dev('combair', 'Heißluft', 190, { note: 'vorheizen' })] },
    { text: 'Das Blech auf Ebene 2 in den vorgeheizten Combair schieben und 20 Minuten backen.', settings: [dev('combair', 'Heißluft', 190, { minutes: 20, note: 'Ebene 2' })] },
    { text: 'Die Salsiccia dazulegen, mit Weißwein beträufeln und weitere 25 Minuten backen, bis alles goldbraun ist.', settings: [dev('combair', 'Heißluft', 190, { minutes: 25 })] },
    { text: 'Direkt vom Blech servieren.' },
  ],
  involtini: [
    { text: 'Petersilie und Knoblauch fein hacken. Rinderrouladen flach auslegen, leicht salzen und pfeffern, mit Parmaschinken belegen und mit geriebenem Pecorino Romano, Pinienkernen, Petersilie und Knoblauch bestreuen. Von der schmalen Seite her fest aufrollen und mit Zahnstochern oder Rouladennadeln feststecken.' },
    { text: 'Im Olivenöl rundum anbraten und mit Rotwein ablöschen.', settings: [bora('7', { minutes: 8, note: 'Brücke' })] },
    { text: 'Geschälte Tomaten zugeben und zugedeckt 60 Minuten schmoren.', settings: [bora('2', { minutes: 60, note: 'Deckel drauf' })] },
    { text: 'Etwa 20 Minuten vor Ende der Schmorzeit Salzwasser aufkochen und die Rigatoni bissfest kochen. Abgießen und mit einem Teil der Sauce als Primo (erster Gang) servieren, danach die Involtini mit der restlichen Sauce als Secondo (Hauptgang). Zahnstocher vorher entfernen.', settings: pasta(11) },
  ],
  calzone: [
    { text: 'Für den Pizzateig Mehl, 190 ml lauwarmes Wasser und die Hefe im Famag 2 Minuten mischen, 7 g Salz zugeben und weitere 10 Minuten kneten. Zugedeckt 2 Stunden gehen lassen.', settings: [famag(2, { mode: 'Mischen' }), famag(10, { note: 'nach dem Salz' })] },
    { text: 'Den Witt Rotante 25 Minuten vorheizen, dann die Flamme klein stellen, bis der Stein etwa 380 °C hat – die gefüllte Calzone braucht weniger Hitze, damit die Füllung heiß wird, bevor der Teig verbrennt. Bei Regen oder im Winter stattdessen den Combair mit dem dunklen Blech auf Ebene 2 auf 250 °C PizzaPlus vorheizen.', settings: wittVorheizen(380, 250) },
    { text: 'Ricotta mit Parmigiano Reggiano, Pfeffer und gewürfeltem Kochschinken und Mozzarella mischen.' },
    { text: 'Teig in 2 Kreise ausziehen, eine Hälfte mit Passierten Tomaten und der Füllung belegen, zuklappen und die Ränder fest andrücken. Mit Olivenöl bestreichen.' },
    { text: 'Die Calzone auf den drehenden Stein schieben und etwa 3 Minuten (ca. 180 Sekunden) backen, bis sie rundum goldbraun ist. Im Combair jede Calzone auf dem heißen Blech 12 bis 15 Minuten backen.', settings: wittBacken(380, 180, 13, 250, 'Flamme klein, je Calzone') },
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
    { text: 'Gleichzeitig 750 ml Salzwasser aufkochen, die Polenta unter Rühren mit dem Schneebesen einrieseln lassen und bei kleiner Hitze unter häufigem Rühren 30 Minuten (Instant-Polenta: 5 Minuten) zu einem dicken Brei garen. Zum Schluss den Parmigiano Reggiano unterrühren.', settings: [boil(), bora('2', { minutes: 30, note: 'rühren' })] },
    { text: 'Kalbsleber in feine Streifen schneiden, zu den Zwiebeln geben und bei hoher Hitze nur 2 Minuten braten, bis sie außen nicht mehr rosa ist – länger gebraten wird Leber zäh.', settings: [bora('8', { minutes: 2, note: 'Abzug höher' })] },
    { text: 'Mit Essig ablöschen, salzen, pfeffern und mit Petersilie auf der Polenta servieren.' },
  ],

  // ───────────── Aufläufe ─────────────
  lasagne: [
    { text: 'Soffritto aus fein gewürfelter Zwiebel, Möhre und Sellerie im Olivenöl dünsten.', settings: [bora('4', { minutes: 8 })] },
    { text: 'Rinderhackfleisch und Schweinehackfleisch krümelig anbraten, Tomatenmark rösten und mit Rotwein ablöschen. Passierte Tomaten zugeben und 1 Stunde köcheln lassen.', settings: [bora('8', { minutes: 8, note: 'Brücke' }), bora('3', { minutes: 60, note: 'Ragù köcheln' })] },
    { text: 'Für die Béchamel die Butter schmelzen, das Mehl einrühren und 1 Minute anschwitzen (es soll hell bleiben). Die kalte Milch nach und nach mit dem Schneebesen einrühren, damit keine Klümpchen entstehen, 5 Minuten unter Rühren köcheln lassen, bis die Sauce cremig eindickt, und mit Muskat und Salz würzen.', settings: [bora('Schmelzen', { note: 'Butter' }), bora('4', { minutes: 5, note: 'Béchamel' })] },
    { text: 'In eine Form abwechselnd Ragù, Lasagneplatten, Béchamel und Parmigiano Reggiano schichten. Mit Béchamel und Parmigiano Reggiano abschließen.' },
    { text: 'Die Form auf Ebene 2 in den vorgeheizten Combair schieben und 40 Minuten backen. Vor dem Anschneiden 10 Minuten ruhen lassen.', settings: [dev('combair', 'Ober-/Unterhitze', 180, { minutes: 40, note: 'vorheizen, Ebene 2' })] },
  ],
  'lasagne-spinat': [
    { text: 'Blattspinat auftauen, gut ausdrücken, hacken und mit Ricotta, Ei, Knoblauch, Salz, Pfeffer und Muskat mischen.' },
    { text: 'Für die Béchamel die Butter schmelzen, das Mehl einrühren und 1 Minute hell anschwitzen. Die Milch nach und nach mit dem Schneebesen einrühren, damit keine Klümpchen entstehen, und 5 Minuten unter Rühren köcheln lassen, bis die Sauce cremig eindickt. Mit Salz und Muskat würzen.', settings: [bora('Schmelzen', { note: 'Butter' }), bora('4', { minutes: 5, note: 'Béchamel' })] },
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
    { text: 'Den Combair auf 220 °C Ober-/Unterhitze vorheizen und einen Topf Salzwasser für die Gnocchi aufsetzen. Den Knoblauch hacken, im Olivenöl kurz anschwitzen, Passierte Tomaten zugeben und 10 Minuten köcheln lassen. Salzen.', settings: [bora('4', { minutes: 10 }), dev('combair', 'Ober-/Unterhitze', 220, { note: 'vorheizen' })] },
    { text: 'Die Gnocchi im kochenden Salzwasser garen, bis sie oben schwimmen, abgießen und mit Sauce und gezupftem Basilikum mischen.', settings: [boil(), bora('6', { minutes: 3, note: 'bis sie schwimmen' })] },
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
    { text: 'Zwiebel, Möhre und Staudensellerie sehr fein würfeln (Soffritto, die italienische Gemüse-Grundlage) und mit der gewürfelten Pancetta im Olivenöl anschwitzen. Tomatenmark und den ganzen Rosmarinzweig kurz mitrösten.', settings: [bora('5', { minutes: 8 })] },
    { text: 'Borlotti-Bohnen abgießen, abspülen und mit der Gemüsebrühe zugeben, 15 Minuten köcheln lassen. Den Rosmarinzweig entfernen und ein Drittel der Bohnen mit etwas Brühe pürieren, wieder unterrühren.', settings: [bora('4', { minutes: 15 })] },
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
    { text: 'Jede Tomate vierteln, den Strunk herausschneiden und grob würfeln. Knoblauch hacken und im Olivenöl anschwitzen. Die frischen und die Geschälten Tomaten zugeben und 15 Minuten köcheln lassen.', settings: [bora('4', { minutes: 3, note: 'Knoblauch' }), bora('4', { minutes: 15 })] },
    { text: 'Gemüsebrühe zugeben. Altbackenes Toskanisches Brot in Stücken einlegen und 15 Minuten ziehen lassen.', settings: [bora('Simmern', { minutes: 15 })] },
    { text: 'Kräftig rühren, bis ein dicker Brei entsteht.' },
    { text: 'Basilikum unterziehen und lauwarm mit viel Olivenöl servieren.' },
  ],
  'zuppa-lenticchie': [
    { text: 'Salsiccia in Stücken im Olivenöl anbraten. Zwiebel, Möhre und Staudensellerie fein würfeln (Soffritto), zugeben und andünsten.', settings: [bora('6', { minutes: 5 }), bora('4', { minutes: 5, note: 'Soffritto' })] },
    { text: 'Tomatenmark kurz mitrösten. Tellerlinsen, Gemüsebrühe und Rosmarin zugeben.', settings: [bora('Power', { note: 'aufkochen' })] },
    { text: '35 Minuten köcheln lassen, bis die Linsen weich sind.', settings: [bora('4', { minutes: 35 })] },
    { text: 'Mit Olivenöl beträufeln und mit geröstetem Ciabatta servieren. Das Ciabatta dafür 3 Minuten im Airfryer rösten.', settings: [dev('airfryer', 'Heissluft', 180, { minutes: 3, note: 'Ciabatta' })] },
  ],
  spezzatino: [
    { text: 'Rindergulasch portionsweise im Olivenöl anbraten.', settings: [bora('8', { minutes: 10, note: 'Abzug höher' })] },
    { text: 'Den CombiSteamer auf 150 °C Heißluft feucht vorheizen. Zwiebel, Möhre und Sellerie fein würfeln (Soffritto), zugeben und andünsten, Tomatenmark mitrösten und mit Rotwein ablöschen, dabei den Bratensatz vom Boden lösen.', settings: [bora('5', { minutes: 6 }), dev('steamer', 'Heißluft feucht', 150, { note: 'vorheizen' })] },
    { text: 'Rinderfond, Rosmarin und Lorbeerblatt zugeben, den Bräter mit Deckel auf Ebene 2 in den vorgeheizten CombiSteamer schieben und 90 Minuten schmoren.', settings: [dev('steamer', 'Heißluft feucht', 150, { minutes: 90, note: 'Ebene 2, Deckel drauf' })] },
    { text: 'Kartoffeln schälen, in 3 cm große Würfel schneiden, unter das Fleisch rühren und weitere 30 Minuten garen, bis Fleisch und Kartoffeln weich sind. Rosmarin und Lorbeer entfernen und abschmecken.', settings: [dev('steamer', 'Heißluft feucht', 150, { minutes: 30 })] },
  ],
  // ───────────── Leicht & sättigend ─────────────
  'cacciatora-leggera': [
    { text: 'Das Hähnchen in große Stücke schneiden, salzen, pfeffern und im Olivenöl rundum goldbraun braten, dann herausnehmen.', settings: [bora('8', { minutes: 2, note: 'Pfanne vorheizen' }), bora('7', { minutes: 8 })] },
    { text: 'Zwiebel, Paprika und Champignons zugeben und 5 Minuten braten, den Knoblauch mitbraten und mit dem Weißwein ablöschen.', settings: [bora('6', { minutes: 5 })] },
    { text: 'Geschälte Tomaten, Rosmarin, Oliven und Kapern zugeben, das Hähnchen zurücklegen und zugedeckt 25 Minuten schmoren.', settings: [bora('9', { note: 'aufkochen' }), bora('3', { minutes: 25, note: 'Deckel drauf' })] },
    { text: 'In den letzten 10 Minuten der Schmorzeit die Polenta nach Packungsanweisung in ca. 400 ml Salzwasser zu einem weichen Brei kochen und mit dem Hähnchen servieren.', settings: [bora('Power', { note: 'aufkochen' }), bora('2', { minutes: 10, note: 'Polenta rühren' })] },
  ],
  'puten-saltimbocca': [
    { text: 'Die Kartoffeln in 2 cm große Würfel schneiden, mit der Hälfte des Olivenöls, Rosmarin und Salz mischen und im Airfryer knusprig garen. Den Korb halb füllen und 1- bis 2-mal schütteln.', settings: [dev('airfryer', 'Heissluft', 200, { minutes: 20, note: 'Korb halb voll' })] },
    { text: 'Die Putenbrust in vier dünne Schnitzel schneiden und flach klopfen, pfeffern. Jeweils mit Salbei und Parmaschinken belegen, mit einem Zahnstocher feststecken und auf der Unterseite leicht mehlieren.' },
    { text: 'Die Zucchini in Scheiben mit Knoblauch im restlichen Olivenöl 5 Minuten braten und salzen, dann warm halten.', settings: [bora('6', { minutes: 5 })] },
    { text: 'Die Saltimbocca in Butter zuerst auf der Schinkenseite, dann auf der anderen je 2 Minuten braten. Mit dem Weißwein ablöschen, kurz einkochen und die Sauce über das Fleisch geben.', settings: [bora('6', { minutes: 4, note: 'Pfanne vorheizen' }), bora('7', { minutes: 2, note: 'einkochen' })] },
  ],
  'merluzzo-livornese': [
    { text: 'Zwiebel und Knoblauch fein würfeln und im Olivenöl 3 Minuten andünsten. Kirschtomaten halbieren, zugeben und mit dem Weißwein ablöschen.', settings: [bora('4', { minutes: 3 }), bora('6', { minutes: 2, note: 'ablöschen' })] },
    { text: 'Oliven und Kapern zugeben und die Sauce 8 Minuten einköcheln lassen.', settings: [bora('4', { minutes: 8 })] },
    { text: 'Den Kabeljau salzen, pfeffern, in die Sauce legen und zugedeckt 8 bis 10 Minuten garen.', settings: [bora('3', { minutes: 9, note: 'Deckel drauf' })] },
    { text: 'Mit Petersilie bestreuen und mit dem Toskanischen Brot servieren.' },
  ],
  'straccetti-rucola': [
    { text: 'Die Rinderhüfte quer zur Faser in dünne Streifen schneiden, mit Salz, Pfeffer und gehacktem Rosmarin würzen.' },
    { text: 'Die Kirschtomaten halbieren. Das Olivenöl in einer sehr heißen Pfanne erhitzen und das Fleisch mit dem Knoblauch in zwei Portionen je 2 Minuten scharf anbraten. Beim scharfen Anbraten den Abzug eine Stufe höher stellen.', settings: [bora('9', { minutes: 2, note: 'Pfanne vorheizen, Abzug höher' }), bora('9', { minutes: 4, note: 'zwei Portionen' })] },
    { text: 'Die Tomaten kurz mitbraten und mit dem Rotweinessig ablöschen.', settings: [bora('7', { minutes: 2 })] },
    { text: 'Den Rucola auf zwei Tellern verteilen, das Fleisch darauf anrichten und mit gehobeltem Parmigiano Reggiano und dem Toskanischen Brot servieren.' },
  ],

  'orecchiette-rosenkohl-salsiccia': [
    { text: 'Einen großen Topf Salzwasser für die Orecchiette aufsetzen. Den Rosenkohl putzen, den Strunk kürzen und die Röschen in feine Streifen schneiden. Schalotte würfeln, Knoblauch hacken, Chili in Ringe schneiden.', settings: [bora('Power', { note: 'Nudelwasser' })] },
    { text: 'Die Orecchiette ins kochende Salzwasser geben und bissfest kochen. Gleichzeitig die Salsiccia aus der Haut drücken und im Olivenöl krümelig und knusprig braten. Schalotte, Knoblauch und Chili zugeben und 2 Minuten mitbraten.', settings: [bora('7', { minutes: 12, note: 'Nudeln' }), bora('7', { minutes: 8, note: 'Salsiccia' }), bora('5', { minutes: 2 })] },
    { text: 'Den Rosenkohl zugeben, 5 Minuten braten und mit dem Weißwein ablöschen. Salzen und pfeffern.', settings: [bora('6', { minutes: 5 })] },
    { text: 'Die Orecchiette abgießen und mit einer Kelle Nudelwasser in die Pfanne geben. Schwenken, bis eine leichte Sauce entsteht, und mit geriebenem Parmigiano Reggiano servieren.', settings: [bora('5', { minutes: 2 })] },
  ],
}
