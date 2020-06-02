const getEnv = (argKey, envKey) => {
  return (
    process.env[envKey] ||
    (process.argv.find(x => x.startsWith(argKey)) || '').replace(argKey, '')
  )
}

// console.log(module.children)
console.log(Object.keys(require.cache))

const state = require('./state.js')
const runBuild = require('./run-build.js')

if (process.argv.includes('--dev')) {
  state.mode = 'dev'
} else {
  state.mode = 'build'
}
console.log('Mode?', state.mode)

console.log(module)
// console.log(Object.keys(require.cache))

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

const inputOptions = {
  input: 'testing/testimport.js'
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

build().then(bundle => console.log(bundle.output)).catch(console.log)

*/
