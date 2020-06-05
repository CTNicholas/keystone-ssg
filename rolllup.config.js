import babel from '@rollup/plugin-babel';
import pkg from './package.json';
console.log('hello pls')
const config = {
  input: 'src/index.js',
  output: {
    dir: 'output',
    format: 'esm'
  },
  plugins: [babel({ babelHelpers: 'bundled' })]
};

export default config;