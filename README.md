# Yami – Wochenplaner per Wischen

Plane deine Abendessen für die Woche, indem du durch Gerichte wischst, und bekomme am Ende eine sortierte Einkaufsliste.

- **Wischen:** rechts = nehmen, links = nächstes Gericht. Tippen öffnet das Rezept.
- **Filter:** Deutsch / Italienisch / Asiatisch, Hauptgericht / Pasta / Eintopf / Suppe / Auflauf, vegetarisch, max. Zeit.
- **Woche:** Portionen pro Tag anpassen (Standard 2), Gerichte tauschen oder entfernen.
- **Einkaufsliste:** gleiche Zutaten werden zusammengerechnet und in Ladenreihenfolge sortiert:
  1. Gemüse, Obst & Kräuter → 2. Konserven & Trockenware → 3. Backwaren → 4. Käse, Nudeln & Molkerei → 5. Fleisch & Fisch → 6. Tiefkühl → 7. Vorrat prüfen (Salz, Öl, Gewürze, Brühe …)
  Abhaken im Laden, eigene Artikel ergänzen.
- **Rezepte:** ca. 200 Gerichte (≈ 90 deutsch, 70 italienisch, 40 asiatisch) mit Zutaten und Zubereitung, durchsuchbar.

### Vorrat, Resteverwertung & Preise

- **Vorrat füllt sich automatisch:** Was du auf der Einkaufsliste abhakst, landet mit Menge und Haltbarkeit im Vorrat (Tab „Vorrat“). Dort kannst du auch selbst Zutaten eintragen, Mengen und Datum ändern.
- **Kochen zieht ab:** Am Tag nach einem geplanten Gericht werden dessen Zutaten automatisch abgezogen (FIFO, angebrochene Packungen bekommen die kürzere Haltbarkeit, z. B. Sahne 4 Tage). Mit „Nicht gekocht“ kommen sie zurück.
- **Einkaufsliste nach Packungen:** Vorhandenes wird abgezogen und auf übliche Packungsgrößen aufgerundet („1 Becher (200 ml)“). Jeder Artikel hat einen geschätzten Preis, oben steht die Summe. Was übrig bleibt, zeigt die Detailansicht ⓘ.
- **Smarte Reihenfolge beim Wischen:** Zuerst kommen Gerichte, die Vorrat und Reste verbrauchen (Verderbliches zählt stärker) und wenig Zukauf brauchen. Gerichte der letzten 3 Wochen, gleiche Gerichtart oder Küche in derselben Woche rutschen nach hinten. Vegetarische Gerichte machen nur ca. 15 % aus (≈ 1 pro Woche, Einstellung `VEG_SHARE` in `src/kitchen.ts`).
- **Preise anpassen:** Die Preise sind grobe Discounter-Schätzungen (Stand 2026, `src/data/products.ts`). In der Einkaufsliste unter ⓘ → „anpassen“ kannst du Packungsgröße und Preis korrigieren. Filter „💶 Günstig“ zeigt Gerichte bis 2,50 € pro Portion.

### Frühstück & Meal-Prep

- **27 Meal-Prep-Frühstücke** (süß & kalt, herzhaft, warm aus der Mikrowelle), je ca. 370–470 kcal, ≥ 25 g Eiweiß, ≥ 8 g Ballaststoffe – sättigend und gut zum Abnehmen. Mengen jeweils für 1 Portion (`src/data/breakfasts.ts`).
- **Wählen:** Unter „Wischen“ auf „☀️ Frühstück“ umschalten und 1–2 Frühstücke für Mo–Fr wählen. Beim zweiten kommen automatisch Kombinationen nach vorne, die die ganze Woche abdecken.
- **Haltbarkeit:** Das kürzer haltbare Frühstück kommt Mo–Mi, das länger haltbare Do–Fr. Was nicht so lange hält, aber einfrierbar ist, wird zum Einfrieren eingeplant (mit Hinweis, wann es in den Kühlschrank muss).
- **Prep-Liste für Sonntag:** Zutaten hochgerechnet, Ofengerichte zuerst, Schritte zum Abhaken und was morgens/auf der Arbeit zu tun ist.
- **Einkauf & Vorrat:** Frühstückszutaten landen auf derselben Einkaufsliste und werden wie Abendessen vom Vorrat abgezogen.
- **Lebensmittel sparen:** Beim Wischen kommen Frühstücke zuerst, die Vorrat und Reste (auch vom Abendessen) nutzen und deren Zukauf lange hält (Haferflocken, Chiasamen, TK-Obst). Würde ein verderblicher Rest übrig bleiben (z. B. halber Becher Quark), rutscht das Rezept nach hinten und die Karte zeigt „🗑️ Rest: …“. Filter „🧺 Nur mit Vorrat“ zeigt nur Gerichte mit max. 1,50 € Zukauf.
- **Frische nach Wochentag (Abendessen):** Für spätere Wochentage bevorzugt die App Gerichte, deren Zutaten dann noch frisch sind – Fisch und Hack eher Mo–Mi.
- **Nährwerte für alles:** Jede Zutat hat Richtwerte pro 100 g (`src/data/nutrition.ts`), daraus werden kcal, Eiweiß, Ballaststoffe, Kohlenhydrate und Fett pro Portion berechnet – auch für alle Abendessen.

