import { r } from './define'

// Asiatische Küche (Schwerpunkt China) – alle Mengen für 2 Portionen
export const recipesAs = [
  // ───────────── China ─────────────
  r('gong-bao', 'Gong Bao Hühnchen (Kung Pao) mit Erdnüssen', 'as', 'haupt', 30,
    '350 g Hähnchenbrustfilet | 60 g Erdnüsse geröstet | 8 Stk Chili getrocknet | 1 TL Szechuanpfeffer | 3 Stk Frühlingszwiebel | 2 Zehe Knoblauch | 15 g Ingwer | 3 EL Sojasauce | 1 EL Chinkiang-Essig | 1 EL Shaoxing-Reiswein | 1 TL Zucker | 2 TL Speisestärke | 2 EL Sonnenblumenöl | 150 g Jasminreis',
    [
      'Hähnchen in 1,5 cm große Würfel schneiden und mit 1 EL Sojasauce, Reiswein und 1 TL Stärke marinieren.',
      'Für die Sauce 2 EL Sojasauce, Essig, Zucker, 1 TL Stärke und 3 EL Wasser verrühren. Reis kochen.',
      'Öl im Wok erhitzen, Chilis und Szechuanpfeffer kurz anrösten, bis sie duften. Hähnchen zugeben und unter Rühren braten.',
      'Knoblauch, Ingwer und Frühlingszwiebel zugeben, Sauce angießen und kurz eindicken. Erdnüsse unterheben und mit Reis servieren.',
    ], 'Kung Pao chicken'),

  r('mapo-tofu', 'Mapo Tofu', 'as', 'haupt', 25,
    '400 g Tofu seiden | 150 g Schweinehackfleisch | 2 EL Doubanjiang | 1 EL Fermentierte schwarze Bohnen | 1 TL Szechuanpfeffer | 2 Zehe Knoblauch | 15 g Ingwer | 2 Stk Frühlingszwiebel | 200 ml Hühnerbrühe | 1 EL Sojasauce | 2 TL Speisestärke | 2 EL Sonnenblumenöl | 150 g Jasminreis',
    [
      'Tofu in Würfel schneiden und 2 Minuten in leicht gesalzenem, siedendem Wasser ziehen lassen. Abgießen. Reis kochen.',
      'Hack im Öl knusprig braten. Doubanjiang, schwarze Bohnen, Knoblauch und Ingwer zugeben und braten, bis das Öl rot wird.',
      'Brühe und Sojasauce angießen, Tofu vorsichtig zugeben und 5 Minuten köcheln lassen. Mit angerührter Stärke binden.',
      'Szechuanpfeffer rösten, mörsern und mit Frühlingszwiebeln darüber streuen. Mit Reis servieren.',
    ], 'Mapo tofu'),

  r('gu-lao-rou', 'Schweinefleisch süß-sauer (Gu Lao Rou)', 'as', 'haupt', 40,
    '350 g Schweinenacken | 1 Stk Paprika rot | 1 Stk Paprika grün | 1 Stk Zwiebel | 150 g Ananas | 1 Stk Ei | 4 EL Speisestärke | 3 EL Tomatenketchup | 2 EL Reisessig | 2 EL Zucker | 1 EL Sojasauce | 500 ml Frittieröl | 150 g Jasminreis | Salz',
    [
      'Fleisch in mundgerechte Stücke schneiden, mit Salz und Ei mischen und in Stärke wenden.',
      'Im 175 °C heißen Öl 4 Minuten frittieren, herausnehmen und nochmals 1 Minute knusprig frittieren. Reis kochen.',
      'Ketchup, Essig, Zucker, Sojasauce, 1 TL Stärke und 4 EL Wasser verrühren.',
      'Paprika, Zwiebel und Ananas im Wok kurz pfannenrühren, Sauce zugeben und eindicken. Fleisch unterheben und sofort servieren.',
    ], 'Sweet and sour pork'),

  r('yangzhou-reis', 'Gebratener Reis Yangzhou-Art', 'as', 'haupt', 25,
    '150 g Jasminreis | 3 Stk Ei | 100 g Kochschinken | 150 g Garnelen roh TK | 80 g Erbsen TK | 3 Stk Frühlingszwiebel | 2 EL Sojasauce | 2 EL Sonnenblumenöl | Salz | Pfeffer weiß',
    [
      'Reis am besten am Vortag kochen und kalt stellen. Dann mit den Fingern auflockern.',
      'Eier im heißen Wok in 1 EL Öl zu Rührei braten und herausnehmen. Garnelen kurz anbraten.',
      'Restliches Öl erhitzen und den Reis bei hoher Hitze unter ständigem Rühren braten, bis er springt.',
      'Schinkenwürfel, Erbsen, Garnelen und Ei zugeben. Mit Sojasauce, Salz und weißem Pfeffer würzen und mit Frühlingszwiebeln servieren.',
    ], 'Yangzhou fried rice'),

  r('chow-mein', 'Chow Mein mit Hähnchen und Gemüse', 'as', 'haupt', 25,
    '250 g Mie-Nudeln | 250 g Hähnchenbrustfilet | 150 g Sojasprossen | 1 Stk Möhre | 100 g Chinakohl | 3 Stk Frühlingszwiebel | 2 Zehe Knoblauch | 2 EL Sojasauce | 1 EL Sojasauce dunkel | 1 EL Austernsauce | 1 TL Sesamöl | 2 EL Sonnenblumenöl | 1 TL Speisestärke',
    [
      'Nudeln nach Packungsanweisung garen, abschrecken und mit etwas Öl mischen.',
      'Hähnchen in Streifen schneiden und mit 1 EL Sojasauce und Stärke marinieren.',
      'Im heißen Wok Hähnchen braten, dann Knoblauch, Möhrenstreifen und Kohl zugeben.',
      'Nudeln, Sprossen und alle Saucen zugeben und kräftig durchschwenken. Mit Sesamöl und Frühlingszwiebeln servieren.',
    ], 'Chow mein'),

  r('rind-brokkoli', 'Rindfleisch mit Brokkoli in Austernsauce', 'as', 'haupt', 25,
    '300 g Rinderhüfte | 400 g Brokkoli | 2 Zehe Knoblauch | 15 g Ingwer | 3 EL Austernsauce | 1 EL Sojasauce | 1 EL Shaoxing-Reiswein | 1 TL Zucker | 2 TL Speisestärke | 2 EL Sonnenblumenöl | 150 g Jasminreis',
    [
      'Rindfleisch quer zur Faser in dünne Scheiben schneiden. Mit Sojasauce, Reiswein und 1 TL Stärke marinieren. Reis kochen.',
      'Brokkoli in Röschen teilen und 1 Minute blanchieren.',
      'Fleisch im sehr heißen Wok 1 Minute scharf anbraten und herausnehmen. Knoblauch, Ingwer und Brokkoli braten.',
      'Fleisch, Austernsauce, Zucker und 1 TL angerührte Stärke zugeben, kurz eindicken und mit Reis servieren.',
    ], 'Beef and broccoli'),

  r('hui-guo-rou', 'Twice Cooked Pork (Hui Guo Rou)', 'as', 'haupt', 50,
    '400 g Schweinebauch | 1 Stk Spitzpaprika grün | 8 Stk Frühlingszwiebel | 2 EL Doubanjiang | 1 EL Fermentierte schwarze Bohnen | 1 EL Shaoxing-Reiswein | 1 TL Zucker | 15 g Ingwer | 1 EL Sonnenblumenöl | 150 g Jasminreis',
    [
      'Schweinebauch mit Ingwer in Wasser 20 Minuten köcheln lassen, abkühlen lassen und in hauchdünne Scheiben schneiden.',
      'Im Wok mit wenig Öl braten, bis sich die Scheiben wölben und das Fett austritt.',
      'Doubanjiang und schwarze Bohnen zugeben und braten, bis das Öl rot wird.',
      'Paprika und Lauchzwiebeln in Stücken, Reiswein und Zucker zugeben und kurz pfannenrühren. Mit Reis servieren.',
    ], 'Twice cooked pork'),

  r('tomaten-ei', 'Tomaten mit Rührei (Xihongshi Chao Jidan)', 'as', 'haupt', 15,
    '4 Stk Ei | 4 Stk Tomate | 2 Stk Frühlingszwiebel | 1 TL Zucker | 1 EL Tomatenketchup | 2 EL Sonnenblumenöl | 150 g Jasminreis | Salz',
    [
      'Reis kochen. Eier mit einer Prise Salz verquirlen. Tomaten in Spalten schneiden.',
      'Eier im heißen Öl zu großen, weichen Flocken stocken lassen und herausnehmen.',
      'Tomaten im Wok braten, bis sie Saft ziehen. Zucker, Ketchup und Salz zugeben.',
      'Eier zurückgeben, kurz durchschwenken und mit Frühlingszwiebeln und Reis servieren. Das chinesische Hausmannsgericht schlechthin.',
    ], 'Tomato egg stir fry'),

  r('yu-xiang-qiezi', 'Fischduftende Auberginen (Yu Xiang Qiezi)', 'as', 'haupt', 30,
    '2 Stk Aubergine | 100 g Schweinehackfleisch | 2 EL Doubanjiang | 3 Zehe Knoblauch | 15 g Ingwer | 3 Stk Frühlingszwiebel | 2 EL Chinkiang-Essig | 1 EL Sojasauce | 1 EL Zucker | 1 TL Speisestärke | 4 EL Sonnenblumenöl | 150 g Jasminreis',
    [
      'Auberginen in fingerdicke Stifte schneiden, salzen und 15 Minuten ziehen lassen. Trocken tupfen und im Öl weich braten. Herausnehmen.',
      'Essig, Sojasauce, Zucker, Stärke und 4 EL Wasser verrühren. Reis kochen.',
      'Hack anbraten, Doubanjiang, Knoblauch und Ingwer zugeben und braten, bis es duftet.',
      'Auberginen und Sauce zugeben, kurz eindicken und mit Frühlingszwiebeln und Reis servieren.',
    ], 'Yuxiang eggplant'),

  r('dan-dan-mian', 'Dan Dan Nudeln', 'as', 'haupt', 25,
    '250 g Weizennudeln asiatisch | 150 g Schweinehackfleisch | 2 EL Sesampaste | 3 EL Sojasauce | 1 EL Chinkiang-Essig | 2 EL Chiliöl | 1 TL Szechuanpfeffer | 2 Zehe Knoblauch | 200 g Pak Choi | 2 EL Erdnüsse geröstet | 2 Stk Frühlingszwiebel | 1 EL Zucker | 1 EL Sonnenblumenöl',
    [
      'Hack im Öl knusprig braten und mit 1 EL Sojasauce würzen.',
      'Sesampaste, restliche Sojasauce, Essig, Chiliöl, Zucker, Knoblauch und gemörserten Szechuanpfeffer zu einer Sauce verrühren und auf zwei Schüsseln verteilen.',
      'Nudeln kochen und den Pak Choi in den letzten Minuten mitgaren.',
      'Nudeln mit etwas Kochwasser auf die Sauce geben. Hack, gehackte Erdnüsse und Frühlingszwiebeln darauf verteilen und vor dem Essen alles vermengen.',
    ], 'Dan dan noodles'),

  r('cashew-huhn', 'Hühnchen mit Cashewkernen', 'as', 'haupt', 25,
    '350 g Hähnchenbrustfilet | 80 g Cashewkerne | 1 Stk Paprika rot | 1 Stk Zwiebel | 2 Zehe Knoblauch | 3 EL Sojasauce | 2 EL Austernsauce | 1 EL Shaoxing-Reiswein | 2 TL Speisestärke | 2 EL Sonnenblumenöl | 150 g Jasminreis',
    [
      'Hähnchen würfeln und mit 1 EL Sojasauce, Reiswein und 1 TL Stärke marinieren. Reis kochen.',
      'Cashews ohne Fett goldbraun rösten.',
      'Hähnchen im heißen Wok braten. Paprika, Zwiebel und Knoblauch zugeben.',
      'Sojasauce, Austernsauce und 1 TL angerührte Stärke zugeben und kurz eindicken. Cashews unterheben.',
    ], 'Cashew chicken'),

  r('char-siu', 'Char Siu (Kantonesischer BBQ-Schweinenacken) mit Reis', 'as', 'haupt', 60,
    '500 g Schweinenacken | 3 EL Hoisinsauce | 2 EL Sojasauce | 2 EL Honig | 1 EL Shaoxing-Reiswein | 1 TL Fünf-Gewürze-Pulver | 2 Zehe Knoblauch | 200 g Pak Choi | 1 EL Austernsauce | 150 g Jasminreis',
    [
      'Fleisch längs in 2 dicke Streifen schneiden. Hoisinsauce, Sojasauce, 1 EL Honig, Reiswein, Fünf-Gewürze und Knoblauch verrühren und das Fleisch darin mindestens 2 Stunden (besser über Nacht) marinieren.',
      'Auf einem Gitter über einem Blech mit Wasser bei 200 °C 35 Minuten rösten und mehrmals mit Marinade bestreichen.',
      'Mit restlichem Honig bestreichen und unter dem Grill 3 Minuten karamellisieren.',
      'In Scheiben schneiden und mit Reis und blanchiertem Pak Choi mit Austernsauce servieren.',
    ], 'Char siu'),

  r('hong-shao-rou', 'Rotgeschmorter Schweinebauch (Hong Shao Rou)', 'as', 'haupt', 100,
    '500 g Schweinebauch | 30 g Kandiszucker | 3 EL Shaoxing-Reiswein | 2 EL Sojasauce | 1 EL Sojasauce dunkel | 2 Stk Sternanis | 1 Stk Zimtstange | 20 g Ingwer | 3 Stk Frühlingszwiebel | 1 EL Sonnenblumenöl | 150 g Jasminreis',
    [
      'Schweinebauch in 3 cm große Würfel schneiden, kurz blanchieren und abtropfen lassen.',
      'Öl und Kandiszucker im Wok erhitzen, bis der Zucker karamellisiert. Fleisch darin rundum glasieren.',
      'Reiswein, Sojasaucen, Gewürze, Ingwer, Frühlingszwiebeln und so viel heißes Wasser zugeben, dass das Fleisch knapp bedeckt ist. Zugedeckt 75 Minuten schmoren.',
      'Ohne Deckel einkochen, bis die Sauce glänzend am Fleisch haftet. Mit Reis servieren.',
    ], 'Hong shao rou'),

  r('jiaozi', 'Jiaozi – Chinesische Teigtaschen mit Schweinefleisch und Chinakohl', 'as', 'haupt', 75,
    '30 Stk Jiaozi-Teigblätter TK | 250 g Schweinehackfleisch | 200 g Chinakohl | 3 Stk Frühlingszwiebel | 15 g Ingwer | 2 EL Sojasauce | 1 TL Sesamöl | 1 EL Shaoxing-Reiswein | 3 EL Chinkiang-Essig | 1 EL Chiliöl | Salz',
    [
      'Chinakohl fein hacken, salzen, 10 Minuten ziehen lassen und kräftig ausdrücken.',
      'Hack mit Kohl, Frühlingszwiebeln, Ingwer, Sojasauce, Sesamöl, Reiswein und 2 EL Wasser in eine Richtung rühren, bis die Masse bindet.',
      'Je 1 TL Füllung auf ein Teigblatt geben, den Rand befeuchten, zu einem Halbmond falten und die Ränder in Falten andrücken.',
      'In kochendem Wasser garen, bis sie schwimmen, dann noch 3 Minuten. Mit einem Dip aus Essig und Chiliöl servieren.',
    ], 'Jiaozi'),

  r('zhajiangmian', 'Zhajiangmian (Pekinger Nudeln mit Fleischsauce)', 'as', 'haupt', 30,
    '250 g Weizennudeln asiatisch | 250 g Schweinehackfleisch | 3 EL Sojabohnenpaste gelb | 1 EL Hoisinsauce | 1 EL Sojasauce | 1 TL Zucker | 1 Stk Salatgurke | 100 g Sojasprossen | 2 Zehe Knoblauch | 1 EL Sonnenblumenöl',
    [
      'Hack im Öl braten, bis es Farbe hat. Knoblauch zugeben.',
      'Sojabohnenpaste, Hoisinsauce, Sojasauce, Zucker und 100 ml Wasser zugeben und 10 Minuten dicklich einkochen.',
      'Nudeln kochen. Sprossen kurz blanchieren und die Gurke in feine Stifte schneiden.',
      'Nudeln mit Sauce, Gurke und Sprossen anrichten und am Tisch vermengen.',
    ], 'Zhajiangmian'),

  r('ingwer-huhn', 'Hähnchen mit Ingwer und Frühlingszwiebeln', 'as', 'haupt', 25,
    '400 g Hähnchenschenkelfilet | 40 g Ingwer | 5 Stk Frühlingszwiebel | 2 EL Sojasauce | 1 EL Austernsauce | 1 EL Shaoxing-Reiswein | 1 TL Zucker | 1 TL Speisestärke | 2 EL Sonnenblumenöl | 150 g Jasminreis',
    [
      'Hähnchen in Stücke schneiden und mit 1 EL Sojasauce, Reiswein und Stärke marinieren. Reis kochen.',
      'Ingwer in feine Streifen, Frühlingszwiebeln in 4 cm lange Stücke schneiden.',
      'Ingwer im heißen Öl anbraten, Hähnchen zugeben und goldbraun braten.',
      'Frühlingszwiebeln, restliche Sojasauce, Austernsauce, Zucker und 3 EL Wasser zugeben und kurz glasieren.',
    ], 'Ginger scallion chicken'),

  r('pfeffer-rind', 'Rindfleisch mit schwarzem Pfeffer', 'as', 'haupt', 25,
    '300 g Rinderhüfte | 1 Stk Paprika grün | 1 Stk Zwiebel | 2 TL Pfeffer schwarz grob | 2 EL Austernsauce | 1 EL Sojasauce | 1 EL Sojasauce dunkel | 1 EL Shaoxing-Reiswein | 1 TL Zucker | 2 TL Speisestärke | 2 EL Sonnenblumenöl | 150 g Jasminreis',
    [
      'Rind in Streifen schneiden und mit Sojasauce, Reiswein und 1 TL Stärke marinieren. Reis kochen.',
      'Im sehr heißen Wok scharf anbraten und herausnehmen.',
      'Zwiebel und Paprika braten, dann den grob gestoßenen Pfeffer kurz mitrösten.',
      'Fleisch, Austernsauce, dunkle Sojasauce, Zucker und 1 TL angerührte Stärke zugeben und glasieren.',
    ], 'Black pepper beef'),

  r('gedaempfter-fisch', 'Gedämpfter Fisch mit Ingwer und Frühlingszwiebeln', 'as', 'haupt', 25,
    '2 Stk Doradenfilet | 30 g Ingwer | 4 Stk Frühlingszwiebel | 3 EL Sojasauce | 1 TL Zucker | 3 EL Sonnenblumenöl | 0.5 Bund Koriander | 200 g Pak Choi | 150 g Jasminreis',
    [
      'Ingwer und Frühlingszwiebeln in feine Streifen schneiden. Reis kochen.',
      'Fisch auf einen Teller legen, mit der Hälfte des Ingwers belegen und über Wasserdampf 8 Minuten dämpfen. Pak Choi mitdämpfen.',
      'Flüssigkeit abgießen. Sojasauce mit Zucker und 2 EL Wasser erwärmen und über den Fisch geben. Mit restlichem Ingwer und Frühlingszwiebeln belegen.',
      'Öl stark erhitzen und zischend darüber gießen. Mit Koriander servieren.',
    ], 'Steamed fish ginger scallion'),

  r('gan-bian-dou', 'Trocken gebratene grüne Bohnen nach Szechuan-Art', 'as', 'haupt', 25,
    '400 g Grüne Bohnen | 120 g Schweinehackfleisch | 4 Stk Chili getrocknet | 1 TL Szechuanpfeffer | 3 Zehe Knoblauch | 15 g Ingwer | 1 EL Sojasauce | 1 EL Shaoxing-Reiswein | 1 TL Zucker | 4 EL Sonnenblumenöl | 150 g Jasminreis | Salz',
    [
      'Bohnen putzen und gut trocknen. Reis kochen.',
      'Bohnen im Öl bei mittlerer Hitze 8 Minuten braten, bis sie schrumpelig sind und Blasen werfen. Herausnehmen.',
      'Hack mit Chili, Szechuanpfeffer, Knoblauch und Ingwer knusprig braten.',
      'Bohnen zurückgeben und mit Sojasauce, Reiswein, Zucker und Salz durchschwenken.',
    ], 'Dry fried green beans'),

  r('pak-choi-shiitake', 'Pak Choi mit Shiitake und Tofu in Austernsauce', 'as', 'haupt', 20,
    '400 g Pak Choi | 150 g Shiitake | 200 g Tofu natur | 3 Zehe Knoblauch | 3 EL Austernsauce | 1 EL Sojasauce | 1 TL Sesamöl | 1 TL Speisestärke | 2 EL Sonnenblumenöl | 150 g Jasminreis',
    [
      'Tofu würfeln und im Öl goldbraun braten. Herausnehmen. Reis kochen.',
      'Shiitake in Scheiben und Knoblauch braten.',
      'Pak Choi halbiert zugeben und 2 Minuten braten.',
      'Tofu, Austernsauce, Sojasauce und angerührte Stärke zugeben, kurz eindicken und mit Sesamöl beträufeln.',
    ], 'Bok choy shiitake'),

  r('zitronen-huhn', 'Knuspriges Zitronenhähnchen nach Kantoner Art', 'as', 'haupt', 35,
    '350 g Hähnchenbrustfilet | 1 Stk Ei | 5 EL Speisestärke | 2 Stk Zitrone | 3 EL Zucker | 1 EL Sojasauce | 500 ml Frittieröl | 2 Stk Frühlingszwiebel | 150 g Jasminreis | Salz',
    [
      'Hähnchen in Streifen schneiden, salzen, durch Ei ziehen und in 4 EL Stärke wenden.',
      'Im 175 °C heißen Öl goldbraun und knusprig frittieren. Reis kochen.',
      'Saft der Zitronen mit Zucker, Sojasauce, 50 ml Wasser und 1 EL Stärke aufkochen, bis die Sauce glasig eindickt.',
      'Hähnchen mit Sauce übergießen und mit Zitronenscheiben und Frühlingszwiebeln servieren.',
    ], 'Lemon chicken'),

  r('cola-wings', 'Cola-Hähnchenflügel (Ke Le Ji Chi)', 'as', 'haupt', 35,
    '800 g Hähnchenflügel | 330 ml Cola | 3 EL Sojasauce | 1 EL Sojasauce dunkel | 20 g Ingwer | 2 Stk Sternanis | 2 Stk Frühlingszwiebel | 1 EL Sonnenblumenöl | 150 g Jasminreis',
    [
      'Flügel am Gelenk teilen und im Öl von beiden Seiten goldbraun braten.',
      'Ingwer und Sternanis kurz mitbraten.',
      'Cola und Sojasaucen zugeben und 20 Minuten offen köcheln lassen.',
      'Bei hoher Hitze einkochen, bis die Sauce klebrig glänzt. Mit Frühlingszwiebeln und Reis servieren.',
    ], 'Cola chicken wings'),

  r('lu-rou-fan', 'Lu Rou Fan (Taiwanesischer Schweinebauch-Reis)', 'as', 'haupt', 90,
    '400 g Schweinebauch | 6 Stk Schalotte | 3 EL Sojasauce | 1 EL Sojasauce dunkel | 2 EL Shaoxing-Reiswein | 20 g Kandiszucker | 1 TL Fünf-Gewürze-Pulver | 2 Stk Ei | 200 g Pak Choi | 1 EL Sonnenblumenöl | 150 g Jasminreis',
    [
      'Schweinebauch in kleine Würfel schneiden. Schalotten in Ringe schneiden und im Öl knusprig braten.',
      'Fleisch zugeben und anbraten, bis das Fett austritt.',
      'Sojasaucen, Reiswein, Zucker, Gewürze und 400 ml Wasser zugeben. Die Eier hart kochen, pellen und zum Fleisch geben. Zugedeckt 60 Minuten schmoren.',
      'Über Reis geben und mit halbierten Schmor-Eiern und blanchiertem Pak Choi servieren.',
    ], 'Lu rou fan'),

  // ───────────── China – Suppen ─────────────
  r('suan-la-tang', 'Scharf-saure Suppe (Suan La Tang)', 'as', 'suppe', 30,
    '800 ml Hühnerbrühe | 100 g Schweineschnitzel | 150 g Tofu natur | 30 g Mu-Err-Pilze getrocknet | 50 g Bambussprossen | 1 Stk Ei | 3 EL Chinkiang-Essig | 2 EL Sojasauce | 1 TL Pfeffer weiß | 1 TL Chiliöl | 2 EL Speisestärke | 2 Stk Frühlingszwiebel',
    [
      'Pilze einweichen und in Streifen schneiden. Fleisch, Tofu und Bambus in feine Streifen schneiden.',
      'Brühe aufkochen, Fleisch, Pilze und Bambus 5 Minuten garen, dann den Tofu zugeben.',
      'Mit Sojasauce, Essig und weißem Pfeffer kräftig abschmecken. Mit angerührter Stärke binden.',
      'Das verquirlte Ei in dünnem Strahl einrühren, so dass Flocken entstehen. Mit Chiliöl und Frühlingszwiebeln servieren.',
    ], 'Hot and sour soup'),

  r('wan-tan-suppe', 'Wan-Tan-Suppe', 'as', 'suppe', 45,
    '20 Stk Wan-Tan-Teigblätter TK | 200 g Schweinehackfleisch | 100 g Garnelen roh TK | 2 Stk Frühlingszwiebel | 15 g Ingwer | 2 EL Sojasauce | 1 TL Sesamöl | 800 ml Hühnerbrühe | 200 g Pak Choi | Pfeffer weiß',
    [
      'Hack mit gehackten Garnelen, Frühlingszwiebel, Ingwer, 1 EL Sojasauce und Sesamöl verrühren.',
      'Je 1 TL Füllung auf ein Teigblatt setzen, den Rand befeuchten und zu kleinen Säckchen zusammendrücken.',
      'Brühe mit restlicher Sojasauce und weißem Pfeffer aufkochen. Pak Choi darin 2 Minuten garen.',
      'Wan Tans in separatem Wasser 4 Minuten garen und in die Brühe geben.',
    ], 'Wonton soup'),

  r('mais-suppe', 'Chinesische Hühner-Mais-Suppe', 'as', 'suppe', 20,
    '800 ml Hühnerbrühe | 200 g Hähnchenbrustfilet | 1 Dose Rahmmais | 1 Dose Mais | 2 Stk Ei | 15 g Ingwer | 2 EL Speisestärke | 1 TL Sesamöl | 2 Stk Frühlingszwiebel | Salz | Pfeffer weiß',
    [
      'Hähnchen fein hacken.',
      'Brühe mit Ingwer aufkochen, Hähnchen und beide Maissorten zugeben und 5 Minuten köcheln lassen.',
      'Mit angerührter Stärke binden und mit Salz und weißem Pfeffer würzen.',
      'Verquirlte Eier einlaufen lassen und mit Sesamöl und Frühlingszwiebeln servieren.',
    ], 'Chicken corn soup'),

  r('niu-rou-mian', 'Geschmorte Rindfleisch-Nudelsuppe (Hong Shao Niu Rou Mian)', 'as', 'suppe', 150,
    '500 g Rinderbeinscheibe | 2 EL Doubanjiang | 20 g Ingwer | 3 Zehe Knoblauch | 2 Stk Sternanis | 1 Stk Zimtstange | 3 EL Sojasauce | 1 EL Sojasauce dunkel | 2 EL Shaoxing-Reiswein | 1 Stk Tomate | 250 g Weizennudeln asiatisch | 200 g Pak Choi | 2 Stk Frühlingszwiebel | 1 EL Sonnenblumenöl',
    [
      'Rindfleisch in große Würfel schneiden, kurz blanchieren und abspülen.',
      'Doubanjiang, Ingwer und Knoblauch im Öl rösten. Fleisch, Gewürze, Saucen, Reiswein, Tomate und 1,5 l Wasser zugeben.',
      'Zugedeckt 2 Stunden schmoren, bis das Fleisch zart ist.',
      'Nudeln und Pak Choi separat garen, in Schüsseln geben, mit Brühe und Fleisch übergießen und mit Frühlingszwiebeln bestreuen.',
    ], 'Beef noodle soup'),

  // ───────────── Thailand ─────────────
  r('pad-thai', 'Pad Thai mit Garnelen', 'as', 'haupt', 30,
    '200 g Reisbandnudeln | 200 g Garnelen roh TK | 100 g Tofu natur | 2 Stk Ei | 150 g Sojasprossen | 3 Stk Frühlingszwiebel | 2 Zehe Knoblauch | 3 EL Tamarindenpaste | 2 EL Fischsauce | 2 EL Palmzucker | 50 g Erdnüsse geröstet | 1 Stk Limette | 2 EL Sonnenblumenöl | Chiliflocken',
    [
      'Nudeln 20 Minuten in lauwarmem Wasser einweichen. Tamarinde, Fischsauce und Zucker verrühren.',
      'Tofuwürfel und Knoblauch im heißen Öl braten. Garnelen zugeben.',
      'Nudeln und Sauce zugeben und braten, bis die Nudeln weich sind. Zur Seite schieben, die Eier in die Pfanne schlagen, stocken lassen und unterheben.',
      'Sprossen und Frühlingszwiebeln untermischen. Mit Erdnüssen, Limette und Chiliflocken servieren.',
    ], 'Pad thai'),

  r('gruenes-curry', 'Grünes Thai-Curry mit Hähnchen', 'as', 'haupt', 30,
    '350 g Hähnchenbrustfilet | 400 ml Kokosmilch | 2 EL Currypaste grün | 1 Stk Aubergine | 100 g Zuckerschoten | 2 EL Fischsauce | 1 EL Palmzucker | 4 Blatt Kaffirlimettenblätter | 1 Bund Thai-Basilikum | 150 g Jasminreis',
    [
      'Den dicken Teil der Kokosmilch mit der Currypaste im Wok einkochen, bis sich das Öl trennt.',
      'Hähnchen in Streifen zugeben und rundum anbraten.',
      'Restliche Kokosmilch, Aubergine in Würfeln und Limettenblätter zugeben und 10 Minuten köcheln lassen. Zuckerschoten 2 Minuten mitgaren.',
      'Mit Fischsauce und Palmzucker abschmecken, Basilikum unterziehen und mit Reis servieren.',
    ], 'Green curry chicken'),

  r('rotes-curry', 'Rotes Thai-Curry mit Garnelen und Ananas', 'as', 'haupt', 25,
    '300 g Garnelen roh TK | 400 ml Kokosmilch | 2 EL Currypaste rot | 150 g Ananas | 1 Stk Paprika rot | 100 g Bambussprossen | 2 EL Fischsauce | 1 EL Palmzucker | 4 Blatt Kaffirlimettenblätter | 1 Bund Thai-Basilikum | 150 g Jasminreis',
    [
      'Currypaste mit etwas Kokosmilch anrösten, bis sie duftet.',
      'Restliche Kokosmilch, Limettenblätter, Paprika, Bambus und Ananas zugeben und 8 Minuten köcheln lassen.',
      'Garnelen zugeben und 3 Minuten gar ziehen lassen.',
      'Mit Fischsauce und Zucker abschmecken, Basilikum zugeben und mit Reis servieren.',
    ], 'Red curry prawns'),

  r('tom-kha-gai', 'Tom Kha Gai (Kokos-Hühnersuppe)', 'as', 'suppe', 30,
    '250 g Hähnchenbrustfilet | 400 ml Kokosmilch | 400 ml Hühnerbrühe | 2 Stk Zitronengras | 30 g Galgant | 4 Blatt Kaffirlimettenblätter | 150 g Champignons | 3 EL Fischsauce | 2 Stk Limette | 1 TL Palmzucker | 2 Stk Chili rot | 0.5 Bund Koriander',
    [
      'Zitronengras andrücken und in Stücke schneiden, Galgant in Scheiben schneiden. Mit Limettenblättern in Brühe und Kokosmilch aufkochen.',
      'Hähnchen in dünnen Scheiben und Champignons zugeben und 10 Minuten sanft köcheln lassen.',
      'Vom Herd nehmen und mit Fischsauce, Limettensaft, Zucker und zerdrückten Chilis abschmecken.',
      'Mit Koriander servieren. Zitronengras und Galgant werden nicht mitgegessen.',
    ], 'Tom kha gai'),

  r('pad-kra-pao', 'Pad Kra Pao mit Spiegelei', 'as', 'haupt', 20,
    '300 g Hähnchenschenkelfilet | 4 Zehe Knoblauch | 4 Stk Chili rot | 1 Bund Thai-Basilikum | 2 EL Austernsauce | 1 EL Sojasauce | 1 EL Fischsauce | 1 TL Zucker | 2 Stk Ei | 3 EL Sonnenblumenöl | 150 g Jasminreis',
    [
      'Hähnchen grob hacken. Knoblauch und Chili im Mörser zerstoßen. Reis kochen.',
      'Spiegeleier in reichlich heißem Öl mit knusprigem Rand braten.',
      'Knoblauch und Chili kurz anbraten, Hähnchen zugeben und scharf braten.',
      'Saucen und Zucker zugeben, Basilikum unterheben und mit Reis und Spiegelei servieren.',
    ], 'Pad kra pao'),

  r('massaman', 'Massaman-Curry mit Rind und Kartoffeln', 'as', 'haupt', 120,
    '400 g Rindergulasch | 400 ml Kokosmilch | 3 EL Currypaste Massaman | 300 g Kartoffeln festkochend | 1 Stk Zwiebel | 40 g Erdnüsse geröstet | 2 EL Fischsauce | 1 EL Palmzucker | 2 EL Tamarindenpaste | 1 Stk Zimtstange | 150 g Jasminreis',
    [
      'Currypaste mit dem dicken Teil der Kokosmilch anrösten. Fleisch zugeben und anbraten.',
      'Restliche Kokosmilch, 200 ml Wasser und Zimt zugeben und zugedeckt 75 Minuten schmoren.',
      'Kartoffeln und Zwiebel in Stücken und die Erdnüsse zugeben und 25 Minuten garen.',
      'Mit Fischsauce, Zucker und Tamarinde süß-sauer-salzig abschmecken und mit Reis servieren.',
    ], 'Massaman curry'),

  // ───────────── Japan / Korea / Vietnam / Indonesien ─────────────
  r('teriyaki-huhn', 'Chicken Teriyaki mit Reis und Brokkoli', 'as', 'haupt', 25,
    '400 g Hähnchenschenkelfilet | 4 EL Sojasauce | 3 EL Mirin | 2 EL Sake | 1 EL Zucker | 300 g Brokkoli | 1 TL Sesam | 1 EL Sonnenblumenöl | 150 g Sushireis',
    [
      'Reis kochen. Sojasauce, Mirin, Sake und Zucker verrühren.',
      'Hähnchen mit der Hautseite nach unten im Öl knusprig braten, wenden und fertig garen.',
      'Überschüssiges Fett abgießen, Sauce zugeben und einkochen, bis das Fleisch glänzend glasiert ist.',
      'In Scheiben schneiden, mit Sesam bestreuen und mit Reis und gedämpftem Brokkoli servieren.',
    ], 'Chicken teriyaki'),

  r('shoyu-ramen', 'Shoyu Ramen mit Ei und Schweinebauch', 'as', 'suppe', 90,
    '300 g Schweinebauch | 1 l Hühnerbrühe | 5 EL Sojasauce | 2 EL Mirin | 20 g Ingwer | 2 Zehe Knoblauch | 2 Stk Ei | 250 g Ramen-Nudeln | 2 Stk Frühlingszwiebel | 2 Blatt Nori | 100 g Sojasprossen | 1 TL Sesamöl',
    [
      'Schweinebauch mit 3 EL Sojasauce, Mirin, Ingwer und 300 ml Wasser zugedeckt 60 Minuten schmoren. In Scheiben schneiden und den Schmorsud aufbewahren.',
      'Eier 6,5 Minuten kochen, abschrecken, pellen und 30 Minuten in etwas Schmorsud marinieren.',
      'Brühe mit Knoblauch, 2 EL Sojasauce und einem Schuss Schmorsud aufkochen.',
      'Nudeln kochen, in Schüsseln geben und mit Brühe übergießen. Mit Fleisch, halbierten Eiern, Sprossen, Frühlingszwiebeln, Nori und Sesamöl belegen.',
    ], 'Shoyu ramen'),

  r('yakisoba', 'Yakisoba mit Schweinefleisch und Kohl', 'as', 'haupt', 20,
    '300 g Yakisoba-Nudeln | 200 g Schweinebauch dünn geschnitten | 150 g Weißkohl | 1 Stk Möhre | 1 Stk Zwiebel | 4 EL Yakisoba-Sauce | 1 EL Sonnenblumenöl | 2 Stk Frühlingszwiebel | 1 TL Sesam',
    [
      'Fleisch in Stücke schneiden und im Öl knusprig braten.',
      'Zwiebel, Möhrenstreifen und Kohl zugeben und 3 Minuten braten.',
      'Nudeln mit einem Schuss Wasser zugeben und lockern.',
      'Sauce untermischen und mit Frühlingszwiebeln und Sesam servieren.',
    ], 'Yakisoba'),

  r('bibimbap', 'Bibimbap mit Rindfleisch und Gemüse', 'as', 'haupt', 40,
    '200 g Rinderhüfte | 150 g Sushireis | 200 g Blattspinat frisch | 1 Stk Möhre | 150 g Sojasprossen | 1 Stk Zucchini | 100 g Shiitake | 2 Stk Ei | 2 EL Gochujang | 3 EL Sojasauce | 1 EL Sesamöl | 1 TL Zucker | 2 Zehe Knoblauch | 1 TL Sesam | 2 EL Sonnenblumenöl',
    [
      'Reis kochen. Rind in dünne Streifen schneiden und mit 2 EL Sojasauce, Zucker, Knoblauch und Sesamöl marinieren.',
      'Gemüse jeweils separat zubereiten: Spinat und Sprossen blanchieren und mit Sesamöl und Salz würzen. Möhre, Zucchini und Shiitake in Streifen kurz anbraten.',
      'Fleisch scharf anbraten. Spiegeleier braten.',
      'Reis in Schüsseln geben, Gemüse und Fleisch darauf anrichten, Ei obenauf legen und mit Gochujang und Sesam servieren. Am Tisch alles vermengen.',
    ], 'Bibimbap'),

  r('bulgogi', 'Bulgogi (Koreanisches mariniertes Rindfleisch)', 'as', 'haupt', 30,
    '400 g Rinderhüfte | 1 Stk Birne | 4 EL Sojasauce | 1 EL Zucker | 1 EL Sesamöl | 3 Zehe Knoblauch | 15 g Ingwer | 1 Stk Zwiebel | 3 Stk Frühlingszwiebel | 1 TL Sesam | 1 Stk Kopfsalat | 1 EL Sonnenblumenöl | 150 g Sushireis',
    [
      'Rind hauchdünn schneiden (leicht angefroren geht es am besten).',
      'Birne, Knoblauch und Ingwer reiben und mit Sojasauce, Zucker und Sesamöl mischen. Fleisch und Zwiebelstreifen darin mindestens 30 Minuten marinieren.',
      'In einer sehr heißen Pfanne portionsweise scharf braten. Frühlingszwiebeln zugeben.',
      'Mit Sesam bestreuen und mit Reis und Salatblättern zum Einwickeln servieren.',
    ], 'Bulgogi'),

  r('pho-bo', 'Phở Bò (Vietnamesische Rindfleisch-Nudelsuppe)', 'as', 'suppe', 180,
    '500 g Suppenfleisch Rind | 1 Stk Markknochen | 200 g Rinderhüfte | 1 Stk Zwiebel | 40 g Ingwer | 3 Stk Sternanis | 1 Stk Zimtstange | 4 Stk Nelke | 3 EL Fischsauce | 1 EL Zucker | 200 g Reisbandnudeln | 150 g Sojasprossen | 1 Bund Thai-Basilikum | 0.5 Bund Koriander | 1 Stk Limette | 1 Stk Chili rot',
    [
      'Zwiebel und Ingwer halbieren und in einer Pfanne ohne Fett schwarz rösten. Gewürze kurz anrösten.',
      'Suppenfleisch und Knochen blanchieren, abspülen und mit 2,5 l Wasser, Zwiebel, Ingwer und Gewürzen 2,5 Stunden leise köcheln lassen. Abseihen und mit Fischsauce und Zucker abschmecken.',
      'Nudeln einweichen und kurz kochen. Die rohe Hüfte hauchdünn schneiden.',
      'Nudeln, gekochtes und rohes Fleisch in Schüsseln geben und mit kochender Brühe übergießen. Mit Sprossen, Kräutern, Limette und Chili servieren.',
    ], 'Pho bo'),

  r('nasi-goreng', 'Nasi Goreng mit Spiegelei', 'as', 'haupt', 25,
    '150 g Jasminreis | 200 g Hähnchenbrustfilet | 3 Stk Schalotte | 2 Zehe Knoblauch | 1 Stk Chili rot | 2 EL Kecap Manis | 1 EL Sojasauce | 1 TL Garnelenpaste | 2 Stk Ei | 0.5 Stk Salatgurke | 2 Stk Tomate | 2 EL Sonnenblumenöl | 2 EL Röstzwiebeln',
    [
      'Reis am besten am Vortag kochen und kalt stellen. Schalotten, Knoblauch, Chili und Garnelenpaste zu einer Paste zerstoßen.',
      'Hähnchenwürfel im Öl braten, Paste zugeben und anrösten.',
      'Reis zugeben und mit Kecap Manis und Sojasauce bei hoher Hitze braten.',
      'Mit Spiegelei, Gurken- und Tomatenscheiben und Röstzwiebeln servieren.',
    ], 'Nasi goreng'),

  r('bami-goreng', 'Bami Goreng', 'as', 'haupt', 25,
    '250 g Mie-Nudeln | 250 g Schweinefilet | 150 g Weißkohl | 1 Stk Möhre | 1 Stk Lauch | 2 Zehe Knoblauch | 1 Stk Chili rot | 3 EL Kecap Manis | 1 EL Sojasauce | 2 Stk Ei | 2 EL Sonnenblumenöl | 2 EL Röstzwiebeln',
    [
      'Nudeln garen und abschrecken.',
      'Fleisch in Streifen im Öl braten, Knoblauch und Chili zugeben.',
      'Gemüse in Streifen zugeben und bissfest braten. Eier unterrühren und stocken lassen.',
      'Nudeln, Kecap Manis und Sojasauce untermischen und mit Röstzwiebeln servieren.',
    ], 'Bami goreng'),

  r('katsu-curry', 'Japanisches Katsu-Curry', 'as', 'haupt', 45,
    '2 Stk Schweineschnitzel | 1 Stk Ei | 2 EL Weizenmehl | 80 g Panko | 100 g Japanische Curry-Würfel | 1 Stk Zwiebel | 1 Stk Möhre | 150 g Kartoffeln festkochend | 300 ml Frittieröl | 150 g Sushireis',
    [
      'Reis kochen. Zwiebel, Möhre und Kartoffel würfeln, im Topf anbraten, mit 500 ml Wasser aufgießen und 15 Minuten köcheln lassen.',
      'Vom Herd nehmen, Curry-Würfel darin auflösen und unter Rühren noch 5 Minuten köcheln lassen, bis die Sauce dick ist.',
      'Schnitzel salzen, mehlieren und durch Ei und Panko ziehen. In 2 cm Öl je Seite 3 Minuten goldbraun ausbacken.',
      'Schnitzel in Streifen schneiden und mit Curry und Reis anrichten.',
    ], 'Katsu curry'),

  // ───────────── Festtag ─────────────
  r('knusprige-ente-suess-sauer', 'Knusprige Ente süß-sauer mit Ananas und Reis', 'as', 'haupt', 100,
    '2 Stk Entenkeule | 20 g Ingwer | 1 TL Fünf-Gewürze-Pulver | 2 EL Shaoxing-Reiswein | 2 EL Sojasauce | 2 EL Speisestärke | 500 ml Frittieröl | 1 Stk Paprika rot | 1 Stk Paprika grün | 200 g Ananas | 1 Stk Zwiebel | 3 EL Tomatenketchup | 3 EL Reisessig | 2 EL Zucker | 1 TL Sojasauce | 200 g Jasminreis | Salz',
    [
      'Entenkeulen mit Salz, Fünf-Gewürze-Pulver, Reiswein, Sojasauce und Ingwerscheiben einreiben und 30 Minuten marinieren. Anschließend im Dampf oder zugedeckt im Ofen bei 160 °C 75 Minuten garen, bis das Fleisch sehr zart ist.',
      'Keulen abkühlen lassen, trocken tupfen, mit Stärke bestäuben und im heißen Öl (170 °C) 5 bis 6 Minuten knusprig ausbacken. Dann in Stücke schneiden. Reis kochen.',
      'Paprika, Ananas und Zwiebel in Stücke schneiden. Ketchup, Essig, Zucker, Sojasauce und 100 ml Wasser verrühren.',
      'Gemüse im Wok in wenig Öl 2 Minuten anbraten, Soße zugeben und aufkochen. Mit etwas angerührter Stärke leicht binden.',
      'Entenstücke auf Reis anrichten und die Soße darübergeben.',
    ], 'crispy duck sweet and sour'),
]
