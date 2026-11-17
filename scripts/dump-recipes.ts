// Gibt id/Titel/Bild-Suchbegriff als JSON aus (Eingabe für fetch_images.py); Backen & Desserts: img = imageQueries aus src/data/extra
import { RAW_BASICS, RAW_BREAKFASTS, RAW_RECIPES } from '../src/data/recipes'
console.log(JSON.stringify([...RAW_RECIPES, ...RAW_BREAKFASTS, ...RAW_BASICS].map((r) => ({ id: r.id, title: r.title, img: r.img ?? r.title, cuisine: r.cuisine, ...(r.kind ? { kind: r.kind } : {}) }))))
