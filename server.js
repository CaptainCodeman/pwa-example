const browserSync = require('browser-sync').create();
const historyApiFallback = require('connect-history-api-fallback');
const logger = require('connect-logger');
const compression = require('compression');
const zlib = require('zlib')

browserSync.init({
  cwd: 'public',
  server: {
    baseDir: 'public',
    index: "index.html",
  },
  files: [
    'static/**',
    'index.html',
  ],
  middleware: [
    logger(),
    compression({ level: zlib.Z_BEST_COMPRESSION }),
    historyApiFallback(),
  ],
});
