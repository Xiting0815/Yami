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
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Yami – Wochenplaner',
        short_name: 'Yami',
        description: 'Wochenplan per Wischen und sortierte Einkaufsliste',
        lang: 'de',
        theme_color: '#e8572a',
        background_color: '#fff8f2',
        display: 'standalone',
        start_url: './',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webp,jpg,json}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
})
