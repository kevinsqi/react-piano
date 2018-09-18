import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import sourceMaps from 'rollup-plugin-sourcemaps';
import pkg from './package.json';

const input = 'src/index.js';
const external = ['react'];

const plugins = [
  nodeResolve(),
  replace({
    exclude: 'node_modules/**',
    // Set correct NODE_ENV for React
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  }),
  babel({
    exclude: ['node_nodules/**'],
  }),
  commonjs(),
  sourceMaps(),
  filesize(),
];

export default [
  // UMD
  {
    input,
    external,
    output: [
      {
        file: pkg.unpkg,
        format: 'umd',
        sourcemap: true,
        name: 'ReactPiano',
        globals: {
          react: 'React',
        },
      },
    ],
    plugins,
  },
  {
    input,
    external: external.concat(Object.keys(pkg.dependencies)),
    output: [
      // ES module
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
      },
      // CommonJS
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins,
  },
];
