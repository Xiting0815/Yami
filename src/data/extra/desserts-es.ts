// Backen & Desserts – Gruppe „Spanische Desserts“ (Crema catalana, Churros con chocolate, Tarta de Santiago, Flan de huevo,
// Torrijas, Arroz con leche, Leche frita …). Nur diese Datei bearbeiten. Regeln: docs/backen-regeln.md und
// docs/spanien-regeln.md (spanischer Titel mit deutscher Erklärung, Bezugsquellen).
// Anlegen mit `backen('dessert' | 'kuchen' | 'gebaeck', id, titel, { cuisine: 'es', time, yields, lighter }, zutaten, schritte)`;
// Tarta de Santiago ist ein Kuchen (`'kuchen'`, Ergebnis in Stk), Churros Gebäck oder Dessert (Portion).
// Gemeinsame Spanien-Zutaten: src/data/extra/zutaten-es.ts. Neue Fotos: Zeilen in scripts/fotos-neu-desserts-es.md.
import { backen } from '../define'
import { bora, vzug } from '../device-helpers'
import type { ExtraGroup } from './types'

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
  ],
  catalog: {},
  products: {},
  nutrition: {},
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
  },
  imageQueries: {
    'crema-catalana': 'crema catalana',
  },
}
