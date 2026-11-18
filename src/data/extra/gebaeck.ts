// Backen & Desserts – Gruppe „Plätzchen & Cookies“ (Kleingebäck, Weihnachtsplätzchen). Regeln: docs/backen-regeln.md. Nur diese Datei bearbeiten.
import { backen, prod } from '../define'
import type { DeviceStep } from '../../types'
import type { RawRecipe } from '../define'
import type { ExtraGroup } from './types'

const dose = 'in der Blechdose'
const weihnacht = { festive: ['plaetzchen' as const] }

const recipes: RawRecipe[] = [
  // ---------- Weihnachtsplätzchen ----------
  backen('gebaeck', 'vanillekipferl', 'Vanillekipferl',
    {
      time: 100,
      ...weihnacht,
      yields: { name: 'Vanillekipferl (selbstgebacken)', amount: 40, unit: 'Stk', shelf: 28, store: dose, frozen: 90 },
      lighter: 'Nur 170 g Butter in den Teig geben und die Kipferl dünn statt dick in 40 g Puderzucker wenden – spart rund 10 kcal pro Stück.',
    },
    '280 g Weizenmehl | 200 g Butter | 100 g Mandeln gemahlen | 70 g Zucker | 1 Prise Salz | 1 Stk Eigelb | 3 Pck Vanillezucker | 80 g Puderzucker',
    [
      'Weizenmehl, Mandeln gemahlen, Zucker, 1 Pck Vanillezucker und Salz mischen. Die kalte Butter in Stückchen und das Eigelb zugeben und mit den Händen rasch zu einem glatten Mürbeteig kneten.',
      'Den Teig in Frischhaltefolie wickeln und mindestens 1 Stunde kühl stellen. Der Teig lässt sich so auch bis zu 3 Monate einfrieren und über Nacht im Kühlschrank auftauen.',
      'Den Ofen auf 175 °C Ober-/Unterhitze vorheizen. Zwei Bleche mit Backpapier belegen.',
      'Den Teig in 40 gleich große Stücke (je ca. 17 g) teilen, zu 5 cm langen Rollen formen, zu Hörnchen biegen und mit etwas Abstand auf die Bleche legen.',
      'Die Kipferl 10–12 Minuten backen, bis sie nur hellgelb sind und die Ränder gerade Farbe nehmen.',
      'Den Puderzucker mit 2 Pck Vanillezucker mischen. Die Kipferl 5 Minuten abkühlen lassen, noch warm vorsichtig darin wenden und auf einem Gitter auskühlen lassen. In der Blechdose mit Backpapier schichten.',
    ]),

  backen('gebaeck', 'butterplaetzchen', 'Butterplätzchen zum Ausstechen',
    {
      time: 120,
      ...weihnacht,
      yields: { name: 'Butterplätzchen (selbstgebacken)', amount: 50, unit: 'Stk', shelf: 28, store: dose, frozen: 90 },
      lighter: 'Die Zitronenglasur weglassen und die Plätzchen nur mit dem Eigelb bestreichen – spart rund 8 kcal pro Stück.',
    },
    '300 g Weizenmehl | 200 g Butter | 100 g Zucker | 1 Stk Ei | 1 Stk Eigelb | 1 Pck Vanillezucker | 1 Prise Salz | 1 Stk Zitrone unbehandelt | 100 g Puderzucker',
    [
      'Weizenmehl, Zucker, Vanillezucker, Salz und die abgeriebene Schale der Zitrone mischen. Die kalte Butter in Stückchen und das Ei zugeben und rasch zu einem glatten Teig kneten.',
      'Den Teig in Folie wickeln und 1 Stunde kühlen (oder bis 3 Monate einfrieren und im Kühlschrank auftauen).',
      'Den Ofen auf 180 °C Ober-/Unterhitze vorheizen. Bleche mit Backpapier belegen.',
      'Den Teig portionsweise auf wenig Mehl 3–4 mm dünn ausrollen, Plätzchen ausstechen und auf die Bleche legen. Mit dem verquirlten Eigelb bestreichen. Die Teigreste erneut verkneten und ausrollen.',
      'Die Plätzchen in zwei Runden je 8–10 Minuten goldgelb backen und auf einem Gitter auskühlen lassen.',
      'Den Puderzucker mit 2 EL Zitronensaft glatt rühren, die Plätzchen damit bestreichen und trocknen lassen. In der Blechdose lagern.',
    ]),

  backen('gebaeck', 'spitzbuben', 'Spitzbuben (Linzer Augen)',
    {
      time: 110,
      ...weihnacht,
      yields: { name: 'Spitzbuben (selbstgebacken)', amount: 30, unit: 'Stk', shelf: 21, store: dose, frozen: 60 },
      lighter: 'Mit Fruchtaufstrich ohne zugesetzten Zucker füllen und nur dünn bestäuben – spart rund 12 kcal pro Stück.',
    },
    '300 g Weizenmehl | 200 g Butter | 130 g Puderzucker | 1 Stk Ei | 1 Pck Vanillezucker | 1 Prise Salz | 1 Stk Zitrone unbehandelt | 200 g Johannisbeergelee',
    [
      'Weizenmehl, 100 g vom Puderzucker, Vanillezucker, Salz und die abgeriebene Zitronenschale mischen. Die kalte Butter in Stückchen und das Ei zugeben und zu einem glatten Teig kneten. In Folie 1 Stunde kühlen.',
      'Den Ofen auf 175 °C Ober-/Unterhitze vorheizen. Bleche mit Backpapier belegen.',
      'Den Teig portionsweise 3 mm dünn ausrollen und 60 runde Plätzchen (ca. 5 cm) ausstechen. Aus der Hälfte mit einem kleinen Förmchen die Mitte ausstechen (Deckel).',
      'Die Plätzchen 8–10 Minuten hell backen, auf einem Gitter vollständig auskühlen lassen.',
      'Das Johannisbeergelee glatt rühren und kurz erwärmen. Die Böden dünn damit bestreichen, die Deckel mit den restlichen 30 g Puderzucker bestäuben und aufsetzen. Mindestens 1 Tag durchziehen lassen, dann in der Blechdose lagern.',
    ]),

  backen('gebaeck', 'zimtsterne', 'Zimtsterne',
    {
      time: 90,
      ...weihnacht,
      yields: { name: 'Zimtsterne (selbstgebacken)', amount: 40, unit: 'Stk', shelf: 28, store: dose, frozen: 90 },
      lighter: 'Den Zuckerguss weglassen und die Sterne nur mit Puderzucker bestäuben – spart rund 6 kcal pro Stück.',
    },
    '300 g Mandeln gemahlen | 250 g Puderzucker | 100 g Eiklar | 2 TL Zimt gemahlen | 1 Prise Salz',
    [
      'Das Eiklar mit dem Salz steif schlagen, den Puderzucker nach und nach einrieseln lassen und weiterschlagen, bis eine glänzende, feste Masse entsteht. 3 EL davon für den Guss abnehmen.',
      'Die Mandeln gemahlen und den Zimt unter die restliche Masse mischen und zu einem klebrigen, aber formbaren Teig verkneten. Er soll nicht an den Fingern haften – bei Bedarf etwas Mandeln nachgeben.',
      'Den Ofen auf 150 °C Ober-/Unterhitze vorheizen. Bleche mit Backpapier belegen.',
      'Den Teig auf Puderzucker (statt Mehl) 7 mm dick ausrollen und Sterne (ca. 4 cm) ausstechen. Die Ränder und Oberseiten dünn mit dem Guss bestreichen.',
      'Die Sterne 10 Minuten backen; sie sollen innen weich bleiben und die Oberfläche nicht bräunen. Auf dem Papier auskühlen lassen, dann in der Blechdose lagern.',
    ]),

  backen('gebaeck', 'kokosmakronen', 'Kokosmakronen',
    {
      time: 50,
      ...weihnacht,
      yields: { name: 'Kokosmakronen (selbstgebacken)', amount: 30, unit: 'Stk', shelf: 21, store: dose, frozen: 90 },
      lighter: 'Nur 100 g Zucker nehmen und die Böden nicht in Schokolade tauchen – spart rund 15 kcal pro Stück.',
    },
    '100 g Eiklar | 150 g Zucker | 1 Pck Vanillezucker | 1 Prise Salz | 200 g Kokosraspeln | 50 g Zartbitterschokolade',
    [
      'Das Eiklar, den Zucker, Vanillezucker und das Salz in einer Metallschüssel über einem Topf mit knapp siedendem Wasser 5 Minuten warm aufschlagen, bis sich der Zucker gelöst hat.',
      'Die Schüssel vom Wasserbad nehmen und die Kokosraspeln unterheben. Die Masse 10 Minuten ruhen lassen, damit sie bindet.',
      'Den Ofen auf 160 °C Ober-/Unterhitze vorheizen. Bleche mit Backpapier belegen.',
      'Mit zwei Teelöffeln oder nassen Händen 30 kleine Häufchen (ca. 15 g) formen und mit Abstand auf die Bleche setzen.',
      'Die Makronen 15–18 Minuten backen, bis die Spitzen goldbraun sind. Auf dem Papier auskühlen lassen.',
      'Die Zartbitterschokolade im Wasserbad schmelzen, die Böden der Makronen eintauchen und auf Backpapier fest werden lassen. In der Blechdose lagern.',
    ]),

  backen('gebaeck', 'heidesand', 'Heidesand',
    {
      time: 180,
      ...weihnacht,
      yields: { name: 'Heidesand (selbstgebacken)', amount: 60, unit: 'Stk', shelf: 28, store: dose, frozen: 90 },
      lighter: 'Den Zucker im Teig auf 100 g reduzieren und die Rollen nur dünn in Zucker wälzen – spart rund 5 kcal pro Stück.',
    },
    '300 g Weizenmehl | 250 g Butter | 150 g Zucker | 1 Pck Vanillezucker | 1 Prise Salz | 1 Stk Eigelb | 40 g Zucker',
    [
      'Die Butter in einem Topf schmelzen und bei mittlerer Hitze 5–6 Minuten braun werden lassen, bis sie nussig duftet. In eine Schüssel gießen und im Kühlschrank wieder fest werden lassen (ca. 1 Stunde).',
      'Die feste braune Butter mit 150 g Zucker, Vanillezucker und Salz cremig rühren. Das Weizenmehl zugeben und zu einem glatten Teig kneten.',
      'Den Teig zu zwei Rollen (ca. 3 cm Durchmesser) formen, in Folie wickeln und mindestens 2 Stunden kühlen (oder einfrieren).',
      'Den Ofen auf 175 °C Ober-/Unterhitze vorheizen. Bleche mit Backpapier belegen.',
      'Die Rollen mit dem verquirlten Eigelb bestreichen und in den restlichen 40 g Zucker wälzen. In 8 mm dicke Scheiben schneiden und auf die Bleche legen.',
      'Den Heidesand in zwei Runden je 10–12 Minuten backen, bis der Rand goldfarben ist. Auf einem Gitter auskühlen lassen.',
    ]),

  backen('gebaeck', 'spritzgebaeck', 'Spritzgebäck',
    {
      time: 80,
      ...weihnacht,
      yields: { name: 'Spritzgebäck (selbstgebacken)', amount: 60, unit: 'Stk', shelf: 28, store: dose, frozen: 90 },
      lighter: 'Nur die Spitzen in die Schokolade tauchen und dafür 80 g statt 150 g Zartbitterschokolade nehmen – spart rund 6 kcal pro Stück.',
    },
    '375 g Weizenmehl | 250 g Butter | 125 g Zucker | 1 Pck Vanillezucker | 1 Prise Salz | 1 Stk Ei | 40 ml Milch | 150 g Zartbitterschokolade',
    [
      'Die weiche Butter mit Zucker, Vanillezucker und Salz cremig rühren. Das Ei unterrühren, dann das Weizenmehl abwechselnd mit der Milch zugeben, bis ein glatter, geschmeidiger Teig entsteht.',
      'Den Ofen auf 180 °C Ober-/Unterhitze vorheizen. Bleche mit Backpapier belegen.',
      'Den Teig portionsweise in einen Spritzbeutel mit Sterntülle (ca. 8 mm) füllen und 60 S-förmige Stangen (ca. 5 cm) auf die Bleche spritzen.',
      'Das Spritzgebäck in zwei Runden je 10–12 Minuten hellgelb backen und auf einem Gitter auskühlen lassen.',
      'Die Zartbitterschokolade im Wasserbad schmelzen, die Enden des Gebäcks eintauchen und auf Backpapier trocknen lassen. In der Blechdose lagern.',
    ]),

  backen('gebaeck', 'nussecken', 'Nussecken',
    {
      time: 100,
      ...weihnacht,
      yields: { name: 'Nussecken (selbstgebacken)', amount: 30, unit: 'Stk', shelf: 21, store: dose, frozen: 90 },
      lighter: 'Den Belag mit 150 g statt 200 g Butter und 150 g statt 200 g Zucker kochen – spart rund 20 kcal pro Stück.',
    },
    '300 g Weizenmehl | 325 g Butter | 300 g Zucker | 2 Pck Vanillezucker | 1 Stk Ei | 1 Prise Salz | 200 g Haselnusskerne | 100 g Mandelblättchen | 200 g Aprikosenmarmelade | 150 g Zartbitterschokolade',
    [
      'Für den Teig Weizenmehl, 100 g Zucker, 1 Pck Vanillezucker, Salz, das Ei und 125 g kalte Butter in Stückchen zu einem glatten Mürbeteig kneten. In Folie 30 Minuten kühlen.',
      'Den Ofen auf 180 °C Ober-/Unterhitze vorheizen. Ein Blech (ca. 30 x 40 cm) mit Backpapier belegen.',
      'Den Teig auf das Blech ausrollen und mit einer Gabel mehrfach einstechen. Die Aprikosenmarmelade glatt rühren, kurz erwärmen und dünn auf den Teig streichen.',
      'Die Haselnusskerne grob hacken. Für den Belag 200 g Butter, 200 g Zucker, 1 Pck Vanillezucker und 4 EL Wasser aufkochen, Haselnüsse und Mandelblättchen einrühren und 2 Minuten köcheln lassen.',
      'Den Belag auf der Marmelade verstreichen und die Nussecken 25–30 Minuten goldbraun backen. Auf dem Blech abkühlen lassen.',
      'Das Blech in ca. 5 cm große Quadrate und diese diagonal in Dreiecke schneiden (30 Stück). Die Zartbitterschokolade im Wasserbad schmelzen, die beiden kurzen Kanten eintauchen und auf Backpapier trocknen lassen. In der Blechdose lagern.',
    ]),

  // ---------- Cookies ----------
  backen('gebaeck', 'chocolate-chip-cookies', 'Chocolate Chip Cookies',
    {
      time: 55,
      yields: { name: 'Chocolate Chip Cookies (selbstgebacken)', amount: 20, unit: 'Stk', shelf: 10, store: dose, frozen: 90 },
      lighter: 'Nur 150 g Zartbitterschokolade und 150 g Zucker (insgesamt) nehmen – spart rund 23 kcal pro Stück.',
    },
    '250 g Weizenmehl | 1 TL Backpulver | 1 Prise Salz | 150 g Butter | 100 g Zucker | 100 g Brauner Zucker | 1 Stk Ei | 1 Pck Vanillezucker | 200 g Zartbitterschokolade',
    [
      'Weizenmehl, Backpulver und Salz mischen. Die Zartbitterschokolade grob hacken.',
      'Die weiche Butter mit Zucker, Brauner Zucker und Vanillezucker 3 Minuten cremig rühren. Das Ei unterrühren.',
      'Die Mehlmischung kurz unterkneten und die Schokolade unterheben. Den Teig 30 Minuten kühlen (so bleiben die Cookies dick). Den Ofen auf 180 °C Ober-/Unterhitze vorheizen.',
      'Aus dem Teig 20 Kugeln (ca. 45 g) formen, mit viel Abstand auf Bleche mit Backpapier setzen und leicht flachdrücken.',
      'Die Cookies in zwei Runden je 10–12 Minuten backen, bis die Ränder goldbraun sind und die Mitte noch weich wirkt. 5 Minuten auf dem Blech nachziehen lassen, dann auf einem Gitter auskühlen lassen.',
    ]),

  backen('gebaeck', 'double-chocolate-cookies', 'Double Chocolate Cookies',
    {
      time: 50,
      yields: { name: 'Double Chocolate Cookies (selbstgebacken)', amount: 18, unit: 'Stk', shelf: 10, store: dose, frozen: 90 },
      lighter: 'Zucker auf zusammen 140 g reduzieren und nur 150 g Zartbitterschokolade verwenden – spart rund 24 kcal pro Stück.',
    },
    '200 g Weizenmehl | 7 EL Backkakao | 1 TL Backpulver | 1 Prise Salz | 150 g Butter | 120 g Brauner Zucker | 60 g Zucker | 1 Stk Ei | 1 Pck Vanillezucker | 200 g Zartbitterschokolade',
    [
      'Weizenmehl, Backkakao, Backpulver und Salz mischen. 100 g von der Zartbitterschokolade im Wasserbad schmelzen und etwas abkühlen lassen, die restlichen 100 g grob hacken.',
      'Die weiche Butter mit Brauner Zucker, Zucker und Vanillezucker cremig rühren. Das Ei und die geschmolzene Schokolade unterrühren.',
      'Die Mehlmischung unterkneten, die gehackte Schokolade unterheben und den Teig 20 Minuten kühlen. Den Ofen auf 180 °C Ober-/Unterhitze vorheizen.',
      'Aus dem Teig 18 Kugeln (ca. 50 g) formen, mit Abstand auf Bleche mit Backpapier setzen und leicht flachdrücken.',
      'Die Cookies in zwei Runden je 10 Minuten backen; sie sollen in der Mitte noch weich sein. Auf dem Blech 5 Minuten nachziehen lassen, dann auf einem Gitter auskühlen lassen.',
    ]),

  backen('gebaeck', 'haferflocken-cranberry-cookies', 'Haferflocken-Cranberry-Cookies',
    {
      time: 45,
      yields: { name: 'Haferflocken-Cranberry-Cookies (selbstgebacken)', amount: 20, unit: 'Stk', shelf: 10, store: dose, frozen: 90 },
      lighter: 'Die Hälfte der Butter (60 g) durch 60 g Skyr ersetzen – spart rund 20 kcal pro Stück.',
    },
    '150 g Haferflocken | 150 g Weizenmehl | 1 TL Backpulver | 1 TL Zimt gemahlen | 1 Prise Salz | 125 g Butter | 100 g Brauner Zucker | 1 Stk Ei | 1 Pck Vanillezucker | 100 g Cranberries getrocknet | 50 g Walnusskerne',
    [
      'Haferflocken, Weizenmehl, Backpulver, Zimt und Salz mischen. Die Cranberries und die Walnusskerne grob hacken.',
      'Die weiche Butter mit Brauner Zucker und Vanillezucker cremig rühren, das Ei unterrühren.',
      'Die Mehl-Hafer-Mischung unterkneten und Cranberries und Walnüsse unterheben. Den Ofen auf 180 °C Ober-/Unterhitze vorheizen.',
      'Aus dem Teig 20 Kugeln (ca. 35 g) formen, mit Abstand auf Bleche mit Backpapier setzen und flachdrücken.',
      'Die Cookies in zwei Runden je 12–14 Minuten goldbraun backen, 5 Minuten auf dem Blech nachziehen lassen und auf einem Gitter auskühlen lassen.',
    ]),

  backen('gebaeck', 'erdnussbutter-cookies', 'Erdnussbutter-Cookies',
    {
      time: 35,
      yields: { name: 'Erdnussbutter-Cookies (selbstgebacken)', amount: 20, unit: 'Stk', shelf: 10, store: dose, frozen: 90 },
      lighter: 'Nur 100 g Zucker insgesamt (50 g Brauner Zucker, 50 g Zucker) verwenden – spart rund 10 kcal pro Stück.',
    },
    '250 g Erdnussmus | 100 g Brauner Zucker | 50 g Zucker | 50 g Weizenmehl | 1 Stk Ei | 1 TL Backpulver | 1 Pck Vanillezucker | 1 Prise Salz',
    [
      'Den Ofen auf 180 °C Ober-/Unterhitze vorheizen. Bleche mit Backpapier belegen.',
      'Erdnussmus, Brauner Zucker, Zucker, Vanillezucker und das Ei glatt verrühren. Weizenmehl, Backpulver und Salz untermischen.',
      'Aus dem Teig 20 Kugeln (ca. 25 g) formen, mit Abstand auf die Bleche setzen und mit einer Gabel kreuzweise flachdrücken.',
      'Die Cookies in zwei Runden je 10–12 Minuten backen. Sie sind zunächst sehr weich: 10 Minuten auf dem Blech festwerden lassen, dann auf einem Gitter auskühlen lassen.',
    ]),

  backen('gebaeck', 'skyr-haferflocken-cookies', 'Weiche Skyr-Haferflocken-Cookies',
    {
      time: 35,
      yields: { name: 'Skyr-Haferflocken-Cookies (selbstgebacken)', amount: 18, unit: 'Stk', shelf: 4, store: 'luftdicht im Kühlschrank', frozen: 90 },
      lighter: 'Die Schokolade weglassen und dafür 1 geriebenen Apfel unterrühren – spart rund 10 kcal pro Stück.',
    },
    '200 g Haferflocken | 80 g Weizenmehl | 150 g Skyr | 60 g Honig | 1 Stk Ei | 1 TL Backpulver | 1 TL Zimt gemahlen | 1 Prise Salz | 40 g Rosinen | 40 g Zartbitterschokolade',
    [
      'Den Ofen auf 180 °C Ober-/Unterhitze vorheizen. Bleche mit Backpapier belegen.',
      'Skyr, Honig und Ei glatt verrühren. Haferflocken, Weizenmehl, Backpulver, Zimt und Salz untermischen. Die Rosinen und die grob gehackte Zartbitterschokolade unterheben.',
      'Den Teig 10 Minuten quellen lassen. Mit einem Esslöffel 18 Häufchen (ca. 40 g) auf die Bleche setzen und leicht flachdrücken.',
      'Die Cookies in zwei Runden je 12–14 Minuten backen, bis sie nur leicht gebräunt und noch weich sind. Auf einem Gitter auskühlen lassen und im Kühlschrank aufbewahren.',
    ]),

  // ---------- Italienisch ----------
  backen('gebaeck', 'cantuccini', 'Cantuccini',
    {
      cuisine: 'it',
      time: 100,
      yields: { name: 'Cantuccini (selbstgebacken)', amount: 40, unit: 'Stk', shelf: 28, store: dose, frozen: 90 },
      lighter: 'Zucker auf 150 g und Mandeln auf 150 g reduzieren – spart rund 12 kcal pro Stück.',
    },
    '250 g Weizenmehl | 200 g Zucker | 2 Stk Ei | 1 Stk Eigelb | 1 TL Backpulver | 1 Prise Salz | 1 Pck Vanillezucker | 1 Stk Orange | 200 g Mandeln',
    [
      'Die Orange heiß abwaschen und die Schale fein abreiben. Weizenmehl, Zucker, Backpulver, Salz und Vanillezucker mischen.',
      'Die Eier und die Orangenschale zugeben und rasch zu einem festen, leicht klebrigen Teig verkneten. Die Mandeln (ungehackt, mit Haut) einkneten.',
      'Den Ofen auf 180 °C Ober-/Unterhitze vorheizen. Ein Blech mit Backpapier belegen.',
      'Den Teig in drei Rollen (ca. 3 cm dick, 25 cm lang) formen, auf das Blech legen und mit dem verquirlten Eigelb bestreichen.',
      'Die Rollen 20 Minuten backen, bis sie goldgelb und fest sind. 10 Minuten abkühlen lassen.',
      'Die Rollen schräg in 1,5 cm dicke Scheiben schneiden (ergibt ca. 40), flach auf zwei Bleche legen und noch einmal 12–15 Minuten rösten, bis sie trocken und goldbraun sind. Auf einem Gitter auskühlen lassen; sie werden dabei knusprig-hart.',
    ]),

  backen('gebaeck', 'amaretti-morbidi', 'Amaretti morbidi',
    {
      cuisine: 'it',
      time: 90,
      yields: { name: 'Amaretti morbidi (selbstgebacken)', amount: 24, unit: 'Stk', shelf: 14, store: dose, frozen: 60 },
      lighter: 'Nur 160 g Zucker in den Teig geben und die Kugeln nur leicht in Puderzucker wälzen – spart rund 10 kcal pro Stück.',
    },
    '250 g Mandeln gemahlen | 200 g Zucker | 100 g Eiklar | 1 TL Bittermandelaroma | 1 Prise Salz | 40 g Puderzucker',
    [
      'Das Eiklar mit dem Salz steif schlagen. Zucker, Mandeln gemahlen und Bittermandelaroma vorsichtig unterheben, bis ein weicher, klebriger Teig entsteht.',
      'Den Teig abgedeckt 30 Minuten ruhen lassen. Den Ofen auf 170 °C Ober-/Unterhitze vorheizen. Zwei Bleche mit Backpapier belegen.',
      'Aus dem Teig mit nassen Händen 24 walnussgroße Kugeln (ca. 25 g) formen und im Puderzucker wälzen. Mit Abstand auf die Bleche setzen und leicht flachdrücken.',
      'Die Amaretti 12–14 Minuten backen, bis sie leicht rissig und nur hellgelb sind – innen bleiben sie weich. Auf dem Papier auskühlen lassen und in der Blechdose lagern.',
    ]),

  backen('gebaeck', 'baci-di-dama', 'Baci di dama',
    {
      cuisine: 'it',
      time: 100,
      yields: { name: 'Baci di dama (selbstgebacken)', amount: 25, unit: 'Stk', shelf: 21, store: dose, frozen: 60 },
      lighter: 'Nur 70 g Zartbitterschokolade zur Füllung und 80 g Zucker im Teig nehmen – spart rund 10 kcal pro Stück.',
    },
    '100 g Haselnusskerne | 100 g Weizenmehl | 100 g Butter | 100 g Zucker | 1 Prise Salz | 100 g Zartbitterschokolade',
    [
      'Die Haselnusskerne mit dem Zucker in einer Küchenmaschine fein mahlen.',
      'Haselnuss-Zucker, Weizenmehl, Salz und die kalte Butter in Stückchen rasch zu einem glatten Teig verkneten. In Folie 1 Stunde kühlen.',
      'Den Ofen auf 170 °C Ober-/Unterhitze vorheizen. Zwei Bleche mit Backpapier belegen.',
      'Aus dem Teig 50 gleich große Kugeln (ca. 7 g) rollen und mit Abstand auf die Bleche setzen.',
      'Die Kugeln 12–14 Minuten backen, bis sie hell und fest sind. Auf einem Gitter vollständig auskühlen lassen.',
      'Die Zartbitterschokolade im Wasserbad schmelzen und etwas fest werden lassen. Je eine Kugel an der flachen Seite dünn damit bestreichen und mit einer zweiten zusammensetzen (25 Doppelkekse). Fest werden lassen und in der Blechdose lagern.',
    ]),

  backen('gebaeck', 'biscotti-al-limone', 'Biscotti al limone',
    {
      cuisine: 'it',
      time: 60,
      yields: { name: 'Biscotti al limone (selbstgebacken)', amount: 30, unit: 'Stk', shelf: 14, store: dose, frozen: 90 },
      lighter: 'Nur 120 g Zucker im Teig und eine dünne Glasur aus 50 g Puderzucker – spart rund 10 kcal pro Stück.',
    },
    '300 g Weizenmehl | 150 g Zucker | 100 g Butter | 2 Stk Ei | 2 Stk Zitrone unbehandelt | 2 TL Backpulver | 1 Prise Salz | 100 g Puderzucker',
    [
      'Die Zitronen heiß abwaschen, die Schale fein abreiben und den Saft von einer Zitrone auspressen.',
      'Die weiche Butter mit dem Zucker und der Zitronenschale cremig rühren, die Eier einzeln unterrühren. Weizenmehl, Backpulver und Salz mischen und zu einem weichen Teig verkneten.',
      'Den Ofen auf 180 °C Ober-/Unterhitze vorheizen. Zwei Bleche mit Backpapier belegen.',
      'Aus dem Teig 30 Kugeln (ca. 25 g) formen, zu Ovalen drücken und mit Abstand auf die Bleche legen.',
      'Die Biscotti in zwei Runden je 12–14 Minuten backen, bis sie nur Farbe an den Rändern haben, und auf einem Gitter auskühlen lassen.',
      'Den Puderzucker mit 2 EL Zitronensaft zu einer dickflüssigen Glasur rühren, die Biscotti damit bestreichen und trocknen lassen.',
    ]),
]

