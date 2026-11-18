# Offene Aufgaben (Stand 18.11.2026)

Diese Datei hält fest, was gerade in Arbeit ist, falls eine Sitzung abbricht.

1. **Familien-Sync über Home Assistant** (in Arbeit, WIP-Commit auf `ccr-6dc9e961-0v6pve`, NICHT auf main):
   - Transport: Local To-do `todo.yami_sync` (in HA angelegt, getestet).
   - Geteilt: Abendessen-Plan, Vorrat, Einkauf (Haken), eigene Rezepte, Bewertungen/Wischen pro Person. Persönlich: Profil, Kalorien, Wiegen, Frühstück.
   - Lernen pro Person + gemeinsam („mögt ihr beide“, „Lisa mag das“); Konflikte: zuletzt gewinnt + Hinweis mit Rückgängig.
   - Pflicht: Was Lisa plant, landet sicher in Google Tasks `todo.einkaufen` und im Kalender `calendar.familie` (spätestens wenn Marc die App öffnet), ohne Duplikate (geteilte uid-Zuordnung + Sperre in yami_sync).
   - Zweite Person: kein „Profil anlegen“ im Start; Hinweis „mit jemandem zusammen nutzen → HA verbinden“.
   - Test: scripts/test-sync.ts; danach alle Prüfungen (CLAUDE.md) + e2e.
2. **Backen einplanen** (nach dem Sync): eigene Zeile „🍰 Backen: …“ pro Tag (mehrere möglich), Zutaten auf die Einkaufsliste, am Folgetag nachfragen „Gebacken?“ (Ja → Vorrat + abziehen + Bewertung, Nein → verschieben/entfernen), sanfte Vorschläge (z. B. Brötchen alle → Samstag backen; Plätzchen im Advent), lernen; Back-Plan ist geteilt (Sync).
3. **Fotos**: 38 Rezepte brauchen Gemini-Bilder (Liste: scripts/gemini-fehlen.md, ids: scripts/fotos-fehlen.txt). Ablauf: Bilder nach ~/Desktop/yami-ki → `python3 scripts/add_ai_images.py ~/Desktop/yami-ki` → push auf Zweig `fruehstueck-fotos` → prüfen und mergen.
4. Nach dem Sync: Anleitung für Lisa (iPhone: Safari → Zum Home-Bildschirm; HA-Token in ihrem Profil erstellen; „Familie teilen“ an, „Lisa“ wählen).
