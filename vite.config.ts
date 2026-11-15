import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          'mui-core': ['@mui/material', '@emotion/react', '@emotion/styled'],
          'mui-icons': ['@mui/icons-material'],
          'react-core': ['react', 'react-dom', 'react-router-dom'],
          // framer-motion drives animation on the portfolio itself, so it gets
          // its own chunk. Left inside fieldflow-vendor it would drag recharts
          // and dayjs onto the home page for no reason.
          'motion': ['framer-motion'],
          'fieldflow-vendor': ['zustand', 'dayjs', 'recharts'],
        },
      },
    },
  },
  plugins: [
    {
      // In dev, Vite answers any folder URL with the portfolio's index.html. Serve the Storybook and the gallery's own index instead.
      name: 'static-app-index',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url && /^\/(pulse-storybook|pulse-gallery)\/?(\?.*)?$/.test(req.url)) req.url = req.url.replace(/^(\/[^/?]+)\/?/, '$1/index.html');
          next();
        });
      },
    },
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'FieldFlow – Field Worker Task Management',
        short_name: 'FieldFlow',
        description: 'Offline-first field worker task management. Work clearly. Prove completion.',
        theme_color: '#2457D6',
        background_color: '#F7F8FC',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/field-flow/',
        start_url: '/field-flow/',
        icons: [
          {
            src: '/icons/fieldflow-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icons/fieldflow-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024, // 8 MB — portfolio has large screenshots
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // The PULSE gallery is a separate static app under /pulse-gallery/. It must not be precached
        // (7.6 MB) and navigations to it must reach the gallery, not the portfolio's index.html.
        globIgnores: ['pulse-gallery/**', 'pulse-storybook/**'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/, /^\/pulse-gallery(\/|$)/, /^\/pulse-storybook(\/|$)/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
});
