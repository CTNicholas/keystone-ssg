const getEnv = (argKey, envKey) => {
  return (
    process.env[envKey] ||
    (process.argv.find(x => x.startsWith(argKey)) || '').replace(argKey, '')
  )
}

const state = require('./state.js')
const runBuild = require('./run-build.js')

if (process.argv.includes('--dev')) {
  state.mode = 'dev'
} else {
  state.mode = 'build'
}
console.log('Mode?', state.mode)

runBuild()

if (state.mode === 'dev') {
  require('./run-dev.js')
}

/*
var sass = require('node-sass')

var result = sass.renderSync({
  file: './templates/test.scss',
  outFile: './templates/test.css',
  outputStyle: 'compressed'
})

// console.log(result.css)

var fs = require('fs')

fs.writeFile('./templates/test.css', result.css, function (err) {
  if (err) throw err
  console.log('Saved!')
})
*/
/*
const rollup = require('rollup')
const babel = require('@rollup/plugin-babel')
const buble = require('@rollup/plugin-buble')
const scss = require('rollup-plugin-scss')

// const fs = require('fs-extra')
// const fil = fs.readFileSync('components/testindex.js', 'utf-8')
// console.log('FILE:', babel.babel, 'BUBLE', buble, fil)

let theCss
const inputOptions = {
  input: 'components/style.scss',
  plugins: [
    babel.babel({
      babelHelpers: 'bundled',
      minified: true,
      presets: ['@babel/preset-env']
    }),
    scss({
      outputStyle: 'compressed',
      output (styles) {
        theCss = styles
      }
    })
  ]
}

const outputOptions = {
  format: 'umd',
  name: 'statis'
}

async function build () {
  // create a bundle
  try {
    const bundle = await rollup.rollup(inputOptions)
    return bundle.generate(outputOptions)
  } catch (err) {
    if (err) throw err
    console.log('err')
  }
}

build().then(bundle => {
  console.log(bundle.output[0])
  console.log(bundle.output[0].code)
  console.log('STYLE', theCss)
}).catch(console.log)
*/
