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
      settings: [{ device: 'steamer', mode: 'Heissluft mit Beschwaden', temp: 170, minutes: 30, note: 'vorheizen, Ebene 2' }],
    },
    {
      text: 'Den Braten umdrehen, grob geschnittene Zwiebeln und Möhre zugeben und den Kerntemperaturfühler in die dickste Stelle stecken. Weitere 90 Minuten garen und dabei immer wieder mit Bier übergießen.',
      settings: [{ device: 'steamer', mode: 'Heissluft mit Beschwaden', temp: 170, minutes: 90, core: 78, note: 'Fühler nicht am Knochen' }],
    },
    {
      text: 'Für die Kruste auf trockene Hitze umstellen und weitergaren, bis die Schwarte aufpoppt.',
      settings: [{ device: 'steamer', mode: 'Heissluft', temp: 220, minutes: 15, note: 'ohne Dampf' }],
    },
    {
      text: 'Für die Semmelknödel die Brötchen würfeln, mit warmer Milch übergießen und 15 Minuten ziehen lassen. Eier, Petersilie und Salz untermischen und Knödel formen.',
    },
    {
      text: 'Reichlich Salzwasser mit Deckel aufkochen, die Knödel einlegen und 20 Minuten sanft ziehen lassen.',
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
      text: 'Zwiebel und Gemüse würfeln und in etwas Fett im Topf andünsten.',
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
}
