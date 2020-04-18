const babel = require('rollup-plugin-babel');
const cjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const pkg = require('./package.json');

export default {
  input: 'lib/index.js',
  plugins: [
    resolve({ browser: true }),
    cjs(),
    babel({
      exclude: 'node_modules/**',
    }),
    terser({
      sourcemap: false,
    }),
  ],
  output: [
    {
      file: pkg.main,
      format: 'iife',
      name: 'apipie',
    },
    {
      file: pkg.cjs,
      format: 'cjs',
      name: 'apipie',
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],
};
