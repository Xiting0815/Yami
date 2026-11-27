import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// base: './' damit die App auch unter einem Unterpfad (z. B. GitHub Pages) läuft
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      output: {
        // eigene Dateien für React und die Rezeptdaten: ändert sich nur der App-Code (oder nur ein Rezept),
        // lädt ein Update nur diese Datei neu – der Rest bleibt im Speicher des Handys
        manualChunks(id) {
          if (id.includes('/node_modules/react') || id.includes('/node_modules/scheduler')) return 'react'
          if (id.includes('/src/data/')) return 'rezepte'
        },
      },
    },
    // die Rezeptdaten sind eine große Datei (ganz bewusst: offline alles da)
    chunkSizeWarningLimit: 1800,
  },
  plugins: [
    react(),
    VitePWA({
      // „prompt“: neue Version wartet, bis der Nutzer „Neu laden“ tippt (src/app/UpdateBanner.tsx) –
      // kein Neuladen mitten im Kochmodus; nach komplettem Schließen der App ist sie ohnehin aktiv
      registerType: 'prompt',
      includeAssets: ['icon.svg', 'favicon-32.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Gusto – Rezepte & Wochenplan',
        short_name: 'Gusto',
        description: 'Abwechslungsreich und saisonal kochen, Vorrat aufbrauchen, günstig einkaufen – mit Original-Rezepten',
        lang: 'de',
        theme_color: '#c65a3a',
        background_color: '#fff3e6',
        display: 'standalone',
        start_url: './',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // neue Version übernimmt nach „Neu laden“ sofort alle offenen Fenster
        clientsClaim: true,
        // vorab gespeichert (offline sofort da): App-Code, Styles, Rezeptdaten, Symbole – aber NICHT die Rezeptbilder
        // (sonst lädt die Installation bzw. jedes Update über 11 MB Fotos herunter)
        globPatterns: ['**/*.{js,css,html,svg,png,webp,jpg,json}'],
        globIgnores: ['img/**'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        runtimeCaching: [
          {
            // Rezeptbilder erst beim Ansehen speichern – danach offline verfügbar (CacheFirst), die ältesten fliegen raus
            urlPattern: ({ url, sameOrigin }) => sameOrigin && /\/img\/[^/]+\.(?:webp|jpe?g|png)$/.test(url.pathname),
            handler: 'CacheFirst',
            options: {
              cacheName: 'gusto-bilder',
              expiration: { maxEntries: 800, maxAgeSeconds: 180 * 24 * 60 * 60, purgeOnQuotaError: true },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
})
