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
