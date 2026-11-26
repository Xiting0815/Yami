import { tapa } from '../../define'
import { bora } from '../../device-helpers'
import type { ExtraGroup } from '../types'

/**
 * Tapas · Gemüse, Ei & Kartoffel, Brot & Dips: drei Untergruppen in einer Datei –
 *   group 'gemuese': Pimientos de Padrón, Champiñones al ajillo, Berenjenas con miel, Espinacas con garbanzos, Pisto …
 *   group 'ei':      Tortilla de patatas, Patatas bravas, Patatas alioli, Huevos rotos, Ensaladilla als Tapa …
 *   group 'brot':    Pan con tomate, Pan con alioli, Montaditos, Queso manchego con membrillo, Aceitunas aliñadas …
 * Anlegen mit `tapa(id, 'Spanischer Titel (deutsche Erklärung)', { group, time, serve, ahead? }, zutaten, schritte)`.
 * Saucen nur über die kaufbaren Grundnamen ('Alioli', 'Salsa brava', 'Romesco', 'Mojo rojo', 'Mojo verde') – das
 * Selbstgemachte aus tapas/saucen.ts nimmt Yami automatisch zuerst. Mengen: EIN Teller für 2 Personen als eine von ca. 5 Tapas.
 * Regeln: docs/spanien-regeln.md. Neue Fotos: Zeilen in scripts/fotos-neu-tapas-gemuese.md.
 */
export const tapasGemuese: ExtraGroup = {
  recipes: [
    tapa('tortilla-de-patatas', 'Tortilla de patatas (spanisches Kartoffel-Omelett)',
      { group: 'ei', time: 45, serve: 'lauwarm', ahead: 'Tortilla bis 2 Stunden vorher braten – lauwarm schmeckt sie am besten', lighter: 'Die Kartoffeln nach dem Garen gründlich im Sieb abtropfen lassen und das Öl wiederverwenden – so bleibt nur rund 1 EL Öl in der Tortilla.' },
      '180 g Kartoffeln festkochend | 2 Stk Ei | 0.5 Stk Zwiebel | 1 EL Olivenöl | Salz',
      [
        'Die Kartoffeln schälen, vierteln und in 3 mm dünne Scheiben schneiden, die Zwiebel in feine Streifen. Mit Salz mischen.',
        'Reichlich Olivenöl (ca. 150 ml, es wird danach abgegossen und wiederverwendet) in einer kleinen Pfanne (16–18 cm) erwärmen. Kartoffeln und Zwiebel darin bei kleiner Hitze 20 Minuten weich schmoren, nicht braten – sie sollen hell bleiben. In ein Sieb gießen und das Öl auffangen.',
        'Die Eier in einer Schüssel mit einer Prise Salz verquirlen, die noch warmen Kartoffeln untermischen und 10 Minuten ziehen lassen – so wird die Tortilla saftig.',
        '1 EL vom aufgefangenen Öl in der Pfanne erhitzen, die Masse hineingeben, glatt streichen und bei mittlerer Hitze 3 Minuten stocken lassen, dabei die Pfanne rütteln, damit nichts ansetzt.',
        'Einen flachen Teller auflegen, die Pfanne mit Schwung umdrehen, die Tortilla zurück in die Pfanne gleiten lassen und 2 Minuten fertig braten. Innen darf sie noch leicht cremig sein („jugosa“).',
        'Auf einen Teller gleiten lassen und lauwarm in Würfeln oder Spalten servieren. Mit oder ohne Zwiebel ist in Spanien eine Glaubensfrage – hier mit.',
      ]),
  ],
  catalog: {},
  products: {},
  nutrition: {},
  grams: {},
  deviceSteps: {
    'tortilla-de-patatas': [
      { text: 'Die Kartoffeln schälen, vierteln und in 3 mm dünne Scheiben schneiden, die Zwiebel in feine Streifen. Mit Salz mischen.' },
      {
        text: 'Reichlich Olivenöl (ca. 150 ml, es wird danach abgegossen und wiederverwendet) in einer kleinen Pfanne (16–18 cm) auf dem BORA erwärmen. Kartoffeln und Zwiebel darin 20 Minuten weich schmoren, nicht braten – sie sollen hell bleiben. In ein Sieb gießen und das Öl auffangen.',
        settings: [bora('4', { minutes: 20 })],
      },
      { text: 'Die Eier in einer Schüssel mit einer Prise Salz verquirlen, die noch warmen Kartoffeln untermischen und 10 Minuten ziehen lassen – so wird die Tortilla saftig.' },
      {
        text: '1 EL vom aufgefangenen Öl in der Pfanne erhitzen, die Masse hineingeben, glatt streichen und 3 Minuten stocken lassen, dabei die Pfanne rütteln, damit nichts ansetzt.',
        settings: [bora('6', { minutes: 3 })],
      },
      {
        text: 'Einen flachen Teller auflegen, die Pfanne mit Schwung umdrehen, die Tortilla zurück in die Pfanne gleiten lassen und 2 Minuten fertig braten. Innen darf sie noch leicht cremig sein („jugosa“).',
        settings: [bora('6', { minutes: 2 })],
      },
      { text: 'Auf einen Teller gleiten lassen und lauwarm in Würfeln oder Spalten servieren. Mit oder ohne Zwiebel ist in Spanien eine Glaubensfrage – hier mit.' },
    ],
  },
  imageQueries: {
    'tortilla-de-patatas': 'tortilla de patatas',
  },
}
