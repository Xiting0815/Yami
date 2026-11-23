import type { DeviceStep } from '../../types'
import { bora } from '../device-helpers'

/** Geräte-Schritte (Rezept-ID → Schritte), Gruppe: us (Küche „Amerikanisch“, Wischstapel). Stil siehe docs/geraete/regeln.md */
export const DEVICE_STEPS: Record<string, DeviceStep[]> = {
  jambalaya: [
    {
      text: 'Die Garnelen im Kühlschrank auftauen lassen. Hähnchen in mundgerechte Stücke, die Cabanossi in Scheiben schneiden. Zwiebel, Paprika und Staudensellerie würfeln (die „Holy Trinity“ der Cajun-Küche), Knoblauch hacken.',
    },
    {
      text: 'Den breiten Topf auf dem BORA 1 Minute vorheizen, Hähnchen und Cabanossi im Sonnenblumenöl kräftig anbraten und herausnehmen.',
      settings: [bora('8', { note: 'Topf vorheizen' })],
    },
    {
      text: 'Zwiebel, Paprika und Staudensellerie im Bratfett 5 Minuten weich dünsten, Knoblauch, Cajun-Gewürz und Tomatenmark kurz mitrösten.',
      settings: [bora('5', { minutes: 5 })],
    },
    {
      text: 'Gehackte Tomaten, Hühnerbrühe, Langkornreis und Lorbeerblatt zugeben, Fleisch und Wurst wieder hinein. Auf Powerstufe aufkochen, dann mit Deckel 20 Minuten garen, ohne umzurühren.',
      settings: [bora('Power', { note: 'aufkochen' }), bora('2', { minutes: 20, note: 'Deckel drauf' })],
    },
    {
      text: 'Die Garnelen auf den Reis legen, zudecken und 5 Minuten garziehen lassen. Durchmischen, mit Salz und Pfeffer abschmecken und mit Frühlingszwiebelringen bestreuen.',
      settings: [bora('Simmern', { minutes: 5 })],
    },
  ],
  'pulled-pork-quesadillas': [
    {
      text: 'Das Pulled Pork (aus dem Vorrat am Vortag im Kühlschrank auftauen) mit der BBQ-Sauce im kleinen Topf erwärmen. Mais abtropfen lassen, Zwiebel fein würfeln.',
      settings: [bora('4', { minutes: 5 })],
    },
    {
      text: 'Die Vollkorn-Tortillas jeweils auf einer Hälfte mit Cheddar, Pulled Pork, Mais und Zwiebel belegen und zusammenklappen.',
    },
    {
      text: 'Die große Pfanne ohne Fett 1 Minute vorheizen und die Quesadillas von jeder Seite 3 Minuten goldbraun braten, bis der Käse schmilzt.',
      settings: [bora('5', { minutes: 6, note: 'je Seite 3 Min.' })],
    },
    {
      text: 'Saure Sahne mit Limettensaft und Salz verrühren. Die Quesadillas halbieren, mit Koriander bestreuen und mit dem Limetten-Dip servieren.',
    },
  ],
}
