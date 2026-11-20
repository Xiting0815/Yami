import type { DeviceStep } from '../../types'

/** Geräte-Schritte (Rezept-ID → Schritte), Gruppe: Deutsch. Stil siehe docs/geraete/regeln.md */
export const DEVICE_STEPS: Record<string, DeviceStep[]> = {
  // Beispiel 1: Braten mit Kruste – komplett im CombiSteamer (erst mit Beschwaden saftig, dann trocken für die Kruste), Beilage parallel auf dem BORA
  schweinebraten: [
    {
      text: 'Die Schwarte rautenförmig einschneiden, ohne das Fleisch zu verletzen. Das Fleisch kräftig mit Salz, Pfeffer, Kümmel, Majoran und Knoblauch einreiben.',
    },
    {
      text: 'Den CombiSteamer vorheizen. Den Braten mit der Schwarte nach unten in einen Bräter mit 2 cm Wasser legen, auf Ebene 2 schieben und 30 Minuten garen.',
      settings: [{ device: 'steamer', mode: 'Heißluft mit Beschwaden', temp: 170, minutes: 30, note: 'vorheizen, Ebene 2' }],
    },
    {
      text: 'Den Braten umdrehen, grob geschnittene Zwiebeln und Möhre zugeben und den Kerntemperaturfühler in die dickste Stelle stecken. Weitere 90 Minuten garen und dabei alle 20 bis 30 Minuten mit etwas Dunkelbier übergießen.',
      settings: [{ device: 'steamer', mode: 'Heißluft mit Beschwaden', temp: 170, minutes: 90, core: 78, note: 'Fühler nicht am Knochen' }],
    },
    {
      text: 'Für die Kruste auf trockene Hitze umstellen und weitergaren, bis die Schwarte überall kleine Blasen wirft (aufpoppt) und knusprig ist.',
      settings: [{ device: 'steamer', mode: 'Heißluft', temp: 220, minutes: 15, note: 'ohne Dampf' }],
    },
    {
      text: 'Während der Braten gart, für die Semmelknödel die Brötchen in etwa 1 cm große Würfel schneiden, mit warmer Milch übergießen und 15 Minuten ziehen lassen. Eier, gehackte Petersilie und Salz zugeben, mit den Händen gut verkneten und mit nassen Händen 6 feste Knödel formen.',
    },
    {
      text: 'Reichlich Salzwasser mit Deckel aufkochen, die Knödel einlegen, die Hitze reduzieren und 20 Minuten sanft ziehen lassen. Das Wasser soll sich nur leicht bewegen, nicht sprudeln, sonst zerfallen die Knödel.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: 'Power', note: 'aufkochen' },
        { device: 'bora', mode: 'Kochzone', level: '3', minutes: 20, note: 'ziehen lassen' },
      ],
    },
    {
      text: 'Den Bratensatz durch ein Sieb streichen, abschmecken und zum Braten mit den Knödeln servieren.',
    },
  ],

  // Beispiel 2: Suppe – alles auf dem BORA, Stufen aus der Phrase-Tabelle
  kartoffelsuppe: [
    {
      text: 'Zwiebel, Möhre und Sellerie würfeln, den Lauch in Ringe schneiden und alles in etwas Fett im Topf andünsten.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '4', minutes: 5 }],
    },
    {
      text: 'Kartoffeln würfeln, zugeben, mit Brühe aufgießen, mit Deckel aufkochen und 20 Minuten weich kochen.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: 'Power', note: 'aufkochen' },
        { device: 'bora', mode: 'Kochzone', level: '5', minutes: 20 },
      ],
    },
    {
      text: 'Grob pürieren, so dass noch Stücke bleiben. Sahne einrühren und mit Majoran, Muskat, Salz und Pfeffer abschmecken.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: 'Warmhalten', note: 'Suppe warm halten' }],
    },
    {
      text: 'Speck in der Pfanne knusprig braten und mit Petersilie über die Suppe streuen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '6', minutes: 6, note: 'Pfanne, ohne Öl' }],
    },
  ],

  rinderrouladen: [
    {
      text: 'Die Rinderrouladen flach klopfen, salzen, pfeffern und mit Senf bestreichen. Mit je 2 Scheiben Bacon, einer längs geviertelten Gewürzgurke und einer halben Zwiebel in Streifen belegen, aufrollen und mit Rouladennadeln oder Küchengarn fixieren.',
    },
    {
      text: 'Butterschmalz im Bräter erhitzen und die Rouladen rundum kräftig anbraten. Dabei den Abzug eine Stufe höher stellen. Rouladen herausnehmen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '8', minutes: 8, note: 'Brücke' }],
    },
    {
      text: 'Restliche Zwiebel, Möhre und Sellerie würfeln und im Bratfett anrösten. Tomatenmark kurz mitrösten, mit Rotwein ablöschen (angießen und den Bratensatz mit einem Holzlöffel vom Boden lösen) und fast ganz einkochen lassen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '5', minutes: 8 }],
    },
    {
      text: 'Fond angießen und die Rouladen zurück in den Bräter legen. Den Bräter zugedeckt in den vorgeheizten Combair schieben und 90 Minuten schmoren.',
      settings: [{ device: 'combair', mode: 'Heißluft feucht', temp: 150, minutes: 90, note: 'vorheizen, Deckel drauf' }],
    },
    {
      text: 'Während die Rouladen schmoren, den Rotkohl fein hobeln und mit gewürfeltem Apfel, Essig, Zucker, Lorbeer, Nelken und 100 ml Wasser mit Deckel 45 Minuten weich schmoren, ab und zu umrühren und mit Salz abschmecken.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: '8', minutes: 3, note: 'ankochen' },
        { device: 'bora', mode: 'Kochzone', level: '3', minutes: 45, note: 'Deckel drauf' },
      ],
    },
    {
      text: 'Gleichzeitig für die Klöße den Wasserbehälter des CombiSteamers füllen und die Kartoffeln mit Schale auf dem gelochten Garbehälter dämpfen. Noch heiß pellen, durch die Kartoffelpresse drücken und ausdampfen und abkühlen lassen.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 35, note: 'gelocht' }],
    },
    {
      text: 'Die Kartoffelmasse mit 30 g Stärke, Salz und etwas Muskat zu einem glatten Teig verkneten und mit nassen Händen 4 Klöße formen. Reichlich Salzwasser aufkochen, die Klöße einlegen und bei kleiner Hitze 20 Minuten ziehen lassen, bis sie oben schwimmen. Das Wasser darf nicht sprudeln, sonst zerfallen sie.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: 'Power', note: 'aufkochen' },
        { device: 'bora', mode: 'Kochzone', level: 'Simmern', minutes: 20, note: 'ziehen lassen' },
      ],
    },
    {
      text: 'Die Rouladen aus dem Bräter nehmen und das Garn bzw. die Nadeln entfernen. Die Sauce durch ein Sieb passieren, abschmecken und nach Wunsch mit den restlichen 10 g Stärke, in etwas kaltem Wasser angerührt, binden. Rouladen mit Sauce, Rotkohl und Klößen servieren.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '4', minutes: 3 }],
    },
  ],

  sauerbraten: [
    {
      text: 'Zwiebeln, Möhre und Sellerie grob schneiden. Mit Rotwein, Essig, 250 ml Wasser, Lorbeerblättern, Wacholderbeeren, Nelken und Pfefferkörnern mit Deckel aufkochen und vollständig abkühlen lassen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: 'Power', note: 'aufkochen' }],
    },
    {
      text: 'Das Fleisch in der kalten Marinade zugedeckt im Kühlschrank 3 bis 5 Tage marinieren und täglich wenden.',
    },
    {
      text: 'Fleisch herausnehmen, trocken tupfen und salzen. Die Marinade durch ein Sieb gießen und auffangen. Das Fleisch im Butterschmalz rundum scharf anbraten, das Gemüse aus der Marinade mitrösten. Dabei den Abzug eine Stufe höher stellen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '8', minutes: 10, note: 'Brücke' }],
    },
    {
      text: 'Mit 500 ml Marinade ablöschen und den zugedeckten Bräter in den vorgeheizten Combair schieben. Etwa 2 Stunden schmoren, bis das Fleisch zart ist und eine Fleischgabel leicht hineingleitet.',
      settings: [{ device: 'combair', mode: 'Heißluft feucht', temp: 150, minutes: 120, core: 85, note: 'vorheizen, Deckel drauf' }],
    },
    {
      text: 'Fleisch herausnehmen. Die Sauce passieren, zerbröselte Printen, Rosinen und Zuckerrübensirup einrühren und sämig einköcheln. Mit Salz abschmecken, die Sauce soll angenehm süß-sauer schmecken.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '5', minutes: 10 }],
    },
    {
      text: 'Etwa 30 Minuten vor Ende der Schmorzeit die Salzkartoffeln zubereiten: den Wasserbehälter des CombiSteamers füllen, die Kartoffeln schälen, in gleich große Stücke (ca. 4 cm) schneiden, auf den gelochten Garbehälter legen, salzen und dämpfen, bis ein Messer leicht hineingleitet.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 30, note: 'gelocht' }],
    },
    {
      text: 'Gleichzeitig den Rotkohl fein hobeln und mit etwa 100 ml Wasser und einer Prise Salz mit Deckel weich schmoren, dabei ab und zu umrühren.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '3', minutes: 25, note: 'Deckel drauf' }],
    },
    {
      text: 'Dazu Salzkartoffeln und Rotkohl servieren.',
    },
  ],

  'wiener-schnitzel': [
    {
      text: 'Die Kartoffeln mit Schale im CombiSteamer als Pellkartoffeln dämpfen (Wasserbehälter vorher füllen), pellen und noch warm in Scheiben schneiden.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 35, note: 'gelocht' }],
    },
    {
      text: 'Fein gewürfelte Zwiebel in der Brühe aufkochen, mit Essig, Senf, Salz, Pfeffer und einer Prise Zucker über die Kartoffeln gießen und 30 Minuten ziehen lassen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: 'Power', minutes: 3, note: 'aufkochen' }],
    },
    {
      text: 'Gurke fein hobeln, leicht salzen, ausdrücken und mit Öl und Schnittlauch unter den Salat heben.',
    },
    {
      text: 'Die Kalbsschnitzel zwischen Frischhaltefolie dünn klopfen (ca. 4 mm), salzen und pfeffern. Nacheinander in Mehl, verquirltem Ei und Paniermehl wenden. Die Panade nicht andrücken.',
    },
    {
      text: 'Butterschmalz in einer großen Pfanne fingerhoch erhitzen. Die Schnitzel schwimmend 2 bis 3 Minuten je Seite goldbraun ausbacken, dabei die Pfanne schwenken, damit heißes Fett über die Schnitzel schwappt und die Panade souffliert (sich wellig vom Fleisch abhebt).',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '7', minutes: 6, note: 'Pfanne vorheizen' }],
    },
    {
      text: 'Auf Küchenpapier abtropfen lassen und mit Zitronenspalten servieren.',
    },
  ],

  jaegerschnitzel: [
    {
      text: 'Die Schweineschnitzel flach klopfen, mit Salz, Pfeffer und Paprika würzen und mehlieren (dünn in Mehl wenden und überschüssiges Mehl abklopfen). Im heißen Butterschmalz 3 Minuten je Seite braten.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '6', minutes: 6, note: 'Pfanne vorheizen' }],
    },
    {
      text: 'Die Schnitzel im Combair mit „Warmhalten“ warm halten.',
      settings: [{ device: 'combair', mode: 'Warmhalten', note: 'Teller vorwärmen' }],
    },
    {
      text: 'Im Bratfett Speck und Zwiebelwürfel anbraten, dann die in Scheiben geschnittenen Champignons zugeben und kräftig braten.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: '5', minutes: 3 },
        { device: 'bora', mode: 'Kochzone', level: '8', minutes: 5, note: 'Pilze kräftig' },
      ],
    },
    {
      text: 'Mit Fond und Sahne ablöschen, 5 Minuten einköcheln lassen und mit Salz und Pfeffer abschmecken. Petersilie unterrühren.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '5', minutes: 5 }],
    },
    {
      text: 'Die Spätzle in einer zweiten Pfanne in der Butter schwenken, bis sie heiß und leicht gebräunt sind, und mit Schnitzel und Pilzsauce servieren.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '5', minutes: 4 }],
    },
  ],

  paprikaschnitzel: [
    {
      text: 'Die Schweineschnitzel flach klopfen, mit Salz und Pfeffer würzen, mehlieren (dünn in Mehl wenden und überschüssiges Mehl abklopfen) und im Butterschmalz 3 Minuten je Seite braten.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '6', minutes: 6, note: 'Pfanne vorheizen' }],
    },
    {
      text: 'Die Schnitzel im Combair mit „Warmhalten“ warm halten.',
      settings: [{ device: 'combair', mode: 'Warmhalten' }],
    },
    {
      text: 'Jetzt die Pommes in den vorgeheizten Airfryer geben und knusprig backen, während die Sauce entsteht. Korb höchstens halb füllen und zwischendurch schütteln.',
      settings: [{ device: 'airfryer', mode: 'Heissluft', temp: 190, minutes: 18, note: 'vorheizen, schütteln' }],
    },
    {
      text: 'Paprika und Zwiebel in Streifen schneiden und im Bratfett andünsten. Tomatenmark und Paprikapulver kurz mitrösten.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: '4', minutes: 6 },
        { device: 'bora', mode: 'Kochzone', level: '6', minutes: 1, note: 'Pulver nicht verbrennen' },
      ],
    },
    {
      text: 'Passierte Tomaten und Brühe zugeben und 10 Minuten köcheln lassen. Mit Salz, Pfeffer und einer Prise Zucker abschmecken und über die Schnitzel geben.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '4', minutes: 10 }],
    },
  ],

  rahmschnitzel: [
    {
      text: 'Die Schweineschnitzel dünn klopfen, salzen, pfeffern, mehlieren (dünn in Mehl wenden und überschüssiges Mehl abklopfen) und in Butterschmalz etwa 3 Minuten je Seite goldbraun braten. Herausnehmen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '6', minutes: 6, note: 'Pfanne vorheizen' }],
    },
    {
      text: 'Die Schnitzel im Combair mit „Warmhalten“ warm halten.',
      settings: [{ device: 'combair', mode: 'Warmhalten' }],
    },
    {
      text: 'Schalottenwürfel im Bratfett glasig dünsten, mit Fond ablöschen und den Bratensatz lösen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '4', minutes: 3 }],
    },
    {
      text: 'Sahne und Senf zugeben und cremig einkochen. Abschmecken und die Schnitzel kurz in der Sauce ziehen lassen.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: '5', minutes: 6, note: 'einkochen' },
        { device: 'bora', mode: 'Kochzone', level: 'Simmern', minutes: 2, note: 'Schnitzel ziehen' },
      ],
    },
    {
      text: 'Die Spätzle in einer zweiten Pfanne in der Butter goldgelb anbraten und dazu servieren.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '6', minutes: 6 }],
    },
  ],

  'cordon-bleu': [
    {
      text: 'Die Kartoffeln mit Schale im CombiSteamer als Pellkartoffeln dämpfen (Wasserbehälter vorher füllen), pellen, abkühlen lassen und in Scheiben schneiden. Am besten schon am Vortag.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 35, note: 'gelocht' }],
    },
    {
      text: 'Die Schweineschnitzel seitlich zu einer Tasche einschneiden oder dünn klopfen. Mit Schinken und Käse füllen, zuklappen und die Ränder andrücken. Salzen und pfeffern.',
    },
    {
      text: 'Nacheinander in Mehl, verquirltem Ei und Paniermehl wenden (panieren) und in reichlich Butterschmalz bei mittlerer Hitze je Seite 4 bis 5 Minuten goldbraun braten.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '5', minutes: 10, note: 'Pfanne vorheizen' }],
    },
    {
      text: 'Die Kartoffelscheiben in einer zweiten Pfanne mit etwas Butterschmalz knusprig braten, Speck und gewürfelte Zwiebel zugeben und mit Salz und Pfeffer würzen. Mit Zitrone servieren.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: '6', minutes: 8, note: 'zweite Zone' },
        { device: 'bora', mode: 'Kochzone', level: '4', minutes: 5, note: 'Speck, Zwiebel' },
      ],
    },
  ],

  'koenigsberger-klopse': [
    {
      text: 'Brötchen einweichen und gut ausdrücken. Mit Hack, Ei, fein gewürfelter Zwiebel, gehackten Sardellen, Salz und Pfeffer verkneten und 8 Klopse formen.',
    },
    {
      text: 'Für die Salzkartoffeln den Wasserbehälter des CombiSteamers füllen, die Kartoffeln schälen, halbieren, auf den gelochten Garbehälter legen, salzen und dämpfen, bis ein Messer leicht hineingleitet.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 25, note: 'gelocht' }],
    },
    {
      text: 'Brühe mit Deckel aufkochen, Klopse hineingeben und bei schwacher Hitze 15 Minuten gar ziehen lassen. Herausnehmen und die Brühe aufbewahren.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: 'Power', note: 'aufkochen' },
        { device: 'bora', mode: 'Kochzone', level: 'Simmern', minutes: 15, note: 'gar ziehen' },
      ],
    },
    {
      text: 'Butter schmelzen, Mehl einrühren und unter Rühren hell anschwitzen, ohne dass es braun wird. Nach und nach 400 ml Brühe mit dem Schneebesen einrühren. 5 Minuten köcheln lassen, dann Sahne und Kapern zugeben.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: '4', minutes: 2, note: 'anschwitzen' },
        { device: 'bora', mode: 'Kochzone', level: '4', minutes: 5, note: 'köcheln' },
      ],
    },
    {
      text: 'Topf von der Zone nehmen, Eigelb einrühren (nicht mehr kochen) und mit Zitronensaft, Salz und Pfeffer abschmecken. Klopse in der Sauce erwärmen und mit Salzkartoffeln servieren.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: 'Warmhalten', note: 'Klopse erwärmen' }],
    },
  ],

  frikadellen: [
    {
      text: 'Brötchen einweichen und gut ausdrücken. Zwiebel fein würfeln, in wenig Butterschmalz glasig dünsten und kurz abkühlen lassen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '4', minutes: 4 }],
    },
    {
      text: 'Mit Hack, Ei, Senf, Majoran, Salz, Pfeffer und Paprika verkneten und 6 flache Frikadellen formen.',
    },
    {
      text: 'Kartoffeln schälen, in Stücke schneiden und im CombiSteamer weich dämpfen.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 25, note: 'gelocht' }],
    },
    {
      text: 'Frikadellen im Butterschmalz bei mittlerer Hitze 5 bis 6 Minuten je Seite braten, bis sie innen nicht mehr rosa sind.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '5', minutes: 12, note: 'Pfanne vorheizen' }],
    },
    {
      text: 'Für die letzten 8 Minuten Erbsen und Möhren mit etwas Butter und wenig Wasser in einer Schale in den CombiSteamer zu den Kartoffeln stellen, salzen und dämpfen.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 8, note: 'Ebene 3' }],
    },
    {
      text: 'Milch und restliche Butter in einem Topf erhitzen, die Kartoffeln zugeben und mit dem Kartoffelstampfer zu Püree stampfen. Mit Muskat und Salz abschmecken.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '3', minutes: 3, note: 'Milch erhitzen' }],
    },
  ],

  rindergulasch: [
    {
      text: 'Fleisch trocken tupfen und portionsweise im heißen Butterschmalz kräftig anbraten. Dabei den Abzug eine Stufe höher stellen. Herausnehmen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '8', minutes: 10, note: 'Brücke' }],
    },
    {
      text: 'Zwiebeln in Streifen schneiden und im Bräter 10 Minuten goldbraun schmoren. Tomatenmark und Paprikapulver kurz mitrösten, das Pulver darf nicht verbrennen.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: '4', minutes: 10 },
        { device: 'bora', mode: 'Kochzone', level: '4', minutes: 1, note: 'Pulver nicht verbrennen' },
      ],
    },
    {
      text: 'Mit Rotwein ablöschen, Fleisch, Fond, Kümmel, Majoran und gehackten Knoblauch zugeben und kurz aufkochen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '8', minutes: 3, note: 'aufkochen' }],
    },
    {
      text: 'Den zugedeckten Bräter in den vorgeheizten Combair schieben und 70 Minuten schmoren.',
      settings: [{ device: 'combair', mode: 'Heißluft feucht', temp: 150, minutes: 70, note: 'vorheizen, Deckel drauf' }],
    },
    {
      text: 'Paprika würfeln, zugeben und weitere 20 Minuten garen, bis das Fleisch zart ist. Abschmecken.',
      settings: [{ device: 'combair', mode: 'Heißluft feucht', temp: 150, minutes: 20 }],
    },
    {
      text: 'Etwa 20 Minuten vor Ende der Schmorzeit reichlich Salzwasser mit Deckel aufkochen, die Bandnudeln darin bissfest kochen, abgießen und mit dem Gulasch servieren.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: 'Power', note: 'aufkochen' },
        { device: 'bora', mode: 'Kochzone', level: '7', minutes: 9 },
      ],
    },
  ],

  'szegediner-gulasch': [
    {
      text: 'Fleisch im Öl kräftig anbraten, gewürfelte Zwiebeln zugeben und glasig schmoren.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: '8', minutes: 6, note: 'Pfanne vorheizen' },
        { device: 'bora', mode: 'Kochzone', level: '4', minutes: 4, note: 'Zwiebeln' },
      ],
    },
    {
      text: 'Tomatenmark und Paprikapulver kurz mitrösten und mit Brühe ablöschen. Kümmel zugeben, mit Deckel aufkochen und 40 Minuten schmoren lassen.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: '6', minutes: 1, note: 'Pulver nicht verbrennen' },
        { device: 'bora', mode: 'Kochzone', level: '8', minutes: 3, note: 'aufkochen' },
        { device: 'bora', mode: 'Kochzone', level: '3', minutes: 40, note: 'Deckel drauf' },
      ],
    },
    {
      text: 'Sauerkraut kurz abspülen, zugeben und weitere 30 Minuten garen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '3', minutes: 30, note: 'Deckel drauf' }],
    },
    {
      text: 'Während das Sauerkraut gart, den Wasserbehälter des CombiSteamers füllen. Die Kartoffeln schälen, halbieren, auf den gelochten Garbehälter legen, salzen und als Salzkartoffeln dämpfen, bis ein Messer leicht hineingleitet.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 25, note: 'gelocht' }],
    },
    {
      text: 'Mit Salz und Pfeffer abschmecken. Mit einem Klecks Schmand und Salzkartoffeln servieren.',
    },
  ],

  'kassler-sauerkraut': [
    {
      text: 'Zwiebel würfeln und in Butterschmalz andünsten. Sauerkraut, gewürfelten Apfel, Wein, Lorbeer, Wacholderbeeren und 100 ml Wasser zugeben.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '4', minutes: 4 }],
    },
    {
      text: 'Kasseler auf das Kraut legen und alles mit Deckel aufkochen. Dann 40 Minuten sanft garen und mit einer Prise Zucker abschmecken.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: '8', minutes: 3, note: 'aufkochen' },
        { device: 'bora', mode: 'Kochzone', level: '3', minutes: 40, note: 'Deckel drauf' },
      ],
    },
    {
      text: 'Während das Kraut gart, die Kartoffeln schälen, in Stücke schneiden und im CombiSteamer weich dämpfen (Wasserbehälter vorher füllen).',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 25, note: 'gelocht' }],
    },
    {
      text: 'Milch und Butter in einem Topf erhitzen, die Kartoffeln zugeben und zu Püree stampfen. Mit Muskat und Salz würzen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '3', minutes: 3, note: 'Milch erhitzen' }],
    },
    {
      text: 'Kasseler in Scheiben schneiden und mit Kraut und Püree servieren.',
    },
  ],

  leberkaese: [
    {
      text: 'Die Kartoffeln mit Schale im CombiSteamer als Pellkartoffeln dämpfen, pellen und in Scheiben schneiden.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 35, note: 'gelocht' }],
    },
    {
      text: 'Die Kartoffelscheiben in einer großen Pfanne in 2 EL Butterschmalz ohne zu wenden 5 Minuten anbraten, dann wenden und knusprig braten. Zwiebelwürfel zugeben und mit Salz, Pfeffer und etwas Kümmel würzen.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: '6', minutes: 5, note: 'nicht wenden' },
        { device: 'bora', mode: 'Kochzone', level: '5', minutes: 6, note: 'wenden, Zwiebeln' },
      ],
    },
    {
      text: 'Die Leberkäse-Scheiben mit etwas Butterschmalz einpinseln und in den vorgeheizten Airfryer legen. Nach der Hälfte wenden.',
      settings: [{ device: 'airfryer', mode: 'Heissluft', temp: 180, minutes: 10, note: 'vorheizen, wenden' }],
    },
    {
      text: 'Daneben in einer zweiten Pfanne im restlichen Butterschmalz die Eier als Spiegeleier braten.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '5', minutes: 4, note: 'zweite Zone' }],
    },
    {
      text: 'Mit süßem Senf servieren.',
    },
  ],

  'bratwurst-sauerkraut': [
    {
      text: 'Speck und Zwiebel anbraten, Sauerkraut, Kümmel, Lorbeer und 100 ml Wasser zugeben und mit Deckel 30 Minuten schmoren.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: '5', minutes: 5, note: 'Speck, Zwiebel' },
        { device: 'bora', mode: 'Kochzone', level: '3', minutes: 30, note: 'Deckel drauf' },
      ],
    },
    {
      text: 'Während das Kraut schmort, die Kartoffeln schälen, in Stücke schneiden und im CombiSteamer weich dämpfen (Wasserbehälter vorher füllen).',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 25, note: 'gelocht' }],
    },
    {
      text: 'Milch und Butter in einem Topf erhitzen, die Kartoffeln zugeben und zu Püree stampfen. Mit Muskat und Salz würzen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '3', minutes: 3, note: 'Milch erhitzen' }],
    },
    {
      text: 'Die Rostbratwürstchen im Butterschmalz rundum braun braten.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '6', minutes: 8, note: 'Pfanne vorheizen' }],
    },
    {
      text: 'Mit Senf servieren.',
    },
  ],

  currywurst: [
    {
      text: 'Für die Sauce die Zwiebel fein würfeln und in Öl anschwitzen. Tomatenmark, die Hälfte des Currypulvers und das Paprikapulver kurz mitrösten.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: '4', minutes: 3 },
        { device: 'bora', mode: 'Kochzone', level: '5', minutes: 1, note: 'Pulver nicht verbrennen' },
      ],
    },
    {
      text: 'Passierte Tomaten, Essig, Zucker und Worcestersauce zugeben und 10 Minuten köcheln lassen. Fein pürieren und abschmecken.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '4', minutes: 10 }],
    },
    {
      text: 'Während die Sauce köchelt, die Pommes in den vorgeheizten Airfryer geben und knusprig backen. Korb höchstens halb füllen und zwischendurch schütteln.',
      settings: [{ device: 'airfryer', mode: 'Heissluft', temp: 190, minutes: 18, note: 'vorheizen, schütteln' }],
    },
    {
      text: 'Die Bratwürste in einer Pfanne rundum braun braten, in Scheiben schneiden, mit Sauce übergießen und mit dem restlichen Currypulver bestäuben.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '6', minutes: 8, note: 'Pfanne vorheizen' }],
    },
  ],

  kaesespaetzle: [
    {
      text: 'Mehl, Eier, 1 TL Salz und ca. 80 ml Wasser zu einem zähen Teig schlagen, bis er Blasen wirft. 10 Minuten ruhen lassen.',
    },
    {
      text: 'Zwiebeln in Ringe schneiden und in Butter langsam goldbraun rösten.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '3', minutes: 15, note: 'öfter rühren' }],
    },
    {
      text: 'Den Combair vorheizen. Reichlich Salzwasser mit Deckel aufkochen. Den Teig portionsweise mit dem Spätzlehobel oder der Spätzlepresse ins siedende Wasser drücken (oder vom nassen Brett mit einem Messer in dünnen Streifen schaben). Sobald die Spätzle oben schwimmen, mit dem Schaumlöffel abschöpfen und abtropfen lassen.',
      settings: [
        { device: 'combair', mode: 'Ober-/Unterhitze', temp: 180, note: 'vorheizen' },
        { device: 'bora', mode: 'Kochzone', level: 'Power', note: 'aufkochen' },
        { device: 'bora', mode: 'Kochzone', level: '6', minutes: 10, note: 'siedend halten' },
      ],
    },
    {
      text: 'Spätzle und geriebenen Bergkäse lagenweise in eine Form schichten, mit Pfeffer und Muskat würzen und in den vorgeheizten Combair schieben, bis der Käse schmilzt.',
      settings: [{ device: 'combair', mode: 'Ober-/Unterhitze', temp: 180, minutes: 8, note: 'vorheizen, Form wärmen' }],
    },
    {
      text: 'Mit Röstzwiebeln und Schnittlauch servieren.',
    },
  ],

  krautschupfnudeln: [
    {
      text: 'Speck im Butterschmalz knusprig auslassen, Zwiebelwürfel zugeben und glasig dünsten.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: '5', minutes: 4, note: 'Speck' },
        { device: 'bora', mode: 'Kochzone', level: '4', minutes: 3, note: 'Zwiebel' },
      ],
    },
    {
      text: 'Sauerkraut, Kümmel und Brühe zugeben und 10 Minuten dünsten.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '4', minutes: 10, note: 'Deckel drauf' }],
    },
    {
      text: 'Schupfnudeln in einer zweiten Pfanne goldbraun braten.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '6', minutes: 8, note: 'zweite Zone' }],
    },
    {
      text: 'Alles vermengen, kurz zusammen braten und mit Pfeffer abschmecken.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '5', minutes: 3 }],
    },
  ],

  'geschmaelzte-maultaschen': [
    {
      text: 'Maultaschen in Streifen schneiden.',
    },
    {
      text: 'Zwiebeln in Ringe schneiden und in Butter goldbraun braten.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '4', minutes: 8 }],
    },
    {
      text: 'Maultaschen zugeben und anbraten. Eier verquirlen, salzen, pfeffern und darüber gießen, dann bei kleiner Hitze stocken lassen.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: '6', minutes: 5, note: 'anbraten' },
        { device: 'bora', mode: 'Kochzone', level: '3', minutes: 3, note: 'Ei stocken' },
      ],
    },
    {
      text: 'Mit Schnittlauch bestreuen und nach schwäbischer Art mit Kartoffelsalat servieren.',
    },
  ],

  kartoffelpuffer: [
    {
      text: 'Kartoffeln schälen und mit der Zwiebel fein reiben. In einem Tuch kräftig ausdrücken.',
    },
    {
      text: 'Mit Eiern, Mehl, Salz und Muskat vermengen.',
    },
    {
      text: 'Öl in einer Pfanne erhitzen, je 1 bis 2 EL Teig hineingeben, flach drücken und von beiden Seiten 3 bis 4 Minuten knusprig braten. Portionsweise arbeiten, die Pfanne nicht überfüllen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '6', minutes: 8, note: 'Pfanne vorheizen' }],
    },
    {
      text: 'Auf Küchenpapier abtropfen lassen und mit Apfelmus servieren.',
    },
  ],

  'himmel-und-erde': [
    {
      text: 'Kartoffeln schälen, in Stücke schneiden und im CombiSteamer weich dämpfen.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 25, note: 'gelocht' }],
    },
    {
      text: 'Milch und Butter in einem Topf erhitzen, die Kartoffeln zugeben und stampfen. Mit Salz und Muskat würzen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '3', minutes: 3, note: 'Milch erhitzen' }],
    },
    {
      text: 'Äpfel schälen, entkernen, würfeln und mit Zucker und etwas Wasser mit Deckel zu stückigem Kompott dünsten. Unter das Püree heben.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '3', minutes: 10, note: 'Deckel drauf' }],
    },
    {
      text: 'Zwiebeln in Ringe schneiden und in Butterschmalz goldbraun braten.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '4', minutes: 8 }],
    },
    {
      text: 'Blutwurst in dicke Scheiben schneiden und von beiden Seiten kurz anbraten. Mit Zwiebeln auf dem Püree anrichten.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '5', minutes: 4 }],
    },
  ],

  labskaus: [
    {
      text: 'Kartoffeln schälen, in Stücke schneiden, im CombiSteamer weich dämpfen und grob stampfen.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 25, note: 'gelocht' }],
    },
    {
      text: 'Zwiebel würfeln und im Butterschmalz glasig dünsten. Corned Beef zerpflücken, zugeben und mit etwas Gurkenwasser und Rote-Bete-Saft mischen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '4', minutes: 8 }],
    },
    {
      text: 'Kartoffeln und die Hälfte der gewürfelten Rote Bete unterrühren, bis alles rosa ist. Mit Pfeffer abschmecken.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '3', minutes: 4, note: 'durchrühren' }],
    },
    {
      text: 'Die Eier in einer zweiten Pfanne im restlichen Butterschmalz als Spiegeleier braten.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '5', minutes: 4, note: 'zweite Zone' }],
    },
    {
      text: 'Mit Spiegelei, Rollmops, Gewürzgurke und restlicher Rote Bete servieren.',
    },
  ],

  senfeier: [
    {
      text: 'Die Kartoffeln schälen, in Stücke schneiden und im CombiSteamer weich dämpfen.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 25, note: 'gelocht' }],
    },
    {
      text: 'Für die letzten 10 Minuten die Eier zu den Kartoffeln legen und hart dämpfen, dann kalt abschrecken und pellen.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 10, note: 'hart' }],
    },
    {
      text: 'Butter schmelzen, Mehl anschwitzen, mit Brühe und Sahne aufgießen und 5 Minuten köcheln lassen. Beide Senfsorten einrühren und mit Salz und einer Prise Zucker abschmecken.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: 'Schmelzen', note: 'Butter' },
        { device: 'bora', mode: 'Kochzone', level: '4', minutes: 2, note: 'anschwitzen' },
        { device: 'bora', mode: 'Kochzone', level: '4', minutes: 5, note: 'köcheln' },
      ],
    },
    {
      text: 'Die Milch erhitzen, die Kartoffeln darin zu Püree stampfen und mit Salz und Muskat abschmecken.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '3', minutes: 3, note: 'Milch erhitzen' }],
    },
    {
      text: 'Eier halbieren, in die Sauce legen und mit Schnittlauch und Püree servieren.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: 'Warmhalten', note: 'Eier erwärmen' }],
    },
  ],

  'spinat-spiegelei': [
    {
      text: 'Kartoffeln schälen, halbieren, auf den gelochten Garbehälter legen, salzen und im CombiSteamer als Salzkartoffeln gar dämpfen (Wasserbehälter vorher füllen).',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 25, note: 'gelocht' }],
    },
    {
      text: 'Rahmspinat mit Deckel erhitzen, öfter umrühren und mit Muskat und Pfeffer abschmecken.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '3', minutes: 10, note: 'Deckel drauf' }],
    },
    {
      text: 'Spiegeleier in Butter braten.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '5', minutes: 4, note: 'Pfanne vorheizen' }],
    },
    {
      text: 'Alles zusammen anrichten. Ein Klassiker wie bei Oma.',
    },
  ],

  huehnerfrikassee: [
    {
      text: 'Das Hähnchen in einer Schale mit der Brühe in den CombiSteamer stellen und gar ziehen lassen. Den Kerntemperaturfühler in die dickste Stelle stecken. Das Fleisch in Stücke schneiden und die Brühe aufbewahren.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 18, core: 72, note: 'Schale' }],
    },
    {
      text: 'Den Reis mit der 1,5-fachen Menge Wasser und Salz in einer flachen Schale auf dem gelochten Garbehälter daneben mitdämpfen.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 22, note: 'Ebene 2' }],
    },
    {
      text: 'Den Spargel schälen, die holzigen Enden abschneiden und in Stücke schneiden. Mit den geviertelten Champignons in Butter andünsten. Mehl darüber stäuben und unter Rühren kurz anschwitzen, ohne dass es braun wird.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '5', minutes: 8 }],
    },
    {
      text: 'Mit Brühe und Sahne aufgießen und 5 Minuten köcheln lassen. Erbsen, Kapern und Fleisch zugeben und mit Zitrone, Salz und Pfeffer abschmecken.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '4', minutes: 5 }],
    },
    {
      text: 'Den Reis zum Frikassee servieren.',
    },
  ],

  'haehnchen-rahm-bandnudeln': [
    {
      text: 'Reichlich Salzwasser mit Deckel aufkochen. Die Bandnudeln einlegen, sobald die Champignons in der Pfanne braten, bissfest kochen und abgießen.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: 'Power', note: 'aufkochen' },
        { device: 'bora', mode: 'Kochzone', level: '7', minutes: 9 },
      ],
    },
    {
      text: 'Hähnchenbrust in schmale Streifen schneiden, mit Salz, Pfeffer und Paprikapulver würzen und in Öl in einer großen Pfanne 4 bis 5 Minuten rundum goldbraun braten. Herausnehmen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '8', minutes: 5, note: 'Pfanne vorheizen' }],
    },
    {
      text: 'Zwiebel würfeln, Champignons in Scheiben schneiden und im Bratfett 5 Minuten anbraten, bis sie Farbe haben.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '6', minutes: 5 }],
    },
    {
      text: 'Mit Brühe ablöschen, Sahne und Senf einrühren und 3 Minuten köcheln. Stärke in wenig kaltem Wasser anrühren und die Soße damit leicht binden.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '4', minutes: 3 }],
    },
    {
      text: 'Hähnchen zurück in die Soße geben und nur noch erwärmen. Abschmecken, mit Petersilie bestreuen und mit den Bandnudeln servieren.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: 'Simmern', minutes: 2, note: 'nur erwärmen' }],
    },
  ],

  'zuercher-geschnetzeltes': [
    {
      text: 'Die Kartoffeln vorab (am besten am Vortag) mit Schale im CombiSteamer als Pellkartoffeln dämpfen, pellen, vollständig auskühlen lassen und grob raspeln.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 35, note: 'gelocht' }],
    },
    {
      text: 'Die Kartoffelraspel salzen. Butterschmalz in der Pfanne erhitzen, die Raspel darin zu 2 flachen Fladen (Rösti) andrücken und braten, bis die Unterseite goldbraun und knusprig ist. Mit Hilfe eines Tellers wenden und die zweite Seite ebenso lange braten.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '5', minutes: 16, note: 'nach 8 Min. wenden' }],
    },
    {
      text: 'Das Kalbfleisch in feine Streifen schneiden, leicht mehlieren (in Mehl wenden, überschüssiges abklopfen) und portionsweise scharf anbraten. Herausnehmen. Dabei den Abzug eine Stufe höher stellen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '9', minutes: 6, note: 'zweite Zone' }],
    },
    {
      text: 'Schalotte und Champignons im Bratfett andünsten, mit Wein ablöschen, dann Fond und Sahne zugeben und sämig einkochen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '5', minutes: 10 }],
    },
    {
      text: 'Das Fleisch nur noch erwärmen, nicht mehr kochen. Abschmecken, mit Petersilie bestreuen und mit Rösti servieren.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: 'Simmern', minutes: 2, note: 'nicht kochen' }],
    },
  ],

  'schweinemedaillons-pfefferrahm': [
    {
      text: 'Das Schweinefilet in 3 cm dicke Medaillons schneiden und leicht flach drücken.',
    },
    {
      text: 'Im heißen Butterschmalz 3 Minuten je Seite braten und salzen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '6', minutes: 6, note: 'Pfanne vorheizen' }],
    },
    {
      text: 'Die Medaillons im Combair mit „Warmhalten“ warm halten.',
      settings: [{ device: 'combair', mode: 'Warmhalten' }],
    },
    {
      text: 'Schalotte im Bratfett andünsten, mit Weinbrand ablöschen, dann Fond, Sahne und grünen Pfeffer zugeben und cremig einkochen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '5', minutes: 8 }],
    },
    {
      text: 'Die Spätzle in einer zweiten Pfanne in der Butter schwenken, bis sie heiß sind, und mit den Medaillons und der Sauce servieren.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '5', minutes: 4 }],
    },
  ],

  kohlrouladen: [
    {
      text: 'Den Strunk des Weißkohls mit einem spitzen Messer keilförmig tief herausschneiden. Den ganzen Kohlkopf mit der Schnittseite nach unten auf den gelochten Garbehälter legen und im CombiSteamer dämpfen, bis die äußeren Blätter weich und biegsam sind (Wasserbehälter vorher füllen).',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 15, note: 'gelocht' }],
    },
    {
      text: 'Den Kohl kurz abkühlen lassen und 8 große Blätter vorsichtig vom Strunk her ablösen. Lösen sich die inneren Blätter noch schwer, den Kohl weitere 5 Minuten dämpfen. Bei jedem Blatt die dicke, harte Mittelrippe flach schneiden: das Blatt flach hinlegen und die Rippe mit einem Messer waagerecht abschneiden, bis sie so dünn ist wie das restliche Blatt – so lässt es sich aufrollen, ohne zu brechen.',
    },
    {
      text: 'Das Brötchen 10 Minuten in Wasser einweichen, gut ausdrücken und zerpflücken. Die Zwiebel fein würfeln. Hackfleisch, Brötchen, Ei, Zwiebel, Salz, Pfeffer, Paprikapulver und Kümmel kräftig verkneten und in 8 Portionen teilen.',
    },
    {
      text: 'Je eine Portion Füllung länglich auf das untere Ende eines Blattes legen, die Seiten einschlagen und von unten fest aufrollen. Mit Küchengarn wie ein Päckchen binden oder mit Rouladennadeln feststecken.',
    },
    {
      text: 'Den Combair vorheizen. Das Butterschmalz im Bräter erhitzen und die Kohlrouladen rundum goldbraun anbraten. Das Tomatenmark kurz mitrösten und mit dem Rinderfond ablöschen.',
      settings: [
        { device: 'combair', mode: 'Heißluft feucht', temp: 160, note: 'vorheizen' },
        { device: 'bora', mode: 'Kochzone', level: '7', minutes: 8, note: 'Brücke' },
      ],
    },
    {
      text: 'Den Bräter mit Deckel in den Combair schieben und schmoren lassen.',
      settings: [{ device: 'combair', mode: 'Heißluft feucht', temp: 160, minutes: 45, note: 'Deckel drauf' }],
    },
    {
      text: 'Während die Rouladen schmoren, die Salzkartoffeln zubereiten: Kartoffeln schälen, große halbieren oder vierteln, sodass alle Stücke etwa gleich groß sind (ca. 4 cm). Auf den gelochten Garbehälter legen, kräftig salzen und im CombiSteamer dämpfen, bis ein Messer leicht hineingleitet.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 25, note: 'gelocht' }],
    },
    {
      text: 'Die Kohlrouladen aus dem Bräter nehmen und das Garn entfernen. Den Schmand in die Sauce rühren, kurz aufkochen und mit Salz und Pfeffer abschmecken. Die Rouladen mit Sauce und Salzkartoffeln servieren.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '4', minutes: 2 }],
    },
  ],

  'gefuellte-paprika': [
    {
      text: 'Den Wasserbehälter des CombiSteamers füllen. Den Reis mit 120 ml Wasser und einer Prise Salz in einer flachen Schale auf dem gelochten Garbehälter halb gar dämpfen. Die Paprika köpfen (den Deckel abschneiden und aufheben) und entkernen.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 12, note: 'halb gar' }],
    },
    {
      text: 'Die Hälfte des Reises abnehmen, die andere Hälfte in der Schale lassen. Die Zwiebel fein würfeln. Hack, den abgenommenen Reis, Ei, Zwiebel, Salz, Pfeffer und Paprikapulver vermengen, in die Schoten füllen und die Deckel aufsetzen.',
    },
    {
      text: 'Den Combair vorheizen. Passierte Tomaten, Tomatenmark und Brühe in einem ofenfesten Topf aufkochen und mit Salz, Pfeffer und einer Prise Zucker würzen.',
      settings: [
        { device: 'combair', mode: 'Heißluft feucht', temp: 170, note: 'vorheizen' },
        { device: 'bora', mode: 'Kochzone', level: 'Power', note: 'aufkochen' },
      ],
    },
    {
      text: 'Die Paprika in die Sauce setzen und den zugedeckten Topf in den vorgeheizten Combair schieben. 40 Minuten schmoren lassen.',
      settings: [{ device: 'combair', mode: 'Heißluft feucht', temp: 170, minutes: 40, note: 'vorheizen, Deckel drauf' }],
    },
    {
      text: 'Etwa 15 Minuten vor Ende der Schmorzeit den restlichen Reis mit 2 EL Wasser im CombiSteamer fertig garen.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 10, note: 'fertig garen' }],
    },
    {
      text: 'Die Sauce mit Schmand verfeinern und mit dem Reis servieren.',
    },
  ],

  hackbraten: [
    {
      text: 'Den Combair vorheizen. Das Brötchen in Wasser einweichen und gut ausdrücken, die Zwiebel fein würfeln. Hack mit Brötchen, rohem Ei, Zwiebel, Senf, Salz und Pfeffer verkneten.',
      settings: [{ device: 'combair', mode: 'Heißluft', temp: 160, note: 'vorheizen' }],
    },
    {
      text: 'Die harten Eier 12 Minuten im CombiSteamer dämpfen, abschrecken und pellen.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 12, note: 'hart' }],
    },
    {
      text: 'Die Hälfte der Masse zu einem flachen Laib formen, die gepellten harten Eier darauflegen, mit der restlichen Masse umhüllen und mit Bacon belegen.',
    },
    {
      text: 'In einer Form in den vorgeheizten Combair schieben und backen. Den Kerntemperaturfühler in die Mitte stecken. Nach 20 Minuten den Fond angießen.',
      settings: [{ device: 'combair', mode: 'Heißluft', temp: 160, minutes: 50, core: 75, note: 'vorheizen' }],
    },
    {
      text: 'Etwa 30 Minuten vor Ende der Backzeit die Kartoffeln schälen, in Stücke schneiden und im CombiSteamer weich dämpfen. Milch und Butter erhitzen, die Kartoffeln darin zu Püree stampfen und mit Salz und Muskat abschmecken.',
      settings: [
        { device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 25, note: 'gelocht' },
        { device: 'bora', mode: 'Kochzone', level: '3', minutes: 3, note: 'Milch erhitzen' },
      ],
    },
    {
      text: 'Bratensaft mit Sahne aufkochen und abschmecken. Dazu Kartoffelpüree servieren.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '6', minutes: 4, note: 'aufkochen' }],
    },
  ],

  speckpfannkuchen: [
    {
      text: 'Mehl, Eier, Milch und eine Prise Salz glatt rühren und 10 Minuten quellen lassen.',
    },
    {
      text: 'Bacon in einer Pfanne knusprig braten, etwas Butterschmalz zugeben, Teig für einen Pfannkuchen darüber gießen und von beiden Seiten goldbraun backen. So 3 bis 4 Pfannkuchen backen.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: '6', minutes: 4, note: 'Bacon knusprig' },
        { device: 'bora', mode: 'Kochzone', level: '5', minutes: 5, note: 'je Pfannkuchen' },
      ],
    },
    {
      text: 'Feldsalat waschen. Aus Schalotte, Essig, Öl, Senf, Salz und Pfeffer ein Dressing rühren.',
    },
    {
      text: 'Pfannkuchen mit dem Salat servieren.',
    },
  ],

  flammkuchen: [
    {
      text: 'Den Combair mit dem Blech auf Ebene 2 vorheizen.',
      settings: [{ device: 'combair', mode: 'PizzaPlus', temp: 250, minutes: 15, note: 'vorheizen, Ebene 2' }],
    },
    {
      text: 'Den Flammkuchenteig ausrollen und mit gewürztem Schmand (Salz, Pfeffer, Muskat) dünn bestreichen.',
    },
    {
      text: 'Zwiebel in hauchdünne Ringe schneiden und mit dem Speck auf dem Teig verteilen.',
    },
    {
      text: 'Den Flammkuchen auf dem heißen Blech in den Combair schieben und knusprig backen.',
      settings: [{ device: 'combair', mode: 'PizzaPlus', temp: 250, minutes: 11, note: 'Ebene 2' }],
    },
  ],

  bauernfruehstueck: [
    {
      text: 'Die Kartoffeln im CombiSteamer als Pellkartoffeln dämpfen, pellen und in Scheiben schneiden.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 35, note: 'gelocht' }],
    },
    {
      text: 'Die Kartoffelscheiben im Butterschmalz knusprig braten, dann Speck und gewürfelte Zwiebel zugeben.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: '6', minutes: 8, note: 'Pfanne vorheizen' },
        { device: 'bora', mode: 'Kochzone', level: '5', minutes: 5, note: 'Speck, Zwiebel' },
      ],
    },
    {
      text: 'Eier mit Milch, Salz und Pfeffer verquirlen, darüber gießen und bei kleiner Hitze stocken lassen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '3', minutes: 5, note: 'Deckel drauf' }],
    },
    {
      text: 'Mit Schnittlauch bestreuen und mit Gewürzgurken servieren.',
    },
  ],

  'matjes-hausfrauenart': [
    {
      text: 'Die Kartoffeln mit Schale im CombiSteamer dämpfen.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 35, note: 'gelocht' }],
    },
    {
      text: 'Apfel, Zwiebel und Gurke in feine Streifen schneiden.',
    },
    {
      text: 'Saure Sahne und Joghurt verrühren, mit Salz, Pfeffer und einer Prise Zucker würzen. Apfel, Zwiebel, Gurke und gehackten Dill unterheben.',
    },
    {
      text: 'Matjes in mundgerechte Stücke schneiden, unter die Sauce ziehen und mit den Pellkartoffeln servieren.',
    },
  ],

  backfisch: [
    {
      text: 'Die Kartoffeln mit Schale im CombiSteamer als Pellkartoffeln dämpfen, noch warm pellen und in Scheiben schneiden.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 35, note: 'gelocht' }],
    },
    {
      text: 'Die Brühe erhitzen und mit Zwiebelwürfeln, Essig, Salz und Pfeffer zu Kartoffelsalat anmachen. Mindestens 20 Minuten durchziehen lassen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '8', minutes: 3, note: 'Brühe erhitzen' }],
    },
    {
      text: 'Für die Remoulade die Mayonnaise mit fein gehackter Gurke, Kapern und Petersilie verrühren.',
    },
    {
      text: 'Mehl, Bier, Ei und Salz zu einem dickflüssigen Bierteig verrühren. Den Kabeljau in Stücke schneiden, salzen und mit Zitrone beträufeln.',
    },
    {
      text: 'Das Frittieröl im Topf auf 175 °C erhitzen (Thermometer, oder: an einem eingetauchten Holzlöffelstiel steigen kleine Bläschen auf). Den Fisch durch den Teig ziehen, abtropfen lassen und portionsweise 4 bis 5 Minuten goldbraun ausbacken, dann auf Küchenpapier abtropfen lassen. Mit Remoulade und Salat servieren.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '7', minutes: 5, note: 'Öl 175 °C' }],
    },
  ],

  'lachs-senf-dill': [
    {
      text: 'Den Wasserbehälter des CombiSteamers füllen. Die Kartoffeln schälen, halbieren, auf den gelochten Garbehälter legen, salzen und gar dämpfen. In Butter mit gehackter Petersilie schwenken und zugedeckt warm halten.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 25, note: 'gelocht' }],
    },
    {
      text: 'Den Lachs salzen, pfeffern und mit Öl bestreichen. Den CombiSteamer auf 85 °C umstellen, den Lachs auf den gelochten Garbehälter legen, den Kerntemperaturfühler in die dickste Stelle stecken und garen, bis der Kern 58 °C erreicht (innen saftig und noch leicht glasig).',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 85, minutes: 10, core: 58, note: 'nach den Kartoffeln' }],
    },
    {
      text: 'Sahne mit Senf und Honig aufkochen, 3 Minuten einköcheln lassen, gehackten Dill einrühren und mit Zitrone abschmecken.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: '8', minutes: 1, note: 'aufkochen' },
        { device: 'bora', mode: 'Kochzone', level: '5', minutes: 3 },
      ],
    },
    {
      text: 'Lachs mit Sauce und Kartoffeln anrichten.',
    },
  ],

  'pellkartoffeln-kraeuterquark': [
    {
      text: 'Die Kartoffeln gründlich waschen und mit Schale auf dem gelochten Garbehälter im CombiSteamer garen (Wasserbehälter vorher füllen).',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 35, note: 'gelocht' }],
    },
    {
      text: 'Den Speisequark mit Milch glatt rühren. Schnittlauch, Petersilie und Dill fein hacken, Zwiebel fein würfeln und beides unterrühren. Mit Salz und Pfeffer würzen.',
    },
    {
      text: 'Quark mit einer Mulde anrichten und Leinöl hineingießen, wie in der Lausitz.',
    },
    {
      text: 'Mit den Pellkartoffeln servieren.',
    },
  ],

  'gruene-sosse': [
    {
      text: 'Die Kartoffeln mit Schale im CombiSteamer dämpfen.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 35, note: 'gelocht' }],
    },
    {
      text: 'Nach 24 Minuten alle 6 Eier dazulegen und hart dämpfen. Dann kalt abschrecken und pellen.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 11, note: 'Eier hart' }],
    },
    {
      text: 'Die sieben Kräuter (Borretsch, Kerbel, Kresse, Petersilie, Pimpinelle, Sauerampfer, Schnittlauch) waschen, grob schneiden und sehr fein pürieren oder wiegen.',
    },
    {
      text: 'Schmand, saure Sahne, Joghurt und Senf unterrühren. 2 Eier halbieren, die Eigelbe zerdrücken und einrühren, das Eiweiß fein hacken und ebenfalls unterheben. Mit Salz, Pfeffer und einer Prise Zucker abschmecken und 30 Minuten ziehen lassen.',
    },
    {
      text: 'Mit den 4 übrigen, halbierten Eiern und den Kartoffeln servieren.',
    },
  ],

  tafelspitz: [
    {
      text: 'Zwiebel halbieren und in einem Topf ohne Fett dunkel anrösten. Mit 2,5 l Wasser aufgießen, den Tafelspitz, Lorbeer und Pfefferkörner zugeben, mit Deckel aufkochen.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: '6', minutes: 6, note: 'ohne Fett' },
        { device: 'bora', mode: 'Kochzone', level: 'Power', note: 'aufkochen' },
      ],
    },
    {
      text: 'Den Schaum abschöpfen und das Fleisch bei kleinster Hitze 2 Stunden simmern lassen. Das Wasser soll sich kaum bewegen, sonst wird das Fleisch trocken.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: 'Simmern', minutes: 120, note: 'Fleisch gart' }],
    },
    {
      text: 'Dann Möhren, Sellerie und Lauch in groben Stücken zugeben, salzen und weitere 30 Minuten mitgaren, bis das Fleisch weich ist (Gabelprobe: eine Fleischgabel gleitet leicht hinein).',
      settings: [{ device: 'bora', mode: 'Kochzone', level: 'Simmern', minutes: 30 }],
    },
    {
      text: 'Während das Gemüse gart, den Wasserbehälter des CombiSteamers füllen. Die Kartoffeln schälen, halbieren, auf den gelochten Garbehälter legen, salzen und als Salzkartoffeln dämpfen.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 25, note: 'gelocht' }],
    },
    {
      text: 'Für die Sauce Butter schmelzen, Mehl anschwitzen, mit 300 ml Brühe und Sahne aufgießen, 5 Minuten köcheln lassen und Meerrettich einrühren.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: 'Schmelzen', note: 'Butter' },
        { device: 'bora', mode: 'Kochzone', level: '4', minutes: 7, note: 'zweite Zone' },
      ],
    },
    {
      text: 'Fleisch gegen die Faser aufschneiden und mit Gemüse, Salzkartoffeln, Sauce und Schnittlauch servieren. Die Brühe ergibt eine Suppe als Vorspeise.',
    },
  ],

  schweinshaxe: [
    {
      text: 'Die Schweinshaxen mit Salz, Pfeffer, Kümmel und gehacktem Knoblauch einreiben. Zwiebeln und Möhre grob schneiden und mit den Haxen und 300 ml Dunkelbier in einen Bräter geben.',
    },
    {
      text: 'Den Bräter auf Ebene 2 in den vorgeheizten CombiSteamer schieben und die Haxen garen. Den Kerntemperaturfühler in die dickste Stelle stecken, regelmäßig wenden und mit dem restlichen Dunkelbier übergießen.',
      settings: [{ device: 'steamer', mode: 'Heißluft mit Beschwaden', temp: 160, minutes: 150, core: 88, note: 'vorheizen, Ebene 2' }],
    },
    {
      text: 'Zum Schluss auf trockene Hitze umstellen und die Haxen knusprig backen.',
      settings: [{ device: 'steamer', mode: 'Heißluft', temp: 220, minutes: 15, note: 'ohne Dampf' }],
    },
    {
      text: 'Den Weißkohl fein hobeln, mit Salz kräftig durchkneten und mit Essig, Öl, Zucker und Kümmel zu Krautsalat anmachen. Mindestens 30 Minuten durchziehen lassen.',
    },
    {
      text: 'Etwa 40 Minuten vor Ende der Garzeit die Kartoffelknödel halb und halb nach Packungsanweisung mit kaltem Wasser anrühren, kurz quellen lassen und mit nassen Händen Knödel formen. Reichlich Salzwasser mit Deckel aufkochen, die Knödel einlegen und bei kleiner Hitze ziehen lassen, bis sie oben schwimmen. Das Wasser darf nicht sprudeln.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: 'Power', note: 'aufkochen' },
        { device: 'bora', mode: 'Kochzone', level: 'Simmern', minutes: 20 },
      ],
    },
    {
      text: 'Den Bratensaft durch ein Sieb gießen, abschmecken und zu Haxen, Knödeln und Krautsalat reichen.',
    },
  ],

  'leber-berliner-art': [
    {
      text: 'Kartoffeln schälen, in Stücke schneiden und im CombiSteamer weich dämpfen (Wasserbehälter vorher füllen). Milch mit der Hälfte der Butter erhitzen, die Kartoffeln darin zu Püree stampfen und mit Salz und Muskat abschmecken.',
      settings: [
        { device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 25, note: 'gelocht' },
        { device: 'bora', mode: 'Kochzone', level: '3', minutes: 3, note: 'Milch erhitzen' },
      ],
    },
    {
      text: 'Zwiebeln in Ringe schneiden und in etwas Butterschmalz goldbraun braten. Äpfel entkernen, in Ringe schneiden und in der restlichen Butter kurz von beiden Seiten braten.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: '4', minutes: 8, note: 'Zwiebeln' },
        { device: 'bora', mode: 'Kochzone', level: '5', minutes: 4, note: 'Äpfel, zweite Zone' },
      ],
    },
    {
      text: 'Die Kalbsleber in Scheiben schneiden, mehlieren (in Mehl wenden, überschüssiges abklopfen) und in heißem Butterschmalz 2 Minuten je Seite braten, innen darf sie noch leicht rosa sein. Erst danach salzen und pfeffern, sonst wird sie zäh.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '7', minutes: 4, note: 'Pfanne vorheizen' }],
    },
    {
      text: 'Leber mit Apfel- und Zwiebelringen auf dem Püree anrichten.',
    },
  ],

  'spargel-hollandaise': [
    {
      text: 'Den Wasserbehälter des CombiSteamers füllen. Die Kartoffeln schälen, halbieren, auf den gelochten Garbehälter legen, salzen und auf Ebene 1 dämpfen.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 25, note: 'gelocht, Ebene 1' }],
    },
    {
      text: 'Inzwischen den Spargel vom Kopf zum Ende hin schälen und die holzigen Enden abschneiden. Mit Zucker, Salz und einem Stück Butter in eine Schale geben und nach 10 Minuten auf Ebene 2 zu den Kartoffeln in den CombiSteamer stellen.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 15, note: 'Ebene 2' }],
    },
    {
      text: 'Für die Hollandaise die Butter schmelzen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: 'Schmelzen', note: 'Butter' }],
    },
    {
      text: 'Eigelbe mit Weißwein in einer Metallschüssel über einem Topf mit leise siedendem Wasser (die Schüssel darf das Wasser nicht berühren) dick-cremig aufschlagen, bis der Schneebesen Spuren hinterlässt. Die Schüssel abnehmen und die warme, flüssige Butter erst tropfenweise, dann in dünnem Strahl unterschlagen. Mit Zitronensaft, Salz und Pfeffer abschmecken. Wird die Sauce zu heiß, gerinnt sie.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: 'Simmern', minutes: 6, note: 'Wasserbad' }],
    },
    {
      text: 'Spargel mit Sauce, Katenschinken und Kartoffeln anrichten.',
    },
  ],

  'semmelknoedel-rahmpilze': [
    {
      text: 'Brötchen würfeln. Die Hälfte der Zwiebel fein würfeln, in Butter andünsten und zu den Brotwürfeln geben. Mit warmer Milch übergießen und 15 Minuten ziehen lassen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '4', minutes: 4 }],
    },
    {
      text: 'Eier, die Hälfte der Petersilie, Salz und Muskat zugeben, gut verkneten und 6 Knödel formen.',
    },
    {
      text: 'Reichlich Salzwasser mit Deckel aufkochen, die Knödel einlegen, die Hitze reduzieren und 20 Minuten ziehen lassen. Das Wasser soll nur leise sieden, nicht sprudeln, sonst zerfallen die Knödel.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: 'Power', note: 'aufkochen' },
        { device: 'bora', mode: 'Kochzone', level: 'Simmern', minutes: 20, note: 'ziehen lassen' },
      ],
    },
    {
      text: 'Champignons und Kräuterseitlinge in Scheiben schneiden, mit der restlichen Zwiebel in Butter kräftig anbraten, mit Brühe und Sahne ablöschen und cremig einkochen.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: '8', minutes: 6, note: 'Pfanne vorheizen' },
        { device: 'bora', mode: 'Kochzone', level: '5', minutes: 6, note: 'einkochen' },
      ],
    },
    {
      text: 'Mit restlicher Petersilie, Salz und Pfeffer abschmecken und mit den Knödeln servieren.',
    },
  ],

  'linsen-spaetzle': [
    {
      text: 'Speck auslassen und Zwiebel, Möhre und Sellerie fein gewürfelt anschwitzen. Mehl darüber stäuben und kurz mitrösten.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: '5', minutes: 4, note: 'Speck' },
        { device: 'bora', mode: 'Kochzone', level: '4', minutes: 5, note: 'Gemüse' },
      ],
    },
    {
      text: 'Die Alblinsen, Brühe und Lorbeer zugeben, mit Deckel aufkochen und 35 bis 40 Minuten weich köcheln lassen.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: '8', minutes: 3, note: 'aufkochen' },
        { device: 'bora', mode: 'Kochzone', level: '3', minutes: 38, note: 'Deckel drauf' },
      ],
    },
    {
      text: 'Mit Essig, Salz, Pfeffer und einer Prise Zucker säuerlich abschmecken. Würstchen in den Linsen erhitzen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: 'Simmern', minutes: 6, note: 'Würstchen' }],
    },
    {
      text: 'Die Spätzle in einer zweiten Pfanne in der Butter schwenken, bis sie heiß sind, und alles zusammen servieren.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '5', minutes: 4, note: 'zweite Zone' }],
    },
  ],

  zwiebelrostbraten: [
    {
      text: 'Zwiebeln in feine Ringe schneiden, in Mehl mit Paprikapulver wenden und im Butterschmalz portionsweise knusprig frittieren. Abtropfen lassen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '7', minutes: 6, note: 'portionsweise' }],
    },
    {
      text: 'Den Fettrand der Rumpsteaks mehrmals einschneiden, damit sie sich beim Braten nicht wölben. Steaks pfeffern und im heißen Fett je Seite 2 bis 3 Minuten braten. Dabei den Abzug eine Stufe höher stellen. Salzen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '8', minutes: 5, note: 'Pfanne vorheizen' }],
    },
    {
      text: 'Die Steaks im Combair mit „Warmhalten“ warm stellen.',
      settings: [{ device: 'combair', mode: 'Warmhalten' }],
    },
    {
      text: 'Bratensatz mit Wein und Fond ablöschen und kräftig einkochen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '7', minutes: 5, note: 'einkochen' }],
    },
    {
      text: 'Die Spätzle in einer zweiten Pfanne in der Butter schwenken, bis sie heiß sind. Steaks mit Sauce und Röstzwiebeln anrichten und mit Butterspätzle servieren.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '5', minutes: 4, note: 'Spätzle' }],
    },
  ],

  kaiserschmarrn: [
    {
      text: 'Eier trennen. Eigelb, Mehl, Milch, Vanillezucker und eine Prise Salz glatt rühren. Rosinen untermischen.',
    },
    {
      text: 'Eiweiß mit dem Zucker steif schlagen und locker unter den Teig heben.',
    },
    {
      text: 'Butter in einer großen Pfanne schmelzen, Teig hineingießen und bei mittlerer Hitze 5 Minuten stocken lassen. Wenden und mit zwei Gabeln in Stücke reißen.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: 'Schmelzen', note: 'Butter' },
        { device: 'bora', mode: 'Kochzone', level: '4', minutes: 7, note: 'Deckel drauf' },
      ],
    },
    {
      text: 'Mit etwas Butter und Zucker karamellisieren lassen, mit Puderzucker bestäuben und mit Apfelmus servieren.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '5', minutes: 3, note: 'karamellisieren' }],
    },
  ],

  pannfisch: [
    {
      text: 'Die Kartoffeln mit Schale im CombiSteamer als Pellkartoffeln dämpfen, pellen und in Scheiben schneiden.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 35, note: 'gelocht' }],
    },
    {
      text: 'Die Zwiebel würfeln. Die Kartoffelscheiben im Butterschmalz goldbraun braten, dabei nur ab und zu wenden, und die Zwiebel die letzten Minuten mitbraten.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '6', minutes: 12, note: 'Pfanne vorheizen' }],
    },
    {
      text: 'Den Seelachs in Stücke schneiden, mit Zitrone beträufeln, salzen, mehlieren (in Mehl wenden, überschüssiges abklopfen) und in einer zweiten Pfanne in Butterschmalz goldbraun braten.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '6', minutes: 6, note: 'zweite Zone' }],
    },
    {
      text: 'Fond, Sahne und Senf aufkochen, sämig einkochen und Dill einrühren.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '5', minutes: 6 }],
    },
    {
      text: 'Fisch und Kartoffeln in der Pfanne anrichten und mit Senfsauce servieren.',
    },
  ],

  gruenkohl: [
    {
      text: 'Grünkohl von den Strünken zupfen, gründlich waschen, im CombiSteamer kurz vorgaren (blanchieren), bis er zusammenfällt, und grob hacken.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 5, note: 'gelocht' }],
    },
    {
      text: 'Zwiebeln würfeln und im Schweineschmalz andünsten, Grünkohl und Brühe zugeben, aufkochen und 1 Stunde zugedeckt schmoren.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: '4', minutes: 4, note: 'Zwiebeln' },
        { device: 'bora', mode: 'Kochzone', level: '8', minutes: 3, note: 'aufkochen' },
        { device: 'bora', mode: 'Kochzone', level: '3', minutes: 60, note: 'Deckel drauf' },
      ],
    },
    {
      text: 'Kasseler und Pinkel auf den Kohl legen und weitere 45 Minuten mitgaren. Mit Haferflocken binden und mit Senf, Salz, Pfeffer und einer Prise Zucker abschmecken.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '3', minutes: 45, note: 'Deckel drauf' }],
    },
    {
      text: 'In den letzten 30 Minuten die Kartoffeln schälen (kleine ganz lassen, große halbieren) und im CombiSteamer dämpfen. Den restlichen Zucker in einer Pfanne hellbraun schmelzen lassen, die gut abgetropften Kartoffeln darin schwenken, bis sie rundum glänzend überzogen sind, und dazu servieren.',
      settings: [
        { device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 25, note: 'gelocht' },
        { device: 'bora', mode: 'Kochzone', level: '5', minutes: 5, note: 'karamellisieren' },
      ],
    },
  ],

  'schaschlik-pfanne': [
    {
      text: 'Fleisch, Paprika, Zwiebeln und Bacon in mundgerechte Stücke schneiden.',
    },
    {
      text: 'Fleisch und Bacon im Öl scharf anbraten, Gemüse zugeben und 5 Minuten mitbraten. Dabei den Abzug eine Stufe höher stellen.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: '8', minutes: 6, note: 'Pfanne vorheizen' },
        { device: 'bora', mode: 'Kochzone', level: '6', minutes: 5, note: 'Gemüse' },
      ],
    },
    {
      text: 'Tomatenmark und Paprikapulver kurz anrösten, dann passierte Tomaten, Brühe, Tomatenketchup und Worcestersauce zugeben. Mit Deckel 30 Minuten schmoren lassen.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: '6', minutes: 1, note: 'anrösten' },
        { device: 'bora', mode: 'Kochzone', level: '3', minutes: 30, note: 'Deckel drauf' },
      ],
    },
    {
      text: 'Während es schmort, den Wasserbehälter des CombiSteamers füllen. Den Reis mit der 1,5-fachen Menge Wasser und Salz in einer flachen Schale auf dem gelochten Garbehälter dämpfen.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 22, note: 'Schale' }],
    },
    {
      text: 'Kräftig abschmecken und mit Reis servieren.',
    },
  ],

  'ragout-fin': [
    {
      text: 'Das Hähnchen in einer Schale mit der Brühe im CombiSteamer gar ziehen lassen. Den Kerntemperaturfühler in die dickste Stelle stecken. Dann klein würfeln.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 15, core: 72, note: 'Schale' }],
    },
    {
      text: 'Butter schmelzen, Mehl anschwitzen, mit Brühe, Wein und Sahne aufgießen und 5 Minuten köcheln lassen. Champignons fein würfeln und mitgaren.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: 'Schmelzen', note: 'Butter' },
        { device: 'bora', mode: 'Kochzone', level: '4', minutes: 7 },
      ],
    },
    {
      text: 'Den Topf von der Zone nehmen und das Eigelb einrühren, danach darf die Sauce nicht mehr kochen, sonst gerinnt es. Mit Zitrone, Worcestersauce, Salz und Pfeffer abschmecken. Fleisch zugeben.',
    },
    {
      text: 'In ofenfeste Förmchen füllen, mit Käse bestreuen und im Combair kurz gratinieren, bis der Käse goldbraun ist. Das Toastbrot toasten und mit Zitronenspalten dazu servieren.',
      settings: [{ device: 'combair', mode: 'Grill', minutes: 4, note: 'Stufe 3 (stark), Ebene 3, 3 Min. vorheizen' }],
    },
  ],
}