// Geräte-Schritte: gleiche Schritte wie oben, dazu die Einstellungen je Schritt-Nummer (ab 0); `texts` ersetzt einzelne Schritttexte
type Settings = NonNullable<DeviceStep['settings']>
const withDevices = (id: string, settings: Record<number, Settings>, texts: Record<number, string> = {}): DeviceStep[] =>
  recipes.find((r) => r.id === id)!.steps.map((t, i) => {
    const text = texts[i] ?? t
    return settings[i] ? { text, settings: settings[i] } : { text }
  })

const ouVorheizen = (temp: number): Settings => [{ device: 'combair', mode: 'Ober-/Unterhitze', temp, note: 'vorheizen' }]
/** Ein Blech, Ebene 2 */
const ouBacken = (temp: number, minutes: number, note = 'Ebene 2'): Settings => [{ device: 'combair', mode: 'Ober-/Unterhitze', temp, minutes, note }]
/** Zwei Bleche gleichzeitig: Heißluft (20 °C weniger), Ebene 1+3 */
const hlVorheizen = (temp: number): Settings => [{ device: 'combair', mode: 'Heißluft', temp, note: 'vorheizen' }]
const hlBacken = (temp: number, minutes: number): Settings => [{ device: 'combair', mode: 'Heißluft', temp, minutes, note: 'zwei Bleche, Ebene 1+3' }]
const wasserbad = (minutes?: number): Settings => [{ device: 'bora', mode: 'Kochzone', level: 'Schmelzen', ...(minutes ? { minutes } : {}), note: 'im Wasserbad' }]

