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
}

const GROUP_OF = new Map<string, string>()
for (const [g, names] of Object.entries(SUBSTITUTE_GROUPS)) for (const n of names) GROUP_OF.set(n, g)

/** Andere Zutaten, die diese ersetzen können (leer, wenn es keine gibt) */
export function substitutesFor(name: string): string[] {
  const g = GROUP_OF.get(name)
  return g ? SUBSTITUTE_GROUPS[g].filter((n) => n !== name) : []
}

/** Gehören beide Zutaten zur selben Austausch-Gruppe (oder sind gleich)? */
export function interchangeable(a: string, b: string): boolean {
  return a === b || (GROUP_OF.has(a) && GROUP_OF.get(a) === GROUP_OF.get(b))
}
