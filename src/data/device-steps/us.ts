import type { DeviceStep } from '../../types'
import { bora, vzug } from '../device-helpers'
import type { DeviceSetting } from '../../types'

/** Airfryer (Heissluft 80–200 °C) */
const airfryer = (temp: number, minutes: number, note?: string, core?: number): DeviceSetting => ({
  device: 'airfryer',
  mode: 'Heissluft',
  temp,
  minutes,
  ...(core != null ? { core } : {}),
  ...(note ? { note } : {}),
})

/** Langkornreis im CombiSteamer (flache Schale, Wasser 1:1,5) */
const reis = (gramm: number, vorher = 'Inzwischen'): DeviceStep => ({
  text: `${vorher} den Wasserbehälter des CombiSteamers füllen. Den Langkornreis mit ${Math.round(gramm * 1.5)} ml Wasser und etwas Salz in eine flache Schale geben, auf den gelochten Garbehälter auf Ebene 2 stellen und bei 100 °C 22 Minuten dämpfen.`,
  settings: [vzug('steamer', 'Dämpfen', 100, { minutes: 22, note: 'flache Schale, Ebene 2' })],
})

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
      text: 'Die Garnelen auf den Reis legen, zudecken und 5 Minuten garziehen lassen. Durchmischen, mit Salz und Pfeffer abschmecken und mit Frühlingszwiebelringen bestreuen. Das ist die rote Creole-Jambalaya aus New Orleans (mit Tomaten); die Cajun-Variante vom Land kommt ohne Tomaten aus und wird durch sehr dunkel angebratenes Fleisch braun.',
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
  'chicken-andouille-gumbo': [
    {
      text: 'Zwiebel, Paprika und Staudensellerie fein würfeln (die „Holy Trinity“ der Cajun-Küche), Knoblauch hacken. Das Hähnchen in mundgerechte Stücke schneiden und mit 1 TL Cajun-Gewürz würzen, die Cabanossi in Scheiben schneiden – sie ersetzt die grobe, kräftig geräucherte Andouille aus Louisiana. Alles bereitstellen: bei der Roux muss man ununterbrochen rühren.',
    },
    {
      text: 'Einen schweren Topf auf dem BORA 1 Minute vorheizen, Hähnchen und Wurst in 1 EL vom Sonnenblumenöl kräftig anbraten und herausnehmen.',
      settings: [bora('8', { note: 'Topf vorheizen' })],
    },
    {
      text: 'Für die dunkle Roux das restliche Öl und das Weizenmehl im selben Topf verrühren und unter ständigem Rühren mit einem flachen Holzspatel 20 bis 25 Minuten rösten, bis die Mehlschwitze die Farbe von Zartbitterschokolade hat und nussig riecht. Nicht weggehen: schwarze Pünktchen heißen verbrannt – dann neu anfangen.',
      settings: [bora('4', { minutes: 25, note: 'ständig rühren' })],
    },
    {
      text: 'Sofort Zwiebel, Paprika und Sellerie in die heiße Roux geben – das stoppt das Rösten – und 5 Minuten weich dünsten, Knoblauch und restliches Cajun-Gewürz 1 Minute mitrösten.',
      settings: [bora('4', { minutes: 6 })],
    },
    {
      text: 'Die Hühnerbrühe nach und nach unter Rühren angießen, Lorbeerblatt, Thymian, Worcestersauce, Hähnchen und Wurst zugeben, aufkochen und offen 45 Minuten leise köcheln lassen; das Fett an der Oberfläche abschöpfen.',
      settings: [bora('Power', { note: 'aufkochen' }), bora('3', { minutes: 45, note: 'offen' })],
    },
    reis(90, 'Nach 20 Minuten Köcheln'),
    {
      text: 'Den Gumbo mit Salz und Pfeffer abschmecken, in tiefe Teller füllen, einen Löffel Reis in die Mitte setzen und mit Frühlingszwiebeln und Petersilie bestreuen.',
    },
  ],
  'red-beans-and-rice': [
    {
      text: 'Die Kidneybohnen abgießen und abspülen. Zwiebel, Paprika und Staudensellerie würfeln, Knoblauch hacken, die Mettenden in Scheiben schneiden (Ersatz für die Andouille aus Louisiana).',
    },
    {
      text: 'Speckwürfel und Mettenden in einem Topf 5 Minuten anbraten, bis Fett austritt. Zwiebel, Paprika und Sellerie zugeben und 6 Minuten weich dünsten, Knoblauch und Cajun-Gewürz kurz mitrösten.',
      settings: [bora('6', { minutes: 11 })],
    },
    {
      text: 'Bohnen, Hühnerbrühe, Lorbeerblatt und Thymian zugeben, aufkochen und offen 30 Minuten köcheln. Dann etwa ein Drittel der Bohnen mit dem Kochlöffel am Topfrand zerdrücken – so wird es cremig, ganz ohne Sahne.',
      settings: [bora('Power', { note: 'aufkochen' }), bora('3', { minutes: 30, note: 'offen' })],
    },
    reis(100),
    {
      text: 'Mit Apfelessig, Salz und Pfeffer abschmecken, auf dem Reis anrichten und mit Frühlingszwiebeln bestreuen. In New Orleans ist das das traditionelle Montagsessen (Waschtag – der Topf köchelte nebenher); am Tisch kommt Hot Sauce dazu.',
    },
  ],
  'shrimp-and-grits': [
    {
      text: 'Die Garnelen im Kühlschrank auftauen lassen, trocken tupfen und mit dem Cajun-Gewürz mischen. Knoblauch fein hacken, Frühlingszwiebeln in Ringe schneiden.',
    },
    {
      text: 'Für die Grits die Milch mit 300 ml Wasser und 1 TL Salz aufkochen, die Polenta unter Rühren einrieseln lassen und bei kleiner Hitze nach Packungsangabe quellen lassen, öfter umrühren. Grits sind grob gemahlener weißer Mais aus den Südstaaten – Polenta kommt dem am nächsten.',
      settings: [bora('Power', { note: 'aufkochen' }), bora('2', { note: 'quellen, öfter rühren' })],
    },
    {
      text: 'Die Speckwürfel in einer Pfanne knusprig auslassen und herausnehmen. Die Garnelen im Speckfett bei starker Hitze 1 Minute je Seite braten, bis sie rosa sind, den Knoblauch kurz mitbraten.',
      settings: [bora('8', { minutes: 2, note: 'je Seite 1 Min.' })],
    },
    {
      text: 'Mit Hühnerbrühe und Zitronensaft ablöschen, kurz einkochen, Speck und die Hälfte der Frühlingszwiebeln zurückgeben.',
      settings: [bora('6', { minutes: 1 })],
    },
    {
      text: 'Cheddar und Butter unter die Grits rühren, abschmecken, in tiefe Teller geben, die Garnelen mit der Sauce darauf verteilen und mit den restlichen Frühlingszwiebeln bestreuen.',
    },
  ],
  'shrimp-etouffee': [
    {
      text: 'Die Garnelen im Kühlschrank auftauen lassen. Zwiebel, Paprika und Staudensellerie fein würfeln (die „Holy Trinity“), Knoblauch hacken.',
    },
    {
      text: 'Für die blonde Roux die Butter in einem Topf schmelzen, das Weizenmehl einrühren und unter ständigem Rühren 8 bis 10 Minuten rösten, bis sie die Farbe von Erdnussbutter hat. In der Cajun-Küche ist die Roux für Étouffée heller als für Gumbo.',
      settings: [bora('4', { minutes: 10, note: 'ständig rühren' })],
    },
    {
      text: 'Zwiebel, Paprika und Sellerie in der Roux 5 Minuten weich dünsten, Knoblauch, Tomatenmark und Cajun-Gewürz 1 Minute mitrösten – das Tomatenmark ist die Creole-Note aus New Orleans.',
      settings: [bora('4', { minutes: 6 })],
    },
    {
      text: 'Fischfond und Worcestersauce nach und nach unterrühren und 15 Minuten sämig köcheln.',
      settings: [bora('3', { minutes: 15 })],
    },
    reis(120, 'Gleichzeitig'),
    {
      text: 'Die Garnelen in die Sauce geben und 4 Minuten gar ziehen lassen. Mit Zitronensaft und Salz abschmecken, über den Reis geben und mit Frühlingszwiebeln und Petersilie bestreuen. „Étouffée“ heißt „erstickt“ – die Garnelen garen bedeckt in der dicken Sauce.',
      settings: [bora('Simmern', { minutes: 4 })],
    },
  ],
  'southern-fried-chicken': [
    {
      text: 'Die Hähnchenschenkel im Gelenk in Ober- und Unterschenkel teilen. Buttermilch mit 1 TL Salz und der Hälfte des Cayennepfeffers verrühren und das Fleisch darin zugedeckt mindestens 4 Stunden, besser über Nacht im Kühlschrank marinieren („Buttermilk Brine“: die milde Säure macht das Fleisch zart und saftig).',
    },
    {
      text: 'Für den Coleslaw Weißkohl fein hobeln, Möhre raspeln und mit Joghurt, Apfelessig, Salz und Pfeffer mischen (leichter als mit Mayonnaise).',
    },
    {
      text: 'Weizenmehl, Backpulver, Paprikapulver, Knoblauchpulver, restlichen Cayennepfeffer, 1 TL Salz und Pfeffer mischen und 2 EL Marinade hineinreiben – die Klümpchen werden zur krossen, zerklüfteten Kruste. Die Hähnchenteile abtropfen lassen, kräftig darin wenden, andrücken und 10 Minuten ruhen lassen, damit die Panade hält.',
    },
    {
      text: 'Den Airfryer auf 190 °C vorheizen. Die Teile mit der Hautseite nach oben in den Korb legen, rundum dünn mit Frittieröl einsprühen (mehlige Stellen bleiben sonst weiß) und 25 Minuten garen; nach der Hälfte der Zeit wenden und nochmal einsprühen. Fertig, wenn das Thermometer an der dicksten Stelle im Kern 80 °C zeigt.',
      settings: [airfryer(190, 25, 'vorheizen, nach der Hälfte wenden', 80)],
    },
    {
      text: 'Kurz auf einem Gitter ruhen lassen und mit dem Coleslaw servieren.',
    },
  ],
  'chicken-fried-steak': [
    {
      text: 'Den Wasserbehälter des CombiSteamers füllen. Die Kartoffeln schälen, vierteln und im gelochten Garbehälter bei 100 °C 25 Minuten dämpfen; die Grünen Bohnen putzen und für die letzten 12 Minuten dazulegen.',
      settings: [vzug('steamer', 'Dämpfen', 100, { minutes: 25, note: 'gelochter Garbehälter, Bohnen nach 13 Min. dazu' })],
    },
    {
      text: 'Das Rindfleisch zwischen Frischhaltefolie dünn klopfen, salzen und pfeffern. 45 g Weizenmehl mit Paprikapulver, Knoblauchpulver und Cayennepfeffer mischen, Ei und Buttermilch verquirlen. Das Fleisch erst im Mehl, dann im Ei, dann nochmal im Mehl wenden und gut andrücken.',
    },
    {
      text: 'Die große Pfanne auf dem BORA 1 Minute vorheizen, das Sonnenblumenöl hineingeben und die Steaks bei mittlerer Hitze 3 Minuten je Seite goldbraun braten. Warm stellen.',
      settings: [bora('6', { minutes: 6, note: 'je Seite 3 Min.' })],
    },
    {
      text: 'Für die Country Gravy das Bratfett bis auf 2 EL abgießen, das restliche Mehl einrühren und 1 Minute anschwitzen. 250 ml Milch einrühren, 4 Minuten sämig köcheln und kräftig mit Salz und viel grobem Pfeffer würzen.',
      settings: [bora('4', { minutes: 5 })],
    },
    {
      text: 'Die Kartoffeln mit Butter und der übrigen Milch zu Püree stampfen. Die Steaks mit der Gravy übergießen, mit Püree und Bohnen servieren. Der Name: das Rindfleisch wird paniert wie Fried Chicken – ein Texas-Klassiker, den deutsche Einwanderer vom Schnitzel abgeleitet haben.',
    },
  ],
  'sloppy-joes': [
    {
      text: 'Für den Krautsalat Weißkohl fein hobeln, Möhre raspeln, mit Joghurt, Apfelessig, Salz und Pfeffer mischen und ziehen lassen.',
    },
    {
      text: 'Zwiebel und Paprika fein würfeln, Knoblauch hacken. Die große Pfanne auf dem BORA vorheizen, das Hackfleisch krümelig braun anbraten, Zwiebel und Paprika mitbraten, Knoblauch, Tomatenmark und Paprikapulver kurz mitrösten.',
      settings: [bora('8', { minutes: 8 })],
    },
    {
      text: 'Passierte Tomaten, Tomatenketchup, Worcestersauce, braunen Zucker und Senf einrühren und 10 Minuten dicklich einköcheln, mit Salz und Pfeffer abschmecken.',
      settings: [bora('3', { minutes: 10 })],
    },
    {
      text: 'Die Brötchen aufschneiden und im Airfryer 3 Minuten anrösten. Mit dem Hackfleisch füllen – „sloppy“ heißt schlampig, es darf herauslaufen – und mit Gewürzgurken und Krautsalat servieren.',
      settings: [airfryer(170, 3, 'Brötchen anrösten')],
    },
  ],
  'meatloaf-mashed-potatoes': [
    {
      text: 'Den Combair auf 180 °C Heißluft vorheizen. Zwiebel und Knoblauch sehr fein würfeln, das Paniermehl in 50 ml Milch einweichen.',
      settings: [vzug('combair', 'Heißluft', 180, { note: 'vorheizen, Ebene 2' })],
    },
    {
      text: 'Hackfleisch, Ei, eingeweichtes Paniermehl, Zwiebel, Knoblauch, Worcestersauce, Senf, abgezupften Thymian, Salz und Pfeffer locker vermengen – nicht zu lange kneten, sonst wird der Meatloaf fest. Auf einem Blech mit Backpapier zu einem flachen Laib formen und auf Ebene 2 im Combair 25 Minuten garen.',
      settings: [vzug('combair', 'Heißluft', 180, { minutes: 25, note: 'Ebene 2' })],
    },
    {
      text: 'Gleichzeitig den Wasserbehälter des CombiSteamers füllen. Die Kartoffeln schälen, vierteln und im gelochten Garbehälter bei 100 °C 25 Minuten dämpfen; die Grünen Bohnen putzen und für die letzten 12 Minuten dazulegen.',
      settings: [vzug('steamer', 'Dämpfen', 100, { minutes: 25, note: 'gelochter Garbehälter, Bohnen nach 13 Min. dazu' })],
    },
    {
      text: 'Tomatenketchup, braunen Zucker und Apfelessig verrühren, den Meatloaf damit bestreichen, den Fühler in die dickste Stelle stecken und im Combair weitere 15 Minuten garen, bis die Kerntemperatur 72 °C erreicht und die Glasur glänzt.',
      settings: [vzug('combair', 'Heißluft', 180, { minutes: 15, core: 72, note: 'Ebene 2' })],
    },
    {
      text: 'Die Kartoffeln mit Butter und der restlichen Milch stampfen. Den Meatloaf 5 Minuten ruhen lassen, in Scheiben schneiden und mit Püree und Bohnen servieren.',
    },
  ],
  'chicken-pot-pie': [
    {
      text: 'Den Combair auf 200 °C Ober-/Unterhitze vorheizen. Zwiebel, Möhren und Staudensellerie in kleine Würfel, das Hähnchen in 2 cm große Stücke schneiden.',
      settings: [vzug('combair', 'Ober-/Unterhitze', 200, { note: 'vorheizen, Ebene 2' })],
    },
    {
      text: 'Die Butter in einem Topf schmelzen, Zwiebel, Möhren und Sellerie 5 Minuten andünsten, das Hähnchen kurz mitbraten. Weizenmehl darüberstäuben und 1 Minute anschwitzen.',
      settings: [bora('5', { minutes: 7 })],
    },
    {
      text: 'Hühnerbrühe und 80 ml Milch nach und nach einrühren, Thymianblättchen zugeben und 5 Minuten sämig köcheln. Die gefrorenen Erbsen unterrühren und kräftig mit Salz und Pfeffer abschmecken.',
      settings: [bora('3', { minutes: 5 })],
    },
    {
      text: 'Die Füllung in zwei ofenfeste Förmchen oder eine kleine Auflaufform füllen. Den Blätterteig darauflegen, am Rand andrücken, mit der übrigen Milch bestreichen und mehrmals einschneiden, damit Dampf entweichen kann.',
    },
    {
      text: 'Auf Ebene 2 im Combair 25 Minuten goldbraun backen und 5 Minuten abkühlen lassen. Dazu passt ein grüner Salat.',
      settings: [vzug('combair', 'Ober-/Unterhitze', 200, { minutes: 25, note: 'Ebene 2' })],
    },
  ],
  'philly-cheesesteak': [
    {
      text: 'Das Rindfleisch 30 Minuten ins Gefrierfach legen, dann lässt es sich hauchdünn quer zur Faser schneiden.',
    },
    {
      text: 'Zwiebel und Paprika in feine Streifen, Champignons in Scheiben schneiden. In der Hälfte vom Sonnenblumenöl in der großen Pfanne bei mittlerer Hitze 8 Minuten weich und leicht gebräunt braten, salzen und herausnehmen.',
      settings: [bora('6', { minutes: 8 })],
    },
    {
      text: 'Die Pfanne auf dem BORA sehr heiß werden lassen, das restliche Öl und das Fleisch hineingeben, 2 Minuten scharf anbraten und dabei mit dem Pfannenwender zerhacken. Salzen, pfeffern und das Gemüse untermischen. Abzug auf Power.',
      settings: [bora('9', { minutes: 2, note: 'Abzug Power' })],
    },
    {
      text: 'Die Mischung in der Pfanne in zwei Portionen teilen, den Provolone darauflegen und zugedeckt 1 Minute schmelzen lassen.',
      settings: [bora('Warmhalten', { minutes: 1 })],
    },
    {
      text: 'Das Ciabatta halbieren, längs aufschneiden und im Airfryer 3 Minuten aufbacken. Mit dem Pfanneninhalt füllen und sofort essen. In Philadelphia bestellt man „wit“ (mit Zwiebeln); statt Provolone gibt es dort auch Cheez Whiz.',
      settings: [airfryer(170, 3, 'Brot aufbacken')],
    },
  ],
  'buffalo-chicken-wraps': [
    {
      text: 'Das Hähnchen in fingerdicke Streifen schneiden und mit Knoblauchpulver, Paprikapulver, Salz und Pfeffer würzen.',
    },
    {
      text: 'Den Airfryer auf 200 °C vorheizen. Die Streifen nebeneinander in den Korb legen und 10 Minuten garen, nach der Hälfte der Zeit wenden.',
      settings: [airfryer(200, 10, 'vorheizen, 1× wenden')],
    },
    {
      text: 'Für die Buffalo-Sauce Hot Sauce und Butter in einem kleinen Topf auf dem BORA schmelzen und mit den Hähnchenstreifen mischen. Das Original stammt aus Buffalo (New York) und wird mit Frank’s RedHot gemacht.',
      settings: [bora('Schmelzen')],
    },
    {
      text: 'Für den Blue-Cheese-Dip Joghurt mit zerdrücktem Gorgonzola und Zitronensaft verrühren. Staudensellerie und Möhre in feine Stifte schneiden, den Kopfsalat in Streifen.',
    },
    {
      text: 'Die Vollkorn-Tortillas im Airfryer 1 Minute erwärmen, mit Salat, Gemüsestiften, Hähnchen und Dip belegen, fest einrollen und halbieren.',
      settings: [airfryer(160, 1, 'Tortillas erwärmen')],
    },
  ],
  'pulled-pork-mac-and-cheese': [
    {
      text: 'Den Wasserbehälter des CombiSteamers füllen. Das Pulled Pork (aus dem Vorrat am Vortag im Kühlschrank aufgetaut) im Vakuumbeutel bei 70 °C 30 Minuten Vacuisine erwärmen, dann mit der BBQ-Sauce mischen.',
      settings: [vzug('steamer', 'Vacuisine', 70, { minutes: 30, note: 'im Vakuumbeutel' })],
    },
    {
      text: 'Die Nudeln (am besten kurze Hörnchennudeln, in den USA „Elbow Macaroni“) in Salzwasser bissfest kochen, den Brokkoli in kleinen Röschen in den letzten 3 Minuten mitgaren und alles abgießen.',
      settings: [bora('Power', { note: 'aufkochen' }), bora('7', { note: 'Nudeln' })],
    },
    {
      text: 'Die Butter schmelzen, Weizenmehl einrühren und 1 Minute anschwitzen, die Milch nach und nach einrühren und 5 Minuten köcheln. Vom Herd nehmen, Cheddar, Senf und geräuchertes Paprikapulver einrühren, salzen und pfeffern.',
      settings: [bora('4', { minutes: 6 })],
    },
    {
      text: 'Den Combair-Grill 3 Minuten vorheizen. Nudeln und Brokkoli mit der Käsesauce mischen, in eine Auflaufform füllen, das Pulled Pork darauf verteilen und mit Panko bestreuen.',
      settings: [vzug('combair', 'Grill', undefined, { note: 'Stufe 3 (stark), 3 Min. vorheizen' })],
    },
    {
      text: 'Auf Ebene 3 im Combair unter dem Grill 4 Minuten goldbraun überbacken und sofort servieren.',
      settings: [vzug('combair', 'Grill', undefined, { minutes: 4, note: 'Stufe 3 (stark), Ebene 3' })],
    },
  ],
  'pulled-pork-nachos': [
    {
      text: 'Den Combair auf 180 °C Heißluft vorheizen. Die Vollkorn-Tortillas in je 8 Dreiecke schneiden, dünn mit dem Sonnenblumenöl bepinseln, salzen und auf einem Blech auf Ebene 2 8 Minuten knusprig backen – selbstgemachte Chips haben deutlich weniger Fett als gekaufte.',
      settings: [vzug('combair', 'Heißluft', 180, { minutes: 8, note: 'vorheizen, Ebene 2' })],
    },
    {
      text: 'Das Pulled Pork (aus dem Vorrat am Vortag im Kühlschrank aufgetaut) mit der BBQ-Sauce im kleinen Topf 5 Minuten erwärmen. Kidneybohnen und Mais abspülen und abtropfen lassen.',
      settings: [bora('4', { minutes: 5 })],
    },
    {
      text: 'Die Chips auf dem Blech eng zusammenschieben, Pulled Pork, Bohnen, Mais und Cheddar darauf verteilen und im Combair 5 Minuten backen, bis der Käse schmilzt.',
      settings: [vzug('combair', 'Heißluft', 180, { minutes: 5, note: 'Ebene 2' })],
    },
    {
      text: 'Für das Pico de Gallo Tomaten, rote Zwiebel und Chili fein würfeln, mit Limettensaft, gehacktem Koriander und Salz mischen. Die Nachos mit Pico de Gallo und Saurer Sahne direkt vom Blech servieren.',
    },
  ],
  'brisket-chili': [
    {
      text: 'Das Pulled Beef bzw. den Brisket-Rest (aus dem Vorrat am Vortag im Kühlschrank auftauen) grob zerzupfen. Fett und Bark (die dunkle Gewürzkruste vom Smoker) dranlassen – sie bringen den Rauchgeschmack ins Chili.',
    },
    {
      text: 'Von den Ancho-Chilis Stiele und Kerne entfernen und die Schoten in der trockenen Pfanne je Seite 20 Sekunden rösten, bis sie duften – nicht schwärzen, sonst werden sie bitter. In der heißen Rinderbrühe 15 Minuten einweichen und mit dem Stabmixer glatt pürieren. Ancho ist getrocknete Poblano: mild, fruchtig, leicht rosinig.',
      settings: [bora('5', { minutes: 1, note: 'trocken rösten' })],
    },
    {
      text: 'Zwiebel, Paprika und Jalapeño würfeln, Knoblauch hacken. Im Sonnenblumenöl im Topf 6 Minuten weich dünsten, Knoblauch, Tomatenmark, Kreuzkümmel, geräuchertes Paprikapulver und Oregano 1 Minute mitrösten.',
      settings: [bora('4', { minutes: 7 })],
    },
    {
      text: 'Mit dem Dunkelbier ablöschen, Chili-Paste, Gehackte Tomaten und das Brisket zugeben. Auf Powerstufe aufkochen und offen 25 Minuten leise köcheln, ab und zu umrühren.',
      settings: [bora('Power', { note: 'aufkochen' }), bora('3', { minutes: 25, note: 'ohne Deckel' })],
    },
    {
      text: 'Die Kidneybohnen abspülen und mit braunem Zucker und Apfelessig unterrühren, weitere 10 Minuten köcheln und mit Salz und Pfeffer abschmecken. Der texanische „Bowl of Red“ kommt ohne Bohnen aus – Brisket Chili mit Bohnen ist dagegen das typische Resteessen der BBQ-Lokale in Texas.',
      settings: [bora('3', { minutes: 10 })],
    },
    {
      text: 'In Schalen füllen und mit Cheddar, einem Klecks Saurer Sahne und Frühlingszwiebelringen servieren. Dazu passt Cornbread.',
    },
  ],
  'brisket-hash': [
    {
      text: 'Den Wasserbehälter des CombiSteamers füllen. Die Kartoffeln schälen, in 1,5 cm große Würfel schneiden, im gelochten Garbehälter auf Ebene 2 bei 100 °C 12 Minuten bissfest dämpfen und offen ausdampfen lassen – nur trockene Kartoffeln werden knusprig.',
      settings: [vzug('steamer', 'Dämpfen', 100, { minutes: 12, note: 'gelochter Garbehälter, Ebene 2' })],
    },
    {
      text: 'Inzwischen das Pulled Beef bzw. den Brisket-Rest (aus dem Vorrat am Vortag im Kühlschrank auftauen) in kleine Stücke zupfen. Zwiebel, Paprika und Jalapeño würfeln, Knoblauch hacken.',
    },
    {
      text: 'Die große Pfanne (am besten Gusseisen) auf dem BORA 2 Minuten vorheizen, das Sonnenblumenöl hineingeben und die Kartoffeln in einer Lage 5 Minuten braten, ohne zu rühren, bis sich eine Kruste bildet. Wenden und weitere 5 Minuten braten.',
      settings: [bora('8', { note: 'Pfanne vorheizen' }), bora('6', { minutes: 10, note: 'nach 5 Min. wenden' })],
    },
    {
      text: 'Butter, Zwiebel, Paprika und Jalapeño zugeben und 4 Minuten mitbraten. Knoblauch, Brisket, geräuchertes Paprikapulver und Worcestersauce untermischen und 3 Minuten braten, bis das Fleisch heiß ist und an den Rändern knusprig wird. Mit Salz und Pfeffer würzen.',
      settings: [bora('6', { minutes: 7 })],
    },
    {
      text: 'Vier Mulden in den Hash drücken, je ein Ei hineinschlagen, leicht salzen und mit Deckel 4 bis 5 Minuten stocken lassen, bis das Eiweiß fest und das Eigelb noch flüssig ist.',
      settings: [bora('3', { minutes: 5, note: 'Deckel drauf' })],
    },
    {
      text: 'Mit Frühlingszwiebelringen bestreuen und mit Hot Sauce direkt aus der Pfanne servieren. „Hash“ kommt vom französischen „hacher“ (hacken): In Texas macht man ihn aus den Brisket-Resten vom Wochenende.',
    },
  ],
}
