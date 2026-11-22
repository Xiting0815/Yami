import { EXTRA_PREFERRED, EXTRA_SUBSTITUTE_GROUPS } from './extra'

/**
 * Austauschbare Zutaten: Was im Vorrat liegt, deckt den Bedarf einer anderen Zutat derselben Gruppe.
 * Eine Stelle für alles – Empfehlungen, Einkaufsliste, Abziehen beim Kochen und Rückgängig nutzen sie gemeinsam.
 * Nur Zutaten mit derselben Basiseinheit (hier immer g); frische Pasta, Gnocchi, Spätzle, Lasagneplatten
 * und asiatische Nudeln gehören nicht dazu.
 */
export const SUBSTITUTE_GROUPS: Record<string, string[]> = {
  /** Trockenpasta */
  pasta: [
    'Nudeln', 'Spaghetti', 'Penne', 'Fusilli', 'Rigatoni', 'Linguine', 'Tagliatelle', 'Fettuccine', 'Bandnudeln',
    'Orecchiette', 'Trofie', 'Ziti', 'Bucatini', 'Ditalini',
  ],
  /** Saure Milchprodukte zum Verfeinern (Sahne gehört nicht dazu) */
  sauerrahm: ['Crème fraîche', 'Schmand', 'Saure Sahne'],
  /** Brühen: das Rezept nennt die fertige Brühe, im Vorrat liegt Pulver, Würfel oder flüssige Brühe (alles in ml fertiger Brühe) */
  'brühe-gemüse': ['Gemüsebrühe', 'Gemüsebrühe Pulver', 'Gemüsebrühe Würfel', 'Gemüsebrühe flüssig'],
  'brühe-huhn': ['Hühnerbrühe', 'Hühnerbrühe Pulver', 'Hühnerbrühe Würfel', 'Hühnerbrühe flüssig'],
  'brühe-rind': ['Rinderbrühe', 'Rinderbrühe Pulver', 'Rinderbrühe Würfel', 'Rinderbrühe flüssig'],
  /** neutrale Brat- und Kochöle (Frittieröl zählt schon als Sonnenblumenöl); Sesam-, Kürbiskern-, Lein- und Chiliöl nicht */
  oel: ['Sonnenblumenöl', 'Olivenöl'],
  /** Fonds: selbst gekochter Fond (Grundrezept, eingefroren) ersetzt den gekauften – und wird zuerst genommen (PREFERRED) */
  'fond-rind': ['Rinderfond', 'Rinderfond selbstgemacht'],
  'fond-kalb': ['Kalbsfond', 'Kalbsfond selbstgemacht'],
  'fond-lamm': ['Lammfond', 'Lammfond selbstgemacht'],
  /** Brot: selbstgebackenes (Grundrezept/Backen, im Vorrat in Scheiben/Stück) ersetzt das gekaufte – und wird zuerst genommen */
  'brot-scheibe': ['Vollkornbrot'],
  ciabatta: ['Ciabatta'],
  broetchen: ['Brötchen vom Vortag'],
}
// Backen & Desserts (src/data/extra): Gruppen ergänzen bzw. neu anlegen
for (const [g, names] of Object.entries(EXTRA_SUBSTITUTE_GROUPS)) SUBSTITUTE_GROUPS[g] = [...new Set([...(SUBSTITUTE_GROUPS[g] ?? []), ...names])]
for (const g of Object.keys(SUBSTITUTE_GROUPS)) if (SUBSTITUTE_GROUPS[g].length < 2) delete SUBSTITUTE_GROUPS[g]

/**
 * Vorrang: braucht ein Rezept die linke Zutat, wird zuerst die rechte genommen (der selbstgemachte Fond aus dem
 * Gefrierfach vor dem gekauften Glas, selbstgebackenes Brot vor gekauftem; mehrere = eine Stufe, frühestes Ablaufdatum zuerst). Für Abziehen beim Kochen und die Wochenplanung zählt sie wie die Zutat selbst.
 */
export const PREFERRED: Record<string, string[]> = {
  Rinderfond: ['Rinderfond selbstgemacht'],
  Kalbsfond: ['Kalbsfond selbstgemacht'],
  Lammfond: ['Lammfond selbstgemacht'],
}
// Selbstgebackenes Brot vor gekauftem (src/data/extra), z. B. Vollkornbrot ← Bauernbrot selbstgebacken
for (const [n, prefs] of Object.entries(EXTRA_PREFERRED)) PREFERRED[n] = [...new Set([...(PREFERRED[n] ?? []), ...prefs])]

/**
 * Notlösung, nur in eine Richtung: fehlt Hühner- oder Rinderbrühe, darf Gemüsebrühe einspringen –
 * aber erst, wenn von der eigenen Sorte nichts mehr da ist (und nie umgekehrt).
 */
export const FALLBACK_GROUPS: Record<string, string[]> = {
  'brühe-huhn': ['brühe-gemüse'],
  'brühe-rind': ['brühe-gemüse'],
}

const GROUP_OF = new Map<string, string>()
for (const [g, names] of Object.entries(SUBSTITUTE_GROUPS)) for (const n of names) GROUP_OF.set(n, g)

/**
 * Ersatz in Stufen: erst die eigene Gruppe, dann ggf. die Notlösung (z. B. Gemüsebrühe für Hühnerbrühe).
 * Innerhalb einer Stufe zählt das früheste Ablaufdatum.
 */
export function substituteTiers(name: string): string[][] {
  const g = GROUP_OF.get(name)
  if (!g) return []
  const own = SUBSTITUTE_GROUPS[g].filter((n) => n !== name)
  return [own, ...(FALLBACK_GROUPS[g] ?? []).map((f) => SUBSTITUTE_GROUPS[f])].filter((t) => t.length)
}

