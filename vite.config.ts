import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // Auto-update the service worker in the background; no update prompt UI
      // needed for the demo.
      registerType: 'autoUpdate',
      // Precache the built app shell + static assets so TALAS loads with no
      // network. App data lives in IndexedDB, not the SW cache.
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        // The Vosk WASM chunk is several MB; allow precaching larger files.
        maximumFileSizeToCacheInBytes: 12 * 1024 * 1024,
        // Runtime-cache the (large) offline Vosk speech model on first use so
        // oral reading recognition works offline afterwards. Kept out of the
        // precache so the app shell stays small and installs fast.
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/models/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'talas-speech-models',
              expiration: { maxEntries: 4 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'TALAS',
        short_name: 'TALAS',
        description: 'TALAS learning platform — works offline.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      // Let the SW serve index.html for client-side routes while offline.
      devOptions: {
        enabled: false,
      },
    }),
  ],
})
