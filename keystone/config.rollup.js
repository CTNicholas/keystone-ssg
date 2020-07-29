const { nodeResolve } = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const babel = require('@rollup/plugin-babel')
const scss = require('rollup-plugin-scss')
const terser  = require('rollup-plugin-terser')



module.exports = function (result, state) {

  let otherOptions = []
  let babelOtherOptions = {}
  let scssOtherOptions = {}

  if (state.mode === 'dev') {
    babelOtherOptions = {
      minified: false,
      compact: false
    }
    scssOtherOptions = {
      sourceMap: true,
      sourceMapContents: true,
      sourceMapEmbed: true
    }
  } 
  
  if (state.mode !== 'dev') {
    otherOptions = [
      terser.terser()
    ]
    babelOtherOptions = {
      minified: true,
      compact: true
    }
  }

  return [
    nodeResolve(),
    commonjs(),
    babel.babel({
      babelHelpers: 'bundled',
      ...babelOtherOptions,
      presets: ['@babel/preset-env']
    }),
    scss({
      outputStyle: 'compressed',
      ...scssOtherOptions,
      output (styles) {
        result({ code: styles, fileExt: '.css' })
      }
    }),
    ...otherOptions
  ]
}
