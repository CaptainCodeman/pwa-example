'use strict';

import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import typescript from 'rollup-plugin-typescript';
import { terser } from 'rollup-plugin-terser';

// assume production mode for normal build, dev if watched
// flag is used to enable / disable HTML & JS minification
const production = !process.env.ROLLUP_WATCH;

export default {
  input: [
    'src/app.ts',
    'src/lazy.ts',
  ],
  output: {
    dir: 'public/static',
    format: 'esm',
    name: 'App',
    sourcemap: true,
    entryFileNames: '[name].min.js',
    chunkFileNames: 'common.min.js',
  },
  plugins: [
    resolve(),
    commonjs(),
    production && minifyHTML(),
    typescript({ typescript: require('typescript') }),
    production && terser(),
  ],
  preserveSymlinks: true,
}
