// Backen & Desserts – Gruppe „Spanische Desserts“ (Crema catalana, Churros con chocolate, Tarta de Santiago, Flan de huevo,
// Torrijas, Arroz con leche, Leche frita …). Nur diese Datei bearbeiten. Regeln: docs/backen-regeln.md und
// docs/spanien-regeln.md (spanischer Titel mit deutscher Erklärung, Bezugsquellen).
// Anlegen mit `backen('dessert' | 'kuchen' | 'gebaeck', id, titel, { cuisine: 'es', time, yields, lighter }, zutaten, schritte)`;
// Tarta de Santiago ist ein Kuchen (`'kuchen'`, Ergebnis in Stk), Churros Gebäck oder Dessert (Portion).
// Gemeinsame Spanien-Zutaten: src/data/extra/zutaten-es.ts. Neue Fotos: Zeilen in scripts/fotos-neu-desserts-es.md.
import { backen, prod } from '../define'
import { bora, vzug } from '../device-helpers'
import type { DeviceSetting } from '../../types'
import type { ExtraGroup } from './types'

/** Airfryer-Einstellung (Heißluft, Temperatur, Minuten) */
const airfryer = (temp: number, minutes: number, note?: string): DeviceSetting => ({
  device: 'airfryer',
  mode: 'Heissluft',
  temp,
  minutes,
  ...(note ? { note } : {}),
})

