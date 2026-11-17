import { basic } from './define'

// Grundrezepte (Fonds): Mengen für 1 Ansatz. Ergebnis kommt beim „Fertig gekocht“ als Posten in den Vorrat
// und ersetzt dort den gekauften Fond (siehe substitutes.ts – Selbstgemachtes wird zuerst genommen).
export const basicsDe = [
  basic('rinderfond-braun', 'Brauner Rinderfond', 300,
    { name: 'Rinderfond selbstgemacht', amount: 1500, unit: 'ml', shelf: 90 },
    '2000 g Rinderknochen | 2 Stk Zwiebel | 2 Stk Möhre | 200 g Knollensellerie | 1 Stk Lauch | 2 EL Tomatenmark | 250 ml Rotwein | 1 EL Sonnenblumenöl | 2 Blatt Lorbeerblatt | 1 TL Pfefferkörner | 4 Stk Wacholderbeere | 3 Zweig Thymian',
    [
      'Die Rinderknochen (vom Metzger in kleine Stücke hacken lassen) auf einem Blech im Ofen bei 220 °C 25 Minuten rösten, dann wenden.',
      'Zwiebeln mit Schale halbieren, Möhren, Sellerie und Lauch grob schneiden, mit dem Öl mischen und zu den Knochen geben. Die Knochen mit Tomatenmark bestreichen und alles weitere 20 Minuten dunkelbraun rösten.',
      'Alles in einen großen Topf geben, das Blech mit dem Rotwein ablöschen und die Röststoffe lösen. Mit 3,5 l kaltem Wasser auffüllen, langsam aufkochen und den Schaum abschöpfen.',
      'Lorbeer, Pfefferkörner, Wacholderbeeren und Thymian zugeben und den Fond 4 Stunden ohne Deckel sanft simmern lassen, nicht kochen. Ab und zu Fett und Schaum abschöpfen.',
      'Durch ein mit einem Tuch ausgelegtes Sieb gießen und auf 1,5 l einkochen. Abkühlen lassen, das Fett abheben und in 250- bis 500-ml-Portionen einfrieren (hält ca. 3 Monate).',
    ], 'brown beef stock pot bones'),

  basic('kalbsfond-hell', 'Heller Kalbsfond', 240,
    { name: 'Kalbsfond selbstgemacht', amount: 1500, unit: 'ml', shelf: 90 },
    '2000 g Kalbsknochen | 2 Stk Zwiebel | 1 Stk Möhre | 150 g Knollensellerie | 1 Stk Lauch | 200 ml Weißwein | 0.5 Bund Petersilie | 2 Zweig Thymian | 1 Blatt Lorbeerblatt | 1 TL Pfefferkörner',
    [
      'Die Kalbsknochen kalt abspülen, im großen Topf mit kaltem Wasser bedecken, aufkochen und 5 Minuten sprudelnd kochen. Abgießen und kalt abspülen – so wird der Fond hell und klar.',
      'Die Knochen mit 3,5 l kaltem Wasser und dem Weißwein langsam aufkochen und den Schaum gründlich abschöpfen.',
      'Zwiebeln schälen und halbieren, Möhre, Sellerie und Lauch grob schneiden. Mit Petersilienstängeln, Thymian, Lorbeer und Pfefferkörnern zugeben und 3 Stunden ohne Deckel sanft simmern lassen.',
      'Durch ein mit einem Tuch ausgelegtes Sieb gießen und auf 1,5 l einkochen. Abkühlen lassen, entfetten und portionsweise einfrieren (hält ca. 3 Monate).',
    ], 'veal stock pot'),

  basic('lammfond-dunkel', 'Dunkler Lammfond', 270,
    { name: 'Lammfond selbstgemacht', amount: 1000, unit: 'ml', shelf: 90 },
    '2000 g Lammknochen | 2 Stk Zwiebel | 1 Stk Möhre | 100 g Knollensellerie | 4 Zehe Knoblauch | 2 EL Tomatenmark | 200 ml Rotwein | 1 EL Sonnenblumenöl | 2 Zweig Rosmarin | 3 Zweig Thymian | 1 Blatt Lorbeerblatt | 1 TL Pfefferkörner',
    [
      'Die Lammknochen (klein gehackt) auf einem Blech im Ofen bei 220 °C 25 Minuten rösten, dann wenden.',
      'Zwiebeln mit Schale halbieren, Möhre und Sellerie grob schneiden, Knoblauch andrücken. Mit dem Öl mischen und zu den Knochen geben, die Knochen mit Tomatenmark bestreichen und alles weitere 20 Minuten dunkelbraun rösten.',
      'Alles in einen großen Topf geben, das Blech mit dem Rotwein ablöschen und die Röststoffe lösen. Mit 3 l kaltem Wasser auffüllen, langsam aufkochen und den Schaum abschöpfen.',
      'Rosmarin, Thymian, Lorbeer und Pfefferkörner zugeben und 3 Stunden ohne Deckel sanft simmern lassen, dabei Fett abschöpfen.',
      'Durch ein mit einem Tuch ausgelegtes Sieb gießen und auf 1 l einkochen. Abkühlen lassen, entfetten und portionsweise einfrieren (hält ca. 3 Monate).',
    ], 'lamb stock bones roasted'),
]
