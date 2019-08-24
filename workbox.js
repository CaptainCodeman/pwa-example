const { generateSW } = require('workbox-build');
const { resolve } = require('path');

const swDest = resolve('public/sw.js')

console.log('building service worker', swDest);

generateSW({
  swDest,
  globDirectory: 'public',
  globPatterns: [
    'index.html',
    'index.webmanifest',
    'static/**/*.js',
  ],
  cacheId: 'pwa-example',
  skipWaiting: false,
  clientsClaim: true,
  navigateFallback: '/index.html',
  navigateFallbackBlacklist: [
    /^\/sitemap\.xml/,
  ],
  runtimeCaching: [{
    urlPattern: /\/static\//,
    handler: 'CacheFirst',
    options: {
      cacheName: 'static',
    },
  }, {
    urlPattern: /^https:\/\/\w+\.gstatic\.com\//,
    handler: 'CacheFirst',
    options: {
      cacheName: 'gstatic',
    },
  }, {
    urlPattern: /^https:\/\/(fonts|storage)\.googleapis\.com\//,
    handler: 'CacheFirst',
    options: {
      cacheName: 'googleapis',
    },
  }, {
    urlPattern: /^https:\/\/cdn\.jsdelivr\.net\//,
    handler: 'CacheFirst',
    options: {
      cacheName: 'cdnjs',
    },
  }],
  offlineGoogleAnalytics: true,
  cleanupOutdatedCaches: true,
  navigationPreload: false,
  sourcemap: true,
})
.then(({ count, size }) => {
  console.log(`Generated ${swDest}, which will precache ${count} files, totaling ${size} bytes.`);
})
.catch((err) => {
  console.error(`Unable to generate a new service worker.`, err);
})
