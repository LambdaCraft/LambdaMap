import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import { terser } from 'rollup-plugin-terser'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

import * as react from 'react';
import * as reactDom from 'react-dom';
import * as reactIs from 'react-is';

const configBabel = () => babel()


// Fix problem with CJS detection of named imports in certain libs
const configCommonJS = () => commonjs({
  namedExports: {
    react: Object.keys(react),
    'react-dom': Object.keys(reactDom),
    'react-is': Object.keys(reactIs),
  }
})

// Inject environment for libraries that query it 
const configReplace = () => replace({
  'process.env.NODE_ENV': JSON.stringify(process.env.BUILD)
})

const umdConfig = {
  input: 'src/index.umd.js',
  external: [
    'react', 
    'react-dom',
    'leaflet'
  ],
  plugins: [
    configReplace(),
    resolve(),
    configBabel(),
    configCommonJS(),
    ...(process.env.BUILD === 'production' ? [
      terser()
    ] : [
      serve(),
      livereload(),
    ]),

  ],
  output: {
    file: 'lib/bundle.umd.js',
    format: 'umd',
    name: 'LambdaMap',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      leaflet: 'L'
    },
  }
}

const cjsConfig = {
  input: 'src/index.js',
  external: [
    'react', 
    'leaflet'
  ],
  plugins: [
    configReplace(),
    resolve(),
    configBabel(),
    configCommonJS(),
  ],
  output: {
    file: 'lib/bundle.cjs.js',
    format: 'cjs',
  }
}

export default process.env.BUILD === 'production' ? [umdConfig] : [umdConfig]