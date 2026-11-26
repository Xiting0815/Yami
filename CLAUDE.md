# Yami – Hinweise für Claude

## Was dem Nutzer wichtig ist

- **Lernfähigkeit hat immer Priorität.** Die App soll aus dem Verhalten des Nutzers lernen (was gewählt, weggewischt, gekocht, bewertet, gekauft wird) und Vorschläge daran anpassen. Bei jeder neuen Funktion prüfen: Was kann die App hier lernen, statt es fest einzustellen oder abzufragen?
- Erst alle relevanten Fragen stellen (bis ca. 90 % Klarheit), dann umsetzen.
- Ziele: abnehmen, Lebensmittel sparen, günstig einkaufen, abwechslungsreich essen.
- Haushalt: 2 Personen, deftig deutsch / italienisch / chinesisch, fast nie vegetarisch (ca. 15 %).
- Alltag: Meal-Prep sonntags, Frühstück auf der Arbeit (Kühlschrank + Mikrowelle), Mittagessen wird nicht geplant (Pauschale), Sa/So ohne Tagesbilanz.
- Geräte: Android-Handy (Chrome, als PWA installiert), MacBook, Körperfettwaage, Home Assistant.
- Der Nutzer ist kein Entwickler: Terminal-Befehle einzeln und Schritt für Schritt erklären. Antworten auf Deutsch, UI-Texte auf Deutsch.

## Projekt

- Vite + React + TypeScript, kein UI-Framework, Styles in `src/styles.css`, Zustand lokal in `localStorage` (`src/store.ts`).
- Vor jedem Commit: `npx tsc -b`, `npm run check-data`, `npx vite-node scripts/test-*.ts` (kitchen, breakfast, leftovers, energy, progress, learning, season, backup, protein, cook, review, custom, ha, pantry, staples, scenario, devices, done, basic, backen, sync, bakeplan, trips, bbq, spanien, search), `npx vite build`.
- Lernen: `src/learning.ts` (Signale: Wischen, gekocht, Bewertung; Muster nach Küche/Art/Hauptzutat/Zeit). Neue Funktionen dort anbinden, wenn sie etwas über Vorlieben verraten.
- Ein Push auf `main` veröffentlicht automatisch auf GitHub Pages (https://xiting0815.github.io/Yami/) – nur geprüften Stand pushen.
- Rezepte/Zutaten: jede Zutat braucht Kategorie (`catalog.ts`), Produkt mit Packung/Preis/Haltbarkeit (`products.ts`) und Nährwerte (`nutrition.ts`).

## Geplante Erweiterungen (vom Nutzer bestätigt)

Erledigt: lernende Vorschläge (ohne Favoriten/„nie wieder“ – vom Nutzer so gewählt) · Saison · eigene Rezepte · Eiweißziel · Wochenrückblick · Kochmodus · Datensicherung · Home Assistant (Einkaufsliste Google Tasks todo.einkaufen, Abendessen im Google-Kalender calendar.familie 18:30–19:30, Erinnerungen calendar.yami_erinnerungen + Automation „Yami: Erinnerung aufs Handy“; nur WebSocket-API, Token bleibt lokal). Offen: Körperfettwaage in HA (keine Entitäten vorhanden).
