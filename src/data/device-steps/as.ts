import type { DeviceSetting, DeviceStep } from '../../types'

/** Geräte-Schritte (Rezept-ID → Schritte), Gruppe: as. Stil siehe docs/geraete/regeln.md */

// kleine Helfer, damit die Einstellungen lesbar bleiben
const bora = (level: string, minutes?: number, note?: string): DeviceSetting => ({
  device: 'bora',
  mode: 'Kochzone',
  level,
  ...(minutes ? { minutes } : {}),
  ...(note ? { note } : {}),
})
const steamer = (mode: string, temp: number, minutes?: number, note?: string, core?: number): DeviceSetting => ({
  device: 'steamer',
  mode,
  temp,
  ...(minutes ? { minutes } : {}),
  ...(core ? { core } : {}),
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
/** Reis im CombiSteamer (flache Form, Wasser 1:1,5; Sushireis etwas weniger) */
const rice = (sorte: string, wasser: number): DeviceStep => ({
  text: `Den Wasserbehälter des CombiSteamers füllen. Den ${sorte} gründlich waschen, mit ${wasser} ml Wasser und etwas Salz in eine flache Schale geben, auf den gelochten Garbehälter auf Ebene 2 stellen und dämpfen.`,
  settings: [steamer('Dämpfen', 100, 22, 'Ebene 2')],
})

export const DEVICE_STEPS: Record<string, DeviceStep[]> = {
  'gong-bao': [
    {
      text: 'Das Hähnchenbrustfilet in 1,5 cm große Würfel schneiden und mit 1 EL Sojasauce, Shaoxing-Reiswein und 1 TL Speisestärke marinieren.',
    },
    {
      text: 'Für die Sauce 2 EL Sojasauce, Chinkiang-Essig, Zucker, 1 TL Speisestärke und 3 EL Wasser verrühren.',
    },
    rice('Jasminreis', 225),
    {
      text: 'Den Wok 2 Minuten vorheizen. Das Sonnenblumenöl zugeben und die getrockneten Chilis mit dem Szechuanpfeffer 30 Sekunden anrösten, bis sie duften.',
      settings: [bora('9', 3, 'Wok vorheizen')],
    },
    {
      text: 'Das Hähnchen zugeben und unter Rühren in 3 Minuten goldbraun braten. Dazu den Abzug eine Stufe höher stellen.',
      settings: [bora('9', 3, 'Abzug Power')],
    },
    {
      text: 'Knoblauch, Ingwer und Frühlingszwiebeln zugeben, die Sauce angießen und kurz eindicken. Die gerösteten Erdnüsse unterheben und mit dem Reis servieren.',
      settings: [bora('7', 1, 'eindicken')],
    },
  ],

  'mapo-tofu': [
    rice('Jasminreis', 225),
    {
      text: 'Den Tofu in Würfel schneiden und 2 Minuten in leicht gesalzenem, siedendem Wasser ziehen lassen. Dann abgießen.',
      settings: [bora('Power', undefined, 'aufkochen'), bora('Simmern', 2, 'Tofu ziehen lassen')],
    },
    {
      text: 'Das Schweinehackfleisch im Sonnenblumenöl knusprig braten. Doubanjiang, fermentierte schwarze Bohnen, Knoblauch und Ingwer zugeben und braten, bis das Öl rot wird.',
      settings: [bora('7', 6, 'Hack knusprig'), bora('5', 1, 'Paste braten')],
    },
    {
      text: 'Hühnerbrühe und Sojasauce angießen, den Tofu vorsichtig zugeben und 5 Minuten köcheln lassen. Mit angerührter Speisestärke binden.',
      settings: [bora('4', 5, 'köcheln')],
    },
    {
      text: 'Den Szechuanpfeffer rösten, mörsern und mit den Frühlingszwiebeln über das Mapo Tofu streuen. Mit dem Reis servieren.',
    },
  ],

  'gu-lao-rou': [
    {
      text: 'Den Schweinenacken in mundgerechte Stücke schneiden, mit Salz und Ei mischen und in Speisestärke wenden.',
    },
    rice('Jasminreis', 225),
    {
      text: 'Den Airfryer vorheizen. Das Fleisch in den Korb legen, mit etwas Frittieröl einsprühen und knusprig garen. Dabei zweimal schütteln.',
      settings: [airfryer(190, 14, 'vorheizen, 2× schütteln')],
    },
    {
      text: 'Ketchup, Reisessig, Zucker, Sojasauce, 1 TL Speisestärke und 4 EL Wasser verrühren.',
    },
    {
      text: 'Paprika, Zwiebel und Ananas im heißen Wok kurz pfannenrühren, die Sauce zugeben und eindicken. Das Fleisch unterheben und sofort servieren.',
      settings: [bora('9', 2, 'Wok vorheizen'), bora('6', 1, 'eindicken')],
    },
  ],

  'yangzhou-reis': [
    rice('Jasminreis', 225),
    {
      text: 'Den gedämpften Reis kalt werden lassen und mit den Fingern auflockern. Am besten schon am Vortag zubereiten und kalt stellen.',
    },
    {
      text: 'Die Eier im heißen Wok in 1 EL Sonnenblumenöl zu Rührei braten und herausnehmen. Die Garnelen kurz anbraten und ebenfalls herausnehmen.',
      settings: [bora('9', 1, 'Wok vorheizen'), bora('7', 3, 'Rührei, Garnelen')],
    },
    {
      text: 'Das restliche Öl erhitzen und den Reis unter ständigem Rühren braten, bis er springt. Dazu den Abzug eine Stufe höher stellen.',
      settings: [bora('9', 4, 'Abzug Power')],
    },
    {
      text: 'Kochschinken, Erbsen, Garnelen und Ei zugeben. Mit Sojasauce, Salz und weißem Pfeffer würzen und mit den Frühlingszwiebeln servieren.',
      settings: [bora('7', 2)],
    },
  ],

  'chow-mein': [
    {
      text: 'Die Mie-Nudeln in reichlich Wasser nach Packungsanweisung garen, abschrecken und mit etwas Sonnenblumenöl mischen.',
      settings: [bora('Power', undefined, 'aufkochen'), bora('7', 4, 'Nudeln garen')],
    },
    {
      text: 'Das Hähnchenbrustfilet in Streifen schneiden und mit 1 EL Sojasauce und Speisestärke marinieren.',
    },
    {
      text: 'Den Wok 2 Minuten vorheizen. Das Hähnchen im restlichen Öl braten, dann Knoblauch, Möhrenstreifen und Chinakohl zugeben.',
      settings: [bora('9', 2, 'Wok vorheizen'), bora('9', 4, 'Abzug Power')],
    },
    {
      text: 'Nudeln, Sojasprossen, Sojasauce, dunkle Sojasauce und Austernsauce zugeben und kräftig durchschwenken. Mit Sesamöl und Frühlingszwiebeln servieren.',
      settings: [bora('9', 2)],
    },
  ],

  'rind-brokkoli': [
    {
      text: 'Die Rinderhüfte quer zur Faser in dünne Scheiben schneiden. Mit Sojasauce, Shaoxing-Reiswein und 1 TL Speisestärke marinieren.',
    },
    rice('Jasminreis', 225),
    {
      text: 'Den Brokkoli in Röschen teilen, auf ein gelochten Garbehälter legen und auf Ebene 3 zum Reis in den CombiSteamer schieben. Bissfest dämpfen.',
      settings: [steamer('Dämpfen', 100, 6, 'Ebene 3, gelocht')],
    },
    {
      text: 'Den Wok 2 Minuten vorheizen. Das Fleisch im Sonnenblumenöl 1 Minute scharf anbraten und herausnehmen. Dazu den Abzug eine Stufe höher stellen.',
      settings: [bora('9', 2, 'Wok vorheizen'), bora('Power', 1, 'Abzug Power')],
    },
    {
      text: 'Knoblauch, Ingwer und Brokkoli im Wok braten. Fleisch, Austernsauce, Zucker und 1 TL angerührte Speisestärke zugeben, kurz eindicken und mit dem Reis servieren.',
      settings: [bora('9', 3), bora('7', 1, 'eindicken')],
    },
  ],

  'hui-guo-rou': [
    {
      text: 'Den Schweinebauch mit Ingwer in Wasser aufkochen und 20 Minuten leise köcheln lassen. Dann abkühlen lassen und in hauchdünne Scheiben schneiden.',
      settings: [bora('Power', undefined, 'aufkochen'), bora('3', 20, 'köcheln')],
    },
    rice('Jasminreis', 225),
    {
      text: 'Die Scheiben im Wok mit dem Sonnenblumenöl braten, bis sie sich wölben und das Fett austritt.',
      settings: [bora('7', 6, 'Wok vorheizen')],
    },
    {
      text: 'Doubanjiang und fermentierte schwarze Bohnen zugeben und braten, bis das Öl rot wird.',
      settings: [bora('6', 2)],
    },
    {
      text: 'Spitzpaprika und Frühlingszwiebeln in Stücken, Shaoxing-Reiswein und Zucker zugeben und kurz pfannenrühren. Mit dem Reis servieren.',
      settings: [bora('9', 2, 'Abzug Power')],
    },
  ],

  'tomaten-ei': [
    rice('Jasminreis', 225),
    {
      text: 'Die Eier mit einer Prise Salz verquirlen. Die Tomaten in Spalten schneiden.',
    },
    {
      text: 'Den Wok vorheizen. Das Sonnenblumenöl zugeben und die Eier zu großen, weichen Flocken stocken lassen. Dann herausnehmen.',
      settings: [bora('9', 1, 'Wok vorheizen'), bora('7', 1, 'Ei stocken')],
    },
    {
      text: 'Die Tomaten im Wok braten, bis sie Saft ziehen. Zucker, Tomatenketchup und Salz zugeben.',
      settings: [bora('7', 3)],
    },
    {
      text: 'Die Eier zurückgeben, kurz durchschwenken und mit den Frühlingszwiebeln und dem Reis servieren. Das chinesische Hausmannsgericht schlechthin.',
      settings: [bora('6', 1)],
    },
  ],

  'yu-xiang-qiezi': [
    {
      text: 'Die Auberginen in fingerdicke Stifte schneiden, salzen und 15 Minuten ziehen lassen. Dann trocken tupfen.',
    },
    rice('Jasminreis', 225),
    {
      text: 'Den Airfryer vorheizen. Die Auberginenstifte mit 2 EL Sonnenblumenöl mischen, in den Korb geben und weich garen. Dabei zweimal schütteln.',
      settings: [airfryer(200, 12, 'vorheizen, 2× schütteln')],
    },
    {
      text: 'Chinkiang-Essig, Sojasauce, Zucker, Speisestärke und 4 EL Wasser verrühren.',
    },
    {
      text: 'Das Schweinehackfleisch im restlichen Öl anbraten. Doubanjiang, Knoblauch und Ingwer zugeben und braten, bis es duftet.',
      settings: [bora('8', 4, 'Pfanne vorheizen'), bora('5', 1)],
    },
    {
      text: 'Die Auberginen und die Sauce zugeben, kurz eindicken und mit den Frühlingszwiebeln und dem Reis servieren.',
      settings: [bora('6', 2, 'eindicken')],
    },
  ],

  'dan-dan-mian': [
    {
      text: 'Das Schweinehackfleisch im Sonnenblumenöl knusprig braten und mit 1 EL Sojasauce würzen.',
      settings: [bora('7', 6, 'Pfanne vorheizen')],
    },
    {
      text: 'Sesampaste, restliche Sojasauce, Chinkiang-Essig, Chiliöl, Zucker, Knoblauch und gemörserten Szechuanpfeffer zu einer Sauce verrühren und auf zwei Schüsseln verteilen.',
    },
    {
      text: 'Die Weizennudeln in sprudelndem Wasser kochen. In den letzten 2 Minuten den Pak Choi mitgaren.',
      settings: [bora('Power', undefined, 'aufkochen'), bora('7', 5, 'Nudeln, Pak Choi')],
    },
    {
      text: 'Die Nudeln mit etwas Kochwasser auf die Sauce geben. Hack, gehackte Erdnüsse und Frühlingszwiebeln darauf verteilen und vor dem Essen alles vermengen.',
    },
  ],

  'cashew-huhn': [
    {
      text: 'Das Hähnchenbrustfilet würfeln und mit 1 EL Sojasauce, Shaoxing-Reiswein und 1 TL Speisestärke marinieren.',
    },
    rice('Jasminreis', 225),
    {
      text: 'Die Cashewkerne in einer trockenen Pfanne goldbraun rösten und herausnehmen.',
      settings: [bora('4', 3, 'Pfanne, ohne Fett')],
    },
    {
      text: 'Den Wok 2 Minuten vorheizen. Das Hähnchen im Sonnenblumenöl braten, dann Paprika, Zwiebel und Knoblauch zugeben.',
      settings: [bora('9', 2, 'Wok vorheizen'), bora('9', 5, 'Abzug Power')],
    },
    {
      text: 'Sojasauce, Austernsauce und 1 TL angerührte Speisestärke zugeben und kurz eindicken. Die Cashews unterheben und mit dem Reis servieren.',
      settings: [bora('7', 1, 'eindicken')],
    },
  ],

  'char-siu': [
    {
      text: 'Den Schweinenacken längs in 2 dicke Streifen schneiden. Hoisinsauce, Sojasauce, 1 EL Honig, Shaoxing-Reiswein, Fünf-Gewürze-Pulver und Knoblauch verrühren und das Fleisch darin mindestens 2 Stunden, besser über Nacht, marinieren.',
    },
    {
      text: 'Den Combair vorheizen. Das Fleisch auf einem Gitter über einem Blech mit etwas Wasser auf Ebene 2 schieben, rösten und zwischendurch mehrmals mit Marinade bestreichen. Den Kerntemperaturfühler in die dickste Stelle stecken.',
      settings: [combair('Heißluft', 180, 35, 'vorheizen, Ebene 2', 75)],
    },
    rice('Jasminreis', 225),
    {
      text: 'Das Fleisch mit dem restlichen Honig bestreichen und unter dem Grill 3 Minuten karamellisieren. Dabei nicht aus den Augen lassen.',
      settings: [{ device: 'combair', mode: 'Grill', minutes: 3, note: 'Stufe 3 (stark), Ebene 3' }],
    },
    {
      text: 'Den Pak Choi auf einem gelochten Garbehälter 4 Minuten im CombiSteamer dämpfen, solange das Fleisch ruht.',
      settings: [steamer('Dämpfen', 100, 4, 'gelochten Garbehälter')],
    },
    {
      text: 'Das Fleisch in Scheiben schneiden und mit dem Reis und dem Pak Choi mit Austernsauce servieren.',
    },
  ],

  'hong-shao-rou': [
    {
      text: 'Den Schweinebauch in 3 cm große Würfel schneiden, in kochendem Wasser kurz blanchieren und abtropfen lassen.',
      settings: [bora('Power', undefined, 'aufkochen'), bora('6', 3, 'blanchieren')],
    },
    rice('Jasminreis', 225),
    {
      text: 'Das Sonnenblumenöl und den Kandiszucker im Wok erhitzen, bis der Zucker karamellisiert. Das Fleisch darin rundum glasieren.',
      settings: [bora('5', 6, 'Zucker karamellisieren')],
    },
    {
      text: 'Shaoxing-Reiswein, beide Sojasaucen, Sternanis, Zimtstange, Ingwer, Frühlingszwiebeln und so viel heißes Wasser zugeben, dass das Fleisch knapp bedeckt ist. Zugedeckt 75 Minuten schmoren.',
      settings: [bora('Power', undefined, 'aufkochen'), bora('2', 75, 'Deckel drauf')],
    },
    {
      text: 'Den Deckel abnehmen und die Sauce einkochen, bis sie glänzend am Fleisch haftet. Mit dem Reis servieren.',
      settings: [bora('7', 8, 'einkochen')],
    },
  ],

  jiaozi: [
    {
      text: 'Den Chinakohl fein hacken, salzen, 10 Minuten ziehen lassen und kräftig ausdrücken.',
    },
    {
      text: 'Das Schweinehackfleisch mit Kohl, Frühlingszwiebeln, Ingwer, Sojasauce, Sesamöl, Shaoxing-Reiswein und 2 EL Wasser in eine Richtung rühren, bis die Masse bindet.',
    },
    {
      text: 'Je 1 TL Füllung auf ein Jiaozi-Teigblatt geben, den Rand befeuchten, zu einem Halbmond falten und die Ränder in Falten andrücken.',
    },
    {
      text: 'Den Wasserbehälter des CombiSteamers füllen. Die Jiaozi mit etwas Abstand auf ein gelochtes, geöltes oder mit Backpapier belegtes Blech setzen, auf Ebene 2 schieben und dämpfen.',
      settings: [steamer('Dämpfen', 100, 12, 'Ebene 2')],
    },
    {
      text: 'Chinkiang-Essig und Chiliöl zu einem Dip verrühren und die Jiaozi damit servieren.',
    },
  ],

  zhajiangmian: [
    {
      text: 'Das Schweinehackfleisch im Sonnenblumenöl braten, bis es Farbe hat. Den Knoblauch zugeben.',
      settings: [bora('7', 6, 'Pfanne vorheizen')],
    },
    {
      text: 'Gelbe Sojabohnenpaste, Hoisinsauce, Sojasauce, Zucker und 100 ml Wasser zugeben und 10 Minuten dicklich einkochen.',
      settings: [bora('4', 10, 'köcheln')],
    },
    {
      text: 'Die Weizennudeln in sprudelndem Wasser kochen. Die Sojasprossen in den letzten 30 Sekunden mitgaren und die Gurke in feine Stifte schneiden.',
      settings: [bora('Power', undefined, 'aufkochen'), bora('7', 5, 'Nudeln garen')],
    },
    {
      text: 'Die Nudeln mit Sauce, Gurke und Sprossen anrichten und am Tisch vermengen.',
    },
  ],

  'ingwer-huhn': [
    {
      text: 'Das Hähnchenschenkelfilet in Stücke schneiden und mit 1 EL Sojasauce, Shaoxing-Reiswein und Speisestärke marinieren.',
    },
    rice('Jasminreis', 225),
    {
      text: 'Den Ingwer in feine Streifen, die Frühlingszwiebeln in 4 cm lange Stücke schneiden.',
    },
    {
      text: 'Den Ingwer im heißen Sonnenblumenöl anbraten, das Hähnchen zugeben und goldbraun braten.',
      settings: [bora('8', 2, 'Pfanne vorheizen'), bora('7', 6, 'goldbraun')],
    },
    {
      text: 'Frühlingszwiebeln, restliche Sojasauce, Austernsauce, Zucker und 3 EL Wasser zugeben und kurz glasieren. Mit dem Reis servieren.',
      settings: [bora('6', 2, 'glasieren')],
    },
  ],

  'pfeffer-rind': [
    {
      text: 'Die Rinderhüfte in Streifen schneiden und mit Sojasauce, Shaoxing-Reiswein und 1 TL Speisestärke marinieren.',
    },
    rice('Jasminreis', 225),
    {
      text: 'Den Wok 2 Minuten vorheizen. Das Rind im Sonnenblumenöl sehr heiß scharf anbraten und herausnehmen. Dazu den Abzug eine Stufe höher stellen.',
      settings: [bora('9', 2, 'Wok vorheizen'), bora('Power', 1, 'Abzug Power')],
    },
    {
      text: 'Zwiebel und grüne Paprika im Wok braten, dann den grob gestoßenen schwarzen Pfeffer kurz mitrösten.',
      settings: [bora('9', 3)],
    },
    {
      text: 'Fleisch, Austernsauce, dunkle Sojasauce, Zucker und 1 TL angerührte Speisestärke zugeben und glasieren. Mit dem Reis servieren.',
      settings: [bora('7', 1, 'glasieren')],
    },
  ],

  'gedaempfter-fisch': [
    {
      text: 'Ingwer und Frühlingszwiebeln in feine Streifen schneiden.',
    },
    rice('Jasminreis', 225),
    {
      text: 'Die Doradenfilets auf einen Teller legen und mit der Hälfte des Ingwers belegen. Den Teller auf Ebene 3 zum Reis in den CombiSteamer stellen und dämpfen. Den Pak Choi daneben auf ein gelochten Garbehälter legen und mitdämpfen.',
      settings: [steamer('Dämpfen', 90, 10, 'Ebene 3, Fisch')],
    },
    {
      text: 'Die Flüssigkeit vom Teller abgießen. Sojasauce mit Zucker und 2 EL Wasser erwärmen und über den Fisch geben. Mit restlichem Ingwer und Frühlingszwiebeln belegen.',
      settings: [bora('3', 1, 'Sauce erwärmen')],
    },
    {
      text: 'Das Sonnenblumenöl in einem kleinen Topf stark erhitzen und zischend über den Fisch gießen. Mit Koriander servieren.',
      settings: [bora('Power', 2, 'Öl erhitzen')],
    },
  ],

  'gan-bian-dou': [
    {
      text: 'Die grünen Bohnen putzen und gut trocknen.',
    },
    rice('Jasminreis', 225),
    {
      text: 'Den Airfryer vorheizen. Die Bohnen mit 2 EL Sonnenblumenöl mischen, in den Korb geben und garen, bis sie schrumpelig sind und Blasen werfen. Dabei zweimal schütteln.',
      settings: [airfryer(200, 10, 'vorheizen, 2× schütteln')],
    },
    {
      text: 'Das Schweinehackfleisch mit getrockneten Chilis, Szechuanpfeffer, Knoblauch und Ingwer im restlichen Öl knusprig braten.',
      settings: [bora('8', 2, 'Pfanne vorheizen'), bora('6', 5, 'knusprig')],
    },
    {
      text: 'Die Bohnen zurückgeben und mit Sojasauce, Shaoxing-Reiswein, Zucker und Salz durchschwenken. Mit dem Reis servieren.',
      settings: [bora('8', 1)],
    },
  ],

  'pak-choi-shiitake': [
    {
      text: 'Den Tofu würfeln und im Sonnenblumenöl goldbraun braten. Dann herausnehmen.',
      settings: [bora('8', 2, 'Pfanne vorheizen'), bora('6', 6, 'goldbraun')],
    },
    rice('Jasminreis', 225),
    {
      text: 'Die Shiitake in Scheiben schneiden und mit dem Knoblauch braten.',
      settings: [bora('7', 4)],
    },
    {
      text: 'Den Pak Choi halbiert zugeben und 2 Minuten braten.',
      settings: [bora('8', 2)],
    },
    {
      text: 'Tofu, Austernsauce, Sojasauce und angerührte Speisestärke zugeben, kurz eindicken und mit Sesamöl beträufeln. Mit dem Reis servieren.',
      settings: [bora('5', 1, 'eindicken')],
    },
  ],

  'zitronen-huhn': [
    {
      text: 'Das Hähnchenbrustfilet in Streifen schneiden, salzen, durch das Ei ziehen und in 4 EL Speisestärke wenden.',
    },
    rice('Jasminreis', 225),
    {
      text: 'Den Airfryer vorheizen. Die Hähnchenstreifen nebeneinander in den Korb legen, mit etwas Frittieröl einsprühen und goldbraun und knusprig garen. Einmal wenden.',
      settings: [airfryer(190, 12, 'vorheizen, 1× wenden')],
    },
    {
      text: 'Den Saft der Zitronen mit Zucker, Sojasauce, 50 ml Wasser und 1 EL Speisestärke aufkochen, bis die Sauce glasig eindickt.',
      settings: [bora('7', 3, 'aufkochen')],
    },
    {
      text: 'Das Hähnchen mit der Sauce übergießen und mit Zitronenscheiben, Frühlingszwiebeln und dem Reis servieren.',
    },
  ],

  'cola-wings': [
    {
      text: 'Die Hähnchenflügel am Gelenk teilen und mit dem Sonnenblumenöl mischen.',
    },
    rice('Jasminreis', 225),
    {
      text: 'Den Airfryer vorheizen. Die Flügel in zwei Portionen im Korb goldbraun garen, dabei zweimal schütteln.',
      settings: [airfryer(200, 16, 'vorheizen, je Portion')],
    },
    {
      text: 'Ingwer, Sternanis, Cola und beide Sojasaucen in einer großen Pfanne aufkochen und 10 Minuten offen köcheln lassen.',
      settings: [bora('Power', undefined, 'aufkochen'), bora('4', 10, 'köcheln')],
    },
    {
      text: 'Die Flügel zugeben und bei hoher Hitze einkochen, bis die Sauce klebrig glänzt. Mit Frühlingszwiebeln und dem Reis servieren.',
      settings: [bora('8', 5, 'einkochen')],
    },
  ],

  'lu-rou-fan': [
    {
      text: 'Den Schweinebauch in kleine Würfel schneiden. Die Schalotten in Ringe schneiden und im Sonnenblumenöl knusprig braten.',
      settings: [bora('6', 6, 'Schalotten knusprig')],
    },
    {
      text: 'Das Fleisch zugeben und anbraten, bis das Fett austritt.',
      settings: [bora('7', 6)],
    },
    {
      text: 'Beide Sojasaucen, Shaoxing-Reiswein, Kandiszucker, Fünf-Gewürze-Pulver und 400 ml Wasser zugeben, aufkochen und zugedeckt 60 Minuten schmoren.',
      settings: [bora('Power', undefined, 'aufkochen'), bora('2', 60, 'Deckel drauf')],
    },
    {
      text: 'Etwa 25 Minuten vor Ende der Schmorzeit den Wasserbehälter des CombiSteamers füllen. Den Jasminreis mit 225 ml Wasser in eine flache Schale geben, auf den gelochten Garbehälter stellen und mit den Eiern auf Ebene 3 dämpfen. Die Eier nach 11 Minuten abschrecken und pellen, den Reis ausdämpfen lassen.',
      settings: [steamer('Dämpfen', 100, 22, 'Reis + Eier')],
    },
    {
      text: 'Die gepellten Eier in den letzten 15 Minuten zum Fleisch geben. Den Pak Choi kurz blanchieren.',
      settings: [bora('6', 2, 'Pak Choi blanchieren')],
    },
    {
      text: 'Das Fleisch über den Reis geben und mit halbierten Schmor-Eiern und dem Pak Choi servieren.',
    },
  ],

  'suan-la-tang': [
    {
      text: 'Die Mu-Err-Pilze in warmem Wasser einweichen und in Streifen schneiden. Schweineschnitzel, Tofu und Bambussprossen in feine Streifen schneiden.',
    },
    {
      text: 'Die Hühnerbrühe aufkochen. Fleisch, Pilze und Bambus 5 Minuten garen, dann den Tofu zugeben.',
      settings: [bora('Power', undefined, 'aufkochen'), bora('4', 5, 'köcheln')],
    },
    {
      text: 'Mit Sojasauce, Chinkiang-Essig und weißem Pfeffer kräftig abschmecken und mit angerührter Speisestärke binden.',
      settings: [bora('4', 1, 'binden')],
    },
    {
      text: 'Das verquirlte Ei in dünnem Strahl einrühren, so dass Flocken entstehen. Mit Chiliöl und Frühlingszwiebeln servieren.',
      settings: [bora('Warmhalten', undefined, 'Ei einrühren')],
    },
  ],

  'wan-tan-suppe': [
    {
      text: 'Das Schweinehackfleisch mit gehackten Garnelen, Frühlingszwiebeln, Ingwer, 1 EL Sojasauce und Sesamöl verrühren.',
    },
    {
      text: 'Je 1 TL Füllung auf ein Wan-Tan-Teigblatt setzen, den Rand befeuchten und zu kleinen Säckchen zusammendrücken.',
    },
    {
      text: 'Den Wasserbehälter des CombiSteamers füllen. Die Wan Tans mit Abstand auf ein gelochtes, geöltes Blech setzen, auf Ebene 2 schieben und dämpfen.',
      settings: [steamer('Dämpfen', 100, 8, 'Ebene 2')],
    },
    {
      text: 'Die Hühnerbrühe mit restlicher Sojasauce und weißem Pfeffer aufkochen. Den Pak Choi darin 2 Minuten garen.',
      settings: [bora('Power', undefined, 'aufkochen'), bora('4', 2, 'Pak Choi')],
    },
    {
      text: 'Die gedämpften Wan Tans in die Brühe geben und servieren.',
    },
  ],

  'mais-suppe': [
    {
      text: 'Das Hähnchenbrustfilet fein hacken.',
    },
    {
      text: 'Die Hühnerbrühe mit Ingwer aufkochen. Hähnchen, Rahmmais und Mais zugeben und 5 Minuten köcheln lassen.',
      settings: [bora('Power', undefined, 'aufkochen'), bora('4', 5, 'köcheln')],
    },
    {
      text: 'Mit angerührter Speisestärke binden und mit Salz und weißem Pfeffer würzen.',
      settings: [bora('4', 1, 'binden')],
    },
    {
      text: 'Die verquirlten Eier einlaufen lassen und mit Sesamöl und Frühlingszwiebeln servieren.',
      settings: [bora('Warmhalten', undefined, 'Ei einlaufen lassen')],
    },
  ],

  'niu-rou-mian': [
    {
      text: 'Die Rinderbeinscheibe in große Würfel schneiden, kurz in kochendem Wasser blanchieren und abspülen.',
      settings: [bora('Power', undefined, 'aufkochen'), bora('6', 3, 'blanchieren')],
    },
    {
      text: 'Doubanjiang, Ingwer und Knoblauch im Sonnenblumenöl rösten. Fleisch, Sternanis, Zimtstange, Sojasauce, dunkle Sojasauce, Shaoxing-Reiswein, Tomate und 1,5 l Wasser zugeben.',
      settings: [bora('6', 3, 'rösten'), bora('Power', undefined, 'aufkochen')],
    },
    {
      text: 'Zugedeckt schmoren, bis das Fleisch zart ist. Zwischendurch eine Garprobe machen.',
      settings: [bora('2', 120, 'Deckel drauf')],
    },
    {
      text: 'Die Weizennudeln und den Pak Choi in sprudelndem Wasser getrennt garen.',
      settings: [bora('Power', undefined, 'aufkochen'), bora('7', 4, 'Nudeln')],
    },
    {
      text: 'Nudeln und Pak Choi in Schüsseln geben, mit Brühe und Fleisch übergießen und mit Frühlingszwiebeln bestreuen.',
    },
  ],

  'pad-thai': [
    {
      text: 'Die Reisbandnudeln 20 Minuten in lauwarmem Wasser einweichen. Tamarindenpaste, Fischsauce und Palmzucker verrühren.',
    },
    {
      text: 'Den Wok 2 Minuten vorheizen. Tofuwürfel und Knoblauch im heißen Sonnenblumenöl braten, dann die Garnelen zugeben.',
      settings: [bora('9', 2, 'Wok vorheizen'), bora('9', 4, 'Abzug Power')],
    },
    {
      text: 'Nudeln und Sauce zugeben und braten, bis die Nudeln weich sind. Zur Seite schieben, die Eier in den Wok schlagen, stocken lassen und unterheben.',
      settings: [bora('8', 5)],
    },
    {
      text: 'Sojasprossen und Frühlingszwiebeln untermischen. Mit gerösteten Erdnüssen, Limette und Chiliflocken servieren.',
      settings: [bora('8', 1)],
    },
  ],

  'gruenes-curry': [
    rice('Jasminreis', 225),
    {
      text: 'Den dicken Teil der Kokosmilch mit der grünen Currypaste im Wok einkochen, bis sich das Öl trennt.',
      settings: [bora('6', 5, 'einkochen')],
    },
    {
      text: 'Das Hähnchenbrustfilet in Streifen zugeben und rundum anbraten.',
      settings: [bora('7', 4)],
    },
    {
      text: 'Restliche Kokosmilch, die Aubergine in Würfeln und die Kaffirlimettenblätter zugeben und 10 Minuten köcheln lassen. Die Zuckerschoten die letzten 2 Minuten mitgaren.',
      settings: [bora('4', 10, 'köcheln')],
    },
    {
      text: 'Mit Fischsauce und Palmzucker abschmecken, das Thai-Basilikum unterziehen und mit dem Reis servieren.',
      settings: [bora('Warmhalten', undefined, 'Basilikum unterziehen')],
    },
  ],

  'rotes-curry': [
    rice('Jasminreis', 225),
    {
      text: 'Die rote Currypaste mit etwas Kokosmilch im Wok anrösten, bis sie duftet.',
      settings: [bora('6', 2, 'anrösten')],
    },
    {
      text: 'Restliche Kokosmilch, Kaffirlimettenblätter, Paprika, Bambussprossen und Ananas zugeben und 8 Minuten köcheln lassen.',
      settings: [bora('Power', undefined, 'aufkochen'), bora('4', 8, 'köcheln')],
    },
    {
      text: 'Die Garnelen zugeben und 3 Minuten gar ziehen lassen.',
      settings: [bora('Simmern', 3, 'gar ziehen')],
    },
    {
      text: 'Mit Fischsauce und Palmzucker abschmecken, das Thai-Basilikum zugeben und mit dem Reis servieren.',
    },
  ],

  'tom-kha-gai': [
    {
      text: 'Das Zitronengras andrücken und in Stücke schneiden, den Galgant in Scheiben schneiden. Mit den Kaffirlimettenblättern in Hühnerbrühe und Kokosmilch aufkochen.',
      settings: [bora('Power', undefined, 'aufkochen')],
    },
    {
      text: 'Das Hähnchenbrustfilet in dünnen Scheiben und die Champignons zugeben und 10 Minuten sanft köcheln lassen.',
      settings: [bora('Simmern', 10, 'sanft köcheln')],
    },
    {
      text: 'Vom Herd nehmen und mit Fischsauce, Limettensaft, Palmzucker und zerdrückten roten Chilis abschmecken.',
    },
    {
      text: 'Mit Koriander servieren. Zitronengras und Galgant werden nicht mitgegessen.',
    },
  ],

  'pad-kra-pao': [
    rice('Jasminreis', 225),
    {
      text: 'Das Hähnchenschenkelfilet grob hacken. Knoblauch und rote Chilis im Mörser zerstoßen.',
    },
    {
      text: 'Die Spiegeleier in reichlich heißem Sonnenblumenöl mit knusprigem Rand braten und herausnehmen.',
      settings: [bora('8', 1, 'Wok vorheizen'), bora('7', 3, 'Spiegelei')],
    },
    {
      text: 'Knoblauch und Chili kurz anbraten, das Hähnchen zugeben und scharf braten. Dazu den Abzug eine Stufe höher stellen.',
      settings: [bora('9', 4, 'Abzug Power')],
    },
    {
      text: 'Austernsauce, Sojasauce, Fischsauce und Zucker zugeben, das Thai-Basilikum unterheben und mit dem Reis und dem Spiegelei servieren.',
      settings: [bora('7', 1)],
    },
  ],

  massaman: [
    rice('Jasminreis', 225),
    {
      text: 'Die Massaman-Currypaste mit dem dicken Teil der Kokosmilch im Topf anrösten. Das Rindergulasch zugeben und anbraten.',
      settings: [bora('6', 3, 'anrösten'), bora('7', 5, 'Fleisch anbraten')],
    },
    {
      text: 'Restliche Kokosmilch, 200 ml Wasser und die Zimtstange zugeben, aufkochen und zugedeckt 75 Minuten schmoren.',
      settings: [bora('Power', undefined, 'aufkochen'), bora('2', 75, 'Deckel drauf')],
    },
    {
      text: 'Kartoffeln und Zwiebel in Stücken und die Erdnüsse zugeben und weitere 25 Minuten garen.',
      settings: [bora('3', 25, 'Deckel drauf')],
    },
    {
      text: 'Mit Fischsauce, Palmzucker und Tamarindenpaste süß-sauer-salzig abschmecken und mit dem Reis servieren.',
    },
  ],

  'teriyaki-huhn': [
    {
      text: 'Sojasauce, Mirin, Sake und Zucker verrühren.',
    },
    rice('Sushireis', 180),
    {
      text: 'Den Brokkoli in Röschen teilen, auf ein gelochten Garbehälter legen und auf Ebene 3 zum Reis in den CombiSteamer schieben.',
      settings: [steamer('Dämpfen', 100, 8, 'Ebene 3, gelocht')],
    },
    {
      text: 'Das Hähnchenschenkelfilet mit der Hautseite nach unten im Sonnenblumenöl knusprig braten, wenden und fertig garen.',
      settings: [bora('8', 2, 'Pfanne vorheizen'), bora('5', 10, 'Haut knusprig')],
    },
    {
      text: 'Überschüssiges Fett abgießen, die Sauce zugeben und einkochen, bis das Fleisch glänzend glasiert ist.',
      settings: [bora('6', 3, 'einkochen')],
    },
    {
      text: 'Das Fleisch in Scheiben schneiden, mit Sesam bestreuen und mit dem Reis und dem gedämpften Brokkoli servieren.',
    },
  ],

  'shoyu-ramen': [
    {
      text: 'Den Schweinebauch mit 3 EL Sojasauce, Mirin, Ingwer und 300 ml Wasser aufkochen und zugedeckt 60 Minuten schmoren. Dann in Scheiben schneiden und den Schmorsud aufbewahren.',
      settings: [bora('Power', undefined, 'aufkochen'), bora('2', 60, 'Deckel drauf')],
    },
    {
      text: 'Die Eier im CombiSteamer dämpfen, abschrecken, pellen und 30 Minuten in etwas Schmorsud marinieren.',
      settings: [steamer('Dämpfen', 100, 7, 'wachsweich')],
    },
    {
      text: 'Die Hühnerbrühe mit Knoblauch, 2 EL Sojasauce und einem Schuss Schmorsud aufkochen.',
      settings: [bora('Power', undefined, 'aufkochen'), bora('3', 5, 'köcheln')],
    },
    {
      text: 'Die Ramen-Nudeln in sprudelndem Wasser kochen und in Schüsseln geben.',
      settings: [bora('Power', undefined, 'aufkochen'), bora('7', 4, 'Nudeln')],
    },
    {
      text: 'Die Nudeln mit der Brühe übergießen. Mit Schweinebauch, halbierten Eiern, Sojasprossen, Frühlingszwiebeln, Nori und Sesamöl belegen.',
    },
  ],

  yakisoba: [
    {
      text: 'Den Schweinebauch in Stücke schneiden und im Sonnenblumenöl knusprig braten.',
      settings: [bora('8', 2, 'Pfanne vorheizen'), bora('7', 5, 'knusprig')],
    },
    {
      text: 'Zwiebel, Möhrenstreifen und Weißkohl zugeben und 3 Minuten braten.',
      settings: [bora('8', 3)],
    },
    {
      text: 'Die Yakisoba-Nudeln mit einem Schuss Wasser zugeben und lockern.',
      settings: [bora('7', 2)],
    },
    {
      text: 'Yakisoba-Sauce untermischen und mit Frühlingszwiebeln und Sesam servieren.',
      settings: [bora('7', 1)],
    },
  ],

  bibimbap: [
    {
      text: 'Die Rinderhüfte in dünne Streifen schneiden und mit 2 EL Sojasauce, Zucker, Knoblauch und Sesamöl marinieren.',
    },
    rice('Sushireis', 180),
    {
      text: 'Spinat und Sojasprossen auf ein gelochten Garbehälter legen, auf Ebene 3 zum Reis schieben und kurz dämpfen. Mit Sesamöl und Salz würzen.',
      settings: [steamer('Dämpfen', 100, 3, 'Ebene 3, gelocht')],
    },
    {
      text: 'Möhre, Zucchini und Shiitake in Streifen im Sonnenblumenöl getrennt kurz anbraten.',
      settings: [bora('7', 6, 'Pfanne')],
    },
    {
      text: 'Das Fleisch in der sehr heißen Pfanne scharf anbraten. Dazu den Abzug eine Stufe höher stellen. Dann die Spiegeleier braten.',
      settings: [bora('9', 3, 'Abzug Power'), bora('5', 3, 'Spiegeleier')],
    },
    {
      text: 'Den Reis in Schüsseln geben, Gemüse und Fleisch darauf anrichten und das Ei obenauf legen. Mit Gochujang und Sesam servieren und am Tisch alles vermengen.',
    },
  ],

  bulgogi: [
    {
      text: 'Die Rinderhüfte hauchdünn schneiden. Leicht angefroren geht es am besten.',
    },
    {
      text: 'Birne, Knoblauch und Ingwer reiben und mit Sojasauce, Zucker und Sesamöl mischen. Fleisch und Zwiebelstreifen darin mindestens 30 Minuten marinieren.',
    },
    rice('Sushireis', 180),
    {
      text: 'Das Fleisch portionsweise in der sehr heißen Pfanne mit etwas Sonnenblumenöl scharf braten. Dazu den Abzug eine Stufe höher stellen. Die Frühlingszwiebeln zugeben.',
      settings: [bora('9', 2, 'Pfanne vorheizen'), bora('9', 6, 'Abzug Power')],
    },
    {
      text: 'Mit Sesam bestreuen und mit dem Reis und den Kopfsalatblättern zum Einwickeln servieren.',
    },
  ],

  'pho-bo': [
    {
      text: 'Zwiebel und Ingwer halbieren und in einer Pfanne ohne Fett schwarz rösten. Die Gewürze (Sternanis, Zimtstange, Nelken) kurz mitrösten.',
      settings: [bora('8', 8, 'Pfanne, ohne Fett')],
    },
    {
      text: 'Suppenfleisch und Markknochen in kochendem Wasser blanchieren und abspülen.',
      settings: [bora('Power', undefined, 'aufkochen'), bora('6', 5, 'blanchieren')],
    },
    {
      text: 'Fleisch und Knochen mit 2,5 l Wasser, Zwiebel, Ingwer und Gewürzen aufkochen und leise köcheln lassen. Dann abseihen und mit Fischsauce und Zucker abschmecken.',
      settings: [bora('Power', undefined, 'aufkochen'), bora('Simmern', 150, 'leise köcheln')],
    },
    {
      text: 'Die Reisbandnudeln einweichen und kurz kochen. Die rohe Rinderhüfte hauchdünn schneiden.',
      settings: [bora('7', 3, 'Nudeln')],
    },
    {
      text: 'Nudeln, gekochtes und rohes Fleisch in Schüsseln geben und mit kochender Brühe übergießen. Mit Sojasprossen, Thai-Basilikum, Koriander, Limette und Chili servieren.',
      settings: [bora('Power', undefined, 'Brühe aufkochen')],
    },
  ],

  'nasi-goreng': [
    rice('Jasminreis', 225),
    {
      text: 'Den gedämpften Reis kalt werden lassen. Am besten schon am Vortag zubereiten und kalt stellen.',
    },
    {
      text: 'Schalotten, Knoblauch, rote Chili und Garnelenpaste zu einer Paste zerstoßen.',
    },
    {
      text: 'Die Hähnchenwürfel im Sonnenblumenöl braten, die Paste zugeben und anrösten.',
      settings: [bora('9', 2, 'Wok vorheizen'), bora('8', 5)],
    },
    {
      text: 'Den Reis zugeben und mit Kecap Manis und Sojasauce bei hoher Hitze braten. Dazu den Abzug eine Stufe höher stellen.',
      settings: [bora('9', 4, 'Abzug Power')],
    },
    {
      text: 'Die Spiegeleier braten und den Reis mit Spiegelei, Gurken- und Tomatenscheiben und Röstzwiebeln servieren.',
      settings: [bora('5', 3, 'Spiegeleier')],
    },
  ],

  'bami-goreng': [
    {
      text: 'Die Mie-Nudeln in sprudelndem Wasser garen und abschrecken.',
      settings: [bora('Power', undefined, 'aufkochen'), bora('7', 4, 'Nudeln')],
    },
    {
      text: 'Das Schweinefilet in Streifen im Sonnenblumenöl braten, dann Knoblauch und rote Chili zugeben.',
      settings: [bora('9', 2, 'Wok vorheizen'), bora('9', 4, 'Abzug Power')],
    },
    {
      text: 'Weißkohl, Möhre und Lauch in Streifen zugeben und bissfest braten. Die Eier unterrühren und stocken lassen.',
      settings: [bora('8', 4)],
    },
    {
      text: 'Nudeln, Kecap Manis und Sojasauce untermischen und mit Röstzwiebeln servieren.',
      settings: [bora('8', 2)],
    },
  ],

  'katsu-curry': [
    rice('Sushireis', 180),
    {
      text: 'Zwiebel, Möhre und Kartoffel würfeln, im Topf anbraten, mit 500 ml Wasser aufgießen und 15 Minuten köcheln lassen.',
      settings: [bora('5', 4, 'anbraten'), bora('Power', undefined, 'aufkochen'), bora('4', 15, 'köcheln')],
    },
    {
      text: 'Vom Herd nehmen, die Curry-Würfel darin auflösen und unter Rühren noch 5 Minuten köcheln lassen, bis die Sauce dick ist.',
      settings: [bora('3', 5, 'Sauce eindicken')],
    },
    {
      text: 'Die Schweineschnitzel salzen, im Mehl wenden und durch Ei und Panko ziehen.',
    },
    {
      text: 'Den Airfryer vorheizen. Die Schnitzel in den Korb legen, mit etwas Frittieröl einsprühen und goldbraun garen. Einmal wenden.',
      settings: [airfryer(180, 12, 'vorheizen, 1× wenden')],
    },
    {
      text: 'Die Schnitzel in Streifen schneiden und mit Curry und Reis anrichten.',
    },
  ],

  'knusprige-ente-suess-sauer': [
    {
      text: 'Die Entenkeulen mit Salz, Fünf-Gewürze-Pulver, Shaoxing-Reiswein, 2 EL Sojasauce und Ingwerscheiben einreiben und 30 Minuten marinieren.',
    },
    {
      text: 'Den Combair vorheizen. Die Keulen in einer Form auf Ebene 2 schieben und weich garen, bis das Fleisch sehr zart ist. Den Kerntemperaturfühler in die dickste Stelle der Keule stecken.',
      settings: [combair('Heißluft feucht', 150, 75, 'vorheizen, Ebene 2', 88)],
    },
    {
      text: 'Den Wasserbehälter des CombiSteamers füllen. Den Jasminreis mit 300 ml Wasser und etwas Salz in eine flache Schale geben, auf den gelochten Garbehälter auf Ebene 2 stellen und dämpfen.',
      settings: [steamer('Dämpfen', 100, 22, 'Ebene 2')],
    },
    {
      text: 'Die Keulen abkühlen lassen, trocken tupfen und mit Speisestärke bestäuben.',
    },
    {
      text: 'Den Airfryer vorheizen. Die Keulen mit etwas Frittieröl einsprühen, in den Korb legen und knusprig garen. Dann in Stücke schneiden.',
      settings: [airfryer(190, 10, 'vorheizen, 1× wenden')],
    },
    {
      text: 'Paprika, Ananas und Zwiebel in Stücke schneiden. Ketchup, Reisessig, Zucker, 1 TL Sojasauce und 100 ml Wasser verrühren.',
    },
    {
      text: 'Das Gemüse im Wok in wenig Öl 2 Minuten anbraten, die Soße zugeben und aufkochen. Mit etwas angerührter Speisestärke leicht binden.',
      settings: [bora('9', 2, 'Wok vorheizen'), bora('9', 2), bora('6', 2, 'aufkochen')],
    },
    {
      text: 'Die Entenstücke auf dem Reis anrichten und die Soße darübergeben.',
    },
  ],
  // ───────────── Leicht & sättigend ─────────────
  'haehnchen-brokkoli-kanton': [
    { text: 'Das Hähnchen in dünne Scheiben schneiden und mit Reiswein, 1 EL Sojasauce und der Hälfte der Speisestärke marinieren.' },
    rice('Jasminreis', 180),
    { text: 'Den Brokkoli in Röschen teilen, auf den gelochten Garbehälter legen und zum Reis in den CombiSteamer geben. Knoblauch und Ingwer fein hacken.', settings: [steamer('Dämpfen', 100, 6, 'Ebene 3, Brokkoli')] },
    { text: 'Das Sonnenblumenöl im Wok stark erhitzen, das Hähnchen 3 Minuten anbraten, Knoblauch und Ingwer kurz mitbraten.', settings: [bora('9', 2, 'Wok vorheizen'), bora('9', 3, 'Abzug höher')] },
    { text: 'Den Brokkoli zugeben. Hühnerbrühe, restliche Sojasauce, Austernsauce und restliche Speisestärke verrühren, in den Wok gießen und 2 Minuten eindicken lassen. Mit Sesamöl abschmecken und mit dem Reis servieren.', settings: [bora('6', 2, 'eindicken')] },
  ],
  'rind-gemuese-wok': [
    { text: 'Das Rindfleisch quer zur Faser in dünne Scheiben schneiden und mit Sojasauce, Reiswein, Speisestärke und Pfeffer marinieren.' },
    rice('Jasminreis', 180),
    { text: 'Paprika in Streifen, Möhre in dünne Scheiben schneiden, Zuckerschoten putzen, Knoblauch und Ingwer hacken.' },
    { text: 'Das Sonnenblumenöl im Wok stark erhitzen und das Rindfleisch in zwei Portionen je 1 Minute anbraten, dann herausnehmen. Beim scharfen Anbraten den Abzug eine Stufe höher stellen.', settings: [bora('9', 2, 'Wok vorheizen, Abzug höher'), bora('9', 2, 'zwei Portionen')] },
    { text: 'Möhre, Paprika und Zuckerschoten mit Knoblauch und Ingwer 3 Minuten unter Rühren braten. Fleisch und Austernsauce zugeben, 1 Minute schwenken und mit Sesamöl abschmecken. Mit dem Reis servieren.', settings: [bora('9', 3), bora('8', 1, 'schwenken')] },
  ],
  'seelachs-shiitake-pakchoi': [
    { text: 'Ingwer und Frühlingszwiebeln in feine Streifen schneiden. Shiitake in Scheiben, Pak Choi in Viertel schneiden.' },
    rice('Jasminreis', 180),
    { text: 'Den Seelachs auf einen tiefen Teller legen, mit den Shiitake und der Hälfte des Ingwers belegen und mit dem Reiswein beträufeln. Den Teller auf Ebene 3 zum Reis in den CombiSteamer stellen und dämpfen. Den Pak Choi daneben auf den gelochten Garbehälter legen und die letzten 5 Minuten mitdämpfen.', settings: [steamer('Dämpfen', 90, 10, 'Ebene 3, Fisch'), steamer('Dämpfen', 90, 5, 'Pak Choi dazu')] },
    { text: 'Sojasauce, Sesamöl und Zucker verrühren, über den Fisch geben und mit Frühlingszwiebeln, restlichem Ingwer und Koriander servieren. Dazu den Reis.' },
  ],
  'haehnchen-chop-suey': [
    { text: 'Das Hähnchen in dünne Streifen schneiden und mit 1 EL Sojasauce und der Hälfte der Speisestärke marinieren.' },
    { text: 'Die Mie-Nudeln nach Packungsanweisung garen und abgießen.', settings: [bora('Power', undefined, 'aufkochen'), bora('7', 4, 'Nudeln')] },
    { text: 'Chinakohl in Streifen, Möhre in Stifte, Champignons in Scheiben schneiden. Frühlingszwiebeln in Ringe, Knoblauch fein hacken.' },
    { text: 'Das Sonnenblumenöl im Wok stark erhitzen, das Hähnchen 3 Minuten anbraten und herausnehmen. Möhre, Champignons und Knoblauch 3 Minuten braten, Chinakohl und Sojasprossen 2 Minuten mitbraten.', settings: [bora('9', 2, 'Wok vorheizen'), bora('9', 3, 'Hähnchen'), bora('9', 5, 'Gemüse')] },
    { text: 'Hühnerbrühe, restliche Sojasauce, Austernsauce und restliche Speisestärke verrühren, zugeben und kurz binden. Hähnchen und Nudeln unterheben und mit Frühlingszwiebeln servieren.', settings: [bora('6', 2, 'binden')] },
  ],
  'pute-paprika-cashew': [
    { text: 'Die Putenbrust in Würfel schneiden und mit 1 EL Sojasauce und der Speisestärke marinieren.' },
    rice('Jasminreis', 180),
    { text: 'Paprika, Zucchini und Zwiebel in Stücke schneiden, Knoblauch hacken. Die Cashewkerne in einer trockenen Pfanne rösten.', settings: [bora('4', 3, 'Cashewkerne ohne Fett')] },
    { text: 'Das Sonnenblumenöl im Wok stark erhitzen, die Pute 3 Minuten anbraten und herausnehmen. Das Gemüse mit dem Knoblauch 4 Minuten braten.', settings: [bora('9', 2, 'Wok vorheizen'), bora('9', 3, 'Pute'), bora('9', 4, 'Gemüse')] },
    { text: 'Die Pute, restliche Sojasauce, Hoisinsauce und 3 EL Wasser zugeben, 1 Minute schwenken, die Cashewkerne unterheben und mit dem Reis servieren.', settings: [bora('8', 1, 'schwenken')] },
  ],
}
