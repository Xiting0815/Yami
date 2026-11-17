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
}

/**
 * Vorrang: braucht ein Rezept die linke Zutat, wird zuerst die rechte genommen (der selbstgemachte Fond aus dem
 * Gefrierfach vor dem gekauften Glas). Für Abziehen beim Kochen und die Wochenplanung zählt sie wie die Zutat selbst.
 */
export const PREFERRED: Record<string, string> = {
  Rinderfond: 'Rinderfond selbstgemacht',
  Kalbsfond: 'Kalbsfond selbstgemacht',
  Lammfond: 'Lammfond selbstgemacht',
}

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
  const pref = PREFERRED[name]
  return pref ? [[pref], [name]] : [[name]]
}

/** Andere Zutaten, die diese ersetzen können, in der Reihenfolge, in der sie genommen werden (leer, wenn es keine gibt) */
export function substitutesFor(name: string): string[] {
  return substituteTiers(name).flat()
}

/** Gehören beide Zutaten zur selben Austausch-Gruppe (oder sind gleich)? */
export function interchangeable(a: string, b: string): boolean {
  return a === b || (GROUP_OF.has(a) && GROUP_OF.get(a) === GROUP_OF.get(b))
}
