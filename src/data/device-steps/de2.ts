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
    { text: 'Den CombiSteamer vorheizen. Die Kartoffeln schälen, halbieren, mit Salz bestreuen, auf das gelochte Blech legen und dämpfen.', settings: [cs('Dämpfen', 100, 25, 'vorheizen')] },
    { text: 'Den Kohlrabi schälen, in Stifte schneiden und in Butter andünsten. Mehl darüber stäuben, mit Brühe und Sahne aufgießen und 10 Minuten garen. Mit Muskat und Petersilie abschmecken.', settings: [b('4', 3, 'andünsten'), b('3', 10, 'garen')] },
    { text: 'Die Koteletts pfeffern, im heißen Butterschmalz 4 Minuten je Seite braten und danach salzen.', settings: [b('6', 8, 'Pfanne vorheizen')] },
    { text: 'Alles zusammen anrichten.' },
  ],
  'scholle-finkenwerder': [
    { text: 'Den CombiSteamer vorheizen. Die Kartoffeln ungeschält auf das gelochte Blech legen und garen. Pellen, in Scheiben schneiden und mit Brühe, Zwiebel, Essig, Salz und Pfeffer zu lauwarmem Kartoffelsalat anmachen.', settings: [cs('Dämpfen', 100, 30, 'vorheizen')] },
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
    { text: 'Für den Eierstich Eier mit Milch, Salz und Muskat verquirlen, in eine gefettete Tasse füllen und mit Folie abdecken. Den CombiSteamer vorheizen, die Tasse hineinstellen und stocken lassen. Abkühlen lassen und würfeln.', settings: [cs('Dämpfen', 80, 25, 'vorheizen')] },
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
    { text: 'Die Kartoffeln dachziegelartig in eine gebutterte Form schichten, mit der Sahnemilch übergießen und mit Gruyère bestreuen. Den Combair vorheizen, die Form auf Ebene 2 schieben und goldbraun backen.', settings: [ca('Heissluft', 170, 50, 'vorheizen, Ebene 2')] },
    { text: 'Den Feldsalat mit Essig, Öl, Salz und gerösteten Walnüssen anmachen und dazu servieren.' },
  ],
  'kartoffel-hack-auflauf': [
    { text: 'Den CombiSteamer vorheizen. Die Kartoffeln schälen, in Scheiben schneiden, auf das gelochte Blech legen und vorgaren.', settings: [cs('Dämpfen', 100, 8, 'vorheizen')] },
    { text: 'Das Hackfleisch mit der Zwiebel anbraten, Tomatenmark mitrösten und Tomaten zugeben. Mit Oregano, Paprika, Salz und Pfeffer würzen.', settings: [b('8', 6, 'Hack anbraten'), b('4', 5, 'Sauce')] },
    { text: 'Kartoffeln und Hacksauce in eine Form schichten, mit gewürzter Sahne übergießen und mit Gouda bestreuen.' },
    { text: 'Im vorgeheizten Combair backen.', settings: [ca('Heissluft', 180, 30, 'vorheizen, Ebene 2')] },
  ],
  'schinkennudel-auflauf': [
    { text: 'Die Penne in reichlich Salzwasser mit Deckel aufkochen und bissfest kochen.', settings: [b('Power', undefined, 'aufkochen'), b('7', 9, 'Nudeln')] },
    { text: 'Den Schinken würfeln und mit der Zwiebel kurz anbraten.', settings: [b('6', 4, 'Pfanne')] },
    { text: 'Nudeln, Schinken und Erbsen in eine Form geben. Eier mit Sahne, Milch, Salz, Pfeffer und Muskat verquirlen und darüber gießen.' },
    { text: 'Mit Käse bestreuen, in den vorgeheizten Combair schieben und goldbraun backen.', settings: [ca('Heissluft', 180, 25, 'vorheizen, Ebene 2')] },
  ],
  'brokkoli-kartoffel-auflauf': [
    { text: 'Den CombiSteamer vorheizen. Die Kartoffeln in Scheiben auf das gelochte Blech legen und vorgaren. Den Brokkoli in Röschen teilen und kurz mitdämpfen.', settings: [cs('Dämpfen', 100, 8, 'vorheizen, Kartoffeln'), cs('Dämpfen', 100, 3, 'Brokkoli später dazu')] },
    { text: 'Beides in eine gefettete Form schichten.' },
    { text: 'Sahne mit Eiern, Salz, Pfeffer und Muskat verquirlen und darüber gießen.' },
    { text: 'Mit Käse bestreuen, in den vorgeheizten Combair schieben und backen.', settings: [ca('Heissluft', 180, 30, 'vorheizen, Ebene 2')] },
  ],
  'blumenkohl-auflauf': [
    { text: 'Den CombiSteamer vorheizen. Den Blumenkohl in Röschen teilen, mit Salz bestreuen und vorgaren.', settings: [cs('Dämpfen', 100, 8, 'vorheizen')] },
    { text: 'Butter schmelzen, Mehl anschwitzen, Milch einrühren und 5 Minuten köcheln lassen. Mit Muskat, Salz und Pfeffer würzen und die Hälfte des Bergkäses einrühren.', settings: [b('Schmelzen', 2, 'Butter'), b('4', 5, 'Béchamel')] },
    { text: 'Blumenkohl und gewürfelten Kochschinken in eine Form geben, mit der Sauce übergießen und den restlichen Käse darüber streuen.' },
    { text: 'Im vorgeheizten Combair gratinieren.', settings: [ca('Heissluft', 190, 20, 'vorheizen, Ebene 2')] },
  ],
  'zucchini-hack-auflauf': [
    { text: 'Die Zucchini in Scheiben schneiden.' },
    { text: 'Das Hackfleisch mit Zwiebel in Olivenöl anbraten, Tomaten und Oregano zugeben, würzen und 5 Minuten köcheln lassen.', settings: [b('8', 6, 'Hack anbraten'), b('4', 5)] },
    { text: 'Zucchini und Hacksauce in eine Form schichten, Feta darüber bröseln und mit Gouda bestreuen.' },
    { text: 'Im vorgeheizten Combair backen.', settings: [ca('Heissluft', 180, 30, 'vorheizen, Ebene 2')] },
  ],
  'spaetzle-auflauf': [
    { text: 'Das Hähnchen in Streifen schneiden, würzen und im Öl anbraten. Zwiebel und Pilze zugeben und kurz mitbraten.', settings: [b('7', 5, 'Hähnchen'), b('5', 4, 'Zwiebel, Pilze')] },
    { text: 'Mit Sahne ablöschen und abschmecken.', settings: [b('4', 2)] },
    { text: 'Mit den Spätzle mischen, in eine Form füllen und mit Käse bestreuen.' },
    { text: 'Im vorgeheizten Combair überbacken und mit Schnittlauch servieren.', settings: [ca('Heissluft', 180, 20, 'vorheizen, Ebene 2')] },
  ],
  fischauflauf: [
    { text: 'Den CombiSteamer vorheizen. Die Kartoffeln in Scheiben schneiden, auf das gelochte Blech legen und vorgaren. Den Spinat auftauen und ausdrücken.', settings: [cs('Dämpfen', 100, 8, 'vorheizen')] },
    { text: 'Die Zwiebel andünsten, den Spinat zugeben und mit Muskat, Salz und Pfeffer würzen.', settings: [b('4', 5)] },
    { text: 'Kartoffeln, Spinat und den mit Zitrone beträufelten, gesalzenen Fisch (Seelachs) in eine Form schichten. Die Sahne darüber gießen.' },
    { text: 'Mit Käse bestreuen, in den vorgeheizten Combair schieben und backen.', settings: [ca('Heissluft', 180, 25, 'vorheizen, Ebene 2')] },
  ],
  'sauerkraut-auflauf': [
    { text: 'Den CombiSteamer vorheizen. Die Kartoffeln schälen, vierteln und garen. Dann mit Milch und Butter zu Püree stampfen.', settings: [cs('Dämpfen', 100, 25, 'vorheizen')] },
    { text: 'Die Zwiebel andünsten, Sauerkraut und gewürfelten Kasseler zugeben und 10 Minuten dünsten.', settings: [b('4', 3, 'Zwiebel'), b('4', 10, 'Deckel drauf')] },
    { text: 'Das Kraut in eine Form geben, das Püree darauf verstreichen und mit Bergkäse bestreuen.' },
    { text: 'Im vorgeheizten Combair goldbraun backen.', settings: [ca('Heissluft', 180, 25, 'vorheizen, Ebene 2')] },
  ],
  'rosenkohl-gratin': [
    { text: 'Den CombiSteamer vorheizen. Den Rosenkohl putzen, halbieren und auf das gelochte Blech legen. Die Kartoffeln in Scheiben schneiden und auf ein zweites Blech legen. Beides vorgaren.', settings: [cs('Dämpfen', 100, 10, 'vorheizen, Rosenkohl + Kartoffeln')] },
    { text: 'Den Speck knusprig anbraten.', settings: [b('6', 5, 'Pfanne')] },
    { text: 'Alles in eine Form geben, gewürzte Sahne darüber gießen und mit Bergkäse bestreuen.' },
    { text: 'Im vorgeheizten Combair gratinieren.', settings: [ca('Heissluft', 180, 25, 'vorheizen, Ebene 2')] },
  ],
  'chicoree-gratin': [
    { text: 'Den CombiSteamer vorheizen. Den Chicorée halbieren, den bitteren Strunk keilförmig herausschneiden, mit Zitronensaft beträufeln und auf dem gelochten Blech vorgaren. Die Kartoffeln (Salzkartoffeln) geschält und halbiert auf ein zweites Blech legen.', settings: [cs('Dämpfen', 100, 5, 'vorheizen, Chicorée'), cs('Dämpfen', 100, 25, 'Kartoffeln')] },
    { text: 'Jede Hälfte in eine halbe Scheibe Schinken wickeln und in eine Form legen.' },
    { text: 'Béchamel aus Butter, Mehl und Milch kochen, würzen, über den Chicorée gießen und mit Gruyère bestreuen.', settings: [b('Schmelzen', 2, 'Butter'), b('4', 5, 'Béchamel')] },
    { text: 'Im vorgeheizten Combair gratinieren. Dazu die Salzkartoffeln servieren.', settings: [ca('Heissluft', 190, 20, 'vorheizen, Ebene 2')] },
  ],
  'kartoffel-lauch-gratin': [
    { text: 'Die Kartoffeln in dünne Scheiben hobeln, den Lauch in Ringe schneiden.' },
    { text: 'Die Bratwurst aus der Pelle drücken, in kleinen Stücken anbraten und den Lauch kurz mitdünsten.', settings: [b('6', 5, 'Wurst'), b('4', 3, 'Lauch')] },
    { text: 'Kartoffeln und Lauch-Wurst-Mischung in eine Form schichten. Sahne und Brühe würzen und darüber gießen.' },
    { text: 'Mit Bergkäse bestreuen, in den vorgeheizten Combair schieben und backen.', settings: [ca('Heissluft', 170, 45, 'vorheizen, Ebene 2')] },
  ],

  // ───────────── Braten ─────────────
  'gaensekeulen-rotkohl': [
    { text: 'Die Gänsekeulen waschen, trocken tupfen, mit Salz, Pfeffer und Majoran einreiben. Die Haut mit einer Gabel mehrfach einstechen, damit das Fett austreten kann.' },
    { text: 'Die Keulen mit der Hautseite nach unten im Bräter in Butterschmalz anbraten, wenden und herausnehmen. Zwiebeln, Apfel und Orange in Stücken im Fett leicht anrösten und mit Rotwein ablöschen. Dabei die Abzugs-Lüfterstufe eine Stufe höher stellen.', settings: [b('8', 8, 'Brücke, Abzug Power'), b('5', 5, 'Gemüse')] },
    { text: 'Den Fond angießen und die Keulen mit der Haut nach oben einlegen. Den Combair vorheizen, den Bräter zugedeckt auf Ebene 2 schieben und 2 Stunden schmoren.', settings: [ca('Heissluft feucht', 150, 120, 'vorheizen, Ebene 2', 90)] },
    { text: 'Den Deckel abnehmen und die Keulen trocken kross braten.', settings: [ca('Heissluft', 210, 22, 'ohne Deckel')] },
    { text: 'Den Rotkohl fein hobeln und mit gewürfeltem Apfel, Essig, Zucker, Lorbeer, Nelken und 100 ml Wasser ca. 45 Minuten weich schmoren und abschmecken.', settings: [b('Power', undefined, 'aufkochen'), b('3', 45, 'Deckel drauf')] },
    { text: 'Den CombiSteamer vorheizen und die Klöße nach Packungsanweisung dämpfen. Den Bratensatz durch ein Sieb passieren, entfetten und mit angerührter Stärke zur Soße binden. Alles zusammen servieren.', settings: [cs('Dämpfen', 100, 25, 'vorheizen'), b('4', 4, 'Soße binden')] },
  ],
  'entenbrust-orangensauce': [
    { text: 'Die Kartoffeln in dünne Scheiben hobeln, in eine gebutterte Form schichten, mit Sahne, Knoblauch, Salz, Pfeffer und Muskat übergießen und mit Gruyère bestreuen. Den Combair vorheizen und das Gratin backen.', settings: [ca('Heissluft', 170, 45, 'vorheizen, Ebene 2')] },
    { text: 'Den Rotkohl fein hobeln und mit gewürfeltem Apfel, Essig, Zucker, Salz und 80 ml Wasser 35 Minuten weich schmoren.', settings: [b('Power', undefined, 'aufkochen'), b('3', 35, 'Deckel drauf')] },
    { text: 'Die Haut der Entenbrust rautenförmig einritzen, salzen und pfeffern. Mit der Hautseite nach unten in eine kalte Pfanne legen, langsam erhitzen und knusprig auslassen.', settings: [b('4', 10, 'Pfanne kalt starten')] },
    { text: 'Die Entenbrust wenden, 4 Minuten braten und dann zum Fertiggaren in den CombiSteamer schieben. Anschließend ruhen lassen.', settings: [b('6', 4, 'wenden'), cs('Heissluft', 160, 6, 'Fühler in die Brust', 58)] },
    { text: 'Für die Soße den Saft von 1 Orange mit Honig und Fond einkochen, mit kalter Butter aufschlagen. Die zweite Orange filetieren und kurz in der Soße erwärmen.', settings: [b('7', 8, 'einkochen'), b('Warmhalten', 2, 'Orangenfilets')] },
    { text: 'Die Entenbrust aufschneiden und mit Soße, Rotkohl und Gratin servieren.' },
  ],
  'entenkeulen-rotkohl': [
    { text: 'Die Entenkeulen salzen, pfeffern und mit Majoran einreiben. Die Haut mehrfach einstechen.' },
    { text: 'Die Keulen mit Zwiebelspalten und Apfelstücken in einen Bräter legen, Rotwein und Fond angießen. Den Combair vorheizen, den Bräter zugedeckt auf Ebene 2 schieben und schmoren.', settings: [ca('Heissluft feucht', 160, 75, 'vorheizen, Ebene 2', 85)] },
    { text: 'Den Deckel abnehmen und die Keulen trocken braten, bis die Haut knusprig ist.', settings: [ca('Heissluft', 200, 25, 'ohne Deckel')] },
    { text: 'Den Rotkohl fein hobeln und mit Apfel, Essig, Zucker, Lorbeer und 100 ml Wasser ca. 45 Minuten schmoren. Die Klöße nach Packungsanweisung im vorgeheizten CombiSteamer dämpfen.', settings: [b('Power', undefined, 'aufkochen'), b('3', 45, 'Deckel drauf'), cs('Dämpfen', 100, 25, 'vorheizen')] },
    { text: 'Den Bratensud passieren, entfetten, mit angerührter Stärke binden und abschmecken. Alles zusammen anrichten.', settings: [b('4', 4, 'Soße binden')] },
  ],
  'kalbsbraten-rahmsauce': [
    { text: 'Den Kalbsbraten salzen und pfeffern und in Butterschmalz im Bräter rundum anbraten. Zwiebel und Möhre würfeln, kurz mitrösten und mit Weißwein ablöschen.', settings: [b('8', 8, 'Brücke'), b('5', 4, 'Gemüse')] },
    { text: 'Den Fond angießen und den Braten in den vorgeheizten CombiSteamer schieben. Den Kerntemperaturfühler in die dickste Stelle stecken und garen, bis die Kerntemperatur erreicht ist. Dann herausnehmen und in Folie ruhen lassen.', settings: [cs('Heissluft feucht', 150, 80, 'vorheizen, Fühler', 68)] },
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
}