### Kalorienziel & Tagesbilanz (Mo–Fr)

- **Profil** (👤 oben rechts): Geschlecht, Alter, Größe, Gewicht, Aktivität, Abnehmtempo und eine Mittags-Pauschale (Standard 600 kcal, wird nicht geplant).
- **Berechnung:** Grundumsatz nach Mifflin-St Jeor (10 × kg + 6,25 × cm − 5 × Alter + 5 bzw. − 161) × Aktivitätsfaktor (1,2–1,725) − Defizit (250/500/750 kcal). Untergrenze 1.500 kcal (Männer) bzw. 1.200 kcal (Frauen).
- **Tagesbilanz:** Für Mo–Fr zeigt die Woche einen Balken: ☀️ Frühstück + 🥪 Mittag + 🌙 deine Abendportion im Vergleich zum Ziel. Sa/So sind ausgenommen.
- **Deine Portion:** Abendessen bleiben für 2 Personen. Die App rechnet aus, welcher Anteil (⅓, ½, ⅔, ¾ oder voll) ins Abendbudget passt, und gibt bei gehaltvollen Gerichten einen Gemüse-/Salat-Tipp. Die Reihenfolge beim Wischen ändert sich dadurch nicht.

Alle Daten bleiben lokal im Browser (kein Konto, kein Server). Die App ist eine PWA und lässt sich auf den Homescreen legen und offline nutzen.

## Entwickeln

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # Produktions-Build nach dist/
npm run check-data   # prüft Rezeptdatenbank, Produkte & Einheiten
npx vite-node scripts/test-kitchen.ts   # Logiktests Vorrat/Einkauf/Empfehlungen
npx vite-node scripts/test-breakfast.ts # Logiktests Frühstück/Meal-Prep
npx vite-node scripts/test-leftovers.ts # Logiktests Reste/Vorrat/Frische
npx vite-node scripts/test-energy.ts    # Logiktests Kalorienbedarf/Portionen
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
Neue Zutaten müssen in `src/data/catalog.ts` einer Einkaufslisten-Kategorie zugeordnet und (außer Gewürzen) in `src/data/products.ts` mit Packung, Preis und Haltbarkeit eingetragen werden. `npm run check-data` meldet fehlende Einträge.

## Fotos

Die Fotos stammen von **Wikimedia Commons** und stehen unter freien Lizenzen (CC0, CC BY, CC BY-SA). Urheber und Lizenz stehen in der Rezeptansicht unter dem Rezept und in `src/data/images.json`.

```bash
npx vite-node scripts/dump-recipes.ts > /tmp/recipes.json
YAMI_UA='YamiRecipeApp/0.1 (deine@mail.de)' python3 scripts/fetch_images.py /tmp/recipes.json   # fehlende Fotos laden (Wikimedia verlangt Kontaktangabe)
python3 scripts/fetch_images.py /tmp/recipes.json --only lasagne --force   # einzelnes Foto neu suchen
```

Für ein bestimmtes Foto trägst du in `scripts/image-overrides.json` den Commons-Dateinamen ein, z. B. `{ "lasagne": "File:Lasagne - stonesoup.jpg" }`. Eigene Fotos legst du als `public/img/<id>.webp` (4:3) ab und trägst sie in `images.json` ein.
