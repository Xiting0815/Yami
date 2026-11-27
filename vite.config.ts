import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// base: './' damit die App auch unter einem Unterpfad (z. B. GitHub Pages) läuft
export default defineConfig({
  base: './',
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
        globPatterns: ['**/*.{js,css,html,svg,png,webp,jpg,json}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
})
