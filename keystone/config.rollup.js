const { nodeResolve } = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const babel = require('@rollup/plugin-babel')
const scss = require('rollup-plugin-scss')
const terser  = require('rollup-plugin-terser')

module.exports = function (result) {
  return [
    nodeResolve(),
    commonjs(),
    babel.babel({
      babelHelpers: 'bundled',
      minified: true,
      compact: true,
      presets: ['@babel/preset-env']
    }),
    scss({
      outputStyle: 'compressed',
      output (styles) {
        result({ code: styles, fileExt: '.css' })
      }
    }),
    terser.terser()
  ]
}
