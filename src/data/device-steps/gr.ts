import type { DeviceSetting, DeviceStep } from '../../types'

/** Geräte-Schritte (Rezept-ID → Schritte), Gruppe: gr. Stil siehe docs/geraete/regeln.md */

const bora = (level: string, minutes?: number, note?: string): DeviceSetting => ({
  device: 'bora',
  mode: 'Kochzone',
  level,
  ...(minutes ? { minutes } : {}),
  ...(note ? { note } : {}),
})
const steamer = (mode: string, temp: number, minutes?: number, note?: string): DeviceSetting => ({
  device: 'steamer',
  mode,
  temp,
  ...(minutes ? { minutes } : {}),
  ...(note ? { note } : {}),
})
const combair = (mode: string, temp: number, minutes?: number, note?: string, core?: number): DeviceSetting => ({
  device: 'combair',
  mode,
  temp,
  ...(minutes ? { minutes } : {}),
  ...(core ? { core } : {}),
  ...(note ? { note } : {}),
})
const airfryer = (temp: number, minutes: number, note?: string): DeviceSetting => ({
  device: 'airfryer',
  mode: 'Heissluft',
  temp,
  minutes,
  ...(note ? { note } : {}),
})
/** Langkornreis im CombiSteamer (flache Form, Wasser 1:1,5) */
const rice = (gramm: number): DeviceStep => ({
  text: `Den Wasserbehälter des CombiSteamers füllen. Den Langkornreis (${gramm} g) gründlich waschen, mit ${Math.round(gramm * 1.5)} ml Wasser und etwas Salz in eine flache Schale geben, auf den gelochten Garbehälter auf Ebene 2 stellen und dämpfen.`,
  settings: [steamer('Dämpfen', 100, 22, 'Ebene 2')],
})

