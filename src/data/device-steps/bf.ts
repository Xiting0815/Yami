import type { DeviceStep } from '../../types'

/** Geräte-Schritte (Rezept-ID → Schritte), Gruppe: bf. Stil siehe docs/geraete/regeln.md */
export const DEVICE_STEPS: Record<string, DeviceStep[]> = {
  // ───────────── Süß & kalt (nur Mischen, kein Gerät) ─────────────
  'oats-apfel-zimt': [
    { text: 'Haferflocken, Chiasamen und Zimt ins Glas geben.' },
    { text: 'Skyr und Milch dazu und gründlich verrühren, bis keine trockenen Flocken mehr zu sehen sind.' },
    { text: 'Apfel erst morgens frisch reiben oder würfeln, so bleibt er knackig. Alternativ am Prep-Tag würfeln und mit etwas Zitronensaft beträufeln.' },
    { text: 'Deckel drauf und in den Kühlschrank.' },
  ],

  'oats-beeren': [
    { text: 'Haferflocken, Chiasamen, Skyr, Milch und Honig im Glas verrühren.' },
    { text: 'Gefrorene Beeren obenauf geben. Sie tauen über Nacht auf und färben die Oats.' },
    { text: 'Verschließen und kühl stellen.' },
  ],

  'oats-schoko-banane': [
    { text: 'Haferflocken, Chiasamen und Backkakao im Glas mischen.' },
    { text: 'Skyr und Milch einrühren, bis eine glatte Schoko-Masse entsteht.' },
    { text: 'Banane erst morgens in Scheiben schneiden. Sie wird sonst braun.' },
    { text: 'Verschließen und kühl stellen.' },
  ],

  'oats-karottenkuchen': [
    { text: 'Möhre fein reiben.' },
    { text: 'Mit Haferflocken, Chiasamen, Rosinen, Zimt, Skyr und Milch im Glas verrühren.' },
    { text: 'Walnüsse grob hacken und separat in ein kleines Döschen geben, damit sie knackig bleiben.' },
    { text: 'Kühl stellen.' },
  ],

  'oats-erdnuss-apfel': [
    { text: 'Erdnussmus mit der Milch glatt rühren.' },
    { text: 'Haferflocken, Chiasamen und Skyr dazugeben und gut verrühren.' },
    { text: 'Verschließen und kühl stellen.' },
  ],

  'oats-mango-kokos': [
    { text: 'Haferflocken, Chiasamen, Skyr und Milch im Glas verrühren.' },
    { text: 'Gefrorene Mangowürfel und Kokosraspeln obenauf geben.' },
    { text: 'Verschließen und kühl stellen.' },
  ],

  'oats-himbeer-cheesecake': [
    { text: 'Magerquark mit Milch und Honig cremig rühren.' },
    { text: 'Haferflocken und Chiasamen unterrühren und ins Glas füllen.' },
    { text: 'Gefrorene Himbeeren obenauf geben.' },
    { text: 'Verschließen und kühl stellen.' },
  ],

  'chia-beeren': [
    { text: 'Chiasamen mit Milch und Honig verrühren, 10 Minuten quellen lassen und nochmals kräftig umrühren, damit nichts klumpt.' },
    { text: 'Skyr in das Glas schichten, Chia-Pudding darauf geben.' },
    { text: 'Gefrorene Beeren obenauf geben.' },
    { text: 'Verschließen. Hält bis zu 5 Tage im Kühlschrank.' },
  ],

  'chia-mango': [
    { text: 'Chiasamen mit Milch und Honig verrühren, 10 Minuten quellen lassen und nochmals umrühren.' },
    { text: 'Skyr und Chia-Pudding ins Glas schichten.' },
    { text: 'Gefrorene Mango obenauf geben.' },
    { text: 'Verschließen. Hält bis zu 5 Tage im Kühlschrank.' },
  ],

  'chia-schoko': [
    { text: 'Backkakao mit etwas Milch glatt rühren, dann restliche Milch, Honig und Chiasamen einrühren.' },
    { text: 'Nach 10 Minuten nochmals umrühren und mit dem Skyr ins Glas schichten.' },
    { text: 'Verschließen und kühl stellen.' },
  ],

  // Nur Haferflocken und Walnüsse werden trocken geröstet: BORA auf mittlerer Stufe
  'quark-bowl-apfel': [
    {
      text: 'Haferflocken und Walnusskerne ohne Fett in einer Pfanne goldbraun rösten. Mit Zimt und Honig mischen und abkühlen lassen. Separat in ein Döschen füllen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '4', minutes: 4, note: 'trocken rösten' }],
    },
    { text: 'Quark mit Leinsamen und einem Schuss Wasser cremig rühren und in die Dose füllen.' },
    { text: 'Den Apfel erst morgens frisch würfeln, sonst wird er braun.' },
    { text: 'Kühl stellen.' },
  ],

  'skyr-birne': [
    { text: 'Skyr mit Leinsamen, Haferflocken und Zimt verrühren.' },
    { text: 'In die Dose füllen, die Birne bleibt ganz (sie wird sonst braun).' },
    { text: 'Kühl stellen. Die Flocken werden über Nacht schön weich.' },
  ],

  'bircher': [
    { text: 'Haferflocken mit Milch und Leinsamen 10 Minuten einweichen.' },
    { text: 'Apfel grob reiben, sofort mit Zitronensaft mischen und mit Skyr unter die Flocken heben.' },
    { text: 'Gehackte Haselnüsse separat einpacken.' },
    { text: 'Ins Glas füllen und kühl stellen.' },
  ],

  // ───────────── Herzhaft ─────────────
  'eiermuffins-spinat-feta': [
    {
      text: 'Den Combair auf 170 °C Heißluft vorheizen, Muffinform fetten oder Silikonförmchen nehmen.',
      settings: [{ device: 'combair', mode: 'Heißluft', temp: 170, note: 'vorheizen' }],
    },
    { text: 'Spinat auftauen und gut ausdrücken. Paprika klein würfeln.' },
    { text: 'Ei, Eiklar und Hüttenkäse verquirlen, salzen und pfeffern. Spinat, Paprika und zerbröselten Feta unterrühren.' },
    {
      text: 'In 3 Mulden pro Portion füllen und im Combair 20 Minuten backen, bis sie gestockt sind.',
      settings: [{ device: 'combair', mode: 'Heißluft', temp: 170, minutes: 20 }],
    },
    { text: 'Abkühlen lassen. Möhre in Sticks schneiden, Muffins, Möhrensticks und Vollkornbrot zusammen in eine Dose packen.' },
  ],

  'eiermuffins-schinken': [
    {
      text: 'Den Combair auf 170 °C Heißluft vorheizen, Muffinform vorbereiten.',
      settings: [{ device: 'combair', mode: 'Heißluft', temp: 170, note: 'vorheizen' }],
    },
    { text: 'Schinken, Paprika und Frühlingszwiebel klein schneiden.' },
    { text: 'Ei und Eiklar verquirlen, mit Salz und Pfeffer würzen und mit Schinken und Gemüse mischen. In 3 Mulden pro Portion füllen und mit Gouda bestreuen.' },
    {
      text: 'Im Combair 20 Minuten backen und abkühlen lassen.',
      settings: [{ device: 'combair', mode: 'Heißluft', temp: 170, minutes: 20 }],
    },
    { text: 'Möhre in Sticks schneiden und mit Muffins und Vollkornbrot in eine Dose packen.' },
  ],

  // Pfanne: Paprika kurz anbraten, Rührei und Bohnen auf dem BORA
  burrito: [
    {
      text: 'Paprika würfeln und in einer beschichteten Pfanne kurz anbraten.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '5', note: 'kurz anbraten' }],
    },
    {
      text: 'Ei und Eiklar verquirlen, würzen, dazugeben und zu Rührei stocken lassen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '4', note: 'Rührei' }],
    },
    {
      text: 'Bohnen abspülen und mit passierten Tomaten und Paprikapulver kurz erwärmen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '3', minutes: 3 }],
    },
    { text: 'Tortilla mit Rührei, Bohnen und Gouda füllen, die Seiten einklappen und fest aufrollen.' },
    { text: 'Abkühlen lassen und in Backpapier und Alufolie wickeln. Für Do/Fr einfrieren.' },
  ],

  // Hähnchen in der Pfanne auf dem BORA (mittlere Hitze)
  'wrap-haehnchen': [
    {
      text: 'Hähnchen mit Paprikapulver, Salz und Pfeffer würzen und in einer beschichteten Pfanne bei mittlerer Hitze 5–6 Minuten je Seite durchbraten. Abkühlen lassen und in Streifen schneiden.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '5', note: '5–6 Min. je Seite' }],
    },
    { text: 'Gemüse in Streifen schneiden, die Möhre als Sticks.' },
    { text: 'Hummus und Salat in den Wrap geben. Am besten getrennt einpacken und erst auf der Arbeit füllen, dann weicht nichts durch.' },
  ],

  'huettenkaese-glas': [
    { text: 'Gemüse klein würfeln, Schnittlauch fein schneiden.' },
    { text: 'Hüttenkäse mit Schnittlauch, Leinsamen, Salz und Pfeffer verrühren.' },
    { text: 'Gemüse unten ins Glas, Hüttenkäse darüber. Knäckebrot separat einpacken.' },
  ],

  // Eier im CombiSteamer vorheizen und dämpfen, Rest kalt
  'brot-box': [
    {
      text: 'Den Wasserbehälter des CombiSteamers füllen. Möhre, Paprika und Gurke in Sticks schneiden.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, note: 'Wasserbehälter füllen' }],
    },
    {
      text: 'Eier 10 Minuten im Dampf hart garen, abschrecken und ungeschält kühl lagern.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 10 }],
    },
    { text: 'Hüttenkäse würzen und mit Rohkost und Vollkornbrot in eine Dose packen.' },
  ],

  'frittata-stuecke': [
    {
      text: 'Den Combair auf 170 °C Heißluft vorheizen. Eine kleine Auflaufform mit Backpapier auslegen.',
      settings: [{ device: 'combair', mode: 'Heißluft', temp: 170, note: 'vorheizen' }],
    },
    { text: 'Zucchini, Paprika und Zwiebel würfeln und auf dem Blech verteilen.' },
    { text: 'Ei und Eiklar verquirlen, mit Salz und Pfeffer würzen und darüber gießen. Feta darüber bröseln.' },
    {
      text: 'In den Combair schieben und 25 Minuten backen. Abkühlen lassen, in Portionsstücke schneiden und mit dem Vollkornbrot in die Dose packen.',
      settings: [{ device: 'combair', mode: 'Heißluft', temp: 170, minutes: 25 }],
    },
  ],

  // Linsen auf dem BORA kochen, Ei im CombiSteamer
  'linsen-ei-salat': [
    {
      text: 'Linsen mit Wasser in einem Topf aufkochen, dann bei Stufe 3 ca. 20 Minuten bissfest köcheln lassen. Abgießen und abkühlen lassen.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: 'Power', note: 'aufkochen' },
        { device: 'bora', mode: 'Kochzone', level: '3', minutes: 20, note: 'bissfest' },
      ],
    },
    {
      text: 'Den Wasserbehälter des CombiSteamers füllen. Ei 10 Minuten hart dämpfen.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 10, note: 'Wasserbehälter füllen' }],
    },
    { text: 'Öl, Essig und Senf verrühren, mit Linsen, Tomaten, Gurke und Petersilie mischen und mit Salz und Pfeffer würzen.' },
    { text: 'Ins Glas füllen und Feta darüber bröseln. Ei ungeschält dazulegen.' },
  ],

  // ───────────── Warm (Mikrowelle auf der Arbeit) ─────────────
  'baked-oats-blaubeer': [
    {
      text: 'Den Combair auf 170 °C Heißluft vorheizen. Banane zerdrücken und mit Ei, Skyr, Milch, Haferflocken, Chiasamen und Backpulver verrühren.',
      settings: [{ device: 'combair', mode: 'Heißluft', temp: 170, note: 'vorheizen' }],
    },
    { text: 'In ofenfeste Gläser oder Förmchen füllen und Heidelbeeren hineindrücken.' },
    {
      text: 'In den Combair stellen und 25 Minuten backen.',
      settings: [{ device: 'combair', mode: 'Heißluft', temp: 170, minutes: 25 }],
    },
    { text: 'Abkühlen lassen und verschließen. Portionen für Do/Fr einfrieren.' },
  ],

  'baked-oats-apfel': [
    {
      text: 'Den Combair auf 170 °C Heißluft vorheizen. Den halben Apfel reiben, die andere Hälfte würfeln.',
      settings: [{ device: 'combair', mode: 'Heißluft', temp: 170, note: 'vorheizen' }],
    },
    { text: 'Geriebenen Apfel mit Ei, Skyr, Milch, Haferflocken, Leinsamen, Zimt und Backpulver verrühren.' },
    { text: 'In ofenfeste Gläser füllen und die Apfelwürfel obenauf verteilen.' },
    {
      text: 'In den Combair stellen, 25 Minuten backen und abkühlen lassen. Verschließen.',
      settings: [{ device: 'combair', mode: 'Heißluft', temp: 170, minutes: 25 }],
    },
  ],

  // Nur Mischen: die Flocken bleiben trocken im Glas
  'porridge-glas': [
    { text: 'Haferflocken, Leinsamen und Zimt trocken ins Glas geben (hält ewig).' },
    { text: 'Skyr in ein kleines Döschen, den Apfel ganz lassen.' },
    { text: 'Milch auf der Arbeit aus dem Kühlschrank nehmen oder im Fläschchen mitnehmen.' },
  ],

  // Ei im CombiSteamer, Haferbrei auf dem BORA
  'savory-oats': [
    {
      text: 'Den Wasserbehälter des CombiSteamers füllen. Ei 10 Minuten hart dämpfen.',
      settings: [{ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 10, note: 'Wasserbehälter füllen' }],
    },
    {
      text: 'Haferflocken in der Gemüsebrühe mit Spinat und Leinsamen aufkochen, dann 3 Minuten köcheln lassen. Hüttenkäse unterrühren und pfeffern.',
      settings: [
        { device: 'bora', mode: 'Kochzone', level: 'Power', note: 'aufkochen' },
        { device: 'bora', mode: 'Kochzone', level: '3', minutes: 3, note: 'köcheln' },
      ],
    },
    { text: 'Ins Glas füllen, Ei ungeschält dazu.' },
  ],

  // Zwiebel, Paprika und Gewürze im Öl auf dem BORA, dann Sauce und Eier
  'shakshuka-glas': [
    {
      text: 'Zwiebel und Paprika im Öl andünsten, Paprikapulver edelsüß und Kreuzkümmel kurz mitrösten.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '4', note: 'andünsten' }],
    },
    {
      text: 'Gehackte Tomaten und abgespülte Kichererbsen zugeben und 10 Minuten einkochen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '4', minutes: 10, note: 'einkochen' }],
    },
    {
      text: 'Mit Salz und Pfeffer würzen. Ei und Eiklar verquirlen, in die Sauce rühren und unter Rühren stocken lassen.',
      settings: [{ device: 'bora', mode: 'Kochzone', level: '3', note: 'unter Rühren' }],
    },
    { text: 'In Gläser füllen und Feta darüber bröseln.' },
  ],

  'quarkauflauf': [
    {
      text: 'Den Combair auf 170 °C Heißluft vorheizen. Quark, Ei, Haferflocken, Leinsamen, Zimt und Backpulver verrühren.',
      settings: [{ device: 'combair', mode: 'Heißluft', temp: 170, note: 'vorheizen' }],
    },
    { text: 'In eine kleine Form füllen, Apfelscheiben obenauf legen.' },
    {
      text: 'In den Combair schieben und 30 Minuten backen.',
      settings: [{ device: 'combair', mode: 'Heißluft', temp: 170, minutes: 30 }],
    },
    { text: 'Abkühlen lassen und in Portionsstücke schneiden.' },
  ],
}