/**
 * Entnahme-Reihenfolge der „eigenen“ Stufe: bei Vorrang erst die bevorzugte Zutat, dann die Zutat selbst
 * (je eine Stufe, damit nicht das Ablaufdatum die Reihenfolge umdreht), sonst nur die Zutat selbst.
 */
export function ownTiers(name: string): string[][] {
  const pref = PREFERRED[name]?.filter((n) => n !== name)
  return pref?.length ? [pref, [name]] : [[name]]
}

/** Andere Zutaten, die diese ersetzen können, in der Reihenfolge, in der sie genommen werden (leer, wenn es keine gibt) */
export function substitutesFor(name: string): string[] {
  return substituteTiers(name).flat()
}

/** Gehören beide Zutaten zur selben Austausch-Gruppe (oder sind gleich)? */
export function interchangeable(a: string, b: string): boolean {
  return a === b || (GROUP_OF.has(a) && GROUP_OF.get(a) === GROUP_OF.get(b))
}

/**
 * Notlösung für EIN Gericht („Schmand statt Sahne“): fehlt eine Zutat, schlägt die Wochenansicht vor, was davon im Vorrat
 * liegt. Anders als SUBSTITUTE_GROUPS wird das nie automatisch genommen – erst, wenn du den Ersatz für dieses Gericht
 * annimmst (PlanEntry.swap). Reihenfolge = Vorschlags-Reihenfolge. Nur Zutaten, deren Mengen sich umrechnen lassen.
 */
export const STAND_INS: Record<string, string[]> = {
  Sahne: ['Crème fraîche', 'Schmand', 'Mascarpone', 'Frischkäse', 'Milch'],
  'Crème fraîche': ['Sahne', 'Joghurt natur', 'Frischkäse'],
  Schmand: ['Sahne', 'Joghurt natur', 'Frischkäse'],
  'Saure Sahne': ['Joghurt natur', 'Sahne', 'Frischkäse'],
  'Joghurt natur': ['Skyr', 'Saure Sahne', 'Speisequark'],
  Skyr: ['Joghurt natur', 'Magerquark'],
  Magerquark: ['Speisequark', 'Skyr'],
  Speisequark: ['Magerquark', 'Skyr'],
  Frischkäse: ['Mascarpone', 'Schmand'],
  Speckwürfel: ['Bacon', 'Pancetta', 'Guanciale', 'Schweinebauch geräuchert', 'Katenschinken', 'Kochschinken'],
  Bacon: ['Speckwürfel', 'Pancetta', 'Guanciale'],
  Pancetta: ['Guanciale', 'Speckwürfel', 'Bacon'],
  Guanciale: ['Pancetta', 'Speckwürfel', 'Bacon'],
  'Hackfleisch gemischt': ['Rinderhackfleisch', 'Schweinehackfleisch'],
  Rinderhackfleisch: ['Hackfleisch gemischt', 'Schweinehackfleisch'],
  Schweinehackfleisch: ['Hackfleisch gemischt', 'Rinderhackfleisch'],
  Hähnchenbrustfilet: ['Hähnchenschenkelfilet', 'Putenbrust'],
  Hähnchenschenkelfilet: ['Hähnchenbrustfilet', 'Putenbrust'],
  Putenbrust: ['Hähnchenbrustfilet', 'Hähnchenschenkelfilet'],
  'Parmigiano Reggiano': ['Pecorino Romano', 'Bergkäse', 'Gruyère'],
  'Pecorino Romano': ['Parmigiano Reggiano'],
  'Emmentaler gerieben': ['Gouda gerieben', 'Bergkäse', 'Gruyère'],
  'Gouda gerieben': ['Emmentaler gerieben', 'Bergkäse'],
  Bergkäse: ['Gruyère', 'Emmentaler gerieben'],
  Gruyère: ['Bergkäse', 'Emmentaler gerieben'],
  Butter: ['Butterschmalz'],
  Butterschmalz: ['Butter'],
  Zwiebel: ['Zwiebel rot', 'Schalotte'],
  'Zwiebel rot': ['Zwiebel', 'Schalotte'],
  Schalotte: ['Zwiebel', 'Zwiebel rot'],
  'Kartoffeln festkochend': ['Kartoffeln mehligkochend'],
  'Kartoffeln mehligkochend': ['Kartoffeln festkochend'],
  Datteltomaten: ['Kirschtomaten'],
  Kirschtomaten: ['Datteltomaten'],
  'Gehackte Tomaten': ['Geschälte Tomaten'],
  'Geschälte Tomaten': ['Gehackte Tomaten'],
  Langkornreis: ['Jasminreis'],
  Jasminreis: ['Langkornreis'],
  Champignons: ['Champignons braun'],
  'Champignons braun': ['Champignons'],
  'Paprika rot': ['Paprika gelb', 'Paprika grün'],
  'Paprika gelb': ['Paprika rot', 'Paprika grün'],
  'Paprika grün': ['Paprika rot', 'Paprika gelb'],
  Zitrone: ['Limette'],
  Limette: ['Zitrone'],
  'Blattspinat frisch': ['Blattspinat TK'],
  'Blattspinat TK': ['Blattspinat frisch'],
  'Erbsen TK': ['Erbsen und Möhren TK'],
  Rinderfond: ['Kalbsfond'],
  Kalbsfond: ['Rinderfond'],
}

/** Kandidaten für eine Notlösung (ohne die Zutat selbst) */
export function standInsFor(name: string): string[] {
  return (STAND_INS[name] ?? []).filter((n) => n !== name)
}
