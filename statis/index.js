const getEnv = (argKey, envKey) => {
  return (
    process.env[envKey] ||
    (process.argv.find(x => x.startsWith(argKey)) || '').replace(argKey, '')
  )
}

const DEV_SERVER = process.argv.includes('--dev')

console.log('Dev?', DEV_SERVER)

const runBuild = require('./run-build.js')
runBuild()

if (DEV_SERVER) {
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