export const DEVICE_STEPS: Record<string, DeviceStep[]> = {
  'bifteki-feta': [
    {
      text: 'Den Combair vorheizen. Die Kartoffeln schälen, in Spalten schneiden, mit Olivenöl, Salz, Oregano und Zitronensaft mischen, auf ein Blech legen und auf Ebene 2 schieben. Dabei einmal wenden.',
      settings: [combair('Heißluft', 180, 40, 'vorheizen, Ebene 2')],
    },
    {
      text: 'Das Brötchen in Wasser einweichen und gut ausdrücken. Zwiebel und Knoblauch fein hacken. Das Hackfleisch mit Brötchen, Ei, Zwiebel, Knoblauch, gehackter Petersilie, Salz und Pfeffer kräftig verkneten.',
    },
    {
      text: 'Die Hackmasse in vier Portionen teilen und flach drücken. Auf zwei Fladen je 60 g Feta legen, mit den übrigen Fladen abdecken und die Ränder fest zusammendrücken, sodass der Käse eingeschlossen ist.',
    },
    {
      text: 'Die Pfanne 1 Minute vorheizen, etwas Olivenöl zugeben und die Bifteki von jeder Seite 5 bis 6 Minuten braten, bis sie durchgegart sind und der Feta weich ist.',
      settings: [bora('7', 1, 'Pfanne vorheizen'), bora('5', 12, 'je Seite 5–6 Min.')],
    },
    {
      text: 'Mit den Ofenkartoffeln, Tomatenspalten und Tzatziki servieren.',
    },
  ],

  'gyros-metaxa-ueberbacken': [
    rice(120),
    {
      text: 'Die Zwiebeln in Streifen, die Champignons in Scheiben schneiden. Das Gyros-Fleisch in Olivenöl in einer großen Pfanne scharf und knusprig anbraten. Dazu den Abzug eine Stufe höher stellen.',
      settings: [bora('9', 2, 'Pfanne vorheizen'), bora('8', 6, 'Abzug Power')],
    },
    {
      text: 'Zwiebeln und Champignons zugeben und mitbraten.',
      settings: [bora('7', 4)],
    },
    {
      text: 'Den Combair auf 200 °C Grill-Umluft vorheizen. Tomatenmark und Paprikapulver kurz anrösten, mit Metaxa ablöschen und fast verkochen lassen. Die Sahne angießen und die Soße 5 Minuten sämig einköcheln. Mit Salz und Pfeffer abschmecken.',
      settings: [bora('6', 1, 'anrösten'), bora('5', 7, 'einköcheln'), combair('Grill-Umluft', 200, undefined, 'vorheizen')],
    },
    {
      text: 'Den fertig gedämpften Reis in eine Auflaufform geben, das Gyros mit der Soße darüber verteilen und mit Gouda bestreuen.',
    },
    {
      text: 'Die Form auf Ebene 2 in den vorgeheizten Combair schieben und überbacken, bis der Käse goldbraun ist und blubbert.',
      settings: [combair('Grill-Umluft', 200, 10, 'Ebene 2')],
    },
  ],

  'souvlaki-pita': [
    {
      text: 'Den Schweinenacken in 3 cm große Würfel schneiden. Den Knoblauch pressen und mit Olivenöl, dem Saft der Zitrone, Oregano, Salz und Pfeffer verrühren. Das Fleisch darin mindestens 30 Minuten marinieren. Holzspieße so lange in Wasser legen, damit sie in der Pfanne nicht verbrennen.',
    },
    {
      text: 'Die Kartoffeln in Spalten schneiden und mit etwas Olivenöl mischen. Den Airfryer vorheizen, die Spalten in den Korb geben und knusprig garen. Dabei zweimal schütteln.',
      settings: [airfryer(200, 20, 'vorheizen, 2× schütteln')],
    },
    {
      text: 'Das Fleisch auf die Spieße stecken. Die Grillpfanne 2 Minuten vorheizen, die Spieße rundum braten, bis sie gebräunt und innen nicht mehr rosa, aber noch saftig sind. Dazu den Abzug eine Stufe höher stellen.',
      settings: [bora('8', 2, 'Brücke, vorheizen'), bora('7', 12, 'rundum, Abzug Power')],
    },
    {
      text: 'Die Pitabrote 3 Minuten im Airfryer erwärmen. Die rote Zwiebel in Ringe, die Tomaten in Scheiben schneiden.',
      settings: [airfryer(170, 3, 'Pita erwärmen')],
    },
    {
      text: 'Das Fleisch vom Spieß streifen und mit Zwiebel, Tomaten, Kartoffeln und viel Tzatziki in die Pita füllen.',
    },
  ],

  moussaka: [
    {
      text: 'Die Auberginen in 1 cm dicke Scheiben schneiden, salzen und 20 Minuten Wasser ziehen lassen (das nimmt Bitterstoffe und Feuchtigkeit), dann trocken tupfen. Die Kartoffeln schälen und in dünne Scheiben schneiden. Zwiebel und Knoblauch fein hacken.',
    },
    {
      text: 'Den Combair vorheizen. Auberginen und Kartoffeln mit Olivenöl bestreichen, auf zwei Blechen auf Ebene 1 und 3 verteilen und goldbraun backen. Beiseitestellen.',
      settings: [combair('Heißluft', 200, 25, 'vorheizen, Ebene 1+3')],
    },
    {
      text: 'Das Hackfleisch mit Zwiebel und Knoblauch krümelig braten, das Tomatenmark kurz mitrösten und mit Rotwein ablöschen. Gehackte Tomaten, Zimtstange und Oregano zugeben und 20 Minuten köcheln lassen. Die Zimtstange entfernen.',
      settings: [bora('8', 2, 'Pfanne vorheizen'), bora('7', 6, 'krümelig braten'), bora('4', 20, 'köcheln')],
    },
    {
      text: 'Für die Béchamel die Butter schmelzen, das Weizenmehl einrühren und 1 Minute hell anschwitzen. Nach und nach die Milch mit dem Schneebesen einrühren, damit keine Klümpchen entstehen, und unter Rühren 5 Minuten köcheln lassen, bis die Sauce cremig eindickt. Mit Salz, Pfeffer und Muskat würzen, etwas abkühlen lassen (sonst stockt das Ei) und das Eigelb unterrühren.',
      settings: [bora('Schmelzen', 2, 'Butter'), bora('4', 5, 'köcheln')],
    },
    {
      text: 'In eine Auflaufform schichten: Kartoffeln, Hacksoße, Auberginen, dann Béchamel. Mit Gouda bestreuen.',
    },
    {
      text: 'Den Combair auf 180 °C herunterschalten. Die Form auf Ebene 2 in den Combair schieben und backen, bis die Béchamel goldbraun ist. Anschließend 10 Minuten ruhen lassen, damit sich die Schichten beim Anschneiden nicht lösen.',
      settings: [combair('Heißluft', 180, 35, 'Ebene 2')],
    },
  ],

  pastitsio: [
    {
      text: 'Die Ziti in Salzwasser 2 Minuten kürzer als angegeben kochen, abgießen und mit etwas Olivenöl mischen.',
      settings: [bora('Power', undefined, 'aufkochen'), bora('7', 8, 'Nudeln')],
    },
    {
      text: 'Zwiebel und Knoblauch in Olivenöl anschwitzen, das Hackfleisch darin krümelig braten, Tomatenmark zugeben und mit Rotwein ablöschen. Passierte Tomaten, Zimtstange und Lorbeerblatt zugeben und 25 Minuten einköcheln. Zimt und Lorbeer entfernen.',
      settings: [bora('4', 3, 'anschwitzen'), bora('7', 6, 'Hack krümelig'), bora('4', 25, 'einköcheln')],
    },
    {
      text: 'Die Béchamel aus Butter, Weizenmehl und Milch kochen, mit Salz, Pfeffer und Muskat würzen und etwas abkühlen lassen. Ei und die Hälfte des Goudas unterrühren.',
      settings: [bora('Schmelzen', 2, 'Butter'), bora('4', 5, 'köcheln')],
    },
    {
      text: 'Die Hälfte der Nudeln in eine Form geben, die Hacksoße darauf verteilen, die restlichen Nudeln darüber schichten und mit Béchamel und dem restlichen Gouda abschließen.',
    },
    {
      text: 'Den Combair vorheizen. Die Form auf Ebene 2 schieben und backen, bis die Oberfläche goldbraun ist. Vor dem Servieren 10 Minuten ruhen lassen.',
      settings: [combair('Heißluft', 180, 35, 'vorheizen, Ebene 2')],
    },
  ],

  stifado: [
    {
      text: 'Das Rindergulasch trocken tupfen, salzen und in Olivenöl portionsweise rundum kräftig anbraten, dann herausnehmen. Dazu den Abzug eine Stufe höher stellen.',
      settings: [bora('9', 2, 'Brücke, vorheizen'), bora('8', 10, 'Abzug Power')],
    },
    {
      text: 'Die Schalotten schälen und im Bratfett leicht Farbe nehmen lassen. Knoblauch und Tomatenmark kurz mitrösten. Mit Rotwein und Rotweinessig ablöschen und einkochen lassen.',
      settings: [bora('6', 6, 'Schalotten'), bora('7', 4, 'einkochen')],
    },
    {
      text: 'Fleisch, Gehackte Tomaten, Zimtstange, Nelken, Lorbeerblätter, Zucker und 200 ml Wasser zugeben, aufkochen und zugedeckt schmoren, bis das Fleisch zart ist.',
      settings: [bora('Power', undefined, 'aufkochen'), bora('2', 90, 'Deckel drauf')],
    },
    {
      text: 'In den letzten 30 Minuten die geschälten, halbierten Kartoffeln mitgaren. Zimtstange und Lorbeer entfernen und mit Salz und Pfeffer abschmecken.',
      settings: [bora('3', 30, 'Deckel drauf')],
    },
  ],

  'giouvetsi-kritharaki': [
    {
      text: 'Das Rindergulasch in Olivenöl im ofenfesten Bräter rundum anbraten. Zwiebel und Knoblauch fein hacken und zugeben, Tomatenmark mitrösten und mit Rotwein ablöschen. Dazu den Abzug eine Stufe höher stellen.',
      settings: [bora('9', 2, 'Brücke, vorheizen'), bora('8', 8, 'Abzug Power')],
    },
    {
      text: 'Den Combair vorheizen. Passierte Tomaten, Zimtstange, Oregano, Lorbeerblatt und 250 ml Rinderbrühe zugeben, den Bräter zudecken, auf Ebene 2 schieben und schmoren, bis das Fleisch zart ist.',
      settings: [combair('Heißluft', 170, 90, 'vorheizen, Ebene 2')],
    },
    {
      text: 'Zimtstange und Lorbeer entfernen. Das Kritharaki (griechische Nudeln in Reiskornform) und die restliche heiße Rinderbrühe unterrühren und abgedeckt weitergaren, bis die Nudeln weich sind und die Soße aufgesogen ist.',
      settings: [combair('Heißluft', 170, 25, 'abgedeckt')],
    },
    {
      text: 'Mit zerbröseltem Feta bestreuen und kurz offen überbacken oder direkt servieren.',
      settings: [combair('Heißluft', 200, 5, 'offen')],
    },
  ],

  'gyros-kritharaki-topf': [
    {
      text: 'Das Gyros-Fleisch in Olivenöl im breiten Topf kräftig anbraten und herausnehmen. Dazu den Abzug eine Stufe höher stellen.',
      settings: [bora('9', 2, 'Topf vorheizen'), bora('8', 6, 'Abzug Power')],
    },
    {
      text: 'Zwiebel, Paprika rot und grün in Streifen und Knoblauch im Bratfett 4 Minuten anschwitzen.',
      settings: [bora('5', 4)],
    },
    {
      text: 'Passierte Tomaten, Hühnerbrühe und Oregano zugeben und aufkochen. Das Kritharaki einrühren und 10 Minuten offen köcheln, dabei öfter umrühren.',
      settings: [bora('Power', undefined, 'aufkochen'), bora('4', 10, 'köcheln, rühren')],
    },
    {
      text: 'Das Gyros wieder zugeben, mit Salz und Pfeffer abschmecken und den Feta darüber bröseln.',
    },
    {
      text: 'Den Combair vorheizen. Den Topf auf Ebene 2 schieben und überbacken, bis der Käse leicht Farbe hat.',
      settings: [combair('Grill-Umluft', 200, 9, 'vorheizen, Ebene 2')],
    },
  ],

  'kotopoulo-lemonato': [
    {
      text: 'Die Hähnchenschenkel salzen und pfeffern. Die Kartoffeln schälen und in Spalten schneiden.',
    },
    {
      text: 'Zitronensaft, Olivenöl, Senf, Oregano, Knoblauch und Hühnerbrühe verrühren.',
    },
    {
      text: 'Schenkel und Kartoffeln in eine große Form legen, die Zitronenmischung darübergießen und gut vermengen. Einige Zitronenscheiben dazulegen.',
    },
    {
      text: 'Den Combair vorheizen. Die Form auf Ebene 2 schieben und backen. Dabei zwei- bis dreimal wenden und mit dem Sud begießen, bis die Haut knusprig und die Kartoffeln weich sind. Den Kerntemperaturfühler in einen Schenkel stecken.',
      settings: [combair('Heißluft', 190, 60, 'vorheizen, Ebene 2', 85)],
    },
  ],

  'keftedes-reis': [
    {
      text: 'Das Brötchen einweichen und ausdrücken. Das Hackfleisch mit geriebener Zwiebel, Brötchen, Ei, Oregano, gehackter Petersilie, Salz und Pfeffer gut verkneten. Walnussgroße Bällchen formen und leicht in Weizenmehl wenden.',
    },
    rice(150),
    {
      text: 'Die Keftedes in Olivenöl rundum goldbraun anbraten und herausnehmen.',
      settings: [bora('7', 1, 'Pfanne vorheizen'), bora('5', 10, 'rundum')],
    },
    {
      text: 'Den Knoblauch im Bratfett kurz anschwitzen, Passierte Tomaten und Zucker zugeben, salzen und 10 Minuten köcheln lassen. Die Bällchen in der Soße 10 Minuten ziehen lassen.',
      settings: [bora('4', 10, 'köcheln'), bora('Simmern', 10, 'ziehen lassen')],
    },
    {
      text: 'Die Keftedes mit dem Reis und der Soße servieren.',
    },
  ],

  soutzoukakia: [
    {
      text: 'Das Brötchen einweichen und ausdrücken. Mit Hackfleisch, 2 Zehen gepresstem Knoblauch, 1 TL Kreuzkümmel, Ei, Rotwein, Salz und Pfeffer gut verkneten. Zu daumendicken Röllchen formen.',
    },
    rice(150),
    {
      text: 'Die Röllchen in Olivenöl von allen Seiten anbraten und herausnehmen.',
      settings: [bora('7', 1, 'Pfanne vorheizen'), bora('5', 8, 'rundum')],
    },
    {
      text: 'Den restlichen Knoblauch und das Tomatenmark im Bratfett anrösten. Gehackte Tomaten, Zimtstange, restlichen Kreuzkümmel und 100 ml Wasser zugeben und 10 Minuten köcheln.',
      settings: [bora('5', 2, 'anrösten'), bora('4', 10, 'köcheln')],
    },
    {
      text: 'Die Röllchen in die Soße legen und zugedeckt garen. Mit dem Reis servieren.',
      settings: [bora('3', 15, 'Deckel drauf')],
    },
  ],

  gemista: [
    {
      text: 'Bei Paprika und Tomaten einen Deckel abschneiden und aufheben. Die Paprika entkernen, die Tomaten mit einem Löffel aushöhlen und das Fruchtfleisch grob hacken. Die Zwiebel fein würfeln, die Kartoffeln schälen und in Spalten schneiden.',
    },
    {
      text: 'Die Zwiebel in Olivenöl anschwitzen, das Hackfleisch krümelig anbraten. Tomatenfruchtfleisch, rohen Langkornreis, gehackte Petersilie, Oregano, Salz und Pfeffer unterrühren.',
      settings: [bora('4', 3, 'anschwitzen'), bora('7', 6, 'Hack krümelig')],
    },
    {
      text: 'Das Gemüse zu zwei Dritteln mit der Füllung befüllen, weil der Reis quillt. Deckel aufsetzen und in eine Form setzen. Kartoffelspalten dazwischen verteilen, mit Olivenöl beträufeln und 150 ml Wasser angießen.',
    },
    {
      text: 'Den Combair vorheizen. Die Form auf Ebene 2 schieben und backen, bis Reis und Kartoffeln weich sind: Nach 60 Minuten mit einem Löffel etwas Füllung probieren und in eine Kartoffel stechen. Wird die Oberfläche zu dunkel, die Form abdecken.',
      settings: [combair('Heißluft', 170, 70, 'vorheizen, Ebene 2')],
    },
  ],

  'gigantes-feta': [
    {
      text: 'Die weißen Bohnen abgießen und abspülen. Zwiebel, Möhre und Knoblauch fein würfeln und in Olivenöl 5 Minuten anschwitzen.',
      settings: [bora('4', 5, 'anschwitzen')],
    },
    {
      text: 'Passierte Tomaten, Oregano, Zucker, Salz und Pfeffer zugeben und 10 Minuten köcheln. Die Bohnen unterheben.',
      settings: [bora('4', 10, 'köcheln')],
    },
    {
      text: 'Den Combair vorheizen. Die Bohnen in eine Auflaufform füllen, mit zerbröseltem Feta belegen, auf Ebene 2 schieben und backen, bis die Soße eingedickt ist.',
      settings: [combair('Heißluft', 180, 25, 'vorheizen, Ebene 2')],
    },
    {
      text: 'Mit Dill bestreuen und mit Brot servieren.',
    },
  ],
}
