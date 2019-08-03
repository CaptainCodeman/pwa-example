const { generateSW } = require('workbox-build');
const { resolve } = require('path');

const swDest = resolve('public/sw.js')

console.log('building service worker', swDest);

generateSW({
  swDest,
  globDirectory: 'public',
  globPatterns: [
    'index.html',
    'manifest.json',
    'static/**/*.js',
  ],
  cacheId: 'mwc-test',
  skipWaiting: true,
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
    urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
    handler: 'CacheFirst',
    options: {
      cacheName: 'fonts',
    },
  }, {
    urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\//,
    handler: 'CacheFirst',
    options: {
      cacheName: 'cdnjs',
    },
  }],
  offlineGoogleAnalytics: false,
  cleanupOutdatedCaches: true,
  navigationPreload: false,
  sourcemap: false,
})
.then(({ count, size }) => {
  console.log(`Generated ${swDest}, which will precache ${count} files, totaling ${size} bytes.`);
})
.catch((err) => {
  console.error(`Unable to generate a new service worker.`, err);
})
