# Yami – Wochenplaner per Wischen

Plane deine Abendessen für die Woche, indem du durch Gerichte wischst, und bekomme am Ende eine sortierte Einkaufsliste.

- **Wischen:** rechts = nehmen, links = nächstes Gericht. Tippen öffnet das Rezept.
- **Filter:** Deutsch / Italienisch / Asiatisch, Hauptgericht / Pasta / Eintopf / Suppe / Auflauf, vegetarisch, max. Zeit.
- **Woche:** Portionen pro Tag anpassen (Standard 2), Gerichte tauschen oder entfernen.
- **Einkaufsliste:** gleiche Zutaten werden zusammengerechnet und in Ladenreihenfolge sortiert:
  1. Gemüse, Obst & Kräuter → 2. Konserven & Trockenware → 3. Backwaren → 4. Käse, Nudeln & Molkerei → 5. Fleisch & Fisch → 6. Tiefkühl → 7. Vorrat prüfen (Salz, Öl, Gewürze, Brühe …)
  Abhaken im Laden, eigene Artikel ergänzen.
- **Rezepte:** ca. 200 Gerichte (≈ 90 deutsch, 70 italienisch, 40 asiatisch) mit Zutaten und Zubereitung, durchsuchbar.

Alle Daten bleiben lokal im Browser (kein Konto, kein Server). Die App ist eine PWA und lässt sich auf den Homescreen legen und offline nutzen.

## Entwickeln

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # Produktions-Build nach dist/
npm run check-data   # prüft die Rezeptdatenbank
```

## Veröffentlichen (kostenlos)

Der Ordner `dist/` ist eine statische Website und lässt sich überall hosten.

**Variante A – Netlify Drop (am einfachsten, 2 Minuten)**
1. `npm install && npm run build`
2. Auf https://app.netlify.com/drop den Ordner `dist` ins Browserfenster ziehen.
3. Die angezeigte Adresse auf dem Handy öffnen → „Zum Home-Bildschirm“ (iPhone: Teilen-Menü in Safari; Android: Menü in Chrome).

**Variante B – GitHub Pages**
1. In den Repo-Einstellungen unter *Settings → Pages* als Quelle „GitHub Actions“ wählen.
2. Eine Datei `.github/workflows/pages.yml` mit dem Standard-Workflow „Static HTML“ anlegen, der `npm ci && npm run build` ausführt und `dist` hochlädt (GitHub schlägt unter *Actions → New workflow* passende Vorlagen vor).
3. Nach dem Push ist die App unter `https://<benutzer>.github.io/<repo>/` erreichbar. Die App nutzt relative Pfade und läuft daher auch in einem Unterordner.

## Rezepte erweitern

Rezepte stehen in `src/data/recipes-de.ts`, `recipes-it.ts` und `recipes-as.ts`, jeweils für **2 Portionen**:

```ts
r('id', 'Titel', 'de' | 'it' | 'as', 'haupt' | 'pasta' | 'eintopf' | 'suppe' | 'auflauf', minuten,
  '400 g Kartoffeln festkochend | 2 Stk Zwiebel | Salz',
  ['Schritt 1', 'Schritt 2', 'Schritt 3'],
  'Suchbegriff für das Foto')
```

Erlaubte Einheiten: `g kg ml l Stk EL TL Prise Bund Zehe Dose Pck Scheibe Zweig Glas Becher Blatt`. Zutaten ohne Menge (z. B. `Salz`) gelten als „nach Bedarf“.
Neue Zutaten müssen in `src/data/catalog.ts` einer Einkaufslisten-Kategorie zugeordnet werden. `npm run check-data` meldet fehlende Einträge.

## Fotos

Die Fotos stammen von **Wikimedia Commons** und stehen unter freien Lizenzen (CC0, CC BY, CC BY-SA). Urheber und Lizenz stehen in der Rezeptansicht unter dem Rezept und in `src/data/images.json`.

```bash
npx vite-node scripts/dump-recipes.ts > /tmp/recipes.json
python3 scripts/fetch_images.py /tmp/recipes.json            # fehlende Fotos laden
python3 scripts/fetch_images.py /tmp/recipes.json --only lasagne --force   # einzelnes Foto neu suchen
```

Für ein bestimmtes Foto trägst du in `scripts/image-overrides.json` den Commons-Dateinamen ein, z. B. `{ "lasagne": "File:Lasagne - stonesoup.jpg" }`. Eigene Fotos legst du als `public/img/<id>.webp` (4:3) ab und trägst sie in `images.json` ein.
