const buble = require('rollup-plugin-buble');
const cjs = require('rollup-plugin-commonjs');
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

let pkg = require('./package.json');
let external = Object.keys(pkg.dependencies);

export default {
  entry: 'lib/index.js',
  plugins: [
    buble(),
    cjs(),
    resolve(),
    uglify(),
  ],
  //external: external,
  // globals: {
  //   'path-to-regexp': 'pathToRegexp',
  //   deepmerge: 'merge'
  // },
  targets: [
    {
      dest: pkg.main,
      format: 'iife',
      moduleName: 'apipie',
      sourceMap: false,
    },
    {
      dest: pkg.cjs,
      format: 'cjs',
      moduleName: 'apipie',
      sourceMap: false,
    },
    {
      dest: pkg.module,
      format: 'es',
      sourceMap: false,
    }
  ]
};
