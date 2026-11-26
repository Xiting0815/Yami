import { salat } from '../../define'
import { vzug } from '../../device-helpers'
import type { ExtraGroup } from '../types'

/**
 * Salate & Beilagen · Kartoffel-, Reis-, Bohnen- und Gemüsesalate aller Küchen: schwäbischer und norddeutscher
 * Kartoffelsalat, Ensaladilla rusa, Ensalada de arroz, Empedrado (Bohnen mit Bacalao), Pipirrana, Esqueixada,
 * italienischer Reissalat, Linsensalat, griechischer Bauernsalat als Beilage, Krautsalat …
 * Anlegen mit `salat(id, titel, { group: 'kartoffel' | 'reis' | 'bohnen' | 'gemuese', cuisine, time, portions,
 * name: '… (selbstgemacht)', shelf, lighter }, zutaten, schritte)`. Die BBQ-Beilagen (src/data/extra/bbq/beilagen.ts)
 * erscheinen in diesem Bereich automatisch mit – dort Vorhandenes nicht doppelt anlegen (Southern Potato Salad, Coleslaw …).
 * Regeln: docs/spanien-regeln.md (Abschnitt Salate). Neue Fotos: Zeilen in scripts/fotos-neu-salate.md.
 */
export const salate: ExtraGroup = {
  recipes: [
    salat('ensaladilla-rusa', 'Ensaladilla rusa (spanischer Kartoffelsalat mit Thunfisch)',
      {
        group: 'kartoffel', cuisine: 'es', time: 90, portions: 6, name: 'Ensaladilla rusa (selbstgemacht)', shelf: 2,
        lighter: 'Ein Drittel der Mayonnaise durch Joghurt ersetzen und Thunfisch im eigenen Saft nehmen – spart rund 80 kcal je Portion.',
      },
      '500 g Kartoffeln festkochend | 1 Stk Möhre | 100 g Erbsen TK | 2 Stk Ei | 1 Dose Thunfisch in Olivenöl | 10 Stk Oliven grün | 1 Stk Piquillo-Paprika | 150 g Mayonnaise | 0.25 Stk Zitrone | Salz | Pfeffer',
      [
        'Kartoffeln und Möhre schälen und in 1 cm große Würfel schneiden. In Salzwasser 12 bis 15 Minuten weich, aber nicht zerfallen kochen, die Erbsen in den letzten 3 Minuten mitgaren. Die Eier 10 Minuten hart kochen. Alles abkühlen lassen.',
        'Den Thunfisch gut abtropfen lassen und zerpflücken, die Eier pellen – ein Ei grob hacken, eines für die Deko in Spalten schneiden. Die Oliven halbieren, die Piquillo-Paprika in Streifen schneiden.',
        'Die Mayonnaise mit 1 TL Zitronensaft glatt rühren. Kartoffeln, Möhre, Erbsen, Thunfisch, gehacktes Ei und die Hälfte der Oliven mit zwei Dritteln der Mayonnaise vorsichtig mischen, salzen und pfeffern – ein paar zerdrückte Kartoffelstücke machen die Ensaladilla typisch cremig.',
        'In eine flache Schale streichen, mit der übrigen Mayonnaise glatt überziehen und mit Eispalten, Oliven und Paprikastreifen belegen. Mindestens 1 Stunde kalt stellen und kalt servieren. Sie ist in jeder spanischen Bar eine Tapa – und hält gekühlt 2 Tage.',
      ]),
  ],
  catalog: {},
  products: {},
  nutrition: {},
  grams: {},
  deviceSteps: {
    'ensaladilla-rusa': [
      {
        text: 'Kartoffeln und Möhre schälen und in 1 cm große Würfel schneiden. Den Wasserbehälter des CombiSteamers füllen, die Würfel im gelochten Garbehälter auf Ebene 2 bei 100 °C 18 Minuten dämpfen; die Eier nach 6 Minuten dazulegen und die Erbsen in den letzten 3 Minuten dazugeben.',
        settings: [vzug('steamer', 'Dämpfen', 100, { minutes: 18, note: 'gelochter Garbehälter, Ebene 2; Eier ab Minute 6 mit' })],
      },
      { text: 'Die Eier kalt abschrecken, alles abkühlen lassen. Den Thunfisch gut abtropfen lassen und zerpflücken, die Eier pellen – ein Ei grob hacken, eines für die Deko in Spalten schneiden. Die Oliven halbieren, die Piquillo-Paprika in Streifen schneiden.' },
      { text: 'Die Mayonnaise mit 1 TL Zitronensaft glatt rühren. Kartoffeln, Möhre, Erbsen, Thunfisch, gehacktes Ei und die Hälfte der Oliven mit zwei Dritteln der Mayonnaise vorsichtig mischen, salzen und pfeffern – ein paar zerdrückte Kartoffelstücke machen die Ensaladilla typisch cremig.' },
      { text: 'In eine flache Schale streichen, mit der übrigen Mayonnaise glatt überziehen und mit Eispalten, Oliven und Paprikastreifen belegen. Mindestens 1 Stunde kalt stellen und kalt servieren. Sie ist in jeder spanischen Bar eine Tapa – und hält gekühlt 2 Tage.' },
    ],
  },
  imageQueries: {
    'ensaladilla-rusa': 'ensaladilla rusa',
  },
}
