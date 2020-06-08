const babel = require('@rollup/plugin-babel')
const scss = require('rollup-plugin-scss')

module.exports = function (result) {
  return [
    babel.babel({
      babelHelpers: 'bundled',
      minified: true,
      presets: ['@babel/preset-env']
    }),
    scss({
      outputStyle: 'compressed',
      output (styles) {
        result({ code: styles, fileExt: '.css' })
      }
    })
  ]
}