export const gebaeck: ExtraGroup = {
  recipes,
  catalog: {
    molkerei: [],
    konserven: ['Johannisbeergelee', 'Cranberries getrocknet'],
    vorrat: ['Brauner Zucker', 'Bittermandelaroma'],
  },
  products: {
    Johannisbeergelee: prod(450, 'g', 1.99, 730, 90, 'Glas'),
    'Cranberries getrocknet': prod(125, 'g', 1.79, 365, 60, 'Pck'),
    'Brauner Zucker': prod(500, 'g', 1.49, 1095, 1095, 'Pck'),
    Bittermandelaroma: prod(8, 'TL', 0.99, 1095, 1095, 'Pck'),
  },
  nutrition: {
    Johannisbeergelee: [250, 0.3, 0, 61, 1],
    'Cranberries getrocknet': [330, 0.2, 1.4, 80, 5],
    'Brauner Zucker': [395, 0, 0, 98, 0],
    Bittermandelaroma: [0, 0, 0, 0, 0],
  },
  grams: {
  },
  deviceSteps: {
    // Zwei Bleche gleichzeitig (Heißluft 1+3, 20 °C weniger als Ober-/Unterhitze); bei den Plätzchen mit mehreren Runden
    vanillekipferl: withDevices('vanillekipferl', { 2: hlVorheizen(155), 4: hlBacken(155, 12) }),
    butterplaetzchen: withDevices('butterplaetzchen', { 2: hlVorheizen(160), 4: hlBacken(160, 9) }),
    spitzbuben: withDevices('spitzbuben', { 1: hlVorheizen(155), 3: hlBacken(155, 9) }),
    zimtsterne: withDevices('zimtsterne', { 2: hlVorheizen(130), 4: hlBacken(130, 10) }),
    kokosmakronen: withDevices('kokosmakronen', {
      0: [{ device: 'bora', mode: 'Kochzone', level: '3', minutes: 5, note: 'Wasserbad, nicht kochen' }],
      2: hlVorheizen(140),
      4: hlBacken(140, 16),
      5: wasserbad(),
    }),
    heidesand: withDevices('heidesand', {
      0: [
        { device: 'bora', mode: 'Kochzone', level: '4', minutes: 6, note: 'Butter bräunen' },
      ],
      3: hlVorheizen(155),
      5: hlBacken(155, 11),
    }),
    spritzgebaeck: withDevices('spritzgebaeck', { 1: hlVorheizen(160), 3: hlBacken(160, 11), 4: wasserbad() }),
    nussecken: withDevices('nussecken', {
      1: ouVorheizen(180),
      3: [
        { device: 'bora', mode: 'Kochzone', level: '5', note: 'aufkochen' },
        { device: 'bora', mode: 'Kochzone', level: '3', minutes: 2 },
      ],
      4: ouBacken(180, 27),
      5: wasserbad(),
    }),
    'chocolate-chip-cookies': withDevices('chocolate-chip-cookies', {
      2: hlVorheizen(160),
      4: hlBacken(160, 11),
    }),
    'double-chocolate-cookies': withDevices('double-chocolate-cookies', {
      0: wasserbad(),
      2: hlVorheizen(160),
      4: hlBacken(160, 10),
    }),
    'haferflocken-cranberry-cookies': withDevices('haferflocken-cranberry-cookies', {
      2: hlVorheizen(160),
      4: hlBacken(160, 13),
    }),
    'erdnussbutter-cookies': withDevices('erdnussbutter-cookies', {
      0: hlVorheizen(160),
      3: hlBacken(160, 11),
    }),
    'skyr-haferflocken-cookies': withDevices('skyr-haferflocken-cookies', {
      0: hlVorheizen(160),
      3: hlBacken(160, 13),
    }),
    cantuccini: withDevices('cantuccini', {
      2: ouVorheizen(180),
      4: ouBacken(180, 20, 'Ebene 2, Rollen'),
      5: hlBacken(140, 14),
    }),
    'amaretti-morbidi': withDevices('amaretti-morbidi', { 1: hlVorheizen(150), 3: hlBacken(150, 13) }),
    'baci-di-dama': withDevices('baci-di-dama', { 2: hlVorheizen(150), 4: hlBacken(150, 13), 5: wasserbad() }),
    'biscotti-al-limone': withDevices('biscotti-al-limone', { 2: hlVorheizen(160), 4: hlBacken(160, 13) }),
  },
  imageQueries: {
    vanillekipferl: 'Vanillekipferl',
    butterplaetzchen: 'Weihnachtsplätzchen Butterplätzchen cookie cutter',
    spitzbuben: 'Spitzbuben Linzer cookies jam',
    zimtsterne: 'Zimtsterne cinnamon star cookies',
    kokosmakronen: 'Kokosmakronen coconut macaroons',
    heidesand: 'Heidesand cookies',
    spritzgebaeck: 'Spritzgebäck piped butter cookies',
    nussecken: 'Nussecken nut triangle cookies',
    'chocolate-chip-cookies': 'Chocolate chip cookies',
    'double-chocolate-cookies': 'Double chocolate cookies',
    'haferflocken-cranberry-cookies': 'Oatmeal cranberry cookies',
    'erdnussbutter-cookies': 'Peanut butter cookies',
    'skyr-haferflocken-cookies': 'Oatmeal cookies',
    cantuccini: 'Cantuccini',
    'amaretti-morbidi': 'Amaretti morbidi',
    'baci-di-dama': 'Baci di dama',
    'biscotti-al-limone': 'Lemon biscotti cookies',
  },
}
