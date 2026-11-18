import type { DeviceSetting, DeviceStep } from '../../types'

/** Geräte-Schritte (Rezept-ID → Schritte), Gruppe: Deutsch, Teil 2. Stil siehe docs/geraete/regeln.md */

/** BORA-Kochzone mit Stufe */
const b = (level: string, minutes?: number, note?: string): DeviceSetting => ({
  device: 'bora', mode: 'Kochzone', level, ...(minutes != null ? { minutes } : {}), ...(note ? { note } : {}),
})
/** CombiSteamer */
const cs = (mode: string, temp: number, minutes?: number, note?: string, core?: number): DeviceSetting => ({
  device: 'steamer', mode, temp, ...(minutes != null ? { minutes } : {}), ...(core != null ? { core } : {}), ...(note ? { note } : {}),
})
/** Combair */
const ca = (mode: string, temp: number, minutes?: number, note?: string, core?: number): DeviceSetting => ({
  device: 'combair', mode, temp, ...(minutes != null ? { minutes } : {}), ...(core != null ? { core } : {}), ...(note ? { note } : {}),
})

export const DEVICE_STEPS: Record<string, DeviceStep[]> = {
  // ───────────── Pfanne + Dampf ─────────────
  'kotelett-rahmkohlrabi': [
    { text: 'Den Wasserbehälter des CombiSteamers füllen. Die Kartoffeln schälen, halbieren, mit Salz bestreuen, auf das gelochten Garbehälter legen und dämpfen.', settings: [cs('Dämpfen', 100, 25, 'Wasserbehälter füllen')] },
    { text: 'Den Kohlrabi schälen, in Stifte schneiden und in Butter andünsten. Mehl darüber stäuben, mit Brühe und Sahne aufgießen und 10 Minuten garen. Mit Muskat und Petersilie abschmecken.', settings: [b('4', 3, 'andünsten'), b('3', 10, 'garen')] },
    { text: 'Die Koteletts pfeffern, im heißen Butterschmalz 4 Minuten je Seite braten und danach salzen.', settings: [b('6', 8, 'Pfanne vorheizen')] },
    { text: 'Alles zusammen anrichten.' },
  ],
  'scholle-finkenwerder': [
    { text: 'Den Wasserbehälter des CombiSteamers füllen. Die Kartoffeln ungeschält auf das gelochten Garbehälter legen und garen. Pellen, in Scheiben schneiden und mit Brühe, Zwiebel, Essig, Salz und Pfeffer zu lauwarmem Kartoffelsalat anmachen.', settings: [cs('Dämpfen', 100, 30, 'Wasserbehälter füllen')] },
    { text: 'Den Speck in einer großen Pfanne knusprig auslassen und herausnehmen.', settings: [b('5', 6, 'Pfanne')] },
    { text: 'Die Schollen salzen, im Mehl wenden und im Speckfett mit Butter 4 bis 5 Minuten je Seite braten.', settings: [b('5', 9, 'Pfanne, Brücke')] },
    { text: 'Speck und Krabben kurz in der Pfanne erwärmen, über die Schollen geben und mit Petersilie und Zitrone servieren.', settings: [b('Warmhalten', 2)] },
  ],

  // ───────────── Eintöpfe (alles auf dem BORA) ─────────────
  linseneintopf: [
    { text: 'Den Speck im Topf auslassen, Zwiebel und gewürfeltes Gemüse (Möhren, Sellerie, Lauch) darin anschwitzen.', settings: [b('5', 3, 'Speck'), b('4', 5, 'Gemüse')] },
    { text: 'Linsen, Kartoffelwürfel, Lorbeer und Brühe zugeben, mit Deckel aufkochen und 35 Minuten köcheln lassen.', settings: [b('Power', undefined, 'aufkochen'), b('4', 35)] },
    { text: 'Die Mettenden in Scheiben schneiden und 10 Minuten mitziehen lassen.', settings: [b('3', 10)] },
    { text: 'Mit Essig, Salz, Pfeffer und einer Prise Zucker abschmecken und mit Petersilie servieren.' },
  ],
  erbseneintopf: [
    { text: 'Die Erbsen abspülen und mit Brühe und Kasseler aufkochen. Dann 45 Minuten köcheln lassen.', settings: [b('Power', undefined, 'aufkochen'), b('3', 45)] },
    { text: 'Zwiebel, Möhren, Sellerie, Lauch und Kartoffeln würfeln, zugeben und weitere 30 Minuten garen, bis die Erbsen zerfallen.', settings: [b('4', 30)] },
    { text: 'Das Kasseler herausnehmen, würfeln und zurückgeben. Die Bockwurst in Scheiben im Eintopf erhitzen.', settings: [b('3', 5)] },
    { text: 'Mit Majoran, Salz und Pfeffer abschmecken.' },
  ],
  bohneneintopf: [
    { text: 'Das Fleisch (Lammschulter) würfeln, im Butterschmalz kräftig anbraten und die Zwiebel mitdünsten. Mit Brühe aufgießen und 45 Minuten köcheln lassen.', settings: [b('7', 5, 'anbraten'), b('4', undefined, 'Zwiebel'), b('3', 45)] },
    { text: 'Die Bohnen putzen und brechen, die Kartoffeln würfeln.' },
    { text: 'Bohnen, Kartoffeln und Bohnenkraut zugeben und 25 Minuten garen.', settings: [b('4', 25)] },
    { text: 'Das Bohnenkraut herausnehmen und mit Salz und Pfeffer abschmecken.' },
  ],
  weisskohleintopf: [
    { text: 'Das Hackfleisch im Öl krümelig braten, Zwiebel und Tomatenmark zugeben und mitrösten.', settings: [b('8', 5, 'Hack anbraten'), b('5', 3, 'Zwiebel, Tomatenmark')] },
    { text: 'Den Weißkohl in Streifen, die Möhren und Kartoffeln in Würfel schneiden und zugeben.' },
    { text: 'Mit Brühe aufgießen, Kümmel und Paprikapulver zugeben und 30 Minuten köcheln lassen.', settings: [b('Power', undefined, 'aufkochen'), b('4', 30)] },
    { text: 'Abschmecken und mit Petersilie servieren.' },
  ],
  pichelsteiner: [
    { text: 'Rinder-, Schweinegulasch und Lammschulter würfeln und im Butterschmalz anbraten.', settings: [b('7', 6, 'Brücke')] },
    { text: 'Zwiebeln, Möhren, Sellerie, Lauch, Wirsing und Kartoffeln würfeln. Abwechselnd mit dem Fleisch in einen Topf schichten, jede Lage salzen und pfeffern.' },
    { text: 'Den Rinderfond angießen, aufkochen und zugedeckt bei kleiner Hitze 75 Minuten garen, ohne umzurühren.', settings: [b('Power', undefined, 'aufkochen'), b('2', 75, 'Deckel drauf')] },
    { text: 'Mit reichlich Petersilie servieren.' },
  ],
  'steckrueben-eintopf': [
    { text: 'Die Zwiebel im Butterschmalz andünsten. Kasseler und Brühe zugeben, aufkochen und 20 Minuten köcheln lassen.', settings: [b('4', 4, 'andünsten'), b('Power', undefined, 'aufkochen'), b('3', 20)] },
    { text: 'Steckrübe, Kartoffeln und Möhren schälen und würfeln. Zugeben und 30 Minuten garen.', settings: [b('4', 30)] },
    { text: 'Das Kasseler herausnehmen und würfeln. Einen Teil des Gemüses grob zerstampfen, damit der Eintopf sämig wird.' },
    { text: 'Das Fleisch zurückgeben, mit Muskat, Salz und Pfeffer abschmecken und mit Petersilie bestreuen.', settings: [b('Warmhalten')] },
  ],
  wirsingeintopf: [
    { text: 'Die Zwiebel in Butterschmalz andünsten.', settings: [b('4', 4)] },
    { text: 'Wirsing in Streifen, Kartoffeln und Möhren in Würfel schneiden und kurz mitdünsten.', settings: [b('5', 4)] },
    { text: 'Brühe und die Mettenden in Scheiben zugeben, aufkochen und 25 Minuten köcheln lassen.', settings: [b('Power', undefined, 'aufkochen'), b('4', 25)] },
    { text: 'Mit Sahne verfeinern und mit Muskat, Salz und Pfeffer abschmecken.' },
  ],
  moehreneintopf: [
    { text: 'Das Rindfleisch im Butterschmalz anbraten und die Zwiebel mitdünsten. Mit Fond aufgießen, aufkochen und 45 Minuten köcheln lassen.', settings: [b('7', 5, 'anbraten'), b('Power', undefined, 'aufkochen'), b('3', 45)] },
    { text: 'Möhren in Scheiben und Kartoffeln in Würfel schneiden, zugeben und 25 Minuten garen.', settings: [b('4', 25)] },
    { text: 'Mit Muskat, Salz, Pfeffer und einer Prise Zucker abschmecken.' },
    { text: 'Reichlich Petersilie unterrühren.' },
  ],
  huehnereintopf: [
    { text: 'Die Hähnchenschenkel mit halbierter Zwiebel, Lorbeer und 1,5 l Wasser aufkochen und 50 Minuten leise köcheln lassen. Dabei den Schaum abschöpfen.', settings: [b('Power', undefined, 'aufkochen'), b('3', 50)] },
    { text: 'Das Fleisch herausnehmen, von Haut und Knochen lösen und zerpflücken.' },
    { text: 'Möhren, Sellerie und Lauch würfeln und in der Brühe 15 Minuten garen. Die Suppennudeln zugeben und nach Packungsangabe garen.', settings: [b('5', 15), b('6', undefined, 'Nudeln')] },
    { text: 'Das Fleisch zurückgeben und mit Salz, Pfeffer, Muskat und Petersilie abschmecken.', settings: [b('Warmhalten')] },
  ],
  graupeneintopf: [
    { text: 'Den Schweinebauch würfeln, im Topf auslassen und die Zwiebel zugeben.', settings: [b('6', 5, 'auslassen'), b('4', 2, 'Zwiebel')] },
    { text: 'Die Graupen kurz mitrösten und mit Brühe aufgießen. Aufkochen und 30 Minuten köcheln lassen.', settings: [b('Power', undefined, 'aufkochen'), b('4', 30)] },
    { text: 'Möhren, Sellerie, Lauch und Kartoffeln würfeln, zugeben und weitere 25 Minuten garen.', settings: [b('4', 25)] },
    { text: 'Mit Majoran, Salz, Pfeffer und Petersilie abschmecken.' },
  ],
  'gaisburger-marsch': [
    { text: 'Suppenfleisch und Markknochen mit 2 l Wasser, Lorbeer und einer halbierten Zwiebel aufkochen und 2 Stunden leise köcheln lassen. Abschäumen.', settings: [b('Power', undefined, 'aufkochen'), b('3', 120, 'Deckel halb offen')] },
    { text: 'Das Fleisch herausnehmen und würfeln. Die Brühe durch ein Sieb gießen.' },
    { text: 'Möhren, Sellerie, Lauch und Kartoffeln würfeln und in der Brühe 20 Minuten garen. Spätzle und Fleisch zugeben und erhitzen.', settings: [b('4', 20), b('3', 3, 'Spätzle erhitzen')] },
    { text: 'Die zweite Zwiebel in Ringe schneiden, in Butter schmälzen und über den Eintopf geben. Mit Muskat und Schnittlauch servieren.', settings: [b('5', 6, 'Pfanne')] },
  ],
  'serbische-bohnensuppe': [
    { text: 'Den Speck auslassen, Zwiebel, Knoblauch und Paprikawürfel (rot und grün) darin anbraten.', settings: [b('6', 3, 'Speck'), b('5', 5, 'Gemüse')] },
    { text: 'Tomatenmark und Paprikapulver (edelsüß und rosenscharf) mitrösten, dann Tomaten und Fond zugeben.', settings: [b('5', 2)] },
    { text: 'Die Bohnen abgießen, mit der Cabanossi in Scheiben zugeben, aufkochen und 25 Minuten köcheln lassen.', settings: [b('Power', undefined, 'aufkochen'), b('4', 25)] },
    { text: 'Mit Majoran, Salz und Pfeffer kräftig abschmecken.' },
  ],
  kartoffeleintopf: [
    { text: 'Speck und Zwiebel im Topf anbraten.', settings: [b('6', 5)] },
    { text: 'Kartoffeln, Möhren, Lauch und Sellerie würfeln, zugeben, mit Brühe aufgießen, aufkochen und 25 Minuten köcheln lassen.', settings: [b('Power', undefined, 'aufkochen'), b('4', 25)] },
    { text: 'Etwa ein Drittel grob zerstampfen, damit der Eintopf sämig wird. Die Wiener Würstchen in Scheiben darin erhitzen.', settings: [b('3', 5)] },
    { text: 'Mit Majoran, Muskat, Salz, Pfeffer und Petersilie abschmecken.' },
  ],
  'weisse-bohnen-eintopf': [
    { text: 'Das Kasseler würfeln, kurz anbraten und die Zwiebel mitdünsten. Das Tomatenmark kurz mitrösten.', settings: [b('7', 3, 'anbraten'), b('4', 3, 'Zwiebel, Tomatenmark')] },
    { text: 'Möhren, Lauch und Kartoffeln klein schneiden, zugeben und mit Brühe aufgießen. Thymian zugeben.' },
    { text: 'Aufkochen und 25 Minuten köcheln lassen. Die Bohnen abgießen und die letzten 10 Minuten mitgaren.', settings: [b('Power', undefined, 'aufkochen'), b('4', 25)] },
    { text: 'Abschmecken und mit Petersilie servieren.' },
  ],
  gulaschsuppe: [
    { text: 'Das Fleisch klein würfeln und im Butterschmalz kräftig anbraten. Die Zwiebeln zugeben und goldbraun schmoren. Dabei die Abzugs-Lüfterstufe eine Stufe höher stellen.', settings: [b('8', 6, 'Fleisch, Brücke'), b('4', 8, 'Zwiebeln')] },
    { text: 'Tomatenmark und Paprikapulver (edelsüß und rosenscharf) kurz mitrösten und mit Fond ablöschen. Kümmel und Knoblauch zugeben, aufkochen und 60 Minuten köcheln lassen.', settings: [b('5', 1, 'Paprika nicht verbrennen'), b('Power', undefined, 'aufkochen'), b('3', 60)] },
    { text: 'Kartoffeln und Paprika würfeln, zugeben und weitere 25 Minuten garen.', settings: [b('4', 25)] },
    { text: 'Mit Majoran, Salz und Pfeffer kräftig abschmecken.' },
  ],
  'kaese-lauch-suppe': [
    { text: 'Das Hackfleisch im Öl krümelig anbraten und die Zwiebel zugeben.', settings: [b('8', 5, 'Hack anbraten'), b('5', 2, 'Zwiebel')] },
    { text: 'Den Lauch in Ringe schneiden und kurz mitdünsten.', settings: [b('5', 3)] },
    { text: 'Mit Brühe aufgießen, aufkochen und 15 Minuten köcheln lassen.', settings: [b('Power', undefined, 'aufkochen'), b('4', 15)] },
    { text: 'Schmelzkäse und Sahne einrühren, bis alles cremig ist. Mit Muskat, Salz und Pfeffer abschmecken.', settings: [b('2', 4, 'nicht kochen')] },
  ],
  kuerbissuppe: [
    { text: 'Den Kürbis entkernen und mit Schale würfeln. Zwiebel, Kartoffel und Ingwer klein schneiden.' },
    { text: 'Alles in Butter andünsten, mit Brühe aufgießen, aufkochen und 20 Minuten weich kochen.', settings: [b('4', 5, 'andünsten'), b('Power', undefined, 'aufkochen'), b('5', 20)] },
    { text: 'Fein pürieren, Sahne einrühren und mit Muskat, Salz und Pfeffer abschmecken.', settings: [b('Warmhalten')] },
    { text: 'Die Kürbiskerne ohne Fett in einer Pfanne rösten und mit Kürbiskernöl über die Suppe geben.', settings: [b('5', 3, 'Pfanne, ohne Fett')] },
  ],
  tomatensuppe: [
    { text: 'Den Reis nach Packungsangabe separat garen.', settings: [b('Power', undefined, 'aufkochen'), b('3', 15, 'Deckel drauf')] },
    { text: 'Zwiebel und Knoblauch in Butter andünsten und das Tomatenmark kurz mitrösten.', settings: [b('4', 4)] },
    { text: 'Tomaten und Brühe zugeben, 20 Minuten köcheln lassen und fein pürieren.', settings: [b('4', 20)] },
    { text: 'Mit Sahne, Salz, Pfeffer und etwas Zucker abschmecken. Den Reis einrühren und mit Basilikum servieren.', settings: [b('Warmhalten')] },
  ],
  champignoncremesuppe: [
    { text: 'Ein paar schöne Pilze in Scheiben beiseitelegen. Die übrigen Champignons mit der Zwiebel grob hacken.' },
    { text: 'In Butter kräftig anbraten, Mehl darüber stäuben und mit Brühe aufgießen. 15 Minuten köcheln lassen.', settings: [b('8', 5, 'kräftig anbraten'), b('4', 15)] },
    { text: 'Sahne zugeben, fein pürieren und mit Zitrone, Muskat, Salz und Pfeffer abschmecken.', settings: [b('Warmhalten')] },
    { text: 'Die Pilzscheiben anbraten und mit Petersilie als Einlage servieren.', settings: [b('7', 4, 'Pfanne')] },
  ],
  spargelcremesuppe: [
    { text: 'Den Spargel schälen. Schalen und Enden in 1 l Salzwasser mit Zucker aufkochen, 20 Minuten auskochen und abseihen.', settings: [b('Power', undefined, 'aufkochen'), b('4', 20)] },
    { text: 'Die Spargelstangen in Stücke schneiden und im Sud 10 Minuten garen. Herausnehmen.', settings: [b('4', 10)] },
    { text: 'Butter schmelzen, Schalotte andünsten, Mehl anschwitzen und mit 800 ml Sud aufgießen. 5 Minuten köcheln lassen.', settings: [b('4', 4, 'andünsten'), b('4', 5)] },
    { text: 'Sahne mit Eigelb verquirlen und einrühren (nicht mehr kochen). Mit Zitrone und Muskat abschmecken. Die Spargelstücke zugeben und mit Schnittlauch servieren.', settings: [b('Warmhalten', undefined, 'nicht kochen')] },
  ],
  flaedlesuppe: [
    { text: 'Mehl, Ei, Milch und eine Prise Salz zu einem dünnen Pfannkuchenteig verrühren und 10 Minuten ruhen lassen.' },
    { text: 'In Butter hauchdünne Pfannkuchen ausbacken, auskühlen lassen und aufrollen.', settings: [b('5', 10, 'Pfanne')] },
    { text: 'Die Rollen in feine Streifen (Flädle) schneiden.' },
    { text: 'Die Brühe aufkochen, mit Muskat würzen, über die Flädle gießen und mit Schnittlauch servieren.', settings: [b('Power', undefined, 'aufkochen')] },
  ],
  maultaschensuppe: [
    { text: 'Möhre und Lauch in feine Streifen schneiden und in der Brühe 5 Minuten garen.', settings: [b('Power', undefined, 'aufkochen'), b('4', 5)] },
    { text: 'Die Maultaschen zugeben und 10 Minuten ziehen lassen (nicht kochen).', settings: [b('Simmern', 10)] },
    { text: 'Die Zwiebel in Ringe schneiden und in Butter goldbraun schmälzen.', settings: [b('5', 6, 'Pfanne')] },
    { text: 'Die Suppe mit Muskat abschmecken und mit Zwiebeln und Schnittlauch servieren.' },
  ],
  leberknoedelsuppe: [
    { text: 'Die Brötchen in warmer Milch einweichen und ausdrücken.' },
    { text: 'Die Leber fein hacken oder wolfen. Mit Brötchen, Ei, angedünsteter Zwiebel, Petersilie, Majoran, Paniermehl, Salz und Pfeffer zu einer formbaren Masse mischen.', settings: [b('4', 3, 'Zwiebel andünsten')] },
    { text: 'Mit nassen Händen 4 Knödel formen und in leicht siedender Brühe 20 Minuten ziehen lassen.', settings: [b('Power', undefined, 'aufkochen'), b('Simmern', 20, 'nicht kochen')] },
    { text: 'Mit Schnittlauch in der Brühe servieren.' },
  ],
  hochzeitssuppe: [
    { text: 'Für den Eierstich Eier mit Milch, Salz und Muskat verquirlen, in eine gefettete Tasse füllen und mit Folie abdecken. Den Wasserbehälter des CombiSteamers füllen, die Tasse hineinstellen und stocken lassen. Abkühlen lassen und würfeln.', settings: [cs('Dämpfen', 80, 25, 'Wasserbehälter füllen')] },
    { text: 'Das Brät mit nassen Händen zu kleinen Klößchen formen und in siedender Brühe 8 Minuten ziehen lassen.', settings: [b('Power', undefined, 'aufkochen'), b('Simmern', 8)] },
    { text: 'Spargel und Möhre in Stücke schneiden und in der Brühe gar ziehen lassen.', settings: [b('3', 10)] },
    { text: 'Den Eierstich zugeben und mit Schnittlauch servieren.' },
  ],
  soljanka: [
    { text: 'Wurst, Schinken, Paprika, Gurken und Zwiebel in Streifen schneiden.' },
    { text: 'Zwiebel und Wurst anbraten, Tomatenmark und Paprikapulver mitrösten.', settings: [b('6', 6, 'anbraten'), b('5', 2, 'mitrösten')] },
    { text: 'Tomaten, Fond, Paprika, Gurken und einen Schuss Gurkenwasser zugeben, aufkochen und 20 Minuten köcheln lassen.', settings: [b('Power', undefined, 'aufkochen'), b('4', 20)] },
    { text: 'Kräftig abschmecken. Mit einer Zitronenscheibe, einem Klecks saurer Sahne und Dill servieren.' },
  ],

  // ───────────── Gratins und Aufläufe (Combair, Vorgaren im CombiSteamer) ─────────────
  kartoffelgratin: [
    { text: 'Die Kartoffeln schälen und in 3 mm dünne Scheiben hobeln (nicht waschen).' },
    { text: 'Sahne und Milch mit zerdrücktem Knoblauch, Salz, Pfeffer und Muskat aufkochen.', settings: [b('Power', undefined, 'aufkochen')] },
    { text: 'Die Kartoffeln dachziegelartig in eine gebutterte Form schichten, mit der Sahnemilch übergießen und mit Gruyère bestreuen. Den Combair vorheizen, die Form auf Ebene 2 schieben und goldbraun backen.', settings: [ca('Heißluft', 170, 50, 'vorheizen, Ebene 2')] },
    { text: 'Den Feldsalat mit Essig, Öl, Salz und gerösteten Walnüssen anmachen und dazu servieren.' },
  ],
  'kartoffel-hack-auflauf': [
    { text: 'Den Wasserbehälter des CombiSteamers füllen. Die Kartoffeln schälen, in Scheiben schneiden, auf das gelochten Garbehälter legen und vorgaren.', settings: [cs('Dämpfen', 100, 8, 'Wasserbehälter füllen')] },
    { text: 'Das Hackfleisch mit der Zwiebel anbraten, Tomatenmark mitrösten und Tomaten zugeben. Mit Oregano, Paprika, Salz und Pfeffer würzen.', settings: [b('8', 6, 'Hack anbraten'), b('4', 5, 'Sauce')] },
    { text: 'Kartoffeln und Hacksauce in eine Form schichten, mit gewürzter Sahne übergießen und mit Gouda bestreuen.' },
    { text: 'Im vorgeheizten Combair backen.', settings: [ca('Heißluft', 180, 30, 'vorheizen, Ebene 2')] },
  ],
  'schinkennudel-auflauf': [
    { text: 'Die Penne in reichlich Salzwasser mit Deckel aufkochen und bissfest kochen.', settings: [b('Power', undefined, 'aufkochen'), b('7', 9, 'Nudeln')] },
    { text: 'Den Schinken würfeln und mit der Zwiebel kurz anbraten.', settings: [b('6', 4, 'Pfanne')] },
    { text: 'Nudeln, Schinken und Erbsen in eine Form geben. Eier mit Sahne, Milch, Salz, Pfeffer und Muskat verquirlen und darüber gießen.' },
    { text: 'Mit Käse bestreuen, in den vorgeheizten Combair schieben und goldbraun backen.', settings: [ca('Heißluft', 180, 25, 'vorheizen, Ebene 2')] },
  ],
  'brokkoli-kartoffel-auflauf': [
    { text: 'Den Wasserbehälter des CombiSteamers füllen. Die Kartoffeln in Scheiben auf das gelochten Garbehälter legen und vorgaren. Den Brokkoli in Röschen teilen und kurz mitdämpfen.', settings: [cs('Dämpfen', 100, 8, 'Kartoffeln'), cs('Dämpfen', 100, 3, 'Brokkoli später dazu')] },
    { text: 'Beides in eine gefettete Form schichten.' },
    { text: 'Sahne mit Eiern, Salz, Pfeffer und Muskat verquirlen und darüber gießen.' },
    { text: 'Mit Käse bestreuen, in den vorgeheizten Combair schieben und backen.', settings: [ca('Heißluft', 180, 30, 'vorheizen, Ebene 2')] },
  ],
  'blumenkohl-auflauf': [
    { text: 'Den Wasserbehälter des CombiSteamers füllen. Den Blumenkohl in Röschen teilen, mit Salz bestreuen und vorgaren.', settings: [cs('Dämpfen', 100, 8, 'Wasserbehälter füllen')] },
    { text: 'Butter schmelzen, Mehl anschwitzen, Milch einrühren und 5 Minuten köcheln lassen. Mit Muskat, Salz und Pfeffer würzen und die Hälfte des Bergkäses einrühren.', settings: [b('Schmelzen', 2, 'Butter'), b('4', 5, 'Béchamel')] },
    { text: 'Blumenkohl und gewürfelten Kochschinken in eine Form geben, mit der Sauce übergießen und den restlichen Käse darüber streuen.' },
    { text: 'Im vorgeheizten Combair gratinieren.', settings: [ca('Heißluft', 190, 20, 'vorheizen, Ebene 2')] },
  ],
  'zucchini-hack-auflauf': [
    { text: 'Die Zucchini in Scheiben schneiden.' },
    { text: 'Das Hackfleisch mit Zwiebel in Olivenöl anbraten, Tomaten und Oregano zugeben, würzen und 5 Minuten köcheln lassen.', settings: [b('8', 6, 'Hack anbraten'), b('4', 5)] },
    { text: 'Zucchini und Hacksauce in eine Form schichten, Feta darüber bröseln und mit Gouda bestreuen.' },
    { text: 'Im vorgeheizten Combair backen.', settings: [ca('Heißluft', 180, 30, 'vorheizen, Ebene 2')] },
  ],
  'spaetzle-auflauf': [
    { text: 'Das Hähnchen in Streifen schneiden, würzen und im Öl anbraten. Zwiebel und Pilze zugeben und kurz mitbraten.', settings: [b('7', 5, 'Hähnchen'), b('5', 4, 'Zwiebel, Pilze')] },
    { text: 'Mit Sahne ablöschen und abschmecken.', settings: [b('4', 2)] },
    { text: 'Mit den Spätzle mischen, in eine Form füllen und mit Käse bestreuen.' },
    { text: 'Im vorgeheizten Combair überbacken und mit Schnittlauch servieren.', settings: [ca('Heißluft', 180, 20, 'vorheizen, Ebene 2')] },
  ],
  fischauflauf: [
    { text: 'Den Wasserbehälter des CombiSteamers füllen. Die Kartoffeln in Scheiben schneiden, auf das gelochten Garbehälter legen und vorgaren. Den Spinat auftauen und ausdrücken.', settings: [cs('Dämpfen', 100, 8, 'Wasserbehälter füllen')] },
    { text: 'Die Zwiebel andünsten, den Spinat zugeben und mit Muskat, Salz und Pfeffer würzen.', settings: [b('4', 5)] },
    { text: 'Kartoffeln, Spinat und den mit Zitrone beträufelten, gesalzenen Fisch (Seelachs) in eine Form schichten. Die Sahne darüber gießen.' },
    { text: 'Mit Käse bestreuen, in den vorgeheizten Combair schieben und backen.', settings: [ca('Heißluft', 180, 25, 'vorheizen, Ebene 2')] },
  ],
  'sauerkraut-auflauf': [
    { text: 'Den Wasserbehälter des CombiSteamers füllen. Die Kartoffeln schälen, vierteln und garen. Dann mit Milch und Butter zu Püree stampfen.', settings: [cs('Dämpfen', 100, 25, 'Wasserbehälter füllen')] },
    { text: 'Die Zwiebel andünsten, Sauerkraut und gewürfelten Kasseler zugeben und 10 Minuten dünsten.', settings: [b('4', 3, 'Zwiebel'), b('4', 10, 'Deckel drauf')] },
    { text: 'Das Kraut in eine Form geben, das Püree darauf verstreichen und mit Bergkäse bestreuen.' },
    { text: 'Im vorgeheizten Combair goldbraun backen.', settings: [ca('Heißluft', 180, 25, 'vorheizen, Ebene 2')] },
  ],
  'rosenkohl-gratin': [
    { text: 'Den Wasserbehälter des CombiSteamers füllen. Den Rosenkohl putzen, halbieren und auf das gelochten Garbehälter legen. Die Kartoffeln in Scheiben schneiden und auf ein zweites Blech legen. Beides vorgaren.', settings: [cs('Dämpfen', 100, 10, 'Rosenkohl + Kartoffeln')] },
    { text: 'Den Speck knusprig anbraten.', settings: [b('6', 5, 'Pfanne')] },
    { text: 'Alles in eine Form geben, gewürzte Sahne darüber gießen und mit Bergkäse bestreuen.' },
    { text: 'Im vorgeheizten Combair gratinieren.', settings: [ca('Heißluft', 180, 25, 'vorheizen, Ebene 2')] },
  ],
  'chicoree-gratin': [
    { text: 'Den Wasserbehälter des CombiSteamers füllen. Den Chicorée halbieren, den bitteren Strunk keilförmig herausschneiden, mit Zitronensaft beträufeln und auf dem gelochten Garbehälter vorgaren. Die Kartoffeln (Salzkartoffeln) geschält und halbiert auf ein zweites Blech legen.', settings: [cs('Dämpfen', 100, 5, 'Chicorée'), cs('Dämpfen', 100, 25, 'Kartoffeln')] },
    { text: 'Jede Hälfte in eine halbe Scheibe Schinken wickeln und in eine Form legen.' },
    { text: 'Béchamel aus Butter, Mehl und Milch kochen, würzen, über den Chicorée gießen und mit Gruyère bestreuen.', settings: [b('Schmelzen', 2, 'Butter'), b('4', 5, 'Béchamel')] },
    { text: 'Im vorgeheizten Combair gratinieren. Dazu die Salzkartoffeln servieren.', settings: [ca('Heißluft', 190, 20, 'vorheizen, Ebene 2')] },
  ],
  'kartoffel-lauch-gratin': [
    { text: 'Die Kartoffeln in dünne Scheiben hobeln, den Lauch in Ringe schneiden.' },
    { text: 'Die Bratwurst aus der Pelle drücken, in kleinen Stücken anbraten und den Lauch kurz mitdünsten.', settings: [b('6', 5, 'Wurst'), b('4', 3, 'Lauch')] },
    { text: 'Kartoffeln und Lauch-Wurst-Mischung in eine Form schichten. Sahne und Brühe würzen und darüber gießen.' },
    { text: 'Mit Bergkäse bestreuen, in den vorgeheizten Combair schieben und backen.', settings: [ca('Heißluft', 170, 45, 'vorheizen, Ebene 2')] },
  ],

  // ───────────── Braten ─────────────
  'gaensekeulen-rotkohl': [
    { text: 'Die Gänsekeulen waschen, trocken tupfen, mit Salz, Pfeffer und Majoran einreiben. Die Haut mit einer Gabel mehrfach einstechen, damit das Fett austreten kann.' },
    { text: 'Die Keulen mit der Hautseite nach unten im Bräter in Butterschmalz anbraten, wenden und herausnehmen. Zwiebeln, Apfel und Orange in Stücken im Fett leicht anrösten und mit Rotwein ablöschen. Dabei die Abzugs-Lüfterstufe eine Stufe höher stellen.', settings: [b('8', 8, 'Brücke, Abzug Power'), b('5', 5, 'Gemüse')] },
    { text: 'Den Fond angießen und die Keulen mit der Haut nach oben einlegen. Den Combair vorheizen, den Bräter zugedeckt auf Ebene 2 schieben und 2 Stunden schmoren.', settings: [ca('Heißluft feucht', 150, 120, 'vorheizen, Ebene 2', 90)] },
    { text: 'Den Deckel abnehmen und die Keulen trocken kross braten.', settings: [ca('Heißluft', 210, 22, 'ohne Deckel')] },
    { text: 'Den Rotkohl fein hobeln und mit gewürfeltem Apfel, Essig, Zucker, Lorbeer, Nelken und 100 ml Wasser ca. 45 Minuten weich schmoren und abschmecken.', settings: [b('Power', undefined, 'aufkochen'), b('3', 45, 'Deckel drauf')] },
    { text: 'Den Wasserbehälter des CombiSteamers füllen und die Klöße nach Packungsanweisung dämpfen. Den Bratensatz durch ein Sieb passieren, entfetten und mit angerührter Stärke zur Soße binden. Alles zusammen servieren.', settings: [cs('Dämpfen', 100, 25, 'Wasserbehälter füllen'), b('4', 4, 'Soße binden')] },
  ],
  'entenbrust-orangensauce': [
    { text: 'Die Kartoffeln in dünne Scheiben hobeln, in eine gebutterte Form schichten, mit Sahne, Knoblauch, Salz, Pfeffer und Muskat übergießen und mit Gruyère bestreuen. Den Combair vorheizen und das Gratin backen.', settings: [ca('Heißluft', 170, 45, 'vorheizen, Ebene 2')] },
    { text: 'Den Rotkohl fein hobeln und mit gewürfeltem Apfel, Essig, Zucker, Salz und 80 ml Wasser 35 Minuten weich schmoren.', settings: [b('Power', undefined, 'aufkochen'), b('3', 35, 'Deckel drauf')] },
    { text: 'Die Haut der Entenbrust rautenförmig einritzen, salzen und pfeffern. Mit der Hautseite nach unten in eine kalte Pfanne legen, langsam erhitzen und knusprig auslassen.', settings: [b('4', 10, 'Pfanne kalt starten')] },
    { text: 'Die Entenbrust wenden, 4 Minuten braten und dann zum Fertiggaren in den CombiSteamer schieben. Anschließend ruhen lassen.', settings: [b('6', 4, 'wenden'), cs('Heißluft', 160, 6, 'Fühler in die Brust', 58)] },
    { text: 'Für die Soße den Saft von 1 Orange mit Honig und Fond einkochen, mit kalter Butter aufschlagen. Die zweite Orange filetieren und kurz in der Soße erwärmen.', settings: [b('7', 8, 'einkochen'), b('Warmhalten', 2, 'Orangenfilets')] },
    { text: 'Die Entenbrust aufschneiden und mit Soße, Rotkohl und Gratin servieren.' },
  ],
  'entenkeulen-rotkohl': [
    { text: 'Die Entenkeulen salzen, pfeffern und mit Majoran einreiben. Die Haut mehrfach einstechen.' },
    { text: 'Die Keulen mit Zwiebelspalten und Apfelstücken in einen Bräter legen, Rotwein und Fond angießen. Den Combair vorheizen, den Bräter zugedeckt auf Ebene 2 schieben und schmoren.', settings: [ca('Heißluft feucht', 160, 75, 'vorheizen, Ebene 2', 85)] },
    { text: 'Den Deckel abnehmen und die Keulen trocken braten, bis die Haut knusprig ist.', settings: [ca('Heißluft', 200, 25, 'ohne Deckel')] },
    { text: 'Den Rotkohl fein hobeln und mit Apfel, Essig, Zucker, Lorbeer und 100 ml Wasser ca. 45 Minuten schmoren. Die Klöße nach Packungsanweisung im CombiSteamer dämpfen.', settings: [b('Power', undefined, 'aufkochen'), b('3', 45, 'Deckel drauf'), cs('Dämpfen', 100, 25, 'Wasserbehälter füllen')] },
    { text: 'Den Bratensud passieren, entfetten, mit angerührter Stärke binden und abschmecken. Alles zusammen anrichten.', settings: [b('4', 4, 'Soße binden')] },
  ],
  'kalbsbraten-rahmsauce': [
    { text: 'Den Kalbsbraten salzen und pfeffern und in Butterschmalz im Bräter rundum anbraten. Zwiebel und Möhre würfeln, kurz mitrösten und mit Weißwein ablöschen.', settings: [b('8', 8, 'Brücke'), b('5', 4, 'Gemüse')] },
    { text: 'Den Fond angießen und den Braten in den vorgeheizten CombiSteamer schieben. Den Kerntemperaturfühler in die dickste Stelle stecken und garen, bis die Kerntemperatur erreicht ist. Dann herausnehmen und in Folie ruhen lassen.', settings: [cs('Heißluft feucht', 150, 80, 'vorheizen, Fühler', 68)] },
    { text: 'Den Bratensud durch ein Sieb gießen, mit Sahne aufkochen und sämig einkochen. Die Champignons in Butter anbraten und zugeben, nach Bedarf mit Stärke binden.', settings: [b('7', 8, 'einkochen'), b('6', 5, 'Champignons')] },
    { text: 'Die Spätzle in Butter schwenken oder nach Packung erhitzen. Den Braten aufschneiden und mit Rahmsauce und Spätzle servieren.', settings: [b('5', 5, 'Pfanne')] },
  ],

  // ───────────── Topfgerichte (BORA) ─────────────
  'bud-spencer-eintopf': [
    { text: 'Zwiebel, Knoblauch und Paprika würfeln. Das Hackfleisch in Öl im großen Topf krümelig und kräftig anbraten. Dabei die Abzugs-Lüfterstufe eine Stufe höher stellen.', settings: [b('8', 6, 'Hack anbraten')] },
    { text: 'Zwiebel, Knoblauch und Paprika zugeben, Tomatenmark und Gewürze (Paprikapulver, Kreuzkümmel, Chiliflocken) 2 Minuten mitrösten.', settings: [b('5', 2)] },
    { text: 'Passierte Tomaten und Brühe angießen. Die abgetropften Bohnen und den Mais zugeben, aufkochen und 25 Minuten köcheln lassen.', settings: [b('Power', undefined, 'aufkochen'), b('4', 25)] },
    { text: 'Kräftig mit Salz, Pfeffer und Chili abschmecken. Dazu passt Brot.' },
  ],
  schnippelbohneneintopf: [
    { text: 'Die Bohnen putzen und in kleine Stücke schneiden (schnippeln). Kartoffeln und Möhre würfeln, die Zwiebel hacken.' },
    { text: 'Die Zwiebel in Butterschmalz andünsten, Bohnen, Möhre und Kartoffeln zugeben, mit Brühe auffüllen und Bohnenkraut zugeben.', settings: [b('4', 4, 'andünsten')] },
    { text: 'Zugedeckt aufkochen und 25 Minuten köcheln. Die Mettenden in Scheiben schneiden und die letzten 10 Minuten mitgaren.', settings: [b('Power', undefined, 'aufkochen'), b('4', 25)] },
    { text: 'Mit Salz, Pfeffer und einem Schuss Essig abschmecken und mit Petersilie bestreuen.' },
  ],
  'sauerkrauteintopf-kasseler': [
    { text: 'Die Zwiebel würfeln und in Butterschmalz glasig dünsten, Paprikapulver kurz mitrösten.', settings: [b('4', 4)] },
    { text: 'Das Sauerkraut zugeben und kurz anschwitzen. Kartoffeln würfeln und mit Brühe, Wacholder und Lorbeer dazugeben.', settings: [b('5', 3)] },
    { text: 'Den Kasseler in Würfel schneiden, zufügen, aufkochen und 30 Minuten bei kleiner Hitze köcheln.', settings: [b('Power', undefined, 'aufkochen'), b('3', 30)] },
    { text: 'Mit Salz und Pfeffer abschmecken und mit einem Klecks Schmand servieren.' },
  ],
  'kuerbis-hack-eintopf': [
    { text: 'Den Kürbis entkernen und mit Schale (Hokkaido) würfeln. Kartoffeln, Zwiebel und Paprika würfeln.' },
    { text: 'Das Hackfleisch in Öl krümelig anbraten, die Zwiebel zugeben und das Tomatenmark mitrösten. Mit Paprikapulver und Majoran würzen.', settings: [b('8', 6, 'Hack anbraten'), b('5', 3, 'Zwiebel, Tomatenmark')] },
    { text: 'Kürbis, Kartoffeln und Paprika zugeben, die Brühe angießen, aufkochen und 20 Minuten köcheln, bis alles weich ist.', settings: [b('Power', undefined, 'aufkochen'), b('4', 20)] },
    { text: 'Einen Teil des Kürbisses zerdrücken, damit der Eintopf sämig wird. Mit Schmand, Salz und Pfeffer abschmecken.' },
  ],
  'paprika-hack-topf': [
    { text: 'Paprika in Streifen, Kartoffeln in kleine Würfel schneiden, Zwiebel und Knoblauch hacken.' },
    { text: 'Das Hackfleisch in Öl scharf anbraten, Zwiebel und Knoblauch zugeben. Tomatenmark und Paprikapulver kurz mitrösten.', settings: [b('9', 6, 'Hack scharf anbraten'), b('5', 3, 'Zwiebel, Tomatenmark')] },
    { text: 'Paprika und Kartoffeln zugeben, mit Brühe auffüllen, aufkochen und 20 Minuten köcheln.', settings: [b('Power', undefined, 'aufkochen'), b('4', 20)] },
    { text: 'Die Sahne einrühren, kurz aufkochen und mit Salz und Pfeffer abschmecken.', settings: [b('7', 2)] },
  ],
  'westfaelisches-blindhuhn': [
    { text: 'Den Räucherbauch im Ganzen in der Brühe aufkochen und 30 Minuten vorgaren. Die Speckwürfel in einem Topf auslassen, die Zwiebel darin andünsten.', settings: [b('Power', undefined, 'aufkochen'), b('3', 30, 'Bauch'), b('5', 4, 'Speck, Zwiebel')] },
    { text: 'Kartoffeln und Möhre würfeln, Bohnen in Stücke brechen. Mit der Brühe samt Bauch und Bohnenkraut zu den Zwiebeln geben und 20 Minuten garen.', settings: [b('4', 20)] },
    { text: 'Birne und Apfel schälen, in Spalten schneiden und die letzten 10 Minuten mitgaren.', settings: [b('4', 10)] },
    { text: 'Das Fleisch herausnehmen, würfeln und zurück in den Eintopf geben. Mit Salz und Pfeffer abschmecken.' },
  ],
  schnuesch: [
    { text: 'Möhren und Kartoffeln würfeln, Bohnen in Stücke schneiden, den Schinken (Katenschinken) in kleine Würfel schneiden. Die Zwiebel würfeln.' },
    { text: 'Die Zwiebel in Butter andünsten, Mehl darüberstäuben, Brühe und Milch einrühren.', settings: [b('4', 4)] },
    { text: 'Das Gemüse zugeben, aufkochen und 20 Minuten köcheln, bis es weich ist.', settings: [b('Power', undefined, 'aufkochen'), b('4', 20)] },
    { text: 'Den Schinken zugeben, mit Muskat, Salz und Pfeffer abschmecken und mit Petersilie servieren.' },
  ],
  'chili-con-carne': [
    { text: 'Zwiebel, Knoblauch, Paprika und Chili würfeln. Das Rinderhackfleisch in Öl kräftig und krümelig anbraten. Dabei die Abzugs-Lüfterstufe eine Stufe höher stellen.', settings: [b('8', 6, 'Hack anbraten')] },
    { text: 'Zwiebel, Knoblauch und Gewürze (Paprikapulver, Kreuzkümmel) zugeben, das Tomatenmark kurz mitrösten.', settings: [b('5', 3)] },
    { text: 'Tomaten, Brühe und Paprika zugeben, aufkochen und 30 Minuten bei kleiner Hitze köcheln. Kidneybohnen und Mais zufügen und 10 Minuten mitkochen.', settings: [b('Power', undefined, 'aufkochen'), b('3', 30), b('3', 10, 'Bohnen, Mais')] },
    { text: 'Abschmecken und mit Schmand servieren, dazu passt Brot oder Reis.' },
  ],

  // ───────────── Gehobene Braten ─────────────
  // Schmoren: Bräter im Ofen (Heißluft feucht, Deckel drauf), Beilage parallel im anderen Gerät; Fleisch rosa: Combair Zartgaren mit Gargutsensor
  'rinderschmorbraten-rotwein': [
    { text: 'Den Rinderbraten salzen, pfeffern und im Butterschmalz im Bräter rundum kräftig anbraten, dann herausnehmen. Dabei den Abzug eine Stufe höher stellen. 1 Zwiebel, Möhren und Sellerie grob würfeln und im Bratfett anrösten, das Tomatenmark kurz mitrösten.', settings: [b('8', 8, 'Brücke'), b('5', 6, 'Gemüse anrösten')] },
    { text: 'Mit dem Rotwein in drei Portionen ablöschen und jeweils fast ganz einkochen lassen. Rinderfond, Lorbeer, Wacholderbeeren und Thymian zugeben und den Braten einlegen.', settings: [b('8', 12, 'Rotwein einkochen')] },
    { text: 'Den Bräter zugedeckt in den vorgeheizten Combair schieben und schmoren, bis eine Gabel leicht hineingleitet (Garprobe nach 2 Stunden).', settings: [ca('Heißluft feucht', 150, 150, 'vorheizen, Ebene 2, Deckel drauf')] },
    { text: 'Für die Serviettenknödel die Brötchen würfeln, mit warmer Milch übergießen und 15 Minuten ziehen lassen. Die zweite Zwiebel fein würfeln und in 10 g Butter glasig dünsten. Mit Eiern, gehackter Petersilie, Salz und Muskat unter die Brötchen kneten.', settings: [b('4', 4, 'Zwiebel')] },
    { text: 'Den Wasserbehälter des CombiSteamers füllen. Die Masse zu einer Rolle (ca. 7 cm dick) formen, fest in gebutterte Frischhaltefolie wickeln, die Enden abbinden und auf dem gelochten Garbehälter dämpfen.', settings: [cs('Dämpfen', 100, 35, 'Wasserbehälter füllen, gelocht, Ebene 2')] },
    { text: 'Den Rotkohl fein hobeln und mit gewürfeltem Apfel, Essig, Zucker, Nelken, Salz und 100 ml Wasser zugedeckt weich schmoren.', settings: [b('Power', undefined, 'aufkochen'), b('3', 45, 'Deckel drauf')] },
    { text: 'Den Braten herausnehmen, die Sauce durch ein Sieb passieren, auf ca. 300 ml einkochen und vom Herd genommen 20 g kalte Butter einschwenken. Knödelscheiben in der restlichen Butter goldbraun braten, den Braten aufschneiden und mit Sauce und Rotkohl anrichten.', settings: [b('8', 10, 'einkochen'), b('6', 4, 'Knödelscheiben, Pfanne')] },
  ],
  'ochsenbaeckchen-spaetburgunder': [
    { text: 'Die Ochsenbäckchen von Fett und Silberhaut befreien, salzen, pfeffern und dünn im Mehl wenden. Im Butterschmalz im Bräter rundum dunkel anbraten und herausnehmen. Dabei den Abzug eine Stufe höher stellen.', settings: [b('8', 8, 'Brücke')] },
    { text: 'Schalotten, 1 Möhre, 100 g Sellerie und Knoblauch würfeln und im Bratfett anrösten, Tomatenmark mitrösten. Den Rotwein (Spätburgunder) nach und nach angießen und jeweils sirupartig einkochen.', settings: [b('5', 5, 'anrösten'), b('8', 12, 'einkochen')] },
    { text: 'Rinderfond, Thymian und Lorbeer zugeben und die Bäckchen einlegen. Den Bräter zugedeckt in den vorgeheizten CombiSteamer schieben und schmoren, bis die Bäckchen butterweich sind (Gabelprobe).', settings: [cs('Heißluft feucht', 140, 180, 'vorheizen, Ebene 2, Deckel drauf')] },
    { text: 'Für das Püree den restlichen Sellerie schälen, würfeln und in der Milch mit etwas Salz zugedeckt weich garen. Mit 30 g Butter fein pürieren und mit Muskat abschmecken.', settings: [b('5', undefined, 'aufkochen, Milch kocht leicht über'), b('3', 20, 'Deckel drauf')] },
    { text: 'Die übrigen Möhren schräg in Scheiben schneiden und mit 20 g Butter, Zucker, Salz und 50 ml Wasser glasieren, bis die Flüssigkeit verkocht ist. Mit Petersilie bestreuen.', settings: [b('4', 12, 'glasieren')] },
    { text: 'Die Bäckchen herausnehmen, die Sauce passieren und sämig einkochen. Die Bäckchen darin glasieren und mit Püree und Möhren anrichten.', settings: [b('8', 10, 'einkochen'), b('Warmhalten', 5, 'glasieren')] },
  ],
  'rinderfilet-rotweinjus': [
    { text: 'Das Rinderfilet 1 Stunde vorher aus dem Kühlschrank nehmen, parieren und mit Küchengarn in Form binden. Die Pfanne vorheizen, das Filet direkt vor dem Anbraten salzen und im Butterschmalz rundum höchstens 5 Minuten anbraten, den Thymian kurz mitbraten.', settings: [b('9', 5, 'Pfanne vorheizen, max. 5 Min.')] },
    { text: 'Am Combair Zartgaren wählen und als Zieltemperatur 54 °C einstellen (rosa, etwas über „medium rare“). Das Filet auf den Gitterrost (Ebene 2) legen, darunter das Kuchenblech mit Alufolie (Ebene 1), den Gargutsensor mittig in die dickste Stelle stecken und die Tür geschlossen lassen. Das Gerät schaltet bei 54 °C ab (ca. 1,5 Stunden). Pfeffern.', settings: [{ device: 'combair', mode: 'Zartgaren', core: 54, note: 'Gargutsensor, Rost Ebene 2, Blech Ebene 1' }] },
    { text: 'Den Wasserbehälter des CombiSteamers füllen. Die Kartoffeln schälen, halbieren und auf dem gelochten Garbehälter dämpfen. Die Bohnen putzen und für die letzten 7 Minuten auf einer zweiten Ebene mitdämpfen, dann kalt abschrecken.', settings: [cs('Dämpfen', 100, 25, 'Wasserbehälter füllen, gelocht'), cs('Dämpfen', 100, 7, 'Bohnen dazu')] },
    { text: 'Die Kartoffeln ausdampfen lassen, durchpressen und mit Eigelb, 30 g Butter, Salz und Muskat glatt rühren. Mit einem Spritzbeutel Rosetten auf das Kuchenblech mit Backpapier spritzen und im vorgeheizten CombiSteamer goldbraun backen.', settings: [cs('Heißluft', 200, 15, 'vorheizen, Ebene 2')] },
    { text: 'Die Bohnen zu 6 Bündeln mit je einer Scheibe Bacon umwickeln und in der Pfanne rundum knusprig braten.', settings: [b('6', 6, 'Pfanne')] },
    { text: 'Für den Jus die Schalotten fein würfeln und im Bratensatz anschwitzen. Mit Rotwein ablöschen und fast ganz einkochen, Rinderfond zugeben und auf ein Drittel reduzieren. Durch ein Sieb gießen und 40 g kalte Butter einschwenken.', settings: [b('4', 3, 'Schalotten'), b('8', 15, 'reduzieren'), b('Warmhalten', undefined, 'Butter einschwenken')] },
    { text: 'Das Filet in Scheiben schneiden und mit Jus, Herzoginkartoffeln und Speckbohnen anrichten.' },
  ],
  'roastbeef-remoulade': [
    { text: 'Das Roastbeef 1 Stunde vorher aus dem Kühlschrank nehmen und den Fettdeckel rautenförmig einritzen. Die Pfanne vorheizen, das Fleisch direkt vor dem Anbraten salzen und in 1 EL Butterschmalz rundum höchstens 5 Minuten anbraten, die Fettseite zuerst.', settings: [b('9', 5, 'Pfanne vorheizen, max. 5 Min.')] },
    { text: 'Am Combair Zartgaren wählen und als Zieltemperatur 55 °C einstellen (rosa; Vorschlag für Roastbeef medium ist 57 °C). Das Roastbeef auf den Gitterrost (Ebene 2), das Kuchenblech mit Alufolie darunter (Ebene 1), den Gargutsensor mittig hineinstecken. Das Gerät schaltet bei 55 °C ab (ca. 2 Stunden). Mit grobem Pfeffer einreiben, ruhen lassen und lauwarm oder kalt hauchdünn aufschneiden.', settings: [{ device: 'combair', mode: 'Zartgaren', core: 55, note: 'Gargutsensor, Rost Ebene 2, Blech Ebene 1' }] },
    { text: 'Den Wasserbehälter des CombiSteamers füllen. Die Kartoffeln mit Schale auf dem gelochten Garbehälter dämpfen (gern schon am Vortag), pellen und in Scheiben schneiden.', settings: [cs('Dämpfen', 100, 30, 'Wasserbehälter füllen, gelocht')] },
    { text: 'Für die Remoulade Gewürzgurken, Kapern, Petersilie und Schnittlauch fein hacken und mit Mayonnaise, Joghurt und Senf verrühren. Mit Salz, Pfeffer und etwas Gurkenwasser abschmecken.' },
    { text: 'Die Speckwürfel in der Pfanne auslassen, die Kartoffeln im restlichen Butterschmalz goldbraun braten und die gewürfelte Zwiebel die letzten Minuten mitbraten. Salzen, pfeffern und mit Roastbeef und Remoulade servieren.', settings: [b('5', 3, 'Speck'), b('6', 15, 'Bratkartoffeln, Pfanne'), b('4', 3, 'Zwiebel')] },
  ],
  'schaeufele-kloesse': [
    { text: 'Die Schwarte des Schäufele rautenförmig einschneiden, ohne ins Fleisch zu schneiden. Das Fleisch mit Salz, Pfeffer und Kümmel einreiben und mit der Schwarte nach unten in einen Bräter mit 2 cm Wasser legen. Im vorgeheizten Combair garen.', settings: [ca('Heißluft feucht', 180, 30, 'vorheizen, Ebene 2, Schwarte unten')] },
    { text: 'Das Schäufele umdrehen, Zwiebeln, Möhre und Sellerie grob geschnitten zugeben, das Dunkelbier angießen und weitergaren. Dabei immer wieder mit dem Sud übergießen.', settings: [ca('Heißluft feucht', 170, 120, 'Schwarte oben')] },
    { text: 'Für die Kruste auf trockene Hitze umstellen und weiterbraten, bis die Schwarte knusprig aufpoppt.', settings: [ca('Heißluft', 220, 20, 'Kruste')] },
    { text: 'Den Wasserbehälter des CombiSteamers füllen. Für die Klöße 300 g Kartoffeln mit Schale auf dem gelochten Garbehälter dämpfen, pellen und fein stampfen.', settings: [cs('Dämpfen', 100, 30, 'Wasserbehälter füllen, gelocht')] },
    { text: 'Die übrigen Kartoffeln schälen, fein reiben und in einem Tuch kräftig ausdrücken, die abgesetzte Stärke aus dem Saft wieder zugeben. Alles mit Salz zu einem Teig verkneten. Das Brötchen würfeln und in Butter rösten, 6 Klöße formen und je einige Croutons in die Mitte drücken.', settings: [b('5', 4, 'Croutons, Pfanne')] },
    { text: 'Die Klöße auf den leicht gefetteten gelochten Garbehälter setzen und dämpfen.', settings: [cs('Dämpfen', 100, 25, 'gelocht, Ebene 2')] },
    { text: 'Für den Krautsalat den Weißkohl fein hobeln und mit Salz kräftig durchkneten. Die Speckwürfel knusprig auslassen und mit Essig, Öl und Zucker unter den Kohl mischen.', settings: [b('5', 5, 'Speck auslassen')] },
    { text: 'Den Bratensud durch ein Sieb gießen, entfetten, mit Rinderfond aufgießen und etwas einkochen. Mit angerührter Speisestärke binden und abschmecken.', settings: [b('8', 8, 'einkochen'), b('4', 2, 'binden')] },
  ],
  'krustenbraten-dunkelbier': [
    { text: 'Die Schwarte des Schweinebauchs in 1-cm-Rauten einschneiden. Die Fleischseite mit Salz, Pfeffer, Kümmel, Majoran und Knoblauch einreiben, die Schwarte nur salzen. Mit der Schwarte nach unten in einen Bräter mit 2 cm Wasser legen und im vorgeheizten CombiSteamer garen.', settings: [cs('Heißluft mit Beschwaden', 170, 30, 'vorheizen, Ebene 2, Schwarte unten')] },
    { text: 'Den Braten umdrehen, 1 Zwiebel und die Möhre grob geschnitten zugeben, das Dunkelbier angießen und den Gargutsensor in die dickste Stelle stecken. Garen, bis der Kern 75 °C erreicht.', settings: [cs('Heißluft mit Beschwaden', 160, 75, 'Schwarte oben, Gargutsensor', 75)] },
    { text: 'Für die Kruste auf trockene Hitze umstellen und weiterbraten, bis die Schwarte aufpoppt.', settings: [cs('Heißluft', 220, 20, 'ohne Dampf')] },
    { text: 'Für die Brezenknödel die Laugenbrezeln in Würfel schneiden und mit warmer Milch übergießen. Die zweite Zwiebel fein würfeln, in 10 g Butter glasig dünsten und mit Eiern, Petersilie, Salz und Muskat unter die Brezen mischen. 15 Minuten ziehen lassen und 6 Knödel formen.', settings: [b('4', 3, 'Zwiebel')] },
    { text: 'Reichlich Salzwasser mit Deckel aufkochen, die Knödel einlegen und sanft ziehen lassen, ohne dass es kocht.', settings: [b('Power', undefined, 'aufkochen'), b('Simmern', 20, 'ziehen lassen')] },
    { text: 'Den Rosenkohl putzen und in Salzwasser garen. In der restlichen Butter mit den Maronen und dem Zucker kurz glasieren.', settings: [b('Power', undefined, 'aufkochen'), b('6', 8), b('5', 4, 'glasieren, Pfanne')] },
    { text: 'Den Bratensud durch ein Sieb gießen, entfetten, mit Rinderfond aufgießen, etwas einkochen und mit angerührter Speisestärke binden. Den Braten in Scheiben schneiden und mit Knödeln, Rosenkohl und Sauce servieren.', settings: [b('8', 6, 'einkochen'), b('4', 2, 'binden')] },
  ],
  'schweinefilet-speckmantel': [
    { text: 'Das Schweinefilet parieren, pfeffern und dünn mit Senf bestreichen. Thymian, Rosmarin und Petersilie fein hacken, das Filet darin wälzen und mit den Baconscheiben überlappend umwickeln.' },
    { text: 'Den Combair vorheizen. Das Filet im Butterschmalz rundum 4 Minuten anbraten, in eine Form legen, den Gargutsensor mittig hineinstecken und garen, bis der Kern 62 °C erreicht. 5 Minuten ruhen lassen.', settings: [b('7', 4, 'Pfanne vorheizen'), ca('Heißluft', 180, 20, 'vorheizen, Ebene 2, Gargutsensor', 62)] },
    { text: 'Den Wirsing in feine Streifen schneiden, die Zwiebel würfeln und in 10 g Butter glasig dünsten. Wirsing zugeben, mit Kalbsfond und Sahne aufgießen und sämig garen. Mit Salz, Pfeffer und Muskat abschmecken.', settings: [b('4', 3, 'Zwiebel'), b('3', 10, 'Deckel halb drauf')] },
    { text: 'Die Schupfnudeln in der restlichen Butter goldbraun braten.', settings: [b('6', 8, 'Pfanne')] },
    { text: 'Das Filet in dicke Scheiben schneiden und mit Rahmwirsing und Schupfnudeln anrichten.' },
  ],
  'kalbshuefte-morchelrahm': [
    { text: 'Die Morcheln in 200 ml lauwarmem Wasser 30 Minuten einweichen. Abgießen, das Einweichwasser durch einen Kaffeefilter auffangen, die Pilze gründlich waschen und große halbieren.' },
    { text: 'Die Kalbshüfte 1 Stunde vorher aus dem Kühlschrank nehmen und Sehnen entfernen. Die Pfanne vorheizen, das Fleisch direkt vor dem Anbraten salzen und im Butterschmalz rundum höchstens 5 Minuten anbraten.', settings: [b('8', 5, 'Pfanne vorheizen, max. 5 Min.')] },
    { text: 'Am Combair Zartgaren wählen und als Zieltemperatur 61 °C einstellen (rosa; Vorschlag für Kalbshüfte medium ist 63 °C). Die Hüfte auf den Gitterrost (Ebene 2), das Kuchenblech mit Alufolie darunter (Ebene 1), den Gargutsensor mittig hineinstecken. Das Gerät schaltet bei 61 °C ab (ca. 1,5 bis 2 Stunden). Pfeffern und ruhen lassen.', settings: [{ device: 'combair', mode: 'Zartgaren', core: 61, note: 'Gargutsensor, Rost Ebene 2, Blech Ebene 1' }] },
    { text: 'Für die Spätzle Mehl, Eier, ca. 80 ml Wasser, Salz und Muskat kräftig schlagen, bis der Teig Blasen wirft, und 10 Minuten ruhen lassen.' },
    { text: 'Reichlich Salzwasser aufkochen, den Teig portionsweise hineinschaben oder -drücken. Sobald die Spätzle oben schwimmen, abschöpfen.', settings: [b('Power', undefined, 'aufkochen'), b('6', 10, 'portionsweise')] },
    { text: 'Für den Rahm die Schalotten fein würfeln und in 10 g Butter anschwitzen, die Morcheln 2 Minuten mitdünsten. Mit Weißwein ablöschen und einkochen, Kalbsfond, Einweichwasser und Sahne zugeben und sämig einkochen.', settings: [b('4', 5, 'anschwitzen'), b('7', 10, 'einkochen')] },
    { text: 'Die Spätzle in der restlichen Butter schwenken und mit Schnittlauch bestreuen. Die Hüfte aufschneiden und mit Morchelrahm und Spätzle anrichten.', settings: [b('5', 3, 'Pfanne')] },
  ],
  'kalbsbaeckchen-weissweinrahm': [
    { text: 'Die Kalbsbäckchen parieren, salzen, pfeffern und dünn im Mehl wenden. Im Butterschmalz im Bräter rundum hell anbraten und herausnehmen.', settings: [b('7', 8, 'Brücke')] },
    { text: 'Schalotten, Möhre und Sellerie fein würfeln und glasig anschwitzen. Mit Weißwein ablöschen und zur Hälfte einkochen.', settings: [b('4', 4, 'anschwitzen'), b('7', 5, 'einkochen')] },
    { text: 'Kalbsfond, Lorbeer und Thymian zugeben und die Bäckchen einlegen. Den Bräter zugedeckt in den vorgeheizten Combair schieben und schmoren, bis die Bäckchen weich sind (Gabelprobe).', settings: [ca('Heißluft feucht', 150, 120, 'vorheizen, Ebene 2, Deckel drauf')] },
    { text: 'Den Wasserbehälter des CombiSteamers füllen. Die Kartoffeln schälen, halbieren und auf dem gelochten Garbehälter weich dämpfen. Ausdampfen lassen, durchpressen und mit heißer Milch, 30 g Butter, Salz und Muskat zu Püree rühren.', settings: [cs('Dämpfen', 100, 25, 'Wasserbehälter füllen, gelocht'), b('4', 3, 'Milch erwärmen')] },
    { text: 'Die Erbsen in der restlichen Butter dünsten und salzen.', settings: [b('4', 4)] },
    { text: 'Die Bäckchen herausnehmen, die Sauce passieren, Sahne zugeben und sämig einkochen. Die Bäckchen in der Sauce erwärmen und mit Püree und Erbsen anrichten.', settings: [b('7', 10, 'einkochen'), b('Simmern', 5, 'erwärmen')] },
  ],
  'lammkeule-rosmarinjus': [
    { text: 'Die Lammkeule 1 Stunde vorher aus dem Kühlschrank nehmen und mit Küchengarn in Form binden. Die Pfanne vorheizen, das Fleisch direkt vor dem Anbraten salzen und im Olivenöl rundum höchstens 5 Minuten anbraten, 2 angedrückte Knoblauchzehen und 2 Zweige Rosmarin kurz mitbraten.', settings: [b('8', 5, 'Pfanne vorheizen, max. 5 Min.')] },
    { text: 'Am Combair Zartgaren wählen und die Zieltemperatur von 65 °C (medium) auf 60 °C für rosa senken. Die Keule auf den Gitterrost (Ebene 2), das Kuchenblech mit Alufolie darunter (Ebene 1), den Gargutsensor mittig hineinstecken. Das Gerät schaltet bei 60 °C ab (ca. 2 Stunden). Pfeffern und ruhen lassen.', settings: [{ device: 'combair', mode: 'Zartgaren', core: 60, note: 'Gargutsensor, Rost Ebene 2, Blech Ebene 1' }] },
    { text: 'Für das Gratin die Kartoffeln schälen und in dünne Scheiben hobeln. Eine Form mit 1 Knoblauchzehe ausreiben und mit 10 g Butter fetten. Kartoffeln einschichten, Sahne und Milch mit Salz, Pfeffer und Muskat darübergießen, mit Gruyère bestreuen und im vorgeheizten CombiSteamer backen, bis die Oberfläche goldbraun ist.', settings: [cs('Heißluft mit Beschwaden', 170, 45, 'vorheizen, Ebene 2')] },
    { text: 'Für den Jus die Schalotten fein würfeln und im Bratensatz anschwitzen, den restlichen Rosmarin zugeben. Mit Rotwein ablöschen und fast ganz einkochen, Lammfond zugeben und auf ein Drittel reduzieren. Passieren und 20 g kalte Butter einschwenken.', settings: [b('4', 3, 'Schalotten'), b('8', 15, 'reduzieren'), b('Warmhalten', undefined, 'Butter einschwenken')] },
    { text: 'Die Bohnen in Salzwasser garen und in der restlichen Butter mit der letzten, fein gehackten Knoblauchzehe schwenken.', settings: [b('Power', undefined, 'aufkochen'), b('6', 7), b('5', 2, 'schwenken')] },
    { text: 'Die Keule aufschneiden und mit Jus, Bohnen und Gratin anrichten.' },
  ],
  'lammhaxen-polenta': [
    { text: 'Die Lammhaxen salzen, pfeffern und im Olivenöl im Bräter rundum kräftig anbraten, dann herausnehmen. Dabei den Abzug eine Stufe höher stellen.', settings: [b('8', 8, 'Brücke')] },
    { text: 'Zwiebeln, Möhren und Sellerie grob würfeln, 2 Knoblauchzehen andrücken und alles im Bratfett anrösten. Tomatenmark mitrösten, mit Rotwein ablöschen und einkochen.', settings: [b('5', 6, 'anrösten'), b('8', 6, 'einkochen')] },
    { text: 'Lammfond, Tomaten, Rosmarin und Lorbeer zugeben und die Haxen einlegen. Den Bräter zugedeckt in den vorgeheizten CombiSteamer schieben und schmoren, bis sich das Fleisch vom Knochen löst. Nach der Hälfte wenden.', settings: [cs('Heißluft feucht', 160, 150, 'vorheizen, Ebene 2, Deckel drauf')] },
    { text: 'Für die Polenta Milch, 300 ml Wasser und Salz aufkochen, die Polenta einrieseln lassen und unter Rühren bei kleiner Hitze quellen lassen. Parmesan und Butter unterrühren.', settings: [b('6', undefined, 'aufkochen'), b('2', 15, 'quellen, oft rühren')] },
    { text: 'Für die Gremolata Petersilie und den letzten Knoblauch fein hacken und mit abgeriebener Zitronenschale mischen.' },
    { text: 'Die Schmorsauce etwas einkochen und abschmecken. Die Haxen mit Schmorgemüse und Sauce auf der Polenta anrichten und mit Gremolata bestreuen.', settings: [b('7', 5, 'einkochen')] },
  ],
  'kalbsbrust-gefuellt': [
    { text: 'Für die Füllung die Brötchen würfeln, mit warmer Milch übergießen und 15 Minuten ziehen lassen. 1 Zwiebel fein würfeln und in der Butter glasig dünsten, mit Eiern, gehackter Petersilie, Salz und Muskat unter die Brötchen kneten.', settings: [b('4', 4, 'Zwiebel')] },
    { text: 'Die Kalbsbrust (vom Metzger eine Tasche einschneiden lassen) innen und außen salzen und pfeffern. Die Füllung hineingeben und die Öffnung mit Küchengarn zunähen.' },
    { text: 'Die Brust im Butterschmalz im Bräter rundum anbraten, 1 Zwiebel und die Möhre grob geschnitten mitrösten. Mit Weißwein ablöschen und den Kalbsfond angießen.', settings: [b('7', 8, 'Brücke'), b('5', 4, 'Gemüse')] },
    { text: 'Den Gargutsensor in die dickste Stelle (Fleisch, nicht Füllung) stecken, den Bräter zugedeckt in den vorgeheizten Combair schieben und garen, bis der Kern 75 °C erreicht. Dabei öfter begießen.', settings: [ca('Heißluft feucht', 150, 120, 'vorheizen, Ebene 2, Deckel drauf', 75)] },
    { text: 'Den Deckel abnehmen und die Brust bräunen.', settings: [ca('Heißluft', 200, 15, 'ohne Deckel')] },
    { text: 'Den Wasserbehälter des CombiSteamers füllen. Die Kartoffeln mit Schale auf dem gelochten Garbehälter dämpfen, pellen und warm in dünne Scheiben schneiden. Die letzte Zwiebel fein würfeln, mit Brühe, Essig, Senf, Salz und Pfeffer aufkochen und heiß über die Kartoffeln gießen. 20 Minuten ziehen lassen, dann Öl und Schnittlauch unterheben.', settings: [cs('Dämpfen', 100, 30, 'Wasserbehälter füllen, gelocht'), b('Power', undefined, 'Brühe aufkochen')] },
    { text: 'Den Bratensud passieren und etwas einkochen. Die Kalbsbrust in dicke Scheiben schneiden und mit Sauce und Kartoffelsalat servieren.', settings: [b('7', 6, 'einkochen')] },
  ],

  // ───────────── Grundrezepte (Fonds) ─────────────
  'rinderfond-braun': [
    { text: 'Den Combair vorheizen. Die Rinderknochen (vom Metzger in kleine Stücke hacken lassen) auf dem Kuchenblech rösten, dann wenden.', settings: [ca('Heißluft', 220, 25, 'vorheizen, Ebene 2, Kuchenblech')] },
    { text: 'Zwiebeln mit Schale halbieren, Möhren, Sellerie und Lauch grob schneiden, mit dem Öl mischen und zu den Knochen geben. Die Knochen mit Tomatenmark bestreichen und alles dunkelbraun weiterrösten.', settings: [ca('Heißluft', 220, 20)] },
    { text: 'Alles in einen großen Topf geben, das Blech mit dem Rotwein ablöschen und die Röststoffe lösen. Mit 3,5 l kaltem Wasser auffüllen, langsam aufkochen und den Schaum abschöpfen.', settings: [b('8', undefined, 'aufkochen, großer Topf'), b('3', 10, 'abschäumen')] },
    { text: 'Lorbeer, Pfefferkörner, Wacholderbeeren und Thymian zugeben und den Fond ohne Deckel sanft simmern lassen, nicht kochen. Ab und zu Fett und Schaum abschöpfen.', settings: [b('2', 240, 'ohne Deckel')] },
    { text: 'Durch ein mit einem Tuch ausgelegtes Sieb gießen und auf 1,5 l einkochen. Abkühlen lassen, das Fett abheben und in 250- bis 500-ml-Portionen einfrieren (hält ca. 3 Monate).', settings: [b('8', 20, 'einkochen')] },
  ],
  'kalbsfond-hell': [
    { text: 'Die Kalbsknochen kalt abspülen, im großen Topf mit kaltem Wasser bedecken, aufkochen und kurz sprudelnd kochen. Abgießen und kalt abspülen – so wird der Fond hell und klar.', settings: [b('Power', undefined, 'aufkochen, Deckel drauf'), b('8', 5, 'blanchieren')] },
    { text: 'Die Knochen mit 3,5 l kaltem Wasser und dem Weißwein langsam aufkochen und den Schaum gründlich abschöpfen.', settings: [b('7', undefined, 'langsam aufkochen'), b('3', 10, 'abschäumen')] },
    { text: 'Zwiebeln schälen und halbieren, Möhre, Sellerie und Lauch grob schneiden. Mit Petersilienstängeln, Thymian, Lorbeer und Pfefferkörnern zugeben und ohne Deckel sanft simmern lassen.', settings: [b('2', 180, 'ohne Deckel')] },
    { text: 'Durch ein mit einem Tuch ausgelegtes Sieb gießen und auf 1,5 l einkochen. Abkühlen lassen, entfetten und portionsweise einfrieren (hält ca. 3 Monate).', settings: [b('8', 15, 'einkochen')] },
  ],
  'lammfond-dunkel': [
    { text: 'Den Combair vorheizen. Die Lammknochen (klein gehackt) auf dem Kuchenblech rösten, dann wenden.', settings: [ca('Heißluft', 220, 25, 'vorheizen, Ebene 2, Kuchenblech')] },
    { text: 'Zwiebeln mit Schale halbieren, Möhre und Sellerie grob schneiden, Knoblauch andrücken. Mit dem Öl mischen und zu den Knochen geben, die Knochen mit Tomatenmark bestreichen und alles dunkelbraun weiterrösten.', settings: [ca('Heißluft', 220, 20)] },
    { text: 'Alles in einen großen Topf geben, das Blech mit dem Rotwein ablöschen und die Röststoffe lösen. Mit 3 l kaltem Wasser auffüllen, langsam aufkochen und den Schaum abschöpfen.', settings: [b('8', undefined, 'aufkochen, großer Topf'), b('3', 10, 'abschäumen')] },
    { text: 'Rosmarin, Thymian, Lorbeer und Pfefferkörner zugeben und ohne Deckel sanft simmern lassen, dabei Fett abschöpfen.', settings: [b('2', 180, 'ohne Deckel')] },
    { text: 'Durch ein mit einem Tuch ausgelegtes Sieb gießen und auf 1 l einkochen. Abkühlen lassen, entfetten und portionsweise einfrieren (hält ca. 3 Monate).', settings: [b('8', 20, 'einkochen')] },
  ],
  // ───────────── Leicht & sättigend / Brotzeit ─────────────
  'haehnchen-paprika-pfanne': [
    { text: 'Die Kartoffeln mit Schale in Spalten schneiden, mit 1 EL Öl, Salz und dem Paprikapulver mischen und im Airfryer knusprig garen. Den Korb nur halb füllen und 1- bis 2-mal schütteln.', settings: [{ device: 'airfryer', mode: 'Heissluft', temp: 200, minutes: 20, note: 'Korb halb voll' }] },
    { text: 'Das Hähnchen in mundgerechte Streifen schneiden, salzen und pfeffern. Paprika und Zwiebeln in Streifen, Champignons in Scheiben schneiden.' },
    { text: 'Das restliche Öl in einer großen Pfanne erhitzen und das Hähnchen 5 Minuten kräftig anbraten, dann herausnehmen.', settings: [b('8', 2, 'Pfanne vorheizen'), b('7', 5, 'Hähnchen')] },
    { text: 'Zwiebeln, Paprika und Champignons im Bratfett 6 Minuten braten. Das Tomatenmark kurz mitrösten und mit der Hühnerbrühe ablöschen.', settings: [b('6', 6), b('5', 1, 'Tomatenmark')] },
    { text: 'Das Hähnchen zurück in die Pfanne geben, 5 Minuten köcheln lassen, abschmecken und mit Petersilie bestreut zu den Kartoffelspalten servieren.', settings: [b('3', 5, 'köcheln')] },
  ],
  'puten-champignon-geschnetzeltes': [
    { text: 'Den Wasserbehälter des CombiSteamers füllen. Den Langkornreis gründlich waschen, mit 180 ml Wasser und etwas Salz in eine flache Schale geben, auf den gelochten Garbehälter auf Ebene 2 stellen und dämpfen.', settings: [cs('Dämpfen', 100, 22, 'Ebene 2')] },
    { text: 'Die Putenbrust in dünne Streifen schneiden, salzen, pfeffern und mit dem Mehl bestäuben. Champignons in Scheiben, Zwiebel und Knoblauch fein würfeln.' },
    { text: 'Das Öl in einer großen Pfanne erhitzen und die Putenstreifen portionsweise 3 Minuten anbraten, dann herausnehmen.', settings: [b('8', 2, 'Pfanne vorheizen'), b('7', 3, 'portionsweise')] },
    { text: 'Zwiebel, Knoblauch und Champignons im Bratfett 6 Minuten braten, mit der Hühnerbrühe ablöschen und 5 Minuten einköcheln lassen.', settings: [b('6', 6), b('4', 5, 'einköcheln')] },
    { text: 'Die Crème fraîche einrühren, die Putenstreifen zurück in die Sauce geben, kurz erwärmen und mit Petersilie über dem Reis servieren.', settings: [b('2', 2, 'erwärmen')] },
  ],
  'senf-haehnchen-ofengemuese': [
    { text: 'Den Combair vorheizen. Kartoffeln, Möhren, Zucchini, Paprika und rote Zwiebel in mundgerechte Stücke schneiden, mit Öl, Thymian, Salz und Pfeffer mischen und auf dem Kuchenblech verteilen.', settings: [ca('Heißluft', 200, undefined, 'vorheizen, Ebene 2, Kuchenblech')] },
    { text: 'Den Senf mit dem Joghurt, Salz und Pfeffer verrühren und das Hähnchen damit rundum bestreichen.' },
    { text: 'Das Gemüse im Combair 15 Minuten garen, das Hähnchen daraufsetzen, den Kerntemperaturfühler einstecken und weitere 20 Minuten garen, bis die Kerntemperatur erreicht ist.', settings: [ca('Heißluft', 200, 15, 'Gemüse'), ca('Heißluft', 200, 20, 'Hähnchen auf das Gemüse', 72)] },
  ],
  'seelachs-gemuesebett': [
    { text: 'Den Wasserbehälter des CombiSteamers füllen. Die Kartoffeln schälen, halbieren, salzen, auf den gelochten Garbehälter legen und dämpfen. Lauch in Ringe, Möhren in dünne Scheiben und Zwiebel in feine Würfel schneiden.', settings: [cs('Dämpfen', 100, 25, 'Wasserbehälter füllen')] },
    { text: 'Die Butter in einer weiten Pfanne erhitzen, Zwiebel, Lauch und Möhren 5 Minuten dünsten. Mit dem Weißwein ablöschen, den Senf einrühren und salzen.', settings: [b('4', 5, 'dünsten'), b('5', 1, 'ablöschen')] },
    { text: 'Den Seelachs mit Zitronensaft, Salz und Pfeffer würzen, auf das Gemüse legen und zugedeckt 10 Minuten sanft garen.', settings: [b('3', 10, 'Deckel drauf')] },
    { text: 'Die Crème fraîche unter das Gemüse rühren. Die Kartoffeln mit dem Dill mischen und zum Fisch servieren.' },
  ],
  'zander-gurkengemuese': [
    { text: 'Den Wasserbehälter des CombiSteamers füllen. Die Kartoffeln schälen, halbieren, salzen, auf den gelochten Garbehälter legen und dämpfen. Die Gurke schälen, entkernen und in Stücke schneiden, die Zwiebel fein würfeln.', settings: [cs('Dämpfen', 100, 25, 'Wasserbehälter füllen')] },
    { text: 'Die Hälfte der Butter erhitzen, Zwiebel und Gurke 3 Minuten dünsten, mit dem Mehl bestäuben, mit der Gemüsebrühe aufgießen und 5 Minuten köcheln lassen. Crème fraîche und die Hälfte des Dills einrühren, salzen und pfeffern.', settings: [b('4', 3, 'dünsten'), b('3', 5, 'köcheln')] },
    { text: 'Den Zander salzen, pfeffern, mit Zitronensaft beträufeln und in der restlichen Butter 3 bis 4 Minuten je Seite braten.', settings: [b('6', 8, 'Pfanne vorheizen')] },
    { text: 'Die Kartoffeln mit dem restlichen Dill mischen und alles zusammen anrichten.' },
  ],
  'schweinefilet-bohnen': [
    { text: 'Den Wasserbehälter des CombiSteamers füllen. Die Kartoffeln schälen, halbieren, salzen, auf den gelochten Garbehälter legen und 15 Minuten dämpfen. Die Bohnen putzen, dazulegen und die letzten 10 Minuten mitgaren.', settings: [cs('Dämpfen', 100, 15, 'Wasserbehälter füllen'), cs('Dämpfen', 100, 10, 'Bohnen dazu')] },
    { text: 'Das Schweinefilet in 2 cm dicke Medaillons schneiden, leicht flach drücken, salzen und pfeffern.' },
    { text: 'Den Bacon in Streifen im heißen Öl auslassen und herausnehmen. Die Medaillons im Speckfett 3 Minuten je Seite braten und herausnehmen.', settings: [b('5', 3, 'Bacon'), b('6', 6, 'Medaillons')] },
    { text: 'Die Zwiebel im Bratfett anschwitzen, mit der Rinderbrühe ablöschen, den Senf einrühren und kurz einköcheln lassen.', settings: [b('4', 4)] },
    { text: 'Die Bohnen mit Butter, Bohnenkraut und Bacon schwenken und mit den Medaillons, der Sauce und den Kartoffeln servieren.' },
  ],
  'bauernsalat-speck': [
    { text: 'Den Wasserbehälter des CombiSteamers füllen. Die Eier auf den gelochten Garbehälter legen, hart dämpfen, abschrecken und pellen.', settings: [cs('Dämpfen', 100, 11, 'Wasserbehälter füllen')] },
    { text: 'Die Speckwürfel ohne Fett knusprig auslassen und auf Küchenpapier abtropfen lassen.', settings: [b('5', 5, 'ohne Fett')] },
    { text: 'Tomaten, Gurke und Paprika in Stücke, die rote Zwiebel in feine Ringe schneiden. Essig, Öl, Senf, Salz und Pfeffer verrühren und mit dem Gemüse mischen.' },
    { text: 'Die Eier vierteln, mit Speck und Schnittlauch auf den Salat geben und mit dem Vollkornbrot servieren.' },
  ],
  'strammer-max': [
    { text: 'Den Senf mit Essig, Öl, Salz und Pfeffer verrühren. Salat, Tomate und Gurke klein schneiden und mit der Vinaigrette mischen.' },
    { text: 'Das Vollkornbrot mit Katenschinken belegen.' },
    { text: 'Die Butter in einer Pfanne erhitzen und die Eier als Spiegeleier braten, salzen und pfeffern.', settings: [b('4', 4, 'Spiegeleier')] },
    { text: 'Je zwei Spiegeleier auf das Brot legen, mit Schnittlauch bestreuen und mit Gewürzgurken und Salat servieren.' },
  ],
  'wurstsalat-schweizer-art': [
    { text: 'Die Fleischwurst pellen und in dünne Streifen schneiden, den Emmentaler in Streifen, Gewürzgurken und Radieschen in Scheiben, die Zwiebel in feine Ringe schneiden.' },
    { text: 'Essig, Öl, Senf, 3 EL Wasser, Salz und Pfeffer verrühren, mit allem mischen und 15 Minuten durchziehen lassen.' },
    { text: 'Die Brötchen vom Vortag im Airfryer kurz aufbacken, den Wurstsalat mit Schnittlauch bestreuen und dazu servieren.', settings: [{ device: 'airfryer', mode: 'Heissluft', temp: 170, minutes: 4, note: 'Brötchen aufbacken' }] },
  ],
  'brotzeitbrett': [
    { text: 'Den Camembert mit einer Gabel zerdrücken, mit Frischkäse, Paprikapulver, Bier, fein gewürfelter Zwiebel, Salz und Pfeffer zu Obazda verkneten und mit Schnittlauch bestreuen.' },
    { text: 'Radieschen putzen, die Gurke in Scheiben, die Tomate in Spalten schneiden.' },
    { text: 'Vollkornbrot, Katenschinken, Kochschinken, Obazda und das Gemüse auf einem Brett anrichten. Kein Gerät nötig.' },
  ],
}
