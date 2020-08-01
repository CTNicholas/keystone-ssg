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
      compact: true,
      comments: false
    }
    scssOtherOptions = {
      outputStyle: 'compressed'
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
      ...scssOtherOptions,
      output (styles, v1, v2, v3) {
        result({ code: styles, fileExt: '.css' })
      }
    }),
    ...otherOptions
  ]
}
