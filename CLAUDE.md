# Gusto – Hinweise für Claude

Die App heißt **Gusto** (früher „Yami“). Repo, URL (/Yami/) und interne Schlüssel (`yami-state-v1`, Sync-Präfix `yami:v1:`, HA-Entitäten wie `todo.yami_sync`, `calendar.yami_erinnerungen`, Markierung „Yami“ in Google Tasks, Kennung `app: 'yami'` in Sicherungen) heißen weiter so – nicht umbenennen, sonst brechen Daten und Abgleich.

## Was dem Nutzer wichtig ist

- **Lernfähigkeit hat immer Priorität.** Die App soll aus dem Verhalten des Nutzers lernen (was gewählt, weggewischt, gekocht, bewertet, gekauft wird) und Vorschläge daran anpassen. Bei jeder neuen Funktion prüfen: Was kann die App hier lernen, statt es fest einzustellen oder abzufragen?
- Erst alle relevanten Fragen stellen (bis ca. 90 % Klarheit), dann umsetzen.
- Gusto ist eine Rezept- und Planungs-App. Ziele: Abwechslung, Saisonalität, weniger Lebensmittel wegwerfen, günstig einkaufen, authentische Original-Rezepte. **Kein Abnehmen**: keine Kalorien/Nährwerte in der Oberfläche, kein Kalorienziel, kein Wiegen, keine „Leichter“-Tipps.
- Haushalt: 2 Personen, deftig deutsch / italienisch / chinesisch, fast nie vegetarisch (ca. 15 %).
- Alltag: Meal-Prep sonntags, Frühstück auf der Arbeit (Kühlschrank + Mikrowelle), Mittagessen wird nicht geplant. Portionen: Standard = Haushalt (2), lernend über „zu wenig/passt/zu viel“.
- Geräte: Android-Handy (Chrome, als PWA installiert), MacBook, Home Assistant.
- Der Nutzer ist kein Entwickler: Terminal-Befehle einzeln und Schritt für Schritt erklären. Antworten auf Deutsch, UI-Texte auf Deutsch.

## Projekt

- Vite + React + TypeScript, kein UI-Framework, Styles in `src/styles.css`, Zustand lokal in `localStorage` (`src/store.ts`).
- Vor jedem Commit: `npx tsc -b`, `npm run check-data`, `npx vite-node scripts/test-*.ts` (kitchen, breakfast, leftovers, learning, season, backup, cook, review, custom, ha, pantry, staples, scenario, devices, done, basic, backen, sync, bakeplan, trips, bbq, spanien, search), `npx vite build`.
- Lernen: `src/learning.ts` (Signale: Wischen, gekocht, Bewertung; Muster nach Küche/Art/Hauptzutat/Zeit). Neue Funktionen dort anbinden, wenn sie etwas über Vorlieben verraten.
- Ein Push auf `main` veröffentlicht automatisch auf GitHub Pages (https://xiting0815.github.io/Yami/) – nur geprüften Stand pushen.
- Rezepte/Zutaten: jede Zutat braucht Kategorie (`catalog.ts`), Produkt mit Packung/Preis/Haltbarkeit (`products.ts`) und Nährwerte (`nutrition.ts` – nur intern, z. B. Frühstücks-Sättigung; nie anzeigen).
- Logo: `src/components/Logo.tsx` = `public/icon.svg` (Kochtopf in Terrakotta mit Kraut-Blatt); PNG-Icons in `public/` sind daraus gerendert.

## Geplante Erweiterungen (vom Nutzer bestätigt)

Erledigt: lernende Vorschläge (ohne Favoriten/„nie wieder“ – vom Nutzer so gewählt) · Saison · eigene Rezepte · Wochenrückblick · Kochmodus · Datensicherung · Home Assistant (Einkaufsliste Google Tasks todo.einkaufen, Abendessen im Google-Kalender calendar.familie 18:30–19:30, Erinnerungen calendar.yami_erinnerungen + Automation „Yami: Erinnerung aufs Handy“; nur WebSocket-API, Token bleibt lokal). Entfernt (Nutzer-Entscheidung „Gusto“): Kalorienziel/Profil, Tagesbilanz, Eiweißziel, Wiegen & Fortschritt, Wiege-Erinnerung.