export const dessertsEs: ExtraGroup = {
  recipes: [
    backen('dessert', 'crema-catalana', 'Crema catalana (katalanische Creme mit Karamellkruste)',
      {
        cuisine: 'es',
        time: 270,
        yields: { name: 'Crema catalana (selbstgemacht)', amount: 4, unit: 'Portion', shelf: 2, store: 'im Kühlschrank (abgedeckt, ohne Kruste)' },
        lighter: 'Halb Milch, halb fettarme Milch und nur 60 g Zucker in der Creme – die Karamellkruste bleibt, spart rund 40 kcal je Portion.',
      },
      '500 ml Milch | 1 Stk Zimtstange | 0.5 Stk Zitrone unbehandelt | 4 Stk Eigelb | 80 g Zucker | 2 EL Speisestärke | 4 TL Zucker',
      [
        'Die Schale der halben Zitrone in breiten Streifen dünn abschälen (nur das Gelbe). 400 ml Milch mit Zimtstange und Zitronenschale aufkochen, vom Herd nehmen und 15 Minuten ziehen lassen.',
        'Eigelbe, 80 g Zucker und Speisestärke mit der übrigen kalten Milch glatt rühren. Zimt und Zitronenschale aus der Milch fischen, die heiße Milch unter Rühren zur Eigelbmischung gießen.',
        'Alles zurück in den Topf geben und bei kleiner Hitze ständig mit dem Holzlöffel rühren, bis die Creme dick wird – sie darf nur einmal kurz aufwallen, sonst gerinnt das Eigelb.',
        'In 4 flache Tonschälchen („Cazuelitas“) füllen, abkühlen lassen und mindestens 4 Stunden kalt stellen.',
        'Kurz vor dem Servieren je 1 TL Zucker dünn darüberstreuen und mit einem Küchenbrenner zu einer glasigen Kruste karamellisieren – in Katalonien traditionell mit einem glühenden Eisen („Pala“). Die Kruste 1 Minute fest werden lassen und sofort servieren; sie muss beim Löffeln krachen.',
      ]),

    backen('dessert', 'churros-con-chocolate', 'Churros con chocolate (Spritzgebäck mit dicker Trinkschokolade)',
      {
        cuisine: 'es',
        time: 45,
        yields: { name: 'Churros con chocolate (selbstgemacht)', amount: 4, unit: 'Portion', shelf: 1, store: 'Churros bei Raumtemperatur, Schokolade im Kühlschrank' },
        lighter: 'Die Schokolade mit fettarmer Milch und nur 70 g Zartbitterschokolade kochen und die Churros nicht in Zucker wälzen – spart rund 90 kcal pro Portion.',
      },
      '125 g Weizenmehl | Salz | 2 EL Sonnenblumenöl | 400 ml Milch | 100 g Zartbitterschokolade | 15 g Speisestärke | 50 g Zucker',
      [
        '250 ml Wasser mit 1 Prise Salz aufkochen. Vom Herd nehmen, das Weizenmehl auf einmal hineinschütten und mit dem Kochlöffel kräftig zu einem glatten, festen Teig rühren, der sich vom Topfboden löst. 5 Minuten abkühlen lassen.',
        'Den Teig in eine Churrera oder einen stabilen Spritzbeutel mit großer Sterntülle (ca. 1 cm) füllen – die Sterne sind wichtig, glatte Stränge platzen beim Backen auf.',
        'Reichlich Frittieröl (ca. 1 l) in einem Topf auf 180 °C erhitzen. Den Teig in 12 cm langen Stücken direkt ins Öl spritzen, mit der Küchenschere abschneiden und portionsweise 3–4 Minuten goldbraun ausbacken. Auf Küchenpapier abtropfen lassen. Fettärmer im Airfryer mit dem Sonnenblumenöl (siehe Geräte-Schritte).',
        'Für die Schokolade die Speisestärke mit 100 ml kalter Milch glatt rühren. Die übrige Milch erhitzen, die gehackte Zartbitterschokolade und 2 EL vom Zucker darin schmelzen, die angerührte Stärke einrühren und unter Rühren köcheln, bis die Schokolade dick und cremig ist – der Churro soll darin stecken bleiben.',
        'Die heißen Churros im restlichen Zucker wälzen und mit der Schokolade in Tassen servieren. In Madrid isst man sie zum Frühstück oder nach einer langen Nacht (Chocolatería San Ginés).',
      ]),

    backen('kuchen', 'tarta-de-santiago', 'Tarta de Santiago (galicischer Mandelkuchen ohne Mehl)',
      {
        cuisine: 'es',
        time: 75,
        yields: { name: 'Tarta de Santiago (selbstgebacken)', amount: 12, unit: 'Stk', shelf: 5, store: 'luftdicht bei Raumtemperatur', frozen: 60 },
        lighter: 'Die Torte in 16 statt 12 Stücke schneiden und den Zucker auf 180 g reduzieren – spart rund 85 kcal pro Stück.',
      },
      '10 g Butter | 5 Stk Ei | 250 g Zucker | 250 g Mandeln gemahlen | 1 Stk Zitrone unbehandelt | 0.5 TL Zimt gemahlen | 2 EL Puderzucker',
      [
        'Den Backofen auf 180 °C Ober-/Unterhitze vorheizen. Eine Springform (24–26 cm) mit der Butter einfetten und den Boden mit Backpapier belegen.',
        'Die Eier mit dem Zucker 5 Minuten mit dem Handrührgerät hell und schaumig schlagen. Die Schale der Zitrone fein abreiben.',
        'Die gemahlenen Mandeln (am besten blanchiert, original aus Galicien), Zitronenschale und Zimt mit dem Teigschaber vorsichtig unterheben, bis kein Mandelmehl mehr zu sehen ist. Echte Tarta de Santiago (g.g.A.) hat mindestens ein Drittel Mandeln und kein Mehl.',
        'Den Teig in die Form füllen, glatt streichen und auf mittlerer Schiene 35–40 Minuten backen, bis die Oberfläche goldbraun ist und ein Holzstäbchen sauber herauskommt.',
        'In der Form abkühlen lassen. Eine Schablone des Santiago-Kreuzes (Jakobskreuz, im Internet als Vorlage) aus Papier in die Mitte legen, dick mit Puderzucker bestäuben und die Schablone vorsichtig abheben.',
      ]),

    backen('dessert', 'flan-de-huevo', 'Flan de huevo (spanischer Karamell-Eierpudding)',
      {
        cuisine: 'es',
        time: 300,
        yields: { name: 'Flan de huevo (selbstgemacht)', amount: 4, unit: 'Portion', shelf: 3, store: 'im Kühlschrank (abgedeckt in den Förmchen)' },
        lighter: 'Mit fettarmer Milch und nur 50 g Zucker in der Eiermasse – das Karamell bleibt, spart rund 45 kcal pro Portion.',
      },
      '160 g Zucker | 500 ml Milch | 0.5 Stk Zitrone unbehandelt | 1 Stk Zimtstange | 4 Stk Ei',
      [
        'Für das Karamell 80 g vom Zucker mit 2 EL Wasser in einem kleinen Topf bei mittlerer Hitze schmelzen, ohne zu rühren (nur schwenken), bis er bernsteinfarben ist. Sofort auf 4 ofenfeste Förmchen (ca. 150 ml, „flaneras“) verteilen und schwenken, sodass der Boden bedeckt ist.',
        'Die Schale der halben Zitrone in breiten Streifen dünn abschälen. Die Milch mit Zitronenschale und Zimtstange aufkochen, vom Herd nehmen und 10 Minuten ziehen lassen.',
        'Die Eier mit dem restlichen Zucker nur verrühren, nicht schaumig schlagen (Luftblasen machen den Flan löchrig). Die warme Milch durch ein Sieb unter Rühren dazugießen, Schaum abschöpfen und die Masse in die Förmchen füllen.',
        'Die Förmchen in eine Auflaufform stellen, heißes Wasser bis zur halben Höhe angießen und im Wasserbad bei 160 °C etwa 45 Minuten stocken lassen. Garprobe: Der Flan wackelt nur noch in der Mitte leicht, ein Messer kommt sauber heraus.',
        'Abkühlen lassen und mindestens 4 Stunden kalt stellen. Zum Servieren mit einem Messer am Rand lösen, einen Teller auflegen und stürzen – das Karamell läuft als Sauce darüber.',
      ]),

    backen('dessert', 'torrijas', 'Torrijas (Semana-Santa-Brotschnitten in Zimtmilch)',
      {
        cuisine: 'es',
        time: 50,
        yields: { name: 'Torrijas (selbstgemacht)', amount: 4, unit: 'Portion', shelf: 2, store: 'im Kühlschrank (abgedeckt)' },
        festive: ['ostern'],
        lighter: 'Die Torrijas nur mit 1 EL Öl bepinselt im Airfryer backen statt in der Pfanne auszubraten und mit fettarmer Milch tränken – spart rund 100 kcal pro Portion.',
      },
      '1 Stk Ciabatta | 500 ml Milch | 1 Stk Zimtstange | 0.5 Stk Zitrone unbehandelt | 110 g Zucker | 2 Stk Ei | 4 EL Olivenöl | 1 TL Zimt gemahlen',
      [
        'Das Brot vom Vortag (Ciabatta oder ein festes Baguette; in Spanien gibt es zur Osterzeit eigenes „pan de torrijas“) in 8 Scheiben von 2 cm schneiden.',
        'Die Schale der halben Zitrone dünn abschälen. Die Milch mit Zimtstange, Zitronenschale und 60 g vom Zucker aufkochen, vom Herd nehmen und 15 Minuten ziehen lassen, bis sie lauwarm ist.',
        'Die Brotscheiben nebeneinander in eine flache Form legen, die Milch durch ein Sieb darübergießen und 2 Minuten je Seite tränken lassen – sie sollen vollgesogen sein, aber nicht zerfallen. Auf einem Gitter kurz abtropfen lassen.',
        'Die Eier in einem tiefen Teller verquirlen. Das Olivenöl in einer großen Pfanne erhitzen, die Scheiben durch das Ei ziehen und portionsweise 2 Minuten je Seite goldbraun braten. Auf Küchenpapier abtropfen lassen.',
        'Den restlichen Zucker mit dem Zimt mischen und die Torrijas darin wälzen. Lauwarm oder kalt servieren – in ganz Spanien das typische Gebäck der Karwoche (Semana Santa).',
      ]),

    backen('dessert', 'arroz-con-leche', 'Arroz con leche (asturischer Milchreis mit Zimt und Zitrone)',
      {
        cuisine: 'es',
        time: 60,
        yields: { name: 'Arroz con leche (selbstgemacht)', amount: 4, unit: 'Portion', shelf: 3, store: 'im Kühlschrank (abgedeckt)' },
        lighter: 'Mit fettarmer Milch und nur 50 g Zucker kochen – spart rund 45 kcal pro Portion.',
      },
      '800 ml Milch | 1 Stk Zimtstange | 0.5 Stk Zitrone unbehandelt | 80 g Milchreis | 70 g Zucker | 1 TL Zimt gemahlen',
      [
        'Die Schale der halben Zitrone in breiten Streifen dünn abschälen (nur das Gelbe). Die Milch mit Zimtstange und Zitronenschale in einem schweren Topf aufkochen.',
        'Den Milchreis (Rundkornreis; in Spanien „arroz redondo“) einstreuen und bei kleiner Hitze offen 30 Minuten leise köcheln lassen, dabei häufig rühren, damit nichts ansetzt.',
        'Den Zucker einrühren und weitere 10 Minuten köcheln, bis der Reis weich und die Masse cremig, aber noch flüssig ist – beim Abkühlen dickt sie stark nach. Zucker erst jetzt, sonst bleibt der Reis hart.',
        'Zimtstange und Zitronenschale herausfischen, den Milchreis in Schälchen füllen, abkühlen lassen und mindestens 1 Stunde kalt stellen. Vor dem Servieren mit Zimt bestäuben. In Asturien wird die Oberfläche mit Zucker bestreut und karamellisiert („requemado“).',
      ]),
  ],
  catalog: {
    konserven: ['Milchreis'],
  },
  products: {
    Milchreis: prod(500, 'g', 1.19, 365, 180, 'Pck'),
  },
  nutrition: {
    Milchreis: [350, 7, 0.6, 78, 1.4],
  },
  grams: {},
  deviceSteps: {
    'crema-catalana': [
      {
        text: 'Die Schale der halben Zitrone in breiten Streifen dünn abschälen (nur das Gelbe). 400 ml Milch mit Zimtstange und Zitronenschale im Topf auf dem BORA aufkochen, vom Kochfeld nehmen und 15 Minuten ziehen lassen.',
        settings: [bora('7', { note: 'aufkochen, dann vom Kochfeld' })],
      },
      { text: 'Eigelbe, 80 g Zucker und Speisestärke mit der übrigen kalten Milch glatt rühren. Zimt und Zitronenschale aus der Milch fischen, die heiße Milch unter Rühren zur Eigelbmischung gießen.' },
      {
        text: 'Alles zurück in den Topf geben und auf dem BORA ständig mit dem Holzlöffel rühren, bis die Creme dick wird (ca. 5 Minuten) – sie darf nur einmal kurz aufwallen, sonst gerinnt das Eigelb.',
        settings: [bora('4', { minutes: 5, note: 'ständig rühren' })],
      },
      { text: 'In 4 flache Tonschälchen („Cazuelitas“) füllen, abkühlen lassen und mindestens 4 Stunden kalt stellen.' },
      {
        text: 'Kurz vor dem Servieren je 1 TL Zucker dünn darüberstreuen und mit einem Küchenbrenner zu einer glasigen Kruste karamellisieren – in Katalonien traditionell mit einem glühenden Eisen („Pala“). Ohne Brenner: die eiskalten Schälchen auf der obersten Ebene unter den Grill des Combair stellen und 2–3 Minuten karamellisieren, dabei zusehen. Die Kruste 1 Minute fest werden lassen und sofort servieren; sie muss beim Löffeln krachen.',
        settings: [vzug('combair', 'Grill', undefined, { minutes: 3, note: 'nur ohne Küchenbrenner, oberste Ebene' })],
      },
    ],
    'churros-con-chocolate': [
      {
        text: '250 ml Wasser mit 1 Prise Salz und dem Sonnenblumenöl bis auf 1 EL im Topf auf dem BORA aufkochen. Vom Kochfeld nehmen, das Weizenmehl auf einmal hineinschütten und kräftig zu einem glatten, festen Teig rühren, der sich vom Topfboden löst. 5 Minuten abkühlen lassen.',
        settings: [bora('Power', { note: 'aufkochen, dann vom Kochfeld' })],
      },
      { text: 'Den Teig in eine Churrera oder einen stabilen Spritzbeutel mit großer Sterntülle (ca. 1 cm) füllen – die Sterne sind wichtig, glatte Stränge platzen auf. 12 cm lange Stränge auf ein Stück Backpapier spritzen und 15 Minuten ins Gefrierfach legen, damit sie im Airfryer ihre Form behalten.' },
      {
        text: 'Den Airfryer auf 200 °C vorheizen. Die Churros mit dem restlichen Öl bepinseln, mit etwas Abstand in den Korb legen und 12 Minuten goldbraun backen, nach der Hälfte der Zeit wenden. Sie werden etwas fester als frittiert; klassisch werden sie in heißem Öl ausgebacken (siehe klassische Schritte).',
        settings: [airfryer(200, 12, 'vorheizen, nach der Hälfte wenden')],
      },
      {
        text: 'Für die Schokolade die Speisestärke mit 100 ml kalter Milch glatt rühren. Die übrige Milch im Topf auf dem BORA erhitzen, die gehackte Zartbitterschokolade und 2 EL vom Zucker darin schmelzen, die angerührte Stärke einrühren und unter Rühren 3 Minuten köcheln, bis die Schokolade dick und cremig ist – der Churro soll darin stecken bleiben.',
        settings: [bora('4', { minutes: 3, note: 'ständig rühren' })],
      },
      { text: 'Die heißen Churros im restlichen Zucker wälzen und mit der Schokolade in Tassen servieren. In Madrid isst man sie zum Frühstück oder nach einer langen Nacht (Chocolatería San Ginés).' },
    ],
    'tarta-de-santiago': [
      {
        text: 'Den Combair auf 180 °C Ober-/Unterhitze vorheizen. Eine Springform (24–26 cm) mit der Butter einfetten und den Boden mit Backpapier belegen.',
        settings: [vzug('combair', 'Ober-/Unterhitze', 180, { note: 'vorheizen, Ebene 2' })],
      },
      { text: 'Die Eier mit dem Zucker 5 Minuten mit dem Handrührgerät hell und schaumig schlagen. Die Schale der Zitrone fein abreiben.' },
      { text: 'Die gemahlenen Mandeln (am besten blanchiert, original aus Galicien), Zitronenschale und Zimt mit dem Teigschaber vorsichtig unterheben, bis kein Mandelmehl mehr zu sehen ist. Echte Tarta de Santiago (g.g.A.) hat mindestens ein Drittel Mandeln und kein Mehl.' },
      {
        text: 'Den Teig in die Form füllen, glatt streichen und im Combair auf Ebene 2 35–40 Minuten backen, bis die Oberfläche goldbraun ist und ein Holzstäbchen sauber herauskommt.',
        settings: [vzug('combair', 'Ober-/Unterhitze', 180, { minutes: 40, note: 'Ebene 2' })],
      },
      { text: 'In der Form abkühlen lassen. Eine Schablone des Santiago-Kreuzes (Jakobskreuz, im Internet als Vorlage) aus Papier in die Mitte legen, dick mit Puderzucker bestäuben und die Schablone vorsichtig abheben.' },
    ],
    'flan-de-huevo': [
      {
        text: 'Für das Karamell 80 g vom Zucker mit 2 EL Wasser in einem kleinen Topf auf dem BORA schmelzen, ohne zu rühren (nur schwenken), bis er nach etwa 6 Minuten bernsteinfarben ist. Sofort auf 4 hitzefeste Förmchen (ca. 150 ml, „flaneras“) verteilen und schwenken, sodass der Boden bedeckt ist.',
        settings: [bora('6', { minutes: 6, note: 'nicht rühren' })],
      },
      {
        text: 'Die Schale der halben Zitrone in breiten Streifen dünn abschälen. Die Milch mit Zitronenschale und Zimtstange auf dem BORA aufkochen, vom Kochfeld nehmen und 10 Minuten ziehen lassen.',
        settings: [bora('6', { note: 'aufkochen, dann vom Kochfeld' })],
      },
      { text: 'Die Eier mit dem restlichen Zucker nur verrühren, nicht schaumig schlagen (Luftblasen machen den Flan löchrig). Die warme Milch durch ein Sieb unter Rühren dazugießen, Schaum abschöpfen und die Masse in die Förmchen füllen. Den Wasserbehälter des CombiSteamers füllen.' },
      {
        text: 'Die Förmchen mit Alufolie abdecken, auf den Gitterrost stellen und im CombiSteamer bei 90 °C 30 Minuten dämpfen. Garprobe: Der Flan wackelt nur noch in der Mitte leicht, ein Messer kommt sauber heraus – sonst 5 Minuten nachgaren.',
        settings: [vzug('steamer', 'Dämpfen', 90, { minutes: 30, note: 'Förmchen abgedeckt, Gitterrost' })],
      },
      { text: 'Abkühlen lassen und mindestens 4 Stunden kalt stellen. Zum Servieren mit einem Messer am Rand lösen, einen Teller auflegen und stürzen – das Karamell läuft als Sauce darüber.' },
    ],
    torrijas: [
      { text: 'Das Brot vom Vortag (Ciabatta oder ein festes Baguette; in Spanien gibt es zur Osterzeit eigenes „pan de torrijas“) in 8 Scheiben von 2 cm schneiden.' },
      {
        text: 'Die Schale der halben Zitrone dünn abschälen. Die Milch mit Zimtstange, Zitronenschale und 60 g vom Zucker im Topf auf dem BORA aufkochen, vom Kochfeld nehmen und 15 Minuten ziehen lassen, bis sie lauwarm ist.',
        settings: [bora('6', { note: 'aufkochen, dann vom Kochfeld' })],
      },
      { text: 'Die Brotscheiben nebeneinander in eine flache Form legen, die Milch durch ein Sieb darübergießen und 2 Minuten je Seite tränken lassen – sie sollen vollgesogen sein, aber nicht zerfallen. Auf einem Gitter kurz abtropfen lassen.' },
      {
        text: 'Die Eier in einem tiefen Teller verquirlen. Das Olivenöl in einer großen Pfanne auf dem BORA erhitzen, die Scheiben durch das Ei ziehen und portionsweise 2 Minuten je Seite goldbraun braten. Auf Küchenpapier abtropfen lassen.',
        settings: [bora('5', { minutes: 4, note: 'je Durchgang' })],
      },
      { text: 'Den restlichen Zucker mit dem Zimt mischen und die Torrijas darin wälzen. Lauwarm oder kalt servieren – in ganz Spanien das typische Gebäck der Karwoche (Semana Santa).' },
    ],
    'arroz-con-leche': [
      {
        text: 'Die Schale der halben Zitrone in breiten Streifen dünn abschälen (nur das Gelbe). Die Milch mit Zimtstange und Zitronenschale in einem schweren Topf auf dem BORA aufkochen.',
        settings: [bora('6', { note: 'aufkochen' })],
      },
      {
        text: 'Den Milchreis (Rundkornreis; in Spanien „arroz redondo“) einstreuen und offen 30 Minuten leise köcheln lassen, dabei häufig rühren, damit nichts ansetzt.',
        settings: [bora('3', { minutes: 30, note: 'häufig rühren' })],
      },
      {
        text: 'Den Zucker einrühren und weitere 10 Minuten köcheln, bis der Reis weich und die Masse cremig, aber noch flüssig ist – beim Abkühlen dickt sie stark nach. Zucker erst jetzt, sonst bleibt der Reis hart.',
        settings: [bora('3', { minutes: 10 })],
      },
      { text: 'Zimtstange und Zitronenschale herausfischen, den Milchreis in Schälchen füllen, abkühlen lassen und mindestens 1 Stunde kalt stellen. Vor dem Servieren mit Zimt bestäuben. In Asturien wird die Oberfläche mit Zucker bestreut und karamellisiert („requemado“).' },
    ],
  },
  imageQueries: {
    'crema-catalana': 'crema catalana',
    'churros-con-chocolate': 'churros con chocolate',
    'tarta-de-santiago': 'tarta de Santiago',
    'flan-de-huevo': 'flan de huevo',
    torrijas: 'torrijas',
    'arroz-con-leche': 'arroz con leche',
  },
}
